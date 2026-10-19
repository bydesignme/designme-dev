'use client';
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

/** useLayoutEffect in the browser, useEffect while rendering on the server */
export const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/** True when the visitor asked for less motion */
export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = matchMedia('(prefers-reduced-motion: reduce)');
    const on = () => setReduce(mq.matches);
    on(); mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);
  return reduce;
}

/** Counts whole seconds while `on` is true, starting from `start` */
export function useSeconds(on: boolean, start = 0) {
  const [secs, setSecs] = useState(start);
  useEffect(() => {
    if (!on) return;
    const id = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(id);
  }, [on]);
  return secs;
}

/** Eases a number to `target` over `ms`, so counters roll instead of jumping */
export function useTween(target: number, ms = 1000, from = target) {
  const [value, setValue] = useState(from);
  const cur = useRef(from);
  const reduce = useReducedMotion();
  useEffect(() => {
    const a = cur.current, t0 = performance.now(), dur = reduce ? 1 : ms;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.max(0, Math.min(1, (t - t0) / dur)), x = a + (target - a) * (1 - Math.pow(1 - p, 3));
      cur.current = x; setValue(x);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms, reduce]);
  return value;
}

/** State that can be controlled by the parent (value + onChange) or left to the component (defaultValue) */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const controlled = value !== undefined;
  const set = useCallback((v: T) => { if (!controlled) setInner(v); onChange?.(v); }, [controlled, onChange]);
  return [controlled ? value : inner, set] as const;
}
