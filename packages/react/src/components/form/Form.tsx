'use client';
import { useEffect, useImperativeHandle, useRef, useState, type FormEvent, type ReactNode, type Ref, type RefObject } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Spin, Swap, Think, Tip, useGrow } from '../../lib/motion';
import '../../designme.css';
import './form.css';

export type FormValues = Record<string, string>;

/** What a ref to the form can do */
export interface FormHandle {
  /** Runs onDraft as if "Draft with agent" were pressed, with the same Drafting state and drafted marks */
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
  /** The chips of a choice field. A `tone` gives the option its core tag colour: a dot in it at rest, and its tint and text colour once picked */
  options?: { value: string; label: string; tone?: 'b' | 'l' | 'm' | 'p' | 'r' | 'y' | 'k' | 't' }[];
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
  /** Adds "Draft with agent". Fill the values in while the promise runs; the fields it fills get a small sparkle after their label until someone edits them */
  onDraft?: () => void | Promise<void>;
  draftLabel?: string;
  draftingLabel?: string;
  /** The sparkle's tooltip and its name for screen readers. Defaults to "Drafted by the agent" */
  draftedLabel?: string;
  /** Shown beside the submit button after a draft. Defaults to "Review what the agent drafted" */
  draftedMessage?: string;
  /** Called with the values once every field passes. Return a promise and the button shows a spinner and submittingLabel until it settles */
  onSubmit?: (values: FormValues) => void | Promise<void>;
  submitLabel?: string;
  /** On the button while onSubmit's promise runs. Defaults to "Creating" */
  submittingLabel?: string;
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

/** A button whose words change eases to their width, with no room kept for the longer ones */
function useEaseWidth(ref: RefObject<HTMLElement | null>, key: unknown) {
  const reduce = useReducedMotion(), w = useRef(0);
  useIsoLayoutEffect(() => {
    const el = ref.current; if (!el) return;
    const w1 = el.offsetWidth, w0 = w.current; w.current = w1;
    if (!w0 || reduce || Math.abs(w1 - w0) < .5) return;
    const cs = getComputedStyle(el);
    el.animate([{ width: w0 + 'px' }, { width: w1 + 'px' }], { duration: (parseFloat(cs.getPropertyValue('--dm-t')) || .34) * 1000, easing: cs.getPropertyValue('--dm-ease').trim() || 'ease' });
  }, [key]);
}

/** A short form an agent can draft for you: fields that check themselves on submit, and a confirmation. The card grows with
    its messages and eases to the confirmation's height, keeping no room for either. */
export function Form({
  title = 'New project brief', fields, values, defaultValues = {}, onValuesChange, onDraft, draftLabel = 'Draft with agent', draftingLabel = 'Drafting',
  draftedLabel = 'Drafted by the agent', draftedMessage = 'Review what the agent drafted', onSubmit, submitLabel = 'Create brief', submittingLabel = 'Creating', invalidMessage = 'A few fields need a look',
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
  const [outer, inner] = useGrow<HTMLFormElement>();
  const ai_ = useRef<HTMLButtonElement>(null), go = useRef<HTMLButtonElement>(null);
  useEaseWidth(ai_, draft); useEaseWidth(go, busy);

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

  const first = fields[0] ? vals[fields[0].key] : '';
  return (
    <form ref={outer} data-dm="" className={cx('dm-fmx dm-panel dm-growing', className)} noValidate onSubmit={done ? e => e.preventDefault() : submit}>
      <div ref={inner} className="dm-grow">
        {done ? (
          <div className="dm-fmx-done" role="status">
            <Icon name="ok" className="dm-enter" />
            <b {...enter(70)}>{doneTitle ? doneTitle(vals) : `${first} created`}</b>
            <span className="dm-muted dm-enter" style={enter(140).style}>{doneDetail}</span>
          </div>
        ) : <>
          <div className="dm-fmx-h">
            <b>{title}</b>
            {onDraft && (
              <button ref={ai_} type="button" className="dm-pill dm-line dm-sm dm-fmx-ai" onClick={runDraft}>
                {draft === 'drafting' ? <><Think /><span className="dm-shim">{draftingLabel}</span></> : <><Icon name="spark" size="xs" />{draftLabel}</>}
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
                  {f.options?.map(o => <button type="button" key={o.value} data-tone={o.tone} className={cx('dm-chip dm-sm', value === o.value && 'dm-on')} aria-pressed={value === o.value} onClick={() => set(f.key, o.value)}>{o.label}</button>)}
                </div>
                {note}
              </div>
            );
            return (
              <label key={f.key} className={state}>
                <span>{f.label}<Tip label={draftedLabel} off={!ai.includes(f.key)}><i className="dm-fmx-dr" role="img" aria-label={draftedLabel}><Icon name="spark" size="xs" /></i></Tip></span>
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
            <button ref={go} type="submit" className="dm-pill dm-primary dm-sm dm-fmx-go">{busy ? <><Spin /><span className="dm-shim">{submittingLabel}</span></> : submitLabel}</button>
          </div>
        </>}
      </div>
    </form>
  );
}
