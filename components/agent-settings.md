# Agent settings

> How much the agent may do alone, with a save bar for changes.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/agent-settings

## Install

```sh
npx designme add agent-settings          # HTML, CSS and JS, with the shared core
npx designme add agent-settings --react  # React 19 component and its CSS
npx designme add agent-settings --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/agent-settings.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/agent-settings.json  # Astro
```

## About

A settings panel for how much an agent may do on its own: an autonomy scale, on/off switches, a spend cap per run and free-text instructions. Any change brings up an "Unsaved changes" bar with Save and Reset, so people can review before the agent's behaviour changes.

### When to use it

- When people need to decide whether the agent asks first or works alone.
- When you want to cap what one agent run may spend.
- When standing instructions for the agent should live next to its other settings.
- When several settings changes should be reviewed and saved together.

### What it does

- An autonomy scale built from `levels` (Ask, Balanced and Autopilot by default), with the picked level's description shown under the heading.
- One switch per entry in `toggles`, each with a label and an optional detail line.
- A spend cap stepped up and down through the amounts in `caps`, shown with `formatCap`.
- An instructions text box that is part of the same value.
- A save bar that appears whenever the value differs from the last saved one. Save calls `onSave`, and if it returns a promise the button spins until it settles; Reset goes back to the last saved settings and calls `onReset`.
- Works controlled through `value` and `onValueChange`, or holds its own state with `defaultValue`.

### Accessibility

- The autonomy scale is a role="radiogroup" labelled "Autonomy", and each step is role="radio" with aria-checked.
- Each toggle is role="switch" with aria-checked and its label as aria-label.
- The cap buttons are labelled "Lower cap" and "Raise cap", and the text box is labelled "Instructions".
- The save bar is inert and aria-hidden while there is nothing to save. If it hides with the focus in it, after Save or Reset, the focus moves to the autonomy scale.

## Usage in React

```tsx
import { AgentSettings } from '@/components/designme/agent-settings/AgentSettings';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { AgentSettings, type AgentSettingsValue } from './AgentSettings';
import { useStory } from '../lib/useScript';

/* ---------- Agent settings: Slack summaries get switched on, and the save bar comes up ---------- */
export default function AgentSettingsDemo() {
  const [value, setValue] = useState<AgentSettingsValue>({
    autonomy: 1, toggles: { memory: true, slack: false }, cap: 5, instructions: 'Use our tokens only. Keep copy short and friendly.'
  });
  const ref = useRef<HTMLDivElement>(null);
  // the preview flips one switch on its own, unless you take over first
  useStory(ref, async ({ wait }) => {
    await wait(1400);
    setValue(v => ({ ...v, toggles: { ...v.toggles, slack: !v.toggles.slack } }));
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AgentSettings value={value} onValueChange={setValue}
        toggles={[{ key: 'memory', label: 'Use team memory', detail: 'Brand rules and past decisions' }, { key: 'slack', label: 'Post a summary in Slack', detail: '#design, after each run' }]}
        onSave={() => new Promise<void>(res => setTimeout(res, 600))} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `levels` (optional) | `AgentSettingsLevel[]` | The autonomy scale. Defaults to Ask, Balanced and Autopilot |
| `toggles` (optional) | `AgentSettingsToggle[]` |  |
| `caps` (optional) | `number[]` | The amounts the spend cap steps through with − and + |
| `formatCap` (optional) | `(cap: number) => string` | How the cap reads. Defaults to "$5" |
| `capLabel` (optional) | `string` |  |
| `capDetail` (optional) | `string` |  |
| `value` (optional) | `AgentSettingsValue` | The settings. Leave it out to let the panel hold its own |
| `defaultValue` (optional) | `AgentSettingsValue` |  |
| `onValueChange` (optional) | `(value: AgentSettingsValue) => void` |  |
| `onSave` (optional) | `(value: AgentSettingsValue) => void \| Promise<void>` | Called by Save. Return a promise and the button spins until it settles. Until then, the save bar stays up |
| `onReset` (optional) | `() => void` | Called by Reset, after the settings go back to the last saved ones |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import AgentSettings from '../components/designme/agent-settings/AgentSettings.astro';
---
<AgentSettings />
<AgentSettings data-style="soft" class="my-class" />
```
It plays its demo; change `agent-settings.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**What happens if saving fails?**

If the promise returned by `onSave` rejects, the button goes back to Save and the save bar stays up, because the settings still differ from the last saved ones.

**Can I change the autonomy levels?**

Yes. Pass `levels` with a label and description for each step. The scale lays out as many steps as you give it, and `autonomy` in the value is the index of the picked one.

**How do I add my own on/off settings?**

Pass `toggles` with a `key`, `label` and optional `detail` for each. Their state lives in `value.toggles`, keyed by `key`.

**Can the spend cap use other amounts or a currency?**

Yes. `caps` sets the amounts the minus and plus buttons step through, and `formatCap` sets how the amount reads. `capLabel` and `capDetail` change the text beside it.

## Source

`AgentSettings.tsx`, as `npx designme add agent-settings --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Spin, Swap } from '../lib/motion';
import '../designme.css';
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
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md): A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.
- [Step inspector](https://designme.dev/components/step-inspector.md): The settings of one step in an agent workflow, in sections that fold.
- [Data picker](https://designme.dev/components/data-picker.md): Map a field from earlier steps into a step's input.
- [Run drawer](https://designme.dev/components/run-drawer.md): A workflow's run under its canvas: the steps, the log and the data.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent builder](https://designme.dev/components/agent-builder.md): Describe an agent in a sentence and it drafts the rest: who it is, what it may do, what it knows, when it runs. Test it, save it, publish it.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
