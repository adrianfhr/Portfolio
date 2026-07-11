import { useState } from 'react';
import { EXPERIENCE } from '../data/portfolio';
import type { ExperienceItem } from '../data/portfolio';

function MonoLabel({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <span
      className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3"
      style={style}
    >
      {children}
    </span>
  );
}

function Dot() {
  return (
    <span
      className="dot-indicator inline-block w-[6px] h-[6px] rounded-full align-middle"
      style={{ '--dot-color': 'var(--accent)' } as React.CSSProperties}
    />
  );
}

function ExperienceDetail({ e }: { e: ExperienceItem }) {
  return (
    <div className="border-l border-rule pl-5 sm:pl-10">
      <div className="flex items-baseline justify-between gap-4 flex-wrap">
        <div>
          <MonoLabel>{e.type} · {e.duration}</MonoLabel>
          <h3 className="font-display text-[24px] sm:text-[32px] tracking-[-0.02em] font-medium mt-[10px] mb-1 text-ink-1">
            {e.role}
          </h3>
          <div className="flex items-center gap-[10px] text-ink-2 text-[15px]">
            <span className="font-serif italic">{e.company}</span>
            <span className="text-ink-3">·</span>
            <span className="font-mono text-[12px] text-ink-3">{e.location}</span>
          </div>
        </div>
        {e.current && (
          <span className="badge-accent">
            <Dot /> current
          </span>
        )}
      </div>

      <p className="mt-[18px] text-[17px] leading-[1.55] text-ink-2 max-w-[640px] [text-wrap:pretty]">
        {e.summary}
      </p>

      <ul className="mt-[22px] p-0 list-none grid gap-3">
        {e.highlights.map((h, i) => (
          <li key={i} className="grid gap-[10px] text-[15px] text-ink-1 leading-[1.55]"
              style={{ gridTemplateColumns: '28px 1fr' }}>
            <span className="font-mono text-[11px] text-ink-3 pt-1 tracking-[0.04em]">↳</span>
            <span className="[text-wrap:pretty]">{h}</span>
          </li>
        ))}
      </ul>

      <div className="mt-[22px] flex flex-wrap gap-[6px]">
        {e.tags.map((t) => (
          <span
            key={t}
            className="font-mono text-[11px] px-[10px] py-1 border border-rule rounded-full text-ink-2 bg-panel"
          >
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}

const stats = [
  { k: 'total experience',   v: '3+ yrs',      s: 'including internship + research' },
  { k: 'roles',              v: '3',            s: 'intern → junior eng'             },
  { k: 'production systems', v: '2 shipped',    s: 'owned end-to-end'                },
  { k: 'team size today',    v: '5 engineers',  s: 'ML + backend'                   },
];

/*
 * Same 2x2-mobile / 1-row-desktop divider logic as Hero's stats bar:
 * index 2 starts a new row on mobile (no divider needed) but is still
 * mid-row on sm+, so its border only appears there.
 */
const borderClass = (i: number) => {
  if (i === 0) return '';
  if (i % 2 === 0) return 'sm:border-l sm:border-rule';
  return 'border-l border-rule';
};

export default function Experience() {
  const [active, setActive] = useState(0);

  return (
    <section id="experience" className="py-10 sm:py-[60px] px-5 sm:px-10 max-w-content mx-auto">
      {/* Section head */}
      <div className="flex items-baseline justify-between mb-7 flex-wrap gap-2">
        <div className="flex items-baseline gap-[18px]">
          <MonoLabel>§ 02</MonoLabel>
          <h2 className="font-display text-[28px] tracking-[-0.02em] font-medium m-0 text-ink-1">
            Experience
          </h2>
        </div>
        <span className="font-mono text-[12px] text-ink-3">Where I've been shipping</span>
      </div>

      {/* Quick stats strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 border-t border-b border-rule mb-10">
        {stats.map((c, i) => (
          <div key={c.k} className={`py-[22px] px-5 ${borderClass(i)}`}>
            <MonoLabel>{c.k}</MonoLabel>
            <div className="text-[18px] text-ink-1 mt-2 tracking-[-0.01em]">{c.v}</div>
            <div className="text-[13px] text-ink-3 mt-1">{c.s}</div>
          </div>
        ))}
      </div>

      {/* Timeline */}
      <div className="grid gap-8 sm:gap-12 grid-cols-1 sm:[grid-template-columns:260px_1fr]">
        {/* Left rail */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute bg-rule"
            style={{ left: 7, top: 8, bottom: 8, width: 1 }}
          />
          {EXPERIENCE.map((e, i) => {
            const isActive = i === active;
            return (
              <button
                key={i}
                onClick={() => setActive(i)}
                className="relative block w-full text-left bg-transparent border-none py-[10px] pb-[18px] pl-7 cursor-pointer font-display"
              >
                <span
                  className={`timeline-dot absolute left-0 top-[14px]${isActive ? ' timeline-dot--active' : ''}`}
                >
                  {e.current && (
                    <span className="w-[6px] h-[6px] rounded-full bg-accent" />
                  )}
                </span>
                <div
                  className="font-mono text-[11px] tracking-[0.04em]"
                  style={{ color: isActive ? 'var(--ink-1)' : 'var(--ink-3)' }}
                >
                  {e.period}
                </div>
                <div
                  className={`text-[15px] mt-1 tracking-[-0.005em] ${isActive ? 'text-ink-1 font-medium' : 'text-ink-2'}`}
                >
                  {e.role}
                </div>
                <div className="text-[13px] text-ink-3 mt-[2px]">{e.company}</div>
              </button>
            );
          })}
        </div>

        {/* Detail pane */}
        <ExperienceDetail e={EXPERIENCE[active]} />
      </div>
    </section>
  );
}
