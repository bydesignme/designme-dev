'use client';
import { useEffect, useRef, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import '../../designme.css';
import './action-cards.css';

/** What a card's picture shows: the teams whose commits come in, the deals whose close dates move, or the accounts whose drafts go out */
export type ActionCardPicture =
  | { kind: 'commit'; teams: string[] }
  | { kind: 'dates'; moves: { name: string; was: string; to: string }[] }
  | { kind: 'follow'; accounts: string[] };

export interface ActionCard {
  id: string;
  /** Like "Submit the Q4 commit" */
  title: string;
  /** The muted line under it, like "5 reps to go, due Friday." */
  detail: string;
  /** The button's label, like "Review commit" */
  action: string;
  onAction?: () => void;
  picture: ActionCardPicture;
}

export interface ActionCardsProps {
  /** The cards, three across from 900px wide. Defaults to the Sales CRM forecast's three */
  cards?: ActionCard[];
  className?: string;
}

export const ACTION_CARDS: ActionCard[] = [
  { id: 'commit', title: 'Submit the Q4 commit', detail: '5 reps to go, due Friday.', action: 'Review commit', picture: { kind: 'commit', teams: ['Key accounts', 'Growth', 'New business'] } },
  { id: 'dates', title: 'Move 4 close dates', detail: 'New dates are ready to be approved.', action: 'Review dates', picture: { kind: 'dates', moves: [
    { name: 'Renewal', was: 'Nov 25', to: 'Dec 9' }, { name: 'Renewal', was: 'Nov 23', to: 'Dec 11' }, { name: 'Studio seats', was: 'Nov 20', to: 'Dec 15' }, { name: 'Pilot', was: 'Nov 17', to: 'Dec 17' }] } },
  { id: 'follow', title: 'Send 4 follow-ups', detail: 'Drafts are ready to send. Review them.', action: 'Review drafts', picture: { kind: 'follow', accounts: ['Saltmarsh Foods', 'Moss & Ember', 'Marrow & Finch', 'Arbor & Vine'] } }
];

// each picture's pace, by its place in the row: how long an item stays, how long the list takes to move on, how late it starts
const PACE = [{ step: 3600, mv: 700, at: 0 }, { step: 3000, mv: 600, at: 700 }, { step: 4200, mv: 800, at: 1400 }];
const Tick = () => <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" /></svg>;

/** The picture's items, each one a window when it's in focus */
function items(p: ActionCardPicture): ReactNode[] {
  if (p.kind === 'commit') return p.teams.map((t, i) => (
    <><span className="dm-axc-t">{t}</span>{[0, 1].map(r => <span key={r} className="dm-axc-r"><span className="dm-axc-l" style={{ width: [[60, 44], [52, 38], [56, 46]][i % 3][r] + '%' }} /><span className={cx('dm-axc-m', !r && 'dm-in')} data-go={r ? '' : undefined}><Tick /></span></span>)}</>));
  if (p.kind === 'dates') return p.moves.map(m => (
    <><span className="dm-axc-r"><span className="dm-axc-i" style={{ ['--dm-a' as string]: 'var(--dm-av-r)', ['--dm-ai' as string]: 'var(--dm-av-r-ink)' }}><Icon name="cal" size="xs" /></span><span className="dm-axc-n">{m.name}</span></span>
      <span className="dm-axc-d"><s className="dm-num">{m.was}</s><Icon name="right" size="xs" /><span className="dm-tag dm-axc-g dm-num" data-go="">{m.to}</span></span><span className="dm-axc-l" style={{ width: '72%' }} /></>));
  return p.accounts.map((a, i) => (
    <><span className="dm-axc-r"><span className="dm-axc-i" style={{ ['--dm-a' as string]: 'var(--dm-av-b)', ['--dm-ai' as string]: 'var(--dm-av-b-ink)' }}><Icon name="mail" size="xs" /></span><span className="dm-axc-n">{a}</span></span>
      <span className="dm-axc-l" style={{ width: [88, 76, 82, 70][i % 4] + '%' }} /><span className="dm-axc-r"><span className="dm-tag dm-axc-g dm-dr" data-go=""><Icon name="spark" size="xs" /><span className="dm-sw"><span className="dm-a">Drafted</span><span className="dm-b">Sent</span></span></span></span></>));
}

function Card({ card, pace, held }: { card: ActionCard; pace: (typeof PACE)[number]; held: { current: boolean } }) {
  const vis = useRef<HTMLDivElement>(null), track = useRef<HTMLDivElement>(null), cur = useRef<SVGSVGElement>(null);
  const reduce = useReducedMotion();
  const list = items(card.picture), n = list.length;
  // the track: the last item first (the slip above), the list, then its first two again so the loop can wrap unseen
  const seq = n ? [list[n - 1], ...list, list[0], list[1 % n]] : [];
  useEffect(() => {
    const v = vis.current, k = track.current, c = cur.current; if (!v || !k || !c || !n) return;
    const W = [...k.children] as HTMLElement[];
    let i = 1, alive = true;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const place = (idx: number, anim: boolean) => { k.classList.toggle('dm-mv', anim); const it = W[idx]; k.style.transform = `translateY(${Math.round((v.clientHeight - it.offsetHeight) / 2 - it.offsetTop)}px)`;
      W.forEach((x, m) => x.classList.toggle('dm-on', m === idx)); };
    place(i, false);
    const ro = new ResizeObserver(() => place(i, false)); ro.observe(v);
    // a wait that only counts while no mouse rests on the cards
    const wait = (ms: number) => new Promise<void>(res => { let left = ms, last = performance.now();
      const t = () => { if (!alive) return; const now = performance.now(); if (!held.current) left -= now - last; last = now; if (left <= 0) res(); else timers.push(setTimeout(t, 50)); };
      timers.push(setTimeout(t, 50)); });
    const at = (el: Element) => { const a = v.getBoundingClientRect(), b = el.getBoundingClientRect(); return [b.left - a.left + b.width * .55, b.top - a.top + b.height * .5]; };
    const run = async () => {
      await wait(pace.at + 900);
      while (alive) {
        const go = W[i].querySelector('[data-go]');
        if (go) {
          const [x, y] = at(go);
          c.classList.remove('dm-press'); c.style.transition = 'none'; c.style.transform = `translate(${x + 34}px,${y + 26}px)`; void c.getBoundingClientRect(); c.style.transition = '';
          c.style.opacity = '1'; c.style.transform = `translate(${x}px,${y}px)`;
          await wait(700); if (!alive) return;
          c.classList.add('dm-press'); c.style.transform = `translate(${x}px,${y}px) scale(.8)`;
          await wait(140); if (!alive) return;
          c.style.transform = `translate(${x}px,${y}px)`; go.classList.add(go.classList.contains('dm-axc-m') ? 'dm-in' : 'dm-ok');
          await wait(520); if (!alive) return;
          c.classList.remove('dm-press'); c.style.opacity = '0'; c.style.transform = `translate(${x + 18}px,${y + 14}px)`;
        }
        await wait(Math.max(300, pace.step - 1700)); if (!alive) return;
        // scroll up to the next item; past the end, jump back unseen to the same item at the start, all fresh again
        i++; place(i, true);
        await wait(pace.mv + 60); if (!alive) return;
        if (i === n + 1) { i = 1; W.forEach(x => x.querySelectorAll('[data-go]').forEach(g => g.classList.remove('dm-in', 'dm-ok'))); place(i, false); }
      }
    };
    if (!reduce) run();
    return () => { alive = false; timers.forEach(clearTimeout); ro.disconnect(); };
  }, [n, reduce, pace, held]);
  return (
    <div className="dm-panel dm-axc-c" data-ax={card.id}>
      <div className="dm-axc-tx"><b>{card.title}</b><p>{card.detail}</p><button type="button" className="dm-pill dm-line dm-sm" onClick={card.onAction}>{card.action}</button></div>
      <div ref={vis} className="dm-axc-v" aria-hidden="true">
        <div ref={track} className="dm-axc-k" style={{ ['--dm-ax-mv' as string]: pace.mv + 'ms' }}>{seq.map((x, j) => <div key={j} className="dm-axc-w">{x}</div>)}</div>
        <svg ref={cur} className="dm-axc-cur" viewBox="0 0 20 20" aria-hidden="true"><path d="M4 2.5l12 6.2-5.3 1.5-2.4 5.1z" /></svg>
      </div>
    </div>
  );
}

/** What is waiting on a person, as a row of cards, each with its button and a small looping picture of what it opens, from
    the Sales CRM template's forecast. A mouse resting on the cards holds the pictures; with reduced motion they stay still */
export function ActionCards({ cards = ACTION_CARDS, className }: ActionCardsProps) {
  const held = useRef(false);
  return (
    <div className={cx('dm-axc', className)} data-dm="" onPointerEnter={e => { if (e.pointerType === 'mouse') held.current = true; }} onPointerLeave={() => { held.current = false; }}>
      <div className="dm-axc-row">{cards.map((c, i) => <Card key={c.id} card={c} pace={PACE[i % PACE.length]} held={held} />)}</div>
    </div>
  );
}
