'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ProfileMenu, type ProfileMenuWorkspace } from '../components/profile-menu/ProfileMenu';
import { useStory } from './useScript';

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
      <ProfileMenu user={{ name: 'Maya Kim', email: 'maya@northwind.studio', color: 'var(--dm-pl)' }} workspaces={WORKSPACES} context="Pricing refresh"
        workspace={workspace} onWorkspaceChange={id => { if (id !== workspace) setNote(`Switched to ${WORKSPACES.find(w => w.id === id)!.name}`); setWorkspace(id); }}
        dark={dark} onDarkChange={d => { setDark(d); setNote(`Theme set to ${d ? 'dark' : 'light'}`); }}
        signedIn={signedIn} onSignedInChange={s => { setSignedIn(s); setNote(s ? 'Signed in as Maya Kim' : `Signed out of ${WORKSPACES.find(w => w.id === workspace)!.name}`); }}
        note={note} />
    </div>
  );
}
