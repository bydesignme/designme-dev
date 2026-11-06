// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, centre, closePops, swap } from '../core/core.js';
DM.def('date-picker', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{cal}', I('cal','xs')).replace('{chev}', I('chev-d','xs')).replace('{l}', I('chev-l','xs')).replace('{r}', I('chev-r','xs'));
  // today is the real today: the calendar opens on its month and the quick picks and typed dates count from it
  const now = new Date(), TODAY = new Date(now.getFullYear(), now.getMonth(), now.getDate()); let view = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1), sel = null;
  const g = $('.dpk-g', r), m = $('.dpk-m', r), val = $('.dpk-val', r), f = $('.dpk-f', r); let cursor = null;
  val.classList.add('ph');
  const same = (a, b) => a && b && a.toDateString() === b.toDateString();
  const fmt = d => d.toLocaleDateString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric' });
  function paint(dir){
    m.textContent = view.toLocaleDateString('en-US', { month:'long', year:'numeric' });
    const first = new Date(view.getFullYear(), view.getMonth(), 1), start = new Date(first); start.setDate(1 - ((first.getDay() + 6) % 7));
    // one day takes Tab, the one the arrows last reached, or the picked day, today or the 1st; the arrows move from it
    const inView = d => d && d.getMonth() === view.getMonth() && d.getFullYear() === view.getFullYear(), tab = [cursor, sel, TODAY].find(inView) || first;
    let h = ''; for (let i = 0; i < 42; i++){ const d = new Date(start); d.setDate(start.getDate() + i); h += `<button class="dpk-d${d.getMonth() !== view.getMonth() ? ' o' : ''}${same(d, TODAY) ? ' t' : ''}${same(d, sel) ? ' s' : ''}" data-t="${d.getTime()}" tabindex="${same(d, tab) ? 0 : -1}" aria-label="${fmt(d)}" aria-pressed="${!!same(d, sel)}"${same(d, TODAY) ? ' aria-current="date"' : ''}>${d.getDate()}</button>`; }
    g.innerHTML = h; if (dir){ g.classList.remove('in-l','in-r'); void g.offsetWidth; g.classList.add(dir < 0 ? 'in-l' : 'in-r'); }
    $$('.dpk-d', g).forEach(b => b.onclick = () => pick(new Date(+b.dataset.t)));
  }
  function pick(d, keep){ sel = d; val.classList.remove('ph'); swap(val, fmt(d)); if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()){ const dir = d > view ? 1 : -1; view = new Date(d.getFullYear(), d.getMonth(), 1); paint(dir); } else paint(); if (!keep) c.later(260, () => closePops()); }
  $('.dpk-pv', r).onclick = () => { view = new Date(view.getFullYear(), view.getMonth() - 1, 1); paint(-1); };
  $('.dpk-nx', r).onclick = () => { view = new Date(view.getFullYear(), view.getMonth() + 1, 1); paint(1); };
  $$('.dpk-qk .chip', r).forEach(b => b.onclick = () => { const d = new Date(TODAY); d.setDate(d.getDate() + +b.dataset.d); pick(d); });
  const W = ['sunday','monday','tuesday','wednesday','thursday','friday','saturday'];
  $('.dpk-nl', r).oninput = e => { const s = e.target.value.toLowerCase().trim(); let d = null;
    const wd = W.findIndex(w => s.includes(w)); const n = s.match(/in (\d+) (day|week|month)s?/);
    if (n){ d = new Date(TODAY); if (n[2] === 'day') d.setDate(d.getDate() + +n[1]); if (n[2] === 'week') d.setDate(d.getDate() + n[1] * 7); if (n[2] === 'month') d.setMonth(d.getMonth() + +n[1]); }
    else if (wd >= 0){ d = new Date(TODAY); let add = (wd - d.getDay() + 7) % 7 || 7; if (s.includes('next') && add < 7) add += 0; d.setDate(d.getDate() + add); }
    else if (s === 'tomorrow'){ d = new Date(TODAY); d.setDate(d.getDate() + 1); }
    if (d) pick(d, true); };
  $('.dpk-nl', r).onkeydown = e => { if (e.key === 'Enter' && sel) closePops(); };
  // the keyboard in the calendar: the arrows move a day or a week, across months too; Home and End go to the start and end
  // of the week; Page Up and Page Down move a month, or a year with Shift; Enter or Space picks the day
  const dayBtn = d => $$('.dpk-d', g).find(b => same(new Date(+b.dataset.t), d));
  function goDay(d){
    cursor = d;
    if (d.getMonth() !== view.getMonth() || d.getFullYear() !== view.getFullYear()){ const dir = d > view ? 1 : -1; view = new Date(d.getFullYear(), d.getMonth(), 1); paint(dir); } else paint();
    const b = dayBtn(d); if (b) b.focus({ preventScroll:true });
  }
  c.on(g, 'keydown', e => {
    const b = e.target.closest('.dpk-d'); if (!b) return;
    const d = new Date(+b.dataset.t), wd = (d.getDay() + 6) % 7, at = n => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    const mon = (y, mo) => new Date(y, mo, Math.min(d.getDate(), new Date(y, mo + 1, 0).getDate()));
    const n = { ArrowLeft:at(-1), ArrowRight:at(1), ArrowUp:at(-7), ArrowDown:at(7), Home:at(-wd), End:at(6 - wd),
      PageUp:e.shiftKey ? mon(d.getFullYear() - 1, d.getMonth()) : mon(d.getFullYear(), d.getMonth() - 1),
      PageDown:e.shiftKey ? mon(d.getFullYear() + 1, d.getMonth()) : mon(d.getFullYear(), d.getMonth() + 1) }[e.key];
    if (!n) return; e.preventDefault(); goDay(n);
  });
  // opened with the keyboard, the calendar takes the focus on the picked day, or today
  c.on(f, 'click', e => { if (e.isTrusted && !e.detail) requestAnimationFrame(() => { if (f.getAttribute('aria-expanded') !== 'true') return; cursor = null; paint(); const b = $('.dpk-d[tabindex="0"]', g); if (b) b.focus({ preventScroll:true }); }); });
  paint();
  // the field sits centred on its own, and glides up as the calendar opens under it, so the two sit centred together; on
  // closing, it waits for the calendar to fade before it glides back to the middle
  const box = $('.dpk', r), pop = $('.dpk-pop', r), isOpen = () => f.getAttribute('aria-expanded') === 'true';
  const centred = centre(c, box, () => isOpen() ? Math.max(box.offsetHeight, pop.offsetTop + pop.offsetHeight) : box.offsetHeight);
  const mo = new MutationObserver(() => isOpen() ? centred() : c.later(REDUCE ? 0 : 180, centred));
  mo.observe(f, { attributes:true, attributeFilter:['aria-expanded'] }); c.offs.push(() => mo.disconnect());
  // the preview opens it and types a date on its own; clicking, focusing or typing in it takes over, and what it had typed goes
  c.auto(800, () => { f.click(); c.run(async () => { const i = $('.dpk-nl', r); await c.step(500); await c.type(i, 'next friday', { ms:70, each:() => i.oninput({ target:i }) }); }); });
});
