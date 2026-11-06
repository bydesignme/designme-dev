'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { PaymentForm, type PaymentCard } from '../components/payment-form/PaymentForm';
import { useStory } from './useScript';

/* ---------- Payment form: a test card number types itself in; finish the expiry and CVC and pay ---------- */
export default function PaymentFormDemo() {
  const [card, setCard] = useState<PaymentCard>({ number: '', expiry: '', cvc: '' });
  // the preview types a test card on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, taken }) => {
    await wait(1000);
    let typing = true;
    taken(() => { if (typing) setCard(c => ({ ...c, number: '' })); });
    for (const ch of '4242424242424242') { setCard(c => ({ ...c, number: c.number + ch })); await wait(45); }
    typing = false;
    typing = false;
  });
  return (
    <div ref={ref} className="dm-pyx-wrap">
      <PaymentForm card={card} onCardChange={setCard}
        onPay={() => new Promise<void>(res => setTimeout(res, 1200))} />
      <span className="dm-muted dm-pyx-n">Demo only. Nothing is charged.</span>
    </div>
  );
}
