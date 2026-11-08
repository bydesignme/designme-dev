'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { DataPicker, type DataPickerField, type DataPickerSource } from '../components/data-picker/DataPicker';
import { useStory } from './useScript';

/* ---------- Data picker: a field comes out of the subject, then Body's picker searches "sc", moves down to the reasons
   and puts them in ---------- */
const SOURCES: DataPickerSource[] = [
  { id: 'form', title: 'Demo request form', kind: 'trigger', icon: 'file-text', fields: [{ name: 'name', type: 'text', sample: 'Priya Shah' }, { name: 'email', type: 'text', sample: 'priya@corvid.io' }, { name: 'company', type: 'text', sample: 'Corvid Analytics' }, { name: 'seats', type: 'number', sample: '240' }, { name: 'sent_at', type: 'date', sample: 'Nov 8, 10:41' }] },
  { id: 'lookup', title: 'Company lookup', kind: 'tool', icon: 'globe', fields: [{ name: 'employees', type: 'number', sample: '420' }, { name: 'industry', type: 'text', sample: 'Analytics software' }, { name: 'verified', type: 'bool', sample: 'true' }] },
  { id: 'research', title: 'Research and score', kind: 'ai', icon: 'spark', fields: [{ name: 'score', type: 'number', sample: '84' }, { name: 'tier', type: 'text', sample: 'Enterprise' }, { name: 'reasons', type: 'list', sample: '3 reasons' }, { name: 'company', type: 'object', sample: '{ 5 fields }' }] },
  { id: 'reply', title: 'Draft a reply', kind: 'ai', icon: 'edit', fields: [{ name: 'subject', type: 'text', sample: 'Your demo with Fernhill' }, { name: 'body', type: 'text', sample: 'Hi Priya, thanks for writing' }] }
];
const FIELDS: DataPickerField[] = [{ key: 'to', label: 'To', refs: ['form.email'] }, { key: 'subject', label: 'Subject', refs: ['reply.subject', 'form.company'] }, { key: 'body', label: 'Body', refs: ['reply.body'] }];

export default function DataPickerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [fields, setFields] = useState(FIELDS);
  const [open, setOpen] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); press('[aria-label="Remove company from Demo request form"]');
    await wait(1000); press('[data-add="body"]');
    await wait(700); setQuery('s'); await wait(150); setQuery('sc');
    await wait(600); setActive(1); await wait(400); setActive(2);
    await wait(700); press('.dm-fpk-o.dm-on');
  });
  return (
    <div ref={ref} style={{ width: '100%', minHeight: 420 }}>
      <DataPicker sources={SOURCES} fields={fields} onFieldsChange={setFields} step={{ title: 'Send the reply', kind: 'app', icon: 'mail', position: 'Step 6 of 7' }}
        open={open} onOpenChange={setOpen} query={query} onQueryChange={setQuery} active={active} onActiveChange={setActive} />
    </div>
  );
}
