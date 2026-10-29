'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { useStory } from './useScript';
import { AttachmentTray, type Attachment } from '../components/attachment-tray/AttachmentTray';

/* ---------- Attachment tray: dropped or picked files upload one by one; sample files show the flow ---------- */
const SAMPLES: [string, number, string?][] = [['brief.pdf', 2.4e6, '12 pages'], ['Pricing.fig', 8.1e6, '6 frames'], ['signups.csv', 3.2e5, '1,204 rows']];

export default function AttachmentTrayDemo() {
  const [files, setFiles] = useState<Attachment[]>([]);
  const [dragging, setDragging] = useState(false);
  const count = useRef(0);
  count.current = files.length;
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  useEffect(() => () => timers.current.forEach(t => { clearInterval(t); clearTimeout(t); }), []);
  // a real app would report upload progress here; the demo fakes it, a little faster or slower each tick
  const add = (list: [string, number, string?][]) => list.forEach(([name, size, detail]) => {
    const id = Math.random().toString(36).slice(2);
    setFiles(fs => [...fs, { id, name, size, progress: 0 }]);
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + 2.5 + Math.random() * 5);
      setFiles(fs => fs.map(f => f.id === id ? { ...f, progress: p, reading: p >= 100 } : f));
      if (p < 100) return;
      clearInterval(iv);
      // once it is up, the agent reads it and says what it found
      timers.current.push(setTimeout(() => setFiles(fs => fs.map(f => f.id === id ? { ...f, reading: false, detail } : f)), 900));
    }, 70);
    timers.current.push(iv);
  });
  // once it has entered, three sample files drop in and upload, unless files are already there or you have taken over
  const ref = useRef<HTMLDivElement>(null);
  useStory(ref, async s => {
    await s.wait(950); if (count.current) return;
    setDragging(true); s.taken(() => setDragging(false)); await s.wait(1300); setDragging(false);
    if (!count.current) add(SAMPLES);
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <AttachmentTray files={files} dragging={dragging} action={{ label: 'add sample files', onClick: () => add(SAMPLES) }}
        onFiles={fs => add(fs.map(f => [f.name, f.size]))} onRemove={id => setFiles(fs => fs.filter(f => f.id !== id))} />
    </div>
  );
}
