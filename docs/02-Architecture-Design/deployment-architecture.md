# Deployment and DevOps Architecture

> **Document:** Deployment and DevOps Architecture  
> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Version:** 1.0  
> **Status:** Draft  

---

## 1. Executive Summary

This document defines the deployment architecture, continuous integration and delivery (CI/CD) pipelines, environment configuration strategy, secret management practices, rollback procedures, and production monitoring approach for the Interactive AI Engineering Portfolio & Sandbox. The deployment model is optimized for a **single-developer portfolio project** while demonstrating production-grade practices that would scale to a small engineering team.

The architecture supports two primary deployment targets:
1. **Local Development:** Docker Compose stack for rapid iteration.
2. **Production:** Containerized deployment on a VPS or cloud VM with HTTPS, custom domain, and automated updates.

---

## 2. Local Development Setup

### 2.1 Docker Compose Stack

Local development uses a single `docker-compose.yml` file that orchestrates all infrastructure dependencies and application services.

```yaml
# docker-compose.yml (simplified)
version: "3.9"

services:
  # Frontend
  web:
    build:
      context: ./apps/web
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_API_URL=http://localhost:8000
      - API_PROXY_URL=http://api:8000
    volumes:
      - ./apps/web:/app
      - /app/node_modules
    depends_on:
      - api

  # Backend API
  api:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/portfolio
      - REDIS_URL=redis://redis:6379/0
      - QDRANT_URL=http://qdrant:6333
      - MINIO_ENDPOINT=minio:9000
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    volumes:
      - ./apps/api:/app
    depends_on:
      - postgres
      - redis
      - qdrant
      - minio

  # Celery Worker
  worker:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    command: celery -A infra.celery_app worker --loglevel=info
    environment:
      - DATABASE_URL=postgresql+asyncpg://postgres:postgres@postgres:5432/portfolio
      - REDIS_URL=redis://redis:6379/0
      - QDRANT_URL=http://qdrant:6333
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    depends_on:
      - redis
      - postgres
      - qdrant

  # Celery Beat (scheduled tasks)
  beat:
    build:
      context: ./apps/api
      dockerfile: Dockerfile
    command: celery -A infra.celery_app beat --loglevel=info
    environment:
      - REDIS_URL=redis://redis:6379/0
    depends_on:
      - redis

  # Infrastructure Services
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: portfolio
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  qdrant:
    image: qdrant/qdrant:v1.7
    ports:
      - "6333:6333"
    volumes:
      - qdrant_data:/qdrant/storage

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - "9000:9000"
      - "9001:9001"
    environment:
      MINIO_ROOT_USER: minioadmin
      MINIO_ROOT_PASSWORD: minioadmin
    volumes:
      - minio_data:/data

volumes:
  postgres_data:
  redis_data:
  qdrant_data:
  minio_data:
```

### 2.2 Development Workflow

```bash
# 1. Clone repository
git clone <repo-url> && cd portfolio

# 2. Create environment file
cp .env.example .env
# Edit .env with OPENAI_API_KEY and other secrets

# 3. Start full stack
docker-compose up --build

# 4. Run database migrations
docker-compose exec api alembic upgrade head

# 5. Seed initial data (optional)
docker-compose exec api python scripts/seed_data.py
```

### 2.3 Hot Reload Configuration

| Service | Hot Reload | Implementation |
|---------|-----------|----------------|
| Astro frontend | Yes | `astro dev` inside Docker with volume mount |
| FastAPI backend | Yes | `--reload` flag with volume mount |
| Celery worker | No | Manual restart required (`docker-compose restart worker`) |

---

## 3. Production Deployment Strategy

### 3.1 Target Infrastructure

The production deployment targets a **single VPS or cloud VM** (e.g., DigitalOcean Droplet, Hetzner Cloud, AWS EC2 t3.medium) with the following specifications:

| Resource | Specification | Rationale |
|----------|--------------|-----------|
| CPU | 2-4 vCPUs | FastAPI async workers + Celery background tasks |
| RAM | 8 GB | PostgreSQL + Redis + Qdrant + ONNX inference (CPU) |
| Storage | 100 GB SSD | Docker images, database files, MinIO objects, model artifacts |
| Bandwidth | 2-4 TB/month | Portfolio traffic + image uploads |
| OS | Ubuntu 22.04 LTS | Stable, well-documented, Docker-native |

### 3.2 Production Architecture

```
Internet
    |
    v
[Cloudflare / NGINX]  <-- HTTPS termination, DDoS protection, static asset caching
    |
    v
[Docker Compose (Production)]
    |
    +-- web (Astro, port 4321)
    +-- api (FastAPI, port 8000)
    +-- worker (Celery)
    +-- beat (Celery Beat)
    +-- postgres (PostgreSQL)
    +-- redis (Redis)
    +-- qdrant (Qdrant)
    +-- minio (MinIO)
    +-- nginx (Reverse proxy, port 80/443)
    +-- certbot (Let's Encrypt SSL renewal)
```

### 3.3 Reverse Proxy Configuration

NGINX serves as the edge reverse proxy, handling SSL termination, static asset serving, and upstream routing:

```nginx
# /etc/nginx/sites-available/portfolio
server {
    listen 80;
    server_name portfolio.example.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name portfolio.example.com;

    ssl_certificate /etc/letsencrypt/live/portfolio.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/portfolio.example.com/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://web:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }

    # API
    location /api/ {
        proxy_pass http://api:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_read_timeout 300s;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://api:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_read_timeout 86400s;
    }

    # SSE (long-lived connections)
    location /api/chat/stream {
        proxy_pass http://api:8000;
        proxy_http_version 1.1;
        proxy_buffering off;
        proxy_cache off;
        proxy_read_timeout 300s;
    }
}
```

### 3.4 SSL/TLS Configuration

- **Certificate Authority:** Let's Encrypt (free, automated renewal)
- **Renewal:** `certbot` Docker container with cron job for automatic renewal every 12 hours
- **TLS Version:** Minimum TLS 1.2; TLS 1.3 preferred
- **HSTS:** Enabled (`Strict-Transport-Security: max-age=31536000; includeSubDomains`)

---

## 4. CI/CD Pipeline

### 4.1 Pipeline Architecture

The CI/CD pipeline is implemented using **GitHub Actions** (or GitLab CI, adaptable) with three environments: `dev`, `staging`, and `production`.

```
Developer push to feature branch
    |
    v
[GitHub Actions: CI]
    |
    +-- Lint & Format (ESLint, Prettier, Black, Ruff)
    +-- Type Check (TypeScript, mypy)
    +-- Unit Tests (pytest, vitest)
    +-- Build Docker Images
    +-- Integration Tests (TestContainers)
    |
    v
Merge to main branch
    |
    v
[GitHub Actions: CD - Staging]
    |
    +-- Build & Tag Docker Images (ghcr.io)
    +-- Deploy to Staging VPS (SSH + docker-compose pull)
    +-- Run Smoke Tests
    +-- Run Database Migrations
    |
    v
Manual Approval Gate
    |
    v
[GitHub Actions: CD - Production]
    |
    +-- Deploy to Production VPS
    +-- Run Database Migrations
    +-- Health Check Verification
    +-- Notify (Slack / Discord webhook)
```

### 4.2 GitHub Actions Workflow

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      # Frontend checks
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: apps/web/package-lock.json
      - run: cd apps/web && npm ci
      - run: cd apps/web && npm run lint
      - run: cd apps/web && npm run type-check
      - run: cd apps/web && npm run test:ci
      
      # Backend checks
      - name: Setup Python
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
      - run: cd apps/api && pip install -r requirements-dev.txt
      - run: cd apps/api && black --check .
      - run: cd apps/api && mypy .
      - run: cd apps/api && pytest --cov=app --cov-report=xml

  build-and-push:
    needs: lint-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4
      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3
      - name: Login to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}
      - name: Build and push web
        uses: docker/build-push-action@v5
        with:
          context: ./apps/web
          push: true
          tags: ghcr.io/${{ github.repository }}/web:latest,ghcr.io/${{ github.repository }}/web:${{ github.sha }}
      - name: Build and push api
        uses: docker/build-push-action@v5
        with:
          context: ./apps/api
          push: true
          tags: ghcr.io/${{ github.repository }}/api:latest,ghcr.io/${{ github.repository }}/api:${{ github.sha }}

  deploy-production:
    needs: build-and-push
    runs-on: ubuntu-latest
    environment: production
    steps:
      - name: Deploy to VPS
        uses: appleboy/ssh-action@v1.0.0
        with:
          host: ${{ secrets.PROD_HOST }}
          username: ${{ secrets.PROD_USER }}
          key: ${{ secrets.PROD_SSH_KEY }}
          script: |
            cd /opt/portfolio
            docker-compose -f docker-compose.prod.yml pull
            docker-compose -f docker-compose.prod.yml up -d
            docker-compose -f docker-compose.prod.yml exec -T api alembic upgrade head
            docker system prune -f
```

### 4.3 Deployment Triggers

| Event | Action | Environment |
|-------|--------|-------------|
| Push to `feature/*` | CI checks only | None |
| Pull request to `main` | Full CI suite | None |
| Merge to `develop` | CI + deploy to staging | Staging |
| Merge to `main` | CI + build images + manual deploy | Production (requires approval) |
| Tag `v*` | CI + build images + auto deploy | Production |

---

## 5. Environment Configuration

### 5.1 Configuration Hierarchy

Configuration follows the **12-Factor App methodology**: config stored in environment variables, never in code.

```python
# apps/api/app/config.py
from pydantic_settings import BaseSettings
from pydantic import Field

class Settings(BaseSettings):
    # Application
    APP_NAME: str = "Portfolio API"
    APP_ENV: str = Field(default="development", pattern="^(development|staging|production)$")
    DEBUG: bool = False
    
    # Database
    DATABASE_URL: str
    DATABASE_POOL_SIZE: int = 20
    
    # Redis
    REDIS_URL: str
    
    # Qdrant
    QDRANT_URL: str
    
    # Storage
    MINIO_ENDPOINT: str
    MINIO_ACCESS_KEY: str
    MINIO_SECRET_KEY: str
    S3_BUCKET_NAME: str = "portfolio-uploads"
    
    # AI
    OPENAI_API_KEY: str
    OPENAI_MODEL_DEFAULT: str = "gpt-4o-mini"
    OPENAI_MODEL_PREMIUM: str = "gpt-4o"
    
    # Security
    SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRY_DAYS: int = 7
    
    # Rate Limiting
    RATE_LIMIT_GUEST: int = 20
    RATE_LIMIT_DEVELOPER: int = 200
    
    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
```

### 5.2 Environment Files

| File | Environment | Location | Secrets? |
|------|-------------|----------|----------|
| `.env.example` | All (template) | Repository | No (placeholders only) |
| `.env` | Development | Local machine | Yes (ignored by git) |
| `.env.staging` | Staging | GitHub Secrets + VPS | Yes |
| `.env.production` | Production | GitHub Secrets + VPS | Yes |

### 5.3 Feature Flags

Feature flags enable gradual rollouts and emergency kill switches:

| Flag | Default | Description |
|------|---------|-------------|
| `ENABLE_RAG_CHAT` | `true` | Master switch for chatbot module |
| `ENABLE_FACE_RECOGNITION` | `true` | Master switch for vision module |
| `ENABLE_MULTI_AGENT` | `false` | Gradual rollout for agent module |
| `ENABLE_LIVE_LOGS` | `true` | Showcase log broadcasting |
| `LLM_FALLBACK_LOCAL` | `false` | Route to local model if OpenAI unavailable |
| `MAINTENANCE_MODE` | `false` | Return 503 for all non-health endpoints |

---

## 6. Secret Management

### 6.1 Secret Categories

| Category | Examples | Management Strategy |
|----------|----------|---------------------|
| **API Keys** | OpenAI API key, GitHub OAuth client secret | Environment variables on deployment target |
| **Cryptographic Keys** | JWT signing secret (`SECRET_KEY`) | 256-bit random string generated via `openssl rand -hex 32` |
| **Database Credentials** | PostgreSQL password | Unique per environment; not shared between staging and production |
| **Storage Credentials** | MinIO/S3 access keys | IAM-style least-privilege credentials |
| **SSL Certificates** | Let's Encrypt private keys | Managed by certbot; auto-renewed |

### 6.2 Secret Rotation Policy

| Secret Type | Rotation Frequency | Procedure |
|-------------|-------------------|-----------|
| OpenAI API key | Every 90 days | Generate new key in OpenAI dashboard; update GitHub Secrets; redeploy |
| JWT signing key | Every 180 days | Generate new key; all existing sessions invalidated; users must re-login |
| Database password | Every 180 days | Update PostgreSQL user password; update env vars; rolling restart |
| GitHub OAuth secret | On suspicion of compromise | Regenerate in GitHub App settings; update env vars; redeploy |

### 6.3 Local Secret Handling

- `.env` files are listed in `.gitignore` and never committed.
- Developers use `.env.example` as a template and populate their own `.env`.
- For team development (future), a shared secret manager (e.g., 1Password CLI, Doppler, or HashiCorp Vault) can be integrated.

---

## 7. Rollback Strategy

### 7.1 Application Rollback

Docker image tagging enables instant rollback:

```bash
# Emergency rollback script (executed on VPS)
#!/bin/bash
set -e

PREVIOUS_IMAGE_TAG="ghcr.io/user/repo/api:abc123"  # Previous known-good SHA

cd /opt/portfolio

# Rollback API image
docker-compose -f docker-compose.prod.yml pull api:$PREVIOUS_IMAGE_TAG
docker-compose -f docker-compose.prod.yml up -d api

# Verify health
curl -f http://localhost:8000/health || exit 1

echo "Rollback complete"
```

**Rollback triggers:**
- Health check failures after deployment (> 3 consecutive failures)
- Error rate spike (> 5% 5xx responses over 5 minutes)
- Manual trigger via GitHub Actions workflow dispatch

### 7.2 Database Rollback

- **Migrations are forward-only.** Downward migrations (`alembic downgrade`) are tested in staging but used in production only during emergency rollback.
- **Pre-deployment backup:** `pg_dump` is executed automatically before any production migration.
- **Backup retention:** 7 daily backups + 4 weekly backups.

```bash
# Automated pre-migration backup
BACKUP_FILE="/backups/portfolio_$(date +%Y%m%d_%H%M%S).sql"
docker-compose -f docker-compose.prod.yml exec -T postgres pg_dump -U postgres portfolio > $BACKUP_FILE
gzip $BACKUP_FILE
```

### 7.3 Rollback Decision Matrix

| Scenario | Rollback Target | Time to Recover | Data Loss Risk |
|----------|----------------|-----------------|----------------|
| Bug in new code | Previous Docker image | < 2 minutes | None |
| Bad database migration | Pre-migration backup + previous image | 5-15 minutes | Data written since backup |
| Infrastructure failure | Previous Terraform state / config | 10-30 minutes | Depends on failure mode |
| Security compromise | Immediate key rotation + image rebuild | 15-60 minutes | Audit logs preserved |

---

## 8. Monitoring in Production

### 8.1 Health Check Endpoints

| Endpoint | Purpose | Expected Response | Frequency |
|----------|---------|-------------------|-----------|
| `GET /health` | Liveness probe | `{"status": "ok"}` | Every 10s |
| `GET /health/ready` | Readiness probe | `{"status": "ready", "checks": {"db": true, "redis": true, "qdrant": true}}` | Every 10s |
| `GET /health/live` | Deep health check | Includes dependency latency | Every 60s |

### 8.2 Application Monitoring

| Tool | Purpose | Data Source |
|------|---------|-------------|
| **Prometheus** | Metrics collection | FastAPI `/metrics` endpoint (Prometheus format) |
| **Grafana** | Metrics visualization | Prometheus data source |
| **Loki** | Log aggregation | Docker log driver or Promtail |
| **Alertmanager** | Alert routing | Prometheus rule evaluations |

### 8.3 Key Alerts

| Alert | Condition | Severity | Action |
|-------|-----------|----------|--------|
| High Error Rate | `rate(api_requests_total{status=~"5.."}[5m]) > 0.05` | Critical | Page developer, trigger rollback review |
| High Latency | `histogram_quantile(0.99, api_latency_seconds) > 2.0` | Warning | Investigate DB or AI service degradation |
| Database Connection Pool Exhausted | `db_pool_available_connections < 2` | Critical | Scale DB connections or investigate leaks |
| Redis Memory High | `redis_memory_used_bytes / redis_memory_max_bytes > 0.9` | Warning | Evict old keys or scale Redis memory |
| Disk Space Low | `node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1` | Critical | Clean up logs/images or expand disk |
| SSL Expiry | `ssl_cert_expiry_days < 7` | Warning | Trigger certbot renewal |
| Celery Worker Down | `celery_worker_up < 1` | Critical | Restart worker container |

### 8.4 Uptime Monitoring

External uptime monitoring (e.g., UptimeRobot, Pingdom, or StatusCake) checks the production endpoint every 5 minutes from multiple global locations.

---

## 9. Backup & Disaster Recovery

### 9.1 Backup Schedule

| Data | Method | Frequency | Retention |
|------|--------|-----------|-----------|
| PostgreSQL | `pg_dump` + gzip | Daily at 02:00 UTC | 7 daily + 4 weekly |
| Qdrant | Snapshot API | Every 6 hours | 4 snapshots |
| Redis | RDB snapshot | Every hour | 24 hours |
| MinIO objects | `mc mirror` to secondary bucket | Daily | 7 days |
| Application config | Git repository | Every commit | Infinite (Git history) |

### 9.2 Disaster Recovery Objectives

| Metric | Target | Implementation |
|--------|--------|----------------|
| **RPO (Recovery Point Objective)** | < 24 hours | Daily automated backups |
| **RTO (Recovery Time Objective)** | < 1 hour | Docker Compose restart from backup on fresh VM |
| **Data Durability** | 99.9% | Multiple backup copies + offsite sync (future) |

---

## 10. Security Hardening

### 10.1 Container Security

| Practice | Implementation |
|----------|---------------|
| Non-root user | All containers run as `appuser` (UID 1000) |
| Read-only root filesystem | `read_only: true` where possible |
| No new privileges | `no_new_privileges: true` |
| Resource limits | CPU and memory limits defined in `docker-compose.prod.yml` |
| Image scanning | Trivy or Snyk scans in CI pipeline |
| Minimal base images | `python:3.11-slim`, `node:20-alpine` |

### 10.2 Network Security

| Practice | Implementation |
|----------|---------------|
| Internal network isolation | Docker Compose `internal: true` for databases; only `web` and `nginx` exposed |
| Firewall (UFW) | Ports 22 (SSH), 80 (HTTP), 443 (HTTPS) only |
| Fail2ban | SSH brute-force protection |
| Automatic security updates | `unattended-upgrades` for Ubuntu |

---

*Document maintained by the DevOps & Infrastructure Team. Last updated: 2026-05-06.*
