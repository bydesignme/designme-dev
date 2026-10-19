'use client';
import { formatCount, useStagger } from '../../lib/chart';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Seg, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './funnel-chart.css';

export interface FunnelChartView {
  key: string;
  /** On the switch, like "Teams" */
  label: string;
  /** How many reached each stage, in order */
  values: number[];
  /** The agent's note under the funnel for this view */
  insight?: string;
}

export interface FunnelChartProps {
  /** Like "Signup to paid" */
  title: string;
  /** The stages in order, like "Signed up" then "Opened a file" */
  stages: string[];
  /** One set of numbers per view. With more than one, a switch picks between them */
  views: FunnelChartView[];
  /** Key of the view shown. Leave it out to let the switch change it */
  view?: string;
  /** Defaults to the first view */
  defaultView?: string;
  onViewChange?: (key: string) => void;
  /** Ends a stage's tip, like "of signups" in "51.8% of signups" */
  shareLabel?: string;
  /** The first stage's tip */
  startLabel?: string;
  /** Writes a count. Defaults to whole numbers like 12,400 */
  format?: (n: number) => string;
  className?: string;
}

/** How many people reach each stage, with the biggest drop marked and a note from the agent. */
export function FunnelChart({ title, stages, views, view, defaultView, onViewChange, shareLabel = 'of the first stage', startLabel = 'Starting point', format = formatCount, className }: FunnelChartProps) {
  const [cur, setCur] = useControllable(view, defaultView ?? views[0]?.key ?? '', onViewChange);
  // the bars draw a moment after the funnel appears, then redraw top to bottom on every switch
  const at = useStagger(cur, stages.length, 70, 150);
  const byKey = (k: string | null) => views.find(v => v.key === k);
  const shown = byKey(at[0]);
  const d = shown?.values ?? [];
  // the stage that loses the largest share of the one before it
  let worst = -1, ratio = 1;
  d.forEach((n, i) => { if (i && n / d[i - 1] < ratio) { ratio = n / d[i - 1]; worst = i; } });
  const insight = views.some(v => v.insight);

  return (
    <div data-dm="" className={cx('dm-fnx dm-panel', className)}>
      <div className="dm-fnx-h">
        <b>{title}</b>
        {views.length > 1 && (
          <Seg className="dm-fnx-sg" label="Segment" value={cur} onChange={setCur} options={views.map(v => ({ value: v.key, label: v.label }))} />
        )}
      </div>
      <div className="dm-fnx-rows">
        {stages.map((stage, i) => {
          const own = byKey(at[i])?.values, w = own ? Math.max(6, own[i] / own[0] * 100) : 0, out = !!own && w < 24;
          const track = (
            <div className="dm-tr">
              <div className="dm-bar" style={{ width: w + '%' }} />
              <span className={cx('dm-n dm-num', out && 'dm-out')} style={own ? { left: out ? `calc(${w}% + 8px)` : 10 } : undefined}>{shown && format(d[i])}</span>
            </div>
          );
          return (
            <div key={i} className={cx('dm-fnx-r', i === worst && 'dm-drop')}>
              <span className="dm-k">{stage}</span>
              {shown ? <Tip label={i ? `${Math.round(d[i] / d[0] * 1000) / 10}% ${shareLabel}` : startLabel}>{track}</Tip> : track}
              <span className="dm-v dm-num">{shown && (i ? '−' + Math.round((1 - d[i] / d[i - 1]) * 100) + '%' : '100%')}</span>
            </div>
          );
        })}
      </div>
      {insight && (
        <div className="dm-fnx-ins">
          <span className="dm-fnx-ic"><Icon name="spark" size="xs" /></span>
          <Swap>{shown?.insight ?? ''}</Swap>
        </div>
      )}
    </div>
  );
}
