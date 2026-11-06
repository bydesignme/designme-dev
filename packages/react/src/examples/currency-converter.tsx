'use client';
// The preview from designme.dev, rebuilt from the React component: an example of keeping its values in your own state.
import { useRef, useState } from 'react';
import { useStory } from './useScript';
import { CurrencyConverter, CurrencyConverterCurrencies } from '../components/currency-converter/CurrencyConverter';

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
