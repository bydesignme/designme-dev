# Trace view

> One agent run as a waterfall of spans, with latency and tokens.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/trace-view

## Install

```sh
npx designme add trace-view          # HTML, CSS and JS, with the shared core
npx designme add trace-view --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Trace view lays one agent run out as an observability waterfall: every span, whether an LLM call, a tool call, a retrieval or a sub-agent, sits on a shared time axis, nested under the span that started it, with its tokens and latency. A tool call that runs over its time budget turns amber and is tagged slow, and any span opens to show its input, output, latency and tokens.

### When to use it

- When people debug or review what an agent did in one run, and where the time and tokens went.
- When a run streams in live and people want to watch each step start and finish.
- When a slow or costly step should stand out without reading every number.
- When people need the exact input and output of one step, like the request a tool made and what came back.

### What it does

- `spans` is the run as a tree: each span has a `name`, a `kind` of `agent`, `llm`, `tool` or `retrieval`, a `start` and a `duration` in seconds, its `tokens`, and `children`. An agent span without its own `tokens` adds up every span under it.
- Each kind has its own mark and colour, and its name in a tooltip on the mark. Each row shows its bar on the time axis, its tokens and its latency; the header shows the run's total time.
- `time` streams a run in: spans that start later stay hidden, and a span without a `duration` grows up to it. Leave it out once the run is over.
- A tool call that takes longer than `slowAfter` seconds (2 by default) turns amber and gets a slow tag, with the budget in its tooltip.
- Pressing a span opens its details under the waterfall: its kind, latency, tokens, input and output. Pressing it again, the close button or Escape shuts them.
- On a narrow card the names keep their room: the tokens column and the slow tag give way, the amber bar and time still mark a slow span, and every span's tokens stay in its details.

### Accessibility

- Each span is a button in a labelled group, named with its name, kind, latency and tokens, and whether it is still running or slow.
- Each span says whether its details are open, and the details are a labelled region.
- The arrow keys, Home and End move between spans, and Escape closes the details and puts focus back on the span.
- The line under the title is announced politely when it changes.
- With reduced motion nothing slides or fades; the bars and numbers still update.

## Usage in React

```tsx
import { TraceView } from '@/components/designme/trace-view/TraceView';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { TraceView, type TraceSpan } from './TraceView';
import { useStory } from '../lib/useScript';

/* ---------- Trace view: the run streams in, the page fetch runs long and turns amber, and the person opens it ---------- */
type Flat = Omit<TraceSpan, 'children'> & { duration: number; parent?: string };
const RUN: Flat[] = [
  { id: 'run', kind: 'agent', name: 'Pricing research', start: 0, duration: 4.82, input: "Compare Northwind's plans with ours", output: '3 prices saved to Pricing research' },
  { id: 'plan', parent: 'run', kind: 'llm', name: 'Plan the steps', start: .04, duration: .62, tokens: 1240, input: 'The task and 2 earlier messages', output: 'Search notes, fetch the page, summarise' },
  { id: 'notes', parent: 'run', kind: 'retrieval', name: 'Search saved notes', start: .7, duration: .38, tokens: 910, input: '"northwind pricing", top 4', output: '4 notes, best match 0.82' },
  { id: 'fetch', parent: 'run', kind: 'tool', name: 'fetch_page', start: 1.12, duration: 2.46, tokens: 3120, input: 'GET northwind.app/pricing', output: '200 OK, 48 KB, 3 plans' },
  { id: 'sum', parent: 'run', kind: 'agent', name: 'Summariser', start: 3.62, duration: 1.02, input: 'The page and 4 notes', output: 'A 120-word summary' },
  { id: 'write', parent: 'sum', kind: 'llm', name: 'Write the summary', start: 3.66, duration: .94, tokens: 2380, input: 'Page text and notes, 2,050 tokens', output: '120 words, 3 prices' },
  { id: 'ans', parent: 'run', kind: 'llm', name: 'Final answer', start: 4.66, duration: .16, tokens: 560, input: 'The summary', output: '3 prices saved to Pricing research' }
];
const END = 4.82, PACE = 1.5;

// the spans as they stand `t` seconds into the run: a running one has no duration yet, and its tokens count up
function at(t: number, parent?: string): TraceSpan[] {
  return RUN.filter(x => x.parent === parent && x.start <= t).map(({ parent: _, duration, tokens, ...x }) => {
    const done = t >= x.start + duration, kids = at(t, x.id);
    return { ...x, duration: done ? duration : undefined, tokens: tokens === undefined ? undefined : Math.round(tokens * Math.min(1, (t - x.start) / duration)), children: kids.length ? kids : undefined };
  });
}

export default function TraceViewDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [t, setT] = useState(0);
  const [open, setOpen] = useState<string | null>(null);
  // the run streams in at a pace a person can follow: one second of the run every 1.5 seconds
  useEffect(() => {
    let raf = 0, t0 = 0;
    const go = (now: number) => { t0 ||= now; const v = Math.min(END, (now - t0) / 1000 / PACE); setT(v); if (v < END) raf = requestAnimationFrame(go); };
    const start = setTimeout(() => { raf = requestAnimationFrame(go); }, 600);
    return () => { clearTimeout(start); cancelAnimationFrame(raf); };
  }, []);

  // the preview's story: open the slow fetch once the run is done, read it, then close it
  useStory(ref, async ({ wait, press }) => {
    await wait(9000); press('[data-id="fetch"]');
    await wait(4500); press('.dm-trv-x');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <TraceView title="Pricing research" spans={at(t)} time={t < END ? t : undefined} axis={5} selected={open} onSelectedChange={setOpen} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | The run's name, like "Pricing research" |
| `spans` | `TraceSpan[]` | The run's top spans, usually one root with everything nested under it |
| `time` (optional) | `number` | Seconds into the run while it streams in: spans that start later stay hidden, and running ones reach this far. Leave it out once the run is over |
| `axis` (optional) | `number` | Seconds the time axis covers. Defaults to the run's length, rounded up to a whole second |
| `slowAfter` (optional) | `number` | A tool call that takes longer than this many seconds turns amber and is tagged slow. Defaults to 2 |
| `status` (optional) | `string` | The line under the title. Defaults to "Running · 4 spans", then "Done · 7 spans, 1 slow" |
| `selected` (optional) | `string \| null` | The id of the open span, whose details show under the waterfall. null closes them |
| `defaultSelected` (optional) | `string \| null` |  |
| `onSelectedChange` (optional) | `(id: string \| null) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**Where do the spans come from?**

From your own tracing: OpenTelemetry, your model provider's logs or your agent framework's events. Map each to a name, kind, start, duration and tokens, nest them under their parent, and pass them in.

**Why are only tool calls flagged slow?**

In the demo a tool call that waits on another service is the usual culprit. `slowAfter` sets the budget in seconds; flagging other kinds would take a change to the component.

**What scale does the time axis use?**

It covers the run's length, rounded up to a whole second, unless you set `axis`. A faint line marks each tick and every other tick is labelled.

**Can the details open on the side instead of below?**

Not as it is. They open under the waterfall, so the card stays narrow enough to sit beside a chat.

## Source

`TraceView.tsx`, as `npx designme add trace-view --react` installs it:

```tsx
'use client';
import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Fold, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './trace-view.css';

export type SpanKind = 'agent' | 'llm' | 'tool' | 'retrieval';

export interface TraceSpan {
  id: string;
  /** Like "Plan the steps" or the tool's name, "fetch_page" */
  name: string;
  kind: SpanKind;
  /** When it started, in seconds from the start of the run */
  start: number;
  /** How long it took, in seconds. Leave it out while it runs: its bar grows to `time` */
  duration?: number;
  /** Tokens it used. An agent span without its own count adds up every span under it */
  tokens?: number;
  /** What went in and what came out, shown when the span is opened */
  input?: string;
  output?: string;
  children?: TraceSpan[];
}

export interface TraceViewProps {
  /** The run's name, like "Pricing research" */
  title: string;
  /** The run's top spans, usually one root with everything nested under it */
  spans: TraceSpan[];
  /** Seconds into the run while it streams in: spans that start later stay hidden, and running ones reach this far.
      Leave it out once the run is over */
  time?: number;
  /** Seconds the time axis covers. Defaults to the run's length, rounded up to a whole second */
  axis?: number;
  /** A tool call that takes longer than this many seconds turns amber and is tagged slow. Defaults to 2 */
  slowAfter?: number;
  /** The line under the title. Defaults to "Running · 4 spans", then "Done · 7 spans, 1 slow" */
  status?: string;
  /** The id of the open span, whose details show under the waterfall. null closes them */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  className?: string;
}

const KIND: Record<SpanKind, [string, IconName, string]> = {
  agent: ['Agent', 'cpu', 'var(--dm-muted)'], llm: ['LLM call', 'spark', 'var(--dm-c2)'], tool: ['Tool call', 'term', 'var(--dm-c6)'], retrieval: ['Retrieval', 'search', 'var(--dm-c3)']
};
const sec = (v: number) => v.toFixed(2) + 's';
const short = (v: number) => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v));
const tokensOf = (s: TraceSpan): number => s.tokens ?? (s.children ?? []).reduce((a, k) => a + tokensOf(k), 0);

/** One agent run as an observability waterfall: every span (LLM call, tool call, retrieval, sub-agent) on a shared time
    axis, nested under the span that started it, with its tokens and latency. A slow tool call turns amber, and any span
    opens to show its input, output, latency and tokens. */
export function TraceView({ title, spans, time, axis, slowAfter = 2, status, selected, defaultSelected = null, onSelectedChange, className }: TraceViewProps) {
  const [open, setOpen] = useControllable(selected, defaultSelected, onSelectedChange);
  const rows = useRef<HTMLDivElement>(null);
  const all: { s: TraceSpan; lv: number }[] = [];
  (function walk(list: TraceSpan[], lv: number) { list.forEach(s => { all.push({ s, lv }); if (s.children) walk(s.children, lv + 1); }); })(spans, 0);
  const end = Math.max(0, ...all.map(({ s }) => s.start + (s.duration ?? Math.max(0, (time ?? s.start) - s.start))));
  const span = axis ?? Math.max(1, Math.ceil(end));
  const now = time ?? Infinity;
  const shown = all.filter(({ s }) => s.start <= now);
  const took = (s: TraceSpan) => s.duration !== undefined ? Math.min(s.duration, now - s.start) : Math.max(0, (time ?? s.start) - s.start);
  const running = (s: TraceSpan) => s.duration === undefined || now < s.start + s.duration;
  const slow = (s: TraceSpan) => s.kind === 'tool' && took(s) > slowAfter;
  const nSlow = shown.filter(({ s }) => slow(s)).length;
  const live = shown.some(({ s }) => running(s));
  const line = status ?? (live ? `Running · ${shown.length} span${shown.length === 1 ? '' : 's'}` : `Done · ${shown.length} spans${nSlow ? `, ${nSlow} slow` : ''}`);
  // a label every other tick, and a faint line on every tick
  const tick = span <= 6 ? 1 : span <= 15 ? 2 : span <= 30 ? 5 : 10;
  const labels = Array.from({ length: Math.floor(span / tick / 2) + 1 }, (_, i) => i * tick * 2).filter(v => v < span);
  const grid: CSSProperties = { backgroundSize: `${(tick / span) * 100}% 100%` };
  const sel = open ? all.find(({ s }) => s.id === open)?.s : undefined;
  // the details keep the last span while they fold shut
  const last = useRef<TraceSpan | undefined>(undefined); if (sel) last.current = sel;
  const cur = sel ?? last.current;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const btns = [...(rows.current?.querySelectorAll<HTMLElement>('.dm-trv-r') ?? [])], i = btns.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const go = e.key === 'ArrowDown' ? btns[i + 1] : e.key === 'ArrowUp' ? btns[i - 1] : e.key === 'Home' ? btns[0] : e.key === 'End' ? btns[btns.length - 1] : null;
    if (!go && !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault(); go?.focus({ preventScroll: true });
  };
  // closing hands focus back to the span, if it was inside the details
  const close = (back: boolean) => {
    const id = open; setOpen(null);
    if (back && id) rows.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus({ preventScroll: true });
  };

  return (
    <div data-dm="" className={cx('dm-trv dm-panel', className)} onKeyDown={e => { if (e.key === 'Escape' && open) close(true); }}>
      <div className="dm-trv-h">
        <div className="dm-trv-ht"><b>{title}</b><span className="dm-muted dm-trv-st" aria-live="polite"><Swap>{line}</Swap></span></div>
        <span className="dm-trv-tot dm-num">{sec(Math.min(end, now))}</span>
      </div>
      <div className="dm-trv-ax" aria-hidden="true">
        <span>Span</span>
        <span className="dm-trv-sc">{labels.map(v => <span key={v} style={{ left: `${(v / span) * 100}%` }}>{v}s</span>)}</span>
        <span className="dm-trv-tk">Tokens</span><span className="dm-trv-ms">Time</span>
      </div>
      <div ref={rows} className="dm-trv-rows" role="group" aria-label="Spans" onKeyDown={onKey}>
        {shown.map(({ s, lv }) => {
          const [kind, icon, col] = KIND[s.kind], w = took(s), tk = tokensOf(s), run = running(s), sl = slow(s);
          const why = `Over the ${slowAfter}s budget for a tool call`;
          return (
            <button key={s.id} type="button" data-id={s.id} className={cx('dm-trv-r dm-enter', !lv && 'dm-root', run && 'dm-run', sl && 'dm-slow')}
              style={{ '--dm-k': col, '--dm-lv': lv } as CSSProperties} aria-expanded={open === s.id}
              aria-label={`${s.name}, ${kind}, ${run ? 'running, ' : ''}${sec(w)}, ${Math.round(tk).toLocaleString('en-US')} tokens${sl ? ', slow' : ''}`}
              onClick={() => setOpen(open === s.id ? null : s.id)}>
              <span className="dm-trv-n">
                <Tip label={kind}><span className="dm-trv-k"><Icon name={icon} size="xs" /></span></Tip>
                <span className="dm-trv-nm">{s.name}</span>
                {sl && <Tip label={why}><span className={cx('dm-tag dm-warn', enter().className)}>slow</span></Tip>}
              </span>
              <span className="dm-trv-b" style={grid}><i style={{ left: `${(s.start / span) * 100}%`, width: `${(w / span) * 100}%` }} /></span>
              <span className="dm-trv-tk dm-num">{short(tk)}</span>
              {sl ? <Tip label={why}><span className="dm-trv-ms dm-num">{sec(w)}</span></Tip> : <span className="dm-trv-ms dm-num">{sec(w)}</span>}
            </button>
          );
        })}
      </div>
      <Fold open={!!sel} className="dm-trv-dt">
        {cur && (
          <div key={cur.id} className="dm-trv-dc dm-enter" role="region" aria-label="Span details">
            <div className="dm-trv-dh">
              <span className="dm-trv-k" style={{ '--dm-k': KIND[cur.kind][2] } as CSSProperties}><Icon name={KIND[cur.kind][1]} size="xs" /></span>
              <b>{cur.name}</b>{slow(cur) && <span className="dm-tag dm-warn">slow</span>}
              <Tip label="Close"><button type="button" className="dm-ib dm-trv-x" aria-label="Close details" onClick={e => close(e.currentTarget.contains(document.activeElement))}><Icon name="x" /></button></Tip>
            </div>
            <div className="dm-trv-kv">
              <div><span>Kind</span><b>{KIND[cur.kind][0]}</b></div>
              <div><span>Latency</span><b className="dm-num">{sec(took(cur))}</b></div>
              <div><span>Tokens</span><b className="dm-num">{Math.round(tokensOf(cur)).toLocaleString('en-US')}</b></div>
            </div>
            <div className="dm-trv-io">
              <span>Input</span><code>{cur.input ?? '–'}</code>
              <span>Output</span><code>{running(cur) ? 'Running…' : cur.output ?? '–'}</code>
            </div>
          </div>
        )}
      </Fold>
    </div>
  );
}
```

## More in Agent status

- [Thinking](https://designme.dev/components/thinking.md): The live trace, written as the agent works, then folded away.
- [Reasoning trail](https://designme.dev/components/reasoning-trail.md): The agent's plan, notes, sources and edits, after it thinks.
- [Agent lanes](https://designme.dev/components/agent-lanes.md): Several agents working in parallel, each with its own lane and hand-offs.
- [Agent tree](https://designme.dev/components/agent-tree.md): An orchestrator and its sub-agents, with cost rolled up per branch.
- [Agent inbox](https://designme.dev/components/agent-inbox.md): Every run that needs you, is running or is done, in one list.
- [Browser session](https://designme.dev/components/browser-session.md): The agent browsing for you, step by step, with Pause and Take over.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
