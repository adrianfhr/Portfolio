# WebSocket Events — Real-Time Infrastructure

> **Scope:** Shared real-time event protocol  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

This document defines the common event contract for WebSocket-based features such as live logs, multi-agent updates, and realtime status feeds. The goal is to keep event names, payload shapes, and delivery expectations consistent across modules.

## 2. Event Model

### 2.1 Common Envelope

All events should follow a shared envelope with a type field and a data payload.

```json
{
  "type": "log|metric|status|progress|error|heartbeat",
  "source": "logs|metrics|agents|chatbot|vision",
  "trace_id": "trace_abc123",
  "timestamp": "2024-05-01T12:00:00.123Z",
  "data": {}
}
```

### 2.2 Core Event Types

- `heartbeat`: keepalive for active connections.
- `status`: connection, service, or workflow state changes.
- `progress`: long-running task updates.
- `metric`: lightweight operational updates.
- `log`: showcase log lines.
- `error`: recoverable or fatal stream errors.

## 3. Connection Lifecycle

- Client opens a session and identifies its scope.
- Server accepts or rejects based on auth and rate limit rules.
- Heartbeats keep the connection active and measurable.
- Reconnect logic should resume the same logical stream where possible.

## 4. Room and Channel Design

- Use logical channels or rooms for per-module subscriptions.
- Avoid broadcasting private events to all clients.
- Keep admin-only streams separated from public demo streams.

## 5. Delivery Rules

- Preserve ordering per connection where feasible.
- Coalesce non-critical updates during bursts.
- Prefer small payloads over verbose nested structures.

## 6. Failure Handling

- Emit clear errors for auth failure, disconnect, and stale subscriptions.
- Fall back to polling when realtime transport is unavailable.

## 7. Cross-References

- [Streaming Strategy](streaming-strategy.md)
- [Queue Architecture](queue-architecture.md)
- [Failover Strategy](failover-strategy.md)
- [Live Logs Viewer](../03-Core-AI-Modules/Live-Logs/PRD/prd.md)
- [Observability Dashboard](../03-Core-AI-Modules/Observability/PRD/prd.md)