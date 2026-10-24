'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useState } from 'react';
import { DetailsPanel, type DetailsPanelTag } from '../components/details-panel/DetailsPanel';
import { useScript } from './useScript';

/* ---------- Details panel: menus change the run in place, the model sets tokens and cost, + adds labels ---------- */
const COST: Record<string, [number, number]> = { Opus: [184200, 2.76], Sonnet: [184200, .55], Haiku: [184200, .15] };
const MORE: DetailsPanelTag[] = [{ label: 'Q4', tone: 'yellow' }, { label: 'A/B test', tone: 'teal' }, { label: 'Urgent', tone: 'red' }];

export default function DetailsPanelDemo() {
  const [model, setModel] = useState('Opus');
  const [usage, setUsage] = useState<[number, number]>([0, 0]);
  const [tags, setTags] = useState<DetailsPanelTag[]>([{ label: 'Pricing', tone: 'blue' }, { label: 'Web', tone: 'orange' }]);
  // the usage counts up a moment after the panel appears, unless a model you picked is counting already
  useScript(async ({ wait }) => { await wait(700); setUsage(u => (u[0] ? u : COST.Opus)); });
  const pickModel = (m: string) => { setModel(m); setUsage(COST[m]); };
  const added = tags.length - 2;

  return (
    <div style={{ width: '100%' }}>
      <DetailsPanel kind="RUN" title="Pricing page redesign" copyValue="run_8f2a" copyLabel="Copy run ID"
        sections={[
          { key: 'props', title: 'Properties', rows: [
            { key: 'status', label: 'Status', type: 'select', defaultValue: 'In review', options: [
              { value: 'In progress', label: 'In progress', color: 'var(--dm-py)' },
              { value: 'In review', label: 'In review', color: 'var(--dm-accent)' },
              { value: 'Shipped', label: 'Shipped', color: 'var(--dm-ok)' }] },
            { key: 'owner', label: 'Owner', type: 'select', defaultValue: 'Maya Kim', options: [
              { value: 'Maya Kim', label: 'Maya Kim', avatar: { initials: 'MK', color: 'var(--dm-pl)' } },
              { value: 'Jon Ortiz', label: 'Jon Ortiz', avatar: { initials: 'JO', color: 'var(--dm-pm)' } },
              { value: 'Design agent', label: 'Design agent', avatar: { initials: 'DA', color: 'var(--dm-pb)' } }] },
            { key: 'model', label: 'Model', type: 'select', value: model, onValueChange: pickModel, options: [
              { value: 'Opus', label: 'Opus', detail: 'Best for design' },
              { value: 'Sonnet', label: 'Sonnet', detail: 'Faster, cheaper' },
              { value: 'Haiku', label: 'Haiku', detail: 'Quick edits' }] },
            { key: 'due', label: 'Due', value: 'Oct 24' },
            { key: 'labels', label: 'Labels', type: 'tags', tags, onAdd: () => { if (added < MORE.length) setTags(t => [...t, MORE[added]]); } }
          ] },
          { key: 'usage', title: 'Usage', rows: [
            { key: 'tokens', label: 'Tokens', type: 'number', value: usage[0] },
            { key: 'cost', label: 'Cost', type: 'number', value: usage[1], format: n => '$' + n.toFixed(2) },
            { key: 'time', label: 'Run time', value: '4m 12s' }
          ] }
        ]} />
    </div>
  );
}
