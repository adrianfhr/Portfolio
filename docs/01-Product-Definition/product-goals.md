# Product Goals

> **Project:** Interactive AI Engineering Portfolio & Sandbox
> **Version:** 1.0
> **Owner:** Adrian Fahri Affandi
> **Role:** Senior Fullstack AI / Systems Engineer
> **Last Updated:** 2026-05-06

---

## Table of Contents

1. [Goal Classification Framework](#1-goal-classification-framework)
2. [Primary Goals](#2-primary-goals)
3. [Secondary Goals](#3-secondary-goals)
4. [Engineering Goals](#4-engineering-goals)
5. [User Experience Goals](#5-user-experience-goals)
6. [Business Goals](#6-business-goals)
7. [Goal Interdependency Map](#7-goal-interdependency-map)
8. [Measurement & Validation](#8-measurement--validation)

---

## 1. Goal Classification Framework

Product goals for this platform are organized into five categories, each representing a distinct dimension of success. Goals are further classified by their **impact** (how much they matter) and **difficulty** (how hard they are to achieve).

| Classification | Definition |
|---------------|------------|
| **Primary** | Existential — without these, the product fails its core mission. Must be achieved by launch. |
| **Secondary** | Elevating — these differentiate good from great. Should be achieved by launch or shortly after. |
| **Engineering** | Technical — these prove engineering maturity and are visible through system behavior rather than user-facing features. |
| **User Experience** | Interaction — these govern how visitors feel when using the platform. |
| **Business** | Strategic — these translate platform success into career outcomes for the owner. |

---

## 2. Primary Goals

Primary goals define what the product must achieve to fulfill its fundamental purpose: **to serve as irrefutable evidence of engineering competence in AI systems.**

### PG-01: Deliver Live, Interactive AI Demonstrations

**Description:** Every claimed AI capability must be accompanied by a working, interactive demonstration that visitors can use without assistance.

**Measurable Outcomes:**
- [ ] 100% of AI modules (Chatbot, Face Recognition, Multi-Agent, Vector Search, AI Playground) expose interactive UIs.
- [ ] Average time from page load to first interaction < 3 seconds.
- [ ] Zero demo features that require the visitor to "imagine" the result — every feature produces observable output.

**Validation Method:**
- Manual walkthrough of each module by an independent evaluator.
- Synthetic user journey testing (automated Playwright scripts simulating first-time visitor).

### PG-02: Expose Production-Grade Observability

**Description:** The platform must make visible the operational data that is typically hidden in production systems — metrics, logs, costs, and architecture.

**Measurable Outcomes:**
- [ ] Monitoring dashboard displays ≥ 8 distinct metrics updated in real time.
- [ ] Live logs terminal streams structured logs with < 500ms broadcast delay.
- [ ] Token cost per request visible in every AI interaction.
- [ ] System architecture diagram interactive and linked to active service health.

**Validation Method:**
- Load test generating known request patterns; verify metrics accuracy.
- Log injection test: emit log with known timestamp; measure client receipt time.

### PG-03: Enable Zero-Friction Onboarding

**Description:** A first-time visitor must be able to interact with AI features within seconds, without registration, without tutorials, and without reading documentation.

**Measurable Outcomes:**
- [ ] Guest tier active and functional on first page load.
- [ ] No mandatory registration for any feature in the Guest tier.
- [ ] Time from landing page to first API call < 30 seconds for 90% of visitors.
- [ ] First-time visitor task completion rate (initiate at least one AI interaction) > 70%.

**Validation Method:**
- Analytics funnel: Landing → First Interaction → Second Interaction.
- User testing with 5+ participants who have never seen the platform.

### PG-04: Prove End-to-End System Ownership

**Description:** The platform must demonstrate competence across the entire stack — not just AI models, but infrastructure, security, frontend, backend, and operations.

**Measurable Outcomes:**
- [ ] All three layers (Frontend, Backend, Infrastructure) have dedicated, visible modules.
- [ ] Security controls (rate limiting, auth, input validation) are functional and verifiable.
- [ ] Deployment and CI/CD pipeline documented and operational.
- [ ] Performance targets met for every user-facing operation (see [success-metrics.md](./success-metrics.md)).

**Validation Method:**
- Security audit: attempt injection, bypass rate limits, forge tokens — all must fail.
- Architecture review: independent engineer reviews system design for coherence.

---

## 3. Secondary Goals

Secondary goals elevate the platform from a functional demo to an exceptional showcase. They are not strictly required for launch but strongly contribute to differentiation.

### SG-01: Provide Educational Value to Peer Engineers

**Description:** The platform should be studied by other engineers, not merely used. Implementation details, trade-offs, and architectural decisions must be accessible.

**Measurable Outcomes:**
- [ ] Every module links to its design document or architecture explanation.
- [ ] Code comments explain *why* decisions were made, not just *what* the code does.
- [ ] At least one "Engineering Deep Dive" article published per major module.
- [ ] GitHub repository stars / forks tracked as a proxy for peer interest.

**Validation Method:**
- Survey peer engineers: "Did you learn something from exploring this platform?"
- Track time-on-page for documentation and architecture pages.

### SG-02: Demonstrate Cost Awareness and Efficiency

**Description:** The platform must prove that the builder understands the economic realities of running AI in production — token costs, infrastructure spend, optimization trade-offs.

**Measurable Outcomes:**
- [ ] Model tiering strategy implemented and visible to users.
- [ ] Monthly infrastructure and API cost tracked and displayed in admin panel.
- [ ] Cost per visitor calculated and trending downward through optimization.
- [ ] Caching strategy reduces redundant API calls by ≥ 30%.

**Validation Method:**
- Compare token spend with vs. without caching layer.
- Monthly cost report with breakdown by service (LLM, hosting, storage).

### SG-03: Support Advanced User Workflows

**Description:** Beyond simple demos, the platform should support meaningful multi-step workflows that demonstrate sophisticated product thinking.

**Measurable Outcomes:**
- [ ] Multi-agent workflows execute with ≥ 3 distinct agent nodes.
- [ ] Workflow automation builder supports saving, versioning, and replay.
- [ ] AI Playground supports side-by-side model comparison with export.
- [ ] Vector search demo allows custom collection creation and querying.

**Validation Method:**
- End-to-end workflow tests: trigger agent flow, verify all nodes complete, check trace persistence.
- User task: "Build and run a custom workflow" — measure completion rate.

### SG-04: Achieve Professional Visual Polish

**Description:** The UI must match or exceed the visual quality of leading developer tools (Linear, Vercel, Raycast) to signal attention to craft.

**Measurable Outcomes:**
- [ ] Lighthouse performance score ≥ 90 on all routes.
- [ ] Lighthouse accessibility score ≥ 90 on all routes.
- [ ] Zero layout shift during metric streaming or log updates.
- [ ] Consistent design token usage across 100% of components.

**Validation Method:**
- Automated Lighthouse CI checks on every commit.
- Design audit: compare visual consistency against defined design system.

---

## 4. Engineering Goals

Engineering goals are technical objectives that prove maturity. They may not be directly visible to all visitors, but they are detectable by evaluators with systems expertise.

### EG-01: Maintain > 70% Test Coverage for Business Logic

**Description:** All non-trivial business logic must be covered by automated tests to demonstrate discipline in software quality.

**Measurable Outcomes:**
- [ ] Unit test coverage ≥ 70% for `services/` and `core/` directories.
- [ ] Integration tests for every API router covering success and error paths.
- [ ] End-to-end tests for critical user journeys (chat, vision upload, auth flow).
- [ ] Tests run in CI/CD on every pull request; failures block merge.

**Validation Method:**
- Coverage report generated by `pytest-cov` and `c8` / `istanbul`.
- CI pipeline configuration inspection.

### EG-02: Implement Comprehensive Error Handling

**Description:** The system must never expose unhandled exceptions or cryptic errors to users. Every failure mode must be caught, logged, and presented gracefully.

**Measurable Outcomes:**
- [ ] Custom exception hierarchy covering all domain errors (AuthError, RateLimitError, InferenceError, etc.).
- [ ] Global exception handler in FastAPI returning consistent error JSON schema.
- [ ] Frontend error boundaries catching React render failures.
- [ ] Zero unhandled 500 errors in production over a 30-day period.

**Validation Method:**
- Error log analysis: search for unhandled exception traces.
- Chaos testing: intentionally trigger failures (kill Redis, overload queue) and verify graceful degradation.

### EG-03: Achieve Stateless API Design

**Description:** The backend API must be horizontally scalable without session affinity, proving cloud-native architectural thinking.

**Measurable Outcomes:**
- [ ] No server-side session state stored in API process memory.
- [ ] All session data in Redis or JWT; all user data in PostgreSQL.
- [ ] API instances can be added or removed without affecting active user sessions.
- [ ] Load balancer health checks functional and routing correctly.

**Validation Method:**
- Deploy 3 API replicas; terminate one during active sessions; verify continuity.
- Review code for any `global` state or in-memory caches that would break horizontal scaling.

### EG-04: Implement Structured, Queryable Logging

**Description:** Logs must be machine-readable, correlated, and searchable — not ad-hoc print statements.

**Measurable Outcomes:**
- [ ] 100% of application logs in JSON format.
- [ ] Every log entry contains `trace_id`, `timestamp`, `level`, `module`, and `message`.
- [ ] Logs tagged `[SHOWCASE_LOG]` broadcast to clients; all others restricted to server-side.
- [ ] Sensitive fields (`password`, `token`, `api_key`) redacted before any output.

**Validation Method:**
- Log schema validation using JSON Schema.
- Penetration test: attempt to extract sensitive data from log streams — must fail.

### EG-05: Document All Architectural Decisions

**Description:** Every significant technical choice must have a documented rationale, demonstrating intentionality and systems thinking.

**Measurable Outcomes:**
- [ ] Architecture Decision Records (ADRs) for: framework choice, database selection, vector store choice, real-time protocol choice, deployment strategy.
- [ ] Trade-off analysis included: "We chose X over Y because Z, accepting trade-off W."
- [ ] ADRs stored in version control and referenced in module documentation.

**Validation Method:**
- Review `docs/adr/` directory for completeness.
- Peer review: can another engineer understand why each decision was made?

---

## 5. User Experience Goals

User experience goals govern how visitors feel, think, and behave while interacting with the platform.

### UXG-01: Minimize Cognitive Load

**Description:** Visitors should never feel lost, overwhelmed, or confused. Information and controls must be organized intuitively.

**Measurable Outcomes:**
- [ ] Navigation schema has ≤ 7 top-level items (Miller's Law).
- [ ] Every interactive page has a clear primary action visible above the fold.
- [ ] Tooltips or helper text explain technical terms on first encounter.
- [ ] Time to understand what a page does < 5 seconds for first-time visitors.

**Validation Method:**
- First-click testing: show page for 5 seconds; ask "What would you click first?"
- Heatmap analysis of visitor interactions.

### UXG-02: Provide Immediate Feedback for Every Action

**Description:** Users must always know whether their action was received, is being processed, succeeded, or failed.

**Measurable Outcomes:**
- [ ] All buttons have active/loading/disabled states.
- [ ] API calls display optimistic UI updates where applicable.
- [ ] Error states explain what happened and how to recover.
- [ ] No action leaves the user wondering for > 500ms without feedback.

**Validation Method:**
- Interaction audit: click every button, submit every form; verify feedback.
- Performance profiling: measure time from interaction to visual feedback.

### UXG-03: Ensure Accessibility for All Visitors

**Description:** The platform must be usable by visitors with disabilities, demonstrating inclusive engineering practice.

**Measurable Outcomes:**
- [ ] WCAG 2.1 AA compliance achieved.
- [ ] All interactive elements keyboard-navigable.
- [ ] Color contrast ratios ≥ 4.5:1 for normal text, ≥ 3:1 for large text.
- [ ] Screen reader labels for all icons, charts, and visualizations.
- [ ] Reduced motion support for animations.

**Validation Method:**
- Automated axe-core scans in CI.
- Manual screen reader testing (NVDA / VoiceOver).

### UXG-04: Optimize for the "Impatient Evaluator"

**Description:** The most important visitor — the busy CTO or recruiter — must extract value within 60 seconds.

**Measurable Outcomes:**
- [ ] Hero section communicates value proposition in < 10 seconds of reading.
- [ ] First interactive element accessible within 2 clicks from landing page.
- [ ] Key metrics (latency, uptime, active users) visible on landing page or dashboard.
- [ ] "Wow moment" — an impressive, unexpected interaction — occurs within first 60 seconds.

**Validation Method:**
- Timed user testing: "You have 60 seconds to decide if this engineer is senior-level. Go."
- Session recording analysis: where do visitors drop off in the first minute?

### UXG-05: Create a Sense of "Admin Access"

**Description:** Visitors should feel they have been granted privileged access to a real production system, not a sanitized demo.

**Measurable Outcomes:**
- [ ] Live logs stream real backend events, not pre-recorded samples.
- [ ] Metrics fluctuate based on actual traffic, not static mock data.
- [ ] API Explorer allows real endpoint invocation with real responses.
- [ ] Terminal / dashboard aesthetic reinforces "developer tool" positioning.

**Validation Method:**
- User survey: "Did this feel like a real system or a mockup?"
- Verify that logs and metrics change in response to your own actions.

---

## 6. Business Goals

Business goals translate platform success into tangible career outcomes. Unlike SaaS business goals, these focus on **reputation, network, and opportunity generation.**

### BG-01: Generate Inbound Career Opportunities

**Description:** The platform must convert visitors into professional connections — LinkedIn connections, interview invitations, collaboration inquiries.

**Measurable Outcomes:**
- [ ] LinkedIn profile click-through rate > 5% of unique visitors.
- [ ] Email contact form submissions > 2% of unique visitors.
- [ ] GitHub profile visits referred from platform tracked via UTM.
- [ ] At least one inbound opportunity (interview, contract, speaking invite) attributable to platform per quarter.

**Validation Method:**
- UTM-tagged outbound links with click tracking.
- Self-reported attribution: "How did you hear about me?"

### BG-02: Establish Thought Leadership in AI Systems Engineering

**Description:** The platform and its documentation should be referenced by peers, cited in discussions, and recognized as a benchmark.

**Measurable Outcomes:**
- [ ] GitHub repository stars trend upward; referenced in engineering discussions.
- [ ] Technical blog posts / threads about platform architecture receive engagement.
- [ ] Peer engineers explicitly mention the platform as inspiration for their own portfolios.
- [ ] Speaking or writing invitations related to platform topics.

**Validation Method:**
- Social listening: mentions of the platform or its architecture on LinkedIn, X, Hacker News.
- GitHub insights: traffic sources, referrers, clone counts.

### BG-03: Demonstrate Product-Minded Engineering

**Description:** The platform must prove that the builder thinks like a product engineer — balancing technical excellence with user needs, business constraints, and time-to-value.

**Measurable Outcomes:**
- [ ] Clear non-goals documented and adhered to (no feature creep).
- [ ] Onboarding flow optimized for conversion, not just technical correctness.
- [ ] Cost constraints visibly influence design decisions (model tiering, caching, rate limits).
- [ ] User feedback incorporated into iteration post-launch.

**Validation Method:**
- Review of commit history: are non-scope features rejected?
- Post-launch survey: "What would you change?" — responses acted upon.

### BG-04: Build a Reusable Foundation for Future Projects

**Description:** The codebase and infrastructure should serve as a launchpad for future products, not a one-off throwaway.

**Measurable Outcomes:**
- [ ] Modular architecture allows new AI modules to be added with < 200 lines of boilerplate.
- [ ] Infrastructure as Code (Terraform / Pulumi) enables new environment provisioning in < 30 minutes.
- [ ] CI/CD pipeline reusable for other projects with minimal modification.
- [ ] Documentation quality sufficient for another engineer to onboard in < 1 day.

**Validation Method:**
- Time-boxed challenge: add a hypothetical new module (e.g., speech-to-text) and measure time to functional prototype.
- New developer onboarding simulation: give repo to peer, ask them to deploy locally, measure time.

---

## 7. Goal Interdependency Map

Goals do not exist in isolation. Achieving one often unlocks or enables another.

```
Primary Goals
    |
    ├── PG-01 (Live Demos) ──> SG-03 (Advanced Workflows)
    |                |
    |                └──> EG-01 (Test Coverage)
    |
    ├── PG-02 (Observability) ──> UXG-05 (Admin Access Feel)
    |                   |
    |                   └──> EG-04 (Structured Logging)
    |
    ├── PG-03 (Zero Friction) ──> UXG-04 (Impatient Evaluator)
    |                   |
    |                   └──> BG-01 (Inbound Opportunities)
    |
    └── PG-04 (End-to-End) ──> EG-03 (Stateless Design)
                        |
                        └──> EG-05 (Documented Decisions)

Secondary Goals
    |
    ├── SG-01 (Educational Value) ──> BG-02 (Thought Leadership)
    ├── SG-02 (Cost Awareness) ──> BG-03 (Product-Minded Engineering)
    └── SG-04 (Visual Polish) ──> UXG-01 (Cognitive Load)
                            └──> BG-01 (Inbound Opportunities)
```

---

## 8. Measurement & Validation

### 8.1 Goal Tracking Dashboard

| Goal ID | Metric | Target | Measurement Tool | Review Frequency |
|---------|--------|--------|------------------|-----------------|
| PG-01 | Module interactivity score | 100% | Manual audit | Per release |
| PG-02 | Metrics visibility count | ≥ 8 | Dashboard inspection | Continuous |
| PG-03 | First interaction time | < 30s | Analytics funnel | Weekly |
| PG-04 | Security audit pass rate | 100% | Penetration test | Per release |
| SG-01 | Documentation page views | Trending up | Analytics | Monthly |
| SG-02 | Cache hit ratio | ≥ 30% | Prometheus | Weekly |
| SG-03 | Workflow completion rate | > 80% | Application logs | Monthly |
| SG-04 | Lighthouse score | ≥ 90 | Lighthouse CI | Per commit |
| EG-01 | Test coverage | ≥ 70% | pytest-cov / istanbul | Per commit |
| EG-02 | Unhandled 500 count | 0 | Error tracking | Weekly |
| EG-03 | Horizontal scaling test | Pass | Infrastructure test | Per release |
| EG-04 | Log schema compliance | 100% | JSON Schema validation | Per commit |
| EG-05 | ADR completeness | 5+ records | Documentation audit | Monthly |
| UXG-01 | Navigation clarity score | > 80% | First-click test | Monthly |
| UXG-02 | Feedback latency | < 500ms | Performance profiling | Per commit |
| UXG-03 | Accessibility score | ≥ 90 | axe-core | Per commit |
| UXG-04 | "Wow moment" timing | < 60s | User testing | Monthly |
| UXG-05 | "Real system" perception | > 80% | User survey | Monthly |
| BG-01 | LinkedIn CTR | > 5% | UTM analytics | Monthly |
| BG-02 | Repository stars | Trending up | GitHub Insights | Monthly |
| BG-03 | Feature creep incidents | 0 | Commit review | Monthly |
| BG-04 | New module boilerplate | < 200 LOC | Time-boxed challenge | Quarterly |

### 8.2 Definition of Done (Per Goal)

For any goal to be considered achieved:

1. **Measurable outcome is met** — quantitative target reached and sustained for ≥ 2 weeks.
2. **Evidence is documented** — screenshots, metrics, test reports, or user feedback archived.
3. **Peer validation obtained** — at least one independent review confirms the outcome.
4. **Regression protection in place** — CI checks, monitoring alerts, or tests prevent backsliding.

---

*This document is a living artifact. Goals may be refined, added, or retired as the product evolves. Any change must be justified in the context of the Product Vision Document.*
