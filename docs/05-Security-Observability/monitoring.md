# Monitoring

> **Scope:** Observability design and alerting principles  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

Monitoring is the operational lens for the portfolio. It covers metrics, logs, and traces, and it ties the real-time dashboard to alert thresholds that are meaningful for a demo environment.

## 2. Three Pillars

| Pillar | Tooling | Purpose |
|---|---|---|
| Metrics | Prometheus + custom aggregation | Latency, traffic, queue depth, cost |
| Logs | Structured JSON + log pipeline | Request traces, errors, audit events |
| Traces | OpenTelemetry (optional Jaeger) | End-to-end request flow |

## 3. Dashboard Principles

- Surface the most important data first.
- Make live vs. stale states obvious.
- Keep public dashboards aggregate-only.

## 4. Alerting Philosophy

- Alert on sustained issues, not single spikes.
- Keep thresholds simple and tied to real user impact.
- Use warnings to guide attention without overwhelming the operator.

## 5. Service Health

- Health checks should cover API gateway, Redis, PostgreSQL, Qdrant, and external model connectivity.
- Health status should update on a slower cadence than metric snapshots.

## 6. Cross-References

- [Logging Pipeline](logging-pipeline.md)
- [Metrics](metrics.md)
- [Incident Handling](incident-handling.md)
- [Observability Dashboard](../03-Core-AI-Modules/Observability/PRD/prd.md)