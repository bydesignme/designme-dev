'use client';
import { useEffect, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './automation-canvas.css';

/** A spot on the canvas, as fractions of its width and height */
export interface AutomationPoint {
  x: number;
  y: number;
}

/** Where a new step hangs from: after a step (`out`), or from one of a step's connectors */
export type AutomationVia = 'out' | 'model' | 'tools';

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
   * that share an x form a column, and the columns spread evenly from one side to the other. Leave x and y out for a step
   * with `attach`: the canvas finds it a place */
  x?: number;
  y?: number;
  /** Where it sits when the canvas is narrower than 560px. Defaults to a column down the middle */
  narrow?: AutomationPoint;
  /** What its popover edits: a label and the choices, like { label: 'Frames', options: ['Pricing, Checkout', 'All frames'] } */
  field?: { label: string; options: string[] };
  /** 'run' rings it with a spinner, 'done' ticks it. Leave it out before a run */
  state?: 'run' | 'done';
  /** Labelled connectors under the step, for the model an agent thinks with and the tools it may use. With `catalog`, each
   * opens the step picker on that group */
  connectors?: ('model' | 'tools')[];
  /** A step added from a + or a connector: the step it hangs from and how. The canvas places it next to that step, clear
   * of the others and their wires, and keeps that place in each layout. A model or a tool is drawn as a smaller step */
  attach?: { to: string; via: AutomationVia };
}

/** A wire from one node to another, by id. A third value hangs it from that connector of the first node, dashed */
export type AutomationEdge = [from: string, to: string, via?: 'model' | 'tools'];

/** A kind of step the picker offers */
export interface AutomationStepType {
  id: string;
  icon: IconName;
  title: string;
  /** One line on what it does, shown at the foot of the picker while it is under the pointer or the arrows */
  description: string;
  /** The setting a new step of this kind starts with */
  detail: string;
  field?: { label: string; options: string[] };
}
export interface AutomationStepGroup {
  id: string;
  label: string;
  /** The colour of its icons, like 'var(--dm-pt)' */
  color: string;
  items: AutomationStepType[];
}
/** What the picker offers: after a step, and from the model and tools connectors */
export interface AutomationCatalog {
  step: AutomationStepGroup[];
  model?: AutomationStepGroup[];
  tools?: AutomationStepGroup[];
}

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
  /** The step types to add. With it, a step whose output leads nowhere gets a +, and each connector opens the picker too */
  catalog?: AutomationCatalog;
  /** Called with the type picked and where it hangs from. Add a node with `attach: { to: from, via }` and its edge
   * (`[from, id]`, or `[from, id, via]` for a connector) */
  onAddNode?: (type: AutomationStepType, from: string, via: AutomationVia, group: AutomationStepGroup) => void;
  /** The most steps the canvas takes before the + handles go: 9, or 6 when it stacks */
  maxNodes?: number;
  /** Adds the Test run button. The run itself is yours: drive it with each node's state and `flowing` */
  onRun?: () => void;
  runLabel?: string;
  /** The button that closes a popover */
  doneLabel?: string;
  /** The picker's search */
  searchLabel?: string;
  className?: string;
}

type Box = { l: number; t: number; r: number; b: number; w: number; h: number };
type Anchor = { x: number; y: number; d: 'r' | 'l' | 'd' };
type Bez = [number, number][];
// under this width the nodes stack down the canvas and wire top to bottom
const NARROW = 560;
const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const same = (a: AutomationEdge, b: AutomationEdge) => a[0] === b[0] && a[1] === b[1];
const ek = (e: AutomationEdge) => e[0] + '-' + e[1];
const KIND = { model: 'Model', tools: 'Tools' } as const;
const mk = (l: number, t: number, w: number, h: number): Box => ({ l, t, w, h, r: l + w, b: t + h });

// a wire from a step's output (or a connector's foot) into the side of the next step that faces it
function link(a: Anchor, B: Box): Bez {
  let p: [number, number], e: 'l' | 'r' | 't' | 'b';
  if (a.d === 'l') { if (B.t >= a.y + 8) { p = [B.l + B.w / 2, B.t]; e = 't'; } else if (B.r <= a.x - 8) { p = [B.r, B.t + B.h / 2]; e = 'r'; } else { p = [B.l + B.w / 2, B.b]; e = 'b'; } }
  else if (a.d === 'r') { if (B.l >= a.x + 8) { p = [B.l, B.t + B.h / 2]; e = 'l'; } else if (B.t >= a.y) { p = [B.l + B.w / 2, B.t]; e = 't'; } else { p = [B.l + B.w / 2, B.b]; e = 'b'; } }
  else { if (B.t >= a.y + 8) { p = [B.l + B.w / 2, B.t]; e = 't'; } else if (B.l >= a.x) { p = [B.l, B.t + B.h / 2]; e = 'l'; } else { p = [B.r, B.t + B.h / 2]; e = 'r'; } }
  const dx = p[0] - a.x, dy = p[1] - a.y, k0 = Math.max(24, Math.abs(a.d === 'd' ? dy : dx) / 2), k1 = Math.max(24, Math.abs(e === 'l' || e === 'r' ? dx : dy) / 2);
  const c1: [number, number] = a.d === 'r' ? [a.x + k0, a.y] : a.d === 'l' ? [a.x - k0, a.y] : [a.x, a.y + k0];
  const c2: [number, number] = { l: [p[0] - k1, p[1]], r: [p[0] + k1, p[1]], t: [p[0], p[1] - k1], b: [p[0], p[1] + k1] }[e] as [number, number];
  return [[a.x, a.y], c1, c2, p];
}
const bez = (q: Bez, t: number): [number, number] => { const u = 1 - t; return [0, 1].map(i => u * u * u * q[0][i] + 3 * u * u * t * q[1][i] + 3 * u * t * t * q[2][i] + t * t * t * q[3][i]) as [number, number]; };
const dOf = (q: Bez) => `M${q[0].join(' ')} C${q[1].join(' ')} ${q[2].join(' ')} ${q[3].join(' ')}`;

/* where a new step goes: as near as it can to just after what it hangs from (to the right of a step, under a connector, or
   under a step when the canvas stacks), clear of every step, + and connector, keeping off the wires already drawn, with its
   own wire crossing no step, and with room for its own + inside the canvas */
function spot(W: number, H: number, w: number, h: number, a: Anchor, hasOut: boolean, narrow: boolean, others: Box[], knobs: Box[], wires: Bez[]): AutomationPoint {
  const M = 8, obst = [...others, ...knobs];
  const samples = wires.flatMap(q => Array.from({ length: 15 }, (_, i) => bez(q, (i + 1) / 16)));
  const want = a.d === 'r' ? [a.x + 56 + w / 2, a.y] : [a.x, a.y + 40 + h / 2];
  const inside = (p: [number, number], b: Box, m: number) => p[0] > b.l - m && p[0] < b.r + m && p[1] > b.t - m && p[1] < b.b + m;
  const ov = (A: Box, B: Box, m: number) => Math.max(0, Math.min(A.r, B.r + m) - Math.max(A.l, B.l - m)) * Math.max(0, Math.min(A.b, B.b + m) - Math.max(A.t, B.t - m));
  let best: Box | null = null, bs = Infinity, soft: Box | null = null, ss = Infinity;
  // room to spare first; on a crowded canvas, just clear of the rest
  for (const G of [14, 4]) {
    if (best) break;
    for (let y = M; y + h <= H - M; y += 8) for (let x = M; x + w <= W - M; x += 8) {
      const B = mk(x, y, w, h);
      if (hasOut && (narrow ? B.b + 34 > H - 4 : B.r + 34 > W - 4)) continue;
      let sc = Math.hypot(x + w / 2 - want[0], y + h / 2 - want[1]);
      if (a.d === 'r' ? B.l < a.x + 24 : B.t < a.y + 24) sc += 250;
      sc += samples.filter(p => inside(p, B, 6)).length * 60;
      const q = link(a, B); for (let i = 1; i < 12; i++) { const p = bez(q, i / 12); if (others.some(o => inside(p, o, 4))) sc += 30; }
      const hit = obst.reduce((s, o) => s + ov(B, o, G), 0);
      if (!hit) { if (sc < bs) { bs = sc; best = B; } }
      else if (hit * 10 + sc < ss) { ss = hit * 10 + sc; soft = B; }
    }
  }
  const B = best ?? soft ?? mk(M, M, w, h);
  return { x: (B.l + w / 2) / W, y: (B.t + h / 2) / H };
}

/** An automation as cards and wires: drag the cards, click one to change its setting, add steps from a + or a connector,
 * and watch a run flow through it. */
export function AutomationCanvas({
  name, tag, status, nodes, edges, flowing = [], selected, defaultSelected = null, onSelectedChange, values, defaultValues, onValuesChange,
  balanced = true, onNodeMove, catalog, onAddNode, maxNodes, onRun, runLabel = 'Test run', doneLabel = 'Done', searchLabel = 'Search steps', className
}: AutomationCanvasProps) {
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const [vals, setVals] = useControllable(values, defaultValues ?? Object.fromEntries(nodes.map(n => [n.id, n.detail])), onValuesChange);
  const valueOf = (n: AutomationNode) => vals[n.id] ?? n.detail;

  const cv = useRef<HTMLDivElement>(null);
  const els = useRef<Record<string, HTMLButtonElement | null>>({});
  const [size, setSize] = useState<{ w: number; h: number } | null>(null);
  const [heights, setHeights] = useState<Record<string, number>>({});
  // where people dropped the nodes, and where the canvas put the added ones, kept apart for the wide and the narrow layout
  const [moved, setMoved] = useState<{ wide: Record<string, AutomationPoint>; narrow: Record<string, AutomationPoint> }>({ wide: {}, narrow: {} });
  const [auto, setAuto] = useState<{ wide: Record<string, AutomationPoint>; narrow: Record<string, AutomationPoint> }>({ wide: {}, narrow: {} });
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
  const layoutKey = narrow ? 'narrow' : 'wide';
  // cards narrow a little when a wide canvas is short of room for three columns of full-size cards; a model or a tool is
  // smaller again, so on a stacked canvas it fits beside the steps in the left-hand column
  const width = narrow || (!!size && size.w < 700) ? 150 : 176;
  const widthOf = (n: AutomationNode) => n.attach && n.attach.via !== 'out' ? (narrow ? 124 : width === 150 ? 150 : 168) : width;
  const reduce = useReducedMotion();

  /* ---------- the step picker ---------- */
  const [pk, setPk] = useState<{ from: string; via: AutomationVia; focus: boolean } | null>(null);
  const [query, setQuery] = useState('');
  const [act, setAct] = useState(0);
  const knobEls = useRef<Record<string, HTMLButtonElement | null>>({});
  const qiEl = useRef<HTMLInputElement>(null), pkEl = useRef<HTMLDivElement>(null), lsEl = useRef<HTMLDivElement>(null);
  const [knobW, setKnobW] = useState<Record<string, number>>({});
  const pendingFocus = useRef<{ from: string; via: AutomationVia; had: Set<string> } | null>(null);
  const pkBack = useRef<string | null>(null);
  const [live, setLive] = useState('');

  // the canvas size drives the layout; a change of width closes the popover and the picker, as what they point at moves
  useIsoLayoutEffect(() => {
    const el = cv.current; if (!el) return;
    let last = 0;
    const fit = () => {
      const w = el.clientWidth, h = el.clientHeight;
      if (last && Math.abs(w - last) > 2) { close.current(); setPk(null); }
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
    const kw: Record<string, number> = {};
    for (const [k, b] of Object.entries(knobEls.current)) if (b) kw[k] = b.offsetWidth;
    setKnobW(o => (Object.keys(kw).length === Object.keys(o).length && Object.entries(kw).every(([k, v]) => o[k] === v) ? o : kw));
  });

  // balanced: the distinct x values are columns, the first and last the same distance in from each side, the rest evenly between
  const placedX = nodes.filter(n => !n.attach && n.x !== undefined);
  const cols = [...new Set(placedX.map(n => n.x as number))].sort((a, b) => a - b);
  const colX = (x: number) => {
    if (!balanced || !size || cols.length < 2) return x;
    const W = size.w, pad = Math.max(20, W * .06), first = pad + width / 2, last = W - pad - width / 2;
    return (first + (last - first) * cols.indexOf(x) / (cols.length - 1)) / W;
  };
  const seeds = nodes.filter(n => !n.attach);
  const at = (n: AutomationNode): AutomationPoint | null => {
    const mine = moved[layoutKey][n.id]; if (mine) return mine;
    if (n.attach) return auto[layoutKey][n.id] ?? null;
    if (narrow) return n.narrow ?? { x: .5, y: (seeds.indexOf(n) + 1) / (seeds.length + 1) };
    return { x: colX(n.x ?? .5), y: n.y ?? .5 };
  };
  const W = size?.w ?? 0, H = size?.h ?? 0;
  const boxes: Record<string, Box> = {};
  nodes.forEach(n => {
    const p = at(n); if (!p) return;
    const w = widthOf(n), h = heights[n.id] || (n.attach && n.attach.via !== 'out' ? 48 : 56);
    // a narrow position near the edge keeps the whole card inside the canvas
    boxes[n.id] = mk(clamp(p.x * W - w / 2, narrow ? 6 : -1e4, narrow ? W - 6 - w : 1e4), p.y * H - h / 2, w, h);
  });
  const byId = (id: string) => nodes.find(n => n.id === id);
  // a step's output is open when no step follows it; models and tools have no output of their own
  const isSub = (n: AutomationNode) => !!n.attach && n.attach.via !== 'out';
  const full = nodes.length >= (maxNodes ?? (narrow ? 6 : 9));
  const knobs: { key: string; node: AutomationNode; via: AutomationVia }[] = [];
  if (catalog && !full) nodes.forEach(n => {
    if (!boxes[n.id]) return;
    if (!isSub(n) && !edges.some(e => e[0] === n.id && !e[2])) knobs.push({ key: n.id + ':out', node: n, via: 'out' });
    (n.connectors ?? []).forEach(k => { if (catalog[k]?.length) knobs.push({ key: n.id + ':' + k, node: n, via: k }); });
  });
  // where a step's output leaves it: its right side, or its foot when the canvas stacks. There a step with connectors
  // sends a wire to a step on its left from its left side, so it keeps clear of what hangs under it
  // On a wide canvas a step with no room for another to its right (the last one, near the edge) takes its + under it, and
  // the steps added there stack downwards
  const roomR = (B: Box) => B.r + 56 + width + 40 <= W;
  const outAt = (B: Box, n?: AutomationNode, T?: Box): Anchor => !narrow ? ((T ? T.l >= B.r + 8 : roomR(B)) ? { x: B.r, y: B.t + B.h / 2, d: 'r' } : { x: B.l + B.w / 2, y: B.b, d: 'd' })
    : n?.connectors?.length && T && T.l + T.w / 2 < B.l ? { x: B.l, y: B.t + B.h / 2, d: 'l' } : { x: B.l + B.w / 2, y: B.b, d: 'd' };
  // the connectors sit under the step, either side of the middle so a wire leaving its foot passes between them
  const subAt = (n: AutomationNode, kind: 'model' | 'tools'): Box | null => {
    const B = boxes[n.id]; if (!B) return null;
    const ks = n.connectors ?? [], g = narrow ? 24 : 8, cxm = B.l + B.w / 2, wOf = (k: string) => knobW[n.id + ':' + k] || 64;
    const l = ks.length < 2 ? cxm - wOf(kind) / 2 : kind === ks[0] ? cxm - g / 2 - wOf(kind) : cxm + g / 2;
    return mk(l, B.b + 10, wOf(kind), 24);
  };
  const anchorOf = (e: AutomationEdge): Anchor | null => {
    const A = boxes[e[0]], B = boxes[e[1]]; if (!A || !B) return null;
    if (e[2]) { const s = subAt(byId(e[0])!, e[2]); return s && { x: s.l + s.w / 2, y: s.b, d: 'd' }; }
    return outAt(A, byId(e[0]), B);
  };
  const geo: Record<string, Bez> = {};
  edges.forEach(e => { const a = anchorOf(e), B = boxes[e[1]]; if (a && B) geo[ek(e)] = link(a, B); });
  const knobBox = (k: { node: AutomationNode; via: AutomationVia }): Box | null => {
    const B = boxes[k.node.id]; if (!B) return null;
    if (k.via !== 'out') return subAt(k.node, k.via);
    const o = outAt(B); return o.d === 'r' ? mk(o.x + 10, o.y - 10, 20, 20) : mk(o.x - 10, o.y + 10, 20, 20);
  };

  // each added step without a place in this layout gets one, in the order they were added
  useIsoLayoutEffect(() => {
    if (!size || !Object.keys(heights).length) return;
    const todo = nodes.filter(n => n.attach && !moved[layoutKey][n.id] && !auto[layoutKey][n.id] && boxes[n.attach.to]);
    if (!todo.length) return;
    const n = todo[0], e = edges.find(x => x[1] === n.id) ?? [n.attach!.to, n.id, n.attach!.via === 'out' ? undefined : n.attach!.via] as AutomationEdge;
    const A = boxes[e[0]], w = widthOf(n), h = heights[n.id] || (isSub(n) ? 48 : 56);
    const a = e[2] ? (() => { const s = subAt(byId(e[0])!, e[2]!)!; return { x: s.l + s.w / 2, y: s.b, d: 'd' as const }; })() : outAt(A);
    const others = Object.entries(boxes).filter(([id]) => id !== n.id).map(([, b]) => b);
    const kb = knobs.filter(k => k.key !== e[0] + ':out' && k.node.id !== n.id).map(knobBox).filter((b): b is Box => !!b);
    const wires = Object.entries(geo).filter(([k]) => !k.split('-').includes(n.id)).map(([, q]) => q);
    const p = spot(size.w, size.h, w, h, a, !isSub(n), narrow, others, kb, wires);
    setAuto(s => ({ ...s, [layoutKey]: { ...s[layoutKey], [n.id]: p } }));
  });

  const startDrag = (e: ReactPointerEvent<HTMLButtonElement>, id: string) => {
    if (e.button || !cv.current) return;
    const b = e.currentTarget, canvas = cv.current, sx = e.clientX, sy = e.clientY, ox = b.offsetLeft, oy = b.offsetTop, pointer = e.pointerId;
    const layout = layoutKey;
    let on = false, last: AutomationPoint | null = null;
    const move = (ev: PointerEvent) => {
      const dx = ev.clientX - sx, dy = ev.clientY - sy;
      if (!on && Math.hypot(dx, dy) < 4) return;
      if (!on) { on = true; setDrag(id); close.current(); setPk(null); b.setPointerCapture?.(pointer); }
      const W2 = canvas.clientWidth, H2 = canvas.clientHeight;
      const left = clamp(ox + dx, 4, W2 - b.offsetWidth - 4), top = clamp(oy + dy, 4, H2 - b.offsetHeight - 4);
      const p = { x: (left + b.offsetWidth / 2) / W2, y: (top + b.offsetHeight / 2) / H2 };
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

  // a wire newly reached by a run gets one soft light passing along it; a wire to a step just added draws itself in
  const flowKey = flowing.map(ek).join(',');
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
  const seenEdges = useRef<Set<string> | null>(null);
  useEffect(() => {
    const keys = edges.filter(e => geo[ek(e)]).map(ek);
    if (!seenEdges.current) { seenEdges.current = new Set(keys); return; }
    keys.filter(k => !seenEdges.current!.has(k)).forEach(k => {
      seenEdges.current!.add(k);
      const p = svg.current?.querySelector<SVGPathElement>(`path[data-e="${k}"]`); if (!p || reduce) return;
      const L = Math.ceil(p.getTotalLength());
      p.animate(p.classList.contains('dm-sub') ? [{ opacity: 0 }, { opacity: 1 }] : [{ strokeDasharray: `${L}`, strokeDashoffset: L }, { strokeDasharray: `${L}`, strokeDashoffset: 0 }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' });
    });
  });
  // the step just added takes the focus, when the visitor added it
  useIsoLayoutEffect(() => {
    const pf = pendingFocus.current; if (!pf) return;
    const n = nodes.find(x => !pf.had.has(x.id) && x.attach?.to === pf.from && x.attach.via === pf.via);
    // once it has its place (until then it is hidden, and could not take the focus)
    if (n && els.current[n.id] && boxes[n.id]) { pendingFocus.current = null; els.current[n.id]?.focus({ preventScroll: true }); }
  });

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
  // beside the step, or under or over it: whichever spot covers the least of the other steps (and none of this one),
  // nearest the step when spots tie, so the popover never hides the step a run flows on to. It may hang up to 32px below
  // the canvas, into the room around the component, when that is what keeps every step clear
  if (pb && size) {
    const pw = 240, ph = 150, G = 10, M = 6, OVER = 32;
    const me = pb;
    const others = Object.entries(boxes).filter(([id]) => id !== pop.id).map(([, o]) => o);
    const cxm = (me.l + me.r) / 2, cym = (me.t + me.b) / 2;
    const over = (x: number, y: number, o: Box) => Math.max(0, Math.min(x + pw, o.r) - Math.max(x, o.l)) * Math.max(0, Math.min(y + ph, o.b) - Math.max(y, o.t));
    const ys = [me.t - 40, cym - ph / 2, me.t, me.b - ph, M, H - ph - M, H - ph + OVER], xs = [cxm - pw / 2, me.l, me.r - pw, M, W - pw - M];
    const spots = [...ys.map(y => [me.r + G, y]), ...ys.map(y => [me.l - pw - G, y]), ...xs.map(x => [x, me.b + G]), ...xs.map(x => [x, me.t - ph - G])]
      .flatMap(([x, y]) => [[clamp(x, M, W - pw - M), clamp(y, M, H - ph - M)], [clamp(x, M, W - pw - M), clamp(y, M, H - ph + OVER)]]);
    let best = Infinity;
    for (const [x, y] of spots) {
      const hang = Math.max(0, y + ph - (H - M));
      const sc = others.reduce((a, o) => a + over(x, y, o), 0) + over(x, y, me) * 4 + hang * 20 + Math.hypot(x + pw / 2 - cxm, y + ph / 2 - cym) / 100;
      if (sc < best) { best = sc; px = x; py = y; }
    }
    // with its options open the popover moves up, if it must, to keep its list within that limit
    if (optsOpen && pop.field) py = Math.max(M, Math.min(py, H + OVER - ph - 12 - pop.field.options.length * 32));
  }
  const pick = (n: AutomationNode, v: string) => { setVals({ ...vals, [n.id]: v }); setOptsOpen(false); };

  // the picker: the groups its + or connector offers, filtered by the search
  const groups = !pk || !catalog ? [] : (pk.via === 'out' ? catalog.step : catalog[pk.via] ?? []).map(g => ({ g, items: g.items.filter(it => { const q = query.trim().toLowerCase(); return !q || it.title.toLowerCase().includes(q) || it.description.toLowerCase().includes(q); }) })).filter(x => x.items.length);
  const flat = groups.flatMap(({ g, items }) => items.map(it => ({ g, it })));
  const actI = flat.length ? Math.min(act, flat.length - 1) : -1;
  const uid = useRef(Math.random().toString(36).slice(2, 7)).current;
  const openPk = (from: string, via: AutomationVia, focus: boolean) => { setSel(null); setQuery(''); setAct(0); pkBack.current = from + ':' + via; setPk({ from, via, focus }); };
  const closePk = (back: boolean) => { const k = pkBack.current; const was = !!pkEl.current?.contains(document.activeElement); setPk(null); if (k && (back || was)) knobEls.current[k]?.focus({ preventScroll: true }); };
  const add = (i: number, focus: boolean) => {
    const f = flat[i]; if (!f || !pk) return;
    if (focus) pendingFocus.current = { from: pk.from, via: pk.via, had: new Set(nodes.map(n => n.id)) };
    setPk(null); onAddNode?.(f.it, pk.from, pk.via, f.g);
    const s = byId(pk.from); if (s) setLive(pk.via === 'out' ? `${f.it.title} added after ${s.title}` : `${f.it.title} added to ${s.title}`);
  };
  useIsoLayoutEffect(() => { if (pk?.focus) qiEl.current?.focus({ preventScroll: true }); if (lsEl.current) lsEl.current.scrollTop = 0; }, [pk]);
  // the option under the arrows stays in view
  useIsoLayoutEffect(() => {
    const ls = lsEl.current, o = ls?.querySelector<HTMLElement>('.dm-acx-o.dm-on'); if (!ls || !o) return;
    const t = o.offsetTop - ls.offsetTop, b = t + o.offsetHeight;
    if (t < ls.scrollTop) ls.scrollTop = t - 24; else if (b > ls.scrollTop + ls.clientHeight) ls.scrollTop = b - ls.clientHeight;
  }, [actI, pk]);
  useEffect(() => {
    if (!pk) return;
    const down = (e: PointerEvent) => { const t = e.target as Node, k = knobEls.current[pk.from + ':' + pk.via]; if (!pkEl.current?.contains(t) && !k?.contains(t)) setPk(null); };
    document.addEventListener('pointerdown', down); return () => document.removeEventListener('pointerdown', down);
  }, [pk]);
  const pkKey = (e: ReactKeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); if (flat.length) setAct(((actI + (e.key === 'ArrowDown' ? 1 : -1)) + flat.length) % flat.length); }
    else if (e.key === 'Enter') { e.preventDefault(); add(actI, true); }
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closePk(true); }
    else if (e.key === 'Tab') closePk(false);
  };
  // beside its + : to its right, under it, or to the side of its step, whichever covers the least of the steps (and none of
  // the one it adds to), nearest the + when spots tie, always inside the canvas
  let kx = 0, ky = 0;
  const pkKnob = pk && knobs.find(k => k.key === pk.from + ':' + pk.via), K = pkKnob && knobBox(pkKnob), S = pk && boxes[pk.from];
  if (pk && K && S && size) {
    const pw = pkEl.current?.offsetWidth || 248, ph = pkEl.current?.offsetHeight || 250, M = 6, G = 8, OVER = -M;
    const kcx = K.l + K.w / 2, kcy = K.t + K.h / 2;
    const over = (x: number, y: number, o: Box) => Math.max(0, Math.min(x + pw, o.r) - Math.max(x, o.l)) * Math.max(0, Math.min(y + ph, o.b) - Math.max(y, o.t));
    const others = Object.entries(boxes).filter(([id]) => id !== pk.from).map(([, b]) => b);
    const ys = [kcy - 40, K.t, K.b - ph, M, H - ph - M, H - ph + OVER], xs = [kcx - pw / 2, K.l, K.r - pw, S.l, S.r - pw, M, W - pw - M];
    const below = Math.max(K.b, pk.via === 'out' && !narrow ? S.b : K.b) + G;
    const spots = [...ys.map(y => [K.r + G, y]), ...ys.map(y => [Math.min(K.l, S.l) - pw - G, y]), ...xs.map(x => [x, below]), ...xs.map(x => [x, Math.min(K.t, S.t) - ph - G])]
      .map(([x, y]) => [clamp(x, M, W - pw - M), clamp(y, M, H - ph + OVER)]);
    let best = Infinity;
    for (const [x, y] of spots) { const sc = others.reduce((a, o) => a + over(x, y, o), 0) + (over(x, y, S) + over(x, y, K)) * 8 + Math.max(0, y + ph - (H - M)) * 20 + Math.hypot(x + pw / 2 - kcx, y + ph / 2 - kcy) / 100; if (sc < best) { best = sc; kx = x; ky = y; } }
  }
  const q = query.trim().toLowerCase();
  const marked = (t: string) => { const i = q ? t.toLowerCase().indexOf(q) : -1; return i < 0 ? t : <>{t.slice(0, i)}<mark>{t.slice(i, i + q.length)}</mark>{t.slice(i + q.length)}</>; };
  const src = pk && byId(pk.from);

  return (
    <div data-dm="" className={cx('dm-acx', className)}>
      <div className="dm-acx-top">
        <span className="dm-acx-name">{name}</span>
        {tag && <span className="dm-tag dm-ok dm-acx-on">{tag}</span>}
        <span className="dm-acx-sp" />
        {status !== undefined && <Swap className="dm-muted dm-acx-st">{status}</Swap>}
        {onRun && <button type="button" className="dm-pill dm-primary dm-sm dm-acx-run" onClick={() => { setSel(null); setPk(null); onRun(); }}><Icon name="play" size="xs" />{runLabel}</button>}
      </div>
      <div className="dm-acx-cv" ref={cv} onClick={() => { setSel(null); setPk(null); }}>
        <svg ref={svg} className={cx('dm-acx-svg', intro && 'dm-intro')} aria-hidden="true">
          {size && edges.map(e => geo[ek(e)] && <path key={ek(e)} data-e={ek(e)} className={cx(e[2] && 'dm-sub', flowing.some(f => same(f, e)) && 'dm-done')} d={dOf(geo[ek(e)])} />)}
          {/* the short stubs from a step to its + and its connectors */}
          {knobs.map(k => { const B = boxes[k.node.id], kb = knobBox(k); if (!B || !kb) return null;
            const o = outAt(B), d = k.via === 'out' ? (o.d === 'd' ? `M${kb.l + 10} ${B.b}V${kb.t}` : `M${B.r} ${kb.t + 10}H${kb.l}`) : `M${kb.l + kb.w / 2} ${B.b}V${kb.t}`;
            return <path key={'s:' + k.key} className="dm-stub" d={d} />; })}
        </svg>
        <div className={cx('dm-acx-nodes', drag && 'dm-drag')}>
          {nodes.map((n, i) => {
            const B = boxes[n.id];
            return (
              <button type="button" key={n.id} ref={el => { els.current[n.id] = el; }} aria-expanded={sel === n.id}
                className={cx('dm-acx-n', n.attach ? 'dm-add' : 'dm-acx-in', isSub(n) && 'dm-sm', drag === n.id && 'dm-drag', sel === n.id && 'dm-sel', n.state === 'run' && 'dm-run')}
                style={{ animationDelay: n.attach ? undefined : i * 90 + 'ms', left: B ? B.l : 0, top: B ? B.t : 0, width: widthOf(n) === 176 ? undefined : widthOf(n), visibility: B ? undefined : 'hidden' }}
                onPointerDown={ev => startDrag(ev, n.id)}
                onClick={ev => { ev.stopPropagation(); if (dropped.current) { dropped.current = false; return; } setPk(null); keyOpen.current = sel !== n.id && ev.detail === 0; setSel(sel === n.id ? null : n.id); }}
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
          {knobs.map(k => {
            const kb = knobBox(k); const open = pk?.from === k.node.id && pk.via === k.via;
            const toggle = (ev: ReactMouseEvent) => { ev.stopPropagation(); if (open) closePk(true); else openPk(k.node.id, k.via, ev.nativeEvent.isTrusted); };
            const style = { left: kb?.l ?? 0, top: kb?.t ?? 0 };
            return k.via === 'out'
              ? <Tip key={k.key} label="Add a step" off={open}><button type="button" ref={el => { knobEls.current[k.key] = el; }} className="dm-acx-h" style={style} aria-haspopup="dialog" aria-expanded={open} aria-label={`Add a step after ${k.node.title}`} onClick={toggle}><Icon name="plus" size="xs" /></button></Tip>
              : <button type="button" key={k.key} ref={el => { knobEls.current[k.key] = el; }} className="dm-acx-sc" style={style} aria-haspopup="dialog" aria-expanded={open} aria-label={`Add ${k.via === 'model' ? 'a model' : 'a tool'} to ${k.node.title}`} onClick={toggle}><Icon name="plus" size="xs" /><span>{KIND[k.via]}</span></button>;
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
        {catalog && (
          <div ref={pkEl} className={cx('dm-pop dm-acx-pk', !!pk && 'dm-open')} role="dialog" inert={!pk} style={{ left: kx, top: ky }} onClick={e => e.stopPropagation()} onKeyDown={pkKey}
            aria-label={src ? (pk!.via === 'out' ? `Add a step after ${src.title}` : `Add ${pk!.via === 'model' ? 'a model' : 'a tool'} to ${src.title}`) : 'Add a step'}>
            <div className="dm-acx-q"><Icon name="search" size="xs" />
              <input ref={qiEl} className="dm-acx-qi" type="text" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls={`dm-acx-ls-${uid}`}
                aria-activedescendant={actI >= 0 ? `dm-acx-o-${uid}-${actI}` : undefined} placeholder={searchLabel} aria-label={searchLabel} autoComplete="off" spellCheck={false}
                value={query} onChange={e => { setQuery(e.target.value); setAct(0); }} />
            </div>
            <div ref={lsEl} className="dm-acx-ls" role="listbox" id={`dm-acx-ls-${uid}`} aria-label="Steps">
              {groups.length ? groups.map(({ g, items }) => (
                <div key={g.id} role="group" aria-labelledby={`dm-acx-g-${uid}-${g.id}`}>
                  <div className="dm-acx-gh" id={`dm-acx-g-${uid}-${g.id}`}>{g.label}</div>
                  {items.map(it => { const i = flat.findIndex(f => f.it === it); return (
                    <div key={it.id} id={`dm-acx-o-${uid}-${i}`} role="option" aria-selected={i === actI} aria-describedby={`dm-acx-od-${uid}-${i}`} className={cx('dm-acx-o', i === actI && 'dm-on')}
                      data-id={it.id} onPointerMove={() => { if (i !== actI) setAct(i); }} onClick={e => { e.stopPropagation(); add(i, e.nativeEvent.isTrusted); }}>
                      <span className="dm-ic" style={{ color: g.color, background: `color-mix(in srgb,${g.color} 14%,transparent)` }}><Icon name={it.icon} size="xs" /></span>
                      <span>{marked(it.title)}</span><span id={`dm-acx-od-${uid}-${i}`} hidden>{it.description}</span>
                    </div>
                  ); })}
                </div>
              )) : <p className="dm-acx-pe">No steps match “{query.trim()}”</p>}
            </div>
            <p className="dm-acx-pd" aria-hidden="true">{actI >= 0 ? flat[actI].it.description : 'Try another word'}</p>
          </div>
        )}
      </div>
      <p className="dm-acx-live" aria-live="polite">{live}</p>
    </div>
  );
}
