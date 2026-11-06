'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { OtpField, type OtpStatus } from '../components/otp-field/OtpField';
import { useStory, useWait } from './useScript';

/* ---------- OTP field: paste a code with two digits swapped, see it fail, and type the right one ---------- */
const CODE = '482157';

export default function OtpFieldDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [code, setCode] = useState('');
  const [status, setStatus] = useState<OtpStatus>('idle');
  const [tries, setTries] = useState(3);
  const [left, setLeft] = useState(30);

  // the resend link waits thirty seconds
  useEffect(() => {
    if (left <= 0 || status === 'success') return;
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [left, status]);

  // the code is checked as soon as the last box is filled
  const check = async (c: string) => {
    setStatus('checking'); await wait(900);
    if (c === CODE) return setStatus('success');
    setTries(t => t - 1); setStatus('error');
  };

  // the preview's story: a paste with two digits swapped, then the right code typed a digit at a time
  useStory(ref, async ({ wait }) => {
    await wait(2000); setCode('482175');
    await wait(3500);
    for (let i = 1; i <= 6; i++) { setStatus('idle'); setCode(CODE.slice(0, i)); await wait(500); }
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <OtpField description="Enter the 6-digit code we sent to maya@designme.studio" value={code}
        onValueChange={v => { setCode(v); if (status === 'error') setStatus('idle'); }} onComplete={c => void check(c)} status={status}
        message={status === 'error' ? `That code doesn't match. ${tries ? `${tries} ${tries === 1 ? 'try' : 'tries'} left` : 'Send a new code to try again'}` : status === 'success' ? 'Email verified' : undefined}
        footer={left > 0 ? <>Resend code in <span className="dm-num">0:{String(left).padStart(2, '0')}</span></> : <button type="button" onClick={() => setLeft(30)}>Resend code</button>} />
    </div>
  );
}
