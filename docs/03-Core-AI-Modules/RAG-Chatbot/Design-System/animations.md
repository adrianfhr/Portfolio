# Animations — RAG Chatbot Module

> **Module ID:** RAG-001-DS  
> **Version:** 1.0.0  
> **Status:** Draft

## 1. Animation Principles

Chat animations must feel responsive and alive without being distracting. The streaming nature of LLM responses already creates motion, so additional effects should support comprehension and state change rather than compete with the content.

### Timing Tokens
| Token | Duration | Usage |
|---|---|---|
| `instant` | 0ms | Token append and direct state swaps |
| `fast` | 100ms | Hover states and button feedback |
| `normal` | 200ms | Message entrance and small panel transitions |
| `smooth` | 300ms | Sidebar slide and modal transitions |
| `slow` | 500ms | Page-level state changes |

### Easing Tokens
| Token | Curve | Usage |
|---|---|---|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering the viewport |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric transitions |
| `linear` | `linear` | Continuous loops such as spinners |

## 2. Message Entrance Animations

### 2.1 User Message
- Fade in quickly when the user sends a prompt.
- Use a small upward translate and slight scale to signal confirmation.

### 2.2 Assistant Message
- Reveal the assistant bubble as soon as streaming begins.
- Avoid jittery motion while tokens are being appended.

### 2.3 System or Error Message
- Use a concise fade and settle motion for warnings or guardrail responses.
- Keep the emphasis on readability rather than spectacle.

## 3. Streaming and Typing Animations

- Use a subtle typing indicator during retrieval or before the first streamed token.
- Show a blinking cursor only while streaming is active.
- Fade the cursor out when the message is complete.

## 4. Panel and Layout Animations

- Sidebar and right-panel transitions should be smooth but short.
- Mobile overlays may slide in from the edge with a dimmed backdrop.
- Chat width changes should not animate message reflow aggressively.

## 5. Interactive Element Animations

- Send button hover and press states should feel responsive.
- Suggestion chips should rise or brighten slightly on hover.
- Source cards and citation pills may use small staggered entrances.

## 6. Reduced Motion

- Respect `prefers-reduced-motion: reduce`.
- Remove transform-heavy animations when reduced motion is enabled.
- Keep all states understandable through content and color alone.# Animations — RAG Chatbot Module

**Module ID:** RAG-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. Animation Principles

Chat animations must feel **responsive and alive** without being distracting. The streaming nature of LLM responses already provides dynamic motion; additional animations should support comprehension and state change, not compete for attention.

### Timing Tokens
| Token | Duration | Usage |
|---|---|---|
| `instant` | 0ms | Token append (immediate) |
| `fast` | 100ms | Hover states, button feedback |
| `normal` | 200ms | Panel open/close, message entrance |
| `smooth` | 300ms | Sidebar slide, modal transitions |
| `slow` | 500ms | Page-level state changes |

### Easing Tokens
| Token | Curve | Usage |
|---|---|---|
| `ease-out` | `cubic-bezier(0, 0, 0.2, 1)` | Elements entering |
| `ease-in-out` | `cubic-bezier(0.4, 0, 0.2, 1)` | Symmetric transitions |
| `linear` | `linear` | Continuous loops (spinners) |

---

## 2. Message Entrance Animations

### 2.1 User Message
- **Trigger:** User clicks send or presses Enter.
- **Animation:**
  - Opacity: 0 → 1 (150ms)
  - TranslateY: 8px → 0 (200ms `ease-out`)
  - Scale: 0.98 → 1.0 (150ms)
- **Origin:** Bottom-right (user bubble anchor).

### 2.2 Assistant Message (Streaming)
- **Trigger:** First `delta` SSE event.
- **Animation:**
  - Container fades in: opacity 0 → 1 (200ms).
  - No transform animation during streaming (tokens append instantly to avoid jitter).
- **Token Appends:** Instant (0ms). The natural typing motion IS the animation.

### 2.3 Assistant Message (Complete)
- **Trigger:** `done` SSE event.
- **Animation:** Subtle opacity confirmation (already 1.0, no change).
- **Citations:** Citation pills fade in with 50ms stagger after `citation` event.

### 2.4 System Message (Refusal / Error)
- **Trigger:** Guardrail or error event.
- **Animation:**
  - Opacity: 0 → 1 (200ms)
  - TranslateY: 4px → 0 (200ms)
  - Scale: 0.99 → 1.0 (150ms)
- **Color:** Subtle background color transition from transparent to slate/emerald (200ms).

---

## 3. Streaming & Typing Animations

### 3.1 Typing Indicator (Retrieval Phase)
- **Trigger:** Message sent, awaiting first token.
- **Animation:** Three dots, each scales from 0.6 to 1.0 sequentially.
  - Dot 1: 0ms delay, 400ms duration.
  - Dot 2: 150ms delay, 400ms duration.
  - Dot 3: 300ms delay, 400ms duration.
  - Loop: infinite.
- **Easing:** `ease-in-out`.

### 3.2 Token Cursor
- **Trigger:** During streaming.
- **Visual:** Subtle blinking cursor at end of assistant message text.
- **Animation:** Opacity 1 → 0 → 1 over 800ms, infinite.
- **Disappearance:** Cursor fades out (100ms) on `done` event.

### 3.3 Stop Button Pulse
- **Trigger:** Streaming active.
- **Animation:** Square stop button has subtle `box-shadow` pulse (`ring-2 ring-rose-500/30`) with 2s interval.
- **Purpose:** Indicates active generation that can be interrupted.

---

## 4. Panel & Layout Animations

### 4.1 Sidebar Slide (Desktop)
- **Trigger:** Toggle sidebar button.
- **Open:**
  - Width: 0 → 240px (250ms `ease-in-out`).
  - Opacity: 0 → 1 (200ms, 50ms delay).
- **Close:**
  - Width: 240px → 0 (200ms `ease-in-out`).
  - Opacity: 1 → 0 (150ms).

### 4.2 Sidebar Overlay (Mobile)
- **Trigger:** Hamburger menu tap.
- **Open:**
  - Backdrop: opacity 0 → 0.5 (200ms).
  - Panel: translateX(-100%) → 0 (250ms `ease-out`).
- **Close:**
  - Backdrop: opacity 0.5 → 0 (150ms).
  - Panel: translateX(0) → -100% (200ms `ease-in`).

### 4.3 Right Panel Toggle
- **Trigger:** Toggle button in header.
- **Open:**
  - Width: 0 → 320px (250ms `ease-in-out`).
  - Content fade: opacity 0 → 1 (150ms, 100ms delay).
- **Close:**
  - Width: 320px → 0 (200ms).
  - Content fade: opacity 1 → 0 (100ms).

### 4.4 Chat Area Resize
- **Trigger:** Sidebar or right panel opens/closes.
- **Animation:** Flex width adjusts smoothly via CSS `transition: width 250ms ease-in-out`.
- **Message List:** No reflow animation; messages stay static during resize.

---

## 5. Interactive Element Animations

### 5.1 Send Button
- **Hover:** Scale 1.0 → 1.05 (100ms), background lightens.
- **Active/Press:** Scale 1.0 → 0.95 (50ms), background darkens.
- **Release:** Scale back to 1.0 (100ms `ease-out`).
- **Loading:** Icon morphs from arrow to spinner (cross-fade 100ms); spinner rotates 360° linear infinite (800ms per rotation).

### 5.2 Suggestion Chips
- **Hover:** Background `slate-800` → `slate-700` (150ms); translateY 0 → -1px (100ms).
- **Click:** Scale 1.0 → 0.97 (50ms), then back to 1.0 (100ms).
- **Stagger Entrance:** On empty state render, chips fade in with 50ms stagger (opacity 0 → 1, translateY 4px → 0).

### 5.3 Citation Pills
- **Hover:** Background opacity increases; scale 1.0 → 1.05 (100ms).
- **Click:** Scale 1.0 → 0.95 → 1.0 (150ms `spring`), ring highlight appears.
- **Ring Highlight:** `ring-2 ring-amber-400` fades in (100ms), holds 2s, fades out (300ms).

### 5.4 Source Chunk Cards (Right Panel)
- **Entrance:** On new sources, cards slide in from right with 80ms stagger.
  - translateX: 16px → 0
  - opacity: 0 → 1
  - duration: 200ms `ease-out`

### 5.5 Process Step Cards
- **Active:** Left border accent animates in (width 0 → 2px, 150ms).
- **Complete:** Checkmark icon scales from 0 → 1 with `spring` easing (200ms).
- **Error:** Red X icon shakes horizontally (translateX -2px → 2px, 3 cycles, 200ms total).

---

## 6. Scroll Behaviors

### 6.1 Auto-Scroll
- **Trigger:** New message or token append while user is at bottom.
- **Animation:** Smooth scroll to bottom over 200ms `ease-out`.
- **Interruption:** If user scrolls up >100px during animation, auto-scroll pauses.

### 6.2 Scroll-to-Bottom Button
- **Trigger:** User scrolled up and new message arrives.
- **Animation:** Button fades in (opacity 0 → 1, translateY 8px → 0, 150ms).
- **Dismiss:** Fades out when user manually scrolls to bottom.

---

## 7. State Transition Animations

### 7.1 Empty → Loading
- User message enters (see 2.1).
- Typing indicator fades in below (150ms).
- Suggestion chips fade out (100ms).

### 7.2 Loading → Streaming
- Typing indicator fades out (100ms).
- Assistant message container fades in (200ms).
- First token appears instantly.

### 7.3 Streaming → Complete
- Stop button fades out, send button fades in (cross-fade 150ms).
- Token cursor fades out (100ms).
- Citations fade in with stagger (50ms each).
- Timestamp fades in below message (200ms).

### 7.4 Loading → Refusal
- Typing indicator fades out (100ms).
- System message fades in (200ms).
- Right panel updates to show guardrail details.

---

## 8. Accessibility & Motion Preferences

### 8.1 Reduced Motion (`prefers-reduced-motion: reduce`)
- All transforms disabled (no translate, no scale).
- Opacity transitions reduced to 50ms or removed.
- Typing indicator dots become static (no pulse).
- Token cursor becomes static line (no blink).
- Spinner replaced with static "Loading..." text.
- Panel open/close becomes instant.
- Stagger animations removed; all elements appear simultaneously.

### 8.2 Focus Management
- Focus ring (`ring-2 ring-blue-500`) appears instantly on focus.
- No animated focus movement.
- Send button receives focus after message send (for keyboard retry).
