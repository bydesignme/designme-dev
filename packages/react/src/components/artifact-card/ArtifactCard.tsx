'use client';
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useIsoLayoutEffect, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Spin, Swap, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
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
