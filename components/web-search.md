# Web search

> The agent's searches as a trail: what it asked, what came back, what it read or skipped, and the answer with its sources.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/web-search

## Install

```sh
npx designme add web-search          # HTML, CSS and JS, with the shared core
npx designme add web-search --react  # React 19 component and its CSS
npx designme add web-search --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/web-search.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/web-search.json  # Astro
```

## About

The agent's web searches, shown as it makes them: each query with how many results came back and how long it took, the pages it opened under it with whether it read, skimmed or skipped each one and why (a paywall, a block, a timeout), and the sites it went to as a small stack of initials. A search that finds nothing is asked again in other words, right under it. Once done, the trail folds to one line, "3 searches, 6 pages read", and the answer streams in under it with numbered citations that light the pages they came from.

### When to use it

- When an agent searches the web before it answers, and people want to see what it looked at.
- When some pages couldn't be read and the answer should say so rather than hide it.
- In a chat stream, above the answer the searches led to.

### What it does

- A header that says what is happening (Searching for “…”, Reading 4 pages) and, once done, sums it up; it opens and folds the trail.
- Query rows with the query, the result count (No results in the warning colour) and the time; each opens to its pages.
- A query asked again in other words is marked "Asked again in other words" under it, right after the one that found nothing.
- Page rows with the site's initial, the title, the site and date, and a tag: Reading (with a spinner), Read, Skimmed, or Skipped with the reason as a warning tag.
- A stack of up to four site initials in the header, with the rest counted (+3).
- Citations in the answer ([1], [2]) are buttons: pointing at one or tabbing to it lights the page it came from (or its search, when that is folded) and its site's initial, and its tooltip names the page.
- Page titles cut short with an ellipsis show in full in a tooltip on hover and on keyboard focus.

### Accessibility

- The header and each query are buttons with aria-expanded; a closed trail or query is inert and hidden from screen readers.
- Each page row can take the focus and has a label with its title, site, date and status, like "Anyone switched from Stripe Billing to Orb?, reddit.com, May 2026: Skipped: blocked".
- Citations have labels that name their source, like "Source 2: Metronome vs Orb: a fair comparison, metronome.com".
- A role="status" region announces only changes of phase (each new search, then Done), never every page.
- Statuses are words, not only colours.

## Usage in React

```tsx
import { WebSearch } from '@/components/designme/web-search/WebSearch';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: two searches (the first finds nothing and is asked
// again), six pages read and one blocked, then the answer streams in with its sources.
import { useEffect, useState } from 'react';
import { WebSearch, type WebPage, type WebQuery } from './WebSearch';
import { useWait } from '../lib/useScript';

const PLAN: (Omit<WebQuery, 'status' | 'pages'> & { pages?: WebPage[] })[] = [
  { key: 'a', query: 'stripe usage based billing limits 2026 enterprise tier', results: 0, time: '0.6s' },
  { key: 'b', query: 'stripe usage-based billing limits', results: 5, time: '0.9s', rewritten: true, pages: [
    { title: 'Usage-based billing', domain: 'stripe.com', date: 'Oct 2026', status: 'read' }, { title: 'Meters and billing thresholds', domain: 'stripe.com', date: 'Sep 2026', status: 'read', cite: 1 },
    { title: 'How we moved 40k customers to usage billing', domain: 'medium.com', date: 'Mar 2026', status: 'skimmed' }, { title: 'Why SaaS pricing is moving to usage', domain: 'ft.com', date: 'Aug 2026', status: 'paywall' }] },
  { key: 'c', query: 'metronome vs orb usage billing', results: 6, time: '1.1s', pages: [
    { title: 'Metronome vs Orb: a fair comparison', domain: 'metronome.com', date: 'Jul 2026', status: 'read', cite: 2 }, { title: 'Orb pricing and plans', domain: 'withorb.com', date: 'Oct 2026', status: 'read' },
    { title: 'orb-billing/examples: sending usage events', domain: 'github.com', date: 'Jun 2026', status: 'read' }, { title: 'Anyone switched from Stripe Billing to Orb?', domain: 'reddit.com', date: 'May 2026', status: 'blocked' }] }
];
const ANSWER = 'Stripe caps metered usage at 100 million events a month for each meter [1]. Metronome and Orb both take events in bulk with no monthly cap [2]. At your volume Stripe still fits, with room to grow.';

export default function WebSearchDemo() {
  const wait = useWait();
  const [queries, setQueries] = useState<WebQuery[]>([]);
  const [done, setDone] = useState(false);
  const [answer, setAnswer] = useState('');
  // the agent at work: nothing here waits on the visitor, so it carries on under the pointer
  useEffect(() => { void (async () => {
    await wait(500);
    for (const q of PLAN) {
      setQueries(qs => [...qs, { ...q, status: 'searching', pages: undefined }]); await wait(1100);
      setQueries(qs => qs.map(x => x.key === q.key ? { ...x, status: 'done' } : x));
      for (const [i, p] of (q.pages || []).entries()) {
        setQueries(qs => qs.map(x => x.key === q.key ? { ...x, pages: [...(x.pages || []), { ...p, status: 'reading' }] } : x)); await wait(420);
        setQueries(qs => qs.map(x => x.key === q.key ? { ...x, pages: x.pages!.map((y, j) => j === i ? p : y) } : x));
      }
      await wait(500);
    }
    setDone(true); await wait(400);
    const ws = ANSWER.split(' ');
    for (let i = 1; i <= ws.length; i++) { setAnswer(ws.slice(0, i).join(' ')); await wait(50); }
  })(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <div style={{ width: '100%' }}><WebSearch queries={queries} done={done} answer={answer} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `queries` | `WebQuery[]` |  |
| `done` (optional) | `boolean` | True once the searching and reading are over: the trail folds to its summary |
| `answer` (optional) | `string` | The answer, with sources cited as [1], [2]. Each number points at the page with that `cite` |
| `open` (optional) | `boolean` | Whether the trail is open. Left to the component, it folds once `done` turns true |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `bare` (optional) | `boolean` | Without the panel, for a chat stream (true) |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import WebSearch from '../components/designme/web-search/WebSearch.astro';
---
<WebSearch />
<WebSearch data-style="soft" class="my-class" />
```
It plays its demo; change `web-search.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I link a citation to a page?**

Give the page `cite` (1, 2…) and write [1], [2] in `answer`. Each number becomes a button tied to the page with that `cite`.

**Can I keep the trail open when it is done?**

Yes. Control `open` and `onOpenChange`. Left to itself, the trail folds once `done` turns true.

**Does it run the searches?**

No. It shows what your agent reports: pass the queries and pages as they arrive and update their status.

## Source

`WebSearch.tsx`, as `npx designme add web-search --react` installs it:

```tsx
'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Fold, Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './web-search.css';

export interface WebPage {
  title: string;
  /** Like "stripe.com" */
  domain: string;
  /** Like "Oct 2026" */
  date?: string;
  /** reading while the agent opens it; the skipped ones say why */
  status: 'reading' | 'read' | 'skimmed' | 'paywall' | 'blocked' | 'timeout';
  /** The number the answer cites it by, as [1] */
  cite?: number;
}

export interface WebQuery {
  key: string;
  query: string;
  /** searching shimmers; done shows the count and the time */
  status: 'searching' | 'done';
  /** How many results came back; 0 says No results */
  results?: number;
  /** Like "0.9s" */
  time?: string;
  /** This query asks the one before it again in other words */
  rewritten?: boolean;
  pages?: WebPage[];
}

export interface WebSearchProps {
  queries: WebQuery[];
  /** True once the searching and reading are over: the trail folds to its summary */
  done?: boolean;
  /** The answer, with sources cited as [1], [2]. Each number points at the page with that `cite` */
  answer?: string;
  /** Whether the trail is open. Left to the component, it folds once `done` turns true */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Without the panel, for a chat stream (true) */
  bare?: boolean;
  className?: string;
}

const STATUS: Record<WebPage['status'], [string, string]> = { reading: ['Reading', ''], read: ['Read', ''], skimmed: ['Skimmed', ''], paywall: ['Skipped: paywall', 'dm-warn'], blocked: ['Skipped: blocked', 'dm-warn'], timeout: ['Skipped: timeout', 'dm-warn'] };

/** The agent's web searches as a trail: each query and what came back, each page read, skimmed or skipped and why, a summary once done, and an answer whose citations light their pages. */
export function WebSearch({ queries, done = false, answer, open, onOpenChange, bare = true, className }: WebSearchProps) {
  const [inner, setInner] = useState(true);
  useEffect(() => { if (done && open === undefined) setInner(false); }, [done]); // eslint-disable-line react-hooks/exhaustive-deps
  const isOpen = open ?? inner;
  const setOpen = (o: boolean) => { if (open === undefined) setInner(o); onOpenChange?.(o); };
  // each query's pages are open while it is being read, and fold once it is done; a person can open any of them
  const [qOpen, setQOpen] = useControllable<Record<string, boolean>>(undefined, {});
  const [hot, setHot] = useState<number | null>(null);
  const pages = queries.flatMap(q => (q.pages || []).map(p => ({ ...p, q: q.key })));
  const sites = [...new Set(pages.map(p => p.domain))];
  const read = pages.filter(p => p.status === 'read' || p.status === 'skimmed').length;
  const current = queries.find(q => q.status === 'searching'), reading = pages.filter(p => p.status === 'reading').length;
  const line = done ? `${queries.length} searches, ${read} pages read` : current ? `Searching for “${current.query}”` : reading ? `Reading ${reading} pages` : 'Searching the web';
  const cited = (n: number) => pages.find(p => p.cite === n);
  // only changes of phase are announced
  const [said, setSaid] = useState('');
  const last = useRef('');
  useEffect(() => { const t = done ? `Done: ${line}` : current ? `Searching for ${current.query}` : ''; if (t && t !== last.current) { last.current = t; setSaid(t); } }, [done, current?.key]); // eslint-disable-line react-hooks/exhaustive-deps
  const hotPage = hot != null ? cited(hot) : undefined;
  return (
    <div data-dm="" className={cx('dm-wsx', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <button type="button" className="dm-wsx-h" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <span className="dm-wsx-ic">{done ? <Icon name="globe" size="xs" /> : <Spin />}</span>
        <Swap className={cx('dm-wsx-st', !done && 'dm-shim')}>{line}</Swap>
        <span className="dm-wsx-marks" aria-hidden="true">{sites.slice(0, 4).map(s => <span key={s} className={cx(hotPage?.domain === s && 'dm-hl')}>{s[0].toUpperCase()}</span>)}{sites.length > 4 && <span className="dm-n">+{sites.length - 4}</span>}</span>
        <Icon name="chev-d" size="xs" />
      </button>
      <Fold open={isOpen}>
        <div className="dm-wsx-list">
          {queries.map(q => {
            const has = !!q.pages?.length, auto = q.pages?.some(p => p.status === 'reading') ?? false, o = has && (qOpen[q.key] ?? auto);
            const lit = hotPage && hotPage.q === q.key;
            return (
              <div key={q.key} className={cx('dm-wsx-q', lit && !o && 'dm-hl', 'dm-enter')}>
                <button type="button" className={cx('dm-wsx-qh', !has && 'dm-empty')} aria-expanded={o} onClick={() => has && setQOpen({ ...qOpen, [q.key]: !o })}
                  aria-label={q.status === 'done' ? `${q.query}: ${q.results ? q.results + ' results' : 'no results'}${q.time ? ', ' + q.time : ''}` : undefined}>
                  <Icon name="search" size="xs" /><span className={cx('dm-t', q.status === 'searching' && 'dm-shim')}>{q.query}</span>
                  <span className={cx('dm-n', q.status === 'done' && !q.results && 'dm-none')}>{q.status === 'searching' ? 'Searching' : q.results ? `${q.results} results` : 'No results'}</span>
                  <span className="dm-tm dm-num">{q.status === 'done' ? q.time : ''}</span><Icon name="chev-r" size="xs" />
                </button>
                {q.rewritten && <span className="dm-wsx-rw"><Icon name="refresh" size="xs" />Asked again in other words</span>}
                {has && <Fold open={o}><ul className="dm-wsx-rs">{q.pages!.map(p => (
                  <Tip key={p.title} label={`${p.title} · ${p.domain}`}>
                    <li tabIndex={0} className={cx('dm-wsx-r', 'dm-enter', p.status !== 'read' && p.status !== 'skimmed' && p.status !== 'reading' && 'dm-skip', lit && hotPage?.title === p.title && 'dm-hl')}
                      aria-label={`${p.title}, ${p.domain}${p.date ? ', ' + p.date : ''}: ${STATUS[p.status][0]}`}>
                      <span className="dm-wsx-fav" aria-hidden="true">{p.domain[0].toUpperCase()}</span>
                      <span className="dm-tx"><span className="dm-t">{p.title}</span><span className="dm-d">{p.domain}{p.date ? ' · ' + p.date : ''}</span></span>
                      <span className={cx('dm-tag', STATUS[p.status][1])}>{p.status === 'reading' && <Spin />}{STATUS[p.status][0]}</span>
                    </li>
                  </Tip>))}</ul></Fold>}
              </div>
            );
          })}
        </div>
      </Fold>
      {answer && <div className="dm-wsx-ans">{answer.split(/(\[\d+\])/).map((part, i) => { const m = part.match(/^\[(\d+)\]$/); if (!m) return <Fragment key={i}>{part}</Fragment>;
        const n = +m[1], p = cited(n);
        return <Tip key={i} label={p ? `${p.title} · ${p.domain}` : `Source ${n}`}><button type="button" className={cx('dm-wsx-cite', hot === n && 'dm-on')} aria-label={p ? `Source ${n}: ${p.title}, ${p.domain}` : `Source ${n}`}
          onPointerEnter={() => setHot(n)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(n)} onBlur={() => setHot(null)}>{n}</button></Tip>; })}</div>}
      <p className="dm-wsx-sr" role="status">{said}</p>
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and the sub-agents it spawns, with the active path and cost rolled up.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Trace view](https://designme.dev/components/trace-view.md): One agent run as a waterfall of spans, with latency and tokens.
- [Browser session](https://designme.dev/components/browser-session.md): The agent browsing for you, step by step, with Pause and Take over.
- [Agent phases](https://designme.dev/components/agent-phases.md): One line for which phase the agent is in, from thinking to done, that stops to ask you, says when it is slow, and folds to how long it took.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Agent jobs running, up next and done, with progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.
- [Thinking states](https://designme.dev/components/thinking-states.md): Six thinking indicators to pick from, each with a status line.

All components: https://designme.dev/llms.txt
