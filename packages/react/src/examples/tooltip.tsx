'use client';
// The tooltip card from designme.dev: a toolbar with shortcut tips and two people with a card each.
import { Tooltip, type TooltipPerson } from '../components/tooltip/Tooltip';

const PEOPLE: TooltipPerson[] = [
  { key: 'mk', initials: 'MK', color: 'var(--dm-pl)', name: 'Maya Kim', role: 'Design lead', status: 'Editing Pricing, frame 2' },
  { key: 'da', initials: 'DA', color: 'var(--dm-pb)', name: 'Design agent', role: 'Working for Maya', status: 'Auditing contrast, 2 of 6 checks', working: true }
];

export default function TooltipDemo() {
  return (
    <div style={{ width: '100%' }}>
      <Tooltip people={PEOPLE} note="Labels wait a moment, then follow you instantly between buttons." />
    </div>
  );
}
