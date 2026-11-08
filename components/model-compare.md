# Model compare

> Run one prompt on three models side by side and keep the best.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/model-compare

## Install

```sh
npx designme add model-compare          # HTML, CSS and JS, with the shared core
npx designme add model-compare --react  # React 19 component and its CSS
npx designme add model-compare --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/model-compare.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/model-compare.json  # Astro
```

## About

One prompt run on two or three models, with their answers side by side in columns on one surface. Each column has a light header with the model's mark and name, which is also the menu that swaps the model, and a quiet line under it with the time, tokens and cost once the answer is in. The answers stream in, and Use this answer keeps the best one. Where the component is narrow, the columns stack.

### When to use it

- When people choose which model an agent or feature should use.
- When you want to compare quality, speed and cost on the same prompt.
- In a prompt playground or evaluation tool where someone picks the better answer.

### What it does

- A prompt field and Run on top send the prompt to every column through `onSend`; Run is disabled while a full run is still answering, or while the field is empty.
- Between `min` (2 by default) and `max` (3 by default) columns: Remove shows while there are more than `min`, and Add model while there are fewer than `max`.
- The model's name in each column's header opens a menu that swaps it; the column keeps its `id`, the pick is cleared, and once a prompt has been sent `onRun` is called for just that column.
- Each column follows its answer's `state`: a thinking mark, then words fading in as `text` grows, then the finished answer.
- The line under the model's name shows its `description` until it writes, then its `tokens` as it writes, then `seconds`, `tokens` and `cost` once done, with `tokensPerSecond` in the time's tooltip. When the answers settle, the fastest time and the lowest cost read a step darker.
- Use this answer shows once a column's answer is done and sets `chosen`; the chosen column takes the accent's tint and its button reads Chosen. Pressing it again lets it go.
- Below 540px wide the columns stack, one under another.

### Accessibility

- Each column is a `section` named after its model, and the answers sit in plain text, so a screen reader reads them in order.
- Each model menu is a role="menu" whose items are role="menuitemradio" with aria-checked on the current model; its button says the model and that it swaps it, and exposes aria-expanded and aria-haspopup.
- From the keyboard, Enter, Space or the down arrow opens a menu with the focus on its picked item, or its first (the up arrow, on its last); the arrow keys move through it and wrap, Home and End jump to the ends, Tab closes it and moves on, Escape closes it, and closing it gives the focus back to its button.
- Use this answer is a toggle button with aria-pressed. A polite live region says when a run starts, when every answer is in, and whose answer is used.
- The prompt is a form with a labelled field, so Enter runs it. Each Remove button is named after its model; removing a column from the keyboard moves the focus to Add model.

## Usage in React

```tsx
import { ModelCompare } from '@/components/designme/model-compare/ModelCompare';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useCallback, useRef, useState } from 'react';
import { ModelCompare, type ModelCompareAnswer, type ModelCompareColumn, type ModelCompareModel } from './ModelCompare';
import { useStory, useWait } from '../lib/useScript';

/* ---------- Model compare: one prompt runs on three models, each streams its answer, then one answer is chosen ---------- */
const MODELS: ModelCompareModel[] = [
  { name: 'Opus', mark: 'O', color: 'var(--dm-pl)', description: 'Most capable, slower' },
  { name: 'Sonnet', mark: 'S', color: 'var(--dm-accent)', markText: 'var(--dm-on-accent)', description: 'Balanced speed and quality' },
  { name: 'Haiku', mark: 'H', color: 'var(--dm-pm)', description: 'Fastest, lowest cost' }
];
// how each model behaves in the demo: time to finish, speed, cost and its answer to the first prompt
const RUNS: Record<string, { ms: number; tps: number; cost: number; answer: string; other: string }> = {
  Opus: { ms: 2400, tps: 38, cost: .021, answer: 'Pro gives every designer an agent that knows your tokens, so reviews take minutes, not days.', other: 'A considered take: the trade-offs first, then one clear recommendation you can act on.' },
  Sonnet: { ms: 1300, tps: 74, cost: .006, answer: 'Ship polished pages faster with an agent that checks every frame for you.', other: 'A clear, direct answer with the two points that matter most.' },
  Haiku: { ms: 600, tps: 142, cost: .001, answer: 'Your design QA, on autopilot.', other: 'Short answer: yes, and the one line why.' }
};
const FIRST = 'Write a one line value prop for the Pro plan';
// a rough count of the tokens in some words, as the preview on designme.dev shows them
const tok = (words: number) => Math.round(words * 1.35);

export default function ModelCompareDemo() {
  const [columns, setColumns] = useState<ModelCompareColumn[]>(MODELS.map(m => ({ id: m.name, model: m.name })));
  const [asked, setAsked] = useState<string>();
  const [answers, setAnswers] = useState<Record<string, ModelCompareAnswer>>({});
  const [chosen, setChosen] = useState<string | null>(null);
  const wait = useWait();
  // each column's latest run; an older run that is still writing stops when a newer one starts
  const runs = useRef<Record<string, number>>({});

  const run = useCallback(async (column: ModelCompareColumn, q: string) => {
    const id = column.id, mine = (runs.current[id] = (runs.current[id] ?? 0) + 1);
    const live = () => runs.current[id] === mine;
    const set = (a: ModelCompareAnswer) => setAnswers(all => ({ ...all, [id]: a }));
    const r = RUNS[column.model];
    set({ state: 'thinking' });
    await wait(r.ms * .35); if (!live()) return;
    const words = (q === FIRST ? r.answer : r.other).split(' ');
    for (let i = 1; i <= words.length; i++) {
      set({ state: 'answering', text: words.slice(0, i).join(' '), tokens: tok(i) });
      await wait(r.ms * .65 / words.length); if (!live()) return;
    }
    set({ state: 'done', text: words.join(' '), tokens: tok(words.length), seconds: r.ms / 1000, tokensPerSecond: r.tps, cost: r.cost });
  }, [wait]);

  const send = (q: string, cols: ModelCompareColumn[]) => { setAsked(q); cols.forEach(c => run(c, q)); };
  // a removed column stops writing and forgets its answer
  const change = (next: ModelCompareColumn[]) => {
    for (const c of columns) if (!next.some(n => n.id === c.id)) { runs.current[c.id] = (runs.current[c.id] ?? 0) + 1; setAnswers(({ [c.id]: _gone, ...rest }) => rest); }
    setColumns(next);
  };

  // the preview's story: run the prompt on all three, read the answers, then use Sonnet's. Clicking, focusing or typing in it
  // takes over
  const ref = useRef<HTMLDivElement>(null);
  const settled = useRef(false);
  settled.current = columns.every(c => answers[c.id]?.state === 'done');
  useStory(ref, async ({ wait, press }) => {
    await wait(1000);
    press('.dm-mcx-go');
    await wait(400);
    while (!settled.current) await wait(200);
    await wait(1500);
    press('.dm-mcx-c[aria-label="Sonnet"] .dm-mcx-pick');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ModelCompare models={MODELS} columns={columns} onColumnsChange={change} defaultPrompt={FIRST} asked={asked} answers={answers}
        onSend={send} onRun={c => asked && run(c, asked)} chosen={chosen} onChosenChange={setChosen} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `models` | `ModelCompareModel[]` | The models on offer in every menu |
| `columns` (optional) | `ModelCompareColumn[]` | The columns, left to right. Leave it out to let the menus, Remove and Add model change them |
| `defaultColumns` (optional) | `ModelCompareColumn[]` | Defaults to the first `max` models |
| `onColumnsChange` (optional) | `(columns: ModelCompareColumn[]) => void` |  |
| `min` (optional) | `number` | The fewest columns: Remove shows only while there are more. Defaults to 2 |
| `max` (optional) | `number` | The most columns side by side: Add model shows only while there are fewer. Defaults to 3 |
| `prompt` (optional) | `string` | The text in the prompt field. Leave it out to let the field keep its own |
| `defaultPrompt` (optional) | `string` |  |
| `onPromptChange` (optional) | `(prompt: string) => void` |  |
| `asked` (optional) | `string` | The prompt the answers are for. Once it is set, a column whose model changes, or a column added, asks for its own run |
| `answers` (optional) | `Record<string, ModelCompareAnswer>` | Each column's answer, by column id. A column without one waits for a prompt |
| `onSend` (optional) | `(prompt: string, columns: ModelCompareColumn[]) => void` | Called when Run sends the prompt to every column |
| `onRun` (optional) | `(column: ModelCompareColumn) => void` | Called when one column should answer again: its model changed, or it was added after a prompt was sent |
| `chosen` (optional) | `string \| null` | The id of the column whose answer is used. Its column takes the accent's tint |
| `defaultChosen` (optional) | `string \| null` |  |
| `onChosenChange` (optional) | `(id: string \| null) => void` |  |
| `placeholder` (optional) | `string` | Shown in a column before it has an answer |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ModelCompare from '../components/designme/model-compare/ModelCompare.astro';
---
<ModelCompare />
<ModelCompare data-style="soft" class="my-class" />
```
It plays its demo; change `model-compare.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How do I stream each model's answer into its column?**

Handle `onSend`, call your models, and update `answers` keyed by column id. Set `state` to 'thinking', then 'answering' with growing `text` and `tokens`, then 'done' with `seconds`, `tokens`, `cost` and optionally `tokensPerSecond`.

**What happens when someone swaps the model in one column?**

The column keeps its `id`, the pick is cleared, and `onRun` is called with that column if a prompt has already been sent (`asked` is set). Run just that column again and update its answer.

**How do I know which answer the person kept?**

Listen to `onChosenChange`. It gets the chosen column's id, or null when they let it go, swap a model or run a new prompt.

**Can I compare more than three models?**

Yes. Set `max` to the number of columns you want; Add model shows until that many are open. `min` sets how few there can be.

## Source

`ModelCompare.tsx`, as `npx designme add model-compare --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Think, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './model-compare.css';

/** A model that can fill a column */
export interface ModelCompareModel {
  /** Like "Opus". Columns refer to models by this name */
  name: string;
  /** The letter in its coloured mark, like "O" */
  mark: string;
  /** The mark's colour, like 'var(--dm-pl)' */
  color: string;
  /** The text colour on the mark. Defaults to 'var(--dm-on-ink)' */
  markText?: string;
  /** What it is good at, like "Most capable, slower": under its name until it answers, and in the menus */
  description?: string;
}

/** One column, side by side with the others */
export interface ModelCompareColumn {
  /** Stays the same when the column's model changes, so answers can be keyed by it */
  id: string;
  /** The name of the model in it */
  model: string;
}

/** thinking before the first word, answering while the words arrive, done once it has finished */
export type ModelCompareState = 'thinking' | 'answering' | 'done';

/** A column's answer to the prompt that was sent */
export interface ModelCompareAnswer {
  state: ModelCompareState;
  /** The answer so far. New words fade in as it grows */
  text?: string;
  /** Tokens in the answer so far, shown under the model's name while it writes and once it is done */
  tokens?: number;
  /** Time to finish, in seconds, shown once done */
  seconds?: number;
  /** Shown in the time's tooltip, like "38 tokens a second" */
  tokensPerSecond?: number;
  /** What the answer cost, in dollars, shown once done */
  cost?: number;
}

export interface ModelCompareProps {
  /** The models on offer in every menu */
  models: ModelCompareModel[];
  /** The columns, left to right. Leave it out to let the menus, Remove and Add model change them */
  columns?: ModelCompareColumn[];
  /** Defaults to the first `max` models */
  defaultColumns?: ModelCompareColumn[];
  onColumnsChange?: (columns: ModelCompareColumn[]) => void;
  /** The fewest columns: Remove shows only while there are more. Defaults to 2 */
  min?: number;
  /** The most columns side by side: Add model shows only while there are fewer. Defaults to 3 */
  max?: number;
  /** The text in the prompt field. Leave it out to let the field keep its own */
  prompt?: string;
  defaultPrompt?: string;
  onPromptChange?: (prompt: string) => void;
  /** The prompt the answers are for. Once it is set, a column whose model changes, or a column added, asks for its own run */
  asked?: string;
  /** Each column's answer, by column id. A column without one waits for a prompt */
  answers?: Record<string, ModelCompareAnswer>;
  /** Called when Run sends the prompt to every column */
  onSend?: (prompt: string, columns: ModelCompareColumn[]) => void;
  /** Called when one column should answer again: its model changed, or it was added after a prompt was sent */
  onRun?: (column: ModelCompareColumn) => void;
  /** The id of the column whose answer is used. Its column takes the accent's tint */
  chosen?: string | null;
  defaultChosen?: string | null;
  onChosenChange?: (id: string | null) => void;
  /** Shown in a column before it has an answer */
  placeholder?: string;
  className?: string;
}

const running = (a?: ModelCompareAnswer) => a?.state === 'thinking' || a?.state === 'answering';
const NONE: Record<string, ModelCompareAnswer> = {};
const tokens = (n: number) => n + (n === 1 ? ' token' : ' tokens');

/** The coloured letter that stands for a model */
const Mark = ({ model }: { model?: ModelCompareModel }) => (
  <span className="dm-mcx-mk" style={{ background: model?.color, color: model?.markText ?? 'var(--dm-on-ink)' }} aria-hidden="true">{model?.mark}</span>
);

/** A menu item: the model's mark, its name and what it is good at */
const Item = ({ model }: { model: ModelCompareModel }) => (
  <><Mark model={model} /><span>{model.name}{model.description && <span className="dm-d">{model.description}</span>}</span></>
);

/** The quiet line under a model's name: what it is good at, then its tokens as it writes, then time, tokens and cost */
function Meta({ model, answer, fast, cheap }: { model?: ModelCompareModel; answer?: ModelCompareAnswer; fast: boolean; cheap: boolean }) {
  if (!answer || answer.state === 'thinking') return <>{model?.description}</>;
  if (answer.state === 'answering') return <>{answer.tokens !== undefined ? tokens(answer.tokens) : 'Writing'}</>;
  const tps = answer.tokensPerSecond !== undefined ? ', ' + answer.tokensPerSecond + ' tokens a second' : '';
  const parts = [
    answer.seconds !== undefined && <Tip key="s" label={(fast ? 'Fastest. ' : '') + 'Time to finish' + tps}><span className={cx('dm-mcx-tm', fast && 'dm-best')}>{answer.seconds.toFixed(1)}s</span></Tip>,
    answer.tokens !== undefined && <Tip key="t" label="Tokens in the answer"><span className="dm-mcx-tk">{tokens(answer.tokens)}</span></Tip>,
    answer.cost !== undefined && <Tip key="c" label={cheap ? 'Cheapest answer' : 'Cost of this answer'}><span className={cx('dm-mcx-co', cheap && 'dm-best')}>${answer.cost.toFixed(3)}</span></Tip>
  ].filter(Boolean);
  return <>{parts.flatMap((p, i) => (i ? [' · ', p] : [p]))}</>;
}

function Column({ column, models, answer, placeholder, removable, leaving, fresh, best, chosen, onModel, onRemove, onChoose }: {
  column: ModelCompareColumn; models: ModelCompareModel[]; answer?: ModelCompareAnswer; placeholder: string;
  removable: boolean; leaving: boolean; fresh: boolean; best: { fast?: string; cheap?: string }; chosen: string | null;
  onModel: (name: string) => void; onRemove: (focused: boolean) => void; onChoose: () => void;
}) {
  const menu = usePopover();
  const model = models.find(m => m.name === column.model);
  const done = answer?.state === 'done';
  const won = chosen === column.id;
  return (
    <section aria-label={column.model} className={cx('dm-mcx-c', fresh && 'dm-enter', leaving && 'dm-leave', done && 'dm-done', won && 'dm-win')}>
      <div className="dm-mcx-h">
        <button type="button" className="dm-mcx-sel" aria-label={column.model + ', swap model'} {...menu.trigger}><Mark model={model} /><span className="dm-nm">{column.model}</span><Icon name="chev-d" size="xs" /></button>
        <Tip label="Remove">
          <button type="button" className="dm-ib dm-mcx-x" aria-label={'Remove ' + column.model} hidden={!removable} onClick={e => onRemove(document.activeElement === e.currentTarget)}><Icon name="x" size="xs" /></button>
        </Tip>
      </div>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-mcx-pop')} role="menu" aria-label="Swap model">
        {models.map(m => (
          <button type="button" key={m.name} className="dm-mi" role="menuitemradio" aria-checked={m.name === column.model}
            onClick={() => { menu.closeSoon(); if (m.name !== column.model) onModel(m.name); }}>
            <Item model={m} /><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
      <div className="dm-mcx-m dm-num"><Meta model={model} answer={answer} fast={best.fast === column.id} cheap={best.cheap === column.id} /></div>
      <div className="dm-mcx-a">
        {!answer ? <span className="dm-ph">{placeholder}</span>
          : answer.state === 'thinking' ? <span className="dm-wk"><Think /><span className="dm-shim">Thinking</span></span>
          : <span>{(answer.text ?? '').split(' ').filter(Boolean).map((w, i) => <span key={i} className="dm-w">{w} </span>)}</span>}
      </div>
      <div className="dm-mcx-ft">
        <button type="button" className="dm-pill dm-line dm-sm dm-mcx-pick" aria-pressed={won} disabled={!done} onClick={onChoose}>
          {won ? <><Icon name="check" size="xs" />Chosen</> : 'Use this answer'}
        </button>
      </div>
    </section>
  );
}

/** One prompt run on two or three models, their answers side by side, so you can use the best one. */
export function ModelCompare({
  models, columns, defaultColumns, onColumnsChange, min = 2, max = 3, prompt, defaultPrompt = '', onPromptChange, asked, answers = NONE,
  onSend, onRun, chosen, defaultChosen = null, onChosenChange, placeholder = 'Waiting for a prompt', className
}: ModelCompareProps) {
  const [cols, setCols] = useControllable(columns, defaultColumns ?? models.slice(0, max).map(m => ({ id: m.name, model: m.name })), onColumnsChange);
  const [text, setText] = useControllable(prompt, defaultPrompt, onPromptChange);
  const [pick, setPick] = useControllable(chosen, defaultChosen, onChosenChange);
  const add = usePopover({ align: 'end' });
  const addBtn = add.trigger.ref, field = useRef<HTMLInputElement>(null);
  const [live, setLive] = useState('');

  // columns that were there from the start come in with the component; later ones play their own entrance
  const [first] = useState(() => new Set(cols.map(c => c.id)));
  // a removed column fades out before it leaves the list
  const [leaving, setLeaving] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const latest = useRef(cols);
  useEffect(() => { latest.current = cols; });

  const busy = cols.some(c => running(answers[c.id]));
  // Run waits for a full run to finish; a single column answering again leaves it free, as on designme.dev
  const [sent, setSent] = useState(false);
  useEffect(() => { if (!busy && sent) { setSent(false); setLive('All ' + cols.length + ' answers are in'); } }, [busy, sent, cols.length]);
  // when the answers settle, the fastest time and the lowest cost read a step darker; they stay put until the next answers
  // settle, so a column answering again or leaving changes nothing until then, as on designme.dev
  const [best, setBest] = useState<{ fast?: string; cheap?: string }>({});
  const settled = useRef<boolean | null>(null);
  useEffect(() => {
    const ended = settled.current !== true && !busy;
    settled.current = !busy;
    if (!ended) return;
    const done = cols.filter(c => answers[c.id]?.state === 'done');
    const low = (k: 'seconds' | 'cost') => done.length < 2 ? undefined : done.reduce((a, b) => (answers[b.id][k] ?? Infinity) < (answers[a.id][k] ?? Infinity) ? b : a).id;
    const fast = low('seconds'), cheap = low('cost');
    setBest(b => b.fast === fast && b.cheap === cheap ? b : { fast, cheap });
  }, [busy, answers, cols]);

  const rerun = (c: ModelCompareColumn) => { setPick(null); if (asked) onRun?.(c); };
  const setModel = (id: string, model: string) => {
    const next = cols.map(c => c.id === id ? { ...c, model } : c);
    setCols(next); rerun(next.find(c => c.id === id)!);
  };
  const addModel = (model: string) => {
    let n = cols.length, id = model.toLowerCase() + '-' + n;
    while (cols.some(c => c.id === id)) id = model.toLowerCase() + '-' + ++n;
    const c = { id, model };
    setCols([...cols, c]); add.closeSoon(); rerun(c);
  };
  const remove = (id: string, had: boolean) => {
    if (leaving.includes(id)) return;
    if (pick === id) setPick(null);
    setLeaving(l => [...l, id]);
    timers.current.push(setTimeout(() => {
      setLeaving(l => l.filter(x => x !== id)); setCols(latest.current.filter(c => c.id !== id));
      // the focus was on Remove: it goes to Add model, which shows again now, or to the prompt
      if (had) setTimeout(() => (addBtn.current && !addBtn.current.hidden ? addBtn.current : field.current)?.focus({ preventScroll: true }));
    }, 260));
  };
  const choose = (c: ModelCompareColumn) => {
    const on = pick !== c.id; setPick(on ? c.id : null);
    if (on) setLive('Using the answer from ' + c.model);
  };
  const send = (e: FormEvent) => {
    e.preventDefault();
    const q = text.trim(); if (!q || (sent && busy)) return;
    setPick(null); setSent(true); setLive('Running on ' + cols.length + ' models'); onSend?.(q, cols);
  };
  const shown = cols.filter(c => !leaving.includes(c.id)).length;

  return (
    <div data-dm="" className={cx('dm-mcx dm-panel', className)}>
      <form className="dm-mcx-in" onSubmit={send}>
        <div className="dm-mcx-fd">
          <input ref={field} className="dm-mcx-q" value={text} onChange={e => setText(e.target.value)} aria-label="Prompt for every model" spellCheck={false} autoComplete="off" />
          <span className="dm-mcx-n dm-num">{shown} {shown === 1 ? 'model' : 'models'}</span>
        </div>
        <button type="button" className="dm-pill dm-ghost dm-sm dm-mcx-add" hidden={shown >= max} {...add.trigger}>
          <Icon name="plus" size="xs" />Add model
        </button>
        <Tip label="Run on every model" kbd="↵">
          <button type="submit" className="dm-pill dm-primary dm-sm dm-mcx-go" disabled={(sent && busy) || !text.trim()}>Run</button>
        </Tip>
      </form>
      <div {...add.pop} className={cx(add.pop.className, 'dm-mcx-pop dm-mcx-pa')} role="menu" aria-label="Add a model">
        {models.map(m => <button type="button" key={m.name} className="dm-mi" role="menuitem" onClick={() => addModel(m.name)}><Item model={m} /></button>)}
      </div>
      <div className="dm-mcx-cols">
        {cols.map(c => (
          <Column key={c.id} column={c} models={models} answer={answers[c.id]} placeholder={placeholder}
            removable={shown > min} leaving={leaving.includes(c.id)} fresh={!first.has(c.id)} best={best} chosen={pick}
            onModel={m => setModel(c.id, m)} onRemove={had => remove(c.id, had)} onChoose={() => choose(c)} />
        ))}
      </div>
      <p className="dm-mcx-live" aria-live="polite">{live}</p>
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
- [Agent builder](https://designme.dev/components/agent-builder.md): Describe an agent in a sentence and it drafts the rest: who it is, what it may do, what it knows, when it runs. Test it, save it, publish it.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
