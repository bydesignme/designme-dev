'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Avatar, Dot, Think, Tip } from '../../lib/motion';
import { useHoverGlide } from '../../lib/glide';
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
  /** The avatar's colour, like 'var(--dm-av-l)' */
  color: string;
  name: string;
  /** The quiet line under the name, like "Design lead" */
  role: string;
  /** What they are doing now, like "Editing Pricing, frame 2" */
  status: string;
  /** Shows the agent's thinking dots instead of the green dot, and the status shimmers as loader text does */
  working?: boolean;
}

export interface TooltipProps {
  /** The toolbar's buttons, in groups with a line between them */
  groups?: TooltipTool[][];
  /** Avatars at the end of the toolbar, side by side. Hovering one shows a card about the person */
  people?: TooltipPerson[];
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
export function Tooltip({ groups = DEFAULT_GROUPS, people = [], cardDelay = 300, openTip, openCard, className }: TooltipProps) {
  const root = useRef<HTMLDivElement>(null), box = useRef<HTMLDivElement>(null);
  // Clean's one hover: a highlight that glides from button to button
  const barRef = useRef<HTMLDivElement>(null);
  useHoverGlide(barRef, '.dm-ib,.dm-ttp-av');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  // the card keeps its last person while it fades out
  const [card, setCard] = useState<{ person: TooltipPerson; el: HTMLElement } | null>(null);
  const [show, setShow] = useState(false);
  useEffect(() => () => clearTimeout(timer.current), []);

  const open = (person: TooltipPerson, el: HTMLElement, now = false) => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => { setCard({ person, el }); setShow(true); }, now ? 0 : cardDelay);
  };
  const close = () => { clearTimeout(timer.current); setShow(false); };
  // the card sits under its avatar, or over it when there is no room below; centred on it, or right-aligned to it (left-aligned
  // on the left) at the window's edge. While it shows it goes where its avatar goes, so a toolbar that moves carries it along
  useIsoLayoutEffect(() => {
    if (!show || !card) return;
    let raf = 0, at = '';
    const place = () => {
      const r = root.current, c = box.current; if (!r || !c) return;
      const rr = r.getBoundingClientRect(), br = card.el.getBoundingClientRect(), w = c.offsetWidth, h = c.offsetHeight;
      let x = br.left + br.width / 2 - w / 2;
      if (x + w > innerWidth - 8) x = Math.max(8, br.right - w); else if (x < 8) x = Math.min(innerWidth - 8 - w, br.left);
      const down = br.bottom + 10 + h <= innerHeight - 8 || br.top - 10 - h < 8;
      c.classList.toggle('dm-up', !down);
      c.style.left = Math.round(x - rr.left) + 'px'; c.style.top = Math.round((down ? br.bottom + 10 : br.top - 10 - h) - rr.top) + 'px';
    };
    const follow = () => { const b = card.el.getBoundingClientRect(), k = `${b.left},${b.top}`; if (k !== at) { at = k; place(); } raf = requestAnimationFrame(follow); };
    follow();
    return () => cancelAnimationFrame(raf);
  }, [show, card]);
  // the avatar under the pointer: a card opened from code and then let go stays while the pointer is on its avatar
  const hovered = useRef<string | null>(null);
  // a card asked for by key opens at once under its avatar, and closes when the key is cleared
  const avatars = useRef(new Map<string, HTMLButtonElement>());
  useEffect(() => {
    if (openCard === undefined) return;
    const person = people.find(x => x.key === openCard), el = person && avatars.current.get(person.key);
    if (person && el) open(person, el, true); else if (!hovered.current) close();
  }, [openCard]); // eslint-disable-line react-hooks/exhaustive-deps

  const p = card?.person;
  return (
    <div data-dm="" ref={root} className={cx('dm-ttp', className)}>
      <div ref={barRef} className="dm-ttp-bar dm-panel">
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
                onMouseEnter={e => { hovered.current = person.key; open(person, e.currentTarget); }} onMouseLeave={() => { hovered.current = null; close(); }}
                onFocus={e => { if (e.currentTarget.matches(':focus-visible')) open(person, e.currentTarget, true); }} onBlur={close}>
                <Avatar initials={person.initials} color={person.color} />
              </button>
            ))}
          </span>
        </>}
      </div>
      <div ref={box} className={cx('dm-ttp-card dm-panel', show && 'dm-show')} aria-hidden={!show}>
        <div className="dm-ttp-ci">
          {p && <>
            <div className="dm-ttp-ch"><Avatar initials={p.initials} color={p.color} /><div><b>{p.name}</b><span>{p.role}</span></div></div>
            <div className="dm-ttp-cs">{p.working ? <><span style={{ display: 'inline-flex', color: 'var(--dm-accent-mark, var(--dm-accent))' }}><Think /></span><span className="dm-shim">{p.status}</span></> : <><Dot />{p.status}</>}</div>
          </>}
        </div>
      </div>
    </div>
  );
}
