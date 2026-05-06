# AI Playground — Animation Specification

> **Module:** AI Playground  
> **Version:** 1.0  
> **Philosophy:** Animations should feel snappy, purposeful, and never block interaction. Max duration: 400ms for UI transitions, 600ms for data visualizations.

---

## 1. Token Streaming Animation

### 1.1 Cursor Blink
- **Element:** Streaming cursor (`█`) at end of AI response.
- **Animation:** `opacity: 1 → 0 → 1`
- **Duration:** `1000ms`
- **Easing:** `steps(1, end)` (discrete blink)
- **Trigger:** Active SSE stream.
- **End:** Cursor fades out over `150ms` when stream completes.

### 1.2 Token Appear
- **Element:** Each newly streamed token.
- **Animation:** Subtle opacity fade-in.
- **Duration:** `50ms`
- **Easing:** `ease-out`
- **Note:** This is imperceptible individually but smooths rapid token delivery.

---

## 2. Layout Transitions

### 2.1 Comparison Mode Toggle
- **Trigger:** Click "Compare Models" / "Exit Comparison."
- **Animation:** CSS Grid `grid-template-columns` transition.
- **Duration:** `400ms`
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` (Material Design standard)
- **Properties:**
  - Chat panel width: 50% → 25% (per panel)
  - Analytics panel: visible → hidden
  - VS badge: `scale(0) → scale(1)` with `400ms` delay

### 2.2 Panel Slide (Mobile)
- **Trigger:** Open parameters or analytics bottom sheet.
- **Animation:** `translateY(100%) → translateY(0%)`
- **Duration:** `300ms`
- **Easing:** `cubic-bezier(0.32, 0.72, 0, 1)` (spring-like)
- **Backdrop:** `opacity: 0 → 0.5`, `background: black`

---

## 3. Parameter Control Animations

### 3.1 Slider Thumb Drag
- **Animation:** Thumb scales to `1.2×` while dragging.
- **Duration:** `150ms`
- **Easing:** `ease-out`
- **Tooltip:** `opacity: 0 → 1`, `translateY(8px) → translateY(0)`, `150ms`.

### 3.2 Reset to Defaults
- **Animation:** All sliders animate to default positions.
- **Duration:** `300ms`
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Numeric Inputs:** Count up/down using `requestAnimationFrame` over `300ms`.

### 3.3 Validation Shake
- **Trigger:** Invalid parameter submitted.
- **Animation:** Horizontal shake.
- **Keyframes:**
  ```css
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20% { transform: translateX(-4px); }
    40% { transform: translateX(4px); }
    60% { transform: translateX(-4px); }
    80% { transform: translateX(4px); }
  }
  ```
- **Duration:** `300ms`
- **Easing:** `ease-in-out`

---

## 4. Data Visualization Animations

### 4.1 Donut Chart Fill
- **Trigger:** Request completion.
- **Animation:** `stroke-dashoffset` from full circumference to target.
- **Duration:** `600ms`
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Stagger:** Prompt segment first (0ms delay), completion segment second (100ms delay).

### 4.2 Cost Pulse
- **Trigger:** Cost estimate updates.
- **Animation:** `scale(1) → scale(1.05) → scale(1)`
- **Duration:** `200ms`
- **Easing:** `ease-out`

### 4.3 Badge Appear
- **Trigger:** Fast/Slow latency badge assigned.
- **Animation:** `scale(0.8) → scale(1)`, `opacity: 0 → 1`
- **Duration:** `200ms`
- **Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (overshoot/spring)

---

## 5. Feedback Animations

### 5.1 Send Button Press
- **Animation:** `scale(0.95)` on mousedown, `scale(1)` on mouseup.
- **Duration:** `100ms`
- **Easing:** `ease-out`

### 5.2 Message Bubble Enter
- **Trigger:** New message appears in chat.
- **Animation:** `opacity: 0 → 1`, `translateY(8px) → translateY(0)`
- **Duration:** `200ms`
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`

### 5.3 History Item Append
- **Trigger:** New history item added.
- **Animation:** `height: 0 → auto`, `opacity: 0 → 1`
- **Duration:** `250ms`
- **Easing:** `ease-out`

### 5.4 Toast Notification
- **Trigger:** Action confirmation or warning.
- **Animation:** `translateY(-100%) → translateY(0)` (slide down from top)
- **Duration:** `300ms`
- **Easing:** `cubic-bezier(0.32, 0.72, 0, 1)`
- **Auto-dismiss:** `opacity: 1 → 0`, `translateY(0) → translateY(-8px)`, `200ms`, after `4s`.

### 5.5 Preset Flash
- **Trigger:** Preset button clicked.
- **Animation:** Background color flash.
- **Keyframes:**
  ```css
  @keyframes presetFlash {
    0% { background-color: transparent; }
    50% { background-color: var(--primary-alpha-20); }
    100% { background-color: transparent; }
  }
  ```
- **Duration:** `400ms`

---

## 6. Loading & Skeleton States

### 6.1 Button Spinner
- **Element:** SVG circle with `stroke-dasharray` animation.
- **Animation:** `rotate(0deg) → rotate(360deg)`
- **Duration:** `1000ms`
- **Easing:** `linear`
- **Iteration:** `infinite`

### 6.2 Skeleton Shimmer
- **Element:** Placeholder blocks while models load.
- **Animation:** Gradient sweep across block.
- **Keyframes:**
  ```css
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  ```
- **Duration:** `1500ms`
- **Easing:** `linear`
- **Iteration:** `infinite`

---

## 7. Reduced Motion Support

All animations respect `prefers-reduced-motion: reduce`:

| Animation | Reduced Motion Behavior |
|---|---|
| Token streaming cursor | Static block, no blink |
| Layout transitions | Instant snap, no transition |
| Slider reset | Instant value change |
| Chart fill | Instant final state |
| Cost pulse | No animation |
| Message enter | Instant appearance |
| Toast | Instant appearance, instant dismiss |
| Shimmer | Static gray background |

**Implementation:** Wrap all animation durations in a CSS custom property:
```css
@media (prefers-reduced-motion: reduce) {
  :root { --animation-duration-multiplier: 0; }
}
@media (prefers-reduced-motion: no-preference) {
  :root { --animation-duration-multiplier: 1; }
}
```
