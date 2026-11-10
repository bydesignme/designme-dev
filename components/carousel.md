# Carousel

> Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/carousel

## Install

```sh
npx designme add carousel          # HTML, CSS and JS, with the shared core
npx designme add carousel --react  # React 19 component and its CSS
npx designme add carousel --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/carousel.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/carousel.json  # Astro
```

## About

One carousel with two types, picked with the switch under it. Variants are the pictures an agent made from one brief, in a panel with a title, to browse and keep one. Images is a gallery of pictures with their captions. Both run on the same native scroll-snap track: each slide is a framed picture with its caption, the next one peeking in, with Previous and Next disabled at the ends and a row of dots under the track, the current one drawn longer. A picture sliding into view comes into focus: it is soft and faded while it is mostly out of view and sharpens as it arrives. Blueprint never blurs, so there a veil wipes off it from the left. It doesn't play on its own.

### When to use it

- Variants: when the agent makes several versions of the same picture (a cover image, an illustration, a product shot) and a person picks one, as they arrive one by one, each able to fail on its own.
- Images: for a set of pictures people look at one by one, like generated images, product shots, a moodboard or screenshots of a design, each with a caption.
- Where a row of pictures should take one line of the page and let people swipe through the rest.

### What it does

- `type="variants"` or `type="images"`; the rest of the props are shared, apart from each type's own.
- The track scrolls natively: a swipe, a trackpad, Shift and the mouse wheel all move it, and it snaps to each slide. A mouse can also drag it like a finger, and the click a drag ends with is ignored.
- Slides that can't reach the start of the track (narrow ones near the end) share one resting place, so there is a dot for each place the track can rest and no arrow press or dot ever goes nowhere.
- Slide widths: `slideWidth` ("80%" for images and "84%" for variants let the next one peek in, "100%" shows one at a time, a number is pixels), and each image's `width` overrides it, so slides can mix sizes; `height` gives every picture one height. `align="center"` rests each slide in the middle of the track, `gap` sets the space between slides, and `arrows={false}` and `dots={false}` leave a bare swipeable track.
- Variants have four states: queued (an empty frame with an image mark and a Queued tag), generating (the frame builds up out of pixels in the picture's colours: a sparse grid of cells twinkles in, a few in the accent, then the picture arrives as coarse blocks that refine in four steps, from 6×4 to 48×32, each settling in its own order, with a Making tag and a readout of how far along it is), ready (the picture comes into focus over the last of the pixels, with what sets it apart and how long it took) and failed (the pixels glitch, lose their colour and fall apart into the reason and a Retry button, with `onRetry`).
- The pixels take their colours from the picture's `src` when the page can read it (same origin, or served with CORS) and otherwise from its `placeholder` gradient, so a picture without a `src` still builds up in its own colours. Soft rounds the cells and Blueprint keeps them square on a hairline grid. Pass a variant's `progress` (0 to 1) if the model reports it; without it the pixels pace themselves over about three seconds, then shimmer until the variant is ready. The canvas only draws while it is on screen and the tab is open.
- Keeping a variant fills its button, steps its frame's edge up and dims the others; pressing it again lets it go. The line under the title follows the work: "Making 4 variants, 1 ready", then "3 ready, 1 failed", then "Keeping Variant C".
- Each picture takes `src`, `alt` and a `placeholder`, a CSS background like a gradient of its colours, drawn under it while it loads or in place of it. A variant's `content` shows anything else instead.
- The first slide in view is controlled with `index` and `onIndexChange`, which fires once the track settles, and the kept variant with `kept` and `onKeptChange`.
- With reduced motion the track jumps instead of gliding, nothing blurs in, and a generating variant is a still mosaic of the picture's colours until it lands.

### Accessibility

- Each type is a region with aria-roledescription="carousel" and a label (the title for variants, "Gallery" by default for images); each slide is a group with aria-roledescription="slide" and its place, like "3 of 6", and holds the picture as an image with its `alt`.
- The track can take the focus: Left and Right move it one place, Home and End go to the ends, and for variants Enter keeps the one in view.
- The arrows are buttons named after what they move to ("Previous picture", "Next variant"); each dot is a button named after its slide ("Show Fresh snow", "Go to Variant C") with aria-current on the current one. Keep has aria-pressed.
- The pixel canvas is hidden from screen readers: the Making tag and the live region ("Variant A ready", "Variant D failed") carry what happens.
- A polite live region says which slide is first in view once the track settles, and for variants when one arrives or fails and which one is kept.
- The keyboard focus ring is the quiet grey ring; a mouse or touch never shows one.

## Usage in React

```tsx
import { Carousel } from '@/components/designme/carousel/Carousel';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component, with its Variants / Images switch under it.
// Variants: four drafts of a cover image build up out of pixels at once (the last one fails), then the person flips to the third and keeps it.
// Images: the next two pictures, the last one from the dots, then back one. Each picture here is a gradient of its colours;
// pass `src` for real images (designme.dev lays photos from Pexels over the same gradients).
import { useEffect, useRef, useState } from 'react';
import { Carousel, type CarouselImage, type Variant } from './Carousel';
import { Seg } from '../lib/motion';
import { Demo } from '../lib/Demo';
import { useStory, useWait } from '../lib/useScript';

const START: Variant[] = [
  { key: 'a', label: 'Variant A', meta: 'Amber haze · 9s', status: 'queued', image: { alt: 'Forested ridges in silhouette under an amber sky', placeholder: 'linear-gradient(#ffb35c,#d9733a 45%,#3a2116 70%)' } },
  { key: 'b', label: 'Variant B', meta: 'Alpenglow · 11s', status: 'queued', image: { alt: 'Rocky peaks lit pink by the low sun under a pale sky', placeholder: 'linear-gradient(#a9bccb,#e08a5c 50%,#3a2f2a 75%)' } },
  { key: 'c', label: 'Variant C', meta: 'Lake at dusk · 7s', status: 'queued', image: { alt: 'Mountains round a lake in a golden haze, dark firs in front', placeholder: 'linear-gradient(#e6b46a,#b88650 50%,#1f1810 80%)' } },
  { key: 'd', label: 'Variant D', meta: 'Valley light · 14s', status: 'queued', image: { alt: 'Sun rays over a green valley with a winding road, mountains all round', placeholder: 'linear-gradient(#c9b88f,#5f8f86 45%,#2f5a3a)' } }
];
const IMAGES: CarouselImage[] = [
  { key: 'staircase', title: 'Spiral staircase', caption: 'Bronze, cream and slate', alt: 'Looking down a spiral staircase that coils in rings of bronze and cream', placeholder: 'linear-gradient(135deg,#8a5a32,#d9a46a 50%,#5f6670)' },
  { key: 'minaret', title: 'Minaret at sunset', caption: 'Sand, ochre and haze', alt: 'A stone minaret above a plain of golden fields at sunset', placeholder: 'linear-gradient(#cfc6bd,#d59a52 45%,#7a4f2c)' },
  { key: 'cat', title: 'Cat in the apple tree', caption: 'Sky blue, leaf green and ginger', alt: 'A ginger and white cat in an apple tree, reaching a paw toward an apple', placeholder: 'linear-gradient(135deg,#3f8fe0,#7fb84a 50%,#e6a35a)' },
  { key: 'snow', title: 'Fresh snow', caption: 'Snow white, sky blue and black', alt: 'A snowboarder in a white jacket and blue goggles raising a hand among frosted trees', placeholder: 'linear-gradient(#2f6fd6,#e8eef5 45%,#c9d3dd)' },
  { key: 'samarkand', title: 'Shah-i-Zinda', caption: 'Turquoise, sand and red', alt: 'A woman in a red dress walking down a lane of turquoise-tiled tombs in Samarkand', placeholder: 'linear-gradient(135deg,#1f8c9a,#d8b48a 50%,#b02a2a)' },
  { key: 'signpost', title: 'Beach signpost', caption: 'Turquoise, coral and peach', alt: 'A painted wooden signpost on a sandy cliff above a turquoise sea', placeholder: 'linear-gradient(#5aa9e6,#2cc3c9 50%,#f2b08a)' }
];

export default function CarouselDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [type, setType] = useState<'variants' | 'images'>('variants');
  const [variants, setVariants] = useState(START);
  const [kept, setKept] = useState<string | null>(null);
  const set = (key: string, v: Partial<Variant>) => setVariants(vs => vs.map(x => x.key === key ? { ...x, ...v } : x));
  // how long each one takes: the pixels pace themselves over about three seconds, so a quicker one lands over its last steps
  const TAKES = [3000, 3400, 2700, 1600];
  const make = async (key: string, i: number, fail = false) => {
    set(key, { status: 'generating' }); await wait(TAKES[i]);
    set(key, fail ? { status: 'failed' } : { status: 'ready' });
  };
  // the agent makes all four at once, each at its own pace; the last one fails once, halfway
  useEffect(() => { START.forEach((v, i) => { void (async () => { await wait(500 + i * 350); await make(v.key, i, v.key === 'd'); })(); }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // the story plays the drafts; once you switch, the carousel is yours
  useStory(ref, async ({ wait, press }) => {
    await wait(7200);
    press('[aria-label="Next variant"]'); await wait(1000);
    press('[aria-label="Next variant"]'); await wait(1000);
    press('.dm-crs-s:nth-child(3) .dm-crs-keep');
  });
  return (
    <Demo ref={ref} switcher={<Seg label="Type" value={type} onChange={setType} options={[{ value: 'variants', label: 'Variants' }, { value: 'images', label: 'Images' }]} />}>
      {type === 'variants'
        ? <Carousel type="variants" title="Cover image drafts" variants={variants} kept={kept} onKeptChange={setKept} onRetry={key => { void make(key, 0); }} />
        : <Carousel type="images" images={IMAGES} />}
    </Demo>
  );
}
```

## Props

### CarouselBaseProps

The picture. Without it, `placeholder` stands in */ src?: string; /** What the picture shows, for screen readers */ alt: string; /** The caption, like "Spiral staircase" */ title: string; /** A quieter line under the title, like "Plum, coral and amber" */ caption?: string; /** A CSS background drawn under the picture while it loads (or instead of it), like a gradient of its colours */ placeholder?: string; /** This slide's width, overriding `slideWidth`, like 220 or "40%" */ width?: number | string; } export interface VariantImage { /** The picture. Without it, `placeholder` stands in */ src?: string; /** What the picture shows, for screen readers */ alt: string; /** A CSS background drawn under the picture while it loads (or instead of it), like a gradient of its colours */ placeholder?: string; } export interface Variant { key: string; /** Like "Variant A" */ label: string; /** What sets it apart and how long it took, like "Alpenglow · 11s" */ meta?: string; /** queued shows an empty frame; generating builds the picture up out of pixels in its colours; ready brings it into focus over them; failed glitches the pixels out and shows the error and Retry */ status: 'queued' | 'generating' | 'ready' | 'failed'; /** How far along a generating variant is, from 0 to 1, if the model reports it. Without it the pixels pace themselves over about three seconds, then shimmer until the variant is ready */ progress?: number; /** The picture, shown once ready: it comes into focus in a 3:2 frame */ image?: VariantImage; /** Anything else to show once ready, in place of `image` */ content?: ReactNode; /** Why it failed. Defaults to "The image model timed out" */ error?: string; } /** What both types take

| Prop | Type | What it does |
| --- | --- | --- |
| `index` (optional) | `number` | The first slide in view, from 0 |
| `defaultIndex` (optional) | `number` |  |
| `onIndexChange` (optional) | `(index: number) => void` | Called with the first slide in view once the track settles somewhere new |
| `slideWidth` (optional) | `number \| string` | Each slide's width: "80%" for images and "84%" for variants (the next one peeks in), "100%" shows one at a time, a number is pixels |
| `align` (optional) | `'start' \| 'center'` | Where a slide rests: at the start of the track (the default) or in its middle |
| `gap` (optional) | `number` | The space between slides, in pixels (16 for images, 12 for variants) |
| `arrows` (optional) | `boolean` | Previous and Next (true) |
| `dots` (optional) | `boolean` | A dot for each place the track can rest, under it (true) |
| `className` (optional) | `string` |  |

### CarouselVariantsProps

The first slide in view, from 0 */ index?: number; defaultIndex?: number; /** Called with the first slide in view once the track settles somewhere new */ onIndexChange?: (index: number) => void; /** Each slide's width: "80%" for images and "84%" for variants (the next one peeks in), "100%" shows one at a time, a number is pixels */ slideWidth?: number | string; /** Where a slide rests: at the start of the track (the default) or in its middle */ align?: 'start' | 'center'; /** The space between slides, in pixels (16 for images, 12 for variants) */ gap?: number; /** Previous and Next (true) */ arrows?: boolean; /** A dot for each place the track can rest, under it (true) */ dots?: boolean; className?: string; } /** `type="variants"`: the drafts an agent made from one brief, in a panel with its title, to browse and keep one

| Prop | Type | What it does |
| --- | --- | --- |
| `type` | `'variants'` |  |
| `title` | `string` | Like "Cover image drafts" |
| `variants` | `Variant[]` |  |
| `subtitle` (optional) | `string` | The line under the title. Defaults to "Making 4 variants, 1 ready", then "3 ready, 1 failed", then "Keeping Variant C" |
| `kept` (optional) | `string \| null` | The kept variant's key, or null |
| `defaultKept` (optional) | `string \| null` |  |
| `onKeptChange` (optional) | `(key: string \| null) => void` |  |
| `onRetry` (optional) | `(key: string) => void` | Adds Retry to a failed variant |

Also takes the props of `CarouselBaseProps`.

### CarouselImagesProps

Like "Cover image drafts" */ title: string; variants: Variant[]; /** The line under the title. Defaults to "Making 4 variants, 1 ready", then "3 ready, 1 failed", then "Keeping Variant C" */ subtitle?: string; /** The kept variant's key, or null */ kept?: string | null; defaultKept?: string | null; onKeptChange?: (key: string | null) => void; /** Adds Retry to a failed variant */ onRetry?: (key: string) => void; } /** `type="images"`: a gallery of pictures with their captions

| Prop | Type | What it does |
| --- | --- | --- |
| `type` | `'images'` |  |
| `images` | `CarouselImage[]` |  |
| `label` (optional) | `string` | The gallery's name for screen readers. Defaults to "Gallery" |
| `height` (optional) | `number` | One height for every picture, in pixels, for slides of mixed widths. Without it each picture is 3:2 |

Also takes the props of `CarouselBaseProps`.

## Usage in Astro

```astro
---
import Carousel from '../components/designme/carousel/Carousel.astro';
---
<Carousel />
<Carousel data-style="soft" class="my-class" />
```
It plays its demo; change `carousel.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Where do the pictures in the demo come from?**

They are photos from Pexels, free to use under the Pexels License (art/README.md in the repository links each one). They are not part of what you install: installed components draw each picture as a gradient of its colours, and on designme.dev the photos are laid over those gradients. Pass your own `src` for real pictures.

**Does it play on its own?**

No. Pictures are something to look at and compare, so it only moves when someone moves it.

**How do I show one picture at a time?**

Set `slideWidth="100%"`. In the HTML version, set `--dm-w:100%` on the carousel (`.crs-c`).

**How do I retry a failed variant?**

Pass `onRetry`. It gets the variant's key; set that variant's `status` back to "generating" and then to "ready" or "failed".

**Where did Variant carousel and Image carousel go?**

They are this component now: Variants is the old Variant carousel and Images the old Image carousel, on the same track. Their old pages lead here.

## Source

`Carousel.tsx`, as `npx designme add carousel --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useCarousel } from '../lib/carousel';
import { useControllable, useReducedMotion } from '../lib/hooks';
import { pixelField, type PixelField } from '../lib/pixels';
import { Icon } from '../lib/icons';
import { Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './carousel.css';

export interface CarouselImage {
  key: string;
  /** The picture. Without it, `placeholder` stands in */
  src?: string;
  /** What the picture shows, for screen readers */
  alt: string;
  /** The caption, like "Spiral staircase" */
  title: string;
  /** A quieter line under the title, like "Plum, coral and amber" */
  caption?: string;
  /** A CSS background drawn under the picture while it loads (or instead of it), like a gradient of its colours */
  placeholder?: string;
  /** This slide's width, overriding `slideWidth`, like 220 or "40%" */
  width?: number | string;
}

export interface VariantImage {
  /** The picture. Without it, `placeholder` stands in */
  src?: string;
  /** What the picture shows, for screen readers */
  alt: string;
  /** A CSS background drawn under the picture while it loads (or instead of it), like a gradient of its colours */
  placeholder?: string;
}

export interface Variant {
  key: string;
  /** Like "Variant A" */
  label: string;
  /** What sets it apart and how long it took, like "Alpenglow · 11s" */
  meta?: string;
  /** queued shows an empty frame; generating builds the picture up out of pixels in its colours; ready brings it into focus
      over them; failed glitches the pixels out and shows the error and Retry */
  status: 'queued' | 'generating' | 'ready' | 'failed';
  /** How far along a generating variant is, from 0 to 1, if the model reports it. Without it the pixels pace themselves over
      about three seconds, then shimmer until the variant is ready */
  progress?: number;
  /** The picture, shown once ready: it comes into focus in a 3:2 frame */
  image?: VariantImage;
  /** Anything else to show once ready, in place of `image` */
  content?: ReactNode;
  /** Why it failed. Defaults to "The image model timed out" */
  error?: string;
}

/** What both types take */
export interface CarouselBaseProps {
  /** The first slide in view, from 0 */
  index?: number;
  defaultIndex?: number;
  /** Called with the first slide in view once the track settles somewhere new */
  onIndexChange?: (index: number) => void;
  /** Each slide's width: "80%" for images and "84%" for variants (the next one peeks in), "100%" shows one at a time, a number is pixels */
  slideWidth?: number | string;
  /** Where a slide rests: at the start of the track (the default) or in its middle */
  align?: 'start' | 'center';
  /** The space between slides, in pixels (16 for images, 12 for variants) */
  gap?: number;
  /** Previous and Next (true) */
  arrows?: boolean;
  /** A dot for each place the track can rest, under it (true) */
  dots?: boolean;
  className?: string;
}

/** `type="variants"`: the drafts an agent made from one brief, in a panel with its title, to browse and keep one */
export interface CarouselVariantsProps extends CarouselBaseProps {
  type: 'variants';
  /** Like "Cover image drafts" */
  title: string;
  variants: Variant[];
  /** The line under the title. Defaults to "Making 4 variants, 1 ready", then "3 ready, 1 failed", then "Keeping Variant C" */
  subtitle?: string;
  /** The kept variant's key, or null */
  kept?: string | null;
  defaultKept?: string | null;
  onKeptChange?: (key: string | null) => void;
  /** Adds Retry to a failed variant */
  onRetry?: (key: string) => void;
}

/** `type="images"`: a gallery of pictures with their captions */
export interface CarouselImagesProps extends CarouselBaseProps {
  type: 'images';
  images: CarouselImage[];
  /** The gallery's name for screen readers. Defaults to "Gallery" */
  label?: string;
  /** One height for every picture, in pixels, for slides of mixed widths. Without it each picture is 3:2 */
  height?: number;
}

export type CarouselProps = CarouselVariantsProps | CarouselImagesProps;

const size = (v: number | string | undefined) => typeof v === 'number' ? `${v}px` : v;
const bg = (src?: string, placeholder?: string) => [src && `url("${src}")`, placeholder].filter(Boolean).join(', ') || undefined;

/** One carousel, two types, on the same native scroll-snap track: a swipe, a trackpad, a mouse drag, the arrows, the dots and
    the keys all move it, and each slide is a framed picture with its caption, the next one peeking in. A picture comes into
    focus as it slides into view (Blueprint wipes a veil off it instead). `type="variants"` shows the drafts an agent made,
    each queued, generating, ready or failed, to keep one; `type="images"` is a gallery. */
export function Carousel(props: CarouselProps) {
  return props.type === 'images' ? <Images {...props} /> : <Variants {...props} />;
}

function Nav({ k, noun }: { k: ReturnType<typeof useCarousel>; noun: string }) {
  return (
    <>
      <Tip label="Previous"><button type="button" className="dm-pill dm-line dm-crs-nav dm-crs-prev" aria-label={`Previous ${noun}`} disabled={k.at === 0} onClick={() => k.go(k.at - 1)}><Icon name="chev-l" /></button></Tip>
      <Tip label="Next"><button type="button" className="dm-pill dm-line dm-crs-nav dm-crs-next" aria-label={`Next ${noun}`} disabled={k.at === k.stops.length - 1} onClick={() => k.go(k.at + 1)}><Icon name="chev-r" /></button></Tip>
    </>
  );
}

function Dots({ k, label }: { k: ReturnType<typeof useCarousel>; label: (slide: number) => string }) {
  if (k.stops.length < 2) return null;
  return <div className="dm-crs-dots">{k.stops.map((s, j) => <button type="button" key={s.i} aria-label={label(s.i)} aria-current={j === k.at} onClick={() => k.go(j)} />)}</div>;
}

const vars = (p: CarouselBaseProps & { height?: number }) => ({
  '--dm-w': size(p.slideWidth), '--dm-gap': p.gap != null ? `${p.gap}px` : undefined, '--dm-h': p.height != null ? `${p.height}px` : undefined
} as CSSProperties);

function Images(p: CarouselImagesProps) {
  const { images, index, defaultIndex = 0, onIndexChange, label = 'Gallery', align = 'start', arrows = true, dots = true, className } = p;
  const tr = useRef<HTMLDivElement>(null);
  const n = images.length;
  const k = useCarousel(tr, { count: n, index, defaultIndex, onIndexChange });
  const said = k.settled != null ? images[k.settled] : undefined;
  return (
    <div data-dm="" className={cx('dm-crs-c', className)} data-type="images" data-align={align === 'center' ? 'center' : undefined} style={vars(p)} role="region" aria-roledescription="carousel" aria-label={label}>
      {arrows && <div className="dm-crs-h"><Nav k={k} noun="picture" /></div>}
      <div ref={tr} className={cx('dm-crs-tr', k.dragging && 'dm-drag')} role="group" tabIndex={0} aria-label="Pictures" {...k.trackProps}>
        {images.map((im, i) => (
          <div key={im.key} className={cx('dm-crs-s', k.inView[i] && 'dm-in')} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`}
            style={im.width != null ? { '--dm-w': size(im.width) } as CSSProperties : undefined}>
            <figure className="dm-crs-fig">
              <div className="dm-crs-pic" role="img" aria-label={im.alt} style={{ backgroundImage: bg(im.src, im.placeholder) }} />
              <figcaption className="dm-crs-cap"><b>{im.title}</b>{im.caption != null && <span className="dm-muted">{im.caption}</span>}</figcaption>
            </figure>
          </div>
        ))}
      </div>
      {dots && <Dots k={k} label={i => `Show ${images[i]?.title}`} />}
      <p className="dm-crs-sr" aria-live="polite">{said ? `${said.title}, ${(k.settled ?? 0) + 1} of ${n}` : ''}</p>
    </div>
  );
}

function Variants(p: CarouselVariantsProps) {
  const { title, variants, subtitle, kept, defaultKept = null, onKeptChange, index, defaultIndex = 0, onIndexChange, onRetry, align = 'start', arrows = true, dots = true, className } = p;
  const [keep, setKeep] = useControllable(kept, defaultKept, onKeptChange);
  const tr = useRef<HTMLDivElement>(null);
  const n = variants.length;
  const toggle = (v: Variant | undefined) => { if (v?.status === 'ready') setKeep(keep === v.key ? null : v.key); };
  // Enter on the track keeps the draft in view
  const k = useCarousel(tr, { count: n, index, defaultIndex, onIndexChange, onKey: (e, slide) => { if (e.key === 'Enter') { e.preventDefault(); toggle(variants[slide]); } } });
  // each change worth hearing goes to a polite live region: a variant arriving or failing, one kept, the track settling
  const [said, setSaid] = useState('');
  const was = useRef(variants.map(v => v.status));
  useEffect(() => {
    variants.forEach((v, i) => { if (was.current[i] !== v.status && (v.status === 'ready' || v.status === 'failed')) setSaid(`${v.label} ${v.status === 'ready' ? 'ready' : 'failed'}`); });
    was.current = variants.map(v => v.status);
  }, [variants]);
  const keptRef = useRef(keep);
  useEffect(() => { if (keptRef.current !== keep) setSaid(keep ? `Kept ${variants.find(v => v.key === keep)?.label}` : 'Nothing kept'); keptRef.current = keep; }, [keep]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => { if (k.settled != null && variants[k.settled]) setSaid(`${variants[k.settled].label}, ${k.settled + 1} of ${n}`); }, [k.settled]); // eslint-disable-line react-hooks/exhaustive-deps
  const ready = variants.filter(v => v.status === 'ready').length, bad = variants.filter(v => v.status === 'failed').length, busy = variants.some(v => v.status === 'queued' || v.status === 'generating');
  const line = subtitle ?? (keep ? `Keeping ${variants.find(v => v.key === keep)?.label}` : busy ? `Making ${n} variants, ${ready} ready` : `${ready} ready${bad ? `, ${bad} failed` : ''}`);
  return (
    <div data-dm="" className={cx('dm-crs-c dm-panel', keep && 'dm-kept', className)} data-type="variants" data-align={align === 'center' ? 'center' : undefined} style={vars(p)} role="region" aria-roledescription="carousel" aria-label={title}>
      <div className="dm-crs-h">
        <div className="dm-crs-t"><b>{title}</b><Swap className="dm-muted dm-crs-sub">{line}</Swap></div>
        {arrows && <Nav k={k} noun="variant" />}
      </div>
      <div ref={tr} className={cx('dm-crs-tr', k.dragging && 'dm-drag')} role="group" tabIndex={0} aria-label="Variants. Enter keeps the one in view" {...k.trackProps}>
        {variants.map((v, i) => (
          <div key={v.key} className={cx('dm-crs-s', keep === v.key && 'dm-kept', k.inView[i] && 'dm-in')} role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${n}`}>
            <VariantFigure v={v} kept={keep === v.key} onKeep={() => toggle(v)} onRetry={onRetry} />
          </div>
        ))}
      </div>
      {dots && <Dots k={k} label={i => `Go to ${variants[i]?.label}`} />}
      <p className="dm-crs-sr" aria-live="polite">{said}</p>
    </div>
  );
}

/** One draft: its frame and its caption. While it is generating the frame builds up out of pixels (lib/pixels): the canvas
    stays through the picture coming into focus over it, and through the glitch a failure starts with, then goes. The loop
    runs only while the carousel is on screen (or near it) and the tab is open. With reduced motion the frame is a still mosaic of the
    picture's colours until it lands */
function VariantFigure({ v, kept, onKeep, onRetry }: { v: Variant; kept: boolean; onKeep: () => void; onRetry?: (key: string) => void }) {
  const reduce = useReducedMotion();
  const cv = useRef<HTMLCanvasElement>(null), meta = useRef<HTMLSpanElement>(null), field = useRef<PixelField | null>(null);
  // what the frame is doing as the status moves on: landing (the picture focusing in over the pixels) or glitching out
  const [prev, setPrev] = useState(v.status), [after, setAfter] = useState<'none' | 'land' | 'glitch'>('none');
  if (prev !== v.status) { setPrev(v.status); setAfter(prev === 'generating' && field.current ? v.status === 'ready' ? 'land' : v.status === 'failed' && !reduce ? 'glitch' : 'none' : 'none'); }
  const building = v.status === 'generating' || after === 'glitch', px = building || after === 'land';
  const live = useRef({ building, progress: v.progress });
  live.current = { building, progress: v.progress };
  useEffect(() => { if (after !== 'land') return; const t = setTimeout(() => setAfter('none'), 1000); return () => clearTimeout(t); }, [after]);
  useEffect(() => { if (after === 'glitch') field.current?.fail().then(() => setAfter('none')); }, [after]);
  useEffect(() => {
    const el = cv.current; if (!px || !el) return;
    const say = (p: number, phase: string) => { if (meta.current) meta.current.textContent = `${phase} · ${p}%`; };
    const f = pixelField(el, { gradient: v.image?.placeholder, src: v.image?.src, onProgress: say });
    field.current = f;
    if (meta.current) meta.current.textContent = 'Making';
    if (!f) return;
    if (reduce) { f.still(); return () => { field.current = null; }; }
    let raf = 0, last = 0, seen = true;
    const tick = (t: number) => {
      raf = 0; if (!seen || document.hidden || !live.current.building) { last = 0; return; }
      const dt = last ? Math.min(64, t - last) : 16; last = t;
      // with a reported progress the pixels catch up with it, at up to twice their own pace, and never run ahead of it
      const p = live.current.progress;
      f.step(p == null ? dt : Math.max(0, Math.min(dt * 2, p * f.end - f.t)));
      raf = requestAnimationFrame(tick);
    };
    const wake = () => { if (!raf && seen && !document.hidden && live.current.building) raf = requestAnimationFrame(tick); };
    const io = new IntersectionObserver(es => { seen = es[es.length - 1].isIntersecting; wake(); }, { rootMargin: '200px 0px' });
    // the track as a whole, not the canvas: a draft off to the side of it keeps building while the carousel is on screen
    io.observe(el.closest('.dm-crs-tr') ?? el); document.addEventListener('visibilitychange', wake); wake();
    return () => { cancelAnimationFrame(raf); io.disconnect(); document.removeEventListener('visibilitychange', wake); field.current = null; };
  }, [px, reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  const failed = v.status === 'failed' && after !== 'glitch';
  return (
    <figure className="dm-crs-fig">
      {failed
        ? <div className="dm-crs-pv dm-fail"><Icon name="alert" /><b>Couldn't make this picture</b><span className="dm-muted">{v.error ?? 'The image model timed out'}</span>{onRetry && <button type="button" className="dm-pill dm-line dm-sm" onClick={() => onRetry(v.key)}><Icon name="refresh" size="xs" />Retry</button>}</div>
        : <div className={cx('dm-crs-pv', building && 'dm-gen')}>
            {v.status !== 'ready' && <Icon name="image" className="dm-ph" />}
            {px && <canvas ref={cv} className="dm-crs-px" aria-hidden="true" />}
            {v.status === 'ready' && (v.image ? <span className="dm-crs-img" role="img" aria-label={v.image.alt} style={{ backgroundImage: bg(v.image.src, v.image.placeholder) }} />
              : <div className="dm-enter" style={{ display: 'contents' }}>{v.content}</div>)}
          </div>}
      <figcaption className="dm-crs-f">
        <div><b>{v.label}</b>{v.status === 'generating' ? <span key="gen" ref={meta} className="dm-muted" /> : <span className="dm-muted">{v.status === 'queued' ? 'Waiting' : v.meta}</span>}</div>
        {v.status === 'ready'
          ? <button type="button" className="dm-pill dm-line dm-sm dm-crs-keep" aria-pressed={kept} onClick={onKeep}>{kept ? <><Icon name="check" size="xs" />Kept</> : 'Keep'}</button>
          : v.status === 'failed' ? <span className="dm-tag dm-bad">Failed</span> : v.status === 'generating' ? <span className="dm-tag"><Spin />Making</span> : <span className="dm-tag">Queued</span>}
      </figcaption>
    </figure>
  );
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Badge](https://designme.dev/components/badge.md): Labels for plans and status, with a dot, an icon or a remove button.
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

All components: https://designme.dev/llms.txt
