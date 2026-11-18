// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, enter, grow, html, swap } from '../core/core.js';
DM.def('attachment-tray', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{upload}', I('upload'));
  const tray = $('.atx', r), list = $('.atx-list', r), sum = $('.atx-sum', r);
  // Clean: the whole card is the drop target. The drop zone gives way to the empty state (after the list, so it shows only
  // while the list is empty), and the closing line moves into a foot strip with Add files, shown once there are files. The
  // card grows with its files (grow()); Soft and Blueprint as they were
  const clean = (r.closest('[data-style]') || document.documentElement).dataset.style === 'clean';
  if (clean){
    $('.atx-drop', r).remove();
    list.after(html(`<div class="atx-em"><span class="atx-em-art" aria-hidden="true"></span><b>Drop files here</b><span>or <label class="atx-br">browse your files<input type="file" multiple class="atx-file" aria-label="Choose files"></label></span><button type="button" class="pill line sm atx-smp">${I('plus','xs')}Add sample files</button></div>`));
    const ft = html(`<div class="atx-ft"><label class="pill line sm atx-add">${I('plus','xs')}Add files<input type="file" multiple class="atx-file" aria-label="Add files"></label></div>`);
    sum.replaceWith(ft); ft.prepend(sum);
    c.offs.push(grow(tray));
  }
  const drop = clean ? tray : $('.atx-drop', r);
  const kind = n => { const e = (n.split('.').pop() || '').toLowerCase(); return e === 'pdf' ? ['PDF','var(--dm-pr)','var(--dm-pr-bg)'] : /png|jpg|jpeg|gif|webp|fig/.test(e) ? [e.toUpperCase().slice(0,3),'var(--dm-pl)','var(--dm-pl-bg)'] : /csv|xlsx/.test(e) ? ['CSV','var(--dm-pm)','var(--dm-pm-bg)'] : [e.toUpperCase().slice(0,3) || 'TXT','var(--dm-pb)','var(--dm-pb-bg)']; };
  const size = b => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  let read = 0;
  // a file uploads (its row fills with its hue and its ring closes), then the agent reads it and says what it found
  function add(name, bytes, i = 0, found){
    const k = kind(name), sz = size(bytes);
    const it = html(`<div class="atx-it" style="--dm-c:${k[1]};--dm-cb:${k[2]}"><span class="atx-ti">${k[0]}</span><span class="atx-n"><span class="atx-nm">${esc(name)}</span><span class="atx-m"><span>${sz} · <span class="num pc">0%</span></span></span></span><svg class="atx-ring" viewBox="0 0 22 22" role="progressbar" aria-label="Uploading ${esc(name).replace(/"/g, '&quot;')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><circle cx="11" cy="11" r="8" fill="none" stroke="var(--dm-line)" stroke-width="2"/><circle cx="11" cy="11" r="8" fill="none" stroke="${k[1]}" stroke-width="2" stroke-linecap="round" stroke-dasharray="50.3" stroke-dashoffset="50.3" transform="rotate(-90 11 11)"/></svg><button class="ib" aria-label="Remove ${esc(name).replace(/"/g, '&quot;')}" data-tip="Remove">${I('x','xs')}</button>${clean ? '<span class="atx-ln" aria-hidden="true"><i></i></span>' : ''}</div>`);
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
        const rd = $('.atx-rd', it); if (rd) rd.outerHTML = `<span class="atx-ok">${clean ? '<span class="atx-okc"><svg viewBox="0 0 16 16" aria-hidden="true"><path pathLength="1" d="M4.6 8.3l2.3 2.3 4.5-4.8"/></svg></span>' : I('ok')}</span>`;
        swap(m, found ? `${sz} · ${found}` : sz); read++;
        if (!clean) { swap(sum, 'The agent can read ' + read + (read > 1 ? ' files' : ' file') + ' now'); return; }
        // Clean: the foot strip opens with a green tick, and from then on only its count rolls
        const w = read > 1 ? 'files' : 'file', rl = $('.atx-roll', sum);
        if (!rl) swap(sum, `<span class="atx-tk">${I('check','xs')}</span><span>The agent can read <span class="atx-roll num"><i>${read}</i></span> <span class="atx-w">${w}</span> now</span>`, true);
        else { rl.innerHTML = `<i class="in">${read}</i>`; $('.atx-w', sum).textContent = w; }
      });
    });
  }
  const samples = () => [['brief.pdf', 2.4e6, '12 pages'],['Pricing.fig', 8.1e6, '6 frames'],['signups.csv', 3.2e5, '1,204 rows']].forEach((f, i) => add(f[0], f[1], i, f[2]));
  $(clean ? '.atx-smp' : '.atx-sample', r).onclick = e => { e.preventDefault(); samples(); };
  $$('.atx-file', r).forEach(inp => { inp.onchange = e => { Array.from(e.target.files).forEach((f, i) => add(f.name, f.size, i)); e.target.value = ''; }; });
  ['dragenter','dragover'].forEach(ev => c.on(drop, ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  // (in Clean the card holds the rows and buttons, so moving between them is not leaving it)
  ['dragleave','drop'].forEach(ev => c.on(drop, ev, e => { if (clean && ev === 'dragleave' && drop.contains(e.relatedTarget)) return; drop.classList.remove('over'); }));
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
  if (ants){ fit(); const ro = new ResizeObserver(fit); ro.observe(drop); c.offs.push(() => ro.disconnect()); }
  /* once it has entered, three sample files are dragged over, drop in and upload, so the tray shows what it does */
  c.run(async () => {
    await c.step(950); if (list.children.length) return;
    drop.classList.add('over'); c.taken(() => drop.classList.remove('over')); await c.step(1300); drop.classList.remove('over');
    if (!list.children.length) samples();
  });
});
