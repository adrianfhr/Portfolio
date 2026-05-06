# Product Requirements Document — RAG Chatbot Module

**Module ID:** RAG-001  
**Version:** 1.0.0  
**Status:** Draft  
**Last Updated:** 2026-05-06  
**Owner:** Senior Fullstack AI / Systems Engineer  
**Stakeholders:** CTO, VP of Engineering, Technical Recruiter, Peer Engineers, Portfolio Visitors

---

## 1. Executive Summary

The RAG (Retrieval-Augmented Generation) Chatbot module is the flagship AI interaction surface of the Interactive AI Engineering Portfolio & Sandbox. It demonstrates production-grade natural language processing capabilities by answering factual questions about the owner's CV, professional experience, case studies, and technical expertise using a hybrid retrieval pipeline. The module showcases engineering maturity through semantic search, real-time streaming, source citation, conversation memory, and hallucination guardrails — all observable by visitors via an integrated live logs panel.

---

## 2. Objective & Goal

**Primary Objective:** Build an interactive AI assistant that answers factual questions about the portfolio owner's background with high accuracy, grounded in retrieved source documents.

**Strategic Goal:** Demonstrate end-to-end RAG pipeline expertise — from document ingestion and embedding to hybrid retrieval, reranking, context injection, streaming response generation, and hallucination mitigation — serving as a live technical interview for recruiters and peer engineers.

---

## 3. Scope

### 3.1 In-Scope
- Document ingestion pipeline (PDF and Markdown upload, parsing, semantic chunking)
- Embedding generation and vector indexing (OpenAI text-embedding-3-small or SentenceTransformer)
- Hybrid retrieval (dense vector search + sparse keyword search with Reciprocal Rank Fusion)
- Cross-encoder reranking (Top-K to Top-N refinement)
- Context injection and system prompt management (backend-only)
- Streaming response generation via Server-Sent Events (SSE)
- Source citation and provenance tracking
- Conversation memory (short-term Redis + long-term PostgreSQL)
- Hallucination guardrail (confidence threshold-based refusal)
- Chat UI with message history, markdown rendering, and live process panel
- Prompt injection filtering and input sanitization

### 3.2 Out-of-Scope
- Real-time web search integration (no live internet retrieval)
- Multi-modal inputs (images, audio, video in chat)
- Fine-tuning of base LLM models
- Voice input/output
- Third-party RAG-as-a-Service APIs (e.g., Pinecone Assistant, OpenAI Assistants API)
- Automatic document re-ingestion on source change (manual trigger in v1.0)

---

## 4. Context & Background

Traditional chatbots rely solely on parametric knowledge (what the LLM was trained on), which becomes stale and inaccurate for domain-specific queries. RAG solves this by retrieving relevant document chunks at query time and injecting them into the LLM context window. This module implements a full RAG stack:

1. **Ingestion Layer:** Documents are parsed, split into overlapping semantic chunks, and enriched with metadata.
2. **Embedding Layer:** Chunks are converted to high-dimensional vectors and indexed in Qdrant.
3. **Retrieval Layer:** Queries are embedded and matched against the vector index; BM25 keyword search provides lexical fallback.
4. **Reranking Layer:** A cross-encoder reorders retrieved chunks by relevance to the specific query.
5. **Generation Layer:** The top-N chunks are injected into a system prompt; the LLM generates a streaming response.
6. **Guardrail Layer:** If retrieval confidence is too low, the system refuses to answer rather than hallucinate.

All stages emit structured logs visible to visitors in real time, demonstrating observability practices.

---

## 5. Dependencies

| Dependency | Purpose | Module Owner |
|---|---|---|
| PostgreSQL | Conversation history, prompt logging, session metadata | RAG-Chatbot |
| Redis | Short-term conversation memory (24h TTL), session cache | RAG-Chatbot |
| Qdrant | Vector storage, HNSW approximate nearest neighbor search | RAG-Chatbot |
| OpenAI API | LLM generation (gpt-4o-mini, gpt-3.5-turbo), embeddings | External |
| FastAPI | SSE streaming endpoint, document ingestion API | System Architecture |
| Authentication | Quota enforcement, user identity for conversation persistence | Authentication |

---

## 6. Success Metrics (KPIs)

| Metric | Target | Measurement Method |
|---|---|---|
| Time to First Token (TTFT) | < 1.5s | Server-side instrumentation |
| End-to-end response latency (non-streaming) | < 5s P95 | API gateway logs |
| Retrieval relevance (Top-3 hit rate) | > 85% | Manual evaluation on 50 test queries |
| Hallucination rate | < 5% | Manual audit + user feedback |
| Streaming interruption rate | < 1% | Client error telemetry |
| Conversation memory accuracy | > 90% | Multi-turn test suite |
| Source citation completeness | 100% of factual claims | Automated assertion check |

---

## 7. Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| OpenAI API latency spikes | Medium | High | Fallback to gpt-3.5-turbo; circuit breaker pattern |
| Prompt injection attacks | Medium | High | Keyword filter + input sanitization + system prompt isolation |
| Qdrant index corruption | Low | Critical | Backup snapshots; re-ingestion pipeline |
| Token overflow in context window | Medium | Medium | Truncation strategy; max 3000 tokens for context |
| Hallucination on edge-case queries | Medium | Medium | Confidence threshold; refusal message; human feedback loop |
| High API costs from abuse | Medium | High | Rate limiting (Auth module); abuse detection |

---

## 8. Glossary

| Term | Definition |
|---|---|
| **RAG** | Retrieval-Augmented Generation — augmenting LLM prompts with retrieved documents |
| **Embedding** | Dense vector representation of text semantics |
| **BM25** | Best Match 25 — probabilistic keyword ranking function |
| **RRF** | Reciprocal Rank Fusion — algorithm for combining multiple ranked lists |
| **Cross-encoder** | Neural model that scores query-document pairs jointly |
| **TTFT** | Time to First Token — latency from request to first streamed chunk |
| **SSE** | Server-Sent Events — HTTP streaming protocol for real-time data |
| **HNSW** | Hierarchical Navigable Small World — approximate nearest neighbor algorithm |

---

## 9. Document References

- `docs/03-System-Architecture.md` — Full technical architecture
- `docs/05-Module-LLM-Chatbot.md` — Legacy module specification
- `docs/12-Module-Authentication.md` — Auth & rate limiting dependency
- `docs/09-Module-Monitoring.md` — Metrics and observability integration
