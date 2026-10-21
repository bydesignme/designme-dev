'use client';
import { Fragment, isValidElement, useEffect, useRef, useState, type ButtonHTMLAttributes, type MouseEvent, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useCopied, useReducedMotion } from '../../lib/hooks';
import { Brand, type BrandName } from '../../lib/brands';
import { Icon, type IconName } from '../../lib/icons';
import { Spin, Think, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './buttons.css';

export type ButtonVariant = 'accent' | 'ink' | 'soft' | 'line' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

// a button used on its own still needs the resets that [data-dm] gives its contents, without adding a box to the layout
const ROOT = { display: 'contents' } as const;
// the content of a button sits in one span, so it can blur out and back in as a whole, like the site's swap()
const FACE = { display: 'inline-flex', alignItems: 'center', gap: 7 } as const;

/** Shows `children`. When `id` changes to a face that should `fade`, the old one blurs out first; any other change is instant */
function Face({ id, fade, children }: { id: string; fade: boolean; children: ReactNode }) {
  const [cur, setCur] = useState<{ id: string; node: ReactNode }>({ id, node: children });
  const [out, setOut] = useState(false);
  const reduce = useReducedMotion();
  if (id !== cur.id && !fade) setCur({ id, node: children });
  useEffect(() => {
    if (id === cur.id || !fade) return;
    setOut(true);
    const t = setTimeout(() => { setCur({ id, node: children }); setOut(false); }, reduce ? 0 : 170);
    return () => clearTimeout(t);
  }, [id, fade]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span className={cx('dm-sw', out && 'dm-out')} style={FACE}>{id === cur.id ? children : cur.node}</span>;
}

const glyph = (icon: IconName | ReactElement | undefined) =>
  icon === undefined ? null : isValidElement(icon) ? icon : <Icon name={icon as IconName} size="xs" />;
const Check = () => <Icon name="check" size="xs" className="dm-enter" />;

/* ---------- Button ---------- */

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children' | 'onClick'> {
  /** accent for the one main action, ink for a strong one, soft and line for the rest, ghost for the quietest. Left out, a plain pill */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** An icon before the label: an icon name, or your own element (like a Brand) */
  icon?: IconName | ReactElement;
  children?: ReactNode;
  /** Return a promise and the button runs by itself: busy until it settles, then done for `doneFor` ms */
  onClick?: (e: MouseEvent<HTMLButtonElement>) => void | Promise<unknown>;
  /** Shows the busy face: a spinner (or the thinking dots) and `busyLabel`. Clicks are ignored */
  busy?: boolean;
  /** Shows the done face: a check that pops in and `doneLabel`. Clicks are ignored */
  done?: boolean;
  /** The label while busy, like "Publishing". Defaults to the label */
  busyLabel?: ReactNode;
  /** The label once done, like "Published". Defaults to the label */
  doneLabel?: ReactNode;
  /** The icon on the done face, like "ext" for something that opened elsewhere. Defaults to a check that pops in */
  doneIcon?: IconName | ReactElement;
  /** spin, or think: the agent's four turning dots with a shimmering label */
  busyGlyph?: 'spin' | 'think';
  /** The done face turns green */
  success?: boolean;
  /** How long the done face stays when the button runs itself */
  doneFor?: number;
  /** Going back from done to the label blurs across (the default) instead of switching at once */
  fadeBack?: boolean;
  /** For a toggle: whether it is on, as aria-pressed */
  pressed?: boolean;
  /** A tooltip, with an optional shortcut after it */
  tip?: string;
  kbd?: string;
}

/** A pill button in one of the site's five styles and three sizes, with busy, done and pressed states. */
export function Button({ variant, size = 'md', icon, children, onClick, busy, done, busyLabel, doneLabel, doneIcon, busyGlyph = 'spin', success, doneFor = 1800,
  fadeBack = true, pressed, tip, kbd, className, ...rest }: ButtonProps) {
  // an onClick that returns a promise drives the button itself
  const [auto, setAuto] = useState<'idle' | 'busy' | 'done'>('idle');
  const alive = useRef(true), timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => { alive.current = true; return () => { alive.current = false; clearTimeout(timer.current); }; }, []);
  const isBusy = busy ?? auto === 'busy', isDone = !isBusy && (done ?? auto === 'done');
  const face = isBusy ? 'busy' : isDone ? 'done' : 'idle';

  const click = (e: MouseEvent<HTMLButtonElement>) => {
    if (isBusy || isDone) return;
    const r = onClick?.(e);
    if (!r || typeof r.then !== 'function') return;
    setAuto('busy');
    r.then(() => { if (!alive.current) return; setAuto('done'); timer.current = setTimeout(() => setAuto('idle'), doneFor); },
      () => { if (alive.current) setAuto('idle'); });
  };

  const think = isBusy && busyGlyph === 'think';
  const label = isBusy ? busyLabel ?? children : isDone ? doneLabel ?? children : children;
  const button = (
    <button type="button" {...rest}
      className={cx('dm-pill', variant && 'dm-' + variant, size === 'sm' && 'dm-sm', size === 'lg' && 'dm-btx-lg',
        isBusy && 'dm-busy', isDone && 'dm-done', isDone && success && 'dm-btx-load dm-ok', className)}
      aria-busy={isBusy || undefined} aria-pressed={pressed} onClick={click}>
      <Face id={face} fade={fadeBack && face === 'idle'}>
        {isBusy ? (think ? <Think /> : <Spin />) : isDone ? (doneIcon === undefined ? <Check /> : <span className="dm-enter" style={FACE}>{glyph(doneIcon)}</span>) : glyph(icon)}
        {think ? <span className="dm-shim">{label}</span> : label}
      </Face>
    </button>
  );
  return <span data-dm="" style={ROOT}>{tip ? <Tip label={tip} kbd={kbd}>{button}</Tip> : button}</span>;
}

/* ---------- ButtonIcon ---------- */

export interface ButtonIconProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon: IconName;
  /** Read out and shown in the tooltip */
  label: string;
  /** A shortcut shown after the label in the tooltip */
  kbd?: string;
  /** The filled round style (the default), or the bare one */
  fill?: boolean;
  iconSize?: 'xs' | 's' | 'm' | 'l';
}

/** A round icon-only button with a tooltip. */
export function ButtonIcon({ icon, label, kbd, fill = true, iconSize = 'xs', className, ...rest }: ButtonIconProps) {
  return (
    <span data-dm="" style={ROOT}>
      <Tip label={label} kbd={kbd}>
        <button type="button" {...rest} className={cx('dm-ib', fill && 'dm-fill', className)} aria-label={label}><Icon name={icon} size={iconSize} /></button>
      </Tip>
    </span>
  );
}

/* ---------- ButtonCopy ---------- */

export interface ButtonCopyProps {
  /** What goes on the clipboard */
  text: string;
  /** The pill's label, like "Copy link". Left out, it is a round icon button */
  label?: string;
  /** The label for a moment after copying */
  copiedLabel?: string;
  /** The icon button's tooltip and name */
  tip?: string;
  variant?: ButtonVariant;
  onCopy?: (text: string) => void;
  className?: string;
}

/** Copies text, then flashes a check and says so for a moment, like every copy button on the site. */
export function ButtonCopy({ text, label, copiedLabel = 'Copied', tip = 'Copy', variant = 'soft', onCopy, className }: ButtonCopyProps) {
  const [copied, copy] = useCopied();
  const click = () => { copy(text); onCopy?.(text); };
  const mark = <Icon name={copied ? 'check' : 'copy'} size="xs" />;
  return (
    <span data-dm="" style={ROOT}>
      {label === undefined
        ? <Tip label={copied ? 'Copied to clipboard' : tip} open={copied || undefined}>
            <button type="button" className={cx('dm-ib dm-fill', copied && 'dm-copied', className)} aria-label={tip} onClick={click}>{mark}</button>
          </Tip>
        : <Tip label="Copied to clipboard" open={copied || undefined} off={!copied}>
            <button type="button" className={cx('dm-pill', 'dm-' + variant, 'dm-btx-copy', copied && 'dm-copied', className)} onClick={click}>{mark}{copied ? copiedLabel : label}</button>
          </Tip>}
    </span>
  );
}

/* ---------- ButtonMenu ---------- */

export interface ButtonMenuItem {
  key: string;
  label: string;
  /** An icon before the label, or `brand` for a service's own mark */
  icon?: IconName;
  brand?: BrandName;
  /** Quiet text at the end of the row, like "#design" or a shortcut */
  detail?: string;
  /** A destructive action, like Delete: drawn in the danger colour */
  danger?: boolean;
  /** Starts a new group: a line above this item */
  divider?: boolean;
}

function MenuItems({ items, onPick }: { items: ButtonMenuItem[]; onPick: (key: string) => void }) {
  return <>{items.map(it => (
    <Fragment key={it.key}>
      {it.divider && <div className="dm-sep" role="separator" />}
      <button type="button" role="menuitem" className={cx('dm-mi', it.danger && 'dm-del')} onClick={() => onPick(it.key)}>
        {it.brand ? <Brand name={it.brand} /> : it.icon && <Icon name={it.icon} />}
        {it.label}
        {it.detail && <span className="dm-r">{it.detail}</span>}
      </button>
    </Fragment>
  ))}</>;
}

export interface ButtonMenuProps {
  label: string;
  items: ButtonMenuItem[];
  /** Called with the picked item's key. The menu closes a moment later */
  onSelect?: (key: string) => void;
  /** What the button says after a pick, like { label: 'Link copied' }, or { label: 'Exporting', busy: true }. Clear it and the label comes back */
  status?: { label: string; busy?: boolean } | null;
  variant?: ButtonVariant;
  /** Which edge of the button the menu lines up with */
  align?: 'start' | 'end';
  /** Whether the menu is open. Leave it out to let the button toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A button that opens a small menu and then says what happened, like Share. */
export function ButtonMenu({ label, items, onSelect, status, variant = 'line', align = 'start', open, defaultOpen, onOpenChange, className }: ButtonMenuProps) {
  const menu = usePopover({ align, open, defaultOpen, onOpenChange });
  const face = status ? (status.busy ? 'busy:' : 'done:') + status.label : 'idle';
  return (
    <span data-dm="" style={{ position: 'relative', display: 'inline-flex' }}>
      <button type="button" {...menu.trigger} className={cx('dm-pill', 'dm-' + variant, className)} aria-busy={status?.busy || undefined}>
        <Face id={face} fade={!status}>
          {status && (status.busy ? <Spin /> : <Check />)}
          {status ? status.label : label}
        </Face>
      </button>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-btx-sp')} role="menu">
        <MenuItems items={items} onPick={key => { onSelect?.(key); menu.closeSoon(); }} />
      </div>
    </span>
  );
}

/* ---------- ButtonIconMenu ---------- */

export interface ButtonIconMenuProps {
  /** The icon on the button. Defaults to the three dots */
  icon?: IconName;
  /** Read out and shown in the tooltip */
  label: string;
  items: ButtonMenuItem[];
  /** Called with the picked item's key. The menu closes a moment later */
  onSelect?: (key: string) => void;
  /** What just happened, like "Duplicated": the icon turns into a check and the tooltip says it. Clear it and the icon comes back */
  status?: string | null;
  /** Which edge of the button the menu lines up with */
  align?: 'start' | 'end';
  /** Whether the menu is open. Leave it out to let the button toggle it */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
}

/** A round icon button that opens a menu of actions, like More, then flashes a check and says what happened. */
export function ButtonIconMenu({ icon = 'more', label, items, onSelect, status, align = 'end', open, defaultOpen, onOpenChange, className }: ButtonIconMenuProps) {
  const menu = usePopover({ align, open, defaultOpen, onOpenChange });
  return (
    <span data-dm="" style={{ position: 'relative', display: 'inline-flex' }}>
      {/* no tooltip over its own open menu */}
      <Tip label={status || label} open={status ? true : undefined} off={menu.open && !status}>
        <button type="button" {...menu.trigger} className={cx('dm-ib dm-fill dm-btx-more', status && 'dm-done', className)} aria-label={label}>
          <Icon name={status ? 'check' : icon} size="xs" />
        </button>
      </Tip>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-btx-mp')} role="menu">
        <MenuItems items={items} onPick={key => { onSelect?.(key); menu.closeSoon(); }} />
      </div>
    </span>
  );
}

/* ---------- ButtonRun ---------- */

export type ButtonRunState = 'idle' | 'running' | 'stopped' | 'complete';

export interface ButtonRunProps {
  state: ButtonRunState;
  /** How long it has been running, shown as m:ss */
  seconds?: number;
  label?: string;
  /** Clicked while not running */
  onRun?: () => void;
  /** Clicked while running. Hovering a running button already reads Stop */
  onStop?: () => void;
  variant?: ButtonVariant;
  className?: string;
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;

/** Starts a run and shows its time; while it runs, hovering turns it into Stop. */
export function ButtonRun({ state, seconds = 0, label = 'Run agent', onRun, onStop, variant = 'ink', className }: ButtonRunProps) {
  const [hover, setHover] = useState(false);
  const running = state === 'running';
  const face = running ? (hover ? 'stop' : 'run') : state;
  return (
    <span data-dm="" style={ROOT}>
      <button type="button" className={cx('dm-pill', 'dm-' + variant, 'dm-btx-run', running && 'dm-busy', className)} aria-busy={running || undefined}
        onPointerEnter={() => setHover(true)} onPointerLeave={() => setHover(false)} onClick={() => (running ? onStop : onRun)?.()}>
        <Face id={face} fade={state === 'idle'}>
          {face === 'stop' || face === 'stopped' ? <span className="dm-sq" /> : face === 'run' ? <Spin /> : face === 'complete' ? <Check /> : null}
          {face === 'stop' ? 'Stop' : face === 'stopped' ? 'Stopped' : face === 'complete' ? 'Run complete' : face === 'run' ? 'Running' : label}
          {face === 'run' && <span className="dm-num">{clock(seconds)}</span>}
        </Face>
      </button>
    </span>
  );
}

/* ---------- ButtonHold ---------- */

export interface ButtonHoldProps {
  label?: string;
  /** Shown while it is held */
  holdingLabel?: string;
  /** Shown once the hold completes */
  doneLabel?: string;
  icon?: IconName;
  /** Called when it has been held for 1.2s, with a pointer or with Space or Enter */
  onConfirm?: () => void;
  /** How long the done face stays before it resets */
  resetAfter?: number;
  className?: string;
}

/** A destructive action you hold down to confirm, filling up as you hold. Letting go early cancels it. */
export function ButtonHold({ label = 'Hold to delete', holdingLabel = 'Keep holding', doneLabel = 'Deleted', icon = 'trash', onConfirm, resetAfter = 1800, className }: ButtonHoldProps) {
  const [state, setState] = useState<'idle' | 'holding' | 'done'>('idle');
  // the label blurs out before "Keep holding" comes in
  const [said, setSaid] = useState(false);
  const [out, setOut] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);
  const later = (ms: number, fn: () => void) => { timers.current.push(setTimeout(fn, ms)); };

  const start = () => {
    if (state !== 'idle') return;
    setState('holding'); setOut(true);
    later(170, () => { setSaid(true); setOut(false); });
    later(1200, () => {
      setState('done'); setSaid(false); onConfirm?.();
      later(resetAfter, () => setState('idle'));
    });
  };
  const end = () => { if (state !== 'holding') return; clear(); setState('idle'); setSaid(false); setOut(false); };

  return (
    <span data-dm="" style={ROOT}>
      <button type="button" className={cx('dm-pill dm-btx-hold', state === 'holding' && 'dm-h', state === 'done' && 'dm-done', className)}
        onPointerDown={start} onPointerUp={end} onPointerLeave={end} onBlur={end}
        onKeyDown={e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat) { e.preventDefault(); start(); } }}
        onKeyUp={e => { if (e.key === ' ' || e.key === 'Enter') end(); }}>
        <span className="dm-fill" />
        <span className={cx('dm-lb', state === 'holding' && 'dm-sw', out && 'dm-out')}>
          {state === 'done' ? <><Icon name="check" size="xs" />{doneLabel}</> : said ? holdingLabel : <><Icon name={icon} size="xs" />{label}</>}
        </span>
      </button>
    </span>
  );
}

/* ---------- Buttons ---------- */

export interface ButtonsRow {
  /** The quiet name on the left, like "States" */
  label: string;
  children: ReactNode;
}

export interface ButtonsProps {
  rows: ButtonsRow[];
  className?: string;
}

/** Labelled rows of buttons, the way designme.dev lays out its button sheet. */
export function Buttons({ rows, className }: ButtonsProps) {
  return (
    <div data-dm="" className={cx('dm-btx', className)}>
      {rows.map((r, i) => <div key={i} className="dm-btx-row"><span className="dm-btx-l dm-muted">{r.label}</span>{r.children}</div>)}
    </div>
  );
}
