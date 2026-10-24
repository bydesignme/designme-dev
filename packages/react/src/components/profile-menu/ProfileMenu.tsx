'use client';
import { useEffect, useId, useRef, useState, type KeyboardEvent, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
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
  /** The person signed in. `color` is the avatar's colour, like 'var(--dm-pl)' */
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
            <span className="dm-av" style={user.color ? { background: user.color } : undefined}>{initials}</span><Icon name="chev-d" size="xs" />
          </button>
        ) : (
          <button ref={signIn} type="button" className="dm-pill dm-line dm-sm dm-pfm-in" onClick={() => { setIn(true); setTimeout(() => trigger.current?.focus()); }}>Sign in</button>
        )}
      </div>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-pfm-pop')} role="menu" aria-labelledby={`${id}-n ${id}-e`} onKeyDown={onMenuKey}>
        <div className="dm-pfm-me" role="none">
          <span className="dm-av" style={user.color ? { background: user.color } : undefined}>{initials}</span>
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
