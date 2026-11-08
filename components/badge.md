# Badge

> Small labels for plans, environments and status, with a dot, an icon or a remove button.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/badge

## Install

```sh
npx designme add badge          # HTML, CSS and JS, with the shared core
npx designme add badge --react  # React 19 component and its CSS
npx designme add badge --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/badge.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/badge.json  # Astro
```

## About

Badge is a small label for a plan, an environment or a status: "Pro", "Production", "Failed". It comes in thirteen tones, neutral, the accent, success, warning and danger, plus eight tag colours, each drawn as text on a tint of its own colour. It has two sizes, an optional dot or icon in front of the label, and an optional remove button after it.

### When to use it

- When a name needs a short qualifier beside it, like a plan next to an organisation or an environment next to a project.
- When a list mixes states that people scan for, like Live, Degraded and Failed runs.
- When labels can be taken off one at a time, like the environments a view is filtered to.
- Not for actions: use a button, or a chip in Multi-select or Filter menu, for something people press. A badge that does something, a removable one or one written as a link or a button, shows a light hover so it reads as one.

### What it does

- `tone` picks the colour. The accent tone is the accent's tint with the accent as text (`--dm-accent-bg` and `--dm-accent-fg`), so it follows an accent you set. Success, warning and danger use the state colours, and blue, violet, green, orange, red, yellow, pink and teal the tag palette, each with its own `-bg` tint.
- Two sizes: `sm` is 20px tall with 11.5px text, `md` 24px with 12.5px; Blueprint's capitals are a touch smaller, 10.5px and 11px. The label stays on one line; inside a `.t` span (the React version always puts it there) a long one shortens with an ellipsis.
- `dot` puts a small dot in the badge's colour before the label, for a status; `icon` puts an icon there instead. In HTML, `live` on the badge (`<span class="bdg live" data-tone="success">`) makes its dot pulse, for something running right now: a soft ring in the badge's colour grows and fades, on a loop.
- A badge you can act on takes a light hover: a removable one, or one written as a `<button>` or a link, gets a little more of its own colour in its tint. A plain label keeps still, so it never looks clickable.
- `onRemove` adds a × button. In the HTML version it first sends a cancelable `badge-remove` event from the badge, then the badge shrinks away and the focus moves on to the next badge's remove button, or to Undo once none is left. On designme.dev, Undo puts the last one back where it was.
- Soft draws the badge as a pill. Blueprint squares it off, sets the label in capitals with a little letter spacing, and edges it with a hairline in its own colour; the accent badge's hairline is the accent's mark, since Blueprint's lime tint is faint on white.

### Accessibility

- Every tone's text measures at least 4.5:1 (WCAG 2) and APCA Lc 60 on the surface and on raised panels, in Soft and Blueprint, light and dark, and on a removable badge's hover tint too. On a hovered or highlighted menu row the label leans 15% toward the text colour, so it keeps Lc 60 on that tint.
- The label is plain text, so it is read as written; Blueprint's capitals are only CSS. The colour is never the only signal, since the label says what the tone means.
- The live pulse only moves transform and opacity, and it stops with reduced motion. The label still says the state, like Running, so the motion is never the only signal.
- The remove button is a real button named "Remove" and the label, like "Remove Staging", with the shared focus ring. On a touch screen it gets a 40px tap area without changing how it looks.
- On designme.dev a polite live region says what happened, "Removed Staging" or "Staging is back".

## Usage in React

```tsx
import { Badge } from '@/components/designme/badge/Badge';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState, type ReactNode } from 'react';
import { Badge, type BadgeTone } from './Badge';
import { useStory } from '../lib/useScript';

const ENVS: { label: string; tone: BadgeTone }[] = [{ label: 'Production', tone: 'warning' }, { label: 'Staging', tone: 'blue' }, { label: 'Preview', tone: 'violet' }];

/* ---------- Badge: every tone, both sizes, a dot or an icon, and removable ones; Staging is taken off, then put back ---------- */
export default function BadgeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  // the removable badges still showing, and the ones taken off, the latest last
  const [shown, setShown] = useState(ENVS.map(e => e.label));
  const [gone, setGone] = useState<string[]>([]);
  const [said, setSaid] = useState('');
  const remove = (label: string) => { setShown(s => s.filter(x => x !== label)); setGone(g => [...g, label]); setSaid(`Removed ${label}`); };
  const undo = () => {
    const last = gone[gone.length - 1]; if (!last) return;
    setGone(g => g.slice(0, -1)); setShown(s => ENVS.map(e => e.label).filter(x => x === last || s.includes(x))); setSaid(`${last} is back`);
  };
  const undoRef = useRef(undo); undoRef.current = undo;
  // the story stops at the visitor's first click or key, so it never removes a badge they meant to keep
  useStory(ref, async ({ wait }) => {
    await wait(2000); remove('Staging');
    await wait(2000); undoRef.current();
  });
  const row = (label: string, children: ReactNode) => <div className="dm-bdx-row"><span className="dm-bdx-l dm-muted">{label}</span><div className="dm-bdx-set">{children}</div></div>;
  return (
    <div ref={ref} data-dm="" className="dm-bdx">
      {row('Tones', <><Badge>Draft</Badge><Badge tone="accent">Beta</Badge><Badge tone="success">Live</Badge><Badge tone="warning">Degraded</Badge><Badge tone="danger">Failed</Badge></>)}
      {row('Colours', <><Badge tone="blue">Search</Badge><Badge tone="violet">Reasoning</Badge><Badge tone="green">Data</Badge><Badge tone="orange">Billing</Badge>
        <Badge tone="red">Urgent</Badge><Badge tone="yellow">Review</Badge><Badge tone="pink">Design</Badge><Badge tone="teal">Ops</Badge></>)}
      {row('Sizes', <><Badge size="sm" tone="accent">Pro</Badge><Badge tone="accent">Pro</Badge></>)}
      {row('Dot or icon', <><Badge tone="success" dot>Running</Badge><Badge dot>Idle</Badge><Badge icon="lock">Private</Badge><Badge tone="accent" icon="spark">Agent</Badge></>)}
      {row('Removable', <>
        {ENVS.filter(e => shown.includes(e.label)).map(e => <Badge key={e.label} tone={e.tone} onRemove={() => remove(e.label)}>{e.label}</Badge>)}
        {gone.length > 0 && <button type="button" className="dm-pill dm-ghost dm-sm dm-bdx-undo" onClick={undo}>Undo</button>}
      </>)}
      <p className="dm-bdx-live" aria-live="polite">{said}</p>
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `children` | `ReactNode` | The label, like "Pro", "Production" or "Failed" |
| `tone` (optional) | `BadgeTone` | Its colour, as text on its own tint. Neutral by default |
| `size` (optional) | `'sm' \| 'md'` | 'sm' is 20px tall, 'md' 24px (the default) |
| `dot` (optional) | `boolean` | A dot in the badge's colour before the label, for a status like Running |
| `icon` (optional) | `IconName \| ReactNode` | An icon before the label: a name from the icon set, or your own element |
| `onRemove` (optional) | `() => void` | Adds a remove button after the label. Take the badge out of your list in it |
| `removeLabel` (optional) | `string` | The remove button's name for screen readers. Defaults to "Remove" and the label, when the label is text |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import Badge from '../components/designme/badge/Badge.astro';
---
<Badge />
<Badge data-style="soft" class="my-class" />
```
It plays its demo; change `badge.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I keep a badge when someone presses its ×?**

In HTML, listen for `badge-remove` and call `preventDefault()`; the badge stays. In React, `onRemove` is yours: take the badge out of your list there, or don't.

**Can I use my own colours?**

Each tone sets two variables on the badge, `--dm-bdg-bg` and `--dm-bdg-fg`. Set them in your own class for a new colour, and check the text against its tint.

**Why is the accent badge a tint and not a solid fill?**

So it reads as a highlight, not a button. A solid accent fill is kept for the primary action.

**Does the Context switcher use it?**

It draws the same small badge, in the same tones, with its own copy of the styles, so each component installs on its own.

## Source

`Badge.tsx`, as `npx designme add badge --react` installs it:

```tsx
'use client';
import { isValidElement, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { Icon, type IconName } from '../lib/icons';
import '../designme.css';
import './badge.css';

/** A badge's colour: neutral grey, the accent's tint, the three states, or one of the eight tag colours */
export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'blue' | 'violet' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface BadgeProps {
  /** The label, like "Pro", "Production" or "Failed" */
  children: ReactNode;
  /** Its colour, as text on its own tint. Neutral by default */
  tone?: BadgeTone;
  /** 'sm' is 20px tall, 'md' 24px (the default) */
  size?: 'sm' | 'md';
  /** A dot in the badge's colour before the label, for a status like Running */
  dot?: boolean;
  /** An icon before the label: a name from the icon set, or your own element */
  icon?: IconName | ReactNode;
  /** Adds a remove button after the label. Take the badge out of your list in it */
  onRemove?: () => void;
  /** The remove button's name for screen readers. Defaults to "Remove" and the label, when the label is text */
  removeLabel?: string;
  className?: string;
}

/** A small label for a plan, an environment or a status, with an optional dot or icon and an optional remove button. */
export function Badge({ children, tone = 'neutral', size = 'md', dot = false, icon, onRemove, removeLabel, className }: BadgeProps) {
  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : '';
  return (
    <span data-dm="" className={cx('dm-bdg', size === 'sm' && 'dm-sm', className)} data-tone={tone === 'neutral' ? undefined : tone}>
      {dot && <span className="dm-bdg-dot" aria-hidden="true" />}
      {typeof icon === 'string' ? <Icon name={icon as IconName} size="xs" /> : isValidElement(icon) ? icon : null}
      <span className="dm-t">{children}</span>
      {onRemove && (
        <button type="button" className="dm-bdg-x" aria-label={removeLabel ?? (text ? `Remove ${text}` : 'Remove')} onClick={onRemove}>
          <Icon name="x" size="xs" />
        </button>
      )}
    </span>
  );
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Progress and meter](https://designme.dev/components/progress.md): An agent run's progress and what it costs, with a credits meter that warns as it fills.
- [Slider](https://designme.dev/components/slider.md): Named stops, a stepped scale and a range, with the agent's recommended value marked on the track.
- [Tooltip](https://designme.dev/components/tooltip.md): Quiet labels on hover, with shortcuts and a richer preview card.
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
