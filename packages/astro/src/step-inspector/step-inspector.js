// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, REDUCE, closePops, enter, html, seg, swap } from '../core/core.js';
DM.def('step-inspector', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)(?:\.(xs))?\}/g, (m, k, z) => I(k, z || 's'));
  const uid = 'sti' + Math.random().toString(36).slice(2, 7);
  const body = $('.sti-body', r), nameIn = $('.sti-n', r), kd = $('.sti-kd', r), tile = $('.sti-h>.sti-ti', r), live = $('.sti-live', r);
  const pk = $('.sti-pk', r), dp = $('.sti-dp', r), mm = $('.sti-mm', r), testB = $('.sti-test', r), nr = $('.sti-nr', r);
  const KIND = { trigger:'Trigger', ai:'AI step', tool:'Tool', app:'App step', output:'Output', branch:'Branch', wait:'Wait', approval:'Approval' };
  // each data type has its colour: text blue, numbers green, lists orange, objects pink, yes or no yellow, dates teal
  const TY = { text:'b', number:'m', list:'p', object:'k', bool:'y', date:'t' };
  // the workflow around the step: what each step hands on, as [field, type, sample]
  const SRC = {
    form:{ t:'Demo request form', k:'trigger', ic:'file-text', out:[['name', 'text', 'Priya Shah'], ['email', 'text', 'priya@corvid.io'], ['company', 'text', 'Corvid Analytics'], ['seats', 'number', '240']] },
    lookup:{ t:'Company lookup', k:'tool', ic:'globe', out:[['employees', 'number', '420'], ['industry', 'text', 'Analytics software'], ['funding', 'text', 'Series B']] },
    research:{ t:'Research and score', k:'ai', ic:'spark', out:[['score', 'number', '84'], ['tier', 'text', 'Enterprise'], ['reasons', 'list', '3 reasons'], ['company', 'object', '{ 5 fields }']] },
    reply:{ t:'Draft a reply', k:'ai', ic:'edit', out:[['subject', 'text', 'Your demo with Fernhill'], ['body', 'text', 'Hi Priya, thanks for writing']] },
    nurture:{ t:'Add to nurture list', k:'app', ic:'users', out:[] }
  };
  const PEOPLE = { MK:['Maya Kim', 'l'], TR:['Theo Reed', 't'], AN:['Ana Novak', 'p'], JB:['Jonah Brooks', 'm'] };
  const TOOLS = [['lookup', 'Company lookup', 'globe'], ['search', 'Web search', 'search'], ['crm', 'CRM lookup', 'db']];
  const OPTS = { model:[['Sonnet 5.5', 'Balanced, the default'], ['Opus 5.5', 'Deepest reasoning, slower'], ['Haiku 5.5', 'Fastest and cheapest']], op:[['is at least'], ['is below'], ['is exactly']],
    via:[['Slack message'], ['Email'], ['In the app']], expire:[['4 hours'], ['24 hours'], ['3 days']], then:[['Stop the run'], ['Send it anyway'], ['Ask someone else']],
    limit:[['15 seconds'], ['30 seconds'], ['60 seconds']], onfail:[['Stop the run'], ['Skip this step'], ['Carry on with empty data']] };
  const LABEL = { model:'Model', op:'Comparison', via:'Ask in', expire:'Nobody answers in', then:'Then', limit:'Time limit', onfail:'If it still fails' };
  // the three steps the demo switches between, each with only the settings its kind has. The AI step reads an email from a
  // step called Contact, which is no longer in the workflow, so that input is flagged
  const STEP = {
    ai:{ n:'Research and score', ic:'spark', at:2, up:['form', 'lookup'], model:'Sonnet 5.5', tools:['lookup'],
      ins:['Look up ', 'form.company', ' and the person who wrote in. Score how well they fit our plans from 0 to 100, with three reasons.\nTheir team is ', 'lookup.employees', ' people.'],
      in:[['company', 'form.company'], ['seats', 'form.seats'], ['email', 'contact.email']], out:SRC.research.out, retries:1, backoff:'fixed', limit:'60 seconds', onfail:'Stop the run' },
    branch:{ n:'Good fit?', ic:'branch', at:3, up:['form', 'lookup', 'research'], rule:{ v:'research.score', op:'is at least', n:70 }, yes:'reply', no:'nurture', out:[['path', 'text', 'Yes']] },
    approval:{ n:'Rep approves', ic:'user', at:5, up:['form', 'lookup', 'research', 'reply'], who:['MK', 'TR'], via:'Slack message', sees:'reply.body', expire:'24 hours', then:'Stop the run', out:[['decision', 'text', 'Approved'], ['by', 'text', 'Maya Kim']] }
  };
  const shut = new Set(['out', 'fail']);
  let k = 'ai', S = STEP.ai, target = null, caret = null, off = false;
  const say = t => { live.textContent = ''; c.later(40, () => { live.textContent = t; }); };
  const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
  const known = ref => { const [s] = ref.split('.'); return !!SRC[s] && S.up.includes(s); };
  const nameOf = ref => { const [s, f] = ref.split('.'); return (SRC[s] ? SRC[s].t : cap(s)) + ' › ' + f; };
  // a mapped field: the step's tile, the step and the field; one no earlier step gives is red
  const tok = (ref, attrs = '') => { const [s, f] = ref.split('.'), src = SRC[s];
    if (!known(ref)) return `<span class="sti-tok bad"${attrs}>${I('alert', 'xs')}<span class="s">${src ? src.t : cap(s)}</span><span class="sep" aria-hidden="true">›</span><span class="f">${f}</span></span>`;
    return `<span class="sti-tok"${attrs}><span class="sti-ti" data-k="${src.k}" aria-hidden="true">${I(src.ic, 'xs')}</span><span class="s">${src.t}</span><span class="sep" aria-hidden="true">›</span><span class="f">${f}</span></span>`; };
  const ty = t => `<span class="tag ${TY[t]}">${t}</span>`;
  const sec = (id, t, inner, meta = '') => `<div class="sti-sec" data-sec="${id}"><button class="sti-sh" aria-expanded="${!shut.has(id)}" aria-controls="${uid}-${id}" data-sec="${id}">${I('chev-r', 'xs')}<span>${t}</span>${meta}</button><div class="fold${shut.has(id) ? ' shut' : ''}" id="${uid}-${id}"><div><div class="sti-rows">${inner}</div></div></div></div>`;
  const row = (label, v, cls = '') => `<div class="sti-row${cls}"><span class="k">${label}</span><div class="v">${v}</div></div>`;
  const sel = (f, v) => `<button class="sti-sel" data-f="${f}" data-pop=".sti-pk" aria-haspopup="menu" aria-expanded="false" aria-label="${LABEL[f]}: ${v}"><span>${v}</span>${I('chev-d', 'xs')}</button>`;
  const tokB = (f, ref, label) => `<button class="sti-tokb" data-f="${f}" data-pop=".sti-dp" aria-haspopup="menu" aria-expanded="false" aria-label="${label}: ${nameOf(ref)}${known(ref) ? '' : ', which no earlier step gives'}. Change it">${tok(ref)}</button>`;
  const note = ref => known(ref) ? '' : `<p class="sti-note">${cap(ref.split('.')[0])} isn't an earlier step any more. Pick where ${ref.split('.')[1]} comes from.</p>`;
  const insHTML = () => S.ins.map(p => typeof p === 'string' && !/^\w+\.\w+$/.test(p) ? p.replace(/&/g, '&amp;').replace(/</g, '&lt;') : tok(p, ` contenteditable="false" data-ref="${p}"`)).join('');
  const chip = (ic, k, t, x, attr) => `<span class="sti-chip">${k === 'av' ? AV(ic, `var(--dm-av-${PEOPLE[attr][1]})`).replace('<span class="av"', '<span class="av" aria-hidden="true"') : `<span class="sti-ti" data-k="${k}" aria-hidden="true">${I(ic, 'xs')}</span>`}<span>${t}</span><button class="sti-cx" data-x="${attr}" aria-label="Remove ${t}" data-tip="Remove">${I('x', 'xs')}</button></span>`;
  const missing = () => (S.in || []).filter(([, v]) => !known(v)).length;
  const inMeta = () => missing() ? `<span class="tag bad">${missing()} missing</span>` : `<span class="n">${S.in.length} mapped</span>`;
  const outs = () => sec('out', 'Output', S.out.map(([f, t, ex]) => `<div class="sti-out"><span>${f}</span>${ty(t)}<span class="ex">${ex}</span></div>`).join(''), `<span class="n">${S.out.length} ${S.out.length === 1 ? 'field' : 'fields'}</span>`);
  const num = (f, v, lo, hi, label) => `<span class="sti-num" role="group" aria-label="${label}"><button class="ib" data-f="${f}" data-d="-1" aria-label="Fewer ${label.toLowerCase()}" data-tip="Fewer"${v <= lo ? ' aria-disabled="true"' : ''}>${I('minus', 'xs')}</button><span class="num" aria-live="polite">${v}</span><button class="ib" data-f="${f}" data-d="1" aria-label="More ${label.toLowerCase()}" data-tip="More"${v >= hi ? ' aria-disabled="true"' : ''}>${I('plus', 'xs')}</button></span>`;
  const link = id => `<span class="sti-link"><span class="sti-ti" data-k="${SRC[id].k}" aria-hidden="true">${I(SRC[id].ic, 'xs')}</span><span>${SRC[id].t}</span></span>`;
  function render(fresh){
    const T = { ai:'spark', branch:'branch', approval:'user' }[k];
    tile.dataset.k = k; tile.innerHTML = I(T, 's'); r.querySelector('.sti').dataset.k = k;
    nameIn.value = S.n; kd.classList.remove('ok'); kd.textContent = `${KIND[k]}, step ${S.at} of 7`;
    let h = '';
    if (k === 'ai'){
      h += sec('setup', 'Setup', row(LABEL.model, sel('model', S.model))
        + `<div class="sti-insw"><div class="sti-ih"><span class="k" id="${uid}-il">Instructions</span><button class="pill ghost sm sti-insert" data-f="ins" data-pop=".sti-dp" aria-haspopup="menu" aria-expanded="false">${I('plus', 'xs')}Insert data</button></div>`
        + `<div class="sti-ins" contenteditable="true" role="textbox" aria-multiline="true" aria-labelledby="${uid}-il" spellcheck="false">${insHTML()}</div></div>`
        + row('Tools', `<span class="sti-chips">${S.tools.map(t => { const x = TOOLS.find(y => y[0] === t); return chip(x[2], 'tool', x[1], null, t); }).join('')}<button class="sti-add" data-f="tool" data-pop=".sti-pk" aria-haspopup="menu" aria-expanded="false" aria-label="Add a tool" data-tip="Add a tool">${I('plus', 'xs')}</button></span>`, ' top'));
      h += sec('in', 'Inputs', S.in.map(([f, v]) => row(f, tokB('in.' + f, v, f)) + note(v)).join(''), inMeta());
      h += outs();
      h += sec('fail', 'If it fails', row('Retries', num('retries', S.retries, 0, 5, 'Retries'))
        + row('Wait between', `<div class="seg2 sti-seg" role="group" aria-label="Wait between tries" data-f="backoff"><button aria-pressed="${S.backoff === 'fixed'}" data-v="fixed">2s each</button><button aria-pressed="${S.backoff === 'doubling'}" data-v="doubling">Doubling</button></div>`)
        + row(LABEL.limit, sel('limit', S.limit)) + row(LABEL.onfail, sel('onfail', S.onfail)));
    }
    if (k === 'branch'){
      h += sec('setup', 'Takes Yes when', `<div class="sti-rule">${tokB('rule', S.rule.v, 'Value')}${sel('op', S.rule.op)}<input class="sti-in" type="number" inputmode="numeric" min="0" max="100" value="${S.rule.n}" aria-label="Threshold"></div>`
        + row('Yes', link(S.yes)) + row('No', link(S.no)));
      h += outs();
    }
    if (k === 'approval'){
      h += sec('setup', 'Who approves', row('People', `<span class="sti-chips">${S.who.map(w => chip(w, 'av', PEOPLE[w][0], null, w)).join('')}<button class="sti-add" data-f="who" data-pop=".sti-pk" aria-haspopup="menu" aria-expanded="false" aria-label="Add a person" data-tip="Add a person">${I('plus', 'xs')}</button></span>`, ' top')
        + row(LABEL.via, sel('via', S.via)) + row('They see', tokB('sees', S.sees, 'They see')));
      h += sec('exp', 'If nobody answers', row(LABEL.expire, sel('expire', S.expire)) + row(LABEL.then, sel('then', S.then)));
      h += outs();
    }
    body.innerHTML = h; caret = null;
    $$('.sti-seg', body).forEach(g => seg(g, v => { S.backoff = v; say(v === 'doubling' ? 'Waits double between tries' : 'Waits 2 seconds between tries'); }));
    if (fresh && !REDUCE){ body.classList.remove('in'); void body.offsetWidth; body.classList.add('in'); }
  }
  // the switch under the demo picks the kind of step; a pick that isn't the demo's own is the visitor taking over
  let byDemo = false;
  const kseg = $('.demo .seg2', r);
  seg(kseg, v => { if (!byDemo) c.mine = true; if (v === k) return; closePops(); k = v; S = STEP[v]; off = false; paintOff(); render(true); });
  const kindTo = v => { byDemo = true; const b = $(`button[data-v="${v}"]`, kseg); if (b) b.click(); byDemo = false; };
  // the menus are written as they open: a choice's options, the tools, the people, and the data from earlier steps
  const ck = `<span class="ck">${I('check', 'xs')}</span>`;
  function fillPk(b){
    const f = b.dataset.f; target = b;
    if (f === 'tool'){ pk.setAttribute('aria-label', 'Add a tool'); pk.innerHTML = `<div class="ph" role="none">Give ${S.n} a tool</div>` + TOOLS.map(([id, t, ic]) => `<button class="mi" role="menuitem" tabindex="-1" data-tool="${id}" data-close${S.tools.includes(id) ? ' aria-disabled="true"' : ''}><span class="sti-ti" data-k="tool" aria-hidden="true">${I(ic, 'xs')}</span><span>${t}</span></button>`).join(''); return; }
    if (f === 'who'){ pk.setAttribute('aria-label', 'Who approves'); pk.innerHTML = `<div class="ph" role="none">Who approves</div>` + Object.keys(PEOPLE).map(w => `<button class="mi" role="menuitemcheckbox" aria-checked="${S.who.includes(w)}" tabindex="-1" data-w="${w}" data-close>${AV(w, `var(--dm-av-${PEOPLE[w][1]})`)}<span>${PEOPLE[w][0]}</span>${ck}</button>`).join(''); return; }
    const cur = f === 'op' ? S.rule.op : S[f];
    pk.setAttribute('aria-label', LABEL[f]);
    pk.innerHTML = `<div class="ph" role="none">${LABEL[f]}</div>` + OPTS[f].map(([v, d]) => `<button class="mi" role="menuitemradio" aria-checked="${v === cur}" tabindex="-1" data-v="${v}" data-close><span>${v}${d ? `<span class="d">${d}</span>` : ''}</span>${ck}</button>`).join('');
  }
  function fillDp(b){
    target = b; const f = b.dataset.f, cur = f === 'ins' ? null : f === 'rule' ? S.rule.v : f === 'sees' ? S.sees : (S.in.find(x => 'in.' + x[0] === f) || [])[1];
    dp.innerHTML = S.up.map(s => { const src = SRC[s]; return `<div role="group" aria-label="${src.t}"><div class="ph" role="none"><span class="sti-ti" data-k="${src.k}" aria-hidden="true">${I(src.ic, 'xs')}</span>${src.t}</div>`
      + src.out.map(([fd, t, ex]) => `<button class="mi" role="menuitemradio" aria-checked="${s + '.' + fd === cur}" tabindex="-1" data-ref="${s}.${fd}" data-close><span>${fd}</span>${ty(t)}<span class="r">${ex}</span></button>`).join('') + '</div>'; }).join('');
  }
  // what the instructions say, read back from the box: its text, and its tokens as references
  const readIns = el => { const out = []; el.childNodes.forEach(n => { if (n.nodeType === 3) out.push(n.textContent); else if (n.dataset && n.dataset.ref) out.push(n.dataset.ref); else if (n.nodeName === 'BR') out.push('\n'); else out.push('\n' + n.textContent); }); return out; };
  function insertTok(ref){
    const box = $('.sti-ins', body); if (!box) return;
    const t = html(tok(ref, ` contenteditable="false" data-ref="${ref}"`)); t.classList.add('new');
    const sp = document.createTextNode(' ');
    if (caret && box.contains(caret.startContainer)){ caret.collapse(false); caret.insertNode(sp); caret.insertNode(t); }
    else { if (box.lastChild && box.lastChild.nodeType === 3 && !/\s$/.test(box.lastChild.textContent)) box.appendChild(document.createTextNode(' ')); box.append(t, sp); }
    S.ins = readIns(box);
  }
  function map(f, ref){
    if (f === 'ins'){ insertTok(ref); say(`Inserted ${nameOf(ref)} into the instructions`); return; }
    if (f === 'rule') S.rule.v = ref; else if (f === 'sees') S.sees = ref; else { const x = S.in.find(y => 'in.' + y[0] === f); if (x) x[1] = ref; }
    const b = $(`.sti-tokb[data-f="${f}"]`, body); if (!b) return;
    const label = f === 'rule' ? 'Value' : f === 'sees' ? 'They see' : f.slice(3);
    b.outerHTML = tokB(f, ref, label);
    const nb = $(`.sti-tokb[data-f="${f}"]`, body), n = nb.closest('.sti-row').nextElementSibling;
    if (n && n.classList.contains('sti-note')) n.remove();
    if (!known(ref)) nb.closest('.sti-row').insertAdjacentHTML('afterend', note(ref));
    enter($('.sti-tok', nb));
    const m = $('.sti-sec[data-sec="in"] .sti-sh', body); if (m){ $$('.tag, .n', m).forEach(x => x.remove()); m.insertAdjacentHTML('beforeend', inMeta()); }
    say(`${label} now reads ${nameOf(ref)}`);
  }
  c.on(document, 'selectionchange', () => { const s = getSelection(), box = $('.sti-ins', body); if (s.rangeCount && box && box.contains(s.anchorNode)) caret = s.getRangeAt(0).cloneRange(); });
  c.on(body, 'input', e => { if (e.target.matches('.sti-ins')) S.ins = readIns(e.target); if (e.target.matches('.sti-in')) S.rule.n = Math.max(0, Math.min(100, +e.target.value || 0)); });
  // Enter starts a new line in the instructions as plain text, so the box never fills with markup
  c.on(body, 'keydown', e => { if (e.key !== 'Enter' || !e.target.matches('.sti-ins')) return; e.preventDefault(); const s = getSelection(); if (!s.rangeCount) return; const rg = s.getRangeAt(0); rg.deleteContents(); const nl = document.createTextNode('\n'); rg.insertNode(nl); rg.setStartAfter(nl); rg.collapse(true); s.removeAllRanges(); s.addRange(rg); S.ins = readIns(e.target); });
  c.on(r, 'click', e => {
    const b = e.target.closest('button'); if (!b || !r.contains(b)) return;
    if (b.matches('[data-pop=".sti-pk"]')) return fillPk(b);
    if (b.matches('[data-pop=".sti-dp"]')) return fillDp(b);
    if (b.dataset.sec){ const f = b.nextElementSibling, open = f.classList.toggle('shut') === false; b.setAttribute('aria-expanded', String(open)); open ? shut.delete(b.dataset.sec) : shut.add(b.dataset.sec); return; }
    if (b.dataset.d){ if (b.getAttribute('aria-disabled') === 'true') return; const v = Math.max(0, Math.min(5, S.retries + +b.dataset.d)); S.retries = v; const g = b.closest('.sti-num'); $('.num', g).textContent = v;
      $$('.ib', g).forEach(x => { const lo = +x.dataset.d < 0 ? v <= 0 : v >= 5; lo ? x.setAttribute('aria-disabled', 'true') : x.removeAttribute('aria-disabled'); }); return; }
    if (b.matches('.sti-cx')){ const x = b.dataset.x;
      if (k === 'ai'){ S.tools = S.tools.filter(t => t !== x); say(`Removed ${TOOLS.find(t => t[0] === x)[1]}`); }
      else { if (S.who.length < 2){ say('Someone has to approve. Add another person first'); return; } S.who = S.who.filter(w => w !== x); say(`Removed ${PEOPLE[x][0]}`); }
      const ch = b.closest('.sti-chip'), add = ch.parentElement.querySelector('.sti-add'); ch.remove(); if (e.isTrusted && add) add.focus({ preventScroll:true }); return; }
    if (b.closest('.sti-pk') && b.matches('.mi')){
      if (b.getAttribute('aria-disabled') === 'true') return;
      const f = target && target.dataset.f;
      if (b.dataset.tool){ S.tools.push(b.dataset.tool); const x = TOOLS.find(t => t[0] === b.dataset.tool), add = $('.sti-add[data-f="tool"]', body); add.insertAdjacentHTML('beforebegin', chip(x[2], 'tool', x[1], null, x[0])); enter(add.previousElementSibling); say(`${S.n} can use ${x[1]}`); return; }
      if (b.dataset.w){ const w = b.dataset.w, add = $('.sti-add[data-f="who"]', body);
        if (S.who.includes(w)){ if (S.who.length < 2) return say('Someone has to approve'); S.who = S.who.filter(x => x !== w); const ch = $(`.sti-cx[data-x="${w}"]`, body); if (ch) ch.closest('.sti-chip').remove(); say(`Removed ${PEOPLE[w][0]}`); return; }
        S.who.push(w); add.insertAdjacentHTML('beforebegin', chip(w, 'av', PEOPLE[w][0], null, w)); enter(add.previousElementSibling); say(`${PEOPLE[w][0]} can approve`); return; }
      const v = b.dataset.v; if (f === 'op') S.rule.op = v; else S[f] = v;
      if (target && target.isConnected){ $('span', target).textContent = v; target.setAttribute('aria-label', `${LABEL[f]}: ${v}`); }
      say(`${LABEL[f]}: ${v}`); return;
    }
    if (b.closest('.sti-dp') && b.dataset.ref){ if (target) map(target.dataset.f, b.dataset.ref); return; }
    if (b.closest('.sti-mm')){ if (b.dataset.a === 'rename') setTimeout(() => { nameIn.focus(); nameIn.select(); }, 140); if (b.dataset.a === 'off'){ off = !off; paintOff(); say(off ? `${S.n} is off. Runs skip it` : `${S.n} is on`); } return; }
  });
  function paintOff(){ const t = $('.sti-off', nr); if (off && !t) nr.insertAdjacentHTML('beforeend', '<span class="tag sti-off">Off</span>'); if (!off && t) t.remove();
    const m = $('[data-a="off"]', mm); m.innerHTML = `${I(off ? 'play' : 'pause', 's')}<span>${off ? 'Turn on' : 'Turn off'}</span>`; }
  // the name saves as it is typed; Escape puts back the name it had when the field took the focus
  let was = S.n;
  c.on(nameIn, 'focus', () => { was = S.n; });
  c.on(nameIn, 'input', () => { S.n = nameIn.value; });
  c.on(nameIn, 'keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); nameIn.blur(); } if (e.key === 'Escape'){ nameIn.value = S.n = was; nameIn.blur(); } });
  c.on(nameIn, 'blur', () => { if (!nameIn.value.trim()){ nameIn.value = S.n = KIND[k]; } });
  // Test runs the step on its own with sample data, and says how it went
  let testing = 0;
  c.on(testB, 'click', () => {
    if (testing) return; const id = ++testing; testB.classList.add('busy'); testB.innerHTML = I('refresh', 's'); swap(kd, 'Testing with sample data'); kd.classList.remove('ok');
    c.later(1400, () => { if (testing !== id) return; testing = 0; testB.classList.remove('busy'); testB.innerHTML = I('play', 's'); kd.classList.add('ok'); swap(kd, 'Worked in 1.4s, with sample data'); say(`${S.n} worked in 1.4 seconds`);
      c.later(3200, () => { if (!testing){ kd.classList.remove('ok'); swap(kd, `${KIND[k]}, step ${S.at} of 7`); } }); });
  });
  render(false);
  // the preview's story: insert a field into the instructions, fix the input that points at a step that is gone, give the
  // step a second retry, then look at a branch's rule and add a person to an approval
  c.story(async s => {
    await s.beat(3);
    await s.tap($('.sti-insert', r)); await s.beat(1.6);
    await s.tap($('.sti-dp .mi[data-ref="lookup.industry"]', r)); await s.beat(2.4);
    await s.tap($('.sti-tokb[data-f="in.email"]', r)); await s.beat(1.6);
    await s.tap($('.sti-dp .mi[data-ref="form.email"]', r)); await s.beat(2.4);
    await s.tap($('.sti-sh[data-sec="fail"]', r)); await s.beat(1.4);
    await s.tap($('.sti-num [data-d="1"]', r)); await s.beat(2.4);
    s.away(); kindTo('branch'); await s.beat(2.4);
    await s.point($('.sti-in', r), false); await s.beat(2.4);
    s.away(); kindTo('approval'); await s.beat(2);
    await s.tap($('.sti-add[data-f="who"]', r)); await s.beat(1.4);
    await s.tap($('.sti-pk .mi[data-w="JB"]', r)); await s.beat(2.4);
  });
});
