# Banner

> An announcement on a tint of its tone, with its own line drawing and a dismiss.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/banner

## Install

```sh
npx designme add banner          # HTML, CSS and JS, with the shared core
npx designme add banner --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Banner puts one announcement in front of people: an eyebrow, a title, a line of text, a primary action and a quieter link, on a tint of its tone, with a line drawing on the right. It comes with four drawings of its own, and a dismiss that leaves an Undo in its place.

### When to use it

- When a new feature or a beta is worth a moment of attention, like "Memory that carries across threads" with Turn on memory.
- When a guide or a setup flow should be one click away, without a modal in the way.
- When people need a heads-up, such as planned maintenance, that they can read and put away.
- When a page has room for one message above its content, and it should be easy to dismiss.

### What it does

- Six tones: `accent` (the default, the accent's own tint), `neutral`, and tints of the tag colours `blue`, `violet`, `green` and `amber`. Each sets the fill, the eyebrow's colour and the drawing's colour.
- Four drawings, drawn as hairlines with a few dashed construction lines: `layers` (a stack of plates pulled apart), `steps` (a staircase up to a flag), `nodes` (a small graph over a floor grid) and `grid` (a floor that bends up towards its vanishing point). Pass your own SVG element to `art` instead, or `null` for none.
- Each drawing draws itself in, line by line, when it appears. Under the pointer its parts pull apart a little by their depth. Nothing loops, and there are no blur filters.
- On a wide banner the drawing sits on the right, shown at its own size and cropped by its area, so a narrower banner shows less of it rather than a smaller one.
- In a column narrower than 480px the drawing becomes a strip across the top that fades out before the text starts, so nothing is drawn behind the words.
- `action` is the primary button on the accent and `secondary` a quieter underlined link. Each takes an `onClick`, or an `href` to make it a link.
- Dismiss plays the banner out, calls `onDismiss` and sets `open` to false. A line saying "Banner dismissed" with Undo then keeps the banner's height, so nothing below it moves. Set `undo` to a string to change the words, or to `false` to leave nothing.
- Text passed as a string crossfades when it changes, so one banner can turn into the next in place.

### Accessibility

- The banner is a region named by `label` (Announcement by default), and the drawing is hidden from screen readers with `aria-hidden`.
- The dismiss button is a real button with `aria-label="Dismiss"`. After a dismiss the focus moves to Undo, and after Undo back to Dismiss, so a keyboard never loses its place.
- The line that replaces a dismissed banner has `role="status"`, so the change is announced.
- Every text colour is checked on every tone, in Soft and Blueprint, light and dark: 4.5:1 and APCA Lc 60 or more. The drawing's lines are 3:1 on the fill.
- With reduced motion the drawing shows complete at once and its parts don't move under the pointer.

## Usage in React

```tsx
import { Banner } from '@/components/designme/banner/Banner';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { Banner, type BannerArtName, type BannerTone } from './Banner';
import { useStory } from '../lib/useScript';

/* ---------- Banner: three announcements one after another, each with its own tone and drawing, then the last one is
   dismissed and brought back with Undo ---------- */
const BANNERS: { tone: BannerTone; art: BannerArtName; eyebrow: string; title: string; description: string; action: string; secondary: string }[] = [
  { tone: 'accent', art: 'layers', eyebrow: 'New', title: 'Memory that carries across threads', description: 'Agents keep what they learn about your project, so you only explain things once.', action: 'Turn on memory', secondary: 'What it keeps' },
  { tone: 'violet', art: 'nodes', eyebrow: 'Beta', title: 'Connect your tools in one place', description: 'Linear, GitHub and Slack in one list, with access you can scope for each agent.', action: 'Connect a tool', secondary: 'Read the docs' },
  { tone: 'green', art: 'steps', eyebrow: 'Guide', title: 'Set up your first automation', description: 'Five short steps, about ten minutes. The agent can do most of them for you.', action: 'Start the guide', secondary: 'Maybe later' },
  { tone: 'amber', art: 'grid', eyebrow: 'Heads-up', title: 'Maintenance on Sunday, 02:00 UTC', description: 'Agents pause for about an hour, and queued runs pick up where they left off.', action: 'Add to calendar', secondary: 'Status page' }
];

export default function BannerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const [open, setOpen] = useState(true);
  // the preview's story: the next two banners take the first one's place, then the last is dismissed and comes back with
  // Undo. Your first click, key or focus stops it, and a mouse resting on it holds it where it is
  useStory(ref, async ({ wait, press }) => {
    await wait(4000); setI(1);
    await wait(4000); setI(2);
    await wait(4000); press('.dm-bnx-x');
    await wait(3000); press('.dm-bnx-undo');
  });
  const b = BANNERS[i];
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Banner tone={b.tone} art={b.art} eyebrow={b.eyebrow} title={b.title} description={b.description}
        action={{ label: b.action, onClick: () => {} }} secondary={{ label: b.secondary, onClick: () => {} }}
        open={open} onOpenChange={setOpen} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `tone` (optional) | `BannerTone` | The tint, and the colour the eyebrow and the drawing take. accent by default |
| `art` (optional) | `BannerArtName \| ReactElement \| null` | One of the four drawings, or your own SVG (240 by 160 is the size it is shown at). null for none. layers by default |
| `eyebrow` (optional) | `string` | A short label over the title, like New or Beta |
| `title` | `ReactNode` |  |
| `description` (optional) | `ReactNode` | One line or two under the title |
| `action` (optional) | `BannerAction` | The primary button, on the accent |
| `secondary` (optional) | `BannerAction` | A quieter link beside it |
| `onDismiss` (optional) | `() => void` | Called by the dismiss button |
| `dismissible` (optional) | `boolean` | Shows the dismiss button. true by default |
| `open` (optional) | `boolean` | Whether the banner is showing (controlled), with defaultOpen and onOpenChange. Dismiss sets it to false, Undo to true |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `undo` (optional) | `boolean \| string` | After a dismiss, a quiet line with Undo keeps the banner's place: true says "Banner dismissed", a string says something else, and false leaves nothing. true by default |
| `label` (optional) | `string` | The banner's name for screen readers. Announcement by default |
| `className` (optional) | `string` |  |

## Questions

**Can I use my own illustration?**

Yes. Pass an SVG element to `art`. It is shown at 240 by 160 in the same area and cropped the same way. Give its lines `className="dm-ln"` and `pathLength={1}` and they draw themselves in like the built-in ones.

**How do I keep a banner dismissed across visits?**

Store it yourself. `onDismiss` tells you when it happens, so save that, and the next time leave the banner out, or render it with `open={false}` and `undo={false}`.

**Why is the primary button the accent colour on every tone?**

Primary actions always sit on the accent, so they look the same everywhere in your product. The tone only changes the tint, the eyebrow and the drawing.

**What happens on a phone?**

Below 480px wide the drawing moves to a short strip across the top, shown at three quarters of its size, and the text runs the full width under it.

## Source

`Banner.tsx`, as `npx designme add banner --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
import './banner.css';

/** The tint the banner sits on. `accent` is the accent's own tint; the others are tints of the tag colours */
export type BannerTone = 'accent' | 'neutral' | 'blue' | 'violet' | 'green' | 'amber';
/** The four drawings that come with it */
export type BannerArtName = 'layers' | 'steps' | 'nodes' | 'grid';

export interface BannerAction {
  label: string;
  onClick?: () => void;
  /** Makes it a link instead of a button */
  href?: string;
}

export interface BannerProps {
  /** The tint, and the colour the eyebrow and the drawing take. accent by default */
  tone?: BannerTone;
  /** One of the four drawings, or your own SVG (240 by 160 is the size it is shown at). null for none. layers by default */
  art?: BannerArtName | ReactElement | null;
  /** A short label over the title, like New or Beta */
  eyebrow?: string;
  title: ReactNode;
  /** One line or two under the title */
  description?: ReactNode;
  /** The primary button, on the accent */
  action?: BannerAction;
  /** A quieter link beside it */
  secondary?: BannerAction;
  /** Called by the dismiss button */
  onDismiss?: () => void;
  /** Shows the dismiss button. true by default */
  dismissible?: boolean;
  /** Whether the banner is showing (controlled), with defaultOpen and onOpenChange. Dismiss sets it to false, Undo to true */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** After a dismiss, a quiet line with Undo keeps the banner's place: true says "Banner dismissed", a string says something
      else, and false leaves nothing. true by default */
  undo?: boolean | string;
  /** The banner's name for screen readers. Announcement by default */
  label?: string;
  className?: string;
}

// the order each line draws in, and how far a part moves under the pointer
const d = (n: number) => ({ '--dm-d': n }) as CSSProperties;
const z = (n: number) => ({ '--dm-z': n }) as CSSProperties;
/* each drawing is 240 by 160, written as plain paths: layers (three plates of a stack, pulled apart), steps (a staircase
   climbing to a flag), nodes (a small graph standing on a floor grid) and grid (a floor that bends up towards its
   vanishing point, with one tile raised). dm-ln lines draw themselves in, dm-gd are the dashed construction lines, which
   fade in, and dm-pl faces wear the banner's fill so what is in front hides what is behind */
const ART: Record<BannerArtName, ReactElement> = {
  layers: <><g className="dm-gds"><path className="dm-gd" d="M92 34V124M208 34V124M150 87.5V159.5"/><path className="dm-gd" d="M222 48V104M218 48h8M218 104h8"/></g><g className="dm-z" style={z(0)}><path className="dm-pl" d="M150 70.5L208 104L208 110L150 143.5L92 110L92 104Z"/><path className="dm-ln" style={d(0)} pathLength={1} d="M150 70.5L208 104L150 137.5L92 104Z"/><path className="dm-ln" style={d(1)} pathLength={1} d="M92 104L92 110L150 143.5L208 110L208 104"/><path className="dm-ln" style={d(2)} pathLength={1} d="M150 137.5L150 143.5"/></g><g className="dm-z" style={z(1)}><path className="dm-pl" d="M150 42.5L208 76L208 82L150 115.5L92 82L92 76Z"/><path className="dm-ln" style={d(3)} pathLength={1} d="M150 42.5L208 76L150 109.5L92 76Z"/><path className="dm-ln" style={d(4)} pathLength={1} d="M92 76L92 82L150 115.5L208 82L208 76"/><path className="dm-ln" style={d(5)} pathLength={1} d="M150 109.5L150 115.5"/></g><g className="dm-z" style={z(2)}><path className="dm-pl" d="M150 14.5L208 48L208 54L150 87.5L92 54L92 48Z"/><path className="dm-ln" style={d(6)} pathLength={1} d="M150 14.5L208 48L150 81.5L92 48Z"/><path className="dm-ln" style={d(7)} pathLength={1} d="M92 48L92 54L150 87.5L208 54L208 48"/><path className="dm-ln" style={d(8)} pathLength={1} d="M150 81.5L150 87.5"/><path className="dm-ln dm-ac" style={d(9)} pathLength={1} d="M150 28.5L184 48L150 67.5L116 48Z"/></g></>,
  steps: <><g className="dm-gds"><path className="dm-gd" d="M100 157L179.7 111M77.5 146L167.6 26.8"/></g><g className="dm-z" style={z(0)}><path className="dm-pl" d="M126 28L155.4 45L138.1 55L108.7 38Z"/><path className="dm-ln" style={d(0)} pathLength={1} d="M126 28L155.4 45L138.1 55L108.7 38Z"/><path className="dm-pl" d="M108.7 102L138.1 119L138.1 55L108.7 38Z"/><path className="dm-ln" style={d(1)} pathLength={1} d="M108.7 102L138.1 119L138.1 55L108.7 38Z"/><path className="dm-pl" d="M155.4 109L138.1 119L138.1 55L155.4 45Z"/><path className="dm-ln" style={d(2)} pathLength={1} d="M155.4 109L138.1 119L138.1 55L155.4 45Z"/><path className="dm-pl" d="M108.7 54L138.1 71L120.8 81L91.4 64Z"/><path className="dm-ln" style={d(3)} pathLength={1} d="M108.7 54L138.1 71L120.8 81L91.4 64Z"/><path className="dm-pl" d="M91.4 112L120.8 129L120.8 81L91.4 64Z"/><path className="dm-ln" style={d(4)} pathLength={1} d="M91.4 112L120.8 129L120.8 81L91.4 64Z"/><path className="dm-pl" d="M138.1 119L120.8 129L120.8 81L138.1 71Z"/><path className="dm-ln" style={d(5)} pathLength={1} d="M138.1 119L120.8 129L120.8 81L138.1 71Z"/><path className="dm-pl" d="M91.4 80L120.8 97L103.5 107L74 90Z"/><path className="dm-ln" style={d(6)} pathLength={1} d="M91.4 80L120.8 97L103.5 107L74 90Z"/><path className="dm-pl" d="M74 122L103.5 139L103.5 107L74 90Z"/><path className="dm-ln" style={d(7)} pathLength={1} d="M74 122L103.5 139L103.5 107L74 90Z"/><path className="dm-pl" d="M120.8 129L103.5 139L103.5 107L120.8 97Z"/><path className="dm-ln" style={d(8)} pathLength={1} d="M120.8 129L103.5 139L103.5 107L120.8 97Z"/><path className="dm-pl" d="M74 106L103.5 123L86.2 133L56.7 116Z"/><path className="dm-ln" style={d(9)} pathLength={1} d="M74 106L103.5 123L86.2 133L56.7 116Z"/><path className="dm-pl" d="M56.7 132L86.2 149L86.2 133L56.7 116Z"/><path className="dm-ln" style={d(10)} pathLength={1} d="M56.7 132L86.2 149L86.2 133L56.7 116Z"/><path className="dm-pl" d="M103.5 139L86.2 149L86.2 133L103.5 123Z"/><path className="dm-ln" style={d(11)} pathLength={1} d="M103.5 139L86.2 149L86.2 133L103.5 123Z"/></g><g className="dm-z" style={z(2)}><path className="dm-ln dm-ac" style={d(12)} pathLength={1} d="M132.1 41.5V17.5h14l-4 5 4 5h-14"/></g></>,
  nodes: <><g className="dm-gds"><path className="dm-gd" d="M150 46L66.9 94M150 46L233.1 94M170.8 58L87.6 106M129.2 58L212.4 106M191.6 70L108.4 118M108.4 70L191.6 118M212.4 82L129.2 130M87.6 82L170.8 130M233.1 94L150 142M66.9 94L150 142"/></g><g className="dm-z" style={z(0)}><path className="dm-gd" d="M170.8 58V40"/><path className="dm-gd" d="M166.8 55.7L174.8 60.3M174.8 55.7L166.8 60.3"/><path className="dm-gd" d="M212.4 106V92"/><path className="dm-gd" d="M208.4 103.7L216.4 108.3M216.4 103.7L208.4 108.3"/><path className="dm-gd" d="M87.6 82V68"/><path className="dm-gd" d="M83.6 79.7L91.6 84.3M91.6 79.7L83.6 84.3"/><path className="dm-gd" d="M129.2 130V110"/><path className="dm-gd" d="M125.2 127.7L133.2 132.3M133.2 127.7L125.2 132.3"/><path className="dm-gd" d="M150 94V60"/><path className="dm-gd" d="M146 91.7L154 96.3M154 91.7L146 96.3"/></g><g className="dm-z" style={z(1)}><path className="dm-ln" style={d(0)} pathLength={1} d="M170.8 40L150 60"/><path className="dm-ln" style={d(1)} pathLength={1} d="M212.4 92L150 60"/><path className="dm-ln" style={d(2)} pathLength={1} d="M87.6 68L150 60"/><path className="dm-ln" style={d(3)} pathLength={1} d="M150 60L129.2 110"/><path className="dm-ln" style={d(4)} pathLength={1} d="M170.8 40L212.4 92"/><path className="dm-ln" style={d(5)} pathLength={1} d="M87.6 68L129.2 110"/></g><g className="dm-z" style={z(2)}><circle className="dm-pl" cx="170.8" cy="40" r="6"/><circle className="dm-ln" style={d(6)} pathLength={1} cx="170.8" cy="40" r="6"/><circle className="dm-pl" cx="212.4" cy="92" r="7"/><circle className="dm-ln" style={d(7)} pathLength={1} cx="212.4" cy="92" r="7"/><circle className="dm-pl" cx="87.6" cy="68" r="6"/><circle className="dm-ln" style={d(8)} pathLength={1} cx="87.6" cy="68" r="6"/><circle className="dm-pl" cx="129.2" cy="110" r="6"/><circle className="dm-ln" style={d(9)} pathLength={1} cx="129.2" cy="110" r="6"/><circle className="dm-pl" cx="150" cy="60" r="8"/><circle className="dm-ln dm-ac" style={d(10)} pathLength={1} cx="150" cy="60" r="8"/><circle className="dm-gd" cx="150" cy="60" r="14"/><circle className="dm-hub" cx="150" cy="60" r="2"/></g></>,
  grid: <><g className="dm-gds"><path className="dm-gd" d="M40 18H240M227 13l10 10m0 -10l-10 10"/></g><g className="dm-z" style={z(0)}><path className="dm-ln" style={d(0)} pathLength={1} d="M78 150L96.5 133.2L119.6 109.3L147.3 76.4L173.5 41.3"/><path className="dm-ln" style={d(1)} pathLength={1} d="M115.6 150L129.6 133.3L147 109.8L168 77.8L187.8 43.9"/><path className="dm-ln" style={d(2)} pathLength={1} d="M153.2 150L162.7 133.4L174.5 110.3L188.7 79.3L202.1 46.6"/><path className="dm-ln" style={d(3)} pathLength={1} d="M190.8 150L195.7 133.5L201.9 110.8L209.3 80.7L216.3 49.3"/><path className="dm-ln" style={d(4)} pathLength={1} d="M228.4 150L228.8 133.6L229.4 111.3L230 82.1L230.6 52"/><path className="dm-ln" style={d(5)} pathLength={1} d="M266 150L261.9 133.7L256.8 111.8L250.7 83.5L244.9 54.7"/><path className="dm-ln" style={d(6)} pathLength={1} d="M78 150L115.6 150L153.2 150L190.8 150L228.4 150L266 150"/><path className="dm-ln" style={d(7)} pathLength={1} d="M96.5 133.2L129.6 133.3L162.7 133.4L195.7 133.5L228.8 133.6L261.9 133.7"/><path className="dm-ln" style={d(8)} pathLength={1} d="M119.6 109.3L147 109.8L174.5 110.3L201.9 110.8L229.4 111.3L256.8 111.8"/><path className="dm-ln" style={d(9)} pathLength={1} d="M147.3 76.4L168 77.8L188.7 79.3L209.3 80.7L230 82.1L250.7 83.5"/></g><g className="dm-z" style={z(2)}><path className="dm-pl" d="M162.7 115.4L195.7 115.5L201.9 92.8L174.5 92.3Z"/><path className="dm-ln dm-ac" style={d(10)} pathLength={1} d="M162.7 115.4L195.7 115.5L201.9 92.8L174.5 92.3Z"/><path className="dm-ln dm-ac" style={d(11)} pathLength={1} d="M162.7 133.4L162.7 115.4M195.7 133.5L195.7 115.5M201.9 110.8L201.9 92.8M174.5 110.3L174.5 92.3"/></g></>
};

function Act({ a, className }: { a: BannerAction; className: string }) {
  return a.href
    ? <a className={className} href={a.href} onClick={a.onClick}><span>{a.label}</span></a>
    : <button type="button" className={className} onClick={a.onClick}><span>{a.label}</span></button>;
}
// text that is a string crossfades when it changes, as on the site
const T = (n: ReactNode) => (typeof n === 'string' ? <Swap>{n}</Swap> : n);

/** An announcement on a tint of its tone: an eyebrow, a title, a line of text and its actions, a line drawing on the right
    (a strip across the top in a narrow column), and a dismiss with Undo. */
export function Banner({ tone = 'accent', art = 'layers', eyebrow, title, description, action, secondary, onDismiss, dismissible = true,
  open: openProp, defaultOpen = true, onOpenChange, undo = true, label = 'Announcement', className }: BannerProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  // the banner leaving, and the height it had, which the Undo line keeps so nothing below moves
  const [leaving, setLeaving] = useState(false);
  const [held, setHeld] = useState<number | null>(null);
  const slot = useRef<HTMLDivElement>(null), xRef = useRef<HTMLButtonElement>(null), undoRef = useRef<HTMLButtonElement>(null);
  const focus = useRef<'undo' | 'x' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (open) { setLeaving(false); setHeld(null); } }, [open]);
  // the focus follows the button that went: to Undo after a dismiss, back to Dismiss after Undo
  useEffect(() => {
    if (focus.current === 'undo' && !open) undoRef.current?.focus({ preventScroll: true });
    if (focus.current === 'x' && open) xRef.current?.focus({ preventScroll: true });
    focus.current = null;
  }, [open]);

  const dismiss = () => {
    if (leaving) return;
    if (slot.current) setHeld(Math.ceil(slot.current.getBoundingClientRect().height));
    if (slot.current?.contains(document.activeElement)) focus.current = 'undo';
    setLeaving(true); onDismiss?.();
    timer.current = setTimeout(() => setOpen(false), reduce ? 0 : 320);
  };
  const restore = () => { if (slot.current?.contains(document.activeElement)) focus.current = 'x'; setOpen(true); };

  const name = typeof art === 'string' ? art : null;
  const gone = !open && undo !== false;
  if (!open && !gone) return null;
  return (
    <div ref={slot} data-dm="" className={cx('dm-bnx-slot', held !== null && 'dm-held', className)} style={held !== null ? { minHeight: held } : undefined}>
      {open && (
        <div className={cx('dm-bnx', leaving && 'dm-leave')} role="region" aria-label={label} data-tone={tone} data-art={name ?? undefined}>
          {art && (
            <div className="dm-bnx-art" aria-hidden="true">
              {name
                ? <svg key={name} className="dm-bnx-svg" viewBox="0 0 240 160" width="240" height="160" focusable="false">{ART[name]}</svg>
                : <div className="dm-bnx-svg">{art}</div>}
            </div>
          )}
          <div className="dm-bnx-tx">
            {eyebrow && <span className="dm-bnx-eb">{T(eyebrow)}</span>}
            <p className="dm-bnx-t">{T(title)}</p>
            {description && <p className="dm-bnx-d">{T(description)}</p>}
            {(action || secondary) && (
              <div className="dm-bnx-acts">
                {action && <Act a={action} className="dm-pill dm-primary dm-sm dm-bnx-go" />}
                {secondary && <Act a={secondary} className="dm-bnx-lk" />}
              </div>
            )}
          </div>
          {dismissible && <Tip label="Dismiss"><button ref={xRef} type="button" className="dm-ib dm-bnx-x" aria-label="Dismiss" onClick={dismiss}><Icon name="x" /></button></Tip>}
        </div>
      )}
      {gone && (
        <div className="dm-bnx-gone dm-enter" role="status">
          <span>{typeof undo === 'string' ? undo : 'Banner dismissed'}</span>
          <button ref={undoRef} type="button" className="dm-pill dm-ghost dm-sm dm-bnx-undo" onClick={restore}>Undo</button>
        </div>
      )}
    </div>
  );
}
```

## More in Collaboration

- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.
- [Notifications](https://designme.dev/components/notifications.md): An inbox where agent updates and mentions arrive live.
- [Invite to collaborate](https://designme.dev/components/invite-to-collaborate.md): Add teammates by email as chips, set their role, send.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Profile menu](https://designme.dev/components/profile-menu.md): The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.
- [Context switcher](https://designme.dev/components/context-switcher.md): The organisation, project and environment you are in, each part a searchable switcher.
- [Filter menu](https://designme.dev/components/filter-menu.md): Add filters from a menu, see them as chips, and watch the count change.
- [Ticket list](https://designme.dev/components/ticket-list.md): Support tickets the agent has triaged, with suggested replies.
- [Kanban board](https://designme.dev/components/kanban-board.md): A board where you and the agent move cards, with drag and drop.

All components: https://designme.dev/llms.txt
