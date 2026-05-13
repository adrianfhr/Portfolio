import { useState, useEffect, useRef } from 'react';

/* ─────────────────────────────────────────────────────────────────────────
 * IMPORTANT: This component calls window.claude.complete — the Anthropic
 * in-browser AI runtime used in Claude Code prototypes. In production, replace
 * that call with a fetch to your own server endpoint (e.g. /api/chat) that
 * proxies to the Anthropic Messages API server-side with your secret API key.
 * See: https://docs.anthropic.com/en/api/messages
 * ──────────────────────────────────────────────────────────────────────── */

declare global {
  interface Window {
    claude?: {
      complete: (opts: { messages: { role: string; content: string }[] }) => Promise<string>;
    };
  }
}

const SYSTEM_PROMPT = `You are an AI assistant embedded in the portfolio website of Adrian Fahri Affandi, a Software Engineer specializing in AI Integration and Backend Infrastructure.

Your job: answer visitor questions about Adrian on his behalf. Be warm, concise, and technically precise. Reply in the same language the visitor uses (English or Indonesian). Never invent facts beyond what's listed below — if asked something you don't know, say so and suggest they email adrianfhrr@gmail.com.

==== ABOUT ADRIAN ====
- Full name: Adrian Fahri Affandi
- Role: AI Engineer · Backend Infrastructure
- Based: Bekasi, West Java, Indonesia
- Current job: AI Engineer at Synapsis (October 2025 – present, full-time)
- Education: B.Eng Information System & Technology, Institut Teknologi Bandung (ITB), graduated 2025, GPA 3.44/4.00
- Also completed: Bangkit Academy – Cloud Computing track, Feb–Jul 2024, score 92.90/100, graduated with Distinction (Top 10% of 4,650 students out of 55,000 applicants)
- Focus: Edge AI systems (Raspberry Pi + Hailo), RAG/LLM pipelines, microservices backend (Go + Python), computer vision deployment, WebRTC streaming
- LinkedIn: linkedin.com/in/adrianfhr

==== EXPERIENCE 1 — AI ENGINEER @ SYNAPSIS (Oct 2025 – present) ====
Architected and deployed an Edge-to-Cloud Multi-Face Recognition system using Raspberry Pi 5 and Hailo AI accelerators for enterprise attendance (750+ employees).
Increased video processing throughput 150% (8 FPS → 20 FPS) by decoupling AI inference from business logic via multi-threading and thread-safe queues.
Built a production-grade multi-agent LLM ecosystem for internal support, with a centralized master agent for dynamic query routing.
Developed an advanced RAG pipeline with Perplexity-style inline citations, boosting document traceability.

==== EXPERIENCE 2 — BACKEND DEVELOPER @ SYNAPSIS (Dec 2024 – Aug 2025) ====
Developed REST/gRPC APIs in Go + PostgreSQL following Clean Architecture and Domain-Driven Design (DDD).
Resolved N+1 query issues and added indexes to improve slow endpoints.
Achieved 80%+ test coverage on assigned modules. Worked in Agile environment.

==== EXPERIENCE 3 — BACK END DEVELOPER @ TELKOM INDONESIA (Jun 2024 – Aug 2024) ====
Internship at Indonesia's national telco. Built endpoints with NestJS, Go, and PostgreSQL.
Used Docker for containerization. Integrated APIs with partner systems.

==== PROJECT 1 — SEISMIC RISK ASSESSMENT (Thesis, Jan–Aug 2025) ====
Microservices backend with FastAPI + PostgreSQL/PostGIS for geospatial data management.
Trained and deployed YOLOv11-based computer vision models for building typology classification.
Built custom MLOps workflow with model versioning and rollback. Integrated annotation platform that cut manual labeling effort by 40%+.
AI predictions fed into seismic risk simulation covering 10,000+ buildings.
Stack: Python, FastAPI, PostgreSQL, PostGIS, YOLOv11, PyTorch, Docker.

==== PROJECT 2 — PATROL LIVE TRACKER (Jul–Sep 2025) ====
Real-time patrol tracking system with CCTV and bodycam streaming using Go, MySQL, and WebRTC stack (LiveKit, Coturn).
Fault-tolerant architecture for continuous availability.
Stack: Go, MySQL, WebRTC, LiveKit, Coturn, Docker.

==== PROJECT 3 — CLUSTER GATE MANAGEMENT SYSTEM (Jul–Sep 2024) ====
IoT-enabled gate access system with C#, Blazor, SQL Server. Daily usage by 1,500+ residents with real-time event logging.

==== ACHIEVEMENTS ====
- Gold Medal, Category D1, Singapore Amazing Flying Machine Competition (SAFMC) 2024 — contributed as Firmware Engineer to a 19-member team
- Top 5 Finalist, Dig In Business IT Case Competition, Bina Nusantara University (Feb 2023)

==== TECH STACK ====
Languages: Go, Python, TypeScript, Java, SQL, C++, PHP
AI/ML: PyTorch, YOLOv11, LangGraph, RAG/LLM, Hailo AI, OpenCV
Backend: FastAPI, NestJS, gRPC, PostgreSQL, MySQL, Redis
Infra: Docker, Kubernetes, CI/CD, Raspberry Pi, WebRTC (LiveKit)

==== STYLE RULES ====
- Keep replies short — 2–4 sentences. Longer only if the visitor asks for depth.
- Speak of Adrian in the third person ("Adrian built…", "He focused on…").
- For hiring/contact questions: point to adrianfhrr@gmail.com or linkedin.com/in/adrianfhr.`;

const STARTERS = [
  'What has Adrian built?',
  'Apa pengalaman kerjanya?',
  'How do I contact him?',
  "What's his tech stack?",
];

interface Message {
  role:    'user' | 'assistant';
  content: string;
}

/* Inline Dot — mirrors Dot.astro for React islands */
function Dot({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <span
      className="dot-indicator inline-block w-[7px] h-[7px] rounded-full"
      style={{ '--dot-color': color } as React.CSSProperties}
    />
  );
}

function Bubble({ role, children }: { role: Message['role']; children: React.ReactNode }) {
  const isUser = role === 'user';
  return (
    <div
      className={[
        'max-w-[86%] px-3 py-[9px] text-[14px] leading-[1.5] tracking-[-0.005em] whitespace-pre-wrap break-words [text-wrap:pretty]',
        isUser
          ? 'self-end bg-ink-1 text-bg rounded-xl rounded-br-[4px]'
          : 'self-start bg-panel text-ink-1 border border-rule rounded-xl rounded-bl-[4px]',
      ].join(' ')}
    >
      {children}
    </div>
  );
}

function Typing() {
  return (
    <span className="inline-flex gap-1 items-center p-[2px]">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-[6px] h-[6px] rounded-full bg-ink-3"
          style={{ animation: `typing-bounce 1.1s ${i * 0.15}s infinite ease-in-out` }}
        />
      ))}
    </span>
  );
}

export default function ChatBot() {
  const [open,     setOpen]     = useState(false);
  const [input,    setInput]    = useState('');
  const [busy,     setBusy]     = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role:    'assistant',
      content: "Hi — I'm Adrian's portfolio assistant. Ask me anything about his work, stack, or availability. (You can ask in English or Indonesian.)",
    },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef  = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages, busy, open]);

  useEffect(() => {
    if (open && inputRef.current) setTimeout(() => inputRef.current?.focus(), 200);
  }, [open]);

  const send = async (text?: string) => {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput('');
    const next: Message[] = [...messages, { role: 'user', content: q }];
    setMessages(next);
    setBusy(true);
    try {
      const apiMessages = next.map((m) => ({ role: m.role, content: m.content }));
      const reply = await window.claude!.complete({
        messages: [
          { role: 'user',      content: `${SYSTEM_PROMPT}\n\n— Begin conversation —` },
          { role: 'assistant', content: "Understood. I'll answer questions about Minh." },
          ...apiMessages,
        ],
      });
      setMessages((m) => [...m, { role: 'assistant', content: reply || '(no response)' }]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role:    'assistant',
          content: 'Sorry — I couldn\'t reach the assistant just now. Try again or email adrianfhrr@gmail.com directly.',
        },
      ]);
    } finally {
      setBusy(false);
    }
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); }
  };

  return (
    <>
      {/* ── Launcher button ── */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open chat about Adrian"
        className={`fixed right-6 bottom-6 z-[60] py-3 px-[18px] pl-[14px] rounded-full border border-rule bg-ink-1 text-bg font-mono text-[12px] tracking-[0.02em] cursor-pointer flex items-center gap-[10px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
          open ? 'scale-[0.92]' : 'scale-100'
        }`}
      >
        <Dot />
        {open ? 'close' : 'ask about adrian'}
      </button>

      {/* ── Chat panel ── */}
      <div
        role="dialog"
        aria-label="Ask about Adrian"
        className={`fixed right-6 bottom-20 z-[60] w-[380px] max-w-[calc(100vw-48px)] h-[520px] max-h-[calc(100vh-120px)] bg-bg border border-rule rounded-xl shadow-[0_24px_60px_-20px_rgba(0,0,0,0.25)] flex flex-col overflow-hidden origin-bottom-right transition-[transform,opacity] duration-[220ms] ease-[ease] ${
          open
            ? 'scale-100 translate-y-0 opacity-100 pointer-events-auto'
            : 'scale-[0.92] translate-y-3 opacity-0 pointer-events-none'
        }`}
      >
        {/* Header */}
        <div className="px-4 py-[14px] border-b border-rule bg-panel flex items-center justify-between">
          <div>
            <div className="font-mono text-[10px] tracking-[0.1em] uppercase text-ink-3">
              Portfolio assistant
            </div>
            <div className="text-[14px] text-ink-1 mt-[2px] tracking-[-0.005em]">
              Ask anything about Adrian
            </div>
          </div>
          <button
            onClick={() => setOpen(false)}
            aria-label="Close chat"
            className="bg-transparent border border-rule rounded-full w-[26px] h-[26px] text-[12px] text-ink-2 cursor-pointer leading-none"
          >
            ✕
          </button>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 pt-4 pb-2 flex flex-col gap-[10px]"
        >
          {messages.map((m, i) => (
            <Bubble key={i} role={m.role}>{m.content}</Bubble>
          ))}
          {busy && <Bubble role="assistant"><Typing /></Bubble>}
        </div>

        {/* Starter prompts */}
        {messages.length <= 1 && !busy && (
          <div className="px-3 pb-[10px] flex flex-wrap gap-[6px]">
            {STARTERS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="font-mono text-[11px] py-[5px] px-[10px] rounded-full border border-rule bg-panel text-ink-2 cursor-pointer"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input row */}
        <div className="p-3 border-t border-rule bg-panel flex gap-2 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            placeholder="Type your question…"
            rows={1}
            className="flex-1 resize-none border border-rule rounded-lg px-[11px] py-[9px] font-display text-[14px] text-ink-1 bg-bg outline-none max-h-[120px] leading-[1.4]"
          />
          <button
            onClick={() => send()}
            disabled={busy || !input.trim()}
            className={`py-[9px] px-[14px] rounded-lg border-none font-mono text-[12px] text-bg transition-colors duration-150 ${
              busy || !input.trim() ? 'bg-rule cursor-not-allowed' : 'bg-ink-1 cursor-pointer'
            }`}
          >
            send
          </button>
        </div>

        {/* Footer hint */}
        <div className="px-[14px] pb-[10px] pt-[6px] bg-panel font-mono text-[10px] text-ink-3 tracking-[0.04em] text-center">
          powered by claude · answers may be imperfect
        </div>
      </div>
    </>
  );
}
