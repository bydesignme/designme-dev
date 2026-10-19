'use client';
// The preview from designme.dev, rebuilt from the React component: an example of keeping its values in your own state.
import { useState } from 'react';
import { CurrencyConverter } from '../components/currency-converter/CurrencyConverter';

/* ---------- Currency converter: $24 in euros; type, pick currencies or swap them ---------- */
export default function CurrencyConverterDemo() {
  const [amount, setAmount] = useState('24.00');
  const [from, setFrom] = useState('USD');
  const [to, setTo] = useState('EUR');
  return <CurrencyConverter amount={amount} onAmountChange={setAmount} from={from} onFromChange={setFrom} to={to} onToChange={setTo} />;
}
