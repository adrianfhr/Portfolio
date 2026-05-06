# User Stories — Authentication & Access Control Module

**Module ID:** AUTH-001  
**Version:** 1.0.0  
**Status:** Draft

---

## US-001: Frictionless Guest Access

**As a** first-time visitor (Technical Recruiter or CTO),  
**I want** to interact with AI demos immediately without creating an account,  
**So that** I can evaluate the portfolio's capabilities within seconds of landing on the site.

### Acceptance Criteria
- A unique `guest_id` is generated automatically on the first API request.
- The guest identity persists across page reloads via `localStorage` and cookies.
- No login prompt, email form, or modal blocks the initial user journey.
- The guest session is valid for 24 hours from creation.

### Priority: Critical
### Story Points: 3

---

## US-002: Quota Visibility & Transparency

**As a** guest user,  
**I want** to see my remaining API quota in real time,  
**So that** I understand how many interactions I have left and can budget my usage accordingly.

### Acceptance Criteria
- A rate limit indicator is visible in the global navigation bar at all times.
- The indicator displays remaining requests as a progress bar (e.g., "14 / 20 remaining").
- Color coding: green (>50%), yellow (20–50%), red (<20%).
- Hovering the indicator reveals a tooltip with reset time and tier details.

### Priority: High
### Story Points: 2

---

## US-003: Rate Limit Enforcement with Graceful UX

**As a** guest user who has exhausted my daily quota,  
**I want** to receive a clear, elegant explanation of why I cannot proceed,  
**So that** I understand the limitation and am encouraged to authenticate for higher limits.

### Acceptance Criteria
- When quota reaches zero, subsequent API requests receive HTTP 429 with structured error body.
- A "Quota Exhausted" modal appears instead of a native browser alert.
- The modal explains the limit, shows time until reset, and provides a CTA to log in via GitHub.
- The modal is dismissible but reappears on the next blocked action.

### Priority: High
### Story Points: 3

---

## US-004: Secure Session Persistence

**As a** returning developer user,  
**I want** my session to persist securely across browser sessions,  
**So that** I do not need to re-authenticate every time I visit the portfolio.

### Acceptance Criteria
- JWT is stored in an HttpOnly, Secure, SameSite=Strict cookie.
- JWT payload contains `user_id`, `role`, `iat`, `exp` (7 days).
- `localStorage` mirrors the JWT for client-side auth state (avatar, role badge).
- Session is validated on every API request via FastAPI dependency.
- Expired JWTs trigger a silent refresh attempt; if refresh fails, user is demoted to guest.

### Priority: Critical
### Story Points: 3

---

## US-005: GitHub OAuth Login

**As a** peer engineer or potential client,  
**I want** to log in using my GitHub account,  
**So that** I can access higher rate limits and authenticated features without creating a new password.

### Acceptance Criteria
- Clicking "Login with GitHub" redirects to GitHub OAuth authorize endpoint with a random `state` parameter.
- Upon callback, the server validates `state`, exchanges code for token, fetches GitHub profile.
- New users are auto-created in PostgreSQL; existing users are updated (last login timestamp).
- A JWT is generated and set as HttpOnly cookie + `localStorage` entry.
- The UI updates to show the user's GitHub avatar and username within 500ms.

### Priority: High
### Story Points: 5

---

## US-006: Role-Based Access Control

**As an** admin user,  
**I want** sensitive endpoints (admin panel, raw logs, user management) to be restricted by role,  
**So that** unauthorized users cannot access internal tools or sensitive data.

### Acceptance Criteria
- Three roles exist: `guest`, `developer`, `admin`.
- Every API endpoint declares required role(s) in OpenAPI metadata.
- Middleware rejects requests with insufficient role with HTTP 403.
- Admin-only UI routes are hidden from navigation for non-admin users (not just URL-blocked).
- Role changes take effect immediately (no forced re-login required).

### Priority: Medium
### Story Points: 3

---

## US-007: Transparent Rate Limit Headers

**As a** API consumer (peer engineer testing endpoints),  
**I want** every API response to include rate limit metadata in headers,  
**So that** I can programmatically adapt my request patterns.

### Acceptance Criteria
- All API responses include `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`, `X-RateLimit-Policy`.
- Header values are accurate and consistent with Redis counters.
- Header format follows IETF draft standard conventions where applicable.

### Priority: Medium
### Story Points: 2

---

## US-008: Secure Logout

**As a** logged-in user,  
**I want** to log out with a single click,  
**So that** my session is terminated and my account is protected on shared devices.

### Acceptance Criteria
- Logout invalidates the JWT on the client (cookie cleared, `localStorage` purged).
- Server-side JWT is added to a Redis denylist with TTL matching remaining expiry.
- User is demoted to guest tier immediately with a new `guest_id` generated.
- UI transitions to unauthenticated state within 300ms.

### Priority: Medium
### Story Points: 2

---

## US-009: Abuse Detection & Throttling

**As a** system owner,  
**I want** repeated rapid requests from the same identity to be temporarily throttled,  
**So that** brute-force and scraping attacks are mitigated without permanently banning legitimate users.

### Acceptance Criteria
- More than 10 requests per minute from a single identity triggers a temporary 60-second throttle.
- Throttled requests receive HTTP 429 with `Retry-After` header.
- Abuse events are logged with `level=WARN` and tagged for monitoring dashboard visibility.
- Throttle state is stored in Redis with 60-second TTL.

### Priority: Medium
### Story Points: 3
