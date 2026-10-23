'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { PromptLibrary, type PromptBlank, type SavedPrompt } from '../components/prompt-library/PromptLibrary';
import { useStory } from './useScript';

/* ---------- Prompt library: open a prompt, try to use it with a blank empty, fill it in, pick a tone, then use it ---------- */
const PAGE: PromptBlank = { label: 'Page', options: ['Pricing v4', 'Home', 'Checkout'] };
const PROMPTS: SavedPrompt[] = [
  { id: 'rewrite', title: 'Rewrite a section', template: 'Rewrite {section} on {page} so it reads {tone}.', blanks: {
    section: { label: 'Section', placeholder: 'Like the plan cards', error: 'Say which section to rewrite' }, page: PAGE, tone: { label: 'Tone', options: ['clearer', 'friendlier', 'shorter'] } } },
  { id: 'feedback', title: 'Summarize feedback', template: 'Summarize the comments on {page} into three fixes.', blanks: { page: PAGE } },
  { id: 'tokens', title: 'Check the tokens', template: 'Check {page} against the {library} tokens and list what drifts.', blanks: { page: PAGE, library: { label: 'Library', options: ['Studio UI', 'Marketing'] } } },
  { id: 'notes', title: 'Write release notes', template: "Write release notes for {version} in the studio's voice.", blanks: { version: { label: 'Version', placeholder: 'Like Pricing v4', error: 'Say which version they are for' } } }
];

export default function PromptLibraryDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<string | null>(null);
  const [values, setValues] = useState<Record<string, string>>({});

  // the preview's story, on the same beats as the site's
  useStory(ref, async ({ wait, press }) => {
    await wait(2100); press('[data-prompt="rewrite"]');
    await wait(2100); press('.dm-plb-use');
    await wait(2500);
    for (let k = 1; k <= 14; k++) { setValues(v => ({ ...v, section: 'the plan cards'.slice(0, k) })); await wait(70); }
    await wait(1600); press('.dm-plb-fd:nth-child(3) .dm-plb-sel');
    await wait(1600); press('.dm-plb-pop.dm-open .dm-mi:nth-child(2)');
    await wait(2100); press('.dm-plb-use');
  });

  return (
    <div ref={ref} style={{ width: '100%' }}>
      <PromptLibrary prompts={PROMPTS} subtitle="Shared with DesignMe Studio" open={open} onOpenChange={setOpen} values={values} onValuesChange={setValues} />
    </div>
  );
}
