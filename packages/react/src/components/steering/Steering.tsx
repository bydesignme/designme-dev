'use client';
import { useState, type FormEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Spin, Swap } from '../../lib/motion';
import '../../designme.css';
import './steering.css';

export type SteerStepStatus = 'queued' | 'running' | 'done';

export interface SteerStep {
  id: string;
  /** Like "Update the Pro card" */
  title: string;
  /** What it is doing now, or what it did. It crossfades when it changes */
  detail?: string;
  status: SteerStepStatus;
  /** Marks a step that a message of yours added, with a "From you" tag */
  fromYou?: boolean;
}

export interface SteerMessage {
  id: string;
  from: 'you' | 'agent';
  text: string;
  /** For yours: `queued` while it waits for the step in progress, `applied` once the agent has taken it up */
  state?: 'queued' | 'applied';
  /** For the agent's: an amber heads-up, for when your message changes work already done */
  warn?: boolean;
  /** Buttons under the agent's message, the last one filled, like Leave it and Redo the Pro card */
  actions?: { label: string; onClick: () => void }[];
  /** Takes the buttons' place once you've answered, like "Added a step to redo the Pro card". The amber goes too */
  answer?: string;
}

export interface SteeringProps {
  /** The run's goal, like "Redesign the pricing page" */
  title: string;
  steps: SteerStep[];
  /** What you sent and what the agent said back, in order */
  messages?: SteerMessage[];
  /** Called with the text when a message is sent. Add it to `messages` as `queued`, and mark it `applied` when it's taken up */
  onSend?: (text: string) => void;
  /** The message being written */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Defaults to "Steer the agent while it works", and "The run has finished" once every step is done */
  placeholder?: string;
  /** The line under the title. Defaults to "Step 2 of 4", or Done, then the clock */
  status?: string;
  /** Seconds to show as m:ss. Leave it out to let the clock count until every step is done */
  seconds?: number;
  /** Shown once every step is done. Defaults to "Done in 0:14 · 1 change from you"; false hides it */
  summary?: string | false;
  className?: string;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

/** How many times `value` has changed since the first render, so a glyph can play its entrance on a change but not on mount */
function useChanges<T>(value: T) {
  const [seen, setSeen] = useState({ value, n: 0 });
  if (Object.is(seen.value, value)) return seen.n;
  setSeen({ value, n: seen.n + 1 });
  return seen.n + 1;
}

function Glyph({ status }: { status: SteerStepStatus }) {
  const e = useChanges(status) > 0 ? enter() : undefined;
  return (
    <span key={status} className={cx('dm-ste-g', e?.className)} style={e?.style} aria-hidden="true">
      {status === 'running' ? <Spin /> : status === 'done' ? <Icon name="ok" size="xs" /> : <span className="dm-dot" />}
    </span>
  );
}

/** A run you can steer while it works: its steps, what you told it and what it said back, and a message box.
    A message waits for the step in progress and applies from the next one; you decide what happens to it through `messages`. */
export function Steering({ title, steps, messages = [], onSend, value, defaultValue = '', onValueChange, placeholder, status, seconds, summary, className }: SteeringProps) {
  const [draft, setDraft] = useControllable(value, defaultValue, onValueChange);
  const finished = steps.length > 0 && steps.every(s => s.status === 'done');
  const counted = useSeconds(seconds === undefined && !finished);
  const secs = seconds ?? counted;
  const at = steps.findIndex(s => s.status === 'running');
  const line = status ?? (finished ? 'Done' : `Step ${(at < 0 ? steps.filter(s => s.status === 'done').length : at) + 1} of ${steps.length}`);
  const mine = messages.filter(m => m.from === 'you').length;
  const done = summary === undefined ? `Done in ${clock(secs)}${mine ? ` · ${mine} change${mine > 1 ? 's' : ''} from you` : ''}` : summary;
  const send = (e: FormEvent) => { e.preventDefault(); const t = draft.trim(); if (!t || finished) return; onSend?.(t); setDraft(''); };
  const sum = finished && done !== false ? enter() : undefined;

  return (
    <div data-dm="" className={cx('dm-ste dm-panel', className)}>
      <div className="dm-ste-h"><b>{title}</b><span className="dm-muted dm-ste-st"><span aria-live="polite"><Swap>{line}</Swap></span> · <span className="dm-num">{clock(secs)}</span></span></div>
      <ol className="dm-ste-steps" aria-label="Steps">
        {steps.map(s => {
          const e = s.fromYou ? enter() : undefined;
          return (
            <li key={s.id} className={cx('dm-ste-s', `dm-${s.status === 'running' ? 'run' : s.status}`, e?.className)} style={e?.style}>
              <Glyph status={s.status} />
              <span className="dm-ste-t"><b>{s.title}</b>{s.detail && <Swap>{s.detail}</Swap>}</span>
              {s.fromYou && <span className="dm-tag dm-b">From you</span>}
            </li>
          );
        })}
      </ol>
      <div className="dm-ste-log" aria-live="polite">
        {messages.map(m => {
          const e = enter();
          if (m.from === 'you') return (
            <div key={m.id} className={cx('dm-ste-me', e.className)} style={e.style}>
              <p>{m.text}</p>
              <span key={m.state} className={cx('dm-ste-q', m.state === 'applied' && 'dm-enter')}>
                {m.state === 'applied' ? <><Icon name="check" size="xs" />Applied</> : <><Spin />Applies after this step</>}
              </span>
            </div>
          );
          const warn = m.warn && !m.answer;
          return (
            <div key={m.id} className={cx('dm-ste-ag', warn && 'dm-warn', e.className)} style={e.style}>
              <Icon name={warn ? 'alert' : 'spark'} size="xs" />
              <div className="dm-t">
                <p>{m.text}</p>
                {m.answer ? <span className="dm-muted">{m.answer}</span> : m.actions?.length ? (
                  <div className="dm-ste-acts">
                    {m.actions.map((a, i) => <button key={a.label} type="button" className={cx('dm-pill dm-sm', i === m.actions!.length - 1 ? 'dm-primary' : 'dm-ghost')} onClick={a.onClick}>{a.label}</button>)}
                  </div>
                ) : null}
              </div>
            </div>
          );
        })}
        {sum && <div className={cx('dm-ste-sum', sum.className)} style={sum.style}><Icon name="ok" size="xs" /><span>{done}</span></div>}
      </div>
      <form className="dm-ste-box" onSubmit={send}>
        <input value={draft} onChange={e => setDraft(e.target.value)} disabled={finished} placeholder={placeholder ?? (finished ? 'The run has finished' : 'Steer the agent while it works')} aria-label="Message the agent" spellCheck={false} autoComplete="off" />
        <button type="submit" className="dm-ste-go" aria-label="Send" disabled={finished || !draft.trim()}><Icon name="up" size="xs" /></button>
      </form>
    </div>
  );
}
