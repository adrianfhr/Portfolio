# Observability Dashboard — Acceptance Criteria

> **Module:** Observability Dashboard  
> **Version:** 1.0

## AC-OBS-001: Live Metrics

- [ ] The dashboard updates automatically without manual refresh.
- [ ] The live stream reconnects after a transient disconnect.
- [ ] The UI indicates when the stream is stale.

## AC-OBS-002: Health Checks

- [ ] The dashboard shows the status of API gateway, Redis, PostgreSQL, Qdrant, and OpenAI connectivity.
- [ ] Each service includes a last-checked timestamp.
- [ ] Service status is based on real checks, not hardcoded values.

## AC-OBS-003: Cost Tracking

- [ ] The dashboard shows daily estimated cost.
- [ ] The cost view can be broken down by model.
- [ ] Budget threshold warnings are visible when exceeded.

## AC-OBS-004: Chart Rendering

- [ ] Latency, traffic, token usage, and cache metrics are displayed in charts.
- [ ] Missing values do not crash the chart components.
- [ ] The layout remains readable on smaller screens.

## AC-OBS-005: Performance and Resilience

- [ ] Metric collection overhead stays low enough not to affect the user experience noticeably.
- [ ] The dashboard continues showing last known values if Redis is temporarily unavailable.
- [ ] Empty traffic periods are rendered as valid zero-data states.

## AC-OBS-006: Security

- [ ] Aggregate metrics do not expose sensitive request details.
- [ ] User-level data is visible only to authorized admin users.# Observability (Monitoring Dashboard) — Acceptance Criteria

> **Module:** Observability  
> **Version:** 1.0  
> **Definition of Ready:** All criteria below must be verifiable in a staging environment.

---

## AC-OBS-001: Metrics Collection

- [ ] Every API request generates a metric record with timestamp, endpoint, method, status code, and latency.
- [ ] LLM requests include model, prompt tokens, completion tokens, and estimated cost.
- [ ] Collection is non-blocking and adds <1ms overhead per request.
- [ ] Metrics are buffered in Redis and flushed every 2 seconds.

## AC-OBS-002: Real-Time Streaming

- [ ] `GET /api/v1/metrics/live` returns SSE with updates every 2–3 seconds.
- [ ] On connect, the client receives the current state immediately.
- [ ] Heartbeat events are sent every 5 seconds during idle periods.
- [ ] If the connection drops, the UI reconnects automatically with exponential backoff.

## AC-OBS-003: Summary Cards

- [ ] Four KPI cards are visible: Total Cost, Avg Latency (P50), Uptime, Total Requests.
- [ ] Cards update in real time as SSE events arrive.
- [ ] Each card has a hover tooltip explaining the metric.
- [ ] Clicking a card highlights or scrolls to its corresponding chart.

## AC-OBS-004: Live Charts

- [ ] Latency line chart shows P50, P90, P99 lines with tooltips on hover.
- [ ] Request volume area chart is stacked by status code (2xx, 4xx, 5xx).
- [ ] Token usage bar chart shows prompt vs. completion per model.
- [ ] Cache hit gauge displays 0–100% with color zones.
- [ ] Charts update smoothly (750ms transitions) without full re-renders.

## AC-OBS-005: Service Health Grid

- [ ] Five services are monitored: API Gateway, Redis, PostgreSQL, Qdrant, OpenAI API.
- [ ] Each service shows status (Healthy/Degraded/Down), latency, and last check time.
- [ ] Status updates automatically every 10 seconds.
- [ ] Clicking a service card shows the last 5 health check results.
- [ ] A service transitioning to Down triggers a pulse animation.

## AC-OBS-006: Cost Tracking

- [ ] Total cost today is displayed prominently and updates per request.
- [ ] Per-model cost breakdown is shown in a bar chart.
- [ ] Cost estimates are within 10% of actual OpenAI pricing.
- [ ] When daily cost exceeds $5.00, a warning banner appears.

## AC-OBS-007: Time Range Selection

- [ ] Preset buttons (15m, 1h, 6h, 24h, 7d) switch the time range instantly.
- [ ] Historical data loads within 1 second.
- [ ] URL updates with the selected range query parameter.
- [ ] In historical mode, the LIVE badge shows "PAUSED" and SSE is paused.
- [ ] "Back to Live" button resumes real-time streaming.

## AC-OBS-008: Health Endpoint

- [ ] `GET /api/v1/health` returns overall status and per-service details.
- [ ] Response includes latency per service and a timestamp.
- [ ] Endpoint responds within 1 second.
- [ ] No authentication required for basic health status.

## AC-OBS-009: Edge Case Handling

- [ ] Zero traffic displays calm flat lines, not errors.
- [ ] Missing metrics show "N/A" or "0" with appropriate tooltips.
- [ ] Redis down triggers in-memory fallback with a degraded banner.
- [ ] Stream delays >5s show a "Stream delayed" warning.
- [ ] Buffer overflow drops oldest entries and logs a warning.

## AC-OBS-010: Security

- [ ] No user-identifiable data appears in public metrics.
- [ ] Per-user breakdowns require admin role JWT.
- [ ] Metrics SSE is limited to 1 connection per user session.
- [ ] Health endpoint is open; detailed metrics require appropriate authorization.

## AC-OBS-011: Performance

- [ ] Dashboard becomes interactive within 1.5s of page load.
- [ ] Charts with 1000 data points render in <500ms.
- [ ] SSE supports 50+ concurrent connections.
- [ ] Metric collection overhead is <1ms per API request.

## AC-OBS-012: Accessibility

- [ ] All metric values are readable via screen reader (aria-labels on charts).
- [ ] Color is not the sole indicator of status (icons + text).
- [ ] Focus indicators are visible on all interactive elements.
- [ ] Charts respect `prefers-reduced-motion` (disable animations).
