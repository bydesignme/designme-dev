# Voice capture

> Talk to the agent, then fix what it misheard before sending.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/voice-capture

## Install

```sh
npx designme add voice-capture          # HTML, CSS and JS, with the shared core
npx designme add voice-capture --react  # React 19 component and its CSS
npx designme add voice-capture --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/voice-capture.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/voice-capture.json  # Astro
```

## About

Voice capture is the panel a person talks into when they speak a request to an agent. It shows a live waveform, a clock and the transcript as it is heard, highlights the words the speech model was unsure of, and asks the person to check them before the text is sent.

### When to use it

- When people speak tasks to your agent, on a phone or hands-free, and transcription mistakes would send the agent the wrong way.
- When your speech-to-text service returns alternatives for low-confidence words and you want people to pick the right one.
- When people need to pause, cancel or record again without losing track of what was sent.

### What it does

- It moves through five states: listening, paused, review, sent and cancelled. The buttons move it along by themselves, or you control it with `state` and `onStateChange`.
- Words passed in `words` fade in as they arrive. A word given with `alternatives` is highlighted and opens a "Did you mean" menu, and picking one calls `onFix`.
- Done first moves from recording to review, then a second Done sends the checked text, with fixes applied, to `onSend`.
- The waveform samples `level` about every 50 milliseconds. Pass a function to read the microphone directly, and it records silence while paused. Once recording stops, the wave stays as the whole recording, still, so the panel keeps its height.
- The clock counts up while listening unless you pass `seconds`, and the status line defaults to Listening, Paused, Check what I heard, Sent or Cancelled.
- Cancelling keeps the words on show, greyed. Once the capture is sent or cancelled, a Record again button clears the fixes and the clock and calls `onRecordAgain`.

### Accessibility

- The transcript is an `aria-live="polite"` region, so new words are announced.
- Unsure words are focusable `role="button"` elements with `aria-haspopup="menu"`, and Enter or Space opens their menu with the focus on the first fix.
- The "Did you mean" menu uses `role="menu"` and `menuitem`, the arrow keys move through it and wrap, Home and End jump, and Escape or a click outside closes it (Escape gives the focus back to the word).
- The Pause button is labelled Pause or Resume to match the state, and the waveform canvas is `aria-hidden`.

## Usage in React

```tsx
import { VoiceCapture } from '@/components/designme/voice-capture/VoiceCapture';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { VoiceCapture, type HeardWord, type VoiceCaptureState } from './VoiceCapture';
import { useScript } from '../lib/useScript';

/* ---------- Voice capture: a sentence is heard word by word, two words it was unsure of get a highlight ---------- */
const SENTENCE = 'Move the yearly toggle above the cards and make the save badge say 20% off for annual plans'.split(' ');
const UNSURE: Record<number, string[]> = { 3: ['toggle', 'toddle', 'tunnel'], 10: ['save', 'sale', 'saving'] };

export default function VoiceCaptureDemo() {
  // Record again starts the whole take over, like replaying the card on the site
  const [take, setTake] = useState(0);
  return <Take key={take} onRecordAgain={() => setTake(t => t + 1)} />;
}

function Take({ onRecordAgain }: { onRecordAgain: () => void }) {
  const [words, setWords] = useState<Array<string | HeardWord>>([]);
  const [state, setState] = useState<VoiceCaptureState>('listening');
  const now = useRef(state);
  useEffect(() => { now.current = state; });
  // a stand-in for the microphone: each word makes noise for the next five samples
  const speak = useRef(0);
  const level = () => { if (speak.current <= 0) return 0; speak.current--; return .2 + Math.random() * .8; };

  useScript(async ({ wait }) => {
    await wait(700);
    for (let i = 0; i < SENTENCE.length; i++) {
      while (now.current === 'paused') await wait(100);
      if (now.current !== 'listening') return;
      speak.current = 5;
      const w = SENTENCE[i], alternatives = UNSURE[i];
      setWords(ws => [...ws, alternatives ? { text: w, alternatives } : w]);
      await wait(170 + Math.random() * 150);
    }
    await wait(900);
    if (now.current === 'listening' || now.current === 'paused') setState('review');
  });

  return (
    <div style={{ width: '100%' }}>
      <VoiceCapture words={words} level={level} state={state} onStateChange={setState} onRecordAgain={onRecordAgain} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `words` | `Array<string \| HeardWord>` | The words heard so far, in order. Add to the end as they arrive and each one fades in |
| `state` (optional) | `VoiceCaptureState` | listening and paused record, review asks the person to check the words, sent and cancelled are the end. Leave it out to let the buttons move it along |
| `defaultState` (optional) | `VoiceCaptureState` |  |
| `onStateChange` (optional) | `(state: VoiceCaptureState) => void` |  |
| `seconds` (optional) | `number` | Seconds recorded. Leave it out to let it count while listening |
| `level` (optional) | `number \| (() => number)` | The input level from 0 to 1, drawn into the wave about 20 times a second. Pass a function to read the microphone on every sample (for example from an AnalyserNode) without re-rendering |
| `status` (optional) | `string` | The status line. Defaults to Listening, Paused, Check what I heard, Sent or Cancelled |
| `onSend` (optional) | `(text: string) => void` | Called with the checked transcript when the person presses Done in review |
| `onFix` (optional) | `(index: number, text: string) => void` | Called when the person picks one of a word's alternatives |
| `onRecordAgain` (optional) | `() => void` | Called by Record again, once the capture is sent or cancelled. Clear your words and start listening again |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import VoiceCapture from '../components/designme/voice-capture/VoiceCapture.astro';
---
<VoiceCapture />
<VoiceCapture data-style="soft" class="my-class" />
```
It plays its demo; change `voice-capture.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does the component use the microphone or do speech recognition?**

No. You run the recording and transcription, add words to `words` as they arrive, and pass the input level as `level`. The component draws them and handles review.

**How do I mark a word the speech model wasn't sure about?**

Pass it as an object, like `{ text: 'toddle', alternatives: ['toggle', 'tunnel'] }`. It gets a highlight, and after recording stops its tooltip says it is not sure about the word.

**What text does `onSend` receive?**

The heard words joined with spaces, with every word the person fixed replaced by their pick.

## Source

`VoiceCapture.tsx`, as `npx designme add voice-capture --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
import './voice-capture.css';

export type VoiceCaptureState = 'listening' | 'paused' | 'review' | 'sent' | 'cancelled';

/** A word the speech model was not sure about */
export interface HeardWord {
  text: string;
  /** What it might have been instead. Highlights the word and lets the person pick one */
  alternatives?: string[];
}

export interface VoiceCaptureProps {
  /** The words heard so far, in order. Add to the end as they arrive and each one fades in */
  words: Array<string | HeardWord>;
  /** listening and paused record, review asks the person to check the words, sent and cancelled are the end.
      Leave it out to let the buttons move it along */
  state?: VoiceCaptureState;
  defaultState?: VoiceCaptureState;
  onStateChange?: (state: VoiceCaptureState) => void;
  /** Seconds recorded. Leave it out to let it count while listening */
  seconds?: number;
  /** The input level from 0 to 1, drawn into the wave about 20 times a second. Pass a function to read the
      microphone on every sample (for example from an AnalyserNode) without re-rendering */
  level?: number | (() => number);
  /** The status line. Defaults to Listening, Paused, Check what I heard, Sent or Cancelled */
  status?: string;
  /** Called with the checked transcript when the person presses Done in review */
  onSend?: (text: string) => void;
  /** Called when the person picks one of a word's alternatives */
  onFix?: (index: number, text: string) => void;
  /** Called by Record again, once the capture is sent or cancelled. Clear your words and start listening again */
  onRecordAgain?: () => void;
  className?: string;
}

const STATUS: Record<VoiceCaptureState, string> = { listening: 'Listening', paused: 'Paused', review: 'Check what I heard', sent: 'Sent', cancelled: 'Cancelled' };
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** Speech to text that shows what it heard as it hears it, and lets the person fix the words it was unsure of. */
export function VoiceCapture({ words, state, defaultState = 'listening', onStateChange, seconds, level = 0, status, onSend, onFix, onRecordAgain, className }: VoiceCaptureProps) {
  const [now, setState] = useControllable(state, defaultState, onStateChange);
  const live = now === 'listening' || now === 'paused', ended = now === 'sent' || now === 'cancelled';
  const root = useRef<HTMLDivElement>(null);
  const wave = useRef<HTMLCanvasElement>(null);
  const pop = useRef<HTMLDivElement>(null);
  // once recording stops the box keeps the height it had while recording: the wave stays, still, and the words stay put
  const liveHeight = useRef<number | undefined>(undefined);
  const [held, setHeld] = useState<number>();
  useIsoLayoutEffect(() => { if (live && root.current) liveHeight.current = root.current.offsetHeight; });
  useIsoLayoutEffect(() => { setHeld(live ? undefined : liveHeight.current); }, [live]);

  // the clock counts while listening, unless the parent passes seconds
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (seconds !== undefined || now !== 'listening') return;
    const id = setInterval(() => setCount(c => c + 1), 1000);
    return () => clearInterval(id);
  }, [seconds, now]);

  // the wave: one sample every 50ms, drawn as bars that scroll left while it records. Once recording stops it shows the
  // whole recording, still, in quieter bars, so the box keeps its height and every part stays where it was
  const samples = useRef<number[]>([]);
  const levelRef = useRef(level), stateRef = useRef(now);
  useEffect(() => { levelRef.current = level; stateRef.current = now; });
  useEffect(() => {
    const cv = wave.current, el = root.current; if (!cv || !el) return;
    // the colours are read a few times a second, not every frame: reading them makes the browser recheck the page's styles
    let cols: string[] | null = null, colsAt = -1e9;
    const colours = () => { const t = performance.now(); if (!cols || t - colsAt > 400) { const cs = getComputedStyle(el); cols = ['--dm-fg2', '--dm-faint', '--dm-muted'].map(k => cs.getPropertyValue(k).trim()); colsAt = t; } return cols; };
    const paint = (vals: number[], still: boolean) => {
      const dpr = devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
      if (cv.width !== w * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
      const x = cv.getContext('2d'); if (!x) return;
      x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
      const [on, off, rec] = colours(), n = vals.length;
      for (let i = 0; i < n; i++) {
        const v = vals[i], px = i * 5 + 2, bh = v ? Math.max(4, v * (h - 6)) : 2;
        x.globalAlpha = still ? (v ? .6 : 1) : Math.min(1, i / 14, (n - i) / 3 + .2);
        x.fillStyle = v ? (still ? rec : on) : off;
        x.beginPath();
        if (x.roundRect) x.roundRect(px, h / 2 - bh / 2, 2.5, bh, 1.2); else x.rect(px, h / 2 - bh / 2, 2.5, bh);
        x.fill();
      }
    };
    const bars = () => Math.floor(cv.clientWidth / 5);
    if (!live) {
      // the recording without the silence either side, fitted to the width: each bar is the loudest moment it covers
      const still = () => {
        const s = samples.current, n = bars(); const a = s.findIndex(v => v); let z = s.length - 1; while (z > a && !s[z]) z--;
        const rec = a < 0 ? [] : s.slice(Math.max(0, a - 2), z + 3);
        paint(Array.from({ length: n }, (_, i) => { const from = Math.floor(i * rec.length / n), to = Math.max(from + 1, Math.floor((i + 1) * rec.length / n)); return Math.max(0, ...rec.slice(from, to).map(v => v || 0)); }), true);
      };
      // drawn again only when its width or the theme changes
      const again = () => { cols = null; still(); };
      still();
      const ro = new ResizeObserver(again); ro.observe(cv);
      const mo = new MutationObserver(again); mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme', 'data-style', 'class'] });
      const mq = matchMedia('(prefers-color-scheme: dark)'); mq.addEventListener('change', again);
      return () => { ro.disconnect(); mo.disconnect(); mq.removeEventListener('change', again); };
    }
    // the wave is drawn only while it is on screen
    let raf = 0, last = 0, seen = true;
    const io = 'IntersectionObserver' in window ? new IntersectionObserver(e => { seen = e[e.length - 1].isIntersecting; }) : null;
    io?.observe(cv);
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw);
      if (!seen) return;
      if (t - last > 50) {
        last = t;
        const l = levelRef.current, v = stateRef.current === 'listening' ? (typeof l === 'function' ? l() : l) : 0;
        samples.current.push(Math.max(0, Math.min(1, v))); if (samples.current.length > 300) samples.current.shift();
      }
      const s = samples.current, n = bars();
      paint(Array.from({ length: n }, (_, i) => s[s.length - n + i] || 0), false);
    };
    raf = requestAnimationFrame(draw);
    return () => { cancelAnimationFrame(raf); io?.disconnect(); };
  }, [live]);

  // words it was unsure of open a small "Did you mean" menu under themselves
  const [fixes, setFixes] = useState<Record<number, string>>({});
  // the menu keeps its place and words while it fades out, so only `open` flips when it closes
  const [menu, setMenu] = useState<{ index: number; alts: string[]; style: CSSProperties }>({ index: -1, alts: [], style: {} });
  const [menuOpen, setMenuOpen] = useState(false);
  // the keyboard: Enter or Space on a word opens its menu with the focus on the first fix; the arrows move through the fixes
  // and wrap, Home and End jump, and Escape closes the menu back to the word
  const keyOpen = useRef(false), inMenu = useRef(false);
  const wordEl = (i: number) => root.current?.querySelector<HTMLElement>(`.dm-low[data-i="${i}"]`);
  useIsoLayoutEffect(() => {
    if (menuOpen) { if (keyOpen.current) { keyOpen.current = false; pop.current?.querySelector<HTMLElement>('.dm-mi')?.focus({ preventScroll: true }); } return; }
    if (inMenu.current) { inMenu.current = false; wordEl(menu.index)?.focus({ preventScroll: true }); }
  }, [menuOpen]); // eslint-disable-line react-hooks/exhaustive-deps
  const menuKey = (e: ReactKeyboardEvent) => {
    const all = Array.from(pop.current?.querySelectorAll<HTMLElement>('.dm-mi') ?? []), i = all.indexOf(document.activeElement as HTMLElement);
    const go = ({ ArrowDown: all[(i + 1) % all.length], ArrowUp: all[(i - 1 + all.length) % all.length], Home: all[0], End: all[all.length - 1] } as Record<string, HTMLElement | undefined>)[e.key];
    if (go) { e.preventDefault(); go.focus({ preventScroll: true }); }
    else if (e.key === 'Tab') { inMenu.current = false; wordEl(menu.index)?.focus({ preventScroll: true }); setMenuOpen(false); }
  };
  const show = (index: number, el: HTMLElement) => {
    const box = root.current; if (!box) return;
    const hr = box.getBoundingClientRect(), lr = el.getBoundingClientRect();
    setMenu({ index, alts: (words[index] as HeardWord).alternatives ?? [], style: { left: lr.left - hr.left, top: lr.bottom - hr.top + 6 } });
    setMenuOpen(true);
  };
  useEffect(() => {
    if (!menuOpen) return;
    // the click that opened the menu, or one on another unsure word, is not a click outside. Opening the menu
    // re-renders the word without its tip, so that click's target may already have left the page
    const click = (e: MouseEvent) => { const t = e.target as Element; if (t.isConnected && !pop.current?.contains(t) && !(root.current?.contains(t) && t.closest('.dm-low'))) setMenuOpen(false); };
    const key = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('click', click); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('click', click); document.removeEventListener('keydown', key); };
  }, [menuOpen]);
  const fix = (index: number, text: string) => { setFixes(f => ({ ...f, [index]: text })); onFix?.(index, text); setMenuOpen(false); };

  const text = () => words.map((w, i) => fixes[i] ?? (typeof w === 'string' ? w : w.text)).join(' ');
  const done = () => {
    if (live) setState('review');
    else if (now === 'review') { setState('sent'); onSend?.(text()); }
  };
  const again = () => { setCount(0); setFixes({}); setMenuOpen(false); samples.current = []; onRecordAgain?.(); setState('listening'); };

  return (
    <div data-dm="" ref={root} className={cx('dm-vcx dm-panel', now === 'paused' && 'dm-paused', !live && 'dm-done', now === 'cancelled' && 'dm-gone', held && 'dm-held', className)} style={held ? { minHeight: held } : undefined}>
      <div className="dm-vcx-top">
        <span className="dm-vcx-dot" />
        <Swap className="dm-vcx-st">{status ?? STATUS[now]}</Swap>
        <span className="dm-vcx-t dm-num dm-muted">{clock(seconds ?? count)}</span>
      </div>
      <canvas ref={wave} className="dm-vcx-wave" aria-hidden="true" />
      <p className="dm-vcx-tx" aria-live="polite">
        {words.map((w, i) => {
          const word = typeof w === 'string' ? { text: w } : w;
          // cancelled: the words stay, greyed and plain, so it is clear what was not sent
          if (!word.alternatives?.length || now === 'cancelled') return <span key={i} className="dm-w">{fixes[i] ?? word.text} </span>;
          const fixed = fixes[i] !== undefined;
          const low = (
            <span className={cx('dm-low', fixed && 'dm-fixed')} role="button" tabIndex={0} aria-haspopup="menu" aria-expanded={menuOpen && menu.index === i} data-i={i}
              onClick={e => show(i, e.currentTarget)} onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); keyOpen.current = true; show(i, e.currentTarget); } }}>
              {fixes[i] ?? word.text}
            </span>
          );
          // once recording stops, each unsure word says why it is marked; the tip steps aside while its menu is open
          return <span key={i} className="dm-w">{!live && !menuOpen ? <Tip label={fixed ? 'Fixed' : 'Not sure about this word'}>{low}</Tip> : low} </span>;
        })}
      </p>
      <div className="dm-vcx-acts">
        {ended ? (
          <>
            <span className="dm-muted" style={{ fontSize: 12.5 }}>{now === 'sent' ? 'Sent to the agent' : 'Nothing was sent'}</span>
            <span className="dm-sp" />
            <button type="button" className="dm-pill dm-ghost dm-sm dm-vcx-again" onClick={again}><Icon name="refresh" size="xs" />Record again</button>
          </>
        ) : (
          <>
            {live && (
              <Tip label={now === 'paused' ? 'Resume' : 'Pause'}>
                <button type="button" className="dm-ib dm-fill dm-vcx-pause" aria-label={now === 'paused' ? 'Resume' : 'Pause'} onClick={() => setState(now === 'paused' ? 'listening' : 'paused')}>
                  <Icon name={now === 'paused' ? 'mic' : 'pause'} />
                </button>
              </Tip>
            )}
            <span className="dm-sp" />
            <button type="button" className="dm-pill dm-ghost dm-sm dm-vcx-x" onClick={() => { setMenuOpen(false); setState('cancelled'); }}>Cancel</button>
            <button type="button" className="dm-pill dm-primary dm-sm dm-vcx-done" onClick={done}>Done</button>
          </>
        )}
      </div>
      <div ref={pop} className={cx('dm-pop dm-vcx-fix', menuOpen && 'dm-open')} role="menu" aria-label="Did you mean" style={menu.style} inert={!menuOpen} aria-hidden={!menuOpen}
        onKeyDown={menuKey} onFocus={() => { inMenu.current = true; }} onBlur={e => { if (!pop.current?.contains(e.relatedTarget as Node)) inMenu.current = false; }}>
        <div className="dm-ph">Did you mean</div>
        {menu.alts.map(a => <button type="button" key={a} role="menuitem" tabIndex={-1} className="dm-mi" onClick={() => fix(menu.index, a)}>{a}</button>)}
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
- [Voice orb](https://designme.dev/components/voice-orb.md): A hands-free voice chat, with an orb that shows who is talking.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Prompt library](https://designme.dev/components/prompt-library.md): Saved prompts with blanks to fill in before they go to the agent.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
