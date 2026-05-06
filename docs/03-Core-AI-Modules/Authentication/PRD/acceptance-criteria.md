# Acceptance Criteria — Authentication & Access Control Module

**Module ID:** AUTH-001  
**Version:** 1.0.0  
**Status:** Draft

---

## AC-001: Guest Onboarding

- [ ] First visit to any AI endpoint generates a `guest_id` within 2 seconds.
- [ ] `guest_id` is stored in both `localStorage` and cookies.
- [ ] `guest_signature` accompanies every request and is validated server-side.
- [ ] Guest can interact with AI endpoints immediately without seeing a login prompt.
- [ ] Guest session persists after page reload.
- [ ] Guest session expires after 24 hours and a new identity is issued.

## AC-002: Quota Enforcement

- [ ] Guest tier allows exactly 20 API requests per 24-hour window.
- [ ] Developer tier allows exactly 200 API requests per 24-hour window.
- [ ] Admin tier has no quota restrictions.
- [ ] The 21st guest request returns HTTP 429 with `Retry-After` header.
- [ ] Quota counter resets precisely at the 24-hour mark.
- [ ] Upgrading from guest to developer resets the counter to zero (developer tier begins fresh).

## AC-003: Rate Limit Headers

- [ ] Every API response includes `X-RateLimit-Limit`.
- [ ] Every API response includes `X-RateLimit-Remaining`.
- [ ] Every API response includes `X-RateLimit-Reset`.
- [ ] Every API response includes `X-RateLimit-Policy`.
- [ ] Header values are accurate when cross-referenced with Redis.
- [ ] HTTP 429 responses include `Retry-After`.

## AC-004: GitHub OAuth Flow

- [ ] Clicking "Login with GitHub" redirects to GitHub authorize URL with valid `client_id` and random `state`.
- [ ] `state` is stored in Redis with 10-minute TTL.
- [ ] Successful GitHub callback exchanges code for access token.
- [ ] User profile and email are fetched from GitHub API.
- [ ] New user is created in PostgreSQL with `role='developer'`.
- [ ] Existing user has `last_login_at` updated.
- [ ] JWT is generated and set as HttpOnly cookie.
- [ ] JWT is returned in JSON body for `localStorage` sync.
- [ ] UI updates to show GitHub avatar and username within 500ms.

## AC-005: OAuth Security

- [ ] Callback with missing or invalid `state` returns HTTP 400.
- [ ] Reused `state` returns HTTP 400.
- [ ] `state` older than 10 minutes returns HTTP 400.
- [ ] OAuth flow completes in under 500ms (excluding GitHub redirect time).

## AC-006: JWT Session Management

- [ ] Valid JWT cookie grants access to developer-tier endpoints.
- [ ] Expired JWT returns HTTP 401; frontend demotes to guest.
- [ ] Tampered JWT returns HTTP 401; frontend demotes to guest.
- [ ] Logged-out JWT (in denylist) returns HTTP 401.
- [ ] JWT payload contains `sub`, `github_id`, `role`, `iat`, `exp`.
- [ ] JWT expires exactly 7 days after issuance.

## AC-007: RBAC Enforcement

- [ ] Guest cannot access `/admin` routes (HTTP 403).
- [ ] Developer cannot access `/admin` routes (HTTP 403).
- [ ] Admin can access all routes.
- [ ] Navigation menu hides admin items for non-admin users.
- [ ] Direct URL navigation to admin routes is blocked for non-admin users.

## AC-008: Logout

- [ ] Logout clears HttpOnly cookie.
- [ ] Logout purges `localStorage` auth entries.
- [ ] Logout adds JWT to Redis denylist with correct TTL.
- [ ] After logout, user is immediately assigned a new `guest_id`.
- [ ] After logout, user can continue interacting as guest without page reload.

## AC-009: Abuse Throttling

- [ ] 11 requests within 60 seconds from the same identity triggers throttle.
- [ ] Throttled requests receive HTTP 429 with `Retry-After: 60`.
- [ ] After 60 seconds, requests resume normally.
- [ ] Abuse events appear in logs with `level=WARN`.

## AC-010: Redis Fallback

- [ ] When Redis is stopped, API continues to serve requests.
- [ ] Fallback mode applies 50% of normal quota (10 for guests, 100 for developers).
- [ ] Fallback mode logs `WARN` on every rate limit check.
- [ ] When Redis restarts, system automatically resumes normal operation.

## AC-011: UI Rate Limit Indicator

- [ ] Indicator visible in navbar on all pages.
- [ ] Progress bar accurately reflects remaining quota.
- [ ] Color transitions: green → yellow → red as quota depletes.
- [ ] Tooltip on hover shows tier name, limit, and reset time.
- [ ] Indicator updates immediately after every API response.

## AC-012: Quota Exhausted Modal

- [ ] Modal appears when guest quota reaches zero.
- [ ] Modal displays reset countdown timer.
- [ ] Modal provides "Login with GitHub" CTA.
- [ ] Modal is dismissible via close button and Escape key.
- [ ] Modal does not use native `alert()`, `confirm()`, or `prompt()`.
- [ ] Modal is keyboard-navigable and screen-reader accessible.

## AC-013: Guest ID Manipulation Resilience

- [ ] Request with forged `guest_id` but invalid `guest_signature` is rejected.
- [ ] Server issues new guest identity on signature mismatch.
- [ ] Forged identity does not consume another user's quota.
- [ ] HMAC secret is never exposed to client.

## AC-014: Performance

- [ ] Rate limit check adds < 5ms to API response time under normal load.
- [ ] OAuth callback completes in < 500ms (server-side processing).
- [ ] `/api/auth/me` responds in < 50ms P95.
- [ ] Auth middleware does not add perceptible latency to streaming endpoints.
