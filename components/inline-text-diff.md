# Inline text diff

> The agent's edits to a piece of copy, accepted or rejected one by one.

Agent components / Review and approve. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in three styles (Soft, Blueprint and Clean) with light and dark mode. Live demo: https://designme.dev/components/inline-text-diff

## Install

```sh
npx designme add inline-text-diff          # HTML, CSS and JS, with the shared core
npx designme add inline-text-diff --react  # React 19 component and its CSS
npx designme add inline-text-diff --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/inline-text-diff.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/inline-text-diff.json  # Astro
```

## About

Inline text diff shows the agent's edits to a piece of copy where they sit in the text: the old words struck in red, the new ones beside them in green. Clicking an edit opens a small toolbar to accept or reject it, an edit the agent isn't sure of is marked and says why, and the header can accept or reject everything still waiting.

### When to use it

- When the agent rewrites copy and people should approve it word by word, not all or nothing.
- When the edits are short and read best in place, inside the sentence they change.
- When the agent can say it isn't sure of an edit, like a claim that isn't in the brief, so people check that one first.
- When most edits are fine and one click should take the rest.

### What it does

- `parts` hold the copy in order: plain strings, with edits between them. Each edit has a `key`, the words it replaces (`from`) and the words it suggests (`to`).
- An edit with a `note` is marked in amber, and its toolbar becomes a warning notice: the note beside a filled warning sign, with Reject in the warning's colours and Accept beside it.
- Clicking an edit opens its toolbar under the edit's last line, or above its first line when there is no room below. Accepting keeps the new words and rejecting keeps the old ones, both as plain text.
- `decisions` / `defaultDecisions` / `onDecisionsChange` keep what was decided, `accepted` or `rejected` per edit key.
- The status under the title counts down the edits left, then says how many were accepted and rejected.
- Accept all and Reject all take every edit still waiting. Once none are left, the buttons go and `doneLabel` shows under the copy with a green tick.
- No room is kept for that line: the card eases shorter as edits fold into the text, and grows for `doneLabel` when it comes.

### Accessibility

- Each edit is a button you can reach with Tab and open with Enter or Space, which puts the focus on Accept; ← and → move between Accept and Reject. Its label says which edit it is, the words it replaces and the words it suggests, and `aria-expanded` says whether its toolbar is open.
- The toolbar is a dialog labelled "Edit". Escape closes it and puts focus back on the edit, and so does deciding from the keyboard.
- The line under the copy is an `aria-live="polite"` region, so the final result is read out.

## Usage in React

```tsx
import { InlineTextDiff } from '@/components/designme/inline-text-diff/InlineTextDiff';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { InlineTextDiff, type EditDecision, type TextPart } from './InlineTextDiff';
import { useStory } from '../lib/useScript';

/* ---------- Inline text diff: accept two edits, read why the agent isn't sure of one and reject it, then accept the rest ---------- */
const PARTS: TextPart[] = [
  { key: 'pick', from: 'Pick', to: 'Choose' }, ' a plan that ', { key: 'team', from: 'fits your team', to: 'grows with your studio' }, '. Every plan ',
  { key: 'includes', from: 'includes', to: 'comes with' }, ' unlimited projects, and ',
  { key: 'cancel', from: 'you can cancel at any time', to: 'your first month is free', note: 'Not in the pricing brief: there is no free month' }, '.'
];

export default function InlineTextDiffDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [decisions, setDecisions] = useState<Record<string, EditDecision>>({});

  // the preview's story, on the same beats as the site's
  useStory(ref, async ({ wait, press }) => {
    await wait(2500); press('[data-edit="pick"]'); await wait(1500); press('.dm-itd-acc');
    await wait(1000); press('[data-edit="team"]'); await wait(1500); press('.dm-itd-acc');
    await wait(1000); press('[data-edit="cancel"]'); await wait(3000); press('.dm-itd-rej');
    await wait(2000); press('.dm-itd-ok');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <InlineTextDiff title="Pricing intro" parts={PARTS} decisions={decisions} onDecisionsChange={setDecisions} doneLabel="Saved to Pricing v4" />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | What the copy is, like "Pricing intro" |
| `parts` | `TextPart[]` | The copy in order: plain strings, with the edits between them |
| `decisions` (optional) | `Record<string, EditDecision>` | What was decided for each edit, by key. Leave an edit out while it waits |
| `defaultDecisions` (optional) | `Record<string, EditDecision>` |  |
| `onDecisionsChange` (optional) | `(decisions: Record<string, EditDecision>) => void` |  |
| `doneLabel` (optional) | `string` | The line that replaces the buttons once every edit is decided, like "Saved to Pricing v4" |
| `labels` (optional) | `{ accept?: string; reject?: string; acceptAll?: string; rejectAll?: string }` |  |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import InlineTextDiff from '../components/designme/inline-text-diff/InlineTextDiff.astro';
---
<InlineTextDiff />
<InlineTextDiff data-style="soft" class="my-class" />
```
It plays its demo; change `inline-text-diff.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**Does it work out the diff between two texts?**

No. You pass the edits as `parts`, each with the words it replaces and the words it suggests. Your agent decides what changed; the component shows it and records the decisions.

**How is it different from Change review?**

Change review is for code: whole files and hunks, kept or undone. Inline text diff is for prose, where each edit is a few words inside a sentence.

**How do I get the final text?**

Walk `parts` with the `decisions`: plain strings as they are, `to` for an accepted edit and `from` for a rejected one.

## Source

`InlineTextDiff.tsx`, as `npx designme add inline-text-diff --react` installs it:

```tsx
'use client';
import { Fragment, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { enter, Swap, useGrow } from '../lib/motion';
import { giveBack } from '../lib/popover';
import '../designme.css';
import './inline-text-diff.css';

export interface TextEdit {
  key: string;
  /** The words the copy has now, shown struck */
  from: string;
  /** The words the agent suggests instead */
  to: string;
  /** Why the agent isn't sure of this one. The edit is marked and the note shows above its buttons */
  note?: string;
}

/** A run of the copy as it stands, or one of the agent's edits to it */
export type TextPart = string | TextEdit;
export type EditDecision = 'accepted' | 'rejected';

export interface InlineTextDiffProps {
  /** What the copy is, like "Pricing intro" */
  title: string;
  /** The copy in order: plain strings, with the edits between them */
  parts: TextPart[];
  /** What was decided for each edit, by key. Leave an edit out while it waits */
  decisions?: Record<string, EditDecision>;
  defaultDecisions?: Record<string, EditDecision>;
  onDecisionsChange?: (decisions: Record<string, EditDecision>) => void;
  /** The line that replaces the buttons once every edit is decided, like "Saved to Pricing v4" */
  doneLabel?: string;
  labels?: { accept?: string; reject?: string; acceptAll?: string; rejectAll?: string };
  className?: string;
}

const isEdit = (p: TextPart): p is TextEdit => typeof p !== 'string';
/** The filled warning sign, as the warning notices draw it */
const WarnSign = () => <svg className="dm-itd-wi" viewBox="0 0 24 24" aria-hidden="true"><path className="dm-a" d="M12 3.6 2.6 19.9h18.8z" /><path className="dm-b" d="M12 9.6v4.4M12 17v.01" /></svg>;

/** The agent's edits to a piece of copy, struck and added inline. Each one opens a small toolbar to accept or reject it,
    and the header takes the rest all at once. */
export function InlineTextDiff({ title, parts, decisions, defaultDecisions = {}, onDecisionsChange, doneLabel = 'Every edit reviewed', labels = {}, className }: InlineTextDiffProps) {
  const [dec, setDec] = useControllable(decisions, defaultDecisions, onDecisionsChange);
  const [cur, setCur] = useState<string | null>(null);
  const [at, setAt] = useState({ left: 0, top: 0, up: false });
  // no room is kept for the end: the card eases shorter as edits fold into the text, and grows for the note at the end
  const [root, inner] = useGrow();
  const bar = useRef<HTMLDivElement>(null);
  const chunks = useRef(new Map<string, HTMLSpanElement>());
  const L = { accept: 'Accept', reject: 'Reject', acceptAll: 'Accept all', rejectAll: 'Reject all', ...labels };
  const edits = parts.filter(isEdit);
  const left = edits.filter(e => !dec[e.key]).length, yes = edits.filter(e => dec[e.key] === 'accepted').length;
  const status = left === edits.length ? `${left} edits to review` : left ? `${left} of ${edits.length} left` : `${yes} accepted, ${edits.length - yes} rejected`;
  const open = edits.find(e => e.key === cur);
  // the toolbar keeps the last edit's note while it fades out
  const last = useRef<TextEdit | undefined>(undefined); if (open) last.current = open;
  // the toolbar opens under the edit's last line, or over its first when the page (or a box that clips it) has no room
  // below; inside a scaled preview the offsets are divided by its scale
  useLayoutEffect(() => {
    const r = root.current, b = bar.current, el = cur ? chunks.current.get(cur) : null; if (!r || !b || !el) return;
    const rb = r.getBoundingClientRect(), k = rb.width / r.offsetWidth || 1, rs = el.getClientRects(), cr = rs[rs.length - 1] ?? el.getBoundingClientRect(), c0 = rs[0] ?? cr;
    let top = 0, bottom = innerHeight;
    for (let a = r.parentElement; a && a !== document.documentElement; a = a.parentElement) {
      if (getComputedStyle(a).overflowY === 'visible') continue;
      const ar = a.getBoundingClientRect(); top = Math.max(top, ar.top); bottom = Math.min(bottom, ar.bottom);
    }
    const h = b.offsetHeight * k, up = cr.bottom + 6 + h > bottom - 8 && c0.top - 6 - h >= top + 8;
    setAt({ left: Math.max(12, Math.min(((up ? c0 : cr).left - rb.left) / k, r.offsetWidth - b.offsetWidth - 12)), top: up ? (c0.top - rb.top) / k - 6 - b.offsetHeight : (cr.bottom - rb.top) / k + 6, up });
  }, [cur]);
  // Enter or Space opens an edit's toolbar with the focus on Accept, as a dialog takes the focus; Escape brings it back
  const keyOpen = useRef(false);
  useLayoutEffect(() => { if (cur && keyOpen.current) { keyOpen.current = false; bar.current?.querySelector<HTMLElement>('.dm-itd-acc')?.focus({ preventScroll: true }); } }, [cur]);
  // a click anywhere else closes it
  useEffect(() => {
    if (!cur) return;
    const down = (e: PointerEvent) => { const t = e.target as Element; if (!bar.current?.contains(t) && !t.closest?.('.dm-itd-c')) setCur(null); };
    document.addEventListener('pointerdown', down);
    return () => document.removeEventListener('pointerdown', down);
  }, [cur]);

  const decide = (s: EditDecision) => {
    if (!cur) return;
    const back = bar.current?.contains(document.activeElement), el = chunks.current.get(cur);
    setDec({ ...dec, [cur]: s }); setCur(null);
    // the focus goes back to the edit, with a ring only when the answer came from the keyboard (a click never leaves one)
    if (back && el) giveBack(el);
  };
  const all = (s: EditDecision) => { setCur(null); setDec({ ...Object.fromEntries(edits.filter(e => !dec[e.key]).map(e => [e.key, s])), ...dec }); };

  return (
    <div data-dm="" className={className} style={{ width: '100%' }}
      onKeyDown={e => { if (e.key === 'Escape' && cur) { const el = chunks.current.get(cur); setCur(null); el?.focus({ preventScroll: true }); } }}>
      <div ref={root} className="dm-itd dm-panel dm-growing">
        <div ref={inner} className="dm-grow">
        <div className="dm-itd-h">
          <div className="dm-itd-ht"><b>{title}</b><Swap className="dm-muted dm-itd-st">{status}</Swap></div>
          {left > 0 && (
            <div className="dm-itd-a">
              <button type="button" className="dm-pill dm-ghost dm-sm dm-itd-no" onClick={() => all('rejected')}>{L.rejectAll}</button>
              <button type="button" className="dm-pill dm-primary dm-sm dm-itd-ok" onClick={() => all('accepted')}>{L.acceptAll}</button>
            </div>
          )}
        </div>
        <p className="dm-itd-t">
          {parts.map((p, i) => {
            if (!isEdit(p)) return <Fragment key={i}>{p}</Fragment>;
            const n = edits.indexOf(p), d = dec[p.key];
            return (
              <span key={p.key} ref={el => { if (el) chunks.current.set(p.key, el); else chunks.current.delete(p.key); }} data-edit={p.key}
                className={cx('dm-itd-c', p.note && 'dm-unsure', cur === p.key && 'dm-on', d === 'accepted' && 'dm-acc', d === 'rejected' && 'dm-rej')}
                role="button" tabIndex={0} aria-haspopup="dialog" aria-expanded={cur === p.key} aria-label={`Edit ${n + 1} of ${edits.length}: ${p.from}, suggested ${p.to}`}
                onClick={() => setCur(cur === p.key ? null : p.key)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); keyOpen.current = cur !== p.key; setCur(cur === p.key ? null : p.key); } }}>
                <del>{p.from}</del><ins>{p.to}</ins>
              </span>
            );
          })}
        </p>
        {/* the end: a neutral line with the green tick, only once every edit is decided. It comes in a beat after the card
            starts to grow for it, so it never shows past the card's edge */}
        <p className="dm-itd-f" aria-live="polite">
          {left === 0 && <span className="dm-enter" style={{ ...enter(220).style, display: 'inline-flex', alignItems: 'center', gap: 6 }}><Icon name="ok" size="xs" /><span>{doneLabel}</span></span>}
        </p>
        </div>
        {/* an edit the agent isn't sure of: the toolbar is a warning notice, and Reject, which settles it, is the warning's button */}
        <div ref={bar} className={cx('dm-itd-bar', open && 'dm-open', at.up && 'dm-up', last.current?.note && 'dm-unsure')} role="dialog" aria-label="Edit" inert={!open} style={{ left: at.left, top: at.top }}
          // the left and right arrows move between Accept and Reject
          onKeyDown={e => { const bs = Array.from(bar.current?.querySelectorAll<HTMLElement>('button') ?? []), j = bs.indexOf(document.activeElement as HTMLElement); if (j < 0) return;
            const d = ({ ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 } as Record<string, number>)[e.key], to = d ? bs[(j + d + bs.length) % bs.length] : e.key === 'Home' ? bs[0] : e.key === 'End' ? bs[bs.length - 1] : null;
            if (to) { e.preventDefault(); to.focus({ preventScroll: true }); } }}>
          {last.current?.note && <p className="dm-itd-why"><WarnSign /><span>{last.current.note}</span></p>}
          <div className="dm-itd-bb">
            <button type="button" className={cx('dm-pill dm-sm dm-itd-acc', last.current?.note ? 'dm-line' : 'dm-primary')} onClick={() => decide('accepted')}><Icon name="check" size="xs" />{L.accept}</button>
            <button type="button" className={cx('dm-pill dm-sm dm-itd-rej', last.current?.note ? 'dm-warn' : 'dm-ghost')} onClick={() => decide('rejected')}><Icon name="x" size="xs" />{L.reject}</button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

## More in Review and approve

- [Plan review](https://designme.dev/components/plan-review.md): Check the agent's plan, edit steps, then let it run.
- [Permission gate](https://designme.dev/components/permission-gate.md): The agent asks before it touches something new.
- [Decision prompt](https://designme.dev/components/decision-prompt.md): The agent asks a few quick questions before it starts.
- [Proposal card](https://designme.dev/components/proposal-card.md): A suggested change with confidence, alternatives and undo.
- [Rewrite toolbar](https://designme.dev/components/rewrite-toolbar.md): Select a sentence and let the agent rewrite it in place.
- [Draft review](https://designme.dev/components/draft-review.md): An email the agent drafted, to check and edit before it sends.
- [Eval results](https://designme.dev/components/eval-results.md): An eval run case by case, against the run before.

All components: https://designme.dev/llms.txt
