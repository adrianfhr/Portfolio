# AI Playground — Component Behavior

> **Module:** AI Playground  
> **Version:** 1.0  
> **Scope:** Detailed interaction behavior for all major UI components.

---

## 1. Model Selector

### 1.1 Default State
- Displays the currently selected model name and cost tier badge.
- Chevron icon indicates expandability.

### 1.2 Open State
- Dropdown panel appears below the trigger with `z-index: 50`.
- Options are grouped by cost tier (Low, Standard, Premium).
- Each option shows: model name, provider (OpenAI), cost tier badge.
- Hovering an option highlights it with `background: var(--surface-hover)`.

### 1.3 Selection
- Clicking an option closes the dropdown and updates the selected model.
- A toast notification appears: "Switched to GPT-4o. Cost tier: Premium."
- If the model is changed mid-stream, a warning modal appears: "Changing the model will not affect the current response. Continue?"

### 1.4 Keyboard Behavior
- `Tab` focuses the selector.
- `Space` or `Enter` opens the dropdown.
- `Arrow Up/Down` navigates options.
- `Enter` selects the focused option.
- `Escape` closes the dropdown without selection.

---

## 2. Parameter Slider

### 2.1 Drag Behavior
- Dragging the thumb updates the numeric input in real time.
- The slider track fills from the left with `var(--primary)` to indicate value position.
- A subtle tooltip appears above the thumb while dragging, showing the exact value.

### 2.2 Numeric Input Behavior
- Typing a value updates the slider position.
- On `blur`, the value is clamped to the valid range.
- On `Enter`, the value is committed and focus moves to the next parameter.
- Invalid characters (letters, symbols) are rejected at the input level.

### 2.3 Reset Behavior
- Clicking "Reset to Defaults" animates all sliders back to default positions over 300ms using `transition: left 300ms ease-out`.
- Numeric inputs count up/down to their default values over the same duration.

---

## 3. System Prompt Editor

### 3.1 Typing Behavior
- Character counter updates on every `input` event.
- Counter color transitions:
  - `< 3000`: `var(--text-muted)`
  - `3000–3999`: `var(--warning)`
  - `4000`: `var(--error)`
- Reaching 4000 characters prevents further input (maxlength enforced).

### 3.2 Preset Application
- Normal click: Replaces textarea content. A brief flash animation (`background: var(--primary-alpha-10)`) confirms the action.
- Ctrl/Cmd + click: Appends preset text with a newline separator. Flash animation on appended text.

### 3.3 Focus Management
- On page load, focus is set to the message input (not the system prompt) to encourage immediate interaction.
- After clicking a preset, focus returns to the system prompt textarea.

---

## 4. Chat Input

### 4.1 Textarea Behavior
- Auto-expands from 48px to 200px based on content.
- `Enter` sends the message unless `Shift` is held.
- `Shift+Enter` inserts a newline.
- Empty or whitespace-only content disables the Send button.

### 4.2 Send Action
- Button transitions to a loading spinner (`24×24px`, `animation: spin 1s linear infinite`).
- Textarea is disabled.
- A user message bubble appears immediately in the chat area.
- SSE connection is established.

### 4.3 Stop Generation
- Appears only while streaming is active.
- Clicking aborts the `EventSource` connection.
- The partial AI response remains in the chat area.
- A small "Stopped" label appears below the partial response.

### 4.4 New Session
- Clears the chat area with a fade-out animation (200ms).
- Preserves all parameter settings.
- Focus returns to the message input.

---

## 5. Token Counter & Cost Display

### 5.1 Real-Time Updates
- During SSE streaming, the token counter increments by 1 for each `token` event.
- The counter uses `font-variant-numeric: tabular-nums` to prevent layout shift.
- Every 10 tokens, the cost estimate recalculates and updates.

### 5.2 Completion Behavior
- On `done` event, the final token count is displayed.
- The donut chart animates from 0 to final values over 600ms.
- The cost display performs a `scale(1.05)` pulse animation over 200ms.

### 5.3 Comparison Mode
- Each panel has an independent token counter and cost display.
- The panel with lower latency gets a subtle green border glow.
- The panel with higher cost gets a subtle orange border glow.

---

## 6. Comparison Mode Toggle

### 6.1 Activation
- Clicking "Compare Models" transforms the layout over 400ms using CSS Grid transitions.
- The chat area splits into two panels.
- The right analytics panel is hidden; each chat panel gets its own mini-analytics overlay.

### 6.2 Sync Prompt
- Floating button between panels.
- On click, the prompt from Panel A is copied to Panel B.
- Panel B's input flashes green briefly to confirm sync.

### 6.3 Deactivation
- Clicking "Exit Comparison" collapses back to single-panel layout.
- Both streams are aborted if still active.
- The most recently focused panel's state is preserved as the single-panel state.

---

## 7. History Sidebar

### 7.1 Item Display
- Each item shows: truncated user message (first 50 chars), timestamp, model icon.
- Hovering reveals action buttons: "Load", "Delete".

### 7.2 Load Behavior
- Clicking "Load" restores the session state.
- A confirmation toast appears: "Session from 14:32 restored."
- If a stream is currently active, a modal asks: "Loading a history item will cancel the current stream. Continue?"

### 7.3 Delete Behavior
- Individual delete requires no confirmation (undo toast appears for 5s).
- "Clear All" opens a confirmation modal with a typed safety phrase ("DELETE").

---

## 8. SSE Stream Renderer

### 8.1 Token Rendering
- Each token is appended to a text node inside the AI message bubble.
- A blinking cursor (`█`) follows the last token during streaming.
- The cursor disappears on stream completion.

### 8.2 Markdown Rendering
- After stream completion, the raw text is parsed as Markdown.
- Code blocks are highlighted using Prism.js with a copy button.
- Inline code, bold, italic, and lists render correctly.

### 8.3 Error Handling
- If an SSE error event is received, the stream stops.
- An inline error banner appears below the partial response.
- The error message is styled in `var(--error)` with an alert icon.
