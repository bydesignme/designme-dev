'use client';
import { cx } from '../../lib/cx';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Spin, Swap } from '../../lib/motion';
import '../../designme.css';
import './launch-checklist.css';

export type CheckState = 'wait' | 'run' | 'ok' | 'bad';

export interface LaunchCheck {
  /** What is checked, like "Contrast meets AA" */
  label: string;
  /** wait (not run yet), run (checking or fixing now), ok or bad */
  state: CheckState;
  /** The quiet line under the label, like "All 14 text pairs pass" or what is wrong */
  note?: string;
  /** Shows a Fix button on a failed check */
  onFix?: () => void;
}

export interface LaunchChecklistProps {
  /** Like "Ready to ship pricing?" */
  title?: string;
  checks: LaunchCheck[];
  /** The line under the title. Defaults to a count of the checks, "Checking" while one runs, then what is left to fix */
  status?: string;
  /** The button beside the title, like Run checks, Run again or Ship it */
  action?: { label: string; icon?: IconName; /** The accent colour, for the step that ships */ accent?: boolean; disabled?: boolean; onClick?: () => void };
  /** Sits flat in a chat thread (the default, as on designme.dev). Set false to give it a card of its own */
  bare?: boolean;
  className?: string;
}

function Glyph({ state }: { state: CheckState }) {
  // a fresh glyph comes in each time the state changes; the wrapper takes the entrance so a spinner inside keeps turning
  const g = state === 'run' ? <Spin /> : state === 'ok' ? <span style={{ color: 'var(--dm-ok)', display: 'grid' }}><Icon name="ok" /></span>
    : state === 'bad' ? <span style={{ color: 'var(--dm-bad)', display: 'grid' }}><Icon name="alert" /></span> : <span className="dm-lcx-ring" />;
  return <span key={state} className={state === 'wait' ? undefined : 'dm-enter'} style={{ display: 'grid' }}>{g}</span>;
}

const summary = (checks: LaunchCheck[]) => {
  if (checks.some(c => c.state === 'run')) return 'Checking';
  if (checks.every(c => c.state === 'wait')) return `${checks.length} checks`;
  const bad = checks.filter(c => c.state === 'bad').length;
  return bad ? `${bad} to fix before shipping` : 'All clear, ready to ship';
};

/** Pre-flight checks before something ships, each with its result and a Fix for the ones that fail. */
export function LaunchChecklist({ title = 'Ready to ship?', checks, status, action, bare = true, className }: LaunchChecklistProps) {
  return (
    <div data-dm="" className={cx('dm-lcx', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <div className="dm-lcx-h">
        <div><b>{title}</b><Swap className="dm-muted dm-lcx-st">{status ?? summary(checks)}</Swap></div>
        {action && (
          <button type="button" className={cx('dm-pill dm-sm dm-lcx-run', action.accent ? 'dm-accent' : 'dm-primary')} disabled={action.disabled} onClick={action.onClick}>
            {action.icon && <Icon name={action.icon} size="xs" />}{action.label}
          </button>
        )}
      </div>
      <div className="dm-lcx-bar" role="progressbar" aria-label={title} aria-valuemin={0} aria-valuemax={checks.length}
        aria-valuenow={checks.filter(c => c.state === 'ok' || c.state === 'bad').length}>
        {checks.map((c, i) => <i key={i} className={c.state === 'wait' ? undefined : 'dm-' + c.state} />)}
      </div>
      <div className="dm-lcx-list">
        {checks.map((c, i) => (
          <div key={i} className={cx('dm-lcx-r', 'dm-' + c.state)}>
            <span className="dm-g"><Glyph state={c.state} /></span>
            <span className="dm-t">{c.label}<Swap className="dm-d">{c.note ?? ''}</Swap></span>
            {c.state === 'bad' && c.onFix && (
              <button type="button" className="dm-pill dm-soft dm-sm dm-enter" style={enter().style} onClick={c.onFix}><Icon name="wand" size="xs" />Fix</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
