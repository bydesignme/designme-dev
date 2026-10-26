'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './change-review.css';

export interface DiffLine {
  /** add and del lines are coloured; ctx lines are unchanged context */
  kind: 'add' | 'del' | 'ctx';
  /** The line number shown in the gutter */
  line: number;
  text: string;
}

export interface Hunk {
  /** Identifies the hunk in `decisions`. Defaults to "<file name>#<index>" */
  key?: string;
  /** What the change does, like "Use the shared button" */
  title: string;
  lines: DiffLine[];
}

export interface ChangedFile {
  /** Like "PricingCard.tsx". Its extension becomes the type label */
  name: string;
  /** Shown above the diff, like "src/PricingCard.tsx". Defaults to the name */
  path?: string;
  hunks: Hunk[];
}

export type HunkDecision = 'kept' | 'undone';

export interface LineComment {
  file: ChangedFile;
  hunk: Hunk;
  line: DiffLine;
  text: string;
}

export interface ChangeReviewProps {
  files: ChangedFile[];
  /** The file shown on the right, by index. Leave it out to let the list pick it */
  file?: number;
  defaultFile?: number;
  onFileChange?: (index: number) => void;
  /** Kept or undone, by hunk key. Leave it out to let the buttons keep track */
  decisions?: Record<string, HunkDecision>;
  defaultDecisions?: Record<string, HunkDecision>;
  onDecisionsChange?: (decisions: Record<string, HunkDecision>) => void;
  /** Called when the person asks the agent about a line. Without a question it sends "Why this change?" */
  onComment?: (comment: LineComment) => void;
  /** Header over the file list. Defaults to "N files changed" */
  title?: string;
  className?: string;
}

const keyOf = (f: ChangedFile, h: Hunk, k: number) => h.key ?? `${f.name}#${k}`;
const ext = (name: string) => name.split('.').pop() ?? '';

type Box = { draft: string; sent?: string };

/** A diff to review hunk by hunk: keep or undo each change, or ask the agent about a line. */
export function ChangeReview({ files, file, defaultFile = 0, onFileChange, decisions, defaultDecisions = {}, onDecisionsChange, onComment, title, className }: ChangeReviewProps) {
  const [cur, setCur] = useControllable(file, defaultFile, onFileChange);
  const [dec, setDec] = useControllable(decisions, defaultDecisions, onDecisionsChange);
  // the hunks play their entrance again when the file is shown afresh, as after Keep all
  const [shown, setShown] = useState(0);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const next = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(next.current), []);

  const at = Math.max(0, Math.min(files.length - 1, cur));
  const f = files[at] ?? { name: '', hunks: [] };
  let added = 0, removed = 0;
  files.forEach(x => x.hunks.forEach(h => h.lines.forEach(l => { if (l.kind === 'add') added++; if (l.kind === 'del') removed++; })));

  const show = (i: number) => { setCur(i); setShown(s => s + 1); };
  const decide = (key: string, s: HunkDecision) => { const d = { ...dec }; if (d[key] === s) delete d[key]; else d[key] = s; setDec(d); };
  const bulk = (s: HunkDecision) => {
    const d = { ...dec }; f.hunks.forEach((h, k) => { d[keyOf(f, h, k)] = s; }); setDec(d); setShown(n => n + 1);
    clearTimeout(next.current);
    if (s === 'kept' && at < files.length - 1) next.current = setTimeout(() => show(at + 1), 500);
  };

  const state = (x: ChangedFile) => {
    const all = (s: HunkDecision) => x.hunks.every((h, k) => dec[keyOf(x, h, k)] === s);
    if (all('kept')) return 'kept'; if (all('undone')) return 'undone';
    return x.hunks.some((h, k) => dec[keyOf(x, h, k)]) ? 'some' : '';
  };

  const box = (id: string, b: Box | null) => setBoxes(all => { const n = { ...all }; if (b) n[id] = b; else delete n[id]; return n; });
  const send = (id: string, h: Hunk, l: DiffLine) => {
    const text = boxes[id]?.draft.trim() || 'Why this change?';
    box(id, { draft: '', sent: text });
    onComment?.({ file: f, hunk: h, line: l, text });
  };

  return (
    <div data-dm="" className={cx('dm-crx dm-panel', className)}>
      <div className="dm-crx-side">
        <div className="dm-crx-sh">
          <b>{title ?? `${files.length} ${files.length === 1 ? 'file' : 'files'} changed`}</b>
          <span className="dm-muted dm-crx-tot dm-num"><span style={{ color: 'var(--dm-ok)' }}>+{added}</span> <span style={{ color: 'var(--dm-bad)' }}>−{removed}</span></span>
        </div>
        <div className="dm-crx-files">
          {files.map((x, i) => {
            const s = state(x), e = ext(x.name);
            return (
              <button key={x.name + i} type="button" className={cx('dm-crx-f', i === at && 'dm-on', s === 'kept' && 'dm-kept', s === 'undone' && 'dm-undone')} onClick={() => show(i)}>
                <span className={cx('dm-ft', e === 'tsx' && 'dm-re')}>{e.toUpperCase()}</span>
                <span className="dm-nm">{x.name}</span>
                <span className="dm-st">{s === 'kept' ? <Icon name="check" size="xs" /> : s === 'undone' ? <Icon name="undo" size="xs" /> : <span className="dm-dot" style={s === 'some' ? { color: 'var(--dm-accent)' } : undefined} />}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="dm-crx-main">
        <div className="dm-crx-mh">
          <Swap className="dm-crx-fn dm-num">{f.path ?? f.name}</Swap>
          <span className="dm-crx-sp" />
          <button type="button" className="dm-pill dm-ghost dm-sm dm-crx-rej" onClick={() => bulk('undone')}>Undo all</button>
          <button type="button" className="dm-pill dm-primary dm-sm dm-crx-ok" onClick={() => bulk('kept')}>Keep all</button>
        </div>
        <div className="dm-crx-diff" key={at + ':' + shown}>
          {f.hunks.map((h, k) => {
            const key = keyOf(f, h, k), s = dec[key] ?? '', e = enter(k * 70);
            return (
              <div key={key} className={cx('dm-crx-hk', s && 'dm-' + s, e.className)} style={e.style}>
                <div className="dm-crx-hh">
                  <Icon name="spark" size="xs" />
                  <span>{h.title}</span>
                  <span className="dm-sp" />
                  <button type="button" className="dm-pill dm-ghost dm-hk-u" onClick={() => decide(key, 'undone')}>Undo</button>
                  <button type="button" className="dm-pill dm-soft dm-hk-k" onClick={() => decide(key, 'kept')}>Keep</button>
                </div>
                {h.lines.map((l, j) => {
                  const id = `${at}:${k}:${j}`, b = boxes[id];
                  return [
                    <div key={id} className={cx('dm-crx-l', 'dm-' + l.kind)}>
                      <span className="dm-ln">{l.line}</span>
                      <span className="dm-c">{l.text}</span>
                      <Tip label="Comment">
                        <button type="button" className="dm-cm" aria-label="Comment on line" onClick={() => { if (!b) box(id, { draft: '' }); }}><Icon name="plus" size="xs" /></button>
                      </Tip>
                    </div>,
                    b && <Comment key={id + 'c'} box={b} onDraft={draft => box(id, { draft })} onSend={() => send(id, h, l)} onCancel={() => box(id, null)} />
                  ];
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Comment({ box, onDraft, onSend, onCancel }: { box: Box; onDraft: (v: string) => void; onSend: () => void; onCancel: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);
  const key = (e: KeyboardEvent) => { if (e.key === 'Enter') onSend(); if (e.key === 'Escape') onCancel(); };
  if (box.sent !== undefined) return <div key="sent" className="dm-crx-cmt dm-sent dm-enter"><Icon name="at" size="xs" /><span>{box.sent}</span></div>;
  return (
    <div key="draft" className="dm-crx-cmt dm-enter">
      <input ref={input} placeholder="Ask the agent about this line" aria-label="Ask the agent about this line" value={box.draft} onChange={e => onDraft(e.target.value)} onKeyDown={key} />
      <button type="button" className="dm-pill dm-accent dm-sm" onClick={onSend}>Send</button>
    </div>
  );
}
