'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useCopied, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './answer-action-bar.css';

export type AnswerBarRating = 'up' | 'down' | null;
export type ReadingState = 'idle' | 'playing' | 'paused';

/** One version of the answer */
export interface AnswerVersion {
  text: string;
  /** A phrase in the text that changed from the version before, like "21%, or $60 a year". It's highlighted */
  changed?: string;
  /** Quiet text after the bar, like "Sonnet 5.5 · 6.2s" */
  meta?: string;
  /** Its rating. Leave it out to let the thumbs hold their own, one per version */
  rating?: AnswerBarRating;
}

export interface AnswerActionBarProps {
  /** The person's message the answer replies to, shown as a bubble above it */
  question?: ReactNode;
  /** Every version of the answer so far, oldest first */
  versions: AnswerVersion[];
  /** Which version is showing. Leave it out to let the arrows page through them */
  version?: number;
  defaultVersion?: number;
  onVersionChange?: (index: number) => void;
  /** The newest version is still being written: new words fade in as they arrive, and paging and reading wait */
  streaming?: boolean;
  /** Called by the regenerate button. Add a version and show it to answer it */
  onRegenerate?: () => void;
  /** Called with the plain text after it is copied */
  onCopy?: (text: string) => void;
  /** Called when a thumb is pressed or pressed again to clear it */
  onRate?: (index: number, rating: AnswerBarRating) => void;
  /** The reasons a thumbs down offers. Defaults to Wrong numbers, Too long, Not our tone and Missed the brief */
  reasons?: string[];
  /** Called with the reason picked after a thumbs down */
  onReason?: (index: number, reason: string) => void;
  /** The quiet line under the bar, like "Writing a new version". It shimmers while streaming */
  status?: string;
  /** warn turns the status amber; ok gives it a green check */
  statusTone?: 'warn' | 'ok';
  /** Read aloud: playing lights each word in turn, paused keeps the place. Leave it out to let the button play and pause */
  reading?: ReadingState;
  defaultReading?: ReadingState;
  onReadingChange?: (state: ReadingState) => void;
  /** How long the built-in reading clock gives each word. Defaults to 0.28s */
  secondsPerWord?: number;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const REASONS = ['Wrong numbers', 'Too long', 'Not our tone', 'Missed the brief'];
const clock = (s: number) => Math.floor(s / 60) + ':' + String(Math.floor(s) % 60).padStart(2, '0');

/** Every action on an answer in one row under it: copy, regenerate with versions, thumbs with a reason, and read aloud. */
export function AnswerActionBar({
  question, versions, version, defaultVersion = 0, onVersionChange, streaming = false, onRegenerate, onCopy, onRate, reasons = REASONS, onReason,
  status = '', statusTone, reading, defaultReading = 'idle', onReadingChange, secondsPerWord = .28, bare = true, className
}: AnswerActionBarProps) {
  const [cur, setCur] = useControllable(version, defaultVersion, onVersionChange);
  const [read, setRead] = useControllable(reading, defaultReading, onReadingChange);
  const reduce = useReducedMotion();
  const last = Math.max(0, versions.length - 1), at = Math.min(Math.max(cur, 0), last), v = versions[at];
  const [own, setOwn] = useState<Record<number, AnswerBarRating>>({});
  const rating = v?.rating !== undefined ? v.rating : own[at] ?? null;
  const [asked, setAsked] = useState<Record<number, string>>({});
  const [copied, copyText] = useCopied();
  const [spin, setSpin] = useState(false);

  // the words, with the changed phrase marked
  const text = v?.text ?? '';
  const from = v?.changed ? text.indexOf(v.changed) : -1, to = from < 0 ? -1 : from + (v?.changed?.length ?? 0);
  let p = 0;
  const words = text.split(' ').filter(Boolean).map(w => { const a = text.indexOf(w, p); p = a + w.length; return { w, nw: from >= 0 && a < to && a + w.length > from }; });

  // reading: a place in words, lit one word at a time
  const [pos, setPos] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => { setPos(0); if (read !== 'idle') setRead('idle'); }, [at]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (read !== 'playing') return;
    timer.current = setInterval(() => setPos(x => x + .1 / secondsPerWord), 100);
    return () => clearInterval(timer.current);
  }, [read, secondsPerWord]);
  useEffect(() => { if (read === 'playing' && pos >= words.length) { setRead('idle'); setPos(0); } }, [pos, read, words.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const lit = read === 'idle' ? -1 : Math.min(words.length - 1, Math.floor(pos));

  const rate = (r: AnswerBarRating) => { const next = rating === r ? null : r; setOwn(o => ({ ...o, [at]: next })); onRate?.(at, next); if (next !== 'down') setAsked(a => ({ ...a, [at]: '' })); };
  const regenerate = () => { if (streaming) return; setRead('idle'); setPos(0); setSpin(true); setTimeout(() => setSpin(false), 700); onRegenerate?.(); };
  const copy = () => { copyText(text); onCopy?.(text); };
  const why = rating === 'down' && !asked[at];
  // the container grows with what it holds, eased (grow() on the site), and stays centred wherever it is centred, in every
  // style (owner, 18 Nov)
  const root = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const el = root.current, w = inner.current;
    if (!el || !w || typeof ResizeObserver === 'undefined') return;
    let first = true;
    const box = () => { const cs = getComputedStyle(el); return parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth); };
    const fit = () => {
      const h = Math.ceil(w.offsetHeight + box());
      if (first) { el.style.transition = 'none'; el.style.height = h + 'px'; void el.offsetHeight; el.style.transition = ''; first = false; }
      else el.style.height = h + 'px';
    };
    const ro = new ResizeObserver(fit); ro.observe(w); fit();
    return () => { ro.disconnect(); el.style.height = ''; };
  }, []);
  // while a new version streams in, the answer keeps the height of the one it replaces, then eases to its own
  const tRef = useRef<HTMLParagraphElement>(null), prevT = useRef({ at: -1, h: 0 });
  useIsoLayoutEffect(() => {
    const el = tRef.current; if (!el) return;
    if (prevT.current.at !== -1 && prevT.current.at !== at && prevT.current.h && streaming) el.style.minHeight = prevT.current.h + 'px';
    prevT.current = { at: at, h: el.style.minHeight ? prevT.current.h : (el.textContent?.trim() ? el.offsetHeight : 0) };
  });
  useEffect(() => {
    const el = tRef.current; if (!el || streaming || !el.style.minHeight) return;
    const was = el.offsetHeight; el.style.minHeight = ''; const h = el.offsetHeight;
    if (h >= was || reduce) return;
    el.style.minHeight = was + 'px'; void el.offsetHeight; el.style.transition = 'min-height var(--dm-t) var(--dm-ease)'; el.style.minHeight = h + 'px';
    const t = setTimeout(() => { el.style.transition = ''; el.style.minHeight = ''; }, 460);
    return () => clearTimeout(t);
  }, [streaming, at, reduce]);

  return (
    <div data-dm="" ref={root} className={cx('dm-aab', !bare && 'dm-panel', 'dm-growing', className)} style={bare ? undefined : { padding: 16 }}>
      <div ref={inner} className="dm-grow">
      {question && <div className="dm-bub">{question}</div>}
      <p ref={tRef} className="dm-msg dm-aab-t" aria-live="polite">
        {words.map(({ w, nw }, k) => (
          // inside the changed phrase the space is highlighted too, so the phrase reads as one
          <span key={at + ':' + k}>{k ? <span className={nw && words[k - 1].nw ? 'dm-nw' : undefined}> </span> : null}<span className={cx('dm-w dm-in', nw && 'dm-nw', k === lit && 'dm-rd')} style={!streaming && !reduce ? { animationDelay: k * 10 + 'ms' } : undefined}>{w}</span></span>
        ))}
      </p>
      <div className="dm-aab-row">
        <div className="dm-aab-bar" role="toolbar" aria-label="Answer actions" onKeyDown={e => {
          // Left and Right move between the toolbar's buttons, skipping any that are switched off
          const k = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key]; if (!k) return;
          const bs = [...e.currentTarget.querySelectorAll('button')].filter(b => !b.disabled && !b.closest('[inert]')), i = bs.indexOf(document.activeElement as HTMLButtonElement);
          if (i < 0) return; e.preventDefault(); bs[(i + k + bs.length) % bs.length].focus();
        }}>
          <Tip label={copied ? 'Copied to clipboard' : 'Copy'} open={copied || undefined}><button type="button" className={cx('dm-ib dm-aab-cp', copied && 'dm-copied')} aria-label="Copy" onClick={copy}><Icon name={copied ? 'check' : 'copy'} /></button></Tip>
          {onRegenerate && <Tip label="Regenerate"><button type="button" className={cx('dm-ib dm-aab-re', spin && 'dm-go')} aria-label="Regenerate" disabled={streaming} onClick={regenerate}><Icon name="refresh" /></button></Tip>}
          <span className={cx('dm-aab-pg', versions.length > 1 && 'dm-on')} inert={versions.length < 2}>
            <Tip label="Previous version"><button type="button" className="dm-ib" aria-label="Previous version" disabled={at === 0 || streaming} onClick={() => setCur(at - 1)}><Icon name="chev-l" size="xs" /></button></Tip>
            <span className="dm-aab-n dm-num" aria-live="polite">{at + 1} / {Math.max(versions.length, 1)}</span>
            <Tip label="Next version"><button type="button" className="dm-ib" aria-label="Next version" disabled={at === last || streaming} onClick={() => setCur(at + 1)}><Icon name="chev-r" size="xs" /></button></Tip>
          </span>
          <span className="dm-aab-sep" aria-hidden="true" />
          <Tip label="Good answer"><button type="button" className="dm-ib dm-aab-up" aria-label="Good answer" aria-pressed={rating === 'up'} onClick={() => rate('up')}><Icon name="up-thumb" /></button></Tip>
          <Tip label="Bad answer"><button type="button" className="dm-ib dm-aab-dn" aria-label="Bad answer" aria-pressed={rating === 'down'} onClick={() => rate('down')}><Icon name="down-thumb" /></button></Tip>
          <span className="dm-aab-sep" aria-hidden="true" />
          <Tip label={read === 'playing' ? 'Pause' : read === 'paused' ? 'Resume' : 'Read aloud'}>
            <button type="button" className={cx('dm-aab-rd', read !== 'idle' && 'dm-on', read === 'paused' && 'dm-paused')} aria-pressed={read === 'playing'}
              aria-label={read === 'playing' ? 'Pause reading' : read === 'paused' ? 'Resume reading' : 'Read aloud'} disabled={streaming || !words.length}
              onClick={() => setRead(read === 'playing' ? 'paused' : 'playing')}>
              <span className="dm-ic"><Icon name={read === 'playing' ? 'pause' : read === 'paused' ? 'play' : 'vol'} size="xs" /></span>
              <span className="dm-aab-pr" aria-hidden="true"><i style={{ width: Math.min(100, pos / Math.max(words.length, 1) * 100) + '%' }} /></span>
              <span className="dm-aab-tm dm-num">{clock(pos * secondsPerWord)} / {clock(words.length * secondsPerWord)}</span>
            </button>
          </Tip>
        </div>
        <Swap className="dm-aab-meta dm-muted dm-num">{v?.meta ?? ''}</Swap>
      </div>
      <Fold open={why} className="dm-aab-why">
        <div className="dm-aab-wy">
          <span className="dm-aab-wq">What was off?</span>
          <div className="dm-aab-ch">
            {reasons.map(r => <button key={r} type="button" className="dm-chip dm-sm" onClick={() => { setAsked(a => ({ ...a, [at]: r })); onReason?.(at, r); }}>{r}</button>)}
          </div>
        </div>
      </Fold>
      <p className={cx('dm-aab-st dm-muted', statusTone && 'dm-' + statusTone, !status && 'dm-off')} aria-live="polite">
        {statusTone === 'ok' && status ? <><Icon name="ok" size="xs" /><span key={status} {...enter()}>{status}</span></> : <Swap className={streaming && status ? 'dm-shim' : undefined}>{status}</Swap>}
      </p>
      </div>
    </div>
  );
}
