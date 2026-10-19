'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useCallback, useRef, useState } from 'react';
import { ModelCompare, type ModelCompareAnswer, type ModelCompareColumn, type ModelCompareModel } from '../components/model-compare/ModelCompare';
import { useScript, useWait } from './useScript';

/* ---------- Model compare: one prompt goes to three models, each streams its answer, the fastest and cheapest turn green ---------- */
const MODELS: ModelCompareModel[] = [
  { name: 'Opus', mark: 'O', color: 'var(--dm-c2)', description: 'Most capable, slower' },
  { name: 'Sonnet', mark: 'S', color: 'var(--dm-c1)', description: 'Balanced speed and quality' },
  { name: 'Haiku', mark: 'H', color: 'var(--dm-c3)', description: 'Fastest, lowest cost' }
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

  useScript(async ({ wait }) => { await wait(700); send(FIRST, columns); });

  return (
    <div style={{ width: '100%' }}>
      <ModelCompare models={MODELS} columns={columns} onColumnsChange={change} defaultPrompt={FIRST} asked={asked} answers={answers}
        onSend={send} onRun={c => asked && run(c, asked)} />
    </div>
  );
}
