'use client';
import { useRef, useState, type CSSProperties, type FormEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, SourceChip, Tip, type Source } from '../../lib/motion';
import '../../designme.css';
import './thread-panel.css';

export interface ThreadMessage {
  /** Keeps the message in place when the list changes. Defaults to its position */
  id?: string;
  from: 'user' | 'agent';
  text: ReactNode;
  /** Files or pages the agent used, shown as chips above its reply */
  sources?: Source[];
  /** Shows a shimmering "Thinking" (or `text`, if given) while the agent works on a reply */
  thinking?: boolean;
}

export interface Thread {
  id: string;
  title: string;
  /** The dot in front of the title, any CSS colour, like 'var(--dm-ok)'. Defaults to a quiet grey */
  color?: string;
  messages: ThreadMessage[];
}

export interface ThreadPanelProps {
  threads: Thread[];
  /** The id of the open thread. Leave it out to let the tabs switch it */
  value?: string;
  defaultValue?: string;
  onValueChange?: (id: string) => void;
  /** Called with the reply and the open thread's id. Add the message to that thread to show it */
  onSend?: (text: string, threadId: string) => void;
  /** The reply being written. Leave it out to let the field keep its own */
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (text: string) => void;
  placeholder?: string;
  /** Sits flat in a chat column (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

function Message({ m, delay }: { m: ThreadMessage; delay: number }) {
  const e = enter(delay);
  if (m.from === 'user') return <div className={cx('dm-bub', e.className)} style={e.style}>{m.text}</div>;
  if (m.thinking) return <div className={cx('dm-thp-ag', e.className)} style={e.style}><span className="dm-shim">{m.text || 'Thinking'}</span></div>;
  return (
    <div className={cx('dm-thp-ag', e.className)} style={e.style}>
      {!!m.sources?.length && (
        <div className="dm-src">
          {m.sources.map((s, i) => s.kind ? <SourceChip key={i} source={s} /> : (
            <Tip key={i} label={s.tip ?? s.label}>
              <button type="button" className="dm-fchip dm-lnk" onClick={s.onClick}><Icon name="file-text" size="xs" />{s.label}</button>
            </Tip>
          ))}
        </div>
      )}
      {m.text}
    </div>
  );
}

/** One thread's messages. It mounts again for each thread, so a switch staggers every message in, and later ones come in on their own */
function Body({ messages }: { messages: ThreadMessage[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [first] = useState(messages.length);
  // the first messages are simply there; a later one glides into view
  useIsoLayoutEffect(() => { const el = ref.current; if (!el) return; if (messages.length > first) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' }); else el.scrollTop = el.scrollHeight; }, [messages.length]);
  return (
    <div ref={ref} className="dm-thp-body" aria-live="polite">
      {messages.map((m, i) => <Message key={(m.id ?? i) + (m.thinking ? '-t' : '')} m={m} delay={i < first ? i * 70 : 0} />)}
    </div>
  );
}

/** Several conversations with an agent, one tab each, with a reply field under the open one. */
export function ThreadPanel({ threads, value, defaultValue, onValueChange, onSend, draft: draftProp, defaultDraft = '', onDraftChange, placeholder = 'Reply to the agent', bare = true, className }: ThreadPanelProps) {
  const [cur, setCur] = useControllable(value, defaultValue ?? threads[0]?.id ?? '', onValueChange);
  const thread = threads.find(t => t.id === cur) ?? threads[0];
  const [draft, setDraft] = useControllable(draftProp, defaultDraft, onDraftChange);

  // the underline slides to the open tab, 10px in from each side
  const tabs = useRef<HTMLDivElement>(null);
  const [ink, setInk] = useState<CSSProperties>({});
  useIsoLayoutEffect(() => {
    const el = tabs.current; if (!el) return;
    const place = () => { const b = el.querySelector<HTMLElement>('[aria-selected="true"]'); if (b) setInk({ left: b.offsetLeft + 10, width: b.offsetWidth - 20 }); };
    place();
    document.fonts?.ready.then(place);
    const ro = new ResizeObserver(place); ro.observe(el);
    return () => ro.disconnect();
  }, [thread?.id, threads.length]);

  const send = (e: FormEvent) => {
    e.preventDefault();
    const v = draft.trim(); if (!v || !thread) return;
    setDraft(''); onSend?.(v, thread.id);
  };

  return (
    <div data-dm="" className={cx('dm-thp', !bare && 'dm-panel', className)}>
      <div ref={tabs} className="dm-thp-tabs" role="tablist">
        {threads.map(t => (
          <button type="button" key={t.id} className="dm-thp-tab" role="tab" aria-selected={t.id === thread?.id} onClick={() => setCur(t.id)}>
            <span className="dm-dot" style={{ color: t.color ?? 'var(--dm-faint)' }} />{t.title}
          </button>
        ))}
        <span className="dm-thp-ink" style={ink} />
      </div>
      {thread && <Body key={thread.id} messages={thread.messages} />}
      <form className="dm-thp-in" onSubmit={send}>
        <input className="dm-thp-field" aria-label="Reply" placeholder={placeholder} value={draft} onChange={e => setDraft(e.target.value)} />
        <Tip label="Send" kbd="↵">
          <button type="submit" className="dm-thp-send" aria-label="Send" disabled={!draft.trim()}><Icon name="up" /></button>
        </Tip>
      </form>
    </div>
  );
}
