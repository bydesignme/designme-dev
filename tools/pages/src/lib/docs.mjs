// The docs at /docs/<page>: their text, as blocks that render both as the HTML page and as its Markdown copy (/docs/<page>.md).
// Every claim has to be true of the code. Where each fact comes from:
//   install and the CLI    packages/designme/bin/designme.js, packages/designme/README.md, packages/designme/package.json
//   React                  packages/react/README.md, packages/react/src (designme.css, lib/hooks.ts)
//   styles and tokens      soft-2/index.html and r/core.json (the shared core the CLI installs)
//   the site's own accent   tools/site/make-patches.py (the accent picker and its roles)
//   accessibility          the a11y lists in tools/pages/content/*.json, and the reduced-motion rules in the core
// The titles, one-line descriptions and order live in docs-list.json, which tools/site/build.js also reads for llms.txt.
// Inline text: `code` and [label](url). A block is ['p', text], ['ul' or 'ol', [text…]], ['code', lang, text] or
// ['table', [heads…], [[cells…]…]].
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITE, SECTIONS, COMPONENTS } from './data.mjs';

const LIST = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/pages/src/lib/docs-list.json'), 'utf8'));

// a link to a component's page, which has to exist
const C = reg => {
  const c = COMPONENTS.find(x => x.reg === reg);
  if (!c) throw new Error(`docs: no component called ${reg}`);
  return `[${c.title}](/components/${reg})`;
};
const D = slug => {
  const d = LIST.find(x => x.slug === slug);
  if (!d) throw new Error(`docs: no page called ${slug}`);
  return `[${d.title}](/docs/${slug})`;
};
const count = COMPONENTS.length;
const inSet = g => SECTIONS.filter(s => s.grp === g);
const nOf = g => inSet(g).reduce((n, s) => n + s.cards.length, 0);
const names = g => { const t = inSet(g).map(s => s.title); return t.slice(0, -1).join(', ') + ' and ' + t[t.length - 1]; };

const BODY = {
  introduction: {
    lead: 'Designme.dev is a free library of UI components for products built around AI agents.',
    sections: [
      ['What it is', [
        ['p', `${count} free components: ${nOf('agent')} for the agent itself and ${nOf('basics')} app basics around it.`],
        ['ul', [
          `Agent components: ${names('agent')}. Status pills, reasoning trails, tool calls, permission gates, plan reviews, run summaries and more.`,
          `App basics: ${names('basics')}.`,
        ]],
        ['p', 'Every component plays as a demo on the [homepage](/), and has a page of its own with its install command, React props, code and questions.'],
      ]],
      ['HTML or React', [
        ['ul', [
          'HTML, CSS and JavaScript, on a small shared core that holds the tokens, icons and helpers.',
          'A typed React component for React 19, with no dependencies beyond React. It works in Next.js, Vite and Astro.',
        ]],
        ['p', `Either way, the CLI copies the source into your project, so it is yours to change. See ${D('installation')}.`],
      ]],
      ['Two styles, light and dark', [
        ['ul', [
          'Soft: quiet, rounded surfaces with a blue accent. designme.dev opens in Soft.',
          'Blueprint: the same components drawn as a technical sheet, with square corners, hairline edges and a lime accent.',
        ]],
        ['p', `Each style has a light and a dark theme. Switch them in the header of any page here. In your own project, two attributes on \`<html>\` pick them. See ${D('theming')}.`],
      ]],
      ['Free and MIT licensed', [
        ['p', 'Use the components in personal and commercial work. The code is MIT licensed, and built by [DesignMe](https://designme.agency).'],
        ['p', 'Avatars, icons, flags, brand logos and fonts keep their own licences. They are listed under Credits in the [designme package on npm](https://www.npmjs.com/package/designme).'],
      ]],
    ],
  },

  installation: {
    lead: 'Add components with the designme CLI. It copies their source into your project, so you own it.',
    sections: [
      ['Before you start', [
        ['ul', [
          'Node 18 or later, to run the CLI.',
          'React 19, for the React components.',
        ]],
        ['p', 'Find a component\'s install name on its page, or list them all:'],
        ['code', 'sh', 'npx designme list'],
      ]],
      ['HTML, CSS and JavaScript', [
        ['code', 'sh', 'npx designme add status-pill thinking composer'],
        ['p', 'Each component lands in its own folder in `./designme`, with its `.html`, `.css` and `.js`. The shared core, `core/core.css` and `core/core.js`, is added once. Every component also gets a `demo.html` you can open straight away.'],
        ['p', 'To use one in a page, load the core and the component\'s files, and copy in the markup from its `.html`:'],
        ['code', 'html', '<link rel="stylesheet" href="designme/core/core.css">\n<link rel="stylesheet" href="designme/status-pill/status-pill.css">\n\n<!-- the markup from designme/status-pill/status-pill.html -->\n\n<script src="designme/core/core.js"></script>\n<script src="designme/status-pill/status-pill.js"></script>'],
        ['p', 'The core renders each component when it scrolls into view and plays its demo. To feed one your own data, change its `.js`, or use the React version, which takes props.'],
      ]],
      ['React', [
        ['code', 'sh', 'npx designme add status-pill thinking composer --react'],
        ['p', 'They land in `src/components/designme`, or `components/designme` when there is no `src` folder. Only the shared files they need come with them: `designme.css` and a few helpers in `lib/`. Each component imports its own styles, so importing it is all it takes:'],
        ['code', 'tsx', `import { StatusPill } from '@/components/designme/status-pill/StatusPill';\n\n<StatusPill state="reading" label="Reading Figma frames" meta="2 of 4" />`],
        ['p', 'Every component takes `className`. Anything a person can change has a controlled pair, like `value` and `onValueChange`, and a `default…` prop for leaving it to the component. Each component\'s page lists its props.'],
        ['p', 'Load Inter and JetBrains Mono for the full look. Without them, the components fall back to the system font.'],
        ['p', 'Every class, CSS variable and animation name starts with `dm-`, so the components sit beside Tailwind, shadcn/ui or your own CSS without clashing.'],
      ]],
      ['Frameworks', [
        ['ul', [
          'Next.js (App Router): every component file starts with `\'use client\'`, so you can render them from server components. On the Pages Router, import `designme.css` and each component\'s `.css` in `pages/_app.tsx`, and delete the two CSS imports at the top of those components.',
          'React with Vite: nothing extra to set up.',
          'Astro: add the React integration with `npx astro add react`. Hydrate the components that change over time, for example with `client:visible`.',
        ]],
      ]],
      ['Options', [
        ['table', ['Option', 'What it does'], [
          ['`--react`', 'React components instead of HTML, CSS and JavaScript'],
          ['`--examples`', 'With `--react`, an example beside each component that replays its demo from designme.dev'],
          ['`--dir <path>`', 'Put the files somewhere else'],
          ['`--force`', 'Replace files you already have'],
        ]],
        ['p', 'The CLI downloads each component from designme.dev and skips files that are already there. `--force` replaces them with the current version, including any changes you made.'],
      ]],
    ],
  },

  theming: {
    lead: 'Two attributes on `<html>` pick the style and the theme, and one accent colours the rest.',
    sections: [
      ['Style', [
        ['p', 'The components draw Blueprint by default. Add `data-style="soft"` to `<html>` for Soft:'],
        ['code', 'html', '<html data-style="soft">'],
        ['p', 'designme.dev opens in Soft and remembers the style you pick in the header.'],
      ]],
      ['Light and dark', [
        ['p', 'Without `data-theme`, the components follow the device\'s setting. Set it to fix the theme:'],
        ['code', 'html', '<html data-theme="dark">   <!-- or data-theme="light" -->'],
        ['p', 'To switch from your own control, change the attribute. Remove it to follow the device again:'],
        ['code', 'js', `document.documentElement.setAttribute('data-theme', 'dark');\ndocument.documentElement.removeAttribute('data-theme');`],
      ]],
      ['The accent and its roles', [
        ['p', 'One accent runs through every component. It has a few roles, so a light colour like lime stays readable:'],
        ['table', ['HTML', 'React', 'What it is for'], [
          ['`--accent`', '`--dm-accent`', 'Fills: buttons, switches and selected states'],
          ['`--on-accent`', '`--dm-on-accent`', 'Text and icons on an accent fill'],
          ['`--accent-fg`', '`--dm-accent-fg`', 'The accent as text and icons, aiming for 4.5:1'],
          ['`--accent-mark`', '`--dm-accent-mark`', 'Lines, borders, focus rings and chart marks, aiming for 3:1'],
          ['`--accent-2`', '`--dm-accent-2`', 'An accent fill on hover'],
          ['`--accent-bg`', '`--dm-accent-bg`', 'A light tint for pressed, selected and hovered items'],
        ]],
        ['p', 'The contrast targets hold on the surface, and on the grey chips and tinted rows the accent sits on.'],
      ]],
      ['The defaults', [
        ['ul', [
          'Soft is blue: `#116ff8` in light mode, with white text on it, and `#3d8bff` in dark mode, with dark text on it.',
          'Blueprint is lime, `#d4f84a`, with dark text and icons on it. In dark mode, text and marks are lime too. In light mode, lime is too light to read on white, so accent text uses the ink colour and marks use a darker lime, `#7a8e2b`.',
        ]],
      ]],
      ['Your own accent', [
        ['p', 'Set the roles together. Mark them `!important`: each style and theme sets the accent with a more specific selector, so a plain `:root` rule only reaches Soft in light mode.'],
        ['code', 'css', `:root{\n  --accent:#ffe600 !important;       /* fills */\n  --accent-2:#f2d900 !important;     /* fills on hover */\n  --accent-bg:#fffbd6 !important;    /* tints */\n  --on-accent:#121212 !important;    /* text on fills */\n  --accent-fg:#111318 !important;    /* the accent as text, 4.5:1 */\n  --accent-mark:#988900 !important;  /* lines, rings and chart marks, 3:1 */\n}`],
        ['p', 'In React, use the same names with `dm-` in front: `--dm-accent`, `--dm-on-accent` and so on. For other shades in dark mode, repeat the rule under `:root[data-theme="dark"]` and under `@media (prefers-color-scheme: dark)` with `:root:not([data-theme="light"])`.'],
      ]],
      ['Picking an accent on designme.dev', [
        ['p', 'On the homepage, the dot beside the style switch picks an accent. On smaller screens it is in the menu. The site then works out the other roles from your colour:'],
        ['ul', [
          'Text on a fill is white when white reaches 4.5:1, otherwise whichever of white or near-black reads better.',
          'Text and marks start from your colour and are darkened on a light page, or lightened on a dark one, until they reach 4.5:1 and 3:1. If text would need too big a change, it uses the ink colour instead.',
        ]],
        ['p', 'This runs on the site only. In your project, set the roles yourself as shown above.'],
      ]],
      ['Charts follow the accent', [
        ['p', `A chart's first colour is the accent's mark: \`--c1\` (\`--dm-c1\` in React) is \`--accent-mark\`. \`--a2\` to \`--a4\` mix it toward the surface for lighter steps. So ${C('line-chart')}, ${C('bar-chart')} and ${C('donut-chart')} change with the accent. Other series use fixed colours, \`--c2\` to \`--c6\`.`],
      ]],
      ['Fonts', [
        ['p', 'The components use Inter and JetBrains Mono, and fall back to the system font. In React, override `--dm-sans` and `--dm-mono` to use others, for example the families `next/font` gives you.'],
      ]],
    ],
  },

  accessibility: {
    lead: 'What the components do for people using a keyboard, a screen reader or reduced motion, and where they still fall short.',
    sections: [
      ['Roles and labels', [
        ['p', 'Components use the ARIA pattern that fits what they do. For example:'],
        ['ul', [
          `Menus are a \`menu\` of \`menuitem\` rows, and the button that opens one reports \`aria-expanded\` (${C('buttons')}).`,
          `Lists you pick from are a \`listbox\` of \`option\` rows. The search box that drives one is a \`combobox\` (${C('command-palette')}, ${C('country-select')}).`,
          `A single choice is a \`radiogroup\`, and an on or off setting is a \`switch\` with \`aria-checked\` (${C('decision-prompt')}, ${C('agent-settings')}).`,
          `Tabs use \`tablist\`, \`tab\` and \`aria-selected\` (${C('code-viewer')}, ${C('thread-panel')}, ${C('segmented-control')}).`,
          `Sliders set \`aria-valuenow\` and \`aria-valuetext\` (${C('design-tuner')}). A file tree is a \`tree\` of \`treeitem\` rows (${C('file-explorer')}).`,
          `Popovers like the calendar are a labelled \`dialog\` (${C('date-picker')}, ${C('citation-hover-card')}).`,
          `Toggle buttons report their state with \`aria-pressed\`, and icon-only buttons have a label (${C('buttons')}, ${C('line-chart')}).`,
        ]],
      ]],
      ['Live updates', [
        ['p', `Agent work changes while you watch. The parts that change are \`aria-live="polite"\` regions, so the change is read out: ${C('status-pill')}, the thread above ${C('composer')}, the message line of ${C('context-meter')}, the thread in ${C('comments')} and the month in ${C('date-picker')}.`],
        ['p', 'Decorative motion, like status glyphs and the wires of a canvas, is `aria-hidden`, so screen readers hear the words, not the animation.'],
      ]],
      ['Keyboard', [
        ['ul', [
          `Escape closes menus and popovers, for example in ${C('composer')} and ${C('date-picker')}. In ${C('buttons')}, ${C('country-select')} and ${C('date-picker')} it also returns focus to the button or field that opened them.`,
          `Arrow keys move through lists, menus and toolbars (${C('command-palette')}, ${C('country-select')}, ${C('answer-action-bar')}).`,
          `In the date pickers, the arrows move a day or a week, Home and End go to the start and end of the week, and Page Up and Page Down move a month, or a year with Shift (${C('date-picker')}, ${C('date-range-picker')}).`,
          `Number keys 1 to 9 pick an option in ${C('decision-prompt')}.`,
          'Focus shows as a 2px ring in the accent\'s mark colour, using `:focus-visible`.',
        ]],
        ['p', `Most components work fully with a keyboard. A few, like ${C('kanban-board')} and ${C('file-explorer')}, are still getting their keyboard support.`],
      ]],
      ['Reduced motion', [
        ['p', 'When the device asks for less motion (`prefers-reduced-motion: reduce`), the shared CSS cuts every CSS animation and transition inside the components to almost nothing.'],
        ['p', 'The scripts check it too. The HTML version reads `REDUCE`, which the core sets from the same setting. React components that animate from script use the `useReducedMotion()` hook from `lib/hooks.ts`. Count-ups finish at once, rows move without gliding, and the content still changes.'],
      ]],
      ['Contrast', [
        ['ul', [
          `The accent has separate roles for fills, text and marks. Text in the accent aims for 4.5:1 and marks for 3:1, on the surface and on the grey chips and tinted rows they sit on. See ${D('theming')}.`,
          'Blueprint\'s lime is too light for text on white, so in light mode accent text uses the ink colour and marks a darker lime.',
          'An off switch and an empty box are drawn in a grey that holds 3:1 against the surface. An accent fill keeps a thin edge in the mark colour, so a light accent still has an outline.',
        ]],
      ]],
      ['For each component', [
        ['p', 'Every component\'s page lists what it does under About, then Accessibility. Its Markdown copy has the same list. These notes describe what the code does. Check your product with your own content and assistive technology too.'],
      ]],
    ],
  },

  'using-with-ai': {
    lead: 'Every page here has a Markdown copy, so a coding agent can read what a component is for, how to install it and its full source.',
    sections: [
      ['Markdown pages', [
        ['p', 'Add `.md` to a component\'s address:'],
        ['code', 'text', `${SITE}/components/composer.md`],
        ['p', 'Each one has:'],
        ['ul', [
          'What the component is for, when to use it and what it does',
          'Its install commands for HTML and React',
          'Its accessibility notes and questions',
          'The React import, an example and a table of props',
          'The full React source, as the CLI installs it',
          'Links to the other components in its section',
        ]],
        ['p', `These docs have Markdown copies too, like \`${SITE}/docs/theming.md\`.`],
      ]],
      ['llms.txt', [
        ['p', `[${SITE}/llms.txt](/llms.txt) lists every component by section, each with one line about it, its Markdown page and its install command. It also lists these docs. Start an agent there when it needs to choose components.`],
        ['p', 'The CLI installs from the registry: each component as JSON, at `/r/<name>.json` for HTML and `/r/react/<name>.json` for React.'],
      ]],
      ['Point an agent at them', [
        ['ol', [
          'Give it llms.txt, so it can pick the components for your screen.',
          'Give it the Markdown page of each component it picks.',
          'Ask it to install them with the CLI, rather than write them from memory.',
        ]],
        ['p', 'Agents that can fetch a URL can read these pages themselves. Otherwise, open the page and paste it in.'],
      ]],
      ['A prompt to start from', [
        ['code', 'text', `Read ${SITE}/llms.txt and pick the components for our run history screen.\nFor each one, read its .md page, then install it with:\n  npx designme add <name> --react\nKeep the installed files as they are and drive the components through their props from our state.\nUse the Soft style: add data-style="soft" to <html>.`],
      ]],
      ['Tips', [
        ['ul', [
          'Name components by their install name, like `status-pill` or `permission-gate`, so the agent finds the right page.',
          'Ask for the controlled props, like `value` and `onValueChange`, when your state should own a value.',
          `Ask it to change the accent through its tokens, all the roles together, not by editing each component's CSS. See ${D('theming')}.`,
          'Ask it to keep the roles, labels and keyboard handling listed under Accessibility when it changes the markup.',
          'For the HTML version, tell it that each component plays a scripted demo from its `.js`. The React version takes props.',
        ]],
      ]],
    ],
  },
};

const slugify = s => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const DOCS = LIST.map((d, i) => {
  const b = BODY[d.slug];
  if (!b) throw new Error(`docs: no text for ${d.slug}`);
  return { ...d, url:`/docs/${d.slug}`, lead:b.lead, sections:b.sections.map(([h, blocks]) => ({ id:slugify(h), h, blocks })), n:i };
});
DOCS.forEach((d, i) => { d.prev = DOCS[i - 1] || null; d.next = DOCS[i + 1] || null; });

/* ---- inline text: `code` and [label](url) ---- */
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function inlineHtml(s){
  return s.split(/(`[^`]+`)/).map(part => {
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) return `<code>${esc(part.slice(1, -1))}</code>`;
    return esc(part).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' rel="noopener"' : ''}>${t}</a>`);
  }).join('');
}
// in Markdown, site links become full addresses, and a component or docs page points at its Markdown copy
const abs = u => u.startsWith('/') ? SITE + (/^\/(components|docs)\/[\w-]+$/.test(u) ? u + '.md' : u) : u;
export const inlineMd = s => s.split(/(`[^`]+`)/).map(part => part.startsWith('`') ? part : part.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `[${t}](${abs(u)})`)).join('');
