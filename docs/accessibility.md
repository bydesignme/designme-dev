# Accessibility

> What the components do for people using a keyboard, a screen reader, a touch screen or reduced motion, and where they still fall short.

Designme.dev docs. The same page with navigation: https://designme.dev/docs/accessibility

## Roles and labels

Components use the ARIA pattern that fits what they do. For example:

| Pattern | Roles and states | For example |
| --- | --- | --- |
| Menus | A `menu` of `menuitem` rows. The button that opens one reports `aria-expanded` | [Buttons](https://designme.dev/components/buttons.md) |
| Lists you pick from | A `listbox` of `option` rows. The search box that drives one is a `combobox` | [Command palette](https://designme.dev/components/command-palette.md), [Country select](https://designme.dev/components/country-select.md) |
| A single choice | A `radiogroup` | [Decision prompt](https://designme.dev/components/decision-prompt.md) |
| On or off settings | A `switch` with `aria-checked` | [Agent settings](https://designme.dev/components/agent-settings.md) |
| Tabs | `tablist`, `tab` and `aria-selected` | [Code viewer](https://designme.dev/components/code-viewer.md), [Thread panel](https://designme.dev/components/thread-panel.md), [Segmented control](https://designme.dev/components/segmented-control.md) |
| Sliders | `aria-valuenow` and `aria-valuetext` | [Design tuner](https://designme.dev/components/design-tuner.md) |
| File trees | A `tree` of `treeitem` rows | [File explorer](https://designme.dev/components/file-explorer.md) |
| Popovers | A labelled `dialog`, like the calendar | [Date picker](https://designme.dev/components/date-picker.md), [Citation hover card](https://designme.dev/components/citation-hover-card.md) |
| Toggle and icon buttons | Toggles report their state with `aria-pressed`. Icon-only buttons have a label | [Buttons](https://designme.dev/components/buttons.md), [Line chart](https://designme.dev/components/line-chart.md) |

## Live updates

Agent work changes while you watch. The parts that change are `aria-live="polite"` regions, so the change is read out: [Status pill](https://designme.dev/components/status-pill.md), the thread above [Composer](https://designme.dev/components/composer.md), the message line of [Context meter](https://designme.dev/components/context-meter.md), the thread in [Comments](https://designme.dev/components/comments.md) and the month in [Date picker](https://designme.dev/components/date-picker.md).

Decorative motion, like status glyphs and the wires of a canvas, is `aria-hidden`, so screen readers hear the words, not the animation.

## Keyboard

| Keys | What they do | Where |
| --- | --- | --- |
| Esc | Closes menus and popovers | [Composer](https://designme.dev/components/composer.md), [Date picker](https://designme.dev/components/date-picker.md) |
| Esc | Also returns focus to the button or field that opened them | [Buttons](https://designme.dev/components/buttons.md), [Country select](https://designme.dev/components/country-select.md), [Date picker](https://designme.dev/components/date-picker.md) |
| Enter Space ↓ | Open a menu with the focus on its picked or first item; ↑ opens it on its last | [Buttons](https://designme.dev/components/buttons.md), [Profile menu](https://designme.dev/components/profile-menu.md) |
| Tab | Closes a menu and moves on | [Buttons](https://designme.dev/components/buttons.md), [Profile menu](https://designme.dev/components/profile-menu.md) |
| ↑ ↓ ← → | Move through lists, menus and toolbars, wrapping at the ends | [Command palette](https://designme.dev/components/command-palette.md), [Country select](https://designme.dev/components/country-select.md), [Answer action bar](https://designme.dev/components/answer-action-bar.md) |
| Home End | Go to the first and last item of a menu | [Buttons](https://designme.dev/components/buttons.md), [Profile menu](https://designme.dev/components/profile-menu.md) |
| ← → ↑ ↓ | In the date pickers, move a day or a week | [Date picker](https://designme.dev/components/date-picker.md), [Date range picker](https://designme.dev/components/date-range-picker.md) |
| Home End | Go to the start and end of the week | [Date picker](https://designme.dev/components/date-picker.md), [Date range picker](https://designme.dev/components/date-range-picker.md) |
| Page Up Page Down | Move a month, or a year with Shift | [Date picker](https://designme.dev/components/date-picker.md), [Date range picker](https://designme.dev/components/date-range-picker.md) |
| 1 … 9 | Pick an option | [Decision prompt](https://designme.dev/components/decision-prompt.md) |

Focus shows as one 2px ring in `--focus` (`--dm-focus` in React), the accent's mark colour: an outline 2px outside the control, or a 2px ring drawn with `box-shadow` on filled fields and where an outline would be cut off. It uses `:focus-visible`, so a click on a button doesn't show it.

> Most components work fully with a keyboard. A few, like [Kanban board](https://designme.dev/components/kanban-board.md) and [File explorer](https://designme.dev/components/file-explorer.md), are still getting their keyboard support.

## Reduced motion

When the device asks for less motion (`prefers-reduced-motion: reduce`), the components cut it in two places:

### In the CSS

The shared CSS cuts every CSS animation and transition inside the components to almost nothing.

### In the scripts

The HTML version reads `REDUCE`, which the core keeps in step with the same setting as it changes, so turning it on or off takes effect without a reload, and turning it on finishes what a script is animating. React components that animate from script use the `useReducedMotion()` hook from `lib/hooks.ts`, which follows the setting live too.

Count-ups finish at once, rows move without gliding, and the content still changes.

## Touch screens

### Tap areas

On a touch screen (`pointer: coarse`) every button, link, tab, switch and checkbox gets a tap area of at least 40px square, centred on it: a clear `::before` (or `::after`, where the component already draws with its `::before`) from the shared CSS, so how it looks doesn't change. A list or strip that scrolls can cut one off at its own edges.

### Close neighbours

Where two controls sit closer than that, a script in the core shrinks both tap areas evenly towards the gap between them, so a tap lands on the control nearest to it. It is `fitHits` in `core.js`, and `lib/hits.ts` in React, which every component imports.

### Hover

Hover styles only apply with a mouse (`@media (hover:hover) and (pointer:fine)`), so a tap never leaves one stuck on a phone.

## Contrast

### Text and marks

The accent has separate roles for fills, text and marks. Text in the accent aims for 4.5:1 and marks for 3:1, on the surface and on the grey chips and tinted rows they sit on. See [Theming](https://designme.dev/docs/theming.md).

### A light accent

Blueprint's lime is too light for text on white, so in light mode accent text uses the ink colour and marks a darker lime.

### Edges

An off switch and an empty box are drawn in a grey that holds 3:1 against the surface. An accent fill keeps a thin edge in the mark colour, so a light accent still has an outline.

## For each component

Every component's page lists what it does under About, then Accessibility. Its Markdown copy has the same list. These notes describe what the code does. Check your product with your own content and assistive technology too.

## More docs

- [Introduction](https://designme.dev/docs/introduction.md): What designme.dev is: free components for AI agent products, in HTML or React, in two styles with light and dark mode.
- [Installation](https://designme.dev/docs/installation.md): Add components to your project with the designme CLI, as HTML, CSS and JavaScript or as React components.
- [Theming](https://designme.dev/docs/theming.md): Switch between Soft and Blueprint, light and dark, and set your own accent and its roles.
- [Using with AI](https://designme.dev/docs/using-with-ai.md): Point a coding agent at the Markdown copy of every page and at llms.txt, and prompt it to install components with the CLI.

All components: https://designme.dev/llms.txt
