'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap, Tip, enter } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import { ActionLog, type ActionLogProps } from '../action-log/ActionLog';
import { AgentLanes, type AgentLanesProps } from '../agent-lanes/AgentLanes';
import { ArtifactCard, type ArtifactCardProps } from '../artifact-card/ArtifactCard';
import { ChangeReview, type ChangeReviewProps } from '../change-review/ChangeReview';
import { Composer, type ComposerAttachment, type ComposerProps } from '../composer/Composer';
import { DecisionPrompt, type DecisionPromptProps } from '../decision-prompt/DecisionPrompt';
import { ErrorRecovery, type ErrorRecoveryProps } from '../error-recovery/ErrorRecovery';
import { LiveAnswer, type LiveAnswerProps } from '../live-answer/LiveAnswer';
import { PermissionGate, type PermissionGateProps } from '../permission-gate/PermissionGate';
import { PlanReview, type PlanReviewProps } from '../plan-review/PlanReview';
import type { Starter, StarterTone } from '../prompt-starters/PromptStarters';
import { RunSummary, type RunSummaryProps } from '../run-summary/RunSummary';
import { SourceStack, type SourceStackProps } from '../source-stack/SourceStack';
import { StatusPill, type StatusPillProps } from '../status-pill/StatusPill';
import { Thinking, type ThinkingProps } from '../thinking/Thinking';
import { ToolCall, type ToolCallProps } from '../tool-call/ToolCall';
import '../../designme.css';
import '../prompt-starters/prompt-starters.css';
import '../context-meter/context-meter.css';
import './agent-harness.css';

/** One message in a conversation: what the person asked, what the agent said, or one of the components it works through */
export type AgentHarnessBlock = { key: string } & (
  /** The person's message, as a bubble */
  | { kind: 'user'; text: string; files?: string[] }
  /** The agent's words. Pass the text so far and each new word fades in as it arrives */
  | { kind: 'say'; text: string }
  | { kind: 'thinking'; props: ThinkingProps }
  | { kind: 'tool-call'; props: ToolCallProps }
  | { kind: 'permission-gate'; props: PermissionGateProps }
  | { kind: 'plan-review'; props: PlanReviewProps }
  | { kind: 'action-log'; props: ActionLogProps }
  | { kind: 'run-summary'; props: RunSummaryProps }
  | { kind: 'live-answer'; props: LiveAnswerProps }
  | { kind: 'source-stack'; props: SourceStackProps }
  | { kind: 'artifact-card'; props: ArtifactCardProps }
  | { kind: 'error-recovery'; props: ErrorRecoveryProps }
  | { kind: 'decision-prompt'; props: DecisionPromptProps }
  | { kind: 'agent-lanes'; props: AgentLanesProps }
  | { kind: 'change-review'; props: ChangeReviewProps }
  /** Anything else, as it is */
  | { kind: 'node'; node: ReactNode }
);

/** running shows a spinner in the list, waiting an amber dot (the agent needs the person), done nothing */
export type AgentHarnessState = 'idle' | 'running' | 'waiting' | 'done';

/** What the status pill in the header says while the conversation is on screen */
export interface AgentHarnessStatus extends Pick<StatusPillProps, 'state' | 'label' | 'meta' | 'action'> {
  /** The key of a block the agent is waiting on. Adds a Review button that scrolls to it */
  review?: string;
}

export interface AgentHarnessConversation {
  id: string;
  title: string;
  /** How long ago, like "now", "12m" or "1d" */
  time?: string;
  state?: AgentHarnessState;
  /** A quiet dot for a conversation that changed since it was last open. Clear it when it is opened */
  unread?: boolean;
  status?: AgentHarnessStatus;
  /** How full its context is, 0 to 100, drawn as the ring in the composer */
  context?: number;
  blocks: AgentHarnessBlock[];
}

export interface AgentHarnessProps {
  conversations: AgentHarnessConversation[];
  /** The id of the conversation on screen, or null for New chat. Leave it out to let the list pick it */
  value?: string | null;
  /** Defaults to the first conversation */
  defaultValue?: string | null;
  onValueChange?: (id: string | null) => void;
  /** The Prompt starters New chat shows */
  starters?: Starter[];
  /** Called when a starter is picked. Without it, the starter's prompt is written into the composer */
  onStarter?: (starter: Starter) => void;
  /** Called with what the person sends, and the id of the conversation it goes to (null from New chat) */
  onSend?: (message: { text: string; attachments: ComposerAttachment[] }, conversation: string | null) => void;
  /** The heading over the starters. Defaults to "What should the agent do?" */
  heading?: string;
  /** Shown beside the context ring, like the model's name */
  model?: string;
  /** The text in the composer. Leave it out to let the composer keep it */
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (draft: string) => void;
  /** Anything else for the composer: projects, environments, attachments, effort, dictation */
  composer?: Omit<ComposerProps, 'value' | 'defaultValue' | 'onValueChange' | 'onSubmit' | 'thread' | 'tools' | 'className'>;
  className?: string;
}

const TONE: Record<StarterTone, string> = { blue: 'pb', purple: 'pl', green: 'pm', orange: 'pp', red: 'pr', yellow: 'py', pink: 'pk', teal: 'pt' };
// an artifact and a diff keep their card in the chat; every other component sits on the chat itself
const BOXED = new Set(['artifact-card', 'change-review']);
const IDLE: AgentHarnessStatus = { state: 'idle', label: 'Ready for a task' };

function Message({ b }: { b: AgentHarnessBlock }) {
  switch (b.kind) {
    case 'thinking': return <Thinking {...b.props} />;
    case 'tool-call': return <ToolCall {...b.props} />;
    case 'permission-gate': return <PermissionGate {...b.props} />;
    case 'plan-review': return <PlanReview {...b.props} />;
    case 'action-log': return <ActionLog {...b.props} />;
    case 'run-summary': return <RunSummary {...b.props} />;
    case 'live-answer': return <LiveAnswer {...b.props} />;
    case 'source-stack': return <SourceStack {...b.props} />;
    case 'artifact-card': return <ArtifactCard {...b.props} />;
    case 'error-recovery': return <ErrorRecovery {...b.props} />;
    case 'decision-prompt': return <DecisionPrompt {...b.props} />;
    case 'agent-lanes': return <AgentLanes {...b.props} />;
    case 'change-review': return <ChangeReview {...b.props} />;
    case 'node': return <>{b.node}</>;
    default: return null;
  }
}

function Block({ b }: { b: AgentHarnessBlock }) {
  if (b.kind === 'user') return (
    <div className="dm-bub dm-enter" data-block={b.key}>
      {b.files?.length ? <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: b.text ? 6 : 0 }}>{b.files.map(f => <span key={f} className="dm-fchip"><Icon name="clip" size="xs" />{f}</span>)}</div> : null}
      {b.text}
    </div>
  );
  if (b.kind === 'say') return <p className="dm-msg dm-ahx-say" data-block={b.key}>{b.text.split(' ').map((w, i) => <span key={i} className="dm-w">{w} </span>)}</p>;
  return <div className={cx('dm-ahx-msg dm-enter', BOXED.has(b.kind) && 'dm-box')} data-block={b.key}><Message b={b} /></div>;
}

/** The quiet mark in the list: unread, running or waiting on the person */
const Mark = ({ c }: { c: AgentHarnessConversation }) => (
  c.unread ? <span key="u" className="dm-dot dm-enter" style={{ color: 'var(--dm-accent)' }} />
    : c.state === 'running' ? <span key="r" className="dm-spin dm-enter" />
      : c.state === 'waiting' ? <span key="w" className="dm-dot dm-enter" style={{ color: 'var(--dm-warn)' }} /> : null
);

/**
 * An agent app made only of the other components: conversations down the side, the chat in the middle, and the Composer
 * at its foot with the model and a context ring. Each conversation is a list of blocks, and each block is a bubble, the
 * agent's words, or one of the components with its own props. New chat shows Prompt starters. At phone width the list
 * folds into a switcher on the title. The chat follows new messages until the person scrolls up.
 */
export function AgentHarness({
  conversations, value, defaultValue, onValueChange, starters = [], onStarter, onSend, heading = 'What should the agent do?',
  model, draft, defaultDraft = '', onDraftChange, composer, className
}: AgentHarnessProps) {
  const [sel, setSel] = useControllable<string | null>(value, defaultValue !== undefined ? defaultValue : conversations[0]?.id ?? null, onValueChange);
  const [text, setText] = useControllable(draft, defaultDraft, onDraftChange);
  const [picked, setPicked] = useState<string | null>(null);
  const reduce = useReducedMotion();
  const menu = usePopover();
  const cur = conversations.find(c => c.id === sel) ?? null;
  const status = cur?.status ?? IDLE, ctx = cur ? cur.context ?? 0 : 0;

  /* following the conversation: it keeps to the newest message until you scroll up, and picks up again at the bottom */
  const feed = useRef<HTMLDivElement>(null), cols = useRef(new Map<string, HTMLDivElement>());
  const stick = useRef(true), ours = useRef(0), first = useRef(true);
  useEffect(() => {
    const f = feed.current, col = cols.current.get(sel ?? ''); if (!f || !col) return;
    stick.current = true; f.scrollTop = f.scrollHeight - f.clientHeight; ours.current = f.scrollTop;
    // a conversation comes in with the shared entrance when you switch to it
    if (!first.current) { col.classList.remove('dm-enter'); void col.offsetWidth; col.classList.add('dm-enter'); }
    first.current = false; setPicked(null);
    let raf = 0;
    const step = () => {
      const d = f.scrollHeight - f.clientHeight - f.scrollTop;
      if (!stick.current || d < 1) { raf = 0; return; }
      f.scrollTop += reduce ? d : Math.max(1, Math.ceil(d * .16)); ours.current = f.scrollTop; raf = requestAnimationFrame(step);
    };
    const ro = new ResizeObserver(() => { if (!raf && stick.current) raf = requestAnimationFrame(step); });
    ro.observe(col);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, [sel, reduce]);
  const onScroll = () => { const f = feed.current; if (f && Math.abs(f.scrollTop - ours.current) > 2) stick.current = f.scrollHeight - f.clientHeight - f.scrollTop < 40; };
  const look = (key: string) => {
    const f = feed.current, el = cols.current.get(sel ?? '')?.querySelector(`[data-block="${CSS.escape(key)}"]`); if (!f || !el) return;
    stick.current = false;
    f.scrollTo({ top: f.scrollTop + el.getBoundingClientRect().top - f.getBoundingClientRect().top - 12, behavior: reduce ? 'auto' : 'smooth' });
  };
  const pill: StatusPillProps = { state: status.state, label: status.label, meta: status.meta,
    action: status.action ?? (status.review ? { label: 'Review', onClick: () => look(status.review!) } : undefined) };

  const pick = (s: Starter) => { setPicked(s.title); if (onStarter) onStarter(s); else setText(s.prompt); };
  const select = (id: string | null) => { setSel(id); menu.closeSoon(); };
  const col = (id: string) => (el: HTMLDivElement | null) => { if (el) cols.current.set(id, el); else cols.current.delete(id); };

  return (
    <div data-dm="" className={cx('dm-ahx dm-panel', className)}>
      <aside className="dm-ahx-side" aria-label="Conversations">
        <button type="button" className="dm-ahx-new" aria-current={sel === null} onClick={() => select(null)}><Icon name="plus" /><span>New chat</span></button>
        <div className="dm-ahx-lh">Recent</div>
        <div className="dm-ahx-list">
          {conversations.map((c, i) => (
            <button key={c.id} type="button" className="dm-ahx-cv dm-enter" style={{ animationDelay: i * 40 + 'ms' }} aria-current={c.id === sel} onClick={() => select(c.id)}>
              <span className="dm-t">{c.title}</span><span className="dm-mk"><Mark c={c} /></span>{c.time && <span className="dm-tm dm-num">{c.time}</span>}
            </button>
          ))}
        </div>
      </aside>
      <div className="dm-ahx-main">
        <div className="dm-ahx-top">
          <button type="button" className="dm-ahx-sw" {...menu.trigger}><Swap className="dm-t">{cur?.title ?? 'New chat'}</Swap><Icon name="chev-d" size="xs" /></button>
          <StatusPill {...pill} className="dm-ahx-spl" />
          <div {...menu.pop} className={cx(menu.pop.className, 'dm-ahx-pop')} role="menu">
            <button type="button" className="dm-mi" role="menuitemradio" aria-checked={sel === null} onClick={() => select(null)}><Icon name="plus" /><span>New chat</span></button>
            <div className="dm-sep" />
            {conversations.map(c => (
              <button key={c.id} type="button" className="dm-mi" role="menuitemradio" aria-checked={c.id === sel} onClick={() => select(c.id)}>
                <span>{c.title}</span><span className="dm-r"><Mark c={c} />{c.time}</span>
              </button>
            ))}
          </div>
        </div>
        <div ref={feed} className="dm-ahx-feed" onScroll={onScroll} onWheel={e => { if (e.deltaY < 0) stick.current = false; }}>
          <div className="dm-ahx-cols">
            {/* every conversation stays mounted, so its components keep their state; only the one on screen takes up room */}
            {conversations.map(c => (
              <div key={c.id} ref={col(c.id)} className={cx('dm-ahx-col', c.id !== sel && 'dm-off')} aria-hidden={c.id !== sel} inert={c.id !== sel}>
                {c.blocks.map(b => <Block key={b.key} b={b} />)}
              </div>
            ))}
            <div ref={col('')} className={cx('dm-ahx-col dm-ahx-hi', sel !== null && 'dm-off')} aria-hidden={sel !== null} inert={sel !== null}>
              <h4>{heading}</h4>
              <div className="dm-psx">
                <div className="dm-psx-grid">
                  {starters.map((s, i) => {
                    const e = enter(i * 60), tone = s.tone && TONE[s.tone];
                    return (
                      <button key={s.title + (sel === null)} type="button" className={cx('dm-psx-c', e.className, picked === s.title && 'dm-on')} style={e.style} onClick={() => pick(s)}>
                        <span className="dm-psx-ic" style={tone ? { color: `var(--dm-${tone})` } : undefined}><Icon name={s.icon} /></span>
                        <b>{s.title}</b><span className="dm-d">{s.description}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="dm-ahx-bot">
          <Composer {...composer} value={text} onValueChange={setText} onSubmit={m => onSend?.(m, sel)}
            tools={
              <div className="dm-ctm-ft">
                {model && <span>{model}</span>}
                <Tip label={`Context ${ctx}% full`}>
                  <button type="button" className="dm-ctm-ring" aria-label={`Context, ${ctx}% full`}>
                    <svg viewBox="0 0 20 20" aria-hidden="true">
                      <circle className="dm-tr" cx="10" cy="10" r="7.5" />
                      <circle className="dm-fl" cx="10" cy="10" r="7.5" pathLength={100} style={{ strokeDasharray: `${ctx} 100` }} />
                    </svg>
                  </button>
                </Tip>
              </div>
            } />
        </div>
      </div>
    </div>
  );
}
