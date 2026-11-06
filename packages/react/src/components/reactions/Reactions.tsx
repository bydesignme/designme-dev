'use client';
import { useEffect, useRef, useState, type AnimationEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './reactions.css';

export interface ReactionsItem {
  emoji: string;
  /** How many people reacted with it, you included */
  count: number;
  /** Who else reacted, for the tooltip, like ['Maya', 'Jon'] */
  people?: string[];
  /** Whether you reacted with it. Your reactions are tinted and their count is accent coloured */
  mine?: boolean;
}

export interface ReactionsProps {
  /** Who wrote the message, like "Design agent" */
  author: ReactNode;
  /** When, like "10:42" */
  time?: ReactNode;
  /** The message being reacted to */
  message: ReactNode;
  /** The icon on the author's square */
  icon?: IconName;
  /** The reactions under the message. Leave it out to let clicks and the picker change them */
  reactions?: ReactionsItem[];
  defaultReactions?: ReactionsItem[];
  onReactionsChange?: (reactions: ReactionsItem[]) => void;
  /** The emoji in the picker */
  emojis?: string[];
  /** How you are named in the tooltips */
  meLabel?: string;
  /** The add button's tooltip */
  addLabel?: string;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const EMOJIS = ['👍', '❤️', '🎉', '🚀', '👀', '✅', '🔥', '💯', '🙌', '🤔', '✨', '👏'];

/** "You, Maya, Jon and 2 more" */
const whoOf = (r: ReactionsItem, me: string) => {
  const who = r.mine ? [me, ...(r.people ?? [])] : r.people ?? [];
  return who.slice(0, 3).join(', ') + (who.length > 3 ? ` and ${who.length - 3} more` : '');
};

/** A reaction on screen: the latest data, or the last data of one that is fading out */
interface Shown { item: ReactionsItem; leaving: boolean }

/** Keeps a removed reaction in its place while it fades and shrinks, then lets it go */
function useLeaving(items: ReactionsItem[], ms: number) {
  const [shown, setShown] = useState<Shown[]>(() => items.map(item => ({ item, leaving: false })));
  const [prev, setPrev] = useState(items);
  if (prev !== items) {
    setPrev(items);
    const now = new Set(items.map(r => r.emoji));
    const next: Shown[] = items.map(item => ({ item, leaving: false }));
    shown.forEach((s, i) => { if (!now.has(s.item.emoji)) next.splice(Math.min(i, next.length), 0, { item: s.item, leaving: true }); });
    setShown(next);
  }
  const leaving = shown.filter(s => s.leaving).map(s => s.item.emoji).join('\u0000');
  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(() => setShown(list => list.filter(s => !s.leaving)), ms);
    return () => clearTimeout(t);
  }, [leaving, ms]);
  return shown;
}

function Reaction({ item, leaving, fresh, pulse, me, onToggle }: { item: ReactionsItem; leaving: boolean; fresh: boolean; pulse: number; me: string; onToggle: () => void }) {
  const ref = useRef<HTMLButtonElement>(null);
  const [isNew, setNew] = useState(fresh);
  // the count rolls up or down instead of the whole row re-rendering under the pointer
  const [nums, setNums] = useState([{ k: 0, v: item.count, c: '' }]);
  const last = useRef(item.count);
  useEffect(() => {
    if (item.count === last.current || leaving) return;
    const up = item.count > last.current; last.current = item.count;
    setNums(ns => { const top = ns[ns.length - 1]; return [{ ...top, c: up ? 'dm-ou' : 'dm-od' }, { k: top.k + 1, v: item.count, c: up ? 'dm-iu' : 'dm-id' }]; });
    const t = setTimeout(() => setNums(ns => ns.slice(-1)), 380);
    return () => clearTimeout(t);
  }, [item.count, leaving]);

  // a ring and a little jump when you react, or pick one you already have
  const [bumped, setBumped] = useState(false);
  const bump = () => {
    const el = ref.current;
    if (!el || !el.classList.contains('dm-bump')) { setBumped(true); return; }
    el.classList.remove('dm-bump'); void el.offsetWidth; el.classList.add('dm-bump');
  };
  const wasMine = useRef(!!item.mine);
  useEffect(() => {
    const mine = !!item.mine;
    if (mine && !wasMine.current && !leaving) bump();
    wasMine.current = mine;
  }, [item.mine, leaving]);
  useEffect(() => { if (pulse) bump(); }, [pulse]);
  useEffect(() => { if (fresh && item.mine) bump(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Tip label={whoOf(item, me)} off={leaving}>
      <button type="button" ref={ref} className={cx('dm-rxx-r', item.mine && 'dm-me', isNew && 'dm-new', bumped && 'dm-bump', leaving && 'dm-gone')}
        aria-pressed={!!item.mine} onClick={leaving ? undefined : onToggle}
        onAnimationEnd={(e: AnimationEvent) => { if (e.target === e.currentTarget && e.animationName.endsWith('popin')) setNew(false); }}>
        <span className="dm-e">{item.emoji}</span>
        <span className="dm-n dm-num">{nums.map(n => <i key={n.k} className={n.c || undefined}>{n.v}</i>)}</span>
      </button>
    </Tip>
  );
}

/** Quick reactions on an agent update, with counts that pop. */
export function Reactions({ author, time, message, icon = 'spark', reactions, defaultReactions = [], onReactionsChange, emojis = EMOJIS, meLabel = 'You', addLabel = 'Add reaction', bare = true, className }: ReactionsProps) {
  const [list, setList] = useControllable(reactions, defaultReactions, onReactionsChange);
  const shown = useLeaving(list, 320);
  const menu = usePopover();
  // reactions that arrive after the first render pop in
  const [initial] = useState(() => new Set(list.map(r => r.emoji)));
  const [pulses, setPulses] = useState<Record<string, number>>({});

  const toggle = (emoji: string) => setList(list.flatMap(r => {
    if (r.emoji !== emoji) return [r];
    const mine = !r.mine, count = r.count + (mine ? 1 : -1);
    return count > 0 ? [{ ...r, mine, count }] : [];
  }));
  const pick = (emoji: string) => {
    const had = list.find(r => r.emoji === emoji);
    if (!had) setList([...list, { emoji, count: 1, people: [], mine: true }]);
    else if (!had.mine) toggle(emoji);
    else setPulses(p => ({ ...p, [emoji]: (p[emoji] ?? 0) + 1 }));
    menu.closeSoon();
  };

  return (
    <div data-dm="" className={cx('dm-rxx', !bare && 'dm-panel', className)}>
      <div className="dm-rxx-m">
        <span className="dm-rxx-ic"><Icon name={icon} size="xs" /></span>
        <div className="dm-rxx-b">
          <span className="dm-rxx-n"><b>{author}</b>{time && <span className="dm-muted">{time}</span>}</span>
          <p>{message}</p>
        </div>
      </div>
      <div className="dm-rxx-row">
        <div className="dm-rxx-list">
          {shown.map(({ item, leaving }) => (
            <Reaction key={item.emoji} item={item} leaving={leaving} fresh={!initial.has(item.emoji)} pulse={pulses[item.emoji] ?? 0} me={meLabel} onToggle={() => toggle(item.emoji)} />
          ))}
        </div>
        <Tip label={addLabel} off={menu.open}>
          <button type="button" className="dm-rxx-add" aria-label={addLabel} {...menu.trigger}><Icon name="smile" size="xs" /></button>
        </Tip>
      </div>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-rxx-pk')} role="menu" aria-label={addLabel}>
        <div className="dm-rxx-grid">
          {emojis.map(e => <button type="button" key={e} role="menuitem" onClick={() => pick(e)}>{e}</button>)}
        </div>
      </div>
    </div>
  );
}
