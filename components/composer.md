# Composer

> Message input with attachments, what to work on, a mode and dictation.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/composer

## Install

```sh
npx designme add composer          # HTML, CSS and JS, with the shared core
npx designme add composer --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Composer is the box where a person writes a task for a design or coding agent and sends it. Besides the text, it lets them attach files and frames, pick what the agent works on, choose what the agent may do (ask, edit or plan), and dictate instead of typing.

### When to use it

- When a message often comes with files, frames or screenshots that should travel with it, and some of them take a moment to load.
- When the agent can work on more than one file or project and people should see, and change, which one it is on.
- When people should decide up front whether the agent only answers, makes changes, or writes a plan first.
- When people should be able to stop the agent while it answers, from the same button they used to send.

### What it does

- The text box grows as you type, up to 160px. Enter sends, Shift+Enter adds a new line, and `onSubmit` receives the trimmed text and the attachments before the box clears.
- Attachments show as chips above the text. A chip can be loading, with a spinner, or failed, in red with a Try again button that calls `onRetry`. Send waits until every attachment has loaded.
- The attach menu lists `addOptions`, which default to a file, a Figma frame and a screenshot, and calls `onAdd` with the one picked.
- A chip in the toolbar shows what the agent works on, from `contexts`, and opens a menu to switch it. It only shows when you pass `contexts`.
- The mode chip picks what the agent may do from `modes`, which default to Ask (answer only, change nothing), Edit (change frames on a new page) and Plan (propose steps before it starts). `tools` adds your own controls just before it.
- While `busy` is true, the Send button becomes a Stop button that calls `onStop`.
- When `onDictate` is set, a microphone button appears. With `dictating` on, the toolbar shows a red dot, Listening and a clock, with Cancel to restore the earlier text and Done to keep what was heard.

### Accessibility

- The menus use `role="menu"`, the Working on and mode menus mark the current pick with `menuitemradio` and `aria-checked`, and each button that opens a menu reports `aria-expanded`.
- Escape or a click outside closes an open menu, and Escape in the text box cancels dictation.
- Each attachment's remove button is labelled with its name, and a failed attachment's retry button is labelled Try again.
- The thread area above the box is an `aria-live="polite"` region.

## Usage in React

```tsx
import { Composer } from '@/components/designme/composer/Composer';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { Composer, type ComposerAttachment } from './Composer';
import { Icon, type IconName } from '../lib/icons';
import { Think } from '../lib/motion';
import { useScript, useStory, type Script } from '../lib/useScript';

/* ---------- Composer: attach a frame that won't open, try again, write the ask, switch to Edit, send and get a reply ---------- */
const ADDS: Record<string, [IconName, string]> = { file: ['file-text', 'Spacing notes.pdf'], figma: ['figma', 'Pricing / Desktop'], shot: ['image', 'Screenshot 10.42'] };
const CONTEXTS = [
  { value: 'Pricing v4', detail: 'Figma, 6 frames', icon: 'figma' as const },
  { value: 'Checkout flow', detail: 'Figma, 4 frames', icon: 'figma' as const },
  { value: 'Marketing site', detail: 'Code, main branch', icon: 'code' as const }
];
// the page can't use a microphone, so dictation plays this sample
const SAID = 'Tighten the spacing on the plan cards and keep the buttons the same height';
const REPLY: Record<string, (ctx: string) => string> = {
  ask: ctx => `Looking at ${ctx}. I won't change anything.`,
  edit: ctx => `On it. I'll make the changes on a new page in ${ctx}.`,
  plan: ctx => `I'll write a plan for ${ctx} first, then wait for you.`
};

type Msg = { id: number; from: 'you' | 'agent'; text: string; files?: string[]; working?: boolean };

export default function ComposerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState('');
  const [files, setFiles] = useState<ComposerAttachment[]>([]);
  const [ctx, setCtx] = useState('Pricing v4');
  const [mode, setMode] = useState('ask');
  const [thread, setThread] = useState<Msg[]>([]);
  const [dictating, setDictating] = useState(false);
  const script = useRef<Script>(null), take = useRef(0), ids = useRef(0), tries = useRef(0);
  useScript(async s => { script.current = s; });
  const live = useRef({ ctx, mode });
  useEffect(() => { live.current = { ctx, mode }; });

  // a file loads before it can be sent; the first Figma link can't be opened, and Try again fetches it
  const load = (key: string, kind: string) => {
    const fail = kind === 'figma' && tries.current++ === 0;
    setFiles(f => f.map(x => x.key === key ? { ...x, status: 'loading', label: ADDS[kind][1] } : x));
    script.current?.wait(1000).then(() => setFiles(f => f.map(x => x.key === key ? { ...x, status: fail ? 'error' : 'ready', label: fail ? ADDS[kind][1] + " can't be opened" : ADDS[kind][1] } : x)));
  };
  const add = (kind: string) => { const key = kind + ++ids.current; setFiles(f => [...f, { key, icon: ADDS[kind][0], label: ADDS[kind][1], status: 'loading' }]); load(key, kind); };

  const dictate = async () => {
    const s = script.current; if (!s) return;
    const mine = ++take.current;
    setDictating(true);
    await s.wait(700);
    for (const w of SAID.split(' ')) { if (take.current !== mine) return; setText(t => t + (t ? ' ' : '') + w); await s.wait(160 + Math.random() * 120); }
  };
  const send = ({ text: said, attachments }: { text: string; attachments: ComposerAttachment[] }) => {
    const you: Msg = { id: ++ids.current, from: 'you', text: said, files: attachments.map(a => a.label) };
    const agent: Msg = { id: ++ids.current, from: 'agent', text: 'Working', working: true };
    setThread(t => [...t, you, agent].slice(-4));
    const answer = REPLY[live.current.mode](live.current.ctx);
    script.current?.wait(1700).then(() => setThread(t => t.map(m => m.id === agent.id ? { ...m, text: answer, working: false } : m)));
  };

  // the preview's story: the person attaches a frame, it won't open, they try again, write the ask, switch to Edit and send
  // taking over while it writes takes the words back
  useStory(ref, async ({ wait, press, taken }) => {
    await wait(1500); add('figma');
    await wait(2500); press('.dm-rt');
    await wait(1500);
    let writing = true;
    taken(() => { if (writing) setText(''); });
    for (const w of 'Tighten the spacing on the plan cards'.split(' ')) { setText(t => t + (t ? ' ' : '') + w); await wait(150); }
    writing = false;
    await wait(1000); press('.dm-cpx-mode');
    await wait(1500); press('.dm-pp-mode .dm-mi:nth-of-type(2)');
    await wait(1000); press('.dm-cpx-send');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Composer value={text} onValueChange={setText} onSubmit={send}
        attachments={files} onAttachmentsChange={setFiles} onAdd={add}
        onRetry={key => { const f = files.find(x => x.key === key); if (f) load(key, f.key.replace(/\d+$/, '')); }}
        contexts={CONTEXTS} context={ctx} onContextChange={setCtx} mode={mode} onModeChange={setMode}
        onDictate={dictate} dictating={dictating} onDictationEnd={() => { take.current++; setDictating(false); }}
        thread={thread.map(m => m.from === 'you'
          ? <div key={m.id} className="dm-bub dm-enter">
              {m.files?.length ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: m.text ? 6 : 0 }}>{m.files.map((f, i) => <span key={i} className="dm-fchip"><Icon name="clip" size="xs" />{f}</span>)}</div> : null}
              {m.text}
            </div>
          : <div key={m.id + (m.working ? 'w' : 'd')} className="dm-cpx-ag dm-enter">
              {m.working ? <><Think /><span className="dm-shim">{m.text}</span></> : <span>{m.text}</span>}
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
| `attachments` (optional) | `ComposerAttachment[]` | Files and frames added to the message, shown as chips above the text |
| `defaultAttachments` (optional) | `ComposerAttachment[]` |  |
| `onAttachmentsChange` (optional) | `(attachments: ComposerAttachment[]) => void` |  |
| `addOptions` (optional) | `ComposerOption[]` | What the attach menu offers. Defaults to a file, a Figma frame and a screenshot |
| `onAdd` (optional) | `(value: string) => void` | Called with the option's value when the person picks one from the attach menu |
| `onRetry` (optional) | `(key: string) => void` | Called by Try again on an attachment that failed to load |
| `contexts` (optional) | `ComposerOption[]` | What the agent can work on, like Figma files and repositories. The chip only shows when there are some |
| `context` (optional) | `string` |  |
| `defaultContext` (optional) | `string` |  |
| `onContextChange` (optional) | `(context: string) => void` |  |
| `modes` (optional) | `ComposerOption[]` | What the agent may do. Defaults to Ask, Edit and Plan |
| `mode` (optional) | `string` |  |
| `defaultMode` (optional) | `string` |  |
| `onModeChange` (optional) | `(mode: string) => void` |  |
| `tools` (optional) | `ReactNode` | More in the toolbar, before the mode, like a context ring |
| `onDictate` (optional) | `() => void` | Called by the microphone button. Start listening and set dictating; the mic button only shows when this is set |
| `dictating` (optional) | `boolean` | Swaps the toolbar for a red dot, a clock, Cancel and Done. Write what you hear into value while it is on |
| `dictationSeconds` (optional) | `number` | Seconds to show while dictating. Leave it out to let it count |
| `onDictationEnd` (optional) | `(keep: boolean) => void` | Called by Cancel (false, the text goes back to what it was) or Done (true, the text stays) |
| `className` (optional) | `string` |  |

## Questions

**Does the composer record audio itself?**

No. `onDictate` tells you the person pressed the microphone, and you start listening, set `dictating` and write what you hear into `value`. The clock counts by itself, or pass `dictationSeconds`.

**What happens to the text when dictation is cancelled?**

The composer remembers the text from before dictation started. Cancel, or Escape in the text box, puts it back and calls `onDictationEnd(false)`, while Done keeps the dictated text and calls `onDictationEnd(true)`.

**How do I show a file that is still uploading or failed?**

Give the attachment `status: 'loading'` while it uploads and `'error'` if it fails. Send stays disabled until every attachment is ready, and Try again on a failed one calls `onRetry` with its key.

**Can people send a message with only an attachment?**

Yes. Send is enabled as soon as there is text or an attachment, once every attachment has loaded, and it is disabled while `busy` is true.

## Source

`Composer.tsx`, as `npx designme add composer --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useSeconds } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './composer.css';

export interface ComposerAttachment {
  key: string;
  label: string;
  /** Defaults to a paper clip */
  icon?: IconName;
  /** loading shows a spinner and holds Send until it's ready; error shows the chip in red with a Try again button */
  status?: 'loading' | 'error' | 'ready';
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

  /** Files and frames added to the message, shown as chips above the text */
  attachments?: ComposerAttachment[];
  defaultAttachments?: ComposerAttachment[];
  onAttachmentsChange?: (attachments: ComposerAttachment[]) => void;
  /** What the attach menu offers. Defaults to a file, a Figma frame and a screenshot */
  addOptions?: ComposerOption[];
  /** Called with the option's value when the person picks one from the attach menu */
  onAdd?: (value: string) => void;
  /** Called by Try again on an attachment that failed to load */
  onRetry?: (key: string) => void;

  /** What the agent can work on, like Figma files and repositories. The chip only shows when there are some */
  contexts?: ComposerOption[];
  context?: string;
  defaultContext?: string;
  onContextChange?: (context: string) => void;
  /** What the agent may do. Defaults to Ask, Edit and Plan */
  modes?: ComposerOption[];
  mode?: string;
  defaultMode?: string;
  onModeChange?: (mode: string) => void;
  /** More in the toolbar, before the mode, like a context ring */
  tools?: ReactNode;

  /** Called by the microphone button. Start listening and set dictating; the mic button only shows when this is set */
  onDictate?: () => void;
  /** Swaps the toolbar for a red dot, a clock, Cancel and Done. Write what you hear into value while it is on */
  dictating?: boolean;
  /** Seconds to show while dictating. Leave it out to let it count */
  dictationSeconds?: number;
  /** Called by Cancel (false, the text goes back to what it was) or Done (true, the text stays) */
  onDictationEnd?: (keep: boolean) => void;
  className?: string;
}

const ADD: ComposerOption[] = [
  { value: 'file', label: 'Upload a file', detail: 'Images, PDFs or code', icon: 'file-text' },
  { value: 'figma', label: 'Link a Figma frame', detail: 'From any file you can open', icon: 'figma' },
  { value: 'shot', label: 'Add a screenshot', detail: "Of the window you're in", icon: 'image' }
];
const MODES: ComposerOption[] = [
  { value: 'ask', label: 'Ask', detail: 'Answer only, change nothing', icon: 'eye' },
  { value: 'edit', label: 'Edit', detail: 'Change frames on a new page', icon: 'edit' },
  { value: 'plan', label: 'Plan', detail: 'Propose steps before it starts', icon: 'list' }
];
const PLACEHOLDER = 'Ask the design agent, or attach a frame';

type PopName = 'plus' | 'ctx' | 'mode';
const Check = () => <span className="dm-ck"><Icon name="check" /></span>;
const clock = (s: number) => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');

/** The message box: text that grows as you type, attachments that load, what the agent works on, what it may do, dictation and send. */
export function Composer({
  value, defaultValue = '', onValueChange, placeholder = PLACEHOLDER, onSubmit, busy = false, onStop, thread,
  attachments, defaultAttachments = [], onAttachmentsChange, addOptions = ADD, onAdd, onRetry,
  contexts, context, defaultContext, onContextChange, modes = MODES, mode, defaultMode, onModeChange, tools,
  onDictate, dictating = false, dictationSeconds, onDictationEnd, className
}: ComposerProps) {
  const [text, setText] = useControllable(value, defaultValue, onValueChange);
  const [files, setFiles] = useControllable(attachments, defaultAttachments, onAttachmentsChange);
  const [ctx, setCtx] = useControllable(context, defaultContext ?? contexts?.[0]?.value ?? '', onContextChange);
  const [md, setMd] = useControllable(mode, defaultMode ?? modes[0]?.value ?? '', onModeChange);
  const ctxOpt = contexts?.find(o => o.value === ctx), mdOpt = modes.find(o => o.value === md) ?? modes[0];
  const counted = useSeconds(dictating && dictationSeconds === undefined);

  const box = useRef<HTMLDivElement>(null), ta = useRef<HTMLTextAreaElement>(null);
  // the text box grows with its text, up to 160px
  useIsoLayoutEffect(() => { const t = ta.current; if (!t) return; t.style.height = 'auto'; t.style.height = Math.min(t.scrollHeight, 160) + 'px'; }, [text, dictating]);

  /* ---------- menus: open above their button, close on a click outside, Escape or a pick ---------- */
  const [pop, setPop] = useState<PopName | null>(null);
  const [place, setPlace] = useState<Partial<Record<PopName, CSSProperties>>>({});
  const triggers = useRef<Partial<Record<PopName, HTMLButtonElement | null>>>({});
  const pops = useRef<Partial<Record<PopName, HTMLDivElement | null>>>({});
  const pick = (fn: () => void) => () => { fn(); setTimeout(() => setPop(null), 120); };
  useIsoLayoutEffect(() => {
    if (!pop) return;
    const btn = triggers.current[pop], el = pops.current[pop], host = box.current; if (!btn || !el || !host) return;
    // the mode sits near the right end of the bar, so its menu lines up with the button's right edge
    const hr = host.getBoundingClientRect(), br = btn.getBoundingClientRect(), end = pop === 'mode';
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
    'aria-expanded': pop === name, 'aria-haspopup': 'menu' as const, onClick: () => setPop(p => p === name ? null : name)
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

  /* ---------- dictation: what was there comes back on cancel ---------- */
  const before = useRef('');
  const wasDictating = useRef(dictating);
  useEffect(() => {
    if (dictating && !wasDictating.current) { before.current = text; setText(''); }
    wasDictating.current = dictating;
  }); // eslint-disable-line react-hooks/exhaustive-deps
  const endDictation = (keep: boolean) => { if (!keep) setText(before.current); onDictationEnd?.(keep); ta.current?.focus({ preventScroll: true }); };

  // send waits for text or a file, and for every file to finish loading
  const canSend = (!!text.trim() || files.length > 0) && !files.some(f => f.status === 'loading' || f.status === 'error');
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
          <span key={f.key} className={cx('dm-fchip', f.status === 'loading' && 'dm-ld', f.status === 'error' && 'dm-err', leaving.includes(f.key) ? 'dm-leave' : 'dm-enter')}>
            <span className="dm-ic" style={{ display: 'grid' }}>{f.status === 'loading' ? <Spin /> : <Icon name={f.status === 'error' ? 'alert' : f.icon ?? 'clip'} size="xs" />}</span>
            <Swap className="dm-n">{f.label}</Swap>
            {f.status === 'error' && onRetry && <Tip label="Try again"><button type="button" className="dm-rt" aria-label="Try again" onClick={() => onRetry(f.key)}><Icon name="refresh" size="xs" /></button></Tip>}
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
            <Tip label="Attach a file or a frame" off={pop === 'plus'}><button type="button" className="dm-ib dm-cpx-add" aria-label="Attach" {...trigger('plus')}><Icon name="clip" /></button></Tip>
            {ctxOpt && <Tip label="What the agent works on" off={pop === 'ctx'}><button type="button" className="dm-chip dm-cpx-ctx" {...trigger('ctx')}><Icon name={ctxOpt.icon ?? 'folder'} /><Swap className="dm-cpx-ctx-n">{ctxOpt.label ?? ctxOpt.value}</Swap><Icon name="chev-d" size="xs" /></button></Tip>}
            <span className="dm-sp" />
            {tools}
            {mdOpt && <Tip label="What the agent may do" off={pop === 'mode'}><button type="button" className="dm-chip dm-cpx-mode" {...trigger('mode')}><Icon name={mdOpt.icon ?? 'edit'} /><Swap className="dm-cpx-mode-n">{mdOpt.label ?? mdOpt.value}</Swap><Icon name="chev-d" size="xs" /></button></Tip>}
            {onDictate && <Tip label="Dictate"><button type="button" className="dm-ib dm-cpx-mic" aria-label="Dictate" onClick={onDictate}><Icon name="mic" /></button></Tip>}
            {busy
              ? <Tip label="Stop"><button type="button" className="dm-cpx-send" aria-label="Stop" onClick={onStop}><Icon name="stop" /></button></Tip>
              : <Tip label="Send" kbd="↵"><button type="button" className="dm-cpx-send" aria-label="Send" disabled={!canSend} onClick={submit}><Icon name="up" /></button></Tip>}
          </div>
          <div className="dm-cpx-voice" inert={!dictating}>
            <span className="dm-cpx-rec"><span className="dm-cpx-dot" />Listening</span><span className="dm-cpx-tm dm-num dm-muted">{clock(dictationSeconds ?? counted)}</span>
            <span className="dm-sp" />
            <button type="button" className="dm-pill dm-ghost dm-sm dm-cpx-cancel" onClick={() => endDictation(false)}>Cancel</button>
            <button type="button" className="dm-pill dm-ink dm-sm dm-cpx-ok" onClick={() => endDictation(true)}>Done</button>
          </div>
        </div>

        <div role="menu" aria-label="Attach" {...popProps('plus', 'dm-pp-plus')}>
          {addOptions.map(o => <button key={o.value} type="button" role="menuitem" className="dm-mi" onClick={pick(() => onAdd?.(o.value))}><Icon name={o.icon ?? 'clip'} /><span>{o.label ?? o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span></button>)}
        </div>
        {contexts && contexts.length > 0 && <div role="menu" aria-label="Working on" {...popProps('ctx', 'dm-pp-ctx')}>
          <div className="dm-ph">Working on</div>
          {contexts.map(o => <button key={o.value} type="button" role="menuitemradio" aria-checked={o.value === ctx} className="dm-mi" onClick={pick(() => setCtx(o.value))}><Icon name={o.icon ?? 'folder'} /><span>{o.label ?? o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span><Check /></button>)}
        </div>}
        <div role="menu" aria-label="The agent may" {...popProps('mode', 'dm-pp-mode')}>
          <div className="dm-ph">The agent may</div>
          {modes.map(o => <button key={o.value} type="button" role="menuitemradio" aria-checked={o.value === md} className="dm-mi" onClick={pick(() => setMd(o.value))}><Icon name={o.icon ?? 'edit'} /><span>{o.label ?? o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span><Check /></button>)}
        </div>
      </div>
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with its versions, Open, Copy and Download.
- [Rich text editor](https://designme.dev/components/rich-text-editor.md): A minimal editor with an inline AI menu that streams a suggestion to accept or discard.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Voice orb](https://designme.dev/components/voice-orb.md): A hands-free voice chat, with an orb that shows who is talking.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Prompt library](https://designme.dev/components/prompt-library.md): Saved prompts with blanks to fill in before they go to the agent.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
