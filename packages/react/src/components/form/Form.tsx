'use client';
import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Spin, Swap, Think } from '../../lib/motion';
import '../../designme.css';
import './form.css';

export type FormValues = Record<string, string>;

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
  /** Adds "Draft with agent". Fill the values in while the promise runs and the fields it fills turn blue until someone edits them */
  onDraft?: () => void | Promise<void>;
  draftLabel?: string;
  draftingLabel?: string;
  draftedLabel?: string;
  /** Shown beside the submit button after a draft. Defaults to "Review the blue fields" */
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
}

/** A short form an agent can draft for you: fields that check themselves on submit, and a confirmation. */
export function Form({
  title = 'New project brief', fields, values, defaultValues = {}, onValuesChange, onDraft, draftLabel = 'Draft with agent', draftingLabel = 'Drafting',
  draftedLabel = 'Drafted', draftedMessage = 'Review the blue fields', onSubmit, submitLabel = 'Create brief', invalidMessage = 'A few fields need a look',
  errorMessage = 'Something went wrong, try again', doneTitle, doneDetail = 'The agent is gathering references now', className
}: FormProps) {
  const [vals, setVals] = useControllable(values, defaultValues, onValuesChange);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ai, setAi] = useState<string[]>([]);
  const [draft, setDraft] = useState<'idle' | 'drafting' | 'drafted'>('idle');
  const [message, setMessage] = useState('');
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const own = useRef<string | null>(null);

  // a changed value clears its field's message, whoever changed it; while a draft runs, the text fields it fills turn blue
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
            <span>{f.label}</span>
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
