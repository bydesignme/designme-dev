'use client';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Think, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
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
