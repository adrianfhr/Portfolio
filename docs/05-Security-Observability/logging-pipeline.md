# Logging Pipeline

> **Scope:** Structured logging, masking, and broadcast filtering  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

The logging pipeline turns backend events into structured, safe, and queryable records. It also determines which log lines are eligible for public broadcast to the live logs viewer.

## 2. Format

- JSON structured logs only.
- Required fields: timestamp, level, module, message, trace_id.
- Additional metadata should stay structured rather than concatenated into strings.

## 3. Redaction

- Redact passwords, tokens, API keys, secrets, and authorization headers.
- Apply redaction before storage, broadcast, or export.
- Use a consistent placeholder such as `[REDACTED]`.

## 4. Broadcast Policy

- Only logs tagged for showcase viewing may reach the browser.
- Public logs should be filtered to the correct session and scope.
- High-volume bursts may be buffered before broadcast.

## 5. Storage and Retention

- Keep operational logs long enough for debugging and short enough for privacy.
- Separate audit logs from general operational logs.
- Ensure exported logs do not reveal masked data.

## 6. Cross-References

- [Live Logs Viewer](../03-Core-AI-Modules/Live-Logs/PRD/prd.md)
- [Abuse Prevention](abuse-prevention.md)
- [Incident Handling](incident-handling.md)