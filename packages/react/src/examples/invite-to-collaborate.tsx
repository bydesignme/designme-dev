'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { InviteToCollaborate, type InviteToCollaborateMember } from '../components/invite-to-collaborate/InviteToCollaborate';
import { useStory } from './useScript';

/* ---------- Invite to collaborate: two addresses are typed in, one of them not quite right ---------- */
const TEAM: InviteToCollaborateMember[] = [
  { name: 'Maya Kim', initials: 'MK', color: 'var(--dm-av-l)', role: 'Owner' },
  { name: 'Jon Ortiz', initials: 'JO', color: 'var(--dm-av-m)', role: 'Can edit' }
];
const COLORS = ['var(--dm-av-l)', 'var(--dm-av-m)', 'var(--dm-av-t)', 'var(--dm-av-p)', 'var(--dm-av-k)'];
const TYPED = 'dana@studio.com, lee@studio';
const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export default function InviteToCollaborateDemo() {
  const [emails, setEmails] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [members, setMembers] = useState(TEAM);
  // a comma turns what is typed so far into a chip, the same as typing one in the field
  const commit = (text: string) => { const part = text.trim(); if (part) setEmails(es => (es.includes(part) ? es : [...es, part])); setDraft(''); };

  // the preview adds two people on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, taken }) => {
    await wait(900);
    taken(() => setDraft(''));
    let text = '';
    for (const ch of TYPED) {
      if (ch === ',') { commit(text); text = ''; } else { text += ch; setDraft(text); }
      await wait(40);
    }
    commit(text);
  });

  // sending takes a moment, then the invited people join the list as pending
  const send = async (valid: string[], role: string) => {
    await wait(800);
    setMembers(ms => [...ms, ...valid.map((e, i) => ({
      key: e, name: e.split('@')[0], detail: e, initials: e.split('@')[0].slice(0, 2).toUpperCase(), color: COLORS[i % COLORS.length],
      role: `Invited, ${role.toLowerCase()}`, pending: true
    }))]);
  };

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <InviteToCollaborate emails={emails} onEmailsChange={setEmails} draft={draft} onDraftChange={setDraft} members={members} onSend={send}
        suggestions={[{ email: 'ari@studio.com', initials: 'AR', color: 'var(--dm-av-p)' }, { email: 'sam@studio.com', initials: 'SL', color: 'var(--dm-av-t)' }]}
        link="https://designme.dev/join/pricing-refresh" />
    </div>
  );
}
