'use client';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion, useSeconds } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Brand, type BrandName } from '../../lib/brands';
import { avatarInk, Tip, useGrow } from '../../lib/motion';
import { useHoverGlide } from '../../lib/glide';
import '../../designme.css';
import './agent-tree.css';

export type AgentNodeStatus = 'queued' | 'running' | 'waiting' | 'done' | 'failed';

export interface AgentNode {
  id: string;
  /** Like "Research", or a step's name */
  name: string;
  /** What it is on now, after its name. A running step's line shimmers, and a new line rises into place */
  task: string;
  status: AgentNodeStatus;
  /** An agent's avatar colour, like 'var(--dm-av-l)'. The avatar is that colour with its ink; the root's is ink */
  color?: string;
  /** The icon on its avatar, or on a step's plain tile */
  icon?: IconName;
  /** The app a step works in: its logo on a plain tile, in place of the icon */
  app?: BrandName;
  /** What this node spent on its own, in dollars. A branch shows this plus everything under it */
  cost?: number;
  /** Tokens this node used on its own. The line under the tree adds up a branch's */
  tokens?: number;
  /** Seconds this node has run. Leave it out and a running node counts by itself */
  seconds?: number;
  /** A failed step the orchestrator has moved to another step (a retry): its row fades back and it stops counting as failed */
  rerouted?: boolean;
  /** A way on from a failed step, shown as a small button under it */
  fix?: { label: string; onClick: () => void };
  /** While the node is waiting: Approve (the accent), and Hold when onHold is given */
  approval?: { approveLabel?: string; holdLabel?: string; onApprove: () => void; onHold?: () => void };
  children?: AgentNode[];
}

export interface AgentTreeProps {
  /** The orchestrator, with its agents and their steps as children. A node added later draws its line in, then rises in */
  root: AgentNode;
  /** The run's goal, like "Redesign the pricing page" */
  title: string;
  /** The status in the header. Defaults to "3 running", "Needs you", "1 failed", "Wrapping up" or "Done" */
  status?: string;
  /** The run's time, shown as m:ss. Leave it out and it counts until the root is done */
  seconds?: number;
  /** Ids of the folded branches. Leave it out to let each branch fold from its chevron */
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (ids: string[]) => void;
  /** The picked node, whose cost split shows under the tree (the whole run's while it is null) */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string) => void;
  /** Writes a cost. Defaults to dollars and cents, like "$0.12" */
  formatCost?: (dollars: number) => string;
  /** panel draws the surface; bare leaves it off, for a tree inside a chat or a side panel */
  variant?: 'panel' | 'bare';
  /** Hides the header, for a tree under a header that already names the run */
  slim?: boolean;
  className?: string;
  /** On the root element */
  style?: CSSProperties;
}

type Flat = { n: AgentNode; lv: number; parent?: AgentNode };
const S_OF: Record<AgentNodeStatus, string> = { queued: 'queued', running: 'run', waiting: 'wait', done: 'done', failed: 'fail' };
const WORD: Record<AgentNodeStatus, string> = { queued: 'queued', running: 'running', waiting: 'needs you', done: 'done', failed: 'failed' };
const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
const toks = (v: number) => v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(Math.round(v));
const sum = (n: AgentNode): number => (n.cost ?? 0) + (n.children ?? []).reduce((a, k) => a + sum(k), 0);
const sumTok = (n: AgentNode): number => (n.tokens ?? 0) + (n.children ?? []).reduce((a, k) => a + sumTok(k), 0);
const walk = (n: AgentNode, lv: number, parent: AgentNode | undefined, out: Flat[]) => { out.push({ n, lv, parent }); n.children?.forEach(k => walk(k, lv + 1, n, out)); return out; };
const kinds = (k: number, lv: number) => `${k} ${lv ? (k === 1 ? 'step' : 'steps') : (k === 1 ? 'agent' : 'agents')}`;

/* ---------- the lines and the flow ----------
   The same drawing as the site's (agentTree's atrLines): read from the rows on the page every frame, so a line never trails
   a row that moved. A row added after the first render opens its space (data-ph="open"), its parent's line draws down to it
   and its branch out to its mark (data-ph="wait"), then it rises in (data-ph="in"), one row at a time. A parent's line is a
   grey rail with its tinted part over it, down to the last child that has started; a branch takes the tint once the tint
   reaches it, the grey while its child is queued, and the bad colour for a failed child. Each agent's band eases from the
   run's source to the step that agent is on, once that whole route is drawn */
const markR = (m?: string) => m === 'done' || m === 'fail' || m === 'src' || m === 'wait' ? 9 : 7;
const ez = (u: number) => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), 3);
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Rec = any;
function treeLines(tree: HTMLElement, reduced: () => boolean) {
  const NS = 'http://www.w3.org/2000/svg', mk = (t: string, a: Record<string, string> = {}) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e as SVGElement & SVGPathElement; };
  const svg = tree.querySelector<SVGSVGElement>(':scope>.dm-atr-ln') ?? (() => { const s = mk('svg', { class: 'dm-atr-ln', 'aria-hidden': 'true' }); tree.prepend(s); return s; })();
  const defs = mk('defs'), gRail = mk('g'), gLine = mk('g'), gBand = mk('g');
  svg.replaceChildren(defs, gRail, gLine, gBand);
  const uid = 'dm-atr' + Math.random().toString(36).slice(2, 8), host = tree.closest<HTMLElement>('.dm-atr') ?? tree;
  const OPEN = .22, BR = .16, TINT = .3, GO = .14, BAND = 210, CORE = .541, STOPS: [number, string][] = [[0, 'dm-l0'], [.19, 'dm-l1'], [CORE, 'dm-c'], [.781, 'dm-l2'], [1, 'dm-l0']];
  const S = new Map<string, Rec>(), bands = new Map<string, Rec>(), queue: Rec[] = [];
  let T = 0, last = 0, booted = false, prev: Rec = null, bn = 0;
  const shown = (x: Rec) => x.ph === 'in' || x.ph === 'shown';
  const folded = (x: Rec) => { for (let p = x.parent; p; p = p.parent) if (p.el.getAttribute('aria-expanded') === 'false') return true; return false; };
  const draw = (p: SVGPathElement, d: string, cls: string, reveal = 1) => {
    p.setAttribute('d', reveal > .001 ? d : ''); p.setAttribute('class', cls);
    if (reveal >= 1 || !d) { p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; return; }
    const len = p.getTotalLength(); p.style.strokeDasharray = String(len); p.style.strokeDashoffset = String(len * (1 - reveal));
  };
  const restart = (el: Element, a: string) => { el.removeAttribute(a); void (el as HTMLElement).offsetWidth; el.setAttribute(a, ''); };
  function gone(x: Rec) { for (const k of ['pr', 'pt', 'pb']) x[k]?.remove(); S.delete(x.id); const i = queue.indexOf(x); if (i >= 0) queue.splice(i, 1); }
  function sync() {
    const red = reduced(), els = [...tree.querySelectorAll<HTMLElement>('.dm-atr-n')].filter(el => !el.closest('[hidden]')), seen = new Set<string>();
    for (const el of els) {
      const id = el.dataset.id!; seen.add(id);
      let x = S.get(id);
      if (!x || x.el !== el) {
        if (x) gone(x);
        x = { id, el, q: 0, b: 0, ph: 'shown', rt: null, rf: null, r0: -1e9, fol: false };
        if (booted && !red) { x.ph = 'open'; el.dataset.ph = 'open'; el.style.height = '0px'; queue.push(x); }
        else { x.q = 1; x.b = 1; x.boot = true; el.removeAttribute('data-ph'); el.style.height = ''; }
        S.set(id, x);
      }
      x.st = el.dataset.s; x.g = el.querySelector(':scope>.dm-atr-b>.dm-atr-r>.dm-atr-g'); x.sub = el.querySelector(':scope>.dm-atr-b>.dm-atr-r .dm-atr-sub');
      const m = x.g ? x.g.dataset.m : '';
      if (x.m !== undefined && m !== x.m && (m === 'done' || m === 'fail') && !red) restart(x.g, 'data-drw');
      x.m = m;
      const t = x.sub ? x.sub.textContent : '';
      if (x.t !== undefined && t !== x.t && x.ph === 'shown' && !red) restart(x.sub, 'data-sw');
      x.t = t;
    }
    for (const x of [...S.values()]) if (!seen.has(x.id)) gone(x);
    for (const x of S.values()) { const p = x.el.parentElement?.closest('.dm-atr-n') as HTMLElement | null; x.parent = p && S.get(p.dataset.id!) || null; x.kids = []; }
    for (const el of els) { const x = S.get(el.dataset.id!); if (x.parent) x.parent.kids.push(x); }
    booted = true;
  }
  function along(p: SVGPathElement, len: number, t: number) {
    if (t >= 0 && t <= len) return p.getPointAtLength(t);
    const q = p.getPointAtLength(t < 0 ? 0 : len), r = p.getPointAtLength(t < 0 ? Math.min(len, 1) : Math.max(0, len - 1)), dx = q.x - r.x, dy = q.y - r.y, m = Math.hypot(dx, dy) || 1, k = t < 0 ? -t : t - len;
    return { x: q.x + dx / m * k, y: q.y + dy / m * k };
  }
  function band(id: string) {
    const gid = `${uid}-b${++bn}`, gr = mk('linearGradient', { id: gid, gradientUnits: 'userSpaceOnUse' });
    STOPS.forEach(([o, k]) => gr.append(mk('stop', { class: k, offset: String(o) }))); defs.append(gr);
    const el = mk('g', { class: 'dm-atr-bd', 'data-a': id }), core = mk('path', { stroke: `url(#${gid})` }); el.append(core); el.style.opacity = '0'; gBand.append(el);
    const f: Rec = { el, gr, core, start: null, end: false, to: null }; bands.set(id, f); return f;
  }
  function frame(t: number) {
    const dt = last ? Math.max(0, Math.min(.05, (t - last) / 1000)) : 0; last = Math.max(last, t); T += dt;
    sync();
    const red = reduced(), cs = getComputedStyle(host), R = parseFloat(cs.getPropertyValue('--dm-atr-r')) || 8, cut = cs.getPropertyValue('--dm-atr-cut').trim() === '1';
    if (red) for (const x of queue.splice(0)) { x.ph = 'shown'; x.el.removeAttribute('data-ph'); x.el.style.height = ''; x.q = x.b = 1; }
    if (!prev || !S.has(prev.id) || shown(prev)) {
      const nx = queue[0];
      if (nx && (!nx.parent || shown(nx.parent))) { queue.shift(); prev = nx; nx.ph = 'opening'; nx.t1 = T; nx.el.style.height = ''; nx.nh = nx.el.offsetHeight; nx.el.style.height = '0px'; }
    }
    for (const x of S.values()) if (x.ph === 'opening') {
      const u = (T - x.t1) / OPEN;
      if (u >= 1) { x.el.style.height = ''; x.ph = 'wait'; x.el.dataset.ph = 'wait'; } else x.el.style.height = (x.nh * ez(u)).toFixed(2) + 'px';
    }
    const tb = tree.getBoundingClientRect(), sc = tb.width / (tree.offsetWidth || tb.width) || 1;
    for (const x of S.values()) { const b = x.g.getBoundingClientRect(); x.cx = (b.left + b.width / 2 - tb.left) / sc; x.cy = (b.top + b.height / 2 - tb.top) / sc; x.r = markR(x.m); }
    const corner = (x0: number, y: number, x1: number) => cut ? `L${x1} ${y}` : `Q${x0} ${y} ${x1} ${y}`;
    for (const P of S.values()) {
      if (!P.kids.length && !P.pr) continue;
      if (!P.pr) { P.pr = mk('path', { 'data-p': P.id }); gRail.append(P.pr); P.pt = mk('path', { 'data-p': P.id }); gLine.append(P.pt); }
      const x0 = P.cx, y0 = P.cy + P.r - 1;
      let cur = y0, end = y0;
      for (const k of P.kids) {
        const want = k.ph !== 'open' && k.ph !== 'opening' && !folded(k), y = k.cy - R;
        if (want && k.q < 1) { if (k.q0 == null) { k.qd = red ? 0 : Math.min(.26, Math.max(.1, (y - cur) / 520)); k.q0 = T - k.q * k.qd; } k.q = k.qd ? Math.min(1, (T - k.q0) / k.qd) : 1; }
        else if (!want) { k.q0 = null; k.q = red ? 0 : Math.max(0, k.q - dt / GO); }
        k.on = want;
        if (k.q > 0) { cur = k.q >= 1 ? y : cur + (y - cur) * ez(k.q); end = Math.max(end, cur); }
      }
      draw(P.pr, end - y0 > 2 ? `M${x0} ${y0}V${end}` : '', 'dm-r');
      let to: Rec = null; for (const k of P.kids) if (k.q > 0 && k.st !== 'queued') to = k;
      if (to !== P.rt) { P.rf = P.ru >= 1 || P.boot ? P.rt : P.rf; P.rt = to; P.r0 = P.boot ? -1e9 : T; P.fol = !!to && to.q < 1; }
      P.ru = P.fol || red ? 1 : Math.min(1, (T - P.r0) / TINT);
      const yOf = (k: Rec) => k && S.has(k.id) ? k.cy - R : y0, reach = Math.min(end, yOf(P.rf) + (yOf(P.rt) - yOf(P.rf)) * ez(P.ru));
      draw(P.pt, reach - y0 > 2 ? `M${x0} ${y0}V${reach}` : '', 'dm-on');
      for (const k of P.kids) {
        if (!k.pb) { k.pb = mk('path', { 'data-k': k.id }); gLine.append(k.pb); }
        const y = k.cy - R; k.lit = k.st !== 'queued' && reach >= y - .5;
        if (k.on && k.q >= 1) { if (k.b0 == null && (k.st === 'queued' || k.lit)) k.b0 = T - k.b * BR; if (k.b0 != null) k.b = red ? 1 : Math.min(1, (T - k.b0) / BR); }
        else if (!k.on) { k.b0 = null; k.b = red ? 0 : Math.max(0, k.b - dt / GO); }
        // (a cut corner starts half a line's width up the parent's line, so its sharp joint is drawn whole, with no notch)
        draw(k.pb, `M${x0} ${cut ? y - .75 : y}` + (cut ? `L${x0} ${y}` : '') + corner(x0, k.cy, x0 + R) + `L${k.cx - k.r + 1} ${k.cy}`, k.st === 'fail' ? 'dm-bad' : k.lit ? 'dm-on' : 'dm-r', k.b);
        if (k.ph === 'wait' && k.b >= 1) { k.ph = 'in'; k.el.dataset.ph = 'in'; k.tin = T; }
      }
      P.boot = false;
    }
    for (const x of S.values()) if (x.ph === 'in' && T - x.tin > .6) { x.ph = 'shown'; x.el.removeAttribute('data-ph'); }
    const root = [...S.values()].find(x => !x.parent), agentOf = (x: Rec) => { while (x.parent && x.parent.parent) x = x.parent; return x; };
    const want = new Map<string, Rec>();
    for (const x of S.values()) if (x.parent && x.st === 'run' && shown(x) && !x.kids.some((k: Rec) => k.st === 'run' && shown(k))) want.set(agentOf(x).id, x);
    for (const [id, f] of bands) if (!want.has(id)) f.end = true;
    for (const [id, x] of want) { const f = bands.get(id) ?? band(id); f.to = x; f.end = false; }
    const drop = (id: string, f: Rec) => { f.el.remove(); f.gr.remove(); bands.delete(id); };
    for (const [id, f] of bands) {
      const chain: Rec[] = []; for (let x = f.to; x; x = x.parent) chain.unshift(x);
      const ready = root && chain[0] === root && chain.slice(1).every(x => S.has(x.id) && x.q >= 1 && x.b >= 1 && x.lit && shown(x) && !folded(x));
      if (!ready || red) { f.el.style.opacity = '0'; f.start = null; if (f.end) drop(id, f); continue; }
      let d = `M${root.cx} ${root.cy + root.r - 1}`, px = root.cx;
      for (const x of chain.slice(1)) { d += `L${px} ${x.cy - R}` + corner(px, x.cy, px + R) + `L${x.cx} ${x.cy}`; px = x.cx; }
      f.core.setAttribute('d', d); const len = f.core.getTotalLength();
      if (f.start == null || (!f.end && T - f.start >= f.trip + .35)) { if (f.end) { drop(id, f); continue; } f.start = T; f.len0 = len; f.trip = Math.min(3.4, Math.max(1.8, len / 170)); }
      const u = (T - f.start) / f.trip;
      if (u >= 1) { f.el.style.opacity = '0'; if (f.end) drop(id, f); continue; }
      f.el.style.opacity = Math.min(1, u / .18, (1 - u) / .22).toFixed(3);
      const at = Math.min(len, (.5 - Math.cos(Math.PI * u) / 2) * f.len0), t0 = at - BAND * CORE, a = along(f.core, len, t0), b = along(f.core, len, t0 + BAND);
      f.core.style.strokeDasharray = `${BAND} ${len + BAND * 2}`; f.core.style.strokeDashoffset = String(-t0);
      f.gr.setAttribute('x1', String(a.x)); f.gr.setAttribute('y1', String(a.y)); f.gr.setAttribute('x2', String(b.x + (a.x === b.x ? .01 : 0))); f.gr.setAttribute('y2', String(b.y + (a.y === b.y ? .01 : 0)));
    }
  }
  return { sync, frame };
}

/** What a mark holds in each state: a ring, a spinner, the waiting ring, or a tick or cross on the finished disc */
function Mark({ m }: { m: string }) {
  return (
    <span className="dm-atr-g" data-m={m} aria-hidden="true">
      {m === 'run' ? <span className="dm-atr-spin" /> : m === 'wait' ? <span className="dm-atr-wt" /> : m === 'done' ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength={1} /></svg>
        : m === 'fail' ? <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" pathLength={1} /></svg> : m === 'src' ? null : <span className="dm-atr-ring" />}
    </span>
  );
}

/** An orchestrator and the agents it hands work to, as a tree that grows while the run plays. A parent's line runs down
    from its mark and each child branches off it; a band of the accent eases down to whatever each agent is on. Each row
    shows its time and cost, and a branch adds up everything under it. Arrow keys move through it as a tree view. */
export function AgentTree({ root, title, status, seconds, collapsed, defaultCollapsed = [], onCollapsedChange, selected, defaultSelected = null, onSelectedChange, formatCost, variant = 'panel', slim = false, className, style }: AgentTreeProps) {
  const [shut, setShut] = useControllable(collapsed, defaultCollapsed, onCollapsedChange);
  const [sel, setSel] = useControllable<string | null>(selected, defaultSelected, v => { if (v) onSelectedChange?.(v); });
  const [focus, setFocus] = useState(root.id);
  const treeRef = useRef<HTMLDivElement>(null);
  // Clean's one hover glides from row to row, and the picked agent keeps its stronger fill
  useHoverGlide(treeRef, '.dm-atr-b', { keep: '[aria-selected="true"]>.dm-atr-b' });
  // the panel grows with its rows and shrinks as a branch folds, staying centred where it is centred (owner, 17 Nov: no room
  // kept for a later state)
  const [growRef, growIn] = useGrow();
  const reduce = useReducedMotion(), red = useRef(reduce); red.current = reduce;
  const finished = root.status === 'done';
  const counted = useSeconds(seconds === undefined && !finished);
  const secs = seconds ?? counted;
  const money = formatCost ?? ((v: number) => '$' + v.toFixed(2));

  const all = walk(root, 0, undefined, []);
  const byId = (id?: string | null) => all.find(x => x.n.id === id);

  // each running node without its own seconds counts by itself, from when it was first seen running
  const runs = useRef(new Map<string, { t0: number; base: number }>());
  const [, tick] = useState(0);
  const counting = all.some(x => x.n.status === 'running' && x.n.seconds === undefined);
  useEffect(() => { if (!counting) return; const id = setInterval(() => tick(t => t + 1), 1000); return () => clearInterval(id); }, [counting]);
  const own = (n: AgentNode) => {
    if (n.seconds !== undefined) return n.seconds;
    const r = runs.current.get(n.id), now = Date.now();
    if (n.status === 'running') { if (!r) { runs.current.set(n.id, { t0: now, base: 0 }); return 0; } if (!r.t0) r.t0 = now - r.base * 1000; return (now - r.t0) / 1000; }
    if (r && r.t0) { r.base = (now - r.t0) / 1000; r.t0 = 0; }
    return r ? r.base : 0;
  };

  // the lines: drawn every animation frame while the tree is near the screen; new rows get their phase before they paint
  const lines = useRef<ReturnType<typeof treeLines> | null>(null);
  useIsoLayoutEffect(() => { const t = treeRef.current; if (t) lines.current = treeLines(t, () => red.current); }, []);
  // (and redrawn as it commits, so a row that moved never paints with last frame's lines)
  useIsoLayoutEffect(() => { const t = treeRef.current; if (t && t.isConnected) lines.current?.frame(performance.now()); });
  useEffect(() => {
    const t = treeRef.current; if (!t) return;
    let raf = 0, near = true;
    const io = new IntersectionObserver(e => { near = e[e.length - 1].isIntersecting; }, { rootMargin: '200px 0px' }); io.observe(t);
    const f = (now: number) => { if (near) lines.current?.frame(now); raf = requestAnimationFrame(f); };
    raf = requestAnimationFrame(f);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, []);

  // a few moments are announced: a step that needs you, a failure and the end of the run
  const [said, setSaid] = useState('');
  const states = useRef<Map<string, AgentNodeStatus> | null>(null);
  useEffect(() => {
    const was = states.current, now = new Map(all.map(x => [x.n.id, x.n.status])); states.current = now;
    if (!was) return;
    for (const { n, parent } of all) {
      if (was.get(n.id) === n.status) continue;
      if (!parent && n.status === 'done') setSaid('Run finished');
      else if (n.status === 'failed') setSaid(`${n.name} failed: ${n.task}`);
      else if (n.status === 'waiting') setSaid(`${n.name} needs you`);
    }
  });

  const isOpen = (n: AgentNode) => !shut.includes(n.id);
  const toggle = (n: AgentNode, open = !isOpen(n)) => { if (n.children?.length) setShut(open ? shut.filter(id => id !== n.id) : [...shut, n.id]); };
  const rowEl = (id: string) => treeRef.current?.querySelector<HTMLElement>(`.dm-atr-n[data-id="${CSS.escape(id)}"]`);
  // the rows a person can reach: on show, and not inside a folded branch
  const reachable = () => all.filter(x => { const ph = rowEl(x.n.id)?.dataset.ph; if (ph === 'open' || ph === 'wait') return false; for (let p = x.parent; p; p = byId(p.id)?.parent) if (!isOpen(p)) return false; return true; });
  const pick = (n: AgentNode) => { setFocus(n.id); setSel(n.id); rowEl(n.id)?.focus({ preventScroll: true }); };
  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const tgt = e.target as HTMLElement;
    if (tgt.closest('button')) { if (e.key === 'Escape') { const id = (tgt.closest('.dm-atr-n') as HTMLElement | null)?.dataset.id, x = byId(id); if (x) { e.preventDefault(); pick(x.n); } } return; }
    const visible = reachable(), i = visible.findIndex(x => x.n.id === tgt.dataset.id); if (i < 0) return;
    const { n, parent } = visible[i], k = n.children?.length ?? 0; let go: AgentNode | undefined;
    if (e.key === 'ArrowDown') go = visible[i + 1]?.n;
    else if (e.key === 'ArrowUp') go = visible[i - 1]?.n;
    else if (e.key === 'ArrowRight') { if (k && !isOpen(n)) toggle(n, true); else if (k) go = n.children![0]; }
    else if (e.key === 'ArrowLeft') { if (k && isOpen(n)) toggle(n, false); else go = parent; }
    else if (e.key === 'Home') go = visible[0].n;
    else if (e.key === 'End') go = visible[visible.length - 1].n;
    else if (e.key === 'Enter' || e.key === ' ') { const b = rowEl(n.id)?.querySelector<HTMLButtonElement>(':scope>.dm-atr-b>.dm-atr-ask button'); if (b) b.focus(); else pick(n); }
    else return;
    e.preventDefault(); if (go) pick(go);
  };
  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement, row = t.closest<HTMLElement>('.dm-atr-n'); if (!row || t.closest('button')) return;
    const x = byId(row.dataset.id); if (!x) return;
    if (t.closest('.dm-atr-tg')) { toggle(x.n); return; }
    pick(x.n);
  };

  // the header: Done, Needs you, failures nobody has rerouted, how many are running, or Wrapping up between steps
  const running = all.filter(x => x.lv && x.n.status === 'running').length, waiting = all.some(x => x.n.status === 'waiting');
  const failed = all.filter(x => x.n.status === 'failed' && !x.n.rerouted).length;
  const line = status ?? (finished ? 'Done' : waiting ? 'Needs you' : failed && !running ? `${failed} failed` : running ? `${running} running` : all.some(x => x.lv && x.n.status === 'done') ? 'Wrapping up' : 'Starting');
  const runState = finished ? 'done' : waiting ? 'wait' : failed && !running ? 'fail' : 'run';
  const picked = byId(sel) ?? all[0], pk = picked.n.children?.length ?? 0;
  const split = pk ? ` · its own ${money(picked.n.cost ?? 0)} · ${kinds(pk, picked.lv)} ${money(sum(picked.n) - (picked.n.cost ?? 0))}` : ` · ${money(picked.n.cost ?? 0)}`;

  const node = (n: AgentNode, lv: number): ReactNode => {
    const k = n.children?.length ?? 0, v = k ? sum(n) : (n.cost ?? 0), s = S_OF[n.status], m = lv ? s : s === 'fail' ? 'fail' : 'src', t = own(n);
    const who = n.app ? <span className="dm-atr-av dm-app" aria-hidden="true"><Brand name={n.app} /></span>
      : <span className={cx('dm-atr-av', !n.color && lv > 0 && 'dm-app')} aria-hidden="true" style={n.color ? { '--dm-a': n.color, '--dm-ai': avatarInk(n.color) ?? '#fff' } as CSSProperties : undefined}><Icon name={n.icon ?? (lv ? 'cpu' : 'spark')} size="xs" /></span>;
    const cost = <span className="dm-atr-c">{n.status === 'queued' && !v ? '' : money(v)}</span>;
    const ask = n.status === 'failed' && n.fix && !n.rerouted
      ? <div className="dm-atr-ask"><button type="button" className="dm-pill dm-sm dm-line dm-atr-fix" onClick={n.fix.onClick}>{n.fix.label}</button></div>
      : n.status === 'waiting' && n.approval
        ? <div className="dm-atr-ask"><button type="button" className="dm-pill dm-sm dm-primary dm-atr-yes" onClick={n.approval.onApprove}>{n.approval.approveLabel ?? 'Approve'}</button>{n.approval.onHold && <button type="button" className="dm-pill dm-sm dm-line dm-atr-no" onClick={n.approval.onHold}>{n.approval.holdLabel ?? 'Hold'}</button>}</div>
        : null;
    return (
      <div key={n.id} className="dm-atr-n" role="treeitem" aria-level={lv + 1} aria-selected={sel === n.id} aria-expanded={k ? isOpen(n) : undefined}
        aria-label={`${n.name}, ${WORD[n.status]}, ${n.task}${v ? ', ' + money(v) : ''}`} tabIndex={focus === n.id ? 0 : -1}
        data-id={n.id} data-s={s} data-dim={n.rerouted ? '' : undefined} style={{ '--dm-lv': lv } as CSSProperties}>
        <div className="dm-atr-b">
          <div className="dm-atr-r">
            <Mark key={m} m={m} />
            {who}
            <span className="dm-atr-w">
              <span className="dm-atr-tx"><span className="dm-atr-nm">{n.name}</span>{k > 0 && <span className="dm-atr-tg dm-mx-press" aria-hidden="true"><Icon name="chev-d" size="xs" /></span>}<span className="dm-atr-sub">{n.task}</span></span>
              <span className="dm-atr-q dm-num">
                {t >= 1 && <span className="dm-atr-sec"><span>{Math.floor(t)}s</span><span aria-hidden="true"> ·</span></span>}
                {k ? <Tip label={`Its own ${money(n.cost ?? 0)}, ${kinds(k, lv)} ${money(v - (n.cost ?? 0))}`}>{cost}</Tip> : cost}
              </span>
            </span>
          </div>
          {ask}
        </div>
        {k > 0 && (
          <div className={cx('dm-fold dm-atr-kids', !isOpen(n) && 'dm-shut')} inert={!isOpen(n)}>
            <div role="group">{n.children!.map(c => node(c, lv + 1))}</div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div data-dm="" ref={growRef} className={cx('dm-atr', 'dm-growing', variant === 'panel' ? 'dm-panel' : 'dm-bare', slim && 'dm-slim', className)} data-s={runState} style={style}>
      <div className="dm-grow" ref={growIn}>
      <div className="dm-atr-h">
        <div className="dm-atr-hd"><b className="dm-atr-t">{title}</b><span className="dm-atr-s"><span className="dm-atr-dot" aria-hidden="true" /><span className="dm-atr-m">{line}</span><span aria-hidden="true">·</span><span className="dm-atr-time dm-num">{clock(secs)}</span></span></div>
        <span className="dm-atr-tot dm-num">{money(sum(root))}</span>
      </div>
      <div ref={treeRef} className="dm-atr-tree dm-mx-glide" role="tree" aria-label="Agents" onKeyDown={onKey} onClick={onClick}>
        <svg className="dm-atr-ln" aria-hidden="true" />
        {node(root, 0)}
      </div>
      <p className="dm-atr-f"><b>{picked.n.name}</b>{split} · {toks(sumTok(picked.n))} tokens</p>
      <p className="dm-atr-sr" role="status">{said}</p>
      </div>
    </div>
  );
}
