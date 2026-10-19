'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { DecisionPrompt, type DecisionQuestion } from '../components/decision-prompt/DecisionPrompt';

/* ---------- Decision prompt: three quick questions before a redesign, then a summary ---------- */
const QUESTIONS: DecisionQuestion[] = [
  { question: 'Which frames should the agent redesign?', label: 'Frames', options: [{ label: 'Pricing only', detail: '1 frame' }, { label: 'Pricing and checkout', detail: '3 frames' }, { label: 'The whole flow', detail: '9 frames' }] },
  { question: 'How bold can the changes be?', label: 'Scope', options: [{ label: 'Polish spacing and type', detail: 'Safe' }, { label: 'Rework the layout', detail: 'Medium' }, { label: 'Fresh direction', detail: 'Bold' }] },
  { question: 'Where should the result go?', label: 'Output', options: [{ label: 'New Figma page', detail: 'Keeps the original' }, { label: 'Branch in the repo', detail: 'Opens a PR' }, { label: 'Both', detail: 'Recommended' }] }
];

export default function DecisionPromptDemo() {
  return (
    <div style={{ width: '100%' }}>
      <DecisionPrompt questions={QUESTIONS} startLabel="Starting the redesign" />
    </div>
  );
}
