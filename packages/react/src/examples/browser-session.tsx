'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { BrowserSession, type BrowserStep } from '../components/browser-session/BrowserSession';
import { cx } from '../lib/cx';
import { Icon } from '../lib/icons';
import { useScript, useStory, useWait } from './useScript';

/* ---------- Browser session: the agent searches, opens the site, goes to pricing, stops at a cookie banner and asks; once
   it may close it, it reads the table and takes the three prices ---------- */
const LABELS = ['Search "northwind pricing"', 'Open northwind.app', 'Click "Pricing"', 'Read the plans table', 'Extract prices'];
type PageName = 'search' | 'home' | 'pricing';

// the page, drawn small with the component's own wireframe classes; in your app this is a screenshot or live view
function Page({ page, scroll, banner, hits, aim, onBanner }: { page: PageName; scroll: number; banner: boolean; hits: number; aim: string | null; onBanner: () => void }) {
  const k = (key: string) => ({ 'data-k': key, className: aim === key ? 'dm-aim' : undefined });
  const nav = (on: boolean) => (
    <div className="dm-bws-nav"><b>Northwind</b><span>Product</span><span data-k="pricing" className={cx(on && 'dm-on', aim === 'pricing' && 'dm-aim')}>Pricing</span><span>Docs</span></div>
  );
  return (
    <>
      {page === 'search' && (
        <div key="search" className="dm-bws-pg dm-enter">
          <div className="dm-bws-q"><Icon name="search" size="xs" /><span>northwind pricing</span></div>
          <div className="dm-bws-res"><b {...k('site')}>Northwind · Docs your team reads</b><span>northwind.app</span></div>
          <div className="dm-bws-res"><b>Northwind review: is it worth it?</b><span>softwarenotes.io</span></div>
          <div className="dm-bws-res"><b>Northwind alternatives</b><span>stackcompare.com</span></div>
        </div>
      )}
      {page === 'home' && (
        <div key="home" className="dm-bws-pg dm-enter">
          {nav(false)}<div className="dm-bws-hd">Docs your team actually reads</div>
          <span className="dm-bws-ln" style={{ width: '92%' }} /><span className="dm-bws-ln" style={{ width: '68%' }} /><span className="dm-bws-cta">Start free</span>
        </div>
      )}
      {page === 'pricing' && (
        <div key="pricing" className="dm-bws-pg dm-enter" style={{ transform: `translateY(${-scroll}px)` }}>
          {nav(true)}<div className="dm-bws-hd">Plans and pricing</div><span className="dm-bws-ln" style={{ width: '78%' }} />
          <div className="dm-bws-tb">
            <div><span>Plan</span><span>Per seat, monthly</span></div>
            {[['Starter', '$8'], ['Team', '$16'], ['Business', '$32']].map(([plan, price], i) => (
              <div key={plan}><span>{plan}</span><span data-k={'p' + i} className={cx('dm-num', i < hits && 'dm-hit', aim === 'p' + i && 'dm-aim')}>{price}</span></div>
            ))}
          </div>
          <span className="dm-bws-ln" style={{ width: '64%' }} /><span className="dm-bws-ln" style={{ width: '40%' }} />
        </div>
      )}
      <div className={cx('dm-bws-ck', banner && 'dm-on')}>
        <span>This site uses cookies</span>
        <button type="button" data-k="reject" className={aim === 'reject' ? 'dm-aim' : undefined} onClick={onBanner}>Reject all</button>
        <button type="button" onClick={onBanner}>Accept all</button>
      </div>
    </>
  );
}

export default function BrowserSessionDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const later = useWait();
  const [steps, setSteps] = useState<BrowserStep[]>(LABELS.map(label => ({ label, state: 'queued' })));
  const [page, setPage] = useState<PageName>('search');
  const [url, setUrl] = useState('northwind pricing');
  const [scroll, setScroll] = useState(0);
  const [banner, setBanner] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const [hits, setHits] = useState(0);
  const [aim, setAim] = useState<string | null>(null);
  const [cursor, setCursor] = useState<{ x: number; y: number; down?: boolean } | null>(null);
  const [paused, setPaused] = useState(false);
  const [mine, setMine] = useState(false);
  const [summary, setSummary] = useState<string>();
  // the run reads these between its moves, so Pause and Take over hold it where it is
  const held = useRef({ paused, mine }); held.current = { paused, mine };
  const unblock = useRef<() => void>(undefined);
  const step = (i: number, state: BrowserStep['state'], detail?: string) => setSteps(s => s.map((x, j) => j === i ? { ...x, state, detail } : x));

  const vp = () => ref.current?.querySelector<HTMLElement>('.dm-bws-vp');
  const where = (key: string) => {
    const v = vp(), el = v?.querySelector<HTMLElement>(`[data-k="${key}"]`); if (!v || !el) return null;
    const a = v.getBoundingClientRect(), b = el.getBoundingClientRect();
    return { x: b.left - a.left + Math.min(b.width * .5, 36), y: b.top - a.top + b.height * .6 };
  };
  // waits that only count while the agent may move
  const act = async (wait: (ms: number) => Promise<void>, ms: number) => { for (let left = ms; left > 0;) { await wait(100); if (!held.current.paused && !held.current.mine) left -= 100; } };
  const pressAt = async (wait: (ms: number) => Promise<void>, key: string) => {
    await wait(50); const p = where(key); if (!p) return;
    setAim(key); setCursor(p); await act(wait, 800);
    setCursor({ ...p, down: true }); await act(wait, 200); setCursor(p); setAim(null);
  };

  useScript(async ({ wait }) => {
    step(0, 'running'); await act(wait, 1800); step(0, 'done'); step(1, 'running');
    await pressAt(wait, 'site'); setPage('home'); setUrl('northwind.app');
    await act(wait, 1200); step(1, 'done'); step(2, 'running');
    await pressAt(wait, 'pricing'); setPage('pricing'); setUrl('northwind.app/pricing');
    await act(wait, 1000); step(2, 'done'); step(3, 'running');
    await act(wait, 600);
    const pg = vp()?.querySelector<HTMLElement>('.dm-bws-pg'), tb = pg?.querySelector<HTMLElement>('.dm-bws-tb');
    if (pg && tb) setScroll(Math.max(0, Math.min(pg.offsetHeight - vp()!.clientHeight, tb.offsetTop - 8)));
    await act(wait, 1200); setBanner(true); await act(wait, 500);
    // the banner covers the table: the agent stops and asks
    setBlocked(true); step(3, 'waiting');
    await new Promise<void>(res => { unblock.current = res; });
    step(3, 'running');
    await act(wait, 1400); step(3, 'done', '3 plans, priced per seat'); step(4, 'running', '0 of 3 prices');
    for (let i = 0; i < 3; i++) { await pressAt(wait, 'p' + i); setHits(i + 1); step(4, 'running', `${i + 1} of 3 prices`); }
    await act(wait, 500); setCursor(null);
    step(4, 'done', '$8, $16 and $32 per seat'); setSummary('Done · 3 prices saved to Pricing research');
  });

  // Allow lets the agent close the banner itself, with Reject all
  const allow = async () => {
    setBlocked(false); step(3, 'running', 'Closing the banner');
    await pressAt(later, 'reject'); setBanner(false); unblock.current?.();
  };
  // with the page in hand, the person can close the banner themselves
  const closeBanner = () => { if (!mine || !blocked) return; setBanner(false); setBlocked(false); unblock.current?.(); };

  // the preview's story: the agent stops at the cookie banner, and the person lets it close it
  useStory(ref, async ({ wait, press }) => { await wait(10000); press('.dm-bws-ask .dm-primary'); }, { hold: false });

  const shown = steps.map((s, i) => i === 3 && blocked ? { ...s, detail: mine ? 'Close the banner, then hand back' : 'A cookie banner covers the table' } : s);
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <BrowserSession title="Pricing research" url={url} search={page === 'search'} cursor={cursor} steps={shown}
        ask={blocked ? { label: 'Allow closing it', onAllow: () => void allow() } : undefined}
        paused={paused} onPausedChange={setPaused} inControl={mine} onInControlChange={setMine} summary={summary}>
        <Page page={page} scroll={scroll} banner={banner} hits={hits} aim={aim} onBanner={closeBanner} />
      </BrowserSession>
    </div>
  );
}
