# AI / ML Architecture

> **Document:** AI / ML Architecture  
> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Version:** 1.0  
> **Status:** Draft  

---

## 1. Executive Summary

The AI architecture of the Interactive AI Engineering Portfolio & Sandbox is designed as a **multi-pipeline, multi-modal inference platform** that demonstrates production-grade patterns in modern applied AI. The system integrates large language models (LLMs), dense vector embeddings, computer vision, and agent orchestration into a unified, observable, and cost-controlled service layer.

Rather than treating AI as a black-box utility, the architecture exposes the full lifecycle of AI operations — from data ingestion and embedding generation to retrieval, reranking, completion streaming, and token-cost attribution. This transparency is central to the portfolio's "Show, Don't Tell" philosophy.

---

## 2. AI Component Overview

### 2.1 Component Landscape

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         AI SERVICE FACADE                                   │
│              (Abstracts provider-specific SDKs behind uniform interface)    │
└──────────────┬────────────────────┬────────────────────┬────────────────────┘
               │                    │                    │
    ┌──────────▼──────────┐  ┌─────▼──────┐  ┌──────────▼──────────┐
    │   LLM Pipeline      │  │  Embedding │  │   Vision Pipeline   │
    │                     │  │  Pipeline  │  │                     │
    │  ┌───────────────┐  │  │            │  │  ┌───────────────┐  │
    │  │  Completion   │  │  │  Text       │  │  │   Detection   │  │
    │  │  (Streaming)  │  │  │  Embedding  │  │  │   (ONNX)      │  │
    │  └───────────────┘  │  │            │  │  └───────────────┘  │
    │  ┌───────────────┐  │  │  Image      │  │  ┌───────────────┐  │
    │  │  Function     │  │  │  Embedding  │  │  │   Matching    │  │
    │  │  Calling      │  │  │  (future)   │  │  │   (512d vec)  │  │
    │  └───────────────┘  │  │            │  │  └───────────────┘  │
    │  ┌───────────────┐  │  └────────────┘  └─────────────────────┘
    │  │  Structured   │  │
    │  │  Output       │  │
    │  └───────────────┘  │
    └──────────┬──────────┘
               │
    ┌──────────▼──────────┐
    │  Agent Orchestration│
    │     (LangGraph)     │
    │                     │
    │  ┌───────────────┐  │
    │  │  Workflow     │  │
    │  │  Graph        │  │
    │  └───────────────┘  │
    │  ┌───────────────┐  │
    │  │  Tool Calling │  │
    │  │  Router       │  │
    │  └───────────────┘  │
    │  ┌───────────────┐  │
    │  │  State        │  │
    │  │  Persistence  │  │
    │  └───────────────┘  │
    └─────────────────────┘
```

### 2.2 Technology Matrix

| Component | Primary Technology | Fallback / Local | Purpose |
|-----------|-------------------|------------------|---------|
| LLM Completion | OpenAI GPT-4o / GPT-4o-mini | GPT-3.5-turbo (cost-optimized) | Text generation, chat, structured output |
| Text Embeddings | OpenAI text-embedding-3-small | SentenceTransformer (all-MiniLM-L6-v2) | Dense vector generation for RAG |
| Image Embeddings | CLIP (future) | — | Cross-modal image-text search |
| Face Detection | InsightFace (buffalo_l) | — | 2D face bounding box detection |
| Face Embedding | InsightFace (buffalo_l) + ONNX Runtime | — | 512-dimensional face feature extraction |
| Vector Search | Qdrant | — | ANN retrieval with payload filtering |
| Sparse Retrieval | Qdrant sparse vectors / BM25 | — | Keyword-based document retrieval |
| Reranking | Cross-encoder (ms-marco-MiniLM-L-6-v2) | Cohere Rerank API | Reordering retrieved chunks by relevance |
| Agent Orchestration | LangGraph | LangChain ReAct (simpler flows) | Multi-step reasoning with cycles and state |
| Prompt Management | Jinja2 templates | — | Versioned, parameterized prompt assembly |
| Token Monitoring | OpenAI Usage API + tiktoken | — | Per-request cost attribution and budgeting |

---

## 3. Embedding Pipeline

### 3.1 Text Embedding Flow

```
Raw Document (PDF, Markdown, HTML)
    ↓
Document Parser (unstructured / beautifulsoup4)
    ↓
Text Chunking Strategy
    ├─ Chunk Size: 512 tokens
    ├─ Chunk Overlap: 50 tokens
    └─ Splitter: RecursiveCharacterTextSplitter
    ↓
Metadata Enrichment
    ├─ source: filename / URL
    ├─ module: "chatbot" | "agents" | "playground"
    ├─ created_at: ISO timestamp
    └─ chunk_index: integer
    ↓
Embedding Generation
    ├─ Model: text-embedding-3-small (1536 dimensions)
    ├─ Batch Size: 64 chunks per API call
    └─ Normalization: L2-normalized by OpenAI
    ↓
Vector Storage (Qdrant)
    ├─ Collection: "documents"
    ├─ Vector Size: 1536
    ├─ Distance: Cosine
    └─ Payload: metadata + raw text
```

### 3.2 Image Embedding Flow (Future)

```
Uploaded Image
    ↓
Preprocessing (resize to 224x224, normalize)
    ↓
CLIP Vision Encoder (ViT-B/32)
    ↓
512-dimensional Image Embedding
    ↓
Qdrant Collection: "images"
    ├─ Vector Size: 512
    ├─ Distance: Cosine
    └─ Payload: image_url, caption, tags
```

### 3.3 Face Embedding Flow

```
Uploaded Image
    ↓
OpenCV Preprocessing (color space conversion, resize)
    ↓
InsightFace Detection Model (RetinaFace, ONNX)
    ├─ Outputs: bounding boxes + detection confidence
    ↓
InsightFace Recognition Model (buffalo_l, ONNX)
    ├─ Outputs: 512-dimensional embedding per detected face
    ├─ Normalization: L2-normalized
    ↓
Qdrant Collection: "faces"
    ├─ Vector Size: 512
    ├─ Distance: Euclidean
    └─ Payload: user_id, image_url, detection_confidence
```

### 3.4 Chunking Strategies

| Strategy | Use Case | Chunk Size | Overlap |
|----------|----------|-----------|---------|
| **Recursive Character** | General documents (markdown, plain text) | 512 tokens | 50 tokens |
| **Markdown Header** | Structured documentation with headings | By header hierarchy | None |
| **Code-aware** | Source code files | 256 tokens | 25 tokens |
| **Fixed Token** | Simple linear splitting | 256-1024 tokens | 0-100 tokens |

---

## 4. Retrieval Pipeline (Hybrid Search)

### 4.1 Hybrid Search Architecture

The retrieval pipeline implements **hybrid search** — combining dense vector similarity with sparse keyword matching — to maximize recall across semantic and lexical query types.

```
User Query
    ↓
[Parallel Branch A: Dense Retrieval]
    ├─ Query Embedding (text-embedding-3-small)
    ├─ Qdrant Vector Search (ANN, HNSW index)
    ├─ Top-k: 20 chunks
    └─ Score: Cosine similarity

[Parallel Branch B: Sparse Retrieval]
    ├─ Query Tokenization (BM25)
    ├─ Qdrant Sparse Vector Search
    ├─ Top-k: 20 chunks
    └─ Score: BM25 relevance
    ↓
Result Fusion (RRF: Reciprocal Rank Fusion)
    ├─ Formula: score = Σ(1 / (k + rank))
    ├─ k constant: 60
    └─ Deduplication by chunk_id
    ↓
Reranking (Cross-encoder)
    ├─ Input: Query + Top 10 fused chunks
    ├─ Model: ms-marco-MiniLM-L-6-v2
    ├─ Output: Relevance scores (0-1)
    └─ Top-k final: 5 chunks
    ↓
Context Assembly
    ├─ Sort by rerank score
    ├─ Truncate to fit context window
    └─ Inject into Jinja2 prompt template
```

### 4.2 Qdrant Configuration

```python
# Qdrant collection configuration for documents
{
    "collection_name": "documents",
    "vectors_config": {
        "size": 1536,
        "distance": "Cosine",
        "hnsw_config": {
            "m": 16,               # Number of bi-directional links per node
            "ef_construct": 100,   # Size of dynamic candidate list during index construction
            "max_indexing_threads": 4
        }
    },
    "sparse_vectors_config": {
        "text": {
            "index": {
                "on_disk": False
            }
        }
    },
    "optimizers_config": {
        "default_segment_number": 2,
        "indexing_threshold": 20000  # Switch to indexed search after 20k vectors
    }
}
```

### 4.3 Hybrid Search Parameters

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Dense top-k | 20 | High recall before fusion; duplicates removed during fusion. |
| Sparse top-k | 20 | Balanced with dense branch for fair RRF weighting. |
| RRF constant (k) | 60 | Standard RRF constant; penalizes low ranks without over-dominating. |
| Rerank top-k | 10 | Cross-encoder inference is CPU-intensive; limit to most promising candidates. |
| Final context chunks | 5 | Fits within ~2000 tokens, leaving room for system prompt and user query. |

---

## 5. Reranking Strategy

### 5.1 Why Reranking?

Vector similarity search (dense or sparse) retrieves candidates quickly but does not deeply model the **interaction** between the query and the candidate text. A cross-encoder reranker performs full self-attention over `[query, candidate]` pairs, producing a more accurate relevance score at the cost of higher latency.

### 5.2 Reranker Selection

| Model | Size | Latency (CPU) | License | Use Case |
|-------|------|---------------|---------|----------|
| `cross-encoder/ms-marco-MiniLM-L-6-v2` | 22M params | ~50ms/pair | Apache 2.0 | Default reranker, fast, good enough for most queries |
| `cross-encoder/ms-marco-MiniLM-L-12-v2` | 33M params | ~80ms/pair | Apache 2.0 | Higher accuracy at cost of latency |
| Cohere Rerank API | Cloud | ~100ms/batch | Commercial | Fallback when local model accuracy is insufficient |

### 5.3 Reranking Flow

```python
def rerank_chunks(query: str, chunks: list[RetrievedChunk]) -> list[RankedChunk]:
    pairs = [(query, chunk.text) for chunk in chunks]
    scores = cross_encoder.predict(pairs)  # Returns array of floats
    
    ranked = sorted(
        [{"chunk": chunk, "score": float(score)} for chunk, score in zip(chunks, scores)],
        key=lambda x: x["score"],
        reverse=True,
    )
    return ranked[:5]  # Top 5 after reranking
```

---

## 6. LLM Completion Flow

### 6.1 Standard Chat Completion

```
User Message
    ↓
Auth & Rate Limit Check
    ↓
Conversation History Retrieval (PostgreSQL)
    ├─ Last N messages (N configured per model context window)
    └─ Formatted as OpenAI message array: [{role, content}, ...]
    ↓
RAG Context Retrieval (if RAG enabled)
    ├─ Hybrid search → Rerank → Top 5 chunks
    └─ Injected into system prompt as context block
    ↓
Prompt Assembly (Jinja2 Template)
    ├─ System prompt (with context)
    ├─ Conversation history
    └─ User message
    ↓
OpenAI Chat Completion API Call
    ├─ Model: gpt-4o-mini (default) or gpt-4o (if complex reasoning detected)
    ├─ Temperature: 0.3 (factual tasks) / 0.7 (creative tasks)
    ├─ Max tokens: 1024
    ├─ Stream: True
    └─ Response format: text (default) or json_object (structured output)
    ↓
Token Streaming (SSE)
    ├─ Each token yielded as Server-Sent Event
    └─ Client renders tokens incrementally
    ↓
Post-Processing
    ├─ Token count via tiktoken (client-side validation)
    ├─ Cost calculation: (prompt_tokens × input_price) + (completion_tokens × output_price)
    ├─ Metrics emission (Prometheus)
    └─ Persistence: assistant message saved to PostgreSQL
```

### 6.2 Structured Output Flow

For tasks requiring machine-parseable responses (agent tool arguments, JSON extraction):

```
User Request (e.g., "Extract name and email from this text")
    ↓
Zod / Pydantic Schema Definition
    ├─ Used to generate JSON Schema for OpenAI function calling
    ↓
OpenAI API with response_format={"type": "json_object"}
    ↓
Schema Validation (Pydantic)
    ├─ Retry loop: up to 2 retries if JSON parse or validation fails
    └─ Fallback to text response if retries exhausted
    ↓
Validated Object Returned to Client
```

### 6.3 Model Selection Heuristics

| Criterion | Model Selected | Reasoning |
|-----------|---------------|-----------|
| Default chat | `gpt-4o-mini` | Cost-efficient, fast, sufficient for 90% of queries |
| Complex reasoning / code | `gpt-4o` | Higher capability, larger context window (128k) |
| Structured output required | `gpt-4o-mini` with `json_object` | Reliable JSON adherence |
| Vision input | `gpt-4o` | Native multimodal support |
| High token count (>8k prompt) | `gpt-4o` | 128k context window vs 16k for mini |

---

## 7. Agent Orchestration (LangGraph)

### 7.1 Architecture Philosophy

The multi-agent system is built on **LangGraph**, which models agent workflows as state machines with cycles. Unlike linear chains, LangGraph supports:

- **Conditional edges:** Router nodes that decide the next step based on LLM output.
- **Cycles:** Iterative reasoning loops (e.g., plan → execute → observe → replan).
- **State persistence:** Workflow state is checkpointed to PostgreSQL, enabling pause/resume and human-in-the-loop approval.
- **Parallel execution:** Multiple agent nodes can run concurrently when dependencies permit.

### 7.2 Agent Graph Structure

```
                    ┌─────────────┐
                    │   START     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │   Planner   │  ← LLM generates step-by-step plan
                    │   (Node)    │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Tool Router │  ← Conditional edge based on plan
                    │   (Edge)     │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           ▼               ▼               ▼
    ┌────────────┐  ┌────────────┐  ┌────────────┐
    │  Search    │  │  Calculator│  │   Code     │
    │  Agent     │  │   Agent    │  │  Executor  │
    └─────┬──────┘  └─────┬──────┘  └─────┬──────┘
          │               │               │
          └───────────────┼───────────────┘
                          │
                          ▼
                   ┌─────────────┐
                   │   Synthesizer│  ← LLM synthesizes tool outputs into final answer
                   │    (Node)    │
                   └──────┬──────┘
                          │
                          ▼
                   ┌─────────────┐
                   │    END      │
                   └─────────────┘
```

### 7.3 State Definition

```python
from typing import TypedDict, Annotated, Sequence
from langchain_core.messages import BaseMessage
from langgraph.graph.message import add_messages

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], add_messages]
    plan: str
    tool_calls: list[dict]
    tool_results: list[str]
    iteration_count: int
    is_complete: bool
    checkpoint_id: str | None
```

### 7.4 Human-in-the-Loop

For sensitive operations (code execution, external API calls), the workflow can be interrupted:

```python
# In LangGraph node definition
def tool_execution_node(state: AgentState):
    if state["tool_calls"][0]["name"] in REQUIRES_APPROVAL:
        # Interrupt workflow, save state to PostgreSQL
        raise InterruptException(
            message="Approval required for code execution",
            checkpoint=save_checkpoint(state),
        )
    return execute_tools(state)

# Resume endpoint
@router.post("/agents/{run_id}/approve")
async def approve_agent_run(run_id: str):
    checkpoint = load_checkpoint(run_id)
    return await agent_service.resume_from_checkpoint(checkpoint)
```

### 7.5 Agent Tools Inventory

| Tool | Description | Implementation |
|------|-------------|---------------|
| `vector_search` | Semantic search over document corpus | Qdrant hybrid search service |
| `calculator` | Mathematical expression evaluation | Python `eval` with safe `ast` parsing |
| `web_search` | Retrieve current information from web | SerpAPI / DuckDuckGo integration |
| `code_executor` | Execute Python code in sandboxed environment | Restricted `subprocess` with timeout |
| `metrics_query` | Query system metrics | Prometheus query API wrapper |

---

## 8. Token Cost Tracking

### 8.1 Cost Attribution Model

Every LLM API call is instrumented for precise cost tracking:

| Model | Input Price ($/1M tokens) | Output Price ($/1M tokens) | Context Window |
|-------|--------------------------|---------------------------|----------------|
| gpt-4o | $5.00 | $15.00 | 128k |
| gpt-4o-mini | $0.150 | $0.600 | 128k |
| gpt-3.5-turbo | $0.50 | $1.50 | 16k |
| text-embedding-3-small | $0.02 | — | 8k input |

### 8.2 Tracking Flow

```
API Request Initiated
    ↓
tiktoken Encoding (or OpenAI usage response)
    ├─ prompt_tokens: counted
    ├─ completion_tokens: counted (from streaming or usage block)
    └─ total_tokens: sum
    ↓
Cost Calculation
    ├─ prompt_cost = prompt_tokens × input_price_per_token
    ├─ completion_cost = completion_tokens × output_price_per_token
    └─ total_cost = prompt_cost + completion_cost
    ↓
Persistence
    ├─ PostgreSQL: chat_message.tokens_used, chat_message.cost_usd
    ├─ Prometheus: openai_tokens_total (counter), openai_cost_usd (gauge)
    └─ Redis: user:daily_cost (for rate limit integration)
    ↓
Real-time Display
    └─ SSE broadcast to metrics dashboard
```

### 8.3 Budget Enforcement

| Tier | Daily Token Budget | Daily Cost Budget | Enforcement |
|------|-------------------|-------------------|-------------|
| Guest | 10,000 tokens | $0.05 | Hard stop (429) |
| Developer | 100,000 tokens | $1.00 | Soft warning at 80% |
| Admin | Unlimited | Unlimited | Monitoring only |

---

## 9. Model Selection Strategy

### 9.1 Selection Dimensions

Model selection is not static; it is determined at request time based on multiple dimensions:

| Dimension | Evaluation Method | Impact |
|-----------|-------------------|--------|
| **Task Complexity** | Token count of expected reasoning chain | gpt-4o for multi-step reasoning; gpt-4o-mini for simple Q&A |
| **Input Modality** | MIME type of input (text vs image) | gpt-4o for vision; gpt-4o-mini for text-only |
| **Latency Sensitivity** | User-facing vs background job | gpt-4o-mini for streaming; gpt-4o for batch tasks |
| **Cost Sensitivity** | User tier and daily budget | gpt-4o-mini for guests; gpt-4o for developers on complex tasks |
| **Output Structure** | JSON required vs free-form text | gpt-4o-mini with `json_object` for structured; gpt-4o for creative |

### 9.2 Fallback Cascade

```
Primary Model: gpt-4o-mini
    ↓ (if complex reasoning detected)
Fallback 1: gpt-4o
    ↓ (if rate limited by OpenAI)
Fallback 2: gpt-3.5-turbo
    ↓ (if all OpenAI tiers unavailable)
Graceful Degradation: Return cached similar response or polite error message
```

### 9.3 Local Model Roadmap

To demonstrate self-hosted AI capability, a local model fallback is planned:

| Stage | Model | Runtime | Hardware Target |
|-------|-------|---------|-----------------|
| Phase 1 | Llama 3 8B (GGUF, Q4_K_M) | llama.cpp / Ollama | CPU (16GB RAM) |
| Phase 2 | Mistral 7B Instruct (AWQ) | vLLM | GPU (8GB VRAM) |
| Phase 3 | Custom fine-tuned model | vLLM | GPU (16GB VRAM) |

---

## 10. AI Data Flow Diagram

### 10.1 End-to-End RAG Chat Flow

```
┌──────────┐     POST /chat         ┌──────────────┐
│  Client  │───────────────────────▶│  FastAPI     │
│  (React) │                        │  Gateway     │
└──────────┘                        └──────┬───────┘
                                          │
                         ┌────────────────┼────────────────┐
                         ▼                ▼                ▼
              ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
              │   PostgreSQL  │  │    Redis      │  │   Rate Limit  │
              │  (History)    │  │  (Session)    │  │   Check       │
              └───────┬───────┘  └───────────────┘  └───────────────┘
                      │
                      ▼
              ┌───────────────┐
              │  Embedding    │  ← OpenAI / SentenceTransformer
              │  Generation   │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │    Qdrant     │  ← Hybrid Search (Dense + Sparse)
              │   Retrieval   │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Reranker    │  ← Cross-encoder
              │  (Top 5)      │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Jinja2      │
              │  Prompt Build │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │  OpenAI LLM   │  ← Streaming Completion
              │   (SSE)       │
              └───────┬───────┘
                      │
                      ▼
              ┌───────────────┐
              │   Client      │  ← Token-by-token rendering
              │  (React)      │
              └───────────────┘
```

### 10.2 Face Recognition Flow

```
Client Upload (multipart/form-data)
    ↓
FastAPI → File Validation (MIME, size, extension)
    ↓
MinIO / S3 Storage (persistent image archive)
    ↓
Celery Task: process_image_face
    ↓
OpenCV Preprocessing
    ↓
InsightFace Detection (ONNX Runtime)
    ├─ No faces detected → Return empty result
    └─ Faces detected → Proceed
    ↓
InsightFace Embedding (512d vector, Euclidean normalized)
    ↓
Qdrant Search (collection: "faces", top-k: 5, distance: Euclidean)
    ↓
Match Scoring (threshold: 1.0 for same identity)
    ↓
Result Return (bounding boxes, identity matches, confidence scores)
```

---

## 11. AI Quality Assurance

### 11.1 Evaluation Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Retrieval Recall@10 | > 0.85 | Manual evaluation on 50 representative queries |
| Reranker NDCG@5 | > 0.80 | Benchmark dataset (MS MARCO subset) |
| LLM Answer Relevance | > 4.0 / 5.0 | Human evaluation on 100 chat sessions |
| Face Detection Accuracy | > 98% | Labeled face dataset (LFW subset) |
| Face Verification AUC | > 0.99 | 1:1 matching on labeled pairs |

### 11.2 Prompt Versioning

All prompts are stored as Jinja2 templates in `apps/api/prompts/` and versioned via Git:

```
prompts/
├── chat/
│   ├── v1_system_prompt.j2
│   ├── v1_rag_context.j2
│   └── v2_system_prompt.j2   ← Iterative improvements tracked in Git history
├── agents/
│   └── planner_prompt.j2
└── vision/
    └── image_analysis.j2
```

- A/B testing framework (future) will route a percentage of traffic to new prompt versions and measure engagement metrics.
- Prompt tokens are counted and cost-attributed separately from completion tokens.

---

*Document maintained by the AI Engineering Team. Last updated: 2026-05-06.*
