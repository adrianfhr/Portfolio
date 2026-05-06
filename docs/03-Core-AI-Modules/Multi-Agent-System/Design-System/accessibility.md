# Accessibility — Multi-Agent System

> **Module:** Multi-Agent System  
> **Version:** 1.0  
> **Standard:** WCAG 2.1 AA

## 1. Keyboard Navigation

### 1.1 Global Shortcuts

| Shortcut | Action | Context |
|---|---|---|
| `Tab` / `Shift+Tab` | Navigate focusable elements | Global |
| `Enter` | Activate focused control | Global |
| `Escape` | Close panels and modals | Global |
| `Ctrl/Cmd + Enter` | Start workflow from the input area | Input |

### 1.2 Graph Navigation

- Graph nodes must be focusable or discoverable via alternate navigation.
- Selected nodes should show a clear focus or selection ring.
- Detail panel focus should return to the selected node when closed.

## 2. Screen Reader Support

- Connection state should be announced.
- Node progress, success, and failure changes should be announced.
- Timeline events should be readable in chronological order.

## 3. Visual Accessibility

- Use both color and shape/icon changes to differentiate node states.
- Maintain contrast on dark graph surfaces.
- Make progress bars and labels readable at small sizes.

## 4. Motion Accessibility

- Respect reduced motion preferences.
- Remove or simplify flowing edges and pulse effects when required.
- Avoid large motion across the entire graph area.

## 5. Testing Checklist

- [ ] Keyboard users can start, inspect, and stop workflows.
- [ ] Screen readers can understand state changes.
- [ ] Node state is not communicated by color alone.
- [ ] Reduced motion settings are respected.
- [ ] Focus order remains logical in drawers and modals.# Multi-Agent System — Accessibility Specification

> **Module:** Multi-Agent System  
> **Version:** 1.0  
> **Standard:** WCAG 2.1 Level AA

---

## 1. Keyboard Navigation

### 1.1 Global Shortcuts

| Shortcut | Action | Context |
|---|---|---|
| `Tab` / `Shift+Tab` | Navigate between focusable elements | Global |
| `Enter` | Activate focused button or node | Global |
| `Space` | Toggle switches, press buttons | Global |
| `Escape` | Close detail panel, modals | Global |
| `Ctrl/Cmd + Enter` | Start workflow from textarea | Input sidebar |
| `/` | Focus workflow input | Global |
| `?` | Open help modal | Global |

### 1.2 Graph Canvas Navigation

- The graph canvas is a single focusable region (`tabindex="0"`, `role="application"`).
- When focused, arrow keys pan the canvas.
- `+` / `-` keys zoom in/out.
- `0` key fits all nodes to view.
- `Tab` within the canvas cycles through visible nodes.
- Selected nodes can be activated with `Enter` to open the detail panel.

### 1.3 Node Navigation

- Each node is focusable when the canvas has focus.
- `Arrow Up/Down/Left/Right` moves focus to the nearest node in that direction.
- `Enter` opens the detail panel for the focused node.
- Focused nodes have a visible focus ring (`outline: 3px solid var(--primary)`).

---

## 2. Screen Reader Support

### 2.1 Live Regions

| Element | ARIA Attributes | Behavior |
|---|---|---|
| Workflow status | `aria-live="polite"`, `aria-atomic="true"` | Announces "Workflow started," "Workflow completed," "Workflow failed" |
| Agent status changes | `aria-live="polite"`, `aria-atomic="false"` | Announces "Researcher status changed to in progress" |
| Connection status | `aria-live="assertive"`, `role="status"` | Announces connection changes immediately |
| Timeline | `role="log"`, `aria-live="polite"` | Announces newest log entries |

### 2.2 Graph Accessibility

- **Problem:** Node graphs are inherently visual and difficult for screen readers.
- **Solution:** Provide an equivalent **linear list view** toggle:
  - A "List View" button switches the graph to a vertical list of agent cards.
  - List items are standard DOM elements with full screen reader support.
  - Each list item includes: agent role, status, latency, token count, and a button to view details.

### 2.3 Node Descriptions

Each node has comprehensive `aria-label`:
```html
<div role="button" aria-label="Planner agent. Status: In Progress. Task: Generate task graph. Started 3 seconds ago.">
```

### 2.4 Detail Panel

- Opens with `aria-modal="true"`.
- Focus is trapped within the panel while open.
- Focus returns to the triggering node when closed.
- All metrics are read as descriptive text (not just numbers).

---

## 3. Visual Accessibility

### 3.1 Color Contrast

| Element | Foreground | Background | Contrast Ratio |
|---|---|---|---|
| Node title | `#F1F5F9` | `#151E32` | ≥ 12:1 |
| Status text (pending) | `#94A3B8` | `#151E32` | ≥ 6:1 |
| Status text (in-progress) | `#60A5FA` | `#151E32` | ≥ 5:1 |
| Status text (completed) | `#34D399` | `#151E32` | ≥ 6:1 |
| Status text (failed) | `#F87171` | `#151E32` | ≥ 5:1 |
| Timeline text | `#94A3B8` | `#0B1120` | ≥ 6:1 |
| Input textarea text | `#F1F5F9` | `#151E32` | ≥ 12:1 |

### 3.2 Status Indicators Beyond Color

- **Pending:** Gray circle + text "Pending"
- **In Progress:** Animated spinner + text "In Progress"
- **Completed:** Checkmark icon + text "Completed"
- **Failed:** X icon + text "Failed"
- **Cancelled:** Stop icon + text "Cancelled"

### 3.3 Focus Indicators

- All interactive elements have a visible focus ring:
  - `outline: 3px solid var(--primary)`
  - `outline-offset: 2px`
- Graph nodes have a glowing focus ring when focused via keyboard.
- Focus rings are never suppressed.

---

## 4. Motion & Animation

### 4.1 Reduced Motion

- All animations respect `prefers-reduced-motion: reduce`.
- When reduced motion is preferred:
  - Node status changes are instant.
  - Progress bars are static.
  - Edge flow is static.
  - Panel transitions are instant.
  - Pulse dot is static.

### 4.2 Vestibular Safety

- No parallax or large-area scrolling animations.
- Graph pan/zoom is smooth and controllable.
- No rapid flashing (all animations are slow and gradual).

---

## 5. Semantic HTML

```html
<main role="main">
  <header>
    <h1>Multi-Agent System</h1>
    <span role="status" aria-live="assertive">Connected</span>
  </header>
  
  <section aria-label="Workflow input and controls">
    <!-- Textarea, buttons, history -->
  </section>
  
  <section aria-label="Agent workflow graph">
    <div role="application" aria-label="Interactive graph. Use arrow keys to pan, plus and minus to zoom.">
      <!-- React Flow graph -->
    </div>
  </section>
  
  <section aria-label="Execution timeline" role="log" aria-live="polite">
    <!-- Timeline entries -->
  </section>
</main>
```

---

## 6. Form Accessibility

### 6.1 Labels

- Workflow input:
  ```html
  <label for="workflow-input">Describe the task for the agent team</label>
  <textarea id="workflow-input" aria-describedby="input-counter input-help"></textarea>
  <span id="input-counter">45 of 1000 characters</span>
  <span id="input-help">Press Control+Enter to start the workflow.</span>
  ```

### 6.2 Toggle Switch

```html
<button role="switch" aria-checked="true" aria-label="Simulate agent delays">
  <span>Simulate delays</span>
</button>
```

---

## 7. Testing Checklist

- [ ] All interactive elements are reachable via keyboard only.
- [ ] Graph canvas can be navigated and nodes selected without a mouse.
- [ ] List view alternative provides full functionality for screen reader users.
- [ ] Workflow status changes are announced by screen readers.
- [ ] Agent state changes are announced without overwhelming the user.
- [ ] Color contrast passes WCAG AA for all status states.
- [ ] Focus indicators are visible on all themes.
- [ ] Page is usable at 200% browser zoom.
- [ ] Animations respect `prefers-reduced-motion`.
- [ ] Detail panel traps focus and returns focus on close.
- [ ] No keyboard traps exist in the graph canvas or panels.
