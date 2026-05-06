# AI Playground — Accessibility Specification

> **Module:** AI Playground  
> **Version:** 1.0  
> **Standard:** WCAG 2.1 Level AA

---

## 1. Keyboard Navigation

### 1.1 Global Shortcuts

| Shortcut | Action | Context |
|---|---|---|
| `Tab` / `Shift+Tab` | Navigate between focusable elements | Global |
| `Enter` | Activate focused button, select dropdown option | Global |
| `Space` | Toggle sliders, open dropdowns | Global |
| `Escape` | Close dropdowns, modals, bottom sheets | Global |
| `Ctrl/Cmd + Enter` | Send message from textarea | Chat input |
| `Ctrl/Cmd + 1-4` | Apply preset 1-4 | System prompt editor |
| `/` | Focus chat input | Global (when no input focused) |

### 1.2 Parameter Panel Navigation

- All sliders: `Tab` to focus, `Arrow Left/Right` to adjust by step, `Page Up/Down` to adjust by 10× step.
- Numeric inputs: `Tab` to focus, type value, `Enter` to commit.
- Preset buttons: `Tab` to focus, `Enter` to apply.

### 1.3 Chat Area Navigation

- Message bubbles are **not** in the tab order (they are read-only).
- The chat area itself has `role="log"` and `aria-live="polite"` so screen readers announce new messages.
- Code blocks inside messages have a "Copy" button that is tab-focusable.

---

## 2. Screen Reader Support

### 2.1 Live Regions

| Element | ARIA Attributes | Behavior |
|---|---|---|
| Token counter | `aria-live="polite"`, `aria-atomic="true"` | Announces final token count after streaming stops |
| Cost estimate | `aria-live="polite"`, `aria-atomic="true"` | Announces final cost after streaming stops |
| Latency badge | `aria-label="Response latency: 1.2 seconds, rated fast"` | Announced on appearance |
| Error banner | `aria-live="assertive"`, `role="alert"` | Immediately interrupts to announce errors |
| Streaming status | `aria-live="polite"` | Announces "AI is responding" when stream starts |

### 2.2 Token Streaming Accessibility

- **Problem:** Rapid token updates would overwhelm screen readers.
- **Solution:** The streaming text is **not** in a live region. Instead:
  - On stream start: Announce "AI is generating a response."
  - On stream end: Announce "Response complete. 166 tokens. Cost 0.000247 dollars."
  - During streaming: The visual cursor is `aria-hidden="true"`.

### 2.3 Parameter Tooltips

- Each tooltip icon is a `<button>` with `aria-label="Explain Temperature parameter"`.
- The tooltip content is in a `role="tooltip"` element connected via `aria-describedby`.
- On focus, the tooltip appears and is announced by the screen reader.

### 2.4 Comparison Mode

- Each panel has `aria-label="Model comparison panel A: GPT-4o-mini"`.
- The VS badge is `aria-hidden="true"` (decorative).
- Sync button announces: "Sync prompt from panel A to panel B."

---

## 3. Visual Accessibility

### 3.1 Color Contrast

| Element | Foreground | Background | Contrast Ratio |
|---|---|---|---|
| Primary text | `#0F172A` (light) / `#F8FAFC` (dark) | Surface | ≥ 15:1 |
| Muted text | `#64748B` (light) / `#94A3B8` (dark) | Surface | ≥ 4.6:1 |
| User message text | `#FFFFFF` | `#2563EB` | ≥ 4.5:1 |
| AI message text | `#0F172A` (light) / `#F8FAFC` (dark) | `#FFFFFF` (light) / `#1E293B` (dark) | ≥ 12:1 |
| Error text | `#EF4444` (light) / `#F87171` (dark) | Surface | ≥ 4.5:1 |
| Success badge text | `#059669` | `#D1FAE5` | ≥ 4.5:1 |

### 3.2 Focus Indicators

- All interactive elements have a **visible focus ring**:
  - `outline: 2px solid var(--primary)`
  - `outline-offset: 2px`
  - `border-radius: inherit`
- Focus rings are never suppressed (`*:focus-visible { outline: ... }`).
- Sliders show a thickened track color on focus.

### 3.3 Text Sizing

- Base font size: `16px` (prevents iOS zoom on input focus).
- All text scales with browser zoom without breaking layout up to 200%.
- Line height minimum: `1.4` for readability.

---

## 4. Motion & Animation

### 4.1 Reduced Motion

- All animations respect `prefers-reduced-motion: reduce`.
- When reduced motion is preferred:
  - Streaming cursor is static (no blink).
  - Layout changes are instant.
  - Charts appear in final state.
  - Toasts appear instantly.
- A "Reduce Motion" toggle is available in a settings menu (synced with OS preference by default).

### 4.2 Vestibular Disorder Safety

- No parallax scrolling.
- No rapid flashing (all blinks are ≤ 1Hz).
- No large-area motion that could trigger discomfort.

---

## 5. Semantic HTML

### 5.1 Structure

```html
<main role="main">
  <section aria-label="Parameter controls">
    <!-- Model selector, sliders, prompt editor -->
  </section>
  <section aria-label="Chat conversation">
    <div role="log" aria-live="polite" aria-atomic="false">
      <!-- Message bubbles -->
    </div>
  </section>
  <section aria-label="Token and cost analytics">
    <!-- Charts, latency table -->
  </section>
</main>
```

### 5.2 Headings

- Page title: `<h1>AI Playground</h1>` (visually hidden if needed).
- Panel titles: `<h2>` (Parameters, Chat, Analytics).
- Sub-sections: `<h3>` (Token Breakdown, Latency History).

---

## 6. Form Accessibility

### 6.1 Labels

- Every input has an associated `<label>` or `aria-label`:
  - Temperature slider: `<label for="temperature">Temperature</label>`
  - Numeric input: `aria-label="Temperature value"`
- The character counter is connected via `aria-describedby`:
  ```html
  <textarea aria-describedby="prompt-counter"></textarea>
  <span id="prompt-counter">42 of 4000 characters</span>
  ```

### 6.2 Error Announcements

- Validation errors are linked to inputs via `aria-errormessage`:
  ```html
  <input aria-invalid="true" aria-errormessage="temp-error">
  <span id="temp-error" role="alert">Temperature must be between 0.0 and 2.0</span>
  ```

---

## 7. Testing Checklist

- [ ] All interactive elements are reachable via keyboard only.
- [ ] Focus order is logical and follows visual layout.
- [ ] Screen reader announces message arrivals correctly.
- [ ] Screen reader does not flood during token streaming.
- [ ] Color contrast passes WCAG AA for all text/background pairs.
- [ ] Focus indicators are visible on all themes.
- [ ] Page is usable at 200% browser zoom.
- [ ] Animations respect `prefers-reduced-motion`.
- [ ] No keyboard traps exist in modals, dropdowns, or panels.
- [ ] ARIA live regions do not duplicate announcements.
