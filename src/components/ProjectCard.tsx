import { useState } from 'react';
import type { Project } from '../data/portfolio';

interface Props {
  p:   Project;
  idx: number;
}

/* Inline primitives — mirrors .astro equivalents for use inside React islands. */
function MonoLabel({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={`font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3 ${className}`}>
      {children}
    </span>
  );
}

export default function ProjectCard({ p, idx }: Props) {
  const [open, setOpen] = useState(idx === 0);

  return (
    <article
      className="border-b border-rule py-6 sm:py-9 grid grid-cols-1 sm:grid-cols-[88px_minmax(0,1fr)_320px] gap-4 sm:gap-10 items-start cursor-pointer"
      onClick={() => setOpen((o) => !o)}
    >
      {/* ── Index column ── */}
      <div className="flex items-baseline gap-2 sm:block">
        <MonoLabel>{p.id}</MonoLabel>
        <div className="sm:mt-[6px] font-mono text-[12px] text-ink-3">{p.year}</div>
      </div>

      {/* ── Content column ── */}
      <div>
        <div className="flex items-baseline gap-[14px] flex-wrap">
          <h3 className="font-display text-[26px] sm:text-[34px] tracking-[-0.02em] font-medium m-0 text-ink-1">
            {p.name}
          </h3>
          <span className="font-serif italic text-[18px] sm:text-[22px] text-ink-2">— {p.tagline}</span>
        </div>

        <div className="mt-2 font-mono text-[12px] text-ink-3">{p.role}</div>

        <p className="mt-4 text-[16px] leading-[1.6] text-ink-2 max-w-[620px] [text-wrap:pretty] text-justify">
          {p.summary}
        </p>

        {/* Animated expand/collapse via grid-template-rows trick */}
        <div
          className={`grid transition-[grid-template-rows] duration-[350ms] ease-in-out ${
            open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <ul className="mt-5 p-0 list-none grid gap-[10px]">
              {p.bullets.map((b, i) => (
                <li key={i} className="grid grid-cols-[28px_1fr] gap-2 text-[15px] text-ink-2 leading-[1.55]">
                  <span className="font-mono text-[11px] text-ink-3 pt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="mt-5 flex flex-wrap gap-[6px]">
              {p.stack.map((s) => (
                <span
                  key={s}
                  className="font-mono text-[11px] px-[10px] py-1 border border-rule rounded-full text-ink-2 bg-panel"
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Visual / metrics column ── */}
      <div>
        {/* Stripe placeholder — .project-visual-bg uses repeating-linear-gradient with color-mix() */}
        <div
          aria-label={`${p.name} visual placeholder`}
          className="project-visual-bg w-full aspect-[4/3] border border-rule rounded-[6px] relative overflow-hidden"
        >
          <div className="absolute top-[10px] left-[10px] font-mono text-[10px] text-ink-3 tracking-[0.06em]">
            [{p.name.toUpperCase()} · diagram]
          </div>
          <div className="absolute bottom-[10px] right-[10px] font-mono text-[10px] text-ink-3">
            ░ system architecture ░
          </div>
        </div>

        {/* Metrics row */}
        <div className="mt-[14px] grid grid-cols-3">
          {p.metrics.map((m, i) => (
            <div
              key={m.k}
              className={`p-[10px_12px] border-t border-b border-r border-rule ${
                i === 0 ? 'border-l' : ''
              }`}
            >
              <MonoLabel className="text-[9px]">{m.k}</MonoLabel>
              <div className="font-display text-[18px] text-ink-1 mt-1 tracking-[-0.01em]">
                {m.v}
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
          className="mt-[14px] bg-transparent border-none font-mono text-[11px] text-ink-3 cursor-pointer p-0 tracking-[0.06em]"
        >
          {open ? '— collapse details' : '+ expand details'}
        </button>
      </div>
    </article>
  );
}
