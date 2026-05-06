# Multi-Agent System — States & Interaction Matrix

> **Module:** Multi-Agent System  
> **Version:** 1.0

---

## 1. Global Application States

### 1.1 Idle State
**Trigger:** Page loaded, no active workflow.

**Visual Indicators:**
- Start button: Enabled, primary style.
- Stop button: Hidden.
- Graph canvas: Empty state with placeholder text and illustration.
- Timeline: Empty state message.
- Simulate toggle: Enabled.
- Connection status: Green/amber depending on network.

**User Actions Allowed:**
- Type workflow input.
- Toggle simulate delay.
- Browse history.
- Load past workflows for inspection.

---

### 1.2 Starting State
**Trigger:** User clicks "Start Workflow."

**Visual Indicators:**
- Start button: "Starting..." with spinner, disabled.
- Stop button: Hidden (appears after start confirmation).
- Graph canvas: Empty, waiting for first state event.
- Input textarea: Disabled.
- Simulate toggle: Disabled.

**Duration:** Up to 500ms (API response time).

**Transitions:**
- Success → **Active State**
- Failure → **Error State**

---

### 1.3 Active State
**Trigger:** Workflow started successfully, job_id received.

**Visual Indicators:**
- Start button: Hidden or shows "Workflow Active" (muted).
- Stop button: Visible, enabled.
- Graph canvas: Nodes appear as the Planner generates the task graph. Edges draw between nodes.
- Timeline: Entries appear in real time.
- Input textarea: Disabled.
- Simulate toggle: Disabled.
- Detail panel: Can be opened for any node to view live metrics.

**User Actions Allowed:**
- Stop workflow.
- Click nodes to view details.
- Zoom/pan the graph.
- Scroll timeline.

**User Actions Blocked:**
- Start a new workflow.
- Modify input.
- Toggle simulate setting.

---

### 1.4 Completed State
**Trigger:** All agents complete successfully.

**Visual Indicators:**
- Start button: Returns to "Start Workflow", enabled.
- Stop button: Hidden.
- Graph canvas: All nodes green. Final result panel appears (overlay or sidebar).
- Timeline: Final "Workflow Completed" entry.
- Input textarea: Re-enabled.
- Simulate toggle: Re-enabled.
- Success toast: "Workflow completed in 14.2s."

**User Actions Allowed:**
- All idle state actions.
- Download result.
- Copy final output.

---

### 1.5 Failed State
**Trigger:** One or more agents fail after retries.

**Visual Indicators:**
- Start button: Returns to "Start Workflow", enabled.
- Stop button: Hidden.
- Graph canvas: Failed node(s) red. Downstream dependent nodes remain gray (pending).
- Timeline: Final "Workflow Failed" entry with error summary.
- Input textarea: Re-enabled.
- Error toast: "Workflow failed. [Agent] encountered an error."

**User Actions Allowed:**
- Retry the failed agent (and downstream tasks).
- Start a new workflow.
- Inspect error details in the failed node's detail panel.

---

### 1.6 Cancelled State
**Trigger:** User clicks "Stop Workflow."

**Visual Indicators:**
- Start button: Returns to "Start Workflow", enabled.
- Stop button: Hidden.
- Graph canvas: In-progress nodes turn amber. Completed nodes remain green.
- Timeline: Final "Workflow Cancelled by User" entry.
- Input textarea: Re-enabled.
- Warning toast: "Workflow stopped. Partial results preserved."

**User Actions Allowed:**
- Start a new workflow.
- Inspect partial results.

---

### 1.7 Error State
**Trigger:** API error, validation error, or network failure during start.

**Visual Indicators:**
- Start button: Returns to enabled state.
- Error banner: Red banner at top of sidebar with error message.
- Graph canvas: Unchanged (empty or previous state).

**User Actions Allowed:**
- Retry starting the workflow.
- Modify input to fix validation errors.

---

## 2. Node States

### 2.1 State Machine Diagram

```
┌─────────┐
│ PENDING │
└────┬────┘
     │ dependencies met
     v
┌─────────────┐     fail / timeout     ┌─────────┐
│ IN_PROGRESS │ ─────────────────────> │ FAILED  │
└──────┬──────┘                        └────┬────┘
       │ success                            │
       v                                    │ retry
  ┌──────────┐                              │
  │COMPLETED │ <────────────────────────────┘
  └────┬─────┘
       │ user stops workflow
       v
  ┌──────────┐
  │CANCELLED │
  └──────────┘
```

### 2.2 Transition Table

| From | To | Trigger | Visual Effect |
|---|---|---|---|
| Pending | In Progress | Dependencies completed | Border color gray→blue, progress bar appears |
| In Progress | Completed | Agent finishes successfully | Border blue→green, checkmark appears |
| In Progress | Failed | Error or timeout after retries | Border blue→red, X appears, shake animation |
| In Progress | Cancelled | User stops workflow | Border blue→amber, stop icon appears |
| Pending | Cancelled | User stops workflow | Border gray→amber |
| Failed | In Progress | User retries task | Border red→blue, progress bar restarts |

---

## 3. WebSocket Connection States

| State | Visual | Behavior |
|---|---|---|
| Connected | Green pulse dot | Real-time updates active |
| Reconnecting | Amber static dot + spinner | Buffering updates, will reconcile on connect |
| Disconnected | Red static dot | Polling fallback every 3s, updates may lag |
| Failed | Red dot + error text | User must refresh page to reconnect |

---

## 4. Interaction Matrix

| App State | Start WF | Stop WF | Retry | View History | Zoom Graph | View Detail |
|---|---|---|---|---|---|---|
| Idle | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
| Starting | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Active | ❌ | ✅ | ❌ | ✅ | ✅ | ✅ |
| Completed | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Failed | ✅ | ❌ | ✅ | ✅ | ✅ | ✅ |
| Cancelled | ✅ | ❌ | ❌ | ✅ | ✅ | ✅ |
| Error | ✅ | ❌ | ❌ | ✅ | ❌ | ❌ |
