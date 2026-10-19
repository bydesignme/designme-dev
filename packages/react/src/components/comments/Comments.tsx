'use client';
import { useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Avatar, enter, Think } from '../../lib/motion';
import '../../designme.css';
import './comments.css';

export interface CommentsPerson {
  name: string;
  /** Two letters for the avatar, like "MK" */
  initials: string;
  /** The avatar colour, like 'var(--dm-pl)' */
  color: string;
  /** What follows the @ to mention them, like "maya". People with a handle show up in the mention menu */
  handle?: string;
}

export interface CommentsAction {
  label: string;
  /** Draws it as the accent button. The others are quiet */
  primary?: boolean;
  onClick: () => void;
}

export interface CommentsEntry {
  /** Keeps the comment in place when the list changes */
  id: string;
  author: CommentsPerson;
  /** The comment. A string gets its @mentions highlighted; an agent's reply fades in word by word as it grows */
  text: ReactNode;
  /** Like "2h" or "now" */
  time: string;
  /** Marks the agent's replies: their words fade in as `text` grows */
  agent?: boolean;
  /** Shows the thinking mark instead of the text while the agent works on a reply */
  thinking?: boolean;
  /** Buttons under the comment, like "Apply to all" */
  actions?: CommentsAction[];
  /** Replaces the buttons once one is used, like "Applied to 3 frames" */
  resolution?: string;
}

export interface CommentsProps {
  /** What the thread is about, like "Pricing, frame 2" */
  title: string;
  /** The number on the pin, like 1 */
  pin?: ReactNode;
  comments: CommentsEntry[];
  /** Who can be @mentioned. Typing @ and the start of a handle opens a menu of them */
  people?: CommentsPerson[];
  /** The reply being written. Leave it out to let the field keep it */
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Called with the reply when it is sent. Add it to `comments` to show it */
  onSend?: (text: string) => void;
  placeholder?: string;
  /** Whether the thread is resolved, which fades it. Leave it out to let the Resolve button toggle it */
  resolved?: boolean;
  defaultResolved?: boolean;
  onResolvedChange?: (resolved: boolean) => void;
  className?: string;
}

/** Highlights @handles. With people given, only theirs; otherwise any @word */
function mentions(text: string, handles: string[] | null) {
  return text.split(/(@\w+)/).map((part, i) => {
    const hit = part.startsWith('@') && (!handles || handles.includes(part.slice(1).toLowerCase()));
    return hit ? <span key={i} className="dm-m">{part}</span> : part;
  });
}

function Comment({ c, handles }: { c: CommentsEntry; handles: string[] | null }) {
  const e = enter();
  let body: ReactNode = c.text;
  if (c.thinking) body = <Think />;
  else if (c.agent && typeof c.text === 'string') body = c.text.split(' ').map((w, i) => <span key={i} className="dm-w">{w} </span>);
  else if (typeof c.text === 'string') body = mentions(c.text, handles);
  return (
    <div className={cx('dm-cmx-c', c.agent && 'dm-ag', e.className)} style={e.style}>
      <Avatar initials={c.author.initials} color={c.author.color} />
      <div className="dm-b">
        <span className="dm-n"><b>{c.author.name}</b><span>{c.time}</span></span>
        <span className="dm-tx" style={c.thinking ? { color: 'var(--dm-accent)' } : undefined}>{body}</span>
        {(c.resolution || !!c.actions?.length) && (
          <div className={cx('dm-act', e.className)}>
            {c.resolution
              ? <span className="dm-cmx-rv dm-enter"><Icon name="ok" size="xs" />{c.resolution}</span>
              : c.actions!.map((a, i) => <button type="button" key={i} className={cx('dm-pill dm-sm', a.primary ? 'dm-accent' : 'dm-ghost')} onClick={a.onClick}>{a.label}</button>)}
          </div>
        )}
      </div>
    </div>
  );
}

/** A comment thread on a design, where you can @mention the agent and it replies. */
export function Comments({ title, pin = 1, comments, people, value, defaultValue = '', onValueChange, onSend, placeholder = 'Reply, or @agent to ask', resolved, defaultResolved = false, onResolvedChange, className }: CommentsProps) {
  const [draft, setDraft] = useControllable(value, defaultValue, onValueChange);
  const [done, setDone] = useControllable(resolved, defaultResolved, onResolvedChange);
  const handles = people ? people.flatMap(p => (p.handle ? [p.handle.toLowerCase()] : [])) : null;

  // typing @ and the start of a handle offers the people it could be; Escape puts the menu away until the text changes
  const [dismissed, setDismissed] = useState<string | null>(null);
  const typed = draft.match(/@(\w*)$/);
  const matches = typed ? (people ?? []).filter(p => p.handle?.toLowerCase().startsWith(typed[1].toLowerCase())) : [];
  const menuOpen = matches.length > 0 && dismissed !== draft;
  const pick = (p: CommentsPerson) => setDraft(draft.replace(/@\w*$/, '@' + p.handle + ' '));

  const send = () => { const v = draft.trim(); if (!v) return; setDraft(''); onSend?.(v); };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') { e.preventDefault(); if (menuOpen) pick(matches[0]); else send(); }
    if (e.key === 'Escape') setDismissed(draft);
  };

  return (
    <div data-dm="" className={cx('dm-cmx dm-panel', done && 'dm-done', className)}>
      <div className="dm-cmx-h">
        <span className="dm-cmx-pin" style={done ? { background: 'var(--dm-ok)' } : undefined}>{pin}</span>
        <b>{title}</b>
        <button type="button" className="dm-pill dm-ghost dm-sm dm-cmx-res" aria-pressed={done} onClick={() => setDone(!done)}>
          <Icon name={done ? 'undo' : 'check'} size="xs" />{done ? 'Reopen' : 'Resolve'}
        </button>
      </div>
      <div className="dm-cmx-th" aria-live="polite">{comments.map(c => <Comment key={c.id} c={c} handles={handles} />)}</div>
      <div className="dm-cmx-in">
        <div className="dm-cmx-box">
          <input placeholder={placeholder} aria-label="Reply" spellCheck={false} value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={key}
            role="combobox" aria-expanded={menuOpen} aria-autocomplete="list" />
          <button type="button" className="dm-cmx-go" aria-label="Send" disabled={!draft.trim()} onClick={send}><Icon name="up" size="xs" /></button>
        </div>
        <div className={cx('dm-pop dm-cmx-men', menuOpen && 'dm-open')} role="listbox" inert={!menuOpen}>
          {matches.map(p => (
            // mousedown, so the field keeps its focus
            <button type="button" key={p.handle} className="dm-mi" role="option" aria-selected={false} onMouseDown={e => { e.preventDefault(); pick(p); }}>
              <span className="dm-av" style={{ background: p.color, width: 20, height: 20, fontSize: 9 }} aria-hidden="true">{p.initials}</span>
              <span>{p.name}<span className="dm-d">@{p.handle}</span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
