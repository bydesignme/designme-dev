'use client';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './voice-capture.css';

export type VoiceCaptureState = 'listening' | 'paused' | 'review' | 'sent' | 'cancelled';

/** A word the speech model was not sure about */
export interface HeardWord {
  text: string;
  /** What it might have been instead. Highlights the word and lets the person pick one */
  alternatives?: string[];
}

export interface VoiceCaptureProps {
  /** The words heard so far, in order. Add to the end as they arrive and each one fades in */
  words: Array<string | HeardWord>;
  /** listening and paused record, review asks the person to check the words, sent and cancelled are the end.
      Leave it out to let the buttons move it along */
  state?: VoiceCaptureState;
  defaultState?: VoiceCaptureState;
  onStateChange?: (state: VoiceCaptureState) => void;
  /** Seconds recorded. Leave it out to let it count while listening */
  seconds?: number;
  /** The input level from 0 to 1, drawn into the wave about 20 times a second. Pass a function to read the
      microphone on every sample (for example from an AnalyserNode) without re-rendering */
  level?: number | (() => number);
  /** The status line. Defaults to Listening, Paused, Check what I heard, Sent or Cancelled */
  status?: string;
  /** Called with the checked transcript when the person presses Done in review */
  onSend?: (text: string) => void;
  /** Called when the person picks one of a word's alternatives */
  onFix?: (index: number, text: string) => void;
  /** Called by Record again, once the capture is sent or cancelled. Clear your words and start listening again */
  onRecordAgain?: () => void;
  className?: string;
}

const STATUS: Record<VoiceCaptureState, string> = { listening: 'Listening', paused: 'Paused', review: 'Check what I heard', sent: 'Sent', cancelled: 'Cancelled' };
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Speech to text that shows what it heard as it hears it, and lets the person fix the words it was unsure of. */
export function VoiceCapture({ words, state, defaultState = 'listening', onStateChange, seconds, level = 0, status, onSend, onFix, onRecordAgain, className }: VoiceCaptureProps) {
  const [now, setState] = useControllable(state, defaultState, onStateChange);
  const live = now === 'listening' || now === 'paused', ended = now === 'sent' || now === 'cancelled';
  const root = useRef<HTMLDivElement>(null);
  const wave = useRef<HTMLCanvasElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  // once recording stops the wave folds away: the box keeps the height it had while recording and centres the words in it
  const liveHeight = useRef<number | undefined>(undefined);
  const [held, setHeld] = useState<number>();
  useIsoLayoutEffect(() => { if (live && root.current) liveHeight.current = root.current.offsetHeight; });
  useIsoLayoutEffect(() => { setHeld(live ? undefined : liveHeight.current); }, [live]);

  // the clock counts while listening, unless the parent passes seconds
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (seconds !== undefined || now !== 'listening') return;
    const id = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(id);
  }, [seconds, now]);

  // the wave: one sample every 50ms, drawn as bars that scroll left, until the capture is done
  const samples = useRef<number[]>([]);
  const levelRef = useRef(level), stateRef = useRef(now);
  useEffect(() => { levelRef.current = level; stateRef.current = now; });
  useEffect(() => {
    if (!live) return;
    // the wave is drawn only while it is on screen
    let raf = 0, last = 0, seen = true;
    const io = 'IntersectionObserver' in window && wave.current ? new IntersectionObserver(e => { seen = e[e.length - 1].isIntersecting; }) : null;
    if (io && wave.current) io.observe(wave.current);
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!seen) return;
      if (t - last > 50) {
        last = t;
        const l = levelRef.current, v = stateRef.current === 'listening' ? (typeof l === 'function' ? l() : l) : 0;
        samples.current.push(Math.max(0, Math.min(1, v))); if (samples.current.length > 300) samples.current.shift();
      }
      const cv = wave.current, el = root.current; if (!cv || !el) return;
      const dpr = devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
      if (cv.width !== w * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
      const x = cv.getContext('2d'); if (!x) return;
      x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
      const cs = getComputedStyle(el), on = cs.getPropertyValue('--dm-fg2').trim(), off = cs.getPropertyValue('--dm-faint').trim();
      const s = samples.current, n = Math.floor(w / 5);
      for (let i = 0; i < n; i++) {
        const v = s[s.length - n + i] || 0, px = i * 5 + 2, bh = v ? Math.max(4, v * (h - 6)) : 2;
        x.globalAlpha = Math.min(1, i / 14, (n - i) / 3 + .2);
        x.fillStyle = v ? on : off;
        x.beginPath();
        if (x.roundRect) x.roundRect(px, h / 2 - bh / 2, 2.5, bh, 1.2); else x.rect(px, h / 2 - bh / 2, 2.5, bh);
        x.fill();
      }
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }, [live]);

  // words it was unsure of open a small "Did you mean" menu under themselves
  const [fixes, setFixes] = useState<Record<number, string>>({});
  // the menu keeps its place and words while it fades out, so only `open` flips when it closes
  const [menu, setMenu] = useState<{ index: number; alts: string[]; style: CSSProperties }>({ index: -1, alts: [], style: {} });
  const [menuOpen, setMenuOpen] = useState(false);
  // the keyboard: Enter or Space on a word opens its menu with the focus on the first fix; the arrows move through the fixes
  // and wrap, Home and End jump, and Escape closes the menu back to the word
  const keyOpen = useRef(false), inMenu = useRef(false);
  const wordEl = (i: number) => root.current?.querySelector<HTMLElement>(`.dm-low[data-i="${i}"]`);
  useIsoLayoutEffect(() => {
    if (menuOpen) { if (keyOpen.current) { keyOpen.current = false; pop.current?.querySelector<HTMLElement>('.dm-mi')?.focus({ preventScroll: true }); } return; }
    if (inMenu.current) { inMenu.current = false; wordEl(menu.index)?.focus({ preventScroll: true }); }
  }, [menuOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  const menuKey = (e: ReactKeyboardEvent) => {
    const all = Array.from(pop.current?.querySelectorAll<HTMLElement>('.dm-mi') ?? []), i = all.indexOf(document.activeElement as HTMLElement);
    const go = ({ ArrowDown: all[(i + 1) % all.length], ArrowUp: all[(i - 1 + all.length) % all.length], Home: all[0], End: all[all.length - 1] } as Record<string, HTMLElement | undefined>)[e.key];
    if (go) { e.preventDefault(); go.focus({ preventScroll: true }); }
    else if (e.key === 'Tab') { inMenu.current = false; wordEl(menu.index)?.focus({ preventScroll: true }); setMenuOpen(false); }
  };
  const show = (index: number, el: HTMLElement) => {
    const box = root.current; if (!box) return;
    const hr = box.getBoundingClientRect(), lr = el.getBoundingClientRect();
    setMenu({ index, alts: (words[index] as HeardWord).alternatives ?? [], style: { left: lr.left - hr.left, top: lr.bottom - hr.top + 6 } });
    setMenuOpen(true);
  };
  useEffect(() => {
    if (!menuOpen) return;
    // the click that opened the menu, or one on another unsure word, is not a click outside. Opening the menu
    // re-renders the word without its tip, so that click's target may already have left the page
    const click = (e: MouseEvent) => { const t = e.target as Element; if (t.isConnected && !pop.current?.contains(t) && !(root.current?.contains(t) && t.closest('.dm-low'))) setMenuOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('click', click); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('click', click); document.removeEventListener('keydown', key); };
  }, [menuOpen]);
  const fix = (index: number, text: string) => { setFixes(f => ({ ...f, [index]: text })); onFix?.(index, text); setMenuOpen(false); };

  const text = () => words.map((w, i) => fixes[i] ?? (typeof w === 'string' ? w : w.text)).join(' ');
  const done = () => {
    if (live) setState('review');
    else if (now === 'review') { setState('sent'); onSend?.(text()); }
  };
  const again = () => { setCount(0); setFixes({}); setMenuOpen(false); samples.current = []; onRecordAgain?.(); setState('listening'); };

  return (
    <div data-dm="" ref={root} className={cx('dm-vcx dm-panel', now === 'paused' && 'dm-paused', !live && 'dm-done', held && 'dm-held', className)} style={held ? { minHeight: held } : undefined}>
      <div className="dm-vcx-top">
        <span className="dm-vcx-dot" />
        <Swap className="dm-vcx-st">{status ?? STATUS[now]}</Swap>
        <span className="dm-vcx-t dm-num dm-muted">{clock(seconds ?? count)}</span>
      </div>
      <canvas ref={wave} className="dm-vcx-wave" aria-hidden="true" />
      <p className="dm-vcx-tx" aria-live="polite">
        {now !== 'cancelled' && words.map((w, i) => {
          const word = typeof w === 'string' ? { text: w } : w;
          if (!word.alternatives?.length) return <span key={i} className="dm-w">{word.text} </span>;
          const fixed = fixes[i] !== undefined;
          const low = (
            <span className={cx('dm-low', fixed && 'dm-fixed')} role="button" tabIndex={0} aria-haspopup="menu" aria-expanded={menuOpen && menu.index === i} data-i={i}
              onClick={e => show(i, e.currentTarget)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); keyOpen.current = true; show(i, e.currentTarget); } }}>
              {fixes[i] ?? word.text}
            </span>
          );
          // once recording stops, each unsure word says why it is marked; the tip steps aside while its menu is open
          return <span key={i} className="dm-w">{!live && !menuOpen ? <Tip label={fixed ? 'Fixed' : 'Not sure about this word'}>{low}</Tip> : low} </span>;
        })}
      </p>
      <div className="dm-vcx-acts">
        {ended ? (
          <>
            <span className="dm-muted" style={{ fontSize: 12.5 }}>{now === 'sent' ? 'Sent to the agent' : 'Nothing was sent'}</span>
            <span className="dm-sp" />
            <button type="button" className="dm-pill dm-ghost dm-sm dm-vcx-again" onClick={again}><Icon name="refresh" size="xs" />Record again</button>
          </>
        ) : (
          <>
            {live && (
              <Tip label={now === 'paused' ? 'Resume' : 'Pause'}>
                <button type="button" className="dm-ib dm-fill dm-vcx-pause" aria-label={now === 'paused' ? 'Resume' : 'Pause'} onClick={() => setState(now === 'paused' ? 'listening' : 'paused')}>
                  <Icon name={now === 'paused' ? 'mic' : 'pause'} />
                </button>
              </Tip>
            )}
            <span className="dm-sp" />
            <button type="button" className="dm-pill dm-ghost dm-sm dm-vcx-x" onClick={() => { setMenuOpen(false); setState('cancelled'); }}>Cancel</button>
            <button type="button" className="dm-pill dm-primary dm-sm dm-vcx-done" onClick={done}>Done</button>
          </>
        )}
      </div>
      <div ref={pop} className={cx('dm-pop dm-vcx-fix', menuOpen && 'dm-open')} role="menu" aria-label="Did you mean" style={menu.style} inert={!menuOpen} aria-hidden={!menuOpen}
        onKeyDown={menuKey} onFocus={() => { inMenu.current = true; }} onBlur={e => { if (!pop.current?.contains(e.relatedTarget as Node)) inMenu.current = false; }}>
        <div className="dm-ph">Did you mean</div>
        {menu.alts.map(a => <button type="button" key={a} role="menuitem" tabIndex={-1} className="dm-mi" onClick={() => fix(menu.index, a)}>{a}</button>)}
      </div>
    </div>
  );
}
