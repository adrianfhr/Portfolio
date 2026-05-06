# Event and Data Flow

> **Document:** Event and Data Flow  
> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Version:** 1.0  
> **Status:** Draft  

---

## 1. Executive Summary

This document describes the event-driven architecture and data flow patterns that govern the Interactive AI Engineering Portfolio & Sandbox. The system processes three major categories of events: **synchronous request-response** (REST API), **unidirectional server push** (SSE), and **bidirectional real-time** (WebSocket). Additionally, asynchronous background processing via Celery enables decoupled, resilient AI inference pipelines.

Understanding these flows is essential for debugging, scaling, and extending the platform. Each flow is documented with sequence diagrams, state transition tables, and data transformation checkpoints.

---

## 2. System Event Taxonomy

### 2.1 Event Categories

| Category | Transport | Direction | Latency Requirement | Examples |
|----------|-----------|-----------|---------------------|----------|
| **Command** | HTTP POST/PUT/PATCH | Client → Server | < 500ms P99 | Send chat message, upload image, start agent workflow |
| **Query** | HTTP GET | Client → Server | < 200ms P99 | Fetch chat history, get metrics snapshot, load user profile |
| **Stream** | SSE | Server → Client | < 50ms per chunk | Chat token streaming, metrics dashboard updates |
| **Signal** | WebSocket | Bidirectional | < 100ms | Log subscription, agent status updates, heartbeat |
| **Job** | Celery + Redis | Internal async | Seconds to minutes | Embedding generation, face detection, batch document ingestion |
| **System** | Internal function calls | Internal | < 10ms | Rate limit counter update, Prometheus metric emission, audit log write |

### 2.2 Event Naming Conventions

All events follow a hierarchical naming pattern to enable filtering, routing, and monitoring:

```
{domain}.{entity}.{action}.{variant}

Examples:
  chat.message.sent
  chat.token.streamed
  vision.image.uploaded
  vision.face.detected
  agent.workflow.started
  agent.node.completed
  metrics.latency.recorded
  log.line.broadcast
```

---

## 3. Chat Event Flow (RAG Pipeline)

### 3.1 Sequence Diagram

```
┌────────┐          ┌──────────┐         ┌──────────┐        ┌─────────┐       ┌─────────┐       ┌────────┐
│ Client │          │  Astro   │         │ FastAPI  │        │  Celery │       │ OpenAI  │       │ Qdrant │
└───┬────┘          └────┬─────┘         └────┬─────┘        └────┬────┘       └────┬────┘       └───┬────┘
    │                    │                    │                   │                 │                │
    │ 1. POST /chat      │                    │                   │                 │                │
    │───────────────────▶│                    │                   │                 │                │
    │  {message, session}│                    │                   │                 │                │
    │                    │ 2. Proxy /api/chat │                   │                 │                │
    │                    │───────────────────▶│                   │                 │                │
    │                    │                    │ 3. Auth + Rate    │                 │                │
    │                    │                    │    Limit Check    │                 │                │
    │                    │                    │                   │                 │                │
    │                    │                    │ 4. Persist user   │                 │                │
    │                    │                    │    message to DB  │                 │                │
    │                    │                    │                   │                 │                │
    │                    │                    │ 5. Embedding Task │                 │                │
    │                    │                    │──────────────────▶│                 │                │
    │                    │                    │                   │ 6. Generate     │                │
    │                    │                    │                   │    embedding    │                │
    │                    │                    │                   │                 │                │
    │                    │                    │                   │ 7. Search       │                │
    │                    │                    │                   │    Qdrant       │───────────────▶│
    │                    │                    │                   │                 │                │
    │                    │                    │                   │ 8. Return chunks│◀───────────────│
    │                    │                    │                   │                 │                │
    │                    │                    │                   │ 9. Rerank +     │                │
    │                    │                    │                   │    Assemble     │                │
    │                    │                    │◀──────────────────│    Context      │                │
    │                    │                    │                   │                 │                │
    │                    │                    │ 10. Stream LLM    │                 │                │
    │                    │                    │────────────────────────────────────▶│                │
    │                    │                    │                   │                 │                │
    │                    │                    │◀────────────────────────────────────│                │
    │                    │                    │ 11. SSE chunks    │                 │                │
    │                    │◀──────────────────│  data: {token}    │                 │                │
    │                    │ 12. Proxy SSE     │                   │                 │                │
    │◀───────────────────│                   │                   │                 │                │
    │ 13. Render token   │                   │                   │                 │                │
    │                    │                   │                   │                 │                │
    │ 14. [Stream ends]  │                   │                   │                 │                │
    │◀───────────────────│◀──────────────────│◀──────────────────│                 │                │
    │                    │                   │ 15. Persist       │                 │                │
    │                    │                   │    assistant msg  │                 │                │
    │                    │                   │ 16. Emit metrics  │                 │                │
    │                    │                   │ 17. Log audit     │                 │                │
```

### 3.2 State Transitions: Chat Session

| State | Trigger | Next State | Side Effects |
|-------|---------|-----------|--------------|
| `idle` | User submits message | `retrieving` | Rate limit check; persist user message |
| `retrieving` | Embedding + search complete | `generating` | Reranker invoked; context assembled |
| `generating` | First token received from LLM | `streaming` | SSE connection opened; token stream begins |
| `streaming` | Stream complete (`[DONE]`) | `completed` | Persist assistant message; emit cost metrics |
| `streaming` | Client disconnects | `interrupted` | Save partial response; allow resume |
| `retrieving` / `generating` | Error (timeout, rate limit) | `error` | Return error to client; log failure |

### 3.3 Data Transformation Points

| Checkpoint | Input | Transformation | Output |
|-----------|-------|---------------|--------|
| **T1: Message Normalization** | Raw user string | Trim whitespace, truncate to 4000 chars, strip control characters | Sanitized message |
| **T2: Embedding Generation** | Sanitized message | OpenAI text-embedding-3-small | 1536-dimension float vector |
| **T3: Vector Search** | Query vector | Qdrant ANN search (HNSW) + payload filtering | Top 20 chunk records |
| **T4: Hybrid Fusion** | Dense results + Sparse results | Reciprocal Rank Fusion (k=60) | Fused ranked list |
| **T5: Reranking** | Top 10 fused chunks | Cross-encoder inference (ms-marco-MiniLM) | Top 5 chunks with relevance scores |
| **T6: Prompt Assembly** | System template + context + history + message | Jinja2 render with truncation logic | Final prompt string |
| **T7: Token Streaming** | LLM raw bytes | SSE formatting (`data: {...}\n\n`) | Client-renderable JSON chunks |
| **T8: Cost Attribution** | Token counts + model pricing | (prompt × input_rate) + (completion × output_rate) | USD cost, rounded to 6 decimals |

---

## 4. Face Recognition Event Flow

### 4.1 Sequence Diagram

```
┌────────┐      ┌──────────┐       ┌──────────┐       ┌─────────┐       ┌─────────┐       ┌────────┐
│ Client │      │  Astro   │       │ FastAPI  │       │  Celery │       │InsightFa│       │ Qdrant │
└───┬────┘      └────┬─────┘       └────┬─────┘       └────┬────┘       └────┬────┘       └───┬────┘
    │                │                  │                  │                 │                │
    │ 1. POST /vision │                 │                  │                 │                │
    │    (multipart)  │                 │                  │                 │                │
    │────────────────▶│                 │                  │                 │                │
    │                 │ 2. Proxy        │                  │                 │                │
    │                 │────────────────▶│                  │                 │                │
    │                 │                 │ 3. Validate file │                 │                │
    │                 │                 │    (MIME, size)  │                 │                │
    │                 │                 │                  │                 │                │
    │                 │                 │ 4. Upload to     │                 │                │
    │                 │                 │    MinIO / S3    │                 │                │
    │                 │                 │                  │                 │                │
    │                 │                 │ 5. Queue vision  │                 │                │
    │                 │                 │    task          │                 │                │
    │                 │                 │─────────────────▶│                 │                │
    │                 │                 │                  │ 6. Download     │                 │
    │                 │                 │                  │    image        │                 │
    │                 │                 │                  │                 │                 │
    │                 │                 │                  │ 7. OpenCV       │                 │
    │                 │                 │                  │    preprocessing│                 │
    │                 │                 │                  │                 │                 │
    │                 │                 │                  │ 8. ONNX Runtime │                 │
    │                 │                 │                  │    inference    │                 │
    │                 │                 │                  │                 │                 │
    │                 │                 │                  │ 9. Face embed   │                 │
    │                 │                 │                  │    (512d vec)   │                 │
    │                 │                 │                  │                 │                 │
    │                 │                 │                  │ 10. Qdrant      │                 │
    │                 │                 │                  │     search      │───────────────▶│
    │                 │                 │                  │                 │                │
    │                 │                 │                  │◀────────────────│ 11. Top-k matches│
    │                 │                 │                  │                 │                │
    │                 │                 │◀─────────────────│ 12. Result      │                 │
    │                 │◀────────────────│ 13. JSON response│                 │                 │
    │◀────────────────│                 │                  │                 │                 │
    │ 14. Render      │                 │                  │                 │                 │
    │     bounding    │                 │                  │                 │                 │
    │     boxes + IDs │                 │                  │                 │                 │
```

### 4.2 State Transitions: Vision Job

| State | Trigger | Next State | Side Effects |
|-------|---------|-----------|--------------|
| `uploaded` | File validation passes | `queued` | File stored in MinIO; presigned URL generated |
| `queued` | Celery worker picks up task | `processing` | Worker locks task; starts inference |
| `processing` | Detection complete | `embedding` | Bounding boxes extracted; cropped face regions prepared |
| `embedding` | Embedding generation complete | `matching` | 512d vectors stored in Qdrant if new; searched if matching |
| `matching` | Search complete | `completed` | Results formatted; task result stored in Redis backend |
| `processing` / `embedding` | ONNX Runtime error | `failed` | Error logged; retry up to 2 times; dead letter if persistent |
| `queued` | Timeout (visibility timeout exceeded) | `queued` | Task requeued for another worker |

### 4.3 Data Transformation Points

| Checkpoint | Input | Transformation | Output |
|-----------|-------|---------------|--------|
| **T1: File Validation** | Raw multipart upload | MIME check (`image/jpeg`, `image/png`), extension whitelist, size < 10MB | Validated file stream |
| **T2: Image Preprocessing** | Uploaded image | OpenCV: color space BGR→RGB, resize to max 1024px on longest side, format normalization | Standardized ndarray |
| **T3: Face Detection** | Preprocessed image | InsightFace RetinaFace: NMS, confidence threshold 0.5 | Bounding boxes `(x1, y1, x2, y2)` + confidence scores |
| **T4: Face Alignment** | Detected face regions | InsightFace 5-point landmark alignment | Aligned face chips (112×112) |
| **T5: Embedding Extraction** | Aligned face chips | InsightFace recognition model (ONNX) | 512-dimension float vector (L2-normalized) |
| **T6: Vector Search** | Query embedding | Qdrant search (Euclidean, top-k=5, threshold=1.0) | Matched identity records with distances |
| **T7: Result Formatting** | Raw detections + matches | JSON serialization with coordinate normalization | `{faces: [{bbox, confidence, matches: [{user_id, distance}]}]}` |

---

## 5. Multi-Agent Event Flow

### 5.1 Sequence Diagram

```
┌────────┐        ┌──────────┐         ┌──────────┐        ┌─────────┐        ┌─────────┐        ┌──────────┐
│ Client │        │  Astro   │         │ FastAPI  │        │  Celery │        │LangGraph│        │PostgreSQL│
└───┬────┘        └────┬─────┘         └────┬─────┘        └────┬────┘        └────┬────┘        └────┬─────┘
    │                  │                    │                   │                  │                  │
    │ 1. POST /agents  │                    │                   │                  │                  │
    │    {workflow_id} │                    │                   │                  │                  │
    │─────────────────▶│                    │                   │                  │                  │
    │                  │ 2. Proxy           │                   │                  │                  │
    │                  │───────────────────▶│                   │                  │                  │
    │                  │                    │ 3. Load workflow   │                  │                  │
    │                  │                    │    definition      │                  │                  │
    │                  │                    │                   │                  │                  │
    │                  │                    │ 4. Queue agent     │                  │                  │
    │                  │                    │    task            │                  │                  │
    │                  │                    │──────────────────▶│                  │                  │
    │                  │                    │                   │ 5. Initialize    │                  │
    │                  │                    │                   │    LangGraph     │                  │
    │                  │                    │                   │    state         │                  │
    │                  │                    │                   │                  │                  │
    │                  │                    │                   │ 6. Execute       │                  │
    │                  │                    │                   │    graph nodes   │                  │
    │                  │                    │                   │                  │                  │
    │                  │                    │                   │ 7. Save          │                  │
    │                  │                    │                   │    checkpoint    │─────────────────▶│
    │                  │                    │                   │                  │                  │
    │ 8. WS connect    │                    │                   │                  │                  │
    │    /agents/ws/{id}                  │                   │                  │                  │
    │─────────────────▶│                   │                   │                  │                  │
    │                  │ 9. Proxy WS       │                   │                  │                  │
    │                  │──────────────────▶│                   │                  │                  │
    │                  │                    │ 10. Subscribe to  │                  │                  │
    │                  │                    │     Redis pub/sub │                  │                  │
    │                  │                    │     for updates   │                  │                  │
    │                  │                    │                   │                  │                  │
    │                  │                    │◀─────────────────│ 11. Node complete │                  │
    │                  │                    │                   │    broadcast      │                  │
    │                  │◀──────────────────│ 12. WS message    │                  │                  │
    │◀─────────────────│                   │    {node, state}  │                  │                  │
    │ 13. Update UI    │                   │                   │                  │                  │
    │                  │                   │                   │                  │                  │
    │                  │                   │◀─────────────────│ 14. Workflow      │                  │
    │                  │                   │                   │    complete       │                  │
    │                  │◀──────────────────│ 15. WS final msg  │                  │                  │
    │◀─────────────────│                   │                   │                  │                  │
    │ 16. Render result│                   │                   │                  │                  │
```

### 5.2 State Transitions: Agent Workflow

| State | Trigger | Next State | Side Effects |
|-------|---------|-----------|--------------|
| `pending` | Task queued | `initializing` | Workflow definition loaded; initial state created |
| `initializing` | LangGraph graph compiled | `planning` | First node (Planner) invoked with user input |
| `planning` | Plan generated | `routing` | Conditional edge evaluates plan; routes to tool(s) |
| `routing` | Tool selected | `executing` | Tool node invoked with parameters |
| `executing` | Tool returns result | `observing` | Observation appended to state; loop counter incremented |
| `observing` | Max iterations not reached | `planning` | Cycle continues with updated context |
| `observing` | Max iterations reached OR synthesizer triggered | `synthesizing` | Final answer generation begins |
| `synthesizing` | Final answer generated | `completed` | Checkpoint saved; result broadcast via WebSocket |
| `executing` | Human approval required | `awaiting_approval` | Workflow paused; checkpoint saved to PostgreSQL |
| `awaiting_approval` | Admin approves | `executing` | Workflow resumes from checkpoint |
| `awaiting_approval` | Admin rejects | `cancelled` | Workflow terminated; reason logged |
| any | Unhandled exception | `failed` | Error captured; checkpoint saved for post-mortem |

### 5.3 Data Transformation Points

| Checkpoint | Input | Transformation | Output |
|-----------|-------|---------------|--------|
| **T1: Workflow Loading** | Workflow ID | PostgreSQL lookup; Jinja2 template resolution | Compiled LangGraph graph + state schema |
| **T2: Plan Generation** | User request + system prompt | LLM completion (gpt-4o-mini, temp=0.3) | Structured plan: list of steps with tool assignments |
| **T3: Tool Parameter Binding** | Plan step + state context | JSON schema validation; type coercion | Validated tool arguments dict |
| **T4: Tool Execution** | Tool arguments | Function invocation (vector search, calculator, etc.) | Tool result string or structured data |
| **T5: State Update** | Previous state + tool result | State reducer merges messages and results | Updated AgentState dict |
| **T6: Checkpoint Serialization** | AgentState | JSON serialization + datetime normalization | PostgreSQL JSONB row |
| **T7: WebSocket Broadcast** | Node completion event | Redis PUBLISH → WebSocket gateway → client JSON | `{run_id, node, status, partial_result, timestamp}` |

---

## 6. Metrics & Observability Event Flow

### 6.1 Metrics Collection Flow

```
Every API Request
    ↓
LoggingMiddleware (start timer)
    ↓
Router Handler Execution
    ↓
LoggingMiddleware (stop timer)
    ├─ Prometheus: api_requests_total{method, endpoint, status} += 1
    ├─ Prometheus: api_latency_seconds_bucket{le} observe(duration)
    ├─ Prometheus: openai_tokens_total{model} += tokens
    ├─ Prometheus: openai_cost_usd += cost
    └─ Structured Log: {trace_id, method, path, status, latency_ms, user_id}
    ↓
Metrics SSE Stream
    ├─ Aggregator reads Prometheus counters every 2 seconds
    ├─ Computes P50, P90, P99 from histogram buckets
    └─ Broadcasts to connected SSE clients: {latency_p50, latency_p99, token_cost, request_rate}
```

### 6.2 Live Log Flow

```
Application Code
    ↓
structlog logger.info("User query processed", trace_id=..., query=...)
    ↓
Log Filter: Check for [SHOWCASE_LOG] tag
    ├─ If tagged: Push to Redis list "logs:showcase" (max length 1000)
    └─ Always: Push to Loki / stdout
    ↓
WebSocket Gateway
    ├─ Subscribes to Redis pub/sub channel "logs:broadcast"
    ├─ Reads from "logs:showcase" list every 500ms
    └─ Broadcasts to all connected WebSocket clients in "logs" room
    ↓
Client (React Log Terminal)
    ├─ Receives JSON log line
    ├─ Appends to circular buffer (max 10,000 lines)
    └─ Virtualized list renders visible rows
```

---

## 7. Async Processing Flows

### 7.1 Document Ingestion Pipeline

```
Admin Uploads Documents (ZIP or individual files)
    ↓
FastAPI: File validation + virus scan (future)
    ↓
MinIO: Store raw files
    ↓
Celery: ingest_document_batch task
    ├─ Extract text (PDF: pdfplumber, DOCX: python-docx, MD: raw)
    ├─ Chunk text (RecursiveCharacterTextSplitter)
    ├─ Enrich metadata (source, module, timestamp)
    ├─ Generate embeddings (batch size 64)
    ├─ Upsert to Qdrant (batch size 100)
    └─ Update PostgreSQL: document_registry table
    ↓
Progress Reporting
    ├─ Redis: task_progress:{task_id} (percent complete)
    └─ WebSocket (if admin panel connected): real-time progress bar
```

### 7.2 Session Cleanup Job

```
Celery Beat (cron: every hour)
    ↓
cleanup_expired_sessions task
    ├─ PostgreSQL: DELETE FROM sessions WHERE expires_at < NOW()
    ├─ Redis: DEL session:{token} for each expired session
    ├─ Redis: DEL rate_limit:{guest_id} for guests older than 30 days
    └─ MinIO: DELETE temp_uploads/ older than 24 hours
    ↓
Metrics Emitted
    └─ sessions_cleaned_total, temp_files_deleted_total
```

---

## 8. Event-Driven Integration Patterns

### 8.1 Pattern: Outbox + Inbox (Future)

For cross-module communication that must survive crashes, an outbox pattern is reserved for future implementation:

```
Service A writes event to outbox table (same transaction as business data)
    ↓
Background poller reads outbox, publishes to Redis Streams
    ↓
Service B consumes from Redis Streams, writes to inbox table
    ↓
Service B processes inbox, marks as consumed
```

### 8.2 Pattern: Saga (Future)

For distributed transactions across multiple AI services (e.g., agent workflow that triggers chat + vision + vector search):

```
Saga Orchestrator
    ├─ Step 1: Chat analysis (compensate: none)
    ├─ Step 2: Vision detection (compensate: delete uploaded temp image)
    ├─ Step 3: Vector search (compensate: none)
    └─ Step 4: Synthesize result (compensate: none)
```

### 8.3 Pattern: CQRS (Partial)

The metrics and logs modules implement a lightweight CQRS pattern:

| Command Side | Query Side |
|-------------|-----------|
| API requests write to PostgreSQL (normalized) | Metrics dashboard reads from Prometheus (aggregated) |
| Chat messages write to PostgreSQL | Chat history reads from PostgreSQL with pagination |
| Logs write to stdout/Loki | Live logs read from Redis circular buffer |

---

## 9. Data Consistency Model

| Data Store | Consistency Model | Conflict Resolution | Backup Strategy |
|-----------|-------------------|---------------------|-----------------|
| PostgreSQL | ACID (strong consistency) | Row-level locking, optimistic concurrency | Daily pg_dump + WAL archiving |
| Qdrant | Eventual consistency (ANN index) | Last-write-wins on payload; vector upserts overwrite | Snapshot every 6 hours |
| Redis | Eventual consistency (AOF optional) | Key TTL expiration; no merge conflict resolution | RDB snapshots every hour |
| MinIO/S3 | Strong consistency (per object) | Object versioning enabled | Cross-region replication (future) |

---

## 10. Event Schema Registry

### 10.1 Chat Token Stream Event

```json
{
  "event": "chat.token.streamed",
  "trace_id": "t-uuid-789",
  "session_id": "sess_abc123",
  "data": {
    "token": " architecture",
    "index": 42,
    "finish_reason": null
  },
  "timestamp": "2026-05-06T13:14:26.757Z"
}
```

### 10.2 Agent Node Completion Event

```json
{
  "event": "agent.node.completed",
  "trace_id": "t-uuid-456",
  "run_id": "run_xyz789",
  "data": {
    "node": "tool_execution",
    "tool_name": "vector_search",
    "status": "success",
    "partial_result": "Found 3 relevant documents about system design."
  },
  "timestamp": "2026-05-06T13:14:26.757Z"
}
```

### 10.3 Log Broadcast Event

```json
{
  "event": "log.line.broadcast",
  "trace_id": "t-uuid-123",
  "data": {
    "level": "INFO",
    "module": "chat_service",
    "message": "RAG retrieval completed",
    "details": {
      "chunks_retrieved": 5,
      "latency_ms": 145
    }
  },
  "timestamp": "2026-05-06T13:14:26.757Z"
}
```

---

*Document maintained by the Systems Architecture Team. Last updated: 2026-05-06.*
