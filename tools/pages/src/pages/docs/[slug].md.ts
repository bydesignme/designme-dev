// /docs/<page>.md: the same page as Markdown, for AI tools and anyone who wants it as text. The visuals become what they
// show: the groups as a table, the default accents as a table of their values; the live previews are left out
import { DOCS, GROUPS, inlineMd, comp, treeText } from '../../lib/docs.mjs';
import { SITE, ACCENTS } from '../../lib/data.mjs';

export function getStaticPaths(){ return DOCS.map(d => ({ params:{ slug:d.slug }, props:{ d } })); }

const cell = s => inlineMd(String(s)).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const fence = (lang, code) => { const t = code.includes('```') ? '````' : '```'; return `${t}${lang}\n${code.replace(/\n$/, '')}\n${t}`; };
const table = (heads, rows) => [`| ${heads.map(cell).join(' | ')} |`, `| ${heads.map(() => '---').join(' | ')} |`, ...rows.map(r => `| ${r.map(cell).join(' | ')} |`), ''];
const link = reg => `[${comp(reg).title}](/components/${reg})`;

function blocks(list, depth = 3){
  const out = [];
  for (const b of list){
    const h = '#'.repeat(Math.min(depth, 6));
    if (b[0] === 'p') out.push(inlineMd(b[1]), '');
    else if (b[0] === 'note') out.push(`> ${inlineMd(b[1])}`, '');
    else if (b[0] === 'ul') out.push(...b[1].map(x => `- ${inlineMd(x)}`), '');
    else if (b[0] === 'ol') out.push(...b[1].map((x, i) => `${i + 1}. ${inlineMd(x)}`), '');
    else if (b[0] === 'code') out.push(fence(b[1], b[2]), '');
    else if (b[0] === 'table') out.push(...table(b[1], b[2]));
    else if (b[0] === 'steps') b[1].forEach(([t, inner], i) => out.push(`${h} ${i + 1}. ${t}`, '', ...blocks(inner, depth + 1)));
    else if (b[0] === 'tabs' || b[0] === 'cols') b[1].forEach(([t, inner]) => out.push(`${h} ${t}`, '', ...blocks(inner, depth + 1)));
    else if (b[0] === 'tree') out.push(`${b[1]}:`, '', fence('text', treeText(b[2]).join('\n')), '');
    else if (b[0] === 'cards') out.push(...b[1].map(([t, d, href]) => `- [${t}](${href}): ${d}`).map(inlineMd), '');
    else if (b[0] === 'keys') out.push(...table(['Keys', 'What they do', 'Where'], b[1].map(([k, what, where]) => [k.join(' '), what, where.map(link).join(', ')])));
    else if (b[0] === 'groups') for (const G of GROUPS) out.push(`${h} ${G.name} (${G.n})`, '', ...table(['Group', 'Count', 'Components'], G.secs.map(s => [s.title, String(s.cards.length), s.cards.map(c => link(c.reg)).join(', ')])));
    else if (b[0] === 'swatches') out.push(...table(['Role', 'Soft light', 'Soft dark', 'Blueprint light', 'Blueprint dark'],
      [['Fill, `--accent`', 'accent'], ['On fill, `--on-accent`', 'onAccent'], ['Text, `--accent-fg`', 'accentFg'], ['Mark, `--accent-mark`', 'accentMark'], ['Tint, `--accent-bg`', 'accentBg']]
        .map(([n, k]) => [n, ...['soft-light', 'soft-dark', 'bp-light', 'bp-dark'].map(v => '`' + ACCENTS[v][k] + '`')])));
    else if (b[0] === 'styles' || b[0] === 'preview') continue;
    else throw new Error('docs: no Markdown for a block called ' + b[0]);
  }
  return out;
}

export function GET({ props: { d } }){
  const out = [`# ${d.title}`, '', `> ${inlineMd(d.lead)}`, '', `Designme.dev docs. The same page with navigation: ${SITE}${d.url}`, ''];
  for (const sec of d.sections) out.push(`## ${sec.h}`, '', ...blocks(sec.blocks));
  out.push('## More docs', '', ...DOCS.filter(x => x !== d).map(x => `- [${x.title}](${SITE}${x.url}.md): ${x.desc}`), '');
  out.push(`All components: ${SITE}/llms.txt`, '');
  return new Response(out.join('\n').replace(/\n{3,}/g, '\n\n'), { headers:{ 'Content-Type':'text/markdown; charset=utf-8' } });
}
