# Metrics Catalog

> **Scope:** Shared metrics definitions  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

This catalog defines the core metrics used by the monitoring dashboard and alerting rules. All metrics should be consistently named and labeled so the dashboard and backend can agree on meaning.

## 2. Core Metrics

| Metric | Type | Labels | Purpose |
|---|---|---|---|
| `api_requests_total` | Counter | endpoint, method, status | Request volume |
| `api_latency_seconds` | Histogram | endpoint | Latency percentiles |
| `openai_tokens_total` | Counter | model, token_type | Token consumption |
| `openai_cost_usd` | Gauge | model | Estimated cost |
| `cache_hits_total` | Counter | cache_name | Cache efficiency |
| `cache_misses_total` | Counter | cache_name | Cache misses |
| `websocket_connections` | Gauge | - | Active live connections |
| `queue_depth` | Gauge | queue_name | Pending work |

## 3. Aggregation Guidance

- Use counters for monotonic values.
- Use histograms for latency distributions.
- Use gauges for current state and cost snapshots.

## 4. Labels and Cardinality

- Keep labels low-cardinality.
- Avoid user-specific labels in public dashboards.
- Use endpoint and model labels only when they are operationally useful.

## 5. Alert Context

- Combine metric thresholds with duration windows.
- Tie alerts to user-visible degradation where possible.

## 6. Cross-References

- [Monitoring](monitoring.md)
- [Observability Dashboard](../03-Core-AI-Modules/Observability/PRD/prd.md)
- [Incident Handling](incident-handling.md)