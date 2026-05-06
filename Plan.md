# Project Plan

> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Execution Model:** 1 person + AI Assistant Code  
> **Strategy:** Backend first, then frontend  
> **Estimated Duration:** 10-14 weeks

## 1. Plan Summary

This plan is optimized for a solo developer working with AI assistance. The goal is to reduce rework by building the backend foundation first, then implementing the frontend against stable API contracts.

### Why Backend First
- The backend defines the real product behavior: auth, rate limiting, AI flows, metrics, logs, and data contracts.
- The frontend becomes much faster once API shapes, error responses, and streaming behavior are stable.
- Realtime features such as SSE, WebSocket, and queue-driven jobs are easier to validate from the backend outward.
- AI Assistant Code can accelerate repetitive backend scaffolding, tests, and documentation updates.

## 2. Working Principles

- Build the smallest working slice first, then expand.
- Keep each phase demoable.
- Do not move to frontend polish before backend contracts are stable.
- Use AI Assistant Code for boilerplate, refactors, documentation drafts, and test scaffolding.
- Prefer integration-ready APIs over speculative UI work.
- Update docs immediately when implementation decisions change.

## 3. Timeline

### Phase 0: Setup and Scope Lockdown — Week 1
**Goal:** Establish the implementation base and reduce ambiguity.

**Tasks:**
- Confirm the final module order and priority.
- Create the repo structure for backend and frontend work.
- Define environment variables, local dev assumptions, and deployment targets.
- Draft API contract stubs for auth, health, metrics, logs, chat, and vision.
- Set up linting, formatting, and test conventions.

**Deliverables:**
- Project skeleton ready for implementation.
- Stable development conventions.
- Initial backend API contract map.

### Phase 1: Backend Foundation — Weeks 2-3
**Goal:** Make the backend runnable before any serious frontend work.

**Tasks:**
- Implement FastAPI app structure.
- Add configuration, dependency injection, and environment handling.
- Add health check endpoint.
- Set up database, Redis, and storage clients.
- Implement structured logging base.
- Prepare middleware for request IDs, CORS, and error handling.

**Deliverables:**
- Backend boots locally.
- Health endpoint works.
- Core infrastructure clients are wired.
- Logging and error handling baseline exists.

### Phase 2: Security and Identity — Weeks 4-5
**Goal:** Lock down access and quota behavior before feature work expands.

**Tasks:**
- Implement guest identity generation.
- Implement GitHub OAuth login flow.
- Add JWT session handling.
- Add role-based access control.
- Add Redis sliding-window rate limiting.
- Add response headers for quota visibility.
- Add auth tests and abuse-path tests.

**Deliverables:**
- Guest and logged-in flows work.
- Rate limiting is enforced.
- Protected routes are gated correctly.
- Auth contract is stable for frontend use.

### Phase 3: Core Backend AI Services — Weeks 6-7
**Goal:** Build the main AI capabilities on top of the secure foundation.

**Tasks:**
- Implement chatbot endpoints and streaming behavior.
- Implement document ingestion and embedding flow.
- Implement vector search and retrieval pipeline.
- Implement face recognition upload, detection, matching, and status flow.
- Implement queue jobs for longer-running tasks.
- Add service-level tests for API contracts.

**Deliverables:**
- Chat, vector search, and vision APIs are available.
- Streaming and async jobs work end to end.
- Core AI contracts are ready for frontend integration.

### Phase 4: Observability and Realtime Infrastructure — Weeks 8-9
**Goal:** Make the system visibly alive and measurable.

**Tasks:**
- Add metrics collection middleware.
- Add SSE metrics stream.
- Add monitoring summary and health aggregation.
- Add structured log tagging and broadcast stream.
- Add live logs WebSocket channel.
- Add API explorer support from the backend schema.
- Add queue depth and error-rate visibility.

**Deliverables:**
- Metrics dashboard data is available.
- Live logs stream works.
- API explorer can test real endpoints.
- Realtime infrastructure is validated.

### Phase 5: Frontend Shell and Core UX — Weeks 10-11
**Goal:** Build the frontend on top of the already-stable backend contract.

**Tasks:**
- Build the Astro shell and layout system.
- Add auth UI and quota indicator.
- Build chatbot UI with streaming responses.
- Build vision playground UI.
- Build metrics dashboard UI.
- Build live logs terminal UI.
- Build API explorer page.

**Deliverables:**
- Core pages are navigable.
- Main user journeys are usable.
- UI reflects real backend data.

### Phase 6: Advanced UI, Polish, and Hardening — Weeks 12-14
**Goal:** Improve trust, clarity, performance, and demo quality.

**Tasks:**
- Build AI Playground and multi-agent workflow UI.
- Build admin views if time remains.
- Polish empty states, loading states, and error handling.
- Improve accessibility and responsive behavior.
- Run performance checks and fix bottlenecks.
- Update documentation and remove stale references.

**Deliverables:**
- Showcase quality improves substantially.
- Critical flows are polished and stable.
- Documentation matches implementation reality.

## 4. Recommended Build Order

1. Backend foundation
2. Auth and rate limiting
3. Core AI services
4. Observability and realtime systems
5. Frontend shell
6. Feature pages
7. Polishing and hardening

## 5. Weekly Execution Pattern

For a solo developer with AI assistance, a realistic weekly rhythm is:

- 2 days: design and backend implementation
- 1 day: tests, debugging, and contract verification
- 1 day: frontend integration or UI slice
- 1 day: documentation update and cleanup

This rhythm assumes the AI assistant is used for scaffolding, repetitive code, test generation, and documentation drafts, while the human focus remains on design decisions and integration quality.

## 6. Milestones

### Milestone A: Infrastructure Ready
- Backend boots locally.
- Auth and rate limiting work.
- Database and Redis are connected.

### Milestone B: Core AI Ready
- Chatbot, vector search, and face recognition work end to end.

### Milestone C: Live System Ready
- Metrics and logs stream in real time.
- API explorer can exercise the backend.

### Milestone D: Portfolio Showcase Ready
- Frontend is complete enough for a full demo.
- The app looks and behaves like a production system.

## 7. Risks and Controls

### Risk: Frontend is started too early
**Control:** Do not begin frontend polish until backend contracts are stable.

### Risk: Scope expansion
**Control:** Keep advanced features behind later phases unless they support the core showcase.

### Risk: Rework from changing contracts
**Control:** Freeze API shapes per module before building UI pages.

### Risk: Solo developer overload
**Control:** Use AI assistant for boilerplate, docs, and tests; keep weekly scope small.

### Risk: Realtime complexity
**Control:** Validate SSE and WebSocket behavior from the backend first with simple clients.

## 8. Definition of Done

A phase is done when:
- The relevant endpoints or pages work locally.
- Tests cover the main contract or behavior.
- Documentation is updated.
- The result can be demonstrated without manual explanation.

## 9. Notes for Future Updates

- If the implementation starts, this plan should be revised to reflect actual velocity.
- If a module becomes more complex than expected, split it into smaller phases.
- If backend dependencies shift, update the order before moving to frontend work.
