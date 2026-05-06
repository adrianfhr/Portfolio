# Observability Dashboard — Functional Requirements

> **Module:** Observability Dashboard  
> **Version:** 1.0

## 1. Metrics Collection

- Collect request latency, request count, error rate, queue depth, websocket connections, token usage, and cost estimates.
- Buffer raw metric events in Redis before aggregation.
- Aggregate metrics for display on a fixed refresh cadence.

## 2. Live Streaming

- Deliver metric snapshots through SSE.
- Send updates every 2 to 3 seconds during active sessions.
- Auto-reconnect when the stream is interrupted.

## 3. Health Checks

- Probe core services: API gateway, Redis, PostgreSQL, Qdrant, and OpenAI connectivity.
- Provide service-level latency information alongside status.
- Timestamp each probe result.

## 4. Visualization

- Display summary cards for top-level metrics.
- Render charts for trends and categorical breakdowns.
- Show a service health grid and a live indicator badge.

## 5. Cost Monitoring

- Track daily estimated cost by model and by session.
- Display warnings when budget thresholds are exceeded.
- Update cost values as requests complete.

## 6. Data Resilience

- Keep last known values when the live stream is temporarily unavailable.
- Render placeholders for missing metric fields.
- Prevent chart crashes when a data series is empty.

## 7. Access Control

- Expose aggregate metrics to all users.
- Restrict user-level drill-down data to admin users.

## 8. Admin and Debug Support

- Provide enough context in the dashboard to detect stale streams, traffic spikes, and service degradation.
- Make it easy to compare current data against short history windows.# Observability (Monitoring Dashboard) — Functional Requirements

> **Module:** Observability  
> **Version:** 1.0  
> **Total Requirements:** 38

---

## FR-OBS-001: Metrics Collection

### Description
Collect metrics asynchronously per API call and store them for aggregation and broadcast.

### Requirements
- **FR-OBS-001.1:** Every API request shall emit metrics containing: `timestamp`, `endpoint`, `method`, `status_code`, `latency_ms`, `user_tier`.
- **FR-OBS-001.2:** LLM-specific metrics shall include: `model`, `prompt_tokens`, `completion_tokens`, `total_tokens`, `estimated_cost_usd`.
- **FR-OBS-001.3:** Metrics shall be collected via FastAPI middleware or dependency injection to ensure zero developer overhead.
- **FR-OBS-001.4:** Collection shall be non-blocking; metrics are enqueued to a Redis buffer (`metrics:buffer`) asynchronously.
- **FR-OBS-001.5:** Buffer flush interval shall be **2 seconds** to balance freshness and batching efficiency.

---

## FR-OBS-002: Metrics Catalog

### Description
Define the complete set of metrics tracked by the dashboard.

### Requirements
- **FR-OBS-002.1:** **API Latency (Histogram):** Distribution of response times in milliseconds. Buckets: 10, 50, 100, 250, 500, 1000, 2500, 5000, 10000.
- **FR-OBS-002.2:** **Latency Percentiles:** P50, P90, P99 computed from the histogram every 10 seconds.
- **FR-OBS-002.3:** **Total Requests (Counter):** Cumulative count of API requests, labelled by `endpoint`, `method`, `status_code`.
- **FR-OBS-002.4:** **OpenAI Token Cost (Gauge):** Estimated cost in USD for the current day, updated per request.
- **FR-OBS-002.5:** **Prompt Tokens (Counter):** Cumulative count of prompt tokens consumed.
- **FR-OBS-002.6:** **Completion Tokens (Counter):** Cumulative count of completion tokens consumed.
- **FR-OBS-002.7:** **Cache Hit Ratio (Gauge):** Percentage of cache hits vs. total cache lookups, updated every 30 seconds.
- **FR-OBS-002.8:** **Active WebSocket Connections (Gauge):** Current count of open WebSocket connections.
- **FR-OBS-002.9:** **Queue Depth (Gauge):** Current number of items in the Celery task queue.
- **FR-OBS-002.10:** **Error Rate (%):** Percentage of 5xx responses in the last 5 minutes.
- **FR-OBS-002.11:** **System Uptime (%):** Percentage of time the API gateway has been responsive in the selected time range.

---

## FR-OBS-003: Real-Time Streaming

### Description
Stream aggregated metrics to connected clients via SSE.

### Requirements
- **FR-OBS-003.1:** Endpoint: `GET /api/v1/metrics/live` (SSE).
- **FR-OBS-003.2:** Update interval: **2–3 seconds** between events.
- **FR-OBS-003.3:** Event payload schema:
  ```json
  {
    "timestamp": "2026-05-06T13:14:26Z",
    "metrics": {
      "latency_p50_ms": 120,
      "latency_p90_ms": 340,
      "latency_p99_ms": 890,
      "total_requests": 15234,
      "requests_per_minute": 45,
      "error_rate_percent": 0.2,
      "active_ws_connections": 12,
      "queue_depth": 3,
      "cache_hit_ratio": 0.85,
      "token_cost_today_usd": 2.47
    }
  }
  ```
- **FR-OBS-003.4:** On client connect, send the current aggregated state immediately, then continue with periodic updates.
- **FR-OBS-003.5:** If no new data is available, send a heartbeat event every 5 seconds to keep the connection alive.

---

## FR-OBS-004: Service Health Checks

### Description
Periodically check the health of all backend services and display their status.

### Requirements
- **FR-OBS-004.1:** Services monitored:
  - **API Gateway:** Self-check (always healthy if responding).
  - **Redis:** Ping command response time < 100ms.
  - **PostgreSQL:** Simple `SELECT 1` query response time < 500ms.
  - **Qdrant:** Health endpoint response.
  - **OpenAI API:** Lightweight `/models` list request.
- **FR-OBS-004.2:** Health status definitions:
  - **Healthy:** Response within target latency, no errors.
  - **Degraded:** Response 2–5× target latency, or intermittent errors.
  - **Down:** No response, connection refused, or timeout.
- **FR-OBS-004.3:** Health checks run every **10 seconds** in the background.
- **FR-OBS-004.4:** Endpoint: `GET /api/v1/health` returns:
  ```json
  {
    "status": "healthy",
    "services": {
      "api_gateway": { "status": "healthy", "latency_ms": 2 },
      "redis": { "status": "healthy", "latency_ms": 8 },
      "postgresql": { "status": "healthy", "latency_ms": 45 },
      "qdrant": { "status": "healthy", "latency_ms": 23 },
      "openai_api": { "status": "degraded", "latency_ms": 2340 }
    },
    "timestamp": "2026-05-06T13:14:26Z"
  }
  ```

---

## FR-OBS-005: Cost Tracking

### Description
Track and visualize OpenAI API costs with daily aggregation and per-model breakdown.

### Requirements
- **FR-OBS-005.1:** Cost is estimated per request using per-model pricing:
  - `prompt_cost_per_1k * prompt_tokens / 1000`
  - `completion_cost_per_1k * completion_tokens / 1000`
- **FR-OBS-005.2:** Daily cost accumulator resets at midnight UTC.
- **FR-OBS-005.3:** Cost breakdown by model is stored in Redis hash: `metrics:cost:daily:{YYYY-MM-DD}`.
- **FR-OBS-005.4:** The dashboard displays:
  - Total cost today (large KPI card).
  - Bar chart: cost per model.
  - Line chart: cumulative cost over the selected time range.
- **FR-OBS-005.5:** Optional alert threshold: if daily cost exceeds **$5.00**, a warning banner appears.
- **FR-OBS-005.6:** Cost data is persisted to PostgreSQL daily for historical analysis.

---

## FR-OBS-006: Summary Cards (KPIs)

### Description
Display at-a-glance key performance indicators at the top of the dashboard.

### Requirements
- **FR-OBS-006.1:** Cards displayed in a responsive grid (2 cols mobile, 4 cols desktop):
  - **Total Cost Today:** `$2.47` with trend arrow (↑/↓ vs. yesterday).
  - **Average Latency (P50):** `120ms` with sparkline mini-chart.
  - **System Uptime:** `99.9%` with progress bar.
  - **Total Requests:** `15,234` with requests/min sub-label.
- **FR-OBS-006.2:** Each card updates in real time as SSE events arrive.
- **FR-OBS-006.3:** Cards have hover tooltips explaining the metric definition.
- **FR-OBS-006.4:** Clicking a card scrolls to or highlights its corresponding detailed chart.

---

## FR-OBS-007: Live Charts

### Description
Render interactive charts for metric visualization.

### Requirements
- **FR-OBS-007.1:** **Latency Line Chart:**
  - Lines for P50, P90, P99.
  - X-axis: time, Y-axis: milliseconds (logarithmic option).
  - Tooltip on hover showing exact values at that timestamp.
- **FR-OBS-007.2:** **Request Volume Area Chart:**
  - Stacked area showing requests per minute.
  - Segments by status code family (2xx, 4xx, 5xx).
  - Color coding: green (2xx), yellow (4xx), red (5xx).
- **FR-OBS-007.3:** **Token Usage Bar Chart:**
  - Bars per model showing prompt vs. completion tokens.
  - Updated per SSE event.
- **FR-OBS-007.4:** **Cache Hit Gauge:**
  - Semi-circular gauge (0–100%).
  - Color zones: red (<50%), yellow (50–80%), green (>80%).
- **FR-OBS-007.5:** All charts use smooth transitions (`duration: 750ms`) when data updates.
- **FR-OBS-007.6:** Charts support hover tooltips with exact values and timestamps.

---

## FR-OBS-008: Service Health Grid

### Description
A visual grid displaying the current health of all services.

### Requirements
- **FR-OBS-008.1:** Grid layout: 5 cards in a row (desktop), 2 columns (tablet), 1 column (mobile).
- **FR-OBS-008.2:** Each card contains:
  - Service icon (custom SVG).
  - Service name.
  - Status badge (colored pill).
  - Response latency in ms.
  - "Last checked: 8s ago" text.
- **FR-OBS-008.3:** Clicking a card expands a detail view showing the last 5 health check results.
- **FR-OBS-008.4:** A service transitioning to Down triggers a brief pulse animation on its card.

---

## FR-OBS-009: Time Range Selection

### Description
Allow users to select the time window for historical analysis.

### Requirements
- **FR-OBS-009.1:** Preset buttons: `15m`, `1h`, `6h`, `24h`, `7d`.
- **FR-OBS-009.2:** Custom range picker (date + time) for admin users only.
- **FR-OBS-009.3:** Changing the range fetches historical data from PostgreSQL.
- **FR-OBS-009.4:** The selected range is reflected in the URL query string (`?range=24h`).
- **FR-OBS-009.5:** During historical view, the LIVE badge shows "PAUSED" and the SSE stream is paused.
- **FR-OBS-009.6:** A "Back to Live" button returns to real-time mode.

---

## FR-OBS-010: API Endpoints

### GET /api/v1/metrics/live
- **Response:** `text/event-stream`
- **Events:** Periodic metric aggregates every 2–3s.

### GET /api/v1/metrics/summary
- **Response:**
  ```json
  {
    "time_range": "15m",
    "latency": { "p50": 120, "p90": 340, "p99": 890 },
    "requests": { "total": 15234, "per_minute": 45, "error_rate": 0.2 },
    "tokens": { "prompt": 45000, "completion": 120000 },
    "cost": { "today_usd": 2.47, "by_model": { "gpt-4o-mini": 0.12, "gpt-4o": 2.35 } },
    "cache": { "hit_ratio": 0.85 },
    "connections": { "websocket": 12 },
    "queue": { "depth": 3 }
  }
  ```

### GET /api/v1/health
- **Response:** Service health status object (see FR-OBS-004.4).
