'use client';
import { useEffect, useRef, useState } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useCopied, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Seg, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
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
