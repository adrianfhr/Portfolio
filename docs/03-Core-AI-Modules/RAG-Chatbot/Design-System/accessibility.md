# Accessibility — RAG Chatbot Module

> **Module ID:** RAG-001-DS  
> **Version:** 1.0.0  
> **Status:** Draft

## 1. Keyboard Navigation

### 1.1 Global Shortcuts

| Shortcut | Action | Context |
|---|---|---|
| `Tab` / `Shift+Tab` | Navigate between focusable elements | Global |
| `Enter` | Activate focused control | Global |
| `Space` | Toggle controls such as chips and buttons | Global |
| `Escape` | Close dropdowns, drawers, and modals | Global |
| `Ctrl/Cmd + Enter` | Send message from the chat input | Chat input |
| `/` | Focus the chat input when nothing else is active | Global |

### 1.2 Chat Area Navigation

- Message bubbles should not clutter the tab order.
- The chat transcript should expose a readable live region for screen readers.
- Code blocks must provide a focusable copy action.

### 1.3 Sidebar and Right Panel

- All drawers and tabs must be reachable with keyboard alone.
- Focus should return to the triggering element when panels close.

## 2. Screen Reader Support

### 2.1 Live Regions

| Element | ARIA Attributes | Behavior |
|---|---|---|
| Message stream | `role="log"`, `aria-live="polite"` | Announces completed messages without flooding |
| Error banner | `role="alert"`, `aria-live="assertive"` | Announces failures immediately |
| Typing status | `aria-live="polite"` | Announces that the assistant is generating |

### 2.2 Streaming Accessibility

- Do not stream every token into the live region.
- Announce start and completion states instead of every partial update.
- Keep the visual cursor hidden from assistive technology.

## 3. Visual Accessibility

- Maintain strong contrast for user and assistant bubbles.
- Use color plus text or icons for citations and statuses.
- Ensure focus indicators are visible on all interactive controls.

## 4. Motion Accessibility

- Respect reduced motion preferences.
- Remove or simplify blinking and slide transitions when reduced motion is enabled.
- Avoid large-area movement that could distract or disorient users.

## 5. Form Accessibility

- Every input must have an associated label or accessible name.
- Error text should be linked to the input with `aria-describedby` or `aria-errormessage`.

## 6. Testing Checklist

- [ ] Keyboard-only interaction is complete.
- [ ] Screen readers announce message start and completion correctly.
- [ ] Contrast meets WCAG AA.
- [ ] Reduced motion is respected.
- [ ] No keyboard trap exists in overlays or drawers.# Accessibility — RAG Chatbot Module

**Module ID:** RAG-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. WCAG Target

This module aims for **WCAG 2.1 Level AA** compliance, with particular attention to dynamic content updates (streaming text, live logs) which require careful ARIA live region management.

---

## 2. Keyboard Navigation

### 2.1 Global Shortcuts
| Key | Action | Context |
|---|---|---|
| `Tab` / `Shift+Tab` | Navigate interactive elements | Global |
| `Enter` | Send message (when input focused) | Chat input |
| `Shift+Enter` | Newline in input | Chat input |
| `Escape` | Stop generation / close panels | Streaming / Panel open |
| `↑` / `↓` | Navigate conversation history | Sidebar focused |
| `?` | Show keyboard shortcuts (future) | Global |

### 2.2 Chat Input
- **Focusable:** Always (tabIndex=0).
- **Focus Ring:** `ring-2 ring-blue-500 ring-offset-2`.
- **Placeholder:** Announced by screen readers when empty.
- **Character Count:** `aria-live="polite"` updates when >1500 chars.

### 2.3 Message Navigation
- Each message is a focusable region (`tabIndex=0`) when using screen reader browse mode.
- **Copy Button:** Focusable via Tab; `Enter` copies message text.
- **Citations:** Focusable via Tab within message; `Enter` opens source panel.

### 2.4 Sidebar
- **Focus Trap:** When open on mobile (overlay), Tab cycles within sidebar.
- **Menu Items:** `↑` / `↓` navigate list; `Enter` selects; `Delete` triggers delete (with confirmation).
- **Escape:** Closes sidebar overlay.

### 2.5 Right Panel
- **Tabs:** `←` / `→` switch tabs when panel is focused.
- **Source Cards:** Tab navigates through cards; `Enter` expands/collapses.

---

## 3. Screen Reader Support

### 3.1 Live Regions for Streaming
The streaming nature of chat requires careful `aria-live` management to avoid overwhelming screen reader users.

#### Strategy: Polite Updates with Buffering
- **Container:** `role="log" aria-live="polite" aria-atomic="false"`.
- **Behavior:** Instead of announcing every token, buffer updates and announce every 3 seconds or at sentence boundaries.
- **Implementation:** Use a debounced announcement queue. Append tokens to a hidden buffer; every 3 seconds or on punctuation, update `aria-label` of the message container.

#### Message States
```
role="article"
aria-label="Assistant message: {buffered_text_so_far}"
aria-busy="true"  (during streaming)
aria-busy="false" (on complete)
```

### 3.2 Typing Indicator
```
role="status"
aria-live="polite"
aria-label="Assistant is retrieving sources"
```
- Announced once when indicator appears; NOT repeatedly.

### 3.3 Citations
```
role="button"
aria-label="Citation 1 from document CV_Adrian_2026.pdf, score 0.91"
```
- Screen reader users can navigate citations and understand source provenance.

### 3.4 Live Process Panel
```
role="complementary"
aria-label="Live process logs"
```
- Process steps:
```
role="listitem"
aria-label="Generation complete in 2.3 seconds"
```
- Updates are polite; screen reader announces step completions.

### 3.5 Empty State
```
role="region"
aria-label="Start a conversation"
```
- Suggestion chips:
```
role="button"
aria-label="Suggested question: What is your tech stack?"
```

---

## 4. Color & Contrast

### 4.1 Text Contrast
| Element | Foreground | Background | Ratio | Pass |
|---|---|---|---|---|
| User message text | white (#fff) | blue-600 (#2563eb) | 4.6:1 | AA |
| Assistant message text | slate-200 (#e2e8f0) | slate-800 (#1e293b) | 11.5:1 | AAA |
| Inline code text | amber-300 (#fcd34d) | slate-700 (#334155) | 8.2:1 | AAA |
| Citation pill text | amber-400 (#fbbf24) | amber-500/20 | 10.2:1 | AAA |
| System/refusal text | slate-200 (#e2e8f0) | emerald-900 (#064e3b) | 9.8:1 | AAA |
| Timestamp text | slate-500 (#64748b) | slate-900 (#0f172a) | 4.8:1 | AA |
| Placeholder text | slate-500 (#64748b) | slate-800 (#1e293b) | 4.1:1 | AA |
| Error toast text | rose-200 (#fecaca) | rose-900 (#7f1d1d) | 10.1:1 | AAA |

### 4.2 Non-Text Contrast
| Element | Requirement |
|---|---|
| Send button icon vs button bg | 3:1 (white vs blue-600 = pass) |
| Stop button icon vs button bg | 3:1 (white vs rose-600 = pass) |
| Focus ring | 3:1 against adjacent (blue-500 vs slate-800 = 3.2:1) |
| Active session border | 3:1 (blue-500 vs slate-800 = 3.2:1) |

### 4.3 Color Independence
- Message sender is identified by position (right=user, left=assistant), not just color.
- Code blocks have distinct background + border, not just color.
- Error states include icon + text + border, not just red color.

---

## 5. Motion & Vestibular Disorders

### 5.1 Reduced Motion Support
All animations respect `prefers-reduced-motion: reduce`:
- Token streaming appears instantly (no visual cursor motion).
- Typing indicator replaced with static "Retrieving sources..." text.
- Panel open/close instant.
- Message entrance instant.
- No stagger animations.

### 5.2 Auto-Scrolling
- Auto-scroll can be paused by scrolling up; this is a user-controlled motion.
- No forced scrolling that cannot be interrupted.

---

## 6. Cognitive Accessibility

### 6.1 Clear Feedback
- "Sending..." → "Retrieving sources..." → "Generating..." → "Complete" states are explicit.
- Error messages explain what happened and what to do ("Please try again" not just "Error").
- Refusal messages explain WHY the chatbot cannot answer.

### 6.2 Consistent Patterns
- All messages follow the same bubble pattern.
- All citations behave the same way.
- All errors appear in the same toast position.

### 6.3 Input Assistance
- Suggestion chips reduce cognitive load for users unsure what to ask.
- Character count prevents surprise truncation.
- Input placeholder provides examples.

---

## 7. Touch & Mobile Accessibility

### 7.1 Target Sizes
| Element | Minimum Size | Actual Size |
|---|---|---|
| Send button | 44×44px | 32px + padding = 48px |
| Stop button | 44×44px | 32px + padding = 48px |
| Citation pill | 44×44px | ~20px height + padding = 32px (improve to 44px touch target) |
| Suggestion chip | 44×44px | Height 32px + padding = 44px |
| Sidebar item | 44×44px | Height 64px |
| Panel toggle | 44×44px | 40px icon button + padding |

### 7.2 Touch Feedback
- `:active` state on all interactive elements.
- Ripple effect on suggestion chips (optional, 100ms).
- Input field lifts slightly on focus (translateY -1px) to indicate readiness.

---

## 8. Testing Checklist

- [ ] Chat flow works entirely with keyboard (no mouse).
- [ ] Screen reader announces message sender (user vs assistant).
- [ ] Screen reader does not announce every token individually.
- [ ] Streaming completion is announced.
- [ ] Citations are navigable and descriptive via screen reader.
- [ ] Error states are announced assertively.
- [ ] Color contrast meets AA for all text and UI components.
- [ ] Animations respect `prefers-reduced-motion`.
- [ ] Touch targets are >= 44×44px on mobile.
- [ ] Virtual keyboard does not obscure input or send button.
- [ ] Focus order is logical across sidebar, chat, and right panel.
- [ ] Focus is managed when panels open/close (no focus trap escape).
