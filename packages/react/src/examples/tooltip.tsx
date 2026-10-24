'use client';
// The tooltip card from designme.dev: a toolbar with shortcut tips and two people with a card each.
import { useRef, useState } from 'react';
import { useScript, useTakeover } from './useScript';
import { Tooltip, type TooltipPerson } from '../components/tooltip/Tooltip';

const PEOPLE: TooltipPerson[] = [
  { key: 'mk', initials: 'MK', color: 'var(--dm-pl)', name: 'Maya Kim', role: 'Design lead', status: 'Editing Pricing, frame 2' },
  { key: 'da', initials: 'DA', color: 'var(--dm-pb)', name: 'Design agent', role: 'Working for Maya', status: 'Auditing contrast, 2 of 6 checks', working: true }
];

export default function TooltipDemo() {
  const [tip, setTip] = useState<string | null>();
  const [card, setCard] = useState<string | null>();
  // once it has appeared it shows what it does: a shortcut tip, then the agent's card. Pointing at it takes over
  // pointing at it takes over, as does clicking, focusing or typing in it
  const touched = useRef(false), ref = useRef<HTMLDivElement>(null), mine = useTakeover(ref, () => setTip(undefined));
  const yours = () => touched.current || mine();
  useScript(async ({ wait }) => {
    await wait(1300); if (yours()) return;
    setTip('ask'); await wait(1700); setTip(undefined); if (yours()) return;
    await wait(500); if (yours()) return;
    setCard('da'); await wait(2600); setCard(null);
  });
  return (
    <div ref={ref} style={{ width: '100%' }} onPointerEnter={() => { touched.current = true; setTip(undefined); }}>
      <Tooltip people={PEOPLE} openTip={tip} openCard={card} note="Labels wait a moment, then follow you instantly between buttons." />
    </div>
  );
}
