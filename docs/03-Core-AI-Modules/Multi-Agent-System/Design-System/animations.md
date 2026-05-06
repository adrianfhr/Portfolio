# Animations — Multi-Agent System

> **Module:** Multi-Agent System  
> **Version:** 1.0  
> **Layout Philosophy:** CI/CD pipeline meets node graph. Motion should make dependency execution legible without turning the graph into noise.

## 1. Animation Principles

- Motion should explain workflow progress and dependency state.
- Prefer short transitions on nodes and edges over decorative movement.
- The graph itself should feel active when tasks are in progress, but never chaotic.

## 2. Key Animations

### 2.1 Connection Pulse
- The connection status dot can pulse gently when the system is connected.

### 2.2 Node State Changes
- Pending, active, completed, failed, and cancelled states should transition with a quick color and opacity change.
- The active node may use a soft glow or border emphasis.

### 2.3 Edge Flow
- Active edges can animate with a subtle flowing dash to show dependency execution.
- Completed edges should settle into a stable state.

### 2.4 Progress Indicator
- Active nodes should show a fill bar or shimmer that indicates progress or simulated delay.

### 2.5 Panel Transitions
- Detail panels and timeline drawers should slide in and out smoothly.
- Keep the graph itself steady while side panels change.

## 3. State Transition Guidance

- Use motion to confirm a change in state, not to draw attention away from the workflow.
- Avoid rapid repeated transitions when multiple nodes update at once.

## 4. Reduced Motion

- Respect `prefers-reduced-motion`.
- Replace pulses and flowing edges with static color and icon states when needed.
- Keep the workflow legible without animation.# Multi-Agent System — Animation Specification

> **Module:** Multi-Agent System  
> **Version:** 1.0  
> **Philosophy:** Animations must convey system liveness and state transitions clearly. Use motion to guide attention, not distract. All animations ≤ 600ms.

---

## 1. Graph Node Animations

### 1.1 Node Entrance
- **Trigger:** Planner generates task graph, nodes appear on canvas.
- **Animation:** `scale(0.5) → scale(1)`, `opacity: 0 → 1`
- **Duration:** `300ms`
- **Easing:** `cubic-bezier(0.34, 1.56, 0.64, 1)` (spring/overshoot)
- **Stagger:** `50ms` between each node for a cascading effect.

### 1.2 Node Status Transition
- **Trigger:** Agent status changes (pending → in-progress → completed/failed).
- **Animation:** Border color cross-fade + subtle pulse.
- **Duration:** `300ms`
- **Easing:** `ease-out`
- **Completed Specific:** Green glow effect (`box-shadow: 0 0 20px rgba(16,185,129,0.3)`) fades in over `400ms`, then out over `600ms`.
- **Failed Specific:** Shake animation (horizontal, 4px amplitude, 300ms).

### 1.3 Node Hover
- **Trigger:** Mouse hover over node.
- **Animation:** `translateY(-2px)`, `box-shadow` intensifies.
- **Duration:** `150ms`
- **Easing:** `ease-out`

### 1.4 Node Selection
- **Trigger:** Click on node.
- **Animation:** `box-shadow: 0 0 0 4px var(--primary-alpha-30)` appears with `scale(1) → scale(1.02) → scale(1)`.
- **Duration:** `200ms`

---

## 2. Edge Animations

### 2.1 Edge Draw
- **Trigger:** Task graph is generated.
- **Animation:** `stroke-dashoffset` animates from full length to 0.
- **Duration:** `400ms`
- **Easing:** `ease-out`

### 2.2 Active Flow
- **Trigger:** Source agent completes, target agent starts.
- **Animation:** A traveling dot or dashed-line movement along the edge.
- **Keyframes:**
  ```css
  @keyframes edgeFlow {
    from { stroke-dashoffset: 24; }
    to { stroke-dashoffset: 0; }
  }
  ```
- **Duration:** `1000ms`
- **Iteration:** `infinite`
- **Easing:** `linear`

### 2.3 Completed Edge
- **Trigger:** Target agent completes.
- **Animation:** Color transition to green.
- **Duration:** `300ms`

---

## 3. Progress Bar Animations

### 3.1 Indeterminate (Simulated Delay)
- **Animation:** Shimmer effect moving left to right.
- **Keyframes:**
  ```css
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
  ```
- **Duration:** `1500ms`
- **Iteration:** `infinite`
- **Background:** `linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)`

### 3.2 Determinate (Actual Progress)
- **Animation:** Width expands from current to target percentage.
- **Duration:** `300ms`
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`

---

## 4. Panel Animations

### 4.1 Detail Panel Slide-In
- **Animation:** `translateX(100%) → translateX(0)`
- **Duration:** `300ms`
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`
- **Backdrop:** `opacity: 0 → 0.3`, `200ms`.

### 4.2 Detail Panel Slide-Out
- **Animation:** `translateX(0) → translateX(100%)`
- **Duration:** `200ms`
- **Easing:** `ease-in`

### 4.3 Timeline Expand/Collapse
- **Animation:** `height` transition.
- **Duration:** `300ms`
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`

---

## 5. Connection Status Animations

### 5.1 Pulse Dot
- **Trigger:** Connection is healthy.
- **Animation:**
  ```css
  @keyframes pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50% { transform: scale(1.4); opacity: 0.5; }
  }
  ```
- **Duration:** `2000ms`
- **Iteration:** `infinite`

### 5.2 Reconnecting Spinner
- **Animation:** `rotate(0deg) → rotate(360deg)`
- **Duration:** `1000ms`
- **Iteration:** `infinite`
- **Easing:** `linear`

---

## 6. Button & Feedback Animations

### 6.1 Start Button Press
- **Animation:** `scale(0.97)` on mousedown, `scale(1)` on mouseup.
- **Duration:** `100ms`

### 6.2 Stop Button Press
- **Animation:** `scale(0.97)` + background flash to red.
- **Duration:** `100ms`

### 6.3 Toast Notification
- **Trigger:** Workflow completes, fails, or is cancelled.
- **Animation:** `translateY(-16px) → translateY(0)`, `opacity: 0 → 1`
- **Duration:** `300ms`
- **Auto-dismiss:** `opacity: 1 → 0`, `translateY(0) → translateY(-8px)`, `200ms`, after `5s`.

### 6.4 Timeline Entry Appear
- **Trigger:** New log entry added.
- **Animation:** `height: 0 → auto`, `opacity: 0 → 1`
- **Duration:** `250ms`
- **Easing:** `ease-out`

---

## 7. Graph Canvas Animations

### 7.1 Fit View
- **Trigger:** Click "Fit View" button.
- **Animation:** Viewport smoothly pans and zooms to fit all nodes.
- **Duration:** `400ms`
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)`

### 7.2 Zoom
- **Trigger:** Mouse wheel or pinch.
- **Animation:** Smooth zoom with `transform: scale()`.
- **Duration:** `150ms` (debounced)
- **Easing:** `ease-out`

---

## 8. Reduced Motion Support

All animations respect `prefers-reduced-motion: reduce`:

| Animation | Reduced Motion Behavior |
|---|---|
| Node entrance | Instant appearance |
| Status transition | Instant color change |
| Node hover | No transform |
| Edge flow | Static green line |
| Progress shimmer | Static gray fill |
| Panel slide | Instant snap |
| Pulse dot | Static green dot |
| Toast | Instant appearance |
| Timeline entry | Instant appearance |
| Graph fit view | Instant snap |
