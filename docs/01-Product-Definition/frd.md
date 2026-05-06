# Feature Requirement Document (FRD)

> **Project:** Interactive AI Engineering Portfolio & Sandbox
> **Version:** 1.0
> **Owner:** Adrian Fahri Affandi
> **Role:** Senior Fullstack AI / Systems Engineer
> **Last Updated:** 2026-05-06

---

## Table of Contents

1. [Document Purpose](#1-document-purpose)
2. [Product Summary](#2-product-summary)
3. [System Modules](#3-system-modules)
4. [Module Feature Requirements](#4-module-feature-requirements)
5. [Frontend Architecture](#5-frontend-architecture)
6. [Backend Architecture](#6-backend-architecture)
7. [AI / LLM Architecture](#7-ai--llm-architecture)
8. [Database Design](#8-database-design)
9. [Observability & Monitoring](#9-observability--monitoring)
10. [Security Requirements](#10-security-requirements)
11. [Real-Time Communication Design](#11-real-time-communication-design)
12. [Scalability Considerations](#12-scalability-considerations)
13. [UI / UX Direction](#13-ui--ux-direction)
14. [Portfolio Storytelling Strategy](#14-portfolio-storytelling-strategy)
15. [Senior-Level Differentiators](#15-senior-level-differentiators)

---

## 1. Document Purpose

This document consolidates all functional, architectural, and non-functional requirements for the Interactive AI Engineering Portfolio & Sandbox. It serves as the single source of truth for:

- What features exist and how they interrelate.
- The architectural patterns and technology choices that underpin each feature.
- The acceptance criteria against which implementation will be validated.

Every module described here has a dedicated deep-dive document in `docs/` (e.g., `04-Module-Face-Recognition.md`). This document provides the consolidated, cross-module view.

---

## 2. Product Summary

The platform is a **production-grade interactive showcase** that allows visitors to:

1. Interact with live AI systems (RAG chatbot, face recognition, multi-agent workflows, vector search).
2. Observe real-time system metrics, backend logs, and infrastructure health.
3. Explore API contracts through an interactive documentation interface.
4. Experience the platform without registration via a cryptographically secured guest tier.

The product demonstrates **end-to-end engineering maturity**: frontend UX, backend API design, AI/ML pipeline integration, database optimization, infrastructure operations, and security hardening.

---

## 3. System Modules

### 3.1 Module Inventory

| Module | Category | Priority | Dependencies |
|--------|----------|----------|-------------|
| **Face Recognition** | AI / Computer Vision | High | FastAPI, Redis, PostgreSQL, Qdrant, MinIO |
| **LLM Chatbot (RAG)** | AI / NLP | High | PostgreSQL, Qdrant, Redis, OpenAI API |
| **Vector Search Demo** | AI / RAG | High | Qdrant, SentenceTransformer, PostgreSQL |
| **AI Playground** | Interactive Demo | High | LLM Chatbot module |
| **Monitoring Dashboard** | Observability | High | Prometheus, Redis, SSE |
| **Live Logs Viewer** | Infrastructure | High | WebSocket, Structured Logger |
| **Authentication & Rate Limiting** | Security | High | Redis, PostgreSQL, GitHub OAuth |
| **API Explorer** | Developer Experience | High | FastAPI OpenAPI auto-generation |
| **Multi-Agent System** | AI Orchestration | Medium | LLM Chatbot, Redis, WebSocket, Celery |
| **Admin Panel** | Internal Tools | Medium | Auth, Monitoring, LLM Chatbot |
| **Workflow Automation** | AI Automation | Medium | Multi-Agent, Auth, Redis, Celery |

### 3.2 Priority Definitions

| Priority | Meaning |
|----------|---------|
| **High** | Must be implemented in Phases 1–3 (Foundation, Core AI, Realtime Systems). The product is incomplete without these. |
| **Medium** | Must be implemented in Phases 4–5 (Advanced AI, Production Hardening). These elevate the product from "impressive" to "exceptional." |
| **Low** | Nice-to-have; may be deferred post-launch or implemented as stretch goals. |

---

## 4. Module Feature Requirements

### 4.1 Face Recognition Module

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-VIS-001 | Image upload endpoint accepting JPEG / PNG with validation | Rejects non-image files; validates dimensions, file size (< 10 MB); sanitizes EXIF data |
| FR-VIS-002 | Face detection using InsightFace (buffalo_l) + ONNX Runtime | Returns bounding boxes, confidence scores, and 512-d embedding vectors per detected face |
| FR-VIS-003 | Face matching against a pre-indexed gallery stored in Qdrant | Returns top-K matches with similarity scores and gallery metadata |
| FR-VIS-004 | CPU-optimized inference path with optional GPU acceleration | CPU inference < 2s; GPU inference < 500ms for a single 1080p image |
| FR-VIS-005 | Real-time preprocessing pipeline (resize, normalization, color space conversion) | Uses OpenCV for consistent input formatting before model inference |
| FR-VIS-006 | Visual playground UI with drag-and-drop upload, bounding box overlay, and result panel | Bounding boxes render with confidence labels; matched gallery images display side-by-side |
| FR-VIS-007 | Latency and inference metrics emitted per request | Prometheus histogram incremented; log entry tagged `[SHOWCASE_LOG]` |

### 4.2 LLM Chatbot Module (RAG)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-CHAT-001 | Document ingestion pipeline supporting PDF, TXT, and Markdown | Extracts text, splits into chunks (configurable size / overlap), generates embeddings, stores in Qdrant |
| FR-CHAT-002 | Hybrid retrieval: vector similarity (cosine) + BM25 keyword search | Retrieved chunks ranked by combined score; reranked via cross-encoder or Cohere API |
| FR-CHAT-003 | Streaming chat endpoint using Server-Sent Events (SSE) | First token delivered within 1.5s (TTFT); tokens stream at > 10 tokens/second |
| FR-CHAT-004 | Citations and source attribution in every response | Each claim linked to source chunk ID, document name, and page number (where applicable) |
| FR-CHAT-005 | Conversation history persisted in PostgreSQL | Messages stored with `conversation_id`, `role`, `content`, `timestamp`, `model_used` |
| FR-CHAT-006 | System prompt isolation — never concatenated raw with user input | System prompt stored server-side; user input sanitized and delimited before LLM submission |
| FR-CHAT-007 | Prompt injection mitigation layer | Blocks dangerous keywords: `"ignore previous instructions"`, `"system prompt"`, `"you are now"`, `"DAN"`; logs blocked attempts |
| FR-CHAT-008 | Model tiering: gpt-4o-mini (default), gpt-4o (premium), gpt-3.5-turbo (fallback) | Tier selection based on user role and request complexity; cost tracked per tier |

### 4.3 Multi-Agent Module

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-AGENT-001 | LangGraph-based workflow orchestration | Agents defined as nodes; edges represent conditional routing based on LLM output or tool results |
| FR-AGENT-002 | Visual workflow graph rendered in the UI | Nodes display status (idle, running, completed, error); edges animate during execution |
| FR-AGENT-003 | Real-time status streaming via WebSocket | Each agent node emits status updates, intermediate outputs, and timing data |
| FR-AGENT-004 | Pre-built workflow templates | At minimum: "Research Agent" (web search + summarize), "Code Review Agent" (analyze + suggest), "Data Analysis Agent" (parse + visualize) |
| FR-AGENT-005 | Workflow execution logging with trace IDs | Full execution trace stored in PostgreSQL; retrievable via Admin Panel |
| FR-AGENT-006 | Async execution via Celery worker | Long-running workflows dispatched to background workers; WebSocket notifies on completion |

### 4.4 AI Playground Module

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-PLAY-001 | Side-by-side model comparison interface | User enters one prompt; multiple models respond in parallel panes |
| FR-PLAY-002 | Configurable generation parameters | Temperature, max_tokens, top_p, presence_penalty, frequency_penalty exposed as sliders |
| FR-PLAY-003 | Token usage and cost display per response | Real-time token count and estimated USD cost shown below each output |
| FR-PLAY-004 | Prompt template library | Pre-loaded templates for common tasks (summarization, translation, code generation, JSON extraction) |
| FR-PLAY-005 | Export conversation as Markdown or JSON | One-click download of the full session |

### 4.5 Vector Search Demo Module

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-VEC-001 | Embedding generation via OpenAI text-embedding-3-small and SentenceTransformer | User can toggle between models; embedding dimension and model name displayed |
| FR-VEC-002 | Multi-modal collection management in Qdrant | Collections for documents, images (face embeddings), and custom user-uploaded data |
| FR-VEC-003 | Similarity search with configurable top-K and distance metric | Supports cosine, Euclidean, and dot-product similarity; results display raw score |
| FR-VEC-004 | Raw vector inspection | User can view the actual embedding vector (truncated for readability) and payload metadata |
| FR-VEC-005 | Indexing strategy visualization | Display HNSW index parameters: M, ef_construct, ef; explain impact on speed vs. recall |

### 4.6 Monitoring Dashboard Module

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-MON-001 | Real-time metrics stream via Server-Sent Events (SSE) | Updates every 2–3 seconds; reconnects automatically on connection drop |
| FR-MON-002 | Key metric visualization: request rate, latency histogram, error rate, active connections | Recharts-based charts with time range selection (1m, 5m, 15m, 1h) |
| FR-MON-003 | Token economics dashboard | Cumulative OpenAI spend, tokens per model, average cost per request |
| FR-MON-004 | Cache performance panel | Cache hit/miss ratio, Redis memory usage, eviction rate |
| FR-MON-005 | Queue depth and worker status | Celery queue length, active worker count, task throughput |
| FR-MON-006 | System health cards | PostgreSQL, Redis, Qdrant, MinIO connection status with last-checked timestamp |

### 4.7 Live Logs Viewer Module

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-LOG-001 | Structured JSON log ingestion from application | Logs in JSON format with required fields: `timestamp`, `level`, `module`, `message`, `trace_id` |
| FR-LOG-002 | WebSocket broadcast of logs tagged `[SHOWCASE_LOG]` | Only tagged logs are broadcast to clients; sensitive logs remain server-side only |
| FR-LOG-003 | Log level filtering in the UI (DEBUG, INFO, WARN, ERROR) | Toggle filters update the stream in real time without page reload |
| FR-LOG-004 | Search and highlight within the log stream | Ctrl+F-style search with regex support; matching lines highlighted |
| FR-LOG-005 | Auto-scroll with pause/resume control | Stream auto-scrolls to newest entry; user can pause to inspect; resume jumps to latest |
| FR-LOG-006 | Sensitive data redaction | Fields `password`, `token`, `api_key`, `secret` automatically masked as `"[REDACTED]"` before broadcast |

### 4.8 API Explorer Module

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-API-001 | Auto-generated OpenAPI / Swagger documentation | Derived from FastAPI route definitions, Pydantic schemas, and docstrings |
| FR-API-002 | Interactive "Try It" functionality | Visitors can execute endpoints directly from the documentation UI with their session credentials |
| FR-API-003 | Request/response schema expansion | Nested Pydantic models display with field descriptions, types, and example values |
| FR-API-004 | Rate limit and auth requirement visibility | Each endpoint displays required auth tier and rate limit consumption |
| FR-API-005 | Copy-to-clipboard for cURL commands | One-click generation of equivalent cURL with headers and payload |

### 4.9 Authentication & Rate Limiting Module

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-AUTH-001 | Guest ID generation from IP + User-Agent hash | HMAC-signed server-side with a rotating secret; tampering results in rejection |
| FR-AUTH-002 | GitHub OAuth 2.0 PKCE flow | Secure authorization code flow with random `state` parameter; no implicit flow |
| FR-AUTH-003 | JWT access tokens (HS256, 7-day expiry) | Payload contains `user_id`, `role`, `issued_at`; validated on every request |
| FR-AUTH-004 | HttpOnly cookie + Redis session backup | Cookie flags: `Secure`, `SameSite=Lax`, `HttpOnly`; session mirrored in Redis for revocation |
| FR-AUTH-005 | Sliding-window rate limiting via Redis | Guest: 20 requests / 24h; Developer: 200 requests / 24h; Admin: unlimited |
| FR-AUTH-006 | Rate limit headers in all API responses | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` |
| FR-AUTH-007 | Graceful degradation on auth service failure | If Redis is unavailable, fallback to JWT-only validation with conservative rate limits |

### 4.10 Admin Panel Module

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-ADMIN-001 | Role-gated access (Admin only) | Non-admin users receive 403; no client-side bypass possible |
| FR-ADMIN-002 | User session overview | Table of active sessions with IP, user agent, request count, last activity |
| FR-ADMIN-003 | Rate limit override capability | Admins can grant temporary quota boosts or revoke access |
| FR-ADMIN-004 | System configuration panel | Toggle feature flags, adjust rate limits, update model tier defaults |
| FR-ADMIN-005 | Audit log of admin actions | Every admin action logged with `admin_id`, `action`, `target`, `timestamp`, `before/after state` |

### 4.11 Workflow Automation Module

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| FR-WF-001 | Visual workflow builder (drag-and-drop) | Nodes represent agents, tools, or conditionals; edges define execution flow |
| FR-WF-002 | Workflow persistence in PostgreSQL | Workflows saved with versioning; previous versions retrievable |
| FR-WF-003 | Trigger types: manual, scheduled (cron), webhook | Each workflow configurable with one or more trigger types |
| FR-WF-004 | Execution history with replay capability | Past executions viewable; failed workflows can be replayed from a specific node |
| FR-WF-005 | Integration with existing Multi-Agent module | Workflow builder reuses LangGraph nodes and tools defined in the agent system |

---

## 5. Frontend Architecture

### 5.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Astro | SSR, file-based routing, API proxy routes, islands |
| UI Library | React 18 | Component architecture, hooks, concurrent features |
| Styling | Tailwind CSS | Utility-first styling, dark mode support, design token consistency |
| State Management | Zustand | Lightweight global state for auth, metrics, theme |
| Server State | TanStack Query (React Query) | Data fetching, caching, background polling, mutation handling |
| Charts | Recharts | Metrics visualization, time-series data, histograms |
| Animation | Framer Motion | Micro-interactions, page transitions, layout animations |
| Real-Time Client | Socket.IO Client | WebSocket connections for logs and agent status |
| Markdown Rendering | ReactMarkdown + DOMPurify + Prism | Chat message rendering, syntax highlighting, XSS sanitization |

### 5.2 Folder Structure

```
/apps/web
├── src/pages/                    # Astro file-based routes and endpoints
│   ├── (landing)/                # Landing page route group
│   ├── chat/                     # Chatbot interface
│   ├── vision/                   # Computer vision playground
│   ├── agents/                   # Multi-agent workflow viewer
│   ├── metrics/                  # Monitoring dashboard
│   ├── logs/                     # Live logs terminal
│   ├── api-docs/                 # API Explorer (Swagger UI wrapper)
│   └── layout.tsx                # Root layout: dark mode, providers, metadata
├── modules/                      # Domain-specific modules
│   ├── auth/
│   ├── chatbot/
│   ├── vision/
│   ├── agents/
│   ├── metrics/
│   └── logs/
├── components/
│   ├── ui/                       # Base UI primitives (Button, Input, Card, Badge)
│   ├── shared/                   # Cross-module components (Header, Sidebar, Footer)
│   └── providers/                # Context providers (ThemeProvider, AuthProvider)
├── hooks/                        # Custom React hooks
├── stores/                       # Zustand store definitions
├── services/                     # API client functions (axios/fetch wrappers)
├── lib/                          # Utilities, constants, TypeScript types
└── public/
    └── assets/                   # Static images, icons, fonts
```

### 5.3 Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| **App Router over Pages Router** | Native support for layouts, streaming SSR, and server components — critical for performance with data-heavy dashboards. |
| **Zustand over Redux** | Simpler boilerplate, adequate for the application's state complexity, better tree-shaking. |
| **TanStack Query over SWR** | Superior mutation handling, optimistic updates, and devtools — important for interactive demos. |
| **Tailwind over CSS-in-JS** | Zero runtime cost, excellent dark mode support, consistent with modern developer-tool aesthetics. |

---

## 6. Backend Architecture

### 6.1 Technology Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| API Gateway | FastAPI | High-performance async Python framework, automatic OpenAPI generation, native WebSocket support |
| Task Queue | Celery + Redis | Background tasks, async inference offloading, scheduled workflow execution |
| Cache | Redis | Rate limiting counters, session store, metrics buffer, pub/sub for real-time features |
| Relational Database | PostgreSQL | Users, sessions, conversations, audit logs, workflow definitions |
| Vector Database | Qdrant | Semantic search, face embeddings, ANN indexing |
| Object Storage | MinIO (local) / AWS S3 (cloud) | Image uploads, document ingestion artifacts, model cache |
| Real-Time | FastAPI native WebSocket | Streaming logs, agent status updates |
| Observability | Prometheus + Loki + OpenTelemetry | Metrics collection, log aggregation, distributed tracing |

### 6.2 Folder Structure

```
/apps/api
├── app/
│   ├── main.py                   # FastAPI app factory, middleware mount, lifespan events
│   ├── config.py                 # Pydantic Settings, environment variable validation
│   └── dependencies.py           # Shared FastAPI dependencies (DB session, Redis client, current user)
├── routers/                      # API route modules
│   ├── auth.py
│   ├── chat.py
│   ├── vision.py
│   ├── vector.py
│   ├── agents.py
│   ├── metrics.py
│   ├── logs.py
│   └── health.py
├── services/                     # Business logic layer
│   ├── chat_service.py
│   ├── vision_service.py
│   ├── embedding_service.py
│   └── rate_limit_service.py
├── models/                       # SQLAlchemy ORM models
│   ├── user.py
│   ├── conversation.py
│   ├── message.py
│   └── audit_log.py
├── schemas/                      # Pydantic request/response models
├── core/                         # Core infrastructure
│   ├── security.py               # Password hashing, JWT utils, HMAC signing
│   ├── rate_limiter.py           # Sliding window algorithm implementation
│   ├── logger.py                 # Structured JSON logger with [SHOWCASE_LOG] tagging
│   └── exceptions.py             # Custom exception classes and global exception handlers
├── infra/                        # External integrations
│   ├── redis_client.py
│   ├── db.py                     # SQLAlchemy engine, session factory
│   ├── qdrant_client.py
│   ├── openai_client.py          # Async OpenAI client with retry/backoff
│   └── s3_client.py
└── workers/                      # Celery task definitions
    ├── inference_tasks.py
    ├── embedding_tasks.py
    └── workflow_tasks.py
```

### 6.3 API Design Standards

| Standard | Implementation |
|----------|---------------|
| Descriptive docstrings | Every endpoint includes a clear docstring describing purpose, request body, and response shape |
| Explicit `response_model` | All routes declare Pydantic response models; no untyped returns |
| Error response documentation | `HTTPException` raised with structured `detail`; documented in OpenAPI schema |
| Transport protocol selection | REST for synchronous operations; SSE for server-to-client streaming; WebSocket for bidirectional real-time |
| Rate limit headers | Every response includes `X-RateLimit-*` headers |
| Request ID propagation | `X-Request-ID` header accepted or generated; propagated to all downstream calls and logs |

---

## 7. AI / LLM Architecture

### 7.1 Component Inventory

| Component | Technology | Purpose |
|-----------|-----------|---------|
| LLM Provider | OpenAI API | Text generation, chat completion, function calling |
| Models | gpt-4o-mini, gpt-4o, gpt-3.5-turbo | Tiered model selection based on complexity and cost constraints |
| Embeddings | OpenAI text-embedding-3-small, SentenceTransformer | Vector generation for RAG and semantic search |
| Retrieval Engine | Qdrant + Hybrid Search (BM25) | Semantic similarity + keyword retrieval |
| Reranker | Cross-encoder (local) / Cohere Rerank API | Re-ranking retrieved chunks for relevance |
| Agent Orchestration | LangGraph | Multi-agent workflow graph definition and execution |
| Face Recognition | InsightFace (buffalo_l) + ONNX Runtime | Face detection, alignment, and embedding extraction |
| Image Processing | OpenCV | Preprocessing, resizing, normalization, color space conversion |

### 7.2 RAG Pipeline Flow

```
User Query
    |
    v
[Query Rewriting & Expansion] ──> [Embedding Generation]
    |                                      |
    v                                      v
[Keyword Extract] ──> [BM25 Search]    [Vector Search (Qdrant)]
    |                                      |
    +──────────┬───────────────────────────+
               v
    [Result Fusion & Deduplication]
               |
               v
    [Reranking (Cross-encoder / Cohere)]
               |
               v
    [Top-K Context Assembly]
               |
               v
    [System Prompt + Context + User Query] ──> [LLM Stream (SSE)]
                                                       |
                                                       v
                                            [Response with Citations]
```

### 7.3 Model Tiering Strategy

| Tier | Model | Use Case | Cost Profile |
|------|-------|----------|-------------|
| **Default** | gpt-4o-mini | General chat, simple Q&A, document summarization | Lowest |
| **Premium** | gpt-4o | Complex reasoning, code generation, multi-step analysis | High |
| **Fallback** | gpt-3.5-turbo | High-load scenarios, rate limit proximity, simple completions | Low |

---

## 8. Database Design

### 8.1 Database Selection Rationale

| Data Type | Store | Rationale |
|-----------|-------|-----------|
| Relational / structured | PostgreSQL | ACID transactions, complex queries, audit trail requirements |
| Vector / semantic | Qdrant | HNSW ANN indexing, payload filtering, hybrid search support |
| Cache / ephemeral | Redis | Sub-millisecond access, pub/sub, atomic counters for rate limiting |
| Objects / files | MinIO / S3 | Immutable storage for images, documents, model artifacts |

### 8.2 PostgreSQL Schema Overview

| Table | Purpose | Key Fields |
|-------|---------|-----------|
| `users` | Registered users | `id`, `github_id`, `email`, `role`, `created_at` |
| `guest_sessions` | Anonymous guest tracking | `guest_id`, `ip_hash`, `user_agent_hash`, `quota_used`, `created_at` |
| `conversations` | Chat sessions | `id`, `user_id` (nullable), `guest_id` (nullable), `title`, `model_used`, `created_at` |
| `messages` | Individual chat messages | `id`, `conversation_id`, `role` (system/user/assistant), `content`, `tokens_used`, `latency_ms`, `created_at` |
| `documents` | Ingested knowledge base | `id`, `filename`, `chunk_count`, `embedding_model`, `status`, `created_at` |
| `chunks` | Text chunks for RAG | `id`, `document_id`, `content`, `page_number`, `embedding_vector_id` (references Qdrant) |
| `audit_logs` | Security and admin events | `id`, `actor_id`, `action`, `target_type`, `target_id`, `before_state`, `after_state`, `timestamp` |
| `workflows` | Saved automation workflows | `id`, `name`, `definition_json`, `version`, `owner_id`, `created_at`, `updated_at` |
| `workflow_executions` | Workflow run history | `id`, `workflow_id`, `status`, `started_at`, `completed_at`, `trace_id` |

### 8.3 Qdrant Collection Design

| Collection | Vector Dimension | Distance Metric | Payload Fields |
|-----------|------------------|-----------------|----------------|
| `document_chunks` | 1536 (OpenAI) or 768 (ST) | Cosine | `document_id`, `chunk_index`, `page_number`, `content_preview` |
| `face_embeddings` | 512 | Cosine | `person_id`, `image_path`, `confidence`, `metadata` |
| `custom_user_data` | 1536 | Cosine | `user_id`, `collection_name`, `source_type`, `created_at` |

---

## 9. Observability & Monitoring

### 9.1 Three Pillars

| Pillar | Tool | Purpose |
|--------|------|---------|
| **Metrics** | Prometheus + Custom Aggregator | API latency distributions, request rates, token costs, queue depths |
| **Logs** | Loki + Structured JSON Logger | Application logs, audit trails, error traces |
| **Traces** | OpenTelemetry + Jaeger (optional) | Distributed request tracing across services |

### 9.2 Key Metrics Catalog

| Metric Name | Type | Labels | Description |
|-------------|------|--------|-------------|
| `api_requests_total` | Counter | `method`, `endpoint`, `status_code` | Total HTTP requests |
| `api_latency_seconds` | Histogram | `method`, `endpoint` | Request latency distribution (P50, P90, P99) |
| `openai_tokens_total` | Counter | `model`, `token_type` (prompt/completion) | Token consumption |
| `openai_cost_usd` | Gauge | `model` | Estimated cumulative cost |
| `cache_hits_total` | Counter | `cache_name` | Redis cache hits |
| `cache_misses_total` | Counter | `cache_name` | Redis cache misses |
| `websocket_connections` | Gauge | — | Active WebSocket connections |
| `queue_depth` | Gauge | `queue_name` | Celery pending task count |
| `inference_latency_seconds` | Histogram | `model`, `device` (cpu/gpu) | ML inference latency |

### 9.3 Log Standards

| Field | Required | Description |
|-------|----------|-------------|
| `timestamp` | Yes | ISO 8601 with timezone |
| `level` | Yes | DEBUG, INFO, WARN, ERROR |
| `module` | Yes | Python module name |
| `message` | Yes | Human-readable description |
| `trace_id` | Yes | Unique request trace identifier |
| `showcase_log` | No | Boolean; if true, broadcast to clients |
| `request_id` | No | HTTP request correlation ID |
| `user_id` | No | Authenticated user or guest ID |

---

## 10. Security Requirements

### 10.1 Security Layers

| Layer | Controls |
|-------|----------|
| **Edge / Network** | HTTPS only, strict CORS policy, DDoS protection (Cloudflare / NGINX) |
| **Gateway** | Redis sliding-window rate limiting, JWT validation, request size limits, request sanitization |
| **Application** | RBAC (Guest / Developer / Admin), Pydantic input validation, prompt injection filters, SQL injection prevention |
| **Data** | Parameterized queries via ORM, secret management via environment variables, encryption at rest for sensitive fields |
| **Audit** | Structured JSON logging, admin action audit trail, abuse detection heuristics |

### 10.2 Rate Limiting Tiers

| Tier | Limit | Window | Identifier | Enforcement |
|------|-------|--------|-----------|-------------|
| Guest | 20 requests | 24 hours | `guest_id` (HMAC-signed) | Redis counter + middleware rejection |
| Developer | 200 requests | 24 hours | `user_id` (JWT-subject) | Redis counter + middleware rejection |
| Admin | Unlimited | — | `user_id` + `role=admin` | Bypass rate limit; audit log all actions |

### 10.3 Prompt Injection Mitigation

| Control | Implementation |
|---------|---------------|
| Keyword blocking | Reject inputs containing: `"ignore previous instructions"`, `"system prompt"`, `"you are now"`, `"DAN"`, `"jailbreak"` |
| Delimiter enforcement | User input wrapped in XML-like tags: `<user_input>...</user_input>` |
| System prompt isolation | System prompt never concatenated as raw string; stored as template variable |
| Output scanning | LLM responses scanned for PII leakage patterns; blocked if detected |

---

## 11. Real-Time Communication Design

### 11.1 Protocol Selection Matrix

| Use Case | Protocol | Direction | Reasoning |
|----------|----------|-----------|-----------|
| Chat streaming | SSE | Server → Client | Unidirectional, HTTP-compatible, automatic reconnection, low overhead |
| Live logs | WebSocket | Bidirectional | Real-time filtering commands from client; continuous stream from server |
| Agent status | WebSocket | Bidirectional | Client triggers workflow; server streams node-by-node updates |
| Metrics dashboard | SSE | Server → Client | Periodic push every 2–3s; no client input needed |
| Notifications | WebSocket | Server → Client | Instant delivery of system events |

### 11.2 Connection Management

| Requirement | Implementation |
|-------------|---------------|
| Connection limit per client | Max 3 concurrent WebSockets per session |
| Heartbeat | Ping/pong every 30s; disconnect after 2 missed pongs |
| Reconnection | Exponential backoff (1s, 2s, 4s, 8s, max 30s) |
| Authentication | JWT passed in `Authorization` header during WebSocket handshake |
| Broadcasting | Redis pub/sub for multi-instance deployments |

---

## 12. Scalability Considerations

### 12.1 Horizontal Scaling Strategy

| Component | Scaling Approach |
|-----------|-----------------|
| FastAPI API | Stateless; scale via container replication behind load balancer |
| Celery Workers | Scale based on queue depth metric; auto-scaling policy triggered at queue > 100 |
| PostgreSQL | Read replicas for analytics queries; connection pooling via PgBouncer |
| Redis | Cluster mode for cache and pub/sub; Sentinel for failover |
| Qdrant | Distributed deployment with sharding for large vector volumes |
| MinIO / S3 | Stateless object storage; CDN for public assets |

### 12.2 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Chatbot TTFT | < 1.5s | Synthetic chat benchmark |
| Chat P95 latency | < 500ms | API gateway logs |
| Vision inference (GPU) | < 500ms | Application metrics |
| Vision inference (CPU) | < 2s | Application metrics |
| Vector search (top-10) | < 200ms | Qdrant metrics |
| Log broadcast delay | < 500ms | End-to-end trace |
| Metrics SSE interval | 2–3s | Client-side measurement |
| System uptime | 99.9% | Uptime monitoring |

### 12.3 Cost Optimization

| Strategy | Implementation |
|----------|---------------|
| Model tiering | Default to cheapest model; escalate only for complex queries |
| Response caching | Cache common vector search results and embeddings in Redis |
| Async inference | Offload heavy ML tasks to Celery workers to free API threads |
| Token budgeting | Track cumulative spend; alert at 80% of monthly budget |
| CPU-first GPU-fallback | Run vision inference on CPU; GPU only if available and load-permitting |

---

## 13. UI / UX Direction

### 13.1 Design Principles

| Principle | Application |
|-----------|-------------|
| **Information density** | Technical dashboards display maximum useful data per pixel; narrative pages use breathing room |
| **Progressive disclosure** | Advanced configuration hidden behind collapsible panels; defaults are sensible |
| **Immediate feedback** | Every user action produces visible feedback within 100ms (loading spinners, toast notifications, metric updates) |
| **Error transparency** | Errors display technical detail (status code, trace ID) alongside friendly messaging |
| **Dark mode default** | Engineers expect dark mode; light mode offered as toggle |

### 13.2 Key UI Patterns

| Pattern | Location | Description |
|---------|----------|-------------|
| **Split-pane layout** | Chat, Playground | Left: controls / input; Right: output / visualization |
| **Terminal aesthetic** | Logs viewer | Monospace font, color-coded log levels, timestamp alignment |
| **Metric cards** | Dashboard | KPIs in large type; sparklines for trend; comparison badges |
| **Workflow graph** | Agents | Node-graph visualization with animated edges and status indicators |
| **Bounding box overlay** | Vision | SVG overlays on uploaded images with confidence tooltips |

### 13.3 Responsive Breakpoints

| Breakpoint | Target Devices | Layout Adjustments |
|-----------|---------------|--------------------|
| `>= 1440px` | Desktop | Full multi-pane layouts, sidebar navigation always visible |
| `1024px – 1439px` | Laptop | Condensed panes, collapsible sidebar |
| `768px – 1023px` | Tablet | Stacked layouts, tab-based navigation between panes |
| `< 768px` | Mobile | Single-column, bottom sheet for controls, simplified visualizations |

---

## 14. Portfolio Storytelling Strategy

The platform is not merely a collection of features — it is a **narrative about engineering maturity**. The storytelling strategy ensures visitors understand *why* each feature exists and *what* it proves.

### 14.1 Narrative Arc

| Stage | Page / Feature | Story Beat |
|-------|---------------|-----------|
| **Hook** | Landing page | "Most portfolios tell you what someone can do. This one lets you try it." |
| **Credibility** | Monitoring Dashboard | "Before you interact, see the system is alive. Real metrics. Real latency." |
| **Immersion** | Chatbot / Vision / Playground | "Now interact. Upload an image. Ask a question. Watch it work." |
| **Depth** | Live Logs / API Explorer | "See what usually stays hidden. Logs, traces, API contracts." |
| **Trust** | Architecture Diagram / About | "This is how it's built. These are the trade-offs. This is why." |
| **Conversion** | Contact / LinkedIn CTA | "Ready to talk? Here's how to reach me." |

### 14.2 Feature-to-Skill Mapping

| Feature | Engineering Skill Demonstrated |
|---------|-------------------------------|
| RAG Chatbot with citations | Information retrieval, prompt engineering, LLM integration, streaming |
| Face Recognition pipeline | Computer vision, ONNX optimization, vector similarity, image preprocessing |
| Multi-Agent workflows | Graph-based orchestration, state management, async programming |
| Monitoring Dashboard | Metrics collection, time-series visualization, SSE implementation |
| Live Logs Terminal | Structured logging, WebSocket broadcasting, log aggregation |
| API Explorer | API design, documentation generation, developer experience |
| Rate Limiting + Auth | Security engineering, middleware design, distributed systems |
| Vector Search Demo | Embedding models, ANN indexing, hybrid retrieval |

---

## 15. Senior-Level Differentiators

This section captures the decisions and implementations that distinguish a **senior engineer's** portfolio from a **junior or mid-level** one. These are not features per se, but qualities embedded throughout the system.

### 15.1 Architectural Differentiators

| Quality | How It's Demonstrated |
|---------|----------------------|
| **Observability by design** | Metrics, logs, and traces are not afterthoughts; they are core requirements with dedicated modules |
| **Security depth** | Rate limiting, prompt injection defense, JWT best practices, audit trails — not just "auth is enabled" |
| **Cost awareness** | Token economics visible to users; model tiering based on cost; hard caps to prevent overrun |
| **Scalability thinking** | Stateless API design, worker queues, connection pooling, horizontal scaling strategy documented |
| **Failover and degradation** | Graceful handling of Redis outages, LLM rate limits, and model unavailability |

### 15.2 Code Quality Differentiators

| Quality | How It's Demonstrated |
|---------|----------------------|
| **Type safety** | Pydantic models for all API contracts; TypeScript strict mode for frontend |
| **Structured logging** | JSON logs with trace IDs, not `print()` statements |
| **Test coverage** | Unit tests for business logic (> 70% coverage); integration tests for API contracts |
| **Documentation** | Every module has a spec document; every endpoint has a docstring; architecture decisions are recorded |
| **Error handling** | Custom exception hierarchy; consistent error response shapes; no unhandled 500s |

### 15.3 Product Thinking Differentiators

| Quality | How It's Demonstrated |
|---------|----------------------|
| **Onboarding optimization** | Guest tier with zero friction; progressive disclosure for advanced features |
| **Performance budgets** | Explicit latency targets for every user-facing operation |
| **Accessibility** | Keyboard navigation, screen reader support, sufficient color contrast even in dark mode |
| **Mobile consideration** | Responsive design for all interactive features; simplified visualizations on small screens |
| **Non-goal discipline** | Clear articulation of what is out of scope and why; prevents feature creep |

---

*This document is a living artifact. When module requirements change during implementation, update both the module-specific document and this consolidated FRD to maintain consistency.*
