import { StrictMode, useEffect, useState, type ComponentType } from 'react';
import { createRoot } from 'react-dom/client';
import '../src/designme.css';
import './playground.css';
import registry from '../../../r/index.json';
import { Seg } from '../src/lib/motion';

// every file in src/examples named after a registry item is one card, in the site's order
const examples = import.meta.glob<{ default: ComponentType }>('../src/examples/*.tsx', { eager: true });
// the cards that span the full width on designme.dev
const WIDE = new Set(['agent-lanes', 'agent-run-timeline', 'design-tuner', 'change-review', 'task-table', 'field-extraction', 'automation-canvas',
  'model-compare', 'stat-cards', 'account-table', 'date-range-picker', 'event-calendar', 'buttons', 'kanban-board', 'pricing-cards', 'agent-harness', 'design-review', 'terminal-stream', 'human-handoff', 'rich-text-editor', 'context-switcher', 'banner']);
['canvas-toolbar', 'agent-builder', 'image-generation'].forEach(n => WIDE.add(n));
const only = new URLSearchParams(location.search).get('only')?.split(',');
const CARDS = registry.items.flatMap(item => {
  const mod = examples[`../src/examples/${item.name}.tsx`];
  if (!mod || (only && !only.includes(item.name))) return [];
  const file = `${item.name}/${item.name.replace(/(?:^|-)(\w)/g, (_, c: string) => c.toUpperCase())}.tsx`;
  return [{ name: item.name, title: item.title, desc: item.description, file, Demo: mod.default }];
});

function Card({ name, title, desc, file, Demo }: (typeof CARDS)[number]) {
  const [run, setRun] = useState(0);
  return (
    <article className={WIDE.has(name) ? 'pg-card pg-wide' : 'pg-card'} id={name}>
      <header><h3>{title}</h3><p>{desc}</p></header>
      {/* the harness is a whole app, as wide as on designme.dev */}
      <div className="pg-stage"><div className="pg-in" style={name === 'agent-harness' ? { maxWidth: 960 } : name === 'image-generation' ? { maxWidth: 900 } : undefined}><Demo key={run} /></div></div>
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
          <p>{CARDS.length} designme.dev components as React, for Next.js, React and Astro. Same markup and styles as the site, driven by props.</p>
        </div>
        <div className="pg-ctrls" data-dm="">
          <Seg label="Style" value={style} onChange={setStyle} options={[{ value: 'blueprint', label: 'Blueprint' }, { value: 'soft', label: 'Soft' }]} />
          <Seg label="Theme" value={theme} onChange={setTheme} options={[{ value: 'light', label: 'Light' }, { value: 'dark', label: 'Dark' }]} />
        </div>
      </div>
      <div className="pg-grid">{CARDS.map(c => <Card key={c.name} {...c} />)}</div>
    </div>
  );
}

createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>);
