# Observability Dashboard — Edge Cases

> **Module:** Observability Dashboard  
> **Version:** 1.0

## 1. Edge Cases

| Scenario | Expected Handling |
|---|---|
| No traffic | Render flat zero lines and explanatory empty state text. |
| Missing metric fields | Display a placeholder dash or `No data` label. |
| Redis unavailable | Use last known values or an in-memory fallback. |
| SSE stream delay | Show a stale-data warning after the configured timeout. |
| External API health check fails | Mark the service degraded or down without crashing the page. |
| Cost spikes unexpectedly | Highlight the summary card and show a budget warning. |
| High queue depth | Surface the queue panel prominently and change the status color. |
| Mobile viewport overflow | Collapse the layout to a smaller card grid. |
| Browser reconnect loop | Back off reconnect attempts and keep the UI stable. |

## 2. Handling Principles

- Prefer a stable degraded state over a blank dashboard.
- Do not misrepresent estimated values as exact billing numbers.
- Always preserve the last valid snapshot when live updates fail temporarily.# Observability (Monitoring Dashboard) — Edge Cases

> **Module:** Observability  
> **Version:** 1.0

---

## EC-OBS-001: Missing Metrics

### Scenario
A metric has no data for the current time window (e.g., no API requests in the last minute).

### Expected Behavior
- **Server:** Emit the metric with a `null` or zero value depending on the metric type.
- **Client:** Display "0" or "—" for counters, and the last known value for gauges with a "No recent data" tooltip.
- **Charts:** Draw a flat line at zero or the last known value. Do not show gaps or broken lines.
- **Latency Percentiles:** If no requests occurred, display "N/A" with an info tooltip.

---

## EC-OBS-002: Telemetry Overload

### Scenario
A sudden traffic spike generates more metrics than the buffer can handle.

### Expected Behavior
- **Server:** The Redis buffer enforces a max size of 10,000 entries. When full, oldest entries are dropped (FIFO).
- **Warning:** A `WARN` log is emitted: `"Metrics buffer overflow. Dropped N oldest entries."`
- **Client:** Dashboard continues operating with slightly delayed data. A subtle banner appears: "Metrics aggregation experiencing high load."
- **Recovery:** Once traffic normalizes, the buffer automatically recovers.

---

## EC-OBS-003: Delayed Stream (>5s)

### Scenario
The SSE stream has not sent an update in more than 5 seconds.

### Expected Behavior
- **Client:** After 5 seconds of no events, display a yellow warning pill next to the LIVE badge: "Stream delayed."
- **After 10 seconds:** Change to red: "Stream stale. Reconnecting..."
- **After 15 seconds:** Auto-reconnect the SSE connection.
- **Server:** Heartbeat events are sent every 5 seconds during idle periods to prevent this.

---

## EC-OBS-004: No API Traffic

### Scenario
The system has zero API requests for an extended period (e.g., overnight).

### Expected Behavior
- **Charts:** All request-related charts show flat lines at zero.
- **Latency:** Display "N/A — No requests in this window."
- **Cost:** Show the accumulated daily cost (which may be static if no new requests).
- **Uptime:** Continue showing 100% uptime assuming health checks pass.
- **UI:** No error states, empty states, or alarming colors. The dashboard should look calm, not broken.

---

## EC-OBS-005: Redis Down

### Scenario
Redis is unavailable, breaking the metrics buffer and real-time aggregation.

### Expected Behavior
- **Server:** Fall back to in-memory aggregation with a 60-second sliding window.
- **Limitation:** Metrics from other API instances are lost (each instance aggregates its own).
- **Client:** Display a yellow banner: "Real-time metrics operating in degraded mode."
- **Recovery:** When Redis returns, normal operation resumes automatically within 2 flush cycles (4 seconds).

---

## EC-OBS-006: OpenAI API Unavailable

### Scenario
The OpenAI API is down or severely degraded.

### Expected Behavior
- **Health Check:** The OpenAI API health status transitions to "Degraded" (slow response) or "Down" (no response).
- **Cost Metrics:** Stop accumulating cost until the API recovers. Show the last known cost with a "Cost tracking paused" tooltip.
- **Token Metrics:** Continue showing historical data; new token counters stall at current values.
- **UI:** The service health card for OpenAI API turns red with a pulse animation.

---

## EC-OBS-007: Cost Threshold Exceeded

### Scenario
Daily OpenAI cost exceeds the $5.00 alert threshold.

### Expected Behavior
- **Client:** A persistent warning banner appears at the top of the dashboard:
  - "Daily cost alert: $5.12 exceeded the $5.00 threshold. Consider enabling rate limiting."
- **Color:** Amber background with dark text.
- **Action:** Banner includes a link to the rate limiting settings (if admin) or a generic "Learn More" link (if public).
- **Dismissal:** Banner can be dismissed for the session but reappears on page reload if the threshold is still exceeded.

---

## EC-OBS-008: Browser Tab Backgrounded

### Scenario
The user switches to another tab, causing `requestAnimationFrame` and some timers to throttle.

### Expected Behavior
- **SSE Connection:** Remains open; the browser typically does not throttle SSE.
- **Chart Animations:** Pause while tab is backgrounded to save CPU.
- **On Focus:** Charts reconcile with the latest data and animate smoothly to current values.
- **No Data Loss:** All metric updates received while backgrounded are applied on focus.

---

## EC-OBS-009: Very Large Historical Range

### Scenario
A user selects the 7-day range, which contains tens of thousands of data points.

### Expected Behavior
- **Server:** Return pre-aggregated hourly buckets instead of per-minute data.
- **Client:** Charts render using the aggregated data.
- **Loading:** Show a skeleton shimmer while data is fetched.
- **Performance:** Charts shall render within 1 second of data arrival.

---

## EC-OBS-010: Multiple Concurrent SSE Connections

### Scenario
A user opens the dashboard in multiple tabs or attempts multiple SSE connections.

### Expected Behavior
- **Server:** Rate limit to 1 SSE connection per user session. Additional connections receive `429 Too Many Requests`.
- **Client:** If a connection is rejected, show a message: "Metrics already streaming in another tab."
- **Fallback:** The client falls back to polling every 5 seconds.

---

## EC-OBS-011: Health Check False Positives

### Scenario
A transient network blip causes a single health check to fail.

### Expected Behavior
- **Server:** Require **2 consecutive failures** before marking a service as Down.
- **Degraded Threshold:** 1 failure or latency >2× target marks the service as Degraded.
- **UI:** The service card briefly flickers amber but does not turn red for a single blip.
- **Log:** A `DEBUG` log records the transient failure; no `WARN` unless it becomes persistent.
