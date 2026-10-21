'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Icon, type IconName } from '../../lib/icons';
import { Avatar, Dot, Think, Tip } from '../../lib/motion';
import '../../designme.css';
import './tooltip.css';

export interface TooltipTool {
  key: string;
  icon: IconName;
  /** The button's name, read out by screen readers */
  label: string;
  /** The tooltip, when it should say more than the name, like "Ask the agent". Defaults to the label */
  tip?: string;
  /** A shortcut shown after the tip, like "⌘Z" */
  kbd?: string;
  onClick?: () => void;
}

export interface TooltipPerson {
  key: string;
  initials: string;
  /** The avatar's colour, like 'var(--dm-pl)' */
  color: string;
  name: string;
  /** The quiet line under the name, like "Design lead" */
  role: string;
  /** What they are doing now, like "Editing Pricing, frame 2" */
  status: string;
  /** Shows the agent's thinking dots instead of the green dot */
  working?: boolean;
}

export interface TooltipProps {
  /** The toolbar's buttons, in groups with a line between them */
  groups?: TooltipTool[][];
  /** Avatars at the end of the toolbar. Hovering one shows a card about the person */
  people?: TooltipPerson[];
  /** A quiet line under the toolbar */
  note?: ReactNode;
  /** How long the person card waits before it shows */
  cardDelay?: number;
  /** Shows this tool's tip, by key, as if it were hovered. Leave it out to let the pointer decide */
  openTip?: string | null;
  /** Shows this person's card, by key, as if they were hovered. Leave it out to let the pointer decide */
  openCard?: string | null;
  className?: string;
}

const DEFAULT_GROUPS: TooltipTool[][] = [
  [{ key: 'undo', icon: 'undo', label: 'Undo', kbd: '⌘Z' }, { key: 'comment', icon: 'edit', label: 'Comment', kbd: 'C' }, { key: 'ask', icon: 'spark', label: 'Ask agent', tip: 'Ask the agent', kbd: '⌘J' }],
  [{ key: 'share', icon: 'users', label: 'Share', tip: 'Share with your team' }]
];

/** A toolbar whose labels wait a moment, then follow you instantly between buttons, with a richer card for people. */
export function Tooltip({ groups = DEFAULT_GROUPS, people = [], note, cardDelay = 300, openTip, openCard, className }: TooltipProps) {
  const root = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // the card keeps its last person while it fades out
  const [card, setCard] = useState<{ person: TooltipPerson; left: number; top: number } | null>(null);
  const [show, setShow] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);

  const open = (person: TooltipPerson, el: HTMLElement, now = false) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      const box = root.current; if (!box) return;
      const rr = box.getBoundingClientRect(), br = el.getBoundingClientRect();
      // centred under the avatar, kept inside the component
      const left = Math.max(0, Math.min(br.left - rr.left + br.width / 2 - 115, rr.width - 230));
      setCard({ person, left, top: br.bottom - rr.top + 10 }); setShow(true);
    }, now ? 0 : cardDelay);
  };
  const close = () => { clearTimeout(timer.current); setShow(false); };
  // a card asked for by key opens at once under its avatar, and closes when the key is cleared
  const avatars = useRef(new Map<string, HTMLButtonElement>());
  useEffect(() => {
    if (openCard === undefined) return;
    const person = people.find(x => x.key === openCard), el = person && avatars.current.get(person.key);
    if (person && el) open(person, el, true); else close();
  }, [openCard]); // eslint-disable-line react-hooks/exhaustive-deps

  const p = card?.person;
  return (
    <div data-dm="" ref={root} className={cx('dm-ttp', className)}>
      <div className="dm-ttp-bar dm-panel">
        {groups.map((g, i) => [
          i > 0 && <span key={'s' + i} className="dm-ttp-sep" />,
          ...g.map(t => (
            <Tip key={t.key} label={t.tip ?? t.label} kbd={t.kbd} open={openTip === t.key || undefined}>
              <button type="button" className="dm-ib" aria-label={t.label} onClick={t.onClick}><Icon name={t.icon} /></button>
            </Tip>
          ))
        ])}
        {people.length > 0 && <>
          <span className="dm-ttp-sep" />
          <span className="dm-ttp-avs">
            {people.map(person => (
              <button key={person.key} ref={el => { if (el) avatars.current.set(person.key, el); else avatars.current.delete(person.key); }} type="button" className="dm-ttp-av" aria-label={person.name}
                onMouseEnter={e => open(person, e.currentTarget)} onMouseLeave={close}
                onFocus={e => { if (e.currentTarget.matches(':focus-visible')) open(person, e.currentTarget, true); }} onBlur={close}>
                <Avatar initials={person.initials} color={person.color} />
              </button>
            ))}
          </span>
        </>}
      </div>
      <div className={cx('dm-ttp-card dm-panel', show && 'dm-show')} style={card ? { left: card.left, top: card.top } : undefined} aria-hidden={!show}>
        <div className="dm-ttp-ci">
          {p && <>
            <div className="dm-ttp-ch"><Avatar initials={p.initials} color={p.color} /><div><b>{p.name}</b><span>{p.role}</span></div></div>
            <div className="dm-ttp-cs">{p.working ? <span style={{ display: 'inline-flex', color: 'var(--dm-accent)' }}><Think /></span> : <Dot />}{p.status}</div>
          </>}
        </div>
      </div>
      {note && <p className="dm-muted dm-ttp-n">{note}</p>}
    </div>
  );
}
