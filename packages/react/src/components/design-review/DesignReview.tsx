'use client';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Avatar, enter, Spin, Swap } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './design-review.css';

export type ReviewCheckState = 'wait' | 'run' | 'ok' | 'bad';

export interface ReviewCheck {
  /** What is checked, like "Visual diff" */
  label: string;
  /** wait (not run yet), run (running now), ok or bad */
  state: ReviewCheckState;
  /** The result on the right, like "2 of 6 screens changed" */
  note?: string;
}

export interface ReviewMessage {
  /** Who wrote it. `agent` draws the agent's mark instead of an avatar */
  author: { name: string; initials?: string; color?: string; agent?: boolean };
  /** The tag beside the name, like Changes requested or Approved. `busy` puts a spinner in it */
  verdict?: { label: string; tone?: 'ok' | 'warn' | 'bad' | 'neutral'; icon?: IconName; busy?: boolean };
  /** What they said, under the name */
  text?: string;
}

export interface ShipOption {
  key: string;
  /** The button's label when it is picked, like "Ship to 10% first" */
  label: string;
  /** The quiet line under it in the menu */
  detail?: string;
}

export type ReviewPhase = 'review' | 'approved' | 'shipping' | 'live' | 'scheduled';

export interface DesignReviewProps {
  /** What is up for review, like "Pricing page v4" */
  title: string;
  /** The line under the title */
  subtitle?: string;
  icon?: IconName;
  checks: ReviewCheck[];
  /** The review so far, oldest first */
  messages: ReviewMessage[];
  /** Where it is: in review, approved (Ship turns on), shipping, then live or scheduled */
  phase: ReviewPhase;
  /** The line beside the Ship button, like "Waiting on Maya" */
  note?: string;
  /** Shown in the review column before anyone has written */
  waitingLabel?: string;
  /** The ways it can ship, picked from the menu beside the button */
  options?: ShipOption[];
  option?: string;
  defaultOption?: string;
  onOptionChange?: (key: string) => void;
  onShip?: (option: ShipOption) => void;
  /** The line that replaces the buttons once it is live or scheduled, like "Live for every visitor" */
  doneLabel?: string;
  labels?: { checks?: string; review?: string; inReview?: string; approved?: string; live?: string; scheduled?: string; shipping?: string };
  className?: string;
}

const SHIP: ShipOption[] = [
  { key: 'all', label: 'Ship to everyone', detail: 'Every visitor sees it now' },
  { key: 'some', label: 'Ship to 10% first', detail: 'Everyone else after a day' },
  { key: 'later', label: 'Ship on Monday', detail: 'At 09:00 your time' }
];

function Glyph({ state }: { state: ReviewCheckState }) {
  const g = state === 'run' ? <Spin /> : state === 'ok' ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="ok" size="xs" /></span>
    : state === 'bad' ? <span style={{ color: 'var(--dm-bad)', display: 'grid' }}><Icon name="alert" size="xs" /></span> : <span className="dm-drv-ring" />;
  return <span key={state} className={state === 'wait' ? undefined : 'dm-enter'} style={{ display: 'grid' }}>{g}</span>;
}

/** Something the agent made, on its way out: checks run, a teammate reviews and the agent answers, then you pick how it ships. */
export function DesignReview({
  title, subtitle, icon = 'palette', checks, messages, phase, note, waitingLabel = 'The review starts once the checks pass',
  options = SHIP, option, defaultOption, onOptionChange, onShip, doneLabel, labels = {}, className
}: DesignReviewProps) {
  const [pick, setPick] = useControllable(option, defaultOption ?? options[0].key, onOptionChange);
  const menu = usePopover({ align: 'end' });
  const chosen = options.find(o => o.key === pick) ?? options[0];
  const L = { checks: 'Checks', review: 'Review', inReview: 'In review', approved: 'Approved', live: 'Live', scheduled: 'Scheduled', shipping: 'Shipping', ...labels };
  const done = phase === 'live' || phase === 'scheduled';
  const tag = phase === 'review' ? ['dm-b', L.inReview] : phase === 'live' ? ['dm-ok', L.live] : phase === 'scheduled' ? ['dm-b', L.scheduled] : ['dm-ok', L.approved];
  const locked = phase !== 'approved';

  return (
    <div data-dm="" className={cx('dm-drv-box', className)} style={{ containerType: 'inline-size', width: '100%' }}>
      <div className={cx('dm-drv dm-panel', phase === 'live' && 'dm-live')}>
        <div className="dm-drv-h">
          <span className="dm-drv-ic"><Icon name={icon} /></span>
          <div className="dm-drv-ht"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
          <span className={cx('dm-tag dm-drv-tag', tag[0])}><Swap>{tag[1]}</Swap></span>
        </div>
        <div className="dm-drv-b">
          <div className="dm-drv-col">
            <span className="dm-drv-lb">{L.checks}</span>
            <div className="dm-drv-checks">
              {checks.map((c, i) => (
                <div key={i} className="dm-drv-c">
                  <span className="dm-g"><Glyph state={c.state} /></span>
                  <span className="dm-t">{c.label}</span>
                  <Swap className="dm-d">{c.note ?? (c.state === 'run' ? 'Running' : '')}</Swap>
                </div>
              ))}
            </div>
          </div>
          <div className="dm-drv-col">
            <span className="dm-drv-lb">{L.review}</span>
            <div className="dm-drv-rv" aria-live="polite">
              {messages.length ? messages.map((m, i) => (
                <div key={i} className="dm-drv-m dm-enter">
                  {m.author.agent
                    ? <span className="dm-drv-ag"><Icon name="spark" size="xs" /></span>
                    : <Avatar initials={m.author.initials ?? m.author.name.split(' ').map(w => w[0]).join('').slice(0, 2)} color={m.author.color ?? 'var(--dm-pl)'} />}
                  <div className="dm-drv-mb">
                    <span className="dm-drv-mn">
                      <b>{m.author.name}</b>
                      {m.verdict && (
                        <span className={cx('dm-tag', m.verdict.busy && 'dm-drv-wk', m.verdict.tone && m.verdict.tone !== 'neutral' && 'dm-' + m.verdict.tone)}>
                          {m.verdict.busy ? <Spin /> : m.verdict.icon && <Icon name={m.verdict.icon} size="xs" />}{m.verdict.label}
                        </span>
                      )}
                    </span>
                    {m.text && <p key={m.text} {...enter()}>{m.text}</p>}
                  </div>
                </div>
              )) : <span className="dm-muted dm-drv-wt">{waitingLabel}</span>}
            </div>
          </div>
        </div>
        <div className="dm-drv-f">
          {done ? (
            <span className="dm-drv-done dm-enter"><Icon name={phase === 'scheduled' ? 'clock' : 'ok'} /><span>{doneLabel ?? chosen.label}</span></span>
          ) : <>
            <Swap className="dm-muted dm-drv-st">{note ?? ''}</Swap>
            <div className={cx('dm-drv-mg', !locked && 'dm-enter')}>
              <button type="button" className="dm-pill dm-accent dm-sm dm-drv-go" disabled={locked} onClick={() => onShip?.(chosen)}>
                <Swap>{phase === 'shipping' ? L.shipping : chosen.label}</Swap>
              </button>
              <button type="button" className="dm-pill dm-accent dm-sm dm-drv-dd" aria-label="How it ships" disabled={locked} {...menu.trigger}><Icon name="chev-d" size="xs" /></button>
            </div>
            <div {...menu.pop} className={cx(menu.pop.className, 'dm-drv-pop')} role="menu">
              {options.map(o => (
                <button type="button" key={o.key} className="dm-mi" role="menuitemradio" aria-checked={o.key === chosen.key} onClick={() => { setPick(o.key); menu.closeSoon(); }}>
                  <span>{o.label}{o.detail && <span className="dm-d">{o.detail}</span>}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
                </button>
              ))}
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}
