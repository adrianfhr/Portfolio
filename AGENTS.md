# AGENTS.md — Interactive AI Engineering Portfolio & Sandbox

> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Version:** 2.0  
> **Owner:** Adrian Fahri Affandi  
> **Role:** Senior Fullstack AI / Systems Engineer  
> **Language:** English for all new or revised documentation

## 1. Project Overview

This repository is a **documentation-first workspace** for an Interactive AI Engineering Portfolio & Sandbox. It is designed as a production-grade showcase rather than a static portfolio. The goal is to demonstrate engineering maturity across AI systems, fullstack design, observability, and operational thinking.

Visitors should be able to understand the platform through the documentation alone: live AI experiences, transparent metrics, backend logs, and clear architecture decisions.

### Core Philosophy
- **Show, Don't Tell:** use real system behavior and verifiable documentation.
- **Production Transparency:** surface latency, cost, logs, and health where relevant.
- **Frictionless Onboarding:** preserve guest access for low-friction demos.

### Target Audience
1. **CTO / VP of Engineering** - evaluates architecture, scalability, observability, and operational maturity.
2. **Technical Recruiter** - validates technical depth through interactive demos and clear requirements.
3. **Startup Founder / B2B Client** - assesses whether the work translates into a useful product.
4. **Peer Engineer** - reviews implementation patterns, trade-offs, and documentation quality.

## 2. Current Repository State

- The repository is still **documentation-only**; there is no application source code yet.
- The documentation migration to the new folder structure is **complete**.
- The legacy flat documents in `docs/` root have been removed after migration.
- `docs/README.md` is the active documentation hub.
- `docs/CONTINUATION_CONTEXT.md` remains as a historical handoff file.

## 3. Active Documentation Structure

Use this structure as the source of truth for future documentation work.

### 3.1 Product Definition
- `docs/01-Product-Definition/pvd.md`
- `docs/01-Product-Definition/frd.md`
- `docs/01-Product-Definition/product-goals.md`
- `docs/01-Product-Definition/user-personas.md`
- `docs/01-Product-Definition/positioning.md`
- `docs/01-Product-Definition/success-metrics.md`

### 3.2 Architecture Design
- `docs/02-Architecture-Design/system-architecture.md`
- `docs/02-Architecture-Design/frontend-architecture.md`
- `docs/02-Architecture-Design/backend-architecture.md`
- `docs/02-Architecture-Design/ai-architecture.md`
- `docs/02-Architecture-Design/event-flow.md`
- `docs/02-Architecture-Design/websocket-architecture.md`
- `docs/02-Architecture-Design/deployment-architecture.md`
- `docs/02-Architecture-Design/infrastructure-topology.md`

### 3.3 Core AI Modules
- `docs/03-Core-AI-Modules/Authentication/`
- `docs/03-Core-AI-Modules/RAG-Chatbot/`
- `docs/03-Core-AI-Modules/Face-Recognition/`
- `docs/03-Core-AI-Modules/AI-Playground/`
- `docs/03-Core-AI-Modules/Multi-Agent-System/`
- `docs/03-Core-AI-Modules/Observability/`
- `docs/03-Core-AI-Modules/Live-Logs/`
- `docs/03-Core-AI-Modules/API-Explorer/`

### 3.4 Real-Time Infrastructure
- `docs/04-Real-Time-Infrastructure/websocket-events.md`
- `docs/04-Real-Time-Infrastructure/streaming-strategy.md`
- `docs/04-Real-Time-Infrastructure/queue-architecture.md`
- `docs/04-Real-Time-Infrastructure/caching-strategy.md`
- `docs/04-Real-Time-Infrastructure/scaling-strategy.md`
- `docs/04-Real-Time-Infrastructure/failover-strategy.md`

### 3.5 Security and Observability
- `docs/05-Security-Observability/auth-strategy.md`
- `docs/05-Security-Observability/rate-limiting.md`
- `docs/05-Security-Observability/abuse-prevention.md`
- `docs/05-Security-Observability/monitoring.md`
- `docs/05-Security-Observability/logging-pipeline.md`
- `docs/05-Security-Observability/metrics.md`
- `docs/05-Security-Observability/incident-handling.md`

### 3.6 Project Management
- `docs/06-Project-Management/roadmap.md`
- `docs/06-Project-Management/milestones.md`
- `docs/06-Project-Management/backlog.md`
- `docs/06-Project-Management/release-plan.md`
- `docs/06-Project-Management/sprint-plan.md`
- `docs/06-Project-Management/technical-debt.md`

### 3.7 Appendix
- `docs/07-Appendix/glossary.md`
- `docs/07-Appendix/api-reference.md`
- `docs/07-Appendix/prompt-library.md`
- `docs/07-Appendix/sequence-diagrams.md`
- `docs/07-Appendix/architecture-decisions.md`
- `docs/07-Appendix/references.md`

### 3.8 Design System
- `docs/Design-System/foundations/`
- `docs/Design-System/components/`
- `docs/Design-System/patterns/`
- `docs/Design-System/branding/`

## 4. Planned Technology Stack

These technologies are the current planning baseline. Update them only when architectural decisions change.

### Frontend
| Layer | Technology | Purpose |
|---|---|---|
| Framework | Astro | SSR, island architecture, API proxy routes |
| UI | React 18 | Component architecture |
| Styling | Tailwind CSS | Utility-first styling |
| State | Zustand | Global state for auth and metrics |
| Data Fetching | React Query (TanStack Query) | Server state, caching, polling |
| Charts | Recharts | Metrics visualization |
| Animation | Framer Motion | Micro-interactions and page transitions |
| Real-time | Socket.IO Client | WebSocket connections |
| Markdown | ReactMarkdown + DOMPurify + Prism | Chat message rendering |

### Backend
| Layer | Technology | Purpose |
|---|---|---|
| API Gateway | FastAPI | Async API layer and OpenAPI generation |
| Worker Queue | Celery + Redis | Background tasks and async inference |
| Cache | Redis | Rate limiting, session store, metric buffer |
| Database | PostgreSQL | Relational persistence |
| Vector DB | Qdrant | Semantic search and embeddings |
| Object Storage | MinIO / S3 | File uploads and artifacts |
| Real-time | WebSocket | Streaming, live logs, metrics |
| Observability | Prometheus + Loki + OpenTelemetry | Metrics, logs, tracing |

### AI / ML
| Component | Technology | Purpose |
|---|---|---|
| LLM | OpenAI API | Text generation |
| Embeddings | OpenAI embeddings / SentenceTransformer | Vector generation |
| Retrieval | Qdrant + BM25 | Semantic + keyword retrieval |
| Reranker | Cross-encoder / Cohere | Re-ranking retrieved chunks |
| Agent Orchestration | LangGraph | Multi-agent workflow graph |
| Face Recognition | InsightFace + ONNX Runtime | Face detection and embedding |
| Image Processing | OpenCV | Preprocessing and validation |

## 5. Documentation Standards

### Language and Style
- Write all new or revised documentation in English.
- Keep the tone concise, technical, and direct.
- Avoid vague product language and unsupported claims.

### Required Structure
#### PRD files
Use a structure that includes, at minimum:
1. Objective
2. User Stories
3. Functional Requirements
4. Non-Functional Requirements
5. UI/UX Requirements
6. API & Data Contract
7. Acceptance Criteria
8. Edge Cases
9. Security Requirements
10. Dependencies
11. Cross-References

#### Design-System files
Use a structure that includes, at minimum:
1. Overview
2. Anatomy / Structure
3. Variants / Types
4. States
5. Behavior & Interactions
6. Animation & Motion
7. Accessibility
8. Usage Guidelines
9. Examples

### Symbol Convention
| Symbol | Meaning |
|---|---|
| 🎯 | Objective / Goal |
| 👤 | User Story |
| ⚙️ | Functional Requirement |
| 🎨 | UI/UX Requirement |
| 🔌 | API Contract |
| ✅ | Acceptance Criteria |
| ⚠️ | Edge Case |
| 🔒 | Security Concern |
| 📊 | Metric / KPI |

### Cross-Reference Rules
- Prefer relative links inside `docs/`.
- Link to the new folder structure, not the deleted legacy flat files.
- Update cross-references whenever a document is moved or renamed.

## 6. Working Rules for Future Agents

### Before Editing
1. Read the relevant local document first.
2. Use the nearest authoritative source, not a broad search.
3. Confirm the current file state before making edits if there is any sign of concurrent changes.

### While Editing
1. Keep changes focused and minimal.
2. Preserve the existing writing style of the document family you are editing.
3. Do not introduce unrelated scope.
4. Update related cross-references when a document path changes.

### After Editing
1. Validate the touched folder or file set.
2. Fix any new errors that are directly related to the change.
3. If documentation behavior changed, update the hub or the relevant parent doc.

### Cleanup Policy
- Do not recreate the legacy root documents unless explicitly requested.
- Treat `docs/README.md` as the canonical index.
- Keep `docs/CONTINUATION_CONTEXT.md` only if it remains useful as project history.

## 7. Key Files to Reference

| Purpose | File |
|---|---|
| Documentation hub | `docs/README.md` |
| Product vision | `docs/01-Product-Definition/pvd.md` |
| Feature requirements | `docs/01-Product-Definition/frd.md` |
| Architecture blueprint | `docs/02-Architecture-Design/system-architecture.md` |
| Security standards | `docs/05-Security-Observability/` |
| Roadmap | `docs/06-Project-Management/roadmap.md` |
| Appendix reference | `docs/07-Appendix/glossary.md` |

## 8. Current Project Guidance

- The repo is still documentation-only.
- The active work now focuses on documentation quality, consistency, and eventual implementation readiness.
- When implementation begins, update these instructions to reflect the actual codebase structure and operational workflow.

*This file is a living instruction set. Update it when the documentation structure, project status, or architectural direction changes.*
