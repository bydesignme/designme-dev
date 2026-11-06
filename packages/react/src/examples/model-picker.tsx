'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ModelPicker, type ModelOption } from '../components/model-picker/ModelPicker';
import { useStory, useWait } from './useScript';

/* ---------- Model picker: ask for Opus, find it at capacity, and take a close match on high thinking ---------- */
// the same three models and figures as Model compare: tokens a second, and a typical reply's price with no thinking
const BASE = [
  { id: 'opus', name: 'Opus 5.5', color: 'var(--dm-pl)', note: 'Deepest reasoning, slower', speed: 2, quality: 5, cost: 5, tps: 38, price: .021 },
  { id: 'sonnet', name: 'Sonnet 5.5', color: 'var(--dm-c1)', note: 'Balanced, the default for design work', speed: 4, quality: 4, cost: 2, tps: 74, price: .006 },
  { id: 'haiku', name: 'Haiku 5.5', color: 'var(--dm-pm)', note: 'Fastest, for quick edits', speed: 5, quality: 3, cost: 1, tps: 142, price: .001 }
];

export default function ModelPickerDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [value, setValue] = useState('sonnet');
  const [effort, setEffort] = useState('Medium');
  const [open, setOpen] = useState(true);
  const [opus, setOpus] = useState<{ status?: ModelOption['status']; text?: string }>({});
  // Opus is at capacity for this long, in seconds; 0 once you've waited it out
  const [busy, setBusy] = useState(20);
  const [offer, setOffer] = useState(false);
  const [note, setNote] = useState<string>();

  const set = (id: string, eff = effort) => { setValue(id); setOffer(false); setNote(`Set for this chat: ${BASE.find(m => m.id === id)!.name}, ${eff.toLowerCase()} thinking`); };
  // picking a model checks it can take the request first; a busy one offers a wait, or a close match that starts now
  const pick = async (id: string) => {
    if (id !== 'opus' || !busy) return set(id);
    setNote(undefined); setOpus({ status: 'checking', text: 'Checking it can take this chat' });
    await wait(1000);
    setOpus({ status: 'busy', text: `At capacity, about ${busy}s wait` }); setOffer(true);
  };
  const waitForOpus = async () => {
    setOffer(false);
    for (let w = busy; w > 0; w--) { setOpus({ status: 'busy', text: `Starts in ${w}s` }); await wait(1000); }
    setBusy(0); setOpus({}); set('opus');
  };

  const models: ModelOption[] = BASE.map(x => ({
    id: x.id, name: x.name, color: x.color, note: x.note, speed: x.speed, quality: x.quality, cost: x.cost,
    speedDetail: `${x.tps} tokens a second`, qualityDetail: `Quality ${x.quality} of 5`, costDetail: `$${x.price.toFixed(3)} a reply`,
    ...(x.id === 'opus' ? { status: opus.status, statusText: opus.text } : {})
  }));

  // the preview's story: the person asks for Opus, reads why it can't start, and takes the close match
  useStory(ref, async ({ wait, press }) => {
    await wait(5500); press('.dm-mpk-o');
    await wait(1000 + 2500 + 900); press('.dm-mpk-sga .dm-primary');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <ModelPicker models={models} value={value} onValueChange={id => void pick(id)} effort={effort} onEffortChange={e => { setEffort(e); setNote(undefined); }}
        open={open} onOpenChange={setOpen} note={note}
        suggestion={offer ? {
          text: `Opus 5.5 is at capacity for about ${busy}s. Sonnet 5.5 on high thinking comes close on long reviews and starts now.`,
          actions: [{ label: 'Wait for Opus', onClick: () => void waitForOpus() }, { label: 'Use Sonnet on high', onClick: () => { setEffort('High'); set('sonnet', 'High'); } }]
        } : undefined} />
    </div>
  );
}
