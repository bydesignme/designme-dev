# Tooltip

> Quiet labels on hover, with shortcuts and a richer preview card.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/tooltip

## Install

```sh
npx designme add tooltip          # HTML, CSS and JS, with the shared core
npx designme add tooltip --react  # React 19 component and its CSS
npx designme add tooltip --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/tooltip.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/tooltip.json  # Astro
```

## About

Tooltip is a toolbar of icon buttons whose labels appear after a short pause and then follow the pointer from button to button without waiting again. Avatars at the end open a larger card about each person, including the agent, with what they are doing right now. It shows a team and its agent working side by side in the same file.

### When to use it

- When a toolbar is all icons and each one needs a name and a keyboard shortcut
- When people and agents share a workspace and you want to show who is doing what
- When an agent's presence should read as a teammate, with its own status line
- When onboarding should point at a specific control by showing its tip on cue

### What it does

- Tools come in `groups`, with a thin divider between each group.
- Each tip shows the tool's `tip` text, or its `label`, plus an optional `kbd` shortcut.
- The first tip waits a moment, and moving straight to the next button shows its tip at once.
- Hovering an avatar opens a person card after `cardDelay` ms, 300 by default, with name, role and status.
- A person marked `working` shows the agent's thinking dots instead of a green dot.
- `openTip` and `openCard` show a tip or card by key from your own code, for a guided tour.

### Accessibility

- Each icon button gets its `label` as an `aria-label`, and avatar buttons are named with the person's name.
- Tips render with `role="tooltip"` and also open on keyboard focus, not only on hover.
- Person cards open when an avatar receives keyboard focus and close on blur.
- The card is marked `aria-hidden` while it is not showing.

## Usage in React

```tsx
import { Tooltip } from '@/components/designme/tooltip/Tooltip';
```

### Example

```tsx
'use client';
// The tooltip card from designme.dev: a toolbar with shortcut tips and two people with a card each.
import { useRef, useState } from 'react';
import { useScript, useTakeover } from '../lib/useScript';
import { Tooltip, type TooltipPerson } from './Tooltip';

const PEOPLE: TooltipPerson[] = [
  { key: 'mk', initials: 'MK', color: 'var(--dm-av-l)', name: 'Maya Kim', role: 'Design lead', status: 'Editing Pricing, frame 2' },
  { key: 'da', initials: 'DA', color: 'var(--dm-av-b)', name: 'Design agent', role: 'Working for Maya', status: 'Auditing contrast, 2 of 6 checks', working: true }
];

export default function TooltipDemo() {
  const [tip, setTip] = useState<string | null>();
  const [card, setCard] = useState<string | null>();
  // once it has appeared it shows what it does: a shortcut tip, then the agent's card. Pointing at it takes over, as does
  // clicking, focusing or typing in it, and puts away what the demo had open unless the pointer is on it
  const touched = useRef(false), ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref, () => setTip(undefined));
  const yours = () => touched.current || mine();
  useScript(async ({ wait }) => {
    await wait(1300); if (yours()) return;
    setTip('ask'); await wait(1700); setTip(undefined); if (yours()) return;
    await wait(500); if (yours()) return;
    setCard('da'); await wait(2600); setCard(null);
  });
  return (
    <div ref={ref} style={{ width: '100%' }} onPointerEnter={() => { touched.current = true; setTip(undefined); setCard(c => (c ? null : c)); }}>
      <Tooltip people={PEOPLE} openTip={tip} openCard={card} note="Labels wait a moment, then follow you instantly between buttons." />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `groups` (optional) | `TooltipTool[][]` | The toolbar's buttons, in groups with a line between them |
| `people` (optional) | `TooltipPerson[]` | Avatars at the end of the toolbar. Hovering one shows a card about the person |
| `note` (optional) | `ReactNode` | A quiet line under the toolbar |
| `cardDelay` (optional) | `number` | How long the person card waits before it shows |
| `openTip` (optional) | `string \| null` | Shows this tool's tip, by key, as if it were hovered. Leave it out to let the pointer decide |
| `openCard` (optional) | `string \| null` | Shows this person's card, by key, as if they were hovered. Leave it out to let the pointer decide |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import Tooltip from '../components/designme/tooltip/Tooltip.astro';
---
<Tooltip />
<Tooltip data-style="soft" class="my-class" />
```
It plays its demo; change `tooltip.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Can the label read differently from the button's accessible name?**

Yes. `label` is the name screen readers hear, and `tip` is the visible tooltip text when you want it to say more, like "Ask the agent" for a button named "Ask agent".

**How do I show what the agent is doing in the person card?**

Add the agent to `people` with a `status` like "Auditing contrast, 2 of 6 checks" and set `working: true`. The card then shows the thinking dots next to the status.

**How do I open a tip from code, for a walkthrough?**

Set `openTip` to the tool's key, or `openCard` to a person's key. Clear it to close, and leave it undefined to let the pointer decide again.

## Source

`Tooltip.tsx`, as `npx designme add tooltip --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { Icon, type IconName } from '../lib/icons';
import { Avatar, Dot, Think, Tip } from '../lib/motion';
import '../designme.css';
import './tooltip.css';

export interface TooltipTool {
  key: string;
  icon: IconName;
  /** The button's name, read out by screen readers */
  label: string;
  /** The tooltip, when it should say more than the name, like "Ask the agent". Defaults to the label */
  tip?: string;
  /** A shortcut shown after the tip, like "⌘Z" */
  kbd?: string;
  onClick?: () => void;
}

export interface TooltipPerson {
  key: string;
  initials: string;
  /** The avatar's colour, like 'var(--dm-av-l)' */
  color: string;
  name: string;
  /** The quiet line under the name, like "Design lead" */
  role: string;
  /** What they are doing now, like "Editing Pricing, frame 2" */
  status: string;
  /** Shows the agent's thinking dots instead of the green dot */
  working?: boolean;
}

export interface TooltipProps {
  /** The toolbar's buttons, in groups with a line between them */
  groups?: TooltipTool[][];
  /** Avatars at the end of the toolbar. Hovering one shows a card about the person */
  people?: TooltipPerson[];
  /** A quiet line under the toolbar */
  note?: ReactNode;
  /** How long the person card waits before it shows */
  cardDelay?: number;
  /** Shows this tool's tip, by key, as if it were hovered. Leave it out to let the pointer decide */
  openTip?: string | null;
  /** Shows this person's card, by key, as if they were hovered. Leave it out to let the pointer decide */
  openCard?: string | null;
  className?: string;
}

const DEFAULT_GROUPS: TooltipTool[][] = [
  [{ key: 'undo', icon: 'undo', label: 'Undo', kbd: '⌘Z' }, { key: 'comment', icon: 'edit', label: 'Comment', kbd: 'C' }, { key: 'ask', icon: 'spark', label: 'Ask agent', tip: 'Ask the agent', kbd: '⌘J' }],
  [{ key: 'share', icon: 'users', label: 'Share', tip: 'Share with your team' }]
];

/** A toolbar whose labels wait a moment, then follow you instantly between buttons, with a richer card for people. */
export function Tooltip({ groups = DEFAULT_GROUPS, people = [], note, cardDelay = 300, openTip, openCard, className }: TooltipProps) {
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // the card keeps its last person while it fades out
  const [card, setCard] = useState<{ person: TooltipPerson; left: number; top: number } | null>(null);
  const [show, setShow] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);

  const open = (person: TooltipPerson, el: HTMLElement, now = false) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const box = root.current; if (!box) return;
      const rr = box.getBoundingClientRect(), br = el.getBoundingClientRect();
      // centred under the avatar, kept inside the component
      const left = Math.max(0, Math.min(br.left - rr.left + br.width / 2 - 115, rr.width - 230));
      setCard({ person, left, top: br.bottom - rr.top + 10 }); setShow(true);
    }, now ? 0 : cardDelay);
  };
  const close = () => { clearTimeout(timer.current); setShow(false); };
  // the avatar under the pointer: a card opened from code and then let go stays while the pointer is on its avatar
  const hovered = useRef<string | null>(null);
  // a card asked for by key opens at once under its avatar, and closes when the key is cleared
  const avatars = useRef(new Map<string, HTMLButtonElement>());
  useEffect(() => {
    if (openCard === undefined) return;
    const person = people.find(x => x.key === openCard), el = person && avatars.current.get(person.key);
    if (person && el) open(person, el, true); else if (!hovered.current) close();
  }, [openCard]); // eslint-disable-line react-hooks/exhaustive-deps

  const p = card?.person;
  return (
    <div data-dm="" ref={root} className={cx('dm-ttp', className)}>
      <div className="dm-ttp-bar dm-panel">
        {groups.map((g, i) => [
          i > 0 && <span key={'s' + i} className="dm-ttp-sep" />,
          ...g.map(t => (
            <Tip key={t.key} label={t.tip ?? t.label} kbd={t.kbd} open={openTip === t.key || undefined}>
              <button type="button" className="dm-ib" aria-label={t.label} onClick={t.onClick}><Icon name={t.icon} /></button>
            </Tip>
          ))
        ])}
        {people.length > 0 && <>
          <span className="dm-ttp-sep" />
          <span className="dm-ttp-avs">
            {people.map(person => (
              <button key={person.key} ref={el => { if (el) avatars.current.set(person.key, el); else avatars.current.delete(person.key); }} type="button" className="dm-ttp-av" aria-label={person.name}
                onMouseEnter={e => { hovered.current = person.key; open(person, e.currentTarget); }} onMouseLeave={() => { hovered.current = null; close(); }}
                onFocus={e => { if (e.currentTarget.matches(':focus-visible')) open(person, e.currentTarget, true); }} onBlur={close}>
                <Avatar initials={person.initials} color={person.color} />
              </button>
            ))}
          </span>
        </>}
      </div>
      <div className={cx('dm-ttp-card dm-panel', show && 'dm-show')} style={card ? { left: card.left, top: card.top } : undefined} aria-hidden={!show}>
        <div className="dm-ttp-ci">
          {p && <>
            <div className="dm-ttp-ch"><Avatar initials={p.initials} color={p.color} /><div><b>{p.name}</b><span>{p.role}</span></div></div>
            <div className="dm-ttp-cs">{p.working ? <span style={{ display: 'inline-flex', color: 'var(--dm-accent)' }}><Think /></span> : <Dot />}{p.status}</div>
          </>}
        </div>
      </div>
      {note && <p className="dm-muted dm-ttp-n">{note}</p>}
    </div>
  );
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Badge](https://designme.dev/components/badge.md): Small labels for plans, environments and status, with a dot, an icon or a remove button.
- [Progress and meter](https://designme.dev/components/progress.md): A run's progress as a ring, steps and a bar, beside a credits meter that warns as it fills.
- [Slider](https://designme.dev/components/slider.md): Named stops, a stepped scale and a range, with the agent's recommended value marked on the track.
- [Search input](https://designme.dev/components/search-input.md): Search with scoped filters, recent queries and an agent answer.
- [Country select](https://designme.dev/components/country-select.md): A searchable select with country codes, currency and keyboard support.
- [Multi-select](https://designme.dev/components/multi-select.md): A combobox that filters as you type and keeps your picks as chips.
- [Colour picker](https://designme.dev/components/color-picker.md): Pick a colour by eye or by hex, check its contrast, and let the agent fix it or make a scale from it.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then the one-time code from the email, copied or typed in.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.
- [Carousel](https://designme.dev/components/carousel.md): Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.

All components: https://designme.dev/llms.txt
