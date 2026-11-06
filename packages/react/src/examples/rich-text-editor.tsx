'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { RichTextEditor, type RichTextEditorHandle } from '../components/rich-text-editor/RichTextEditor';
import { useStory } from './useScript';

/* ---------- Rich text editor: a heading and a short draft about the pricing launch, then the last sentence is made shorter
   by the AI, streamed in and accepted ---------- */
const DRAFT = 'New pricing goes live on March 3. Starter teams get two more seats for free, and every plan now includes the agent. We know pricing changes can feel like a lot, so we want to make sure everyone has plenty of time to look at the new plans and ask us questions before anything changes.';
const LAST = DRAFT.slice(DRAFT.indexOf('We know'));

export default function RichTextEditorDemo() {
  const ref = useRef<HTMLDivElement>(null), editor = useRef<RichTextEditorHandle>(null);
  const [html, setHtml] = useState('');
  // the preview's story: the person types a heading and the draft, selects the last sentence, asks the AI to make it shorter
  // and accepts the suggestion. Your first click or key stops it, and the editor is yours from wherever it got to
  useStory(ref, async ({ wait, press }) => {
    const type = async (text: string) => { for (const w of text.match(/\S+\s*/g) || []) { editor.current?.type(w); await wait(120); } };
    await wait(1500); editor.current?.format('h2');
    await type('Pricing launch'); await wait(500);
    editor.current?.newLine(); await wait(250);
    await type(DRAFT); await wait(1500);
    editor.current?.select(LAST); await wait(1000);
    press('.dm-rte-ask'); await wait(1000);
    editor.current?.ask('shorter'); await wait(5000);
    editor.current?.accept();
  });
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <RichTextEditor ref={editor} value={html} onValueChange={setHtml} />
    </div>
  );
}
