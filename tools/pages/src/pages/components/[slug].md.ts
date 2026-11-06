// /components/<component>.md: the same page as Markdown, for AI tools and anyone who wants it as text
import { COMPONENTS, SITE, shadcnUrl } from '../../lib/data.mjs';

export function getStaticPaths(){ return COMPONENTS.map(c => ({ params:{ slug:c.slug }, props:{ c } })); }

const cell = s => String(s).replace(/\|/g, '\\|').replace(/\n/g, ' ');
const fence = (lang, code) => { const t = code.includes('```') ? '````' : '```'; return `${t}${lang}\n${code.replace(/\n$/, '')}\n${t}`; };

export function GET({ props: { c } }){
  const copy = c.copy || {}, rx = c.react, ax = c.astro, out = [];
  out.push(`# ${c.title}`, '', `> ${c.desc}`, '');
  out.push(`${c.section.set} / ${c.section.title}. Free and MIT licensed, as plain HTML, CSS and JavaScript or as a typed React component, in two styles (Soft and Blueprint) with light and dark mode. Live demo: ${SITE}${c.url}`, '');
  out.push('## Install', '', fence('sh', `npx designme add ${c.reg}          # HTML, CSS and JS, with the shared core\nnpx designme add ${c.reg} --react  # React 19 component and its CSS${ax ? `\nnpx designme add ${c.reg} --astro  # Astro component, with the HTML version's CSS and JS` : ''}`), '');
  out.push('The CLI copies the source into your project, so you own it and can change anything.', '');
  out.push('With the shadcn CLI, in a project set up for shadcn/ui:', '', fence('sh', `npx shadcn@latest add ${shadcnUrl(c.reg)}${ax ? `\nnpx shadcn@latest add ${shadcnUrl(c.reg, true)}  # Astro` : ''}`), '');
  if (copy.summary){
    out.push('## About', '', copy.summary, '');
    for (const [h, list] of [['When to use it', copy.use], ['What it does', copy.features], ['Accessibility', copy.a11y]])
      if (list && list.length) out.push(`### ${h}`, '', ...list.map(x => `- ${x}`), '');
  }
  if (rx){
    out.push('## Usage in React', '', fence('tsx', `import { ${rx.component} } from '@/components/designme/${c.reg}/${rx.component}';`), '');
    if (rx.example) out.push('### Example', '', fence('tsx', rx.example), '');
    if (rx.props.length){
      out.push('## Props', '');
      for (const i of rx.props){
        if (rx.props.length > 1) out.push(`### ${i.name}`, '');
        if (i.doc) out.push(i.doc, '');
        out.push('| Prop | Type | What it does |', '| --- | --- | --- |', ...i.props.map(p => `| \`${p.name}\`${p.optional ? ' (optional)' : ''} | \`${cell(p.type)}\` | ${cell(p.doc)} |`), '');
        if (i.extends) out.push(`Also takes the props of \`${i.extends}\`.`, '');
      }
    }
  }
  if (ax) out.push('## Usage in Astro', '', fence('astro', `---\nimport ${ax.component} from '../components/designme/${c.reg}/${ax.component}.astro';\n---\n<${ax.component} />\n<${ax.component} data-style="soft" class="my-class" />`), `It plays its demo; change \`${c.reg}.js\` to show your own data. \`data-style="soft"\` draws it in Soft, and other attributes go on its root element. See ${SITE}/docs/astro.md.`, '');
  if (copy.faq && copy.faq.length) out.push('## Questions', '', ...copy.faq.flatMap(f => [`**${f.q}**`, '', f.a, '']));
  if (rx) out.push('## Source', '', `\`${rx.tsxPath.split('/').pop()}\`, as \`npx designme add ${c.reg} --react\` installs it:`, '', fence('tsx', rx.tsx), '');
  const rel = c.section.cards.filter(x => x.reg !== c.reg);
  if (rel.length) out.push(`## More in ${c.section.title}`, '', ...rel.map(x => `- [${x.title}](${SITE}/components/${x.reg}.md): ${x.desc}`), '');
  out.push(`All components: ${SITE}/llms.txt`, '');
  return new Response(out.join('\n'), { headers:{ 'Content-Type':'text/markdown; charset=utf-8' } });
}
