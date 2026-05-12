/**
 * TweaksPanel — self-contained React island for runtime theme customisation.
 *
 * Responsibilities in the Astro context:
 *  1. Manage tweak state (accent color, display font, density, grid toggle).
 *  2. Apply CSS custom properties to document.documentElement on every change
 *     so every Tailwind utility that references var(--accent) etc. updates live.
 *  3. Render the draggable panel UI (retains original __TWEAKS_STYLE CSS string).
 *  4. Render the 12-col GridOverlay when showGrid is enabled.
 *
 * The __TWEAKS_STYLE CSS is injected via a <style> tag inside this component.
 * All twk-* classes are scoped to that stylesheet and don't conflict with Tailwind.
 */
import {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react';

/* ─── Design constants ───────────────────────────────────────────────────── */

const TWEAK_DEFAULTS = {
  accent:      'amber',
  displayFont: 'geist',
  density:     'comfortable',
  showGrid:    false,
};

const ACCENT_HEX: Record<string, string> = {
  amber:  '#c98a3a',
  forest: '#3f7a52',
  cobalt: '#4a6fc0',
  rust:   '#b86545',
};

const DISPLAYS: Record<string, { display: string; serif: string }> = {
  geist:      { display: '"Geist", system-ui, sans-serif',           serif: '"Newsreader", Georgia, serif'      },
  newsreader: { display: '"Newsreader", Georgia, serif',             serif: '"Newsreader", Georgia, serif'      },
  ibmplex:    { display: '"IBM Plex Sans", system-ui, sans-serif',   serif: '"IBM Plex Serif", Georgia, serif'  },
};

/* ─── Panel stylesheet (original __TWEAKS_STYLE, verbatim) ──────────────── */
const PANEL_CSS = `
  .twk-panel{position:fixed;right:16px;bottom:16px;z-index:2147483646;width:280px;
    max-height:calc(100vh - 32px);display:flex;flex-direction:column;
    transform:scale(var(--dc-inv-zoom,1));transform-origin:bottom right;
    background:rgba(250,249,247,.78);color:#29261b;
    -webkit-backdrop-filter:blur(24px) saturate(160%);backdrop-filter:blur(24px) saturate(160%);
    border:.5px solid rgba(255,255,255,.6);border-radius:14px;
    box-shadow:0 1px 0 rgba(255,255,255,.5) inset,0 12px 40px rgba(0,0,0,.18);
    font:11.5px/1.4 ui-sans-serif,system-ui,-apple-system,sans-serif;overflow:hidden}
  .twk-hd{display:flex;align-items:center;justify-content:space-between;
    padding:10px 8px 10px 14px;cursor:move;user-select:none}
  .twk-hd b{font-size:12px;font-weight:600;letter-spacing:.01em}
  .twk-x{appearance:none;border:0;background:transparent;color:rgba(41,38,27,.55);
    width:22px;height:22px;border-radius:6px;cursor:default;font-size:13px;line-height:1}
  .twk-x:hover{background:rgba(0,0,0,.06);color:#29261b}
  .twk-body{padding:2px 14px 14px;display:flex;flex-direction:column;gap:10px;
    overflow-y:auto;overflow-x:hidden;min-height:0;
    scrollbar-width:thin;scrollbar-color:rgba(0,0,0,.15) transparent}
  .twk-body::-webkit-scrollbar{width:8px}
  .twk-body::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15);border-radius:4px;
    border:2px solid transparent;background-clip:content-box}
  .twk-row{display:flex;flex-direction:column;gap:5px}
  .twk-row-h{flex-direction:row;align-items:center;justify-content:space-between;gap:10px}
  .twk-lbl{display:flex;justify-content:space-between;align-items:baseline;color:rgba(41,38,27,.72)}
  .twk-lbl>span:first-child{font-weight:500}
  .twk-sect{font-size:10px;font-weight:600;letter-spacing:.06em;text-transform:uppercase;
    color:rgba(41,38,27,.45);padding:10px 0 0}
  .twk-sect:first-child{padding-top:0}
  .twk-seg{position:relative;display:flex;padding:2px;border-radius:8px;
    background:rgba(0,0,0,.06);user-select:none}
  .twk-seg-thumb{position:absolute;top:2px;bottom:2px;border-radius:6px;
    background:rgba(255,255,255,.9);box-shadow:0 1px 2px rgba(0,0,0,.12);
    transition:left .15s cubic-bezier(.3,.7,.4,1),width .15s}
  .twk-seg button{appearance:none;position:relative;z-index:1;flex:1;border:0;
    background:transparent;color:inherit;font:inherit;font-weight:500;min-height:22px;
    border-radius:6px;cursor:default;padding:4px 6px;line-height:1.2}
  .twk-toggle{position:relative;width:32px;height:18px;border:0;border-radius:999px;
    background:rgba(0,0,0,.15);transition:background .15s;cursor:default;padding:0}
  .twk-toggle[data-on="1"]{background:#34c759}
  .twk-toggle i{position:absolute;top:2px;left:2px;width:14px;height:14px;border-radius:50%;
    background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.25);transition:transform .15s}
  .twk-toggle[data-on="1"] i{transform:translateX(14px)}
  .twk-chips{display:flex;gap:6px}
  .twk-chip{position:relative;appearance:none;flex:1;min-width:0;height:46px;
    padding:0;border:0;border-radius:6px;overflow:hidden;cursor:default;
    box-shadow:0 0 0 .5px rgba(0,0,0,.12),0 1px 2px rgba(0,0,0,.06);
    transition:transform .12s,box-shadow .12s}
  .twk-chip[data-on="1"]{box-shadow:0 0 0 1.5px rgba(0,0,0,.85),0 2px 6px rgba(0,0,0,.15)}
  .twk-chip svg{position:absolute;top:6px;left:6px;width:13px;height:13px;
    filter:drop-shadow(0 1px 1px rgba(0,0,0,.3))}
`;

/* ─── useTweaks hook ─────────────────────────────────────────────────────── */
type Tweaks = typeof TWEAK_DEFAULTS;

function useTweaks(defaults: Tweaks) {
  const [values, setValues] = useState<Tweaks>(defaults);

  const setTweak = useCallback((keyOrEdits: keyof Tweaks | Partial<Tweaks>, val?: unknown) => {
    const edits =
      typeof keyOrEdits === 'object' && keyOrEdits !== null
        ? keyOrEdits
        : { [keyOrEdits]: val };
    setValues((prev) => ({ ...prev, ...edits }));
    /* Broadcast to host design tools if running inside a frame */
    try { window.parent.postMessage({ type: '__edit_mode_set_keys', edits }, '*'); } catch {}
    window.dispatchEvent(new CustomEvent('tweakchange', { detail: edits }));
  }, []);

  return [values, setTweak] as const;
}

/* ─── GridOverlay ────────────────────────────────────────────────────────── */
function GridOverlay() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none z-50 max-w-content mx-auto px-10 grid grid-cols-12 gap-4"
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          style={{
            background: 'color-mix(in oklch, var(--accent) 8%, transparent)',
            outline:    '1px dashed color-mix(in oklch, var(--accent) 25%, transparent)',
          }}
        />
      ))}
    </div>
  );
}

/* ─── Tweak Controls ─────────────────────────────────────────────────────── */
function TweakSection({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <>
      <div className="twk-sect">{label}</div>
      {children}
    </>
  );
}

function TweakRow({ label, children, inline = false }: { label: string; children?: ReactNode; inline?: boolean }) {
  return (
    <div className={inline ? 'twk-row twk-row-h' : 'twk-row'}>
      <div className="twk-lbl"><span>{label}</span></div>
      {children}
    </div>
  );
}

function TweakToggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="twk-row twk-row-h">
      <div className="twk-lbl"><span>{label}</span></div>
      <button
        type="button"
        className="twk-toggle"
        data-on={value ? '1' : '0'}
        role="switch"
        aria-checked={value}
        onClick={() => onChange(!value)}
      >
        <i />
      </button>
    </div>
  );
}

function TweakRadio({
  label,
  value,
  options,
  onChange,
}: {
  label:    string;
  value:    string;
  options:  string[];
  onChange: (v: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  const n   = options.length;
  const idx = Math.max(0, options.indexOf(value));

  const segAt = (clientX: number) => {
    if (!trackRef.current) return options[0];
    const r     = trackRef.current.getBoundingClientRect();
    const inner = r.width - 4;
    const i     = Math.floor(((clientX - r.left - 2) / inner) * n);
    return options[Math.max(0, Math.min(n - 1, i))];
  };

  const onPointerDown = (e: React.PointerEvent) => {
    const v0 = segAt(e.clientX);
    if (v0 !== valueRef.current) onChange(v0);
    const move = (ev: PointerEvent) => {
      const v = segAt(ev.clientX);
      if (v !== valueRef.current) onChange(v);
    };
    const up = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup',   up);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup',   up);
  };

  return (
    <TweakRow label={label}>
      <div ref={trackRef} role="radiogroup" onPointerDown={onPointerDown} className="twk-seg">
        <div
          className="twk-seg-thumb"
          style={{
            left:  `calc(2px + ${idx} * (100% - 4px) / ${n})`,
            width: `calc((100% - 4px) / ${n})`,
          }}
        />
        {options.map((o) => (
          <button key={o} type="button" role="radio" aria-checked={o === value}>
            {o}
          </button>
        ))}
      </div>
    </TweakRow>
  );
}

function TweakColor({
  label,
  value,
  options,
  onChange,
}: {
  label:    string;
  value:    string;
  options:  string[];
  onChange: (v: string) => void;
}) {
  const key = (o: string) => String(o).toLowerCase();
  const cur = key(value);
  return (
    <TweakRow label={label}>
      <div className="twk-chips" role="radiogroup">
        {options.map((o, i) => {
          const on = key(o) === cur;
          return (
            <button
              key={i}
              type="button"
              className="twk-chip"
              role="radio"
              aria-checked={on}
              data-on={on ? '1' : '0'}
              style={{ background: o }}
              onClick={() => onChange(o)}
            >
              {on && (
                <svg viewBox="0 0 14 14" aria-hidden="true">
                  <path
                    d="M3 7.2 5.8 10 11 4.2"
                    fill="none"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    stroke="rgba(255,255,255,0.9)"
                  />
                </svg>
              )}
            </button>
          );
        })}
      </div>
    </TweakRow>
  );
}

/* ─── TweaksPanel ────────────────────────────────────────────────────────── */
export default function TweaksPanel() {
  const [tweaks, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [open,   setOpen]  = useState(false);
  const dragRef            = useRef<HTMLDivElement>(null);
  const offsetRef          = useRef({ x: 16, y: 16 });
  const PAD                = 16;

  /* Apply CSS variables to :root whenever tweaks change */
  useEffect(() => {
    const accent  = ACCENT_HEX[tweaks.accent]  ?? ACCENT_HEX.amber;
    const fonts   = DISPLAYS[tweaks.displayFont] ?? DISPLAYS.geist;
    const density = tweaks.density === 'compact' ? 0.85 : tweaks.density === 'spacious' ? 1.15 : 1;
    const r       = document.documentElement;
    r.style.setProperty('--accent',  accent);
    r.style.setProperty('--display', fonts.display);
    r.style.setProperty('--serif',   fonts.serif);
    r.style.setProperty('--density', String(density));
  }, [tweaks.accent, tweaks.displayFont, tweaks.density]);

  /* Listen for host activate/deactivate messages (design tool integration) */
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === '__activate_edit_mode')   setOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setOpen(false);
    };
    window.addEventListener('message', onMsg);
    try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
    return () => window.removeEventListener('message', onMsg);
  }, []);

  const clampToViewport = useCallback(() => {
    const panel = dragRef.current;
    if (!panel) return;
    const w = panel.offsetWidth, h = panel.offsetHeight;
    offsetRef.current = {
      x: Math.min(Math.max(PAD, window.innerWidth  - w - PAD), Math.max(PAD, offsetRef.current.x)),
      y: Math.min(Math.max(PAD, window.innerHeight - h - PAD), Math.max(PAD, offsetRef.current.y)),
    };
    panel.style.right  = offsetRef.current.x + 'px';
    panel.style.bottom = offsetRef.current.y + 'px';
  }, []);

  useEffect(() => {
    if (!open) return;
    clampToViewport();
    const ro = new ResizeObserver(clampToViewport);
    ro.observe(document.documentElement);
    return () => ro.disconnect();
  }, [open, clampToViewport]);

  const onDragStart = (e: React.MouseEvent) => {
    const panel = dragRef.current;
    if (!panel) return;
    const r          = panel.getBoundingClientRect();
    const sx         = e.clientX, sy = e.clientY;
    const startRight = window.innerWidth  - r.right;
    const startBot   = window.innerHeight - r.bottom;
    const move = (ev: MouseEvent) => {
      offsetRef.current = {
        x: startRight - (ev.clientX - sx),
        y: startBot   - (ev.clientY - sy),
      };
      clampToViewport();
    };
    const up = () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseup',   up);
    };
    window.addEventListener('mousemove', move);
    window.addEventListener('mouseup',   up);
  };

  if (!open) return null;

  return (
    <>
      <style>{PANEL_CSS}</style>

      {tweaks.showGrid && <GridOverlay />}

      <div
        ref={dragRef}
        className="twk-panel"
        style={{ right: offsetRef.current.x, bottom: offsetRef.current.y }}
      >
        <div className="twk-hd" onMouseDown={onDragStart}>
          <b>Tweaks</b>
          <button
            className="twk-x"
            aria-label="Close tweaks"
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => {
              setOpen(false);
              try { window.parent.postMessage({ type: '__edit_mode_dismissed' }, '*'); } catch {}
            }}
          >
            ✕
          </button>
        </div>

        <div className="twk-body">
          <TweakSection label="Accent">
            <TweakColor
              label="Color"
              value={ACCENT_HEX[tweaks.accent] ?? ACCENT_HEX.amber}
              options={[ACCENT_HEX.amber, ACCENT_HEX.forest, ACCENT_HEX.cobalt, ACCENT_HEX.rust]}
              onChange={(hex) => {
                const key = Object.keys(ACCENT_HEX).find((k) => ACCENT_HEX[k] === hex) ?? 'amber';
                setTweak('accent', key);
              }}
            />
          </TweakSection>

          <TweakSection label="Display font">
            <TweakRadio
              label="Family"
              value={tweaks.displayFont}
              options={['geist', 'newsreader', 'ibmplex']}
              onChange={(v) => setTweak('displayFont', v)}
            />
          </TweakSection>

          <TweakSection label="Density">
            <TweakRadio
              label="Spacing"
              value={tweaks.density}
              options={['compact', 'comfortable', 'spacious']}
              onChange={(v) => setTweak('density', v)}
            />
          </TweakSection>

          <TweakSection label="Debug">
            <TweakToggle
              label="12-col grid"
              value={tweaks.showGrid}
              onChange={(v) => setTweak('showGrid', v)}
            />
          </TweakSection>
        </div>
      </div>
    </>
  );
}
