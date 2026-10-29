'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useCallback, useRef, useState } from 'react';
import { ModelCompare, type ModelCompareAnswer, type ModelCompareColumn, type ModelCompareModel } from '../components/model-compare/ModelCompare';
import { useStory, useWait } from './useScript';

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
