'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useReducedMotion, useSeconds } from '../../lib/hooks';
import { Swap } from '../../lib/motion';
import '../../designme.css';
import './thinking-states.css';

export type ThinkingVariant = 'orbit' | 'morph' | 'scan' | 'stream' | 'matrix' | 'stack';

export interface ThinkingStatesProps {
  /** Which indicator: dots circling a core, a shape that morphs, a line scanning skeleton text, tokens with a typed line,
      a twinkling dot grid or shuffling pages */
  variant?: ThinkingVariant;
  /** The status lines, like "Reading 3 files". With more than one, they take turns every `interval` unless `current` is set */
  steps?: string[];
  /** Index of the line to show. Leave it out to let the lines take turns by themselves */
  current?: number;
  /** Milliseconds each line shows for when they take turns by themselves */
  interval?: number;
  /** Seconds shown at the end of the line. Counts by itself when left out; false hides it */
  seconds?: number | false;
  className?: string;
}

type GridKind = 'orbit' | 'morph' | 'scan' | 'stream';
/* Orbit, Morph, Scan and Stream are drawn on a grid of dots, each at its own density (Orbit 5 by 5, Scan 6 by 6, Morph 7 by 7,
   Stream 6 by 3): which part each dot plays, and its place in the run as an animation delay */
const grid = (k: GridKind) => {
  const n = { orbit: 5, scan: 6, morph: 7, stream: 6 }[k], rows = k === 'stream' ? 3 : n, at = (x: number, y: number) => y * n + x;
  const cls: string[] = Array(n * rows).fill(''), dly: (number | null)[] = Array(n * rows).fill(null), pose = new Set<number>();
  const run = (order: number[], dur: number) => order.forEach((c, i) => { dly[c] = (i / order.length - 1) * dur; });
  if (k === 'orbit') {
    const ring: number[] = [];
    for (let x = 0; x < n; x++) ring.push(at(x, 0));
    for (let y = 1; y < n; y++) ring.push(at(n - 1, y));
    for (let x = n - 2; x >= 0; x--) ring.push(at(x, n - 1));
    for (let y = n - 2; y > 0; y--) ring.push(at(0, y));
    ring.forEach(c => { cls[c] = 'r'; }); run(ring, 1.6); cls[at(2, 2)] = 'c';
    [0, ring.length - 1, ring.length - 2].forEach(i => pose.add(ring[i]));
  } else if (k === 'scan') {
    const len = [6, 0, 5, 0, 3, 0];
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) { const c = at(x, y); cls[c] = x < len[y] ? 'l' : 'b'; dly[c] = (x / n - 1) * 1.6; if (x === 2) pose.add(c); }
  } else if (k === 'morph') {
    for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
      const rect = y >= 1 && y <= 5, circ = (x - 3) ** 2 + (y - 3) ** 2 <= 10, tri = Math.abs(x - 3) <= y / 2;
      const c = at(x, y); cls[c] = 'm' + ((rect ? 1 : 0) | (circ ? 2 : 0) | (tri ? 4 : 0)); if (circ) pose.add(c);
      dly[c] = -(((c * 37 + 11) % 17) / 17) * .32;
    }
  } else {
    for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++) { const c = at(x, y); cls[c] = 's' + c; if (y < 2) pose.add(c); }
  }
  return cls.map((x, c) => ({ cls: [x, pose.has(c) && 'p'].filter(Boolean).map(y => 'dm-' + y).join(' '), delay: dly[c] }));
};
const GRIDS = { orbit: grid('orbit'), morph: grid('morph'), scan: grid('scan'), stream: grid('stream') };
const Dots = ({ k }: { k: GridKind }) => (
  <span className="dm-ths-dg" data-k={k}>{GRIDS[k].map((d, i) => <i key={i} className={d.cls} style={d.delay != null ? { animationDelay: d.delay.toFixed(3) + 's' } : undefined} />)}</span>
);

const Mark = ({ variant }: { variant: ThinkingVariant }) => {
  switch (variant) {
    case 'morph': case 'scan': case 'stream': return <Dots k={variant} />;
    case 'matrix': return <span className="dm-ths-mtx">{Array.from({ length: 16 }, (_, i) => <i key={i} />)}</span>;
    case 'stack': return <span className="dm-ths-stk"><i /><i /><i /></span>;
    default: return <Dots k="orbit" />;
  }
};

/** Six thinking indicators to pick from, each a small mark beside a status line that steps through what the agent is doing. */
export function ThinkingStates({ variant = 'orbit', steps = ['Thinking'], current, interval = 2600, seconds, className }: ThinkingStatesProps) {
  const reduce = useReducedMotion();
  const [auto, setAuto] = useState(0);
  useEffect(() => {
    if (current !== undefined || steps.length < 2) return;
    const id = setInterval(() => setAuto(i => (i + 1) % steps.length), interval);
    return () => clearInterval(id);
  }, [current, steps.length, interval]);
  const text = steps[Math.max(0, Math.min(current ?? auto, steps.length - 1))] ?? '';
  const counted = useSeconds(seconds === undefined);
  const secs = seconds === false ? null : seconds ?? counted;
  // Stream types each new line out behind its caret; switching to Stream mid-line shows the line whole
  const stream = variant === 'stream';
  const [typed, setTyped] = useState(text.length);
  const last = useRef(text);
  useEffect(() => {
    const fresh = last.current !== text; last.current = text;
    if (!stream || reduce || !fresh) { setTyped(text.length); return; }
    let n = 0; setTyped(0);
    const id = setInterval(() => { n++; setTyped(n); if (n >= text.length) clearInterval(id); }, 32);
    return () => clearInterval(id);
  }, [text, stream, reduce]);
  return (
    <div data-dm="" data-v={variant} className={cx('dm-ths', className)}>
      <div className="dm-ths-row">
        <span className="dm-ths-mk" aria-hidden="true"><Mark variant={variant} /></span>
        <span className="dm-ths-l" aria-hidden="true">
          {stream ? <span className="dm-ths-tx">{text.slice(0, typed)}</span> : <Swap className={cx('dm-ths-tx', variant === 'orbit' && 'dm-shim')}>{text}</Swap>}
          {stream && <span className="dm-ths-car" />}
        </span>
        {secs !== null && <span className="dm-ths-t dm-num" aria-hidden="true">{secs}s</span>}
      </div>
      {/* a screen reader hears each new line once, never the letters as they type */}
      <span className="dm-ths-sr" role="status" aria-live="polite">{text}</span>
    </div>
  );
}
