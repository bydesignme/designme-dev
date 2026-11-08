'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { StepInspector, type StepConfig, type StepPerson, type StepSource, type StepTool } from '../components/step-inspector/StepInspector';
import { Seg } from '../lib/motion';
import { Demo } from './Demo';
import { useStory } from './useScript';

/* ---------- Step inspector: a field goes into the instructions, the input that reads a step that is gone is fixed, the step
   gets a second retry, then a branch's rule and an approval with a person added ---------- */
const FORM: StepSource = { id: 'form', title: 'Demo request form', kind: 'trigger', icon: 'file-text', fields: [{ name: 'name', type: 'text', sample: 'Priya Shah' }, { name: 'email', type: 'text', sample: 'priya@corvid.io' }, { name: 'company', type: 'text', sample: 'Corvid Analytics' }, { name: 'seats', type: 'number', sample: '240' }] };
const LOOKUP: StepSource = { id: 'lookup', title: 'Company lookup', kind: 'tool', icon: 'globe', fields: [{ name: 'employees', type: 'number', sample: '420' }, { name: 'industry', type: 'text', sample: 'Analytics software' }, { name: 'funding', type: 'text', sample: 'Series B' }] };
const RESEARCH: StepSource = { id: 'research', title: 'Research and score', kind: 'ai', icon: 'spark', fields: [{ name: 'score', type: 'number', sample: '84' }, { name: 'tier', type: 'text', sample: 'Enterprise' }, { name: 'reasons', type: 'list', sample: '3 reasons' }, { name: 'company', type: 'object', sample: '{ 5 fields }' }] };
const REPLY: StepSource = { id: 'reply', title: 'Draft a reply', kind: 'ai', icon: 'edit', fields: [{ name: 'subject', type: 'text', sample: 'Your demo with Fernhill' }, { name: 'body', type: 'text', sample: 'Hi Priya, thanks for writing' }] };
const PEOPLE: StepPerson[] = [{ id: 'MK', name: 'Maya Kim', initials: 'MK', color: 'var(--dm-av-l)' }, { id: 'TR', name: 'Theo Reed', initials: 'TR', color: 'var(--dm-av-t)' }, { id: 'AN', name: 'Ana Novak', initials: 'AN', color: 'var(--dm-av-p)' }, { id: 'JB', name: 'Jonah Brooks', initials: 'JB', color: 'var(--dm-av-m)' }];
const TOOLS: StepTool[] = [{ id: 'lookup', title: 'Company lookup', icon: 'globe' }, { id: 'search', title: 'Web search', icon: 'search' }, { id: 'crm', title: 'CRM lookup', icon: 'db' }];

type Kind = 'ai' | 'branch' | 'approval';
const START: Record<Kind, StepConfig> = {
  ai: { title: 'Research and score', kind: 'ai', position: 'step 2 of 7', model: 'Sonnet 5.5', tools: [TOOLS[0]],
    instructions: ['Look up ', { ref: 'form.company' }, ' and the person who wrote in. Score how well they fit our plans from 0 to 100, with three reasons.\nTheir team is ', { ref: 'lookup.employees' }, ' people.'],
    // Contact is no longer in the workflow, so this input is flagged
    inputs: [{ name: 'company', ref: 'form.company' }, { name: 'seats', ref: 'form.seats' }, { name: 'email', ref: 'contact.email' }],
    outputs: RESEARCH.fields, retries: 1, backoff: 'fixed', timeLimit: '60 seconds', onFail: 'Stop the run' },
  branch: { title: 'Good fit?', kind: 'branch', position: 'step 3 of 7', rule: { ref: 'research.score', op: 'is at least', value: 70 },
    yes: { title: 'Draft a reply', kind: 'ai', icon: 'edit' }, no: { title: 'Add to nurture list', kind: 'app', icon: 'users' }, outputs: [{ name: 'path', type: 'text', sample: 'Yes' }] },
  approval: { title: 'Rep approves', kind: 'approval', position: 'step 5 of 7', approvers: PEOPLE.slice(0, 2), askIn: 'Slack message', shows: 'reply.body', expire: '24 hours', then: 'Stop the run',
    outputs: [{ name: 'decision', type: 'text', sample: 'Approved' }, { name: 'by', type: 'text', sample: 'Maya Kim' }] }
};
const SOURCES: Record<Kind, StepSource[]> = { ai: [FORM, LOOKUP], branch: [FORM, LOOKUP, RESEARCH], approval: [FORM, LOOKUP, RESEARCH, REPLY] };

export default function StepInspectorDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [kind, setKind] = useState<Kind>('ai');
  const [steps, setSteps] = useState(START);
  const [testing, setTesting] = useState(false);
  const [status, setStatus] = useState<string>();
  const step = steps[kind];
  const test = () => { setTesting(true); setStatus('Testing with sample data'); setTimeout(() => { setTesting(false); setStatus('Worked in 1.4s, with sample data'); setTimeout(() => setStatus(undefined), 3200); }, 1400); };

  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('.dm-sti-ih .dm-pill');
    await wait(800); press('.dm-sti-dp.dm-open [data-ref="lookup.industry"]');
    await wait(1200); press('.dm-sti-tokb[aria-label^="email"]');
    await wait(800); press('.dm-sti-dp.dm-open [data-ref="form.email"]');
    await wait(1200); press('.dm-sti-sec:nth-last-child(1) .dm-sti-sh');
    await wait(700); press('.dm-sti-num [aria-label="More retries"]');
    await wait(1400); setKind('branch');
    await wait(2400); setKind('approval');
    await wait(1000); press('.dm-sti-add[aria-label="Add a person"]');
    await wait(700); press('.dm-sti-pk.dm-open [data-person="JB"]');
  });

  return (
    <Demo ref={ref} switcher={<Seg label="Step" value={kind} onChange={setKind} options={[{ value: 'ai', label: 'AI step' }, { value: 'branch', label: 'Branch' }, { value: 'approval', label: 'Approval' }]} />}>
      <StepInspector key={kind} step={step} sources={SOURCES[kind]} onChange={s => setSteps(x => ({ ...x, [kind]: s }))}
        onTest={test} testing={testing} status={status} statusOk={!!status && !testing} toolOptions={TOOLS} people={PEOPLE} />
    </Demo>
  );
}
