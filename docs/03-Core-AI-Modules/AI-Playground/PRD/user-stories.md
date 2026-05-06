# AI Playground — User Stories

> **Module:** AI Playground  
> **Document Type:** User Story Collection  
> **Version:** 1.0

---

## US-AIPLAY-001: Prompt Experimentation

**As a** peer engineer or curious visitor,  
**I want to** write and modify system prompts with immediate feedback,  
**So that** I can understand how instructions shape LLM behavior.

### Acceptance Criteria
- [ ] A system prompt textarea is visible at all times with a live character counter.
- [ ] Preset prompts (Helpful Assistant, Code Reviewer, Creative Writer, Socratic Tutor) load instantly.
- [ ] Modifying the system prompt and sending a message produces visibly different output.
- [ ] The current system prompt persists for the duration of the session.

### Priority
**High** — Core value proposition of the module.

---

## US-AIPLAY-002: Model Comparison

**As a** CTO or technical evaluator,  
**I want to** run the same prompt through two different models side-by-side,  
**So that** I can objectively compare quality, speed, and cost trade-offs.

### Acceptance Criteria
- [ ] A "Comparison Mode" toggle transforms the UI into two equal panels.
- [ ] Both panels share a synchronized prompt input (typing in one updates the other).
- [ ] Each panel can select a different model independently.
- [ ] Both responses stream simultaneously with independent latency and token counters.
- [ ] A "VS" badge visually reinforces the competitive comparison context.

### Priority
**High** — Key differentiator for technical credibility.

---

## US-AIPLAY-003: Parameter Control

**As a** peer engineer studying implementation,  
**I want to** adjust Temperature, Max Tokens, Top P, and Penalties with sliders/inputs,  
**So that** I can observe how each parameter affects output characteristics.

### Acceptance Criteria
- [ ] All five parameters are exposed as interactive controls (sliders with numeric inputs).
- [ ] Each control has a tooltip explaining its function with a concrete example.
- [ ] Invalid values (out of range) are blocked at the UI level.
- [ ] Parameter changes take effect on the next request without requiring a page reload.

### Priority
**High** — Essential for educational value.

---

## US-AIPLAY-004: Token Visualization

**As a** cost-conscious evaluator,  
**I want to** see real-time token usage and estimated cost in USD,  
**So that** I can appreciate the economic implications of different model choices.

### Acceptance Criteria
- [ ] A token counter updates in real time as the SSE stream delivers tokens.
- [ ] A pie or bar chart visualizes the breakdown between prompt tokens and completion tokens.
- [ ] Cost is estimated in USD using current OpenAI pricing tiers.
- [ ] The visualization updates immediately upon request completion.

### Priority
**Medium-High** — Strong signal of production-grade cost awareness.

---

## US-AIPLAY-005: Latency Benchmarking

**As a** performance-oriented evaluator,  
**I want to** see how long each request takes from submission to completion,  
**So that** I can assess the system's responsiveness and infrastructure efficiency.

### Acceptance Criteria
- [ ] Each request displays its total latency (ms) upon completion.
- [ ] A history table shows the last 5 requests with latency, model, and token count.
- [ ] Requests faster than the P50 baseline receive a "Fast" badge; slower than P90 receive a "Slow" badge.
- [ ] Latency is measured from client send to final SSE event, synchronized with server logs.

### Priority
**Medium** — Reinforces observability and performance engineering competency.

---

## US-AIPLAY-006: Response History

**As a** returning visitor,  
**I want to** browse my recent playground interactions,  
**So that** I can revisit interesting outputs without retyping prompts.

### Acceptance Criteria
- [ ] A sidebar or panel lists recent interactions (Local Storage, max 50).
- [ ] Clicking a history item reloads the full conversation state (prompt, parameters, response).
- [ ] A "Clear History" button removes all items with a confirmation dialog.
- [ ] History persists across browser sessions but never leaves the client.

### Priority
**Medium** — Quality-of-life feature improving retention.

---

## Story Map Summary

| ID | Story | Actor | Priority | Effort |
|---|---|---|---|---|
| US-AIPLAY-001 | Prompt Experimentation | All Users | High | Medium |
| US-AIPLAY-002 | Model Comparison | CTO, Peer Dev | High | High |
| US-AIPLAY-003 | Parameter Control | Peer Dev, Curious Alex | High | Medium |
| US-AIPLAY-004 | Token Visualization | CTO, Recruiter | Medium-High | Medium |
| US-AIPLAY-005 | Latency Benchmarking | CTO, Peer Dev | Medium | Low |
| US-AIPLAY-006 | Response History | All Users | Medium | Low |
