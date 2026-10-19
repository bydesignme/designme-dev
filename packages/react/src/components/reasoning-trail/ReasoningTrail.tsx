'use client';
import { useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useSeconds } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Dot, enter, Fold, Pulse, Seg, SourceChip, Swap, Think, type Source } from '../../lib/motion';
import './reasoning-trail.css';

export interface PlanStep {
  label: string;
  /** Shown under a finished step, like "4 frames" */
  detail?: string;
  state: 'done' | 'now' | 'next';
}
export interface Edit {
  file: string;
  /** Like "2 lines" */
  detail?: string;
  removed?: string[];
  added?: string[];
}
export type ReasoningTab = 'plan' | 'notes' | 'sources' | 'edits';

export interface ReasoningTrailProps {
  /** Shimmers and counts seconds while true */
  running?: boolean;
  /** Seconds to show. Leave it out to let the trail count while it runs */
  seconds?: number;
  /** Header text. Defaults to "Reasoning" while running and "Reasoned for Ns" after */
  title?: string;
  plan?: PlanStep[];
  notes?: string[];
  sources?: Source[];
  edits?: Edit[];
  defaultTab?: ReasoningTab;
  /** Whether the trail is open. Leave it out to let the header toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const TABS: { value: ReasoningTab; label: string }[] = [{ value: 'plan', label: 'Plan' }, { value: 'notes', label: 'Notes' }, { value: 'sources', label: 'Sources' }, { value: 'edits', label: 'Edits' }];

/** The agent's plan, notes, sources and edits, in one panel it can fold away. */
export function ReasoningTrail({ running = false, seconds, title, plan, notes, sources, edits, defaultTab, open, defaultOpen = true, onOpenChange, bare = true, className }: ReasoningTrailProps) {
  const counted = useSeconds(running && seconds === undefined);
  const secs = seconds ?? counted;
  const has = { plan: !!plan?.length, notes: !!notes?.length, sources: !!sources?.length, edits: !!edits?.length };
  const tabs = TABS.filter(t => has[t.value]);
  const [tab, setTab] = useState<ReasoningTab>(defaultTab && has[defaultTab] ? defaultTab : tabs[0]?.value ?? 'plan');
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const head = title ?? (running ? 'Reasoning' : `Reasoned for ${Math.max(secs, 1)}s`);

  const body = () => {
    if (tab === 'plan') return plan?.map((p, i) => (
      <div key={'p' + i} className={cx('rtr-li enter', p.state === 'now' && 'now')} style={enter(i * 50).style}>
        <span className="g">{p.state === 'done' ? <span style={{ color: 'var(--ok)', display: 'grid' }}><Icon name="check" size="xs" /></span> : p.state === 'now' ? <Pulse /> : <Dot color="var(--faint)" />}</span>
        <span>{p.label}<span className="d">{p.state === 'done' ? p.detail ?? 'Done' : p.state === 'now' ? 'Working' : 'Next'}</span></span>
      </div>));
    if (tab === 'notes') return notes?.map((t, i) => (
      <div key={'n' + i} className="rtr-li enter" style={enter(i * 50).style}><span className="g"><Dot color="var(--faint)" /></span><span>{t}</span></div>));
    if (tab === 'sources') return <div className="rtr-src enter">{sources?.map((s, i) => <SourceChip key={i} source={s} />)}</div>;
    return edits?.map((e, i) => (
      <div key={'e' + i} className="enter" style={enter(i * 50).style}>
        <div className="rtr-li"><span className="g"><Icon name="edit" size="xs" /></span><span>{e.file}{e.detail && <span className="d">{e.detail}</span>}</span></div>
        <div className="rtr-edit">{e.removed?.map((l, k) => <div key={'x' + k} className="x">{l}</div>)}{e.added?.map((l, k) => <div key={'a' + k} className="a">{l}</div>)}</div>
      </div>));
  };

  return (
    <div data-dm="" className={cx('rtr', !bare && 'panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <button type="button" className="rtr-h" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <Think on={running} className="rtr-mark" />
        <Swap className={cx('rtr-title', running && 'shim')}>{head}</Swap>
        <span className="rtr-time num muted">{running ? secs + 's' : ''}</span>
        <Icon name="chev-d" size="xs" className="rtr-chev" />
      </button>
      <Fold open={isOpen} className="rtr-fold">
        {tabs.length > 1 && <div className="rtr-tabs"><Seg label="View" options={tabs} value={tab} onChange={setTab} /></div>}
        {/* keyed by tab, so switching tabs plays the entrance again */}
        <div className="rtr-body" key={tab}>{body()}</div>
      </Fold>
    </div>
  );
}
