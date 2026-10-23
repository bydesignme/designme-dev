// Copies the built pages into the repository root, which Cloudflare Pages serves as it is: components/ and sitemap.xml.
// Anything else in the build is a mistake, so it stops. It also writes _redirects: the homepage lists every component,
// so /components and each /components/<section> go there, to that section.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), DIST = path.join(HERE, 'dist'), ROOT = path.resolve(HERE, '../..');
const expected = new Set(['components', 'sitemap.xml']);
const extra = fs.readdirSync(DIST).filter(f => !expected.has(f));
if (extra.length) throw new Error('unexpected build output: ' + extra.join(', '));
fs.rmSync(path.join(ROOT, 'components'), { recursive:true, force:true });
fs.cpSync(path.join(DIST, 'components'), path.join(ROOT, 'components'), { recursive:true });
fs.copyFileSync(path.join(DIST, 'sitemap.xml'), path.join(ROOT, 'sitemap.xml'));
fs.rmSync(path.join(ROOT, 'components.html'), { force:true });
const site = JSON.parse(fs.readFileSync(path.join(HERE, 'data/site.json'), 'utf8'));
fs.writeFileSync(path.join(ROOT, '_redirects'), [
  '# written by tools/pages/publish.mjs',
  '# the homepage lists every component: the old list and section pages go there',
  '/components / 301', '/components/ / 301', '/components.html / 301',
  ...site.sections.map(s => `/components/${s.slug} /#${s.id} 301`),
  '# the React preview page is retired: each component has its own page with its React usage and code',
  '/packages/react/preview /components 301'.replace('/components', '/'), '/packages/react/preview/* / 301', ''
].join('\n'));
const count = fs.readdirSync(path.join(ROOT, 'components')).filter(f => f.endsWith('.html')).length;
console.log(`published ${count} pages in components/, sitemap.xml and _redirects`);
