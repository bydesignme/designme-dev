// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, hideTip, html } from '../core/core.js';
DM.def('model-compare', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{plus}', I('plus','xs'));
  // the models on offer: the letter and colour of each one's mark (with the text colour on it), what it is good at, and how
  // it behaves in the preview: time to finish, tokens a second, cost, and its answer to the first prompt
  const MOD = {
    Opus:{ k:'O', c:'var(--dm-pl)', t:'var(--dm-on-ink)', d:'Most capable, slower', ms:2400, tps:38, cost:.021, o:'Pro gives every designer an agent that knows your tokens, so reviews take minutes, not days.' },
    Sonnet:{ k:'S', c:'var(--dm-accent)', t:'var(--dm-on-accent)', d:'Balanced speed and quality', ms:1300, tps:74, cost:.006, o:'Ship polished pages faster with an agent that checks every frame for you.' },
    Haiku:{ k:'H', c:'var(--dm-pm)', t:'var(--dm-on-ink)', d:'Fastest, lowest cost', ms:600, tps:142, cost:.001, o:'Your design QA, on autopilot.' }
  };
  const generic = { Opus:'A considered take: the trade-offs first, then one clear recommendation you can act on.', Sonnet:'A clear, direct answer with the two points that matter most.', Haiku:'Short answer: yes, and the one line why.' };
  const form = $('.mcx-in', r), cols = $('.mcx-cols', r), q = $('.mcx-q', r), go = $('.mcx-go', r), cnt = $('.mcx-n', r), add = $('.mcx-add', r), pa = $('.mcx-pa', r), live = $('.mcx-live', r);
  const DEF = q.value, MIN = 2, MAX = 3, C = [];
  let uid = 0, asked = '', sending = false, busy = 0;
  const mark = n => `<span class="mcx-mk" style="background:${MOD[n].c};color:${MOD[n].t}" aria-hidden="true">${MOD[n].k}</span>`;
  const item = n => `${mark(n)}<span>${n}<span class="d">${MOD[n].d}</span></span>`;
  // a rough count of the tokens in some words, for the live count and the totals
  const tok = words => Math.round(words * 1.35);
  const tokens = n => n + (n === 1 ? ' token' : ' tokens');
  function sync(){
    cnt.textContent = C.length + (C.length > 1 ? ' models' : ' model');
    C.forEach(col => { $('.mcx-x', col.el).hidden = C.length <= MIN; });
    add.hidden = C.length >= MAX;
    pa.innerHTML = Object.keys(MOD).map(n => `<button class="mi" role="menuitem" data-close data-m="${n}">${item(n)}</button>`).join('');
    $$('.mi', pa).forEach(b => b.onclick = () => addCol(b.dataset.m, true));
    go.disabled = sending || !q.value.trim();
  }
  function head(col){
    const el = col.el;
    $('.mcx-sel', el).innerHTML = `${mark(col.m)}<span class="nm">${col.m}</span>${I('chev-d','xs')}`;
    $('.mcx-sel', el).setAttribute('aria-label', col.m + ', swap model');
    $('.mcx-x', el).setAttribute('aria-label', 'Remove ' + col.m);
    el.setAttribute('aria-label', col.m);
    $$('.pop .mi', el).forEach(x => x.setAttribute('aria-checked', x.dataset.m === col.m));
  }
  // a column before its first answer: what the model is good at, and a quiet line where the answer will go
  function idle(col){ col.res = null; col.el.classList.remove('done'); $('.mcx-m', col.el).textContent = MOD[col.m].d; $('.mcx-a', col.el).innerHTML = '<span class="ph">Waiting for a prompt</span>'; }
  function addCol(m, fresh){
    const id = 'mcx-p' + (uid++);
    const el = html(`<section class="mcx-c"><div class="mcx-h"><button class="mcx-sel" data-pop=".${id}" aria-haspopup="menu" aria-expanded="false"></button><button class="ib mcx-x" data-tip="Remove">${I('x','xs')}</button></div><div class="pop mcx-pop ${id}" role="menu" aria-label="Swap model">${Object.keys(MOD).map(n => `<button class="mi" role="menuitemradio" data-close data-m="${n}">${item(n)}<span class="ck">${I('check','xs')}</span></button>`).join('')}</div><div class="mcx-m num"></div><div class="mcx-a"></div><div class="mcx-ft"><button class="pill line sm mcx-pick" aria-pressed="false">Use this answer</button></div></section>`);
    const col = { m, el, run:0, res:null };
    C.push(col); cols.appendChild(el); head(col); idle(col);
    // swapping the model clears the pick and, once a prompt has been sent, runs it on the new model in this column
    $$('.pop .mi', el).forEach(x => x.addEventListener('click', () => { if (col.m === x.dataset.m) return; col.m = x.dataset.m; col.run++; head(col); pick(null); if (asked) c.run(() => one(col)); else idle(col); }));
    $('.mcx-x', el).onclick = () => {
      hideTip(); const had = el.contains(document.activeElement);
      C.splice(C.indexOf(col), 1); col.run++; if (el.classList.contains('win')) pick(null);
      sync(); el.classList.add('leave');
      setTimeout(() => { el.remove(); if (had) (add.hidden ? q : add).focus({ preventScroll:true }); }, 260);
    };
    $('.mcx-pick', el).onclick = () => pick(el.classList.contains('win') ? null : col);
    if (fresh){ enter(el); sync(); if (asked) c.run(() => one(col)); }
    return col;
  }
  // the answer that was kept: its column takes the accent's tint, and pressing it again lets it go
  function pick(col){
    C.forEach(x => { const on = x === col, b = $('.mcx-pick', x.el); x.el.classList.toggle('win', on); b.setAttribute('aria-pressed', on); b.innerHTML = on ? I('check','xs') + 'Chosen' : 'Use this answer'; });
    if (col) live.textContent = 'Using the answer from ' + col.m;
  }
  async function one(col){
    const id = ++col.run, el = col.el, m = MOD[col.m], a = $('.mcx-a', el), meta = $('.mcx-m', el);
    el.classList.remove('done'); col.res = null; meta.textContent = m.d; busy++;
    a.innerHTML = '<span class="wk"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Thinking</span></span>';
    try {
      await c.wait(m.ms * .35); if (id !== col.run) return;
      const text = asked === DEF ? m.o : generic[col.m], ws = text.split(' ');
      a.innerHTML = '<span></span>'; const p = a.firstChild;
      for (let i = 0; i < ws.length; i++){
        p.insertAdjacentHTML('beforeend', `<span class="w">${ws[i]} </span>`); meta.textContent = tokens(tok(i + 1));
        await c.wait(m.ms * .65 / ws.length); if (id !== col.run) return;
      }
      col.res = { s:m.ms / 1000, n:tok(ws.length), cost:m.cost };
      meta.innerHTML = `<span class="mcx-tm"></span> · <span class="mcx-tk"></span> · <span class="mcx-co"></span>`;
      $('.mcx-tm', meta).textContent = col.res.s.toFixed(1) + 's'; $('.mcx-tk', meta).textContent = tokens(col.res.n); $('.mcx-co', meta).textContent = '$' + m.cost.toFixed(3);
      $('.mcx-tk', meta).dataset.tip = 'Tokens in the answer';
      el.classList.add('done'); tips(col, false, false);
    } finally { busy--; if (!busy) best(); }
  }
  function tips(col, fast, cheap){
    const meta = $('.mcx-m', col.el), tm = $('.mcx-tm', meta), co = $('.mcx-co', meta); if (!tm) return;
    tm.classList.toggle('best', fast); tm.dataset.tip = (fast ? 'Fastest. ' : '') + 'Time to finish, ' + MOD[col.m].tps + ' tokens a second';
    co.classList.toggle('best', cheap); co.dataset.tip = cheap ? 'Cheapest answer' : 'Cost of this answer';
  }
  // once every column has answered, the fastest time and the lowest cost read a step darker
  function best(){
    const done = C.filter(x => x.res); if (done.length < 2) return;
    const fast = done.reduce((a, b) => b.res.s < a.res.s ? b : a), cheap = done.reduce((a, b) => b.res.cost < a.res.cost ? b : a);
    done.forEach(x => tips(x, x === fast, x === cheap));
  }
  ['Opus','Sonnet','Haiku'].forEach(m => addCol(m)); sync();
  // Run stays off while a run is answering, even if the prompt changes
  const run = () => c.run(async () => {
    const v = q.value.trim(); if (!v || sending) return;
    asked = v; sending = true; pick(null); go.disabled = true; live.textContent = 'Running on ' + C.length + ' models';
    try { await Promise.all(C.map(one)); } finally { sending = false; go.disabled = !q.value.trim(); }
    live.textContent = 'All ' + C.length + ' answers are in';
  });
  form.onsubmit = e => { e.preventDefault(); run(); };
  q.oninput = () => { go.disabled = sending || !q.value.trim(); };
  // the preview's story: run the prompt on all three, read the answers, then keep Sonnet's
  c.story(async s => {
    await s.beat(2);
    await s.tap(go); s.away();
    await s.until(() => !sending && C.every(x => x.res)); await s.beat(3);
    const son = C.find(x => x.m === 'Sonnet');
    if (son){ await s.tap($('.mcx-pick', son.el)); s.away(); }
    await s.beat(4);
  });
});
