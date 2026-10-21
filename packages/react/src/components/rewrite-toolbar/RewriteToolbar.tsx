'use client';
import { useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Swap, Think, Tip } from '../../lib/motion';
import '../../designme.css';
import './rewrite-toolbar.css';

/** A button in the toolbar, like Clearer or Shorter */
export interface RewriteAction {
  key: string;
  label: string;
  icon?: IconName;
}

/** What a ref to the toolbar can do: drive it from a shortcut, a command menu or a scripted demo */
export interface RewriteToolbarHandle {
  /** Rewrites the selected sentence with one of the actions, as a click on that action does */
  rewrite: (action: string) => void;
  /** Keeps the rewrite that is waiting for review */
  accept: () => void;
  /** Puts the sentence back as it was */
  undo: () => void;
}

export interface RewriteToolbarProps {
  /** The document's name */
  title: ReactNode;
  /** The file type tag in front of the name. Defaults to DOC */
  kind?: string;
  /** The text, one sentence each, so a click picks a sentence */
  sentences?: string[];
  defaultSentences?: string[];
  /** Called with every sentence once a rewrite is accepted */
  onSentencesChange?: (sentences: string[]) => void;
  /** Index of the sentence with the toolbar on it, or null. Leave it out to let clicks pick it */
  selected?: number | null;
  defaultSelected?: number | null;
  onSelectedChange?: (index: number | null) => void;
  /** Defaults to Clearer, Shorter and Friendlier */
  actions?: RewriteAction[];
  /** Writes the new sentence. While it works the toolbar says Rewriting; the answer is then written in word by word.
      If it throws, the sentence is left as it was */
  onRewrite: (sentence: string, action: string, index: number) => Promise<string> | string;
  /** The wand at the end of the toolbar. Left out, it rewrites with the first action */
  onAsk?: (sentence: string, index: number) => void;
  /** The tip on the wand */
  askLabel?: string;
  /** The shortcut shown in that tip */
  askShortcut?: string;
  ref?: Ref<RewriteToolbarHandle>;
  className?: string;
}

const ACTIONS: RewriteAction[] = [{ key: 'clear', label: 'Clearer', icon: 'spark' }, { key: 'short', label: 'Shorter' }, { key: 'warm', label: 'Friendlier' }];

type Job = { index: number; old: string; text?: string; shown: number };

/** Click a sentence and a small toolbar offers rewrites; the new text is written in beside the old one, to accept or undo. */
export function RewriteToolbar({
  title, kind = 'DOC', sentences, defaultSentences = [], onSentencesChange, selected, defaultSelected = null, onSelectedChange,
  actions = ACTIONS, onRewrite, onAsk, askLabel = 'Ask the agent', askShortcut = '⌘K', ref, className
}: RewriteToolbarProps) {
  const [text, setText] = useControllable(sentences, defaultSentences, onSentencesChange);
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const [job, setJob] = useState<Job | null>(null);
  const [status, setStatus] = useState('Click a sentence');
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const [at, setAt] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  const busy = job !== null;
  // the toolbar turns to Rewritten one beat after the last word, as the site does
  const phase = !busy ? 'menu' : job.text !== undefined && job.shown > words(job.text).length ? 'review' : 'working';
  // while the toolbar fades away it keeps what it last showed
  const [last, setLast] = useState(phase);
  if (sel !== null && phase !== last) setLast(phase);
  const view = sel !== null ? phase : last;

  // a new selection from outside says the same as a click does
  useEffect(() => { if (sel !== null && !busy) setStatus('Pick a rewrite'); }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps

  // the toolbar sits above the sentence's first line, or under its last when above would cover the header
  useIsoLayoutEffect(() => {
    const el = sel === null ? null : spans.current[sel], tb = bar.current, box = root.current;
    if (!el || !tb || !box) return;
    const br = box.getBoundingClientRect(), rects = el.getClientRects(), f = rects[0]; if (!f) return;
    const left = Math.max(8, Math.min(f.left - br.left, br.width - tb.offsetWidth - 8));
    let top = f.top - br.top - tb.offsetHeight - 8;
    if (top < (head.current ? head.current.getBoundingClientRect().bottom - br.top : 4)) top = rects[rects.length - 1].bottom - br.top + 8;
    setAt({ left, top });
  }, [sel, view]);

  // a click anywhere else puts the toolbar away, unless a rewrite is waiting on an answer
  const latest = useRef({ busy, setSel });
  useEffect(() => { latest.current = { busy, setSel }; });
  useEffect(() => {
    const down = (e: PointerEvent) => { const l = latest.current; if (!l.busy && !root.current?.contains(e.target as Node)) l.setSel(null); };
    document.addEventListener('pointerdown', down);
    return () => document.removeEventListener('pointerdown', down);
  }, []);

  // the answer is written in a word at a time
  useEffect(() => {
    if (!job?.text || job.shown > words(job.text).length) return;
    const t = setTimeout(() => setJob(j => j && { ...j, shown: reduce ? words(j.text!).length + 1 : j.shown + 1 }), job.shown === 0 ? 0 : 55);
    return () => clearTimeout(t);
  }, [job, reduce]);

  const pick = (i: number) => { if (busy) return; setSel(i); setStatus('Pick a rewrite'); };
  const rewrite = async (action: string) => {
    if (sel === null || busy) return;
    const index = sel, old = text[index];
    setJob({ index, old, shown: 0 });
    let out: string;
    // if the rewrite fails, the sentence goes back as it was and the toolbar offers the rewrites again
    try { out = await onRewrite(old, action, index); } catch { setJob(null); return; }
    setJob(j => j && j.index === index ? { ...j, text: out } : j);
  };
  const finish = (keep: boolean) => {
    if (!job?.text) return;
    if (keep) setText(text.map((s, i) => i === job.index ? job.text! : s));
    setJob(null); setSel(null); setStatus(keep ? 'Saved' : 'Click a sentence');
  };

  useImperativeHandle(ref, () => ({ rewrite, accept: () => finish(true), undo: () => finish(false) }));

  return (
    <div data-dm="" ref={root} className={cx('dm-rwx dm-panel', className)}>
      <div ref={head} className="dm-rwx-h"><span className="dm-ft">{kind}</span><span>{title}</span><Swap className="dm-muted dm-rwx-st">{status}</Swap></div>
      <div className="dm-rwx-doc">
        {text.map((s, i) => {
          const mine = job?.index === i;
          return (
            <span key={i}>
              {i > 0 && ' '}
              <span ref={el => { spans.current[i] = el; }} className={cx('dm-rwx-s', sel === i && 'dm-sel')} onClick={e => { e.stopPropagation(); if (!mine) pick(i); }}>
                {mine ? <><del>{job.old}</del> <ins>{job.text && words(job.text).slice(0, job.shown).map((w, k) => <span key={k} className="dm-w">{w} </span>)}</ins></> : s}
              </span>
            </span>
          );
        })}
      </div>
      <div ref={bar} className={cx('dm-rwx-tb', sel !== null && 'dm-show', view !== 'menu' && 'dm-act')} role="toolbar" aria-label="Rewrite" inert={sel === null} style={at}>
        {view === 'menu' ? (
          <>
            {actions.map(a => <button type="button" key={a.key} className="dm-rwx-b" onClick={() => rewrite(a.key)}>{a.icon && <Icon name={a.icon} size="xs" />}{a.label}</button>)}
            <span className="dm-rwx-sep" />
            <Tip label={askLabel} kbd={askShortcut}>
              <button type="button" className="dm-rwx-b dm-ic" aria-label={askLabel} onClick={() => (onAsk && sel !== null ? onAsk(text[sel], sel) : rewrite(actions[0].key))}><Icon name="wand" size="xs" /></button>
            </Tip>
          </>
        ) : view === 'working' ? (
          <span className="dm-lbl"><Think />Rewriting</span>
        ) : (
          <>
            <span className="dm-lbl"><Icon name="check" size="xs" />Rewritten</span>
            <button type="button" className="dm-rwx-b dm-rwx-un" onClick={() => finish(false)}>Undo</button>
            <button type="button" className="dm-pill dm-accent dm-sm dm-rwx-ok" onClick={() => finish(true)}>Accept</button>
          </>
        )}
      </div>
    </div>
  );
}

const words = (s: string) => s.split(' ');
