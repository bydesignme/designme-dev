# Eval results

> An eval run case by case, against the run before.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/eval-results

## Install

```sh
npx designme add eval-results          # HTML, CSS and JS, with the shared core
npx designme add eval-results --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Eval results shows an eval suite's latest run case by case. A bar with one segment per case fills as the cases run, the pass count is compared with the run before, and a filter narrows the list to the failed cases. A failed case opens to show what was expected, what came back and where the answer comes from, with a fix that runs it again.

### When to use it

- When an agent's output is checked by a set of evals and people need to see which ones failed, not just a score.
- When a change to a prompt, a model or the agent's work should be compared with the run before, to catch a regression.
- When a failure needs its evidence, expected against what came back, to be fixed.
- When the suite is long and people only want the failures.

### What it does

- `cases` is the suite. Each case has a `name`, a `status` of `queued`, `running`, `pass` or `fail`, and a `time` shown once it has a result.
- The bar has one segment per case: grey while queued, pulsing while running, green for a pass and red for a fail.
- The count reads "Running 3 of 8" while `running`, then "7 of 8 passed". With `previousPassed`, a tag compares the settled run with the one before, like "1 fewer than the last run", or reads All passing.
- `onRun` adds a filled run button, labelled by `runLabel`; it spins while `running`.
- All and Failed switch the list, with the count on each; the cases that don't match fold away. With no failures, Failed says "No failed cases".
- A failed case is red-tinted and opens to show `expected`, `got` in red and `source`, with an optional white `fix` button, like Use $24 and rerun.

### Accessibility

- The cases form a list labelled "Cases". A failed case is a button with `aria-expanded`, and its details fold away inert when it's shut.
- All and Failed are a labelled group of toggle buttons with `aria-pressed`.
- The pass count is announced politely as it changes.
- The bar is decoration; the count says the same in words.

## Usage in React

```tsx
import { EvalResults } from '@/components/designme/eval-results/EvalResults';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { EvalResults, type EvalCase } from './EvalResults';
import { useStory, useWait } from '../lib/useScript';

/* ---------- Eval results: run the evals, see one fail against the last run, open it, take the fix, and see all eight pass ---------- */
// eight checks on the pricing page's copy. The price check fails after the copy agent's latest edit, until it's fixed
const CASES: EvalCase[] = [
  { id: 'seat', name: 'Names the Pro seat limit', time: '0.6s', status: 'pass' },
  { id: 'price', name: 'Prices match the billing table', time: '0.9s', status: 'pass', expected: '$24 a seat, billed yearly', got: '$29 a seat, billed yearly', source: 'Billing table, Pro row' },
  { id: 'yearly', name: 'Mentions the yearly discount', time: '0.5s', status: 'pass' },
  { id: 'unl', name: 'Makes no “unlimited” claims', time: '0.4s', status: 'pass' },
  { id: 'sso', name: 'Team plan lists SSO', time: '0.5s', status: 'pass' },
  { id: 'grade', name: 'Reads at grade 8 or below', time: '0.7s', status: 'pass' },
  { id: 'cta', name: 'One call to action per plan', time: '0.5s', status: 'pass' },
  { id: 'free', name: 'Free plan says no card is needed', time: '0.6s', status: 'pass' }
];

export default function EvalResultsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [cases, setCases] = useState(CASES);
  const [running, setRunning] = useState(false);
  const [ran, setRan] = useState(false);
  const fixed = useRef(false);
  const set = (id: string, status: EvalCase['status']) => setCases(cs => cs.map(k => k.id === id ? { ...k, status } : k));

  // a run checks the cases one after another; the price check fails until the copy is fixed
  const runAll = async () => {
    setRunning(true); setRan(true); setCases(cs => cs.map(k => ({ ...k, status: 'queued' })));
    for (const k of CASES) {
      set(k.id, 'running'); await wait(500);
      set(k.id, k.id === 'price' && !fixed.current ? 'fail' : 'pass');
    }
    setRunning(false);
  };
  // the fix changes the copy to the billing table's price and runs that case again
  const fix = async () => { fixed.current = true; set('price', 'running'); await wait(1000); set('price', 'pass'); };

  // the preview's story: run the evals, show the failed ones, open the price check and take its fix, then show them all
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-evr-run');
    await wait(4000 + 1500); press('.dm-seg2 button:last-of-type');
    await wait(1000); press('.dm-evr-i.dm-fail .dm-evr-r');
    await wait(1500); press('.dm-evr-fix');
    await wait(2000); press('.dm-seg2 button:first-of-type');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <EvalResults title="Pricing copy evals" subtitle={`Copy agent · 8 cases · run ${ran && !running ? 'just now' : '2h ago'}`}
        cases={cases.map(k => k.id === 'price' && k.status === 'fail' ? { ...k, fix: { label: 'Use $24 and rerun', onClick: () => void fix() } } : k)}
        onRun={() => void runAll()} running={running} runLabel={ran ? 'Run again' : 'Run evals'} previousPassed={ran ? 8 : undefined} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | Like "Pricing copy evals" |
| `subtitle` (optional) | `string` | The line under the title, like "Copy agent · 8 cases · run 2h ago" |
| `cases` | `EvalCase[]` |  |
| `onRun` (optional) | `() => void` | Adds the run button |
| `running` (optional) | `boolean` | Whether the whole suite is running: the button spins and the count reads "Running 3 of 8" |
| `runLabel` (optional) | `string` | Defaults to "Run evals" |
| `previousPassed` (optional) | `number` | How many passed the run before. Once the run settles, a tag compares with it, like "1 fewer than the last run" |
| `filter` (optional) | `EvalFilter` | Which cases show: all of them, or only the failed ones |
| `defaultFilter` (optional) | `EvalFilter` |  |
| `onFilterChange` (optional) | `(filter: EvalFilter) => void` |  |
| `open` (optional) | `string[]` | Ids of the failed cases that are open. Leave it out to let each one open itself |
| `defaultOpen` (optional) | `string[]` |  |
| `onOpenChange` (optional) | `(ids: string[]) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**Does it run the evals?**

No. `onRun` tells you to start. Set each case's `status` as your eval runner reports it, and `running` for the whole run.

**What does the fix button do?**

Whatever you pass as its `onClick`. In the demo it changes the copy to the billing table's price and runs that one case again.

**Can it show scores instead of pass and fail?**

Not yet. Each case passes or fails; put a score in its `name` or `time` if you need one there.

**How does it compare with the last run?**

By the number that passed. Pass `previousPassed` from your last run, and the tag appears once every case has a result.

## Source

`EvalResults.tsx`, as `npx designme add eval-results --react` installs it:

```tsx
'use client';
import { useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Seg, Spin, Swap } from '../lib/motion';
import '../designme.css';
import './eval-results.css';

export type EvalStatus = 'queued' | 'running' | 'pass' | 'fail';
export type EvalFilter = 'all' | 'fail';

export interface EvalCase {
  id: string;
  /** What it checks, like "Prices match the billing table" */
  name: string;
  status: EvalStatus;
  /** How long it took, like "0.9s", shown once it has a result */
  time?: string;
  /** For a failed case: what should have come back */
  expected?: string;
  /** For a failed case: what came back instead */
  got?: string;
  /** For a failed case: where the expected answer comes from */
  source?: string;
  /** For a failed case: a white button under its details, like Use $24 and rerun */
  fix?: { label: string; onClick: () => void };
}

export interface EvalResultsProps {
  /** Like "Pricing copy evals" */
  title: string;
  /** The line under the title, like "Copy agent · 8 cases · run 2h ago" */
  subtitle?: string;
  cases: EvalCase[];
  /** Adds the run button */
  onRun?: () => void;
  /** Whether the whole suite is running: the button spins and the count reads "Running 3 of 8" */
  running?: boolean;
  /** Defaults to "Run evals" */
  runLabel?: string;
  /** How many passed the run before. Once the run settles, a tag compares with it, like "1 fewer than the last run" */
  previousPassed?: number;
  /** Which cases show: all of them, or only the failed ones */
  filter?: EvalFilter;
  defaultFilter?: EvalFilter;
  onFilterChange?: (filter: EvalFilter) => void;
  /** Ids of the failed cases that are open. Leave it out to let each one open itself */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (ids: string[]) => void;
  className?: string;
}

/** How many times `value` has changed since the first render, so a glyph can play its entrance on a change but not on mount */
function useChanges<T>(value: T) {
  const [seen, setSeen] = useState({ value, n: 0 });
  if (Object.is(seen.value, value)) return seen.n;
  setSeen({ value, n: seen.n + 1 });
  return seen.n + 1;
}

function Glyph({ status }: { status: EvalStatus }) {
  const e = useChanges(status) > 0 ? enter() : undefined;
  return (
    <span key={status} className={cx('dm-evr-g', e?.className)} style={e?.style} aria-hidden="true">
      {status === 'running' ? <Spin /> : status === 'pass' ? <Icon name="ok" size="xs" /> : status === 'fail' ? <Icon name="alert" size="xs" /> : <span className="dm-dot" />}
    </span>
  );
}

const SEG: Record<EvalStatus, string | undefined> = { queued: undefined, running: 'dm-run', pass: 'dm-pass', fail: 'dm-fail' };

/** An eval suite's latest run: a bar segment per case, the pass count against the run before, and the cases, all or only
    the failed ones. A failed case opens to show what was expected and what came back, with a fix. */
export function EvalResults({ title, subtitle, cases, onRun, running = false, runLabel = 'Run evals', previousPassed, filter, defaultFilter = 'all', onFilterChange, open, defaultOpen = [], onOpenChange, className }: EvalResultsProps) {
  const [show, setShow] = useControllable(filter, defaultFilter, onFilterChange);
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  const passed = cases.filter(k => k.status === 'pass').length, failed = cases.filter(k => k.status === 'fail').length;
  const settled = cases.every(k => k.status === 'pass' || k.status === 'fail');
  const count = settled ? `${passed} of ${cases.length} passed` : running ? `Running ${passed + failed + 1} of ${cases.length}` : 'Running the case again';
  const delta = !settled || running || previousPassed === undefined ? '' : passed === cases.length ? 'All passing'
    : passed < previousPassed ? `${previousPassed - passed} fewer than the last run` : passed > previousPassed ? `${passed - previousPassed} more than the last run` : '';
  const dl = delta ? enter() : undefined;

  return (
    <div data-dm="" className={cx('dm-evr dm-panel', className)}>
      <div className="dm-evr-h">
        <div className="dm-evr-ht"><b>{title}</b>{subtitle && <Swap className="dm-muted dm-evr-st">{subtitle}</Swap>}</div>
        {onRun && (
          <button type="button" className="dm-pill dm-primary dm-sm dm-evr-run" disabled={running} onClick={onRun}>
            {running ? <><Spin />Running</> : <><Icon name="play" size="xs" />{runLabel}</>}
          </button>
        )}
      </div>
      <div className="dm-evr-sum">
        <div className="dm-evr-segs" aria-hidden="true">{cases.map(k => <i key={k.id} className={SEG[k.status]} />)}</div>
        <div className="dm-evr-nums">
          <span aria-live="polite"><Swap className="dm-evr-pass dm-num">{count}</Swap></span>
          {delta && <span key={delta} className={cx('dm-tag dm-evr-dl', passed < (previousPassed ?? 0) ? 'dm-bad' : 'dm-ok', dl?.className)} style={dl?.style}>{delta}</span>}
        </div>
      </div>
      <div className="dm-evr-tabs">
        <Seg label="Show" value={show} onChange={setShow} options={[
          { value: 'all', label: <>All <span className="dm-n dm-num">{cases.length}</span></> },
          { value: 'fail', label: <>Failed <span className="dm-n dm-num">{failed}</span></> }
        ]} />
      </div>
      <div className="dm-evr-list" role="list" aria-label="Cases">
        {cases.map(k => {
          const fail = k.status === 'fail', isOpen = fail && opened.includes(k.id);
          const meta = <><Glyph status={k.status} /><span className="dm-evr-n">{k.name}</span><span className="dm-evr-tm dm-num">{k.status === 'pass' || fail ? k.time : ''}</span></>;
          return (
            <Fold key={k.id} open={show === 'all' || fail} className="dm-evr-w">
              <div className={cx('dm-evr-i', `dm-${k.status}`)} role="listitem">
                {fail ? (
                  <>
                    <button type="button" className="dm-evr-r" aria-expanded={isOpen} onClick={() => setOpened(isOpen ? opened.filter(id => id !== k.id) : [...opened, k.id])}>
                      {meta}<span className="dm-evr-ch"><Icon name="chev-d" size="xs" /></span>
                    </button>
                    <Fold open={isOpen} className="dm-evr-d">
                      <div className="dm-evr-dd">
                        {k.expected && <span className="dm-evr-kv"><span className="dm-k">Expected</span><span>{k.expected}</span></span>}
                        {k.got && <span className="dm-evr-kv"><span className="dm-k">Got</span><span className="dm-bad">{k.got}</span></span>}
                        {k.source && <span className="dm-evr-kv"><span className="dm-k">Source</span><span>{k.source}</span></span>}
                        {k.fix && <button type="button" className="dm-pill dm-sm dm-evr-fix" onClick={k.fix.onClick}>{k.fix.label}</button>}
                      </div>
                    </Fold>
                  </>
                ) : <div className="dm-evr-r">{meta}</div>}
              </div>
            </Fold>
          );
        })}
      </div>
      {show === 'fail' && !failed && <p className="dm-evr-none">No failed cases</p>}
    </div>
  );
}
```

## More in Review and approve

- [Change review](https://designme.dev/components/change-review.md): Accept or reject each change the agent made, file by file.
- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Permission gate](https://designme.dev/components/permission-gate.md): The agent asks before it touches something new.
- [Hand-off to a person](https://designme.dev/components/human-handoff.md): The agent hands a conversation to a person, with what they need to pick it up.
- [Decision prompt](https://designme.dev/components/decision-prompt.md): The agent asks a few quick questions before it starts.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Design tuner](https://designme.dev/components/design-tuner.md): Tweak a component by hand or let the agent tune it.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Launch checklist](https://designme.dev/components/launch-checklist.md): The agent checks a design before it ships, and fixes what fails.
- [Inline text diff](https://designme.dev/components/inline-text-diff.md): The agent's edits to a piece of copy, accepted or rejected one by one.
- [Draft review](https://designme.dev/components/draft-review.md): An email the agent drafted, to check and edit before it sends.
- [Steering](https://designme.dev/components/steering.md): Change the agent's course while it works, without starting over.
- [Design review](https://designme.dev/components/design-review.md): Checks run, a teammate asks for a change, the agent makes it, and you ship.

All components: https://designme.dev/llms.txt
