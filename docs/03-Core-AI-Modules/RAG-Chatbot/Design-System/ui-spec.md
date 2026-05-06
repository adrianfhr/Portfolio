# UI Specification — RAG Chatbot Module

**Module ID:** RAG-001-DS  
**Version:** 1.0.0  
**Status:** Draft

---

## 1. Design Principles

The chatbot UI must feel like a **premium developer tool** — clean, information-dense, and technically transparent. The layout prioritizes the conversation while making the underlying RAG pipeline visible to those who care (via the live process panel).

### Visual Language
- **Density:** Comfortable reading width (max 768px for messages).
- **Color Semantics:** Blue = user, Slate = assistant, Amber = citations, Emerald = system success.
- **Typography:** Sans-serif for prose; monospace for code, logs, and metrics.

---

## 2. Layout Architecture

### Desktop (>1024px): Three-Column Layout
```
┌─────────────────┬─────────────────────────────┬─────────────────┐
│                 │                             │                 │
│   Sidebar       │      Chat Area              │  Right Panel    │
│   (240px)       │      (flex-1)               │  (320px)        │
│                 │                             │                 │
│   History       │   Messages                  │  Live Logs /    │
│   List          │   Input                     │  Citations      │
│                 │                             │                 │
└─────────────────┴─────────────────────────────┴─────────────────┘
```

### Tablet (768–1024px): Two-Column Layout
```
┌─────────────────────────────┬─────────────────┐
│                             │                 │
│      Chat Area              │  Right Panel    │
│      (flex-1)               │  (280px)        │
│                             │                 │
│   Messages + Input          │  Live Logs      │
│                             │                 │
└─────────────────────────────┴─────────────────┘
```
- Sidebar becomes a slide-out drawer triggered by hamburger menu.

### Mobile (<768px): Single Column
```
┌─────────────────────────────┐
│  Header (menu + title)      │
├─────────────────────────────┤
│                             │
│      Chat Area              │
│      (full width)           │
│                             │
│   Messages                  │
│   Input (sticky)            │
│                             │
└─────────────────────────────┘
```
- Right panel accessible via toggle button (floating action button or header icon).
- Sidebar accessible via hamburger menu.

---

## 3. Chat Area

### 3.1 Message Bubbles

#### User Message
- **Alignment:** Right.
- **Background:** `bg-blue-600`.
- **Text:** White, `text-sm`.
- **Border Radius:** 12px top-left, top-right, bottom-left; 4px bottom-right.
- **Max Width:** 80% of chat area.
- **Padding:** 12px 16px.
- **Timestamp:** Below bubble, `text-[10px] text-slate-500`, right-aligned.

#### Assistant Message
- **Alignment:** Left.
- **Background:** `bg-slate-800`.
- **Text:** `text-slate-200`, `text-sm`.
- **Border Radius:** 12px top-right, top-left, bottom-right; 4px bottom-left.
- **Max Width:** 90% of chat area (wider for code blocks).
- **Padding:** 12px 16px.
- **Avatar:** 28px robot icon (or custom avatar) above bubble, left-aligned.
- **Timestamp:** Below bubble, `text-[10px] text-slate-500`.

### 3.2 Message Content Styling

| Element | Style |
|---|---|
| Paragraph | `mb-3 last:mb-0 leading-relaxed` |
| Bold | `font-semibold text-white` |
| Inline Code | `bg-slate-700 px-1.5 py-0.5 rounded text-xs font-mono text-amber-300` |
| Code Block | `bg-slate-950 border border-slate-700 rounded-lg p-4 overflow-x-auto` |
| Blockquote | `border-l-2 border-slate-500 pl-3 italic text-slate-400` |
| List Item | `ml-4 mb-1` with `list-disc` or `list-decimal` |
| Table | `w-full text-sm border-collapse` with alternating row backgrounds |
| Link | `text-blue-400 hover:underline` |
| Citation Pill | Superscript, `bg-amber-500/20 text-amber-400 text-[10px] px-1 rounded` |

---

## 4. Chat Input

### Placement
Sticky at bottom of chat area, 16px padding from edges.

### Anatomy
```
┌─────────────────────────────────────────────────────────────┐
│  [Textarea]                              [Send] [Stop]     │
└─────────────────────────────────────────────────────────────┘
```

### Specifications
| Element | Value |
|---|---|
| Container | `bg-slate-900 border-t border-slate-800` |
| Textarea | `bg-slate-800 border-slate-700 rounded-lg`, min-height 44px, max-height 200px |
| Placeholder | "Ask about Adrian's experience, projects, or skills..." |
| Send Button | Icon (arrow up), 32px circle, `bg-blue-600`, disabled when empty |
| Stop Button | Icon (square), 32px circle, `bg-rose-600`, shown only during streaming |
| Character Count | `text-[10px] text-slate-500`, shown when >1500 chars |

### Behavior
- Textarea auto-expands up to 5 lines, then scrolls.
- `Enter` sends message; `Shift+Enter` inserts newline.
- Disabled state: opacity 0.5, cursor not-allowed (quota exhausted or loading).

---

## 5. Sidebar (Conversation History)

### Width
240px desktop; full-width overlay on mobile.

### Header
- Title: "Conversations" (`text-sm font-semibold text-slate-300`).
- Action: "+ New Chat" button (small, primary style).

### List Item
```
[ Icon ] [ Title (truncated) ] [ Time ]
         [ Message count ]
```

### Specifications
| Element | Value |
|---|---|
| Item Height | 64px |
| Padding | 12px 16px |
| Background (hover) | `bg-slate-800` |
| Background (active) | `bg-slate-800 border-l-2 border-blue-500` |
| Title | `text-sm text-slate-200` truncate |
| Time | `text-[10px] text-slate-500` |
| Message Count | `text-[10px] text-slate-500` |
| Delete Icon | Trash, 14px, `text-slate-500 hover:text-rose-400`, appears on hover |

### Empty State
- Icon: Chat bubble outline, 48px, `text-slate-600`.
- Text: "No conversations yet." (`text-sm text-slate-500`).

---

## 6. Right Panel (Live Process + Citations)

### Tabs
- "Process" (live pipeline steps)
- "Sources" (retrieved chunks)

### 6.1 Process Tab

#### Pipeline Step Card
```
[ Status Icon ] [ Step Name ]        [ Latency ]
                [ Detail text ]
```

| Step | Icon | Color |
|---|---|---|
| Query Embedding | ⚡ | Blue |
| Vector Search | 🔍 | Purple |
| Keyword Search | 🔤 | Teal |
| RRF Fusion | 🔀 | Indigo |
| Reranking | 📊 | Amber |
| Context Injection | 📋 | Slate |
| Generation | 🤖 | Emerald |

#### Status Icons
- **Pending:** Gray circle outline.
- **Active:** Animated spinner (1s rotation).
- **Complete:** Green checkmark.
- **Error:** Red X.

### 6.2 Sources Tab

#### Source Chunk Card
```
[1] Document: CV_Adrian_2026.pdf
    Section: "Work Experience"
    Score: 0.91
    ─────────────────────────
    "Led the design of a real-time..."
```

- Background: `bg-slate-800`.
- Border: 1px `slate-700`, radius 8px.
- Citation number badge: `bg-amber-500/20 text-amber-400`.
- Score bar: horizontal bar, width = score × 100%, color = `emerald-500` (if >0.7) or `amber-500`.

---

## 7. Typing Indicator

### Placement
Below last assistant message during retrieval phase (before first token arrives).

### Visual
Three animated dots inside a small bubble:
- Dot size: 6px.
- Color: `bg-slate-400`.
- Animation: sequential scale pulse (0.6 → 1.0) with 200ms stagger.
- Label: "Retrieving sources..." (`text-[10px] text-slate-500` below dots).

---

## 8. Empty Chat State

### Placement
Center of chat area when no messages exist.

### Content
```
[ Icon: Sparkles ] (48px, slate-600)
[ Heading: "Ask me anything about Adrian" ] (text-lg, slate-300)
[ Subtext: "I can answer questions about experience, projects, and skills." ] (text-sm, slate-500)
[ Suggestion Chips: "What is your tech stack?", "Tell me about Project X", "What AI tools do you use?" ]
```

### Suggestion Chips
- Style: Pill buttons, `bg-slate-800 border-slate-700`, `text-xs text-slate-300`.
- Hover: `bg-slate-700`.
- Click: Auto-fills input and sends.

---

## 9. Color Tokens

| Token | Value | Usage |
|---|---|---|
| User Bubble BG | `#2563eb` (blue-600) | User messages |
| Assistant Bubble BG | `#1e293b` (slate-800) | Assistant messages |
| Citation BG | `rgba(245,158,11,0.2)` | Citation pills |
| Citation Text | `#fbbf24` (amber-400) | Citation numbers |
| Inline Code BG | `#334155` (slate-700) | Code spans |
| Inline Code Text | `#fcd34d` (amber-300) | Code spans |
| System Message BG | `#064e3b` (emerald-900) | Refusals, errors |
