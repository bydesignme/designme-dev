# Score breakdown

> A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/score-breakdown

## Install

```sh
npx designme add score-breakdown          # HTML, CSS and JS, with the shared core
npx designme add score-breakdown --react  # React 19 component and its CSS
npx designme add score-breakdown --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/score-breakdown.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/score-breakdown.json  # Astro
```

## About

A score out of 100 with what goes into it on show. The gauge is split into one segment per factor, sized by its weight (accuracy 40, speed 20, cost 20, safety 20), and each segment fills with the points that factor earned. Beside it sit the band word and the change since last week; under it, a row per factor with its points, a small bar and the agent's one-line note. The weakest factor is flagged in words, and its row offers Improve, which asks the agent for a proposal you can apply.

### When to use it

- For an agent quality score, an eval score or a health score that is a weighted sum of a few factors.
- When people should see why the score is what it is, not only the number.
- When the agent can suggest a fix for the factor that costs the most.

### What it does

- A half-circle gauge split by weight, with a small gap between segments, each filled to earned / weight in the chart palette.
- The score counts up to the total of the earned points, with a band word (Excellent from 90, Good from 75, Fair from 60, else Needs work) and the change against `previous` as a green or red tag.
- Rows with the factor's colour, name, earned / weight, a bar and the agent's note; the weakest factor (the lowest share of its weight) has a Weakest tag.
- Pointing at a row or its segment, or moving the focus into a row, lights both and dims the other segments.
- A row opens to say how many points it loses; with `improvable` and `onImprove` it has Improve. While the proposal is on its way the row says what the agent is doing, then shows the proposal, what it gains and the new points, with Apply and Not now.
- Apply calls `onApply`; update the factor and the gauge, the score and the rows move to the new values. The open rows can be controlled with `open` and `onOpenChange`.

### Accessibility

- The gauge has role="meter" with the score and an aria-valuetext with the band and the change, like "86 of 100, good, up 9 since last week".
- Each row is a button with aria-expanded and a label with its points, the Weakest flag and the note; its closed detail is inert and hidden from screen readers.
- The weakest factor and the change are said in words, not only by colour.
- Number count-ups finish at once when the user prefers reduced motion.

## Usage in React

```tsx
import { ScoreBreakdown } from '@/components/designme/score-breakdown/ScoreBreakdown';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: the weakest factor opens, the agent proposes a fix,
// the person applies it and the score rises.
import { useRef, useState } from 'react';
import { ScoreBreakdown, type ScoreFactor } from './ScoreBreakdown';
import { useStory } from '../lib/useScript';

const START: ScoreFactor[] = [
  { key: 'acc', label: 'Accuracy', weight: 40, earned: 34, note: '2 wrong refund amounts in 120 tickets' },
  { key: 'speed', label: 'Speed', weight: 20, earned: 11, note: 'Median reply 6.4s, target under 4s', improvable: true },
  { key: 'cost', label: 'Cost', weight: 20, earned: 16, note: '$0.11 a ticket, budget $0.12' },
  { key: 'safety', label: 'Safety', weight: 20, earned: 19, note: 'No policy breaks, 1 tone flag' }
];

export default function ScoreBreakdownDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [factors, setFactors] = useState(START);
  const [open, setOpen] = useState<string[]>([]);
  useStory(ref, async ({ wait, press }) => {
    await wait(2500); setOpen(['speed']);
    await wait(1500); press('.dm-sbx-r.dm-open .dm-pill');
    await wait(3500); press('.dm-sbx-r.dm-open .dm-primary');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ScoreBreakdown factors={factors} title="Support agent quality" previous={77} open={open} onOpenChange={setOpen} improvingLabel="Looking at 120 slow replies"
        onImprove={() => new Promise(res => setTimeout(() => res({ text: 'Cache the search results between steps and run the two account lookups at once.', gain: 'About 2.1s faster a reply', to: 17 }), 1300))}
        onApply={(f, p) => setFactors(fs => fs.map(x => x.key === f.key ? { ...x, earned: p.to, note: 'Median reply 4.3s, close to the target', improvable: false, detail: 'Applied: search results are cached and the lookups run together.' } : x))} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `factors` | `ScoreFactor[]` |  |
| `title` (optional) | `string` |  |
| `previous` (optional) | `number` | Last period's score, for the change beside the band word |
| `since` (optional) | `string` | What the change is measured against ("since last week") |
| `open` (optional) | `string[]` | The open rows, by key |
| `defaultOpen` (optional) | `string[]` |  |
| `onOpenChange` (optional) | `(open: string[]) => void` |  |
| `onImprove` (optional) | `(factor: ScoreFactor) => ScoreProposal \| Promise<ScoreProposal>` | Called by Improve. Return the agent's proposal (or a promise of it); while it waits the row says the agent is looking |
| `onApply` (optional) | `(factor: ScoreFactor, proposal: ScoreProposal) => void` | Called by Apply on a proposal; update the factor's `earned` and `note` |
| `improvingLabel` (optional) | `string` | What the row says while the agent works on a proposal |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ScoreBreakdown from '../components/designme/score-breakdown/ScoreBreakdown.astro';
---
<ScoreBreakdown />
<ScoreBreakdown data-style="soft" class="my-class" />
```
It plays its demo; change `score-breakdown.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Do the weights have to add up to 100?**

Yes. Each weight is the number of points a factor can earn and the score is their sum, so the weights should total 100.

**How is the weakest factor chosen?**

It is the factor with the lowest share of its own weight, so 11 of 20 counts as weaker than 34 of 40.

**How does this differ from Health score?**

Health score is an account's health at a glance: a small ring, four factor tiles with their trends, and the agent's next move. Score breakdown is about the score itself: it shows each factor's weight as its share of the gauge, flags the weakest part and proposes a fix to try.

## Source

`ScoreBreakdown.tsx`, as `npx designme add score-breakdown --react` installs it:

```tsx
'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Fold, Swap } from '../lib/motion';
import '../designme.css';
import './score-breakdown.css';

export interface ScoreFactor {
  key: string;
  /** Like "Speed" */
  label: string;
  /** The points it can earn; the weights add up to 100 */
  weight: number;
  /** The points it earned */
  earned: number;
  /** The agent's one-line note, like "Median reply 6.4s, target under 4s" */
  note: string;
  /** Adds an Improve button to the open row */
  improvable?: boolean;
  /** A line shown first in the open row, like what was changed */
  detail?: string;
}

export interface ScoreProposal {
  /** What the agent would change */
  text: ReactNode;
  /** What it would gain, like "About 2.1s faster a reply" */
  gain?: string;
  /** The points the factor would earn after it */
  to: number;
}

export interface ScoreBreakdownProps {
  factors: ScoreFactor[];
  title?: string;
  /** Last period's score, for the change beside the band word */
  previous?: number;
  /** What the change is measured against ("since last week") */
  since?: string;
  /** The open rows, by key */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  /** Called by Improve. Return the agent's proposal (or a promise of it); while it waits the row says the agent is looking */
  onImprove?: (factor: ScoreFactor) => ScoreProposal | Promise<ScoreProposal>;
  /** Called by Apply on a proposal; update the factor's `earned` and `note` */
  onApply?: (factor: ScoreFactor, proposal: ScoreProposal) => void;
  /** What the row says while the agent works on a proposal */
  improvingLabel?: string;
  className?: string;
}

const PAL = ['var(--dm-c1)', 'var(--dm-c2)', 'var(--dm-c3)', 'var(--dm-c4)', 'var(--dm-c5)', 'var(--dm-c6)'];
const band = (s: number) => s >= 90 ? 'Excellent' : s >= 75 ? 'Good' : s >= 60 ? 'Fair' : 'Needs work';
const CX = 100, CY = 100, RAD = 86, GAP = .04;
const at = (a: number) => [CX + Math.cos(a) * RAD, CY + Math.sin(a) * RAD];
const arc = (a0: number, a1: number) => { const [x0, y0] = at(a0), [x1, y1] = at(a1); return `M${x0.toFixed(2)} ${y0.toFixed(2)}A${RAD} ${RAD} 0 0 1 ${x1.toFixed(2)} ${y1.toFixed(2)}`; };

function Segment({ a0, a1, share, color, on, onPoint }: { a0: number; a1: number; share: number; color: string; on: boolean; onPoint: (on: boolean) => void }) {
  const p = useTween(share, 900, 0);
  return (
    <g className={cx(on && 'dm-on')} onPointerEnter={e => { if (e.pointerType !== 'touch') onPoint(true); }} onPointerLeave={() => onPoint(false)}>
      <path className="dm-tr" d={arc(a0, a1)} />
      {p > 0 && <path className="dm-fl" style={{ stroke: color }} d={arc(a0, a0 + (a1 - a0) * Math.min(1, p))} />}
    </g>
  );
}

/** A score out of 100 whose gauge is split by what goes into it, each part filled by the points it earned, with the weakest flagged and an agent's fix one click away. */
export function ScoreBreakdown({ factors, title = 'Quality score', previous, since = 'since last week', open, defaultOpen = [], onOpenChange, onImprove, onApply, improvingLabel = 'Looking into it', className }: ScoreBreakdownProps) {
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  const [hot, setHot] = useState(-1);
  const [drawn, setDrawn] = useState(false);
  const [props, setProps] = useState<Record<string, ScoreProposal | 'busy'>>({});
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 280); return () => clearTimeout(t); }, []);
  const total = factors.reduce((t, f) => t + f.earned, 0);
  const shown = useTween(drawn ? total : 0, 1000, 0);
  const weakest = factors.reduce((m, f, i) => f.earned / f.weight < factors[m].earned / factors[m].weight ? i : m, 0);
  let a = Math.PI;
  const seg = factors.map(f => { const span = f.weight / 100 * Math.PI, s = [a + GAP / 2, a + span - GAP / 2]; a += span; return s; });
  const d = previous === undefined ? null : total - previous;
  const improve = async (f: ScoreFactor) => {
    if (!onImprove) return;
    setProps(p => ({ ...p, [f.key]: 'busy' }));
    const pr = await onImprove(f); setProps(p => ({ ...p, [f.key]: pr }));
  };
  const drop = (k: string) => setProps(p => { const n = { ...p }; delete n[k]; return n; });
  return (
    <div data-dm="" className={cx('dm-sbx dm-panel', className)}>
      <div className="dm-sbx-top">
        <div className={cx('dm-sbx-g', hot >= 0 && 'dm-hov')} role="meter" aria-label={title} aria-valuemin={0} aria-valuemax={100} aria-valuenow={total}
          aria-valuetext={`${total} of 100, ${band(total).toLowerCase()}${d === null ? '' : `, ${d >= 0 ? 'up' : 'down'} ${Math.abs(d)} ${since}`}`}>
          <svg viewBox="0 0 200 108" aria-hidden="true">
            {factors.map((f, i) => <Segment key={f.key} a0={seg[i][0]} a1={seg[i][1]} share={drawn ? f.earned / f.weight : 0} color={PAL[i % PAL.length]} on={i === hot} onPoint={o => setHot(o ? i : -1)} />)}
          </svg>
          <div className="dm-sbx-v"><b className="dm-num">{Math.round(shown)}</b><span className="dm-muted">of 100</span></div>
        </div>
        <div className="dm-sbx-s"><b>{title}</b>
          <span className="dm-sbx-band"><Swap className="dm-muted">{drawn ? band(total) : 'Scoring'}</Swap>{d !== null && drawn && <span className={cx('dm-tag dm-num', d >= 0 ? 'dm-ok' : 'dm-bad')}>{d >= 0 ? '+' : '−'}{Math.abs(d)} {since}</span>}</span>
        </div>
      </div>
      <div className="dm-sbx-list" onPointerLeave={e => { if (!e.currentTarget.contains(document.activeElement)) setHot(-1); }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setHot(-1); }}>
        {factors.map((f, i) => {
          const isOpen = opened.includes(f.key), lost = f.weight - f.earned, pr = props[f.key];
          return (
            <div key={f.key} className={cx('dm-sbx-r', i === hot && 'dm-on', isOpen && 'dm-open')} onPointerEnter={e => { if (e.pointerType !== 'touch') setHot(i); }} onFocus={() => setHot(i)}>
              <button type="button" className="dm-sbx-rh" aria-expanded={isOpen} aria-label={`${f.label}: ${f.earned} of ${f.weight} points${i === weakest ? ', weakest' : ''}. ${f.note}`}
                onClick={() => setOpened(isOpen ? opened.filter(k => k !== f.key) : [...opened, f.key])}>
                <i style={{ background: PAL[i % PAL.length] }} /><span className="dm-n"><span>{f.label}</span>{i === weakest && <span className="dm-tag dm-warn">Weakest</span>}</span>
                <span className="dm-e dm-num">{f.earned}/{f.weight}</span><span className="dm-bar"><i style={{ background: PAL[i % PAL.length], width: drawn ? f.earned / f.weight * 100 + '%' : 0 }} /></span>
                <Icon name="chev-r" size="xs" /><span className="dm-sbx-nt">{f.note}</span>
              </button>
              <Fold open={isOpen}>
                <div className="dm-sbx-d">
                  {pr === 'busy' ? <div className="dm-sbx-pr dm-enter"><span className="dm-k"><Icon name="spark" size="xs" /><span className="dm-shim">{improvingLabel}</span></span></div>
                    : pr ? <div className="dm-sbx-pr"><span className="dm-k"><Icon name="spark" size="xs" />Proposal</span><span>{pr.text}</span>
                        <span className="dm-gain">{pr.gain ? pr.gain + ': ' : ''}{f.label} <b className="dm-num">{f.earned} → {pr.to}</b></span>
                        <span className="dm-acts"><button type="button" className="dm-pill dm-primary dm-sm" onClick={() => { drop(f.key); onApply?.(f, pr); }}>Apply</button><button type="button" className="dm-pill dm-ghost dm-sm" onClick={() => drop(f.key)}>Not now</button></span></div>
                    : <><span>{f.detail ? f.detail + ' ' : ''}{lost ? `Loses ${lost} of its ${f.weight} points` : 'Full marks'}{i === weakest && lost ? ', the most of any factor for its weight.' : '.'}</span>
                        {f.improvable && onImprove && <span className="dm-acts"><button type="button" className="dm-pill dm-soft dm-sm" onClick={() => improve(f)}><Icon name="wand" size="xs" />Improve</button></span>}</>}
                </div>
              </Fold>
            </div>
          );
        })}
      </div>
    </div>
  );
}
```

## More in Charts and tables

- [Line chart](https://designme.dev/components/line-chart.md): Two series over time with a hover readout and toggles.
- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
- [Donut chart](https://designme.dev/components/donut-chart.md): Where the agent's time went, by kind of task.
- [Radial goals](https://designme.dev/components/radial-goals.md): Each agent's share of its own target as a ring, with the overall score in the middle.
- [Funnel chart](https://designme.dev/components/funnel-chart.md): Signup to paid, with the biggest drop called out by the agent.
- [Top pages](https://designme.dev/components/top-pages.md): Most visited pages with share of traffic and a quick sort.
- [Health score](https://designme.dev/components/health-score.md): An account's health: a score ring, four factors that open, and the agent's next move.
- [Eval radar](https://designme.dev/components/radar-chart.md): This run against the baseline on six eval scores, with the weak ones flagged.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
