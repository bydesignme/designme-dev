# Rewrite toolbar

> Select a sentence and let the agent rewrite it in place.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/rewrite-toolbar

## Install

```sh
npx designme add rewrite-toolbar          # HTML, CSS and JS, with the shared core
npx designme add rewrite-toolbar --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Rewrite toolbar lets a person click a sentence in a document and get a small toolbar with rewrite options, such as Clearer, Shorter or Friendlier. The agent's new sentence is written in word by word next to the struck-out original, and the person accepts it or puts the old one back.

### When to use it

- When people edit copy with an agent and want to change one sentence without regenerating the whole text.
- When the old and new wording should be visible side by side before anything is saved.
- When you want a few one-click rewrite styles plus a way to open a fuller agent prompt.
- When a shortcut or command menu should be able to trigger the same rewrites.

### What it does

- The text is passed as `sentences`, one string each, so a click selects exactly one sentence. The toolbar appears above it, or below it when there is no room above.
- `actions` sets the buttons, Clearer, Shorter and Friendlier by default. Each one calls `onRewrite` with the sentence, the action key and its index.
- While `onRewrite` works the toolbar says Rewriting. The answer is then typed in word by word, and the toolbar offers Accept and Undo.
- Accept saves the sentence and calls `onSentencesChange` with the full text. Undo, or a failed `onRewrite`, leaves the original sentence as it was.
- The wand button calls `onAsk` if you pass it, or runs the first action. Its tooltip shows `askLabel` and the `askShortcut` hint.
- A ref exposes `rewrite(action)`, `accept()` and `undo()` so you can drive it from your own shortcuts or scripts.

### Accessibility

- The toolbar has `role="toolbar"` with `aria-label="Rewrite"`, and it is `inert` while no sentence is selected.
- The wand button has an `aria-label` taken from `askLabel`.
- With reduced motion turned on, the rewrite appears all at once instead of word by word.

## Usage in React

```tsx
import { RewriteToolbar } from '@/components/designme/rewrite-toolbar/RewriteToolbar';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { RewriteToolbar, type RewriteToolbarHandle } from './RewriteToolbar';
import { useStory } from '../lib/useScript';

/* ---------- Rewrite toolbar: the first sentence is picked, made clearer and kept ---------- */
const TEXT = [
  'Welcome to DesignMe, a place where you and your team can work together with an agent on all of your design files in one place.',
  'To get started you will need to connect Figma, which can be done from the settings page at any time.',
  'After that, the agent will be able to read your frames and suggest improvements.'
];
const REWRITES: Record<string, string>[] = [
  { clear: 'DesignMe is where your team and an agent design together.', short: 'Design with your team and an agent.', warm: 'Welcome in. This is where you, your team and your agent make things together.' },
  { clear: 'Connect Figma in Settings to get started.', short: 'First, connect Figma.', warm: 'Start by connecting Figma. It takes about a minute.' },
  { clear: 'Then the agent can read your frames and suggest fixes.', short: 'Then the agent reviews your frames.', warm: 'Then your agent can look through your frames and help polish them.' }
];
export default function RewriteToolbarDemo() {
  const [selected, setSelected] = useState<number | null>(null);
  const toolbar = useRef<RewriteToolbarHandle>(null), ref = useRef<HTMLDivElement>(null);
  // plays once on its own: picks the first sentence, makes it clearer and keeps it. Clicking, focusing or typing in it takes over
  useStory(ref, async ({ wait }) => {
    await wait(1300); setSelected(s => s ?? 0);
    await wait(1200); toolbar.current?.rewrite('clear');
    await wait(2600); toolbar.current?.accept();
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <RewriteToolbar ref={toolbar} title="Onboarding intro" defaultSentences={TEXT} selected={selected} onSelectedChange={setSelected}
        onRewrite={(_, action, i) => new Promise<string>(res => setTimeout(() => res(REWRITES[i][action]), 350))} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `ReactNode` | The document's name |
| `kind` (optional) | `string` | The file type tag in front of the name. Defaults to DOC |
| `sentences` (optional) | `string[]` | The text, one sentence each, so a click picks a sentence |
| `defaultSentences` (optional) | `string[]` |  |
| `onSentencesChange` (optional) | `(sentences: string[]) => void` | Called with every sentence once a rewrite is accepted |
| `selected` (optional) | `number \| null` | Index of the sentence with the toolbar on it, or null. Leave it out to let clicks pick it |
| `defaultSelected` (optional) | `number \| null` |  |
| `onSelectedChange` (optional) | `(index: number \| null) => void` |  |
| `actions` (optional) | `RewriteAction[]` | Defaults to Clearer, Shorter and Friendlier |
| `onRewrite` | `(sentence: string, action: string, index: number) => Promise<string> \| string` | Writes the new sentence. While it works the toolbar says Rewriting; the answer is then written in word by word. If it throws, the sentence is left as it was |
| `onAsk` (optional) | `(sentence: string, index: number) => void` | The wand at the end of the toolbar. Left out, it rewrites with the first action |
| `askLabel` (optional) | `string` | The tip on the wand |
| `askShortcut` (optional) | `string` | The shortcut shown in that tip |
| `ref` (optional) | `Ref<RewriteToolbarHandle>` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I connect it to my model?**

Pass `onRewrite(sentence, action, index)` and return the new sentence or a promise of it. The component handles the waiting state, the word-by-word reveal and the review step.

**What happens if the rewrite request fails?**

If `onRewrite` throws or rejects, the sentence stays as it was and the toolbar goes back to offering the rewrite actions.

**Does the ⌘K shortcut work out of the box?**

No. `askShortcut` is only shown in the wand's tooltip. Bind the key yourself and call the ref's `rewrite` method or your own `onAsk` logic.

**Can I click away while the agent is still rewriting?**

A click outside closes the toolbar only when no rewrite is in progress. While a rewrite is waiting, the toolbar stays open until it is accepted or undone.

## Source

`RewriteToolbar.tsx`, as `npx designme add rewrite-toolbar --react` installs it:

```tsx
'use client';
import { useEffect, useImperativeHandle, useRef, useState, type ReactNode, type Ref } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Swap, Think, Tip } from '../lib/motion';
import '../designme.css';
import './rewrite-toolbar.css';

/** A button in the toolbar, like Clearer or Shorter */
export interface RewriteAction {
  key: string;
  label: string;
  icon?: IconName;
}

/** What a ref to the toolbar can do: drive it from a shortcut, a command menu or a scripted demo */
export interface RewriteToolbarHandle {
  /** Rewrites the selected sentence with one of the actions, as a click on that action does */
  rewrite: (action: string) => void;
  /** Keeps the rewrite that is waiting for review */
  accept: () => void;
  /** Puts the sentence back as it was */
  undo: () => void;
}

export interface RewriteToolbarProps {
  /** The document's name */
  title: ReactNode;
  /** The file type tag in front of the name. Defaults to DOC */
  kind?: string;
  /** The text, one sentence each, so a click picks a sentence */
  sentences?: string[];
  defaultSentences?: string[];
  /** Called with every sentence once a rewrite is accepted */
  onSentencesChange?: (sentences: string[]) => void;
  /** Index of the sentence with the toolbar on it, or null. Leave it out to let clicks pick it */
  selected?: number | null;
  defaultSelected?: number | null;
  onSelectedChange?: (index: number | null) => void;
  /** Defaults to Clearer, Shorter and Friendlier */
  actions?: RewriteAction[];
  /** Writes the new sentence. While it works the toolbar says Rewriting; the answer is then written in word by word.
      If it throws, the sentence is left as it was */
  onRewrite: (sentence: string, action: string, index: number) => Promise<string> | string;
  /** The wand at the end of the toolbar. Left out, it rewrites with the first action */
  onAsk?: (sentence: string, index: number) => void;
  /** The tip on the wand */
  askLabel?: string;
  /** The shortcut shown in that tip */
  askShortcut?: string;
  ref?: Ref<RewriteToolbarHandle>;
  className?: string;
}

const ACTIONS: RewriteAction[] = [{ key: 'clear', label: 'Clearer', icon: 'spark' }, { key: 'short', label: 'Shorter' }, { key: 'warm', label: 'Friendlier' }];

type Job = { index: number; old: string; text?: string; shown: number };

/** Click a sentence and a small toolbar offers rewrites; the new text is written in beside the old one, to accept or undo. */
export function RewriteToolbar({
  title, kind = 'DOC', sentences, defaultSentences = [], onSentencesChange, selected, defaultSelected = null, onSelectedChange,
  actions = ACTIONS, onRewrite, onAsk, askLabel = 'Ask the agent', askShortcut = '⌘K', ref, className
}: RewriteToolbarProps) {
  const [text, setText] = useControllable(sentences, defaultSentences, onSentencesChange);
  const [sel, setSel] = useControllable(selected, defaultSelected, onSelectedChange);
  const [job, setJob] = useState<Job | null>(null);
  const [status, setStatus] = useState('Click a sentence');
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const head = useRef<HTMLDivElement>(null);
  const spans = useRef<(HTMLSpanElement | null)[]>([]);
  const [at, setAt] = useState<{ left: number; top: number }>({ left: 0, top: 0 });
  // keeping a shorter sentence keeps the doc's height, with the text centred in it, so it doesn't shrink under the reader
  const busy = job !== null;
  // the toolbar turns to Rewritten one beat after the last word, as the site does
  const phase = !busy ? 'menu' : job.text !== undefined && job.shown > words(job.text).length ? 'review' : 'working';
  // while the toolbar fades away it keeps what it last showed
  const [last, setLast] = useState(phase);
  if (sel !== null && phase !== last) setLast(phase);
  const view = sel !== null ? phase : last;

  // a new selection from outside says the same as a click does
  useEffect(() => { if (sel !== null && !busy) setStatus('Pick a rewrite'); }, [sel]); // eslint-disable-line react-hooks/exhaustive-deps

  // the toolbar sits above the sentence's first line, or under its last when above would cover the header. The new
  // sentence takes its full room as soon as it arrives, so the toolbar is placed clear of it before the words come in
  useIsoLayoutEffect(() => {
    const el = sel === null ? null : spans.current[sel], tb = bar.current, box = root.current;
    if (!el || !tb || !box) return;
    const br = box.getBoundingClientRect(), rects = el.getClientRects(), f = rects[0]; if (!f) return;
    const left = Math.max(8, Math.min(f.left - br.left, br.width - tb.offsetWidth - 8));
    let top = f.top - br.top - tb.offsetHeight - 8;
    if (top < (head.current ? head.current.getBoundingClientRect().bottom - br.top : 4)) top = rects[rects.length - 1].bottom - br.top + 8;
    setAt({ left, top });
  }, [sel, view, job?.text]);

  // a click anywhere else puts the toolbar away, unless a rewrite is waiting on an answer
  const latest = useRef({ busy, setSel });
  useEffect(() => { latest.current = { busy, setSel }; });
  useEffect(() => {
    const down = (e: PointerEvent) => { const l = latest.current; if (!l.busy && !root.current?.contains(e.target as Node)) l.setSel(null); };
    document.addEventListener('pointerdown', down);
    return () => document.removeEventListener('pointerdown', down);
  }, []);

  // the answer is written in a word at a time
  useEffect(() => {
    if (!job?.text || job.shown > words(job.text).length) return;
    const t = setTimeout(() => setJob(j => j && { ...j, shown: reduce ? words(j.text!).length + 1 : j.shown + 1 }), job.shown === 0 ? 0 : 55);
    return () => clearTimeout(t);
  }, [job, reduce]);

  const pick = (i: number) => { if (busy) return; setSel(i); setStatus('Pick a rewrite'); };
  const rewrite = async (action: string) => {
    if (sel === null || busy) return;
    const index = sel, old = text[index];
    setJob({ index, old, shown: 0 });
    let out: string;
    // if the rewrite fails, the sentence goes back as it was and the toolbar offers the rewrites again
    try { out = await onRewrite(old, action, index); } catch { setJob(null); return; }
    setJob(j => j && j.index === index ? { ...j, text: out } : j);
  };
  const finish = (keep: boolean) => {
    if (!job?.text) return;
    if (keep) setText(text.map((s, i) => i === job.index ? job.text! : s));
    setJob(null); setSel(null); setStatus(keep ? 'Saved' : 'Click a sentence');
  };

  useImperativeHandle(ref, () => ({ rewrite, accept: () => finish(true), undo: () => finish(false) }));

  return (
    <div data-dm="" ref={root} className={cx('dm-rwx dm-panel', className)}>
      <div ref={head} className="dm-rwx-h"><span className="dm-ft">{kind}</span><span>{title}</span><Swap className="dm-muted dm-rwx-st">{status}</Swap></div>
      <div className="dm-rwx-doc">
        {text.map((s, i) => {
          const mine = job?.index === i;
          return (
            <span key={i}>
              {i > 0 && ' '}
              <span ref={el => { spans.current[i] = el; }} className={cx('dm-rwx-s', sel === i && 'dm-sel')} onClick={e => { e.stopPropagation(); if (!mine) pick(i); }}>
                {mine ? <><del>{job.old}</del> <ins>{job.text && words(job.text).map((w, k) => <span key={k} className={cx('dm-w', k < job.shown && 'dm-on')}>{w} </span>)}</ins></> : s}
              </span>
            </span>
          );
        })}
      </div>
      <div ref={bar} className={cx('dm-rwx-tb', sel !== null && 'dm-show', view !== 'menu' && 'dm-act')} role="toolbar" aria-label="Rewrite" inert={sel === null} style={at}>
        {view === 'menu' ? (
          <>
            {actions.map(a => <button type="button" key={a.key} className="dm-rwx-b" onClick={() => rewrite(a.key)}>{a.icon && <Icon name={a.icon} size="xs" />}{a.label}</button>)}
            <span className="dm-rwx-sep" />
            <Tip label={askLabel} kbd={askShortcut}>
              <button type="button" className="dm-rwx-b dm-ic" aria-label={askLabel} onClick={() => (onAsk && sel !== null ? onAsk(text[sel], sel) : rewrite(actions[0].key))}><Icon name="wand" size="xs" /></button>
            </Tip>
          </>
        ) : view === 'working' ? (
          <span className="dm-lbl"><Think />Rewriting</span>
        ) : (
          <>
            <span className="dm-lbl"><Icon name="check" size="xs" />Rewritten</span>
            <button type="button" className="dm-rwx-b dm-rwx-un" onClick={() => finish(false)}>Undo</button>
            <button type="button" className="dm-pill dm-accent dm-sm dm-rwx-ok" onClick={() => finish(true)}>Accept</button>
          </>
        )}
      </div>
    </div>
  );
}

const words = (s: string) => s.split(' ');
```

## More in Review and approve

- [Change review](https://designme.dev/components/change-review.md): Accept or reject each change the agent made, file by file.
- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Permission gate](https://designme.dev/components/permission-gate.md): The agent asks before it touches something new.
- [Hand-off to a person](https://designme.dev/components/human-handoff.md): The agent hands a conversation to a person, with what they need to pick it up.
- [Decision prompt](https://designme.dev/components/decision-prompt.md): The agent asks a few quick questions before it starts.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Design tuner](https://designme.dev/components/design-tuner.md): Tweak a component by hand or let the agent tune it.
- [Launch checklist](https://designme.dev/components/launch-checklist.md): The agent checks a design before it ships, and fixes what fails.
- [Inline text diff](https://designme.dev/components/inline-text-diff.md): The agent's edits to a piece of copy, accepted or rejected one by one.
- [Draft review](https://designme.dev/components/draft-review.md): An email the agent drafted, to check and edit before it sends.
- [Steering](https://designme.dev/components/steering.md): Change the agent's course while it works, without starting over.
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.
- [Design review](https://designme.dev/components/design-review.md): Checks run, a teammate asks for a change, the agent makes it, and you ship.

All components: https://designme.dev/llms.txt
