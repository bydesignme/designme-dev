# Code viewer

> Code the agent wrote, with line notes you can ask about.

Agent components / Sources and output. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/code-viewer

## Install

```sh
npx designme add code-viewer          # HTML, CSS and JS, with the shared core
npx designme add code-viewer --react  # React 19 component and its CSS
npx designme add code-viewer --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/code-viewer.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/code-viewer.json  # Astro
```

## About

Code viewer shows the files an agent wrote or changed, with the changed lines marked. Click any line and a note opens under it with the agent's explanation of that line.

### When to use it

- When people want to understand why the agent wrote a line before they accept the change.
- When an agent edits more than one file and you want tabs to move between them.
- When you want changed lines highlighted without showing a full diff.
- When readers need a quick way to copy the generated file.

### What it does

- Each file appears as a tab. The header counts how many lines in the open file changed.
- Lines can be plain strings or pieces tagged for highlighting: keyword, string, function, comment, tag and attribute.
- Lines marked `changed` get a green number and a soft wash.
- Clicking a line opens a note that says "Reading the line" for `delay` ms, then crossfades to the line's `note`. Lines with no note show `unchangedNote`.
- The copy button copies the open file as plain text, shows "Copied to clipboard" and calls `onCopy`.
- The open file and open line can be controlled with `file`, `line` and their change handlers, so the agent can point at a line itself.

### Accessibility

- The file tabs sit in a `tablist`, and each tab is a `tab` with `aria-selected`.
- Each code line is focusable with `role="button"` and `aria-expanded`. Enter or Space opens and closes its note.
- The note is an `aria-live="polite"` region, so the explanation is announced when it appears.
- The copy button has `aria-label="Copy file"`, and with reduced motion the note opens without its height animation.

## Usage in React

```tsx
import { CodeViewer } from '@/components/designme/code-viewer/CodeViewer';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { CodeViewer, type CodeFile, type CodePiece, type CodeToken } from './CodeViewer';
import { useStory } from '../lib/useScript';

/** Turns "<k>return</k> (" into highlight pieces, so the code below reads like code */
const hl = (src: string): CodePiece[] => src.split(/(<(?:k|s|f|cm|tg|at)>.*?<\/(?:k|s|f|cm|tg|at)>)/).filter(Boolean)
  .map(p => { const m = p.match(/^<(\w+)>(.*)<\/\1>$/); return m ? [m[1] as CodeToken, m[2]] : p; });

/* ---------- Code viewer: a changed file, and after a moment the agent explains one of its lines ---------- */
const FILES: CodeFile[] = [
  { name: 'PlanCard.tsx', lines: [
    { code: hl('<k>import</k> { Button } <k>from</k> <s>"@/ui/button"</s>;') },
    { code: '' },
    { code: hl('<k>export function</k> <f>PlanCard</f>({ plan }) {') },
    { code: hl('  <cm>// One CTA per card, annual price first</cm>'), changed: true, note: 'The agent removed the second link here. The design review said two CTAs split attention.' },
    { code: hl('  <k>return</k> (') },
    { code: hl('    <tg><Card</tg> <at>padding</at>=<s>"lg"</s><tg>></tg>') },
    { code: hl('      <tg><Price</tg> <at>value</at>={plan.annual} <at>was</at>={plan.monthly} <tg>/></tg>'), changed: true, note: 'Shows the monthly price crossed out next to the annual one. This is the change behind the 18% lift.' },
    { code: hl('      <tg><Button</tg> <at>variant</at>=<s>"primary"</s><tg>></tg>{plan.cta}<tg></Button></tg>'), changed: true, note: 'Swapped the custom button for the shared one, so it picks up the library tokens.' },
    { code: hl('    <tg></Card></tg>') },
    { code: '  );' },
    { code: '}' }
  ] },
  { name: 'tokens.css', lines: [
    { code: hl('<f>:root</f> {') },
    { code: hl('  --text-muted: <s>#5b6472</s>;'), changed: true, note: 'Was #c9cfd8. Contrast on white goes from 2.1 to 5.9, which passes AA.' },
    { code: hl('  --radius-card: <s>16px</s>;') },
    { code: hl('  --space-card: <s>24px</s>;'), changed: true, note: 'Matched to the 4px grid. Was 18px.' },
    { code: '}' }
  ] }
];

export default function CodeViewerDemo() {
  const [line, setLine] = useState<number | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  // the preview asks about one line on its own, unless you take over first
  useStory(ref, async ({ wait }) => { await wait(1200); setLine(l => l ?? 6); });
  return <div ref={ref} style={{ width: '100%' }}><CodeViewer files={FILES} line={line} onLineChange={setLine} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `files` | `CodeFile[]` |  |
| `file` (optional) | `string` | The open file, by name. Leave it out to let the tabs switch it |
| `defaultFile` (optional) | `string` |  |
| `onFileChange` (optional) | `(name: string) => void` |  |
| `line` (optional) | `number \| null` | The line whose note is open (0 is the first line), or null. Leave it out to let a click on a line open it |
| `defaultLine` (optional) | `number \| null` |  |
| `onLineChange` (optional) | `(line: number \| null) => void` |  |
| `delay` (optional) | `number` | How long a note says "Reading the line" before it answers, in ms |
| `unchangedNote` (optional) | `string` | The note for a line the agent didn't change and has nothing to say about |
| `onCopy` (optional) | `(text: string) => void` | Called with the file's text when it is copied |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import CodeViewer from '../components/designme/code-viewer/CodeViewer.astro';
---
<CodeViewer />
<CodeViewer data-style="soft" class="my-class" />
```
It plays its demo; change `code-viewer.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does it highlight syntax automatically?**

No. It renders the tokens you give it. Pass `code` as an array of plain strings and `[token, text]` pairs, using `k`, `s`, `f`, `cm`, `tg` or `at`.

**Can the agent open a note on a line by itself?**

Yes. Control `line` with the index of the line, starting at 0, and update it from `onLineChange`. The demo opens line 7's note this way after a short wait.

**What does the "Reading the line" pause do?**

It shows for `delay` milliseconds, 600 by default, before the note text appears. Set `delay` to 0 if you want the note to show right away.

## Source

`CodeViewer.tsx`, as `npx designme add code-viewer --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useCopied, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Tip } from '../lib/motion';
import '../designme.css';
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
```

## More in Sources and output

- [Terminal stream](https://designme.dev/components/terminal-stream.md): Shell commands the agent runs, with their output as it streams in.
- [Citation hover card](https://designme.dev/components/citation-hover-card.md): Hover a citation to see the exact passage it came from.
- [Source stack](https://designme.dev/components/source-stack.md): Everything the agent read, folded into one quiet pill.
- [Field extraction](https://designme.dev/components/field-extraction.md): The agent pulls fields out of a document and shows where each came from.
- [Metric insight](https://designme.dev/components/metric-insight.md): A number, its trend, and the agent's read on why it moved.
- [Details panel](https://designme.dev/components/details-panel.md): Properties of a run you can change in place.
- [Task table](https://designme.dev/components/task-table.md): Agent tasks in a sortable table with bulk actions.

All components: https://designme.dev/llms.txt
