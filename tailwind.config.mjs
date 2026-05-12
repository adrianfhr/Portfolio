/**
 * Tailwind CSS Configuration
 *
 * NOTE: This project uses Tailwind CSS v4 with the @tailwindcss/vite plugin.
 * In Tailwind v4, design tokens are configured via `@theme inline` in
 * src/styles/global.css — which is the recommended approach per Astro docs.
 *
 * This file documents the token mapping in the familiar v3 format for reference.
 * To activate it, add `@config "../../tailwind.config.mjs"` in global.css
 * (v3 compat mode). See: https://tailwindcss.com/docs/upgrade-guide
 *
 * Custom Tokens registered in global.css @theme block:
 * ─────────────────────────────────────────────────────
 * Colors  → bg, panel, ink-1, ink-2, ink-3, rule, accent
 * Fonts   → display (--display), serif (--serif), mono (--mono)
 * These all reference CSS custom properties so they update dynamically
 * when the TweaksPanel changes --accent, --display, etc. at runtime.
 */
export default {
  theme: {
    extend: {
      colors: {
        bg:      'var(--bg)',
        panel:   'var(--panel)',
        'ink-1': 'var(--ink-1)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        rule:    'var(--rule)',
        accent:  'var(--accent)',
      },
      fontFamily: {
        display: ['var(--display)'],
        serif:   ['var(--serif)'],
        mono:    ['var(--mono)'],
      },
      maxWidth: {
        content: '1180px',
      },
    },
  },
  plugins: [],
};
