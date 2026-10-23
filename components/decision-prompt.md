# Decision prompt

> The agent asks a few quick questions before it starts.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/decision-prompt

## Install

```sh
npx designme add decision-prompt          # HTML, CSS and JS, with the shared core
npx designme add decision-prompt --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Decision prompt lets an agent ask a few multiple-choice questions before it starts a task, one question at a time. When the last one is answered it shows a short summary of the choices and a line that says the agent is getting going.

### When to use it

- When a request is vague and two or three answers would change what the agent does.
- When you want quick answers by keyboard instead of a long reply in chat.
- When some questions can be left to the agent and people should be able to skip them.
- When the person should see a recap of their choices before the work begins.

### What it does

- Shows one question at a time with a "Question 2 of 3" counter and progress dots.
- Each option shows a number badge, its `label` and an optional `detail` such as "Recommended".
- Continue saves the picked option and moves on. Skip records `null`, which the summary shows as `skippedLabel` ("Agent decides" by default).
- Double-clicking an option picks it and continues in one go.
- `onComplete` fires with every answer once the last question is done. Answers can also be controlled with `answers` and `onAnswersChange`.
- The summary ends with a `startLabel` line that shimmers until you set `started`, then settles with a check and `startedLabel`.

### Accessibility

- Options sit in a `radiogroup` labelled with the question, and each option is a `radio` with `aria-checked`.
- Number keys 1 to 9 pick an option, Arrow Up and Arrow Down move the choice, and Enter continues.
- The question area is an `aria-live="polite"` region, so each new question and the summary are announced.
- Once all questions are answered the Skip and Continue footer is made `inert`.

## Usage in React

```tsx
import { DecisionPrompt } from '@/components/designme/decision-prompt/DecisionPrompt';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { DecisionPrompt, type DecisionQuestion } from './DecisionPrompt';

/* ---------- Decision prompt: three quick questions before a redesign, then a summary ---------- */
const QUESTIONS: DecisionQuestion[] = [
  { question: 'Which frames should the agent redesign?', label: 'Frames', options: [{ label: 'Pricing only', detail: '1 frame' }, { label: 'Pricing and checkout', detail: '3 frames' }, { label: 'The whole flow', detail: '9 frames' }] },
  { question: 'How bold can the changes be?', label: 'Scope', options: [{ label: 'Polish spacing and type', detail: 'Safe' }, { label: 'Rework the layout', detail: 'Medium' }, { label: 'Fresh direction', detail: 'Bold' }] },
  { question: 'Where should the result go?', label: 'Output', options: [{ label: 'New Figma page', detail: 'Keeps the original' }, { label: 'Branch in the repo', detail: 'Opens a PR' }, { label: 'Both', detail: 'Recommended' }] }
];

export default function DecisionPromptDemo() {
  return (
    <div style={{ width: '100%' }}>
      <DecisionPrompt questions={QUESTIONS} startLabel="Starting the redesign" />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `questions` | `DecisionQuestion[]` |  |
| `answers` (optional) | `(number \| null)[]` | The answers so far, an option's index or null for a skipped question. Leave it out to let Continue and Skip fill it |
| `defaultAnswers` (optional) | `(number \| null)[]` |  |
| `onAnswersChange` (optional) | `(answers: (number \| null)[]) => void` |  |
| `onComplete` (optional) | `(answers: (number \| null)[]) => void` | Called once every question is answered, with the picked option's index for each, or null where the person skipped |
| `skippedLabel` (optional) | `string` | What the summary says for a skipped question |
| `startLabel` (optional) | `string` | The line under the summary while the agent gets going |
| `started` (optional) | `boolean` | The agent has got going: the line under the summary settles with a check |
| `startedLabel` (optional) | `string` | What that line says once started. Defaults to startLabel |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**How do I get the answers to my agent?**

Use `onComplete`. It receives an array with the chosen option's index for each question, or `null` where the person skipped.

**Does the keyboard work right away?**

The whole prompt is focusable, so the keys work once it has focus, for example after clicking an option. Number keys pick, arrows move and Enter continues.

**How do I show that the agent has actually started?**

Set `started` to true. The shimmering `startLabel` line turns into a check with `startedLabel`, or the same text if you leave that out.

## Source

`DecisionPrompt.tsx`, as `npx designme add decision-prompt --react` installs it:

```tsx
'use client';
import { useState, type KeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Think } from '../lib/motion';
import '../designme.css';
import './decision-prompt.css';

export interface DecisionOption {
  label: string;
  /** Quiet text at the end of the row, like "3 frames" or "Recommended" */
  detail?: string;
}
export interface DecisionQuestion {
  question: string;
  /** A short name for the question in the summary, like "Scope" */
  label: string;
  options: DecisionOption[];
}

export interface DecisionPromptProps {
  questions: DecisionQuestion[];
  /** The answers so far, an option's index or null for a skipped question. Leave it out to let Continue and Skip fill it */
  answers?: (number | null)[];
  defaultAnswers?: (number | null)[];
  onAnswersChange?: (answers: (number | null)[]) => void;
  /** Called once every question is answered, with the picked option's index for each, or null where the person skipped */
  onComplete?: (answers: (number | null)[]) => void;
  /** What the summary says for a skipped question */
  skippedLabel?: string;
  /** The line under the summary while the agent gets going */
  startLabel?: string;
  /** The agent has got going: the line under the summary settles with a check */
  started?: boolean;
  /** What that line says once started. Defaults to startLabel */
  startedLabel?: string;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

/** The agent asks a few quick questions before it starts. Number keys pick, Enter continues. */
export function DecisionPrompt({
  questions, answers: value, defaultAnswers = [], onAnswersChange, onComplete, skippedLabel = 'Agent decides', startLabel = 'Starting',
  started = false, startedLabel, bare = true, className
}: DecisionPromptProps) {
  const [answers, setAnswers] = useControllable(value, defaultAnswers, onAnswersChange);
  const [sel, setSel] = useState(0);
  const n = questions.length, at = answers.length, done = at >= n, q = questions[Math.min(at, n - 1)];

  const next = (skipped = false) => {
    if (done) return;
    const all = [...answers, skipped ? null : sel];
    setAnswers(all); setSel(0);
    if (all.length >= n) onComplete?.(all);
  };
  const key = (e: KeyboardEvent) => {
    if (done) return;
    const count = q.options.length;
    if (/^[1-9]$/.test(e.key) && +e.key <= count) { setSel(+e.key - 1); e.preventDefault(); }
    else if (e.key === 'Enter') { next(); e.preventDefault(); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { setSel((sel + (e.key === 'ArrowDown' ? 1 : count - 1)) % count); e.preventDefault(); }
  };

  return (
    <div data-dm="" className={cx('dm-dpx', !bare && 'dm-panel', className)} tabIndex={0} onKeyDown={key}>
      <div className="dm-dpx-h">
        <span className="dm-dpx-k dm-muted dm-num">{done ? 'All set' : `Question ${at + 1} of ${n}`}</span>
        <div className="dm-dpx-dots" aria-hidden="true">{questions.map((_, i) => <i key={i} className={cx(!done && i === at && 'dm-on', (done || i < at) && 'dm-done')} />)}</div>
      </div>
      {/* keyed by question, so each one plays its entrance */}
      <div className="dm-dpx-body" key={done ? 'sum' : at} aria-live="polite">
        {done ? (
          <div className="dm-dpx-sum">
            {questions.map((x, i) => (
              <div key={i} className={cx('dm-dpx-sr', enter().className)} style={enter(i * 70).style}>
                <span>{x.label}</span>{answers[i] === null ? skippedLabel : x.options[answers[i]!]?.label}
              </div>
            ))}
            <div className={cx('dm-dpx-run', enter().className)} style={enter(n * 70).style}>{started
              ? <><span style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span><span>{startedLabel ?? startLabel}</span></>
              : <><Think /><span className="dm-shim">{startLabel}</span></>}</div>
          </div>
        ) : (
          <>
            <div className="dm-dpx-q dm-enter">{q.question}</div>
            <div role="radiogroup" aria-label={q.question}>
              {q.options.map((o, i) => (
                <button key={i} type="button" role="radio" aria-checked={i === sel} className={cx('dm-dpx-o', i === sel && 'dm-on', enter().className)} style={enter(60 + i * 50).style}
                  onClick={() => setSel(i)} onDoubleClick={() => next()}>
                  <span className="dm-kbd">{i + 1}</span>{o.label}{o.detail && <span className="dm-d">{o.detail}</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      <div className={cx('dm-dpx-f', done && 'dm-leave')} inert={done}>
        <button type="button" className="dm-pill dm-ghost dm-sm dm-dpx-skip" onClick={() => next(true)}>Skip</button>
        <button type="button" className="dm-pill dm-ink dm-sm dm-dpx-go" onClick={() => next()}>Continue <span className="dm-kbd">↵</span></button>
      </div>
    </div>
  );
}
```

## More in Review and approve

- [Change review](https://designme.dev/components/change-review.md): Accept or reject each change the agent made, file by file.
- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Permission gate](https://designme.dev/components/permission-gate.md): The agent asks before it touches something new.
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
