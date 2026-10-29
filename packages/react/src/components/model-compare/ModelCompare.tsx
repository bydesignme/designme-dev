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

