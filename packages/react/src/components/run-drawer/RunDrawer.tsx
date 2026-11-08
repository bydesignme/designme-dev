'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Seg, Spin, Tip } from '../../lib/motion';
import '../../designme.css';
import './run-drawer.css';

/** The kinds of step, each with its colour: the trigger orange, AI steps and their model calls violet, tools teal, app steps
    and outputs blue, a branch yellow, a wait pink, an approval green; a wait before a retry is amber and hatched */
export type RunKind = 'trigger' | 'ai' | 'model' | 'tool' | 'app' | 'output' | 'branch' | 'wait' | 'approval' | 'retry';
/** The run's state, in colour: running in the accent, waiting amber, passed green, failed red, stopped grey */
export type RunDrawerState = 'running' | 'waiting' | 'passed' | 'failed' | 'stopped';
export interface RunDrawerStep {
  id: string;
  title: string;
  kind: RunKind;
  icon?: IconName;
  /** What the step took in and handed on, shown as JSON in Data */
  input?: unknown;
  output?: unknown;
}
/** A bar on the timeline: a step (level 0) or a model or tool call inside it (level 1), in seconds from the start */
export interface RunSpan {
  id: string;
  /** The step it belongs to */
  step: string;
  name: string;
  kind: RunKind;
  icon?: IconName;
  level?: 0 | 1;
  start: number;
  /** Left out while it runs */
  end?: number;
  /** 'bad' for a failed try, 'wait' for a step waiting on a person, 'stop' for one cut short */
  state?: 'ok' | 'bad' | 'wait' | 'stop';
}
export type RunLevel = 'debug' | 'info' | 'warn' | 'error';
export interface RunLogLine { at: number; level: RunLevel; title: string; message?: string }
export type RunTab = 'steps' | 'log' | 'data';

export interface RunDrawerProps {
  /** Shown after the label, like 2088 */
  runId: string | number;
  /** "Test run" by default */
  label?: string;
  state: RunDrawerState;
  /** Seconds since the run started */
  time: number;
  tokens?: number;
  /** In dollars */
  cost?: number;
  /** The workflow's steps, in order, for the strip over the drawer and for Data */
  steps: RunDrawerStep[];
  spans: RunSpan[];
  log: RunLogLine[];
  /** The step a run waits on for a person: shows its question with Approve and Reject */
  waiting?: { step: string; title: string; detail?: string };
  onApprove?: () => void;
  onReject?: () => void;
  /** Adds Stop while the run is running or waiting */
  onStop?: () => void;
  /** Adds Run again once it has ended */
  onRunAgain?: () => void;
  tab?: RunTab;
  defaultTab?: RunTab;
  onTabChange?: (tab: RunTab) => void;
  /** The log's level filter */
  level?: 'all' | 'warn' | 'error';
  defaultLevel?: 'all' | 'warn' | 'error';
  onLevelChange?: (level: 'all' | 'warn' | 'error') => void;
  /** Whether the newest row stays in view as the run goes */
  follow?: boolean;
  defaultFollow?: boolean;
  onFollowChange?: (follow: boolean) => void;
  /** Whether the drawer is open, or folded down to its head */
  expanded?: boolean;
  defaultExpanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /** The drawer's height when open, in pixels */
  height?: number;
  defaultHeight?: number;
  onHeightChange?: (height: number) => void;
  /** The step picked on the strip, the timeline or Data */
  selected?: string | null;
  defaultSelected?: string | null;
  onSelectedChange?: (step: string | null) => void;
  /** What sits over the drawer. Left out, the workflow's steps as a strip of tiles; null leaves the drawer on its own */
  canvas?: ReactNode;
  className?: string;
}

const KIND_ICON: Record<RunKind, IconName> = { trigger: 'bolt', ai: 'spark', model: 'spark', tool: 'globe', app: 'send', output: 'hash', branch: 'branch', wait: 'clock', approval: 'user', retry: 'refresh' };
const secs = (v: number) => (v < 10 ? v.toFixed(1) : String(Math.round(v))) + 's';
const stamp = (v: number) => { const m = Math.floor(v / 60), s = v - m * 60; return String(m).padStart(2, '0') + ':' + s.toFixed(2).padStart(5, '0'); };
const Tile = ({ kind, icon }: { kind: RunKind; icon?: IconName }) => <span className="dm-rdr-ti" data-k={kind} aria-hidden="true"><Icon name={icon ?? KIND_ICON[kind]} size="xs" /></span>;
const TAG: Record<RunDrawerState, [string, string]> = { running: ['dm-run', 'Running'], waiting: ['dm-warn', 'Waiting'], passed: ['dm-ok', 'Passed'], failed: ['dm-bad', 'Failed'], stopped: ['', 'Stopped'] };
function Json({ value, label }: { value: unknown; label: string }) {
  const text = JSON.stringify(value ?? {}, null, 2) ?? '';
  const parts: ReactNode[] = []; let last = 0, i = 0;
  for (const m of text.matchAll(/("[^"]*")(\s*:)?|\b(-?\d+(?:\.\d+)?|true|false|null)\b/g)) {
    parts.push(text.slice(last, m.index));
    parts.push(m[1] ? (m[2] ? <span key={i++}><span className="dm-k">{m[1]}</span>{m[2]}</span> : <span key={i++} className="dm-s">{m[1]}</span>) : <span key={i++} className="dm-n">{m[3]}</span>);
    last = (m.index ?? 0) + m[0].length;
  }
  parts.push(text.slice(last));
  return <pre className="dm-rdr-json" tabIndex={0} aria-label={label}>{parts}</pre>;
}

/** A workflow's run in a drawer under its canvas: its state, time, tokens and cost, then a timeline of its steps with their
    model and tool calls nested, the log with its levels, and each step's data; Stop, Follow the run, a fold and a drag. */
export function RunDrawer({ runId, label = 'Test run', state, time, tokens, cost, steps, spans, log, waiting, onApprove, onReject, onStop, onRunAgain,
  tab, defaultTab = 'steps', onTabChange, level, defaultLevel = 'all', onLevelChange, follow, defaultFollow = true, onFollowChange,
  expanded, defaultExpanded = true, onExpandedChange, height, defaultHeight = 312, onHeightChange, selected, defaultSelected = null, onSelectedChange, canvas, className }: RunDrawerProps) {
  const [view, setView] = useControllable(tab, defaultTab, onTabChange);
  const [lvl, setLvl] = useControllable(level, defaultLevel, onLevelChange);
  const [fol, setFol] = useControllable(follow, defaultFollow, onFollowChange);
  const [open, setOpen] = useControllable(expanded, defaultExpanded, onExpandedChange);
  const [h, setH] = useControllable(height, defaultHeight, onHeightChange);
  const [pick, setPick] = useControllable(selected, defaultSelected, onSelectedChange);
  const reduce = useReducedMotion();
  const frame = useRef<HTMLDivElement>(null), body = useRef<HTMLDivElement>(null), rows = useRef<HTMLDivElement>(null), axis = useRef<HTMLSpanElement>(null), flow = useRef<HTMLDivElement>(null);
  const [anim, setAnim] = useState(false), [drag, setDrag] = useState<{ y: number; h: number } | null>(null), [axW, setAxW] = useState(240);
  const [uid] = useState(() => 'rdr' + Math.random().toString(36).slice(2, 7));
  const live = state === 'running' || state === 'waiting';
  const maxH = () => Math.max(160, (frame.current?.clientHeight ?? 472) - 64);
  const size = (v: number) => setH(Math.round(Math.max(120, Math.min(maxH(), v))));
  const fold = (o: boolean) => { setAnim(true); setOpen(o); setTimeout(() => setAnim(false), reduce ? 0 : 500); };

  // the axis grows with the run; its ticks and the tracks' lines share one step
  useIsoLayoutEffect(() => { const el = axis.current; if (!el) return; const ro = new ResizeObserver(() => setAxW(el.clientWidth || 240)); ro.observe(el); return () => ro.disconnect(); }, []);
  const span = Math.max(10, Math.ceil((time + .5) / 2) * 2), tick = [2, 5, 10, 20].find(x => span / x * 34 <= axW) ?? 20;
  const shown = spans.filter(s => s.start <= time + 1e-6);
  const stOf = (s: RunSpan) => s.end == null ? (state === 'stopped' ? 'stop' : s.state === 'wait' ? 'wait' : 'run') : time < s.end ? (s.kind === 'retry' ? 'retry' : 'run') : (s.state ?? 'ok');
  // the steps on the strip: the one under way ringed, a retry or a wait amber, done ones ticked
  const stepState = (id: string) => {
    const mine = shown.filter(s => s.step === id), main = mine.find(s => !s.level); if (!main) return '';
    const st = stOf(main); if (st !== 'run') return st;
    const cur = mine.filter(s => s.level).pop(); return cur && (cur.kind === 'retry' || (cur.state === 'bad' && cur.end != null && time >= cur.end)) ? 'retry' : 'run';
  };
  const lines = log.filter(l => l.at <= time + 1e-6).sort((a, b) => a.at - b.at), seen = lines.filter(l => lvl === 'all' || l.level === lvl);
  const done = steps.filter(x => shown.some(s => s.step === x.id && !s.level && s.end != null && s.end <= time + 1e-6 && (s.state ?? 'ok') === 'ok'));
  const cur = done.find(x => x.id === pick) ?? done[done.length - 1];

  // the newest row stays in view while the run is followed
  useEffect(() => {
    const b = body.current; if (!b || !fol || !live) return;
    if (view === 'steps') { const last = rows.current?.lastElementChild as HTMLElement | null; if (last && last.offsetTop + last.offsetHeight > b.scrollTop + b.clientHeight) b.scrollTop = last.offsetTop + last.offsetHeight - b.clientHeight + 6; }
    if (view === 'log') b.scrollTop = b.scrollHeight;
  }, [shown.length, lines.length, waiting, view, fol, live]);
  const running = steps.find(x => stepState(x.id) === 'run');
  useEffect(() => { const el = running && flow.current?.querySelector<HTMLElement>(`[data-s="${CSS.escape(running.id)}"]`); if (el && fol && flow.current) flow.current.scrollTo({ left: el.offsetLeft - flow.current.clientWidth / 2 + el.offsetWidth / 2, behavior: reduce ? 'auto' : 'smooth' }); }, [running?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const tag = TAG[state];
  const meta = [secs(time), tokens ? `${(tokens / 1000).toFixed(1)}k tokens` : '', cost != null && tokens ? `$${cost.toFixed(3)}` : ''].filter(Boolean).join(', ');
  const strip = canvas !== undefined ? canvas : (
    <div className="dm-rdr-flow" role="group" aria-label="Steps of the workflow" ref={flow}>
      {steps.map((x, i) => [
        i > 0 && <span key={x.id + 'w'} className={cx('dm-rdr-wire', shown.some(s => s.step === x.id) && 'dm-done')} aria-hidden="true" />,
        <Tip key={x.id} label={x.title}><button type="button" className="dm-rdr-nd" data-s={x.id} data-st={stepState(x.id) || undefined} aria-pressed={pick === x.id} aria-label={x.title} onClick={() => setPick(x.id)}>
          <Tile kind={x.kind} icon={x.icon} /><span className="dm-t">{x.title}</span><span className="dm-rdr-ns" aria-hidden="true"><Icon name="check" size="xs" /></span>
        </button></Tip>
      ])}
    </div>
  );

  const drawer = (
    <div className={cx('dm-rdr-dw', !open && 'dm-shut', anim && 'dm-anim', drag && 'dm-drag')} role="region" aria-label="Run" style={{ ['--dm-rdr-h' as string]: h + 'px' }}>
      <div className={cx('dm-rdr-grip', drag && 'dm-on')} role="separator" aria-orientation="horizontal" aria-label="Resize the run drawer" tabIndex={0} aria-valuemin={120} aria-valuemax={maxH()} aria-valuenow={h}
        onPointerDown={e => { e.currentTarget.setPointerCapture(e.pointerId); setDrag({ y: e.clientY, h: open ? h : 45 }); if (!open) setOpen(true); }}
        onPointerMove={e => { if (drag) size(drag.h - (e.clientY - drag.y)); }}
        onPointerUp={() => setDrag(null)} onPointerCancel={() => setDrag(null)}
        onKeyDown={e => { const d = ({ ArrowUp: 24, ArrowDown: -24 } as Record<string, number>)[e.key]; let v: number | null = d ? h + d : null; if (e.key === 'Home') v = 120; if (e.key === 'End') v = maxH(); if (v == null) return; e.preventDefault(); if (!open) fold(true); size(v); }}><i /></div>
      <div className="dm-rdr-h">
        <button type="button" className="dm-rdr-tg" aria-expanded={open} aria-controls={uid + '-b'} onClick={() => fold(!open)}>
          <Icon name="chev-u" size="xs" /><span><span className="dm-w">{label} </span><span className="dm-num">#{runId}</span></span>
          <span className={cx('dm-rdr-st dm-tag', tag[0])}>{state === 'running' && <Spin />}{tag[1]}</span>
        </button>
        <span className="dm-rdr-meta dm-num">{meta}</span>
        <span className="dm-rdr-sp" />
        <Seg className="dm-rdr-tabs" label="Show" value={view} onChange={setView} options={[{ value: 'steps', label: 'Steps' }, { value: 'log', label: 'Log' }, { value: 'data', label: 'Data' }]} />
        {live && onStop && <Tip label="Stop the run"><button type="button" className="dm-pill dm-ghost dm-sm dm-rdr-stop" aria-label="Stop the run" onClick={onStop}><Icon name="stop" size="xs" /><span>Stop</span></button></Tip>}
        {!live && onRunAgain && <Tip label="Run again"><button type="button" className="dm-pill dm-ghost dm-sm dm-rdr-again" aria-label="Run again" onClick={onRunAgain}><Icon name="refresh" size="xs" /><span>Run again</span></button></Tip>}
        <Tip label={fol ? 'Follow the run' : 'Stay put'}><button type="button" className="dm-ib dm-rdr-follow" aria-pressed={fol} aria-label="Follow the run" onClick={() => setFol(!fol)}><Icon name="target" /></button></Tip>
      </div>
      <div className="dm-rdr-b" id={uid + '-b'} ref={body}>
        <div className="dm-rdr-v" data-v="steps" hidden={view !== 'steps'}>
          <div className="dm-rdr-ax" aria-hidden="true"><span>Step</span><span className="dm-rdr-sc" ref={axis}>{Array.from({ length: Math.floor(span / tick) }, (_, i) => <span key={i} style={{ left: `${i * tick / span * 100}%` }}>{i * tick}s</span>)}</span><span className="dm-ms">Time</span></div>
          <div className="dm-rdr-rows" role="group" aria-label="Steps of the run" ref={rows} style={{ ['--dm-rdr-g' as string]: `${tick / span * 100}%` }}>
            {shown.map(s => {
              const st = stOf(s), e = s.end == null ? time : Math.min(s.end, time);
              return [
                <button type="button" key={s.id} className={cx('dm-rdr-r', !reduce && 'dm-in', st === 'run' && 'dm-run')} data-k={s.kind} data-lv={s.level ?? 0} data-st={st} style={{ ['--dm-lv' as string]: s.level ?? 0 }} aria-pressed={pick === s.step}
                  aria-label={`${s.name}, ${({ run: 'running', retry: 'waiting to try again', wait: 'waiting for approval', bad: 'failed', stop: 'stopped', ok: 'done' } as Record<string, string>)[st]}, ${secs(e - s.start)}`} onClick={() => setPick(s.step)}>
                  <span className="dm-rdr-n"><Tile kind={s.kind} icon={s.icon} /><span className="dm-rdr-nm">{s.name}</span></span>
                  <span className="dm-rdr-bt"><i style={{ left: `${s.start / span * 100}%`, width: `${Math.max(.6, (e - s.start) / span * 100)}%` }} /></span>
                  <span className="dm-rdr-ms dm-num">{st === 'wait' ? 'Waiting' : st === 'bad' ? 'Failed' : st === 'stop' ? 'Stopped' : secs(e - s.start)}</span>
                </button>,
                waiting && state === 'waiting' && waiting.step === s.step && !s.level && (
                  <div key={s.id + 'ask'} className={cx('dm-rdr-ask', !reduce && 'dm-in')} role="group" aria-label={`${waiting.title} waits for you`}>
                    <Tile kind="approval" icon="user" />
                    <span className="dm-tx"><b>{waiting.title}</b>{waiting.detail && <span>{waiting.detail}</span>}</span>
                    <span className="dm-acts">
                      {onApprove && <button type="button" className="dm-pill dm-primary dm-sm" data-a="yes" onClick={onApprove}><Icon name="check" size="xs" />Approve</button>}
                      {onReject && <button type="button" className="dm-pill dm-line dm-sm" data-a="no" onClick={onReject}>Reject</button>}
                    </span>
                  </div>
                )
              ];
            })}
          </div>
        </div>
        <div className="dm-rdr-v" data-v="log" hidden={view !== 'log'}>
          <div className="dm-rdr-lf">
            <Seg className="dm-rdr-lvs" label="Level" value={lvl} onChange={setLvl} options={[{ value: 'all', label: 'All' }, { value: 'warn', label: 'Warnings' }, { value: 'error', label: 'Errors' }]} />
            <span className="dm-n dm-num">{seen.length} {seen.length === 1 ? 'line' : 'lines'}</span>
          </div>
          {seen.length ? <ol className="dm-rdr-log" aria-label="Run log">
            {seen.map((l, i) => <li key={l.at + l.title + i} className={cx('dm-rdr-l', !reduce && 'dm-in')} data-l={l.level}><span className="dm-t dm-num">{stamp(l.at)}</span><span className="dm-lv dm-tag" data-l={l.level}>{l.level}</span><span className="dm-m"><b>{l.title}</b> {l.message && <span>{l.message}</span>}</span></li>)}
          </ol> : <p className="dm-rdr-le">No {lvl === 'warn' ? 'warnings' : lvl === 'error' ? 'errors' : 'lines'} in this run yet.</p>}
        </div>
        <div className="dm-rdr-v" data-v="data" hidden={view !== 'data'}>
          {cur ? <div className="dm-rdr-data">
            <div className="dm-rdr-ds" role="group" aria-label="Steps">
              {done.map(x => <button type="button" key={x.id} aria-pressed={x === cur} onClick={() => setPick(x.id)}><Tile kind={x.kind} icon={x.icon} /><span>{x.title}</span></button>)}
            </div>
            <div className="dm-rdr-io"><h4>Input</h4><Json value={cur.input} label={`${cur.title} input`} /><h4>Output</h4><Json value={cur.output} label={`${cur.title} output`} /></div>
          </div> : <p className="dm-rdr-de">No step has finished yet.</p>}
        </div>
      </div>
    </div>
  );
  if (canvas === null) return <div data-dm="" className={className}>{drawer}</div>;
  return (
    <div data-dm="" ref={frame} className={cx('dm-rdr', className)}>
      <div className="dm-rdr-cv">{strip}</div>
      {drawer}
    </div>
  );
}
