'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useScript } from './useScript';
import { ArtifactCard, type ArtifactVersion } from '../components/artifact-card/ArtifactCard';

/* ---------- Artifact card: a churn report in three versions that play through once; the chart redraws as you switch ---------- */
const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September'];
const DRAFTS = [
  { text: 'First pass at churn by month, sources still to check.', values: [3.4, 3.9, 4.3, 4.1, 3.8, 3.6], meta: 'v1, edited yesterday', note: 'First draft' },
  { text: 'Churn rose in July, the spike lines up with the pricing change.', values: [3.4, 3.9, 4.1, 5.8, 4.7, 3.9], meta: 'v2, edited 1 hour ago', note: 'Added the July spike' },
  { text: 'Churn rose in July, then settled once onboarding emails went out.', values: [3.4, 3.9, 4.1, 5.8, 4.5, 3.1], meta: 'v3, edited 2 min ago', note: 'Final, with your fixes' }
];
// the headline is the latest month, the change is measured from the peak
const VERSIONS: ArtifactVersion[] = DRAFTS.map((d, i) => {
  const last = d.values[d.values.length - 1], top = Math.max(...d.values);
  return { ...d, label: 'v' + (i + 1), value: last.toFixed(1) + '%', change: '−' + (top - last).toFixed(1) + ' pts since ' + MONTHS[d.values.indexOf(top)] };
});

export default function ArtifactCardDemo() {
  // the agent's versions play through once, first draft to final, unless someone picks one first
  const [version, setVersion] = useState(0);
  const touched = useRef(false);
  useScript(async ({ wait }) => {
    await wait(2300); if (!touched.current) setVersion(1);
    await wait(1800); if (!touched.current) setVersion(2);
  });
  return (
    <div style={{ width: '100%' }} onPointerDownCapture={() => { touched.current = true; }}>
      <ArtifactCard title="Churn analysis, Q3" versions={VERSIONS} version={version} onVersionChange={setVersion} axis={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']} range={[2.6, 6.2]}
        link="https://designme.dev/a/churn-q3" href="https://designme.dev/a/churn-q3" />
    </div>
  );
}
