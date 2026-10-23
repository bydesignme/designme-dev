'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { VoiceOrb, type VoiceState } from '../components/voice-orb/VoiceOrb';
import { useStory, useWait } from './useScript';

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
  mutedNow.current = muted;

  // a made-up level: a voice-like wobble while someone talks, a faint idle while it listens
  useEffect(() => {
    let raf = 0;
    const tick = (t: number) => {
      const to = talking.current ? .5 + .28 * Math.sin(t / 90) * Math.sin(t / 233) + .16 * Math.sin(t / 57) : state === 'listening' && !muted ? .05 + .03 * Math.sin(t / 420) : 0;
      lv.current += (Math.max(0, to) - lv.current) * .18; setLevel(lv.current); raf = requestAnimationFrame(tick);
    };
    if (!matchMedia('(prefers-reduced-motion: reduce)').matches) raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [state, muted]);
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
