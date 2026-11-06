// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, hold, html, swap } from '../core/core.js';
DM.def('agent-lanes', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{users}', I('users')).replace('{pause}', I('pause','xs'));
  // each agent has a hue of its own (t names the palette slot): its badge, its track, its tag and its stretch of the relay line
  const L = [
    { n:'Researcher', ic:'search', t:'pb', acts:['Reading competitor sites','Comparing 5 pricing pages','Writing the brief'], log:['Read stripe.com/pricing','Read linear.app/pricing','Noted 3 patterns'] },
    { n:'Designer', ic:'palette', t:'pl', wait:'Waiting for the brief', acts:['Laying out pricing cards','Setting type and spacing','Exporting frames'], log:['Made 3 card variants','Applied spacing tokens','Exported 4 frames'] },
    { n:'Reviewer', ic:'eye', t:'pm', wait:'Waiting for the designer', acts:['Checking contrast','Checking copy','Signing off'], log:['Contrast passes AA','Fixed 2 lines of copy','Approved'] }
  ];
  const root = $('.aln', r), rows = $('.aln-rows', r), ct = $('.aln-ct', r), STEPS = L.length * 3;
  L.forEach(l => {
    l.el = html(`<div class="aln-lane" data-s="queued" style="--dm-c:var(--dm-${l.t});--dm-cb:var(--dm-${l.t}-bg);--dm-cm:var(--dm-aln-${l.t},var(--dm-${l.t}))"><button class="aln-row" aria-expanded="false"><span class="aln-av">${I(l.ic)}</span><span class="aln-who"><span class="aln-n">${l.n}</span><span class="aln-a">${l.wait || 'Queued'}</span></span><span class="aln-tr" aria-hidden="true"><i></i><i></i><i></i></span><span class="aln-st"><span class="tag">Queued</span></span></button><div class="fold shut"><div><div class="aln-det"></div></div></div></div>`);
    rows.appendChild(l.el); const b = $('.aln-row', l.el), f = $('.fold', l.el);
    b.onclick = () => { const s = f.classList.toggle('shut'); b.setAttribute('aria-expanded', !s); };
  });
  const TAG = { queued:'<span class="tag">Queued</span>', waiting:`<span class="tag">${I('clock','xs')}Waiting</span>`, working:'<span class="tag aln-tg"><span class="spin"></span>Working</span>', paused:'<span class="tag warn">Paused</span>', done:`<span class="tag ok">${I('check','xs')}Done</span>` };
  const state = (l, s) => { l.el.dataset.s = s; const t = $('.aln-st', l.el); t.innerHTML = TAG[s]; enter(t.firstElementChild); };
  const act = (l, t, live) => { const a = $('.aln-a', l.el); a.classList.toggle('live', !!live); a.classList.toggle('shim', !!live); swap(a, t); };
  let paused = false, secs = 0, finished = false, steps = 0;
  const count = () => swap(ct, `${steps} of ${STEPS} steps`);
  const pb = $('.aln-pause', r);
  pb.onclick = () => { paused = !paused; pb.innerHTML = I(paused ? 'play' : 'pause','xs') + (paused ? 'Resume' : 'Pause all'); swap($('.aln-t', r), paused ? 'All agents paused' : '3 agents working');
    L.forEach(l => { if (l.running){ state(l, paused ? 'paused' : 'working'); $('.aln-a', l.el).classList.toggle('shim', !paused); } }); };
  c.every(1000, () => { if (!paused && !finished){ secs++; $('.aln-m', r).textContent = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'); } });
  // time only passes for the agents while they aren't paused; each() hears how far through the wait they are
  const hold = async (ms, each) => { let t = 0; while (t < ms){ await c.wait(100); if (!paused){ t += 100; each && each(t / ms); } } };
  async function work(l){
    l.running = true; state(l, 'working');
    const bars = $$('.aln-tr i', l.el), det = $('.aln-det', l.el);
    for (let i = 0; i < 3; i++){
      bars[i].classList.add('run'); act(l, l.acts[i], true);
      await hold(1500, p => bars[i].style.setProperty('--dm-p', p.toFixed(3)));
      bars[i].classList.replace('run', 'on'); steps++; count();
      const d = html(`<div><span>${l.log[i]}</span><span class="muted">${secs}s</span></div>`); det.appendChild(d); enter(d);
    }
    l.running = false; act(l, l.log[2]); state(l, 'done');
  }
  // the relay line draws itself from one badge down to the next, the badge it reaches rings, and the stroke stays as the lit
  // stretch: one line from badge to badge that follows them as the hand-off line opens and shuts (the grey under it steps aside)
  const links = [];
  const place = k => { const rr = rows.getBoundingClientRect(), a = $('.aln-av', k.from.el).getBoundingClientRect(), b = $('.aln-av', k.to.el).getBoundingClientRect();
    const y0 = a.bottom - rr.top + 4, y1 = b.top - rr.top - 4; k.pk.style.top = y0 + 'px'; k.pk.style.height = Math.max(0, y1 - y0) + 'px'; };
  const ro = new ResizeObserver(() => links.forEach(place)); ro.observe(rows); c.offs.push(() => ro.disconnect());
  function carry(from, to){
    const k = { from, to, pk:html(`<span class="aln-pk" aria-hidden="true" style="--dm-from:var(--dm-aln-${from.t},var(--dm-${from.t}));--dm-to:var(--dm-aln-${to.t},var(--dm-${to.t}))"></span>`) };
    rows.appendChild(k.pk); links.push(k); place(k);
    const an = REDUCE ? null : k.pk.animate([{ transform:'scaleY(0)' }, { transform:'scaleY(1)' }], { duration:800, easing:'cubic-bezier(.65,0,.35,1)' });
    return an ? an.finished.catch(() => {}) : Promise.resolve();
  }
  async function handoff(from, to, txt){
    const h = html(`<div class="fold shut aln-hf" style="--dm-from:var(--dm-${from.t});--dm-to:var(--dm-${to.t})"><div><div class="aln-hand"><b class="f">${from.n}</b> handed ${txt} to <b class="t">${to.n}</b></div></div></div>`);
    to.el.before(h); void h.offsetWidth; h.classList.remove('shut'); enter($('.aln-hand', h), 80);
    await c.wait(REDUCE ? 0 : 500); await carry(from, to);
    from.el.classList.add('sent'); h.classList.add('lit'); to.el.classList.add('got');
    const av = $('.aln-av', to.el); av.classList.add('ping'); c.later(950, () => av.classList.remove('ping'));
    await c.wait(1300); h.classList.add('shut'); await c.wait(REDUCE ? 0 : 700); h.remove();
  }
  c.run(async () => {
    await c.wait(600);
    const r1 = work(L[0]); act(L[1], L[1].wait); state(L[1], 'waiting');
    await r1; await handoff(L[0], L[1], 'the brief');
    act(L[2], L[2].wait); state(L[2], 'waiting');
    await work(L[1]); await handoff(L[1], L[2], '4 frames');
    await work(L[2]);
    finished = true; root.classList.add('fin'); $('.aln-ic', r).innerHTML = I('ok'); enter($('.aln-ic', r).firstElementChild);
    swap($('.aln-t', r), 'All 3 agents finished'); pb.remove();
  });
});
