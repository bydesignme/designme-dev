# Currency converter

> Show plan prices in local currency, with a swap and live rate.

App basics / Product. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/currency-converter

## Install

```sh
npx designme add currency-converter          # HTML, CSS and JS, with the shared core
npx designme add currency-converter --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Currency converter takes an amount in one currency and shows what it comes to in another, with the exchange rate underneath. Each side has a menu to pick a currency, and a swap button flips the two while keeping the same amount of money. It helps people outside your home market understand what a plan or an agent run will cost them.

### When to use it

- When a pricing or billing page should show plan prices in a buyer's local currency
- When an agent quotes a cost and the person wants to see it in their own currency
- When you have your own exchange rates and need a small converter to display them
- When people should see the rate and how recently it was updated

### What it does

- The converted amount rolls to each new value as the amount or currencies change.
- Each side opens a menu of `currencies` with code and name, and the current one is checked.
- Picking the currency already on the other side moves that side to a different currency, so the two never match.
- Swap flips the currencies and carries the converted amount into the amount field.
- The rate line reads like "1 USD = 0.9200 EUR", followed by the `updated` text.
- Each currency sets its own `symbol`, `rate` against the base and `decimals`, such as 0 for yen, and `locale` sets the thousands separators.

### Accessibility

- The amount input is labelled Amount and opens a decimal keypad on touch devices.
- Currency menus use `role="menu"` with `menuitemradio` items and `aria-checked` on the selected currency.
- The currency buttons report `aria-expanded`, and Escape closes an open menu and returns focus to its button.
- The icon-only swap button has the label "Swap currencies" and a tooltip.

## Usage in React

```tsx
import { CurrencyConverter } from '@/components/designme/currency-converter/CurrencyConverter';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: an example of keeping its values in your own state.
import { useRef, useState } from 'react';
import { useStory } from '../lib/useScript';
import { CurrencyConverter, CurrencyConverterCurrencies } from './CurrencyConverter';

const rate = (code: string) => CurrencyConverterCurrencies.find(c => c.code === code)?.rate ?? 1;

/* ---------- Currency converter: $24 in euros; type, pick currencies or swap them ---------- */
export default function CurrencyConverterDemo() {
  const [amount, setAmount] = useState('24.00');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  // once it has appeared it converts a new amount, then swaps the two currencies, carrying the money over. Clicking, focusing
  // or typing in it takes over, and the amount it was halfway through typing goes back to what it was
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, taken }) => {
    let typing = false;
    taken(() => { if (typing) setAmount('24.00'); });
    await wait(1500); typing = true;
    for (const typed of ['1', '12', '120']) { await wait(150); setAmount(typed); }
    typing = false;
    await wait(250); setAmount('120.00');
    await wait(1300);
    setAmount((120 / rate('USD') * rate('EUR')).toFixed(2)); setFrom('EUR'); setTo('USD');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <CurrencyConverter amount={amount} onAmountChange={setAmount} from={from} onFromChange={setFrom} to={to} onToChange={setTo} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `currencies` (optional) | `CurrencyConverterCurrency[]` | The currencies to pick from, with their rates. The component never fetches rates itself |
| `amount` (optional) | `string` | The text in the amount field, like "24.00". Leave it out to let the field keep it |
| `defaultAmount` (optional) | `string` |  |
| `onAmountChange` (optional) | `(amount: string) => void` |  |
| `from` (optional) | `string` | The code of the currency paid in |
| `defaultFrom` (optional) | `string` |  |
| `onFromChange` (optional) | `(code: string) => void` |  |
| `to` (optional) | `string` | The code of the currency it converts to |
| `defaultTo` (optional) | `string` |  |
| `onToChange` (optional) | `(code: string) => void` |  |
| `payLabel` (optional) | `string` | The label over the amount |
| `seeLabel` (optional) | `string` | The label over the converted amount |
| `updated` (optional) | `string` | After the rate, like "updated 2 min ago". Leave it empty to show only the rate |
| `locale` (optional) | `string` | For the thousands separators in converted amounts |
| `className` (optional) | `string` |  |

## Questions

**Where do the exchange rates come from?**

From you. The component never fetches rates. Pass `currencies` with a `rate` for each, measured against a base currency whose rate is 1, and set `updated` to say how fresh they are.

**Why does the amount change when I press swap?**

Swap keeps the money the same. The converted amount becomes the new amount, so 24 USD shown as 22.08 EUR becomes 22.08 EUR converting back to USD.

**How do I show yen without decimals?**

Set `decimals: 0` on that currency. The built-in list already does this for JPY.

## Source

`CurrencyConverter.tsx`, as `npx designme add currency-converter --react` installs it:

```tsx
'use client';
import { useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
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
```

## More in Product

- [Pricing cards](https://designme.dev/components/pricing-cards.md): Three plans with a billing switch and a seat slider.
- [Onboarding checklist](https://designme.dev/components/onboarding-checklist.md): First steps with a progress ring, and the agent can do some for you.
- [Stepper](https://designme.dev/components/stepper.md): A multi-step setup with a progress track that fills as you go.
- [Set limit](https://designme.dev/components/set-limit.md): A monthly agent budget with a draggable cap and a forecast.

All components: https://designme.dev/llms.txt
