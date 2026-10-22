# Design tuner

> Tweak a component by hand or let the agent tune it.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/design-tuner

## Install

```sh
npx designme add design-tuner          # HTML, CSS and JS, with the shared core
npx designme add design-tuner --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Design tuner puts a live preview next to a few sliders, such as radius, padding, spacing and shadow, so a person can tweak a component by hand. A button hands the same sliders to the agent, which can move them while people watch and then explain what it changed.

### When to use it

- When people and the agent should share control over a component's look.
- When you want the agent's styling choices to be visible as slider moves, not hidden in code.
- When designers want to fine-tune spacing or radius after the agent has made a first pass.
- When you need a short note from the agent about why it picked the new values.

### What it does

- Each entry in `params` becomes a slider with a label, a range, a unit like px, and optional `decimals` for fine values.
- Every value is set on the preview as a CSS variable named `--dm-<key>`, so your styles can read it.
- `preview` lets you render your own component. It receives the values and a style object with those variables. Without it, a sample pricing card is shown.
- `active` highlights the slider the agent is moving, and `status` shows a short line like "Agent is tuning".
- The tune button calls `onTune`. While `tuning` is true it shows a thinking animation and ignores clicks.
- `note` shows the agent's explanation above the button, and `actionLabel` lets you change it to something like "Tune again".

### Accessibility

- Each slider has `role="slider"`, is focusable, and sets `aria-label`, `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and `aria-valuetext`.
- Arrow keys move a slider by one step, or by the smallest decimal when `decimals` is set.
- The tune button sets `aria-busy` while the agent is tuning.

## Usage in React

```tsx
import { DesignTuner } from '@/components/designme/design-tuner/DesignTuner';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { DesignTuner } from './DesignTuner';
import { useScript } from '../lib/useScript';

/* ---------- Design tuner: drag the sliders, or let the agent tune each one in turn ---------- */
const START = { rad: 16, pad: 18, gap: 12, sh: .08 };
const KEYS = ['rad', 'pad', 'gap', 'sh'] as const;
export default function DesignTunerDemo() {
  const [values, setValues] = useState<Record<string, number>>(START);
  const [status, setStatus] = useState('Edited by you');
  const [active, setActive] = useState<string>();
  const [note, setNote] = useState<string>();
  const [runs, setRuns] = useState(0);
  const live = useRef(values), yours = useRef(false);
  useEffect(() => { live.current = values; });
  // the agent tunes once on its own, unless you reach for a slider or the button first
  useScript(async ({ wait }) => { await wait(1600); if (!yours.current) setRuns(r => r || 1); });
  // each run aims at the other set of values, so Tune again always has something to do
  useScript(async ({ wait }) => {
    if (runs <= 0) return;
    const target = runs % 2 ? { rad: 20, pad: 24, gap: 14, sh: .05 } : { rad: 12, pad: 20, gap: 10, sh: .1 };
    setStatus('Agent is tuning'); setNote(undefined);
    for (const k of KEYS) {
      setActive(k);
      const from = live.current[k], to = target[k], t0 = performance.now();
      for (let p = 0; p < 1;) { await wait(16); p = Math.min(1, (performance.now() - t0) / 650); setValues(v => ({ ...v, [k]: from + (to - from) * (1 - Math.pow(1 - p, 3)) })); }
      await wait(120); setActive(undefined);
    }
    setNote('Matched the 4px grid and your card tokens. Softer shadow so the CTA leads.');
    setStatus('Tuned by agent'); setRuns(r => -r);
  }, [runs > 0 ? runs : 0]);
  return (
    <div style={{ width: '100%' }}>
      <DesignTuner values={values} onValuesChange={v => { yours.current = true; setValues(v); setStatus('Edited by you'); }} status={status} active={active}
        tuning={runs > 0} note={note} actionLabel={runs ? 'Tune again' : 'Tune with agent'} onTune={() => { yours.current = true; setRuns(r => Math.abs(r) + 1); }} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `params` (optional) | `TunerParam[]` | The sliders. Defaults to radius, padding, spacing and shadow for the sample card |
| `values` (optional) | `Record<string, number>` | The value of each slider by key. Leave it out to let the sliders keep their own |
| `defaultValues` (optional) | `Record<string, number>` |  |
| `onValuesChange` (optional) | `(values: Record<string, number>) => void` |  |
| `title` (optional) | `string` | What is being tuned, like "Pricing card" |
| `status` (optional) | `string` | Quiet line beside the title, like "Edited by you" or "Agent is tuning" |
| `active` (optional) | `string` | Key of the slider the agent is moving now; its value turns the accent colour |
| `tuning` (optional) | `boolean` | The agent is tuning: the button thinks and stops taking clicks |
| `note` (optional) | `ReactNode` | What the agent changed and why, shown above the button |
| `actionLabel` (optional) | `string` | The button's label, like "Tune with agent" or "Tune again" |
| `onTune` (optional) | `() => void` |  |
| `preview` (optional) | `(values: Record<string, number>, vars: CSSProperties) => ReactNode` | What the sliders change. Gets the values and a style with a `--dm-<key>` variable for each one. Defaults to the sample pricing card from designme.dev |
| `className` (optional) | `string` |  |

## Questions

**How do I let the agent move the sliders?**

Control `values` and update them from your agent as it works. Set `tuning` and `active` while it runs so people can see which slider it is on.

**How do I tune my own component instead of the sample card?**

Pass `preview`, a function that gets the values and a style object. Spread the style onto your element and read the `--dm-<key>` variables in its CSS.

**Can a slider hold decimal values?**

Yes. Set `decimals` on the param, for example 2 for a shadow strength. The value is shown and set with that many decimals instead of being rounded.

## Source

`DesignTuner.tsx`, as `npx designme add design-tuner --react` installs it:

```tsx
'use client';
import { useRef, useState, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Swap, Think } from '../lib/motion';
import '../designme.css';
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
```

## More in Review and approve

- [Change review](https://designme.dev/components/change-review.md): Accept or reject each change the agent made, file by file.
- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Permission gate](https://designme.dev/components/permission-gate.md): The agent asks before it touches something new.
- [Decision prompt](https://designme.dev/components/decision-prompt.md): The agent asks a few quick questions before it starts.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Launch checklist](https://designme.dev/components/launch-checklist.md): The agent checks a design before it ships, and fixes what fails.

All components: https://designme.dev/llms.txt
