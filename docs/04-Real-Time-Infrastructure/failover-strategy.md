# Failover Strategy — Real-Time Infrastructure

> **Scope:** Service resilience and graceful degradation  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

The failover strategy defines how the system should behave when parts of the real-time stack are unavailable. The goal is to keep the portfolio usable and transparent even when a dependency degrades.

## 2. Failure Detection

- Detect stream failures through timeouts and disconnect events.
- Detect service degradation through health checks and latency spikes.
- Expose degraded state to the observability dashboard quickly.

## 3. Graceful Degradation Paths

| Failure | Fallback |
|---|---|
| Redis unavailable | Use last known values or in-memory fallback where safe |
| Qdrant unavailable | Fall back to keyword search or disabled retrieval state |
| WebSocket unavailable | Fall back to polling or static snapshots |
| SSE unavailable | Preserve final response and show a stale-data indicator |
| Worker outage | Queue jobs for retry or show a pending state |

## 4. Circuit Breakers

- Stop repeatedly calling degraded downstream services.
- Recover with bounded retries and backoff.
- Avoid cascading failures from one failing dependency.

## 5. User Communication

- Show explicit status when the system is degraded.
- Preserve last known values instead of blank screens.
- Make fallback behavior visible so the demo remains trustworthy.

## 6. Cross-References

- [WebSocket Events](websocket-events.md)
- [Streaming Strategy](streaming-strategy.md)
- [Queue Architecture](queue-architecture.md)
- [Caching Strategy](caching-strategy.md)
- [Observability Dashboard](../03-Core-AI-Modules/Observability/PRD/prd.md)