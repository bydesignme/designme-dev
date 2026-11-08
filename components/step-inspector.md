# Step inspector

> The settings of one step in an agent workflow, in sections that fold.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/step-inspector

## Install

```sh
npx designme add step-inspector          # HTML, CSS and JS, with the shared core
npx designme add step-inspector --react  # React 19 component and its CSS
npx designme add step-inspector --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/step-inspector.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/step-inspector.json  # Astro
```

## About

Step inspector is the settings panel for one step of an agent workflow. Its head shows the step's kind as a coloured tile, its name, which you can edit in place, where it sits in the workflow, and Test and More. Under it, sections fold open and shut: what the step does, the data it reads from earlier steps, what it hands on and what happens if it fails. Data mapped from an earlier step shows as a token, the step and then its field, and data that no earlier step gives is flagged in red.

### When to use it

- Beside a workflow canvas, for the step someone has picked, in an automation builder or an agent workflow editor.
- When steps of different kinds need different settings: a model and instructions for an AI step, a rule for a branch, the people who approve for an approval.
- When a step reads data from earlier steps and people need to see where each value comes from, and which ones are broken.
- When people set retries and time limits for steps that call models, tools or other apps.

### What it does

- The tile says the kind of step in colour, the same everywhere a step shows: the trigger orange, AI steps violet, tools teal, app steps and outputs blue, a branch yellow, a wait pink and an approval green. Every line and edge stays grey.
- The name is a quiet field: click it, type, and Enter or a click elsewhere keeps it; Escape (HTML) puts the old name back. More opens Rename and Turn off, and a step that is off shows an Off tag after its name.
- Test runs the step on its own. Its play icon turns while it runs, and the line under the name says how it went, in green when it worked, then goes back to the kind and position.
- Sections fold from their heads: Setup (or Takes Yes when, Who approves), Inputs, Output and If it fails (or If nobody answers). Output and If it fails start shut. Inputs says how many fields are mapped, or how many are missing, in red.
- An AI step has its model, its instructions and its tools. The instructions are text with mapped fields inline as tokens; Insert data opens the fields of the earlier steps, grouped by step, each with its type in colour and a sample, and puts the one you pick where the cursor was. Tools are chips with a remove button, and + adds one from a menu.
- Inputs map each name to a field of an earlier step. A token's button opens the same fields to change it. A field from a step that is no longer before this one turns red, with a line that says where it went wrong; picking a field fixes it.
- Output lists what the step hands on, each field with its type as a coloured chip (text blue, numbers green, lists orange, objects pink, yes or no yellow, dates teal) and a sample value.
- If it fails holds a retries stepper from 0 to 5, the wait between tries (2s each or doubling), a time limit and what happens if it still fails. Each choice is a field-like button with its menu.
- A branch has its rule (a mapped value, a comparison and a number) and where the Yes and No paths go. An approval has the people who approve as chips with their initials, where they are asked, what they see and what happens if nobody answers in time.
- On designme.dev the switch under the demo shows three steps, an AI step, a branch and an approval. The HTML install ships the switch, the three steps and their sample data; change the data in its script. In React, pass the step and the steps before it, and `onChange` gets the whole step back after every change.

### Accessibility

- Each section head is a button with `aria-expanded` and `aria-controls`; a shut section is hidden, so Tab passes over it.
- Test, More, the remove buttons and the add buttons are labelled ("Test this step", "Remove Company lookup", "Add a person") and show tooltips. Choices say their name and value, like "Model: Sonnet 5.5".
- A token's button is labelled with the field and where it comes from, and a flagged one adds that no earlier step gives it.
- The menus are menus: the arrows move through them and wrap, Enter picks, and Escape closes them and gives the focus back to their button. The picked option is `aria-checked`.
- The instructions are a multi-line `textbox` labelled Instructions. Enter starts a new line; the tokens in it can't be typed into.
- The retries count is a polite live region, and the stepper's buttons turn `aria-disabled` at 0 and 5. A polite live region (HTML) says what each change did, like "email now reads Demo request form › email".
- With reduced motion the sections and tokens appear without their entrance, and Test's icon holds still.

## Usage in React

```tsx
import { StepInspector } from '@/components/designme/step-inspector/StepInspector';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { StepInspector, type StepConfig, type StepPerson, type StepSource, type StepTool } from './StepInspector';
import { Seg } from '../lib/motion';
import { Demo } from '../lib/Demo';
import { useStory } from '../lib/useScript';

/* ---------- Step inspector: a field goes into the instructions, the input that reads a step that is gone is fixed, the step
   gets a second retry, then a branch's rule and an approval with a person added ---------- */
const FORM: StepSource = { id: 'form', title: 'Demo request form', kind: 'trigger', icon: 'file-text', fields: [{ name: 'name', type: 'text', sample: 'Priya Shah' }, { name: 'email', type: 'text', sample: 'priya@corvid.io' }, { name: 'company', type: 'text', sample: 'Corvid Analytics' }, { name: 'seats', type: 'number', sample: '240' }] };
const LOOKUP: StepSource = { id: 'lookup', title: 'Company lookup', kind: 'tool', icon: 'globe', fields: [{ name: 'employees', type: 'number', sample: '420' }, { name: 'industry', type: 'text', sample: 'Analytics software' }, { name: 'funding', type: 'text', sample: 'Series B' }] };
const RESEARCH: StepSource = { id: 'research', title: 'Research and score', kind: 'ai', icon: 'spark', fields: [{ name: 'score', type: 'number', sample: '84' }, { name: 'tier', type: 'text', sample: 'Enterprise' }, { name: 'reasons', type: 'list', sample: '3 reasons' }, { name: 'company', type: 'object', sample: '{ 5 fields }' }] };
const REPLY: StepSource = { id: 'reply', title: 'Draft a reply', kind: 'ai', icon: 'edit', fields: [{ name: 'subject', type: 'text', sample: 'Your demo with Fernhill' }, { name: 'body', type: 'text', sample: 'Hi Priya, thanks for writing' }] };
const PEOPLE: StepPerson[] = [{ id: 'MK', name: 'Maya Kim', initials: 'MK', color: 'var(--dm-av-l)' }, { id: 'TR', name: 'Theo Reed', initials: 'TR', color: 'var(--dm-av-t)' }, { id: 'AN', name: 'Ana Novak', initials: 'AN', color: 'var(--dm-av-p)' }, { id: 'JB', name: 'Jonah Brooks', initials: 'JB', color: 'var(--dm-av-m)' }];
const TOOLS: StepTool[] = [{ id: 'lookup', title: 'Company lookup', icon: 'globe' }, { id: 'search', title: 'Web search', icon: 'search' }, { id: 'crm', title: 'CRM lookup', icon: 'db' }];

type Kind = 'ai' | 'branch' | 'approval';
const START: Record<Kind, StepConfig> = {
  ai: { title: 'Research and score', kind: 'ai', position: 'step 2 of 7', model: 'Sonnet 5.5', tools: [TOOLS[0]],
    instructions: ['Look up ', { ref: 'form.company' }, ' and the person who wrote in. Score how well they fit our plans from 0 to 100, with three reasons.\nTheir team is ', { ref: 'lookup.employees' }, ' people.'],
    // Contact is no longer in the workflow, so this input is flagged
    inputs: [{ name: 'company', ref: 'form.company' }, { name: 'seats', ref: 'form.seats' }, { name: 'email', ref: 'contact.email' }],
    outputs: RESEARCH.fields, retries: 1, backoff: 'fixed', timeLimit: '60 seconds', onFail: 'Stop the run' },
  branch: { title: 'Good fit?', kind: 'branch', position: 'step 3 of 7', rule: { ref: 'research.score', op: 'is at least', value: 70 },
    yes: { title: 'Draft a reply', kind: 'ai', icon: 'edit' }, no: { title: 'Add to nurture list', kind: 'app', icon: 'users' }, outputs: [{ name: 'path', type: 'text', sample: 'Yes' }] },
  approval: { title: 'Rep approves', kind: 'approval', position: 'step 5 of 7', approvers: PEOPLE.slice(0, 2), askIn: 'Slack message', shows: 'reply.body', expire: '24 hours', then: 'Stop the run',
    outputs: [{ name: 'decision', type: 'text', sample: 'Approved' }, { name: 'by', type: 'text', sample: 'Maya Kim' }] }
};
const SOURCES: Record<Kind, StepSource[]> = { ai: [FORM, LOOKUP], branch: [FORM, LOOKUP, RESEARCH], approval: [FORM, LOOKUP, RESEARCH, REPLY] };

export default function StepInspectorDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<Kind>('ai');
  const [steps, setSteps] = useState(START);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<string>();
  const step = steps[kind];
  const test = () => { setTesting(true); setStatus('Testing with sample data'); setTimeout(() => { setTesting(false); setStatus('Worked in 1.4s, with sample data'); setTimeout(() => setStatus(undefined), 3200); }, 1400); };

  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-sti-ih .dm-pill');
    await wait(800); press('.dm-sti-dp.dm-open [data-ref="lookup.industry"]');
    await wait(1200); press('.dm-sti-tokb[aria-label^="email"]');
    await wait(800); press('.dm-sti-dp.dm-open [data-ref="form.email"]');
    await wait(1200); press('.dm-sti-sec:nth-last-child(1) .dm-sti-sh');
    await wait(700); press('.dm-sti-num [aria-label="More retries"]');
    await wait(1400); setKind('branch');
    await wait(2400); setKind('approval');
    await wait(1000); press('.dm-sti-add[aria-label="Add a person"]');
    await wait(700); press('.dm-sti-pk.dm-open [data-person="JB"]');
  });

  return (
    <Demo ref={ref} switcher={<Seg label="Step" value={kind} onChange={setKind} options={[{ value: 'ai', label: 'AI step' }, { value: 'branch', label: 'Branch' }, { value: 'approval', label: 'Approval' }]} />}>
      <StepInspector key={kind} step={step} sources={SOURCES[kind]} onChange={s => setSteps(x => ({ ...x, [kind]: s }))}
        onTest={test} testing={testing} status={status} statusOk={!!status && !testing} toolOptions={TOOLS} people={PEOPLE} />
    </Demo>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `step` | `StepConfig` |  |
| `sources` | `StepSource[]` | The steps before this one, in order: only their fields can be mapped |
| `onChange` (optional) | `(step: StepConfig) => void` | Every change to the step, as the whole new step |
| `onTest` (optional) | `() => void` | Adds Test, which runs the step on its own |
| `testing` (optional) | `boolean` | While the test runs: Test spins and `status` replaces the kind line |
| `status` (optional) | `string` | A line in place of the kind and position, like "Worked in 1.4s" |
| `statusOk` (optional) | `boolean` | Whether `status` is good news, in green |
| `choices` (optional) | `Partial<Record<StepChoice, { value: string; detail?: string }[]>>` | The options of each choice, in place of the built-in ones |
| `toolOptions` (optional) | `StepTool[]` | The tools an AI step can be given |
| `people` (optional) | `StepPerson[]` | The people who can approve |
| `open` (optional) | `StepSection[]` | The sections that are open. Leave it out to let the heads fold them; Output and If it fails start shut |
| `defaultOpen` (optional) | `StepSection[]` |  |
| `onOpenChange` (optional) | `(open: StepSection[]) => void` |  |
| `actions` (optional) | `ReactNode` | Extra buttons in the head, after Test and More, like a close button |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import StepInspector from '../components/designme/step-inspector/StepInspector.astro';
---
<StepInspector />
<StepInspector data-style="soft" class="my-class" />
```
It plays its demo; change `step-inspector.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I add a kind of step it doesn't show?**

Every kind has its colour and icon already. In React, a step of kind `tool`, `app` or `output` shows Inputs, Output and If it fails; `trigger` and `wait` show their Output. Add your own rows in the HTML version's script, which writes each kind's sections.

**How does it know which data is missing?**

It checks each mapped field against the steps you pass as earlier steps. A field whose step or name isn't among them is flagged. Pass only the steps that run before this one.

**Does Test run anything?**

No. In React it calls `onTest`; set `testing` while your test runs and `status` to say how it went. The HTML demo pretends to run it for 1.4 seconds.

## Source

`StepInspector.tsx`, as `npx designme add step-inspector --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Avatar, Fold, Seg, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './step-inspector.css';

/** The kinds of step, each with its colour: the trigger orange, AI steps violet, tools teal, app steps and outputs blue, a
    branch yellow, a wait pink, an approval green */
export type StepInspectorKind = 'trigger' | 'ai' | 'tool' | 'app' | 'output' | 'branch' | 'wait' | 'approval';
/** The types of data a step hands on, each with its colour: text blue, numbers green, lists orange, objects pink, yes or no
    yellow, dates teal */
export type StepFieldType = 'text' | 'number' | 'list' | 'object' | 'bool' | 'date';
export interface StepField {
  name: string;
  type: StepFieldType;
  /** A sample value, like "Priya Shah" */
  sample?: string;
}
/** An earlier step, whose fields this step can read as `"<id>.<field>"` */
export interface StepSource {
  id: string;
  title: string;
  kind: StepInspectorKind;
  icon?: IconName;
  fields: StepField[];
}
/** Instructions are text and mapped fields: `['Look up ', { ref: 'form.company' }, ' and score them.']` */
export type StepInstructionPart = string | { ref: string };
export interface StepTool { id: string; title: string; icon?: IconName }
export interface StepPerson { id: string; name: string; initials: string; color: string }
export interface StepLink { title: string; kind: StepInspectorKind; icon?: IconName }

/** One step's settings. Which ones show depends on `kind` */
export interface StepConfig {
  title: string;
  kind: StepInspectorKind;
  icon?: IconName;
  /** Where it sits, shown after the kind, like "step 2 of 7" */
  position?: string;
  /** AI steps: the model, the instructions and the tools it may call */
  model?: string;
  instructions?: StepInstructionPart[];
  tools?: StepTool[];
  /** The data the step reads, each a name and the `"<source>.<field>"` it is mapped from */
  inputs?: { name: string; ref: string }[];
  /** What the step hands on */
  outputs?: StepField[];
  /** AI, tool, app and output steps: what happens if it fails */
  retries?: number;
  backoff?: 'fixed' | 'doubling';
  timeLimit?: string;
  onFail?: string;
  /** A branch: Yes when the value at `ref` compares to `value`, and where each path goes */
  rule?: { ref: string; op: string; value: number };
  yes?: StepLink;
  no?: StepLink;
  /** An approval: who can approve, where they are asked, what they see, and what happens if nobody answers */
  approvers?: StepPerson[];
  askIn?: string;
  shows?: string;
  expire?: string;
  then?: string;
  /** A step that is turned off: runs skip it */
  off?: boolean;
}
export type StepChoice = 'model' | 'op' | 'askIn' | 'expire' | 'then' | 'timeLimit' | 'onFail';
const LABEL: Record<StepChoice, string> = { model: 'Model', op: 'Comparison', askIn: 'Ask in', expire: 'Nobody answers in', then: 'Then', timeLimit: 'Time limit', onFail: 'If it still fails' };
const CHOICES: Record<StepChoice, { value: string; detail?: string }[]> = {
  model: [{ value: 'Sonnet 5.5', detail: 'Balanced, the default' }, { value: 'Opus 5.5', detail: 'Deepest reasoning, slower' }, { value: 'Haiku 5.5', detail: 'Fastest and cheapest' }],
  op: [{ value: 'is at least' }, { value: 'is below' }, { value: 'is exactly' }],
  askIn: [{ value: 'Slack message' }, { value: 'Email' }, { value: 'In the app' }],
  expire: [{ value: '4 hours' }, { value: '24 hours' }, { value: '3 days' }],
  then: [{ value: 'Stop the run' }, { value: 'Send it anyway' }, { value: 'Ask someone else' }],
  timeLimit: [{ value: '15 seconds' }, { value: '30 seconds' }, { value: '60 seconds' }],
  onFail: [{ value: 'Stop the run' }, { value: 'Skip this step' }, { value: 'Carry on with empty data' }]
};
const KIND: Record<StepInspectorKind, string> = { trigger: 'Trigger', ai: 'AI step', tool: 'Tool', app: 'App step', output: 'Output', branch: 'Branch', wait: 'Wait', approval: 'Approval' };
const KIND_ICON: Record<StepInspectorKind, IconName> = { trigger: 'bolt', ai: 'spark', tool: 'globe', app: 'send', output: 'hash', branch: 'branch', wait: 'clock', approval: 'user' };
const TYPE_TONE: Record<StepFieldType, string> = { text: 'dm-b', number: 'dm-m', list: 'dm-p', object: 'dm-k', bool: 'dm-y', date: 'dm-t' };
export type StepSection = 'setup' | 'in' | 'out' | 'fail' | 'exp';

export interface StepInspectorProps {
  step: StepConfig;
  /** The steps before this one, in order: only their fields can be mapped */
  sources: StepSource[];
  /** Every change to the step, as the whole new step */
  onChange?: (step: StepConfig) => void;
  /** Adds Test, which runs the step on its own */
  onTest?: () => void;
  /** While the test runs: Test spins and `status` replaces the kind line */
  testing?: boolean;
  /** A line in place of the kind and position, like "Worked in 1.4s" */
  status?: string;
  /** Whether `status` is good news, in green */
  statusOk?: boolean;
  /** The options of each choice, in place of the built-in ones */
  choices?: Partial<Record<StepChoice, { value: string; detail?: string }[]>>;
  /** The tools an AI step can be given */
  toolOptions?: StepTool[];
  /** The people who can approve */
  people?: StepPerson[];
  /** The sections that are open. Leave it out to let the heads fold them; Output and If it fails start shut */
  open?: StepSection[];
  defaultOpen?: StepSection[];
  onOpenChange?: (open: StepSection[]) => void;
  /** Extra buttons in the head, after Test and More, like a close button */
  actions?: ReactNode;
  className?: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** A mapped field: the earlier step's tile, the step and the field. A field no earlier step gives is red */
function Token({ refId, sources, editable }: { refId: string; sources: StepSource[]; editable?: boolean }) {
  const [s, f] = refId.split('.'), src = sources.find(x => x.id === s);
  const ce = editable ? { contentEditable: false, 'data-ref': refId } : {};
  if (!src || !src.fields.some(x => x.name === f)) return <span className="dm-sti-tok dm-bad" {...ce}><Icon name="alert" size="xs" /><span className="dm-s">{cap(s)}</span><span className="dm-sep" aria-hidden="true">›</span><span className="dm-f">{f}</span></span>;
  return (
    <span className="dm-sti-tok" {...ce}>
      <span className="dm-sti-ti" data-k={src.kind} aria-hidden="true"><Icon name={src.icon ?? KIND_ICON[src.kind]} size="xs" /></span>
      <span className="dm-s">{src.title}</span><span className="dm-sep" aria-hidden="true">›</span><span className="dm-f">{f}</span>
    </span>
  );
}

const known = (ref: string, sources: StepSource[]) => { const [s, f] = ref.split('.'); return !!sources.find(x => x.id === s)?.fields.some(x => x.name === f); };
const nameOf = (ref: string, sources: StepSource[]) => { const [s, f] = ref.split('.'); return `${sources.find(x => x.id === s)?.title ?? cap(s)} › ${f}`; };

/** A choice: a field-like button and its menu, on the panel so a folding section can't clip it */
function Choice({ label, value, options, host, onPick }: { label: string; value: string; options: { value: string; detail?: string }[]; host: HTMLElement | null; onPick: (v: string) => void }) {
  const menu = usePopover();
  return (
    <>
      <button type="button" {...menu.trigger} className="dm-sti-sel" aria-label={`${label}: ${value}`}><Swap>{value}</Swap><Icon name="chev-d" size="xs" /></button>
      {host && createPortal(
        <div {...menu.pop} className={cx(menu.pop.className, 'dm-sti-pk')} role="menu" aria-label={label}>
          <div className="dm-ph" role="none">{label}</div>
          {options.map(o => (
            <button type="button" key={o.value} className="dm-mi" role="menuitemradio" aria-checked={o.value === value} tabIndex={-1} onClick={() => { if (o.value !== value) onPick(o.value); menu.closeSoon(); }}>
              <span>{o.value}{o.detail && <span className="dm-d">{o.detail}</span>}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
            </button>
          ))}
        </div>, host)}
    </>
  );
}

/** The fields of the earlier steps, grouped by step, each with its type and a sample; picking one maps it */
function DataMenu({ trigger, label, current, sources, host, onPick }: { trigger: (t: ReturnType<typeof usePopover>['trigger']) => ReactNode; label: string; current?: string; sources: StepSource[]; host: HTMLElement | null; onPick: (ref: string) => void }) {
  const menu = usePopover();
  return (
    <>
      {trigger(menu.trigger)}
      {host && createPortal(
        <div {...menu.pop} className={cx(menu.pop.className, 'dm-sti-dp')} role="menu" aria-label={label}>
          {sources.map(src => (
            <div key={src.id} role="group" aria-label={src.title}>
              <div className="dm-ph" role="none"><span className="dm-sti-ti" data-k={src.kind} aria-hidden="true"><Icon name={src.icon ?? KIND_ICON[src.kind]} size="xs" /></span>{src.title}</div>
              {src.fields.map(f => {
                const ref = src.id + '.' + f.name;
                return (
                  <button type="button" key={ref} className="dm-mi" role="menuitemradio" aria-checked={ref === current} tabIndex={-1} data-ref={ref} onClick={() => { onPick(ref); menu.closeSoon(); }}>
                    <span>{f.name}</span><span className={cx('dm-tag', TYPE_TONE[f.type])}>{f.type}</span><span className="dm-r">{f.sample}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </div>, host)}
    </>
  );
}

/* the instructions box holds text and tokens. It is written once from `parts`, then the browser edits it; what it says is read
   back into parts on every change, and a change from outside (a new step) writes it again. Tokens are copied from a hidden
   stock rendered by React, so they look exactly like the others */
const readParts = (el: HTMLElement): StepInstructionPart[] => {
  const out: StepInstructionPart[] = [];
  el.childNodes.forEach(n => {
    if (n.nodeType === 3) { const t = n.textContent ?? ''; if (typeof out[out.length - 1] === 'string') out[out.length - 1] += t; else out.push(t); }
    else if (n instanceof HTMLElement && n.dataset.ref) out.push({ ref: n.dataset.ref });
    else if (n.nodeName === 'BR') out.push('\n');
    else out.push('\n' + (n.textContent ?? ''));
  });
  return out;
};
const sameParts = (a: StepInstructionPart[], b: StepInstructionPart[]) => JSON.stringify(a) === JSON.stringify(b);

function Instructions({ parts, sources, host, onChange, id }: { parts: StepInstructionPart[]; sources: StepSource[]; host: HTMLElement | null; onChange: (p: StepInstructionPart[]) => void; id: string }) {
  const box = useRef<HTMLDivElement>(null), stock = useRef<HTMLSpanElement>(null), last = useRef<StepInstructionPart[] | null>(null), caret = useRef<Range | null>(null);
  const refs = [...new Set([...sources.flatMap(s => s.fields.map(f => s.id + '.' + f.name)), ...parts.flatMap(p => typeof p === 'string' ? [] : [p.ref])])];
  const tokenNode = (ref: string) => (stock.current?.querySelector(`[data-ref="${CSS.escape(ref)}"]`)?.cloneNode(true) ?? document.createTextNode(`{{${ref}}}`)) as Node;
  useEffect(() => {
    const el = box.current; if (!el || (last.current && sameParts(last.current, parts))) return;
    el.replaceChildren(...parts.map(p => typeof p === 'string' ? document.createTextNode(p) : tokenNode(p.ref)));
    last.current = parts;
  });
  useEffect(() => {
    const save = () => { const s = getSelection(); if (s && s.rangeCount && box.current?.contains(s.anchorNode)) caret.current = s.getRangeAt(0).cloneRange(); };
    document.addEventListener('selectionchange', save); return () => document.removeEventListener('selectionchange', save);
  }, []);
  const emit = () => { const el = box.current; if (!el) return; const p = readParts(el); last.current = p; onChange(p); };
  const insert = (ref: string) => {
    const el = box.current; if (!el) return;
    const t = tokenNode(ref) as HTMLElement, sp = document.createTextNode(' '); t.classList?.add('dm-new');
    const r = caret.current;
    if (r && el.contains(r.startContainer)) { r.collapse(false); r.insertNode(sp); r.insertNode(t); } else el.append(t, sp);
    emit();
  };
  return (
    <div className="dm-sti-insw">
      <div className="dm-sti-ih">
        <span className="dm-k" id={id}>Instructions</span>
        <DataMenu label="Data from earlier steps" sources={sources} host={host} onPick={insert}
          trigger={t => <button type="button" {...t} className="dm-pill dm-ghost dm-sm"><Icon name="plus" size="xs" />Insert data</button>} />
      </div>
      <div ref={box} className="dm-sti-ins" contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true" aria-labelledby={id} spellCheck={false}
        onInput={emit}
        onKeyDown={e => {
          // Enter starts a new line as plain text, so the box never fills with markup
          if (e.key !== 'Enter') return; e.preventDefault();
          const s = getSelection(); if (!s || !s.rangeCount) return; const r = s.getRangeAt(0); r.deleteContents();
          const nl = document.createTextNode('\n'); r.insertNode(nl); r.setStartAfter(nl); r.collapse(true); s.removeAllRanges(); s.addRange(r); emit();
        }} />
      <span ref={stock} hidden>{refs.map(r => <Token key={r} refId={r} sources={sources} editable />)}</span>
    </div>
  );
}

/** The settings of one step in an agent workflow: its kind in colour, its name and where it sits, Test and More, then folding
    sections for what it does, the data it reads from earlier steps, what it hands on and what happens if it fails. */
export function StepInspector({ step, sources, onChange, onTest, testing, status, statusOk, choices, toolOptions = [], people = [], open, defaultOpen = ['setup', 'in', 'exp'], onOpenChange, actions, className }: StepInspectorProps) {
  const [shown, setShown] = useControllable(open, defaultOpen, onOpenChange);
  const [host, setHost] = useState<HTMLDivElement | null>(null);
  const [uid] = useState(() => 'sti' + Math.random().toString(36).slice(2, 7));
  const more = usePopover({ align: 'end' });
  const tool = usePopover(), who = usePopover();
  const set = (patch: Partial<StepConfig>) => onChange?.({ ...step, ...patch });
  const opts = (c: StepChoice) => choices?.[c] ?? CHOICES[c];
  const toggle = (k: StepSection) => setShown(shown.includes(k) ? shown.filter(x => x !== k) : [...shown, k]);
  const k = step.kind;
  const row = (label: string, v: ReactNode, top = false) => <div className={cx('dm-sti-row', top && 'dm-top')}><span className="dm-k">{label}</span><div className="dm-v">{v}</div></div>;
  const sec = (key: StepSection, title: string, body: ReactNode, meta?: ReactNode) => (
    <div className="dm-sti-sec" key={key}>
      <button type="button" className="dm-sti-sh" aria-expanded={shown.includes(key)} aria-controls={`${uid}-${key}`} onClick={() => toggle(key)}><Icon name="chev-r" size="xs" /><span>{title}</span>{meta}</button>
      <Fold open={shown.includes(key)}><div className="dm-sti-rows" id={`${uid}-${key}`}>{body}</div></Fold>
    </div>
  );
  const choice = (c: StepChoice, value: string | undefined, pick: (v: string) => void) => <Choice label={LABEL[c]} value={value ?? opts(c)[0].value} options={opts(c)} host={host} onPick={pick} />;
  const tokB = (label: string, ref: string, pick: (r: string) => void) => (
    <DataMenu label={`${label}: pick data`} current={ref} sources={sources} host={host} onPick={pick}
      trigger={t => <button type="button" {...t} className="dm-sti-tokb" aria-label={`${label}: ${nameOf(ref, sources)}${known(ref, sources) ? '' : ', which no earlier step gives'}. Change it`}><Token refId={ref} sources={sources} /></button>} />
  );
  const note = (ref: string) => known(ref, sources) ? null : <p className="dm-sti-note">{cap(ref.split('.')[0])} isn't an earlier step any more. Pick where {ref.split('.')[1]} comes from.</p>;
  const outs = step.outputs ?? [];
  const missing = (step.inputs ?? []).filter(x => !known(x.ref, sources)).length;
  const fails = ['ai', 'tool', 'app', 'output'].includes(k);
  const link = (l?: StepLink) => l ? <span className="dm-sti-link"><span className="dm-sti-ti" data-k={l.kind} aria-hidden="true"><Icon name={l.icon ?? KIND_ICON[l.kind]} size="xs" /></span><span>{l.title}</span></span> : <span className="dm-muted">Ends the run</span>;
  const retries = step.retries ?? 0;

  return (
    <div data-dm="" ref={setHost} data-k={k} className={cx('dm-sti dm-panel', className)}>
      <div className="dm-sti-h">
        <span className="dm-sti-ti" data-k={k} aria-hidden="true"><Icon name={step.icon ?? KIND_ICON[k]} /></span>
        <span className="dm-sti-tx">
          <span className="dm-sti-nr">
            <input className="dm-sti-n" value={step.title} aria-label="Step name" maxLength={40} spellCheck={false} autoComplete="off"
              onChange={e => set({ title: e.target.value })} onBlur={e => { if (!e.target.value.trim()) set({ title: KIND[k] }); }}
              onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur(); }} />
            {step.off && <span className="dm-tag dm-sti-off">Off</span>}
          </span>
          <Swap className={cx('dm-sti-kd', statusOk && 'dm-ok')}>{status ?? `${KIND[k]}${step.position ? ', ' + step.position : ''}`}</Swap>
        </span>
        {onTest && <Tip label="Test this step"><button type="button" className={cx('dm-ib dm-sti-test', testing && 'dm-busy')} aria-label="Test this step" onClick={() => { if (!testing) onTest(); }}><Icon name={testing ? 'refresh' : 'play'} /></button></Tip>}
        <Tip label="More" off={more.open}><button type="button" {...more.trigger} className="dm-ib" aria-label="Step actions"><Icon name="more" /></button></Tip>
        {actions}
        <div {...more.pop} className={cx(more.pop.className, 'dm-sti-mm')} role="menu" aria-label="Step actions">
          <button type="button" className="dm-mi" role="menuitem" tabIndex={-1} onClick={() => { more.closeSoon(); setTimeout(() => { const i = host?.querySelector<HTMLInputElement>('.dm-sti-n'); i?.focus(); i?.select(); }, 140); }}><Icon name="edit" /><span>Rename</span></button>
          <button type="button" className="dm-mi" role="menuitem" tabIndex={-1} onClick={() => { set({ off: !step.off }); more.closeSoon(); }}><Icon name={step.off ? 'play' : 'pause'} /><span>{step.off ? 'Turn on' : 'Turn off'}</span></button>
        </div>
      </div>

      <div className="dm-sti-body">
        {k === 'ai' && sec('setup', 'Setup', <>
          {row(LABEL.model, choice('model', step.model, v => set({ model: v })))}
          <Instructions id={`${uid}-il`} parts={step.instructions ?? []} sources={sources} host={host} onChange={p => set({ instructions: p })} />
          {row('Tools', (
            <span className="dm-sti-chips">
              {(step.tools ?? []).map(t => (
                <span className="dm-sti-chip" key={t.id}>
                  <span className="dm-sti-ti" data-k="tool" aria-hidden="true"><Icon name={t.icon ?? 'globe'} size="xs" /></span><span>{t.title}</span>
                  <Tip label="Remove"><button type="button" className="dm-sti-cx" aria-label={`Remove ${t.title}`} onClick={() => set({ tools: (step.tools ?? []).filter(x => x.id !== t.id) })}><Icon name="x" size="xs" /></button></Tip>
                </span>
              ))}
              {toolOptions.length > 0 && <Tip label="Add a tool" off={tool.open}><button type="button" {...tool.trigger} className="dm-sti-add" aria-label="Add a tool"><Icon name="plus" size="xs" /></button></Tip>}
            </span>
          ), true)}
        </>)}
        {k === 'branch' && step.rule && sec('setup', 'Takes Yes when', <>
          <div className="dm-sti-rule">
            {tokB('Value', step.rule.ref, r => set({ rule: { ...step.rule!, ref: r } }))}
            {choice('op', step.rule.op, v => set({ rule: { ...step.rule!, op: v } }))}
            <input className="dm-sti-in" type="number" inputMode="numeric" min={0} max={100} value={step.rule.value} aria-label="Threshold" onChange={e => set({ rule: { ...step.rule!, value: Math.max(0, Math.min(100, +e.target.value || 0)) } })} />
          </div>
          {row('Yes', link(step.yes))}{row('No', link(step.no))}
        </>)}
        {k === 'approval' && sec('setup', 'Who approves', <>
          {row('People', (
            <span className="dm-sti-chips">
              {(step.approvers ?? []).map(p => (
                <span className="dm-sti-chip" key={p.id}>
                  <Avatar initials={p.initials} color={p.color} /><span>{p.name}</span>
                  <Tip label="Remove"><button type="button" className="dm-sti-cx" aria-label={`Remove ${p.name}`} onClick={() => { if ((step.approvers ?? []).length > 1) set({ approvers: (step.approvers ?? []).filter(x => x.id !== p.id) }); }}><Icon name="x" size="xs" /></button></Tip>
                </span>
              ))}
              {people.length > 0 && <Tip label="Add a person" off={who.open}><button type="button" {...who.trigger} className="dm-sti-add" aria-label="Add a person"><Icon name="plus" size="xs" /></button></Tip>}
            </span>
          ), true)}
          {row(LABEL.askIn, choice('askIn', step.askIn, v => set({ askIn: v })))}
          {step.shows && row('They see', tokB('They see', step.shows, r => set({ shows: r })))}
        </>)}
        {(step.inputs?.length ?? 0) > 0 && sec('in', 'Inputs', (step.inputs ?? []).map((x, i) => (
          <div key={x.name}>
            {row(x.name, tokB(x.name, x.ref, r => set({ inputs: (step.inputs ?? []).map((y, j) => j === i ? { ...y, ref: r } : y) })))}
            {note(x.ref)}
          </div>
        )), missing ? <span className="dm-tag dm-bad">{missing} missing</span> : <span className="dm-n">{step.inputs!.length} mapped</span>)}
        {k === 'approval' && sec('exp', 'If nobody answers', <>{row(LABEL.expire, choice('expire', step.expire, v => set({ expire: v })))}{row(LABEL.then, choice('then', step.then, v => set({ then: v })))}</>)}
        {sec('out', 'Output', outs.length ? outs.map(o => <div className="dm-sti-out" key={o.name}><span>{o.name}</span><span className={cx('dm-tag', TYPE_TONE[o.type])}>{o.type}</span><span className="dm-ex">{o.sample}</span></div>) : <p className="dm-sti-p">Nothing. The run carries on as it was.</p>,
          <span className="dm-n">{outs.length} {outs.length === 1 ? 'field' : 'fields'}</span>)}
        {fails && sec('fail', 'If it fails', <>
          {row('Retries', (
            <span className="dm-sti-num" role="group" aria-label="Retries">
              <Tip label="Fewer"><button type="button" className="dm-ib" aria-label="Fewer retries" aria-disabled={retries <= 0 || undefined} onClick={() => { if (retries > 0) set({ retries: retries - 1 }); }}><Icon name="minus" size="xs" /></button></Tip>
              <span className="dm-num" aria-live="polite">{retries}</span>
              <Tip label="More"><button type="button" className="dm-ib" aria-label="More retries" aria-disabled={retries >= 5 || undefined} onClick={() => { if (retries < 5) set({ retries: retries + 1 }); }}><Icon name="plus" size="xs" /></button></Tip>
            </span>
          ))}
          {row('Wait between', <Seg className="dm-sti-seg" label="Wait between tries" value={step.backoff ?? 'fixed'} onChange={v => set({ backoff: v })} options={[{ value: 'fixed', label: '2s each' }, { value: 'doubling', label: 'Doubling' }]} />)}
          {row(LABEL.timeLimit, choice('timeLimit', step.timeLimit, v => set({ timeLimit: v })))}
          {row(LABEL.onFail, choice('onFail', step.onFail, v => set({ onFail: v })))}
        </>)}
      </div>

      <div {...tool.pop} className={cx(tool.pop.className, 'dm-sti-pk')} role="menu" aria-label="Add a tool">
        <div className="dm-ph" role="none">Give {step.title} a tool</div>
        {toolOptions.map(t => {
          const has = (step.tools ?? []).some(x => x.id === t.id);
          return <button type="button" key={t.id} className="dm-mi" role="menuitem" tabIndex={-1} aria-disabled={has || undefined} onClick={() => { if (has) return; set({ tools: [...(step.tools ?? []), t] }); tool.closeSoon(); }}><span className="dm-sti-ti" data-k="tool" aria-hidden="true"><Icon name={t.icon ?? 'globe'} size="xs" /></span><span>{t.title}</span></button>;
        })}
      </div>
      <div {...who.pop} className={cx(who.pop.className, 'dm-sti-pk')} role="menu" aria-label="Who approves">
        <div className="dm-ph" role="none">Who approves</div>
        {people.map(p => {
          const on = (step.approvers ?? []).some(x => x.id === p.id);
          return <button type="button" key={p.id} className="dm-mi" role="menuitemcheckbox" aria-checked={on} tabIndex={-1} data-person={p.id} onClick={() => {
            const list = step.approvers ?? []; if (on && list.length < 2) return;
            set({ approvers: on ? list.filter(x => x.id !== p.id) : [...list, p] }); who.closeSoon(); }}><Avatar initials={p.initials} color={p.color} /><span>{p.name}</span><span className="dm-ck"><Icon name="check" size="xs" /></span></button>;
        })}
      </div>
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md): A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.
- [Data picker](https://designme.dev/components/data-picker.md): Map a field from earlier steps into a step's input.
- [Run drawer](https://designme.dev/components/run-drawer.md): A workflow's run under its canvas: the steps, the log and the data.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent builder](https://designme.dev/components/agent-builder.md): Describe an agent in a sentence and it drafts the rest: who it is, what it may do, what it knows, when it runs. Test it, save it, publish it.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
