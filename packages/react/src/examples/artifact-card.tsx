'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ArtifactCard, type ArtifactCardProps, type ArtifactVersion } from '../components/artifact-card/ArtifactCard';
import { Seg } from '../lib/motion';
import { Demo } from './Demo';
import { useScript, useStory } from './useScript';

/* ---------- Artifact card: a pricing page review in three versions, written while you watch, shown four ways ---------- */
const F = {
  look: 'The three plans look alike at a glance.',
  year: 'The yearly switch hides what a month costs.',
  cancel: 'Nothing near the buttons says you can cancel any time.',
  faq: 'The FAQ repeats the plan table instead of answering doubts.',
  price: 'Team costs 16% more than similar plans elsewhere, and the page never says why.'
};
const DRAFTS = [
  { meta: 'edited 2 hours ago', note: 'First pass, four findings', findings: [F.look, F.year, F.cancel, F.faq], fixes: [] as string[],
    summary: 'People reach the plan table and stall. Most of what slows them down is clarity, not price.',
    changes: ['Read the page from top to bottom', 'Listed four findings in page order'] },
  { meta: 'edited 40 min ago', note: 'Added a competitor price check', findings: [F.look, F.year, F.cancel, F.price], fixes: [],
    summary: 'People reach the plan table and stall. Team also costs more than similar plans elsewhere, and the page never says why.',
    changes: ['Compared Team with three competitors', 'Dropped the FAQ finding, which overlapped another'] },
  { meta: 'edited just now', note: 'Fixes, ordered by impact', findings: [F.look, F.year, F.cancel, F.price],
    fixes: ['Show the monthly price beside the yearly one.', 'Mark Team as the plan most people choose.', 'Put “Cancel any time” under each button.'],
    summary: 'People reach the plan table and stall. Three changes should move most of them on, and none of them touch the price.',
    changes: ['Turned each finding into a fix', 'Ordered the fixes by how many people they reach'] }
];
// each version as the Markdown that Copy copies, Download saves and the reader shows
const VERSIONS: ArtifactVersion[] = DRAFTS.map((d, i) => ({
  title: 'Pricing page review', meta: d.meta, note: d.note, summary: d.summary,
  content: `# Pricing page review\n\n## Summary\n\n${d.summary}\n\n## Findings\n\n${d.findings.map(f => '- ' + f).join('\n')}\n`
    + (d.fixes.length ? `\n## What to fix first\n\n${d.fixes.map((f, k) => `${k + 1}. ${f}`).join('\n')}\n` : '')
    + `\n## Changes in v${i + 1}\n\n${d.changes.map(f => '- ' + f).join('\n')}\n`
}));
const TABLE: ArtifactVersion[] = [{ title: 'Competitor prices', meta: 'edited 1 hour ago', note: 'Team and Business at three competitors',
  content: 'Plan,Ours,Northwind,Halcyon,Fernway\nTeam,$29,$22,$25,$28\nBusiness,$79,$69,$75,$89\n' }];
const STEPS = ['Reading the page…', 'Writing the findings…', 'Ordering the fixes…'];
type Variant = NonNullable<ArtifactCardProps['variant']>;
const ASK = 'Review our pricing page and tell me what to fix first.';

export default function ArtifactCardDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<Variant>('compact');
  const [version, setVersion] = useState(2);
  // where the writing is: a step while it runs, then done; the summary is written out a few letters at a time
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState<number | null>(null);
  const writing = step < STEPS.length;
  // each variant plays the writing state again when it comes in
  useScript(async ({ wait }) => {
    setStep(0); setChars(0); await wait(1400);
    setStep(1);
    for (let n = 0; n < DRAFTS[2].summary.length; n += 3) { setChars(n); await wait(22); }
    setChars(null); await wait(300);
    setStep(2); await wait(1100);
    setStep(STEPS.length);
  }, [variant]);
  // the preview's story: once the report is written, someone opens its versions, reads v2 and goes back to v3
  useStory(ref, async ({ wait, press }) => {
    await wait(5600); press('.dm-afx-vb');
    await wait(1000); press('.dm-afx-menu .dm-mi[data-i="1"]');
    await wait(2000); press('.dm-afx-vb');
    await wait(1000); press('.dm-afx-menu .dm-mi[data-i="2"]');
  });

  const versions = writing && chars != null ? VERSIONS.map((x, i) => i === 2 ? { ...x, summary: DRAFTS[2].summary.slice(0, chars) } : x) : VERSIONS;
  const report = (
    <ArtifactCard variant={variant} versions={versions} version={writing ? 2 : version} onVersionChange={setVersion} kind="Report" fileName="pricing-page-review"
      state={writing ? 'writing' : 'ready'} status={STEPS[Math.min(step, STEPS.length - 1)]} progress={(step + 1) / STEPS.length} />
  );
  const body = variant === 'compact' ? (
    <div className="dm-afx-cp" data-dm="">
      <div className="dm-bub">{ASK}</div>
      <p className="dm-afx-cp-a">I went through the page from top to bottom and checked our prices against three competitors. Both are below.</p>
      <div className="dm-afx-cp-list"><ArtifactCard versions={TABLE} kind="Table" icon="table" ext="csv" fileName="competitor-prices" />{report}</div>
    </div>
  ) : variant === 'inline' ? (
    <div className="dm-afx-in" data-dm="">
      <div className="dm-bub">{ASK}</div>
      <div className="dm-afx-in-msg">
        <p>I went through the pricing page from top to bottom and wrote up what to fix first.</p>
        {report}
        <p>The short version: the plan table is where people stall, and three small changes should move most of them on.</p>
      </div>
    </div>
  ) : report;

  return (
    <div ref={ref} style={{ width: '100%', position: 'relative' }}>
      <Demo switcher={<Seg label="Variant" value={variant} onChange={setVariant} options={[{ value: 'compact', label: 'Compact' }, { value: 'preview', label: 'Preview' }, { value: 'inline', label: 'Inline' }, { value: 'stack', label: 'Stack' }]} />}>
        {body}
      </Demo>
    </div>
  );
}
