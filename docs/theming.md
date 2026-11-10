# Theming

> Two attributes on `<html>` pick the style and the theme, and one accent colours the rest.

Designme.dev docs. The same page with navigation: https://designme.dev/docs/theming

## Style

### Blueprint

What the components draw by default.

```html
<html>
```

### Soft

Add `data-style="soft"` to `<html>`, or to any element around the components to make just those Soft. Tooltips sit on the page, so they keep the page's style.

```html
<html data-style="soft">
```

Until you pick a style in the header, designme.dev follows your theme: light opens in Soft and dark in Blueprint. It remembers the style you pick.

## Light and dark

Without `data-theme`, the components follow the device's setting. Set it to fix the theme:

```html
<html data-theme="dark">   <!-- or data-theme="light" -->
```

To switch from your own control, change the attribute. Remove it to follow the device again:

```js
document.documentElement.setAttribute('data-theme', 'dark');
document.documentElement.removeAttribute('data-theme');
```

## The accent and its roles

One accent runs through every component. It has a few roles, so a light colour like lime stays readable:

Every token starts with `--dm-`, the same in HTML, React and Astro, so none of them meets a variable of your page's own.

| Token | What it is for |
| --- | --- |
| `--dm-accent` | Fills: buttons, switches and selected states |
| `--dm-on-accent` | Text and icons on an accent fill |
| `--dm-accent-fg` | The accent as text and icons, aiming for 4.5:1 |
| `--dm-accent-mark` | Lines, borders and chart marks, aiming for 3:1 |
| `--dm-accent-2` | An accent fill on hover |
| `--dm-accent-bg` | A light tint for pressed, selected and hovered items |
| `--dm-focus` | The keyboard focus ring. It is `--dm-field-line-strong`, a grey, unless you set it |

Fields and focus rings are grey, never the accent. A field (a text field, a search box, a dropdown) has a dimmed grey edge, `--dm-field-line`, that steps up to `--dm-field-line-strong` while it has the focus.

The contrast targets hold on the surface, and on the grey chips and tinted rows the accent sits on.

## The defaults

| Role | Soft light | Soft dark | Blueprint light | Blueprint dark |
| --- | --- | --- | --- | --- |
| Fill, `--dm-accent` | `#116ff8` | `#116ff8` | `#c2f23c` | `#d4f84a` |
| On fill, `--dm-on-accent` | `#ffffff` | `#ffffff` | `#121212` | `#121212` |
| Text, `--dm-accent-fg` | `#0f5fd5` | `#9dc4ff` | `#121212` | `#d4f84a` |
| Mark, `--dm-accent-mark` | `#116ff8` | `#3d8bff` | `#1daa51` | `#d4f84a` |
| Tint, `--dm-accent-bg` | `color-mix(in srgb,#116ff8 9%,transparent)` | `color-mix(in srgb,#116ff8 13%,transparent)` | `color-mix(in srgb,#c2f23c 9%,transparent)` | `color-mix(in srgb,#d4f84a 13%,transparent)` |

- Soft is blue, `#116ff8`, with white text on it, in light and dark mode. Accent text is `#0f5fd5` in light mode and `#9dc4ff` in dark mode.
- Blueprint is lime, `#d4f84a`, with dark text and icons on it. In dark mode, text and marks are lime too. In light mode, lime is too light to read on white, so accent text uses the ink colour and marks use green, `#1daa51`.

## Your own accent

Set the roles together. Mark them `!important`: each style and theme sets the accent with a more specific selector, so a plain `:root` rule only reaches Soft in light mode.

```css
:root{
  --dm-accent:#ffe600 !important;       /* fills */
  --dm-accent-2:#f2d900 !important;     /* fills on hover */
  --dm-accent-bg:#fffbd6 !important;    /* tints */
  --dm-on-accent:#121212 !important;    /* text on fills */
  --dm-accent-fg:#121212 !important;    /* the accent as text, 4.5:1 */
  --dm-accent-mark:#988900 !important;  /* lines, rings and chart marks, 3:1 */
}
```

The names are the same in HTML, React and Astro. For other shades in dark mode, repeat the rule under `:root[data-theme="dark"]` and under `@media (prefers-color-scheme: dark)` with `:root:not([data-theme="light"])`.

## Picking an accent on designme.dev

On the homepage, the dot beside the style switch picks an accent. On smaller screens it is in the menu. The site then works out the other roles from your colour:

- Text on a fill is white or near-black, whichever APCA says reads better. The fill then moves a little darker or lighter until that text reaches 4.5:1 and APCA Lc 60.
- Text and marks start from your colour and are darkened on a light page, or lightened on a dark one, until text reaches 4.5:1 and APCA Lc 60, and marks 3:1. If text would need too big a change, it uses the ink colour instead.

This runs on the site only. In your project, set the roles yourself as shown above.

## Charts follow the accent

A chart's first colour is the accent's mark: `--dm-c1` is `--dm-accent-mark`. `--dm-a2` to `--dm-a4` mix it toward the surface for lighter steps. So [Line chart](https://designme.dev/components/line-chart.md), [Bar chart](https://designme.dev/components/bar-chart.md) and [Donut chart](https://designme.dev/components/donut-chart.md) change with the accent. Other series use fixed colours, `--dm-c2` to `--dm-c6`.

## Fonts

The components use Inter and JetBrains Mono, and fall back to the system font. Override `--dm-sans` and `--dm-mono` to use others, for example the families `next/font` gives you.

## More docs

- [Introduction](https://designme.dev/docs/introduction.md): What designme.dev is: free components for AI agent products, in HTML, React or Astro, in two styles with light and dark mode.
- [Installation](https://designme.dev/docs/installation.md): Add components with the designme CLI or the shadcn CLI, as HTML, CSS and JavaScript, React or Astro, and give them your Tailwind v4 theme.
- [Astro](https://designme.dev/docs/astro.md): Add the components to an Astro project as .astro files, with the same markup, CSS and script as the HTML version.
- [Accessibility](https://designme.dev/docs/accessibility.md): The roles, keyboard support, touch tap areas, reduced motion and contrast work built into the components.
- [Using with AI](https://designme.dev/docs/using-with-ai.md): Point a coding agent at the Markdown copy of every page and at llms.txt, and prompt it to install components with the CLI.

All components: https://designme.dev/llms.txt
