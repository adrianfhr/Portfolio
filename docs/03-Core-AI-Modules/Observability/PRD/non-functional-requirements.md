# Observability Dashboard — Non-Functional Requirements

> **Module:** Observability Dashboard  
> **Version:** 1.0

## 1. Performance

- Metric collection should add minimal overhead to API requests.
- Dashboard updates should remain responsive even with continuous streaming.
- Chart rendering should remain smooth under normal demo traffic.

## 2. Reliability

- The dashboard must remain usable when a single dependency is down.
- The UI should degrade to last known values if the live stream is interrupted.
- Health probes should tolerate transient failures without cascading errors.

## 3. Accuracy

- Cost figures should stay close to the backend estimate and remain clearly labeled as estimates.
- Health status should reflect real service checks rather than static placeholders.
- Metric labels and time windows must be consistent across views.

## 4. Security

- Only aggregate metrics may be publicly exposed.
- Admin-only data must require authorization.
- The dashboard must not leak secrets, tokens, or internal service paths.

## 5. Usability

- Important status changes should be obvious at a glance.
- The page should remain readable on smaller screens.
- Missing data should look intentional, not broken.

## 6. Accessibility

- Charts and status cards should have text equivalents or labels.
- Color-based status indicators must include text or icon support.
- Keyboard navigation should reach all interactive dashboard controls.

## 7. Maintainability

- The metric catalog should be centralized and documented.
- Adding a new metric should not require redesigning the page.
- Refresh intervals should be easy to tune per environment.# Observability (Monitoring Dashboard) — Non-Functional Requirements

> **Module:** Observability  
> **Version:** 1.0

---

## NFR-OBS-001: Performance

### Description
The dashboard must render and update efficiently without impacting the system it monitors.

### Requirements
- **NFR-OBS-001.1:** **SSE Latency:** Metric events shall reach the client within **3 seconds** of the data being available.
- **NFR-OBS-001.2:** **Chart Rendering:** Historical charts with up to 1000 data points shall render in under **500ms**.
- **NFR-OBS-001.3:** **Dashboard Load:** The initial dashboard page shall become interactive within **1.5 seconds**.
- **NFR-OBS-001.4:** **Metric Collection Overhead:** Middleware metric collection shall add less than **1ms** per request.
- **NFR-OBS-001.5:** **Concurrent Viewers:** The SSE endpoint shall support at least **50 concurrent connections** per API instance.

---

## NFR-OBS-002: Reliability

### Description
The monitoring system must be resilient to its own failures and not amplify outages.

### Requirements
- **NFR-OBS-002.1:** **Buffer Overflow:** If the Redis metrics buffer exceeds 10,000 entries, old entries shall be dropped (FIFO) with a warning logged.
- **NFR-OBS-002.2:** **Stale Data Warning:** If the SSE stream has not received an update in >5 seconds, the UI shall display a "Data may be stale" warning.
- **NFR-OBS-002.3:** **Redis Down Fallback:** If Redis is unavailable, metrics shall be aggregated in-memory with a 60-second window and a degraded banner shown.
- **NFR-OBS-002.4:** **No Traffic Handling:** If no API requests have occurred in the current window, charts shall display flat lines at zero rather than showing errors.
- **NFR-OBS-002.5:** **Self-Healing:** The health check system shall auto-recover when a degraded service returns to normal (no manual intervention).

---

## NFR-OBS-003: Security

### Description
Prevent information leakage and ensure appropriate access control.

### Requirements
- **NFR-OBS-003.1:** **Aggregate Only:** Public metrics shall expose only aggregated data. No user-identifiable information (IP addresses, user IDs, message content) shall appear in metrics.
- **NFR-OBS-003.2:** **Health Endpoint Openness:** The `/api/v1/health` endpoint may remain open (no auth required) to support external uptime monitoring.
- **NFR-OBS-003.3:** **Admin Breakdown:** Per-user or per-endpoint detailed breakdowns shall require an `admin` role JWT.
- **NFR-OBS-003.4:** **Cost Data Sensitivity:** Daily cost totals are public; hourly cost granularity requires admin role.
- **NFR-OBS-003.5:** **Rate Limiting:** The metrics SSE endpoint shall be rate-limited to **1 connection per user** to prevent resource exhaustion.

---

## NFR-OBS-004: Data Retention

### Description
Define how long metric data is retained at each storage tier.

### Requirements
- **NFR-OBS-004.1:** **Redis Real-Time Buffer:** 1 hour TTL for raw metric buffers.
- **NFR-OBS-004.2:** **Redis Aggregates:** 24 hours TTL for 1-minute aggregated buckets.
- **NFR-OBS-004.3:** **PostgreSQL Raw Metrics:** 7 days retention for individual request metrics.
- **NFR-OBS-004.4:** **PostgreSQL Aggregates:** 30 days retention for hourly aggregations.
- **NFR-OBS-004.5:** **PostgreSQL Daily Summaries:** Indefinite retention for daily cost and usage summaries.

---

## NFR-OBS-005: Accuracy

### Description
Metrics must accurately reflect system behavior.

### Requirements
- **NFR-OBS-005.1:** **Latency Accuracy:** Client-displayed P50/P90/P99 shall be within **5%** of values computed by Prometheus or direct histogram analysis.
- **NFR-OBS-005.2:** **Cost Accuracy:** Estimated costs shall be within **10%** of actual OpenAI billing.
- **NFR-OBS-005.3:** **Uptime Calculation:** Uptime percentage shall be calculated as `(total_time - downtime) / total_time` where downtime is defined as API gateway returning 5xx or no response for >30s.
- **NFR-OBS-005.4:** **Clock Synchronization:** All metric timestamps shall use UTC to prevent timezone-related discrepancies.

---

## NFR-OBS-006: Browser Compatibility

### Requirements
- **NFR-OBS-006.1:** Fully functional on Chrome, Firefox, Safari, and Edge (last 2 major versions).
- **NFR-OBS-006.2:** Charts render correctly on high-DPI (Retina) displays.
- **NFR-OBS-006.3:** Responsive layout from **320px** to **2560px**.
