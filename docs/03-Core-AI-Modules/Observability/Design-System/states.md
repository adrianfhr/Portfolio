# Observability Dashboard — States

> **Module:** Observability Dashboard  
> **Version:** 1.0

## 1. Primary States

### 1.1 Loading
- Initial metrics are being fetched.
- The UI shows skeleton cards and placeholder chart surfaces.

### 1.2 Live
- Metrics are updating regularly.
- The LIVE badge and status cards are visible.

### 1.3 Stale
- Live updates paused or the stream is delayed.
- The dashboard keeps the last known values and shows a warning.

### 1.4 Degraded
- One or more services are unhealthy.
- The status cards show amber or red indicators.

### 1.5 Empty
- No traffic or no data window.
- The charts show zero or placeholder states instead of errors.

### 1.6 Error
- The dashboard cannot fetch the current snapshot.
- An error banner and retry action appear while preserving prior data where possible.

## 2. Transition Rules

- Loading -> Live when the first snapshot arrives.
- Live -> Stale when updates stop beyond the timeout threshold.
- Live -> Degraded when health checks report service issues.
- Any active state -> Error when the fetch fails entirely.