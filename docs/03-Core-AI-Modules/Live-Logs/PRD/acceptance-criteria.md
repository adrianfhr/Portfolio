# Live Logs Viewer — Acceptance Criteria

> **Module:** Live Logs Viewer  
> **Version:** 1.0

## AC-LOG-001: Live Stream

- [ ] Log lines appear in the terminal soon after backend events occur.
- [ ] The UI shows when the WebSocket stream is connected or reconnecting.
- [ ] The stream recovers automatically after a temporary disconnect.

## AC-LOG-002: Filtering and Search

- [ ] Users can filter by level.
- [ ] Users can filter by module.
- [ ] Keyword search works on the visible log buffer.

## AC-LOG-003: Buffer Management

- [ ] The terminal keeps only the newest 100 visible lines.
- [ ] Older entries are removed automatically.
- [ ] The UI remains responsive during long sessions.

## AC-LOG-004: Security

- [ ] Sensitive values such as tokens and passwords never appear in the logs.
- [ ] Only showcase-tagged logs are broadcast.

## AC-LOG-005: UX

- [ ] Auto-scroll pauses when the user manually scrolls away from the bottom.
- [ ] Collapse and expand preserve the connection state.
- [ ] Export and clear actions work on the visible buffer.