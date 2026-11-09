// Copies the built pages into the repository root, which Cloudflare Pages serves as it is: components/, docs/, templates/
// and sitemap.xml.
// Anything else in the build is a mistake, so it stops. It also writes _redirects: the homepage lists every component,
// so /components and each /components/<section> go there, to that section.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const HERE = path.dirname(fileURLToPath(import.meta.url)), DIST = path.join(HERE, 'dist'), ROOT = path.resolve(HERE, '../..');
const expected = new Set(['components', 'docs', 'templates', 'sitemap.xml']);
const extra = fs.readdirSync(DIST).filter(f => !expected.has(f));
if (extra.length) throw new Error('unexpected build output: ' + extra.join(', '));
fs.rmSync(path.join(ROOT, 'components'), { recursive:true, force:true });
fs.cpSync(path.join(DIST, 'components'), path.join(ROOT, 'components'), { recursive:true });
fs.rmSync(path.join(ROOT, 'docs'), { recursive:true, force:true });
fs.cpSync(path.join(DIST, 'docs'), path.join(ROOT, 'docs'), { recursive:true });
// the templates (whole app screens made of the components); indexed and in the sitemap since 9 Nov
fs.rmSync(path.join(ROOT, 'templates'), { recursive:true, force:true });
fs.cpSync(path.join(DIST, 'templates'), path.join(ROOT, 'templates'), { recursive:true });
fs.copyFileSync(path.join(DIST, 'sitemap.xml'), path.join(ROOT, 'sitemap.xml'));
fs.rmSync(path.join(ROOT, 'components.html'), { force:true });
const site = JSON.parse(fs.readFileSync(path.join(HERE, 'data/site.json'), 'utf8'));
fs.writeFileSync(path.join(ROOT, '_redirects'), [
  '# written by tools/pages/publish.mjs',
  '# the Fundraising CRM template is off the site for now (owner, 9 Nov); its code is in tools/pages/src/templates/fundraising-crm',
  '/templates/fundraising-crm /templates/sales-crm 302',
  '# the homepage lists every component: the old list and section pages go there',
  '/components / 301', '/components/ / 301', '/components.html / 301',
  ...site.sections.map(s => `/components/${s.slug} /#${s.id} 301`),
  '# the React preview page is retired: each component has its own page with its React usage and code',
  '/packages/react/preview /components 301'.replace('/components', '/'), '/packages/react/preview/* / 301',
  '# Variant carousel and Image carousel became one component, Carousel, with a switch between the two (owner, 4 Nov)',
  '/components/variant-carousel /components/carousel 301', '/components/image-carousel /components/carousel 301',
  '/components/variant-carousel.md /components/carousel.md 301', '/components/image-carousel.md /components/carousel.md 301',
  '# the docs start at their introduction',
  '/docs /docs/introduction 302', '/docs/ /docs/introduction 302', ''
].join('\n'));
// hover styles only apply with a mouse (tools/site/hover-gate.js, run by astro.config.mjs and on the registry's CSS): check
// no page keeps one a tap could leave stuck. The docs' live previews hold their styles in an escaped srcdoc
{
  const { ungated } = createRequire(import.meta.url)('../site/hover-gate.js');
  const unesc = t => t.replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
  const left = ['components', 'docs', 'templates'].flatMap(d => fs.readdirSync(path.join(ROOT, d)).filter(f => f.endsWith('.html')).flatMap(f => {
    const t = fs.readFileSync(path.join(ROOT, d, f), 'utf8');
    return [...t.replace(/srcdoc="[^"]*"/g, '').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g), ...[...t.matchAll(/srcdoc="([^"]*)"/g)].flatMap(m => [...unesc(m[1]).matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)])]
      .flatMap(m => ungated(m[1]).map(s => `${d}/${f}: ${s}`));
  }));
  if (left.length) throw new Error('hover styles outside (hover:hover) and (pointer:fine): ' + left.slice(0, 5).join(' | '));
}
const count = fs.readdirSync(path.join(ROOT, 'components')).filter(f => f.endsWith('.html')).length;
const docs = fs.readdirSync(path.join(ROOT, 'docs')).filter(f => f.endsWith('.html')).length;
const tpl = fs.readdirSync(path.join(ROOT, 'templates')).filter(f => f.endsWith('.html')).length;
console.log(`published ${count} pages in components/, ${docs} in docs/, ${tpl} in templates/, sitemap.xml and _redirects`);
