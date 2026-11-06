# Radial goals

> Each agent's share of its own target as a ring, with the overall score in the middle.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/radial-goals

## Install

```sh
npx designme add radial-goals          # HTML, CSS and JS, with the shared core
npx designme add radial-goals --react  # React 19 component and its CSS
npx designme add radial-goals --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/radial-goals.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/radial-goals.json  # Astro
```

## About

Concentric rings, one for each agent, each filled to its share of that agent's own target, so agents with very different targets sit side by side. The middle shows the overall share, or the agent you point at. Every value is printed in the legend as done / target, a ring past its target goes round again with a marker where it ends, and a Week and Month switch changes the period.

### When to use it

- To show how several agents (or teams, or goals) are doing against targets of different sizes.
- On a weekly review where the question is who is on target and who is behind.
- When people need the exact numbers as well as the picture.

### What it does

- A thick ring per goal, outermost first, in the chart palette, on a grey track. Three goals read best; the rings share the space between the edge and the readout, so the more goals there are, the thinner each ring.
- Past its target a ring goes round again from the top, its end cutting into the ring under it (in Soft) with a small marker on it, and its share shows as a green tag ("110%").
- The middle shows the average share across the goals, or the share of the goal you point at, counting to the new value.
- Legend rows print each goal's done / target with its unit and its share.
- Pointing at a ring or a row, or moving the focus to a row, lights both and dims the other rings.
- An optional range switch (`ranges`, `range`, `onRangeChange`), and a line under the title that says how many are on target.

### Accessibility

- Each legend row can take the focus and has a label with the numbers, like "Research agent: 18 of 24 reports, 75% of target".
- A visually hidden table carries every goal, its done and target values and its share, with the title as its caption.
- The rings are hidden from screen readers, since the rows and the table hold the same numbers.
- Values are always printed, so nothing depends on telling the ring colours apart.

## Usage in React

```tsx
import { RadialGoals } from '@/components/designme/radial-goals/RadialGoals';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: the week, then the month.
import { useEffect, useRef, useState } from 'react';
import { RadialGoals, type RadialGoal } from './RadialGoals';
import { useStory } from '../lib/useScript';

const DATA: Record<'w' | 'm', RadialGoal[]> = {
  w: [{ key: 'support', label: 'Support agent', unit: 'tickets', value: 412, target: 375 }, { key: 'qa', label: 'QA agent', unit: 'checks', value: 136, target: 160 },
    { key: 'research', label: 'Research agent', unit: 'reports', value: 18, target: 24, color: 'var(--dm-c4)' }],
  m: [{ key: 'support', label: 'Support agent', unit: 'tickets', value: 1490, target: 1600 }, { key: 'qa', label: 'QA agent', unit: 'checks', value: 702, target: 640 },
    { key: 'research', label: 'Research agent', unit: 'reports', value: 71, target: 96, color: 'var(--dm-c4)' }]
};
const EMPTY = DATA.w.map(g => ({ ...g, value: 0 }));

export default function RadialGoalsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [range, setRange] = useState<'w' | 'm'>('w');
  // the rings sweep in a moment after the card appears
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 260); return () => clearTimeout(t); }, []);
  useStory(ref, async ({ wait }) => { await wait(7000); setRange('m'); await wait(2000); setRange('w'); });
  const on = DATA[range].filter(g => g.value >= g.target).length;
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <RadialGoals goals={drawn ? DATA[range] : EMPTY} subtitle={`${range === 'w' ? 'This week' : 'This month'}, ${on} of ${DATA[range].length} on target`}
        ranges={[{ value: 'w', label: 'Week' }, { value: 'm', label: 'Month' }]} range={range} onRangeChange={setRange} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `goals` | `RadialGoal[]` | Two to five goals, outermost first. Three read best: the fewer the rings, the thicker they are |
| `title` (optional) | `string` |  |
| `subtitle` (optional) | `string` | The line under the title. Defaults to "1 of 3 on target" |
| `ranges` (optional) | `{ value: R; label: string }[]` | A switch for the period, like Week and Month |
| `range` (optional) | `R` |  |
| `onRangeChange` (optional) | `(range: R) => void` |  |
| `className` (optional) | `string` |  |

Also takes the props of `string = string>`.

## Usage in Astro

```astro
---
import RadialGoals from '../components/designme/radial-goals/RadialGoals.astro';
---
<RadialGoals />
<RadialGoals data-style="soft" class="my-class" />
```
It plays its demo; change `radial-goals.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How many rings fit?**

Two to five, and three read best. The rings share one band between the edge and the readout in the middle, so three are 14 units thick, four are about 10 and five are 7; more than five would be too thin to read.

**How is the overall share worked out?**

It is the average of each goal's share, so a goal past its target can lift the average above another's shortfall.

**Can I leave out the range switch?**

Yes. Leave out `ranges`, or `onRangeChange`, and the header shows the title and its line only.

## Source

`RadialGoals.tsx`, as `npx designme add radial-goals --react` installs it:

```tsx
'use client';
import { useState, type CSSProperties } from 'react';
import { cx } from '../lib/cx';
import { useTween } from '../lib/hooks';
import { Seg, Swap } from '../lib/motion';
import '../designme.css';
import './radial-goals.css';

export interface RadialGoal {
  key: string;
  /** Like "Support agent" */
  label: string;
  /** What it counts, like "tickets" */
  unit: string;
  value: number;
  target: number;
  /** Defaults to the chart palette in order */
  color?: string;
}

export interface RadialGoalsProps<R extends string = string> {
  /** Two to five goals, outermost first. Three read best: the fewer the rings, the thicker they are */
  goals: RadialGoal[];
  title?: string;
  /** The line under the title. Defaults to "1 of 3 on target" */
  subtitle?: string;
  /** A switch for the period, like Week and Month */
  ranges?: { value: R; label: string }[];
  range?: R;
  onRangeChange?: (range: R) => void;
  className?: string;
}

const PAL = ['var(--dm-c1)', 'var(--dm-c3)', 'var(--dm-c4)', 'var(--dm-c2)', 'var(--dm-c5)'];
const pc = (x: number) => Math.round(x * 100) + '%';

/** Concentric rings, one per agent, each its share of its own target; past the target a ring goes round again with a marker. */
export function RadialGoals<R extends string = string>({ goals, title = 'Agent goals', subtitle, ranges, range, onRangeChange, className }: RadialGoalsProps<R>) {
  const [focus, setFocus] = useState(-1);
  // the rings share the band from the outer edge (85) to the readout in the middle (34) with a 4 unit gap between them, so
  // three goals get rings 14 units wide; never wider than 16
  const W = Math.min(16, (51 - 4 * (goals.length - 1)) / Math.max(1, goals.length));
  const RAD = goals.map((_, i) => 85 - W / 2 - i * (W + 4));
  const share = (g: RadialGoal) => g.target ? g.value / g.target : 0;
  const overall = goals.reduce((t, g) => t + share(g), 0) / Math.max(1, goals.length);
  const mid = useTween(focus < 0 ? overall : share(goals[focus]), 600, 0);
  const on = goals.filter(g => share(g) >= 1).length;
  return (
    <div data-dm="" className={cx('dm-rgx dm-panel', className)}>
      <div className="dm-rgx-h">
        <div className="dm-rgx-t"><b>{title}</b><Swap className="dm-muted dm-rgx-sub">{subtitle ?? `${on} of ${goals.length} on target`}</Swap></div>
        {ranges && range !== undefined && onRangeChange && <Seg className="dm-rgx-sg" label="Range" options={ranges} value={range} onChange={onRangeChange} />}
      </div>
      <div className="dm-rgx-b">
        <div className={cx('dm-rgx-ring', focus >= 0 && 'dm-hov')}>
          <svg viewBox="0 0 180 180" aria-hidden="true" style={{ ['--dm-rw' as string]: W } as CSSProperties}>
            {goals.map((g, i) => { const s = share(g), c = g.color ?? PAL[i % PAL.length], an = (s > 1 ? s - 1 : s) * 2 * Math.PI;
              return (
                <g key={g.key} className={cx(i === focus && 'dm-on', s > 1 && 'dm-lap')} style={{ stroke: c }} onPointerEnter={e => { if (e.pointerType !== 'touch') setFocus(i); }} onPointerLeave={() => setFocus(-1)}>
                  <circle className="dm-tr" cx={90} cy={90} r={RAD[i]} />
                  <circle className="dm-fl" cx={90} cy={90} r={RAD[i]} pathLength={100} strokeDasharray={`${Math.max(0, Math.min(1, s) * 100 - .01)} 100`} />
                  {/* past the target the ring goes round again from the top, and a marker sits where it ends */}
                  {/* under the lap's end only, a band of the surface a little wider than the ring, so the end cuts into the ring under it */}
                  <circle className="dm-ovb" cx={90} cy={90} r={RAD[i]} pathLength={100} strokeDasharray={`${Math.min(3, Math.max(0, s - 1) * 100)} 100`} strokeDashoffset={-Math.max(0, (s - 1) * 100 - 3)} />
                  <circle className="dm-ov" cx={90} cy={90} r={RAD[i]} pathLength={100} strokeDasharray={`${Math.max(0, s - 1) * 100} 100`} />
                  <circle className="dm-mk" r={Math.max(2.5, W * .29)} cx={90 + Math.cos(an) * RAD[i]} cy={90 + Math.sin(an) * RAD[i]} style={{ stroke: c }} />
                </g>
              ); })}
          </svg>
          <div className="dm-rgx-c"><b className="dm-num">{pc(mid)}</b><Swap className="dm-muted">{focus < 0 ? 'of targets' : goals[focus].label.replace(/ agent$/, '')}</Swap></div>
        </div>
        <div className="dm-rgx-lg">
          {goals.map((g, i) => { const s = share(g);
            return (
              <div key={g.key} className={cx('dm-rgx-r', i === focus && 'dm-on')} tabIndex={0} aria-label={`${g.label}: ${g.value} of ${g.target} ${g.unit}, ${pc(s)} of target`}
                onPointerEnter={e => { if (e.pointerType !== 'touch') setFocus(i); }} onPointerLeave={e => { if (!e.currentTarget.parentElement?.contains(document.activeElement)) setFocus(-1); }}
                onFocus={() => setFocus(i)} onBlur={() => setFocus(-1)}>
                <i style={{ background: g.color ?? PAL[i % PAL.length] }} /><span className="dm-n">{g.label}</span>
                <span className="dm-p dm-num">{s >= 1 ? <span className="dm-tag dm-ok">{pc(s)}</span> : pc(s)}</span>
                <span className="dm-v dm-num">{g.value.toLocaleString('en-US')} / {g.target.toLocaleString('en-US')} {g.unit}</span>
              </div>
            ); })}
        </div>
      </div>
      <div className="dm-rgx-sr"><table>
        <caption>{title}</caption>
        <thead><tr><th>Agent</th><th>Done</th><th>Target</th><th>Share</th></tr></thead>
        <tbody>{goals.map(g => <tr key={g.key}><th>{g.label}</th><td>{g.value} {g.unit}</td><td>{g.target}</td><td>{pc(share(g))}</td></tr>)}</tbody>
      </table></div>
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
- [Health score](https://designme.dev/components/health-score.md): A design system score made of a few checks you can open.
- [Score breakdown](https://designme.dev/components/score-breakdown.md): A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.
- [Eval radar](https://designme.dev/components/radar-chart.md): This run against the baseline on six eval scores, with the weak ones flagged.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
