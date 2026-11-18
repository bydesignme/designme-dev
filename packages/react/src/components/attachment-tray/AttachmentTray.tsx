'use client';
import { useEffect, useRef, useState, type ChangeEvent, type CSSProperties, type DragEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useIsoLayoutEffect } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './attachment-tray.css';

export interface Attachment {
  id: string;
  name: string;
  /** In bytes */
  size: number;
  /** 0 to 100. The ring closes and the row fills with the file type's colour; at 100 the ring turns into a check */
  progress: number;
  /** After the upload, while the agent reads the file: a spinner, and "Reading" shimmering after the size */
  reading?: boolean;
  /** What the agent found once it has read the file, like "12 pages", shown after the size */
  detail?: string;
}

export interface AttachmentTrayProps {
  files: Attachment[];
  /** Files the person dropped on the tray or picked with the file dialog */
  onFiles?: (files: File[]) => void;
  /** Adds a remove button to each file. Called once the file has animated out */
  onRemove?: (id: string) => void;
  /** The drop zone's heading (in Clean, the empty state's title) */
  title?: ReactNode;
  /** A link after "or" in the drop zone, like "add sample files". In Clean it is a button under the empty state, its label
   *  starting with a capital ("Add sample files") */
  action?: { label: string; onClick: () => void };
  /** Passed to the file input, like "image/*,.pdf" */
  accept?: string;
  /** The line under the list. Defaults to how many files the agent can read */
  summary?: string;
  /** Shows the drop zone as if a file were being dragged over it, for a scripted demo. A real drag shows it by itself */
  dragging?: boolean;
  className?: string;
}

// the badge for a file type: its letters, its colour and its background
const kind = (name: string): [string, string, string] => {
  const e = (name.split('.').pop() || '').toLowerCase();
  if (e === 'pdf') return ['PDF', 'var(--dm-pr)', 'var(--dm-pr-bg)'];
  if (/png|jpg|jpeg|gif|webp|fig/.test(e)) return [e.toUpperCase().slice(0, 3), 'var(--dm-pl)', 'var(--dm-pl-bg)'];
  if (/csv|xlsx/.test(e)) return ['CSV', 'var(--dm-pm)', 'var(--dm-pm-bg)'];
  return [e.toUpperCase().slice(0, 3) || 'TXT', 'var(--dm-pb)', 'var(--dm-pb-bg)'];
};
const bytes = (b: number) => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
const RING = 50.3;

function Item({ file, delay, onRemove, clean }: { file: Attachment; delay: number; onRemove?: (id: string) => void; clean?: boolean }) {
  const [leaving, setLeaving] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const [label, fg, bg] = kind(file.name), p = Math.max(0, Math.min(100, file.progress)) / 100, up = p >= 1;
  const meta = !up ? `${bytes(file.size)} · ${Math.round(p * 100)}%` : file.detail && !file.reading ? `${bytes(file.size)} · ${file.detail}` : bytes(file.size);
  return (
    <div className={cx('dm-atx-it', up && 'dm-up', leaving ? 'dm-leave' : 'dm-enter')}
      style={{ '--dm-c': fg, '--dm-cb': bg, '--dm-p': `${(p * 100).toFixed(1)}%`, ...(leaving ? {} : { animationDelay: delay + 'ms' }) } as CSSProperties}>
      {/* Clean: one neutral circle for every file type (the type's hue is Soft's and Blueprint's) */}
      <span className="dm-atx-ti">{label}</span>
      <span className="dm-atx-n"><span className="dm-atx-nm">{file.name}</span>
        {/* the percentage counts in place; the line crossfades when the file moves on to being read and to what was found */}
        {!up ? <span className="dm-atx-m dm-num">{meta}</span>
          : file.reading ? <span className="dm-atx-m"><span className="dm-shim">{bytes(file.size)} · Reading</span></span> : <Swap className="dm-atx-m">{meta}</Swap>}
      </span>
      {up
        ? file.reading ? <span className="dm-atx-rd"><span className="dm-spin" aria-hidden="true" /></span>
          // Clean: a green disc lands and its tick draws itself
          : <span className="dm-atx-ok">{clean ? <span className="dm-atx-okc"><svg viewBox="0 0 16 16" aria-hidden="true"><path pathLength={1} d="M4.6 8.3l2.3 2.3 4.5-4.8" /></svg></span> : <Icon name="ok" />}</span>
        : <svg className="dm-atx-ring" viewBox="0 0 22 22" role="progressbar" aria-label={`Uploading ${file.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)}>
            <circle cx="11" cy="11" r="8" fill="none" stroke="var(--dm-line)" strokeWidth="2" />
            <circle cx="11" cy="11" r="8" fill="none" stroke={fg} strokeWidth="2" strokeLinecap="round" strokeDasharray={RING} transform="rotate(-90 11 11)" style={{ strokeDashoffset: RING * (1 - p) }} />
          </svg>}
      {onRemove && (
        <Tip label="Remove">
          <button type="button" className="dm-ib" aria-label={`Remove ${file.name}`} disabled={leaving}
            onClick={() => { setLeaving(true); t.current = setTimeout(() => onRemove(file.id), 320); }}><Icon name="x" size="xs" /></button>
        </Tip>
      )}
      {/* Clean: the divider under the text, which is the upload's rail; its ink fill follows the progress */}
      {clean && <span className="dm-atx-ln" aria-hidden="true"><i /></span>}
    </div>
  );
}

/** The dashed edge of the drop zone, drawn in SVG so its dashes can march around the corners. It follows the zone's size and
 *  corner radius, and spaces the dashes so they meet evenly all the way round */
function Ants() {
  const svg = useRef<SVGSVGElement>(null);
  const [g, setG] = useState<{ w: number; h: number; rx: number; ap: number; ag: number } | null>(null);
  useIsoLayoutEffect(() => {
    // the drop zone is the parent; its own ref isn't attached yet when this first runs
    const el = svg.current?.parentElement; if (!el) return;
    const fit = () => {
      const w = el.offsetWidth, h = el.offsetHeight; if (!w || !h) return;
      const k = .75, rx = Math.max(0, Math.min(parseFloat(getComputedStyle(el).borderTopLeftRadius) || 0, w / 2, h / 2) - k);
      const per = 2 * (w + h - 4 * k) - (8 - 2 * Math.PI) * rx, step = per / Math.max(8, Math.round(per / 11));
      setG({ w: w - 2 * k, h: h - 2 * k, rx, ap: step, ag: step - 4.5 });
    };
    fit();
    const ro = new ResizeObserver(fit); ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <svg ref={svg} className="dm-atx-ants" aria-hidden="true">
      {g && <rect x={.75} y={.75} width={g.w} height={g.h} rx={g.rx} style={{ '--dm-ap': g.ap + 'px', '--dm-ag': g.ag + 'px' } as CSSProperties} />}
    </svg>
  );
}

/** Drop files for the agent and watch each one upload, in its file type's colour, then get read. */
export function AttachmentTray({ files, onFiles, onRemove, title = 'Drop files here', action, accept, summary, dragging, className }: AttachmentTrayProps) {
  const [over, setOver] = useState(false);
  // files that arrive together come in one after another
  const ids = files.map(f => f.id).join('\u0000');
  const [seen, setSeen] = useState<{ ids: string; delay: Record<string, number> }>({ ids, delay: {} });
  if (seen.ids !== ids) {
    const old = new Set(seen.ids.split('\u0000')), delay = { ...seen.delay };
    let k = 0; for (const f of files) if (!old.has(f.id)) delay[f.id] = k++ * 80;
    setSeen({ ids, delay });
  }
  const hold = (e: DragEvent) => { e.preventDefault(); setOver(true); };
  // in Clean the card holds the rows and buttons, so moving between them is not leaving it
  const leave = (e: DragEvent) => { if (clean && e.currentTarget.contains(e.relatedTarget as Node | null)) return; setOver(false); };
  const dropped = (e: DragEvent) => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) onFiles?.(Array.from(e.dataTransfer.files)); };
  const picked = (e: ChangeEvent<HTMLInputElement>) => { if (e.target.files?.length) onFiles?.(Array.from(e.target.files)); e.target.value = ''; };
  const read = files.filter(f => f.progress >= 100 && !f.reading).length;
  const line = summary ?? (read ? `The agent can read ${read} ${read > 1 ? 'files' : 'file'} now` : '');
  // Clean (data-style="clean" on the page or around the tray) is a card that grows with its files and is the drop target
  // as a whole. Empty, it shows Clean's empty state (a sketch of a file list, the title, a browse link and the action as a
  // button); with files, a foot strip holds the count, which rolls, and Add files. Soft and Blueprint are as they were
  const root = useRef<HTMLDivElement>(null), inner = useRef<HTMLDivElement>(null);
  const [clean, setClean] = useState(false);
  useIsoLayoutEffect(() => { setClean(root.current?.closest('[data-style]')?.getAttribute('data-style') === 'clean'); }, []);
  useIsoLayoutEffect(() => {
    const el = root.current, w = inner.current;
    if (!clean || !el || !w || typeof ResizeObserver === 'undefined') return;
    let first = true;
    const fit = () => {
      const h = Math.ceil(w.getBoundingClientRect().height);
      if (first) { el.style.transition = 'none'; el.style.height = h + 'px'; void el.offsetHeight; el.style.transition = ''; first = false; }
      else el.style.height = h + 'px';
    };
    const ro = new ResizeObserver(fit); ro.observe(w); fit();
    return () => { ro.disconnect(); el.style.height = ''; };
  }, [clean]);

  const list = <div className="dm-atx-list">{files.map(f => <Item key={f.id} file={f} delay={seen.delay[f.id] ?? 0} onRemove={onRemove} clean={clean} />)}</div>;
  const body = !clean ? (<>
      <label className={cx('dm-atx-drop', (over || dragging) && 'dm-over')} onDragEnter={hold} onDragOver={hold} onDragLeave={leave} onDrop={dropped}>
        <input type="file" multiple accept={accept} className="dm-atx-file" aria-label="Choose files" onChange={picked} />
        <Ants />
        <span className="dm-atx-ic"><Icon name="upload" /></span>
        <b>{title}</b>
        {action && <span className="dm-muted">or <button type="button" className="dm-atx-sample" onClick={action.onClick}>{action.label}</button></span>}
      </label>
      {list}
      <Swap className="dm-atx-sum dm-muted">{line}</Swap>
  </>) : (<>
      {list}
      {/* the empty state comes after the list so CSS shows it only while the list is empty, and the strip only once it isn't */}
      <div className="dm-atx-em">
        <span className="dm-atx-em-art" aria-hidden="true" />
        <b>{title}</b>
        <span>or <label className="dm-atx-br">browse your files<input type="file" multiple accept={accept} className="dm-atx-file" aria-label="Choose files" onChange={picked} /></label></span>
        {action && <button type="button" className="dm-pill dm-line dm-sm dm-atx-smp" onClick={action.onClick}><Icon name="plus" size="xs" />{action.label.charAt(0).toUpperCase() + action.label.slice(1)}</button>}
      </div>
      <div className="dm-atx-ft">
        <div className="dm-atx-sum dm-muted">{line && <>
          <span className="dm-atx-tk"><Icon name="check" size="xs" /></span>
          {summary != null ? <span>{summary}</span>
            : <span>The agent can read <span className="dm-atx-roll dm-num"><i key={read} className="dm-in">{read}</i></span> {read > 1 ? 'files' : 'file'} now</span>}
        </>}</div>
        <label className="dm-pill dm-line dm-sm dm-atx-add"><Icon name="plus" size="xs" />Add files<input type="file" multiple accept={accept} className="dm-atx-file" aria-label="Add files" onChange={picked} /></label>
      </div>
  </>);

  return (
    <div data-dm="" ref={root} className={cx('dm-atx', clean && 'dm-growing', clean && (over || dragging) && 'dm-over', className)}
      {...(clean ? { onDragEnter: hold, onDragOver: hold, onDragLeave: leave, onDrop: dropped } : {})}>
      {clean ? <div className="dm-grow" ref={inner}>{body}</div> : body}
    </div>
  );
}
