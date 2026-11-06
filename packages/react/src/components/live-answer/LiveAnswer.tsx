'use client';
import { Fragment, useState } from 'react';
import { cx } from '../../lib/cx';
import { useCopied, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Think, Tip } from '../../lib/motion';
import '../../designme.css';
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
                <span className="dm-lva-fav">{sources.map(s => <span key={s.n} style={{ backgroundColor: s.color ?? 'var(--dm-c1)' }}>{s.mark ?? s.title.charAt(0)}</span>)}</span>
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
