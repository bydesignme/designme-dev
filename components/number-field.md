# Number field

> Type a number or step it with minus and plus, with units, limits and a word when a value is changed to fit.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/number-field

## Install

```sh
npx designme add number-field          # HTML, CSS and JS, with the shared core
npx designme add number-field --react  # React 19 component and its CSS
npx designme add number-field --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/number-field.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/number-field.json  # Astro
```

## About

A field for a number you can type or step. Minus and plus sit at the ends of the field, a unit or a currency sign sits beside the value, and a hint under it gives the range. Press and hold minus or plus to keep going, faster the longer you hold; the arrow keys move a step, Shift or Page Up and Page Down ten. A typed value is rounded to the step and kept inside the range when you press Enter or leave the field, and the hint says what changed, like "$20.00 is the most" or "Rounded to 35 steps". The demo sets an agent's run limits.

### When to use it

- For limits and quantities with a sensible range: an agent's steps, budget and time per run, retries, seats, a page size.
- When people often move a value by a step or two, and sometimes type it outright.
- Instead of a slider when the exact number matters more than a feel for where it sits in its range.

### What it does

- `min`, `max`, `step` and `bigStep` (10 by default) set the range and how far the keys move it; `decimals` sets how the value shows, like 2 for money.
- `prefix` and `unit` show beside the value ("$", "steps", "min"); the value and its unit stay centred between minus and plus.
- Minus is disabled at `min` and plus at `max`. Pressing and holding either one steps at once, then repeats, faster as you hold.
- What you type is checked as you go (anything but digits and a point marks the field in red) and kept on Enter or when you leave: rounded to the step and kept inside the range. Escape puts back the value before.
- The hint shows the range ("5 to 100, in steps of 5") or, after a value was changed to fit, what changed. Set your own with `hint`.
- `NumberFieldGroup` is the panel from the demo: a title, a line under it, the fields and a summary at the foot.

### Accessibility

- The input is a spinbutton with aria-valuemin, aria-valuemax, aria-valuenow and the value in words as aria-valuetext ("10 minutes"); it is labelled by the field's label.
- Up and Down move a step, Shift with an arrow or Page Up and Page Down move ten. Enter keeps what was typed and Escape puts back the value before.
- Minus and plus are named buttons ("Fewer steps", "More steps") left out of the tab order, since the keys do the same; a person using a pointer presses or holds them.
- A value that isn't a number is marked with aria-invalid and a red edge, not colour alone: the hint asks for a number in the range.
- Clicking the label or beside the value puts the cursor in the field.

## Usage in React

```tsx
import { NumberField } from '@/components/designme/number-field/NumberField';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React components: two more steps, a budget raised to the most it
// allows, then a minute less of time.
import { useRef, useState } from 'react';
import { NumberField, NumberFieldGroup } from './NumberField';
import { useStory } from '../lib/useScript';

export default function NumberFieldDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [steps, setSteps] = useState(25);
  const [budget, setBudget] = useState(2.5);
  const [time, setTime] = useState(10);
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('[aria-label="More steps"]');
    await wait(500); press('[aria-label="More steps"]');
    await wait(2000); setBudget(20);
    await wait(2500); press('[aria-label="Less time"]');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <NumberFieldGroup title="Run limits" description="For each run of the release agent"
        summary={`A run stops at ${steps} steps, $${budget.toFixed(2)} or ${time} min, whichever comes first.`}>
        <NumberField label="Max steps" min={5} max={100} step={5} value={steps} onValueChange={setSteps} unit="steps" buttonLabels={['Fewer steps', 'More steps']} />
        <NumberField label="Budget per run" min={0.25} max={20} step={0.25} decimals={2} prefix="$" value={budget} onValueChange={setBudget}
          valueText={v => `$${v.toFixed(2)}`} buttonLabels={['Lower budget', 'Higher budget']} />
        <NumberField label="Time limit" min={1} max={60} value={time} onValueChange={setTime} unit="min" valueText={v => `${v} minutes`} buttonLabels={['Less time', 'More time']} />
      </NumberFieldGroup>
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `label` | `string` | Like "Max steps" |
| `min` (optional) | `number` |  |
| `max` (optional) | `number` |  |
| `step` (optional) | `number` |  |
| `bigStep` (optional) | `number` | Steps that Shift with an arrow, Page Up and Page Down move by (10) |
| `value` (optional) | `number` |  |
| `defaultValue` (optional) | `number` |  |
| `onValueChange` (optional) | `(value: number) => void` |  |
| `decimals` (optional) | `number` | Decimal places the value shows with, like 2 for money (0) |
| `prefix` (optional) | `string` | Shown before the value, like "$" |
| `unit` (optional) | `string` | Shown after the value, like "min" |
| `valueText` (optional) | `(value: number) => string` | The value in words for screen readers, like "10 minutes". Defaults to the prefix, value and unit |
| `hint` (optional) | `string` | The line under the field. Defaults to the range, like "5 to 100, in steps of 5" |
| `buttonLabels` (optional) | `[string, string]` | What the minus and plus buttons are called, like ["Fewer steps", "More steps"] |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import NumberField from '../components/designme/number-field/NumberField.astro';
---
<NumberField />
<NumberField data-style="soft" class="my-class" />
```
It plays its demo; change `number-field.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Why not an input with type="number"?**

Its spinner is tiny, looks different in every browser, changes the value when you scroll over it, and can't show a unit. This keeps the same keys and the spinbutton role, with buttons you can hit and a unit beside the value.

**What happens to a value that is out of range?**

It is kept at the nearest end when you press Enter or leave the field, and the hint says so, like "100 steps is the most". `onValueChange` only ever gets values inside the range and on a step.

**Can it show money?**

Yes. Use `prefix="$"` and `decimals={2}`, with a step like 0.25. For other currencies, change the prefix or use `unit` for a code after the value.

## Source

`NumberField.tsx`, as `npx designme add number-field --react` installs it:

```tsx
'use client';
import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap } from '../lib/motion';
import '../designme.css';
import './number-field.css';

export interface NumberFieldProps {
  /** Like "Max steps" */
  label: string;
  min?: number;
  max?: number;
  step?: number;
  /** Steps that Shift with an arrow, Page Up and Page Down move by (10) */
  bigStep?: number;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  /** Decimal places the value shows with, like 2 for money (0) */
  decimals?: number;
  /** Shown before the value, like "$" */
  prefix?: string;
  /** Shown after the value, like "min" */
  unit?: string;
  /** The value in words for screen readers, like "10 minutes". Defaults to the prefix, value and unit */
  valueText?: (value: number) => string;
  /** The line under the field. Defaults to the range, like "5 to 100, in steps of 5" */
  hint?: string;
  /** What the minus and plus buttons are called, like ["Fewer steps", "More steps"] */
  buttonLabels?: [string, string];
  className?: string;
}

const fix = (x: number) => +x.toFixed(4);

/** A number to type or step: minus and plus (press and hold to keep going), the arrow keys, Shift or Page Up/Down for ten
    steps. A typed value is rounded to the step and kept inside the range when you press Enter or leave, and the hint says so. */
export function NumberField({ label, min = 0, max = 100, step = 1, bigStep = 10, value, defaultValue = min, onValueChange, decimals = 0, prefix, unit, valueText, hint, buttonLabels = ['Decrease', 'Increase'], className }: NumberFieldProps) {
  const [v, setV] = useControllable(value, defaultValue, onValueChange);
  const shown = (x: number) => x.toFixed(decimals);
  const say = valueText ?? ((x: number) => `${prefix ?? ''}${shown(x)}${unit ? ' ' + unit : ''}`);
  const range = hint ?? `${shown(min)} to ${shown(max)}${step !== 1 ? `, in steps of ${step.toFixed(decimals)}` : ''}`;
  const [text, setText] = useState(shown(v));
  const [note, setNote] = useState('');
  const [bad, setBad] = useState(false);
  const [bump, setBump] = useState(0);
  const editing = useRef(false);
  useEffect(() => { if (!editing.current) setText(shown(v)); }, [v, decimals]); // eslint-disable-line react-hooks/exhaustive-deps
  const vRef = useRef(v); vRef.current = v;
  const set = (x: number, why?: string) => {
    const next = fix(Math.min(max, Math.max(min, x)));
    if (next !== vRef.current) { setV(next); vRef.current = next; setBump(b => b + 1); }
    setText(shown(next));
    setNote(why ?? (x > max ? `${say(max)} is the most` : x < min ? `${say(min)} is the least` : ''));
  };
  const stepBy = (n: number) => set(vRef.current + n * step);
  const commit = () => {
    editing.current = false; setBad(false);
    const raw = text.replace(/[^0-9.]/g, ''), x = parseFloat(raw);
    if (!raw || isNaN(x)) { setText(shown(vRef.current)); setNote(`Enter a number from ${shown(min)} to ${shown(max)}`); return; }
    const snapped = fix(Math.round((x - min) / step) * step + min);
    if (x > max || x < min) set(x);
    else set(snapped, Math.abs(snapped - x) > 1e-9 ? `Rounded to ${say(snapped)}` : '');
  };
  // press and hold minus or plus: one step at once, then more and more quickly until you let go
  const hold = useRef<ReturnType<typeof setTimeout>>(undefined);
  const stop = () => clearTimeout(hold.current);
  useEffect(() => stop, []);
  const press = (d: number) => {
    stepBy(d); stop();
    const rep = (ms: number) => { hold.current = setTimeout(() => { const at = vRef.current; if ((d < 0 && at <= min) || (d > 0 && at >= max)) return; stepBy(d); rep(Math.max(40, ms * .8)); }, ms); };
    rep(420);
  };
  const input = useRef<HTMLInputElement>(null), box = useRef<HTMLDivElement>(null);
  // a nudge of the value each time it changes
  useEffect(() => { const b = box.current; if (!b || !bump) return; b.classList.remove('dm-bump'); void b.offsetWidth; b.classList.add('dm-bump'); }, [bump]);
  const id = useId();
  const btn = (d: number, name: string): ReactNode => (
    <button type="button" className={cx('dm-ib', d < 0 ? 'dm-nmf-dn' : 'dm-nmf-up')} tabIndex={-1} aria-label={name} disabled={d < 0 ? v <= min : v >= max}
      onPointerDown={e => { if (e.button) return; e.preventDefault(); press(d); }} onPointerUp={stop} onPointerLeave={stop} onPointerCancel={stop}
      onClick={e => { if (e.detail === 0) stepBy(d); }}>
      <Icon name={d < 0 ? 'minus' : 'plus'} size="xs" />
    </button>
  );
  return (
    <div data-dm="" className={cx('dm-nmf-f', note && 'dm-noted', className)}>
      <span className="dm-nmf-l" id={id} onClick={() => input.current?.focus()}>{label}</span>
      <div ref={box} className="dm-nmf-in">
        {btn(-1, buttonLabels[0])}
        <span className="dm-nmf-v" onClick={e => { if (e.target !== input.current) input.current?.focus(); }}>
          {prefix && <span className="dm-nmf-u">{prefix}</span>}
          <input ref={input} className="dm-num" role="spinbutton" inputMode="decimal" autoComplete="off" spellCheck={false} aria-labelledby={id}
            aria-valuemin={min} aria-valuemax={max} aria-valuenow={v} aria-valuetext={say(v)} aria-invalid={bad || undefined} value={text}
            onChange={e => { editing.current = true; setText(e.target.value); setBad(!/^\$?\d*\.?\d*$/.test(e.target.value.trim())); }}
            onBlur={commit}
            onKeyDown={e => {
              if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { e.preventDefault(); editing.current = false; stepBy((e.key === 'ArrowUp' ? 1 : -1) * (e.shiftKey ? bigStep : 1)); }
              else if (e.key === 'PageUp' || e.key === 'PageDown') { e.preventDefault(); editing.current = false; stepBy(e.key === 'PageUp' ? bigStep : -bigStep); }
              else if (e.key === 'Enter') { e.preventDefault(); commit(); }
              else if (e.key === 'Escape') { editing.current = false; setBad(false); setText(shown(vRef.current)); }
            }} />
          {unit && <span className="dm-nmf-u">{unit}</span>}
        </span>
        {btn(1, buttonLabels[1])}
      </div>
      <Swap className="dm-nmf-hint dm-muted">{note || range}</Swap>
    </div>
  );
}

/** The panel the fields sit in on designme.dev: a title, a line under it, the fields, and an optional summary at the foot */
export function NumberFieldGroup({ title, description, summary, children, className }: { title?: string; description?: string; summary?: string; children: ReactNode; className?: string }) {
  return (
    <div data-dm="" className={cx('dm-nmf dm-panel', className)}>
      {title && <div className="dm-nmf-h"><b>{title}</b>{description && <span className="dm-muted">{description}</span>}</div>}
      {children}
      {summary != null && <p className="dm-nmf-sum dm-muted" aria-live="polite">{summary}</p>}
    </div>
  );
}
```

## More in Collaboration

- [Banner](https://designme.dev/components/banner.md): An announcement on a tint of its tone, with its own line drawing.
- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.
- [Notifications](https://designme.dev/components/notifications.md): An inbox where agent updates and mentions arrive live.
- [Invite to collaborate](https://designme.dev/components/invite-to-collaborate.md): Add teammates by email as chips, set their role, send.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Profile menu](https://designme.dev/components/profile-menu.md): The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.
- [Context menu](https://designme.dev/components/context-menu.md): Right-click an agent reply for its actions, with a submenu that asks the agent about it.
- [Context switcher](https://designme.dev/components/context-switcher.md): The organisation, project and environment you are in, each part a searchable switcher.
- [Filter menu](https://designme.dev/components/filter-menu.md): Add filters from a menu, see them as chips, and watch the count change.
- [Ticket list](https://designme.dev/components/ticket-list.md): Support tickets the agent has triaged, with suggested replies.
- [Kanban board](https://designme.dev/components/kanban-board.md): A sprint board where you and the agent move cards, with filters, details and keyboard moves.

All components: https://designme.dev/llms.txt
