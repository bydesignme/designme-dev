'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { PaymentForm, type PaymentCard } from '../components/payment-form/PaymentForm';
import { useScript } from './useScript';

/* ---------- Payment form: a test card number types itself in; finish the expiry and CVC and pay ---------- */
export default function PaymentFormDemo() {
  const [card, setCard] = useState<PaymentCard>({ number: '', expiry: '', cvc: '' });
  useScript(async ({ wait }) => {
    await wait(1000);
    for (const ch of '4242424242424242') { setCard(c => ({ ...c, number: c.number + ch })); await wait(45); }
  });
  return (
    <div style={{ width: '100%' }}>
      <PaymentForm card={card} onCardChange={setCard} note="Demo only. Nothing is charged."
        onPay={() => new Promise<void>(res => setTimeout(res, 1200))} />
    </div>
  );
}
