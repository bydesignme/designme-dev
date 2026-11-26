'use client';
import { useRef, useState, type CSSProperties, type FormEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Fold, Swap, Tip, useGrow } from '../../lib/motion';
import { useHoverGlide } from '../../lib/glide';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
// its menus' rows glide in Clean
import '../../lib/glide';
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
  /** The line under the title. Defaults to how many chunks are indexed, like "1,204 chunks indexed" */
  status?: string;
  className?: string;
}

/* a type's icon on a vivid tile of its colour, with the colour's own ink */
const KIND: Record<KnowledgeSourceKind, [IconName, string]> = { files: ['file-text', 'p'], web: ['globe', 'b'], folder: ['folder', 'm'] };
const fmt = (n: number) => n.toLocaleString('en-US');
const of = (n: number, unit: string) => `${fmt(n)} ${n === 1 ? unit.slice(0, -1) : unit}`;
const line = (s: KnowledgeSource) => s.state === 'queued' ? s.note ?? 'Queued' : s.state === 'failed' ? s.error ?? 'Failed'
  : of(s.count, s.unit ?? 'pages') + (s.synced ? ' · Synced ' + s.synced : '');
/* the line's mark: a tick once indexed, a clock while it waits, a sign when it failed */
const MARK: Record<Exclude<KnowledgeSourceState, 'indexing'>, IconName> = { ready: 'ok', queued: 'clock', failed: 'alert' };

/** One source: its type, name and state, and a menu with Re-sync and Remove */
function Row({ s, delay, onResync, onRemove, onFix }: { s: KnowledgeSource; delay: number } & Pick<KnowledgeSourcesProps, 'onResync' | 'onRemove' | 'onFix'>) {
  const menu = usePopover({ align: 'end' });
  const [icon, k] = KIND[s.kind];
  const motion = enter(delay), unit = s.unit ?? 'pages', done = Math.min(s.count, Math.max(0, Math.floor(s.done ?? 0)));
  const busy = s.state === 'queued' || s.state === 'indexing';
  const act = (f?: (key: string) => void) => { menu.closeSoon(); f?.(s.key); };
  return (
    <div className={cx('dm-ksx-s', motion.className)} style={motion.style} role="listitem" data-st={s.state}>
      <span className="dm-ic" style={{ background: `var(--dm-av-${k})`, color: `var(--dm-av-${k}-ink)` }} aria-hidden="true"><Icon name={icon} size="xs" /></span>
      <span className="dm-t">
        <span className="dm-nm">{s.name}</span>
        <span className="dm-d">
          {s.state === 'indexing'
            ? <><span className="dm-ksx-bar" role="progressbar" aria-label={'Indexing ' + s.name} aria-valuemin={0} aria-valuemax={s.count} aria-valuenow={done}><i style={{ width: done / (s.count || 1) * 100 + '%' }} /></span><span className="dm-num dm-shim">{fmt(done)} of {of(s.count, unit)}</span></>
            : <><Icon name={MARK[s.state]} size="xs" /><Swap>{line(s)}</Swap></>}
        </span>
      </span>
      {(onResync || onRemove)
        ? <Tip label="More" off={menu.open}><button type="button" className="dm-ib dm-ksx-more dm-mx-press" aria-label={'Actions for ' + s.name} {...menu.trigger}><Icon name="more" /></button></Tip>
        : <span />}
      {(onResync || onRemove) && (
        <div {...menu.pop} className={cx(menu.pop.className, 'dm-ksx-mpop dm-mx-pop dm-mx-rows dm-mx-glide')} role="menu">
          {onResync && <button type="button" className="dm-mi dm-mx-press" role="menuitem" disabled={busy} onClick={() => act(onResync)}><Icon name="refresh" size="xs" />Re-sync</button>}
          {onResync && onRemove && <div className="dm-sep" />}
          {onRemove && <button type="button" className="dm-mi dm-del dm-mx-press" role="menuitem" onClick={() => act(onRemove)}><Icon name="trash" size="xs" />Remove</button>}
        </div>
      )}
      <Fold open={s.state === 'failed' && !!(s.fix || onRemove)} className="dm-ksx-fx">
        <div>
          {s.fix && <button type="button" className="dm-pill dm-accent dm-sm" onClick={() => onFix?.(s.key)}>{s.fix}</button>}
          {onRemove && <button type="button" className="dm-pill dm-ghost dm-sm dm-mx-press" onClick={() => onRemove(s.key)}>Remove</button>}
        </div>
      </Fold>
    </div>
  );
}

/** What the agent knows: files, websites and connected folders, each with how far it is indexed. One that failed says why
    and can offer a fix; Add source uploads files, adds a website or connects a folder. */
export function KnowledgeSources({ sources, onUpload, onAddWebsite, address, defaultAddress = '', onAddressChange, folders = [], onConnectFolder,
  onResync, onRemove, onFix, title = 'Knowledge sources', status, className }: KnowledgeSourcesProps) {
  const file = useRef<HTMLInputElement>(null);
  // Clean's one hover: a highlight that glides from source to source
  const listRef = useRef<HTMLDivElement>(null);
  useHoverGlide(listRef, '.dm-ksx-s');
  const field = useRef<HTMLInputElement>(null);
  // a menu opens under its button, or above it when there is no room
  const menu = usePopover();
  // the card grows with its rows and shrinks as they go, eased (as grow() on the site)
  const [root, inner] = useGrow();
  const [view, setView] = useState<'main' | 'web' | 'folder'>('main');
  const [url, setUrl] = useControllable(address, defaultAddress, onAddressChange);
  // a menu that opened above Add source grows upwards whichever step it shows, so it is held by its bottom edge
  const [bottom, setBottom] = useState<CSSProperties>({});
  const up = String((menu.pop.style as Record<string, unknown>)['--dm-origin'] ?? '').startsWith('bottom');
  useIsoLayoutEffect(() => {
    const b = root.current?.querySelector<HTMLElement>('.dm-ksx-add,.dm-ksx-em .dm-pill'), r = b?.getBoundingClientRect(), h = root.current?.getBoundingClientRect();
    setBottom(menu.open && up && r && h ? { top: 'auto', bottom: h.bottom - r.top + 6 } : {});
  }, [menu.open, view, up]);
  // rows there from the start come in one after another; a row added later comes in on its own
  const [first] = useState(() => sources.map(s => s.key));
  const total = status ?? `${fmt(sources.reduce((a, s) => a + (s.chunks ?? 0), 0))} chunks indexed`;
  const canAdd = !!(onUpload || onAddWebsite || onConnectFolder);
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = url.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!v) { field.current?.focus(); return; }
    menu.close(); setUrl(''); onAddWebsite?.(v);
  };
  return (
    <div data-dm="" ref={root} className={cx('dm-ksx dm-panel dm-growing dm-mx-grow', className)}>
      <div ref={inner} className="dm-grow">
      <div className="dm-ksx-h"><span className="dm-ksx-hi" aria-hidden="true"><Icon name="book" size="xs" /></span><div><b>{title}</b><Swap className="dm-muted dm-ksx-st">{total}</Swap></div></div>
      <div ref={listRef} className="dm-ksx-list dm-mx-glide" role="list" aria-label="Sources">
        {sources.map(s => { const at = first.indexOf(s.key); return <Row key={s.key} s={s} delay={at >= 0 ? at * 50 : 0} onResync={onResync} onRemove={onRemove} onFix={onFix} />; })}
      </div>
      {/* nothing left: the empty state, with Add source as an outline button */}
      {!sources.length && (
        <div className="dm-ksx-em"><span className="dm-ksx-em-art" aria-hidden="true" /><b>No sources yet</b><span>Add files, a website or a folder, and the agent reads them.</span>
          {canAdd && <button type="button" className="dm-pill dm-line dm-sm dm-mx-press" {...menu.trigger} onClick={e => { if (!menu.open) setView('main'); menu.trigger.onClick(e); }}><Icon name="plus" size="xs" />Add source</button>}
        </div>
      )}
      {canAdd && <>
        {sources.length > 0 && <div className="dm-ksx-ft"><button type="button" className="dm-ksx-add dm-mx-press" {...menu.trigger} onClick={e => { if (!menu.open) setView('main'); menu.trigger.onClick(e); }}><Icon name="plus" size="xs" />Add source</button></div>}
        <div {...menu.pop} style={{ ...menu.pop.style, ...bottom }} className={cx(menu.pop.className, 'dm-ksx-pop dm-mx-pop dm-mx-rows dm-mx-glide', view !== 'main' && 'dm-mx-sw')} role="menu" aria-label="Add source">
          {view === 'main' && <>
            {onUpload && <button type="button" className="dm-mi dm-mx-press" role="menuitem" onClick={() => { menu.closeSoon(); file.current?.click(); }}><Icon name="upload" size="xs" /><span>Upload files</span></button>}
            {onAddWebsite && <button type="button" className="dm-mi dm-mx-press" role="menuitem" onClick={() => { setView('web'); requestAnimationFrame(() => field.current?.focus({ preventScroll: true })); }}><Icon name="globe" size="xs" /><span>Add a website</span></button>}
            {onConnectFolder && <button type="button" className="dm-mi dm-mx-press" role="menuitem" onClick={() => setView('folder')}><Icon name="folder" size="xs" /><span>Connect a folder</span></button>}
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
              ? folders.map(f => <button type="button" key={f.key} className="dm-mi dm-mx-press" role="menuitem" onClick={() => { menu.closeSoon(); onConnectFolder?.(f.key); }}><Icon name="folder" size="xs" /><span>{f.name}{f.detail && <span className="dm-d">{f.detail}</span>}</span></button>)
              : <div className="dm-ph">All folders connected</div>}
          </>}
        </div>
        {onUpload && <input ref={file} type="file" multiple hidden title="" onChange={e => { const fs = [...(e.target.files ?? [])]; e.target.value = ''; if (fs.length) onUpload(fs); }} />}
      </>}
      </div>
    </div>
  );
}
