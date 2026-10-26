'use client';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap } from '../../lib/motion';
import '../../designme.css';
import './inline-text-diff.css';

export interface TextEdit {
  key: string;
  /** The words the copy has now, shown struck */
  from: string;
  /** The words the agent suggests instead */
  to: string;
  /** Why the agent isn't sure of this one. The edit is marked and the note shows above its buttons */
  note?: string;
}

/** A run of the copy as it stands, or one of the agent's edits to it */
export type TextPart = string | TextEdit;
export type EditDecision = 'accepted' | 'rejected';

export interface InlineTextDiffProps {
  /** What the copy is, like "Pricing intro" */
  title: string;
  /** The copy in order: plain strings, with the edits between them */
  parts: TextPart[];
  /** What was decided for each edit, by key. Leave an edit out while it waits */
  decisions?: Record<string, EditDecision>;
  defaultDecisions?: Record<string, EditDecision>;
  onDecisionsChange?: (decisions: Record<string, EditDecision>) => void;
  /** The line that replaces the buttons once every edit is decided, like "Saved to Pricing v4" */
  doneLabel?: string;
  labels?: { accept?: string; reject?: string; acceptAll?: string; rejectAll?: string };
  className?: string;
}

const isEdit = (p: TextPart): p is TextEdit => typeof p !== 'string';

/** The agent's edits to a piece of copy, struck and added inline. Each one opens a small toolbar to accept or reject it,
    and the header takes the rest all at once. */
export function InlineTextDiff({ title, parts, decisions, defaultDecisions = {}, onDecisionsChange, doneLabel = 'Every edit reviewed', labels = {}, className }: InlineTextDiffProps) {
  const [dec, setDec] = useControllable(decisions, defaultDecisions, onDecisionsChange);
  const [cur, setCur] = useState<string | null>(null);
  const [at, setAt] = useState({ left: 0, top: 0 });
  const root = useRef<HTMLDivElement>(null), bar = useRef<HTMLDivElement>(null);
  const chunks = useRef(new Map<string, HTMLSpanElement>());
  const L = { accept: 'Accept', reject: 'Reject', acceptAll: 'Accept all', rejectAll: 'Reject all', ...labels };
  const edits = parts.filter(isEdit);
  const left = edits.filter(e => !dec[e.key]).length, yes = edits.filter(e => dec[e.key] === 'accepted').length;
  const status = left === edits.length ? `${left} edits to review` : left ? `${left} of ${edits.length} left` : `${yes} accepted, ${edits.length - yes} rejected`;
  const open = edits.find(e => e.key === cur);
  // the toolbar keeps the last edit's note while it fades out
  const last = useRef<TextEdit | undefined>(undefined); if (open) last.current = open;
  // each decision folds an edit into plain text, and the last swaps the actions for a short note: from the first one the
  // card keeps the height it had with every edit open, and centres what is left in it
  const fresh = left === edits.length;
  const openHeight = useRef<number | undefined>(undefined);
  const [held, setHeld] = useState<number>();
  useLayoutEffect(() => { if (fresh && root.current) openHeight.current = root.current.offsetHeight; });
  useLayoutEffect(() => { setHeld(fresh ? undefined : openHeight.current); }, [fresh]);

  // the toolbar opens under the edit's last line; inside a scaled preview the offsets are divided by its scale
  useLayoutEffect(() => {
    const r = root.current, b = bar.current, el = cur ? chunks.current.get(cur) : null; if (!r || !b || !el) return;
    const rb = r.getBoundingClientRect(), k = rb.width / r.offsetWidth || 1, rs = el.getClientRects(), cr = rs[rs.length - 1] ?? el.getBoundingClientRect();
    setAt({ left: Math.max(12, Math.min((cr.left - rb.left) / k, r.offsetWidth - b.offsetWidth - 12)), top: (cr.bottom - rb.top) / k + 6 });
  }, [cur]);
  // Enter or Space opens an edit's toolbar with the focus on Accept, as a dialog takes the focus; Escape brings it back
  const keyOpen = useRef(false);
  useLayoutEffect(() => { if (cur && keyOpen.current) { keyOpen.current = false; bar.current?.querySelector<HTMLElement>('.dm-itd-acc')?.focus({ preventScroll: true }); } }, [cur]);
  // a click anywhere else closes it
  useEffect(() => {
    if (!cur) return;
    const down = (e: PointerEvent) => { const t = e.target as Element; if (!bar.current?.contains(t) && !t.closest?.('.dm-itd-c')) setCur(null); };
    document.addEventListener('pointerdown', down);
    return () => document.removeEventListener('pointerdown', down);
  }, [cur]);

  const decide = (s: EditDecision) => {
    if (!cur) return;
    const back = bar.current?.contains(document.activeElement), el = chunks.current.get(cur);
    setDec({ ...dec, [cur]: s }); setCur(null);
    if (back) el?.focus({ preventScroll: true });
  };
  const all = (s: EditDecision) => { setCur(null); setDec({ ...Object.fromEntries(edits.filter(e => !dec[e.key]).map(e => [e.key, s])), ...dec }); };

  return (
    <div data-dm="" className={className} style={{ width: '100%' }}
      onKeyDown={e => { if (e.key === 'Escape' && cur) { const el = chunks.current.get(cur); setCur(null); el?.focus({ preventScroll: true }); } }}>
      <div ref={root} className={cx('dm-itd dm-panel', held && 'dm-held')} style={held ? { minHeight: held } : undefined}>
        <div className="dm-itd-h">
          <div className="dm-itd-ht"><b>{title}</b><Swap className="dm-muted dm-itd-st">{status}</Swap></div>
          {left > 0 && (
            <div className="dm-itd-a">
              <button type="button" className="dm-pill dm-ghost dm-sm dm-itd-no" onClick={() => all('rejected')}>{L.rejectAll}</button>
              <button type="button" className="dm-pill dm-primary dm-sm dm-itd-ok" onClick={() => all('accepted')}>{L.acceptAll}</button>
            </div>
          )}
        </div>
        <p className="dm-itd-t">
          {parts.map((p, i) => {
            if (!isEdit(p)) return <Fragment key={i}>{p}</Fragment>;
            const n = edits.indexOf(p), d = dec[p.key];
            return (
              <span key={p.key} ref={el => { if (el) chunks.current.set(p.key, el); else chunks.current.delete(p.key); }} data-edit={p.key}
                className={cx('dm-itd-c', p.note && 'dm-unsure', cur === p.key && 'dm-on', d === 'accepted' && 'dm-acc', d === 'rejected' && 'dm-rej')}
                role="button" tabIndex={0} aria-haspopup="dialog" aria-expanded={cur === p.key} aria-label={`Edit ${n + 1} of ${edits.length}: ${p.from}, suggested ${p.to}`}
                onClick={() => setCur(cur === p.key ? null : p.key)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); keyOpen.current = cur !== p.key; setCur(cur === p.key ? null : p.key); } }}>
                <del>{p.from}</del><ins>{p.to}</ins>
              </span>
            );
          })}
        </p>
        <p className="dm-itd-f dm-muted" aria-live="polite">
          {left === 0 && <span className="dm-enter" style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="ok" size="xs" /><span>{doneLabel}</span></span>}
        </p>
        <div ref={bar} className={cx('dm-itd-bar', open && 'dm-open')} role="dialog" aria-label="Edit" inert={!open} style={at}
          // the left and right arrows move between Accept and Reject
          onKeyDown={e => { const bs = Array.from(bar.current?.querySelectorAll<HTMLElement>('button') ?? []), j = bs.indexOf(document.activeElement as HTMLElement); if (j < 0) return;
            const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key], to = d ? bs[(j + d + bs.length) % bs.length] : e.key === 'Home' ? bs[0] : e.key === 'End' ? bs[bs.length - 1] : null;
            if (to) { e.preventDefault(); to.focus({ preventScroll: true }); } }}>
          {last.current?.note && <p className="dm-itd-why"><Icon name="alert" size="xs" /><span>{last.current.note}</span></p>}
          <div className="dm-itd-bb">
            <button type="button" className="dm-pill dm-primary dm-sm dm-itd-acc" onClick={() => decide('accepted')}><Icon name="check" size="xs" />{L.accept}</button>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-itd-rej" onClick={() => decide('rejected')}><Icon name="x" size="xs" />{L.reject}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
