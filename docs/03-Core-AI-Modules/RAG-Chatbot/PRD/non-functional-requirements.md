# Non-Functional Requirements — RAG Chatbot Module

**Module ID:** RAG-001  
**Version:** 1.0.0  
**Status:** Draft

---

## NFR-001: Performance & Latency

### Description
The chatbot must feel responsive and fast under normal load.

### Requirements
1. **Time to First Token (TTFT):** < 1.5 seconds from request receipt to first SSE `delta` event.
2. **End-to-End Latency:** < 5 seconds P95 for a complete 500-token response.
3. **Retrieval Latency:** < 200ms for hybrid retrieval + reranking (excluding LLM generation).
4. **Embedding Latency:** < 300ms for single-query embedding via OpenAI API.
5. **UI Render Time:** < 100ms from SSE event to visible DOM update (measured via React Profiler).
6. **Concurrent Users:** Support 50 concurrent streaming sessions per API instance without TTFT degradation > 20%.

---

## NFR-002: Security

### Description
The chatbot must resist common NLP attack vectors and protect sensitive system prompts.

### Requirements
1. **System Prompt Isolation:**
   - System prompt stored exclusively in backend Python constants.
   - Never transmitted to client in any form (not even in debug mode).
   - System prompt is NOT concatenated with user input using simple string joining; use structured message arrays.

2. **Input Validation:**
   - Max input length: 2000 characters.
   - Blocklist filter for known prompt injection phrases (see FR-009).
   - Null byte and control character stripping.

3. **Output Sanitization:**
   - All LLM output rendered via DOMPurify before DOM insertion.
   - `allow-list` configuration: only `p`, `br`, `strong`, `em`, `code`, `pre`, `ul`, `ol`, `li`, `a`, `h1-h4`, `table`, `thead`, `tbody`, `tr`, `th`, `td`.
   - All `href` attributes validated (`http://`, `https://`, or relative only).

4. **Data Privacy:**
   - Conversation logs do not store full IP addresses (hashed or truncated).
   - Guest conversations anonymized after 7 days.
   - No PII from retrieved documents logged (redaction of emails, phone numbers).

5. **Rate Limiting:**
   - Inherits Auth module quotas (20/day guest, 200/day developer).
   - Additional abuse throttle: >10 messages/minute triggers 60-second cooldown.

---

## NFR-003: Scalability

### Description
The chatbot pipeline must scale horizontally as document corpus and user load grow.

### Requirements
1. **Document Corpus:** Support up to 10,000 chunks (approx. 50 documents) without Qdrant latency degradation.
2. **Vector Search:** HNSW index query latency must remain < 50ms at 10,000 vectors.
3. **Embedding Throughput:** Batch ingestion at 100 chunks per request; full corpus re-indexing < 5 minutes.
4. **Database:** PostgreSQL `chat_messages` table partitioned by month after 1M rows.
5. **Redis:** Conversation history keys evicted via LRU after memory threshold; max 10,000 active sessions.

---

## NFR-004: Availability & Reliability

### Description
The chatbot must gracefully handle upstream failures and partial outages.

### Requirements
1. **OpenAI API Degradation:**
   - Circuit breaker: After 3 consecutive timeouts (>10s), switch to fallback model (`gpt-3.5-turbo`).
   - Circuit breaker resets after 60 seconds of successful calls.
   - If both models fail, return HTTP 503 with `Retry-After: 30`.

2. **Qdrant Degradation:**
   - If vector search fails, fall back to keyword-only retrieval (PostgreSQL `tsvector`).
   - Log `WARN` event and tag for monitoring dashboard.

3. **Embedding Service Degradation:**
   - If OpenAI embedding API fails, fall back to local `sentence-transformers` model.
   - Local model may produce lower-quality results but maintains availability.

4. **Streaming Resilience:**
   - If client disconnects mid-stream, server continues generation briefly (5s) then cancels to save tokens.
   - Partial responses are NOT stored in conversation history (only complete responses persisted).

---

## NFR-005: Maintainability

### Description
The RAG pipeline must be comprehensible, testable, and adjustable by a single developer.

### Requirements
1. **Modular Architecture:** Each pipeline stage (retrieval, reranking, generation) is an independent service class with a clear interface.
2. **Configuration:** All tunable parameters (chunk size, overlap, Top-K, temperature, threshold) in Pydantic Settings.
3. **Testability:** Each stage unit-testable with mocked dependencies (no OpenAI API calls in unit tests).
4. **Observability:** Every stage emits structured logs with `trace_id` for end-to-end request tracing.
5. **Documentation:** Docstrings on all public methods; README in `apps/api/services/rag/` explaining pipeline flow.

---

## NFR-006: Cost Control

### Description
The chatbot must operate within a predictable API cost budget.

### Requirements
1. **Token Budget per Request:** Max 3000 context + 800 completion = 3800 tokens.
2. **Cost Cap:** Average cost per chat request < $0.02 (gpt-4o-mini pricing).
3. **Monitoring:** Real-time cost accumulator per user, visible in admin panel.
4. **Alerting:** Daily cost alert at $10; hard stop at $20 (admin override available).
