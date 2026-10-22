// Copies the built pages into the repository root, which Cloudflare Pages serves as it is:
// components.html, components/ and sitemap.xml. Anything else in the build is a mistake, so it stops.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)), DIST = path.join(HERE, 'dist'), ROOT = path.resolve(HERE, '../..');
const expected = new Set(['components.html', 'components', 'sitemap.xml']);
const extra = fs.readdirSync(DIST).filter(f => !expected.has(f));
if (extra.length) throw new Error('unexpected build output: ' + extra.join(', '));
fs.rmSync(path.join(ROOT, 'components'), { recursive:true, force:true });
fs.cpSync(path.join(DIST, 'components'), path.join(ROOT, 'components'), { recursive:true });
for (const f of ['components.html', 'sitemap.xml']) fs.copyFileSync(path.join(DIST, f), path.join(ROOT, f));
const count = fs.readdirSync(path.join(ROOT, 'components')).filter(f => f.endsWith('.html')).length;
console.log(`published components.html, ${count} pages in components/ and sitemap.xml`);
