'use client';
import type { CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { Icon } from '../../lib/icons';
import { Fold, Swap, Tip } from '../../lib/motion';
import '../../designme.css';
import './voice-orb.css';

/** idle (not started), listening, thinking, speaking (the agent) or ended */
export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'ended';

export interface VoiceOrbProps {
  state: VoiceState;
  /** How loud whoever is talking is, 0 to 1. The orb swells with it. Feed it from your audio, or from a made-up curve */
  level?: number;
  /** Your microphone is off. Listening shows as Muted, and the mute button is pressed */
  muted?: boolean;
  onMutedChange?: (muted: boolean) => void;
  /** Shows "You're muted" with an Unmute button, for when someone talks while muted */
  mutedNotice?: boolean;
  /** What was said last and who said it. Each word fades in as it arrives; a new `id` (or speaker) starts a new line */
  caption?: { speaker: string; text: string; id?: string };
  /** Shown before anything is said, like "Talk to the agent about Pricing v4" */
  hint?: string;
  /** Seconds since the chat started, shown top right */
  elapsed?: number;
  onStart?: () => void;
  onEnd?: () => void;
  /** Start again, from the row that shows once the chat has ended */
  onRestart?: () => void;
  /** The quiet line under "Voice chat ended". Defaults to the length and "Transcript saved" */
  endedDetail?: string;
  labels?: { ready?: string; listening?: string; thinking?: string; speaking?: string; muted?: string; ended?: string; start?: string; end?: string; mute?: string; unmute?: string; mutedNotice?: string; endedTitle?: string; restart?: string };
  className?: string;
}

const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;

/** A hands-free voice chat: an orb that swells with whoever is talking, the accent colour for you and violet for the agent, what was
    said under it, and mute and end below. It draws what you pass; it never opens the microphone itself. */
export function VoiceOrb({
  state, level = 0, muted = false, onMutedChange, mutedNotice = false, caption, hint, elapsed = 0, onStart, onEnd, onRestart, endedDetail, labels = {}, className
}: VoiceOrbProps) {
  const L = { ready: 'Ready', listening: 'Listening', thinking: 'Thinking', speaking: 'Speaking', muted: 'Muted', ended: 'Ended', start: 'Start talking', end: 'End', mute: 'Mute', unmute: 'Unmute', mutedNotice: "You're muted. Unmute so the agent can hear you.", endedTitle: 'Voice chat ended', restart: 'Start again', ...labels };
  // muted only changes how listening looks: the agent can still think and speak
  const m = muted && state === 'listening' ? 'muted' : state;
  const status = { idle: L.ready, listening: L.listening, thinking: L.thinking, speaking: L.speaking, muted: L.muted, ended: L.ended }[m];
  const on = state !== 'idle' && state !== 'ended';

  return (
    <div data-dm="" className={className} style={{ width: '100%' }}>
      <div className={cx('dm-vor dm-panel', on && 'dm-on')} data-m={m}>
        <div className="dm-vor-top"><span className="dm-vor-dot" /><Swap className="dm-vor-st">{status}</Swap><span className="dm-vor-t dm-num dm-muted">{fmt(elapsed)}</span></div>
        <div className="dm-vor-orb" aria-hidden="true" style={{ '--dm-lv': Math.max(0, Math.min(1, level)).toFixed(3) } as CSSProperties}><i className="dm-vor-glow" /><i className="dm-vor-core" /></div>
        <div className="dm-vor-cap" aria-live="polite">
          <Swap className="dm-vor-who dm-muted">{caption?.speaker ?? ''}</Swap>
          {caption
            ? <p className="dm-vor-tx" key={caption.id ?? caption.speaker}>{caption.text.split(' ').filter(Boolean).map((w, i) => <span key={i} className="dm-w">{w} </span>)}</p>
            : <p className="dm-vor-tx dm-hint">{hint}</p>}
        </div>
        <Fold open={mutedNotice && muted && on} className="dm-vor-mf">
          <div className="dm-vor-mw"><p><Icon name="alert" size="xs" /><span>{L.mutedNotice}</span></p><button type="button" className="dm-pill dm-sm" onClick={() => onMutedChange?.(false)}>{L.unmute}</button></div>
        </Fold>
        {state === 'ended' ? (
          <div className="dm-vor-done dm-enter">
            <Icon name="ok" />
            <span className="dm-t">{L.endedTitle}<span className="dm-muted">{endedDetail ?? `${fmt(elapsed)} · Transcript saved`}</span></span>
            {onRestart && <button type="button" className="dm-pill dm-sm" onClick={onRestart}>{L.restart}</button>}
          </div>
        ) : (
          <div className="dm-vor-f">
            <button type="button" className="dm-pill dm-ink dm-sm dm-vor-go" onClick={onStart}><Icon name="mic" size="xs" />{L.start}</button>
            <Tip label={muted ? L.unmute : L.mute}><button type="button" className="dm-ib dm-fill dm-vor-mute" aria-label={L.mute} aria-pressed={muted} onClick={() => onMutedChange?.(!muted)}><Icon name="mic" /></button></Tip>
            <span className="dm-sp" />
            <button type="button" className="dm-pill dm-sm dm-vor-end" onClick={onEnd}>{L.end}</button>
          </div>
        )}
      </div>
    </div>
  );
}
