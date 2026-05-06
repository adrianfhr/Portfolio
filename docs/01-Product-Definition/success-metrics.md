# Success Metrics & KPIs

> **Project:** Interactive AI Engineering Portfolio & Sandbox
> **Version:** 1.0
> **Owner:** Adrian Fahri Affandi
> **Role:** Senior Fullstack AI / Systems Engineer
> **Last Updated:** 2026-05-06

---

## Table of Contents

1. [Measurement Philosophy](#1-measurement-philosophy)
2. [Engagement Metrics](#2-engagement-metrics)
3. [Performance Metrics](#3-performance-metrics)
4. [Business Metrics](#4-business-metrics)
5. [Technical Metrics](#5-technical-metrics)
6. [Quality Metrics](#6-quality-metrics)
7. [Measurement Methodology](#7-measurement-methodology)
8. [Targets per Phase](#8-targets-per-phase)
9. [Dashboard Requirements](#9-dashboard-requirements)
10. [Metric Ownership & Review Cadence](#10-metric-ownership--review-cadence)

---

## 1. Measurement Philosophy

Success for this platform is measured across six dimensions. Unlike a commercial SaaS where revenue is the ultimate metric, this portfolio's success is defined by **evidence generation, engagement depth, and opportunity conversion.**

### 1.1 Guiding Principles

| Principle | Application |
|-----------|-------------|
| **Measure what matters to evaluators** | Metrics should reflect what CTOs, recruiters, and founders care about — latency, uptime, transparency — not vanity metrics like page views. |
| **Quantify the qualitative** | "Impressive portfolio" is subjective; "P95 latency of 340ms" is objective and verifiable. |
| **Instrument before optimizing** | Every metric must have a measurement tool in place before targets are set. |
| **Segment by persona** | Aggregate metrics hide insight; segment by traffic source, user tier, and module to understand who engages how. |
| **Trend over absolute** | A single data point is noise; targets focus on sustained trends over 7-day and 30-day windows. |

### 1.2 Metric Classification

| Dimension | Purpose | Primary Stakeholder |
|-----------|---------|--------------------|
| Engagement | Are visitors interacting deeply with the platform? | Product Owner |
| Performance | Is the platform fast and reliable? | Engineering |
| Business | Is the platform generating career opportunities? | Product Owner |
| Technical | Is the system healthy, secure, and efficient? | Engineering |
| Quality | Is the code and UX meeting professional standards? | Engineering + Design |

---

## 2. Engagement Metrics

Engagement metrics answer: **Are visitors actually using the platform, or just browsing?**

### 2.1 Core Engagement Metrics

| Metric ID | Metric Name | Definition | Formula | Target | Measurement Tool |
|-----------|-------------|-----------|---------|--------|------------------|
| ENG-01 | Average Session Duration | Mean time from first page load to last activity | `SUM(session_durations) / COUNT(sessions)` | > 3 minutes | Plausible / GA4 |
| ENG-02 | Interaction Depth | Average number of API calls initiated per unique visitor | `SUM(api_calls) / COUNT(unique_visitors)` | > 5 calls | API Gateway Logs |
| ENG-03 | Module Penetration Rate | % of visitors who interact with >= 2 distinct modules | `COUNT(visitors_with_2plus_modules) / COUNT(total_visitors)` | > 40% | Analytics + API Logs |
| ENG-04 | Return Visit Rate | % of visitors who return within 7 days | `COUNT(returning_visitors_7d) / COUNT(total_visitors_7d)` | > 15% | Plausible / GA4 |
| ENG-05 | Feature Discovery Rate | % of visitors who find and use non-obvious features (e.g., API Explorer, ADRs) | `COUNT(discovery_events) / COUNT(total_sessions)` | > 20% | Event Tracking |
| ENG-06 | Chat Message Depth | Average messages per chat session | `SUM(chat_messages) / COUNT(chat_sessions)` | > 3 messages | Application DB |
| ENG-07 | Vision Upload Rate | % of visitors who upload at least one image | `COUNT(uploaders) / COUNT(total_visitors)` | > 25% | Application DB |
| ENG-08 | Playground Comparison Usage | % of Playground users who run side-by-side comparison | `COUNT(comparison_users) / COUNT(playground_users)` | > 30% | Application DB |

### 2.2 Engagement Funnel

```
Landing Page Load (100%)
    |
    v
First Interaction -- clicks any button or link (Target: > 80%)
    |
    v
First API Call -- triggers backend computation (Target: > 60%)
    |
    v
Second Module -- explores beyond first feature (Target: > 40%)
    |
    v
Deep Engagement -- spends > 3 minutes or > 5 API calls (Target: > 25%)
    |
    v
Conversion -- clicks CTA, returns later, or shares (Target: > 10%)
```

### 2.3 Engagement by Persona (Proxy Segmentation)

| Proxy Signal | Likely Persona | Expected Engagement Pattern |
|-------------|---------------|---------------------------|
| Lands on `/metrics` or `/logs` first | CTO / Peer Engineer | High depth, multiple modules, long session |
| Lands on `/chat` or `/vision` first | Recruiter | Quick interaction, 1-2 modules, medium session |
| Lands on `/playground` or `/agents` first | Founder | Explores workflows and cost features, medium depth |
| Direct traffic to GitHub or `/docs` | Peer Engineer | Highest depth, return visits, documentation time |

---

## 3. Performance Metrics

Performance metrics answer: **Is the platform fast, reliable, and cost-efficient?**

### 3.1 User-Facing Latency Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| PERF-01 | Chatbot TTFT (Time to First Token) | Time from chat submission to first SSE chunk | < 1.5s | Prometheus Histogram |
| PERF-02 | Chat Streaming Throughput | Tokens delivered per second after TTFT | > 10 tokens/s | Application Instrumentation |
| PERF-03 | API P50 Latency | Median response time for all API endpoints | < 200ms | Prometheus Histogram |
| PERF-04 | API P95 Latency | 95th percentile response time | < 500ms | Prometheus Histogram |
| PERF-05 | API P99 Latency | 99th percentile response time | < 1s | Prometheus Histogram |
| PERF-06 | Vision Inference Latency (GPU) | End-to-end face recognition on GPU | < 500ms | Application Metrics |
| PERF-07 | Vision Inference Latency (CPU) | End-to-end face recognition on CPU | < 2s | Application Metrics |
| PERF-08 | Vector Search Latency (Top-10) | Semantic search retrieval time | < 200ms | Qdrant Metrics + App Instrumentation |
| PERF-09 | Log Broadcast Delay | Time from log emission to WebSocket client receipt | < 500ms | Synthetic Trace Testing |
| PERF-10 | Metrics SSE Interval | Time between SSE pushes on dashboard | 2-3s | Client-Side Measurement |
| PERF-11 | Page Load Time (LCP) | Largest Contentful Paint on landing page | < 2.5s | Lighthouse / Web Vitals |
| PERF-12 | Time to Interactive (TTI) | Time until page is fully interactive | < 3.5s | Lighthouse / Web Vitals |

### 3.2 System Health Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| PERF-13 | System Uptime | Platform availability over trailing 30 days | 99.9% | UptimeRobot / Pingdom |
| PERF-14 | Error Rate | % of API requests returning 5xx status | < 0.1% | Prometheus Counter |
| PERF-15 | WebSocket Connection Stability | % of WebSocket connections lasting > 5 minutes without drop | > 95% | Application Metrics |
| PERF-16 | Redis Availability | Redis connection success rate | > 99.9% | Redis INFO + Prometheus |
| PERF-17 | PostgreSQL Connection Pool Saturation | % of max connections in use | < 80% | PostgreSQL Stats + Prometheus |
| PERF-18 | Qdrant Response Time | P99 response time for vector operations | < 100ms | Qdrant Metrics |

### 3.3 Cost Efficiency Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| PERF-19 | Cost Per Visitor | Total infra + API cost / unique visitors per month | Trending down | Cloud Provider Billing + Analytics |
| PERF-20 | Token Cost Per Chat | Average OpenAI spend per chat session | < $0.05 | OpenAI API Usage + Application DB |
| PERF-21 | Cache Hit Ratio | % of cacheable requests served from Redis | > 40% | Redis INFO + Prometheus |
| PERF-22 | Worker Queue Efficiency | % of Celery tasks completed without retry | > 98% | Celery Flower + Prometheus |

---

## 4. Business Metrics

Business metrics answer: **Is the platform advancing the owner's career?**

### 4.1 Conversion Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| BUS-01 | LinkedIn CTR | % of unique visitors clicking LinkedIn profile link | > 5% | UTM Tracking + Plausible |
| BUS-02 | Email Contact Rate | % of unique visitors submitting contact form | > 2% | Form Submission Tracking |
| BUS-03 | GitHub Profile CTR | % of unique visitors clicking GitHub profile link | > 3% | UTM Tracking |
| BUS-04 | Resume Download Rate | % of visitors downloading PDF resume | > 1% | Event Tracking |
| BUS-05 | Calendly Booking Rate | % of visitors scheduling a call | > 0.5% | Calendly Analytics |

### 4.2 Opportunity Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| BUS-06 | Inbound Opportunities / Quarter | Interview invites, contract inquiries, speaking requests | >= 1 | Self-Reported + CRM |
| BUS-07 | Attribution Rate | % of opportunities where evaluator mentions the platform | > 50% | Self-Reported |
| BUS-08 | Referral Rate | % of visitors arriving via word-of-mouth or social share | > 10% | Referrer Analytics |
| BUS-09 | Social Share Rate | % of visitors sharing the platform on social media | > 1% | Social Share Event Tracking |

### 4.3 Reputation Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| BUS-10 | GitHub Stars | Cumulative stars on open-source repository | Trending up | GitHub Insights |
| BUS-11 | GitHub Forks | Cumulative forks | Trending up | GitHub Insights |
| BUS-12 | Social Mentions | References on LinkedIn, X, Hacker News, Reddit | > 2/month | Social Listening (manual) |
| BUS-13 | Documentation Page Views | Views of ADRs, architecture docs, module specs | Trending up | Plausible / GA4 |

---

## 5. Technical Metrics

Technical metrics answer: **Is the system healthy, secure, and maintainable?**

### 5.1 Security Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| TECH-01 | Rate Limit Compliance | % of rate-limited requests correctly rejected | 100% | Security Audit + Load Test |
| TECH-02 | Auth Bypass Attempts | Count of successful unauthorized access attempts | 0 | Security Logs + Penetration Test |
| TECH-03 | Prompt Injection Blocks | Count of blocked prompt injection attempts | Logged; 0 successful | Application Logs + Filter Metrics |
| TECH-04 | PII Leakage Incidents | Count of sensitive data exposures in logs or responses | 0 | Log Scanning + DLP Audit |
| TECH-05 | Dependency Vulnerabilities | Critical / High CVEs in dependencies | 0 | Snyk / Dependabot |
| TECH-06 | Secret Exposure Incidents | Count of secrets committed or leaked | 0 | GitLeaks / TruffleHog |

### 5.2 Reliability Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| TECH-07 | Test Coverage | % of business logic covered by automated tests | > 70% | pytest-cov / istanbul |
| TECH-08 | CI/CD Pipeline Success Rate | % of builds passing on first attempt | > 95% | GitHub Actions / CI Dashboard |
| TECH-09 | Deployment Frequency | Number of production deployments per week | >= 1 | CI/CD Logs |
| TECH-10 | Mean Time to Recovery (MTTR) | Average time from incident detection to resolution | < 30 minutes | Incident Log + PagerDuty |
| TECH-11 | Mean Time Between Failures (MTBF) | Average time between production incidents | > 30 days | Incident Log |

### 5.3 Infrastructure Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| TECH-12 | API Request Rate | Requests per second sustained | Scale to 100 RPS | Prometheus Counter |
| TECH-13 | Concurrent WebSocket Connections | Peak simultaneous WebSocket clients | Scale to 50 | Prometheus Gauge |
| TECH-14 | Database Query Performance | P95 query execution time | < 50ms | PostgreSQL pg_stat_statements |
| TECH-15 | Memory Usage Stability | API process memory growth over 24h | < 10% increase | Prometheus / Node Exporter |
| TECH-16 | Disk Usage Growth | Storage growth rate per week | Predictable; alert at 80% | Cloud Provider Monitoring |

---

## 6. Quality Metrics

Quality metrics answer: **Is the product polished, accessible, and professional?**

### 6.1 UX Quality Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| QUAL-01 | Lighthouse Performance Score | Performance category score | >= 90 | Lighthouse CI |
| QUAL-02 | Lighthouse Accessibility Score | Accessibility category score | >= 90 | Lighthouse CI |
| QUAL-03 | Lighthouse Best Practices Score | Best practices category score | >= 90 | Lighthouse CI |
| QUAL-04 | Lighthouse SEO Score | SEO category score | >= 85 | Lighthouse CI |
| QUAL-05 | First Input Delay (FID) | Time from first interaction to response | < 100ms | Web Vitals |
| QUAL-06 | Cumulative Layout Shift (CLS) | Visual stability metric | < 0.1 | Web Vitals |
| QUAL-07 | Mobile Responsiveness Score | % of pages scoring >= 90 on mobile Lighthouse | 100% | Lighthouse CI (mobile) |

### 6.2 Code Quality Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| QUAL-08 | Code Duplication | % of duplicated lines of code | < 5% | SonarQube / CodeClimate |
| QUAL-09 | Cyclomatic Complexity | Average complexity per function | < 10 | SonarQube / radon |
| QUAL-10 | Type Safety Coverage | % of functions with explicit type annotations | > 90% | mypy / TypeScript strict mode |
| QUAL-11 | Documentation Coverage | % of public functions with docstrings | 100% | pydocstyle / linting |
| QUAL-12 | Dependency Freshness | % of dependencies on latest major version | > 80% | Dependabot / npm outdated |

### 6.3 Content Quality Metrics

| Metric ID | Metric Name | Definition | Target | Measurement Tool |
|-----------|-------------|-----------|--------|------------------|
| QUAL-13 | Documentation Accuracy | % of docs matching current implementation | 100% | Quarterly audit |
| QUAL-14 | ADR Completeness | Number of significant decisions with ADRs | >= 5 | Documentation audit |
| QUAL-15 | Module Spec Coverage | % of implemented modules with spec documents | 100% | File inventory |

---

## 7. Measurement Methodology

### 7.1 Data Collection Architecture

```
User Interaction
      |
      v
[Frontend Events] --> [Plausible / GA4] --> [Analytics Dashboard]
      |
      v
[API Gateway] --> [Prometheus] --> [Grafana Dashboard]
      |                |
      |                --> [Alertmanager]
      v
[Application Logs] --> [Loki] --> [Grafana Explore]
      |
      v
[Structured Events] --> [PostgreSQL] --> [Internal Reports]
```

### 7.2 Tool Stack

| Layer | Tool | Purpose |
|-------|------|---------|
| Web Analytics | Plausible Analytics (privacy-first) | Session duration, page views, referrer tracking |
| Event Tracking | Custom event pipeline + PostgreSQL | Feature usage, conversion events, funnel analysis |
| Metrics | Prometheus | Time-series metrics, histograms, counters, gauges |
| Metrics Visualization | Grafana | Dashboards for engineering and operational metrics |
| Log Aggregation | Loki | Structured log search and alerting |
| Error Tracking | Sentry (optional) | Exception tracking, error grouping, release correlation |
| Uptime Monitoring | UptimeRobot / Pingdom | External availability checks from multiple regions |
| Performance Testing | k6 / Locust | Load testing, latency benchmarking, capacity planning |
| Security Scanning | Snyk + GitLeaks | Dependency vulnerabilities, secret detection |
| Code Quality | SonarQube / CodeClimate | Complexity, duplication, coverage, smells |

### 7.3 Sampling and Retention

| Data Type | Retention Period | Sampling Strategy |
|-----------|-----------------|-------------------|
| Raw API logs | 30 days | 100% retention; compressed archive after 30 days |
| Prometheus metrics | 15 days at full resolution; 1 year at 1h resolution | No sampling; aggregated by recording rules |
| Application logs | 7 days in Loki; 1 year in cold storage | 100% for ERROR/WARN; 10% sample for INFO/DEBUG |
| Analytics events | 1 year | 100% retention (low volume expected) |
| User session recordings | Not collected | Privacy-first approach; no session replay |

### 7.4 Calculation Methodologies

#### Percentile Calculation
All latency percentiles (P50, P95, P99) are calculated using **Prometheus histograms** with exponential buckets. This ensures accurate percentile estimation without storing raw observations.

#### Rate Limit Compliance
Measured via synthetic load tests using k6/Locust. A "compliant" system correctly rejects 100% of requests exceeding tier limits while allowing 100% of requests within limits.

#### Session Duration
Defined as time between first page load and last recorded event (page view, click, or API call) within a 30-minute inactivity window.

#### Unique Visitor
Identified by `guest_id` (for guests) or `user_id` (for authenticated users). Deduplicated on a 24-hour basis.

---

## 8. Targets per Phase

Targets escalate as the platform matures. Early phases focus on stability and core functionality; later phases target polish and scale.

### 8.1 Phase 1: Foundation (Weeks 1-2)

| Category | Metric | Target |
|----------|--------|--------|
| Performance | System Uptime | 99.0% |
| Performance | API P95 Latency | < 1s |
| Technical | CI/CD Pipeline Success Rate | > 90% |
| Technical | Test Coverage | > 50% |
| Quality | Lighthouse Performance Score | >= 70 |
| Engagement | Average Session Duration | > 1 minute |

### 8.2 Phase 2: Core AI Systems (Weeks 3-5)

| Category | Metric | Target |
|----------|--------|--------|
| Performance | Chatbot TTFT | < 2s |
| Performance | Vision Inference Latency (CPU) | < 3s |
| Performance | System Uptime | 99.5% |
| Engagement | Interaction Depth | > 3 API calls |
| Engagement | Vision Upload Rate | > 15% |
| Technical | Test Coverage | > 60% |
| Quality | Lighthouse Performance Score | >= 80 |

### 8.3 Phase 3: Realtime Systems (Weeks 6-7)

| Category | Metric | Target |
|----------|--------|--------|
| Performance | Chatbot TTFT | < 1.5s |
| Performance | API P95 Latency | < 500ms |
| Performance | Log Broadcast Delay | < 1s |
| Engagement | Average Session Duration | > 2.5 minutes |
| Engagement | Module Penetration Rate | > 30% |
| Technical | Test Coverage | > 70% |
| Quality | Lighthouse Performance Score | >= 85 |

### 8.4 Phase 4: Advanced AI (Weeks 8-9)

| Category | Metric | Target |
|----------|--------|--------|
| Performance | Vector Search Latency | < 200ms |
| Performance | System Uptime | 99.9% |
| Engagement | Average Session Duration | > 3 minutes |
| Engagement | Interaction Depth | > 5 API calls |
| Engagement | Return Visit Rate | > 10% |
| Business | LinkedIn CTR | > 3% |
| Quality | Lighthouse Accessibility Score | >= 90 |

### 8.5 Phase 5: Production Hardening (Weeks 10-12)

| Category | Metric | Target |
|----------|--------|--------|
| Performance | All P95 targets met consistently | 30-day sustained |
| Performance | System Uptime | 99.9% sustained |
| Engagement | All engagement targets met | 30-day sustained |
| Business | LinkedIn CTR | > 5% |
| Business | Inbound Opportunities / Quarter | >= 1 |
| Technical | Security audit pass rate | 100% |
| Technical | Zero critical vulnerabilities | Sustained |
| Quality | All Lighthouse scores >= 90 | Sustained |

---

## 9. Dashboard Requirements

### 9.1 Internal Engineering Dashboard (Grafana)

**Purpose:** Monitor system health, performance, and reliability in real time.

**Required Panels:**

| Panel | Data Source | Refresh Interval |
|-------|------------|-----------------|
| Request Rate (RPS) | Prometheus | 5s |
| Latency Heatmap (P50/P95/P99) | Prometheus | 5s |
| Error Rate Trend | Prometheus | 10s |
| Active WebSocket Connections | Prometheus | 5s |
| OpenAI Token Consumption | Prometheus | 30s |
| Estimated Cost (USD/hour) | Prometheus | 30s |
| Redis Memory Usage | Prometheus | 10s |
| PostgreSQL Connection Pool | Prometheus | 10s |
| Celery Queue Depth | Prometheus | 10s |
| Cache Hit/Miss Ratio | Prometheus | 30s |
| System Uptime Gauge | UptimeRobot API | 60s |

### 9.2 Public Analytics Dashboard (Internal Only)

**Purpose:** Track business and engagement metrics without exposing sensitive data.

**Required Panels:**

| Panel | Data Source | Refresh Interval |
|-------|------------|-----------------|
| Unique Visitors (24h / 7d / 30d) | Plausible API | 5 minutes |
| Average Session Duration | Plausible API | 5 minutes |
| Top Referrers | Plausible API | 1 hour |
| Popular Modules | Custom Events | 5 minutes |
| Conversion Funnel | Custom Events | 1 hour |
| Cost Per Visitor | Billing + Analytics | 1 hour |

### 9.3 Alerting Rules

| Alert Condition | Severity | Notification Channel | Response SLA |
|----------------|----------|---------------------|-------------|
| System Uptime < 99% | Critical | Email + Slack | 15 minutes |
| API P95 Latency > 1s (5 min) | Warning | Slack | 30 minutes |
| Error Rate > 1% (5 min) | Critical | Email + Slack | 15 minutes |
| Redis Unavailable | Critical | Email + Slack | 5 minutes |
| PostgreSQL Connection Pool > 90% | Warning | Slack | 30 minutes |
| OpenAI Cost > $50/day | Warning | Slack | 1 hour |
| Certificate Expiry < 7 days | Warning | Email | 24 hours |

---

## 10. Metric Ownership & Review Cadence

### 10.1 Ownership Matrix

| Metric Category | Owner | Review Frequency | Review Format |
|----------------|-------|-----------------|---------------|
| Engagement | Product Owner | Weekly | Analytics report + trend analysis |
| Performance | Backend Lead | Daily | Grafana dashboard review |
| Business | Product Owner | Monthly | Opportunity pipeline review |
| Technical | Engineering Lead | Weekly | Infrastructure health report |
| Quality | Engineering Lead | Per commit | CI dashboard + Lighthouse report |
| Security | Security Lead | Monthly | Vulnerability scan + penetration test summary |

### 10.2 Review Agenda Template

**Weekly Engineering Review (30 minutes):**
1. Performance metrics vs. targets (5 min)
2. Error rate and incident review (10 min)
3. Infrastructure capacity and cost trends (10 min)
4. Action items for next week (5 min)

**Monthly Product Review (60 minutes):**
1. Engagement metrics and funnel analysis (15 min)
2. Business metrics and opportunity pipeline (15 min)
3. User feedback and feature requests (15 min)
4. Metric target adjustments for next month (15 min)

### 10.3 Target Adjustment Process

1. **Propose:** Any team member can propose a target change with justification.
2. **Review:** Engineering Lead and Product Owner review feasibility and impact.
3. **Approve:** Changes affecting > 20% of target require documented rationale.
4. **Communicate:** Approved changes updated in this document with change log entry.

---

## Appendix A: Metric Glossary

| Term | Definition |
|------|-----------|
| **TTFT** | Time to First Token — latency from request submission to first streamed response chunk |
| **RPS** | Requests Per Second |
| **P50 / P95 / P99** | Percentile latency — the value below which 50%, 95%, or 99% of observations fall |
| **MTTR** | Mean Time to Recovery — average time to resolve an incident |
| **MTBF** | Mean Time Between Failures — average time between incidents |
| **LCP** | Largest Contentful Paint — Core Web Vital measuring perceived load speed |
| **CLS** | Cumulative Layout Shift — Core Web Vital measuring visual stability |
| **FID** | First Input Delay — Core Web Vital measuring interactivity responsiveness |
| **SSE** | Server-Sent Events — HTTP-based server-to-client streaming |
| **ADR** | Architecture Decision Record — documented rationale for a significant technical choice |

---

*This document is a living artifact. Metrics, targets, and methodologies should be reviewed monthly and updated based on observed data, tooling changes, and evolving product priorities.*
