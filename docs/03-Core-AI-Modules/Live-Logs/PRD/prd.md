# Live Logs Viewer — Product Requirements Document

> **Module ID:** M-LOG-001  
> **Version:** 1.0  
> **Status:** Draft  
> **Owner:** AI Engineering Portfolio Team  
> **Priority:** High  
> **Category:** Infrastructure / Transparency  
> **Dependencies:** WebSocket, Structured Logger, Redis Pub/Sub, Authentication Module

## 1. Objective

Expose the backend execution flow in real time so visitors can see the system working as they interact with it. The log terminal should make the portfolio feel alive, auditable, and technically honest.

## 2. User Stories

### 2.1 Transparency Proof
As a skeptical visitor, I want to see raw operational logs so I can verify that the system is actually performing retrieval, inference, and routing work.

### 2.2 Debug Insight
As a reviewer or engineer, I want to inspect request flow, error traces, and latency details so I can evaluate engineering maturity.

### 2.3 Real-Time Feel
As a visitor, I want the terminal to update continuously while I interact with the site so that the platform feels dynamic and responsive.

## 3. Functional Requirements

### 3.1 Log Tagging
- Only broadcast logs tagged for showcase viewing.
- Keep internal or sensitive logs out of the public stream.
- Preserve structured fields such as timestamp, module, event, and trace ID.

### 3.2 Structured Log Format
- Emit JSON log entries with a stable schema.
- Include timestamp, severity level, module, message, metadata, and trace ID.
- Normalize timestamps to a consistent display format in the terminal.

### 3.3 Live Broadcast
- Broadcast logs to connected clients over WebSocket.
- Keep end-to-end delay below the configured visible threshold.
- Support multiple active sessions without cross-leaking private data.

### 3.4 Filtering and Search
- Filter by level and module on the client and server.
- Support keyword search within the visible log buffer.
- Allow quick clearing and export of the current view.

### 3.5 Retention and Memory Safety
- Keep only the most recent 100 visible lines in the terminal DOM.
- Remove older lines using FIFO behavior.
- Prevent unbounded memory growth during long sessions.

### 3.6 Connection Handling
- Reconnect automatically if the WebSocket disconnects.
- Show connection state in the terminal header.
- Maintain the current filter state across reconnects.

## 4. Non-Functional Requirements

### 4.1 Performance
- Broadcast latency should stay low enough to feel immediate.
- Log filtering should not noticeably delay the UI.
- Terminal rendering should remain stable under bursty log traffic.

### 4.2 Reliability
- Temporary disconnects must recover without manual refresh.
- Long message bursts should not crash the browser.
- The terminal should degrade gracefully when no new logs arrive.

### 4.3 Security
- Redact passwords, tokens, secrets, API keys, and authorization headers before broadcast.
- Do not expose internal-only logs or trace payloads.
- Limit each session to a single active log stream.

### 4.4 Accessibility
- The log terminal must remain keyboard accessible.
- Status changes should be announced through accessible labels or live regions.

## 5. UI/UX Requirements

### 5.1 Terminal Layout
- Place the terminal as a docked panel that can expand, collapse, or float.
- Use a dark console aesthetic with monospace typography.
- Keep the latest log lines visible by default.

### 5.2 Log Line Presentation
- Display timestamp, level, module, and message inline.
- Color-code levels and optionally modules.
- Truncate long messages with a readable expansion path.

### 5.3 Controls
- Provide level, module, and search filters.
- Add a clear button and an optional export action.
- Preserve panel state in session storage.

## 6. API & Data Contract

### 6.1 WebSocket Stream
`WS /api/v1/ws/logs`

Query params:
- `level=INFO`
- `modules=chatbot,vision`

Server-to-client message:
```json
{
  "type": "log",
  "data": {
    "timestamp": "2024-05-01T12:00:00.123Z",
    "level": "INFO",
    "module": "chatbot",
    "message": "Retrieved 3 documents from Qdrant",
    "metadata": {"latency_ms": 45}
  }
}
```

Client-to-server message:
```json
{
  "type": "filter",
  "level": "WARN",
  "modules": ["auth", "chatbot"]
}
```

## 7. Acceptance Criteria

- [ ] Logs appear in the terminal within the target visibility window.
- [ ] The terminal keeps only the most recent 100 lines.
- [ ] Filtering by level and module works as expected.
- [ ] Auto-scroll pauses when the user scrolls manually.
- [ ] Collapse and expand do not drop the WebSocket connection.
- [ ] Sensitive fields never appear in the terminal.
- [ ] Log timestamps remain consistent and readable.

## 8. Edge Cases

- Log bursts should be buffered or batched rather than rendering every message instantly.
- WebSocket disconnects should trigger exponential backoff reconnect attempts.
- Very long messages should be truncated with access to the full content.
- Empty periods should preserve existing logs instead of showing a blank state.
- Multiple modules logging at once should still remain readable.

## 9. Security Requirements

- Mask all sensitive fields before broadcast.
- Ignore logs without the showcase tag.
- Restrict stream access to the current session.
- Avoid sending private stack traces or credentials to the browser.

## 10. Dependencies

| Dependency | Purpose |
|---|---|
| WebSocket | Real-time log delivery |
| Structured Logger | JSON log generation |
| Redis Pub/Sub | Multi-instance log fan-out |
| Authentication Module | Session-level stream access |

## 11. Cross-References

- [System Architecture](../../02-Architecture-Design/system-architecture.md)
- [Monitoring Dashboard](../Observability/PRD/prd.md)
- [Authentication Strategy](../../05-Security-Observability/auth-strategy.md)
- [Logging Pipeline](../../05-Security-Observability/logging-pipeline.md)