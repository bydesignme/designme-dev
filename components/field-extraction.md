# Field extraction

> The agent pulls fields out of a document and shows where each came from.

Agent components / Sources and output. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/field-extraction

## Install

```sh
npx designme add field-extraction          # HTML, CSS and JS, with the shared core
npx designme add field-extraction --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Field extraction shows a document next to the fields an agent reads from it, such as an invoice number, date and total. Each field shows how sure the agent is, lights up the part of the page it came from, and asks the person to check it when confidence is low.

### When to use it

- When an agent pulls structured data out of invoices, receipts, forms or contracts.
- When people need to see where on the page each value came from.
- When low-confidence values should be checked by a person before the data is saved.
- When the result goes on to another tool, like a spreadsheet, once everything is confirmed.

### What it does

- Wrap parts of your `page` in `FieldZone` with a field key. The zone lights up when its field arrives, when the field is hovered and while it is checked.
- Each field shows a `label`, a `value` and a confidence bar. Fields under 0.6 confidence show a Check button and mark their zone.
- Check turns the value into an editable field, prefilled with `suggestion` if given. Enter or clicking away confirms and calls `onFix(key, value)`.
- Set `fixed` on a checked field and it shows "Fixed" with a full bar.
- `reading` sends a scan line down the page each time it turns true, and the status line crossfades as `status` changes.
- The send button stays disabled until reading has stopped and every field is sure or fixed. `sendState` moves it through idle, sending and sent.

### Accessibility

- The value being checked is an editable `role="textbox"` with `aria-label="Value"`, focused when it opens. Enter confirms it.
- The scan line is `aria-hidden`.
- The send button is a disabled button while fields still need checking.

## Usage in React

```tsx
import { FieldExtraction } from '@/components/designme/field-extraction/FieldExtraction';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { FieldExtraction, FieldZone, type ExtractedField } from './FieldExtraction';
import { useScript } from '../lib/useScript';

/* ---------- Field extraction: the agent reads an invoice field by field, one date is smudged and needs a look ---------- */
const FOUND: ExtractedField[] = [
  { key: 'no', label: 'Invoice no.', value: 'NW-2041', confidence: 0.99 },
  { key: 'date', label: 'Issued', value: '2026-10-03', confidence: 0.97 },
  { key: 'total', label: 'Total', value: '$11,480.00', confidence: 0.98 },
  { key: 'due', label: 'Due by', value: '2026-11-1?', confidence: 0.41, suggestion: '2026-11-1' }
];

const INVOICE = (
  <>
    <div className="dm-fex-top"><b>Northwind Studio</b><span className="dm-muted">Invoice</span></div>
    <FieldZone field="no"><span className="dm-muted">Invoice no.</span> <span className="dm-num">NW-2041</span></FieldZone>
    <FieldZone field="date"><span className="dm-muted">Issued</span> <span className="dm-num">3 Oct 2026</span></FieldZone>
    <div className="dm-fex-tb">
      <div className="dm-fex-li"><span>Design system audit</span><span className="dm-num">$4,800.00</span></div>
      <div className="dm-fex-li"><span>Pricing page redesign</span><span className="dm-num">$6,200.00</span></div>
      <div className="dm-fex-li"><span>Agent setup, 2 seats</span><span className="dm-num">$480.00</span></div>
    </div>
    <FieldZone field="total" className="dm-fex-tot"><span>Total due</span><span className="dm-num">$11,480.00</span></FieldZone>
    <FieldZone field="due" className="dm-fex-smudge"><span className="dm-muted">Due by</span> <span className="dm-num">1? Nov 2026</span></FieldZone>
  </>
);

export default function FieldExtractionDemo() {
  const [fields, setFields] = useState<ExtractedField[]>([]);
  const [reading, setReading] = useState(false);
  const [status, setStatus] = useState('Reading page 1');
  const [send, setSend] = useState<'idle' | 'sending' | 'sent'>('idle');
  const later = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(later.current), []);
  useScript(async ({ wait }) => {
    await wait(300); setReading(true);
    for (const f of FOUND) { await wait(560); setFields(list => [...list, f]); }
    await wait(400); setReading(false); setStatus('1 field needs a look');
  });
  // the day is the smudged digit; anything left unfinished becomes the 14th, as the agent guessed
  const fix = (key: string, value: string) => {
    setFields(list => list.map(f => f.key === key ? { ...f, value: /\d\d$/.test(value) ? value : '2026-11-14', fixed: true } : f));
    setStatus('All fields confirmed');
  };
  const sendRow = () => {
    setSend('sending');
    later.current = setTimeout(() => { setSend('sent'); setStatus('1 row added to Invoices 2026'); }, 800);
  };
  return (
    <div style={{ width: '100%' }}>
      <FieldExtraction page={INVOICE} fields={fields} reading={reading} status={status} checkHint="Type the day you see" onFix={fix}
        sendLabel="Send to Sheets" sentLabel="Added to Invoices" sendState={send} onSend={sendRow} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `page` | `ReactNode` | The page being read, on the left. Wrap the parts the fields come from in FieldZone |
| `fields` | `ExtractedField[]` | The fields found so far, in order. Each new one slides in and its zone lights up for a moment |
| `reading` (optional) | `boolean` | A scan line passes down the page each time this turns true, and Send waits while it is true |
| `status` (optional) | `string` | The quiet line by the title, like "Reading page 1". Crossfades when it changes |
| `checkHint` (optional) | `string` | Replaces the status while a field is being checked |
| `onFix` (optional) | `(key: string, value: string) => void` | Called when a checked field is confirmed with Enter or by clicking away |
| `title` (optional) | `string` |  |
| `sendLabel` (optional) | `string` | The button under the fields. It waits until every field is sure or checked |
| `sendState` (optional) | `'idle' \| 'sending' \| 'sent'` | idle shows sendLabel, sending a spinner, sent a check and sentLabel |
| `sentLabel` (optional) | `string` |  |
| `onSend` (optional) | `() => void` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I link a field to the spot on the page it came from?**

Wrap that part of the page in `<FieldZone field="key">` using the same `key` as the field. The component handles the highlight.

**What counts as a field that needs checking?**

Any field with `confidence` below 0.6 that is not marked `fixed`. Those fields block the send button until the person checks them.

**Does checking a field update its value by itself?**

No. It calls `onFix` with the key and the typed value. Update the field in your state and set `fixed: true` to show it as confirmed.

**Can I stream fields in one by one?**

Yes. Append to `fields` as the agent finds them. Each new field slides in and briefly lights its zone on the page.

## Source

`FieldExtraction.tsx`, as `npx designme add field-extraction --react` installs it:

```tsx
'use client';
import { createContext, useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Spin, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './field-extraction.css';

export interface ExtractedField {
  /** Ties the field to the FieldZone it was read from */
  key: string;
  /** Like "Invoice no." */
  label: string;
  value: string;
  /** 0 to 1. Under 0.6 the field asks the person to check it */
  confidence: number;
  /** What the value starts as when the person checks it, like the value without its unsure digit */
  suggestion?: string;
  /** The person has checked it. Shows "Fixed" with a full bar */
  fixed?: boolean;
}

export interface FieldExtractionProps {
  /** The page being read, on the left. Wrap the parts the fields come from in FieldZone */
  page: ReactNode;
  /** The fields found so far, in order. Each new one slides in and its zone lights up for a moment */
  fields: ExtractedField[];
  /** A scan line passes down the page each time this turns true, and Send waits while it is true */
  reading?: boolean;
  /** The quiet line by the title, like "Reading page 1". Crossfades when it changes */
  status?: string;
  /** Replaces the status while a field is being checked */
  checkHint?: string;
  /** Called when a checked field is confirmed with Enter or by clicking away */
  onFix?: (key: string, value: string) => void;
  title?: string;
  /** The button under the fields. It waits until every field is sure or checked */
  sendLabel?: string;
  /** idle shows sendLabel, sending a spinner, sent a check and sentLabel */
  sendState?: 'idle' | 'sending' | 'sent';
  sentLabel?: string;
  onSend?: () => void;
  className?: string;
}

const needsCheck = (f: ExtractedField) => f.confidence < 0.6 && !f.fixed;

type Zones = { lit: string | null; scan: string[]; warn: string[] };
const ZoneContext = createContext<Zones>({ lit: null, scan: [], warn: [] });

/** A part of the page a field was read from. It lights up while its field is read, hovered or checked */
export function FieldZone({ field, className, children }: { field: string; className?: string; children: ReactNode }) {
  const z = useContext(ZoneContext);
  return <div className={cx('dm-fex-z', z.scan.includes(field) && 'dm-scan', z.warn.includes(field) && 'dm-warn', z.lit === field && 'dm-hl', className)}>{children}</div>;
}

/** The value while it is being checked: the person types into the field itself */
function Editing({ start, onDone }: { start: string; onDone: (value: string) => void }) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);
  useIsoLayoutEffect(() => {
    const v = ref.current; if (!v) return;
    v.textContent = start; v.focus();
    const s = getSelection(); s?.selectAllChildren(v); s?.collapseToEnd();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const finish = () => { if (done.current) return; done.current = true; onDone(ref.current?.textContent ?? start); };
  const key = (e: KeyboardEvent) => { if (e.key === 'Enter') { e.preventDefault(); finish(); } };
  return <span ref={ref} className="dm-v dm-num" contentEditable="true" suppressContentEditableWarning role="textbox" aria-label="Value" onKeyDown={key} onBlur={finish} />;
}

/** Fields an agent reads off a document, each with how sure it is. Unsure ones ask the person to check them. */
export function FieldExtraction({ page, fields, reading = false, status = '', checkHint = 'Type the value you see', onFix, title = 'Extracted fields',
  sendLabel = 'Send', sendState = 'idle', sentLabel = 'Sent', onSend, className }: FieldExtractionProps) {
  const [hover, setHover] = useState<string | null>(null);
  const [editing, setEditing] = useState<string | null>(null);

  // a new field lights its zone for half a second
  const [scan, setScan] = useState<string[]>([]);
  const known = useRef(new Set(fields.map(f => f.key)));
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  useEffect(() => {
    const fresh = fields.map(f => f.key).filter(k => !known.current.has(k));
    if (!fresh.length) return;
    fresh.forEach(k => known.current.add(k));
    setScan(s => [...s, ...fresh]);
    timers.current.push(setTimeout(() => setScan(s => s.filter(k => !fresh.includes(k))), 500));
  }, [fields]);

  // each time reading starts, a new scan line passes down the page; it stays parked below the page after
  const [passes, setPasses] = useState(reading ? 1 : 0);
  const [wasReading, setWasReading] = useState(reading);
  if (reading !== wasReading) { setWasReading(reading); if (reading) setPasses(p => p + 1); }

  const zones: Zones = { lit: editing ?? hover, scan, warn: fields.filter(needsCheck).map(f => f.key) };
  const ready = !reading && fields.length > 0 && !fields.some(needsCheck);

  return (
    <ZoneContext.Provider value={zones}>
      <div data-dm="" className={cx('dm-fex', className)}>
        <div className="dm-fex-doc">
          <div className="dm-fex-pg">{page}</div>
          {passes > 0 && <div key={passes} className="dm-fex-beam dm-go" aria-hidden="true" />}
        </div>
        <div className="dm-fex-side dm-panel">
          <div className="dm-fex-sh"><b>{title}</b><Swap className="dm-muted dm-fex-st">{editing ? checkHint : status}</Swap></div>
          <div className="dm-fex-list">
            {fields.map(f => {
              const warn = needsCheck(f), pct = Math.round(f.confidence * 100);
              return (
                <div key={f.key} className={cx('dm-fex-r', warn && 'dm-warn', 'dm-enter')} onMouseEnter={() => setHover(f.key)} onMouseLeave={() => setHover(h => h === f.key ? null : h)}>
                  <span className="dm-k">{f.label}</span>
                  {editing === f.key
                    ? <Editing key="edit" start={f.suggestion ?? f.value} onDone={v => { setEditing(null); onFix?.(f.key, v); }} />
                    : <span key="view" className="dm-v dm-num">{f.value}</span>}
                  {warn
                    ? <span className="dm-fex-cf"><Tip label={`${pct}% sure, check it`}><button type="button" className="dm-fex-fix" onClick={() => setEditing(f.key)}><Icon name="edit" size="xs" />Check</button></Tip></span>
                    : <span key={f.fixed ? 'fixed' : 'sure'} className={cx('dm-fex-cf', f.fixed && 'dm-enter')}><i><b style={{ width: (f.fixed ? 100 : pct) + '%' }} /></i>{f.fixed ? 'Fixed' : pct + '%'}</span>}
                </div>
              );
            })}
          </div>
          <div className="dm-fex-f">
            <button type="button" className={cx('dm-pill dm-sm', sendState === 'sent' ? 'dm-soft' : 'dm-ink')} disabled={!ready} onClick={() => { if (sendState === 'idle') onSend?.(); }}>
              {sendState === 'sending' ? <Spin /> : sendState === 'sent' ? <><Icon name="check" size="xs" />{sentLabel}</> : sendLabel}
            </button>
          </div>
        </div>
      </div>
    </ZoneContext.Provider>
  );
}
```

## More in Sources and output

- [Code viewer](https://designme.dev/components/code-viewer.md): Code the agent wrote, with line notes you can ask about.
- [Terminal stream](https://designme.dev/components/terminal-stream.md): Shell commands the agent runs, with their output as it streams in.
- [Citation hover card](https://designme.dev/components/citation-hover-card.md): Hover a citation to see the exact passage it came from.
- [Source stack](https://designme.dev/components/source-stack.md): Everything the agent read, folded into one quiet pill.
- [Metric insight](https://designme.dev/components/metric-insight.md): A number, its trend, and the agent's read on why it moved.
- [Details panel](https://designme.dev/components/details-panel.md): Properties of a run you can change in place.
- [Task table](https://designme.dev/components/task-table.md): Agent tasks in a sortable table with bulk actions.

All components: https://designme.dev/llms.txt
