'use client';
// The animated preview from designme.dev, rebuilt from the React component: two searches (the first finds nothing and is asked
// again), six pages read and one blocked, then the answer streams in with its sources.
import { useEffect, useState } from 'react';
import { WebSearch, type WebPage, type WebQuery } from '../components/web-search/WebSearch';
import { useWait } from './useScript';

const PLAN: (Omit<WebQuery, 'status' | 'pages'> & { pages?: WebPage[] })[] = [
  { key: 'a', query: 'stripe usage based billing limits 2026 enterprise tier', results: 0, time: '0.6s' },
  { key: 'b', query: 'stripe usage-based billing limits', results: 5, time: '0.9s', rewritten: true, pages: [
    { title: 'Usage-based billing', domain: 'stripe.com', date: 'Oct 2026', status: 'read' }, { title: 'Meters and billing thresholds', domain: 'stripe.com', date: 'Sep 2026', status: 'read', cite: 1 },
    { title: 'How we moved 40k customers to usage billing', domain: 'medium.com', date: 'Mar 2026', status: 'skimmed' }, { title: 'Why SaaS pricing is moving to usage', domain: 'ft.com', date: 'Aug 2026', status: 'paywall' }] },
  { key: 'c', query: 'metronome vs orb usage billing', results: 6, time: '1.1s', pages: [
    { title: 'Metronome vs Orb: a fair comparison', domain: 'metronome.com', date: 'Jul 2026', status: 'read', cite: 2 }, { title: 'Orb pricing and plans', domain: 'withorb.com', date: 'Oct 2026', status: 'read' },
    { title: 'orb-billing/examples: sending usage events', domain: 'github.com', date: 'Jun 2026', status: 'read' }, { title: 'Anyone switched from Stripe Billing to Orb?', domain: 'reddit.com', date: 'May 2026', status: 'blocked' }] }
];
const ANSWER = 'Stripe caps metered usage at 100 million events a month for each meter [1]. Metronome and Orb both take events in bulk with no monthly cap [2]. At your volume Stripe still fits, with room to grow.';

export default function WebSearchDemo() {
  const wait = useWait();
  const [queries, setQueries] = useState<WebQuery[]>([]);
  const [done, setDone] = useState(false);
  const [answer, setAnswer] = useState('');
  // the agent at work: nothing here waits on the visitor, so it carries on under the pointer
  useEffect(() => { void (async () => {
    await wait(500);
    for (const q of PLAN) {
      setQueries(qs => [...qs, { ...q, status: 'searching', pages: undefined }]); await wait(1100);
      setQueries(qs => qs.map(x => x.key === q.key ? { ...x, status: 'done' } : x));
      for (const [i, p] of (q.pages || []).entries()) {
        setQueries(qs => qs.map(x => x.key === q.key ? { ...x, pages: [...(x.pages || []), { ...p, status: 'reading' }] } : x)); await wait(420);
        setQueries(qs => qs.map(x => x.key === q.key ? { ...x, pages: x.pages!.map((y, j) => j === i ? p : y) } : x));
      }
      await wait(500);
    }
    setDone(true); await wait(400);
    const ws = ANSWER.split(' ');
    for (let i = 1; i <= ws.length; i++) { setAnswer(ws.slice(0, i).join(' ')); await wait(50); }
  })(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  return <div style={{ width: '100%' }}><WebSearch queries={queries} done={done} answer={answer} /></div>;
}
