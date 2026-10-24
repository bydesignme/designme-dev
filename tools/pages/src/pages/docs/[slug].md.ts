// /docs/<page>.md: the same page as Markdown, for AI tools and anyone who wants it as text
import { DOCS, inlineMd } from '../../lib/docs.mjs';
import { SITE } from '../../lib/data.mjs';

export function getStaticPaths(){ return DOCS.map(d => ({ params:{ slug:d.slug }, props:{ d } })); }

const cell = s => inlineMd(String(s)).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const fence = (lang, code) => { const t = code.includes('```') ? '````' : '```'; return `${t}${lang}\n${code.replace(/\n$/, '')}\n${t}`; };

export function GET({ props: { d } }){
  const out = [`# ${d.title}`, '', `> ${inlineMd(d.lead)}`, '', `Designme.dev docs. The same page with navigation: ${SITE}${d.url}`, ''];
  for (const sec of d.sections){
    out.push(`## ${sec.h}`, '');
    for (const b of sec.blocks){
      if (b[0] === 'p') out.push(inlineMd(b[1]), '');
      else if (b[0] === 'ul') out.push(...b[1].map(x => `- ${inlineMd(x)}`), '');
      else if (b[0] === 'ol') out.push(...b[1].map((x, i) => `${i + 1}. ${inlineMd(x)}`), '');
      else if (b[0] === 'code') out.push(fence(b[1], b[2]), '');
      else if (b[0] === 'table') out.push(`| ${b[1].map(cell).join(' | ')} |`, `| ${b[1].map(() => '---').join(' | ')} |`, ...b[2].map(r => `| ${r.map(cell).join(' | ')} |`), '');
    }
  }
  out.push('## More docs', '', ...DOCS.filter(x => x !== d).map(x => `- [${x.title}](${SITE}${x.url}.md): ${x.desc}`), '');
  out.push(`All components: ${SITE}/llms.txt`, '');
  return new Response(out.join('\n'), { headers:{ 'Content-Type':'text/markdown; charset=utf-8' } });
}
