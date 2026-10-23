# Steering

> Change the agent's course while it works, without starting over.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/steering

## Install

```sh
npx designme add steering          # HTML, CSS and JS, with the shared core
npx designme add steering --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Steering lets a person change an agent's course while it works, without stopping the run. The steps show what the agent is doing now, and a message box under them takes a correction. The message waits for the step in progress, then applies from the next one, and when it changes work that's already done the agent says so and offers to redo it.

### When to use it

- When an agent runs for a while and people spot a wrong turn before it finishes, like the wrong colour or the wrong file.
- When stopping and starting over would throw away good work, and a correction should only change what comes next.
- When a correction can touch work already done, and the person should decide whether that work is redone.
- When people should see that their message landed: waiting, then applied.

### What it does

- `steps` lists the run, each with a `title`, a `detail` that crossfades when it changes, and a `status` of `queued`, `running` or `done`. A step that a message added has `fromYou`, which shows a "From you" tag.
- Your messages sit on the right. A `queued` one says "Applies after this step" with a small spinner, and an `applied` one shows a check.
- The agent's replies sit on the left. `warn` makes one amber, for a heads-up like "The Pro card is already violet", and `actions` adds white and filled buttons under it. Once you answer, `answer` takes the buttons' place and the amber goes.
- The line under the title reads "Step 2 of 4", or Done, with a clock that counts until every step is done, or shows `seconds`.
- Once every step is done a green line sums it up, like "Done in 0:14 · 1 change from you"; `summary` changes it or, set to `false`, hides it. The message box then says the run has finished.
- Enter or the send button sends; the button stays off while the box is empty.

### Accessibility

- The steps are an ordered list labelled "Steps".
- The message box is a form with a labelled input, so Enter sends, and the send button is named Send.
- New messages, the agent's replies and the step line under the title are announced politely.
- The answer buttons are real buttons, named by their labels.

## Usage in React

```tsx
import { Steering } from '@/components/designme/steering/Steering';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useReducer, useRef, useState } from 'react';
import { Steering, type SteerMessage, type SteerStep } from './Steering';
import { useScript, useStory, type Script } from '../lib/useScript';

/* ---------- Steering: tell the agent to use the library's blue mid-run, and have it redo the card that was already violet ---------- */
// a card step paints its card in the current accent and remembers which, so a change of mind can find the cards with the old one
type Step = SteerStep & { card?: string; hue?: string; ms: number; redo?: string };
const START: Step[] = [
  { id: 'read', title: 'Read Pricing v4', detail: '3 frames, 14 layers', status: 'done', ms: 0 },
  { id: 'pro', card: 'Pro', title: 'Update the Pro card', status: 'running', ms: 7500 },
  { id: 'team', card: 'Team', title: 'Update the Team card', detail: 'Pricing v4, frame 3', status: 'queued', ms: 3500 },
  { id: 'ship', title: 'Export to staging', detail: 'designme.studio/pricing', status: 'queued', ms: 2500 }
];

export default function SteeringDemo() {
  const ref = useRef<HTMLDivElement>(null);
  // the run lives in a ref the agent's loop works on; paint shows it
  const run = useRef({ steps: START.map(s => ({ ...s })), hue: 'violet', queue: [] as string[], busy: false, wait: undefined as Script['wait'] | undefined });
  const [, paint] = useReducer((n: number) => n + 1, 0);
  const [messages, setMessages] = useState<SteerMessage[]>([]);
  const [draft, setDraft] = useState('');
  const ids = useRef(0);
  const nid = () => 'm' + ++ids.current;
  const doing = (x: Step) => x.card ? `Setting the accent to ${run.current.hue}` : x.detail;
  const say = (m: Omit<SteerMessage, 'id' | 'from'>, id = nid()) => setMessages(ms => [...ms, { id, from: 'agent', ...m }]);
  const answer = (id: string, text: string) => setMessages(ms => ms.map(m => m.id === id ? { ...m, answer: text } : m));

  // between two steps the agent takes up what you sent
  const apply = () => {
    const r = run.current;
    while (r.queue.length) {
      const text = r.queue.shift()!;
      setMessages(ms => { const i = ms.findIndex(m => m.from === 'you' && m.state === 'queued'); return ms.map((m, k) => k === i ? { ...m, state: 'applied' } : m); });
      if (r.steps.every(s => s.status === 'done')) { say({ text: "The run had finished, so I'll keep this for the next one." }); continue; }
      if (!/blue|accent|library/i.test(text)) { say({ text: "Got it. I'll follow that from the next step." }); continue; }
      // a change of accent: what's still to come uses it, and a card already painted the old way is offered a redo
      r.hue = 'library blue';
      const old = r.steps.filter(x => x.card && x.status === 'done' && x.hue === 'violet' && !r.steps.some(y => y.redo === x.id));
      if (!old.length) { say({ text: 'Got it. From here the accent is color.accent.500 from the library.' }); continue; }
      const names = old.map(x => x.card).join(' and '), many = old.length > 1, id = nid();
      say({ text: `Got it. From here the accent is color.accent.500. The ${names} card${many ? 's are' : ' is'} already violet.`, warn: true, actions: [
        { label: 'Leave it', onClick: () => answer(id, `Kept the ${names} card as it is`) },
        { label: `Redo the ${names} card${many ? 's' : ''}`, onClick: () => { old.forEach(redo); answer(id, `Added a step to redo the ${names} card${many ? 's' : ''}`); } }
      ] }, id);
    }
    paint();
  };
  // a redo goes in before the export if the export hasn't started, otherwise at the end, and picks the run up again if it had finished
  const redo = (x: Step) => {
    const r = run.current, ship = r.steps.find(y => y.id === 'ship')!, ended = r.steps.every(s => s.status === 'done');
    r.steps.splice(ship.status === 'queued' ? r.steps.indexOf(ship) : r.steps.length, 0,
      { id: 'redo-' + x.id, redo: x.id, card: x.card, fromYou: true, title: `Redo the ${x.card} card`, detail: 'Accent to library blue', status: 'queued', ms: 2000 });
    paint();
    if (ended && r.wait) void work(r.wait);
  };
  // the agent works through the steps
  const work = async (wait: Script['wait']) => {
    const r = run.current; r.busy = true;
    for (let x = r.steps.find(y => y.status !== 'done'); x; x = r.steps.find(y => y.status !== 'done')) {
      x.status = 'running'; x.detail = doing(x); paint();
      await wait(x.ms);
      if (x.card) x.hue = r.hue;
      x.status = 'done'; x.detail = x.card ? `Accent set to ${x.hue}` : x.id === 'ship' ? 'Live on designme.studio/pricing' : x.detail;
      apply();
    }
    r.busy = false; paint();
  };
  useScript(async ({ wait }) => { run.current.wait = wait; await work(wait); });

  const send = (text: string) => {
    const id = nid(); setMessages(ms => [...ms, { id, from: 'you', text, state: 'queued' }]);
    run.current.queue.push(text);
    if (!run.current.busy) apply();
  };

  // the preview's story: tell the agent to use the library's blue, then have it redo the card that was already violet
  useStory(ref, async ({ wait, press }) => {
    await wait(2500);
    for (const ch of 'Use our library blue, not violet') { setDraft(d => d + ch); await wait(40); }
    await wait(500); press('.dm-ste-go');
    await wait(5200); press('.dm-ste-acts .dm-ink');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Steering title="Redesign the pricing page" steps={run.current.steps.map(s => ({ ...s }))} messages={messages} onSend={send} value={draft} onValueChange={setDraft} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | The run's goal, like "Redesign the pricing page" |
| `steps` | `SteerStep[]` |  |
| `messages` (optional) | `SteerMessage[]` | What you sent and what the agent said back, in order |
| `onSend` (optional) | `(text: string) => void` | Called with the text when a message is sent. Add it to `messages` as `queued`, and mark it `applied` when it's taken up |
| `value` (optional) | `string` | The message being written |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(value: string) => void` |  |
| `placeholder` (optional) | `string` | Defaults to "Steer the agent while it works", and "The run has finished" once every step is done |
| `status` (optional) | `string` | The line under the title. Defaults to "Step 2 of 4", or Done, then the clock |
| `seconds` (optional) | `number` | Seconds to show as m:ss. Leave it out to let the clock count until every step is done |
| `summary` (optional) | `string \| false` | Shown once every step is done. Defaults to "Done in 0:14 · 1 change from you"; false hides it |
| `className` (optional) | `string` |  |

## Questions

**Does it decide what a message changes?**

No. `onSend` gives you the text. Your agent decides what to do with it: add it to `messages` as `queued`, mark it `applied` when it's taken up, and add the agent's reply.

**Why does a message wait for the step in progress?**

Changing a step halfway through can leave its work half done. Applying from the next step keeps each step whole, and the agent can still offer to redo one that's finished.

**Can people stop the run instead?**

Not from this component. Put your own stop button next to it if your agent can stop mid-step.

**Can I add steps while it runs?**

Yes. Pass a new `steps` list with the step where it goes, and mark it `fromYou` if a message asked for it.

## Source

`Steering.tsx`, as `npx designme add steering --react` installs it:

```tsx
'use client';
import { useState, type FormEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Spin, Swap } from '../lib/motion';
import '../designme.css';
import './steering.css';

export type SteerStepStatus = 'queued' | 'running' | 'done';

export interface SteerStep {
  id: string;
  /** Like "Update the Pro card" */
  title: string;
  /** What it is doing now, or what it did. It crossfades when it changes */
  detail?: string;
  status: SteerStepStatus;
  /** Marks a step that a message of yours added, with a "From you" tag */
  fromYou?: boolean;
}

export interface SteerMessage {
  id: string;
  from: 'you' | 'agent';
  text: string;
  /** For yours: `queued` while it waits for the step in progress, `applied` once the agent has taken it up */
  state?: 'queued' | 'applied';
  /** For the agent's: an amber heads-up, for when your message changes work already done */
  warn?: boolean;
  /** Buttons under the agent's message, the last one filled, like Leave it and Redo the Pro card */
  actions?: { label: string; onClick: () => void }[];
  /** Takes the buttons' place once you've answered, like "Added a step to redo the Pro card". The amber goes too */
  answer?: string;
}

export interface SteeringProps {
  /** The run's goal, like "Redesign the pricing page" */
  title: string;
  steps: SteerStep[];
  /** What you sent and what the agent said back, in order */
  messages?: SteerMessage[];
  /** Called with the text when a message is sent. Add it to `messages` as `queued`, and mark it `applied` when it's taken up */
  onSend?: (text: string) => void;
  /** The message being written */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Defaults to "Steer the agent while it works", and "The run has finished" once every step is done */
  placeholder?: string;
  /** The line under the title. Defaults to "Step 2 of 4", or Done, then the clock */
  status?: string;
  /** Seconds to show as m:ss. Leave it out to let the clock count until every step is done */
  seconds?: number;
  /** Shown once every step is done. Defaults to "Done in 0:14 · 1 change from you"; false hides it */
  summary?: string | false;
  className?: string;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** How many times `value` has changed since the first render, so a glyph can play its entrance on a change but not on mount */
function useChanges<T>(value: T) {
  const [seen, setSeen] = useState({ value, n: 0 });
  if (Object.is(seen.value, value)) return seen.n;
  setSeen({ value, n: seen.n + 1 });
  return seen.n + 1;
}

function Glyph({ status }: { status: SteerStepStatus }) {
  const e = useChanges(status) > 0 ? enter() : undefined;
  return (
    <span key={status} className={cx('dm-ste-g', e?.className)} style={e?.style} aria-hidden="true">
      {status === 'running' ? <Spin /> : status === 'done' ? <Icon name="ok" size="xs" /> : <span className="dm-dot" />}
    </span>
  );
}

/** A run you can steer while it works: its steps, what you told it and what it said back, and a message box.
    A message waits for the step in progress and applies from the next one; you decide what happens to it through `messages`. */
export function Steering({ title, steps, messages = [], onSend, value, defaultValue = '', onValueChange, placeholder, status, seconds, summary, className }: SteeringProps) {
  const [draft, setDraft] = useControllable(value, defaultValue, onValueChange);
  const finished = steps.length > 0 && steps.every(s => s.status === 'done');
  const counted = useSeconds(seconds === undefined && !finished);
  const secs = seconds ?? counted;
  const at = steps.findIndex(s => s.status === 'running');
  const line = status ?? (finished ? 'Done' : `Step ${(at < 0 ? steps.filter(s => s.status === 'done').length : at) + 1} of ${steps.length}`);
  const mine = messages.filter(m => m.from === 'you').length;
  const done = summary === undefined ? `Done in ${clock(secs)}${mine ? ` · ${mine} change${mine > 1 ? 's' : ''} from you` : ''}` : summary;
  const send = (e: FormEvent) => { e.preventDefault(); const t = draft.trim(); if (!t || finished) return; onSend?.(t); setDraft(''); };
  const sum = finished && done !== false ? enter() : undefined;

  return (
    <div data-dm="" className={cx('dm-ste dm-panel', className)}>
      <div className="dm-ste-h"><b>{title}</b><span className="dm-muted dm-ste-st"><span aria-live="polite"><Swap>{line}</Swap></span> · <span className="dm-num">{clock(secs)}</span></span></div>
      <ol className="dm-ste-steps" aria-label="Steps">
        {steps.map(s => {
          const e = s.fromYou ? enter() : undefined;
          return (
            <li key={s.id} className={cx('dm-ste-s', `dm-${s.status === 'running' ? 'run' : s.status}`, e?.className)} style={e?.style}>
              <Glyph status={s.status} />
              <span className="dm-ste-t"><b>{s.title}</b>{s.detail && <Swap>{s.detail}</Swap>}</span>
              {s.fromYou && <span className="dm-tag dm-b">From you</span>}
            </li>
          );
        })}
      </ol>
      <div className="dm-ste-log" aria-live="polite">
        {messages.map(m => {
          const e = enter();
          if (m.from === 'you') return (
            <div key={m.id} className={cx('dm-ste-me', e.className)} style={e.style}>
              <p>{m.text}</p>
              <span key={m.state} className={cx('dm-ste-q', m.state === 'applied' && 'dm-enter')}>
                {m.state === 'applied' ? <><Icon name="check" size="xs" />Applied</> : <><Spin />Applies after this step</>}
              </span>
            </div>
          );
          const warn = m.warn && !m.answer;
          return (
            <div key={m.id} className={cx('dm-ste-ag', warn && 'dm-warn', e.className)} style={e.style}>
              <Icon name={warn ? 'alert' : 'spark'} size="xs" />
              <div className="dm-t">
                <p>{m.text}</p>
                {m.answer ? <span className="dm-muted">{m.answer}</span> : m.actions?.length ? (
                  <div className="dm-ste-acts">
                    {m.actions.map((a, i) => <button key={a.label} type="button" className={cx('dm-pill dm-sm', i === m.actions!.length - 1 ? 'dm-ink' : 'dm-ghost')} onClick={a.onClick}>{a.label}</button>)}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        {sum && <div className={cx('dm-ste-sum', sum.className)} style={sum.style}><Icon name="ok" size="xs" /><span>{done}</span></div>}
      </div>
      <form className="dm-ste-box" onSubmit={send}>
        <input value={draft} onChange={e => setDraft(e.target.value)} disabled={finished} placeholder={placeholder ?? (finished ? 'The run has finished' : 'Steer the agent while it works')} aria-label="Message the agent" spellCheck={false} autoComplete="off" />
        <button type="submit" className="dm-ste-go" aria-label="Send" disabled={finished || !draft.trim()}><Icon name="up" size="xs" /></button>
      </form>
    </div>
  );
}
```

## More in Review and approve

- [Change review](https://designme.dev/components/change-review.md): Accept or reject each change the agent made, file by file.
- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Permission gate](https://designme.dev/components/permission-gate.md): The agent asks before it touches something new.
- [Decision prompt](https://designme.dev/components/decision-prompt.md): The agent asks a few quick questions before it starts.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Design tuner](https://designme.dev/components/design-tuner.md): Tweak a component by hand or let the agent tune it.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Launch checklist](https://designme.dev/components/launch-checklist.md): The agent checks a design before it ships, and fixes what fails.
- [Inline text diff](https://designme.dev/components/inline-text-diff.md): The agent's edits to a piece of copy, accepted or rejected one by one.
- [Draft review](https://designme.dev/components/draft-review.md): An email the agent drafted, to check and edit before it sends.
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.
- [Design review](https://designme.dev/components/design-review.md): Checks run, a teammate asks for a change, the agent makes it, and you ship.

All components: https://designme.dev/llms.txt
