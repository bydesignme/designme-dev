'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState, type ReactNode } from 'react';
import { Badge, type BadgeTone } from '../components/badge/Badge';
import { useStory } from './useScript';

const ENVS: { label: string; tone: BadgeTone }[] = [{ label: 'Production', tone: 'warning' }, { label: 'Staging', tone: 'blue' }, { label: 'Preview', tone: 'violet' }];

/* ---------- Badge: every tone, both sizes, a dot or an icon, and removable ones; Staging is taken off, then put back ---------- */
export default function BadgeDemo() {
  const ref = useRef<HTMLDivElement>(null);
  // the removable badges still showing, and the ones taken off, the latest last
  const [shown, setShown] = useState(ENVS.map(e => e.label));
  const [gone, setGone] = useState<string[]>([]);
  const [said, setSaid] = useState('');
  const remove = (label: string) => { setShown(s => s.filter(x => x !== label)); setGone(g => [...g, label]); setSaid(`Removed ${label}`); };
  const undo = () => {
    const last = gone[gone.length - 1]; if (!last) return;
    setGone(g => g.slice(0, -1)); setShown(s => ENVS.map(e => e.label).filter(x => x === last || s.includes(x))); setSaid(`${last} is back`);
  };
  const undoRef = useRef(undo); undoRef.current = undo;
  // the story stops at the visitor's first click or key, so it never removes a badge they meant to keep
  useStory(ref, async ({ wait }) => {
    await wait(2000); remove('Staging');
    await wait(2000); undoRef.current();
  });
  const row = (label: string, children: ReactNode) => <div className="dm-bdx-row"><span className="dm-bdx-l dm-muted">{label}</span><div className="dm-bdx-set">{children}</div></div>;
  return (
    <div ref={ref} data-dm="" className="dm-bdx">
      {row('Tones', <><Badge>Draft</Badge><Badge tone="accent">Beta</Badge><Badge tone="success">Live</Badge><Badge tone="warning">Degraded</Badge><Badge tone="danger">Failed</Badge></>)}
      {row('Colours', <><Badge tone="blue">Search</Badge><Badge tone="violet">Reasoning</Badge><Badge tone="green">Data</Badge><Badge tone="orange">Billing</Badge>
        <Badge tone="red">Urgent</Badge><Badge tone="yellow">Review</Badge><Badge tone="pink">Design</Badge><Badge tone="teal">Ops</Badge></>)}
      {row('Sizes', <><Badge size="sm" tone="accent">Pro</Badge><Badge tone="accent">Pro</Badge></>)}
      {row('Dot or icon', <><Badge tone="success" dot>Running</Badge><Badge dot>Idle</Badge><Badge icon="lock">Private</Badge><Badge tone="accent" icon="spark">Agent</Badge></>)}
      {row('Removable', <>
        {ENVS.filter(e => shown.includes(e.label)).map(e => <Badge key={e.label} tone={e.tone} onRemove={() => remove(e.label)}>{e.label}</Badge>)}
        {gone.length > 0 && <button type="button" className="dm-pill dm-ghost dm-sm dm-bdx-undo" onClick={undo}>Undo</button>}
      </>)}
      <p className="dm-bdx-live" aria-live="polite">{said}</p>
    </div>
  );
}
