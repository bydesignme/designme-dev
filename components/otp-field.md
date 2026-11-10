# OTP field

> A one-time code, one box per digit, that fills from a paste.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/otp-field

## Install

```sh
npx designme add otp-field          # HTML, CSS and JS, with the shared core
npx designme add otp-field --react  # React 19 component and its CSS
npx designme add otp-field --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/otp-field.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/otp-field.json  # Astro
```

## About

OTP field takes a one-time code with one box per digit. Typing moves to the next box, Backspace moves back, and pasting the whole code fills every box at once. The code is checked as soon as the last box is filled: a wrong one shakes red and says how many tries are left, and the right one turns green.

### When to use it

- When people confirm an email address or a phone number with a code you send them.
- When a sign-in or a risky action needs a second step, like a code from an authenticator app.
- When people are likely to paste the code from an email, or have a phone offer it from a message.
- When a wrong code should be easy to fix without clearing the boxes by hand.

### What it does

- `length` boxes, six by default, in two halves with a short dash between them.
- `value`, `defaultValue` and `onValueChange` hold the digits; `onComplete` gets the code once every box is filled.
- Pasting a code into any box fills them all from the first, ignoring spaces and dashes.
- `status` shows what's happening: `checking` dims the digits and spins, `error` shakes the boxes and turns them red, `success` turns them green and locks them. Typing after an error starts the code over from the first box.
- `message` sets the line under the boxes, like "That code doesn't match. 2 tries left". `footer` holds a resend link or its countdown.
- `title`, `description` and `icon` set the header, like "Check your email" with the address the code went to.

### Accessibility

- The boxes form a group labelled "Verification code", and each box is named, like "Digit 3 of 6".
- The first box has `autocomplete="one-time-code"`, and every box has `inputmode="numeric"`, so phones show the number pad and can offer a code from a message.
- Backspace clears a box, or the one before it when it's empty; ← and → move between boxes without changing them.
- A wrong code marks the boxes `aria-invalid`, and the line under them is announced politely.

## Usage in React

```tsx
import { OtpField } from '@/components/designme/otp-field/OtpField';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { OtpField, type OtpStatus } from './OtpField';
import { useStory, useWait } from '../lib/useScript';

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
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` (optional) | `string` | Defaults to "Check your email" |
| `description` (optional) | `ReactNode` | Like "Enter the 6-digit code we sent to maya@designme.studio" |
| `icon` (optional) | `IconName \| null` | The tile above the title. Defaults to mail; null hides it |
| `length` (optional) | `number` | How many digits. Defaults to 6, split in two halves |
| `value` (optional) | `string` | The digits typed so far |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(value: string) => void` |  |
| `onComplete` (optional) | `(code: string) => void` | Called with the code once every box is filled |
| `status` (optional) | `OtpStatus` | `checking` dims the digits and spins, `error` shakes them red, `success` turns them green and locks them. Typing after an error starts the code over, so set it back to `idle` when the value changes |
| `message` (optional) | `string` | The line under the boxes, like "That code doesn't match. 2 tries left". Defaults to a line for each status |
| `footer` (optional) | `ReactNode` | Under the message, like a resend link |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import OtpField from '../components/designme/otp-field/OtpField.astro';
---
<OtpField />
<OtpField data-style="soft" class="my-class" />
```
It plays its demo; change `otp-field.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does it check the code?**

No. `onComplete` gives you the code. Set `status` to `checking`, then `success` or `error` from what your server says.

**Why one box per digit?**

People can see how many digits are left and where a typo is. A paste still fills them all at once, so it's no slower.

**Can the code have letters?**

Not yet. Each box takes a digit, which is what most email and text codes use.

**What happens after a wrong code?**

The digits stay red so people can see what they entered. Typing again, or Backspace, clears them and starts from the first box.

## Source

`OtpField.tsx`, as `npx designme add otp-field --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ClipboardEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Spin } from '../lib/motion';
import '../designme.css';
import './otp-field.css';

export type OtpStatus = 'idle' | 'checking' | 'error' | 'success';

export interface OtpFieldProps {
  /** Defaults to "Check your email" */
  title?: string;
  /** Like "Enter the 6-digit code we sent to maya@designme.studio" */
  description?: ReactNode;
  /** The tile above the title. Defaults to mail; null hides it */
  icon?: IconName | null;
  /** How many digits. Defaults to 6, split in two halves */
  length?: number;
  /** The digits typed so far */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the code once every box is filled */
  onComplete?: (code: string) => void;
  /** `checking` dims the digits and spins, `error` shakes them red, `success` turns them green and locks them.
      Typing after an error starts the code over, so set it back to `idle` when the value changes */
  status?: OtpStatus;
  /** The line under the boxes, like "That code doesn't match. 2 tries left". Defaults to a line for each status */
  message?: string;
  /** Under the message, like a resend link */
  footer?: ReactNode;
  className?: string;
}

const LINE: Record<OtpStatus, string> = { idle: '', checking: 'Checking the code', error: "That code doesn't match", success: 'Verified' };

/** A one-time code with one box per digit. Typing moves along, Backspace clears and moves back, the arrow keys move,
    and a paste fills every box. The first box asks for autocomplete="one-time-code", so a phone can offer the code. */
export function OtpField({ title = 'Check your email', description, icon = 'mail', length = 6, value, defaultValue = '', onValueChange, onComplete, status = 'idle', message, footer, className }: OtpFieldProps) {
  const [code, setCode] = useControllable(value, defaultValue, onValueChange);
  const ins = useRef<(HTMLInputElement | null)[]>([]);
  const [popped, setPopped] = useState(-1);
  const locked = status === 'checking' || status === 'success';
  const digits = Array.from({ length }, (_, i) => code[i] ?? '');
  const half = Math.ceil(length / 2);

  // the code is handed over the moment the last box is filled
  const last = useRef('');
  useEffect(() => {
    if (code.length === length && code !== last.current && status === 'idle') onComplete?.(code);
    last.current = code;
  }, [code, length, status, onComplete]);
  useEffect(() => { if (popped < 0) return; const t = setTimeout(() => setPopped(-1), 160); return () => clearTimeout(t); }, [popped]);

  const focus = (i: number) => ins.current[Math.max(0, Math.min(length - 1, i))]?.focus();
  // a digit goes in at i; after a wrong code, typing starts the code over from the first box
  const put = (i: number, d: string) => {
    const start = status === 'error' ? '' : code;
    const at = status === 'error' ? 0 : Math.min(i, start.length);
    const next = (start.slice(0, at) + d + start.slice(at + 1)).slice(0, length);
    setCode(next); setPopped(at);
    if (at + 1 < length) focus(at + 1);
  };
  const fill = (text: string) => {
    const d = text.replace(/\D/g, '').slice(0, length); if (!d) return;
    setCode(d); focus(d.length < length ? d.length : length - 1);
  };
  const onKey = (i: number) => (e: KeyboardEvent<HTMLInputElement>) => {
    if (locked) return;
    if (/^\d$/.test(e.key)) { e.preventDefault(); put(i, e.key); }
    else if (e.key === 'Backspace') {
      e.preventDefault();
      if (status === 'error') { setCode(''); focus(0); }
      else if (digits[i]) setCode(code.slice(0, i) + code.slice(i + 1));
      else if (i > 0) { setCode(code.slice(0, i - 1) + code.slice(i)); focus(i - 1); }
    }
    else if (e.key === 'ArrowLeft') { e.preventDefault(); focus(i - 1); }
    else if (e.key === 'ArrowRight') { e.preventDefault(); focus(i + 1); }
  };
  const line = message ?? LINE[status];

  return (
    <div data-dm="" className={cx('dm-otp dm-panel', className)}>
      {icon && <span className="dm-otp-ic"><Icon name={icon} /></span>}
      <b className="dm-otp-t">{title}</b>
      {description && <p className="dm-muted dm-otp-s">{description}</p>}
      <div className={cx('dm-otp-in', status === 'checking' && 'dm-vf', status === 'error' && 'dm-bad', status === 'success' && 'dm-ok')} role="group" aria-label="Verification code">
        {digits.map((d, i) => (
          <span key={i} style={{ display: 'contents' }}>
            {i === half && <span className="dm-sep" aria-hidden="true" />}
            <input ref={el => { ins.current[i] = el; }} className={cx('dm-otp-d', popped === i && 'dm-bump')} value={d} readOnly={locked}
              inputMode="numeric" pattern="[0-9]*" maxLength={1} autoComplete={i ? 'off' : 'one-time-code'} aria-label={`Digit ${i + 1} of ${length}`}
              aria-invalid={status === 'error' || undefined} onKeyDown={onKey(i)} onFocus={e => e.target.select()}
              onChange={e => { const v = e.target.value.replace(/\D/g, ''); if (v.length > 1) fill(v); else if (v) put(i, v); }}
              onPaste={(e: ClipboardEvent<HTMLInputElement>) => { e.preventDefault(); if (!locked) fill(e.clipboardData.getData('text')); }} />
          </span>
        ))}
      </div>
      <p className={cx('dm-otp-m', status === 'error' && 'dm-bad', status === 'success' && 'dm-ok')} aria-live="polite">
        {status === 'checking' ? <Spin /> : status === 'error' ? <Icon name="alert" size="xs" /> : status === 'success' ? <Icon name="ok" size="xs" /> : null}{line}
      </p>
      {footer && status !== 'success' && <p className="dm-muted dm-otp-f">{footer}</p>}
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
- [Colour picker](https://designme.dev/components/color-picker.md): Pick a colour by eye or by hex, check its contrast, and let the agent fix it or make a scale from it.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then the one-time code from the email, copied or typed in.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.
- [Carousel](https://designme.dev/components/carousel.md): Drafts the agent made to keep one of, or a gallery of pictures, on one swipeable track.

All components: https://designme.dev/llms.txt
