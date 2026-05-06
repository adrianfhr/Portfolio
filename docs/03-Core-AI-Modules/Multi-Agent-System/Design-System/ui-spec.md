# Multi-Agent System — UI Specification

> **Module:** Multi-Agent System  
> **Version:** 1.0  
> **Layout Philosophy:** CI/CD pipeline meets node graph. Dark-mode first, high information density, real-time kinetic feel.

---

## 1. Overall Layout

### 1.1 Desktop (≥1024px)

A two-pane layout with the workflow graph as the hero element:

| Region | Position | Size | Content |
|---|---|---|---|
| **Header Bar** | Top | 56px height | Module title, connection status, global actions |
| **Input & Controls** | Left sidebar | 320px width, full height minus header | Textarea, start/stop buttons, simulate toggle, history |
| **Graph Canvas** | Center/Right | Remaining width | React Flow node graph, zoom/pan controls |
| **Detail Panel** | Right edge (overlay) | 400px width, slide-in | Selected agent details, logs, tokens |
| **Timeline** | Bottom (collapsible) | 200px default, expandable to 400px | Execution log timeline |

**Container:** Full viewport height (`100vh`), no page scroll. Internal scrolling within panels.

### 1.2 Tablet (768px–1023px)

- Input sidebar collapses to a top bar (120px) with expandable textarea.
- Graph canvas occupies remaining space.
- Detail panel becomes a bottom sheet.
- Timeline is a floating drawer.

### 1.3 Mobile (<768px)

- Stacked layout: Input bar → Graph canvas (scrollable) → Timeline (collapsible).
- Detail panel is a full-screen modal.
- Graph is simplified to a vertical list of agent cards with connection lines.

---

## 2. Header Bar

```
┌─ Header Bar ──────────────────────────────────────────┐
│  🤖 Multi-Agent System      ● Connected    [? Help]   │
│                              ↑ Green pulse dot        │
└───────────────────────────────────────────────────────┘
```

### 2.1 Elements

- **Title:** `font-size: 16px`, `font-weight: 600`, module icon (robot emoji or custom SVG).
- **Connection Status:**
  - Connected: Green pulse dot (`#10B981`), `animation: pulse 2s infinite`.
  - Reconnecting: Amber dot, static.
  - Disconnected: Red dot, static.
- **Help Button:** Opens a modal explaining agent roles and the workflow concept.

---

## 3. Input & Controls Sidebar

```
┌─ Input Sidebar ───────────────────────────────────────┐
│  Workflow Input                                       │
│  ┌────────────────────────────────────────────────┐   │
│  │ Write a blog post about the future of...       │   │
│  │                                                │   │
│  └────────────────────────────────────────────────┘   │
│  45 / 1000 chars                                      │
│                                                       │
│  [⚡ Start Workflow]  [⏹ Stop]                       │
│                                                       │
│  [x] Simulate agent delays (1-3s)                     │
│                                                       │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━    │
│  Workflow History                                     │
│  ┌─ 14:32 ● Completed ── "Blog post about AI"        │
│  ┌─ 14:15 ● Failed ───── "Quantum computing"         │
│  ┌─ 13:58 ● Cancelled ─ "Marketing strategy"         │
│                                                       │
│  [Load More...]                                       │
└───────────────────────────────────────────────────────┘
```

### 3.1 Workflow Input

- **Textarea:** `min-height: 120px`, `max-height: 240px`, `font-size: 14px`.
- **Border:** `1px solid var(--border)`, `border-radius: 8px`.
- **Focus:** `border-color: var(--primary)`, `box-shadow: 0 0 0 3px var(--primary-alpha-20)`.
- **Character Counter:** Right-aligned, orange at 800 chars, red at 1000 chars.

### 3.2 Action Buttons

- **Start Workflow:**
  - Primary button, full width.
  - Icon: Lightning bolt (⚡).
  - Disabled state: When input is empty or workflow is active.
  
- **Stop Workflow:**
  - Danger outline button, appears only when workflow is active.
  - Icon: Stop square (⏹).
  - Confirmation modal on click.

### 3.3 Simulate Toggle

- **Component:** Toggle switch (`width: 40px`, `height: 20px`).
- **Label:** "Simulate agent delays (1-3s)"
- **State:** Locked (disabled) while workflow is active.

### 3.4 History List

- **Items:** Compact rows with status dot, timestamp, truncated input.
- **Status Dots:** Green (completed), red (failed), gray (cancelled).
- **Interaction:** Click to load full workflow state into the graph view (read-only for past workflows).

---

## 4. Graph Canvas

### 4.1 Node Design

```
┌─ Agent Node ──────────────────────────┐
│  ┌────┐                               │
│  │ 🧠 │  Planner                      │
│  └────┘  ━━━━━━━━━━━━━━               │
│          ▓▓▓▓▓░░░░░░░  50%           │
│                                       │
│  Status: In Progress                  │
│  Latency: 1.2s | Tokens: 460          │
└───────────────────────────────────────┘
```

#### Node Specifications

- **Size:** `width: 220px`, `min-height: 120px`, `border-radius: 12px`.
- **Background:** `var(--surface-elevated)`.
- **Border:** `2px solid` (color changes by status).
- **Shadow:** `0 4px 6px -1px rgba(0,0,0,0.3)`.

#### Status Colors

| Status | Border Color | Background Tint | Icon |
|---|---|---|---|
| Pending | `#64748B` (gray) | `rgba(100,116,139,0.1)` | Gray circle |
| In Progress | `#3B82F6` (blue) | `rgba(59,130,246,0.1)` | Blue spinner |
| Completed | `#10B981` (green) | `rgba(16,185,129,0.1)` | Green checkmark |
| Failed | `#EF4444` (red) | `rgba(239,68,68,0.1)` | Red X |
| Cancelled | `#F59E0B` (amber) | `rgba(245,158,11,0.1)` | Amber stop |

#### Progress Bar

- **Visible only during `in_progress`:**
- **Track:** `height: 6px`, `border-radius: 3px`, `background: var(--border)`.
- **Fill:** Animated indeterminate shimmer for simulated delay; determinate fill for actual progress.
- **Label:** Percentage or "Processing..." text.

#### Agent Icons

| Agent | Icon | Color |
|---|---|---|
| Planner | 🧠 | Purple |
| Researcher | 🔍 | Blue |
| Writer | ✍️ | Indigo |
| Reviewer | ✅ | Teal |
| Formatter | 🎨 | Pink |

### 4.2 Edge Design

- **Default:** `stroke: var(--border)`, `stroke-width: 2px`, `stroke-dasharray: none`.
- **Active (dependency executing):** `stroke: var(--primary)`, `stroke-width: 3px`, animated `stroke-dashoffset` (flowing effect).
- **Completed:** `stroke: var(--success)`, `stroke-width: 2px`.
- **Failed:** `stroke: var(--error)`, `stroke-width: 2px`, `stroke-dasharray: 6,4`.

### 4.3 Graph Interactions

- **Zoom:** Mouse wheel or pinch gesture. Range: 0.5× to 2×.
- **Pan:** Click and drag on canvas background.
- **Node Click:** Opens detail panel.
- **Node Hover:** Tooltip showing task name and brief status.
- **Fit View:** Button to auto-fit all nodes within the viewport.

---

## 5. Detail Panel (Slide-In)

```
┌─ Detail Panel ────────────────────────┐
│  ✕ Close                              │
│                                       │
│  🧠 Planner                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                       │
│  Task: Generate task graph            │
│  Status: ✅ Completed                 │
│                                       │
│  ┌─ Input ─────────────────────────┐  │
│  │ Write a blog post about AI...   │  │
│  └─────────────────────────────────┘  │
│                                       │
│  ┌─ Output ────────────────────────┐  │
│  │ { "tasks": [...] }              │  │
│  └─────────────────────────────────┘  │
│                                       │
│  Prompt Tokens:    120                │
│  Completion Tokens: 340               │
│  Total Tokens:     460                │
│  Latency:          1.2s               │
│                                       │
│  [📋 Copy Output]  [🔁 Retry Task]    │
└───────────────────────────────────────┘
```

### 5.1 Panel Behavior

- **Width:** `400px` desktop, `100%` mobile.
- **Animation:** `translateX(100%) → translateX(0)`, `300ms`, `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Backdrop:** `opacity: 0 → 0.3`, `background: black`, clickable to close.

### 5.2 Content Sections

- **Header:** Agent icon + role name + close button.
- **Status Badge:** Large colored badge with status text.
- **Input/Output:** Monospace textareas, `max-height: 200px`, scrollable.
- **Metrics Grid:** 2-column grid for token and latency stats.
- **Actions:** Copy output, Retry task (visible only if failed or stopped).

---

## 6. Execution Timeline

```
┌─ Execution Timeline ──────────────────┐
│  14:32:01  🟢  Planner      Started   │
│  14:32:02  🟢  Planner      Completed │
│  14:32:04  🔵  Researcher   Started   │
│  14:32:07  🟢  Researcher   Completed │
│  14:32:07  🔵  Writer       Started   │
│  14:32:10  🟢  Writer       Completed │
│  14:32:10  🔵  Reviewer     Started   │
│  14:32:13  🟢  Reviewer     Completed │
│  14:32:13  🔵  Formatter    Started   │
│  14:32:15  🟢  Formatter    Completed │
│                                       │
│  Total Latency: 14.2s                 │
└───────────────────────────────────────┘
```

### 6.1 Specifications

- **Container:** Collapsible bottom panel, `height: 200px` default, expandable to `400px`.
- **Entry Format:** `[HH:MM:SS] [Icon] [Agent Role] [Event]`
- **Font:** Monospace, `13px`.
- **Auto-scroll:** Newest entry at bottom, auto-scroll enabled unless user scrolls up.
- **Empty State:** "Start a workflow to see the execution timeline."

---

## 7. Color Tokens (Agent System)

| Token | Dark Mode Value | Usage |
|---|---|---|
| `--surface` | `#0B1120` | Canvas background |
| `--surface-elevated` | `#151E32` | Panels, nodes |
| `--border` | `#2D3A4F` | Dividers, node borders (pending) |
| `--primary` | `#3B82F6` | Active edges, in-progress states |
| `--success` | `#10B981` | Completed states |
| `--warning` | `#F59E0B` | Cancelled states |
| `--error` | `#EF4444` | Failed states |
| `--text-primary` | `#F1F5F9` | Primary text |
| `--text-muted` | `#94A3B8` | Labels, timestamps |
| `--agent-planner` | `#A855F7` | Planner accents |
| `--agent-researcher` | `#3B82F6` | Researcher accents |
| `--agent-writer` | `#6366F1` | Writer accents |
| `--agent-reviewer` | `#14B8A6` | Reviewer accents |
| `--agent-formatter` | `#EC4899` | Formatter accents |

---

## 8. Typography

| Element | Font | Size | Weight | Line Height |
|---|---|---|---|---|
| Header Title | System UI | 16px | 600 | 1.4 |
| Node Title | System UI | 14px | 600 | 1.3 |
| Node Status | System UI | 12px | 500 | 1.3 |
| Node Metrics | Monospace | 11px | 400 | 1.3 |
| Timeline | Monospace | 13px | 400 | 1.5 |
| Detail Panel Title | System UI | 18px | 700 | 1.3 |
| Input Textarea | System UI | 14px | 400 | 1.5 |
| Buttons | System UI | 14px | 600 | 1 |
| Empty State | System UI | 14px | 400 | 1.5 |
