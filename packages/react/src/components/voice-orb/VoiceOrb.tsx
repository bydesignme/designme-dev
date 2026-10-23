'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../../lib/cx';
import { Icon } from '../../lib/icons';
import { useReducedMotion } from '../../lib/hooks';
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
        <div className="dm-vor-orb" aria-hidden="true" style={{ '--dm-lv': Math.max(0, Math.min(1, level)).toFixed(3) } as CSSProperties}><i className="dm-vor-glow" /><i className="dm-vor-pc" /><i className="dm-vor-core"><OrbLight level={level} /></i></div>
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

/** Light flowing inside the orb in the colours of whoever is talking, faster and brighter as they get louder. Without WebGL the
    core keeps its plain gradient; with reduced motion it is one still frame, drawn again when the speaker changes */
function OrbLight({ level }: { level: number }) {
  const ref = useRef<HTMLCanvasElement>(null), lv = useRef(level), reduce = useReducedMotion();
  const [on, setOn] = useState(false);
  lv.current = Math.max(0, Math.min(1, level));
  useEffect(() => {
    const cv = ref.current, box = cv?.closest<HTMLElement>('.dm-vor'); if (!cv || !box) return;
    const s = orbShader(cv); if (!s) return;
    setOn(true);
    const dot = box.querySelector('.dm-vor-dot')!, pc = box.querySelector('.dm-vor-pc')!;
    const draw = (ms: number) => s.paint(ms, lv.current, getComputedStyle(dot).backgroundColor, getComputedStyle(pc).backgroundColor);
    let raf = 0, seen = true, flow = 0, last = 0, dead = false;
    const io = new IntersectionObserver(e => { seen = e[0].isIntersecting; }); io.observe(cv);
    const mo = new MutationObserver(() => setTimeout(() => { if (!dead) draw(flow); }, 450));
    if (reduce) { draw(0); mo.observe(box, { attributes: true, attributeFilter: ['data-m'] }); }
    else {
      const tick = (t: number) => { flow += Math.min(50, t - (last || t)) * (1 + lv.current * 2.5); last = t; if (seen) draw(flow); raf = requestAnimationFrame(tick); };
      raf = requestAnimationFrame(tick);
    }
    // the context is let go once the canvas has left the page, not when an effect merely runs again on the same canvas
    return () => { dead = true; cancelAnimationFrame(raf); io.disconnect(); mo.disconnect(); setTimeout(() => { if (!cv.isConnected) s.lose(); }); };
  }, [reduce]);
  return <canvas ref={ref} className={cx('dm-vor-gl', on && 'dm-on')} />;
}

// a sphere of slowly flowing light, for Voice orb: domain-warped noise in two colours, a darker rim and a highlight up top.
// Returns paint(ms, level 0 to 1, colour, second colour) and lose(), or null where WebGL is not available
const FRAG = `precision mediump float;
uniform vec2 R;uniform float T,L;uniform vec3 A,B;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 u=(gl_FragCoord.xy*2.-R)/R.y;float r=length(u),t=T*.00018;
  vec2 q=vec2(fbm(u*1.4+vec2(0.,t)),fbm(u*1.4+vec2(5.2,-t*.8)));
  vec2 w=vec2(fbm(u*1.7+q*2.4+vec2(1.7-t*.7,9.2)),fbm(u*1.7+q*2.4+vec2(8.3,2.8+t*.6)));
  float f=fbm(u*1.3+w*2.2);
  vec3 c=mix(A*.62,A,smoothstep(.25,.7,f));
  c=mix(c,B,smoothstep(.4,.85,w.x)*.75);
  c=mix(c,mix(A,vec3(1.),.6),smoothstep(.6,1.05,f+w.y*.35)*(.45+L*.4));
  c*=1.-smoothstep(.5,1.,r)*.3;
  c+=pow(max(0.,1.-length(u-vec2(-.34,.42))/.75),2.)*.3;
  float a=1.-smoothstep(.97,1.,r);gl_FragColor=vec4(c*a,a);
}`;

function orbShader(cv: HTMLCanvasElement) {
  const gl = cv.getContext('webgl', { premultipliedAlpha: true, antialias: true }); if (!gl) return null;
  const sh = (type: number, src: string) => { const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s; };
  const pr = gl.createProgram()!;
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(pr); if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return null;
  gl.useProgram(pr);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const at = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(at); gl.vertexAttribPointer(at, 2, gl.FLOAT, false, 0, 0);
  const U = (k: string) => gl.getUniformLocation(pr, k), uR = U('R'), uT = U('T'), uL = U('L'), uA = U('A'), uB = U('B');
  // a computed colour to 0 to 1 channels. Mid-transition it can come as oklab() or color(), so a 1px canvas reads it
  const px = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!; px.canvas.width = px.canvas.height = 1;
  const rgb = (s: string) => { px.clearRect(0, 0, 1, 1); px.fillStyle = '#000'; px.fillStyle = s; px.fillRect(0, 0, 1, 1); const d = px.getImageData(0, 0, 1, 1).data; return [d[0] / 255, d[1] / 255, d[2] / 255]; };
  return {
    paint(ms: number, lv: number, a: string, b: string) {
      const d = Math.min(2, devicePixelRatio || 1), w = Math.round(cv.clientWidth * d) || 1;
      if (cv.width !== w) { cv.width = cv.height = w; gl.viewport(0, 0, w, w); }
      gl.uniform2f(uR, w, w); gl.uniform1f(uT, ms); gl.uniform1f(uL, lv); gl.uniform3fv(uA, rgb(a)); gl.uniform3fv(uB, rgb(b));
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    },
    lose() { gl.getExtension('WEBGL_lose_context')?.loseContext(); }
  };
}
