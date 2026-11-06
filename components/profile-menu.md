# Profile menu

> The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/profile-menu

## Install

```sh
npx designme add profile-menu          # HTML, CSS and JS, with the shared core
npx designme add profile-menu --react  # React 19 component and its CSS
npx designme add profile-menu --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/profile-menu.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/profile-menu.json  # Astro
```

## About

Profile menu is the account menu that opens from an avatar in an app's top bar. It shows who is signed in, lists the workspaces to switch between, and holds a theme switch, a Keyboard shortcuts row with its key, and Sign out. It is a real menu: the arrow keys move through it, Escape closes it and puts the focus back on the avatar.

### When to use it

- When people belong to more than one workspace and switch between them from anywhere in the app.
- When the account's settings that apply everywhere, like the theme, should sit one click from every page.
- When the app has keyboard shortcuts and people need a place to find them.
- When the top bar has room for an avatar but not for a row of account buttons.

### What it does

- The menu opens under the avatar, lined up with its right edge, and starts with the person's name and email.
- The workspaces are a group of radio items, each with a tinted tile, a name and a quiet `detail` like "Free, 3 members". The current one is checked; picking another closes the menu and the bar crossfades to its name.
- The theme is a switch row. It stays in the menu after a click, so the change shows where it was made. It reports the change through `onDarkChange`; applying the theme is up to you.
- Keyboard shortcuts shows its key, ?, and opens a short list under the bar. Pressing ? anywhere in the component opens and closes the same list. By default it lists the keys the menu itself answers to.
- Sign out swaps the avatar for a Sign in button, which swaps it back. `note` shows a confirmation with a green check under the bar, like "Switched to Acme Labs".

### Accessibility

- The avatar is a button with `aria-haspopup="menu"` and `aria-expanded`, labelled "Account menu" and the person's name.
- The menu has `role="menu"` and is named by the name and email at its top. The workspaces are `menuitemradio` items in a group named "Workspaces"; the theme row is a `menuitemcheckbox`; the rest are `menuitem`s.
- Enter, Space or the down arrow on the avatar opens the menu on its first item, and the up arrow on its last. Inside, the arrow keys move and wrap, Home and End jump to the ends, Escape closes it and gives the focus back to the avatar, and Tab closes it and moves on.
- The confirmation under the bar is a polite live region, so a switch or a theme change is announced.

## Usage in React

```tsx
import { ProfileMenu } from '@/components/designme/profile-menu/ProfileMenu';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ProfileMenu, type ProfileMenuWorkspace } from './ProfileMenu';
import { useStory } from '../lib/useScript';

/* ---------- Profile menu: open it, switch to Acme Labs, then open it again and flip the theme ---------- */
const WORKSPACES: ProfileMenuWorkspace[] = [
  { id: 'northwind', name: 'Northwind', detail: 'Pro, 12 members', tint: 'pb' },
  { id: 'acme', name: 'Acme Labs', detail: 'Free, 3 members', tint: 'pp' },
  { id: 'personal', name: 'Personal', detail: 'Just you', tint: 'pl' }
];

export default function ProfileMenuDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState('northwind');
  // the switch starts from the page's theme; apply it to your own app in onDarkChange
  const [dark, setDark] = useState(() => typeof document !== 'undefined' && (document.documentElement.dataset.theme ? document.documentElement.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches));
  const [signedIn, setSignedIn] = useState(true);
  const [note, setNote] = useState<string>();

  // the preview's story: open the menu, switch to Acme Labs, then open it again and flip the theme
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-pfm-tr');
    await wait(3000); press('.dm-mi[role="menuitemradio"]:nth-of-type(2)');
    await wait(2500); press('.dm-pfm-tr');
    await wait(1500); press('.dm-pfm-th');
    await wait(1800); press('.dm-pfm-tr');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ProfileMenu user={{ name: 'Maya Kim', email: 'maya@northwind.studio', color: 'var(--dm-av-l)' }} workspaces={WORKSPACES} context="Pricing refresh"
        workspace={workspace} onWorkspaceChange={id => { if (id !== workspace) setNote(`Switched to ${WORKSPACES.find(w => w.id === id)!.name}`); setWorkspace(id); }}
        dark={dark} onDarkChange={d => { setDark(d); setNote(`Theme set to ${d ? 'dark' : 'light'}`); }}
        signedIn={signedIn} onSignedInChange={s => { setSignedIn(s); setNote(s ? 'Signed in as Maya Kim' : `Signed out of ${WORKSPACES.find(w => w.id === workspace)!.name}`); }}
        note={note} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `user` | `{ name: string; email: string; initials?: string; color?: string }` | The person signed in. `color` is the avatar's colour, like 'var(--dm-av-l)' |
| `workspaces` | `ProfileMenuWorkspace[]` |  |
| `workspace` (optional) | `string` | The current workspace's id. Leave it out to let the menu switch it |
| `defaultWorkspace` (optional) | `string` |  |
| `onWorkspaceChange` (optional) | `(id: string) => void` |  |
| `context` (optional) | `ReactNode` | The quiet line under the workspace name in the bar, like the page you're on |
| `dark` (optional) | `boolean` | The theme switch. It only reports the change: apply the theme in `onDarkChange` |
| `defaultDark` (optional) | `boolean` |  |
| `onDarkChange` (optional) | `(dark: boolean) => void` |  |
| `themeLabel` (optional) | `string` | Defaults to "Dark theme" |
| `shortcuts` (optional) | `ProfileMenuShortcut[]` | The list Keyboard shortcuts opens. Defaults to the keys this menu answers to |
| `shortcutsOpen` (optional) | `boolean` | Whether that list is open. Keyboard shortcuts, or ? anywhere in the component, opens it |
| `defaultShortcutsOpen` (optional) | `boolean` |  |
| `onShortcutsOpenChange` (optional) | `(open: boolean) => void` |  |
| `signedIn` (optional) | `boolean` | Sign out swaps the avatar for a Sign in button, which swaps it back |
| `defaultSignedIn` (optional) | `boolean` |  |
| `onSignedInChange` (optional) | `(signedIn: boolean) => void` |  |
| `note` (optional) | `string` | A confirmation under the bar, like "Switched to Acme Labs". Shown with a green check |
| `open` (optional) | `boolean` | Whether the menu is open. Leave it out to let the avatar, Escape and a click outside open and close it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ProfileMenu from '../components/designme/profile-menu/ProfileMenu.astro';
---
<ProfileMenu />
<ProfileMenu data-style="soft" class="my-class" />
```
It plays its demo; change `profile-menu.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does the theme switch change the theme?**

No. It flips its own state and calls `onDarkChange`. Set `data-theme` on `<html>` there, or call your own theme code. On designme.dev the demo only says what it was set to.

**Can the workspaces be a submenu instead?**

They are an inline list, so the whole menu fits a phone screen without a flyout. Keep the list short; for many workspaces, link to a page that lists them all.

**What happens on Sign out?**

The avatar gives way to a Sign in button and `onSignedInChange(false)` is called. Do the real sign out there, or control it with `signedIn`.

**Can I list my app's own shortcuts?**

Yes. Pass `shortcuts` as `{ keys, label }[]`. Only ? is handled by the component; your other keys need your own handlers.

## Source

`ProfileMenu.tsx`, as `npx designme add profile-menu --react` installs it:

```tsx
'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { avatarInk, enter, Fold, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './profile-menu.css';

/** The tint of a workspace's tile, from the designme palette */
export type ProfileMenuTint = 'pb' | 'pl' | 'pm' | 'pp' | 'pr' | 'py' | 'pk' | 'pt';

/** One workspace the account belongs to */
export interface ProfileMenuWorkspace {
  id: string;
  /** Like "Acme Labs" */
  name: string;
  /** The quiet line under the name in the menu, like "Free, 3 members" */
  detail?: string;
  /** The letter in its tile. Defaults to the first letter of the name */
  initial?: string;
  /** The tile's tint. Grey when left out */
  tint?: ProfileMenuTint;
}

/** A row in the shortcuts list: the keys, then what they do */
export interface ProfileMenuShortcut {
  keys: string[];
  label: string;
}

export interface ProfileMenuProps {
  /** The person signed in. `color` is the avatar's colour, like 'var(--dm-av-l)' */
  user: { name: string; email: string; initials?: string; color?: string };
  workspaces: ProfileMenuWorkspace[];
  /** The current workspace's id. Leave it out to let the menu switch it */
  workspace?: string;
  defaultWorkspace?: string;
  onWorkspaceChange?: (id: string) => void;
  /** The quiet line under the workspace name in the bar, like the page you're on */
  context?: ReactNode;
  /** The theme switch. It only reports the change: apply the theme in `onDarkChange` */
  dark?: boolean;
  defaultDark?: boolean;
  onDarkChange?: (dark: boolean) => void;
  /** Defaults to "Dark theme" */
  themeLabel?: string;
  /** The list Keyboard shortcuts opens. Defaults to the keys this menu answers to */
  shortcuts?: ProfileMenuShortcut[];
  /** Whether that list is open. Keyboard shortcuts, or ? anywhere in the component, opens it */
  shortcutsOpen?: boolean;
  defaultShortcutsOpen?: boolean;
  onShortcutsOpenChange?: (open: boolean) => void;
  /** Sign out swaps the avatar for a Sign in button, which swaps it back */
  signedIn?: boolean;
  defaultSignedIn?: boolean;
  onSignedInChange?: (signedIn: boolean) => void;
  /** A confirmation under the bar, like "Switched to Acme Labs". Shown with a green check */
  note?: string;
  /** Whether the menu is open. Leave it out to let the avatar, Escape and a click outside open and close it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const SHORTCUTS: ProfileMenuShortcut[] = [
  { keys: ['↑', '↓'], label: 'Move through the menu' }, { keys: ['Home', 'End'], label: 'First or last item' },
  { keys: ['Esc'], label: 'Close the menu' }, { keys: ['?'], label: 'Show these shortcuts' }
];

/** The account menu behind an avatar: who is signed in, the workspaces to switch between, a theme switch, keyboard shortcuts and Sign out. */
export function ProfileMenu({
  user, workspaces, workspace, defaultWorkspace, onWorkspaceChange, context, dark, defaultDark = false, onDarkChange, themeLabel = 'Dark theme',
  shortcuts = SHORTCUTS, shortcutsOpen, defaultShortcutsOpen = false, onShortcutsOpenChange, signedIn, defaultSignedIn = true, onSignedInChange,
  note, open, defaultOpen = false, onOpenChange, className
}: ProfileMenuProps) {
  const [ws, setWs] = useControllable(workspace, defaultWorkspace ?? workspaces[0]?.id ?? '', onWorkspaceChange);
  const [isDark, setDark] = useControllable(dark, defaultDark, onDarkChange);
  const [keysOpen, setKeysOpen] = useControllable(shortcutsOpen, defaultShortcutsOpen, onShortcutsOpenChange);
  const [isIn, setIn] = useControllable(signedIn, defaultSignedIn, onSignedInChange);
  // the menu opens downwards under the avatar, lined up with its right edge
  const menu = usePopover({ align: 'end', side: 'down', open, defaultOpen, onOpenChange });
  const pop = menu.pop.ref, trigger = menu.trigger.ref;
  const signIn = useRef<HTMLButtonElement>(null), closeKeys = useRef<HTMLButtonElement>(null);
  const id = useId();
  const cur = workspaces.find(w => w.id === ws) ?? workspaces[0];
  const initials = user.initials ?? user.name.split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase();
  // the confirmation enters each time it changes
  const [noteKey, setNoteKey] = useState(0);
  useEffect(() => { if (note) setNoteKey(k => k + 1); }, [note]);

  // where the focus goes once the menu has opened: the first or last item, or nowhere for a scripted click
  const focusTo = useRef<'first' | 'last' | null>(null);
  const items = () => Array.from(pop.current?.querySelectorAll<HTMLElement>('[role^="menuitem"]') ?? []);
  useEffect(() => {
    if (!menu.open || !focusTo.current) return;
    const all = items(); (focusTo.current === 'last' ? all[all.length - 1] : all[0])?.focus(); focusTo.current = null;
  }, [menu.open]); // eslint-disable-line react-hooks/exhaustive-deps
  // closing it from inside gives the focus back to the avatar
  const close = (soon = false) => { if (pop.current?.contains(document.activeElement)) trigger.current?.focus(); if (soon) menu.closeSoon(); else menu.close(); };
  const onTrigger = (e: MouseEvent) => { if (!menu.open && e.nativeEvent.isTrusted) focusTo.current = 'first'; menu.trigger.onClick(); };
  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
    e.preventDefault(); focusTo.current = e.key === 'ArrowUp' ? 'last' : 'first';
    if (menu.open) { const all = items(); (focusTo.current === 'last' ? all[all.length - 1] : all[0])?.focus(); focusTo.current = null; } else menu.setOpen(true);
  };
  // inside the menu: the arrow keys move and wrap, Home and End jump to the ends, Tab leaves it (Escape is the popover's)
  const onMenuKey = (e: KeyboardEvent) => {
    const all = items(), i = all.indexOf(document.activeElement as HTMLElement);
    const go = ({ ArrowDown: all[(i + 1) % all.length], ArrowUp: all[(i - 1 + all.length) % all.length], Home: all[0], End: all[all.length - 1] } as Record<string, HTMLElement | undefined>)[e.key];
    if (go) { e.preventDefault(); go.focus(); } else if (e.key === 'Tab') setTimeout(() => menu.close());
  };
  const showKeys = (on: boolean) => setKeysOpen(on);
  // the menu opens over whatever sits under the bar, so the component keeps room for it below the bar: centred in a
  // stage, the open menu still ends inside it
  const bar = useRef<HTMLDivElement>(null);
  const [room, setRoom] = useState<number>();
  useEffect(() => {
    const fit = () => { if (bar.current && pop.current) setRoom(Math.ceil(bar.current.offsetHeight + 6 + pop.current.offsetHeight)); };
    fit(); const ro = new ResizeObserver(fit);
    if (bar.current) ro.observe(bar.current); if (pop.current) ro.observe(pop.current);
    return () => ro.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div data-dm="" className={cx('dm-pfm', className)} style={room ? { minHeight: room } : undefined}
      onKeyDown={e => { if (e.key === '?' && !(e.target as HTMLElement).matches('input,textarea')) { e.preventDefault(); menu.close(); showKeys(!keysOpen); } }}>
      <div ref={bar} className="dm-pfm-bar dm-panel">
        {cur && <span className="dm-pfm-lg" data-t={cur.tint}>{cur.initial ?? cur.name[0]}</span>}
        <span className="dm-pfm-ws"><Swap className="dm-pfm-wn">{cur?.name ?? ''}</Swap>{context && <span className="dm-muted">{context}</span>}</span>
        {isIn ? (
          <button {...menu.trigger} onClick={onTrigger} onKeyDown={onTriggerKey} type="button" className="dm-pfm-tr" aria-label={`Account menu, ${user.name}`}>
            <span className="dm-av" style={user.color ? { background: user.color, color: avatarInk(user.color) } : undefined}>{initials}</span><Icon name="chev-d" size="xs" />
          </button>
        ) : (
          <button ref={signIn} type="button" className="dm-pill dm-line dm-sm dm-pfm-in" onClick={() => { setIn(true); setTimeout(() => trigger.current?.focus()); }}>Sign in</button>
        )}
      </div>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-pfm-pop')} role="menu" aria-labelledby={`${id}-n ${id}-e`} onKeyDown={onMenuKey}>
        <div className="dm-pfm-me" role="none">
          <span className="dm-av" style={user.color ? { background: user.color, color: avatarInk(user.color) } : undefined}>{initials}</span>
          <span className="dm-t"><b id={`${id}-n`}>{user.name}</b><span className="dm-muted" id={`${id}-e`}>{user.email}</span></span>
        </div>
        <div className="dm-sep" role="separator" />
        <div role="group" aria-labelledby={`${id}-w`}>
          <div className="dm-ph" role="none" id={`${id}-w`}>Workspaces</div>
          {workspaces.map(w => (
            <button key={w.id} type="button" className="dm-mi" role="menuitemradio" aria-checked={w.id === cur?.id} tabIndex={-1} onClick={() => { setWs(w.id); close(true); }}>
              <span className="dm-pfm-lg" data-t={w.tint}>{w.initial ?? w.name[0]}</span>
              <span>{w.name}{w.detail && <span className="dm-d">{w.detail}</span>}</span>
              <span className="dm-ck"><Icon name="check" size="xs" /></span>
            </button>
          ))}
        </div>
        <div className="dm-sep" role="separator" />
        <button type="button" className="dm-mi dm-pfm-th" role="menuitemcheckbox" aria-checked={isDark} tabIndex={-1} onClick={() => setDark(!isDark)}>
          <Icon name="moon" /><span>{themeLabel}</span><span className="dm-toggle" aria-hidden="true" />
        </button>
        <button type="button" className="dm-mi dm-pfm-ky" role="menuitem" tabIndex={-1} onClick={() => { const had = pop.current?.contains(document.activeElement); menu.close(); showKeys(true); if (had) setTimeout(() => closeKeys.current?.focus()); }}>
          <Icon name="keyboard" /><span>Keyboard shortcuts</span><span className="dm-kbd" aria-hidden="true">?</span>
        </button>
        <div className="dm-sep" role="separator" />
        <button type="button" className="dm-mi dm-pfm-out" role="menuitem" tabIndex={-1} onClick={() => { const had = pop.current?.contains(document.activeElement); menu.close(); setIn(false); if (had) setTimeout(() => signIn.current?.focus()); }}>
          <Icon name="logout" /><span>Sign out</span>
        </button>
      </div>
      <Fold open={keysOpen} className="dm-pfm-kf">
        <div className="dm-pfm-keys dm-panel" role="region" aria-label="Keyboard shortcuts">
          <div className="dm-pfm-kh"><b>Keyboard shortcuts</b>
            <Tip label="Close"><button ref={closeKeys} type="button" className="dm-ib dm-pfm-kx" aria-label="Close shortcuts" onClick={() => { showKeys(false); trigger.current?.focus(); }}><Icon name="x" size="xs" /></button></Tip>
          </div>
          <dl className="dm-pfm-kl">
            {shortcuts.map(s => <div key={s.label}><dt>{s.keys.map(k => <span key={k} className="dm-kbd">{k}</span>)}</dt><dd>{s.label}</dd></div>)}
          </dl>
        </div>
      </Fold>
      <p className="dm-pfm-note dm-muted" aria-live="polite">
        {note && <><Icon name="ok" size="xs" /><span key={noteKey} {...enter()}>{note}</span></>}
      </p>
    </div>
  );
}
```

## More in Collaboration

- [Banner](https://designme.dev/components/banner.md): An announcement on a tint of its tone, with its own line drawing.
- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.
- [Notifications](https://designme.dev/components/notifications.md): An inbox where agent updates and mentions arrive live.
- [Invite to collaborate](https://designme.dev/components/invite-to-collaborate.md): Add teammates by email as chips, set their role, send.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Context menu](https://designme.dev/components/context-menu.md): Right-click an agent reply for its actions, with a submenu that asks the agent about it.
- [Context switcher](https://designme.dev/components/context-switcher.md): The organisation, project and environment you are in, each part a searchable switcher.
- [Filter menu](https://designme.dev/components/filter-menu.md): Add filters from a menu, see them as chips, and watch the count change.
- [Number field](https://designme.dev/components/number-field.md): Type a number or step it with minus and plus, with units, limits and a word when a value is changed to fit.
- [Ticket list](https://designme.dev/components/ticket-list.md): Support tickets the agent has triaged, with suggested replies.
- [Kanban board](https://designme.dev/components/kanban-board.md): A sprint board where you and the agent move cards, with filters, details and keyboard moves.

All components: https://designme.dev/llms.txt
