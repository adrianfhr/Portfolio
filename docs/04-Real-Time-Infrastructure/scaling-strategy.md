# Scaling Strategy — Real-Time Infrastructure

> **Scope:** Horizontal and vertical scaling guidance  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

The portfolio should scale predictably under demo traffic without introducing unnecessary complexity. The design favors stateless services, short-lived queues, and horizontally scalable workers.

## 2. Scaling Principles

- Keep API instances stateless.
- Move durable state into Redis or PostgreSQL.
- Scale worker pools independently from the API layer.

## 3. Scaling Targets

- API gateway: horizontal scaling for concurrent requests.
- Worker tier: autoscale based on queue depth and latency.
- Vector store: support read-heavy workloads efficiently.
- WebSocket layer: keep connection counts visible and bounded.

## 4. Bottleneck Management

- Protect expensive inference paths with queueing and rate limits.
- Batch low-priority jobs where possible.
- Avoid synchronous fan-out to many downstream systems.

## 5. Data Layer Considerations

- Use read replicas if relational read volume grows.
- Keep vector index operations isolated from request traffic.
- Ensure cache invalidation does not require full-system restarts.

## 6. Cross-References

- [Queue Architecture](queue-architecture.md)
- [Caching Strategy](caching-strategy.md)
- [Failover Strategy](failover-strategy.md)
- [System Architecture](../02-Architecture-Design/system-architecture.md)