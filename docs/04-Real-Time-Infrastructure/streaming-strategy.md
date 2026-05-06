# Streaming Strategy — Real-Time Infrastructure

> **Scope:** SSE and WebSocket delivery patterns  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

Streaming must use the right transport for the right interaction. Unidirectional content should prefer SSE, while bidirectional or multiplexed updates should use WebSocket.

## 2. Transport Matrix

| Use Case | Recommended Transport | Reason |
|---|---|---|
| Chat token streaming | SSE | Simple one-way stream with low client complexity |
| Metrics dashboard | SSE | Efficient server push for live snapshots |
| Live logs | WebSocket | Continuous bi-directional subscription and filtering |
| Multi-agent workflow | WebSocket | Workflow progress, node state, and commands |
| Health notifications | SSE or WebSocket | Depends on whether client acknowledgements are needed |

## 3. SSE Pattern

- Use for token-by-token or snapshot delivery.
- Keep event payloads compact.
- Send keepalive comments or heartbeat messages so proxies do not close idle streams.

## 4. WebSocket Pattern

- Use for live logs, workflow orchestration, and interaction-heavy updates.
- Include subscription messages so clients can change filters without reconnecting.
- Prefer small, typed events over raw free-form strings.

## 5. Backpressure and Chunking

- Break large outputs into small chunks.
- Buffer when the client falls behind.
- Avoid flooding the browser with high-frequency nonessential updates.

## 6. Disconnect Handling

- If the stream breaks, keep the latest known state in the UI.
- Attempt reconnect with backoff.
- Resume from the last known cursor or snapshot where possible.

## 7. Cross-References

- [WebSocket Events](websocket-events.md)
- [Live Logs Viewer](../03-Core-AI-Modules/Live-Logs/PRD/prd.md)
- [Observability Dashboard](../03-Core-AI-Modules/Observability/PRD/prd.md)
- [RAG Chatbot](../03-Core-AI-Modules/RAG-Chatbot/PRD/prd.md)
- [Multi-Agent System](../03-Core-AI-Modules/Multi-Agent-System/PRD/prd.md)