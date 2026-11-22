'use client';
import { useRef, useState, type FormEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Seg } from '../../lib/motion';
import '../../designme.css';
import './payment-form.css';

export type PaymentPeriod = 'monthly' | 'yearly';

/** The card as typed, already formatted: "4242 4242 4242 4242", "12 / 28", "123" */
export interface PaymentCard {
  number: string;
  expiry: string;
  cvc: string;
}

export interface PaymentFormProps {
  /** Defaults to "Pro plan" */
  plan?: ReactNode;
  /** Defaults to "For growing design teams" */
  description?: ReactNode;
  /** Defaults to 3 */
  seats?: number;
  /** Defaults to "editors" */
  seatLabel?: string;
  /** Price per seat per month. Defaults to 24 */
  price?: number;
  /** Put before every amount. Defaults to "$" */
  currency?: string;
  /** Taken off a yearly plan, 0 to 1. Defaults to 0.2 */
  yearlyDiscount?: number;
  /** Monthly or yearly. Leave it out to let the switch hold its own */
  period?: PaymentPeriod;
  defaultPeriod?: PaymentPeriod;
  onPeriodChange?: (period: PaymentPeriod) => void;
  /** The card fields. Leave it out to let the fields hold their own */
  card?: PaymentCard;
  defaultCard?: PaymentCard;
  onCardChange?: (card: PaymentCard) => void;
  /** Called once the card looks complete. Return a promise and the button shows Processing until it settles; if it rejects, its message shows under the button */
  onPay?: (payment: { card: PaymentCard; period: PaymentPeriod; total: number }) => void | Promise<void>;
  payLabel?: string;
  processingLabel?: string;
  paidLabel?: string;
  discountLabel?: string;
  dueLabel?: string;
  /** A quiet line under the button, like "Nothing is charged until your trial ends" */
  note?: ReactNode;
  /** Shown when onPay rejects without a message of its own */
  errorLabel?: string;
  className?: string;
}

type CardField = keyof PaymentCard;
const EMPTY: PaymentCard = { number: '', expiry: '', cvc: '' };
const digits = (s: string) => s.replace(/\D/g, '');
const asNumber = (s: string) => digits(s).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const asExpiry = (s: string) => { let d = digits(s).slice(0, 4); if (d.length === 1 && +d > 1) d = '0' + d; return d.length > 2 ? d.slice(0, 2) + ' / ' + d.slice(2) : d; };
const asCvc = (s: string) => digits(s).slice(0, 4);
const BRANDS: { test: RegExp; name: string; color: string }[] = [
  { test: /^4/, name: 'VISA', color: '#1a1f71' }, { test: /^5[1-5]/, name: 'MC', color: '#eb001b' }, { test: /^3[47]/, name: 'AMEX', color: '#2e77bb' }
];

/** A plan checkout: monthly or yearly, a card that formats itself as you type, and a total that rolls to the new price. */
export function PaymentForm({
  plan = 'Pro plan', description = 'For growing design teams', seats = 3, seatLabel = 'editors', price = 24, currency = '$', yearlyDiscount = 0.2,
  period, defaultPeriod = 'yearly', onPeriodChange, card, defaultCard = EMPTY, onCardChange, onPay, payLabel = 'Pay', processingLabel = 'Processing',
  paidLabel = 'Payment successful', discountLabel = 'Yearly discount', dueLabel = 'Due today', note, errorLabel = "The payment didn't go through", className
}: PaymentFormProps) {
  const [per, setPer] = useControllable(period, defaultPeriod, onPeriodChange);
  const [raw, setCard] = useControllable(card, defaultCard, onCardChange);
  const [bad, setBad] = useState<CardField[]>([]);
  const [state, setState] = useState<'idle' | 'processing' | 'paid'>('idle');
  const [error, setError] = useState('');
  const expiry = useRef<HTMLInputElement>(null), cvc = useRef<HTMLInputElement>(null);
  const c = { number: asNumber(raw.number), expiry: asExpiry(raw.expiry), cvc: asCvc(raw.cvc) };

  // the brand badge keeps its last name while it fades out
  const brand = BRANDS.find(b => b.test.test(digits(c.number)));
  const [shownBrand, setShownBrand] = useState(brand);
  if (brand && brand !== shownBrand) setShownBrand(brand);

  const yearly = per === 'yearly', month = price * seats;
  const subtotal = yearly ? month * 12 : month, discount = yearly ? month * 12 * yearlyDiscount : 0, total = subtotal - discount;
  const shown = useTween(total, 600);
  const money = (n: number) => `${currency}${n.toFixed(2)}`;

  const edit = (key: CardField, value: string) => {
    const next = { ...c, [key]: key === 'number' ? asNumber(value) : key === 'expiry' ? asExpiry(value) : asCvc(value) };
    setCard(next); setBad(b => b.filter(k => k !== key)); setError('');
    // a finished number or expiry moves on to the next field
    if (key === 'number' && digits(next.number).length === 16 && digits(c.number).length < 16) expiry.current?.focus({ preventScroll: true });
    if (key === 'expiry' && digits(next.expiry).length === 4 && digits(c.expiry).length < 4) cvc.current?.focus({ preventScroll: true });
  };

  const pay = async (e: FormEvent) => {
    e.preventDefault();
    if (state !== 'idle') return;
    const wrong = ([['number', digits(c.number).length === 16], ['expiry', /^\d\d \/ \d\d$/.test(c.expiry)], ['cvc', c.cvc.length >= 3]] as const).filter(([, ok]) => !ok).map(([k]) => k);
    setBad(wrong);
    if (wrong.length) return;
    setState('processing'); setError('');
    try { await onPay?.({ card: c, period: per, total }); } catch (err) { setState('idle'); setError(err instanceof Error && err.message ? err.message : errorLabel); return; }
    setState('paid');
  };

  const fieldClass = (k: CardField) => cx('dm-pyx-f', bad.includes(k) && 'dm-bad');
  return (
    <form data-dm="" className={cx('dm-pyx dm-panel', className)} noValidate onSubmit={pay}>
      <div className="dm-pyx-h">
        <div><b>{plan}</b><span className="dm-muted">{description}</span></div>
        <Seg className="dm-pyx-per" label="Billing" value={per} onChange={setPer} options={[{ value: 'monthly', label: 'Monthly' }, { value: 'yearly', label: 'Yearly' }]} />
      </div>
      <label className={fieldClass('number')}>
        <span>Card number</span>
        <div className="dm-pyx-in">
          <input className="dm-pyx-cn" name="cc-number" inputMode="numeric" autoComplete="cc-number" placeholder="1234 1234 1234 1234" aria-invalid={bad.includes('number') || undefined}
            value={c.number} onChange={e => edit('number', e.target.value)} />
          <span className={cx('dm-pyx-br', brand && 'dm-on')} style={shownBrand ? { background: shownBrand.color, color: '#fff' } : undefined} aria-hidden={!brand}>{shownBrand?.name}</span>
        </div>
      </label>
      <div className="dm-pyx-2">
        <label className={fieldClass('expiry')}>
          <span>Expiry</span>
          <div className="dm-pyx-in"><input ref={expiry} className="dm-pyx-ex" name="cc-exp" inputMode="numeric" autoComplete="cc-exp" placeholder="MM / YY" aria-invalid={bad.includes('expiry') || undefined}
            value={c.expiry} onChange={e => edit('expiry', e.target.value)} /></div>
        </label>
        <label className={fieldClass('cvc')}>
          <span>CVC</span>
          <div className="dm-pyx-in"><input ref={cvc} className="dm-pyx-cv" name="cc-csc" inputMode="numeric" autoComplete="cc-csc" placeholder="123" maxLength={4} aria-invalid={bad.includes('cvc') || undefined}
            value={c.cvc} onChange={e => edit('cvc', e.target.value)} /></div>
        </label>
      </div>
      <div className="dm-pyx-sum">
        <div><span>{seats} {seatLabel} × <span className="dm-num dm-pyx-u">{currency}{price}{yearly && ' × 12'}</span></span><span className="dm-num dm-pyx-s">{money(subtotal)}</span></div>
        <div className={cx('dm-pyx-dc', !yearly && 'dm-off')}><span>{discountLabel}</span><span className="dm-num dm-pyx-d">−{money(discount)}</span></div>
        <div className="dm-pyx-t"><b>{dueLabel}</b><b className="dm-num dm-pyx-tot">{money(shown)}</b></div>
      </div>
      <button type="submit" className={cx('dm-pill dm-accent dm-pyx-go', state === 'paid' && 'dm-ok')} aria-live="polite">
        {state === 'processing' ? <><span className="dm-spin" style={{ borderColor: 'rgba(255,255,255,.3)', borderTopColor: '#fff' }} aria-hidden="true" />{processingLabel}</>
          : state === 'paid' ? <><Icon name="check" size="xs" className="dm-enter" />{paidLabel}</>
          : <><Icon name="lock" size="xs" />{payLabel} <span className="dm-num dm-pyx-gt">{money(shown)}</span></>}
      </button>
      {error ? <span className="dm-muted dm-pyx-n" role="alert" style={{ color: 'var(--dm-bad)' }}>{error}</span> : note && <span className="dm-muted dm-pyx-n">{note}</span>}
    </form>
  );
}
