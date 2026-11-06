'use client';
import { useCallback, useEffect, useRef, useState, type KeyboardEvent, type MouseEvent, type PointerEvent, type RefObject } from 'react';
import { useIsoLayoutEffect, useReducedMotion } from './hooks';

/** Where the track can rest: its scroll position and the first slide in view there */
export interface CarouselStop { x: number; i: number }

export interface CarouselOptions {
  /** How many slides the track holds */
  count: number;
  /** The first slide in view, from 0. Leave it out to let the carousel keep it */
  index?: number;
  defaultIndex?: number;
  /** Called with the first slide in view once the track settles somewhere new */
  onIndexChange?: (index: number) => void;
  /** Any other key pressed on the track (Left, Right, Home and End are taken) */
  onKey?: (e: KeyboardEvent<HTMLDivElement>, slide: number) => void;
}

/** The parts around a native scroll-snap track, shared by Carousel's two types. The track scrolls by itself, so a
    swipe, a trackpad and the browser's own scrolling all work; this keeps the rest in step with it:
    - its stops: where each slide snaps (start or centre, from the slide's scroll-snap-align), with slides that share one
      (narrow slides near the end) folded into a single stop, so no dot or arrow press ever goes nowhere
    - `go(stop)` for the arrows and the dots, and Left, Right, Home and End on the track; it scrolls smoothly, or jumps with
      reduced motion
    - a mouse drags the track like a finger; the click a drag ends with is swallowed
    - `inView[i]`, true for each slide that is at least 70% in view (the CSS brings it into focus), and `settled`, the first
      slide of the stop the track last came to rest on, for a polite live region */
export function useCarousel(track: RefObject<HTMLDivElement | null>, { count, index, defaultIndex = 0, onIndexChange, onKey }: CarouselOptions) {
  const reduce = useReducedMotion();
  const [stops, setStops] = useState<CarouselStop[]>([{ x: 0, i: 0 }]);
  const [at, setAt] = useState(0);
  const [inView, setInView] = useState<boolean[]>([]);
  const [settled, setSettled] = useState<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const live = useRef({ stops, at, reported: index ?? defaultIndex });
  live.current.stops = stops; live.current.at = at;
  const max = () => { const t = track.current; return t ? Math.max(0, t.scrollWidth - t.clientWidth) : 0; };

  const measure = useCallback(() => {
    const t = track.current; if (!t) return;
    const pad = parseFloat(getComputedStyle(t).scrollPaddingLeft) || 0, w = t.clientWidth, m = Math.max(0, t.scrollWidth - w);
    const out: CarouselStop[] = [];
    (Array.from(t.children) as HTMLElement[]).forEach((s, i) => {
      const mid = getComputedStyle(s).scrollSnapAlign.includes('center');
      const x = Math.round(Math.max(0, Math.min(m, mid ? s.offsetLeft + s.offsetWidth / 2 - w / 2 : s.offsetLeft - pad)));
      if (!out.length || Math.abs(x - out[out.length - 1].x) > 2) out.push({ x, i });
    });
    const next = out.length ? out : [{ x: 0, i: 0 }];
    setStops(prev => prev.length === next.length && prev.every((p, j) => p.x === next[j].x && p.i === next[j].i) ? prev : next);
  }, [track]);
  useIsoLayoutEffect(() => {
    measure(); const t = track.current; if (!t) return;
    const ro = new ResizeObserver(measure); ro.observe(t);
    return () => ro.disconnect();
  }, [measure, count]);
  useEffect(() => { setAt(a => Math.min(a, stops.length - 1)); }, [stops]);

  const stopOf = (slide: number, list = live.current.stops) => { let j = 0; list.forEach((s, k) => { if (s.i <= slide) j = k; }); return j; };
  const go = useCallback((j: number, smooth = true) => {
    const t = track.current, list = live.current.stops; if (!t) return;
    const k = Math.max(0, Math.min(list.length - 1, j)); setAt(k);
    if (Math.abs(t.scrollLeft - list[k].x) < 2) { setDragging(false); return; }
    t.scrollTo({ left: list[k].x, behavior: smooth && !reduce ? 'smooth' : 'auto' });
  }, [track, reduce]);

  // the first slide in view starts where it was asked to, without a glide; a change of `index` from outside glides there
  const placed = useRef(false);
  useEffect(() => {
    if (stops.length < 2 && count > 1) return;
    const want = index ?? (placed.current ? null : defaultIndex);
    if (want == null) return;
    const j = stopOf(want, stops);
    if (j !== live.current.at || !placed.current) go(j, placed.current);
    placed.current = true;
  }, [index, stops]); // eslint-disable-line react-hooks/exhaustive-deps

  const near = () => {
    const t = track.current!, list = live.current.stops, x = t.scrollLeft;
    if (x >= max() - 2) return list.length - 1;
    let best = 0; list.forEach((s, j) => { if (Math.abs(s.x - x) < Math.abs(list[best].x - x)) best = j; });
    return best;
  };
  const raf = useRef(0), settleT = useRef<ReturnType<typeof setTimeout>>(undefined);
  const drag = useRef<{ x: number; l: number; from: number; on: boolean } | null>(null), dragged = useRef(false);
  useEffect(() => () => { cancelAnimationFrame(raf.current); clearTimeout(settleT.current); }, []);
  const onScroll = () => {
    cancelAnimationFrame(raf.current);
    raf.current = requestAnimationFrame(() => { if (!drag.current && track.current) setAt(near()); });
    clearTimeout(settleT.current);
    settleT.current = setTimeout(() => {
      if (drag.current) return;
      setDragging(false);
      const s = live.current.stops[live.current.at]; if (!s) return;
      setSettled(s.i);
      if (s.i !== live.current.reported) { live.current.reported = s.i; onIndexChange?.(s.i); }
    }, 160);
  };
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.target !== e.currentTarget) return;
    const n = live.current.stops.length, a = live.current.at;
    const to = ({ ArrowLeft: a - 1, ArrowRight: a + 1, Home: 0, End: n - 1 } as Record<string, number>)[e.key];
    if (to != null) { e.preventDefault(); go(to); } else onKey?.(e, live.current.stops[a]?.i ?? 0);
  };
  // a mouse drags the track like a finger would; the snap waits until the track has glided to the stop it lands on
  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== 'mouse' || e.button || (e.target as HTMLElement).closest('button,a,input,textarea,select,label')) return;
    drag.current = { x: e.clientX, l: e.currentTarget.scrollLeft, from: live.current.at, on: false };
  };
  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current; if (!d) return; const dx = e.clientX - d.x;
    if (!d.on) { if (Math.abs(dx) < 5) return; d.on = true; setDragging(true); try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* the pointer is gone */ } }
    e.currentTarget.scrollLeft = d.l - dx;
  };
  const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current; drag.current = null; if (!d || !d.on) return;
    const dx = e.clientX - d.x; let j = near(); if (j === d.from && Math.abs(dx) > 40) j += dx < 0 ? 1 : -1;
    dragged.current = true; setTimeout(() => { dragged.current = false; }, 0); go(j);
  };
  const onClickCapture = (e: MouseEvent<HTMLDivElement>) => { if (dragged.current) { e.preventDefault(); e.stopPropagation(); } };

  // a slide comes into focus once most of it is in view
  useEffect(() => {
    const t = track.current; if (!t) return;
    const kids = Array.from(t.children);
    if (typeof IntersectionObserver === 'undefined') { setInView(kids.map(() => true)); return; }
    const io = new IntersectionObserver(es => setInView(v => {
      const out = kids.map((_, i) => v[i] ?? false);
      es.forEach(e => { const i = kids.indexOf(e.target); if (i >= 0) out[i] = e.isIntersecting && e.intersectionRatio >= .69; });
      return out;
    }), { root: t, threshold: [0, .7, 1] });
    kids.forEach(k => io.observe(k));
    return () => io.disconnect();
  }, [track, count]);

  return {
    stops, at, go, inView, settled, dragging,
    trackProps: { onScroll, onKeyDown, onPointerDown, onPointerMove, onPointerUp, onPointerCancel: onPointerUp, onClickCapture }
  };
}
