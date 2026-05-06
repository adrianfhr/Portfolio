# System Architecture

> **Document:** System Architecture  
> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Version:** 1.0  
> **Status:** Draft  

---

## 1. Architecture Overview

The Interactive AI Engineering Portfolio & Sandbox is architected as a **microservices-ready monolith** — a single deployable unit that is internally decomposed into well-defined, loosely coupled modules. This pattern was chosen deliberately to balance the operational simplicity required for a personal portfolio showcase with the engineering rigor expected by senior technical evaluators. The architecture demonstrates production-grade separation of concerns, clear module boundaries, and horizontal-scaling preparedness without the infrastructure overhead of a distributed microservices mesh.

The system follows a **layered, event-driven architecture** with asynchronous processing pipelines for AI inference, real-time streaming for observability, and a polyglot persistence layer optimized for each data access pattern.

### 1.1 High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT LAYER                                    │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐ │
│  │   Landing    │  │   Chatbot    │  │   Vision     │  │   Monitoring     │ │
│  │    (Hero)    │  │   (RAG)      │  │  Playground  │  │   Dashboard      │ │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └────────┬─────────┘ │
│         │                 │                 │                   │           │
│  ┌──────┴─────────────────┴─────────────────┴───────────────────┴───────┐   │
│  │                        Astro (SSR + Islands)                         │   │
│  │              React 18 · Tailwind CSS · Framer Motion                 │   │
│  └────────────────────────────────┬──────────────────────────────────────┘   │
└───────────────────────────────────┼──────────────────────────────────────────┘
                                    │ HTTPS / WSS
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                            GATEWAY LAYER                                     │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │                         FastAPI API Gateway                             │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐ │ │
│  │  │Rate Limiter │ │   Auth      │ │   CORS/     │ │ Structured Logging│ │ │
│  │  │  (Redis)    │ │Middleware   │ │   CSRF      │ │    Interceptor    │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────────┘ │ │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────────────┐ │ │
│  │  │   Request   │ │   JWT       │ │   Pydantic  │ │   API Versioning  │ │ │
│  │  │ Validation  │ │  Validation │ │   Parsing   │ │     Router        │ │ │
│  │  └─────────────┘ └─────────────┘ └─────────────┘ └───────────────────┘ │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────┬──────────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   REST / SSE     │    │    WebSocket     │    │  Background Jobs │
│   Synchronous    │    │    Real-Time     │    │   (Celery+Redis) │
└────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘
         │                       │                       │
┌────────▼───────────────────────▼───────────────────────▼─────────┐
│                         SERVICE LAYER                             │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────┐ │
│  │   Chatbot    │ │  Face Recog  │ │ Multi-Agent  │ │  Vector  │ │
│  │    (RAG)     │ │   (ONNX)     │ │ (LangGraph)  │ │  Search  │ │
│  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └────┬─────┘ │
│         │                │                │              │       │
│  ┌──────┴────────────────┴────────────────┴──────────────┴──────┐ │
│  │              AI/ML Inference & Orchestration                   │ │
│  │   OpenAI · SentenceTransformer · InsightFace · LangGraph      │ │
│  └───────────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────┘
                                    │
              ┌─────────────────────┼─────────────────────┐
              │                     │                     │
              ▼                     ▼                     ▼
┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐
│   PostgreSQL     │    │     Qdrant       │    │      Redis       │
│   (Relational)   │    │   (Vector DB)    │    │  Cache / Queue   │
│                  │    │                  │    │                  │
│  users, sessions │    │  documents(1536d)│    │  rate limits     │
│  api_logs,       │    │  faces(512d)     │    │  sessions        │
│  workflows       │    │                  │    │  metrics buffer  │
└──────────────────┘    └──────────────────┘    └──────────────────┘
              │                     │                     │
              └─────────────────────┼─────────────────────┘
                                    │
                                    ▼
                          ┌──────────────────┐
                          │  MinIO / S3      │
                          │ (Object Storage) │
                          │  Images, Models  │
                          └──────────────────┘
```

### 1.2 Core Design Principles

| Principle | Description | Architectural Impact |
|-----------|-------------|----------------------|
| **Show, Don't Tell** | Visitors interact with live AI systems rather than reading static claims. | Every AI module exposes a public endpoint; no feature is documentation-only. |
| **Production Transparency** | API latency, token costs, and backend logs are visible to visitors. | Dedicated observability module with real-time metrics and structured log broadcasting. |
| **Modular Monolith** | Internal services are decoupled but deployed as a single unit for simplicity. | Clean module boundaries; each service can be extracted into a standalone microservice if scale demands. |
| **Polyglot Persistence** | Each data type is stored in the engine best suited for its access pattern. | PostgreSQL for relational, Qdrant for vectors, Redis for ephemeral state, MinIO for objects. |
| **Async-First AI** | All AI inference is treated as potentially slow and is offloaded to background workers. | Celery + Redis for queue management; SSE/WebSocket for result delivery. |
| **Defense in Depth** | Security controls at edge, gateway, application, and data layers. | Rate limiting, JWT validation, Pydantic parsing, parameterized queries, secret management. |
| **Observability by Design** | Metrics, logs, and traces are first-class concerns, not afterthoughts. | Prometheus metrics, structured JSON logging, OpenTelemetry tracing integrated from day one. |

---

## 2. Layer Descriptions

### 2.1 Client Layer

The client layer is an **Astro application** using file-based routing and island architecture. It serves dual purposes: (1) it is the primary user-facing interface for all AI interactions, and (2) it acts as a lightweight API proxy to the FastAPI backend gateway, abstracting internal service URLs from the browser.

| Concern | Implementation | Rationale |
|---------|---------------|-----------|
| Routing | Astro file-based routing with layouts and islands | Enables colocated layouts, loading states, and feature-scoped interactive components. |
| Styling | Tailwind CSS + Design Tokens | Utility-first approach enables rapid UI iteration while maintaining consistency via a centralized design system. |
| Animation | Framer Motion | Declarative animations for page transitions, micro-interactions, and real-time state change visualizations. |
| Real-time UI | Socket.IO Client + EventSource | WebSocket for bidirectional data (logs, agent status); SSE for unidirectional streaming (chat tokens, metrics). |
| Markdown | ReactMarkdown + DOMPurify + Prism | Safe rendering of AI-generated markdown with syntax highlighting for code blocks. |

The client is organized into **feature domains**: `(landing)/`, `chat/`, `vision/`, `agents/`, `metrics/`, and `logs/`. Each domain is self-contained with its own data-fetching layer, state management, and route segments.

### 2.2 Gateway Layer

The gateway layer is the **single entry point** for all client requests. Built on FastAPI, it enforces cross-cutting concerns before requests reach business logic.

**Middleware Stack (execution order):**

1. **CORS & Trusted Host Validation** — Enforces allowed origins and host headers.
2. **Structured Logging Interceptor** — Assigns `trace_id` to every request; logs incoming request metadata.
3. **Rate Limiting Middleware** — Redis-backed sliding-window counter; tiered limits for guest, developer, and admin.
4. **Auth Middleware** — Extracts and validates JWT from HttpOnly cookie or `Authorization` header; injects `current_user` dependency.
5. **CSRF Protection** — State-changing endpoints validate CSRF token for non-GET requests.
6. **Request Validation** — Pydantic models enforce strict input schemas; automatic 422 responses for malformed data.
7. **Exception Handling** — Global exception handlers translate internal errors into standardized JSON error responses.

The gateway also serves auto-generated OpenAPI documentation at `/docs`, which feeds the interactive API Explorer module.

### 2.3 AI Services Layer

The AI services layer encapsulates all machine learning and artificial intelligence operations. It is internally subdivided into four specialized domains:

| Domain | Technology | Responsibility |
|--------|-----------|--------------|
| **LLM Inference** | OpenAI API (GPT-4o, GPT-4o-mini) | Text generation, chat completion, structured output, function calling. |
| **Embedding Generation** | OpenAI text-embedding-3-small / SentenceTransformer | Vector generation for documents and queries; dimensionality normalization. |
| **Face Recognition** | InsightFace (buffalo_l) + ONNX Runtime | Face detection, alignment, and 512-dimensional embedding extraction. |
| **Agent Orchestration** | LangGraph + LangChain | Multi-agent workflow graphs with conditional edges, tool binding, and state persistence. |

All AI services are accessed through an internal service facade that abstracts provider-specific SDKs. This facade enables future migration to local models (e.g., via Ollama or vLLM) without changing router or business logic.

### 2.4 Real-Time Layer

The real-time layer provides **three distinct transport mechanisms** optimized for their respective use cases:

| Transport | Protocol | Use Case | Direction |
|-----------|----------|----------|-----------|
| **Server-Sent Events (SSE)** | HTTP/1.1 or HTTP/2 | Chat token streaming, metrics dashboard updates | Server → Client |
| **WebSocket** | WS/WSS | Live log terminal, agent status updates, bidirectional signaling | Bidirectional |
| **REST Polling** | HTTP | Fallback for environments with aggressive proxy/firewall rules | Client → Server |

SSE is preferred over WebSocket for streaming chat responses because it reuses the HTTP connection, works reliably through corporate proxies, and integrates naturally with FastAPI's `StreamingResponse`. WebSocket is reserved for true bidirectional communication where the client must push commands (e.g., starting/stopping a log stream) and the server must push updates.

### 2.5 Infrastructure Services Layer

| Service | Role | Data Stored | Durability |
|---------|------|-------------|------------|
| **PostgreSQL** | System of record | Users, sessions, API audit logs, workflow definitions, chat histories | Persistent |
| **Qdrant** | Vector search engine | Document embeddings (1536d, Cosine), face embeddings (512d, Euclidean) | Persistent |
| **Redis** | Ephemeral data plane | Rate-limit counters, JWT session cache, Celery task queues, real-time metrics buffers | Ephemeral (configurable persistence) |
| **MinIO / S3** | Object storage | Uploaded images, model artifacts, exported logs, generated assets | Persistent |

---

## 3. Technology Rationale

### 3.1 Why Astro?

Astro was selected over alternatives (Nuxt, SvelteKit, plain React SPA) for the following reasons:

- **Island architecture** reduces client-side JavaScript payload for static content-heavy pages (landing, documentation).
- **API endpoints** allow the Astro application to proxy requests to FastAPI without exposing internal backend ports or requiring a separate reverse proxy in local development.
- **SSR + partial hydration** aligns with the chat module's need to stream partial responses to the client.
- **Ecosystem maturity** ensures availability of integration libraries for Socket.IO, TanStack Query, and MDX.

### 3.2 Why FastAPI?

FastAPI was chosen as the backend gateway because it provides:

- **Native async/await** support for high-concurrency I/O-bound workloads (waiting on OpenAI API, database queries).
- **Automatic OpenAPI generation** from Pydantic models and type hints, which powers the interactive API Explorer.
- **Dependency Injection system** that enables clean, testable middleware and service composition.
- **WebSocket and SSE support** built into the framework without additional libraries.

Alternatives considered: Express.js (too callback-heavy for async AI workloads), Django (too opinionated, slower async support), Go/Gin (excellent performance but slower development velocity for a solo developer).

### 3.3 Why Qdrant over Pinecone/Weaviate?

Qdrant was selected as the vector database because:

- **Open-source and self-hostable** via Docker, eliminating vendor lock-in and ongoing SaaS costs for a portfolio project.
- **Native hybrid search** (dense vectors + sparse vectors / BM25) without requiring external search plugins.
- **Payload filtering** with rich query DSL enables pre-filtering by metadata (e.g., `module=chatbot`) before vector search.
- **Rust-based engine** delivers sub-100ms ANN query latency on modest hardware.

### 3.4 Why LangGraph for Agents?

LangGraph was chosen over simple ReAct loops or custom state machines because:

- **Graph-based orchestration** models agent workflows as directed graphs with cycles, accurately representing iterative reasoning patterns.
- **Built-in state persistence** enables pausing and resuming long-running agent workflows across worker restarts.
- **Human-in-the-loop support** allows the system to interrupt agents for approval at critical decision points — a production-grade feature expected by senior evaluators.
- **Integration with LangChain ecosystem** provides ready-made tool abstractions for vector search, API calls, and code execution.

---

## 4. Architecture Decision Records (ADRs)

### ADR-001: Microservices-Ready Monolith Pattern

**Status:** Accepted  
**Context:** The project must demonstrate production system design while remaining deployable by a single developer with minimal infrastructure budget.  
**Decision:** Implement the system as a modular monolith with strict internal service boundaries. Each module (chatbot, vision, agents) has its own router, service layer, and data access objects.  
**Consequences:**
- **Positive:** Single deployment artifact reduces operational complexity; shared database connection pooling reduces resource usage; simpler end-to-end testing.
- **Negative:** Risk of tight coupling if module boundaries are not respected; requires discipline to avoid cross-module direct imports.
- **Migration path:** If any module requires independent scaling, its router and service layer can be extracted into a standalone FastAPI service with minimal refactoring.

### ADR-002: Astro Endpoints as Reverse Proxy

**Status:** Accepted  
**Context:** The frontend and backend run as separate processes in development but must present a unified origin to the browser for cookie-based auth and CORS simplicity.  
**Decision:** Use Astro endpoints (`/apps/web/src/pages/api/[...path].ts`) as a transparent reverse proxy to the FastAPI backend.  
**Consequences:**
- **Positive:** Eliminates CORS configuration complexity in local development; allows cookie forwarding without domain gymnastics; frontend can add request/response transformations if needed.
- **Negative:** Adds a small latency overhead (~1-2ms) per request; requires the Astro server to be running even for API-only testing.

### ADR-003: Polyglot Persistence

**Status:** Accepted  
**Context:** The system handles relational metadata, high-dimensional vectors, ephemeral counters, and binary objects. No single database engine optimally serves all four access patterns.  
**Decision:** Use PostgreSQL for relational data, Qdrant for vectors, Redis for ephemeral state and queues, and MinIO/S3 for objects.  
**Consequences:**
- **Positive:** Each engine is optimized for its workload; Qdrant's HNSW indexing outperforms pgvector at scale; Redis provides sub-millisecond cache latency.
- **Negative:** Operational complexity of managing four data stores; potential for data inconsistency if transactions span multiple engines; requires careful error handling on partial failures.
- **Mitigation:** All cross-engine operations are modeled as idempotent background jobs with at-least-once delivery semantics.

### ADR-004: Celery + Redis for Background Jobs

**Status:** Accepted  
**Context:** AI inference (LLM calls, embedding generation, face detection) is latency-unpredictable and must not block HTTP request workers.  
**Decision:** Use Celery with Redis as the broker and result backend for all background inference tasks.  
**Consequences:**
- **Positive:** Proven, well-documented task queue; supports task retries with exponential backoff; result backend enables polling patterns where WebSocket is unavailable.
- **Negative:** Celery has known issues with Redis broker visibility timeouts on long-running tasks; requires careful configuration of `visibility_timeout` and `result_expires`.
- **Alternative:** RQ was considered but lacks the advanced routing, periodic tasks, and monitoring ecosystem of Celery.

### ADR-005: SSE over WebSocket for Chat Streaming

**Status:** Accepted  
**Context:** The chatbot module streams LLM tokens to the client. The transport must work through corporate proxies, support automatic reconnection, and require minimal client-side state management.  
**Decision:** Use Server-Sent Events (SSE) for chat response streaming.  
**Consequences:**
- **Positive:** Works over standard HTTP; automatic reconnection with `Last-Event-ID`; no need for connection management libraries on the client; firewall-friendly.
- **Negative:** Unidirectional only; client cannot send messages over the same connection (mitigated by initiating chat with a POST request, then opening SSE for the response stream).
- **Alternative:** WebSocket would enable full-duplex but requires more complex connection state management and is sometimes blocked by enterprise proxies.

---

## 5. Cross-Cutting Concerns

### 5.1 Security Architecture

Security is implemented as a set of **concentric layers** rather than a single perimeter defense:

| Layer | Control | Implementation |
|-------|---------|---------------|
| Edge | HTTPS only, HSTS | Reverse proxy / CDN configuration |
| Gateway | Rate limiting, JWT validation, CORS | FastAPI middleware + Redis |
| Application | RBAC, input validation, prompt injection mitigation | Pydantic schemas, keyword filters, parameterized queries |
| Data | Encryption at rest, secret management | PostgreSQL SSL, env-var secrets, field-level redaction in logs |
| Audit | Structured logging, audit trails | JSON logger with `trace_id`, admin action log table |

### 5.2 Observability Architecture

The three pillars of observability are implemented as follows:

| Pillar | Tool | Data Collected |
|--------|------|---------------|
| **Metrics** | Prometheus + Custom Aggregator | API latency histograms, request counters, token cost gauges, queue depth |
| **Logs** | Structured JSON Logger + Loki (optional) | Application logs, audit logs, error traces; only `[SHOWCASE_LOG]` tagged logs are broadcast to visitors |
| **Traces** | OpenTelemetry (optional) | Distributed trace across FastAPI → Celery → OpenAI API → Qdrant |

### 5.3 Scalability Strategy

While the initial deployment is a single-unit monolith, the architecture is designed to scale along three axes:

1. **Horizontal Scaling:** FastAPI instances are stateless (session data in Redis). A load balancer can distribute requests across multiple API replicas.
2. **Worker Autoscaling:** Celery workers can be scaled independently based on Redis queue depth metrics.
3. **Database Read Replicas:** PostgreSQL read replicas can serve analytics queries (metrics, logs) without impacting transactional write throughput.
4. **CDN Offloading:** Static Astro assets are served via CDN, reducing origin server load.
5. **Vector Search Optimization:** Qdrant HNSW indexing with `m=16`, `ef_construct=100` provides approximate nearest neighbor search with configurable recall/latency trade-offs.

---

## 6. Module Dependency Graph

```
Foundation Layer (always loaded)
├── Auth & Rate Limiting
├── Structured Logging
└── Health Check

Core AI Layer
├── Vector Search      (depends on: Foundation)
├── LLM Chatbot (RAG)  (depends on: Foundation, Vector Search)
└── Face Recognition   (depends on: Foundation, Object Storage)

Realtime Layer
├── Monitoring Dashboard (depends on: Foundation)
├── Live Logs Viewer     (depends on: Foundation)
└── API Explorer         (depends on: Foundation)

Advanced AI Layer
├── Multi-Agent System   (depends on: LLM Chatbot)
├── AI Playground        (depends on: LLM Chatbot)
└── Workflow Automation  (depends on: Multi-Agent)

Admin Layer
└── Admin Panel          (depends on: Auth, Monitoring, LLM Chatbot)
```

This dependency graph informs the development roadmap: Foundation modules are built first, followed by Core AI, then Realtime, then Advanced AI, and finally Admin tools.

---

## 7. Glossary

| Term | Definition |
|------|------------|
| **ANN** | Approximate Nearest Neighbor — algorithm class for efficient vector similarity search. |
| **HNSW** | Hierarchical Navigable Small World — graph-based ANN algorithm used by Qdrant. |
| **RAG** | Retrieval-Augmented Generation — pattern of augmenting LLM prompts with retrieved document chunks. |
| **SSE** | Server-Sent Events — HTTP-based server push technology for unidirectional streaming. |
| **TTFT** | Time to First Token — latency metric measuring delay from request to first streamed LLM token. |
| **RBAC** | Role-Based Access Control — authorization pattern restricting actions by user role. |

---

*Document maintained by the Architecture Team. Last updated: 2026-05-06.*
