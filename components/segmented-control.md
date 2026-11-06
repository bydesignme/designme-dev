# Segmented control

> Switch between views of the same thing, with a sliding indicator.

App basics / Dates. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/segmented-control

## Install

```sh
npx designme add segmented-control          # HTML, CSS and JS, with the shared core
npx designme add segmented-control --react  # React 19 component and its CSS
npx designme add segmented-control --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/segmented-control.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/segmented-control.json  # Astro
```

## About

Segmented control is a row of two to five choices where exactly one is picked, shown as a raised knob that slides to it. Use it to switch between views of the same thing, like a day, a week and a month, or to set one option from a few. It sits inline next to a title and changes what's below it at once.

### When to use it

- When people switch between a few views of the same content, like Day, Week and Month.
- When there are two to five short options and all of them should stay visible.
- When the change should happen at once, without a separate Apply.
- Not for more than five options, or long labels: use a select or tabs with an overflow then.

### What it does

- `options` are the choices, each with a `value` and a `label`. The picked one sits on a raised knob that slides and resizes to it.
- `value`, `defaultValue` and `onValueChange` hold the pick.
- `as="tabs"` (the default) makes it a tab list for switching a panel; `as="radio"` makes it a radio group for setting an option.
- `id` ties the tabs to their panel: the panel takes `id="<id>-panel"` and `aria-labelledby="<id>-<value>"`.
- The demo switches the pricing launch between a day of events, a working week with each weekday's first event and a count of the rest, and a month with a dot on each busy day. Previous and next step a day, a week or a month at a time, Today comes back to the current date, and a day in the week or the month opens it in the day view. The range above the panel crossfades as it changes.

### Accessibility

- As tabs it is a `tablist` named by `label`, each option a `tab` with `aria-selected` and `aria-controls`, and the panel a `tabpanel` labelled by the picked tab.
- As a radio group it is a `radiogroup` with `radio` options and `aria-checked`.
- Only the picked option is in the tab order. ← and → move and pick, wrapping at the ends, and Home and End jump to the first and last.
- The knob is decoration; the picked option's state says the same.
- In the demo, previous and next are named for the view, like Previous week, and each day in the week and the month is a button named with its date and how many events it has.

## Usage in React

```tsx
import { SegmentedControl } from '@/components/designme/segmented-control/SegmentedControl';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { SegmentedControl } from './SegmentedControl';
import { cx } from '../lib/cx';
import { Icon } from '../lib/icons';
import { Swap } from '../lib/motion';
import { useStory } from '../lib/useScript';

/* ---------- Segmented control: the pricing launch as a day, a week or a month, stepped through and opened a day at a time ---------- */
type View = 'day' | 'week' | 'month';
type Ev = [time: string, title: string, detail: string, color: string];
// the pricing launch in October 2026. Today is Friday the 23rd
const TODAY = new Date(2026, 9, 23, 12), DAY = 864e5;
const at = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const same = (a: Date, b: Date) => iso(a) === iso(b);
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', o);
const mon = (d: Date) => at(d, -((d.getDay() + 6) % 7));
// launch week is written out; the days around it are drawn from the work that leads up to it and follows it
const E: Record<string, Ev[]> = {
  '2026-10-19': [['10:00', 'Kickoff with Maya', 'Pricing v4 brief', 'var(--dm-pl)'], ['15:00', 'Brief the agents', 'Build and copy agents', 'var(--dm-pm)']],
  '2026-10-20': [['10:00', 'Wireframe review', 'Pricing v4, frames 1 to 6', 'var(--dm-pl)'], ['11:30', 'Copy for the plan cards', 'Copy agent', 'var(--dm-pt)'], ['14:00', 'Token audit', 'Build agent', 'var(--dm-pm)']],
  '2026-10-21': [['11:00', 'Copy pass', 'Plan cards and FAQ', 'var(--dm-pt)']],
  '2026-10-22': [['14:00', 'Design QA', 'Pricing v4, all frames', 'var(--dm-pb)'], ['16:30', 'Fix contrast issues', 'Build agent', 'var(--dm-pm)']],
  '2026-10-23': [['09:30', 'Pricing review with Maya', 'Pricing v4, frames 1 to 3', 'var(--dm-pl)'], ['13:00', 'Export tokens to CSS', 'Build agent', 'var(--dm-pm)'], ['16:00', 'Ship pricing v4', 'designme.studio/pricing', 'var(--dm-pb)']],
  '2026-10-24': [], '2026-10-25': []
};
const POOL = [['Design crit', 'Pricing frames', 'var(--dm-pl)'], ['Token audit', 'Build agent', 'var(--dm-pm)'], ['Copy pass', 'Plan cards', 'var(--dm-pt)'], ['Stakeholder check-in', 'Weekly', 'var(--dm-pb)'],
  ['User interviews', 'Three sessions', 'var(--dm-pl)'], ['Conversion review', 'Trial to paid', 'var(--dm-pb)'], ['Research synthesis', 'Notes and quotes', 'var(--dm-pt)'], ['Fix review notes', 'Build agent', 'var(--dm-pm)']];
const TIMES = ['09:30', '10:00', '11:30', '13:00', '14:00', '15:30', '16:00'];
function events(d: Date): Ev[] {
  const k = iso(d); if (E[k]) return E[k];
  if (d.getDay() === 0 || d.getDay() === 6) return (E[k] = []);
  let h = Math.floor(+d / DAY) * 2654435761 >>> 0; const nx = (m: number) => { h = Math.imul(h ^ h >>> 15, 2246822519) >>> 0; return h % m; };
  const n = [0, 1, 1, 2, 2, 3][nx(6)], t = new Set<string>();
  while (t.size < n) t.add(TIMES[nx(TIMES.length)]);
  return (E[k] = [...t].sort().map(tm => { const e = POOL[nx(POOL.length)]; return [tm, e[0], e[1], e[2]] as Ev; }));
}
const label = (d: Date, n: number) => `${fmt(d, { weekday: 'long', month: 'long', day: 'numeric' })}, ${n ? n + (n === 1 ? ' event' : ' events') : 'nothing planned'}`;
const RANGE: Record<View, (d: Date) => string> = {
  day: d => fmt(d, { weekday: 'long', month: 'short', day: 'numeric' }),
  week: d => { const a = mon(d), b = at(a, 4); return fmt(a, { month: 'short', day: 'numeric' }) + ' – ' + (a.getMonth() === b.getMonth() ? b.getDate() : fmt(b, { month: 'short', day: 'numeric' })); },
  month: d => fmt(d, { month: 'long', year: 'numeric' })
};

// a day in the week or the month opens that day
function Panel({ view, date, open }: { view: View; date: Date; open: (d: Date) => void }) {
  if (view === 'day') {
    const ev = events(date);
    return ev.length ? (
      <div className="dm-sgc-day">
        {ev.map(([t, n, d, c]) => <div key={t} className="dm-sgc-ev" style={{ '--dm-c': c } as CSSProperties}><span className="dm-num dm-muted">{t}</span><i /><span className="dm-t">{n}<span>{d}</span></span></div>)}
      </div>
    ) : <div className="dm-sgc-none">Nothing planned</div>;
  }
  if (view === 'week') return (
    <div className="dm-sgc-wk">
      {Array.from({ length: 5 }, (_, i) => at(mon(date), i)).map(d => {
        const ev = events(d);
        return (
          <button key={iso(d)} type="button" aria-label={label(d, ev.length)} onClick={() => open(d)}
            className={['dm-sgc-wr', same(d, TODAY) && 'dm-now', !ev.length && 'dm-none'].filter(Boolean).join(' ')}>
            <span className="dm-d">{fmt(d, { weekday: 'short' })} {d.getDate()}</span>
            {ev.length
              ? <><span className="dm-e" style={{ '--dm-c': ev[0][3] } as CSSProperties}><i /><span>{ev[0][1]}</span></span>{ev.length > 1 && <span className="dm-more">+{ev.length - 1} more</span>}</>
              : <span className="dm-e">Nothing planned</span>}
          </button>
        );
      })}
    </div>
  );
  const first = new Date(date.getFullYear(), date.getMonth(), 1, 12), lead = (first.getDay() + 6) % 7, len = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return (
    <div className={['dm-sgc-mo', lead + len > 35 && 'dm-r6'].filter(Boolean).join(' ')}>
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, i) => <span key={'w' + i} className="dm-w" aria-hidden="true">{w}</span>)}
      {Array.from({ length: lead }, (_, i) => <span key={'b' + i} />)}
      {Array.from({ length: len }, (_, i) => {
        const d = at(first, i), n = events(d).length;
        return <button key={i} type="button" aria-label={label(d, n)} onClick={() => open(d)}
          className={['dm-d', 'dm-num', n && 'dm-e', same(d, TODAY) && 'dm-now', same(d, date) && !same(d, TODAY) && 'dm-on'].filter(Boolean).join(' ')}>{i + 1}</button>;
      })}
    </div>
  );
}

export default function SegmentedControlDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>('day');
  const [date, setDate] = useState(TODAY);
  // the panel on show, and the one it replaced while that fades out under the new one, so no frame is empty
  const key = view + iso(date);
  const [layers, setLayers] = useState([{ key, view, date, gone: false }]);
  if (layers[layers.length - 1].key !== key) setLayers([...layers.filter(l => !l.gone).slice(-1).map(l => ({ ...l, gone: true })), { key, view, date, gone: false }]);
  useEffect(() => {
    if (!layers.some(l => l.gone)) return;
    const t = setTimeout(() => setLayers(ls => ls.filter(l => !l.gone)), 260);
    return () => clearTimeout(t);
  }, [layers]);
  // previous and next step by the view's unit; Today comes back to the 23rd
  const step = (k: number) => setDate(d => view === 'day' ? at(d, k) : view === 'week' ? at(d, 7 * k) : new Date(d.getFullYear(), d.getMonth() + k, 1, 12));
  const open = (d: Date) => { setDate(d); setView('day'); };

  // the preview's story: the week, then Tuesday opened from it, a step on to Wednesday, the month, and back to the week
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('[data-v="week"]');
    await wait(2000); press('.dm-sgc-wr:nth-child(2)');
    await wait(2000); press('.dm-sgc-nx');
    await wait(1500); press('[data-v="month"]');
    await wait(2000); press('[data-v="week"]');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div data-dm="" className="dm-sgc dm-panel">
        <div className="dm-sgc-h">
          <div className="dm-sgc-ht"><b>Pricing launch</b></div>
          <SegmentedControl id="launch-view" label="View" value={view} onValueChange={setView}
            options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
        </div>
        <div className="dm-sgc-bar">
          <span className="dm-sgc-r" aria-live="polite"><Swap>{RANGE[view](date)}</Swap></span>
          <button type="button" className="dm-pill dm-ghost dm-sm dm-sgc-td" onClick={() => setDate(TODAY)}>Today</button>
          <button type="button" className="dm-ib dm-sgc-pv" aria-label={'Previous ' + view} onClick={() => step(-1)}><Icon name="chev-l" size="xs" /></button>
          <button type="button" className="dm-ib dm-sgc-nx" aria-label={'Next ' + view} onClick={() => step(1)}><Icon name="chev-r" size="xs" /></button>
        </div>
        <div className="dm-sgc-p" id="launch-view-panel" role="tabpanel" aria-labelledby={`launch-view-${view}`} tabIndex={0}>
          {layers.map((l, i) => (
            <div key={l.key} className={cx('dm-sgc-in', l.gone ? 'dm-gone' : i > 0 && 'dm-fresh')} inert={l.gone} aria-hidden={l.gone || undefined}>
              <Panel view={l.view} date={l.date} open={open} />
            </div>
          ))}
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

## Usage in Astro

```astro
---
import SegmentedControl from '../components/designme/segmented-control/SegmentedControl.astro';
---
<SegmentedControl />
<SegmentedControl data-style="soft" class="my-class" />
```
It plays its demo; change `segmented-control.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

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
