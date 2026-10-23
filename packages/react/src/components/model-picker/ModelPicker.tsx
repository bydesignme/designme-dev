'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Fold, Seg, Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './model-picker.css';

/** One model in the list */
export interface ModelOption {
  id: string;
  /** Like "Sonnet 5.5" */
  name: string;
  /** The letter in its coloured tile. Defaults to the first letter of the name */
  mark?: string;
  /** The tile's colour, like "var(--dm-c1)" */
  color?: string;
  /** The quiet line under the name, like "Balanced, the default for design work" */
  note?: string;
  /** Speed, quality and cost, each from 1 to 5. For cost, 5 is the most expensive */
  speed: number;
  quality: number;
  cost: number;
  /** What each meter shows on hover, like "74 tokens a second", "Quality 4 of 5", "$0.006 a reply" */
  speedDetail?: string;
  qualityDetail?: string;
  costDetail?: string;
  /** checking spins beside the name; busy turns the row amber. Both replace the note with `statusText` */
  status?: 'ready' | 'checking' | 'busy';
  /** Like "At capacity, about 20s wait" */
  statusText?: string;
}

/** A thinking effort: its label, and the line shown under "Thinking" when it is picked */
export interface ThinkingEffort {
  label: string;
  detail?: string;
}

export interface ModelPickerProps {
  models: ModelOption[];
  /** The picked model's id. Leave it out to let the list hold its own */
  value?: string;
  defaultValue?: string;
  /** Called when a row is picked, busy or not, so you can check the model first */
  onValueChange?: (id: string) => void;
  /** Defaults to Off, Low, Medium and High */
  efforts?: ThinkingEffort[];
  effort?: string;
  defaultEffort?: string;
  onEffortChange?: (effort: string) => void;
  /** The line at the foot of the list, like what the next reply will take */
  estimate?: ReactNode;
  /** A way out when the picked model can't take the request: a short text and its buttons, the last one filled */
  suggestion?: { text: ReactNode; actions: { label: string; onClick: () => void }[] };
  /** The confirmation under the picker, like "Set for this chat: Sonnet 5.5, high thinking". Shown with a green check */
  note?: string;
  /** The label beside the trigger. Defaults to "Model for this chat" */
  label?: ReactNode;
  /** Whether the list is open. Leave it out to let the trigger and Escape open and close it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

const EFFORTS: ThinkingEffort[] = [
  { label: 'Off', detail: 'Answers straight away' }, { label: 'Low', detail: 'Up to 2k thinking tokens' },
  { label: 'Medium', detail: 'Up to 8k thinking tokens' }, { label: 'High', detail: 'Up to 24k thinking tokens' }
];

const Meter = ({ value, tip }: { value: number; tip?: string }) => {
  const bars = <span className="dm-mpk-m" aria-hidden={tip ? undefined : true}>{[1, 2, 3, 4, 5].map(k => <i key={k} className={k <= value ? 'dm-on' : undefined} />)}</span>;
  return tip ? <Tip label={tip}>{bars}</Tip> : bars;
};

/** Choose the model for a chat by speed, quality and cost, and how hard it thinks, with what the next reply will take. */
export function ModelPicker({
  models, value, defaultValue, onValueChange, efforts = EFFORTS, effort, defaultEffort, onEffortChange, estimate, suggestion, note,
  label = 'Model for this chat', open, defaultOpen = true, onOpenChange, className
}: ModelPickerProps) {
  const [cur, setCur] = useControllable(value, defaultValue ?? models[0]?.id ?? '', onValueChange);
  const [eff, setEff] = useControllable(effort, defaultEffort ?? efforts[Math.min(2, efforts.length - 1)]?.label ?? '', onEffortChange);
  const [isOpen, setOpen] = useControllable(open, defaultOpen, onOpenChange);
  const picked = models.find(m => m.id === cur) ?? models[0];
  const rows = useRef<(HTMLButtonElement | null)[]>([]);
  const trigger = useRef<HTMLButtonElement>(null);
  // the confirmation enters each time it changes
  const [noteKey, setNoteKey] = useState(0);
  useEffect(() => { if (note) setNoteKey(k => k + 1); }, [note]);

  const move = (e: KeyboardEvent) => {
    const k = ({ ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 } as Record<string, number>)[e.key]; if (!k) return;
    e.preventDefault();
    const i = (rows.current.findIndex(b => b === document.activeElement) + k + models.length) % models.length;
    rows.current[i]?.focus(); setCur(models[i].id);
  };

  return (
    <div data-dm="" className={cx('dm-mpk', className)} onKeyDown={e => { if (e.key === 'Escape' && isOpen) { setOpen(false); trigger.current?.focus(); } }}>
      <div className="dm-mpk-top">
        <span className="dm-muted dm-mpk-lb">{label}</span>
        <button ref={trigger} type="button" className="dm-mpk-tr" aria-haspopup="true" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
          <span className="dm-mpk-mk" style={{ ['--dm-mc' as string]: picked?.color }}>{picked?.mark ?? picked?.name[0]}</span>
          <Swap className="dm-mpk-nm">{picked?.name ?? ''}</Swap>
          <Swap className="dm-mpk-ef dm-muted">{eff}</Swap>
          <Icon name="chev-d" size="xs" />
        </button>
      </div>
      <Fold open={isOpen} className="dm-mpk-fold">
        <div className="dm-mpk-p dm-panel">
          <div className="dm-mpk-hd" aria-hidden="true"><span /><span /><span>Speed</span><span>Quality</span><span>Cost</span></div>
          <div className="dm-mpk-list" role="radiogroup" aria-label="Model" onKeyDown={move}>
            {models.map((m, i) => (
              <button key={m.id} ref={el => { rows.current[i] = el; }} type="button" role="radio" aria-checked={m.id === picked?.id} tabIndex={m.id === picked?.id ? 0 : -1}
                className={cx('dm-mpk-o', m.status === 'busy' && 'dm-busy')} onClick={() => setCur(m.id)}>
                <span className="dm-mpk-mk" style={{ ['--dm-mc' as string]: m.color }}>{m.mark ?? m.name[0]}</span>
                <span className="dm-t">
                  <b>{m.name}<span className="dm-ck">{m.status === 'checking' ? <Spin /> : <Icon name="check" size="xs" />}</span></b>
                  <Swap className="dm-d">{(m.status && m.status !== 'ready' && m.statusText) || m.note || ''}</Swap>
                </span>
                <Meter value={m.speed} tip={m.speedDetail} /><Meter value={m.quality} tip={m.qualityDetail} /><Meter value={m.cost} tip={m.costDetail} />
              </button>
            ))}
          </div>
          <Fold open={!!suggestion}>
            <div className="dm-mpk-sg" aria-live="polite">
              <p className="dm-mpk-sgt">{suggestion?.text}</p>
              <div className="dm-mpk-sga">
                {suggestion?.actions.map((a, i, all) => <button key={a.label} type="button" className={cx('dm-pill dm-sm', i === all.length - 1 ? 'dm-ink' : 'dm-ghost')} onClick={a.onClick}>{a.label}</button>)}
              </div>
            </div>
          </Fold>
          <div className="dm-mpk-th">
            <div className="dm-mpk-thh"><b><Icon name="brain" size="xs" />Thinking</b><Swap className="dm-muted dm-mpk-thd">{efforts.find(e => e.label === eff)?.detail ?? ''}</Swap></div>
            <Seg label="Thinking effort" value={eff} onChange={setEff} options={efforts.map(e => ({ value: e.label, label: e.label }))} className="dm-mpk-seg" />
          </div>
          {estimate !== undefined && <div className="dm-mpk-f"><span className="dm-mpk-est dm-num">{estimate}</span></div>}
        </div>
      </Fold>
      <p className="dm-mpk-note dm-muted" aria-live="polite">
        {note && <><Icon name="ok" size="xs" /><span key={noteKey} {...enter()}>{note}</span></>}
      </p>
    </div>
  );
}
