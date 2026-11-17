# Meeting card

> The next meeting with a countdown, a now line on its time track and a one-click join.

App basics / Dates. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/meeting-card

## Install

```sh
npx designme add meeting-card          # HTML, CSS and JS, with the shared core
npx designme add meeting-card --react  # React 19 component and its CSS
npx designme add meeting-card --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/meeting-card.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/meeting-card.json  # Astro
```

## About

Meeting card shows the next meeting at a glance: a countdown, the meeting on a short time track with a now line creeping toward it, and the call's join link with a copy button. When the start time arrives the countdown says so and the meeting turns live. It suits an assistant that keeps people on time for their calls.

### When to use it

- When a home screen or sidebar should show the next call and how long until it starts
- When an assistant reminds a person about a meeting and offers the link in one place
- When people often need to copy a call link to share it in chat
- When a calendar view is too much and one upcoming meeting is all that matters

### What it does

- The countdown follows `now`: "In 30 minutes", "In 1 minute", then "Starting now" at the `start` time and "Ended" after `end`. Pass `status` to write your own line.
- The time track runs from half an hour before `start` to half an hour after `end` unless you set `from` and `to`, with ticks every 15 minutes and taller ones on the hour.
- The meeting sits on the track in the accent tint with its length inside, and the now line moves to `now` with a short glide each time it changes.
- From `start` until `end` the meeting is live: a ring in the accent goes round it, and the dot beside the countdown pulses.
- The join line shows the service's mark, "Join on Google Meet" and the link. `provider` and `mark` change the service, and `onJoin` replaces opening the link in a new tab.
- The copy button puts the full link on the clipboard, turns into a check and says "Copied" for a moment, and calls `onCopy`.

### Accessibility

- Join and copy are native buttons, reachable with Tab and pressed with Enter or Space; the copy button is named by `copyLabel`.
- The time track is one image to screen readers, labelled with the time now and when the meeting runs, so the ticks and axis are not read one by one.
- With reduced motion the dot stops pulsing and the now line jumps to its place instead of gliding.

## Usage in React

```tsx
import { MeetingCard } from '@/components/designme/meeting-card/MeetingCard';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { MeetingCard } from './MeetingCard';
import { useStory } from '../lib/useScript';

const clock = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

export default function MeetingCardDemo() {
  const [now, setNow] = useState(600);
  // the minutes tick by until the meeting starts, then the person in the preview copies the link, and it plays again
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, press }) => {
    for (;;) {
      setNow(600); await wait(1000);
      for (let m = 601; m <= 630; m++) { await wait(630 - m < 4 ? 450 : 150); setNow(m); }
      await wait(2500); press('.dm-mtx-cp'); await wait(4000);
    }
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <MeetingCard title="Meeting with Product team" start="10:30" end="12:00" now={clock(now)} link="meet.google.com/nax-wqkf-stu" onJoin={() => {}} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | Like "Meeting with Product team" |
| `start` | `string` | When it starts, 24-hour "HH:MM", like "10:30" |
| `end` | `string` | When it ends, like "12:00" |
| `now` | `string` | The time now, like "10:00". The now line sits there, and the countdown and the live state follow it |
| `from` (optional) | `string` | Where the track starts. Defaults to half an hour before `start` |
| `to` (optional) | `string` | Where the track ends. Defaults to half an hour after `end` |
| `length` (optional) | `string` | The label inside the meeting's block. Defaults to its length, like "90 min" |
| `status` (optional) | `string` | The line over the title. Defaults to the countdown: "In 30 minutes", "Starting now", "Ended" |
| `provider` (optional) | `string` | The call's service, for the join line. Defaults to "Google Meet" |
| `mark` (optional) | `ReactNode` | The service's mark. Defaults to the Google Meet mark |
| `link` | `string` | The link shown and copied, like "meet.google.com/nax-wqkf-stu" |
| `href` (optional) | `string` | Where joining goes. Defaults to the link over https |
| `onJoin` (optional) | `() => void` | Called on join. Left out, the link opens in a new tab |
| `onCopy` (optional) | `(url: string) => void` |  |
| `copyLabel` (optional) | `string` | The copy button's tooltip and name. Defaults to "Copy link" |
| `copiedLabel` (optional) | `string` | The tooltip after copying. Defaults to "Copied" |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import MeetingCard from '../components/designme/meeting-card/MeetingCard.astro';
---
<MeetingCard />
<MeetingCard data-style="soft" class="my-class" />
```
It plays its demo; change `meeting-card.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I keep the countdown live?**

Pass the current time as `now` and update it once a minute from your own clock, for example with a `setInterval`. The countdown, the now line and the live state all follow it.

**Can I use it for Zoom or Teams?**

Yes. Set `provider` to the service's name and pass its logo as `mark`. The join line then reads "Join on" and that name, and the link and copy button work the same.

**What time format does it expect?**

24-hour "HH:MM" strings for `start`, `end`, `now`, `from` and `to`, like "10:30". The axis shows them as you pass them.

## Source

`MeetingCard.tsx`, as `npx designme add meeting-card --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Brand } from '../lib/brands';
import { cx } from '../lib/cx';
import { useCopied } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
import './meeting-card.css';

export interface MeetingCardProps {
  /** Like "Meeting with Product team" */
  title: string;
  /** When it starts, 24-hour "HH:MM", like "10:30" */
  start: string;
  /** When it ends, like "12:00" */
  end: string;
  /** The time now, like "10:00". The now line sits there, and the countdown and the live state follow it */
  now: string;
  /** Where the track starts. Defaults to half an hour before `start` */
  from?: string;
  /** Where the track ends. Defaults to half an hour after `end` */
  to?: string;
  /** The label inside the meeting's block. Defaults to its length, like "90 min" */
  length?: string;
  /** The line over the title. Defaults to the countdown: "In 30 minutes", "Starting now", "Ended" */
  status?: string;
  /** The call's service, for the join line. Defaults to "Google Meet" */
  provider?: string;
  /** The service's mark. Defaults to the Google Meet mark */
  mark?: ReactNode;
  /** The link shown and copied, like "meet.google.com/nax-wqkf-stu" */
  link: string;
  /** Where joining goes. Defaults to the link over https */
  href?: string;
  /** Called on join. Left out, the link opens in a new tab */
  onJoin?: () => void;
  onCopy?: (url: string) => void;
  /** The copy button's tooltip and name. Defaults to "Copy link" */
  copyLabel?: string;
  /** The tooltip after copying. Defaults to "Copied" */
  copiedLabel?: string;
  className?: string;
}

const mins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
const clock = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

/** The next meeting: a countdown, a time track with the meeting on it and a now line creeping toward it, and the call's
    join link with a copy button. At the start time the meeting turns live. */
export function MeetingCard({ title, start, end, now, from, to, length, status, provider = 'Google Meet', mark, link, href, onJoin, onCopy,
  copyLabel = 'Copy link', copiedLabel = 'Copied', className }: MeetingCardProps) {
  const a = mins(start), b = mins(end), t = mins(now);
  const lo = from ? mins(from) : a - 30, hi = to ? mins(to) : b + 30, span = Math.max(1, hi - lo);
  const pc = (m: number) => Math.min(100, Math.max(0, (m - lo) / span * 100));
  const left = a - t, live = t >= a && t < b;
  const text = status ?? (left > 0 ? `In ${left} minute${left === 1 ? '' : 's'}` : t < b ? 'Starting now' : 'Ended');
  // ticks every 15 minutes, the hours a step taller
  const ticks: number[] = [];
  for (let m = Math.ceil(lo / 15) * 15; m <= hi; m += 15) ticks.push(m);
  const url = href ?? 'https://' + link.replace(/^https?:\/\//, '');
  const [copied, copy] = useCopied();
  // joining says so for a moment, the way the site's demo does
  const join = `Join on ${provider}`;
  const [label, setLabel] = useState(join);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => setLabel(join), [join]);
  const go = () => {
    setLabel(`Opening ${provider}`); clearTimeout(timer.current); timer.current = setTimeout(() => setLabel(join), 1600);
    if (onJoin) onJoin(); else window.open(url, '_blank', 'noopener');
  };

  return (
    <div data-dm="" className={cx('dm-mtx dm-panel', live && 'dm-live', className)}>
      <div className="dm-mtx-top">
        <div className="dm-mtx-when"><span className="dm-mtx-dot" /><span className="dm-mtx-in dm-num">{text}</span></div>
        <b className="dm-mtx-t">{title}</b>
        <div className="dm-mtx-track" role="img" aria-label={`Now ${clock(t)}. The meeting runs ${start} to ${end}`}>
          <span className="dm-mtx-ticks">{ticks.map(m => <i key={m} className={m % 60 ? undefined : 'dm-h'} style={{ left: pc(m) + '%' }} />)}</span>
          <span className="dm-mtx-blk" style={{ left: pc(a) + '%', width: pc(b) - pc(a) + '%' }}><span className="dm-num">{length ?? `${b - a} min`}</span></span>
          <span className="dm-mtx-now" style={{ ['--dm-p' as string]: pc(t) + '%' }}><i /></span>
        </div>
        <div className="dm-mtx-axis dm-num" aria-hidden="true">
          <span className="dm-a">{from ?? clock(lo)}</span>
          <span style={{ left: pc(a) + '%' }}>{start}</span>
          <span style={{ left: pc(b) + '%' }}>{end}</span>
          <span className="dm-z">{to ?? clock(hi)}</span>
        </div>
      </div>
      <div className="dm-mtx-join">
        <button type="button" className="dm-mtx-go" onClick={go}>
          <span className="dm-mtx-mk">{mark ?? <Brand name="meet" />}</span>
          <span className="dm-mtx-gt"><b><Swap>{label}</Swap></b><span className="dm-mtx-url">{link}</span></span>
          <span className="dm-mtx-ar"><Icon name="right" /></span>
        </button>
        <Tip label={copied ? copiedLabel : copyLabel} open={copied || undefined}>
          <button type="button" className={cx('dm-ib dm-mtx-cp', copied && 'dm-copied')} aria-label={copyLabel} onClick={() => { copy(url); onCopy?.(url); }}>
            <Icon name={copied ? 'check' : 'copy'} />
          </button>
        </Tip>
      </div>
    </div>
  );
}
```

## More in Dates

- [Date picker](https://designme.dev/components/date-picker.md): A field that opens a calendar, with quick picks and natural language.
- [Segmented control](https://designme.dev/components/segmented-control.md): Switch between views of the same thing, with a sliding indicator.
- [Date range picker](https://designme.dev/components/date-range-picker.md): Pick a start and end across two months, or use a preset.
- [Event calendar](https://designme.dev/components/event-calendar.md): A week view where the agent finds a free slot for you.
- [Agenda](https://designme.dev/components/agenda.md): Today's schedule with a live now line and agent prep notes.

All components: https://designme.dev/llms.txt
