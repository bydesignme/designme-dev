'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useCarousel } from '../../lib/carousel';
import { useControllable, useReducedMotion } from '../../lib/hooks';
import { pixelField, type PixelField } from '../../lib/pixels';
import { Icon } from '../../lib/icons';
import { Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
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
