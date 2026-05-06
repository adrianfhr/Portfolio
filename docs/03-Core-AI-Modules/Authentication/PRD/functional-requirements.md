# Functional Requirements — Authentication & Access Control Module

**Module ID:** AUTH-001  
**Version:** 1.0.0  
**Status:** Draft

---

## FR-001: Guest Identity Generation

### Description
The system must generate a cryptographically secure, anonymous guest identifier for every unauthenticated visitor on their first API interaction.

### Specification
1. **Fingerprint Inputs:** IPv4/IPv6 address (hashed) + User-Agent string (hashed).
2. **Derivation:** `SHA-256(IP || "|" || UA)` truncated to 128 bits, hex-encoded.
3. **Signing:** Server-side HMAC-SHA256(`guest_id`, `JWT_SECRET`) produces `guest_signature`.
4. **Persistence:**
   - `guest_id` stored in `localStorage` key `portfolio_guest_id`.
   - `guest_signature` stored in `localStorage` key `portfolio_guest_sig`.
   - Both values duplicated in cookies (`guest_id`, `guest_sig`) with `Secure; SameSite=Strict`.
5. **Validation:** Every request carrying a `guest_id` must have a valid `guest_signature` verified server-side. Invalid signatures are rejected with HTTP 401 and a new guest identity is issued.
6. **Expiry:** Guest identity is valid for 24 hours (86,400 seconds) from creation. After expiry, a new identity is generated and quota resets.

---

## FR-002: Quota Tier Management

### Description
The system must enforce distinct API usage quotas based on the user's authentication tier.

### Specification

| Tier | Daily Limit | Window | Identifier | Scope |
|---|---|---|---|---|
| Guest | 20 requests | 24 hours | `guest_id` | All AI endpoints combined |
| Developer | 200 requests | 24 hours | `user_id` (JWT sub) | All AI endpoints combined |
| Admin | Unlimited | — | `user_id` + `role=admin` | All endpoints |

1. Quota counters are stored in Redis as integer values.
2. Counter key format: `quota:{identifier}:{YYYY-MM-DD}`.
3. Counter TTL is set to 25 hours to prevent premature expiry.
4. On tier upgrade (guest → developer), the guest quota counter is discarded and the developer counter begins at zero.
5. Admin requests bypass quota checks entirely but still increment metrics counters.

---

## FR-003: Sliding-Window Rate Limiting

### Description
All API requests must be subject to Redis-backed sliding-window rate limiting with per-tier configuration.

### Specification
1. **Algorithm:** Sliding window counter. Redis key `rate_limit:{identifier}` stores a sorted set of request timestamps.
2. **Window Size:** 86,400 seconds (24 hours).
3. **Cleanup:** Expired entries (timestamp < now - window) are purged on each request (lazy cleanup).
4. **Decision Logic:**
   - Count entries in window.
   - If count >= limit → reject with HTTP 429.
   - If count < limit → add timestamp, accept request.
5. **Concurrency Safety:** Redis `MULTI` / `EXEC` transactions ensure atomic check-and-increment.
6. **Header Injection:** Response headers are populated before the response body is streamed.
7. **Fallback:** If Redis is unreachable, switch to in-memory dictionary with 5-minute TTL and conservative limits (50% of normal).

---

## FR-004: GitHub OAuth 2.0 Authentication Flow

### Description
Users must be able to authenticate using GitHub OAuth 2.0 with PKCE-aligned security practices.

### Specification
1. **Initiation:** `GET /api/auth/github/initiate`
   - Generate cryptographically random `state` parameter (32 bytes, base64url).
   - Store `state` in Redis with 10-minute TTL keyed by `oauth_state:{state}`.
   - Redirect user to `https://github.com/login/oauth/authorize` with `client_id`, `redirect_uri`, `scope=user:email`, and `state`.

2. **Callback:** `GET /api/auth/github/callback?code={code}&state={state}`
   - Validate `state` exists in Redis; reject with HTTP 400 if missing or expired.
   - Exchange `code` for access token via `POST https://github.com/login/oauth/access_token`.
   - Fetch user profile via `GET https://api.github.com/user`.
   - Fetch primary email via `GET https://api.github.com/user/emails`.

3. **User Provisioning:**
   - Search PostgreSQL `users` table by `github_id`.
   - If not found, insert new row with `github_id`, `login`, `avatar_url`, `email`, `role='developer'`, `created_at`.
   - If found, update `last_login_at`, `avatar_url`, and `email`.

4. **JWT Generation:**
   - Payload: `{ "sub": user.id, "github_id": user.github_id, "role": user.role, "iat": now, "exp": now + 604800 }`.
   - Algorithm: HS256.
   - Secret: `JWT_SECRET` environment variable (min 256 bits).

5. **Session Delivery:**
   - Set `access_token` as HttpOnly cookie (`Secure; SameSite=Strict; Max-Age=604800`).
   - Return JWT in JSON body for `localStorage` synchronization.

---

## FR-005: JWT Session Management

### Description
The system must validate, refresh, and terminate JWT sessions securely.

### Specification
1. **Validation:** FastAPI dependency extracts JWT from cookie or `Authorization: Bearer` header.
   - Verify signature with `JWT_SECRET`.
   - Verify `exp` > current timestamp.
   - Verify `sub` exists in `users` table.
   - Verify JWT is not in Redis denylist (`jwt_denylist:{jti}`).

2. **Refresh:** Not implemented in v1.0. Short expiry (7 days) accepted; users re-authenticate via GitHub.

3. **Denylist:** On logout, extract JWT `jti` (or hash of token) and store in Redis with TTL = remaining token lifetime.

4. **Context Injection:** Validated JWT payload is attached to `request.state.user` for downstream handlers.

---

## FR-006: Role-Based Access Control (RBAC)

### Description
API endpoints and UI routes must enforce role-based permissions.

### Specification
1. **Roles:** `guest` (anonymous), `developer` (authenticated via GitHub), `admin` (manually promoted).
2. **Permission Matrix:**

| Endpoint / Feature | Guest | Developer | Admin |
|---|---|---|---|
| AI Inference (chat, vision, vector) | ✅ (quota) | ✅ (quota) | ✅ |
| Rate Limit Indicator | ✅ | ✅ | ✅ |
| Conversation History | ❌ | ✅ | ✅ |
| Admin Panel | ❌ | ❌ | ✅ |
| Raw System Logs | ❌ | ❌ | ✅ |
| User Management | ❌ | ❌ | ✅ |

3. **Middleware:** `@require_role(roles)` decorator on FastAPI route handlers.
4. **UI Enforcement:** Navigation items filtered by role on server-side render; API provides `available_routes` array in `/api/auth/me`.

---

## FR-007: Logout & Session Termination

### Description
Users must be able to terminate their session securely from any page.

### Specification
1. `POST /api/auth/logout`
   - Extract JWT from cookie.
   - Add token hash to Redis denylist with TTL = `exp - now`.
   - Clear `access_token` cookie (`Max-Age=0`).
   - Return HTTP 200 with `{ "status": "logged_out" }`.
2. Client-side:
   - Remove `access_token` from `localStorage`.
   - Reset Zustand auth store to unauthenticated state.
   - Generate new `guest_id` for immediate continued access.

---

## FR-008: Rate Limit Response Headers

### Description
Every API response must include standardized rate limit metadata.

### Specification
1. `X-RateLimit-Limit`: Total requests allowed in the current window (e.g., `20`).
2. `X-RateLimit-Remaining`: Requests remaining in current window (e.g., `14`).
3. `X-RateLimit-Reset`: Unix timestamp when the window resets (e.g., `1715000000`).
4. `X-RateLimit-Policy`: Human-readable tier name (e.g., `guest:20/day`, `developer:200/day`).
5. On HTTP 429 responses, include `Retry-After` header (seconds until next request allowed).

---

## FR-009: Abuse Detection & Short-Term Throttling

### Description
Rapid sequential requests from the same identity must trigger temporary throttling independent of daily quotas.

### Specification
1. Track request velocity in Redis key `velocity:{identifier}` as a counter with 60-second TTL.
2. Increment counter on every request.
3. If counter > 10 within 60 seconds:
   - Set `throttle:{identifier}` flag in Redis with 60-second TTL.
   - Return HTTP 429 with `Retry-After: 60`.
4. Abuse events logged: `{ "level": "WARN", "event": "abuse_throttle", "identifier": "...", "count": 15 }`.

---

## FR-010: Auth State Endpoint

### Description
The frontend must be able to query the current authentication state and user profile.

### Specification
1. `GET /api/auth/me`
   - Returns `{ "authenticated": true, "user": { "id", "login", "avatar_url", "role" }, "quota": { "limit", "remaining", "reset_at" } }` for authenticated users.
   - Returns `{ "authenticated": false, "guest_id": "...", "quota": { "limit": 20, "remaining", "reset_at" } }` for guests.
2. Called on app initialization and after login/logout.
3. Response cached client-side for 30 seconds to prevent excessive polling.
