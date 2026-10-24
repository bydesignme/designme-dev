# Tool call

> Each tool the agent calls, with its input and output.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/tool-call

## Install

```sh
npx designme add tool-call          # HTML, CSS and JS, with the shared core
npx designme add tool-call --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Tool call lists the tools an agent calls while it works, placed between its opening message and its answer. Each call shows its name and status, and opens to show the JSON the agent sent and the JSON that came back.

### When to use it

- When your agent uses tools or MCP servers and people want to see what it actually ran.
- When you need to debug a wrong answer by checking the input and output of each call.
- When several calls run one after another and the answer should only appear once they have all finished.

### What it does

- Each call has a `state`: queued waits, running shows a spinner and "Running", and done shows a check with the `duration`.
- The call's name is shown with its `server` or namespace in front, like billing.list_plan_changes, plus an optional `icon`.
- Clicking a call folds open its Input and Output, printed as JSON with keys, strings and numbers in their own colours. Output reads "Waiting…" until the call is done.
- Which calls are open can be left to the calls themselves or controlled with `open`, `defaultOpen` and `onOpenChange`.
- `reply` is laid out from the start and fades in a frame after every call is done, so nothing below it jumps.

### Accessibility

- Each call's header is a button with `aria-expanded` showing whether its input and output are open.
- Closed input and output panels are `inert` and `aria-hidden`, and the reply stays `aria-hidden` until every call is done.
- The spinner and status icons are decorative and hidden from screen readers.

## Usage in React

```tsx
import { ToolCall } from '@/components/designme/tool-call/ToolCall';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { ToolCall, type ToolCallItem } from './ToolCall';
import { useScript } from '../lib/useScript';

/* ---------- Tool call: two calls run one after the other, then the answer comes in and the first call opens ---------- */
const CALLS: ToolCallItem[] = [
  { key: 'plans', icon: 'db', server: 'billing', name: 'list_plan_changes', state: 'queued', duration: '412 ms',
    input: { since: '2026-10-01' }, output: [{ plan: 'Pro', price: 24 }, { plan: 'Team', price: 48 }] },
  { key: 'edit', icon: 'edit', server: 'files', name: 'edit', state: 'queued', duration: '1.2 s',
    input: { path: 'Pricing.tsx', lines: 6 }, output: { changed: 6, saved: true } }
];
export default function ToolCallDemo() {
  const [calls, setCalls] = useState(CALLS);
  const [open, setOpen] = useState<string[]>([]);
  useScript(async ({ wait }) => {
    await wait(600);
    for (const k of CALLS.map(c => c.key)) {
      setCalls(cs => cs.map(c => c.key === k ? { ...c, state: 'running' } : c)); await wait(1300);
      setCalls(cs => cs.map(c => c.key === k ? { ...c, state: 'done' } : c));
    }
    setOpen(o => o.includes('plans') ? o.filter(k => k !== 'plans') : [...o, 'plans']);
  });
  return (
    <div style={{ width: '100%' }}>
      <ToolCall calls={calls} open={open} onOpenChange={setOpen}
        message="Checking which plans changed this month before I update the pricing page."
        reply="Two plans changed. I updated their prices and the yearly saving on the page." />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `message` (optional) | `ReactNode` | The agent's message before the calls |
| `calls` | `ToolCallItem[]` |  |
| `reply` (optional) | `ReactNode` | The agent's answer after the calls. It fades in once every call is done |
| `open` (optional) | `string[]` | Keys of the calls that are open. Leave it out to let each call toggle itself |
| `defaultOpen` (optional) | `string[]` |  |
| `onOpenChange` (optional) | `(open: string[]) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I update a call while it runs?**

Keep `calls` in your state and change each call's `state` from 'queued' to 'running' to 'done' as your agent reports progress. Add `output` and `duration` when it finishes.

**What can I pass as input and output?**

Any JSON value: strings, numbers, booleans, null, arrays and objects. Objects print on one line and each array item gets its own line.

**Can I open a call automatically when it finishes?**

Yes. Control `open` from your own state and add the call's `key` when you mark it done, as the example does with the first call.

## Source

`ToolCall.tsx`, as `npx designme add tool-call --react` installs it:

```tsx
'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Fold, Swap } from '../lib/motion';
import '../designme.css';
import './tool-call.css';

/** Any value a tool takes or returns */
export type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

export interface ToolCallItem {
  key: string;
  /** The tool's server or namespace, like "billing" */
  server?: string;
  /** The tool's name, like "list_plan_changes" */
  name: string;
  /** The icon in front of the call */
  icon?: IconName;
  /** queued waits, running spins, done shows the time it took and the output */
  state: 'queued' | 'running' | 'done';
  /** How long it took, like "412 ms". Shown once it is done */
  duration?: string;
  /** What the agent sent, shown as highlighted JSON */
  input?: Json;
  /** What came back, shown once it is done */
  output?: Json;
}

export interface ToolCallProps {
  /** The agent's message before the calls */
  message?: ReactNode;
  calls: ToolCallItem[];
  /** The agent's answer after the calls. It fades in once every call is done */
  reply?: ReactNode;
  /** Keys of the calls that are open. Leave it out to let each call toggle itself */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (open: string[]) => void;
  className?: string;
}

/** JSON on one line per object, each array item on its own line, keys, strings and numbers in their own colours */
function JsonView({ value, depth = 0 }: { value: Json; depth?: number }): ReactNode {
  if (typeof value === 'string') return <span className="dm-s">"{value}"</span>;
  if (typeof value === 'number') return <span className="dm-n">{value}</span>;
  if (value === null || typeof value === 'boolean') return <span className="dm-k">{String(value)}</span>;
  if (Array.isArray(value)) {
    if (!value.length) return '[]';
    const pad = '\n' + '  '.repeat(depth + 1);
    return <>[ {value.map((v, i) => <span key={i}>{i ? ',' + pad : ''}<JsonView value={v} depth={depth + 1} /></span>)} ]</>;
  }
  const keys = Object.keys(value);
  if (!keys.length) return '{}';
  return <>{'{ '}{keys.map((k, i) => <span key={k}>{i ? ', ' : ''}<span className="dm-k">"{k}"</span>: <JsonView value={value[k]} depth={depth} /></span>)}{' }'}</>;
}

function Call({ call, open, onToggle, index }: { call: ToolCallItem; open: boolean; onToggle: () => void; index: number }) {
  const { state } = call;
  return (
    <div className={cx('dm-tcx-c dm-enter', open && 'dm-open')} style={enter(200 + index * 90).style}>
      <button type="button" className="dm-tcx-h" aria-expanded={open} onClick={onToggle}>
        <span className="dm-tcx-ic">{state === 'running' ? <span className="dm-radar" style={{ color: 'var(--dm-fg)' }} /> : <Icon name={call.icon ?? 'code'} size="xs" />}</span>
        <span className="dm-tcx-n">{call.server && <span>{call.server}.</span>}<b>{call.name}</b></span>
        <span className="dm-tcx-ms">
          <Swap>{state === 'done' ? call.duration ?? 'Done' : state === 'running' ? 'Running' : 'Queued'}</Swap>
          <span>{state === 'running'
            ? <span className="dm-spin" style={{ width: 10, height: 10 }} />
            : state === 'done' ? <span style={{ color: 'var(--dm-ok)' }}><Icon name="check" size="xs" /></span> : null}</span>
        </span>
        <Icon name="chev-d" size="xs" className="dm-tcx-chev" />
      </button>
      <Fold open={open}>
        <div className="dm-tcx-io">
          <div><div className="dm-tcx-l">Input</div><pre>{call.input === undefined ? '' : <JsonView value={call.input} />}</pre></div>
          <div><div className="dm-tcx-l">Output</div><pre>{state === 'done' && call.output !== undefined ? <JsonView value={call.output} /> : 'Waiting…'}</pre></div>
        </div>
      </Fold>
    </div>
  );
}

/** The tools an agent calls, with what went in and what came back, between its message and its answer. */
export function ToolCall({ message, calls, reply, open, defaultOpen = [], onOpenChange, className }: ToolCallProps) {
  const [openKeys, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const done = calls.length > 0 && calls.every(c => c.state === 'done');
  // the answer is laid out from the start and fades in a frame after the last call finishes
  const [shown, setShown] = useState(false);
  useEffect(() => {
    if (!done) { setShown(false); return; }
    const raf = requestAnimationFrame(() => setShown(true));
    return () => cancelAnimationFrame(raf);
  }, [done]);
  const toggle = (key: string) => setOpen(openKeys.includes(key) ? openKeys.filter(k => k !== key) : [...openKeys, key]);

  return (
    <div data-dm="" className={cx('dm-tcx', className)}>
      {message && <p className="dm-msg">{message}</p>}
      <div className="dm-tcx-calls">
        {calls.map((c, i) => <Call key={c.key} call={c} index={i} open={openKeys.includes(c.key)} onToggle={() => toggle(c.key)} />)}
      </div>
      {reply && <p className={cx('dm-msg dm-tcx-end', shown && 'dm-in')} aria-hidden={!shown}>{reply}</p>}
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with its versions, Open, Copy and Download.
- [Rich text editor](https://designme.dev/components/rich-text-editor.md): A minimal editor with an inline AI menu that streams a suggestion to accept or discard.
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
