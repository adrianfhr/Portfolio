# Non-Functional Requirements — Authentication & Access Control Module

**Module ID:** AUTH-001  
**Version:** 1.0.0  
**Status:** Draft

---

## NFR-001: Performance & Latency

### Description
Authentication operations must not materially impact API response times or user experience.

### Requirements
1. **Guest ID Generation:** < 10ms end-to-end (hash + HMAC + storage).
2. **Rate Limit Check:** < 5ms Redis round-trip; < 20ms including fallback logic.
3. **JWT Validation:** < 5ms CPU time for HS256 verify + payload decode.
4. **OAuth Callback:** < 500ms total from GitHub callback to JWT cookie set (including DB write).
5. **Auth State Query (`/api/auth/me`):** < 50ms P95 latency.
6. **Session Lookup:** No additional database query on standard API calls; user context injected via JWT payload alone.

---

## NFR-002: Security

### Description
The module must implement defense-in-depth security practices suitable for a public-facing production system.

### Requirements
1. **Secret Management:**
   - `JWT_SECRET` minimum 256 bits, generated via `secrets.token_hex(32)`.
   - `JWT_SECRET` loaded exclusively from environment variables; never committed to version control.
   - OAuth `client_secret` stored in environment variables only.

2. **Cookie Security:**
   - All authentication cookies: `HttpOnly; Secure; SameSite=Strict; Path=/`.
   - No JWT or session tokens in non-HttpOnly cookies.

3. **Transport Security:**
   - All authentication endpoints require HTTPS in production.
   - HSTS header enforced at reverse proxy (NGINX / Cloudflare).
   - OAuth `redirect_uri` must exactly match registered value; no wildcard or partial match accepted.

4. **Input Validation:**
   - `state` parameter validated against exact Redis match; reject if malformed (>128 chars, non-base64url).
   - `guest_id` validated as 32-character hex string.
   - `guest_signature` validated as 64-character hex string.

5. **Cryptographic Standards:**
   - HMAC: SHA-256.
   - JWT: HS256 (symmetric) acceptable because tokens are never exposed to third parties.
   - Hashing: SHA-256 for fingerprinting (not password hashing — no passwords stored).

6. **Audit Logging:**
   - Every login, logout, failed OAuth attempt, and rate limit breach is logged in structured JSON.
   - Log fields: `timestamp`, `level`, `event`, `ip_address`, `user_agent`, `user_id` or `guest_id`, `outcome`.
   - IP addresses truncated to /24 (IPv4) or /64 (IPv6) in logs for privacy.

---

## NFR-003: Scalability

### Description
The authentication layer must scale horizontally without session affinity.

### Requirements
1. **Statelessness:** API servers are stateless; all session data in JWT or Redis.
2. **Redis Scaling:** Rate limit counters must work correctly with Redis Cluster (consistent hashing on `{identifier}` prefix).
3. **Database Load:** User lookup by `github_id` uses a B-tree index; P95 query time < 5ms.
4. **Concurrent Requests:** Rate limit algorithm must be race-condition safe under 1000+ concurrent requests per second.
5. **Memory Footprint:** In-memory fallback must not exceed 50MB per API instance under normal load.

---

## NFR-004: Availability & Reliability

### Description
Authentication services must remain functional during partial infrastructure failures.

### Requirements
1. **Redis Degradation:** If Redis is unreachable:
   - Rate limiting falls back to in-memory dictionary per instance.
   - Quota tracking falls back to per-instance memory (conservative 50% limits).
   - OAuth state storage falls back to in-memory with 5-minute TTL.
   - Log a `WARN` event on every fallback activation.

2. **Database Degradation:** If PostgreSQL is unreachable:
   - OAuth callback queues user creation in Redis stream; returns JWT provisionally.
   - Background worker retries DB write for up to 5 minutes.
   - If DB remains down, new OAuth logins are rejected after 5-minute grace period.

3. **GitHub API Degradation:**
   - If GitHub API is slow (>5s) or returns 5xx, abort and return HTTP 503 with `Retry-After: 60`.
   - Do not retry GitHub API calls automatically to avoid amplifying load.

---

## NFR-005: Maintainability

### Description
The module must be comprehensible and modifiable by a single developer.

### Requirements
1. **Code Organization:** All auth logic isolated in `apps/api/routers/auth.py`, `apps/api/core/security.py`, and `apps/api/core/rate_limiter.py`.
2. **Configuration:** All tunables (window size, limits, secrets) in Pydantic `Settings` with validation.
3. **Documentation:** Every public function has a Google-style docstring.
4. **Testability:** Rate limiter and JWT logic unit-testable without Redis or database (mock interfaces provided).
5. **Observability:** Prometheus counters for `auth_login_total`, `auth_logout_total`, `rate_limit_violations_total`, `oauth_errors_total`.

---

## NFR-006: Compliance & Privacy

### Description
The module must respect user privacy and comply with standard data protection practices.

### Requirements
1. **Data Minimization:** Only store `github_id`, `login`, `avatar_url`, and `email` from GitHub profile.
2. **Retention:** Guest IDs and associated quota counters auto-expire after 25 hours.
3. **Deletion:** Users can request account deletion via admin panel; all PII purged within 24 hours.
4. **Logging:** IP addresses hashed or truncated in persistent logs; full IPs retained in Redis only for active sessions.
5. **Consent:** No tracking cookies set before first user interaction; `localStorage` usage disclosed in privacy notice.
