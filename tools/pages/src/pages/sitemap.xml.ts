// the sitemap: the homepage, /components, every section and every component
import { SITE, SECTIONS, COMPONENTS } from '../lib/data.mjs';
export function GET(){
  const urls = ['/', '/components', ...SECTIONS.map(s => s.url), ...COMPONENTS.map(c => c.url)];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers:{ 'Content-Type':'application/xml' } });
}
