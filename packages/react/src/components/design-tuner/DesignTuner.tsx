'use client';
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Swap, Think } from '../../lib/motion';
import '../../designme.css';
import './design-tuner.css';

export interface TunerParam {
  /** Names the value and the CSS variable it sets on the preview, `--dm-<key>` */
  key: string;
  /** Shown beside the slider, like "Radius" */
  label: string;
  min: number;
  max: number;
  /** Where the slider starts when you don't pass values */
  value: number;
  /** Added after whole numbers, like "px". Leave it out for plain numbers */
  unit?: string;
  /** Shows and sets the value with this many decimals instead of rounding it, like 2 for a shadow strength */
  decimals?: number;
}

export interface DesignTunerProps {
  /** The sliders. Defaults to radius, padding, spacing and shadow for the sample card */
  params?: TunerParam[];
  /** The value of each slider by key. Leave it out to let the sliders keep their own */
  values?: Record<string, number>;
  defaultValues?: Record<string, number>;
  onValuesChange?: (values: Record<string, number>) => void;
  /** What is being tuned, like "Pricing card" */
  title?: string;
  /** Quiet line beside the title, like "Edited by you" or "Agent is tuning" */
  status?: string;
  /** Key of the slider the agent is moving now; its value turns the accent colour */
  active?: string;
  /** The agent is tuning: the button thinks and stops taking clicks */
  tuning?: boolean;
  /** What the agent changed and why, shown above the button */
  note?: ReactNode;
  /** The button's label, like "Tune with agent" or "Tune again" */
  actionLabel?: string;
  onTune?: () => void;
  /** What the sliders change. Gets the values and a style with a `--dm-<key>` variable for each one.
      Defaults to the sample pricing card from designme.dev */
  preview?: (values: Record<string, number>, vars: CSSProperties) => ReactNode;
  className?: string;
}

const PARAMS: TunerParam[] = [
  { key: 'rad', label: 'Radius', min: 0, max: 28, value: 16, unit: 'px' },
  { key: 'pad', label: 'Padding', min: 8, max: 32, value: 18, unit: 'px' },
  { key: 'gap', label: 'Spacing', min: 4, max: 24, value: 12, unit: 'px' },
  { key: 'sh', label: 'Shadow', min: 0, max: .2, value: .08, decimals: 2 }
];

const clamp = (p: TunerParam, v: number) => Math.max(p.min, Math.min(p.max, v));
const shown = (p: TunerParam, v: number) => p.decimals ? v.toFixed(p.decimals) : Math.round(v) + (p.unit ?? '');
const cssValue = (p: TunerParam, v: number) => p.decimals ? String(+v.toFixed(p.decimals)) : Math.round(v) + (p.unit ?? '');

/** The sample the site tunes: a pricing card that reads --dm-rad, --dm-pad, --dm-gap and --dm-sh */
function SampleCard({ vars }: { vars: CSSProperties }) {
  return (
    <div className="dm-dtx-card" style={vars}>
      <span className="dm-tag dm-b dm-dtx-tg">Pro</span>
      <div className="dm-dtx-pr"><b className="dm-num">$24</b><span className="dm-muted">per editor, monthly</span></div>
      <div className="dm-dtx-li">{['Unlimited frames', 'Agent reviews', 'Shared tokens'].map(t => <span key={t}><Icon name="check" size="xs" />{t}</span>)}</div>
      <button type="button" className="dm-pill dm-accent dm-dtx-cta">Start free trial</button>
    </div>
  );
}

function Slider({ param, value, hot, onChange }: { param: TunerParam; value: number; hot: boolean; onChange: (v: number) => void }) {
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const pct = (value - param.min) / (param.max - param.min) * 100;
  const at = (e: PointerEvent) => { const b = ref.current!.getBoundingClientRect(); onChange(clamp(param, param.min + (param.max - param.min) * Math.max(0, Math.min(1, (e.clientX - b.left) / b.width)))); };
  const key = (e: KeyboardEvent) => {
    const dir = ({ ArrowRight: 1, ArrowUp: 1, ArrowLeft: -1, ArrowDown: -1 } as Record<string, number>)[e.key]; if (!dir) return;
    e.preventDefault(); onChange(clamp(param, value + dir * (param.decimals ? Math.pow(10, -param.decimals) : 1)));
  };
  return (
    <div className={cx('dm-dtx-r', hot && 'dm-hot')}>
      <span>{param.label}</span>
      <div ref={ref} className={cx('dm-dtx-sl', drag && 'dm-drag')} role="slider" tabIndex={0} aria-label={param.label}
        aria-valuemin={param.min} aria-valuemax={param.max} aria-valuenow={param.decimals ? +value.toFixed(param.decimals) : Math.round(value)} aria-valuetext={shown(param, value)}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setDrag(true); at(e); }}
        onPointerMove={e => { if (drag) at(e); }}
        onPointerUp={() => setDrag(false)} onPointerCancel={() => setDrag(false)} onKeyDown={key}>
        <span className="dm-f" style={{ width: pct + '%' }} /><span className="dm-k" style={{ left: pct + '%' }} />
      </div>
      <span className="dm-v dm-num">{shown(param, value)}</span>
    </div>
  );
}

/** A live preview beside a few sliders, with a button that hands the tuning to the agent. */
export function DesignTuner({ params = PARAMS, values, defaultValues, onValuesChange, title = 'Pricing card', status = 'Edited by you', active, tuning = false, note,
  actionLabel = 'Tune with agent', onTune, preview, className }: DesignTunerProps) {
  const [vals, setVals] = useControllable(values, defaultValues ?? Object.fromEntries(params.map(p => [p.key, p.value])), onValuesChange);
  const valueOf = (p: TunerParam) => clamp(p, vals[p.key] ?? p.value);
  const vars = Object.fromEntries(params.map(p => ['--dm-' + p.key, cssValue(p, valueOf(p))])) as CSSProperties;
  return (
    // the site lays this out by the width of its card, so the box around it is the container its query measures
    <div data-dm="" className={cx('dm-dtx-box', className)} style={{ containerType: 'inline-size', width: '100%' }}>
      <div className="dm-dtx">
        <div className="dm-dtx-prev">{preview ? preview(Object.fromEntries(params.map(p => [p.key, valueOf(p)])), vars) : <SampleCard vars={vars} />}</div>
        <div className="dm-dtx-insp dm-panel">
          <div className="dm-dtx-ih"><b>{title}</b><Swap className="dm-muted dm-dtx-st">{status}</Swap></div>
          <div className="dm-dtx-rows">
            {params.map(p => <Slider key={p.key} param={p} value={valueOf(p)} hot={active === p.key} onChange={v => setVals({ ...vals, [p.key]: v })} />)}
          </div>
          {note && <div className="dm-dtx-note dm-enter" style={enter().style}>{note}</div>}
          <button type="button" className={cx('dm-pill dm-ink dm-sm dm-dtx-go', tuning && 'dm-busy')} aria-busy={tuning} onClick={() => { if (!tuning) onTune?.(); }}>
            {tuning ? <><Think />Tuning</> : <><Icon name="wand" size="xs" />{actionLabel}</>}
          </button>
        </div>
      </div>
    </div>
  );
}
