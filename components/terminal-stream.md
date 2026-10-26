# Terminal stream

> Shell commands the agent runs, with their output as it streams in.

Agent components / Sources and output. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/terminal-stream

## Install

```sh
npx designme add terminal-stream          # HTML, CSS and JS, with the shared core
npx designme add terminal-stream --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Terminal stream shows the shell commands an agent runs as a compact terminal panel. The header has the working directory and how the run is going, with Stop while it runs and Copy. Each command shows as a `$ npm run build` line with its output streaming in underneath, and ends with a check or a red exit code, and how long it took. Output longer than five lines folds to its last four behind a "Show 24 more lines" button, and when the run is over a line at the foot sums it up, like "3 commands · 0:18 · passed".

### When to use it

- When an agent installs, builds and tests code, and people want to see what it ran and what came back.
- When a command fails and people need the failing lines, the agent's reading of them and the fix in one place.
- When long output like a build log should be there if wanted, without filling the panel.
- When people need a way to stop a run that is going wrong, or to copy the whole run into an issue or a chat.

### What it does

- `entries` are commands, notes and edits, oldest first. A command has a `status` of `running`, `ok`, `failed` or `stopped`, with a spinner, a check, a red "Exit 1" tag (from `exitCode`) or a Stopped tag, and its `duration`.
- Output lines can be coloured with a `tone`: `ok` green, `bad` red or `muted` grey. Lines wrap inside the panel, so a long line never scrolls the page sideways.
- Output longer than `tail` + 1 lines folds to its last `tail` lines (4 by default) behind a "Show N more lines" button that opens the rest.
- A note (`kind: 'note'`) is a line from the agent between commands, and an edit (`kind: 'edit'`) is a file it changed, with the lines added and removed once it is done.
- The header shows `cwd` and the run's `status`, with `elapsed` beside Running. `onStop` adds a Stop button while it runs, and Copy copies the whole run as text.
- Once the run is over, `summary` folds open at the foot. By default it counts each command once, however many times it ran, then gives `elapsed` and the result.
- The terminal keeps one height, 420px, from the first command to the last. Its output scrolls inside it and stays on the newest line, unless someone has scrolled up to read; set `height` on it through `className` to change the size.

### Accessibility

- The output is a log region labelled "Terminal output", so screen readers can follow it as it arrives. It can be focused with Tab and scrolled with the arrow keys.
- "Show N more lines" is a button that says whether the folded lines are open, and the folded lines can't be reached with Tab while they are shut.
- Stop and Copy are labelled buttons, and Copy says "Copied to clipboard" in a tooltip once it has copied.

## Usage in React

```tsx
import { TerminalStream } from '@/components/designme/terminal-stream/TerminalStream';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { TerminalStream, type TerminalCommand, type TerminalEdit, type TerminalEntry, type TerminalLine, type TerminalStatus } from './TerminalStream';
import { useScript, useStory } from '../lib/useScript';

/* ---------- Terminal stream: install, build, a failing test, the agent's fix, and the test passing ---------- */
const F = (n: string, kb: string) => 'dist/' + n.padEnd(22) + kb.padStart(6) + ' kB';
const ok = (text: string): TerminalLine => ({ text, tone: 'ok' }), bad = (text: string): TerminalLine => ({ text, tone: 'bad' }), mu = (text: string): TerminalLine => ({ text, tone: 'muted' });
const BUILD: TerminalLine[] = [mu('> acme-web@2.4.0 build'), mu('> vite build'), 'vite v6.2.1 building for production...', 'transforming...', ok('✓ 1284 modules transformed.'), 'rendering chunks...', 'computing gzip size...',
  ...([['index.html', '0.46'], ['assets/Home-1c9e.js', '3.12'], ['assets/Pricing-3f9a.js', '12.40'], ['assets/Cart-7b21.js', '9.86'], ['assets/Account-a04d.js', '7.31'], ['assets/Billing-52ce.js', '6.94'],
    ['assets/Bills-e8f3.js', '5.27'], ['assets/Team-0d6a.js', '4.88'], ['assets/Prefs-9a1b.js', '6.02'], ['assets/Docs-44f0.js', '8.15'], ['assets/Search-b7c2.js', '2.96'], ['assets/Modal-61de.js', '1.84'],
    ['assets/Chart-ef09.js', '21.73'], ['assets/Table-3a7e.js', '11.09'], ['assets/Form-c1d4.js', '4.41'], ['assets/Toast-8e2f.js', '1.12'], ['assets/dates-29bb.js', '18.30'], ['assets/vendor-8c1e.js', '98.12'],
    ['assets/index-4f2a.js', '42.31'], ['assets/index-9b7d.css', '18.92']].map(([n, kb]) => F(n, kb))), ok('✓ built in 6.1s')];
type Step = { cmd: string; ms: number; out: TerminalLine[]; exit?: number } | { note: string; ms: number } | { edit: string; add: number; del: number; ms: number };
const RUN: Step[] = [
  { cmd: 'npm install', ms: 1900, out: ['added 412 packages in 1.9s', 'found 0 vulnerabilities'] },
  { cmd: 'npm run build', ms: 6100, out: BUILD },
  { cmd: 'npm test', ms: 3400, exit: 1, out: [mu('RUN  v3.0.5 ~/acme/web'), ok('✓ src/lib/cart.test.ts (14 tests)'), bad('× src/lib/price.test.ts (1 failed)'), bad('  × formats a yearly price'),
    ok('    Expected: "$240/yr"'), bad('    Received: "$240.00/yr"'), bad('Tests  1 failed | 23 passed (24)')] },
  { note: 'The test expects whole dollars, but formatPrice always adds cents. Dropping them for round amounts.', ms: 1500 },
  { edit: 'src/lib/price.ts', add: 2, del: 1, ms: 1500 },
  { cmd: 'npm test', ms: 2900, out: [ok('✓ src/lib/cart.test.ts (14 tests)'), ok('✓ src/lib/price.test.ts (10 tests)'), ok('Tests  24 passed (24)')] }
];
const clock = (ms: number) => { const s = Math.floor(ms / 1000); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`; };
const sec = (ms: number) => (ms / 1000).toFixed(1) + ' s';

export default function TerminalStreamDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [ms, setMs] = useState(0);
  const [status, setStatus] = useState<TerminalStatus>('running');
  const halt = useRef(false);

  // the agent's run: time passes in steps of a quarter second at most, so the clock keeps up, and Stop ends it at the next step
  useScript(async ({ wait }) => {
    let vt = 0, at = -1;
    const pass = async (t: number, each?: (d: number) => void) => {
      for (let d = 0; d < t;) { if (halt.current) return false; const s = Math.min(250, t - d); await wait(s); d += s; vt += s; setMs(vt); each?.(d); }
      return !halt.current;
    };
    const add = (e: TerminalEntry) => { at++; setEntries(l => [...l, e]); };
    const patch = (i: number, f: (e: TerminalEntry) => TerminalEntry) => setEntries(l => l.map((e, j) => (j === i ? f(e) : e)));
    const stopped = () => { patch(at, e => (e.kind === 'note' ? e : e.kind === 'edit' ? { ...e, status: 'stopped' } : { ...e, status: 'stopped', output: [...(e.output ?? []), mu('^C')] })); setStatus('stopped'); };
    let last = 0;
    for (const k of RUN) {
      if (!(await pass(200))) return setStatus('stopped');
      if ('note' in k) { add({ kind: 'note', text: k.note }); if (!(await pass(k.ms))) return setStatus('stopped'); continue; }
      if ('edit' in k) {
        add({ kind: 'edit', file: k.edit, status: 'running' });
        if (!(await pass(k.ms))) return stopped();
        patch(at, e => ({ ...(e as TerminalEdit), status: 'done', added: k.add, removed: k.del })); continue;
      }
      add({ command: k.cmd, status: 'running', output: [], duration: sec(0) });
      const per = k.ms / k.out.length; let t = 0;
      for (const line of k.out) {
        const done = await pass(per, d => patch(at, e => ({ ...(e as TerminalCommand), duration: sec(t + d) }))); t += per;
        if (!done) return stopped();
        patch(at, e => ({ ...(e as TerminalCommand), output: [...((e as TerminalCommand).output ?? []), line] }));
      }
      last = k.exit ?? 0;
      patch(at, e => ({ ...(e as TerminalCommand), duration: sec(k.ms), status: k.exit ? 'failed' : 'ok', exitCode: k.exit }));
    }
    setStatus(last ? 'failed' : 'passed');
  });

  // the person's part of the story, on the same beats as the site's: once the run is over, they copy it
  useStory(ref, async ({ wait, press }) => {
    await wait(20500); press('.dm-tmx-cp');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <TerminalStream cwd="~/acme/web" entries={entries} status={status} elapsed={clock(ms)} onStop={() => { halt.current = true; }} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `cwd` | `string` | The working directory, shown in the header, like "~/acme/web" |
| `entries` | `TerminalEntry[]` | Commands, notes and edits, oldest first |
| `status` (optional) | `TerminalStatus` | The run as a whole. Left out, it is running while any entry runs, then failed if the last command failed, else passed |
| `elapsed` (optional) | `string` | How long the run has taken, like "0:18". Shown beside Running in the header and in the summary |
| `summary` (optional) | `string \| false` | The line at the foot once the run is over. Defaults to "3 commands · 0:18 · passed", counting each command once however many times it ran; false hides it |
| `tail` (optional) | `number` | How many lines a folded output keeps showing |
| `onStop` (optional) | `() => void` | Adds the Stop button while the run is going |
| `onCopy` (optional) | `(text: string) => void` | Called with the whole run as text when it is copied |
| `labels` (optional) | `{ running?: string; passed?: string; failed?: string; stopped?: string; stop?: string; copy?: string; copied?: string; more?: (n: number) => string; fewer?: string; edit?: string }` |  |
| `className` (optional) | `string` |  |

## Questions

**Does it run the commands?**

No. It shows the `entries` you pass. Your code runs the commands, streams their output into `output`, and sets each one's `status` and `duration`. `onStop` tells you when someone pressed Stop.

**Why does the summary say 3 commands when 4 ran?**

It counts each command once, however many times it ran, so a test run again after a fix doesn't add one. Pass your own `summary` to say it another way, or `false` to hide it.

**Can it show colours from the shell?**

Not ANSI codes. Give each line a `tone` instead: `ok`, `bad` or `muted`.

## Source

`TerminalStream.tsx`, as `npx designme add terminal-stream --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useCopied } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Spin, Tip } from '../lib/motion';
import '../designme.css';
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
    at the foot once it is over. Long output folds to its last lines. The terminal keeps one height (420px; set `height`
    on it to change that) and its output scrolls, staying on the newest line unless the reader has scrolled up. */
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
  // new output keeps the log on its newest line, unless the reader has scrolled up; then it stays where they are
  const log = useRef<HTMLDivElement>(null), pinned = useRef(true);
  useEffect(() => {
    const el = log.current; if (!el) return;
    const stick = () => { if (pinned.current) el.scrollTop = el.scrollHeight; };
    const mo = new MutationObserver(stick); mo.observe(el, { childList: true, subtree: true, characterData: true });
    const ro = new ResizeObserver(stick); ro.observe(el);
    stick();
    return () => { mo.disconnect(); ro.disconnect(); };
  }, []);

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
      <div ref={log} className="dm-tmx-body" role="log" aria-label="Terminal output" tabIndex={0}
        onScroll={e => { const el = e.currentTarget; pinned.current = el.scrollTop + el.clientHeight >= el.scrollHeight - 24; }}>
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
```

## More in Sources and output

- [Code viewer](https://designme.dev/components/code-viewer.md): Code the agent wrote, with line notes you can ask about.
- [Citation hover card](https://designme.dev/components/citation-hover-card.md): Hover a citation to see the exact passage it came from.
- [Source stack](https://designme.dev/components/source-stack.md): Everything the agent read, folded into one quiet pill.
- [Field extraction](https://designme.dev/components/field-extraction.md): The agent pulls fields out of a document and shows where each came from.
- [Metric insight](https://designme.dev/components/metric-insight.md): A number, its trend, and the agent's read on why it moved.
- [Details panel](https://designme.dev/components/details-panel.md): Properties of a run you can change in place.
- [Task table](https://designme.dev/components/task-table.md): Agent tasks in a sortable table with bulk actions.

All components: https://designme.dev/llms.txt
