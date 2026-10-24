# Attachment tray

> Drop files for the agent and watch each one upload.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/attachment-tray

## Install

```sh
npx designme add attachment-tray          # HTML, CSS and JS, with the shared core
npx designme add attachment-tray --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Attachment tray is a drop zone plus a list of the files a person is giving the agent. Each file shows a type badge, its name and size, and a progress ring that turns into a check when the upload finishes, with a line underneath saying how many files the agent can read.

### When to use it

- When people hand your agent documents, images or spreadsheets to work from.
- When uploads take long enough that people should see each file's progress before they ask anything.
- When you want a sample-files link so new users can try the agent without their own files.

### What it does

- Files dropped on the zone or chosen with the file dialog go to `onFiles` as a list of `File` objects. `accept` limits the dialog to certain types.
- Each file gets a coloured badge from its extension, like PDF, PNG or CSV, and its size in KB or MB.
- `progress` from 0 to 100 fills a ring, and at 100 the ring becomes a check. Files that arrive together come in one after another.
- `onRemove` adds a remove button to each file and is called after the file has animated out.
- The line under the list counts finished files, like "The agent can read 2 files now", unless you pass your own `summary`.
- The drop zone's dashed edge marches while a file is dragged over it. `title` changes its heading, `action` adds a link after "or", and `dragging` shows the drag state for a scripted demo.

### Accessibility

- The drop zone wraps a real file input labelled "Choose files", so it also works without dragging.
- Each upload ring is a `role="progressbar"` with `aria-valuenow` from 0 to 100 and a label naming the file.
- Remove buttons are labelled with the file name, like "Remove brief.pdf".

## Usage in React

```tsx
import { AttachmentTray } from '@/components/designme/attachment-tray/AttachmentTray';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { useScript } from '../lib/useScript';
import { AttachmentTray, type Attachment } from './AttachmentTray';

/* ---------- Attachment tray: dropped or picked files upload one by one; sample files show the flow ---------- */
const SAMPLES: [string, number][] = [['brief.pdf', 2.4e6], ['Pricing.fig', 8.1e6], ['signups.csv', 3.2e5]];

export default function AttachmentTrayDemo() {
  const [files, setFiles] = useState<Attachment[]>([]);
  const [dragging, setDragging] = useState(false);
  const count = useRef(0);
  count.current = files.length;
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  useEffect(() => () => timers.current.forEach(clearInterval), []);
  // a real app would report upload progress here; the demo fakes it, a little faster or slower each tick
  const add = (list: [string, number][]) => list.forEach(([name, size]) => {
    const id = Math.random().toString(36).slice(2);
    setFiles(fs => [...fs, { id, name, size, progress: 0 }]);
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + 4 + Math.random() * 8);
      setFiles(fs => fs.map(f => f.id === id ? { ...f, progress: p } : f));
      if (p >= 100) clearInterval(iv);
    }, 70);
    timers.current.push(iv);
  });
  // once it has entered, three sample files drop in and upload, unless files are already there
  useScript(async s => {
    await s.wait(950); if (count.current) return;
    setDragging(true); await s.wait(500); setDragging(false);
    if (!count.current) add(SAMPLES);
  });
  return (
    <div style={{ width: '100%' }}>
      <AttachmentTray files={files} dragging={dragging} action={{ label: 'add sample files', onClick: () => add(SAMPLES) }}
        onFiles={fs => add(fs.map(f => [f.name, f.size]))} onRemove={id => setFiles(fs => fs.filter(f => f.id !== id))} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `files` | `Attachment[]` |  |
| `onFiles` (optional) | `(files: File[]) => void` | Files the person dropped on the tray or picked with the file dialog |
| `onRemove` (optional) | `(id: string) => void` | Adds a remove button to each file. Called once the file has animated out |
| `title` (optional) | `ReactNode` | The drop zone's heading |
| `action` (optional) | `{ label: string; onClick: () => void }` | A link after "or" in the drop zone, like "add sample files" |
| `accept` (optional) | `string` | Passed to the file input, like "image/*,.pdf" |
| `summary` (optional) | `string` | The line under the list. Defaults to how many files the agent can read |
| `dragging` (optional) | `boolean` | Shows the drop zone as if a file were being dragged over it, for a scripted demo. A real drag shows it by itself |
| `className` (optional) | `string` |  |

## Questions

**Does the tray upload the files for me?**

No. It hands you the files through `onFiles`. You upload them, add each one to `files` with an `id`, `name` and `size`, and update its `progress` as the upload runs.

**How do I restrict which file types people can pick?**

Pass `accept`, for example "image/*,.pdf". It is set on the file input, so it applies to the file dialog. Dropped files are passed on as they are, so check their type in `onFiles` too.

**Can I change the line under the list?**

Yes. Pass `summary` and it replaces the default count of files the agent can read.

## Source

`AttachmentTray.tsx`, as `npx designme add attachment-tray --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type DragEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useIsoLayoutEffect } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap, Tip } from '../lib/motion';
import '../designme.css';
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

/** Drop files for the agent and watch each one upload. */
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
  const read = files.filter(f => f.progress >= 100).length;
  const line = summary ?? (read ? `The agent can read ${read} ${read > 1 ? 'files' : 'file'} now` : '');

  return (
    <div data-dm="" className={cx('dm-atx', className)}>
      <label className={cx('dm-atx-drop', (over || dragging) && 'dm-over')} onDragEnter={hold} onDragOver={hold} onDragLeave={() => setOver(false)}
        onDrop={e => { e.preventDefault(); setOver(false); if (e.dataTransfer.files.length) onFiles?.(Array.from(e.dataTransfer.files)); }}>
        <input type="file" multiple accept={accept} className="dm-atx-file" aria-label="Choose files"
          onChange={e => { if (e.target.files?.length) onFiles?.(Array.from(e.target.files)); e.target.value = ''; }} />
        <Ants />
        <span className="dm-atx-ic"><Icon name="upload" /></span>
        <b>{title}</b>
        {action && <span className="dm-muted">or <button type="button" className="dm-atx-sample" onClick={action.onClick}>{action.label}</button></span>}
      </label>
      <div className="dm-atx-list">{files.map(f => <Item key={f.id} file={f} delay={seen.delay[f.id] ?? 0} onRemove={onRemove} />)}</div>
      <Swap className="dm-atx-sum dm-muted">{line}</Swap>
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with a live preview and versions.
- [Rich text editor](https://designme.dev/components/rich-text-editor.md): A minimal editor with an inline AI menu that streams a suggestion to accept or discard.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Voice orb](https://designme.dev/components/voice-orb.md): A hands-free voice chat, with an orb that shows who is talking.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Prompt library](https://designme.dev/components/prompt-library.md): Saved prompts with blanks to fill in before they go to the agent.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
