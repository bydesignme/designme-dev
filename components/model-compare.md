# Model compare

> Run one prompt on three models side by side and keep the best.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/model-compare

## Install

```sh
npx designme add model-compare          # HTML, CSS and JS, with the shared core
npx designme add model-compare --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Columns that run one prompt on several models at once, so a person can read the answers side by side and keep the best one. Each column shows its model, the answer as it streams in, the time it took and what it cost. When the answers settle, the fastest time and the lowest cost are highlighted.

### When to use it

- When people choose which model an agent or feature should use.
- When you want to compare quality, speed and cost on the same prompt.
- In a prompt playground or evaluation tool where someone picks a winning answer.

### What it does

- Up to `max` columns (3 by default), each with a model picker; columns can be removed and new ones added from "Add a model".
- One prompt box sends to every column through `onSend`; Send is disabled while a full send is still running.
- Each column follows its answer's `state`: a thinking indicator, then words fading in as `text` grows, then the finished answer.
- Shows `seconds` and `cost` once done, with tokens per second in the time's tooltip, and marks the fastest and cheapest column.
- Changing a column's model, or adding one after a prompt was sent, calls `onRun` for just that column.
- "Use this" sets `chosen`; the chosen column is outlined and the others fade.

### Accessibility

- Each model picker is a role="menu" whose items are role="menuitemradio" with aria-checked on the current model.
- The picker buttons expose aria-expanded and aria-haspopup, and Escape closes an open picker and returns focus to its button.
- From the keyboard, Enter, Space or the down arrow opens a menu with the focus on its picked item, or its first (the up arrow, on its last); the arrow keys move through it and wrap, Home and End jump to the ends, Tab closes it and moves on, and closing it gives the focus back to its button.
- The prompt input and the send and remove buttons have aria-labels.
- The prompt is a form, so Enter sends it.

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
import { useScript, useTakeover, useWait } from '../lib/useScript';

/* ---------- Model compare: one prompt goes to three models, each streams its answer, the fastest and cheapest turn green ---------- */
const MODELS: ModelCompareModel[] = [
  { name: 'Opus', mark: 'O', color: 'var(--dm-pl)', description: 'Most capable, slower' },
  { name: 'Sonnet', mark: 'S', color: 'var(--dm-c1)', description: 'Balanced speed and quality' },
  { name: 'Haiku', mark: 'H', color: 'var(--dm-pm)', description: 'Fastest, lowest cost' }
];
// how each model behaves in the demo: time to finish, speed, cost and its answer to the first prompt
const RUNS: Record<string, { ms: number; tps: number; cost: number; answer: string; other: string }> = {
  Opus: { ms: 2400, tps: 38, cost: .021, answer: 'Pro gives every designer an agent that knows your tokens, so reviews take minutes, not days.', other: 'Here is a considered take, with the trade-offs spelled out and one clear recommendation at the end.' },
  Sonnet: { ms: 1300, tps: 74, cost: .006, answer: 'Ship polished pages faster with an agent that checks every frame for you.', other: 'Here is a clear, direct answer with the two points that matter most.' },
  Haiku: { ms: 600, tps: 142, cost: .001, answer: 'Your design QA, on autopilot.', other: 'Short answer: yes, and here is the one line why.' }
};
const FIRST = 'Write a one line value prop for the Pro plan';

export default function ModelCompareDemo() {
  const [columns, setColumns] = useState<ModelCompareColumn[]>(MODELS.map(m => ({ id: m.name, model: m.name })));
  const [asked, setAsked] = useState<string>();
  const [answers, setAnswers] = useState<Record<string, ModelCompareAnswer>>({});
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
      set({ state: 'answering', text: words.slice(0, i).join(' ') });
      await wait(r.ms * .65 / words.length); if (!live()) return;
    }
    set({ state: 'done', text: words.join(' '), seconds: r.ms / 1000, tokensPerSecond: r.tps, cost: r.cost });
  }, [wait]);

  const send = (q: string, cols: ModelCompareColumn[]) => { setAsked(q); cols.forEach(c => run(c, q)); };
  // a removed column stops writing and forgets its answer
  const change = (next: ModelCompareColumn[]) => {
    for (const c of columns) if (!next.some(n => n.id === c.id)) { runs.current[c.id] = (runs.current[c.id] ?? 0) + 1; setAnswers(({ [c.id]: _gone, ...rest }) => rest); }
    setColumns(next);
  };

  // the preview sends its question once on its own, unless you take over first
  const ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref);
  useScript(async ({ wait }) => { await wait(1200); if (!mine()) send(FIRST, columns); });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ModelCompare models={MODELS} columns={columns} onColumnsChange={change} defaultPrompt={FIRST} asked={asked} answers={answers}
        onSend={send} onRun={c => asked && run(c, asked)} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `models` | `ModelCompareModel[]` | The models on offer in every picker |
| `columns` (optional) | `ModelCompareColumn[]` | The columns, left to right. Leave it out to let the pickers, Remove and Add a model change them |
| `defaultColumns` (optional) | `ModelCompareColumn[]` | Defaults to the first `max` models |
| `onColumnsChange` (optional) | `(columns: ModelCompareColumn[]) => void` |  |
| `max` (optional) | `number` | How many columns fit side by side. Defaults to 3 |
| `prompt` (optional) | `string` | The text in the prompt box. Leave it out to let the box keep its own |
| `defaultPrompt` (optional) | `string` |  |
| `onPromptChange` (optional) | `(prompt: string) => void` |  |
| `asked` (optional) | `string` | The prompt the answers are for, shown at the top of every column that has an answer |
| `answers` (optional) | `Record<string, ModelCompareAnswer>` | Each column's answer, by column id. A column without one waits for a prompt |
| `onSend` (optional) | `(prompt: string, columns: ModelCompareColumn[]) => void` | Called when the prompt is sent to every column |
| `onRun` (optional) | `(column: ModelCompareColumn) => void` | Called when one column should answer again: its model changed, or it was added after a prompt was sent |
| `chosen` (optional) | `string \| null` | The id of the column whose answer was kept. It is outlined and the others fade |
| `defaultChosen` (optional) | `string \| null` |  |
| `onChosenChange` (optional) | `(id: string \| null) => void` |  |
| `placeholder` (optional) | `string` | Shown in a column before it has an answer |
| `className` (optional) | `string` |  |

## Questions

**How do I stream each model's answer into its column?**

Handle `onSend`, call your models, and update `answers` keyed by column id. Set `state` to 'thinking', then 'answering' with growing `text`, then 'done' with `seconds`, `cost` and optionally `tokensPerSecond`.

**What happens when someone swaps the model in one column?**

The column keeps its `id`, the pick is cleared, and `onRun` is called with that column if a prompt has already been sent. Rerun just that column and update its answer.

**How do I know which answer the person kept?**

Listen to `onChosenChange`. It gets the chosen column's id, or null when they unpick it or send a new prompt.

**Can I compare more than three models?**

Yes. Set `max` to the number of columns you want; "Add a model" shows until that many are open.

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
  /** The quiet line under it in the pickers, like "Most capable, slower" */
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
  /** Time to finish, in seconds, shown once done */
  seconds?: number;
  /** Shown in the time's tooltip, like "38 tokens a second" */
  tokensPerSecond?: number;
  /** What the reply cost, in dollars */
  cost?: number;
}

export interface ModelCompareProps {
  /** The models on offer in every picker */
  models: ModelCompareModel[];
  /** The columns, left to right. Leave it out to let the pickers, Remove and Add a model change them */
  columns?: ModelCompareColumn[];
  /** Defaults to the first `max` models */
  defaultColumns?: ModelCompareColumn[];
  onColumnsChange?: (columns: ModelCompareColumn[]) => void;
  /** How many columns fit side by side. Defaults to 3 */
  max?: number;
  /** The text in the prompt box. Leave it out to let the box keep its own */
  prompt?: string;
  defaultPrompt?: string;
  onPromptChange?: (prompt: string) => void;
  /** The prompt the answers are for, shown at the top of every column that has an answer */
  asked?: string;
  /** Each column's answer, by column id. A column without one waits for a prompt */
  answers?: Record<string, ModelCompareAnswer>;
  /** Called when the prompt is sent to every column */
  onSend?: (prompt: string, columns: ModelCompareColumn[]) => void;
  /** Called when one column should answer again: its model changed, or it was added after a prompt was sent */
  onRun?: (column: ModelCompareColumn) => void;
  /** The id of the column whose answer was kept. It is outlined and the others fade */
  chosen?: string | null;
  defaultChosen?: string | null;
  onChosenChange?: (id: string | null) => void;
  /** Shown in a column before it has an answer */
  placeholder?: string;
  className?: string;
}

const running = (a?: ModelCompareAnswer) => a?.state === 'thinking' || a?.state === 'answering';
const NONE: Record<string, ModelCompareAnswer> = {};

/** The coloured letter that stands for a model */
const Mark = ({ model }: { model?: ModelCompareModel }) => <span className="dm-mcx-mk" style={{ background: model?.color }}>{model?.mark}</span>;

/** A picker item: the model's mark, its name and what it is good at */
const Item = ({ model }: { model: ModelCompareModel }) => (
  <><Mark model={model} /><span>{model.name}{model.description && <span className="dm-d">{model.description}</span>}</span></>
);

function Column({ column, models, answer, asked, placeholder, removable, leaving, fresh, best, chosen, onModel, onRemove, onChoose }: {
  column: ModelCompareColumn; models: ModelCompareModel[]; answer?: ModelCompareAnswer; asked?: string; placeholder: string;
  removable: boolean; leaving: boolean; fresh: boolean; best: { fast?: string; cheap?: string }; chosen: string | null;
  onModel: (name: string) => void; onRemove: () => void; onChoose: () => void;
}) {
  const menu = usePopover();
  const model = models.find(m => m.name === column.model);
  const done = answer?.state === 'done';
  const won = chosen === column.id;
  const fast = best.fast === column.id, cheap = best.cheap === column.id;
  const tps = answer?.tokensPerSecond !== undefined ? ', ' + answer.tokensPerSecond + ' tokens a second' : '';
  return (
    <div className={cx('dm-mcx-c dm-panel', fresh && 'dm-enter', leaving && 'dm-leave', chosen && (won ? 'dm-win' : 'dm-lose'))}>
      <div className="dm-mcx-h">
        <button type="button" className="dm-mcx-sel" {...menu.trigger}><Mark model={model} />{column.model}<Icon name="chev-d" size="xs" /></button>
        <Tip label="Remove">
          <button type="button" className="dm-ib dm-mcx-x" aria-label="Remove model" hidden={!removable} onClick={onRemove}><Icon name="x" size="xs" /></button>
        </Tip>
      </div>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-mcx-pop')} role="menu">
        {models.map(m => (
          <button type="button" key={m.name} className="dm-mi" role="menuitemradio" aria-checked={m.name === column.model}
            onClick={() => { menu.closeSoon(); if (m.name !== column.model) onModel(m.name); }}>
            <Item model={m} /><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
      <div className="dm-mcx-o">
        {!answer ? <div className="dm-mcx-a"><span className="dm-ph">{placeholder}</span></div> : <>
          {asked && <div className="dm-bub">{asked}</div>}
          <div className="dm-mcx-a">
            {answer.state === 'thinking'
              ? <span className="dm-wk"><Think /><span className="dm-shim">Thinking</span></span>
              : <span>{(answer.text ?? '').split(' ').filter(Boolean).map((w, i) => <span key={i} className="dm-w">{w} </span>)}</span>}
          </div>
        </>}
      </div>
      <div className="dm-mcx-f">
        <span className="dm-mcx-m dm-num">
          {!answer ? 'No run yet' : !done ? 'Running' : <>
            {answer.seconds !== undefined && <Tip label={(fast ? 'Fastest. ' : '') + 'Time to finish' + tps}><span className={cx('dm-tm', fast && 'dm-best')}>{answer.seconds.toFixed(1)}s</span></Tip>}
            {answer.cost !== undefined && <Tip label={cheap ? 'Cheapest reply' : 'Cost of this reply'}><span className={cx('dm-co', cheap && 'dm-best')}>${answer.cost.toFixed(3)}</span></Tip>}
          </>}
        </span>
        <button type="button" className="dm-pill dm-soft dm-sm dm-mcx-pick" disabled={!done} onClick={onChoose}>
          {won ? <><Icon name="check" size="xs" />Chosen</> : 'Use this'}
        </button>
      </div>
    </div>
  );
}

/** One prompt run on several models side by side, so you can keep the best answer. */
export function ModelCompare({
  models, columns, defaultColumns, onColumnsChange, max = 3, prompt, defaultPrompt = '', onPromptChange, asked, answers = NONE,
  onSend, onRun, chosen, defaultChosen = null, onChosenChange, placeholder = 'Waiting for a prompt', className
}: ModelCompareProps) {
  const [cols, setCols] = useControllable(columns, defaultColumns ?? models.slice(0, max).map(m => ({ id: m.name, model: m.name })), onColumnsChange);
  const [text, setText] = useControllable(prompt, defaultPrompt, onPromptChange);
  const [pick, setPick] = useControllable(chosen, defaultChosen, onChosenChange);
  const add = usePopover({ align: 'end', side: 'down' });

  // columns that were there from the start come in with the card; later ones play their own entrance
  const [first] = useState(() => new Set(cols.map(c => c.id)));
  // a removed column fades out before it leaves the list
  const [leaving, setLeaving] = useState<string[]>([]);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const latest = useRef(cols);
  useEffect(() => { latest.current = cols; });

  const busy = cols.some(c => running(answers[c.id]));
  // Send waits for a full send to finish; a single column answering again leaves it free, as on designme.dev
  const [sent, setSent] = useState(false);
  useEffect(() => { if (!busy) setSent(false); }, [busy]);
  // when the answers settle, the fastest time and the lowest cost turn green; they stay put until the next answers settle,
  // so a column answering again or leaving changes nothing until then, as on designme.dev
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
  const remove = (id: string) => {
    if (leaving.includes(id)) return;
    setLeaving(l => [...l, id]);
    timers.current.push(setTimeout(() => { setLeaving(l => l.filter(x => x !== id)); setCols(latest.current.filter(c => c.id !== id)); }, 260));
  };
  const send = (e: FormEvent) => {
    e.preventDefault();
    const q = text.trim(); if (!q || (sent && busy)) return;
    setPick(null); setSent(true); onSend?.(q, cols);
  };

  return (
    <div data-dm="" className={cx('dm-mcx', className)}>
      <div className="dm-mcx-cols">
        {cols.map(c => (
          <Column key={c.id} column={c} models={models} answer={answers[c.id]} asked={asked} placeholder={placeholder}
            removable={cols.length > 1} leaving={leaving.includes(c.id)} fresh={!first.has(c.id)} best={best} chosen={pick}
            onModel={m => setModel(c.id, m)} onRemove={() => remove(c.id)} onChoose={() => setPick(pick === c.id ? null : c.id)} />
        ))}
        {cols.length < max && (
          <div className="dm-mcx-add">
            <button type="button" className="dm-mcx-addb" {...add.trigger}>
              <span className="dm-ic"><Icon name="plus" /></span>Add a model<span className="dm-d">Compare up to {max}</span>
            </button>
            <div {...add.pop} className={cx(add.pop.className, 'dm-mcx-pop dm-mcx-pa')} role="menu">
              {models.map(m => <button type="button" key={m.name} className="dm-mi" role="menuitem" onClick={() => addModel(m.name)}><Item model={m} /></button>)}
            </div>
          </div>
        )}
      </div>
      <form className="dm-mcx-in" onSubmit={send}>
        <input className="dm-mcx-q" value={text} onChange={e => setText(e.target.value)} aria-label="Prompt for every model" spellCheck={false} />
        <span className="dm-mcx-n dm-muted">Sends to {cols.length} {cols.length > 1 ? 'models' : 'model'}</span>
        <Tip label="Send to every model" kbd="↵">
          <button type="submit" className="dm-mcx-go" aria-label="Send to every model" disabled={(sent && busy) || !text.trim()}><Icon name="up" /></button>
        </Tip>
      </form>
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
