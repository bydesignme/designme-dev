# Using with AI

> Every page here has a Markdown copy, so a coding agent can read what a component is for, how to install it and its full source.

Designme.dev docs. The same page with navigation: https://designme.dev/docs/using-with-ai

## Markdown pages

Add `.md` to a component's address:

```text
https://designme.dev/components/composer.md
```

Each one has:

- What the component is for, when to use it and what it does
- Its install commands for HTML and React
- Its accessibility notes and questions
- The React import, an example and a table of props
- The full React source, as the CLI installs it
- Links to the other components in its section

These docs have Markdown copies too, like `https://designme.dev/docs/theming.md`.

## llms.txt

[https://designme.dev/llms.txt](https://designme.dev/llms.txt) lists every component by section, each with one line about it, its Markdown page and its install command. It also lists these docs. Start an agent there when it needs to choose components.

The CLI installs from the registry: each component as JSON, at `/r/<name>.json` for HTML and `/r/react/<name>.json` for React.

## Point an agent at them

1. Give it llms.txt, so it can pick the components for your screen.
2. Give it the Markdown page of each component it picks.
3. Ask it to install them with the CLI, rather than write them from memory.

Agents that can fetch a URL can read these pages themselves. Otherwise, open the page and paste it in.

## A prompt to start from

```text
Read https://designme.dev/llms.txt and pick the components for our run history screen.
For each one, read its .md page, then install it with:
  npx designme add <name> --react
Keep the installed files as they are and drive the components through their props from our state.
Use the Soft style: add data-style="soft" to <html>.
```

## Tips

- Name components by their install name, like `status-pill` or `permission-gate`, so the agent finds the right page.
- Ask for the controlled props, like `value` and `onValueChange`, when your state should own a value.
- Ask it to change the accent through its tokens, all the roles together, not by editing each component's CSS. See [Theming](https://designme.dev/docs/theming.md).
- Ask it to keep the roles, labels and keyboard handling listed under Accessibility when it changes the markup.
- For the HTML version, tell it that each component plays a scripted demo from its `.js`. The React version takes props.

## More docs

- [Introduction](https://designme.dev/docs/introduction.md): What designme.dev is: free components for AI agent products, in HTML or React, in two styles with light and dark mode.
- [Installation](https://designme.dev/docs/installation.md): Add components to your project with the designme CLI, as HTML, CSS and JavaScript or as React components.
- [Theming](https://designme.dev/docs/theming.md): Switch between Soft and Blueprint, light and dark, and set your own accent and its roles.
- [Accessibility](https://designme.dev/docs/accessibility.md): The roles, keyboard support, reduced motion and contrast work built into the components.

All components: https://designme.dev/llms.txt
