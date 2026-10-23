# Model picker

> Pick a model by speed, quality and cost, and how hard it thinks.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/model-picker

## Install

```sh
npx designme add model-picker          # HTML, CSS and JS, with the shared core
npx designme add model-picker --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Model picker is the control a person uses to choose which model answers in a chat, and how hard it thinks first. Each model shows its speed, quality and cost as five-step meters with the real figures on hover, and the thinking effort sits underneath in a small dropdown. When the picked model can't take the request, the picker says why and offers a way out.

### When to use it

- When people choose between models that trade speed, quality and cost, and should see those trade-offs before they pick.
- When a model can think before it answers and people should set how much, with a note of what each level may spend.
- When a model can be at capacity or unavailable, and you want to offer a wait or a close match instead of an error.
- When the choice applies to one chat and people need a quiet confirmation of what is set.

### What it does

- Each model row has a coloured tile, a name, a one-line `note`, and three five-step meters for `speed`, `quality` and `cost`. `speedDetail`, `qualityDetail` and `costDetail` show on hover, like "74 tokens a second".
- The picked row is tinted and checked, and its meters turn the accent colour. The trigger above the list shows the picked model and effort, and both crossfade when they change.
- A model's `status` can be `checking`, which spins beside its name, or `busy`, which turns its tile and line amber. `statusText` replaces the note, like "At capacity, about 20s wait".
- `suggestion` opens a short message under the list with its buttons, the last one filled, like Wait for Opus and Use Sonnet on high. It opens and closes by its height.
- The thinking effort is a small dropdown under the list. `efforts` defaults to Off, Low, Medium and High, each with a line shown in the menu and under "Thinking", like "Up to 8k thinking tokens".
- `note` adds a confirmation with a green check under the picker. The trigger opens and closes the list.

### Accessibility

- The models form a radio group labelled "Model". Each row is a button with `role="radio"` and `aria-checked`, and only the picked one is in the tab order.
- Arrow keys move to the next or previous model and pick it, wrapping at the ends.
- The trigger has `aria-expanded`. Escape closes the list and moves the focus back to the trigger.
- The thinking effort is a menu button with `aria-haspopup` and `aria-expanded`; its levels are `menuitemradio` items with `aria-checked`. The suggestion and the confirmation are announced as they change.

## Usage in React

```tsx
import { ModelPicker } from '@/components/designme/model-picker/ModelPicker';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ModelPicker, type ModelOption } from './ModelPicker';
import { useStory, useWait } from '../lib/useScript';

/* ---------- Model picker: ask for Opus, find it at capacity, and take a close match on high thinking ---------- */
// the same three models and figures as Model compare: tokens a second, and a typical reply's price with no thinking
const BASE = [
  { id: 'opus', name: 'Opus 5.5', color: 'var(--dm-c2)', note: 'Deepest reasoning, slower', speed: 2, quality: 5, cost: 5, tps: 38, price: .021 },
  { id: 'sonnet', name: 'Sonnet 5.5', color: 'var(--dm-c1)', note: 'Balanced, the default for design work', speed: 4, quality: 4, cost: 2, tps: 74, price: .006 },
  { id: 'haiku', name: 'Haiku 5.5', color: 'var(--dm-c3)', note: 'Fastest, for quick edits', speed: 5, quality: 3, cost: 1, tps: 142, price: .001 }
];

export default function ModelPickerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [value, setValue] = useState('sonnet');
  const [effort, setEffort] = useState('Medium');
  const [open, setOpen] = useState(true);
  const [opus, setOpus] = useState<{ status?: ModelOption['status']; text?: string }>({});
  // Opus is at capacity for this long, in seconds; 0 once you've waited it out
  const [busy, setBusy] = useState(20);
  const [offer, setOffer] = useState(false);
  const [note, setNote] = useState<string>();

  const set = (id: string, eff = effort) => { setValue(id); setOffer(false); setNote(`Set for this chat: ${BASE.find(m => m.id === id)!.name}, ${eff.toLowerCase()} thinking`); };
  // picking a model checks it can take the request first; a busy one offers a wait, or a close match that starts now
  const pick = async (id: string) => {
    if (id !== 'opus' || !busy) return set(id);
    setNote(undefined); setOpus({ status: 'checking', text: 'Checking it can take this chat' });
    await wait(1000);
    setOpus({ status: 'busy', text: `At capacity, about ${busy}s wait` }); setOffer(true);
  };
  const waitForOpus = async () => {
    setOffer(false);
    for (let w = busy; w > 0; w--) { setOpus({ status: 'busy', text: `Starts in ${w}s` }); await wait(1000); }
    setBusy(0); setOpus({}); set('opus');
  };

  const models: ModelOption[] = BASE.map(x => ({
    id: x.id, name: x.name, color: x.color, note: x.note, speed: x.speed, quality: x.quality, cost: x.cost,
    speedDetail: `${x.tps} tokens a second`, qualityDetail: `Quality ${x.quality} of 5`, costDetail: `$${x.price.toFixed(3)} a reply`,
    ...(x.id === 'opus' ? { status: opus.status, statusText: opus.text } : {})
  }));

  // the preview's story: the person asks for Opus, reads why it can't start, and takes the close match
  useStory(ref, async ({ wait, press }) => {
    await wait(5500); press('.dm-mpk-o');
    await wait(1000 + 2500 + 900); press('.dm-mpk-sga .dm-ink');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ModelPicker models={models} value={value} onValueChange={id => void pick(id)} effort={effort} onEffortChange={e => { setEffort(e); setNote(undefined); }}
        open={open} onOpenChange={setOpen} note={note}
        suggestion={offer ? {
          text: `Opus 5.5 is at capacity for about ${busy}s. Sonnet 5.5 on high thinking comes close on long reviews and starts now.`,
          actions: [{ label: 'Wait for Opus', onClick: () => void waitForOpus() }, { label: 'Use Sonnet on high', onClick: () => { setEffort('High'); set('sonnet', 'High'); } }]
        } : undefined} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `models` | `ModelOption[]` |  |
| `value` (optional) | `string` | The picked model's id. Leave it out to let the list hold its own |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(id: string) => void` | Called when a row is picked, busy or not, so you can check the model first |
| `efforts` (optional) | `ThinkingEffort[]` | Defaults to Off, Low, Medium and High |
| `effort` (optional) | `string` |  |
| `defaultEffort` (optional) | `string` |  |
| `onEffortChange` (optional) | `(effort: string) => void` |  |
| `suggestion` (optional) | `{ text: ReactNode; actions: { label: string; onClick: () => void }[] }` | A way out when the picked model can't take the request: a short text and its buttons, the last one filled |
| `note` (optional) | `string` | The confirmation under the picker, like "Set for this chat: Sonnet 5.5, high thinking". Shown with a green check |
| `label` (optional) | `ReactNode` | The label beside the trigger. Defaults to "Model for this chat" |
| `open` (optional) | `boolean` | Whether the list is open. Leave it out to let the trigger and Escape open and close it |
| `defaultOpen` (optional) | `boolean` |  |
| `onOpenChange` (optional) | `(open: boolean) => void` |  |
| `className` (optional) | `string` |  |

## Questions

**Does it check whether a model is available?**

No. It calls `onValueChange` with the id of any row that is picked, busy or not. Check the model in your own code, set its `status` to `checking` and then `busy` or `ready`, and pass a `suggestion` if it can't start.

**Where do the meters come from?**

From you. Give each model `speed`, `quality` and `cost` from 1 to 5, and the figures behind them in the detail props, like "74 tokens a second" or "$0.006 a reply".

**Can I use my own effort levels?**

Yes. Pass `efforts` as a list of `{ label, detail }`. The picked one is `effort` or `defaultEffort`, which defaults to the third in the list, or the last if there are fewer.

**Can it start closed?**

Yes. It opens by default; set `defaultOpen={false}`, or control it with `open` and `onOpenChange`.

## Source

`ModelPicker.tsx`, as `npx designme add model-picker --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Fold, Spin, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
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
  models, value, defaultValue, onValueChange, efforts = EFFORTS, effort, defaultEffort, onEffortChange, suggestion, note,
  label = 'Model for this chat', open, defaultOpen = true, onOpenChange, className
}: ModelPickerProps) {
  const [cur, setCur] = useControllable(value, defaultValue ?? models[0]?.id ?? '', onValueChange);
  const [eff, setEff] = useControllable(effort, defaultEffort ?? efforts[Math.min(2, efforts.length - 1)]?.label ?? '', onEffortChange);
  // thinking effort is a small dropdown under the list
  const effMenu = usePopover({ align: 'end' });
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
            <button {...effMenu.trigger} type="button" className="dm-mpk-eb" aria-label="Thinking effort"><Swap className="dm-mpk-ev">{eff}</Swap><Icon name="chev-d" size="xs" /></button>
          </div>
        </div>
      </Fold>
      <div {...effMenu.pop} className={cx(effMenu.pop.className, 'dm-mpk-pop')} role="menu" aria-label="Thinking effort">
        {efforts.map(e => (
          <button key={e.label} type="button" className="dm-mi" role="menuitemradio" aria-checked={e.label === eff} onClick={() => { setEff(e.label); effMenu.closeSoon(); }}>
            <span>{e.label}{e.detail && <span className="dm-d">{e.detail}</span>}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
      <p className="dm-mpk-note dm-muted" aria-live="polite">
        {note && <><Icon name="ok" size="xs" /><span key={noteKey} {...enter()}>{note}</span></>}
      </p>
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with a live preview and versions.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
