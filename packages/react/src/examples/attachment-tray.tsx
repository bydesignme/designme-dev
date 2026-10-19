'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { AttachmentTray, type Attachment } from '../components/attachment-tray/AttachmentTray';

/* ---------- Attachment tray: dropped or picked files upload one by one; sample files show the flow ---------- */
const SAMPLES: [string, number][] = [['brief.pdf', 2.4e6], ['Pricing.fig', 8.1e6], ['signups.csv', 3.2e5]];

export default function AttachmentTrayDemo() {
  const [files, setFiles] = useState<Attachment[]>([]);
  const timers = useRef<ReturnType<typeof setInterval>[]>([]);
  useEffect(() => () => timers.current.forEach(clearInterval), []);
  // a real app would report upload progress here; the demo fakes it, a little faster or slower each tick
  const add = (list: [string, number][]) => list.forEach(([name, size]) => {
    const id = Math.random().toString(36).slice(2);
    setFiles(fs => [...fs, { id, name, size, progress: 0 }]);
    let p = 0;
    const iv = setInterval(() => {
      p = Math.min(100, p + 4 + Math.random() * 8);
      setFiles(fs => fs.map(f => f.id === id ? { ...f, progress: p } : f));
      if (p >= 100) clearInterval(iv);
    }, 70);
    timers.current.push(iv);
  });
  return (
    <div style={{ width: '100%' }}>
      <AttachmentTray files={files} action={{ label: 'add sample files', onClick: () => add(SAMPLES) }}
        onFiles={fs => add(fs.map(f => [f.name, f.size]))} onRemove={id => setFiles(fs => fs.filter(f => f.id !== id))} />
    </div>
  );
}
