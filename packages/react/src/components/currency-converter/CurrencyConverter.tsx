'use client';
import { useState } from 'react';
import { cx } from '../../lib/cx';
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
          <span className="dm-cd">{c.code}</span><span>{c.name}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
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
        <button type="button" {...pay.trigger} className="dm-ccx-cur"><Swap className="dm-cd">{A.code}</Swap><Icon name="chev-d" size="xs" /></button>
      </div>
      <Tip label="Swap"><button type="button" className={cx('dm-ccx-sw', turned && 'dm-go')} aria-label="Swap currencies" onClick={swap}><Icon name="sort" size="xs" /></button></Tip>
      <div className="dm-ccx-row">
        <div className="dm-ccx-in"><span className="dm-muted">{seeLabel}</span><b className="dm-ccx-b dm-num">{out}</b></div>
        <button type="button" {...see.trigger} className="dm-ccx-cur"><Swap className="dm-cd">{B.code}</Swap><Icon name="chev-d" size="xs" /></button>
      </div>
      <div className="dm-ccx-rate dm-muted dm-num"><span className="dm-dot" />1 {A.code} = {(B.rate / A.rate).toFixed(4)} {B.code}{updated && ` · ${updated}`}</div>
      {menu('from', pay, a)}
      {menu('to', see, b)}
    </div>
  );
}
