TPLS["kanban"] = "<div class=\"kbx\">\n  <div class=\"kbx-hd\"><div class=\"kbx-ti\"><b>Website refresh</b><span class=\"num\"></span></div><div class=\"kbx-fp\" role=\"group\" aria-label=\"Filter by person\"></div><span class=\"kbx-sp\"></span><label class=\"kbx-q\">{search}<input type=\"search\" placeholder=\"Search cards\" aria-label=\"Search cards\" autocomplete=\"off\"><button class=\"ib kbx-qx\" aria-label=\"Clear the search\" hidden>{x}</button></label><div class=\"seg2 kbx-vw\" role=\"group\" aria-label=\"View\"><button aria-pressed=\"true\" data-v=\"board\">{grid}<span class=\"lb\">Board</span></button><button aria-pressed=\"false\" data-v=\"list\">{list}<span class=\"lb\">List</span></button></div></div>\n  <div class=\"kbx-fl\"><button class=\"pill ghost sm kbx-clr\" hidden>Clear</button><span class=\"kbx-sp\"></span><span class=\"kbx-cnt num\"></span></div>\n  <div class=\"kbx-bd\"><div class=\"kbx-cols\"></div></div>\n  <div class=\"kbx-sr\" aria-live=\"polite\"></div>\n</div>";
TPLS["ticket-list"] = "<div class=\"tkx panel\">\n  <div class=\"tkx-h\"><b>Support</b><div class=\"seg2 tkx-sg\" role=\"group\" aria-label=\"Filter\"><button aria-pressed=\"true\" data-v=\"open\">Open</button><button aria-pressed=\"false\" data-v=\"done\">Solved</button></div></div>\n  <div class=\"tkx-list\"></div>\n</div>";
TPLS["number-field"] = "<div class=\"nmf panel\">\n  <div class=\"nmf-h\"><b>Run limits</b><span class=\"muted\">For each run of the release agent</span></div>\n  <div class=\"nmf-f\" data-k=\"steps\">\n    <span class=\"nmf-l\">Max steps</span>\n    <div class=\"nmf-in\"><button class=\"ib nmf-dn\" tabindex=\"-1\" aria-label=\"Fewer steps\">{minus}</button><span class=\"nmf-v\"><input class=\"num\" role=\"spinbutton\" inputmode=\"decimal\" autocomplete=\"off\" spellcheck=\"false\" aria-label=\"Max steps\"><span class=\"nmf-u\">steps</span></span><button class=\"ib nmf-up\" tabindex=\"-1\" aria-label=\"More steps\">{plus}</button></div>\n    <span class=\"nmf-hint muted\"></span>\n  </div>\n  <div class=\"nmf-f\" data-k=\"budget\">\n    <span class=\"nmf-l\">Budget per run</span>\n    <div class=\"nmf-in\"><button class=\"ib nmf-dn\" tabindex=\"-1\" aria-label=\"Lower budget\">{minus}</button><span class=\"nmf-v\"><span class=\"nmf-u\">$</span><input class=\"num\" role=\"spinbutton\" inputmode=\"decimal\" autocomplete=\"off\" spellcheck=\"false\" aria-label=\"Budget per run\"></span><button class=\"ib nmf-up\" tabindex=\"-1\" aria-label=\"Higher budget\">{plus}</button></div>\n    <span class=\"nmf-hint muted\"></span>\n  </div>\n  <div class=\"nmf-f\" data-k=\"time\">\n    <span class=\"nmf-l\">Time limit</span>\n    <div class=\"nmf-in\"><button class=\"ib nmf-dn\" tabindex=\"-1\" aria-label=\"Less time\">{minus}</button><span class=\"nmf-v\"><input class=\"num\" role=\"spinbutton\" inputmode=\"decimal\" autocomplete=\"off\" spellcheck=\"false\" aria-label=\"Time limit\"><span class=\"nmf-u\">min</span></span><button class=\"ib nmf-up\" tabindex=\"-1\" aria-label=\"More time\">{plus}</button></div>\n    <span class=\"nmf-hint muted\"></span>\n  </div>\n  <p class=\"nmf-sum muted\" aria-live=\"polite\"></p>\n</div>";
TPLS["filter-menu"] = "<div class=\"flm panel\">\n  <div class=\"flm-bar\">\n    <button class=\"pill line sm flm-tr\" aria-haspopup=\"menu\" aria-expanded=\"false\" data-pop-pos=\"down\">{filter}Filter</button>\n    <div class=\"flm-chips\" role=\"list\" aria-label=\"Filters\"></div>\n  </div>\n  <div class=\"pop flm-pop\">\n    <div class=\"flm-lv flm-l1\" role=\"menu\" aria-label=\"Filter by\"><div class=\"ph\" role=\"none\">Filter by</div></div>\n    <div class=\"flm-lv flm-l2\" role=\"menu\" hidden></div>\n  </div>\n  <div class=\"flm-sum\"><span class=\"flm-ct num\" aria-live=\"polite\"></span><button class=\"pill ghost sm flm-clr\" hidden>Clear all</button></div>\n  <div class=\"flm-list\"></div>\n</div>";
TPLS["context-switcher"] = "<div class=\"csw\">\n  <nav class=\"csw-bar panel\" aria-label=\"Context\">\n    <ol class=\"csw-path\">\n      <li class=\"csw-mi\"><button class=\"csw-more\" aria-haspopup=\"menu\" aria-expanded=\"false\" aria-label=\"Organisation and project\" data-tip=\"Organisation and project\">{more}</button></li>\n      <li class=\"csw-sep m\" aria-hidden=\"true\">{crumb}</li>\n      <li class=\"csw-seg\" data-k=\"org\"><button class=\"csw-tr\" aria-haspopup=\"listbox\" aria-expanded=\"false\"><span class=\"csw-lg\"></span><span class=\"csw-nm\"></span><span class=\"csw-bh\"></span>{unfold}</button></li>\n      <li class=\"csw-sep\" aria-hidden=\"true\">{crumb}</li>\n      <li class=\"csw-seg\" data-k=\"project\"><button class=\"csw-tr\" aria-haspopup=\"listbox\" aria-expanded=\"false\"><span class=\"csw-nm\"></span><span class=\"csw-bh\"></span>{unfold}</button></li>\n      <li class=\"csw-sep\" aria-hidden=\"true\">{crumb}</li>\n      <li class=\"csw-seg\" data-k=\"env\"><button class=\"csw-tr\" aria-haspopup=\"listbox\" aria-expanded=\"false\"><span class=\"csw-nm\"></span><span class=\"csw-bh\"></span>{unfold}</button></li>\n    </ol>\n  </nav>\n  <div class=\"pop csw-pop\">\n    <div class=\"csw-sf\">{search}<input class=\"csw-q\" role=\"combobox\" aria-autocomplete=\"list\" aria-expanded=\"false\" spellcheck=\"false\" autocomplete=\"off\"></div>\n    <div class=\"csw-list\" role=\"listbox\"></div>\n  </div>\n  <div class=\"pop csw-mpop\" role=\"menu\" aria-label=\"Organisation and project\"></div>\n  <p class=\"csw-live\" aria-live=\"polite\"></p>\n</div>";
TPLS["context-menu"] = "<div class=\"cxm\">\n  <div class=\"cxm-msg panel\" tabindex=\"0\" aria-haspopup=\"menu\" aria-label=\"Agent reply. Press Shift+F10 for actions\">\n    <div class=\"cxm-hd\"><span class=\"cxm-av\">{spark}</span><b>Agent</b><span class=\"muted num\">2:14 pm</span><span class=\"cxm-pin\" hidden>{pin}Pinned</span></div>\n    <p class=\"cxm-tx\">Most of the checkout drop-off is on mobile. 61% of the people who leave do it at the address step, where the keyboard covers the Continue button. Moving Continue above the keyboard should win back about 300 orders a week.</p>\n    <div class=\"cxm-out\" aria-live=\"polite\"></div>\n  </div>\n  <p class=\"cxm-note muted\" aria-live=\"polite\"></p>\n  <div class=\"pop cxm-pop\" role=\"menu\" aria-label=\"Reply actions\">\n    <button class=\"mi\" role=\"menuitem\" data-a=\"copy\">{copy}Copy text<span class=\"r\">⌘C</span></button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"quote\">{quote}Quote in reply<span class=\"r\">R</span></button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"pin\">{pin}<span class=\"t\">Pin to thread</span><span class=\"r\">P</span></button>\n    <div class=\"sep\" role=\"separator\"></div>\n    <button class=\"mi cxm-sub\" role=\"menuitem\" aria-haspopup=\"menu\" aria-expanded=\"false\" data-a=\"ask\">{spark}Ask the agent<span class=\"r\">{chev-r}</span></button>\n    <button class=\"mi\" role=\"menuitemcheckbox\" aria-checked=\"false\" data-a=\"follow\">{bell}Follow replies<span class=\"ck\">{check}</span></button>\n    <div class=\"sep\" role=\"separator\"></div>\n    <button class=\"mi cxm-del\" role=\"menuitem\" data-a=\"del\">{trash}<span class=\"t\">Delete reply</span><span class=\"r\">⌫</span></button>\n  </div>\n  <div class=\"pop cxm-pop2\" role=\"menu\" aria-label=\"Ask the agent\">\n    <button class=\"mi\" role=\"menuitem\" data-a=\"explain\">{info}Explain</button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"sum\">{list}Summarise</button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"rewrite\">{edit}Rewrite shorter</button>\n  </div>\n</div>";
TPLS["profile-menu"] = "<div class=\"pfm\">\n  <div class=\"pfm-bar panel\">\n    <span class=\"pfm-lg pfm-cur\"></span><span class=\"pfm-ws\"><b class=\"pfm-wn\"></b><span class=\"muted\">Pricing refresh</span></span>\n    <button class=\"pfm-tr\" aria-haspopup=\"menu\" aria-expanded=\"false\" aria-label=\"Account menu, Maya Kim\" data-pop-align=\"end\" data-pop-pos=\"down\"><span class=\"av\">MK</span>{chev}</button>\n    <button class=\"pill line sm pfm-in\" hidden>Sign in</button>\n  </div>\n  <div class=\"pop pfm-pop\" role=\"menu\">\n    <div class=\"pfm-me\" role=\"none\"><span class=\"av\">MK</span><span class=\"t\"><b class=\"pfm-nm\">Maya Kim</b><span class=\"muted pfm-em\">maya@northwind.studio</span></span></div>\n    <div class=\"sep\" role=\"separator\"></div>\n    <div class=\"pfm-grp\" role=\"group\"><div class=\"ph pfm-gl\" role=\"none\">Workspaces</div><div class=\"pfm-wsl\"></div></div>\n    <div class=\"sep\" role=\"separator\"></div>\n    <button class=\"mi pfm-th\" role=\"menuitemcheckbox\" aria-checked=\"false\" tabindex=\"-1\">{moon}<span>Dark theme</span><span class=\"toggle\" aria-hidden=\"true\"></span></button>\n    <button class=\"mi pfm-ky\" role=\"menuitem\" tabindex=\"-1\">{keyboard}<span>Keyboard shortcuts</span><span class=\"kbd\" aria-hidden=\"true\">?</span></button>\n    <div class=\"sep\" role=\"separator\"></div>\n    <button class=\"mi pfm-out\" role=\"menuitem\" tabindex=\"-1\">{logout}<span>Sign out</span></button>\n  </div>\n  <div class=\"fold shut pfm-kf\"><div><div class=\"pfm-keys panel\" role=\"region\" aria-label=\"Keyboard shortcuts\">\n    <div class=\"pfm-kh\"><b>Keyboard shortcuts</b><button class=\"ib pfm-kx\" aria-label=\"Close shortcuts\" data-tip=\"Close\">{x}</button></div>\n    <dl class=\"pfm-kl\"><div><dt><span class=\"kbd\">↑</span><span class=\"kbd\">↓</span></dt><dd>Move through the menu</dd></div><div><dt><span class=\"kbd\">Home</span><span class=\"kbd\">End</span></dt><dd>First or last item</dd></div><div><dt><span class=\"kbd\">Esc</span></dt><dd>Close the menu</dd></div><div><dt><span class=\"kbd\">?</span></dt><dd>Show these shortcuts</dd></div></dl>\n  </div></div></div>\n  <p class=\"pfm-note muted\" aria-live=\"polite\"></p>\n</div>";
TPLS["reactions"] = "<div class=\"rxx\">\n  <div class=\"rxx-m\"><span class=\"rxx-ic\">{spark}</span><div class=\"rxx-b\"><span class=\"rxx-n\"><b>Design agent</b><span class=\"muted\">10:42</span></span><p>Shipped the pricing update to staging. Trial to paid preview is up 8.1 points against last month.</p></div></div>\n  <div class=\"rxx-row\"><div class=\"rxx-list\"></div><button class=\"rxx-add\" data-pop=\".rxx-pk\" aria-label=\"Add reaction\" data-tip=\"Add reaction\">{smile}</button></div>\n  <div class=\"pop rxx-pk\" role=\"menu\"><div class=\"rxx-grid\"></div></div>\n</div>";
TPLS["invite"] = "<div class=\"ivx panel\">\n  <div class=\"ivx-h\"><b>Invite to Pricing refresh</b><span class=\"muted\">They can see frames, the brief and agent runs</span></div>\n  <div class=\"ivx-f\"><div class=\"ivx-chips\"></div><input placeholder=\"name@studio.com\" aria-label=\"Email addresses\" spellcheck=\"false\"><button class=\"ivx-role\" data-pop=\".ivx-rp\" data-pop-align=\"end\"><span>Can edit</span>{chev}</button></div>\n  <div class=\"pop ivx-rp\" role=\"menu\"><button class=\"mi\" role=\"menuitemradio\" data-close data-r=\"Can edit\" aria-checked=\"true\"><span>Can edit<span class=\"d\">Change frames, run the agent</span></span><span class=\"ck\">{chk}</span></button><button class=\"mi\" role=\"menuitemradio\" data-close data-r=\"Can comment\" aria-checked=\"false\"><span>Can comment<span class=\"d\">Leave notes, no edits</span></span><span class=\"ck\">{chk}</span></button><button class=\"mi\" role=\"menuitemradio\" data-close data-r=\"Can view\" aria-checked=\"false\"><span>Can view<span class=\"d\">Read only</span></span><span class=\"ck\">{chk}</span></button></div>\n  <div class=\"ivx-sg\"><span class=\"muted\">Suggested</span></div>\n  <div class=\"ivx-mem\"></div>\n  <div class=\"ivx-ft\"><button class=\"pill ghost sm ivx-link\">{link}Copy link</button><button class=\"pill primary sm ivx-go\" disabled>Send invites</button></div>\n</div>";
TPLS["notifications"] = "<div class=\"ntx panel\">\n  <div class=\"ntx-h\"><b>Inbox</b><span class=\"ntx-ct num\">0</span><span class=\"ntx-sp\"></span><button class=\"pill ghost sm ntx-all\">Mark all read</button></div>\n  <div class=\"ntx-tabs\"><div class=\"seg2\" role=\"group\" aria-label=\"Filter\"><button aria-pressed=\"true\" data-v=\"all\">All</button><button aria-pressed=\"false\" data-v=\"agent\">Agent</button><button aria-pressed=\"false\" data-v=\"men\">Mentions</button></div></div>\n  <div class=\"ntx-list\"></div>\n</div>";
TPLS["comments"] = "<div class=\"cmx panel\">\n  <div class=\"cmx-h\"><span class=\"cmx-pin\" aria-hidden=\"true\">1</span><b>Pricing, frame 2</b><span class=\"cmx-st num\"></span><button class=\"ib cmx-res\" aria-label=\"Resolve thread\" aria-pressed=\"false\" data-tip=\"Resolve thread\">{check}</button></div>\n  <div class=\"cmx-th\" aria-live=\"polite\"></div>\n  <div class=\"cmx-in\"><div class=\"cmx-box\"><input placeholder=\"Reply, or @agent to ask\" aria-label=\"Reply\" spellcheck=\"false\" autocomplete=\"off\"><button class=\"cmx-go\" aria-label=\"Send\" disabled>{up}</button></div><div class=\"pop cmx-men\" role=\"listbox\"></div></div>\n</div>";
TPLS["banner"] = "<div class=\"dm bnx-dm\"><div class=\"dm-main bnx-slot\">\n  <div class=\"bnx\" role=\"region\" data-tone=\"accent\" data-art=\"layers\" aria-label=\"Announcement\">\n    <div class=\"bnx-art\" aria-hidden=\"true\"></div>\n    <div class=\"bnx-tx\">\n      <span class=\"bnx-eb\"><span>New</span></span>\n      <p class=\"bnx-t\"><span>Memory that carries across threads</span></p>\n      <p class=\"bnx-d\"><span>Agents keep what they learn about your project, so you only explain things once.</span></p>\n      <div class=\"bnx-acts\"><button class=\"pill primary sm bnx-go\"><span>Turn on memory</span></button><button class=\"bnx-lk\"><span>What it keeps</span></button></div>\n    </div>\n  </div>\n</div>\n<div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Banner style\"><button aria-pressed=\"true\" data-v=\"0\">Accent</button><button aria-pressed=\"false\" data-v=\"1\">Violet</button><button aria-pressed=\"false\" data-v=\"2\">Green</button><button aria-pressed=\"false\" data-v=\"3\">Amber</button></div></div>\n</div>";

/* ---------- Comments ---------- */
DM.def('comments', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{check}', I('check','xs')).replace('{up}', I('up','xs'));
  const root = $('.cmx', r), th = $('.cmx-th', r), inp = $('.cmx-box input', r), go = $('.cmx-go', r), men = $('.cmx-men', r), st = $('.cmx-st', r), rs = $('.cmx-res', r);
  const P = { MK:['Maya Kim','var(--av-l)'], JO:['Jon Ortiz','var(--av-m)'], DA:['Design agent','var(--av-b)'] };
  const esc = t => t.replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[ch]);
  const fmt = t => esc(t).replace(/@(agent|maya|jon)\b/gi, m => `<span class="m">${m}</span>`);
  // the first comment starts the thread; every later one is a reply, indented on a thin line under it
  let rp = null;
  const count = () => { const n = rp ? rp.children.length : 0; st.textContent = root.classList.contains('done') ? 'Resolved' : n ? n + (n === 1 ? ' reply' : ' replies') : ''; };
  function add(who, t, when, ag, agreed = 0){
    const el = html(`<div class="cmx-c${ag ? ' ag' : ''}">${AV(who, P[who][1])}<div class="b"><div class="n"><b>${P[who][0]}</b><span class="t">${when}</span><div class="cmx-tools"><button class="ib cmx-rx" aria-label="Agree" aria-pressed="false" data-tip="Agree">${I('up-thumb','xs')}</button></div></div><div class="tx">${ag ? '' : fmt(t)}</div><div class="cmx-rs"><button class="cmx-rc" aria-pressed="false" hidden>${I('up-thumb','xs')}<span class="num"></span></button></div></div></div>`);
    el._agree = { n:agreed, mine:false }; agree(el);
    $('.cmx-rx', el).onclick = () => agree(el, true); $('.cmx-rc', el).onclick = () => agree(el, true);
    if (!th.firstElementChild) th.appendChild(el);
    else { if (!rp){ rp = html('<div class="cmx-rp" role="group" aria-label="Replies"></div>'); th.appendChild(rp); } rp.appendChild(el); }
    enter(el); count(); return el;
  }
  // Agree: the button by the time and the chip under the text both toggle yours, and the chip counts everyone's
  function agree(el, flip){
    const a = el._agree; if (flip) a.mine = !a.mine;
    const n = a.n + (a.mine ? 1 : 0), b = $('.cmx-rx', el), chip = $('.cmx-rc', el), had = document.activeElement === chip;
    b.setAttribute('aria-pressed', a.mine); chip.setAttribute('aria-pressed', a.mine);
    chip.setAttribute('aria-label', 'Agree, ' + n + (n === 1 ? ' person' : ' people') + (a.mine ? ', including you' : ''));
    $('.num', chip).textContent = n; chip.hidden = !n;
    if (had && !n) b.focus({ preventScroll:true });
  }
  add('MK', 'The secondary button feels too faint next to the CTA.', '2h', false, 1);
  add('JO', 'Agree. Can we keep it outlined though?', '1h');
  async function agent(q){
    const el = add('DA', '', 'now', true), tx = $('.tx', el); tx.innerHTML = '<span class="think on" style="color:var(--accent-mark,var(--accent))"><i></i><i></i><i></i><i></i></span>'; await c.wait(900); tx.innerHTML = '';
    const a = /outline|border/i.test(q + ' outlined') ? 'Kept it outlined and raised the text to #5B6472, which passes AA at 5.9 : 1. Want me to apply it to the other 2 frames?' : 'On it. I will post the change here when it is ready.';
    for (const w of a.split(' ')){ tx.insertAdjacentHTML('beforeend', `<span class="w">${w} </span>`); await c.wait(40); }
    const act = html(`<div class="act"><button class="pill primary sm">Apply to all</button><button class="pill line sm">Just this one</button></div>`); $('.b', el).appendChild(act); enter(act);
    $$('button', act).forEach((b, i) => b.onclick = () => { act.innerHTML = `<span class="cmx-rv">${I('ok','xs')}${i ? 'Applied to frame 2' : 'Applied to 3 frames'}</span>`; enter(act.firstChild); });
  }
  function send(){ const v = inp.value.trim(); if (!v) return; add('MK', v, 'now'); inp.value = ''; go.disabled = true; shut(); if (/@agent/i.test(v)) c.run(() => agent(v)); }
  const opts = [['DA','agent','Design agent'],['MK','maya','Maya Kim'],['JO','jon','Jon Ortiz']];
  // the reply box drives the list of people to mention: it is a combobox, and the highlighted row is its active option
  men.id = 'cmx-m-' + Math.random().toString(36).slice(2, 7); men.setAttribute('aria-label', 'Mention');
  inp.setAttribute('role', 'combobox'); inp.setAttribute('aria-autocomplete', 'list'); inp.setAttribute('aria-expanded', 'false'); inp.setAttribute('aria-controls', men.id);
  let hl = 0;
  const mens = () => $$('.mi', men);
  const light = k => { const all = mens(); if (!all.length){ inp.removeAttribute('aria-activedescendant'); return; } hl = (k + all.length) % all.length; all.forEach((b, j) => { b.classList.toggle('hl', j === hl); b.setAttribute('aria-selected', j === hl); }); inp.setAttribute('aria-activedescendant', all[hl].id); };
  const shut = () => { men.classList.remove('open'); inp.setAttribute('aria-expanded', 'false'); inp.removeAttribute('aria-activedescendant'); };
  inp.oninput = () => { go.disabled = !inp.value.trim(); const m = inp.value.match(/@(\w*)$/);
    if (m){ const list = opts.filter(o => o[1].startsWith(m[1].toLowerCase())); men.innerHTML = list.map(o => `<button class="mi" role="option" tabindex="-1" id="${men.id}-${o[1]}" data-h="${o[1]}">${AV(o[0], P[o[0]][1]).replace('class="av" style="', 'class="av" style="width:20px;height:20px;font-size:9px;')}<span>${o[2]}<span class="d">@${o[1]}</span></span></button>`).join(''); men.classList.toggle('open', list.length > 0); inp.setAttribute('aria-expanded', list.length > 0); light(0);
      $$('.mi', men).forEach(b => b.onmousedown = e => { e.preventDefault(); inp.value = inp.value.replace(/@\w*$/, '@' + b.dataset.h + ' '); shut(); go.disabled = false; inp.focus({ preventScroll:true }); }); }
    else shut(); };
  // with the mention list open, the up and down arrows move through it and wrap, Enter picks, and Escape closes it
  inp.onkeydown = e => {
    const open = men.classList.contains('open') && mens().length;
    if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')){ e.preventDefault(); light(hl + (e.key === 'ArrowDown' ? 1 : -1)); return; }
    if (e.key === 'Enter'){ const f = mens()[hl]; if (open && f){ f.onmousedown(e); } else send(); }
    if (e.key === 'Escape') shut(); };
  go.onclick = send;
  // Resolve fades the thread back and turns the pin green; pressed again it reopens
  rs.onclick = () => { const d = root.classList.toggle('done'); hideTip(); rs.innerHTML = I(d ? 'undo' : 'check', 'xs'); rs.setAttribute('aria-pressed', d); rs.dataset.tip = d ? 'Reopen thread' : 'Resolve thread'; count(); };
  // the preview asks the agent in the thread on its own; clicking, focusing or typing in it takes over, and what it had
  // typed goes
  c.auto(1000, () => c.run(async () => { await c.type(inp, '@agent can you keep it outlined but darker?', { ms:28, each:() => inp.oninput(), keep:true }); shut(); await c.step(300); send(); }));
});
/* ---------- Notifications ---------- */
DM.def('notifications', (r, c) => {
  let N = [
    { k:'agent', ic:'ok', col:'var(--ok)', t:'<b>Pricing audit</b> finished. 2 fixes ready to review', w:'4 min ago' },
    { k:'men', av:['MK','var(--av-l)'], t:'<b>Maya</b> mentioned you in Checkout flow', w:'20 min ago' },
    { k:'agent', ic:'alert', col:'var(--warn)', t:'<b>Token export</b> paused at the $5 cap', w:'1 hour ago' },
    { k:'men', av:['JO','var(--av-m)'], t:'<b>Jon</b> asked for your review on PR #284', w:'2 hours ago', read:true }
  ];
  const list = $('.ntx-list', r), ct = $('.ntx-ct', r); let f = 'all';
  const count = (bump) => { const n = N.filter(x => !x.read).length; ct.textContent = n; ct.classList.toggle('z', !n); if (bump){ ct.classList.remove('bump'); void ct.offsetWidth; ct.classList.add('bump'); } };
  const row = x => `<button class="ntx-n${x.read ? ' read' : ''}"><span class="ic" ${x.ic ? `style="color:${x.fg || x.col};background:color-mix(in srgb,${x.col} 13%,transparent)"` : ''}>${x.ic ? I(x.ic,'xs') : AV(x.av[0], x.av[1])}</span><span class="t">${x.t}<span>${x.w}</span></span><span class="u"></span></button>`;
  function paint(anim){ const L = N.filter(x => f === 'all' || x.k === f); list.innerHTML = L.length ? L.map(row).join('') : '<div class="ntx-e">Nothing here yet</div>';
    $$('.ntx-n', list).forEach((b, i) => b.onclick = () => { L[i].read = !L[i].read; b.classList.toggle('read', L[i].read); count(); });
    if (anim) stagger($$('.ntx-n', list), 40); count(); }
  seg($('.ntx-tabs .seg2', r), v => { f = v; paint(true); });
  $('.ntx-all', r).onclick = () => { N.forEach(x => x.read = true); $$('.ntx-n', list).forEach((b, i) => c.later(i * 50, () => b.classList.add('read'))); count(); };
  paint(true);
  const incoming = [{ k:'agent', ic:'spark', col:'var(--accent-mark,var(--accent))', fg:'var(--accent-fg,var(--accent))', t:'<b>Weekly design QA</b> started on 12 frames', w:'Just now' }, { k:'men', av:['AR','var(--av-p)'], t:'<b>Ari</b> replied: “Looks great, ship it”', w:'Just now' }];
  // two items arrive while you watch; once you click or type in the inbox the preview leaves it to you, so a tab you
  // picked or a Mark all read stays as you left it
  incoming.forEach((x, i) => c.later(2200 + i * 2600, () => { if (c.mine) return; N.unshift(x); if (f === 'all' || f === x.k){ const el = html(row(x)); el.classList.add('new'); list.prepend(el); $('.ntx-e', list)?.remove(); el.onclick = () => { x.read = !x.read; el.classList.toggle('read', x.read); count(); }; } count(true); }));
});
/* ---------- Banner ---------- */
/* the four drawings, each 240 by 160 and written as plain paths, all in one isometric view on a floor grid, with their
   drawn box centred in it: layers (three plates of a stack, pulled apart, the bottom one standing on the floor), steps (a staircase climbing to a flag, on a floor
   that follows its footprint), tools (five tool tiles, Slack, GitHub, Linear, Gmail and Apollo, each with its mark on top)
   and path (a dotted route across the floor to a raised tile). .ln lines draw themselves in, in the order --d gives; .gd
   are the construction lines and the floor, dashed, which fade in; .pl are faces in the banner's fill that hide what is
   behind them; .lg are the tools' marks and .dt the dotted route; each .z group moves by its depth --z under the pointer. */
const BNX_ART = {
  layers:"<g class=\"gds\"><path class=\"gd\" d=\"M120 51L36.9 99M140.8 63L57.6 111M161.6 75L78.4 123M182.4 87L99.2 135M203.1 99L120 147M120 51L203.1 99M99.2 63L182.4 111M78.4 75L161.6 123M57.6 87L140.8 135M36.9 99L120 147\"/></g><g class=\"gds\"><path class=\"gd\" d=\"M78.4 43L78.4 93M161.6 43L161.6 93M120 67L120 117\"/></g><g class=\"z\" style=\"--z:0\"><path class=\"pl\" d=\"M120 69L161.6 93L161.6 99L120 123L78.4 99L78.4 93Z\"/><path class=\"ln\" style=\"--d:0\" pathLength=\"1\" d=\"M120 69L161.6 93L120 117L78.4 93Z\"/><path class=\"ln\" style=\"--d:1\" pathLength=\"1\" d=\"M161.6 93L161.6 99L120 123L78.4 99L78.4 93\"/><path class=\"ln\" style=\"--d:2\" pathLength=\"1\" d=\"M120 117L120 123\"/></g><g class=\"z\" style=\"--z:1\"><path class=\"pl\" d=\"M120 41L161.6 65L161.6 71L120 95L78.4 71L78.4 65Z\"/><path class=\"ln\" style=\"--d:3\" pathLength=\"1\" d=\"M120 41L161.6 65L120 89L78.4 65Z\"/><path class=\"ln\" style=\"--d:4\" pathLength=\"1\" d=\"M161.6 65L161.6 71L120 95L78.4 71L78.4 65\"/><path class=\"ln\" style=\"--d:5\" pathLength=\"1\" d=\"M120 89L120 95\"/></g><g class=\"z\" style=\"--z:2\"><path class=\"pl\" d=\"M120 13L161.6 37L161.6 43L120 67L78.4 43L78.4 37Z\"/><path class=\"ln\" style=\"--d:6\" pathLength=\"1\" d=\"M120 13L161.6 37L120 61L78.4 37Z\"/><path class=\"ln\" style=\"--d:7\" pathLength=\"1\" d=\"M161.6 37L161.6 43L120 67L78.4 43L78.4 37\"/><path class=\"ln\" style=\"--d:8\" pathLength=\"1\" d=\"M120 61L120 67\"/><path class=\"ln ac\" style=\"--d:9\" pathLength=\"1\" d=\"M120 23.8L142.9 37L120 50.2L97.1 37Z\"/></g>",
  steps:"<g class=\"gds\"><path class=\"gd\" d=\"M135.6 59L42.1 113M151.2 68L57.6 122M166.8 77L73.2 131M182.4 86L88.8 140M197.9 95L104.4 149M135.6 59L197.9 95M120 68L182.4 104M104.4 77L166.8 113M88.8 86L151.2 122M73.2 95L135.6 131M57.6 104L120 140M42.1 113L104.4 149\"/></g><g class=\"z\" style=\"--z:0\"><path class=\"pl\" d=\"M135.6 21L166.8 39L166.8 95L151.2 104L120 86L120 30Z\"/><path class=\"ln\" style=\"--d:0\" pathLength=\"1\" d=\"M135.6 21L166.8 39L151.2 48L120 30Z\"/><path class=\"ln\" style=\"--d:1\" pathLength=\"1\" d=\"M166.8 39L166.8 95L151.2 104L120 86L120 30\"/><path class=\"ln\" style=\"--d:2\" pathLength=\"1\" d=\"M151.2 48L151.2 104\"/><path class=\"pl\" d=\"M120 44L151.2 62L151.2 104L135.6 113L104.4 95L104.4 53Z\"/><path class=\"ln\" style=\"--d:3\" pathLength=\"1\" d=\"M120 44L151.2 62L135.6 71L104.4 53Z\"/><path class=\"ln\" style=\"--d:4\" pathLength=\"1\" d=\"M151.2 62L151.2 104L135.6 113L104.4 95L104.4 53\"/><path class=\"ln\" style=\"--d:5\" pathLength=\"1\" d=\"M135.6 71L135.6 113\"/><path class=\"pl\" d=\"M104.4 67L135.6 85L135.6 113L120 122L88.8 104L88.8 76Z\"/><path class=\"ln\" style=\"--d:6\" pathLength=\"1\" d=\"M104.4 67L135.6 85L120 94L88.8 76Z\"/><path class=\"ln\" style=\"--d:7\" pathLength=\"1\" d=\"M135.6 85L135.6 113L120 122L88.8 104L88.8 76\"/><path class=\"ln\" style=\"--d:8\" pathLength=\"1\" d=\"M120 94L120 122\"/><path class=\"pl\" d=\"M88.8 90L120 108L120 122L104.4 131L73.2 113L73.2 99Z\"/><path class=\"ln\" style=\"--d:9\" pathLength=\"1\" d=\"M88.8 90L120 108L104.4 117L73.2 99Z\"/><path class=\"ln\" style=\"--d:10\" pathLength=\"1\" d=\"M120 108L120 122L104.4 131L73.2 113L73.2 99\"/><path class=\"ln\" style=\"--d:11\" pathLength=\"1\" d=\"M104.4 117L104.4 131\"/></g><g class=\"z\" style=\"--z:2\"><path class=\"ln ac\" style=\"--d:12\" pathLength=\"1\" d=\"M137.1 30.9V8.9h14l-4 5 4 5h-14\"/></g>",
  tools:"<g class=\"gds\"><path class=\"gd\" d=\"M120 30.5L26.5 84.5M151.2 48.5L57.6 102.5M182.4 66.5L88.8 120.5M213.5 84.5L120 138.5M120 30.5L213.5 84.5M88.8 48.5L182.4 102.5M57.6 66.5L151.2 120.5M26.5 84.5L120 138.5\"/></g><g class=\"z\" style=\"--z:1\"><path class=\"pl\" d=\"M120 21.5L142.5 34.5L142.5 48.5L120 61.5L97.5 48.5L97.5 34.5Z\"/><path class=\"ln\" style=\"--d:0\" pathLength=\"1\" d=\"M120 21.5L142.5 34.5L120 47.5L97.5 34.5Z\"/><path class=\"ln\" style=\"--d:1\" pathLength=\"1\" d=\"M142.5 34.5L142.5 48.5L120 61.5L97.5 48.5L97.5 34.5\"/><path class=\"ln\" style=\"--d:2\" pathLength=\"1\" d=\"M120 47.5L120 61.5\"/><g class=\"lg\" transform=\"matrix(0.613 -0.354 0.613 0.354 105.278 34.5)\"><path d=\"M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z\"/></g><path class=\"pl\" d=\"M57.6 57.5L80.2 70.5L80.2 84.5L57.6 97.5L35.1 84.5L35.1 70.5Z\"/><path class=\"ln\" style=\"--d:3\" pathLength=\"1\" d=\"M57.6 57.5L80.2 70.5L57.6 83.5L35.1 70.5Z\"/><path class=\"ln\" style=\"--d:4\" pathLength=\"1\" d=\"M80.2 70.5L80.2 84.5L57.6 97.5L35.1 84.5L35.1 70.5\"/><path class=\"ln\" style=\"--d:5\" pathLength=\"1\" d=\"M57.6 83.5L57.6 97.5\"/><g class=\"lg\" transform=\"matrix(0.613 -0.354 0.613 0.354 42.924 70.5)\"><path d=\"M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z\"/></g><path class=\"pl\" d=\"M120 57.5L142.5 70.5L142.5 84.5L120 97.5L97.5 84.5L97.5 70.5Z\"/><path class=\"ln\" style=\"--d:6\" pathLength=\"1\" d=\"M120 57.5L142.5 70.5L120 83.5L97.5 70.5Z\"/><path class=\"ln\" style=\"--d:7\" pathLength=\"1\" d=\"M142.5 70.5L142.5 84.5L120 97.5L97.5 84.5L97.5 70.5\"/><path class=\"ln\" style=\"--d:8\" pathLength=\"1\" d=\"M120 83.5L120 97.5\"/><g class=\"lg\" transform=\"matrix(0.613 -0.354 0.613 0.354 105.278 70.5)\"><path d=\"M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z\"/></g><path class=\"pl\" d=\"M182.4 57.5L204.9 70.5L204.9 84.5L182.4 97.5L159.8 84.5L159.8 70.5Z\"/><path class=\"ln\" style=\"--d:9\" pathLength=\"1\" d=\"M182.4 57.5L204.9 70.5L182.4 83.5L159.8 70.5Z\"/><path class=\"ln\" style=\"--d:10\" pathLength=\"1\" d=\"M204.9 70.5L204.9 84.5L182.4 97.5L159.8 84.5L159.8 70.5\"/><path class=\"ln\" style=\"--d:11\" pathLength=\"1\" d=\"M182.4 83.5L182.4 97.5\"/><g class=\"lg\" transform=\"matrix(0.613 -0.354 0.613 0.354 167.631 70.5)\"><path d=\"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12\"/></g><path class=\"pl\" d=\"M120 93.5L142.5 106.5L142.5 120.5L120 133.5L97.5 120.5L97.5 106.5Z\"/><path class=\"ln\" style=\"--d:12\" pathLength=\"1\" d=\"M120 93.5L142.5 106.5L120 119.5L97.5 106.5Z\"/><path class=\"ln\" style=\"--d:13\" pathLength=\"1\" d=\"M142.5 106.5L142.5 120.5L120 133.5L97.5 120.5L97.5 106.5\"/><path class=\"ln\" style=\"--d:14\" pathLength=\"1\" d=\"M120 119.5L120 133.5\"/><g class=\"lg\" transform=\"matrix(0.613 -0.354 0.613 0.354 105.278 106.5)\"><g transform=\"scale(.663)\"><path d=\"M19.5993 0.0862365L19.605 13.2568C19.6058 15.3375 17.4222 16.6715 15.6079 15.6986L2.58376 8.7153C3.57706 7.05795 4.82616 5.57609 6.27427 4.32386L16.489 13.8945C17.0303 14.4015 17.8835 13.8518 17.6605 13.1398L13.6992 0.493553C15.0326 0.17147 16.4233 0 17.8536 0C18.4428 0 19.0248 0.0296814 19.5993 0.0862365Z\"/><path d=\"M16.0635 36.1087L16.0578 23.0046C16.057 20.9239 18.2407 19.5898 20.0549 20.5627L33.0838 27.5486C32.0838 29.2016 30.8289 30.6786 29.3751 31.925L19.1738 22.3668C18.6326 21.8598 17.7793 22.4095 18.0023 23.1215L21.9486 35.72C20.6338 36.0329 19.263 36.1989 17.8539 36.1989C17.2497 36.1989 16.6523 36.1683 16.0635 36.1087Z\"/><path d=\"M22.0105 16.77L31.4705 6.39392C30.2362 4.92008 28.7742 3.6486 27.1384 2.63702L20.2306 15.8767C19.2709 17.716 20.5871 19.9298 22.6396 19.9288L35.6183 19.923C35.6775 19.3234 35.7082 18.7151 35.7082 18.0996C35.7082 16.6683 35.5436 15.2761 35.2338 13.9406L22.7549 17.9576C22.0526 18.1837 21.5103 17.3187 22.0105 16.77Z\"/><path d=\"M0.0842758 16.3383L13.0237 16.3325C15.0764 16.3317 16.3923 18.5454 15.4327 20.3846L8.56047 33.5561C6.93095 32.547 5.47394 31.2801 4.24344 29.8121L13.653 19.4914C14.1531 18.9427 13.6107 18.0777 12.9084 18.3037L0.485078 22.3029C0.168551 20.954 0 19.5467 0 18.0994C0 17.5051 0.0290814 16.9177 0.0842758 16.3383Z\"/></g></g></g>",
  path:"<g class=\"gds\"><path class=\"gd\" d=\"M120 26L26.5 80M143.4 39.5L49.9 93.5M166.8 53L73.2 107M190.1 66.5L96.6 120.5M213.5 80L120 134M120 26L213.5 80M96.6 39.5L190.1 93.5M73.2 53L166.8 107M49.9 66.5L143.4 120.5M26.5 80L120 134\"/></g><g class=\"z\" style=\"--z:0\"><path class=\"dt\" d=\"M49.9 80L73.2 93.5L120 66.5L166.8 93.5L190.1 80\"/><path class=\"ln\" style=\"--d:0\" pathLength=\"1\" d=\"M49.9 74L60.2 80L49.9 86L39.5 80Z\"/></g><g class=\"z\" style=\"--z:2\"><path class=\"pl\" d=\"M190.1 51L205.7 60L205.7 80L190.1 89L174.6 80L174.6 60Z\"/><path class=\"ln ac\" style=\"--d:1\" pathLength=\"1\" d=\"M190.1 51L205.7 60L190.1 69L174.6 60Z\"/><path class=\"ln\" style=\"--d:2\" pathLength=\"1\" d=\"M205.7 60L205.7 80L190.1 89L174.6 80L174.6 60\"/><path class=\"ln\" style=\"--d:3\" pathLength=\"1\" d=\"M190.1 69L190.1 89\"/></g>"
};
DM.def('banner', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{x}', I('x'));
  const root = $('.bnx', r), art = $('.bnx-art', root), xB = $('.bnx-x', root);
  const T = { eb:$('.bnx-eb>span', root), t:$('.bnx-t>span', root), d:$('.bnx-d>span', root), a:$('.bnx-go>span', root), s:$('.bnx-lk>span', root) };
  // the drawing named by data-art; drawing it again plays its entrance again
  const draw = () => { const k = root.dataset.art; art.innerHTML = BNX_ART[k] ? `<svg class="bnx-svg" viewBox="0 0 240 160" width="240" height="160" focusable="false">${BNX_ART[k]}</svg>` : ''; };
  draw();
  // an optional close button (.bnx-x inside the banner; the card here leaves it out): it first sends a cancelable
  // banner-dismiss event from the banner, so your code can keep it, or remember it was closed, then the banner plays out
  // and is hidden. Where the focus goes next is up to your page
  if (xB) xB.onclick = () => {
    if (root.hidden || root.classList.contains('leave')) return;
    if (!root.dispatchEvent(new CustomEvent('banner-dismiss', { bubbles:true, cancelable:true }))) return;
    root.classList.add('leave'); c.later(REDUCE ? 0 : 320, () => { root.classList.remove('leave'); root.hidden = true; });
  };

  // the preview's four styles, one per tone and drawing: the tone, the drawing and the words change in place
  const P = [
    { tone:'accent', art:'layers', eb:'New', t:'Memory that carries across threads', d:'Agents keep what they learn about your project, so you only explain things once.', a:'Turn on memory', s:'What it keeps' },
    { tone:'violet', art:'tools', eb:'Beta', t:'Connect your tools in one place', d:'Linear, GitHub and Slack in one list, with access you can scope for each agent.', a:'Connect a tool', s:'Read the docs' },
    { tone:'green', art:'steps', eb:'Guide', t:'Set up your first automation', d:'Five short steps, about ten minutes. The agent can do most of them for you.', a:'Start the guide', s:'Maybe later' },
    { tone:'amber', art:'path', eb:'Heads-up', t:'Maintenance on Sunday, 02:00 UTC', d:'Agents pause for about an hour, and queued runs pick up where they left off.', a:'Add to calendar', s:'Status page' }
  ];
  const show = p => { root.dataset.tone = p.tone; root.dataset.art = p.art; for (const k in T) if (T[k]) swap(T[k], p[k]); draw(); };
  const sg = $('.demo .seg2', r);
  if (!sg) return;
  // the banner keeps one height, the tallest of the four at this width, so flipping styles never moves the switcher under it
  // or the banner's edges. It is measured again when the width changes
  const fit = () => {
    if (!root.isConnected || !root.offsetWidth) return;
    const was = {}; for (const k in T) if (T[k]) was[k] = T[k].textContent;
    root.style.minHeight = ''; let h = 0;
    P.forEach(p => { for (const k in T) if (T[k]) T[k].textContent = p[k]; h = Math.max(h, root.offsetHeight); });
    for (const k in T) if (T[k]) T[k].textContent = was[k];
    root.style.minHeight = Math.ceil(h) + 'px';
  };
  let wide = 0;
  const ro = new ResizeObserver(() => { const w = root.offsetWidth; if (w !== wide){ wide = w; fit(); } }); ro.observe(root); c.offs.push(() => ro.disconnect());
  if (document.fonts) document.fonts.ready.then(() => { if (!c.dead) fit(); });
  // the switcher under it (the card's tabs on designme.dev's homepage): picking a style is the person taking over, so the
  // demo stops there
  let at = 0;
  const knob = seg(sg, v => { c.mine = true; if (+v !== at){ at = +v; show(P[at]); } });
  const pick = i => { at = i; $$('button', sg).forEach((b, j) => b.setAttribute('aria-pressed', j === i)); knob.place(); show(P[i]); };
  // the demo flips through the four styles twice, a few seconds each, and rests on the first. A mouse resting on it holds
  // it where it is; a click, a key or the focus of yours stops it for good. With reduced motion it doesn't play
  if (r === c.st && c.card && !REDUCE) c.run(async () => {
    for (let k = 1; k <= P.length * 2; k++){ await c.step(4000); pick(k % P.length); }
  });
});
/* ---------- Invite ---------- */
DM.def('invite', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs')).replace(/\{chk\}/g, I('check','xs')).replace('{link}', I('link','xs'));
  const chips = $('.ivx-chips', r), inp = $('.ivx-f input', r), go = $('.ivx-go', r), mem = $('.ivx-mem', r), sg = $('.ivx-sg', r);
  let E = [], role = 'Can edit', shown = new Set();
  const COL = ['var(--av-l)','var(--av-m)','var(--av-t)','var(--av-p)','var(--av-k)'];
  const ok = e => /^\S+@\S+\.\S+$/.test(e);
  const ini = e => e.split('@')[0].slice(0, 2).toUpperCase();
  function paint(){ const seen = shown; shown = new Set(E); chips.innerHTML = E.map((e, i) => `<span class="ivx-ch${ok(e) ? '' : ' bad'}${seen.has(e) ? ' seen' : ''}" ${ok(e) ? '' : 'data-tip="Not a valid email"'}>${ok(e) ? AV(ini(e), COL[i % 5]) : I('alert','xs')}${e}<button aria-label="Remove ${e}">${I('x','xs')}</button></span>`).join('');
    $$('.ivx-ch button', chips).forEach((b, i) => b.onclick = () => { E.splice(i, 1); paint(); });
    const n = E.filter(ok).length; go.disabled = !n || E.some(e => !ok(e)); go.textContent = n > 1 ? `Send ${n} invites` : 'Send invite'; }
  function commit(){ const parts = inp.value.split(/[,\s]+/).map(s => s.trim()).filter(Boolean); if (!parts.length) return; parts.forEach(p => { if (!E.includes(p)) E.push(p); }); inp.value = ''; paint(); }
  inp.onkeydown = e => { if (e.key === 'Enter' || e.key === ',' || e.key === 'Tab'){ if (inp.value.trim()){ e.preventDefault(); commit(); } } else if (e.key === 'Backspace' && !inp.value && E.length){ E.pop(); paint(); } };
  inp.onpaste = () => setTimeout(commit, 0); inp.onblur = commit;
  [['ari@studio.com','AR','var(--av-p)'],['sam@studio.com','SL','var(--av-t)']].forEach(s => { const b = html(`<button class="chip sm">${AV(s[1], s[2])}${s[0].split('@')[0]}</button>`); sg.appendChild(b); b.onclick = () => { if (!E.includes(s[0])){ E.push(s[0]); paint(); } b.remove(); }; });
  $$('.ivx-rp .mi', r).forEach(m => m.addEventListener('click', () => { role = m.dataset.r; $$('.ivx-rp .mi', r).forEach(x => x.setAttribute('aria-checked', x === m)); swap($('.ivx-role span', r), role); }));
  const M = [['MK','var(--av-l)','Maya Kim','Owner'],['JO','var(--av-m)','Jon Ortiz','Can edit']];
  mem.innerHTML = M.map(m => `<div class="ivx-m">${AV(m[0], m[1])}<span class="t">${m[2]}</span><span class="r">${m[3]}</span></div>`).join('');
  go.onclick = () => c.run(async () => { go.innerHTML = '<span class="spin"></span>'; await c.wait(800); E.filter(ok).forEach((e, i) => { const el = html(`<div class="ivx-m">${AV(ini(e), COL[i % 5])}<span class="t">${e.split('@')[0]}<span>${e}</span></span><span class="r pend">Invited, ${role.toLowerCase()}</span></div>`); mem.appendChild(el); enter(el, i * 70); }); E = []; paint(); });
  const lk = $('.ivx-link', r); lk.onclick = () => { copied(lk, 'https://designme.dev/join/pricing-refresh'); const t = lk.lastChild; t.textContent = 'Link copied'; clearTimeout(lk._lt); lk._lt = setTimeout(() => { t.textContent = 'Copy link'; }, 1600); };
  paint();
  // the preview adds two people on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  c.auto(900, () => c.run(async () => { await c.type(inp, 'dana@studio.com', { keep:true }); await c.step(40); commit(); await c.type(inp, ' lee@studio', { keep:true }); commit(); }));
});
/* ---------- Reactions ---------- */
DM.def('reactions', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark','xs')).replace('{smile}', I('smile','xs'));
  const R = [['🚀',4,['Maya','Jon','Ari','Sam'],0],['👀',2,['Jon','Dana'],0],['✅',1,['Maya'],0]];
  const list = $('.rxx-list', r);
  const tipOf = b => { const x = b._x, who = x[3] ? ['You', ...x[2]] : x[2]; b.dataset.tip = who.slice(0, 3).join(', ') + (who.length > 3 ? ' and ' + (who.length - 3) + ' more' : ''); if (tipFor === b) showTip(b); };
  function make(x){ const b = html(`<button class="rxx-r${x[3] ? ' me' : ''}" aria-pressed="${!!x[3]}"><span class="e">${x[0]}</span><span class="n num"><i>${x[1]}</i></span></button>`); b._x = x; tipOf(b); b.onclick = () => toggle(b); return b; }
  /* the count rolls up or down instead of the whole row re-rendering under the pointer */
  function roll(b, up){ const n = $('.n', b), old = $('i:last-child', n), nu = html(`<i class="${up ? 'iu' : 'id'}">${b._x[1]}</i>`); old.className = up ? 'ou' : 'od'; n.appendChild(nu); setTimeout(() => old.remove(), 380); }
  function bump(b){ b.classList.remove('bump'); void b.offsetWidth; b.classList.add('bump'); }
  function toggle(b){ const x = b._x; x[3] = x[3] ? 0 : 1; x[1] += x[3] ? 1 : -1; b.classList.toggle('me', !!x[3]); b.setAttribute('aria-pressed', !!x[3]);
    if (x[1] <= 0){ R.splice(R.indexOf(x), 1); b.classList.add('gone'); hideTip(); setTimeout(() => b.remove(), 320); return; }
    roll(b, !!x[3]); tipOf(b); if (x[3]) bump(b); }
  R.forEach(x => list.appendChild(make(x)));
  $('.rxx-grid', r).innerHTML = ['👍','❤️','🎉','🚀','👀','✅','🔥','💯','🙌','🤔','✨','👏'].map(e => `<button data-close>${e}</button>`).join('');
  $$('.rxx-grid button', r).forEach(b => b.addEventListener('click', () => { const e = b.textContent, x = R.find(y => y[0] === e);
    if (x){ const el = $$('.rxx-r', list).find(y => y._x === x); if (!x[3]) toggle(el); else bump(el); }
    else { const nx = [e, 1, [], 1]; R.push(nx); const el = make(nx); el.classList.add('new'); list.appendChild(el); bump(el); } }));
  // the preview adds one reaction on its own, unless you take over first
  c.auto(1100, () => toggle($('.rxx-r', list)));
});
/* ---------- Profile menu ---------- */
DM.def('profile-menu', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs')).replace('{moon}', I('moon')).replace('{keyboard}', I('keyboard')).replace('{logout}', I('logout')).replace('{x}', I('x','xs'));
  // the workspaces this account belongs to: initial, name, plan and the tint of its tile
  const WS = [['N', 'Northwind', 'Pro, 12 members', 'pb'], ['A', 'Acme Labs', 'Free, 3 members', 'pp'], ['P', 'Personal', 'Just you', 'pl']];
  const uid = Math.random().toString(36).slice(2, 7);
  const tr = $('.pfm-tr', r), pop = $('.pfm-pop', r), wsl = $('.pfm-wsl', r), th = $('.pfm-th', r), note = $('.pfm-note', r), kf = $('.pfm-kf', r), sin = $('.pfm-in', r), cur = $('.pfm-cur', r), wn = $('.pfm-wn', r);
  // the menu is named by the account it belongs to, and the workspaces by their heading
  $('.pfm-nm', r).id = 'pfm-nm-' + uid; $('.pfm-em', r).id = 'pfm-em-' + uid; $('.pfm-gl', r).id = 'pfm-gl-' + uid;
  pop.setAttribute('aria-labelledby', `pfm-nm-${uid} pfm-em-${uid}`); $('.pfm-grp', r).setAttribute('aria-labelledby', 'pfm-gl-' + uid);
  wsl.innerHTML = WS.map((w, i) => `<button class="mi" role="menuitemradio" aria-checked="${!i}" tabindex="-1" data-i="${i}"><span class="pfm-lg" data-t="${w[3]}">${w[0]}</span><span>${w[1]}<span class="d">${w[2]}</span></span><span class="ck">${I('check','xs')}</span></button>`).join('');
  const rows = $$('.mi', wsl), items = () => $$('.mi', pop);
  // the theme switch starts from the page's own theme
  const root = document.documentElement;
  let ws = 0, dark = root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  const say = t => { note.innerHTML = t ? `${I('ok','xs')}<span>${t}</span>` : ''; if (t) enter(note); };
  function paint(){
    const w = WS[ws]; cur.textContent = w[0]; cur.dataset.t = w[3];
    rows.forEach((m, i) => m.setAttribute('aria-checked', i === ws)); th.setAttribute('aria-checked', dark);
  }
  // the workspace name in the bar crossfades to the new one. Each switch replaces the one before it, so switching again
  // before the fade has finished (or straight back) still ends on the workspace you picked, never on an empty line
  let named = WS[0][1], nameT = 0;
  const setName = t => {
    clearTimeout(nameT); wn.classList.add('sw');
    if (t === named){ wn.textContent = t; wn.classList.remove('out'); return; }
    wn.classList.add('out');
    nameT = setTimeout(() => { named = t; wn.textContent = t; wn.classList.remove('out'); }, REDUCE ? 0 : 170);
  };
  c.offs.push(() => clearTimeout(nameT));
  wn.textContent = named; paint();
  // the menu opens and closes on its own rather than through the page's shared popover, so a story playing in the card
  // beside it can't close it. Closing it while the focus is inside gives the focus back to the avatar
  const isOpen = () => pop.classList.contains('open');
  // the focus is the one highlight: a row the demo's pointer left lit goes dark
  const focusItem = m => { if (!m) return; items().forEach(x => { x.tabIndex = x === m ? 0 : -1; x.classList.remove('hl'); }); m.focus({ preventScroll:true }); };
  function show(on, focus){
    if (on && !isOpen()){ hideTip(); placePop(tr, pop); }
    pop.classList.toggle('open', on); pop.inert = !on; tr.setAttribute('aria-expanded', on);
    if (on && focus){ const all = items(); focusItem(focus === 'last' ? all[all.length - 1] : all[0]); }
    if (!on){ items().forEach(x => x.classList.remove('hl')); if (pop.contains(document.activeElement)) tr.focus({ preventScroll:true }); }
  }
  show(false);
  // the menu opens over whatever sits under the bar, so the component keeps room for it below the bar: centred in a
  // stage, the open menu still ends inside it
  const room = () => { const el = $('.pfm', r); el.style.minHeight = Math.ceil($('.pfm-bar', r).offsetHeight + 6 + pop.offsetHeight) + 'px'; };
  room(); if (document.fonts) document.fonts.ready.then(() => { if (!c.dead) room(); });
  c.on(window, 'resize', room);
  // the avatar opens it with a click, Enter, Space or the down arrow, and the focus goes to the first item; the up arrow
  // opens it on the last. A story's tap opens it without moving the focus
  c.on(tr, 'click', e => show(!isOpen(), e.isTrusted && 'first'));
  c.on(tr, 'keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); show(true, e.key === 'ArrowUp' ? 'last' : 'first'); } });
  c.on(document, 'pointerdown', e => { if (isOpen() && !pop.contains(e.target) && !tr.contains(e.target)) show(false); });
  c.on(window, 'resize', e => { if (e.isTrusted) show(false); });
  // inside the menu: the arrow keys move and wrap, Home and End jump to the ends, Escape closes it, Tab leaves it
  c.on(pop, 'keydown', e => {
    const all = items(), i = all.indexOf(document.activeElement);
    const go = { ArrowDown:all[(i + 1) % all.length], ArrowUp:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); focusItem(go); }
    else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); show(false); }
    else if (e.key === 'Tab') setTimeout(() => show(false));
  });
  rows.forEach((m, i) => m.addEventListener('click', () => {
    show(false); if (i === ws) return;
    ws = i; paint(); setName(WS[ws][1]); say(`Switched to ${WS[ws][1]}`);
  }));
  // the theme is a switch: the menu stays open so the change shows where it was made
  // a real click switches the page too, through its own theme button where there is one; the preview's story only flips the
  // switch, so the page doesn't flash between themes while the demo loops
  const pageDark = () => root.dataset.theme ? root.dataset.theme === 'dark' : matchMedia('(prefers-color-scheme: dark)').matches;
  th.addEventListener('click', e => {
    dark = !dark; paint(); say(`Theme set to ${dark ? 'dark' : 'light'}`);
    if (!e.isTrusted || pageDark() === dark) return;
    const btn = document.getElementById('theme-btn');
    if (btn) btn.click(); else { root.dataset.theme = dark ? 'dark' : 'light'; try { localStorage.setItem('dmui-theme', root.dataset.theme); } catch(err){} }
  });
  // and when the page's theme changes from anywhere else, the switch follows it
  const mo = new MutationObserver(() => { if (pageDark() !== dark){ dark = pageDark(); paint(); } });
  mo.observe(root, { attributes:true, attributeFilter:['data-theme'] }); c.offs.push(() => mo.disconnect());
  // Keyboard shortcuts, or ? anywhere in the component, opens the list of the keys the menu answers to
  const keys = on => { kf.classList.toggle('shut', !on); kf.inert = !on; };
  keys(false);
  $('.pfm-ky', r).addEventListener('click', () => { const had = pop.contains(document.activeElement); show(false); keys(true); if (had) $('.pfm-kx', r).focus({ preventScroll:true }); });
  $('.pfm-kx', r).onclick = () => { keys(false); tr.focus({ preventScroll:true }); };
  c.on(r, 'keydown', e => { if (e.key === '?' && !e.target.matches('input,textarea')){ e.preventDefault(); show(false); keys(kf.classList.contains('shut')); } });
  // signing out swaps the avatar for Sign in, which brings it back
  $('.pfm-out', r).addEventListener('click', () => { const had = pop.contains(document.activeElement); show(false); tr.hidden = true; sin.hidden = false; if (had) sin.focus({ preventScroll:true }); say(`Signed out of ${WS[ws][1]}`); });
  sin.onclick = () => { sin.hidden = true; tr.hidden = false; tr.focus({ preventScroll:true }); say('Signed in as Maya Kim'); };
  // the preview's story: open the menu, look over the workspaces, switch to Acme Labs, then open it again and flip the theme
  c.story(async s => {
    const hl = el => items().forEach(x => x.classList.toggle('hl', x === el));
    await s.beat(3); await s.tap(tr); await s.beat(2);
    hl(rows[2]); await s.point(rows[2]); await s.beat(2);
    hl(rows[1]); await s.point(rows[1]); await s.beat(2);
    await s.tap(rows[1]); s.away(); await s.beat(4);
    await s.tap(tr); await s.beat(2);
    hl(th); await s.tap(th); await s.beat(3);
    await s.tap(tr); s.away(); await s.beat(3);
  });
});
/* ---------- Context switcher ---------- */
DM.def('context-switcher', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{unfold\}/g, I('unfold','xs')).replace(/\{crumb\}/g, I('crumb')).replace('{more}', I('more')).replace('{search}', I('search','xs'));
  // the organisations this account is in, with their plans; each one's projects, and each project's environments. Each level
  // remembers what was picked in it (on), so an organisation brings back the project you were last in, and a project its
  // environment
  const KIND = { Production:'warning', Staging:'blue', Development:'neutral' };
  const envs = (...e) => e.map(([id, k]) => ({ id, name:id, b:[k, KIND[k]] }));
  const STD = () => envs(['live', 'Production'], ['staging', 'Staging'], ['sandbox', 'Development']);
  const ROOT = { on:'fernhill', items:[
    { id:'fernhill', name:'Fernhill Labs', t:'pb', b:['Pro', 'accent'], on:'triage', items:[
      { id:'triage', name:'Support triage agent', on:'eu-live', items:envs(['eu-live', 'Production'], ['us-live', 'Production'], ['staging', 'Staging'], ['sandbox', 'Development']) },
      { id:'invoice', name:'Invoice reader', b:['Beta', 'teal'], on:'staging', items:STD() },
      { id:'research', name:'Sales research agent', on:'live', items:STD() },
      { id:'onboard', name:'Onboarding copilot', b:['Paused', 'neutral'], on:'sandbox', items:STD() },
      { id:'notes', name:'Release notes writer', on:'live', items:STD() }
    ] },
    { id:'quillwork', name:'Quillwork', t:'pp', b:['Free', 'neutral'], on:'coach', items:[
      { id:'coach', name:'Essay coach', on:'live', items:STD() },
      { id:'cite', name:'Citation checker', b:['Beta', 'teal'], on:'staging', items:STD() }
    ] },
    { id:'otterline', name:'Otterline Health', t:'pm', b:['Enterprise', 'violet'], on:'intake', items:[
      { id:'intake', name:'Intake assistant', on:'live', items:STD() },
      { id:'claims', name:'Claims summariser', on:'live', items:STD() },
      { id:'handover', name:'Shift handover notes', b:['Beta', 'teal'], on:'sandbox', items:STD() }
    ] }
  ] };
  // the parts of the path, outermost first
  const KEYS = ['org', 'project', 'env'];
  const SEG = {
    org:{ label:'Organisation', noun:'organisation', many:'organisations', find:'Find an organisation', head:() => 'Your organisations' },
    project:{ label:'Project', noun:'project', many:'projects', find:'Find a project', head:() => `Projects in ${node(0).name}` },
    env:{ label:'Environment', noun:'environment', many:'environments', find:'Find an environment', head:() => `Environments of ${node(1).name}` }
  };
  // the level a part picks from, and what is picked there
  const parent = d => { let n = ROOT; for (let i = 0; i < d; i++) n = n.items.find(x => x.id === n.on); return n; };
  const node = d => { const p = parent(d); return p.items.find(x => x.id === p.on); };
  const box = $('.csw', r), bar = $('.csw-bar', r), pop = $('.csw-pop', r), q = $('.csw-q', r), list = $('.csw-list', r), mpop = $('.csw-mpop', r), more = $('.csw-more', r), live = $('.csw-live', r);
  const uid = Math.random().toString(36).slice(2, 7);
  list.id = 'csw-l-' + uid; q.setAttribute('aria-controls', list.id);
  const trig = k => $(`.csw-seg[data-k="${k}"] .csw-tr`, r);
  KEYS.forEach(k => trig(k).setAttribute('aria-controls', list.id));
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const badge = x => x.b ? `<span class="csw-bd"${x.b[1] && x.b[1] !== 'neutral' ? ` data-tone="${x.b[1]}"` : ''}>${esc(x.b[0])}</span>` : '';
  const tile = x => `<span class="csw-lg" data-t="${x.t}" aria-hidden="true">${esc(x.name[0])}</span>`;
  const named = (x, d) => `${SEG[KEYS[d]].label}: ${x.name}${x.b ? ', ' + x.b[0] : ''}`;

  /* ---- the bar: each part's name and badge, crossfading when they change ---- */
  function paint(first){
    KEYS.forEach((k, d) => {
      const x = node(d), tr = trig(k), nm = $('.csw-nm', tr), bh = $('.csw-bh', tr), lg = $('.csw-lg', tr);
      if (first){ nm.textContent = x.name; bh.innerHTML = badge(x); } else { swap(nm, x.name); swap(bh, badge(x), true); }
      if (lg){ lg.textContent = x.name[0]; lg.dataset.t = x.t; lg.setAttribute('aria-hidden', 'true'); }
      tr.setAttribute('aria-label', named(x, d));
    });
    c.later(REDUCE ? 0 : 220, tips);
  }
  // a name the ellipsis cuts short shows in full in a tooltip
  function tips(){ KEYS.forEach((k, d) => { const tr = trig(k), nm = $('.csw-nm', tr); if (nm.scrollWidth > nm.clientWidth + 1) tr.dataset.tip = node(d).name; else delete tr.dataset.tip; }); }
  // phone narrow (the CSS decides), only the last part shows and the … button stands in for the others
  const narrow = () => getComputedStyle($('.csw-mi', r)).display !== 'none';
  const anchor = k => !narrow() || k === KEYS[KEYS.length - 1] ? trig(k) : more;
  // under what opened it, inside the component's ends
  function place(el, at){
    const b = box.getBoundingClientRect(), a = at.getBoundingClientRect(), br = bar.getBoundingClientRect();
    el.style.left = Math.max(0, Math.min(a.left - b.left, b.width - el.offsetWidth)) + 'px';
    el.style.top = Math.round(br.bottom - b.top + 6) + 'px';
  }

  /* ---- a part's switcher: the search, the list, and Create new at the bottom ---- */
  let open = null, full = 0, hi = 0, opts = [], mopen = false, made = 0;
  function fill(reset){
    const S = SEG[open], d = KEYS.indexOf(open), p = parent(d), v = q.value.trim(), lv = v.toLowerCase();
    const m = p.items.filter(x => !lv || x.name.toLowerCase().includes(lv));
    list.innerHTML = `<div class="ph" role="presentation">${esc(S.head())}</div>`
      + (m.length ? m.map(x => `<div class="mi csw-o" role="option" id="${list.id}-${esc(x.id)}" aria-selected="${x.id === p.on}" data-id="${esc(x.id)}">${d === 0 ? tile(x) : ''}<span class="csw-on">${esc(x.name)}</span>${badge(x)}<span class="ck">${I('check','xs')}</span></div>`).join('')
        : `<div class="csw-none" role="presentation">No ${S.many} match “${esc(v)}”</div>`)
      + `<div class="sep" role="presentation"></div><div class="mi csw-o csw-new" role="option" id="${list.id}-new" aria-selected="false" data-new="1"${v ? '' : ` aria-label="Create new ${S.noun}"`}>${I('plus','xs')}<span class="csw-on">${v ? `Create “${esc(v)}”` : 'Create new…'}</span></div>`;
    opts = $$('.csw-o', list);
    // the highlight starts on the current one; once you type, on the first match
    hi = reset ? Math.max(0, opts.findIndex(o => o.getAttribute('aria-selected') === 'true')) : 0;
    opts.forEach((o, i) => { o.onmousemove = () => { if (hi !== i){ hi = i; move(0); } }; o.onmousedown = e => e.preventDefault(); o.onclick = () => pick(o); });
    move(0);
  }
  function move(by){
    if (!opts.length) return;
    hi = (hi + by + opts.length) % opts.length;
    opts.forEach((o, i) => o.classList.toggle('hl', i === hi));
    q.setAttribute('aria-activedescendant', opts[hi].id);
    // the list scrolls to keep it in view, never the page
    if (!hi){ list.scrollTop = 0; return; }
    const lr = list.getBoundingClientRect(), or = opts[hi].getBoundingClientRect();
    if (or.top < lr.top) list.scrollTop -= lr.top - or.top; else if (or.bottom > lr.bottom) list.scrollTop += or.bottom - lr.bottom;
  }
  function show(k, { focus = false } = {}){
    if (mopen) menu(false);
    if (open === k){ if (focus) q.focus({ preventScroll:true }); return; }
    if (open) hide(false, true);
    open = k; const S = SEG[k];
    q.value = ''; q.placeholder = S.find; q.setAttribute('aria-label', S.find); list.setAttribute('aria-label', S.many[0].toUpperCase() + S.many.slice(1));
    trig(k).setAttribute('aria-expanded', 'true'); q.setAttribute('aria-expanded', 'true');
    fill(true); hideTip(); place(pop, anchor(k)); pop.inert = false; pop.classList.add('open');
    // the bar makes room for the switcher at its fullest, before any filter, so it holds still while typing filters the list
    full = pop.offsetHeight; centred();
    if (focus) q.focus({ preventScroll:true });
  }
  // closing gives the focus back to the part's button (or the … button, on a phone) when it was in the switcher
  function hide(back, next){
    if (!open) return; const k = open; open = null;
    pop.classList.remove('open'); pop.inert = true; trig(k).setAttribute('aria-expanded', 'false'); q.setAttribute('aria-expanded', 'false'); q.removeAttribute('aria-activedescendant');
    if (back) anchor(k).focus({ preventScroll:true });
    // the bar waits for the list to fade before it glides back to the middle
    if (!next) c.later(REDUCE ? 0 : 180, centred);
    // once it has faded it goes back to the component's corner, so a narrower screen later never scrolls sideways to it
    c.later(320, () => { if (!open){ pop.style.left = '0px'; pop.style.top = '0px'; } });
  }
  // what changed, said once for screen readers: the part picked and the parts that came with it
  const say = d => { live.textContent = 'Switched to ' + KEYS.slice(d).map((k, i) => { const x = node(d + i); return `${i ? SEG[k].noun + ' ' : ''}${x.name}${x.b ? ` (${x.b[0]})` : ''}`; }).join(', '); };
  // every change also goes out as a context-change event from the component, with the part changed and the whole path
  const tell = k => box.dispatchEvent(new CustomEvent('context-change', { bubbles:true, detail:{ segment:k, path:Object.fromEntries(KEYS.map((kk, d) => [kk, node(d).id])) } }));
  function pick(o){
    if (!o || !open) return;
    const k = open, d = KEYS.indexOf(k), p = parent(d), back = pop.contains(document.activeElement);
    if (o.dataset.new) return create(k, q.value.trim(), back);
    const was = p.on; p.on = o.dataset.id; hide(back);
    if (p.on !== was){ paint(); say(d); tell(k); }
  }
  // Create new first sends a cancelable context-create event from the component, with the part and what was typed, so your
  // code can open its own form; left alone, it adds one by that name (an organisation with a first project) and picks it
  function create(k, name, back){
    const S = SEG[k], d = KEYS.indexOf(k), p = parent(d);
    const go = box.dispatchEvent(new CustomEvent('context-create', { bubbles:true, cancelable:true, detail:{ segment:k, name } }));
    hide(back); if (!go) return;
    const id = 'new-' + (++made), x = { id, name:name || `New ${S.noun}` };
    if (k === 'org') Object.assign(x, { t:'pl', b:['Free', 'neutral'], on:id + '-p', items:[{ id:id + '-p', name:'First project', on:'sandbox', items:STD() }] });
    else if (k === 'project') Object.assign(x, { on:'sandbox', items:STD() });
    else x.b = ['Development', KIND.Development];
    p.items.push(x); p.on = id; paint(); tell(k);
    live.textContent = `Created ${S.noun} ${x.name}`;
  }

  /* ---- the … menu, on a phone: the parts before the last, each opening its own switcher ---- */
  function menu(on, focus){
    if (on === mopen) return; mopen = on;
    if (on){
      if (open) hide(false, true);
      mpop.innerHTML = KEYS.slice(0, -1).map((k, d) => { const x = node(d); return `<button class="mi" role="menuitem" tabindex="-1" data-k="${k}">${d ? I('layers') : tile(x)}<span class="t"><b>${esc(x.name)}</b><span class="d">${SEG[k].label}</span></span>${badge(x)}</button>`; }).join('');
      $$('.mi', mpop).forEach(m => m.onclick = e => { menu(false); show(m.dataset.k, { focus:e.isTrusted }); });
      hideTip(); place(mpop, more); mpop.inert = false; mpop.classList.add('open'); more.setAttribute('aria-expanded', 'true'); centred();
      if (focus){ const it = $$('.mi', mpop); (focus === 'last' ? it[it.length - 1] : it[0]).focus({ preventScroll:true }); }
    } else {
      const back = mpop.contains(document.activeElement);
      mpop.classList.remove('open'); mpop.inert = true; more.setAttribute('aria-expanded', 'false');
      if (back) more.focus({ preventScroll:true });
      c.later(REDUCE ? 0 : 180, centred);
      c.later(320, () => { if (!mopen){ mpop.style.left = '0px'; mpop.style.top = '0px'; } });
    }
  }

  /* ---- the keyboard ---- */
  // on the bar, the left and right arrows move between the parts you can see
  const parts = () => [more, ...KEYS.map(trig)].filter(b => b.getClientRects().length);
  const sideways = e => { if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return false; const all = parts(), to = all[all.indexOf(e.currentTarget) + (e.key === 'ArrowLeft' ? -1 : 1)]; if (to){ e.preventDefault(); to.focus({ preventScroll:true }); } return true; };
  // a click, Enter or Space opens a part's switcher with the focus in its search; so do the down arrow (on the current one)
  // and the up arrow (on the last row). A story's tap opens it without moving the focus
  KEYS.forEach(k => {
    const tr = trig(k);
    tr.onclick = e => { if (open === k) hide(pop.contains(document.activeElement)); else show(k, { focus:e.isTrusted }); };
    tr.onkeydown = e => {
      if (sideways(e)) return;
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); show(k, { focus:true }); if (e.key === 'ArrowUp'){ hi = opts.length - 1; move(0); } }
    };
  });
  more.onclick = e => menu(!mopen, e.isTrusted && 'first');
  more.onkeydown = e => { if (sideways(e)) return; if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); menu(true, e.key === 'ArrowUp' ? 'last' : 'first'); } };
  // in the search: the arrows move through the list and wrap, Home and End go to its ends, typing filters it, Enter picks,
  // Escape closes it and gives the focus back to the part. With nothing typed, the left and right arrows move to the part
  // before or after and open its switcher
  q.oninput = () => fill(false);
  q.onkeydown = e => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp'){ e.preventDefault(); move(k === 'ArrowDown' ? 1 : -1); }
    else if (k === 'Home' || k === 'End'){ e.preventDefault(); hi = k === 'Home' ? 0 : opts.length - 1; move(0); }
    else if (k === 'Enter'){ e.preventDefault(); pick(opts[hi]); }
    else if (k === 'Escape'){ e.preventDefault(); e.stopPropagation(); hide(true); }
    else if ((k === 'ArrowLeft' || k === 'ArrowRight') && !q.value){ const n = KEYS[KEYS.indexOf(open) + (k === 'ArrowLeft' ? -1 : 1)]; if (n){ e.preventDefault(); show(n, { focus:true }); } }
  };
  // in the … menu: the arrows move and wrap, Home and End jump to the ends, Escape closes it and Tab leaves it
  c.on(mpop, 'keydown', e => {
    const all = $$('.mi', mpop), i = all.indexOf(document.activeElement);
    const go = { ArrowDown:all[(i + 1) % all.length], ArrowUp:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); go.focus({ preventScroll:true }); }
    else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); menu(false); }
    else if (e.key === 'Tab') setTimeout(() => menu(false));
  });
  // Tab out of the switcher closes it; so does a press anywhere else, or a real resize
  c.on(pop, 'focusout', e => { if (open && e.relatedTarget && !pop.contains(e.relatedTarget) && e.relatedTarget !== trig(open)) hide(false); });
  c.on(document, 'pointerdown', e => { const t = e.target; if (pop.contains(t) || mpop.contains(t) || (box.contains(t) && t.closest('.csw-tr,.csw-more'))) return; hide(false); menu(false); });
  c.on(window, 'resize', e => { if (e.isTrusted){ hide(false); menu(false); } });
  const ro = new ResizeObserver(tips); ro.observe(bar); c.offs.push(() => ro.disconnect());

  // the bar sits centred on its own, and glides up as a switcher opens under it, so the two sit centred together
  const centred = centre(c, box, () => open ? Math.max(box.offsetHeight, pop.offsetTop + full) : mopen ? Math.max(box.offsetHeight, mpop.offsetTop + mpop.offsetHeight) : box.offsetHeight);
  pop.inert = true; mpop.inert = true; paint(true);
  if (document.fonts) document.fonts.ready.then(() => { if (!c.dead) tips(); });
  // the preview's story: open the project's switcher (through the … menu on a phone), search for "inv" and pick Invoice
  // reader; the environment follows it, from eu-live in Production to staging
  c.story(async s => {
    await s.beat(3);
    if (narrow()){ await s.tap(more); await s.beat(2); await s.tap($('.mi[data-k="project"]', mpop)); }
    else await s.tap(trig('project'));
    s.away(); await s.beat(2);
    await s.type(q, 'inv', { n:.4, each:() => { if (open) fill(false); } }); await s.beat(2);
    await s.tap(opts[hi]); s.away(); await s.beat(5);
  });
});
/* ---------- Filter menu ---------- */
DM.def('filter-menu', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{filter}', I('filter'));
  const OWN = { MK:'Maya Kim', LP:'Leo Park', AR:'Ana Ruiz', SC:'Sam Cole' };
  const ST = { open:'Open', prog:'In progress', done:'Done' };
  // the issues: title, status, owner and days since the last update, most recent first
  const T = [
    ['Pricing toggle hides the yearly saving', 'open', 'MK', 0], ['Plan cards wrap at 768px', 'open', 'MK', 1], ['Checkout button loses its focus ring', 'open', 'MK', 3],
    ['Invoice email shows the wrong currency', 'open', 'MK', 9], ['Seat slider skips 25', 'open', 'LP', 0], ['Coupon field accepts expired codes', 'open', 'LP', 2],
    ['Dark logo has a white edge', 'open', 'AR', 1], ['FAQ accordion jumps on open', 'open', 'AR', 5], ['Trial banner covers the nav', 'open', 'SC', 0],
    ['EU tax line rounds down', 'open', 'SC', 12], ['Annual plan link goes to a 404', 'open', 'LP', 20], ['Move pricing copy into the CMS', 'prog', 'MK', 0],
    ['Comparison table for Team', 'prog', 'MK', 2], ['Prices in yen for Japan', 'prog', 'LP', 4], ['New hero illustration', 'prog', 'AR', 1],
    ['Track plan clicks', 'prog', 'SC', 6], ['Enterprise contact form', 'prog', 'MK', 15], ['Seat limits on the Free plan', 'prog', 'AR', 3],
    ['Ship the new plan names', 'done', 'MK', 1], ['Price flicker on load', 'done', 'MK', 8], ['Remove the Starter plan', 'done', 'LP', 3],
    ['Badge for the yearly discount', 'done', 'AR', 2], ['Retry failed Stripe webhooks', 'done', 'SC', 25], ['Refund policy link', 'done', 'SC', 10]
  ].map(([t, s, o, a]) => ({ t, s, o, a })).sort((x, y) => x.a - y.a);
  // the fields a filter can use, the two ways each one reads, and its values. A value's c is how a chip says it
  const F = {
    status:{ l:'Status', ic:'target', ops:['is', 'is not'], o:Object.entries(ST).map(([v, l]) => ({ v, l, g:`<span class="dot" data-s="${v}"></span>` })), test:(t, v) => t.s === v },
    owner:{ l:'Owner', ic:'user', ops:['is', 'is not'], o:Object.entries(OWN).map(([v, l]) => ({ v, l, g:`<span class="av" data-o="${v}">${v}</span>` })), test:(t, v) => t.o === v },
    date:{ l:'Updated', ic:'cal', ops:['within', 'older than'], o:[{ v:1, l:'Past day', c:'1 day' }, { v:7, l:'Past 7 days', c:'7 days' }, { v:30, l:'Past 30 days', c:'30 days' }], test:(t, v) => t.a < v }
  };
  const tr = $('.flm-tr', r), pop = $('.flm-pop', r), l1 = $('.flm-l1', r), l2 = $('.flm-l2', r), chips = $('.flm-chips', r), ct = $('.flm-ct', r), clr = $('.flm-clr', r), list = $('.flm-list', r);
  // the filters in the order they were added: field, value, and whether it reads the other way (is not, older than)
  let A = [];
  const val = (k, v) => F[k].o.find(o => o.v === v);
  const match = (t, skip) => A.every(f => f.k === skip || F[f.k].test(t, f.v) !== f.neg);
  const age = a => a ? a + 'd' : 'Today';
  l1.insertAdjacentHTML('beforeend', Object.entries(F).map(([k, f]) => `<button class="mi" role="menuitem" aria-haspopup="menu" tabindex="-1" data-k="${k}">${I(f.ic)}<span>${f.l}</span><span class="r"></span>${I('chev-r','xs')}</button>`).join(''));
  const fields = $$('.mi', l1);
  function paint(){
    // chips: one per field. A new one pops in, one taken off fades where it was and the rest glide over to close the gap,
    // and a chip that stays crossfades to its new operator or value
    const have = new Set(A.map(f => f.k));
    reflow(() => $$('.flm-ch', chips), () => {
      $$('.flm-ch:not([data-ghost])', chips).forEach(ch => { if (!have.has(ch.dataset.k)) ch.remove(); });
      A.forEach(f => {
        let ch = $(`.flm-ch[data-k="${f.k}"]`, chips); const fresh = !ch;
        if (!ch){ ch = html(`<div class="flm-ch" role="listitem" data-k="${f.k}"><span class="k">${F[f.k].l}</span><button class="op"></button><span class="v"></span><button class="x" data-tip="Remove filter">${I('x','xs')}</button></div>`); chips.appendChild(ch); wire(ch); }
        else ch.classList.add('seen');
        const o = val(f.k, f.v), op = F[f.k].ops[+f.neg], text = `${F[f.k].l} ${op} ${o.c || o.l}`;
        [[$('.op', ch), op], [$('.v', ch), o.c || o.l]].forEach(([el, t]) => { if (el.textContent === t) return; el.textContent = t;
          if (!fresh && !REDUCE){ if (el._in) el._in.cancel(); el._in = el.animate([{ opacity:0, transform:'translateY(2px)' }, { opacity:1, transform:'none' }], { duration:200, easing:getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease' }); } });
        $('.op', ch).setAttribute('aria-label', `${text}: change to ${F[f.k].ops[+!f.neg]}`); $('.op', ch).dataset.tip = `Change to ${F[f.k].ops[+!f.neg]}`;
        $('.x', ch).setAttribute('aria-label', `Remove filter ${text}`);
      });
    }, { by:'data-k', root:$('.flm', r), enter:false });
    // the menu shows each field's value, if it has one
    fields.forEach(m => { const f = A.find(x => x.k === m.dataset.k), o = f && val(f.k, f.v); $('.r', m).textContent = o ? (f.neg ? F[f.k].ops[1] + ' ' : '') + (o.c || o.l) : ''; });
    const hit = T.filter(t => match(t)), n = hit.length;
    swap(ct, A.length ? `${n} of ${T.length} issues` : `${T.length} issues`); clr.hidden = !A.length;
    // the four most recently updated, and how many more. Issues that still match glide to their new places, new ones fade
    // in and the ones filtered out fade where they were (the first paint is the card's entrance)
    const draw = () => { list.innerHTML = n ? hit.slice(0, 4).map(t => `<div class="flm-r" data-t="${t.t}"><span class="dot" data-s="${t.s}" aria-label="${ST[t.s]}" role="img"></span><span class="t">${t.t}</span><span class="av" data-o="${t.o}" aria-label="${OWN[t.o]}" role="img">${t.o}</span><span class="a">${age(t.a)}</span></div>`).join('') + (n > 4 ? `<div class="flm-more" data-t="more">and ${n - 4} more</div>` : '')
      : '<div class="flm-e" data-t="none">No issues match these filters</div>'; };
    if (painted) reflow(() => [...list.children], draw, { by:'data-t', root:$('.flm', r) });
    else { draw(); stagger($$('.flm-r', list), 50); }
    painted = true;
  }
  let painted = false;
  function wire(ch){
    const k = ch.dataset.k;
    $('.op', ch).onclick = () => { const f = A.find(x => x.k === k); f.neg = !f.neg; paint(); };
    $('.x', ch).onclick = () => {
      const near = $$('.flm-ch:not([data-ghost])', chips), i = near.indexOf(ch), had = ch.contains(document.activeElement), next = near[i + 1] || near[i - 1];
      A = A.filter(x => x.k !== k); hideTip(); paint();
      if (had) ((next && $('.x', next)) || tr).focus({ preventScroll:true });
    };
  }
  clr.onclick = () => { const had = clr === document.activeElement; A = []; paint(); if (had) tr.focus({ preventScroll:true }); };
  // the menu has two steps: the fields, then the values of the one picked. Each value says how many issues it would leave.
  // It opens and closes on its own rather than through the page's shared popover, so a story playing in the card beside it
  // can't close it. Closing it while the focus is inside gives the focus back to the Filter button
  let field = null;
  const items = () => $$('.mi', field ? l2 : l1), isOpen = () => pop.classList.contains('open');
  // the focus is the one highlight: a row the demo's pointer left lit goes dark
  const focusItem = m => { if (!m) return; $$('.mi', pop).forEach(x => { x.tabIndex = x === m ? 0 : -1; x.classList.remove('hl'); }); m.focus({ preventScroll:true }); };
  function show(on, focus){
    if (on && !isOpen()){ step(null); hideTip(); placePop(tr, pop); }
    pop.classList.toggle('open', on); pop.inert = !on; tr.setAttribute('aria-expanded', on);
    if (on && focus){ const all = items(); focusItem(focus === 'last' ? all[all.length - 1] : all[0]); }
    if (!on && pop.contains(document.activeElement)) tr.focus({ preventScroll:true });
  }
  // moving between the two steps, the step coming in slides 4px from the side it is on (values from the right, the fields
  // back from the left) as it fades in
  let slid = null;
  function step(k){
    const had = pop.contains(document.activeElement), from = field;
    field = k; l1.hidden = !!k; l2.hidden = !k;
    if (slid){ slid.cancel(); slid = null; }
    if (isOpen() && !REDUCE && !!k !== !!from) slid = (k ? l2 : l1).animate([{ opacity:0, transform:`translateX(${k ? 4 : -4}px)` }, { opacity:1, transform:'none' }], { duration:(parseFloat(getComputedStyle(r).getPropertyValue('--t-fast')) || .22) * 1000, easing:getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease' });
    if (k){
      const f = F[k], on = A.find(x => x.k === k);
      l2.setAttribute('aria-label', f.l);
      l2.innerHTML = `<button class="mi flm-bk" role="menuitem" tabindex="-1" aria-label="Back to all fields">${I('chev-l','xs')}<span>${f.l}</span></button><div class="sep" role="separator"></div>`
        + f.o.map(o => `<button class="mi" role="menuitemradio" aria-checked="${!!on && on.v === o.v}" tabindex="-1" data-v="${o.v}">${o.g || ''}<span>${o.l}</span><span class="r num">${T.filter(t => match(t, k) && f.test(t, o.v)).length}</span><span class="ck">${I('check','xs')}</span></button>`).join('');
      $('.flm-bk', l2).onclick = () => step(null);
      $$('.mi[data-v]', l2).forEach(m => m.onclick = () => {
        const v = k === 'date' ? +m.dataset.v : m.dataset.v, f = A.find(x => x.k === k);
        if (f){ f.v = v; f.neg = false; } else A.push({ k, v, neg:false });
        $$('.mi[data-v]', l2).forEach(x => x.setAttribute('aria-checked', x === m)); paint();
        // the pick shows for a moment before the menu fades
        c.later(120, () => show(false));
      });
    }
    if (had) focusItem(k ? ($('.mi[aria-checked="true"]', l2) || $$('.mi', l2)[1]) : $(`.mi[data-k="${from}"]`, l1) || fields[0]);
  }
  fields.forEach(m => m.onclick = () => step(m.dataset.k));
  // a click, Enter, Space or the down arrow opens it with the focus on the first field, the up arrow on the last.
  // A story's tap opens it without moving the focus
  c.on(tr, 'click', e => show(!isOpen(), e.isTrusted && 'first'));
  c.on(tr, 'keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); show(true, e.key === 'ArrowUp' ? 'last' : 'first'); } });
  c.on(document, 'pointerdown', e => { if (isOpen() && !pop.contains(e.target) && !tr.contains(e.target)) show(false); });
  c.on(window, 'resize', e => { if (e.isTrusted) show(false); });
  // inside the menu: the arrow keys move and wrap, Home and End jump to the ends, the right arrow opens a field's values
  // and the left arrow goes back, Escape closes it and Tab leaves it
  c.on(pop, 'keydown', e => {
    const all = items(), i = all.indexOf(document.activeElement);
    const go = { ArrowDown:all[(i + 1) % all.length], ArrowUp:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); focusItem(go); }
    else if (e.key === 'ArrowRight' && !field && all[i]){ e.preventDefault(); step(all[i].dataset.k); }
    else if (e.key === 'ArrowLeft' && field){ e.preventDefault(); step(null); }
    else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); show(false); }
    else if (e.key === 'Tab') setTimeout(() => show(false));
  });
  show(false); paint();
  // the preview's story: filter to open issues, then to Maya's, and watch the count drop; then take the status filter off
  c.story(async s => {
    await s.beat(3); await s.tap(tr); await s.beat(2);
    await s.tap($('.mi[data-k="status"]', l1)); await s.beat(2);
    await s.tap($('.mi[data-v="open"]', l2)); s.away(); await s.beat(4);
    await s.tap(tr); await s.beat(2);
    await s.tap($('.mi[data-k="owner"]', l1)); await s.beat(2);
    await s.tap($('.mi[data-v="MK"]', l2)); s.away(); await s.beat(4);
    await s.tap($('.flm-ch[data-k="status"] .x', chips)); s.away(); await s.beat(4);
  });
});
/* ---------- Number field ---------- */
DM.def('number-field', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{minus\}/g, I('minus','xs')).replace(/\{plus\}/g, I('plus','xs'));
  // each field: its range and step, how its value reads, and the words for its unit
  const F = {
    steps:{ min:5, max:100, step:5, v:25, dp:0, say:x => `${x} steps` },
    budget:{ min:.25, max:20, step:.25, v:2.5, dp:2, say:x => `$${x.toFixed(2)}` },
    time:{ min:1, max:60, step:1, v:10, dp:0, say:x => `${x} minutes` }
  };
  const sum = $('.nmf-sum', r);
  const fix = x => +x.toFixed(4);
  const line = () => `A run stops at ${F.steps.v} steps, $${F.budget.v.toFixed(2)} or ${F.time.v} min, whichever comes first.`;
  sum.textContent = line();
  $$('.nmf-f', r).forEach(f => {
    const o = F[f.dataset.k], inp = $('input', f), dn = $('.nmf-dn', f), up = $('.nmf-up', f), hint = $('.nmf-hint', f), box = $('.nmf-in', f);
    const base = `${o.dp ? o.min.toFixed(o.dp) : o.min} to ${o.dp ? o.max.toFixed(o.dp) : o.max}${o.step !== 1 ? `, in steps of ${o.dp ? o.step.toFixed(o.dp) : o.step}` : ''}`;
    let note = '';
    const tell = t => { if (t === note) return; note = t; swap(hint, t || base); f.classList.toggle('noted', !!t); };
    hint.textContent = base;
    const paint = () => {
      inp.value = o.v.toFixed(o.dp); inp.setAttribute('aria-valuenow', o.v); inp.setAttribute('aria-valuetext', o.say(o.v));
      dn.disabled = o.v <= o.min; up.disabled = o.v >= o.max; sum.textContent = line();
    };
    inp.setAttribute('aria-valuemin', o.min); inp.setAttribute('aria-valuemax', o.max);
    // a change from the buttons or the keys: one step, or ten with Shift or Page Up/Down; it stops at the ends and says so
    const set = (x, why) => {
      const was = o.v; o.v = fix(Math.min(o.max, Math.max(o.min, x)));
      if (o.v !== was){ box.classList.remove('bump'); void box.offsetWidth; box.classList.add('bump'); }
      tell(why || (x > o.max ? `${o.say(o.max)} is the most` : x < o.min ? `${o.say(o.min)} is the least` : ''));
      paint();
    };
    const stepBy = n => set(o.v + n * o.step);
    // what was typed is kept when you press Enter or leave the field: rounded to the step and kept inside the range, with a
    // word about what changed; something that isn't a number puts the last value back
    const commit = () => {
      const raw = inp.value.replace(/[^0-9.]/g, ''), x = parseFloat(raw);
      if (!raw || isNaN(x)){ inp.removeAttribute('aria-invalid'); tell(`Enter a number from ${base.split(',')[0]}`); paint(); return; }
      const snapped = fix(Math.round((x - o.min) / o.step) * o.step + o.min);
      if (x > o.max) set(x);
      else if (x < o.min) set(x);
      else set(snapped, Math.abs(snapped - x) > 1e-9 ? `Rounded to ${o.say(snapped)}` : '');
    };
    inp.addEventListener('input', () => { const ok = /^\$?\d*\.?\d*$/.test(inp.value.trim()); inp.toggleAttribute('aria-invalid', !ok); });
    inp.addEventListener('keydown', e => {
      const big = e.shiftKey ? 10 : 1;
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown'){ e.preventDefault(); stepBy((e.key === 'ArrowUp' ? 1 : -1) * big); }
      else if (e.key === 'PageUp' || e.key === 'PageDown'){ e.preventDefault(); stepBy(e.key === 'PageUp' ? 10 : -10); }
      else if (e.key === 'Enter'){ e.preventDefault(); commit(); if (document.activeElement === inp) inp.select(); }
      else if (e.key === 'Escape'){ inp.removeAttribute('aria-invalid'); paint(); }
    });
    inp.addEventListener('blur', commit);
    // the label, and a press beside the value, put the cursor in the field
    $('.nmf-l', f).onclick = () => inp.focus();
    $('.nmf-v', f).onclick = e => { if (e.target !== inp) inp.focus(); };
    // press and hold − or +: one step at once, then more and more quickly until you let go
    [[dn, -1], [up, 1]].forEach(([b, d]) => {
      let t = 0;
      const stop = () => { clearTimeout(t); t = 0; };
      const rep = ms => { t = setTimeout(() => { if (b.disabled) return stop(); stepBy(d); rep(Math.max(40, ms * .8)); }, ms); c.t.push(t); };
      b.addEventListener('pointerdown', e => { if (e.button) return; e.preventDefault(); stepBy(d); stop(); rep(420); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => b.addEventListener(ev, stop));
      // the keyboard and the demo press it with a click, which has no pointer down before it
      b.addEventListener('click', e => { if (e.detail === 0) stepBy(d); });
    });
    paint();
  });
  // the preview's story: two more steps, a budget typed past the most it allows, then a minute less of time
  if (r === c.st) c.story(async s => {
    const up = $('.nmf-f[data-k="steps"] .nmf-up', r), bi = $('.nmf-f[data-k="budget"] input', r), td = $('.nmf-f[data-k="time"] .nmf-dn', r);
    await s.beat(3);
    await s.tap(up); await s.beat(1);
    await s.tap(up); await s.beat(3);
    await s.point(bi, false); bi.value = ''; await s.type(bi, '25', { n:.3 }); await s.beat(1);
    bi.dispatchEvent(new KeyboardEvent('keydown', { key:'Enter' })); s.away(); await s.beat(4);
    await s.tap(td); s.away(); await s.beat(4);
  });
});
/* ---------- Ticket list ---------- */
DM.def('ticket-list', (r, c) => {
  const T = [
    { p:'var(--bad)', pn:'Urgent', t:'Agent stopped mid export', f:'Northwind', a:['MK','var(--av-l)'], w:'4m', q:'The token export stopped at 60% and nothing has happened for 20 minutes.', s:'Sorry about that. The run paused at your $5 spend cap. I have raised it for this run and it finished just now. Your tokens are in the Exports tab.', st:'open' },
    { p:'var(--warn)', pn:'High', t:'Figma frames not syncing', f:'Lumen Labs', a:['JO','var(--av-m)'], w:'22m', q:'New frames from this morning are not showing up in DesignMe.', s:'The Figma token for your workspace expired yesterday. Reconnect it from Settings, then the frames will sync within a minute.', st:'open' },
    { p:'var(--accent-mark,var(--accent))', pn:'Normal', t:'How do I share a run?', f:'Orbit', a:['DA','var(--av-b)'], w:'1h', q:'Can I send an agent run to someone outside my team?', s:'Yes. Open the run, click Share, and turn on "Anyone with the link". They can view it without an account.', st:'open' },
    { p:'var(--faint)', pn:'Low', t:'Invoice address change', f:'Kite Health', a:['MK','var(--av-l)'], w:'2d', q:'', s:'', st:'done' }
  ];
  const list = $('.tkx-list', r); let f = 'open', open = null;
  function paint(anim){
    const L = T.filter(t => t.st === f);
    list.innerHTML = L.length ? L.map(t => `<div class="tkx-t${open === t ? ' open' : ''}"><button class="tkx-r"><span class="pr" data-tip="${t.pn}"><span class="dot" style="color:${t.p}"></span></span><span class="t"><b>${t.t}</b><span>${t.f}${t.q && open !== t ? ' · ' + t.q : ''}</span></span><span class="m"><span class="w">${t.w}</span>${AV(t.a[0], t.a[1])}</span></button>${open === t ? `<div class="tkx-d"><div class="tkx-q">${t.q}</div><div class="tkx-s"><div class="lb">${I('spark','xs')}Suggested reply</div><div class="tx" contenteditable="true" spellcheck="false">${t.s}</div></div><div class="tkx-a"><button class="pill ghost sm ed">${I('edit','xs')}Edit</button><button class="pill accent sm sd">${I('send','xs')}Send and solve</button></div></div>` : ''}</div>`).join('') : '<div class="tkx-e">All caught up</div>';
    if (anim) stagger($$('.tkx-t', list), 40);
    $$('.tkx-t', list).forEach((el, i) => { const t = L[i];
      $('.tkx-r', el).onclick = () => { open = open === t ? null : t; paint(); const d = $('.tkx-d', list); if (d) stagger([...d.children], 50); };
      // a solved ticket fades, then folds its height away, so the tickets under it slide up instead of jumping
      const sd = $('.sd', el); if (sd) sd.onclick = () => c.run(async () => { sd.innerHTML = '<span class="spin"></span>'; await c.wait(700); t.s = $('.tx', el).textContent; t.st = 'done'; open = null; el.classList.add('leave'); await c.wait(330);
        if (!REDUCE){ el.style.overflow = 'hidden'; await el.animate([{ height:el.offsetHeight + 'px' }, { height:'0px' }], { duration:260, easing:'cubic-bezier(.22,1,.36,1)', fill:'forwards' }).finished.catch(() => {}); }
        if (!c.dead) paint(); });
      const ed = $('.ed', el); if (ed) ed.onclick = () => { const tx = $('.tx', el); tx.focus({ preventScroll:true }); const s = document.getSelection(); s.selectAllChildren(tx); s.collapseToEnd(); };
    });
  }
  seg($('.tkx-sg', r), v => { f = v; open = null; paint(true); });
  paint(true);
  // as tickets open, close, leave or change with the filter, the panel stays centred in the room its stage keeps for it
  const root = $('.tkx', r); centre(c, root, () => root.offsetHeight);
  // the preview opens the first ticket on its own, unless you take over first
  c.auto(1000, () => { if (!open){ open = T[0]; paint(); stagger([...$('.tkx-d', list).children], 50); } });
});
/* ---------- Kanban ---------- */
DM.def('kanban', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{(search|x|grid|list)\}/g, (m, k) => I(k, 'xs'));
  // the columns, each with a short name for the tabs a narrow board shows; In progress has a WIP limit of three
  const COLS = [{ k:'todo', t:'To do', s:'To do' }, { k:'doing', t:'In progress', s:'Doing', lim:3 }, { k:'done', t:'Done', s:'Done' }];
  const M = { MK:{ n:'Maya Kim', bg:'var(--av-l)' }, JO:{ n:'Jonas Ortiz', bg:'var(--av-m)' }, LP:{ n:'Lena Park', bg:'var(--av-p)' }, DA:{ n:'Design agent', bg:'var(--av-b)', agent:true } };
  const ME = 'MK', MK = Object.keys(M);
  const PRI = { urgent:'Urgent', high:'High', med:'Medium', low:'Low', none:'No priority' }, PK = Object.keys(PRI);
  // priority is a coloured chip (Urgent red, High orange, Medium yellow, Low blue, none grey), and each label keeps one of the
  // other core tag colours wherever it shows
  const PT = { urgent:'bad', high:'p', med:'y', low:'b', none:'' };
  const LABELS = ['Design', 'Copy', 'Code', 'Bug', 'A11y'], LT = { Design:'l', Copy:'t', Code:'m', Bug:'k', A11y:'r' };
  // due dates are days from today, so the overdue one is always overdue
  const day = n => { const d = new Date(); d.setHours(0, 0, 0, 0); d.setDate(d.getDate() + n); return d; };
  const fmt = n => n === 0 ? 'Today' : n === 1 ? 'Tomorrow' : day(n).toLocaleDateString('en-US', { month:'short', day:'numeric' });
  const sub = (...a) => a.map(([t, d]) => ({ t, d:!!d }));
  let K = [
    { id:'DES-148', c:'todo', t:'Audit checkout for contrast', p:'high', pj:'Checkout', l:['A11y'], who:['DA'], due:3, sub:sub(['List every text pair'], ['Check against 4.5:1'], ['Fix the failing pairs'], ['Write up the changes']) },
    { id:'DES-151', c:'todo', t:'Write release notes for pricing', p:'med', pj:'Pricing', l:['Copy'], who:['MK'], due:2, cm:2 },
    { id:'DES-157', c:'todo', t:'Pricing toggle hides the yearly saving', p:'urgent', pj:'Pricing', l:['Bug'], who:['JO'], due:1, cm:4, at:1 },
    { id:'DES-155', c:'todo', t:'Empty state for search', p:'low', pj:'Search', l:['Design'], who:['LP'], at:2 },
    { id:'DES-142', c:'doing', t:'Export tokens to CSS', p:'high', pj:'Tokens', l:['Code'], who:['DA'], at:1, run:.4, sub:sub(['Read the Figma variables', 1], ['Map colours to roles', 1], ['Write the CSS variables'], ['Check contrast pairs'], ['Open a pull request']) },
    { id:'DES-144', c:'doing', t:'Review annual plan copy', p:'med', pj:'Pricing', l:['Copy'], who:['JO', 'MK'], due:-1, cm:5, sub:sub(['Headline', 1], ['Plan names', 1], ['Feature list'], ['Footnotes']) },
    { id:'DES-146', c:'doing', t:'Plan cards wrap at 768px', p:'high', pj:'Pricing', l:['Design', 'Bug'], who:['LP'], due:0, cm:1, sub:sub(['Reproduce on a tablet', 1], ['Fix the grid'], ['Test at 744px']) },
    { id:'DES-139', c:'done', t:'One CTA per pricing card', p:'med', pj:'Pricing', l:['Design'], who:['MK'], cm:3, sub:sub(['Pick the CTA', 1], ['Update the cards', 1]) },
    { id:'DES-137', c:'done', t:'Compare checkout flows', p:'low', pj:'Checkout', l:['Design'], who:['LP'], at:3, sub:sub(['Collect five flows', 1], ['Note the steps', 1], ['Share the findings', 1]) }
  ];
  let next = 158;
  const box = $('.kbx', r), bd = $('.kbx-bd', r), wrap = $('.kbx-cols', r), live = $('.kbx-sr', r);
  // the person who drags, types, picks or reads is never overtaken by the agent: its timer waits while any of that is going on
  let dragging = false, editing = false;
  // what is filtered, folded, picked and open, and which column a narrow board shows
  const F = { q:'', who:new Set(), l:new Set(), p:new Set() }, shut = new Set(), sel = new Set();
  let view = 'board', cur = 'doing', peek = null, foc = null, menuFor = null, menuFrom = 'card', colFor = null, fmFor = null, anchor = null;
  const byId = id => K.find(k => k.id === id);
  const say = t => { live.textContent = ''; c.later(30, () => { live.textContent = t; }); };
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

  /* ---------- the parts ---------- */
  const ptag = p => `<span class="tag${PT[p] ? ' ' + PT[p] : ''}">${PRI[p]}</span>`;
  const ltag = x => `<span class="tag${LT[x] ? ' ' + LT[x] : ''}">${x}</span>`;
  const priCls = p => `tag${PT[p] ? ' ' + PT[p] : ''} kbx-pri`;
  const avs = who => who.map(w => AV(w, M[w].bg)).join('');
  const done = k => (k.sub || []).filter(s => s.d).length;
  const step = k => (k.sub || []).find(s => !s.d)?.t || 'Wrapping up';
  const metaOf = k => {
    const n = k.sub?.length, d = done(k);
    return (k.due != null && k.c !== 'done' ? `<span class="kbx-mt${k.due < 0 ? ' late' : ''}" data-tip="${k.due < 0 ? 'Overdue' : 'Due'}">${I('cal', 'xs')}${fmt(k.due)}</span>` : '')
      + (n ? `<span class="kbx-mt${d === n ? ' ok' : ''}" data-tip="${d} of ${n} subtasks done"><span class="num">${d}/${n}</span><span class="kbx-sb"><i style="width:${d / n * 100}%"></i></span></span>` : '')
      + (k.cm ? `<span class="kbx-mt" data-tip="${k.cm} comment${k.cm > 1 ? 's' : ''}">${I('comment', 'xs')}<span class="num">${k.cm}</span></span>` : '')
      + (k.at ? `<span class="kbx-mt" data-tip="${k.at} file${k.at > 1 ? 's' : ''}">${I('clip', 'xs')}<span class="num">${k.at}</span></span>` : '');
  };
  const label = k => `${k.id}, ${k.t}. ${PRI[k.p]} priority${k.pj ? ', project ' + k.pj : ''}${k.who.length ? ', ' + k.who.map(w => M[w].n).join(' and ') : ''}${k.due != null && k.c !== 'done' ? ', due ' + fmt(k.due) + (k.due < 0 ? ', overdue' : '') : ''}${k.run != null ? ', the agent is working on it' : ''}${sel.has(k.id) ? ', selected' : ''}`;
  const card = k => `<div class="kbx-k${k.run != null ? ' agent' : ''}${sel.has(k.id) ? ' sel' : ''}${peek === k.id ? ' open' : ''}" data-id="${k.id}" role="listitem" tabindex="-1" aria-label="${esc(label(k))}">`
    + `<div class="kbx-k1"><button class="kbx-sel" role="checkbox" aria-checked="${sel.has(k.id)}" aria-label="Select ${k.id}" tabindex="-1">${I('check', 'xs')}</button>`
    + `<span class="kbx-id num">${k.id}</span><span class="kbx-sp"></span>`
    + `<button class="kbx-mv" data-pop=".kbx-mp" data-pop-align="end" aria-haspopup="menu" aria-label="Move ${k.id}" data-tip="Move to" tabindex="-1">${I('more', 'xs')}</button>`
    + `<button class="kbx-who" data-pop=".kbx-am" data-pop-align="end" aria-haspopup="menu" aria-label="Assignees: ${k.who.map(w => M[w].n).join(', ') || 'none'}" data-tip="${k.who.map(w => M[w].n).join(', ') || 'Assign'}" tabindex="-1">${k.who.length ? avs(k.who) : `<span class="none">${I('user', 'xs')}</span>`}</button></div>`
    + `<div class="kbx-cr"><button class="${priCls(k.p)}" data-pop=".kbx-pm" aria-haspopup="menu" aria-label="Priority: ${PRI[k.p]}" data-tip="Priority" tabindex="-1">${PRI[k.p]}</button>`
    + (k.pj ? `<span class="tag kbx-pj" data-tip="Project"><span>${esc(k.pj)}</span></span>` : '') + k.l.map(ltag).join('') + `</div>`
    + `<span class="t">${esc(k.t)}</span>`
    + (k.run != null ? `<div class="kbx-ag"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="s">${step(k)}</span><span class="pc num">${Math.round(k.run * 100)}%</span></div><div class="kbx-pr"><i style="width:${k.run * 100}%"></i></div>` : '')
    + `<div class="kbx-m">${metaOf(k)}</div></div>`;

  /* ---------- the board's frame ---------- */
  wrap.innerHTML = COLS.map(cl => `<div class="kbx-c" data-col="${cl.k}"><div class="kbx-ch"><button class="ib kbx-tg" aria-expanded="true" aria-label="Fold ${cl.t}" data-tip="Fold">${I('chev-d', 'xs')}</button><b>${cl.t}</b><span class="n num"></span><span class="kbx-sp"></span><button class="ib kbx-cadd" aria-label="Add a card to ${cl.t}" data-tip="Add card">${I('plus', 'xs')}</button><button class="ib kbx-cmn" data-pop=".kbx-cm" data-pop-align="end" aria-haspopup="menu" aria-label="${cl.t} actions" data-tip="Column actions">${I('more', 'xs')}</button></div><div class="kbx-list" role="list" aria-label="${cl.t}"></div></div>`).join('');
  bd.insertAdjacentHTML('beforebegin', `<div class="kbx-bar"><div class="seg2 kbx-tabs" role="group" aria-label="Column">${COLS.map(cl => `<button aria-pressed="false" data-v="${cl.k}">${cl.s}<span class="n num"></span></button>`).join('')}</div><button class="ib kbx-add" aria-label="Add card" data-tip="Add card">${I('plus', 'xs')}</button></div>`);
  $('.kbx-fp', r).innerHTML = MK.map(w => `<button aria-pressed="false" data-who="${w}" aria-label="${M[w].n}" data-tip="${M[w].n}">${AV(w, M[w].bg)}</button>`).join('');
  $('.kbx-fl', r).insertAdjacentHTML('afterbegin', [['who', 'Assignee'], ['l', 'Label'], ['p', 'Priority']].map(([f, n]) => `<button class="chip sm kbx-f" data-f="${f}" data-pop=".kbx-fm" aria-haspopup="menu"><span class="k">${n}</span><span class="v"></span>${I('chev-d', 'xs')}</button>`).join(''));
  bd.insertAdjacentHTML('beforeend', `<div class="kbx-em" hidden><span class="ic">${I('filter')}</span><b>No cards match</b><span>Try another filter or search.</span><button class="pill line sm kbx-ec">Clear filters</button></div>`
    + `<div class="kbx-bk" inert><span class="n num"></span><span class="l">Move to</span>${COLS.map(cl => `<button class="pill ghost sm" data-to="${cl.k}"><span class="lg">${cl.t}</span><span class="sh">${cl.s}</span></button>`).join('')}<span class="sep"></span><button class="ib kbx-bx" aria-label="Clear the selection" data-tip="Clear" data-tip-k="Esc">${I('x', 'xs')}</button></div>`
    + `<aside class="kbx-pk" role="dialog" aria-label="Card details" inert></aside>`);
  const pop = (cls, label, body) => `<div class="pop kbx-pop ${cls}" role="menu" aria-label="${label}"><div class="ph">${label}</div>${body}</div>`;
  box.insertAdjacentHTML('beforeend',
    pop('kbx-mp', 'Move to', COLS.map(cl => `<button class="mi" role="menuitemradio" aria-checked="false" data-close data-to="${cl.k}"><span>${cl.t}</span><span class="ck">${I('check', 'xs')}</span></button>`).join(''))
    + pop('kbx-pm', 'Priority', PK.map(p => `<button class="mi" role="menuitemradio" aria-checked="false" data-close data-p="${p}">${ptag(p)}<span class="ck">${I('check', 'xs')}</span></button>`).join(''))
    + pop('kbx-am', 'Assignees', MK.map(w => `<button class="mi" role="menuitemcheckbox" aria-checked="false" data-who="${w}">${AV(w, M[w].bg)}<span>${M[w].n}${w === ME ? ' (you)' : ''}</span><span class="ck">${I('check', 'xs')}</span></button>`).join(''))
    + pop('kbx-cm', 'Column', `<button class="mi" role="menuitem" data-close data-a="add">${I('plus', 'xs')}<span>Add card</span></button><button class="mi" role="menuitem" data-close data-a="all">${I('check', 'xs')}<span>Select all</span></button><button class="mi" role="menuitem" data-close data-a="pri">${I('sort', 'xs')}<span>Sort by priority</span></button><button class="mi" role="menuitem" data-close data-a="due">${I('cal', 'xs')}<span>Sort by due date</span></button><div class="sep"></div><button class="mi" role="menuitem" data-close data-a="fold">${I('chev-l', 'xs')}<span>Fold column</span></button>`)
    + `<div class="pop kbx-pop kbx-fm" role="menu" aria-label="Filter"></div>`);
  const tabs = $('.kbx-tabs', r), bk = $('.kbx-bk', r), sheet = $('.kbx-pk', r), em = $('.kbx-em', r);
  const mp = $('.kbx-mp', r), pm = $('.kbx-pm', r), am = $('.kbx-am', r), cm = $('.kbx-cm', r), fm = $('.kbx-fm', r), q = $('.kbx-q input', r), qx = $('.kbx-qx', r);
  const menuOpen = () => $$('.kbx-pop', r).some(p => p.classList.contains('open'));
  const narrow = () => !!$('.kbx-bar', r).getClientRects().length;

  /* ---------- filters ---------- */
  const filtering = () => !!(F.q || F.who.size || F.l.size || F.p.size);
  const shows = k => k.keep || ((!F.q || (k.t + ' ' + k.id + ' ' + (k.pj || '')).toLowerCase().includes(F.q.toLowerCase()))
    && (!F.who.size || k.who.some(w => F.who.has(w))) && (!F.l.size || k.l.some(x => F.l.has(x))) && (!F.p.size || F.p.has(k.p)));
  const visible = col => K.filter(k => k.c === col && shows(k));

  /* ---------- painting ---------- */
  // the cards are drawn again after each change; the ones that stay glide from where they were to where they are now
  let painted = false;
  function paint(o = {}){
    // a filter or a search: the cards that still match glide to their new places, ones that come back fade in and ones
    // filtered out fade where they were
    if (o.filter && painted){ reflow(() => $$('.kbx-k', wrap), () => paint({ flip:false }), { by:'data-id', root:box }); return; }
    const had = document.activeElement && box.contains(document.activeElement) && document.activeElement.closest('.kbx-k');
    const keep = had ? had.dataset.id : null;
    const first = !REDUCE && painted && o.flip !== false ? new Map($$('.kbx-k', wrap).map(el => [el.dataset.id, el.getBoundingClientRect()])) : null;
    let shown = 0;
    COLS.forEach(cl => {
      const col = $(`.kbx-c[data-col="${cl.k}"]`, wrap), L = visible(cl.k), all = K.filter(k => k.c === cl.k).length; shown += L.length;
      $('.kbx-list', col).innerHTML = L.map(card).join('') || (filtering() ? '' : '<div class="kbx-none">No cards</div>');
      // the count, or with a limit how full the column is, which turns into a warning once it is over
      const n = $('.kbx-ch .n', col), over = cl.lim && all > cl.lim;
      n.innerHTML = over ? `<span class="tag warn" data-tip="Over the limit of ${cl.lim}">${I('alert', 'xs')}${all}/${cl.lim}</span>` : `<span class="tag">${filtering() && L.length !== all ? `${L.length} of ${all}` : cl.lim ? `${all}/${cl.lim}` : all}</span>`;
      col.classList.toggle('shut', shut.has(cl.k)); col.classList.toggle('wip', !!over);
      const tg = $('.kbx-tg', col); tg.setAttribute('aria-expanded', !shut.has(cl.k)); tg.setAttribute('aria-label', (shut.has(cl.k) ? 'Open ' : 'Fold ') + cl.t); tg.dataset.tip = shut.has(cl.k) ? 'Open' : 'Fold';
      const tn = $(`[data-v="${cl.k}"] .n`, tabs); if (tn.textContent !== String(L.length)){ tn.textContent = L.length; if (painted) enter(tn); }
    });
    wrap.style.setProperty('--kbx-gt', COLS.map(cl => shut.has(cl.k) ? '40px' : 'minmax(0,1fr)').join(' '));
    // nothing matches: one note in the middle of the board
    em.hidden = !(filtering() && !shown);
    const total = K.length, cnt = $('.kbx-cnt', r); cnt.textContent = filtering() ? `${shown} of ${total} cards` : `${total} cards`;
    $('.kbx-ti span', r).textContent = `Sprint 14 · ${K.filter(k => k.c === 'done').length} of ${total} done`;
    chips(); bulk(); roving(keep);
    if (first) $$('.kbx-k', wrap).forEach(el => { const a = first.get(el.dataset.id); if (!a){ if (painted && o.enter !== false) enter(el); return; } const b = el.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top; if (Math.abs(dx) > 1 || Math.abs(dy) > 1) el.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:'none' }], { duration:420, easing:'cubic-bezier(.22,1,.36,1)' }); });
    if (peek) sheetPaint();
    painted = true;
  }
  // the filter chips say what they filter by; the facepile shows who is picked
  function chips(){
    const v = { who:[...F.who].map(w => M[w].n.split(' ')[0]), l:[...F.l], p:[...F.p].map(p => PRI[p]) };
    $$('.kbx-f', r).forEach(b => { const a = v[b.dataset.f]; b.classList.toggle('on', a.length > 0); $('.v', b).textContent = a.length ? (a.length > 1 ? a.length + ' picked' : a[0]) : ''; $('.k', b).textContent = { who:'Assignee', l:'Label', p:'Priority' }[b.dataset.f] + (a.length ? ':' : ''); });
    $$('.kbx-fp button', r).forEach(b => b.setAttribute('aria-pressed', F.who.has(b.dataset.who)));
    $('.kbx-fp', r).classList.toggle('some', F.who.size > 0);
    $('.kbx-clr', r).hidden = !filtering();
  }
  // the bar for picked cards, with the count
  function bulk(){
    [...sel].forEach(id => { if (!byId(id)) sel.delete(id); });
    const n = sel.size; box.classList.toggle('selecting', n > 0); bk.classList.toggle('on', n > 0); bk.inert = n === 0;
    if (n) $('.n', bk).textContent = n + ' selected';
  }
  // one card at a time is in the Tab order: the one last focused, or the first on show
  function roving(keep){
    const cards = $$('.kbx-k', wrap).filter(el => el.getClientRects().length);
    const to = cards.find(el => el.dataset.id === keep) || cards.find(el => el.dataset.id === foc) || cards[0];
    $$('.kbx-k', wrap).forEach(el => el.tabIndex = el === to ? 0 : -1);
    if (to) foc = to.dataset.id;
    if (keep && to && to.dataset.id === keep) to.focus({ preventScroll:true });
  }
  const cardEl = id => $(`.kbx-k[data-id="${id}"]`, wrap);
  const focusCard = (id, scroll = false) => { const el = cardEl(id); if (!el) return; foc = id; $$('.kbx-k', wrap).forEach(x => x.tabIndex = x === el ? 0 : -1); el.focus({ preventScroll:!scroll }); if (peek && peek !== id){ peek = id; sheetPaint(); markOpen(); } };
  const markOpen = () => $$('.kbx-k', wrap).forEach(el => el.classList.toggle('open', el.dataset.id === peek));

  /* ---------- moving cards ---------- */
  // to a column (at an index among its cards, or its end); a card in Done is no longer worked on
  function place(k, col, idx){
    K = K.filter(x => x !== k); const was = k.c; k.c = col; if (col === 'done') delete k.run;
    const same = K.filter(x => x.c === col), before = idx == null ? null : same[idx];
    before ? K.splice(K.indexOf(before), 0, k) : K.push(k);
    return was;
  }
  const colName = k => COLS.find(cl => cl.k === k).t;
  // a move that takes a column over its limit says so
  const limitNote = col => { const cl = COLS.find(x => x.k === col); return cl.lim && K.filter(k => k.c === col).length > cl.lim ? `, which is over its limit of ${cl.lim}` : ''; };
  function moveMany(ids, col){
    const ks = ids.map(byId).filter(Boolean).filter(k => k.c !== col); if (!ks.length) return;
    ks.forEach(k => place(k, col)); paint();
    say((ks.length === 1 ? `${ks[0].id} moved to ${colName(col)}` : `${ks.length} cards moved to ${colName(col)}`) + limitNote(col));
  }

  /* ---------- the narrow board's tabs ---------- */
  const segc = seg(tabs, v => show(v));
  function show(col){
    const was = cur; cur = col; $$('button', tabs).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === col)); segc.place();
    $$('.kbx-c', wrap).forEach(x => x.classList.toggle('on', x.dataset.col === col));
    if (was !== col && narrow() && view === 'board') enter($('.kbx-c.on', wrap));
    roving();
  }
  // what the person in the demo would do to follow the agent's card; once you take over, the board stays where you put it
  const follow = col => c.auto(0, () => show(col));

  /* ---------- the details sheet ---------- */
  function sheetPaint(){
    const k = byId(peek); if (!k){ closeSheet(); return; }
    const n = k.sub?.length || 0, d = done(k);
    sheet.setAttribute('aria-label', `${k.id} details`);
    sheet.innerHTML = `<div class="kbx-pk-h"><span class="kbx-id num">${k.id}</span><span class="kbx-sp"></span><button class="ib kbx-pk-x" aria-label="Close details" data-tip="Close" data-tip-k="Esc">${I('x', 'xs')}</button></div>`
      + `<div class="kbx-pk-t">${esc(k.t)}</div>`
      + (k.run != null ? `<div class="kbx-pk-ag"><div class="kbx-ag"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="s">Design agent: ${step(k)}</span><span class="pc num">${Math.round(k.run * 100)}%</span></div><div class="kbx-pr"><i style="width:${k.run * 100}%"></i></div></div>` : '')
      + `<div class="kbx-pk-rows">`
      + `<div class="kbx-pk-r"><span class="k">Status</span><button class="kbx-pv" data-pop=".kbx-mp" aria-haspopup="menu" aria-label="Status: ${colName(k.c)}">${colName(k.c)}${I('chev-d', 'xs')}</button></div>`
      + `<div class="kbx-pk-r"><span class="k">Priority</span><button class="kbx-pv" data-pop=".kbx-pm" aria-haspopup="menu" aria-label="Priority: ${PRI[k.p]}">${priV(k)}</button></div>`
      + `<div class="kbx-pk-r"><span class="k">Assignees</span><button class="kbx-pv" data-pop=".kbx-am" aria-haspopup="menu" aria-label="Assignees: ${names(k) || 'none'}">${whoV(k)}</button></div>`
      + (k.pj ? `<div class="kbx-pk-r"><span class="k">Project</span><span class="kbx-pv">${esc(k.pj)}</span></div>` : '')
      + (k.due != null ? `<div class="kbx-pk-r"><span class="k">Due</span><span class="kbx-pv${k.due < 0 && k.c !== 'done' ? ' late' : ''}">${I('cal', 'xs')}${fmt(k.due)}${k.due < 0 && k.c !== 'done' ? ', overdue' : ''}</span></div>` : '')
      + (k.l.length ? `<div class="kbx-pk-r"><span class="k">Labels</span><span class="kbx-tags">${k.l.map(ltag).join('')}</span></div>` : '')
      + `</div>`
      + (n ? `<div class="kbx-pk-s"><b>Subtasks</b><span class="num">${d}/${n}</span><span class="kbx-sb"><i style="width:${d / n * 100}%"></i></span></div><div class="kbx-pk-cl" role="group" aria-label="Subtasks">${k.sub.map((s, i) => `<button class="kbx-ci" role="checkbox" aria-checked="${s.d}" data-i="${i}"${k.run != null ? ' disabled' : ''}><span class="kbx-cb">${I('check', 'xs')}</span><span>${esc(s.t)}</span></button>`).join('')}</div>` : '')
      + `<div class="kbx-pk-f"><span class="kbx-mt">${I('comment', 'xs')}${k.cm || 'No'} comment${k.cm === 1 ? '' : 's'}</span><span class="kbx-mt">${I('clip', 'xs')}${k.at || 'No'} file${k.at === 1 ? '' : 's'}</span></div>`;
  }
  const names = k => k.who.map(w => M[w].n).join(', ');
  const priV = k => `${ptag(k.p)}${I('chev-d', 'xs')}`;
  const whoV = k => `${k.who.length ? `<span class="avs">${avs(k.who)}</span>${k.who.length > 1 ? k.who.length + ' people' : M[k.who[0]].n}` : 'Assign'}${I('chev-d', 'xs')}`;
  // a quick edit changes the card and the sheet where they are, so the menu it came from stays put
  function refresh(k){
    const el = cardEl(k.id);
    if (el){ const p = $('.kbx-pri', el), w = $('.kbx-who', el);
      p.className = priCls(k.p); p.textContent = PRI[k.p]; p.setAttribute('aria-label', `Priority: ${PRI[k.p]}`);
      w.innerHTML = k.who.length ? avs(k.who) : `<span class="none">${I('user', 'xs')}</span>`; w.setAttribute('aria-label', `Assignees: ${names(k) || 'none'}`); w.dataset.tip = names(k) || 'Assign';
      el.setAttribute('aria-label', label(k)); }
    if (peek === k.id){ const pv = $('.kbx-pv[data-pop=".kbx-pm"]', sheet), av = $('.kbx-pv[data-pop=".kbx-am"]', sheet);
      if (pv){ pv.innerHTML = priV(k); pv.setAttribute('aria-label', `Priority: ${PRI[k.p]}`); }
      if (av){ av.innerHTML = whoV(k); av.setAttribute('aria-label', `Assignees: ${names(k) || 'none'}`); } }
  }
  function openSheet(id){
    peek = id; sheetPaint(); markOpen(); sheet.inert = false; sheet.classList.add('on');
    say(`${id} details open`);
  }
  function closeSheet(back){
    const id = peek; peek = null; sheet.classList.remove('on'); sheet.inert = true; markOpen();
    if (back && id) focusCard(id);
  }

  /* ---------- adding and renaming ---------- */
  function rename(el, k, fresh){
    const t = $(':scope>.t', el); editing = true; t.contentEditable = 'true'; t.focus({ preventScroll:true }); document.getSelection().selectAllChildren(t);
    const was = k.t;
    t.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter'){ e.preventDefault(); t.blur(); } if (e.key === 'Escape'){ t.textContent = was; t.blur(); } };
    t.onblur = () => { editing = false; t.contentEditable = 'false'; k.t = t.textContent.trim() || (fresh ? 'New card' : was); t.textContent = k.t; el.setAttribute('aria-label', label(k)); if (peek === k.id) sheetPaint(); c.later(0, () => focusCard(k.id)); };
  }
  function add(col){
    const k = { id:'DES-' + next++, c:col, t:'New card', p:'none', l:[], who:[ME], keep:true };
    shut.delete(col); K.push(k); if (narrow()) show(col); paint();
    const el = cardEl(k.id); if (el) rename(el, k, true);
  }

  /* ---------- the pointer: drag to move, click to open, shift-click to pick ---------- */
  let swallow = false, clickT = 0;
  c.on(wrap, 'pointerdown', e => {
    const el = e.target.closest('.kbx-k'); if (!el || e.button || editing || e.target.closest('button')) return;
    const k = byId(el.dataset.id), rc = el.getBoundingClientRect(), ox = e.clientX - rc.left, oy = e.clientY - rc.top;
    let ghost = null, ph = null, moved = false, gw = 0;
    const move = ev => {
      if (!moved && Math.hypot(ev.clientX - e.clientX, ev.clientY - e.clientY) < 5) return;
      // the copy under the pointer is a card, in the list too, where it is as wide as a board's card
      if (!moved){ moved = true; dragging = true; ghost = el.cloneNode(true); ghost.classList.add('ghost'); ghost.classList.remove('sel', 'open'); ghost.removeAttribute('tabindex'); ghost.setAttribute('aria-hidden', 'true'); gw = view === 'list' ? Math.min(rc.width, 260) : rc.width; ghost.style.width = gw + 'px'; (document.querySelector('.v2-layer') || document.body).appendChild(ghost); el.classList.add('drag'); ph = html(`<div class="kbx-ph" style="height:${rc.height}px"></div>`); }
      ghost.style.left = ev.clientX - Math.min(ox, gw - 24) + 'px'; ghost.style.top = ev.clientY - (view === 'list' ? 16 : oy) + 'px';
      const col = document.elementsFromPoint(ev.clientX, ev.clientY).find(x => x.classList?.contains('kbx-c') && wrap.contains(x));
      $$('.kbx-c', wrap).forEach(x => x.classList.toggle('over', x === col));
      if (col){ const list = $('.kbx-list', col), sibs = $$('.kbx-k:not(.drag)', list); $('.kbx-none', list)?.remove(); const after = sibs.find(s => { const b = s.getBoundingClientRect(); return ev.clientY < b.top + b.height / 2; }); after ? list.insertBefore(ph, after) : list.appendChild(ph); }
    };
    const up = ev => { stop();
      dragging = false; if (!moved) return; swallow = true; c.later(0, () => { swallow = false; }); ghost.remove(); const col = ev.type === 'pointerup' && ph.isConnected ? ph.closest('.kbx-c') : null;
      // it lands before the card that follows the placeholder, or at the end of the column (after any a filter hides)
      if (col){ const list = $('.kbx-list', col), rest = [...list.children].filter(x => x === ph || (x.classList.contains('kbx-k') && !x.classList.contains('drag')));
        const nx = rest[rest.indexOf(ph) + 1], to = col.dataset.col, was = k.c;
        K = K.filter(x => x !== k); k.c = to; if (to === 'done') delete k.run;
        nx ? K.splice(K.indexOf(byId(nx.dataset.id)), 0, k) : K.push(k);
        if (was !== to) say(`${k.id} moved to ${colName(to)}` + limitNote(to)); }
      $$('.kbx-c', wrap).forEach(x => x.classList.remove('over')); ph.remove(); paint({ flip:false }); const n = cardEl(k.id); if (n && !REDUCE) n.animate([{ transform:'scale(1.04)' }, { transform:'none' }], { duration:350, easing:'cubic-bezier(.2,.8,.2,1)' }); };
    const stop = () => { document.removeEventListener('pointermove', move); document.removeEventListener('pointerup', up); document.removeEventListener('pointercancel', up); };
    document.addEventListener('pointermove', move); document.addEventListener('pointerup', up); document.addEventListener('pointercancel', up);
    c.offs.push(() => { stop(); ghost?.remove(); });
  });
  c.on(wrap, 'click', e => {
    if (swallow) return;
    const shutCol = e.target.closest('.kbx-c.shut'); if (shutCol && !e.target.closest('.kbx-cmn') && !box.classList.contains('list') && !narrow()){ shut.delete(shutCol.dataset.col); paint(); return; }
    const b = e.target.closest('button'), el = e.target.closest('.kbx-k');
    if (b && b.closest('.kbx-ch')){ const col = b.closest('.kbx-c').dataset.col;
      if (b.classList.contains('kbx-tg')){ shut.has(col) ? shut.delete(col) : shut.add(col); paint(); say(`${colName(col)} ${shut.has(col) ? 'folded' : 'open'}`); }
      else if (b.classList.contains('kbx-cadd')) add(col);
      else if (b.classList.contains('kbx-cmn')) colFor = col;
      return; }
    if (!el) return; const k = byId(el.dataset.id);
    // the card's own buttons say which card their menu is for, and what is picked in it now
    if (b){ menuFor = k.id; menuFrom = 'card';
      if (b.classList.contains('kbx-sel')){ toggle(k.id); return; }
      checks(k); return; }
    if (e.shiftKey || e.metaKey || e.ctrlKey){ toggle(k.id, e.shiftKey); return; }
    if (el.querySelector('.t[contenteditable="true"]')) return;
    // a click on the title waits a moment, in case it is the first of a double-click that renames the card
    clearTimeout(clickT);
    if (e.target.closest('.kbx-k>.t') && e.detail === 1){ clickT = setTimeout(() => open(k.id), 240); c.offs.push(() => clearTimeout(clickT)); return; }
    if (e.detail > 1) return;
    open(k.id);
  });
  const open = id => { foc = id; peek === id ? closeSheet() : openSheet(id); };
  c.on(wrap, 'dblclick', e => { const t = e.target.closest('.kbx-k>.t'); if (!t || editing) return; clearTimeout(clickT); const el = t.closest('.kbx-k'); rename(el, byId(el.dataset.id)); });
  // shift-click picks the cards between the last one picked and this one, in the same column; Cmd or Ctrl-click one card
  function toggle(id, range){
    const k = byId(id), a = anchor && byId(anchor);
    if (range && a && a.c === k.c && a.id !== id && sel.has(a.id)){
      const L = visible(k.c), i = L.indexOf(a), j = L.indexOf(k);
      L.slice(Math.min(i, j), Math.max(i, j) + 1).forEach(x => sel.add(x.id));
    } else sel.has(id) ? sel.delete(id) : sel.add(id);
    anchor = id; repick(); say(`${sel.size} selected`);
  }
  // picking changes only the cards' look, not the board, so nothing moves
  function repick(){
    $$('.kbx-k', wrap).forEach(el => { const on = sel.has(el.dataset.id); el.classList.toggle('sel', on); $('.kbx-sel', el).setAttribute('aria-checked', on); el.setAttribute('aria-label', label(byId(el.dataset.id))); });
    bulk();
  }
  // what each menu shows as picked, for the card it is opened for
  function checks(k){
    $$('.mi', mp).forEach(m => m.setAttribute('aria-checked', m.dataset.to === k.c));
    $$('.mi', pm).forEach(m => m.setAttribute('aria-checked', m.dataset.p === k.p));
    $$('.mi', am).forEach(m => m.setAttribute('aria-checked', k.who.includes(m.dataset.who)));
  }
  // the sheet's fields open the same menus, for the card it shows
  c.on(sheet, 'click', e => {
    const b = e.target.closest('button'); if (!b) return; const k = byId(peek); if (!k) return;
    if (b.classList.contains('kbx-pk-x')){ closeSheet(true); return; }
    if (b.classList.contains('kbx-ci')){ const s = k.sub[+b.dataset.i]; s.d = !s.d; b.setAttribute('aria-checked', s.d); const d = done(k), n = k.sub.length;
      $('.kbx-pk-s .num', sheet).textContent = `${d}/${n}`; $('.kbx-pk-s .kbx-sb i', sheet).style.width = d / n * 100 + '%';
      const el = cardEl(k.id); if (el){ $('.kbx-m', el).innerHTML = metaOf(k); } say(`${s.t} ${s.d ? 'done' : 'not done'}, ${d} of ${n}`); return; }
    if (b.dataset.pop){ menuFor = k.id; menuFrom = 'sheet'; checks(k); }
  });
  c.on(sheet, 'keydown', e => { if (e.key === 'Escape' && !menuOpen()){ e.stopPropagation(); closeSheet(true); } });

  /* ---------- the menus ---------- */
  // picked with the keyboard, the focus goes back to the card once it is in its new place
  const fromKeys = m => m.closest('.pop').contains(document.activeElement);
  const refocus = (id, kb, pop) => { if (kb) c.later(140, () => { const f = menuFrom === 'sheet' && peek === id && $(`.kbx-pv[data-pop="${pop}"]`, sheet); f ? f.focus({ preventScroll:true }) : focusCard(id); }); };
  $$('.mi', mp).forEach(m => m.onclick = () => { const k = byId(menuFor), kb = fromKeys(m); if (!k) return; if (k.c === m.dataset.to) return refocus(k.id, kb, '.kbx-mp'); place(k, m.dataset.to); paint(); say(`${k.id} moved to ${colName(m.dataset.to)}`); if (narrow() && !peek) show(m.dataset.to); refocus(k.id, kb, '.kbx-mp'); });
  $$('.mi', pm).forEach(m => m.onclick = () => { const k = byId(menuFor), kb = fromKeys(m); if (!k) return; k.p = m.dataset.p; refresh(k); say(`${k.id} priority ${PRI[k.p]}`); refocus(k.id, kb, '.kbx-pm'); });
  $$('.mi', am).forEach(m => m.onclick = () => { const k = byId(menuFor); if (!k) return; const w = m.dataset.who; k.who = k.who.includes(w) ? k.who.filter(x => x !== w) : MK.filter(x => x === w || k.who.includes(x)); m.setAttribute('aria-checked', k.who.includes(w)); refresh(k); say(`${M[w].n} ${k.who.includes(w) ? 'assigned to' : 'removed from'} ${k.id}`); });
  $$('.mi', cm).forEach(m => m.onclick = () => { const col = colFor; if (!col) return; const a = m.dataset.a;
    if (a === 'add') return add(col);
    if (a === 'fold'){ shut.add(col); paint(); return; }
    if (a === 'all'){ visible(col).forEach(k => sel.add(k.id)); repick(); say(`${sel.size} selected`); return; }
    const rank = a === 'pri' ? k => PK.indexOf(k.p) : k => k.due == null ? 1e3 : k.due;
    const L = K.filter(k => k.c === col).sort((x, y) => rank(x) - rank(y)); K = K.filter(k => k.c !== col); L.forEach(k => K.push(k)); paint(); say(`${colName(col)} sorted by ${a === 'pri' ? 'priority' : 'due date'}`); });
  // a filter menu lists its field's values with how many cards each has; picks stay open so you can pick several
  function fill(f){
    fmFor = f; const opts = f === 'who' ? MK : f === 'l' ? LABELS : PK, set = F[f];
    const n = v => K.filter(k => f === 'who' ? k.who.includes(v) : f === 'l' ? k.l.includes(v) : k.p === v).length;
    fm.setAttribute('aria-label', { who:'Assignee', l:'Label', p:'Priority' }[f]);
    fm.innerHTML = `<div class="ph">${{ who:'Assignee', l:'Label', p:'Priority' }[f]}</div>` + opts.map(v => `<button class="mi" role="menuitemcheckbox" aria-checked="${set.has(v)}" data-v="${v}">${f === 'who' ? `${AV(v, M[v].bg)}<span>${M[v].n}</span>` : f === 'p' ? ptag(v) : ltag(v)}<span class="r num">${n(v)}</span><span class="ck">${I('check', 'xs')}</span></button>`).join('');
    $$('.mi', fm).forEach(m => m.onclick = () => { const v = m.dataset.v; set.has(v) ? set.delete(v) : set.add(v); m.setAttribute('aria-checked', set.has(v)); refilter(); });
  }
  $$('.kbx-f', r).forEach(b => b.addEventListener('click', () => fill(b.dataset.f)));
  function refilter(){ K.forEach(k => delete k.keep); paint({ filter:true });const n = K.filter(shows).length; say(filtering() ? `${n} of ${K.length} cards shown` : `All ${K.length} cards shown`); }
  $$('.kbx-fp button', r).forEach(b => b.onclick = () => { const w = b.dataset.who; F.who.has(w) ? F.who.delete(w) : F.who.add(w); refilter(); });
  const clear = () => { F.q = ''; q.value = ''; qx.hidden = true; F.who.clear(); F.l.clear(); F.p.clear(); refilter(); };
  $('.kbx-clr', r).onclick = clear; $('.kbx-ec', r).onclick = () => { clear(); q.focus({ preventScroll:true }); };
  c.on(q, 'input', () => { F.q = q.value.trim(); qx.hidden = !q.value; refilter(); });
  c.on(q, 'keydown', e => { if (e.key === 'Escape' && q.value){ e.stopPropagation(); q.value = ''; F.q = ''; qx.hidden = true; refilter(); } });
  qx.onclick = () => { q.value = ''; F.q = ''; qx.hidden = true; refilter(); q.focus({ preventScroll:true }); };

  /* ---------- picked cards, moved together ---------- */
  $$('[data-to]', bk).forEach(b => b.onclick = () => { const ids = [...sel]; sel.clear(); anchor = null; moveMany(ids, b.dataset.to); });
  $('.kbx-bx', bk).onclick = () => { sel.clear(); anchor = null; repick(); say('Selection cleared'); roving(); $('.kbx-k[tabindex="0"]', wrap)?.focus({ preventScroll:true }); };

  /* ---------- Board or List ---------- */
  const vw = $('.kbx-vw', r);
  seg(vw, v => { if (v === view) return; const bar = $('.kbx-bar', r), h = wrap.getBoundingClientRect().height + (narrow() ? bar.offsetHeight + parseFloat(getComputedStyle(box).rowGap) : 0); view = v; box.classList.toggle('list', v === 'list');
    // the list keeps the board's height, so the component stays where it is in its stage
    wrap.style.minHeight = v === 'list' ? Math.round(h) + 'px' : ''; paint({ flip:false }); stagger($$('.kbx-k', wrap), 18); say(v === 'list' ? 'List view' : 'Board view'); });

  /* ---------- the keyboard ---------- */
  // arrows move between cards (up and down in a column, left and right across columns), Enter opens the details, Space
  // or x picks, m opens Move to, p the priority, a the assignees, Escape closes the details or clears what is picked
  c.on(wrap, 'keydown', e => {
    const el = e.target.closest('.kbx-k'); if (!el || editing || e.altKey || e.ctrlKey || e.metaKey) return;
    const k = byId(el.dataset.id), onCard = e.target === el, key = e.key;
    const nav = id => { if (!id) return; e.preventDefault(); focusCard(id, true); };
    if (key === 'ArrowUp' || key === 'ArrowDown' || key === 'Home' || key === 'End'){
      const L = view === 'list' ? COLS.filter(cl => !shut.has(cl.k)).flatMap(cl => visible(cl.k)) : visible(k.c), i = L.indexOf(k);
      const to = key === 'Home' ? L[0] : key === 'End' ? L[L.length - 1] : L[i + (key === 'ArrowUp' ? -1 : 1)];
      if (to && e.shiftKey && (key === 'ArrowUp' || key === 'ArrowDown')){ sel.add(k.id); sel.add(to.id); anchor = to.id; repick(); say(`${sel.size} selected`); }
      e.preventDefault(); if (to) focusCard(to.id, true); return;
    }
    if ((key === 'ArrowLeft' || key === 'ArrowRight') && view === 'board'){
      e.preventDefault(); const d = key === 'ArrowLeft' ? -1 : 1, i = visible(k.c).indexOf(k);
      if (narrow()){ const ci = COLS.findIndex(cl => cl.k === k.c) + d, cl = COLS[ci]; if (!cl) return; show(cl.k); const L = visible(cl.k); if (L.length) focusCard(L[Math.min(i, L.length - 1)].id, true); return; }
      for (let ci = COLS.findIndex(cl => cl.k === k.c) + d; ci >= 0 && ci < COLS.length; ci += d){ const cl = COLS[ci]; if (shut.has(cl.k)) continue; const L = visible(cl.k); if (L.length) return nav(L[Math.min(i, L.length - 1)].id); }
      return;
    }
    if (!onCard) return;
    if (key === 'Enter'){ e.preventDefault(); open(k.id); if (peek) c.later(0, () => $('.kbx-pk-x', sheet)?.focus({ preventScroll:true })); return; }
    if (key === ' ' || key === 'x'){ e.preventDefault(); toggle(k.id); return; }
    if (key === 'F2'){ e.preventDefault(); rename(el, k); return; }
    const btn = { m:'.kbx-mv', p:'.kbx-pri', a:'.kbx-who' }[key.toLowerCase()];
    if (btn){ e.preventDefault(); const b = $(btn, el), pp = $(b.dataset.pop, r); menuFor = k.id; menuFrom = 'card'; checks(k); b.click(); if (openPop && openPop.pop === pp){ openPop.mine = true; popFocus(pp, 'first'); } return; }
    if (key === 'Escape'){ if (peek){ e.preventDefault(); closeSheet(); } else if (sel.size){ e.preventDefault(); sel.clear(); anchor = null; repick(); say('Selection cleared'); } }
  });
  // the board keeps the last card you were on as its one stop in the Tab order
  c.on(wrap, 'focusin', e => { const el = e.target.closest('.kbx-k'); if (el && e.target === el){ foc = el.dataset.id; $$('.kbx-k', wrap).forEach(x => x.tabIndex = x === el ? 0 : -1); } });
  c.on(box, 'keydown', e => { if (e.key === 'Escape' && sel.size && !menuOpen() && !e.target.closest('.kbx-k,.kbx-q')){ sel.clear(); anchor = null; repick(); say('Selection cleared'); } });
  $('.kbx-add', r).onclick = () => add(cur);

  paint(); show(cur);

  /* ---------- the demo: the design agent works through its cards ---------- */
  // every 600ms the agent's card fills a little and ticks off its subtasks; at the end it goes to Done and the agent picks up
  // its next card. It holds while the pointer rests on the board, and stops for good once you take over
  const busy = () => dragging || editing || menuOpen() || c.mine;
  c.every(600, () => { if (busy()) return; const k = K.find(x => x.run != null); if (!k) return;
    k.run = Math.min(1, k.run + .08); const n = k.sub.length, d = Math.min(n, Math.floor(k.run * n + 1e-9)); k.sub.forEach((s, i) => s.d = i < d);
    const el = cardEl(k.id);
    if (el && k.run < 1){ $('.kbx-pr i', el).style.width = k.run * 100 + '%'; $('.kbx-ag .pc', el).textContent = Math.round(k.run * 100) + '%'; const s = $('.kbx-ag .s', el); if (s.textContent !== step(k)) swap(s, step(k)); $('.kbx-m', el).innerHTML = metaOf(k); if (peek === k.id) sheetPaint(); }
    if (k.run >= 1){ place(k, 'done'); follow('done'); paint(); say(`The design agent finished ${k.id}`);
      const nx = K.find(x => x.c === 'todo' && x.who.includes('DA')); if (nx){ c.later(900, function pick(){ if (busy()){ if (!c.mine) c.later(300, pick); return; } place(nx, 'doing', 0); nx.run = 0; paint(); say(`The design agent started ${nx.id}`); c.later(700, () => follow('doing')); }); } } });
});
/* ---------- Context menu ---------- */
DM.def('context-menu', (r, c) => {
  const ICON = { spark:'spark', copy:'copy', quote:'quote', pin:'pin', 'chev-r':'chev-r', bell:'bell', check:'check', trash:'trash', info:'info', list:'list', edit:'edit' };
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)\}/g, (m, k) => ICON[k] ? I(ICON[k], k === 'chev-r' || k === 'check' ? 'xs' : 's') : m);
  const root = $('.cxm', r), msg = $('.cxm-msg', r), tx = $('.cxm-tx', r), out = $('.cxm-out', r), note = $('.cxm-note', r);
  const pop = $('.cxm-pop', r), sub = $('.cxm-pop2', r), subRow = $('.cxm-sub', r), del = $('.cxm-del', r);
  const items = m => $$('.mi', m);
  let open = false, subOpen = false, opener = null, openedAt = 0;
  // where a menu goes: at the point, turned back from the right and bottom edges so it stays on screen and inside the card
  const fit = (m, x, y, { left } = {}) => {
    const rb = root.getBoundingClientRect(), card = (root.closest('.card,.comp,[data-c]') || document.body).getBoundingClientRect();
    const lo = Math.max(card.left, 0) + 8 - rb.left, hi = Math.min(card.right, innerWidth) - 8 - rb.left, w = m.offsetWidth, h = m.offsetHeight;
    if (x + w > hi && left != null) x = left - w; else if (x + w > hi) x = x - w;
    x = Math.max(lo, Math.min(x, hi - w));
    // near the foot of the screen it opens upward, but only where it fits over the component, so it never covers what is above
    const up = rb.top + y + h > innerHeight - 8 && y - h >= 0 && rb.top + y - h > 8; if (up) y -= h;
    m.style.left = x + 'px'; m.style.top = y + 'px'; m.style.setProperty('--origin', (up ? 'bottom ' : 'top ') + 'left');
  };
  const show = (m, on) => { m.classList.toggle('open', on); m.inert = !on; };
  function openAt(x, y, keyed){
    closeSub(); del.classList.remove('ask'); $('.t', del).textContent = 'Delete reply';
    open = true; openedAt = performance.now(); opener = document.activeElement; msg.classList.add('on'); show(pop, true); fit(pop, x, y);
    // opened by a person, the menu takes the focus on its first item; the demo leaves the focus where it is
    if (keyed) items(pop)[0].focus({ preventScroll:true });
  }
  function close(back){ if (!open) return; back = back && (pop.contains(document.activeElement) || sub.contains(document.activeElement)); open = false; closeSub(); show(pop, false); msg.classList.remove('on'); if (back) msg.focus({ preventScroll:true }); }
  // the submenu opens beside its row, on the right or else the left; where neither side has room (a phone) it drops under the row
  function openSub(focus){
    subOpen = true; subRow.setAttribute('aria-expanded', 'true'); show(sub, true);
    const p = pop.getBoundingClientRect(), b = subRow.getBoundingClientRect(), rb = root.getBoundingClientRect(), card = (root.closest('.card,.comp,[data-c]') || document.body).getBoundingClientRect(), w = sub.offsetWidth;
    const lo = Math.max(card.left, 0) + 8, hi = Math.min(card.right, innerWidth) - 8;
    if (p.right - 4 + w <= hi) fit(sub, p.right - rb.left - 4, b.top - rb.top - 6);
    else if (p.left + 4 - w >= lo) fit(sub, p.left - rb.left + 4 - w, b.top - rb.top - 6);
    else fit(sub, b.left - rb.left + 24, b.bottom - rb.top + 2);
    if (focus) items(sub)[0].focus({ preventScroll:true });
  }
  function closeSub(focus){ if (!subOpen) return; subOpen = false; subRow.setAttribute('aria-expanded', 'false'); show(sub, false); if (focus) subRow.focus({ preventScroll:true }); }
  show(pop, false); show(sub, false);
  // right-click, or a long press on a touch screen
  c.on(msg, 'contextmenu', e => { e.preventDefault(); if (open && performance.now() - openedAt < 600) return; const rb = root.getBoundingClientRect(); openAt(e.clientX - rb.left, e.clientY - rb.top, e.isTrusted && !e.button && e.detail === 0 ? false : e.isTrusted); });
  let press = 0;
  c.on(msg, 'pointerdown', e => { if (e.pointerType !== 'touch') return; const rb = root.getBoundingClientRect(), x = e.clientX - rb.left, y = e.clientY - rb.top; clearTimeout(press); press = setTimeout(() => openAt(x, y, true), 500); });
  ['pointerup', 'pointercancel', 'pointermove'].forEach(t => c.on(msg, t, e => { if (t !== 'pointermove' || Math.abs(e.movementX) + Math.abs(e.movementY) > 4) clearTimeout(press); }));
  // Shift+F10 or the Menu key on the reply opens it at the reply's corner
  c.on(msg, 'keydown', e => { if ((e.key === 'F10' && e.shiftKey) || e.key === 'ContextMenu'){ e.preventDefault(); const b = msg.getBoundingClientRect(), rb = root.getBoundingClientRect(); openAt(b.left - rb.left + 16, b.top - rb.top + 36, true); } });
  // a press anywhere else closes it
  c.on(document, 'pointerdown', e => { if (open && !pop.contains(e.target) && !sub.contains(e.target)) close(); }, true);
  // the submenu opens as the pointer rests on its row, and shuts when it moves to another row
  let hov = 0;
  c.on(pop, 'pointerover', e => { const it = e.target.closest('.mi'); if (!it) return; clearTimeout(hov); if (it === subRow){ if (!subOpen) hov = setTimeout(() => openSub(), 160); } else if (subOpen) hov = setTimeout(() => closeSub(), 200); });
  // the keys: up and down wrap, Home and End, a letter jumps to the next item starting with it, Right opens the submenu and Left
  // or Escape shuts it, Escape shuts the menu and gives the focus back to the reply, Tab shuts it
  const keys = (m, inSub) => c.on(m, 'keydown', e => {
    const its = items(m), i = its.indexOf(document.activeElement), k = e.key;
    let to = null;
    if (k === 'ArrowDown') to = its[(i + 1) % its.length]; else if (k === 'ArrowUp') to = its[(i - 1 + its.length) % its.length];
    else if (k === 'Home') to = its[0]; else if (k === 'End') to = its[its.length - 1];
    else if (k === 'ArrowRight' && !inSub && document.activeElement === subRow){ e.preventDefault(); openSub(true); return; }
    else if ((k === 'ArrowLeft' || k === 'Escape') && inSub){ e.preventDefault(); e.stopPropagation(); closeSub(true); return; }
    else if (k === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(true); return; }
    else if (k === 'Tab'){ close(); return; }
    else if (k.length === 1 && /\S/.test(k)){ const n = its.length, from = Math.max(i, 0); for (let j = 1; j <= n; j++){ const it = its[(from + j) % n]; if (it.textContent.trim().toLowerCase().startsWith(k.toLowerCase())){ to = it; break; } } }
    if (to){ e.preventDefault(); to.focus({ preventScroll:true }); if (!inSub && to !== subRow) closeSub(); }
  });
  keys(pop, false); keys(sub, true);
  // what each item does
  const say = t => { swap(note, t); };
  const words = t => t.split(' ').map((w, i, a) => `<span class="w" style="animation-delay:${i * 45}ms">${w}${i < a.length - 1 ? ' ' : ''}</span>`).join('');
  const ASK = {
    explain:['Explanation', 'info', 'On a phone the keyboard takes the lower half of the screen. The Continue button sits there, so people have to close the keyboard to find it, and many leave instead.'],
    sum:['Summary', 'list', 'Mobile shoppers drop at the address step because the keyboard hides Continue. Moving it up could win back about 300 orders a week.'],
    rewrite:['Shorter', 'edit', 'Mobile checkout loses people at the address step: the keyboard hides Continue. Move it up to win back about 300 orders a week.']
  };
  let asking = 0;
  const ask = k => c.run(async () => {
    const id = ++asking, [lab, ic, text] = ASK[k];
    out.innerHTML = `<div class="cxm-res"><span class="k">${I(ic,'xs')}<span class="shim">Writing a ${lab.toLowerCase()}</span></span><span class="b"></span></div>`; enter(out.firstElementChild);
    await c.wait(900); if (id !== asking) return;
    const k2 = $('.k span', out); k2.classList.remove('shim'); k2.textContent = lab;
    const b = $('.b', out), ws = text.split(' ');
    for (let i = 1; i <= ws.length; i++){ if (id !== asking) return; b.textContent = ws.slice(0, i).join(' '); await c.wait(55); }
  });
  let pinned = false;
  const act = it => {
    const a = it.dataset.a;
    if (a === 'ask'){ subOpen ? closeSub(true) : openSub(true); return; }
    if (a === 'follow'){ const on = it.getAttribute('aria-checked') !== 'true'; it.setAttribute('aria-checked', on); say(on ? 'You will hear about replies to this' : 'You will not hear about replies'); return; }
    // deleting asks again in the same row; the second press deletes, with Undo
    if (a === 'del'){
      if (!del.classList.contains('ask')){ del.classList.add('ask'); $('.t', del).textContent = 'Press again to delete'; del.setAttribute('aria-label', 'Delete reply: press again to confirm'); return; }
      close(); hold(root); const was = msg.innerHTML; msg.hidden = true;
      const g = html(`<div class="cxm-gone">Reply deleted<button class="pill ghost sm">Undo</button></div>`); root.insertBefore(g, note); enter(g); say('');
      $('button', g).onclick = () => { g.remove(); msg.hidden = false; msg.innerHTML = was; release(root); msg.focus({ preventScroll:true }); };
      return;
    }
    close(true);
    if (a === 'copy'){ try { navigator.clipboard.writeText(tx.textContent).catch(() => {}); } catch(e){} say('Copied to clipboard'); }
    if (a === 'quote') say('Quoted in your reply');
    if (a === 'pin'){ pinned = !pinned; $('.cxm-pin', r).hidden = !pinned; $('.t', $('[data-a="pin"]', pop)).textContent = pinned ? 'Unpin' : 'Pin to thread'; say(pinned ? 'Pinned to the thread' : 'Unpinned'); }
    if (ASK[a]) ask(a);
  };
  [pop, sub].forEach(m => c.on(m, 'click', e => { const it = e.target.closest('.mi'); if (it) act(it); }));
  // the preview's story: right-click the reply, ask the agent for a summary, and it streams in under the reply
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.point(tx); await s.beat(1);
    const h = $('.hand', c.st).getBoundingClientRect();
    tx.dispatchEvent(new MouseEvent('contextmenu', { bubbles:true, cancelable:true, clientX:h.left + 3, clientY:h.top + 2, button:2 }));
    await s.beat(2);
    await s.point(subRow, false); openSub(); await s.beat(2);
    await s.tap($('[data-a="sum"]', sub)); s.away();
    await s.until(() => !asking || ($('.b', out) && $('.b', out).textContent.length > 120)); await s.beat(6);
  });
});