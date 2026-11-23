---
name: ui-qa-gate
description: The checks every designme.dev UI change must pass before it is committed as done, published to a lab or staging, or shown to the owner. Use it whenever a component's CSS, markup or demo changes (soft-2/index.html, packages/react, tools/pages/content), whenever you brief an agent to change components, and before you say a fix is done. It exists because the owner kept finding the same mistakes by eye: uneven footer and strip spacing, words off their baseline, a different secondary button or hover in each component, and padding values all over the place.
---

# UI QA gate

The owner should never be the one who finds spacing, alignment or consistency mistakes. Fixing what they point at, one
component at a time, lets the library drift. This gate runs before anything is shown to them. If a check can't run, say so
plainly in the report; never present unchecked work as done.

`.claude/CLAUDE.md` holds the rules themselves. This skill is how to prove a change follows them.

## 1. One value per thing

Before writing CSS, look up the value the library already uses for that job, and use it. Don't invent a near neighbour.

- **Buttons.** In Soft and Blueprint: primary `.pill.primary`; a secondary action on a white card is the white outlined
  `.pill.line`, never the grey `.pill.soft`; ghost `.pill.ghost`; icon button `.ib`; warning action `.pill.warn`. Clean
  has its ink primary and one flat secondary. Side-by-side buttons are the same drawn height.
- **Insets.** A card's content is 16px from every edge.
- **Heads and footers.** Their controls have 16px above and 16px below, measured from the hairline (Soft, Blueprint) or the
  strip's edge (Clean), and sit on the content's 16px column at the sides. Clean strips take this from `--strip-y`.
- **Spacing.** Use the 4px-scale tokens (`--s-1` … ) and the radius tokens. A value off the scale needs a reason written
  next to it.
- **Hover and selected.** One hover per style (`--row`) and one selected fill (`--row-on` in Clean), in the item's own shape,
  never a ring, border, hue or size change.

When the owner approves the spec that `tools/site/audit-system.js` proposes, that spec is the list to check against. Until
then, it is the list above plus CLAUDE.md.

## 2. Measure what is drawn, not boxes

The mistakes that got through were all within a box that looked right:

- **Baselines.** Words of different sizes on one line (a title beside a muted time or count) must share a baseline. Centring
  their boxes puts the smaller text about 2px high. Group the words with `align-items:baseline` in their own wrapper, and
  keep icons and buttons centred on the title's line. Never mix baseline and `align-self:center` in one row.
- **Footers.** The space from the hairline to the buttons must equal the space from the buttons to the card's bottom edge.
  Measure both; don't trust the padding value.
- **Corners.** A pill button near a rounded corner shows its side gap and bottom gap next to each other, so they must match.
- **Boxes that fill.** A control whose box fills on hover (toolbar buttons, Ask AI) is measured by its box against the
  card's edges: 16px from every edge, never 5–9px, even if its words sit on the 16px column.
- **Ghost buttons and selects** at rest are measured by their words; filled and outlined buttons by their box; icons by their
  glyph.

## 2b. Judge it as a designer, not only as a ruler

These also got through, and no script would have caught them:

- **Order that makes no sense.** For example, a chat answer's toolbar placed above the answer. Compare every layout with how
  well-made products order that component; the answer comes first, with its actions under a divider.
- **States that look broken.** A disabled button whose key chip stays in the accent fill looks half on. Every part of a
  disabled control goes quiet together.
- **Selected states you can't see.** A rated thumb that is only a filled icon. In Clean, selected means `--row-on` behind it
  in the control's own shape.
- **Fills too faint to see.** Chips on the stage whose grey barely differs from it. Compare the fill-to-background
  difference across styles.
- **Siblings that differ.** The same job (a secondary button, a chip, a footer, a key chip) must look the same in every
  component. Put them side by side.

Check every state: the start, each change, hover, open, selected, disabled and the end.

## 3. Run the scripts

Serve the build first. The scripts take `PORT`.

1. **Alignment.** Run it on every changed card, in all three styles, light and dark, at W=1440 and W=390:

   ```
   IDS=<ids> STYLES=clean,soft,blueprint W=1440 node tools/site/check-align.js
   ```

   It must report no new issues against the same run on the branch you started from. Read each reported issue, don't
   just count them. A "misread" needs a reason you checked on a screenshot.
2. **Consistency.** Run `tools/site/audit-system.js` (on the `sys-audit` branch until it is merged). It lists every distinct
   button look, inset, head and footer spacing, gap, radius, hover fill and text style. A change may not add a new distinct
   value. Quote its counts in your report.
3. **QA.** Check all three styles, light and dark, at 1440, 768, 390 and 360:
   - no console errors (GitHub stars 403s are expected);
   - no sideways scroll;
   - the type rules;
   - every component centred in its stage at every settled moment.
4. **Card heights.** If a height changed, re-measure with `COMPS=<ids> node tools/site/measure-heights.js`. Keep its
   format: `JSON.stringify(x,null,1)+"\n"`.
5. **Agent harness and Kanban.** These are Phase II and must keep staging's look. Check they are unchanged whenever a shared
   rule or an embedded component changes.
6. **Rules.** `tools/site/check-rules.js` opens each component page (and each template) in every style, theme and width,
   samples the demo while it plays, hovers rows and controls, opens menus, and checks every drawn element against eight
   simple rules: R1 inset (16px in a card, panel, popover or strip with controls; 6px in a row fill, field or button; 4px in
   a small chip or icon button; never 0–3px), R2 even room above and below and at both ends (±1px, footers measured from
   the hairline), R3 one baseline for words side by side (±0.5px), R4 a circle or a clear pill, never in between, R5 nothing
   coloured inside a disabled control, R6 chip, selected and hover fills at least as visible as Clean's chip, R7 one look per
   button job, R8 chips and buttons at least 4px apart. Serve the build, then from the repo root:

   ```
   IDS=<ids> PORT=<port> OUT=/tmp/rules node tools/site/check-rules.js
   ```

   With no `IDS` it checks every page in `components/` and `templates/` (about 1,200 runs; give it `JOBS=6` or so and a few
   hours). It writes `violations.md` (by rule, then component, with counts), `violations.json` and a 2x crop of each spot,
   outlined, in `crops/`. It must report **zero Phase I violations** outside its exceptions list before anything is shown to
   the owner. Don't add to the exceptions list to get there: an exception needs a reason from CLAUDE.md, and the list stays
   short. Open the crops of what it reports; a rule that raises a false alarm is fixed in the script, not excepted.

## 4. Look, close up

The scripts don't replace looking. For every changed component, take screenshots at deviceScaleFactor 2 and crop close
enough that 2px shows. Crop:

- the head line (title, meta, buttons);
- the footer, with its hairline and the card's bottom edge;
- each corner that holds a control.

Look at them in Soft, Blueprint and Clean, light and dark, at the demo's settled states and at its end state. A whole-card
thumbnail is not a check.

## 5. Ship each fix as soon as it passes

Don't hold a finished fix back to batch it with others. The owner waits for each one.

1. Merge the passing branch into `clean-review`, rebuild and re-run the gate.
2. Rebuild `lab/clean-review`.
3. Publish only the lab folder to staging. Verify it is live by checksum with `curl -sL`.
4. Send the link.

Report what changed, in plain words, with the gate's numbers and the close-up sheets.

## 6. When briefing an agent

Paste these rules into the brief:

- the values in section 1;
- "measure what is drawn" from section 2;
- the scripts and limits in section 3;
- close-up sheets from section 4;
- "commit sources only, push after every commit".

Don't accept an agent's "misread" or "fine" without checking a close crop yourself.
