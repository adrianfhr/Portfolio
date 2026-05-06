# Observability Dashboard — Product Requirements Document

> **Module ID:** M-OBS-001  
> **Version:** 1.0  
> **Status:** Draft  
> **Owner:** AI Engineering Portfolio Team  
> **Priority:** High  
> **Category:** Observability  
> **Dependencies:** Prometheus, Redis, SSE, Authentication Module, API Gateway, Structured Logging Pipeline

## 1. Objective

Provide a live operational dashboard that proves the portfolio is connected to real services, real traffic, and real metrics. The dashboard should surface latency, throughput, error rates, health status, and token costs in a way that feels production-grade rather than decorative.

## 2. User Stories

### 2.1 CTO / Engineering Lead
As a CTO or engineering lead, I want to see live latency, throughput, and cost data so I can judge whether the system is engineered like a production service.

### 2.2 Recruiter / Reviewer
As a reviewer, I want to see changing health and metric values so I can confirm the dashboard is wired to live backend signals.

### 2.3 Visitor
As a visitor, I want a simple health overview so I can immediately tell whether the demo is active.

### 2.4 Operator
As the portfolio owner, I want a monitoring surface that helps me notice spikes, stale streams, and degraded dependencies before they become visible to visitors.

## 3. Functional Requirements

### 3.1 Metrics Collection
- Collect metrics asynchronously from API requests, background jobs, and real-time streams.
- Buffer metrics in Redis before aggregation and display.
- Track latency, request volume, cost, cache behavior, queue depth, and websocket activity.

### 3.2 Real-Time Delivery
- Stream dashboard updates through SSE every 2 to 3 seconds.
- Reconnect automatically when the stream is interrupted.
- Show stale-data warnings when updates stop arriving for too long.

### 3.3 Health Checks
- Query the health of key services such as API gateway, Redis, PostgreSQL, Qdrant, and OpenAI connectivity.
- Display the status of each dependency as healthy, degraded, or down.
- Timestamp every health probe.

### 3.4 Cost Tracking
- Accumulate estimated OpenAI cost per day and per model.
- Expose cost summaries for the current session and for the current day.
- Trigger a warning when configured budget thresholds are exceeded.

### 3.5 Historical Trends
- Show recent history for the last hour or another selected time window.
- Allow the user to inspect trend lines for latency, traffic, and token usage.
- Keep the UI readable even when data density is high.

### 3.6 Admin Visibility
- Restrict detailed user-level metrics to admin roles.
- Keep public metrics aggregate-only to avoid leaking sensitive usage data.

## 4. Non-Functional Requirements

### 4.1 Performance
- Metric collection overhead must remain small enough to avoid affecting the core API path.
- Dashboard updates should not block page interaction.
- Charts should render smoothly with moderate data volumes.

### 4.2 Reliability
- The dashboard must continue showing the last known values when Redis or SSE is temporarily unavailable.
- Missing metrics must degrade to placeholders rather than causing chart failures.
- Stale streams must be detectable from the UI.

### 4.3 Security
- Public endpoints should expose only aggregate data.
- Admin-only breakdowns must require authorization.
- Health probes should avoid revealing internal secrets or stack traces.

### 4.4 Maintainability
- The metric catalog should be centralized and documented.
- New metrics should be easy to add without rewriting dashboard layout logic.
- Data contracts should remain stable between frontend refreshes.

## 5. UI/UX Requirements

### 5.1 Layout
- Use a dark, dashboard-style layout inspired by Grafana, Datadog, and Vercel Analytics.
- Present summary cards at the top, followed by charts and service health panels.
- Collapse gracefully on mobile without hiding the most important metrics.

### 5.2 Summary Cards
- Show total cost, average latency, uptime, and total requests in large summary cards.
- Add sparklines or micro-trends when data is available.

### 5.3 Charts
- Include line charts for latency, area charts for traffic, bar charts for token usage, and gauge-style visuals for cache health.
- Keep axes, legends, and units visible and readable.

### 5.4 Service Health
- Render a grid of service cards with colored status indicators.
- Refresh health status on a slower cadence than metrics.

### 5.5 Live Indicator
- Display a visible LIVE badge when streaming updates are active.
- Show an explicit stale-data warning if the stream pauses.

## 6. API & Data Contract

### 6.1 Live Metrics Stream
`GET /api/v1/metrics/live`

Response: SSE events with metric snapshots.

```text
event: metrics
data: {"timestamp":"2024-05-01T12:00:00Z","requests_per_minute":45,"avg_latency_ms":120}
```

### 6.2 Metrics Summary
`GET /api/v1/metrics/summary`

```json
{
  "period": "today",
  "total_requests": 1247,
  "total_cost_usd": 1.24,
  "avg_latency_ms": 120,
  "p90_latency_ms": 350,
  "p99_latency_ms": 890,
  "error_rate": 0.02,
  "cache_hit_ratio": 0.78,
  "active_connections": 12,
  "uptime_percent": 99.9
}
```

### 6.3 Health Check
`GET /api/v1/health`

```json
{
  "status": "healthy",
  "services": {
    "api_gateway": {"status": "healthy", "latency_ms": 5},
    "redis": {"status": "healthy", "latency_ms": 2},
    "postgresql": {"status": "healthy", "latency_ms": 8},
    "qdrant": {"status": "healthy", "latency_ms": 15},
    "openai": {"status": "healthy", "latency_ms": 120}
  },
  "checked_at": "2024-05-01T12:00:00Z"
}
```

## 7. Acceptance Criteria

- [ ] Metrics update in real time while the application is being used.
- [ ] The dashboard clearly distinguishes healthy, degraded, and down services.
- [ ] Cost estimates stay close to the backend billing approximation.
- [ ] SSE reconnects after a temporary stream interruption.
- [ ] The dashboard stays usable on mobile.
- [ ] Missing data falls back to placeholders instead of breaking charts.

## 8. Edge Cases

- No traffic should render as a flat zero line rather than an error.
- Missing values should display placeholders and not crash charts.
- Redis outage should degrade to last known values or an in-memory fallback.
- Slow SSE updates should trigger a stale-data warning.
- Health checks for external APIs should degrade gracefully when the vendor endpoint is unavailable.

## 9. Security Requirements

- Do not expose sensitive request details in aggregate metrics.
- Restrict detailed breakdowns to authorized users.
- Keep health endpoints informative without revealing secrets or internal paths.

## 10. Dependencies

| Dependency | Purpose |
|---|---|
| Prometheus | Optional metrics backend and long-term aggregation |
| Redis | Metric buffering and fast aggregation |
| SSE | Real-time delivery channel |
| Recharts | Frontend chart rendering |
| Authentication Module | Role-based access to sensitive views |

## 11. Cross-References

- [System Architecture](../../02-Architecture-Design/system-architecture.md)
- [WebSocket Architecture](../../02-Architecture-Design/websocket-architecture.md)
- [Security Strategy](../../05-Security-Observability/monitoring.md)
- [Metrics Catalog](../../05-Security-Observability/metrics.md)
- [Live Logs](../../03-Core-AI-Modules/Live-Logs/PRD/prd.md)# Observability (Monitoring Dashboard) — Product Requirements Document (PRD)

> **Module ID:** M-OBS-001  
> **Version:** 1.0  
> **Status:** Draft  
> **Owner:** AI Engineering Portfolio Team  
> **Last Updated:** 2026-05-06

---

## 1. Executive Summary

The **Observability (Monitoring Dashboard)** module provides compelling visual proof that the platform operates as a production-grade system. It surfaces real-time metrics, cost tracking, service health checks, and historical trends in a Grafana-inspired interface. This module is not merely decorative — it demonstrates the team's commitment to operational excellence, cost transparency, and infrastructure observability by exposing the same telemetry that would power internal SRE dashboards.

For visitors, the dashboard answers critical questions:
- **CTO Elena:** "Is this system reliable, fast, and cost-efficient?"
- **Recruiter Sam:** "Does this person actually run a live system or just deploy static pages?"
- **Peer Dev Raj:** "How are metrics collected, buffered, aggregated, and streamed?"
- **Curious Alex:** "How much does it cost to run AI features?"

---

## 2. Objectives & Success Criteria

### 2.1 Primary Objectives

| Objective | Description | Success Metric |
|---|---|---|
| 🎯 Live Metrics for CTO | Display real-time API latency, throughput, and error rates with percentile breakdowns. | P50/P90/P99 latencies update every 2–3 seconds. |
| 🎯 System Health at a Glance | Show the operational status of all backend services (API Gateway, Redis, PostgreSQL, Qdrant, OpenAI API). | Health status reflects actual service state with <5s detection latency. |
| 🎯 Historical Trends | Provide time-range selection for analyzing metrics over hours, days, or weeks. | Charts render historical data within 1s of range selection. |
| 🎯 Cost Transparency | Track and display daily OpenAI token costs with per-model breakdown. | Cost estimates are within 10% of actual billing. |

### 2.2 Business Goals

1. **Operational Credibility:** Prove the system is actively monitored and maintained.
2. **Cost Consciousness:** Demonstrate fiscal responsibility by surfacing real spending data.
3. **Performance Proof:** Show that latency targets are met and tracked continuously.
4. **Educational Value:** Teach visitors about production observability practices (metrics, percentiles, SLOs).

---

## 3. Scope

### 3.1 In-Scope

- Real-time metrics collection per API call (latency, status code, endpoint).
- Metrics tracked: API latency histogram, request counters, OpenAI token cost, prompt/completion token counters, cache hit ratio, active WebSocket connections, queue depth, error rate percentage, system uptime.
- Redis buffer for metric aggregation before client broadcast.
- SSE endpoint for live metric streaming (2–3s update interval).
- Service health checks for API Gateway, Redis, PostgreSQL, Qdrant, and OpenAI API.
- Cost tracking with daily accumulation and per-model breakdown.
- Optional cost alert threshold (>$5/day).
- Summary cards for at-a-glance KPIs.
- Live charts: line (latency), area (request volume), bar (token usage), gauge (cache hit).
- Service health grid with status indicators.
- LIVE badge with pulsing dot indicator.

### 3.2 Out-of-Scope

- Custom alert creation or notification channels (email, Slack, PagerDuty).
- Log aggregation or log search (handled by Live-Logs module).
- Distributed tracing visualization (Jaeger/Zipkin) in v1.0.
- Custom metric queries or PromQL interface.
- Multi-tenant metric isolation (metrics are global or user-scoped based on role).

---

## 4. User Personas

| Persona | Role | Primary Goal |
|---|---|---|
| **CTO Elena** | Engineering Executive | Assess system reliability, performance consistency, and operational maturity. |
| **Recruiter Sam** | Technical Recruiter | Verify that the system is live, monitored, and maintained. |
| **Peer Dev Raj** | Senior Engineer | Study the metrics pipeline: collection → buffering → aggregation → streaming. |
| **Curious Alex** | General Visitor | Understand how much AI features cost to run and how fast they are. |

---

## 5. Dependencies

| Dependency | Module | Reason |
|---|---|---|
| Authentication & Rate Limiting | `12-Module-Authentication` | Role-based access to admin-level metric breakdowns. |
| Live Logs | `10-Module-Live-Logs` | Correlation between metrics spikes and log events. |
| AI Playground | `07-Module-AI-Playground` | Token usage and latency data sources. |
| LLM Chatbot | `05-Module-LLM-Chatbot` | Chat-specific latency and token metrics. |

---

## 6. Assumptions & Constraints

### 6.1 Assumptions

- Prometheus or a custom metrics aggregator is available for metric collection.
- Redis is available for metric buffering and real-time state.
- OpenAI API pricing data is cached and updated periodically.

### 6.2 Constraints

- **Update Interval:** Metrics are streamed to clients every 2–3 seconds to balance freshness and server load.
- **Buffer Flush:** Redis metric buffers flush every 2 seconds.
- **Historical Retention:** Metrics are retained in PostgreSQL for 30 days; real-time buffers in Redis expire after 1 hour.
- **No Sensitive Data:** Metrics are aggregates only; no user-identifiable information is exposed in public metrics.

---

## 7. Glossary

| Term | Definition |
|---|---|
| **Metric** | A measurable data point (e.g., request count, latency). |
| **Histogram** | A distribution of values into buckets (used for latency percentiles). |
| **Counter** | A cumulative metric that only increases (e.g., total requests). |
| **Gauge** | A metric that can go up or down (e.g., active connections). |
| **P50/P90/P99** | Percentiles: 50th (median), 90th, 99th percentile values. |
| **SLO** | Service Level Objective; a target reliability metric. |
| **SSE** | Server-Sent Events; unidirectional HTTP streaming. |
| **TTL** | Time to Live; expiration time for cached data. |

---

## 8. Related Documents

- `docs/03-Core-AI-Modules/Observability/PRD/user-stories.md`
- `docs/03-Core-AI-Modules/Observability/PRD/functional-requirements.md`
- `docs/03-Core-AI-Modules/Observability/PRD/non-functional-requirements.md`
- `docs/03-Core-AI-Modules/Observability/PRD/edge-cases.md`
- `docs/03-Core-AI-Modules/Observability/PRD/acceptance-criteria.md`
- `docs/03-Core-AI-Modules/Observability/Design-System/ui-spec.md`
