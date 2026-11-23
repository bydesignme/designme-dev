'use client';
import { useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { Icon } from '../../lib/icons';
import { Avatar, Spin, Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './human-handoff.css';

export interface HandoffPerson {
  /** Used as the key, so keep it unique */
  name: string;
  initials?: string;
  /** The avatar's colour, like 'var(--dm-av-m)' */
  color?: string;
  /** Like "Billing" */
  team?: string;
  /** Whether they can take it now, like "Available", "In a call" or "Out until 2pm" */
  presence?: string;
  /** ok puts a green dot before the presence, warn turns it orange */
  tone?: 'ok' | 'warn';
}

export interface HandoffFact {
  label: string;
  value: string;
}

export interface HandoffStatus {
  /** wait is neutral with a spinner, warn orange with an alert, ok green */
  tone?: 'wait' | 'warn' | 'ok';
  title: string;
  detail?: string;
  /** Shown in place of the icon, like the person who just joined */
  person?: HandoffPerson;
}

export interface HumanHandoffProps {
  title?: string;
  /** Why the agent handed off, like "Refund over $500 needs a person" */
  reason: string;
  /** Who has it, or null while the agent is still finding someone */
  assignee: HandoffPerson | null;
  /** The two lines shown while assignee is null */
  finding?: { title: string; detail?: string };
  /** The people it can go to instead. Leave it out to hide Reassign */
  people?: HandoffPerson[];
  onReassign?: (person: HandoffPerson) => void;
  /** Seconds left until the reply is due. It shows whole minutes and turns orange under five; at 0 or less it reads overdue */
  secondsLeft: number;
  /** The whole window, for the bar and the line beside it ("15 min target") */
  targetSeconds?: number;
  /** What the person needs to pick it up */
  summary: string;
  /** A few key facts, as label and value rows */
  facts?: HandoffFact[];
  /** A link to the whole conversation */
  link?: { label: string; href?: string; onClick?: () => void; tip?: string };
  /** What the agent told the customer */
  message: string;
  /** The label over the message, like "Sent to Dana" */
  messageLabel?: string;
  /** Adds Edit: the message turns editable, and Save calls this with the new text */
  onMessageChange?: (text: string) => void;
  /** Adds "· edited" to the label */
  edited?: boolean;
  /** The row at the foot that says where it stands */
  status: HandoffStatus;
  labels?: { assignedTo?: string; context?: string; reassign?: string; reassignTo?: string; target?: string; edit?: string; save?: string; cancel?: string; edited?: string };
  className?: string;
}

const initialsOf = (p: HandoffPerson) => p.initials ?? p.name.split(' ').map(w => w[0]).join('').slice(0, 2);
const due = (s: number) => { const m = Math.floor(s / 60); return s <= 0 ? 'Reply overdue' : m < 1 ? 'Reply due in under a minute' : `Reply due in ${m} min`; };

/** The agent hands a conversation to a person: why, who has it (with Reassign), when the reply is due, the context they
    need to pick it up, and what the customer was told, with a row at the foot that says where it stands. */
export function HumanHandoff({
  title = 'Handed off to a person', reason, assignee, finding = { title: 'Finding someone' }, people, onReassign, secondsLeft, targetSeconds = 900,
  summary, facts = [], link, message, messageLabel = 'Sent to the customer', onMessageChange, edited, status, labels = {}, className
}: HumanHandoffProps) {
  const L = { assignedTo: 'Assigned to', context: 'Context passed along', reassign: 'Reassign', reassignTo: 'Reassign to', target: `${Math.round(targetSeconds / 60)} min target`,
    edit: 'Edit', save: 'Save', cancel: 'Cancel', edited: 'edited', ...labels };
  const menu = usePopover({ align: 'end', side: 'down' });
  const [editing, setEditing] = useState(false);
  // the message box is drawn afresh after each edit, so what React renders and what was typed never disagree
  const [rev, setRev] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const left = Math.max(0, secondsLeft);
  const tone = secondsLeft <= 0 ? 'dm-bad' : secondsLeft < 300 ? 'dm-warn' : '';

  const startEdit = () => {
    setEditing(true);
    requestAnimationFrame(() => { const b = box.current; if (!b) return; b.focus(); const s = getSelection(); s?.selectAllChildren(b); s?.collapseToEnd(); });
  };
  const save = () => { const t = box.current?.innerText.trim() ?? ''; if (t && t !== message) onMessageChange?.(t); setEditing(false); setRev(r => r + 1); };
  const cancel = () => { setEditing(false); setRev(r => r + 1); };
  const st = status.tone ?? 'wait';
  const link0 = link && (link.href
    ? <a className="dm-fchip dm-lnk dm-hox-lnk" href={link.href} onClick={link.onClick}><Icon name="link" size="xs" /><span>{link.label}</span></a>
    : <button type="button" className="dm-fchip dm-lnk dm-hox-lnk" onClick={link.onClick}><Icon name="link" size="xs" /><span>{link.label}</span></button>);

  return (
    <div data-dm="" className={className} style={{ width: '100%', containerType: 'inline-size' }}>
      <div className="dm-hox dm-panel">
        <div className="dm-hox-h">
          <span className="dm-hox-ic"><Icon name="user" /></span>
          <div className="dm-hox-ht"><b>{title}</b><span className="dm-muted">{reason}</span></div>
        </div>
        <div className="dm-hox-b">
          <div className="dm-hox-col">
            <span className="dm-hox-lb">{L.assignedTo}</span>
            <div className="dm-hox-who">
              <span className="dm-hox-av">{assignee ? <Avatar key={assignee.name} className="dm-enter" initials={initialsOf(assignee)} color={assignee.color ?? 'var(--dm-av-l)'} /> : <Spin />}</span>
              <span className="dm-hox-wt">
                <b><Swap>{assignee ? assignee.name : finding.title}</Swap></b>
                {assignee ? (
                  <span key={assignee.name + (assignee.presence ?? '')} className={cx('dm-hox-wd dm-enter', assignee.tone && 'dm-' + assignee.tone)}>
                    {assignee.presence && <span className="dm-dot" />}<span>{[assignee.team, assignee.presence].filter(Boolean).join(' · ')}</span>
                  </span>
                ) : <span className="dm-hox-wd"><span>{finding.detail}</span></span>}
              </span>
              {people && (
                <button type="button" className="dm-hox-rb" disabled={!assignee} {...menu.trigger}>{L.reassign}<Icon name="chev-d" size="xs" /></button>
              )}
            </div>
            <div className={cx('dm-hox-sla', tone)}>
              <div className="dm-hox-sl"><Icon name="clock" /><span className="dm-hox-due dm-num">{due(secondsLeft)}</span><span className="dm-muted">{L.target}</span></div>
              <div className="dm-hox-bar" role="progressbar" aria-label="Time left to reply" aria-valuemin={0} aria-valuemax={targetSeconds} aria-valuenow={left}>
                <i style={{ width: `${Math.min(100, (left / targetSeconds) * 100)}%` }} />
              </div>
            </div>
            <div className="dm-hox-ms">
              <div className="dm-hox-mh">
                <span className="dm-hox-lb">{edited ? `${messageLabel} · ${L.edited}` : messageLabel}</span><span className="dm-sp" />
                {onMessageChange && editing && <button type="button" className="dm-pill dm-ghost dm-sm" onClick={cancel}>{L.cancel}</button>}
                {onMessageChange && (editing
                  ? <button type="button" className="dm-pill dm-primary dm-sm" onClick={save}>{L.save}</button>
                  : <button type="button" className="dm-pill dm-ghost dm-sm" onClick={startEdit}><Icon name="edit" size="xs" />{L.edit}</button>)}
              </div>
              <div key={rev} ref={box} className="dm-hox-mb" contentEditable={editing} suppressContentEditableWarning role="textbox" aria-multiline="true" aria-readonly={!editing}
                aria-label={messageLabel} spellCheck={false}>{message}</div>
            </div>
          </div>
          <div className="dm-hox-col">
            <span className="dm-hox-lb">{L.context}</span>
            <p className="dm-hox-sum">{summary}</p>
            {facts.length > 0 && (
              <div className="dm-hox-facts">
                {facts.map(f => <div key={f.label} className="dm-hox-f"><span className="dm-k">{f.label}</span><span className="dm-v dm-num">{f.value}</span></div>)}
              </div>
            )}
            {link0 && (link?.tip ? <Tip label={link.tip}>{link0}</Tip> : link0)}
          </div>
        </div>
        <div className={cx('dm-hox-st', st !== 'wait' && 'dm-' + st)} aria-live="polite">
          <span className="dm-g">{status.person ? <Avatar initials={initialsOf(status.person)} color={status.person.color ?? 'var(--dm-av-l)'} /> : st === 'wait' ? <Spin /> : <Icon name={st === 'warn' ? 'alert' : 'ok'} />}</span>
          <span className="dm-t"><b><Swap>{status.title}</Swap></b>{status.detail && <span><Swap>{status.detail}</Swap></span>}</span>
        </div>
        {people && (
          <div {...menu.pop} className={cx(menu.pop.className, 'dm-hox-pop')} role="menu" aria-label={L.reassignTo}>
            <div className="dm-ph">{L.reassignTo}</div>
            {people.map(p => (
              <button type="button" key={p.name} className="dm-mi" role="menuitemradio" aria-checked={p.name === assignee?.name}
                onClick={() => { if (p.name !== assignee?.name) onReassign?.(p); menu.closeSoon(); }}>
                <Avatar initials={initialsOf(p)} color={p.color ?? 'var(--dm-av-l)'} />
                <span>{p.name}<span className="dm-d">{[p.team, p.presence].filter(Boolean).join(' · ')}</span></span>
                <span className="dm-ck"><Icon name="check" size="xs" /></span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
