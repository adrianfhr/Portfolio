# User Personas & Journey Maps

> **Project:** Interactive AI Engineering Portfolio & Sandbox
> **Version:** 1.0
> **Owner:** Adrian Fahri Affandi
> **Role:** Senior Fullstack AI / Systems Engineer
> **Last Updated:** 2026-05-06

---

## Table of Contents

1. [Persona Overview](#1-persona-overview)
2. [Persona 1: The Busy CTO / VP of Engineering](#2-persona-1-the-busy-cto--vp-of-engineering)
3. [Persona 2: The Technical Recruiter](#3-persona-2-the-technical-recruiter)
4. [Persona 3: The Startup Founder / Potential B2B Client](#4-persona-3-the-startup-founder--potential-b2b-client)
5. [Persona 3: The Peer Engineer](#5-persona-4-the-peer-engineer)
6. [Cross-Persona Comparison Matrix](#6-cross-persona-comparison-matrix)
7. [Emotional Journey Summary](#7-emotional-journey-summary)

---

## 1. Persona Overview

The platform is designed for four distinct user archetypes. While their goals differ, they share a common trait: **they are evaluating the builder's competence.** The platform must satisfy each evaluator's criteria within their respective time and attention constraints.

| # | Persona | Role | Time Budget | Risk Tolerance | Decision Authority |
|---|---------|------|-------------|----------------|-------------------|
| 1 | The Busy CTO / VP of Engineering | Hiring manager, technical leader | 5–10 minutes | Low — one bad hire is expensive | High — can approve hire directly |
| 2 | The Technical Recruiter | Talent acquisition (technical background) | 3–5 minutes | Medium — screens many candidates | Medium — recommends, does not decide |
| 3 | The Startup Founder / B2B Client | Potential collaborator or client | 5–15 minutes | Medium — evaluating fit for project | High — can engage for contract/work |
| 4 | The Peer Engineer | Fellow developer, potential referrer | 10–30 minutes | High — exploring for learning | Low — may refer, rarely decides |

---

## 2. Persona 1: The Busy CTO / VP of Engineering

### 2.1 Profile

| Attribute | Detail |
|-----------|--------|
| **Name** | Alexandra Chen |
| **Age** | 42 |
| **Role** | VP of Engineering at a Series B AI startup |
| **Reports To** | CTO / CEO |
| **Team Size** | 35 engineers across Platform, ML, and Product |
| **Technical Depth** | Expert — 20 years in distributed systems, previously Staff Engineer at FAANG |
| **Hiring Context** | Looking for a Senior Fullstack AI Engineer to lead a new RAG product line |
| **Time Budget** | 5–10 minutes per candidate portfolio; reviews 20+ portfolios per week |
| **Evaluation Criteria** | System architecture, scalability mindset, operational maturity, cost awareness, security posture |
| **Pain Points** | Most portfolios are frontend showcases; candidates claim AI skills but show no evidence of handling production complexity |
| **Success Signal** | Can this person architect, build, and operate a system that survives real traffic and real users? |

### 2.2 Needs

- **Speed of evaluation:** Needs to form a confident hiring signal within minutes, not hours.
- **Depth over breadth:** Prefers deep evidence in one area over shallow evidence in ten areas.
- **Systems thinking:** Wants to see how components interact, not isolated features.
- **Operational awareness:** Looks for observability, monitoring, alerting, and incident response considerations.
- **Trade-off documentation:** Wants to know *why* decisions were made, not just *what* was built.

### 2.3 Pain Points

| Pain Point | Why It Hurts |
|-----------|-------------|
| Static portfolios with only UI screenshots | Cannot assess backend competence, which is critical for the role |
| Claims like "built a chatbot" with no demo | Indistinguishable from a 50-line OpenAI wrapper |
| No evidence of cost optimization | Suggests the candidate has never operated under real budget constraints |
| Missing security considerations | Red flag for production systems handling user data |
| No observability or logging | Indicates lack of operational experience; systems run blind |

### 2.4 Favorite Features

1. **Monitoring Dashboard** — immediately validates that the builder thinks about production metrics.
2. **Live Logs Terminal** — proves structured logging discipline and operational transparency.
3. **System Architecture Diagram** — reveals how well the candidate understands component boundaries and data flow.
4. **Rate Limiting & Auth Implementation** — signals security awareness and gateway-level thinking.
5. **API Explorer with OpenAPI** — demonstrates API design maturity and developer-experience focus.

### 2.5 Detailed User Journey

| Stage | Action | Emotional State | Targeting Strategy |
|-------|--------|-----------------|--------------------|
| **Discovery** | Receives portfolio link via LinkedIn or referral | Skeptical — "Another portfolio to slog through" | Hero headline must disrupt skepticism: "Production-Grade AI Systems, Not Wrapper Scripts" |
| **First 10 Seconds** | Lands on page; scans hero section | Curious — "This looks different from the usual" | Dark-mode developer-tool aesthetic; live metric counter visible immediately |
| **10–30 Seconds** | Clicks to Monitoring Dashboard | Intrigued — "They actually exposed metrics?" | Real-time SSE metrics with latency histograms; no mock data |
| **30–60 Seconds** | Opens Live Logs; observes backend activity | Impressed — "This is what I see in my own systems" | Structured JSON logs with trace IDs; log levels color-coded; auto-scrolling terminal feel |
| **1–3 Minutes** | Explores API Explorer; inspects endpoint schemas | Evaluating — "The API design is clean" | Explicit response models, error documentation, rate limit headers visible |
| **3–5 Minutes** | Reads architecture explanation or ADRs | Convinced — "They documented their trade-offs" | ADRs linked from architecture page; clear "Why Qdrant over Pinecone" rationale |
| **5–7 Minutes** | Tests chatbot or vision demo briefly | Validating — "The demos actually work" | Interactive elements respond instantly; no broken flows |
| **7–10 Minutes** | Clicks LinkedIn / Email CTA | Committed — "I need to talk to this person" | CTA prominent but not aggressive; contextual based on journey depth |

### 2.6 Emotional Targeting

| Emotion | How the Platform Evokes It |
|---------|---------------------------|
| **Confidence** | Transparent metrics and logs signal "I have nothing to hide because the system is solid." |
| **Respect** | Architecture documentation and trade-off analysis show intellectual honesty and depth. |
| **Urgency** | The platform's polish creates FOMO — "If I don't move fast, someone else will hire them." |

---

## 3. Persona 2: The Technical Recruiter

### 3.1 Profile

| Attribute | Detail |
|-----------|--------|
| **Name** | Marcus Johnson |
| **Age** | 34 |
| **Role** | Senior Technical Recruiter at a venture-backed tech company |
| **Background** | Computer Science degree; 8 years in recruiting; codes on weekends |
| **Hiring Context** | Sourcing for 3 open roles: Senior AI Engineer, Fullstack Engineer, ML Platform Engineer |
| **Time Budget** | 3–5 minutes per candidate; screens 50+ candidates per week |
| **Evaluation Criteria** | Can verify claimed skills quickly; looks for specificity over generic buzzwords |
| **Pain Points** | Candidates inflate resumes; difficult to distinguish genuine expertise from keyword stuffing |
| **Success Signal** | Can confidently recommend or reject a candidate within 5 minutes of review |

### 3.2 Needs

- **Rapid skill verification:** Needs to confirm that listed skills (FastAPI, RAG, vector search, WebSockets) are real.
- **Concrete evidence:** Prefers demos and metrics over textual claims.
- **Simplicity:** Does not need to understand all technical details — needs enough to know the candidate does.
- **Shareability:** Needs to present findings to hiring managers with confidence.
- **Anti-fraud signals:** Looks for signs that the work is original and not copy-pasted.

### 3.3 Pain Points

| Pain Point | Why It Hurts |
|-----------|-------------|
| Resume keyword inflation | Cannot trust claims like "expert in LangChain" without proof |
| GitHub repos with no README | Too time-consuming to reverse-engineer what a project does |
| Portfolio demos that don't work | Broken demos suggest carelessness or deception |
| No metrics or outcomes | Cannot quantify the candidate's impact or competence |
| Vague project descriptions | "Built an AI app" tells nothing about scope or complexity |

### 3.4 Favorite Features

1. **Interactive Chatbot** — immediate proof of RAG, LLM integration, and streaming.
2. **Face Recognition Demo** — immediate proof of computer vision and ML pipeline skills.
3. **API Explorer** — verifies REST API design and documentation skills.
4. **Live Metrics** — provides quantifiable evidence of system performance.
5. **GitHub Integration** — links to source code for deeper inspection if needed.

### 3.5 Detailed User Journey

| Stage | Action | Emotional State | Targeting Strategy |
|-------|--------|-----------------|--------------------|
| **Discovery** | Finds portfolio via LinkedIn post or candidate application | Neutral — "Let me quickly verify this person's claims" | Clean, fast-loading page; no pop-ups or distractions |
| **First 10 Seconds** | Skims hero; clicks first interactive element (usually Chat) | Curious — "Let's see if the chatbot actually works" | Chat interface loads instantly; pre-loaded welcome message invites interaction |
| **10–30 Seconds** | Types a test question; observes streaming response | Surprised — "It's responding in real time with sources" | Citations visible; source chunks linked; response quality demonstrates depth |
| **30–60 Seconds** | Uploads an image to Face Recognition | Intrigued — "Computer vision too?" | Bounding boxes render instantly; confidence scores displayed; gallery matching works |
| **1–2 Minutes** | Checks API Explorer; reads endpoint descriptions | Validating — "The API contracts look professional" | Swagger UI with try-it functionality; clear schema descriptions |
| **2–3 Minutes** | Glances at Monitoring Dashboard | Confirming — "There's real infrastructure behind this" | Live-updating charts; no placeholder data |
| **3–5 Minutes** | Copies LinkedIn profile link or sends to hiring manager | Satisfied — "This candidate checks out; I'll recommend them" | Clear CTA; easy to share URL with UTM tracking for attribution |

### 3.6 Emotional Targeting

| Emotion | How the Platform Evokes It |
|---------|---------------------------|
| **Credibility** | Working demos with visible metrics replace doubt with confidence. |
| **Efficiency** | Rapid verification means the recruiter can move on to the next candidate feeling accomplished. |
| **Trust** | Transparency (logs, metrics, open API docs) signals honesty — no hiding behind vague descriptions. |

---

## 4. Persona 3: The Startup Founder / Potential B2B Client

### 4.1 Profile

| Attribute | Detail |
|-----------|--------|
| **Name** | Priya Sharma |
| **Age** | 36 |
| **Role** | Founder & CEO of an early-stage SaaS startup |
| **Background** | Product management at a unicorn; left to build AI-powered customer support tool |
| **Hiring Context** | Needs a technical co-founder or senior contractor to build AI infrastructure |
| **Time Budget** | 5–15 minutes; may return for deeper exploration if initial impression is strong |
| **Evaluation Criteria** | Can this person translate business needs into functional products? Are they cost-aware? Can they ship? |
| **Pain Points** | Previous contractors over-engineered solutions; hidden costs ballooned; lack of communication |
| **Success Signal** | Feels confident that this person can own the technical domain while respecting business constraints |

### 4.2 Needs

- **Product-thinking evidence:** Wants to see that technical decisions serve user needs, not just engineering elegance.
- **Cost transparency:** Needs reassurance that the builder understands budget constraints.
- **Shipping velocity:** Looks for a balance between quality and speed — can they deliver an MVP?
- **Communication clarity:** Wants architecture explained in terms a non-expert can grasp.
- **End-to-end ownership:** Prefers candidates who can handle frontend, backend, AI, and infrastructure.

### 4.3 Pain Points

| Pain Point | Why It Hurts |
|-----------|-------------|
| Over-engineering | Previous hires built microservices for a product with 10 users; wasted months |
| Hidden costs | LLM API bills spiraled because no one tracked token usage or implemented caching |
| Poor communication | Engineers explained technical decisions in impenetrable jargon |
| Narrow expertise | Frontend specialist who couldn't touch backend; ML specialist who couldn't deploy |
| Unreliable delivery | Promised features that never materialized or broke in production |

### 4.4 Favorite Features

1. **Guest Tier Onboarding** — proves the builder understands user acquisition and friction reduction.
2. **Token Cost Display** — demonstrates cost awareness and transparency in AI operations.
3. **AI Playground** — shows product-minded iteration on a core feature (model comparison, parameter tuning).
4. **Workflow Automation** — proves ability to build end-to-end user-facing products, not just demos.
5. **Admin Panel** — signals understanding of operational tools and internal user needs.

### 4.5 Detailed User Journey

| Stage | Action | Emotional State | Targeting Strategy |
|-------|--------|-----------------|--------------------|
| **Discovery** | Referred by mutual connection or discovered via social media | Cautiously optimistic — "Could this be the technical partner I need?" | Landing page emphasizes "built to ship, not just to demo" |
| **First 30 Seconds** | Observes guest onboarding — no registration required | Relieved — "I don't have to create an account to evaluate" | Guest ID issued automatically; first interactive element visible immediately |
| **30 Seconds–2 Minutes** | Uses Chatbot and checks token cost per response | Impressed — "They're tracking costs openly — that's rare" | Cost displayed prominently but unobtrusively; cumulative spend tracker visible |
| **2–5 Minutes** | Explores AI Playground; compares model outputs | Evaluating — "They understand that different models serve different needs" | Side-by-side comparison with clear parameter controls; export functionality |
| **5–8 Minutes** | Views Workflow Automation or Multi-Agent | Convinced — "This person can build products, not just scripts" | Visual workflow builder; saved workflows; execution history |
| **8–12 Minutes** | Reads about architecture or non-goals | Trusting — "They know what not to build — that's wisdom" | Non-goals prominently documented; trade-off explanations in plain language |
| **12–15 Minutes** | Reaches out via email or schedules a call | Committed — "This is who I want to build with" | Contact CTA with Calendly integration; clear value proposition in outreach context |

### 4.6 Emotional Targeting

| Emotion | How the Platform Evokes It |
|---------|---------------------------|
| **Relief** | Transparent costs and clear scope boundaries mean "I won't get surprised by bills or delays." |
| **Aspiration** | The platform's polish makes the founder think, "My product could look and work like this." |
| **Trust** | Documented non-goals and trade-offs show maturity — "This person thinks before they build." |

---

## 5. Persona 4: The Peer Engineer

### 5.1 Profile

| Attribute | Detail |
|-----------|--------|
| **Name** | David Okafor |
| **Age** | 29 |
| **Role** | Senior Software Engineer at a mid-size tech company |
| **Background** | Fullstack engineer with growing interest in AI systems; self-taught ML |
| **Context** | Building his own portfolio; studying reference architectures; looking for patterns to adopt |
| **Time Budget** | 10–30 minutes; may return multiple times; may read documentation deeply |
| **Evaluation Criteria** | Code quality, architectural decisions, technology choices, edge case handling, trade-off reasoning |
| **Pain Points** | Most portfolios are superficial; difficult to find production-quality reference implementations |
| **Success Signal** | Learns something new or finds a pattern worth adopting in their own work |

### 5.2 Needs

- **Implementation depth:** Wants to see actual code, not just high-level descriptions.
- **Architectural reasoning:** Needs to understand *why* Qdrant over Pinecone, *why* SSE over WebSocket for chat, etc.
- **Edge case handling:** Looks for graceful failure modes, retries, circuit breakers, and fallbacks.
- **Performance data:** Wants real benchmarks, not marketing claims.
- **Reproducibility:** Should be able to clone, run, and experiment with the system locally.

### 5.3 Pain Points

| Pain Point | Why It Hurts |
|-----------|-------------|
| Black-box demos | Cannot inspect how something works; no source code access |
| No documentation of trade-offs | Cannot learn from decisions if rationale is missing |
| Toy implementations | Code works for the happy path but collapses under real load |
| Outdated tech stack | Uses technologies that are deprecated or not industry-standard |
| No local development setup | Cannot run the system locally to experiment and learn |
| Missing tests | Cannot trust that the code is reliable or maintainable |

### 5.4 Favorite Features

1. **Live Logs Terminal** — inspects log structure, trace correlation, and error handling.
2. **API Explorer** — studies endpoint design, request/response schemas, and error patterns.
3. **System Architecture Diagram** — traces data flow and understands component boundaries.
4. **GitHub Repository** — reads source code, tests, and CI/CD configuration.
5. **Architecture Decision Records (ADRs)** — learns from documented trade-offs and reasoning.
6. **Vector Search Demo** — inspects embedding strategies, index parameters, and retrieval logic.

### 5.5 Detailed User Journey

| Stage | Action | Emotional State | Targeting Strategy |
|-------|--------|-----------------|--------------------|
| **Discovery** | Finds portfolio via Hacker News, GitHub, or Twitter | Excited — "A portfolio by an engineer, for engineers" | Minimal marketing language; dense technical content prominently displayed |
| **First 2 Minutes** | Skims landing; immediately clicks Architecture or Logs | Focused — "Show me how it's built" | Architecture diagram interactive; links to ADRs and module docs |
| **2–5 Minutes** | Reads ADRs; inspects technology choices | Analytical — "Interesting choice of Qdrant over Weaviate" | ADRs include comparison tables, benchmarks, and explicit trade-off acceptance |
| **5–10 Minutes** | Clones repository; attempts local setup | Engaged — "Let's see if this actually runs" | `docker-compose up` starts full stack; README includes troubleshooting |
| **10–15 Minutes** | Runs tests; inspects code structure | Evaluating — "The test coverage is solid; code is clean" | `pytest` and `npm test` run out of the box; coverage report generated |
| **15–20 Minutes** | Triggers edge cases: kills Redis, sends malformed input, exceeds rate limit | Testing — "How does it handle failure?" | Graceful degradation visible; error messages informative; no unhandled crashes |
| **20–30 Minutes** | Returns to platform; interacts with advanced features | Respectful — "This is a reference implementation" | Advanced features (workflows, custom vector collections) reward deeper exploration |
| **Post-Visit** | Stars repository; shares on social media; adopts patterns | Advocating — "Everyone should see this" | GitHub star button prominent; shareable architecture snippets |

### 5.6 Emotional Targeting

| Emotion | How the Platform Evokes It |
|---------|---------------------------|
| **Respect** | Edge case handling and documented trade-offs show the builder is a serious engineer, not a hobbyist. |
| **Gratitude** | Open source, well-documented, locally runnable code feels like a gift to the community. |
| **Inspiration** | The platform's depth makes the peer think, "I want my portfolio to be this thorough." |

---

## 6. Cross-Persona Comparison Matrix

| Dimension | CTO / VP Eng | Technical Recruiter | Startup Founder | Peer Engineer |
|-----------|-------------|--------------------|-----------------|---------------|
| **Primary Goal** | Assess production readiness | Verify skill claims | Evaluate product-thinking | Learn and study |
| **Time Budget** | 5–10 min | 3–5 min | 5–15 min | 10–30 min |
| **Key Pages** | Dashboard, Logs, Architecture | Chat, Vision, API Explorer | Playground, Workflow, Onboarding | Architecture, Logs, GitHub |
| **Decision Type** | Hire / Don't hire | Recommend / Reject | Engage / Pass | Star / Share / Ignore |
| **Risk Sensitivity** | High | Medium | Medium | Low |
| **Technical Depth Needed** | Expert | Intermediate | Variable | Expert |
| **Emotional Win** | Confidence | Credibility | Trust | Respect |
| **KPI to Optimize** | Architecture page time | Interaction depth | Onboarding completion | Return visit rate |

---

## 7. Emotional Journey Summary

The platform is designed to guide every persona through a predictable emotional arc:

```
Skepticism / Neutral
        |
        v
Curiosity (hooked by design or headline)
        |
        v
Intrigue (first interaction works unexpectedly well)
        |
        v
Validation (evidence accumulates: metrics, logs, architecture)
        |
        v
Conviction (enough proof to form a positive judgment)
        |
        v
Action (click CTA, send email, schedule call, share, star)
```

### 7.1 Persona-Specific Emotional Targets

| Persona | Emotional Peak Moment | Where It Happens |
|---------|----------------------|------------------|
| CTO | Seeing live logs with trace IDs stream in real time | Live Logs Terminal |
| Recruiter | Watching the chatbot cite sources while streaming | Chatbot Interface |
| Founder | Noticing token cost displayed next to every AI response | Chatbot / Playground |
| Peer Engineer | Reading an ADR that honestly accepts a significant trade-off | Architecture Documentation |

### 7.2 Anti-Patterns to Avoid

| Anti-Pattern | Impact on Personas |
|-------------|--------------------|
| Broken demos | Recruiter rejects immediately; Founder loses trust; Peer loses respect |
| Mock data in metrics | CTO detects inauthenticity; Peer dismisses as toy |
| Aggressive CTAs before value delivery | All personas feel pressured and bounce |
| Missing error handling | Peer tests edge cases and finds crashes; CTO questions maturity |
| No documentation of decisions | Peer cannot learn; CTO questions intentionality |
| Slow first load | Recruiter abandons before first interaction |

---

*This document is a living artifact. As user testing data becomes available, journeys should be refined and emotional targeting adjusted based on observed behavior.*
