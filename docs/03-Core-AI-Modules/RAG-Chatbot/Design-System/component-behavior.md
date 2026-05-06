# Component Behavior — RAG Chatbot Module

**Module ID:** RAG-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. ChatContainer

### Overview
The root layout component managing sidebar, chat area, and right panel. Handles responsive layout switching and panel visibility state.

### Behaviors

#### 1.1 Initialization
- Check `sessionStorage` for `chat_session_id`.
- If found, fetch conversation history from `GET /api/v1/chat/sessions/{id}`.
- If not found, render empty chat state with suggestion chips.
- Fetch user's conversation list for sidebar.

#### 1.2 Panel Visibility
- **Desktop:** All three panels visible by default. Right panel can be toggled via header button.
- **Tablet:** Sidebar hidden by default (slide-out). Right panel visible.
- **Mobile:** Both sidebar and right panel hidden by default. Right panel accessed via FAB or header toggle.
- Panel state persisted in `localStorage` key `chat_panels_state`.

#### 1.3 Scroll Management
- Chat area auto-scrolls to bottom when new messages arrive.
- If user has manually scrolled up (>100px from bottom), auto-scroll is paused.
- A "Scroll to bottom" button appears when paused and new messages arrive.
- On sending a message, auto-scroll resumes.

---

## 2. MessageList

### Overview
Renders the chronological list of user and assistant messages.

### Behaviors

#### 2.1 Message Rendering
- User messages: right-aligned, blue bubble.
- Assistant messages: left-aligned, slate bubble, with avatar.
- System messages (refusals, errors): center-aligned, full-width, distinct background.
- Markdown parsed via `react-markdown` + `rehype-highlight`.
- DOMPurify sanitizes HTML before render.

#### 2.2 Streaming Message
- When `isStreaming` is true, last assistant message renders incrementally.
- Each SSE `delta` appends to message content string.
- `ReactMarkdown` re-renders on content change (optimized with memoization).
- Citation pills `[1]` are parsed and rendered as interactive `<button>` elements during streaming.

#### 2.3 Message Actions
- **Copy:** Hovering assistant message reveals copy button (top-right). Copies raw markdown text.
- **Regenerate:** Available on last assistant message if it was erroneous. Re-sends last user message.
- **Feedback:** Thumbs up/down buttons (future release).

#### 2.4 Virtualization
- If conversation exceeds 50 messages, enable virtual scrolling (react-window).
- Estimated row height: 80px; dynamic measurement for code-heavy messages.

---

## 3. ChatInput

### Overview
The message composition interface at the bottom of the chat area.

### Behaviors

#### 3.1 Input Handling
- `textarea` with `rows=1` auto-expands to `maxRows=5`.
- `Enter` key sends if cursor is at end of input; `Shift+Enter` inserts newline.
- On mobile, `Enter` always inserts newline; send button must be tapped.
- Input value bound to React state; debounced at 150ms for character count.

#### 3.2 Send Flow
1. Validate input: non-empty, length <= 2000, no blocklisted phrases.
2. Check quota via auth store; disable if exhausted.
3. Optimistically append user message to MessageList.
4. Clear input field.
5. Create abort controller for SSE connection.
6. Open `POST /api/v1/chat` with `Accept: text/event-stream`.
7. Show typing indicator during retrieval phase.
8. On first `delta` event, hide typing indicator and start rendering assistant message.
9. On `done` event, hide stop button, persist message to store.
10. On `error` event, append error message to conversation.

#### 3.3 Stop Flow
- Clicking stop button calls `abortController.abort()`.
- Partial assistant message remains visible with "(generation stopped)" label.
- Message is NOT persisted to database.
- Input field retains the original user query for easy retry.

#### 3.4 Disabled States
- **Quota Exhausted:** Input shows overlay "Quota exhausted. Login for more." with GitHub CTA.
- **Loading:** Input disabled, send button replaced with spinner.
- **Error:** Input enabled; error toast shown.

---

## 4. CitationPill

### Overview
Renders superscript citation markers inside assistant messages and links them to source chunks.

### Behaviors

#### 4.1 Rendering
- Parsed from message text using regex `/\[(\d+)\]/g`.
- Rendered as `<sup>` or small button with amber styling.
- Positioned inline with text flow.

#### 4.2 Interaction
- **Hover:** Tooltip shows document name and score.
- **Click:** If right panel is closed, opens it and switches to "Sources" tab. Scrolls to and highlights the corresponding source chunk card.
- **Highlight:** Selected citation pill gets `ring-2 ring-amber-400` for 2 seconds.

#### 4.3 Source Synchronization
- When `citation` SSE event arrives, source chunks are stored in Zustand store.
- Citation pills are interactive only after source data is available.
- Before source data arrives, pills render as plain text (non-interactive).

---

## 5. LiveProcessPanel

### Overview
The right panel displaying real-time RAG pipeline steps and retrieved source chunks.

### Behaviors

#### 5.1 Process Tab
- Subscribes to WebSocket `ws://host/ws/logs`.
- Filters messages for `trace_id` matching current chat request.
- Each step card animates in when its log message arrives.
- Steps are ordered pipeline-wise; earlier steps cannot appear after later steps in the same request.
- Latency values are formatted as `123ms` or `1.2s`.

#### 5.2 Sources Tab
- Populated after `citation` SSE event.
- Source chunk cards ordered by reranker score (highest first).
- Each card is collapsible (show/hide full chunk text).
- Clicking a card scrolls chat to the corresponding citation pill and highlights it.
- Cards update if a new request replaces the sources (new conversation turn).

#### 5.3 Tab Switching
- Switching tabs does not interrupt WebSocket or SSE connections.
- Active tab state persisted in component state (not URL).

---

## 6. ConversationSidebar

### Overview
The left sidebar listing past conversations.

### Behaviors

#### 6.1 List Loading
- Conversations fetched on mount via `GET /api/v1/chat/sessions`.
- Ordered by `updated_at` descending.
- Skeleton loaders shown during initial load (3 shimmering rows).

#### 6.2 New Chat
- Clicking "+ New Chat" clears `sessionStorage`, resets chat store, renders empty state.
- Old session remains in sidebar list.

#### 6.3 Session Selection
- Clicking a session loads its messages into chat area.
- Active session highlighted with left border accent.
- Loading state: spinner in chat area while fetching.

#### 6.4 Rename
- Click session title (or pencil icon on hover) to enter inline edit mode.
- Input field with current title; `Enter` to save, `Escape` to cancel.
- PATCH request to `/api/v1/chat/sessions/{id}`.
- Optimistic UI update.

#### 6.5 Delete
- Click trash icon → confirmation modal → DELETE request.
- Soft delete: item fades out, undo toast shown for 5 seconds.
- After 5 seconds, item removed from list.

#### 6.6 Empty State
- If no conversations exist, show empty state illustration and "Start chatting" CTA.
- CTA focuses the chat input.

---

## 7. TypingIndicator

### Overview
Animated indicator shown while the system is retrieving sources (before first token arrives).

### Behaviors
- Appears below the last assistant message placeholder.
- Three dots pulse sequentially.
- Label changes based on phase:
  - "Retrieving sources..." (during vector/keyword search).
  - "Thinking..." (during reranking and context injection).
- Disappears on first `delta` SSE event or `error` event.
- If retrieval takes >3s, label appends "(this may take a moment)".

---

## 8. SuggestionChips

### Overview
Pre-defined prompts shown in empty chat state to help users get started.

### Behaviors
- Rendered as horizontal scrollable row (or wrapped grid on desktop).
- Clicking a chip populates the chat input with the prompt text.
- If input is empty, chip click immediately sends the message.
- If input has text, chip click appends the chip text to input.
- Chips animate in with 50ms stagger on first render.

---

## 9. ErrorToast

### Overview
Transient notifications for chat-related errors (timeout, rate limit, network failure).

### Behaviors
- Appears at top-center of chat area (or global toast position).
- Auto-dismisses after 5 seconds unless hovered.
- Types:
  - **Rate Limit:** "Daily quota exhausted. Login for more." (amber).
  - **Network Error:** "Connection lost. Retrying..." (rose).
  - **Timeout:** "Response took too long. Please try again." (rose).
  - **Generic:** "Something went wrong. Please refresh." (slate).
- Dismissible via close button or swipe-up on mobile.
