# Multi-Agent System — Non-Functional Requirements

> **Module:** Multi-Agent System  
> **Version:** 1.0

---

## NFR-AGENT-001: Performance

### Description
The system must handle workflow orchestration with low latency and efficient resource usage.

### Requirements
- **NFR-AGENT-001.1:** **Workflow Start Latency:** The API shall return a `job_id` within **500ms** of receiving a start request.
- **NFR-AGENT-001.2:** **State Broadcast Latency:** Agent status changes shall reach the client within **500ms** for 99% of transitions.
- **NFR-AGENT-001.3:** **Task Execution Parallelism:** Up to **3 tasks** shall execute in parallel within a single workflow.
- **NFR-AGENT-001.4:** **WebSocket Throughput:** The gateway shall support at least **100 concurrent WebSocket connections** per instance.
- **NFR-AGENT-001.5:** **Redis State Access:** Workflow state reads/writes shall complete within **50ms**.

---

## NFR-AGENT-002: Reliability

### Description
The system must gracefully handle failures, timeouts, and resource exhaustion.

### Requirements
- **NFR-AGENT-002.1:** **Worker Timeout:** Individual agent tasks shall timeout after **15 seconds** and transition to `failed` status.
- **NFR-AGENT-002.2:** **Retry Logic:** Failed tasks shall be retried automatically up to **2 times** with exponential backoff (1s, 2s) before marking as permanently failed.
- **NFR-AGENT-002.3:** **WebSocket Reconnection:** Client disconnections shall trigger automatic reconnection with exponential backoff (1s, 2s, 4s, max 8s).
- **NFR-AGENT-002.4:** **Redis Failure Fallback:** If Redis is unavailable, the system shall fall back to in-memory state storage with a warning logged.
- **NFR-AGENT-002.5:** **Partial Result Preservation:** Stopped or failed workflows shall retain all completed task outputs for inspection.

---

## NFR-AGENT-003: Security

### Description
Protect against abuse, resource exhaustion, and injection attacks.

### Requirements
- **NFR-AGENT-003.1:** **Input Validation:** Workflow input shall be validated to max **1000 characters** and sanitized for HTML/script injection.
- **NFR-AGENT-003.2:** **Max Depth Enforcement:** Recursive agent calls shall be limited to **3 levels** deep. Deeper calls are rejected with `400`.
- **NFR-AGENT-003.3:** **Max Active Workflows:** Each user session is limited to **1 active workflow**. Additional start requests return `429`.
- **NFR-AGENT-003.4:** **API Quota:** Each workflow consumes quota equivalent to **5 chat requests** from the user's daily limit.
- **NFR-AGENT-003.5:** **No Arbitrary Code Execution:** Agent outputs shall never be executed as code. All outputs are treated as plain text/Markdown.
- **NFR-AGENT-003.6:** **Sensitive Data Redaction:** Execution logs shall redact API keys, tokens, and user identifiers before persistence.

---

## NFR-AGENT-004: Scalability

### Description
The system must scale horizontally as workload increases.

### Requirements
- **NFR-AGENT-004.1:** **Stateless API Gateway:** The FastAPI gateway shall be stateless; all workflow state lives in Redis/PostgreSQL.
- **NFR-AGENT-004.2:** **Worker Autoscaling:** Celery workers shall scale based on queue depth (target: queue depth < 10 per worker).
- **NFR-AGENT-004.3:** **Database Connection Pooling:** PostgreSQL connections shall be pooled with a max of **20 connections** per API instance.
- **NFR-AGENT-004.4:** **Workflow TTL:** Redis workflow states shall expire after **24 hours** to prevent memory bloat.

---

## NFR-AGENT-005: Observability

### Description
The system must expose metrics and logs for monitoring and debugging.

### Requirements
- **NFR-AGENT-005.1:** **Structured Logging:** All workflow events shall be logged as JSON with fields: `timestamp`, `level`, `job_id`, `agent_role`, `event`, `message`, `trace_id`.
- **NFR-AGENT-005.2:** **Metrics:** The following metrics shall be collected:
  - `workflows_started_total` (Counter)
  - `workflows_completed_total` (Counter, labelled by status: success/failed/cancelled)
  - `workflow_latency_seconds` (Histogram)
  - `agent_task_latency_seconds` (Histogram, labelled by agent_role)
  - `agent_token_usage_total` (Counter, labelled by agent_role and token_type)
- **NFR-AGENT-005.3:** **Tracing:** Each workflow shall have a unique `trace_id` propagated across all agent tasks for distributed tracing.

---

## NFR-AGENT-006: Browser Compatibility

### Requirements
- **NFR-AGENT-006.1:** Fully functional on Chrome, Firefox, Safari, and Edge (last 2 major versions).
- **NFR-AGENT-006.2:** WebSocket fallback to SSE for environments with WebSocket restrictions.
- **NFR-AGENT-006.3:** Responsive layout from **320px** to **2560px**.
