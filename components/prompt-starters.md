# Prompt starters

> Suggested tasks that fill the composer in one click.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/prompt-starters

## Install

```sh
npx designme add prompt-starters          # HTML, CSS and JS, with the shared core
npx designme add prompt-starters --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Prompt starters shows a grid of suggested tasks as cards, each with an icon, a short title and a one-line description. Picking a card writes its full prompt into the field below, word by word, and the Send button passes that prompt to your agent.

### When to use it

- On an empty chat or a new workspace, when people don't know what to ask the agent first.
- When you want to show what the agent is good at with real, ready-to-send tasks.
- When you have more suggestions than fit on screen and want a Shuffle button to swap in another set.

### What it does

- Starters are laid out two to a row and stagger in. Each one has an `icon`, an optional `tone` that colours the icon, a `title`, a `description` and the `prompt` it writes.
- Picking a card highlights it and types its prompt into the field at a word every 40 milliseconds.
- The picked starter is tracked by its title and can be controlled with `value` and `onValueChange`. Setting `value` from outside fills the field the same way a click does.
- Send is enabled once a starter is picked. It calls `onSend` with the prompt and then shows `sentLabel`, which defaults to "Sent to the agent".
- `onShuffle` adds a Shuffle button. Pass a new `starters` set when it is called, and the cards stagger in again while the field clears.

### Accessibility

- Each starter card is a button with `aria-pressed` set on the picked one.
- The Send icon button is labelled "Send" and stays disabled until a starter is picked.
- With `prefers-reduced-motion: reduce`, the prompt appears at once instead of word by word.

## Usage in React

```tsx
import { PromptStarters } from '@/components/designme/prompt-starters/PromptStarters';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { PromptStarters, type Starter } from './PromptStarters';

/* ---------- Prompt starters: two sets of four; the box starts empty, a pick fills it, Shuffle swaps between them ---------- */
const SETS: Starter[][] = [
  [
    { icon: 'grid', tone: 'blue', title: 'Audit a page', description: 'Check the pricing page for spacing and contrast', prompt: 'Audit pricing for spacing and contrast' },
    { icon: 'edit', tone: 'purple', title: 'Rewrite copy', description: 'Make the onboarding intro shorter', prompt: 'Make the onboarding intro shorter' },
    { icon: 'code', tone: 'green', title: 'Export tokens', description: 'Turn colour and spacing into CSS variables', prompt: 'Export the tokens as CSS variables' },
    { icon: 'layers', tone: 'orange', title: 'Compare frames', description: 'Diff the mobile and desktop frames', prompt: 'Diff the mobile and desktop frames' }
  ],
  [
    { icon: 'chart', tone: 'teal', title: 'Explain a metric', description: 'Why did activation drop last week', prompt: 'Why did activation drop last week?' },
    { icon: 'mail', tone: 'pink', title: 'Draft an email', description: 'Announce the new pricing to customers', prompt: 'Announce the new pricing by email' },
    { icon: 'alert', tone: 'red', title: 'Find a bug', description: 'Trace why checkout logs people out', prompt: 'Fix checkout logging people out' },
    { icon: 'figma', tone: 'purple', title: 'Build from Figma', description: 'Turn the hero frame into code', prompt: 'Build the hero frame in React' }
  ]
];

export default function PromptStartersDemo() {
  const [set, setSet] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  return (
    <div style={{ width: '100%' }}>
      <PromptStarters starters={SETS[set]} value={picked} onValueChange={setPicked} onShuffle={() => { setPicked(null); setSet(s => (s + 1) % SETS.length); }} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `starters` | `Starter[]` | The starters to show, two to a row. Pass a new set (from onShuffle) and they stagger in again |
| `value` (optional) | `string \| null` | The title of the picked starter. Leave it out to let the cards pick it |
| `defaultValue` (optional) | `string \| null` |  |
| `onValueChange` (optional) | `(title: string \| null) => void` |  |
| `onSend` (optional) | `(prompt: string) => void` | Called with the prompt when the person presses Send |
| `onShuffle` (optional) | `() => void` | Adds a Shuffle button under the field. Swap in another set of starters when it is called |
| `placeholder` (optional) | `string` |  |
| `sentLabel` (optional) | `string` | Shown in the field once the prompt is sent |
| `className` (optional) | `string` |  |

## Questions

**Can people edit the prompt before sending it?**

Not inside this component. Its field displays the picked prompt and is not a text input. To let people edit, look up the starter from the title `onValueChange` gives you and put its prompt into your own composer.

**How do I offer a different set of suggestions?**

Pass `onShuffle` and change `starters` when it is called. A new set clears the field and the picked starter, then the cards come in again.

**Can I pick a starter for the person, for example on first load?**

Yes. Set `value` to the starter's title from your own state and its prompt is typed into the field as if it had been clicked.

## Source

`PromptStarters.tsx`, as `npx designme add prompt-starters --react` installs it:

```tsx
'use client';
import { useEffect, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Tip } from '../lib/motion';
import '../designme.css';
import './prompt-starters.css';

export type StarterTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface Starter {
  icon: IconName;
  /** Colours the icon */
  tone?: StarterTone;
  /** A few words, like "Audit a page" */
  title: string;
  /** One quiet line under the title */
  description: string;
  /** The full prompt it writes into the field when picked */
  prompt: string;
}

export interface PromptStartersProps {
  /** The starters to show, two to a row. Pass a new set (from onShuffle) and they stagger in again */
  starters: Starter[];
  /** The title of the picked starter. Leave it out to let the cards pick it */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (title: string | null) => void;
  /** Called with the prompt when the person presses Send */
  onSend?: (prompt: string) => void;
  /** Adds a Shuffle button under the field. Swap in another set of starters when it is called */
  onShuffle?: () => void;
  placeholder?: string;
  /** Shown in the field once the prompt is sent */
  sentLabel?: string;
  className?: string;
}

const TONE: Record<StarterTone, string> = { blue: 'pb', purple: 'pl', green: 'pm', orange: 'pp', red: 'pr', yellow: 'py', pink: 'pk', teal: 'pt' };

/** Suggested first prompts as cards. Picking one writes its prompt into the field, word by word. */
export function PromptStarters({ starters, value, defaultValue = null, onValueChange, onSend, onShuffle, placeholder = 'Pick a starter or type your own', sentLabel = 'Sent to the agent', className }: PromptStartersProps) {
  const [picked, setPicked] = useControllable(value, defaultValue, onValueChange);
  const reduce = useReducedMotion();
  const set = starters.map(s => s.title).join('\u0000');
  // what the field shows: the picked prompt as it is typed, or the line after sending
  const [field, setField] = useState<{ key: number; words: string[]; sent: boolean } | null>(null);
  const [typed, setTyped] = useState(0);

  const fill = (s: Starter) => { setField(f => ({ key: (f?.key ?? 0) + 1, words: s.prompt.split(' '), sent: false })); setTyped(0); };
  const pick = (s: Starter) => { setPicked(s.title); setFilledFor(s.title); fill(s); };
  // a starter picked from outside, through value, fills the field the same way a click does
  const [filledFor, setFilledFor] = useState(picked);
  if (picked !== filledFor) { setFilledFor(picked); const s = starters.find(x => x.title === picked); if (s) fill(s); }
  // a word every 40ms
  useEffect(() => {
    if (!field || field.sent || typed >= field.words.length) return;
    const t = setTimeout(() => setTyped(n => n + 1), typed === 0 ? 0 : reduce ? 0 : 40);
    return () => clearTimeout(t);
  }, [field, typed, reduce]);
  // a new set of starters clears the field
  const [shown, setShown] = useState(set);
  if (shown !== set) { setShown(set); setField(null); setTyped(0); }
  useEffect(() => { if (picked !== null && !starters.some(s => s.title === picked)) setPicked(null); }, [set]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = () => {
    const s = starters.find(x => x.title === picked); if (!s || !field || field.sent) return;
    onSend?.(s.prompt);
    setField(f => ({ key: (f?.key ?? 0) + 1, words: [sentLabel], sent: true }));
    setPicked(null);
  };
  const ready = !!field && !field.sent && picked !== null;

  return (
    <div data-dm="" className={cx('dm-psx', className)}>
      <div className="dm-psx-grid" key={set}>
        {starters.map((s, i) => {
          const e = enter(i * 60), tone = s.tone && TONE[s.tone];
          return (
            <button type="button" key={s.title} className={cx('dm-psx-c', e.className, picked === s.title && 'dm-on')} style={e.style} aria-pressed={picked === s.title} onClick={() => pick(s)}>
              <span className="dm-psx-ic" style={tone ? { color: `var(--dm-${tone})` } : undefined}><Icon name={s.icon} /></span>
              <b>{s.title}</b>
              <span className="dm-d">{s.description}</span>
            </button>
          );
        })}
      </div>
      <div className={cx('dm-psx-in', field && 'dm-has')}>
        <span className="dm-psx-ph">{placeholder}</span>
        <span className="dm-psx-tx" key={field?.key}>
          {field?.sent ? <span className="dm-w">{field.words[0]}</span> : field?.words.slice(0, typed).map((w, i) => <span key={i} className="dm-w">{w} </span>)}
        </span>
        <Tip label="Send">
          <button type="button" className="dm-psx-go" aria-label="Send" disabled={!ready} onClick={send}><Icon name="up" /></button>
        </Tip>
      </div>
      {onShuffle && <button type="button" className="dm-pill dm-ghost dm-sm dm-psx-sh" onClick={onShuffle}><Icon name="refresh" size="xs" />Shuffle</button>}
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with context, environment, effort and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with a live preview and versions.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
