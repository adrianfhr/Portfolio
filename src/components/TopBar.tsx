import { useState, useEffect } from 'react';

interface Props {
  name:  string;
  email: string;
}

/* Inline Dot primitive — mirrors Dot.astro for use inside React islands. */
function Dot({ color = 'var(--accent)' }: { color?: string }) {
  return (
    <span
      className="dot-indicator inline-block w-[6px] h-[6px] rounded-full align-middle mr-2"
      style={{ '--dot-color': color } as React.CSSProperties}
    />
  );
}

function SunIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor"
         strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1"  x2="12" y2="3"  />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22"   x2="5.64" y2="5.64"   />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1"  y1="12" x2="3"  y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78"  x2="5.64" y2="18.36"  />
      <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

export default function TopBar({ name, email }: Props) {
  const [copied, setCopied] = useState(false);
  const [isDark,  setIsDark] = useState(false);

  /*
   * Read the actual theme from the DOM after hydration.
   * useState initialises as false (light) on both server and client to avoid
   * a hydration mismatch. useEffect then syncs with the value already applied
   * by the no-FOWT inline script in Layout.astro.
   */
  useEffect(() => {
    setIsDark(document.documentElement.getAttribute('data-theme') === 'dark');
  }, []);

  const copyEmail = () => {
    navigator.clipboard?.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <header className="sticky top-0 z-10 topbar-glass border-b border-rule">
      <div className="max-w-content mx-auto px-10 py-[14px] flex items-center justify-between font-mono text-[12px]">
        {/* Brand */}
        <div className="flex items-center gap-[14px]">
          <span className="font-semibold text-ink-1">
            {name.toLowerCase().replace(' ', '.')}
          </span>
          <span className="text-ink-3">/</span>
          <span className="text-ink-2">portfolio&apos;26</span>
        </div>

        {/* Nav */}
        <nav className="flex gap-[22px] text-ink-2">
          {(['work', 'experience', 'stack', 'about', 'writing'] as const).map((item) => (
            <a
              key={item}
              href={`#${item}`}
              className="text-inherit no-underline transition-colors duration-150"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/*
            suppressHydrationWarning: server renders isDark=false, client may
            immediately correct it. React is told to ignore this one mismatch.
          */}
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            suppressHydrationWarning
            className="bg-transparent border border-rule rounded-full w-[28px] h-[28px] text-ink-2 cursor-pointer inline-flex items-center justify-center transition-colors duration-150"
          >
            {isDark ? <MoonIcon /> : <SunIcon />}
          </button>

          {/* Email copy */}
          <button
            onClick={copyEmail}
            title="Copy email"
            className="bg-transparent border border-rule rounded-full px-3 py-[6px] font-mono text-[12px] text-ink-2 cursor-pointer inline-flex items-center"
          >
            <Dot />
            {copied ? 'copied' : email}
          </button>
        </div>
      </div>
    </header>
  );
}
