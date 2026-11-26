'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useCopied, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap, SwapIcon, Tip } from '../../lib/motion';
import '../../designme.css';
import './response-versions.css';

export interface ResponseVersionsProps {
  /** The person's message the answer replies to, shown as a bubble above it */
  prompt?: ReactNode;
  /** Every version of the answer so far, oldest first */
  versions: string[];
  /** Which version is showing. Leave it out to let the arrows page through them */
  version?: number;
  defaultVersion?: number;
  onVersionChange?: (index: number) => void;
  /** The version showing is still being written. New words fade in as they arrive and paging waits */
  streaming?: boolean;
  /** Quiet text beside the buttons, like "Writing a new version". It shimmers while streaming */
  status?: string;
  /** Called by the regenerate button. Add a version and show it to answer it */
  onRegenerate?: () => void;
  /** Called with the text after it is copied to the clipboard */
  onCopy?: (text: string) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

/** An answer with its earlier versions a click away, plus regenerate and copy. */
export function ResponseVersions({ prompt, versions, version, defaultVersion = 0, onVersionChange, streaming = false, status = '', onRegenerate, onCopy, bare = true, className }: ResponseVersionsProps) {
  const [cur, setCur] = useControllable(version, defaultVersion, onVersionChange);
  const reduce = useReducedMotion();
  const last = Math.max(0, versions.length - 1), at = Math.min(Math.max(cur, 0), last);

  // a different version fades the old text out first; then a finished one comes in all at once, word by word,
  // and one still being written shows its words as they arrive
  const [shown, setShown] = useState(at);
  const [out, setOut] = useState(false);
  const [jump, setJump] = useState(false);
  useEffect(() => {
    if (at === shown) return;
    setOut(true);
    const t = setTimeout(() => { setShown(at); setJump(!streaming); setOut(false); }, reduce ? 0 : 240);
    return () => clearTimeout(t);
  }, [at, shown, streaming, reduce]);
  const text = versions[shown] ?? '';
  const words = text.split(' ').filter(Boolean);
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
    if (prevT.current.at !== -1 && prevT.current.at !== shown && prevT.current.h && streaming) el.style.minHeight = prevT.current.h + 'px';
    prevT.current = { at: shown, h: el.style.minHeight ? prevT.current.h : (el.textContent?.trim() ? el.offsetHeight : 0) };
  });
  useEffect(() => {
    const el = tRef.current; if (!el || streaming || !el.style.minHeight) return;
    const was = el.offsetHeight; el.style.minHeight = ''; const h = el.offsetHeight;
    if (h >= was || reduce) return;
    el.style.minHeight = was + 'px'; void el.offsetHeight; el.style.transition = 'min-height var(--dm-t) var(--dm-ease)'; el.style.minHeight = h + 'px';
    const t = setTimeout(() => { el.style.transition = ''; el.style.minHeight = ''; }, 460);
    return () => clearTimeout(t);
  }, [streaming, shown, reduce]);

  const [spin, setSpin] = useState(false);
  const regenerate = () => {
    if (streaming) return;
    setSpin(true); setTimeout(() => setSpin(false), 700);
    onRegenerate?.();
  };
  const [copied, copyText] = useCopied();
  const copy = () => { const t = versions[at] ?? ''; copyText(t); onCopy?.(t); };

  return (
    <div data-dm="" ref={root} className={cx('dm-rvx', !bare && 'dm-panel', 'dm-growing dm-mx-grow', className)} style={bare ? undefined : { padding: 16 }}>
      <div ref={inner} className="dm-grow">
      {prompt && <div className="dm-bub">{prompt}</div>}
      <div className="dm-rvx-a">
        <p ref={tRef} className={cx('dm-msg dm-rvx-t', out && 'dm-out')} aria-live="polite">
          {words.map((w, k) => <span key={shown + ':' + k} className="dm-w" style={jump ? { animationDelay: k * 12 + 'ms' } : undefined}>{w} </span>)}
        </p>
        <div className="dm-rvx-bar dm-mx-ic">
          <div className="dm-rvx-pg">
            <Tip label="Previous"><button type="button" className="dm-ib dm-mx-press" aria-label="Previous version" disabled={at === 0 || streaming} onClick={() => setCur(at - 1)}><Icon name="chev-l" /></button></Tip>
            <span className="dm-rvx-n dm-num">{at + 1} / {Math.max(versions.length, 1)}</span>
            <Tip label="Next"><button type="button" className="dm-ib dm-mx-press" aria-label="Next version" disabled={at === last || streaming} onClick={() => setCur(at + 1)}><Icon name="chev-r" /></button></Tip>
          </div>
          {onRegenerate && <Tip label="Regenerate" kbd="⌘R"><button type="button" className={cx('dm-ib dm-rvx-re dm-mx-press', spin && 'dm-go')} aria-label="Regenerate" onClick={regenerate}><Icon name="refresh" /></button></Tip>}
          <Tip label={copied ? 'Copied to clipboard' : 'Copy'} open={copied || undefined}><button type="button" className={cx('dm-ib dm-rvx-cp dm-mx-press', copied && 'dm-copied')} aria-label="Copy" onClick={copy}><SwapIcon id={copied ? 'check' : 'copy'}><Icon name={copied ? 'check' : 'copy'} /></SwapIcon></button></Tip>
          <Swap className={cx('dm-rvx-st dm-muted', streaming && status && 'dm-shim')}>{status}</Swap>
        </div>
      </div>
      </div>
    </div>
  );
}
