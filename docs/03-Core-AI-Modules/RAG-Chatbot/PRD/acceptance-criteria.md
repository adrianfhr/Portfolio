# Acceptance Criteria — RAG Chatbot Module

**Module ID:** RAG-001  
**Version:** 1.0.0  
**Status:** Draft

---

## AC-001: Document Ingestion

- [ ] PDF files are parsed and split into semantic chunks of ~500 tokens with 100-token overlap.
- [ ] Markdown files are parsed and chunked at paragraph boundaries.
- [ ] Each chunk is assigned metadata: document name, chunk index, section heading, document type.
- [ ] Chunks are embedded using OpenAI `text-embedding-3-small` (1536d) and stored in Qdrant.
- [ ] Fallback embedding model (`all-MiniLM-L6-v2`, 384d) works if OpenAI is unavailable.
- [ ] Re-ingestion of an existing document replaces old chunks atomically.
- [ ] Ingestion is async (Celery) and does not block API requests.

## AC-002: Hybrid Retrieval

- [ ] Query embedding generates a 1536-dim vector in < 300ms.
- [ ] Vector search returns Top-20 candidates from Qdrant in < 100ms.
- [ ] Keyword search (PostgreSQL `tsvector`) returns Top-20 candidates in < 100ms.
- [ ] RRF fusion combines both lists into a single Top-10 ranking.
- [ ] Optional `document_type` filter restricts search to specific document categories.
- [ ] Retrieved chunks contain actual relevant content for factual queries about the portfolio owner.

## AC-003: Reranking

- [ ] Cross-encoder scores all Top-10 fused candidates in < 200ms.
- [ ] Top-N=3 chunks are selected after reranking.
- [ ] Reranking scores are exposed in live logs panel.
- [ ] If cross-encoder is unavailable, system falls back to RRF scores without error.

## AC-004: Context Injection & System Prompt

- [ ] System prompt is stored server-side and never exposed to client.
- [ ] Top-3 chunks are formatted with citation markers `[1]`, `[2]`, `[3]`.
- [ ] Total context (chunks + history) does not exceed 3000 tokens.
- [ ] User query is wrapped in triple-quote delimiters separate from system instructions.
- [ ] Conversation history includes last 10 turns (or summarized equivalent).

## AC-005: Streaming Response

- [ ] `POST /api/v1/chat` returns `Content-Type: text/event-stream`.
- [ ] First SSE event (`delta`) arrives within 1.5 seconds of request.
- [ ] Tokens stream smoothly with < 50ms between chunks.
- [ ] Event types used correctly: `delta`, `citation`, `usage`, `done`, `error`.
- [ ] Complete response renders correctly in the chat UI without truncation.
- [ ] If client disconnects, server cancels generation after 5 seconds.

## AC-006: Hallucination Guardrail

- [ ] When top reranking score < 0.7, response is a refusal message (not an answer).
- [ ] Refusal message is polite and suggests rephrasing or direct contact.
- [ ] Refusal events are logged with query text and scores.
- [ ] Threshold is configurable via `HALLUCINATION_THRESHOLD` env var.
- [ ] Admin bypass parameter (`?bypass_guardrail=true`) works for testing.

## AC-007: Source Citations

- [ ] Factual claims in responses include inline citation markers `[1]`, `[2]`, etc.
- [ ] Citation pills are clickable and highlight the source chunk in the right panel.
- [ ] Source panel shows document name, section heading, similarity score, and chunk text.
- [ ] Citations are preserved in conversation history.
- [ ] Citation metadata is delivered via SSE `citation` event.

## AC-008: Conversation Memory

- [ ] Session ID persists across page reloads via `sessionStorage`.
- [ ] Last 10 turns are retained in Redis with 24-hour TTL.
- [ ] Messages are persisted to PostgreSQL after stream completion.
- [ ] Authenticated users see conversation history in sidebar for 30 days.
- [ ] Guest conversations are retained for 7 days then anonymized.
- [ ] Auto-summarization triggers when history exceeds 2000 tokens.

## AC-009: Prompt Injection Defense

- [ ] Blocked phrases: "ignore previous instructions", "system prompt", "you are now", "DAN", "jailbreak".
- [ ] Input containing blocked phrases returns HTTP 400 with clear error.
- [ ] Incident is logged with matched phrase and client IP (hashed).
- [ ] Abuse counter increments (Auth module integration).
- [ ] System prompt is never leaked in any API response or error message.

## AC-010: Markdown Rendering & Sanitization

- [ ] Markdown syntax renders correctly: bold, italic, lists, code blocks, tables.
- [ ] Code blocks include syntax highlighting with automatic language detection.
- [ ] Inline code is styled with monospace font and subtle background.
- [ ] All rendered HTML is sanitized via DOMPurify with strict allow-list.
- [ ] XSS payloads in LLM output (e.g., `<script>`) are neutralized.

## AC-011: Live Process Panel

- [ ] Right panel shows real-time pipeline steps during each request.
- [ ] Steps displayed: Query Embedding, Vector Search, Keyword Search, RRF Fusion, Reranking, Context Injection, Generation.
- [ ] Each step shows latency and key metrics (candidates, scores, tokens).
- [ ] Logs stream via WebSocket with `[SHOWCASE_LOG]` tag.
- [ ] Panel can be toggled open/closed without losing chat context.
- [ ] Panel is collapsed by default on mobile.

## AC-012: Conversation History UI

- [ ] Sidebar lists all sessions with title, timestamp, and message count.
- [ ] Sessions are auto-titled from first user message (truncated to 40 chars).
- [ ] Clicking a session loads it into the main chat area.
- [ ] Delete action shows confirmation modal; conversation is soft-deleted.
- [ ] Rename action is inline and saves on Enter or blur.
- [ ] Empty state shows helpful prompt: "Start a conversation to see history here."

## AC-013: Mobile Experience

- [ ] Chat input is sticky at bottom of viewport on mobile.
- [ ] Messages wrap correctly without horizontal scroll.
- [ ] Sidebar accessible via hamburger menu.
- [ ] Live process panel collapsed by default.
- [ ] Touch targets >= 44×44px.
- [ ] Virtual keyboard does not obscure input field.

## AC-014: Error Handling

- [ ] OpenAI timeout (>10s) triggers circuit breaker and fallback model.
- [ ] If fallback also fails, user sees "Service temporarily unavailable. Please retry."
- [ ] Qdrant failure falls back to keyword-only search.
- [ ] Embedding failure falls back to local sentence-transformer model.
- [ ] All errors are logged with `trace_id` for debugging.
- [ ] UI shows contextual error messages (not raw stack traces).

## AC-015: Performance

- [ ] TTFT < 1.5s under normal load.
- [ ] Complete response < 5s P95 for 500-token output.
- [ ] Retrieval + reranking < 200ms.
- [ ] UI render time < 100ms per SSE event.
- [ ] 50 concurrent streams without >20% latency degradation.
