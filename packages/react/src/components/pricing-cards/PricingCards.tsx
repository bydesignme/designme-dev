'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Seg } from '../../lib/motion';
import '../../designme.css';
import './pricing-cards.css';

export type PricingPeriod = 'monthly' | 'yearly';

export interface PricingPlan {
  /** Like "Pro" */
  name: string;
  /** The quiet line under the name, like "For growing design teams" */
  description?: string;
  /** The monthly price per editor. 0 is a free plan, null is priced on request ("Custom") */
  price: number | null;
  /** Shown instead of a price when `price` is null. Defaults to "Custom" */
  priceLabel?: string;
  /** The line under the price. Defaults to "per editor, per month", or "forever" for a free plan */
  unit?: string;
  /** The line above the features. Paid plans work it out from the editors and the billing period; set it for free or custom plans */
  total?: string;
  features: ReactNode[];
  /** The button at the foot of the card. soft is quiet, accent is the one to pick, ink is for talking to sales */
  action: { label: string; variant?: 'soft' | 'accent' | 'ink' };
  /** Adds the "Most popular" badge and outlines the card */
  popular?: boolean;
  /** Once the editors reach this many, this card takes the outline from the popular one, like Enterprise from 25 editors */
  fromSeats?: number;
}

export interface PricingCardsProps {
  plans: PricingPlan[];
  /** monthly or yearly. Leave it out to let the switch change it */
  period?: PricingPeriod;
  defaultPeriod?: PricingPeriod;
  onPeriodChange?: (period: PricingPeriod) => void;
  /** Taken off a paid plan's price when billed yearly, 0.2 for 20% */
  yearlyDiscount?: number;
  /** How many editors the totals are for. Leave it out to let the slider change it */
  seats?: number;
  defaultSeats?: number;
  onSeatsChange?: (seats: number) => void;
  /** The slider's range, 1 to 50 by default */
  minSeats?: number;
  maxSeats?: number;
  /** The slider's label, like "Editors" */
  seatsLabel?: string;
  /** The badge on the popular plan */
  popularLabel?: string;
  /** Called with the plan when its button is pressed, and the period and editors it was priced for */
  onChoose?: (plan: PricingPlan, choice: { period: PricingPeriod; seats: number }) => void;
  className?: string;
}

const money = (n: number) => '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 });

/** Monthly or yearly, with a knob that slides between them like the site's switches. The yearly side carries the saving */
function PeriodSwitch({ value, onChange, saving }: { value: PricingPeriod; onChange: (p: PricingPeriod) => void; saving?: string }) {
  return <Seg className="dm-pcx-per" label="Billing" value={value} onChange={onChange}
    options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: <>Yearly{saving && <span className="dm-tag dm-ok">{saving}</span>}</> }]} />;
}

/** The total under the price. A new billing period crossfades it, the way the site swaps text; dragging the slider changes it in place */
function Total({ text, period }: { text: string; period: PricingPeriod }) {
  const [shown, setShown] = useState(text);
  const [out, setOut] = useState(false);
  const last = useRef(period);
  useEffect(() => {
    if (period === last.current) { setShown(text); setOut(false); return; }
    last.current = period; setOut(true);
    const t = setTimeout(() => { setShown(text); setOut(false); }, 170);
    return () => clearTimeout(t);
  }, [text, period]);
  return <div className={cx('dm-pcx-tot dm-num dm-sw', out && 'dm-out')}>{shown}</div>;
}

/** A price that rolls to its new value when the period changes */
function Price({ value }: { value: number }) {
  const v = useTween(value, 500, 0);
  return <b className="dm-num">${Number.isInteger(value) ? Math.round(v) : v.toFixed(2)}</b>;
}

/** Plans side by side, with a monthly or yearly switch and a slider for how many editors the totals cover. */
export function PricingCards({ plans, period, defaultPeriod = 'yearly', onPeriodChange, yearlyDiscount = .2, seats, defaultSeats = 5, onSeatsChange,
  minSeats = 1, maxSeats = 50, seatsLabel = 'Editors', popularLabel = 'Most popular', onChoose, className }: PricingCardsProps) {
  const [per, setPer] = useControllable(period, defaultPeriod, onPeriodChange);
  const [n, setN] = useControllable(seats, defaultSeats, onSeatsChange);
  const yearly = per === 'yearly';
  // the outline sits on the popular plan, or on a bigger plan once the editors reach its threshold
  const big = plans.reduce((at, p, i) => (p.fromSeats !== undefined && n >= p.fromSeats ? i : at), -1);
  const hot = big >= 0 ? big : plans.findIndex(p => p.popular);
  const saving = yearlyDiscount > 0 ? `−${Math.round(yearlyDiscount * 100)}%` : undefined;

  return (
    <div data-dm="" className={cx('dm-pcx', className)}>
      <div className="dm-pcx-top">
        <PeriodSwitch value={per} onChange={setPer} saving={saving} />
        <label className="dm-pcx-seats">
          <span className="dm-muted">{seatsLabel}</span>
          <input type="range" min={minSeats} max={maxSeats} value={n} aria-label={seatsLabel} onChange={e => setN(+e.target.value)} />
          <b className="dm-num">{n}</b>
        </label>
      </div>
      <div className="dm-pcx-grid">
        {plans.map((p, i) => {
          const unit = p.price === null ? 0 : yearly ? p.price * (1 - yearlyDiscount) : p.price;
          const total = p.total ?? (p.price ? `${money(unit * n * (yearly ? 12 : 1))} ${yearly ? 'billed yearly' : 'a month'} for ${n} editor${n > 1 ? 's' : ''}` : '');
          const e = enter(i * 80);
          return (
            <div key={p.name} className={cx('dm-pcx-c dm-panel', i === hot && 'dm-hot', e.className)} style={e.style}>
              {p.popular && <span className="dm-tag dm-b dm-bd">{popularLabel}</span>}
              <span className="dm-nm">{p.name}</span>
              {p.description && <span className="dm-ds">{p.description}</span>}
              <div className="dm-pcx-pr">
                {p.price === null ? <b className="dm-num">{p.priceLabel ?? 'Custom'}</b> : <Price value={unit} />}
                <s className="dm-num">{yearly && p.price ? '$' + p.price : ''}</s>
                <span>{p.unit ?? (p.price === null ? '' : p.price ? 'per editor, per month' : 'forever')}</span>
              </div>
              <Total text={total} period={per} />
              <div className="dm-pcx-li">{p.features.map((f, k) => <span key={k}><Icon name="check" size="xs" />{f}</span>)}</div>
              <button type="button" className={cx('dm-pill', 'dm-' + (p.action.variant ?? 'soft'))} onClick={() => onChoose?.(p, { period: per, seats: n })}>{p.action.label}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
