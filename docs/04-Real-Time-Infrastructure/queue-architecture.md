# Queue Architecture — Real-Time Infrastructure

> **Scope:** Background jobs and async orchestration  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

The queue layer decouples expensive or slow operations from the request/response path. It supports inference jobs, embedding generation, cleanup jobs, and long-running workflow execution.

## 2. Core Components

- **Broker:** Redis queue transport.
- **Workers:** Celery workers for CPU-bound and IO-bound tasks.
- **Task Store:** Redis or a database-backed status record for job progress.
- **Dead Letter Path:** Failed or exhausted tasks should be visible for follow-up.

## 3. Task Routing

- Use separate queues for inference, embeddings, cleanup, and workflow orchestration.
- Prioritize user-facing inference and status updates over background maintenance.
- Keep cleanup jobs low priority.

## 4. Retry Policy

- Retry transient failures with bounded exponential backoff.
- Do not retry validation failures.
- Mark jobs as failed when the retry budget is exhausted.

## 5. Queue Visibility

- Expose queue depth to the observability dashboard.
- Emit status events when jobs are enqueued, started, retried, or completed.
- Surface queue wait time in user-facing modules when applicable.

## 6. Failure Modes

- Redis downtime should degrade gracefully where possible.
- Worker crashes must not silently drop job state.
- Poison messages should be isolated from normal traffic.

## 7. Cross-References

- [Streaming Strategy](streaming-strategy.md)
- [Failover Strategy](failover-strategy.md)
- [Observability Dashboard](../03-Core-AI-Modules/Observability/PRD/prd.md)
- [Face Recognition System](../03-Core-AI-Modules/Face-Recognition/PRD/prd.md)