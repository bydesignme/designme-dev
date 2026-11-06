'use client';
import { isValidElement, type ReactNode } from 'react';
import { cx } from '../../lib/cx';
import { Icon, type IconName } from '../../lib/icons';
import '../../designme.css';
import './badge.css';

/** A badge's colour: neutral grey, the accent's tint, the three states, or one of the eight tag colours */
export type BadgeTone = 'neutral' | 'accent' | 'success' | 'warning' | 'danger' | 'blue' | 'violet' | 'green' | 'orange' | 'red' | 'yellow' | 'pink' | 'teal';

export interface BadgeProps {
  /** The label, like "Pro", "Production" or "Failed" */
  children: ReactNode;
  /** Its colour, as text on its own tint. Neutral by default */
  tone?: BadgeTone;
  /** 'sm' is 20px tall, 'md' 24px (the default) */
  size?: 'sm' | 'md';
  /** A dot in the badge's colour before the label, for a status like Running */
  dot?: boolean;
  /** An icon before the label: a name from the icon set, or your own element */
  icon?: IconName | ReactNode;
  /** Adds a remove button after the label. Take the badge out of your list in it */
  onRemove?: () => void;
  /** The remove button's name for screen readers. Defaults to "Remove" and the label, when the label is text */
  removeLabel?: string;
  className?: string;
}

/** A small label for a plan, an environment or a status, with an optional dot or icon and an optional remove button. */
export function Badge({ children, tone = 'neutral', size = 'md', dot = false, icon, onRemove, removeLabel, className }: BadgeProps) {
  const text = typeof children === 'string' || typeof children === 'number' ? String(children) : '';
  return (
    <span data-dm="" className={cx('dm-bdg', size === 'sm' && 'dm-sm', className)} data-tone={tone === 'neutral' ? undefined : tone}>
      {dot && <span className="dm-bdg-dot" aria-hidden="true" />}
      {typeof icon === 'string' ? <Icon name={icon as IconName} size="xs" /> : isValidElement(icon) ? icon : null}
      <span className="dm-t">{children}</span>
      {onRemove && (
        <button type="button" className="dm-bdg-x" aria-label={removeLabel ?? (text ? `Remove ${text}` : 'Remove')} onClick={onRemove}>
          <Icon name="x" size="xs" />
        </button>
      )}
    </span>
  );
}
