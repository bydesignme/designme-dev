# Citation hover card

> Hover a citation to see the exact passage it came from.

Agent components / Sources and output. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/citation-hover-card

## Install

```sh
npx designme add citation-hover-card          # HTML, CSS and JS, with the shared core
npx designme add citation-hover-card --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Citation hover card renders an agent's answer with numbered citations in the text. Hover, focus or tap a number and a small card opens under it with the source's site, title and the exact passage the claim relies on, with the key words highlighted.

### When to use it

- When an agent answers from web pages or your own files and people should be able to check each claim.
- When you want the evidence one hover away instead of in a list at the bottom.
- When the important part of a long source is a single sentence you can highlight.
- When citations need to work with a mouse, a keyboard and a touch screen.

### What it does

- Write `text` with markers like `[1]`. Each marker becomes a numbered button, and a blank line starts a new paragraph.
- Each source has a coloured `mark`, a `site`, a `title`, a `quote` and an optional `meta` line. Wrap the key words of the quote in `<mark>` to highlight them.
- The card waits a moment on hover, stays open while the pointer moves into it, and closes shortly after the pointer leaves.
- On touch, a tap opens the card and a tap anywhere else closes it. Resizing the window also closes it.
- The card's link opens `href` in a new tab and calls `onOpenSource` with the source and its index. `openLabel` sets the link text.
- `open` and `onOpenChange` let you open a source's card from outside, for example from a source list elsewhere on the page.

### Accessibility

- Each citation is a button with an `aria-label` like "Source 2: Price anchoring in plan selection".
- Focusing a citation with the keyboard opens its card. Moving focus away or pressing Escape closes it, and Escape leaves the focus on the citation.
- Enter or Space on a citation puts the focus on its card's link, so it can be reached; Escape from the card puts the focus back on the citation.
- The card has `role="dialog"` and `aria-label="Source"`.

## Usage in React

```tsx
import { CitationHoverCard } from '@/components/designme/citation-hover-card/CitationHoverCard';
```

### Example

```tsx
'use client';
// The preview from designme.dev, rebuilt from the React component. Hover, focus or tap a citation to see its source.
import { useState } from 'react';
import { CitationHoverCard, type CitationHoverCardSource } from './CitationHoverCard';
import { useScript } from '../lib/useScript';

const SOURCES: CitationHoverCardSource[] = [
  { mark: 'B', color: '#4a5a8a', site: 'baymard.com', title: 'Pricing page UX benchmark', meta: 'Read 4 days ago',
    quote: <>Of 64 SaaS sites tested, those leading with the annual plan saw <mark>a 12 to 20% higher trial to paid rate</mark> than monthly first layouts.</> },
  { mark: 'C', color: '#d9480f', site: 'cxl.com', title: 'Price anchoring in plan selection', meta: 'Read 4 days ago',
    quote: <>When the monthly price stayed visible with a strike through, <mark>annual selection rose by a further 9 points</mark> in the anchored group.</> },
  { mark: 'C', color: 'var(--dm-pm)', site: 'Drive', title: 'Q3 conversion export.csv', meta: 'Your file',
    quote: <>Rows 412 to 480: <mark>trial to paid moves from 18.6% to 26.3%</mark> between Sep 18 and Oct 17.</> }
];

export default function CitationHoverCardDemo() {
  // shows the first card once on its own, then puts it away, unless you are already pointing at a citation
  const [open, setOpen] = useState<number | null>();
  useScript(async ({ wait }) => {
    await wait(1400); setOpen(o => o === undefined ? 0 : o);
    await wait(2800); setOpen(o => o === 0 ? null : o);
  });
  return (
    <div style={{ width: '100%' }}>
      <CitationHoverCard sources={SOURCES} open={open} onOpenChange={setOpen}
        text="Teams that show the annual price first see higher paid conversion[1], and the effect is stronger when the monthly price stays visible beside it[2]. Your own data shows the same pattern since the September update[3]." />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `text` | `string` | The answer. [n] cites source n; a blank line starts a new paragraph |
| `sources` | `CitationHoverCardSource[]` |  |
| `openLabel` (optional) | `string` | The link in the card's corner |
| `onOpenSource` (optional) | `(source: CitationHoverCardSource, index: number) => void` | Called when the card's link is clicked, with the source and its index |
| `open` (optional) | `number \| null` | Opens a source's card from outside (0 is the first source), or closes it with null. Hover, focus and taps still work |
| `onOpenChange` (optional) | `(index: number \| null) => void` | Called when a card opens or closes, with the source's index, or null |
| `className` (optional) | `string` |  |

## Questions

**How do I mark which part of the source backs up the claim?**

`quote` accepts React nodes, so wrap the passage that matters in a `<mark>` element. The card styles it as a highlight.

**What happens if the text cites a number with no source?**

A marker like `[4]` with no fourth source is left as plain text, so it never opens an empty card.

**What if a source has no URL, like a private file?**

Leave out `href`. The link then stays on the page and only calls `onOpenSource`, so you can open the file in your own viewer.

## Source

`CitationHoverCard.tsx`, as `npx designme add citation-hover-card --react` installs it:

```tsx
'use client';
import { Fragment, useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { cx } from '../lib/cx';
import { Icon } from '../lib/icons';
import '../designme.css';
import './citation-hover-card.css';

export interface CitationHoverCardSource {
  /** One or two letters on the source's coloured mark, like "B" */
  mark: string;
  /** The mark's colour, like '#4a5a8a' or 'var(--dm-pm)' */
  color: string;
  /** Where it comes from, like "baymard.com" or "Drive" */
  site: string;
  title: string;
  /** The passage the answer relies on. Wrap the part that matters in <mark> */
  quote: ReactNode;
  /** The quiet line in the corner, like "Read 4 days ago" */
  meta?: string;
  /** Opens in a new tab from the card's link */
  href?: string;
}

export interface CitationHoverCardProps {
  /** The answer. [n] cites source n; a blank line starts a new paragraph */
  text: string;
  sources: CitationHoverCardSource[];
  /** The link in the card's corner */
  openLabel?: string;
  /** Called when the card's link is clicked, with the source and its index */
  onOpenSource?: (source: CitationHoverCardSource, index: number) => void;
  /** Opens a source's card from outside (0 is the first source), or closes it with null. Hover, focus and taps still work */
  open?: number | null;
  /** Called when a card opens or closes, with the source's index, or null */
  onOpenChange?: (index: number | null) => void;
  className?: string;
}

interface Shown { i: number; x: number; y: number; n: number }

/** An answer with numbered citations. Hovering, focusing or tapping one shows its source in a small card underneath. */
export function CitationHoverCard({ text, sources, openLabel = 'Open source', onOpenSource, open: openAt, onOpenChange, className }: CitationHoverCardProps) {
  const box = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  // `at` is the open card; `last` keeps its content while it fades out
  const [at, setAt] = useState<Shown | null>(null);
  const [last, setLast] = useState(0);
  const cur = useRef<number | null>(null);
  const showT = useRef<ReturnType<typeof setTimeout>>(undefined), hideT = useRef<ReturnType<typeof setTimeout>>(undefined);
  // the first citation of each source, which a card opened from outside sits under
  const marks = useRef(new Map<number, HTMLButtonElement>());
  const told = useRef(onOpenChange);
  useEffect(() => { told.current = onOpenChange; });
  // the citation the card belongs to, whether the card should take the focus once it shows (Enter or Space), and whether a
  // focus coming back to the citation (from Escape) should leave the card shut
  const curEl = useRef<HTMLElement | null>(null), focusLink = useRef(false), back = useRef(false);

  const show = (i: number, el: HTMLElement) => {
    clearTimeout(hideT.current); if (cur.current === i) return;
    const b = box.current, c = card.current; if (!b || !c) return;
    const br = b.getBoundingClientRect(), cr = el.getBoundingClientRect();
    const x = Math.max(0, Math.min(cr.left - br.left - 24, br.width - c.offsetWidth));
    cur.current = i; curEl.current = el; setLast(i); told.current?.(i);
    // a new key restarts the entrance, so the card always rises in place instead of sliding across
    setAt(a => ({ i, x, y: cr.bottom - br.top + 8, n: (a?.n ?? 0) + 1 }));
  };
  const hide = (now = false) => {
    clearTimeout(hideT.current); clearTimeout(showT.current);
    const go = () => { if (cur.current !== null) told.current?.(null); cur.current = null; setAt(a => a && { ...a, i: -1 }); };
    if (now) go(); else hideT.current = setTimeout(go, 140);
  };

  useEffect(() => {
    const down = (e: PointerEvent) => { const t = e.target as Element; if (!card.current?.contains(t) && !t.closest?.('.dm-chx-c')) hide(true); };
    const resize = () => hide(true);
    // Escape puts the card away while the focus or the pointer is on the answer, and leaves the focus where it was, or on
    // its citation when it was in the card
    const key = (e: KeyboardEvent) => { const b = box.current; if (e.key === 'Escape' && cur.current !== null && b && (b.contains(document.activeElement) || b.matches(':hover'))) {
      e.preventDefault(); const to = card.current?.contains(document.activeElement) ? curEl.current : null; hide(true); if (to) { back.current = true; to.focus({ preventScroll: true }); } } };
    document.addEventListener('pointerdown', down); document.addEventListener('keydown', key); addEventListener('resize', resize);
    return () => { document.removeEventListener('pointerdown', down); document.removeEventListener('keydown', key); removeEventListener('resize', resize); clearTimeout(hideT.current); clearTimeout(showT.current); };
  }, []);

  // opened with Enter or Space, the card takes the focus on its link once it shows
  useEffect(() => { if (focusLink.current && at && at.i >= 0) { focusLink.current = false; card.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }); } }, [at]);

  // a card opened or closed from outside
  useEffect(() => {
    if (openAt === undefined) return;
    if (openAt === null) { if (cur.current !== null) hide(true); return; }
    const el = marks.current.get(openAt); if (el && cur.current !== openAt) show(openAt, el);
  }, [openAt]); // eslint-disable-line react-hooks/exhaustive-deps

  const cite = (n: number, key: string) => {
    const i = n - 1;
    if (!sources[i]) return <Fragment key={key}>[{n}]</Fragment>;
    return (
      <button type="button" key={key} ref={el => { if (el && !marks.current.has(i)) marks.current.set(i, el); }} className={cx('dm-chx-c', at?.i === i && 'dm-on')} aria-label={`Source ${n}: ${sources[i].title}`}
        onPointerEnter={e => { if (e.pointerType === 'touch') return; const el = e.currentTarget; clearTimeout(showT.current); clearTimeout(hideT.current); showT.current = setTimeout(() => show(i, el), cur.current !== null ? 0 : 90); }}
        onPointerLeave={e => { if (e.pointerType === 'touch') return; clearTimeout(showT.current); hide(); }}
        onFocus={e => { if (back.current) { back.current = false; return; } show(i, e.currentTarget); }} onBlur={e => { if (!card.current?.contains(e.relatedTarget as Node)) hide(); }}
        // touch has no hover: a tap shows the card, the next tap anywhere else hides it. Enter or Space (a click with no
        // pointer) also puts the focus on the card's link, so the keyboard can reach it
        onClick={e => { const key = e.detail === 0; if (cur.current !== i) { focusLink.current = key; show(i, e.currentTarget); } else if (key) card.current?.querySelector<HTMLElement>('a')?.focus({ preventScroll: true }); }}>{n}</button>
    );
  };
  const paragraphs = text.split(/\n\s*\n/).map((p, k) => (
    <p key={k} className="dm-msg dm-chx-p">{p.split(/\[(\d+)\]/).map((part, j) => j % 2 ? cite(+part, k + '-' + j) : part)}</p>
  ));

  const s = sources[at && at.i >= 0 ? at.i : last];
  const open = !!at && at.i >= 0;
  const follow = (e: MouseEvent) => { if (!s?.href) e.preventDefault(); onOpenSource?.(s, sources.indexOf(s)); };
  return (
    <div data-dm="" ref={box} className={cx('dm-chx', className)}>
      {paragraphs}
      <div key={at?.n ?? 0} ref={card} className={cx('dm-chx-card dm-panel', open && 'dm-show')} role="dialog" aria-label="Source"
        style={at ? { left: at.x, top: at.y } : undefined}
        onPointerEnter={() => clearTimeout(hideT.current)} onPointerLeave={e => { if (e.pointerType !== 'touch') hide(); }}
        onBlur={e => { const t = e.relatedTarget as Node | null; if (cur.current !== null && !card.current?.contains(t) && t !== curEl.current) hide(); }}>
        {s && (
          <div className="dm-chx-in">
            <div className="dm-chx-sh"><span className="dm-fv" style={{ background: s.color }}>{s.mark}</span><span>{s.site}</span></div>
            <div className="dm-chx-t">{s.title}</div>
            <div className="dm-chx-q">{s.quote}</div>
            <div className="dm-chx-f">
              <span>{s.meta}</span>
              <a href={s.href ?? '#'} target={s.href ? '_blank' : undefined} rel="noreferrer" onClick={follow}>{openLabel} <Icon name="ext" size="xs" /></a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
```

## More in Sources and output

- [Code viewer](https://designme.dev/components/code-viewer.md): Code the agent wrote, with line notes you can ask about.
- [Terminal stream](https://designme.dev/components/terminal-stream.md): Shell commands the agent runs, with their output as it streams in.
- [Source stack](https://designme.dev/components/source-stack.md): Everything the agent read, folded into one quiet pill.
- [Field extraction](https://designme.dev/components/field-extraction.md): The agent pulls fields out of a document and shows where each came from.
- [Metric insight](https://designme.dev/components/metric-insight.md): A number, its trend, and the agent's read on why it moved.
- [Details panel](https://designme.dev/components/details-panel.md): Properties of a run you can change in place.
- [Task table](https://designme.dev/components/task-table.md): Agent tasks in a sortable table with bulk actions.

All components: https://designme.dev/llms.txt
