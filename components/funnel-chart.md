# Funnel chart

> Signup to paid, with the biggest drop called out by the agent.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/funnel-chart

## Install

```sh
npx designme add funnel-chart          # HTML, CSS and JS, with the shared core
npx designme add funnel-chart --react  # React 19 component and its CSS
npx designme add funnel-chart --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/funnel-chart.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/funnel-chart.json  # Astro
```

## About

A funnel that shows how many people reach each stage of a flow, like signup to paid, with the stage that loses the largest share marked. Under the funnel sits a short note, written by your agent, explaining what the numbers mean. A switch moves between segments such as all users, teams and solo users.

### When to use it

- When you want to show conversion through a signup, onboarding or checkout flow.
- When an agent analyses the funnel and its finding should sit right under the chart.
- When the same stages need comparing across a few user segments.

### What it does

- One horizontal bar per entry in `stages`, its width relative to the first stage, with the count on or beside the bar.
- In Soft, the bars shade from the accent at the first stage to violet at the last, so the flow reads as one journey. Blueprint keeps every bar in the accent.
- Each row ends with its drop from the stage before as a percentage, and the first row reads 100%.
- The stage with the largest drop compared with the one before is marked automatically.
- Hovering a bar shows its share of the first stage, ended by `shareLabel`, or `startLabel` on the first stage.
- With more than one entry in `views`, a segment switch redraws the bars top to bottom and swaps in that view's `insight` text.

### Accessibility

- The segment switch is a role="group" labelled "Segment", and its buttons use aria-pressed.
- Each bar's share tooltip has role="tooltip".

## Usage in React

```tsx
import { FunnelChart } from '@/components/designme/funnel-chart/FunnelChart';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: signup to paid, for everyone, teams or solo users.
import { FunnelChart } from './FunnelChart';

export default function FunnelChartDemo() {
  return (
    <div style={{ width: '100%' }}>
      <FunnelChart title="Signup to paid" shareLabel="of signups"
        stages={['Signed up', 'Opened a file', 'Ran the agent', 'Invited a teammate', 'Paid']}
        views={[
          { key: 'all', label: 'All', values: [12400, 9180, 6420, 2310, 1490], insight: 'The biggest drop is after the first agent run. 64% never invite a teammate.' },
          { key: 'team', label: 'Teams', values: [4100, 3570, 2980, 1890, 1210], insight: 'Teams convert well. Most drop off at payment, so the plan page matters most here.' },
          { key: 'solo', label: 'Solo', values: [8300, 5610, 3440, 420, 280], insight: 'Solo users rarely invite anyone. Try a paid plan that does not need a team.' }
        ]} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | Like "Signup to paid" |
| `stages` | `string[]` | The stages in order, like "Signed up" then "Opened a file" |
| `views` | `FunnelChartView[]` | One set of numbers per view. With more than one, a switch picks between them |
| `view` (optional) | `string` | Key of the view shown. Leave it out to let the switch change it |
| `defaultView` (optional) | `string` | Defaults to the first view |
| `onViewChange` (optional) | `(key: string) => void` |  |
| `shareLabel` (optional) | `string` | Ends a stage's tip, like "of signups" in "51.8% of signups" |
| `startLabel` (optional) | `string` | The first stage's tip |
| `format` (optional) | `(n: number) => string` | Writes a count. Defaults to whole numbers like 12,400 |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import FunnelChart from '../components/designme/funnel-chart/FunnelChart.astro';
---
<FunnelChart />
<FunnelChart data-style="soft" class="my-class" />
```
It plays its demo; change `funnel-chart.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does the component write the insight text?**

No. You pass it as `insight` on each view, for example a summary your agent produced. The component only picks out and marks the biggest drop.

**How is the biggest drop chosen?**

It is the stage whose count is the smallest fraction of the stage before it, which is not always the largest absolute loss.

**How do I word the hover tip for my data?**

Set `shareLabel`, like "of signups", to read "51.8% of signups", and `startLabel` for the first stage's tip.

**Can I show a single funnel without the switch?**

Yes. Pass one entry in `views`. The switch only appears when there is more than one, and the note only shows if a view has an `insight`.

## Source

`FunnelChart.tsx`, as `npx designme add funnel-chart --react` installs it:

```tsx
'use client';
import { formatCount, useStagger } from '../lib/chart';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Seg, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './funnel-chart.css';

export interface FunnelChartView {
  key: string;
  /** On the switch, like "Teams" */
  label: string;
  /** How many reached each stage, in order */
  values: number[];
  /** The agent's note under the funnel for this view */
  insight?: string;
}

export interface FunnelChartProps {
  /** Like "Signup to paid" */
  title: string;
  /** The stages in order, like "Signed up" then "Opened a file" */
  stages: string[];
  /** One set of numbers per view. With more than one, a switch picks between them */
  views: FunnelChartView[];
  /** Key of the view shown. Leave it out to let the switch change it */
  view?: string;
  /** Defaults to the first view */
  defaultView?: string;
  onViewChange?: (key: string) => void;
  /** Ends a stage's tip, like "of signups" in "51.8% of signups" */
  shareLabel?: string;
  /** The first stage's tip */
  startLabel?: string;
  /** Writes a count. Defaults to whole numbers like 12,400 */
  format?: (n: number) => string;
  className?: string;
}

/** How many people reach each stage, with the biggest drop marked and a note from the agent. */
export function FunnelChart({ title, stages, views, view, defaultView, onViewChange, shareLabel = 'of the first stage', startLabel = 'Starting point', format = formatCount, className }: FunnelChartProps) {
  const [cur, setCur] = useControllable(view, defaultView ?? views[0]?.key ?? '', onViewChange);
  // the bars draw a moment after the funnel appears, then redraw top to bottom on every switch
  const at = useStagger(cur, stages.length, 70, 150);
  const byKey = (k: string | null) => views.find(v => v.key === k);
  const shown = byKey(at[0]);
  const d = shown?.values ?? [];
  // the stage that loses the largest share of the one before it
  let worst = -1, ratio = 1;
  d.forEach((n, i) => { if (i && n / d[i - 1] < ratio) { ratio = n / d[i - 1]; worst = i; } });
  const insight = views.some(v => v.insight);

  return (
    <div data-dm="" className={cx('dm-fnx dm-panel', className)}>
      <div className="dm-fnx-h">
        <b>{title}</b>
        {views.length > 1 && (
          <Seg className="dm-fnx-sg" label="Segment" value={cur} onChange={setCur} options={views.map(v => ({ value: v.key, label: v.label }))} />
        )}
      </div>
      <div className="dm-fnx-rows">
        {stages.map((stage, i) => {
          const own = byKey(at[i])?.values, w = own ? Math.max(6, own[i] / own[0] * 100) : 0, out = !!own && w < 24;
          const track = (
            <div className="dm-tr">
              <div className="dm-bar" style={{ width: w + '%' }} />
              <span className={cx('dm-n dm-num', out && 'dm-out')} style={own ? { left: out ? `calc(${w}% + 8px)` : 10 } : undefined}>{shown && format(d[i])}</span>
            </div>
          );
          return (
            <div key={i} className={cx('dm-fnx-r', i === worst && 'dm-drop')} style={{ ['--dm-fc' as string]: `color-mix(in oklab,var(--dm-c1) ${Math.round(100 - i * 100 / Math.max(1, stages.length - 1))}%,var(--dm-c2))` }}>
              <span className="dm-k">{stage}</span>
              {shown ? <Tip label={i ? `${Math.round(d[i] / d[0] * 1000) / 10}% ${shareLabel}` : startLabel}>{track}</Tip> : track}
              <span className="dm-v dm-num">{shown && (i ? '−' + Math.round((1 - d[i] / d[i - 1]) * 100) + '%' : '100%')}</span>
            </div>
          );
        })}
      </div>
      {insight && (
        <div className="dm-fnx-ins">
          <span className="dm-fnx-ic"><Icon name="spark" size="xs" /></span>
          <Swap>{shown?.insight ?? ''}</Swap>
        </div>
      )}
    </div>
  );
}
```

## More in Charts and tables

- [Line chart](https://designme.dev/components/line-chart.md): Two series over time with a hover readout and toggles.
- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
- [Donut chart](https://designme.dev/components/donut-chart.md): Where the agent's time went, by kind of task.
- [Radial goals](https://designme.dev/components/radial-goals.md): Each agent's share of its own target as a ring, with the overall score in the middle.
- [Top pages](https://designme.dev/components/top-pages.md): Most visited pages with share of traffic and a quick sort.
- [Health score](https://designme.dev/components/health-score.md): A design system score made of a few checks you can open.
- [Score breakdown](https://designme.dev/components/score-breakdown.md): A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.
- [Eval radar](https://designme.dev/components/radar-chart.md): This run against the baseline on six eval scores, with the weak ones flagged.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
