# Health score

> An account's health: a score ring, four factors that open, and the agent's next move.

App basics / Charts and tables. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/health-score

## Install

```sh
npx designme add health-score          # HTML, CSS and JS, with the shared core
npx designme add health-score --react  # React 19 component and its CSS
npx designme add health-score --astro  # Astro component, with the HTML version's CSS and JS
```

The CLI copies the source into your project, so you own it and can change anything.

With the shadcn CLI, in a project set up for shadcn/ui:

```sh
npx shadcn@latest add https://designme.dev/r/shadcn/health-score.json
npx shadcn@latest add https://designme.dev/r/shadcn/astro/health-score.json  # Astro
```

## About

One account's health at a glance: the score out of 100 in a small ring with its verdict (Healthy, Watch or At risk), how many factors are on track and how the score moved in 30 days. Under it, the four factors (contact, deals on time, win chance and next step) as rows under hairlines, each with its status dot and figure; click one to read its detail right under it. At the foot, the agent's next move with a button: pressing it books or drafts, and the factors it changes update, so the ring and the score move with them. The demo switches between three accounts, one in each state.

### When to use it

- In a CRM's account sheet or details panel, where a rep needs to know whether an account needs attention and why.
- When an agent watches accounts and can take the next step itself, like booking a check-in or drafting an email.
- For any score made of a few weighted factors, each with its own status and figure.

### What it does

- The score sits in a small ring that fills to it and takes the verdict's colour: green from 70, orange from 50 and red below. The verdict word beside it is in the same colour.
- A line such as "Account health, 2 of 4 on track", and the change against the score 30 days ago, such as "−13 in 30 days".
- Four full-width rows split by hairlines, each with a status dot, its name, its figure ("11d ago", "0 late", "61%", "None booked") and a chevron. No card, fill or shadow per factor.
- The weakest factor that is off track is labelled Weakest in ink beside its name. Colour only marks state, in the dots and the ring.
- Clicking a row opens its detail right under it: what happened, and its points out of its maximum. One row is open at a time.
- The agent's suggestion is a plain row with the spark icon and a button. Pressing it shows a spinner, then a done chip such as "Booked", and the factors it changed update, for example 58 becoming 78 with Next step turning green.
- Switching accounts sweeps the ring and counts the score to the new value, and the words and figures crossfade. An open row stays open on the same factor.
- Under 360px of room the agent's button goes under its line, so it fits a narrow sheet. In React, `account`, `onAction` and `open` drive it from your own data.

### Accessibility

- The ring is an image labelled with the score, the verdict and the change, such as "Health 58 of 100, watch, down 13 in 30 days".
- Each row is a button with aria-expanded and aria-controls, labelled with its factor, what it means and its status, plus "the weakest factor" where that applies.
- A closed detail is hidden and out of the tab order.
- The agent's button sets aria-busy while it works, and a polite live region announces what it did. Focus moves to the done chip if it was on the button.
- With reduced motion the ring, the score, the crossfades and the opening rows finish at once.

## Usage in React

```tsx
import { HealthScore } from '@/components/designme/health-score/HealthScore';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: three accounts behind a switch. The story plays
// once: Watch is showing, the person books the check-in the agent suggests and Next step turns green, then they switch to
// the account at risk. Each account keeps what the agent did for it.
import { useRef, useState } from 'react';
import { HealthScore, type HealthAccount, type HealthFactor } from './HealthScore';
import { Seg } from '../lib/motion';
import { Demo } from '../lib/Demo';
import { useStory, useWait } from '../lib/useScript';

/* today is Mon Nov 9. A factor's points add up to the score: contact 30, deals on time 25, win chance 25, next step 20 */
type Pick = 'healthy' | 'watch' | 'risk';
const ACCOUNTS: Record<Pick, HealthAccount & { after?: Partial<HealthFactor> }> = {
  healthy: { name: 'Granite Peak Systems', segment: 'Strategic, Americas', previous: 85,
    factors: [
      { key: 'contact', label: 'Contact', status: 'ok', value: '2d', unit: 'ago', summary: 'last touch 2 days ago', points: 28, max: 30,
        detail: ['Last touch Nov 7, a pricing call with Dana Ruiz.', 'In touch every week for the last 6 weeks.'] },
      { key: 'late', label: 'On time', status: 'ok', value: '0', unit: 'late', summary: 'no deal past its close date', points: 25, max: 25,
        detail: ['3 open deals, none past its close date.', 'Next to close: Platform renewal, Nov 24.'] },
      { key: 'win', label: 'Win chance', status: 'ok', value: '62%', summary: '62% across the open deals', points: 16, max: 25,
        detail: ['62% weighted across 3 open deals.', 'Up from 54% six weeks ago.'] },
      { key: 'next', label: 'Next step', status: 'ok', value: 'Thu', unit: 'in 3 days', summary: 'pricing call on Thursday', points: 20, max: 20,
        detail: ['Pricing call, Thu Nov 12, 9am, with Dana Ruiz.'] }
    ],
    suggestion: { text: 'The pricing call is on Thursday. Send Dana the updated quote before it.', action: 'Draft email', icon: 'mail',
      doneText: 'Email to Dana drafted with the updated quote. It waits in your outbox for review.', doneLabel: 'Drafted' } },
  watch: { name: 'Fernway Travel', segment: 'Mid-market, Asia Pacific', previous: 71,
    factors: [
      { key: 'contact', label: 'Contact', status: 'warn', value: '11d', unit: 'ago', summary: 'quiet for 11 days', points: 18, max: 30,
        detail: ['Last touch Oct 29, an email to Sam Patel. No reply yet.', 'In touch in 5 of the last 6 weeks.'] },
      { key: 'late', label: 'On time', status: 'ok', value: '0', unit: 'late', summary: 'no deal past its close date', points: 25, max: 25,
        detail: ['2 open deals, both before their close date.', 'Next to close: First contract, Dec 15.'] },
      { key: 'win', label: 'Win chance', status: 'ok', value: '61%', summary: '61% across the open deals', points: 15, max: 25,
        detail: ['61% weighted across 2 open deals.', 'Down from 66% six weeks ago.'] },
      { key: 'next', label: 'Next step', status: 'warn', value: 'None', unit: 'booked', summary: 'no next step booked', points: 0, max: 20,
        detail: ['Nothing is booked with Fernway Travel.', 'Booking a meeting adds 20 points.'] }
    ],
    suggestion: { text: 'Quiet for 11 days with nothing booked. Book a check-in with Sam this week.', action: 'Book check-in', icon: 'cal',
      doneText: 'Check-in with Sam booked for Wed Nov 11, 10am. Health 58 to 78.', doneLabel: 'Booked' },
    after: { key: 'next', status: 'ok', value: 'Wed', unit: 'in 2 days', summary: 'check-in on Wednesday', points: 20,
      detail: ['Check-in, Wed Nov 11, 10am, with Sam Patel.', 'Booked by the agent just now.'] } },
  risk: { name: 'Tidewell Energy', segment: 'Enterprise, Asia Pacific', previous: 41,
    factors: [
      { key: 'contact', label: 'Contact', status: 'bad', value: '38d', unit: 'ago', summary: 'quiet for 38 days', points: 0, max: 30,
        detail: ['Last touch Oct 2, a demo follow-up with Priya Shah.', 'In touch in 1 of the last 6 weeks.'] },
      { key: 'late', label: 'On time', status: 'bad', value: '1', unit: 'late', summary: '1 deal 6 days past its close date', points: 9, max: 25,
        detail: ['Renewal was due Nov 3 and is still open, 6 days late.', '1 of 2 open deals is past its close date.'] },
      { key: 'win', label: 'Win chance', status: 'warn', value: '33%', summary: '33% across the open deals', points: 8, max: 25,
        detail: ['33% weighted across 2 open deals.', 'Down from 52% six weeks ago.'] },
      { key: 'next', label: 'Next step', status: 'bad', value: '6d', unit: 'overdue', summary: 'next step overdue since Nov 3', points: 0, max: 20,
        detail: ['Renewal call, due Tue Nov 3. Not held or moved.'] }
    ],
    suggestion: { text: '38 days quiet and the renewal is 6 days late. Call Priya to reset the date.', action: 'Book call', icon: 'cal',
      doneText: 'Call with Priya booked for Tue Nov 10, 9am. Health 17 to 37, still at risk.', doneLabel: 'Booked' },
    after: { key: 'next', status: 'ok', value: 'Tue', unit: 'tomorrow', summary: 'renewal call tomorrow', points: 20,
      detail: ['Renewal call, Tue Nov 10, 9am, with Priya Shah.', 'Booked by the agent just now, in place of the overdue step.'] } }
};

export default function HealthScoreDemo() {
  const [pick, setPick] = useState<Pick>('watch');
  const [accounts, setAccounts] = useState(ACCOUNTS);
  const wait = useWait();
  // the agent takes a moment, then the suggestion is done and the factor it changed updates (on that account, whichever shows)
  const act = (p: Pick) => async () => {
    await wait(900);
    setAccounts(all => {
      const a = all[p], after = a.after;
      return { ...all, [p]: { ...a, suggestion: a.suggestion && { ...a.suggestion, done: true },
        factors: after ? a.factors.map(f => (f.key === after.key ? { ...f, ...after } : f)) : a.factors } };
    });
  };
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, press }) => {
    await wait(2500);
    press('.dm-hsc-go');
    await wait(3400);
    press('.dm-seg2 button:nth-of-type(3)');
  });
  return (
    <Demo ref={ref} switcher={<Seg label="Account" value={pick} onChange={setPick} options={[{ value: 'healthy', label: 'Healthy' }, { value: 'watch', label: 'Watch' }, { value: 'risk', label: 'At risk' }]} />}>
      <HealthScore account={accounts[pick]} onAction={act(pick)} />
    </Demo>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `account` | `HealthAccount` | The account the block shows. Pass another one (or the same one, changed) and the ring sweeps, the score counts and what changed crossfades |
| `label` (optional) | `string` | Starts the line under the verdict, like "Account health, 2 of 4 on track" |
| `period` (optional) | `string` | The change's period, like "30 days" |
| `bands` (optional) | `[number, number]` | The verdict's lower bounds: [Healthy from, Watch from]. Below the second it is At risk |
| `verdicts` (optional) | `Partial<Record<HealthStatus, string>>` | The verdict words, by status |
| `open` (optional) | `string \| null` | The open factor, by key, or null for none. Leave it out to let the rows toggle themselves |
| `defaultOpen` (optional) | `string \| null` |  |
| `onOpenChange` (optional) | `(key: string \| null) => void` |  |
| `onAction` (optional) | `(account: HealthAccount) => void \| Promise<unknown>` | Called by the suggestion's button. Return a promise and the button spins until it settles; then pass the account back with `suggestion.done` set and the factors it changed |
| `className` (optional) | `string` |  |

## Usage in Astro

```astro
---
import HealthScore from '../components/designme/health-score/HealthScore.astro';
---
<HealthScore />
<HealthScore data-style="soft" class="my-class" />
```
It plays its demo; change `health-score.js` to show your own data. `data-style="soft"` draws it in Soft, and other attributes go on its root element. See https://designme.dev/docs/astro.md.

## Questions

**How is the score worked out?**

Each factor has `points` out of its `max`, and by default the score is the points added up, so the maxima should add up to 100 (the demo uses 30, 25, 25 and 20). Pass `score` to show your own number instead.

**How do I let the agent act?**

Give the account a `suggestion` and pass `onAction`. Return a promise that settles once the agent is done, then pass the account back with `suggestion.done` set and the factors it changed. The button gives way to a done chip, `doneText` replaces the line, and the ring and score move to the new total.

**Can I use it in a details sheet that already names the account?**

Yes. Leave out `name` and the block starts at the score. It is made for a sheet about 440px wide and fits narrower ones too.

**Can I change the bands and the words?**

Pass `bands` with the lower bounds for Healthy and Watch (70 and 50 by default), and `verdicts` to rename them. `label` starts the line under the verdict and `period` names the change's period.

## Source

`HealthScore.tsx`, as `npx designme add health-score --react` installs it:

```tsx
'use client';
import { Fragment, useEffect, useId, useRef, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable, useTween } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Fold, Spin, Swap } from '../lib/motion';
import '../designme.css';
import './health-score.css';

export type HealthStatus = 'ok' | 'warn' | 'bad';

/** @deprecated The rows no longer draw a trend (owner, 9 Nov): kept so existing data still type-checks, and ignored */
export type HealthTrend = { kind: 'dots'; values: boolean[] } | { kind: 'marks'; values: boolean[] } | { kind: 'spark'; values: number[] };

export interface HealthFactor {
  /** Identifies the factor, for `open` */
  key: string;
  /** Like "Contact" */
  label: string;
  /** Its dot and how the score counts it: on track, watch or at risk */
  status: HealthStatus;
  /** The figure, like "11d", "0", "61%" or "None" */
  value: string;
  /** Quieter words after the figure, like "ago", "late" or "booked" */
  unit?: string;
  /** What screen readers hear for the row, like "quiet for 11 days" */
  summary: string;
  /** Its share of the score: `points` of `max`. The factors' points add up to the score unless you pass `score` */
  points: number;
  max: number;
  /** @deprecated Ignored: the rows no longer draw a trend */
  trend?: HealthTrend;
  /** The lines its detail shows when the row is open */
  detail?: string[];
}

export interface HealthSuggestion {
  /** The agent's next move, like "Quiet for 11 days with nothing booked. Book a check-in with Sam this week." */
  text: string;
  /** The button's label, like "Book check-in" */
  action: string;
  icon?: IconName;
  /** Once true, the button gives way to a done chip and `doneText` replaces `text` */
  done?: boolean;
  doneText?: string;
  /** The chip's label, like "Booked". Defaults to "Done" */
  doneLabel?: string;
}

export interface HealthAccount {
  /** Shown above the score when set. Leave it out in a sheet that already names the account */
  name?: string;
  /** A line under the name, like "Mid-market, Asia Pacific" */
  segment?: string;
  factors: HealthFactor[];
  /** 0 to 100. Defaults to the factors' points added up */
  score?: number;
  /** The score a period ago, for the change beside the verdict, like "−13 in 30 days" */
  previous?: number;
  suggestion?: HealthSuggestion;
}

export interface HealthScoreProps {
  /** The account the block shows. Pass another one (or the same one, changed) and the ring sweeps, the score counts and
      what changed crossfades */
  account: HealthAccount;
  /** Starts the line under the verdict, like "Account health, 2 of 4 on track" */
  label?: string;
  /** The change's period, like "30 days" */
  period?: string;
  /** The verdict's lower bounds: [Healthy from, Watch from]. Below the second it is At risk */
  bands?: [number, number];
  /** The verdict words, by status */
  verdicts?: Partial<Record<HealthStatus, string>>;
  /** The open factor, by key, or null for none. Leave it out to let the rows toggle themselves */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (key: string | null) => void;
  /** Called by the suggestion's button. Return a promise and the button spins until it settles; then pass the account back
      with `suggestion.done` set and the factors it changed */
  onAction?: (account: HealthAccount) => void | Promise<unknown>;
  className?: string;
}

const RING = 2 * Math.PI * 18;
const WORD: Record<HealthStatus, string> = { ok: 'On track', warn: 'Watch', bad: 'At risk' };

/** An account's health: the score in a small ring with its verdict and change, a row per factor under a hairline with its
    status dot and figure (open one for its detail, right under it), and the agent's next move with its button. Colour only
    marks state: the dots and the ring. Fits a 440px details sheet; under 360px of room the button goes under the agent's line. */
export function HealthScore({ account, label = 'Account health', period = '30 days', bands = [70, 50], verdicts, open, defaultOpen = null, onOpenChange, onAction, className }: HealthScoreProps) {
  const [opened, setOpened] = useControllable<string | null>(open, defaultOpen, onOpenChange);
  const { factors, suggestion: sug } = account;
  const score = Math.round(account.score ?? factors.reduce((t, f) => t + f.points, 0));
  const band: HealthStatus = score >= bands[0] ? 'ok' : score >= bands[1] ? 'warn' : 'bad';
  const verdict = { ok: 'Healthy', warn: 'Watch', bad: 'At risk', ...verdicts }[band];
  const onTrack = factors.filter(f => f.status === 'ok').length;
  const line = `${label}, ${onTrack === factors.length ? `all ${onTrack}` : `${onTrack} of ${factors.length}`} on track`;
  const change = account.previous === undefined ? null : score - account.previous;
  // the weakest factor that is off track: the lowest share of its points, the first one on a tie
  const weak = factors.filter(f => f.status !== 'ok').reduce<HealthFactor | null>((w, f) => !w || f.points / (f.max || 1) < w.points / (w.max || 1) ? f : w, null);

  // the ring fills and the score counts a moment after the block appears; after that they follow the account
  const [drawn, setDrawn] = useState(false);
  useEffect(() => { const t = setTimeout(() => setDrawn(true), 140); return () => clearTimeout(t); }, []);
  const shown = useTween(drawn ? score : 0, 900, 0);
  // the button is busy for the account it was pressed for; done is the account's own (suggestion.done)
  const who = account.name ?? '';
  const [busy, setBusy] = useState<string | null>(null);
  const btn = useRef<HTMLButtonElement>(null), chip = useRef<HTMLSpanElement>(null), had = useRef(false);
  const [width, setWidth] = useState<number | undefined>();
  const act = async () => {
    if (busy !== null || !onAction || sug?.done) return;
    had.current = document.activeElement === btn.current;
    setWidth(btn.current?.offsetWidth); setBusy(who);
    try { await onAction(account); } finally { setBusy(b => (b === who ? null : b)); setWidth(undefined); }
  };
  const done = !!sug?.done;
  useEffect(() => { if (done && had.current) { had.current = false; chip.current?.focus(); } }, [done]);
  // what changes is announced once: the agent's work when it lands
  const [say, setSay] = useState('');
  const wasDone = useRef(done), wasWho = useRef(who);
  useEffect(() => {
    if (done && !wasDone.current && wasWho.current === who && sug) setSay(sug.doneText ?? sug.text);
    wasDone.current = done; wasWho.current = who;
  }, [done, who, sug]);

  const ids = 'dm-hsc' + useId();

  return (
    <div data-dm="" className={cx('dm-hsc dm-panel', className)} data-v={band} role="group" aria-label={label}>
      {account.name && <div className="dm-hsc-ac"><b><Swap>{account.name}</Swap></b>{account.segment && <Swap>{account.segment}</Swap>}</div>}
      <div className="dm-hsc-h">
        <div className="dm-hsc-ring" role="img" aria-label={`Health ${score} of 100, ${verdict.toLowerCase()}${change === null ? '' : `, ${change >= 0 ? 'up' : 'down'} ${Math.abs(change)} in ${period}`}`}>
          <svg viewBox="0 0 44 44" aria-hidden="true">
            <circle className="dm-tr" cx="22" cy="22" r="18" />
            <circle className="dm-fl" cx="22" cy="22" r="18" strokeDasharray={RING.toFixed(2)} style={{ strokeDashoffset: (RING * (1 - (drawn ? score : 0) / 100)).toFixed(2) }} />
          </svg>
          <b className="dm-num" aria-hidden="true">{Math.round(shown)}</b>
        </div>
        <div className="dm-hsc-ht"><Swap className="dm-hsc-vd">{verdict}</Swap><Swap className="dm-hsc-sub">{line}</Swap></div>
        {change !== null && <Swap className="dm-hsc-dl dm-num">{`${change >= 0 ? '+' : '−'}${Math.abs(change)} in ${period}`}</Swap>}
      </div>
      <div className="dm-hsc-l">
        {factors.map((f, j) => (
          <Fragment key={f.key}>
            <button type="button" className="dm-hsc-t" data-s={f.status} data-weak={f === weak ? '' : undefined} aria-expanded={f.key === opened} aria-controls={`${ids}-${j}`}
              aria-label={`${f.label}: ${f.summary}. ${WORD[f.status]}${f === weak ? ', the weakest factor' : ''}`} onClick={() => setOpened(f.key === opened ? null : f.key)}>
              <span className="dm-hsc-k"><i className="dm-hsc-dot" /><span className="dm-hsc-n">{f.label}</span><span className="dm-hsc-wk" aria-hidden="true">Weakest</span></span>
              <span className="dm-hsc-v"><b className="dm-num"><Swap>{f.value}</Swap></b><Swap>{f.unit ?? ''}</Swap></span>
              <Icon name="chev-d" size="xs" className="dm-hsc-cv" />
            </button>
            <Fold open={f.key === opened} className="dm-hsc-d">
              <div id={`${ids}-${j}`} role="region" aria-label={`${f.label} details`}>
                {f.key === opened && (
                  <div className="dm-hsc-dc dm-enter" key={who + f.key}>
                    {(f.detail ?? []).map((l, i) => <p key={i} className="dm-hsc-dp">{l}</p>)}
                    <p className="dm-hsc-pt dm-num"><span>{f.points} of {f.max} points</span><i /><span>{WORD[f.status]}</span></p>
                  </div>
                )}
              </div>
            </Fold>
          </Fragment>
        ))}
      </div>
      {sug && (
        <div className="dm-hsc-s">
          <Icon name="spark" />
          <Swap className="dm-hsc-st">{done ? sug.doneText ?? sug.text : sug.text}</Swap>
          {done
            ? <span key={who + ':done'} ref={chip} className="dm-tag dm-ok dm-hsc-done dm-enter" tabIndex={-1}><Icon name="check" size="xs" />{sug.doneLabel ?? 'Done'}</span>
            : onAction && <button key={who} ref={btn} type="button" className="dm-pill dm-primary dm-sm dm-hsc-go dm-enter" onClick={act} disabled={busy === who} aria-busy={busy === who || undefined}
                style={busy === who && width ? { width } : undefined}>
                {busy === who ? <><Spin /><span className="dm-hsc-sr">Working</span></> : <>{sug.icon && <Icon name={sug.icon} size="xs" />}{sug.action}</>}
              </button>}
        </div>
      )}
      <p className="dm-hsc-sr" aria-live="polite">{say}</p>
    </div>
  );
}
```

## More in Charts and tables

- [Line chart](https://designme.dev/components/line-chart.md): Two series over time with a hover readout and toggles.
- [Bar chart](https://designme.dev/components/bar-chart.md): Weekly agent runs, split by outcome, with a range switch.
- [Donut chart](https://designme.dev/components/donut-chart.md): Where the agent's time went, by kind of task.
- [Radial goals](https://designme.dev/components/radial-goals.md): Each agent's share of its own target as a ring, with the overall score in the middle.
- [Funnel chart](https://designme.dev/components/funnel-chart.md): Signup to paid, with the biggest drop called out by the agent.
- [Top pages](https://designme.dev/components/top-pages.md): Most visited pages with share of traffic and a quick sort.
- [Score breakdown](https://designme.dev/components/score-breakdown.md): A score out of 100 whose gauge is split by what goes into it, with the weakest part flagged and a fix to try.
- [Eval radar](https://designme.dev/components/radar-chart.md): This run against the baseline on six eval scores, with the weak ones flagged.
- [Cost vs quality](https://designme.dev/components/scatter-chart.md): Every run as a dot by cost and eval score, sized by tokens, with quadrants and a drag to select.
- [Activity heatmap](https://designme.dev/components/activity-heatmap.md): When the agent and the team were busy, by day and hour.
- [Stat cards](https://designme.dev/components/stat-cards.md): Four headline numbers with sparklines and a period switch.
- [Account table](https://designme.dev/components/account-table.md): Customer accounts with health, plan and an agent note per row.

All components: https://designme.dev/llms.txt
