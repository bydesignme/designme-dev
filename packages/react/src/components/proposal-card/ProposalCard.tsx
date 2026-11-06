'use client';
import { useEffect, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useTween } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Fold, Swap } from '../../lib/motion';
import '../../designme.css';
import './proposal-card.css';

export type ProposalTone = 'ok' | 'warn' | 'bad';

/** One side of the change: a swatch, its value and a tag, like #C9CFD8 with "2.1 : 1" */
export interface ProposalValue {
  /** Any CSS colour, shown in the swatch */
  color: string;
  /** Like "#C9CFD8" */
  label: string;
  /** A short tag after the value, like a contrast ratio */
  badge?: string;
  /** Colours the tag. The current value defaults to bad, the options to ok */
  tone?: ProposalTone;
}

/** A change the agent can make. The first one is its suggestion, the others show under "other options" */
export interface ProposalOption extends ProposalValue {
  /** Like "Suggested" or "Darker" */
  name: string;
  /** The quiet line beside it in the list, like "Balanced with the primary" */
  description?: string;
  /** How sure the agent is, 0 to 100 */
  confidence: number;
}

export type ProposalStatus = 'open' | 'accepted' | 'dismissed';

export interface ProposalCardProps {
  /** What the agent wants to change */
  title: ReactNode;
  /** Where, like "Pricing, frame 2 of 3" */
  subtitle?: ReactNode;
  /** The icon in the orange tile. Defaults to a wand */
  icon?: IconName;
  /** How it is now */
  from: ProposalValue;
  /** The changes on offer, the agent's pick first */
  options: ProposalOption[];
  /** Index of the option shown as the change. Leave it out to let the list pick it */
  value?: number;
  /** Defaults to 0, the agent's pick */
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  /** Whether the other options are listed. Leave it out to let their toggle open them */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** open, accepted or dismissed. Leave it out to let Accept, Not now and Undo move it */
  status?: ProposalStatus;
  defaultStatus?: ProposalStatus;
  onStatusChange?: (status: ProposalStatus) => void;
  /** Called with the chosen option when Accept is pressed */
  onAccept?: (option: ProposalOption, index: number) => void;
  onDismiss?: () => void;
  onUndo?: () => void;
  /** Shown once accepted, like "Applied to 3 buttons" */
  acceptedLabel?: string;
  /** Shown once dismissed */
  dismissedLabel?: string;
  confidenceLabel?: string;
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

const STEPS = 5;

/** A change the agent proposes, with its confidence, other options, and Accept or Not now. */
export function ProposalCard({
  title, subtitle, icon = 'wand', from, options, value, defaultValue = 0, onValueChange, open, defaultOpen = false, onOpenChange,
  status, defaultStatus = 'open', onStatusChange, onAccept, onDismiss, onUndo, acceptedLabel = 'Applied', dismissedLabel = 'Dismissed. The agent will not suggest this again.',
  confidenceLabel = 'Confidence', bare = true, className
}: ProposalCardProps) {
  const [sel, setSel] = useControllable(value, defaultValue, onValueChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const [state, setState] = useControllable(status, defaultStatus, onStatusChange);
  // the confidence fills in a moment after the card appears, then follows the chosen option
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 400); return () => clearTimeout(t); }, []);
  // the list only plays its entrance once someone has picked another option
  const [picked, setPicked] = useState(false);
  const opt = options[Math.max(0, Math.min(options.length - 1, sel))];
  const conf = useTween(ready && opt ? opt.confidence : 0, 700, 0);
  const others = options.map((o, i) => ({ o, i })).filter(x => x.i !== sel);

  const choose = (i: number) => { setPicked(true); setSel(i); };
  const accept = () => { setOpen(false); setState('accepted'); onAccept?.(opt, sel); };
  const dismiss = () => { setState('dismissed'); onDismiss?.(); };
  const undo = () => { setState('open'); onUndo?.(); };

  return (
    <div data-dm="" className={cx('dm-prx', !bare && 'dm-panel', className)}>
      <div className="dm-prx-h">
        <span className="dm-prx-ic"><Icon name={icon} /></span>
        <div className="dm-prx-ht"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div>
      </div>
      <div className="dm-prx-diff">
        <div className="dm-prx-sw">
          <span className="dm-prx-c" style={{ background: from.color }} />
          <span className="dm-num">{from.label}</span>
          {from.badge && <span className={cx('dm-tag', 'dm-' + (from.tone ?? 'bad'))}>{from.badge}</span>}
        </div>
        <span className="dm-prx-ar"><Icon name="right" size="xs" /></span>
        {opt && (
          <div className="dm-prx-sw dm-prx-new">
            <span className="dm-prx-c" style={{ background: opt.color }} />
            <Swap className="dm-num">{opt.label}</Swap>
            {opt.badge && <span className={cx('dm-tag', 'dm-' + (opt.tone ?? 'ok'))}><Swap>{opt.badge}</Swap></span>}
          </div>
        )}
      </div>
      <div className="dm-prx-cf">
        <span className="dm-muted">{confidenceLabel}</span>
        <div className="dm-prx-seg" role="meter" aria-label={confidenceLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={opt?.confidence ?? 0}>
          {Array.from({ length: STEPS }, (_, i) => <i key={i} className={cx(conf >= (i + 1) * 20 - 10 && 'dm-on')} />)}
        </div>
        <span className="dm-num dm-prx-pc">{Math.round(conf)}%</span>
      </div>
      {others.length > 0 && (
        <>
          <button type="button" className={cx('dm-prx-alt-t', isOpen && 'dm-open')} aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
            <Icon name="chev-r" size="xs" /><span>{others.length} other {others.length > 1 ? 'options' : 'option'}</span>
          </button>
          <Fold open={isOpen} className="dm-prx-alt">
            <div className="dm-prx-alts" key={sel}>
              {others.map(({ o, i }, k) => (
                <button type="button" key={i} className={cx('dm-prx-a', picked && 'dm-enter')} style={picked ? enter(k * 50).style : undefined} onClick={() => choose(i)}>
                  <span className="dm-prx-c" style={{ background: o.color }} />
                  <span>{o.name}{o.badge && `, ${o.badge}`}</span>
                  {o.description && <span className="dm-d">{o.description}</span>}
                </button>
              ))}
            </div>
          </Fold>
        </>
      )}
      <div className="dm-prx-f">
        {state === 'open' ? (
          <>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-prx-no" onClick={dismiss}>Not now</button>
            <button type="button" className="dm-pill dm-primary dm-sm dm-prx-ok" onClick={accept}>Accept</button>
          </>
        ) : state === 'accepted' ? (
          <>
            <span className="dm-prx-done dm-enter"><Icon name="ok" /><span>{acceptedLabel}</span></span>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-prx-un dm-enter" style={enter(60).style} onClick={undo}><Icon name="undo" size="xs" />Undo</button>
          </>
        ) : (
          <>
            <span className="dm-prx-done dm-muted dm-enter" style={{ color: 'var(--dm-muted)' }}>{dismissedLabel}</span>
            <button type="button" className="dm-pill dm-ghost dm-sm dm-prx-un dm-enter" style={enter(60).style} onClick={undo}>Undo</button>
          </>
        )}
      </div>
    </div>
  );
}
