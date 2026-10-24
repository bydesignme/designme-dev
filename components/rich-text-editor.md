# Rich text editor

> A minimal editor with an inline AI menu that streams a suggestion to accept or discard.

Agent components / Conversation. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: https://designme.dev/components/rich-text-editor

## Install

```sh
npx designme add rich-text-editor          # HTML, CSS and JS, with the shared core
npx designme add rich-text-editor --react  # React 19 component and its CSS
```

The CLI copies the source into your project, so you own it and can change anything.

## About

Rich text editor is a small editor for drafts an agent helps write. It has a compact toolbar for a heading, bold, italic, inline code, links, lists and quotes, a quiet word count, and undo and redo. Select some text and ask the AI to improve it, shorten it or fix its grammar, or to continue writing, and the suggestion streams in beside your text, with the old words struck through, for you to accept or discard.

### When to use it

- When people write something an agent can improve, like an announcement, a reply or a brief, and should stay in charge of every change.
- When the agent's suggestion should be read in place, next to the words it replaces, before anything is kept.
- When a few formats are enough and a full document editor would be too much.
- Not for long documents with tables, images or comments: use a full document editor then.

### What it does

- The toolbar formats the selection, or the lines it touches: Heading, Bold, Italic, Inline code, Link, Bulleted list, Numbered list and Quote. A button shows as pressed when the selection has that format. Pressing a format the selection already has takes it off; Link opens a field for the address, with Remove link when there is one.
- Shortcuts, with Ctrl in place of ⌘ on Windows and Linux: ⌘B bold, ⌘I italic, ⌘E inline code, ⌘K link, ⌘⌥1 heading, ⌘⌥0 plain text, ⌘⇧8 bullets, ⌘⇧7 numbers, ⌘⇧9 quote, ⌘J the AI menu, ⌘Z undo, and ⇧⌘Z or Ctrl+Y redo. With nothing selected, bold, italic and code apply to what you type next, and the line formats to the caret's line.
- Enter starts a new line: a list or a quote carries on, and a heading is followed by plain text. Enter on an empty list item leaves the list, and Backspace at the start of a heading, list item or quote line turns it into plain text before joining it to the line above.
- Paste keeps paragraphs, one heading level, lists, quotes, bold, italic, inline code and links to http, https or mailto addresses, and drops everything else, including scripts, images and styles. Bold and italic set with styles, as Google Docs does, are kept. Without HTML, each line of plain text becomes a paragraph, and a drop goes in as plain text.
- Undo and redo step through the editor's own history: typing becomes one step when it pauses, and each format, paste and accepted suggestion is a step of its own.
- The AI menu opens from Ask AI in the toolbar, ⌘J, the small Ask AI button over a selection, or / typed at the start of a line. Improve writing, Make shorter and Fix grammar act on the selection, or on the paragraph the caret is in; Continue writing writes on after it. `aiActions` changes the menu, and an action with `kind: 'add'` writes on instead of replacing.
- `ai` writes the suggestion: return a string, a promise of one, or an async iterable of chunks to stream it in as your model answers. It gets the action, the text, the text before and after it, the whole document and an abort signal. By default a demo streams canned text, and `ai={false}` hides the AI.
- While a suggestion is on screen the text can't be edited. Accept, Tab or Enter keeps it once it has finished, as plain text; Discard, Escape or ⌘Z leaves the text as it was. `onSuggestion` reports which.
- `value`, `defaultValue` and `onValueChange` hold the text as HTML in those few tags. The editor keeps one height and scrolls inside, so it doesn't move the page as you write. A ref can type, select, format, run an AI action, accept and discard, which is how the preview's story drives it.

### Accessibility

- The text has `role="textbox"` with `aria-multiline`, a label from `label` (Draft by default) and `aria-placeholder`.
- The toolbar has `role="toolbar"` and the label Formatting. It is one tab stop: ← and → move along it, and Home and End jump to its ends. Each format button is labelled, reports `aria-pressed`, and shows its shortcut in its tooltip.
- The AI menu follows the menu pattern: `role="menu"` labelled by its heading, `menuitem` rows, ↑ and ↓ that wrap, Home and End, a letter to jump to an item, and Escape or Tab to go back to the text with the selection as it was. Ask AI reports `aria-expanded`, and items that can't run on an empty line are `aria-disabled`.
- The link field is a labelled dialog: Enter applies the address, Escape goes back to the text, and an address it can't read is marked `aria-invalid`.
- An `aria-live="polite"` region says when a suggestion is being written, reads it out with how to accept or discard it, and says when it was accepted or discarded.
- Tab only accepts while a suggestion is waiting; otherwise it moves the focus out of the text as usual. With reduced motion turned on, words don't fade in, and the demo's suggestion appears all at once.

## Usage in React

```tsx
import { RichTextEditor } from '@/components/designme/rich-text-editor/RichTextEditor';
```

### Example

```tsx
'use client';
// The animated preview from designme.dev, rebuilt from the React component: an example of driving it from your own state.
import { useRef, useState } from 'react';
import { RichTextEditor, type RichTextEditorHandle } from './RichTextEditor';
import { useStory } from '../lib/useScript';

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
```

## Props

| Prop | Type | What it does |
| --- | --- | --- |
| `value` (optional) | `string` | The text as HTML: paragraphs, one heading level (`h2`), bulleted and numbered lists, quotes, and inside them bold, italic, inline code and links. Anything else is cleaned out, as on paste. Leave it out to let the editor keep the text |
| `defaultValue` (optional) | `string` |  |
| `onValueChange` (optional) | `(html: string) => void` | Called with the HTML after each change the person makes: a key typed, a format, a paste, undo or redo, an accepted suggestion. Not while a suggestion is on screen, and not for text you pass in |
| `onChange` (optional) | `(html: string) => void` | The same as onValueChange, for code that expects the usual name |
| `placeholder` (optional) | `string` | Shown while the editor is empty |
| `label` (optional) | `string` | The text box's accessible name. Defaults to Draft |
| `hint` (optional) | `ReactNode` | The quiet hint beside the word count, on wide editors |
| `ai` (optional) | `RichTextAi \| false` | Writes the AI's suggestions. Defaults to a demo that streams canned text; pass your model call, or false to hide the AI |
| `aiActions` (optional) | `RichTextAiAction[]` | The AI menu. Defaults to Improve writing, Make shorter, Fix grammar and Continue writing |
| `onSuggestion` (optional) | `(result: { action: string; text: string; accepted: boolean }) => void` | Called when a suggestion is accepted or discarded |
| `ref` (optional) | `Ref<RichTextEditorHandle>` |  |
| `className` (optional) | `string` |  |

## Questions

**How do I connect it to my model?**

Pass `ai`, a function that gets `{ action, text, before, after, document, signal }`. Return an async iterable of text chunks to stream the answer, or a string or a promise of one, which is written in a word at a time. Stop your request when `signal` aborts, which happens when the person discards the suggestion.

**What does the default AI do?**

It is a demo, so the preview works on its own: canned rewrites for the preview's draft about a pricing launch, and for anything else simple rules that drop filler words and fix common typos. Pass your own `ai` in a product.

**What format is the value in?**

HTML with `p`, `h2`, `ul`, `ol`, `li` and `blockquote` for lines, and `b`, `i`, `code` and `a href` inside them. Anything else you pass in is cleaned out the same way a paste is.

**Is pasted HTML safe?**

The editor reads it with a parser that runs nothing, and rebuilds it from the few tags it keeps, without attributes other than a link's address. Links to anything but http, https and mailto lose their address and stay as text.

**Can people keep typing while a suggestion streams in?**

No. The text is held still until the suggestion is accepted or discarded, so the words it replaces can't change under it. Escape discards it straight away, even while it is still being written.

## Source

`RichTextEditor.tsx`, as `npx designme add rich-text-editor --react` installs it:

```tsx
'use client';
import { useEffect, useId, useImperativeHandle, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type ReactNode, type Ref } from 'react';
import { cx } from '../lib/cx';
import { useReducedMotion } from '../lib/hooks';
import { Icon, type IconName } from '../lib/icons';
import { Tip } from '../lib/motion';
import '../designme.css';
import './rich-text-editor.css';

/** A formatting command, as the toolbar and the shortcuts apply it. `p` turns lines back into plain paragraphs */
export type RichTextFormat = 'h2' | 'b' | 'i' | 'code' | 'ul' | 'ol' | 'quote' | 'p';

/** An item in the AI menu */
export interface RichTextAiAction {
  key: string;
  label: string;
  icon?: IconName;
  /** `swap` (the default) replaces the selection, or the paragraph the caret is in, and shows the old words struck through.
      `add` writes on after the caret or the selection, and is the only kind offered on an empty line */
  kind?: 'swap' | 'add';
}

/** What the AI is asked to do. `text` is what it acts on (empty for an `add`), `before` and `after` the text around it, `document` all of it */
export interface RichTextAiRequest {
  action: string;
  text: string;
  before: string;
  after: string;
  document: string;
  /** Aborted when the person discards the suggestion or the editor unmounts */
  signal: AbortSignal;
}

/** Writes a suggestion: return the text, a promise of it, or an async iterable of chunks to stream it in as your model answers.
    Blank lines in it start new paragraphs */
export type RichTextAi = (request: RichTextAiRequest) => AsyncIterable<string> | Promise<string> | string;

/** What a ref to the editor can do: drive it from your own shortcuts, a command menu or a scripted demo. None of these take the
    focus unless the editor already has it, except `focus` */
export interface RichTextEditorHandle {
  focus: () => void;
  /** The text as HTML, in the editor's few tags */
  getHTML: () => string;
  /** The text as plain text, a line break between lines */
  getText: () => string;
  /** Replaces the text, cleaned like a paste, and starts a new undo history */
  setHTML: (html: string) => void;
  /** Selects the first place the text appears and marks it, as a person's selection is marked. Returns false when it isn't there */
  select: (text: string) => boolean;
  /** Types text at the caret, as a person would */
  type: (text: string) => void;
  /** Starts a new line at the caret, as Enter does */
  newLine: () => void;
  format: (format: RichTextFormat) => void;
  /** Opens the AI menu at the selection, or closes it when it is open */
  openAi: () => void;
  /** Runs an AI action on the selection, or the caret's paragraph, as the menu does */
  ask: (action: string) => void;
  /** Keeps the suggestion once it has finished, as Tab does */
  accept: () => void;
  /** Leaves the text as it was, as Escape does */
  discard: () => void;
  undo: () => void;
  redo: () => void;
}

export interface RichTextEditorProps {
  /** The text as HTML: paragraphs, one heading level (`h2`), bulleted and numbered lists, quotes, and inside them bold, italic,
      inline code and links. Anything else is cleaned out, as on paste. Leave it out to let the editor keep the text */
  value?: string;
  defaultValue?: string;
  /** Called with the HTML after each change the person makes: a key typed, a format, a paste, undo or redo, an accepted suggestion.
      Not while a suggestion is on screen, and not for text you pass in */
  onValueChange?: (html: string) => void;
  /** The same as onValueChange, for code that expects the usual name */
  onChange?: (html: string) => void;
  /** Shown while the editor is empty */
  placeholder?: string;
  /** The text box's accessible name. Defaults to Draft */
  label?: string;
  /** The quiet hint beside the word count, on wide editors */
  hint?: ReactNode;
  /** Writes the AI's suggestions. Defaults to a demo that streams canned text; pass your model call, or false to hide the AI */
  ai?: RichTextAi | false;
  /** The AI menu. Defaults to Improve writing, Make shorter, Fix grammar and Continue writing */
  aiActions?: RichTextAiAction[];
  /** Called when a suggestion is accepted or discarded */
  onSuggestion?: (result: { action: string; text: string; accepted: boolean }) => void;
  ref?: Ref<RichTextEditorHandle>;
  className?: string;
}

const ACTIONS: RichTextAiAction[] = [
  { key: 'improve', label: 'Improve writing', icon: 'wand' },
  { key: 'shorter', label: 'Make shorter', icon: 'minus' },
  { key: 'grammar', label: 'Fix grammar', icon: 'check' },
  { key: 'continue', label: 'Continue writing', icon: 'edit', kind: 'add' }
];

type Range2 = { s: number; e: number };
type Line = { t: string; frag: DocumentFragment; len: number };

/* ---------- the editing engine ----------
   The text is a list of lines (paragraphs, a heading, list items and quote lines) holding bold, italic, inline code and links,
   and every change goes through it: Enter, Backspace at a line's start, formats, paste and drop, so pasted or browser-made
   markup is cleaned into those few tags. Undo and redo step through its own history. A selection is kept as two numbers, the
   characters before each end with a line break counting one, so it survives every rebuild, and the editor works the same with
   or without the focus (a story types into it without taking the focus from the page) */
const LEAF = 'p,h2,blockquote,li';
const BLOCK = /^(P|DIV|H[1-6]|LI|BLOCKQUOTE|PRE|TR|DT|DD|SECTION|ARTICLE|HEADER|FOOTER|ASIDE|MAIN|NAV|FIGURE|FIGCAPTION|UL|OL|DL|TABLE|TBODY|THEAD|TFOOT|ADDRESS|HR)$/;
const SKIP = /^(SCRIPT|STYLE|TEMPLATE|HEAD|META|LINK|TITLE|IFRAME|OBJECT|EMBED|SVG|MATH|IMG|PICTURE|VIDEO|AUDIO|CANVAS|NOSCRIPT|BUTTON|INPUT|SELECT|TEXTAREA|OPTION)$/;
const isMac = () => typeof navigator !== 'undefined' && /Mac|iP(hone|ad|od)/.test(navigator.platform || navigator.userAgent);
const safeUrl = (h: string | null) => { const v = (h || '').trim(); return /^(https?:\/\/|mailto:)/i.test(v) ? v : null; };

interface Hooks { change?: () => void; select?: () => void; input?: (e: InputEvent) => void; key?: (e: KeyboardEvent) => boolean }

function createEngine(ed: HTMLElement, hook: Hooks) {
  const offs: (() => void)[] = [];
  const on = <K extends keyof HTMLElementEventMap>(el: HTMLElement | Document, ev: K | string, fn: (e: HTMLElementEventMap[K]) => void) => { el.addEventListener(ev, fn as EventListener); offs.push(() => el.removeEventListener(ev, fn as EventListener)); };
  const lines = () => [...ed.querySelectorAll<HTMLElement>(LEAF)];
  const typeOf = (b: Element) => b.tagName === 'LI' ? (b.parentNode as Element).tagName.toLowerCase() : b.tagName === 'BLOCKQUOTE' ? 'quote' : b.tagName.toLowerCase();
  const lineOf = (n: Node | null): HTMLElement | null => { for (let x = n; x && x !== ed; x = x.parentNode) if (x.nodeType === 1 && (x as Element).matches(LEAF)) return x as HTMLElement; return null; };
  const len = (b: Node) => (b.textContent || '').length;
  const total = () => lines().reduce((n, b, i) => n + len(b) + (i ? 1 : 0), 0);
  const startOf = (i: number) => lines().slice(0, i).reduce((n, b) => n + len(b) + 1, 0);
  const lineAt = (at: number) => { const all = lines(); let n = 0; for (let i = 0; i < all.length; i++) { if (at <= n + len(all[i])) return i; n += len(all[i]) + 1; } return all.length - 1; };
  const text = (o: Range2) => lines().map(b => b.textContent).join('\n').slice(o.s, o.e);
  // the nearest element of a kind around a node, inside its line
  const up = (n: Node | null, tag: string): Element | null => { for (let x = n && n.nodeType === 3 ? n.parentNode : n; x && x !== ed && x.nodeType === 1 && !(x as Element).matches(LEAF); x = x.parentNode) if ((x as Element).tagName === tag) return x as Element; return null; };
  const wrap = (n: Node, tag: string, href?: string | null) => { const w = document.createElement(tag.toLowerCase()); if (href) w.setAttribute('href', href); (n as ChildNode).replaceWith(w); w.appendChild(n); return w; };
  const unwrap = (el: Element) => el.replaceWith(...el.childNodes);

  /* ---- a point in the DOM as one number, and back ---- */
  function offsetOf(node: Node, off: number): number {
    let b = lineOf(node);
    if (!b) {
      if (!ed.contains(node)) return 0;
      // a point between lines: the start of the line after it, or the very end
      const after = node.childNodes[off], first = after && after.nodeType === 1 ? ((after as Element).matches(LEAF) ? after as HTMLElement : (after as Element).querySelector<HTMLElement>(LEAF)) : null;
      if (!first) return total();
      b = first; node = first; off = 0;
    }
    let n = 0; for (const x of lines()) { if (x === b) break; n += len(x) + 1; }
    const rg = document.createRange(); rg.setStart(b, 0); rg.setEnd(node, off);
    return n + rg.toString().length;
  }
  // late: where two text nodes meet, the start of the second (for the start of a range) rather than the end of the first
  function pointAt(at: number, late = false): [Node, number] {
    const all = lines(); let n = Math.max(0, at);
    for (let i = 0; i < all.length; i++) {
      const b = all[i];
      if (n <= len(b) || i === all.length - 1) {
        n = Math.min(n, len(b));
        const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); let t: Text | null, last: Text | null = null;
        while ((t = w.nextNode() as Text | null)) { if (late ? n < t.data.length : n <= t.data.length) return [t, n]; n -= t.data.length; last = t; }
        return last ? [last, last.data.length] : [b, 0];
      }
      n -= len(b) + 1;
    }
    return [ed, 0];
  }
  const range = (o: Range2) => { const [a, ao] = pointAt(o.s, o.s !== o.e), [b, bo] = pointAt(o.e); const rg = document.createRange(); rg.setStart(a, ao); rg.setEnd(b, bo); return rg; };
  // scrolls the text, and only the text, so a part of it is in view
  function show(x: Element | Range) {
    const r = x.getBoundingClientRect(), b = ed.getBoundingClientRect(); if (!r.height) return;
    if (r.bottom > b.bottom - 12) ed.scrollTop += Math.min(r.bottom - b.bottom + 12, r.top - b.top - 12);
    else if (r.top < b.top + 12) ed.scrollTop -= b.top + 12 - r.top;
  }

  /* ---- the selection: the browser's while the editor has the focus, otherwise the last one it had ---- */
  let caret: Range2 | null = null;
  const live = () => { const s = getSelection(); if (!s || !s.rangeCount) return null; const g = s.getRangeAt(0); return ed.contains(g.startContainer) && ed.contains(g.endContainer) ? g : null; };
  function get(): Range2 {
    const g = live();
    if (g) { const a = offsetOf(g.startContainer, g.startOffset), b = offsetOf(g.endContainer, g.endOffset); return { s: Math.min(a, b), e: Math.max(a, b) }; }
    if (!caret) { const t = total(); caret = { s: t, e: t }; }
    return { s: caret.s, e: caret.e };
  }
  function set(o: Range2, focus = false) {
    caret = { s: o.s, e: o.e };
    if (focus && document.activeElement !== ed) ed.focus({ preventScroll: true });
    if (document.activeElement !== ed) return;
    const s = getSelection(); if (!s) return; s.removeAllRanges(); s.addRange(range(o));
  }

  /* ---- tidying: the few tags the editor keeps, in the shape it keeps them ---- */
  function tidy() {
    for (const el of ed.querySelectorAll('b,i,code,a')) {
      if (!el.isConnected) continue;
      if (!el.textContent) { el.remove(); continue; }
      // a mark inside one of its own kind adds nothing
      if (up(el.parentNode, el.tagName)) unwrap(el);
    }
    // two marks of a kind side by side become one
    for (const el of ed.querySelectorAll('b,i,code,a')) {
      if (!el.isConnected) continue;
      for (;;) {
        let nx = el.nextSibling;
        while (nx && nx.nodeType === 3 && !(nx as Text).data) { const d = nx; nx = nx.nextSibling; d.remove(); }
        if (!nx || nx.nodeType !== 1 || (nx as Element).tagName !== el.tagName || (nx as Element).getAttribute('href') !== el.getAttribute('href')) break;
        el.append(...nx.childNodes); nx.remove();
      }
    }
    // an empty line keeps one <br> so it has a height and a caret; a line with text needs none
    for (const b of lines()) { const br = [...b.querySelectorAll('br')]; if (b.textContent) br.forEach(x => x.remove()); else if (!br.length) b.appendChild(document.createElement('br')); else br.slice(1).forEach(x => x.remove()); }
    if (!lines().length) { const p = document.createElement('p'); p.appendChild(document.createElement('br')); ed.replaceChildren(p); }
    ed.normalize();
  }
  // spec: [type, a node whose children become the line][]; list items of a kind side by side share one list
  function rebuild(spec: [string, Node][]) {
    const frag = document.createDocumentFragment(); let list: HTMLElement | null = null;
    for (const [t, b] of spec) {
      const el = document.createElement(t === 'quote' ? 'blockquote' : t === 'ul' || t === 'ol' ? 'li' : t);
      el.append(...b.childNodes);
      if (t === 'ul' || t === 'ol') { if (!list || list.tagName.toLowerCase() !== t) frag.appendChild(list = document.createElement(t)); list.appendChild(el); }
      else { list = null; frag.appendChild(el); }
    }
    ed.replaceChildren(frag); tidy();
  }
  const specOf = (): [string, Node][] => lines().map(b => [typeOf(b), b]);
  // anything the browser made that the editor doesn't keep: a stray <div>, a <span style>, text outside a line
  function messy() {
    for (const n of ed.childNodes) {
      if (n.nodeType === 3 ? (n as Text).data.trim() : n.nodeType === 1 && !/^(P|H2|BLOCKQUOTE|UL|OL)$/.test((n as Element).tagName)) return true;
      if (n.nodeType === 1 && /^(UL|OL)$/.test((n as Element).tagName) && [...n.childNodes].some(x => x.nodeType !== 1 || (x as Element).tagName !== 'LI')) return true;
    }
    return !!ed.querySelector('[style],[class],span,font,div,a:not([href]),:is(p,h2,blockquote,li) :not(b,i,code,a,br)');
  }

  /* ---- reading HTML, pasted or the editor's own, into lines of the few tags it keeps. keep: the editor's own, every
     character and empty line as it is; otherwise whitespace collapses as a page shows it and empty lines go ---- */
  function parse(root: Node, keep: boolean): Line[] {
    const out: { t: string; frag: DocumentFragment }[] = []; let cur: { t: string; frag: DocumentFragment } | null = null;
    const walk = (node: Node, t: string, pre: boolean, marks: [string, string?][]) => {
      for (const n of node.childNodes) {
        if (n.nodeType === 3) {
          const d = (n as Text).data;
          let s = keep ? d : pre ? d.replace(/\r\n?/g, '\n') : d.replace(/[\s ]+/g, ' ');
          if (!keep) s = s.replace(/ /g, ' ');
          if (!cur && !s.trim() && (node === root || /^(UL|OL|DL|TABLE|TBODY|THEAD|TFOOT|TR)$/.test((node as Element).tagName))) continue;
          (pre && !keep ? s.split('\n') : [s]).forEach((p, i) => {
            if (i) cur = null;
            if (!p || (!cur && !keep && !p.trim())) return;
            if (!cur) out.push(cur = { t, frag: document.createDocumentFragment() });
            let x: Node = document.createTextNode(p);
            for (let m = marks.length - 1; m >= 0; m--) { const w = document.createElement(marks[m][0].toLowerCase()); if (marks[m][1]) w.setAttribute('href', marks[m][1]!); w.appendChild(x); x = w; }
            cur.frag.appendChild(x);
          });
          continue;
        }
        if (n.nodeType !== 1) continue;
        const el = n as Element, tg = el.tagName;
        if (SKIP.test(tg) || el.classList.contains('dm-rte-new')) continue;
        const css = (el.getAttribute('style') || '').toLowerCase();
        if (tg === 'BR') { cur = null; continue; }
        if (BLOCK.test(tg)) {
          const nt = /^H[1-6]$/.test(tg) ? 'h2' : tg === 'LI' ? (el.parentElement && el.parentElement.tagName === 'OL' ? 'ol' : 'ul') : tg === 'BLOCKQUOTE' ? 'quote' : t;
          cur = null; const was = out.length;
          walk(el, nt, pre || tg === 'PRE', marks);
          if (keep && out.length === was && !el.querySelector('p,div,h1,h2,h3,h4,h5,h6,li,blockquote,pre,ul,ol')) out.push({ t: nt, frag: document.createDocumentFragment() });
          cur = null; continue;
        }
        let m = marks; const add = (tag: string, href?: string) => { if (!m.some(x => x[0] === tag)) m = [...m, [tag, href]]; };
        if (tg === 'B' || tg === 'STRONG' ? !/font-weight\s*:\s*(normal|[1-4]00)/.test(css) : /font-weight\s*:\s*(bold|[6-9]00)/.test(css)) add('B');
        if (tg === 'I' || tg === 'EM' || /font-style\s*:\s*italic/.test(css)) add('I');
        if (/^(CODE|KBD|SAMP|TT)$/.test(tg)) add('CODE');
        if (tg === 'A') { const h = safeUrl(el.getAttribute('href')); if (h) add('A', h); }
        walk(el, t, pre, m);
      }
    };
    walk(root, 'p', false, []);
    if (!keep) for (const x of out) {
      const ts: Text[] = [], w = document.createTreeWalker(x.frag, NodeFilter.SHOW_TEXT); let t: Text | null; while ((t = w.nextNode() as Text | null)) ts.push(t);
      if (ts.length) { ts[0].data = ts[0].data.replace(/^\s+/, ''); ts[ts.length - 1].data = ts[ts.length - 1].data.replace(/\s+$/, ''); }
    }
    return out.filter(x => keep || x.frag.textContent).map(x => ({ ...x, len: (x.frag.textContent || '').length }));
  }
  const plain = (s: string): Line[] => s.replace(/\r\n?/g, '\n').split('\n').filter(l => l.trim()).map(l => { const frag = document.createDocumentFragment(); frag.append(l); return { t: 'p', frag, len: l.length }; });
  function clean() { const o = get(); rebuild(parse(ed, true).map(x => [x.t, x.frag])); set(o); }

  /* ---- history ---- */
  const H = { list: [] as { html: string; sel: Range2; pre: Range2 | null }[], at: 0, dirty: false, pre: null as Range2 | null, t: 0 as ReturnType<typeof setTimeout> | 0 };
  const changed = () => hook.change?.();
  function commit(pre?: Range2) {
    clearTimeout(H.t); const html = ed.innerHTML, top = H.list[H.at], before = H.pre || pre || null;
    H.dirty = false; H.pre = null;
    if (!top || top.html !== html) { H.list.splice(H.at + 1); H.list.push({ html, sel: get(), pre: before }); if (H.list.length > 300) H.list.shift(); H.at = H.list.length - 1; }
    changed();
  }
  const flush = () => { if (H.dirty) commit(); };
  // typing settles into one step once it pauses
  function typed(pre?: Range2 | null) { if (!H.dirty) { H.pre = pre || null; H.list.splice(H.at + 1); } H.dirty = true; clearTimeout(H.t); H.t = setTimeout(() => commit(), 700); changed(); }
  function restore(html: string, sel: Range2 | null) { ed.innerHTML = html; pend = null; set(sel || { s: 0, e: 0 }); changed(); }
  function undo() { flush(); if (H.at <= 0) return; const cur = H.list[H.at]; H.at--; restore(H.list[H.at].html, cur.pre || H.list[H.at].sel); }
  function redo() { flush(); if (H.at >= H.list.length - 1) return; H.at++; restore(H.list[H.at].html, H.list[H.at].sel); }
  function load(html: string) {
    const t = document.createElement('template'); t.innerHTML = html || '';
    rebuild(parse(t.content, false).map(x => [x.t, x.frag])); caret = null; pend = null; rev = null;
    H.list = [{ html: ed.innerHTML, sel: { s: 0, e: 0 }, pre: null }]; H.at = 0; H.dirty = false; clearTimeout(H.t); changed();
  }

  /* ---- edits ---- */
  function texts() { const out: [Text, number][] = []; let n = 0; lines().forEach((b, i) => { if (i) n++; const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); let t: Text | null; while ((t = w.nextNode() as Text | null)) { out.push([t, n]); n += t.data.length; } }); return out; }
  function cut(at: number) { for (const [t, n] of texts()) if (at > n && at < n + t.data.length) { t.splitText(at - n); return; } }
  // the text nodes a selection covers, split at its ends so each is wholly inside it
  function covered(o: Range2) { cut(o.e); cut(o.s); return texts().filter(([t, n]) => t.data.length && n >= o.s && n + t.data.length <= o.e).map(x => x[0]); }
  // formats picked with nothing selected wait for the next thing typed at that spot
  let pend: { at: number; m: Record<string, boolean> } | null = null;
  function has(tag: string, o: Range2) {
    if (o.s === o.e) {
      if (pend && pend.at === o.s && tag in pend.m) return pend.m[tag];
      const g = live(); return !!up(g && g.collapsed ? g.startContainer : pointAt(o.s)[0], tag);
    }
    const ts = texts().filter(([t, n]) => t.data.length && n < o.e && n + t.data.length > o.s);
    return ts.length > 0 && ts.every(([t]) => up(t, tag));
  }
  // bold (B), italic (I), code (CODE) or a link (A, with href; null takes it off) on the selection, or off it when it all has it
  function inline(tag: string, href?: string | null, o = get()) {
    if (o.s === o.e) {
      if (tag === 'A') return;
      if (!pend || pend.at !== o.s) pend = { at: o.s, m: {} };
      pend.m[tag] = !has(tag, o); changed(); return;
    }
    flush();
    const ts = covered(o); if (!ts.length) return;
    const add = href !== undefined ? href !== null : !ts.every(t => up(t, tag));
    if (add) ts.forEach(t => { const had = up(t, tag); if (!had) wrap(t, tag, href); else if (href) had.setAttribute('href', href); });
    else new Set(ts.map(t => up(t, tag))).forEach(el => {
      if (!el) return;
      const keep: Text[] = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), h = el.getAttribute('href'); let t: Text | null;
      while ((t = w.nextNode() as Text | null)) if (!ts.includes(t)) keep.push(t);
      unwrap(el); keep.forEach(x => wrap(x, tag, h));
    });
    tidy(); set(o); commit(o);
  }
  // typing with formats picked at the caret: the text goes in with them, and the caret stays inside them
  function typeStyled(s: string) {
    const o = get(), m = pend!.m; pend = null;
    const g = live(), [n, k] = g && g.collapsed ? [g.startContainer, g.startOffset] as [Node, number] : pointAt(o.s);
    const rg = document.createRange(); rg.setStart(n, k); rg.collapse(true);
    for (const tag of Object.keys(m)) if (!m[tag]) {
      const el = up(rg.startContainer, tag); if (!el) continue;
      const tail = document.createRange(); tail.setStart(rg.startContainer, rg.startOffset); tail.setEndAfter(el);
      el.after(tail.extractContents()); rg.setStartAfter(el); rg.collapse(true);
    }
    let x: Node = document.createTextNode(s);
    for (const tag of Object.keys(m)) if (m[tag] && !up(rg.startContainer, tag)) { const w = document.createElement(tag.toLowerCase()); w.appendChild(x); x = w; }
    rg.insertNode(x); tidy(); set({ s: o.s + s.length, e: o.s + s.length }); typed(o);
  }
  // a heading, a list or a quote on the lines in the selection, or plain lines again when they all have it
  function block(type: string, o = get()) {
    flush(); const all = lines(), a = lineAt(o.s), z = lineAt(o.e);
    const to = all.slice(a, z + 1).every(b => typeOf(b) === type) ? 'p' : type;
    rebuild(all.map((b, i) => [i >= a && i <= z ? to : typeOf(b), b])); set(o); commit(o);
  }
  function del(o: Range2): Range2 {
    const all = lines(), i = lineAt(o.s), j = lineAt(o.e), [a, ao] = pointAt(o.s, true), [b, bo] = pointAt(o.e);
    if (i === j) { const rg = document.createRange(); rg.setStart(a, ao); rg.setEnd(b, bo); rg.deleteContents(); tidy(); return { s: o.s, e: o.s }; }
    const head = document.createRange(); head.setStart(a, ao); head.setEnd(all[i], all[i].childNodes.length); head.deleteContents();
    const tail = document.createRange(); tail.setStart(all[j], 0); tail.setEnd(b, bo); tail.deleteContents();
    all[i].append(...all[j].childNodes);
    rebuild(all.filter((_, k) => k <= i || k > j).map(x => [typeOf(x), x]));
    return { s: o.s, e: o.s };
  }
  // Enter: the text after the caret starts a new line. A list or a quote carries on, a heading is followed by text, and Enter
  // on an empty list item or quote line leaves the list
  function split(o = get()) {
    flush(); const pre = o; if (o.s !== o.e) o = del(o);
    const all = lines(), i = lineAt(o.s), b = all[i], t = typeOf(b), spec = specOf(), next = t === 'h2' ? 'p' : t;
    if (!len(b) && t !== 'p') { spec[i][0] = 'p'; rebuild(spec); set(o); commit(pre); return; }
    if (len(b) && o.s === startOf(i)) { spec.splice(i, 0, [next, document.createElement('p')]); rebuild(spec); set({ s: o.s + 1, e: o.s + 1 }); commit(pre); return; }
    const [n, k] = pointAt(o.s), rg = document.createRange(); rg.setStart(n, k); rg.setEnd(b, b.childNodes.length);
    const nb = document.createElement('p'); nb.appendChild(rg.extractContents());
    spec.splice(i + 1, 0, [next, nb]); rebuild(spec); set({ s: o.s + 1, e: o.s + 1 }); commit(pre);
  }
  // Backspace at the start of a line: a heading, list item or quote line turns plain first, then the line joins the one above
  function joinBack(o: Range2) {
    const all = lines(), i = lineAt(o.s), spec = specOf();
    if (spec[i][0] !== 'p') { spec[i][0] = 'p'; rebuild(spec); set(o); commit(o); return; }
    if (!i) return;
    all[i - 1].append(...all[i].childNodes); spec.splice(i, 1); rebuild(spec); set({ s: o.s - 1, e: o.s - 1 }); commit(o);
  }
  function joinNext(o: Range2) {
    const all = lines(), i = lineAt(o.s), spec = specOf(); if (i >= all.length - 1) return;
    all[i].append(...all[i + 1].childNodes); spec.splice(i + 1, 1); rebuild(spec); set(o); commit(o);
  }
  // plain text at a spot; returns where it ends
  function insert(s: string, o: Range2) {
    const [n, k] = pointAt(o.s);
    if (n.nodeType === 3) (n as Text).insertData(k, s); else n.insertBefore(document.createTextNode(s), n.childNodes[k] || null);
    tidy(); return o.s + s.length;
  }
  // lines read from a paste (or a suggestion) into the text: the first joins the line at the caret, the rest follow it, and
  // what came after the caret goes on the end. Returns where they end
  function insertLines(items: Line[], o: Range2) {
    if (!items.length) return o.s;
    if (o.s !== o.e) o = del(o);
    const all = lines(), i = lineAt(o.s), b = all[i], [n, k] = pointAt(o.s), spec = specOf();
    const rg = document.createRange(); rg.setStart(n, k); rg.setEnd(b, b.childNodes.length); const tail = rg.extractContents();
    if (!b.textContent && items[0].t !== 'p') spec[i][0] = items[0].t;
    let at = o.s + items[0].len; b.append(items[0].frag);
    const rest = items.slice(1).map((x): [string, Node] => { const p = document.createElement('p'); p.append(x.frag); at += 1 + x.len; return [x.t, p]; });
    spec.splice(i + 1, 0, ...rest); (rest.length ? rest[rest.length - 1][1] as HTMLElement : b).append(tail);
    rebuild(spec); return at;
  }
  // a link on the selection; with nothing selected, on the link at the caret, or the address itself goes in, linked
  function link(o: Range2, href: string | null) {
    flush();
    if (!href) { const rg = range(o); [...ed.querySelectorAll('a')].filter(a => rg.intersectsNode(a)).forEach(unwrap); tidy(); set(o); commit(o); return; }
    if (o.s !== o.e) return inline('A', href, o);
    const a = up(pointAt(o.s)[0], 'A');
    if (a) { a.setAttribute('href', href); set(o); commit(o); return; }
    const label = href.replace(/^mailto:/i, ''), end = insert(label, o);
    covered({ s: o.s, e: end }).forEach(t => wrap(t, 'A', href)); tidy(); set({ s: end, e: end }); commit(o);
  }

  /* ---- a suggestion: the text it replaces (swap) is struck through, or it goes after the selection (add). The new words
     arrive in a span the caret can't enter; Accept puts them in as plain text, Discard leaves the text as it was ---- */
  let rev: { o: Range2; kind: 'swap' | 'add'; olds: HTMLElement[]; nw: HTMLElement } | null = null;
  function suggest(o: Range2, kind: 'swap' | 'add') {
    flush(); pend = null;
    const nw = document.createElement('span'); nw.className = 'dm-rte-new'; nw.contentEditable = 'false';
    const olds: HTMLElement[] = [];
    if (kind === 'swap') {
      const all = lines(), a = lineAt(o.s), z = lineAt(o.e);
      for (let i = z; i >= a; i--) {
        const s = Math.max(o.s, startOf(i)), e = Math.min(o.e, startOf(i) + len(all[i])); if (e <= s) continue;
        const rg = range({ s, e }), sp = document.createElement('span'); sp.className = 'dm-rte-old';
        sp.appendChild(rg.extractContents()); rg.insertNode(sp); olds.unshift(sp);
      }
    }
    if (olds.length) olds[olds.length - 1].after(nw); else range({ s: o.e, e: o.e }).insertNode(nw);
    rev = { o, kind, olds, nw };
    return (s: string) => { if (rev && rev.nw === nw) { const w = document.createElement('span'); w.className = 'dm-w'; w.textContent = s; nw.appendChild(w); show(w); } };
  }
  function drop() { if (!rev) return null; const r = rev; r.olds.forEach(unwrap); r.nw.remove(); rev = null; tidy(); return r; }
  function accept() {
    const s = rev ? rev.nw.textContent || '' : ''; const r = drop(); if (!r) return;
    const items = s.split(/\n+/).filter(Boolean).map(l => { const frag = document.createDocumentFragment(); frag.append(l); return { t: 'p', frag, len: l.length }; });
    const at = insertLines(items, r.kind === 'swap' ? r.o : { s: r.o.e, e: r.o.e });
    set({ s: at, e: at }); commit(r.o);
  }
  function discard() { const r = drop(); if (r) set(r.o); changed(); }

  /* ---- what the browser does, routed through the edits above ---- */
  on(ed, 'beforeinput', (e: InputEvent) => {
    const t = e.inputType;
    if (rev) { e.preventDefault(); return; }
    if (t === 'historyUndo' || t === 'historyRedo') { e.preventDefault(); if (t === 'historyUndo') undo(); else redo(); return; }
    if (t.startsWith('format')) { e.preventDefault(); if (t === 'formatBold') inline('B'); else if (t === 'formatItalic') inline('I'); return; }
    if (t === 'insertParagraph' || t === 'insertLineBreak') { e.preventDefault(); split(); return; }
    if (t === 'insertFromPaste' || t === 'insertFromDrop' || t === 'deleteByDrag' || t === 'deleteByCut') return;
    const o = get(), i = lineAt(o.s);
    if (t === 'insertText' && e.data && pend && o.s === o.e && pend.at === o.s) { e.preventDefault(); typeStyled(e.data); return; }
    if (o.s === o.e && /^delete.*Backward$/.test(t) && o.s === startOf(i)) { e.preventDefault(); flush(); joinBack(o); return; }
    if (o.s === o.e && /^delete.*Forward$/.test(t) && o.s === startOf(i) + len(lines()[i])) { e.preventDefault(); flush(); joinNext(o); return; }
    // a selection over several lines: removing it joins them, so the editor does it
    if (o.s !== o.e && i !== lineAt(o.e) && (t.startsWith('delete') || t === 'insertText' || t === 'insertReplacementText')) {
      e.preventDefault(); flush(); const p = del(o); let at = p.s;
      const s = e.data || (e.dataTransfer && e.dataTransfer.getData('text/plain')) || '';
      if (s && t.startsWith('insert')) at = insert(s.replace(/\s*\n\s*/g, ' '), p);
      set({ s: at, e: at }); commit(o); return;
    }
    if (!H.dirty) H.pre = o;
  });
  on(ed, 'input', (e: InputEvent) => { if (rev) return; if (messy()) clean(); typed(H.pre); hook.input?.(e); });
  on(ed, 'paste', (e: ClipboardEvent) => {
    e.preventDefault(); if (rev || !e.clipboardData) return;
    const h = e.clipboardData.getData('text/html'), s = e.clipboardData.getData('text/plain');
    let items = h ? parse(new DOMParser().parseFromString(h, 'text/html').body, false) : [];
    if (!items.length) items = plain(s); if (!items.length) return;
    flush(); const o = get(), at = insertLines(items, o); set({ s: at, e: at }); commit(o);
  });
  on(ed, 'cut', (e: ClipboardEvent) => {
    e.preventDefault(); if (rev || !e.clipboardData) return; const o = get(); if (o.s === o.e) return;
    const g = live(); e.clipboardData.setData('text/plain', text(o)); if (g) { const d = document.createElement('div'); d.appendChild(g.cloneContents()); e.clipboardData.setData('text/html', d.innerHTML); }
    flush(); const p = del(o); set(p); commit(o);
  });
  // a drop goes in as plain text where it lands; dragging inside the text is off, so a drag can't move half a list
  on(ed, 'dragstart', (e: DragEvent) => e.preventDefault());
  on(ed, 'drop', (e: DragEvent) => {
    e.preventDefault(); if (rev || !e.dataTransfer) return;
    const items = plain(e.dataTransfer.getData('text/plain')); if (!items.length) return;
    const doc = document as Document & { caretRangeFromPoint?: (x: number, y: number) => Range | null; caretPositionFromPoint?: (x: number, y: number) => { offsetNode: Node; offset: number } | null };
    let at: [Node, number] | null = null;
    if (doc.caretPositionFromPoint) { const pp = doc.caretPositionFromPoint(e.clientX, e.clientY); if (pp) at = [pp.offsetNode, pp.offset]; }
    else if (doc.caretRangeFromPoint) { const r = doc.caretRangeFromPoint(e.clientX, e.clientY); if (r) at = [r.startContainer, r.startOffset]; }
    if (!at || !ed.contains(at[0])) return;
    flush(); const a0 = offsetOf(at[0], at[1]), end = insertLines(items, { s: a0, e: a0 }); set({ s: end, e: end }, true); commit({ s: a0, e: a0 });
  });
  on(ed, 'keydown', (e: KeyboardEvent) => {
    if (e.isComposing || hook.key?.(e)) return;
    if (rev) return;
    const mod = isMac() ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey;
    if (!mod) return;
    const k = e.key.toLowerCase(), c = e.code;
    const act = e.altKey ? (c === 'Digit1' ? () => block('h2') : c === 'Digit0' ? () => block('p') : null)
      : e.shiftKey ? (c === 'Digit7' ? () => block('ol') : c === 'Digit8' ? () => block('ul') : c === 'Digit9' ? () => block('quote') : k === 'z' ? redo : null)
      : k === 'b' ? () => inline('B') : k === 'i' ? () => inline('I') : k === 'e' ? () => inline('CODE') : k === 'z' ? undo : k === 'y' ? redo : null;
    if (act) { e.preventDefault(); e.stopPropagation(); act(); }
  });
  on(document, 'selectionchange', () => {
    if (!live() || rev) return;
    caret = get(); if (pend && (caret.s !== pend.at || caret.e !== pend.at)) pend = null;
    hook.select?.();
  });

  tidy(); H.list = [{ html: ed.innerHTML, sel: { s: 0, e: 0 }, pre: null }];
  return {
    get, set, text, range, total, load, undo, redo, inline, block, split, link, suggest, accept, discard, flush,
    focus: () => set(get(), true),
    html: () => ed.innerHTML,
    reviewing: () => !!rev,
    canUndo: () => H.at > 0 || H.dirty,
    canRedo: () => H.at < H.list.length - 1,
    empty: () => { const all = lines(); return all.length === 1 && !len(all[0]) && typeOf(all[0]) === 'p'; },
    words: () => { const s = lines().map(b => b.textContent).join(' ').trim(); return s ? s.split(/\s+/).length : 0; },
    // the line around a spot, as a selection
    line: (at: number): Range2 => { const i = lineAt(at), s = startOf(i); return { s, e: s + len(lines()[i]) }; },
    // what the selection or the caret has: bold, italic, code, a link (and its address), and the lines' type when they share one
    state() {
      const o = get(), all = lines(), ts = all.slice(lineAt(o.s), lineAt(o.e) + 1).map(typeOf), g = live();
      const a = up(o.s === o.e && g ? g.startContainer : pointAt(o.s, o.s !== o.e)[0], 'A');
      return { B: has('B', o), I: has('I', o), CODE: has('CODE', o), A: o.s === o.e ? !!a : has('A', o), href: a ? a.getAttribute('href') : null, block: ts.every(t => t === ts[0]) ? ts[0] : null };
    },
    // removes some text, as one step of the history
    remove(o: Range2) { flush(); set(del(o)); commit(o); },
    // text typed at the caret, as a person would: for a story, which leaves the page's focus where it is
    type(s: string) { const o = get(); flush(); const at = insert(s, o); set({ s: at, e: at }); typed(o); show(range({ s: at, e: at })); },
    show: (o: Range2) => show(range(o)),
    destroy() { clearTimeout(H.t); offs.forEach(f => f()); }
  };
}
type Engine = ReturnType<typeof createEngine>;

/* ---------- the demo's writer: canned rewrites for the preview's draft, and simple rules for anything else ---------- */
const CANNED: Record<string, Record<string, string>> = {
  'We know pricing changes can feel like a lot, so we want to make sure everyone has plenty of time to look at the new plans and ask us questions before anything changes.':
    { shorter: "We're giving everyone time to review the new plans and ask questions before anything changes.", improve: 'Pricing changes can feel like a lot, so everyone gets plenty of time to review the new plans and ask questions before anything changes.' },
  'New pricing goes live on March 3.': { improve: 'Our new pricing goes live on March 3.', shorter: 'New pricing starts March 3.' },
  'Starter teams get two more seats for free, and every plan now includes the agent.': { improve: 'Starter teams get two extra seats at no cost, and every plan now includes the agent.', shorter: 'Starter teams get two free seats, and every plan includes the agent.' }
};
const TYPO: Record<string, string> = { teh: 'the', recieve: 'receive', seperate: 'separate', definately: 'definitely', alot: 'a lot', dont: "don't", cant: "can't", wont: "won't", im: "I'm", ive: "I've", thier: 'their', untill: 'until', occured: 'occurred', wich: 'which', becuase: 'because', youre: "you're", doesnt: "doesn't", isnt: "isn't", tommorow: 'tomorrow', accross: 'across' };
const FILLER: [RegExp, string][] = [[/\b(really|very|just|actually|basically|quite|simply|definitely|certainly|literally|totally)\s+/gi, ''], [/\bin order to\b/gi, 'to'], [/\bmake sure (that )?/gi, 'ensure '], [/\bdue to the fact that\b/gi, 'because'], [/\bat this point in time\b/gi, 'now'], [/\ba lot of\b/gi, 'many'], [/\bplenty of\b/gi, 'enough'], [/\bis able to\b/gi, 'can']];
const BETTER: [RegExp, string][] = [[/\bwe will\b/gi, "we'll"], [/\bwe are\b/gi, "we're"], [/\bit is\b/gi, "it's"], [/\bdo not\b/gi, "don't"], [/\bcannot\b/gi, "can't"], [/\bvery important\b/gi, 'essential'], [/\bgood\b/gi, 'strong'], [/\bbig\b/gi, 'major'], [/\bstuff\b/gi, 'details'], [/\bkind of\s+/gi, ''], [/\bat no extra cost\b/gi, 'free']];
/** The demo's stand-in for a model: canned rewrites for the preview's draft about a pricing launch, and simple rules (filler words
    out, common typos fixed) for anything else. Exported so you can see what the default does; pass your own `ai` in a product */
export function demoWrite(action: string, text: string, doc: string) {
  const fix = (s: string) => s.replace(/[ \t]{2,}/g, ' ').replace(/\s+([,.!?;:])/g, '$1').replace(/\bi\b/g, 'I')
    .replace(/\b[a-z]+\b/gi, w => { const f = TYPO[w.toLowerCase()]; return f ? (w[0] === w[0].toUpperCase() ? f[0].toUpperCase() + f.slice(1) : f) : w; })
    .replace(/(^|[.!?]\s+)([a-z])/g, (_, a: string, b: string) => a + b.toUpperCase()).replace(/([a-z0-9])\s*$/i, (m, a: string) => s.trim().split(/\s+/).length > 3 ? a + '.' : m);
  if (action === 'continue') {
    const next = /pric|plan|seat|launch/i.test(doc)
      ? ['Current customers keep their price until their next renewal, and every admin gets an email that sums up what changes for their team.', 'If anything is unclear, reply to this email and we will walk you through it.']
      : ['Next, we will share a short summary so everyone knows what changes and when.', 'Reply with any questions and we will get back to you within a day.'];
    return next.find(x => !doc.includes(x)) || next[next.length - 1];
  }
  if (action === 'grammar') return fix(text);
  const rules = (s: string, list: [RegExp, string][]) => list.reduce((x, [a, b]) => x.replace(a, b), s);
  // sentences end at . ! or ? before a space, so a file name like plan.yaml stays in one
  return (text.match(/[^]*?(?:[.!?]+(?=\s|$)|$)\s*/g) || [text]).filter(Boolean).map(s => {
    const k = s.trim(), hit = CANNED[k] && CANNED[k][action]; if (hit) return s.replace(k, hit);
    let x = fix(rules(s, action === 'shorter' ? FILLER : [...FILLER.slice(0, 2), ...BETTER]));
    // a long sentence that is still long keeps its main clause
    if (action === 'shorter' && x.trim().length > 60 && x.length > s.length * .85 && x.includes(', ')) x = x.slice(0, x.indexOf(', ')) + '.' + (/\s$/.test(s) ? ' ' : '');
    return x;
  }).join('');
}
/** The default `ai`: demoWrite's answer, streamed a word at a time after a short pause, as a model would */
export const demoAi: RichTextAi = async function* ({ action, text, document: doc, signal }) {
  const wait = (ms: number) => new Promise<void>(res => setTimeout(res, ms));
  const reduce = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
  const out = demoWrite(action, text, doc);
  if (reduce) { yield out; return; }
  await wait(450);
  for (const w of out.match(/\S+\s*|\s+/g) || []) { if (signal.aborted) return; yield w; await wait(48); }
};

const keysOf = (k: string, mac: boolean) => k === 'redo' ? (mac ? '⇧⌘Z' : 'Ctrl+Y')
  : k.split(' ').map(x => ({ mod: mac ? '⌘' : 'Ctrl', alt: mac ? '⌥' : 'Alt', shift: mac ? '⇧' : 'Shift' } as Record<string, string>)[x] || x).join(mac ? '' : '+');
const TOOLS: { f: RichTextFormat | 'a'; label: string; icon: IconName; k: string }[] = [
  { f: 'h2', label: 'Heading', icon: 'heading', k: 'mod alt 1' }, { f: 'b', label: 'Bold', icon: 'bold', k: 'mod B' }, { f: 'i', label: 'Italic', icon: 'italic', k: 'mod I' },
  { f: 'code', label: 'Inline code', icon: 'code', k: 'mod E' }, { f: 'a', label: 'Link', icon: 'link', k: 'mod K' },
  { f: 'ul', label: 'Bulleted list', icon: 'list', k: 'mod shift 8' }, { f: 'ol', label: 'Numbered list', icon: 'list-ol', k: 'mod shift 7' }, { f: 'quote', label: 'Quote', icon: 'quote', k: 'mod shift 9' }
];
type Job = { o: Range2; t: Range2; slash: number | null; sel: boolean };
type Ui = { B: boolean; I: boolean; CODE: boolean; A: boolean; href: string | null; block: string | null; undo: boolean; redo: boolean; words: number; empty: boolean };

/** A minimal editor for a draft an agent helps with: a formatting toolbar, the text, and a quiet foot with the word count and undo.
    Select text and press Ask AI (or ⌘J, or type / on a new line), and the suggestion streams in beside the text, the old words
    struck through, to accept with Tab or Enter, or discard with Escape. */
export function RichTextEditor({
  value, defaultValue = '', onValueChange, onChange, placeholder = 'Write a draft, or type / on a new line for AI', label = 'Draft', hint = 'Select text to ask AI',
  ai = demoAi, aiActions = ACTIONS, onSuggestion, ref, className
}: RichTextEditorProps) {
  const uid = useId();
  const reduce = useReducedMotion();
  const root = useRef<HTMLDivElement>(null), ed = useRef<HTMLDivElement>(null), tb = useRef<HTMLDivElement>(null);
  const menuEl = useRef<HTMLDivElement>(null), askEl = useRef<HTMLButtonElement>(null), lnkEl = useRef<HTMLDivElement>(null), urlEl = useRef<HTMLInputElement>(null);
  const eng = useRef<Engine | null>(null);
  const [mac, setMac] = useState(false);
  const [ui, setUi] = useState<Ui>({ B: false, I: false, CODE: false, A: false, href: null, block: 'p', undo: false, redo: false, words: 0, empty: true });
  const [job, setJob] = useState<Job | null>(null);
  const [lk, setLk] = useState<{ o: Range2 } | null>(null);
  const [url, setUrl] = useState(''), [bad, setBad] = useState(false);
  const [bubble, setBubble] = useState(false);
  const [review, setReview] = useState<{ action: string; ready: boolean } | null>(null);
  const [say, setSay] = useState('');
  const [focusTb, setFocusTb] = useState(0);
  const run = useRef<{ ctl: AbortController; action: string } | null>(null);
  const emitted = useRef<string | null>(null), quiet = useRef(false);
  // the newest props and state, for the engine's listeners, which are set up once
  const now = useRef({ onValueChange, onChange, onSuggestion, ai, aiActions, reduce, job, lk, review });
  useEffect(() => { now.current = { onValueChange, onChange, onSuggestion, ai, aiActions, reduce, job, lk, review }; });

  const announce = (t: string) => { setSay(''); setTimeout(() => setSay(t), 60); };
  // the toolbar, the word count and undo follow the text and the selection, and every change is reported
  const paint = () => {
    const E = eng.current; if (!E) return;
    const s = E.state();
    setUi({ ...s, undo: E.canUndo(), redo: E.canRedo(), words: E.words(), empty: E.empty() });
    if (!E.reviewing() && !quiet.current) { const html = E.html(); if (html !== emitted.current) { emitted.current = html; now.current.onValueChange?.(html); now.current.onChange?.(html); } }
  };

  // the first and last line boxes of a selection, or the caret's line
  const rectsOf = (o: Range2): [DOMRect, DOMRect] => {
    const E = eng.current!, rs = [...E.range(o).getClientRects()].filter(x => x.width || x.height);
    if (rs.length) return [rs[0], rs[rs.length - 1]];
    const n = E.range(E.line(o.s)).startContainer, el = (n.nodeType === 3 ? n.parentElement : n) as Element, rr = el.getBoundingClientRect();
    return [rr, rr];
  };
  // a popover sits under the end of the text it is for, or over its start when there's no room, always inside the editor; the
  // Ask AI button goes over the selection's first line
  const place = (el: HTMLElement | null, o: Range2, above = false) => {
    const box = root.current; if (!el || !box) return;
    const b = box.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight, top = (tb.current?.offsetHeight || 44) - 2, [f, l] = rectsOf(o);
    const over = f.top - b.top - h - 6, under = l.bottom - b.top + 6;
    const y = above ? (over >= top ? over : under) : under + h <= b.height - 4 || over < top ? under : over;
    el.style.left = Math.round(Math.max(6, Math.min((above ? f : l).left - b.left - (above ? 0 : 8), b.width - w - 6))) + 'px';
    el.style.top = Math.round(Math.max(4, Math.min(y, b.height - h - 4))) + 'px';
  };
  // the selection a menu or the link field is for stays marked while the focus is in them
  const picked = useRef<Range | null>(null);
  const pick = (o: Range2 | null) => {
    const reg = typeof CSS !== 'undefined' ? (CSS as unknown as { highlights?: Map<string, Set<Range>> }).highlights : undefined;
    const HL = typeof window !== 'undefined' ? (window as unknown as { Highlight?: new () => Set<Range> }).Highlight : undefined;
    if (!reg || !HL) return;
    let h = reg.get('rte-pick'); if (!h) { h = new HL(); reg.set('rte-pick', h); }
    if (picked.current) h.delete(picked.current);
    picked.current = o && o.s !== o.e && eng.current ? eng.current.range(o) : null;
    if (picked.current) h.add(picked.current);
  };
  const showBubble = (o?: Range2) => {
    const E = eng.current; if (!E) return;
    const g = getSelection(), sel = o || (document.activeElement === ed.current && g && g.rangeCount && !g.isCollapsed ? E.get() : null);
    const st = now.current;
    if (!sel || E.reviewing() || st.job || st.lk || !st.ai || !E.text(sel).trim()) { setBubble(false); return; }
    place(askEl.current, sel, true); setBubble(true);
  };

  /* ---- the AI menu ---- */
  const menuItems = () => [...(menuEl.current?.querySelectorAll<HTMLButtonElement>('[role="menuitem"]') || [])].filter(m => m.getAttribute('aria-disabled') !== 'true');
  const focusItem = (m?: HTMLButtonElement) => { if (!m) return; menuItems().forEach(x => { x.tabIndex = x === m ? 0 : -1; }); m.focus({ preventScroll: true }); };
  const openMenu = (how: 'key' | 'click' | 'slash' | 'script') => {
    const E = eng.current; if (!E || E.reviewing() || !now.current.ai) return;
    closeLink(false); E.flush();
    if (now.current.job) { closeMenu(how !== 'script'); return; }
    const o = E.get(), slash = how === 'slash' ? o.s - 1 : null, sel = o.s !== o.e;
    let t = sel ? o : E.line(o.s); if (slash !== null) t = { s: slash + 1, e: t.e };
    const j = { o, t, slash, sel };
    now.current.job = j; setJob(j); setBubble(false); pick(sel ? o : null);
    requestAnimationFrame(() => { place(menuEl.current, o); if (how !== 'script') focusItem(menuItems()[0]); });
  };
  const closeMenu = (back: boolean) => {
    const j = now.current.job; if (!j) return;
    now.current.job = null; setJob(null); pick(null);
    if (back) eng.current?.set(j.o, true);
  };
  // the text an action is for when it runs without the menu: the selection, or the caret's paragraph
  const here = (E: Engine): Job => { const o = E.get(), sel = o.s !== o.e; return { o, t: sel ? o : E.line(o.s), slash: null, sel }; };
  const ask = (key: string, mine: boolean) => {
    const E = eng.current, j = now.current.job || (E && here(E));
    const act = now.current.aiActions.find(a => a.key === key), writer = now.current.ai;
    if (!E || !j || !act || !writer || E.reviewing()) return;
    closeMenu(false);
    let t = j.t, end = j.o.e;
    // the / that opened the menu goes, and what comes after it moves back one
    if (j.slash !== null) { const sl = j.slash; E.remove({ s: sl, e: sl + 1 }); const back = (x: number) => x > sl ? x - 1 : x; t = { s: back(t.s), e: back(t.e) }; end = back(end); }
    const kind = act.kind || 'swap';
    if (kind === 'add') t = { s: end, e: end };
    else if (!E.text(t).trim()) return;
    const doc = E.text({ s: 0, e: E.total() }), before = E.text({ s: 0, e: t.s }), after = E.text({ s: t.e, e: E.total() }), said = E.text(t);
    const write = E.suggest(t, kind), ctl = new AbortController(), me = { ctl, action: key };
    run.current = me; let got = '', first = true;
    const put = (s: string) => { if (first && kind === 'add' && before && !/\s$/.test(before) && !/^\s/.test(s)) s = ' ' + s; first = false; got += s; write(s); };
    setReview({ action: key, ready: false }); setBubble(false); paint();
    announce(`${act.label}: writing a suggestion`);
    if (mine) E.focus();
    (async () => {
      try {
        const res = writer({ action: key, text: kind === 'add' ? '' : said, before, after, document: doc, signal: ctl.signal });
        if (typeof res === 'string' || res instanceof Promise) {
          const s = await res; if (run.current !== me) return;
          // an answer that comes all at once is still written in a word at a time
          if (now.current.reduce) put(s);
          else for (const w of s.match(/\S+\s*|\s+/g) || []) { if (run.current !== me) return; put(w); await new Promise(r => setTimeout(r, 48)); }
        } else for await (const chunk of res) { if (run.current !== me) return; put(chunk); }
      } catch (err) { if (run.current !== me) return; console.error(err); }
      if (run.current !== me) return;
      if (!got.trim()) { finish(false, true); return; }
      setReview({ action: key, ready: true });
      const s = got.trim(); announce(`Suggestion: ${s}${/[.!?]$/.test(s) ? '' : '.'} Press Tab or Enter to accept, or Escape to discard.`);
    })();
  };
  // accept keeps it; discard leaves the text as it was (and a failed or empty answer is discarded the same way)
  const finish = (keep: boolean, mine: boolean) => {
    const E = eng.current, r = run.current; if (!E || !E.reviewing() || !r) return;
    if (keep && !now.current.review?.ready) return;
    const said = (ed.current?.querySelector('.dm-rte-new')?.textContent) || '';
    run.current = null; r.ctl.abort();
    if (keep) E.accept(); else E.discard();
    setReview(null); paint(); announce(keep ? 'Suggestion accepted' : 'Suggestion discarded');
    now.current.onSuggestion?.({ action: r.action, text: said, accepted: keep });
    if (mine) E.focus();
  };

  /* ---- the link field ---- */
  const openLink = (mine: boolean) => {
    const E = eng.current; if (!E || E.reviewing()) return;
    closeMenu(false); E.flush();
    const o = E.get(), s = E.state();
    setLk({ o }); now.current.lk = { o }; setUrl(s.href || ''); setBad(false); setBubble(false); pick(o);
    requestAnimationFrame(() => { place(lnkEl.current, o); if (mine) urlEl.current?.focus({ preventScroll: true }); });
  };
  const closeLink = (back: boolean) => {
    const j = now.current.lk; if (!j) return;
    now.current.lk = null; setLk(null); pick(null);
    if (back) eng.current?.set(j.o, true);
  };
  const toUrl = (v: string) => { v = v.trim(); if (!v) return null; if (/^(https?:\/\/|mailto:)/i.test(v)) return v; if (/^[^\s@/]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'mailto:' + v; if (/^[\w-]+(\.[\w-]+)+(:\d+)?([/?#]\S*)?$/.test(v)) return 'https://' + v; return null; };
  const applyLink = (href: string | null) => {
    const E = eng.current, j = now.current.lk; if (!E || !j) return;
    if (href === '') { const h = toUrl(url); if (!h) { setBad(true); urlEl.current?.focus({ preventScroll: true }); return; } href = h; }
    closeLink(false); E.set(j.o); E.link(j.o, href); E.focus();
  };

  // text given from outside goes in without being reported back
  const load = (html: string) => { const E = eng.current; if (!E) return; quiet.current = true; E.load(html); quiet.current = false; emitted.current = E.html(); };

  // the engine starts once, with the text it is given
  useEffect(() => {
    const el = ed.current!; setMac(isMac());
    const E = createEngine(el, {
      change: paint,
      select: () => { paint(); showBubble(); },
      // a / typed at the start of a line opens the menu
      input: e => { if (e.inputType === 'insertText' && e.data === '/') { const o = E.get(); if (o.s === o.e && E.line(o.s).s === o.s - 1) openMenu('slash'); } },
      key: e => {
        if (E.reviewing()) {
          if ((e.key === 'Tab' || e.key === 'Enter') && !e.shiftKey && !e.altKey && !e.metaKey && !e.ctrlKey) { e.preventDefault(); finish(true, true); return true; }
          if (e.key === 'Escape' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z')) { e.preventDefault(); e.stopPropagation(); finish(false, true); return true; }
          return false;
        }
        const mod = isMac() ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey, k = e.key.toLowerCase();
        if (mod && !e.altKey && !e.shiftKey && (k === 'k' || (k === 'j' && now.current.ai))) { e.preventDefault(); e.stopPropagation(); if (k === 'k') openLink(true); else openMenu('key'); return true; }
        if (e.key === 'Escape') { setBubble(false); return false; }
        return false;
      }
    });
    eng.current = E;
    load(value ?? defaultValue);
    const down = (e: PointerEvent) => {
      const t = e.target as Node;
      if (now.current.job && !menuEl.current?.contains(t) && !askEl.current?.contains(t) && !(t as Element).closest?.('.dm-rte-ai')) closeMenu(false);
      if (now.current.lk && !lnkEl.current?.contains(t) && !(t as Element).closest?.('[data-f="a"]')) closeLink(false);
      if (e.isTrusted && !askEl.current?.contains(t) && !now.current.job) { setBubble(false); if (!root.current?.contains(t)) pick(null); }
    };
    const resize = () => { closeMenu(false); closeLink(false); setBubble(false); };
    document.addEventListener('pointerdown', down); addEventListener('resize', resize);
    return () => { run.current?.ctl.abort(); run.current = null; pick(null); E.destroy(); eng.current = null; document.removeEventListener('pointerdown', down); removeEventListener('resize', resize); };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // a new value from outside replaces the text; the value the editor itself just reported is already there
  useEffect(() => {
    const E = eng.current; if (!E || value === undefined || value === emitted.current) return;
    if (E.reviewing()) { run.current?.ctl.abort(); run.current = null; setReview(null); }
    load(value);
  }, [value]);

  useImperativeHandle(ref, () => ({
    focus: () => eng.current?.focus(),
    getHTML: () => eng.current?.html() || '',
    getText: () => { const E = eng.current; return E ? E.text({ s: 0, e: E.total() }) : ''; },
    setHTML: html => load(html),
    select: s => {
      const E = eng.current; if (!E) return false;
      const at = E.text({ s: 0, e: E.total() }).indexOf(s); if (at < 0 || !s) return false;
      const o = { s: at, e: at + s.length }; E.set(o); E.show(o); pick(o); showBubble(o); paint(); return true;
    },
    type: s => eng.current?.type(s),
    newLine: () => eng.current?.split(),
    format: f => { const E = eng.current; if (!E || E.reviewing()) return; if (f === 'b' || f === 'i' || f === 'code') E.inline(f.toUpperCase()); else E.block(f); },
    openAi: () => openMenu('script'),
    ask: a => ask(a, false),
    accept: () => finish(true, false),
    discard: () => finish(false, false),
    undo: () => eng.current?.undo(),
    redo: () => eng.current?.redo()
  }));

  const busy = !!review;
  const items = aiActions.map(a => ({ ...a, off: (a.kind || 'swap') === 'swap' && !!job && !(eng.current?.text(job.t).trim()) }));
  const tools = TOOLS.map(t => ({ ...t, on: t.f === 'a' ? ui.A : /^(h2|ul|ol|quote)$/.test(t.f) ? ui.block === t.f : !!ui[t.f.toUpperCase() as 'B' | 'I' | 'CODE'] }));
  const tbButtons = () => [...(tb.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') || [])];
  // the toolbar is one tab stop; the arrow keys move along it, Home and End jump to its ends
  const tbKey = (e: ReactKeyboardEvent) => {
    const all = tbButtons(), i = all.indexOf(document.activeElement as HTMLButtonElement); if (i < 0) return;
    const go = ({ ArrowRight: all[(i + 1) % all.length], ArrowLeft: all[(i - 1 + all.length) % all.length], Home: all[0], End: all[all.length - 1] } as Record<string, HTMLButtonElement | undefined>)[e.key];
    if (go) { e.preventDefault(); go.focus(); }
  };
  const apply = (f: RichTextFormat | 'a', mine: boolean) => {
    const E = eng.current; if (!E || E.reviewing()) return;
    if (f === 'a') { if (now.current.lk) closeLink(true); else openLink(mine); return; }
    if (f === 'b' || f === 'i' || f === 'code') E.inline(f.toUpperCase()); else E.block(f);
    if (mine) E.focus();
  };
  const menuKey = (e: ReactKeyboardEvent) => {
    const all = menuItems(), i = all.indexOf(document.activeElement as HTMLButtonElement);
    const go = ({ ArrowDown: all[(i + 1) % all.length], ArrowUp: all[(i - 1 + all.length) % all.length], Home: all[0], End: all[all.length - 1] } as Record<string, HTMLButtonElement | undefined>)[e.key];
    if (go) { e.preventDefault(); focusItem(go); }
    else if (e.key === 'Escape' || e.key === 'Tab') { e.preventDefault(); e.stopPropagation(); closeMenu(true); }
    else if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey) { const k = e.key.toLowerCase(), hit = [...all.slice(i + 1), ...all.slice(0, i + 1)].find(m => (m.textContent || '').trim().toLowerCase().startsWith(k)); if (hit) focusItem(hit); }
  };
  const keep = (e: { preventDefault: () => void; target: EventTarget }) => { if ((e.target as Element).closest('button')) e.preventDefault(); };
  const act = review && aiActions.find(a => a.key === review.action);

  return (
    <div data-dm="" ref={root} className={cx('dm-rte', className)} data-st={busy ? 'review' : 'edit'}
      onKeyDown={e => { if (e.key === 'Escape' && busy && !ed.current?.contains(e.target as Node)) { e.preventDefault(); e.stopPropagation(); finish(false, true); } }}
      onPointerDownCapture={e => { if (e.isTrusted && !now.current.job) pick(null); }}>
      <div ref={tb} className="dm-rte-tb" role="toolbar" aria-label="Formatting" onMouseDown={keep} onKeyDown={tbKey}
        onFocus={e => { const all: Element[] = [...(tb.current?.querySelectorAll('button') || [])]; const i = all.indexOf(e.target); if (i >= 0) setFocusTb(i); }}>
        {tools.map((t, i) => (
          <span key={t.f} style={{ display: 'contents' }}>
            {i === 5 && <span className="dm-rte-sep" aria-hidden="true" />}
            <Tip label={t.label} kbd={keysOf(t.k, mac)}>
              <button type="button" className={cx('dm-rte-b', t.f === 'a' && t.on && !busy && 'dm-on')} data-f={t.f} aria-label={t.label} disabled={busy} tabIndex={focusTb === i ? 0 : -1}
                {...(t.f === 'a' ? { 'aria-haspopup': 'dialog' as const, 'aria-expanded': !!lk } : { 'aria-pressed': !busy && t.on })}
                onClick={e => apply(t.f, e.isTrusted)}><Icon name={t.icon} size="m" /></button>
            </Tip>
          </span>
        ))}
        <span className="dm-sp" />
        {ai && (
          <Tip label="Edit or write with AI" kbd={keysOf('mod J', mac)} off={!!job}>
            <button type="button" className="dm-rte-ai" aria-label="Ask AI" aria-haspopup="menu" aria-expanded={!!job} disabled={busy} tabIndex={focusTb === TOOLS.length ? 0 : -1}
              onClick={e => openMenu(e.isTrusted ? (e.detail ? 'click' : 'key') : 'script')}><Icon name="spark" /><span>Ask AI</span></button>
          </Tip>
        )}
      </div>
      <div ref={ed} className={cx('dm-rte-body', ui.empty && !busy && 'dm-empty')} contentEditable suppressContentEditableWarning role="textbox" aria-multiline="true"
        aria-label={label} aria-placeholder={placeholder} data-placeholder={placeholder} spellCheck />
      <div className="dm-rte-ft">
        <div className="dm-rte-idle" onMouseDown={keep}>
          <span className="dm-rte-wc dm-num">{ui.words === 1 ? '1 word' : ui.words + ' words'}</span>
          {ai && hint && <span className="dm-rte-hint">{hint}</span>}
          <span className="dm-sp" />
          <Tip label="Undo" kbd={keysOf('mod Z', mac)}><button type="button" className="dm-ib dm-rte-un" aria-label="Undo" disabled={busy || !ui.undo} onClick={e => { eng.current?.undo(); if (e.isTrusted) eng.current?.focus(); }}><Icon name="undo" /></button></Tip>
          <Tip label="Redo" kbd={keysOf('redo', mac)}><button type="button" className="dm-ib dm-rte-re" aria-label="Redo" disabled={busy || !ui.redo} onClick={e => { eng.current?.redo(); if (e.isTrusted) eng.current?.focus(); }}><Icon name="redo" /></button></Tip>
        </div>
        <div className="dm-rte-rev" onMouseDown={keep}>
          <span className="dm-rte-st">
            {review && !review.ready ? <><span className="dm-think dm-on" aria-hidden="true"><i /><i /><i /><i /></span><span className="dm-shim">{act?.label}</span></>
              : review ? <><Icon name="spark" /><span>Suggestion ready</span></> : null}
          </span>
          <span className="dm-sp" />
          <button type="button" className="dm-pill dm-ghost dm-sm dm-rte-no" onClick={e => finish(false, e.isTrusted)}>Discard<span className="dm-kbd">Esc</span></button>
          <button type="button" className="dm-pill dm-accent dm-sm dm-rte-ok" disabled={!review?.ready} onClick={e => finish(true, e.isTrusted)}>Accept<span className="dm-kbd">Tab</span></button>
        </div>
      </div>
      {ai && (
        <button ref={askEl} type="button" className={cx('dm-rte-ask', bubble && 'dm-show')} tabIndex={-1} aria-label="Ask AI about the selection"
          onMouseDown={e => e.preventDefault()} onClick={e => openMenu(e.isTrusted ? 'click' : 'script')}><Icon name="spark" /><span>Ask AI</span></button>
      )}
      {ai && (
        <div ref={menuEl} className={cx('dm-pop dm-rte-menu', job && 'dm-open')} role="menu" aria-labelledby={uid + '-ph'} inert={!job}
          onKeyDown={menuKey} onMouseDown={e => e.preventDefault()}>
          <div className="dm-ph" id={uid + '-ph'}>{job?.sel ? 'Edit the selection' : items.some(x => !x.off && (x.kind || 'swap') === 'swap') ? 'Edit this paragraph' : 'Write with AI'}</div>
          {items.map(a => (
            <button key={a.key} type="button" className="dm-mi" role="menuitem" tabIndex={-1} aria-disabled={a.off}
              onClick={e => { if (!a.off) ask(a.key, e.isTrusted); }}>{a.icon && <Icon name={a.icon} />}<span>{a.label}</span></button>
          ))}
        </div>
      )}
      <div ref={lnkEl} className={cx('dm-pop dm-rte-lnk', lk && 'dm-open')} role="dialog" aria-label="Link" inert={!lk}
        onKeyDown={e => { if (e.key === 'Enter' && e.target === urlEl.current) { e.preventDefault(); applyLink(''); } else if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeLink(true); } }}
        onBlur={e => { if (now.current.lk && e.relatedTarget && !lnkEl.current?.contains(e.relatedTarget as Node)) closeLink(false); }}>
        <input ref={urlEl} className="dm-rte-url" type="url" placeholder="Paste or type a link" aria-label="Link address" autoComplete="off" spellCheck={false}
          value={url} aria-invalid={bad || undefined} onChange={e => { setUrl(e.target.value); setBad(false); }} />
        <button type="button" className="dm-pill dm-accent dm-sm dm-rte-lok" onClick={() => applyLink('')}>Apply</button>
        {ui.href && lk && <Tip label="Remove link"><button type="button" className="dm-ib dm-rte-lrm" aria-label="Remove link" onClick={() => applyLink(null)}><Icon name="trash" /></button></Tip>}
      </div>
      <p className="dm-rte-live" aria-live="polite">{say}</p>
    </div>
  );
}
```

## More in Conversation

- [Live answer](https://designme.dev/components/live-answer.md): Answers that stream in with numbered sources and next steps.
- [Composer](https://designme.dev/components/composer.md): Message input with attachments, what to work on, a mode and dictation.
- [Thread panel](https://designme.dev/components/thread-panel.md): Switch between agent threads and reply in place.
- [Artifact card](https://designme.dev/components/artifact-card.md): A file the agent made, with its versions, Open, Copy and Download.
- [Tool call](https://designme.dev/components/tool-call.md): Each tool the agent calls, with its input and output.
- [Voice capture](https://designme.dev/components/voice-capture.md): Talk to the agent, then fix what it misheard before sending.
- [Voice orb](https://designme.dev/components/voice-orb.md): A hands-free voice chat, with an orb that shows who is talking.
- [Answer action bar](https://designme.dev/components/answer-action-bar.md): Copy, regenerate, rate and listen to an answer from one row under it.
- [Response versions](https://designme.dev/components/response-versions.md): Regenerate an answer and flip between versions.
- [Model picker](https://designme.dev/components/model-picker.md): Pick a model by speed, quality and cost, and how hard it thinks.
- [Prompt starters](https://designme.dev/components/prompt-starters.md): Suggested tasks that fill the composer in one click.
- [Prompt library](https://designme.dev/components/prompt-library.md): Saved prompts with blanks to fill in before they go to the agent.
- [Attachment tray](https://designme.dev/components/attachment-tray.md): Drop files for the agent and watch each one upload.
- [Feedback sheet](https://designme.dev/components/feedback-sheet.md): Rate an answer and tell the agent what missed.

All components: https://designme.dev/llms.txt
