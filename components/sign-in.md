# Sign in

> Email first, then the one-time code from the email, copied or typed in.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/sign-in

## Install

```sh
npx designme add sign-in          # HTML, CSS and JS, with the shared core
npx designme add sign-in --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Sign in is a passwordless sign-in card in three steps: the person enters an email, types the one-time code they were sent into separate digit boxes, and sees a short confirmation. The code checks itself as soon as the last box is filled. It suits agent products that sign people in by email instead of with a password.

### When to use it

- When people sign in with an emailed one-time code instead of a password
- When the code should be checked the moment it is complete, with no extra submit button
- When a wrong code should clear the boxes and let the person try again in place
- When you want a resend countdown so people don't request codes over and over

### What it does

- The email step checks the address shape and shows `emptyEmailLabel` or `badEmailLabel`, with the field shaking on each failed try.
- If `onSendCode` returns a promise, the button spins until it settles, and a rejection's message shows under the field.
- The code boxes accept typing, Backspace back to the previous box, and a pasted or autofilled code that spreads across the boxes.
- Pass `inbox` and the email with the code arrives at the top of the code screen, the way a phone shows it, with Copy code. Copy puts the code on the clipboard and calls `onCopyCode`; pasting it into the boxes fills them all.
- Once every box is filled, `onVerify` runs; returning false clears the boxes and shows `wrongCodeLabel`.
- A resend countdown runs from `resendIn` seconds, 30 by default, then turns into a Resend code button that calls `onResend`.
- A confirmed code shows a check, then the done screen with `doneTitle`, kept at the height the code screen had, and calls `onSignedIn`.

### Accessibility

- Each code box has an `aria-label` like "Digit 1" inside a `group` labelled "Code", and the first box uses `autocomplete="one-time-code"`.
- The email input sets `aria-invalid` when the address is missing or malformed.
- The resend line is an `aria-live="polite"` region, so verifying, confirmed and wrong code messages are announced.
- The done screen has `role="status"`.

## Usage in React

```tsx
import { SignIn } from '@/components/designme/sign-in/SignIn';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { SignIn, type SignInStep } from './SignIn';
import { useStory, useWait } from '../lib/useScript';

const CODE = '482157';

/* ---------- Sign in: type an email and send it, the email arrives, copy its code and paste it in ---------- */
export default function SignInDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [step, setStep] = useState<SignInStep>('email');
  const [code, setCode] = useState('');
  const wait = useWait();

  // the preview's story; anyone can take over and go through it with their own email and any 6 digits
  useStory(ref, async ({ wait, press }) => {
    await wait(1000);
    let typed = '';
    for (const ch of 'maya@studio.com') { typed += ch; setEmail(typed); await wait(40); }
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
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` (optional) | `ReactNode` | Defaults to "Sign in" |
| `subtitle` (optional) | `ReactNode` | Defaults to "We will email you a code" |
| `label` (optional) | `string` | The email field's label. Defaults to "Email" |
| `placeholder` (optional) | `string` |  |
| `sendLabel` (optional) | `string` | Defaults to "Send code" |
| `email` (optional) | `string` | The email address. Leave it out to let the field hold its own |
| `defaultEmail` (optional) | `string` |  |
| `onEmailChange` (optional) | `(email: string) => void` |  |
| `step` (optional) | `SignInStep` | Which screen shows: the email, the code or the confirmation. Leave it out to let the form move itself along |
| `defaultStep` (optional) | `SignInStep` |  |
| `onStepChange` (optional) | `(step: SignInStep) => void` |  |
| `onSendCode` (optional) | `(email: string) => void \| Promise<void>` | Called with a valid email. Return a promise and the button spins until it settles; if it rejects, its message shows under the field |
| `sending` (optional) | `boolean` | Shows the spinner on the button, for when you send the code yourself |
| `code` (optional) | `string` | The digits typed so far. A space stands for an empty box, so "48 1" has the third box empty |
| `defaultCode` (optional) | `string` |  |
| `onCodeChange` (optional) | `(code: string) => void` |  |
| `codeLength` (optional) | `number` | How many boxes. Defaults to 6 |
| `onVerify` (optional) | `(code: string, email: string) => boolean \| void \| Promise<boolean \| void>` | Called once every box is filled. Return false, or a promise of false, for a wrong code; the boxes clear and say so |
| `onFillRequest` (optional) | `() => void` | Called when the person clicks the code boxes while some are empty, for filling the code in for them |
| `inbox` (optional) | `{ from?: ReactNode; text?: ReactNode; code: string; copyLabel?: string; copiedLabel?: string }` | The email with the code, shown arriving at the top of the code screen the way a phone shows it, with Copy code. Copy puts `code` on the clipboard; pasting it into the boxes fills them all |
| `onCopyCode` (optional) | `(code: string) => void` | Called by Copy code |
| `hint` (optional) | `ReactNode` | A quiet note after the resend countdown, like "Click the code to fill it" |
| `resendIn` (optional) | `number` | Seconds before the code can be sent again. Defaults to 30 |
| `onResend` (optional) | `(email: string) => void` | Called by Resend code, once the countdown ends; the countdown starts again |
| `onSignedIn` (optional) | `(email: string) => void` | Called when the confirmation shows |
| `codeTitle` (optional) | `ReactNode` |  |
| `codeSubtitle` (optional) | `ReactNode` |  |
| `doneTitle` (optional) | `ReactNode` |  |
| `doneDetail` (optional) | `ReactNode` |  |
| `emptyEmailLabel` (optional) | `string` |  |
| `badEmailLabel` (optional) | `string` |  |
| `wrongCodeLabel` (optional) | `string` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I check the code against my backend?**

Pass `onVerify(code, email)`. Return true, nothing, or a promise of either to accept it. Return false, or throw, and the boxes clear with the wrong code message.

**Will a one-time code from the phone's keyboard fill all six boxes?**

The first box has `autocomplete="one-time-code"`, and several digits entered at once spread across the boxes from there. Pasting a code into any box fills from the first box.

**Can I use a four-digit code instead of six?**

Yes. Set `codeLength` to 4. The default subtitle updates to say how many digits to enter.

## Source

`SignIn.tsx`, as `npx designme add sign-in --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ClipboardEvent, type CSSProperties, type FormEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Spin, Swap } from '../lib/motion';
import '../designme.css';
import './sign-in.css';

export type SignInStep = 'email' | 'code' | 'done';

export interface SignInProps {
  /** Defaults to "Sign in" */
  title?: ReactNode;
  /** Defaults to "We will email you a code" */
  subtitle?: ReactNode;
  /** The email field's label. Defaults to "Email" */
  label?: string;
  placeholder?: string;
  /** Defaults to "Send code" */
  sendLabel?: string;
  /** The email address. Leave it out to let the field hold its own */
  email?: string;
  defaultEmail?: string;
  onEmailChange?: (email: string) => void;
  /** Which screen shows: the email, the code or the confirmation. Leave it out to let the form move itself along */
  step?: SignInStep;
  defaultStep?: SignInStep;
  onStepChange?: (step: SignInStep) => void;
  /** Called with a valid email. Return a promise and the button spins until it settles; if it rejects, its message shows under the field */
  onSendCode?: (email: string) => void | Promise<void>;
  /** Shows the spinner on the button, for when you send the code yourself */
  sending?: boolean;
  /** The digits typed so far. A space stands for an empty box, so "48 1" has the third box empty */
  code?: string;
  defaultCode?: string;
  onCodeChange?: (code: string) => void;
  /** How many boxes. Defaults to 6 */
  codeLength?: number;
  /** Called once every box is filled. Return false, or a promise of false, for a wrong code; the boxes clear and say so */
  onVerify?: (code: string, email: string) => boolean | void | Promise<boolean | void>;
  /** Called when the person clicks the code boxes while some are empty, for filling the code in for them */
  onFillRequest?: () => void;
  /** The email with the code, shown arriving at the top of the code screen the way a phone shows it, with Copy code.
      Copy puts `code` on the clipboard; pasting it into the boxes fills them all */
  inbox?: { from?: ReactNode; text?: ReactNode; code: string; copyLabel?: string; copiedLabel?: string };
  /** Called by Copy code */
  onCopyCode?: (code: string) => void;
  /** A quiet note after the resend countdown, like "Click the code to fill it" */
  hint?: ReactNode;
  /** Seconds before the code can be sent again. Defaults to 30 */
  resendIn?: number;
  /** Called by Resend code, once the countdown ends; the countdown starts again */
  onResend?: (email: string) => void;
  /** Called when the confirmation shows */
  onSignedIn?: (email: string) => void;
  codeTitle?: ReactNode;
  codeSubtitle?: ReactNode;
  doneTitle?: ReactNode;
  doneDetail?: ReactNode;
  emptyEmailLabel?: string;
  badEmailLabel?: string;
  wrongCodeLabel?: string;
  className?: string;
}

const EMAIL = /^\S+@\S+\.\S+$/;
const digit = (c: string | undefined) => (c ?? '').replace(/\D/g, '');

/** Sign in with an emailed code: the email, then the code boxes, then a short confirmation. */
export function SignIn({
  title = 'Sign in', subtitle = 'We will email you a code', label = 'Email', placeholder = 'you@studio.com', sendLabel = 'Send code',
  email, defaultEmail = '', onEmailChange, step, defaultStep = 'email', onStepChange, onSendCode, sending = false,
  code, defaultCode = '', onCodeChange, codeLength = 6, onVerify, onFillRequest, inbox, onCopyCode, hint, resendIn = 30, onResend, onSignedIn,
  codeTitle = 'Check your inbox', codeSubtitle = `Enter the ${codeLength} digit code`, doneTitle = "You're in", doneDetail = 'Opening your workspace',
  emptyEmailLabel = 'Enter your email', badEmailLabel = 'That email looks incomplete', wrongCodeLabel = "That code didn't work, try again", className
}: SignInProps) {
  const [mail, setMail] = useControllable(email, defaultEmail, onEmailChange);
  const [now, setStep] = useControllable(step, defaultStep, onStepChange);
  const [digits, setCode] = useControllable(code, defaultCode, onCodeChange);
  const [error, setError] = useState('');
  const [bad, setBad] = useState(false);
  const [busy, setBusy] = useState(false);
  const [check, setCheck] = useState<'idle' | 'verifying' | 'confirmed'>('idle');
  const [wrong, setWrong] = useState(false);
  const [left, setLeft] = useState(resendIn);
  const [pop, setPop] = useState<number[]>([]);
  const field = useRef<HTMLLabelElement>(null);
  const boxes = useRef<(HTMLInputElement | null)[]>([]);
  const focusCode = useRef(false);
  const root = useRef<HTMLDivElement>(null);
  // the email arrives a moment after the code screen shows, and is copied once
  const [arrived, setArrived] = useState(false);
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (now !== 'code' || !inbox) { setArrived(false); setCopied(false); return; }
    const t = setTimeout(() => setArrived(true), 900);
    return () => clearTimeout(t);
  }, [now, !!inbox]); // eslint-disable-line react-hooks/exhaustive-deps
  const copy = () => {
    if (!inbox) return;
    try { navigator.clipboard?.writeText(inbox.code).catch(() => {}); } catch { /* the clipboard can be off limits; the code is still on screen */ }
    setCopied(true); onCopyCode?.(inbox.code);
    boxes.current.find(b => b && !b.value)?.focus({ preventScroll: true });
  };
  // the confirmation keeps the height the code screen had, so it stays centred where it sits
  const [held, setHeld] = useState<number>();

  // a new screen slides in, except the one the form starts on; the countdown restarts with every code
  const [seen, setSeen] = useState(now);
  const [moved, setMoved] = useState(false);
  if (seen !== now) {
    setSeen(now); setMoved(true);
    if (now === 'code') { setLeft(resendIn); setWrong(false); }
    if (now !== 'done') setCheck('idle');
  }

  const chars = Array.from({ length: codeLength }, (_, i) => digit(digits[i]));
  const write = (next: string[]) => setCode(next.map(c => c || ' ').join('').trimEnd());

  // each digit pops a little as it lands, typed or filled in
  const before = useRef(chars);
  useEffect(() => {
    const was = before.current; before.current = chars;
    const fresh = chars.flatMap((c, i) => (c && !was[i] ? [i] : []));
    if (!fresh.length) return;
    setPop(p => [...p, ...fresh]);
    const t = setTimeout(() => setPop(p => p.filter(i => !fresh.includes(i))), 150);
    return () => clearTimeout(t);
  }, [digits]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (now !== 'code' || !focusCode.current) return;
    focusCode.current = false; boxes.current[0]?.focus({ preventScroll: true });
  }, [now]);

  // the countdown pauses while the code is checked
  useEffect(() => {
    if (now !== 'code' || check !== 'idle' || left <= 0) return;
    const t = setTimeout(() => setLeft(l => l - 1), 1000);
    return () => clearTimeout(t);
  }, [now, check, left]);

  // every box filled: check the code
  const full = chars.every(Boolean);
  useEffect(() => {
    if (now !== 'code' || check !== 'idle' || !full) return;
    let alive = true;
    setCheck('verifying'); setWrong(false);
    boxes.current.forEach(b => b?.blur());
    (async () => {
      let ok: boolean | void = true;
      try { ok = await onVerify?.(chars.join(''), mail.trim()); } catch { ok = false; }
      if (!alive) return;
      if (ok === false) { setCheck('idle'); setWrong(true); write([]); boxes.current[0]?.focus({ preventScroll: true }); return; }
      setCheck('confirmed');
    })();
    return () => { alive = false; };
  }, [full, now]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (check !== 'confirmed') return;
    const t = setTimeout(() => { setHeld(root.current?.offsetHeight); setStep('done'); onSignedIn?.(mail.trim()); }, 1100);
    return () => clearTimeout(t);
  }, [check]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = async (e: FormEvent) => {
    e.preventDefault();
    if (busy || sending) return;
    const v = mail.trim();
    if (!EMAIL.test(v)) {
      // the field shakes again on every try
      const f = field.current;
      if (bad && f) { f.classList.remove('dm-bad'); void f.offsetWidth; f.classList.add('dm-bad'); } else setBad(true);
      setError(v ? badEmailLabel : emptyEmailLabel);
      return;
    }
    setBad(false); setError(''); setBusy(true);
    try { await onSendCode?.(v); } catch (err) { setBusy(false); setError(err instanceof Error && err.message ? err.message : 'The code could not be sent'); return; }
    setBusy(false); write([]); focusCode.current = true; setStep('code');
  };

  const back = () => { setBusy(false); write([]); setStep('email'); };
  const resend = () => { onResend?.(mail.trim()); setLeft(resendIn); };

  const type = (k: number, value: string) => {
    if (check !== 'idle') return;
    const typed = digit(value), next = chars.slice();
    setWrong(false);
    // a whole code at once (an autofilled one-time code) spreads over the boxes; otherwise the last digit typed wins
    if (typed.length > 1 && !chars[k]) {
      typed.slice(0, codeLength - k).split('').forEach((d, j) => { next[k + j] = d; });
      write(next); boxes.current[Math.min(codeLength - 1, k + typed.length)]?.focus();
      return;
    }
    next[k] = typed.slice(-1); write(next);
    if (next[k]) boxes.current[k + 1]?.focus();
  };
  const key = (k: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== 'Backspace' || chars[k] || k === 0) return;
    const next = chars.slice(); next[k - 1] = ''; write(next); boxes.current[k - 1]?.focus();
  };
  const paste = (e: ClipboardEvent<HTMLInputElement>) => {
    const t = digit(e.clipboardData.getData('text')).slice(0, codeLength);
    if (!t || check !== 'idle') return;
    e.preventDefault();
    const next = chars.slice(); t.split('').forEach((d, j) => { next[j] = d; });
    write(next); setWrong(false); boxes.current[Math.min(codeLength - 1, t.length)]?.focus();
  };
  const fill = (e: PointerEvent<HTMLDivElement>) => {
    if (!onFillRequest || full || check !== 'idle') return;
    e.preventDefault(); onFillRequest();
  };

  const slide = moved ? 'dm-in' : undefined;
  return (
    <div data-dm="" ref={root} className={cx('dm-sgx dm-panel', now === 'done' && held && 'dm-held', className)} style={now === 'done' && held ? { minHeight: held } : undefined}>
      {now === 'email' && (
        <form key="email" className={cx('dm-sgx-st dm-sgx-1', slide)} noValidate onSubmit={send}>
          <b>{title}</b><span className="dm-muted">{subtitle}</span>
          <label ref={field} className={cx('dm-sgx-f', bad && 'dm-bad')}>
            <span>{label}</span>
            <input type="email" name="email" autoComplete="email" className="dm-sgx-em" placeholder={placeholder} value={mail}
              aria-invalid={bad || undefined} onChange={e => setMail(e.target.value)} />
          </label>
          <Swap className="dm-sgx-err">{error}</Swap>
          <button type="submit" className="dm-pill dm-ink dm-sgx-go">{busy || sending ? <Spin /> : sendLabel}</button>
        </form>
      )}
      {now === 'code' && (
        <div key="code" className={cx('dm-sgx-st dm-sgx-2', slide)}>
          {inbox && (
            <Fold open={arrived} className="dm-sgx-ntf">
              <div className="dm-sgx-nt" role="status">
                <span className="dm-sgx-ni"><Icon name="mail" size="xs" /></span>
                <span className="dm-t"><b>{inbox.from ?? 'Designme'} <span className="dm-muted">now</span></b><span>{inbox.text ?? <>Your sign-in code is <span className="dm-num">{inbox.code}</span></>}</span></span>
                <button type="button" className="dm-pill dm-sm dm-sgx-cp" disabled={copied} onClick={copy}><Swap>{copied ? inbox.copiedLabel ?? 'Copied' : inbox.copyLabel ?? 'Copy code'}</Swap></button>
              </div>
            </Fold>
          )}
          <button type="button" className="dm-sgx-bk" onClick={back}><Icon name="chev-l" size="xs" /><span className="dm-sgx-to">{mail.trim()}</span></button>
          <b>{codeTitle}</b><span className="dm-muted">{codeSubtitle}</span>
          <div className={cx('dm-sgx-code', check === 'verifying' && 'dm-vf', check === 'confirmed' && 'dm-ok')} role="group" aria-label="Code" onPointerDown={fill}>
            {chars.map((c, k) => (
              <input key={k} ref={el => { boxes.current[k] = el; }} inputMode="numeric" autoComplete={k === 0 ? 'one-time-code' : 'off'}
                aria-label={`Digit ${k + 1}`} className={pop.includes(k) ? 'dm-f' : undefined} style={{ '--dm-i': k } as CSSProperties}
                value={c} readOnly={check !== 'idle'} onChange={e => type(k, e.target.value)} onKeyDown={e => key(k, e)} onPaste={paste} />
            ))}
          </div>
          <span className="dm-muted dm-sgx-rs" aria-live="polite">
            {check === 'verifying' ? <span className="dm-sgx-v"><Spin />Verifying code</span>
              : check === 'confirmed' ? <span className="dm-sgx-v dm-ok dm-enter"><Icon name="check" size="xs" />Code confirmed</span>
              : wrong ? <span style={{ color: 'var(--dm-bad)' }}>{wrongCodeLabel}</span>
              : left > 0 ? <>Resend in <span className="dm-num">{left}</span>s{hint && <> · <span className="dm-sgx-hint">{hint}</span></>}</>
              : <button type="button" style={{ color: 'var(--dm-accent-fg,var(--dm-accent))', fontWeight: 500 }} onClick={resend}>Resend code</button>}
          </span>
        </div>
      )}
      {now === 'done' && (
        <div className="dm-sgx-done" role="status">
          <svg className="dm-sgx-ck" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="m16 27 7 7 13-14" /></svg>
          <b {...enter(250)}>{doneTitle}</b>
          <span className="dm-muted dm-enter" style={enter(340).style}>{doneDetail}</span>
          <span className="dm-sgx-bar dm-enter" style={enter(430).style}><i /></span>
        </div>
      )}
    </div>
  );
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Tooltip](https://designme.dev/components/tooltip.md): Quiet labels on hover, with shortcuts and a richer preview card.
- [Search input](https://designme.dev/components/search-input.md): Search with scoped filters, recent queries and an agent answer.
- [Country select](https://designme.dev/components/country-select.md): A searchable select with country codes, currency and keyboard support.
- [Multi-select](https://designme.dev/components/multi-select.md): A combobox that filters as you type and keeps your picks as chips.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.

All components: https://designme.dev/llms.txt
