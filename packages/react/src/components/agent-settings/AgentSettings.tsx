'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Spin, Swap } from '../../lib/motion';
import '../../designme.css';
import './agent-settings.css';

/** A step on the autonomy scale */
export interface AgentSettingsLevel {
  /** On the segment, like "Balanced" */
  label: string;
  /** Under "Autonomy" while it is picked, like "Asks before edits to shared files" */
  description: string;
}

/** An on/off setting */
export interface AgentSettingsToggle {
  key: string;
  /** Like "Use team memory" */
  label: string;
  /** The quiet line under it, like "Brand rules and past decisions" */
  detail?: string;
}

/** Everything the panel edits */
export interface AgentSettingsValue {
  /** Index into `levels` */
  autonomy: number;
  /** On or off, by toggle key */
  toggles: Record<string, boolean>;
  /** The spend cap, one of `caps` */
  cap: number;
  instructions: string;
}

export interface AgentSettingsProps {
  /** The autonomy scale. Defaults to Ask, Balanced and Autopilot */
  levels?: AgentSettingsLevel[];
  toggles?: AgentSettingsToggle[];
  /** The amounts the spend cap steps through with − and + */
  caps?: number[];
  /** How the cap reads. Defaults to "$5" */
  formatCap?: (cap: number) => string;
  capLabel?: string;
  capDetail?: string;
  /** The settings. Leave it out to let the panel hold its own */
  value?: AgentSettingsValue;
  defaultValue?: AgentSettingsValue;
  onValueChange?: (value: AgentSettingsValue) => void;
  /** Called by Save. Return a promise and the button spins until it settles. Until then, the save bar stays up */
  onSave?: (value: AgentSettingsValue) => void | Promise<void>;
  /** Called by Reset, after the settings go back to the last saved ones */
  onReset?: () => void;
  className?: string;
}

const LEVELS: AgentSettingsLevel[] = [
  { label: 'Ask', description: 'Asks before every change' },
  { label: 'Balanced', description: 'Asks before edits to shared files' },
  { label: 'Autopilot', description: 'Works alone, asks only before publishing' }
];
const CAPS = [1, 2, 5, 10, 20, 50];
const same = (a: AgentSettingsValue, b: AgentSettingsValue) => JSON.stringify(a) === JSON.stringify(b);

/** How much the agent may do alone. Any change brings up a save bar, which saves or resets them. */
export function AgentSettings({
  levels = LEVELS, toggles = [], caps = CAPS, formatCap = n => '$' + n, capLabel = 'Spend cap per run', capDetail = 'Pauses and asks when reached',
  value, defaultValue, onValueChange, onSave, onReset, className
}: AgentSettingsProps) {
  const [v, setV] = useControllable(value, defaultValue ?? { autonomy: 1, toggles: {}, cap: caps[Math.min(2, caps.length - 1)], instructions: '' }, onValueChange);
  // what the save bar compares against: the settings as they were last saved
  const [saved, setSaved] = useState(v);
  const [phase, setPhase] = useState<'idle' | 'saving' | 'saved'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const dirty = !same(v, saved) || phase !== 'idle';
  // when the bar of unsaved changes hides with the focus in it, the focus goes to the top of the form instead of the page
  const root = useRef<HTMLDivElement>(null), bar = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => { if (!dirty && bar.current?.contains(document.activeElement)) root.current?.querySelector<HTMLElement>('[aria-checked="true"], button')?.focus({ preventScroll: true }); }, [dirty]);

  const n = levels.length, a = Math.max(0, Math.min(n - 1, v.autonomy));
  const ci = Math.max(0, caps.indexOf(v.cap));
  const set = (patch: Partial<AgentSettingsValue>) => setV({ ...v, ...patch });
  const save = async () => {
    if (phase !== 'idle') return;
    setPhase('saving');
    try { await onSave?.(v); } catch { setPhase('idle'); return; }
    setSaved(v); setPhase('saved');
    timer.current = setTimeout(() => setPhase('idle'), 700);
  };
  const reset = () => { setV(saved); onReset?.(); };

  return (
    <div data-dm="" ref={root} className={cx('dm-asx dm-panel', dirty && 'dm-dirty', className)}>
      <div className="dm-asx-r dm-asx-col">
        <div className="dm-asx-l"><b>Autonomy</b><Swap className="dm-muted dm-asx-ad">{levels[a]?.description ?? ''}</Swap></div>
        <div className="dm-asx-steps" role="radiogroup" aria-label="Autonomy" style={n === 3 ? undefined : { gridTemplateColumns: `repeat(${n},1fr)` }}>
          <span className="dm-asx-knob" style={{ left: `calc(3px + ${a} * (100% - 6px) / ${n})`, ...(n === 3 ? {} : { width: `calc((100% - 6px) / ${n})` }) }} />
          {levels.map((l, i) => <button key={l.label} type="button" role="radio" aria-checked={i === a} onClick={() => set({ autonomy: i })}>{l.label}</button>)}
        </div>
      </div>
      {toggles.map(t => (
        <div key={t.key} className="dm-asx-r">
          <div className="dm-asx-l"><b>{t.label}</b>{t.detail && <span className="dm-muted">{t.detail}</span>}</div>
          <button type="button" className="dm-toggle" role="switch" aria-checked={!!v.toggles[t.key]} aria-label={t.label}
            onClick={() => set({ toggles: { ...v.toggles, [t.key]: !v.toggles[t.key] } })} />
        </div>
      ))}
      <div className="dm-asx-r">
        <div className="dm-asx-l"><b>{capLabel}</b>{capDetail && <span className="dm-muted">{capDetail}</span>}</div>
        <div className="dm-asx-cap">
          <button type="button" className="dm-ib dm-fill dm-asx-m" aria-label="Lower cap" onClick={() => set({ cap: caps[Math.max(0, ci - 1)] })}><Icon name="minus" size="xs" /></button>
          <Swap className="dm-num dm-asx-v">{formatCap(v.cap)}</Swap>
          <button type="button" className="dm-ib dm-fill dm-asx-p" aria-label="Raise cap" onClick={() => set({ cap: caps[Math.min(caps.length - 1, ci + 1)] })}><Icon name="plus" size="xs" /></button>
        </div>
      </div>
      <div className="dm-asx-r dm-asx-col">
        <div className="dm-asx-l"><b>Instructions</b></div>
        <textarea className="dm-asx-ta" rows={2} spellCheck={false} aria-label="Instructions" value={v.instructions} onChange={e => set({ instructions: e.target.value })} />
      </div>
      <div ref={bar} className="dm-asx-bar" inert={!dirty} aria-hidden={!dirty}>
        <span>Unsaved changes</span>
        <button type="button" className="dm-pill dm-ghost dm-sm dm-asx-rs" onClick={reset}>Reset</button>
        <button type="button" className="dm-pill dm-accent dm-sm dm-asx-sv" onClick={save}>
          {phase === 'saving' ? <Spin /> : phase === 'saved' ? <><Icon name="check" size="xs" />Saved</> : 'Save'}
        </button>
      </div>
    </div>
  );
}
