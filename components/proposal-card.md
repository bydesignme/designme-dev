# Proposal card

> A suggested change with confidence, alternatives and undo.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/proposal-card

## Install

```sh
npx designme add proposal-card          # HTML, CSS and JS, with the shared core
npx designme add proposal-card --react  # React 19 component and its CSS
npx designme add proposal-card --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/proposal-card.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/proposal-card.json  # Astro
```

## About

Proposal card shows a single change the agent wants to make, like a new colour for a low-contrast button, as a before and after with the agent's confidence. The person can accept the suggestion, pick one of the other options instead, or say not now, and either choice can be undone.

### When to use it

- When the agent spots a fix during a review and should ask before applying it.
- When there is more than one reasonable fix and the agent should rank them.
- When people need to see how sure the agent is before they accept.
- When an accepted or dismissed suggestion should be easy to take back.

### What it does

- The current value (`from`) and the chosen option sit side by side as swatches with a label and an optional badge, such as a contrast ratio.
- A five-segment meter and a percentage show the chosen option's `confidence`. It fills in shortly after the card appears and follows each new pick.
- The first entry in `options` is the agent's pick. The others sit behind an "N other options" toggle, and clicking one makes it the change.
- Accept calls `onAccept` with the chosen option and its index, closes the options list and shows `acceptedLabel`.
- Not now shows `dismissedLabel`. Both end states offer Undo, which reopens the card and calls `onUndo`.
- Badge tones default to bad for the current value and ok for the options, and can be set per value with `tone`.

### Accessibility

- The confidence bar has `role="meter"` with `aria-valuemin`, `aria-valuemax`, `aria-valuenow` and an `aria-label`.
- The other-options toggle is a button with `aria-expanded`.
- When the options list is closed it is `inert` and `aria-hidden`.
- With reduced motion turned on, the confidence count jumps straight to its value.

## Usage in React

```tsx
import { ProposalCard } from '@/components/designme/proposal-card/ProposalCard';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { ProposalCard, type ProposalOption } from './ProposalCard';

/* ---------- Proposal card: the agent's fix, its confidence, two other options, Accept or Not now ---------- */
const OPTIONS: ProposalOption[] = [
  { color: '#5b6472', label: '#5B6472', badge: '5.9 : 1', confidence: 84, name: 'Suggested', description: 'Balanced with the primary' },
  { color: '#475161', label: '#475161', badge: '7.4 : 1', confidence: 62, name: 'Darker', description: 'Stronger than the primary' },
  { color: '#116ff8', label: '#116FF8', badge: '4.6 : 1', confidence: 41, name: 'Accent outline', description: 'Competes with the CTA' }
];
export default function ProposalCardDemo() {
  return (
    <div style={{ width: '100%' }}>
      <ProposalCard title="Raise contrast on the secondary button" subtitle="Pricing, frame 2 of 3"
        from={{ color: '#c9cfd8', label: '#C9CFD8', badge: '2.1 : 1' }} options={OPTIONS} acceptedLabel="Applied to 3 buttons" />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `ReactNode` | What the agent wants to change |
| `subtitle` (optional) | `ReactNode` | Where, like "Pricing, frame 2 of 3" |
| `icon` (optional) | `IconName` | The icon in the orange tile. Defaults to a wand |
| `from` | `ProposalValue` | How it is now |
| `options` | `ProposalOption[]` | The changes on offer, the agent's pick first |
| `value` (optional) | `number` | Index of the option shown as the change. Leave it out to let the list pick it |
| `defaultValue` (optional) | `number` | Defaults to 0, the agent's pick |
| `onValueChange` (optional) | `(index: number) => void` |  |
| `open` (optional) | `boolean` | Whether the other options are listed. Leave it out to let their toggle open them |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `status` (optional) | `ProposalStatus` | open, accepted or dismissed. Leave it out to let Accept, Not now and Undo move it |
| `defaultStatus` (optional) | `ProposalStatus` |  |
| `onStatusChange` (optional) | `(status: ProposalStatus) => void` |  |
| `onAccept` (optional) | `(option: ProposalOption, index: number) => void` | Called with the chosen option when Accept is pressed |
| `onDismiss` (optional) | `() => void` |  |
| `onUndo` (optional) | `() => void` |  |
| `acceptedLabel` (optional) | `string` | Shown once accepted, like "Applied to 3 buttons" |
| `dismissedLabel` (optional) | `string` | Shown once dismissed |
| `confidenceLabel` (optional) | `string` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ProposalCard from '../components/designme/proposal-card/ProposalCard.astro';
---
<ProposalCard />
<ProposalCard data-style="soft" class="my-class" />
```
It plays its demo; change `proposal-card.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Which option is the agent's suggestion?**

The first one in `options`. `defaultValue` is 0, so it shows as the change until the person picks another.

**How do I apply the change when someone accepts it?**

Handle `onAccept(option, index)`. The card only records the decision, so applying and reverting the change happens in your code, with `onUndo` for the revert.

**Can I use it for something other than colours?**

Each value has a `color` for its swatch and a free-text `label` and `badge`, so it fits any change that can be shown as a swatch and a short value.

## Source

`ProposalCard.tsx`, as `npx designme add proposal-card --react` installs it:

```tsx
'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Fold, Swap } from '../lib/motion';
import '../designme.css';
import './proposal-card.css';

export type ProposalTone = 'ok' | 'warn' | 'bad';

/** One side of the change: a swatch, its value and a tag, like #C9CFD8 with "2.1 : 1" */
export interface ProposalValue {
  /** Any CSS colour, shown in the swatch */
  color: string;
  /** Like "#C9CFD8" */
  label: string;
  /** A short tag after the value, like a contrast ratio */
  badge?: string;
  /** Colours the tag. The current value defaults to bad, the options to ok */
  tone?: ProposalTone;
}

/** A change the agent can make. The first one is its suggestion, the others show under "other options" */
export interface ProposalOption extends ProposalValue {
  /** Like "Suggested" or "Darker" */
  name: string;
  /** The quiet line beside it in the list, like "Balanced with the primary" */
  description?: string;
  /** How sure the agent is, 0 to 100 */
  confidence: number;
}

export type ProposalStatus = 'open' | 'accepted' | 'dismissed';

export interface ProposalCardProps {
  /** What the agent wants to change */
  title: ReactNode;
  /** Where, like "Pricing, frame 2 of 3" */
  subtitle?: ReactNode;
  /** The icon in the orange tile. Defaults to a wand */
  icon?: IconName;
  /** How it is now */
  from: ProposalValue;
  /** The changes on offer, the agent's pick first */
  options: ProposalOption[];
  /** Index of the option shown as the change. Leave it out to let the list pick it */
  value?: number;
  /** Defaults to 0, the agent's pick */
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  /** Whether the other options are listed. Leave it out to let their toggle open them */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** open, accepted or dismissed. Leave it out to let Accept, Not now and Undo move it */
  status?: ProposalStatus;
  defaultStatus?: ProposalStatus;
  onStatusChange?: (status: ProposalStatus) => void;
  /** Called with the chosen option when Accept is pressed */
  onAccept?: (option: ProposalOption, index: number) => void;
  onDismiss?: () => void;
  onUndo?: () => void;
  /** Shown once accepted, like "Applied to 3 buttons" */
  acceptedLabel?: string;
  /** Shown once dismissed */
  dismissedLabel?: string;
  confidenceLabel?: string;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const STEPS = 5;

/** A change the agent proposes, with its confidence, other options, and Accept or Not now. */
export function ProposalCard({
  title, subtitle, icon = 'wand', from, options, value, defaultValue = 0, onValueChange, open, defaultOpen = false, onOpenChange,
  status, defaultStatus = 'open', onStatusChange, onAccept, onDismiss, onUndo, acceptedLabel = 'Applied', dismissedLabel = 'Dismissed. The agent will not suggest this again.',
  confidenceLabel = 'Confidence', bare = true, className
}: ProposalCardProps) {
  const [sel, setSel] = useControllable(value, defaultValue, onValueChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [state, setState] = useControllable(status, defaultStatus, onStatusChange);
  // the confidence fills in a moment after the card appears, then follows the chosen option
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 400); return () => clearTimeout(t); }, []);
  // the list only plays its entrance once someone has picked another option
  const [picked, setPicked] = useState(false);
  const opt = options[Math.max(0, Math.min(options.length - 1, sel))];
  const conf = useTween(ready && opt ? opt.confidence : 0, 700, 0);
  const others = options.map((o, i) => ({ o, i })).filter(x => x.i !== sel);

  const choose = (i: number) => { setPicked(true); setSel(i); };
  const accept = () => { setOpen(false); setState('accepted'); onAccept?.(opt, sel); };
  const dismiss = () => { setState('dismissed'); onDismiss?.(); };
  const undo = () => { setState('open'); onUndo?.(); };

  return (
    <div data-dm="" className={cx('dm-prx', !bare && 'dm-panel', className)}>
      <div className="dm-prx-h">
        <span className="dm-prx-ic"><Icon name={icon} /></span>
        <div className="dm-prx-ht"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
      </div>
      <div className="dm-prx-diff">
        <div className="dm-prx-sw">
          <span className="dm-prx-c" style={{ background: from.color }} />
          <span className="dm-num">{from.label}</span>
          {from.badge && <span className={cx('dm-tag', 'dm-' + (from.tone ?? 'bad'))}>{from.badge}</span>}
        </div>
        <span className="dm-prx-ar"><Icon name="right" size="xs" /></span>
        {opt && (
          <div className="dm-prx-sw dm-prx-new">
            <span className="dm-prx-c" style={{ background: opt.color }} />
            <Swap className="dm-num">{opt.label}</Swap>
            {opt.badge && <span className={cx('dm-tag', 'dm-' + (opt.tone ?? 'ok'))}><Swap>{opt.badge}</Swap></span>}
          </div>
        )}
      </div>
      <div className="dm-prx-cf">
        <span className="dm-muted">{confidenceLabel}</span>
        <div className="dm-prx-seg" role="meter" aria-label={confidenceLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={opt?.confidence ?? 0}>
          {Array.from({ length: STEPS }, (_, i) => <i key={i} className={cx(conf >= (i + 1) * 20 - 10 && 'dm-on')} />)}
        </div>
        <span className="dm-num dm-prx-pc">{Math.round(conf)}%</span>
      </div>
      {others.length > 0 && (
        <>
          <button type="button" className={cx('dm-prx-alt-t', isOpen && 'dm-open')} aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
            <Icon name="chev-r" size="xs" /><span>{others.length} other {others.length > 1 ? 'options' : 'option'}</span>
          </button>
          <Fold open={isOpen} className="dm-prx-alt">
            <div className="dm-prx-alts" key={sel}>
              {others.map(({ o, i }, k) => (
                <button type="button" key={i} className={cx('dm-prx-a', picked && 'dm-enter')} style={picked ? enter(k * 50).style : undefined} onClick={() => choose(i)}>
                  <span className="dm-prx-c" style={{ background: o.color }} />
                  <span>{o.name}{o.badge && `, ${o.badge}`}</span>
                  {o.description && <span className="dm-d">{o.description}</span>}
                </button>
              ))}
            </div>
          </Fold>
        </>
      )}
      <div className="dm-prx-f">
        {state === 'open' ? (
          <>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-prx-no" onClick={dismiss}>Not now</button>
            <button type="button" className="dm-pill dm-primary dm-sm dm-prx-ok" onClick={accept}>Accept</button>
          </>
        ) : state === 'accepted' ? (
          <>
            <span className="dm-prx-done dm-enter"><Icon name="ok" /><span>{acceptedLabel}</span></span>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-prx-un dm-enter" style={enter(60).style} onClick={undo}><Icon name="undo" size="xs" />Undo</button>
          </>
        ) : (
          <>
            <span className="dm-prx-done dm-muted dm-enter" style={{ color: 'var(--dm-muted)' }}>{dismissedLabel}</span>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-prx-un dm-enter" style={enter(60).style} onClick={undo}>Undo</button>
          </>
        )}
      </div>
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
- [Design tuner](https://designme.dev/components/design-tuner.md): Tweak a component by hand or let the agent tune it.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Launch checklist](https://designme.dev/components/launch-checklist.md): The agent checks a design before it ships, and fixes what fails.
- [Inline text diff](https://designme.dev/components/inline-text-diff.md): The agent's edits to a piece of copy, accepted or rejected one by one.
- [Draft review](https://designme.dev/components/draft-review.md): An email the agent drafted, to check and edit before it sends.
- [Steering](https://designme.dev/components/steering.md): Change the agent's course while it works, without starting over.
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.
- [Design review](https://designme.dev/components/design-review.md): Checks run, a teammate asks for a change, the agent makes it, and you ship.

All components: https://designme.dev/llms.txt
