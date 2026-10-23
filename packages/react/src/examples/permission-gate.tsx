'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useEffect, useRef, useState } from 'react';
import { PermissionGate, type PermissionScope, type PermissionStatus } from '../components/permission-gate/PermissionGate';
import { Icon } from '../lib/icons';
import { useStory, useWait } from './useScript';

/* ---------- Permission gate: hold back the risky scope, allow the rest, and grant it when the agent needs it for one frame ---------- */
const FIRST: PermissionScope[] = [
  { key: 'read', label: 'Read frames', detail: 'Pricing, Checkout' },
  { key: 'edit', label: 'Edit frames', detail: 'Only on a new page' },
  { key: 'publish', label: 'Publish library', detail: 'Affects 4 other files', risk: 'Risky', riskDetail: 'Checkout, Marketing site, Email kit and Docs use this library' }
];
const MORE: PermissionScope[] = [{ key: 'publish', label: 'Publish library', detail: 'Updates Checkout, Marketing site, Email kit and Docs', risk: 'Risky' }];
// the frames the agent edits once it may. Plan toggle is a library component, so editing it needs Publish library
const FRAMES = ['Hero', 'Plan cards', 'Compare table', 'FAQ', 'Plan toggle', 'Checkout summary'], LIB = 4;
const clock = (ms: number) => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

export default function PermissionGateDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [more, setMore] = useState(false);
  const [value, setValue] = useState(['read', 'edit']);
  const [duration, setDuration] = useState('This task');
  const [status, setStatus] = useState<PermissionStatus>('asking');
  const [working, setWorking] = useState(false);
  const [title, setTitle] = useState<string>();
  const [detail, setDetail] = useState<string>();
  const run = useRef({ granted: 0, publish: false, skip: false, done: 0, id: 0 });
  // the clock counts the agent's working time only, not the time it waits for you
  const [ms, setMs] = useState(0);
  useEffect(() => {
    if (!working) return;
    const from = performance.now() - ms, t = setInterval(() => setMs(performance.now() - from), 250);
    return () => clearInterval(t);
  }, [working]); // eslint-disable-line react-hooks/exhaustive-deps

  // the agent works through the frames under what it was given, and stops to ask when it reaches one it may not touch
  const work = async () => {
    const r = run.current, id = ++r.id;
    setStatus('allowed'); setWorking(true); setTitle(undefined);
    while (r.done < FRAMES.length) {
      if (r.done === LIB && !r.publish && !r.skip) { setWorking(false); setMore(true); setValue(['publish']); setStatus('asking'); return; }
      setDetail(r.done === LIB && r.skip ? `Skipping ${FRAMES[r.done]}` : `Editing ${FRAMES[r.done]} · ${r.done + 1} of ${FRAMES.length}`);
      await wait(900); if (r.id !== id) return;
      r.done++;
    }
    setWorking(false);
    setTitle(`Done. ${r.skip ? FRAMES.length - 1 : FRAMES.length} frames edited on a new page`);
    setDetail(r.skip ? 'Plan toggle skipped, it needs Publish library' : 'Plan toggle published to the library');
  };

  // the preview's story: the person ticks the risky scope, reads what it touches, leaves it off, allows, then grants it for one frame
  useStory(ref, async ({ wait, press }) => {
    await wait(1500); setValue(['read', 'edit', 'publish']);
    await wait(2500); setValue(['read', 'edit']);
    await wait(1000); press('.dm-pgx-ok');
    await wait(500 + 4 * 900 + 2000); press('.dm-pgx-ok');
  });

  const r = run.current;
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <PermissionGate icon={<Icon name="figma" />}
        title={more ? 'Also allow Publish library?' : 'Allow the agent to edit Figma?'}
        subtitle={more ? `${FRAMES[LIB]}, frame ${LIB + 1} of ${FRAMES.length}, is a library component` : 'It needs this to apply the pricing fixes'}
        scopes={more ? MORE : FIRST} value={value} onValueChange={setValue} duration={duration} onDurationChange={setDuration}
        status={status} onStatusChange={setStatus} followUp={more} declineLabel={more ? 'Skip this frame' : 'Not now'}
        onAllow={async keys => { r.granted += keys.length; if (keys.includes('publish')) r.publish = true; await wait(500); setMore(false); void work(); }}
        onDecline={() => { if (!more) return; r.skip = true; setMore(false); void work(); }}
        onRevoke={() => { run.current = { granted: 0, publish: false, skip: false, done: 0, id: r.id + 1 }; setValue(['read', 'edit']); setMs(0); setWorking(false); }}
        working={working} meta={clock(ms)} allowedDetail={detail}
        allowedTitle={title ?? `Allowed ${r.granted} ${r.granted > 1 ? 'scopes' : 'scope'} for ${duration.toLowerCase()}`}
        declinedTitle="The agent will skip the Figma edits" declinedDetail="It will list the fixes in chat instead" />
    </div>
  );
}
