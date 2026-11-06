// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, html, swap } from '../core/core.js';
DM.def('attachment-tray', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{upload}', I('upload'));
  const drop = $('.atx-drop', r), list = $('.atx-list', r), sum = $('.atx-sum', r);
  const kind = n => { const e = (n.split('.').pop() || '').toLowerCase(); return e === 'pdf' ? ['PDF','var(--dm-pr)','var(--dm-pr-bg)'] : /png|jpg|jpeg|gif|webp|fig/.test(e) ? [e.toUpperCase().slice(0,3),'var(--dm-pl)','var(--dm-pl-bg)'] : /csv|xlsx/.test(e) ? ['CSV','var(--dm-pm)','var(--dm-pm-bg)'] : [e.toUpperCase().slice(0,3) || 'TXT','var(--dm-pb)','var(--dm-pb-bg)']; };
  const size = b => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  let read = 0;
  // a file uploads (its row fills with its hue and its ring closes), then the agent reads it and says what it found
  function add(name, bytes, i = 0, found){
    const k = kind(name), sz = size(bytes);
    const it = html(`<div class="atx-it" style="--dm-c:${k[1]};--dm-cb:${k[2]}"><span class="atx-ti">${k[0]}</span><span class="atx-n"><span class="atx-nm">${esc(name)}</span><span class="atx-m"><span>${sz} · <span class="num pc">0%</span></span></span></span><svg class="atx-ring" viewBox="0 0 22 22" role="progressbar" aria-label="Uploading ${esc(name).replace(/"/g, '&quot;')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><circle cx="11" cy="11" r="8" fill="none" stroke="var(--dm-line)" stroke-width="2"/><circle cx="11" cy="11" r="8" fill="none" stroke="${k[1]}" stroke-width="2" stroke-linecap="round" stroke-dasharray="50.3" stroke-dashoffset="50.3" transform="rotate(-90 11 11)"/></svg><button class="ib" aria-label="Remove ${esc(name).replace(/"/g, '&quot;')}" data-tip="Remove">${I('x','xs')}</button></div>`);
    list.appendChild(it); enter(it, i * 80);
    $('.ib', it).onclick = () => { it.classList.add('leave'); setTimeout(() => it.remove(), 320); };
    const svg = $('.atx-ring', it), ring = $$('circle', it)[1], m = $('.atx-m', it); let p = 0;
    const iv = c.every(70, () => {
      p = Math.min(1, p + .025 + Math.random() * .05); ring.style.strokeDashoffset = 50.3 * (1 - p);
      it.style.setProperty('--dm-p', (p * 100).toFixed(1) + '%'); svg.setAttribute('aria-valuenow', Math.round(p * 100)); const pc = $('.pc', m); if (pc) pc.textContent = Math.round(p * 100) + '%';
      if (p < 1) return;
      clearInterval(iv); it.classList.add('up');
      // reading: the ring gives way to a spinner and the line shimmers, then says what the agent found
      svg.outerHTML = '<span class="atx-rd"><span class="spin"></span></span>'; swap(m, `<span class="shim">${sz} · Reading</span>`, true);
      c.later(REDUCE ? 0 : 900, () => {
        const rd = $('.atx-rd', it); if (rd) rd.outerHTML = `<span class="atx-ok">${I('ok')}</span>`;
        swap(m, found ? `${sz} · ${found}` : sz); read++; swap(sum, 'The agent can read ' + read + (read > 1 ? ' files' : ' file') + ' now');
      });
    });
  }
  const samples = () => [['brief.pdf', 2.4e6, '12 pages'],['Pricing.fig', 8.1e6, '6 frames'],['signups.csv', 3.2e5, '1,204 rows']].forEach((f, i) => add(f[0], f[1], i, f[2]));
  $('.atx-sample', r).onclick = e => { e.preventDefault(); samples(); };
  $('.atx-file', r).onchange = e => { Array.from(e.target.files).forEach((f, i) => add(f.name, f.size, i)); e.target.value = ''; };
  ['dragenter','dragover'].forEach(ev => c.on(drop, ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave','drop'].forEach(ev => c.on(drop, ev, () => drop.classList.remove('over')));
  c.on(drop, 'drop', e => { e.preventDefault(); Array.from(e.dataTransfer.files).forEach((f, i) => add(f.name, f.size, i)); });
  /* the dashed edge follows the drop zone's size and corners, with the dashes spaced to meet evenly all the way round */
  const ants = $('.atx-ants rect', r);
  const fit = () => {
    const w = drop.offsetWidth, h = drop.offsetHeight; if (!w || !h) return;
    const k = .75, rad = Math.max(0, Math.min(parseFloat(getComputedStyle(drop).borderTopLeftRadius) || 0, w / 2, h / 2) - k);
    ants.setAttribute('x', k); ants.setAttribute('y', k); ants.setAttribute('width', w - 2 * k); ants.setAttribute('height', h - 2 * k); ants.setAttribute('rx', rad);
    const per = 2 * (w + h - 4 * k) - (8 - 2 * Math.PI) * rad, step = per / Math.max(8, Math.round(per / 11));
    ants.style.setProperty('--dm-ap', step + 'px'); ants.style.setProperty('--dm-ag', (step - 4.5) + 'px');
  };
  fit(); const ro = new ResizeObserver(fit); ro.observe(drop); c.offs.push(() => ro.disconnect());
  /* once it has entered, three sample files are dragged over, drop in and upload, so the tray shows what it does */
  c.run(async () => {
    await c.step(950); if (list.children.length) return;
    drop.classList.add('over'); c.taken(() => drop.classList.remove('over')); await c.step(1300); drop.classList.remove('over');
    if (!list.children.length) samples();
  });
});
