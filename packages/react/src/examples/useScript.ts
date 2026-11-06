'use client';
import { useCallback, useEffect, useRef, type DependencyList, type RefObject } from 'react';

export interface Script {
  /** Resolves after `ms`, unless the component unmounts first, in which case the script simply stops */
  wait: (ms: number) => Promise<void>;
}

/** Runs a timed sequence of state changes, the way the demos on designme.dev play, and stops it on unmount */
export function useScript(run: (s: Script) => Promise<void>, deps: DependencyList = []) {
  useEffect(() => {
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const wait = (ms: number) => new Promise<void>(res => { timers.push(setTimeout(() => { if (alive) res(); }, ms)); });
    run({ wait }).catch(e => console.error(e));
    return () => { alive = false; timers.forEach(clearTimeout); };
  }, deps); // eslint-disable-line react-hooks/exhaustive-deps
}

/** Waits that a click handler can await, cleared when the component unmounts. For runs that start on a click rather than on mount */
export function useWait() {
  const timers = useRef(new Set<ReturnType<typeof setTimeout>>());
  useEffect(() => { const all = timers.current; return () => all.forEach(clearTimeout); }, []);
  return useCallback((ms: number) => new Promise<void>(res => { const t = setTimeout(() => { timers.current.delete(t); res(); }, ms); timers.current.add(t); }), []);
}

/* when the visitor last pressed a key or a pointer anywhere: a focus that comes with one (a Tab into the demo) is theirs,
   and a focus a script gives is not */
let lastInput = -1e9, listening = false;
function trackInput() {
  if (listening || typeof window === 'undefined') return;
  listening = true;
  const note = (e: Event) => { if (e.isTrusted) lastInput = e.timeStamp; };
  window.addEventListener('pointerdown', note, true); window.addEventListener('keydown', note, true);
}
/** Calls `take` at the visitor's first real click, key, typing or focus inside `el`, or a wheel a component there takes for itself. Returns a function that stops watching */
function watchTakeover(el: HTMLElement, take: () => void) {
  trackInput();
  const mine = (e: Event) => { if (e.isTrusted) take(); };
  const focus = (e: Event) => { if (e.isTrusted && e.timeStamp - lastInput < 100) take(); };
  const types = ['pointerdown', 'keydown', 'input', 'click'];
  // a wheel a component takes for itself (a canvas that pans with it) is the visitor's too; one that scrolls the page is not
  const wheel = (e: Event) => { if (e.isTrusted && e.defaultPrevented) take(); };
  types.forEach(t => el.addEventListener(t, mine, true)); el.addEventListener('focusin', focus, true); el.addEventListener('wheel', wheel, { passive: true });
  return () => { types.forEach(t => el.removeEventListener(t, mine, true)); el.removeEventListener('focusin', focus, true); el.removeEventListener('wheel', wheel); };
}

/** Whether the visitor has taken over the demo in `ref`, with their first real click, key, typing or focus inside it. A
    demo that also shows the agent at work checks it before each thing it does as the person in it, so those stop for good
    while the agent's own work, and anything the visitor starts, carries on. `onTake` runs at that moment */
export function useTakeover(ref: RefObject<HTMLElement | null>, onTake?: () => void) {
  const mine = useRef(false), take = useRef(onTake);
  take.current = onTake;
  useEffect(() => {
    const el = ref.current; if (!el) return;
    return watchTakeover(el, () => { if (mine.current) return; mine.current = true; take.current?.(); });
  }, [ref]);
  return useCallback(() => mine.current, []);
}

export interface Story extends Script {
  /** Clicks a control inside `ref`, the way the person in the story would */
  press: (selector: string) => void;
  /** Runs `fn` when the visitor takes over (at once if they already have), so the story can take back what it was halfway
      through, like the letters it had typed into a field */
  taken: (fn: () => void) => void;
}

/** A preview's story, or any demo that acts as the person in it: runs like useScript, once, but stops for good at the
    visitor's first click, key, typing or focus inside `ref`, so they take over from wherever it got to. While a mouse rests
    on `ref` the story holds where it is, so it never moves what the visitor is about to click, and carries on once it leaves.
    An agent at work passes `{ hold: false }` and keeps working under the pointer, as on designme.dev */
export function useStory(ref: RefObject<HTMLElement | null>, run: (s: Story) => Promise<void>, { hold = true }: { hold?: boolean } = {}) {
  useEffect(() => {
    let alive = true, mine = false, held = false;
    const timers: ReturnType<typeof setTimeout>[] = [], undo: (() => void)[] = [], due: (() => void)[] = [];
    const el = ref.current;
    const stop = () => { alive = false; timers.forEach(clearTimeout); };
    const off = el ? watchTakeover(el, () => { if (mine) return; mine = true; stop(); undo.splice(0).forEach(f => f()); }) : () => {};
    const enter = (e: PointerEvent) => { if (hold && e.pointerType === 'mouse') held = true; };
    const leave = () => { if (!held) return; held = false; due.splice(0).forEach(f => f()); };
    el?.addEventListener('pointerenter', enter); el?.addEventListener('pointerleave', leave);
    const wait = (ms: number) => new Promise<void>(res => { timers.push(setTimeout(() => { const go = () => { if (alive) res(); }; if (held && !mine) due.push(go); else go(); }, ms)); });
    const press = (selector: string) => { if (alive) el?.querySelector<HTMLElement>(selector)?.click(); };
    const taken = (fn: () => void) => { if (mine) fn(); else undo.push(fn); };
    run({ wait, press, taken }).catch(e => console.error(e));
    return () => { stop(); off(); el?.removeEventListener('pointerenter', enter); el?.removeEventListener('pointerleave', leave); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
