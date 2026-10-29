# Voice orb

> A hands-free voice chat, with an orb that shows who is talking.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/voice-orb

## Install

```sh
npx designme add voice-orb          # HTML, CSS and JS, with the shared core
npx designme add voice-orb --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Voice orb is the screen for a hands-free voice chat with the agent. An orb in the middle swells with whoever is talking, in the accent colour while it listens to you and violet while the agent speaks, with what was said written under it word by word. Below sit mute and end, and someone who talks while muted is told so, with a button to unmute.

### When to use it

- When people talk to the agent instead of typing, and need to see that it is listening.
- When it should be clear at a glance whose turn it is: yours, the agent's, or the agent thinking.
- When people mute often, and should find out straight away when they talk into a muted microphone.
- When the chat should end with a record of it, like a saved transcript.

### What it does

- `state` moves through `idle`, `listening`, `thinking`, `speaking` and `ended`. The status line, its dot and the orb's colour follow it.
- `level` from 0 to 1 sets how far the orb swells, how fast the light inside it flows and how bright the light deep inside it glows. Feed it from your audio, or from a made-up curve as the demo does.
- The orb is a glossy sphere with light flowing inside it in two colours of whoever is talking, drawn by a small WebGL shader in one draw a frame. Nothing reaches past its edge, so it needs no room around it. Without WebGL it is a plain gradient circle, with reduced motion it holds still, and off screen it stops drawing.
- `caption` shows what was said last and who said it, each new word fading in.
- `muted` / `onMutedChange` drive the mute button. While muted, listening shows as Muted and a slash crosses the microphone.
- `mutedNotice` folds open "You're muted" with an Unmute button, for when your code hears someone talking while muted.
- The timer shows `elapsed` in minutes and seconds. Once `ended`, the buttons give way to a row with the length, and Start again when you pass `onRestart`.

### Accessibility

- The orb is decorative and hidden from screen readers; the status line names the state in words.
- The caption is an `aria-live="polite"` region, so what is said is read out.
- The mute button is labelled "Mute" and uses `aria-pressed` to say whether the microphone is off.

## Usage in React

```tsx
import { VoiceOrb } from '@/components/designme/voice-orb/VoiceOrb';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { VoiceOrb, type VoiceState } from './VoiceOrb';
import { useReducedMotion } from '../lib/hooks';
import { useStory, useWait } from '../lib/useScript';

/* ---------- Voice orb: start, mute while the agent answers, talk while muted, unmute and go on, then end ---------- */
// what is said, turn by turn. The demo plays it as a script: it never uses the microphone or makes a sound
const TURNS: [speaker: string, line: string][] = [
  ['You', 'Make the yearly price the default on the pricing page.'],
  ['Agent', 'Done. Yearly is now the default on all three plans in Pricing v4.'],
  ['You', 'Show the yearly saving in green too.'],
  ['Agent', 'Added. The saving shows in green under each yearly price.']
];

export default function VoiceOrbDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [state, setState] = useState<VoiceState>('idle');
  const [muted, setMuted] = useState(false);
  const [notice, setNotice] = useState(false);
  const [caption, setCaption] = useState<{ speaker: string; text: string; id: string }>();
  const [secs, setSecs] = useState(0);
  const [level, setLevel] = useState(0);
  const run = useRef(0), talking = useRef(false), mutedNow = useRef(false), lv = useRef(0);
  const reduce = useReducedMotion();
  mutedNow.current = muted;

  // a made-up level: a voice-like wobble while someone talks, a faint idle while it listens
  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      const to = talking.current ? .5 + .28 * Math.sin(t / 90) * Math.sin(t / 233) + .16 * Math.sin(t / 57) : state === 'listening' && !muted ? .05 + .03 * Math.sin(t / 420) : 0;
      lv.current += (Math.max(0, to) - lv.current) * .18; setLevel(lv.current); raf = requestAnimationFrame(tick);
    };
    // with reduced motion the level holds still; the setting is followed as it changes
    if (!reduce) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, muted, reduce]);
  // the clock runs from start to end, whatever happens between
  const live = state !== 'idle' && state !== 'ended';
  useEffect(() => {
    if (!live) return;
    const t = setInterval(() => setSecs(s => s + 1), 1000);
    return () => clearInterval(t);
  }, [live]);

  const say = async (speaker: string, line: string, ms: number, id: number, n: number) => {
    const words = line.split(' '); talking.current = true;
    for (let k = 1; k <= words.length; k++) { if (id !== run.current) return; setCaption({ speaker, text: words.slice(0, k).join(' '), id: String(n) }); await wait(ms); }
    talking.current = false;
  };
  const start = async () => {
    const id = ++run.current; setSecs(0); setCaption(undefined);
    for (let n = 0; n < TURNS.length; n++) {
      const [speaker, line] = TURNS[n];
      if (speaker === 'You') {
        setState('listening'); await wait(1200); if (id !== run.current) return;
        // they start talking while muted: say so, and wait for them to unmute
        if (mutedNow.current) { setNotice(true); while (mutedNow.current) { await wait(100); if (id !== run.current) return; } setNotice(false); await wait(400); }
        await say(speaker, line, 230, id, n); if (id !== run.current) return;
        setState('thinking'); await wait(1300);
      } else { setState('speaking'); await say(speaker, line, 190, id, n); if (id !== run.current) return; setState('listening'); }
    }
  };
  const end = () => { run.current++; talking.current = false; setNotice(false); setState('ended'); };

  // the preview's story, on the same beats as the site's
  useStory(ref, async ({ wait, press }) => {
    await wait(2100); press('.dm-vor-go');
    await wait(7000); press('.dm-vor-mute');
    await wait(4200); press('.dm-vor-mw .dm-pill');
    await wait(6700); press('.dm-vor-end');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <VoiceOrb state={state} level={level} muted={muted} onMutedChange={m => { setMuted(m); if (!m) setNotice(false); }} mutedNotice={notice}
        caption={caption} hint="Talk to the agent about Pricing v4" elapsed={secs}
        onStart={() => void start()} onEnd={end} onRestart={() => { setMuted(false); void start(); }} />
    </div>
  );
}
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `state` | `VoiceState` |  |
| `level` (optional) | `number` | How loud whoever is talking is, 0 to 1. The orb swells with it. Feed it from your audio, or from a made-up curve |
| `muted` (optional) | `boolean` | Your microphone is off. Listening shows as Muted, and the mute button is pressed |
| `onMutedChange` (optional) | `(muted: boolean) => void` |  |
| `mutedNotice` (optional) | `boolean` | Shows "You're muted" with an Unmute button, for when someone talks while muted |
| `caption` (optional) | `{ speaker: string; text: string; id?: string }` | What was said last and who said it. Each word fades in as it arrives; a new `id` (or speaker) starts a new line |
| `hint` (optional) | `string` | Shown before anything is said, like "Talk to the agent about Pricing v4" |
| `elapsed` (optional) | `number` | Seconds since the chat started, shown top right |
| `onStart` (optional) | `() => void` |  |
| `onEnd` (optional) | `() => void` |  |
| `onRestart` (optional) | `() => void` | Start again, from the row that shows once the chat has ended |
| `endedDetail` (optional) | `string` | The quiet line under "Voice chat ended". Defaults to the length and "Transcript saved" |
| `labels` (optional) | `{ ready?: string; listening?: string; thinking?: string; speaking?: string; muted?: string; ended?: string; start?: string; end?: string; mute?: string; unmute?: string; mutedNotice?: string; endedTitle?: string; restart?: string }` |  |
| `className` (optional) | `string` |  |

## Questions

**Does it use the microphone or play sound?**

No. It draws the `state`, `level` and `caption` you pass. Your code records, transcribes and plays the agent's voice. The demo plays a written script and never asks for the microphone.

**How is it different from Voice capture?**

Voice capture records one message to check and fix before sending. Voice orb is a back-and-forth conversation, with the agent answering out loud.

**How do I drive the orb from real audio?**

Read the loudness from your audio, for example with a Web Audio AnalyserNode, scale it to 0 to 1, and pass it as `level` on each animation frame.

## Source

`VoiceOrb.tsx`, as `npx designme add voice-orb --react` installs it:

```tsx
'use client';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cx } from '../lib/cx';
import { Icon } from '../lib/icons';
import { useReducedMotion } from '../lib/hooks';
import { Fold, Swap, Tip } from '../lib/motion';
import '../designme.css';
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
        <div className="dm-vor-orb" aria-hidden="true" style={{ '--dm-lv': Math.max(0, Math.min(1, level)).toFixed(3) } as CSSProperties}><i className="dm-vor-pc" /><i className="dm-vor-core"><OrbLight level={level} /></i></div>
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
            <button type="button" className="dm-pill dm-primary dm-sm dm-vor-go" onClick={onStart}><Icon name="mic" size="xs" />{L.start}</button>
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
    // the two colours are read a few times a second, not every frame: reading them makes the browser recheck the page's styles
    let cols: [string, string] | null = null, colsAt = -1e9;
    const draw = (ms: number) => { const now = performance.now(); if (!cols || now - colsAt > 250) { cols = [getComputedStyle(dot).backgroundColor, getComputedStyle(pc).backgroundColor]; colsAt = now; } s.paint(ms, lv.current, cols[0], cols[1]); };
    let raf = 0, seen = true, flow = 0, last = 0, dead = false;
    const io = new IntersectionObserver(e => { seen = e[0].isIntersecting; }); io.observe(cv);
    const mo = new MutationObserver(() => setTimeout(() => { if (!dead) { cols = null; draw(flow); } }, 450));
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

// a glossy sphere of slowly flowing light, for Voice orb: soft pools of the two colours drift inside it, bent by a little
// noise and bunched towards the edge as a lens would; a light glows from deep inside, and it is shaded as a ball lit from the
// top left, with a deeper edge, a thin inner rim, a soft sheen and a small highlight. Nothing is drawn outside the circle.
// The louder the level, the more the colours bend and the brighter the inner light. One draw a frame, on a canvas the size
// of the orb. Returns paint(ms, level 0 to 1, colour, second colour) and lose(), or null where WebGL is not available
const FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform float T,L;uniform vec3 A,B;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}
void main(){
  vec2 u=(gl_FragCoord.xy*2.-R)/R.y;float r=length(u),e=3./R.y;
  float a=1.-smoothstep(1.-e,1.,r);
  if(a<=0.){gl_FragColor=vec4(0.);return;}
  float z=sqrt(max(0.,1.-r*r)),t=T*.00016;vec3 N=vec3(u,z);
  vec2 p=u*(.85+.3*(1.-z));
  p+=(vec2(fbm(p*.9+vec2(0.,t)),fbm(p*.9+vec2(5.2,-t*.8)))-.5)*(1.+L);
  vec2 d1=p-vec2(.5*sin(t*1.3),.45*cos(t*1.1)),d2=p-vec2(.55*cos(t*.9+2.),.5*sin(t*1.2+1.)),d3=p-vec2(.35*sin(t*1.7+4.),-.3+.25*cos(t*1.4));
  vec3 c=mix(A,B,.35)*.8;
  c=mix(c,B,exp(-dot(d2,d2)*2.2)*.95);
  c=mix(c,A,exp(-dot(d1,d1)*2.4)*.9);
  c=mix(c,mix(A,vec3(1.),.5),exp(-dot(d3,d3)*3.)*(.4+L*.35));
  float rb=p.y+.28*sin(p.x*2.3+t*2.);
  c=mix(c,mix(B,vec3(1.),.45),exp(-rb*rb*14.)*(.2+L*.25));
  vec3 lt=normalize(vec3(-.4,.55,.75));
  c*=.84+.16*max(dot(N,lt),0.);
  c=mix(c,c*.62,pow(1.-z,2.)*.55);
  c=mix(c,mix(c,vec3(1.),.55),smoothstep(.9,.995,r)*.32);
  float e2=length((u-vec2(-.1,.52))/vec2(.6,.34));
  c=mix(c,vec3(1.),(1.-smoothstep(.5,1.,e2))*.16);
  float s=max(dot(N,normalize(lt+vec3(0.,0.,1.))),0.);
  c+=pow(s,70.)*.3;
  gl_FragColor=vec4(min(c,1.)*a,a);
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
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with its versions, Open, Copy and Download.
- [Rich text editor](https://designme.dev/components/rich-text-editor.md): A minimal editor with an inline AI menu that streams a suggestion to accept or discard.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Prompt library](https://designme.dev/components/prompt-library.md): Saved prompts with blanks to fill in before they go to the agent.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
