# Glossary

> **Scope:** Core terminology for the portfolio  
> **Version:** 1.0  
> **Status:** Draft

## 1. AI / Machine Learning

| Term | Definition |
|---|---|
| RAG | Retrieval-Augmented Generation; combines retrieval and generation. |
| Embedding | Vector representation of text or images for similarity search. |
| Vector Database | Database optimized for storing and searching vectors. |
| Token | Smallest text unit processed by an LLM. |
| Hallucination | Model output that sounds plausible but is not grounded in data. |
| Prompt Injection | Attempts to override system behavior through hostile input. |
| Temperature | Parameter controlling output randomness. |
| Fine-tuning | Training a pre-trained model on a specific dataset. |
| Inference | Running a model to produce output from input. |
| ONNX Runtime | Efficient engine for running ONNX models on CPU or GPU. |
| Face Embedding | Vector that represents facial features for recognition. |

## 2. System Architecture

| Term | Definition |
|---|---|
| Microservices | Service-oriented architecture with independently deployable components. |
| API Gateway | Unified entry point for routing, auth, and policy enforcement. |
| SSE | Server-Sent Events for one-way server push over HTTP. |
| WebSocket | Full-duplex real-time communication protocol. |
| Redis | In-memory store used for cache, queue, and session data. |
| PostgreSQL | Relational database used for durable structured data. |
| Message Queue | Async delivery mechanism for background work. |
| Sliding Window | Rate limiting algorithm based on a rolling time window. |
| Token Bucket | Rate limiting algorithm using refillable tokens. |

## 3. Observability

| Term | Definition |
|---|---|
| Observability | Understanding internal system state from external outputs. |
| Metrics | Quantitative measurements such as latency and request count. |
| Tracing | Following a request across services and boundaries. |
| P50 / P90 / P99 | Latency percentiles. |
| Uptime | Percentage of time a system is available. |
| Health Check | Endpoint that reports service or dependency availability. |

## 4. Security

| Term | Definition |
|---|---|
| JWT | JSON Web Token used for stateless authentication. |
| OAuth 2.0 | Authorization protocol for third-party access. |
| RBAC | Role-Based Access Control. |
| Rate Limiting | Restricting the number of requests over time. |
| CORS | Browser policy for cross-origin requests. |
| CSRF | Attack that forces a user to perform unwanted actions. |
| XSS | Cross-Site Scripting; malicious script injection. |
| SQL Injection | Injecting SQL through untrusted input. |

## 5. Frontend

| Term | Definition |
|---|---|
| SSR | Server-Side Rendering. |
| Hydration | Client-side takeover of server-rendered markup. |
| Island Architecture | Partial hydration pattern for interactive components. |
| Dark Mode | UI theme with dark surfaces and light text. |

## 6. Cross-References

- [API Reference](api-reference.md)
- [References](references.md)