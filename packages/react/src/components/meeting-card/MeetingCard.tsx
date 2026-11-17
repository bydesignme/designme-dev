'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Brand } from '../../lib/brands';
import { cx } from '../../lib/cx';
import { useCopied } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './meeting-card.css';

export interface MeetingCardProps {
  /** Like "Meeting with Product team" */
  title: string;
  /** When it starts, 24-hour "HH:MM", like "10:30" */
  start: string;
  /** When it ends, like "12:00" */
  end: string;
  /** The time now, like "10:00". The now line sits there, and the countdown and the live state follow it */
  now: string;
  /** Where the track starts. Defaults to half an hour before `start` */
  from?: string;
  /** Where the track ends. Defaults to half an hour after `end` */
  to?: string;
  /** The label inside the meeting's block. Defaults to its length, like "90 min" */
  length?: string;
  /** The line over the title. Defaults to the countdown: "In 30 minutes", "Starting now", "Ended" */
  status?: string;
  /** The call's service, for the join line. Defaults to "Google Meet" */
  provider?: string;
  /** The service's mark. Defaults to the Google Meet mark */
  mark?: ReactNode;
  /** The link shown and copied, like "meet.google.com/nax-wqkf-stu" */
  link: string;
  /** Where joining goes. Defaults to the link over https */
  href?: string;
  /** Called on join. Left out, the link opens in a new tab */
  onJoin?: () => void;
  onCopy?: (url: string) => void;
  /** The copy button's tooltip and name. Defaults to "Copy link" */
  copyLabel?: string;
  /** The tooltip after copying. Defaults to "Copied" */
  copiedLabel?: string;
  className?: string;
}

const mins = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };
const clock = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

/** The next meeting: a countdown, a time track with the meeting on it and a now line creeping toward it, and the call's
    join link with a copy button. At the start time the meeting turns live. */
export function MeetingCard({ title, start, end, now, from, to, length, status, provider = 'Google Meet', mark, link, href, onJoin, onCopy,
  copyLabel = 'Copy link', copiedLabel = 'Copied', className }: MeetingCardProps) {
  const a = mins(start), b = mins(end), t = mins(now);
  const lo = from ? mins(from) : a - 30, hi = to ? mins(to) : b + 30, span = Math.max(1, hi - lo);
  const pc = (m: number) => Math.min(100, Math.max(0, (m - lo) / span * 100));
  const left = a - t, live = t >= a && t < b;
  const text = status ?? (left > 0 ? `In ${left} minute${left === 1 ? '' : 's'}` : t < b ? 'Starting now' : 'Ended');
  // ticks every 15 minutes, the hours a step taller
  const ticks: number[] = [];
  for (let m = Math.ceil(lo / 15) * 15; m <= hi; m += 15) ticks.push(m);
  const url = href ?? 'https://' + link.replace(/^https?:\/\//, '');
  const [copied, copy] = useCopied();
  // joining says so for a moment, the way the site's demo does
  const join = `Join on ${provider}`;
  const [label, setLabel] = useState(join);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => setLabel(join), [join]);
  const go = () => {
    setLabel(`Opening ${provider}`); clearTimeout(timer.current); timer.current = setTimeout(() => setLabel(join), 1600);
    if (onJoin) onJoin(); else window.open(url, '_blank', 'noopener');
  };

  return (
    <div data-dm="" className={cx('dm-mtx dm-panel', live && 'dm-live', className)}>
      <div className="dm-mtx-top">
        <div className="dm-mtx-when"><span className="dm-mtx-dot" /><span className="dm-mtx-in dm-num">{text}</span></div>
        <b className="dm-mtx-t">{title}</b>
        <div className="dm-mtx-track" role="img" aria-label={`Now ${clock(t)}. The meeting runs ${start} to ${end}`}>
          <span className="dm-mtx-ticks">{ticks.map(m => <i key={m} className={m % 60 ? undefined : 'dm-h'} style={{ left: pc(m) + '%' }} />)}</span>
          <span className="dm-mtx-blk" style={{ left: pc(a) + '%', width: pc(b) - pc(a) + '%' }}><span className="dm-num">{length ?? `${b - a} min`}</span></span>
          <span className="dm-mtx-now" style={{ ['--dm-p' as string]: pc(t) + '%' }}><i /></span>
        </div>
        <div className="dm-mtx-axis dm-num" aria-hidden="true">
          <span className="dm-a">{from ?? clock(lo)}</span>
          <span style={{ left: pc(a) + '%' }}>{start}</span>
          <span style={{ left: pc(b) + '%' }}>{end}</span>
          <span className="dm-z">{to ?? clock(hi)}</span>
        </div>
      </div>
      <div className="dm-mtx-join">
        <button type="button" className="dm-mtx-go" onClick={go}>
          <span className="dm-mtx-mk">{mark ?? <Brand name="meet" />}</span>
          <span className="dm-mtx-gt"><b><Swap>{label}</Swap></b><span className="dm-mtx-url">{link}</span></span>
          <span className="dm-mtx-ar"><Icon name="right" /></span>
        </button>
        <Tip label={copied ? copiedLabel : copyLabel} open={copied || undefined}>
          <button type="button" className={cx('dm-ib dm-mtx-cp', copied && 'dm-copied')} aria-label={copyLabel} onClick={() => { copy(url); onCopy?.(url); }}>
            <Icon name={copied ? 'check' : 'copy'} />
          </button>
        </Tip>
      </div>
    </div>
  );
}
