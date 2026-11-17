'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Brand } from '../../lib/brands';
import { cx } from '../../lib/cx';
import { useCopied } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { usePopover } from '../../lib/popover';
import { avatarInk, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './meeting-card.css';

export interface MeetingCardAction {
  key: string;
  label: string;
  icon?: IconName;
  /** What the chevron says once it is done, like "Invite sent". Defaults to the label */
  done?: string;
}

const ACTIONS: MeetingCardAction[] = [
  { key: 'invite', label: 'Send invite', icon: 'mail', done: 'Invite sent' },
  { key: 'calendar', label: 'Add to calendar', icon: 'cal', done: 'Added to calendar' },
  { key: 'copy', label: 'Copy invitation', icon: 'copy', done: 'Invitation copied' }
];

export interface MeetingCardPerson {
  /** Like "MK" */
  initials: string;
  /** The avatar's colour, like 'var(--dm-av-l)' */
  color: string;
  /** Shown in the avatar's tooltip and read by screen readers, like "Maya Kim" */
  name: string;
}

export interface MeetingCardProps {
  /** Like "Pricing review" */
  title: string;
  /** The line under the title. Defaults to "Today, 10:30 to 11:15" from `start` and `end` */
  subtitle?: string;
  /** When it starts, 24-hour "HH:MM", like "10:30" */
  start: string;
  /** When it ends, like "11:15" */
  end: string;
  /** The time now, like "10:20". The status chip, the now line and the hatched past all follow it */
  now: string;
  /** Where the track starts. Defaults to half an hour before `start` */
  from?: string;
  /** Where the track ends. Defaults to half an hour after `end` */
  to?: string;
  /** Who is invited, as an avatar stack with each name in a tooltip */
  people?: MeetingCardPerson[];
  /** How many avatars show before a "+N". Defaults to 4 */
  max?: number;
  /** The status chip's text, in place of the countdown: "In 10 min", "Starting now", "Live, 30 min left", "Ended" */
  status?: string;
  /** The call's service, for names and labels. Defaults to "Google Meet" */
  provider?: string;
  /** The service's mark on the Join button. Defaults to the Google Meet mark */
  mark?: ReactNode;
  /** The call's link, like "meet.google.com/nax-wqkf-stu" */
  link: string;
  /** Where joining goes and what is copied. Defaults to the link over https */
  href?: string;
  /** Called on Join. Left out, the link opens in a new tab */
  onJoin?: () => void;
  onCopy?: (url: string) => void;
  /** Defaults to "Join" */
  joinLabel?: string;
  /** The copy button's tooltip. Defaults to "Copy" and the link */
  copyLabel?: string;
  /** The tooltip after copying. Defaults to "Copied" */
  copiedLabel?: string;
  /** The menu under the chevron beside Join. Defaults to Send invite, Add to calendar and Copy invitation; [] hides the chevron */
  actions?: MeetingCardAction[];
  /** Called with the picked action's key. Copy invitation also copies the title, the time and the link */
  onAction?: (key: string) => void;
  className?: string;
}

const mins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
const clock = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

/** The next meeting, from countdown to wrap-up: a status chip that counts down, says "Starting now", then the minutes left,
    and "Ended"; a track with the meeting on it, the time already gone hatched out; the people invited; and Join, which
    stays open while the meeting runs. */
export function MeetingCard({ title, subtitle, start, end, now, from, to, people = [], max = 4, status, provider = 'Google Meet', mark,
  link, href, onJoin, onCopy, joinLabel = 'Join', copyLabel, copiedLabel = 'Copied', actions = ACTIONS, onAction, className }: MeetingCardProps) {
  const a = mins(start), b = mins(end), t = mins(now);
  const lo = from ? mins(from) : a - 30, hi = to ? mins(to) : b + 30, span = Math.max(1, hi - lo);
  const pc = (m: number) => Math.min(100, Math.max(0, (m - lo) / span * 100));
  const phase = t < a ? 'soon' : t === a ? 'start' : t < b ? 'live' : 'done';
  const n = phase === 'soon' ? a - t : b - t;
  const url = href ?? 'https://' + link.replace(/^https?:\/\//, '');
  const [copied, copy] = useCopied();
  // a new state fades in, and within a state only the minutes roll; nothing moves on the first render
  const ready = useRef(false);
  useEffect(() => { ready.current = true; }, []);
  const roll = <span className="dm-mtx-roll dm-num"><i key={n} className={ready.current ? 'dm-in' : undefined}>{n}</i></span>;
  const chip = status ?? null;
  // Join presses with a small settle and says it is opening for a moment
  const [label, setLabel] = useState(joinLabel), [pressed, setPressed] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => setLabel(joinLabel), [joinLabel]);
  const join = () => {
    setPressed(true); setLabel(`Opening ${provider.split(' ').pop()}`);
    timers.current.push(setTimeout(() => setPressed(false), 110), setTimeout(() => setLabel(joinLabel), 1600));
    if (onJoin) onJoin(); else window.open(url, '_blank', 'noopener');
  };
  // the meeting's actions: the chevron flashes a check and its tooltip says what happened
  const menu = usePopover({ align: 'end' });
  const [did, setDid] = useState<string | null>(null);
  const act = (a: MeetingCardAction) => {
    if (a.key === 'copy') { try { navigator.clipboard.writeText(`${title}, ${subtitle ?? `today ${start} to ${end}`}\n${url}`).catch(() => {}); } catch { /* no clipboard */ } }
    onAction?.(a.key); menu.closeSoon();
    timers.current.push(setTimeout(() => setDid(a.done ?? a.label), 140), setTimeout(() => setDid(null), 1640));
  };
  const shown = people.slice(0, max), rest = people.slice(max);
  const live = phase === 'start' || phase === 'live';
  const past = { ['--dm-p' as string]: pc(t) + '%' } as CSSProperties;

  return (
    <div data-dm="" className={cx('dm-mtx dm-panel', live && 'dm-live', phase === 'done' && 'dm-done', className)}>
      <div className="dm-mtx-h">
        <b className="dm-mtx-t">{title}</b><span className="dm-mtx-sub dm-num">{subtitle ?? `Today, ${start} to ${end}`}</span>
        <span className={cx('dm-tag dm-mtx-st', live && 'dm-ok')}>
          <span key={chip ?? phase} className={ready.current ? 'dm-mtx-fade' : undefined}>
            {chip ?? (phase === 'soon' ? <><Icon name="clock" size="xs" />In {roll} min</>
              : phase === 'start' ? <><i className="dm-dot" />Starting now</>
              : phase === 'live' ? <><i className="dm-dot" />Live, {roll} min left</> : 'Ended')}
          </span>
        </span>
      </div>
      <div className="dm-mtx-track" style={past} role="img"
        aria-label={phase === 'done' ? `The meeting ran ${start} to ${end} and has ended` : `Now ${clock(t)}. The meeting runs ${start} to ${end}`}>
        <span className="dm-mtx-blk" style={{ left: pc(a) + '%', width: pc(b) - pc(a) + '%', ['--dm-cut' as string]: Math.min(100, Math.max(0, (t - a) / Math.max(1, b - a) * 100)) + '%' }}>
          <span className="dm-mtx-bp" /><span className="dm-num">{start}</span><span className="dm-num">{end}</span>
        </span>
        <span className="dm-mtx-now"><i /></span>
      </div>
      <div className="dm-mtx-f">
        <div className="dm-mtx-who">
          {shown.map(p => (
            <Tip key={p.name} label={p.name}>
              <span className="dm-av" role="img" aria-label={p.name} style={{ background: p.color, color: avatarInk(p.color) }}>{p.initials}</span>
            </Tip>
          ))}
          {rest.length > 0 && (
            <Tip label={rest.map(p => p.name).join(', ')}>
              <span className="dm-av dm-mtx-more" role="img" aria-label={rest.map(p => p.name).join(', ')}>+{rest.length}</span>
            </Tip>
          )}
        </div>
        <span className="dm-sp" />
        <Tip label={copied ? copiedLabel : copyLabel ?? `Copy ${link}`} open={copied || undefined}>
          <button type="button" className={cx('dm-ib dm-mtx-cp', copied && 'dm-copied')} aria-label={`Copy ${provider} link`} onClick={() => { copy(url); onCopy?.(url); }}>
            <Icon name={copied ? 'check' : 'link'} />
          </button>
        </Tip>
        <div className="dm-mtx-jg">
          <button type="button" className={cx('dm-pill dm-primary dm-mtx-join', pressed && 'dm-prs')} disabled={phase === 'done'} onClick={join}>
            <span className="dm-mk">{mark ?? <Brand name="meet" />}</span><Swap className="dm-lb">{label}</Swap>
          </button>
          {actions.length > 0 && <>
            <Tip label={did ?? ''} open={did ? true : undefined} off={!did}>
              <button type="button" {...menu.trigger} className={cx('dm-pill dm-primary dm-mtx-jm', did && 'dm-done')} aria-label="More for this meeting" disabled={phase === 'done'}>
                <Icon name={did ? 'check' : 'chev-d'} size="xs" />
              </button>
            </Tip>
            <div {...menu.pop} className={cx(menu.pop.className, 'dm-mtx-pop')} role="menu">
              {actions.map(a => (
                <button key={a.key} type="button" role="menuitem" className="dm-mi" onClick={() => act(a)}>{a.icon && <Icon name={a.icon} />}{a.label}</button>
              ))}
            </div>
          </>}
        </div>
      </div>
    </div>
  );
}
