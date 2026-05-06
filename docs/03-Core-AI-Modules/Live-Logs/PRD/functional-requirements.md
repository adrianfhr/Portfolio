# Live Logs Viewer — Functional Requirements

> **Module:** Live Logs Viewer  
> **Version:** 1.0

## 1. Tag-Based Broadcast

- Broadcast only logs marked for showcase display.
- Drop internal-only logs before they leave the backend.
- Keep all broadcasts associated with the current session context.

## 2. Structured Logging

- Emit logs in a JSON structure.
- Include timestamp, level, module, message, metadata, and trace ID.
- Preserve a stable field schema across modules.

## 3. WebSocket Delivery

- Stream logs to the browser over WebSocket.
- Support reconnect attempts after a disconnect.
- Reflect connection status in the UI.

## 4. Filtering

- Filter by severity level.
- Filter by module name.
- Search by keywords in the visible buffer.

## 5. Terminal Buffer Management

- Keep only the newest 100 lines in the DOM.
- Remove older items as new ones arrive.
- Avoid memory leaks during long viewing sessions.

## 6. Export and Clear

- Allow the user to clear the visible log buffer.
- Allow export of the visible buffer as JSON.
- Keep export limited to the current filtered view.

## 7. Connection Awareness

- Show when the stream is live, reconnecting, or offline.
- Resume the stream with the current filters after reconnect.

## 8. Redaction and Safety

- Redact secrets before broadcast.
- Suppress private or verbose internal traces.
- Restrict one live log subscription per session.