'use client';
import { useEffect, type DependencyList } from 'react';

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
