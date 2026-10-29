'use client';
import { useEffect, useRef, useState, type CSSProperties, type ReactElement, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useReducedMotion } from '../../lib/hooks';
import { Icon } from '../../lib/icons';
import { Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './banner.css';

/** The tint the banner sits on. `accent` is the accent's own tint; the others are tints of the tag colours */
export type BannerTone = 'accent' | 'neutral' | 'blue' | 'violet' | 'green' | 'amber';
/** The four drawings that come with it */
export type BannerArtName = 'layers' | 'steps' | 'tools' | 'path';

export interface BannerAction {
  label: string;
  onClick?: () => void;
  /** Makes it a link instead of a button */
  href?: string;
}

export interface BannerProps {
  /** The tint, and the colour the eyebrow and the drawing take. accent by default */
  tone?: BannerTone;
  /** One of the four drawings, or your own SVG (240 by 160 is the size it is shown at). null for none. layers by default */
  art?: BannerArtName | ReactElement | null;
  /** A short label over the title, like New or Beta */
  eyebrow?: string;
  title: ReactNode;
  /** One line or two under the title */
  description?: ReactNode;
  /** The primary button, on the accent */
  action?: BannerAction;
  /** A quieter link beside it */
  secondary?: BannerAction;
  /** Called by the dismiss button */
  onDismiss?: () => void;
  /** Shows the dismiss button. true by default */
  dismissible?: boolean;
  /** Whether the banner is showing (controlled), with defaultOpen and onOpenChange. Dismiss sets it to false, Undo to true */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** After a dismiss, a quiet line with Undo keeps the banner's place: true says "Banner dismissed", a string says something
      else, and false leaves nothing. true by default */
  undo?: boolean | string;
  /** The banner's name for screen readers. Announcement by default */
  label?: string;
  className?: string;
}

// the order each line draws in, and how far a part moves under the pointer
const d = (n: number) => ({ '--dm-d': n }) as CSSProperties;
const z = (n: number) => ({ '--dm-z': n }) as CSSProperties;
/* each drawing is 240 by 160, written as plain paths, all in one isometric view on a floor grid, with their drawn box
   centred in it: layers (three plates of a stack, pulled apart), steps (a staircase climbing to a flag, on a floor that
   follows its footprint), tools (five tool tiles, Slack, GitHub, Linear, Gmail and Apollo, each with its mark on top) and
   path (a dotted route across the floor to a raised tile). dm-ln lines draw themselves in, dm-gd are the dashed
   construction lines and the floor, which fade in, and dm-pl faces wear the banner's fill so what is in front hides what
   is behind */
const ART: Record<BannerArtName, ReactElement> = {
  layers: <><g className="dm-gds"><path className="dm-gd" d="M120 53L36.9 101M140.8 65L57.6 113M161.6 77L78.4 125M182.4 89L99.2 137M203.1 101L120 149M120 53L203.1 101M99.2 65L182.4 113M78.4 77L161.6 125M57.6 89L140.8 137M36.9 101L120 149"/></g><g className="dm-gds"><path className="dm-gd" d="M71.5 39L71.5 101M168.5 39L168.5 101M120 73L120 129"/></g><g className="dm-z" style={z(0)}><path className="dm-pl" d="M120 55L168.5 83L168.5 89L120 117L71.5 89L71.5 83Z"/><path className="dm-ln" style={d(0)} pathLength={1} d="M120 55L168.5 83L120 111L71.5 83Z"/><path className="dm-ln" style={d(1)} pathLength={1} d="M168.5 83L168.5 89L120 117L71.5 89L71.5 83"/><path className="dm-ln" style={d(2)} pathLength={1} d="M120 111L120 117"/></g><g className="dm-z" style={z(1)}><path className="dm-pl" d="M120 33L168.5 61L168.5 67L120 95L71.5 67L71.5 61Z"/><path className="dm-ln" style={d(3)} pathLength={1} d="M120 33L168.5 61L120 89L71.5 61Z"/><path className="dm-ln" style={d(4)} pathLength={1} d="M168.5 61L168.5 67L120 95L71.5 67L71.5 61"/><path className="dm-ln" style={d(5)} pathLength={1} d="M120 89L120 95"/></g><g className="dm-z" style={z(2)}><path className="dm-pl" d="M120 11L168.5 39L168.5 45L120 73L71.5 45L71.5 39Z"/><path className="dm-ln" style={d(6)} pathLength={1} d="M120 11L168.5 39L120 67L71.5 39Z"/><path className="dm-ln" style={d(7)} pathLength={1} d="M168.5 39L168.5 45L120 73L71.5 45L71.5 39"/><path className="dm-ln" style={d(8)} pathLength={1} d="M120 67L120 73"/><path className="dm-ln dm-ac" style={d(9)} pathLength={1} d="M120 23.6L146.7 39L120 54.4L93.3 39Z"/></g></>,
  steps: <><g className="dm-gds"><path className="dm-gd" d="M135.6 59L42.1 113M151.2 68L57.6 122M166.8 77L73.2 131M182.4 86L88.8 140M197.9 95L104.4 149M135.6 59L197.9 95M120 68L182.4 104M104.4 77L166.8 113M88.8 86L151.2 122M73.2 95L135.6 131M57.6 104L120 140M42.1 113L104.4 149"/></g><g className="dm-z" style={z(0)}><path className="dm-pl" d="M135.6 21L166.8 39L166.8 95L151.2 104L120 86L120 30Z"/><path className="dm-ln" style={d(0)} pathLength={1} d="M135.6 21L166.8 39L151.2 48L120 30Z"/><path className="dm-ln" style={d(1)} pathLength={1} d="M166.8 39L166.8 95L151.2 104L120 86L120 30"/><path className="dm-ln" style={d(2)} pathLength={1} d="M151.2 48L151.2 104"/><path className="dm-pl" d="M120 44L151.2 62L151.2 104L135.6 113L104.4 95L104.4 53Z"/><path className="dm-ln" style={d(3)} pathLength={1} d="M120 44L151.2 62L135.6 71L104.4 53Z"/><path className="dm-ln" style={d(4)} pathLength={1} d="M151.2 62L151.2 104L135.6 113L104.4 95L104.4 53"/><path className="dm-ln" style={d(5)} pathLength={1} d="M135.6 71L135.6 113"/><path className="dm-pl" d="M104.4 67L135.6 85L135.6 113L120 122L88.8 104L88.8 76Z"/><path className="dm-ln" style={d(6)} pathLength={1} d="M104.4 67L135.6 85L120 94L88.8 76Z"/><path className="dm-ln" style={d(7)} pathLength={1} d="M135.6 85L135.6 113L120 122L88.8 104L88.8 76"/><path className="dm-ln" style={d(8)} pathLength={1} d="M120 94L120 122"/><path className="dm-pl" d="M88.8 90L120 108L120 122L104.4 131L73.2 113L73.2 99Z"/><path className="dm-ln" style={d(9)} pathLength={1} d="M88.8 90L120 108L104.4 117L73.2 99Z"/><path className="dm-ln" style={d(10)} pathLength={1} d="M120 108L120 122L104.4 131L73.2 113L73.2 99"/><path className="dm-ln" style={d(11)} pathLength={1} d="M104.4 117L104.4 131"/></g><g className="dm-z" style={z(2)}><path className="dm-ln dm-ac" style={d(12)} pathLength={1} d="M137.1 30.9V8.9h14l-4 5 4 5h-14"/></g></>,
  tools: <><g className="dm-gds"><path className="dm-gd" d="M120 30.5L26.5 84.5M151.2 48.5L57.6 102.5M182.4 66.5L88.8 120.5M213.5 84.5L120 138.5M120 30.5L213.5 84.5M88.8 48.5L182.4 102.5M57.6 66.5L151.2 120.5M26.5 84.5L120 138.5"/></g><g className="dm-z" style={z(1)}><path className="dm-pl" d="M120 21.5L142.5 34.5L142.5 48.5L120 61.5L97.5 48.5L97.5 34.5Z"/><path className="dm-ln" style={d(0)} pathLength={1} d="M120 21.5L142.5 34.5L120 47.5L97.5 34.5Z"/><path className="dm-ln" style={d(1)} pathLength={1} d="M142.5 34.5L142.5 48.5L120 61.5L97.5 48.5L97.5 34.5"/><path className="dm-ln" style={d(2)} pathLength={1} d="M120 47.5L120 61.5"/><g className="dm-lg" transform="matrix(0.613 -0.354 0.613 0.354 105.278 34.5)"><path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/></g><path className="dm-pl" d="M57.6 57.5L80.2 70.5L80.2 84.5L57.6 97.5L35.1 84.5L35.1 70.5Z"/><path className="dm-ln" style={d(3)} pathLength={1} d="M57.6 57.5L80.2 70.5L57.6 83.5L35.1 70.5Z"/><path className="dm-ln" style={d(4)} pathLength={1} d="M80.2 70.5L80.2 84.5L57.6 97.5L35.1 84.5L35.1 70.5"/><path className="dm-ln" style={d(5)} pathLength={1} d="M57.6 83.5L57.6 97.5"/><g className="dm-lg" transform="matrix(0.613 -0.354 0.613 0.354 42.924 70.5)"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></g><path className="dm-pl" d="M120 57.5L142.5 70.5L142.5 84.5L120 97.5L97.5 84.5L97.5 70.5Z"/><path className="dm-ln" style={d(6)} pathLength={1} d="M120 57.5L142.5 70.5L120 83.5L97.5 70.5Z"/><path className="dm-ln" style={d(7)} pathLength={1} d="M142.5 70.5L142.5 84.5L120 97.5L97.5 84.5L97.5 70.5"/><path className="dm-ln" style={d(8)} pathLength={1} d="M120 83.5L120 97.5"/><g className="dm-lg" transform="matrix(0.613 -0.354 0.613 0.354 105.278 70.5)"><path d="M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z"/></g><path className="dm-pl" d="M182.4 57.5L204.9 70.5L204.9 84.5L182.4 97.5L159.8 84.5L159.8 70.5Z"/><path className="dm-ln" style={d(9)} pathLength={1} d="M182.4 57.5L204.9 70.5L182.4 83.5L159.8 70.5Z"/><path className="dm-ln" style={d(10)} pathLength={1} d="M204.9 70.5L204.9 84.5L182.4 97.5L159.8 84.5L159.8 70.5"/><path className="dm-ln" style={d(11)} pathLength={1} d="M182.4 83.5L182.4 97.5"/><g className="dm-lg" transform="matrix(0.613 -0.354 0.613 0.354 167.631 70.5)"><path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"/></g><path className="dm-pl" d="M120 93.5L142.5 106.5L142.5 120.5L120 133.5L97.5 120.5L97.5 106.5Z"/><path className="dm-ln" style={d(12)} pathLength={1} d="M120 93.5L142.5 106.5L120 119.5L97.5 106.5Z"/><path className="dm-ln" style={d(13)} pathLength={1} d="M142.5 106.5L142.5 120.5L120 133.5L97.5 120.5L97.5 106.5"/><path className="dm-ln" style={d(14)} pathLength={1} d="M120 119.5L120 133.5"/><g className="dm-lg" transform="matrix(0.613 -0.354 0.613 0.354 105.278 106.5)"><path fillRule="evenodd" d="M12 0a12 12 0 1 0 0 24a12 12 0 1 0 0-24Zm0 2.4a9.6 9.6 0 1 1 0 19.2a9.6 9.6 0 1 1 0-19.2ZM10.6 5.6h2.8l4.4 12.2h-2.6l-1-2.9H9.8l-1 2.9H6.2ZM12 8.6l-1.5 4.3h3Z"/></g></g></>,
  path: <><g className="dm-gds"><path className="dm-gd" d="M120 26L26.5 80M143.4 39.5L49.9 93.5M166.8 53L73.2 107M190.1 66.5L96.6 120.5M213.5 80L120 134M120 26L213.5 80M96.6 39.5L190.1 93.5M73.2 53L166.8 107M49.9 66.5L143.4 120.5M26.5 80L120 134"/></g><g className="dm-z" style={z(0)}><path className="dm-dt" d="M49.9 80L73.2 93.5L120 66.5L166.8 93.5L190.1 80"/><path className="dm-ln" style={d(0)} pathLength={1} d="M49.9 74L60.2 80L49.9 86L39.5 80Z"/></g><g className="dm-z" style={z(2)}><path className="dm-pl" d="M190.1 51L205.7 60L205.7 80L190.1 89L174.6 80L174.6 60Z"/><path className="dm-ln dm-ac" style={d(1)} pathLength={1} d="M190.1 51L205.7 60L190.1 69L174.6 60Z"/><path className="dm-ln" style={d(2)} pathLength={1} d="M205.7 60L205.7 80L190.1 89L174.6 80L174.6 60"/><path className="dm-ln" style={d(3)} pathLength={1} d="M190.1 69L190.1 89"/></g></>
};

function Act({ a, className }: { a: BannerAction; className: string }) {
  return a.href
    ? <a className={className} href={a.href} onClick={a.onClick}><span>{a.label}</span></a>
    : <button type="button" className={className} onClick={a.onClick}><span>{a.label}</span></button>;
}
// text that is a string crossfades when it changes, as on the site
const T = (n: ReactNode) => (typeof n === 'string' ? <Swap>{n}</Swap> : n);

/** An announcement on a tint of its tone: an eyebrow, a title, a line of text and its actions, a line drawing on the right
    (a strip across the top in a narrow column), and a dismiss with Undo. */
export function Banner({ tone = 'accent', art = 'layers', eyebrow, title, description, action, secondary, onDismiss, dismissible = true,
  open: openProp, defaultOpen = true, onOpenChange, undo = true, label = 'Announcement', className }: BannerProps) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useControllable(openProp, defaultOpen, onOpenChange);
  // the banner leaving, and the height it had, which the Undo line keeps so nothing below moves
  const [leaving, setLeaving] = useState(false);
  const [held, setHeld] = useState<number | null>(null);
  const slot = useRef<HTMLDivElement>(null), xRef = useRef<HTMLButtonElement>(null), undoRef = useRef<HTMLButtonElement>(null);
  const focus = useRef<'undo' | 'x' | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  useEffect(() => { if (open) { setLeaving(false); setHeld(null); } }, [open]);
  // the focus follows the button that went: to Undo after a dismiss, back to Dismiss after Undo
  useEffect(() => {
    if (focus.current === 'undo' && !open) undoRef.current?.focus({ preventScroll: true });
    if (focus.current === 'x' && open) xRef.current?.focus({ preventScroll: true });
    focus.current = null;
  }, [open]);

  const dismiss = () => {
    if (leaving) return;
    if (slot.current) setHeld(Math.ceil(slot.current.getBoundingClientRect().height));
    if (slot.current?.contains(document.activeElement)) focus.current = 'undo';
    setLeaving(true); onDismiss?.();
    timer.current = setTimeout(() => setOpen(false), reduce ? 0 : 320);
  };
  const restore = () => { if (slot.current?.contains(document.activeElement)) focus.current = 'x'; setOpen(true); };

  const name = typeof art === 'string' ? art : null;
  const gone = !open && undo !== false;
  if (!open && !gone) return null;
  return (
    <div ref={slot} data-dm="" className={cx('dm-bnx-slot', held !== null && 'dm-held', className)} style={held !== null ? { minHeight: held } : undefined}>
      {open && (
        <div className={cx('dm-bnx', leaving && 'dm-leave')} role="region" aria-label={label} data-tone={tone} data-art={name ?? undefined}>
          {art && (
            <div className="dm-bnx-art" aria-hidden="true">
              {name
                ? <svg key={name} className="dm-bnx-svg" viewBox="0 0 240 160" width="240" height="160" focusable="false">{ART[name]}</svg>
                : <div className="dm-bnx-svg">{art}</div>}
            </div>
          )}
          <div className="dm-bnx-tx">
            {eyebrow && <span className="dm-bnx-eb">{T(eyebrow)}</span>}
            <p className="dm-bnx-t">{T(title)}</p>
            {description && <p className="dm-bnx-d">{T(description)}</p>}
            {(action || secondary) && (
              <div className="dm-bnx-acts">
                {action && <Act a={action} className="dm-pill dm-primary dm-sm dm-bnx-go" />}
                {secondary && <Act a={secondary} className="dm-bnx-lk" />}
              </div>
            )}
          </div>
          {dismissible && <Tip label="Dismiss"><button ref={xRef} type="button" className="dm-ib dm-bnx-x" aria-label="Dismiss" onClick={dismiss}><Icon name="x" /></button></Tip>}
        </div>
      )}
      {gone && (
        <div className="dm-bnx-gone dm-enter" role="status">
          <span>{typeof undo === 'string' ? undo : 'Banner dismissed'}</span>
          <button ref={undoRef} type="button" className="dm-pill dm-ghost dm-sm dm-bnx-undo" onClick={restore}>Undo</button>
        </div>
      )}
    </div>
  );
}
