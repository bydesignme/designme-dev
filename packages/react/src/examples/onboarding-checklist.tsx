'use client';
// The animated preview from designme.dev, rebuilt from the React component: the agent connects Figma by itself, and the other
// "Do it for me" buttons take a moment before they tick their step off.
import { useState } from 'react';
import { OnboardingChecklist, type OnboardingStep } from '../components/onboarding-checklist/OnboardingChecklist';
import { useScript } from './useScript';

const STEPS: OnboardingStep[] = [
  { key: 'workspace', title: 'Create your workspace', detail: 'Done when you signed up', done: true },
  { key: 'figma', title: 'Connect Figma', detail: 'So the agent can read your frames', automatic: true },
  { key: 'tokens', title: 'Import your tokens', detail: 'Colours, type and spacing', automatic: true },
  { key: 'invite', title: 'Invite a teammate', detail: 'Design is better together' },
  { key: 'audit', title: 'Run your first audit', detail: 'Takes about a minute', automatic: true }
];

export default function OnboardingChecklistDemo() {
  const [done, setDone] = useState(['workspace']);
  const [running, setRunning] = useState<string[]>([]);
  // a moment after it appears, the agent starts on Figma
  useScript(async ({ wait }) => {
    await wait(1300); setRunning(['figma']);
    await wait(1400); setRunning([]); setDone(d => (d.includes('figma') ? d : [...d, 'figma']));
  });
  return (
    <OnboardingChecklist steps={STEPS} done={done} onDoneChange={setDone} running={running}
      onDoIt={() => new Promise(res => setTimeout(res, 1400))} />
  );
}
