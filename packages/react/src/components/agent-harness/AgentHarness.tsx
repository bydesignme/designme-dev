'use client';
import { cx } from '../../lib/cx';
import '../../designme.css';
import './agent-harness.css';

export interface AgentHarnessProps {
  className?: string;
}

/** Every component working together in one agent conversation (being rebuilt as a chat) */
export function AgentHarness({ className }: AgentHarnessProps) {
  return <div data-dm="" className={cx('dm-ahx dm-panel', className)}><p className="dm-muted">The agent harness is being built.</p></div>;
}
