# Banner

> An announcement on a tint of its tone, with its own line drawing.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/banner

## Install

```sh
npx designme add banner          # HTML, CSS and JS, with the shared core
npx designme add banner --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Banner puts one announcement in front of people: an eyebrow, a title, a line of text, a primary action and a quieter link, on a tint of its tone, with a line drawing on the right. It comes with four drawings of its own.

### When to use it

- When a new feature or a beta is worth a moment of attention, like "Memory that carries across threads" with Turn on memory.
- When a guide or a setup flow should be one click away, without a modal in the way.
- When people need a heads-up, such as planned maintenance, while it still applies.
- When a page has room for one message above its content.

### What it does

- Six tones: `accent` (the default, the accent's own tint), `neutral`, and tints of the tag colours `blue`, `violet`, `green` and `amber`. Each sets the fill, the eyebrow's colour and the drawing's colour. The tint is the banner's edge: it has no border.
- Four drawings, drawn as hairlines in one isometric view, each standing on a dashed floor grid and centred in the same box, so switching between them doesn't jump: `layers` (a stack of plates pulled apart), `steps` (a staircase up to a flag, on a floor that follows its footprint), `tools` (five tool tiles, Slack, GitHub, Linear, Gmail and Apollo, each with its mark on top, all the same size) and `path` (a dotted route across the floor to a raised tile). Pass your own SVG element to `art` instead, or `null` for none.
- Each drawing draws itself in, line by line, when it appears. Under the pointer its parts pull apart a little by their depth. Nothing loops, and there are no blur filters.
- On a wide banner the drawing sits on the right, shown at its own size and cropped by its area, so a narrower banner shows less of it rather than a smaller one.
- In a column narrower than 480px the drawing becomes a strip across the top that fades out before the text starts, so nothing is drawn behind the words.
- `action` is the primary button and `secondary` a quieter underlined link. Each takes an `onClick`, or an `href` to make it a link. On a coloured banner the primary button is white in light mode, with the text colour on it, and the accent in dark mode; on a `neutral` banner it is the accent in both.
- In HTML, a close button is optional: put `<button class="ib bnx-x" aria-label="Dismiss">` inside the banner and it sits in the top right corner. It first sends a cancelable `banner-dismiss` event from the banner, then the banner plays out and is hidden. The demo here has none.
- Text passed as a string crossfades when it changes, so one banner can turn into the next in place. On designme.dev a switcher under the banner flips through four of its styles; the demo goes through them twice and stops.

### Accessibility

- The banner is a region named by `label` (Announcement by default), and the drawing is hidden from screen readers with `aria-hidden`.
- Every text colour is checked on every tone, in Soft and Blueprint, light and dark: 4.5:1 and APCA Lc 60 or more. That includes the primary button, white with the text colour in light mode and the accent in dark mode. The drawing's lines are 3:1 on the fill.
- The optional close button is a real button named "Dismiss". Once the banner is hidden, move the focus somewhere useful in your `banner-dismiss` handler, such as the content the banner sat above.
- With reduced motion the drawing shows complete at once, its parts don't move under the pointer, and the demo on designme.dev doesn't play.

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
  { tone: 'violet', art: 'tools', eyebrow: 'Beta', title: 'Connect your tools in one place', description: 'Linear, GitHub and Slack in one list, with access you can scope for each agent.', action: 'Connect a tool', secondary: 'Read the docs' },
  { tone: 'green', art: 'steps', eyebrow: 'Guide', title: 'Set up your first automation', description: 'Five short steps, about ten minutes. The agent can do most of them for you.', action: 'Start the guide', secondary: 'Maybe later' },
  { tone: 'amber', art: 'path', eyebrow: 'Heads-up', title: 'Maintenance on Sunday, 02:00 UTC', description: 'Agents pause for about an hour, and queued runs pick up where they left off.', action: 'Add to calendar', secondary: 'Status page' }
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

**How do I keep a banner closed across visits?**

Store it yourself. In HTML, listen for `banner-dismiss` and save that it was closed; the next time, leave the banner out of the page.

**Why is the primary button white on a coloured banner?**

In light mode an accent button on a tinted banner blends into the tint, and on the accent's own tint it nearly disappears. A white button with the text colour on it stands out on every tone and keeps the label at full contrast. In dark mode the tint is deep enough for the accent to stand out, so it stays the accent.

**What happens on a phone?**

Below 480px wide the drawing moves to a short strip across the top, shown at six tenths of its size so all of it fits, and the text runs the full width under it.

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
export type BannerArtName = 'layers' | 'steps' | 'tools' | 'path';

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
/* each drawing is 240 by 160, written as plain paths, all in one isometric view on a floor grid, with their drawn box
   centred in it: layers (three plates of a stack, pulled apart, the bottom one standing on the floor), steps (a staircase climbing to a flag, on a floor that
   follows its footprint), tools (five tool tiles, Slack, GitHub, Linear, Gmail and Apollo, each with its mark on top) and
   path (a dotted route across the floor to a raised tile). dm-ln lines draw themselves in, dm-gd are the dashed
   construction lines and the floor, which fade in, and dm-pl faces wear the banner's fill so what is in front hides what
   is behind */
const ART: Record<BannerArtName, ReactElement> = {
  layers: <><g className="dm-gds"><path className="dm-gd" d="M120 51L36.9 99M140.8 63L57.6 111M161.6 75L78.4 123M182.4 87L99.2 135M203.1 99L120 147M120 51L203.1 99M99.2 63L182.4 111M78.4 75L161.6 123M57.6 87L140.8 135M36.9 99L120 147"/></g><g className="dm-gds"><path className="dm-gd" d="M78.4 43L78.4 93M161.6 43L161.6 93M120 67L120 117"/></g><g className="dm-z" style={z(0)}><path className="dm-pl" d="M120 69L161.6 93L161.6 99L120 123L78.4 99L78.4 93Z"/><path className="dm-ln" style={d(0)} pathLength={1} d="M120 69L161.6 93L120 117L78.4 93Z"/><path className="dm-ln" style={d(1)} pathLength={1} d="M161.6 93L161.6 99L120 123L78.4 99L78.4 93"/><path className="dm-ln" style={d(2)} pathLength={1} d="M120 117L120 123"/></g><g className="dm-z" style={z(1)}><path className="dm-pl" d="M120 41L161.6 65L161.6 71L120 95L78.4 71L78.4 65Z"/><path className="dm-ln" style={d(3)} pathLength={1} d="M120 41L161.6 65L120 89L78.4 65Z"/><path className="dm-ln" style={d(4)} pathLength={1} d="M161.6 65L161.6 71L120 95L78.4 71L78.4 65"/><path className="dm-ln" style={d(5)} pathLength={1} d="M120 89L120 95"/></g><g className="dm-z" style={z(2)}><path className="dm-pl" d="M120 13L161.6 37L161.6 43L120 67L78.4 43L78.4 37Z"/><path className="dm-ln" style={d(6)} pathLength={1} d="M120 13L161.6 37L120 61L78.4 37Z"/><path className="dm-ln" style={d(7)} pathLength={1} d="M161.6 37L161.6 43L120 67L78.4 43L78.4 37"/><path className="dm-ln" style={d(8)} pathLength={1} d="M120 61L120 67"/><path className="dm-ln dm-ac" style={d(9)} pathLength={1} d="M120 23.8L142.9 37L120 50.2L97.1 37Z"/></g></>,
  steps: <><g className="dm-gds"><path className="dm-gd" d="M135.6 59L42.1 113M151.2 68L57.6 122M166.8 77L73.2 131M182.4 86L88.8 140M197.9 95L104.4 149M135.6 59L197.9 95M120 68L182.4 104M104.4 77L166.8 113M88.8 86L151.2 122M73.2 95L135.6 131M57.6 104L120 140M42.1 113L104.4 149"/></g><g className="dm-z" style={z(0)}><path className="dm-pl" d="M135.6 21L166.8 39L166.8 95L151.2 104L120 86L120 30Z"/><path className="dm-ln" style={d(0)} pathLength={1} d="M135.6 21L166.8 39L151.2 48L120 30Z"/><path className="dm-ln" style={d(1)} pathLength={1} d="M166.8 39L166.8 95L151.2 104L120 86L120 30"/><path className="dm-ln" style={d(2)} pathLength={1} d="M151.2 48L151.2 104"/><path className="dm-pl" d="M120 44L151.2 62L151.2 104L135.6 113L104.4 95L104.4 53Z"/><path className="dm-ln" style={d(3)} pathLength={1} d="M120 44L151.2 62L135.6 71L104.4 53Z"/><path className="dm-ln" style={d(4)} pathLength={1} d="M151.2 62L151.2 104L135.6 113L104.4 95L104.4 53"/><path className="dm-ln" style={d(5)} pathLength={1} d="M135.6 71L135.6 113"/><path className="dm-pl" d="M104.4 67L135.6 85L135.6 113L120 122L88.8 104L88.8 76Z"/><path className="dm-ln" style={d(6)} pathLength={1} d="M104.4 67L135.6 85L120 94L88.8 76Z"/><path className="dm-ln" style={d(7)} pathLength={1} d="M135.6 85L135.6 113L120 122L88.8 104L88.8 76"/><path className="dm-ln" style={d(8)} pathLength={1} d="M120 94L120 122"/><path className="dm-pl" d="M88.8 90L120 108L120 122L104.4 131L73.2 113L73.2 99Z"/><path className="dm-ln" style={d(9)} pathLength={1} d="M88.8 90L120 108L104.4 117L73.2 99Z"/><path className="dm-ln" style={d(10)} pathLength={1} d="M120 108L120 122L104.4 131L73.2 113L73.2 99"/><path className="dm-ln" style={d(11)} pathLength={1} d="M104.4 117L104.4 131"/></g><g className="dm-z" style={z(2)}><path className="dm-ln dm-ac" style={d(12)} pathLength={1} d="M137.1 30.9V8.9h14l-4 5 4 5h-14"/></g></>,
  tools: <><g className="dm-gds"><path className="dm-gd" d="M120 30.5L26.5 84.5M151.2 48.5L57.6 102.5M182.4 66.5L88.8 120.5M213.5 84.5L120 138.5M120 30.5L213.5 84.5M88.8 48.5L182.4 102.5M57.6 66.5L151.2 120.5M26.5 84.5L120 138.5"/></g><g className="dm-z" style={z(1)}><path className="dm-pl" d="M120 21.5L142.5 34.5L142.5 48.5L120 61.5L97.5 48.5L97.5 34.5Z"/><path className="dm-ln" style={d(0)} pathLength={1} d="M120 21.5L142.5 34.5L120 47.5L97.5 34.5Z"/><path className="dm-ln" style={d(1)} pathLength={1} d="M142.5 34.5L142.5 48.5L120 61.5L97.5 48.5L97.5 34.5"/><path className="dm-ln" style={d(2)} pathLength={1} d="M120 47.5L120 61.5"/><g className="dm-lg" transform="matrix(0.613 -0.354 0.613 0.354 105.278 34.5)"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></g><path className="dm-pl" d="M57.6 57.5L80.2 70.5L80.2 84.5L57.6 97.5L35.1 84.5L35.1 70.5Z"/><path className="dm-ln" style={d(3)} pathLength={1} d="M57.6 57.5L80.2 70.5L57.6 83.5L35.1 70.5Z"/><path className="dm-ln" style={d(4)} pathLength={1} d="M80.2 70.5L80.2 84.5L57.6 97.5L35.1 84.5L35.1 70.5"/><path className="dm-ln" style={d(5)} pathLength={1} d="M57.6 83.5L57.6 97.5"/><g className="dm-lg" transform="matrix(0.613 -0.354 0.613 0.354 42.924 70.5)"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></g><path className="dm-pl" d="M120 57.5L142.5 70.5L142.5 84.5L120 97.5L97.5 84.5L97.5 70.5Z"/><path className="dm-ln" style={d(6)} pathLength={1} d="M120 57.5L142.5 70.5L120 83.5L97.5 70.5Z"/><path className="dm-ln" style={d(7)} pathLength={1} d="M142.5 70.5L142.5 84.5L120 97.5L97.5 84.5L97.5 70.5"/><path className="dm-ln" style={d(8)} pathLength={1} d="M120 83.5L120 97.5"/><g className="dm-lg" transform="matrix(0.613 -0.354 0.613 0.354 105.278 70.5)"><path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"/></g><path className="dm-pl" d="M182.4 57.5L204.9 70.5L204.9 84.5L182.4 97.5L159.8 84.5L159.8 70.5Z"/><path className="dm-ln" style={d(9)} pathLength={1} d="M182.4 57.5L204.9 70.5L182.4 83.5L159.8 70.5Z"/><path className="dm-ln" style={d(10)} pathLength={1} d="M204.9 70.5L204.9 84.5L182.4 97.5L159.8 84.5L159.8 70.5"/><path className="dm-ln" style={d(11)} pathLength={1} d="M182.4 83.5L182.4 97.5"/><g className="dm-lg" transform="matrix(0.613 -0.354 0.613 0.354 167.631 70.5)"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></g><path className="dm-pl" d="M120 93.5L142.5 106.5L142.5 120.5L120 133.5L97.5 120.5L97.5 106.5Z"/><path className="dm-ln" style={d(12)} pathLength={1} d="M120 93.5L142.5 106.5L120 119.5L97.5 106.5Z"/><path className="dm-ln" style={d(13)} pathLength={1} d="M142.5 106.5L142.5 120.5L120 133.5L97.5 120.5L97.5 106.5"/><path className="dm-ln" style={d(14)} pathLength={1} d="M120 119.5L120 133.5"/><g className="dm-lg" transform="matrix(0.613 -0.354 0.613 0.354 105.278 106.5)"><g transform="scale(.663)"><path d="M19.5993 0.0862365L19.605 13.2568C19.6058 15.3375 17.4222 16.6715 15.6079 15.6986L2.58376 8.7153C3.57706 7.05795 4.82616 5.57609 6.27427 4.32386L16.489 13.8945C17.0303 14.4015 17.8835 13.8518 17.6605 13.1398L13.6992 0.493553C15.0326 0.17147 16.4233 0 17.8536 0C18.4428 0 19.0248 0.0296814 19.5993 0.0862365Z"/><path d="M16.0635 36.1087L16.0578 23.0046C16.057 20.9239 18.2407 19.5898 20.0549 20.5627L33.0838 27.5486C32.0838 29.2016 30.8289 30.6786 29.3751 31.925L19.1738 22.3668C18.6326 21.8598 17.7793 22.4095 18.0023 23.1215L21.9486 35.72C20.6338 36.0329 19.263 36.1989 17.8539 36.1989C17.2497 36.1989 16.6523 36.1683 16.0635 36.1087Z"/><path d="M22.0105 16.77L31.4705 6.39392C30.2362 4.92008 28.7742 3.6486 27.1384 2.63702L20.2306 15.8767C19.2709 17.716 20.5871 19.9298 22.6396 19.9288L35.6183 19.923C35.6775 19.3234 35.7082 18.7151 35.7082 18.0996C35.7082 16.6683 35.5436 15.2761 35.2338 13.9406L22.7549 17.9576C22.0526 18.1837 21.5103 17.3187 22.0105 16.77Z"/><path d="M0.0842758 16.3383L13.0237 16.3325C15.0764 16.3317 16.3923 18.5454 15.4327 20.3846L8.56047 33.5561C6.93095 32.547 5.47394 31.2801 4.24344 29.8121L13.653 19.4914C14.1531 18.9427 13.6107 18.0777 12.9084 18.3037L0.485078 22.3029C0.168551 20.954 0 19.5467 0 18.0994C0 17.5051 0.0290814 16.9177 0.0842758 16.3383Z"/></g></g></g></>,
  path: <><g className="dm-gds"><path className="dm-gd" d="M120 26L26.5 80M143.4 39.5L49.9 93.5M166.8 53L73.2 107M190.1 66.5L96.6 120.5M213.5 80L120 134M120 26L213.5 80M96.6 39.5L190.1 93.5M73.2 53L166.8 107M49.9 66.5L143.4 120.5M26.5 80L120 134"/></g><g className="dm-z" style={z(0)}><path className="dm-dt" d="M49.9 80L73.2 93.5L120 66.5L166.8 93.5L190.1 80"/><path className="dm-ln" style={d(0)} pathLength={1} d="M49.9 74L60.2 80L49.9 86L39.5 80Z"/></g><g className="dm-z" style={z(2)}><path className="dm-pl" d="M190.1 51L205.7 60L205.7 80L190.1 89L174.6 80L174.6 60Z"/><path className="dm-ln dm-ac" style={d(1)} pathLength={1} d="M190.1 51L205.7 60L190.1 69L174.6 60Z"/><path className="dm-ln" style={d(2)} pathLength={1} d="M205.7 60L205.7 80L190.1 89L174.6 80L174.6 60"/><path className="dm-ln" style={d(3)} pathLength={1} d="M190.1 69L190.1 89"/></g></>
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
