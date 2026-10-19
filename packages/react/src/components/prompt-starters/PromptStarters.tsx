'use client';
import { useEffect, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Tip } from '../../lib/motion';
import '../../designme.css';
import './prompt-starters.css';

export type StarterTone = 'blue' | 'purple' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface Starter {
  icon: IconName;
  /** Colours the icon */
  tone?: StarterTone;
  /** A few words, like "Audit a page" */
  title: string;
  /** One quiet line under the title */
  description: string;
  /** The full prompt it writes into the field when picked */
  prompt: string;
}

export interface PromptStartersProps {
  /** The starters to show, two to a row. Pass a new set (from onShuffle) and they stagger in again */
  starters: Starter[];
  /** The title of the picked starter. Leave it out to let the cards pick it */
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (title: string | null) => void;
  /** Called with the prompt when the person presses Send */
  onSend?: (prompt: string) => void;
  /** Adds a Shuffle button under the field. Swap in another set of starters when it is called */
  onShuffle?: () => void;
  placeholder?: string;
  /** Shown in the field once the prompt is sent */
  sentLabel?: string;
  className?: string;
}

const TONE: Record<StarterTone, string> = { blue: 'pb', purple: 'pl', green: 'pm', orange: 'pp', red: 'pr', yellow: 'py', pink: 'pk', teal: 'pt' };

/** Suggested first prompts as cards. Picking one writes its prompt into the field, word by word. */
export function PromptStarters({ starters, value, defaultValue = null, onValueChange, onSend, onShuffle, placeholder = 'Pick a starter or type your own', sentLabel = 'Sent to the agent', className }: PromptStartersProps) {
  const [picked, setPicked] = useControllable(value, defaultValue, onValueChange);
  const reduce = useReducedMotion();
  const set = starters.map(s => s.title).join('\u0000');
  // what the field shows: the picked prompt as it is typed, or the line after sending
  const [field, setField] = useState<{ key: number; words: string[]; sent: boolean } | null>(null);
  const [typed, setTyped] = useState(0);

  const pick = (s: Starter) => {
    setPicked(s.title);
    setField(f => ({ key: (f?.key ?? 0) + 1, words: s.prompt.split(' '), sent: false }));
    setTyped(0);
  };
  // a word every 40ms
  useEffect(() => {
    if (!field || field.sent || typed >= field.words.length) return;
    const t = setTimeout(() => setTyped(n => n + 1), typed === 0 ? 0 : reduce ? 0 : 40);
    return () => clearTimeout(t);
  }, [field, typed, reduce]);
  // a new set of starters clears the field
  const [shown, setShown] = useState(set);
  if (shown !== set) { setShown(set); setField(null); setTyped(0); }
  useEffect(() => { if (picked !== null && !starters.some(s => s.title === picked)) setPicked(null); }, [set]); // eslint-disable-line react-hooks/exhaustive-deps

  const send = () => {
    const s = starters.find(x => x.title === picked); if (!s || !field || field.sent) return;
    onSend?.(s.prompt);
    setField(f => ({ key: (f?.key ?? 0) + 1, words: [sentLabel], sent: true }));
    setPicked(null);
  };
  const ready = !!field && !field.sent && picked !== null;

  return (
    <div data-dm="" className={cx('dm-psx', className)}>
      <div className="dm-psx-grid" key={set}>
        {starters.map((s, i) => {
          const e = enter(i * 60), tone = s.tone && TONE[s.tone];
          return (
            <button type="button" key={s.title} className={cx('dm-psx-c', e.className, picked === s.title && 'dm-on')} style={e.style} aria-pressed={picked === s.title} onClick={() => pick(s)}>
              <span className="dm-psx-ic" style={tone ? { color: `var(--dm-${tone})` } : undefined}><Icon name={s.icon} /></span>
              <b>{s.title}</b>
              <span className="dm-d">{s.description}</span>
            </button>
          );
        })}
      </div>
      <div className={cx('dm-psx-in', field && 'dm-has')}>
        <span className="dm-psx-ph">{placeholder}</span>
        <span className="dm-psx-tx" key={field?.key}>
          {field?.sent ? <span className="dm-w">{field.words[0]}</span> : field?.words.slice(0, typed).map((w, i) => <span key={i} className="dm-w">{w} </span>)}
        </span>
        <Tip label="Send">
          <button type="button" className="dm-psx-go" aria-label="Send" disabled={!ready} onClick={send}><Icon name="up" /></button>
        </Tip>
      </div>
      {onShuffle && <button type="button" className="dm-pill dm-ghost dm-sm dm-psx-sh" onClick={onShuffle}><Icon name="refresh" size="xs" />Shuffle</button>}
    </div>
  );
}
