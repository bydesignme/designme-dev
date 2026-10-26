'use client';
import { createContext, useContext, useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
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
            <button type="button" className={cx('dm-pill dm-sm', sendState === 'sent' ? 'dm-soft' : 'dm-primary')} disabled={!ready} onClick={() => { if (sendState === 'idle') onSend?.(); }}>
              {sendState === 'sending' ? <Spin /> : sendState === 'sent' ? <><Icon name="check" size="xs" />{sentLabel}</> : sendLabel}
            </button>
          </div>
        </div>
      </div>
    </ZoneContext.Provider>
  );
}
