# Form

> A project brief with inline checks and an agent that drafts the rest.

App basics / Forms and inputs. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/form

## Install

```sh
npx designme add form          # HTML, CSS and JS, with the shared core
npx designme add form --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Form is a short form, set up as a project brief by default, with a Draft with agent button that fills the fields in for the person. Fields the agent filled carry a Drafted mark beside their label until the person edits them, so it is clear what still needs a human read. On submit every field is checked, and a confirmation replaces the form once it goes through.

### When to use it

- When an agent can fill in a brief, ticket or request from context and a person should review it
- When people need to see which answers they typed and which the agent wrote
- When a short form needs inline messages per field instead of a page of errors
- When creating something should hand off to the agent, as in "the agent is gathering references now"

### What it does

- Fields can be text, textarea or `choice`, a row of chips that picks one value.
- A `maxLength` on a text field shows a live counter like 0/40 and stops typing there.
- Passing `onDraft` adds the Draft with agent button, which shows Drafting and then Drafted while your promise runs.
- Text fields that change while the draft runs are marked Drafted until the person edits them; choice fields are not marked.
- Each field's `validate` runs on submit, shows its message under the field, and clears as soon as the value changes.
- If `onSubmit` returns a promise, the button spins until it settles; a rejection shows its message, and success shows the done screen.

### Accessibility

- Field messages render with `role="alert"`, and invalid inputs set `aria-invalid`.
- Choice chips sit in a `group` labelled with the field name, and each chip reports `aria-pressed`.
- The Drafted mark beside a label is `aria-hidden`, so it is not read into the field's name.
- The confirmation after submit has `role="status"`.

## Usage in React

```tsx
import { Form } from '@/components/designme/form/Form';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useScript, useWait } from '../lib/useScript';
import { Form, type FormField, type FormHandle, type FormValues } from './Form';

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
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` (optional) | `ReactNode` | Defaults to "New project brief" |
| `fields` | `FormField[]` |  |
| `values` (optional) | `FormValues` | The values by field key. Leave it out to let the fields hold their own |
| `defaultValues` (optional) | `FormValues` |  |
| `onValuesChange` (optional) | `(values: FormValues) => void` |  |
| `onDraft` (optional) | `() => void \| Promise<void>` | Adds "Draft with agent". Fill the values in while the promise runs; the fields it fills are marked Drafted beside their label until someone edits them |
| `draftLabel` (optional) | `string` |  |
| `draftingLabel` (optional) | `string` |  |
| `draftedLabel` (optional) | `string` |  |
| `draftedMessage` (optional) | `string` | Shown beside the submit button after a draft. Defaults to "Review what the agent drafted" |
| `onSubmit` (optional) | `(values: FormValues) => void \| Promise<void>` | Called with the values once every field passes. Return a promise and the button spins until it settles |
| `submitLabel` (optional) | `string` |  |
| `invalidMessage` (optional) | `string` | Shown beside the submit button when a field needs a look |
| `errorMessage` (optional) | `string` | Shown when onSubmit rejects without a message of its own |
| `doneTitle` (optional) | `(values: FormValues) => ReactNode` | The line after a submit. Defaults to "<first field> created" |
| `doneDetail` (optional) | `ReactNode` |  |
| `className` (optional) | `string` |  |
| `ref` (optional) | `Ref<FormHandle>` | Gives access to draft(), to start the agent's draft without a click |

## Questions

**How does the agent fill in the fields?**

Control the form with `values` and `onValuesChange`, and update the values inside your `onDraft` promise. Any text field that changes while the draft runs gets the Drafted mark.

**Can I start the agent's draft without a click?**

Yes. Put a ref on the form and call `ref.current.draft()`. It runs `onDraft` with the same Drafting and Drafted states as the button.

**How do I validate a field against another field?**

`validate` receives the field's value and all the form's values. Return a message string to block the submit, or a falsy value to let it pass.

## Source

`Form.tsx`, as `npx designme add form --react` installs it:

```tsx
'use client';
import { useEffect, useImperativeHandle, useRef, useState, type FormEvent, type ReactNode, type Ref } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Spin, Swap, Think } from '../lib/motion';
import '../designme.css';
import './form.css';

export type FormValues = Record<string, string>;

/** What a ref to the form can do */
export interface FormHandle {
  /** Runs onDraft as if "Draft with agent" were pressed, with the same Drafting and Drafted states */
  draft: () => Promise<void>;
}

export interface FormField {
  key: string;
  /** Like "Project name" */
  label: string;
  /** text (the default), textarea, or choice: a row of chips that picks one */
  type?: 'text' | 'textarea' | 'choice';
  placeholder?: string;
  /** Shows a counter like 0/40 and stops typing there */
  maxLength?: number;
  /** Rows for a textarea. Defaults to 2 */
  rows?: number;
  /** The chips of a choice field */
  options?: { value: string; label: string }[];
  autoComplete?: string;
  /** Returns the message to show when the value won't do, like "Give it a name". Checked on submit */
  validate?: (value: string, values: FormValues) => string | false | null | undefined;
}

export interface FormProps {
  /** Defaults to "New project brief" */
  title?: ReactNode;
  fields: FormField[];
  /** The values by field key. Leave it out to let the fields hold their own */
  values?: FormValues;
  defaultValues?: FormValues;
  onValuesChange?: (values: FormValues) => void;
  /** Adds "Draft with agent". Fill the values in while the promise runs; the fields it fills are marked Drafted beside their label until someone edits them */
  onDraft?: () => void | Promise<void>;
  draftLabel?: string;
  draftingLabel?: string;
  draftedLabel?: string;
  /** Shown beside the submit button after a draft. Defaults to "Review what the agent drafted" */
  draftedMessage?: string;
  /** Called with the values once every field passes. Return a promise and the button spins until it settles */
  onSubmit?: (values: FormValues) => void | Promise<void>;
  submitLabel?: string;
  /** Shown beside the submit button when a field needs a look */
  invalidMessage?: string;
  /** Shown when onSubmit rejects without a message of its own */
  errorMessage?: string;
  /** The line after a submit. Defaults to "<first field> created" */
  doneTitle?: (values: FormValues) => ReactNode;
  doneDetail?: ReactNode;
  className?: string;
  /** Gives access to draft(), to start the agent's draft without a click */
  ref?: Ref<FormHandle>;
}

/** A short form an agent can draft for you: fields that check themselves on submit, and a confirmation. */
export function Form({
  title = 'New project brief', fields, values, defaultValues = {}, onValuesChange, onDraft, draftLabel = 'Draft with agent', draftingLabel = 'Drafting',
  draftedLabel = 'Drafted', draftedMessage = 'Review what the agent drafted', onSubmit, submitLabel = 'Create brief', invalidMessage = 'A few fields need a look',
  errorMessage = 'Something went wrong, try again', doneTitle, doneDetail = 'The agent is gathering references now', className, ref
}: FormProps) {
  const [vals, setVals] = useControllable(values, defaultValues, onValuesChange);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ai, setAi] = useState<string[]>([]);
  const [draft, setDraft] = useState<'idle' | 'drafting' | 'drafted'>('idle');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const own = useRef<string | null>(null);

  // a changed value clears its field's message, whoever changed it; while a draft runs, the text fields it fills are marked Drafted
  // until the person edits them
  const before = useRef(vals);
  useEffect(() => {
    const was = before.current; before.current = vals;
    const edited = own.current; own.current = null;
    const changed = fields.filter(f => f.key !== edited && (was[f.key] ?? '') !== (vals[f.key] ?? '')).map(f => f.key);
    if (!changed.length) return;
    setErrors(e => Object.fromEntries(Object.entries(e).filter(([k]) => !changed.includes(k))));
    const filled = draft === 'drafting' ? changed.filter(k => fields.find(f => f.key === k)?.type !== 'choice') : [];
    if (filled.length) setAi(a => [...new Set([...a, ...filled])]);
  }, [vals]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (key: string, value: string) => {
    own.current = key;
    setVals({ ...vals, [key]: value });
    setErrors(({ [key]: _, ...rest }) => rest);
    setAi(a => a.filter(k => k !== key));
  };

  const runDraft = async () => {
    if (!onDraft || draft === 'drafting') return;
    setDraft('drafting');
    try { await onDraft(); } finally { setDraft('drafted'); }
    setMessage(draftedMessage);
  };
  useImperativeHandle(ref, () => ({ draft: runDraft }));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (busy) return;
    const found = { ...errors };
    for (const f of fields) { const msg = f.validate?.(vals[f.key] ?? '', vals); if (msg && !found[f.key]) found[f.key] = msg; }
    setErrors(found);
    if (fields.some(f => f.validate?.(vals[f.key] ?? '', vals))) { setMessage(invalidMessage); return; }
    setBusy(true);
    try { await onSubmit?.(vals); } catch (err) { setBusy(false); setMessage(err instanceof Error && err.message ? err.message : errorMessage); return; }
    setBusy(false); setDone(true);
  };

  if (done) {
    const first = fields[0] ? vals[fields[0].key] : '';
    return (
      <form data-dm="" className={cx('dm-fmx dm-panel', className)} noValidate onSubmit={e => e.preventDefault()}>
        <div className="dm-fmx-done" role="status">
          <Icon name="ok" className="dm-enter" />
          <b {...enter(70)}>{doneTitle ? doneTitle(vals) : `${first} created`}</b>
          <span className="dm-muted dm-enter" style={enter(140).style}>{doneDetail}</span>
        </div>
      </form>
    );
  }

  return (
    <form data-dm="" className={cx('dm-fmx dm-panel', className)} noValidate onSubmit={submit}>
      <div className="dm-fmx-h">
        <b>{title}</b>
        {onDraft && (
          <button type="button" className="dm-pill dm-soft dm-sm dm-fmx-ai" onClick={runDraft}>
            {draft === 'drafting' ? <><Think />{draftingLabel}</> : draft === 'drafted' ? <><Icon name="check" size="xs" />{draftedLabel}</> : <><Icon name="spark" size="xs" />{draftLabel}</>}
          </button>
        )}
      </div>
      {fields.map(f => {
        const value = vals[f.key] ?? '', err = errors[f.key];
        const state = cx('dm-fmx-f', err && 'dm-bad', ai.includes(f.key) && 'dm-ai');
        const note = err && <span className="dm-er" role="alert">{err}</span>;
        if (f.type === 'choice') return (
          <div key={f.key} className={state}>
            <span>{f.label}</span>
            <div className="dm-fmx-ty" role="group" aria-label={f.label}>
              {f.options?.map(o => <button type="button" key={o.value} className={cx('dm-chip dm-sm', value === o.value && 'dm-on')} aria-pressed={value === o.value} onClick={() => set(f.key, o.value)}>{o.label}</button>)}
            </div>
            {note}
          </div>
        );
        return (
          <label key={f.key} className={state}>
            <span>{f.label}<i className="dm-fmx-dr" aria-hidden="true"><Icon name="spark" size="xs" />{draftedLabel}</i></span>
            {f.type === 'textarea'
              ? <textarea name={f.key} rows={f.rows ?? 2} placeholder={f.placeholder} maxLength={f.maxLength} autoComplete={f.autoComplete} aria-invalid={!!err || undefined} value={value} onChange={e => set(f.key, e.target.value)} />
              : <input name={f.key} placeholder={f.placeholder} maxLength={f.maxLength} autoComplete={f.autoComplete} aria-invalid={!!err || undefined} value={value} onChange={e => set(f.key, e.target.value)} />}
            {f.maxLength && f.type !== 'textarea' && <em className="dm-fmx-c dm-num">{value.length}/{f.maxLength}</em>}
            {note}
          </label>
        );
      })}
      <div className="dm-fmx-ft">
        <Swap className="dm-fmx-ms dm-muted">{message}</Swap>
        <button type="submit" className="dm-pill dm-ink dm-sm dm-fmx-go">{busy ? <Spin /> : submitLabel}</button>
      </div>
    </form>
  );
}
```

## More in Forms and inputs

- [Buttons](https://designme.dev/components/buttons.md): Every button style, with loading, success and hold-to-confirm states.
- [Tooltip](https://designme.dev/components/tooltip.md): Quiet labels on hover, with shortcuts and a richer preview card.
- [Search input](https://designme.dev/components/search-input.md): Search with scoped filters, recent queries and an agent answer.
- [Country select](https://designme.dev/components/country-select.md): A searchable select with country codes, currency and keyboard support.
- [Multi-select](https://designme.dev/components/multi-select.md): A combobox that filters as you type and keeps your picks as chips.
- [Social sign-in](https://designme.dev/components/social-sign-in.md): One-tap providers that remember the last one you used.
- [Sign in](https://designme.dev/components/sign-in.md): Email first, then the one-time code from the email, copied or typed in.
- [OTP field](https://designme.dev/components/otp-field.md): A one-time code, one box per digit, that fills from a paste.
- [Payment form](https://designme.dev/components/payment-form.md): Card details with live formatting, brand detection and a clear total.

All components: https://designme.dev/llms.txt
