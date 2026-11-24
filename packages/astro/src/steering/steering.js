// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, html, swap } from '../core/core.js';
DM.def('steering', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{up}', I('up','xs'));
  // the run: four steps on the pricing page. A card step paints its card in the current accent, and remembers which,
  // so a change of mind can find the cards that already have the old one
  const S = [
    { id:'read', t:'Read Pricing v4', d:'3 frames, 14 layers', s:'done' },
    { id:'pro', card:'Pro', t:'Update the Pro card', s:'run', ms:7500 },
    { id:'team', card:'Team', t:'Update the Team card', d:'Pricing v4, frame 3', s:'queued', ms:3500 },
    { id:'ship', t:'Export to staging', d:'designme.studio/pricing', s:'queued', ms:2500 }
  ];
  const steps = $('.ste-steps', r), log = $('.ste-log', r), box = $('.ste-box', r), inp = $('input', box), go = $('.ste-go', r), st = $('.ste-st', r), mode = $('.m', st), ck = $('.ck', st);
  let hue = 'violet', ended = false, running = false;
  const queue = [];
  const G = { run:'<span class="spin"></span>', done:I('ok','xs'), queued:'<span class="dot"></span>' };
  const doing = x => x.card ? `Setting the accent to ${hue}` : x.d;
  function row(x){
    x.el = html(`<li class="ste-s ${x.s}"><span class="ste-g">${G[x.s]}</span><span class="ste-t"><b>${x.t}</b><span>${x.s === 'run' ? doing(x) : x.d || 'Pricing v4, frame 2'}</span></span>${x.mine ? '<span class="tag b">From you</span>' : ''}</li>`);
    return x.el;
  }
  S.forEach(x => steps.appendChild(row(x)));
  function set(x, s, d){ x.s = s; x.el.className = 'ste-s ' + s; const g = $('.ste-g', x.el); g.innerHTML = G[s]; enter(g); if (d) swap($('.ste-t span', x.el), d); }
  const where = () => { const i = S.findIndex(x => x.s === 'run'); swap(mode, ended ? 'Done' : `Step ${i + 1} of ${S.length}`); };
  // the clock runs until the last step is done
  const t0 = performance.now(); let tEnd = 0;
  const clock = () => { const s = Math.floor(((tEnd || performance.now()) - t0) / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  c.every(250, () => { ck.textContent = clock(); });
  // a message waits for the step in progress, then the agent takes it up before the next one
  const ready = () => { go.disabled = ended || !inp.value.trim(); };
  inp.oninput = ready;
  c.on(box, 'submit', e => {
    e.preventDefault(); const text = inp.value.trim(); if (!text || ended) return;
    inp.value = ''; ready();
    const m = html(`<div class="ste-me"><p></p><span class="ste-q"><span class="spin"></span>Applies after this step</span></div>`);
    $('p', m).textContent = text; log.appendChild(m); enter(m);
    queue.push({ text, el:m });
    if (!running) apply();
  });
  // what the agent says back, with buttons when it needs you to choose
  function say(text, warn, acts){
    const a = html(`<div class="ste-ag${warn ? ' warn' : ''}">${warn ? I('alert','xs') : I('spark','xs')}<div class="t"><p></p>${acts ? '<div class="ste-acts"></div>' : ''}</div></div>`);
    $('p', a).textContent = text; log.appendChild(a); enter(a);
    if (acts) acts.forEach(([label, ink, fn]) => { const b = html(`<button class="pill sm ${ink ? 'primary' : 'ghost'}">${label}</button>`); b.onclick = () => { $('.ste-acts', a).replaceWith(html(`<span class="muted">${fn()}</span>`)); a.classList.remove('warn'); a.firstElementChild.outerHTML = I('spark','xs'); }; $('.ste-acts', a).appendChild(b); });
  }
  function apply(){
    while (queue.length){
      const q = queue.shift(), tag = $('.ste-q', q.el);
      tag.innerHTML = I('check','xs') + (S.some(x => x.s !== 'done') ? 'Applied' : 'Noted'); enter(tag);
      const left = S.some(x => x.s !== 'done');
      if (!left){ say("The run had finished, so I'll keep this for the next one."); continue; }
      if (!/blue|accent|library/i.test(q.text)){ say("Got it. I'll follow that from the next step."); continue; }
      // a change of accent: what's still to come uses it, and a card already painted the old way is offered a redo
      hue = 'library blue';
      const old = S.filter(x => x.card && x.s === 'done' && x.hue === 'violet' && !S.some(y => y.redo === x.id));
      const run = S.find(x => x.s === 'run'); if (run && run.card) swap($('.ste-t span', run.el), doing(run));
      if (!old.length){ say('Got it. From here the accent is color.accent.500 from the library.'); continue; }
      const names = old.map(x => x.card).join(' and ');
      say(`Got it. From here the accent is color.accent.500. The ${names} card${old.length > 1 ? 's are' : ' is'} already violet.`, true, [
        ['Leave it', false, () => `Kept the ${names} card as it is`],
        [`Redo the ${names} card${old.length > 1 ? 's' : ''}`, true, () => { old.forEach(redo); return `Added a step to redo the ${names} card${old.length > 1 ? 's' : ''}`; }]
      ]);
    }
  }
  // a redo goes in before the export if the export hasn't started, otherwise at the end
  function redo(x){
    const n = { id:'redo-' + x.id, redo:x.id, card:x.card, mine:true, t:`Redo the ${x.card} card`, d:'Accent to library blue', s:'queued', ms:2000 };
    const ship = S.find(y => y.id === 'ship'), at = ship.s === 'queued' ? S.indexOf(ship) : S.length;
    S.splice(at, 0, n); steps.insertBefore(row(n), S[at + 1] ? S[at + 1].el : null);
    const li = n.el; li.style.height = '0px'; li.style.minHeight = '0px'; li.style.overflow = 'hidden'; li.style.opacity = '0';
    requestAnimationFrame(() => { li.style.transition = 'height .4s var(--dm-ease),min-height .4s var(--dm-ease),opacity .4s'; li.style.height = '44px'; li.style.minHeight = '44px'; li.style.opacity = '1'; c.later(450, () => { li.removeAttribute('style'); }); });
    if (ended){ ended = false; tEnd = 0; $('.ste-sum', r)?.remove(); inp.disabled = false; inp.placeholder = 'Steer the agent while it works'; ready(); c.run(work); }
    where();
  }
  // the agent works through the steps; between two steps it takes up what you sent
  async function work(){
    running = true;
    for (let x = S.find(y => y.s === 'run' || y.s === 'queued'); x; x = S.find(y => y.s === 'run' || y.s === 'queued')){
      if (x.s !== 'run') set(x, 'run', doing(x));
      where();
      await c.wait(x.ms);
      if (x.card) x.hue = hue;
      set(x, 'done', x.card ? (x.hue === 'violet' ? 'Accent set to violet' : 'Accent set to library blue') : x.id === 'ship' ? 'Live on designme.studio/pricing' : x.d);
      apply();
    }
    running = false; ended = true; tEnd = performance.now(); where();
    inp.disabled = true; inp.placeholder = 'The run has finished'; ready();
    const n = $$('.ste-me', r).length;
    $('.ste-sum', r)?.remove();
    const sum = html(`<div class="ste-sum">${I('ok','xs')}<span>Done in ${clock()}${n ? ` · ${n} change${n > 1 ? 's' : ''} from you` : ''}</span></div>`);
    log.appendChild(sum); enter(sum);
  }
  c.run(work);
  // the preview's story: read what the agent is doing, tell it to use the library's blue, and have it redo the card
  // that was already violet
  c.story(async s => {
    await s.beat(2);
    await s.point($('.ste-t span', S[1].el), false); await s.beat(1);
    await s.tap(inp);
    // typed a few letters at a time, so a busy page (few, longer timers) types it as fast as a quiet one
    const msg = 'Use our library blue, not violet';
    await s.type(inp, msg.match(/.{1,3}/g), { n:.15, each:ready, keep:true });
    await s.beat(1); await s.tap(go); s.away();
    await s.until(() => $('.ste-acts .primary', r)); await s.beat(3);
    await s.tap($('.ste-acts .primary', r)); s.away();
    await s.until(() => ended); await s.beat(2);
  });
});
