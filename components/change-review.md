# Change review

> Accept or reject each change the agent made, file by file.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/change-review

## Install

```sh
npx designme add change-review          # HTML, CSS and JS, with the shared core
npx designme add change-review --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Change review lays out the edits an agent made as a file list beside a diff, so a person can go through them one change at a time. Each hunk gets its own Keep and Undo buttons, and any line can carry a question back to the agent.

### When to use it

- When an agent has edited several files and a person should approve the work before it lands.
- When some changes are right and others are not, and people need to keep part of the work.
- When a reviewer wants to ask the agent why it changed a specific line.
- When you need a running record of which hunks were kept and which were undone.

### What it does

- The side list shows every file with its type label, a status mark (kept, undone or partly decided) and a total of added and removed lines.
- Each hunk has a title, coloured add and delete lines with line numbers, and its own Keep and Undo buttons. Pressing the same choice again clears it.
- Undo all and Keep all decide every hunk in the open file. After Keep all, the next file opens by itself.
- The plus button on a line opens a field to ask the agent about it. Sending it empty asks "Why this change?" and calls `onComment` with the file, hunk, line and text.
- Decisions are stored by hunk `key` and can be left internal or controlled with `decisions` and `onDecisionsChange`.
- The open file can be controlled with `file` and `onFileChange`, and `title` replaces the "N files changed" header.

### Accessibility

- Files, hunk choices and bulk actions are all real buttons.
- Each line's comment button has `aria-label="Comment on line"` and a Comment tooltip.
- The comment field is focused when it opens and has an `aria-label`. Enter sends it and Escape closes it.

## Usage in React

```tsx
import { ChangeReview } from '@/components/designme/change-review/ChangeReview';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component: three files to review, hunk by hunk.
import { ChangeReview, type ChangedFile } from './ChangeReview';

const FILES: ChangedFile[] = [
  { name: 'PricingCard.tsx', path: 'src/PricingCard.tsx', hunks: [
    { title: 'Use the shared button', lines: [{ kind: 'ctx', line: 14, text: '  return (' }, { kind: 'del', line: 15, text: '    <button className="cta-old">' }, { kind: 'add', line: 15, text: '    <Button variant="primary">' }, { kind: 'ctx', line: 16, text: '      {plan.cta}' }] },
    { title: 'Drop the second CTA', lines: [{ kind: 'del', line: 22, text: '    <a href="/contact">Talk to sales</a>' }, { kind: 'ctx', line: 22, text: '  </Card>' }] }
  ] },
  { name: 'tokens.css', path: 'src/tokens.css', hunks: [
    { title: 'Raise muted text contrast', lines: [{ kind: 'ctx', line: 8, text: ':root {' }, { kind: 'del', line: 9, text: '  --text-muted: #c9cfd8;' }, { kind: 'add', line: 9, text: '  --text-muted: #5b6472;' }, { kind: 'ctx', line: 10, text: '  --radius-card: 16px;' }] }
  ] },
  { name: 'pricing.mdx', path: 'src/pricing.mdx', hunks: [
    { title: 'Move the FAQ below the table', lines: [{ kind: 'del', line: 31, text: '<FAQ />' }, { kind: 'ctx', line: 31, text: '<CompareTable />' }, { kind: 'add', line: 32, text: '<FAQ />' }] }
  ] }
];

export default function ChangeReviewDemo() {
  return <div style={{ width: '100%' }}><ChangeReview files={FILES} /></div>;
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `files` | `ChangedFile[]` |  |
| `file` (optional) | `number` | The file shown on the right, by index. Leave it out to let the list pick it |
| `defaultFile` (optional) | `number` |  |
| `onFileChange` (optional) | `(index: number) => void` |  |
| `decisions` (optional) | `Record<string, HunkDecision>` | Kept or undone, by hunk key. Leave it out to let the buttons keep track |
| `defaultDecisions` (optional) | `Record<string, HunkDecision>` |  |
| `onDecisionsChange` (optional) | `(decisions: Record<string, HunkDecision>) => void` |  |
| `onComment` (optional) | `(comment: LineComment) => void` | Called when the person asks the agent about a line. Without a question it sends "Why this change?" |
| `title` (optional) | `string` | Header over the file list. Defaults to "N files changed" |
| `className` (optional) | `string` |  |

## Questions

**How do I know which changes the person kept?**

Read the `decisions` object passed to `onDecisionsChange`. It maps each hunk key to `kept` or `undone`, and hunks with no decision are left out.

**What is a hunk key if I don't set one?**

It defaults to the file name plus the hunk's index, like `PricingCard.tsx#0`. Set `key` on a hunk if you need a stable id of your own.

**How do line questions reach my agent?**

Handle `onComment`. It receives the file, hunk, line and the question text, and the sent question stays under the line in the diff.

**Does Undo actually revert the code?**

No. The component records the decision and greys out the hunk. Applying or reverting the change in your project is up to your own code.

## Source

`ChangeReview.tsx`, as `npx designme add change-review --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './change-review.css';

export interface DiffLine {
  /** add and del lines are coloured; ctx lines are unchanged context */
  kind: 'add' | 'del' | 'ctx';
  /** The line number shown in the gutter */
  line: number;
  text: string;
}

export interface Hunk {
  /** Identifies the hunk in `decisions`. Defaults to "<file name>#<index>" */
  key?: string;
  /** What the change does, like "Use the shared button" */
  title: string;
  lines: DiffLine[];
}

export interface ChangedFile {
  /** Like "PricingCard.tsx". Its extension becomes the type label */
  name: string;
  /** Shown above the diff, like "src/PricingCard.tsx". Defaults to the name */
  path?: string;
  hunks: Hunk[];
}

export type HunkDecision = 'kept' | 'undone';

export interface LineComment {
  file: ChangedFile;
  hunk: Hunk;
  line: DiffLine;
  text: string;
}

export interface ChangeReviewProps {
  files: ChangedFile[];
  /** The file shown on the right, by index. Leave it out to let the list pick it */
  file?: number;
  defaultFile?: number;
  onFileChange?: (index: number) => void;
  /** Kept or undone, by hunk key. Leave it out to let the buttons keep track */
  decisions?: Record<string, HunkDecision>;
  defaultDecisions?: Record<string, HunkDecision>;
  onDecisionsChange?: (decisions: Record<string, HunkDecision>) => void;
  /** Called when the person asks the agent about a line. Without a question it sends "Why this change?" */
  onComment?: (comment: LineComment) => void;
  /** Header over the file list. Defaults to "N files changed" */
  title?: string;
  className?: string;
}

const keyOf = (f: ChangedFile, h: Hunk, k: number) => h.key ?? `${f.name}#${k}`;
const ext = (name: string) => name.split('.').pop() ?? '';

type Box = { draft: string; sent?: string };

/** A diff to review hunk by hunk: keep or undo each change, or ask the agent about a line. */
export function ChangeReview({ files, file, defaultFile = 0, onFileChange, decisions, defaultDecisions = {}, onDecisionsChange, onComment, title, className }: ChangeReviewProps) {
  const [cur, setCur] = useControllable(file, defaultFile, onFileChange);
  const [dec, setDec] = useControllable(decisions, defaultDecisions, onDecisionsChange);
  // the hunks play their entrance again when the file is shown afresh, as after Keep all
  const [shown, setShown] = useState(0);
  const [boxes, setBoxes] = useState<Record<string, Box>>({});
  const next = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(next.current), []);

  const at = Math.max(0, Math.min(files.length - 1, cur));
  const f = files[at] ?? { name: '', hunks: [] };
  let added = 0, removed = 0;
  files.forEach(x => x.hunks.forEach(h => h.lines.forEach(l => { if (l.kind === 'add') added++; if (l.kind === 'del') removed++; })));

  const show = (i: number) => { setCur(i); setShown(s => s + 1); };
  const decide = (key: string, s: HunkDecision) => { const d = { ...dec }; if (d[key] === s) delete d[key]; else d[key] = s; setDec(d); };
  const bulk = (s: HunkDecision) => {
    const d = { ...dec }; f.hunks.forEach((h, k) => { d[keyOf(f, h, k)] = s; }); setDec(d); setShown(n => n + 1);
    clearTimeout(next.current);
    if (s === 'kept' && at < files.length - 1) next.current = setTimeout(() => show(at + 1), 500);
  };

  const state = (x: ChangedFile) => {
    const all = (s: HunkDecision) => x.hunks.every((h, k) => dec[keyOf(x, h, k)] === s);
    if (all('kept')) return 'kept'; if (all('undone')) return 'undone';
    return x.hunks.some((h, k) => dec[keyOf(x, h, k)]) ? 'some' : '';
  };

  const box = (id: string, b: Box | null) => setBoxes(all => { const n = { ...all }; if (b) n[id] = b; else delete n[id]; return n; });
  const send = (id: string, h: Hunk, l: DiffLine) => {
    const text = boxes[id]?.draft.trim() || 'Why this change?';
    box(id, { draft: '', sent: text });
    onComment?.({ file: f, hunk: h, line: l, text });
  };

  return (
    <div data-dm="" className={cx('dm-crx dm-panel', className)}>
      <div className="dm-crx-side">
        <div className="dm-crx-sh">
          <b>{title ?? `${files.length} ${files.length === 1 ? 'file' : 'files'} changed`}</b>
          <span className="dm-muted dm-crx-tot dm-num"><span style={{ color: 'var(--dm-ok)' }}>+{added}</span> <span style={{ color: 'var(--dm-bad)' }}>−{removed}</span></span>
        </div>
        <div className="dm-crx-files">
          {files.map((x, i) => {
            const s = state(x), e = ext(x.name);
            return (
              <button key={x.name + i} type="button" className={cx('dm-crx-f', i === at && 'dm-on', s === 'kept' && 'dm-kept', s === 'undone' && 'dm-undone')} onClick={() => show(i)}>
                <span className={cx('dm-ft', e === 'tsx' && 'dm-re')}>{e.toUpperCase()}</span>
                <span className="dm-nm">{x.name}</span>
                <span className="dm-st">{s === 'kept' ? <Icon name="check" size="xs" /> : s === 'undone' ? <Icon name="undo" size="xs" /> : <span className="dm-dot" style={s === 'some' ? { color: 'var(--dm-accent)' } : undefined} />}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="dm-crx-main">
        <div className="dm-crx-mh">
          <Swap className="dm-crx-fn dm-num">{f.path ?? f.name}</Swap>
          <span className="dm-crx-sp" />
          <button type="button" className="dm-pill dm-ghost dm-sm dm-crx-rej" onClick={() => bulk('undone')}>Undo all</button>
          <button type="button" className="dm-pill dm-primary dm-sm dm-crx-ok" onClick={() => bulk('kept')}>Keep all</button>
        </div>
        <div className="dm-crx-diff" key={at + ':' + shown}>
          {f.hunks.map((h, k) => {
            const key = keyOf(f, h, k), s = dec[key] ?? '', e = enter(k * 70);
            return (
              <div key={key} className={cx('dm-crx-hk', s && 'dm-' + s, e.className)} style={e.style}>
                <div className="dm-crx-hh">
                  <Icon name="spark" size="xs" />
                  <span>{h.title}</span>
                  <span className="dm-sp" />
                  <button type="button" className="dm-pill dm-ghost dm-hk-u" onClick={() => decide(key, 'undone')}>Undo</button>
                  <button type="button" className="dm-pill dm-soft dm-hk-k" onClick={() => decide(key, 'kept')}>Keep</button>
                </div>
                {h.lines.map((l, j) => {
                  const id = `${at}:${k}:${j}`, b = boxes[id];
                  return [
                    <div key={id} className={cx('dm-crx-l', 'dm-' + l.kind)}>
                      <span className="dm-ln">{l.line}</span>
                      <span className="dm-c">{l.text}</span>
                      <Tip label="Comment">
                        <button type="button" className="dm-cm" aria-label="Comment on line" onClick={() => { if (!b) box(id, { draft: '' }); }}><Icon name="plus" size="xs" /></button>
                      </Tip>
                    </div>,
                    b && <Comment key={id + 'c'} box={b} onDraft={draft => box(id, { draft })} onSend={() => send(id, h, l)} onCancel={() => box(id, null)} />
                  ];
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function Comment({ box, onDraft, onSend, onCancel }: { box: Box; onDraft: (v: string) => void; onSend: () => void; onCancel: () => void }) {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => { input.current?.focus(); }, []);
  const key = (e: KeyboardEvent) => { if (e.key === 'Enter') onSend(); if (e.key === 'Escape') onCancel(); };
  if (box.sent !== undefined) return <div key="sent" className="dm-crx-cmt dm-sent dm-enter"><Icon name="at" size="xs" /><span>{box.sent}</span></div>;
  return (
    <div key="draft" className="dm-crx-cmt dm-enter">
      <input ref={input} placeholder="Ask the agent about this line" aria-label="Ask the agent about this line" value={box.draft} onChange={e => onDraft(e.target.value)} onKeyDown={key} />
      <button type="button" className="dm-pill dm-accent dm-sm" onClick={onSend}>Send</button>
    </div>
  );
}
```

## More in Review and approve

- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Permission gate](https://designme.dev/components/permission-gate.md): The agent asks before it touches something new.
- [Hand-off to a person](https://designme.dev/components/human-handoff.md): The agent hands a conversation to a person, with what they need to pick it up.
- [Decision prompt](https://designme.dev/components/decision-prompt.md): The agent asks a few quick questions before it starts.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Design tuner](https://designme.dev/components/design-tuner.md): Tweak a component by hand or let the agent tune it.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Launch checklist](https://designme.dev/components/launch-checklist.md): The agent checks a design before it ships, and fixes what fails.
- [Inline text diff](https://designme.dev/components/inline-text-diff.md): The agent's edits to a piece of copy, accepted or rejected one by one.
- [Draft review](https://designme.dev/components/draft-review.md): An email the agent drafted, to check and edit before it sends.
- [Steering](https://designme.dev/components/steering.md): Change the agent's course while it works, without starting over.
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.
- [Design review](https://designme.dev/components/design-review.md): Checks run, a teammate asks for a change, the agent makes it, and you ship.

All components: https://designme.dev/llms.txt
