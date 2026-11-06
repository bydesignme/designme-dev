'use client';
// The preview from designme.dev, rebuilt from the React component: pick an option on each step, go back from the track, start over at the end.
import { Stepper, type StepperStep } from '../components/stepper/Stepper';

const STEPS: StepperStep[] = [
  { label: 'Workspace', title: 'Name your workspace', description: 'This is what your team will see.', options: [{ label: 'Studio', detail: 'Small team' }, { label: 'Agency', detail: 'Many clients' }, { label: 'In-house', detail: 'One product' }] },
  { label: 'Agent', title: 'How should the agent work?', description: 'You can change this any time.', defaultOption: 1, options: [{ label: 'Ask first', detail: 'Safest' }, { label: 'Balanced', detail: 'Recommended' }, { label: 'Autopilot', detail: 'Fastest' }] },
  { label: 'Connect', title: 'Where do your designs live?', description: 'Pick one to start.', defaultOption: 2, options: [{ label: 'Figma', detail: 'Frames and tokens' }, { label: 'GitHub', detail: 'Code and PRs' }, { label: 'Both', detail: 'Full loop' }] }
];

export default function StepperDemo() {
  return <Stepper steps={STEPS} />;
}
