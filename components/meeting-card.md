# Meeting card

> The next meeting from countdown to wrap-up, with the time already gone hatched out and a join that stays open.

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

Meeting card follows one meeting from countdown to wrap-up. A status chip counts down the minutes, says when it is starting, then how many minutes are left, and finally that it has ended. A track shows the meeting on the morning, with the time already gone hatched out, and Join stays open while the meeting runs so people can still join late. It suits an assistant that keeps people on time for their calls.

### When to use it

- When a home screen or sidebar should show the next call and how long until it starts
- When people need to see at a glance how far a meeting has got, so they know whether joining late is worth it
- When an assistant reminds a person about a meeting and offers the link in one place
- When one upcoming meeting is all that matters and a calendar view is too much

### What it does

- The status chip follows `now`: "In 10 min" with a clock, "Starting now" at `start`, "Live, 54 min left" while it runs and "Ended" after `end`. The minutes roll as they change, and a new state fades in. Pass `status` to write your own text.
- The track runs from half an hour before `start` to half an hour after `end` unless you set `from` and `to`. The meeting sits on it in the accent tint, with its start and end times on the block itself.
- Everything before `now` is hatched with fine 45° lines in neutral grey, including the part of the meeting that has run, and the now line moves through the block. Once the meeting is over the whole block is hatched and the now line fades.
- `people` shows as an avatar stack, up to `max` and then "+N". Each avatar names its person in a tooltip, and the stack spreads a little on hover.
- Join carries the Google Meet mark and stays available while the meeting runs, breathing a shade darker and back while it is live. It presses with a small settle, says it is opening for a moment, and is disabled once the meeting has ended. `onJoin` replaces opening the link in a new tab, and `provider` and `mark` change the service.
- The copy button puts the link on the clipboard, turns into a check and says "Copied", and calls `onCopy`.

### Accessibility

- Join and copy are native buttons, reachable with Tab and pressed with Enter or Space. The copy button is named after the service, and Join is disabled, not hidden, once the meeting has ended.
- The track is one image to screen readers, labelled with the time now and when the meeting runs, or that it has ended.
- Each avatar is labelled with its person's name, and "+N" with the names it stands for.
- Every label on the track keeps 4.5:1 over the tint and over the hatch, because it sits on a small surface chip.
- With reduced motion the minutes and states change without rolling or fading, the hatch and the now line jump to their place, and Join does not breathe.

## Usage in React

```tsx
import { MeetingCard } from '@/components/designme/meeting-card/MeetingCard';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { MeetingCard, type MeetingCardPerson } from './MeetingCard';
import { useStory } from '../lib/useScript';

const PEOPLE: MeetingCardPerson[] = [
  { initials: 'MK', color: 'var(--dm-av-l)', name: 'Maya Kim' }, { initials: 'JO', color: 'var(--dm-av-m)', name: 'Jo Ortiz' },
  { initials: 'AR', color: 'var(--dm-av-p)', name: 'Ana Ruiz' }, { initials: 'SL', color: 'var(--dm-av-t)', name: 'Sam Lee' },
  { initials: 'DK', color: 'var(--dm-av-b)', name: 'Dev Kapoor' }, { initials: 'LN', color: 'var(--dm-av-y)', name: 'Lena Novak' }
];
const clock = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

export default function MeetingCardDemo() {
  const [now, setNow] = useState(620);
  // the countdown, "Starting now", the meeting going by with the gone part hatched, then over; the person in the preview
  // copies the link halfway through, and it plays again
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, press }) => {
    for (;;) {
      setNow(620); await wait(1000);
      for (let m = 621; m <= 630; m++) { await wait(500); setNow(m); }
      await wait(2000);
      for (let m = 636; m <= 666; m += 6) { await wait(600); setNow(m); }
      await wait(1500); press('.dm-mtx-cp'); await wait(1500);
      for (let m = 672; m <= 720; m += 6) { await wait(600); setNow(m); }
      await wait(4500);
    }
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <MeetingCard title="Pricing review" start="10:30" end="12:00" from="10:00" to="12:30" now={clock(now)} people={PEOPLE}
        link="meet.google.com/nax-wqkf-stu" onJoin={() => {}} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | Like "Pricing review" |
| `subtitle` (optional) | `string` | The line under the title. Defaults to "Today, 10:30 to 12:00" from `start` and `end` |
| `start` | `string` | When it starts, 24-hour "HH:MM", like "10:30" |
| `end` | `string` | When it ends, like "12:00" |
| `now` | `string` | The time now, like "10:20". The status chip, the now line and the hatched past all follow it |
| `from` (optional) | `string` | Where the track starts. Defaults to half an hour before `start` |
| `to` (optional) | `string` | Where the track ends. Defaults to half an hour after `end` |
| `people` (optional) | `MeetingCardPerson[]` | Who is invited, as an avatar stack with each name in a tooltip |
| `max` (optional) | `number` | How many avatars show before a "+N". Defaults to 4 |
| `status` (optional) | `string` | The status chip's text, in place of the countdown: "In 10 min", "Starting now", "Live, 54 min left", "Ended" |
| `provider` (optional) | `string` | The call's service, for names and labels. Defaults to "Google Meet" |
| `mark` (optional) | `ReactNode` | The service's mark on the Join button. Defaults to the Google Meet mark |
| `link` | `string` | The call's link, like "meet.google.com/nax-wqkf-stu" |
| `href` (optional) | `string` | Where joining goes and what is copied. Defaults to the link over https |
| `onJoin` (optional) | `() => void` | Called on Join. Left out, the link opens in a new tab |
| `onCopy` (optional) | `(url: string) => void` |  |
| `joinLabel` (optional) | `string` | Defaults to "Join" |
| `copyLabel` (optional) | `string` | The copy button's tooltip. Defaults to "Copy" and the link |
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

**How do I keep it live?**

Pass the current time as `now` and update it once a minute from your own clock, for example with a `setInterval`. The chip, the now line and the hatch all follow it.

**Why does Join stay open after the meeting starts?**

People join late, so Join is available from the countdown until `end`. Only when the meeting is over does it turn disabled.

**Can I use it for Zoom or Teams?**

Yes. Set `provider` to the service's name and pass its logo as `mark`. Join and the copy button work the same.

**What time format does it expect?**

24-hour "HH:MM" strings for `start`, `end`, `now`, `from` and `to`, like "10:30".

## Source

`MeetingCard.tsx`, as `npx designme add meeting-card --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Brand } from '../lib/brands';
import { cx } from '../lib/cx';
import { useCopied } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { avatarInk, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './meeting-card.css';

export interface MeetingCardPerson {
  /** Like "MK" */
  initials: string;
  /** The avatar's colour, like 'var(--dm-av-l)' */
  color: string;
  /** Shown in the avatar's tooltip and read by screen readers, like "Maya Kim" */
  name: string;
}

export interface MeetingCardProps {
  /** Like "Pricing review" */
  title: string;
  /** The line under the title. Defaults to "Today, 10:30 to 12:00" from `start` and `end` */
  subtitle?: string;
  /** When it starts, 24-hour "HH:MM", like "10:30" */
  start: string;
  /** When it ends, like "12:00" */
  end: string;
  /** The time now, like "10:20". The status chip, the now line and the hatched past all follow it */
  now: string;
  /** Where the track starts. Defaults to half an hour before `start` */
  from?: string;
  /** Where the track ends. Defaults to half an hour after `end` */
  to?: string;
  /** Who is invited, as an avatar stack with each name in a tooltip */
  people?: MeetingCardPerson[];
  /** How many avatars show before a "+N". Defaults to 4 */
  max?: number;
  /** The status chip's text, in place of the countdown: "In 10 min", "Starting now", "Live, 54 min left", "Ended" */
  status?: string;
  /** The call's service, for names and labels. Defaults to "Google Meet" */
  provider?: string;
  /** The service's mark on the Join button. Defaults to the Google Meet mark */
  mark?: ReactNode;
  /** The call's link, like "meet.google.com/nax-wqkf-stu" */
  link: string;
  /** Where joining goes and what is copied. Defaults to the link over https */
  href?: string;
  /** Called on Join. Left out, the link opens in a new tab */
  onJoin?: () => void;
  onCopy?: (url: string) => void;
  /** Defaults to "Join" */
  joinLabel?: string;
  /** The copy button's tooltip. Defaults to "Copy" and the link */
  copyLabel?: string;
  /** The tooltip after copying. Defaults to "Copied" */
  copiedLabel?: string;
  className?: string;
}

const mins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
const clock = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

/** The next meeting, from countdown to wrap-up: a status chip that counts down, says "Starting now", then the minutes left,
    and "Ended"; a track with the meeting on it, the time already gone hatched out; the people invited; and Join, which
    stays open while the meeting runs. */
export function MeetingCard({ title, subtitle, start, end, now, from, to, people = [], max = 4, status, provider = 'Google Meet', mark,
  link, href, onJoin, onCopy, joinLabel = 'Join', copyLabel, copiedLabel = 'Copied', className }: MeetingCardProps) {
  const a = mins(start), b = mins(end), t = mins(now);
  const lo = from ? mins(from) : a - 30, hi = to ? mins(to) : b + 30, span = Math.max(1, hi - lo);
  const pc = (m: number) => Math.min(100, Math.max(0, (m - lo) / span * 100));
  const phase = t < a ? 'soon' : t === a ? 'start' : t < b ? 'live' : 'done';
  const n = phase === 'soon' ? a - t : b - t;
  const url = href ?? 'https://' + link.replace(/^https?:\/\//, '');
  const [copied, copy] = useCopied();
  // a new state fades in, and within a state only the minutes roll; nothing moves on the first render
  const ready = useRef(false);
  useEffect(() => { ready.current = true; }, []);
  const roll = <span className="dm-mtx-roll dm-num"><i key={n} className={ready.current ? 'dm-in' : undefined}>{n}</i></span>;
  const chip = status ?? null;
  // Join presses with a small settle and says it is opening for a moment
  const [label, setLabel] = useState(joinLabel), [pressed, setPressed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => setLabel(joinLabel), [joinLabel]);
  const join = () => {
    setPressed(true); setLabel(`Opening ${provider.split(' ').pop()}`);
    timers.current.push(setTimeout(() => setPressed(false), 110), setTimeout(() => setLabel(joinLabel), 1600));
    if (onJoin) onJoin(); else window.open(url, '_blank', 'noopener');
  };
  const shown = people.slice(0, max), rest = people.slice(max);
  const live = phase === 'start' || phase === 'live';
  const past = { ['--dm-p' as string]: pc(t) + '%' } as CSSProperties;

  return (
    <div data-dm="" className={cx('dm-mtx dm-panel', live && 'dm-live', phase === 'done' && 'dm-done', className)}>
      <div className="dm-mtx-h">
        <b className="dm-mtx-t">{title}</b><span className="dm-mtx-sub dm-num">{subtitle ?? `Today, ${start} to ${end}`}</span>
        <span className={cx('dm-tag dm-mtx-st', live && 'dm-ok')}>
          <span key={chip ?? phase} className={ready.current ? 'dm-mtx-fade' : undefined}>
            {chip ?? (phase === 'soon' ? <><Icon name="clock" size="xs" />In {roll} min</>
              : phase === 'start' ? <><i className="dm-dot" />Starting now</>
              : phase === 'live' ? <><i className="dm-dot" />Live, {roll} min left</> : 'Ended')}
          </span>
        </span>
      </div>
      <div className="dm-mtx-track" style={past} role="img"
        aria-label={phase === 'done' ? `The meeting ran ${start} to ${end} and has ended` : `Now ${clock(t)}. The meeting runs ${start} to ${end}`}>
        <span className="dm-mtx-blk" style={{ left: pc(a) + '%', width: pc(b) - pc(a) + '%', ['--dm-cut' as string]: Math.min(100, Math.max(0, (t - a) / Math.max(1, b - a) * 100)) + '%' }}>
          <span className="dm-mtx-bp" /><span className="dm-num">{start}</span><span className="dm-num">{end}</span>
        </span>
        <span className="dm-mtx-past" />
        <span className="dm-mtx-now"><i /></span>
      </div>
      <div className="dm-mtx-f">
        <div className="dm-mtx-who">
          {shown.map(p => (
            <Tip key={p.name} label={p.name}>
              <span className="dm-av" role="img" aria-label={p.name} style={{ background: p.color, color: avatarInk(p.color) }}>{p.initials}</span>
            </Tip>
          ))}
          {rest.length > 0 && (
            <Tip label={rest.map(p => p.name).join(', ')}>
              <span className="dm-av dm-mtx-more" role="img" aria-label={rest.map(p => p.name).join(', ')}>+{rest.length}</span>
            </Tip>
          )}
        </div>
        <span className="dm-sp" />
        <Tip label={copied ? copiedLabel : copyLabel ?? `Copy ${link}`} open={copied || undefined}>
          <button type="button" className={cx('dm-ib dm-mtx-cp', copied && 'dm-copied')} aria-label={`Copy ${provider} link`} onClick={() => { copy(url); onCopy?.(url); }}>
            <Icon name={copied ? 'check' : 'link'} />
          </button>
        </Tip>
        <button type="button" className={cx('dm-pill dm-primary dm-mtx-join', pressed && 'dm-prs')} disabled={phase === 'done'} onClick={join}>
          <span className="dm-mk">{mark ?? <Brand name="meet" />}</span><Swap className="dm-lb">{label}</Swap>
        </button>
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
