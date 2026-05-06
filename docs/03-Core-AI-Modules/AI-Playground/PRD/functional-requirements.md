# AI Playground — Functional Requirements

> **Module:** AI Playground  
> **Version:** 1.0  
> **Total Requirements:** 35

---

## FR-AIPLAY-001: Model Selection

### Description
Users must be able to select which LLM model powers their playground session.

### Requirements
- **FR-AIPLAY-001.1:** The default selected model shall be **gpt-4o-mini**.
- **FR-AIPLAY-001.2:** Available models shall include: `gpt-4o-mini`, `gpt-3.5-turbo`, `gpt-4o`.
- **FR-AIPLAY-001.3:** An optional **Local Model** endpoint may be configured via environment variable; if unavailable, it shall be hidden from the selector.
- **FR-AIPLAY-001.4:** Each model option shall display its approximate relative cost tier (e.g., "Low Cost", "Standard", "Premium").
- **FR-AIPLAY-001.5:** Model selection shall take effect on the next request; ongoing SSE streams shall not be affected.

---

## FR-AIPLAY-002: Parameter Controls

### Description
Expose OpenAI completion parameters as interactive UI controls with validation and educational tooltips.

### Requirements
- **FR-AIPLAY-002.1:** **Temperature:** Slider + numeric input, range 0.0 to 2.0, step 0.1, default 1.0.
- **FR-AIPLAY-002.2:** **Max Tokens:** Slider + numeric input, range 50 to 2000, step 50, default 500.
- **FR-AIPLAY-002.3:** **Top P:** Slider + numeric input, range 0.0 to 1.0, step 0.05, default 1.0.
- **FR-AIPLAY-002.4:** **Frequency Penalty:** Slider + numeric input, range -2.0 to 2.0, step 0.1, default 0.0.
- **FR-AIPLAY-002.5:** **Presence Penalty:** Slider + numeric input, range -2.0 to 2.0, step 0.1, default 0.0.
- **FR-AIPLAY-002.6:** Each control shall display a tooltip icon (?) that, on hover/tap, shows:
  - A one-sentence definition.
  - A concrete example of impact (e.g., "Temperature 0.2: factual answers; 1.5: creative brainstorming").
- **FR-AIPLAY-002.7:** Values outside the allowed range shall be clamped or rejected at the UI level.
- **FR-AIPLAY-002.8:** A "Reset to Defaults" button shall restore all parameters to their initial values.

---

## FR-AIPLAY-003: System Prompt Editor

### Description
Provide a dedicated editor for crafting system-level instructions with presets and validation.

### Requirements
- **FR-AIPLAY-003.1:** A textarea with minimum 3 rows, maximum 10 rows, resizable vertically.
- **FR-AIPLAY-003.2:** A live character counter displaying `current / max` (max 4000 characters).
- **FR-AIPLAY-003.3:** Preset buttons that populate the editor:
  - **Helpful Assistant:** General-purpose helpful assistant.
  - **Code Reviewer:** Senior engineer reviewing pull requests.
  - **Creative Writer:** Fiction author with vivid prose.
  - **Socratic Tutor:** Asks guiding questions instead of giving direct answers.
- **FR-AIPLAY-003.4:** Preset selection shall append (not replace) if modifier key (Ctrl/Cmd) is held, enabling hybrid prompts.
- **FR-AIPLAY-003.5:** The system prompt shall be included in the SSE request payload under the key `system_prompt`.
- **FR-AIPLAY-003.6:** Empty system prompts shall be allowed and treated as "no system instruction."

---

## FR-AIPLAY-004: Side-by-Side Comparison Mode

### Description
Enable dual-panel A/B testing of models on identical inputs.

### Requirements
- **FR-AIPLAY-004.1:** A toggle button labeled "Compare Models" shall switch the layout from single-panel to split-screen.
- **FR-AIPLAY-004.2:** In comparison mode, the layout shall display two panels side-by-side (50%/50% on desktop; stacked on mobile).
- **FR-AIPLAY-004.3:** A "Sync Prompt" button shall copy the active prompt from Panel A to Panel B.
- **FR-AIPLAY-004.4:** Each panel shall have independent model selectors and parameter controls.
- **FR-AIPLAY-004.5:** Both panels shall stream responses simultaneously via separate SSE connections.
- **FR-AIPLAY-004.6:** Each panel shall display independent token counters, cost estimates, and latency timers.
- **FR-AIPLAY-004.7:** A "VS" badge shall appear centered between the panels during active comparison.

---

## FR-AIPLAY-005: Token Visualization

### Description
Render real-time and post-completion token metrics with visual charts.

### Requirements
- **FR-AIPLAY-005.1:** A real-time token counter shall increment as SSE tokens arrive.
- **FR-AIPLAY-005.2:** Post-completion, a pie chart or stacked bar shall show:
  - Prompt tokens (system + user message)
  - Completion tokens (AI response)
- **FR-AIPLAY-005.3:** Cost estimation shall use per-model pricing:
  - Prompt token cost per 1K tokens.
  - Completion token cost per 1K tokens.
- **FR-AIPLAY-005.4:** Total estimated cost shall display to 6 decimal places (e.g., `$0.000245`).
- **FR-AIPLAY-005.5:** If pricing data is unavailable, the cost section shall show "N/A" with a tooltip explaining why.

---

## FR-AIPLAY-006: Latency Benchmark

### Description
Track and display request latency with historical context and performance indicators.

### Requirements
- **FR-AIPLAY-006.1:** Latency shall be measured from `fetch()` initiation to `SSE stream close` on the client.
- **FR-AIPLAY-006.2:** A "Fast" badge (green) shall appear if latency is below the P50 of the last 24h.
- **FR-AIPLAY-006.3:** A "Slow" badge (orange) shall appear if latency exceeds the P90 of the last 24h.
- **FR-AIPLAY-006.4:** A history table shall display the last 5 requests with:
  - Timestamp (HH:MM:SS)
  - Model name
  - Total tokens
  - Latency (ms)
  - Performance badge
- **FR-AIPLAY-006.5:** History shall be stored in Local Storage with a max of 50 entries, FIFO eviction.

---

## FR-AIPLAY-007: Response History

### Description
Maintain a client-side history of playground sessions for quick revisitation.

### Requirements
- **FR-AIPLAY-007.1:** Each completed interaction shall be saved to Local Storage as a JSON object containing: timestamp, system prompt, user message, model, parameters, response text, tokens, latency.
- **FR-AIPLAY-007.2:** A sidebar panel shall list history items sorted by timestamp (newest first).
- **FR-AIPLAY-007.3:** Clicking a history item shall restore the full session state to the editor and chat area.
- **FR-AIPLAY-007.4:** A "Clear All History" button with a confirmation modal shall remove all stored items.
- **FR-AIPLAY-007.5:** History shall be keyed by a session or user identifier; guest users share one history bucket per browser.

---

## FR-AIPLAY-008: Chat Interface

### Description
Provide a conversational UI for multi-turn interactions within the playground.

### Requirements
- **FR-AIPLAY-008.1:** A message input field with send button (Enter to send, Shift+Enter for newline).
- **FR-AIPLAY-008.2:** User messages shall appear right-aligned with a distinct bubble style.
- **FR-AIPLAY-008.3:** AI responses shall appear left-aligned with a streaming typewriter effect via SSE.
- **FR-AIPLAY-008.4:** A "Stop Generation" button shall abort the active SSE connection.
- **FR-AIPLAY-008.5:** A "New Session" button shall clear the chat area while preserving parameter settings.
- **FR-AIPLAY-008.6:** Markdown rendering shall be supported for AI responses (bold, lists, code blocks).

---

## FR-AIPLAY-009: API Contract

### Endpoints

#### POST /api/v1/playground/completion
- **Content-Type:** `application/json`
- **Request Body:**
  ```json
  {
    "model": "gpt-4o-mini",
    "system_prompt": "You are a helpful assistant.",
    "messages": [{"role": "user", "content": "Explain quantum computing"}],
    "temperature": 1.0,
    "max_tokens": 500,
    "top_p": 1.0,
    "frequency_penalty": 0.0,
    "presence_penalty": 0.0
  }
  ```
- **Response:** `text/event-stream` (SSE)
- **Events:**
  - `token`: `{ "content": "Quantum" }`
  - `usage`: `{ "prompt_tokens": 12, "completion_tokens": 150, "total_tokens": 162 }`
  - `done`: `{ "finish_reason": "stop", "latency_ms": 1240 }`
- **Errors:**
  - `400`: Invalid parameter value.
  - `429`: Rate limit exceeded.
  - `500`: Model inference error.

#### GET /api/v1/playground/models
- **Response:**
  ```json
  {
    "models": [
      { "id": "gpt-4o-mini", "name": "GPT-4o Mini", "cost_tier": "low" },
      { "id": "gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "cost_tier": "standard" },
      { "id": "gpt-4o", "name": "GPT-4o", "cost_tier": "premium" }
    ]
  }
  ```
