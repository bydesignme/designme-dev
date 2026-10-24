# Segmented control

> Switch between views of the same thing, with a sliding indicator.

App basics / Dates. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/segmented-control

## Install

```sh
npx designme add segmented-control          # HTML, CSS and JS, with the shared core
npx designme add segmented-control --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Segmented control is a row of two to five choices where exactly one is picked, shown as a white knob that slides to it. Use it to switch between views of the same thing, like a day, a week and a month, or to set one option from a few. It sits inline next to a title and changes what's below it at once.

### When to use it

- When people switch between a few views of the same content, like Day, Week and Month.
- When there are two to five short options and all of them should stay visible.
- When the change should happen at once, without a separate Apply.
- Not for more than five options, or long labels: use a select or tabs with an overflow then.

### What it does

- `options` are the choices, each with a `value` and a `label`. The picked one sits on a white knob that slides and resizes to it.
- `value`, `defaultValue` and `onValueChange` hold the pick.
- `as="tabs"` (the default) makes it a tab list for switching a panel; `as="radio"` makes it a radio group for setting an option.
- `id` ties the tabs to their panel: the panel takes `id="<id>-panel"` and `aria-labelledby="<id>-<value>"`.
- The demo switches the pricing launch between a day of events, a week with each day's first event and a count of the rest, and a month with a dot on each busy day, and the range under the title crossfades with it.

### Accessibility

- As tabs it is a `tablist` named by `label`, each option a `tab` with `aria-selected` and `aria-controls`, and the panel a `tabpanel` labelled by the picked tab.
- As a radio group it is a `radiogroup` with `radio` options and `aria-checked`.
- Only the picked option is in the tab order. ← and → move and pick, wrapping at the ends, and Home and End jump to the first and last.
- The knob is decoration; the picked option's state says the same.

## Usage in React

```tsx
import { SegmentedControl } from '@/components/designme/segmented-control/SegmentedControl';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState, type CSSProperties } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { Swap } from '../lib/motion';
import { useStory } from '../lib/useScript';

/* ---------- Segmented control: switch the pricing launch between a day, a week and a month ---------- */
type View = 'day' | 'week' | 'month';
// the pricing launch in October 2026. Today is Friday the 23rd
const DAY = [['09:30', 'Pricing review with Maya', 'Pricing v4, frames 1 to 3', 'var(--dm-pl)'], ['13:00', 'Export tokens to CSS', 'Build agent', 'var(--dm-pm)'], ['16:00', 'Ship pricing v4', 'designme.studio/pricing', 'var(--dm-pb)']];
// the week: each day's events, earliest first. Friday's are the day above
const WEEK: [string, number, string[][]][] = [['Mon', 19, [['10:00', 'Kickoff with Maya', 'var(--dm-pl)'], ['15:00', 'Brief the agents', 'var(--dm-pm)']]],
  ['Tue', 20, [['10:00', 'Wireframe review', 'var(--dm-pl)'], ['11:30', 'Copy for the plan cards', 'var(--dm-pt)'], ['14:00', 'Token audit', 'var(--dm-pm)'], ['16:00', 'Stakeholder check-in', 'var(--dm-pb)']]],
  ['Wed', 21, [['11:00', 'Copy pass', 'var(--dm-pt)']]], ['Thu', 22, [['14:00', 'Design QA', 'var(--dm-pb)'], ['16:30', 'Fix contrast issues', 'var(--dm-pm)']]],
  ['Fri', 23, DAY.map(([t, n, , c]) => [t, n, c])], ['Sat', 24, []], ['Sun', 25, []]];
const BUSY = [2, 6, 7, 9, 13, 14, 15, 16, 19, 20, 21, 22, 23, 27, 28, 29, 30];
const RANGE: Record<View, string> = { day: 'Friday, Oct 23', week: 'Oct 19 – 25', month: 'October 2026' };

function Panel({ view }: { view: View }) {
  if (view === 'day') return (
    <div className="dm-sgc-day">
      {DAY.map(([t, n, d, c]) => <div key={t} className="dm-sgc-ev" style={{ '--dm-c': c } as CSSProperties}><span className="dm-num dm-muted">{t}</span><i /><span className="dm-t">{n}<span>{d}</span></span></div>)}
    </div>
  );
  if (view === 'week') return (
    <div className="dm-sgc-wk">
      {WEEK.map(([d, n, ev]) => (
        <div key={d} className={['dm-sgc-wr', n === 23 && 'dm-now', !ev.length && 'dm-none'].filter(Boolean).join(' ')}>
          <span className="dm-d">{d} {n}</span>
          {ev.length
            ? <><span className="dm-e" style={{ '--dm-c': ev[0][2] } as CSSProperties}><i /><span className="dm-tm dm-num">{ev[0][0]}</span><span>{ev[0][1]}</span></span>{ev.length > 1 && <span className="dm-more">+{ev.length - 1} more</span>}</>
            : <span className="dm-e">Nothing planned</span>}
        </div>
      ))}
    </div>
  );
  return (
    <div className="dm-sgc-mo">
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, i) => <span key={'w' + i} className="dm-w">{w}</span>)}
      {[0, 1, 2].map(i => <span key={'b' + i} />)}
      {Array.from({ length: 31 }, (_, i) => <span key={i} className={['dm-d', 'dm-num', BUSY.includes(i + 1) && 'dm-e', i === 22 && 'dm-now'].filter(Boolean).join(' ')}>{i + 1}</span>)}
    </div>
  );
}

export default function SegmentedControlDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>('day');

  // the preview's story: look at the week, then the month, then settle on the week
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('[data-v="week"]');
    await wait(3000); press('[data-v="month"]');
    await wait(3000); press('[data-v="week"]');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div data-dm="" className="dm-sgc dm-panel">
        <div className="dm-sgc-h">
          <div className="dm-sgc-ht"><b>Pricing launch</b><span aria-live="polite"><Swap className="dm-muted dm-sgc-r">{RANGE[view]}</Swap></span></div>
          <SegmentedControl id="launch-view" label="View" value={view} onValueChange={setView}
            options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
        </div>
        <div className="dm-sgc-p" id="launch-view-panel" role="tabpanel" aria-labelledby={`launch-view-${view}`} tabIndex={0}>
          <div key={view} className="dm-sgc-in dm-enter"><Panel view={view} /></div>
        </div>
      </div>
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `options` | `SegmentOption<T>[]` |  |
| `value` (optional) | `T` |  |
| `defaultValue` (optional) | `T` |  |
| `onValueChange` (optional) | `(value: T) => void` |  |
| `label` | `string` | Names the group for screen readers, like "View" |
| `as` (optional) | `'tabs' \| 'radio'` | `tabs` (the default) when it switches a panel, `radio` when it sets an option |
| `id` (optional) | `string` | Ties the tabs to their panel: put `id={`${id}-panel`}` and `aria-labelledby={`${id}-${value}`}` on the panel. Defaults to a generated id |
| `className` (optional) | `string` |  |

Also takes the props of `string = string>`.

## Questions

**Should it be tabs or a radio group?**

Tabs when it changes what a panel shows, like a calendar view. A radio group when it sets a value that's saved or sent, like a billing period.

**Can an option have an icon?**

Yes. `label` takes JSX, so put an icon before the text, or only an icon with an `aria-label` inside it.

**Does the knob slide when the labels change width?**

Yes. It measures the picked option whenever the control resizes, so it follows a translated label or a new font.

**How many options can it take?**

It works best with two to five short ones. Past that, the options get narrow on a phone.

## Source

`SegmentedControl.tsx`, as `npx designme add segmented-control --react` installs it:

```tsx
'use client';
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import '../designme.css';
import './segmented-control.css';

export interface SegmentOption<T extends string = string> {
  value: T;
  label: ReactNode;
}

export interface SegmentedControlProps<T extends string = string> {
  options: SegmentOption<T>[];
  value?: T;
  defaultValue?: T;
  onValueChange?: (value: T) => void;
  /** Names the group for screen readers, like "View" */
  label: string;
  /** `tabs` (the default) when it switches a panel, `radio` when it sets an option */
  as?: 'tabs' | 'radio';
  /** Ties the tabs to their panel: put `id={`${id}-panel`}` and `aria-labelledby={`${id}-${value}`}` on the panel. Defaults to a generated id */
  id?: string;
  className?: string;
}

/** One choice from a few views or options, with a white knob that slides to the picked one. As tabs, the arrow keys
    move along and pick, and Home and End jump to the ends; as a radio group, the arrow keys do the same. */
export function SegmentedControl<T extends string = string>({ options, value, defaultValue, onValueChange, label, as = 'tabs', id, className }: SegmentedControlProps<T>) {
  const auto = useId();
  const base = id ?? 'dm-sgc' + auto.replace(/:/g, '');
  const [cur, setCur] = useControllable(value, (defaultValue ?? options[0]?.value) as T, onValueChange);
  const ref = useRef<HTMLDivElement>(null);
  const [knob, setKnob] = useState<CSSProperties>({ transition: 'none' });
  const first = useRef(true);
  // the knob takes the picked button's place and width, without sliding in on the first paint
  useIsoLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const place = () => {
      const b = el.querySelector<HTMLElement>('[data-on="true"]'); if (!b) return;
      setKnob({ left: b.offsetLeft, width: b.offsetWidth, ...(first.current ? { transition: 'none' } : {}) });
      if (first.current) requestAnimationFrame(() => { first.current = false; });
    };
    place();
    const ro = new ResizeObserver(place); ro.observe(el);
    return () => ro.disconnect();
  }, [cur, options.length]);

  const tabs = as === 'tabs';
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const i = options.findIndex(o => o.value === cur);
    const to = ({ ArrowRight: i + 1, ArrowLeft: i - 1, Home: 0, End: options.length - 1 } as Record<string, number>)[e.key];
    if (to === undefined) return;
    e.preventDefault();
    const o = options[(to + options.length) % options.length];
    setCur(o.value);
    ref.current?.querySelector<HTMLElement>(`[data-v="${CSS.escape(o.value)}"]`)?.focus();
  };

  return (
    <div ref={ref} data-dm="" className={cx('dm-sgc-seg', className)} role={tabs ? 'tablist' : 'radiogroup'} aria-label={label} onKeyDown={onKey}>
      <span className="dm-sgc-k" style={knob} aria-hidden="true" />
      {options.map(o => {
        const on = o.value === cur;
        return (
          <button key={o.value} type="button" data-v={o.value} data-on={on} id={`${base}-${o.value}`} tabIndex={on ? 0 : -1}
            role={tabs ? 'tab' : 'radio'} {...(tabs ? { 'aria-selected': on, 'aria-controls': `${base}-panel` } : { 'aria-checked': on })}
            onClick={() => setCur(o.value)}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
```

## More in Dates

- [Date picker](https://designme.dev/components/date-picker.md): A field that opens a calendar, with quick picks and natural language.
- [Date range picker](https://designme.dev/components/date-range-picker.md): Pick a start and end across two months, or use a preset.
- [Event calendar](https://designme.dev/components/event-calendar.md): A week view where the agent finds a free slot for you.
- [Agenda](https://designme.dev/components/agenda.md): Today's schedule with a live now line and agent prep notes.

All components: https://designme.dev/llms.txt
