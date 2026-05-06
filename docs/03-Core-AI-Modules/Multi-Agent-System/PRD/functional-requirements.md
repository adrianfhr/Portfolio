# Multi-Agent System — Functional Requirements

> **Module:** Multi-Agent System  
> **Version:** 1.0  
> **Total Requirements:** 42

---

## FR-AGENT-001: Agent Roles

### Description
Define five specialized agent roles with distinct responsibilities and prompt templates.

### Requirements
- **FR-AGENT-001.1:** **Planner (Orchestrator):** Receives the user's input, decomposes it into a structured task list with dependencies, and assigns tasks to other agents. Outputs a JSON task graph.
- **FR-AGENT-001.2:** **Researcher (Info Gatherer):** Receives research tasks from the Planner. Simulates information gathering (in v1.0, uses LLM to generate structured research notes). Outputs bullet-point research findings.
- **FR-AGENT-001.3:** **Writer (Content Generator):** Receives writing tasks and research context. Produces draft content in Markdown. Outputs structured document sections.
- **FR-AGENT-001.4:** **Reviewer (QA):** Receives the Writer's output. Checks for accuracy, tone consistency, and completeness. Outputs a review report with pass/fail status and specific feedback.
- **FR-AGENT-001.5:** **Formatter (Output Processor):** Receives the final approved content. Applies formatting rules, generates table of contents, and produces the polished final output.
- **FR-AGENT-001.6:** Each agent shall have a dedicated system prompt stored server-side and version-controlled.
- **FR-AGENT-001.7:** Agents shall communicate via structured messages (JSON) rather than freeform text to ensure parseability.

---

## FR-AGENT-002: Task Decomposition

### Description
The Planner agent must generate a valid, executable task dependency graph.

### Requirements
- **FR-AGENT-002.1:** The Planner shall output a JSON object with:
  - `workflow_id`: UUID
  - `tasks`: Array of task objects, each with `id`, `name`, `description`, `agent_role`, `dependencies` (array of task IDs), `status` (default: `pending`)
- **FR-AGENT-002.2:** The task graph shall be a Directed Acyclic Graph (DAG). Cycles are rejected server-side with a `400` error.
- **FR-AGENT-002.3:** Tasks with no dependencies shall execute first (in parallel where possible).
- **FR-AGENT-002.4:** A task shall only transition to `in_progress` when all its dependencies are `completed`.
- **FR-AGENT-002.5:** The maximum number of tasks per workflow shall be 10.
- **FR-AGENT-002.6:** The Planner shall handle vague inputs by generating a reasonable default task graph (e.g., for "write a blog post about AI," it creates research → outline → draft → review → format).

---

## FR-AGENT-003: Async Non-Blocking Execution

### Description
Agent tasks shall execute asynchronously without blocking the API gateway.

### Requirements
- **FR-AGENT-003.1:** Workflow execution shall use Python `asyncio` for in-process concurrency or Celery workers for out-of-process distribution.
- **FR-AGENT-003.2:** The API gateway shall return a `job_id` immediately upon workflow start (acceptance pattern).
- **FR-AGENT-003.3:** The gateway shall not wait for workflow completion before responding.
- **FR-AGENT-003.4:** Multiple independent tasks within the same workflow shall execute in parallel if they have no inter-dependencies.
- **FR-AGENT-003.5:** Sequential tasks shall wait for their dependencies before starting.
- **FR-AGENT-003.6:** A task queue (Redis or in-memory) shall manage pending tasks.

---

## FR-AGENT-004: State Broadcast

### Description
Broadcast real-time agent status updates to connected clients.

### Requirements
- **FR-AGENT-004.1:** WebSocket endpoint `/api/v1/ws/agents/{job_id}` shall stream state events.
- **FR-AGENT-004.2:** SSE fallback endpoint `/api/v1/agents/status/{job_id}` shall stream state events for clients without WebSocket support.
- **FR-AGENT-004.3:** State events shall follow this schema:
  ```json
  {
    "event": "agent_state_change",
    "data": {
      "job_id": "uuid",
      "agent_role": "writer",
      "task_id": "task-3",
      "status": "in_progress",
      "timestamp": "2026-05-06T13:14:26Z",
      "message": "Writer started drafting section: Introduction"
    }
  }
  ```
- **FR-AGENT-004.4:** Allowed status transitions:
  - `pending → in_progress`
  - `in_progress → completed`
  - `in_progress → failed`
  - `pending → cancelled` (on workflow stop)
  - `in_progress → cancelled` (on workflow stop)
- **FR-AGENT-004.5:** State updates shall be broadcast within 500ms of the transition occurring.
- **FR-AGENT-004.6:** On client reconnect, the server shall send the current full workflow state followed by incremental updates.

---

## FR-AGENT-005: Simulated Delay

### Description
Introduce artificial delays for visual demonstration effect.

### Requirements
- **FR-AGENT-005.1:** Each agent task shall have a configurable simulated delay of 1–3 seconds before execution begins.
- **FR-AGENT-005.2:** During simulated delay, the agent status shall be `in_progress` with a spinner animation.
- **FR-AGENT-005.3:** Simulated delay shall be skippable via query parameter `?simulate=false`.
- **FR-AGENT-005.4:** The delay duration shall be logged as part of the execution timeline.
- **FR-AGENT-005.5:** Real agent inference time shall be added on top of the simulated delay.

---

## FR-AGENT-006: Final Result Display

### Description
Present the completed workflow output with comprehensive metadata.

### Requirements
- **FR-AGENT-006.1:** The final result shall be rendered as Markdown in a dedicated panel.
- **FR-AGENT-006.2:** An execution timeline shall show each agent's start time, end time, and duration.
- **FR-AGENT-006.3:** Total workflow latency shall be displayed prominently.
- **FR-AGENT-006.4:** Per-agent token usage shall be displayed in a table:
  | Agent | Prompt Tokens | Completion Tokens | Total |
  |---|---|---|---|
  | Planner | 120 | 340 | 460 |
- **FR-AGENT-006.5:** A "Download Result" button shall export the final Markdown and metadata as a JSON file.

---

## FR-AGENT-007: Workflow Persistence

### Description
Persist workflow state and history for audit and replay.

### Requirements
- **FR-AGENT-007.1:** **Redis (Real-Time):** Active workflow states shall be stored in Redis with a TTL of 24 hours.
  - Key pattern: `agent:workflow:{job_id}`
  - Value: JSON workflow state
- **FR-AGENT-007.2:** **PostgreSQL (History):** Completed, failed, or cancelled workflows shall be persisted indefinitely.
  - Table: `workflow_executions`
  - Columns: `job_id`, `user_id`, `input`, `status`, `result`, `token_usage`, `latency_ms`, `created_at`, `completed_at`
- **FR-AGENT-007.3:** Workflow history shall support pagination and filtering by status and date range.

---

## FR-AGENT-008: Workflow Control

### Description
Provide user controls for starting, stopping, and retrying workflows.

### Requirements
- **FR-AGENT-008.1:** **Start Workflow:** `POST /api/v1/agents/start-workflow`
  - Request body: `{ "input": "string (max 1000 chars)", "simulate": true }`
  - Response: `{ "job_id": "uuid", "status": "started" }`
- **FR-AGENT-008.2:** **Stop Workflow:** `POST /api/v1/agents/stop-workflow/{job_id}`
  - Immediately cancels all pending and in-progress tasks.
  - Sets workflow status to `cancelled`.
  - Returns partial results accumulated so far.
- **FR-AGENT-008.3:** **Retry Agent:** `POST /api/v1/agents/retry-task/{job_id}/{task_id}`
  - Re-executes the specified task.
  - Resets the task and all downstream dependent tasks to `pending`.
  - Replays the workflow from the retried task forward.
- **FR-AGENT-008.4:** **Get Status:** `GET /api/v1/agents/status/{job_id}`
  - Returns the current workflow state including all tasks, statuses, and partial outputs.

---

## FR-AGENT-009: UI Workflow Dashboard

### Description
A visual dashboard for monitoring and interacting with workflows.

### Requirements
- **FR-AGENT-009.1:** The dashboard shall display the task graph as a node-edge diagram using React Flow or ELK.js layout engine.
- **FR-AGENT-009.2:** Agent nodes shall display:
  - Role icon (e.g., 🧠 Planner, 🔍 Researcher, ✍️ Writer)
  - Status indicator (color-coded circle)
  - Progress spinner (during `in_progress`)
- **FR-AGENT-009.3:** Edges shall show dependency relationships with arrowheads.
- **FR-AGENT-009.4:** Completed edges shall animate with a green flow effect.
- **FR-AGENT-009.5:** Clicking a node opens a detail panel showing:
  - Agent system prompt (read-only)
  - Task input and output
  - Token usage and latency
  - Execution log
- **FR-AGENT-009.6:** The input area shall be a textarea with a "Start Workflow" button and a "Simulate Delays" toggle.
- **FR-AGENT-009.7:** A "Stop" button shall appear during active workflows.

---

## FR-AGENT-010: Execution Log Timeline

### Description
A chronological log of all workflow events.

### Requirements
- **FR-AGENT-010.1:** The timeline shall display entries in chronological order with timestamps.
- **FR-AGENT-010.2:** Each entry shall include: timestamp, agent role, event type (start, complete, fail, cancel), message.
- **FR-AGENT-010.3:** Entries shall be color-coded by event type.
- **FR-AGENT-010.4:** The timeline shall auto-scroll to the newest entry.
- **FR-AGENT-010.5:** Users can pause auto-scroll by scrolling up manually.
