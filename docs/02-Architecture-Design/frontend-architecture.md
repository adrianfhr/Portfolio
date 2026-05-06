# Frontend Architecture

> **Document:** Frontend Architecture  
> **Project:** Interactive AI Engineering Portfolio & Sandbox  
> **Version:** 1.0  
> **Status:** Draft  

---

## 1. Executive Summary

The frontend of the Interactive AI Engineering Portfolio & Sandbox is a **production-grade Astro application** built around island architecture. It is designed to demonstrate engineering maturity in modern frontend patterns while delivering a responsive, accessible, and visually compelling user experience. The frontend serves as both the user-facing interface for AI interactions and a lightweight API gateway proxy to the FastAPI backend.

This document details the technology choices, folder organization, state management strategy, component architecture, routing paradigms, rendering optimizations, and performance constraints that govern frontend development.

---

## 2. Technology Stack

### 2.1 Core Framework & Runtime

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| Framework | Astro | 4.x | SSR/SSG, islands, API endpoints, streaming |
| UI Library | React | 18.x | Component model, concurrent features, Suspense boundaries |
| Language | TypeScript | 5.x | Static type safety, interface contracts, IDE autocomplete |
| Runtime | Node.js | 20.x LTS | Server-side rendering, build toolchain |

### 2.2 Styling & Design System

| Layer | Technology | Purpose |
|-------|-----------|---------|
| CSS Framework | Tailwind CSS | Utility-first styling with design token integration |
| Component Primitives | shadcn/ui + Radix UI | Accessible, unstyled headless components (dialogs, dropdowns, tabs) |
| Icons | Lucide React | Consistent, lightweight SVG iconography |
| Fonts | Inter (sans-serif), JetBrains Mono (monospace) | Readability at small sizes, developer-aesthetic monospace for code |
| Animation | Framer Motion | Declarative animations, layout transitions, gesture support |

### 2.3 State & Data Management

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Server State | TanStack Query (React Query) | Data fetching, caching, background refetching, optimistic updates |
| Global UI State | Zustand | Lightweight global store for auth, theme, metrics, real-time buffers |
| Form State | React Hook Form | Performant form handling with minimal re-renders |
| Validation | Zod | Schema validation shared between frontend and backend (Pydantic parity) |

### 2.4 Real-Time & Streaming

| Layer | Technology | Purpose |
|-------|-----------|---------|
| WebSocket Client | Socket.IO Client | Bidirectional real-time communication (live logs, agent status) |
| SSE Client | Native EventSource | Unidirectional server push (chat token streaming, metrics updates) |
| Fallback Polling | TanStack Query `refetchInterval` | Graceful degradation when WebSocket/SSE are blocked |

### 2.5 Visualization & Content Rendering

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Charts | Recharts | Composable React charting for metrics dashboard |
| Markdown | ReactMarkdown + remark/rehype plugins | Safe rendering of AI-generated markdown content |
| Syntax Highlighting | PrismJS (via react-syntax-highlighter) | Code block highlighting in chat messages |
| Sanitization | DOMPurify | XSS prevention for user-generated and AI-generated HTML |

### 2.6 Development Tooling

| Tool | Purpose |
|------|---------|
| ESLint + `@next/eslint-plugin` | Code quality, React Hooks rules, accessibility checks |
| Prettier | Consistent code formatting |
| TypeScript Strict Mode | Maximum type safety (`strict: true` in `tsconfig.json`) |
| Vitest | Unit testing for utilities, hooks, and pure components |
| Playwright | End-to-end testing for critical user journeys |

---

## 3. Folder Structure

The codebase follows the **Astro file-based routing convention** with domain-driven module organization.

```
apps/web/
├── src/pages/                    # Astro file-based routes and endpoints
│   ├── (landing)/                # Route group: landing pages (no shared layout constraint)
│   │   ├── page.tsx              # Hero section / portfolio homepage
│   │   ├── layout.tsx            # Landing-specific layout (minimal nav, full-bleed sections)
│   │   └── sections/             # Landing page section components
│   │       ├── HeroSection.tsx
│   │       ├── ArchitectureShowcase.tsx
│   │       └── LiveMetricsPreview.tsx
│   ├── chat/                     # Chatbot interface (RAG)
│   │   ├── page.tsx              # Chat main view
│   │   ├── layout.tsx            # Chat layout (sidebar + main area)
│   │   └── loading.tsx           # Suspense fallback for chat history
│   ├── vision/                   # Computer vision playground
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── agents/                   # Multi-agent workflow visualization
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── metrics/                  # Monitoring dashboard
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── logs/                     # Live logs terminal
│   │   ├── page.tsx
│   │   └── layout.tsx
│   ├── api-docs/                 # Interactive API Explorer (Swagger UI wrapper)
│   │   └── page.tsx
│   ├── api/                      # Astro endpoints (proxy to FastAPI)
│   │   └── [[...path]]/
│   │       └── route.ts          # Catch-all proxy: /api/* → FastAPI
│   ├── layout.tsx                # Root layout (providers, fonts, metadata)
│   ├── error.tsx                 # Root error boundary
│   ├── not-found.tsx             # 404 page
│   └── globals.css               # Tailwind directives + global styles
│
├── modules/                      # Domain-specific business logic & UI
│   ├── auth/
│   │   ├── components/           # LoginButton, GuestBadge, LogoutDropdown
│   │   ├── hooks/                # useAuth, useGuestSession
│   │   ├── stores/               # authStore.ts (Zustand)
│   │   ├── types/                # User, Guest, JWTPayload
│   │   └── services/             # authService.ts (API calls)
│   ├── chatbot/
│   │   ├── components/           # ChatWindow, MessageBubble, SourceCitation
│   │   ├── hooks/                # useChatStream, useChatHistory
│   │   ├── stores/               # chatStore.ts
│   │   ├── types/                # Message, ChatSession, SourceChunk
│   │   └── services/             # chatService.ts
│   ├── vision/
│   │   ├── components/           # ImageUploader, FaceMatchResult, DetectionCanvas
│   │   ├── hooks/                # useFaceDetection, useImageUpload
│   │   ├── stores/               # visionStore.ts
│   │   └── services/             # visionService.ts
│   ├── agents/
│   │   ├── components/           # AgentGraph, NodeDetailPanel, ExecutionTimeline
│   │   ├── hooks/                # useAgentExecution, useAgentGraph
│   │   ├── stores/               # agentStore.ts
│   │   └── services/             # agentService.ts
│   ├── metrics/
│   │   ├── components/           # LatencyChart, TokenCostGauge, RequestCounter
│   │   ├── hooks/                # useMetricsStream
│   │   ├── stores/               # metricsStore.ts
│   │   └── services/             # metricsService.ts
│   └── logs/
│       ├── components/           # LogTerminal, LogFilterBar, SeverityBadge
│       ├── hooks/                # useLogStream
│       ├── stores/               # logStore.ts
│       └── services/             # logService.ts
│
├── components/                   # Shared, reusable UI components
│   ├── ui/                       # Base primitives (Button, Input, Card, Badge)
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── shared/                   # Cross-module composites (Navbar, Footer, Sidebar, TerminalShell)
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   ├── TerminalShell.tsx
│   │   └── ThemeToggle.tsx
│   └── providers/                # React context providers
│       ├── QueryProvider.tsx     # TanStack Query client
│       ├── ThemeProvider.tsx     # Dark/light mode
│       └── WebSocketProvider.tsx # Socket.IO connection manager
│
├── hooks/                        # Global custom hooks
│   ├── useApi.ts                 # Typed fetch wrapper with error handling
│   ├── useSSE.ts                 # Generic SSE connection hook
│   ├── useWebSocket.ts           # Generic WebSocket connection hook
│   └── useDebounce.ts            # Input debouncing
│
├── stores/                       # Global Zustand stores (cross-cutting concerns)
│   ├── uiStore.ts                # Sidebar open/close, modal stack, toast notifications
│   └── connectionStore.ts        # Online/offline status, connection quality
│
├── services/                     # API client layer
│   ├── apiClient.ts              # Axios/fetch instance with interceptors
│   ├── sseClient.ts              # SSE connection factory
│   └── wsClient.ts               # Socket.IO client factory
│
├── lib/                          # Utilities, constants, types
│   ├── utils.ts                  # cn() helper (clsx + tailwind-merge)
│   ├── constants.ts              # API endpoints, rate limit tiers, feature flags
│   ├── types/                    # Shared TypeScript interfaces
│   └── validators/               # Zod schemas mirrored from backend Pydantic
│
├── public/                       # Static assets
│   └── assets/
│       ├── images/
│       ├── fonts/
│       └── icons/
│
├── astro.config.mjs              # Astro configuration (adapter, integrations, output)
├── tailwind.config.ts            # Tailwind theme extension (colors, spacing, animations)
├── tsconfig.json                 # TypeScript compiler options
└── package.json
```

---

## 4. State Management Strategy

State in this application is categorized into four distinct tiers, each with a dedicated management strategy to optimize performance, maintainability, and developer experience.

### 4.1 Server State

**Definition:** Data that lives on the server and is fetched via API calls (chat histories, user profiles, metrics snapshots, API documentation).

**Manager:** TanStack Query (React Query)

**Strategy:**
- All server data is fetched through React Query's `useQuery` and `useMutation` hooks.
- Query keys are structured hierarchically: `['chat', 'history', sessionId]`, `['metrics', 'latency']`.
- Stale-while-revalidate caching: data is served from cache immediately while a background refetch updates stale data.
- Optimistic updates for mutations (sending a chat message immediately updates the local message list before server confirmation).
- Polling intervals for dashboard metrics (`refetchInterval: 3000` as fallback when SSE is unavailable).

```typescript
// Example: Chat history query
const { data: messages, isLoading } = useQuery({
  queryKey: ['chat', 'history', sessionId],
  queryFn: () => chatService.getHistory(sessionId),
  staleTime: 1000 * 60 * 5, // 5 minutes
  enabled: !!sessionId,
});
```

### 4.2 Global UI State

**Definition:** Client-only state that must be shared across multiple components and route segments (authentication status, theme preference, sidebar visibility, real-time metrics buffer).

**Manager:** Zustand

**Strategy:**
- One store per domain (`authStore`, `metricsStore`, `uiStore`).
- Stores are plain TypeScript objects with actions; no reducers or dispatchers needed.
- Persistence middleware hydrates `authStore` from `localStorage` on app initialization (guest session ID).
- Subscribe patterns enable components to select only the state slices they need, preventing unnecessary re-renders.

```typescript
// Example: Metrics store with real-time buffer
interface MetricsState {
  latencyHistory: Array<{ timestamp: number; value: number }>;
  tokenCost: number;
  appendLatency: (value: number) => void;
  setTokenCost: (cost: number) => void;
}

const useMetricsStore = create<MetricsState>((set) => ({
  latencyHistory: [],
  tokenCost: 0,
  appendLatency: (value) =>
    set((state) => ({
      latencyHistory: [...state.latencyHistory.slice(-99), { timestamp: Date.now(), value }],
    })),
  setTokenCost: (cost) => set({ tokenCost: cost }),
}));
```

### 4.3 Local Component State

**Definition:** State that is isolated to a single component or a tightly coupled parent-child tree (form inputs, dropdown open state, image crop coordinates).

**Manager:** React `useState` / `useReducer`

**Strategy:**
- Favor `useState` for simple boolean/toggle states.
- Use `useReducer` for complex form state with multiple interdependent fields.
- Lift state up only when two sibling components need to share it; otherwise keep it local.
- Use `React.memo` for expensive presentational components that receive stable props.

### 4.4 Real-Time State

**Definition:** Ephemeral data that arrives via streaming transports and must be rendered immediately (chat tokens, log lines, agent node updates).

**Manager:** Combination of transport hooks + Zustand buffers

**Strategy:**
- **SSE for chat streaming:** A `useSSE` hook opens an `EventSource` connection, appends incoming tokens to a `chatStore` message buffer, and closes the connection on completion or error.
- **WebSocket for logs:** A single shared WebSocket connection (managed by `WebSocketProvider`) pushes log lines to a circular buffer in `logStore`. The UI subscribes to this buffer and renders with virtual scrolling.
- **Reconnection logic:** Both SSE and WebSocket hooks implement exponential backoff reconnection with a maximum retry ceiling. After 5 failed attempts, the UI falls back to polling.

```typescript
// Real-time state flow
EventSource/WebSocket
    ↓
Transport Hook (useSSE / useWebSocket)
    ↓
Zustand Store (append to buffer)
    ↓
React Component (subscribed to buffer slice)
    ↓
Virtual DOM Diff → Render
```

---

## 5. Component Architecture

### 5.1 Component Taxonomy

Components are organized into four tiers based on scope and reusability:

| Tier | Location | Examples | Responsibility |
|------|----------|----------|---------------|
| **Primitives** | `components/ui/` | Button, Input, Card, Badge | Unstyled or minimally styled base components built on Radix UI primitives. Highly reusable, accessibility-compliant. |
| **Shared Composites** | `components/shared/` | Navbar, Sidebar, TerminalShell | Cross-module layout and UI shell components. Aware of routing and global state. |
| **Domain Components** | `modules/*/components/` | ChatWindow, AgentGraph, LogTerminal | Feature-specific components with deep business logic integration. Co-located with their module. |
| **Page Sections** | `app/(landing)/sections/` | HeroSection, ArchitectureShowcase | One-off sections for marketing/landing pages. Not reusable across modules. |

### 5.2 Composition Patterns

- **Compound Components:** Complex UI elements (e.g., `ChatWindow` with `MessageList`, `MessageInput`, `SourcePanel`) are composed as compound components to avoid prop drilling.
- **Render Props (sparingly):** Used for highly dynamic list items where the parent controls rendering logic.
- **Higher-Order Components (avoided):** Replaced by custom hooks for behavior sharing to preserve type inference and avoid wrapper hell.
- **Server Components by Default:** All non-interactive data-display components are Server Components to reduce client bundle size. Interactivity is added via Client Component islands.

### 5.3 Server vs. Client Component Boundaries

| Server Component | Client Component |
|-----------------|------------------|
| Landing page sections | Chat input form |
| Metrics charts (initial data) | Real-time metrics ticker |
| API docs (static fetch) | Log terminal (WebSocket) |
| Navigation shell | Theme toggle |
| Blog / documentation content | Image upload with drag-and-drop |

**Rule of thumb:** If a component needs browser APIs (`window`, `document`), event handlers (`onClick`), or hooks (`useState`, `useEffect`), it must be a Client Component marked with `"use client"`.

---

## 6. Routing Strategy

### 6.1 File-Based Routing Structure

Astro file-based routing is used exclusively. The project does not use a separate SPA router.

| Route Segment | Feature | Rendering Mode |
|--------------|---------|----------------|
| `/` | Landing page (Hero) | Static (SSG) |
| `/chat` | RAG chatbot interface | Server Component shell + Client Component islands |
| `/vision` | Face recognition playground | Server Component shell + Client Component islands |
| `/agents` | Multi-agent workflow | Server Component shell + Client Component islands |
| `/metrics` | Monitoring dashboard | Server Component shell + Client Component islands |
| `/logs` | Live logs terminal | Client Component (WebSocket required) |
| `/api-docs` | Interactive API Explorer | Static iframe or static fetch of OpenAPI JSON |
| `/api/*` | Reverse proxy to FastAPI | API Route Handler |

### 6.2 Route Groups

- `(landing)/` is a **route group** that removes the `/landing` prefix from URLs while allowing a dedicated layout for marketing pages.
- `(app)/` could be introduced later to wrap authenticated application pages with a persistent sidebar and navbar layout.

### 6.3 Parallel Routes & Intercepting Routes (Future)

- **Parallel routes** (`@sidebar`, `@main`) may be used for the admin panel to enable complex dashboard layouts with independent loading states.
- **Intercepting routes** (`(.)vision/[id]`) may be used to open detail modals over the current page without losing scroll position.

---

## 7. Rendering Strategy

### 7.1 Rendering Mode Selection

| Page / Component | Strategy | Justification |
|-----------------|-----------|---------------|
| Landing page (`/`) | Static Site Generation (SSG) | Content rarely changes; maximum performance via CDN caching. |
| Chat page (`/chat`) | Server-Side Rendering (SSR) shell + CSR islands | SEO is irrelevant; shell renders instantly, chat UI hydrates interactively. |
| Metrics dashboard | SSR initial data + SSE hydration | Initial metrics snapshot from server; real-time updates via SSE. |
| API documentation | Static generation at build time | OpenAPI spec is fetched once at build and rendered as static HTML. |
| Log terminal | Client-Side Rendering (CSR) | Requires persistent WebSocket connection; no server-rendered content. |

### 7.2 Streaming & Suspense

- React 18 **Streaming SSR** is leveraged for the chat page: the shell and message history stream to the browser while the input form hydrates.
- **Suspense boundaries** wrap heavy components (`Recharts` charts, `AgentGraph` visualizations) to prevent them from blocking the initial paint.
- `loading.tsx` files in route segments provide instant skeleton UI while data fetching occurs.

### 7.3 Image Optimization

- Astro-friendly image handling is used for all images with automatic WebP/AVIF conversion, responsive sizing, and blur placeholder generation.
- Uploaded user images in the vision module use `unoptimized` prop only when displaying raw uploads before processing.

---

## 8. Build & Bundle Strategy

### 8.1 Build Output

- `output: 'standalone'` in `next.config.js` produces a self-contained deployment artifact with minimal Node.js dependencies.
- The standalone output is containerized via Docker for both local development and production deployment.

### 8.2 Bundle Splitting

| Split Type | Strategy |
|-----------|----------|
| **Route-based** | Automatic per-page code splitting via Astro’s file-based routes and islands. |
| **Vendor chunking** | Large third-party libraries (Recharts, Framer Motion, Socket.IO client) are split into separate chunks to maximize cache longevity. |
| **Dynamic imports** | Heavy visualization components (`AgentGraph`, charting libraries) are loaded with `next/dynamic` and `ssr: false` where appropriate. |

### 8.3 Tree Shaking

- All libraries are selected with ES module support to enable effective tree shaking.
- `lucide-react` imports use named imports (`import { Bot } from 'lucide-react'`) to import only required icons.
- `date-fns` imports use submodules (`import { format } from 'date-fns/format'`) to avoid pulling in the entire library.

---

## 9. Performance Budget

A performance budget is enforced to ensure the frontend remains fast on mid-tier mobile devices and slow connections — critical for a portfolio that demonstrates engineering competence.

| Metric | Budget | Measurement |
|--------|--------|-------------|
| **First Contentful Paint (FCP)** | < 1.2s | Lighthouse |
| **Largest Contentful Paint (LCP)** | < 2.5s | Lighthouse |
| **Time to Interactive (TTI)** | < 3.5s | Lighthouse |
| **Cumulative Layout Shift (CLS)** | < 0.1 | Lighthouse |
| **Total Blocking Time (TBT)** | < 200ms | Lighthouse |
| **First JavaScript Bundle** | < 150kB (gzipped) | `next-bundle-analyzer` |
| **Chat Page Bundle** | < 250kB (gzipped) | `next-bundle-analyzer` |
| **API Route Handler Latency** | < 50ms (p99) | Server logs |

### 9.1 Optimization Techniques

| Technique | Application |
|-----------|-------------|
| Font subsetting | Only Latin character subset of Inter and JetBrains Mono is loaded. |
| Prefetching | `Link` components use `prefetch={true}` for anticipated navigation targets. |
| Debouncing | Chat input and log filters debounce at 150ms to reduce re-render frequency. |
| Virtual scrolling | Log terminal and chat history use virtualized lists (`react-window`) for 10,000+ row performance. |
| Memoization | `React.memo` on message bubbles; `useMemo` for computed chart data arrays. |
| Service Worker (future) | PWA capabilities with offline page caching for documentation and landing content. |

---

## 10. Error Handling & Resilience

### 10.1 Error Boundaries

- **Root error boundary** (`app/error.tsx`) catches unhandled errors and displays a fallback UI with a link to return home.
- **Feature error boundaries** wrap each major module (`chat/error.tsx`, `vision/error.tsx`) to prevent total application crashes.
- **API error handling:** The `apiClient` interceptor normalizes FastAPI error responses into a consistent `{ message, code, details }` shape.

### 10.2 Network Resilience

- TanStack Query automatically retries failed queries with exponential backoff (3 attempts).
- WebSocket and SSE connections implement heartbeat/ping mechanisms and automatic reconnection.
- A global "connection status" indicator in the navbar informs users when real-time data is stale due to connectivity issues.

---

## 11. Accessibility (a11y)

- All UI primitives from Radix UI are WCAG 2.1 AA compliant out of the box.
- Color contrast ratios meet WCAG AA standards (minimum 4.5:1 for normal text).
- Keyboard navigation is supported for all interactive elements (chat input, log filters, dashboard controls).
- ARIA live regions announce new chat messages and log entries to screen readers.
- Focus trapping is implemented in modals and dropdowns.
- Reduced motion preferences (`prefers-reduced-motion`) disable Framer Motion animations.

---

*Document maintained by the Frontend Engineering Team. Last updated: 2026-05-06.*
