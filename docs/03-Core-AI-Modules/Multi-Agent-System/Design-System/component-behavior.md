# Multi-Agent System — Component Behavior

> **Module:** Multi-Agent System  
> **Version:** 1.0  
> **Scope:** Detailed interaction behavior for all major UI components.

---

## 1. Workflow Input Textarea

### 1.1 Typing Behavior
- Character counter updates on every keystroke.
- Counter color transitions: gray → orange (800 chars) → red (1000 chars).
- At 1000 characters, further input is blocked.
- `Shift+Enter` inserts a newline; `Enter` alone does nothing (prevents accidental submission).

### 1.2 Validation
- Empty or whitespace-only input disables the "Start Workflow" button.
- A shake animation plays on the textarea if the user presses Start while empty.

### 1.3 Focus Management
- On page load, focus is set to the textarea.
- After starting a workflow, focus is removed to prevent accidental double-submission.

---

## 2. Start Workflow Button

### 2.1 Default State
- Primary button style, full width of sidebar.
- Icon: Lightning bolt.
- Tooltip on hover: "Submit your request to the agent team."

### 2.2 Loading State
- Button text changes to "Starting..." with a spinner.
- Disabled for 2 seconds to prevent double-click.
- On success, the button transitions to "Workflow Running" (muted style) and a Stop button appears beside it.

### 2.3 Disabled State
- Muted background, no pointer events.
- Reasons: empty input, active workflow, API unreachable.
- Tooltip explains the specific reason.

---

## 3. Stop Workflow Button

### 3.1 Appearance
- Appears only when a workflow is active.
- Danger outline style (red border, red text).
- Icon: Stop square.

### 3.2 Click Behavior
- Confirmation modal: "Stop the current workflow? Partial results will be preserved."
- On confirm, sends `POST /api/v1/agents/stop-workflow/{job_id}`.
- Button shows "Stopping..." spinner for up to 2s.
- On success, all in-progress nodes transition to "Cancelled" (amber).

---

## 4. Simulate Delay Toggle

### 4.1 Default State
- Checked (enabled) by default.
- Tooltip: "Add 1-3 second delays between agents for visual effect."

### 4.2 Locked State
- Disabled while workflow is active.
- Visual: Grayscale, opacity 0.5.
- Tooltip: "Simulation setting is locked while a workflow is running."

### 4.3 Toggle Animation
- Knob slides left/right over 200ms with spring easing.
- Track color transitions from gray to primary.

---

## 5. Agent Graph Node

### 5.1 Default State
- Static card with agent icon, role name, and "Pending" status.
- Border is gray.
- No progress bar.

### 5.2 In-Progress State
- Border transitions to blue over 300ms.
- Progress bar appears with indeterminate shimmer animation.
- Status text updates: "In Progress" → "Processing..." → "Finalizing..." (rotating messages).
- Latency timer starts counting up from 0.

### 5.3 Completed State
- Border transitions to green over 300ms.
- Progress bar fills to 100% with a green glow effect.
- Checkmark icon appears with a `scale(0) → scale(1)` bounce animation.
- Final latency and token metrics are displayed.
- Connected outgoing edges animate with a green flow effect.

### 5.4 Failed State
- Border transitions to red over 300ms.
- Progress bar turns red and freezes at current position.
- X icon appears with a shake animation.
- Error message is truncated to one line; full message in detail panel.
- Connected outgoing edges turn red dashed.

### 5.5 Cancelled State
- Border transitions to amber over 300ms.
- Stop icon appears.
- Progress bar freezes.
- Status: "Cancelled by user."

### 5.6 Click Behavior
- Opens the detail panel with the agent's full input, output, metrics, and logs.
- Node gets a subtle `box-shadow: 0 0 0 4px var(--primary-alpha-30)` focus ring.

### 5.7 Hover Behavior
- Slight elevation increase (`translateY(-2px)`, `box-shadow` intensifies).
- Tooltip appears after 500ms delay showing task name and truncated description.

---

## 6. Graph Canvas

### 6.1 Zoom & Pan
- Mouse wheel: Zoom in/out centered on cursor position.
- Pinch gesture: Zoom on touch devices.
- Click-drag on background: Pan the canvas.
- Min zoom: 0.5×, Max zoom: 2×.

### 6.2 Fit View Button
- Floating action button in bottom-right of canvas.
- On click, animates the viewport to fit all nodes within view over 400ms.

### 6.3 Background
- Dot grid pattern (`rgba(255,255,255,0.03)` dots on dark background).
- Provides spatial context during pan/zoom.

---

## 7. Detail Panel

### 7.1 Open Behavior
- Slides in from the right over 300ms.
- Backdrop fades in simultaneously.
- Body scroll is locked while panel is open.

### 7.2 Close Behavior
- Click backdrop, click X button, or press Escape.
- Slides out over 200ms.
- Body scroll restored.

### 7.3 Content Loading
- If the agent is still in progress, output section shows a loading skeleton.
- Metrics update in real time if the agent is in progress.
- "Retry Task" button is hidden unless status is `failed` or `cancelled`.

### 7.4 Copy Output
- Clicking "Copy Output" copies the raw output to clipboard.
- Button text changes to "Copied!" for 2s, then reverts.

---

## 8. Execution Timeline

### 8.1 Entry Animation
- New entries appear with `height: 0 → auto`, `opacity: 0 → 1` over 250ms.
- Auto-scrolls to bottom unless user has scrolled up.

### 8.2 Scroll Pause
- When the user scrolls up manually, auto-scroll pauses.
- A "Jump to Bottom" button appears in the bottom-right.
- Clicking it resumes auto-scroll.

### 8.3 Expand/Collapse
- Clicking the panel header toggles between 200px and 400px height.
- Animation uses `height` transition over 300ms.

---

## 9. Connection Status Indicator

### 9.1 Connected
- Green dot with subtle pulse animation (`scale(1) → scale(1.4) → scale(1)`, `opacity` fade).
- Text: "Connected" in green.

### 9.2 Reconnecting
- Amber dot, static.
- Text: "Reconnecting..." with a spinner.
- Tooltip: "Attempting to re-establish real-time connection."

### 9.3 Disconnected
- Red dot, static.
- Text: "Disconnected" in red.
- Tooltip: "Real-time updates unavailable. Check your network connection."

---

## 10. History List

### 10.1 Item Interaction
- Clicking a history item loads the workflow state into the graph in **read-only mode**.
- Past workflows cannot be restarted from history; they are for inspection only.
- Active workflow is highlighted in the list with a left border in primary color.

### 10.2 Pagination
- "Load More" button fetches the next 10 items.
- Loading state shows a skeleton shimmer.
