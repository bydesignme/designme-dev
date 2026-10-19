'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { AgentLanes, type AgentHandoff, type AgentLane, type LaneTone } from '../components/agent-lanes/AgentLanes';
import type { IconName } from '../lib/icons';
import { useScript } from './useScript';

/* ---------- Agent lanes: three agents work in turn and hand the work along; Pause all holds them ---------- */
const PLAN: { key: string; name: string; icon: IconName; tone: LaneTone; wait?: string; acts: string[]; log: string[] }[] = [
  { key: 'researcher', name: 'Researcher', icon: 'search', tone: 'blue', acts: ['Reading competitor sites', 'Comparing 5 pricing pages', 'Writing the brief'], log: ['Read stripe.com/pricing', 'Read linear.app/pricing', 'Noted 3 patterns'] },
  { key: 'designer', name: 'Designer', icon: 'palette', tone: 'purple', wait: 'Waiting for the brief', acts: ['Laying out pricing cards', 'Setting type and spacing', 'Exporting frames'], log: ['Made 3 card variants', 'Applied spacing tokens', 'Exported 4 frames'] },
  { key: 'reviewer', name: 'Reviewer', icon: 'eye', tone: 'green', wait: 'Waiting for the designer', acts: ['Checking contrast', 'Checking copy', 'Signing off'], log: ['Contrast passes AA', 'Fixed 2 lines of copy', 'Approved'] }
];

export default function AgentLanesDemo() {
  const [lanes, setLanes] = useState<AgentLane[]>(() => PLAN.map(p => ({ key: p.key, name: p.name, icon: p.icon, tone: p.tone, status: 'queued', activity: p.wait ?? 'Queued', done: 0, log: [] })));
  const [handoff, setHandoff] = useState<AgentHandoff>();
  const [paused, setPaused] = useState(false);
  const [secs, setSecs] = useState(0);
  const [finished, setFinished] = useState(false);
  // the script reads these while it runs
  const live = useRef({ paused, secs });
  useEffect(() => { live.current = { paused, secs }; });
  // the clock ticks on a steady beat and skips the beats that fall in a pause
  useEffect(() => {
    if (finished) return;
    const id = setInterval(() => { if (!live.current.paused) setSecs(s => s + 1); }, 1000);
    return () => clearInterval(id);
  }, [finished]);

  useScript(async ({ wait }) => {
    const set = (key: string, patch: Partial<AgentLane> | ((l: AgentLane) => Partial<AgentLane>)) =>
      setLanes(ls => ls.map(l => l.key === key ? { ...l, ...(typeof patch === 'function' ? patch(l) : patch) } : l));
    // work only moves on while the agents are not paused
    const hold = async (ms: number) => { for (let t = 0; t < ms;) { await wait(100); if (!live.current.paused) t += 100; } };
    const work = async (p: (typeof PLAN)[number]) => {
      for (let i = 0; i < 3; i++) {
        set(p.key, { status: 'working', activity: p.acts[i], done: i });
        await hold(1500);
        const time = live.current.secs + 's';
        set(p.key, l => ({ done: i + 1, log: [...(l.log ?? []), { text: p.log[i], time }] }));
      }
      set(p.key, { status: 'done', activity: p.log[2] });
    };
    const hand = async (from: string, to: string, what: string) => { setHandoff({ from, to, what }); await wait(1400); setHandoff(undefined); await wait(350); };

    await wait(600);
    const first = work(PLAN[0]); set('designer', { status: 'waiting' });
    await first; await hand('researcher', 'designer', 'the brief');
    await work(PLAN[1]); await hand('designer', 'reviewer', '4 frames');
    await work(PLAN[2]);
    setFinished(true);
  });

  return (
    <div style={{ width: '100%' }}>
      <AgentLanes lanes={lanes} handoff={handoff} seconds={secs} paused={paused} onPausedChange={setPaused} />
    </div>
  );
}
