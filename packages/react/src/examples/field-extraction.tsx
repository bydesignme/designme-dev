'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { FieldExtraction, FieldZone, type ExtractedField } from '../components/field-extraction/FieldExtraction';
import { useScript } from './useScript';

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
