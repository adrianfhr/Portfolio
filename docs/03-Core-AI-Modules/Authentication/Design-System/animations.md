# Animations — Authentication & Access Control Module

**Module ID:** AUTH-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. Animation Principles

Auth UI animations should feel **precise, fast, and functional** — never decorative or distracting. The aesthetic is inspired by developer tools (Vercel, GitHub, Linear): minimal motion, clear state changes, and instant feedback.

### Timing Tokens
| Token | Duration | Usage |
|---|---|---|
| `instant` | 0ms | Color changes on progress bar (urgency) |
| `fast` | 100ms | Hover states, button presses |
| `normal` | 200ms | Fade transitions, dropdown open/close |
| `smooth` | 300ms | Modal entrance/exit, progress width changes |
| `slow` | 500ms | Page-level auth state transitions |

### Easing Tokens
| Token | Curve | Usage |
|---|---|---|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering viewport |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric transitions (modals) |
| `spring` | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful bounces (badges, toasts) |

---

## 2. RateLimitIndicator Animations

### 2.1 Progress Bar Width Change
- **Trigger:** `remaining` value updates.
- **Animation:** Width transitions over 300ms `ease-in-out`.
- **Exception:** When entering "Critical" state, transition is instant (0ms) to convey urgency.

### 2.2 Color Transition
- **Trigger:** Percentage threshold crossed (>50% → 20–50% → <20%).
- **Animation:** Background-color instant (0ms). No fade — semantic color must be immediately readable.

### 2.3 Critical Pulse
- **Trigger:** `remaining` <= 5.
- **Animation:** Opacity oscillates between 1.0 and 0.6 over 1.5s, infinite loop.
- **Easing:** `ease-in-out`.
- **Exit:** Animation stops when quota resets or user logs in.

### 2.4 Skeleton Loader
- **Trigger:** Auth state uninitialized.
- **Animation:** Shimmer gradient translateX(-100%) → translateX(100%) over 1.2s, infinite.
- **Background:** `linear-gradient(90deg, slate-800 25%, slate-700 50%, slate-800 75%)`.

---

## 3. QuotaExhaustedModal Animations

### 3.1 Backdrop Fade
- **Trigger:** Modal open.
- **Animation:** Opacity 0 → 0.6 over 200ms `ease-out`.
- **Exit:** Opacity 0.6 → 0 over 150ms `ease-in`.

### 3.2 Modal Container
- **Trigger:** Modal open.
- **Animation:**
  - Scale: 0.95 → 1.0
  - Opacity: 0 → 1
  - TranslateY: -8px → 0
  - Duration: 300ms `ease-out`
- **Exit:**
  - Scale: 1.0 → 0.98
  - Opacity: 1 → 0
  - Duration: 200ms `ease-in`

### 3.3 Content Stagger
- **Trigger:** Modal fully open.
- **Animation:** Children (icon, heading, text, timer, buttons) fade in with 50ms stagger.
- **Initial delay:** 100ms after modal container settles.

### 3.4 Countdown Timer Tick
- **Trigger:** Every second.
- **Animation:** Subtle scale pulse 1.0 → 1.02 → 1.0 over 200ms on digit change.
- **Purpose:** Draws attention to the reset timer without being distracting.

---

## 4. AuthDropdown Animations

### 4.1 Open
- **Trigger:** Click avatar.
- **Animation:**
  - Opacity: 0 → 1 (150ms)
  - TranslateY: -4px → 0 (200ms `ease-out`)
  - Scale: 0.98 → 1.0 (200ms)
- **Origin:** Top-right anchor point.

### 4.2 Close
- **Trigger:** Click outside, Escape, or menu item click.
- **Animation:**
  - Opacity: 1 → 0 (100ms)
  - TranslateY: 0 → -2px (100ms)
- **Note:** Faster than open to feel responsive.

### 4.3 Menu Item Hover
- **Trigger:** Mouse enter menu item.
- **Animation:** Background color transition 100ms `ease-out`.
- **No transform:** Keep it flat and predictable.

---

## 5. LoginButton Animations

### 5.1 Hover
- **Trigger:** Mouse enter.
- **Animation:**
  - Background: `slate-800` → `slate-700` (150ms)
  - Border: `slate-600` → `slate-500` (150ms)

### 5.2 Active / Press
- **Trigger:** Mouse down.
- **Animation:** Scale 1.0 → 0.98 (50ms `ease-out`).
- **Release:** Scale back to 1.0 (100ms `spring`).

### 5.3 Loading State
- **Trigger:** Click.
- **Animation:** GitHub icon fades out (100ms), spinner fades in (100ms) with 360° rotation over 800ms linear infinite.

---

## 6. Auth State Transition Animations

### 6.1 Login Success
- **Trigger:** OAuth callback succeeds.
- **Sequence:**
  1. LoginButton / GuestBadge fade out (150ms).
  2. Avatar skeleton appears (instant).
  3. Avatar image loads and cross-fades in (200ms).
  4. Rate limit indicator resets width and color (300ms).

### 6.2 Logout
- **Trigger:** Logout clicked.
- **Sequence:**
  1. Avatar fades out (150ms).
  2. LoginButton fades in (200ms).
  3. Rate limit indicator resets to guest values (300ms).

### 6.3 Quota Depletion
- **Trigger:** HTTP 429 received.
- **Sequence:**
  1. Rate limit indicator turns rose instantly.
  2. 200ms delay.
  3. QuotaExhaustedModal opens (see Section 3).

---

## 7. Accessibility & Motion Preferences

### 7.1 Reduced Motion (`prefers-reduced-motion: reduce`)
- All transforms disabled (no scale, no translate).
- Opacity transitions reduced to 50ms or removed.
- Pulse animations replaced with static color change.
- Skeleton loader replaced with static gray block.
- Countdown timer tick animation disabled.

### 7.2 Focus Management
- All animated interactive elements must be focusable.
- Focus ring (`ring-2 ring-blue-500 ring-offset-2`) appears instantly on focus — no animation.
- Focus trap inside modals: wrap around with instant jumps (no animated focus movement).
