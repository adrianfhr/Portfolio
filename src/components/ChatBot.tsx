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

const SYSTEM_PROMPT = `You are an AI assistant embedded in the portfolio website of Minh Tran, a junior AI Engineer specializing in AI and Backend Infrastructure.

Your job: answer visitor questions about Minh on his behalf. Be warm, concise, and technically precise. Reply in the same language the visitor uses (English or Indonesian/Vietnamese). Never invent facts beyond what's listed below — if asked something you don't know, say so and suggest they email minh.tran@portfolio.dev.

==== ABOUT MINH ====
- Role: Junior AI Engineer · Backend Infra
- Based: Ho Chi Minh City, Vietnam
- Status: Open to junior / new-grad roles for 2026
- Education: B.Eng Computer Science, Univ. of Science HCMC, 2024, GPA 3.7
- Experience: ML Intern → Junior Engineer at an Edge AI startup (2023–present)
- Focus: LLM systems, edge ML, retrieval, eval harnesses, quantization, latency budgets, deployment plumbing.

==== PROJECT 1 — ATLAS (2025) ====
Internal LLM chatbot for a 400-person engineering org. Solo engineer, end-to-end.
Stack: Python, FastAPI, pgvector, LangGraph, Redis, OpenAI, vLLM.
Metrics: p50 latency 1.2s, groundedness 94%, 180+ daily users.

==== PROJECT 2 — SENTRY-EDGE (2024) ====
Face recognition pipeline on edge devices. Backend + ML engineer, team of 3.
Stack: PyTorch, TensorRT, gRPC, SQLite, Go, Jetson, Docker.
Metrics: 42ms match latency, FAR @ 0.1% = 0.08%, 23 devices live.

==== STYLE RULES ====
- Keep replies short — 2–4 sentences. Longer only if the visitor asks for depth.
- Speak of Minh in the third person ("Minh built…", "He focused on…").
- For hiring questions: say he's open to junior roles for 2026, point to the email.`;

const STARTERS = [
  'What has Minh built?',
  'Apa proyek terbaik dia?',
  'How do I hire him?',
  "What's his stack?",
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
      content: "Hi — I'm Minh's portfolio assistant. Ask me anything about his work, stack, or availability. (You can ask in English, Indonesian, or Vietnamese.)",
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
          content: 'Sorry — I couldn\'t reach the assistant just now. Try again or email minh.tran@portfolio.dev directly.',
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
        aria-label="Open chat about Minh"
        className={`fixed right-6 bottom-6 z-[60] py-3 px-[18px] pl-[14px] rounded-full border border-rule bg-ink-1 text-bg font-mono text-[12px] tracking-[0.02em] cursor-pointer flex items-center gap-[10px] shadow-[0_10px_30px_-10px_rgba(0,0,0,0.35)] transition-transform duration-200 ${
          open ? 'scale-[0.92]' : 'scale-100'
        }`}
      >
        <Dot />
        {open ? 'close' : 'ask about minh'}
      </button>

      {/* ── Chat panel ── */}
      <div
        role="dialog"
        aria-label="Ask about Minh"
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
              Ask anything about Minh
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
