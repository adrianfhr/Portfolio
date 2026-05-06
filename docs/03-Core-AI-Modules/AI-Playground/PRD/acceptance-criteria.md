# AI Playground — Acceptance Criteria

> **Module:** AI Playground  
> **Version:** 1.0  
> **Definition of Ready:** All criteria below must be verifiable in a staging environment.

---

## AC-AIPLAY-001: Model Selection

- [ ] Default model on first visit is `gpt-4o-mini`.
- [ ] User can switch to `gpt-3.5-turbo` or `gpt-4o` and the next request uses the selected model.
- [ ] Model selector is disabled while an SSE stream is active.
- [ ] Each model displays its cost tier label (Low, Standard, Premium).

## AC-AIPLAY-002: Parameter Controls

- [ ] All five parameters (Temperature, Max Tokens, Top P, Frequency Penalty, Presence Penalty) render as sliders with numeric inputs.
- [ ] Entering an out-of-range value is automatically clamped or rejected.
- [ ] Tooltips appear on hover (desktop) or tap (mobile) and contain a definition + example.
- [ ] "Reset to Defaults" restores all values to their original state.

## AC-AIPLAY-003: System Prompt Editor

- [ ] The textarea accepts up to 4000 characters with a live counter.
- [ ] Clicking a preset populates the textarea with the corresponding system prompt.
- [ ] Holding Ctrl/Cmd while clicking a preset appends the preset text.
- [ ] Empty system prompt is valid and results in no system instruction being sent.

## AC-AIPLAY-004: Comparison Mode

- [ ] Toggle switches the layout to two panels.
- [ ] "Sync Prompt" copies the prompt from Panel A to Panel B.
- [ ] Each panel streams independently with its own token counter and latency timer.
- [ ] On mobile, panels stack vertically without horizontal scroll.

## AC-AIPLAY-005: Token Visualization

- [ ] Token counter increments in real time during SSE streaming.
- [ ] Post-completion, a chart (pie or bar) shows prompt vs. completion token split.
- [ ] Cost estimate is calculated and displayed to at least 6 decimal places.
- [ ] Cost updates immediately when model is changed (before sending).

## AC-AIPLAY-006: Latency Benchmark

- [ ] Each completed request shows total latency in milliseconds.
- [ ] History table displays the last 5 requests with timestamp, model, tokens, latency, and badge.
- [ ] Fast badge appears for latencies below P50; Slow badge for above P90.
- [ ] Latency values are within 100ms of server-reported latency.

## AC-AIPLAY-007: Response History

- [ ] Every completed interaction is saved to Local Storage.
- [ ] History panel lists items with timestamp and first 50 chars of the user message.
- [ ] Clicking a history item restores the full session state.
- [ ] "Clear All" with confirmation removes all items from Local Storage.

## AC-AIPLAY-008: Chat Interface

- [ ] Enter sends; Shift+Enter inserts a newline.
- [ ] User and AI messages are visually distinct (right vs. left, different colors).
- [ ] AI response streams word-by-word via SSE.
- [ ] "Stop Generation" aborts the stream and preserves partial output.
- [ ] Markdown in AI responses renders correctly (bold, lists, inline code).

## AC-AIPLAY-009: API Compliance

- [ ] `POST /api/v1/playground/completion` accepts all documented parameters and returns SSE.
- [ ] `GET /api/v1/playground/models` returns the model list with IDs, names, and cost tiers.
- [ ] Invalid parameters return `400` with field-level error details.
- [ ] Rate limit exceeded returns `429` with `Retry-After`.

## AC-AIPLAY-010: Security & Abuse

- [ ] System prompts containing injection keywords are rejected with `400`.
- [ ] Payloads exceeding 50KB are rejected with `413`.
- [ ] More than 20 req/min from the same session triggers throttling.
- [ ] No API keys or sensitive identifiers appear in Local Storage or client-side network logs.

## AC-AIPLAY-011: Accessibility

- [ ] All interactive elements are reachable via keyboard only.
- [ ] Token counters and latency badges have descriptive `aria-label` attributes.
- [ ] Color contrast meets WCAG 2.1 AA across all states.
- [ ] `prefers-reduced-motion` disables streaming animations.

## AC-AIPLAY-012: Performance

- [ ] TTFT is under 1.5s for 95% of requests in staging.
- [ ] UI interactions (slider drag, button click) feel instant (<16ms jank).
- [ ] Two concurrent comparison streams complete without error.
- [ ] Page loads and becomes interactive within 2s on a 4G connection.
