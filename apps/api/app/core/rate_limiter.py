import time
from typing import Any

from app.core.config import settings
from app.core.exceptions import RateLimitExceeded

# In-memory fallback storage
_in_memory_store: dict[str, list[float]] = {}

TIER_LIMITS = {
    "guest": {"limit": 20, "window": 86400},
    "developer": {"limit": 200, "window": 86400},
    "admin": {"limit": None, "window": 86400},
}

HEADERS = {
    "limit": "X-RateLimit-Limit",
    "remaining": "X-RateLimit-Remaining",
    "reset": "X-RateLimit-Reset",
    "policy": "X-RateLimit-Policy",
}


class RateLimiter:
    def __init__(self, redis_client=None) -> None:
        self._redis = redis_client
        self._fallback = False

    async def _get_redis(self):
        if self._redis is None and not self._fallback:
            try:
                from app.infra.redis_client import get_redis

                self._redis = await get_redis()
                await self._redis.ping()
            except Exception:
                self._fallback = True
        return self._redis

    async def is_allowed(self, identifier: str, tier: str = "guest") -> tuple[bool, dict[str, Any]]:
        if tier == "admin":
            return True, self._headers(tier, 0, 0)

        config = TIER_LIMITS.get(tier, TIER_LIMITS["guest"])
        limit = config["limit"]
        window = config["window"]
        now = time.time()
        window_start = now - window

        redis_client = await self._get_redis()

        if redis_client and not self._fallback:
            try:
                return await self._check_redis(redis_client, identifier, limit, window, now, window_start, tier)
            except Exception:
                self._fallback = True

        return self._check_memory(identifier, limit, window, now, window_start, tier)

    async def _check_redis(
        self, redis_client, identifier: str, limit: int, window: int, now: float, window_start: float, tier: str
    ) -> tuple[bool, dict[str, Any]]:
        key = f"rate_limit:{identifier}"
        pipe = redis_client.pipeline()
        pipe.zremrangebyscore(key, 0, window_start)
        pipe.zcard(key)
        pipe.zadd(key, {str(now): now})
        pipe.expire(key, window + 60)
        results = await pipe.execute()
        count = results[1]

        if count >= limit:
            await redis_client.zrem(key, str(now))
            retry_after = int(window - (now - window_start))
            raise RateLimitExceeded(
                message=f"{tier} tier limit of {limit} requests per {window // 3600}h exceeded.",
                retry_after=retry_after,
            )

        remaining = max(0, limit - count - 1)
        reset_at = int(now + window)
        return True, self._headers(tier, remaining, reset_at)

    def _check_memory(
        self, identifier: str, limit: int, window: int, now: float, window_start: float, tier: str
    ) -> tuple[bool, dict[str, Any]]:
        key = f"rate_limit:{identifier}"
        entries = _in_memory_store.get(key, [])
        entries = [ts for ts in entries if ts > window_start]
        entries.append(now)
        _in_memory_store[key] = entries

        if len(entries) > limit:
            retry_after = int(window - (now - window_start))
            raise RateLimitExceeded(
                message=f"{tier} tier limit of {limit} requests per {window // 3600}h exceeded. (fallback mode)",
                retry_after=retry_after,
            )

        remaining = max(0, limit - len(entries))
        reset_at = int(now + window)
        return True, self._headers(tier, remaining, reset_at)

    def _headers(self, tier: str, remaining: int, reset_at: int) -> dict[str, Any]:
        config = TIER_LIMITS.get(tier, TIER_LIMITS["guest"])
        limit = config["limit"]
        window_h = config["window"] // 3600
        policy = f"{tier}:{limit}/{window_h}h" if limit else f"{tier}:unlimited"
        return {
            HEADERS["limit"]: str(limit) if limit else "unlimited",
            HEADERS["remaining"]: str(remaining),
            HEADERS["reset"]: str(reset_at),
            HEADERS["policy"]: policy,
        }
