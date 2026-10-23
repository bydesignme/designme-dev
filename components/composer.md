# Composer

> Message input with context, environment, effort and dictation.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/composer

## Install

```sh
npx designme add composer          # HTML, CSS and JS, with the shared core
npx designme add composer --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Composer is the box where a person writes a task for a coding or work agent and sends it. Besides the text, it lets them add files and context, pick the project and where the task runs, turn on cloud hand-off, set how much effort the agent spends, and dictate instead of typing.

### When to use it

- When people give your agent tasks that run in a local folder, a separate worktree or the cloud.
- When a message often comes with files, screenshots or links that should travel with it.
- When you want people to choose how hard the agent works on a task before they send it.
- When people should be able to stop the agent while it answers, from the same button they used to send.

### What it does

- The text box grows as you type, up to 160px. Enter sends, Shift+Enter adds a new line, and `onSubmit` receives the trimmed text and the attachments before the box clears.
- Attachments show as chips above the text, each with its own remove button. The + menu lists `addOptions` and calls `onAdd`, and it can also insert @ to mention a file or / to use a skill.
- Toolbar menus pick the project (`projects`), where it runs (`environments`, which defaults to Local, Worktree and Cloud) and effort (low, medium or high). A switch in its own popover turns on cloud hand-off.
- While `busy` is true, the Send button becomes a Stop button that calls `onStop`.
- When `onDictate` is set, a microphone button appears. With `dictating` on, the toolbar turns into a live waveform driven by `level`, with Cancel to restore the earlier text and Done to keep what was heard.
- `thread` places your conversation above the box, and `tools` adds your own controls, like a model picker, before the effort button.

### Accessibility

- The menus use `role="menu"` with `menuitemradio` and `aria-checked` for the current pick, and their buttons carry `aria-expanded` and `aria-haspopup`.
- Escape or a click outside closes an open menu, and Escape cancels dictation.
- The cloud hand-off control is a `role="switch"` with `aria-checked`, and each attachment's remove button is labelled with the file name.
- The thread area above the box is an `aria-live="polite"` region.

## Usage in React

```tsx
import { Composer } from '@/components/designme/composer/Composer';
```

### Example

```tsx
'use client';
// The interactive preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { Composer, type ComposerAttachment } from './Composer';
import { Icon, type IconName } from '../lib/icons';
import { Think } from '../lib/motion';
import { useScript, type Script } from '../lib/useScript';

/* ---------- Composer: add context, pick where it runs, dictate from a sample, send and get a reply ---------- */
const ADDS: Record<string, [IconName, string]> = { file: ['file-text', 'brief.pdf'], shot: ['image', 'Screenshot 10.42'], figma: ['figma', 'Pricing / Desktop'] };
const PROJECTS = ['acme-webapp', 'marketing-site', 'design-tokens'].map(p => ({ value: p, detail: '~/code/' + p }));
// the page can't use a microphone, so dictation plays this sample
const SAID = 'Can you tighten the spacing on the pricing cards and keep the buttons the same height? Then run the visual tests before you open the PR.';

type Msg = { id: number; from: 'you' | 'agent'; text: string; files?: string[]; thinking?: boolean };

export default function ComposerDemo() {
  const [text, setText] = useState('');
  const [files, setFiles] = useState<ComposerAttachment[]>([]);
  const [thread, setThread] = useState<Msg[]>([]);
  const [dictating, setDictating] = useState(false);
  const script = useRef<Script>(null), take = useRef(0), ids = useRef(0), speaking = useRef(0);
  useScript(async s => { script.current = s; });

  const dictate = async () => {
    const s = script.current; if (!s) return;
    const mine = ++take.current;
    speaking.current = 0; setDictating(true);
    await s.wait(900);
    for (const w of SAID.split(' ')) {
      if (take.current !== mine) return;
      speaking.current = 6; setText(t => t + (t ? ' ' : '') + w);
      await s.wait(150 + Math.random() * 140 + (/[?.,]$/.test(w) ? 520 : 0));
    }
  };
  // one bar of the waveform: loud while a word was just said, quiet in between
  const level = () => {
    if (speaking.current <= 0) return 0;
    speaking.current--;
    return Math.min(1, .25 + Math.random() * .75 * (.6 + .4 * Math.sin(performance.now() / 90)));
  };
  const send = ({ text: said, attachments }: { text: string; attachments: ComposerAttachment[] }) => {
    const you: Msg = { id: ++ids.current, from: 'you', text: said, files: attachments.map(a => a.label) };
    const agent: Msg = { id: ++ids.current, from: 'agent', text: 'Thinking', thinking: true };
    setThread(t => [...t, you, agent].slice(-4));
    script.current?.wait(1700).then(() => setThread(t => t.map(m => m.id === agent.id ? { ...m, text: "On it. I'll start with the pricing cards.", thinking: false } : m)));
  };

  return (
    <div style={{ width: '100%' }}>
      <Composer value={text} onValueChange={setText} onSubmit={send}
        attachments={files} onAttachmentsChange={setFiles}
        onAdd={v => { const [icon, label] = ADDS[v]; setFiles(f => [...f, { key: v + ++ids.current, icon, label }]); }}
        projects={PROJECTS} handoffNote="2 cloud machines free · 4 hours left this month"
        onDictate={dictate} dictating={dictating} level={level} onDictationEnd={() => { take.current++; setDictating(false); }}
        thread={thread.map(m => m.from === 'you'
          ? <div key={m.id} className="dm-bub dm-enter">
              {m.files?.length ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: m.text ? 6 : 0 }}>{m.files.map((f, i) => <span key={i} className="dm-fchip"><Icon name="clip" size="xs" />{f}</span>)}</div> : null}
              {m.text}
            </div>
          : <div key={m.id + (m.thinking ? 't' : 'd')} className="dm-cpx-ag dm-enter">
              {m.thinking ? <><Think /><span className="dm-shim">{m.text}</span></> : <span>{m.text}</span>}
            </div>)} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `value` (optional) | `string` | The text in the box. Leave it out to let the composer keep it |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(value: string) => void` |  |
| `placeholder` (optional) | `string` |  |
| `onSubmit` (optional) | `(message: { text: string; attachments: ComposerAttachment[] }) => void` | Called with the message when the person sends it. The box clears itself afterwards |
| `busy` (optional) | `boolean` | The agent is answering: send turns into stop |
| `onStop` (optional) | `() => void` | Called by the stop button while busy |
| `thread` (optional) | `ReactNode` | The conversation above the box, like the bubbles a message turns into |
| `attachments` (optional) | `ComposerAttachment[]` | Files and context added to the message, shown as chips above the text |
| `defaultAttachments` (optional) | `ComposerAttachment[]` |  |
| `onAttachmentsChange` (optional) | `(attachments: ComposerAttachment[]) => void` |  |
| `addOptions` (optional) | `ComposerOption[]` | What the + menu can add. Defaults to files, a screenshot and a Figma frame |
| `onAdd` (optional) | `(value: string) => void` | Called with the option's value when the person picks one from the + menu |
| `projects` (optional) | `ComposerOption[]` | The projects the task can run in. The project chip only shows when there are some |
| `project` (optional) | `string` |  |
| `defaultProject` (optional) | `string` |  |
| `onProjectChange` (optional) | `(project: string) => void` |  |
| `environments` (optional) | `ComposerOption[]` | Where the task runs. Defaults to Local, Worktree and Cloud |
| `environment` (optional) | `string` |  |
| `defaultEnvironment` (optional) | `string` |  |
| `onEnvironmentChange` (optional) | `(environment: string) => void` |  |
| `handoff` (optional) | `boolean` | Whether the task hands itself off to the cloud when the laptop closes |
| `defaultHandoff` (optional) | `boolean` |  |
| `onHandoffChange` (optional) | `(handoff: boolean) => void` |  |
| `handoffNote` (optional) | `ReactNode` | A quiet line at the foot of the hand-off popover, like how many cloud machines are free |
| `tools` (optional) | `ReactNode` | More in the toolbar, before the effort button, like the model and a context ring |
| `effort` (optional) | `ComposerEffort` | How hard the agent works on it |
| `defaultEffort` (optional) | `ComposerEffort` |  |
| `onEffortChange` (optional) | `(effort: ComposerEffort) => void` |  |
| `onDictate` (optional) | `() => void` | Called by the microphone button. Start listening and set dictating; the mic button only shows when this is set |
| `dictating` (optional) | `boolean` | Turns the toolbar into a waveform with cancel and done. Write what you hear into value while it is on |
| `level` (optional) | `number \| (() => number)` | How loud the microphone is, 0 to 1. A function is read for every bar of the waveform, so it can come straight from an analyser |
| `onDictationEnd` (optional) | `(keep: boolean) => void` | Called by cancel (false, the text goes back to what it was) or done (true, the text stays) |
| `className` (optional) | `string` |  |

## Questions

**Does the composer record audio itself?**

No. `onDictate` tells you the person pressed the microphone, and you start listening, set `dictating` and write what you hear into `value`. Pass `level` as a number or a function, for example one that reads an audio analyser, to drive the waveform.

**What happens to the text when dictation is cancelled?**

The composer remembers the text from before dictation started. Cancel, or Escape, puts it back and calls `onDictationEnd(false)`, while Done keeps the dictated text and calls `onDictationEnd(true)`.

**Where does the project chip come from?**

It only shows when you pass `projects`. Pick the current one with `project` or `defaultProject`, and listen with `onProjectChange`.

**Can people send a message with only an attachment?**

Yes. Send is enabled when there is text or at least one attachment, and it is disabled while `busy` is true.

## Source

`Composer.tsx`, as `npx designme add composer --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode, type RefObject } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
import './composer.css';

export type ComposerEffort = 'low' | 'medium' | 'high';

export interface ComposerAttachment {
  key: string;
  label: string;
  /** Defaults to a paper clip */
  icon?: IconName;
}
export interface ComposerOption {
  value: string;
  /** Defaults to the value */
  label?: string;
  /** The quiet line under the label */
  detail?: string;
  icon?: IconName;
}

export interface ComposerProps {
  /** The text in the box. Leave it out to let the composer keep it */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  /** Called with the message when the person sends it. The box clears itself afterwards */
  onSubmit?: (message: { text: string; attachments: ComposerAttachment[] }) => void;
  /** The agent is answering: send turns into stop */
  busy?: boolean;
  /** Called by the stop button while busy */
  onStop?: () => void;
  /** The conversation above the box, like the bubbles a message turns into */
  thread?: ReactNode;

  /** Files and context added to the message, shown as chips above the text */
  attachments?: ComposerAttachment[];
  defaultAttachments?: ComposerAttachment[];
  onAttachmentsChange?: (attachments: ComposerAttachment[]) => void;
  /** What the + menu can add. Defaults to files, a screenshot and a Figma frame */
  addOptions?: ComposerOption[];
  /** Called with the option's value when the person picks one from the + menu */
  onAdd?: (value: string) => void;

  /** The projects the task can run in. The project chip only shows when there are some */
  projects?: ComposerOption[];
  project?: string;
  defaultProject?: string;
  onProjectChange?: (project: string) => void;
  /** Where the task runs. Defaults to Local, Worktree and Cloud */
  environments?: ComposerOption[];
  environment?: string;
  defaultEnvironment?: string;
  onEnvironmentChange?: (environment: string) => void;
  /** Whether the task hands itself off to the cloud when the laptop closes */
  handoff?: boolean;
  defaultHandoff?: boolean;
  onHandoffChange?: (handoff: boolean) => void;
  /** A quiet line at the foot of the hand-off popover, like how many cloud machines are free */
  handoffNote?: ReactNode;
  /** More in the toolbar, before the effort button, like the model and a context ring */
  tools?: ReactNode;
  /** How hard the agent works on it */
  effort?: ComposerEffort;
  defaultEffort?: ComposerEffort;
  onEffortChange?: (effort: ComposerEffort) => void;

  /** Called by the microphone button. Start listening and set dictating; the mic button only shows when this is set */
  onDictate?: () => void;
  /** Turns the toolbar into a waveform with cancel and done. Write what you hear into value while it is on */
  dictating?: boolean;
  /** How loud the microphone is, 0 to 1. A function is read for every bar of the waveform, so it can come straight from an analyser */
  level?: number | (() => number);
  /** Called by cancel (false, the text goes back to what it was) or done (true, the text stays) */
  onDictationEnd?: (keep: boolean) => void;
  className?: string;
}

const ADD: ComposerOption[] = [
  { value: 'file', label: 'Upload files', detail: 'Images, PDFs, code', icon: 'clip' },
  { value: 'shot', label: 'Add a screenshot', detail: 'Of your current screen', icon: 'image' },
  { value: 'figma', label: 'Link a Figma frame', detail: 'Paste a frame URL', icon: 'figma' }
];
const ENVS: ComposerOption[] = [
  { value: 'Local', detail: 'On this Mac, in your working copy', icon: 'laptop' },
  { value: 'Worktree', detail: 'A separate copy, your files stay as they are', icon: 'branch' },
  { value: 'Cloud', detail: 'Keeps going when your laptop sleeps', icon: 'cloud' }
];
const EFFORTS: { value: ComposerEffort; label: string; detail: string }[] = [
  { value: 'low', label: 'Low', detail: 'Quick answers, small edits' },
  { value: 'medium', label: 'Medium', detail: 'Plans first, then builds' },
  { value: 'high', label: 'High', detail: 'Thinks longer, checks its work' }
];
const PLACEHOLDER = 'Ask anything, or type / for skills';

type PopName = 'plus' | 'proj' | 'env' | 'cloud' | 'eff';

const Bars = ({ n }: { n: number }) => <span className="dm-cpx-bars">{[0, 1, 2].map(i => <i key={i} className={i < n ? 'dm-on' : undefined} />)}</span>;
const Check = () => <span className="dm-ck"><Icon name="check" /></span>;

/** Draws the dictation waveform: one bar per sample, scrolling left, quiet dots where nothing was said */
function Wave({ on, level, box }: { on: boolean; level: ComposerProps['level']; box: RefObject<HTMLDivElement | null> }) {
  const cv = useRef<HTMLCanvasElement>(null);
  const lv = useRef(level);
  useEffect(() => { lv.current = level; });
  useEffect(() => {
    if (!on) return;
    const samples: number[] = [];
    let last = 0, raf = 0;
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (t - last > 55) { last = t; const l = lv.current; samples.push(Math.max(0, Math.min(1, (typeof l === 'function' ? l() : l) ?? 0))); if (samples.length > 400) samples.shift(); }
      const c = cv.current, host = box.current; if (!c || !host) return;
      const dpr = devicePixelRatio || 1, w = c.clientWidth, h = c.clientHeight; if (!w) return;
      if (c.width !== w * dpr) { c.width = w * dpr; c.height = h * dpr; }
      const x = c.getContext('2d'); if (!x) return;
      x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
      const cs = getComputedStyle(host), col = cs.getPropertyValue('--dm-fg2').trim(), faint = cs.getPropertyValue('--dm-faint').trim();
      const step = 3.5, n = Math.floor(w / step);
      for (let i = 0; i < n; i++) {
        const v = samples[samples.length - n + i], px = i * step + 1, mid = h / 2;
        x.globalAlpha = Math.min(1, i / 18);
        if (!v) { x.fillStyle = faint; x.fillRect(px, mid - .6, 1.2, 1.2); }
        else { const bh = Math.max(3, v * (h - 6)); x.fillStyle = col; x.beginPath(); if (x.roundRect) x.roundRect(px, mid - bh / 2, 2, bh, 1); else x.rect(px, mid - bh / 2, 2, bh); x.fill(); }
      }
      x.globalAlpha = 1;
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [on, box]);
  return <canvas ref={cv} className="dm-cpx-wave" aria-hidden="true" />;
}

/** The message box: text that grows as you type, files and context, project, where it runs, effort, dictation and send. */
export function Composer({
  value, defaultValue = '', onValueChange, placeholder = PLACEHOLDER, onSubmit, busy = false, onStop, thread,
  attachments, defaultAttachments = [], onAttachmentsChange, addOptions = ADD, onAdd,
  projects, project, defaultProject, onProjectChange, environments = ENVS, environment, defaultEnvironment, onEnvironmentChange,
  handoff, defaultHandoff = false, onHandoffChange, handoffNote, tools, effort, defaultEffort = 'medium', onEffortChange,
  onDictate, dictating = false, level, onDictationEnd, className
}: ComposerProps) {
  const [text, setText] = useControllable(value, defaultValue, onValueChange);
  const [files, setFiles] = useControllable(attachments, defaultAttachments, onAttachmentsChange);
  const [proj, setProj] = useControllable(project, defaultProject ?? projects?.[0]?.value ?? '', onProjectChange);
  const [env, setEnv] = useControllable(environment, defaultEnvironment ?? environments[0]?.value ?? '', onEnvironmentChange);
  const [cloud, setCloud] = useControllable(handoff, defaultHandoff, onHandoffChange);
  const [eff, setEff] = useControllable(effort, defaultEffort, onEffortChange);
  const effN = EFFORTS.findIndex(e => e.value === eff) + 1;
  const envOpt = environments.find(e => e.value === env) ?? environments[0];
  const projOpt = projects?.find(p => p.value === proj);

  const box = useRef<HTMLDivElement>(null), ta = useRef<HTMLTextAreaElement>(null);
  // the text box grows with its text, up to 160px
  useIsoLayoutEffect(() => { const t = ta.current; if (!t) return; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 160) + 'px'; }, [text, dictating]);

  /* ---------- popovers: open above their button, close on a click outside, Escape or a pick ---------- */
  const [pop, setPop] = useState<PopName | null>(null);
  const [place, setPlace] = useState<Partial<Record<PopName, CSSProperties>>>({});
  const triggers = useRef<Partial<Record<PopName, HTMLButtonElement | null>>>({});
  const pops = useRef<Partial<Record<PopName, HTMLDivElement | null>>>({});
  const toggle = (name: PopName) => setPop(p => p === name ? null : name);
  const pick = (fn: () => void) => () => { fn(); setTimeout(() => setPop(null), 120); };
  useIsoLayoutEffect(() => {
    if (!pop) return;
    const btn = triggers.current[pop], el = pops.current[pop], host = box.current; if (!btn || !el || !host) return;
    // effort and the cloud hand-off sit near the right end of the bar, so they line up with their button's right edge
    const hr = host.getBoundingClientRect(), br = btn.getBoundingClientRect(), end = pop === 'eff' || pop === 'cloud';
    let x = end ? br.right - hr.left - el.offsetWidth : br.left - hr.left;
    x = Math.max(-hr.left + 8, Math.min(x, innerWidth - hr.left - el.offsetWidth - 8));
    setPlace(p => ({ ...p, [pop]: { left: x, top: br.top - hr.top - el.offsetHeight - 6, '--dm-origin': 'bottom ' + (end ? 'right' : 'left') } as CSSProperties }));
  }, [pop]);
  useEffect(() => {
    if (!pop) return;
    const click = (e: MouseEvent) => { const t = e.target as Node; if (!pops.current[pop]?.contains(t) && !triggers.current[pop]?.contains(t)) setPop(null); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setPop(null); };
    const resize = () => setPop(null);
    document.addEventListener('click', click); document.addEventListener('keydown', key); addEventListener('resize', resize);
    return () => { document.removeEventListener('click', click); document.removeEventListener('keydown', key); removeEventListener('resize', resize); };
  }, [pop]);
  const trigger = (name: PopName) => ({
    ref: (el: HTMLButtonElement | null) => { triggers.current[name] = el; },
    'aria-expanded': pop === name, 'aria-haspopup': name === 'cloud' ? 'dialog' as const : 'menu' as const, onClick: () => toggle(name)
  });
  const popProps = (name: PopName, cls: string) => ({
    ref: (el: HTMLDivElement | null) => { pops.current[name] = el; },
    className: cx('dm-pop', cls, pop === name && 'dm-open'), style: place[name], inert: pop !== name
  });

  /* ---------- attachments leave with a short fade before they go ---------- */
  const [leaving, setLeaving] = useState<string[]>([]);
  const latest = useRef(files);
  useEffect(() => { latest.current = files; });
  const remove = (key: string) => {
    setLeaving(l => [...l, key]);
    setTimeout(() => { setLeaving(l => l.filter(k => k !== key)); setFiles(latest.current.filter(f => f.key !== key)); }, 300);
  };
  const insert = (s: string) => { setText(text + (text && !text.endsWith(' ') ? ' ' : '') + s); ta.current?.focus(); };

  /* ---------- dictation: what was there comes back on cancel ---------- */
  const before = useRef('');
  const wasDictating = useRef(dictating);
  useEffect(() => {
    if (dictating && !wasDictating.current) { before.current = text; setText(''); }
    wasDictating.current = dictating;
  }); // eslint-disable-line react-hooks/exhaustive-deps
  const endDictation = (keep: boolean) => { if (!keep) setText(before.current); onDictationEnd?.(keep); ta.current?.focus(); };

  const canSend = !!text.trim() || files.length > 0;
  const submit = () => {
    if (!canSend || busy) return;
    onSubmit?.({ text: text.trim(), attachments: files });
    setText(''); setFiles([]);
  };

  return (
    <div data-dm="" className={cx('dm-cpx', className)}>
      <div className="dm-cpx-thread" aria-live="polite">{thread}</div>
      <div ref={box} className="dm-cpx-box" data-mode={dictating ? 'voice' : 'idle'}>
        <div className="dm-cpx-att">{files.map(f => (
          <span key={f.key} className={cx('dm-fchip', leaving.includes(f.key) ? 'dm-leave' : 'dm-enter')}>
            <Icon name={f.icon ?? 'clip'} size="xs" />{f.label}
            <button type="button" className="dm-x" aria-label={'Remove ' + f.label} onClick={() => remove(f.key)}><Icon name="x" size="xs" /></button>
          </span>))}
        </div>
        <textarea ref={ta} className="dm-cpx-ta" rows={1} aria-label="Message" placeholder={dictating ? 'Listening…' : placeholder} value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter' && !e.shiftKey && !dictating) { e.preventDefault(); submit(); }
            if (e.key === 'Escape' && dictating) endDictation(false);
          }} />
        <div className="dm-cpx-rows">
          <div className="dm-cpx-bar" inert={dictating}>
            <Tip label="Add files and context" off={pop === 'plus'}><button type="button" className="dm-ib dm-cpx-add" aria-label="Add context" {...trigger('plus')}><Icon name="plus" /></button></Tip>
            {projOpt && <Tip label="Project" off={pop === 'proj'}><button type="button" className="dm-chip" data-pop=".pp-proj" {...trigger('proj')}><Icon name={projOpt.icon ?? 'folder'} /><Swap className="dm-cpx-proj">{projOpt.label ?? projOpt.value}</Swap></button></Tip>}
            {envOpt && <Tip label="Where it runs" off={pop === 'env'}><button type="button" className="dm-chip dm-on" {...trigger('env')}><Icon name={envOpt.icon ?? 'laptop'} /><Swap className="dm-cpx-env">{envOpt.label ?? envOpt.value}</Swap></button></Tip>}
            <Tip label={cloud ? 'Hands off to the cloud when you close your laptop' : 'Hand off to the cloud'} off={pop === 'cloud'}><button type="button" className={cx('dm-ib dm-cpx-cloud', cloud && 'dm-on')} aria-label="Cloud hand-off" {...trigger('cloud')}><Icon name="cloud" /></button></Tip>
            <span className="dm-sp" />
            {tools}
            <Tip label={'Effort: ' + EFFORTS[effN - 1].label} off={pop === 'eff'}><button type="button" className="dm-ib dm-cpx-eff" aria-label="Effort" {...trigger('eff')}><Bars n={effN} /></button></Tip>
            {onDictate && <Tip label="Dictate" kbd="⌘D"><button type="button" className="dm-ib dm-cpx-mic" aria-label="Dictate" onClick={onDictate}><Icon name="mic" /></button></Tip>}
            {busy
              ? <Tip label="Stop"><button type="button" className="dm-cpx-send" aria-label="Stop" onClick={onStop}><Icon name="stop" /></button></Tip>
              : <Tip label="Send" kbd="↵"><button type="button" className="dm-cpx-send" aria-label="Send" disabled={!canSend} onClick={submit}><Icon name="up" /></button></Tip>}
          </div>
          <div className="dm-cpx-voice" inert={!dictating}>
            <Wave on={dictating} level={level} box={box} />
            <Tip label="Cancel" kbd="Esc"><button type="button" className="dm-ib dm-cpx-cancel" aria-label="Cancel" onClick={() => endDictation(false)}><Icon name="x" /></button></Tip>
            <Tip label="Done"><button type="button" className="dm-cpx-send dm-cpx-ok" aria-label="Use this text" onClick={() => endDictation(true)}><Icon name="check" /></button></Tip>
          </div>
        </div>

        <div role="menu" aria-label="Add context" {...popProps('plus', 'dm-pp-plus')}>
          {addOptions.map(o => <button key={o.value} type="button" role="menuitem" className="dm-mi" onClick={pick(() => onAdd?.(o.value))}><Icon name={o.icon ?? 'clip'} /><span>{o.label ?? o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span></button>)}
          <div className="dm-sep" />
          <button type="button" role="menuitem" className="dm-mi" onClick={pick(() => insert('@'))}><Icon name="at" /><span>Mention a file</span><span className="dm-r dm-kbd">@</span></button>
          <button type="button" role="menuitem" className="dm-mi" onClick={pick(() => insert('/'))}><Icon name="slash" /><span>Use a skill</span><span className="dm-r dm-kbd">/</span></button>
        </div>
        {projects && projects.length > 0 && <div role="menu" aria-label="Project" {...popProps('proj', 'dm-pp-proj')}>
          <div className="dm-ph">Recent projects</div>
          {projects.map(o => <button key={o.value} type="button" role="menuitemradio" aria-checked={o.value === proj} className="dm-mi" onClick={pick(() => setProj(o.value))}><Icon name={o.icon ?? 'folder'} /><span>{o.label ?? o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span><Check /></button>)}
        </div>}
        <div role="menu" aria-label="Where it runs" {...popProps('env', 'dm-pp-env')}>
          <div className="dm-ph">Run this task</div>
          {environments.map(o => <button key={o.value} type="button" role="menuitemradio" aria-checked={o.value === env} className="dm-mi" onClick={pick(() => setEnv(o.value))}><Icon name={o.icon ?? 'laptop'} /><span>{o.label ?? o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span><Check /></button>)}
        </div>
        <div aria-label="Cloud hand-off" {...popProps('cloud', 'dm-pp-cloud dm-cpx-cloudpop')}>
          <div className="dm-cc-h"><Icon name="cloud" /><div><b>Hand off to the cloud</b><span>Continue this task on a cloud machine if you close your laptop.</span></div></div>
          <button type="button" className="dm-cc-row" role="switch" aria-checked={cloud} onClick={() => setCloud(!cloud)}><span>Hand off automatically</span><span className="dm-toggle" aria-hidden="true" /></button>
          {handoffNote && <div className="dm-cc-meta"><span className="dm-dot" style={{ color: 'var(--dm-ok)' }} />{handoffNote}</div>}
        </div>
        <div role="menu" aria-label="Effort" {...popProps('eff', 'dm-pp-eff')}>
          <div className="dm-ph">Effort</div>
          {EFFORTS.map((o, i) => <button key={o.value} type="button" role="menuitemradio" aria-checked={o.value === eff} className="dm-mi" onClick={pick(() => setEff(o.value))}><Bars n={i + 1} /><span>{o.label}<span className="dm-d">{o.detail}</span></span><Check /></button>)}
        </div>
      </div>
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with a live preview and versions.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
