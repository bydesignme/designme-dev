'use client';
import { useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import '../../designme.css';
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
