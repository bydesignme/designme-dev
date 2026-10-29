'use client';
import { useEffect, useId, useRef, useState, type DragEvent, type KeyboardEvent as ReactKeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Tip } from '../../lib/motion';
import '../../designme.css';
import './step-library.css';

/** One step people can add */
export interface StepLibraryStep {
  id: string;
  icon: IconName;
  /** Like "Summarize text". The search matches it */
  name: string;
  /** What it does, in a sentence. Shown in the preview */
  description: string;
  /** What it needs, like "Any text, like a thread or a transcript" */
  takes?: string;
  /** What it passes on, like "A summary" */
  gives?: string;
}

/** A group of steps, like Tools or Logic. Its rows fold away under its header */
export interface StepLibraryGroup {
  id: string;
  /** Like "Tools". Typing the start of it finds the whole group */
  label: string;
  /** Its icons' colour, like 'var(--dm-pb)'. Each icon tile is a light tint of it */
  color: string;
  /** The icon's own colour when it differs from its tile's, like 'var(--dm-accent-fg)' for an accent tile */
  iconColor?: string;
  steps: StepLibraryStep[];
}

/** A step in the workflow beside the panel */
export interface StepLibraryFlowStep {
  key: string;
  icon: IconName;
  color: string;
  name: string;
  /** The quiet line under it, like its group */
  detail?: string;
}

export type StepLibraryAddVia = 'click' | 'keyboard' | 'drop';

export interface StepLibraryProps {
  groups: StepLibraryGroup[];
  /** Called when a step is added: by a click, by Enter (on a row, or in the search for the first match), or by a drop on the workflow */
  onAdd?: (step: StepLibraryStep, group: StepLibraryGroup, via: StepLibraryAddVia) => void;
  /** The workflow beside the panel: its name and steps. Leave it out to show the panel on its own; the preview still opens beside it */
  workflow?: { title: string; steps: StepLibraryFlowStep[] };
  /** What is typed in the search. Leave it out to let the panel keep it */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** The ids of the folded groups. A search opens any folded group it finds something in */
  collapsed?: string[];
  defaultCollapsed?: string[];
  onCollapsedChange?: (ids: string[]) => void;
  /** Rows can be dragged into the workflow. Defaults to true when there is a workflow */
  draggable?: boolean;
  title?: string;
  placeholder?: string;
  /** The line at the foot of the preview */
  previewHint?: string;
  dropLabel?: string;
  className?: string;
}

const MIME = 'application/x-designme-step';
const marked = (name: string, v: string): ReactNode => {
  const i = v ? name.toLowerCase().indexOf(v) : -1;
  return i < 0 ? name : <>{name.slice(0, i)}<mark>{name.slice(i, i + v.length)}</mark>{name.slice(i + v.length)}</>;
};
const tile = (icon: IconName, color: string, iconColor?: string) => (
  <span className="dm-ic" style={{ color: iconColor ?? color, background: `color-mix(in srgb,${color} 14%,transparent)` }}><Icon name={icon} size="xs" /></span>
);

/** A side panel of the steps a workflow can be built from: a search, groups that fold, and a row per step. Hovering or
 * focusing a step shows what it does beside the panel, never over the list; Enter, a click or a drag into the workflow adds
 * it. ↑ and ↓ move through the rows, typing searches, and Escape clears the search. */
export function StepLibrary({
  groups, onAdd, workflow, query, defaultQuery = '', onQueryChange, collapsed, defaultCollapsed = [], onCollapsedChange,
  draggable, title = 'Add a step', placeholder = 'Search steps', previewHint = 'Press Enter or click to add it, or drag it into the workflow',
  dropLabel = 'Drop a step here', className
}: StepLibraryProps) {
  const [q, setQ] = useControllable(query, defaultQuery, onQueryChange);
  const [shut, setShut] = useControllable(collapsed, defaultCollapsed, onCollapsedChange);
  const v = q.trim().toLowerCase();
  const total = groups.reduce((n, g) => n + g.steps.length, 0);
  const shown = groups.map(g => ({ g, steps: g.steps.filter(s => !v || s.name.toLowerCase().includes(v) || g.label.toLowerCase().startsWith(v)) })).filter(x => x.steps.length);
  const found = shown.reduce((n, x) => n + x.steps.length, 0);
  // a search opens any folded group it finds something in
  useEffect(() => { if (!v) return; const open = shut.filter(id => !shown.some(x => x.g.id === id)); if (open.length !== shut.length) setShut(open); }, [v]); // eslint-disable-line react-hooks/exhaustive-deps
  const canDrag = draggable ?? !!workflow;
  const uid = useId(), reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null), panel = useRef<HTMLDivElement>(null), list = useRef<HTMLDivElement>(null), field = useRef<HTMLInputElement>(null);
  const fl = useRef<HTMLOListElement>(null), pvEl = useRef<HTMLDivElement>(null);
  const [say, setSay] = useState('');
  const [narrow, setNarrow] = useState(false);
  useIsoLayoutEffect(() => {
    const el = root.current; if (!el) return;
    const read = () => setNarrow(el.clientWidth > 0 && el.clientWidth < 560);
    read(); const ro = new ResizeObserver(read); ro.observe(el); return () => ro.disconnect();
  }, []);

  /* ---------- the list is one tab stop: ↑ and ↓ move through the headers and rows that show ---------- */
  const [stop, setStop] = useState<string | null>(null);
  const items = () => Array.from(list.current?.querySelectorAll<HTMLButtonElement>('.dm-slb-gb,.dm-slb-s,.dm-slb-ec') ?? []).filter(b => !b.closest('.dm-fold.dm-shut'));
  const keyOf = (b: HTMLElement) => b.dataset.k ?? '';
  const firstStep = shown.length && !shut.includes(shown[0].g.id) ? 's:' + shown[0].steps[0].id : shown.length ? 'g:' + shown[0].g.id : 'e';
  const tab = stop && (stop === 'e' ? !shown.length : stop.startsWith('g:') ? shown.some(x => 'g:' + x.g.id === stop) : shown.some(x => !shut.includes(x.g.id) && x.steps.some(s => 's:' + s.id === stop))) ? stop : firstStep;
  useEffect(() => { setStop(null); }, [v]);
  const keep = (b: HTMLElement) => {
    const l = list.current; if (!l) return; const lr = l.getBoundingClientRect(), br = b.getBoundingClientRect();
    if (br.top < lr.top + 4) l.scrollTop -= lr.top + 4 - br.top; else if (br.bottom > lr.bottom - 4) l.scrollTop += br.bottom - lr.bottom + 4;
  };
  const goTo = (b: HTMLElement) => { setStop(keyOf(b)); b.focus({ preventScroll: true }); keep(b); };
  const toggle = (id: string) => { const open = shut.includes(id); setShut(open ? shut.filter(x => x !== id) : [...shut, id]); setStop('g:' + id); };
  const clear = () => { const back = !!root.current?.contains(document.activeElement); setQ(''); if (back) field.current?.focus({ preventScroll: true }); setSay('Search cleared'); };
  useEffect(() => { if (v) setSay(found ? `${found} ${found === 1 ? 'step' : 'steps'} found` : 'No steps found'); }, [v, found]);

  /* ---------- the preview: the hovered step, or the focused one, beside the panel and level with its row ---------- */
  const [hov, setHov] = useState<string | null>(null), [foc, setFoc] = useState<string | null>(null);
  const [pv, setPv] = useState<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const want = hov ?? foc;
  useEffect(() => { clearTimeout(timer.current); if (want === pv) return; timer.current = setTimeout(() => setPv(want), want ? (pv ? 0 : (hov ? 280 : 0)) : 120); }, [want]); // eslint-disable-line react-hooks/exhaustive-deps
  const find = (id: string | null) => { for (const g of groups) { const s = g.steps.find(x => x.id === id); if (s) return { s, g }; } return null; };
  const cur = find(pv);
  const [at, setAt] = useState<{ left: number; top: number } | null>(null);
  const [jump, setJump] = useState(true);
  const place = () => {
    const r = root.current, p = panel.current, row = list.current?.querySelector<HTMLElement>(`[data-k="s:${pv}"]`), card = pvEl.current;
    if (!r || !p || !row || !card || narrow) return;
    const rr = r.getBoundingClientRect(), br = row.getBoundingClientRect(), pr = p.getBoundingClientRect();
    setAt({ left: Math.round(pr.right - rr.left + 8), top: Math.round(Math.max(0, Math.min(r.clientHeight - card.offsetHeight, br.top - rr.top - 8))) });
  };
  useIsoLayoutEffect(() => { if (!pv) { setAt(null); setJump(true); return; } place(); }, [pv, narrow, q]);
  useEffect(() => { if (at) { const t = setTimeout(() => setJump(false), 0); return () => clearTimeout(t); } }, [at]);

  /* ---------- adding ---------- */
  const [added, setAdded] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);
  const addedT = useRef<ReturnType<typeof setTimeout>>(undefined), noteT = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => { clearTimeout(addedT.current); clearTimeout(noteT.current); }, []);
  const count = (workflow?.steps.length ?? 0) + 1;
  const add = (id: string, via: StepLibraryAddVia) => {
    const hit = find(id); if (!hit) return;
    onAdd?.(hit.s, hit.g, via);
    setAdded(id); clearTimeout(addedT.current); addedT.current = setTimeout(() => setAdded(null), 1400);
    setHov(null);
    const line = workflow ? `${count} steps in ${workflow.title}` : 'Added';
    setSay(`Added ${hit.s.name}. ${workflow ? line : ''}`.trim());
    if (narrow) { setNote(hit.s.name); clearTimeout(noteT.current); noteT.current = setTimeout(() => setNote(null), 2400); }
  };
  // the workflow scrolls to its newest step
  // (the steps it starts with are already there; the ones added after come in)
  const flowLen = workflow?.steps.length ?? 0, lastLen = useRef(flowLen), mountLen = useRef(flowLen);
  useEffect(() => { if (flowLen > lastLen.current) fl.current?.scrollTo({ top: fl.current.scrollHeight, behavior: reduce ? 'auto' : 'smooth' }); lastLen.current = flowLen; }, [flowLen, reduce]);
  const [over, setOver] = useState(false);
  const dragOver = (e: DragEvent) => { if (!e.dataTransfer.types.includes(MIME)) return; e.preventDefault(); e.dataTransfer.dropEffect = 'copy'; setOver(true); };
  const drop = (e: DragEvent) => { setOver(false); const id = e.dataTransfer.getData(MIME); if (!id) return; e.preventDefault(); add(id, 'drop'); };

  /* ---------- keys ---------- */
  const fieldKeys = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown') { const f = items().find(b => b.matches('.dm-slb-s')) ?? items()[0]; if (f) { e.preventDefault(); goTo(f); } }
    else if (e.key === 'Enter' && v && shown.length) { e.preventDefault(); add(shown[0].steps[0].id, 'keyboard'); }
    else if (e.key === 'Escape' && q) { e.preventDefault(); e.stopPropagation(); clear(); }
  };
  const listKeys = (e: ReactKeyboardEvent<HTMLDivElement>) => {
    const all = items(), i = all.indexOf(document.activeElement as HTMLButtonElement); if (i < 0) return;
    const k = e.key, b = all[i];
    if (k === 'ArrowDown' || k === 'ArrowUp') { e.preventDefault(); const j = i + (k === 'ArrowDown' ? 1 : -1); if (j < 0) field.current?.focus({ preventScroll: true }); else if (j < all.length) goTo(all[j]); }
    else if (k === 'Home' || k === 'End') { e.preventDefault(); goTo(all[k === 'Home' ? 0 : all.length - 1]); }
    else if (b.matches('.dm-slb-gb') && (k === 'ArrowLeft' || k === 'ArrowRight')) { e.preventDefault(); const id = keyOf(b).slice(2); if ((k === 'ArrowRight') === shut.includes(id)) toggle(id); }
    else if (b.matches('.dm-slb-s') && k === 'ArrowLeft') { e.preventDefault(); const h = b.closest('.dm-slb-g')?.querySelector<HTMLElement>('.dm-slb-gb'); if (h) goTo(h); }
    else if (k === 'Escape' && q) { e.preventDefault(); clear(); }
    // typing anywhere in the list goes on into the search
    else if (k === 'Backspace' && q) { e.preventDefault(); setQ(q.slice(0, -1)); field.current?.focus({ preventScroll: true }); }
    else if (k.length === 1 && k !== ' ' && !e.ctrlKey && !e.metaKey && !e.altKey) { e.preventDefault(); setQ(q + k); field.current?.focus({ preventScroll: true }); }
  };

  const hintText = typeof matchMedia === 'function' && !matchMedia('(hover:hover)').matches ? 'Tap a step to add it to the workflow' : 'Hover or focus a step to see what it does';
  return (
    <div ref={root} data-dm="" className={cx('dm-slb', className)}>
      <div ref={panel} className="dm-slb-p">
        <div className="dm-slb-h"><b>{title}</b><span className="dm-num dm-slb-ct">{v ? `${found} of ${total}` : `${total} steps`}</span></div>
        <div className="dm-slb-q">
          <Icon name="search" />
          <input ref={field} className="dm-slb-in" type="text" placeholder={placeholder} aria-label={placeholder} autoComplete="off" spellCheck={false}
            value={q} onChange={e => setQ(e.target.value)} onKeyDown={fieldKeys} />
          {q && <Tip label="Clear search" kbd="Esc"><button type="button" className="dm-ib dm-slb-x" aria-label="Clear search" onClick={clear}><Icon name="x" /></button></Tip>}
        </div>
        <div ref={list} className="dm-slb-list" role="group" aria-label="Steps" onKeyDown={listKeys} onScroll={() => { if (pv) place(); }}
          onPointerLeave={() => setHov(null)}
          onFocus={e => { const id = (e.target as HTMLElement).dataset.k; setFoc(id?.startsWith('s:') ? id.slice(2) : null); }}
          onBlur={e => { if (!list.current?.contains(e.relatedTarget as Node)) setFoc(null); }}>
          {shown.length ? shown.map(({ g, steps }) => {
            const open = !shut.includes(g.id), fid = `${uid}-g-${g.id}`;
            return (
              <div key={g.id} className="dm-slb-g">
                <button type="button" className="dm-slb-gb" data-k={'g:' + g.id} tabIndex={tab === 'g:' + g.id ? 0 : -1} aria-expanded={open} aria-controls={fid}
                  onClick={() => toggle(g.id)} onPointerOver={e => { if (e.pointerType === 'mouse') setHov(null); }}>
                  <Icon name="chev-d" size="xs" /><span>{g.label}</span><span className="dm-n dm-num">{steps.length}</span>
                </button>
                <div className={cx('dm-fold', !open && 'dm-shut')} id={fid} inert={!open}>
                  <div><ul className="dm-slb-ul">
                    {steps.map(s => (
                      <li key={s.id}>
                        <button type="button" className={cx('dm-slb-s', pv === s.id && 'dm-on', added === s.id && 'dm-added')} data-k={'s:' + s.id} tabIndex={tab === 's:' + s.id ? 0 : -1}
                          aria-describedby={`${uid}-d-${s.id}`} draggable={canDrag}
                          onClick={e => add(s.id, e.detail ? 'click' : 'keyboard')}
                          onPointerOver={e => { if (e.pointerType === 'mouse') setHov(s.id); }}
                          onDragStart={e => { e.dataTransfer.setData(MIME, s.id); e.dataTransfer.setData('text/plain', s.name); e.dataTransfer.effectAllowed = 'copy'; setHov(null); setPv(null); }}
                          onDragEnd={() => setOver(false)}>
                          {tile(s.icon, g.color, g.iconColor)}<span className="dm-t">{marked(s.name, v)}</span>
                          <span className="dm-ad" aria-hidden="true"><Icon name={added === s.id ? 'check' : 'plus'} size="xs" /></span>
                        </button>
                      </li>
                    ))}
                  </ul></div>
                </div>
              </div>
            );
          }) : (
            <div className="dm-slb-e"><b>No steps match “{q.trim()}”</b><span>Try another word, or clear the search.</span>
              <button type="button" className="dm-pill dm-ghost dm-sm dm-slb-ec" data-k="e" tabIndex={tab === 'e' ? 0 : -1} onClick={clear}>Clear search</button></div>
          )}
        </div>
        <div className="dm-slb-dock" aria-hidden="true">
          {note ? <div className="dm-slb-ph">{tile('check', 'var(--dm-ok)')}<div><b>Added {note}</b><span>{workflow ? `${count - 1} steps in ${workflow.title}` : 'To the workflow'}</span></div></div>
            : cur ? <><div className="dm-slb-ph">{tile(cur.s.icon, cur.g.color, cur.g.iconColor)}<div><b>{cur.s.name}</b><span>{cur.g.label}</span></div></div><p className="dm-slb-pd">{cur.s.description}</p></>
            : <span className="dm-hint">{hintText}</span>}
        </div>
      </div>
      {workflow && (
        <div className={cx('dm-slb-flow', over && 'dm-over')} role="region" aria-label="Workflow" onDragOver={dragOver} onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOver(false); }} onDrop={drop}>
          <div className="dm-slb-fh"><b>{workflow.title}</b><span className="dm-num dm-slb-fn">{workflow.steps.length} steps</span></div>
          <ol ref={fl} className="dm-slb-fl">
            {workflow.steps.map((s, i) => (
              <li key={s.key} className={cx('dm-slb-fs', i >= mountLen.current && 'dm-in')}>
                <span className="dm-slb-cn" aria-hidden="true" />
                <span className="dm-ic" style={{ color: s.color }}><Icon name={s.icon} size="xs" /></span>
                <span className="dm-t"><b>{s.name}</b>{s.detail && <span>{s.detail}</span>}</span>
              </li>
            ))}
          </ol>
          <div className="dm-slb-drop"><Icon name="plus" /><span>{dropLabel}</span></div>
        </div>
      )}
      <div ref={pvEl} className={cx('dm-slb-pv', !!cur && !!at && 'dm-show', jump && 'dm-jump')} aria-hidden="true" style={at ?? undefined}>
        {cur && <>
          <div className="dm-slb-ph">{tile(cur.s.icon, cur.g.color, cur.g.iconColor)}<div><b>{cur.s.name}</b><span>{cur.g.label}</span></div></div>
          <p className="dm-slb-pd">{cur.s.description}</p>
          {(cur.s.takes || cur.s.gives) && <dl className="dm-slb-io">{cur.s.takes && <><dt>Takes</dt><dd>{cur.s.takes}</dd></>}{cur.s.gives && <><dt>Gives</dt><dd>{cur.s.gives}</dd></>}</dl>}
          <p className="dm-slb-pf">{previewHint}</p>
        </>}
      </div>
      <div className="dm-slb-d" hidden>{groups.flatMap(g => g.steps).map(s => <span key={s.id} id={`${uid}-d-${s.id}`}>{s.description}</span>)}</div>
      <p className="dm-slb-live" aria-live="polite">{say}</p>
    </div>
  );
}
