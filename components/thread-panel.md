# Thread panel

> Switch between agent threads and reply in place.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/thread-panel

## Install

```sh
npx designme add thread-panel          # HTML, CSS and JS, with the shared core
npx designme add thread-panel --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Thread panel keeps several conversations with an agent in one place, one tab per thread, with a reply field under the open thread. People switch between threads with the tabs and answer the agent without leaving the panel.

### When to use it

- When one person runs several tasks with the same agent and needs to jump between them.
- When a side panel next to the main work should hold the agent conversations.
- When each thread has a status you want to show at a glance, like done, waiting or idle.
- When agent replies should show the files or pages they drew on.

### What it does

- Each thread gets a tab with a coloured dot set by `color`, and an underline slides to the open tab.
- The open thread can be controlled with `value` and `onValueChange`, or left to the tabs with `defaultValue`.
- The reply field submits on Enter and calls `onSend` with the text and the open thread's id. The Send button stays disabled while the field is empty.
- A message with `thinking` shows a shimmering "Thinking" line while the agent works, and agent messages can carry `sources` as chips with tooltips.
- Switching threads staggers the messages in, and a new message scrolls smoothly into view.
- The draft can be controlled with `draft` and `onDraftChange`, and `bare={false}` gives the panel its own card.

### Accessibility

- The tabs use `role="tablist"` and `role="tab"` with `aria-selected` on the open thread.
- The message area is an `aria-live="polite"` region, so new replies are announced.
- The reply field is labelled "Reply" and the icon button is labelled "Send".

## Usage in React

```tsx
import { ThreadPanel } from '@/components/designme/thread-panel/ThreadPanel';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { ThreadPanel, type Thread } from './ThreadPanel';
import { useScript } from '../lib/useScript';

/* ---------- Thread panel: three threads; a reply is typed and sent by itself, gets a short Thinking, then an answer ---------- */
const THREADS: Thread[] = [
  { id: 'onboarding', title: 'Onboarding', color: 'var(--dm-ok)', messages: [
    { from: 'user', text: 'Why is the workspace step losing people?' },
    { from: 'agent', text: 'It asks for a team name before anyone has made anything. Moving it after the first project, with the name filled from the email domain, should help.',
      sources: [{ label: 'Funnel data', tip: 'Amplitude, last 30 days' }, { label: 'Session notes', tip: 'Notion, 8 interviews' }] }] },
  { id: 'tokens', title: 'Tokens', color: 'var(--dm-warn)', messages: [
    { from: 'user', text: 'Which colours are still hard-coded?' },
    { from: 'agent', text: 'Eleven, mostly greys in Button and Card. I can swap them for tokens in one pass.', sources: [{ label: 'tokens.ts', tip: 'src/styles/tokens.ts' }] }] },
  { id: 'launch', title: 'Launch email', color: 'var(--dm-faint)', messages: [
    { from: 'user', text: 'Draft the launch email for Friday.' },
    { from: 'agent', text: 'Two subject lines are ready. The shorter one tested better with the team.' }] }
];

export default function ThreadPanelDemo() {
  const [threads, setThreads] = useState(THREADS);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const add = (id: string, change: (t: Thread) => Thread) => setThreads(ts => ts.map(t => (t.id === id ? change(t) : t)));

  const send = (text: string, id: string) => {
    add(id, t => ({ ...t, messages: [...t.messages, { from: 'user', text }, { from: 'agent', text: '', thinking: true }] }));
    timers.current.push(setTimeout(() => add(id, t => ({
      ...t, messages: [...t.messages.filter(m => !m.thinking), { from: 'agent', text: "On it. I'll update this thread when it's done." }]
    })), 1400));
  };

  // once the card has settled, a reply is typed and sent in place, unless someone has started using it
  const [draft, setDraft] = useState('');
  const touched = useRef(false);
  useScript(async ({ wait }) => {
    await wait(1800);
    const reply = 'Can you make that change now?';
    for (let i = 1; i <= reply.length; i++) { if (touched.current) return; setDraft(reply.slice(0, i)); await wait(32 + Math.random() * 40); }
    await wait(380); if (touched.current) return;
    setDraft(''); send(reply, 'onboarding');
  });

  return (
    <div style={{ width: '100%' }} onPointerDownCapture={() => { touched.current = true; }} onFocusCapture={() => { touched.current = true; }}>
      <ThreadPanel threads={threads} onSend={send} draft={draft} onDraftChange={setDraft} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `threads` | `Thread[]` |  |
| `value` (optional) | `string` | The id of the open thread. Leave it out to let the tabs switch it |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(id: string) => void` |  |
| `onSend` (optional) | `(text: string, threadId: string) => void` | Called with the reply and the open thread's id. Add the message to that thread to show it |
| `draft` (optional) | `string` | The reply being written. Leave it out to let the field keep its own |
| `defaultDraft` (optional) | `string` |  |
| `onDraftChange` (optional) | `(text: string) => void` |  |
| `placeholder` (optional) | `string` |  |
| `bare` (optional) | `boolean` | Sits flat in a chat column (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Questions

**Does sending a reply add it to the thread automatically?**

No. `onSend` gives you the text and the thread id, and you add the message to that thread's `messages` to show it. The field clears itself after sending.

**How do I show that the agent is working on a reply?**

Add an agent message with `thinking: true`. It shows a shimmering "Thinking", or its `text` if you give one, until you replace it with the real reply.

**Can I open a specific thread from outside the panel?**

Yes. Pass the thread's id as `value` and update it from your own state. Use `onValueChange` to hear when someone clicks a tab.

## Source

`ThreadPanel.tsx`, as `npx designme add thread-panel --react` installs it:

```tsx
'use client';
import { useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, SourceChip, Tip, type Source } from '../lib/motion';
import '../designme.css';
import './thread-panel.css';

export interface ThreadMessage {
  /** Keeps the message in place when the list changes. Defaults to its position */
  id?: string;
  from: 'user' | 'agent';
  text: ReactNode;
  /** Files or pages the agent used, shown as chips above its reply */
  sources?: Source[];
  /** Shows a shimmering "Thinking" (or `text`, if given) while the agent works on a reply */
  thinking?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  /** The dot in front of the title, any CSS colour, like 'var(--dm-ok)'. Defaults to a quiet grey */
  color?: string;
  messages: ThreadMessage[];
}

export interface ThreadPanelProps {
  threads: Thread[];
  /** The id of the open thread. Leave it out to let the tabs switch it */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Called with the reply and the open thread's id. Add the message to that thread to show it */
  onSend?: (text: string, threadId: string) => void;
  /** The reply being written. Leave it out to let the field keep its own */
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (text: string) => void;
  placeholder?: string;
  /** Sits flat in a chat column (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

function Message({ m, delay }: { m: ThreadMessage; delay: number }) {
  const e = enter(delay);
  if (m.from === 'user') return <div className={cx('dm-bub', e.className)} style={e.style}>{m.text}</div>;
  if (m.thinking) return <div className={cx('dm-thp-ag', e.className)} style={e.style}><span className="dm-shim">{m.text || 'Thinking'}</span></div>;
  return (
    <div className={cx('dm-thp-ag', e.className)} style={e.style}>
      {!!m.sources?.length && (
        <div className="dm-src">
          {m.sources.map((s, i) => s.kind ? <SourceChip key={i} source={s} /> : (
            <Tip key={i} label={s.tip ?? s.label}>
              <button type="button" className="dm-fchip dm-lnk" onClick={s.onClick}><Icon name="file-text" size="xs" />{s.label}</button>
            </Tip>
          ))}
        </div>
      )}
      {m.text}
    </div>
  );
}

/** One thread's messages. It mounts again for each thread, so a switch staggers every message in, and later ones come in on their own */
function Body({ messages }: { messages: ThreadMessage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [first] = useState(messages.length);
  // the first messages are simply there; a later one glides into view
  useIsoLayoutEffect(() => { const el = ref.current; if (!el) return; if (messages.length > first) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); else el.scrollTop = el.scrollHeight; }, [messages.length]);
  return (
    <div ref={ref} className="dm-thp-body" aria-live="polite">
      {messages.map((m, i) => <Message key={(m.id ?? i) + (m.thinking ? '-t' : '')} m={m} delay={i < first ? i * 70 : 0} />)}
    </div>
  );
}

/** Several conversations with an agent, one tab each, with a reply field under the open one. */
export function ThreadPanel({ threads, value, defaultValue, onValueChange, onSend, draft: draftProp, defaultDraft = '', onDraftChange, placeholder = 'Reply to the agent', bare = true, className }: ThreadPanelProps) {
  const [cur, setCur] = useControllable(value, defaultValue ?? threads[0]?.id ?? '', onValueChange);
  const thread = threads.find(t => t.id === cur) ?? threads[0];
  const [draft, setDraft] = useControllable(draftProp, defaultDraft, onDraftChange);

  // the underline slides to the open tab, 10px in from each side
  const tabs = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState<CSSProperties>({});
  useIsoLayoutEffect(() => {
    const el = tabs.current; if (!el) return;
    const place = () => { const b = el.querySelector<HTMLElement>('[aria-selected="true"]'); if (b) setInk({ left: b.offsetLeft + 10, width: b.offsetWidth - 20 }); };
    place();
    document.fonts?.ready.then(place);
    const ro = new ResizeObserver(place); ro.observe(el);
    return () => ro.disconnect();
  }, [thread?.id, threads.length]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const v = draft.trim(); if (!v || !thread) return;
    setDraft(''); onSend?.(v, thread.id);
  };

  return (
    <div data-dm="" className={cx('dm-thp', !bare && 'dm-panel', className)}>
      <div ref={tabs} className="dm-thp-tabs" role="tablist">
        {threads.map(t => (
          <button type="button" key={t.id} className="dm-thp-tab" role="tab" aria-selected={t.id === thread?.id} onClick={() => setCur(t.id)}>
            <span className="dm-dot" style={{ color: t.color ?? 'var(--dm-faint)' }} />{t.title}
          </button>
        ))}
        <span className="dm-thp-ink" style={ink} />
      </div>
      {thread && <Body key={thread.id} messages={thread.messages} />}
      <form className="dm-thp-in" onSubmit={send}>
        <input className="dm-thp-field" aria-label="Reply" placeholder={placeholder} value={draft} onChange={e => setDraft(e.target.value)} />
        <Tip label="Send" kbd="↵">
          <button type="submit" className="dm-thp-send" aria-label="Send" disabled={!draft.trim()}><Icon name="up" /></button>
        </Tip>
      </form>
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
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
