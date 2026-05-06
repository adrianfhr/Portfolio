# States — RAG Chatbot Module

**Module ID:** RAG-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. Global Chat States

### 1.1 Empty State
- **Trigger:** No active session; no messages in current session.
- **Visual:**
  - Chat area centered illustration (sparkles icon).
  - Heading: "Ask me anything about Adrian".
  - Subtext explaining capabilities.
  - Suggestion chips row.
  - Input field active and ready.
- **Behavior:** User can type and send immediately.
- **Transitions:** → Loading (Retrieval) on first message send.

### 1.2 Loading (Retrieval)
- **Trigger:** User sent message; SSE connection open; waiting for first `delta`.
- **Visual:**
  - User message rendered in chat area.
  - Typing indicator visible below.
  - Right panel Process tab shows active steps (embedding, search).
  - Input disabled, stop button visible.
- **Behavior:** System is executing hybrid retrieval and reranking.
- **Transitions:** → Streaming (on first delta), → Error (on SSE error), → Refusal (on guardrail trigger).

### 1.3 Streaming
- **Trigger:** First `delta` SSE event received.
- **Visual:**
  - Assistant message bubble appears and grows token-by-token.
  - Typing indicator hidden.
  - Right panel shows "Generation" step active.
  - Citations render as plain text initially, become interactive after `citation` event.
- **Behavior:** Tokens append to message content; ReactMarkdown re-renders.
- **Transitions:** → Complete (on `done`), → Stopped (on user abort), → Error (on `error`).

### 1.4 Complete
- **Trigger:** `done` SSE event received.
- **Visual:**
  - Full assistant message rendered with citations.
  - Source chunks visible in right panel.
  - Input re-enabled, send button restored.
  - Timestamp shown below message.
- **Behavior:** Message persisted to database; conversation list updated.
- **Transitions:** → Empty (if user clears chat), → Loading (on next message).

### 1.5 Stopped
- **Trigger:** User clicked stop button.
- **Visual:**
  - Partial assistant message visible with "(generation stopped)" label in italics.
  - Input re-enabled with original query pre-filled.
- **Behavior:** SSE connection closed; partial message NOT persisted.
- **Transitions:** → Loading (on retry), → Empty.

### 1.6 Refusal
- **Trigger:** Hallucination guardrail activated (top score < 0.7).
- **Visual:**
  - System message bubble (emerald/slate background) with refusal text.
  - No citations rendered.
  - Right panel shows guardrail trigger with score details.
- **Behavior:** No LLM generation occurred; quota still decremented.
- **Transitions:** → Complete (technically complete, but no assistant content).

### 1.7 Error
- **Trigger:** SSE error, timeout, network failure, or rate limit.
- **Visual:**
  - Error toast at top of chat area.
  - If mid-stream, partial message remains with "(incomplete)" label.
  - Input re-enabled.
- **Behavior:** Error logged; user can retry.
- **Transitions:** → Loading (on retry).

### 1.8 Quota Exhausted
- **Trigger:** Quota reached 0 (from Auth module).
- **Visual:**
  - Input overlay: "Daily quota exhausted. Login for 200/day."
  - Send button disabled.
  - Previous messages remain readable.
- **Behavior:** No new messages can be sent.
- **Transitions:** → Empty/Complete (on login success, quota restored).

---

## 2. Component States

### 2.1 ChatInput

| State | Visual | Interaction |
|---|---|---|
| **Idle** | Default styling | Typing, send on Enter |
| **Focused** | Ring highlight, brighter border | Typing |
| **Disabled** | Opacity 0.5, cursor not-allowed | None |
| **Loading** | Spinner on send button, input disabled | Stop button active |
| **Quota Blocked** | Overlay with CTA | None (overlay CTA clickable) |
| **Error** | Red border, error tooltip | Typing, send retry |

### 2.2 MessageBubble (Assistant)

| State | Visual | Interaction |
|---|---|---|
| **Streaming** | Bottom border pulse animation | Copy hidden |
| **Complete** | Static | Copy button visible on hover |
| **Error** | Rose left border | Retry button visible |
| **Refusal** | Emerald/slate background | No copy button |

### 2.3 CitationPill

| State | Visual | Interaction |
|---|---|---|
| **Inactive** | Plain text (no data yet) | None |
| **Active** | Styled button | Hover tooltip, click navigates |
| **Highlighted** | Ring accent | Auto-highlighted for 2s on navigation |

### 2.4 LiveProcessPanel

| State | Visual | Interaction |
|---|---|---|
| **Idle** | Last request steps visible (grayed) | Tabs clickable |
| **Active** | Steps animate in as they occur | Tabs clickable |
| **Error** | Failed step shows red X and detail | Hover for error message |

### 2.5 ConversationSidebar

| State | Visual | Interaction |
|---|---|---|
| **Loading** | Skeleton rows (3) | None |
| **Loaded** | Conversation list | Click to load, hover for actions |
| **Empty** | Empty state illustration | CTA to start chat |
| **Renaming** | Inline input field | Enter to save, Escape to cancel |
| **Deleting** | Item opacity 0.5, undo toast | Undo within 5s |

---

## 3. Session Lifecycle States

| State | Description | Persistence |
|---|---|---|
| **Ephemeral** | Session exists only in memory / `sessionStorage` | None |
| **Active** | Messages exchanged, Redis history populated | Redis (24h) |
| **Persisted** | Complete conversation saved to PostgreSQL | PostgreSQL |
| **Archived** | Soft-deleted by user | PostgreSQL (soft delete, 30d) |
| **Anonymized** | Guest session expired, PII removed | PostgreSQL (content retained, identity removed) |

---

## 4. State Transition Diagram (Summary)

```
Empty
  │
  ▼
Loading (Retrieval)
  │
  ├─► Streaming ──► Complete ──► Empty (next turn)
  │       │
  │       ├─► Stopped
  │       │
  │       └─► Error
  │
  ├─► Refusal
  │
  └─► Error
```
