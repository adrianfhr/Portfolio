# Accessibility — Authentication & Access Control Module

**Module ID:** AUTH-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. WCAG Target

This module aims for **WCAG 2.1 Level AA** compliance across all auth-related UI components.

---

## 2. Keyboard Navigation

### 2.1 Global Shortcuts
| Key | Action | Context |
|---|---|---|
| `Tab` / `Shift+Tab` | Navigate focusable elements | Global |
| `Enter` / `Space` | Activate button or link | Global |
| `Escape` | Close modal or dropdown | Modal / Dropdown open |
| `?` | Open keyboard shortcuts help (future) | Global |

### 2.2 RateLimitIndicator
- **Focusable:** Yes (via `tabIndex=0`).
- **Activation:** Press `Enter` or `Space` to open tooltip (mobile/desktop parity).
- **Tooltip:** Dismiss with `Escape` or loss of focus.

### 2.3 QuotaExhaustedModal
- **Focus Trap:** Active when open. Tab cycles through:
  1. Primary CTA (GitHub login)
  2. Secondary CTA (Dismiss)
  3. Close button (×)
- **Escape:** Closes modal (equivalent to "Dismiss").
- **Return:** Focus returns to the element that triggered the modal (usually the AI input or send button).

### 2.4 AuthDropdown
- **Trigger:** Click or `Enter` on avatar.
- **Navigation:** `↑` / `↓` arrow keys move between menu items.
- **Activation:** `Enter` or `Space` selects focused item.
- **Escape:** Closes dropdown.
- **Home / End:** Jump to first / last menu item.

### 2.5 LoginButton
- **Focusable:** Yes.
- **Focus Ring:** `ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900`.
- **Loading State:** `aria-busy="true"`, `aria-label="Authenticating with GitHub..."`.

---

## 3. Screen Reader Support

### 3.1 RateLimitIndicator
```
role="status"
aria-live="polite"
aria-label="Rate limit: 14 of 20 requests remaining. Guest tier."
aria-atomic="true"
```
- Updates announced politely (non-intrusive) when quota changes.
- When quota reaches 0, `aria-live="assertive"` to immediately notify user.

### 3.2 QuotaExhaustedModal
```
role="dialog"
aria-modal="true"
aria-labelledby="quota-modal-title"
aria-describedby="quota-modal-description"
```
- Title: "Daily Quota Exhausted"
- Description: "You have used all 20 guest requests. Resets in 4 hours."
- Focus moves to primary CTA on open.

### 3.3 AuthDropdown
```
role="menu"
aria-label="User menu"
```
Each item:
```
role="menuitem"
```
- Avatar button:
```
aria-haspopup="menu"
aria-expanded={isOpen}
aria-label="Open user menu for {username}"
```

### 3.4 Progress Bar (inside RateLimitIndicator)
```
role="progressbar"
aria-valuenow={remaining}
aria-valuemin={0}
aria-valuemax={limit}
aria-label="API quota usage"
```

---

## 4. Color & Contrast

### 4.1 Text Contrast
| Element | Foreground | Background | Ratio | Pass |
|---|---|---|---|---|
| Navbar quota text | slate-300 (#cbd5e1) | slate-800 (#1e293b) | 7.2:1 | AAA |
| Modal heading | white (#ffffff) | slate-900 (#0f172a) | 16.1:1 | AAA |
| Modal body | slate-400 (#94a3b8) | slate-900 (#0f172a) | 7.5:1 | AAA |
| Timer digits | amber-400 (#fbbf24) | slate-900 (#0f172a) | 10.2:1 | AAA |
| Rose text (critical) | rose-400 (#fb7185) | slate-900 (#0f172a) | 8.1:1 | AAA |
| Login button text | white (#ffffff) | slate-800 (#1e293b) | 12.6:1 | AAA |

### 4.2 Non-Text Contrast (UI Components)
| Element | Requirement |
|---|---|
| Progress bar fill vs track | 3:1 minimum (emerald-500 vs slate-700 = 4.5:1) |
| Focus ring | 3:1 against adjacent colors (blue-500 vs slate-800 = 3.2:1) |
| Modal border | 3:1 against page background (slate-700 vs black/60 = pass) |
| Avatar border | 3:1 against navbar (slate-700 vs slate-900 = 1.5:1 — decorative, exempt) |

### 4.3 Color Independence
- Quota status is NEVER communicated by color alone.
- Critical state: progress bar + pulsing animation + text label change + `aria-live` announcement.
- Exhausted state: modal + text + disabled inputs + color change.

---

## 5. Motion & Vestibular Disorders

### 5.1 Reduced Motion Support
All animations respect `prefers-reduced-motion: reduce`:
- Modal opens instantly (no fade/scale).
- Dropdown opens instantly.
- Progress bar width changes instantly.
- Pulse animation replaced with static rose color.
- Skeleton loader replaced with static placeholder.

### 5.2 No Auto-Playing Distractions
- No auto-playing video or audio in auth components.
- Countdown timer updates visually but does not emit sounds.

---

## 6. Cognitive Accessibility

### 6.1 Clear Language
- "Daily Quota Exhausted" instead of "Rate Limit Exceeded" (more user-friendly).
- "Login with GitHub for 200/day" instead of "Upgrade tier".
- Tooltip explains "Resets tomorrow at 14:32" in plain language.

### 6.2 Consistent Patterns
- All modals share the same close behavior (×, Escape, backdrop click).
- All dropdowns share the same keyboard navigation pattern.
- All buttons share the same hover/active feedback.

### 6.3 Error Prevention
- Logout requires no confirmation (reversible: user can log back in).
- OAuth redirect is explicit; user sees GitHub domain in URL.
- Quota exhausted modal prevents accidental repeated API calls.

---

## 7. Touch & Mobile Accessibility

### 7.1 Target Sizes
| Element | Minimum Size | Actual Size |
|---|---|---|
| Login button | 44×44px | 32px height + padding = 48px touch target |
| Avatar | 44×44px | 40px + margin = 48px touch target |
| Dropdown menu item | 44×44px | 36px height + padding = 48px touch target |
| Modal CTA | 44×44px | 44px height |

### 7.2 Touch Feedback
- All interactive elements show `:active` state immediately on touch.
- No 300ms tap delay (via `touch-action: manipulation`).

---

## 8. Testing Checklist

- [ ] All interactive elements reachable via Tab key.
- [ ] Focus order is logical and visible.
- [ ] Modal traps focus and returns it on close.
- [ ] Screen reader announces quota changes.
- [ ] Screen reader announces modal title and description on open.
- [ ] Color contrast meets AA for all text and UI components.
- [ ] Animations respect `prefers-reduced-motion`.
- [ ] Touch targets are >= 44×44px on mobile.
- [ ] Auth flow works with keyboard only (no mouse).
- [ ] Auth flow works with screen reader (NVDA/VoiceOver).
