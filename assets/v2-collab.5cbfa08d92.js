TPLS["context-menu"] = "<div class=\"cxm\">\n  <div class=\"cxm-msg panel\" tabindex=\"0\" aria-haspopup=\"menu\" aria-label=\"Agent reply. Press Shift+F10 for actions\">\n    <div class=\"cxm-hd\"><span class=\"cxm-av\"><svg class=\"i s\"><use href=\"#v2i-spark\"/></svg></span><span class=\"cxm-ht\"><b>Agent</b><span class=\"muted num\">2:14 pm</span></span><span class=\"cxm-ok\" hidden></span><span class=\"cxm-pin\" hidden><svg class=\"i s\"><use href=\"#v2i-pin\"/></svg>Pinned</span></div>\n    <p class=\"cxm-tx\">Most of the checkout drop-off is on mobile. 61% of the people who leave do it at the address step, where the keyboard covers the Continue button. Moving Continue above the keyboard should win back about 300 orders a week.</p>\n    <div class=\"cxm-out\" aria-live=\"polite\"></div>\n  </div>\n  <p class=\"cxm-note\" aria-live=\"polite\"></p>\n  <div class=\"pop cxm-pop\" role=\"menu\" aria-label=\"Reply actions\">\n    <button class=\"mi\" role=\"menuitem\" data-a=\"copy\">{copy}Copy text<span class=\"r\">⌘C</span></button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"quote\">{quote}Quote in reply<span class=\"r\">R</span></button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"pin\">{pin}<span class=\"t\">Pin to thread</span><span class=\"r\">P</span></button>\n    <div class=\"sep\" role=\"separator\"></div>\n    <button class=\"mi cxm-sub\" role=\"menuitem\" aria-haspopup=\"menu\" aria-expanded=\"false\" data-a=\"ask\">{spark}Ask the agent<span class=\"r\">{chev-r}</span></button>\n    <button class=\"mi\" role=\"menuitemcheckbox\" aria-checked=\"false\" data-a=\"follow\">{bell}Follow replies<span class=\"ck\">{check}</span></button>\n    <div class=\"sep\" role=\"separator\"></div>\n    <button class=\"mi cxm-del\" role=\"menuitem\" data-a=\"del\">{trash}<span class=\"t\">Delete reply</span><span class=\"r\">⌫</span></button>\n  </div>\n  <div class=\"pop cxm-pop2\" role=\"menu\" aria-label=\"Ask the agent\">\n    <button class=\"mi\" role=\"menuitem\" data-a=\"explain\">{info}Explain</button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"sum\">{list}Summarise</button>\n    <button class=\"mi\" role=\"menuitem\" data-a=\"rewrite\">{edit}Rewrite shorter</button>\n  </div>\n</div>";
TPLS["comments"] = "<div class=\"cmx panel\">\n  <div class=\"cmx-h\"><span class=\"cmx-pin\" aria-hidden=\"true\">1</span><b>Pricing, frame 2</b><span class=\"cmx-st num\"></span><button class=\"ib cmx-res\" aria-label=\"Resolve thread\" aria-pressed=\"false\" data-tip=\"Resolve thread\">{check}</button></div>\n  <div class=\"cmx-th\" aria-live=\"polite\"></div>\n  <div class=\"cmx-in\"><div class=\"cmx-box\"><input placeholder=\"Reply, or @agent to ask\" aria-label=\"Reply\" spellcheck=\"false\" autocomplete=\"off\"><button class=\"cmx-go\" aria-label=\"Send\" disabled>{up}</button></div><div class=\"pop cmx-men\" role=\"listbox\"></div></div>\n</div>";
TPLS["banner"] = "<div class=\"dm bnx-dm\"><div class=\"dm-main bnx-slot\">\n  <div class=\"bnx\" role=\"region\" data-tone=\"accent\" data-art=\"layers\" aria-label=\"Announcement\">\n    <div class=\"bnx-art\" aria-hidden=\"true\"></div>\n    <div class=\"bnx-tx\">\n      <span class=\"bnx-eb\"><span>New</span></span>\n      <p class=\"bnx-t\"><span>Memory that carries across threads</span></p>\n      <p class=\"bnx-d\"><span>Agents keep what they learn about your project, so you only explain things once.</span></p>\n      <div class=\"bnx-acts\"><button class=\"pill primary sm bnx-go\"><span>Turn on memory</span></button><button class=\"bnx-lk\"><span>What it keeps</span></button></div>\n    </div>\n  </div>\n</div>\n<div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Banner style\"><button aria-pressed=\"true\" data-v=\"0\">Accent</button><button aria-pressed=\"false\" data-v=\"1\">Violet</button><button aria-pressed=\"false\" data-v=\"2\">Green</button><button aria-pressed=\"false\" data-v=\"3\">Warning</button></div></div>\n</div>";

/* ---------- Comments ---------- */
DM.def('comments', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{check}', I('check','xs')).replace('{up}', I('up','xs'));
  const root = $('.cmx', r), th = $('.cmx-th', r), inp = $('.cmx-box input', r), go = $('.cmx-go', r), men = $('.cmx-men', r), st = $('.cmx-st', r), rs = $('.cmx-res', r);
  const P = { MK:['Maya Kim','var(--av-l)','MK-g03'], JO:['Jon Ortiz','var(--av-m)','JO-g01'], DA:['Design agent','var(--av-b)'] };
  const esc = t => t.replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[ch]);
  const fmt = t => esc(t).replace(/@(agent|maya|jon)\b/gi, m => `<span class="m">${m}</span>`);
  // the first comment starts the thread; every later one is a reply, indented on a thin line under it
  let rp = null;
  // the head says nothing the thread below already shows (owner, 19 Nov: no count of the replies); once the thread is
  // resolved, a green Resolved chip says so
  const count = () => { const d = root.classList.contains('done'), had = !!st.firstChild; if (d === had) return; st.innerHTML = d ? '<span class="tag ok">Resolved</span>' : ''; if (d) enter(st.firstChild); };
  function add(who, t, when, ag, agreed = 0){
    const el = html(`<div class="cmx-c${ag ? ' ag' : ''}">${AV(who, P[who][1], P[who][2])}<div class="b"><div class="n"><b>${P[who][0]}</b><span class="t">${when}</span><div class="cmx-tools"><button class="ib cmx-rx" aria-label="Agree" aria-pressed="false" data-tip="Agree">${I('up-thumb','xs')}</button></div></div><div class="tx">${ag ? '' : fmt(t)}</div><div class="cmx-rs"><button class="cmx-rc" aria-pressed="false" hidden>${I('up-thumb','xs')}<span class="num"></span></button></div></div></div>`);
    el._agree = { n:agreed, mine:false }; agree(el);
    $('.cmx-rx', el).onclick = () => agree(el, true); $('.cmx-rc', el).onclick = () => agree(el, true);
    // (once the thread grows with what it holds, its comments live in grow()'s wrapper)
    const box = $(':scope>.dm-grow', th) || th;
    if (!box.firstElementChild) box.appendChild(el);
    else { if (!rp){ rp = html('<div class="cmx-rp" role="group" aria-label="Replies"></div>'); box.appendChild(rp); } rp.appendChild(el); }
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
    if (m){ const list = opts.filter(o => o[1].startsWith(m[1].toLowerCase())); men.innerHTML = list.map(o => `<button class="mi" role="option" tabindex="-1" id="${men.id}-${o[1]}" data-h="${o[1]}">${AV(o[0], P[o[0]][1], P[o[0]][2]).replace('class="av" style="', 'class="av" style="width:20px;height:20px;font-size:9px;')}<span>${o[2]}<span class="d">@${o[1]}</span></span></button>`).join(''); men.classList.toggle('open', list.length > 0); inp.setAttribute('aria-expanded', list.length > 0); light(0);
      $$('.mi', men).forEach(b => b.onmousedown = e => { e.preventDefault(); inp.value = inp.value.replace(/@\w*$/, '@' + b.dataset.h + ' '); shut(); go.disabled = false; inp.focus({ preventScroll:true }); }); }
    else shut(); };
  // with the mention list open, the up and down arrows move through it and wrap, Enter picks, and Escape closes it
  inp.onkeydown = e => {
    const open = men.classList.contains('open') && mens().length;
    if (open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')){ e.preventDefault(); light(hl + (e.key === 'ArrowDown' ? 1 : -1)); return; }
    if (e.key === 'Enter'){ const f = mens()[hl]; if (open && f){ f.onmousedown(e); } else send(); }
    if (e.key === 'Escape') shut(); };
  go.onclick = send;
  // Resolve turns the pin green, says Resolved and folds the reply field away; the thread keeps its colours. Pressed again
  // it reopens
  rs.onclick = () => { const d = root.classList.toggle('done'); hideTip(); rs.innerHTML = I(d ? 'undo' : 'check', 'xs'); rs.setAttribute('aria-pressed', d); rs.dataset.tip = d ? 'Reopen thread' : 'Resolve thread'; count(); };
  // no room is kept for what is to come: the thread eases taller as replies arrive and the agent's words stream in (grow()),
  // and the reply field under it glides down with it, never cut; the card follows, centred in its stage. grow() starts once the
  // card's entrance (which scales it) has ended, so it measures the thread at its real size
  Promise.resolve().then(() => Promise.all(root.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && th.isConnected) c.offs.push(grow(th)); });
  // the preview asks the agent in the thread on its own; clicking, focusing or typing in it takes over, and what it had
  // typed goes. The agent replying is an agent at work (DM.PLAYS): it carries on under the pointer, while the person's own
  // typing and sending wait for a mouse resting on the thread to leave, so nothing moves under it
  const free = async () => { while (r.matches(':hover')) await c.step(200); };
  c.auto(1000, () => c.run(async () => { await free(); await c.type(inp, '@agent can you keep it outlined but darker?', { ms:28, each:() => inp.oninput(), keep:true }); shut(); await c.step(300); await free(); send(); }));
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
    { tone:'warning', art:'path', eb:'Heads-up', t:'Maintenance on Sunday, 02:00 UTC', d:'Agents pause for about an hour, and queued runs pick up where they left off.', a:'Add to calendar', s:'Status page' }
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
/* ---------- Context menu ---------- */
DM.def('context-menu', (r, c) => {
  const ICON = { spark:'spark', copy:'copy', quote:'quote', pin:'pin', 'chev-r':'chev-r', bell:'bell', check:'check', trash:'trash', info:'info', list:'list', edit:'edit' };
  r.innerHTML = r.innerHTML.replace(/\{([\w-]+)\}/g, (m, k) => ICON[k] ? I(ICON[k], k === 'chev-r' || k === 'check' ? 'xs' : 's') : m);
  const root = $('.cxm', r), msg = $('.cxm-msg', r), tx = $('.cxm-tx', r), out = $('.cxm-out', r), note = $('.cxm-note', r);
  const pop = $('.cxm-pop', r), sub = $('.cxm-pop2', r), subRow = $('.cxm-sub', r), del = $('.cxm-del', r);
  const items = m => $$('.mi', m);
  let open = false, subOpen = false, opener = null, openedAt = 0;
  // the room a menu has across: the demo's stage where there is one, else the screen (owner, 28 Nov: measured against the stage
  // or the viewport, not the narrow card, so the submenu has room beside its row)
  const span = () => { const st = root.closest('.stage-inner,.stage'), b = st ? st.getBoundingClientRect() : { left:0, right:innerWidth };
    return { lo:Math.max(b.left, 0) + 8, hi:Math.min(b.right, innerWidth) - 8 }; };
  // where a menu goes: at the point, turned back from the right and bottom edges so it stays on screen and inside its stage
  const fit = (m, x, y, { left } = {}) => {
    const rb = root.getBoundingClientRect(), sp = span();
    const lo = sp.lo - rb.left, hi = sp.hi - rb.left, w = m.offsetWidth, h = m.offsetHeight;
    if (x + w > hi && left != null) x = left - w; else if (x + w > hi) x = x - w;
    x = Math.max(lo, Math.min(x, hi - w));
    // short of room below (the screen's foot, a box that would cut it off, or the end of the demo's stage, past which it would
    // cover the card's words), it opens upward from the point; where neither way fits, it moves up just enough to end inside
    // the room, so it is never cut off
    const room = popRoom(root), st = root.closest('.stage-inner'), sr = st && st.getBoundingClientRect();
    if (sr){ room.top = Math.max(room.top, sr.top); room.bottom = Math.min(room.bottom, sr.bottom); }
    const top = room.top + 8 - rb.top, bottom = room.bottom - 8 - rb.top;
    let up = false;
    if (y + h > bottom){ if (y - h >= top){ y -= h; up = true; } else y = Math.max(top, bottom - h); }
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
  // on a wide screen the submenu opens beside its row (the row has the chevron), on the right or else the left, its first item
  // level with the row; only on a phone, or where neither side has room, does it drop under the row
  function openSub(focus){
    subOpen = true; subRow.setAttribute('aria-expanded', 'true'); show(sub, true);
    const p = pop.getBoundingClientRect(), b = subRow.getBoundingClientRect(), rb = root.getBoundingClientRect(), w = sub.offsetWidth, { lo, hi } = span();
    const cs = getComputedStyle(sub), top = b.top - rb.top - parseFloat(cs.paddingTop) - parseFloat(cs.borderTopWidth), wide = innerWidth >= 640;
    if (wide && p.right - 4 + w <= hi) fit(sub, p.right - rb.left - 4, top);
    else if (wide && p.left + 4 - w >= lo) fit(sub, p.left - rb.left + 4 - w, top);
    else fit(sub, b.left - rb.left + 24, b.bottom - rb.top + 2);
    if (focus) items(sub)[0].focus({ preventScroll:true });
  }
  function closeSub(focus){ if (!subOpen) return; subOpen = false; subRow.setAttribute('aria-expanded', 'false'); show(sub, false); if (focus) subRow.focus({ preventScroll:true }); }
  show(pop, false); show(sub, false);
  // the card grows to hold what the agent writes, and shrinks to the Undo row, eased (grow()); the menus open over it
  c.offs.push(grow(root));
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
  // what each item does. What it did is said to screen readers, and shows for a moment on the reply's head line with a green
  // tick; a pin shows its own Pinned, and Ask the agent its answer
  let okT = 0;
  const say = (t, show = true) => {
    note.textContent = t || '';
    const ok = $('.cxm-ok', r); if (!ok) return;
    clearTimeout(okT);
    if (!t || !show){ ok.hidden = true; return; }
    ok.innerHTML = `${I('check','xs')}<span>${t}</span>`; ok.hidden = false; ok.classList.remove('out');
    okT = setTimeout(() => { ok.classList.add('out'); okT = setTimeout(() => { ok.hidden = true; }, 240); }, 2400);
  };
  c.offs.push(() => clearTimeout(okT));
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
    if (a === 'follow'){ const on = it.getAttribute('aria-checked') !== 'true'; it.setAttribute('aria-checked', on); say(on ? 'Following replies' : 'Not following replies'); return; }
    // deleting asks again in the same row; the second press deletes, with Undo
    if (a === 'del'){
      if (!del.classList.contains('ask')){ del.classList.add('ask'); $('.t', del).textContent = 'Press again to delete'; del.setAttribute('aria-label', 'Delete reply: press again to confirm'); return; }
      // the card shrinks to the Undo row smoothly (grow()), and Undo brings the same reply back
      close(); say(''); msg.hidden = true;
      const g = html(`<div class="cxm-gone">Reply deleted<button class="pill ghost sm">Undo</button></div>`); note.before(g); enter(g); note.textContent = 'Reply deleted';
      $('button', g).onclick = () => { g.remove(); msg.hidden = false; note.textContent = 'Reply restored'; msg.focus({ preventScroll:true }); };
      return;
    }
    close(true);
    if (a === 'copy'){ try { navigator.clipboard.writeText(tx.textContent).catch(() => {}); } catch(e){} say('Copied'); }
    if (a === 'quote') say('Quoted in your reply');
    if (a === 'pin'){ pinned = !pinned; $('.cxm-pin', r).hidden = !pinned; $('.t', $('[data-a="pin"]', pop)).textContent = pinned ? 'Unpin' : 'Pin to thread'; say(pinned ? 'Pinned to the thread' : 'Unpinned', false); }
    if (ASK[a]){ say(''); ask(a); }
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