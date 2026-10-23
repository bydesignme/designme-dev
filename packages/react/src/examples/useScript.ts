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

/** A preview's story: runs like useScript, once, but stops for good at the visitor's first click or key inside `ref`,
    so they take over from wherever it got to. `press` clicks a control inside `ref`, the way the person in the story would */
export function useStory(ref: RefObject<HTMLElement | null>, run: (s: Script & { press: (selector: string) => void }) => Promise<void>) {
  useEffect(() => {
    let alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const el = ref.current;
    const stop = (e: Event) => { if (!e.isTrusted) return; alive = false; timers.forEach(clearTimeout); };
    el?.addEventListener('pointerdown', stop, true); el?.addEventListener('keydown', stop, true);
    const wait = (ms: number) => new Promise<void>(res => { timers.push(setTimeout(() => { if (alive) res(); }, ms)); });
    const press = (selector: string) => { if (alive) el?.querySelector<HTMLElement>(selector)?.click(); };
    run({ wait, press }).catch(e => console.error(e));
    return () => { alive = false; timers.forEach(clearTimeout); el?.removeEventListener('pointerdown', stop, true); el?.removeEventListener('keydown', stop, true); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
}
