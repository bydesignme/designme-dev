'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useScript, useWait } from './useScript';
import { Form, type FormField, type FormHandle, type FormValues } from '../components/form/Form';

const FIELDS: FormField[] = [
  { key: 'name', label: 'Project name', placeholder: 'Pricing refresh', maxLength: 40, validate: v => !v.trim() && 'Give it a name' },
  { key: 'goal', label: 'Goal', type: 'textarea', rows: 2, placeholder: 'What should change, and why?', validate: v => v.trim().length < 12 && 'Add a sentence about the goal' },
  { key: 'type', label: 'Type', type: 'choice', options: [{ value: 'web', label: 'Website' }, { value: 'app', label: 'App' }, { value: 'brand', label: 'Brand' }], validate: v => !v && 'Pick a type' },
  { key: 'due', label: 'Due', placeholder: 'Nov 14' }
];

/* ---------- Form: a project brief; the agent can draft it, and submit checks every field ---------- */
export default function FormDemo() {
  const [values, setValues] = useState<FormValues>({});
  const latest = useRef<FormValues>({});
  const set = (v: FormValues) => { latest.current = v; setValues(v); };
  const wait = useWait();

  // the agent types each field in, a letter at a time
  const typeIn = async (key: string, text: string) => {
    set({ ...latest.current, [key]: '' });
    for (let i = 1; i <= text.length; i++) { set({ ...latest.current, [key]: text.slice(0, i) }); await wait(18); }
  };
  const draft = async () => {
    if (!latest.current.name) await typeIn('name', 'Pricing refresh');
    await typeIn('goal', 'Lift trial to paid by showing annual plans first and keeping one CTA per card.');
    if (!latest.current.type) set({ ...latest.current, type: 'web' });
    if (!latest.current.due) await typeIn('due', 'Nov 14');
  };

  // a moment after it appears, the agent drafts the brief, unless someone has started on it
  const form = useRef<FormHandle>(null), touched = useRef(false);
  useScript(async s => { await s.wait(1400); if (!touched.current && !latest.current.name) await form.current?.draft(); });

  return (
    <div style={{ width: '100%' }} onPointerDown={() => { touched.current = true; }} onKeyDown={() => { touched.current = true; }}>
      <Form ref={form} fields={FIELDS} values={values} onValuesChange={set} onDraft={draft} onSubmit={() => wait(800)} />
    </div>
  );
}
