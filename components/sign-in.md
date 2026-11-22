# Sign in

> Email first, then the one-time code from the email, copied or typed in.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/sign-in

## Install

```sh
npx designme add sign-in          # HTML, CSS and JS, with the shared core
npx designme add sign-in --react  # React 19 component and its CSS
npx designme add sign-in --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/sign-in.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/sign-in.json  # Astro
```

## About

Sign in is a passwordless sign-in card in three steps: the person enters an email, types the one-time code they were sent into separate digit boxes, and sees a short confirmation. The code checks itself as soon as the last box is filled. It suits agent products that sign people in by email instead of with a password.

### When to use it

- When people sign in with an emailed one-time code instead of a password
- When the code should be checked the moment it is complete, with no extra submit button
- When a wrong code should clear the boxes and let the person try again in place
- When you want a resend countdown so people don't request codes over and over

### What it does

- The email step checks the address shape and shows `emptyEmailLabel` or `badEmailLabel` under the field, in red words after an alert mark with no red fill, and the field shakes on each failed try. The line opens and closes instead of keeping room for itself.
- If `onSendCode` returns a promise, the button spins until it settles, and a rejection's message shows under the field.
- The code boxes accept typing, Backspace back to the previous box, and a pasted or autofilled code that spreads across the boxes. Every box has the same fill and edge; the focused box, or with none focused the next one to fill, has the field's focus edge.
- Pass `inbox` and, a moment after the code screen shows, its code is offered under the boxes the way a phone offers a one-time code: a quiet chip like From Mail 482 157 (`from` names where it came from). Pressing it fills every box and calls `onAutofill`, and the chip folds away; the card grows and shrinks smoothly for it.
- Once every box is filled, `onVerify` runs while the boxes dim a little and the line under them says Verifying code with a moving highlight; returning false clears the boxes, edges them in red with a short shake (none with reduced motion) and shows `wrongCodeLabel` in red after an alert mark, until typing starts over.
- A resend countdown runs from `resendIn` seconds, 30 by default, then turns into a Resend code button that calls `onResend`.
- A confirmed code shows a green tick and Code confirmed, then the done screen with `doneTitle` and a green check, and calls `onSignedIn`. The card eases to the height of each step, so it keeps no room for a later one.
- Send code, the line under the boxes and the done screen's `doneDetail` share one foot, which keeps its place as the steps change; in Clean it is the card's off-white foot strip, with the fields above it in the card's body.

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
| `inbox` (optional) | `{ from?: ReactNode; code: string }` | The code as it arrives, offered under the boxes the way a phone offers a one-time code: a quiet chip like "From Mail 482 157" that fills every box when pressed. `from` names where it came from (defaults to "Mail") |
| `onAutofill` (optional) | `(code: string) => void` | Called when the person presses the code chip, with the code it fills in |
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

## Usage in Astro

```astro
---
import SignIn from '../components/designme/sign-in/SignIn.astro';
---
<SignIn />
<SignIn data-style="soft" class="my-class" />
```
It plays its demo; change `sign-in.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

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
import { useEffect, useId, useRef, useState, type ClipboardEvent, type CSSProperties, type FormEvent, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Spin, Swap, useGrow } from '../lib/motion';
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
  /** The code as it arrives, offered under the boxes the way a phone offers a one-time code: a quiet chip like
      "From Mail 482 157" that fills every box when pressed. `from` names where it came from (defaults to "Mail") */
  inbox?: { from?: ReactNode; code: string };
  /** Called when the person presses the code chip, with the code it fills in */
  onAutofill?: (code: string) => void;
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
  code, defaultCode = '', onCodeChange, codeLength = 6, onVerify, onFillRequest, inbox, onAutofill, hint, resendIn = 30, onResend, onSignedIn,
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
  const formId = useId();
  // the card fits each step at every moment: the code arriving, a message under the field and the shorter confirmation all
  // ease the steps to their height, and the foot eases to its own, so the card (the two together) keeps no room for a later
  // step and its foot never leaves its bottom edge
  const [body, bodyIn] = useGrow();
  const [foot, footIn] = useGrow();
  // the code arrives a moment after the code screen shows, offered as a chip under the boxes until it is used or the code is in
  const [arrived, setArrived] = useState(false);
  const [used, setUsed] = useState(false);
  useEffect(() => {
    if (now !== 'code' || !inbox) { setArrived(false); setUsed(false); return; }
    const t = setTimeout(() => setArrived(true), 900);
    return () => clearTimeout(t);
  }, [now, !!inbox]); // eslint-disable-line react-hooks/exhaustive-deps
  // what is wrong with the email stays on screen while its line closes
  const [said, setSaid] = useState(error);
  if (error && said !== error) setSaid(error);

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
      setCheck('confirmed'); setUsed(true);
    })();
    return () => { alive = false; };
  }, [full, now]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (check !== 'confirmed') return;
    const t = setTimeout(() => { setStep('done'); onSignedIn?.(mail.trim()); }, 1100);
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

  const back = () => { if (check !== 'idle') return; setBusy(false); setWrong(false); write([]); setStep('email'); };
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
  // the chip fills every box with the code it offers, and goes
  const autofill = () => {
    if (!inbox || check !== 'idle') return;
    const t = digit(inbox.code).slice(0, codeLength);
    setUsed(true); setWrong(false); write(t.split('')); onAutofill?.(inbox.code);
  };
  // with no box focused, the next one to fill has the focus edge
  const nextBox = check === 'idle' ? chars.findIndex(c => !c) : -1;

  const slide = moved ? 'dm-in' : undefined;
  return (
    <div data-dm="" className={cx('dm-sgx dm-panel', className)}>
      <div ref={body} className="dm-sgx-body dm-growing"><div ref={bodyIn} className="dm-grow">
      {now === 'email' && (
        <form key="email" id={formId} className={cx('dm-sgx-st dm-sgx-1', slide)} noValidate onSubmit={send}>
          <b>{title}</b><span className="dm-muted">{subtitle}</span>
          <label ref={field} className={cx('dm-sgx-f', bad && 'dm-bad')}>
            <span>{label}</span>
            <input type="email" name="email" autoComplete="email" className="dm-sgx-em" placeholder={placeholder} value={mail}
              aria-invalid={bad || undefined} onChange={e => setMail(e.target.value)} />
          </label>
          <Fold open={!!error} className="dm-sgx-ef"><span className="dm-sgx-err" aria-live="polite"><Icon name="alert" size="xs" /><Swap>{said}</Swap></span></Fold>
        </form>
      )}
      {now === 'code' && (
        <div key="code" className={cx('dm-sgx-st dm-sgx-2', slide)}>
          <button type="button" className="dm-sgx-bk" onClick={back}><Icon name="chev-l" size="xs" /><span className="dm-sgx-to">{mail.trim()}</span></button>
          <b>{codeTitle}</b><span className="dm-muted">{codeSubtitle}</span>
          <div className={cx('dm-sgx-code', check === 'verifying' && 'dm-vf', check === 'confirmed' && 'dm-ok', wrong && 'dm-bad')} role="group" aria-label="Code" onPointerDown={fill}>
            {chars.map((c, k) => (
              <input key={k} ref={el => { boxes.current[k] = el; }} inputMode="numeric" autoComplete={k === 0 ? 'one-time-code' : 'off'}
                aria-label={`Digit ${k + 1}`} aria-invalid={wrong || undefined} className={cx(pop.includes(k) && 'dm-f', k === nextBox && 'dm-nx')} style={{ '--dm-i': k } as CSSProperties}
                value={c} readOnly={check !== 'idle'} onChange={e => type(k, e.target.value)} onKeyDown={e => key(k, e)} onPaste={paste} />
            ))}
          </div>
          {inbox && (
            <Fold open={arrived && !used} className="dm-sgx-af">
              <button type="button" className="dm-chip dm-sgx-sug" aria-label={`Fill in the code from ${typeof inbox.from === 'string' ? inbox.from : 'Mail'}, ${inbox.code}`} onClick={autofill}>
                <Icon name="mail" size="xs" /><span>From {inbox.from ?? 'Mail'}</span><span className="dm-num">{inbox.code}</span>
              </button>
            </Fold>
          )}
        </div>
      )}
      {now === 'done' && (
        <div className="dm-sgx-done" role="status">
          <svg className="dm-sgx-ck" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="24" /><path d="m16 27 7 7 13-14" /></svg>
          <b {...enter(250)}>{doneTitle}</b>
        </div>
      )}
      </div></div>
      {/* the foot: the step's action or the line that says how it is going, in one place for every step (Clean's foot strip);
          it changes with the step in the same moment, so it is never empty */}
      <div ref={foot} className="dm-sgx-ft dm-growing"><div ref={footIn} className="dm-grow">
        {now === 'email' && <button type="submit" form={formId} className="dm-pill dm-primary dm-sgx-go">{busy || sending ? <Spin /> : sendLabel}</button>}
        {now === 'code' && (
          <span className="dm-muted dm-sgx-rs" aria-live="polite">
            {check === 'verifying' ? <span className="dm-sgx-v"><Spin /><span className="dm-shim">Verifying code</span></span>
              : check === 'confirmed' ? <span className="dm-sgx-v dm-ok"><Icon name="check" size="xs" />Code confirmed</span>
              : wrong ? <span className="dm-sgx-v dm-bad"><Icon name="alert" size="xs" />{wrongCodeLabel}</span>
              : left > 0 ? <>Resend in <span className="dm-num">{left}</span>s{hint && <> · <span className="dm-sgx-hint">{hint}</span></>}</>
              : <button type="button" className="dm-sgx-re" onClick={resend}>Resend code</button>}
          </span>
        )}
        {now === 'done' && (
          <span className="dm-sgx-open">
            <span><span className="dm-shim">{doneDetail}</span></span>
            <span className="dm-sgx-bar"><i /></span>
          </span>
        )}
      </div></div>
    </div>
  );
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Badge](https://designme.dev/components/badge.md): Labels for plans and status, with a dot, an icon or a remove button.
- [Progress and meter](https://designme.dev/components/progress.md): An agent run's progress and what it costs, with a credits meter that warns as it fills.
- [Slider](https://designme.dev/components/slider.md): Named stops, a stepped scale and a range, with the agent's recommended value marked on the track.
- [Tooltip](https://designme.dev/components/tooltip.md): Quiet labels on hover, with shortcuts and a richer preview card.
- [Search input](https://designme.dev/components/search-input.md): Search with scoped filters, recent queries and an agent answer.
- [Country select](https://designme.dev/components/country-select.md): A searchable select with country codes, currency and keyboard support.
- [Multi-select](https://designme.dev/components/multi-select.md): A combobox that filters as you type and keeps your picks as chips.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.
- [Carousel](https://designme.dev/components/carousel.md): Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.

All components: https://designme.dev/llms.txt
