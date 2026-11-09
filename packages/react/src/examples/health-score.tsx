'use client';
// The animated preview from designme.dev, rebuilt from the React component: three accounts behind a switch. The story plays
// once: Watch is showing, the person books the check-in the agent suggests and Next step turns green, then they switch to
// the account at risk. Each account keeps what the agent did for it.
import { useRef, useState } from 'react';
import { HealthScore, type HealthAccount, type HealthFactor } from '../components/health-score/HealthScore';
import { Seg } from '../lib/motion';
import { Demo } from './Demo';
import { useStory, useWait } from './useScript';

/* today is Mon Nov 9. A factor's points add up to the score: contact 30, deals on time 25, win chance 25, next step 20 */
type Pick = 'healthy' | 'watch' | 'risk';
const ACCOUNTS: Record<Pick, HealthAccount & { after?: Partial<HealthFactor> }> = {
  healthy: { name: 'Granite Peak Systems', segment: 'Strategic, Americas', previous: 85,
    factors: [
      { key: 'contact', label: 'Contact', status: 'ok', value: '2d', unit: 'ago', summary: 'last touch 2 days ago', points: 28, max: 30, trend: { kind: 'dots', values: [true, true, true, true, true, true] },
        detail: ['Last touch Nov 7, a pricing call with Dana Ruiz.', 'In touch every week for the last 6 weeks.'] },
      { key: 'late', label: 'On time', status: 'ok', value: '0', unit: 'late', summary: 'no deal past its close date', points: 25, max: 25, trend: { kind: 'marks', values: [false, false, false] },
        detail: ['3 open deals, none past its close date.', 'Next to close: Platform renewal, Nov 24.'] },
      { key: 'win', label: 'Win chance', status: 'ok', value: '62%', summary: '62% across the open deals', points: 16, max: 25, trend: { kind: 'spark', values: [54, 55, 57, 58, 60, 62] },
        detail: ['62% weighted across 3 open deals.', 'Up from 54% six weeks ago.'] },
      { key: 'next', label: 'Next step', status: 'ok', value: 'Thu', unit: 'in 3 days', summary: 'pricing call on Thursday', points: 20, max: 20,
        detail: ['Pricing call, Thu Nov 12, 9am, with Dana Ruiz.'] }
    ],
    suggestion: { text: 'The pricing call is on Thursday. Send Dana the updated quote before it.', action: 'Draft email', icon: 'mail',
      doneText: 'Email to Dana drafted with the updated quote. It waits in your outbox for review.', doneLabel: 'Drafted' } },
  watch: { name: 'Fernway Travel', segment: 'Mid-market, Asia Pacific', previous: 71,
    factors: [
      { key: 'contact', label: 'Contact', status: 'warn', value: '11d', unit: 'ago', summary: 'quiet for 11 days', points: 18, max: 30, trend: { kind: 'dots', values: [true, true, true, true, true, false] },
        detail: ['Last touch Oct 29, an email to Sam Patel. No reply yet.', 'In touch in 5 of the last 6 weeks.'] },
      { key: 'late', label: 'On time', status: 'ok', value: '0', unit: 'late', summary: 'no deal past its close date', points: 25, max: 25, trend: { kind: 'marks', values: [false, false] },
        detail: ['2 open deals, both before their close date.', 'Next to close: First contract, Dec 15.'] },
      { key: 'win', label: 'Win chance', status: 'ok', value: '61%', summary: '61% across the open deals', points: 15, max: 25, trend: { kind: 'spark', values: [66, 66, 65, 64, 62, 61] },
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
      { key: 'contact', label: 'Contact', status: 'bad', value: '38d', unit: 'ago', summary: 'quiet for 38 days', points: 0, max: 30, trend: { kind: 'dots', values: [true, false, false, false, false, false] },
        detail: ['Last touch Oct 2, a demo follow-up with Priya Shah.', 'In touch in 1 of the last 6 weeks.'] },
      { key: 'late', label: 'On time', status: 'bad', value: '1', unit: 'late', summary: '1 deal 6 days past its close date', points: 9, max: 25, trend: { kind: 'marks', values: [true, false] },
        detail: ['Renewal was due Nov 3 and is still open, 6 days late.', '1 of 2 open deals is past its close date.'] },
      { key: 'win', label: 'Win chance', status: 'warn', value: '33%', summary: '33% across the open deals', points: 8, max: 25, trend: { kind: 'spark', values: [52, 50, 46, 41, 36, 33] },
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
