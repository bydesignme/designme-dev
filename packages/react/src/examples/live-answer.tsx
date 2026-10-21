'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useCallback, useEffect, useState } from 'react';
import { useWait } from './useScript';
import { LiveAnswer, type AnswerSource, type AnswerTurn } from '../components/live-answer/LiveAnswer';

/* ---------- Live answer: it thinks, streams a cited answer, then offers follow-ups that add turns ---------- */
const FIRST = 'Where are people dropping off in onboarding?';
const ANSWERS: Record<string, string> = {
  [FIRST]: 'Most people leave at the workspace step [1]. It asks for a team name before anyone has made anything, and five of eight people in interviews paused there [2]. Moving it after the first project, and filling the name from the email domain, should help [3].',
  'Show the drop-off by device': 'On mobile the workspace step loses 41% [1], on desktop 23% [1]. Most of the mobile drop comes from the keyboard covering the Continue button [3].',
  'Draft a fix for the workspace step': 'Ask for the team name after the first project, and fill it from the email domain so most people never type it [2]. On mobile, keep Continue above the keyboard [3], then compare the step again after a week [1].'
};
const THOUGHTS = ['Read the funnel for the last 30 days', 'Matched the drop to the interview notes', 'Checked step 2 in Onboarding.fig'];
const SOURCES: AnswerSource[] = [
  { n: 1, mark: 'F', color: '#7a5af8', title: 'Funnel data', detail: 'Amplitude, last 30 days', tip: 'Funnel data, last 30 days' },
  { n: 2, mark: 'N', color: '#0ea5a4', title: 'Session notes', detail: 'Notion, 8 interviews', tip: 'Session notes from 8 interviews' },
  { n: 3, mark: 'S', color: '#f97316', title: 'Onboarding.fig', detail: 'Figma, step 2', tip: 'Onboarding.fig, step 2' }
];

export default function LiveAnswerDemo() {
  const [turns, setTurns] = useState<AnswerTurn[]>([{ key: 0, question: FIRST, state: 'waiting' }]);
  const [asked, setAsked] = useState(false);
  const wait = useWait();

  // streams the answer to question q into turn i, one word at a time
  const answer = useCallback(async (i: number, q: string) => {
    const set = (patch: Partial<AnswerTurn>) => setTurns(ts => ts.map((t, k) => k === i ? { ...t, ...patch } : t));
    set({ state: 'thinking', text: '' });
    await wait(1300);
    set({ state: 'answering', thoughts: THOUGHTS, thoughtFor: 2 });
    let text = '';
    for (const tok of ANSWERS[q].split(' ')) {
      text += (text ? ' ' : '') + tok; set({ text });
      await wait(55 + Math.random() * 45);
    }
    set({ state: 'done', sources: SOURCES });
  }, [wait]);

  useEffect(() => { answer(0, FIRST); }, [answer]);

  const ask = async (q: string) => {
    const i = turns.length;
    setAsked(true);
    setTurns(ts => [...ts, { key: i, question: q, state: 'waiting' }]);
    await wait(450); await answer(i, q);
  };
  const retry = (i: number) => { if (turns[i].state === 'done') answer(i, turns[i].question); };

  return (
    // keeps the room the first answer fills with its sources and follow-ups, so nothing climbs when they arrive
    <div style={{ width: '100%', minHeight: 376 }}>
      <LiveAnswer turns={turns} followUps={asked ? undefined : ['Show the drop-off by device', 'Draft a fix for the workspace step']} onFollowUp={ask} onRetry={retry} />
    </div>
  );
}
