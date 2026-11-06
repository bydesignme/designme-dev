'use client';
import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Avatar, avatarInk, enter, Think, Tip } from '../../lib/motion';
import '../../designme.css';
import './comments.css';

export interface CommentsPerson {
  name: string;
  /** Two letters for the avatar, like "MK" */
  initials: string;
  /** The avatar colour, like 'var(--dm-av-l)' */
  color: string;
  /** What follows the @ to mention them, like "maya". People with a handle show up in the mention menu */
  handle?: string;
}

export interface CommentsAction {
  label: string;
  /** Draws it as the accent button. The others are white with an outline */
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
  /** How many other people agreed with it. Yours is added on top when you agree */
  agrees?: number;
}

export interface CommentsProps {
  /** What the thread is about, like "Pricing, frame 2" */
  title: string;
  /** The number on the pin, like 1 */
  pin?: ReactNode;
  /** The thread: the first comment starts it, and every later one is a reply, indented under it */
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
  /** The ids of the comments you agreed with. Leave it out to let the Agree buttons keep it */
  agreed?: string[];
  defaultAgreed?: string[];
  onAgreedChange?: (ids: string[]) => void;
  className?: string;
}

/** Highlights @handles. With people given, only theirs; otherwise any @word */
function mentions(text: string, handles: string[] | null) {
  return text.split(/(@\w+)/).map((part, i) => {
    const hit = part.startsWith('@') && (!handles || handles.includes(part.slice(1).toLowerCase()));
    return hit ? <span key={i} className="dm-m">{part}</span> : part;
  });
}

function Comment({ c, handles, mine, onAgree }: { c: CommentsEntry; handles: string[] | null; mine: boolean; onAgree: () => void }) {
  const e = enter();
  let body: ReactNode = c.text;
  if (c.thinking) body = <Think />;
  else if (c.agent && typeof c.text === 'string') body = c.text.split(' ').map((w, i) => <span key={i} className="dm-w">{w} </span>);
  else if (typeof c.text === 'string') body = mentions(c.text, handles);
  const n = (c.agrees ?? 0) + (mine ? 1 : 0);
  return (
    <div className={cx('dm-cmx-c', c.agent && 'dm-ag', e.className)} style={e.style}>
      <Avatar initials={c.author.initials} color={c.author.color} />
      <div className="dm-b">
        <div className="dm-n">
          <b>{c.author.name}</b><span className="dm-t">{c.time}</span>
          {/* the quiet Agree button shows on hover or keyboard focus, and always on a touch screen */}
          <div className="dm-cmx-tools">
            <Tip label="Agree"><button type="button" className="dm-ib dm-cmx-rx" aria-label="Agree" aria-pressed={mine} onClick={onAgree}><Icon name="up-thumb" size="xs" /></button></Tip>
          </div>
        </div>
        <div className="dm-tx" style={c.thinking ? { color: 'var(--dm-accent-mark, var(--dm-accent))' } : undefined}>{body}</div>
        {n > 0 && (
          <div className="dm-cmx-rs">
            <button type="button" className="dm-cmx-rc" aria-pressed={mine} aria-label={'Agree, ' + n + (n === 1 ? ' person' : ' people') + (mine ? ', including you' : '')} onClick={onAgree}>
              <Icon name="up-thumb" size="xs" /><span className="dm-num">{n}</span>
            </button>
          </div>
        )}
        {(c.resolution || !!c.actions?.length) && (
          <div className={cx('dm-act', e.className)}>
            {c.resolution
              ? <span className="dm-cmx-rv dm-enter"><Icon name="ok" size="xs" />{c.resolution}</span>
              : c.actions!.map((a, i) => <button type="button" key={i} className={cx('dm-pill dm-sm', a.primary ? 'dm-primary' : 'dm-line')} onClick={a.onClick}>{a.label}</button>)}
          </div>
        )}
      </div>
    </div>
  );
}

/** A comment thread on a design, where you can @mention the agent and it replies. */
export function Comments({ title, pin = 1, comments, people, value, defaultValue = '', onValueChange, onSend, placeholder = 'Reply, or @agent to ask', resolved, defaultResolved = false, onResolvedChange, agreed, defaultAgreed = [], onAgreedChange, className }: CommentsProps) {
  const [draft, setDraft] = useControllable(value, defaultValue, onValueChange);
  const [done, setDone] = useControllable(resolved, defaultResolved, onResolvedChange);
  const [yes, setYes] = useControllable(agreed, defaultAgreed, onAgreedChange);
  const handles = people ? people.flatMap(p => (p.handle ? [p.handle.toLowerCase()] : [])) : null;
  const agree = (id: string) => setYes(yes.includes(id) ? yes.filter(x => x !== id) : [...yes, id]);

  // typing @ and the start of a handle offers the people it could be; Escape puts the menu away until the text changes
  const [dismissed, setDismissed] = useState<string | null>(null);
  const typed = draft.match(/@(\w*)$/);
  const matches = typed ? (people ?? []).filter(p => p.handle?.toLowerCase().startsWith(typed[1].toLowerCase())) : [];
  const menuOpen = matches.length > 0 && dismissed !== draft;
  const pick = (p: CommentsPerson) => setDraft(draft.replace(/@\w*$/, '@' + p.handle + ' '));
  // the highlighted person: the up and down arrows move it and wrap, and it starts on the first whenever the list changes
  const [hl, setHl] = useState({ at: 0, for: '' });
  const at = hl.for === draft ? Math.min(hl.at, matches.length - 1) : 0;
  const id = useId();

  const send = () => { const v = draft.trim(); if (!v) return; setDraft(''); onSend?.(v); };
  const key = (e: KeyboardEvent<HTMLInputElement>) => {
    if (menuOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) { e.preventDefault(); setHl({ at: (at + (e.key === 'ArrowDown' ? 1 : -1) + matches.length) % matches.length, for: draft }); return; }
    if (e.key === 'Enter') { e.preventDefault(); if (menuOpen) pick(matches[at]); else send(); }
    if (e.key === 'Escape') setDismissed(draft);
  };

  const [head, ...replies] = comments;
  const one = (c: CommentsEntry) => <Comment key={c.id} c={c} handles={handles} mine={yes.includes(c.id)} onAgree={() => agree(c.id)} />;
  const status = done ? 'Resolved' : replies.length ? replies.length + (replies.length === 1 ? ' reply' : ' replies') : '';

  return (
    <div data-dm="" className={cx('dm-cmx dm-panel', done && 'dm-done', className)}>
      <div className="dm-cmx-h">
        <span className="dm-cmx-pin" aria-hidden="true">{pin}</span>
        <b>{title}</b>
        <span className="dm-cmx-st dm-num">{status}</span>
        <Tip label={done ? 'Reopen thread' : 'Resolve thread'}>
          <button type="button" className="dm-ib dm-cmx-res" aria-label="Resolve thread" aria-pressed={done} onClick={() => setDone(!done)}>
            <Icon name={done ? 'undo' : 'check'} size="xs" />
          </button>
        </Tip>
      </div>
      <div className="dm-cmx-th" aria-live="polite">
        {head && one(head)}
        {replies.length > 0 && <div className="dm-cmx-rp" role="group" aria-label="Replies">{replies.map(one)}</div>}
      </div>
      <div className="dm-cmx-in">
        <div className="dm-cmx-box">
          <input placeholder={placeholder} aria-label="Reply" spellCheck={false} autoComplete="off" value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={key}
            role="combobox" aria-expanded={menuOpen} aria-autocomplete="list" aria-controls={`${id}-men`} aria-activedescendant={menuOpen ? `${id}-${at}` : undefined} />
          <button type="button" className="dm-cmx-go" aria-label="Send" disabled={!draft.trim()} onClick={send}><Icon name="up" size="xs" /></button>
        </div>
        <div className={cx('dm-pop dm-cmx-men', menuOpen && 'dm-open')} role="listbox" id={`${id}-men`} aria-label="Mention" inert={!menuOpen}>
          {matches.map((p, i) => (
            // mousedown, so the field keeps its focus
            <button type="button" key={p.handle} id={`${id}-${i}`} tabIndex={-1} className={cx('dm-mi', i === at && 'dm-hl')} role="option" aria-selected={i === at}
              onMouseEnter={() => setHl({ at: i, for: draft })} onMouseDown={e => { e.preventDefault(); pick(p); }}>
              <span className="dm-av" style={{ background: p.color, color: avatarInk(p.color), width: 20, height: 20, fontSize: 9 }} aria-hidden="true">{p.initials}</span>
              <span>{p.name}<span className="dm-d">@{p.handle}</span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
