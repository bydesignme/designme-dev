'use client';
import { Fragment, useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Fold, Spin, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './web-search.css';

export interface WebPage {
  title: string;
  /** Like "stripe.com" */
  domain: string;
  /** Like "Oct 2026" */
  date?: string;
  /** reading while the agent opens it; the skipped ones say why */
  status: 'reading' | 'read' | 'skimmed' | 'paywall' | 'blocked' | 'timeout';
  /** The number the answer cites it by, as [1] */
  cite?: number;
}

export interface WebQuery {
  key: string;
  query: string;
  /** searching shimmers; done shows the count and the time */
  status: 'searching' | 'done';
  /** How many results came back; 0 says No results */
  results?: number;
  /** Like "0.9s" */
  time?: string;
  /** This query asks the one before it again in other words */
  rewritten?: boolean;
  pages?: WebPage[];
}

export interface WebSearchProps {
  queries: WebQuery[];
  /** True once the searching and reading are over: the trail folds to its summary */
  done?: boolean;
  /** The answer, with sources cited as [1], [2]. Each number points at the page with that `cite` */
  answer?: string;
  /** Whether the trail is open. Left to the component, it folds once `done` turns true */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Without the panel, for a chat stream (true) */
  bare?: boolean;
  className?: string;
}

const STATUS: Record<WebPage['status'], [string, string]> = { reading: ['Reading', ''], read: ['Read', ''], skimmed: ['Skimmed', ''], paywall: ['Skipped: paywall', 'dm-warn'], blocked: ['Skipped: blocked', 'dm-warn'], timeout: ['Skipped: timeout', 'dm-warn'] };

/** The agent's web searches as a trail: each query and what came back, each page read, skimmed or skipped and why, a summary once done, and an answer whose citations light their pages. */
export function WebSearch({ queries, done = false, answer, open, onOpenChange, bare = true, className }: WebSearchProps) {
  const [inner, setInner] = useState(true);
  useEffect(() => { if (done && open === undefined) setInner(false); }, [done]); // eslint-disable-line react-hooks/exhaustive-deps
  const isOpen = open ?? inner;
  const setOpen = (o: boolean) => { if (open === undefined) setInner(o); onOpenChange?.(o); };
  // each query's pages are open while it is being read, and fold once it is done; a person can open any of them
  const [qOpen, setQOpen] = useControllable<Record<string, boolean>>(undefined, {});
  const [hot, setHot] = useState<number | null>(null);
  const pages = queries.flatMap(q => (q.pages || []).map(p => ({ ...p, q: q.key })));
  const sites = [...new Set(pages.map(p => p.domain))];
  const read = pages.filter(p => p.status === 'read' || p.status === 'skimmed').length;
  const current = queries.find(q => q.status === 'searching'), reading = pages.filter(p => p.status === 'reading').length;
  const line = done ? `${queries.length} searches, ${read} pages read` : current ? `Searching for “${current.query}”` : reading ? `Reading ${reading} pages` : 'Searching the web';
  const cited = (n: number) => pages.find(p => p.cite === n);
  // only changes of phase are announced
  const [said, setSaid] = useState('');
  const last = useRef('');
  useEffect(() => { const t = done ? `Done: ${line}` : current ? `Searching for ${current.query}` : ''; if (t && t !== last.current) { last.current = t; setSaid(t); } }, [done, current?.key]); // eslint-disable-line react-hooks/exhaustive-deps
  const hotPage = hot != null ? cited(hot) : undefined;
  return (
    <div data-dm="" className={cx('dm-wsx', !bare && 'dm-panel', className)} style={bare ? { paddingInline: 0 } : undefined}>
      <button type="button" className="dm-wsx-h" aria-expanded={isOpen} onClick={() => setOpen(!isOpen)}>
        <span className="dm-wsx-ic">{done ? <Icon name="globe" size="xs" /> : <Spin />}</span>
        <Swap className={cx('dm-wsx-st', !done && 'dm-shim')}>{line}</Swap>
        <span className="dm-wsx-marks" aria-hidden="true">{sites.slice(0, 4).map(s => <span key={s} className={cx(hotPage?.domain === s && 'dm-hl')}>{s[0].toUpperCase()}</span>)}{sites.length > 4 && <span className="dm-n">+{sites.length - 4}</span>}</span>
        <Icon name="chev-d" size="xs" />
      </button>
      <Fold open={isOpen}>
        <div className="dm-wsx-list">
          {queries.map(q => {
            const has = !!q.pages?.length, auto = q.pages?.some(p => p.status === 'reading') ?? false, o = has && (qOpen[q.key] ?? auto);
            const lit = hotPage && hotPage.q === q.key;
            return (
              <div key={q.key} className={cx('dm-wsx-q', lit && !o && 'dm-hl', 'dm-enter')}>
                <button type="button" className={cx('dm-wsx-qh', !has && 'dm-empty')} aria-expanded={o} onClick={() => has && setQOpen({ ...qOpen, [q.key]: !o })}
                  aria-label={q.status === 'done' ? `${q.query}: ${q.results ? q.results + ' results' : 'no results'}${q.time ? ', ' + q.time : ''}` : undefined}>
                  <Icon name="search" size="xs" /><span className={cx('dm-t', q.status === 'searching' && 'dm-shim')}>{q.query}</span>
                  <span className={cx('dm-n', q.status === 'done' && !q.results && 'dm-none')}>{q.status === 'searching' ? 'Searching' : q.results ? `${q.results} results` : 'No results'}</span>
                  <span className="dm-tm dm-num">{q.status === 'done' ? q.time : ''}</span><Icon name="chev-r" size="xs" />
                </button>
                {q.rewritten && <span className="dm-wsx-rw"><Icon name="refresh" size="xs" />Asked again in other words</span>}
                {has && <Fold open={o}><ul className="dm-wsx-rs">{q.pages!.map(p => (
                  <Tip key={p.title} label={`${p.title} · ${p.domain}`}>
                    <li tabIndex={0} className={cx('dm-wsx-r', 'dm-enter', p.status !== 'read' && p.status !== 'skimmed' && p.status !== 'reading' && 'dm-skip', lit && hotPage?.title === p.title && 'dm-hl')}
                      aria-label={`${p.title}, ${p.domain}${p.date ? ', ' + p.date : ''}: ${STATUS[p.status][0]}`}>
                      <span className="dm-wsx-fav" aria-hidden="true">{p.domain[0].toUpperCase()}</span>
                      <span className="dm-tx"><span className="dm-t">{p.title}</span><span className="dm-d">{p.domain}{p.date ? ' · ' + p.date : ''}</span></span>
                      <span className={cx('dm-tag', STATUS[p.status][1])}>{p.status === 'reading' && <Spin />}{STATUS[p.status][0]}</span>
                    </li>
                  </Tip>))}</ul></Fold>}
              </div>
            );
          })}
        </div>
      </Fold>
      {answer && <div className="dm-wsx-ans">{answer.split(/(\[\d+\])/).map((part, i) => { const m = part.match(/^\[(\d+)\]$/); if (!m) return <Fragment key={i}>{part}</Fragment>;
        const n = +m[1], p = cited(n);
        return <Tip key={i} label={p ? `${p.title} · ${p.domain}` : `Source ${n}`}><button type="button" className={cx('dm-wsx-cite', hot === n && 'dm-on')} aria-label={p ? `Source ${n}: ${p.title}, ${p.domain}` : `Source ${n}`}
          onPointerEnter={() => setHot(n)} onPointerLeave={() => setHot(null)} onFocus={() => setHot(n)} onBlur={() => setHot(null)}>{n}</button></Tip>; })}</div>}
      <p className="dm-wsx-sr" role="status">{said}</p>
    </div>
  );
}
