'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { MeetingCard } from '../components/meeting-card/MeetingCard';
import { useStory } from './useScript';

const clock = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

export default function MeetingCardDemo() {
  const [now, setNow] = useState(600);
  // the minutes tick by until the meeting starts, then the person in the preview copies the link, and it plays again
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, press }) => {
    for (;;) {
      setNow(600); await wait(1000);
      for (let m = 601; m <= 630; m++) { await wait(630 - m < 4 ? 450 : 150); setNow(m); }
      await wait(2500); press('.dm-mtx-cp'); await wait(4000);
    }
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <MeetingCard title="Meeting with Product team" start="10:30" end="12:00" now={clock(now)} link="meet.google.com/nax-wqkf-stu" onJoin={() => {}} />
    </div>
  );
}
