# designme

Free UI components for AI agent products, 49 agent components plus 32 app basics, from [designme.dev](https://designme.dev). Each one is plain HTML, CSS and JavaScript, in two styles, Blueprint and Soft, with light and dark mode.

```
npx designme add status-pill thinking composer
npx designme list
```

Components land in `./designme`, with the shared core added once. Every component gets a `demo.html` you can open straight away.

## React

Every component also comes as a typed React component for Next.js, React (Vite) and Astro:

```
npx designme add status-pill thinking composer --react
```

They land in `src/components/designme` (or `components/designme` when there is no `src`), with only the shared files they need: `designme.css` and a few helpers in `lib/`. Each component imports its own styles, so importing it is all it takes:

```tsx
import { StatusPill } from '@/components/designme/status-pill/StatusPill';

<StatusPill state="reading" label="Reading Figma frames" meta="2 of 4" />
```

Needs React 19. Add `--examples` for a `.example.tsx` beside each component that replays its demo from designme.dev. Every class, CSS variable and animation name starts with `dm-`, so they sit beside Tailwind, shadcn/ui or your own CSS without clashing.

## Options

- `--react` React components instead of HTML, CSS and JavaScript
- `--examples` with `--react`, an example beside each component
- `--dir <path>` put them somewhere else
- `--force` replace files you already have

Built by [DesignMe](https://designme.agency). MIT licence.

## Credits

Avatars by DiceBear, Micah style by Micah Lanier (CC BY 4.0). Icons by Phosphor (MIT), flags by circle-flags (MIT), brand logos by Simple Icons (CC0), fonts Inter and JetBrains Mono (SIL Open Font License 1.1). Brand names and logos belong to their owners.
