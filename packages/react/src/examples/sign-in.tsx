'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { SignIn, type SignInStep } from '../components/sign-in/SignIn';
import { useStory, useWait } from './useScript';

const CODE = '482157';

/* ---------- Sign in: type an email and send it; the code arrives and Mail offers it; type it with two digits swapped, see it
   fail, then take the one Mail offers ---------- */
export default function SignInDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<SignInStep>('email');
  const [code, setCode] = useState('');
  const wait = useWait();

  // the preview's story; anyone can take over and go through it with their own email, typing 482 157 or pressing the chip
  useStory(ref, async ({ wait, press, taken }) => {
    await wait(1000);
    // taking over while it types takes the letters back
    let typed = '', typing = true;
    taken(() => { if (typing) setEmail(''); });
    for (const ch of 'maya@studio.com') { typed += ch; setEmail(typed); await wait(40); }
    typing = false;
    await wait(500); press('.dm-sgx-go');
    await wait(2400);
    let wrong = '';
    for (const d of '482175') { wrong += d; setCode(wrong); await wait(250); }
    await wait(3200); press('.dm-sgx-sug');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <SignIn email={email} onEmailChange={setEmail} step={step} onStepChange={setStep} code={code} onCodeChange={setCode}
        onSendCode={() => wait(800)} onVerify={c => wait(1100).then(() => c === CODE)}
        inbox={{ code: '482 157' }} />
    </div>
  );
}
