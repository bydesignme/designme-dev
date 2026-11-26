'use client';
// The animated preview from designme.dev, rebuilt from the React component: right-click the reply, ask the agent for a
// summary, and it streams in under the reply.
import { useEffect, useRef, useState } from 'react';
import { ContextMenu, type ContextMenuItem } from '../components/context-menu/ContextMenu';
import { Icon } from '../lib/icons';
import { useGrow } from '../lib/motion';
import { useStory, useWait } from './useScript';

const TEXT = 'Most of the checkout drop-off is on mobile. 61% of the people who leave do it at the address step, where the keyboard covers the Continue button. Moving Continue above the keyboard should win back about 300 orders a week.';
const ASK: Record<string, [string, 'info' | 'list' | 'edit', string]> = {
  explain: ['Explanation', 'info', 'On a phone the keyboard takes the lower half of the screen. The Continue button sits there, so people have to close the keyboard to find it, and many leave instead.'],
  sum: ['Summary', 'list', 'Mobile shoppers drop at the address step because the keyboard hides Continue. Moving it up could win back about 300 orders a week.'],
  rewrite: ['Shorter', 'edit', 'Mobile checkout loses people at the address step: the keyboard hides Continue. Move it up to win back about 300 orders a week.']
};

export default function ContextMenuDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [follow, setFollow] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [deleted, setDeleted] = useState(false);
  // what an action did: said to screen readers, and shown for a moment on the reply's head line with a green tick (a pin shows
  // its own Pinned, Ask the agent its answer)
  const [note, setNote] = useState('');
  const [ok, setOk] = useState<{ text: string; out: boolean } | null>(null);
  const confirm = (t: string) => { setNote(t); setOk({ text: t, out: false }); };
  useEffect(() => {
    if (!ok) return;
    const t = setTimeout(() => ok.out ? setOk(null) : setOk({ ...ok, out: true }), ok.out ? 240 : 2400);
    return () => clearTimeout(t);
  }, [ok]);
  // the card grows to hold what the agent writes, and shrinks to the Undo row, eased
  const [box, boxIn] = useGrow();
  const [out, setOut] = useState<{ k: string; text: string; busy: boolean } | null>(null);
  const run = useRef(0);
  const items: ContextMenuItem[] = [
    { key: 'copy', label: 'Copy text', icon: 'copy', shortcut: '⌘C' },
    { key: 'quote', label: 'Quote in reply', icon: 'quote', shortcut: 'R' },
    { key: 'pin', label: pinned ? 'Unpin' : 'Pin to thread', icon: 'pin', shortcut: 'P' },
    { key: 'ask', label: 'Ask the agent', icon: 'spark', separator: true, items: [
      { key: 'explain', label: 'Explain', icon: 'info' }, { key: 'sum', label: 'Summarise', icon: 'list' }, { key: 'rewrite', label: 'Rewrite shorter', icon: 'edit' }] },
    { key: 'follow', label: 'Follow replies', icon: 'bell', checked: follow },
    { key: 'del', label: 'Delete reply', icon: 'trash', shortcut: '⌫', danger: true, confirmLabel: 'Press again to delete', separator: true }
  ];
  const ask = async (k: string) => {
    const id = ++run.current, text = ASK[k][2].split(' ');
    setOut({ k, text: '', busy: true }); await wait(900);
    for (let i = 1; i <= text.length && id === run.current; i++) { setOut({ k, text: text.slice(0, i).join(' '), busy: false }); await wait(55); }
  };
  const select = (k: string) => {
    if (k === 'copy') { navigator.clipboard?.writeText(TEXT).catch(() => {}); confirm('Copied'); }
    if (k === 'quote') confirm('Quoted in your reply');
    if (k === 'pin') { setPinned(p => !p); setNote(pinned ? 'Unpinned' : 'Pinned to the thread'); setOk(null); }
    if (k === 'follow') { setFollow(f => !f); confirm(follow ? 'Not following replies' : 'Following replies'); }
    if (k === 'del') { setDeleted(true); setNote('Reply deleted'); setOk(null); }
    if (ASK[k]) { setOk(null); void ask(k); }
  };
  // the preview's story: right-click the reply, open Ask the agent, pick Summarise
  useStory(ref, async ({ wait, press }) => {
    await wait(1500);
    const p = ref.current?.querySelector('.dm-cxm-tx'); if (!p) return;
    const b = p.getBoundingClientRect();
    p.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true, clientX: b.left + b.width * .62, clientY: b.top + b.height * .58 }));
    await wait(1000); press('.dm-cxm-sub');
    await wait(1000); press('.dm-cxm-pop2 [data-k="sum"]');
  });
  return (
    <div ref={el => { ref.current = el; box.current = el; }} data-dm="" className="dm-growing" style={{ width: '100%', overflow: 'visible' }}><div ref={boxIn} className="dm-grow">
      {deleted
        ? <div className="dm-cxm" data-dm=""><div className="dm-cxm-gone dm-enter">Reply deleted<button type="button" className="dm-pill dm-ghost dm-sm" onClick={() => { setDeleted(false); setNote('Reply restored'); }}>Undo</button></div></div>
        : <ContextMenu items={items} onSelect={select} label="Reply actions" targetLabel="Agent reply. Press Shift+F10 for actions">
            <div className="dm-cxm-hd"><span className="dm-cxm-av"><Icon name="spark" /></span><span className="dm-cxm-ht"><b>Agent</b><span className="dm-muted dm-num">2:14 pm</span></span>{ok && <span className={ok.out ? 'dm-cxm-ok dm-out' : 'dm-cxm-ok'}><Icon name="check" size="xs" /><span>{ok.text}</span></span>}{pinned && <span className="dm-cxm-pin"><Icon name="pin" />Pinned</span>}</div>
            <p className="dm-cxm-tx">{TEXT}</p>
            <div className="dm-cxm-out" aria-live="polite">{out && <div className="dm-cxm-res dm-enter"><span className="dm-k"><Icon name={ASK[out.k][1]} size="xs" /><span className={out.busy ? 'dm-shim' : undefined}>{out.busy ? `Writing a ${ASK[out.k][0].toLowerCase()}` : ASK[out.k][0]}</span></span><span>{out.text}</span></div>}</div>
          </ContextMenu>}
      <p className="dm-cxm-note" data-dm="" aria-live="polite">{note}</p>
    </div></div>
  );
}
