# AI Playground — Edge Cases

> **Module:** AI Playground  
> **Version:** 1.0

---

## EC-AIPLAY-001: Invalid Parameter Values

### Scenario
A user manually enters a temperature of `5.0` or a negative `max_tokens`.

### Expected Behavior
- **Client:** Input validation clamps the value to the allowed range or rejects submission with a field-level error.
- **Server:** Pydantic validation returns `400 Bad Request` with a detailed error message indicating which parameter is invalid and its valid range.
- **UI:** The invalid field is highlighted in red with a tooltip explaining the constraint.

---

## EC-AIPLAY-002: Unsupported or Disabled Model

### Scenario
A user selects a model that has been temporarily disabled or is not configured.

### Expected Behavior
- **Client:** Disabled models appear grayed out in the selector with a "Unavailable" badge.
- **Server:** If a disabled model ID is sent anyway, return `503 Service Unavailable` with a message like `"Model 'gpt-4o' is temporarily disabled."`
- **UI:** Auto-fallback to the default model (`gpt-4o-mini`) with a toast notification.

---

## EC-AIPLAY-003: Quota Exceeded

### Scenario
A guest or developer user has exhausted their daily request quota.

### Expected Behavior
- **Client:** The send button becomes disabled with a tooltip: `"Daily quota exhausted. Resets at midnight UTC."`
- **Server:** Return `429 Too Many Requests` with `Retry-After` header indicating seconds until reset.
- **UI:** Display a banner suggesting GitHub OAuth upgrade for higher limits.

---

## EC-AIPLAY-004: Very High Max Tokens

### Scenario
A user sets `max_tokens` to 2000 and submits a minimal prompt.

### Expected Behavior
- **Client:** A warning tooltip appears: `"High token limit may increase cost and latency."`
- **Server:** Honor the request but enforce the hard cap of 2000. If the model stops early due to content filters, include `finish_reason: "content_filter"` in the SSE `done` event.
- **UI:** Cost estimate updates dynamically to reflect worst-case pricing before send.

---

## EC-AIPLAY-005: Empty or Whitespace-Only Prompt

### Scenario
A user submits an empty message or only whitespace.

### Expected Behavior
- **Client:** The send button is disabled when the input is empty or contains only whitespace/newlines.
- **Server:** If bypassed, return `400 Bad Request` with `"Message cannot be empty."`
- **UI:** Input field shakes subtly (animation) to indicate invalid state.

---

## EC-AIPLAY-006: Concurrent Requests

### Scenario
A user rapidly clicks Send multiple times or opens comparison mode while a single request is active.

### Expected Behavior
- **Client:** The send button is disabled and shows a loading spinner until the current stream completes or is aborted.
- **Server:** Reject overlapping requests from the same session with `409 Conflict` unless in comparison mode (which uses separate session tokens).
- **Comparison Mode:** Two concurrent SSE connections are allowed; a third attempt is blocked.

---

## EC-AIPLAY-007: SSE Connection Drop

### Scenario
The user's network disconnects mid-stream.

### Expected Behavior
- **Client:** Display a "Reconnecting..." toast. Attempt reconnection with exponential backoff (1s, 2s, 4s). After 3 failures, show "Connection failed. Please try again."
- **Server:** Terminate stale connections after 60s of no client heartbeat.
- **UI:** Preserve all tokens received so far. Do not auto-clear the partial response.

---

## EC-AIPLAY-008: Prompt Injection Attempt

### Scenario
A user enters a system prompt containing injection keywords.

### Expected Behavior
- **Client:** No client-side blocking (to avoid revealing detection logic).
- **Server:** Scan the `system_prompt` field. If injection keywords are detected, return `400 Bad Request` with a generic message: `"Invalid system prompt format."`
- **Audit:** Log the attempt (without the prompt content) for abuse pattern analysis.

---

## EC-AIPLAY-009: Browser Local Storage Full

### Scenario
The user's Local Storage is at capacity (typically 5-10MB).

### Expected Behavior
- **Client:** Catch `QuotaExceededError` on `localStorage.setItem()`. Show a non-blocking banner: `"History storage full. Older items will be removed."`
- **Recovery:** Automatically trim history to the most recent 25 items and retry.

---

## EC-AIPLAY-010: OpenAI API Timeout or Error

### Scenario
The OpenAI API returns a 500-level error or times out after 30s.

### Expected Behavior
- **Server:** Return a structured SSE error event: `event: error\ndata: {"code": "upstream_error", "message": "Model service temporarily unavailable."}`
- **Client:** Display the error message in a red toast banner. Do not leave the user waiting indefinitely.
- **Fallback:** If a fallback model is configured (e.g., `gpt-3.5-turbo` for `gpt-4o`), offer a "Try with fallback model" button.

---

## EC-AIPLAY-011: Mobile Comparison Mode

### Scenario
A user activates comparison mode on a screen narrower than 768px.

### Expected Behavior
- **Client:** Panels stack vertically instead of side-by-side.
- **Sync Prompt:** A floating action button allows quick prompt sync between panels.
- **Performance:** Only one SSE stream is visually active at a time if bandwidth is constrained; the other pauses rendering until scrolled into view.
