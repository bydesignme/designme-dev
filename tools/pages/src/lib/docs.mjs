// The docs at /docs/<page>: their text, as blocks that render both as the HTML page and as its Markdown copy (/docs/<page>.md).
// Every claim has to be true of the code. Where each fact comes from:
//   install and the CLI    packages/designme/bin/designme.js, packages/designme/README.md, packages/designme/package.json
//   React                  packages/react/README.md, packages/react/src (designme.css, lib/hooks.ts)
//   styles and tokens      soft-2/index.html and r/core.json (the shared core the CLI installs)
//   the site's own accent   tools/site/make-patches.py (the accent picker and its roles)
//   accessibility          the a11y lists in tools/pages/content/*.json, and the reduced-motion rules in the core
// The titles, one-line descriptions and order live in docs-list.json, which tools/site/build.js also reads for llms.txt.
// Inline text: `code` and [label](url). The blocks (DocsBlocks.astro draws them, src/pages/docs/[slug].md.ts writes them):
//   ['p', text]  ['ul' or 'ol', [text…]]  ['note', text]
//   ['code', lang, text, label?]              a block of code with Copy; label names it in its bar
//   ['table', [heads…], [[cells…]…]]
//   ['steps', [[title, [blocks…]]…]]          numbered steps along a line
//   ['tabs', [[label, [blocks…]]…]]           one panel at a time, picked from a switch
//   ['items', [[title, [blocks…]]…]]          a plain list: each item's name, then what it says, one under another
//   ['tree', label, [entry…]]                 where files land: an entry is 'name' or ['folder/', [entry…]]
//   ['cards', [[title, text, href, icon]…]]   links as cards
//   ['keys', [[[key…], text, [component…]]…]] keys, what they do and where
//   ['agents', text]                          every agent component by group, each a plain link, then one line of text
//   ['styles', component], ['swatches'], ['preview']   the visuals, drawn from the library itself
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITE, SECTIONS, SETS, COMPONENTS } from './data.mjs';

const LIST = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/pages/src/lib/docs-list.json'), 'utf8'));

// a component, which has to exist: as a link in text, or as itself for the blocks that list components
export const comp = reg => {
  const c = COMPONENTS.find(x => x.reg === reg);
  if (!c) throw new Error(`docs: no component called ${reg}`);
  return c;
};
const C = reg => { const c = comp(reg); return `[${c.title}](/components/${reg})`; };
const D = slug => {
  const d = LIST.find(x => x.slug === slug);
  if (!d) throw new Error(`docs: no page called ${slug}`);
  return `[${d.title}](/docs/${slug})`;
};
const count = COMPONENTS.length;
const inSet = g => SECTIONS.filter(s => s.grp === g);
const nOf = g => inSet(g).reduce((n, s) => n + s.cards.length, 0);

// where `npx designme add status-pill thinking composer` puts its files, from the registry the CLI reads
const EXAMPLE = ['status-pill', 'thinking', 'composer'];
const reg = (...p) => JSON.parse(fs.readFileSync(path.join(ROOT, 'r', ...p), 'utf8'));
const htmlTree = (() => {
  const core = reg('core.json').files.map(f => f.path.split('/').pop());
  return ['designme/', [['core/', core], ...EXAMPLE.map(n => [`${n}/`, [...reg(n + '.json').files.map(f => f.path.split('/').pop()), 'demo.html']])]];
})();
const reactTree = (() => {
  const items = EXAMPLE.map(n => reg('react', n + '.json')), shared = [...new Set(items.flatMap(x => x.needs))];
  const top = shared.filter(p => !p.includes('/')), lib = shared.filter(p => p.startsWith('lib/')).map(p => p.slice(4));
  return ['src/components/designme/', [...top, ['lib/', lib], ...items.map(x => [`${x.name}/`, x.files.map(f => f.path.split('/').pop())])]];
})();
// a tree's entries as lines of text, for Markdown
export const treeText = (entries, pad = '') => entries.flatMap(e => Array.isArray(e) ? [pad + e[0], ...treeText(e[1], pad + '  ')] : [pad + e]);

const BODY = {
  introduction: {
    lead: 'Designme.dev is a free library of UI components for products built around AI agents.',
    sections: [
      ['What it is', [
        ['p', `${count} free components: ${nOf('agent')} for the agent itself, like status pills, reasoning trails, tool calls, permission gates, plan reviews and run summaries, and ${nOf('basics')} app basics around it.`],
        ['p', 'Every component plays as a demo on the [homepage](/), and has a page of its own with its install command, React props, code and questions.'],
      ]],
      ['Two styles, light and dark', [
        ['styles', 'decision-prompt'],
        ['items', [
          ['Soft', [['p', 'Quiet, rounded surfaces with a blue accent. designme.dev opens in Soft.']]],
          ['Blueprint', [['p', 'The same components drawn as a technical sheet, with square corners, hairline edges and a lime accent.']]],
        ]],
        ['p', `Each style has a light and a dark theme. Switch them in the header of any page here. In your own project, two attributes on \`<html>\` pick them. See ${D('theming')}.`],
      ]],
      ['What is in it', [
        ['agents', `There are also ${nOf('basics')} app basics, like charts, date pickers and forms, for the product around the agent. They are all in the [library](/#${inSet('basics')[0].id}).`],
      ]],
      ['HTML or React', [
        ['p', 'Every component comes in two versions. One is HTML, CSS and JavaScript on a small shared core that holds the tokens, icons and helpers. The other is a typed React component for React 19, with no dependencies beyond React, that works in Next.js, Vite and Astro.'],
        ['p', `Either way, the CLI copies the source into your project, so it is yours to change. See ${D('installation')}.`],
      ]],
      ['Free and MIT licensed', [
        ['p', 'Use the components in personal and commercial work. The code is MIT licensed, and built by [DesignMe](https://designme.agency).'],
        ['p', 'Avatars, icons, flags, brand logos and fonts keep their own licences. They are listed under Credits in the [designme package on npm](https://www.npmjs.com/package/designme).'],
      ]],
      ['Next steps', [
        ['cards', [
          ['Installation', LIST[1].desc, '/docs/installation', 'terminal'],
          ['Theming', LIST[2].desc, '/docs/theming', 'tune'],
          ['Accessibility', LIST[3].desc, '/docs/accessibility', 'check_circle'],
          ['Using with AI', LIST[4].desc, '/docs/using-with-ai', 'stars'],
        ]],
      ]],
    ],
  },

  installation: {
    lead: 'Add components with the designme CLI. It copies their source into your project, so you own it.',
    sections: [
      ['Before you start', [
        ['items', [
          ['Node 18 or later', [['p', 'To run the CLI.']]],
          ['React 19', [['p', 'For the React components.']]],
        ]],
        ['p', 'Find a component\'s install name on its page, or list them all:'],
        ['code', 'sh', 'npx designme list'],
      ]],
      ['Add components', [
        ['tabs', [
          ['HTML, CSS and JavaScript', [
            ['steps', [
              ['Add them', [
                ['code', 'sh', 'npx designme add status-pill thinking composer'],
                ['p', 'Each component lands in its own folder in `./designme`, with its `.html`, `.css` and `.js`. The shared core, `core/core.css` and `core/core.js`, is added once. Every component also gets a `demo.html` you can open straight away.'],
                ['tree', 'Your project', [htmlTree]],
              ]],
              ['Load them in a page', [
                ['p', 'Load the core and the component\'s files, and copy in the markup from its `.html`:'],
                ['code', 'html', '<link rel="stylesheet" href="designme/core/core.css">\n<link rel="stylesheet" href="designme/status-pill/status-pill.css">\n\n<!-- the markup from designme/status-pill/status-pill.html -->\n\n<script src="designme/core/core.js"></script>\n<script src="designme/status-pill/status-pill.js"></script>'],
              ]],
              ['Give them your data', [
                ['p', 'The core renders each component when it scrolls into view and plays its demo. To feed one your own data, change its `.js`, or use the React version, which takes props.'],
              ]],
            ]],
          ]],
          ['React', [
            ['steps', [
              ['Add them', [
                ['code', 'sh', 'npx designme add status-pill thinking composer --react'],
                ['p', 'They land in `src/components/designme`, or `components/designme` when there is no `src` folder. Only the shared files they need come with them: `designme.css` and a few helpers in `lib/`.'],
                ['tree', 'Your project', [reactTree]],
              ]],
              ['Import them', [
                ['p', 'Each component imports its own styles, so importing it is all it takes:'],
                ['code', 'tsx', `import { StatusPill } from '@/components/designme/status-pill/StatusPill';\n\n<StatusPill state="reading" label="Reading Figma frames" meta="2 of 4" />`],
              ]],
              ['Drive them from your state', [
                ['p', 'Every component takes `className`. Anything a person can change has a controlled pair, like `value` and `onValueChange`, and a `default…` prop for leaving it to the component. Each component\'s page lists its props.'],
                ['p', 'Load Inter and JetBrains Mono for the full look. Without them, the components fall back to the system font.'],
              ]],
            ]],
          ]],
        ]],
        ['note', 'Every class, CSS variable and animation name starts with `dm-`, so the components sit beside Tailwind, shadcn/ui or your own CSS without clashing.'],
      ]],
      ['Frameworks', [
        ['items', [
          ['Next.js', [['p', 'App Router: every component file starts with `\'use client\'`, so you can render them from server components.'], ['p', 'Pages Router: import `designme.css` and each component\'s `.css` in `pages/_app.tsx`, and delete the two CSS imports at the top of those components.']]],
          ['React with Vite', [['p', 'Nothing extra to set up.']]],
          ['Astro', [['p', 'Add the React integration with `npx astro add react`. Hydrate the components that change over time, for example with `client:visible`.']]],
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
        ['items', [
          ['Blueprint', [['p', 'What the components draw by default.'], ['code', 'html', '<html>']]],
          ['Soft', [['p', 'Add `data-style="soft"` to `<html>`, or to any element around the components to make just those Soft. Tooltips sit on the page, so they keep the page\'s style.'], ['code', 'html', '<html data-style="soft">']]],
        ]],
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
        ['preview'],
        ['table', ['HTML', 'React', 'What it is for'], [
          ['`--accent`', '`--dm-accent`', 'Fills: buttons, switches and selected states'],
          ['`--on-accent`', '`--dm-on-accent`', 'Text and icons on an accent fill'],
          ['`--accent-fg`', '`--dm-accent-fg`', 'The accent as text and icons, aiming for 4.5:1'],
          ['`--accent-mark`', '`--dm-accent-mark`', 'Lines, borders, focus rings and chart marks, aiming for 3:1'],
          ['`--accent-2`', '`--dm-accent-2`', 'An accent fill on hover'],
          ['`--accent-bg`', '`--dm-accent-bg`', 'A light tint for pressed, selected and hovered items'],
          ['`--focus`', '`--dm-focus`', 'Focus rings. It is `--accent-mark` unless you set it'],
        ]],
        ['p', 'The contrast targets hold on the surface, and on the grey chips and tinted rows the accent sits on.'],
      ]],
      ['The defaults', [
        ['swatches'],
        ['ul', [
          'Soft is blue, `#116ff8`, with white text on it, in light and dark mode. Accent text is `#0f5fd5` in light mode and `#9dc4ff` in dark mode.',
          'Blueprint is lime, `#d4f84a`, with dark text and icons on it. In dark mode, text and marks are lime too. In light mode, lime is too light to read on white, so accent text uses the ink colour and marks use a darker lime, `#7a8e2b`.',
        ]],
      ]],
      ['Your own accent', [
        ['p', 'Set the roles together. Mark them `!important`: each style and theme sets the accent with a more specific selector, so a plain `:root` rule only reaches Soft in light mode.'],
        ['code', 'css', `:root{\n  --accent:#ffe600 !important;       /* fills */\n  --accent-2:#f2d900 !important;     /* fills on hover */\n  --accent-bg:#fffbd6 !important;    /* tints */\n  --on-accent:#121212 !important;    /* text on fills */\n  --accent-fg:#121212 !important;    /* the accent as text, 4.5:1 */\n  --accent-mark:#988900 !important;  /* lines, rings and chart marks, 3:1 */\n}`],
        ['p', 'In React, use the same names with `dm-` in front: `--dm-accent`, `--dm-on-accent` and so on. For other shades in dark mode, repeat the rule under `:root[data-theme="dark"]` and under `@media (prefers-color-scheme: dark)` with `:root:not([data-theme="light"])`.'],
      ]],
      ['Picking an accent on designme.dev', [
        ['p', 'On the homepage, the dot beside the style switch picks an accent. On smaller screens it is in the menu. The site then works out the other roles from your colour:'],
        ['ul', [
          'Text on a fill is white or near-black, whichever APCA says reads better. The fill then moves a little darker or lighter until that text reaches 4.5:1 and APCA Lc 60.',
          'Text and marks start from your colour and are darkened on a light page, or lightened on a dark one, until text reaches 4.5:1 and APCA Lc 60, and marks 3:1. If text would need too big a change, it uses the ink colour instead.',
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
    lead: 'What the components do for people using a keyboard, a screen reader, a touch screen or reduced motion, and where they still fall short.',
    sections: [
      ['Roles and labels', [
        ['p', 'Components use the ARIA pattern that fits what they do. For example:'],
        ['table', ['Pattern', 'Roles and states', 'For example'], [
          ['Menus', 'A `menu` of `menuitem` rows. The button that opens one reports `aria-expanded`', C('buttons')],
          ['Lists you pick from', 'A `listbox` of `option` rows. The search box that drives one is a `combobox`', `${C('command-palette')}, ${C('country-select')}`],
          ['A single choice', 'A `radiogroup`', C('decision-prompt')],
          ['On or off settings', 'A `switch` with `aria-checked`', C('agent-settings')],
          ['Tabs', '`tablist`, `tab` and `aria-selected`', `${C('code-viewer')}, ${C('thread-panel')}, ${C('segmented-control')}`],
          ['Sliders', '`aria-valuenow` and `aria-valuetext`', C('design-tuner')],
          ['File trees', 'A `tree` of `treeitem` rows', C('file-explorer')],
          ['Popovers', 'A labelled `dialog`, like the calendar', `${C('date-picker')}, ${C('citation-hover-card')}`],
          ['Toggle and icon buttons', 'Toggles report their state with `aria-pressed`. Icon-only buttons have a label', `${C('buttons')}, ${C('line-chart')}`],
        ]],
      ]],
      ['Live updates', [
        ['p', `Agent work changes while you watch. The parts that change are \`aria-live="polite"\` regions, so the change is read out: ${C('status-pill')}, the thread above ${C('composer')}, the message line of ${C('context-meter')}, the thread in ${C('comments')} and the month in ${C('date-picker')}.`],
        ['p', 'Decorative motion, like status glyphs and the wires of a canvas, is `aria-hidden`, so screen readers hear the words, not the animation.'],
      ]],
      ['Keyboard', [
        ['keys', [
          [['Esc'], 'Closes menus and popovers', ['composer', 'date-picker']],
          [['Esc'], 'Also returns focus to the button or field that opened them', ['buttons', 'country-select', 'date-picker']],
          [['Enter', 'Space', '↓'], 'Open a menu with the focus on its picked or first item; ↑ opens it on its last', ['buttons', 'profile-menu']],
          [['Tab'], 'Closes a menu and moves on', ['buttons', 'profile-menu']],
          [['↑', '↓', '←', '→'], 'Move through lists, menus and toolbars, wrapping at the ends', ['command-palette', 'country-select', 'answer-action-bar']],
          [['Home', 'End'], 'Go to the first and last item of a menu', ['buttons', 'profile-menu']],
          [['←', '→', '↑', '↓'], 'In the date pickers, move a day or a week', ['date-picker', 'date-range-picker']],
          [['Home', 'End'], 'Go to the start and end of the week', ['date-picker', 'date-range-picker']],
          [['Page Up', 'Page Down'], 'Move a month, or a year with Shift', ['date-picker', 'date-range-picker']],
          [['1', '…', '9'], 'Pick an option', ['decision-prompt']],
        ]],
        ['p', 'Focus shows as one 2px ring in `--focus` (`--dm-focus` in React), the accent\'s mark colour: an outline 2px outside the control, or a 2px ring drawn with `box-shadow` on filled fields and where an outline would be cut off. It uses `:focus-visible`, so a click on a button doesn\'t show it.'],
        ['note', `Most components work fully with a keyboard. A few, like ${C('kanban-board')} and ${C('file-explorer')}, are still getting their keyboard support.`],
      ]],
      ['Reduced motion', [
        ['p', 'When the device asks for less motion (`prefers-reduced-motion: reduce`), the components cut it in two places:'],
        ['items', [
          ['In the CSS', [['p', 'The shared CSS cuts every CSS animation and transition inside the components to almost nothing.']]],
          ['In the scripts', [['p', 'The HTML version reads `REDUCE`, which the core keeps in step with the same setting as it changes, so turning it on or off takes effect without a reload, and turning it on finishes what a script is animating. React components that animate from script use the `useReducedMotion()` hook from `lib/hooks.ts`, which follows the setting live too.']]],
        ]],
        ['p', 'Count-ups finish at once, rows move without gliding, and the content still changes.'],
      ]],
      ['Touch screens', [
        ['items', [
          ['Tap areas', [['p', 'On a touch screen (`pointer: coarse`) every button, link, tab, switch and checkbox gets a tap area of at least 40px square, centred on it: a clear `::before` (or `::after`, where the component already draws with its `::before`) from the shared CSS, so how it looks doesn\'t change. A list or strip that scrolls can cut one off at its own edges.']]],
          ['Close neighbours', [['p', 'Where two controls sit closer than that, a script in the core shrinks both tap areas evenly towards the gap between them, so a tap lands on the control nearest to it. It is `fitHits` in `core.js`, and `lib/hits.ts` in React, which every component imports.']]],
          ['Hover', [['p', 'Hover styles only apply with a mouse (`@media (hover:hover) and (pointer:fine)`), so a tap never leaves one stuck on a phone.']]],
        ]],
      ]],
      ['Contrast', [
        ['items', [
          ['Text and marks', [['p', `The accent has separate roles for fills, text and marks. Text in the accent aims for 4.5:1 and marks for 3:1, on the surface and on the grey chips and tinted rows they sit on. See ${D('theming')}.`]]],
          ['A light accent', [['p', 'Blueprint\'s lime is too light for text on white, so in light mode accent text uses the ink colour and marks a darker lime.']]],
          ['Edges', [['p', 'An off switch and an empty box are drawn in a grey that holds 3:1 against the surface. An accent fill keeps a thin edge in the mark colour, so a light accent still has an outline.']]],
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
      ['Point an agent at them', [
        ['steps', [
          ['Give it llms.txt', [['p', 'So it can pick the components for your screen.'], ['code', 'text', `${SITE}/llms.txt`, 'URL']]],
          ['Give it the Markdown page of each component it picks', [['p', 'Add `.md` to a component\'s address.'], ['code', 'text', `${SITE}/components/composer.md`, 'URL']]],
          ['Ask it to install them with the CLI', [['p', 'Rather than write them from memory.'], ['code', 'sh', 'npx designme add composer --react']]],
        ]],
        ['p', 'Agents that can fetch a URL can read these pages themselves. Otherwise, open the page and paste it in.'],
      ]],
      ['A prompt to start from', [
        ['code', 'text', `Read ${SITE}/llms.txt and pick the components for our run history screen.\nFor each one, read its .md page, then install it with:\n  npx designme add <name> --react\nKeep the installed files as they are and drive the components through their props from our state.\nUse the Soft style: add data-style="soft" to <html>.`, 'Prompt'],
      ]],
      ['Markdown pages', [
        ['p', 'Each component\'s Markdown page has:'],
        ['items', [
          ['About', [['p', 'What the component is for, when to use it and what it does.']]],
          ['Install', [['p', 'Its install commands for HTML and React.']]],
          ['Accessibility', [['p', 'Its accessibility notes and questions.']]],
          ['React', [['p', 'The React import, an example and a table of props.']]],
          ['Source', [['p', 'The full React source, as the CLI installs it.']]],
          ['Related', [['p', 'Links to the other components in its section.']]],
        ]],
        ['p', `These docs have Markdown copies too, like \`${SITE}/docs/theming.md\`.`],
      ]],
      ['llms.txt', [
        ['p', `[${SITE}/llms.txt](/llms.txt) lists every component by section, each with one line about it, its Markdown page and its install command. It also lists these docs. Start an agent there when it needs to choose components.`],
        ['p', 'The CLI installs from the registry: each component as JSON, at `/r/<name>.json` for HTML and `/r/react/<name>.json` for React.'],
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
// the groups, for the list of agent components on the introduction
export const GROUPS = Object.keys(SETS).map(g => ({ g, name:SETS[g], n:nOf(g), secs:inSet(g) }));
export const AGENT = GROUPS.find(G => G.g === 'agent');

/* ---- inline text: `code` and [label](url) ---- */
const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
export function inlineHtml(s){
  return s.split(/(`[^`]+`)/).map(part => {
    // short code stays on one line, so `--force` never breaks after its first hyphen
    if (part.startsWith('`') && part.endsWith('`') && part.length > 1) return `<code${part.length <= 30 ? ' class="nw"' : ''}>${esc(part.slice(1, -1))}</code>`;
    return esc(part).replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `<a href="${u}"${/^https?:/.test(u) ? ' rel="noopener"' : ''}>${t}</a>`);
  }).join('');
}
// in Markdown, site links become full addresses, and a component or docs page points at its Markdown copy
const abs = u => u.startsWith('/') ? SITE + (/^\/(components|docs)\/[\w-]+$/.test(u) ? u + '.md' : u) : u;
export const inlineMd = s => s.split(/(`[^`]+`)/).map(part => part.startsWith('`') ? part : part.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, t, u) => `[${t}](${abs(u)})`)).join('');
