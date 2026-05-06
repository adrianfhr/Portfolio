# User Stories — RAG Chatbot Module

**Module ID:** RAG-001  
**Version:** 1.0.0  
**Status:** Draft

---

## US-001: Factual Q&A About Portfolio Owner

**As a** Technical Recruiter,  
**I want** to ask specific questions about Adrian's work experience, skills, and projects,  
**So that** I can verify resume claims and assess technical depth without reading static PDFs.

### Acceptance Criteria
- The chatbot answers questions using retrieved document chunks, not parametric knowledge alone.
- Answers include inline citations linking to source documents.
- If no relevant documents are found, the chatbot refuses to answer rather than hallucinating.
- Response time from question submission to first token is under 1.5 seconds.

### Priority: Critical
### Story Points: 5

---

## US-002: Streaming Response Experience

**As a** Portfolio Visitor,  
**I want** to see the AI's response appear word-by-word in real time,  
**So that** I perceive low latency and can begin reading immediately rather than waiting for the full response.

### Acceptance Criteria
- Response streams via SSE with `event: delta` for each token chunk.
- Words appear smoothly without jarring layout shifts.
- A typing indicator is shown during the retrieval phase (before generation begins).
- If streaming is interrupted, the partial response is preserved and an error message is appended.

### Priority: Critical
### Story Points: 3

---

## US-003: Source Citation & Provenance

**As a** Peer Engineer evaluating the RAG implementation,  
**I want** to see exactly which document chunks were retrieved and how they influenced the answer,  
**So that** I can audit retrieval quality and verify the system is not hallucinating sources.

### Acceptance Criteria
- Each factual claim in the response is accompanied by a numbered citation pill.
- Clicking a citation scrolls to or highlights the corresponding source chunk in a side panel.
- The side panel shows: document name, chunk index, similarity score, and raw chunk text.
- Citations are preserved in conversation history for later review.

### Priority: High
### Story Points: 3

---

## US-004: Conversation Memory

**As a** visitor conducting a multi-turn interview simulation,  
**I want** the chatbot to remember context from earlier in our conversation,  
**So that** I can ask follow-up questions like "What tech stack did you use for that?" without restating the project name.

### Acceptance Criteria
- The chatbot retains at least the last 10 turns of conversation.
- Memory persists for 24 hours for guests and 30 days for authenticated users.
- Long conversations are auto-summarized when approaching token limits.
- Memory is displayed in a sidebar history panel with clickable past conversations.

### Priority: High
### Story Points: 5

---

## US-005: Live Process Transparency

**As a** CTO evaluating system architecture,  
**I want** to observe the internal RAG pipeline steps in real time,  
**So that** I can assess engineering decisions around retrieval, reranking, and latency.

### Acceptance Criteria
- A right-side panel (or collapsible drawer) shows live pipeline steps: Query Embedding → Vector Search → Keyword Search → Fusion → Reranking → Context Injection → Generation.
- Each step displays timing, number of candidates, and confidence scores.
- Logs stream via WebSocket with `[SHOWCASE_LOG]` tag.
- The panel can be toggled visible/hidden without losing conversation context.

### Priority: Medium
### Story Points: 3

---

## US-006: Markdown Rendering & Code Highlighting

**As a** Peer Engineer asking technical questions,  
**I want** responses containing code, lists, and tables to be formatted properly,  
**So that** I can read technical answers without parsing raw markdown syntax.

### Acceptance Criteria
- Markdown syntax is rendered to HTML with proper styling.
- Code blocks include syntax highlighting (Prism.js or similar) with language detection.
- Tables render with proper borders and horizontal scrolling on mobile.
- Inline code is styled with monospace font and subtle background.
- All rendered HTML is sanitized via DOMPurify to prevent XSS.

### Priority: High
### Story Points: 2

---

## US-007: Hallucination Safety

**As a** system owner,  
**I want** the chatbot to refuse answering when it lacks sufficient evidence,  
**So that** visitors do not receive fabricated information about my background.

### Acceptance Criteria
- If the top retrieval score is below 0.7, the chatbot responds with a refusal message.
- Refusal message suggests rephrasing the question or contacting the owner directly.
- Refusal events are logged with query text and retrieval scores for debugging.
- The refusal threshold (0.7) is configurable via environment variable.

### Priority: High
### Story Points: 3

---

## US-008: Conversation History Management

**As a** returning authenticated user,  
**I want** to view, rename, and delete my past chat conversations,  
**So that** I can organize my research and remove conversations I no longer need.

### Acceptance Criteria
- Sidebar lists all conversations with title, last message timestamp, and message count.
- Conversations are auto-titled using the first user message (truncated to 40 chars).
- Clicking a conversation loads it into the main chat area.
- Delete action shows a confirmation modal; deleted conversations are soft-deleted for 30 days.
- Rename action is inline (click title → editable field → Enter to save).

### Priority: Medium
### Story Points: 3

---

## US-009: Mobile Chat Experience

**As a** visitor on a mobile device,  
**I want** the chat interface to be fully usable on a small screen,  
**So that** I can interact with the AI assistant without switching to desktop.

### Acceptance Criteria
- Chat input is sticky at the bottom of the viewport.
- Message bubbles adapt to narrow widths without horizontal overflow.
- Sidebar is accessible via a hamburger menu overlay.
- Live process panel is collapsed by default; accessible via toggle.
- Touch targets are at least 44×44px.

### Priority: Medium
### Story Points: 2

---

## US-010: Rate Limit Awareness in Chat

**As a** guest user,  
**I want** to know when my message was not sent due to quota exhaustion,  
**So that** I understand why the chatbot stopped responding.

### Acceptance Criteria
- If quota is exhausted before sending, the send button is disabled with a tooltip.
- If quota is exhausted mid-stream, the stream stops gracefully and a system message explains the limit.
- The message is NOT lost; it remains in the input field for retry after login or reset.

### Priority: Medium
### Story Points: 2
