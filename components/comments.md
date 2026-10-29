# Comments

> A design thread where you can @mention the agent and it replies.

App basics / Collaboration. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/comments

## Install

```sh
npx designme add comments          # HTML, CSS and JS, with the shared core
npx designme add comments --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Comments is a thread pinned to one spot in a design, where people reply to each other and can bring the agent in by typing @agent. Each comment is an avatar, a name, a time and the text; the first one starts the thread and the replies sit indented under it on a thin line. A quiet Agree button shows beside the time on hover or keyboard focus. The agent's reply shows a thinking mark first, then its words fade in, and it can end with buttons such as Apply to all that turn into a short note once used. The whole thread can be resolved, which fades it back.

### When to use it

- When feedback lives on a design or document and the agent should act on it from the thread
- When people need to @mention teammates and the agent from the same reply field
- When an agent's suggestion needs a yes or a choice before it changes anything
- When resolved threads should stay visible but step back

### What it does

- The first of `comments` starts the thread, and every later one is a reply, indented under it on a thin line. The header counts the replies.
- Typing @ and the start of a handle opens a menu of matching `people`, and Enter or a click inserts the handle.
- @mentions in plain text comments are highlighted in the accent's tint, limited to known handles when `people` is given.
- Each comment's Agree button shows on hover or keyboard focus, and always on a touch screen. It toggles yours in `agreed`, and a chip under the text counts everyone who agreed (`agrees` on the comment, plus you); the chip toggles yours too.
- A comment with `thinking` shows the thinking dots; an `agent` comment's words fade in as its `text` grows.
- `actions` add buttons under a comment, and setting `resolution` replaces them with a confirmation line like "Applied to 3 frames".
- Enter or the Send button calls `onSend` with the trimmed reply and clears the field; Send is disabled while the field is empty.
- The reply field has a dimmed edge at rest and a step stronger one while it has the focus, with no ring.
- The Resolve button in the header toggles `resolved`, fades the thread, turns the pin green and marks the thread Resolved.

### Accessibility

- The thread is an `aria-live="polite"` region, so new comments and replies are announced, and the replies are a group labelled Replies.
- The reply field is a `combobox` with `aria-expanded` reflecting the mention menu, which is a `listbox` of `option` rows.
- In the mention menu ↑ and ↓ move the highlight and wrap, which `aria-activedescendant` points to, and Enter picks the highlighted person.
- Escape dismisses the mention menu until the text changes.
- Agree and its chip are toggle buttons with `aria-pressed`; the chip's label says how many agreed. The Agree button stays in the tab order and shows as soon as it has the focus.
- Resolve thread reports its state with `aria-pressed`, and the icon-only Send button has an `aria-label`.

## Usage in React

```tsx
import { Comments } from '@/components/designme/comments/Comments';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useCallback, useRef, useState } from 'react';
import { Comments, type CommentsEntry, type CommentsPerson } from './Comments';
import { useStory, useWait } from '../lib/useScript';

/* ---------- Comments: Maya asks the agent in the thread; it thinks, writes its answer, then offers to apply it ---------- */
const AGENT: CommentsPerson = { name: 'Design agent', initials: 'DA', color: 'var(--dm-pb)', handle: 'agent' };
const MAYA: CommentsPerson = { name: 'Maya Kim', initials: 'MK', color: 'var(--dm-pl)', handle: 'maya' };
const JON: CommentsPerson = { name: 'Jon Ortiz', initials: 'JO', color: 'var(--dm-pm)', handle: 'jon' };
const START: CommentsEntry[] = [
  { id: 'c1', author: MAYA, text: 'The secondary button feels too faint next to the CTA.', time: '2h', agrees: 1 },
  { id: 'c2', author: JON, text: 'Agree. Can we keep it outlined though?', time: '1h' }
];
const ASK = '@agent can you keep it outlined but darker?';

export default function CommentsDemo() {
  const [comments, setComments] = useState(START);
  const [draft, setDraft] = useState('');
  const wait = useWait();
  const next = useRef(3);

  const reply = useCallback(async (q: string) => {
    const id = 'c' + next.current++;
    const set = (patch: Partial<CommentsEntry>) => setComments(cs => cs.map(c => (c.id === id ? { ...c, ...patch } : c)));
    setComments(cs => [...cs, { id, author: AGENT, text: '', time: 'now', agent: true, thinking: true }]);
    await wait(900);
    set({ thinking: false });
    const answer = /outline|border/i.test(q + ' outlined')
      ? 'Kept it outlined and raised the text to #5B6472, which passes AA at 5.9 : 1. Want me to apply it to the other 2 frames?'
      : 'On it. I will post the change here when it is ready.';
    let text = '';
    for (const w of answer.split(' ')) { text += (text ? ' ' : '') + w; set({ text }); await wait(40); }
    set({ actions: [
      { label: 'Apply to all', primary: true, onClick: () => set({ resolution: 'Applied to 3 frames' }) },
      { label: 'Just this one', onClick: () => set({ resolution: 'Applied to frame 2' }) }
    ] });
  }, [wait]);

  const send = useCallback((text: string) => {
    setComments(cs => [...cs, { id: 'c' + next.current++, author: MAYA, text, time: 'now' }]);
    if (/@agent/i.test(text)) reply(text);
  }, [reply]);

  // Maya types the question a letter at a time, then sends it. Clicking, focusing or typing in it takes over, and what she
  // had typed goes
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, taken }) => {
    await wait(1000);
    taken(() => setDraft(''));
    for (let i = 1; i <= ASK.length; i++) { setDraft(ASK.slice(0, i)); await wait(28); }
    await wait(300);
    setDraft(''); send(ASK);
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <Comments title="Pricing, frame 2" comments={comments} people={[AGENT, MAYA, JON]} value={draft} onValueChange={setDraft} onSend={send} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | What the thread is about, like "Pricing, frame 2" |
| `pin` (optional) | `ReactNode` | The number on the pin, like 1 |
| `comments` | `CommentsEntry[]` | The thread: the first comment starts it, and every later one is a reply, indented under it |
| `people` (optional) | `CommentsPerson[]` | Who can be @mentioned. Typing @ and the start of a handle opens a menu of them |
| `value` (optional) | `string` | The reply being written. Leave it out to let the field keep it |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(value: string) => void` |  |
| `onSend` (optional) | `(text: string) => void` | Called with the reply when it is sent. Add it to `comments` to show it |
| `placeholder` (optional) | `string` |  |
| `resolved` (optional) | `boolean` | Whether the thread is resolved, which fades it. Leave it out to let the Resolve button toggle it |
| `defaultResolved` (optional) | `boolean` |  |
| `onResolvedChange` (optional) | `(resolved: boolean) => void` |  |
| `agreed` (optional) | `string[]` | The ids of the comments you agreed with. Leave it out to let the Agree buttons keep it |
| `defaultAgreed` (optional) | `string[]` |  |
| `onAgreedChange` (optional) | `(ids: string[]) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I stream the agent's reply into the thread?**

Add a comment with `agent: true` and `thinking: true`, then set `thinking` to false and keep updating its `text` as tokens arrive. Each word fades in as it is added.

**Does the component call my agent when someone types @agent?**

No. `onSend` gives you the reply text, and you decide what happens. The example checks for @agent, adds the person's comment, then adds the agent's reply.

**How do I let the person approve the agent's change?**

Give the agent's comment `actions`, such as Apply to all and Just this one. In each `onClick`, apply the change and set `resolution` to a short line that replaces the buttons.

**How do I save who agreed with a comment?**

Pass `agreed` with the ids of the comments the current person agreed with, and update it in `onAgreedChange`. Put everyone else's count in each comment's `agrees`.

## Source

`Comments.tsx`, as `npx designme add comments --react` installs it:

```tsx
'use client';
import { useId, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Avatar, enter, Think, Tip } from '../lib/motion';
import '../designme.css';
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
              <span className="dm-av" style={{ background: p.color, width: 20, height: 20, fontSize: 9 }} aria-hidden="true">{p.initials}</span>
              <span>{p.name}<span className="dm-d">@{p.handle}</span></span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
```

## More in Collaboration

- [Notifications](https://designme.dev/components/notifications.md): An inbox where agent updates and mentions arrive live.
- [Banner](https://designme.dev/components/banner.md): An announcement on a tint of its tone, with its own line drawing.
- [Invite to collaborate](https://designme.dev/components/invite-to-collaborate.md): Add teammates by email as chips, set their role, send.
- [Reactions](https://designme.dev/components/reactions.md): Quick reactions on an agent update, with counts that pop.
- [Profile menu](https://designme.dev/components/profile-menu.md): The account menu behind an avatar: switch workspace, theme, shortcuts and sign out.
- [Context switcher](https://designme.dev/components/context-switcher.md): The organisation, project and environment you are in, each part a searchable switcher.
- [Filter menu](https://designme.dev/components/filter-menu.md): Add filters from a menu, see them as chips, and watch the count change.
- [Ticket list](https://designme.dev/components/ticket-list.md): Support tickets the agent has triaged, with suggested replies.
- [Kanban board](https://designme.dev/components/kanban-board.md): A board where you and the agent move cards, with drag and drop.

All components: https://designme.dev/llms.txt
