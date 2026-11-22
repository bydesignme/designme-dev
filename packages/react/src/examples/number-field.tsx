'use client';
// The animated preview from designme.dev, rebuilt from the React components: two more steps, a budget raised to the most it
// allows, then a minute less of time.
import { useRef, useState } from 'react';
import { NumberField, NumberFieldGroup } from '../components/number-field/NumberField';
import { useStory } from './useScript';

export default function NumberFieldDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [steps, setSteps] = useState(25);
  const [budget, setBudget] = useState(2.5);
  const [time, setTime] = useState(10);
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('[aria-label="More steps"]');
    await wait(500); press('[aria-label="More steps"]');
    await wait(2000); setBudget(20);
    await wait(2500); press('[aria-label="Less time"]');
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <NumberFieldGroup title="Run limits" description="For each run of the release agent"
        summary={`A run stops at ${steps} steps, $${budget.toFixed(2)} or ${time} min, whichever comes first.`}>
        <NumberField label="Max steps" min={5} max={100} step={5} value={steps} onValueChange={setSteps} unit="steps" buttonLabels={['Fewer steps', 'More steps']} />
        <NumberField label="Budget per run" min={0.25} max={20} step={0.25} decimals={2} prefix="$" value={budget} onValueChange={setBudget}
          valueText={v => `$${v.toFixed(2)}`} buttonLabels={['Lower budget', 'Higher budget']} />
        <NumberField label="Time limit" min={1} max={60} value={time} onValueChange={setTime} unit="min" valueText={v => `${v} minutes`} buttonLabels={['Less time', 'More time']} />
      </NumberFieldGroup>
    </div>
  );
}
