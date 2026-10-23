'use client';
import { useId, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './prompt-library.css';

export interface PromptBlank {
  /** The field's label, like "Section". Lowercased, it also stands in the prompt while the blank is empty */
  label: string;
  /** For a typed blank: the hint in the empty field */
  placeholder?: string;
  /** For a picked blank: the choices, in a dropdown that starts on the first */
  options?: string[];
  /** What the field says when the prompt is used with it empty. Defaults to "Fill in the <label>" */
  error?: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  /** The prompt, with each blank written as {key}, like "Rewrite {section} on {page}" */
  template: string;
  blanks: Record<string, PromptBlank>;
}

export interface PromptLibraryProps {
  prompts: SavedPrompt[];
  title?: string;
  /** The line under the title, like "Shared with DesignMe Studio" */
  subtitle?: string;
  /** The open prompt's id, or null for the list */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (id: string | null) => void;
  /** The open prompt's blanks, by key. A picked blank left out starts on its first option */
  values?: Record<string, string>;
  defaultValues?: Record<string, string>;
  onValuesChange?: (values: Record<string, string>) => void;
  /** Gets the filled prompt once every blank has a value */
  onUse?: (text: string, prompt: SavedPrompt, values: Record<string, string>) => void;
  onUndo?: () => void;
  labels?: { back?: string; note?: string; use?: string; usedTitle?: string; usedDetail?: string; undo?: string; blank?: string; blanks?: string };
  className?: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const parts = (t: string) => t.split(/(\{\w+\})/).map(p => /^\{\w+\}$/.test(p) ? { key: p.slice(1, -1) } : p);
/** Every blank's value: what was typed or picked, or a picked blank's first option */
const filled = (p: SavedPrompt, values: Record<string, string>) => Object.fromEntries(Object.entries(p.blanks).map(([k, b]) => [k, values[k] ?? b.options?.[0] ?? '']));

function Pick({ id, blank, value, wide, onChange }: { id: string; blank: PromptBlank; value: string; wide?: boolean; onChange: (v: string) => void }) {
  // the blanks sit at the foot of the card, so their lists open upward over the prompt instead of past the footer
  const menu = usePopover({ side: 'up' });
  return (
    <div className={cx('dm-plb-fd', wide && 'dm-wide')}>
      <span id={id + '-l'}>{blank.label}</span>
      <button type="button" className="dm-plb-sel" aria-labelledby={`${id}-l ${id}-v`} {...menu.trigger}><Swap className="dm-v">{cap(value)}</Swap><Icon name="chev-d" size="xs" /></button>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-plb-pop')} role="menu" aria-label={blank.label}>
        {blank.options!.map(o => (
          <button type="button" key={o} className="dm-mi" role="menuitemradio" aria-checked={o === value} onClick={() => { onChange(o); menu.closeSoon(); }}>
            <span>{cap(o)}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
      <span id={id + '-v'} hidden>{cap(value)}</span>
    </div>
  );
}

/** The studio's saved prompts, each with blanks like {page}. Opening one lays its blanks out as fields, the prompt fills
    in as they change, and it can't be used until every blank has a value. */
export function PromptLibrary({
  prompts, title = 'Prompt library', subtitle, open, defaultOpen = null, onOpenChange, values, defaultValues = {}, onValuesChange, onUse, onUndo, labels = {}, className
}: PromptLibraryProps) {
  const [cur, setCur] = useControllable(open, defaultOpen, onOpenChange);
  const [vals, setVals] = useControllable(values, defaultValues, onValuesChange);
  const [tried, setTried] = useState(false);
  const [used, setUsed] = useState(false);
  const uid = useId();
  const L = { back: 'All prompts', note: 'Fills in as you go', use: 'Use prompt', usedTitle: 'Added to your message', usedDetail: 'Ready to send to the agent', undo: 'Undo', blank: 'blank', blanks: 'blanks', ...labels };
  const count = (p: SavedPrompt) => { const n = Object.keys(p.blanks).length; return `${n} ${n === 1 ? L.blank : L.blanks}`; };
  const p = prompts.find(x => x.id === cur);
  const go = (id: string | null) => { setCur(id); setVals({}); setTried(false); setUsed(false); };

  if (!p) return (
    <div data-dm="" className={className} style={{ width: '100%' }}>
      <div className="dm-plb dm-panel"><div className="dm-plb-list dm-enter">
        <div className="dm-plb-h"><div className="dm-plb-ht"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div></div>
        <div className="dm-plb-rows">
          {prompts.map(x => (
            <button type="button" key={x.id} className="dm-plb-row" data-prompt={x.id} onClick={() => go(x.id)}>
              <span className="dm-plb-ic"><Icon name="file-text" /></span>
              <span className="dm-plb-rt"><b>{x.title}</b><span>{x.template}</span></span>
              <span className="dm-plb-n">{count(x)}</span><Icon name="chev-r" size="xs" />
            </button>
          ))}
        </div>
      </div></div>
    </div>
  );

  const all = filled(p, vals);
  const empty = Object.keys(p.blanks).filter(k => !all[k].trim());
  const keys = Object.keys(p.blanks), typed = keys.filter(k => !p.blanks[k].options), picked = keys.filter(k => p.blanks[k].options);
  const set = (k: string, v: string) => setVals({ ...vals, [k]: v });
  const use = () => {
    if (empty.length) { setTried(true); return; }
    setUsed(true); onUse?.(p.template.replace(/\{(\w+)\}/g, (m, k: string) => all[k] ?? m), p, all);
  };

  return (
    <div data-dm="" className={className} style={{ width: '100%' }}>
      <div className="dm-plb dm-panel">
        <div className={cx('dm-plb-one dm-enter', used && 'dm-used')}>
          <div className="dm-plb-h">
            <button type="button" className="dm-ib dm-plb-back" aria-label={L.back} onClick={() => go(null)}><Icon name="chev-l" /></button>
            <div className="dm-plb-ht"><b>{p.title}</b><span className="dm-muted">{count(p)}</span></div>
          </div>
          <p className="dm-plb-tp" aria-live="polite">
            {/* the prompt as it reads now: filled blanks in the accent colour, empty ones by name, and red once they were needed */}
            {parts(p.template).map((q, i) => typeof q === 'string' ? q
              : <span key={i} className={cx('dm-plb-s', !all[q.key]?.trim() && 'dm-empty', tried && !all[q.key]?.trim() && 'dm-bad')}>{all[q.key]?.trim() || p.blanks[q.key].label.toLowerCase()}</span>)}
          </p>
          <div className="dm-plb-vars" inert={used}>
            {typed.map(k => {
              const b = p.blanks[k], bad = tried && !all[k].trim(), id = `${uid}-${k}`;
              return (
                <label key={k} className={cx('dm-plb-fd dm-wide', bad && 'dm-bad')} data-k={k}>
                  <span>{b.label}</span>
                  <input className="dm-plb-in" value={vals[k] ?? ''} placeholder={b.placeholder} aria-invalid={bad} aria-describedby={id + '-e'} onChange={e => set(k, e.target.value)} />
                  <span className="dm-plb-er" id={id + '-e'} hidden={!bad}>{bad ? b.error ?? `Fill in the ${b.label.toLowerCase()}` : ''}</span>
                </label>
              );
            })}
            {/* picked blanks sit two to a row, and an odd one out takes the row */}
            {picked.map((k, i) => <Pick key={k} id={`${uid}-${k}`} blank={p.blanks[k]} value={all[k]} wide={picked.length % 2 === 1 && i === picked.length - 1} onChange={v => set(k, v)} />)}
          </div>
          {used ? (
            <div className="dm-plb-done dm-enter">
              <Icon name="ok" />
              <span className="dm-t">{L.usedTitle}<span className="dm-muted">{L.usedDetail}</span></span>
              <button type="button" className="dm-pill dm-sm" onClick={() => { setUsed(false); onUndo?.(); }}>{L.undo}</button>
            </div>
          ) : (
            <div className="dm-plb-f"><span className="dm-muted dm-plb-note">{L.note}</span><span className="dm-sp" /><button type="button" className="dm-pill dm-ink dm-sm dm-plb-use" onClick={use}>{L.use}</button></div>
          )}
        </div>
      </div>
    </div>
  );
}
