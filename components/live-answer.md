# Live answer

> Answers that stream in with numbered sources and next steps.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/live-answer

## Install

```sh
npx designme add live-answer          # HTML, CSS and JS, with the shared core
npx designme add live-answer --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Live answer shows a question and the agent's reply as it streams in word by word, with numbered citations that point to a source list. Each turn moves through waiting, thinking, answering and done, and once it is done the person can copy, rate, retry or pick a follow-up question that adds a new turn below.

### When to use it

- When your agent answers questions from data, documents or the web and people need to check where each claim came from.
- When answers arrive token by token and you want the text to build up in place instead of appearing all at once.
- When you want to show that the agent thought first, with a short list of what it did, without cluttering the answer.
- When a conversation should continue through suggested follow-up questions.

### What it does

- Each turn has a `state`: waiting shows nothing, thinking shows a Thinking line, answering streams `text`, and done adds sources and actions.
- Write [1] after a word in `text` to cite source 1. A half-typed citation like "[2" is held back until it is complete, and a blank line starts a new paragraph.
- Hovering a citation or a source highlights the pair, and a click pins it and opens the source list until the next click.
- A toggle like "3 steps · 2s" lists the agent's `thoughts`. Leave out `thoughtFor` and it counts the seconds while the turn is thinking.
- Copy, Good answer and Bad answer buttons sit under every finished answer, and `onRetry` adds a Try again button. Copying strips the citation numbers before calling `onCopy`.
- `followUps` appear under the last answer once it is done, and `onFollowUp` receives the chosen question so you can add the next turn.

### Accessibility

- The steps toggle and the sources button report their open state with `aria-expanded`.
- The Good answer and Bad answer buttons use `aria-pressed`, and every icon-only button has an `aria-label`.
- Collapsed thought and source lists are marked `inert` and `aria-hidden`, so they drop out of the tab order.
- Under `prefers-reduced-motion: reduce`, the word fade-ins and other animations are cut to near zero.

## Usage in React

```tsx
import { LiveAnswer } from '@/components/designme/live-answer/LiveAnswer';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useCallback, useEffect, useState } from 'react';
import { useWait } from '../lib/useScript';
import { LiveAnswer, type AnswerSource, type AnswerTurn } from './LiveAnswer';

/* ---------- Live answer: it thinks, streams a cited answer, then offers follow-ups that add turns ---------- */
const FIRST = 'Where are people dropping off in onboarding?';
const ANSWERS: Record<string, string> = {
  [FIRST]: 'Most people leave at the workspace step [1]. It asks for a team name before anyone has made anything, and five of eight people in interviews paused there [2]. Moving it after the first project, and filling the name from the email domain, should help [3].',
  'Show the drop-off by device': 'On mobile the workspace step loses 41% [1], on desktop 23% [1]. Most of the mobile drop comes from the keyboard covering the Continue button [3].',
  'Draft a fix for the workspace step': 'Ask for the team name after the first project, and fill it from the email domain so most people never type it [2]. On mobile, keep Continue above the keyboard [3], then compare the step again after a week [1].'
};
const THOUGHTS = ['Read the funnel for the last 30 days', 'Matched the drop to the interview notes', 'Checked step 2 in Onboarding.fig'];
const SOURCES: AnswerSource[] = [
  { n: 1, mark: 'F', color: '#7a5af8', title: 'Funnel data', detail: 'Amplitude, last 30 days', tip: 'Funnel data, last 30 days' },
  { n: 2, mark: 'N', color: '#0ea5a4', title: 'Session notes', detail: 'Notion, 8 interviews', tip: 'Session notes from 8 interviews' },
  { n: 3, mark: 'S', color: '#f97316', title: 'Onboarding.fig', detail: 'Figma, step 2', tip: 'Onboarding.fig, step 2' }
];

export default function LiveAnswerDemo() {
  const [turns, setTurns] = useState<AnswerTurn[]>([{ key: 0, question: FIRST, state: 'waiting' }]);
  const [asked, setAsked] = useState(false);
  const wait = useWait();

  // streams the answer to question q into turn i, one word at a time
  const answer = useCallback(async (i: number, q: string) => {
    const set = (patch: Partial<AnswerTurn>) => setTurns(ts => ts.map((t, k) => k === i ? { ...t, ...patch } : t));
    set({ state: 'thinking', text: '' });
    await wait(1300);
    set({ state: 'answering', thoughts: THOUGHTS, thoughtFor: 2 });
    let text = '';
    for (const tok of ANSWERS[q].split(' ')) {
      text += (text ? ' ' : '') + tok; set({ text });
      await wait(55 + Math.random() * 45);
    }
    set({ state: 'done', sources: SOURCES });
  }, [wait]);

  useEffect(() => { answer(0, FIRST); }, [answer]);

  const ask = async (q: string) => {
    const i = turns.length;
    setAsked(true);
    setTurns(ts => [...ts, { key: i, question: q, state: 'waiting' }]);
    await wait(450); await answer(i, q);
  };
  const retry = (i: number) => { if (turns[i].state === 'done') answer(i, turns[i].question ?? ''); };

  return (
    // keeps the room the first answer fills with its sources and follow-ups, so nothing climbs when they arrive
    <div style={{ width: '100%', minHeight: 376 }}>
      <LiveAnswer turns={turns} followUps={asked ? undefined : ['Show the drop-off by device', 'Draft a fix for the workspace step']} onFollowUp={ask} onRetry={retry} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `turns` | `AnswerTurn[]` |  |
| `followUps` (optional) | `string[]` | Suggested next questions, shown under the last answer once it is done |
| `onFollowUp` (optional) | `(question: string) => void` |  |
| `onRetry` (optional) | `(index: number) => void` | Adds a Try again button under each answer |
| `onRate` (optional) | `(index: number, rating: AnswerRating) => void` |  |
| `onCopy` (optional) | `(index: number, text: string) => void` | Called after an answer is copied, with its text without the citations |
| `onSourceClick` (optional) | `(source: AnswerSource) => void` | Called when a source in the list is clicked, besides pinning it |
| `className` (optional) | `string` |  |

## Questions

**How do I stream the answer in?**

Set the turn's `state` to 'answering' and keep updating its `text` as tokens arrive. Each new word fades in, and when the stream ends you set `state` to 'done' and pass `sources`.

**How do citations link to sources?**

Put [n] right after a word in `text`, and give a source in `sources` the same `n`. Its tooltip shows the source's `tip`, or its title and detail when `tip` is left out.

**What happens to ratings and pinned sources when the person clicks Try again?**

When a turn goes from done back to answering, it starts afresh with closed lists, no pinned source and no rating. Your `onRetry` handler decides how to regenerate the text.

**Can I show the question bubble somewhere else, like in my own chat?**

Yes. Leave out `question` on a turn and no bubble is drawn for it, so only the answer appears.

## Source

`LiveAnswer.tsx`, as `npx designme add live-answer --react` installs it:

```tsx
'use client';
import { Fragment, useState } from 'react';
import { cx } from '../lib/cx';
import { useCopied, useSeconds } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Think, Tip } from '../lib/motion';
import '../designme.css';
import './live-answer.css';

export interface AnswerSource {
  /** The number its citations use: [1] in the text cites source 1 */
  n: number;
  /** Like "Funnel data" */
  title: string;
  /** Where it came from, shown in the list, like "Amplitude, last 30 days" */
  detail?: string;
  /** Shown when you hover a citation. Defaults to the title and detail */
  tip?: string;
  /** The letter on its badge. Defaults to the title's first letter */
  mark?: string;
  /** Badge colour, any CSS colour */
  color?: string;
}

export type AnswerState = 'waiting' | 'thinking' | 'answering' | 'done';

export interface AnswerTurn {
  /** Keeps each turn in place when turns are added. Defaults to its index */
  key?: string | number;
  /** What the person asked, shown as a bubble above the answer. Leave it out when the bubble is shown elsewhere, like in a chat */
  question?: string;
  /** waiting shows nothing yet, thinking shows the Thinking line, answering streams the text, done adds sources and actions */
  state: AnswerState;
  /** The answer so far. Each new word fades in as it arrives. [1] after a word cites source 1, a blank line starts a new paragraph */
  text?: string;
  /** What the agent did before it answered, listed under a toggle that counts them, like "3 steps · 2s" */
  thoughts?: string[];
  /** Seconds it thought for. Leave it out to count while thinking */
  thoughtFor?: number;
  sources?: AnswerSource[];
}

export type AnswerRating = 'good' | 'bad' | null;

export interface LiveAnswerProps {
  turns: AnswerTurn[];
  /** Suggested next questions, shown under the last answer once it is done */
  followUps?: string[];
  onFollowUp?: (question: string) => void;
  /** Adds a Try again button under each answer */
  onRetry?: (index: number) => void;
  onRate?: (index: number, rating: AnswerRating) => void;
  /** Called after an answer is copied, with its text without the citations */
  onCopy?: (index: number, text: string) => void;
  /** Called when a source in the list is clicked, besides pinning it */
  onSourceClick?: (source: AnswerSource) => void;
  className?: string;
}

type Word = { text: string; cites: { n: number; rest: string }[] };

/** Splits a paragraph into words, hanging each [n] citation on the word before it */
function words(par: string, streaming: boolean): Word[] {
  const toks = par.split(' ').filter(Boolean);
  // a citation still arriving, like "[" or "[2", waits until it is complete
  if (streaming && /^\[\d*$/.test(toks[toks.length - 1] ?? '')) toks.pop();
  const out: Word[] = [];
  for (const tok of toks) {
    const m = tok.match(/^\[(\d+)\](.*)$/);
    if (m && out.length) out[out.length - 1].cites.push({ n: +m[1], rest: m[2] });
    else out.push({ text: tok, cites: [] });
  }
  return out;
}
const plain = (text: string) => text.replace(/\s*\[\d+\]/g, '').replace(/\s+/g, ' ').trim();

interface TurnProps {
  turn: AnswerTurn;
  followUps?: string[];
  onFollowUp?: (q: string) => void;
  onRetry?: () => void;
  onRate?: (r: AnswerRating) => void;
  onCopy?: (text: string) => void;
  onSourceClick?: (s: AnswerSource) => void;
}

function Turn({ turn, followUps, onFollowUp, onRetry, onRate, onCopy, onSourceClick }: TurnProps) {
  const { state, text = '', thoughts, sources = [] } = turn;
  const done = state === 'done';
  const counted = useSeconds(state === 'thinking' && turn.thoughtFor === undefined);
  const [thoughtsOpen, setThoughtsOpen] = useState(false);
  const [listOpen, setListOpen] = useState(false);
  // hovering a citation or a source previews it, a click pins it until the next click
  const [hover, setHover] = useState<number | null>(null);
  const [pin, setPin] = useState<number | null>(null);
  const [rating, setRating] = useState<AnswerRating>(null);
  const [copied, copyText] = useCopied();
  const active = hover ?? pin;
  const pick = (n: number) => { const next = pin === n ? null : n; setPin(next); if (next !== null) setListOpen(true); };
  const rate = (r: 'good' | 'bad') => { const next = rating === r ? null : r; setRating(next); onRate?.(next); };
  const copy = () => {
    const out = plain(text);
    copyText(out); onCopy?.(out);
  };
  const tipOf = (n: number) => { const s = sources.find(x => x.n === n); return s ? s.tip ?? [s.title, s.detail].filter(Boolean).join(', ') : `Source ${n}`; };

  return (
    <div className="dm-lva-turn">
      {state === 'thinking' && (
        <div className="dm-lva-th dm-enter">
          <span style={{ color: 'var(--dm-fg2)', display: 'grid' }}><Think /></span><span className="dm-shim">Thinking</span>
        </div>
      )}
      {(state === 'answering' || done) && thoughts?.length ? (
        <>
          <button type="button" className="dm-lva-th dm-lva-tb" aria-expanded={thoughtsOpen} onClick={() => setThoughtsOpen(!thoughtsOpen)}>
            <span>{thoughts.length} {thoughts.length === 1 ? 'step' : 'steps'} · {turn.thoughtFor ?? Math.max(1, counted)}s</span><Icon name="chev-d" size="xs" />
          </button>
          <Fold open={thoughtsOpen}><ul className="dm-lva-tlist">{thoughts.map((t, i) => <li key={i}>{t}</li>)}</ul></Fold>
        </>
      ) : null}
      {(state === 'answering' || done) && text.split(/\n{2,}/).map((par, p) => (
        <p key={p} className="dm-lva-p">
          {words(par, !done).map((w, i) => (
            <span key={i} className="dm-w" style={w.cites.length ? { whiteSpace: 'nowrap' } : undefined}>
              {w.text}
              {w.cites.map((c, k) => (
                <Fragment key={k}>
                  <Tip label={tipOf(c.n)}>
                    <span className={cx('dm-cite', active === c.n && 'dm-on')} style={done ? { cursor: 'pointer' } : undefined}
                      onMouseEnter={done ? () => setHover(c.n) : undefined} onMouseLeave={done ? () => setHover(null) : undefined} onClick={done ? () => pick(c.n) : undefined}>{c.n}</span>
                  </Tip>
                  {c.rest}
                </Fragment>
              ))}
              {' '}
            </span>
          ))}
        </p>
      ))}
      {done && (
        <>
          <div className="dm-lva-src dm-enter">
            <span className="dm-lva-acts">
              <Tip label={copied ? 'Copied to clipboard' : 'Copy'} open={copied || undefined}>
                <button type="button" className={cx('dm-ib', copied && 'dm-copied')} aria-label="Copy" onClick={copy}><Icon name={copied ? 'check' : 'copy'} /></button>
              </Tip>
              <Tip label="Good answer">
                <button type="button" className={cx('dm-ib', rating === 'good' && 'dm-on')} aria-label="Good answer" aria-pressed={rating === 'good'} onClick={() => rate('good')}><Icon name="up-thumb" /></button>
              </Tip>
              <Tip label="Bad answer">
                <button type="button" className={cx('dm-ib', rating === 'bad' && 'dm-on')} aria-label="Bad answer" aria-pressed={rating === 'bad'} onClick={() => rate('bad')}><Icon name="down-thumb" /></button>
              </Tip>
              {onRetry && <Tip label="Try again"><button type="button" className="dm-ib" aria-label="Try again" onClick={onRetry}><Icon name="refresh" /></button></Tip>}
            </span>
            {sources.length > 0 && (
              <button type="button" className="dm-lva-sb" aria-expanded={listOpen} onClick={() => setListOpen(!listOpen)}>
                <span className="dm-lva-fav">{sources.map(s => <span key={s.n} style={{ background: s.color ?? 'var(--dm-c1)' }}>{s.mark ?? s.title.charAt(0)}</span>)}</span>
                {sources.length} {sources.length === 1 ? 'source' : 'sources'}<Icon name="chev-d" size="xs" />
              </button>
            )}
          </div>
          {sources.length > 0 && (
            <Fold open={listOpen}>
              <div className="dm-lva-ll">
                {sources.map(s => (
                  <button type="button" key={s.n} className={cx('dm-lva-s', active === s.n && 'dm-on')}
                    onMouseEnter={() => setHover(s.n)} onMouseLeave={() => setHover(null)} onClick={() => { pick(s.n); onSourceClick?.(s); }}>
                    <span className="dm-n">{s.n}</span><span>{s.title}</span><span className="dm-d">{s.detail}</span><Icon name="ext" size="xs" />
                  </button>
                ))}
              </div>
            </Fold>
          )}
          {followUps?.length ? (
            <div className="dm-lva-fu">
              {followUps.map((q, i) => <button type="button" key={q} {...enter(i * 90)} onClick={() => onFollowUp?.(q)}><Icon name="chev-r" size="xs" />{q}</button>)}
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}

/** Starts a turn afresh (closed lists, no pin or rating) each time it goes back from done to answering again, like Try again */
function TurnSlot(props: TurnProps) {
  const [seen, setSeen] = useState({ state: props.turn.state, round: 0 });
  let round = seen.round;
  if (seen.state !== props.turn.state) {
    round += seen.state === 'done' ? 1 : 0;
    setSeen({ state: props.turn.state, round });
  }
  return <Turn key={round} {...props} />;
}

/** A question and an answer that streams in word by word, with citations, sources and follow-ups, then more turns below it. */
export function LiveAnswer({ turns, followUps, onFollowUp, onRetry, onRate, onCopy, onSourceClick, className }: LiveAnswerProps) {
  const last = turns.length - 1;
  return (
    <div data-dm="" className={cx('dm-lva', className)}>
      {turns.length > 0 && turns[0].question && <div className="dm-lva-q"><div className="dm-bub">{turns[0].question}</div></div>}
      <div className="dm-lva-a">
        {turns.map((t, i) => (
          <Fragment key={t.key ?? i}>
            {i > 0 && t.question && <div className="dm-lva-q dm-enter"><div className="dm-bub">{t.question}</div></div>}
            <TurnSlot turn={t} followUps={i === last ? followUps : undefined} onFollowUp={onFollowUp}
              onRetry={onRetry && (() => onRetry(i))} onRate={onRate && (r => onRate(i, r))} onCopy={onCopy && (x => onCopy(i, x))} onSourceClick={onSourceClick} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}
```

## More in Conversation

- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with a live preview and versions.
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
