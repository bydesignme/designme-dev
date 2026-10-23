# Plan review

> Check the agent's plan, edit steps, then let it run.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/plan-review

## Install

```sh
npx designme add plan-review          # HTML, CSS and JS, with the shared core
npx designme add plan-review --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Plan review shows the plan an agent proposes before it starts work, as a numbered list a person can change. They can rewrite a step, skip one, add their own, and then approve so the agent runs through the steps in the same view.

### When to use it

- When a task is large enough that people should agree on the steps before the agent touches anything.
- When a person wants to drop a step or rewrite it in their own words without starting over.
- When you want the approved plan to double as a progress list while the agent runs.
- When the person needs a Stop button once the agent is under way.

### What it does

- Three phases: `review` lets people edit steps, `running` shows progress and a Stop button, and `done` shows See changes.
- In review, clicking a step makes its text editable. Enter saves it, and the step is marked as edited only if the words really changed.
- Each step has a skip button. Skipped steps stay in the list, struck through, and lose their number until they are included again.
- Add a step appends a new row and puts the cursor in it with the text selected.
- Steps can show `state: 'run'` while the agent works on them, with a spinner and a shimmer on the text, `'retry'` in amber while it waits out a problem like a rate limit, and a check once `done`.
- Each step can report a `detail` line under it, like "6 frames and 42 tokens read". It opens under the step and crossfades when it changes.
- The status line defaults to how many steps are left in and about how many minutes they take. `status` and `note` replace the defaults. `meta` adds quiet text at the end of the header, like an elapsed time.

### Accessibility

- In review, each step's text has `role="textbox"` and an `aria-label` like "Step 2".
- The skip button's `aria-label` switches between "Skip step" and "Include step".
- Pressing Enter in a step ends the edit instead of adding a new line.

## Usage in React

```tsx
import { PlanReview } from '@/components/designme/plan-review/PlanReview';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { PlanReview, type PlanPhase, type PlanReviewStep } from './PlanReview';
import { useScript, useStory } from '../lib/useScript';

/* ---------- Plan review: rewrite a step, approve, and the agent works through a rate limit to the end ---------- */
const PLAN: [text: string, done: string][] = [
  ['Read the pricing frames and the brand tokens', '6 frames and 42 tokens read'],
  ['Compare against the three competitor pages', '3 pages compared'],
  ['Simplify the plan cards to one CTA each', 'Plan cards now have one CTA each'],
  ['Move the FAQ below the comparison table', 'FAQ now sits under the table'],
  ['Write a summary of every change', 'Summary added to Pricing v4']
];
const DONE = new Map(PLAN.map(([text, done], i) => ['s' + i, { text, done }]));
const clock = (ms: number) => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

export default function PlanReviewDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [steps, setSteps] = useState<PlanReviewStep[]>(() => PLAN.map(([text], i) => ({ id: 's' + i, text })));
  const [phase, setPhase] = useState<PlanPhase>('review');
  const [status, setStatus] = useState<string>();
  const [note, setNote] = useState<string>();
  const [ms, setMs] = useState<number>();
  const live = useRef(steps);
  useEffect(() => { live.current = steps; });
  const stop = useRef(false);

  useScript(async ({ wait }) => {
    if (phase !== 'running') return;
    const t0 = performance.now(), tick = setInterval(() => setMs(performance.now() - t0), 250); setMs(0);
    const on = live.current.filter(s => !s.skipped);
    const mark = (id: string, change: Partial<PlanReviewStep>) => setSteps(ss => ss.map(s => s.id === id ? { ...s, ...change } : s));
    try {
      for (let i = 0; i < on.length && !stop.current; i++) {
        const s = on[i], plan = DONE.get(s.id);
        let done = !plan ? 'Done' : s.edited ? 'Done as you wrote it' : plan.done;
        mark(s.id, { state: 'run' }); setStatus(`Step ${i + 1} of ${on.length}`); await wait(900);
        // the second step hits a rate limit: the agent waits it out, counting down, and tries again
        if (s.id === 's1') {
          for (let k = 3; k > 0 && !stop.current; k--) { mark(s.id, { state: 'retry', detail: `Rate limited by the browser tool. Retrying in ${k}s` }); await wait(1000); }
          if (stop.current) { mark(s.id, { state: undefined, detail: 'Not started' }); break; }
          mark(s.id, { state: 'run', detail: 'Retrying' }); await wait(700);
          done += ', after 1 retry';
        }
        mark(s.id, { state: 'done', detail: done });
      }
    } finally { clearInterval(tick); }
    setMs(performance.now() - t0);
    setStatus(stop.current ? 'Stopped, progress kept' : `Done in ${clock(performance.now() - t0)}. 4 frames updated`); setPhase('done');
  }, [phase === 'running']);

  // the preview's story: the person rewrites the third step, then approves
  useStory(ref, async ({ wait }) => {
    await wait(2000);
    const was = PLAN[2][0], now = 'Simplify the plan cards to one CTA, annual price first';
    for (let n = was.length; n >= was.length - 5; n--) { setSteps(ss => ss.map(s => s.id === 's2' ? { ...s, text: was.slice(0, n) } : s)); await wait(60); }
    for (let n = was.length - 5; n <= now.length; n++) { setSteps(ss => ss.map(s => s.id === 's2' ? { ...s, text: now.slice(0, n), edited: true } : s)); await wait(45); }
    await wait(1500);
    stop.current = false; setNote(undefined); setPhase('running');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <PlanReview title="Plan: redesign the pricing page" steps={steps} onStepsChange={setSteps} phase={phase} status={status} note={note}
        meta={ms === undefined ? undefined : clock(ms)}
        onRequestChanges={() => setNote('Tell the agent what to change in chat')}
        onApprove={() => { stop.current = false; setNote(undefined); setPhase('running'); }}
        onStop={() => { stop.current = true; }} onSeeChanges={() => {}} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | Like "Plan: redesign the pricing page" |
| `steps` (optional) | `PlanReviewStep[]` | The steps. Leave `steps` out to let the person edit, skip and add steps on their own |
| `defaultSteps` (optional) | `PlanReviewStep[]` |  |
| `onStepsChange` (optional) | `(steps: PlanReviewStep[]) => void` |  |
| `phase` (optional) | `PlanPhase` | review (steps can be edited), running (the agent works through them) or done |
| `status` (optional) | `string` | The line under the title. Defaults to how many steps are left in and roughly how long they take |
| `note` (optional) | `string` | The quiet line in the footer. Defaults to a hint for each phase |
| `meta` (optional) | `ReactNode` | Quiet text at the end of the header, like an elapsed time "0:04" |
| `onApprove` (optional) | `() => void` |  |
| `onRequestChanges` (optional) | `() => void` |  |
| `onStop` (optional) | `() => void` |  |
| `onSeeChanges` (optional) | `() => void` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**How do I start the agent once the plan is approved?**

Handle `onApprove`, set `phase` to `running`, and mark steps with `state: 'run'` and `'done'` as your agent works. Set `phase` to `done` at the end.

**How do I get the edited plan back?**

Pass `steps` and `onStepsChange` to control the list. Each step comes back with its new `text`, plus `edited` and `skipped` flags you can send to the agent.

**Can I stop the agent halfway?**

In the `running` phase the footer shows a Stop button that calls `onStop`. Stopping the agent and updating the phase is up to your code.

**Can it sit on its own instead of inside a chat?**

Yes. It is flat by default to sit in a chat thread. Set `bare={false}` to give it its own card.

## Source

`PlanReview.tsx`, as `npx designme add plan-review --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Spin, Swap, Think, Tip } from '../lib/motion';
import '../designme.css';
import './plan-review.css';

export interface PlanReviewStep {
  id: string;
  text: string;
  /** Left out of the plan; it stays in the list, struck through */
  skipped?: boolean;
  /** Marks a step the person rewrote */
  edited?: boolean;
  /** run while the agent works on it, retry while it waits out a problem (a rate limit, a timeout), done once it has */
  state?: 'run' | 'retry' | 'done';
  /** The line the step reports, under it: what it found, or what it waits on. Opens and crossfades when it changes */
  detail?: string;
}

export type PlanPhase = 'review' | 'running' | 'done';

export interface PlanReviewProps {
  /** Like "Plan: redesign the pricing page" */
  title: string;
  /** The steps. Leave `steps` out to let the person edit, skip and add steps on their own */
  steps?: PlanReviewStep[];
  defaultSteps?: PlanReviewStep[];
  onStepsChange?: (steps: PlanReviewStep[]) => void;
  /** review (steps can be edited), running (the agent works through them) or done */
  phase?: PlanPhase;
  /** The line under the title. Defaults to how many steps are left in and roughly how long they take */
  status?: string;
  /** The quiet line in the footer. Defaults to a hint for each phase */
  note?: string;
  /** Quiet text at the end of the header, like an elapsed time "0:04" */
  meta?: ReactNode;
  onApprove?: () => void;
  onRequestChanges?: () => void;
  onStop?: () => void;
  onSeeChanges?: () => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const NOTE: Record<PlanPhase, string> = { review: 'Click a step to edit it', running: 'Running the approved plan', done: '' };
let added = 0;

/** A plan the agent proposes before it starts: edit a step, skip it, add one, then approve. */
export function PlanReview({ title, steps, defaultSteps = [], onStepsChange, phase = 'review', status, note, meta, onApprove, onRequestChanges, onStop, onSeeChanges, bare = true, className }: PlanReviewProps) {
  const [list, setList] = useControllable(steps, defaultSteps, onStepsChange);
  const live = useRef(list);
  useEffect(() => { live.current = list; });
  // each step remembers the words it came with, so "edited" shows only when they really changed
  const original = useRef(new Map<string, string>());
  list.forEach(s => { if (!original.current.has(s.id)) original.current.set(s.id, s.text); });
  // the rows stagger in once; after that the entrance comes off so a skipped step can fade
  const [entered, setEntered] = useState<Set<string>>(() => new Set());
  const first = useRef(new Set(list.map(s => s.id)));
  const focusId = useRef<string | null>(null);
  const textRefs = useRef(new Map<string, HTMLSpanElement>());

  useEffect(() => {
    const id = focusId.current, el = id && textRefs.current.get(id); if (!el) return;
    focusId.current = null; el.focus(); getSelection()?.selectAllChildren(el);
  });

  const update = (id: string, change: Partial<PlanReviewStep>) => setList(live.current.map(s => s.id === id ? { ...s, ...change } : s));
  const included = list.filter(s => !s.skipped);
  const editable = phase === 'review';
  let n = 0;

  return (
    <div data-dm="" className={cx('dm-plx', !bare && 'dm-panel', className)}>
      <div className="dm-plx-h">
        <Think on={phase === 'running'} className="dm-plx-mk" />
        <div className="dm-plx-ht"><b>{title}</b><Swap className="dm-muted dm-plx-st">{status ?? `${included.length} steps, about ${Math.max(1, Math.round(included.length * .8))} min`}</Swap></div>
        {meta !== undefined && <span className="dm-plx-tm dm-num">{meta}</span>}
      </div>
      <ol className="dm-plx-list">
        {list.map((s, i) => {
          const num = s.skipped ? '–' : String(++n);
          const entering = !entered.has(s.id);
          return (
            <li key={s.id} className={cx('dm-plx-s', entering && 'dm-enter', s.skipped && 'dm-off', s.state && 'dm-' + s.state, s.edited && 'dm-edited')}
              style={entering ? { animationDelay: (first.current.has(s.id) ? 100 + i * 60 : 0) + 'ms' } : undefined}
              onAnimationEnd={e => { if (e.target === e.currentTarget) setEntered(prev => new Set(prev).add(s.id)); }}>
              <span className="dm-n">{s.state === 'done' ? <Icon name="check" size="xs" /> : s.state === 'run' ? <Spin /> : s.state === 'retry' ? <Icon name="clock" size="xs" /> : num}</span>
              <span className="dm-b">
              <span className={cx('dm-t', s.state === 'run' && 'dm-shim')} ref={el => { if (el) textRefs.current.set(s.id, el); else textRefs.current.delete(s.id); }}
                contentEditable={editable} suppressContentEditableWarning spellCheck={false} role={editable ? 'textbox' : undefined} aria-label={editable ? `Step ${num}` : undefined}
                onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); e.currentTarget.blur(); } }}
                onBlur={e => { const text = e.currentTarget.textContent ?? ''; if (text !== s.text) update(s.id, { text, edited: text.trim() !== original.current.get(s.id) }); }}>
                {s.text}
              </span>
              <span className={cx('dm-d', s.detail && 'dm-on', s.state === 'retry' && 'dm-warn')}><Swap>{s.detail ?? ''}</Swap></span>
              </span>
              {editable && (
                <Tip label={s.skipped ? 'Include step' : 'Skip step'}>
                  <button type="button" className="dm-ib dm-plx-x" aria-label={s.skipped ? 'Include step' : 'Skip step'} onClick={() => update(s.id, { skipped: !s.skipped })}>
                    <Icon name={s.skipped ? 'undo' : 'x'} size="xs" />
                  </button>
                </Tip>
              )}
            </li>
          );
        })}
      </ol>
      {editable && (
        <button type="button" className="dm-plx-add" onClick={() => { const id = `new-${++added}`; focusId.current = id; setList([...live.current, { id, text: 'New step' }]); }}>
          <Icon name="plus" size="xs" />Add a step
        </button>
      )}
      <div className="dm-plx-f" key={phase}>
        <Swap className="dm-muted dm-plx-n">{note ?? NOTE[phase]}</Swap>
        {phase === 'review' && <>
          <button type="button" className="dm-pill dm-ghost dm-sm dm-plx-chg" onClick={onRequestChanges}>Ask for changes</button>
          <button type="button" className="dm-pill dm-ink dm-sm dm-plx-go" onClick={onApprove}>Approve plan</button>
        </>}
        {phase === 'running' && <button type="button" className="dm-pill dm-ghost dm-sm dm-plx-stop dm-enter" style={{ animationDelay: '50ms' }} onClick={onStop}><Icon name="stop" size="xs" />Stop</button>}
        {phase === 'done' && <button type="button" className="dm-pill dm-soft dm-sm dm-enter" onClick={onSeeChanges}><Icon name="eye" size="xs" />See changes</button>}
      </div>
    </div>
  );
}
```

## More in Review and approve

- [Change review](https://designme.dev/components/change-review.md): Accept or reject each change the agent made, file by file.
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
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.
- [Design review](https://designme.dev/components/design-review.md): Checks run, a teammate asks for a change, the agent makes it, and you ship.

All components: https://designme.dev/llms.txt
