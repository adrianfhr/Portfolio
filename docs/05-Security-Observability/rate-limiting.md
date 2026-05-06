# Rate Limiting

> **Scope:** Quota enforcement and traffic shaping  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

Rate limiting protects the API from abuse and controls the demo cost envelope. The system uses a Redis-backed sliding window so limits feel smoother than a strict token bucket while still being easy to reason about.

## 2. Algorithm

### 2.1 Sliding Window

- Store request timestamps in Redis per identifier.
- Remove timestamps outside the current window.
- Count the remaining events and reject requests when the limit is exceeded.

### 2.2 Identifiers

- Guest: signed guest ID.
- Developer: user ID from JWT.
- Admin: exempt or effectively unlimited, depending on deployment policy.

## 3. Limits

| Tier | Limit | Window | Identifier |
|---|---|---|---|
| Guest | 20 requests | 24 hours | guest_id |
| Developer | 200 requests | 24 hours | user_id |
| Admin | Unlimited | - | user_id + role |

## 4. Response Headers

- `X-RateLimit-Limit`
- `X-RateLimit-Remaining`
- `X-RateLimit-Reset`
- `X-RateLimit-Policy`
- `Retry-After` on `429`

## 5. Enforcement Rules

- Apply limiting to all API routes unless explicitly exempted.
- Keep the policy consistent across sync, SSE, and webhook-like interactions.
- Do not let the explorer bypass normal quotas.

## 6. Failure Behavior

- If Redis is down, degrade to a weaker in-memory fallback.
- Log the fallback path as a warning.
- Never silently disable the control entirely.

## 7. Cross-References

- [Authentication Strategy](auth-strategy.md)
- [Abuse Prevention](abuse-prevention.md)
- [API Explorer](../03-Core-AI-Modules/API-Explorer/PRD/prd.md)