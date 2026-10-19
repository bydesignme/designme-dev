// Copies the styles and icons the React components share with designme.dev, so both stay one design.
// Reads the registry the site publishes (r/*.json) and writes:
//   src/designme.css                       tokens, primitives and motion (Blueprint by default, Soft with data-style="soft")
//   src/components/<name>/<name>.css       each component's own styles
//   src/lib/icons.tsx                      the icon set as React elements
// Every class, custom property and keyframe name gets a dm- prefix on the way, so the components
// can sit beside any other CSS (Tailwind, shadcn/ui, a site's own .panel or --accent) without either side leaking into the other.
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
const COMPONENTS = ['status-pill', 'step-loader', 'reasoning-trail', 'thinking', 'context-meter',
  'action-log', 'run-queue', 'run-cost', 'toast', 'toast-stack', 'run-summary', 'error-recovery', 'agent-lanes', 'agent-run-timeline', 'live-answer',
  'thread-panel', 'composer', 'voice-capture', 'tool-call', 'artifact-card', 'prompt-starters', 'attachment-tray', 'response-versions', 'feedback-sheet', 'decision-prompt'];
const HEAD = '/* Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync. */\n';

/* ---------- the dm- prefix ---------- */
const P = 'dm-';
// classes that only lay out the site's preview cards; a React component brings its own page around it
const SHELL = /\.(?:stage-in|card|dm|dm-main|demo)(?![\w-])/;
const prefixSelector = sel => sel.replace(/\[[^\]]*\]|"[^"]*"|'[^']*'|\.(-?[_a-zA-Z][\w-]*)/g, (m, c) => c ? '.' + P + c : m);
// splits on commas that are not inside brackets, like the ones in :is(a, b)
const splitList = sel => { const out = []; let depth = 0, from = 0;
  for (let i = 0; i < sel.length; i++) { const ch = sel[i]; if (ch === '(' || ch === '[') depth++; else if (ch === ')' || ch === ']') depth--; else if (ch === ',' && !depth) { out.push(sel.slice(from, i)); from = i + 1; } }
  return [...out, sel.slice(from)]; };
/** Prefixes one stylesheet. `frames` is every keyframe name the styles use, so animation shorthands can be renamed too.
    `shell` drops the rules for the site's preview cards, which only the core has */
function scope(css, frames, shell = false) {
  let out = '', buf = '', skip = 0;
  const vars = s => s.replace(/(?<![\w-])--(?!dm-)([a-zA-Z][\w-]*)/g, '--' + P + '$1');
  const decl = s => /^\s*animation(?:-name)?\s*:/.test(s) ? s.replace(/(?<![\w-])[a-zA-Z][\w-]*(?![\w-])/g, w => frames.has(w) ? P + w : w) : s;
  for (let i = 0; i < css.length; i++) {
    const ch = css[i];
    if (ch === '/' && css[i + 1] === '*') { const end = css.indexOf('*/', i + 2) + 2; if (!skip) { if (buf.trim()) buf += css.slice(i, end); else { out += buf + css.slice(i, end); buf = ''; } } i = end - 1; continue; }
    if (ch === '"' || ch === "'") { const end = css.indexOf(ch, i + 1) + 1; buf += css.slice(i, end); i = end - 1; continue; }
    if (ch === '{') {
      if (skip) { skip++; buf = ''; continue; }
      const pre = buf; buf = '';
      if (/^\s*@/.test(pre)) { out += pre.replace(/^(\s*@(?:-webkit-)?keyframes\s+)([\w-]+)/, (m, a, n) => a + P + n) + '{'; continue; }
      if (/^\s*(?:from|to|[\d.]+%)/.test(pre)) { out += pre + '{'; continue; }
      const kept = splitList(pre).filter(s => !(shell && SHELL.test(s)));
      if (!kept.length) { skip = 1; continue; }
      out += prefixSelector(kept.join(',')) + '{'; continue;
    }
    if (ch === ';' || ch === '}') {
      if (skip) { buf = ''; if (ch === '}' && !--skip) { while (css[i + 1] === '\n') i++; } continue; }
      out += vars(decl(buf)) + ch; buf = ''; continue;
    }
    buf += ch;
  }
  return out + buf;
}
const frameNames = text => [...text.matchAll(/@(?:-webkit-)?keyframes\s+([\w-]+)/g)].map(m => m[1]);

/* ---------- shared core ---------- */
const reg_core = read('core');
let css = file(reg_core, 'css');
// the registry wraps each component in a [data-c] card; React components mark their root with data-dm instead
css = css.replace(/\/\* a component card: the template renders into \.stage-in \*\/\n\[data-c\]\{[^}]*\}\n\[data-c\]\.wide\{[^}]*\}\n?/, '');
css = css.replace(/:where\(\[data-c\]\) /g, ':where([data-dm]) ');
css += '\n/* every component root carries data-dm, so it starts from the same type wherever it is placed */\n'
  + '[data-dm]{font-family:var(--sans);font-size:14px;line-height:1.5;color:var(--fg);-webkit-font-smoothing:antialiased;text-align:left}\n';
if (/\[data-c\]/.test(css)) throw new Error('card selector left in core css');
const own = Object.fromEntries(COMPONENTS.map(name => [name, file(read(name), 'css')]));
const frames = new Set([css, ...Object.values(own)].flatMap(frameNames));
const core = scope(css, frames, true);
write('src/designme.css', HEAD + core);

/* ---------- components ---------- */
for (const name of COMPONENTS) write(`src/components/${name}/${name}.css`, HEAD + scope(own[name], frames));

// anything left unprefixed would collide with the page's own styles
for (const [name, text] of [['core', core], ...COMPONENTS.map(n => [n, scope(own[n], frames)])]) {
  const bare = text.replace(/\/\*[\s\S]*?\*\//g, '').match(/(?<![\w-])--(?!dm-)[a-zA-Z][\w-]*|@keyframes\s+(?!dm-)[\w-]+/g);
  if (bare) throw new Error(`${name}: unprefixed ${[...new Set(bare)].join(', ')}`);
}

/* ---------- icons: the sprite in core.js becomes JSX ---------- */
const js = file(reg_core, 'js');
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
  return <svg className={cx('dm-i', size !== 'm' && 'dm-' + size, className)} viewBox={BOXES[name] || '0 0 24 24'} aria-hidden="true" focusable="false">{SHAPES[name]}</svg>;
}
`;
write('src/lib/icons.tsx', out);
console.log(`synced core, ${COMPONENTS.length} components and ${names.length} icons`);
