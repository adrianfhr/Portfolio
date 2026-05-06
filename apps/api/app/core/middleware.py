import time
import uuid
from typing import Any

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint

from app.core.config import settings
from app.core.exceptions import AppException, RateLimitExceeded
from app.core.rate_limiter import RateLimiter
from app.dependencies import get_current_user_or_guest


class LoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> JSONResponse:
        trace_id = str(uuid.uuid4())
        request.state.trace_id = trace_id
        start = time.time()

        response = await call_next(request)

        duration = time.time() - start
        response.headers["X-Trace-Id"] = trace_id

        # Simple structured log line (can be enhanced with structlog later)
        print(
            f'{{"event":"request","trace_id":"{trace_id}","method":"{request.method}",'
            f'"path":"{request.url.path}","status":{response.status_code},"duration_ms":{duration*1000:.2f}}}'
        )

        return response


class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: Any) -> None:
        super().__init__(app)
        self._limiter = RateLimiter()

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint) -> JSONResponse:
        # Skip rate limiting for exempt paths
        if request.url.path in ("/health", "/health/ready", "/health/live", "/docs", "/openapi.json"):
            return await call_next(request)

        user = await get_current_user_or_guest(request)
        tier = user.get("role", "guest")

        if user["type"] == "user":
            identifier = f"user:{user['id']}"
        elif user["type"] == "guest":
            identifier = f"guest:{user['guest_id']}"
        else:
            ip = request.client.host if request.client else "unknown"
            identifier = f"anon:{ip}"

        try:
            allowed, headers = await self._limiter.is_allowed(identifier, tier)
        except RateLimitExceeded as exc:
            return JSONResponse(
                status_code=429,
                content={
                    "error": {
                        "code": exc.code,
                        "message": exc.message,
                        "details": exc.details,
                    }
                },
                headers={"Retry-After": str(exc.retry_after)},
            )

        response = await call_next(request)
        for key, value in headers.items():
            response.headers[key] = value

        return response
