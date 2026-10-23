'use client';
import { useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './browser-session.css';

export type BrowserStepState = 'queued' | 'running' | 'waiting' | 'done';

export interface BrowserStep {
  /** What the agent does, like 'Click "Pricing"' */
  label: string;
  state: BrowserStepState;
  /** A quiet line under the step, like "2 of 3 prices". On a waiting step it says what is in the way, in amber */
  detail?: string;
}

export interface BrowserSessionProps {
  /** What the agent is browsing for, like "Pricing research" */
  title: string;
  /** The address bar: the page's address, or the search being typed */
  url: string;
  /** Marks `url` as a search, with a magnifier instead of the padlock */
  search?: boolean;
  /** The page, 156px tall: a screenshot or live view of the agent's browser, or a wireframe drawn with the dm-bws-pg classes */
  children?: ReactNode;
  /** The agent's own pointer, in pixels from the page's top left. `down` presses it. Hidden while the person has control */
  cursor?: { x: number; y: number; down?: boolean } | null;
  steps: BrowserStep[];
  /** While a step waits for the person: the button that lets the agent go on, like "Allow closing it". Take over sits beside it */
  ask?: { label: string; onAllow: () => void };
  /** Pause holds the agent where it is; the button turns into Resume */
  paused?: boolean;
  defaultPaused?: boolean;
  onPausedChange?: (paused: boolean) => void;
  /** Take over hands the page to the person: its frame turns the accent colour, its controls become usable, and the button reads Hand back */
  inControl?: boolean;
  defaultInControl?: boolean;
  onInControlChange?: (inControl: boolean) => void;
  /** Seconds to show as m:ss. Leave it out to let the clock count while the agent is browsing */
  seconds?: number;
  /** The line under the title. Defaults to Browsing, Paused, Needs you, You have control or Done, then the clock */
  status?: string;
  /** Shown under the steps once every step is done, like "Done · 3 prices saved to Pricing research" */
  summary?: string;
  className?: string;
}

const CLS: Record<BrowserStepState, string> = { queued: 'dm-queued', running: 'dm-run', waiting: 'dm-wait', done: 'dm-done' };
const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

function Glyph({ state }: { state: BrowserStepState }) {
  // a glyph plays its entrance when its step changes state, not when it first renders
  const [first] = useState(state);
  const e = state !== first ? enter() : undefined;
  return (
    <span key={state} className={cx('dm-g', e?.className)} style={e?.style} aria-hidden="true">
      {state === 'running' ? <Spin /> : state === 'done' ? <Icon name="ok" size="xs" /> : state === 'waiting' ? <Icon name="alert" size="xs" /> : <span className="dm-dot" />}
    </span>
  );
}

/** The agent browsing the web for the person: a small browser frame with the page it is on, the steps it takes under it,
    and Pause and Take over. When a step waits for the person, it shows why and a button to let the agent go on. */
export function BrowserSession({ title, url, search, children, cursor, steps, ask, paused, defaultPaused = false, onPausedChange,
  inControl, defaultInControl = false, onInControlChange, seconds, status, summary, className }: BrowserSessionProps) {
  const [isPaused, setPaused] = useControllable(paused, defaultPaused, onPausedChange);
  const [mine, setMine] = useControllable(inControl, defaultInControl, onInControlChange);
  const done = steps.length > 0 && steps.every(s => s.state === 'done');
  const waiting = steps.some(s => s.state === 'waiting');
  const counted = useSeconds(seconds === undefined && !done && !waiting && !isPaused && !mine);
  const secs = seconds ?? counted;
  const line = status ?? (done ? 'Done' : mine ? 'You have control' : isPaused ? 'Paused' : waiting ? 'Needs you' : 'Browsing');
  const take = () => { setMine(!mine); if (!mine && isPaused) setPaused(false); };
  const sum = done && summary ? enter() : undefined;

  return (
    <div data-dm="" className={cx('dm-bws dm-panel', mine && 'dm-you', isPaused && !mine && 'dm-paused', className)}>
      <div className="dm-bws-h">
        <div className="dm-bws-ht"><b>{title}</b><span className="dm-muted dm-bws-st"><span aria-live="polite"><Swap>{line}</Swap></span> · <span className="dm-num">{clock(secs)}</span></span></div>
        <div className="dm-bws-ctl">
          <Tip label={isPaused ? 'Resume' : 'Pause'}>
            <button type="button" className="dm-ib dm-bws-pause" aria-label={isPaused ? 'Resume' : 'Pause'} disabled={mine || done} onClick={() => setPaused(!isPaused)}>
              <Icon name={isPaused ? 'play' : 'pause'} />
            </button>
          </Tip>
          <button type="button" className="dm-pill dm-line dm-sm dm-bws-take" aria-pressed={mine} disabled={done} onClick={take}>{mine ? 'Hand back' : 'Take over'}</button>
        </div>
      </div>
      <div className="dm-bws-win">
        <div className="dm-bws-bar">
          <span className="dm-bws-dots" aria-hidden="true"><i /><i /><i /></span>
          <div className="dm-bws-url"><Icon name={search ? 'search' : 'lock'} size="xs" /><Swap>{url}</Swap></div>
        </div>
        {/* while the agent drives, the page is a picture of its browser; with Take over it is the person's to use */}
        <div className="dm-bws-vp" inert={!mine}>
          {children}
          <span className={cx('dm-bws-cur', cursor && !mine && 'dm-on', cursor?.down && 'dm-down')} style={cursor ? { transform: `translate(${cursor.x}px,${cursor.y}px)` } : undefined} aria-hidden="true">
            <svg viewBox="0 0 14 14"><path d="M2 1.5l9.5 5-4.2 1.2-2 4.3z" /></svg>
          </span>
        </div>
      </div>
      <ol className="dm-bws-steps" aria-label="Steps">
        {steps.map((s, i) => {
          const asking = s.state === 'waiting' && ask && !mine;
          return (
            <li key={i} className={cx('dm-bws-s', CLS[s.state])} aria-current={s.state === 'running' || s.state === 'waiting' ? 'step' : undefined}>
              <Glyph state={s.state} />
              <span className="dm-bws-t">
                <span>{s.label}</span>
                {s.detail && <Swap className="dm-d">{s.detail}</Swap>}
                {asking && (
                  <div className={cx('dm-bws-ask', enter().className)}>
                    <button type="button" className="dm-pill dm-ink dm-sm" onClick={ask.onAllow}>{ask.label}</button>
                    <button type="button" className="dm-pill dm-soft dm-sm" onClick={take}>Take over</button>
                  </div>
                )}
              </span>
            </li>
          );
        })}
      </ol>
      {sum && <div className={cx('dm-bws-sum', sum.className)} style={sum.style}><Icon name="ok" size="xs" /><span>{summary}</span></div>}
    </div>
  );
}
