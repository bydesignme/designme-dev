'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { Notifications, type NotificationsItem } from '../components/notifications/Notifications';
import { useStory } from './useScript';

/* ---------- Notifications: an inbox where two new items arrive while you watch ---------- */
const START: NotificationsItem[] = [
  { id: 'audit', kind: 'agent', icon: 'ok', color: 'var(--dm-ok)', text: <><b>Pricing audit</b> finished. 2 fixes ready to review</>, time: '4 min ago' },
  { id: 'maya', kind: 'mention', avatar: { initials: 'MK', color: 'var(--dm-av-l)' }, text: <><b>Maya</b> mentioned you in Checkout flow</>, time: '20 min ago' },
  { id: 'export', kind: 'agent', icon: 'alert', color: 'var(--dm-warn)', text: <><b>Token export</b> paused at the $5 cap</>, time: '1 hour ago' },
  { id: 'jon', kind: 'mention', avatar: { initials: 'JO', color: 'var(--dm-av-m)' }, text: <><b>Jon</b> asked for your review on PR #284</>, time: '2 hours ago', read: true }
];
const INCOMING: NotificationsItem[] = [
  { id: 'qa', kind: 'agent', icon: 'spark', color: 'var(--dm-accent)', text: <><b>Weekly design QA</b> started on 12 frames</>, time: 'Just now' },
  { id: 'ari', kind: 'mention', avatar: { initials: 'AR', color: 'var(--dm-av-p)' }, text: <><b>Ari</b> replied: “Looks great, ship it”</>, time: 'Just now' }
];

export default function NotificationsDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState(START);
  // two items arrive while you watch; your first click or key in the inbox stops them, so a filter you picked or a
  // Mark all read stays as you left it
  useStory(ref, async ({ wait }) => {
    await wait(2200);
    for (const x of INCOMING) { setItems(xs => [x, ...xs]); await wait(2600); }
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Notifications items={items} onItemsChange={setItems} />
    </div>
  );
}
