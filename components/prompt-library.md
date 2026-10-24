# Prompt library

> Saved prompts with blanks to fill in before they go to the agent.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/prompt-library

## Install

```sh
npx designme add prompt-library          # HTML, CSS and JS, with the shared core
npx designme add prompt-library --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Prompt library keeps a team's saved prompts, each with blanks written like {page}. Opening one lays its blanks out as fields, a text field to type in or a dropdown to pick from, and the prompt above fills in as they change. It can't be used with a blank left empty: the empty blank turns red and says what it needs.

### When to use it

- When a team asks the agent the same kinds of things and wants them worded the same way each time.
- When a prompt only changes in a few places, like the page or the tone.
- When some blanks have a short list of right answers, and a dropdown keeps them consistent.
- When people should see the exact prompt the agent will get before it goes.

### What it does

- `prompts` each have a `title` and a `template` with blanks written as `{key}`. The list shows each template, blanks in braces, and how many blanks it has.
- `blanks` describe each one: a `label`, and either a `placeholder` for a text field or `options` for a dropdown that starts on the first.
- The prompt at the top fills in as the fields change: filled blanks in the accent colour, empty ones by name.
- Use prompt checks every blank first. An empty one is outlined in red in the prompt and in its field, with its `error` underneath.
- `onUse` gets the filled prompt, the prompt it came from and every value. The footer then says it was added, with Undo.
- `open` / `onOpenChange` and `values` / `onValuesChange` let you drive which prompt is open and what is filled in.

### Accessibility

- Each prompt in the list is a button, and the back button is labelled "All prompts".
- Text blanks are labelled inputs. An empty one marked by Use prompt sets `aria-invalid` and is described by its error.
- Dropdown blanks are buttons named by their label and current value. Each choice is a menu item that marks the picked one with `aria-checked`, and Escape closes the menu.
- The filled prompt is an `aria-live="polite"` region, so changes to it are read out.

## Usage in React

```tsx
import { PromptLibrary } from '@/components/designme/prompt-library/PromptLibrary';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { PromptLibrary, type PromptBlank, type SavedPrompt } from './PromptLibrary';
import { useStory } from '../lib/useScript';

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
  useStory(ref, async ({ wait, press, taken }) => {
    await wait(2100); press('[data-prompt="rewrite"]');
    await wait(2100); press('.dm-plb-use');
    await wait(2500);
    // taking over while it types takes the letters back
    let typing = true;
    taken(() => { if (typing) setValues(v => ({ ...v, section: '' })); });
    for (let k = 1; k <= 14; k++) { setValues(v => ({ ...v, section: 'the plan cards'.slice(0, k) })); await wait(70); }
    typing = false;
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
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `prompts` | `SavedPrompt[]` |  |
| `title` (optional) | `string` |  |
| `subtitle` (optional) | `string` | The line under the title, like "Shared with DesignMe Studio" |
| `open` (optional) | `string \| null` | The open prompt's id, or null for the list |
| `defaultOpen` (optional) | `string \| null` |  |
| `onOpenChange` (optional) | `(id: string \| null) => void` |  |
| `values` (optional) | `Record<string, string>` | The open prompt's blanks, by key. A picked blank left out starts on its first option |
| `defaultValues` (optional) | `Record<string, string>` |  |
| `onValuesChange` (optional) | `(values: Record<string, string>) => void` |  |
| `onUse` (optional) | `(text: string, prompt: SavedPrompt, values: Record<string, string>) => void` | Gets the filled prompt once every blank has a value |
| `onUndo` (optional) | `() => void` |  |
| `labels` (optional) | `{ back?: string; note?: string; use?: string; usedTitle?: string; usedDetail?: string; undo?: string; blank?: string; blanks?: string }` |  |
| `className` (optional) | `string` |  |

## Questions

**Does it send the prompt to the agent?**

No. `onUse` gets the filled text. Put it in your composer, send it, or both.

**How is it different from Prompt starters?**

Prompt starters are one-click suggestions that fill the composer as they are. Prompt library is for saved prompts with blanks that change each time, filled in before they are used.

**Can a blank appear more than once in a prompt?**

Yes. Write the same `{key}` in each place. It has one field, and every place it appears fills in from it.

## Source

`PromptLibrary.tsx`, as `npx designme add prompt-library --react` installs it:

```tsx
'use client';
import { useId, useState } from 'react';
import { cx } from '../lib/cx';
import { useControllable } from '../lib/hooks';
import { Icon } from '../lib/icons';
import { Swap } from '../lib/motion';
import { usePopover } from '../lib/popover';
import '../designme.css';
import './prompt-library.css';

export interface PromptBlank {
  /** The field's label, like "Section". Lowercased, it also stands in the prompt while the blank is empty */
  label: string;
  /** For a typed blank: the hint in the empty field */
  placeholder?: string;
  /** For a picked blank: the choices, in a dropdown that starts on the first */
  options?: string[];
  /** What the field says when the prompt is used with it empty. Defaults to "Fill in the <label>" */
  error?: string;
}

export interface SavedPrompt {
  id: string;
  title: string;
  /** The prompt, with each blank written as {key}, like "Rewrite {section} on {page}" */
  template: string;
  blanks: Record<string, PromptBlank>;
}

export interface PromptLibraryProps {
  prompts: SavedPrompt[];
  title?: string;
  /** The line under the title, like "Shared with DesignMe Studio" */
  subtitle?: string;
  /** The open prompt's id, or null for the list */
  open?: string | null;
  defaultOpen?: string | null;
  onOpenChange?: (id: string | null) => void;
  /** The open prompt's blanks, by key. A picked blank left out starts on its first option */
  values?: Record<string, string>;
  defaultValues?: Record<string, string>;
  onValuesChange?: (values: Record<string, string>) => void;
  /** Gets the filled prompt once every blank has a value */
  onUse?: (text: string, prompt: SavedPrompt, values: Record<string, string>) => void;
  onUndo?: () => void;
  labels?: { back?: string; note?: string; use?: string; usedTitle?: string; usedDetail?: string; undo?: string; blank?: string; blanks?: string };
  className?: string;
}

const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const parts = (t: string) => t.split(/(\{\w+\})/).map(p => /^\{\w+\}$/.test(p) ? { key: p.slice(1, -1) } : p);
/** Every blank's value: what was typed or picked, or a picked blank's first option */
const filled = (p: SavedPrompt, values: Record<string, string>) => Object.fromEntries(Object.entries(p.blanks).map(([k, b]) => [k, values[k] ?? b.options?.[0] ?? '']));

function Pick({ id, blank, value, wide, onChange }: { id: string; blank: PromptBlank; value: string; wide?: boolean; onChange: (v: string) => void }) {
  // the blanks sit at the foot of the card, so their lists open upward over the prompt instead of past the footer
  const menu = usePopover({ side: 'up' });
  return (
    <div className={cx('dm-plb-fd', wide && 'dm-wide')}>
      <span id={id + '-l'}>{blank.label}</span>
      <button type="button" className="dm-plb-sel" aria-labelledby={`${id}-l ${id}-v`} {...menu.trigger}><Swap className="dm-v">{cap(value)}</Swap><Icon name="chev-d" size="xs" /></button>
      <div {...menu.pop} className={cx(menu.pop.className, 'dm-plb-pop')} role="menu" aria-label={blank.label}>
        {blank.options!.map(o => (
          <button type="button" key={o} className="dm-mi" role="menuitemradio" aria-checked={o === value} onClick={() => { onChange(o); menu.closeSoon(); }}>
            <span>{cap(o)}</span><span className="dm-ck"><Icon name="check" size="xs" /></span>
          </button>
        ))}
      </div>
      <span id={id + '-v'} hidden>{cap(value)}</span>
    </div>
  );
}

/** The studio's saved prompts, each with blanks like {page}. Opening one lays its blanks out as fields, the prompt fills
    in as they change, and it can't be used until every blank has a value. */
export function PromptLibrary({
  prompts, title = 'Prompt library', subtitle, open, defaultOpen = null, onOpenChange, values, defaultValues = {}, onValuesChange, onUse, onUndo, labels = {}, className
}: PromptLibraryProps) {
  const [cur, setCur] = useControllable(open, defaultOpen, onOpenChange);
  const [vals, setVals] = useControllable(values, defaultValues, onValuesChange);
  const [tried, setTried] = useState(false);
  const [used, setUsed] = useState(false);
  const uid = useId();
  const L = { back: 'All prompts', note: 'Fills in as you go', use: 'Use prompt', usedTitle: 'Added to your message', usedDetail: 'Ready to send to the agent', undo: 'Undo', blank: 'blank', blanks: 'blanks', ...labels };
  const count = (p: SavedPrompt) => { const n = Object.keys(p.blanks).length; return `${n} ${n === 1 ? L.blank : L.blanks}`; };
  const p = prompts.find(x => x.id === cur);
  const go = (id: string | null) => { setCur(id); setVals({}); setTried(false); setUsed(false); };

  if (!p) return (
    <div data-dm="" className={className} style={{ width: '100%' }}>
      <div className="dm-plb dm-panel"><div className="dm-plb-list dm-enter">
        <div className="dm-plb-h"><div className="dm-plb-ht"><b>{title}</b>{subtitle && <span className="dm-muted">{subtitle}</span>}</div></div>
        <div className="dm-plb-rows">
          {prompts.map(x => (
            <button type="button" key={x.id} className="dm-plb-row" data-prompt={x.id} onClick={() => go(x.id)}>
              <span className="dm-plb-ic"><Icon name="file-text" /></span>
              <span className="dm-plb-rt"><b>{x.title}</b><span>{x.template}</span></span>
              <span className="dm-plb-n">{count(x)}</span><Icon name="chev-r" size="xs" />
            </button>
          ))}
        </div>
      </div></div>
    </div>
  );

  const all = filled(p, vals);
  const empty = Object.keys(p.blanks).filter(k => !all[k].trim());
  const keys = Object.keys(p.blanks), typed = keys.filter(k => !p.blanks[k].options), picked = keys.filter(k => p.blanks[k].options);
  const set = (k: string, v: string) => setVals({ ...vals, [k]: v });
  const use = () => {
    if (empty.length) { setTried(true); return; }
    setUsed(true); onUse?.(p.template.replace(/\{(\w+)\}/g, (m, k: string) => all[k] ?? m), p, all);
  };

  return (
    <div data-dm="" className={className} style={{ width: '100%' }}>
      <div className="dm-plb dm-panel">
        <div className={cx('dm-plb-one dm-enter', used && 'dm-used')}>
          <div className="dm-plb-h">
            <button type="button" className="dm-ib dm-plb-back" aria-label={L.back} onClick={() => go(null)}><Icon name="chev-l" /></button>
            <div className="dm-plb-ht"><b>{p.title}</b><span className="dm-muted">{count(p)}</span></div>
          </div>
          <p className="dm-plb-tp" aria-live="polite">
            {/* the prompt as it reads now: filled blanks in the accent colour, empty ones by name, and red once they were needed */}
            {parts(p.template).map((q, i) => typeof q === 'string' ? q
              : <span key={i} className={cx('dm-plb-s', !all[q.key]?.trim() && 'dm-empty', tried && !all[q.key]?.trim() && 'dm-bad')}>{all[q.key]?.trim() || p.blanks[q.key].label.toLowerCase()}</span>)}
          </p>
          <div className="dm-plb-vars" inert={used}>
            {typed.map(k => {
              const b = p.blanks[k], bad = tried && !all[k].trim(), id = `${uid}-${k}`;
              return (
                <label key={k} className={cx('dm-plb-fd dm-wide', bad && 'dm-bad')} data-k={k}>
                  <span>{b.label}</span>
                  <input className="dm-plb-in" value={vals[k] ?? ''} placeholder={b.placeholder} aria-invalid={bad} aria-describedby={id + '-e'} onChange={e => set(k, e.target.value)} />
                  <span className="dm-plb-er" id={id + '-e'} hidden={!bad}>{bad ? b.error ?? `Fill in the ${b.label.toLowerCase()}` : ''}</span>
                </label>
              );
            })}
            {/* picked blanks sit two to a row, and an odd one out takes the row */}
            {picked.map((k, i) => <Pick key={k} id={`${uid}-${k}`} blank={p.blanks[k]} value={all[k]} wide={picked.length % 2 === 1 && i === picked.length - 1} onChange={v => set(k, v)} />)}
          </div>
          {used ? (
            <div className="dm-plb-done dm-enter">
              <Icon name="ok" />
              <span className="dm-t">{L.usedTitle}<span className="dm-muted">{L.usedDetail}</span></span>
              <button type="button" className="dm-pill dm-sm" onClick={() => { setUsed(false); onUndo?.(); }}>{L.undo}</button>
            </div>
          ) : (
            <div className="dm-plb-f"><span className="dm-muted dm-plb-note">{L.note}</span><span className="dm-sp" /><button type="button" className="dm-pill dm-ink dm-sm dm-plb-use" onClick={use}>{L.use}</button></div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with its versions, Open, Copy and Download.
- [Rich text editor](https://designme.dev/components/rich-text-editor.md): A minimal editor with an inline AI menu that streams a suggestion to accept or discard.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Voice orb](https://designme.dev/components/voice-orb.md): A hands-free voice chat, with an orb that shows who is talking.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
