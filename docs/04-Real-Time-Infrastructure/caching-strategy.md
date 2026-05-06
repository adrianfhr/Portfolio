# Caching Strategy — Real-Time Infrastructure

> **Scope:** Multi-layer caching for API and UI workloads  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

Caching should reduce latency and cost while keeping live behavior fresh enough for a portfolio demo. The strategy uses short-lived caches for operational data and longer-lived caches for stable reference data.

## 2. Cache Layers

| Layer | Purpose | Typical TTL |
|---|---|---|
| Browser memory | Small UI state and view preferences | Session |
| Redis | Rate limiting, session store, metric buffer, hot responses | Seconds to minutes |
| Application cache | Reused computed data such as model lists or static metadata | Minutes to hours |

## 3. Cache Keys

- Include tenant or session scope where required.
- Include versioning in keys so schema changes do not corrupt old data.
- Keep keys predictable and human-readable.

## 4. Invalidation

- Invalidate immediately after writes that affect user-visible state.
- Use short TTLs for volatile dashboards and live counters.
- Prefer targeted invalidation over global cache flushes.

## 5. Warm-Up and Staleness

- Warm the most frequently used data during startup when possible.
- Use stale-while-revalidate for low-risk display data.
- Do not cache user secrets or per-request sensitive payloads.

## 6. Cross-References

- [Queue Architecture](queue-architecture.md)
- [Failover Strategy](failover-strategy.md)
- [Observability Dashboard](../03-Core-AI-Modules/Observability/PRD/prd.md)