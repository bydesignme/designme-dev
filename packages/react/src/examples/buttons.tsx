'use client';
// The button sheet from designme.dev, rebuilt from the React buttons. Each one shows a state you drive yourself:
// a promise for busy and done, a toggle, a menu that reports back, a run you can stop, a hold to confirm.
import { useEffect, useRef, useState } from 'react';
import { useWait } from './useScript';
import { Button, ButtonCopy, ButtonHold, ButtonIcon, ButtonMenu, ButtonRun, Buttons, type ButtonRunState } from '../components/buttons/Buttons';

const LINK = 'https://designme.dev/p/pricing';

export default function ButtonsDemo() {
  const wait = useWait();
  const [preview, setPreview] = useState(false);

  // Run agent counts while it runs and finishes after 3.2s; clicking it while it runs stops it
  const [run, setRun] = useState<ButtonRunState>('idle');
  const [secs, setSecs] = useState(0);
  useEffect(() => {
    if (run !== 'running') return;
    const tick = setInterval(() => setSecs(s => s + 1), 1000), done = setTimeout(() => setRun('complete'), 3200);
    return () => { clearInterval(tick); clearTimeout(done); };
  }, [run]);
  useEffect(() => {
    if (run !== 'complete' && run !== 'stopped') return;
    const t = setTimeout(() => setRun('idle'), run === 'complete' ? 1800 : 1200);
    return () => clearTimeout(t);
  }, [run]);

  // Share says what happened, then goes back to its label
  const [share, setShare] = useState<{ label: string; busy?: boolean } | null>(null);
  const shareT = useRef<ReturnType<typeof setTimeout>>(undefined);
  useEffect(() => () => clearTimeout(shareT.current), []);
  const said = (label: string) => { setShare({ label }); clearTimeout(shareT.current); shareT.current = setTimeout(() => setShare(null), 1600); };
  const pick = (key: string) => {
    if (key === 'link') { try { navigator.clipboard?.writeText(LINK).catch(() => {}); } catch { /* no clipboard here */ } said('Link copied'); }
    else if (key === 'slack') said('Sent to #design');
    else { clearTimeout(shareT.current); setShare({ label: 'Exporting', busy: true }); shareT.current = setTimeout(() => said('PDF ready'), 1100); }
  };

  return (
    <Buttons rows={[
      { label: 'Styles', children: <>
        <Button variant="accent" className="dm-btx-trial" busyLabel="Starting" doneLabel="Trial started" onClick={() => wait(1100)}>Start free trial</Button>
        <ButtonRun state={run} seconds={secs} onRun={() => { setSecs(0); setRun('running'); }} onStop={() => setRun('stopped')} />
        <Button variant="soft" className="dm-btx-pv" pressed={preview} onClick={() => setPreview(p => !p)}>{preview ? <><span className="dm-btx-live" />Previewing</> : 'Preview'}</Button>
        <ButtonMenu label="Share" className="dm-btx-share" status={share} onSelect={pick} items={[
          { key: 'link', icon: 'link', label: 'Copy link' },
          { key: 'slack', brand: 'slack', label: 'Send to Slack', detail: '#design' },
          { key: 'pdf', icon: 'down', label: 'Export as PDF' }
        ]} />
        <Button variant="ghost">Cancel</Button>
      </> },
      { label: 'With icon', children: <>
        <Button variant="accent" className="dm-btx-ask" icon="spark" busyGlyph="think" busyLabel="Agent is working" doneLabel="Draft ready" fadeBack={false} onClick={() => wait(2200)}>Ask agent</Button>
        <Button variant="soft" icon="figma">Open in Figma</Button>
        <ButtonCopy text={LINK} className="dm-btx-icp" />
        <ButtonIcon icon="more" label="More" />
      </> },
      { label: 'States', children: <>
        <Button variant="ink" className="dm-btx-load" success fadeBack={false} busyLabel="Publishing" doneLabel="Published" onClick={() => wait(1300)}>Publish</Button>
        <ButtonCopy text={LINK} label="Copy link" />
        <ButtonHold />
        <Button variant="accent" disabled>Disabled</Button>
      </> },
      { label: 'Sizes', children: <>
        <Button variant="accent" size="sm">Small</Button>
        <Button variant="accent">Default</Button>
        <Button variant="accent" size="lg">Large</Button>
      </> }
    ]} />
  );
}
