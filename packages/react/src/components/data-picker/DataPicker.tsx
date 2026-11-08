'use client';
import { useId, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Tip } from '../../lib/motion';
import '../../designme.css';
import './data-picker.css';

/** The kinds of step, each with its colour on its tile: the trigger orange, AI steps violet, tools teal, app steps and outputs
    blue, a branch yellow, a wait pink, an approval green */
export type DataPickerStepKind = 'trigger' | 'ai' | 'tool' | 'app' | 'output' | 'branch' | 'wait' | 'approval';
/** Each type has its colour: text blue, numbers green, lists orange, objects pink, yes or no yellow, dates teal */
export type DataPickerType = 'text' | 'number' | 'list' | 'object' | 'bool' | 'date';
/** An earlier step and what it hands on. A field is referred to as `"<step id>.<field name>"` */
export interface DataPickerSource {
  id: string;
  title: string;
  kind: DataPickerStepKind;
  icon?: IconName;
  fields: { name: string; type: DataPickerType; sample?: string }[];
}
/** One of the step's inputs and the fields mapped into it, in order */
export interface DataPickerField {
  key: string;
  label: string;
  refs: string[];
}

export interface DataPickerProps {
  /** The steps before this one, in order: the picker offers only their fields */
  sources: DataPickerSource[];
  /** The step's inputs and what is mapped into each */
  fields?: DataPickerField[];
  defaultFields?: DataPickerField[];
  onFieldsChange?: (fields: DataPickerField[]) => void;
  /** The step being set up, over its fields */
  step?: { title: string; kind: DataPickerStepKind; icon?: IconName; position?: string };
  /** The key of the field whose picker is open, or null */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (open: string | null) => void;
  /** What the search holds */
  query?: string;
  onQueryChange?: (query: string) => void;
  /** The option the arrows are on, counted through the filtered list */
  active?: number;
  onActiveChange?: (active: number) => void;
  /** Said under the list, like "From the 4 steps before Send the reply" */
  note?: ReactNode;
  className?: string;
}

const KIND_ICON: Record<DataPickerStepKind, IconName> = { trigger: 'bolt', ai: 'spark', tool: 'globe', app: 'send', output: 'hash', branch: 'branch', wait: 'clock', approval: 'user' };
const TONE: Record<DataPickerType, string> = { text: 'dm-b', number: 'dm-m', list: 'dm-p', object: 'dm-k', bool: 'dm-y', date: 'dm-t' };
const Tile = ({ kind, icon }: { kind: DataPickerStepKind; icon?: IconName }) => <span className="dm-fpk-ti" data-k={kind} aria-hidden="true"><Icon name={icon ?? KIND_ICON[kind]} size="xs" /></span>;
const mark = (t: string, v: string) => { const i = v ? t.toLowerCase().indexOf(v) : -1; return i < 0 ? t : <>{t.slice(0, i)}<mark>{t.slice(i, i + v.length)}</mark>{t.slice(i + v.length)}</>; };

/** Maps data from earlier steps into a step's inputs: each input holds tokens, the step and then its field, and a + opens a
    picker of what earlier steps hand on, grouped by step, with each field's type in colour and a sample, a search and the
    arrow keys. */
export function DataPicker({ sources, fields, defaultFields = [], onFieldsChange, step, open, defaultOpen = null, onOpenChange, query, onQueryChange, active, onActiveChange, note, className }: DataPickerProps) {
  const [list, setList] = useControllable(fields, defaultFields, onFieldsChange);
  const [openKey, setOpen] = useControllable<string | null>(open, defaultOpen, onOpenChange);
  const [q, setQ] = useControllable(query, '', onQueryChange);
  const [hi, setHi] = useControllable(active, 0, onActiveChange);
  const [said, setSaid] = useState('');
  // the fields mapped from the start show as they are; ones added later pop in
  const [first] = useState(() => new Set((fields ?? defaultFields).flatMap(f => f.refs.map(r => f.key + '|' + r))));
  const uid = useId().replace(/:/g, '');
  const root = useRef<HTMLDivElement>(null), pop = useRef<HTMLDivElement>(null), input = useRef<HTMLInputElement>(null), lsRef = useRef<HTMLDivElement>(null);
  const [place, setPlace] = useState<{ top: number; left: number } | null>(null);
  const of = (ref: string) => { const [s, f] = ref.split('.'); return { src: sources.find(x => x.id === s), f }; };

  const v = q.trim().toLowerCase();
  const groups = sources.map((src, si) => ({ src, si, fs: src.fields.filter(f => !v || f.name.toLowerCase().includes(v) || src.title.toLowerCase().includes(v)) })).filter(g => g.fs.length);
  const items = groups.flatMap(g => g.fs.map(f => g.src.id + '.' + f.name));
  const at = items.length ? ((hi % items.length) + items.length) % items.length : 0;
  const target = list.find(f => f.key === openKey);

  // the picker opens under the + of its field, inside the component
  useIsoLayoutEffect(() => {
    if (!openKey || !root.current || !pop.current) { setPlace(null); return; }
    const b = root.current.querySelector<HTMLElement>(`[data-add="${CSS.escape(openKey)}"]`); if (!b) return;
    const rr = root.current.getBoundingClientRect(), br = b.getBoundingClientRect();
    setPlace({ top: br.bottom - rr.top + 6, left: Math.max(-rr.left + 8, Math.min(br.right - rr.left - pop.current.offsetWidth, innerWidth - rr.left - pop.current.offsetWidth - 8)) });
  }, [openKey]);
  useIsoLayoutEffect(() => { lsRef.current?.querySelector('.dm-on')?.scrollIntoView({ block: 'nearest' }); }, [at, v]);
  // a click outside or Escape closes it, and the focus goes back to the + when it was inside
  useIsoLayoutEffect(() => {
    if (!openKey) return;
    const down = (e: PointerEvent) => { const t = e.target as Node; if (!pop.current?.contains(t) && !(t as Element).closest?.(`[data-add="${CSS.escape(openKey)}"]`)) setOpen(null); };
    document.addEventListener('pointerdown', down); return () => document.removeEventListener('pointerdown', down);
  }, [openKey]);
  const close = (focus: boolean) => { const k = openKey; setOpen(null); if (focus && k) root.current?.querySelector<HTMLElement>(`[data-add="${CSS.escape(k)}"]`)?.focus({ preventScroll: true }); };
  const openFor = (key: string, viaKeyboard: boolean) => { if (openKey === key) { close(false); return; } setQ(''); setHi(0); setOpen(key); setTimeout(() => input.current?.focus({ preventScroll: true }), viaKeyboard ? 0 : 30); };
  const pick = (ref: string | undefined) => {
    if (!ref || !target) return; const { src, f } = of(ref), inside = !!pop.current?.contains(document.activeElement);
    close(inside);
    if (target.refs.includes(ref)) { setSaid(`${target.label} already has ${f} from ${src?.title}`); return; }
    setList(list.map(x => x.key === target.key ? { ...x, refs: [...x.refs, ref] } : x)); setSaid(`Added ${f} from ${src?.title} to ${target.label}`);
  };
  const remove = (key: string, ref: string) => { const { src, f } = of(ref); setList(list.map(x => x.key === key ? { ...x, refs: x.refs.filter(r => r !== ref) } : x)); setSaid(`Removed ${f} from ${src?.title}`); };

  let n = 0;
  return (
    <div data-dm="" ref={root} className={cx('dm-fpk', className)}>
      {step && <div className="dm-fpk-hd"><Tile kind={step.kind} icon={step.icon} /><b>{step.title}</b>{step.position && <span className="dm-muted">{step.position}</span>}</div>}
      {list.map(fd => (
        <div className="dm-fpk-f" key={fd.key}>
          <span className="dm-fpk-l">{fd.label}</span>
          <div className="dm-fpk-box" role="group" aria-label={fd.label}>
            {fd.refs.length ? fd.refs.map(ref => { const { src, f } = of(ref); return (
              <span className={cx('dm-fpk-tok', !first.has(fd.key + '|' + ref) && 'dm-new')} key={ref}>
                {src && <Tile kind={src.kind} icon={src.icon} />}<span className="dm-s">{src?.title ?? ref.split('.')[0]}</span><span className="dm-sep" aria-hidden="true">›</span><span className="dm-f">{f}</span>
                <Tip label="Remove"><button type="button" className="dm-fpk-x" aria-label={`Remove ${f} from ${src?.title ?? ref.split('.')[0]}`} onClick={e => { remove(fd.key, ref); if (e.detail === 0) root.current?.querySelector<HTMLElement>(`[data-add="${CSS.escape(fd.key)}"]`)?.focus(); }}><Icon name="x" size="xs" /></button></Tip>
              </span>); }) : <span className="dm-fpk-ph">Pick data from an earlier step</span>}
            <Tip label="Insert data" off={openKey === fd.key}>
              <button type="button" className="dm-fpk-add" data-add={fd.key} aria-haspopup="dialog" aria-expanded={openKey === fd.key} aria-label={`Insert data into ${fd.label}`} onClick={e => openFor(fd.key, e.detail === 0)}><Icon name="plus" /></button>
            </Tip>
          </div>
        </div>
      ))}
      <div ref={pop} className={cx('dm-pop dm-fpk-pop', openKey && place && 'dm-open')} style={place ?? undefined} role="dialog" aria-label={target ? `Pick data for ${target.label}` : 'Pick data from an earlier step'} inert={!openKey}>
        <div className="dm-fpk-q">
          <Icon name="search" />
          <input ref={input} type="text" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls={`${uid}-ls`} aria-activedescendant={items.length ? `${uid}-o${at}` : undefined}
            placeholder="Find a field" aria-label="Find a field" autoComplete="off" spellCheck={false} value={q}
            onChange={e => { setQ(e.target.value); setHi(0); }}
            onKeyDown={e => {
              if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); setHi(at + (e.key === 'ArrowDown' ? 1 : -1)); }
              else if (e.key === 'Enter') { e.preventDefault(); pick(items[at]); }
              else if (e.key === 'Escape') { e.preventDefault(); close(true); }
            }} />
        </div>
        <div className="dm-fpk-ls" id={`${uid}-ls`} role="listbox" aria-label="Fields from earlier steps" ref={lsRef}>
          {groups.length ? groups.map(({ src, si, fs }) => (
            <div role="group" aria-labelledby={`${uid}-g${si}`} key={src.id}>
              <div className="dm-fpk-g" id={`${uid}-g${si}`}><Tile kind={src.kind} icon={src.icon} /><b>{src.title}</b><span className="dm-n">Step {si + 1}</span></div>
              {fs.map(f => { const i = n++, ref = src.id + '.' + f.name; return (
                <div key={ref} className={cx('dm-fpk-o', i === at && 'dm-on')} role="option" id={`${uid}-o${i}`} aria-selected={i === at} aria-label={`${f.name}, ${f.type}, from ${src.title}`}
                  data-ref={ref} onPointerMove={() => { if (i !== at) setHi(i); }} onClick={() => pick(ref)}>
                  <span className="dm-k">{mark(f.name, v)}</span><span className={cx('dm-tag', TONE[f.type])}>{f.type}</span><span className="dm-ex">{f.sample}</span>
                </div>); })}
            </div>
          )) : <p className="dm-fpk-e">No field matches “{q.trim()}”</p>}
        </div>
        <p className="dm-fpk-ft"><span>{note ?? `From the ${sources.length} ${sources.length === 1 ? 'step' : 'steps'} before ${step?.title ?? 'this one'}`}</span><span className="dm-kh" aria-hidden="true"><span className="dm-kbd">↑</span> <span className="dm-kbd">↓</span> <span className="dm-kbd">↵</span></span></p>
      </div>
      <p className="dm-fpk-live" aria-live="polite">{said}</p>
    </div>
  );
}
