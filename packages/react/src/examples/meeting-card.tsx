'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { MeetingCard, type MeetingCardPerson } from '../components/meeting-card/MeetingCard';
import { useStory } from './useScript';

const PEOPLE: MeetingCardPerson[] = [
  { initials: 'MK', color: 'var(--dm-av-l)', name: 'Maya Kim' }, { initials: 'JO', color: 'var(--dm-av-m)', name: 'Jon Ortiz' },
  { initials: 'AR', color: 'var(--dm-av-p)', name: 'Ari Reyes' }, { initials: 'SL', color: 'var(--dm-av-t)', name: 'Sam Lee' },
  { initials: 'DK', color: 'var(--dm-av-b)', name: 'Dev Kapoor' }, { initials: 'LN', color: 'var(--dm-av-y)', name: 'Lena Novak' }
];
const clock = (m: number) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`;

export default function MeetingCardDemo() {
  const [now, setNow] = useState(620);
  // the countdown, "Starting now", the meeting going by with the gone part hatched, then over; the person in the preview
  // copies the link halfway through, and it plays again
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async ({ wait, press }) => {
    for (;;) {
      setNow(620); await wait(1000);
      for (let m = 621; m <= 630; m++) { await wait(500); setNow(m); }
      await wait(2000);
      for (let m = 633; m <= 651; m += 3) { await wait(600); setNow(m); }
      await wait(1500); press('.dm-mtx-cp'); await wait(1500);
      for (let m = 654; m <= 675; m += 3) { await wait(600); setNow(m); }
      await wait(4500);
    }
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <MeetingCard title="Pricing review" start="10:30" end="11:15" from="10:15" to="11:30" now={clock(now)} people={PEOPLE}
        link="meet.google.com/nax-wqkf-stu" onJoin={() => {}} />
    </div>
  );
}
