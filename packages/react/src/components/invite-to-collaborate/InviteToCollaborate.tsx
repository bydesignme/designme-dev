'use client';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useCopied } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Avatar, enter, Spin, Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
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
