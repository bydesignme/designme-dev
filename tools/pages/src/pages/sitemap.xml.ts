// the sitemap: the homepage, the docs, every component's page and the templates (indexed since 9 Nov, owner)
import { SITE, COMPONENTS } from '../lib/data.mjs';
import { DOCS } from '../lib/docs.mjs';
export function GET(){
  const urls = ['/', ...DOCS.map(d => d.url), ...COMPONENTS.map(c => c.url), '/templates/sales-crm', '/templates/fundraising-crm', '/templates/workflow-editor'];
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u => `  <url><loc>${SITE}${u === '/' ? '/' : u}</loc></url>`).join('\n')}\n</urlset>\n`;
  return new Response(body, { headers:{ 'Content-Type':'application/xml' } });
}
