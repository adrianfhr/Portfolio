# AI Playground — Non-Functional Requirements

> **Module:** AI Playground  
> **Version:** 1.0

---

## NFR-AIPLAY-001: Performance

### Description
The playground must feel instantaneous and responsive under normal load.

### Requirements
- **NFR-AIPLAY-001.1:** **Time to First Token (TTFT):** The SSE stream shall begin delivering tokens within **1.5 seconds** of the user pressing Send for 95% of requests.
- **NFR-AIPLAY-001.2:** **UI Responsiveness:** Parameter sliders, input fields, and preset buttons shall respond to interaction within **16ms** (1 frame at 60fps).
- **NFR-AIPLAY-001.3:** **Token Stream Rate:** The UI shall smoothly render tokens at up to **30 tokens per second** without frame drops.
- **NFR-AIPLAY-001.4:** **History Load:** Loading the last 50 history items from Local Storage shall complete in under **100ms**.
- **NFR-AIPLAY-001.5:** **Comparison Mode:** Running two simultaneous SSE streams shall not degrade either stream's TTFT by more than **20%**.

---

## NFR-AIPLAY-002: Reliability

### Description
The module must gracefully handle errors, network instability, and resource constraints.

### Requirements
- **NFR-AIPLAY-002.1:** **SSE Reconnection:** If the SSE connection drops, the UI shall display a "Connection lost — reconnecting..." message with exponential backoff (max 3 retries).
- **NFR-AIPLAY-002.2:** **Partial Response Preservation:** If a stream aborts mid-response, the already-received tokens shall remain visible and editable.
- **NFR-AIPLAY-002.3:** **Local Storage Resilience:** If Local Storage is full or unavailable, the module shall disable history silently and show an unobtrusive warning banner.
- **NFR-AIPLAY-002.4:** **Rate Limiting:** When the rate limit is hit, the UI shall display a clear message with the time until the next quota window.

---

## NFR-AIPLAY-003: Security

### Description
Protect against abuse, prompt injection, and data leakage.

### Requirements
- **NFR-AIPLAY-003.1:** **Payload Validation:** All requests shall be validated by Pydantic models server-side; max payload size is **50KB**.
- **NFR-AIPLAY-003.2:** **System Prompt Sanitization:** The system prompt shall be scanned for known prompt-injection keywords (`ignore previous instructions`, `system prompt`, `you are now`, `DAN`, `jailbreak`). If detected, the request shall be rejected with a 400 error.
- **NFR-AIPLAY-003.3:** **Abuse Detection:** More than **20 requests per minute** from a single IP/session shall trigger automatic throttling (429 response) and an optional log entry for admin review.
- **NFR-AIPLAY-003.4:** **No Sensitive Data in History:** API keys, tokens, and user identifiers shall never be stored in Local Storage history entries.
- **NFR-AIPLAY-003.5:** **CSP Compliance:** The module shall operate under a strict Content Security Policy without requiring `unsafe-inline` for scripts.

---

## NFR-AIPLAY-004: Accessibility

### Description
The playground must be usable by visitors with disabilities.

### Requirements
- **NFR-AIPLAY-004.1:** **Keyboard Navigation:** All parameter controls, preset buttons, and chat inputs shall be fully operable via keyboard (Tab order, Enter/Space activation).
- **NFR-AIPLAY-004.2:** **Screen Reader Support:** Token counters, cost estimates, and latency badges shall have appropriate `aria-label` and `aria-live` regions.
- **NFR-AIPLAY-004.3:** **Color Contrast:** All text and interactive elements shall meet WCAG 2.1 AA contrast ratios (minimum 4.5:1 for normal text, 3:1 for large text/UI components).
- **NFR-AIPLAY-004.4:** **Reduced Motion:** Animations (token streaming, badge pulses) shall respect `prefers-reduced-motion` and disable or simplify when requested.
- **NFR-AIPLAY-004.5:** **Focus Management:** Focus shall be returned to the message input after sending a message or loading a history item.

---

## NFR-AIPLAY-005: Scalability

### Description
The module must not monopolize server resources.

### Requirements
- **NFR-AIPLAY-005.1:** **Concurrent Connection Limit:** Each user session is limited to **2 concurrent SSE connections** (supporting comparison mode).
- **NFR-AIPLAY-005.2:** **Max Token Cap:** Server-side enforcement of `max_tokens` shall prevent requests exceeding 2000 tokens, regardless of client-side input.
- **NFR-AIPLAY-005.3:** **Request Timeout:** SSE connections shall be terminated server-side after **60 seconds** of inactivity.
- **NFR-AIPLAY-005.4:** **Resource Isolation:** Playground requests shall use a dedicated API key pool or budget to prevent cost overrun from affecting other modules.

---

## NFR-AIPLAY-006: Browser Compatibility

### Requirements
- **NFR-AIPLAY-006.1:** Fully functional on Chrome, Firefox, Safari, and Edge (last 2 major versions).
- **NFR-AIPLAY-006.2:** Graceful degradation for browsers without SSE support (fallback to polling with 1s interval).
- **NFR-AIPLAY-006.3:** Responsive layout from **320px** (mobile) to **2560px** (ultrawide desktop).
