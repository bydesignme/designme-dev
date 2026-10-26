'use client';
import { useRef, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Avatar, Fold, Spin, Swap } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './draft-review.css';

export interface DraftRecipient {
  name: string;
  initials?: string;
  /** The avatar's colour, like 'var(--dm-pl)' */
  color?: string;
}

export interface DraftAttachment {
  name: string;
  /** Shown beside the name, like "240 KB" */
  size?: string;
  /** Still uploading: a spinner in place of the size */
  loading?: boolean;
}

export interface SendOption {
  /** `now` sends straight away; any other key schedules it */
  key: string;
  /** Like "Tomorrow at 09:00" */
  label: string;
  /** The quiet line under it in the menu */
  detail?: string;
}

/** draft (being checked), sending, undo (sent, with a window to take it back), sent, scheduled or discarded */
export type DraftPhase = 'draft' | 'sending' | 'undo' | 'sent' | 'scheduled' | 'discarded';

export interface DraftReviewProps {
  title?: string;
  /** The line under the title, like "After the pricing review with Maya" */
  subtitle?: string;
  to: DraftRecipient[];
  subject: string;
  onSubjectChange?: (subject: string) => void;
  /** The message as the agent wrote it. Paragraphs are split by blank lines. It stays editable; read edits from onBodyChange */
  body: string;
  onBodyChange?: (body: string) => void;
  attachments?: DraftAttachment[];
  /** A problem to settle before it sends, like an attachment the message mentions but nothing attached */
  warning?: { text: ReactNode; actions: { label: string; onClick: () => void; primary?: boolean }[] };
  phase?: DraftPhase;
  /** When to send, picked from the menu beside the button */
  sendOptions?: SendOption[];
  sendOption?: string;
  defaultSendOption?: string;
  onSendOptionChange?: (key: string) => void;
  onSend?: (option: SendOption) => void;
  onDiscard?: () => void;
  /** Takes it back: undoes a send in its undo window, cancels a scheduled one, or brings back a discarded draft */
  onUndo?: () => void;
  /** Seconds left to undo, shown while the phase is undo */
  undoLeft?: number;
  labels?: { send?: string; schedule?: string; sending?: string; scheduling?: string; discard?: string; notSent?: string; sent?: string; scheduled?: string; delivered?: string; discarded?: string; nothingSent?: string; undo?: string; cancel?: string };
  className?: string;
}

const WHEN: SendOption[] = [
  { key: 'now', label: 'Send now' },
  { key: 'tomorrow', label: 'Tomorrow at 09:00', detail: 'The start of their day' },
  { key: 'monday', label: 'Monday at 09:00', detail: 'The start of next week' }
];

/** An email the agent drafted, laid out like the email it is, to check and edit before it goes: send now or later, or
    discard it. A warning can stop it before it sends, and after sending there is a short window to undo. */
export function DraftReview({
  title = 'Draft from the agent', subtitle, to, subject, onSubjectChange, body, onBodyChange, attachments = [], warning, phase = 'draft',
  sendOptions = WHEN, sendOption, defaultSendOption, onSendOptionChange, onSend, onDiscard, onUndo, undoLeft = 5, labels = {}, className
}: DraftReviewProps) {
  const [pick, setPick] = useControllable(sendOption, defaultSendOption ?? sendOptions[0].key, onSendOptionChange);
  const menu = usePopover({ align: 'end' });
  const chosen = sendOptions.find(o => o.key === pick) ?? sendOptions[0];
  const later = chosen.key !== 'now';
  const L = { send: 'Send', schedule: 'Schedule', sending: 'Sending', scheduling: 'Scheduling', discard: 'Discard', notSent: 'Not sent', sent: 'Sent', scheduled: 'Scheduled', delivered: 'Delivered just now', discarded: 'Draft discarded', nothingSent: 'Nothing was sent', undo: 'Undo', cancel: 'Cancel', ...labels };
  const names = to.map(p => p.name).join(', ');
  // the body is written once and left to the browser while it is edited, so the caret stays where it is
  const first = useRef(body);
  const busy = phase === 'sending', done = phase !== 'draft' && phase !== 'sending';
  const tag = phase === 'sent' ? ['dm-ok', L.sent] : phase === 'scheduled' ? ['dm-b', L.scheduled] : ['', L.notSent];
  const row = phase === 'undo' ? { icon: 'ok' as const, cls: '', t: `${L.sent} to ${names}`, sub: `You can undo for ${undoLeft}s`, btn: L.undo }
    : phase === 'sent' ? { icon: 'ok' as const, cls: '', t: `${L.sent} to ${names}`, sub: L.delivered }
    : phase === 'scheduled' ? { icon: 'clock' as const, cls: 'dm-later', t: `${L.scheduled} for ${chosen.label.replace(/^\w/, c => c.toLowerCase())}`, sub: `To ${names}`, btn: L.cancel }
    : phase === 'discarded' ? { icon: 'trash' as const, cls: 'dm-bin', t: L.discarded, sub: L.nothingSent, btn: L.undo } : null;

  return (
    <div data-dm="" className={className} style={{ width: '100%' }}>
      <div className={cx('dm-drf dm-panel', done && 'dm-sent')}>
        <div className="dm-drf-h">
          <span className="dm-drf-ag"><Icon name="spark" /></span>
          <div className="dm-drf-ht"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
          <span className={cx('dm-tag dm-drf-tag', tag[0])}><Swap>{tag[1]}</Swap></span>
        </div>
        <div className="dm-drf-fs" inert={done}>
          <div className="dm-drf-r"><span className="dm-drf-l">To</span>
            {to.map(p => <span key={p.name} className="dm-drf-p"><Avatar initials={p.initials ?? p.name.split(' ').map(w => w[0]).join('').slice(0, 2)} color={p.color ?? 'var(--dm-pl)'} />{p.name}</span>)}
          </div>
          <label className="dm-drf-r"><span className="dm-drf-l">Subject</span><input className="dm-drf-s" value={subject} onChange={e => onSubjectChange?.(e.target.value)} readOnly={!onSubjectChange} aria-label="Subject" /></label>
        </div>
        <div className="dm-drf-b" contentEditable={!done} suppressContentEditableWarning role="textbox" aria-multiline="true" aria-label="Message" spellCheck={false}
          style={{ whiteSpace: 'pre-wrap' }} inert={done} onInput={e => onBodyChange?.((e.target as HTMLElement).innerText)}>{first.current}</div>
        <div className="dm-drf-att" inert={done}>
          {attachments.map(a => (
            <span key={a.name} className="dm-drf-file dm-enter"><Icon name="file" size="xs" /><span>{a.name}</span>
              <span className="dm-muted dm-drf-fz">{a.loading ? <Spin /> : a.size}</span></span>
          ))}
        </div>
        <Fold open={!!warning && phase === 'draft'} className="dm-drf-wf">
          <div className="dm-drf-w">
            <p><Icon name="alert" size="xs" /><span>{warning?.text}</span></p>
            <div className="dm-drf-wa">
              {warning?.actions.map(a => <button key={a.label} type="button" className={cx('dm-pill dm-sm', a.primary ? 'dm-primary' : 'dm-ghost')} onClick={a.onClick}>{a.label}</button>)}
            </div>
          </div>
        </Fold>
        {row ? (
          <div className={cx('dm-drf-done dm-enter', row.cls)}>
            <Icon name={row.icon} size={row.icon === 'trash' ? 'xs' : undefined} />
            <span className="dm-t">{row.t}<span className="dm-muted dm-drf-sub">{row.sub}</span></span>
            {row.btn && <button type="button" className="dm-pill dm-sm" onClick={onUndo}>{row.btn}</button>}
          </div>
        ) : (
          <div className="dm-drf-f">
            <button type="button" className="dm-pill dm-ghost dm-sm dm-drf-x" disabled={busy} onClick={onDiscard}><Icon name="trash" size="xs" />{L.discard}</button>
            <span className="dm-sp" />
            <Swap className="dm-muted dm-drf-when">{later ? chosen.label : ''}</Swap>
            <div className="dm-drf-mg">
              <button type="button" className="dm-pill dm-primary dm-sm dm-drf-go" disabled={busy} onClick={() => onSend?.(chosen)}>
                {busy ? <><Spin />{later ? L.scheduling : L.sending}</> : <><Icon name={later ? 'clock' : 'send'} size="xs" />{later ? L.schedule : L.send}</>}
              </button>
              <button type="button" className="dm-pill dm-primary dm-sm dm-drf-dd" aria-label="When to send" disabled={busy} {...menu.trigger}><Icon name="chev-d" size="xs" /></button>
            </div>
            <div {...menu.pop} className={cx(menu.pop.className, 'dm-drf-pop')} role="menu" aria-label="When to send">
              {sendOptions.map(o => (
                <button type="button" key={o.key} className="dm-mi" role="menuitemradio" aria-checked={o.key === chosen.key} onClick={() => { setPick(o.key); menu.closeSoon(); }}>
                  <span>{o.label}{o.detail && <span className="dm-d">{o.detail}</span>}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
