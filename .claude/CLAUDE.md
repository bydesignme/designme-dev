# Working on designme.dev

Standing decisions from the owner. Read them before changing anything, and check new work against them. They apply to
every session and every agent.

## Process
- Work on `staging`. Touch `main` only when the owner says "push live". No pull requests unless asked.
- Push in small batches and say what changed.
- Never ask for npm credentials. Don't make the repository public without the owner's say-so.
- Every claim in copy or docs must be true of the code.
- Don't copy other component libraries' designs, layouts, copy or mascots. Use standard UX patterns, not creative ones.
- Change only what was asked. If a change would bring back or alter something the owner didn't mention (a layout,
  a nav, a colour), ask first.
- A polish, elevation or "calmer" pass never removes something the owner set up (lines, controls, columns, chips) without
  saying so and asking first (owner, 21 Nov: "You made those changes without telling me").

## Brand
- The DesignMe wordmark is fixed: never redraw, retype or restyle its letters. Use its existing vector paths as they
  are. Logo work may only change the ".dev" part, add an icon beside it, or show the same paths as an outline (a
  "blueprint" of the logo).

## Site structure
- The homepage (`/`) is a landing page (owner, 19 Nov): full width, with the site header and no sidebar. It reaches the
  library, the docs and Book a call through its own buttons and links. Source: `tools/pages/src/pages/index.astro`.
- On every other page, site navigation lives in the left sidebar: Library (`/library`), Docs, Changelog, Roadmap and FAQ.
  There is no top nav in the header on any page. The header holds the logo, the GitHub stars pill, the style switch and
  the theme switch. The style switch offers Blueprint, Soft and Clean; Your theme is off it for now (owner, 18 Nov), and a
  stored pick of it falls back to Soft.
- The sidebar is the same on every page that has one (library, Changelog, Roadmap, FAQ, Docs, component pages): the search field,
  the site links, the compact component groups, and the "work with us" CTA pinned bottom left. Moving between pages
  only moves the active state; nothing in the sidebar jumps or disappears.
- Hover and active fills in the sidebar are light and quiet. Don't make them darker or more saturated.
- The component library is at `/library` (`library.html`, built by `tools/site`), with Library selected in its sidebar;
  Changelog, Roadmap and FAQ open over it (`/library#/changelog`). There is no separate components page: `/components`
  redirects to `/library`, and old library addresses on `/` (`/#/changelog`, `/#s-status`) are sent on to it.

## Layout
- Cards (a border, a fill, padding) are only for things you can click. Facts, requirements, frameworks, notes and
  descriptions are plain text or a plain list, one under another, with no card, border or padding.
- No row of summary or stat cards on top of a page or screen (owner, 19 Nov: "do not add cards, every AI adds 4 cards at the
  top, this is a crm page not some dashboard"). An app page is its list or its work; filters are tabs, a segmented row or a
  menu, not boxes with big numbers. Avoid the patterns every AI-made page has; show something only we can show.
- Data tables (the Sales CRM's Accounts above all) keep visible vertical lines between their columns, in every style, and
  their columns can be resized and moved (owner, 10 Nov; restated 21 Nov: "if we don't have the vertical lines, we don't
  even know this is a column").
- In-page links (tables of contents, section anchors) scroll smoothly, and not at all with reduced motion.

## Type and colour
- All text is 14px or smaller, and nothing is heavier than weight 500. Page titles (`.pg-h1`) are one exception; the
  one big number in a data card (Health score's score) is the other (owner, 3 Nov). The landing page's section headings
  (`.lp-sh h2`: large, centred, weight 500, with one grey line under them) are a third, on the landing page only (owner,
  19 Nov); the library, the docs and every other page keep 14px. `/?headings=small` shows the landing page with them at 14px.
  Radial goals' centre figure (22px, weight 600, with no "of targets" under it) is a fourth (owner, 20 Nov: "bigger bolder
  text").
- No monospace fonts in the interface, keyboard hints included. Code blocks and inline code are the exception.
- Until a visitor picks a style, it follows their theme (owner, 4 Nov): light opens in Soft, dark opens in Blueprint; Blueprint's default accent is lime `#d4f84a`. Primary buttons use the accent, with
  `--on-accent` icons and text on accent fills: dark on Blueprint's lime, white on Soft's blue.
- Greys: one neutral scale for the site chrome and Soft (no blue-tinted greys anywhere). Blueprint keeps its warm greys
  as their own named set.
- Primary buttons are `.pill.primary` (on the accent). There are no ink buttons for now.
- A secondary action on a white card is the white outlined button (`.pill.line`: white with a half-strength grey edge) in Soft
  and Blueprint, never the grey filled `.pill.soft`, which reads as pressed or disabled on white (owner, 23 Nov). Clean keeps
  its own flat secondary. The Buttons demo still shows `.pill.soft` as one of the styles.
- Accents have roles: `--accent` fills, `--accent-fg` text (4.5:1), `--accent-mark` lines, rings and chart marks (3:1),
  `--accent-bg` / `--sel` tints. Charts follow the accent.
- Every colour pairing must pass a contrast check before it ships: text 4.5:1 (WCAG 2) and APCA Lc 60 or more for
  small text, marks 3:1. Choose text on a fill with APCA; WCAG 2 alone picks black on saturated mid-tones like violet,
  which is hard to read.
- Highlights like "Everyone is free" use the accent tint (`--sel` with the accent as text), not a solid accent fill.
- No coloured shadows, glows or gradient shadows (owner, 30 Oct). Shadows are only the neutral `--shadow` /
  `--shadow-pop`; a pulse or highlight uses opacity, scale or a neutral fill, never a hue.
- Colour is used sparingly and for meaning: lines, rails, tracks and connectors are neutral grey by default, and a
  component carries one or two hues at most (a status, the item that is running, pass/fail). No per-item rainbow lines.
- Status colours are saturated (owner, 3 Nov): `--ok`, `--warn`, `--bad` and their `-bg` tints, in both themes. A status
  chip is the tint with dark text in that hue (like "+14.8%" in Stat cards), so its text keeps 4.5:1.
  Bars, rings, dots and lines in the warning colour use `--warn-mark` (a bright orange, 3:1), never the dark text `--warn`.
  Same for green: marks use `--ok-mark` (bright, 3:1), text uses `--ok`. Text colours are the most saturated of their hue that
  still keep 4.5:1 on their own tint (owner, 4 Nov: no deep greens or brown oranges); a done chip is green (`--ok-bg` + `--ok`).
- Warning notices (owner, 18 Nov, after the Claude app's own "needs a new sign-in" banner), in every style:
  - a faint warning tint (`--warn-bg` at 45%), not the full amber;
  - the filled warning sign in `--warn-mark`;
  - the words in the text colour, not amber;
  - the action that resolves it as `.pill.warn` (the warning tint with `--warn` text, like `.tag.warn`; its hover is
    `--tint-h`);
  - a second button beside it stays white in light mode.
  Model picker's busy notice is the reference. Don't add a red version until its hover passes 4.5:1 (the obvious one
  doesn't in light).
- A finished state (owner, 18 Nov) is a neutral row with the green tick: no green fill behind it and no elapsed clock
  (Permission gate's done row).
- Charts use the chart palette (`--c1`, the accent, then `--c2` to `--c6`) where more than one series or part needs telling
  apart: Donut, Line chart's comparison series, Stat cards' sparklines, Funnel (accent to violet in Soft). The Bar chart
  is one accent colour with no legend; its breakdown is in the hover readout.
- Colour is saturated, never muted (owner, 21 Nov: "I told you a hundred times, make it more saturated"): chips, tags,
  stage and category labels, and chart series are as vivid as Attio's chips and Copilot Money's charts, within the contrast
  rules above.
- Line charts have straight segments with sharp corners in every style, never smoothed curves; a projection or comparison is
  a dotted line; the area under a line fades from its colour at the top to transparent (owner, 21 Nov).
- Use the existing chip, tag and text styles as they are; don't invent new ones. Non-interactive metadata ("12 pages",
  "3 frames", counts, sizes, durations) is a plain grey chip or muted text, never coloured.
  Labels a person sets (tags, segments, Kanban labels) do take colour: the core tag colours (`.tag.b/.l/.m/.p/.r/.y/.k/.t`,
  or Badge's `data-tone`), one colour per label wherever it shows (owner, 8 Nov).
- Grey borders are at half strength (`color-mix(in srgb,var(--line) 50%,transparent)` and the like), and the hover or
  highlight grey behind a row or ghost control is `--row` (`#fafafa` in Soft light).

## Fields, focus and selection (owner's decisions, 29 Oct)
- No accent-coloured or black focus rings, outlines or glows anywhere. Mouse and touch never show a focus ring.
- Text fields, textareas, search fields and dropdown triggers: a quiet, dimmed grey border at rest, no black outline and
  no heavy grey fill (white, or the surface). On focus the border turns one step stronger grey, same width; nothing else
  changes. Once a field is filled and left, it goes back to the rest look (no lingering highlight).
- Keyboard focus on buttons, links and other controls (`:focus-visible` from the keyboard only) is a quiet grey ring
  (2px, the stronger grey), never the accent and never black. This is the only focus ring, kept so keyboard users can
  see where they are.
- Selected states (chips, options, steps, cards in a picker): white fill with a dimmed grey border, slightly stronger when
  selected. Not a black outline, not a grey fill.
- Fields and tags use slightly rounded corners (`--r-in` / `--r-sm`) with corner smoothing where the browser supports it
  (`corner-shape: squircle`), never full pills. Buttons stay pills, except the site's own Sign up and Book a call (owner,
  4 Nov): the newsletter's Sign up buttons (and Suggest on the roadmap) are as tall as the field beside them, and they and Book a
  call (sidebar, phone menu, the mobile DesignMe card) are rectangles with the fields' squircle corners. The GitHub stars pill stays a pill.
- Single-field components (Date picker, Search input, Country select, Multi-select and the like) share one field width
  in their stage, and go full width on phones.
- On a tinted or coloured surface (banners, notices), secondary buttons are white in light mode, not grey. On coloured
  banners the primary button is white in light mode and the accent in dark mode. A warning notice's action is `.pill.warn`
  (see Type and colour).
- Pricing: only the recommended plan's button is primary (accent); the others are white with a grey outline.

## Clean (owner, 17 Nov)
- Three styles: Blueprint, Soft and Clean. Clean is `data-style="clean"` (storage `dmui-style` = `clean`), a layer over
  Soft: Soft's component rules plus Clean's tokens and touches, written in `soft-2/index.html` as `:root[data-style="clean"]`
  rules (the "Clean" CSS section for tokens and shared treatments, each component's own section for its touches). The build
  writes Blueprint as `:not([data-style="soft"],[data-style="clean"])`, so Blueprint rules never reach Clean.
- Clean's chrome is monochrome (owner, 17 Nov): surfaces, text, hairlines, the primary button (ink: black in light, white
  in dark, its own `--btn-*` and `--on-btn` tokens), secondary buttons, switchers, knobs and toggles. In light mode, data and
  status keep Soft's colours: `--accent` stays blue for data, selection and links. In dark mode Clean's accent is white (see
  below). Both modes keep the chart palette's other colours, agents' own colours, pastel avatars and the status colours. Ticks are the vivid green (`--ok-mark`), never black. No red fill behind an error: a
  failed row keeps its red words and mark on the row as it is. Off-white head and foot strips; checkboxes and tracks have
  inner shadows. Only the ink primary button has depth (an inner light at the top, a soft shade at the bottom); secondary
  buttons and dropdown triggers are flat: a hairline border and a light fill that deepens a little on hover and press, with
  no press scale (owner, 18 Nov). Every button's edge is drawn inside it, so buttons side by side are the same height.
- Clean's rounding (owner, 18 Nov, replacing "everything fully round" of 17 Nov, which turned heatmap cells, flags, OTP
  boxes, text fields, images, calendar events and whole panels into pills and circles): pills and circles only for controls
  (buttons, chips, tags, toggles, switchers), avatars and dots. Everything else has ordinary rounded corners, a little rounder
  than Soft: fields 10px, rows 10px, cards and popovers about 22px with strips and inner panels following the card's corners,
  never squircles. The tokens (`--rk-s` 1.6, `--rk-m` 1.4, `--rk-l` 1.3, `--r-in`/`--r-field` 10px) do this; write new radii as
  `calc(<n>px * var(--rk-s|m|l,var(--rk)))` and never a 999px on anything taller than a control.
- Standard UX first (owner, 18 Nov): every component must look like how that component normally looks in well-made products.
  A checkbox is a rounded square, a drop zone is not a pill, progress has the shape of its thing (a ring round a round tile,
  a line under a row), content appears only once the process that makes it has made it, nothing sits outside its card,
  text columns line up, hovers are a quiet fill. Empty states use the lab's Clean empty state (`lab/clean/clean.css`
  `.cle-em`/`.cle-art`): a small monochrome card sketch, a title, one muted line, an optional outline button.
- Review Clean work on a separate preview before it reaches staging (owner, 18 Nov): batches of 5 components, each on its own
  lab page (as `lab/six/`), and staging only gets them once the owner approves.
- Padding is measured, not eyeballed (owner, 17 Nov; 16px since 18 Nov): every Clean card has its content 16px in from each
  edge, and so do the controls in its head and foot strips (owner, 21 Nov, replacing the 18 Nov 8px for strip controls: a
  strip's "Connect a tool" and "Test all" sat 8px off the rows' tiles and buttons). A strip control sits on the content's
  16px column at the sides and 16px from the strip's own top and bottom, so a foot strip's controls are 16px from the
  card's bottom edge as well as its side (owner, 23 Nov, replacing 8px top and bottom, which jammed them into the corner);
  a select in a strip lines up by its words, not its hover box. Check with a script that measures
  each card's insets at 1440 and fix every mismatch above 1px. Measure through the whole demo (sampled while it plays, to its
  end state) and in every design a card can switch to, not one settled frame (owner, 18 Nov).
- Clean has an outer glow only in dark mode, and only around buttons (owner, 18 Nov): a faint neutral glow around the white
  primary button, never around cards, panels or popovers. This is an approved exception to "no glows"; it is white or
  neutral, never a hue. Light mode has no outer glow.
- Clean's motion is Access Grid-like and calm (owner, 18 Nov: "it should be smoother"): ease cubic-bezier(.23,1,.32,1), the
  card rises 8px from .98 over 680ms and its pieces follow 50ms apart (`REVEAL.clean`), hovers and fades 220ms, moves 340ms,
  entrances 560ms, only the ink primary presses (at .97), menus scale and fade from their trigger.
- Clean's accent is white in dark mode and the accent colour in light mode (owner, 21 Nov, said four times: "dark mode clean
  has white as accents and accent color in light mode"). Everything drawn in the accent turns white in Clean dark, with dark
  text on white fills: count badges, loaders and spinners, animated dots, step and progress bars, relevance meters, selected
  marks, toggles, links and accent text. Links keep an underline, so they still read as links. This is the clearest
  difference between Clean and Soft. Set it in Clean dark's tokens, not per component. Status colours, agents' own colours,
  avatars and the chart palette's other series keep their hues. An animated loader mark has no tile or fill behind it.
- Clean's hover and selected states are one system across every component (owner, 21 Nov: "hover and active states are
  inconsistent for clean style all over the components"; "it should feel premium and elevated"):
  - One hover: a neutral fill in the item's own shape (a pill for controls and for segments inside a pill; Clean's 10px row
    corners for menu and list rows), clearly visible in light and dark, not a faint wash.
  - One selected or active state: the same shape and a stronger neutral fill (and the tick where a menu shows one), never a
    border or a hue.
  - Both ease in and out over Clean's 220ms with its ease, never instantly. In a menu or list, the hover highlight glides
    from row to row as the pointer moves. With reduced motion, it only fades.
  - Borders round Clean controls and pills are half strength.
- Phase I is the Clean review now under way. These are left out of it and move to Phase II (owner, 21 Nov): Kanban,
  Pricing cards, Stepper, Scatter chart, Funnel chart, Top pages, Eval radar, Agent harness, Bar chart and Radial goals.
  Until then they stay as they are on staging. Line chart and Donut chart take the new charts from the charts preview.
  Canvas toolbar, Automation canvas and Data picker join Phase II too (owner, 22 Nov); Data picker's Clean and Soft designs
  are still updated now. Health score stays in Phase I. To launch with fewer components (owner, 22 Nov), Currency converter,
  Payment form, OTP field, Number field, Slider, Country select, Social sign-in, Carousel, Date range picker and Invite to
  collaborate join Phase II as well; Reactions and Context menu stay in Phase I. The owner is confirming the rest batch by batch; the Roadmap and the
  Changelog follow once the Phase I list is final.
- Launch list (owner, 23 Nov): the site launches with these 35 components, and the rest follow one by one as "New component
  live on DesignMe Dev" posts. Agent tree, Trace view, Agent lanes, Agent inbox, Thinking, Composer, Context meter, Web
  search, Decision prompt, Attachment tray, Agent run timeline, Run cost, Scheduled runs, Reasoning trail, Model picker,
  Permission gate, Plan review, Event calendar, File explorer, Command palette, Memory panel, Inline text diff, Terminal
  stream, Live answer, Step loader, Thinking states, Source stack, Citation hover card, Answer action bar, Response
  versions, Feedback sheet, Tools and connections, Knowledge sources, Run drawer, Status pill. Eight components taken out
  in the 16 Nov library trim come back with Clean designs for the posts that follow: Hand-off to a person, Steering,
  Browser session, Voice orb, Image generation, Tool call, Code viewer, Design tuner (their code is in the commit before
  f0e4fbfd).
- Soft keeps its look; the "Soft refreshed" lab is dropped. Six components have their Clean touches (Agent tree,
  Agent run timeline, Status pill, Context meter, Run cost, Meeting card); the others render with Clean's tokens and get
  theirs later.

## Spacing and radius
- Soft is plush (owner, 3 Nov): every corner radius in a component is scaled by `--rk` (1.25, and 1.7 where the browser
  draws squircles), and every corner is a squircle (`corner-shape: squircle`, round corners as the fallback), pills,
  chips, buttons and switchers included. Only true circles (50%: spinners, loader rings, avatars, dots) stay round. Shadows are soft and layered and come from outside
  only (`--shadow`, `--shadow-pop`): no highlight on a top edge or glow inside a card or button (owner, 18 Nov). Buttons cast no
  shadow; a white button on a tinted row or notice has a hairline edge (`--on-tint-btn`). Write new radii
  as `calc(<n>px * var(--rk))` or the radius tokens. Blueprint stays square.
- Write Soft-only rules as the base rule and override them with `:root[data-style="bp"]`, never as
  `:root:not([data-style="bp"])`: the registry build rewrites the latter into a selector that never matches. Clean rules are
  `:root[data-style="clean"] ...`, after the Soft rule they change.
- Use the spacing tokens (4px scale) and radius tokens for new and changed CSS. Existing off-scale values are snapped
  later in a separate pass, one category at a time, with before/after screenshots for the owner to review.

## Components
- Installed code must look like its style with no wrapper: Blueprint with no `data-style`, Soft with
  `data-style="soft"`, Clean with `data-style="clean"`. Nothing may depend on a page's demo stage.
- Demos (scripted autoplay) stop for good the moment a person clicks, focuses or types inside the component, and stay
  stopped until Animate/replay is pressed.
- While a mouse rests on a component, its demo holds where it is (so it never moves what the person is about to click) and
  carries on when the pointer leaves. Demo timing goes through the controller's waits (`c.wait`, `c.later`, `c.every`,
  `c.loop`, story beats; `useStory` in React), so the hold reaches it.
- Except an agent at work (owner, 3 Nov): agent progress and loading demos (`DM.PLAYS`: Status pill, Step loader, Thinking,
  Reasoning trail, Agent lanes, Agent run timeline, Trace view, Agent tree, Run queue, Terminal stream, Browser session,
  Action log, Attachment tray, Live answer, Agent harness; `useStory(ref, run, { hold: false })` in React) keep playing while the pointer
  rests on them.
- Loader text, the words that say what is running ("Writing the findings…", "Searching…"), uses the highlight sweep
  (`.shim`, `dm-shim` in React) in every style (owner, 19 Nov: "use it everywhere for loaders").
- A tooltip follows its trigger while a demo moves it (owner, 19 Nov). Nothing places a tooltip once and leaves it.
- A component never reserves room for a later state: its container grows with its content, smoothly (`grow()` /
  `useGrow()`), and shrinks the same way. It stays centred in its stage as it grows (owner, 17 Nov). This replaces keeping a
  height with `hold()` / `release()` for content that arrives.
- Every component sits centred in its stage at every moment: its tallest state, its end state, and closed dropdowns. Dropdowns use `centre()`: the closed field
  sits centred and glides up as its list opens.
- Component pages show every state the library card does (owner, 4 Nov). A card with designs under review (a
  `data-designs="card"` switch) shows them on its page too, switched under the demo (`designsOf` in `tools/site/build.js`
  writes `tools/pages/data/designs.json`), with a note that the CLI installs Classic. The registry still installs Classic only.
  On a component page the switch under a demo sits at the demo's foot (24px up) and never moves as the designs change height;
  the demo keeps room for it (`--sw`).
- Installs never share token names with the page they land in (owner, 4 Nov): every CSS variable in the HTML, Astro and
  shadcn installs is `--dm-<name>` (`tools/site/token-prefix.js`, applied only when the registry is written), as React's
  already are. The site's own source keeps the short names.
- Each component ships in HTML (`soft-2/index.html`) and React (`packages/react`), with its docs copy in
  `tools/pages/content/<id>.json`. Change all three together.

## People in demos
- The people in the demos are initials avatars (`.av`), on the site and in installs. The photo avatars were removed before
  the public launch (owner, 4 Nov): their licence didn't allow redistributing them in a public repo. Agents keep their
  icons and marks.
- Photos are only from Pexels (owner, 5 Nov), under the Pexels License, listed with their Pexels ids in `art/README.md` and
  credited in `NOTICE.md`. They are on the site only (laid over a gradient by `art/art.js`), never in installs. The Carousel demo
  uses them, with and without people.

## Alignment and fit (owner, 18 Nov: "how many times do I have to flag these spacing issues")
- Every part sits on a shared column. A row's leading mark (icon, tile, checkbox, avatar) sits centred in the same column as
  the head's icon tile; its words start where the title's words start; a row's hover fill lines up with the head tile's box
  (the content's width, no wider). A select's words line up with the content's left edge, its hover box reaching out round
  them. The last control in a row (a select, a button), in Clean's strips too, ends on the content's right edge, where the
  meters and tags above end. A label or trigger outside a card lines up with the card's edge.
- The parts of one row (icon, word, detail, button) share one centre line: never mix `align-items:baseline` with an
  `align-self:center` child. Buttons side by side are the same drawn height.
- Ghost buttons and icon buttons (Stop, Copy, a head's chevron, a row's Read) share one hover in each style: the same quiet
  fill in the button's own shape, with no border, shadow or size change (owner, 21 Nov: "you use like 10 different hover
  styles"). A button whose icon sits beside a word has no tile of its own behind the icon (Continue ↵).
- A card's footer (its actions, or a status line such as a loader under the content) sits under a hairline divider in Soft and
  Blueprint; Clean gives it its own foot strip (owner, 21 Nov: "multiple text layers and no segmentation"). A row whose
  trailing control is missing (no chevron) ends its words on the content's right edge rather than leaving the control's room.
- A menu or popover is never cut off by its stage or page: it opens upwards when there is no room below (`placePop`).
- A mouse click or tap never leaves a focus ring, even when a modifier key (a screenshot shortcut) follows.
- No tinted band behind the active row: a pulsing icon and a spinner or "Working" chip say what is running.
- A chip laid over coloured or hatched areas is opaque and neutral and hides what sits under it; nothing overlaps it.
- A legend shows the same colours as what it explains. No row of text repeats what a card already says.
- `IDS=<ids> node tools/site/check-align.js` (all three styles, light and dark, through every design) must report no issues
  before anything is shown to the owner, and every frame is looked at as well: the script does not replace looking.

## QA before every push
- Follow the `ui-qa-gate` skill (`.claude/skills/ui-qa-gate/SKILL.md`) before any UI change is committed as done, published
  or shown to the owner, and paste its rules into every agent's brief.
- All three styles (Soft, Blueprint and Clean), light and dark, at 1440, 768, 390 and 360.
- No console errors and no sideways scroll.
- The type rules above.
- Centring checked at every settled moment, not only the tallest one.
- Card heights re-measured (`COMPS=<ids> node tools/site/measure-heights.js`) when a component's height changes.
- `IDS=<ids> node tools/site/check-align.js` reports no issues (Alignment and fit, above).

## Build
From `tools/site`: `npm run patches` (when `make-patches.py` changed), `npm run build`, `npm run react`, `npm run astro`, `npm run pages`.
`index.html` (the landing page), `library.html`, `components/` and `docs/` are generated: edit the sources, not the output.
