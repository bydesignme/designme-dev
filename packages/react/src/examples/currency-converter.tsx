'use client';
// The preview from designme.dev, rebuilt from the React component: an example of keeping its values in your own state.
import { useRef, useState } from 'react';
import { useScript } from './useScript';
import { CurrencyConverter, CurrencyConverterCurrencies } from '../components/currency-converter/CurrencyConverter';

const rate = (code: string) => CurrencyConverterCurrencies.find(c => c.code === code)?.rate ?? 1;

/* ---------- Currency converter: $24 in euros; type, pick currencies or swap them ---------- */
export default function CurrencyConverterDemo() {
  const [amount, setAmount] = useState('24.00');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  // once it has appeared it converts a new amount, then swaps the two currencies, carrying the money over. Touching it takes over
  const touched = useRef(false);
  useScript(async ({ wait }) => {
    await wait(1500); if (touched.current) return;
    for (const typed of ['1', '12', '120']) { await wait(150); if (touched.current) return; setAmount(typed); }
    await wait(250); if (touched.current) return; setAmount('120.00');
    await wait(1300); if (touched.current) return;
    setAmount((120 / rate('USD') * rate('EUR')).toFixed(2)); setFrom('EUR'); setTo('USD');
  });
  return (
    <div style={{ width: '100%' }} onPointerDown={() => { touched.current = true; }} onFocus={() => { touched.current = true; }}>
      <CurrencyConverter amount={amount} onAmountChange={setAmount} from={from} onFromChange={setFrom} to={to} onToChange={setTo} />
    </div>
  );
}
