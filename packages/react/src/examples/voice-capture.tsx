'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { VoiceCapture, type HeardWord, type VoiceCaptureState } from '../components/voice-capture/VoiceCapture';
import { useScript } from './useScript';

/* ---------- Voice capture: a sentence is heard word by word, two words it was unsure of get a highlight ---------- */
const SENTENCE = 'Move the yearly toggle above the cards and make the save badge say 20% off for annual plans'.split(' ');
const UNSURE: Record<number, string[]> = { 3: ['toggle', 'toddle', 'tunnel'], 10: ['save', 'sale', 'saving'] };

export default function VoiceCaptureDemo() {
  // Record again starts the whole take over, like replaying the card on the site
  const [take, setTake] = useState(0);
  return <Take key={take} onRecordAgain={() => setTake(t => t + 1)} />;
}

function Take({ onRecordAgain }: { onRecordAgain: () => void }) {
  const [words, setWords] = useState<Array<string | HeardWord>>([]);
  const [state, setState] = useState<VoiceCaptureState>('listening');
  const now = useRef(state);
  useEffect(() => { now.current = state; });
  // a stand-in for the microphone: each word makes noise for the next five samples
  const speak = useRef(0);
  const level = () => { if (speak.current <= 0) return 0; speak.current--; return .2 + Math.random() * .8; };

  useScript(async ({ wait }) => {
    await wait(700);
    for (let i = 0; i < SENTENCE.length; i++) {
      while (now.current === 'paused') await wait(100);
      if (now.current !== 'listening') return;
      speak.current = 5;
      const w = SENTENCE[i], alternatives = UNSURE[i];
      setWords(ws => [...ws, alternatives ? { text: w, alternatives } : w]);
      await wait(170 + Math.random() * 150);
    }
    await wait(900);
    if (now.current === 'listening' || now.current === 'paused') setState('review');
  });

  return (
    <div style={{ width: '100%' }}>
      <VoiceCapture words={words} level={level} state={state} onStateChange={setState} onRecordAgain={onRecordAgain} />
    </div>
  );
}
