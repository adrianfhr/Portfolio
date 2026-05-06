# Infrastructure Topology

> **Document:** Infrastructure Topology  
> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Version:** 1.0  
> **Status:** Draft  

---

## 1. Executive Summary

This document describes the physical and logical infrastructure topology of the Interactive AI Engineering Portfolio & Sandbox. It covers network segmentation, service dependency relationships, data flow paths, per-service resource requirements, horizontal and vertical scaling strategies, and failover mechanisms. The topology is designed to support both the current single-node portfolio deployment and future expansion to multi-node or container orchestration platforms.

---

## 2. Network Topology

### 2.1 Logical Network Segments

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PUBLIC NETWORK (Internet)                          │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      │
│  │   Visitor A  │  │   Visitor B  │  │   Admin      │                      │
│  │  (Browser)   │  │  (Browser)   │  │  (Dashboard) │                      │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘                      │
└─────────┼─────────────────┼─────────────────┼──────────────────────────────┘
          │                 │                 │
          └─────────────────┼─────────────────┘
                            │ HTTPS (443) / WSS (443)
                            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         EDGE / PROXY LAYER                                   │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │  Cloudflare / NGINX Reverse Proxy                                      │  │
│  │  ├─ DDoS protection                                                    │  │
│  │  ├─ SSL termination (Let's Encrypt)                                    │  │
│  │  ├─ Static asset caching (CDN)                                         │  │
│  │  ├─ Rate limiting (layer 7)                                            │  │
│  │  └─ WebSocket upgrade handling                                         │  │
│  └────────────────────────────────────┬───────────────────────────────────┘  │
└───────────────────────────────────────┼──────────────────────────────────────┘
                                        │
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         APPLICATION NETWORK (Docker Bridge)                  │
│                                                                              │
│  ┌────────────┐    ┌────────────┐    ┌────────────┐    ┌────────────┐      │
│  │   web      │    │   api      │    │  worker    │    │   beat     │      │
│  │  (Astro)   │    │ (FastAPI)  │    │ (Celery)   │    │(Celery Beat│      │
│  │  :3000     │    │  :8000     │    │            │    │            │      │
│  └─────┬──────┘    └─────┬──────┘    └─────┬──────┘    └─────┬──────┘      │
│        │                 │                 │                 │              │
│        └─────────────────┼─────────────────┘                 │              │
│                          │                                   │              │
│                          ▼                                   │              │
│  ┌─────────────────────────────────────────────────────────┐ │              │
│  │              INTERNAL SERVICE NETWORK                    │ │              │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌─────────┐ │ │              │
│  │  │ postgres │  │  redis   │  │  qdrant  │  │  minio  │ │ │              │
│  │  │  :5432   │  │  :6379   │  │  :6333   │  │  :9000  │ │ │              │
│  │  └──────────┘  └──────────┘  └──────────┘  └─────────┘ │ │              │
│  └─────────────────────────────────────────────────────────┘ │              │
│                                                              │              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Port Allocation

| Service | Internal Port | External Exposure | Protocol | Notes |
|---------|--------------|-------------------|----------|-------|
| NGINX / Edge | 80, 443 | Yes (public) | HTTP/1.1, HTTP/2 | SSL termination, reverse proxy |
| Astro (web) | 4321 | No (internal only) | HTTP | Proxied by NGINX for `/` |
| FastAPI (api) | 8000 | No (internal only) | HTTP, WS | Proxied by NGINX for `/api/`, `/ws/` |
| PostgreSQL | 5432 | No (internal only) | TCP | Exposed to localhost in dev only |
| Redis | 6379 | No (internal only) | TCP | Exposed to localhost in dev only |
| Qdrant | 6333 | No (internal only) | HTTP/gRPC | Exposed to localhost in dev only |
| MinIO API | 9000 | No (internal only) | HTTP/S3 | Exposed to localhost in dev only |
| MinIO Console | 9001 | No (internal only) | HTTP | Admin UI for object storage |

### 2.3 Network Security Rules

| Source | Destination | Port | Action | Purpose |
|--------|------------|------|--------|---------|
| Internet | NGINX | 80, 443 | ALLOW | Public web traffic |
| Internet | All other services | Any | DENY | Direct access blocked |
| NGINX | web | 3000 | ALLOW | Frontend proxy |
| NGINX | api | 8000 | ALLOW | Backend proxy, WebSocket upgrade |
| web | api | 8000 | ALLOW | Astro endpoint proxy (internal) |
| api | postgres | 5432 | ALLOW | Database queries |
| api | redis | 6379 | ALLOW | Cache, sessions, rate limits |
| api | qdrant | 6333 | ALLOW | Vector search |
| api | minio | 9000 | ALLOW | Object storage |
| worker | postgres | 5432 | ALLOW | Background job persistence |
| worker | redis | 6379 | ALLOW | Celery broker, results |
| worker | qdrant | 6333 | ALLOW | Embedding indexing |
| worker | minio | 9000 | ALLOW | Image processing |
| beat | redis | 6379 | ALLOW | Scheduled task dispatch |

---

## 3. Service Dependency Map

### 3.1 Dependency Graph

```
web (Astro)
  |
  +-- depends on --> api (FastAPI)

api (FastAPI)
  |
  +-- depends on --> postgres (PostgreSQL)
  +-- depends on --> redis (Redis)
  +-- depends on --> qdrant (Qdrant)
  +-- depends on --> minio (MinIO)
  +-- depends on --> openai (External API)

worker (Celery)
  |
  +-- depends on --> postgres (PostgreSQL)
  +-- depends on --> redis (Redis)
  +-- depends on --> qdrant (Qdrant)
  +-- depends on --> minio (MinIO)
  +-- depends on --> openai (External API)

beat (Celery Beat)
  |
  +-- depends on --> redis (Redis)

postgres (PostgreSQL)
  |
  +-- no internal dependencies

redis (Redis)
  |
  +-- no internal dependencies

qdrant (Qdrant)
  |
  +-- no internal dependencies

minio (MinIO)
  |
  +-- no internal dependencies
```

### 3.2 Startup Order

Docker Compose `depends_on` ensures the following startup sequence:

```
Phase 1 (Infrastructure): postgres, redis, qdrant, minio
         |
         v
Phase 2 (Application): api, worker, beat
         |
         v
Phase 3 (Frontend): web
```

**Note:** `depends_on` only guarantees container start order, not service readiness. The FastAPI `lifespan.py` handler implements retry loops with exponential backoff to wait for database connections before accepting requests.

### 3.3 Critical Path Analysis

| Service | If Unavailable | Impact | Mitigation |
|---------|---------------|--------|------------|
| PostgreSQL | Total platform outage | User data, sessions, audit logs inaccessible | Database connection retry; graceful degradation to read-only cache mode (future) |
| Redis | Partial degradation | Rate limiting, sessions, real-time metrics fail; Celery stops | In-memory fallback for rate limiting (transient); queue tasks deferred |
| Qdrant | Chatbot degraded | RAG retrieval fails; chat falls back to pure LLM without context | Graceful fallback to non-RAG mode |
| MinIO | Image uploads fail | Vision module unavailable; agent artifact storage fails | Return 503 for upload endpoints; retry queue for pending uploads |
| OpenAI API | AI features degraded | Chat, embeddings, agents fail | Fallback to local model (if configured); queue tasks for retry |
| FastAPI | Total platform outage | All API endpoints, WebSocket, SSE unavailable | Health check fails; container restart by Docker restart policy |
| Astro | Frontend unavailable | Static pages, API proxy unavailable | Health check fails; container restart |

---

## 4. Data Flow Topology

### 4.1 Request-Response Data Flow

```
Browser
  |
  | HTTPS GET /chat
  v
NGINX
  |
  | HTTP/1.1
  v
web (Astro) -- renders SSR shell + hydrates React islands
  |
  | API Route Handler: /api/chat/history
  v
api (FastAPI) -- queries PostgreSQL for chat history
  |
  | JSON response
  v
web -- injects data into React Query cache
  |
  | HTML + JS
  v
Browser -- renders chat interface
```

### 4.2 Streaming Data Flow

```
Browser
  |
  | POST /api/chat {message}
  v
NGINX
  |
  v
api (FastAPI)
  |
  |-- query PostgreSQL (history)
  |-- query Qdrant (retrieval)
  |-- call OpenAI API (streaming)
  v
OpenAI API -- streams tokens
  |
  v
api -- formats SSE chunks: data: {token}
  |
  v
NGINX -- proxy_buffering off
  |
  v
Browser (EventSource) -- renders tokens incrementally
```

### 4.3 Background Job Data Flow

```
Browser
  |
  | POST /api/vision/detect {image}
  v
api (FastAPI)
  |
  |-- store image in MinIO
  |-- queue Celery task: vision.detect_faces
  |-- return task_id to client
  v
redis (Celery Broker)
  |
  v
worker (Celery)
  |
  |-- download image from MinIO
  |-- ONNX Runtime inference
  |-- search Qdrant for matches
  |-- store result in Redis result backend
  v
Browser (polling or WebSocket)
  |
  | GET /api/tasks/{task_id}
  v
api -- reads result from Redis backend
  |
  v
Browser -- renders bounding boxes + identity matches
```

---

## 5. Resource Requirements per Service

### 5.1 Development Environment

| Service | CPU | Memory | Storage | Notes |
|---------|-----|--------|---------|-------|
| web (Astro) | 0.5 cores | 512 MB | 1 GB | Hot reload enabled |
| api (FastAPI) | 0.5 cores | 512 MB | 1 GB | `--reload` enabled |
| worker (Celery) | 1.0 cores | 1 GB | 1 GB | ONNX inference is CPU-intensive |
| beat (Celery) | 0.1 cores | 128 MB | 100 MB | Minimal resource usage |
| postgres | 0.5 cores | 512 MB | 5 GB | Local development dataset |
| redis | 0.1 cores | 256 MB | 500 MB | In-memory only |
| qdrant | 0.5 cores | 512 MB | 2 GB | HNSW index for small corpus |
| minio | 0.1 cores | 256 MB | 5 GB | Local object storage |
| **Total** | **~3.3 cores** | **~3.7 GB** | **~15 GB** | Fits on a laptop |

### 5.2 Production Environment (Single Node)

| Service | CPU | Memory | Storage | Notes |
|---------|-----|--------|---------|-------|
| NGINX | 0.2 cores | 128 MB | 100 MB | Reverse proxy only |
| web (Astro) | 0.5 cores | 512 MB | 1 GB | Adapter build |
| api (FastAPI) | 1.0 cores | 1 GB | 1 GB | 4 Uvicorn workers |
| worker (Celery) | 2.0 cores | 2 GB | 2 GB | 2-4 concurrent worker processes |
| beat (Celery) | 0.1 cores | 128 MB | 100 MB | Scheduler only |
| postgres | 1.0 cores | 2 GB | 50 GB | SSD recommended |
| redis | 0.5 cores | 1 GB | 5 GB | AOF persistence enabled |
| qdrant | 1.0 cores | 2 GB | 20 GB | HNSW index for production corpus |
| minio | 0.5 cores | 512 MB | 50 GB | Image uploads, artifacts |
| **Total** | **~6.8 cores** | **~9.4 GB** | **~129 GB** | Comfortable on 4 vCPU / 16 GB VM |

### 5.3 Resource Bottleneck Analysis

| Bottleneck | Trigger | Scaling Action |
|-----------|---------|---------------|
| CPU (worker) | Face detection queue depth > 10 | Increase Celery worker replicas |
| CPU (api) | API latency P99 > 500ms | Increase Uvicorn worker count or scale to second API instance |
| Memory (qdrant) | HNSW index growth | Increase VM RAM or enable on-disk vectors |
| Memory (redis) | Cache eviction rate > 10% | Increase Redis maxmemory or add eviction policies |
| Disk (postgres) | Table bloat > 30% | Run `VACUUM FULL` or scale storage |
| Disk (minio) | Storage utilization > 80% | Implement lifecycle policies (delete old temp uploads) or scale storage |
| Network | Bandwidth saturation | Enable CDN for static assets; compress API responses with Brotli |

---

## 6. Scaling Topology

### 6.1 Vertical Scaling

Vertical scaling (increasing CPU, RAM, disk on a single node) is the primary scaling strategy for the portfolio showcase:

| Scale Target | VM Spec | Expected Load |
|-------------|---------|---------------|
| Baseline | 2 vCPU, 4 GB RAM | 50 concurrent users |
| Standard | 4 vCPU, 16 GB RAM | 200 concurrent users |
| High | 8 vCPU, 32 GB RAM | 1,000 concurrent users |

### 6.2 Horizontal Scaling (Future)

When vertical limits are reached, the architecture supports horizontal scaling:

```
                      Load Balancer (Layer 7)
                     (Sticky sessions or shared pub/sub)
                             |
        +--------------------+--------------------+
        |                    |                    |
   [Node A]             [Node B]             [Node C]
   ┌───────┐            ┌───────┐            ┌───────┐
   │ web   │            │ web   │            │ web   │
   │ api   │            │ api   │            │ api   │
   │ worker│            │ worker│            │ worker│
   └───────┘            └───────┘            └───────┘
        |                    |                    |
        +--------------------+--------------------+
                             |
              [Shared Infrastructure]
              ┌────────┬────────┬────────┐
              │postgres│ redis  │ qdrant │
              │(primary│(cluster│(cluster│
              │+replica│ mode)  │ mode)  │
              └────────┴────────┴────────┘
```

**Horizontal scaling prerequisites:**

1. **Stateless API instances:** Session data stored in Redis; no local state in FastAPI workers.
2. **Shared Redis pub/sub:** WebSocket broadcasting uses Redis Pub/Sub to fan out messages across nodes.
3. **Database read replicas:** Read-heavy operations (metrics, logs, chat history) can be served by read replicas.
4. **Qdrant cluster mode:** Distributed Qdrant deployment for partitioned vector search (future).

### 6.3 Celery Worker Autoscaling

Celery workers scale independently of API instances based on queue depth:

```python
# Autoscaling heuristic (implemented in orchestration layer)
queue_depth = redis.llen("celery")
active_workers = get_active_worker_count()

if queue_depth > 50 and active_workers < 8:
    spawn_worker_replica()
elif queue_depth < 5 and active_workers > 2:
    terminate_worker_replica()
```

In Docker Compose, this is manual. In Kubernetes (future), this maps to a HorizontalPodAutoscaler:

```yaml
# kubernetes hpa (future reference)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: celery-worker
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: worker
  minReplicas: 2
  maxReplicas: 10
  metrics:
    - type: Pods
      pods:
        metric:
          name: celery_queue_depth
        target:
          type: AverageValue
          averageValue: "25"
```

---

## 7. Failover Points

### 7.1 Single Points of Failure (SPoF)

| Component | SPoF? | Mitigation Strategy | Priority |
|-----------|-------|---------------------|----------|
| Single VPS | Yes | Backup VPS with automated failover script (future); cloud provider VM snapshots | High |
| PostgreSQL (single instance) | Yes | Streaming replication to standby (future); daily backups + point-in-time recovery | High |
| Redis (single instance) | Yes | Redis Sentinel or Cluster mode (future); AOF + RDB persistence | Medium |
| Qdrant (single instance) | Yes | Qdrant snapshots every 6 hours; restore from snapshot on new instance | Medium |
| NGINX (single instance) | Yes | Minimal blast radius; container restart < 5 seconds | Low |
| OpenAI API (external) | Yes | Fallback to local LLM (future); graceful degradation messages | Medium |

### 7.2 Failover Procedures

#### PostgreSQL Primary Failover

```
1. Monitoring detects primary PostgreSQL unresponsive (> 30s)
2. Promote standby replica to primary (pg_promote)
3. Update application DATABASE_URL to point to new primary
4. Restart api and worker containers to pick up new connection string
5. Investigate failed primary; rebuild as new standby
```

#### FastAPI Instance Failover

```
1. Health check fails on Node A api instance
2. Load balancer removes Node A from rotation
3. Node B and Node C continue serving traffic
4. Automatic container restart on Node A (Docker restart policy: unless-stopped)
5. Node A rejoins load balancer after 3 consecutive health check successes
```

#### Redis Failover

```
1. Redis Sentinel detects master down
2. Sentinel promotes most up-to-date replica to master
3. Sentinel updates configuration for clients
4. api and worker clients reconnect to new master (redis-py Sentinel support)
```

### 7.3 Graceful Degradation Matrix

| Failure Mode | Degraded Behavior | User Impact |
|-------------|-------------------|-------------|
| Qdrant unavailable | Chatbot operates without RAG (pure LLM) | Answers may be less grounded in documentation |
| Redis unavailable | Rate limiting disabled; sessions fall back to JWT-only | Guest quota enforcement relaxed; no real-time metrics |
| MinIO unavailable | Image uploads rejected; vision module offline | Users cannot use face recognition; existing images still viewable |
| OpenAI API rate limited | Queue tasks deferred; user sees "AI service busy" message | Temporary delay for AI features |
| Celery worker down | Background jobs queued but not processed | Face recognition and batch ingestion delayed |
| WebSocket server overloaded | Client falls back to SSE or HTTP polling | Slightly delayed real-time updates |

---

## 8. Storage Topology

### 8.1 Data Persistence Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            STORAGE TOPOLOGY                                  │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  BLOCK STORAGE (Host VM SSD)                                         │    │
│  │  ├─ Docker volumes (container layers, logs)                         │    │
│  │  ├─ PostgreSQL data directory (/var/lib/postgresql/data)            │    │
│  │  ├─ Redis RDB/AOF files (/data)                                     │    │
│  │  ├─ Qdrant storage (/qdrant/storage)                                │    │
│  │  └─ MinIO data directory (/data)                                    │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  OBJECT STORAGE (MinIO / S3)                                         │    │
│  │  ├─ uploads/          -- User-uploaded images                        │    │
│  │  ├─ models/           -- ONNX model artifacts                        │    │
│  │  ├─ exports/          -- Exported logs, reports                      │    │
│  │  └─ temp/             -- Temporary processing files (TTL: 24h)       │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │  BACKUP STORAGE (Off-site / Cloud)                                   │    │
│  │  ├─ pg_dump archives (daily)                                         │    │
│  │  ├─ Qdrant snapshots (every 6h)                                      │    │
│  │  └─ MinIO bucket mirrors (daily)                                     │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 8.2 Volume Mapping (Docker Compose)

| Host Path | Container Path | Service | Purpose |
|-----------|---------------|---------|---------|
| `/data/postgres` | `/var/lib/postgresql/data` | postgres | Persistent database files |
| `/data/redis` | `/data` | redis | RDB snapshots and AOF logs |
| `/data/qdrant` | `/qdrant/storage` | qdrant | Vector index and payload data |
| `/data/minio` | `/data` | minio | Object storage buckets |
| `/data/backups` | `/backups` | api (init container) | Database dump destination |

---

## 9. Monitoring & Observability Topology

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                      OBSERVABILITY STACK                                     │
│                                                                              │
│  Application Layer                                                           │
│  ├─ FastAPI exposes /metrics (Prometheus format)                            │
│  ├─ Structured JSON logs -> stdout -> Docker log driver                     │
│  └─ OpenTelemetry spans -> Jaeger (optional)                                │
│                                                                              │
│  Collection Layer                                                            │
│  ├─ Prometheus scrapes /metrics every 15s                                   │
│  ├─ Promtail / Loki agent scrapes Docker logs                               │
│  └─ Node Exporter exposes OS-level metrics (CPU, memory, disk)              │
│                                                                              │
│  Storage Layer                                                               │
│  ├─ Prometheus TSDB (15-day retention)                                      │
│  ├─ Loki index + chunks (7-day retention)                                   │
│  └─ Jaeger backend (optional, 3-day retention)                              │
│                                                                              │
│  Visualization Layer                                                         │
│  ├─ Grafana dashboards (latency, errors, saturation, traffic)               │
│  ├─ Grafana Explore (ad-hoc log querying)                                   │
│  └─ Alertmanager -> Slack/Discord notifications                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 10. Future Topology Evolution

### 10.1 Kubernetes Migration Path

```
Current: Docker Compose (single node)
    |
    v
Phase 1: Docker Swarm (multi-node, simple orchestration)
    |
    v
Phase 2: Kubernetes (EKS/GKE/k3s) with Helm charts
    ├─ Ingress Controller (NGINX or Traefik)
    ├─ Horizontal Pod Autoscaler for API and workers
    ├─ StatefulSet for PostgreSQL (or managed RDS/Cloud SQL)
    ├─ Redis Cluster via Helm chart (or managed ElastiCache)
    └─ Cert-manager for automatic TLS
```

### 10.2 Cloud-Native Services Migration

| Current (Self-Hosted) | Future (Managed Cloud) | Benefit |
|----------------------|------------------------|---------|
| PostgreSQL on VM | AWS RDS / Cloud SQL / Supabase | Automated backups, patching, read replicas |
| Redis on VM | AWS ElastiCache / Redis Cloud | High availability, monitoring, scaling |
| MinIO on VM | AWS S3 / Cloudflare R2 | Unlimited scalability, geo-redundancy |
| Qdrant on VM | Qdrant Cloud / Pinecone | Managed clustering, auto-scaling |
| VM-based deployment | AWS ECS / GCP Cloud Run | Serverless scaling, pay-per-use |

### 10.3 Multi-Region Considerations (Future)

- **Read-heavy workloads:** Static assets and API documentation served from edge CDN.
- **AI inference:** Regional worker pools close to users to minimize latency.
- **Data residency:** User data and embeddings stored in primary region; read replicas in secondary regions.

---

*Document maintained by the Infrastructure & Platform Team. Last updated: 2026-05-06.*
