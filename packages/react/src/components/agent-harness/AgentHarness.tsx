'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useCopied, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Fold, Spin, Swap, Think, Tip, enter } from '../../lib/motion';
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
import { RunSummary, type RunSummaryProps } from '../run-summary/RunSummary';
import { SourceStack, type SourceStackProps } from '../source-stack/SourceStack';
import { StatusPill, type StatusPillProps } from '../status-pill/StatusPill';
import { Thinking, type ThinkingProps } from '../thinking/Thinking';
import { ToolCall, type ToolCallProps } from '../tool-call/ToolCall';
import '../../designme.css';
import '../live-answer/live-answer.css';
import '../context-meter/context-meter.css';
import './agent-harness.css';

/** One message in a chat: what the person asked, what the agent said, its work, or one of the components it works through */
export type AgentHarnessBlock = { key: string } & (
  /** The person's message, as a bubble */
  | { kind: 'user'; text: string; files?: string[] }
  /** The agent's words. Pass the text so far and each new word fades in as it arrives */
  | { kind: 'say'; text: string }
  /** A passing line with the thinking mark, while the agent does something quick, like "Reading 8 sources" */
  | { kind: 'working'; text: string }
  /** The agent's work under one line: open while it runs, folded into its label a moment after it is done. The person can open it again */
  | { kind: 'group'; label: string; state: 'running' | 'done'; seconds?: number; blocks: AgentHarnessBlock[] }
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

/** running shows a spinner beside the chat and holds new messages back, waiting an amber dot (the agent needs the person), done nothing */
export type AgentHarnessState = 'idle' | 'running' | 'waiting' | 'done';

/** What the status pill beside the tabs says while the chat is on screen */
export interface AgentHarnessStatus extends Pick<StatusPillProps, 'state' | 'label' | 'meta' | 'action'> {
  /** The key of a block the agent is waiting on. Adds a Review button that scrolls to it */
  review?: string;
}

export interface AgentHarnessConversation {
  id: string;
  title: string;
  state?: AgentHarnessState;
  /** A quiet dot for a chat that changed since it was last open. Clear it when it is opened */
  unread?: boolean;
  status?: AgentHarnessStatus;
  /** How full its context is, 0 to 100, drawn as the ring in the composer */
  context?: number;
  blocks: AgentHarnessBlock[];
  /** Suggested next messages, shown under the last block. Picking one calls onFollowUp */
  followUps?: string[];
}

/** An open tab. Without a chat it is New chat */
export interface AgentHarnessTab {
  key: string;
  chat?: string;
}

/** A suggestion on New chat. Picking it sends its text */
export interface AgentHarnessSuggestion {
  icon: IconName;
  text: string;
}

export interface AgentHarnessWorkspace {
  name: string;
  /** The letter on its tile. Defaults to the name's first letter */
  mark?: string;
  /** The tile's colour. Defaults to ink */
  color?: string;
}

/** What the panel beside the chat shows, like an artifact opened from its card */
export interface AgentHarnessPanel {
  title: string;
  icon?: IconName;
  /** Adds a button that copies this link */
  link?: string;
  children: ReactNode;
}

export interface AgentHarnessProps {
  /** The chats down the side, newest first */
  conversations: AgentHarnessConversation[];
  /** The open tabs, in order. Leave it out to let the harness keep them; it starts with one New chat tab */
  tabs?: AgentHarnessTab[];
  defaultTabs?: AgentHarnessTab[];
  onTabsChange?: (tabs: AgentHarnessTab[]) => void;
  /** The key of the tab on screen */
  tab?: string;
  defaultTab?: string;
  onTabChange?: (tab: string) => void;
  /** New chat's suggestions. Three show at a time, and Shuffle shows the next three */
  suggestions?: AgentHarnessSuggestion[];
  /**
   * Called with what the person sends or the suggestion they pick, the chat it goes to (null from New chat) and the tab.
   * From New chat, return the id of the chat it started and the tab turns into that chat. Nothing is sent while the chat
   * on screen is running
   */
  onSend?: (message: { text: string; attachments: ComposerAttachment[] }, conversation: string | null, tab: string) => string | void;
  /** Called when the person picks one of a chat's follow-ups */
  onFollowUp?: (text: string, conversation: string) => void;
  /** The grey line over New chat's heading. Defaults to good morning, afternoon or evening */
  greeting?: string;
  /** Defaults to "What should the agent work on?" */
  heading?: string;
  /** The workspace switcher at the top of the side */
  workspaces?: AgentHarnessWorkspace[];
  /** The name of the workspace shown. Defaults to the first */
  workspace?: string;
  defaultWorkspace?: string;
  onWorkspaceChange?: (name: string) => void;
  /** Opens the panel beside the chat. On a wide harness the chats fold away while it is open */
  panel?: AgentHarnessPanel | null;
  /** Called by the panel's close button and by Escape */
  onPanelClose?: () => void;
  /** Shown beside the context ring, like the model's name */
  model?: string;
  /** The text in the composer. Leave it out to let the harness keep it; each tab keeps its own draft */
  draft?: string;
  defaultDraft?: string;
  onDraftChange?: (draft: string) => void;
  /** The composer's placeholder on New chat, in a chat, and while the agent works */
  placeholders?: { home?: string; reply?: string; working?: string };
  /** Anything else for the composer: what it works on, its mode, attachments, dictation */
  composer?: Omit<ComposerProps, 'value' | 'defaultValue' | 'onValueChange' | 'onSubmit' | 'thread' | 'tools' | 'className' | 'placeholder'>;
  className?: string;
}

// an artifact and a diff keep their card in the chat; every other component sits on the chat itself
const BOXED = new Set(['artifact-card', 'change-review']);
const IDLE: AgentHarnessStatus = { state: 'idle', label: 'Ready for a task' };
const NARROW = 620;
let made = 0;
const newTab = (): AgentHarnessTab => ({ key: 'tab-' + ++made });

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

/** The agent's work under one line: open while it runs, folded into its summary a moment after, unless the person opened it */
function Group({ b }: { b: Extract<AgentHarnessBlock, { kind: 'group' }> }) {
  const done = b.state === 'done';
  const [open, setOpen] = useState(!done);
  const mine = useRef(false);
  useEffect(() => {
    if (!done) { setOpen(true); return; }
    if (mine.current) return;
    const t = setTimeout(() => setOpen(false), 1200);
    return () => clearTimeout(t);
  }, [done]);
  return (
    <div className="dm-ahx-wk dm-enter" data-block={b.key}>
      <button type="button" className="dm-ahx-wh" aria-expanded={open} onClick={() => { mine.current = true; setOpen(!open); }}>
        <span className="dm-g">{done ? <Icon key="ok" name="check" size="xs" className="dm-enter" /> : <Spin />}</span>
        <Swap className={cx('dm-t', !done && 'dm-shim')}>{b.label}</Swap>
        {done && b.seconds !== undefined && <span className="dm-m dm-num">{b.seconds}s</span>}
        <Icon name="chev-d" size="xs" />
      </button>
      <Fold open={open} className="dm-ahx-wb"><div className="dm-ahx-wl">{b.blocks.map(x => <Block key={x.key} b={x} />)}</div></Fold>
    </div>
  );
}

function Block({ b }: { b: AgentHarnessBlock }) {
  if (b.kind === 'user') return (
    <div className="dm-bub dm-enter" data-block={b.key}>
      {b.files?.length ? <div className="dm-ahx-fs">{b.files.map(f => <span key={f} className="dm-fchip"><Icon name="clip" size="xs" />{f}</span>)}</div> : null}
      {b.text}
    </div>
  );
  if (b.kind === 'say') return <p className="dm-msg dm-ahx-say" data-block={b.key}>{b.text.split(' ').map((w, i) => <span key={i} className="dm-w">{w} </span>)}</p>;
  if (b.kind === 'working') return (
    <div className="dm-lva-th dm-enter" data-block={b.key}><span style={{ color: 'var(--dm-fg2)', display: 'grid' }}><Think /></span><span className="dm-shim">{b.text}</span></div>
  );
  if (b.kind === 'group') return <Group b={b} />;
  return <div className={cx('dm-ahx-msg dm-enter', BOXED.has(b.kind) && 'dm-box')} data-block={b.key}><Message b={b} /></div>;
}

/** The quiet mark on a chat's row and tab: unread, running or waiting on the person */
const Mark = ({ c }: { c?: AgentHarnessConversation }) => (
  <span className="dm-ahx-mk">
    {!c ? null : c.unread ? <span key="u" className="dm-dot dm-enter" style={{ color: 'var(--dm-accent)' }} />
      : c.state === 'running' ? <span key="r" className="dm-spin dm-enter" />
        : c.state === 'waiting' ? <span key="w" className="dm-dot dm-enter" style={{ color: 'var(--dm-warn)' }} /> : null}
  </span>
);

const greet = () => { const h = new Date().getHours(); return h < 5 || h >= 18 ? 'Good evening' : h < 12 ? 'Good morning' : 'Good afternoon'; };

/**
 * An agent app made only of the other components: chats down the side, tabs across the top, and New chat with a greeting,
 * the Composer and a few suggestions. Nothing plays by itself: the person picks a suggestion or sends a message, and the chats
 * are lists of blocks you drive from your own state, each a bubble, the agent's words, its work folded under one line, or one
 * of the components with its own props. A chat opens in a tab, × closes it, + opens New chat. At phone width the chats slide
 * in from the side, and the tabs fold into the chat on screen with a count beside it that lists every open chat. The chat follows new messages until the person scrolls up.
 */
export function AgentHarness({
  conversations, tabs, defaultTabs, onTabsChange, tab, defaultTab, onTabChange, suggestions = [], onSend, onFollowUp,
  greeting, heading = 'What should the agent work on?', workspaces = [], workspace, defaultWorkspace, onWorkspaceChange,
  panel, onPanelClose, model, draft, defaultDraft = '', onDraftChange, placeholders, composer, className
}: AgentHarnessProps) {
  const [first] = useState(() => defaultTabs?.length ? defaultTabs : [newTab()]);
  const [open, setOpen] = useControllable(tabs, first, onTabsChange);
  const [active, setActive] = useControllable(tab, defaultTab ?? first[0].key, onTabChange);
  const [text, setText] = useControllable(draft, defaultDraft, onDraftChange);
  const [ws, setWs] = useControllable(workspace, defaultWorkspace ?? workspaces[0]?.name ?? '', onWorkspaceChange);
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null), feed = useRef<HTMLDivElement>(null), tabsEl = useRef<HTMLDivElement>(null);
  const cols = useRef(new Map<string, HTMLDivElement>());
  const wsMenu = usePopover();
  // on a phone the tabs fold into one, and a count of the open chats lists them all
  const tabsMenu = usePopover({ align: 'end' });
  const [side, setSide] = useState(true), [drawer, setDrawer] = useState(false);
  const [search, setSearch] = useState(false), [query, setQuery] = useState('');
  const si = useRef<HTMLInputElement>(null);
  useEffect(() => { if (search) si.current?.focus({ preventScroll: true }); }, [search]);
  const [shift, setShift] = useState(0);
  const [hello, setHello] = useState(greeting ?? '');
  useEffect(() => { if (!greeting) setHello(greet()); }, [greeting]);

  const at = open.find(t => t.key === active) ?? open[0];
  const cur = at?.chat ? conversations.find(c => c.id === at.chat) ?? null : null;
  const home = !at?.chat;
  const status = cur?.status ?? IDLE, ctx = cur ? cur.context ?? 0 : 0, busy = cur?.state === 'running';
  const narrow = () => (root.current?.clientWidth ?? 1000) <= NARROW;

  /* the composer's settings live here, so they stay put when it moves between New chat and the foot of a chat */
  const cp = composer ?? {};
  const [att, setAtt] = useControllable(cp.attachments, cp.defaultAttachments ?? [], cp.onAttachmentsChange);
  const [ctxPick, setCtxPick] = useControllable(cp.context, cp.defaultContext ?? cp.contexts?.[0]?.value ?? '', cp.onContextChange);
  const [mode, setMode] = useControllable(cp.mode, cp.defaultMode ?? cp.modes?.[0]?.value ?? 'ask', cp.onModeChange);

  /* each tab keeps its own draft */
  const drafts = useRef(new Map<string, string>());
  const goTo = (key: string) => {
    if (key === active) return;
    drafts.current.set(active, text); setActive(key); setText(drafts.current.get(key) ?? '');
  };

  /* ---- tabs ---- */
  // a chat comes to the front if it is open, takes over an untouched New chat tab, or opens a tab beside the one on screen
  const openChat = (id: string) => {
    setDrawer(false);
    const has = open.find(t => t.chat === id); if (has) return goTo(has.key);
    if (at && !at.chat && !text.trim()) return setOpen(open.map(t => t.key === at.key ? { ...t, chat: id } : t));
    const t = { ...newTab(), chat: id }, i = open.findIndex(x => x.key === at?.key);
    setOpen([...open.slice(0, i + 1), t, ...open.slice(i + 1)]); goTo(t.key);
  };
  const fresh = () => {
    setDrawer(false);
    const h = open.find(t => !t.chat); if (h) return goTo(h.key);
    const t = newTab(), i = open.findIndex(x => x.key === at?.key);
    setOpen([...open.slice(0, i + 1), t, ...open.slice(i + 1)]); goTo(t.key);
  };
  const close = (key: string) => {
    const i = open.findIndex(t => t.key === key), rest = open.filter(t => t.key !== key);
    drafts.current.delete(key);
    if (!rest.length) { const t = newTab(); setOpen([t]); setActive(t.key); setText(''); return; }
    setOpen(rest);
    if (key === active) { const next = rest[Math.min(i, rest.length - 1)].key; setActive(next); setText(drafts.current.get(next) ?? ''); }
  };
  // on a phone only the tab on screen shows, so the one coming to the front comes in
  const shownTab = useRef(active);
  useIsoLayoutEffect(() => {
    if (shownTab.current === active) return; shownTab.current = active;
    const el = tabsEl.current?.querySelector<HTMLElement>(`[data-tab="${CSS.escape(active)}"]`); if (!el || !narrow()) return;
    el.classList.remove('dm-enter'); void el.offsetWidth; el.classList.add('dm-enter');
  }, [active]);
  // the tab on screen is always in view, also when the status pill beside the tabs grows
  useEffect(() => {
    const box = tabsEl.current; if (!box) return;
    const keep = (now: boolean) => {
      const el = box.querySelector<HTMLElement>(`[data-tab="${CSS.escape(active)}"]`); if (!el) return;
      const l = el.offsetLeft, r = l + el.offsetWidth;
      if (l < box.scrollLeft || r > box.scrollLeft + box.clientWidth) box.scrollTo({ left: l < box.scrollLeft ? l - 4 : r - box.clientWidth + 4, behavior: reduce || now ? 'auto' : 'smooth' });
    };
    keep(false);
    const ro = new ResizeObserver(() => keep(true)); ro.observe(box);
    return () => ro.disconnect();
  }, [active, open.length, reduce]);

  /* ---- sending ---- */
  const send = (message: { text: string; attachments: ComposerAttachment[] }) => {
    if (busy || !at) return;
    setText(''); drafts.current.delete(at.key);
    const id = onSend?.(message, cur?.id ?? null, at.key);
    if (home && typeof id === 'string') setOpen(open.map(t => t.key === at.key ? { ...t, chat: id } : t));
  };
  // Enter does nothing while the agent works in the chat on screen
  const hold = (e: KeyboardEvent) => { if (busy && e.key === 'Enter' && !e.shiftKey && (e.target as HTMLElement).tagName === 'TEXTAREA') { e.preventDefault(); e.stopPropagation(); } };

  /* ---- following the chat: it keeps to the newest message until you scroll up, and picks up again at the bottom ---- */
  const stick = useRef(true), ours = useRef(0), seen = useRef<string | null>(null);
  useEffect(() => {
    const f = feed.current, col = cur ? cols.current.get(cur.id) : null; if (!f || !col) return;
    stick.current = true; f.scrollTop = f.scrollHeight - f.clientHeight; ours.current = f.scrollTop;
    // a chat comes in with the shared entrance when you switch to it
    if (seen.current !== null && seen.current !== cur!.id) { col.classList.remove('dm-enter'); void col.offsetWidth; col.classList.add('dm-enter'); }
    seen.current = cur!.id;
    let raf = 0;
    const step = () => {
      const d = f.scrollHeight - f.clientHeight - f.scrollTop;
      if (!stick.current || d < 1) { raf = 0; return; }
      f.scrollTop += reduce ? d : Math.max(1, Math.ceil(d * .16)); ours.current = f.scrollTop; raf = requestAnimationFrame(step);
    };
    const ro = new ResizeObserver(() => { if (!raf && stick.current) raf = requestAnimationFrame(step); });
    ro.observe(col);
    return () => { ro.disconnect(); cancelAnimationFrame(raf); };
  }, [cur?.id, reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  // the person's own message brings the chat back to the bottom
  const lastUser = cur?.blocks.filter(b => b.kind === 'user').length ?? 0;
  useEffect(() => { stick.current = true; }, [lastUser]);
  const onScroll = () => { const f = feed.current; if (f && Math.abs(f.scrollTop - ours.current) > 2) stick.current = f.scrollHeight - f.clientHeight - f.scrollTop < 40; };
  const look = (key: string) => {
    const f = feed.current, el = cur && cols.current.get(cur.id)?.querySelector(`[data-block="${CSS.escape(key)}"]`); if (!f || !el) return;
    stick.current = false;
    f.scrollTo({ top: f.scrollTop + el.getBoundingClientRect().top - f.getBoundingClientRect().top - 12, behavior: reduce ? 'auto' : 'smooth' });
  };
  const pill: StatusPillProps = { state: status.state, label: status.label, meta: status.meta,
    action: status.action ?? (status.review ? { label: 'Review', onClick: () => look(status.review!) } : undefined) };

  /* ---- the composer glides from the middle of New chat to the foot of the chat it starts ---- */
  const was = useRef<{ tab: string; home: boolean; top: number; left: number } | null>(null);
  useIsoLayoutEffect(() => {
    const r = root.current, el = r?.querySelector<HTMLElement>('.dm-cpx'); if (!r || !el) return;
    const rr = r.getBoundingClientRect(), b = el.getBoundingClientRect(), top = b.top - rr.top, left = b.left - rr.left;
    const w = was.current;
    if (w && w.tab === active && w.home && !home && !reduce && Math.abs(w.top - top) > 2) {
      const bp = getComputedStyle(r).getPropertyValue('--dm-motion').trim() === 'bp';
      el.animate([{ transform: `translate(${w.left - left}px,${w.top - top}px)` }, { transform: 'none' }], { duration: bp ? 360 : 640, easing: bp ? 'cubic-bezier(.65,0,.25,1)' : 'cubic-bezier(.22,1,.36,1)' });
    }
    was.current = { tab: active, home, top, left };
  }, [active, home]);

  /* ---- the panel: it keeps what it showed while it folds shut, and the chats fold away while it is open on a wide harness ---- */
  const kept = useRef<AgentHarnessPanel | null>(null);
  if (panel) kept.current = panel;
  const shown = panel ?? kept.current;
  const folded = useRef(false);
  useEffect(() => {
    if (panel && !narrow() && side) { setSide(false); folded.current = true; }
    if (!panel && folded.current) { setSide(true); folded.current = false; }
  }, [!!panel]); // eslint-disable-line react-hooks/exhaustive-deps
  const [copied, copy] = useCopied();
  // Escape closes the chats on a phone, then the panel
  const escape = (e: KeyboardEvent) => { if (e.key !== 'Escape') return; if (drawer) setDrawer(false); else if (panel) onPanelClose?.(); };

  const q = query.trim().toLowerCase(), listed = conversations.filter(c => !q || c.title.toLowerCase().includes(q));
  const three = suggestions.length ? [0, 1, 2].slice(0, suggestions.length).map(i => suggestions[(shift + i) % suggestions.length]) : [];
  const wsNow = workspaces.find(w => w.name === ws) ?? workspaces[0];
  const tile = (w: AgentHarnessWorkspace) => ({ background: w.color ?? 'var(--dm-primary)', color: w.color ? '#fff' : 'var(--dm-on-ink)' });
  const ph = home ? placeholders?.home ?? 'Ask the agent to do something' : busy ? placeholders?.working ?? 'The agent is working…' : placeholders?.reply ?? 'Reply';
  const box = (
    <Composer {...cp} value={text} onValueChange={setText} onSubmit={send} placeholder={ph}
      attachments={att} onAttachmentsChange={setAtt} context={ctxPick} onContextChange={setCtxPick} mode={mode} onModeChange={setMode}
      tools={
        <div className="dm-ctm-ft">
          {model && <span>{model}</span>}
          <Tip label={`Context ${ctx}% full`}>
            <button type="button" className="dm-ctm-ring" aria-label={`Context, ${ctx}% full`}>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <circle className="dm-tr" cx="10" cy="10" r="7.5" />
                <circle className="dm-fl" cx="10" cy="10" r="7.5" pathLength={100} style={{ strokeDasharray: `${ctx} 100`, opacity: ctx ? undefined : 0 }} />
              </svg>
            </button>
          </Tip>
        </div>
      } />
  );

  return (
    <div data-dm="" ref={root} onKeyDownCapture={hold} onKeyDown={escape}
      className={cx('dm-ahx dm-panel', !side && 'dm-ns', drawer && 'dm-dr', panel && 'dm-pn', busy && 'dm-busy', className)}>
      <aside className="dm-ahx-side" aria-label="Chats">
        <div className="dm-ahx-ws">
          {wsNow && (
            <button type="button" className="dm-ahx-wsb" {...wsMenu.trigger}>
              <span className="dm-ahx-lg" style={tile(wsNow)}>{wsNow.mark ?? wsNow.name.charAt(0)}</span><Swap className="dm-t">{wsNow.name}</Swap><Icon name="chev-d" size="xs" />
            </button>
          )}
          <Tip label="Hide chats"><button type="button" className="dm-ib dm-ahx-hide" aria-label="Hide chats" onClick={() => narrow() ? setDrawer(false) : setSide(false)}><Icon name="panel" /></button></Tip>
        </div>
        <button type="button" className="dm-ahx-nav dm-ahx-new" onClick={fresh}><Icon name="edit" /><span>New chat</span></button>
        <div className="dm-ahx-lh">
          <span>Chats</span>
          <Tip label="Search chats"><button type="button" className="dm-ib dm-ahx-sb" aria-label="Search chats" onClick={() => { setSearch(!search); if (search) setQuery(''); }}><Icon name="search" /></button></Tip>
        </div>
        <Fold open={search} className="dm-ahx-sf">
          <input className="dm-ahx-si" type="search" placeholder="Search chats" aria-label="Search chats" value={query} onChange={e => setQuery(e.target.value)}
            ref={si}
            onKeyDown={e => { if (e.key === 'Escape') { e.stopPropagation(); setSearch(false); setQuery(''); } }} />
        </Fold>
        <div className="dm-ahx-list">
          {listed.map(c => (
            <button key={c.id} type="button" className="dm-ahx-cv dm-enter" aria-current={c.id === cur?.id} onClick={() => openChat(c.id)}>
              <span className="dm-t">{c.title}</span><Mark c={c} />
            </button>
          ))}
          {!listed.length && <p className="dm-ahx-none">No chats match</p>}
        </div>
      </aside>
      <div className={cx('dm-ahx-main', home && 'dm-home')}>
        <div className="dm-ahx-top">
          <Tip label="Show chats"><button type="button" className="dm-ib dm-ahx-menu" aria-label="Show chats" onClick={() => narrow() ? setDrawer(true) : setSide(true)}><Icon name="panel" /></button></Tip>
          <div ref={tabsEl} className="dm-ahx-tabs" role="tablist" aria-label="Open chats">
            {open.map(t => {
              const c = t.chat ? conversations.find(x => x.id === t.chat) : undefined;
              return (
                <div key={t.key} data-tab={t.key} className={cx('dm-ahx-tab dm-enter', t.key === at?.key && 'dm-on')}>
                  <button type="button" className="dm-ahx-tb" role="tab" aria-selected={t.key === at?.key} onClick={() => goTo(t.key)}>
                    <Mark c={c} /><Swap className="dm-t">{c?.title ?? 'New chat'}</Swap>
                  </button>
                  <Tip label="Close tab"><button type="button" className="dm-ahx-tx" aria-label="Close tab" onClick={() => close(t.key)}><Icon name="x" /></button></Tip>
                </div>
              );
            })}
          </div>
          {open.length > 1 && (
            <Tip label="Open chats" off={tabsMenu.open}>
              <button type="button" className="dm-ahx-tn" aria-label="Open chats" {...tabsMenu.trigger}><span className="dm-num">{open.length}</span></button>
            </Tip>
          )}
          <Tip label="New chat"><button type="button" className="dm-ib dm-ahx-plus" aria-label="New chat" onClick={fresh}><Icon name="plus" /></button></Tip>
          <StatusPill {...pill} className="dm-ahx-spl" />
        </div>
        <div className="dm-ahx-body">
          <div ref={feed} className="dm-ahx-feed" onScroll={onScroll} onWheel={e => { if (e.deltaY < 0) stick.current = false; }}>
            <div className="dm-ahx-cols">
              {/* every chat stays mounted, so its components keep their state; only the one on screen takes up room */}
              {conversations.map(c => (
                <div key={c.id} ref={el => { if (el) cols.current.set(c.id, el); else cols.current.delete(c.id); }}
                  className={cx('dm-ahx-col', c.id !== cur?.id && 'dm-off')} aria-hidden={c.id !== cur?.id} inert={c.id !== cur?.id}>
                  {c.blocks.map(b => <Block key={b.key} b={b} />)}
                  {c.followUps?.length ? (
                    <div className="dm-lva-fu">
                      {c.followUps.map((f, i) => <button type="button" key={f} {...enter(i * 90)} onClick={() => { if (c.state !== 'running') onFollowUp?.(f, c.id); }}><Icon name="chev-r" size="xs" />{f}</button>)}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
          <div className="dm-ahx-bot">{!home && box}</div>
          <div className="dm-ahx-home" inert={!home}>
            <div className="dm-ahx-hw">
              <div className="dm-ahx-hi"><span>{hello}</span><h4>{heading}</h4></div>
              <div className="dm-ahx-slot">{home && box}</div>
              {three.length > 0 && (
                <div className="dm-ahx-sg">
                  {three.map((s, i) => (
                    <button key={shift + ':' + i} type="button" className="dm-ahx-sr dm-enter" style={{ animationDelay: i * 50 + 'ms' }} onClick={() => send({ text: s.text, attachments: [] })}>
                      <Icon name={s.icon} /><span>{s.text}</span>
                    </button>
                  ))}
                </div>
              )}
              {suggestions.length > 3 && (
                <div className="dm-ahx-hf">
                  <button type="button" className="dm-pill dm-ghost dm-sm dm-ahx-shf" onClick={() => setShift((shift + 3) % suggestions.length)}><Icon name="refresh" size="xs" />Shuffle suggestions</button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <aside className="dm-ahx-pane" aria-label={shown?.title ?? 'Panel'} aria-hidden={!panel} inert={!panel}>
        {shown && (
          <div className="dm-ahx-pi">
            <div className="dm-ahx-ph">
              <Icon name={shown.icon ?? 'file-text'} /><span className="dm-t">{shown.title}</span>
              {shown.link && <Tip label={copied ? 'Copied to clipboard' : 'Copy link'} open={copied || undefined}><button type="button" className={cx('dm-ib', copied && 'dm-copied')} aria-label="Copy link" onClick={() => copy(shown.link!)}><Icon name={copied ? 'check' : 'link'} /></button></Tip>}
              <Tip label="Close"><button type="button" className="dm-ib" aria-label="Close panel" onClick={onPanelClose}><Icon name="x" /></button></Tip>
            </div>
            <div className="dm-ahx-pb">{shown.children}</div>
          </div>
        )}
      </aside>
      <div className="dm-ahx-scrim" onClick={() => setDrawer(false)} />
      <div {...tabsMenu.pop} className={cx(tabsMenu.pop.className, 'dm-ahx-tp')} role="menu" aria-label="Open chats">
        {open.map(t => {
          const c = t.chat ? conversations.find(x => x.id === t.chat) : undefined;
          return (
            <button key={t.key} type="button" className="dm-mi" role="menuitemradio" aria-checked={t.key === at?.key} onClick={() => { if (t.key !== at?.key) goTo(t.key); tabsMenu.closeSoon(); }}>
              <Mark c={c} /><span className="dm-t">{c?.title ?? 'New chat'}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
            </button>
          );
        })}
      </div>
      <div {...wsMenu.pop} className={cx(wsMenu.pop.className, 'dm-ahx-wsp')} role="menu">
        {workspaces.map(w => (
          <button key={w.name} type="button" className="dm-mi" role="menuitemradio" aria-checked={w.name === wsNow?.name} onClick={() => { setWs(w.name); wsMenu.closeSoon(); }}>
            <span className="dm-ahx-lg" style={tile(w)}>{w.mark ?? w.name.charAt(0)}</span><span>{w.name}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
    </div>
  );
}
