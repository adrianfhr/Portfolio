# AI Playground — States & Interaction Matrix

> **Module:** AI Playground  
> **Version:** 1.0

---

## 1. Global Application States

### 1.1 Idle State
**Trigger:** Page loaded, no active request.

**Visual Indicators:**
- Send button: Enabled, primary color.
- Input textarea: Enabled, placeholder visible.
- Parameters: All editable.
- Token counter: Hidden or showing "—".
- Analytics panel: Showing empty state or last session data.

**User Actions Allowed:**
- Modify parameters.
- Type and send messages.
- Switch models.
- Toggle comparison mode.
- Browse and load history.

---

### 1.2 Streaming State
**Trigger:** User sends a message, SSE connection established.

**Visual Indicators:**
- Send button: Replaced by "Stop Generation" button (red outline).
- Input textarea: Disabled, placeholder shows "AI is responding..."
- Parameters: Disabled (grayed out, `pointer-events: none`).
- Model selector: Disabled.
- Token counter: Visible, incrementing in real time.
- AI message bubble: Visible with streaming cursor (`█`) and partial text.
- Latency timer: Running, showing elapsed time.

**User Actions Allowed:**
- Stop generation.
- Scroll chat area.
- Switch history items (with confirmation modal).

**User Actions Blocked:**
- Sending new messages.
- Modifying parameters.
- Changing models.

---

### 1.3 Completed State
**Trigger:** SSE stream receives `done` event.

**Visual Indicators:**
- Send button: Returns to enabled state.
- Input textarea: Re-enabled, placeholder resets.
- Parameters: Re-enabled.
- Token counter: Final value displayed.
- Cost estimate: Final value with pulse animation.
- Latency badge: Fast/Slow badge appears if applicable.
- History sidebar: New item appended at the top.

**User Actions Allowed:**
- All idle state actions.
- Copy response text.
- Export response (future enhancement).

---

### 1.4 Error State
**Trigger:** SSE error, API error, validation error, network failure.

**Visual Indicators:**
- Send button: Enabled.
- Input textarea: Re-enabled.
- Parameters: Re-enabled.
- Error banner: Red banner at top of chat panel or inline in message bubble.
- Error types:
  - **Validation Error (400):** Field-level red borders and messages in parameters panel.
  - **Rate Limit (429):** Global banner with countdown timer.
  - **Upstream Error (500/503):** Inline message with "Retry" button.
  - **Network Error:** Toast notification with "Reconnect" action.

**User Actions Allowed:**
- Retry the failed request.
- Modify inputs to fix validation errors.
- Continue with new requests (unless rate limited).

---

### 1.5 Comparison Mode State
**Trigger:** User toggles "Compare Models."

**Visual Indicators:**
- Layout splits into two chat panels.
- Each panel has independent model selector, token counter, and latency timer.
- "VS" badge centered between panels.
- Analytics panel replaced by per-panel mini-analytics.

**Sub-States:**
- **Comparison Idle:** Both panels ready.
- **Comparison Single Streaming:** One panel streaming, other idle.
- **Comparison Dual Streaming:** Both panels streaming simultaneously.
- **Comparison Mixed:** One completed, one streaming/error.

---

## 2. Component States

### 2.1 Model Selector

| State | Visual | Interaction |
|---|---|---|
| Default | Closed, showing selected model | Click to open |
| Open | Dropdown expanded, options visible | Click to select, Escape to close |
| Disabled | Opacity 0.5, no pointer events | None (during streaming) |
| Loading | Skeleton shimmer in dropdown | Disabled |

### 2.2 Parameter Slider

| State | Visual | Interaction |
|---|---|---|
| Default | Track filled to value position | Drag or type to change |
| Active (dragging) | Thumb enlarged, tooltip visible | Dragging |
| Clamped | Value at min or max, thumb at edge | Cannot exceed bounds |
| Disabled | Grayscale, opacity 0.4 | None |

### 2.3 Send Button

| State | Visual | Interaction |
|---|---|---|
| Ready | Primary color, paper-plane icon | Click to send |
| Disabled (empty) | Muted color, opacity 0.5 | None |
| Loading | Spinner animation | Click to stop |
| Rate Limited | Red outline, timer display | None until reset |

### 2.4 Token Chart (Donut)

| State | Visual | Animation |
|---|---|---|
| Empty | Gray outline, "0" in center | None |
| Streaming | Partial fill, center updating | Smooth segment growth |
| Completed | Full fill, final values | 600ms ease-out fill |
| Error | Gray with red border | None |

### 2.5 History Item

| State | Visual | Interaction |
|---|---|---|
| Default | Compact row with truncated text | Hover reveals actions |
| Hover | Background highlight | Click to load, click delete icon |
| Loading | Opacity 0.7, spinner on row | Disabled |
| Selected (loaded) | Left border in primary color | None |

---

## 3. State Transition Diagram

```
┌─────────┐     send message      ┌─────────────┐
│  IDLE   │ ─────────────────────>│  STREAMING  │
└─────────┘                       └─────────────┘
     ▲                                 │
     │                                 │ done event
     │                                 │ error event
     │                                 v
     │     ┌─────────┐           ┌─────────┐
     └─────│  ERROR  │<──────────│COMPLETED│
           └─────────┘           └─────────┘
```

**Transitions:**
- `IDLE → STREAMING`: User sends a valid message.
- `STREAMING → COMPLETED`: SSE `done` event received.
- `STREAMING → ERROR`: SSE `error` event, network failure, or timeout.
- `STREAMING → IDLE`: User clicks "Stop Generation."
- `COMPLETED → IDLE`: Implicit; next interaction begins from idle.
- `ERROR → IDLE`: User dismisses error or modifies input.
- `ERROR → STREAMING`: User retries after fixing the error.

---

## 4. Comparison Mode State Matrix

| Panel A | Panel B | Allowed Actions |
|---|---|---|
| Idle | Idle | Send on either/both, sync prompt, change models |
| Streaming | Idle | Stop A, send B, sync A→B |
| Streaming | Streaming | Stop either/both, exit comparison |
| Completed | Idle | Send B, load history |
| Completed | Streaming | Stop B, load history (with confirmation) |
| Error | Idle | Retry A, send B |
| Error | Error | Retry either/both |
