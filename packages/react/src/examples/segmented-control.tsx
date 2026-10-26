'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { SegmentedControl } from '../components/segmented-control/SegmentedControl';
import { cx } from '../lib/cx';
import { Icon } from '../lib/icons';
import { Swap } from '../lib/motion';
import { useStory } from './useScript';

/* ---------- Segmented control: the pricing launch as a day, a week or a month, stepped through and opened a day at a time ---------- */
type View = 'day' | 'week' | 'month';
type Ev = [time: string, title: string, detail: string, color: string];
// the pricing launch in October 2026. Today is Friday the 23rd
const TODAY = new Date(2026, 9, 23, 12), DAY = 864e5;
const at = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n, 12);
const iso = (d: Date) => d.toISOString().slice(0, 10);
const same = (a: Date, b: Date) => iso(a) === iso(b);
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', o);
const mon = (d: Date) => at(d, -((d.getDay() + 6) % 7));
// launch week is written out; the days around it are drawn from the work that leads up to it and follows it
const E: Record<string, Ev[]> = {
  '2026-10-19': [['10:00', 'Kickoff with Maya', 'Pricing v4 brief', 'var(--dm-pl)'], ['15:00', 'Brief the agents', 'Build and copy agents', 'var(--dm-pm)']],
  '2026-10-20': [['10:00', 'Wireframe review', 'Pricing v4, frames 1 to 6', 'var(--dm-pl)'], ['11:30', 'Copy for the plan cards', 'Copy agent', 'var(--dm-pt)'], ['14:00', 'Token audit', 'Build agent', 'var(--dm-pm)']],
  '2026-10-21': [['11:00', 'Copy pass', 'Plan cards and FAQ', 'var(--dm-pt)']],
  '2026-10-22': [['14:00', 'Design QA', 'Pricing v4, all frames', 'var(--dm-pb)'], ['16:30', 'Fix contrast issues', 'Build agent', 'var(--dm-pm)']],
  '2026-10-23': [['09:30', 'Pricing review with Maya', 'Pricing v4, frames 1 to 3', 'var(--dm-pl)'], ['13:00', 'Export tokens to CSS', 'Build agent', 'var(--dm-pm)'], ['16:00', 'Ship pricing v4', 'designme.studio/pricing', 'var(--dm-pb)']],
  '2026-10-24': [], '2026-10-25': []
};
const POOL = [['Design crit', 'Pricing frames', 'var(--dm-pl)'], ['Token audit', 'Build agent', 'var(--dm-pm)'], ['Copy pass', 'Plan cards', 'var(--dm-pt)'], ['Stakeholder check-in', 'Weekly', 'var(--dm-pb)'],
  ['User interviews', 'Three sessions', 'var(--dm-pl)'], ['Conversion review', 'Trial to paid', 'var(--dm-pb)'], ['Research synthesis', 'Notes and quotes', 'var(--dm-pt)'], ['Fix review notes', 'Build agent', 'var(--dm-pm)']];
const TIMES = ['09:30', '10:00', '11:30', '13:00', '14:00', '15:30', '16:00'];
function events(d: Date): Ev[] {
  const k = iso(d); if (E[k]) return E[k];
  if (d.getDay() === 0 || d.getDay() === 6) return (E[k] = []);
  let h = Math.floor(+d / DAY) * 2654435761 >>> 0; const nx = (m: number) => { h = Math.imul(h ^ h >>> 15, 2246822519) >>> 0; return h % m; };
  const n = [0, 1, 1, 2, 2, 3][nx(6)], t = new Set<string>();
  while (t.size < n) t.add(TIMES[nx(TIMES.length)]);
  return (E[k] = [...t].sort().map(tm => { const e = POOL[nx(POOL.length)]; return [tm, e[0], e[1], e[2]] as Ev; }));
}
const label = (d: Date, n: number) => `${fmt(d, { weekday: 'long', month: 'long', day: 'numeric' })}, ${n ? n + (n === 1 ? ' event' : ' events') : 'nothing planned'}`;
const RANGE: Record<View, (d: Date) => string> = {
  day: d => fmt(d, { weekday: 'long', month: 'short', day: 'numeric' }),
  week: d => { const a = mon(d), b = at(a, 6); return fmt(a, { month: 'short', day: 'numeric' }) + ' – ' + (a.getMonth() === b.getMonth() ? b.getDate() : fmt(b, { month: 'short', day: 'numeric' })); },
  month: d => fmt(d, { month: 'long', year: 'numeric' })
};

// a day in the week or the month opens that day
function Panel({ view, date, open }: { view: View; date: Date; open: (d: Date) => void }) {
  if (view === 'day') {
    const ev = events(date);
    return ev.length ? (
      <div className="dm-sgc-day">
        {ev.map(([t, n, d, c]) => <div key={t} className="dm-sgc-ev" style={{ '--dm-c': c } as CSSProperties}><span className="dm-num dm-muted">{t}</span><i /><span className="dm-t">{n}<span>{d}</span></span></div>)}
      </div>
    ) : <div className="dm-sgc-none">Nothing planned</div>;
  }
  if (view === 'week') return (
    <div className="dm-sgc-wk">
      {Array.from({ length: 7 }, (_, i) => at(mon(date), i)).map(d => {
        const ev = events(d);
        return (
          <button key={iso(d)} type="button" aria-label={label(d, ev.length)} onClick={() => open(d)}
            className={['dm-sgc-wr', same(d, TODAY) && 'dm-now', !ev.length && 'dm-none'].filter(Boolean).join(' ')}>
            <span className="dm-d">{fmt(d, { weekday: 'short' })} {d.getDate()}</span>
            {ev.length
              ? <><span className="dm-e" style={{ '--dm-c': ev[0][3] } as CSSProperties}><i /><span className="dm-tm dm-num">{ev[0][0]}</span><span>{ev[0][1]}</span></span>{ev.length > 1 && <span className="dm-more">+{ev.length - 1} more</span>}</>
              : <span className="dm-e">Nothing planned</span>}
          </button>
        );
      })}
    </div>
  );
  const first = new Date(date.getFullYear(), date.getMonth(), 1, 12), lead = (first.getDay() + 6) % 7, len = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  return (
    <div className={['dm-sgc-mo', lead + len > 35 && 'dm-r6'].filter(Boolean).join(' ')}>
      {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, i) => <span key={'w' + i} className="dm-w" aria-hidden="true">{w}</span>)}
      {Array.from({ length: lead }, (_, i) => <span key={'b' + i} />)}
      {Array.from({ length: len }, (_, i) => {
        const d = at(first, i), n = events(d).length;
        return <button key={i} type="button" aria-label={label(d, n)} onClick={() => open(d)}
          className={['dm-d', 'dm-num', n && 'dm-e', same(d, TODAY) && 'dm-now', same(d, date) && !same(d, TODAY) && 'dm-on'].filter(Boolean).join(' ')}>{i + 1}</button>;
      })}
    </div>
  );
}

export default function SegmentedControlDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>('day');
  const [date, setDate] = useState(TODAY);
  // the panel on show, and the one it replaced while that fades out under the new one, so no frame is empty
  const key = view + iso(date);
  const [layers, setLayers] = useState([{ key, view, date, gone: false }]);
  if (layers[layers.length - 1].key !== key) setLayers([...layers.filter(l => !l.gone).slice(-1).map(l => ({ ...l, gone: true })), { key, view, date, gone: false }]);
  useEffect(() => {
    if (!layers.some(l => l.gone)) return;
    const t = setTimeout(() => setLayers(ls => ls.filter(l => !l.gone)), 260);
    return () => clearTimeout(t);
  }, [layers]);
  // previous and next step by the view's unit; Today comes back to the 23rd
  const step = (k: number) => setDate(d => view === 'day' ? at(d, k) : view === 'week' ? at(d, 7 * k) : new Date(d.getFullYear(), d.getMonth() + k, 1, 12));
  const open = (d: Date) => { setDate(d); setView('day'); };

  // the preview's story: the week, then Tuesday opened from it, a step on to Wednesday, the month, and back to the week
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('[data-v="week"]');
    await wait(2000); press('.dm-sgc-wr:nth-child(2)');
    await wait(2000); press('.dm-sgc-nx');
    await wait(1500); press('[data-v="month"]');
    await wait(2000); press('[data-v="week"]');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div data-dm="" className="dm-sgc dm-panel">
        <div className="dm-sgc-h">
          <div className="dm-sgc-ht"><b>Pricing launch</b></div>
          <SegmentedControl id="launch-view" label="View" value={view} onValueChange={setView}
            options={[{ value: 'day', label: 'Day' }, { value: 'week', label: 'Week' }, { value: 'month', label: 'Month' }]} />
        </div>
        <div className="dm-sgc-bar">
          <span className="dm-sgc-r" aria-live="polite"><Swap>{RANGE[view](date)}</Swap></span>
          <button type="button" className="dm-pill dm-ghost dm-sm dm-sgc-td" onClick={() => setDate(TODAY)}>Today</button>
          <button type="button" className="dm-ib dm-sgc-pv" aria-label={'Previous ' + view} onClick={() => step(-1)}><Icon name="chev-l" size="xs" /></button>
          <button type="button" className="dm-ib dm-sgc-nx" aria-label={'Next ' + view} onClick={() => step(1)}><Icon name="chev-r" size="xs" /></button>
        </div>
        <div className="dm-sgc-p" id="launch-view-panel" role="tabpanel" aria-labelledby={`launch-view-${view}`} tabIndex={0}>
          {layers.map((l, i) => (
            <div key={l.key} className={cx('dm-sgc-in', l.gone ? 'dm-gone' : i > 0 && 'dm-fresh')} inert={l.gone} aria-hidden={l.gone || undefined}>
              <Panel view={l.view} date={l.date} open={open} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
