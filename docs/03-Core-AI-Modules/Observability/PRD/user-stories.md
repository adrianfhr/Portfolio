# Observability Dashboard — User Stories

> **Module:** Observability Dashboard  
> **Version:** 1.0  
> **Priority:** High

## 1. Overview

The observability experience exists to prove that the portfolio is connected to real operational signals. These stories emphasize live metrics, service health, and trust in the data stream.

## 2. User Stories

### US-1: View Live Metrics
As a technical reviewer, I want to see live latency and request metrics so that I can verify the system is active.

### US-2: Review Cost Behavior
As a reviewer, I want to see token cost estimates so that I can assess financial discipline.

### US-3: Inspect Service Health
As a visitor, I want to see green or red service indicators so that I know the demo is really connected to backend systems.

### US-4: Detect Degradation
As an operator, I want to notice queue buildup, Redis issues, or stream delays quickly so that I can react before the demo degrades.

### US-5: Compare Time Windows
As a reviewer, I want to compare recent trends so that I can understand traffic and stability over time.

### US-6: Survive Missing Data
As a user, I want charts to degrade gracefully when data is missing so that the dashboard remains readable instead of broken.

## 3. Story Notes

- Story outcomes must be driven by actual backend data or documented fallback state.
- Service health and latency values should visibly change during active use.
- The user should be able to understand the dashboard without reading implementation details.# Observability (Monitoring Dashboard) — User Stories

> **Module:** Observability  
> **Document Type:** User Story Collection  
> **Version:** 1.0

---

## US-OBS-001: Live Metrics for CTO

**As a** CTO evaluating engineering maturity,  
**I want to** see real-time API latency percentiles and throughput metrics,  
**So that** I can assess whether the system meets production performance standards.

### Acceptance Criteria
- [ ] The dashboard displays P50, P90, and P99 latency values updated every 2–3 seconds.
- [ ] A line chart visualizes latency trends over the last 15 minutes.
- [ ] Total request count is displayed as a cumulative counter.
- [ ] Error rate is shown as a percentage with a red threshold indicator (>5%).

### Priority
**High** — Core value proposition for executive evaluation.

---

## US-OBS-002: System Health at a Glance

**As a** technical recruiter or peer engineer,  
**I want to** see the operational status of all backend services,  
**So that** I can verify the system is live and all components are healthy.

### Acceptance Criteria
- [ ] A health grid displays 5 services: API Gateway, Redis, PostgreSQL, Qdrant, OpenAI API.
- [ ] Each service shows one of three states: Healthy (green), Degraded (amber), Down (red).
- [ ] Service status updates automatically without page refresh.
- [ ] A "Last checked" timestamp is shown for each service.

### Priority
**High** — Critical for proving the system is operational.

---

## US-OBS-003: Historical Trends

**As a** peer engineer studying the system,  
**I want to** select different time ranges for metric analysis,  
**So that** I can observe patterns, peak usage, and long-term performance trends.

### Acceptance Criteria
- [ ] Time range selector offers: Last 15 minutes, 1 hour, 6 hours, 24 hours, 7 days.
- [ ] All charts update to reflect the selected time range within 1 second.
- [ ] Data points are aggregated appropriately (per-minute for short ranges, per-hour for long ranges).
- [ ] The URL is updated with the selected time range for shareability.

### Priority
**Medium-High** — Important for demonstrating analytical depth.

---

## US-OBS-004: Cost Tracking

**As a** cost-conscious evaluator,  
**I want to** see daily OpenAI API costs broken down by model,  
**So that** I can understand the financial footprint of the AI features.

### Acceptance Criteria
- [ ] A "Total Cost Today" card displays accumulated spend in USD.
- [ ] A bar chart shows cost breakdown per model (gpt-4o-mini, gpt-3.5-turbo, gpt-4o).
- [ ] Cost data updates in real time as new API calls complete.
- [ ] An optional alert threshold (e.g., $5/day) triggers a warning banner when exceeded.

### Priority
**Medium** — Reinforces fiscal responsibility and transparency.

---

## US-OBS-005: Real-Time Feel

**As a** general visitor,  
**I want to** see numbers and charts updating live with a "LIVE" indicator,  
**So that** I feel like I'm looking at a real operating system, not a static screenshot.

### Acceptance Criteria
- [ ] A "LIVE" badge with a pulsing green dot is visible at all times.
- [ ] Metric values animate smoothly when they update (count-up animation).
- [ ] Charts update without full re-renders (smooth transitions).
- [ ] If the SSE connection drops, a "Reconnecting" state is shown within 3 seconds.

### Priority
**Medium** — Contributes to the "show, don't tell" philosophy.

---

## Story Map Summary

| ID | Story | Actor | Priority | Effort |
|---|---|---|---|---|
| US-OBS-001 | Live Metrics for CTO | CTO, Peer Dev | High | High |
| US-OBS-002 | System Health at a Glance | Recruiter, All Users | High | Medium |
| US-OBS-003 | Historical Trends | Peer Dev, CTO | Medium-High | Medium |
| US-OBS-004 | Cost Tracking | CTO, Curious Alex | Medium | Low |
| US-OBS-005 | Real-Time Feel | All Users | Medium | Low |
