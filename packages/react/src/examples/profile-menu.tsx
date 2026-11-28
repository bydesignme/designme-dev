'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ProfileMenu, type ProfileMenuTheme, type ProfileMenuWorkspace } from '../components/profile-menu/ProfileMenu';
import { useStory } from './useScript';

/* ---------- Profile menu: open it, switch to Acme Labs, then open it again and pick the Dark theme ---------- */
const WORKSPACES: ProfileMenuWorkspace[] = [
  { id: 'northwind', name: 'Northwind', detail: 'Pro, 12 members', tint: 'pb' },
  { id: 'acme', name: 'Acme Labs', detail: 'Free, 3 members', tint: 'pk' },
  { id: 'personal', name: 'Personal', detail: 'Just you', tint: 'pl' }
];

export default function ProfileMenuDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [workspace, setWorkspace] = useState('northwind');
  // the theme row starts from the page's theme (System when it follows the device); apply it to your own app in onThemeChange
  const [theme, setTheme] = useState<ProfileMenuTheme>(() => { const t = typeof document !== 'undefined' ? document.documentElement.dataset.theme : undefined; return t === 'dark' || t === 'light' ? t : 'system'; });
  const [signedIn, setSignedIn] = useState(true);
  const [note, setNote] = useState<string>();

  // the preview's story: open the menu, switch to Acme Labs, then open it again and pick the Dark theme
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-pfm-tr');
    await wait(3000); press('.dm-mi[role="menuitemradio"]:nth-of-type(2)');
    await wait(2500); press('.dm-pfm-tr');
    await wait(1500); press('.dm-pfm-tho:nth-of-type(3)');
    await wait(1800); press('.dm-pfm-tr');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ProfileMenu user={{ name: 'Maya Kim', email: 'maya@northwind.studio', color: 'var(--dm-av-l)' }} workspaces={WORKSPACES} context="Pricing refresh"
        workspace={workspace} onWorkspaceChange={id => { if (id !== workspace) setNote(`Switched to ${WORKSPACES.find(w => w.id === id)!.name}`); setWorkspace(id); }}
        theme={theme} onThemeChange={t => { setTheme(t); setNote(`Theme set to ${t === 'system' ? 'System' : t === 'light' ? 'Light' : 'Dark'}`); }}
        signedIn={signedIn} onSignedInChange={s => { setSignedIn(s); setNote(s ? 'Signed in as Maya Kim' : `Signed out of ${WORKSPACES.find(w => w.id === workspace)!.name}`); }}
        note={note} />
    </div>
  );
}
