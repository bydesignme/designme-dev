'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState, type CSSProperties } from 'react';
import { SegmentedControl } from '../components/segmented-control/SegmentedControl';
import { Swap } from '../lib/motion';
import { useStory } from './useScript';

/* ---------- Segmented control: switch the pricing launch between a day, a week and a month ---------- */
type View = 'day' | 'week' | 'month';
// the pricing launch in October 2026. Today is Friday the 23rd
const DAY = [['09:30', 'Pricing review with Maya', 'Pricing v4, frames 1 to 3', 'var(--dm-pl)'], ['13:00', 'Export tokens to CSS', 'Build agent', 'var(--dm-pm)'], ['16:00', 'Ship pricing v4', 'designme.studio/pricing', 'var(--dm-pb)']];
// the week: each day's events, earliest first. Friday's are the day above
const WEEK: [string, number, string[][]][] = [['Mon', 19, [['10:00', 'Kickoff with Maya', 'var(--dm-pl)'], ['15:00', 'Brief the agents', 'var(--dm-pm)']]],
  ['Tue', 20, [['10:00', 'Wireframe review', 'var(--dm-pl)'], ['11:30', 'Copy for the plan cards', 'var(--dm-pt)'], ['14:00', 'Token audit', 'var(--dm-pm)'], ['16:00', 'Stakeholder check-in', 'var(--dm-pb)']]],
  ['Wed', 21, [['11:00', 'Copy pass', 'var(--dm-pt)']]], ['Thu', 22, [['14:00', 'Design QA', 'var(--dm-pb)'], ['16:30', 'Fix contrast issues', 'var(--dm-pm)']]],
  ['Fri', 23, DAY.map(([t, n, , c]) => [t, n, c])], ['Sat', 24, []], ['Sun', 25, []]];
const BUSY = [2, 6, 7, 9, 13, 14, 15, 16, 19, 20, 21, 22, 23, 27, 28, 29, 30];
const RANGE: Record<View, string> = { day: 'Friday, Oct 23', week: 'Oct 19 – 25', month: 'October 2026' };

function Panel({ view }: { view: View }) {
  if (view === 'day') return (
    <div className="dm-sgc-day">
      {DAY.map(([t, n, d, c]) => <div key={t} className="dm-sgc-ev" style={{ '--dm-c': c } as CSSProperties}><span className="dm-num dm-muted">{t}</span><i /><span className="dm-t">{n}<span>{d}</span></span></div>)}
    </div>
  );
  if (view === 'week') return (
    <div className="dm-sgc-wk">
      {WEEK.map(([d, n, ev]) => (
        <div key={d} className={['dm-sgc-wr', n === 23 && 'dm-now', !ev.length && 'dm-none'].filter(Boolean).join(' ')}>
          <span className="dm-d">{d} {n}</span>
          {ev.length
            ? <><span className="dm-e" style={{ '--dm-c': ev[0][2] } as CSSProperties}><i /><span className="dm-tm dm-num">{ev[0][0]}</span><span>{ev[0][1]}</span></span>{ev.length > 1 && <span className="dm-more">+{ev.length - 1} more</span>}</>
            : <span className="dm-e">Nothing planned</span>}
        </div>
      ))}
    </div>
  );
  return (
    <div className="dm-sgc-mo">
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, i) => <span key={'w' + i} className="dm-w">{w}</span>)}
      {[0, 1, 2].map(i => <span key={'b' + i} />)}
      {Array.from({ length: 31 }, (_, i) => <span key={i} className={['dm-d', 'dm-num', BUSY.includes(i + 1) && 'dm-e', i === 22 && 'dm-now'].filter(Boolean).join(' ')}>{i + 1}</span>)}
    </div>
  );
}

export default function SegmentedControlDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>('day');

  // the preview's story: look at the week, then the month, then settle on the week
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('[data-v="week"]');
    await wait(3000); press('[data-v="month"]');
    await wait(3000); press('[data-v="week"]');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div data-dm="" className="dm-sgc dm-panel">
        <div className="dm-sgc-h">
          <div className="dm-sgc-ht"><b>Pricing launch</b><span aria-live="polite"><Swap className="dm-muted dm-sgc-r">{RANGE[view]}</Swap></span></div>
          <SegmentedControl id="launch-view" label="View" value={view} onValueChange={setView}
            options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
        </div>
        <div className="dm-sgc-p" id="launch-view-panel" role="tabpanel" aria-labelledby={`launch-view-${view}`} tabIndex={0}>
          <div key={view} className="dm-sgc-in dm-enter"><Panel view={view} /></div>
        </div>
      </div>
    </div>
  );
}
