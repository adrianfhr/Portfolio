# CONTINUATION CONTEXT — Interactive AI Engineering Portfolio & Sandbox

> **Document Type:** Handoff & Execution Plan for Next AI Agent  
> **Version:** 1.0  
> **Date:** 2026-05-06  
> **Status:** Reorganization In Progress — ~45% Complete  
> **Language:** All new documentation must be written in **English**

---

## 1. PROJECT OVERVIEW

This is a **documentation-only repository** (no source code yet) for an Interactive AI Engineering Portfolio & Sandbox — a production-grade showcase platform where visitors interact with live AI systems (RAG chatbot, face recognition, multi-agent workflows) while observing real-time metrics, backend logs, and system architecture.

**Core Philosophy:**
- **Show, Don't Tell** — Visitors query AI systems directly instead of reading resume claims.
- **Production Transparency** — API latency, token costs, backend logs are visible to visitors.
- **Frictionless Onboarding** — Guest tier with limited API quota; no complex login for basic features.

**Positioning:** "I build production-grade AI systems, not just wrapper scripts."

**Target Audience:**
1. CTO / VP of Engineering — evaluates architecture, scalability, observability.
2. Technical Recruiter — verifies competence through interactive demos.
3. Startup Founder / B2B Client — assesses end-to-end AI product delivery.
4. Peer Engineer — studies implementation details and patterns.

---

## 2. WHAT HAS BEEN DONE

### 2.1 Legacy Documentation Inventory (00–17)
All original flat-structure documents (00 through 17) have been **read and analyzed**. Their content is being reorganized into the new folder structure. These legacy files still exist in `docs/` root and must be **deleted after** their content has been fully migrated.

| Legacy File | Content Summary |
|-------------|-----------------|
| `00-Plan-Pembuatan-Dokumen.md` | Document creation plan, dependency graph, development execution order, sprint breakdown, documentation principles |
| `01-Product-Overview.md` | Product vision, problem statement, positioning, core philosophies, value proposition, non-goals, KPIs, tone & brand voice |
| `02-User-Personas-Journey.md` | 4 personas (CTO, Recruiter, Founder, Peer Engineer), unified journey map (Hook → Playground → Reveal → Friction → Conversion) |
| `03-System-Architecture.md` | Full technical architecture: frontend stack (Astro, React, Tailwind, Zustand, React Query, Recharts, Framer Motion, Socket.IO), backend stack (FastAPI, Celery, Redis, PostgreSQL, Qdrant, MinIO, Prometheus, Loki, OpenTelemetry), AI architecture, database design, integration patterns, scalability |
| `04-Module-Face-Recognition.md` | Computer vision module: upload, detection, embedding, matching, attributes, async queue, metrics, UI spec, API contract, edge cases |
| `05-Module-LLM-Chatbot.md` | RAG chatbot: document ingestion, embedding, hybrid retrieval, reranking, SSE streaming, conversation memory, hallucination guardrail |
| `06-Module-Multi-Agent.md` | Multi-agent orchestration: Planner, Researcher, Writer, Reviewer, Formatter, task decomposition, async execution, state broadcast, simulated delay |
| `07-Module-AI-Playground.md` | AI sandbox: model selection, parameter controls, system prompt editor, side-by-side comparison, token visualization, latency benchmark |
| `08-Module-Vector-Search.md` | Semantic retrieval: vector search, hybrid search (BM25), similarity ranking, chunk visualization, embedding explorer, admin ingestion |
| `09-Module-Monitoring.md` | Real-time metrics dashboard: collection, SSE streaming, health checks, cost tracking, Grafana-style UI, summary cards, live charts |
| `10-Module-Live-Logs.md` | Live logs terminal: [SHOWCASE_LOG] tagging, structured JSON format, WebSocket broadcast, filtering, FIFO retention, terminal aesthetic |
| `11-Module-API-Explorer.md` | Interactive API docs: auto OpenAPI, Swagger UI, custom explorer page, auth testing, endpoint categorization, request examples |
| `12-Module-Authentication.md` | Auth & rate limiting: Guest ID, GitHub OAuth, JWT, sliding window rate limit, RBAC, quota tiers, response headers |
| `13-Module-Admin-Panel.md` | Internal tools: user monitoring, quota management, system health, prompt analytics, vector index management, RBAC protection |
| `14-Module-Workflow-Automation.md` | AI automation: trigger types (manual/schedule/event), workflow builder, pre-built templates, execution history, notification integration |
| `15-Security-Observability.md` | Cross-cutting concerns: 5 security layers, auth flow, RBAC matrix, rate limiting spec, input validation, prompt injection mitigation, file upload security, observability three pillars (Prometheus/Loki/OpenTelemetry), log standards, alerting thresholds |
| `16-Development-Roadmap.md` | 5 phases over 8–12 weeks, sprint breakdown (12 sprints), definition of done, performance targets |
| `17-Appendix-Glossary.md` | Glossary (AI/ML, Architecture, Observability, Security, Frontend terms), external references, document index, changelog |
| `FeatureRequirementDocument.md` | Consolidated FRD covering all 11 modules with objectives, features, flows, inputs/outputs, dependencies, edge cases |
| `ProductVisionDocument.md` | Consolidated PVD: executive summary, problem statement, vision, personas, philosophies, value proposition, journey, KPIs, non-goals, tone |
| `README.md` | Documentation hub index with document map, reading guide for stakeholders/developers/reviewers, convention symbols |

### 2.2 New Folder Structure Created
The new folder structure has been **fully created** (all directories exist). Below is the complete target structure with completion status.

```
docs/
│
├── 01-Product-Definition/           ✅ COMPLETE (6/6 files)
│   ├── pvd.md                       ✅ Product Vision Document
│   ├── frd.md                       ✅ Feature Requirement Document
│   ├── product-goals.md             ✅ Detailed product goals
│   ├── user-personas.md             ✅ 4 personas with journeys
│   ├── positioning.md               ✅ Market positioning
│   └── success-metrics.md           ✅ KPIs & measurement
│
├── 02-Architecture-Design/          ⚠️ PARTIAL (6/8 files — 75%)
│   ├── system-architecture.md       ✅ High-level overview
│   ├── frontend-architecture.md     ✅ Astro, state management
│   ├── backend-architecture.md      ✅ FastAPI, middleware
│   ├── ai-architecture.md           ✅ LLM pipeline, LangGraph
│   ├── event-flow.md                ✅ Data flows, state transitions
│   ├── websocket-architecture.md    ✅ WS protocol, rooms, resilience
│   ├── deployment-architecture.md   ❌ MISSING — Docker, CI/CD, prod deploy
│   └── infrastructure-topology.md   ❌ MISSING — Network topology, dependency map
│
├── 03-Core-AI-Modules/              ⚠️ PARTIAL (~40% overall)
│   │
│   ├── Authentication/              ✅ COMPLETE (11/11)
│   │   ├── PRD/                     ✅ (prd, user-stories, functional-reqs, non-functional-reqs, edge-cases, acceptance-criteria)
│   │   └── Design-System/           ✅ (ui-spec, component-behavior, states, animations, accessibility)
│   │
│   ├── RAG-Chatbot/                 ⚠️ PARTIAL (9/11 — missing 2 DS files)
│   │   ├── PRD/                     ✅ COMPLETE (6/6)
│   │   └── Design-System/           ⚠️ MISSING: accessibility.md, animations.md
│   │                               ✅ HAVE: ui-spec.md, component-behavior.md, states.md
│   │
│   ├── Face-Recognition/            ❌ EMPTY (0/11)
│   │   ├── PRD/                     ❌ All 6 missing
│   │   └── Design-System/           ❌ All 5 missing
│   │
│   ├── AI-Playground/               ✅ COMPLETE (11/11)
│   │   ├── PRD/                     ✅ (6/6)
│   │   └── Design-System/           ✅ (5/5)
│   │
│   ├── Multi-Agent-System/          ⚠️ PARTIAL (9/11 — missing 2 DS files)
│   │   ├── PRD/                     ✅ COMPLETE (6/6)
│   │   └── Design-System/           ⚠️ MISSING: accessibility.md, animations.md
│   │                               ✅ HAVE: ui-spec.md, component-behavior.md, states.md
│   │
│   ├── Observability/               ❌ EMPTY (0/11)
│   │   ├── PRD/                     ❌ All 6 missing
│   │   └── Design-System/           ❌ All 5 missing
│   │
│   ├── Live-Logs/                   ❌ EMPTY (0/11)
│   │   ├── PRD/                     ❌ All 6 missing
│   │   └── Design-System/           ❌ All 5 missing
│   │
│   └── API-Explorer/                ❌ EMPTY (0/11)
│       ├── PRD/                     ❌ All 6 missing
│       └── Design-System/           ❌ All 5 missing
│
├── 04-Real-Time-Infrastructure/     ❌ EMPTY (0/6)
│   ├── websocket-events.md          ❌
│   ├── streaming-strategy.md        ❌
│   ├── queue-architecture.md        ❌
│   ├── caching-strategy.md          ❌
│   ├── scaling-strategy.md          ❌
│   └── failover-strategy.md         ❌
│
├── 05-Security-Observability/       ❌ EMPTY (0/7)
│   ├── auth-strategy.md             ❌
│   ├── rate-limiting.md             ❌
│   ├── abuse-prevention.md          ❌
│   ├── monitoring.md                ❌
│   ├── logging-pipeline.md          ❌
│   ├── metrics.md                   ❌
│   └── incident-handling.md         ❌
│
├── 06-Project-Management/           ❌ EMPTY (0/6)
│   ├── roadmap.md                   ❌
│   ├── milestones.md                ❌
│   ├── backlog.md                   ❌
│   ├── release-plan.md              ❌
│   ├── sprint-plan.md               ❌
│   └── technical-debt.md            ❌
│
├── 07-Appendix/                     ❌ EMPTY (0/6)
│   ├── glossary.md                  ❌
│   ├── api-reference.md             ❌
│   ├── prompt-library.md            ❌
│   ├── sequence-diagrams.md         ❌
│   ├── architecture-decisions.md    ❌
│   └── references.md                ❌
│
└── Design-System/                   ❌ EMPTY (0/22)
    ├── foundations/                 ❌ (0/5)
    │   ├── colors.md                ❌
    │   ├── typography.md            ❌
    │   ├── spacing.md               ❌
    │   ├── shadows.md               ❌
    │   └── motion.md                ❌
    ├── components/                  ❌ (0/8)
    │   ├── buttons.md               ❌
    │   ├── cards.md                 ❌
    │   ├── modals.md                ❌
    │   ├── terminal.md              ❌
    │   ├── chat.md                  ❌
    │   ├── metrics.md               ❌
    │   ├── dashboard.md             ❌
    │   └── input-fields.md          ❌
    ├── patterns/                    ❌ (0/5)
    │   ├── realtime-ui.md           ❌
    │   ├── streaming-ui.md          ❌
    │   ├── ai-loading-states.md     ❌
    │   ├── observability-layout.md  ❌
    │   └── error-handling-ui.md     ❌
    └── branding/                    ❌ (0/4)
        ├── tone.md                  ❌
        ├── voice.md                 ❌
        ├── visual-direction.md      ❌
        └── interaction-philosophy.md ❌
```

### 2.3 Content Migration Progress Summary

| Category | Total Files | Completed | Percentage |
|----------|-------------|-----------|------------|
| 01-Product-Definition | 6 | 6 | 100% |
| 02-Architecture-Design | 8 | 6 | 75% |
| 03-Core-AI-Modules | 88 | ~36 | ~41% |
| 04-Real-Time-Infrastructure | 6 | 0 | 0% |
| 05-Security-Observability | 7 | 0 | 0% |
| 06-Project-Management | 6 | 0 | 0% |
| 07-Appendix | 6 | 0 | 0% |
| Design-System | 22 | 0 | 0% |
| **TOTAL** | **149** | **~48** | **~32%** |

---

## 3. WHAT STILL NEEDS TO BE DONE

### 3.1 High Priority — Complete Missing Files

These files are required to reach a usable documentation state. They should be written first.

#### A. 02-Architecture-Design (2 files)
- `deployment-architecture.md` — Docker Compose local setup, CI/CD pipeline, production deployment, environment config, secret management, rollback strategy.
- `infrastructure-topology.md` — Network topology diagram, service dependency map, data flow topology, resource requirements, scaling topology, failover points.

#### B. 03-Core-AI-Modules — Missing Modules (66 files)

**Face-Recognition/** (11 files) — Content source: `04-Module-Face-Recognition.md`
- PRD: prd.md, user-stories.md, functional-requirements.md, non-functional-requirements.md, edge-cases.md, acceptance-criteria.md
- Design-System: ui-spec.md, component-behavior.md, states.md, animations.md, accessibility.md

**Observability/** (11 files) — Content source: `09-Module-Monitoring.md`
- PRD: prd.md, user-stories.md, functional-requirements.md, non-functional-requirements.md, edge-cases.md, acceptance-criteria.md
- Design-System: ui-spec.md, component-behavior.md, states.md, animations.md, accessibility.md

**Live-Logs/** (11 files) — Content source: `10-Module-Live-Logs.md`
- PRD: prd.md, user-stories.md, functional-requirements.md, non-functional-requirements.md, edge-cases.md, acceptance-criteria.md
- Design-System: ui-spec.md, component-behavior.md, states.md, animations.md, accessibility.md

**API-Explorer/** (11 files) — Content source: `11-Module-API-Explorer.md`
- PRD: prd.md, user-stories.md, functional-requirements.md, non-functional-requirements.md, edge-cases.md, acceptance-criteria.md
- Design-System: ui-spec.md, component-behavior.md, states.md, animations.md, accessibility.md

**RAG-Chatbot/Design-System** (2 files)
- accessibility.md, animations.md

**Multi-Agent-System/Design-System** (2 files)
- accessibility.md, animations.md

#### C. 04-Real-Time-Infrastructure (6 files)
Content sources: `03-System-Architecture.md`, `05-Module-LLM-Chatbot.md` (SSE), `06-Module-Multi-Agent.md` (WebSocket), `09-Module-Monitoring.md`, `10-Module-Live-Logs.md`
- `websocket-events.md` — WS protocol, connection lifecycle, message types, room/channel design, reconnection, scaling.
- `streaming-strategy.md` — SSE vs WS matrix, streaming patterns, chunking, backpressure, disconnection handling.
- `queue-architecture.md` — Celery + Redis design, task routing, prioritization, dead letter queue, retry policy.
- `caching-strategy.md` — Multi-layer caching, invalidation, warming, key design, stale-while-revalidate.
- `scaling-strategy.md` — Horizontal scaling, stateless API, DB read replicas, vector DB sharding, worker autoscaling.
- `failover-strategy.md` — Failure detection, circuit breaker, fallbacks (Redis down → memory, Qdrant down → keyword search), graceful degradation.

#### D. 05-Security-Observability (7 files)
Content source: `15-Security-Observability.md`, `12-Module-Authentication.md`
- `auth-strategy.md` — Guest ID, GitHub OAuth PKCE, JWT design, session management, RBAC matrix, token refresh.
- `rate-limiting.md` — Sliding window algorithm, Redis implementation, tiers, headers, bypass prevention.
- `abuse-prevention.md` — Prompt injection mitigation, API quota abuse, throttling, IP anomaly detection.
- `monitoring.md` — Three pillars overview, metrics pipeline, dashboard principles, alerts, SLA definitions.
- `logging-pipeline.md` — Structured JSON format, levels, sensitive data masking, aggregation, broadcast filtering, retention.
- `metrics.md` — Complete metrics catalog (api_requests_total, api_latency_seconds, openai_tokens_total, etc.), types, labels, aggregation, alert conditions.
- `incident-handling.md` — Severity levels, response procedures, escalation, communication templates, post-mortem, runbooks.

### 3.2 Medium Priority — Project Management & Appendix

#### E. 06-Project-Management (6 files)
Content source: `16-Development-Roadmap.md`, `00-Plan-Pembuatan-Dokumen.md`
- `roadmap.md` — 5 phases with deliverables, milestone reviews, risk assessment.
- `milestones.md` — Milestone definitions, success criteria, review checklists, sign-off.
- `backlog.md` — Product backlog by module, priorities P0-P3, effort estimates, dependencies.
- `release-plan.md` — Release criteria, versioning, checklist, rollback, feature flags.
- `sprint-plan.md` — 12 sprints detailed, capacity planning, sprint goals, deliverables.
- `technical-debt.md` — Debt items, impact, remediation plan, prevention, review cadence.

#### F. 07-Appendix (6 files)
Content source: `17-Appendix-Glossary.md`, all module API contracts
- `glossary.md` — 50+ terms by category: AI/ML, Architecture, Observability, Security, Frontend, DevOps.
- `api-reference.md` — Consolidated API reference: all endpoints with method, path, auth, rate limit, request/response examples, error codes.
- `prompt-library.md` — System prompts (RAG assistant, Code Reviewer, Creative Writer, Socratic Tutor), Jinja2 templates, versioning, best practices.
- `sequence-diagrams.md` — Mermaid/text diagrams for: Chat RAG flow, Face Recognition pipeline, Multi-Agent workflow, OAuth flow, Metrics collection, Log broadcast.
- `architecture-decisions.md` — ADRs: Why FastAPI, Why Astro, Why Qdrant, Why Redis sliding window, Why SSE over WS for streaming, Why LangGraph.
- `references.md` — External links: FastAPI, Astro, Qdrant, LangGraph, OpenAI API, InsightFace, Tailwind, Recharts, Framer Motion, Zustand, React Query, Celery, Redis, PostgreSQL, MinIO, Prometheus, Loki, OpenTelemetry.

### 3.3 Lower Priority — Design-System

#### G. Design-System/ (22 files)
Content sources: Visual style references across all module docs, `01-Product-Overview.md`, `03-System-Architecture.md`, `FeatureRequirementDocument.md`

**foundations/** (5 files)
- `colors.md` — Primary palette, semantic colors, dark mode colors, neon accents, surface/text/border colors, hex codes, contrast ratios.
- `typography.md` — Font families (Inter/sans-serif UI, JetBrains Mono/Fira Code terminal), type scale xs-4xl, weights, line heights, responsive scaling.
- `spacing.md` — 4px base grid, padding/margin tokens, component spacing, layout gaps, section spacing, responsive adjustments.
- `shadows.md` — Elevation levels 0-5, neon glow effects, focus rings, inner shadows, usage per component.
- `motion.md` — Duration scale (fast/medium/slow), easing curves, transition presets, spring physics, performance guidelines (transform/opacity only).

**components/** (8 files)
- `buttons.md` — Variants (primary, secondary, ghost, danger), sizes, states (default/hover/active/disabled/loading), icon buttons, groups.
- `cards.md` — Variants (metric, info, result), padding, borders, shadows, hover states, internal layout (header/body/footer).
- `modals.md` — Types (alert, confirm, form, quota exhausted), sizing, backdrop, focus trap, scroll lock, enter/exit animation, stacking.
- `terminal.md` — Dark background #0a0a0a, monospace 12-13px, color-coded levels, auto-scroll, filter bar, collapse/expand, copy/export, custom scrollbar.
- `chat.md` — Message bubbles (user/assistant), typing indicator, citation pills, input textarea, send button, markdown container, code block with copy.
- `metrics.md` — Stat cards, sparklines, gauge charts, progress bars, live indicator badge, trend arrows.
- `dashboard.md` — Grid system, panel containers, resizable panels, split layouts, responsive breakpoints, sidebar behavior.
- `input-fields.md` — Text inputs, textareas, sliders, dropdowns, file upload dropzone, search bars, states, validation, error display, focus styles.

**patterns/** (5 files)
- `realtime-ui.md` — Live indicators, pulse animations, connection status badges, stale data warnings, update notifications.
- `streaming-ui.md` — SSE rendering, word-by-word reveal, blinking cursor, progress indicators, cancellation UI.
- `ai-loading-states.md` — Skeleton shimmer, thinking indicators, retrieval progress, queue position, generating animations.
- `observability-layout.md` — Terminal layout, metrics grid, health status indicators, chart containers, time range selectors, filter bars.
- `error-handling-ui.md` — Inline validation, toast notifications, error boundaries, fallback UIs, retry buttons, quota modal, rate limit warnings.

**branding/** (4 files)
- `tone.md` — Tone characteristics (confident, direct, precise, humble, welcoming), tone per context, dont's.
- `voice.md` — Personality attributes, voice principles, vocabulary (systems language over AI buzzwords), active voice preference.
- `visual-direction.md` — Aesthetic principles, inspiration breakdown (Linear, Vercel, Raycast, Datadog, Grafana), imagery style, iconography, spacing philosophy.
- `interaction-philosophy.md` — Responsiveness targets, animation philosophy, feedback loops, state transitions, micro-interactions, accessibility-first.

---

## 4. CONTENT STANDARDS & WRITING GUIDELINES

### 4.1 Language
**ALL new documentation must be written in English.** The legacy docs contained mixed Indonesian and English. The new structure requires consistent professional English throughout.

### 4.2 Document Structure
Each PRD file should follow this structure:
```markdown
# Title

> Metadata block (Module, Priority, Category, Dependencies)

## 1. Objective
## 2. User Stories
## 3. Functional Requirements
## 4. Non-Functional Requirements
## 5. UI/UX Requirements
## 6. API & Data Contract
## 7. Acceptance Criteria
## 8. Edge Cases
## 9. Security Requirements
## 10. Dependencies
## 11. Cross-References
```

Each Design-System file should follow:
```markdown
# Title

> Component/Pattern/Foundation overview

## 1. Overview
## 2. Anatomy / Structure
## 3. Variants / Types
## 4. States
## 5. Behavior & Interactions
## 6. Animation & Motion
## 7. Accessibility
## 8. Usage Guidelines
## 9. Examples
```

### 4.3 Symbol Convention (from legacy README)
Use these emojis for consistency across all documents:

| Symbol | Meaning |
|--------|---------|
| 🎯 | Objective / Goal |
| 👤 | User Story |
| ⚙️ | Functional Requirement |
| 🎨 | UI/UX Requirement |
| 🔌 | API Contract |
| ✅ | Acceptance Criteria |
| ⚠️ | Edge Case |
| 🔒 | Security Concern |
| 📊 | Metric / KPI |

### 4.4 Technical Depth Expectation
Each file must be **more comprehensive and detailed** than the legacy source. Do not simply copy — expand with:
- Additional edge cases
- More detailed API schemas
- Deeper justification for decisions
- Cross-references to related modules
- Real-world examples and scenarios
- Performance considerations
- Accessibility requirements

### 4.5 Cross-Reference Format
When referencing other modules, use relative paths:
```markdown
- For authentication details → [Authentication PRD](../Authentication/PRD/prd.md)
- For chatbot streaming → [RAG-Chatbot PRD](../RAG-Chatbot/PRD/prd.md)
- For rate limiting → [05-Security-Observability/rate-limiting.md](../../05-Security-Observability/rate-limiting.md)
```

---

## 5. LEGACY-TO-NEW MAPPING REFERENCE

Use this table to locate source content when writing new files:

| New File Path | Primary Legacy Source | Secondary Sources |
|---------------|----------------------|-------------------|
| `01-Product-Definition/pvd.md` | `ProductVisionDocument.md`, `01-Product-Overview.md` | — |
| `01-Product-Definition/frd.md` | `FeatureRequirementDocument.md` | All module docs |
| `01-Product-Definition/product-goals.md` | `01-Product-Overview.md` (KPIs, goals) | `FeatureRequirementDocument.md` |
| `01-Product-Definition/user-personas.md` | `02-User-Personas-Journey.md` | `ProductVisionDocument.md` |
| `01-Product-Definition/positioning.md` | `01-Product-Overview.md` | `ProductVisionDocument.md` |
| `01-Product-Definition/success-metrics.md` | `01-Product-Overview.md`, `16-Development-Roadmap.md` | `FeatureRequirementDocument.md` |
| `02-Architecture-Design/*` | `03-System-Architecture.md` | `FeatureRequirementDocument.md` (Section 5-8) |
| `03-Core-AI-Modules/Authentication/*` | `12-Module-Authentication.md` | `15-Security-Observability.md` |
| `03-Core-AI-Modules/RAG-Chatbot/*` | `05-Module-LLM-Chatbot.md` | `08-Module-Vector-Search.md` |
| `03-Core-AI-Modules/Face-Recognition/*` | `04-Module-Face-Recognition.md` | — |
| `03-Core-AI-Modules/AI-Playground/*` | `07-Module-AI-Playground.md` | `05-Module-LLM-Chatbot.md` |
| `03-Core-AI-Modules/Multi-Agent-System/*` | `06-Module-Multi-Agent.md` | `05-Module-LLM-Chatbot.md` |
| `03-Core-AI-Modules/Observability/*` | `09-Module-Monitoring.md` | `03-System-Architecture.md` |
| `03-Core-AI-Modules/Live-Logs/*` | `10-Module-Live-Logs.md` | `15-Security-Observability.md` |
| `03-Core-AI-Modules/API-Explorer/*` | `11-Module-API-Explorer.md` | `03-System-Architecture.md` |
| `04-Real-Time-Infrastructure/*` | `03-System-Architecture.md` (Integration Patterns) | `09-Module-Monitoring.md`, `10-Module-Live-Logs.md`, `05-Module-LLM-Chatbot.md`, `06-Module-Multi-Agent.md` |
| `05-Security-Observability/*` | `15-Security-Observability.md` | `12-Module-Authentication.md` |
| `06-Project-Management/*` | `16-Development-Roadmap.md` | `00-Plan-Pembuatan-Dokumen.md` |
| `07-Appendix/*` | `17-Appendix-Glossary.md` | All module API contracts |
| `Design-System/*` | Visual references across all modules | `01-Product-Overview.md`, `FeatureRequirementDocument.md` (Section 13) |

---

## 6. EXECUTION PLAN FOR NEXT AI AGENT

### Step 1: Read This File First
Before doing anything, read `docs/CONTINUATION_CONTEXT.md` (this file) to understand the full scope and status.

### Step 2: Read Relevant Legacy Sources
Based on the mapping table above, read the legacy files that contain source content for the files you plan to write. Legacy files are in `docs/` root (00-17, FeatureRequirementDocument.md, ProductVisionDocument.md).

### Step 3: Write Missing Files in Priority Order

**Recommended execution order:**

1. **02-Architecture-Design** (2 files) — Foundation for everything else
2. **03-Core-AI-Modules missing modules** (66 files):
   - Face-Recognition (11)
   - Observability (11)
   - Live-Logs (11)
   - API-Explorer (11)
   - RAG-Chatbot DS (2)
   - Multi-Agent DS (2)
3. **04-Real-Time-Infrastructure** (6 files)
4. **05-Security-Observability** (7 files)
5. **06-Project-Management** (6 files)
6. **07-Appendix** (6 files)
7. **Design-System** (22 files)

### Step 4: Cleanup (CRITICAL — Do This Last)

After ALL new files are written and verified:

1. **Delete legacy files 00-17:**
   ```powershell
   Remove-Item docs/00-Plan-Pembuatan-Dokumen.md
   Remove-Item docs/01-Product-Overview.md
   Remove-Item docs/02-User-Personas-Journey.md
   Remove-Item docs/03-System-Architecture.md
   Remove-Item docs/04-Module-Face-Recognition.md
   Remove-Item docs/05-Module-LLM-Chatbot.md
   Remove-Item docs/06-Module-Multi-Agent.md
   Remove-Item docs/07-Module-AI-Playground.md
   Remove-Item docs/08-Module-Vector-Search.md
   Remove-Item docs/09-Module-Monitoring.md
   Remove-Item docs/10-Module-Live-Logs.md
   Remove-Item docs/11-Module-API-Explorer.md
   Remove-Item docs/12-Module-Authentication.md
   Remove-Item docs/13-Module-Admin-Panel.md
   Remove-Item docs/14-Module-Workflow-Automation.md
   Remove-Item docs/15-Security-Observability.md
   Remove-Item docs/16-Development-Roadmap.md
   Remove-Item docs/17-Appendix-Glossary.md
   Remove-Item docs/FeatureRequirementDocument.md
   Remove-Item docs/ProductVisionDocument.md
   ```

2. **Update `docs/README.md`** to reflect the new folder structure. Replace the old flat document map with the new categorized structure. Include navigation instructions for stakeholders, developers, and reviewers.

3. **Delete this continuation file** (`docs/CONTINUATION_CONTEXT.md`) if desired, or keep it as project history.

### Step 5: Verification Checklist

- [ ] All 149 target files exist
- [ ] All legacy files (00-17, FRD, PVD) have been deleted
- [ ] README.md reflects new structure
- [ ] All files are in English
- [ ] No broken cross-references within new structure
- [ ] All PRD files contain: Objective, User Stories, Functional Requirements, UI/UX Requirements, API Contract, Acceptance Criteria, Edge Cases, Security Requirements
- [ ] All Design-System files contain: Overview, Anatomy, Variants, States, Behavior, Animation, Accessibility, Usage Guidelines
- [ ] File sizes are reasonable (not empty, not unreasonably small — PRD files should be 4KB+, DS files 3KB+)

---

## 7. CRITICAL TECHNICAL CONTEXT

### 7.1 Technology Stack

**Frontend:**
- Astro — SSR, routing, API proxy
- React 18 — Component architecture
- Tailwind CSS — Utility-first styling
- Zustand — Global state (auth, metrics)
- React Query (TanStack Query) — Server state, caching, polling
- Recharts — Metrics visualization
- Framer Motion — Micro-interactions, page transitions
- Socket.IO Client — WebSocket connections
- ReactMarkdown + DOMPurify + Prism — Chat message rendering

**Backend:**
- FastAPI — High-performance async API, auto OpenAPI
- Celery + Redis — Background tasks, async inference
- Redis — Rate limiting, session store, metrics buffer
- PostgreSQL — Relational data (users, sessions, logs)
- Qdrant — Semantic search, face embeddings
- MinIO (local) / S3 (cloud) — Image uploads, artifacts
- WebSocket (FastAPI native) — Streaming, live logs, metrics
- Prometheus + Loki + OpenTelemetry — Metrics, logs, tracing

**AI / ML:**
- OpenAI API (gpt-4o-mini, gpt-4o, gpt-3.5-turbo)
- OpenAI text-embedding-3-small / SentenceTransformer
- Qdrant + Hybrid Search (BM25)
- Cross-encoder / Cohere — Reranker
- LangGraph — Multi-agent workflow graph
- InsightFace (buffalo_l) + ONNX Runtime — Face recognition
- OpenCV — Image preprocessing

### 7.2 Key Architectural Decisions

1. **Microservices-ready monolith** — Modular from start, deployed as single unit for portfolio optimization.
2. **REST for sync, SSE for streaming, WebSocket for bidirectional real-time**
3. **Sliding window rate limiting** via Redis (not token bucket) — smoother user experience.
4. **Hybrid retrieval** — Dense (Qdrant cosine) + Sparse (BM25/tsvector) with Reciprocal Rank Fusion.
5. **Guest-first onboarding** — No forced login; HMAC-signed guest_id from IP+UA hash.
6. **Dark mode default** — Engineering aesthetic; minimal neon accents.

### 7.3 Performance Targets

| Metric | Target |
|--------|--------|
| Chatbot TTFT | < 1.5s |
| Chat P95 latency | < 500ms |
| Vision inference (GPU) | < 500ms |
| Vision inference (CPU) | < 2s |
| Vector search (top-10) | < 200ms |
| Log broadcast delay | < 500ms |
| Metrics SSE interval | 2–3s |
| System uptime | 99.9% |

### 7.4 Rate Limiting Tiers

| Tier | Limit | Window | Identifier |
|------|-------|--------|------------|
| Guest | 20 requests | 24 hours | guest_id (HMAC-signed) |
| Developer | 200 requests | 24 hours | user_id (JWT) |
| Admin | Unlimited | — | user_id + role=admin |

### 7.5 Security Layers

1. **Edge/Network** — HTTPS only, strict CORS, DDoS protection
2. **Gateway** — Redis sliding-window rate limit, JWT validation, request sanitization
3. **Application** — RBAC, Pydantic input validation, prompt injection mitigation
4. **Data** — Parameterized queries (ORM), secret management (env vars), encryption at rest
5. **Audit** — Structured JSON logging, audit trail for admin actions, abuse detection

---

## 8. INSTRUCTIONS FOR NEXT AI AGENT

1. **Read this file first.** Understand what is done and what remains.
2. **Read legacy source files** before writing new files. The legacy files contain the factual content that must be reorganized and expanded.
3. **Write in English only.** No Indonesian language in new files.
4. **Make content MORE detailed** than the legacy source. Expand, don't just copy.
5. **Follow the file structure exactly.** Do not create additional folders or skip required files.
6. **Use WriteFile tool** to create files. Do not just describe them in text.
7. **Work in batches** if needed. Use multiple parallel agents for independent modules.
8. **Do NOT delete legacy files until** all new files are confirmed written and correct.
9. **Update README.md** as the final step before cleanup.
10. **Run the verification checklist** before finishing.

---

## 9. KNOWN ISSUES / CAVEATS

- Some agent-written files may have minor inconsistencies or incomplete sections due to timeout limits during the first pass. Review and expand as needed.
- Cross-references in newly written files may point to legacy filenames. Update to new relative paths during final cleanup.
- The `Design-System/` folder at root (`docs/Design-System/`) is separate from module-level `Design-System/` folders inside `03-Core-AI-Modules/`. Root Design-System contains global system-wide design tokens; module Design-System folders contain module-specific UI specifications.

---

*This document is a living handoff. Update it if the scope or priority changes during continuation.*
