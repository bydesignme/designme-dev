# Design review

> Checks run, a teammate asks for a change, the agent makes it, and you ship.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/design-review

## Install

```sh
npx designme add design-review          # HTML, CSS and JS, with the shared core
npx designme add design-review --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Design review follows something the agent made on its way out. Automated checks run first, then a teammate reviews it, asks for a change and the agent makes it, and once they approve, a split button lets you ship it to everyone, to a share of visitors first, or on a set day.

### When to use it

- When a person has to sign off on the agent's work before it goes live.
- When the review is a conversation: the reviewer asks for a change, the agent answers with what it did.
- When automated checks and a human review both gate a release, and people should see them side by side.
- When shipping has options, like a gradual rollout or a scheduled launch.

### What it does

- `checks` run on the left, each with a `state` (`wait`, `run`, `ok` or `bad`) and a result `note` on the right.
- `messages` hold the review, oldest first. Each has an `author` (an avatar, or the agent's mark with `agent: true`), an optional `verdict` tag with a tone, an icon or a spinner, and the `text` they wrote.
- `phase` moves from `review` to `approved`, `shipping`, then `live` or `scheduled`. The tag in the header follows it, and the Ship button only turns on once it is `approved`.
- The menu beside Ship picks how it goes out. `options` replace the defaults (to everyone, to 10% first, on Monday), and `option` / `defaultOption` / `onOptionChange` keep the pick.
- `onShip` gets the picked option. Once the phase is `live` or `scheduled`, the buttons give way to `doneLabel`.
- At wide sizes the checks and the review sit side by side; in a narrow container they stack.

### Accessibility

- The review column is an `aria-live="polite"` region, so new messages are read out as they arrive.
- Ship and the menu button are real buttons, disabled until the review is approved. The menu button is labelled "How it ships", says whether its menu is open, and Escape closes the menu.
- Each shipping option is a menu item that marks the picked one with `aria-checked`.

## Usage in React

```tsx
import { DesignReview } from '@/components/designme/design-review/DesignReview';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { DesignReview, type ReviewCheck, type ReviewMessage, type ReviewPhase, type ShipOption } from './DesignReview';
import { useScript, useWait } from '../lib/useScript';

/* ---------- Design review: three checks pass, Maya asks for one change, the agent makes it, she approves, you ship ---------- */
const CHECKS: [label: string, result: string][] = [['Visual diff', '2 of 6 screens changed'], ['Library tokens', 'All from the library'], ['Contrast', 'AA on every screen']];
const MAYA = { name: 'Maya Kim', initials: 'MK', color: 'var(--dm-pl)' };
const AGENT = { name: 'Design agent', agent: true };
const DONE: Record<string, string> = { all: 'Live for every visitor', some: 'Live for 10% of visitors. Everyone tomorrow', later: 'Ships on Monday at 09:00' };

export default function DesignReviewDemo() {
  const [checks, setChecks] = useState<ReviewCheck[]>(CHECKS.map(([label]) => ({ label, state: 'wait' })));
  const [messages, setMessages] = useState<ReviewMessage[]>([]);
  const [phase, setPhase] = useState<ReviewPhase>('review');
  const [note, setNote] = useState('Waiting on checks');
  const [done, setDone] = useState('');
  const wait = useWait();

  useScript(async ({ wait }) => {
    await wait(500);
    for (let i = 0; i < CHECKS.length; i++) {
      setChecks(cs => cs.map((c, k) => k === i ? { ...c, state: 'run' } : c));
      await wait(650 + i * 120);
      setChecks(cs => cs.map((c, k) => k === i ? { ...c, state: 'ok', note: CHECKS[i][1] } : c));
    }
    setNote('Waiting on Maya'); await wait(900);
    setMessages([{ author: MAYA, verdict: { label: 'Changes requested', tone: 'warn' }, text: 'Start the plan toggle on yearly. Most people pick it.' }]);
    setNote('The agent is on it'); await wait(1200);
    setMessages(ms => [...ms, { author: AGENT, verdict: { label: 'Updating', busy: true } }]);
    await wait(1300);
    setMessages(ms => [ms[0], { author: AGENT, verdict: { label: 'Updated' }, text: 'The toggle starts on yearly on all 6 screens.' }]);
    await wait(1100);
    setMessages(ms => [...ms, { author: MAYA, verdict: { label: 'Approved', tone: 'ok', icon: 'check' } }]);
    setNote('Approved by Maya'); setPhase('approved');
  });

  const ship = async (o: ShipOption) => {
    setPhase('shipping'); setNote('Publishing 6 screens');
    await wait(1000);
    setDone(DONE[o.key]); setPhase(o.key === 'later' ? 'scheduled' : 'live');
  };

  return (
    <DesignReview title="Pricing page v4" subtitle="6 screens · sent for review by the design agent" checks={checks} messages={messages}
      phase={phase} note={note} waitingLabel="Maya reviews once the checks pass" onShip={ship} doneLabel={done} />
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | What is up for review, like "Pricing page v4" |
| `subtitle` (optional) | `string` | The line under the title |
| `icon` (optional) | `IconName` |  |
| `checks` | `ReviewCheck[]` |  |
| `messages` | `ReviewMessage[]` | The review so far, oldest first |
| `phase` | `ReviewPhase` | Where it is: in review, approved (Ship turns on), shipping, then live or scheduled |
| `note` (optional) | `string` | The line beside the Ship button, like "Waiting on Maya" |
| `waitingLabel` (optional) | `string` | Shown in the review column before anyone has written |
| `options` (optional) | `ShipOption[]` | The ways it can ship, picked from the menu beside the button |
| `option` (optional) | `string` |  |
| `defaultOption` (optional) | `string` |  |
| `onOptionChange` (optional) | `(key: string) => void` |  |
| `onShip` (optional) | `(option: ShipOption) => void` |  |
| `doneLabel` (optional) | `string` | The line that replaces the buttons once it is live or scheduled, like "Live for every visitor" |
| `labels` (optional) | `{ checks?: string; review?: string; inReview?: string; approved?: string; live?: string; scheduled?: string; shipping?: string }` |  |
| `className` (optional) | `string` |  |

## Questions

**Does it run the checks or send the review request?**

No. It shows the `checks`, `messages` and `phase` you pass. Your code or agent runs the checks, collects the review and moves the phase along.

**How is it different from Launch checklist?**

Launch checklist is the agent checking its own work and fixing what fails. Design review adds a person: a teammate reviews, the agent answers, and shipping waits for their approval.

**Can I change the ways it ships?**

Yes. Pass your own `options`, each with a `key`, a `label` for the button and a `detail` for the menu. `onShip` gets the one that was picked.

## Source

`DesignReview.tsx`, as `npx designme add design-review --react` installs it:

```tsx
'use client';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Avatar, enter, Spin, Swap } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './design-review.css';

export type ReviewCheckState = 'wait' | 'run' | 'ok' | 'bad';

export interface ReviewCheck {
  /** What is checked, like "Visual diff" */
  label: string;
  /** wait (not run yet), run (running now), ok or bad */
  state: ReviewCheckState;
  /** The result on the right, like "2 of 6 screens changed" */
  note?: string;
}

export interface ReviewMessage {
  /** Who wrote it. `agent` draws the agent's mark instead of an avatar */
  author: { name: string; initials?: string; color?: string; agent?: boolean };
  /** The tag beside the name, like Changes requested or Approved. `busy` puts a spinner in it */
  verdict?: { label: string; tone?: 'ok' | 'warn' | 'bad' | 'neutral'; icon?: IconName; busy?: boolean };
  /** What they said, under the name */
  text?: string;
}

export interface ShipOption {
  key: string;
  /** The button's label when it is picked, like "Ship to 10% first" */
  label: string;
  /** The quiet line under it in the menu */
  detail?: string;
}

export type ReviewPhase = 'review' | 'approved' | 'shipping' | 'live' | 'scheduled';

export interface DesignReviewProps {
  /** What is up for review, like "Pricing page v4" */
  title: string;
  /** The line under the title */
  subtitle?: string;
  icon?: IconName;
  checks: ReviewCheck[];
  /** The review so far, oldest first */
  messages: ReviewMessage[];
  /** Where it is: in review, approved (Ship turns on), shipping, then live or scheduled */
  phase: ReviewPhase;
  /** The line beside the Ship button, like "Waiting on Maya" */
  note?: string;
  /** Shown in the review column before anyone has written */
  waitingLabel?: string;
  /** The ways it can ship, picked from the menu beside the button */
  options?: ShipOption[];
  option?: string;
  defaultOption?: string;
  onOptionChange?: (key: string) => void;
  onShip?: (option: ShipOption) => void;
  /** The line that replaces the buttons once it is live or scheduled, like "Live for every visitor" */
  doneLabel?: string;
  labels?: { checks?: string; review?: string; inReview?: string; approved?: string; live?: string; scheduled?: string; shipping?: string };
  className?: string;
}

const SHIP: ShipOption[] = [
  { key: 'all', label: 'Ship to everyone', detail: 'Every visitor sees it now' },
  { key: 'some', label: 'Ship to 10% first', detail: 'Everyone else after a day' },
  { key: 'later', label: 'Ship on Monday', detail: 'At 09:00 your time' }
];

function Glyph({ state }: { state: ReviewCheckState }) {
  const g = state === 'run' ? <Spin /> : state === 'ok' ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="ok" size="xs" /></span>
    : state === 'bad' ? <span style={{ color: 'var(--dm-bad)', display: 'grid' }}><Icon name="alert" size="xs" /></span> : <span className="dm-drv-ring" />;
  return <span key={state} className={state === 'wait' ? undefined : 'dm-enter'} style={{ display: 'grid' }}>{g}</span>;
}

/** Something the agent made, on its way out: checks run, a teammate reviews and the agent answers, then you pick how it ships. */
export function DesignReview({
  title, subtitle, icon = 'palette', checks, messages, phase, note, waitingLabel = 'The review starts once the checks pass',
  options = SHIP, option, defaultOption, onOptionChange, onShip, doneLabel, labels = {}, className
}: DesignReviewProps) {
  const [pick, setPick] = useControllable(option, defaultOption ?? options[0].key, onOptionChange);
  const menu = usePopover({ align: 'end' });
  const chosen = options.find(o => o.key === pick) ?? options[0];
  const L = { checks: 'Checks', review: 'Review', inReview: 'In review', approved: 'Approved', live: 'Live', scheduled: 'Scheduled', shipping: 'Shipping', ...labels };
  const done = phase === 'live' || phase === 'scheduled';
  const tag = phase === 'review' ? ['dm-b', L.inReview] : phase === 'live' ? ['dm-ok', L.live] : phase === 'scheduled' ? ['dm-b', L.scheduled] : ['dm-ok', L.approved];
  const locked = phase !== 'approved';

  return (
    <div data-dm="" className={cx('dm-drv-box', className)} style={{ containerType: 'inline-size', width: '100%' }}>
      <div className={cx('dm-drv dm-panel', phase === 'live' && 'dm-live')}>
        <div className="dm-drv-h">
          <span className="dm-drv-ic"><Icon name={icon} /></span>
          <div className="dm-drv-ht"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
          <span className={cx('dm-tag dm-drv-tag', tag[0])}><Swap>{tag[1]}</Swap></span>
        </div>
        <div className="dm-drv-b">
          <div className="dm-drv-col">
            <span className="dm-drv-lb">{L.checks}</span>
            <div className="dm-drv-checks">
              {checks.map((c, i) => (
                <div key={i} className="dm-drv-c">
                  <span className="dm-g"><Glyph state={c.state} /></span>
                  <span className="dm-t">{c.label}</span>
                  <Swap className="dm-d">{c.note ?? (c.state === 'run' ? 'Running' : '')}</Swap>
                </div>
              ))}
            </div>
          </div>
          <div className="dm-drv-col">
            <span className="dm-drv-lb">{L.review}</span>
            <div className="dm-drv-rv" aria-live="polite">
              {messages.length ? messages.map((m, i) => (
                <div key={i} className="dm-drv-m dm-enter">
                  {m.author.agent
                    ? <span className="dm-drv-ag"><Icon name="spark" size="xs" /></span>
                    : <Avatar initials={m.author.initials ?? m.author.name.split(' ').map(w => w[0]).join('').slice(0, 2)} color={m.author.color ?? 'var(--dm-pl)'} />}
                  <div className="dm-drv-mb">
                    <span className="dm-drv-mn">
                      <b>{m.author.name}</b>
                      {m.verdict && (
                        <span className={cx('dm-tag', m.verdict.busy && 'dm-drv-wk', m.verdict.tone && m.verdict.tone !== 'neutral' && 'dm-' + m.verdict.tone)}>
                          {m.verdict.busy ? <Spin /> : m.verdict.icon && <Icon name={m.verdict.icon} size="xs" />}{m.verdict.label}
                        </span>
                      )}
                    </span>
                    {m.text && <p key={m.text} {...enter()}>{m.text}</p>}
                  </div>
                </div>
              )) : <span className="dm-muted dm-drv-wt">{waitingLabel}</span>}
            </div>
          </div>
        </div>
        <div className="dm-drv-f">
          {done ? (
            <span className="dm-drv-done dm-enter"><Icon name={phase === 'scheduled' ? 'clock' : 'ok'} /><span>{doneLabel ?? chosen.label}</span></span>
          ) : <>
            <Swap className="dm-muted dm-drv-st">{note ?? ''}</Swap>
            <div className={cx('dm-drv-mg', !locked && 'dm-enter')}>
              <button type="button" className="dm-pill dm-accent dm-sm dm-drv-go" disabled={locked} onClick={() => onShip?.(chosen)}>
                <Swap>{phase === 'shipping' ? L.shipping : chosen.label}</Swap>
              </button>
              <button type="button" className="dm-pill dm-accent dm-sm dm-drv-dd" aria-label="How it ships" disabled={locked} {...menu.trigger}><Icon name="chev-d" size="xs" /></button>
            </div>
            <div {...menu.pop} className={cx(menu.pop.className, 'dm-drv-pop')} role="menu">
              {options.map(o => (
                <button type="button" key={o.key} className="dm-mi" role="menuitemradio" aria-checked={o.key === chosen.key} onClick={() => { setPick(o.key); menu.closeSoon(); }}>
                  <span>{o.label}{o.detail && <span className="dm-d">{o.detail}</span>}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
                </button>
              ))}
            </div>
          </>}
        </div>
      </div>
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
- [Steering](https://designme.dev/components/steering.md): Change the agent's course while it works, without starting over.
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.

All components: https://designme.dev/llms.txt
