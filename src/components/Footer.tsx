import { useState } from 'react';
import type { Profile } from '../data/portfolio';

interface Props {
  profile: Pick<Profile, 'name' | 'email'>;
}

export default function Footer({ profile }: Props) {
  const [copied, setCopied] = useState(false);

  const copyEmail = () => {
    navigator.clipboard?.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const links = [
    { label: 'github',  url: '#' },
    { label: 'linkedin', url: '#' },
    { label: 'cv.pdf',  url: '#' },
  ];

  return (
    <footer className="mt-20 border-t border-rule bg-panel">
      <div className="max-w-content mx-auto px-10 pt-[72px] pb-12 grid grid-cols-[minmax(0,1fr)_auto] gap-12 items-end">
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

            {/* External links */}
            {links.map((l) => (
              <a
                key={l.label}
                href={l.url}
                className="no-underline py-3 px-[18px] border border-rule rounded-full font-mono text-[13px] text-ink-2 bg-bg"
              >
                {l.label} ↗
              </a>
            ))}
          </div>
        </div>

        {/* Colophon */}
        <div className="font-mono text-[11px] text-ink-3 text-right">
          <div>built in vim · deployed on a vps</div>
          <div className="mt-1">© 2026 {profile.name.toLowerCase()}</div>
          <div className="mt-1">last edit · 2026.05.12</div>
        </div>
      </div>
    </footer>
  );
}
