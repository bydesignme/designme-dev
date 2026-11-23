'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useCopied, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { enter, Tip } from '../../lib/motion';
import '../../designme.css';
import './code-viewer.css';

/** k keyword, s string, f function, cm comment, tg tag, at attribute */
export type CodeToken = 'k' | 's' | 'f' | 'cm' | 'tg' | 'at';
/** Plain text, or [token, text] for a highlighted piece */
export type CodePiece = string | [CodeToken, string];

export interface CodeLine {
  /** The line as plain text, or as pieces to highlight */
  code: string | CodePiece[];
  /** The agent changed this line: its number turns green and the line gets a wash */
  changed?: boolean;
  /** What the agent says about the line when you click it */
  note?: string;
}

export interface CodeFile {
  /** Shown on the tab, like "PlanCard.tsx" */
  name: string;
  lines: CodeLine[];
}

export interface CodeViewerProps {
  files: CodeFile[];
  /** The open file, by name. Leave it out to let the tabs switch it */
  file?: string;
  defaultFile?: string;
  onFileChange?: (name: string) => void;
  /** The line whose note is open (0 is the first line), or null. Leave it out to let a click on a line open it */
  line?: number | null;
  defaultLine?: number | null;
  onLineChange?: (line: number | null) => void;
  /** How long a note says "Reading the line" before it answers, in ms */
  delay?: number;
  /** The note for a line the agent didn't change and has nothing to say about */
  unchangedNote?: string;
  /** Called with the file's text when it is copied */
  onCopy?: (text: string) => void;
  className?: string;
}

const TOKEN: Record<CodeToken, string> = { k: 'dm-k', s: 'dm-s', f: 'dm-f', cm: 'dm-cm', tg: 'dm-tg', at: 'dm-at' };
const text = (code: CodeLine['code']) => typeof code === 'string' ? code : code.map(p => typeof p === 'string' ? p : p[1]).join('');

/** The note under a clicked line: it reads for a moment, then crossfades to what the agent says */
function Note({ note, delay }: { note: string; delay: number }) {
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<'reading' | 'out' | 'said'>('reading');
  useEffect(() => {
    const a = setTimeout(() => setPhase('out'), delay);
    const b = setTimeout(() => setPhase('said'), delay + (reduce ? 0 : 170));
    return () => { clearTimeout(a); clearTimeout(b); };
  }, [delay, reduce]);
  // it opens its own height, so the code under it moves down smoothly instead of jumping
  const box = useRef<HTMLDivElement>(null);
  useIsoLayoutEffect(() => {
    const n = box.current; if (!n || reduce || !n.animate) return;
    const cs = getComputedStyle(n), ease = cs.getPropertyValue('--dm-ease').trim() || 'ease';
    n.animate([{ height: '0px', marginTop: '0px', marginBottom: '0px', paddingTop: '0px', paddingBottom: '0px', opacity: 0, overflow: 'hidden' },
      { height: cs.height, marginTop: cs.marginTop, marginBottom: cs.marginBottom, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, opacity: 1, overflow: 'hidden' }], { duration: 420, easing: ease });
  }, []);
  return (
    <div ref={box} className="dm-cvx-note" aria-live="polite">
      <Icon name="spark" size="xs" />
      <span className={cx('dm-sw', phase === 'out' && 'dm-out')}>{phase === 'said' ? note : <span className="dm-shim">Reading the line</span>}</span>
    </div>
  );
}

/** A file the agent changed, with its changed lines marked. Click a line and the agent explains it. */
export function CodeViewer({ files, file, defaultFile, onFileChange, line, defaultLine = null, onLineChange, delay = 600, unchangedNote = 'Unchanged. The agent kept this line as it was.', onCopy, className }: CodeViewerProps) {
  const [name, setName] = useControllable(file, defaultFile ?? files[0]?.name ?? '', onFileChange);
  const [open, setOpen] = useControllable(line, defaultLine, onLineChange);
  const [copied, copy] = useCopied();
  const cur = files.find(f => f.name === name) ?? files[0];
  const changed = cur?.lines.filter(l => l.changed).length ?? 0;

  const pick = (n: string) => { if (n === name) return; setName(n); setOpen(null); };
  const ask = (k: number) => setOpen(open === k ? null : k);
  const key = (e: KeyboardEvent, k: number) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); ask(k); } };
  const copyFile = () => { const t = cur.lines.map(l => text(l.code)).join('\n'); copy(t); onCopy?.(t); };

  return (
    <div data-dm="" className={cx('dm-cvx dm-panel', className)}>
      <div className="dm-cvx-h">
        <div className="dm-cvx-tabs" role="tablist">
          {files.map(f => <button key={f.name} type="button" role="tab" aria-selected={f === cur} className={cx('dm-cvx-tab', f === cur && 'dm-on')} onClick={() => pick(f.name)}>{f.name}</button>)}
        </div>
        <span className="dm-cvx-meta dm-num"><b>+{changed}</b> changed</span>
        <Tip label={copied ? 'Copied to clipboard' : 'Copy'} open={copied}>
          <button type="button" className={cx('dm-ib', copied && 'dm-copied')} aria-label="Copy file" onClick={copyFile}><Icon name={copied ? 'check' : 'copy'} /></button>
        </Tip>
      </div>
      <div className="dm-cvx-body">
        <pre className="dm-cvx-code">
          {cur?.lines.map((l, k) => {
            const e = enter(k * 18), on = open === k;
            return [
              <div key={cur.name + k} className={cx('dm-cvx-l', l.changed && 'dm-new', on && 'dm-on', e.className)} style={e.style}
                role="button" tabIndex={0} aria-expanded={on} onClick={() => ask(k)} onKeyDown={ev => key(ev, k)}>
                <span className="dm-n">{k + 1}</span>
                <span className="dm-c">{typeof l.code === 'string' ? l.code || ' ' : l.code.length ? l.code.map((p, j) => typeof p === 'string' ? p : <span key={j} className={TOKEN[p[0]]}>{p[1]}</span>) : ' '}</span>
              </div>,
              on && <Note key={cur.name + k + 'n'} note={l.note ?? unchangedNote} delay={delay} />
            ];
          })}
        </pre>
      </div>
    </div>
  );
}
