'use client';
import { Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { enter, Swap, Tip, useGrow } from '../../lib/motion';
import { useHoverGlide } from '../../lib/glide';
import '../../designme.css';
import './file-explorer.css';

/** How the agent changed a file: modified, added or deleted */
export type FileExplorerStatus = 'M' | 'A' | 'D';

/** A file, or a folder when it has children */
export interface FileExplorerNode {
  name: string;
  /** Marks a file the agent changed. Folders with a changed file inside get a dot */
  status?: FileExplorerStatus;
  children?: FileExplorerNode[];
}

export interface FileExplorerProps {
  tree: FileExplorerNode[];
  /** Paths of the open folders, like "src/components". Leave it out to let the folders open and close by themselves */
  open?: string[];
  defaultOpen?: string[];
  onOpenChange?: (paths: string[]) => void;
  /** Path of the selected file */
  selected?: string;
  defaultSelected?: string;
  onSelectedChange?: (path: string) => void;
  /** The filter text */
  query?: string;
  defaultQuery?: string;
  onQueryChange?: (query: string) => void;
  /** Shows only the files the agent changed */
  onlyChanged?: boolean;
  defaultOnlyChanged?: boolean;
  onOnlyChangedChange?: (only: boolean) => void;
  /** The footer while only changed files show. Defaults to "6 files changed by the agent" */
  summary?: (changed: number) => string;
  /** The icon for a file. Defaults to one picked by its extension */
  fileIcon?: (name: string) => IconName;
  placeholder?: string;
  className?: string;
}

const WORD: Record<FileExplorerStatus, string> = { M: 'Modified', A: 'Added', D: 'Deleted' };
const changed = (n: FileExplorerNode): boolean => !!n.status || !!n.children?.some(changed);
const count = (ns: FileExplorerNode[]): number => ns.reduce((s, n) => s + (n.children ? count(n.children) : n.status ? 1 : 0), 0);
const matches = (n: FileExplorerNode, q: string): boolean => !q || n.name.toLowerCase().includes(q) || !!n.children?.some(k => matches(k, q));
const iconFor = (name: string): IconName => /\.tsx$/.test(name) ? 'code' : /\.css$/.test(name) ? 'palette' : /\.png|\.svg$/.test(name) ? 'image' : 'file-text';

/** Project files in a tree you can filter, with the ones the agent touched marked. */
export function FileExplorer({
  tree, open, defaultOpen = [], onOpenChange, selected, defaultSelected = '', onSelectedChange, query, defaultQuery = '', onQueryChange,
  onlyChanged, defaultOnlyChanged = false, onOnlyChangedChange, summary = n => `${n} files changed by the agent`, fileIcon = iconFor,
  placeholder = 'Filter files', className
}: FileExplorerProps) {
  const [opened, setOpened] = useControllable(open, defaultOpen, onOpenChange);
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const [text, setText] = useControllable(query, defaultQuery, onQueryChange);
  const [only, setOnly] = useControllable(onlyChanged, defaultOnlyChanged, onOnlyChangedChange);
  const [foot, setFoot] = useState<'selected' | 'summary'>(only ? 'summary' : 'selected');
  const q = text.trim().toLowerCase();
  // the card grows as folders open and shrinks as they close or the filter narrows (as grow() on the site)
  const [root, inner] = useGrow();
  // while there is more of the tree below, its last row fades at the edge instead of being cut off (a row's entrance lifts it
  // a few pixels, so less than half a row more doesn't count)
  const treeRef = useRef<HTMLDivElement>(null), [more, setMore] = useState(false);
  // Clean's one hover: a highlight that glides from row to row; the picked file keeps its own fill
  useHoverGlide(treeRef, '.dm-fxp-n', { keep: '.dm-sel' });
  useEffect(() => {
    const t = treeRef.current; if (!t) return;
    const edge = () => setMore(t.scrollTop + t.clientHeight < t.scrollHeight - 12);
    const ro = new ResizeObserver(edge); ro.observe(t); edge();
    t.addEventListener('scroll', edge, { passive: true }); t.addEventListener('transitionend', edge); t.addEventListener('animationend', edge);
    return () => { ro.disconnect(); t.removeEventListener('scroll', edge); t.removeEventListener('transitionend', edge); t.removeEventListener('animationend', edge); };
  }, []);

  // the tree is drawn afresh when the filter starts or ends and when only changed files show, as on the site;
  // it staggers in when it first appears and when that switch flips
  const [round, setRound] = useState({ only, q: !!q, n: 0, stagger: true });
  if (round.only !== only || round.q !== !!q) setRound({ only, q: !!q, n: round.n + 1, stagger: round.only !== only });

  let index = 0;
  const branch = (nodes: FileExplorerNode[], path: string, depth: number): ReactNode[] => nodes
    .filter(k => matches(k, q) && (!only || changed(k)))
    .map(k => {
      const p = path ? path + '/' + k.name : k.name, folder = !!k.children, isOpen = folder && (opened.includes(p) || !!q || only);
      const anim = round.stagger ? enter(index++ * 25) : undefined;
      const row = (
        <button type="button" role="treeitem" aria-expanded={folder ? isOpen : undefined} aria-selected={folder ? undefined : p === sel}
          className={cx('dm-fxp-n', isOpen && 'dm-open', p === sel && 'dm-sel', k.status && 'dm-' + k.status, anim?.className)}
          style={{ paddingLeft: 9 + depth * 14, ...anim?.style }}
          onClick={() => {
            if (folder) setOpened(opened.includes(p) ? opened.filter(x => x !== p) : [...opened, p]);
            else { setSel(p); setFoot('selected'); }
          }}>
          <span className="dm-cv">{folder && <Icon name="chev-r" size="xs" />}</span>
          <span className="dm-ic"><Icon name={folder ? 'folder' : fileIcon(k.name)} size="xs" /></span>
          <span className="dm-nm">{k.name}</span>
          {k.status ? <span className={cx('dm-bd', 'dm-' + k.status)} aria-label={WORD[k.status]}>{k.status}</span> : folder && changed(k) ? <span className="dm-ag" aria-hidden="true" /> : null}
        </button>
      );
      return (
        <Fragment key={p}>
          {row}
          {folder && <div className={cx('dm-fxp-k', !isOpen && 'dm-shut')} role="group" inert={!isOpen}><div>{branch(k.children!, p, depth + 1)}</div></div>}
        </Fragment>
      );
    });

  const rows = branch(tree, '', 0);
  return (
    <div data-dm="" ref={root} className={cx('dm-fxp dm-panel dm-growing', className)}>
      <div ref={inner} className="dm-grow">
        <div className="dm-fxp-h">
          <div className="dm-fxp-s">
            <Icon name="search" size="xs" />
            <input placeholder={placeholder} aria-label="Filter files" spellCheck={false} value={text} onChange={e => setText(e.target.value)} />
          </div>
          <Tip label="Only changed files">
            <button type="button" className="dm-ib dm-fxp-ch" aria-label="Only changed" aria-pressed={only}
              onClick={() => { setOnly(!only); setFoot(only ? 'selected' : 'summary'); }}><Icon name="filter" size="xs" /></button>
          </Tip>
        </div>
        <div ref={treeRef} className={cx('dm-fxp-tree', more && 'dm-more')} role="tree" aria-label="Files" hidden={!rows.length}><Fragment key={round.n}>{rows}</Fragment></div>
        {/* nothing matches the filter: the empty state, and Clear filter brings the tree back */}
        {!rows.length && (
          <div className="dm-fxp-em"><span className="dm-fxp-em-art" aria-hidden="true" /><b>No matching files</b><span>Nothing in the project is called “{text.trim()}”.</span>
            <button type="button" className="dm-pill dm-line dm-sm" onClick={() => setText('')}>Clear filter</button></div>
        )}
        <div className="dm-fxp-f dm-muted"><Swap className="dm-fxp-st">{foot === 'summary' ? summary(count(tree)) : sel}</Swap></div>
      </div>
    </div>
  );
}
