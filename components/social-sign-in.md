# Social sign-in

> One-tap providers that remember the last one you used.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/social-sign-in

## Install

```sh
npx designme add social-sign-in          # HTML, CSS and JS, with the shared core
npx designme add social-sign-in --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Social sign-in is a sign-in card with one button per provider, such as Google, GitHub, Figma and SSO, plus a way to continue with email. The provider used last time gets an outline and a Last used badge, so a returning person can find it quickly. After sign-in the card swaps to a welcome message with the provider's name and a Sign out button.

### When to use it

- When people sign in to your agent product with an existing work account
- When returning users tend to forget which provider they used last time
- When sign-in calls an OAuth flow that takes a moment and the button should show it is working
- When you need a small signed-in confirmation before the product loads

### What it does

- Providers show an official `brand` mark, an `icon` such as a lock for SSO, or a `letters` tile.
- The `lastUsed` provider gets an outline and a Last used badge, and a successful sign-in updates it.
- If `onSignIn` returns a promise, that provider's button spins until it settles and the other buttons wait.
- Resolving to false or rejecting keeps the person signed out.
- Once signed in, the card shows an avatar, "Welcome back" with the `user` name, which provider was used and a Sign out button.
- `title`, `logo` and `emailLabel` change the heading, the mark on the tile and the email link.

### Accessibility

- The button that is signing in sets `aria-busy` while its promise is pending.
- Every provider is a native button labelled "Continue with" and the provider's name.

## Usage in React

```tsx
import { SocialSignIn } from '@/components/designme/social-sign-in/SocialSignIn';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { SocialSignIn, type SocialSignInProvider } from './SocialSignIn';

const PROVIDERS: SocialSignInProvider[] = [
  { key: 'google', label: 'Google', brand: 'google' }, { key: 'github', label: 'GitHub', brand: 'github' },
  { key: 'figma', label: 'Figma', brand: 'figma' }, { key: 'sso', label: 'SSO', icon: 'lock' }
];

/* ---------- Social sign-in: Figma was used last; any provider signs Maya in after a second ---------- */
export default function SocialSignInDemo() {
  return (
    <div style={{ width: '100%' }}>
      <SocialSignIn providers={PROVIDERS} defaultLastUsed="figma" user={{ name: 'Maya', initials: 'MK', color: 'var(--dm-pl)' }}
        onSignIn={() => new Promise(res => setTimeout(res, 1100))} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `providers` (optional) | `SocialSignInProvider[]` | Defaults to Google, GitHub, Figma and SSO |
| `lastUsed` (optional) | `string \| null` | The provider used last time, by key. It gets an outline and a "Last used" badge |
| `defaultLastUsed` (optional) | `string \| null` |  |
| `onLastUsedChange` (optional) | `(key: string \| null) => void` |  |
| `signedIn` (optional) | `string \| null` | The provider the person is signed in with, by key, or null. Signing in sets it, Sign out clears it |
| `defaultSignedIn` (optional) | `string \| null` |  |
| `onSignedInChange` (optional) | `(key: string \| null) => void` |  |
| `onSignIn` (optional) | `(provider: SocialSignInProvider) => unknown` | Called when a provider is clicked. Return a promise and its button spins until it settles; resolve to false or reject to stay signed out |
| `onSignOut` (optional) | `() => void` |  |
| `onEmail` (optional) | `() => void` | Adds a link under the providers |
| `user` (optional) | `SocialSignInUser` |  |
| `title` (optional) | `string` |  |
| `logo` (optional) | `ReactNode` | Your logo, on the dark tile at the top. Defaults to the DesignMe mark |
| `emailLabel` (optional) | `string` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I connect it to my OAuth flow?**

Handle `onSignIn`, which receives the clicked provider, and return a promise. The button spins until it resolves. Resolve to false or reject to keep the card signed out.

**How does it remember the last provider between visits?**

It doesn't store anything itself. Save the key from `onLastUsedChange` wherever you like, then pass it back as `lastUsed` or `defaultLastUsed` next time.

**Can I add a provider that has no brand mark, like Microsoft?**

Yes. Give it `letters`, such as "MS", for a letter tile, or an `icon` name. Built-in brand marks cover google, github, figma and slack.

## Source

`SocialSignIn.tsx`, as `npx designme add social-sign-in --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { Brand, type BrandName } from '../lib/brands';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Avatar, enter, Spin } from '../lib/motion';
import '../designme.css';
import './social-sign-in.css';

/** A way to sign in */
export interface SocialSignInProvider {
  key: string;
  /** Its name, after "Continue with", like "GitHub" */
  label: string;
  /** Its official mark: google, github, figma or slack */
  brand?: BrandName;
  /** An icon instead, like 'lock' for SSO */
  icon?: IconName;
  /** A letter tile instead, like "MS" */
  letters?: string;
}

/** The person who signed in */
export interface SocialSignInUser {
  /** Shown as "Welcome back, Maya" */
  name: string;
  initials: string;
  /** The avatar colour, like 'var(--dm-pl)' */
  color?: string;
}

export interface SocialSignInProps {
  /** Defaults to Google, GitHub, Figma and SSO */
  providers?: SocialSignInProvider[];
  /** The provider used last time, by key. It gets an outline and a "Last used" badge */
  lastUsed?: string | null;
  defaultLastUsed?: string | null;
  onLastUsedChange?: (key: string | null) => void;
  /** The provider the person is signed in with, by key, or null. Signing in sets it, Sign out clears it */
  signedIn?: string | null;
  defaultSignedIn?: string | null;
  onSignedInChange?: (key: string | null) => void;
  /** Called when a provider is clicked. Return a promise and its button spins until it settles; resolve to false or reject to stay signed out */
  onSignIn?: (provider: SocialSignInProvider) => unknown;
  onSignOut?: () => void;
  /** Adds a link under the providers */
  onEmail?: () => void;
  user?: SocialSignInUser;
  title?: string;
  /** Your logo, on the dark tile at the top. Defaults to the DesignMe mark */
  logo?: ReactNode;
  emailLabel?: string;
  className?: string;
}

const PROVIDERS: SocialSignInProvider[] = [
  { key: 'google', label: 'Google', brand: 'google' }, { key: 'github', label: 'GitHub', brand: 'github' },
  { key: 'figma', label: 'Figma', brand: 'figma' }, { key: 'sso', label: 'SSO', icon: 'lock' }
];

const Mark = ({ p }: { p: SocialSignInProvider }) =>
  p.brand ? <Brand name={p.brand} /> : p.letters ? <span className="dm-lt">{p.letters}</span> : <Icon name={p.icon ?? 'lock'} />;

const Logo = () => (
  <svg viewBox="-20 -83 799 799" aria-hidden="true" className="dm-logo"><path fill="currentColor" d="M149.497 283.784C149.477 284.047 149.474 284.311 149.487 284.575C156.385 340.034 183.548 391.116 225.9 428.196C267.989 465.044 322.188 485.532 378.414 485.855L379.743 485.859C436.453 485.868 491.188 465.353 533.619 428.212C575.912 391.194 603.062 340.216 610.018 284.856L610.018 281.512C610.008 277.337 608.324 273.315 605.303 270.335C602.277 267.351 598.155 265.656 593.837 265.656L165.647 265.656C161.338 265.656 157.226 267.349 154.21 270.331C151.198 273.309 149.524 277.326 149.523 281.491L149.523 283.437L149.497 283.784ZM114.378 247.395C118.396 247.391 122.254 245.919 125.214 243.29C128.063 240.759 129.887 237.33 130.396 233.629L130.396 233.35L130.437 232.917C136.355 171.634 165.162 114.754 211.202 73.3687C257.239 31.9859 317.206 9.06063 379.393 9.04448L379.396 9.04448C441.593 9.04583 501.574 31.964 547.624 73.3482C593.677 114.735 622.491 171.624 628.411 232.917L628.453 233.35L628.453 233.643C628.953 237.344 630.773 240.774 633.621 243.304C636.58 245.932 640.437 247.399 644.452 247.395L725.644 247.395C728.882 247.404 732.089 248.06 735.071 249.329C738.055 250.598 740.753 252.453 743.001 254.787C745.252 257.123 747.005 259.891 748.151 262.924C749.296 265.954 749.81 269.183 749.662 272.418L749.663 272.418C745.484 366.797 704.617 455.919 635.615 521.211C566.616 586.499 474.809 622.924 379.338 622.924C283.872 622.924 192.071 586.496 123.081 521.206C54.0935 455.917 13.2412 366.804 9.07133 272.438L9.07036 272.438L9.07036 272.436C9.07007 272.43 9.06967 272.423 9.06938 272.417L9.07036 272.417C8.92272 269.182 9.43655 265.953 10.5811 262.924C11.7276 259.89 13.481 257.123 15.7315 254.787C17.9805 252.452 20.6797 250.597 23.6622 249.329C26.6443 248.06 29.8504 247.404 33.0889 247.395L114.378 247.395Z" /></svg>
);

/** One-tap sign-in that remembers the provider you used last. */
export function SocialSignIn({ providers = PROVIDERS, lastUsed, defaultLastUsed = null, onLastUsedChange, signedIn, defaultSignedIn = null, onSignedInChange,
  onSignIn, onSignOut, onEmail, user, title = 'Sign in to DesignMe', logo, emailLabel = 'Continue with email', className }: SocialSignInProps) {
  const [last, setLast] = useControllable(lastUsed, defaultLastUsed, onLastUsedChange);
  const [session, setSession] = useControllable(signedIn, defaultSignedIn, onSignedInChange);
  const [busy, setBusy] = useState<string | null>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; return () => { alive.current = false; }; }, []);

  const signIn = (p: SocialSignInProvider) => {
    if (busy) return;
    const done = (ok: unknown) => { if (!alive.current) return; setBusy(null); if (ok === false) return; setLast(p.key); setSession(p.key); };
    const out = onSignIn?.(p);
    if (out && typeof (out as Promise<unknown>).then === 'function') {
      setBusy(p.key);
      (out as Promise<unknown>).then(done, () => { if (alive.current) setBusy(null); });
    } else done(out);
  };
  const signOut = () => { setSession(null); onSignOut?.(); };
  const who = providers.find(p => p.key === session);
  const step = (i: number) => (user ? i : i - 1) * 60;

  return (
    <div data-dm="" className={cx('dm-ssi dm-panel', className)}>
      {session ? (
        <div className="dm-ssi-ok">
          {/* the welcome comes in a line at a time */}
          {user && <Avatar initials={user.initials} color={user.color ?? 'var(--dm-pl)'} className="dm-enter" />}
          <b {...enter(step(1))}>{user ? `Welcome back, ${user.name}` : 'You are signed in'}</b>
          <span className="dm-muted dm-enter" style={enter(step(2)).style}>Signed in with {who?.label ?? session}</span>
          <button type="button" className="dm-pill dm-ghost dm-sm dm-enter" style={enter(step(3)).style} onClick={signOut}>Sign out</button>
        </div>
      ) : <>
        <div className="dm-ssi-h"><span className="dm-ssi-lg">{logo ?? <Logo />}</span><b>{title}</b></div>
        <div className={cx('dm-ssi-list', busy && 'dm-wait')}>
          {providers.map((p, i) => {
            const e = enter(i * 50);
            return (
              <button key={p.key} type="button" className={cx('dm-ssi-b', p.key === last && 'dm-last-used', busy === p.key && 'dm-busy', e.className)} style={e.style}
                aria-busy={busy === p.key || undefined} onClick={() => signIn(p)}>
                <span className="dm-mk">{busy === p.key ? <Spin /> : <Mark p={p} />}</span>
                <span>Continue with {p.label}</span>
                {p.key === last && <span className="dm-last">Last used</span>}
              </button>
            );
          })}
        </div>
        <div className="dm-ssi-or">or</div>
        <button type="button" className="dm-ssi-mail" onClick={onEmail}>{emailLabel}</button>
      </>}
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
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then a one-time code that fills itself in.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.

All components: https://designme.dev/llms.txt
