'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { SegmentedControl } from '../components/segmented-control/SegmentedControl';
import { cx } from '../lib/cx';
import { Icon } from '../lib/icons';
import { mxIn, Swap, Tip, useGrow } from '../lib/motion';
import { useStory } from './useScript';
import { useHoverGlide } from '../lib/glide';

/* ---------- Segmented control: a month of a pricing launch, as a calendar or a list ---------- */
type View = 'list' | 'cal';
type Ev = [day: string, name: string, time: string, launch?: boolean];
// October 2026: today is Friday the 23rd, and the launch on the 28th is the one accent mark
const TODAY = '2026-10-23';
const EV: Ev[] = [['2026-10-06', 'Kickoff', '10:00'], ['2026-10-09', 'Brief review', '14:00'], ['2026-10-14', 'Copy review', '11:00'], ['2026-10-20', 'Design sign-off', '16:00'], ['2026-10-26', 'QA pass', '09:30'], ['2026-10-28', 'Pricing goes live', '10:00', true]];
const pad = (n: number) => String(n).padStart(2, '0');
const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
const day = (k: string) => { const [y, m, d] = k.split('-').map(Number); return new Date(y, m - 1, d, 12); };
const fmt = (d: Date, o: Intl.DateTimeFormatOptions) => d.toLocaleDateString('en-US', o);
const short = (k: string) => fmt(day(k), { month: 'short', day: 'numeric' });
const ev = (k: string) => EV.find(e => e[0] === k);
const inMonth = (m: Date) => EV.filter(e => e[0].startsWith(iso(m).slice(0, 7)));
// a month's picked day when you step to it: the launch, else its first event, else the 1st
const firstPick = (m: Date) => { const L = inMonth(m); return (L.find(e => e[3]) ?? L[0])?.[0] ?? iso(m); };

// the calendar: a calm month, a grey dot on a day with something on (the launch's dot in the accent), today a quiet ring and the
// picked day a small accent circle; under a hairline, the picked day's line
function Calendar({ month, sel, pick }: { month: Date; sel: string; pick: (k: string) => void }) {
  const lead = (month.getDay() + 6) % 7, len = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate(), e = ev(sel);
  return (
    <div className="dm-sgc-cal">
      <div className="dm-sgc-mo">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((w, i) => <span key={'w' + i} className="dm-w" aria-hidden="true">{w}</span>)}
        {Array.from({ length: lead }, (_, i) => <span key={'b' + i} />)}
        {Array.from({ length: len }, (_, i) => {
          const d = new Date(month.getFullYear(), month.getMonth(), i + 1, 12), k = iso(d), x = ev(k), on = k === sel;
          return (
            <button key={k} type="button" aria-pressed={on} aria-label={`${fmt(d, { weekday: 'long', month: 'long', day: 'numeric' })}, ${x ? x[1] : 'nothing planned'}`} onClick={() => pick(k)}
              className={cx('dm-d dm-num', x && 'dm-e', x?.[3] && 'dm-x', k === TODAY && 'dm-now', on && 'dm-on')}><b>{i + 1}</b></button>
          );
        })}
      </div>
      <div className="dm-sgc-sel" aria-live="polite">
        <Swap className="dm-num">{short(sel)}</Swap>
        <i className={cx(e?.[3] && 'dm-x')} />
        {e ? <span className="dm-t">{e[1]} <span>· {e[2]}</span></span> : <span className="dm-t dm-none">Nothing planned</span>}
      </div>
    </div>
  );
}

// the list: the month's events as rows, a row opening its day in the calendar
function List({ month, open }: { month: Date; open: (k: string) => void }) {
  const L = inMonth(month);
  return L.length ? (
    <div className="dm-sgc-ls">
      {L.map(e => (
        <button key={e[0]} type="button" className="dm-sgc-lr" onClick={() => open(e[0])}>
          <span className="dm-num">{short(e[0])}</span>
          <span className="dm-t"><i className={cx(e[3] && 'dm-x')} /><span>{e[1]}</span></span>
          <span className="dm-num dm-tm">{e[2]}</span>
        </button>
      ))}
    </div>
  ) : <div className="dm-sgc-none">Nothing planned this month</div>;
}

export default function SegmentedControlDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>('cal');
  const [month, setMonth] = useState(() => new Date(2026, 9, 1, 12));
  const [sel, setSel] = useState('2026-10-28');
  // the view on show, and the one it replaced while that fades out under the new one, so no frame is empty
  const key = view + iso(month);
  const [layers, setLayers] = useState([{ key, view, month, gone: false }]);
  if (layers[layers.length - 1].key !== key) setLayers([...layers.filter(l => !l.gone).slice(-1).map(l => ({ ...l, gone: true })), { key, view, month, gone: false }]);
  useEffect(() => {
    if (!layers.some(l => l.gone)) return;
    const t = setTimeout(() => setLayers(ls => ls.filter(l => !l.gone)), 240);
    return () => clearTimeout(t);
  }, [layers]);
  // the new view's days or rows come in one after another
  const fresh = useRef<HTMLDivElement>(null), first = useRef(true);
  useLayoutEffect(() => {
    if (first.current) { first.current = false; return; }
    const el = fresh.current; if (!el) return;
    const days = Array.from(el.querySelectorAll('.dm-sgc-mo .dm-d'));
    if (days.length) mxIn([...days, el.querySelector('.dm-sgc-sel')], { ms: 300, step: 6, y: 4 });
    else mxIn(Array.from(el.querySelectorAll('.dm-sgc-lr')), { ms: 300, step: 40, y: 4 });
  }, [key]);
  const step = (k: number) => { const m = new Date(month.getFullYear(), month.getMonth() + k, 1, 12); setMonth(m); setSel(firstPick(m)); };
  const open = (k: string) => { setSel(k); setView('cal'); };
  // the panel is as tall as the view on show and eases to the next one's height
  const [panel, panelIn] = useGrow();
  // Clean's one hover: a highlight that glides from row to row in the list
  useHoverGlide(panel, '.dm-sgc-lr');

  // the preview's story, calm: the calendar, the list, and back to the calendar
  useStory(ref, async ({ wait, press }) => {
    await wait(2000); press('[data-v="list"]');
    await wait(2500); press('[data-v="cal"]');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <div data-dm="" className="dm-sgc dm-panel" data-v={view}>
        {/* one line: the month as the title between two quiet chevrons, and the switch, two icons, on the right */}
        <div className="dm-sgc-h">
          <div className="dm-sgc-mt">
            <Tip label="Previous month"><button type="button" className="dm-ib dm-sgc-pv" aria-label="Previous month" onClick={() => step(-1)}><Icon name="chev-l" size="xs" /></button></Tip>
            <b className="dm-sgc-r" aria-live="polite"><Swap>{fmt(month, { month: 'long', year: 'numeric' })}</Swap></b>
            <Tip label="Next month"><button type="button" className="dm-ib dm-sgc-nx" aria-label="Next month" onClick={() => step(1)}><Icon name="chev-r" size="xs" /></button></Tip>
          </div>
          <SegmentedControl id="launch-view" label="View" value={view} onValueChange={setView}
            options={[{ value: 'list', label: <Icon name="list" size="s" />, title: 'List' }, { value: 'cal', label: <Icon name="cal" size="s" />, title: 'Calendar' }]} />
        </div>
        <div ref={panel} className="dm-sgc-p dm-growing" id="launch-view-panel" role="tabpanel" aria-labelledby={`launch-view-${view}`} tabIndex={0}>
          <div ref={panelIn} className="dm-grow">
            {layers.map((l, i) => (
              <div key={l.key} ref={l.gone ? undefined : fresh} className={cx('dm-sgc-in', l.gone ? 'dm-gone' : i > 0 && 'dm-fresh')} inert={l.gone} aria-hidden={l.gone || undefined}>
                {l.view === 'cal' ? <Calendar month={l.month} sel={sel} pick={setSel} /> : <List month={l.month} open={open} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
