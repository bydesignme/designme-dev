'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './slider.css';

interface TrackProps {
  min: number; max: number; step: number; big: number; values: number[]; onChange: (v: number[]) => void;
  format: (v: number, i: number) => string; valueText: (v: number, i: number) => string; labels: string[]; labelledBy?: string;
  recommended?: { value: number; label?: string }; snap: number; gliding: boolean; setGliding: (on: boolean) => void;
}
const fix = (x: number) => +x.toFixed(4);

/* one track: knobs you drag or move with the keys, the value over the knob while it moves, the covered part in the accent */
function Track({ min, max, step, big, values, onChange, format, valueText, labels, labelledBy, recommended, snap, gliding, setGliding }: TrackProps) {
  const ref = useRef<HTMLDivElement>(null);
  const knobs = useRef<(HTMLSpanElement | null)[]>([]);
  const [drag, setDrag] = useState(false);
  const [active, setActive] = useState(0);
  const [say, setSay] = useState(false);
  // a press never shows the focus ring; the keys bring it back
  const [ptr, setPtr] = useState(false);
  // the knob leans into the way it moves and rights itself once the pointer rests (not with reduced motion)
  const last = useRef({ x: 0, t: 0 });
  const rest = useRef<ReturnType<typeof setTimeout>>(undefined);
  const body = (i: number) => knobs.current[i]?.querySelector<HTMLElement>('.dm-sdx-kb') ?? null;
  const still = () => typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const lean = (i: number, deg: number) => body(i)?.style.setProperty('--dm-tilt', deg.toFixed(1) + 'deg');
  useEffect(() => () => clearTimeout(rest.current), []);
  const sayT = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(sayT.current), []);
  const pct = (x: number) => (x - min) / (max - min) * 100;
  const two = values.length > 1;
  const clamp = (i: number, x: number) => { let lo = min, hi = max; if (two) { if (i === 0) hi = values[1] - step; else lo = values[0] + step; } return Math.max(lo, Math.min(hi, x)); };
  const set = (i: number, x: number, near = false) => {
    let v = clamp(i, Math.round((x - min) / step) * step + min), hit = false;
    if (near && recommended && Math.abs(v - recommended.value) <= snap) { v = recommended.value; hit = true; }
    if (fix(v) === fix(values[i])) return;
    const next = values.slice(); next[i] = fix(v); onChange(next);
    // a little hop when it snaps onto the agent's mark
    if (hit && drag && !still()) body(i)?.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(1.38)', offset: .35 }, { transform: 'scale(1.2)' }], { duration: 320, easing: 'cubic-bezier(.34,1.56,.64,1)' });
  };
  const flash = (i: number) => { setActive(i); setSay(true); clearTimeout(sayT.current); sayT.current = setTimeout(() => setSay(false), 1200); };
  const at = (clientX: number) => { const b = ref.current!.getBoundingClientRect(); return min + (max - min) * Math.max(0, Math.min(1, (clientX - b.left) / b.width)); };
  const down = (e: React.PointerEvent<HTMLDivElement>) => {
    if ((e.target as Element).closest('.dm-sdx-rec') || e.button) return;
    const x = at(e.clientX);
    const i = two ? (Math.abs(x - values[0]) < Math.abs(x - values[1]) || x < values[0] ? 0 : 1) : 0;
    e.preventDefault(); setGliding(false); setActive(i); setDrag(true); setPtr(true); e.currentTarget.setPointerCapture(e.pointerId);
    last.current = { x: e.clientX, t: e.timeStamp };
    knobs.current[i]?.focus({ preventScroll: true, focusVisible: false } as FocusOptions); set(i, x, true);
  };
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag) return;
    set(active, at(e.clientX), true);
    if (still()) return;
    const dt = Math.max(8, e.timeStamp - last.current.t), vx = (e.clientX - last.current.x) / dt; last.current = { x: e.clientX, t: e.timeStamp };
    lean(active, Math.max(-16, Math.min(16, vx * 14))); clearTimeout(rest.current); rest.current = setTimeout(() => lean(active, 0), 90);
  };
  // let go, it drops back with a bounce
  const up = () => {
    if (!drag) return;
    setDrag(false); clearTimeout(rest.current); lean(active, 0);
    if (!still()) body(active)?.animate([{ transform: 'scale(1.2)' }, { transform: 'scale(.9)', offset: .4 }, { transform: 'scale(1.05)', offset: .7 }, { transform: 'scale(1)' }], { duration: 480, easing: 'ease-out' });
  };
  const key = (i: number) => (e: React.KeyboardEvent) => {
    setPtr(false);
    const bigStep = step * big;
    const d = ({ ArrowRight: step, ArrowUp: step, ArrowLeft: -step, ArrowDown: -step, PageUp: bigStep, PageDown: -bigStep } as Record<string, number>)[e.key];
    if (d != null) { e.preventDefault(); set(i, values[i] + (e.shiftKey && e.key.startsWith('Arrow') ? Math.sign(d) * bigStep : d)); flash(i); }
    else if (e.key === 'Home' || e.key === 'End') { e.preventDefault(); set(i, e.key === 'Home' ? -Infinity : Infinity); flash(i); }
  };
  return (
    <div ref={ref} className={cx('dm-sdx-tr', drag && 'dm-drag', gliding && 'dm-glide')} onPointerDown={down}
      onPointerMove={move} onPointerUp={up} onPointerCancel={up}>
      <span className="dm-sdx-rail">
        <i className="dm-sdx-fill" style={{ left: two ? pct(values[0]) + '%' : 0, width: (two ? pct(values[1]) - pct(values[0]) : pct(values[0])) + '%' }} />
        {recommended && <i className="dm-sdx-notch" style={{ left: `calc(10px + (100% - 20px) * ${pct(recommended.value) / 100})` }} />}
      </span>
      {recommended && <Tip label={recommended.label ?? `Recommended by the agent: ${format(recommended.value, 0)}`}>
        <button type="button" className="dm-sdx-rec" style={{ left: pct(recommended.value) + '%' }} aria-label="Use the recommended value"
          onClick={() => { setGliding(true); set(0, recommended.value); flash(0); }}><Icon name="spark" size="xs" /></button>
      </Tip>}
      {values.map((v, i) => (
        <span key={i} ref={el => { knobs.current[i] = el; }} className={cx('dm-sdx-k', i === active && 'dm-on', i === active && say && 'dm-say', ptr && 'dm-ptr')} role="slider" tabIndex={0}
          aria-label={labelledBy ? undefined : labels[i]} aria-labelledby={labelledBy} aria-valuemin={two && i ? fix(values[0] + step) : min} aria-valuemax={two && !i ? fix(values[1] - step) : max}
          aria-valuenow={fix(v)} aria-valuetext={valueText(v, i)} style={{ left: pct(v) + '%' }} onKeyDown={key(i)}>
          <i className="dm-sdx-kb" />
          <span className="dm-sdx-tt dm-num">{format(v, i)}</span>
        </span>
      ))}
    </div>
  );
}

const useGlide = () => {
  const [on, setOn] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return [on, (v: boolean) => { setOn(v); clearTimeout(t.current); if (v) t.current = setTimeout(() => setOn(false), 500); }] as const;
};

export interface SliderStop { value: number; label: string }

export interface SliderProps {
  /** Like "Creativity" */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  /** Steps that Shift with an arrow, Page Up and Page Down move by (10) */
  bigStep?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** How the value reads over the knob and in the header, like "0.40" or "30 calls" */
  format?: (value: number) => string;
  /** Names for ranges of the value, like Precise to Creative: the nearest one shows beside the value and is spoken with it */
  names?: string[];
  /** Buttons under the track that move the knob to a value */
  stops?: SliderStop[];
  /** A tick and a number under the track at each of these values (or at every step with `true`), each one a button */
  ticks?: boolean | number[];
  /** A value the agent recommends: a mark over the track you can press, and a knob dropped near it snaps to it */
  recommended?: { value: number; label?: string };
  /** A line under the slider that changes with it, like a sample sentence in the chosen tone */
  description?: string;
  className?: string;
}

/** A slider with named stops, ticks and an agent's recommended value. Arrows move a step, Shift or Page Up/Down ten, Home and End the ends. */
export function Slider({ label, min = 0, max = 100, step = 1, bigStep = 10, value, defaultValue = min, onValueChange, format = v => String(v), names, stops, ticks, recommended, description, className }: SliderProps) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const [gliding, setGliding] = useGlide();
  const id = useId();
  const name = (x: number) => names ? names[Math.min(names.length - 1, Math.round((x - min) / (max - min) * (names.length - 1)))] : '';
  const head = names ? `${name(v)}, ${format(v)}` : format(v);
  const tickVals = ticks === true ? Array.from({ length: Math.round((max - min) / step) + 1 }, (_, i) => fix(min + i * step)) : ticks || [];
  const go = (x: number) => { setGliding(true); setV(x); };
  return (
    <div data-dm="" className={cx('dm-sdx-b', className)}>
      <div className="dm-sdx-h"><span id={id}>{label}</span><span className="dm-sdx-v dm-num">{head}</span></div>
      <Track min={min} max={max} step={step} big={bigStep} values={[v]} onChange={n => setV(n[0])} format={format} labels={[label]} labelledBy={id}
        valueText={x => [format(x), name(x), recommended && Math.abs(x - recommended.value) < 1e-3 ? 'recommended' : ''].filter(Boolean).join(', ')}
        recommended={recommended} snap={(max - min) * .05} gliding={gliding} setGliding={setGliding} />
      {stops && <div className="dm-sdx-stops">{stops.map(s => <button type="button" key={s.value} aria-pressed={Math.abs(s.value - v) < 1e-3} onClick={() => go(s.value)}>{s.label}</button>)}</div>}
      {tickVals.length > 0 && <div className="dm-sdx-ticks dm-num">{tickVals.map(t => <button type="button" key={t} aria-pressed={Math.abs(t - v) < 1e-3} aria-label={`${format(t)}`} style={{ left: (t - min) / (max - min) * 100 + '%' }} onClick={() => go(t)}><i />{t}</button>)}</div>}
      {description != null && <p className="dm-sdx-sm" aria-live="polite"><Swap>{description}</Swap></p>}
    </div>
  );
}

export interface RangeSliderProps {
  /** Like "Cost per run" */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  bigStep?: number;
  value?: [number, number];
  defaultValue?: [number, number];
  onValueChange?: (value: [number, number]) => void;
  format?: (value: number) => string;
  /** What each knob is called for screen readers ("Lowest", "Highest") */
  thumbLabels?: [string, string];
  /** Shows `min` and `max` under the ends of the track */
  showEnds?: boolean;
  className?: string;
}

/** Two knobs on one track for a range. They stay at least a step apart, so they never cross. */
export function RangeSlider({ label, min = 0, max = 100, step = 1, bigStep = 10, value, defaultValue = [min, max], onValueChange, format = v => String(v), thumbLabels = ['Lowest', 'Highest'], showEnds = true, className }: RangeSliderProps) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const [gliding, setGliding] = useGlide();
  return (
    <div data-dm="" className={cx('dm-sdx-b', className)}>
      <div className="dm-sdx-h"><span>{label}</span><span className="dm-sdx-v dm-num">{format(v[0])} to {format(v[1])}</span></div>
      <Track min={min} max={max} step={step} big={bigStep} values={v} onChange={n => setV([n[0], n[1]])} format={format}
        labels={thumbLabels.map(t => `${t} ${label.toLowerCase()}`)} valueText={(x, i) => (i ? 'At most ' : 'At least ') + format(x)} snap={0} gliding={gliding} setGliding={setGliding} />
      {showEnds && <div className="dm-sdx-ends dm-muted dm-num"><span>{format(min)}</span><span>{format(max)}</span></div>}
    </div>
  );
}

/** The panel the sliders sit in on designme.dev, with a hairline between them */
export function SliderGroup({ children, className }: { children: ReactNode; className?: string }) {
  return <div data-dm="" className={cx('dm-sdx dm-panel', className)}>{children}</div>;
}
