# Artifact card

> A file the agent made, with its versions, Open, Copy and Download.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/artifact-card

## Install

```sh
npx designme add artifact-card          # HTML, CSS and JS, with the shared core
npx designme add artifact-card --react  # React 19 component and its CSS
npx designme add artifact-card --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/artifact-card.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/artifact-card.json  # Astro
```

## About

Artifact card shows a file the agent made, like a report or a table, in one of four variants: a compact row, a card with its first page showing, a chip inside the message, or a stack of its versions. It shows the agent writing the file, then lets people open it in a reader, pick a version, copy it or download it.

### When to use it

- When your agent writes a report, a table or a draft and you want to show it in the chat instead of a bare file link.
- When the agent revises its work and people need to see which version they're looking at, and go back to an earlier one.
- When people should be able to read the file, copy it or save it without leaving the conversation.

### What it does

- `variant` picks the look. `compact` is a row with an icon, the name, one line of meta, Copy, Download and Open. `preview` adds the file's first page above the name: its kind and version, its title, a few lines of its summary and faint drawn lines for the rest. `inline` is a chip that sits in a message, with Versions, Copy and Download folding out on hover or focus (always shown on touch screens). `stack` draws a sheet for each version, with Versions, Copy, Download and Open under it.
- While `state` is `writing`, the icon turns into a spinner, the meta line shows `status`, and the actions wait. The compact card draws `progress` along its bottom edge, the preview shows Writing… and a caret after its summary, and the stack drops a blank sheet on top, types the title and draws its lines with a pen. When `state` turns `ready`, the meta line and the actions come in.
- With more than one version, the version on the meta line opens a menu of every version, newest first, with when it was made and what changed. Picking one updates the meta line and the preview. It shows the latest version by default and can be controlled with `version` and `onVersionChange`.
- In the stack, the shown version stands on top and the older sheets sit just behind it. Pointing at the stack or focusing it with the keyboard, they peek out a few pixels up and to the left. Versions lays the sheets out side by side to pick one, and the caption reads out the one under the pointer or the focus.
- Copy puts the version's `content` on the clipboard and Download saves it as `fileName-v3.ext`. Each button shows a check and says Copied or Downloaded for a moment, then calls `onCopy` or `onDownload`.
- Open shows a reader over the card's nearest positioned ancestor: the version's content with its headings, lists and paragraphs (or a table, when `ext` is `csv`), and Copy and Download at the foot. From the preview and the stack, the reader grows out of the page it came from. Pass `onOpen` to open the file somewhere else instead, like a panel beside the chat, and `openLabel` to say so in the button's tip.

### Accessibility

- The version button has `aria-haspopup="menu"` and `aria-expanded`, and its menu is a `role="menu"` of `menuitemradio` items with `aria-checked` on the version shown. Arrow keys, Home and End move through it, Enter picks, and Esc closes it and gives the button its focus back.
- In the stack, Versions has `aria-haspopup="menu"` and `aria-expanded`, and the laid-out sheets are `menuitemradio` items that the arrow keys move between. Esc puts them back.
- The reader is a `role="dialog"` with `aria-modal`. Focus moves to Close when it opens and stays inside it, Esc or a click on the stage behind closes it, and focus goes back to what opened it.
- A polite status line announces when the file is ready, which version is shown, and when it was copied, downloaded or opened. The icon buttons have `aria-label`s, and the drawn first page and the drawings on the sheets are `aria-hidden`.
- With `prefers-reduced-motion: reduce`, the reader opens without growing or sliding, the stack skips the drop, the typing and the pen, and the peek moves without a transition.

## Usage in React

```tsx
import { ArtifactCard } from '@/components/designme/artifact-card/ArtifactCard';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ArtifactCard, type ArtifactCardProps, type ArtifactVersion } from './ArtifactCard';
import { Seg } from '../lib/motion';
import { Demo } from '../lib/Demo';
import { useScript, useStory } from '../lib/useScript';

/* ---------- Artifact card: a pricing page review in three versions, written while you watch, shown four ways ---------- */
const F = {
  look: 'The three plans look alike at a glance.',
  year: 'The yearly switch hides what a month costs.',
  cancel: 'Nothing near the buttons says you can cancel any time.',
  faq: 'The FAQ repeats the plan table instead of answering doubts.',
  price: 'Team costs 16% more than similar plans elsewhere, and the page never says why.'
};
const DRAFTS = [
  { meta: 'edited 2 hours ago', note: 'First pass, four findings', findings: [F.look, F.year, F.cancel, F.faq], fixes: [] as string[],
    summary: 'People reach the plan table and stall. Most of what slows them down is clarity, not price.',
    changes: ['Read the page from top to bottom', 'Listed four findings in page order'] },
  { meta: 'edited 40 min ago', note: 'Added a competitor price check', findings: [F.look, F.year, F.cancel, F.price], fixes: [],
    summary: 'People reach the plan table and stall. Team also costs more than similar plans elsewhere, and the page never says why.',
    changes: ['Compared Team with three competitors', 'Dropped the FAQ finding, which overlapped another'] },
  { meta: 'edited just now', note: 'Fixes, ordered by impact', findings: [F.look, F.year, F.cancel, F.price],
    fixes: ['Show the monthly price beside the yearly one.', 'Mark Team as the plan most people choose.', 'Put “Cancel any time” under each button.'],
    summary: 'People reach the plan table and stall. Three changes should move most of them on, and none of them touch the price.',
    changes: ['Turned each finding into a fix', 'Ordered the fixes by how many people they reach'] }
];
// each version as the Markdown that Copy copies, Download saves and the reader shows
const VERSIONS: ArtifactVersion[] = DRAFTS.map((d, i) => ({
  title: 'Pricing page review', meta: d.meta, note: d.note, summary: d.summary,
  content: `# Pricing page review\n\n## Summary\n\n${d.summary}\n\n## Findings\n\n${d.findings.map(f => '- ' + f).join('\n')}\n`
    + (d.fixes.length ? `\n## What to fix first\n\n${d.fixes.map((f, k) => `${k + 1}. ${f}`).join('\n')}\n` : '')
    + `\n## Changes in v${i + 1}\n\n${d.changes.map(f => '- ' + f).join('\n')}\n`
}));
const TABLE: ArtifactVersion[] = [{ title: 'Competitor prices', meta: 'edited 1 hour ago', note: 'Team and Business at three competitors',
  content: 'Plan,Ours,Northwind,Halcyon,Fernway\nTeam,$29,$22,$25,$28\nBusiness,$79,$69,$75,$89\n' }];
const STEPS = ['Reading the page…', 'Writing the findings…', 'Ordering the fixes…'];
type Variant = NonNullable<ArtifactCardProps['variant']>;
const ASK = 'Review our pricing page and tell me what to fix first.';

export default function ArtifactCardDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [variant, setVariant] = useState<Variant>('compact');
  const [version, setVersion] = useState(2);
  // where the writing is: a step while it runs, then done; the summary is written out a few letters at a time
  const [step, setStep] = useState(0);
  const [chars, setChars] = useState<number | null>(null);
  const writing = step < STEPS.length;
  // each variant plays the writing state again when it comes in
  useScript(async ({ wait }) => {
    setStep(0); setChars(0); await wait(1400);
    setStep(1);
    for (let n = 0; n < DRAFTS[2].summary.length; n += 3) { setChars(n); await wait(22); }
    setChars(null); await wait(300);
    setStep(2); await wait(1100);
    setStep(STEPS.length);
  }, [variant]);
  // the preview's story: once the report is written, someone opens its versions, reads v2 and goes back to v3
  useStory(ref, async ({ wait, press }) => {
    await wait(5600); press('.dm-afx-vb');
    await wait(1000); press('.dm-afx-menu .dm-mi[data-i="1"]');
    await wait(2000); press('.dm-afx-vb');
    await wait(1000); press('.dm-afx-menu .dm-mi[data-i="2"]');
  });

  const versions = writing && chars != null ? VERSIONS.map((x, i) => i === 2 ? { ...x, summary: DRAFTS[2].summary.slice(0, chars) } : x) : VERSIONS;
  const report = (
    <ArtifactCard variant={variant} versions={versions} version={writing ? 2 : version} onVersionChange={setVersion} kind="Report" fileName="pricing-page-review"
      state={writing ? 'writing' : 'ready'} status={STEPS[Math.min(step, STEPS.length - 1)]} progress={(step + 1) / STEPS.length} />
  );
  const body = variant === 'compact' ? (
    <div className="dm-afx-cp" data-dm="">
      <div className="dm-bub">{ASK}</div>
      <p className="dm-afx-cp-a">I went through the page from top to bottom and checked our prices against three competitors. Both are below.</p>
      <div className="dm-afx-cp-list"><ArtifactCard versions={TABLE} kind="Table" icon="table" ext="csv" fileName="competitor-prices" />{report}</div>
    </div>
  ) : variant === 'inline' ? (
    <div className="dm-afx-in" data-dm="">
      <div className="dm-bub">{ASK}</div>
      <div className="dm-afx-in-msg">
        <p>I went through the pricing page from top to bottom and wrote up what to fix first.</p>
        {report}
        <p>The short version: the plan table is where people stall, and three small changes should move most of them on.</p>
      </div>
    </div>
  ) : report;

  return (
    <div ref={ref} style={{ width: '100%', position: 'relative' }}>
      <Demo switcher={<Seg label="Variant" value={variant} onChange={setVariant} options={[{ value: 'compact', label: 'Compact' }, { value: 'preview', label: 'Preview' }, { value: 'inline', label: 'Inline' }, { value: 'stack', label: 'Stack' }]} />}>
        {body}
      </Demo>
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `variant` (optional) | `'compact' \| 'preview' \| 'inline' \| 'stack'` | How the card shows the file: a compact row, a card with its first page, a chip inside a message, or a stack of its versions |
| `versions` | `ArtifactVersion[]` | Oldest first |
| `version` (optional) | `number` | Index of the version shown. Leave it out to let the versions menu change it |
| `defaultVersion` (optional) | `number` | Defaults to the latest version |
| `onVersionChange` (optional) | `(version: number) => void` |  |
| `state` (optional) | `'writing' \| 'ready'` | 'writing' while the agent is still making the file: the card shows `status` with a spinner and holds its actions back. When it turns 'ready' the meta line and the actions come in |
| `status` (optional) | `string` | The line shown while writing, like "Reading the page…" |
| `progress` (optional) | `number` | How far the writing has got, from 0 to 1. The compact card draws it as a line along its bottom edge |
| `kind` (optional) | `string` | The kind of file on the meta line, like "Report" or "Table" |
| `icon` (optional) | `IconName` | The file's icon |
| `fileName` (optional) | `string` | The name Download saves under, before "-v3.md". Defaults to the title in lowercase, with dashes |
| `ext` (optional) | `string` | The extension Download saves with. "csv" also shows the content as a table in the reader |
| `onOpen` (optional) | `(version: number) => void` | Called when the file is opened, with the version shown. Without it, Open shows the card's own reader, which covers the card's nearest positioned ancestor (your chat column, say) |
| `openLabel` (optional) | `string` | The Open button's tip, like "Open beside the chat". Its label stays "Open" |
| `onCopy` (optional) | `(version: number) => void` | Called after Copy has put the version's content on the clipboard |
| `onDownload` (optional) | `(version: number) => void` | Called after Download has saved the version's content as a file |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import ArtifactCard from '../components/designme/artifact-card/ArtifactCard.astro';
---
<ArtifactCard />
<ArtifactCard data-style="soft" class="my-class" />
```
It plays its demo; change `artifact-card.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Which variant should I use?**

Compact where several files can land in one thread. Preview when people need to tell drafts apart at a glance. Inline when the file belongs in the sentence, like an attachment. Stack when the versions are the point, like a document the agent keeps revising.

**How do I show the agent writing the file?**

Render the card with `state="writing"` as soon as the agent starts, and update `status` (and `progress` for the compact card) as it works. Pass the content you have so far, then set `state` to `ready` when the file is done.

**Can Open show the file in my own panel?**

Yes. Pass `onOpen` and the card calls it with the version shown instead of opening its reader; the Agent harness opens the report beside the chat this way. Without `onOpen`, the reader covers the card's nearest positioned ancestor, so give your chat column `position: relative`.

## Source

`ArtifactCard.tsx`, as `npx designme add artifact-card --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Spin, Swap, Tip } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './artifact-card.css';

export interface ArtifactVersion {
  /** The file's name in this version, like "Pricing page review" */
  title: string;
  /** When this version was made, like "edited 2 hours ago". The meta line and the versions menu show it */
  meta: string;
  /** What changed in this version, like "Added a competitor price check". The versions menu and the stack show it */
  note?: string;
  /** The file itself, as Markdown (or CSV when `ext` is "csv"): the reader shows it, Copy copies it and Download saves it */
  content: string;
  /** The text on the preview's first page. Defaults to the first paragraph of `content` */
  summary?: string;
}

export interface ArtifactCardProps {
  /** How the card shows the file: a compact row, a card with its first page, a chip inside a message, or a stack of its versions */
  variant?: 'compact' | 'preview' | 'inline' | 'stack';
  /** Oldest first */
  versions: ArtifactVersion[];
  /** Index of the version shown. Leave it out to let the versions menu change it */
  version?: number;
  /** Defaults to the latest version */
  defaultVersion?: number;
  onVersionChange?: (version: number) => void;
  /** 'writing' while the agent is still making the file: the card shows `status` with a spinner and holds its actions back.
      When it turns 'ready' the meta line and the actions come in */
  state?: 'writing' | 'ready';
  /** The line shown while writing, like "Reading the page…" */
  status?: string;
  /** How far the writing has got, from 0 to 1. The compact card draws it as a line along its bottom edge */
  progress?: number;
  /** The kind of file on the meta line, like "Report" or "Table" */
  kind?: string;
  /** The file's icon */
  icon?: IconName;
  /** The name Download saves under, before "-v3.md". Defaults to the title in lowercase, with dashes */
  fileName?: string;
  /** The extension Download saves with. "csv" also shows the content as a table in the reader */
  ext?: string;
  /** Called when the file is opened, with the version shown. Without it, Open shows the card's own reader, which covers
      the card's nearest positioned ancestor (your chat column, say) */
  onOpen?: (version: number) => void;
  /** The Open button's tip, like "Open beside the chat". Its label stays "Open" */
  openLabel?: string;
  /** Called after Copy has put the version's content on the clipboard */
  onCopy?: (version: number) => void;
  /** Called after Download has saved the version's content as a file */
  onDownload?: (version: number) => void;
  className?: string;
}

const slug = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const MIME: Record<string, string> = { md: 'text/markdown', csv: 'text/csv', json: 'application/json', html: 'text/html' };
/** "edited 2 hours ago" reads "2 hours ago" in the menu, and drops "edited" in a narrow card */
const ago = (meta: string) => meta.replace(/^edited\s+/i, '');
function When({ meta }: { meta: string }) {
  const short = ago(meta);
  return short === meta ? <>{meta}</> : <><span className="dm-afx-ed">edited </span>{short}</>;
}
/** The first paragraph of the content, for the preview's first page */
const firstPara = (content: string) => content.split(/\n\s*\n/).map(b => b.trim()).find(b => b && !/^(#|[-*] |\d+\. |v\d+,)/.test(b)) ?? '';

/** The content as the reader shows it: ## headings, - and 1. lists and paragraphs; CSV becomes a table. The # title is
    left out, since the reader's header shows it */
function Body({ content, csv }: { content: string; csv: boolean }) {
  if (csv) {
    const rows = content.trim().split('\n').map(r => r.split(','));
    return (
      <table className="dm-afx-tb">
        <thead><tr>{rows[0].map((h, k) => <th key={k} scope="col" className={k ? 'dm-num' : undefined}>{h}</th>)}</tr></thead>
        <tbody>{rows.slice(1).map((r, i) => <tr key={i}>{r.map((x, k) => k ? <td key={k} className="dm-num">{x}</td> : <th key={k} scope="row">{x}</th>)}</tr>)}</tbody>
      </table>
    );
  }
  const out: ReactNode[] = [];
  content.split(/\n\s*\n/).map(b => b.trim()).filter(Boolean).forEach((b, i) => {
    const lines = b.split('\n');
    if (/^# /.test(b)) return;
    if (/^#{2,} /.test(b)) out.push(<h3 key={i}>{b.replace(/^#+ /, '')}</h3>);
    else if (lines.every(l => /^[-*] /.test(l))) out.push(<ul key={i}>{lines.map((l, k) => <li key={k}>{l.slice(2)}</li>)}</ul>);
    else if (lines.every(l => /^\d+\. /.test(l))) out.push(<ol key={i}>{lines.map((l, k) => <li key={k}>{l.replace(/^\d+\. /, '')}</li>)}</ol>);
    else out.push(<p key={i}>{b}</p>);
  });
  return <>{out}</>;
}

/** Feedback on a button that did something: a check and a word for a moment, then back */
function useFlash(ms = 1600) {
  const [on, setOn] = useState<string | null>(null);
  const t = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(t.current), []);
  return [on, (key: string) => { setOn(key); clearTimeout(t.current); t.current = setTimeout(() => setOn(null), ms); }] as const;
}

const cssMs = (el: Element, v: string, f = 1) => { const s = getComputedStyle(el).getPropertyValue(v).trim(); return (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000) * f || 300; };
const cssEase = (el: Element) => getComputedStyle(el).getPropertyValue('--dm-ease').trim() || 'ease';

/** The opened file: a view, or a page that grows out of the preview or sheet it came from. A modal dialog: focus moves in
    and stays in, Esc or the scrim closes it, and focus goes back to what opened it */
function Reader({ title, icon, meta, label, children, kind, src, opener, onCopy, onDownload, flashed, onClosed }: {
  title: string; icon: IconName; meta: string; label: string; children: ReactNode; kind: 'view' | 'page'; src: HTMLElement | null; opener: HTMLElement | null;
  onCopy: () => void; onDownload: () => void; flashed: string | null; onClosed: () => void;
}) {
  const pan = useRef<HTMLDivElement>(null), scrim = useRef<HTMLDivElement>(null), x = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion(), closing = useRef(false);
  const morph = (back: boolean) => {
    const p = pan.current!, a = src!.getBoundingClientRect(), b = p.getBoundingClientRect(), D = cssMs(p, '--dm-t', kind === 'page' ? 1.3 : 1.1);
    const f = { transform: `translate(${a.left - b.left}px,${a.top - b.top}px) scale(${a.width / b.width},${a.height / b.height})` };
    [...p.children].forEach(k => k.animate(back ? [{ opacity: 1 }, { opacity: 0, offset: .4 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 0, offset: .45 }, { opacity: 1 }], { duration: D, fill: back ? 'forwards' : 'none' }));
    return p.animate(back ? [{ transform: 'none' }, f] : [f, { transform: 'none' }], { duration: D, easing: cssEase(p), fill: back ? 'forwards' : 'none' }).finished;
  };
  useIsoLayoutEffect(() => {
    const p = pan.current; if (!p) return;
    x.current?.focus({ preventScroll: true });
    if (src) src.style.visibility = 'hidden';
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) {
      const D = cssMs(p, '--dm-t', kind === 'page' ? 1.3 : 1.1);
      scrim.current?.animate([{ opacity: 0 }, { opacity: 1 }], { duration: D, easing: 'ease-out' });
      if (src) morph(false).catch(() => {});
      else p.animate([{ transform: 'translateY(16px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: D, easing: cssEase(p) });
    }
    return () => { if (src) src.style.visibility = ''; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  const close = async () => {
    if (closing.current) return; closing.current = true;
    const p = pan.current;
    if (p && !reduce) {
      const out = cssMs(p, '--dm-t', kind === 'page' ? 1.3 : 1.1) * .8;
      scrim.current?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: out, fill: 'forwards' });
      try { await (src ? morph(true) : p.animate([{ transform: 'none', opacity: 1 }, { transform: 'translateY(16px)', opacity: 0 }], { duration: out, easing: cssEase(p), fill: 'forwards' }).finished); } catch { /* unmounted */ }
    }
    onClosed(); opener?.focus({ preventScroll: true });
  };
  const keys = (e: KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); void close(); return; }
    if (e.key !== 'Tab' || !pan.current) return;
    const f = [...pan.current.querySelectorAll<HTMLElement>('button,[tabindex="0"]')], first = f[0], last = f[f.length - 1];
    if (e.shiftKey && (document.activeElement === first || document.activeElement === pan.current)) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  };
  return (
    <div className="dm-afx-sheet" onKeyDown={keys}>
      <div className="dm-afx-scrim" ref={scrim} onClick={() => void close()} />
      <div className={cx('dm-afx-pan', kind === 'page' ? 'dm-afx-page' : 'dm-afx-view')} role="dialog" aria-modal="true" aria-label={title} tabIndex={-1} ref={pan}>
        <div className="dm-afx-ph">
          <span className="dm-afx-ic" aria-hidden="true"><Icon name={icon} /></span>
          <div className="dm-afx-ptx"><div className="dm-afx-pt">{title}</div><div className="dm-afx-pm">{meta}</div></div>
          <Tip label="Close" kbd="Esc"><button type="button" className="dm-ib dm-afx-x" aria-label="Close" ref={x} onClick={() => void close()}><Icon name="x" /></button></Tip>
        </div>
        <div className="dm-afx-pb" tabIndex={0} role="region" aria-label={label}>{children}</div>
        <div className="dm-afx-pf">
          <button type="button" className={cx('dm-pill dm-sm dm-line dm-afx-copy', flashed === 'rcopy' && 'dm-copied')} onClick={onCopy}><Icon name={flashed === 'rcopy' ? 'check' : 'copy'} /><span className="dm-afx-lbl">{flashed === 'rcopy' ? 'Copied' : 'Copy'}</span></button>
          <button type="button" className={cx('dm-pill dm-sm dm-line dm-afx-dl', flashed === 'rdl' && 'dm-copied')} onClick={onDownload}><Icon name={flashed === 'rdl' ? 'check' : 'down'} /><span className="dm-afx-lbl">{flashed === 'rdl' ? 'Downloaded' : 'Download'}</span></button>
        </div>
      </div>
    </div>
  );
}

// the stack's drawn lines stand for each page's text: p a paragraph line, b a bullet, n a numbered fix, s a gap
const LINES: [string, number?][][] = [
  [['p', 94], ['p', 72], ['s'], ['b', 82], ['b', 74], ['b', 66], ['b', 78], ['s'], ['p', 88], ['p', 52]],
  [['p', 92], ['p', 86], ['p', 56], ['s'], ['b', 80], ['b', 72], ['b', 86], ['b', 64], ['s'], ['p', 70]],
  [['p', 90], ['p', 78], ['s'], ['n', 84], ['n', 70], ['n', 78], ['s'], ['b', 76], ['b', 68], ['b', 82]]
];
// the preview's lines, a little different for each version so drafts are easy to tell apart
const WIDTHS = [[96, 88, 70, 82], [92, 84, 90, 64], [90, 78, 86, 72]];

/** A file the agent made, in four variants: a compact row, a card with its first page, a chip inside a message, or a stack
    of its versions. It plays a writing state, then opens in a reader, switches versions, copies and downloads. */
export function ArtifactCard({
  variant = 'compact', versions, version, defaultVersion, onVersionChange, state = 'ready', status = 'Writing…', progress, kind = 'Report', icon = 'file-text',
  fileName, ext = 'md', onOpen, openLabel, onCopy, onDownload, className
}: ArtifactCardProps) {
  const N = versions.length, last = N - 1;
  const [cur, setCur] = useControllable(version, defaultVersion ?? last, onVersionChange);
  const i = Math.max(0, Math.min(last, cur)), v = versions[i];
  const writing = state === 'writing';
  const reduce = useReducedMotion();
  const [said, setSaid] = useState('');
  const say = (msg: string) => { setSaid(''); setTimeout(() => setSaid(msg), 60); };
  const [flashed, flash] = useFlash();
  const [reading, setReading] = useState<null | { kind: 'view' | 'page'; src: HTMLElement | null; opener: HTMLElement | null }>(null);
  // the meta and the actions come in when the writing settles
  const [settled, setSettled] = useState(false);
  const was = useRef(writing);
  useEffect(() => { if (was.current && !writing) { setSettled(true); say(`${v.title} is ready, v${i + 1}`); } was.current = writing; }, [writing]); // eslint-disable-line react-hooks/exhaustive-deps

  const pick = (n: number) => { if (n === i) return; setCur(n); say(`Showing v${n + 1}, ${versions[n].meta}`); };
  const copy = (key: string) => {
    try { navigator.clipboard?.writeText(v.content).catch(() => {}); } catch { /* the page may not write to the clipboard */ }
    flash(key); say(`Copied ${v.title}, v${i + 1}, to the clipboard`); onCopy?.(i);
  };
  const download = (key: string) => {
    const name = `${fileName ?? slug(v.title)}-v${i + 1}.${ext}`, url = URL.createObjectURL(new Blob([v.content], { type: MIME[ext] ?? 'text/plain' }));
    const a = document.createElement('a'); a.href = url; a.download = name; a.hidden = true; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    flash(key); say(`Downloaded ${name}`); onDownload?.(i);
  };
  const open = (kindOf: 'view' | 'page', opener: HTMLElement | null, src: HTMLElement | null = null) => {
    if (writing) return;
    if (onOpen) { onOpen(i); return; }
    setReading({ kind: kindOf, src, opener }); say(`Opened ${v.title}, v${i + 1}`);
  };

  /* versions: a menu button with one radio item per version, newest first. Arrow keys move, Enter picks, Esc closes */
  const menu = usePopover({ side: 'down' });
  const items = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!menu.open) return;
    const b = items.current?.querySelector<HTMLElement>('[aria-checked="true"]') ?? items.current?.querySelector<HTMLElement>('.dm-mi');
    b?.focus({ preventScroll: true });
  }, [menu.open]);
  const menuKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    const it = [...(items.current?.querySelectorAll<HTMLElement>('.dm-mi') ?? [])], k = it.indexOf(document.activeElement as HTMLElement);
    if (e.key === 'ArrowDown') { e.preventDefault(); it[(k + 1) % it.length]?.focus(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); it[(k - 1 + it.length) % it.length]?.focus(); }
    else if (e.key === 'Home') { e.preventDefault(); it[0]?.focus(); }
    else if (e.key === 'End') { e.preventDefault(); it[it.length - 1]?.focus(); }
    else if (e.key === 'Tab') menu.close();
  };
  const trigger = {
    ...menu.trigger, 'aria-label': `v${i + 1} of ${N} versions`,
    onKeyDown: (e: KeyboardEvent) => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); menu.setOpen(true); } }
  };
  const versionsMenu = N > 1 && (
    <div {...menu.pop} className={cx(menu.pop.className, 'dm-afx-menu')} role="menu" aria-label={`Versions of ${v.title}`} ref={el => { menu.pop.ref.current = el; items.current = el; }} onKeyDown={menuKeys}>
      <div className="dm-ph" aria-hidden="true">Versions</div>
      {versions.map((_, n) => n).reverse().map(n => (
        <button key={n} type="button" className="dm-mi" role="menuitemradio" tabIndex={-1} aria-checked={n === i} data-i={n}
          onClick={() => { pick(n); menu.close(); menu.trigger.ref.current?.focus({ preventScroll: true }); }}>
          <span className="dm-afx-mb"><span>v{n + 1}<span className="dm-afx-mw"> · {ago(versions[n].meta)}</span></span>{versions[n].note && <span className="dm-d">{versions[n].note}</span>}</span>
          <Icon name="check" className="dm-ck" />
        </button>
      ))}
    </div>
  );

  // the meta line: the kind, the version (a menu when there are several) and when it was edited; the writing line stands in for it
  const metaLine = (extra?: string) => (
    <div className={cx('dm-afx-meta', extra)}>
      <span className="dm-afx-wr dm-shim">{status}</span>
      <span className={cx('dm-afx-fin', settled && 'dm-enter')}>
        <span>{kind}</span><span aria-hidden="true">·</span>
        {N > 1 ? <button type="button" className="dm-afx-vb" {...trigger}><span className="dm-afx-vt">v{i + 1}</span><Icon name="chev-d" size="xs" /></button> : <span className="dm-afx-v">v1</span>}
        <span aria-hidden="true">·</span><span className="dm-afx-when"><When meta={v.meta} /></span>
      </span>
    </div>
  );
  const iconTile = <span className="dm-afx-ic"><Spin /><Icon name={icon} /></span>;
  const actions = (size?: 's') => (
    <>
      <Tip label={flashed === 'copy' ? 'Copied' : 'Copy'} open={flashed === 'copy' || undefined}>
        <button type="button" className={cx('dm-ib dm-afx-copy', flashed === 'copy' && 'dm-copied')} aria-label={`Copy ${v.title}`} onClick={() => copy('copy')}><Icon name={flashed === 'copy' ? 'check' : 'copy'} size={size} /></button>
      </Tip>
      <Tip label={flashed === 'dl' ? 'Downloaded' : 'Download'} open={flashed === 'dl' || undefined}>
        <button type="button" className={cx('dm-ib dm-afx-dl', flashed === 'dl' && 'dm-copied')} aria-label={`Download ${v.title}`} onClick={() => download('dl')}><Icon name={flashed === 'dl' ? 'check' : 'down'} size={size} /></button>
      </Tip>
    </>
  );
  const openPill = (ic: IconName) => {
    const b = <button type="button" className="dm-pill dm-sm dm-accent dm-afx-open" aria-label={openLabel ?? `Open ${v.title}`} onClick={e => open(variant === 'stack' ? 'page' : 'view', e.currentTarget, variant === 'stack' ? topSheet() : null)}><Icon name={ic} /><span className="dm-afx-lbl">Open</span></button>;
    return openLabel ? <Tip label={openLabel}>{b}</Tip> : b;
  };

  /* ---- stack: the sheets, laid out by Versions, and the new page written onto the top one ---- */
  const desk = useRef<HTMLDivElement>(null);
  const [fanned, setFanned] = useState(false);
  const [peek, setPeek] = useState<number | null>(null);
  const [typed, setTyped] = useState<number | null>(null);
  const topSheet = () => desk.current?.querySelector<HTMLElement>(`[data-i="${i}"]`) ?? null;
  const fanBtn = useRef<HTMLButtonElement>(null);
  const fan = (on: boolean, focus = false) => {
    if (writing) return; setFanned(on); setPeek(null);
    if (on && focus) requestAnimationFrame(() => topSheet()?.focus({ preventScroll: true }));
  };
  useEffect(() => {
    if (!fanned) return;
    const down = (e: PointerEvent) => { const t = e.target as Node; if (!desk.current?.contains(t) && !fanBtn.current?.contains(t)) fan(false); };
    document.addEventListener('pointerdown', down); return () => document.removeEventListener('pointerdown', down);
  }, [fanned]); // eslint-disable-line react-hooks/exhaustive-deps
  // writing: a blank sheet drops onto the stack, the title is typed, and a pen draws each line of the new page
  useEffect(() => {
    if (variant !== 'stack' || !writing) return;
    const sh = desk.current?.querySelector<HTMLElement>(`[data-i="${last}"]`); if (!sh) return;
    let alive = true; const timers: ReturnType<typeof setTimeout>[] = [], anims: Animation[] = [];
    const sleep = (ms: number) => new Promise<void>((res, rej) => timers.push(setTimeout(() => alive ? res() : rej(new Error('stop')), ms)));
    const motion = !matchMedia('(prefers-reduced-motion: reduce)').matches, E = cssEase(sh);
    (async () => {
      if (motion) anims.push(sh.animate([{ transform: 'translateY(-36px)', opacity: 0 }, { transform: 'none', opacity: 1 }], { duration: cssMs(sh, '--dm-t-slow'), easing: E, composite: 'add' }));
      setTyped(0); await sleep(300);
      const T = versions[last].title;
      if (!motion) setTyped(T.length);
      else for (let n = 1; n <= T.length; n++) { setTyped(n); await sleep(40); }
      await sleep(motion ? 250 : 0);
      const pen = sh.querySelector<HTMLElement>('.dm-afx-pen'), rows = [...sh.querySelectorAll<HTMLElement>('.dm-afx-r')].filter(x => x.offsetParent);
      for (const x of rows) {
        const line = x.querySelector('i')!, dot = x.querySelector('b');
        if (!motion) { anims.push(line.animate([{ transform: 'none' }], { fill: 'forwards' })); if (dot) anims.push(dot.animate([{ transform: 'none' }], { fill: 'forwards' })); await sleep(150); continue; }
        const x0 = x.offsetLeft + line.offsetLeft, x1 = x0 + line.offsetWidth, y = x.offsetTop + x.offsetHeight / 2 - 3.5, ms = 260 + line.offsetWidth * 1.4;
        if (dot) anims.push(dot.animate([{ transform: 'scaleX(0)' }, { transform: 'none' }], { duration: 120, fill: 'forwards' }));
        anims.push(line.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: ms, easing: 'cubic-bezier(.4,0,.3,1)', fill: 'forwards' }));
        if (pen) anims.push(pen.animate([{ transform: `translate(${x0 - 3}px,${y}px)`, opacity: 1 }, { transform: `translate(${x1 - 3}px,${y}px)`, opacity: 1 }], { duration: ms, easing: 'cubic-bezier(.4,0,.3,1)', fill: 'forwards' }));
        await sleep(ms + 70);
      }
      pen?.getAnimations().forEach(a => a.cancel());
    })().catch(() => {});
    return () => {
      alive = false; timers.forEach(clearTimeout); anims.forEach(a => a.cancel()); setTyped(null);
      if (motion && sh.isConnected) sh.animate([{ transform: 'translateY(-6px)' }, { transform: 'none' }], { duration: cssMs(sh, '--dm-t'), easing: E, composite: 'add' });
    };
  }, [variant, writing]); // eslint-disable-line react-hooks/exhaustive-deps
  const deskKeys = (e: KeyboardEvent<HTMLDivElement>) => {
    if (!fanned) return;
    const sheets = [...(desk.current?.querySelectorAll<HTMLElement>('.dm-afx-sh') ?? [])], k = sheets.indexOf(document.activeElement as HTMLElement);
    let n: number | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = Math.min(last, k + 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = Math.max(0, k - 1);
    else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = last;
    else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); fan(false); fanBtn.current?.focus({ preventScroll: true }); return; }
    else if (e.key === 'Tab') { fan(false); return; }
    if (n != null) { e.preventDefault(); sheets[n]?.focus(); }
  };
  // laid out, the sheets fan from left to right, oldest first; stacked, the shown version is on top and the others sit
  // behind it, straight, a little further back each (the CSS peeks them out on hover and focus)
  const behind = versions.map((_, n) => n).reverse().filter(n => n !== i);
  const sheetStyle = (n: number): CSSProperties => {
    if (fanned) { const o = n - last / 2; return { transform: `translate(calc(${o} * var(--dm-fx)),${Math.abs(o) * 6 + (peek === n ? -8 : 0)}px) rotate(${o * 6}deg)`, zIndex: peek === n ? 9 : n + 1 }; }
    const d = n === i ? 0 : behind.indexOf(n) + 1;
    return { ['--dm-d' as string]: d, zIndex: N - d };
  };
  const shown = fanned && peek != null ? peek : i;

  let body: ReactNode;
  if (variant === 'preview') {
    const sum = v.summary ?? firstPara(v.content), w = WIDTHS[i % 3];
    body = (
      <div className="dm-afx-w dm-afx-pv">
        <div className={cx('dm-afx-pv-card dm-afx-card', writing && 'dm-is-writing')}>
          <div className="dm-afx-pv-prev" aria-hidden="true">
            <div className="dm-afx-pv-page" data-src="">
              <div className="dm-afx-pv-k"><span className="dm-afx-wr">Writing…</span><span className="dm-afx-fin"><Swap>{`${kind} · v${i + 1}`}</Swap></span></div>
              <div className="dm-afx-pv-h">{v.title}</div>
              <p className="dm-afx-pv-p">{writing ? <>{sum}<span className="dm-afx-caret" /></> : <Swap>{sum}</Swap>}</p>
              <div className="dm-afx-pv-ls">{w.map((x, k) => <i key={k} style={{ ['--dm-w' as string]: x + '%', transition: reduce ? undefined : `width var(--dm-t) var(--dm-ease),transform .42s var(--dm-ease) ${k * 180}ms` }} />)}</div>
            </div>
          </div>
          <div className="dm-afx-pv-meta">
            {iconTile}
            <div className="dm-afx-pv-tx"><div className="dm-afx-pv-t">{v.title}</div>{metaLine()}</div>
            <div className="dm-afx-pv-act">
              {actions()}
              <Tip label={openLabel ?? 'Open'}><button type="button" className="dm-ib dm-afx-open" aria-label={openLabel ?? `Open ${v.title}`}
                onClick={e => open('page', e.currentTarget, e.currentTarget.closest('.dm-afx-pv-card')?.querySelector<HTMLElement>('.dm-afx-pv-page') ?? null)}><Icon name="max" /></button></Tip>
            </div>
          </div>
        </div>
        {versionsMenu}
      </div>
    );
  } else if (variant === 'inline') {
    body = (
      <div className="dm-afx-w">
        <span className={cx('dm-afx-chip', writing && 'dm-is-writing', menu.open && 'dm-pin')}>
          <Tip label={openLabel ?? ''} off={writing || !openLabel}>
            <button type="button" className="dm-afx-in-main" disabled={writing} onClick={e => open('view', e.currentTarget)}>
              <span className="dm-afx-in-ic"><Spin /><Icon name={icon} /></span>
              <span className="dm-afx-in-t"><span className="dm-afx-sr">Open </span>{v.title}</span>
              <span className="dm-afx-in-m"><span className="dm-afx-wr dm-shim">{status}</span>
                <span className={cx('dm-afx-fin', settled && 'dm-enter')}><span className="dm-afx-v">v{i + 1}</span><span className="dm-afx-msep" aria-hidden="true">·</span><span className="dm-afx-when"><When meta={v.meta} /></span></span></span>
            </button>
          </Tip>
          <span className="dm-afx-tray"><span>
            <span className="dm-afx-tsep" aria-hidden="true" />
            {N > 1 && <Tip label="Versions" off={menu.open}><button type="button" className="dm-ib dm-afx-vb3" {...trigger} aria-label="Versions"><Icon name="history" /></button></Tip>}
            {actions()}
          </span></span>
        </span>
        {versionsMenu}
      </div>
    );
  } else if (variant === 'stack') {
    const T = versions[last].title;
    body = (
      <div className={cx('dm-afx-w dm-afx-st', writing && 'dm-is-writing', fanned && 'dm-fan')}>
        <div className="dm-afx-desk">
          <div className="dm-afx-stack" role="menu" aria-label={`Versions of ${v.title}`} aria-hidden={!fanned} ref={desk} onKeyDown={deskKeys}>
            {versions.map((x, n) => {
              const blank = writing && n === last;
              return (
                <button key={n} type="button" className={cx('dm-afx-sh', blank && 'dm-blank')} role="menuitemradio" data-i={n} aria-checked={n === i} tabIndex={fanned && n === i ? 0 : -1}
                  aria-label={`v${n + 1}, ${x.meta}${x.note ? ': ' + x.note : ''}`} style={sheetStyle(n)}
                  onClick={e => { if (writing) return; if (fanned) { pick(n); fan(false); fanBtn.current?.focus({ preventScroll: true }); } else open('page', e.currentTarget.closest('.dm-afx-st')?.querySelector<HTMLElement>('.dm-afx-open') ?? null, e.currentTarget); }}
                  onPointerEnter={() => fanned && setPeek(n)} onPointerLeave={() => fanned && setPeek(null)} onFocus={() => fanned && setPeek(n)} onBlur={() => fanned && setPeek(null)}>
                  <span className="dm-afx-pg" aria-hidden="true">
                    <span className="dm-afx-st-k"><span>{blank ? 'Writing…' : 'v' + (n + 1)}</span></span>
                    <span className="dm-afx-st-h">{blank ? T.slice(0, typed ?? T.length) : x.title}</span>
                    <span className="dm-afx-st-ls">{LINES[n === last ? 2 : n % 2].map(([t, w], k) => t === 's' ? <span key={k} className="dm-afx-gap" /> : <span key={k} className={cx('dm-afx-r', 'dm-' + t)}>{t !== 'p' && <b />}<i style={{ ['--dm-w' as string]: w + '%' }} /></span>)}</span>
                    {n === last && <span className="dm-afx-pen" />}
                  </span>
                  <span className="dm-afx-tab" aria-hidden="true"><Icon name="check" size="xs" /><span>v{n + 1}</span><span className="dm-afx-ta"> · {ago(x.meta)}</span></span>
                </button>
              );
            })}
          </div>
        </div>
        <div className="dm-afx-cap">
          <div className="dm-afx-st-t">{v.title}</div>
          <div className="dm-afx-meta dm-afx-st-m"><span className="dm-afx-wr dm-shim">{status}</span>
            <span className={cx('dm-afx-fin', settled && 'dm-enter')}><span>{kind}</span><span aria-hidden="true">·</span><span className="dm-afx-v">v{shown + 1}</span><span aria-hidden="true">·</span><span className="dm-afx-when"><When meta={versions[shown].meta} /></span></span>
          </div>
          <div className={cx('dm-fold dm-afx-nw', !fanned && 'dm-shut')}><div><div className="dm-afx-note">{versions[shown].note}</div></div></div>
        </div>
        <div className="dm-afx-st-act">
          {N > 1 && <button type="button" className="dm-pill dm-sm dm-line dm-afx-fan" aria-haspopup="menu" aria-expanded={fanned} ref={fanBtn} onClick={() => fan(!fanned, true)}><Icon name="layers" /><span>Versions</span></button>}
          {actions()}
          {openPill('max')}
        </div>
      </div>
    );
  } else {
    body = (
      <div className="dm-afx-w">
        <div className={cx('dm-afx-cp-card dm-afx-card', writing && 'dm-is-writing')}>
          {iconTile}
          <div className="dm-afx-cp-tx"><div className="dm-afx-cp-t">{v.title}</div>{metaLine()}</div>
          <div className="dm-afx-cp-act">{actions()}{openPill('panel')}</div>
          {writing && <span className="dm-afx-cp-bar" aria-hidden="true" style={{ transform: `scaleX(${Math.max(0, Math.min(1, progress ?? 0))})` }} />}
        </div>
        {versionsMenu}
      </div>
    );
  }

  return (
    <div data-dm="" className={cx('dm-afx', className)} style={{ width: '100%', containerType: 'inline-size' }}>
      {body}
      {reading && (
        <Reader title={v.title} icon={icon} meta={`${kind} · v${i + 1} · ${v.meta}`} label={`${v.title}, v${i + 1}`} kind={reading.kind} src={reading.src} opener={reading.opener}
          onCopy={() => copy('rcopy')} onDownload={() => download('rdl')} flashed={flashed} onClosed={() => setReading(null)}>
          <Body content={v.content} csv={ext === 'csv'} />
        </Reader>
      )}
      <div className="dm-afx-sr" role="status" aria-live="polite">{said}</div>
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Image generation](https://designme.dev/components/image-generation.md): A prompt with styles, shape and count, pictures that resolve out of grain, and a gallery of earlier ones.
- [Rich text editor](https://designme.dev/components/rich-text-editor.md): A minimal editor with an inline AI menu that streams a suggestion to accept or discard.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Voice orb](https://designme.dev/components/voice-orb.md): A hands-free voice chat, with an orb that shows who is talking.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Prompt library](https://designme.dev/components/prompt-library.md): Saved prompts with blanks to fill in before they go to the agent.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
