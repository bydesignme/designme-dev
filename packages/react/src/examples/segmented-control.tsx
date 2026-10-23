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
const WEEK: [string, number, number][] = [['Mon', 19, 2], ['Tue', 20, 4], ['Wed', 21, 1], ['Thu', 22, 2], ['Fri', 23, 3], ['Sat', 24, 0], ['Sun', 25, 0]];
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
      {WEEK.map(([d, n, k]) => <div key={d} className={n === 23 ? 'dm-sgc-d dm-now' : 'dm-sgc-d'}><span className="dm-n dm-num">{k || ''}</span><span className="dm-sgc-bar"><i style={{ height: `${k * 25}%` }} /></span><span>{d}</span></div>)}
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
