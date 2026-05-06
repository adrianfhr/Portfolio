# AI Playground — UI Specification

> **Module:** AI Playground  
> **Version:** 1.0  
> **Layout Philosophy:** Tool-like, dense, and information-rich. Inspired by Vercel AI Playground, OpenAI Platform, and Datadog dashboards.

---

## 1. Overall Layout

### 1.1 Desktop (≥1024px)

The interface follows a **three-column layout** optimized for parallel information consumption:

| Column | Width | Content |
|---|---|---|
| **Left — Parameters** | 20% (min 280px, max 360px) | Model selector, parameter controls, system prompt editor, presets |
| **Center — Chat** | 50% (flex-grow) | Conversation history, message input, action bar |
| **Right — Analytics** | 30% (min 320px, max 420px) | Token stats, cost estimate, latency history, charts |

**Container:** Full viewport height (`100vh`), no external page scroll. Internal scrolling within columns.

### 1.2 Tablet (768px–1023px)

- Parameters panel collapses into an **accordion drawer** on the left edge.
- Chat occupies 65%.
- Analytics panel collapses into a **bottom sheet** (250px tall, expandable).

### 1.3 Mobile (<768px)

- Single-column stacked layout.
- Parameters as a bottom sheet modal.
- Analytics as a collapsible panel below the chat.
- Comparison mode stacks panels vertically with a tab switcher.

---

## 2. Parameters Panel (Left Column)

### 2.1 Structure

```
┌─ Parameters Panel ───────────────────┐
│  ▼ Model Selection                    │
│    [gpt-4o-mini ▼]  [Low Cost]        │
│                                       │
│  ▼ System Prompt                      │
│    ┌────────────────────────────┐     │
│    │ You are a helpful...       │     │
│    │                            │     │
│    └────────────────────────────┘     │
│    42 / 4000 chars                    │
│    [Helpful] [Code] [Creative] [Tutor]│
│                                       │
│  ▼ Parameters                         │
│    Temperature [====●====] 1.0   (?)  │
│    Max Tokens  [=====●===] 500   (?)  │
│    Top P       [========●] 1.0   (?)  │
│    Freq Penalty[====●====] 0.0   (?)  │
│    Pres Penalty[====●====] 0.0   (?)  │
│                                       │
│  [Reset to Defaults]                  │
└───────────────────────────────────────┘
```

### 2.2 Model Selector

- **Component:** Custom dropdown with search/filter.
- **Visual:** Model name + cost tier badge (color-coded: green=low, yellow=standard, red=premium).
- **Disabled State:** Grayed out with "Unavailable" badge and tooltip explaining why.

### 2.3 Parameter Controls

- **Component:** Range slider + numeric input side-by-side.
- **Slider Track:** `height: 4px`, `border-radius: 2px`.
- **Slider Thumb:** `width: 16px`, `height: 16px`, `border-radius: 50%`, `background: var(--primary)`, `box-shadow: 0 0 0 2px var(--primary-light)`.
- **Numeric Input:** `width: 60px`, `text-align: center`, `font-variant-numeric: tabular-nums`.
- **Tooltip Icon:** `16×16px` circle with "?", hover reveals a popover `max-width: 280px`.

### 2.4 System Prompt Editor

- **Textarea:** `font-family: monospace`, `font-size: 13px`, `line-height: 1.5`.
- **Border:** `1px solid var(--border)`, `border-radius: 8px`.
- **Focus State:** `border-color: var(--primary)`, `box-shadow: 0 0 0 3px var(--primary-alpha-20)`.
- **Character Counter:** Right-aligned, color transitions to orange at 3500 chars, red at 4000 chars.
- **Presets:** Horizontal row of small pill buttons, `height: 28px`, `border-radius: 14px`.

---

## 3. Chat Panel (Center Column)

### 3.1 Structure

```
┌─ Chat Panel ──────────────────────────┐
│  ┌─ User Message (right) ──────────┐  │
│  │ Explain quantum computing...    │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─ AI Response (left) ────────────┐  │
│  │ Quantum computing leverages...   │  │
│  │ ...superposition and entanglement│  │
│  │ [streaming cursor █]             │  │
│  └─────────────────────────────────┘  │
│                                       │
│  [Token count: 142]  [Latency: 1.2s]  │
│                                       │
│  ┌─ Input Area ───────────────────┐   │
│  │ [Type a message...          ] [Send]│
│  │ [New Session] [Stop Gen]          │  │
│  └─────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

### 3.2 Message Bubbles

- **User Bubble:**
  - `background: var(--primary)`
  - `color: var(--primary-fg)`
  - `border-radius: 16px 16px 4px 16px`
  - `max-width: 80%`
  - `padding: 12px 16px`

- **AI Bubble:**
  - `background: var(--surface-elevated)`
  - `color: var(--text-primary)`
  - `border: 1px solid var(--border-subtle)`
  - `border-radius: 16px 16px 16px 4px`
  - `max-width: 90%`
  - `padding: 16px`

### 3.3 Input Area

- **Textarea:** `min-height: 48px`, `max-height: 200px`, auto-expands.
- **Send Button:** Primary button, `40×40px` circle with paper-plane icon.
- **Action Bar:** Below input, `font-size: 12px`, muted color.
- **Streaming Cursor:** `1ch` wide blinking block (`animation: blink 1s step-end infinite`).

### 3.4 Comparison Mode Layout

```
┌─ Comparison Mode ─────────────────────┐
│  [Panel A: gpt-4o-mini]  VS  [Panel B: gpt-4o]  │
│  ┌──────────────┐  ┌──────────────┐   │
│  │ Response A...│  │ Response B...│   │
│  │              │  │              │   │
│  └──────────────┘  └──────────────┘   │
│  [Tokens: 142]       [Tokens: 198]    │
│  [$0.0002]           [$0.0045]        │
│  [Fast]              [Slow]           │
└───────────────────────────────────────┘
```

- **Divider:** A vertical line with a circular "VS" badge in the center.
- **Sync Button:** Floating button above the VS badge to copy prompt from A→B.

---

## 4. Analytics Panel (Right Column)

### 4.1 Structure

```
┌─ Analytics Panel ─────────────────────┐
│  ● LIVE                               │
│                                       │
│  ┌─ Token Breakdown ──────────────┐   │
│  │ [Pie Chart: Prompt 23% |      │   │
│  │  Completion 77%]               │   │
│  │ Prompt: 38 tokens              │   │
│  │ Completion: 128 tokens         │   │
│  │ Total: 166 tokens              │   │
│  └────────────────────────────────┘   │
│                                       │
│  ┌─ Cost Estimate ────────────────┐   │
│  │ $0.000247 USD                  │   │
│  │ (gpt-4o-mini pricing)          │   │
│  └────────────────────────────────┘   │
│                                       │
│  ┌─ Latency History ─────────────┐    │
│  │ HH:MM:SS | Model | Tokens| ms │    │
│  │ 14:32:01 | mini   | 166   | 1.2s [Fast] │
│  │ 14:28:44 | 4o     | 342   | 3.1s [Slow] │
│  └────────────────────────────────┘   │
└───────────────────────────────────────┘
```

### 4.2 Token Chart

- **Type:** Donut chart (inner radius 60%, outer 80%).
- **Colors:** Prompt = `var(--info)`, Completion = `var(--success)`.
- **Labels:** Center shows total token count in `font-size: 24px`, `font-weight: 700`.
- **Animation:** Segments animate with a `stroke-dasharray` transition over 600ms.

### 4.3 Cost Estimate

- **Display:** Large monospace text, `font-size: 20px`, `font-weight: 600`.
- **Subtext:** Model name and pricing tier in muted color.
- **Update:** Animates with a subtle scale pulse (`transform: scale(1.05)` → `scale(1)`) when value changes.

### 4.4 Latency History Table

- **Rows:** Alternating background colors (`var(--surface)` / `var(--surface-elevated)`).
- **Badges:**
  - Fast: `background: var(--success-alpha-20)`, `color: var(--success)`, `border-radius: 4px`, `padding: 2px 8px`.
  - Slow: `background: var(--warning-alpha-20)`, `color: var(--warning)`.
- **Empty State:** "No requests yet. Send a message to see latency data."

---

## 5. Color Tokens (Playground-Specific)

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `--primary` | `#2563EB` | `#3B82F6` | Sliders, buttons, user bubbles |
| `--primary-light` | `#93C5FD` | `#60A5FA` | Slider thumb focus ring |
| `--surface` | `#F8FAFC` | `#0F172A` | Panel backgrounds |
| `--surface-elevated` | `#FFFFFF` | `#1E293B` | Cards, bubbles, inputs |
| `--border` | `#E2E8F0` | `#334155` | Dividers, textarea borders |
| `--border-subtle` | `#F1F5F9` | `#1E293B` | AI bubble border |
| `--text-primary` | `#0F172A` | `#F8FAFC` | Primary text |
| `--text-muted` | `#64748B` | `#94A3B8` | Labels, subtext |
| `--success` | `#10B981` | `#34D399` | Fast badge, completion tokens |
| `--warning` | `#F59E0B` | `#FBBF24` | Slow badge, high token warning |
| `--info` | `#3B82F6` | `#60A5FA` | Prompt tokens |
| `--error` | `#EF4444` | `#F87171` | Validation errors |

---

## 6. Typography

| Element | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| Panel Headers | System UI | 14px | 600 | 1.4 |
| Parameter Labels | System UI | 13px | 500 | 1.4 |
| Slider Values | Monospace | 13px | 600 | 1 |
| Chat User | System UI | 14px | 400 | 1.5 |
| Chat AI | System UI | 14px | 400 | 1.6 |
| Code in Chat | Monospace | 13px | 400 | 1.5 |
| Token Total | System UI | 24px | 700 | 1 |
| Cost | Monospace | 20px | 600 | 1 |
| History Table | Monospace | 12px | 400 | 1.4 |
