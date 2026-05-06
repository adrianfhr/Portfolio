# UI Specification — Authentication & Access Control Module

**Module ID:** AUTH-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. Design Principles

The authentication UI must balance **security visibility** with **minimal friction**. Every auth-related element should feel like a natural part of the developer-tools aesthetic — precise, functional, and information-dense without being cluttered.

### Visual Language
- **Density:** Compact (32px height for navbar items, 14px base font).
- **Color Semantics:** Green = healthy/available, Yellow = caution, Red = blocked/exhausted, Blue = action/interactive.
- **Typography:** Monospace for quotas and timestamps; sans-serif for labels and CTAs.

---

## 2. Global Navigation Bar — Rate Limit Indicator

### Placement
Fixed top navbar, right-aligned before the avatar/login button. Minimum width 180px.

### Anatomy
```
[ Icon ] [ Progress Bar ] [ "14 / 20" Text ] [ Tier Badge ]
```

### Specifications
| Element | Value |
|---|---|
| Height | 32px |
| Background | `bg-slate-800` (dark mode) |
| Border | 1px solid `slate-700`, radius 6px |
| Progress Track | `slate-700`, height 6px, radius 3px |
| Progress Fill | Dynamic (see Color States) |
| Text | `text-xs font-mono text-slate-300` |
| Tier Badge | Pill shape, `text-[10px] uppercase tracking-wider` |
| Tooltip | Delay 300ms, max-width 240px |

### Responsive Behavior
- **Desktop (>1024px):** Full indicator with text, progress bar, and tier badge.
- **Tablet (768–1024px):** Collapsed to icon + progress bar only; text hidden.
- **Mobile (<768px):** Icon only; tap opens tooltip panel.

---

## 3. Quota Exhausted Modal

### Trigger
HTTP 429 response on any AI endpoint when `X-RateLimit-Remaining` reaches 0.

### Layout
Centered overlay modal, max-width 480px, padding 32px.

### Content Structure
```
[ Icon: Lock/Shield ] (48px, red-400)
[ Heading: "Daily Quota Exhausted" ] (text-xl, font-semibold)
[ Subtext: "You've used all 20 guest requests." ] (text-sm, slate-400)
[ Countdown Timer: "Resets in 04:32:18" ] (text-lg, font-mono, amber-400)
[ CTA Primary: "Login with GitHub for 200/day" ] (full-width button)
[ CTA Secondary: "Continue Browsing" ] (text button, dismiss)
```

### Overlay
- Backdrop: `bg-black/60` with `backdrop-blur-sm`.
- Modal container: `bg-slate-900`, border `slate-700`, radius 12px, shadow `2xl`.
- Entrance: fade-in + scale-up (see animations.md).

---

## 4. Auth Dropdown (Authenticated State)

### Trigger
Click on user avatar in navbar.

### Layout
Dropdown panel, width 240px, anchored bottom-right of avatar.

### Content Structure
```
[ Avatar (40px) + Name + Handle ]
[ Divider ]
[ Menu Item: "Dashboard" ]
[ Menu Item: "Settings" ]
[ Menu Item: "Admin Panel" ] (admin only, hidden otherwise)
[ Divider ]
[ Menu Item: "Logout" ] (text-red-400)
```

### Specifications
| Element | Value |
|---|---|
| Panel Background | `bg-slate-900` |
| Border | 1px solid `slate-700`, radius 8px |
| Shadow | `shadow-xl` |
| Avatar | 40px circle, border 2px `slate-700` |
| Name | `text-sm font-medium text-white` |
| Handle | `text-xs text-slate-400` |
| Menu Item Height | 36px, padding 8px 12px |
| Menu Item Hover | `bg-slate-800` |
| Admin Item | Prefixed with shield icon, `text-amber-400` |

---

## 5. Login Button (Unauthenticated State)

### Placement
Right-aligned in navbar, replacing avatar.

### Specifications
| Element | Value |
|---|---|
| Label | "Login with GitHub" |
| Icon | GitHub mark (16px, left of text) |
| Height | 32px |
| Padding | 8px 16px |
| Background | `bg-slate-800` |
| Border | 1px solid `slate-600`, radius 6px |
| Text | `text-sm font-medium text-white` |
| Hover | `bg-slate-700`, border `slate-500` |
| Active | `bg-slate-900`, scale 0.98 |

---

## 6. Guest Badge

### Placement
Adjacent to login button or in auth dropdown (when expanded for guests).

### Specifications
| Element | Value |
|---|---|
| Label | "GUEST" |
| Background | `bg-slate-800` |
| Text | `text-[10px] uppercase tracking-wider text-slate-400` |
| Border | 1px dashed `slate-600`, radius 4px |
| Padding | 2px 8px |

---

## 7. Color States

### Rate Limit Progress Bar
| Remaining % | Fill Color | Tier Badge Color |
|---|---|---|
| > 50% | `emerald-500` | `emerald-500/20` text `emerald-400` |
| 20–50% | `amber-500` | `amber-500/20` text `amber-400` |
| < 20% | `rose-500` | `rose-500/20` text `rose-400` |
| 0% | `rose-600` pulsing | `rose-600/20` text `rose-500` |

### Modal Icon
| State | Color |
|---|---|
| Quota Exhausted | `rose-400` |
| Rate Limited (Throttled) | `amber-400` |
| Session Expired | `blue-400` |

---

## 8. Typography Scale

| Usage | Size | Weight | Family | Color |
|---|---|---|---|---|
| Modal Heading | 20px (text-xl) | 600 | Sans | white |
| Modal Body | 14px (text-sm) | 400 | Sans | slate-400 |
| Countdown Timer | 18px (text-lg) | 500 | Mono | amber-400 |
| Navbar Quota Text | 12px (text-xs) | 400 | Mono | slate-300 |
| Tier Badge | 10px | 600 | Sans | dynamic |
| Menu Item | 14px (text-sm) | 400 | Sans | slate-300 |
| Menu Item Hover | 14px | 400 | Sans | white |

---

## 9. Spacing & Layout Tokens

| Token | Value |
|---|---|
| Navbar Height | 56px |
| Indicator Gap | 8px |
| Modal Padding | 32px |
| Dropdown Padding | 8px |
| Menu Item Gap | 4px |
| Avatar Gap | 12px |
| Tooltip Padding | 12px |
