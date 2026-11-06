// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, copied, html, stagger, swap } from '../core/core.js';
DM.def('code-viewer', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{copy}', I('copy'));
  const F = [
    { n:'PlanCard.tsx', t:'re', src:[
      ['<k>import</k> { Button } <k>from</k> <s>"@/ui/button"</s>;',0],
      ['',0],
      ['<k>export function</k> <f>PlanCard</f>({ plan }) {',0],
      ['  <cm>// One CTA per card, annual price first</cm>',1,'The agent removed the second link here. The design review said two CTAs split attention.'],
      ['  <k>return</k> (',0],
      ['    <tg>&lt;Card</tg> <at>padding</at>=<s>"lg"</s><tg>&gt;</tg>',0],
      ['      <tg>&lt;Price</tg> <at>value</at>={plan.annual} <at>was</at>={plan.monthly} <tg>/&gt;</tg>',1,'Shows the monthly price crossed out next to the annual one. This is the change behind the 18% lift.'],
      ['      <tg>&lt;Button</tg> <at>variant</at>=<s>"primary"</s><tg>&gt;</tg>{plan.cta}<tg>&lt;/Button&gt;</tg>',1,'Swapped the custom button for the shared one, so it picks up the library tokens.'],
      ['    <tg>&lt;/Card&gt;</tg>',0],
      ['  );',0],
      ['}',0]
    ]},
    { n:'tokens.css', t:'', src:[
      ['<f>:root</f> {',0],
      ['  --text-muted: <s>#5b6472</s>;',1,'Was #c9cfd8. Contrast on white goes from 2.1 to 5.9, which passes AA.'],
      ['  --radius-card: <s>16px</s>;',0],
      ['  --space-card: <s>24px</s>;',1,'Matched to the 4px grid. Was 18px.'],
      ['}',0]
    ]}
  ];
  const tabs = $('.cvx-tabs', r), code = $('.cvx-code', r), meta = $('.cvx-meta', r);
  tabs.innerHTML = F.map((f, i) => `<button class="cvx-tab" role="tab" data-i="${i}">${f.n}</button>`).join('');
  const hl = s => s.replace(/<(k|s|f|cm|tg|at)>/g, '<span class="$1">').replace(/<\/(k|s|f|cm|tg|at)>/g, '</span>');
  let cur = 0;
  function show(i){
    cur = i; $$('.cvx-tab', tabs).forEach((t, j) => { t.classList.toggle('on', j === i); t.setAttribute('aria-selected', j === i); });
    code.innerHTML = F[i].src.map((l, k) => `<div class="cvx-l${l[1] ? ' new' : ''}" data-k="${k}" role="button" tabindex="0" aria-expanded="false"><span class="n">${k + 1}</span><span class="c">${hl(l[0]) || ' '}</span></div>`).join('');
    stagger($$('.cvx-l', code), 18); meta.innerHTML = `<b>+${F[i].src.filter(l => l[1]).length}</b> changed`;
    // each line is a button, as in React: Enter or Space asks about it too
    $$('.cvx-l', code).forEach(el => { el.onclick = () => ask(el); el.onkeydown = e => { if (e.key === 'Enter' || e.key === ' '){ e.preventDefault(); ask(el); } }; });
  }
  // a note opens and closes its own height, so the code around it moves smoothly
  const fold = (n, open) => { const cs = getComputedStyle(n), ease = getComputedStyle(r).getPropertyValue('--dm-ease').trim() || 'ease';
    const full = { height:cs.height, marginTop:cs.marginTop, marginBottom:cs.marginBottom, paddingTop:cs.paddingTop, paddingBottom:cs.paddingBottom, opacity:1, overflow:'hidden' };
    const none = { height:'0px', marginTop:'0px', marginBottom:'0px', paddingTop:'0px', paddingBottom:'0px', opacity:0, overflow:'hidden' };
    return n.animate(open ? [none, full] : [full, none], { duration:REDUCE ? 1 : 420, easing:ease }); };
  function ask(el){
    const k = +el.dataset.k, l = F[cur].src[k], open = el.classList.contains('on');
    $$('.cvx-note:not(.going)', code).forEach(n => { n.classList.add('going'); fold(n, false).onfinish = () => n.remove(); }); $$('.cvx-l', code).forEach(x => { x.classList.remove('on'); x.setAttribute('aria-expanded', 'false'); });
    if (open) return;
    el.classList.add('on'); el.setAttribute('aria-expanded', 'true');
    const note = html(`<div class="cvx-note">${I('spark','xs')}<span><span class="shim">Reading the line</span></span></div>`); el.after(note); fold(note, true);
    c.later(600, () => swap($('span', note), l[2] || 'Unchanged. The agent kept this line as it was.'));
  }
  $$('.cvx-tab', tabs).forEach(t => t.onclick = () => show(+t.dataset.i));
  const cp = $('.cvx-cp', r);
  cp.onclick = () => { const txt = F[cur].src.map(l => l[0].replace(/<[^>]+>/g, '').replace(/&lt;/g,'<').replace(/&gt;/g,'>')).join('\n'); copied(cp, txt); };
  show(0);
  // the preview asks about one line on its own, unless you take over first
  c.auto(1200, () => { if (!$('.cvx-note', code)) ask($$('.cvx-l', code)[6]); });
});
