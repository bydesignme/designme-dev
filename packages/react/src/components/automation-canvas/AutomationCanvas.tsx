'use client';
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Swap } from '../../lib/motion';
import '../../designme.css';
import './automation-canvas.css';

/** A spot on the canvas, as fractions of its width and height */
export interface AutomationPoint {
  x: number;
  y: number;
}

/** One step of the automation, drawn as a card on the canvas */
export interface AutomationNode {
  id: string;
  icon: IconName;
  /** The icon's colour, like 'var(--dm-pl)'. Its tile is a light tint of it */
  color: string;
  /** Like "Read frames" */
  title: string;
  /** The setting shown under the title, like "Pricing, Checkout". The popover changes it */
  detail: string;
  /** Where the centre of the card sits, as fractions of the canvas width and height. With `balanced` (the default), cards
   * that share an x form a column, and the columns spread evenly from one side to the other */
  x: number;
  y: number;
  /** Where it sits when the canvas is narrower than 560px. Defaults to a column down the middle */
  narrow?: AutomationPoint;
  /** What its popover edits: a label and the choices, like { label: 'Frames', options: ['Pricing, Checkout', 'All frames'] } */
  field?: { label: string; options: string[] };
  /** 'run' rings it with a spinner, 'done' ticks it. Leave it out before a run */
  state?: 'run' | 'done';
}

/** A wire from one node to another, by id */
export type AutomationEdge = [from: string, to: string];

export interface AutomationCanvasProps {
  /** The automation's name, like "Weekly design QA" */
  name: string;
  /** The green tag after the name, like "On". Leave it out to hide it */
  tag?: string;
  /** The quiet line on the right, like "Every Monday, 9:00". Crossfades when it changes */
  status?: string;
  nodes: AutomationNode[];
  edges: AutomationEdge[];
  /** The wires a run has reached. A soft light passes along each one as it is added, and it stays lit while it is listed;
   * clear the list when a new run starts */
  flowing?: AutomationEdge[];
  /** Spread the columns of cards evenly, with the first and last the same distance in from each side, so the wires on
   * the left and right match at any width. Set false to place every card exactly at its x. Defaults to true */
  balanced?: boolean;
  /** The node whose popover is open. Leave it out to let clicks pick it */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  /** Each node's setting, by id. Leave it out to let the popovers keep them, starting from each node's detail */
  values?: Record<string, string>;
  defaultValues?: Record<string, string>;
  onValuesChange?: (values: Record<string, string>) => void;
  /** Called when a node is dropped after a drag, with where its centre ended up and whether the canvas was narrow */
  onNodeMove?: (id: string, at: AutomationPoint, narrow: boolean) => void;
  /** Adds the Test run button. The run itself is yours: drive it with each node's state and `flowing` */
  onRun?: () => void;
  runLabel?: string;
  /** The button that closes a popover */
  doneLabel?: string;
  className?: string;
}

// under this width the nodes stack down the canvas and wire top to bottom
const NARROW = 560;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const same = (a: AutomationEdge, b: AutomationEdge) => a[0] === b[0] && a[1] === b[1];

/** An automation as cards and wires: drag the cards, click one to change its setting, and watch a run flow through it. */
export function AutomationCanvas({
  name, tag, status, nodes, edges, flowing = [], selected, defaultSelected = null, onSelectedChange, values, defaultValues, onValuesChange,
  balanced = true, onNodeMove, onRun, runLabel = 'Test run', doneLabel = 'Done', className
}: AutomationCanvasProps) {
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const [vals, setVals] = useControllable(values, defaultValues ?? Object.fromEntries(nodes.map(n => [n.id, n.detail])), onValuesChange);
  const valueOf = (n: AutomationNode) => vals[n.id] ?? n.detail;

  const cv = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLButtonElement | null>>({});
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [heights, setHeights] = useState<Record<string, number>>({});
  // where people dropped the nodes, kept apart for the wide and the narrow layout
  const [moved, setMoved] = useState<{ wide: Record<string, AutomationPoint>; narrow: Record<string, AutomationPoint> }>({ wide: {}, narrow: {} });
  const [drag, setDrag] = useState<string | null>(null);
  const [optsOpen, setOptsOpen] = useState(false);
  // the keyboard: a step opened with Enter or Space puts the focus in its popover, and Escape or Done gives it back to the
  // step. The field is a menu button: the arrows open it and move through the choices, Home and End jump, Escape closes it
  const popEl = useRef<HTMLDivElement>(null), ddEl = useRef<HTMLButtonElement>(null), optsEl = useRef<HTMLDivElement>(null);
  const keyOpen = useRef(false), inPop = useRef(false), optsFocus = useRef<'first' | 'last' | null>(null);
  // a drop ends in a click; this swallows it so the popover doesn't open
  const dropped = useRef(false);
  const stopDrag = useRef<() => void>(undefined);
  const close = useRef(() => setSel(null));
  useEffect(() => { close.current = () => setSel(null); });
  useEffect(() => () => stopDrag.current?.(), []);

  // the popover keeps showing the last node while it fades out
  const [popFor, setPopFor] = useState(sel);
  if (sel && sel !== popFor) setPopFor(sel);
  const [optsFor, setOptsFor] = useState(sel);
  if (optsFor !== sel) { setOptsFor(sel); setOptsOpen(false); }

  const narrow = !!size && size.w < NARROW;
  // cards narrow a little when a wide canvas is short of room for three columns of full-size cards
  const width = narrow || (!!size && size.w < 700) ? 150 : 176;
  const reduce = useReducedMotion();

  // the canvas size drives the layout; a change of width closes the popover, as the node it points at moves
  useIsoLayoutEffect(() => {
    const el = cv.current; if (!el) return;
    let last = 0;
    const fit = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (last && Math.abs(w - last) > 2) close.current();
      last = w;
      setSize(s => (s && s.w === w && s.h === h ? s : { w, h }));
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  // on arrival the wires draw in once the steps have landed: each path gets its own length to draw along
  const svg = useRef<SVGSVGElement>(null);
  const [intro, setIntro] = useState(true);
  useEffect(() => { const t = setTimeout(() => setIntro(false), 1300); return () => clearTimeout(t); }, []);
  useIsoLayoutEffect(() => { if (intro) svg.current?.querySelectorAll('path').forEach(p => p.style.setProperty('--dm-l', String(Math.ceil(p.getTotalLength())))); });
  useIsoLayoutEffect(() => {
    const next: Record<string, number> = {};
    for (const n of nodes) next[n.id] = els.current[n.id]?.offsetHeight ?? 0;
    setHeights(h => (nodes.every(n => h[n.id] === next[n.id]) ? h : next));
  });

  // balanced: the distinct x values are columns, the first and last the same distance in from each side, the rest evenly between
  const cols = [...new Set(nodes.map(n => n.x))].sort((a, b) => a - b);
  const colX = (x: number) => {
    if (!balanced || !size || cols.length < 2) return x;
    const W = size.w, pad = Math.max(20, W * .06), first = pad + width / 2, last = W - pad - width / 2;
    return (first + (last - first) * cols.indexOf(x) / (cols.length - 1)) / W;
  };
  const at = (n: AutomationNode, i: number): AutomationPoint => narrow
    ? moved.narrow[n.id] ?? n.narrow ?? { x: .5, y: (i + 1) / (nodes.length + 1) }
    : moved.wide[n.id] ?? { x: colX(n.x), y: n.y };
  const boxes: Record<string, { left: number; top: number; w: number; h: number }> = {};
  nodes.forEach((n, i) => {
    const p = at(n, i), h = heights[n.id] || 56;
    boxes[n.id] = { left: p.x * (size?.w ?? 0) - width / 2, top: p.y * (size?.h ?? 0) - h / 2, w: width, h };
  });

  const wire = ([a, b]: AutomationEdge) => {
    const A = boxes[a], B = boxes[b]; if (!A || !B) return '';
    const ax = A.left + A.w / 2, ay = A.top + A.h / 2, bx = B.left + B.w / 2, by = B.top + B.h / 2;
    if (narrow) { const y1 = A.top + A.h, y2 = B.top, m = (y1 + y2) / 2; return `M${ax} ${y1} C${ax} ${m} ${bx} ${m} ${bx} ${y2}`; }
    const x1 = A.left + A.w, x2 = B.left, m = (x1 + x2) / 2;
    return `M${x1} ${ay} C${m} ${ay} ${m} ${by} ${x2} ${by}`;
  };

  const startDrag = (e: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    if (e.button || !cv.current) return;
    const b = e.currentTarget, canvas = cv.current, sx = e.clientX, sy = e.clientY, ox = b.offsetLeft, oy = b.offsetTop, pointer = e.pointerId;
    const layout = narrow ? 'narrow' : 'wide';
    let on = false, last: AutomationPoint | null = null;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!on && Math.hypot(dx, dy) < 4) return;
      if (!on) { on = true; setDrag(id); close.current(); b.setPointerCapture?.(pointer); }
      const W = canvas.clientWidth, H = canvas.clientHeight;
      const left = clamp(ox + dx, 4, W - b.offsetWidth - 4), top = clamp(oy + dy, 4, H - b.offsetHeight - 4);
      const p = { x: (left + b.offsetWidth / 2) / W, y: (top + b.offsetHeight / 2) / H };
      last = p;
      setMoved(m => ({ ...m, [layout]: { ...m[layout], [id]: p } }));
    };
    const up = () => {
      stopDrag.current?.();
      if (!on) return;
      setDrag(null);
      dropped.current = true; setTimeout(() => { dropped.current = false; }, 50);
      if (last) onNodeMove?.(id, last, layout === 'narrow');
    };
    stopDrag.current = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); stopDrag.current = undefined; };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up);
  };

  // a wire newly reached by a run gets one soft light passing along it
  const flowKey = flowing.map(e => e.join('-')).join(',');
  const lastFlow = useRef<string[]>([]);
  useEffect(() => {
    const now = flowKey ? flowKey.split(',') : [], added = now.filter(k => !lastFlow.current.includes(k)); lastFlow.current = now;
    if (reduce) return;
    added.forEach(k => {
      const p = svg.current?.querySelector<SVGPathElement>(`path[data-e="${k}"]`); if (!p) return;
      const L = p.getTotalLength(), len = Math.min(64, L * .4), q = p.cloneNode() as SVGPathElement;
      q.removeAttribute('data-e'); q.setAttribute('class', 'dm-pulse'); q.style.cssText = `stroke-dasharray:${len} ${L + len}`; svg.current?.appendChild(q);
      q.animate([{ strokeDashoffset: len, opacity: 0 }, { opacity: 1, offset: .18 }, { opacity: 1, offset: .78 }, { strokeDashoffset: -L, opacity: 0 }], { duration: 720, easing: 'cubic-bezier(.45,0,.25,1)' }).onfinish = () => q.remove();
    });
  }, [flowKey, reduce]);

  useIsoLayoutEffect(() => {
    if (sel) { if (keyOpen.current) { keyOpen.current = false; (ddEl.current ?? popEl.current?.querySelector<HTMLElement>('button'))?.focus({ preventScroll: true }); } return; }
    if (inPop.current && popFor) { inPop.current = false; els.current[popFor]?.focus({ preventScroll: true }); }
  }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps
  const optItems = () => Array.from(optsEl.current?.querySelectorAll<HTMLElement>('.dm-mi') ?? []);
  useIsoLayoutEffect(() => {
    if (optsOpen) { const to = optsFocus.current; optsFocus.current = null; if (!to) return; const it = optItems(); (to === 'last' ? it[it.length - 1] : it.find(x => x.getAttribute('aria-checked') === 'true') ?? it[0])?.focus({ preventScroll: true }); return; }
    if (optsEl.current?.contains(document.activeElement)) ddEl.current?.focus({ preventScroll: true });
  }, [optsOpen]);
  const optsKey = (e: ReactKeyboardEvent) => {
    const it = optItems(), i = it.indexOf(document.activeElement as HTMLElement);
    const go = ({ ArrowDown: it[(i + 1) % it.length], ArrowUp: it[(i - 1 + it.length) % it.length], Home: it[0], End: it[it.length - 1] } as Record<string, HTMLElement | undefined>)[e.key];
    if (go) { e.preventDefault(); go.focus({ preventScroll: true }); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); setOptsOpen(false); }
    else if (e.key === 'Tab') setOptsOpen(false);
  };

  const pop = nodes.find(n => n.id === popFor);
  const pb = pop && boxes[pop.id];
  let px = 0, py = 0;
  if (pb && size) {
    px = pb.left + pb.w + 10; if (px + 240 > size.w) px = pb.left - 250; if (px < 6) px = 6;
    py = clamp(pb.top - 40, 6, size.h - 190);
  }
  const pick = (n: AutomationNode, v: string) => { setVals({ ...vals, [n.id]: v }); setOptsOpen(false); };

  return (
    <div data-dm="" className={cx('dm-acx', className)}>
      <div className="dm-acx-top">
        <span className="dm-acx-name">{name}</span>
        {tag && <span className="dm-tag dm-ok dm-acx-on">{tag}</span>}
        <span className="dm-acx-sp" />
        {status !== undefined && <Swap className="dm-muted dm-acx-st">{status}</Swap>}
        {onRun && <button type="button" className="dm-pill dm-primary dm-sm dm-acx-run" onClick={() => { setSel(null); onRun(); }}><Icon name="play" size="xs" />{runLabel}</button>}
      </div>
      <div className="dm-acx-cv" ref={cv} onClick={() => setSel(null)}>
        <svg ref={svg} className={cx('dm-acx-svg', intro && 'dm-intro')} aria-hidden="true">
          {size && edges.map(e => <path key={e.join('-')} data-e={e.join('-')} className={flowing.some(f => same(f, e)) ? 'dm-done' : undefined} d={wire(e)} />)}
        </svg>
        <div className="dm-acx-nodes">
          {nodes.map((n, i) => {
            const p = at(n, i), h = heights[n.id] || 56;
            return (
              <button type="button" key={n.id} ref={el => { els.current[n.id] = el; }} aria-expanded={sel === n.id}
                className={cx('dm-acx-n dm-acx-in', drag === n.id && 'dm-drag', sel === n.id && 'dm-sel', n.state === 'run' && 'dm-run')}
                style={{ animationDelay: i * 90 + 'ms', left: `calc(${p.x * 100}% - ${width / 2}px)`, top: `calc(${p.y * 100}% - ${h / 2}px)`, width: width === 176 ? undefined : width }}
                onPointerDown={ev => startDrag(ev, n.id)}
                onClick={ev => { ev.stopPropagation(); if (dropped.current) { dropped.current = false; return; } keyOpen.current = sel !== n.id && ev.detail === 0; setSel(sel === n.id ? null : n.id); }}
                onKeyDown={ev => { if (ev.key === 'Escape' && sel === n.id) { ev.preventDefault(); setSel(null); } }}>
                <span className="dm-ic" style={{ color: n.color, background: `color-mix(in srgb,${n.color} 14%,transparent)` }}><Icon name={n.icon} size="xs" /></span>
                <span className="dm-t"><b>{n.title}</b><Swap className="dm-d">{valueOf(n)}</Swap></span>
                {/* the badge pops in once; after that its spinner turns into a check with a short crossfade */}
                {n.state && (
                  <span className="dm-s">
                    <span key={n.state} className="dm-acx-sv">
                      {n.state === 'run' ? <span className="dm-spin" style={{ width: 10, height: 10 }} /> : <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="check" size="xs" /></span>}
                    </span>
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div ref={popEl} className={cx('dm-pop dm-acx-pop', !!sel && 'dm-open')} role="dialog" aria-label={pop?.title} inert={!sel} style={{ left: px, top: py }} onClick={e => e.stopPropagation()}
          onFocus={() => { inPop.current = true; }} onBlur={e => { if (!popEl.current?.contains(e.relatedTarget as Node)) inPop.current = false; }}
          onKeyDown={e => { if (e.key === 'Escape' && sel) { e.preventDefault(); setSel(null); } }}>
          {pop && <>
            <h4>{pop.title}</h4>
            {pop.field && (
              <div className="dm-acx-fl">
                <span>{pop.field.label}</span>
                <button type="button" ref={ddEl} className="dm-acx-dd" aria-haspopup="menu" aria-expanded={optsOpen}
                  onClick={e => { if (!optsOpen && e.detail === 0) optsFocus.current = 'first'; setOptsOpen(o => !o); }}
                  onKeyDown={e => { if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return; e.preventDefault(); optsFocus.current = e.key === 'ArrowUp' ? 'last' : 'first'; if (optsOpen) { const it = optItems(); (e.key === 'ArrowUp' ? it[it.length - 1] : it[0])?.focus({ preventScroll: true }); optsFocus.current = null; } else setOptsOpen(true); }}>
                  <Swap>{valueOf(pop)}</Swap><Icon name="chev-d" size="xs" /></button>
                <div ref={optsEl} className={cx('dm-acx-opts', optsOpen && 'dm-open')} role="menu" aria-label={pop.field.label} onKeyDown={optsKey}>
                  {pop.field.options.map(o => (
                    <button type="button" key={o} className="dm-mi" role="menuitemradio" tabIndex={-1} aria-checked={o === valueOf(pop)} onClick={() => pick(pop, o)}>
                      <span>{o}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
                    </button>
                  ))}
                </div>
              </div>
            )}
            <button type="button" className="dm-pill dm-soft dm-sm dm-acx-done" onClick={() => setSel(null)}>{doneLabel}</button>
          </>}
        </div>
      </div>
    </div>
  );
}
