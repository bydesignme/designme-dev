'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { RewriteToolbar, type RewriteToolbarHandle } from '../components/rewrite-toolbar/RewriteToolbar';
import { useScript } from './useScript';

/* ---------- Rewrite toolbar: the first sentence is picked, made clearer and kept ---------- */
const TEXT = [
  'Welcome to DesignMe, a place where you and your team can work together with an agent on all of your design files in one place.',
  'To get started you will need to connect Figma, which can be done from the settings page at any time.',
  'After that, the agent will be able to read your frames and suggest improvements.'
];
const REWRITES: Record<string, string>[] = [
  { clear: 'DesignMe is where your team and an agent design together.', short: 'Design with your team and an agent.', warm: 'Welcome in. This is where you, your team and your agent make things together.' },
  { clear: 'Connect Figma in Settings to get started.', short: 'First, connect Figma.', warm: 'Start by connecting Figma. It takes about a minute.' },
  { clear: 'Then the agent can read your frames and suggest fixes.', short: 'Then the agent reviews your frames.', warm: 'Then your agent can look through your frames and help polish them.' }
];
export default function RewriteToolbarDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const toolbar = useRef<RewriteToolbarHandle>(null), yours = useRef(false);
  // plays once on its own: picks the first sentence, makes it clearer and keeps it. A click of yours takes over
  useScript(async ({ wait }) => {
    await wait(1300); if (yours.current) return; setSelected(s => s ?? 0);
    await wait(1200); if (yours.current) return; toolbar.current?.rewrite('clear');
    await wait(2600); if (yours.current) return; toolbar.current?.accept();
  });
  return (
    <div style={{ width: '100%' }} onPointerDownCapture={e => { if (e.isTrusted) yours.current = true; }}>
      <RewriteToolbar ref={toolbar} title="Onboarding intro" defaultSentences={TEXT} selected={selected} onSelectedChange={setSelected}
        onRewrite={(_, action, i) => new Promise<string>(res => setTimeout(() => res(REWRITES[i][action]), 350))} />
    </div>
  );
}
