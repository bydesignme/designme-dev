import { StrictMode, useEffect, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/designme.css';
import './playground.css';
import { ContextMeterDemo, ReasoningTrailDemo, StatusPillDemo, StepLoaderDemo, ThinkingDemo } from '../src/examples/demos';
import { Seg } from '../src/lib/motion';

const CARDS: { title: string; desc: string; file: string; Demo: ComponentType }[] = [
  { title: 'Status pill', desc: 'One live line for what the agent is doing right now.', file: 'status-pill/StatusPill.tsx', Demo: StatusPillDemo },
  { title: 'Step loader', desc: 'Named steps with a progress track and four loaders.', file: 'step-loader/StepLoader.tsx', Demo: StepLoaderDemo },
  { title: 'Reasoning trail', desc: "The agent's plan, notes, sources and edits, after it thinks.", file: 'reasoning-trail/ReasoningTrail.tsx', Demo: ReasoningTrailDemo },
  { title: 'Thinking', desc: 'The live trace, written as the agent works, then folded away.', file: 'thinking/Thinking.tsx', Demo: ThinkingDemo },
  { title: 'Context meter', desc: 'How full the context window is, with session and weekly limits, in one small popover.', file: 'context-meter/ContextMeter.tsx', Demo: ContextMeterDemo }
];

function Card({ title, desc, file, Demo }: (typeof CARDS)[number]) {
  const [run, setRun] = useState(0);
  return (
    <article className="pg-card">
      <header><h3>{title}</h3><p>{desc}</p></header>
      <div className="pg-stage"><div className="pg-in"><Demo key={run} /></div></div>
      <footer><code>{file}</code><button type="button" onClick={() => setRun(r => r + 1)}>Replay</button></footer>
    </article>
  );
}

function App() {
  const [style, setStyle] = useState<'blueprint' | 'soft'>(() => (new URLSearchParams(location.search).get('style') === 'soft' ? 'soft' : 'blueprint'));
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (new URLSearchParams(location.search).get('theme') === 'dark' ? 'dark' : 'light'));
  useEffect(() => {
    const r = document.documentElement;
    if (style === 'soft') r.setAttribute('data-style', 'soft'); else r.removeAttribute('data-style');
    r.setAttribute('data-theme', theme);
  }, [style, theme]);
  return (
    <div className="pg">
      <div className="pg-top">
        <div>
          <h1>React components</h1>
          <p>The first five designme.dev components as React, for Next.js, React and Astro. Same markup and styles as the site, driven by props.</p>
        </div>
        <div className="pg-ctrls" data-dm="">
          <Seg label="Style" value={style} onChange={setStyle} options={[{ value: 'blueprint', label: 'Blueprint' }, { value: 'soft', label: 'Soft' }]} />
          <Seg label="Theme" value={theme} onChange={setTheme} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
        </div>
      </div>
      <div className="pg-grid">{CARDS.map(c => <Card key={c.title} {...c} />)}</div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
