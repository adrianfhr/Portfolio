# States — Authentication & Access Control Module

**Module ID:** AUTH-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. Global Auth States

These states represent the high-level authentication status of the application.

### 1.1 Uninitialized
- **Trigger:** Application mount; auth state not yet determined.
- **Visual:** Navbar shows skeleton loader (shimmering gray bar) where rate limit indicator and avatar will appear.
- **Behavior:** No API calls blocked; guest ID generation deferred until first AI interaction.
- **Transitions:** → Guest Active (no token found) or → Authenticated (valid token found).

### 1.2 Guest Active
- **Trigger:** No valid JWT; valid `guest_id` exists.
- **Visual:**
  - Navbar: Guest badge + rate limit indicator (green/amber depending on usage).
  - Login button visible.
  - Quota indicator shows remaining / 20.
- **Behavior:** All AI endpoints accessible within quota. Headers inspected on every response.
- **Transitions:** → Guest Quota Critical (remaining < 5), → Authenticated (login success), → Guest Expired (24h elapsed).

### 1.3 Guest Quota Critical
- **Trigger:** Guest quota remaining drops to 5 or below.
- **Visual:**
  - Rate limit indicator turns amber/rose.
  - Progress bar pulses subtly (1s interval).
  - Tooltip warning: "Only X requests remaining."
- **Behavior:** No functional restriction yet; purely visual warning.
- **Transitions:** → Guest Quota Exhausted (remaining == 0), → Authenticated (login success).

### 1.4 Guest Quota Exhausted
- **Trigger:** 21st API request; HTTP 429 received.
- **Visual:**
  - Rate limit indicator shows 0/20 in rose color.
  - QuotaExhaustedModal appears.
  - AI input fields disabled (where applicable).
- **Behavior:** AI endpoints return 429. Static content still browsable.
- **Transitions:** → Guest Active (quota resets after 24h or manual time), → Authenticated (login success).

### 1.5 Authenticated (Developer)
- **Trigger:** Valid JWT with `role='developer'`.
- **Visual:**
  - Navbar: GitHub avatar + username.
  - Rate limit indicator shows remaining / 200.
  - Auth dropdown accessible.
- **Behavior:** Full developer-tier access. Conversation history, higher limits.
- **Transitions:** → Developer Quota Critical, → Admin (role upgrade), → Unauthenticated (logout or JWT expiry).

### 1.6 Authenticated (Admin)
- **Trigger:** Valid JWT with `role='admin'`.
- **Visual:**
  - Navbar: Avatar with amber border accent.
  - Rate limit indicator hidden (unlimited).
  - Admin panel link visible in dropdown and navigation.
- **Behavior:** Unrestricted access to all endpoints and UI routes.
- **Transitions:** → Authenticated (role downgrade), → Unauthenticated (logout).

### 1.7 Unauthenticated (Logged Out)
- **Trigger:** Logout action or JWT expiry with failed re-auth.
- **Visual:**
  - Navbar reverts to login button + guest badge.
  - All user-specific UI hidden.
- **Behavior:** New `guest_id` generated. User can continue as guest.
- **Transitions:** → Guest Active (new guest ID issued).

### 1.8 Error State
- **Trigger:** Auth state query fails repeatedly; Redis down; network partition.
- **Visual:**
  - Rate limit indicator grayed out with warning icon.
  - Tooltip: "Quota status unavailable. Limits may apply."
- **Behavior:** System continues in conservative mode (assumes guest tier). No blocking.
- **Transitions:** → Guest Active or Authenticated (recovery).

---

## 2. Component States

### 2.1 RateLimitIndicator

| State | Visual | Interaction |
|---|---|---|
| **Loading** | Skeleton bar (shimmer) | None |
| **Healthy** | Green fill, steady | Tooltip on hover |
| **Warning** | Amber fill, steady | Tooltip on hover |
| **Critical** | Rose fill, pulsing | Tooltip on hover |
| **Exhausted** | Rose fill, solid | Tooltip + modal trigger |
| **Error** | Gray fill, warning icon | Tooltip: "Unavailable" |

### 2.2 QuotaExhaustedModal

| State | Visual | Interaction |
|---|---|---|
| **Closed** | Not rendered | — |
| **Opening** | Backdrop fading, modal scaling in | Focus trap activating |
| **Open** | Full modal, countdown running | CTA buttons active |
| **Closing** | Modal scaling out, backdrop fading | No interaction |

### 2.3 LoginButton

| State | Visual | Interaction |
|---|---|---|
| **Idle** | Default styling | Hover/active effects |
| **Loading** | Spinner icon, disabled | No interaction |
| **Error** | Red border, error tooltip | Click to retry |

### 2.4 AuthDropdown

| State | Visual | Interaction |
|---|---|---|
| **Closed** | Hidden | Click avatar to open |
| **Opening** | Fade + slide down | Keyboard nav disabled until open |
| **Open** | Full menu visible | Click, hover, keyboard nav |
| **Closing** | Fade + slide up | No new interactions |

### 2.5 OAuthCallbackPage

| State | Visual | Interaction |
|---|---|---|
| **Processing** | Full-screen spinner + "Authenticating..." | None |
| **Success** | Brief checkmark, redirect | Auto-redirect after 500ms |
| **Error** | Error icon + message + "Try Again" | Click CTA to restart OAuth |

---

## 3. State Transition Diagram (Summary)

```
Uninitialized
    │
    ├─► Guest Active ──► Guest Critical ──► Guest Exhausted
    │       │                    │                  │
    │       │                    │                  ▼
    │       │                    │            Authenticated
    │       │                    └────────────────▲
    │       └─────────────────────────────────────┘
    │
    └─► Authenticated ──► Admin
              │
              ▼
        Unauthenticated ──► Guest Active
```

---

## 4. State Persistence Rules

| State | Persistence | Recovery |
|---|---|---|
| Guest ID | `localStorage` + cookie | Regenerate if both missing |
| Guest Signature | `localStorage` + cookie | Regenerate if invalid |
| JWT | `localStorage` + HttpOnly cookie | Re-auth via GitHub if missing |
| Quota Cache | Zustand store (memory) | Re-fetch from API on mount |
| OAuth Pending | `sessionStorage` | Clear on mount if no callback |
| Login Redirect | `sessionStorage` | Clear after redirect |
