# Component Behavior — Authentication & Access Control Module

**Module ID:** AUTH-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. RateLimitIndicator

### Overview
A persistent navbar component that displays real-time API quota consumption. It acts as the primary trust signal for users, proving that the system is transparent about resource limits.

### Behaviors

#### 1.1 Initialization
- On application mount, fetch `/api/auth/me`.
- Parse `quota` object from response.
- Set internal state: `{ limit, remaining, resetAt, tier }`.
- If request fails, show error state (grayed out with tooltip "Unable to load quota").

#### 1.2 Update Triggers
- **After every API response:** Read `X-RateLimit-Remaining` header and update immediately.
- **Polling fallback:** If header is missing (e.g., static asset request), poll `/api/auth/me` every 60 seconds.
- **On login/logout:** Re-fetch auth state and recalculate progress.

#### 1.3 Progress Calculation
```
percentage = (remaining / limit) * 100
```
- Animate width transition over 300ms when value changes.
- Color class updates instantly (no transition delay) for urgency.

#### 1.4 Tooltip Behavior
- **Trigger:** Mouse enter (desktop) or tap (mobile).
- **Delay:** 300ms hover delay; immediate on tap.
- **Content:**
  - Tier name (e.g., "Guest Tier")
  - Limit (e.g., "20 requests per day")
  - Reset time (e.g., "Resets tomorrow at 14:32")
  - Current usage (e.g., "6 used, 14 remaining")
- **Dismiss:** Mouse leave (desktop) or tap outside (mobile).
- **Position:** Bottom-center, flip to top if viewport insufficient.

#### 1.5 Threshold Alerts
- When `remaining` drops to 5: trigger subtle pulse animation on progress bar.
- When `remaining` drops to 0: trigger modal open (see QuotaExhaustedModal).

---

## 2. QuotaExhaustedModal

### Overview
An elegant overlay that replaces the native browser alert when a user's quota is depleted. It educates the user about the limit and provides a clear path to upgrade.

### Behaviors

#### 2.1 Trigger Conditions
- API response with HTTP 429 AND `X-RateLimit-Remaining` == 0.
- NOT triggered by velocity throttling (different modal).

#### 2.2 Open Animation
- Backdrop fades in over 200ms.
- Modal scales from 0.95 to 1.0 and fades in over 300ms (ease-out-cubic).
- Focus trap activated; first focusable element (CTA button) receives focus.

#### 2.3 Countdown Timer
- Parses `X-RateLimit-Reset` or `resetAt` from auth state.
- Updates every second using `requestAnimationFrame` for smoothness.
- Format: `HH:MM:SS` (e.g., "04:32:18").
- When timer reaches zero, modal auto-closes and quota indicator refreshes.

#### 2.4 CTA Interactions
- **Primary (GitHub Login):**
  - Navigates to `/api/auth/github/initiate`.
  - Button enters loading state (spinner + disabled) until redirect begins.
- **Secondary (Dismiss):**
  - Closes modal.
  - User can browse static content but AI endpoints remain blocked.

#### 2.5 Close Behaviors
- Click backdrop.
- Press Escape key.
- Click close icon (×).
- All close actions log a dismiss event for analytics.

#### 2.6 Stacking
- If multiple 429s occur while modal is open, do NOT stack modals.
- Update existing modal content if tier or reset time changes.

---

## 3. AuthDropdown

### Overview
The user menu that appears when clicking the avatar. Provides navigation to user-specific features and logout.

### Behaviors

#### 3.1 Open / Close
- **Open:** Click avatar. Dropdown renders via portal to avoid clipping.
- **Close:** Click outside, press Escape, click a menu item, or route change.
- **Animation:** Fade-in 150ms + translateY(-4px to 0) 200ms.

#### 3.2 Role-Based Rendering
- Admin-only items are removed from DOM (not just hidden) for non-admin users.
- Role check uses `user.role` from Zustand auth store (not re-fetched on every open).

#### 3.3 Logout Flow
1. User clicks "Logout".
2. Menu closes immediately.
3. Logout request fired in background (`POST /api/auth/logout`).
4. Auth store cleared; avatar replaced with login button.
5. Rate limit indicator resets to guest tier.
6. New `guest_id` generated silently.
7. If logout fails, show transient toast error but still clear client state.

#### 3.4 Avatar Loading
- Avatar URL loaded from GitHub CDN.
- Show skeleton circle (40px, `bg-slate-700`) while loading.
- On error, fallback to initials avatar (first letter of username, `bg-slate-700`).

---

## 4. LoginButton

### Overview
The primary CTA for unauthenticated users. Initiates the GitHub OAuth flow.

### Behaviors

#### 4.1 Hover / Active
- Hover: background lightens, border brightens (150ms transition).
- Active: scale 0.98, background darkens (50ms transition).

#### 4.2 Click Handler
1. Set button to loading state (spinner replaces GitHub icon).
2. Redirect browser to `/api/auth/github/initiate`.
3. No async fetch — redirect is immediate.
4. Loading state persists until page unloads (prevents double-click).

#### 4.3 Loading State Persistence
- If user clicks back from GitHub without completing OAuth, button resets on next mount.
- Store `oauth_pending` flag in `sessionStorage` during redirect; clear on mount if no callback params present.

---

## 5. GuestBadge

### Overview
A subtle indicator of unauthenticated status. Shown in navbar or auth dropdown to clarify why quota is limited.

### Behaviors
- Static display; no interaction.
- Updates to hidden when user authenticates.
- Optional: on hover, tooltip explains "Login for higher limits".

---

## 6. AuthStateProvider (Behavioral Pattern)

### Overview
A React context / Zustand provider that orchestrates auth state across the application.

### Behaviors

#### 6.1 Initialization Sequence
1. Check `localStorage` for `access_token` or `guest_id`.
2. If `access_token` exists, call `/api/auth/me` to validate.
3. If valid, hydrate auth store with user data + quota.
4. If invalid or missing, generate new `guest_id` client-side (or wait for first API call).
5. Set `initialized: true` to unblock rendering.

#### 6.2 Login Success Handling
- On OAuth callback page, extract JWT from response body.
- Store in `localStorage`.
- Call `/api/auth/me` to hydrate profile.
- Redirect to original page (or dashboard) using `redirect_after_login` from `sessionStorage`.

#### 6.3 Quota Synchronization
- Subscribe to all API responses via Axios interceptor.
- Extract rate limit headers and update store.
- If `X-RateLimit-Remaining` hits 0, set `quotaExhausted: true`.

#### 6.4 Error Recovery
- On 401 from any endpoint: silently refresh auth state. If still 401, demote to guest.
- On network error: preserve last known quota state; retry on next successful request.
