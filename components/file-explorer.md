# File explorer

> Project files, with the ones the agent touched marked.

Agent components / Workspace. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/file-explorer

## Install

```sh
npx designme add file-explorer          # HTML, CSS and JS, with the shared core
npx designme add file-explorer --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

A project file tree that marks every file the agent changed with M, A or D for modified, added and deleted. Folders that hold a changed file get a dot, so people can find the agent's work without opening every folder. A filter box and an "only changed" switch narrow the tree down.

### When to use it

- When a coding or design agent edits files and people need to see which ones.
- Beside a diff or code viewer, to pick the file to review.
- When a project is large and people want to see only what the agent touched.

### What it does

- Renders `tree` as nested folders and files; a node with `children` is a folder that opens and closes on click.
- Badges each file by its `status` ('M', 'A' or 'D') and puts a dot on folders with a changed file inside.
- The filter box keeps names that contain the typed text, along with the folders that lead to them, and opens those folders.
- The "Only changed" button hides every file the agent did not change, and the footer then reads how many files changed, worded by `summary`.
- Clicking a file selects it, shows its path in the footer and calls `onSelectedChange`.
- Picks a file icon from the extension, or from your own `fileIcon` function.
- The tree scrolls inside the panel with a thin scrollbar in the style's line grey, square in Blueprint.

### Accessibility

- The list has role="tree" and each row has role="treeitem", with aria-expanded on folders and aria-selected on files.
- Each folder's children sit in a role="group", which is inert while the folder is closed.
- The filter input is labelled "Filter files", and the "Only changed" button uses aria-pressed.

## Usage in React

```tsx
import { FileExplorer } from '@/components/designme/file-explorer/FileExplorer';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: the tree opens on the file being worked on.
import { FileExplorer, type FileExplorerNode } from './FileExplorer';

const TREE: FileExplorerNode[] = [
  { name: 'src', children: [
    { name: 'components', children: [{ name: 'PlanCard.tsx', status: 'M' }, { name: 'PriceTag.tsx', status: 'A' }, { name: 'Button.tsx' }, { name: 'LegacyCTA.tsx', status: 'D' }] },
    { name: 'styles', children: [{ name: 'tokens.css', status: 'M' }, { name: 'globals.css' }] },
    { name: 'pages', children: [{ name: 'pricing.mdx', status: 'M' }, { name: 'index.mdx' }] }
  ] },
  { name: 'public', children: [{ name: 'og-pricing.png', status: 'A' }, { name: 'favicon.svg' }] },
  { name: 'package.json' }, { name: 'README.md' }
];

/* ---------- File explorer: the agent's changes marked, filter and "only changed" to narrow it down ---------- */
export default function FileExplorerDemo() {
  return (
    <div style={{ width: '100%' }}>
      <FileExplorer tree={TREE} defaultOpen={['src', 'src/components', 'src/styles']} defaultSelected="src/components/PlanCard.tsx" />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `tree` | `FileExplorerNode[]` |  |
| `open` (optional) | `string[]` | Paths of the open folders, like "src/components". Leave it out to let the folders open and close by themselves |
| `defaultOpen` (optional) | `string[]` |  |
| `onOpenChange` (optional) | `(paths: string[]) => void` |  |
| `selected` (optional) | `string` | Path of the selected file |
| `defaultSelected` (optional) | `string` |  |
| `onSelectedChange` (optional) | `(path: string) => void` |  |
| `query` (optional) | `string` | The filter text |
| `defaultQuery` (optional) | `string` |  |
| `onQueryChange` (optional) | `(query: string) => void` |  |
| `onlyChanged` (optional) | `boolean` | Shows only the files the agent changed |
| `defaultOnlyChanged` (optional) | `boolean` |  |
| `onOnlyChangedChange` (optional) | `(only: boolean) => void` |  |
| `summary` (optional) | `(changed: number) => string` | The footer while only changed files show. Defaults to "6 files changed by the agent" |
| `fileIcon` (optional) | `(name: string) => IconName` | The icon for a file. Defaults to one picked by its extension |
| `placeholder` (optional) | `string` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I mark files the agent changed?**

Set `status` on a file node to 'M', 'A' or 'D'. Parent folders work out on their own that they hold a change and show a dot.

**How do I open the tree on a particular file?**

Pass the folder paths in `defaultOpen` (or `open`), like ['src', 'src/components'], and the file's path in `defaultSelected` (or `selected`).

**How do I load a file when someone clicks it?**

Use `onSelectedChange`. It receives the file's path, built from the folder names joined with slashes, like "src/components/PlanCard.tsx".

**Can I change the file icons?**

Yes. Pass `fileIcon`, a function that takes the file name and returns an icon name.

## Source

`FileExplorer.tsx`, as `npx designme add file-explorer --react` installs it:

```tsx
'use client';
import { Fragment, useState, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { enter, Swap, Tip } from '../lib/motion';
import '../designme.css';
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

  // the tree is drawn afresh when the filter starts or ends and when only changed files show, as on the site;
  // it staggers in when it first appears and when that switch flips
  const [round, setRound] = useState({ only, q: !!q, n: 0, stagger: true });
  if (round.only !== only || round.q !== !!q) setRound({ only, q: !!q, n: round.n + 1, stagger: round.only !== only });

  let index = 0;
  const branch = (nodes: FileExplorerNode[], path: string, depth: number): ReactNode => nodes
    .filter(k => matches(k, q) && (!only || changed(k)))
    .map(k => {
      const p = path ? path + '/' + k.name : k.name, folder = !!k.children, isOpen = folder && (opened.includes(p) || !!q || only);
      const anim = round.stagger ? enter(index++ * 25) : undefined;
      const row = (
        <button type="button" role="treeitem" aria-expanded={folder ? isOpen : undefined} aria-selected={folder ? undefined : p === sel}
          className={cx('dm-fxp-n', isOpen && 'dm-open', p === sel && 'dm-sel', k.status && 'dm-' + k.status, anim?.className)}
          style={{ paddingLeft: 6 + depth * 14, ...anim?.style }}
          onClick={() => {
            if (folder) setOpened(opened.includes(p) ? opened.filter(x => x !== p) : [...opened, p]);
            else { setSel(p); setFoot('selected'); }
          }}>
          <span className="dm-cv">{folder && <Icon name="chev-r" size="xs" />}</span>
          <span className="dm-ic"><Icon name={folder ? 'folder' : fileIcon(k.name)} size="xs" /></span>
          <span className="dm-nm">{k.name}</span>
          {k.status ? <span className={cx('dm-bd', 'dm-' + k.status)}>{k.status}</span> : folder && changed(k) ? <span className="dm-ag" /> : null}
        </button>
      );
      return (
        <Fragment key={p}>
          {row}
          {folder && <div className={cx('dm-fxp-k', !isOpen && 'dm-shut')} role="group" inert={!isOpen}><div>{branch(k.children!, p, depth + 1)}</div></div>}
        </Fragment>
      );
    });

  return (
    <div data-dm="" className={cx('dm-fxp dm-panel', className)}>
      <div className="dm-fxp-h">
        <div className="dm-fxp-s">
          <Icon name="search" size="xs" />
          <input placeholder={placeholder} aria-label="Filter files" spellCheck={false} value={text} onChange={e => setText(e.target.value)} />
        </div>
        <Tip label="Only changed files">
          <button type="button" className={cx('dm-ib dm-fxp-ch', only && 'dm-on')} aria-label="Only changed" aria-pressed={only}
            onClick={() => { setOnly(!only); setFoot(only ? 'selected' : 'summary'); }}><Icon name="filter" size="xs" /></button>
        </Tip>
      </div>
      <div className="dm-fxp-tree" role="tree"><Fragment key={round.n}>{branch(tree, '', 0)}</Fragment></div>
      <div className="dm-fxp-f dm-muted"><Swap className="dm-fxp-st">{foot === 'summary' ? summary(count(tree)) : sel}</Swap></div>
    </div>
  );
}
```

## More in Workspace

- [Automation canvas](https://designme.dev/components/automation-canvas.md): A trigger, a few agent steps, and a run you can watch flow through.
- [Command palette](https://designme.dev/components/command-palette.md): Jump anywhere or hand a task to the agent from one box.
- [Memory panel](https://designme.dev/components/memory-panel.md): What the agent remembers about your team, editable and removable.
- [Model compare](https://designme.dev/components/model-compare.md): Run one prompt on three models side by side and keep the best.
- [Agent settings](https://designme.dev/components/agent-settings.md): How much the agent may do alone, with a save bar for changes.
- [Tools and connections](https://designme.dev/components/tool-connections.md): The tools the agent can reach, and how much it may do with each.
- [Knowledge sources](https://designme.dev/components/knowledge-sources.md): The files, sites and folders the agent knows, and how far each is indexed.
- [Scheduled runs](https://designme.dev/components/scheduled-runs.md): Tasks the agent runs on a schedule, with their last result and a switch.
- [Workspace rail](https://designme.dev/components/workspace-rail.md): A slim app rail that opens into a labelled sidebar.

All components: https://designme.dev/llms.txt
