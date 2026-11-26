# Answer action bar

> Copy, regenerate, rate and listen to an answer from one row under it.

Components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/answer-action-bar

## Install

```sh
npx designme add answer-action-bar          # HTML, CSS and JS, with the shared core
npx designme add answer-action-bar --react  # React 19 component and its CSS
npx designme add answer-action-bar --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/answer-action-bar.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/answer-action-bar.json  # Astro
```

## About

Answer action bar is the row of actions under an agent's answer: copy, regenerate with a pager through the versions, thumbs up or down, and read aloud. A thumbs down asks why with a few reasons, a new version highlights what changed, and reading lights each word as it goes.

### When to use it

- Under every answer in a chat, when people need to copy, retry, rate or listen to it without leaving the thread.
- When a regenerated answer should keep the earlier versions a click away, with what changed easy to spot.
- When a thumbs down should capture a reason the agent can act on, not just a count.
- When people listen to answers, and you want them to see where the voice is and pause on a word.

### What it does

- Copy writes the answer's plain text to the clipboard, and its icon turns into a check with a "Copied to clipboard" tooltip for about 1.6 seconds.
- Regenerate calls `onRegenerate` and spins. With a second version, a pager slides in with previous and next and a count like "2 / 2". While `streaming`, new words fade in, and paging and reading wait.
- A version's `changed` phrase is highlighted in green, so a new version shows what it fixed. Its `meta` sits after the bar, like "Sonnet 5.5 · 4.8s", and shortens rather than wrapping while reading aloud widens the bar; on a phone it takes the line under the bar.
- Thumbs up and down are toggles, one rating per version. A thumbs down opens "What was off?" with `reasons`, which default to Wrong numbers, Too long, Not our tone and Missed the brief. Picking one calls `onReason` and closes it. In Clean a rated thumb fills in, without a colour.
- Read aloud widens into a progress bar and a clock, like "0:04 / 0:07", and lights each word in turn (in grey in Clean), 0.28 seconds a word by default. Pressing it again pauses and keeps the place; it doesn't speak, so connect your own text to speech through `reading` and `onReadingChange`.
- `status` adds a quiet line under the bar. `statusTone` turns it amber for a problem like a dropped connection, or gives it a green check once something worked. The line takes room only while it says something, and the answer only the room its words need.

### Accessibility

- The buttons sit in a toolbar labelled "Answer actions", and each has its own label, like "Copy" or "Previous version". Left and Right move between them, skipping any that are switched off.
- The thumbs use `aria-pressed`, and so does read aloud while it plays. Its label changes between Read aloud, Pause reading and Resume reading.
- The answer, the version count and the status line are live regions, so a new version or a retry is announced.
- The reasons after a thumbs down are plain buttons in the tab order.

## Usage in React

```tsx
import { AnswerActionBar } from '@/components/designme/answer-action-bar/AnswerActionBar';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { AnswerActionBar, type AnswerVersion } from './AnswerActionBar';
import { useScript, useStory, useWait } from '../lib/useScript';

/* ---------- Answer action bar: listen, hear a wrong number, rate it down, say why, ride out a dropped connection, copy the fix ---------- */
// the versions a regenerate writes, in turn; $24 to $19 a month saves 21%, so the first one is wrong
const POOL: AnswerVersion[] = [
  { text: 'Pro is $24 a month, or $19 a month when billed yearly. That saves 15%, and yearly is the option the new pricing page shows first.', meta: 'Sonnet 5.5 · 6.2s' },
  { text: 'Pro is $24 a month, or $19 a month billed yearly, which saves 21%, or $60 a year. The new pricing page shows the yearly price first.', changed: '21%, or $60 a year.', meta: 'Sonnet 5.5 · 4.8s' },
  { text: 'Billed yearly, Pro drops from $24 to $19 a month: $60 back each year, about 21%. That is why the pricing page leads with yearly.', changed: '$60 back each year,', meta: 'Sonnet 5.5 · 5.1s' }
];

export default function AnswerActionBarDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [versions, setVersions] = useState<AnswerVersion[]>([{ ...POOL[0], text: '' }]);
  const [version, setVersion] = useState(0);
  const [streaming, setStreaming] = useState(true);
  const [status, setStatus] = useState('');
  const [tone, setTone] = useState<'warn' | 'ok'>();
  const failed = useRef(false);

  // a version streams in word by word
  const stream = async (i: number, v: AnswerVersion) => {
    setStreaming(true);
    const ws = v.text.split(' ');
    for (let k = 1; k <= ws.length; k++) { setVersions(vs => vs.map((x, j) => j === i ? { ...v, text: ws.slice(0, k).join(' ') } : x)); await wait(38); }
    setStreaming(false);
  };
  useScript(async ({ wait: w }) => { await w(300); await stream(0, POOL[0]); });

  // regenerate writes the next version; the first time after a thumbs down the connection drops once and is retried
  const regenerate = async (note?: string) => {
    if (streaming) return;
    const label = 'Writing a new version' + (note ? ' with your note' : '');
    setTone(undefined); setStatus(label); setStreaming(true);
    if (note && !failed.current) {
      failed.current = true; await wait(1200);
      for (let k = 2; k > 0; k--) { setTone('warn'); setStatus(`Couldn't reach the model. Retrying in ${k}s`); await wait(1000); }
      setTone(undefined); setStatus(label);
    }
    const i = versions.length, v = POOL[Math.min(i, POOL.length - 1)];
    setVersions(vs => [...vs, { ...v, text: '' }]); setVersion(i);
    await stream(i, v);
    // what the new version fixed, when it answers a reason; the pager already counts the versions
    if (note) { setTone('ok'); setStatus('Fixes the saving: 21%, not 15%'); } else { setTone(undefined); setStatus(''); }
  };

  // the preview's story: listen until the wrong number, pause, rate it down, pick why, then copy the fix
  useStory(ref, async ({ wait, press }) => {
    await wait(2900); press('.dm-aab-rd');
    await wait(4100); press('.dm-aab-rd');
    await wait(500); press('.dm-aab-dn');
    await wait(1500); press('.dm-aab-ch .dm-chip');
    await wait(400 + 1200 + 2000 + 1200 + 1500); press('.dm-aab-cp');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AnswerActionBar question="How much do people save on the yearly Pro plan?" versions={versions} version={version} onVersionChange={setVersion}
        streaming={streaming} status={status} statusTone={tone} onRegenerate={() => void regenerate()}
        onReason={(_, reason) => { setTimeout(() => void regenerate(reason), 400); }}
 />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `question` (optional) | `ReactNode` | The person's message the answer replies to, shown as a bubble above it |
| `versions` | `AnswerVersion[]` | Every version of the answer so far, oldest first |
| `version` (optional) | `number` | Which version is showing. Leave it out to let the arrows page through them |
| `defaultVersion` (optional) | `number` |  |
| `onVersionChange` (optional) | `(index: number) => void` |  |
| `streaming` (optional) | `boolean` | The newest version is still being written: new words fade in as they arrive, and paging and reading wait |
| `onRegenerate` (optional) | `() => void` | Called by the regenerate button. Add a version and show it to answer it |
| `onCopy` (optional) | `(text: string) => void` | Called with the plain text after it is copied |
| `onRate` (optional) | `(index: number, rating: AnswerBarRating) => void` | Called when a thumb is pressed or pressed again to clear it |
| `reasons` (optional) | `string[]` | The reasons a thumbs down offers. Defaults to Wrong numbers, Too long, Not our tone and Missed the brief |
| `onReason` (optional) | `(index: number, reason: string) => void` | Called with the reason picked after a thumbs down |
| `status` (optional) | `string` | The quiet line under the bar, like "Writing a new version". It shimmers while streaming |
| `statusTone` (optional) | `'warn' \| 'ok'` | warn turns the status amber; ok gives it a green check |
| `reading` (optional) | `ReadingState` | Read aloud: playing lights each word in turn, paused keeps the place. Leave it out to let the button play and pause |
| `defaultReading` (optional) | `ReadingState` |  |
| `onReadingChange` (optional) | `(state: ReadingState) => void` |  |
| `secondsPerWord` (optional) | `number` | How long the built-in reading clock gives each word. Defaults to 0.28s |
| `bare` (optional) | `boolean` | Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import AnswerActionBar from '../components/designme/answer-action-bar/AnswerActionBar.astro';
---
<AnswerActionBar />
<AnswerActionBar data-style="soft" class="my-class" />
```
It plays its demo; change `answer-action-bar.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does read aloud speak the answer?**

No. It runs a clock that lights each word in turn and shows the progress. Drive `reading` from your own text to speech, and set `secondsPerWord` to match its pace.

**How do I show what a new version changed?**

Pass the changed phrase as the version's `changed`. It must appear in the text exactly as written, and the words it covers are highlighted.

**Where do the ratings go?**

`onRate` is called with the version's index and `'up'`, `'down'` or `null` when a thumb is pressed again. Pass `rating` on each version to control them, or leave it out and the bar keeps one rating per version itself.

**Can I hide regenerate?**

Yes. Leave out `onRegenerate` and the button isn't shown. The pager still appears whenever there are two or more versions.

## Source

`AnswerActionBar.tsx`, as `npx designme add answer-action-bar --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useCopied, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, growFit, mxIn, mxT, Swap, SwapIcon, Tip } from '../lib/motion';
import '../designme.css';
import './answer-action-bar.css';

export type AnswerBarRating = 'up' | 'down' | null;
export type ReadingState = 'idle' | 'playing' | 'paused';

/** One version of the answer */
export interface AnswerVersion {
  text: string;
  /** A phrase in the text that changed from the version before, like "21%, or $60 a year". It's highlighted */
  changed?: string;
  /** Quiet text after the bar, like "Sonnet 5.5 · 6.2s" */
  meta?: string;
  /** Its rating. Leave it out to let the thumbs hold their own, one per version */
  rating?: AnswerBarRating;
}

export interface AnswerActionBarProps {
  /** The person's message the answer replies to, shown as a bubble above it */
  question?: ReactNode;
  /** Every version of the answer so far, oldest first */
  versions: AnswerVersion[];
  /** Which version is showing. Leave it out to let the arrows page through them */
  version?: number;
  defaultVersion?: number;
  onVersionChange?: (index: number) => void;
  /** The newest version is still being written: new words fade in as they arrive, and paging and reading wait */
  streaming?: boolean;
  /** Called by the regenerate button. Add a version and show it to answer it */
  onRegenerate?: () => void;
  /** Called with the plain text after it is copied */
  onCopy?: (text: string) => void;
  /** Called when a thumb is pressed or pressed again to clear it */
  onRate?: (index: number, rating: AnswerBarRating) => void;
  /** The reasons a thumbs down offers. Defaults to Wrong numbers, Too long, Not our tone and Missed the brief */
  reasons?: string[];
  /** Called with the reason picked after a thumbs down */
  onReason?: (index: number, reason: string) => void;
  /** The quiet line under the bar, like "Writing a new version". It shimmers while streaming */
  status?: string;
  /** warn turns the status amber; ok gives it a green check */
  statusTone?: 'warn' | 'ok';
  /** Read aloud: playing lights each word in turn, paused keeps the place. Leave it out to let the button play and pause */
  reading?: ReadingState;
  defaultReading?: ReadingState;
  onReadingChange?: (state: ReadingState) => void;
  /** How long the built-in reading clock gives each word. Defaults to 0.28s */
  secondsPerWord?: number;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const REASONS = ['Wrong numbers', 'Too long', 'Not our tone', 'Missed the brief'];
const clock = (s: number) => Math.floor(s / 60) + ':' + String(Math.floor(s) % 60).padStart(2, '0');

/** Every action on an answer in one row under it: copy, regenerate with versions, thumbs with a reason, and read aloud. */
export function AnswerActionBar({
  question, versions, version, defaultVersion = 0, onVersionChange, streaming = false, onRegenerate, onCopy, onRate, reasons = REASONS, onReason,
  status = '', statusTone, reading, defaultReading = 'idle', onReadingChange, secondsPerWord = .28, bare = true, className
}: AnswerActionBarProps) {
  const [cur, setCur] = useControllable(version, defaultVersion, onVersionChange);
  const [read, setRead] = useControllable(reading, defaultReading, onReadingChange);
  const reduce = useReducedMotion();
  const last = Math.max(0, versions.length - 1), at = Math.min(Math.max(cur, 0), last), v = versions[at];
  const [own, setOwn] = useState<Record<number, AnswerBarRating>>({});
  const rating = v?.rating !== undefined ? v.rating : own[at] ?? null;
  const [asked, setAsked] = useState<Record<number, string>>({});
  const [copied, copyText] = useCopied();
  const [spin, setSpin] = useState(false);
  // the status's tone changes with its words (Swap writes them 170ms on), so the words fading out keep their colour
  const [tone, setTone] = useState(statusTone);
  const said = useRef(status);
  useEffect(() => {
    const was = said.current; said.current = status;
    if (reduce || statusTone === 'ok' || !was.trim() || was === status) { setTone(statusTone); return; }
    const t = setTimeout(() => setTone(statusTone), 170);
    return () => clearTimeout(t);
  }, [status, statusTone, reduce]);
  const shownTone = statusTone === 'ok' ? 'ok' : tone;
  // the status line opens and closes on its own height at the moment the reasons fold does, so the card moves once (owner,
  // 26 Nov): a line that empties eases shut with its words still in it, then lets them go; an empty line takes its words at
  // once (they rise in) rather than after Swap's fade
  const stRef = useRef<HTMLParagraphElement>(null);
  const [kept, setKept] = useState(status);
  useEffect(() => {
    if (status) { setKept(status); return; }
    const t = setTimeout(() => setKept(''), reduce || !stRef.current ? 0 : mxT(stRef.current, 't', 450));
    return () => clearTimeout(t);
  }, [status, reduce]);
  const line = status || kept;
  const fresh = useRef(0), was = useRef(line);
  if (was.current !== line) { if (!was.current.trim() && line.trim()) fresh.current++; was.current = line; }
  useIsoLayoutEffect(() => { if (fresh.current && stRef.current) mxIn([stRef.current]); }, [fresh.current]);

  // the words, with the changed phrase marked
  const text = v?.text ?? '';
  const from = v?.changed ? text.indexOf(v.changed) : -1, to = from < 0 ? -1 : from + (v?.changed?.length ?? 0);
  let p = 0;
  const words = text.split(' ').filter(Boolean).map(w => { const a = text.indexOf(w, p); p = a + w.length; return { w, nw: from >= 0 && a < to && a + w.length > from }; });

  // reading: a place in words, lit one word at a time
  const [pos, setPos] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval>>(undefined);
  useEffect(() => { setPos(0); if (read !== 'idle') setRead('idle'); }, [at]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (read !== 'playing') return;
    timer.current = setInterval(() => setPos(x => x + .1 / secondsPerWord), 100);
    return () => clearInterval(timer.current);
  }, [read, secondsPerWord]);
  useEffect(() => { if (read === 'playing' && pos >= words.length) { setRead('idle'); setPos(0); } }, [pos, read, words.length]); // eslint-disable-line react-hooks/exhaustive-deps
  const lit = read === 'idle' ? -1 : Math.min(words.length - 1, Math.floor(pos));

  const rate = (r: AnswerBarRating) => { const next = rating === r ? null : r; setOwn(o => ({ ...o, [at]: next })); onRate?.(at, next); if (next !== 'down') setAsked(a => ({ ...a, [at]: '' })); };
  const regenerate = () => { if (streaming) return; setRead('idle'); setPos(0); setSpin(true); setTimeout(() => setSpin(false), 700); onRegenerate?.(); };
  const copy = () => { copyText(text); onCopy?.(text); };
  const why = rating === 'down' && !asked[at];
  // as the reasons open, the question and its chips rise in one after another (motion pieces)
  const wy = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => { const el = wy.current; if (why && el) mxIn([el.querySelector('.dm-aab-wq'), ...el.querySelectorAll('.dm-chip')], { base: 60 }); }, [why]);
  // the container grows with what it holds, eased (grow() on the site), and stays centred wherever it is centred, in every
  // style (owner, 18 Nov)
  const root = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => { const el = root.current, w = inner.current; if (el && w) return growFit(el, w); }, []);
  // while a new version streams in, the answer keeps the height of the one it replaces, then eases to its own
  const tRef = useRef<HTMLParagraphElement>(null), prevT = useRef({ at: -1, h: 0 });
  useIsoLayoutEffect(() => {
    const el = tRef.current; if (!el) return;
    if (prevT.current.at !== -1 && prevT.current.at !== at && prevT.current.h && streaming) el.style.minHeight = prevT.current.h + 'px';
    prevT.current = { at: at, h: el.style.minHeight ? prevT.current.h : (el.textContent?.trim() ? el.offsetHeight : 0) };
  });
  useEffect(() => {
    const el = tRef.current; if (!el || streaming || !el.style.minHeight) return;
    const was = el.offsetHeight; el.style.minHeight = ''; const h = el.offsetHeight;
    if (h >= was || reduce) return;
    el.style.minHeight = was + 'px'; void el.offsetHeight; el.style.transition = 'min-height var(--dm-t) var(--dm-ease)'; el.style.minHeight = h + 'px';
    const t = setTimeout(() => { el.style.transition = ''; el.style.minHeight = ''; }, 460);
    return () => clearTimeout(t);
  }, [streaming, at, reduce]);

  return (
    <div data-dm="" ref={root} className={cx('dm-aab', !bare && 'dm-panel', 'dm-growing dm-mx-grow', className)} style={bare ? undefined : { padding: 16 }}>
      <div ref={inner} className="dm-grow">
      {question && <div className="dm-bub">{question}</div>}
      <p ref={tRef} className="dm-msg dm-aab-t" aria-live="polite">
        {words.map(({ w, nw }, k) => (
          // inside the changed phrase the space is highlighted too, so the phrase reads as one
          <span key={at + ':' + k}>{k ? <span className={nw && words[k - 1].nw ? 'dm-nw' : undefined}> </span> : null}<span className={cx('dm-w dm-in', nw && 'dm-nw', k === lit && 'dm-rd')} style={!streaming && !reduce ? { animationDelay: k * 10 + 'ms' } : undefined}>{w}</span></span>
        ))}
      </p>
      <div className="dm-aab-row">
        <div className="dm-aab-bar dm-mx-ic" role="toolbar" aria-label="Answer actions" onKeyDown={e => {
          // Left and Right move between the toolbar's buttons, skipping any that are switched off
          const k = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key]; if (!k) return;
          const bs = [...e.currentTarget.querySelectorAll('button')].filter(b => !b.disabled && !b.closest('[inert]')), i = bs.indexOf(document.activeElement as HTMLButtonElement);
          if (i < 0) return; e.preventDefault(); bs[(i + k + bs.length) % bs.length].focus();
        }}>
          <Tip label={copied ? 'Copied to clipboard' : 'Copy'} open={copied || undefined}><button type="button" className={cx('dm-ib dm-aab-cp dm-mx-press', copied && 'dm-copied')} aria-label="Copy" onClick={copy}><SwapIcon id={copied ? 'check' : 'copy'}><Icon name={copied ? 'check' : 'copy'} /></SwapIcon></button></Tip>
          {onRegenerate && <Tip label="Regenerate"><button type="button" className={cx('dm-ib dm-aab-re dm-mx-press', spin && 'dm-go')} aria-label="Regenerate" disabled={streaming} onClick={regenerate}><Icon name="refresh" /></button></Tip>}
          <span className={cx('dm-aab-pg', versions.length > 1 && 'dm-on')} inert={versions.length < 2}>
            <Tip label="Previous version"><button type="button" className="dm-ib dm-mx-press" aria-label="Previous version" disabled={at === 0 || streaming} onClick={() => setCur(at - 1)}><Icon name="chev-l" size="xs" /></button></Tip>
            <span className="dm-aab-n dm-num" aria-live="polite">{at + 1} / {Math.max(versions.length, 1)}</span>
            <Tip label="Next version"><button type="button" className="dm-ib dm-mx-press" aria-label="Next version" disabled={at === last || streaming} onClick={() => setCur(at + 1)}><Icon name="chev-r" size="xs" /></button></Tip>
          </span>
          <span className="dm-aab-sep" aria-hidden="true" />
          <Tip label="Good answer"><button type="button" className="dm-ib dm-aab-up dm-mx-press" aria-label="Good answer" aria-pressed={rating === 'up'} onClick={() => rate('up')}><Icon name="up-thumb" /></button></Tip>
          <Tip label="Bad answer"><button type="button" className="dm-ib dm-aab-dn dm-mx-press" aria-label="Bad answer" aria-pressed={rating === 'down'} onClick={() => rate('down')}><Icon name="down-thumb" /></button></Tip>
          <span className="dm-aab-sep" aria-hidden="true" />
          <Tip label={read === 'playing' ? 'Pause' : read === 'paused' ? 'Resume' : 'Read aloud'}>
            <button type="button" className={cx('dm-aab-rd dm-mx-press', read !== 'idle' && 'dm-on', read === 'paused' && 'dm-paused')} aria-pressed={read === 'playing'}
              aria-label={read === 'playing' ? 'Pause reading' : read === 'paused' ? 'Resume reading' : 'Read aloud'} disabled={streaming || !words.length}
              onClick={() => setRead(read === 'playing' ? 'paused' : 'playing')}>
              <span className="dm-ic"><SwapIcon id={read}><Icon name={read === 'playing' ? 'pause' : read === 'paused' ? 'play' : 'vol'} size="xs" /></SwapIcon></span>
              <span className="dm-aab-pr" aria-hidden="true"><i style={{ width: Math.min(100, pos / Math.max(words.length, 1) * 100) + '%' }} /></span>
              <span className="dm-aab-tm dm-num">{clock(pos * secondsPerWord)} / {clock(words.length * secondsPerWord)}</span>
            </button>
          </Tip>
        </div>
        <Swap className="dm-aab-meta dm-muted dm-num">{v?.meta ?? ''}</Swap>
      </div>
      <Fold open={why} className="dm-aab-why">
        <div ref={wy} className="dm-aab-wy">
          <span className="dm-aab-wq">What was off?</span>
          <div className="dm-aab-ch">
            {reasons.map(r => <button key={r} type="button" className="dm-chip dm-sm" onClick={() => { setAsked(a => ({ ...a, [at]: r })); onReason?.(at, r); }}>{r}</button>)}
          </div>
        </div>
      </Fold>
      <p ref={stRef} className={cx('dm-aab-st dm-muted', shownTone && 'dm-' + shownTone, !status && 'dm-off')} aria-live="polite">
        {statusTone === 'ok' && status ? <><Icon name="ok" size="xs" /><span key={status} {...enter()}>{status}</span></> : <Swap key={fresh.current} className={streaming && status && statusTone !== 'warn' ? 'dm-shim' : undefined}>{line}</Swap>}
      </p>
      </div>
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
