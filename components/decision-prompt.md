# Decision prompt

> The agent asks a few quick questions before it starts.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/decision-prompt

## Install

```sh
npx designme add decision-prompt          # HTML, CSS and JS, with the shared core
npx designme add decision-prompt --react  # React 19 component and its CSS
npx designme add decision-prompt --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/decision-prompt.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/decision-prompt.json  # Astro
```

## About

Decision prompt lets an agent ask a few multiple-choice questions before it starts a task, one question at a time. When the last one is answered it shows a short summary of the choices and a line that says the agent is getting going.

### When to use it

- When a request is vague and two or three answers would change what the agent does.
- When you want quick answers by keyboard instead of a long reply in chat.
- When some questions can be left to the agent and people should be able to skip them.
- When the person should see a recap of their choices before the work begins.

### What it does

- Shows one question at a time with a "Question 2 of 3" counter and progress dots. Once every question is answered the dots fade away where they are, with a small shrink (at once with reduced motion), and the rest of the head stays put.
- Each option is a row you can pick, with a number badge, its `label` and an optional `detail` such as "Recommended". The picked row's edge steps up and its number fills in.
- Continue, with the Enter key's ↵ beside its word, saves the picked option and moves on. Skip records `null`, which the summary shows as `skippedLabel` ("Agent decides" by default).
- Double-clicking an option picks it and continues in one go.
- `onComplete` fires with every answer once the last question is done. Answers can also be controlled with `answers` and `onAnswersChange`.
- In Soft and Blueprint the footer sits under a hairline divider, its buttons and later its start line alike; in Clean it is the card's off-white foot strip.
- Once the last question is answered, Skip and Continue give way to a `startLabel` line that shimmers until you set `started`, then settles with a green check and `startedLabel`.
- The prompt grows and shrinks smoothly with each question and with the summary, so it never keeps empty room for what comes next.

### Accessibility

- Options sit in a `radiogroup` labelled with the question, and each option is a `radio` with `aria-checked`.
- Number keys 1 to 9 pick an option, Arrow Up and Arrow Down move the choice, and Enter continues.
- The question area is an `aria-live="polite"` region, so each new question and the summary are announced.
- The start line that replaces Skip and Continue is an `aria-live="polite"` region too. If the focus was on one of those buttons, it moves to the prompt.

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
| `startLabel` (optional) | `string` | The line that takes the buttons' place, under the summary, while the agent gets going |
| `started` (optional) | `boolean` | The agent has got going: that line settles with a green check |
| `startedLabel` (optional) | `string` | What that line says once started. Defaults to startLabel |
| `bare` (optional) | `boolean` | Draws its own container (the default, as on designme.dev). Set true to sit it flat in a chat thread |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import DecisionPrompt from '../components/designme/decision-prompt/DecisionPrompt.astro';
---
<DecisionPrompt />
<DecisionPrompt data-style="soft" class="my-class" />
```
It plays its demo; change `decision-prompt.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

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
import { enter, Think, useGrow } from '../lib/motion';
import { giveBack } from '../lib/popover';
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
  /** The line that takes the buttons' place, under the summary, while the agent gets going */
  startLabel?: string;
  /** The agent has got going: that line settles with a green check */
  started?: boolean;
  /** What that line says once started. Defaults to startLabel */
  startedLabel?: string;
  /** Draws its own container (the default, as on designme.dev). Set true to sit it flat in a chat thread */
  bare?: boolean;
  className?: string;
}

/** The agent asks a few quick questions before it starts. Number keys pick, Enter continues. */
export function DecisionPrompt({
  questions, answers: value, defaultAnswers = [], onAnswersChange, onComplete, skippedLabel = 'Agent decides', startLabel = 'Starting',
  started = false, startedLabel, bare = false, className
}: DecisionPromptProps) {
  const [answers, setAnswers] = useControllable(value, defaultAnswers, onAnswersChange);
  const [sel, setSel] = useState(0);
  const n = questions.length, at = answers.length, done = at >= n, q = questions[Math.min(at, n - 1)];

  // no room is kept for the next question or the summary: the card grows and shrinks with them
  const [root, inner] = useGrow();
  const next = (skipped = false) => {
    if (done) return;
    const all = [...answers, skipped ? null : sel];
    setAnswers(all); setSel(0);
    if (all.length >= n) {
      // the buttons give way to the line saying the agent has started: a focus that was on them comes back to the card
      if (root.current?.querySelector('.dm-dpx-f')?.contains(document.activeElement)) giveBack(root.current);
      onComplete?.(all);
    }
  };
  const key = (e: KeyboardEvent) => {
    if (done) return;
    const count = q.options.length;
    if (/^[1-9]$/.test(e.key) && +e.key <= count) { setSel(+e.key - 1); e.preventDefault(); }
    else if (e.key === 'Enter') { next(); e.preventDefault(); }
    else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { setSel((sel + (e.key === 'ArrowDown' ? 1 : count - 1)) % count); e.preventDefault(); }
  };

  return (
    <div data-dm="" ref={root} className={cx('dm-dpx', !bare && 'dm-panel', 'dm-growing', className)} tabIndex={0} onKeyDown={key}>
      <div ref={inner} className="dm-grow">
      <div className="dm-dpx-h">
        <span className="dm-dpx-k dm-muted dm-num">{done ? 'All set' : `Question ${at + 1} of ${n}`}</span>
        {/* once every question is answered the steps are over: the dots fade away where they are, keeping their room */}
        <div className={cx('dm-dpx-dots', done && 'dm-gone')} aria-hidden="true">{questions.map((_, i) => <i key={i} className={cx(!done && i === at && 'dm-on', (done || i < at) && 'dm-done')} />)}</div>
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
          </div>
        ) : (
          <>
            {/* the next question plays its entrance; the first is drawn from the start, so a frame that doesn't animate yet (a
                small live preview off screen) still shows it */}
            <div className={cx('dm-dpx-q', at > 0 && 'dm-enter')}>{q.question}</div>
            <div className="dm-dpx-opts" role="radiogroup" aria-label={q.question}>
              {q.options.map((o, i) => (
                <button key={i} type="button" role="radio" aria-checked={i === sel} className={cx('dm-dpx-o', i === sel && 'dm-on', at > 0 && enter().className)} style={at > 0 ? enter(60 + i * 50).style : undefined}
                  onClick={() => setSel(i)} onDoubleClick={() => next()}>
                  <span className="dm-kbd">{i + 1}</span>{o.label}{o.detail && <span className="dm-d">{o.detail}</span>}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
      {/* once every question is answered, the line saying the agent has started takes the buttons' place */}
      <div className={cx('dm-dpx-f', done && 'dm-run')}>
        {done ? (
          <div className={cx('dm-dpx-run', enter().className)} style={enter(n * 70).style} aria-live="polite">{started
            ? <><span className="dm-dpx-ok"><Icon name="check" size="xs" /></span><span>{startedLabel ?? startLabel}</span></>
            : <><Think /><span className="dm-shim">{startLabel}</span></>}</div>
        ) : (
          <>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-dpx-skip" onClick={() => next(true)}>Skip</button>
            <button type="button" className="dm-pill dm-primary dm-sm dm-dpx-go" onClick={() => next()}>Continue <span className="dm-kbd">↵</span></button>
          </>
        )}
      </div>
      </div>
    </div>
  );
}
```

## More in Review and approve

- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Permission gate](https://designme.dev/components/permission-gate.md): The agent asks before it touches something new.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Inline text diff](https://designme.dev/components/inline-text-diff.md): The agent's edits to a piece of copy, accepted or rejected one by one.
- [Draft review](https://designme.dev/components/draft-review.md): An email the agent drafted, to check and edit before it sends.
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.

All components: https://designme.dev/llms.txt
