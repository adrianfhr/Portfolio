# WebSocket and Real-Time Architecture

> **Document:** WebSocket and Real-Time Architecture  
> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Version:** 1.0  
> **Status:** Draft  

---

## 1. Executive Summary

The real-time layer of the Interactive AI Engineering Portfolio & Sandbox delivers live, interactive experiences that differentiate the platform from static portfolio sites. This layer supports three distinct transport mechanisms — **Server-Sent Events (SSE)**, **WebSocket**, and **fallback HTTP polling** — each selected to match the specific directional and latency requirements of the feature it serves.

This document specifies the protocol design, connection lifecycle management, message schemas, broadcasting strategies, room/channel organization, reconnection resilience, and scaling considerations for all real-time transports.

---

## 2. Real-Time Transport Selection Matrix

| Feature | Primary Transport | Fallback Transport | Direction | Justification |
|---------|------------------|-------------------|-----------|---------------|
| Chat token streaming | SSE | Long-polling via React Query | Server -> Client | SSE works through corporate proxies; automatic reconnection via Last-Event-ID; no client-side state management needed |
| Live log terminal | WebSocket | SSE -> HTTP polling | Bidirectional | Client must send filter commands; server pushes log lines continuously |
| Agent status updates | WebSocket | HTTP polling | Bidirectional | Client starts/stops workflows; server pushes node-level progress |
| Metrics dashboard | SSE | HTTP polling | Server -> Client | Unidirectional ticker; low overhead; firewall-friendly |
| Notifications / toasts | WebSocket | — | Server -> Client | Low-frequency, event-driven UI updates |

### 2.1 Why Not WebSocket for Everything?

WebSocket is a powerful protocol but introduces complexity that is unnecessary for unidirectional streaming:

- **Connection management:** WebSockets require explicit heartbeat/ping-pong and connection state tracking.
- **Proxy compatibility:** Some corporate firewalls and proxies aggressively close idle WebSocket connections or block the Upgrade header entirely.
- **Load balancer affinity:** WebSocket connections are long-lived and require sticky sessions or shared pub/sub backends for broadcasting.
- **Protocol overhead:** WebSocket frames carry masking overhead; SSE uses plain HTTP with negligible framing cost.

SSE is therefore the default choice for **server-to-client streaming**, while WebSocket is reserved for **true bidirectional** use cases.

---

## 3. WebSocket Protocol Design

### 3.1 Connection Establishment

```
Client                                  Server
  |                                        |
  |  1. GET /ws/{endpoint} HTTP/1.1       |
  |     Connection: Upgrade               |
  |     Upgrade: websocket                |
  |     Sec-WebSocket-Key: dGhlIHNhbXBsZQ==|
  |     Cookie: access_token=eyJ...       |
  |---------------------------------------->|
  |                                        |
  |  2. HTTP/1.1 101 Switching Protocols  |
  |     Upgrade: websocket                |
  |     Sec-WebSocket-Accept: s3pPLMBiTxaQ|
  |<----------------------------------------|
  |                                        |
  |  3. { "type": "auth", "token": "..." }  |
  |---------------------------------------->|
  |                                        |
  |  4. { "type": "auth_success",           |
  |       "user_id": 42, "role": "dev" }   |
  |<----------------------------------------|
  |                                        |
```

**Key points:**
- The WebSocket handshake uses the same cookie-based JWT as HTTP requests, avoiding token-in-query-string security issues.
- An explicit `auth` message is required after handshake to bind the connection to a user identity for room-based broadcasting.
- If authentication fails, the server sends `auth_error` and closes the connection with code `1008` (policy violation).

### 3.2 Connection URL Endpoints

| Endpoint | Purpose | Auth Required | Room Scope |
|----------|---------|--------------|------------|
| `/ws/logs` | Live log stream | No (public showcase) | Global broadcast (`room:logs`) |
| `/ws/agents/{run_id}` | Agent workflow progress | Yes | Per-run isolation (`room:agent:{run_id}`) |
| `/ws/metrics` | Real-time metrics push (alt. to SSE) | No | Global broadcast (`room:metrics`) |
| `/ws/notifications` | User-specific notifications | Yes | Per-user isolation (`room:user:{user_id}`) |

### 3.3 Message Framing

All WebSocket messages are JSON text frames with a mandatory `type` discriminator:

```typescript
type WebSocketMessage = ClientMessage | ServerMessage;

interface BaseMessage {
  type: string;
  timestamp: string;  // ISO 8601
  trace_id?: string;  // Propagated for observability
}
```

#### Client -> Server Messages

```typescript
interface AuthMessage extends BaseMessage {
  type: "auth";
  token: string;  // JWT from HttpOnly cookie (fallback if cookie not forwarded)
}

interface SubscribeMessage extends BaseMessage {
  type: "subscribe";
  room: string;           // e.g., "logs", "agent:run_123"
  filters?: LogFilters;   // Optional filter criteria
}

interface UnsubscribeMessage extends BaseMessage {
  type: "unsubscribe";
  room: string;
}

interface CommandMessage extends BaseMessage {
  type: "command";
  target: string;         // e.g., "agent", "log_stream"
  action: string;         // e.g., "pause", "resume", "filter"
  payload: unknown;
}

interface HeartbeatMessage extends BaseMessage {
  type: "ping";
}
```

#### Server -> Client Messages

```typescript
interface AuthSuccessMessage extends BaseMessage {
  type: "auth_success";
  user_id: number;
  role: "guest" | "developer" | "admin";
}

interface AuthErrorMessage extends BaseMessage {
  type: "auth_error";
  code: string;
  message: string;
}

interface DataMessage extends BaseMessage {
  type: "data";
  room: string;
  payload: unknown;  // Room-specific payload shape
}

interface ErrorMessage extends BaseMessage {
  type: "error";
  code: string;
  message: string;
  room?: string;
}

interface PongMessage extends BaseMessage {
  type: "pong";
}

interface RoomJoinedMessage extends BaseMessage {
  type: "room_joined";
  room: string;
  participant_count: number;
}
```

### 3.4 Heartbeat Mechanism

```
Client                          Server
  |                                |
  |  { "type": "ping" }           |
  |------------------------------->|
  |                                |
  |  { "type": "pong" }           |
  |<-------------------------------|
  |                                |
  (every 30 seconds)              |
```

- **Client heartbeat interval:** 30 seconds
- **Server read timeout:** 60 seconds (2 missed pings)
- **Server write timeout:** 60 seconds
- If the server does not receive a ping within 60 seconds, it closes the connection with code `1001` (going away) to free resources.

---

## 4. Server-Sent Events (SSE) Protocol Design

### 4.1 Connection Establishment

SSE connections are established via standard HTTP GET requests with `Accept: text/event-stream`:

```
GET /api/chat/stream?session_id=sess_abc123 HTTP/1.1
Accept: text/event-stream
Cache-Control: no-cache
Connection: keep-alive
Cookie: access_token=eyJ...
```

The server responds with:

```
HTTP/1.1 200 OK
Content-Type: text/event-stream; charset=utf-8
Cache-Control: no-cache
Connection: keep-alive
X-Accel-Buffering: no

id: 1
event: message
data: {"token": "Hello", "index": 0}

id: 2
event: message
data: {"token": " world", "index": 1}

id: 3
event: done
data: {"finish_reason": "stop", "total_tokens": 42}
```

### 4.2 SSE Endpoints

| Endpoint | Feature | Event Types |
|----------|---------|-------------|
| `GET /api/chat/stream` | Chat token streaming | `message`, `error`, `done` |
| `GET /api/metrics/stream` | Metrics dashboard updates | `metric_update`, `alert` |

### 4.3 Event Format

Each SSE event follows the standard W3C format with custom JSON payloads:

```
id: {sequence_number}          // Monotonic integer for replay
event: {event_type}            // Discriminator for client routing
data: {json_payload}           // Event-specific data
retry: {reconnect_delay_ms}    // Hint for automatic reconnection
```

### 4.4 Reconnection & Event ID Replay

```typescript
// Client-side EventSource with Last-Event-ID
const source = new EventSource('/api/chat/stream');

source.onmessage = (event) => {
  const data = JSON.parse(event.data);
  appendToken(data.token);
  lastEventId = event.lastEventId;  // Persisted to sessionStorage
};

source.onerror = () => {
  source.close();
  // Reconnect with lastEventId to resume stream
  const reconnectSource = new EventSource(
    `/api/chat/stream?last_event_id=${lastEventId}`
  );
};
```

- The server maintains a **circular buffer** of the last 100 events per stream in Redis.
- On reconnection with `Last-Event-ID`, the server replays missed events from the buffer before continuing with live events.
- If the requested event ID is older than the buffer window, the client receives a `reset` event instructing it to refresh the full state.

---

## 5. Connection Management

### 5.1 Connection Lifecycle States

| State | Description | Transitions |
|-------|-------------|-------------|
| `connecting` | Client initiating handshake | -> `authenticating` (success) or -> `failed` (error) |
| `authenticating` | Server validating JWT / guest ID | -> `connected` (success) or -> `closed` (failure) |
| `connected` | Active bidirectional communication | -> `reconnecting` (network issue) or -> `closing` (client logout) |
| `reconnecting` | Client attempting automatic reconnection | -> `connected` (success) or -> `failed` (max retries exceeded) |
| `closing` | Graceful teardown in progress | -> `closed` |
| `closed` | Connection terminated, resources freed | Terminal state |
| `failed` | Unrecoverable error, manual intervention required | Terminal state |

### 5.2 Server-Side Connection Registry

```python
# FastAPI WebSocket connection manager (simplified)
from fastapi import WebSocket
from collections import defaultdict
import asyncio

class ConnectionManager:
    def __init__(self):
        self.active_connections: dict[str, list[WebSocket]] = defaultdict(list)
        self.user_connections: dict[int, list[WebSocket]] = defaultdict(list)
        self.lock = asyncio.Lock()

    async def connect(self, websocket: WebSocket, room: str, user_id: int | None):
        await websocket.accept()
        async with self.lock:
            self.active_connections[room].append(websocket)
            if user_id:
                self.user_connections[user_id].append(websocket)

    async def disconnect(self, websocket: WebSocket, room: str, user_id: int | None):
        async with self.lock:
            self.active_connections[room].remove(websocket)
            if user_id and websocket in self.user_connections[user_id]:
                self.user_connections[user_id].remove(websocket)

    async def broadcast(self, room: str, message: dict):
        dead_connections = []
        for conn in self.active_connections.get(room, []):
            try:
                await conn.send_json(message)
            except RuntimeError:
                dead_connections.append(conn)
        # Cleanup dead connections
        for dead in dead_connections:
            self.active_connections[room].remove(dead)
```

### 5.3 Connection Limits

| Resource | Limit | Enforcement |
|----------|-------|-------------|
| Max WebSocket connections per IP | 5 | Rate limiter middleware |
| Max SSE connections per IP | 3 | Rate limiter middleware |
| Max concurrent rooms per WebSocket | 10 | Server rejects `subscribe` beyond limit |
| Message size limit | 64 KB | Server drops oversized frames |
| Connection idle timeout | 60 seconds | Server closes inactive connections |

---

## 6. Room / Channel Design

### 6.1 Room Taxonomy

Rooms are logical broadcast groups that determine which clients receive which messages.

| Room Pattern | Scope | Example Members | Message Volume |
|-------------|-------|-----------------|----------------|
| `logs` | Global public | All connected clients on `/ws/logs` | High (~10 msg/sec) |
| `metrics` | Global public | All dashboard viewers | Medium (~1 msg/2 sec) |
| `agent:{run_id}` | Per-workflow isolated | Client who started workflow + admin observers | Low-Medium |
| `user:{user_id}` | Per-user private | All sessions of a single user | Low |
| `admin` | Role-restricted | Admin-role users only | Low |

### 6.2 Room Subscription Flow

```
Client (WebSocket)
  |
  |-- subscribe -> { "type": "subscribe", "room": "agent:run_123" }
  |
Server
  |
  |-- Validate room access (is user authorized for this run_id?)
  |-- Add connection to room registry
  |-- Emit room_joined confirmation
  |-- Begin broadcasting room-specific messages
```

### 6.3 Room Authorization Rules

| Room | Auth Required | Authorization Logic |
|------|--------------|---------------------|
| `logs` | No | Public showcase; no restrictions |
| `metrics` | No | Public showcase; no restrictions |
| `agent:{run_id}` | Yes | User must be workflow owner OR role == admin |
| `user:{user_id}` | Yes | User must match `user_id` OR role == admin |
| `admin` | Yes | Role must be `admin` |

---

## 7. Broadcasting Strategy

### 7.1 Single-Server Broadcasting

In single-server deployments (default for portfolio showcase), broadcasting is handled entirely in-memory via the `ConnectionManager` registry:

```python
# In-memory broadcast (single server)
await manager.broadcast("logs", {
    "type": "data",
    "room": "logs",
    "payload": log_line,
    "timestamp": datetime.utcnow().isoformat()
})
```

### 7.2 Multi-Server Broadcasting (Future Scaling)

When scaling to multiple FastAPI instances behind a load balancer, in-memory registries become insufficient. The architecture uses **Redis Pub/Sub** as the cross-server message bus:

```
Server A (has clients in room:logs)
  |
  |-- PUBLISH ws:room:logs {message_json}
  |
Redis Pub/Sub
  |
  |-- Broadcast to all subscribers
  |
Server B (has clients in room:logs)
  |-- Receives message from Redis
  |-- Iterates local connections in room:logs
  |-- Sends WebSocket frame to each client
```

**Implementation sketch:**

```python
import aioredis

async def redis_broadcast_listener():
    redis = aioredis.from_url("redis://redis:6379")
    pubsub = redis.pubsub()
    await pubsub.subscribe("ws:room:*")
    
    async for message in pubsub.listen():
        if message["type"] == "message":
            room = message["channel"].decode().replace("ws:room:", "")
            payload = json.loads(message["data"])
            await manager.broadcast(room, payload)
```

### 7.3 Message Deduplication

In multi-server setups, a client connected through Server B should not receive duplicate messages if Server B both (a) receives the Redis pub/sub message and (b) already has the message from local origin. Deduplication is handled via:

- **Server origin tagging:** Each message includes `origin_server_id`; servers skip broadcasting messages they originated (they already sent them locally).
- **Client-side sequence numbers:** SSE events include monotonic `id` fields; clients ignore events with IDs they have already processed.

---

## 8. Reconnection & Resilience

### 8.1 WebSocket Reconnection Strategy

```typescript
// Client-side reconnection logic (React hook)
function useWebSocket(url: string) {
  const [state, setState] = useState<'connecting' | 'connected' | 'reconnecting' | 'failed'>('connecting');
  const wsRef = useRef<WebSocket | null>(null);
  const retryCount = useRef(0);
  const maxRetries = 5;
  const baseDelay = 1000; // 1 second

  const connect = () => {
    const ws = new WebSocket(url);
    wsRef.current = ws;

    ws.onopen = () => {
      retryCount.current = 0;
      setState('connected');
      ws.send(JSON.stringify({ type: 'auth', token: getToken() }));
    };

    ws.onclose = (event) => {
      if (event.code === 1000 || event.code === 1001) {
        // Normal closure, don't reconnect
        setState('failed');
        return;
      }
      
      if (retryCount.current < maxRetries) {
        setState('reconnecting');
        const delay = Math.min(baseDelay * Math.pow(2, retryCount.current), 30000);
        setTimeout(connect, delay);
        retryCount.current++;
      } else {
        setState('failed');
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  };

  useEffect(() => {
    connect();
    return () => wsRef.current?.close(1000, 'Component unmounted');
  }, [url]);

  return { state, send: wsRef.current?.send.bind(wsRef.current) };
}
```

**Reconfiguration parameters:**

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Base retry delay | 1 second | Immediate reconnection attempt |
| Max retry delay | 30 seconds | Prevents thundering herd on server recovery |
| Exponential backoff multiplier | 2x | Standard exponential backoff |
| Max retries | 5 | ~31 seconds total retry window before giving up |
| Normal closure codes | 1000, 1001 | Client-initiated or server-maintenance closure; no reconnect |

### 8.2 SSE Reconnection Strategy

SSE reconnection is handled automatically by the browser's `EventSource` implementation:

```typescript
const source = new EventSource('/api/metrics/stream');

source.onopen = () => {
  console.log('SSE connection established');
};

source.onerror = (error) => {
  if (source.readyState === EventSource.CLOSED) {
    // Browser will automatically reconnect with Last-Event-ID
    console.log('SSE disconnected, auto-reconnecting...');
  }
};
```

The server must set appropriate `retry:` values in SSE events to guide browser reconnection timing:

```
event: metric_update
retry: 3000
data: {"latency_p50": 120, "latency_p99": 450}
```

### 8.3 Fallback to HTTP Polling

If both WebSocket and SSE fail after maximum retry attempts, the client falls back to HTTP polling:

```typescript
// Fallback polling for metrics (React Query)
const { data: metrics } = useQuery({
  queryKey: ['metrics', 'snapshot'],
  queryFn: fetchMetricsSnapshot,
  refetchInterval: pollingEnabled ? 5000 : false,
  enabled: !sseConnected && !wsConnected,
});
```

| Feature | WebSocket | SSE | Fallback Polling |
|---------|-----------|-----|------------------|
| Latency | < 100ms | < 100ms | ~5 seconds |
| Server overhead | Medium (per-connection state) | Low (HTTP keep-alive) | High (repeated request/response) |
| Proxy compatibility | Poor | Excellent | Excellent |
| Bidirectional | Yes | No | No |

---

## 9. Scaling WebSocket Connections

### 9.1 Vertical Scaling (Single Server)

A single Uvicorn worker process with asyncio can comfortably handle:

| Metric | Estimate | Notes |
|--------|----------|-------|
| Concurrent WebSocket connections | 5,000 - 10,000 | Depends on message frequency and payload size |
| SSE connections | 10,000+ | Lower per-connection overhead than WebSocket |
| Messages per second (broadcast) | 5,000 - 10,000 | In-memory fan-out |

### 9.2 Horizontal Scaling (Multi-Server)

When scaling beyond a single server instance:

```
                    Load Balancer (Layer 7)
                           |
           +---------------+---------------+
           |               |               |
      [Server A]      [Server B]      [Server C]
           |               |               |
           +---------------+---------------+
                           |
                     Redis Pub/Sub
                           |
                     Shared State
```

**Scaling considerations:**

1. **Sticky sessions (optional):** If using in-memory connection registries without Redis pub/sub, a load balancer with IP hash sticky sessions ensures clients always reconnect to the same server.
2. **Shared pub/sub (preferred):** Redis pub/sub eliminates the need for sticky sessions, enabling true stateless horizontal scaling.
3. **Connection draining:** Before server shutdown, the application stops accepting new WebSocket handshakes, broadcasts a `server_shutdown` message to existing connections, and gracefully closes them with code `1001`.

### 9.3 Resource Requirements

| Deployment | Connections | CPU Cores | RAM | Network |
|-----------|-------------|-----------|-----|---------|
| Development (local) | < 50 | 1 | 512 MB | Minimal |
| Portfolio showcase | 500 | 2 | 2 GB | 10 Mbps |
| Production (scaled) | 10,000+ | 4+ | 8 GB+ | 1 Gbps |

---

## 10. Security Considerations

### 10.1 Authentication Over WebSocket

- **Primary:** Cookie-based JWT transmitted during HTTP handshake (`Cookie: access_token=...`).
- **Secondary:** If cookies are not available (e.g., certain mobile WebView contexts), the client sends an `auth` message with the token immediately after connection.
- **Rejected:** Tokens in query strings (`?token=...`) are never used, as they may be logged by proxies and servers.

### 10.2 Input Validation

- All WebSocket messages are validated against Pydantic schemas before processing.
- Malformed JSON or missing required fields result in an `error` message and connection closure if the error is severe.
- Message payload size is limited to 64 KB to prevent memory exhaustion attacks.

### 10.3 Rate Limiting

- WebSocket connections count toward the user's overall rate limit budget.
- Excessive message frequency (> 100 messages/minute per connection) triggers automatic connection closure with code `1008`.
- SSE connections are subject to the same per-IP connection limits as WebSocket.

### 10.4 Room Isolation

- A client cannot subscribe to `room:user:{other_user_id}` without admin privileges.
- `room:agent:{run_id}` membership is verified against PostgreSQL workflow ownership records.
- Direct client-to-client messaging is not supported; all messages are brokered through the server.

---

*Document maintained by the Real-Time Systems Team. Last updated: 2026-05-06.*
