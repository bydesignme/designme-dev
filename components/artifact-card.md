# Artifact card

> A file the agent made, with a live preview and versions.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/artifact-card

## Install

```sh
npx designme add artifact-card          # HTML, CSS and JS, with the shared core
npx designme add artifact-card --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Artifact card shows a file the agent produced, like a report, as a small preview with its name, a line of text, a headline number and a line chart. When the agent has made several versions, a switcher lets the person flip between them and the preview redraws to match.

### When to use it

- When your agent writes a report or analysis and you want to show the result in the chat instead of a bare file link.
- When the agent revises its work and people need to compare drafts side by side in time.
- When the file can be opened elsewhere, like in a panel beside the chat or a new tab, and people need a link to share.

### What it does

- Each entry in `versions` sets the preview's text, the chart's `values`, an optional headline `value` and `change`, the `meta` line under the file name and a `note` about what changed.
- With more than one version, a segmented switcher appears. It shows the latest version by default and can be controlled with `version` and `onVersionChange`.
- The chart starts flat, draws itself a moment after the card appears, and eases to the new line when the version changes. The text swaps with a short blur.
- `axis` adds labels under the chart, and `range` fixes its bottom and top. Without `range`, it fits the lowest and highest values with a little room.
- `link` adds a Copy link button that confirms with a check. `onOpen` adds an open button with your own `openLabel`, and `href` opens the address in a new tab when `onOpen` is not set.

### Accessibility

- The version switcher is a `role="group"` labelled "Version", and the current version's button has `aria-pressed="true"`.
- The icon buttons have `aria-label`s, and the decorative chart is `aria-hidden`.
- With `prefers-reduced-motion: reduce`, the chart jumps to its new line instead of easing.

## Usage in React

```tsx
import { ArtifactCard } from '@/components/designme/artifact-card/ArtifactCard';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { useScript } from '../lib/useScript';
import { ArtifactCard, type ArtifactVersion } from './ArtifactCard';

/* ---------- Artifact card: a churn report in three versions that play through once; the chart redraws as you switch ---------- */
const MONTHS = ['April', 'May', 'June', 'July', 'August', 'September'];
const DRAFTS = [
  { text: 'First pass at churn by month, sources still to check.', values: [3.4, 3.9, 4.3, 4.1, 3.8, 3.6], meta: 'v1, edited yesterday', note: 'First draft' },
  { text: 'Churn rose in July, the spike lines up with the pricing change.', values: [3.4, 3.9, 4.1, 5.8, 4.7, 3.9], meta: 'v2, edited 1 hour ago', note: 'Added the July spike' },
  { text: 'Churn rose in July, then settled once onboarding emails went out.', values: [3.4, 3.9, 4.1, 5.8, 4.5, 3.1], meta: 'v3, edited 2 min ago', note: 'Final, with your fixes' }
];
// the headline is the latest month, the change is measured from the peak
const VERSIONS: ArtifactVersion[] = DRAFTS.map((d, i) => {
  const last = d.values[d.values.length - 1], top = Math.max(...d.values);
  return { ...d, label: 'v' + (i + 1), value: last.toFixed(1) + '%', change: '−' + (top - last).toFixed(1) + ' pts since ' + MONTHS[d.values.indexOf(top)] };
});

export default function ArtifactCardDemo() {
  // the agent's versions play through once, first draft to final, unless someone picks one first
  const [version, setVersion] = useState(0);
  const touched = useRef(false);
  useScript(async ({ wait }) => {
    await wait(2300); if (!touched.current) setVersion(1);
    await wait(1800); if (!touched.current) setVersion(2);
  });
  return (
    <div style={{ width: '100%' }} onPointerDownCapture={() => { touched.current = true; }}>
      <ArtifactCard title="Churn analysis, Q3" versions={VERSIONS} version={version} onVersionChange={setVersion} axis={['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']} range={[2.6, 6.2]}
        link="https://designme.dev/a/churn-q3" href="https://designme.dev/a/churn-q3" />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `title` | `string` | The file's name, shown on the preview and under it |
| `versions` | `ArtifactVersion[]` |  |
| `axis` (optional) | `string[]` | Labels along the bottom of the chart, like months |
| `range` (optional) | `[number, number]` | The values at the bottom and top of the chart. Defaults to the lowest and highest values, with a little room |
| `icon` (optional) | `IconName` | The file's icon |
| `version` (optional) | `number` | Index of the version shown. Leave it out to let the switcher change it |
| `defaultVersion` (optional) | `number` | Defaults to the latest version |
| `onVersionChange` (optional) | `(version: number) => void` |  |
| `link` (optional) | `string` | Adds a button that copies this link |
| `href` (optional) | `string` | Adds a button that opens this address in a new tab |
| `onOpen` (optional) | `() => void` | Adds an open button that calls this instead, like opening the file beside a chat |
| `openLabel` (optional) | `string` | The open button's tip. Defaults to "Open" |
| `className` (optional) | `string` |  |

## Questions

**Can the preview show something other than a line chart?**

Not as written. The preview draws the title, the version's text, an optional headline number and a line chart from `values`. Since the source is copied into your project, you can change the preview markup there.

**How do I play through the agent's drafts as they arrive?**

Add each new draft to `versions` and set `version` to its index from your own state. Leave `version` out and the card opens on the latest one and lets the switcher change it.

**Do I need both `link` and `href`?**

No. When you pass only `href`, the card uses it for the copy button too. Pass `link` when the shareable link differs from the address that opens the file.

## Source

`ArtifactCard.tsx`, as `npx designme add artifact-card --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useCopied, useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Seg, Swap, Tip } from '../lib/motion';
import '../designme.css';
import './artifact-card.css';

export interface ArtifactVersion {
  /** The version's name on the switcher, like "v3" */
  label: string;
  /** The line under the title in the preview */
  text: string;
  /** The numbers the preview's line chart draws, oldest first */
  values: number[];
  /** The headline number, like "3.1%" */
  value?: string;
  /** The change beside the headline number, like "−2.7 pts since July" */
  change?: string;
  /** The quiet line under the file name, like "v3, edited 2 min ago" */
  meta?: string;
  /** A note beside the switcher about what changed, like "Final, with your fixes" */
  note?: string;
}

export interface ArtifactCardProps {
  /** The file's name, shown on the preview and under it */
  title: string;
  versions: ArtifactVersion[];
  /** Labels along the bottom of the chart, like months */
  axis?: string[];
  /** The values at the bottom and top of the chart. Defaults to the lowest and highest values, with a little room */
  range?: [number, number];
  /** The file's icon */
  icon?: IconName;
  /** Index of the version shown. Leave it out to let the switcher change it */
  version?: number;
  /** Defaults to the latest version */
  defaultVersion?: number;
  onVersionChange?: (version: number) => void;
  /** Adds a button that copies this link */
  link?: string;
  /** Adds a button that opens this address in a new tab */
  href?: string;
  /** Adds an open button that calls this instead, like opening the file beside a chat */
  onOpen?: () => void;
  /** The open button's tip. Defaults to "Open" */
  openLabel?: string;
  className?: string;
}

const W = 300, H = 56;
// a smooth line through the points, the same curve the site draws
const curve = (p: [number, number][]) => p.reduce((d, q, k, a) => {
  if (!k) return `M${q[0]} ${q[1]}`;
  const p0 = a[k - 2] || a[k - 1], p1 = a[k - 1], p3 = a[k + 1] || q, t = .18;
  return d + ` C${p1[0] + (q[0] - p0[0]) * t} ${p1[1] + (q[1] - p0[1]) * t} ${q[0] - (p3[0] - p1[0]) * t} ${q[1] - (p3[1] - p1[1]) * t} ${q[0]} ${q[1]}`;
}, '');

/** Eases every value in the list to its target together, so the chart redraws instead of jumping */
function useTweenList(target: number[], ms: number, from: number[]) {
  const [shown, setShown] = useState(from);
  const cur = useRef(from);
  const reduce = useReducedMotion();
  const key = target.join(',');
  useEffect(() => {
    const a = cur.current, t0 = performance.now(), dur = reduce ? 1 : ms;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.max(0, Math.min(1, (t - t0) / dur)), e = 1 - Math.pow(1 - p, 3);
      const next = target.map((v, k) => (a[k] ?? a[a.length - 1] ?? v) + (v - (a[k] ?? a[a.length - 1] ?? v)) * e);
      cur.current = next; setShown(next);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [key, ms, reduce]); // eslint-disable-line react-hooks/exhaustive-deps
  return shown;
}

/** Copy link and open buttons. Copying flashes a check and says so, then settles back, like the site's copy buttons */
function Actions({ link, href, onOpen, openLabel = 'Open' }: { link?: string; href?: string; onOpen?: () => void; openLabel?: string }) {
  const [copied, copy] = useCopied();
  return (
    <>
      {link && <Tip label={copied ? 'Copied to clipboard' : 'Copy link'} open={copied || undefined}>
        <button type="button" className={cx('dm-ib dm-afx-link', copied && 'dm-copied')} aria-label="Copy link" onClick={() => copy(link)}><Icon name={copied ? 'check' : 'link'} /></button>
      </Tip>}
      {onOpen && <Tip label={openLabel}><button type="button" className="dm-ib" aria-label={openLabel} onClick={onOpen}><Icon name="max" /></button></Tip>}
      {href && !onOpen && <Tip label="Open in a new tab"><a className="dm-ib" href={href} target="_blank" rel="noreferrer" aria-label="Open"><Icon name="ext" /></a></Tip>}
    </>
  );
}

/** A file the agent made, with a live preview and its versions. */
export function ArtifactCard({ title, versions, axis, range, icon = 'file-text', version, defaultVersion, onVersionChange, link, href, onOpen, openLabel, className }: ArtifactCardProps) {
  const [cur, setCur] = useControllable(version, defaultVersion ?? versions.length - 1, onVersionChange);
  const v = versions[Math.max(0, Math.min(versions.length - 1, cur))];
  const all = versions.flatMap(x => x.values);
  const lo = range?.[0] ?? Math.min(...all) - (Math.max(...all) - Math.min(...all)) * .2;
  const hi = range?.[1] ?? Math.max(...all) + (Math.max(...all) - Math.min(...all)) * .2;
  // the chart starts flat and draws itself a moment after the card appears
  const [ready, setReady] = useState(false);
  useEffect(() => { const t = setTimeout(() => setReady(true), 350); return () => clearTimeout(t); }, []);
  const flat = v.values.map(() => lo + (hi - lo) / 6);
  const shown = useTweenList(ready ? v.values : flat, 700, flat);
  const pts = shown.map((y, k): [number, number] => [k / Math.max(1, shown.length - 1) * W, 52 - (y - lo) / (hi - lo) * 46]);
  const d = curve(pts);

  return (
    <div data-dm="" className={cx('dm-afx dm-panel', className)}>
      <div className="dm-afx-prev">
        <div className="dm-afx-doc">
          <div className="dm-afx-dh">{title}</div>
          <div className="dm-afx-dp"><Swap>{v.text}</Swap></div>
          {(v.value || v.change) && (
            <div className="dm-afx-kp">
              {v.value && <b className="dm-num dm-afx-v"><Swap>{v.value}</Swap></b>}
              {v.change && <Swap className="dm-afx-d">{v.change}</Swap>}
            </div>
          )}
          <svg className="dm-afx-ch" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" aria-hidden="true">
            <defs>
              <linearGradient id="afx-g" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" style={{ stopColor: 'var(--dm-accent)', stopOpacity: .16 }} />
                <stop offset="1" style={{ stopColor: 'var(--dm-accent)', stopOpacity: 0 }} />
              </linearGradient>
            </defs>
            <path className="dm-ar" d={`${d} L${W} ${H} L0 ${H} Z`} />
            <path className="dm-ln" d={d} />
          </svg>
          {axis && <div className="dm-afx-ax">{axis.map((a, i) => <span key={i}>{a}</span>)}</div>}
        </div>
      </div>
      <div className="dm-afx-meta">
        <span className="dm-afx-ic"><Icon name={icon} /></span>
        <div className="dm-afx-mt"><b>{title}</b>{v.meta && <Swap className="dm-afx-sub">{v.meta}</Swap>}</div>
        <Actions link={link ?? href} href={href} onOpen={onOpen} openLabel={openLabel} />
      </div>
      {versions.length > 1 && (
        <div className="dm-afx-vers">
          <Seg label="Version" value={String(cur)} onChange={x => setCur(+x)} options={versions.map((x, i) => ({ value: String(i), label: x.label }))} />
          {v.note && <Swap className="dm-afx-note dm-muted">{v.note}</Swap>}
        </div>
      )}
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
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
