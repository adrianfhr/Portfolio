import { useState, useEffect } from 'react';
import type { Profile } from '../data/portfolio';

interface Props {
  profile: Pick<Profile, 'name' | 'email'>;
}

function CVModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="CV Preview"
      className={`fixed inset-0 z-[100] flex items-center justify-center transition-opacity duration-200 ${
        open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
      }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`relative z-10 flex flex-col w-[min(860px,95vw)] h-[90vh] bg-bg border border-rule rounded-xl overflow-hidden shadow-[0_32px_80px_-20px_rgba(0,0,0,0.5)] transition-[transform,opacity] duration-200 ${
          open ? 'scale-100 opacity-100' : 'scale-[0.96] opacity-0'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-[11px] border-b border-rule bg-panel flex-shrink-0">
          <span className="font-mono text-[11px] text-ink-3 tracking-[0.04em]">
            adrian fahri affandi — cv.pdf
          </span>
          <div className="flex items-center gap-2">
            <a
              href="/cv.pdf"
              download="CV-AdrianFahriAffandi.pdf"
              className="font-mono text-[11px] px-3 py-[5px] border border-rule rounded-full text-ink-2 bg-bg no-underline transition-colors duration-150 hover:text-ink-1"
            >
              ↓ download
            </a>
            <button
              onClick={onClose}
              aria-label="Close CV preview"
              className="bg-transparent border border-rule rounded-full w-[26px] h-[26px] text-[12px] text-ink-2 cursor-pointer leading-none"
            >
              ✕
            </button>
          </div>
        </div>

        {/* PDF viewer */}
        <iframe
          src="/cv.pdf"
          title="CV Adrian Fahri Affandi"
          className="flex-1 w-full border-none min-h-0"
        />
      </div>
    </div>
  );
}

export default function Footer({ profile }: Props) {
  const [copied, setCopied] = useState(false);
  const [cvOpen, setCvOpen] = useState(false);

  const copyEmail = () => {
    navigator.clipboard?.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const links = [
    { label: 'github',    url: 'https://github.com/adrianfhr'                },
    { label: 'linkedin',  url: 'https://www.linkedin.com/in/adrianfhr'       },
    { label: 'whatsapp',  url: 'https://wa.me/6281315080434'                 },
  ];

  return (
    <>
      <footer className="mt-12 sm:mt-20 border-t border-rule bg-panel">
        <div className="max-w-content mx-auto px-5 sm:px-10 pt-12 sm:pt-[72px] pb-10 sm:pb-12 grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_auto] gap-8 sm:gap-12 items-start sm:items-end">
          {/* CTA */}
          <div>
            <span className="font-mono text-[11px] tracking-[0.08em] uppercase text-ink-3">
              § 06 · Get in touch
            </span>

            <h2 className="font-display text-[clamp(40px,6vw,72px)] tracking-[-0.03em] font-medium mt-4 text-ink-1 leading-none">
              Want to{' '}
              <span className="font-serif italic font-normal text-ink-2">build something</span>{' '}
              together?
            </h2>

            <div className="mt-7 flex gap-[10px] flex-wrap">
              {/* Email copy */}
              <button
                onClick={copyEmail}
                className="bg-ink-1 text-bg border-none py-3 px-5 rounded-full font-mono text-[13px] cursor-pointer tracking-[0.02em]"
              >
                {copied ? '✓ email copied' : `→ ${profile.email}`}
              </button>

              {/* CV — opens modal */}
              <button
                onClick={() => setCvOpen(true)}
                className="py-3 px-[18px] border border-rule rounded-full font-mono text-[13px] text-ink-2 bg-bg cursor-pointer"
              >
                cv.pdf ↗
              </button>

              {/* External links */}
              {links.map((l) => (
                <a
                  key={l.label}
                  href={l.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="no-underline py-3 px-[18px] border border-rule rounded-full font-mono text-[13px] text-ink-2 bg-bg"
                >
                  {l.label} ↗
                </a>
              ))}
            </div>
          </div>

          {/* Colophon */}
          <div className="font-mono text-[11px] text-ink-3 text-left sm:text-right">
            <div>built with astro · deployed on vps</div>
            <div className="mt-1">© 2026 {profile.name.toLowerCase()}</div>
            <div className="mt-1">last edit · 2026.05.13</div>
          </div>
        </div>
      </footer>

      <CVModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  );
}
