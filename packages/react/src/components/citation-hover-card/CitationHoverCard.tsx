'use client';
import { Fragment, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Icon } from '../../lib/icons';
import '../../designme.css';
import './citation-hover-card.css';

export interface CitationHoverCardSource {
  /** One or two letters on the source's coloured mark, like "B" */
  mark: string;
  /** The mark's colour, like '#4a5a8a' or 'var(--dm-pm)' */
  color: string;
  /** Where it comes from, like "baymard.com" or "Drive" */
  site: string;
  title: string;
  /** The passage the answer relies on. Wrap the part that matters in <mark> */
  quote: ReactNode;
  /** The quiet line in the corner, like "Read 4 days ago" */
  meta?: string;
  /** Opens in a new tab from the card's link */
  href?: string;
}

export interface CitationHoverCardProps {
  /** The answer. [n] cites source n; a blank line starts a new paragraph */
  text: string;
  sources: CitationHoverCardSource[];
  /** The link in the card's corner */
  openLabel?: string;
  /** Called when the card's link is clicked, with the source and its index */
  onOpenSource?: (source: CitationHoverCardSource, index: number) => void;
  /** Opens a source's card from outside (0 is the first source), or closes it with null. Hover, focus and taps still work */
  open?: number | null;
  /** Called when a card opens or closes, with the source's index, or null */
  onOpenChange?: (index: number | null) => void;
  className?: string;
}

interface Shown { i: number; x: number; y: number; n: number }

/** An answer with numbered citations. Hovering, focusing or tapping one shows its source in a small card underneath. */
export function CitationHoverCard({ text, sources, openLabel = 'Open source', onOpenSource, open: openAt, onOpenChange, className }: CitationHoverCardProps) {
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  // `at` is the open card; `last` keeps its content while it fades out
  const [at, setAt] = useState<Shown | null>(null);
  const [last, setLast] = useState(0);
  const cur = useRef<number | null>(null);
  const showT = useRef<ReturnType<typeof setTimeout>>(undefined), hideT = useRef<ReturnType<typeof setTimeout>>(undefined);
  // the first citation of each source, which a card opened from outside sits under
  const marks = useRef(new Map<number, HTMLButtonElement>());
  const told = useRef(onOpenChange);
  useEffect(() => { told.current = onOpenChange; });

  const show = (i: number, el: HTMLElement) => {
    clearTimeout(hideT.current); if (cur.current === i) return;
    const b = box.current, c = card.current; if (!b || !c) return;
    const br = b.getBoundingClientRect(), cr = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(cr.left - br.left - 24, br.width - c.offsetWidth));
    cur.current = i; setLast(i); told.current?.(i);
    // a new key restarts the entrance, so the card always rises in place instead of sliding across
    setAt(a => ({ i, x, y: cr.bottom - br.top + 8, n: (a?.n ?? 0) + 1 }));
  };
  const hide = (now = false) => {
    clearTimeout(hideT.current); clearTimeout(showT.current);
    const go = () => { if (cur.current !== null) told.current?.(null); cur.current = null; setAt(a => a && { ...a, i: -1 }); };
    if (now) go(); else hideT.current = setTimeout(go, 140);
  };

  useEffect(() => {
    const down = (e: PointerEvent) => { const t = e.target as Element; if (!card.current?.contains(t) && !t.closest?.('.dm-chx-c')) hide(true); };
    const resize = () => hide(true);
    document.addEventListener('pointerdown', down); addEventListener('resize', resize);
    return () => { document.removeEventListener('pointerdown', down); removeEventListener('resize', resize); clearTimeout(hideT.current); clearTimeout(showT.current); };
  }, []);

  // a card opened or closed from outside
  useEffect(() => {
    if (openAt === undefined) return;
    if (openAt === null) { if (cur.current !== null) hide(true); return; }
    const el = marks.current.get(openAt); if (el && cur.current !== openAt) show(openAt, el);
  }, [openAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const cite = (n: number, key: string) => {
    const i = n - 1;
    if (!sources[i]) return <Fragment key={key}>[{n}]</Fragment>;
    return (
      <button type="button" key={key} ref={el => { if (el && !marks.current.has(i)) marks.current.set(i, el); }} className={cx('dm-chx-c', at?.i === i && 'dm-on')} aria-label={`Source ${n}: ${sources[i].title}`}
        onPointerEnter={e => { const el = e.currentTarget; clearTimeout(showT.current); clearTimeout(hideT.current); showT.current = setTimeout(() => show(i, el), cur.current !== null ? 0 : 90); }}
        onPointerLeave={() => { clearTimeout(showT.current); hide(); }}
        onFocus={e => show(i, e.currentTarget)} onBlur={() => hide()}
        // touch has no hover: a tap shows the card, the next tap anywhere else hides it
        onClick={e => { if (cur.current !== i) show(i, e.currentTarget); }}>{n}</button>
    );
  };
  const paragraphs = text.split(/\n\s*\n/).map((p, k) => (
    <p key={k} className="dm-msg dm-chx-p">{p.split(/\[(\d+)\]/).map((part, j) => j % 2 ? cite(+part, k + '-' + j) : part)}</p>
  ));

  const s = sources[at && at.i >= 0 ? at.i : last];
  const open = !!at && at.i >= 0;
  const follow = (e: MouseEvent) => { if (!s?.href) e.preventDefault(); onOpenSource?.(s, sources.indexOf(s)); };
  return (
    <div data-dm="" ref={box} className={cx('dm-chx', className)}>
      {paragraphs}
      <div key={at?.n ?? 0} ref={card} className={cx('dm-chx-card dm-panel', open && 'dm-show')} role="dialog" aria-label="Source"
        style={at ? { left: at.x, top: at.y } : undefined}
        onPointerEnter={() => clearTimeout(hideT.current)} onPointerLeave={() => hide()}>
        {s && (
          <div className="dm-chx-in">
            <div className="dm-chx-sh"><span className="dm-fv" style={{ background: s.color }}>{s.mark}</span><span>{s.site}</span></div>
            <div className="dm-chx-t">{s.title}</div>
            <div className="dm-chx-q">{s.quote}</div>
            <div className="dm-chx-f">
              <span>{s.meta}</span>
              <a href={s.href ?? '#'} target={s.href ? '_blank' : undefined} rel="noreferrer" onClick={follow}>{openLabel} <Icon name="ext" size="xs" /></a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
