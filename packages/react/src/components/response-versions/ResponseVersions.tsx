'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useCopied, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
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

  const [spin, setSpin] = useState(false);
  const regenerate = () => {
    if (streaming) return;
    setSpin(true); setTimeout(() => setSpin(false), 700);
    onRegenerate?.();
  };
  const [copied, copyText] = useCopied();
  const copy = () => { const t = versions[at] ?? ''; copyText(t); onCopy?.(t); };

  return (
    <div data-dm="" className={cx('dm-rvx', !bare && 'dm-panel', className)} style={bare ? undefined : { padding: 16 }}>
      {prompt && <div className="dm-bub">{prompt}</div>}
      <div className="dm-rvx-a">
        <p className={cx('dm-msg dm-rvx-t', out && 'dm-out')} aria-live="polite">
          {words.map((w, k) => <span key={shown + ':' + k} className="dm-w" style={jump ? { animationDelay: k * 12 + 'ms' } : undefined}>{w} </span>)}
        </p>
        <div className="dm-rvx-bar">
          <div className="dm-rvx-pg">
            <Tip label="Previous"><button type="button" className="dm-ib" aria-label="Previous version" disabled={at === 0 || streaming} onClick={() => setCur(at - 1)}><Icon name="chev-l" /></button></Tip>
            <span className="dm-rvx-n dm-num">{at + 1} / {Math.max(versions.length, 1)}</span>
            <Tip label="Next"><button type="button" className="dm-ib" aria-label="Next version" disabled={at === last || streaming} onClick={() => setCur(at + 1)}><Icon name="chev-r" /></button></Tip>
          </div>
          {onRegenerate && <Tip label="Regenerate" kbd="⌘R"><button type="button" className={cx('dm-ib dm-rvx-re', spin && 'dm-go')} aria-label="Regenerate" onClick={regenerate}><Icon name="refresh" /></button></Tip>}
          <Tip label={copied ? 'Copied to clipboard' : 'Copy'} open={copied || undefined}><button type="button" className={cx('dm-ib', copied && 'dm-copied')} aria-label="Copy" onClick={copy}><Icon name={copied ? 'check' : 'copy'} /></button></Tip>
          <Swap className={cx('dm-rvx-st dm-muted', streaming && status && 'dm-shim')}>{status}</Swap>
        </div>
      </div>
    </div>
  );
}
