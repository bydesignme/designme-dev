'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { SignIn, type SignInStep } from '../components/sign-in/SignIn';
import { useStory, useWait } from './useScript';

const CODE = '482157';

/* ---------- Sign in: type an email and send it, the email arrives, copy its code and paste it in ---------- */
export default function SignInDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<SignInStep>('email');
  const [code, setCode] = useState('');
  const wait = useWait();

  // the preview's story; anyone can take over and go through it with their own email and any 6 digits
  useStory(ref, async ({ wait, press, taken }) => {
    await wait(1000);
    // taking over while it types takes the letters back
    let typed = '', typing = true;
    taken(() => { if (typing) setEmail(''); });
    for (const ch of 'maya@studio.com') { typed += ch; setEmail(typed); await wait(40); }
    typing = false;
    await wait(500); press('.dm-sgx-go');
    await wait(2800); press('.dm-sgx-cp');
    await wait(1000); setCode(CODE);
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <SignIn email={email} onEmailChange={setEmail} step={step} onStepChange={setStep} code={code} onCodeChange={setCode}
        onSendCode={() => wait(800)} onVerify={() => wait(1100).then(() => true)}
        inbox={{ code: CODE, text: <>Your sign-in code is <span className="dm-num">482 157</span></> }} hint="Copy it from the email above" />
    </div>
  );
}
