'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Dot, Radar, Spin, Think } from '../../lib/motion';
import '../../designme.css';
import './status-pill.css';

export type StatusPillState = 'idle' | 'thinking' | 'reading' | 'working' | 'waiting' | 'done';

export interface StatusPillProps {
  /** Picks the glyph and colour. thinking, reading and working shimmer while they run */
  state?: StatusPillState;
  /** What the agent is doing, in a few words */
  label: string;
  /** Quiet detail after the label, like "2 of 4". Changing only this does not restart the pill */
  meta?: string;
  /** A file chip after the label, like { name: 'PricingCard.tsx', type: 'tsx' } */
  file?: { name: string; type?: string };
  /** A button at the end, for when the agent needs the person */
  action?: { label: string; onClick: () => void };
  /** 0 to 100, drawn as a track along the bottom of the bar variant */
  progress?: number;
  /** pill hugs its content, bar is taller and leaves room for the progress track */
  variant?: 'pill' | 'bar';
  className?: string;
}

const LIVE: StatusPillState[] = ['thinking', 'reading', 'working'];
const FT: Record<string, string> = { tsx: 'dm-re', jsx: 'dm-re', csv: 'dm-csv', pdf: 'dm-pdf', fig: 'dm-fg' };

function Glyph({ state }: { state: StatusPillState }) {
  if (state === 'thinking') return <span className="dm-g" style={{ color: 'var(--dm-fg)' }}><Think /></span>;
  if (state === 'reading') return <span className="dm-g" style={{ color: 'var(--dm-fg)' }}><Radar /></span>;
  if (state === 'working') return <span className="dm-g" style={{ color: 'var(--dm-fg)' }}><Spin /></span>;
  if (state === 'waiting') return <span className="dm-g" style={{ color: 'var(--dm-warn-mark)' }}><Dot /></span>;
  if (state === 'done') return <span className="dm-g" style={{ color: 'var(--dm-ok)' }}><Icon name="ok" /></span>;
  return <span className="dm-g"><Dot color="var(--dm-faint)" /></span>;
}

/** One live line for what the agent is doing right now. It fades between states and resizes to fit them. */
export function StatusPill(props: StatusPillProps) {
  const { variant = 'pill', progress = 0, className } = props;
  const reduce = useReducedMotion();
  // a new state, label, file or action fades the old line out before the new one comes in;
  // changes to meta, progress or the action's handler show straight away
  const keyOf = (p: StatusPillProps) => [p.state ?? 'idle', p.label, p.file?.name ?? '', p.action?.label ?? ''].join('\u0000');
  const key = keyOf(props);
  const [prev, setPrev] = useState(props);
  const latest = useRef(props);
  useEffect(() => { latest.current = props; });
  const prevKey = keyOf(prev), fading = key !== prevKey;
  const view = fading ? prev : props, state = view.state ?? 'idle';
  useEffect(() => {
    if (!fading) return;
    const t = setTimeout(() => setPrev(latest.current), reduce ? 0 : 180);
    return () => clearTimeout(t);
  }, [key, prevKey, reduce]);

  // switching between pill and bar morphs in three beats, so the words and the shape never move at once: the line fades
  // out with its track, the shape changes while it's empty, then the new layout fades in with the track under it
  const [shape, setShape] = useState(variant);
  const [morphing, setMorphing] = useState(false);
  const shapeRef = useRef(variant);
  useEffect(() => {
    if (variant === shapeRef.current) return;
    if (reduce){ shapeRef.current = variant; setShape(variant); return; }
    setMorphing(true);
    const a = setTimeout(() => { shapeRef.current = variant; setShape(variant); }, 170);
    const b = setTimeout(() => setMorphing(false), 430);
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [variant, reduce]);

  // the pill always hugs its content; the bar keeps a little extra room for its track
  const box = useRef<HTMLDivElement>(null);
  const [width, setWidth] = useState<number>();
  useIsoLayoutEffect(() => {
    const el = box.current; if (!el) return;
    const fit = () => { el.style.width = 'max-content'; const w = el.scrollWidth; el.style.width = ''; setWidth(shape === 'bar' ? Math.max(w + 24, 300) : w); };
    fit();
    document.fonts?.ready.then(fit);
  }, [prevKey, shape, view.meta]);

  return (
    <div data-dm="" className={cx('dm-spl', shape === 'bar' && 'dm-bar', morphing && 'dm-mo', className)}>
      <div className="dm-spl-pill" style={{ width: width ?? (shape === 'bar' ? 300 : 'max-content') }} aria-live="polite">
        <div ref={box} className={cx('dm-spl-in', (fading || morphing) && 'dm-out')}>
          <Glyph state={state} />
          <span className={LIVE.includes(state) ? 'dm-shim' : state === 'idle' ? 'dm-fg2' : undefined}>{view.label}</span>
          {view.file && <span className="dm-fchip" style={{ height: 24 }}>{view.file.type && <span className={cx('dm-ft', FT[view.file.type])}>{view.file.type.toUpperCase()}</span>}{view.file.name}</span>}
          {view.meta && <span className="dm-m">{view.meta}</span>}
          {view.action
            ? <button type="button" className="dm-pill dm-primary dm-sm" onClick={() => props.action?.onClick()}>{view.action.label}</button>
            : <span className="dm-end" />}
        </div>
        <div className="dm-spl-track"><div className="dm-spl-fill" style={{ width: Math.max(0, Math.min(100, progress)) + '%' }} /></div>
      </div>
    </div>
  );
}
