# Functional Requirements — RAG Chatbot Module

**Module ID:** RAG-001  
**Version:** 1.0.0  
**Status:** Draft

---

## FR-001: Document Ingestion Pipeline

### Description
The system must support uploading and indexing of portfolio-related documents (CV, case studies, blog posts) in PDF and Markdown formats.

### Specification
1. **Supported Formats:** PDF, Markdown (`.md`), plain text (`.txt`).
2. **PDF Parsing:**
   - Primary: `pdfplumber` for text extraction with layout awareness.
   - Fallback: `PyPDF2` for basic text extraction.
   - Extracted text preserves paragraph boundaries where possible.
3. **Semantic Chunking:**
   - Target chunk size: 500 tokens (approximate, using GPT-2 tokenizer as proxy).
   - Overlap: 100 tokens between consecutive chunks.
   - Split strategy: Split at paragraph boundaries first; if paragraph exceeds target, split at sentence boundaries.
4. **Metadata per Chunk:**
   - `document_name`: Original filename.
   - `document_type`: "cv", "case_study", "blog", "project".
   - `chunk_index`: Zero-based sequence number.
   - `total_chunks`: Total chunks in document.
   - `source_url`: Optional URL reference.
   - `created_at`: Ingestion timestamp.
   - `section_heading`: Nearest preceding heading (if extractable).
5. **Storage:**
   - Raw documents stored in MinIO/S3 bucket `documents/`.
   - Chunk metadata stored in PostgreSQL `document_chunks` table.
   - Vector embeddings stored in Qdrant collection `documents`.

---

## FR-002: Embedding Generation & Vector Indexing

### Description
Document chunks must be converted to dense vector embeddings and indexed for fast approximate nearest neighbor search.

### Specification
1. **Embedding Model:**
   - Primary: OpenAI `text-embedding-3-small` (1536 dimensions).
   - Fallback: `sentence-transformers/all-MiniLM-L6-v2` (384 dimensions, local inference).
2. **Batching:** Up to 100 chunks per embedding API call to minimize latency and cost.
3. **Normalization:** Vectors are L2-normalized before storage (enables cosine similarity via dot product).
4. **Qdrant Configuration:**
   - Collection name: `documents`.
   - Vector size: 1536 (or 384 for fallback).
   - Distance metric: Cosine.
   - Indexing: HNSW with `m=16`, `ef_construct=100`, `ef=128`.
5. **Indexing Trigger:**
   - Manual trigger via admin panel.
   - Async background job (Celery) to avoid blocking API.
6. **Update Strategy:**
   - Re-ingestion of an existing document deletes old chunks and vectors before inserting new ones.
   - Atomic operation within Qdrant batch.

---

## FR-003: Hybrid Retrieval

### Description
User queries must retrieve relevant document chunks using a combination of dense vector similarity and sparse keyword matching.

### Specification
1. **Dense Retrieval (Vector Search):**
   - Query is embedded using the same model as document chunks.
   - Qdrant search returns Top-K=20 candidates using cosine similarity.
   - Search parameters: `ef=128`, `exact=false` (ANN).

2. **Sparse Retrieval (Keyword Search):**
   - PostgreSQL full-text search using `tsvector` on `document_chunks.content`.
   - Query terms converted to `tsquery` with `plainto_tsquery('english', query)`.
   - Returns Top-K=20 candidates ranked by `ts_rank_cd`.

3. **Reciprocal Rank Fusion (RRF):**
   - Formula: `score = Σ(1 / (k + rank))` where k=60.
   - Combines vector and keyword ranked lists into a single fused ranking.
   - Returns Top-K=10 after fusion.

4. **Filtering:**
   - Optional `document_type` filter (e.g., only search "case_study").
   - Optional date range filter.

---

## FR-004: Cross-Encoder Reranking

### Description
Retrieved candidates must be reordered by a cross-encoder model for higher relevance precision.

### Specification
1. **Model:** `cross-encoder/ms-marco-MiniLM-L-6-v2` (local inference via ONNX Runtime).
2. **Input:** Query string + each candidate chunk text.
3. **Output:** Relevance score ∈ [0, 1].
4. **Top-N Selection:** Keep Top-N=3 highest-scoring chunks after reranking.
5. **Performance:** Batch size 8, inference on CPU < 200ms for 10 candidates.
6. **Fallback:** If cross-encoder is unavailable, skip reranking and use RRF scores directly.

---

## FR-005: Context Injection & System Prompt Management

### Description
The top-N retrieved chunks must be injected into the LLM prompt in a structured, secure manner.

### Specification
1. **System Prompt (Backend-Only):**
   - Stored as a constant string in `apps/api/services/chat_prompts.py`.
   - Never exposed to client.
   - Content: "You are a helpful assistant answering questions about Adrian's professional background. Use ONLY the provided context. If the context does not contain the answer, say so. Cite sources using [1], [2], etc."

2. **Context Assembly:**
   - Max context tokens: 3000 (reserved for retrieved chunks + conversation history).
   - Chunks formatted as:
     ```
     [1] Document: {name}, Section: {heading}
     {chunk_text}

     [2] Document: {name}, Section: {heading}
     {chunk_text}
     ```
   - If chunks exceed 3000 tokens, truncate longest chunks first while preserving citation markers.

3. **Conversation History Injection:**
   - Include last 10 turns (user + assistant messages) if they fit within token budget.
   - If history + chunks exceed 3000 tokens, summarize older turns using a condensation prompt.

4. **User Input Delimitation:**
   - User query wrapped in clear delimiters: `"""{user_input}"""`.
   - Prevents prompt injection via instruction separation.

---

## FR-006: LLM Generation & Streaming

### Description
The system must generate responses using OpenAI API with Server-Sent Events (SSE) streaming.

### Specification
1. **Models:**
   - Primary: `gpt-4o-mini` (cost-effective, fast).
   - Fallback: `gpt-3.5-turbo` (if gpt-4o-mini unavailable or slower than 3s TTFT).
2. **Parameters:**
   - `temperature`: 0.3 (factual, deterministic).
   - `max_tokens`: 800.
   - `top_p`: 1.0.
   - `frequency_penalty`: 0.0.
   - `presence_penalty`: 0.0.
3. **Streaming Protocol (SSE):**
   - Endpoint: `POST /api/v1/chat` (Accept: text/event-stream).
   - Event types:
     - `event: delta` — token chunk text.
     - `event: citation` — citation metadata JSON.
     - `event: usage` — token usage statistics.
     - `event: done` — stream complete.
     - `event: error` — generation error.
   - Each event includes `id` (incremental) and `data` payload.
4. **Latency Targets:**
   - TTFT < 1.5s.
   - Inter-token latency < 50ms.
   - Total response < 5s for 500-token output.

---

## FR-007: Hallucination Guardrail

### Description
The system must detect low-confidence retrieval and refuse to answer rather than hallucinate.

### Specification
1. **Threshold:** If the highest reranking score among Top-N chunks is < 0.7, trigger refusal.
2. **Refusal Message:** "I don't have enough information in my knowledge base to answer that confidently. Try rephrasing your question, or feel free to reach out to Adrian directly."
3. **Logging:** Refusal events logged with `{ "event": "hallucination_guardrail", "query": "...", "top_score": 0.62, "threshold": 0.7 }`.
4. **Configurability:** Threshold stored in `HALLUCINATION_THRESHOLD` env var (default 0.7).
5. **Override:** Admin users can bypass guardrail via query parameter `?bypass_guardrail=true` (for testing).

---

## FR-008: Conversation Memory

### Description
Multi-turn conversations must retain context across messages within a session.

### Specification
1. **Session Identification:**
   - `session_id` UUID generated on first message.
   - Stored in `localStorage` key `chat_session_id`.
   - Passed as `X-Session-ID` header on every chat request.

2. **Short-Term Memory (Redis):**
   - Key: `chat:history:{session_id}`.
   - Value: JSON array of message objects `{ role, content, timestamp }`.
   - TTL: 24 hours.
   - Max turns: 10 (FIFO eviction beyond 10).

3. **Long-Term Memory (PostgreSQL):**
   - Table: `chat_messages`.
   - Columns: `id`, `session_id`, `user_id`, `role`, `content`, `model`, `tokens`, `latency_ms`, `sources` (JSON), `created_at`.
   - Persisted immediately after stream completion.
   - Authenticated users: 30-day retention.
   - Guests: 7-day retention (then anonymized).

4. **Auto-Summarization:**
   - Triggered when conversation history exceeds 2000 tokens.
   - Condenses oldest 6 turns into 1 summary turn.
   - Summary stored as `role="system"` message in history.

---

## FR-009: Prompt Injection Mitigation

### Description
User inputs must be scanned and sanitized to prevent prompt injection attacks.

### Specification
1. **Keyword Blocklist:**
   - Blocked phrases (case-insensitive): "ignore previous instructions", "system prompt", "you are now", "DAN", "do anything now", "jailbreak", "ignore all above".
2. **Action on Detection:**
   - Return HTTP 400 with error: "Invalid input detected."
   - Log incident: `{ "event": "prompt_injection_blocked", "matched_phrase": "...", "ip": "..." }`.
   - Increment abuse counter (Auth module).
3. **Input Sanitization:**
   - Strip null bytes, control characters.
   - Trim to max 2000 characters.
   - Escape triple quotes to prevent delimiter breaking.

---

## FR-010: Source Citation Tracking

### Description
The system must track which document chunks contributed to each response and expose them to the client.

### Specification
1. **Citation Format:** Inline markers `[1]`, `[2]`, `[3]` in LLM response text.
2. **Citation Metadata:**
   - `id`: Citation number.
   - `document_name`: Source filename.
   - `chunk_index`: Chunk sequence number.
   - `section_heading`: Nearest heading.
   - `similarity_score`: Reranker score.
   - `chunk_text`: Full text of the chunk (truncated to 300 chars in UI).
3. **Delivery:**
   - `event: citation` SSE event sent after `event: done` (or alongside final delta).
   - Also included in `GET /api/v1/chat/sessions/{session_id}` response.
4. **Rendering:** Client renders `[1]` as a superscript pill button; click opens source panel.

---

## FR-011: Live Logs Streaming

### Description
Internal RAG pipeline steps must be broadcast to connected clients via WebSocket for observability.

### Specification
1. **WebSocket Endpoint:** `ws://host/ws/logs`.
2. **Log Tag:** Only messages containing `[SHOWCASE_LOG]` are broadcast.
3. **Pipeline Events:**
   - `query_embedding`: model, latency, vector_dims.
   - `vector_search`: candidates_returned, latency.
   - `keyword_search`: candidates_returned, latency.
   - `rrf_fusion`: top_k_after_fusion.
   - `reranking`: model, latency, top_scores.
   - `context_injection`: tokens_used, chunks_included.
   - `generation_start`: model, temperature.
   - `generation_end`: total_tokens, finish_reason.
4. **Rate:** Events pushed immediately as they occur (no batching).
