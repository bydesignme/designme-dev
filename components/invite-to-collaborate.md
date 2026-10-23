# Invite to collaborate

> Add teammates by email as chips, set their role, send.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/invite-to-collaborate

## Install

```sh
npx designme add invite-to-collaborate          # HTML, CSS and JS, with the shared core
npx designme add invite-to-collaborate --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Invite to collaborate is a sharing panel where a person types email addresses that turn into chips, picks a role such as Can edit or Can view, and sends the invites. Addresses that don't look valid are flagged and block sending until they are fixed or removed. Below the field it lists who already has access, with pending invites shown in amber.

### When to use it

- When a project, workspace or agent run should be shared with teammates
- When invitees need a role, such as whether they may run the agent or only comment
- When you can suggest likely teammates for one-click adding
- When a share link is an alternative to inviting by email

### What it does

- Enter, a comma, Tab, pasting or leaving the field turns typed text into chips, and duplicates are skipped.
- Backspace in an empty field removes the last chip, and each chip has its own remove button.
- Invalid addresses show a warning chip with a "Not a valid email" tip, and Send stays disabled until every chip is valid.
- The role menu lists `roles` with a short `detail` each; the default roles are Can edit, Can comment and Can view.
- `onSend` receives the valid addresses and the role; a promise shows a spinner, then the chips clear. The button reads "Send 2 invites" for more than one.
- `suggestions` add people in one click, and `link` adds a Copy link button that confirms with Link copied.

### Accessibility

- The role options are `menuitemradio` items in a menu labelled Role, with `aria-checked` on the current role.
- The role button reports `aria-expanded`, and Escape closes the menu and returns focus to it.
- Each chip's remove button is labelled "Remove" followed by the address, and the input is labelled Email addresses.
- The send button sets `aria-busy` while invites are going out.

## Usage in React

```tsx
import { InviteToCollaborate } from '@/components/designme/invite-to-collaborate/InviteToCollaborate';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { InviteToCollaborate, type InviteToCollaborateMember } from './InviteToCollaborate';
import { useScript } from '../lib/useScript';

/* ---------- Invite to collaborate: two addresses are typed in, one of them not quite right ---------- */
const TEAM: InviteToCollaborateMember[] = [
  { name: 'Maya Kim', initials: 'MK', color: 'var(--dm-pl)', role: 'Owner' },
  { name: 'Jon Ortiz', initials: 'JO', color: 'var(--dm-pm)', role: 'Can edit' }
];
const COLORS = ['var(--dm-pl)', 'var(--dm-pm)', 'var(--dm-pt)', 'var(--dm-pp)', 'var(--dm-pk)'];
const TYPED = 'dana@studio.com, lee@studio';
const wait = (ms: number) => new Promise(res => setTimeout(res, ms));

export default function InviteToCollaborateDemo() {
  const [emails, setEmails] = useState<string[]>([]);
  const [draft, setDraft] = useState('');
  const [members, setMembers] = useState(TEAM);
  // a comma turns what is typed so far into a chip, the same as typing one in the field
  const commit = (text: string) => { const part = text.trim(); if (part) setEmails(es => (es.includes(part) ? es : [...es, part])); setDraft(''); };

  useScript(async ({ wait }) => {
    await wait(900);
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
    <div style={{ width: '100%' }}>
      <InviteToCollaborate emails={emails} onEmailsChange={setEmails} draft={draft} onDraftChange={setDraft} members={members} onSend={send}
        suggestions={[{ email: 'ari@studio.com', initials: 'AR', color: 'var(--dm-pp)' }, { email: 'sam@studio.com', initials: 'SL', color: 'var(--dm-pt)' }]}
        link="https://designme.dev/join/pricing-refresh" />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` (optional) | `ReactNode` |  |
| `subtitle` (optional) | `ReactNode` |  |
| `emails` (optional) | `string[]` | The addresses added so far, shown as chips. Leave it out to let the field keep them |
| `defaultEmails` (optional) | `string[]` |  |
| `onEmailsChange` (optional) | `(emails: string[]) => void` |  |
| `draft` (optional) | `string` | The text being typed. Enter, a comma, Tab, a paste or leaving the field turns it into chips |
| `defaultDraft` (optional) | `string` |  |
| `onDraftChange` (optional) | `(draft: string) => void` |  |
| `roles` (optional) | `InviteToCollaborateRole[]` |  |
| `role` (optional) | `string` | The role label the invites get. Leave it out to let the menu change it |
| `defaultRole` (optional) | `string` |  |
| `onRoleChange` (optional) | `(role: string) => void` |  |
| `suggestions` (optional) | `InviteToCollaborateSuggestion[]` | People to add in one click. A picked one leaves the row |
| `members` (optional) | `InviteToCollaborateMember[]` | Who is in already, with invites sent |
| `onSend` (optional) | `(emails: string[], role: string) => void \| Promise<unknown>` | Called with the valid addresses and the role. Return a promise and the button spins until it settles; the chips clear after |
| `link` (optional) | `string` | Adds Copy link, which copies this |
| `copyLabel` (optional) | `string` |  |
| `copiedLabel` (optional) | `string` |  |
| `placeholder` (optional) | `string` |  |
| `validate` (optional) | `(email: string) => boolean` | Which addresses are valid. Defaults to anything shaped like name@host.tld |
| `colors` (optional) | `string[]` | Avatar colours for the chips, in turn |
| `className` (optional) | `string` |  |

## Questions

**How do I add the invited people to the members list after sending?**

In `onSend`, append them to the `members` you pass in, with `pending: true` and a role like "Invited, can edit". Members added after the first render come in one after another.

**Can I restrict invites to my company's domain?**

Yes. Pass `validate`, a function that returns true for allowed addresses. Anything else shows as an invalid chip and keeps Send disabled.

**Can I set my own roles?**

Pass `roles` with a `label` and optional `detail` for each. The first role is selected unless you set `defaultRole` or control `role`.

## Source

`InviteToCollaborate.tsx`, as `npx designme add invite-to-collaborate --react` installs it:

```tsx
'use client';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useCopied } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Avatar, enter, Spin, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './invite-to-collaborate.css';

export interface InviteToCollaborateRole {
  /** Like "Can edit" */
  label: string;
  /** Like "Change frames, run the agent" */
  detail?: string;
}

export interface InviteToCollaborateMember {
  /** Keeps the row in place. Defaults to the name */
  key?: string;
  name: string;
  /** A quiet line under the name, like the email of someone just invited */
  detail?: string;
  initials: string;
  /** The avatar colour, like 'var(--dm-pl)' */
  color: string;
  /** Like "Owner" or "Invited, can edit" */
  role: string;
  /** Shows the role in amber, for invites not yet accepted */
  pending?: boolean;
}

export interface InviteToCollaborateSuggestion {
  email: string;
  initials: string;
  color: string;
}

export interface InviteToCollaborateProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  /** The addresses added so far, shown as chips. Leave it out to let the field keep them */
  emails?: string[];
  defaultEmails?: string[];
  onEmailsChange?: (emails: string[]) => void;
  /** The text being typed. Enter, a comma, Tab, a paste or leaving the field turns it into chips */
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (draft: string) => void;
  roles?: InviteToCollaborateRole[];
  /** The role label the invites get. Leave it out to let the menu change it */
  role?: string;
  defaultRole?: string;
  onRoleChange?: (role: string) => void;
  /** People to add in one click. A picked one leaves the row */
  suggestions?: InviteToCollaborateSuggestion[];
  /** Who is in already, with invites sent */
  members?: InviteToCollaborateMember[];
  /** Called with the valid addresses and the role. Return a promise and the button spins until it settles; the chips clear after */
  onSend?: (emails: string[], role: string) => void | Promise<unknown>;
  /** Adds Copy link, which copies this */
  link?: string;
  copyLabel?: string;
  copiedLabel?: string;
  placeholder?: string;
  /** Which addresses are valid. Defaults to anything shaped like name@host.tld */
  validate?: (email: string) => boolean;
  /** Avatar colours for the chips, in turn */
  colors?: string[];
  className?: string;
}

const ROLES: InviteToCollaborateRole[] = [
  { label: 'Can edit', detail: 'Change frames, run the agent' }, { label: 'Can comment', detail: 'Leave notes, no edits' }, { label: 'Can view', detail: 'Read only' }
];
const COLORS = ['var(--dm-pl)', 'var(--dm-pm)', 'var(--dm-pt)', 'var(--dm-pp)', 'var(--dm-pk)'];
const isEmail = (e: string) => /^\S+@\S+\.\S+$/.test(e);
const initialsOf = (e: string) => e.split('@')[0].slice(0, 2).toUpperCase();

/** Add teammates by email as chips, set their role, and send the invites. */
export function InviteToCollaborate({ title = 'Invite to Pricing refresh', subtitle = 'They can see frames, the brief and agent runs', emails, defaultEmails = [], onEmailsChange, draft, defaultDraft = '', onDraftChange,
  roles = ROLES, role, defaultRole, onRoleChange, suggestions, members = [], onSend, link, copyLabel = 'Copy link', copiedLabel = 'Link copied',
  placeholder = 'name@studio.com', validate = isEmail, colors = COLORS, className }: InviteToCollaborateProps) {
  const [list, setList] = useControllable(emails, defaultEmails, onEmailsChange);
  const [text, setText] = useControllable(draft, defaultDraft, onDraftChange);
  const [cur, setCur] = useControllable(role, defaultRole ?? roles[0]?.label ?? '', onRoleChange);
  const menu = usePopover({ align: 'end' });
  const [copied, copy] = useCopied();
  const [busy, setBusy] = useState(false);
  const [used, setUsed] = useState<string[]>([]);

  const add = (parts: string[]) => { const next = [...list]; parts.forEach(p => { if (!next.includes(p)) next.push(p); }); setList(next); };
  const commit = (value = text) => {
    const parts = value.split(/[,\s]+/).map(s => s.trim()).filter(Boolean);
    if (!parts.length) return;
    add(parts); setText('');
  };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if ((e.key === 'Enter' || e.key === ',' || e.key === 'Tab') && text.trim()) { e.preventDefault(); commit(); }
    else if (e.key === 'Backspace' && !text && list.length) setList(list.slice(0, -1));
  };

  const valid = list.filter(validate);
  const send = async () => {
    setBusy(true);
    try { await onSend?.(valid, cur); } finally { setBusy(false); setList([]); }
  };

  // members invited after the first render come in one after another
  const keyOf = (m: InviteToCollaborateMember) => m.key ?? m.name;
  const [seen, setSeen] = useState(() => new Map(members.map(m => [keyOf(m), -1])));
  const fresh = members.filter(m => !seen.has(keyOf(m)));
  if (fresh.length) setSeen(new Map([...seen, ...fresh.map((m, i): [string, number] => [keyOf(m), i * 70])]));
  const delayOf = (m: InviteToCollaborateMember) => seen.get(keyOf(m)) ?? fresh.indexOf(m) * 70;

  return (
    <div data-dm="" className={cx('dm-ivx dm-panel', className)}>
      <div className="dm-ivx-h"><b>{title}</b><span className="dm-muted">{subtitle}</span></div>
      <div className="dm-ivx-f">
        <div className="dm-ivx-chips">
          {list.map((e, i) => {
            const ok = validate(e);
            const chip = (
              <span key={e} className={cx('dm-ivx-ch', !ok && 'dm-bad')}>
                {ok ? <Avatar initials={initialsOf(e)} color={colors[i % colors.length]} /> : <Icon name="alert" size="xs" />}{e}
                <button type="button" aria-label={`Remove ${e}`} onClick={() => setList(list.filter(x => x !== e))}><Icon name="x" size="xs" /></button>
              </span>
            );
            return ok ? chip : <Tip key={e} label="Not a valid email">{chip}</Tip>;
          })}
        </div>
        <input placeholder={placeholder} aria-label="Email addresses" spellCheck={false} value={text} onChange={e => setText(e.target.value)}
          onKeyDown={key} onBlur={() => commit()} onPaste={e => { const t = e.currentTarget; setTimeout(() => commit(t.value), 0); }} />
        <button type="button" {...menu.trigger} className="dm-ivx-role"><Swap>{cur}</Swap><Icon name="chev-d" size="xs" /></button>
      </div>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-ivx-rp')} role="menu" aria-label="Role">
        {roles.map(r => (
          <button type="button" key={r.label} className="dm-mi" role="menuitemradio" aria-checked={r.label === cur} onClick={() => { setCur(r.label); menu.closeSoon(); }}>
            <span>{r.label}{r.detail && <span className="dm-d">{r.detail}</span>}</span>
            <span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
      {!!suggestions?.length && (
        <div className="dm-ivx-sg">
          <span className="dm-muted">Suggested</span>
          {suggestions.filter(s => !used.includes(s.email)).map(s => (
            <button type="button" key={s.email} className="dm-chip dm-sm" onClick={() => { add([s.email]); setUsed([...used, s.email]); }}>
              <Avatar initials={s.initials} color={s.color} />{s.email.split('@')[0]}
            </button>
          ))}
        </div>
      )}
      <div className="dm-ivx-mem">
        {members.map(m => {
          const d = delayOf(m), e = d >= 0 ? enter(d) : null;
          return (
            <div key={keyOf(m)} className={cx('dm-ivx-m', e?.className)} style={e?.style}>
              <Avatar initials={m.initials} color={m.color} />
              <span className="dm-t">{m.name}{m.detail && <span>{m.detail}</span>}</span>
              <span className={cx('dm-r', m.pending && 'dm-pend')}>{m.role}</span>
            </div>
          );
        })}
      </div>
      <div className="dm-ivx-ft">
        {link ? (
          <Tip label="Copied to clipboard" open={copied || undefined} off={!copied}>
            <button type="button" className={cx('dm-pill dm-ghost dm-sm dm-ivx-link', copied && 'dm-copied')} onClick={() => copy(link)}>
              <Icon name={copied ? 'check' : 'link'} size="xs" />{copied ? copiedLabel : copyLabel}
            </button>
          </Tip>
        ) : <span />}
        <button type="button" className="dm-pill dm-ink dm-sm dm-ivx-go" disabled={!busy && (!valid.length || valid.length < list.length)} aria-busy={busy} onClick={() => { if (!busy) send(); }}>
          {busy ? <Spin /> : valid.length > 1 ? `Send ${valid.length} invites` : 'Send invite'}
        </button>
      </div>
    </div>
  );
}
```

## More in Collaboration

- [Comments](https://designme.dev/components/comments.md): A design thread where you can @mention the agent and it replies.
- [Notifications](https://designme.dev/components/notifications.md): An inbox where agent updates and mentions arrive live.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Profile menu](https://designme.dev/components/profile-menu.md): The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.
- [Filter menu](https://designme.dev/components/filter-menu.md): Add filters from a menu, see them as chips, and watch the count change.
- [Ticket list](https://designme.dev/components/ticket-list.md): Support tickets the agent has triaged, with suggested replies.
- [Kanban board](https://designme.dev/components/kanban-board.md): A board where you and the agent move cards, with drag and drop.

All components: https://designme.dev/llms.txt
