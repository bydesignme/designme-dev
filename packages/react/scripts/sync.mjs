// Copies the styles and icons the React components share with designme.dev, so both stay one design.
// Reads the registry the site publishes (r/*.json) and writes:
//   src/designme.css                       tokens, primitives and motion (Blueprint by default, Soft with data-style="soft")
//   src/components/<name>/<name>.css       each component's own styles
//   src/lib/icons.tsx                      the icon set as React elements
// usage: node scripts/sync.mjs   (from packages/react)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const pkg = path.resolve(here, '..');
const reg = path.resolve(pkg, '../../r');
const read = name => JSON.parse(fs.readFileSync(path.join(reg, name + '.json'), 'utf8'));
const file = (item, ext) => item.files.find(f => f.path.endsWith('.' + ext)).content;
const write = (rel, text) => { const p = path.join(pkg, rel); fs.mkdirSync(path.dirname(p), { recursive: true }); fs.writeFileSync(p, text); };

// the components ported so far, by registry name
const COMPONENTS = ['status-pill', 'step-loader', 'reasoning-trail', 'thinking', 'context-meter'];
const HEAD = '/* Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync. */\n';

/* ---------- shared core ---------- */
const core = read('core');
let css = file(core, 'css');
// the registry wraps each component in a [data-c] card; React components mark their root with data-dm instead
css = css.replace(/\/\* a component card: the template renders into \.stage-in \*\/\n\[data-c\]\{[^}]*\}\n\[data-c\]\.wide\{[^}]*\}\n?/, '');
css = css.replace(/:where\(\[data-c\]\) /g, ':where([data-dm]) ');
css += '\n/* every component root carries data-dm, so it starts from the same type wherever it is placed */\n'
  + '[data-dm]{font-family:var(--sans);font-size:14px;line-height:1.5;color:var(--fg);-webkit-font-smoothing:antialiased;text-align:left}\n';
if (/\[data-c\]/.test(css)) throw new Error('card selector left in core css');
write('src/designme.css', HEAD + css);

/* ---------- components ---------- */
for (const name of COMPONENTS) write(`src/components/${name}/${name}.css`, HEAD + file(read(name), 'css'));

/* ---------- icons: the sprite in core.js becomes JSX ---------- */
const js = file(core, 'js');
const sprite = JSON.parse(js.match(/const SPRITE = ("(?:[^"\\]|\\.)*");/)[1]);
const camel = a => a.replace(/-([a-z])/g, (m, c) => c.toUpperCase());
const toJsx = inner => inner.trim()
  .replace(/\s([a-z]+(?:-[a-z]+)+)=/g, (m, a) => ' ' + camel(a) + '=')
  .replace(/\sclass=/g, ' className=');
const icons = [...sprite.matchAll(/<symbol id="i-([\w-]+)" viewBox="([^"]+)">([\s\S]*?)<\/symbol>/g)];
const names = icons.map(m => m[1]);
const out = `${HEAD.replace('/*', '//').replace(' */', '')}import type { ReactElement } from 'react';
import { cx } from './cx';

export type IconName = ${names.map(n => `'${n}'`).join(' | ')};

const SHAPES: Record<IconName, ReactElement> = {
${icons.map(m => `  '${m[1]}': <>${toJsx(m[3])}</>`).join(',\n')}
};
const BOXES: Partial<Record<IconName, string>> = {${icons.filter(m => m[2] !== '0 0 24 24').map(m => ` '${m[1]}': '${m[2]}'`).join(',')} };

/** Line icons from designme.dev. size: 'xs' 12px, 's' 14px (default), 'm' 16px, 'l' 18px */
export function Icon({ name, size = 's', className }: { name: IconName; size?: 'xs' | 's' | 'm' | 'l'; className?: string }) {
  return <svg className={cx('i', size !== 'm' && size, className)} viewBox={BOXES[name] || '0 0 24 24'} aria-hidden="true" focusable="false">{SHAPES[name]}</svg>;
}
`;
write('src/lib/icons.tsx', out);
console.log(`synced core, ${COMPONENTS.length} components and ${names.length} icons`);
