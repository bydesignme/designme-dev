'use client';
import { useRef, type CSSProperties, type KeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Fold, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './trace-view.css';

export type SpanKind = 'agent' | 'llm' | 'tool' | 'retrieval';

export interface TraceSpan {
  id: string;
  /** Like "Plan the steps" or the tool's name, "fetch_page" */
  name: string;
  kind: SpanKind;
  /** When it started, in seconds from the start of the run */
  start: number;
  /** How long it took, in seconds. Leave it out while it runs: its bar grows to `time` */
  duration?: number;
  /** Tokens it used. An agent span without its own count adds up every span under it */
  tokens?: number;
  /** What went in and what came out, shown when the span is opened */
  input?: string;
  output?: string;
  children?: TraceSpan[];
}

export interface TraceViewProps {
  /** The run's name, like "Pricing research" */
  title: string;
  /** The run's top spans, usually one root with everything nested under it */
  spans: TraceSpan[];
  /** Seconds into the run while it streams in: spans that start later stay hidden, and running ones reach this far.
      Leave it out once the run is over */
  time?: number;
  /** Seconds the time axis covers. Defaults to the run's length, rounded up to a whole second */
  axis?: number;
  /** A tool call that takes longer than this many seconds turns amber and is tagged slow. Defaults to 2 */
  slowAfter?: number;
  /** The line under the title. Defaults to "Running · 4 spans", then "Done · 7 spans, 1 slow" */
  status?: string;
  /** The id of the open span, whose details show under the waterfall. null closes them */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (id: string | null) => void;
  className?: string;
}

const KIND: Record<SpanKind, [string, IconName, string]> = {
  agent: ['Agent', 'cpu', 'var(--dm-muted)'], llm: ['LLM call', 'spark', 'var(--dm-c2)'], tool: ['Tool call', 'term', 'var(--dm-c6)'], retrieval: ['Retrieval', 'search', 'var(--dm-c3)']
};
const sec = (v: number) => v.toFixed(2) + 's';
const short = (v: number) => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v));
const tokensOf = (s: TraceSpan): number => s.tokens ?? (s.children ?? []).reduce((a, k) => a + tokensOf(k), 0);

/** One agent run as an observability waterfall: every span (LLM call, tool call, retrieval, sub-agent) on a shared time
    axis, nested under the span that started it, with its tokens and latency. A slow tool call turns amber, and any span
    opens to show its input, output, latency and tokens. */
export function TraceView({ title, spans, time, axis, slowAfter = 2, status, selected, defaultSelected = null, onSelectedChange, className }: TraceViewProps) {
  const [open, setOpen] = useControllable(selected, defaultSelected, onSelectedChange);
  const rows = useRef<HTMLDivElement>(null);
  const all: { s: TraceSpan; lv: number }[] = [];
  (function walk(list: TraceSpan[], lv: number) { list.forEach(s => { all.push({ s, lv }); if (s.children) walk(s.children, lv + 1); }); })(spans, 0);
  const end = Math.max(0, ...all.map(({ s }) => s.start + (s.duration ?? Math.max(0, (time ?? s.start) - s.start))));
  const span = axis ?? Math.max(1, Math.ceil(end));
  const now = time ?? Infinity;
  const shown = all.filter(({ s }) => s.start <= now);
  const took = (s: TraceSpan) => s.duration !== undefined ? Math.min(s.duration, now - s.start) : Math.max(0, (time ?? s.start) - s.start);
  const running = (s: TraceSpan) => s.duration === undefined || now < s.start + s.duration;
  const slow = (s: TraceSpan) => s.kind === 'tool' && took(s) > slowAfter;
  const nSlow = shown.filter(({ s }) => slow(s)).length;
  const live = shown.some(({ s }) => running(s));
  const line = status ?? (live ? `Running · ${shown.length} span${shown.length === 1 ? '' : 's'}` : `Done · ${shown.length} spans${nSlow ? `, ${nSlow} slow` : ''}`);
  // a label every other tick, and a faint line on every tick
  const tick = span <= 6 ? 1 : span <= 15 ? 2 : span <= 30 ? 5 : 10;
  const labels = Array.from({ length: Math.floor(span / tick / 2) + 1 }, (_, i) => i * tick * 2).filter(v => v < span);
  const grid: CSSProperties = { backgroundSize: `${(tick / span) * 100}% 100%` };
  const sel = open ? all.find(({ s }) => s.id === open)?.s : undefined;
  // the details keep the last span while they fold shut
  const last = useRef<TraceSpan | undefined>(undefined); if (sel) last.current = sel;
  const cur = sel ?? last.current;

  const onKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const btns = [...(rows.current?.querySelectorAll<HTMLElement>('.dm-trv-r') ?? [])], i = btns.indexOf(document.activeElement as HTMLElement);
    if (i < 0) return;
    const go = e.key === 'ArrowDown' ? btns[i + 1] : e.key === 'ArrowUp' ? btns[i - 1] : e.key === 'Home' ? btns[0] : e.key === 'End' ? btns[btns.length - 1] : null;
    if (!go && !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault(); go?.focus({ preventScroll: true });
  };
  // closing hands focus back to the span, if it was inside the details
  const close = (back: boolean) => {
    const id = open; setOpen(null);
    if (back && id) rows.current?.querySelector<HTMLElement>(`[data-id="${CSS.escape(id)}"]`)?.focus({ preventScroll: true });
  };

  return (
    <div data-dm="" className={cx('dm-trv dm-panel', className)} onKeyDown={e => { if (e.key === 'Escape' && open) close(true); }}>
      <div className="dm-trv-h">
        <div className="dm-trv-ht"><b>{title}</b><span className="dm-muted dm-trv-st" aria-live="polite"><Swap>{line}</Swap></span></div>
        <span className="dm-trv-tot dm-num">{sec(Math.min(end, now))}</span>
      </div>
      <div className="dm-trv-ax" aria-hidden="true">
        <span>Span</span>
        <span className="dm-trv-sc">{labels.map(v => <span key={v} style={{ left: `${(v / span) * 100}%` }}>{v}s</span>)}</span>
        <span className="dm-trv-tk">Tokens</span><span className="dm-trv-ms">Time</span>
      </div>
      <div ref={rows} className="dm-trv-rows" role="group" aria-label="Spans" onKeyDown={onKey}>
        {shown.map(({ s, lv }) => {
          const [kind, icon, col] = KIND[s.kind], w = took(s), tk = tokensOf(s), run = running(s), sl = slow(s);
          const why = `Over the ${slowAfter}s budget for a tool call`;
          return (
            <button key={s.id} type="button" data-id={s.id} className={cx('dm-trv-r dm-enter', !lv && 'dm-root', run && 'dm-run', sl && 'dm-slow')}
              style={{ '--dm-k': col, '--dm-lv': lv } as CSSProperties} aria-expanded={open === s.id}
              aria-label={`${s.name}, ${kind}, ${run ? 'running, ' : ''}${sec(w)}, ${Math.round(tk).toLocaleString('en-US')} tokens${sl ? ', slow' : ''}`}
              onClick={() => setOpen(open === s.id ? null : s.id)}>
              <span className="dm-trv-n">
                <Tip label={kind}><span className="dm-trv-k"><Icon name={icon} size="xs" /></span></Tip>
                <span className="dm-trv-nm">{s.name}</span>
                {sl && <Tip label={why}><span className={cx('dm-tag dm-warn', enter().className)}>slow</span></Tip>}
              </span>
              <span className="dm-trv-b" style={grid}><i style={{ left: `${(s.start / span) * 100}%`, width: `${(w / span) * 100}%` }} /></span>
              <span className="dm-trv-tk dm-num">{short(tk)}</span>
              {sl ? <Tip label={why}><span className="dm-trv-ms dm-num">{sec(w)}</span></Tip> : <span className="dm-trv-ms dm-num">{sec(w)}</span>}
            </button>
          );
        })}
      </div>
      <Fold open={!!sel} className="dm-trv-dt">
        {cur && (
          <div key={cur.id} className="dm-trv-dc dm-enter" role="region" aria-label="Span details">
            <div className="dm-trv-dh">
              <span className="dm-trv-k" style={{ '--dm-k': KIND[cur.kind][2] } as CSSProperties}><Icon name={KIND[cur.kind][1]} size="xs" /></span>
              <b>{cur.name}</b>{slow(cur) && <span className="dm-tag dm-warn">slow</span>}
              <Tip label="Close"><button type="button" className="dm-ib dm-trv-x" aria-label="Close details" onClick={e => close(e.currentTarget.contains(document.activeElement))}><Icon name="x" /></button></Tip>
            </div>
            <div className="dm-trv-kv">
              <div><span>Kind</span><b>{KIND[cur.kind][0]}</b></div>
              <div><span>Latency</span><b className="dm-num">{sec(took(cur))}</b></div>
              <div><span>Tokens</span><b className="dm-num">{Math.round(tokensOf(cur)).toLocaleString('en-US')}</b></div>
            </div>
            <div className="dm-trv-io">
              <span>Input</span><code>{cur.input ?? '–'}</code>
              <span>Output</span><code>{running(cur) ? 'Running…' : cur.output ?? '–'}</code>
            </div>
          </div>
        )}
      </Fold>
    </div>
  );
}
