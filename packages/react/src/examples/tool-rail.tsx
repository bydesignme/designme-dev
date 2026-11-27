'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { ToolRail, type ToolRailTool } from '../components/tool-rail/ToolRail';
import { Demo } from './Demo';
import { useStory } from './useScript';

/* ---------- Tool rail: try the pen, a sticky note and a comment, then back to Select ---------- */
export default function ToolRailDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [tool, setTool] = useState<ToolRailTool>('select');
  useStory(ref, async ({ wait, press }) => {
    await wait(1000);
    for (const t of ['pen', 'sticky', 'comment', 'select']) { await wait(2000); press(`.dm-tlr-b[data-t="${t}"]`); }
  });
  return <Demo ref={ref} switcher={null}><ToolRail value={tool} onChange={setTool} /></Demo>;
}
