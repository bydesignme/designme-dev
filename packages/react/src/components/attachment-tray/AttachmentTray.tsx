'use client';
import { useEffect, useRef, useState, type DragEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Icon } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './attachment-tray.css';

export interface Attachment {
  id: string;
  name: string;
  /** In bytes */
  size: number;
  /** 0 to 100. At 100 the ring turns into a check */
  progress: number;
}

export interface AttachmentTrayProps {
  files: Attachment[];
  /** Files the person dropped on the tray or picked with the file dialog */
  onFiles?: (files: File[]) => void;
  /** Adds a remove button to each file. Called once the file has animated out */
  onRemove?: (id: string) => void;
  /** The drop zone's heading */
  title?: ReactNode;
  /** A link after "or" in the drop zone, like "add sample files" */
  action?: { label: string; onClick: () => void };
  /** Passed to the file input, like "image/*,.pdf" */
  accept?: string;
  /** The line under the list. Defaults to how many files the agent can read */
  summary?: string;
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

function Item({ file, delay, onRemove }: { file: Attachment; delay: number; onRemove?: (id: string) => void }) {
  const [leaving, setLeaving] = useState(false);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  const [label, fg, bg] = kind(file.name), p = Math.max(0, Math.min(100, file.progress)) / 100;
  return (
    <div className={cx('dm-atx-it', leaving ? 'dm-leave' : 'dm-enter')} style={leaving ? undefined : { animationDelay: delay + 'ms' }}>
      <span className="dm-atx-ti" style={{ color: fg, background: bg }}>{label}</span>
      <span className="dm-atx-n">{file.name}<span>{bytes(file.size)}</span></span>
      {p >= 1
        ? <span style={{ color: 'var(--dm-ok)', display: 'grid', placeItems: 'center', width: 22 }}><Icon name="ok" /></span>
        : <svg className="dm-atx-ring" viewBox="0 0 22 22" role="progressbar" aria-label={`Uploading ${file.name}`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(p * 100)}>
            <circle cx="11" cy="11" r="8" fill="none" stroke="var(--dm-line)" strokeWidth="2" />
            <circle cx="11" cy="11" r="8" fill="none" stroke="var(--dm-accent)" strokeWidth="2" strokeLinecap="round" strokeDasharray={RING} transform="rotate(-90 11 11)" style={{ strokeDashoffset: RING * (1 - p) }} />
          </svg>}
      {onRemove && (
        <Tip label="Remove">
          <button type="button" className="dm-ib" aria-label={`Remove ${file.name}`} disabled={leaving}
            onClick={() => { setLeaving(true); t.current = setTimeout(() => onRemove(file.id), 320); }}><Icon name="x" size="xs" /></button>
        </Tip>
      )}
    </div>
  );
}

/** Drop files for the agent and watch each one upload. */
export function AttachmentTray({ files, onFiles, onRemove, title = 'Drop files here', action, accept, summary, className }: AttachmentTrayProps) {
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
  const read = files.filter(f => f.progress >= 100).length;
  const line = summary ?? (read ? `The agent can read ${read} ${read > 1 ? 'files' : 'file'} now` : '');

  return (
    <div data-dm="" className={cx('dm-atx', className)}>
      <label className={cx('dm-atx-drop', over && 'dm-over')} onDragEnter={hold} onDragOver={hold} onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) onFiles?.(Array.from(e.dataTransfer.files)); }}>
        <input type="file" multiple accept={accept} className="dm-atx-file" aria-label="Choose files"
          onChange={e => { if (e.target.files?.length) onFiles?.(Array.from(e.target.files)); e.target.value = ''; }} />
        <span className="dm-atx-ic"><Icon name="upload" /></span>
        <b>{title}</b>
        {action && <span className="dm-muted">or <button type="button" className="dm-atx-sample" onClick={action.onClick}>{action.label}</button></span>}
      </label>
      <div className="dm-atx-list">{files.map(f => <Item key={f.id} file={f} delay={seen.delay[f.id] ?? 0} onRemove={onRemove} />)}</div>
      <Swap className="dm-atx-sum dm-muted">{line}</Swap>
    </div>
  );
}
