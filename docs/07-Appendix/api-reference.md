# API Reference

> **Scope:** Consolidated API surface overview  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

This reference summarizes the major API groups used across the portfolio. It is intentionally high-level and should point readers to the module-specific docs for the exact payloads.

## 2. Endpoint Groups

### Authentication
- `/api/auth/github/initiate`
- `/api/auth/github/callback`
- `/api/auth/logout`
- `/api/auth/me`

### Chatbot
- Chat completion and streaming routes.

### Vision
- Face analysis and status routes.

### Vector Search
- Semantic search and admin ingestion routes.

### Multi-Agent
- Workflow start, status, and event streams.

### Monitoring
- Metrics summary, live metrics, and health checks.

### Logs
- Live log WebSocket stream and supporting routes.

## 3. Documentation Guidance

- Keep request and response examples synchronized with the code.
- Document auth requirements and rate limits for each endpoint.
- Prefer separate module docs for full payload details.

## 4. Cross-References

- [API Explorer](../03-Core-AI-Modules/API-Explorer/PRD/prd.md)
- [Authentication Strategy](../05-Security-Observability/auth-strategy.md)