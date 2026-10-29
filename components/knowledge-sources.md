# Knowledge sources

> The files, sites and folders the agent knows, and how far each is indexed.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/knowledge-sources

## Install

```sh
npx designme add knowledge-sources          # HTML, CSS and JS, with the shared core
npx designme add knowledge-sources --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

A list of what an agent knows: uploaded files, websites it crawls and connected folders of docs, each with how far it has been indexed. A source is queued, indexing with a progress bar and a count, ready with when it last synced, or failed with the reason. A failed source can offer a fix, like reading a scanned PDF with OCR, and every source has Re-sync and Remove. It answers the question "what does this agent know, and is it up to date?"

### When to use it

- When people give an agent its own knowledge, like help docs, a product site or a shared drive, and need to see what it has read.
- When indexing takes a while and people should see it progress instead of waiting on a blank list.
- When a source can fail for a reason people can act on, like a scanned PDF or a site that blocks crawlers.
- In an agent's settings, next to its tools and memory.

### What it does

- Each source in `sources` shows its type's icon (`kind` of `files`, `web` or `folder`), its `name`, and a line under it that follows its `state`.
- The dot on the icon is the state at a glance: grey while `queued`, a turning ring while `indexing`, green when `ready` and red when `failed`.
- While indexing, the line becomes a progress bar and a count, like "64 of 142 pages", from `done` and `count`; `unit` switches pages to files.
- A ready source reads like "142 pages · Synced 2m ago" from its `synced`; a queued one reads "Queued", or your own `note`.
- A failed source shows its `error` in red, with a button labelled with its `fix` that calls `onFix`, and a Remove button when you pass `onRemove`.
- Each row has a menu with Re-sync (`onResync`, unavailable while the source waits or indexes) and Remove (`onRemove`).
- Add source opens a menu with an option for each handler you pass: Upload files opens the file picker and calls `onUpload` with the files; Add a website asks for an address and calls `onAddWebsite` with it, without http(s)://; Connect a folder lists `folders` and calls `onConnectFolder`.
- The line under the title counts the sources and adds up their `chunks`, like "4 sources · 1,204 chunks", or shows your own `status`.

### Accessibility

- The sources form a list, and each row's menu button is named for its source, like "Actions for Product docs".
- An indexing source's bar is a progressbar with its count as its value.
- The menus have role="menu"; their buttons expose aria-expanded and aria-haspopup, and Escape closes a menu and gives the focus back to its button.
- From the keyboard, Enter, Space or the down arrow opens a menu with the focus on its picked item, or its first (the up arrow, on its last); the arrow keys move through it and wrap, Home and End jump to the ends, Tab closes it and moves on, and closing it gives the focus back to its button.
- The line under the title is announced politely when it changes.
- With reduced motion, rows appear without their entrance and text changes without the crossfade.

## Usage in React

```tsx
import { KnowledgeSources } from '@/components/designme/knowledge-sources/KnowledgeSources';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { useStory } from '../lib/useScript';
import { KnowledgeSources, type KnowledgeSource, type KnowledgeSourcesFolder } from './KnowledgeSources';

/* ---------- Knowledge sources: a website is added and waits its turn; a scanned PDF fails, is read again with OCR, and everything ends indexed ---------- */
type Src = KnowledgeSource & { ms: number; total: number; scan?: boolean };
const START: Src[] = [
  { key: 'docs', kind: 'folder', name: 'Product docs', count: 86, state: 'ready', synced: '2m ago', chunks: 642, total: 642, ms: 2500 },
  { key: 'play', kind: 'files', name: 'Sales playbooks', count: 18, unit: 'files', state: 'ready', synced: '1h ago', chunks: 318, total: 318, ms: 2500 },
  { key: 'pdf', kind: 'files', name: 'Brand book 2024.pdf', count: 24, state: 'queued', total: 48, ms: 19000, scan: true }
];
const FOLDERS: KnowledgeSourcesFolder[] = [{ key: 'specs', name: 'Design specs', detail: 'Google Drive' }, { key: 'research', name: 'Research notes', detail: 'Notion' }];
const SIZE: Record<string, [number, number]> = { specs: [57, 230], research: [31, 124] };

export default function KnowledgeSourcesDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [sources, setSources] = useState<Src[]>(START);
  const [folders, setFolders] = useState(FOLDERS);
  const [address, setAddress] = useState('');
  const patch = (key: string, p: Partial<Src>) => setSources(ss => ss.map(s => s.key === key ? { ...s, ...p } : s));
  const add = (s: Omit<Src, 'state'>) => setSources(ss => [...ss.filter(x => x.key !== s.key), { ...s, state: 'queued' }]);

  // one source indexes at a time and the rest wait in line; a scanned PDF stops where its text runs out until it is read with OCR
  useEffect(() => {
    const id = setInterval(() => setSources(ss => {
      let i = ss.findIndex(s => s.state === 'indexing');
      if (i < 0) { i = ss.findIndex(s => s.state === 'queued'); if (i < 0) return ss; return ss.map((s, k) => k === i ? { ...s, state: 'indexing', done: 0 } : s); }
      const s = ss[i], done = Math.min(s.count, (s.done ?? 0) + s.count * 100 / s.ms);
      const next: Src = s.scan && done >= 9 ? { ...s, state: 'failed', done: 9, error: 'Scanned PDF, no text found', fix: 'Retry with OCR' }
        : done >= s.count ? { ...s, state: 'ready', done, synced: 'just now', chunks: s.total } : { ...s, done };
      return ss.map((x, k) => k === i ? next : x);
    }), 100);
    return () => clearInterval(id);
  }, []);

  // the preview's story: add the docs site, which waits its turn, then read the scanned PDF again with OCR
  useStory(ref, async ({ wait, press, taken }) => {
    await wait(1500); press('.dm-ksx-add');
    await wait(1000); press('.dm-ksx-pop .dm-mi:nth-child(2)');
    await wait(500);
    const url = 'designme.dev/docs';
    // taking over while it types takes the letters back
    let typing = true;
    taken(() => { if (typing) setAddress(''); });
    for (let k = 1; k <= url.length; k++) { setAddress(url.slice(0, k)); await wait(50); }
    typing = false;
    await wait(500); press('.dm-ksx-pop button[type="submit"]');
    const failed = () => ref.current?.querySelector('.dm-ksx-s[data-st="failed"]');
    for (let k = 0; k < 150 && !failed(); k++) await wait(100);
    await wait(1000); press('.dm-ksx-s[data-st="failed"] .dm-ksx-fx .dm-accent');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <KnowledgeSources
        sources={sources}
        address={address} onAddressChange={setAddress}
        onAddWebsite={a => add({ key: 'web:' + a, kind: 'web', name: a, count: 142, total: 196, ms: 4500 })}
        onUpload={fs => add({ key: 'up:' + fs.map(f => f.name).join(), kind: 'files', name: fs.length === 1 ? fs[0].name : fs.length + ' files', count: fs.length, unit: 'files', total: fs.length * 12, ms: 1500 })}
        folders={folders}
        onConnectFolder={k => { const f = folders.find(x => x.key === k)!; setFolders(fs => fs.filter(x => x.key !== k)); add({ key: k, kind: 'folder', name: f.name, count: SIZE[k][0], total: SIZE[k][1], ms: 3000 }); }}
        onFix={k => patch(k, { state: 'queued', scan: false, ms: 3000, note: 'Queued to read with OCR', error: undefined, fix: undefined })}
        onResync={k => patch(k, { state: 'queued', note: undefined })}
        onRemove={k => setSources(ss => ss.filter(s => s.key !== k))}
      />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `sources` | `KnowledgeSource[]` |  |
| `onUpload` (optional) | `(files: File[]) => void` | Adds Upload files to the Add source menu; it opens the file picker and hands you what was picked |
| `onAddWebsite` (optional) | `(address: string) => void` | Adds Add a website to the Add source menu; it asks for an address and hands it over without http(s):// |
| `address` (optional) | `string` | The address being typed. Leave it out to let the field keep its own |
| `defaultAddress` (optional) | `string` |  |
| `onAddressChange` (optional) | `(address: string) => void` |  |
| `folders` (optional) | `KnowledgeSourcesFolder[]` | Adds Connect a folder to the Add source menu, listing these |
| `onConnectFolder` (optional) | `(key: string) => void` |  |
| `onResync` (optional) | `(key: string) => void` | Adds Re-sync to each source's menu. It is unavailable while the source waits or indexes |
| `onRemove` (optional) | `(key: string) => void` | Adds Remove to each source's menu, and beside the fix of a failed one |
| `onFix` (optional) | `(key: string) => void` | Called by the fix button of a failed source |
| `title` (optional) | `string` | Defaults to "Knowledge sources" |
| `status` (optional) | `string` | The line under the title. Defaults to "4 sources · 1,204 chunks" |
| `className` (optional) | `string` |  |

## Questions

**Does the component index anything?**

No. It shows what you tell it. Run the indexing in your own code and update each source's `state` and `done` as it goes; the bar and count follow.

**How do I show the website being added?**

Handle `onAddWebsite`: add a source with `kind: 'web'` and `state: 'queued'`, then move it to `indexing` and `ready` as your crawler works. Pass `address` and `onAddressChange` if you want to fill in the field yourself.

**Why doesn't the chunk count include a source that is still indexing?**

The total adds up `chunks`, so leave a source's `chunks` out until it has been indexed. Keep it while a source re-syncs if its old index still answers questions.

**Can a failed source offer something other than OCR?**

Yes. `fix` is any label, like "Sign in again" or "Try a smaller file", and `onFix` gets the source's key.

## Source

`KnowledgeSources.tsx`, as `npx designme add knowledge-sources --react` installs it:

```tsx
'use client';
import { useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Fold, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './knowledge-sources.css';

/** files: uploaded files, web: a website the agent crawls, folder: a connected folder of docs (Notion, Drive and the like) */
export type KnowledgeSourceKind = 'files' | 'web' | 'folder';

/** queued: waiting its turn, indexing: being read (with a progress bar), ready: indexed, failed: stopped, with a reason */
export type KnowledgeSourceState = 'queued' | 'indexing' | 'ready' | 'failed';

/** A file, site or folder the agent knows */
export interface KnowledgeSource {
  key: string;
  /** Like "Product docs" or "designme.dev/docs" */
  name: string;
  kind: KnowledgeSourceKind;
  /** How many pages or files it holds, like 142 */
  count: number;
  /** Defaults to pages */
  unit?: 'pages' | 'files';
  state: KnowledgeSourceState;
  /** While indexing: how many of `count` are done. The bar and "64 of 142 pages" follow it */
  done?: number;
  /** When ready: when it was last synced, like "2m ago", shown as "Synced 2m ago" */
  synced?: string;
  /** When failed: why, like "Scanned PDF, no text found" */
  error?: string;
  /** When failed: the label of a button that fixes it, like "Retry with OCR". It calls `onFix` */
  fix?: string;
  /** Replaces "Queued" while it waits, like "Queued to read with OCR" */
  note?: string;
  /** The chunks it adds to the index, counted in the line under the title. Leave it out until it has been indexed */
  chunks?: number;
}

/** A folder offered under Connect a folder */
export interface KnowledgeSourcesFolder {
  key: string;
  name: string;
  /** Where it lives, like "Google Drive" */
  detail?: string;
}

export interface KnowledgeSourcesProps {
  sources: KnowledgeSource[];
  /** Adds Upload files to the Add source menu; it opens the file picker and hands you what was picked */
  onUpload?: (files: File[]) => void;
  /** Adds Add a website to the Add source menu; it asks for an address and hands it over without http(s):// */
  onAddWebsite?: (address: string) => void;
  /** The address being typed. Leave it out to let the field keep its own */
  address?: string;
  defaultAddress?: string;
  onAddressChange?: (address: string) => void;
  /** Adds Connect a folder to the Add source menu, listing these */
  folders?: KnowledgeSourcesFolder[];
  onConnectFolder?: (key: string) => void;
  /** Adds Re-sync to each source's menu. It is unavailable while the source waits or indexes */
  onResync?: (key: string) => void;
  /** Adds Remove to each source's menu, and beside the fix of a failed one */
  onRemove?: (key: string) => void;
  /** Called by the fix button of a failed source */
  onFix?: (key: string) => void;
  /** Defaults to "Knowledge sources" */
  title?: string;
  /** The line under the title. Defaults to "4 sources · 1,204 chunks" */
  status?: string;
  className?: string;
}

const KIND: Record<KnowledgeSourceKind, [IconName, string]> = { files: ['file-text', 'var(--dm-pp)'], web: ['globe', 'var(--dm-pb)'], folder: ['folder', 'var(--dm-pm)'] };
const fmt = (n: number) => n.toLocaleString('en-US');
const of = (n: number, unit: string) => `${fmt(n)} ${n === 1 ? unit.slice(0, -1) : unit}`;
const line = (s: KnowledgeSource) => s.state === 'queued' ? s.note ?? 'Queued' : s.state === 'failed' ? s.error ?? 'Failed'
  : of(s.count, s.unit ?? 'pages') + (s.synced ? ' · Synced ' + s.synced : '');

/** One source: its type, name and state, and a menu with Re-sync and Remove */
function Row({ s, delay, onResync, onRemove, onFix }: { s: KnowledgeSource; delay: number } & Pick<KnowledgeSourcesProps, 'onResync' | 'onRemove' | 'onFix'>) {
  const menu = usePopover({ align: 'end' });
  const [icon, color] = KIND[s.kind];
  const motion = enter(delay), unit = s.unit ?? 'pages', done = Math.min(s.count, Math.max(0, Math.floor(s.done ?? 0)));
  const busy = s.state === 'queued' || s.state === 'indexing';
  const act = (f?: (key: string) => void) => { menu.closeSoon(); f?.(s.key); };
  return (
    <div className={cx('dm-ksx-s', motion.className)} style={motion.style} role="listitem" data-st={s.state}>
      <span className="dm-ic" style={{ color, background: `color-mix(in srgb,${color} 12%,transparent)` }} aria-hidden="true"><Icon name={icon} size="xs" /></span>
      <span className="dm-t">
        <span className="dm-nm">{s.name}</span>
        <span className="dm-d">
          {s.state === 'indexing'
            ? <><span className="dm-ksx-bar" role="progressbar" aria-label={'Indexing ' + s.name} aria-valuemin={0} aria-valuemax={s.count} aria-valuenow={done}><i style={{ width: done / (s.count || 1) * 100 + '%' }} /></span><span className="dm-num">{fmt(done)} of {of(s.count, unit)}</span></>
            : <Swap>{line(s)}</Swap>}
        </span>
      </span>
      {(onResync || onRemove)
        ? <Tip label="More" off={menu.open}><button type="button" className="dm-ib dm-ksx-more" aria-label={'Actions for ' + s.name} {...menu.trigger}><Icon name="more" /></button></Tip>
        : <span />}
      {(onResync || onRemove) && (
        <div {...menu.pop} className={cx(menu.pop.className, 'dm-ksx-mpop')} role="menu">
          {onResync && <button type="button" className="dm-mi" role="menuitem" disabled={busy} onClick={() => act(onResync)}><Icon name="refresh" size="xs" />Re-sync</button>}
          {onResync && onRemove && <div className="dm-sep" />}
          {onRemove && <button type="button" className="dm-mi dm-del" role="menuitem" onClick={() => act(onRemove)}><Icon name="trash" size="xs" />Remove</button>}
        </div>
      )}
      <Fold open={s.state === 'failed' && !!(s.fix || onRemove)} className="dm-ksx-fx">
        <div>
          {s.fix && <button type="button" className="dm-pill dm-accent dm-sm" onClick={() => onFix?.(s.key)}>{s.fix}</button>}
          {onRemove && <button type="button" className="dm-pill dm-ghost dm-sm" onClick={() => onRemove(s.key)}>Remove</button>}
        </div>
      </Fold>
    </div>
  );
}

/** What the agent knows: files, websites and connected folders, each with how far it is indexed. One that failed says why
    and can offer a fix; Add source uploads files, adds a website or connects a folder. */
export function KnowledgeSources({ sources, onUpload, onAddWebsite, address, defaultAddress = '', onAddressChange, folders = [], onConnectFolder,
  onResync, onRemove, onFix, title = 'Knowledge sources', status, className }: KnowledgeSourcesProps) {
  const root = useRef<HTMLDivElement>(null);
  const file = useRef<HTMLInputElement>(null);
  const field = useRef<HTMLInputElement>(null);
  const menu = usePopover({ side: 'up' });
  const [view, setView] = useState<'main' | 'web' | 'folder'>('main');
  const [url, setUrl] = useControllable(address, defaultAddress, onAddressChange);
  // the menu grows upwards from Add source whichever step it shows, so it is held by its bottom edge
  const [bottom, setBottom] = useState<CSSProperties>({});
  useIsoLayoutEffect(() => {
    const b = root.current?.querySelector<HTMLElement>('.dm-ksx-add');
    if (menu.open && b && root.current) setBottom({ top: 'auto', bottom: root.current.clientHeight - b.offsetTop + 6 });
  }, [menu.open, view]);
  // rows there from the start come in one after another; a row added later comes in on its own
  const [first] = useState(() => sources.map(s => s.key));
  const total = status ?? `${sources.length} source${sources.length === 1 ? '' : 's'} · ${fmt(sources.reduce((a, s) => a + (s.chunks ?? 0), 0))} chunks`;
  const canAdd = !!(onUpload || onAddWebsite || onConnectFolder);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = url.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!v) { field.current?.focus(); return; }
    menu.close(); setUrl(''); onAddWebsite?.(v);
  };
  return (
    <div data-dm="" ref={root} className={cx('dm-ksx dm-panel', className)}>
      <div className="dm-ksx-h"><div><b>{title}</b><Swap className="dm-muted dm-ksx-st">{total}</Swap></div></div>
      <div className="dm-ksx-list" role="list" aria-label="Sources">
        {sources.map(s => { const at = first.indexOf(s.key); return <Row key={s.key} s={s} delay={at >= 0 ? at * 50 : 0} onResync={onResync} onRemove={onRemove} onFix={onFix} />; })}
      </div>
      {canAdd && <>
        <button type="button" className="dm-ksx-add" {...menu.trigger} onClick={e => { if (!menu.open) setView('main'); menu.trigger.onClick(e); }}><Icon name="plus" size="xs" />Add source</button>
        <div {...menu.pop} style={{ ...menu.pop.style, ...bottom }} className={cx(menu.pop.className, 'dm-ksx-pop')} role="menu" aria-label="Add source">
          {view === 'main' && <>
            {onUpload && <button type="button" className="dm-mi" role="menuitem" onClick={() => { menu.closeSoon(); file.current?.click(); }}><Icon name="upload" size="xs" /><span>Upload files</span></button>}
            {onAddWebsite && <button type="button" className="dm-mi" role="menuitem" onClick={() => { setView('web'); requestAnimationFrame(() => field.current?.focus({ preventScroll: true })); }}><Icon name="globe" size="xs" /><span>Add a website</span></button>}
            {onConnectFolder && <button type="button" className="dm-mi" role="menuitem" onClick={() => setView('folder')}><Icon name="folder" size="xs" /><span>Connect a folder</span></button>}
          </>}
          {view === 'web' && (
            <form className="dm-ksx-web" onSubmit={submit}>
              <div className="dm-ph">Add a website</div>
              <div className="dm-ksx-in"><Icon name="globe" size="xs" /><input ref={field} value={url} onChange={e => setUrl(e.target.value)} placeholder="example.com/docs" aria-label="Website address" spellCheck={false} autoComplete="off" /><button type="submit" className="dm-pill dm-accent dm-sm">Add</button></div>
            </form>
          )}
          {view === 'folder' && <>
            <div className="dm-ph">Connect a folder</div>
            {folders.length
              ? folders.map(f => <button type="button" key={f.key} className="dm-mi" role="menuitem" onClick={() => { menu.closeSoon(); onConnectFolder?.(f.key); }}><Icon name="folder" size="xs" /><span>{f.name}{f.detail && <span className="dm-d">{f.detail}</span>}</span></button>)
              : <div className="dm-ph">All folders connected</div>}
          </>}
        </div>
        {onUpload && <input ref={file} type="file" multiple hidden onChange={e => { const fs = [...(e.target.files ?? [])]; e.target.value = ''; if (fs.length) onUpload(fs); }} />}
      </>}
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Canvas toolbar](https://designme.dev/components/canvas-toolbar.md): A floating toolbar for a workflow canvas: run, pick a tool, comment, fit and zoom.
- [Step library](https://designme.dev/components/step-library.md): Search the steps a workflow can use, preview what each does, and add one.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [File explorer](https://designme.dev/components/file-explorer.md): Project files, with the ones the agent touched marked.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
