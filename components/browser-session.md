# Browser session

> The agent browsing for you, step by step, with Pause and Take over.

Agent components / Agent status. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/browser-session

## Install

```sh
npx designme add browser-session          # HTML, CSS and JS, with the shared core
npx designme add browser-session --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Browser session shows an agent browsing the web for a person: a small browser frame with the address bar and the page it is on, the steps it takes under it, and Pause and Take over. When the page gets in its way, like a cookie banner over the table it came to read, the step turns amber, says why, and waits for the person to let it go on or take over.

### When to use it

- When an agent uses a browser on the person's behalf, to search, open sites, click and read pages.
- When people should see where the agent is and what it does next, and be able to stop it at any moment.
- When the agent can hit something it shouldn't decide alone, like a cookie banner, a login or a payment form, and needs a person's go-ahead.
- When a person may want to step in and use the page themselves, then hand it back.

### What it does

- `url` fills the address bar, with a padlock, or a magnifier when `search` marks it as a search. `children` is the page itself, 156px tall: a screenshot or live view of the agent's browser, or a wireframe drawn with the `dm-bws-pg` classes, as in the demo.
- `cursor` draws the agent's own pointer over the page, in the accent colour, and `down` presses it.
- `steps` lists what the agent does. A queued step shows a dot, the running one spins, a finished one gets a green check, and a waiting one an amber mark. Each can carry a `detail` line, like "2 of 3 prices".
- `ask` adds a button under the waiting step, like "Allow closing it", with Take over beside it.
- Pause holds the agent and turns into Resume. Take over hands the page to the person: the frame turns the accent colour, the page's own controls become usable, and the button reads Hand back.
- The line under the title reads Browsing, Paused, Needs you, You have control or Done, with a clock that counts while the agent browses. `summary` shows under the steps once every step is done.

### Accessibility

- The steps are an ordered list, and the running or waiting step is marked as the current step.
- Pause and Take over are buttons: Pause is named Pause or Resume, and Take over is a toggle button that reads Hand back while pressed.
- The line under the title is announced politely when it changes.
- While the agent drives, the page is inert, so nothing in it can be focused or pressed until the person takes over.
- With reduced motion nothing glides or fades; the steps and the page still change.

## Usage in React

```tsx
import { BrowserSession } from '@/components/designme/browser-session/BrowserSession';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { BrowserSession, type BrowserStep } from './BrowserSession';
import { cx } from '../lib/cx';
import { Icon } from '../lib/icons';
import { useScript, useStory, useWait } from '../lib/useScript';

/* ---------- Browser session: the agent searches, opens the site, goes to pricing, stops at a cookie banner and asks; once
   it may close it, it reads the table and takes the three prices ---------- */
const LABELS = ['Search "northwind pricing"', 'Open northwind.app', 'Click "Pricing"', 'Read the plans table', 'Extract prices'];
type PageName = 'search' | 'home' | 'pricing';

// the page, drawn small with the component's own wireframe classes; in your app this is a screenshot or live view
function Page({ page, scroll, banner, hits, aim, onBanner }: { page: PageName; scroll: number; banner: boolean; hits: number; aim: string | null; onBanner: () => void }) {
  const k = (key: string) => ({ 'data-k': key, className: aim === key ? 'dm-aim' : undefined });
  const nav = (on: boolean) => (
    <div className="dm-bws-nav"><b>Northwind</b><span>Product</span><span data-k="pricing" className={cx(on && 'dm-on', aim === 'pricing' && 'dm-aim')}>Pricing</span><span>Docs</span></div>
  );
  return (
    <>
      {page === 'search' && (
        <div key="search" className="dm-bws-pg dm-enter">
          <div className="dm-bws-q"><Icon name="search" size="xs" /><span>northwind pricing</span></div>
          <div className="dm-bws-res"><b {...k('site')}>Northwind · Docs your team reads</b><span>northwind.app</span></div>
          <div className="dm-bws-res"><b>Northwind review: is it worth it?</b><span>softwarenotes.io</span></div>
          <div className="dm-bws-res"><b>Northwind alternatives</b><span>stackcompare.com</span></div>
        </div>
      )}
      {page === 'home' && (
        <div key="home" className="dm-bws-pg dm-enter">
          {nav(false)}<div className="dm-bws-hd">Docs your team actually reads</div>
          <span className="dm-bws-ln" style={{ width: '92%' }} /><span className="dm-bws-ln" style={{ width: '68%' }} /><span className="dm-bws-cta">Start free</span>
        </div>
      )}
      {page === 'pricing' && (
        <div key="pricing" className="dm-bws-pg dm-enter" style={{ transform: `translateY(${-scroll}px)` }}>
          {nav(true)}<div className="dm-bws-hd">Plans and pricing</div><span className="dm-bws-ln" style={{ width: '78%' }} />
          <div className="dm-bws-tb">
            <div><span>Plan</span><span>Per seat, monthly</span></div>
            {[['Starter', '$8'], ['Team', '$16'], ['Business', '$32']].map(([plan, price], i) => (
              <div key={plan}><span>{plan}</span><span data-k={'p' + i} className={cx('dm-num', i < hits && 'dm-hit', aim === 'p' + i && 'dm-aim')}>{price}</span></div>
            ))}
          </div>
          <span className="dm-bws-ln" style={{ width: '64%' }} /><span className="dm-bws-ln" style={{ width: '40%' }} />
        </div>
      )}
      <div className={cx('dm-bws-ck', banner && 'dm-on')}>
        <span>This site uses cookies</span>
        <button type="button" data-k="reject" className={aim === 'reject' ? 'dm-aim' : undefined} onClick={onBanner}>Reject all</button>
        <button type="button" onClick={onBanner}>Accept all</button>
      </div>
    </>
  );
}

export default function BrowserSessionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const later = useWait();
  const [steps, setSteps] = useState<BrowserStep[]>(LABELS.map(label => ({ label, state: 'queued' })));
  const [page, setPage] = useState<PageName>('search');
  const [url, setUrl] = useState('northwind pricing');
  const [scroll, setScroll] = useState(0);
  const [banner, setBanner] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [hits, setHits] = useState(0);
  const [aim, setAim] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number; down?: boolean } | null>(null);
  const [paused, setPaused] = useState(false);
  const [mine, setMine] = useState(false);
  const [summary, setSummary] = useState<string>();
  // the run reads these between its moves, so Pause and Take over hold it where it is
  const held = useRef({ paused, mine }); held.current = { paused, mine };
  const unblock = useRef<() => void>(undefined);
  const step = (i: number, state: BrowserStep['state'], detail?: string) => setSteps(s => s.map((x, j) => j === i ? { ...x, state, detail } : x));

  const vp = () => ref.current?.querySelector<HTMLElement>('.dm-bws-vp');
  const where = (key: string) => {
    const v = vp(), el = v?.querySelector<HTMLElement>(`[data-k="${key}"]`); if (!v || !el) return null;
    const a = v.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: b.left - a.left + Math.min(b.width * .5, 36), y: b.top - a.top + b.height * .6 };
  };
  // waits that only count while the agent may move
  const act = async (wait: (ms: number) => Promise<void>, ms: number) => { for (let left = ms; left > 0;) { await wait(100); if (!held.current.paused && !held.current.mine) left -= 100; } };
  const pressAt = async (wait: (ms: number) => Promise<void>, key: string) => {
    await wait(50); const p = where(key); if (!p) return;
    setAim(key); setCursor(p); await act(wait, 800);
    setCursor({ ...p, down: true }); await act(wait, 200); setCursor(p); setAim(null);
  };

  useScript(async ({ wait }) => {
    step(0, 'running'); await act(wait, 1800); step(0, 'done'); step(1, 'running');
    await pressAt(wait, 'site'); setPage('home'); setUrl('northwind.app');
    await act(wait, 1200); step(1, 'done'); step(2, 'running');
    await pressAt(wait, 'pricing'); setPage('pricing'); setUrl('northwind.app/pricing');
    await act(wait, 1000); step(2, 'done'); step(3, 'running');
    await act(wait, 600);
    const pg = vp()?.querySelector<HTMLElement>('.dm-bws-pg'), tb = pg?.querySelector<HTMLElement>('.dm-bws-tb');
    if (pg && tb) setScroll(Math.max(0, Math.min(pg.offsetHeight - vp()!.clientHeight, tb.offsetTop - 8)));
    await act(wait, 1200); setBanner(true); await act(wait, 500);
    // the banner covers the table: the agent stops and asks
    setBlocked(true); step(3, 'waiting');
    await new Promise<void>(res => { unblock.current = res; });
    step(3, 'running');
    await act(wait, 1400); step(3, 'done', '3 plans, priced per seat'); step(4, 'running', '0 of 3 prices');
    for (let i = 0; i < 3; i++) { await pressAt(wait, 'p' + i); setHits(i + 1); step(4, 'running', `${i + 1} of 3 prices`); }
    await act(wait, 500); setCursor(null);
    step(4, 'done', '$8, $16 and $32 per seat'); setSummary('Done · 3 prices saved to Pricing research');
  });

  // Allow lets the agent close the banner itself, with Reject all
  const allow = async () => {
    setBlocked(false); step(3, 'running', 'Closing the banner');
    await pressAt(later, 'reject'); setBanner(false); unblock.current?.();
  };
  // with the page in hand, the person can close the banner themselves
  const closeBanner = () => { if (!mine || !blocked) return; setBanner(false); setBlocked(false); unblock.current?.(); };

  // the preview's story: the agent stops at the cookie banner, and the person lets it close it
  useStory(ref, async ({ wait, press }) => { await wait(10000); press('.dm-bws-ask .dm-primary'); });

  const shown = steps.map((s, i) => i === 3 && blocked ? { ...s, detail: mine ? 'Close the banner, then hand back' : 'A cookie banner covers the table' } : s);
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <BrowserSession title="Pricing research" url={url} search={page === 'search'} cursor={cursor} steps={shown}
        ask={blocked ? { label: 'Allow closing it', onAllow: () => void allow() } : undefined}
        paused={paused} onPausedChange={setPaused} inControl={mine} onInControlChange={setMine} summary={summary}>
        <Page page={page} scroll={scroll} banner={banner} hits={hits} aim={aim} onBanner={closeBanner} />
      </BrowserSession>
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | What the agent is browsing for, like "Pricing research" |
| `url` | `string` | The address bar: the page's address, or the search being typed |
| `search` (optional) | `boolean` | Marks `url` as a search, with a magnifier instead of the padlock |
| `children` (optional) | `ReactNode` | The page, 156px tall: a screenshot or live view of the agent's browser, or a wireframe drawn with the dm-bws-pg classes |
| `cursor` (optional) | `{ x: number; y: number; down?: boolean } \| null` | The agent's own pointer, in pixels from the page's top left. `down` presses it. Hidden while the person has control |
| `steps` | `BrowserStep[]` |  |
| `ask` (optional) | `{ label: string; onAllow: () => void }` | While a step waits for the person: the button that lets the agent go on, like "Allow closing it". Take over sits beside it |
| `paused` (optional) | `boolean` | Pause holds the agent where it is; the button turns into Resume |
| `defaultPaused` (optional) | `boolean` |  |
| `onPausedChange` (optional) | `(paused: boolean) => void` |  |
| `inControl` (optional) | `boolean` | Take over hands the page to the person: its frame turns the accent colour, its controls become usable, and the button reads Hand back |
| `defaultInControl` (optional) | `boolean` |  |
| `onInControlChange` (optional) | `(inControl: boolean) => void` |  |
| `seconds` (optional) | `number` | Seconds to show as m:ss. Leave it out to let the clock count while the agent is browsing |
| `status` (optional) | `string` | The line under the title. Defaults to Browsing, Paused, Needs you, You have control or Done, then the clock |
| `summary` (optional) | `string` | Shown under the steps once every step is done, like "Done · 3 prices saved to Pricing research" |
| `className` (optional) | `string` |  |

## Questions

**Does the component run a browser?**

No. It shows one. Pass the address, a picture or live view of the page, the agent's pointer and its steps from your own agent, and handle Pause, Take over and the ask in your code.

**What happens when the person takes over?**

`onInControlChange` is called with `true`, the page becomes usable and the agent's pointer hides. Hold your agent until it is called with `false`, when the person presses Hand back.

**How did the demo close the cookie banner?**

Once the person allowed it, the agent pressed Reject all, so it never agreed to cookies for them. With Take over the person can close it with either button.

**Can I show a real screenshot instead of the wireframe?**

Yes. Pass an image or a video as `children`. The page area is 156px tall and clips what doesn't fit.

## Source

`BrowserSession.tsx`, as `npx designme add browser-session --react` installs it:

```tsx
'use client';
import { useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './browser-session.css';

export type BrowserStepState = 'queued' | 'running' | 'waiting' | 'done';

export interface BrowserStep {
  /** What the agent does, like 'Click "Pricing"' */
  label: string;
  state: BrowserStepState;
  /** A quiet line under the step, like "2 of 3 prices". On a waiting step it says what is in the way, in amber */
  detail?: string;
}

export interface BrowserSessionProps {
  /** What the agent is browsing for, like "Pricing research" */
  title: string;
  /** The address bar: the page's address, or the search being typed */
  url: string;
  /** Marks `url` as a search, with a magnifier instead of the padlock */
  search?: boolean;
  /** The page, 156px tall: a screenshot or live view of the agent's browser, or a wireframe drawn with the dm-bws-pg classes */
  children?: ReactNode;
  /** The agent's own pointer, in pixels from the page's top left. `down` presses it. Hidden while the person has control */
  cursor?: { x: number; y: number; down?: boolean } | null;
  steps: BrowserStep[];
  /** While a step waits for the person: the button that lets the agent go on, like "Allow closing it". Take over sits beside it */
  ask?: { label: string; onAllow: () => void };
  /** Pause holds the agent where it is; the button turns into Resume */
  paused?: boolean;
  defaultPaused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  /** Take over hands the page to the person: its frame turns the accent colour, its controls become usable, and the button reads Hand back */
  inControl?: boolean;
  defaultInControl?: boolean;
  onInControlChange?: (inControl: boolean) => void;
  /** Seconds to show as m:ss. Leave it out to let the clock count while the agent is browsing */
  seconds?: number;
  /** The line under the title. Defaults to Browsing, Paused, Needs you, You have control or Done, then the clock */
  status?: string;
  /** Shown under the steps once every step is done, like "Done · 3 prices saved to Pricing research" */
  summary?: string;
  className?: string;
}

const CLS: Record<BrowserStepState, string> = { queued: 'dm-queued', running: 'dm-run', waiting: 'dm-wait', done: 'dm-done' };
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function Glyph({ state }: { state: BrowserStepState }) {
  // a glyph plays its entrance when its step changes state, not when it first renders
  const [first] = useState(state);
  const e = state !== first ? enter() : undefined;
  return (
    <span key={state} className={cx('dm-g', e?.className)} style={e?.style} aria-hidden="true">
      {state === 'running' ? <Spin /> : state === 'done' ? <Icon name="ok" size="xs" /> : state === 'waiting' ? <Icon name="alert" size="xs" /> : <span className="dm-dot" />}
    </span>
  );
}

/** The agent browsing the web for the person: a small browser frame with the page it is on, the steps it takes under it,
    and Pause and Take over. When a step waits for the person, it shows why and a button to let the agent go on. */
export function BrowserSession({ title, url, search, children, cursor, steps, ask, paused, defaultPaused = false, onPausedChange,
  inControl, defaultInControl = false, onInControlChange, seconds, status, summary, className }: BrowserSessionProps) {
  const [isPaused, setPaused] = useControllable(paused, defaultPaused, onPausedChange);
  const [mine, setMine] = useControllable(inControl, defaultInControl, onInControlChange);
  const done = steps.length > 0 && steps.every(s => s.state === 'done');
  const waiting = steps.some(s => s.state === 'waiting');
  const counted = useSeconds(seconds === undefined && !done && !waiting && !isPaused && !mine);
  const secs = seconds ?? counted;
  const line = status ?? (done ? 'Done' : mine ? 'You have control' : isPaused ? 'Paused' : waiting ? 'Needs you' : 'Browsing');
  const take = () => { setMine(!mine); if (!mine && isPaused) setPaused(false); };
  const sum = done && summary ? enter() : undefined;

  return (
    <div data-dm="" className={cx('dm-bws dm-panel', mine && 'dm-you', isPaused && !mine && 'dm-paused', className)}>
      <div className="dm-bws-h">
        <div className="dm-bws-ht"><b>{title}</b><span className="dm-muted dm-bws-st"><span aria-live="polite"><Swap>{line}</Swap></span> · <span className="dm-num">{clock(secs)}</span></span></div>
        <div className="dm-bws-ctl">
          <Tip label={isPaused ? 'Resume' : 'Pause'}>
            <button type="button" className="dm-ib dm-bws-pause" aria-label={isPaused ? 'Resume' : 'Pause'} disabled={mine || done} onClick={() => setPaused(!isPaused)}>
              <Icon name={isPaused ? 'play' : 'pause'} />
            </button>
          </Tip>
          <button type="button" className="dm-pill dm-line dm-sm dm-bws-take" aria-pressed={mine} disabled={done} onClick={take}>{mine ? 'Hand back' : 'Take over'}</button>
        </div>
      </div>
      <div className="dm-bws-win">
        <div className="dm-bws-bar">
          <span className="dm-bws-dots" aria-hidden="true"><i /><i /><i /></span>
          <div className="dm-bws-url"><Icon name={search ? 'search' : 'lock'} size="xs" /><Swap>{url}</Swap></div>
        </div>
        {/* while the agent drives, the page is a picture of its browser; with Take over it is the person's to use */}
        <div className="dm-bws-vp" inert={!mine}>
          {children}
          <span className={cx('dm-bws-cur', cursor && !mine && 'dm-on', cursor?.down && 'dm-down')} style={cursor ? { transform: `translate(${cursor.x}px,${cursor.y}px)` } : undefined} aria-hidden="true">
            <svg viewBox="0 0 14 14"><path d="M2 1.5l9.5 5-4.2 1.2-2 4.3z" /></svg>
          </span>
        </div>
      </div>
      <ol className="dm-bws-steps" aria-label="Steps">
        {steps.map((s, i) => {
          const asking = s.state === 'waiting' && ask && !mine;
          return (
            <li key={i} className={cx('dm-bws-s', CLS[s.state])} aria-current={s.state === 'running' || s.state === 'waiting' ? 'step' : undefined}>
              <Glyph state={s.state} />
              <span className="dm-bws-t">
                <span>{s.label}</span>
                {s.detail && <Swap className="dm-d">{s.detail}</Swap>}
                {asking && (
                  <div className={cx('dm-bws-ask', enter().className)}>
                    <button type="button" className="dm-pill dm-primary dm-sm" onClick={ask.onAllow}>{ask.label}</button>
                    <button type="button" className="dm-pill dm-soft dm-sm" onClick={take}>Take over</button>
                  </div>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      {sum && <div className={cx('dm-bws-sum', sum.className)} style={sum.style}><Icon name="ok" size="xs" /><span>{summary}</span></div>}
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
- [Trace view](https://designme.dev/components/trace-view.md): One agent run as a waterfall of spans, with latency and tokens.
- [Run summary](https://designme.dev/components/run-summary.md): What the agent did, what changed and what needs you.
- [Agent run timeline](https://designme.dev/components/agent-run-timeline.md): Every model and tool step of a run on one time axis.
- [Action log](https://designme.dev/components/action-log.md): Every read, search, edit and command, logged as it runs.
- [Context meter](https://designme.dev/components/context-meter.md): How full the context is and what fills it, with Compact to free room.
- [Error and recovery](https://designme.dev/components/error-recovery.md): A failed step with retry, skip or hand over to a person.
- [Run queue](https://designme.dev/components/run-queue.md): Grouped tasks with live progress, retries and a compact view.
- [Run cost](https://designme.dev/components/run-cost.md): Live credit and token spend, with a cap that pauses the run.
- [Toast stack](https://designme.dev/components/toast-stack.md): Agent notifications that stack and fan out on hover.
- [Toast](https://designme.dev/components/toast.md): One notification that changes shape with its state.
- [Status pill](https://designme.dev/components/status-pill.md): One live line for what the agent is doing right now.
- [Step loader](https://designme.dev/components/step-loader.md): Named steps with a progress track and four loaders.

All components: https://designme.dev/llms.txt
