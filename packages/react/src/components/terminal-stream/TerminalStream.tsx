'use client';
import { useState } from 'react';
import { cx } from '../../lib/cx';
import { useCopied } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Spin, Tip } from '../../lib/motion';
import '../../designme.css';
import './terminal-stream.css';

/** ok is green, bad is red, muted is grey */
export type TerminalTone = 'ok' | 'bad' | 'muted';
/** A line of output, or { text, tone } to colour it */
export type TerminalLine = string | { text: string; tone?: TerminalTone };

export interface TerminalCommand {
  kind?: 'command';
  /** Like "npm run build" */
  command: string;
  /** What it printed so far. Longer than `tail` + 1 lines, all but the last `tail` fold behind "Show N more lines" */
  output?: TerminalLine[];
  /** running shows a spinner; ok a check; failed its exit code in red; stopped a Stopped tag */
  status: 'running' | 'ok' | 'failed' | 'stopped';
  /** Shown when it failed, as "Exit 1" */
  exitCode?: number;
  /** How long it has taken, like "6.1 s" */
  duration?: string;
}

/** A line from the agent between commands, like what went wrong and what it will do about it */
export interface TerminalNote {
  kind: 'note';
  text: string;
}

/** A file the agent edits between commands */
export interface TerminalEdit {
  kind: 'edit';
  file: string;
  /** Lines added and removed, shown once it is done */
  added?: number;
  removed?: number;
  status?: 'running' | 'done' | 'stopped';
}

export type TerminalEntry = TerminalCommand | TerminalNote | TerminalEdit;
export type TerminalStatus = 'running' | 'passed' | 'failed' | 'stopped';

export interface TerminalStreamProps {
  /** The working directory, shown in the header, like "~/acme/web" */
  cwd: string;
  /** Commands, notes and edits, oldest first */
  entries: TerminalEntry[];
  /** The run as a whole. Left out, it is running while any entry runs, then failed if the last command failed, else passed */
  status?: TerminalStatus;
  /** How long the run has taken, like "0:18". Shown beside Running in the header and in the summary */
  elapsed?: string;
  /** The line at the foot once the run is over. Defaults to "3 commands · 0:18 · passed", counting each command once
      however many times it ran; false hides it */
  summary?: string | false;
  /** How many lines a folded output keeps showing */
  tail?: number;
  /** Adds the Stop button while the run is going */
  onStop?: () => void;
  /** Called with the whole run as text when it is copied */
  onCopy?: (text: string) => void;
  labels?: { running?: string; passed?: string; failed?: string; stopped?: string; stop?: string; copy?: string; copied?: string; more?: (n: number) => string; fewer?: string; edit?: string };
  className?: string;
}

const lineOf = (l: TerminalLine) => (typeof l === 'string' ? { text: l, tone: undefined } : l);
const TONE: Record<TerminalTone, string> = { ok: 'dm-ok', bad: 'dm-bad', muted: 'dm-mu' };
const isNote = (e: TerminalEntry): e is TerminalNote => e.kind === 'note';
const isEdit = (e: TerminalEntry): e is TerminalEdit => e.kind === 'edit';

function Lines({ lines }: { lines: TerminalLine[] }) {
  return <div className="dm-tmx-o">{lines.map((l, i) => { const { text, tone } = lineOf(l); return <div key={i} className={cx('dm-tmx-l', tone && TONE[tone])}>{text}</div>; })}</div>;
}

/** The shell commands an agent runs, as a compact terminal: the working directory and how the run is going in the header,
    each command with its output streaming in under it and an exit code or a check with how long it took, and a summary
    at the foot once it is over. Long output folds to its last lines. */
export function TerminalStream({ cwd, entries, status, elapsed, summary, tail = 4, onStop, onCopy, labels = {}, className }: TerminalStreamProps) {
  const L = { running: 'Running', passed: 'Passed', failed: 'Failed', stopped: 'Stopped', stop: 'Stop', copy: 'Copy', copied: 'Copied to clipboard',
    more: (n: number) => `Show ${n} more line${n === 1 ? '' : 's'}`, fewer: 'Show fewer lines', edit: 'Edit', ...labels };
  const [open, setOpen] = useState<Set<number>>(() => new Set());
  const [copied, copy] = useCopied();
  const cmds = entries.filter((e): e is TerminalCommand => !isNote(e) && !isEdit(e));
  const busy = entries.some(e => !isNote(e) && e.status === 'running');
  const last = cmds[cmds.length - 1];
  const state: TerminalStatus = status ?? (busy ? 'running' : last?.status === 'failed' ? 'failed' : last?.status === 'stopped' ? 'stopped' : 'passed');
  const running = state === 'running';
  const n = new Set(cmds.map(c => c.command)).size;
  const foot = summary !== undefined ? summary : [`${n} command${n === 1 ? '' : 's'}`, elapsed, state].filter(Boolean).join(' · ');
  const toggle = (i: number) => setOpen(s => { const t = new Set(s); if (t.has(i)) t.delete(i); else t.add(i); return t; });

  const text = () => entries.flatMap(e => isNote(e) ? ['# ' + e.text]
    : isEdit(e) ? [`# ${L.edit} ${e.file}${e.added !== undefined || e.removed !== undefined ? ` (+${e.added ?? 0} −${e.removed ?? 0})` : ''}`]
    : ['$ ' + e.command, ...(e.output ?? []).map(l => lineOf(l).text)]).join('\n');
  const copyAll = () => { const t = text(); copy(t); onCopy?.(t); };

  return (
    <div data-dm="" className={cx('dm-tmx dm-panel', className)} style={{ containerType: 'inline-size' }}>
      <div className="dm-tmx-h">
        <span className="dm-tmx-ic"><Icon name="term" /></span>
        <span className="dm-tmx-cwd">{cwd}</span>
        <span className={cx('dm-tmx-st', state === 'passed' && 'dm-ok')}>
          <span className="dm-g">{running ? <Spin /> : <Icon name={state === 'passed' ? 'check' : 'stop'} size="xs" />}</span>
          <span className="dm-tmx-sv dm-num">{running ? (elapsed ? `${L.running} · ${elapsed}` : L.running) : L[state]}</span>
        </span>
        <span className="dm-sp" />
        {running && onStop && <button type="button" className="dm-pill dm-ghost dm-sm dm-tmx-stop" aria-label="Stop the running command" onClick={onStop}><Icon name="stop" size="xs" />{L.stop}</button>}
        <Tip label={copied ? L.copied : L.copy} open={copied}>
          <button type="button" className={cx('dm-ib dm-tmx-cp', copied && 'dm-copied')} aria-label="Copy the output" onClick={copyAll}><Icon name={copied ? 'check' : 'copy'} /></button>
        </Tip>
      </div>
      <div className="dm-tmx-body" role="log" aria-label="Terminal output">
        {entries.map((e, i) => {
          const e0 = enter();
          if (isNote(e)) return <div key={i} className={cx('dm-tmx-note', e0.className)} style={e0.style}><Icon name="spark" size="xs" /><span>{e.text}</span></div>;
          if (isEdit(e)) return (
            <div key={i} className={cx('dm-tmx-blk', e0.className)} style={e0.style}>
              <div className="dm-tmx-cmd"><span className="dm-tmx-p"><Icon name="edit" size="xs" /></span><span className="dm-tmx-c">{L.edit} {e.file}</span>
                <span className="dm-tmx-m">{e.status === 'running' ? <span className="dm-g"><Spin /></span>
                  : e.status === 'stopped' ? <span className="dm-g"><span className="dm-tag">{L.stopped}</span></span>
                  : <>{e.added !== undefined && <span className="dm-add">+{e.added}</span>}{e.removed !== undefined && <span className="dm-del">−{e.removed}</span>}</>}</span>
              </div>
            </div>
          );
          const out = e.output ?? [], fold = out.length > tail + 1, hidden = fold ? out.slice(0, out.length - tail) : [], shown = fold ? out.slice(out.length - tail) : out, isOpen = open.has(i);
          return (
            <div key={i} className={cx('dm-tmx-blk', e0.className)} style={e0.style}>
              <div className="dm-tmx-cmd">
                <span className="dm-tmx-p">$</span><span className="dm-tmx-c">{e.command}</span>
                <span className="dm-tmx-m">
                  <span className="dm-g">{e.status === 'running' ? <Spin /> : e.status === 'ok' ? <span className="dm-ok"><Icon name="check" size="xs" /></span>
                    : e.status === 'failed' ? <span className="dm-tag dm-bad">Exit {e.exitCode ?? 1}</span> : <span className="dm-tag">{L.stopped}</span>}</span>
                  {e.duration && <span className="dm-t dm-num">{e.duration}</span>}
                </span>
              </div>
              {fold && <button type="button" className="dm-tmx-more" aria-expanded={isOpen} onClick={() => toggle(i)}><Icon name="chev-d" size="xs" /><span>{isOpen ? L.fewer : L.more(hidden.length)}</span></button>}
              {fold && <Fold open={isOpen}><Lines lines={hidden} /></Fold>}
              {shown.length > 0 && <Lines lines={shown} />}
            </div>
          );
        })}
      </div>
      <Fold open={!running && foot !== false} className="dm-tmx-ff">
        <div className={cx('dm-tmx-f', state === 'stopped' && 'dm-stop', state === 'failed' && 'dm-bad')}>
          <span className="dm-g"><Icon name={state === 'passed' ? 'ok' : state === 'failed' ? 'alert' : 'stop'} /></span>
          <span className="dm-tmx-fs dm-num">{foot || ''}</span>
        </div>
      </Fold>
    </div>
  );
}
