# Multi-Agent System — Acceptance Criteria

> **Module:** Multi-Agent System  
> **Version:** 1.0  
> **Definition of Ready:** All criteria below must be verifiable in a staging environment.

---

## AC-AGENT-001: Agent Roles

- [ ] The Planner generates a JSON task graph with tasks assigned to Researcher, Writer, Reviewer, and Formatter.
- [ ] Each agent executes with its dedicated system prompt.
- [ ] Agent outputs are structured JSON where required (Planner task graph, Reviewer report).
- [ ] Agent roles are validated against the predefined set; invalid roles are rejected.

## AC-AGENT-002: Task Decomposition

- [ ] Submitting "Write a blog post about AI" produces a task graph with at least 3 tasks.
- [ ] Tasks have valid dependency arrays; tasks with empty dependencies execute first.
- [ ] A task only starts after all its dependencies are completed.
- [ ] Cyclic dependency graphs are rejected with a 400 error.
- [ ] Task graphs exceeding 10 tasks are rejected with a 400 error.

## AC-AGENT-003: Async Execution

- [ ] `POST /api/v1/agents/start-workflow` returns a `job_id` within 500ms.
- [ ] The API response does not wait for workflow completion.
- [ ] Independent tasks execute in parallel (observable in logs and UI).
- [ ] Sequential tasks wait for dependencies before starting.

## AC-AGENT-004: Real-Time State Broadcasting

- [ ] WebSocket `/api/v1/ws/agents/{job_id}` connects successfully and receives events.
- [ ] State transitions are visible in the UI within 500ms of server-side changes.
- [ ] On WebSocket disconnect, the UI shows "Reconnecting..." and auto-reconnects.
- [ ] On reconnect, the full current state is received before incremental updates resume.
- [ ] SSE fallback works when WebSockets are blocked.

## AC-AGENT-005: Simulated Delays

- [ ] With simulate=true, each agent task has a visible 1–3s delay before producing output.
- [ ] During delay, the agent node shows a spinner animation.
- [ ] With simulate=false, tasks execute as fast as possible with minimal delay.
- [ ] The delay duration is included in the execution timeline.

## AC-AGENT-006: Workflow Control

- [ ] "Start Workflow" initiates execution and returns a job_id.
- [ ] "Stop Workflow" halts all active tasks within 2s and sets status to cancelled.
- [ ] Stopped workflows preserve completed task outputs.
- [ ] "Retry" on a failed task re-executes it and resets downstream tasks.
- [ ] Starting a second workflow while one is active returns 429.

## AC-AGENT-007: Visualization Dashboard

- [ ] The workflow graph renders as connected nodes with arrow edges.
- [ ] Nodes are color-coded by status (gray, blue, green, red).
- [ ] In-progress nodes show a spinner.
- [ ] Clicking a node opens a detail panel with input, output, tokens, and latency.
- [ ] The layout is responsive and readable on screens ≥768px.

## AC-AGENT-008: Final Result Display

- [ ] Completed workflows display the final Markdown output.
- [ ] An execution timeline shows start/end times for each agent.
- [ ] Total workflow latency is displayed prominently.
- [ ] Per-agent token usage is shown in a table.
- [ ] "Download Result" exports a JSON file with output and metadata.

## AC-AGENT-009: Workflow Persistence

- [ ] Active workflow states are stored in Redis and retrievable by job_id.
- [ ] Completed workflows are stored in PostgreSQL with all metadata.
- [ ] History sidebar lists past workflows with pagination.
- [ ] Clicking a history item restores the full workflow state for viewing.

## AC-AGENT-010: Security & Limits

- [ ] Input exceeding 1000 characters is rejected with 400.
- [ ] Empty input produces a minimal graceful workflow.
- [ ] Task graphs exceeding depth 3 are rejected.
- [ ] Only 1 active workflow per user session is allowed.
- [ ] Execution logs do not contain API keys or sensitive tokens.

## AC-AGENT-011: Error Handling

- [ ] Worker timeouts (15s) mark tasks as failed and trigger retry.
- [ ] Failed tasks retry up to 2 times automatically.
- [ ] OpenAI 429 responses are handled with backoff and do not count as agent failures.
- [ ] Redis unavailability triggers in-memory fallback with a warning banner.

## AC-AGENT-012: Performance

- [ ] Workflow start API responds in <500ms.
- [ ] State broadcasts arrive at client within <500ms.
- [ ] WebSocket supports 100+ concurrent connections.
- [ ] Redis reads/writes complete in <50ms.
- [ ] Workflow history queries return in <200ms.
