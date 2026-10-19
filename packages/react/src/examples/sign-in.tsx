'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { SignIn, type SignInStep } from '../components/sign-in/SignIn';
import { useScript, useWait } from './useScript';

const CODE = '482157';

/* ---------- Sign in: the email types itself and the code half arrives; click the boxes to fill the rest ---------- */
export default function SignInDemo() {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<SignInStep>('email');
  const [sending, setSending] = useState(false);
  const [code, setCode] = useState('');
  const latest = useRef('');
  const write = (c: string) => { latest.current = c; setCode(c); };
  const wait = useWait();

  useScript(async ({ wait }) => {
    await wait(1000);
    let typed = '';
    for (const ch of 'maya@studio.com') { typed += ch; setEmail(typed); await wait(40); }
    await wait(300);
    // the first digits arrive 1.4s after the send, while the code screen is already up
    setSending(true); await wait(800); setSending(false); setStep('code');
    await wait(600);
    for (let j = 0; j < 4; j++) { write(CODE.slice(0, j + 1)); await wait(160); }
  });

  // clicking the boxes fills the missing digits, one at a time
  const fill = async () => {
    for (let j = 0; j < CODE.length; j++) {
      const now = latest.current.padEnd(CODE.length, ' ');
      if (now[j] !== ' ') continue;
      write((now.slice(0, j) + CODE[j] + now.slice(j + 1)).trimEnd());
      await wait(110);
    }
  };

  return (
    <div style={{ width: '100%' }}>
      <SignIn email={email} onEmailChange={setEmail} step={step} onStepChange={setStep} sending={sending}
        code={code} onCodeChange={write} onSendCode={() => wait(800)} onVerify={() => wait(1100).then(() => true)}
        onFillRequest={fill} hint="Click the code to fill it" />
    </div>
  );
}
