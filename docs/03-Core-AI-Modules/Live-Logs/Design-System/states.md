# Live Logs Viewer — States

> **Module:** Live Logs Viewer  
> **Version:** 1.0

## 1. Primary States

### 1.1 Closed
- Terminal is collapsed into a small tab.
- Stream may remain active in the background.

### 1.2 Connecting
- WebSocket handshake is in progress.
- Header shows a connecting indicator.

### 1.3 Live
- Stream is active and lines are arriving.
- Auto-scroll may be enabled.

### 1.4 Paused
- User scrolled away from the bottom.
- New logs continue to arrive but auto-scroll stays suspended.

### 1.5 Reconnecting
- Connection dropped temporarily.
- UI shows retry behavior and keeps the existing buffer visible.

### 1.6 Error
- Stream cannot be established after retries.
- The UI shows a retry prompt and preserves current lines.

## 2. Severity States

- DEBUG: subdued color.
- INFO: neutral readable color.
- WARN: amber or orange emphasis.
- ERROR: red emphasis.