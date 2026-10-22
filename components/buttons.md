# Buttons

> Every button style, with loading, success and hold-to-confirm states.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/buttons

## Install

```sh
npx designme add buttons          # HTML, CSS and JS, with the shared core
npx designme add buttons --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Buttons is a set of pill and icon buttons that show what an action is doing while it runs. A button can go busy, then confirm it is done, a run button shows its elapsed time and turns into Stop, and a destructive action can require a hold to confirm. This matters in an agent product, where a click often starts work that takes a few seconds.

### When to use it

- When a click starts agent work and the person should see it is in progress and then finished
- When a run needs a single control that starts it, shows how long it has gone and stops it
- When a destructive action should take a deliberate hold instead of a single click
- When a Share or More button should open a menu and then say what happened

### What it does

- `Button` comes in five variants (accent, ink, soft, line, ghost) and three sizes, with `busy`, `done` and `pressed` states and labels for each.
- If `onClick` returns a promise, the button goes busy until it settles, then shows the done face for `doneFor` ms before returning to its label.
- `busyGlyph="think"` swaps the spinner for the agent's four turning dots with a shimmering label.
- `ButtonRun` shows Running with an m:ss timer, reads Stop on hover, and shows Stopped or Run complete when it ends.
- `ButtonHold` fills up while held and calls `onConfirm` after 1.2 seconds; letting go early cancels it.
- `ButtonCopy`, `ButtonMenu` and `ButtonIconMenu` copy text or pick from a menu, then flash a check and a short status.

### Accessibility

- Busy buttons set `aria-busy`, and toggles report their state with `aria-pressed`.
- Icon-only buttons take a required `label` that becomes their `aria-label` and tooltip.
- Menus use `role="menu"` and `role="menuitem"`, the trigger reports `aria-expanded`, and Escape closes the menu and returns focus to the button.
- The hold button works from the keyboard: holding Space or Enter confirms, and releasing either key early cancels.

## Usage in React

```tsx
import { Buttons } from '@/components/designme/buttons/Buttons';
```

### Example

```tsx
'use client';
// The button sheet from designme.dev, rebuilt from the React buttons. Each one shows a state you drive yourself:
// a promise for busy and done, a toggle, a menu that reports back, a run you can stop, a hold to confirm.
import { useEffect, useRef, useState } from 'react';
import { useWait } from '../lib/useScript';
import { Button, ButtonCopy, ButtonHold, ButtonIconMenu, ButtonMenu, ButtonRun, Buttons, type ButtonRunState } from './Buttons';

const LINK = 'https://designme.dev/p/pricing';

export default function ButtonsDemo() {
  const wait = useWait();
  const [preview, setPreview] = useState(false);

  // Run agent counts while it runs and finishes after 3.2s; clicking it while it runs stops it
  const [run, setRun] = useState<ButtonRunState>('idle');
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (run !== 'running') return;
    const tick = setInterval(() => setSecs(s => s + 1), 1000), done = setTimeout(() => setRun('complete'), 3200);
    return () => { clearInterval(tick); clearTimeout(done); };
  }, [run]);
  useEffect(() => {
    if (run !== 'complete' && run !== 'stopped') return;
    const t = setTimeout(() => setRun('idle'), run === 'complete' ? 1800 : 1200);
    return () => clearTimeout(t);
  }, [run]);

  // Share says what happened, then goes back to its label
  const [share, setShare] = useState<{ label: string; busy?: boolean } | null>(null);
  const shareT = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(shareT.current), []);
  const said = (label: string) => { setShare({ label }); clearTimeout(shareT.current); shareT.current = setTimeout(() => setShare(null), 1600); };
  const pick = (key: string) => {
    if (key === 'link') { try { navigator.clipboard?.writeText(LINK).catch(() => {}); } catch { /* no clipboard here */ } said('Link copied'); }
    else if (key === 'slack') said('Sent to #design');
    else { clearTimeout(shareT.current); setShare({ label: 'Exporting', busy: true }); shareT.current = setTimeout(() => said('PDF ready'), 1100); }
  };

  // More says what it did for a moment
  const [more, setMore] = useState<string | null>(null);
  const moreT = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(moreT.current), []);
  const did = (key: string) => {
    const said: Record<string, string> = { duplicate: 'Duplicated', rename: 'Renamed', move: 'Moved to Website', delete: 'Moved to trash' };
    clearTimeout(moreT.current);
    moreT.current = setTimeout(() => { setMore(said[key]); moreT.current = setTimeout(() => setMore(null), 1500); }, 140);
  };

  return (
    <Buttons rows={[
      { label: 'Styles', children: <>
        <Button variant="accent" className="dm-btx-trial" busyLabel="Starting" doneLabel="Trial started" onClick={() => wait(1100)}>Start free trial</Button>
        <ButtonRun state={run} seconds={secs} onRun={() => { setSecs(0); setRun('running'); }} onStop={() => setRun('stopped')} />
        <Button variant="soft" className="dm-btx-pv" pressed={preview} onClick={() => setPreview(p => !p)}>{preview ? <><span className="dm-btx-live" />Previewing</> : 'Preview'}</Button>
        <ButtonMenu label="Share" className="dm-btx-share" status={share} onSelect={pick} items={[
          { key: 'link', icon: 'link', label: 'Copy link' },
          { key: 'slack', brand: 'slack', label: 'Send to Slack', detail: '#design' },
          { key: 'pdf', icon: 'down', label: 'Export as PDF' }
        ]} />
        <Button variant="ghost">Cancel</Button>
      </> },
      { label: 'With icon', children: <>
        <Button variant="accent" className="dm-btx-ask" icon="spark" busyGlyph="think" busyLabel="Agent is working" doneLabel="Draft ready" fadeBack={false} onClick={() => wait(2200)}>Ask agent</Button>
        <Button variant="soft" icon="figma" className="dm-btx-fig" busyLabel="Opening" doneLabel="Opened in Figma" doneIcon="ext" onClick={() => wait(900)}>Open in Figma</Button>
        <ButtonCopy text={LINK} className="dm-btx-icp" />
        <ButtonIconMenu label="More" status={more} onSelect={did} items={[
          { key: 'duplicate', icon: 'copy', label: 'Duplicate', detail: '⌘D' },
          { key: 'rename', icon: 'edit', label: 'Rename' },
          { key: 'move', icon: 'folder', label: 'Move to…' },
          { key: 'delete', icon: 'trash', label: 'Delete', detail: '⌫', danger: true, divider: true }
        ]} />
      </> },
      { label: 'States', children: <>
        <Button variant="ink" className="dm-btx-load" success fadeBack={false} busyLabel="Publishing" doneLabel="Published" onClick={() => wait(1300)}>Publish</Button>
        <ButtonCopy text={LINK} label="Copy link" />
        <ButtonHold />
        <Button variant="accent" disabled>Disabled</Button>
      </> },
      { label: 'Sizes', children: <>
        <Button variant="accent" size="sm">Small</Button>
        <Button variant="accent">Default</Button>
        <Button variant="accent" size="lg">Large</Button>
      </> }
    ]} />
  );
}
```

## Props

### ButtonsProps

| Prop | Type | What it does |
| --- | --- | --- |
| `rows` | `ButtonsRow[]` |  |
| `className` (optional) | `string` |  |

### ButtonProps

Shows `children`. When `id` changes to a face that should `fade`, the old one blurs out first; any other change is instant */ function Face({ id, fade, children }: { id: string; fade: boolean; children: ReactNode }) { const [cur, setCur] = useState<{ id: string; node: ReactNode }>({ id, node: children }); const [out, setOut] = useState(false); const reduce = useReducedMotion(); if (id !== cur.id && !fade) setCur({ id, node: children }); useEffect(() => { if (id === cur.id || !fade) return; setOut(true); const t = setTimeout(() => { setCur({ id, node: children }); setOut(false); }, reduce ? 0 : 170); return () => clearTimeout(t); }, [id, fade]); // eslint-disable-line react-hooks/exhaustive-deps return <span className={cx('dm-sw', out && 'dm-out')} style={FACE}>{id === cur.id ? children : cur.node}</span>; } const glyph = (icon: IconName | ReactElement | undefined) => icon === undefined ? null : isValidElement(icon) ? icon : <Icon name={icon as IconName} size="xs" />; const Check = () => <Icon name="check" size="xs" className="dm-enter" />; /* ---------- Button ----------

| Prop | Type | What it does |
| --- | --- | --- |
| `variant` (optional) | `ButtonVariant` | accent for the one main action, ink for a strong one, soft and line for the rest, ghost for the quietest. Left out, a plain pill |
| `size` (optional) | `ButtonSize` |  |
| `icon` (optional) | `IconName \| ReactElement` | An icon before the label: an icon name, or your own element (like a Brand) |
| `children` (optional) | `ReactNode` |  |
| `onClick` (optional) | `(e: MouseEvent<HTMLButtonElement>) => void \| Promise<unknown>` | Return a promise and the button runs by itself: busy until it settles, then done for `doneFor` ms |
| `busy` (optional) | `boolean` | Shows the busy face: a spinner (or the thinking dots) and `busyLabel`. Clicks are ignored |
| `done` (optional) | `boolean` | Shows the done face: a check that pops in and `doneLabel`. Clicks are ignored |
| `busyLabel` (optional) | `ReactNode` | The label while busy, like "Publishing". Defaults to the label |
| `doneLabel` (optional) | `ReactNode` | The label once done, like "Published". Defaults to the label |
| `doneIcon` (optional) | `IconName \| ReactElement` | The icon on the done face, like "ext" for something that opened elsewhere. Defaults to a check that pops in |
| `busyGlyph` (optional) | `'spin' \| 'think'` | spin, or think: the agent's four turning dots with a shimmering label |
| `success` (optional) | `boolean` | The done face turns green |
| `doneFor` (optional) | `number` | How long the done face stays when the button runs itself |
| `fadeBack` (optional) | `boolean` | Going back from done to the label blurs across (the default) instead of switching at once |
| `pressed` (optional) | `boolean` | For a toggle: whether it is on, as aria-pressed |
| `tip` (optional) | `string` | A tooltip, with an optional shortcut after it |
| `kbd` (optional) | `string` |  |

Also takes the props of `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'>`.

### ButtonIconProps

accent for the one main action, ink for a strong one, soft and line for the rest, ghost for the quietest. Left out, a plain pill */ variant?: ButtonVariant; size?: ButtonSize; /** An icon before the label: an icon name, or your own element (like a Brand) */ icon?: IconName | ReactElement; children?: ReactNode; /** Return a promise and the button runs by itself: busy until it settles, then done for `doneFor` ms */ onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>; /** Shows the busy face: a spinner (or the thinking dots) and `busyLabel`. Clicks are ignored */ busy?: boolean; /** Shows the done face: a check that pops in and `doneLabel`. Clicks are ignored */ done?: boolean; /** The label while busy, like "Publishing". Defaults to the label */ busyLabel?: ReactNode; /** The label once done, like "Published". Defaults to the label */ doneLabel?: ReactNode; /** The icon on the done face, like "ext" for something that opened elsewhere. Defaults to a check that pops in */ doneIcon?: IconName | ReactElement; /** spin, or think: the agent's four turning dots with a shimmering label */ busyGlyph?: 'spin' | 'think'; /** The done face turns green */ success?: boolean; /** How long the done face stays when the button runs itself */ doneFor?: number; /** Going back from done to the label blurs across (the default) instead of switching at once */ fadeBack?: boolean; /** For a toggle: whether it is on, as aria-pressed */ pressed?: boolean; /** A tooltip, with an optional shortcut after it */ tip?: string; kbd?: string; } /** A pill button in one of the site's five styles and three sizes, with busy, done and pressed states. */ export function Button({ variant, size = 'md', icon, children, onClick, busy, done, busyLabel, doneLabel, doneIcon, busyGlyph = 'spin', success, doneFor = 1800, fadeBack = true, pressed, tip, kbd, className, ...rest }: ButtonProps) { // an onClick that returns a promise drives the button itself const [auto, setAuto] = useState<'idle' | 'busy' | 'done'>('idle'); const alive = useRef(true), timer = useRef<ReturnType<typeof setTimeout>>(undefined); useEffect(() => { alive.current = true; return () => { alive.current = false; clearTimeout(timer.current); }; }, []); const isBusy = busy ?? auto === 'busy', isDone = !isBusy && (done ?? auto === 'done'); const face = isBusy ? 'busy' : isDone ? 'done' : 'idle'; const click = (e: MouseEvent<HTMLButtonElement>) => { if (isBusy || isDone) return; const r = onClick?.(e); if (!r || typeof r.then !== 'function') return; setAuto('busy'); r.then(() => { if (!alive.current) return; setAuto('done'); timer.current = setTimeout(() => setAuto('idle'), doneFor); }, () => { if (alive.current) setAuto('idle'); }); }; const think = isBusy && busyGlyph === 'think'; const label = isBusy ? busyLabel ?? children : isDone ? doneLabel ?? children : children; const button = ( <button type="button" {...rest} className={cx('dm-pill', variant && 'dm-' + variant, size === 'sm' && 'dm-sm', size === 'lg' && 'dm-btx-lg', isBusy && 'dm-busy', isDone && 'dm-done', isDone && success && 'dm-btx-load dm-ok', className)} aria-busy={isBusy || undefined} aria-pressed={pressed} onClick={click}> <Face id={face} fade={fadeBack && face === 'idle'}> {isBusy ? (think ? <Think /> : <Spin />) : isDone ? (doneIcon === undefined ? <Check /> : <span className="dm-enter" style={FACE}>{glyph(doneIcon)}</span>) : glyph(icon)} {think ? <span className="dm-shim">{label}</span> : label} </Face> </button> ); return <span data-dm="" style={ROOT}>{tip ? <Tip label={tip} kbd={kbd}>{button}</Tip> : button}</span>; } /* ---------- ButtonIcon ----------

| Prop | Type | What it does |
| --- | --- | --- |
| `icon` | `IconName` |  |
| `label` | `string` | Read out and shown in the tooltip |
| `kbd` (optional) | `string` | A shortcut shown after the label in the tooltip |
| `fill` (optional) | `boolean` | The filled round style (the default), or the bare one |
| `iconSize` (optional) | `'xs' \| 's' \| 'm' \| 'l'` |  |

Also takes the props of `Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'>`.

### ButtonCopyProps

Read out and shown in the tooltip */ label: string; /** A shortcut shown after the label in the tooltip */ kbd?: string; /** The filled round style (the default), or the bare one */ fill?: boolean; iconSize?: 'xs' | 's' | 'm' | 'l'; } /** A round icon-only button with a tooltip. */ export function ButtonIcon({ icon, label, kbd, fill = true, iconSize = 'xs', className, ...rest }: ButtonIconProps) { return ( <span data-dm="" style={ROOT}> <Tip label={label} kbd={kbd}> <button type="button" {...rest} className={cx('dm-ib', fill && 'dm-fill', className)} aria-label={label}><Icon name={icon} size={iconSize} /></button> </Tip> </span> ); } /* ---------- ButtonCopy ----------

| Prop | Type | What it does |
| --- | --- | --- |
| `text` | `string` | What goes on the clipboard |
| `label` (optional) | `string` | The pill's label, like "Copy link". Left out, it is a round icon button |
| `copiedLabel` (optional) | `string` | The label for a moment after copying |
| `tip` (optional) | `string` | The icon button's tooltip and name |
| `variant` (optional) | `ButtonVariant` |  |
| `onCopy` (optional) | `(text: string) => void` |  |
| `className` (optional) | `string` |  |

### ButtonIconMenuProps

What goes on the clipboard */ text: string; /** The pill's label, like "Copy link". Left out, it is a round icon button */ label?: string; /** The label for a moment after copying */ copiedLabel?: string; /** The icon button's tooltip and name */ tip?: string; variant?: ButtonVariant; onCopy?: (text: string) => void; className?: string; } /** Copies text, then flashes a check and says so for a moment, like every copy button on the site. */ export function ButtonCopy({ text, label, copiedLabel = 'Copied', tip = 'Copy', variant = 'soft', onCopy, className }: ButtonCopyProps) { const [copied, copy] = useCopied(); const click = () => { copy(text); onCopy?.(text); }; const mark = <Icon name={copied ? 'check' : 'copy'} size="xs" />; return ( <span data-dm="" style={ROOT}> {label === undefined ? <Tip label={copied ? 'Copied to clipboard' : tip} open={copied || undefined}> <button type="button" className={cx('dm-ib dm-fill', copied && 'dm-copied', className)} aria-label={tip} onClick={click}>{mark}</button> </Tip> : <Tip label="Copied to clipboard" open={copied || undefined} off={!copied}> <button type="button" className={cx('dm-pill', 'dm-' + variant, 'dm-btx-copy', copied && 'dm-copied', className)} onClick={click}>{mark}{copied ? copiedLabel : label}</button> </Tip>} </span> ); } /* ---------- ButtonMenu ---------- */ export interface ButtonMenuItem { key: string; label: string; /** An icon before the label, or `brand` for a service's own mark */ icon?: IconName; brand?: BrandName; /** Quiet text at the end of the row, like "#design" or a shortcut */ detail?: string; /** A destructive action, like Delete: drawn in the danger colour */ danger?: boolean; /** Starts a new group: a line above this item */ divider?: boolean; } function MenuItems({ items, onPick }: { items: ButtonMenuItem[]; onPick: (key: string) => void }) { return <>{items.map(it => ( <Fragment key={it.key}> {it.divider && <div className="dm-sep" role="separator" />} <button type="button" role="menuitem" className={cx('dm-mi', it.danger && 'dm-del')} onClick={() => onPick(it.key)}> {it.brand ? <Brand name={it.brand} /> : it.icon && <Icon name={it.icon} />} {it.label} {it.detail && <span className="dm-r">{it.detail}</span>} </button> </Fragment> ))}</>; } export interface ButtonMenuProps { label: string; items: ButtonMenuItem[]; /** Called with the picked item's key. The menu closes a moment later */ onSelect?: (key: string) => void; /** What the button says after a pick, like { label: 'Link copied' }, or { label: 'Exporting', busy: true }. Clear it and the label comes back */ status?: { label: string; busy?: boolean } | null; variant?: ButtonVariant; /** Which edge of the button the menu lines up with */ align?: 'start' | 'end'; /** Whether the menu is open. Leave it out to let the button toggle it */ open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; className?: string; } /** A button that opens a small menu and then says what happened, like Share. */ export function ButtonMenu({ label, items, onSelect, status, variant = 'line', align = 'start', open, defaultOpen, onOpenChange, className }: ButtonMenuProps) { const menu = usePopover({ align, open, defaultOpen, onOpenChange }); const face = status ? (status.busy ? 'busy:' : 'done:') + status.label : 'idle'; return ( <span data-dm="" style={{ position: 'relative', display: 'inline-flex' }}> <button type="button" {...menu.trigger} className={cx('dm-pill', 'dm-' + variant, className)} aria-busy={status?.busy || undefined}> <Face id={face} fade={!status}> {status && (status.busy ? <Spin /> : <Check />)} {status ? status.label : label} </Face> </button> <div {...menu.pop} className={cx(menu.pop.className, 'dm-btx-sp')} role="menu"> <MenuItems items={items} onPick={key => { onSelect?.(key); menu.closeSoon(); }} /> </div> </span> ); } /* ---------- ButtonIconMenu ----------

| Prop | Type | What it does |
| --- | --- | --- |
| `icon` (optional) | `IconName` | The icon on the button. Defaults to the three dots |
| `label` | `string` | Read out and shown in the tooltip |
| `items` | `ButtonMenuItem[]` |  |
| `onSelect` (optional) | `(key: string) => void` | Called with the picked item's key. The menu closes a moment later |
| `status` (optional) | `string \| null` | What just happened, like "Duplicated": the icon turns into a check and the tooltip says it. Clear it and the icon comes back |
| `align` (optional) | `'start' \| 'end'` | Which edge of the button the menu lines up with |
| `open` (optional) | `boolean` | Whether the menu is open. Leave it out to let the button toggle it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

### ButtonHoldProps

The icon on the button. Defaults to the three dots */ icon?: IconName; /** Read out and shown in the tooltip */ label: string; items: ButtonMenuItem[]; /** Called with the picked item's key. The menu closes a moment later */ onSelect?: (key: string) => void; /** What just happened, like "Duplicated": the icon turns into a check and the tooltip says it. Clear it and the icon comes back */ status?: string | null; /** Which edge of the button the menu lines up with */ align?: 'start' | 'end'; /** Whether the menu is open. Leave it out to let the button toggle it */ open?: boolean; defaultOpen?: boolean; onOpenChange?: (open: boolean) => void; className?: string; } /** A round icon button that opens a menu of actions, like More, then flashes a check and says what happened. */ export function ButtonIconMenu({ icon = 'more', label, items, onSelect, status, align = 'end', open, defaultOpen, onOpenChange, className }: ButtonIconMenuProps) { const menu = usePopover({ align, open, defaultOpen, onOpenChange }); return ( <span data-dm="" style={{ position: 'relative', display: 'inline-flex' }}> {/* no tooltip over its own open menu */} <Tip label={status || label} open={status ? true : undefined} off={menu.open && !status}> <button type="button" {...menu.trigger} className={cx('dm-ib dm-fill dm-btx-more', status && 'dm-done', className)} aria-label={label}> <Icon name={status ? 'check' : icon} size="xs" /> </button> </Tip> <div {...menu.pop} className={cx(menu.pop.className, 'dm-btx-mp')} role="menu"> <MenuItems items={items} onPick={key => { onSelect?.(key); menu.closeSoon(); }} /> </div> </span> ); } /* ---------- ButtonRun ---------- */ export type ButtonRunState = 'idle' | 'running' | 'stopped' | 'complete'; export interface ButtonRunProps { state: ButtonRunState; /** How long it has been running, shown as m:ss */ seconds?: number; label?: string; /** Clicked while not running */ onRun?: () => void; /** Clicked while running. Hovering a running button already reads Stop */ onStop?: () => void; variant?: ButtonVariant; className?: string; } const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`; /** Starts a run and shows its time; while it runs, hovering turns it into Stop. */ export function ButtonRun({ state, seconds = 0, label = 'Run agent', onRun, onStop, variant = 'ink', className }: ButtonRunProps) { const [hover, setHover] = useState(false); const running = state === 'running'; const face = running ? (hover ? 'stop' : 'run') : state; return ( <span data-dm="" style={ROOT}> <button type="button" className={cx('dm-pill', 'dm-' + variant, 'dm-btx-run', running && 'dm-busy', className)} aria-busy={running || undefined} onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onClick={() => (running ? onStop : onRun)?.()}> <Face id={face} fade={state === 'idle'}> {face === 'stop' || face === 'stopped' ? <span className="dm-sq" /> : face === 'run' ? <Spin /> : face === 'complete' ? <Check /> : null} {face === 'stop' ? 'Stop' : face === 'stopped' ? 'Stopped' : face === 'complete' ? 'Run complete' : face === 'run' ? 'Running' : label} {face === 'run' && <span className="dm-num">{clock(seconds)}</span>} </Face> </button> </span> ); } /* ---------- ButtonHold ----------

| Prop | Type | What it does |
| --- | --- | --- |
| `label` (optional) | `string` |  |
| `holdingLabel` (optional) | `string` | Shown while it is held |
| `doneLabel` (optional) | `string` | Shown once the hold completes |
| `icon` (optional) | `IconName` |  |
| `onConfirm` (optional) | `() => void` | Called when it has been held for 1.2s, with a pointer or with Space or Enter |
| `resetAfter` (optional) | `number` | How long the done face stays before it resets |
| `className` (optional) | `string` |  |

## Questions

**How do I show a loading state while my request runs?**

Return the promise from `onClick`. The button shows a spinner and `busyLabel` until it resolves, then a check and `doneLabel`. If the promise rejects it goes straight back to its label.

**Can I drive the busy and done states myself instead of with a promise?**

Yes. Pass `busy` and `done` directly. While either is true, clicks are ignored.

**How does the run button know how long the agent has been running?**

You pass `seconds` and it formats them as m:ss. You also set `state` to idle, running, stopped or complete, and handle `onRun` and `onStop`.

**How long does the hold to confirm take?**

1.2 seconds of holding with a pointer, Space or Enter. After it confirms, the done face stays for `resetAfter` ms, 1800 by default.

## Source

`Buttons.tsx`, as `npx designme add buttons --react` installs it:

```tsx
'use client';
import { Fragment, isValidElement, useEffect, useRef, useState, type ButtonHTMLAttributes, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useCopied, useReducedMotion } from '../lib/hooks';
import { Brand, type BrandName } from '../lib/brands';
import { Icon, type IconName } from '../lib/icons';
import { Spin, Think, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './buttons.css';

export type ButtonVariant = 'accent' | 'ink' | 'soft' | 'line' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

// a button used on its own still needs the resets that [data-dm] gives its contents, without adding a box to the layout
const ROOT = { display: 'contents' } as const;
// the content of a button sits in one span, so it can blur out and back in as a whole, like the site's swap()
const FACE = { display: 'inline-flex', alignItems: 'center', gap: 7 } as const;

/** Shows `children`. When `id` changes to a face that should `fade`, the old one blurs out first; any other change is instant */
function Face({ id, fade, children }: { id: string; fade: boolean; children: ReactNode }) {
  const [cur, setCur] = useState<{ id: string; node: ReactNode }>({ id, node: children });
  const [out, setOut] = useState(false);
  const reduce = useReducedMotion();
  if (id !== cur.id && !fade) setCur({ id, node: children });
  useEffect(() => {
    if (id === cur.id || !fade) return;
    setOut(true);
    const t = setTimeout(() => { setCur({ id, node: children }); setOut(false); }, reduce ? 0 : 170);
    return () => clearTimeout(t);
  }, [id, fade]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span className={cx('dm-sw', out && 'dm-out')} style={FACE}>{id === cur.id ? children : cur.node}</span>;
}

const glyph = (icon: IconName | ReactElement | undefined) =>
  icon === undefined ? null : isValidElement(icon) ? icon : <Icon name={icon as IconName} size="xs" />;
const Check = () => <Icon name="check" size="xs" className="dm-enter" />;

/* ---------- Button ---------- */

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> {
  /** accent for the one main action, ink for a strong one, soft and line for the rest, ghost for the quietest. Left out, a plain pill */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** An icon before the label: an icon name, or your own element (like a Brand) */
  icon?: IconName | ReactElement;
  children?: ReactNode;
  /** Return a promise and the button runs by itself: busy until it settles, then done for `doneFor` ms */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
  /** Shows the busy face: a spinner (or the thinking dots) and `busyLabel`. Clicks are ignored */
  busy?: boolean;
  /** Shows the done face: a check that pops in and `doneLabel`. Clicks are ignored */
  done?: boolean;
  /** The label while busy, like "Publishing". Defaults to the label */
  busyLabel?: ReactNode;
  /** The label once done, like "Published". Defaults to the label */
  doneLabel?: ReactNode;
  /** The icon on the done face, like "ext" for something that opened elsewhere. Defaults to a check that pops in */
  doneIcon?: IconName | ReactElement;
  /** spin, or think: the agent's four turning dots with a shimmering label */
  busyGlyph?: 'spin' | 'think';
  /** The done face turns green */
  success?: boolean;
  /** How long the done face stays when the button runs itself */
  doneFor?: number;
  /** Going back from done to the label blurs across (the default) instead of switching at once */
  fadeBack?: boolean;
  /** For a toggle: whether it is on, as aria-pressed */
  pressed?: boolean;
  /** A tooltip, with an optional shortcut after it */
  tip?: string;
  kbd?: string;
}

/** A pill button in one of the site's five styles and three sizes, with busy, done and pressed states. */
export function Button({ variant, size = 'md', icon, children, onClick, busy, done, busyLabel, doneLabel, doneIcon, busyGlyph = 'spin', success, doneFor = 1800,
  fadeBack = true, pressed, tip, kbd, className, ...rest }: ButtonProps) {
  // an onClick that returns a promise drives the button itself
  const [auto, setAuto] = useState<'idle' | 'busy' | 'done'>('idle');
  const alive = useRef(true), timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => { alive.current = true; return () => { alive.current = false; clearTimeout(timer.current); }; }, []);
  const isBusy = busy ?? auto === 'busy', isDone = !isBusy && (done ?? auto === 'done');
  const face = isBusy ? 'busy' : isDone ? 'done' : 'idle';

  const click = (e: MouseEvent<HTMLButtonElement>) => {
    if (isBusy || isDone) return;
    const r = onClick?.(e);
    if (!r || typeof r.then !== 'function') return;
    setAuto('busy');
    r.then(() => { if (!alive.current) return; setAuto('done'); timer.current = setTimeout(() => setAuto('idle'), doneFor); },
      () => { if (alive.current) setAuto('idle'); });
  };

  const think = isBusy && busyGlyph === 'think';
  const label = isBusy ? busyLabel ?? children : isDone ? doneLabel ?? children : children;
  const button = (
    <button type="button" {...rest}
      className={cx('dm-pill', variant && 'dm-' + variant, size === 'sm' && 'dm-sm', size === 'lg' && 'dm-btx-lg',
        isBusy && 'dm-busy', isDone && 'dm-done', isDone && success && 'dm-btx-load dm-ok', className)}
      aria-busy={isBusy || undefined} aria-pressed={pressed} onClick={click}>
      <Face id={face} fade={fadeBack && face === 'idle'}>
        {isBusy ? (think ? <Think /> : <Spin />) : isDone ? (doneIcon === undefined ? <Check /> : <span className="dm-enter" style={FACE}>{glyph(doneIcon)}</span>) : glyph(icon)}
        {think ? <span className="dm-shim">{label}</span> : label}
      </Face>
    </button>
  );
  return <span data-dm="" style={ROOT}>{tip ? <Tip label={tip} kbd={kbd}>{button}</Tip> : button}</span>;
}

/* ---------- ButtonIcon ---------- */

export interface ButtonIconProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Read out and shown in the tooltip */
  label: string;
  /** A shortcut shown after the label in the tooltip */
  kbd?: string;
  /** The filled round style (the default), or the bare one */
  fill?: boolean;
  iconSize?: 'xs' | 's' | 'm' | 'l';
}

/** A round icon-only button with a tooltip. */
export function ButtonIcon({ icon, label, kbd, fill = true, iconSize = 'xs', className, ...rest }: ButtonIconProps) {
  return (
    <span data-dm="" style={ROOT}>
      <Tip label={label} kbd={kbd}>
        <button type="button" {...rest} className={cx('dm-ib', fill && 'dm-fill', className)} aria-label={label}><Icon name={icon} size={iconSize} /></button>
      </Tip>
    </span>
  );
}

/* ---------- ButtonCopy ---------- */

export interface ButtonCopyProps {
  /** What goes on the clipboard */
  text: string;
  /** The pill's label, like "Copy link". Left out, it is a round icon button */
  label?: string;
  /** The label for a moment after copying */
  copiedLabel?: string;
  /** The icon button's tooltip and name */
  tip?: string;
  variant?: ButtonVariant;
  onCopy?: (text: string) => void;
  className?: string;
}

/** Copies text, then flashes a check and says so for a moment, like every copy button on the site. */
export function ButtonCopy({ text, label, copiedLabel = 'Copied', tip = 'Copy', variant = 'soft', onCopy, className }: ButtonCopyProps) {
  const [copied, copy] = useCopied();
  const click = () => { copy(text); onCopy?.(text); };
  const mark = <Icon name={copied ? 'check' : 'copy'} size="xs" />;
  return (
    <span data-dm="" style={ROOT}>
      {label === undefined
        ? <Tip label={copied ? 'Copied to clipboard' : tip} open={copied || undefined}>
            <button type="button" className={cx('dm-ib dm-fill', copied && 'dm-copied', className)} aria-label={tip} onClick={click}>{mark}</button>
          </Tip>
        : <Tip label="Copied to clipboard" open={copied || undefined} off={!copied}>
            <button type="button" className={cx('dm-pill', 'dm-' + variant, 'dm-btx-copy', copied && 'dm-copied', className)} onClick={click}>{mark}{copied ? copiedLabel : label}</button>
          </Tip>}
    </span>
  );
}

/* ---------- ButtonMenu ---------- */

export interface ButtonMenuItem {
  key: string;
  label: string;
  /** An icon before the label, or `brand` for a service's own mark */
  icon?: IconName;
  brand?: BrandName;
  /** Quiet text at the end of the row, like "#design" or a shortcut */
  detail?: string;
  /** A destructive action, like Delete: drawn in the danger colour */
  danger?: boolean;
  /** Starts a new group: a line above this item */
  divider?: boolean;
}

function MenuItems({ items, onPick }: { items: ButtonMenuItem[]; onPick: (key: string) => void }) {
  return <>{items.map(it => (
    <Fragment key={it.key}>
      {it.divider && <div className="dm-sep" role="separator" />}
      <button type="button" role="menuitem" className={cx('dm-mi', it.danger && 'dm-del')} onClick={() => onPick(it.key)}>
        {it.brand ? <Brand name={it.brand} /> : it.icon && <Icon name={it.icon} />}
        {it.label}
        {it.detail && <span className="dm-r">{it.detail}</span>}
      </button>
    </Fragment>
  ))}</>;
}

export interface ButtonMenuProps {
  label: string;
  items: ButtonMenuItem[];
  /** Called with the picked item's key. The menu closes a moment later */
  onSelect?: (key: string) => void;
  /** What the button says after a pick, like { label: 'Link copied' }, or { label: 'Exporting', busy: true }. Clear it and the label comes back */
  status?: { label: string; busy?: boolean } | null;
  variant?: ButtonVariant;
  /** Which edge of the button the menu lines up with */
  align?: 'start' | 'end';
  /** Whether the menu is open. Leave it out to let the button toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A button that opens a small menu and then says what happened, like Share. */
export function ButtonMenu({ label, items, onSelect, status, variant = 'line', align = 'start', open, defaultOpen, onOpenChange, className }: ButtonMenuProps) {
  const menu = usePopover({ align, open, defaultOpen, onOpenChange });
  const face = status ? (status.busy ? 'busy:' : 'done:') + status.label : 'idle';
  return (
    <span data-dm="" style={{ position: 'relative', display: 'inline-flex' }}>
      <button type="button" {...menu.trigger} className={cx('dm-pill', 'dm-' + variant, className)} aria-busy={status?.busy || undefined}>
        <Face id={face} fade={!status}>
          {status && (status.busy ? <Spin /> : <Check />)}
          {status ? status.label : label}
        </Face>
      </button>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-btx-sp')} role="menu">
        <MenuItems items={items} onPick={key => { onSelect?.(key); menu.closeSoon(); }} />
      </div>
    </span>
  );
}

/* ---------- ButtonIconMenu ---------- */

export interface ButtonIconMenuProps {
  /** The icon on the button. Defaults to the three dots */
  icon?: IconName;
  /** Read out and shown in the tooltip */
  label: string;
  items: ButtonMenuItem[];
  /** Called with the picked item's key. The menu closes a moment later */
  onSelect?: (key: string) => void;
  /** What just happened, like "Duplicated": the icon turns into a check and the tooltip says it. Clear it and the icon comes back */
  status?: string | null;
  /** Which edge of the button the menu lines up with */
  align?: 'start' | 'end';
  /** Whether the menu is open. Leave it out to let the button toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A round icon button that opens a menu of actions, like More, then flashes a check and says what happened. */
export function ButtonIconMenu({ icon = 'more', label, items, onSelect, status, align = 'end', open, defaultOpen, onOpenChange, className }: ButtonIconMenuProps) {
  const menu = usePopover({ align, open, defaultOpen, onOpenChange });
  return (
    <span data-dm="" style={{ position: 'relative', display: 'inline-flex' }}>
      {/* no tooltip over its own open menu */}
      <Tip label={status || label} open={status ? true : undefined} off={menu.open && !status}>
        <button type="button" {...menu.trigger} className={cx('dm-ib dm-fill dm-btx-more', status && 'dm-done', className)} aria-label={label}>
          <Icon name={status ? 'check' : icon} size="xs" />
        </button>
      </Tip>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-btx-mp')} role="menu">
        <MenuItems items={items} onPick={key => { onSelect?.(key); menu.closeSoon(); }} />
      </div>
    </span>
  );
}

/* ---------- ButtonRun ---------- */

export type ButtonRunState = 'idle' | 'running' | 'stopped' | 'complete';

export interface ButtonRunProps {
  state: ButtonRunState;
  /** How long it has been running, shown as m:ss */
  seconds?: number;
  label?: string;
  /** Clicked while not running */
  onRun?: () => void;
  /** Clicked while running. Hovering a running button already reads Stop */
  onStop?: () => void;
  variant?: ButtonVariant;
  className?: string;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;

/** Starts a run and shows its time; while it runs, hovering turns it into Stop. */
export function ButtonRun({ state, seconds = 0, label = 'Run agent', onRun, onStop, variant = 'ink', className }: ButtonRunProps) {
  const [hover, setHover] = useState(false);
  const running = state === 'running';
  const face = running ? (hover ? 'stop' : 'run') : state;
  return (
    <span data-dm="" style={ROOT}>
      <button type="button" className={cx('dm-pill', 'dm-' + variant, 'dm-btx-run', running && 'dm-busy', className)} aria-busy={running || undefined}
        onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onClick={() => (running ? onStop : onRun)?.()}>
        <Face id={face} fade={state === 'idle'}>
          {face === 'stop' || face === 'stopped' ? <span className="dm-sq" /> : face === 'run' ? <Spin /> : face === 'complete' ? <Check /> : null}
          {face === 'stop' ? 'Stop' : face === 'stopped' ? 'Stopped' : face === 'complete' ? 'Run complete' : face === 'run' ? 'Running' : label}
          {face === 'run' && <span className="dm-num">{clock(seconds)}</span>}
        </Face>
      </button>
    </span>
  );
}

/* ---------- ButtonHold ---------- */

export interface ButtonHoldProps {
  label?: string;
  /** Shown while it is held */
  holdingLabel?: string;
  /** Shown once the hold completes */
  doneLabel?: string;
  icon?: IconName;
  /** Called when it has been held for 1.2s, with a pointer or with Space or Enter */
  onConfirm?: () => void;
  /** How long the done face stays before it resets */
  resetAfter?: number;
  className?: string;
}

/** A destructive action you hold down to confirm, filling up as you hold. Letting go early cancels it. */
export function ButtonHold({ label = 'Hold to delete', holdingLabel = 'Keep holding', doneLabel = 'Deleted', icon = 'trash', onConfirm, resetAfter = 1800, className }: ButtonHoldProps) {
  const [state, setState] = useState<'idle' | 'holding' | 'done'>('idle');
  // the label blurs out before "Keep holding" comes in
  const [said, setSaid] = useState(false);
  const [out, setOut] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);
  const later = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };

  const start = () => {
    if (state !== 'idle') return;
    setState('holding'); setOut(true);
    later(170, () => { setSaid(true); setOut(false); });
    later(1200, () => {
      setState('done'); setSaid(false); onConfirm?.();
      later(resetAfter, () => setState('idle'));
    });
  };
  const end = () => { if (state !== 'holding') return; clear(); setState('idle'); setSaid(false); setOut(false); };

  return (
    <span data-dm="" style={ROOT}>
      <button type="button" className={cx('dm-pill dm-btx-hold', state === 'holding' && 'dm-h', state === 'done' && 'dm-done', className)}
        onPointerDown={start} onPointerUp={end} onPointerLeave={end} onBlur={end}
        onKeyDown={e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); } }}
        onKeyUp={e => { if (e.key === ' ' || e.key === 'Enter') end(); }}>
        <span className="dm-fill" />
        <span className={cx('dm-lb', state === 'holding' && 'dm-sw', out && 'dm-out')}>
          {state === 'done' ? <><Icon name="check" size="xs" />{doneLabel}</> : said ? holdingLabel : <><Icon name={icon} size="xs" />{label}</>}
        </span>
      </button>
    </span>
  );
}

/* ---------- Buttons ---------- */

export interface ButtonsRow {
  /** The quiet name on the left, like "States" */
  label: string;
  children: ReactNode;
}

export interface ButtonsProps {
  rows: ButtonsRow[];
  className?: string;
}

/** Labelled rows of buttons, the way designme.dev lays out its button sheet. */
export function Buttons({ rows, className }: ButtonsProps) {
  return (
    <div data-dm="" className={cx('dm-btx', className)}>
      {rows.map((r, i) => <div key={i} className="dm-btx-row"><span className="dm-btx-l dm-muted">{r.label}</span>{r.children}</div>)}
    </div>
  );
}
```

## More in Forms and inputs

- [Tooltip](https://designme.dev/components/tooltip.md): Quiet labels on hover, with shortcuts and a richer preview card.
- [Search input](https://designme.dev/components/search-input.md): Search with scoped filters, recent queries and an agent answer.
- [Country select](https://designme.dev/components/country-select.md): A searchable select with country codes, currency and keyboard support.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then a one-time code that fills itself in.
- [Form](https://designme.dev/components/form.md): A project brief with inline checks and an agent that drafts the rest.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.

All components: https://designme.dev/llms.txt
