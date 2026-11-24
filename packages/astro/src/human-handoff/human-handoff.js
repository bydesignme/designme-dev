// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, AV, DM, I, enter, swap } from '../core/core.js';
DM.def('human-handoff', (r, c) => {
  const IC = { user:I('user'), chev:I('chev-d','xs'), clock:I('clock'), link:I('link','xs'), edit:I('edit','xs') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  const root = $('.hox', r), rb = $('.hox-rb', r), av = $('.hox-av', r), wn = $('.hox-wn', r), wd = $('.hox-wd', r), pop = $('.hox-pop', r);
  const sla = $('.hox-sla', r), due = $('.hox-due', r), bar = $('.hox-bar', r), fill = $('.hox-bar i', r);
  const row = $('.hox-st', r), sa = $('.hox-sa', r), sb = $('.hox-sb', r), mb = $('.hox-mb', r), ed = $('.hox-ed', r), no = $('.hox-no', r), ml = $('.hox-ml', r);
  // the billing team: someone free takes the conversation in a few seconds, someone in a call takes longer, and someone
  // who is out never does
  const P = [
    { k:'alex', n:'Alex Rivera', i:'AR', bg:'var(--dm-av-m)', on:'Available', tone:'ok', wait:2500 },
    { k:'sam', n:'Sam Ortiz', i:'SO', bg:'var(--dm-av-p)', on:'In a call', tone:'', wait:6000 },
    { k:'maya', n:'Maya Chen', i:'MC', bg:'var(--dm-av-l)', on:'Out until 2pm', tone:'warn' }
  ];
  const first = p => p.n.split(' ')[0];
  pop.insertAdjacentHTML('beforeend', P.map(p => `<button class="mi" role="menuitemradio" aria-checked="false" data-close data-k="${p.k}">${AV(p.i, p.bg)}<span>${p.n}<span class="d">Billing · ${p.on}</span></span><span class="ck">${I('check','xs')}</span></button>`).join(''));
  // when the reply is due: 15 minutes from the hand-off, counting down by the second; amber under five minutes
  const TARGET = 900;
  let left = 846;
  const showDue = () => {
    const m = Math.floor(left / 60);
    due.textContent = left <= 0 ? 'Reply overdue' : m < 1 ? 'Reply due in under a minute' : `Reply due in ${m} min`;
    sla.classList.toggle('warn', left > 0 && left < 300); sla.classList.toggle('bad', left <= 0);
    fill.style.width = Math.max(0, left / TARGET * 100) + '%'; bar.setAttribute('aria-valuenow', Math.max(0, left));
  };
  showDue(); c.every(1000, () => { left--; showDue(); });
  // the row at the foot says where it stands
  const state = (tone, glyph, a, b) => { row.className = 'hox-st' + (tone ? ' ' + tone : ''); $('.g', row).innerHTML = glyph; swap(sa, a); swap(sb, b); };
  let who = null, run = 0, phase = 'finding';
  function assign(p){
    const id = ++run; who = p; phase = 'waiting';
    av.innerHTML = AV(p.i, p.bg); enter(av.firstElementChild);
    swap(wn, p.n); wd.className = 'hox-wd'; wd.innerHTML = '<span>Billing</span>';
    $$('.mi', pop).forEach(m => m.setAttribute('aria-checked', m.dataset.k === p.k)); rb.disabled = false;
    state('', '<span class="spin"></span>', `Waiting for ${first(p)} to accept`, 'The agent has stopped replying to Dana');
    // their status comes back a moment later
    c.later(1600, () => {
      if (id !== run) return;
      wd.className = 'hox-wd' + (p.tone ? ' ' + p.tone : ''); wd.innerHTML = `<span class="dot"></span><span>Billing · ${p.on}</span>`; enter(wd);
      if (!p.wait){ phase = 'away'; state('warn', I('alert'), `${first(p)} is out until 2pm`, 'The reply is due before then. Reassign it to someone who is free.'); return; }
      c.later(p.wait, () => {
        if (id !== run) return;
        phase = 'joined'; state('ok', AV(p.i, p.bg), `${first(p)} joined`, 'Reading the conversation');
        c.later(1800, () => { if (id !== run) return; phase = 'with'; state('ok', AV(p.i, p.bg), `With ${first(p)} · agent paused`, `The agent won't reply while ${first(p)} has it`); });
      });
    });
  }
  $$('.mi', pop).forEach(m => m.addEventListener('click', () => { const p = P.find(x => x.k === m.dataset.k); if (p !== who) assign(p); }));
  // the preview hands it to Maya once on its own, unless you have picked someone first
  c.auto(1500, () => assign(P[2]));
  // what the customer was told can be corrected in place
  let said = mb.textContent, editing = false;
  const edit = on => {
    editing = on; mb.contentEditable = on ? 'true' : 'false'; mb.setAttribute('aria-readonly', !on); no.hidden = !on;
    ed.className = 'pill sm hox-ed ' + (on ? 'primary' : 'ghost'); ed.innerHTML = on ? 'Save' : I('edit','xs') + 'Edit';
    if (on){ mb.focus(); const s = getSelection(); s.selectAllChildren(mb); s.collapseToEnd(); }
  };
  ed.onclick = () => {
    if (!editing) return edit(true);
    const t = mb.textContent.trim();
    if (t && t !== said){ said = t; swap(ml, 'Sent to Dana · edited'); } else mb.textContent = said;
    edit(false);
  };
  no.onclick = () => { mb.textContent = said; edit(false); };
  // the preview's story: Maya is assigned but is out, so the person reassigns it to Alex, who takes it
  c.story(async s => {
    await s.until(() => phase === 'away'); await s.beat(4);
    await s.tap(rb); await s.beat(2);
    await s.point($('.mi[data-k="sam"]', pop), false); await s.beat(1);
    await s.tap($('.mi[data-k="alex"]', pop)); s.away();
    await s.until(() => phase === 'with'); await s.beat(6);
  });
});
