# Edge Cases — Authentication & Access Control Module

**Module ID:** AUTH-001  
**Version:** 1.0.0  
**Status:** Draft

---

## EC-001: VPN or IP Address Change

### Scenario
A guest user switches from corporate WiFi to mobile hotspot, causing their IP address to change mid-session.

### Impact
Guest ID is derived from IP + UA. IP change generates a new guest identity, effectively resetting the user's daily quota.

### Mitigation
1. Guest ID is bound to `localStorage` primary, IP hash secondary.
2. If `localStorage` contains a valid `guest_id` + `guest_signature`, reuse it regardless of IP change.
3. Signature validation prevents spoofing even if IP changes.
4. New guest ID is only generated if `localStorage` is empty or signature is invalid.

---

## EC-002: Brute-Force OAuth Login Attempts

### Scenario
An attacker repeatedly initiates GitHub OAuth flows or sends crafted callback URLs to probe for valid states.

### Impact
Resource exhaustion, Redis state pollution, potential OAuth token leakage.

### Mitigation
1. Exponential backoff on OAuth initiation from the same IP: after 5 attempts, require 10-second delay; after 10 attempts, 60-second delay.
2. Invalid `state` parameters on callback are logged and immediately rejected without GitHub API call.
3. Redis `oauth_state` keys have 10-minute TTL to prevent accumulation.
4. IP-based rate limiting on `/api/auth/github/initiate` (5 requests per minute).

---

## EC-003: Expired or Manipulated JWT

### Scenario
A user presents an expired JWT, a JWT with invalid signature, or a JWT that has been tampered with.

### Impact
Unauthorized access if validation is weak; poor UX if rejection is too harsh.

### Mitigation
1. Strict HS256 signature verification; reject any token with invalid signature (HTTP 401).
2. Explicit `exp` check against server clock with 60-second leeway for clock skew.
3. Check Redis denylist for logged-out tokens.
4. On HTTP 401, frontend silently demotes user to guest tier and generates new `guest_id`.

---

## EC-004: Redis Outage

### Scenario
Redis becomes unreachable due to network partition, overload, or maintenance.

### Impact
Rate limiting and quota tracking fail; system vulnerable to abuse.

### Mitigation
1. Detect Redis unavailability with 100ms connection timeout.
2. Fallback to in-memory `dict` per API process with 5-minute TTL on entries.
3. Conservative limits applied in fallback mode (50% of normal quota).
4. Log `WARN` event on every fallback decision.
5. Health check endpoint (`/health`) reports `redis: degraded` status.
6. Automatic recovery when Redis reconnects; in-memory counters flushed.

---

## EC-005: Guest ID Manipulation

### Scenario
A malicious user crafts a `guest_id` in `localStorage` to impersonate another guest or bypass quota.

### Impact
Quota theft, potential session hijacking between guests.

### Mitigation
1. `guest_signature` is HMAC-SHA256(`guest_id`, `JWT_SECRET`).
2. Server rejects any request where `guest_signature` does not match recomputed HMAC.
3. On signature mismatch, server issues a new guest identity and ignores the forged one.
4. Rate limiting key is based on server-validated identity, never client-provided ID alone.

---

## EC-006: Clock Skew Between Client and Server

### Scenario
Client clock is significantly ahead or behind server clock, causing JWT `exp` or `iat` mismatches.

### Impact
Premature session expiration or false "token from future" rejections.

### Mitigation
1. JWT validation allows 60-second leeway in both directions (`leeway=60`).
2. `X-RateLimit-Reset` header uses server Unix timestamp; clients must not compute reset time locally.
3. OAuth `state` TTL (10 minutes) is generous enough to tolerate minor clock skew.

---

## EC-007: OAuth State Reuse or Replay

### Scenario
An attacker intercepts a valid OAuth callback URL (with `code` and `state`) and replays it.

### Impact
Session fixation, potential account takeover if code is not yet exchanged.

### Mitigation
1. Redis `oauth_state` entry is deleted immediately upon successful callback validation (one-time use).
2. GitHub `code` is single-use; replayed codes are rejected by GitHub token endpoint.
3. `state` parameter is 32 bytes of CSPRNG entropy; brute-force in 10-minute window is infeasible.

---

## EC-008: Cookie Theft via XSS

### Scenario
A cross-site scripting vulnerability in another part of the application allows an attacker to steal cookies.

### Impact
Session hijacking, unauthorized API access.

### Mitigation
1. JWT cookie is `HttpOnly`; JavaScript cannot access it.
2. `localStorage` mirrors JWT for UX purposes but is NOT accepted by API for sensitive operations (cookie-only for write operations).
3. Content Security Policy (CSP) headers restrict inline scripts.
4. Input sanitization on all user-facing fields (covered by other modules).

---

## EC-009: Quota Race Condition

### Scenario
Two concurrent requests from the same guest arrive simultaneously at different API instances.

### Impact
Both requests pass rate limit check because counters are not yet incremented; quota overshoot.

### Mitigation
1. Redis `MULTI` / `EXEC` transaction atomically checks count and adds timestamp.
2. Lua script for atomic check-increment on rate limit counter.
3. In fallback mode, per-process locking (`asyncio.Lock`) prevents local race conditions.
4. Acceptable overshoot in fallback mode: maximum 2 extra requests per process instance.

---

## EC-010: Concurrent Login from Multiple Devices

### Scenario
A developer logs in on both laptop and mobile simultaneously.

### Impact
Multiple valid JWTs for same user; quota counters must remain consistent.

### Mitigation
1. Quota counters are keyed by `user_id`, not by session or device.
2. Daily quota is shared across all devices for the same user.
3. Logout on one device does NOT invalidate sessions on other devices (no global session revocation in v1.0).
4. Admin can force global logout via user management panel (future release).

---

## EC-011: Large-Scale DDoS Attack

### Scenario
Botnet generates millions of requests with randomized `guest_id` values.

### Impact
Redis overload, API saturation, cost overrun.

### Mitigation
1. Edge layer (Cloudflare / NGINX) rate limits at IP level before request reaches FastAPI.
2. API-level rate limiting keys on validated identity, not raw IP, to prevent Redis key explosion.
3. Invalid `guest_signature` requests are rejected before Redis lookup (CPU-bound HMAC check).
4. Redis keyspace uses hash tags (`rate_limit:{guest_id}`) for cluster locality.

---

## EC-012: Browser Privacy Mode / Local Storage Disabled

### Scenario
User browses in Incognito mode with `localStorage` disabled or cleared on exit.

### Impact
Guest ID cannot persist; user gets new identity on every page load, effectively unlimited quota.

### Mitigation
1. Cookie-based `guest_id` acts as fallback when `localStorage` is unavailable.
2. If both `localStorage` and cookies are blocked, the user cannot interact with AI endpoints (graceful degradation to static content).
3. Cookie-based guest ID still requires valid HMAC signature server-side.
