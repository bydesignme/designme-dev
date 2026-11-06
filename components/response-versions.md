# Response versions

> Regenerate an answer and flip between versions.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/response-versions

## Install

```sh
npx designme add response-versions          # HTML, CSS and JS, with the shared core
npx designme add response-versions --react  # React 19 component and its CSS
npx designme add response-versions --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/response-versions.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/response-versions.json  # Astro
```

## About

Response versions shows an agent's answer with a small bar under it to page through earlier versions, regenerate it and copy it. Each regenerated answer is kept as a new version, so the person can compare it with the ones before and keep the one they like.

### When to use it

- When people regenerate answers and want to go back to an earlier one instead of losing it.
- When you want a new version to stream in where the old one was, with a counter like 2 / 3.
- When an answer sits in a chat thread and needs copy and regenerate controls right under it.

### What it does

- `versions` holds every version, oldest first. Previous and next arrows page through them with a counter between, and the current one can be controlled with `version` and `onVersionChange`.
- Switching versions fades the old text out, then the new one comes in word by word.
- While `streaming` is true, words fade in as they arrive, the arrows are disabled and regenerate does nothing.
- `onRegenerate` adds a Regenerate button that spins when pressed. You add the new version and show it.
- Copy puts the shown version on the clipboard, confirms with a check and calls `onCopy` with the text.
- `status` shows quiet text beside the buttons, like "Writing a new version", and shimmers while streaming. `prompt` adds the person's message as a bubble above, and `bare={false}` gives the answer its own card.

### Accessibility

- The answer text is an `aria-live="polite"` region.
- The arrows are labelled "Previous version" and "Next version", and Regenerate and Copy have `aria-label`s too.
- With `prefers-reduced-motion: reduce`, switching versions skips the fade-out delay.

## Usage in React

```tsx
import { ResponseVersions } from '@/components/designme/response-versions/ResponseVersions';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ResponseVersions } from './ResponseVersions';
import { useScript, useTakeover, type Script } from '../lib/useScript';

/* ---------- Response versions: the first answer streams in, then one regenerate plays by itself; the arrows page between them ---------- */
const POOL = [
  'Pricing that grows with your team. Start free, upgrade when the work gets serious.',
  'One plan per stage of your team. No seat math, no surprises on the invoice.',
  'Design faster with an agent on every plan. Pay for what you ship, not for seats.',
  'Simple pricing for teams who ship. Free to start, fair as you grow.'
];
export default function ResponseVersionsDemo() {
  const [versions, setVersions] = useState<string[]>(['']);
  const [version, setVersion] = useState(0);
  const [streaming, setStreaming] = useState(true);
  const [status, setStatus] = useState('');
  const script = useRef<Script>(null);

  // writes a version word by word, the way an answer streams in
  const stream = async ({ wait }: Script, at: number, text: string) => {
    await wait(260);
    let out = '';
    for (const w of text.split(' ')) { out += (out ? ' ' : '') + w; const now = out; setVersions(v => v.map((x, i) => i === at ? now : x)); await wait(45); }
  };
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref), count = useRef(1);
  useScript(async s => {
    script.current = s;
    await s.wait(300); await stream(s, 0, POOL[0]); setStreaming(false);
    // then one regenerate plays by itself, so the version count and arrows show what they do, unless you have taken over
    await s.wait(1900); if (!mine() && count.current === 1) await regenerate(true);
  });
  const regenerate = async (auto = false) => {
    const s = script.current; if (!s || (streaming && !auto)) return;
    const at = count.current++;
    setStreaming(true); setStatus('Writing a new version');
    setVersions(v => [...v, '']); setVersion(at);
    await stream(s, at, POOL[at % POOL.length]);
    setStreaming(false); setStatus('');
  };

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ResponseVersions prompt="Write a headline for the pricing page" versions={versions} version={version} onVersionChange={setVersion}
        streaming={streaming} status={status} onRegenerate={() => regenerate()} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `prompt` (optional) | `ReactNode` | The person's message the answer replies to, shown as a bubble above it |
| `versions` | `string[]` | Every version of the answer so far, oldest first |
| `version` (optional) | `number` | Which version is showing. Leave it out to let the arrows page through them |
| `defaultVersion` (optional) | `number` |  |
| `onVersionChange` (optional) | `(index: number) => void` |  |
| `streaming` (optional) | `boolean` | The version showing is still being written. New words fade in as they arrive and paging waits |
| `status` (optional) | `string` | Quiet text beside the buttons, like "Writing a new version". It shimmers while streaming |
| `onRegenerate` (optional) | `() => void` | Called by the regenerate button. Add a version and show it to answer it |
| `onCopy` (optional) | `(text: string) => void` | Called with the text after it is copied to the clipboard |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ResponseVersions from '../components/designme/response-versions/ResponseVersions.astro';
---
<ResponseVersions />
<ResponseVersions data-style="soft" class="my-class" />
```
It plays its demo; change `response-versions.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I stream a regenerated answer into a new version?**

In `onRegenerate`, append an empty string to `versions`, set `version` to its index and `streaming` to true, then update that string as tokens arrive. Set `streaming` back to false when it is done.

**Why are the arrows greyed out?**

They are disabled while `streaming` is true, and at the first or last version. That keeps people from paging away from an answer that is still being written.

**Can the answer contain formatting like lists or code?**

No. Each version is a plain string, split into words for the fade-in, so markup is shown as text.

## Source

`ResponseVersions.tsx`, as `npx designme add response-versions --react` installs it:

```tsx
'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useCopied, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
import './response-versions.css';

export interface ResponseVersionsProps {
  /** The person's message the answer replies to, shown as a bubble above it */
  prompt?: ReactNode;
  /** Every version of the answer so far, oldest first */
  versions: string[];
  /** Which version is showing. Leave it out to let the arrows page through them */
  version?: number;
  defaultVersion?: number;
  onVersionChange?: (index: number) => void;
  /** The version showing is still being written. New words fade in as they arrive and paging waits */
  streaming?: boolean;
  /** Quiet text beside the buttons, like "Writing a new version". It shimmers while streaming */
  status?: string;
  /** Called by the regenerate button. Add a version and show it to answer it */
  onRegenerate?: () => void;
  /** Called with the text after it is copied to the clipboard */
  onCopy?: (text: string) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

/** An answer with its earlier versions a click away, plus regenerate and copy. */
export function ResponseVersions({ prompt, versions, version, defaultVersion = 0, onVersionChange, streaming = false, status = '', onRegenerate, onCopy, bare = true, className }: ResponseVersionsProps) {
  const [cur, setCur] = useControllable(version, defaultVersion, onVersionChange);
  const reduce = useReducedMotion();
  const last = Math.max(0, versions.length - 1), at = Math.min(Math.max(cur, 0), last);

  // a different version fades the old text out first; then a finished one comes in all at once, word by word,
  // and one still being written shows its words as they arrive
  const [shown, setShown] = useState(at);
  const [out, setOut] = useState(false);
  const [jump, setJump] = useState(false);
  useEffect(() => {
    if (at === shown) return;
    setOut(true);
    const t = setTimeout(() => { setShown(at); setJump(!streaming); setOut(false); }, reduce ? 0 : 240);
    return () => clearTimeout(t);
  }, [at, shown, streaming, reduce]);
  const text = versions[shown] ?? '';
  const words = text.split(' ').filter(Boolean);

  const [spin, setSpin] = useState(false);
  const regenerate = () => {
    if (streaming) return;
    setSpin(true); setTimeout(() => setSpin(false), 700);
    onRegenerate?.();
  };
  const [copied, copyText] = useCopied();
  const copy = () => { const t = versions[at] ?? ''; copyText(t); onCopy?.(t); };

  return (
    <div data-dm="" className={cx('dm-rvx', !bare && 'dm-panel', className)} style={bare ? undefined : { padding: 16 }}>
      {prompt && <div className="dm-bub">{prompt}</div>}
      <div className="dm-rvx-a">
        <p className={cx('dm-msg dm-rvx-t', out && 'dm-out')} aria-live="polite">
          {words.map((w, k) => <span key={shown + ':' + k} className="dm-w" style={jump ? { animationDelay: k * 12 + 'ms' } : undefined}>{w} </span>)}
        </p>
        <div className="dm-rvx-bar">
          <div className="dm-rvx-pg">
            <Tip label="Previous"><button type="button" className="dm-ib" aria-label="Previous version" disabled={at === 0 || streaming} onClick={() => setCur(at - 1)}><Icon name="chev-l" /></button></Tip>
            <span className="dm-rvx-n dm-num">{at + 1} / {Math.max(versions.length, 1)}</span>
            <Tip label="Next"><button type="button" className="dm-ib" aria-label="Next version" disabled={at === last || streaming} onClick={() => setCur(at + 1)}><Icon name="chev-r" /></button></Tip>
          </div>
          {onRegenerate && <Tip label="Regenerate" kbd="⌘R"><button type="button" className={cx('dm-ib dm-rvx-re', spin && 'dm-go')} aria-label="Regenerate" onClick={regenerate}><Icon name="refresh" /></button></Tip>}
          <Tip label={copied ? 'Copied to clipboard' : 'Copy'} open={copied || undefined}><button type="button" className={cx('dm-ib', copied && 'dm-copied')} aria-label="Copy" onClick={copy}><Icon name={copied ? 'check' : 'copy'} /></button></Tip>
          <Swap className={cx('dm-rvx-st dm-muted', streaming && status && 'dm-shim')}>{status}</Swap>
        </div>
      </div>
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with its versions, Open, Copy and Download.
- [Image generation](https://designme.dev/components/image-generation.md): A prompt with styles, shape and count, pictures that resolve out of grain, and a gallery of earlier ones.
- [Rich text editor](https://designme.dev/components/rich-text-editor.md): A minimal editor with an inline AI menu that streams a suggestion to accept or discard.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Voice orb](https://designme.dev/components/voice-orb.md): A hands-free voice chat, with an orb that shows who is talking.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Prompt library](https://designme.dev/components/prompt-library.md): Saved prompts with blanks to fill in before they go to the agent.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
