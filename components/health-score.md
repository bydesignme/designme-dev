# Health score

> A design system score made of a few checks you can open.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/health-score

## Install

```sh
npx designme add health-score          # HTML, CSS and JS, with the shared core
npx designme add health-score --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

A gauge with one score out of 100 for a design system, plus the checks that make it up, such as token usage, contrast and component reuse. Each check opens to show why it scored as it did, and a check marked fixable gets a Fix button that hands the job to the agent. When the fix lands, the check and the overall score update.

### When to use it

- When an agent audits a design system or codebase and you want one number with the reasons behind it.
- When some issues can be fixed by the agent with a click.
- On a dashboard card that tracks quality over time.

### What it does

- A half-circle gauge that fills to the score, which is the average of the checks unless you pass `score`.
- Colours by score: green from 90, the accent colour from 80, red below 80.
- A status line such as "Good, 2 checks need work" worked out from checks under 90, or your own `status`.
- Each check is a row with a bar and its score; clicking it opens a line of `detail`.
- A check with `fixable` gets a Fix button when `onFix` is set; if `onFix` returns a promise the button spins until it settles.
- Score changes count to the new number, and the open rows can be controlled with `open` and `onOpenChange`.

### Accessibility

- The gauge has role="meter" with aria-valuemin 0, aria-valuemax 100, aria-valuenow set to the score and the title as its label.
- Each check row is a button with aria-expanded, and its closed detail is inert and aria-hidden.
- The Fix button sets aria-busy while the fix runs.
- Number count-ups finish at once when the user prefers reduced motion.

## Usage in React

```tsx
import { HealthScore } from '@/components/designme/health-score/HealthScore';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: open a check that needs work and let the agent fix it.
import { useEffect, useRef, useState } from 'react';
import { HealthScore, type HealthScoreCheck } from './HealthScore';

const CHECKS: HealthScoreCheck[] = [
  { label: 'Token usage', score: 96, detail: 'All colours come from the library' },
  { label: 'Contrast', score: 88, detail: '2 text pairs below AA on the pricing page', fixable: true },
  { label: 'Component reuse', score: 74, detail: '11 detached instances in Checkout', fixable: true },
  { label: 'Naming', score: 91, detail: 'Layer names follow the convention' }
];
const FIXED: Record<string, Partial<HealthScoreCheck>> = {
  Contrast: { score: 97, detail: 'Fixed. Both pairs now pass AA', fixable: false },
  'Component reuse': { score: 93, detail: 'Fixed. Reattached 11 instances', fixable: false }
};

export default function HealthScoreDemo() {
  const [checks, setChecks] = useState(CHECKS);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  // the agent takes a moment to fix a check, then the score moves
  const fix = (check: HealthScoreCheck) => new Promise<void>(done => {
    timers.current.push(setTimeout(() => { setChecks(cs => cs.map(c => c.label === check.label ? { ...c, ...FIXED[c.label] } : c)); done(); }, 900));
  });
  return <div style={{ width: '100%' }}><HealthScore checks={checks} onFix={fix} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `checks` | `HealthScoreCheck[]` |  |
| `title` (optional) | `string` | Beside the gauge, like "Design system health" |
| `score` (optional) | `number` | The score in the gauge. Defaults to the average of the checks |
| `status` (optional) | `string` | The line under the title. Defaults to "Good, 2 checks need work" from the checks |
| `open` (optional) | `string[]` | The open checks, by key. Leave it out to let each row toggle itself |
| `defaultOpen` (optional) | `string[]` |  |
| `onOpenChange` (optional) | `(open: string[]) => void` |  |
| `onFix` (optional) | `(check: HealthScoreCheck, index: number) => void \| Promise<unknown>` | Called by a check's Fix button. Return a promise and the button spins until it settles; then update the check's score and detail |
| `className` (optional) | `string` |  |

## Questions

**How do I let the agent fix a check?**

Set `fixable` on the check and pass `onFix`. Return a promise that resolves once the agent is done, then update that check's `score` and `detail` in `checks`. You may also want to clear `fixable` so the button goes away.

**How is the overall score worked out?**

By default it is the rounded average of all check scores. Pass `score` to show your own number instead, for example a weighted score.

**Can I open a check from outside the component?**

Yes. Control `open` with an array of check keys. A check's key is its `key`, or its `label` when no key is set.

## Source

`HealthScore.tsx`, as `npx designme add health-score --react` installs it:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Fold, Spin, Swap } from '../lib/motion';
import '../designme.css';
import './health-score.css';

export interface HealthScoreCheck {
  /** Identifies the check. Defaults to its label */
  key?: string;
  /** Like "Contrast" */
  label: string;
  /** 0 to 100. From 90 it is green, from 80 the accent, below that red */
  score: number;
  /** One line under the check when it is open, like "2 text pairs below AA on the pricing page" */
  detail: string;
  /** Adds a Fix button to the open check */
  fixable?: boolean;
}

export interface HealthScoreProps {
  checks: HealthScoreCheck[];
  /** Beside the gauge, like "Design system health" */
  title?: string;
  /** The score in the gauge. Defaults to the average of the checks */
  score?: number;
  /** The line under the title. Defaults to "Good, 2 checks need work" from the checks */
  status?: string;
  /** The open checks, by key. Leave it out to let each row toggle itself */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  /** Called by a check's Fix button. Return a promise and the button spins until it settles; then update the check's score and detail */
  onFix?: (check: HealthScoreCheck, index: number) => void | Promise<unknown>;
  className?: string;
}

const ARC = 157;
const tone = (v: number) => v >= 90 ? 'var(--dm-hs-ok)' : v >= 80 ? 'var(--dm-accent)' : 'var(--dm-hs-bad)';
const keyOf = (c: HealthScoreCheck) => c.key ?? c.label;

function Check({ check, index, filled, open, onToggle, onFix }: { check: HealthScoreCheck; index: number; filled: boolean; open: boolean; onToggle: () => void; onFix?: HealthScoreProps['onFix'] }) {
  const shown = useTween(check.score, 700);
  const [busy, setBusy] = useState(false);
  const fix = async () => {
    if (busy) return;
    setBusy(true);
    try { await onFix?.(check, index); } finally { setBusy(false); }
  };
  return (
    <div className={cx('dm-hsx-c', open && 'dm-open')}>
      <button type="button" className="dm-hsx-ch" aria-expanded={open} onClick={onToggle}>
        <span className="dm-t">{check.label}</span>
        <span className="dm-bar"><i style={filled ? { width: check.score + '%', background: tone(check.score) } : { width: 0 }} /></span>
        <span className="dm-v dm-num">{Math.round(shown)}</span>
        <Icon name="chev-r" size="xs" />
      </button>
      <Fold open={open}>
        <div className="dm-hsx-d">
          <Swap>{check.detail}</Swap>
          {check.fixable && onFix && <button type="button" className="dm-pill dm-soft dm-sm" onClick={fix} aria-busy={busy}>{busy ? <Spin /> : <><Icon name="wand" size="xs" />Fix</>}</button>}
        </div>
      </Fold>
    </div>
  );
}

/** One score for a design system, with the checks behind it. Open a check to see why, and fix it from there. */
export function HealthScore({ checks, title = 'Design system health', score, status, open, defaultOpen = [], onOpenChange, onFix, className }: HealthScoreProps) {
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  // the gauge and the bars fill in a moment after the card appears, the bars one after another
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    const ts = [setTimeout(() => setFilled(n => Math.max(n, 1)), 200), ...checks.map((_, i) => setTimeout(() => setFilled(n => Math.max(n, i + 2)), 200 + i * 80))];
    return () => ts.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const total = Math.round(score ?? (checks.length ? checks.reduce((a, c) => a + c.score, 0) / checks.length : 0));
  const drawn = filled > 0;
  const shown = useTween(drawn ? total : 0, 1000, 0);
  const weak = checks.filter(c => c.score < 90).length;
  const line = status ?? (weak ? `${total >= 85 ? 'Good' : 'Fair'}, ${weak} ${weak > 1 ? 'checks need' : 'check needs'} work` : 'Excellent, all checks pass');
  const toggle = (k: string) => setOpened(opened.includes(k) ? opened.filter(x => x !== k) : [...opened, k]);

  return (
    <div data-dm="" className={cx('dm-hsx dm-panel', className)}>
      <div className="dm-hsx-top">
        <div className="dm-hsx-g" role="meter" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={total}>
          <svg viewBox="0 0 120 70" aria-hidden="true">
            <path d="M10 64a50 50 0 0 1 100 0" className="dm-tr" />
            <path d="M10 64a50 50 0 0 1 100 0" className="dm-fl" style={drawn ? { strokeDashoffset: ARC * (1 - total / 100), stroke: tone(total) } : undefined} />
          </svg>
          <div className="dm-hsx-v"><b className="dm-num">{Math.round(shown)}</b><span className="dm-muted">of 100</span></div>
        </div>
        <div className="dm-hsx-s"><b>{title}</b><Swap className="dm-muted dm-hsx-st">{line}</Swap></div>
      </div>
      <div className="dm-hsx-list">
        {checks.map((c, i) => <Check key={keyOf(c)} check={c} index={i} filled={filled > i + 1} open={opened.includes(keyOf(c))} onToggle={() => toggle(keyOf(c))} onFix={onFix} />)}
      </div>
    </div>
  );
}
```

## More in Charts and tables

- [Line chart](https://designme.dev/components/line-chart.md): Two series over time with a hover readout and toggles.
- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
- [Donut chart](https://designme.dev/components/donut-chart.md): Where the agent's time went, by kind of task.
- [Funnel chart](https://designme.dev/components/funnel-chart.md): Signup to paid, with the biggest drop called out by the agent.
- [Top pages](https://designme.dev/components/top-pages.md): Most visited pages with share of traffic and a quick sort.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
