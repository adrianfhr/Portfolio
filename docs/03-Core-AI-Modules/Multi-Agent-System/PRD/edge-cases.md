# Multi-Agent System — Edge Cases

> **Module:** Multi-Agent System  
> **Version:** 1.0

---

## EC-AGENT-001: Recursive Agent Loop

### Scenario
The Planner generates a task graph that would cause an agent to invoke itself recursively beyond the allowed depth.

### Expected Behavior
- **Server:** Validate the task graph for cycles and depth before execution.
- **Depth Check:** If any path in the task graph exceeds 3 levels, reject with `400 Bad Request` and message: `"Task graph exceeds maximum depth of 3."`
- **Cycle Check:** If a cycle is detected, reject with `400 Bad Request` and message: `"Task graph contains a cyclic dependency."`
- **UI:** Display a validation error banner with the specific task IDs causing the issue.

---

## EC-AGENT-002: Invalid Tool Call

### Scenario
An agent attempts to invoke a tool or function that does not exist or is malformed.

### Expected Behavior
- **Server:** Validate all tool calls against a whitelist of allowed tools.
- **Invalid Call:** Log the attempt, mark the task as `failed`, and broadcast the failure state.
- **Retry:** The retry mechanism attempts the task again (up to 2 times). If the tool call is still invalid, the task remains failed.
- **UI:** The agent node turns red. The detail panel shows the error: `"Invalid tool call: '{tool_name}' is not in the allowed toolset."`

---

## EC-AGENT-003: Hallucinated Action

### Scenario
An agent (typically the Planner) generates a task that references a non-existent agent role or impossible dependency.

### Expected Behavior
- **Server:** Validate all `agent_role` values against the predefined set: `[planner, researcher, writer, reviewer, formatter]`.
- **Invalid Role:** Reject the Planner's output, prompt it to regenerate, or mark the task as failed.
- **UI:** Display a warning toast: "Planner generated an invalid task. Attempting recovery..."
- **Recovery:** If regeneration fails after 2 attempts, the workflow fails with a descriptive error.

---

## EC-AGENT-004: Worker Timeout

### Scenario
An agent task exceeds the 15-second execution limit.

### Expected Behavior
- **Server:** The worker interrupts the task, sets status to `failed`, and records `error: "Task timeout after 15s"`.
- **Retry:** Automatic retry is attempted up to 2 times.
- **UI:** The agent node shows a timeout icon (⏱️). The detail panel shows the timeout message.
- **Downstream Impact:** Dependent tasks remain in `pending` state until the failed task is manually retried or the workflow is stopped.

---

## EC-AGENT-005: Memory Overflow (Max Turns)

### Scenario
An agent accumulates excessive context during multi-turn interactions, approaching token limits.

### Expected Behavior
- **Server:** Monitor context window usage per agent. If a task exceeds **5 turns** or approaches the model's context limit, truncate or summarize the conversation history.
- **UI:** No direct UI impact; handled transparently by the backend.
- **Log:** A `WARN` log entry is generated: `"Agent context truncated for job_id={job_id}, task_id={task_id}"`.

---

## EC-AGENT-006: Client Disconnect

### Scenario
The user's browser closes or loses network connection while a workflow is running.

### Expected Behavior
- **Server:** The workflow continues executing in the background.
- **Redis:** State updates are written to Redis every 2 seconds.
- **Reconnection:** When the client reconnects (via WebSocket or polling), the server sends the current full state.
- **UI:** On reconnect, the dashboard reconciles its state with the server. Any missed transitions are replayed as a fast-forward animation.
- **Timeout:** If the client does not reconnect within 30 minutes, the workflow is marked as `orphaned` and gracefully stopped.

---

## EC-AGENT-007: Concurrent Workflows

### Scenario
A user attempts to start a second workflow while one is already active.

### Expected Behavior
- **Server:** Reject the second start request with `429 Too Many Requests` and message: `"You already have an active workflow. Stop it or wait for completion."`
- **UI:** The "Start Workflow" button is disabled while a workflow is active. A tooltip explains why.
- **Queue (Future):** Optionally offer a queue position if multiple workflows are requested.

---

## EC-AGENT-008: Redis Unavailable

### Scenario
Redis is down or unreachable during workflow execution.

### Expected Behavior
- **Server:** Fall back to in-memory dictionary storage for active workflows.
- **Warning:** Log a `WARN` entry and broadcast a degraded service notice to connected clients.
- **Limitation:** If the API instance restarts while using in-memory storage, active workflows are lost.
- **UI:** Display a yellow warning banner: "Real-time updates may be delayed due to infrastructure maintenance."

---

## EC-AGENT-009: OpenAI API Rate Limit

### Scenario
The OpenAI API returns a 429 rate limit during agent execution.

### Expected Behavior
- **Server:** Catch the 429, wait for the `Retry-After` duration, then retry the specific agent task.
- **Retry Count:** This retry does not count against the agent's 2 retry limit.
- **UI:** The agent node shows a "Waiting for API quota..." message with a countdown.
- **Fallback:** If the rate limit persists after 3 attempts, mark the task as failed.

---

## EC-AGENT-010: Empty or Nonsensical Input

### Scenario
A user submits an empty string or gibberish as workflow input.

### Expected Behavior
- **Client:** Disable the "Start Workflow" button for empty input.
- **Server:** If bypassed, the Planner shall still generate a minimal task graph (e.g., a single Formatter task that returns "No meaningful input provided").
- **UI:** The workflow completes quickly with a single agent, demonstrating graceful degradation.

---

## EC-AGENT-011: Very Long Input

### Scenario
A user submits input approaching the 1000-character limit.

### Expected Behavior
- **Client:** Character counter shows current/max. Input is truncated at 1000 characters.
- **Server:** Validate input length. If exceeded, return `400` with `"Input exceeds maximum length of 1000 characters."`
- **UI:** The input textarea highlights in orange at 800 chars, red at 1000 chars.

---

## EC-AGENT-012: Simulated Delay Toggle Mid-Workflow

### Scenario
A user toggles "Simulate Delays" while a workflow is running.

### Expected Behavior
- **Client:** The toggle is disabled while a workflow is active.
- **Server:** The `simulate` parameter is evaluated only at workflow start. Mid-workflow toggles have no effect.
- **UI:** Tooltip on disabled toggle: "Simulation setting is locked while a workflow is running."
