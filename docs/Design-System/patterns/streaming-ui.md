# Streaming UI

> **Scope:** SSE and token-by-token rendering patterns  
> **Version:** 1.0  
> **Status:** Draft

## 1. Overview

Streaming UI should make progressive output readable and calm. It should help users understand that content is arriving in steps rather than all at once.

## 2. Patterns

- Word-by-word or chunk-by-chunk reveal.
- Typing cursor.
- Stop/cancel control.
- Partial output preservation.

## 3. Behavior

- Preserve partial content when a stream stops.
- Keep the reading position stable.
- Avoid rapid visual jitter.

## 4. Cross-References

- [Chat](../components/chat.md)
- [AI Loading States](ai-loading-states.md)