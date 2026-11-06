'use client';
import { useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Flag, type FlagCode } from '../../lib/flags';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './currency-converter.css';

export interface CurrencyConverterCurrency {
  /** Like "USD" */
  code: string;
  /** Like "US dollar", shown in the menu */
  name: string;
  /** Put before converted amounts, like "$". Defaults to the code and a space */
  symbol?: string;
  /** How much of this currency one unit of the base buys. The base itself is 1 */
  rate: number;
  /** Decimals in converted amounts. 2 by default, 0 for yen */
  decimals?: number;
  /** Your own flag, shown in front of the code. USD, EUR, GBP, JPY, CAD and AUD have theirs built in */
  flag?: ReactNode;
}

/** The currencies and rates the site's card uses, against the US dollar */
export const CurrencyConverterCurrencies: CurrencyConverterCurrency[] = [
  { code: 'USD', name: 'US dollar', symbol: '$', rate: 1 },
  { code: 'EUR', name: 'Euro', symbol: '€', rate: .92 },
  { code: 'GBP', name: 'Pound', symbol: '£', rate: .79 },
  { code: 'JPY', name: 'Yen', symbol: '¥', rate: 149.6, decimals: 0 },
  { code: 'CAD', name: 'Canadian dollar', symbol: 'C$', rate: 1.37 },
  { code: 'AUD', name: 'Australian dollar', symbol: 'A$', rate: 1.52 }
];

/* each built-in currency's flag: the ones Country select draws, and the European Union's twelve stars, drawn here the same way */
const COUNTRY: Record<string, FlagCode> = { USD: 'US', GBP: 'GB', JPY: 'JP', CAD: 'CA', AUD: 'AU' };
const EU = '<svg viewBox="0 0 640 480"><path fill="#039" d="M0 0h640v480H0z"/><path fill="#fc0" d="M320 53.3 326 71.8 345.4 71.8 329.7 83.1 335.7 101.6 320 90.2 304.3 101.6 310.3 83.1 294.6 71.8 314 71.8zM400 74.8 406 93.2 425.4 93.2 409.7 104.6 415.7 123 400 111.6 384.3 123 390.3 104.6 374.6 93.2 394 93.2zM458.6 133.3 464.6 151.8 483.9 151.8 468.3 163.1 474.2 181.6 458.6 170.2 442.9 181.6 448.9 163.1 433.2 151.8 452.6 151.8zM480 213.3 486 231.8 505.4 231.8 489.7 243.1 495.7 261.6 480 250.2 464.3 261.6 470.3 243.1 454.6 231.8 474 231.8zM458.6 293.3 464.6 311.8 483.9 311.8 468.3 323.1 474.2 341.6 458.6 330.2 442.9 341.6 448.9 323.1 433.2 311.8 452.6 311.8zM400 351.9 406 370.3 425.4 370.3 409.7 381.7 415.7 400.1 400 388.8 384.3 400.1 390.3 381.7 374.6 370.3 394 370.3zM320 373.3 326 391.8 345.4 391.8 329.7 403.1 335.7 421.6 320 410.2 304.3 421.6 310.3 403.1 294.6 391.8 314 391.8zM240 351.9 246 370.3 265.4 370.3 249.7 381.7 255.7 400.1 240 388.8 224.3 400.1 230.3 381.7 214.6 370.3 234 370.3zM181.4 293.3 187.4 311.8 206.8 311.8 191.1 323.1 197.1 341.6 181.4 330.2 165.8 341.6 171.7 323.1 156.1 311.8 175.4 311.8zM160 213.3 166 231.8 185.4 231.8 169.7 243.1 175.7 261.6 160 250.2 144.3 261.6 150.3 243.1 134.6 231.8 154 231.8zM181.4 133.3 187.4 151.8 206.8 151.8 191.1 163.1 197.1 181.6 181.4 170.2 165.8 181.6 171.7 163.1 156.1 151.8 175.4 151.8zM240 74.8 246 93.2 265.4 93.2 249.7 104.6 255.7 123 240 111.6 224.3 123 230.3 104.6 214.6 93.2 234 93.2z"/></svg>';
const flagOf = (c: CurrencyConverterCurrency) => (
  <span className="dm-ccx-fl">
    {c.flag ?? (COUNTRY[c.code] ? <Flag code={COUNTRY[c.code]} />
      : c.code === 'EUR' ? <img className="dm-flag" alt="" src={'data:image/svg+xml,' + encodeURIComponent(EU.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" '))} />
      : <span className="dm-flag" />)}
  </span>
);

export interface CurrencyConverterProps {
  /** The currencies to pick from, with their rates. The component never fetches rates itself */
  currencies?: CurrencyConverterCurrency[];
  /** The text in the amount field, like "24.00". Leave it out to let the field keep it */
  amount?: string;
  defaultAmount?: string;
  onAmountChange?: (amount: string) => void;
  /** The code of the currency paid in */
  from?: string;
  defaultFrom?: string;
  onFromChange?: (code: string) => void;
  /** The code of the currency it converts to */
  to?: string;
  defaultTo?: string;
  onToChange?: (code: string) => void;
  /** The label over the amount */
  payLabel?: string;
  /** The label over the converted amount */
  seeLabel?: string;
  /** After the rate, like "updated 2 min ago". Leave it empty to show only the rate */
  updated?: string;
  /** For the thousands separators in converted amounts */
  locale?: string;
  className?: string;
}

/** Converts an amount between two currencies, with a menu for each and a button that swaps them. */
export function CurrencyConverter({ currencies = CurrencyConverterCurrencies, amount, defaultAmount = '24.00', onAmountChange, from, defaultFrom = 'USD', onFromChange,
  to, defaultTo = 'EUR', onToChange, payLabel = 'You pay', seeLabel = 'They see', updated = 'updated 2 min ago', locale = 'en-US', className }: CurrencyConverterProps) {
  const [text, setText] = useControllable(amount, defaultAmount, onAmountChange);
  const [a, setA] = useControllable(from, defaultFrom, onFromChange);
  const [b, setB] = useControllable(to, defaultTo, onToChange);
  const [turned, setTurned] = useState(false);
  const pay = usePopover({ align: 'end' }), see = usePopover({ align: 'end' });
  const cur = (code: string) => currencies.find(c => c.code === code) ?? currencies[0];
  const A = cur(a), B = cur(b);

  const n = parseFloat(text.replace(/[^\d.]/g, '')) || 0;
  // the converted amount rolls to each new value, starting from 0 when the card appears
  const shown = useTween(n / A.rate * B.rate, 450, 0);
  const dp = B.decimals ?? 2;
  const out = (B.symbol ?? B.code + ' ') + shown.toLocaleString(locale, { minimumFractionDigits: dp, maximumFractionDigits: dp });

  // picking the currency already on the other side moves that side to the next one
  const pick = (side: 'from' | 'to', code: string) => {
    const other = side === 'from' ? b : a;
    const next = code === other ? currencies.find(c => c.code !== code)!.code : other;
    if (side === 'from') { setA(code); if (next !== b) setB(next); } else { setB(code); if (next !== a) setA(next); }
  };
  // swapping carries the converted amount over, so the money stays the same
  const swap = () => {
    setTurned(t => !t);
    setText(shown.toFixed(B.decimals ?? 2));
    setA(b); setB(a);
  };

  const menu = (side: 'from' | 'to', p: ReturnType<typeof usePopover>, value: string) => (
    <div {...p.pop} role="menu">
      {currencies.map(c => (
        <button key={c.code} type="button" className="dm-mi" role="menuitemradio" aria-checked={c.code === value} onClick={() => { pick(side, c.code); p.closeSoon(); }}>
          {flagOf(c)}<span className="dm-cd">{c.code}</span><span>{c.name}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
        </button>
      ))}
    </div>
  );

  return (
    <div data-dm="" className={cx('dm-ccx dm-panel', className)}>
      <div className="dm-ccx-row">
        <div className="dm-ccx-in">
          <span className="dm-muted">{payLabel}</span>
          <input className="dm-ccx-a dm-num" value={text} inputMode="decimal" aria-label="Amount"
            onChange={e => setText(e.target.value.replace(/[^\d.]/g, ''))} onBlur={() => setText((parseFloat(text) || 0).toFixed(2))} />
        </div>
        <button type="button" {...pay.trigger} className="dm-ccx-cur">{flagOf(A)}<Swap className="dm-cd">{A.code}</Swap><Icon name="chev-d" size="xs" /></button>
      </div>
      <Tip label="Swap"><button type="button" className={cx('dm-ccx-sw', turned && 'dm-go')} aria-label="Swap currencies" onClick={swap}><Icon name="sort" size="xs" /></button></Tip>
      <div className="dm-ccx-row">
        <div className="dm-ccx-in"><span className="dm-muted">{seeLabel}</span><b className="dm-ccx-b dm-num">{out}</b></div>
        <button type="button" {...see.trigger} className="dm-ccx-cur">{flagOf(B)}<Swap className="dm-cd">{B.code}</Swap><Icon name="chev-d" size="xs" /></button>
      </div>
      <div className="dm-ccx-rate dm-muted dm-num"><span className="dm-dot" />1 {A.code} = {(B.rate / A.rate).toFixed(4)} {B.code}{updated && ` · ${updated}`}</div>
      {menu('from', pay, a)}
      {menu('to', see, b)}
    </div>
  );
}
