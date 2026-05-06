# Backend Architecture

> **Document:** Backend Architecture  
> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Version:** 1.0  
> **Status:** Draft  

---

## 1. Executive Summary

The backend of the Interactive AI Engineering Portfolio & Sandbox is built as a **high-performance, asynchronous API gateway** using FastAPI. It serves as the central nervous system of the platform, orchestrating AI inference pipelines, managing authentication and authorization, enforcing rate limits, streaming real-time data, and persisting structured logs and metrics.

The backend is architected as a **modular monolith**: internally decomposed into discrete routers, services, and data access layers, but deployed as a single unit. This approach maximizes development velocity for a solo-engineer portfolio while demonstrating production-grade separation of concerns and testability.

---

## 2. Technology Stack

### 2.1 Core Runtime & Framework

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Web Framework | FastAPI | 0.110+ | Async HTTP API, dependency injection, auto OpenAPI, WebSocket & SSE support |
| ASGI Server | Uvicorn | 0.29+ | High-performance async server with HTTP/1.1 and HTTP/2 support |
| Language | Python | 3.11+ | Type hints, `async`/`await`, `pydantic` v2 integration |
| Process Management | Gunicorn + Uvicorn Workers | 21+ | Multi-worker process spawning for CPU-bound parallelism |

### 2.2 Data & Caching

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Relational Database | PostgreSQL 15+ | Users, sessions, audit logs, workflow definitions, conversation metadata |
| Vector Database | Qdrant 1.7+ | Semantic search, document embeddings, face embedding storage |
| Cache & Queue | Redis 7+ | Rate limiting counters, session cache, Celery broker, real-time metrics buffers |
| Object Storage | MinIO (local) / AWS S3 (cloud) | Image uploads, model artifacts, exported data |
| ORM | SQLAlchemy 2.0+ | Type-safe database access with async support (`AsyncSession`) |
| Migrations | Alembic | Schema versioning and automated migration generation |

### 2.3 Background Processing

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Task Queue | Celery 5.3+ | Background AI inference, embedding generation, batch processing |
| Broker | Redis | Celery task routing and result storage |
| Result Backend | Redis | Task status polling and result retrieval |
| Monitoring | Flower (optional) | Real-time Celery worker monitoring UI |

### 2.4 AI / ML Integration

| Layer | Technology | Purpose |
|-------|-----------|---------|
| LLM SDK | OpenAI Python SDK | Chat completion, embeddings, structured output |
| Agent Framework | LangGraph + LangChain | Multi-agent workflow orchestration |
| Face Recognition | InsightFace + ONNX Runtime | Face detection and 512-dimensional embedding extraction |
| Image Processing | OpenCV (Python) | Preprocessing, resizing, format validation |
| Prompt Templating | Jinja2 | Versioned, parameterized prompt templates |

### 2.5 Observability

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Metrics | Prometheus Client + Custom Aggregator | Counter, histogram, and gauge exposition for scraping |
| Logging | Python `structlog` | Structured JSON logging with `trace_id` propagation |
| Tracing | OpenTelemetry (optional) | Distributed tracing across API → Celery → External AI APIs |

### 2.6 Development Tooling

| Tool | Purpose |
|------|---------|
| `pytest` + `pytest-asyncio` | Async-aware unit and integration testing |
| `httpx` | Async HTTP client for testing and internal service calls |
| `black` + `isort` | Code formatting and import sorting |
| `mypy` | Static type checking with strict mode |
| `pre-commit` | Git hooks for linting and formatting before commits |

---

## 3. Folder Structure

```
apps/api/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application factory, lifespan events, middleware mount
│   ├── config.py               # Pydantic Settings, env var validation, feature flags
│   ├── dependencies.py         # Shared FastAPI dependencies (DB session, current_user, rate_limiter)
│   └── lifespan.py             # Startup/shutdown events (DB connection pool, Redis check, Qdrant init)
│
├── routers/                    # API route modules (one per domain)
│   ├── __init__.py
│   ├── auth.py                 # Guest ID generation, GitHub OAuth callback, JWT issuance
│   ├── chat.py                 # RAG chat endpoints: POST /chat, GET /chat/{id}/stream (SSE)
│   ├── vision.py               # Face detection: POST /vision/detect, POST /vision/match
│   ├── vector.py               # Vector search demo: POST /vector/search, POST /vector/ingest
│   ├── agents.py               # Multi-agent: POST /agents/run, WS /agents/ws/{run_id}
│   ├── metrics.py              # Metrics: GET /metrics/snapshot, GET /metrics/stream (SSE)
│   ├── logs.py                 # Logs: WS /logs/stream, GET /logs/export
│   ├── health.py               # Health checks: GET /health, GET /health/ready, GET /health/live
│   └── api_docs.py             # Custom OpenAPI metadata and documentation enhancements
│
├── services/                   # Business logic layer (orchestration, not data access)
│   ├── __init__.py
│   ├── chat_service.py         # RAG pipeline orchestration: retrieve → rerank → generate → stream
│   ├── vision_service.py       # Face detection pipeline: preprocess → ONNX inference → postprocess
│   ├── agent_service.py        # LangGraph workflow execution and state management
│   ├── vector_service.py       # Embedding generation, Qdrant indexing, hybrid search
│   ├── metrics_service.py      # Prometheus metrics aggregation, custom metric computation
│   └── log_service.py          # Structured log querying, log broadcast filtering
│
├── models/                     # SQLAlchemy ORM models
│   ├── __init__.py
│   ├── base.py                 # Declarative base, audit mixin (created_at, updated_at)
│   ├── user.py                 # User model (OAuth profiles, roles)
│   ├── session.py              # Session model (JWT token metadata, expiry)
│   ├── chat_message.py         # Chat message model (role, content, tokens_used, cost)
│   ├── api_log.py              # API request audit log (method, path, status, latency, user_id)
│   ├── workflow.py             # Workflow definition model (agent graph snapshots)
│   └── face_embedding.py       # Face metadata (user_id, embedding_reference, image_url)
│
├── schemas/                    # Pydantic v2 models (request/response validation, OpenAPI docs)
│   ├── __init__.py
│   ├── auth.py                 # GuestCreate, TokenResponse, UserRead
│   ├── chat.py                 # ChatRequest, ChatResponse, ChatMessage, SourceChunk
│   ├── vision.py               # DetectRequest, DetectResponse, MatchResult
│   ├── agent.py                # AgentRunRequest, AgentStatus, AgentNodeState
│   ├── vector.py               # SearchRequest, SearchResult, IngestRequest
│   ├── metrics.py              # MetricsSnapshot, LatencyHistogram, TokenCostGauge
│   └── common.py               # ErrorResponse, PaginatedResponse, HTTPErrorDetail
│
├── core/                       # Core infrastructure and cross-cutting concerns
│   ├── __init__.py
│   ├── security.py             # Password hashing (if applicable), JWT encode/decode, HMAC signing
│   ├── rate_limiter.py         # Redis sliding-window rate limit implementation
│   ├── logger.py               # structlog configuration, trace_id injection, sensitive field redaction
│   ├── exceptions.py           # Custom exception hierarchy (AppException, ValidationError, AuthError)
│   └── middleware.py           # Custom Starlette middleware (logging, rate limiting, CORS)
│
├── infra/                      # External integration clients (singletons, connection pooling)
│   ├── __init__.py
│   ├── db.py                   # SQLAlchemy async engine, session factory, connection pool settings
│   ├── redis_client.py         # Redis connection pool (aioredis), key pattern constants
│   ├── qdrant_client.py        # Qdrant async client, collection initialization, index config
│   ├── openai_client.py        # OpenAI async client wrapper with retry logic and timeout handling
│   ├── s3_client.py            # MinIO / S3 boto3 client wrapper with presigned URL generation
│   └── celery_app.py           # Celery app factory, task routing config, broker connection
│
├── workers/                    # Celery background task definitions
│   ├── __init__.py
│   ├── inference_tasks.py      # LLM completion tasks, embedding generation tasks
│   ├── vision_tasks.py         # Face detection tasks, batch image processing
│   └── agent_tasks.py          # LangGraph workflow execution tasks
│
├── prompts/                    # Jinja2 prompt templates (versioned, parameterized)
│   ├── chat/                   # RAG system prompts, context assembly templates
│   ├── agents/                 # Agent system prompts, tool description templates
│   └── vision/                 # Vision model prompts (if multimodal LLM used)
│
├── tests/                      # Test suite
│   ├── conftest.py             # pytest fixtures (test DB, test Redis, test client)
│   ├── unit/                   # Unit tests for services, utilities, schemas
│   ├── integration/            # Integration tests for routers with TestClient
│   └── e2e/                    # End-to-end tests (optional, reserved for future)
│
├── alembic/                    # Database migration files
│   ├── versions/               # Generated migration scripts
│   └── env.py                  # Alembic environment configuration
│
├── Dockerfile                  # Multi-stage build: builder → runtime
├── pyproject.toml              # Poetry / pip dependencies, tool configs (black, mypy, pytest)
└── requirements.txt            # Frozen dependencies for Docker build reproducibility
```

---

## 4. Middleware Stack

The FastAPI middleware stack is executed in the following order for every incoming request. Each layer is implemented as either native FastAPI/Starlette middleware or a dependency-injected function.

### 4.1 Execution Order

```
Request
  ↓
[1] TrustedHostMiddleware       → Validate Host header against ALLOWED_HOSTS
  ↓
[2] CORSMiddleware              → Apply CORS headers, preflight handling
  ↓
[3] LoggingMiddleware            → Assign trace_id, log request start (method, path, client_ip)
  ↓
[4] RateLimitMiddleware          → Check Redis counter; 429 if exceeded
  ↓
[5] AuthMiddleware (dependency)  → Extract JWT from cookie/header; inject current_user
  ↓
[6] CSRFMiddleware (selective)   → Validate CSRF token for state-changing methods
  ↓
[7] ExceptionHandlerMiddleware   → Catch unhandled exceptions; format standardized error response
  ↓
Router → Endpoint Handler
  ↓
Response
```

### 4.2 Middleware Details

| Middleware | Type | Responsibility |
|-----------|------|---------------|
| **TrustedHost** | Starlette | Prevents HTTP Host header attacks by validating against an allowlist. |
| **CORS** | Starlette | Configurable allowed origins, methods, headers. Credentials enabled for cookie-based auth. |
| **Logging** | Custom | Generates `trace_id` (UUID v4) per request; logs structured JSON with timing data. |
| **Rate Limiting** | Custom | Sliding-window counter in Redis; tiered limits (Guest: 20/24h, Developer: 200/24h, Admin: unlimited). |
| **Auth** | Dependency | Stateless JWT validation (HS256); fallback to guest HMAC-signed ID. |
| **CSRF** | Custom | Double-submit cookie pattern for non-GET, non-HEAD, non-OPTIONS requests. |
| **Exception Handler** | Custom | Catches `AppException`, `ValidationError`, `HTTPException`; returns `{error: {code, message, details}}`. |

---

## 5. Request Lifecycle

A complete HTTP request lifecycle through the backend is described below, using a chat message POST as the canonical example.

```
1. CLIENT REQUEST
   POST /api/chat
   Headers: Cookie: access_token=eyJ...; Content-Type: application/json
   Body: { "message": "Explain the architecture", "session_id": "sess_abc123" }

2. GATEWAY LAYER
   ├─ Uvicorn receives the HTTP/1.1 request
   ├─ TrustedHostMiddleware validates Host header
   ├─ CORSMiddleware attaches Access-Control-Allow-Origin
   ├─ LoggingMiddleware generates trace_id: "t-uuid-789"
   ├─ RateLimitMiddleware checks Redis key "rate_limit:user_42"
   ├─ Auth dependency extracts JWT, validates signature & expiry
   │  └─ Injects current_user: { user_id: 42, role: "developer", tier: "developer" }
   └─ Pydantic parses body into ChatRequest schema

3. ROUTER LAYER (routers/chat.py)
   ├─ Endpoint handler receives ChatRequest + current_user dependency
   ├─ Calls chat_service.process_message(request, user_id=42)
   └─ Returns StreamingResponse (SSE) for token stream

4. SERVICE LAYER (services/chat_service.py)
   ├─ Retrieve conversation history from PostgreSQL
   ├─ Generate embedding for user query (OpenAI API or local model)
   ├─ Query Qdrant for top-k similar document chunks
   ├─ Optional: Rerank retrieved chunks with cross-encoder
   ├─ Assemble context window using Jinja2 prompt template
   ├─ Stream LLM completion via OpenAI API (async generator)
   ├─ Yield tokens via SSE format
   └─ On completion: log api_log row, update metrics, persist assistant message

5. RESPONSE LAYER
   ├─ StreamingResponse sends "data: {token}\n\n" chunks
   ├─ LoggingMiddleware logs response status (200), duration (1.2s)
   └─ Connection closes after final "data: [DONE]\n\n"

6. POST-RESPONSE (background)
   ├─ Token usage and cost calculated
   ├─ Prometheus counters incremented: api_requests_total, openai_tokens_total
   ├─ Chat message persisted to PostgreSQL (if not already streamed)
   └─ Redis session TTL refreshed
```

---

## 6. Dependency Injection Pattern

FastAPI's native dependency injection system is used extensively to promote testability, reusability, and clean separation of concerns.

### 6.1 Dependency Categories

| Category | Examples | Scope |
|----------|----------|-------|
| **Resource Dependencies** | `get_db_session`, `get_redis`, `get_qdrant_client` | Request-scoped (created per request, cleaned up after) |
| **Security Dependencies** | `get_current_user`, `require_admin`, `get_rate_limit_status` | Request-scoped (extract from request headers/cookies) |
| **Service Dependencies** | `get_chat_service`, `get_vision_service` | Request-scoped (injected with resource dependencies) |
| **Config Dependencies** | `get_settings` | Singleton (cached application settings) |

### 6.2 Example: Chat Endpoint Dependencies

```python
# dependencies.py
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession
from infra.db import async_session_factory
from core.security import verify_jwt_token

async def get_db() -> AsyncSession:
    async with async_session_factory() as session:
        yield session

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    payload = verify_jwt_token(token)
    return User(id=payload["sub"], role=payload["role"])

# routers/chat.py
from fastapi import APIRouter, Depends
from schemas.chat import ChatRequest
from services.chat_service import ChatService

router = APIRouter(prefix="/chat", tags=["Chatbot"])

@router.post("/", response_model=ChatResponse)
async def create_chat_message(
    request: ChatRequest,
    db: AsyncSession = Depends(get_db),
    user: User = Depends(get_current_user),
    chat_service: ChatService = Depends(ChatService),
):
    return await chat_service.process(request, user=user, db=db)
```

### 6.3 Testing with Dependencies

- `pytest` fixtures override production dependencies with test doubles (in-memory SQLite via `aiosqlite`, fake Redis via `fakeredis`, mock OpenAI client).
- `app.dependency_overrides` is used in integration tests to inject test-specific dependencies without modifying router code.

---

## 7. Error Handling Strategy

### 7.1 Exception Hierarchy

```
AppException (base)
├── ValidationError          → 400 Bad Request (Pydantic validation failures)
├── AuthException
│   ├── InvalidCredentials   → 401 Unauthorized
│   ├── TokenExpired         → 401 Unauthorized
│   └── PermissionDenied     → 403 Forbidden
├── RateLimitExceeded        → 429 Too Many Requests
├── NotFoundException        → 404 Not Found
├── ConflictException        → 409 Conflict
├── AIServiceException
│   ├── LLMTimeout           → 504 Gateway Timeout
│   ├── LLMRateLimit         → 429 (propagated from OpenAI)
│   └── InferenceError       → 502 Bad Gateway
└── InternalServerError      → 500 Internal Server Error
```

### 7.2 Error Response Format

All errors follow a consistent JSON schema:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Guest tier limit of 20 requests per 24 hours exceeded.",
    "details": {
      "limit": 20,
      "window": "24h",
      "retry_after": 3600
    },
    "trace_id": "t-uuid-789"
  }
}
```

### 7.3 Global Exception Handler

```python
# core/exceptions.py + app/main.py
from fastapi import Request
from fastapi.responses import JSONResponse

@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    logger.error("Application error", exc_info=exc, trace_id=get_trace_id())
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.code,
                "message": exc.message,
                "details": exc.details,
                "trace_id": get_trace_id(),
            }
        },
    )
```

### 7.4 Sensitive Data Handling

- The `logger.py` module implements a **redaction filter** that automatically replaces values for keys matching `password`, `token`, `api_key`, `secret`, `authorization` with `"[REDACTED]"`.
- Exception detail messages never include raw database errors, stack traces, or internal file paths in production builds.

---

## 8. Background Job Architecture (Celery)

### 8.1 Task Categories

| Category | Examples | Execution Model |
|----------|----------|----------------|
| **AI Inference** | LLM completion, embedding generation, face detection | Async, queue-based, retryable |
| **Data Processing** | Document chunking, image preprocessing, batch ingestion | Async, queue-based, idempotent |
| **Maintenance** | Old session cleanup, temp file deletion, metrics aggregation | Scheduled (celery beat), periodic |

### 8.2 Task Flow

```
FastAPI Endpoint
    ↓
Celery Task Invocation (apply_async / delay)
    ↓
Redis Broker (LPUSH task message)
    ↓
Celery Worker (BRPOP + execution)
    ↓
Task Execution
    ├─ Success → Store result in Redis backend → Optionally notify via WebSocket
    ├─ Failure → Retry with exponential backoff (max 3) → Dead letter queue if persistent
    └─ Timeout → Revoke task, log error, return timeout to client
```

### 8.3 Worker Configuration

```python
# infra/celery_app.py
from celery import Celery

celery_app = Celery(
    "portfolio",
    broker="redis://redis:6379/0",
    backend="redis://redis:6379/1",
    include=["workers.inference_tasks", "workers.vision_tasks"],
)

celery_app.conf.update(
    task_serializer="json",
    accept_content=["json"],
    result_serializer="json",
    timezone="UTC",
    enable_utc=True,
    task_track_started=True,
    task_time_limit=300,          # Hard limit: 5 minutes
    task_soft_time_limit=240,     # Soft limit: 4 minutes (raises SoftTimeLimitExceeded)
    worker_prefetch_multiplier=1, # Fair task distribution among workers
    result_expires=3600,          # Results expire after 1 hour
)
```

### 8.4 Task Definition Example

```python
# workers/inference_tasks.py
from infra.celery_app import celery_app
from infra.openai_client import openai_client

@celery_app.task(bind=True, max_retries=3, default_retry_delay=10)
def generate_embedding(self, text: str, doc_id: str):
    try:
        response = openai_client.embeddings.create(
            model="text-embedding-3-small",
            input=text,
        )
        embedding = response.data[0].embedding
        # Store in Qdrant...
        return {"doc_id": doc_id, "status": "success"}
    except openai.RateLimitError as exc:
        raise self.retry(exc=exc, countdown=60)
    except Exception as exc:
        raise self.retry(exc=exc, countdown=10)
```

### 8.5 Monitoring Background Jobs

- Task status is queryable via the Redis result backend using the task ID.
- The `/api/tasks/{task_id}` endpoint exposes task progress for long-running operations (face recognition batch processing, agent workflow execution).
- Flower (optional) provides a web UI for worker monitoring at `/flower/` (admin-only access).

---

## 9. API Versioning Strategy

### 9.1 Versioning Approach

The API uses **URL path versioning** (`/api/v1/...`) to ensure backward compatibility as the platform evolves. This is the most explicit and cache-friendly versioning strategy.

| Version | Status | Description |
|---------|--------|-------------|
| `v1` | Current | Initial stable API. All current features. |
| `v2` | Reserved | Future breaking changes (e.g., redesigned chat protocol). |

### 9.2 Implementation

```python
# routers/__init__.py
from fastapi import APIRouter
from routers import auth, chat, vision, agents, metrics, logs, health

api_router = APIRouter(prefix="/api/v1")

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(chat.router, prefix="/chat", tags=["Chatbot"])
api_router.include_router(vision.router, prefix="/vision", tags=["Vision"])
# ... etc

# app/main.py
from routers import api_router
app.include_router(api_router)
```

### 9.3 Deprecation Policy

- A minimum of **6 months** of support is guaranteed for any published API version.
- Deprecated endpoints include a `Deprecation: true` header and a `Sunset` header with the end-of-life date.
- Breaking changes are introduced only in new major versions; backward-compatible additions (new optional fields, new endpoints) are added to the current version.

### 9.4 Schema Evolution

- Pydantic schemas use `Optional` fields for additive changes to avoid breaking existing clients.
- Removed fields are marked with `Field(..., deprecated=True)` for one version cycle before removal.
- Enum values are only appended, never renamed or removed.

---

## 10. Database Access Patterns

### 10.1 Async SQLAlchemy Pattern

All database access is performed through `AsyncSession` to avoid blocking the event loop during I/O.

```python
# infra/db.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

engine = create_async_engine(
    "postgresql+asyncpg://user:pass@postgres/db",
    pool_size=20,
    max_overflow=10,
    pool_pre_ping=True,
    echo=False,
)

async_session_factory = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# Usage in router
@router.get("/users/me")
async def get_me(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == current_user.id))
    return result.scalar_one()
```

### 10.2 Connection Pooling

- `pool_size=20`: Maintains 20 persistent connections.
- `max_overflow=10`: Allows up to 10 additional connections under burst load.
- `pool_pre_ping=True`: Validates connections before use to prevent stale connection errors.

### 10.3 Transaction Boundaries

- Each HTTP request gets a dedicated `AsyncSession` that is committed on successful response or rolled back on exception.
- Background Celery tasks manage their own session lifecycle via context managers.
- Long-running agent workflows commit intermediate state checkpoints to PostgreSQL to enable resume after worker crashes.

---

## 11. Security Implementation

### 11.1 Authentication

| Method | Flow | Token Storage |
|--------|------|---------------|
| **Guest** | Server generates `guest_id` from IP + User-Agent hash, HMAC-signed | HttpOnly cookie (7 days) |
| **GitHub OAuth** | OAuth 2.0 PKCE flow with random `state` parameter | HttpOnly cookie (7 days) |
| **JWT** | HS256, payload: `{sub, role, iat, exp}` | HttpOnly cookie + Redis backup |

### 11.2 Authorization (RBAC)

| Role | Permissions |
|------|-------------|
| `guest` | Limited API quota (20 req/24h), read-only access to public features |
| `developer` | Standard API quota (200 req/24h), full access to AI modules |
| `admin` | Unlimited access, admin panel, log export, user management |

### 11.3 Input Sanitization

- All request bodies are validated by Pydantic v2 schemas before reaching business logic.
- File uploads are validated for MIME type, extension whitelist, and maximum size (10MB for images).
- Prompt inputs are scanned for injection keywords (`"ignore previous instructions"`, `"system prompt"`, `"you are now"`, `"DAN"`) before being sent to the LLM.

---

*Document maintained by the Backend Engineering Team. Last updated: 2026-05-06.*
