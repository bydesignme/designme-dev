# Top pages

> Most visited pages with share of traffic and a quick sort.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/top-pages

## Install

```sh
npx designme add top-pages          # HTML, CSS and JS, with the shared core
npx designme add top-pages --react  # React 19 component and its CSS
npx designme add top-pages --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/top-pages.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/top-pages.json  # Astro
```

## About

A ranked list of a site's most visited pages, each with its view count, a bar for its share and its change against the period before. A switch sorts the list by views or by change, and the rows slide to their new places. It fits a traffic card on an analytics or marketing dashboard.

### When to use it

- When you want a quick read on which pages get the most traffic.
- When people should spot the fastest growing or falling pages by sorting on change.
- When a dashboard has room for a compact list of pages.

### What it does

- Each row shows its rank, title, path, view count and a green or red change tag.
- A track under each title fills relative to the most viewed page, one row after another.
- The header shows the total views across all pages, counting up, followed by `period`.
- The Views and Change switch re-sorts the list, and rows slide to their new rank.
- Hovering a row shows a tooltip with the full address: the row's `tip`, or `site` plus the path.

### Accessibility

- The sort switch is a role="group" labelled "Sort", and its buttons use aria-pressed.
- The rows' fade-in is skipped and the total's count-up finishes at once when the user prefers reduced motion.

## Usage in React

```tsx
import { TopPages } from '@/components/designme/top-pages/TopPages';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: the totals roll up, the tracks fill in, and the switch re-sorts.
import { TopPages, type TopPagesPage } from './TopPages';

const PAGES: TopPagesPage[] = [
  { path: '/pricing', title: 'Pricing', views: 18420, change: 24 },
  { path: '/', title: 'Home', views: 15210, change: 3 },
  { path: '/components', title: 'Components', views: 9870, change: 41 },
  { path: '/docs/agent', title: 'Agent docs', views: 6340, change: -8 },
  { path: '/blog/soft-ui', title: 'Soft UI, the post', views: 4120, change: 112 },
  { path: '/changelog', title: 'Changelog', views: 2210, change: -14 }
];

export default function TopPagesDemo() {
  return <div style={{ width: '100%' }}><TopPages pages={PAGES} site="designme.dev" /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `pages` | `TopPagesPage[]` |  |
| `title` (optional) | `string` | Header text |
| `period` (optional) | `string` | After the total, like "last 30 days" |
| `site` (optional) | `string` | Put in front of each path in the row tips, like "designme.dev" |
| `sort` (optional) | `TopPagesSort` | How the rows are ordered. Leave it out to let the switch change it |
| `defaultSort` (optional) | `TopPagesSort` |  |
| `onSortChange` (optional) | `(sort: TopPagesSort) => void` |  |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import TopPages from '../components/designme/top-pages/TopPages.astro';
---
<TopPages />
<TopPages data-style="soft" class="my-class" />
```
It plays its demo; change `top-pages.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I show the full URL when someone hovers a row?**

Pass `site`, like "designme.dev", and each row's tooltip reads the site followed by the path. Set `tip` on a page to use your own text for that row.

**What does `change` mean?**

It is the percent change against the period before, like 24 or -8. Positive values show a green tag with a plus sign and negative values a red tag.

**Can I start the list sorted by change?**

Yes. Set `defaultSort` to 'change', or control it with `sort` and `onSortChange`.

## Source

`TopPages.tsx`, as `npx designme add top-pages --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useReducedMotion, useTween } from '../lib/hooks';
import { Seg, Tip } from '../lib/motion';
import '../designme.css';
import './top-pages.css';

export interface TopPagesPage {
  /** The page's path, like "/pricing" */
  path: string;
  /** Its name, like "Pricing" */
  title: string;
  /** Views over the period */
  views: number;
  /** Change against the period before, in percent, like 24 or -8 */
  change: number;
  /** Shown when you hover the row. Defaults to the site and the path, like "designme.dev/pricing" */
  tip?: string;
}

export type TopPagesSort = 'views' | 'change';

export interface TopPagesProps {
  pages: TopPagesPage[];
  /** Header text */
  title?: string;
  /** After the total, like "last 30 days" */
  period?: string;
  /** Put in front of each path in the row tips, like "designme.dev" */
  site?: string;
  /** How the rows are ordered. Leave it out to let the switch change it */
  sort?: TopPagesSort;
  defaultSort?: TopPagesSort;
  onSortChange?: (sort: TopPagesSort) => void;
  className?: string;
}

const ROW = 50;
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');

/** The most visited pages, with their views and change. Rows slide into place when the order changes. */
export function TopPages({ pages, title = 'Top pages', period = 'last 30 days', site, sort, defaultSort = 'views', onSortChange, className }: TopPagesProps) {
  const [by, setBy] = useControllable(sort, defaultSort, onSortChange);
  const reduce = useReducedMotion();
  const total = useTween(pages.reduce((a, p) => a + p.views, 0), 1000, 0);
  const max = Math.max(1, ...pages.map(p => p.views));
  const order = [...pages].sort((a, b) => by === 'views' ? b.views - a.views : b.change - a.change);

  // each track fills in a little after the one above it
  const [filled, setFilled] = useState(0);
  useEffect(() => {
    const ts = pages.map((_, i) => setTimeout(() => setFilled(n => Math.max(n, i + 1)), 200 + i * 70));
    return () => ts.forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // the rows fade in from a blur, one after another
  const list = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (reduce || !list.current) return;
    [...list.current.children].forEach((row, i) => row.animate([{ opacity: 0, filter: 'blur(4px)' }, { opacity: 1, filter: 'blur(0)' }], { duration: 450, delay: i * 50, easing: 'ease-out', fill: 'backwards' }));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-dm="" className={cx('dm-tpx dm-panel', className)}>
      <div className="dm-tpx-h">
        <div><b>{title}</b><span className="dm-muted dm-tpx-sub"><span className="dm-num dm-tpx-tot">{fmt(total)}</span> views, {period}</span></div>
        <Seg className="dm-tpx-sg" label="Sort" value={by} onChange={setBy} options={[{ value: 'views', label: 'Views' }, { value: 'change', label: 'Change' }]} />
      </div>
      <div className="dm-tpx-list" ref={list} style={{ height: pages.length * ROW }}>
        {pages.map((p, i) => {
          const at = order.indexOf(p);
          return (
            <Tip key={p.path} label={p.tip ?? (site ? site + p.path : p.path)}>
              <div className="dm-tpx-r" style={{ transform: `translateY(${at * ROW}px)` }}>
                <span className="dm-rk">{at + 1}</span>
                <span className="dm-pg">
                  <span className="dm-p">{p.title} <span className="dm-muted">{p.path}</span></span>
                  <span className="dm-tr"><i style={{ width: i < filled ? p.views / max * 100 + '%' : 0 }} /></span>
                </span>
                <span className="dm-n dm-num">{fmt(p.views)}</span>
                <span className={cx('dm-tag dm-ch dm-num', p.change >= 0 ? 'dm-ok' : 'dm-bad')}>{p.change >= 0 ? '+' : '−'}{Math.abs(p.change)}%</span>
              </div>
            </Tip>
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
- [Health score](https://designme.dev/components/health-score.md): A design system score made of a few checks you can open.
- [Score breakdown](https://designme.dev/components/score-breakdown.md): A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.
- [Eval radar](https://designme.dev/components/radar-chart.md): This run against the baseline on six eval scores, with the weak ones flagged.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
