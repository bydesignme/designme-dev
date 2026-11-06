// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, REDUCE, enter, hideTip, html, seg, showTip, swap, tip, tipFor } from '../core/core.js';
DM.def('artifact-card', (r, c) => {
  /* the file: one report in three versions, and the table it cites. A component that shows the card in its own chat can
     give it its own file with use() */
  const F = {
    look:'The three plans look alike at a glance.',
    year:'The yearly switch hides what a month costs.',
    cancel:'Nothing near the buttons says you can cancel any time.',
    faq:'The FAQ repeats the plan table instead of answering doubts.',
    price:'Team costs 16% more than similar plans elsewhere, and the page never says why.'
  };
  const REPORT = { title:'Pricing page review', kind:'Report', icon:'file-text', file:'pricing-page-review', ext:'md', mime:'text/markdown',
    steps:['Reading the page…', 'Writing the findings…', 'Ordering the fixes…'], versions:[
    { ago:'2 hours ago', when:'edited 2 hours ago', note:'First pass, four findings',
      changes:['Read the page from top to bottom', 'Listed four findings in page order'],
      summary:'People reach the plan table and stall. Most of what slows them down is clarity, not price.',
      findings:[F.look, F.year, F.cancel, F.faq] },
    { ago:'40 min ago', when:'edited 40 min ago', note:'Added a competitor price check',
      changes:['Compared Team with three competitors', 'Dropped the FAQ finding, which overlapped another'],
      summary:'People reach the plan table and stall. Team also costs more than similar plans elsewhere, and the page never says why.',
      findings:[F.look, F.year, F.cancel, F.price] },
    { ago:'just now', when:'edited just now', note:'Fixes, ordered by impact',
      changes:['Turned each finding into a fix', 'Ordered the fixes by how many people they reach'],
      summary:'People reach the plan table and stall. Three changes should move most of them on, and none of them touch the price.',
      findings:[F.look, F.year, F.cancel, F.price],
      fixes:['Show the monthly price beside the yearly one.', 'Mark Team as the plan most people choose.', 'Put “Cancel any time” under each button.'] }
  ] };
  const TABLE = { title:'Competitor prices', kind:'Table', icon:'table', file:'competitor-prices', ext:'csv', mime:'text/csv', versions:[
    { ago:'1 hour ago', when:'edited 1 hour ago', note:'Team and Business at three competitors', changes:['Collected list prices, billed monthly'],
      rows:[['Plan', 'Ours', 'Northwind', 'Halcyon', 'Fernway'], ['Team', '$29', '$22', '$25', '$28'], ['Business', '$79', '$69', '$75', '$89']] }] };

  const own = r === c.st, root = $('.afx', r), main = $('.afx-main', r), demo = $(':scope>.demo', root);
  // inside another component (Agent harness puts it in a chat) the card is just the file: no chat around it, no switcher
  if (!own){ root.classList.remove('dm'); if (demo) demo.remove(); }
  let art = REPORT, opts = {}, view = 'compact', K = null, now = { ready:false, m:null };

  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const ic = (n, s = '') => `<svg class="i${s ? ' ' + s : ''}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
  const uid = () => 'afx' + Math.random().toString(36).slice(2, 9);
  const whenHTML = v => `<span class="afx-ed">edited </span>${esc(v.ago)}`;
  const meta = (a, i) => `${a.kind} · v${i + 1} · ${a.versions[i].when}`;
  const cssMs = (el, v, f = 1) => { const s = getComputedStyle(el).getPropertyValue(v).trim(); return (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000) * f || 300; };
  const cssEase = el => getComputedStyle(el).getPropertyValue('--dm-ease').trim() || 'ease';
  // what Copy copies, Download saves and the reader shows: Markdown for a report, CSV for a table
  function text(a, i){
    const v = a.versions[i];
    if (a.ext === 'csv') return v.rows.map(x => x.join(',')).join('\n') + '\n';
    let s = `# ${a.title}\n\nv${i + 1}, ${v.when}\n\n## Summary\n\n${v.summary}\n\n## Findings\n\n${v.findings.map(f => '- ' + f).join('\n')}\n`;
    if (v.fixes) s += `\n## What to fix first\n\n${v.fixes.map((f, k) => (k + 1) + '. ' + f).join('\n')}\n`;
    return s + `\n## Changes in v${i + 1}\n\n${v.changes.map(f => '- ' + f).join('\n')}\n`;
  }
  function body(a, i){
    const v = a.versions[i], li = l => l.map(x => `<li>${esc(x)}</li>`).join('');
    const chg = `<h3>Changes in v${i + 1}</h3><ul>${li(v.changes)}</ul>`;
    if (a.ext === 'csv') return `<table class="afx-tb"><thead><tr>${v.rows[0].map((h, k) => `<th scope="col"${k ? ' class="num"' : ''}>${esc(h)}</th>`).join('')}</tr></thead><tbody>${v.rows.slice(1).map(x => `<tr>${x.map((y, k) => k ? `<td class="num">${esc(y)}</td>` : `<th scope="row">${esc(y)}</th>`).join('')}</tr>`).join('')}</tbody></table>${chg}`;
    return `<p>${esc(v.summary)}</p><h3>Findings</h3><ul>${li(v.findings)}</ul>${v.fixes ? `<h3>What to fix first</h3><ol>${li(v.fixes)}</ol>` : ''}${chg}`;
  }
  // which version a card shows; the parts that depend on it subscribe
  const model = a => { const m = { a, i:a.versions.length - 1, subs:[] }; m.on = f => m.subs.push(f); m.set = i => { if (i === m.i) return; m.i = i; m.subs.forEach(f => f(i)); }; return m; };
  // each variant runs on its own clock, stopped when the switcher shows another, on the card's pace (a chat that replays
  // at speed keeps it)
  const sub = () => { const k = { dead:false, offs:[] };
    k.wait = ms => c.wait(ms).then(() => { if (k.dead) throw 'stop'; });
    k.every = (ms, fn) => { const id = c.every(ms, () => { if (!k.dead) fn(); }); k.offs.push(() => clearInterval(id)); return id; };
    k.on = (el, ev, fn, o) => { el.addEventListener(ev, fn, o); k.offs.push(() => el.removeEventListener(ev, fn, o)); };
    k.stop = () => { k.dead = true; k.offs.forEach(f => f()); k.offs = []; };
    return k; };
  c.offs.push(() => K && K.stop());

  /* a polite status line, so writing, copying, downloading and switching versions are announced too */
  const live = html('<div class="afx-live afx-sr" role="status" aria-live="polite"></div>');
  root.append(live);
  const say = msg => { live.textContent = ''; c.later(60, () => { live.textContent = msg; }); };
  /* feedback on a button that did something: a check, a word in the tooltip or the label, then back */
  function flash(btn, label){
    const use = $('use', btn), lb = $('.afx-lbl', btn);
    const o = btn._fl || (btn._fl = { href:use && use.getAttribute('href'), tip:btn.dataset.tip, txt:lb && lb.textContent });
    clearTimeout(o.t);
    if (use) use.setAttribute('href', o.href.replace(/[\w-]+$/, 'check'));
    if (lb) lb.textContent = label;
    btn.classList.add('copied');
    if (o.tip !== undefined){ btn.dataset.tip = label; showTip(btn); }
    o.t = setTimeout(() => {
      if (use) use.setAttribute('href', o.href);
      if (lb) lb.textContent = o.txt;
      btn.classList.remove('copied');
      if (o.tip !== undefined){ btn.dataset.tip = o.tip; if (tipFor === btn) hideTip(true); }
    }, 1600);
  }
  function doCopy(btn, m){
    try { navigator.clipboard.writeText(text(m.a, m.i)).catch(() => {}); } catch(e){}
    flash(btn, 'Copied'); say(`Copied ${m.a.title}, v${m.i + 1}, to the clipboard`);
  }
  function doDownload(btn, m){
    const name = `${m.a.file}-v${m.i + 1}.${m.a.ext}`, url = URL.createObjectURL(new Blob([text(m.a, m.i)], { type:m.a.mime }));
    const a = document.createElement('a'); a.href = url; a.download = name; a.hidden = true; document.body.append(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    flash(btn, 'Downloaded'); say(`Downloaded ${name}`);
  }
  /* the variant moves up as a menu opens under its button, so the two sit centred together in the card's room (above the
     switcher, where it shows), as dropdowns do across the library. The menu opens where the button is going, so it never
     reaches past the room on the way. Returns how far the variant still has to move. In a chat, which scrolls, it stays */
  function glide(wrap, btn, menu){
    if (!own) return 0;
    const cur = new DOMMatrixReadOnly(getComputedStyle(wrap).transform).m42;
    if (!menu){ wrap.style.transform = ''; return -cur; }
    const w = wrap.getBoundingClientRect(), b = btn.getBoundingClientRect(), rr = root.getBoundingClientRect();
    const top0 = rr.top, bot0 = demo && demo.offsetParent ? demo.getBoundingClientRect().top - (parseFloat(getComputedStyle(root).rowGap) || 0) : rr.bottom;
    const mt = b.bottom - cur + 6, top = Math.min(w.top - cur, mt), bot = Math.max(w.bottom - cur, mt + menu.offsetHeight);
    const d = Math.max(top0 - top, (top0 + bot0) / 2 - (top + bot) / 2), to = Math.abs(d) > .5 ? Math.round(d) : 0;
    wrap.style.transform = to ? `translateY(${to}px)` : '';
    return to - cur;
  }
  /* versions: a menu button with one radio item per version, newest first. Arrow keys move, Enter picks, Esc closes */
  function vmenu(k, m, btn, wrap, o = {}){
    const id = uid(), vs = m.a.versions;
    const menu = html(`<div class="pop afx-menu" id="${id}" role="menu" aria-label="Versions of ${esc(m.a.title)}" inert><div class="ph" aria-hidden="true">Versions</div>${vs.map((v, j) => j).reverse().map(j => `<button type="button" class="mi" role="menuitemradio" tabindex="-1" data-i="${j}" aria-checked="false"><span class="afx-mb"><span>v${j + 1}<span class="afx-mw"> · ${esc(vs[j].ago)}</span></span><span class="d">${esc(vs[j].note)}</span></span>${ic('check', 's ck')}</button>`).join('')}</div>`);
    // on the card's own stage the menu sits in the room, not in the variant, so it can open where the variant is going
    const host = own ? main : wrap; host.append(menu);
    btn.setAttribute('aria-haspopup', 'menu'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
    const items = () => $$('.mi', menu);
    let open = false;
    const place = (dy = 0) => {
      const hr = host.getBoundingClientRect(), wr = wrap.getBoundingClientRect(), br = btn.getBoundingClientRect(), rr = root.getBoundingClientRect(), mw = menu.offsetWidth;
      const lo = Math.max(rr.left, wr.left), hi = Math.min(rr.right, wr.right) - mw, x = Math.max(lo, Math.min(br.left - 6, hi));
      menu.style.left = Math.round(x - hr.left) + 'px'; menu.style.top = Math.round(br.bottom + dy - hr.top + 6) + 'px';
    };
    // the visitor's open puts the focus on the picked version; a demo's open leaves the focus where it is
    const show = (focus = true) => {
      items().forEach(b => b.setAttribute('aria-checked', String(+b.dataset.i === m.i)));
      open = true; hideTip(); menu.inert = false; o.onOpen && o.onOpen(); place(glide(wrap, btn, menu)); menu.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
      if (focus) (items().find(b => b.getAttribute('aria-checked') === 'true') || items()[0]).focus({ preventScroll:true });
    };
    const hide = refocus => {
      if (!open) return; open = false; menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
      if (refocus) btn.focus({ preventScroll:true });
      menu.inert = true; glide(wrap, btn, null); o.onClose && o.onClose();
    };
    k.on(btn, 'click', e => { e.stopPropagation(); open ? hide(false) : show(e.isTrusted); });
    k.on(btn, 'keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); show(); } });
    k.on(menu, 'keydown', e => {
      const it = items(), j = it.indexOf(document.activeElement);
      if (e.key === 'ArrowDown'){ e.preventDefault(); it[(j + 1) % it.length].focus(); }
      else if (e.key === 'ArrowUp'){ e.preventDefault(); it[(j - 1 + it.length) % it.length].focus(); }
      else if (e.key === 'Home'){ e.preventDefault(); it[0].focus(); }
      else if (e.key === 'End'){ e.preventDefault(); it[it.length - 1].focus(); }
      else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); hide(true); }
      else if (e.key === 'Tab'){ hide(false); }
    });
    k.on(menu, 'click', e => { const b = e.target.closest('.mi'); if (!b) return; m.set(+b.dataset.i); hide(menu.contains(document.activeElement)); });
    k.on(document, 'pointerdown', e => { if (open && !menu.contains(e.target) && !btn.contains(e.target)) hide(false); });
    k.on(window, 'resize', e => { if (e.isTrusted) hide(false); });
    return { hide };
  }
  /* the opened file: a view over the stage, or a page that grows out of the preview or sheet it came from. It is a modal
     dialog inside the card: focus moves in and stays in, Esc or the scrim closes it, and focus goes back to the opener */
  function sheet(k, m, wrap, { kind = 'view', opener, src = null } = {}){
    if ($(':scope>.afx-sheet', root)) return;
    const id = uid();
    const layer = html(`<div class="afx-sheet"><div class="afx-scrim"></div><div class="afx-pan afx-${kind}" role="dialog" aria-modal="true" aria-labelledby="${id}" tabindex="-1">
      <div class="afx-ph"><span class="afx-ic" aria-hidden="true">${ic(m.a.icon)}</span><div class="afx-ptx"><div class="afx-pt" id="${id}">${esc(m.a.title)}</div><div class="afx-pm">${esc(meta(m.a, m.i))}</div></div><button type="button" class="ib afx-x" aria-label="Close" data-tip="Close" data-tip-k="Esc">${ic('x')}</button></div>
      <div class="afx-pb" tabindex="0" role="region" aria-label="${esc(m.a.title)}, v${m.i + 1}">${body(m.a, m.i)}</div>
      <div class="afx-pf"><button type="button" class="pill sm line afx-copy">${ic('copy', 's')}<span class="afx-lbl">Copy</span></button><button type="button" class="pill sm line afx-dl">${ic('down', 's')}<span class="afx-lbl">Download</span></button></div>
    </div></div>`);
    root.append(layer); main.inert = true; if (demo) demo.inert = true; hideTip();
    const pan = $('.afx-pan', layer), scrim = $('.afx-scrim', layer), D = cssMs(root, '--dm-t', kind === 'page' ? 1.3 : 1.1), E = cssEase(root);
    const morph = back => {
      const a = src.getBoundingClientRect(), b = pan.getBoundingClientRect();
      const f = { transform:`translate(${a.left - b.left}px,${a.top - b.top}px) scale(${a.width / b.width},${a.height / b.height})` };
      [...pan.children].forEach(x => x.animate(back ? [{ opacity:1 }, { opacity:0, offset:.4 }, { opacity:0 }] : [{ opacity:0 }, { opacity:0, offset:.45 }, { opacity:1 }], { duration:D, fill:back ? 'forwards' : 'none' }));
      return pan.animate(back ? [{ transform:'none' }, f] : [f, { transform:'none' }], { duration:D, easing:E, fill:back ? 'forwards' : 'none' }).finished;
    };
    if (!REDUCE){
      scrim.animate([{ opacity:0 }, { opacity:1 }], { duration:D, easing:'ease-out' });
      if (src) morph(false).catch(() => {});
      else pan.animate([{ transform:'translateY(16px)', opacity:0 }, { transform:'none', opacity:1 }], { duration:D, easing:E });
    }
    if (src) src.style.visibility = 'hidden';
    $('.afx-x', layer).focus({ preventScroll:true });
    let closing = false;
    const close = async () => {
      if (closing) return; closing = true; hideTip();
      if (!REDUCE){
        const out = D * .8;
        scrim.animate([{ opacity:1 }, { opacity:0 }], { duration:out, fill:'forwards' });
        try { await (src ? morph(true) : pan.animate([{ transform:'none', opacity:1 }, { transform:'translateY(16px)', opacity:0 }], { duration:out, easing:E, fill:'forwards' }).finished); } catch(e){}
      }
      if (k.dead) return;
      layer.remove(); main.inert = false; if (demo) demo.inert = false; if (src) src.style.visibility = '';
      opener.focus({ preventScroll:true });
    };
    k.on($('.afx-x', layer), 'click', close);
    k.on(scrim, 'click', close);
    k.on($('.afx-copy', layer), 'click', e => doCopy(e.currentTarget, m));
    k.on($('.afx-dl', layer), 'click', e => doDownload(e.currentTarget, m));
    k.on(layer, 'keydown', e => {
      if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(); return; }
      if (e.key !== 'Tab') return;
      const f = $$('button,[tabindex="0"]', pan), first = f[0], last = f[f.length - 1];
      if (e.shiftKey && (document.activeElement === first || document.activeElement === pan)){ e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last){ e.preventDefault(); first.focus(); }
    });
    say(`Opened ${m.a.title}, v${m.i + 1}`);
  }
  // Open: the card's own reader, or what the component around it does instead (open it beside the chat)
  const open = (k, m, wrap, how) => opts.open ? opts.open(m.i) : sheet(k, m, wrap, how);
  const openTip = btn => { if (opts.openLabel){ btn.setAttribute('aria-label', opts.openLabel); btn.dataset.tip = opts.openLabel; } };
  /* the writing state settles into the finished card: icon, meta and actions come in together */
  function settle(el, m){ el.classList.remove('is-writing'); const f = $('.afx-fin', el); if (f) enter(f); now.ready = true; say(`${m.a.title} is ready, v${m.i + 1}`); }
  async function phases(k, a, w, step){ for (let j = 0; j < a.steps.length; j++){ if (w) swap(w, a.steps[j]); step && step(j); await k.wait(1100); } }
  /* a version change updates the meta line and the version button */
  function bindMeta(el, m){
    const vb = $('.afx-vb', el), when = $('.afx-when', el);
    const sync = i => {
      if (vb){ $('.afx-vt', vb).textContent = 'v' + (i + 1); vb.setAttribute('aria-label', `v${i + 1} of ${m.a.versions.length} versions`); }
      $$('.afx-v', el).forEach(e => { e.textContent = 'v' + (i + 1); });
      if (when) swap(when, whenHTML(m.a.versions[i]), true);
    };
    if (when) when.innerHTML = whenHTML(m.a.versions[m.i]);
    sync(m.i); m.on(i => { sync(i); say(`Showing v${i + 1}, ${m.a.versions[i].when}`); });
  }
  // the meta line: the kind, the version (a menu when there are several) and when it was edited; the writing line stands in for it
  const metaHTML = (a, cls = '') => `<div class="afx-meta${cls}"><span class="afx-wr shim">${esc((a.steps || [''])[0])}</span><span class="afx-fin"><span>${esc(a.kind)}</span><span aria-hidden="true">·</span>${a.versions.length > 1 ? `<button type="button" class="afx-vb"><span class="afx-vt"></span>${ic('chev-d', 'xs')}</button>` : '<span class="afx-v"></span>'}<span aria-hidden="true">·</span><span class="afx-when"></span></span></div>`;
  const acts = (a, openHTML) => `<button type="button" class="ib afx-copy" aria-label="Copy ${esc(a.title)}" data-tip="Copy">${ic('copy')}</button><button type="button" class="ib afx-dl" aria-label="Download ${esc(a.title)}" data-tip="Download">${ic('down')}</button>${openHTML}`;

  /* compact: the pattern people already know, an icon, the name, one line of meta and Open */
  function compact(k){
    const cardHTML = (a, key, writing) => `<div class="afx-cp-card afx-card${writing ? ' is-writing' : ''}" data-a="${key}">
      <span class="afx-ic"><span class="spin" aria-hidden="true"></span>${ic(a.icon)}</span>
      <div class="afx-cp-tx"><div class="afx-cp-t">${esc(a.title)}</div>${metaHTML(a)}</div>
      <div class="afx-cp-act">${acts(a, `<button type="button" class="pill sm accent afx-open" aria-label="Open ${esc(a.title)}">${ic('panel', 's')}<span class="afx-lbl">Open</span></button>`)}</div>
      ${writing ? '<span class="afx-cp-bar" aria-hidden="true"></span>' : ''}
    </div>`;
    main.innerHTML = `<div class="afx-w afx-cp">${own ? `<div class="bub">Review our pricing page and tell me what to fix first.</div><p class="afx-cp-a">I went through the page from top to bottom and checked our prices against three competitors. Both are below.</p>` : ''}<div class="afx-cp-list">${own && art === REPORT ? cardHTML(TABLE, 'table', false) : ''}${cardHTML(art, 'main', true)}</div></div>`;
    const wrap = $('.afx-w', main);
    $$('.afx-cp-card', main).forEach(card => {
      const a = card.dataset.a === 'table' ? TABLE : art, m = model(a), op = $('.afx-open', card);
      if (a === art) now.m = m;
      bindMeta(card, m); openTip(op);
      const vb = $('.afx-vb', card); if (vb) vmenu(k, m, vb, wrap);
      k.on($('.afx-copy', card), 'click', e => doCopy(e.currentTarget, m));
      k.on($('.afx-dl', card), 'click', e => doDownload(e.currentTarget, m));
      k.on(op, 'click', () => { if (!card.classList.contains('is-writing')) open(k, m, wrap, { kind:'view', opener:op }); });
      if (card.dataset.a !== 'main') return;
      const bar = $('.afx-cp-bar', card);
      c.run(async () => {
        await k.wait(300);
        await phases(k, a, $('.afx-wr', card), j => { bar.style.transform = `scaleX(${(j + 1) / a.steps.length})`; });
        settle(card, m); bar.remove();
      });
    });
  }

  /* preview: the same card with the first page showing; the page grows into the reader when you open it */
  function preview(k){
    const a = art, m = model(a), W = [[96, 88, 70, 82], [92, 84, 90, 64], [90, 78, 86, 72]];
    main.innerHTML = `<div class="afx-w afx-pv"><div class="afx-pv-card afx-card is-writing">
      <div class="afx-pv-prev" aria-hidden="true"><div class="afx-pv-page">
        <div class="afx-pv-k"><span class="afx-wr">Writing…</span><span class="afx-fin"></span></div>
        <div class="afx-pv-h">${esc(a.title)}</div><p class="afx-pv-p"></p>
        <div class="afx-pv-ls"><i></i><i></i><i></i><i></i></div>
      </div></div>
      <div class="afx-pv-meta"><span class="afx-ic"><span class="spin" aria-hidden="true"></span>${ic(a.icon)}</span>
        <div class="afx-pv-tx"><div class="afx-pv-t">${esc(a.title)}</div>${metaHTML(a)}</div>
        <div class="afx-pv-act">${acts(a, `<button type="button" class="ib afx-open" aria-label="Open ${esc(a.title)}" data-tip="Open">${ic('max')}</button>`)}</div>
      </div>
    </div></div>`;
    const wrap = $('.afx-w', main), card = $('.afx-pv-card', main), op = $('.afx-open', card), p = $('.afx-pv-p', main), kick = $('.afx-pv-k .afx-fin', main);
    const fill = i => { $$('.afx-pv-ls i', main).forEach((e, j) => e.style.setProperty('--dm-w', W[i % 3][j] + '%')); };
    const last = a.versions.length - 1, sum = i => a.versions[i].summary || '';
    now.m = m; bindMeta(card, m); fill(m.i); openTip(op); kick.textContent = `${a.kind} · v${m.i + 1}`;
    m.on(i => { swap(kick, `${a.kind} · v${i + 1}`); swap(p, sum(i)); fill(i); });
    const vb = $('.afx-vb', card); if (vb) vmenu(k, m, vb, wrap);
    k.on($('.afx-copy', card), 'click', e => doCopy(e.currentTarget, m));
    k.on($('.afx-dl', card), 'click', e => doDownload(e.currentTarget, m));
    k.on(op, 'click', () => { if (!card.classList.contains('is-writing')) open(k, m, wrap, { kind:'page', opener:op, src:$('.afx-pv-page', main) }); });
    c.run(async () => {
      await k.wait(300);
      await phases(k, a, $('.afx-meta .afx-wr', card), j => {
        if (j === 1){
          // the summary is written out a few letters at a time, with a caret
          const s = sum(last);
          if (REDUCE){ p.textContent = s; return; }
          let n = 0; const id = k.every(22, () => { n = Math.min(s.length, n + 3); p.innerHTML = esc(s.slice(0, n)) + '<span class="afx-caret"></span>'; if (n >= s.length) clearInterval(id); });
        }
        if (j === 2){ p.textContent = sum(last); if (!REDUCE) $$('.afx-pv-ls i', main).forEach((e, x) => e.animate([{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }], { duration:420, delay:x * 180, easing:cssEase(root), fill:'forwards' })); }
      });
      p.textContent = sum(m.i);
      $$('.afx-pv-ls i', main).forEach(e => e.getAnimations().forEach(x => x.cancel()));
      settle(card, m);
    });
  }

  /* inline: one line inside the message, like a file you attached; versions and actions fold out on hover or focus */
  function inline(k){
    const a = art, m = model(a);
    main.innerHTML = `<div class="afx-w afx-in">${own ? '<div class="bub">Review our pricing page and tell me what to fix first.</div>' : ''}<div class="afx-in-msg">
      ${own ? '<p>I went through the pricing page from top to bottom and wrote up what to fix first.</p>' : ''}
      <span class="afx-chip is-writing">
        <button type="button" class="afx-in-main" disabled><span class="afx-in-ic"><span class="spin" aria-hidden="true"></span>${ic(a.icon, 's')}</span><span class="afx-in-t"><span class="afx-sr">Open </span>${esc(a.title)}</span><span class="afx-in-m"><span class="afx-wr shim">${esc(a.steps[0])}</span><span class="afx-fin"><span class="afx-v"></span><span class="afx-msep" aria-hidden="true">·</span><span class="afx-when"></span></span></span></button>
        <span class="afx-tray"><span>
          <span class="afx-tsep" aria-hidden="true"></span>
          ${a.versions.length > 1 ? `<button type="button" class="ib afx-vb3" aria-label="Versions" data-tip="Versions">${ic('history', 's')}</button>` : ''}
          <button type="button" class="ib afx-copy" aria-label="Copy ${esc(a.title)}" data-tip="Copy">${ic('copy', 's')}</button>
          <button type="button" class="ib afx-dl" aria-label="Download ${esc(a.title)}" data-tip="Download">${ic('down', 's')}</button>
        </span></span>
      </span>
      ${own ? '<p>The short version: the plan table is where people stall, and three small changes should move most of them on.</p>' : ''}
    </div></div>`;
    const wrap = $('.afx-w', main), chip = $('.afx-chip', main), btn = $('.afx-in-main', main), vb = $('.afx-vb3', main);
    now.m = m; bindMeta(chip, m);
    if (opts.openLabel) btn.dataset.tip = opts.openLabel;
    if (vb) vmenu(k, m, vb, wrap, { onOpen:() => chip.classList.add('pin'), onClose:() => chip.classList.remove('pin') });
    k.on($('.afx-copy', chip), 'click', e => doCopy(e.currentTarget, m));
    k.on($('.afx-dl', chip), 'click', e => doDownload(e.currentTarget, m));
    k.on(btn, 'click', () => open(k, m, wrap, { kind:'view', opener:btn }));
    c.run(async () => {
      await k.wait(300);
      await phases(k, a, $('.afx-in-m .afx-wr', chip));
      btn.disabled = false; settle(chip, m);
    });
  }

  /* stack: the report as a stack of paper. The newest page is written onto it; Versions lays the sheets out to pick one */
  function stack(k){
    const a = art, m = model(a), N = a.versions.length, top = N - 1, T = a.title;
    // the drawn lines stand for each page's text: p a paragraph line, b a bullet, n a numbered fix, s a gap
    const LINES = [
      [['p', 94], ['p', 72], ['s'], ['b', 82], ['b', 74], ['b', 66], ['b', 78], ['s'], ['p', 88], ['p', 52]],
      [['p', 92], ['p', 86], ['p', 56], ['s'], ['b', 80], ['b', 72], ['b', 86], ['b', 64], ['s'], ['p', 70]],
      [['p', 90], ['p', 78], ['s'], ['n', 84], ['n', 70], ['n', 78], ['s'], ['b', 76], ['b', 68], ['b', 82]]
    ];
    const lines = j => LINES[j === top ? 2 : j % 2].map(([t, w]) => t === 's' ? '<span class="afx-gap"></span>' : `<span class="afx-r ${t}">${t === 'p' ? '' : '<b></b>'}<i style="--dm-w:${w}%"></i></span>`).join('');
    main.innerHTML = `<div class="afx-w afx-st is-writing">
      <div class="afx-desk"><div class="afx-stack" role="menu" aria-label="Versions of ${esc(T)}" aria-hidden="true">${a.versions.map((v, j) => `<button type="button" class="afx-sh${j === top ? ' blank' : ''}" role="menuitemradio" tabindex="-1" data-i="${j}" aria-checked="${j === top}" aria-label="v${j + 1}, ${esc(v.when)}: ${esc(v.note)}"><span class="afx-pg" aria-hidden="true"><span class="afx-st-k"><span>${j === top ? 'Writing…' : 'v' + (j + 1)}</span></span><span class="afx-st-h">${j === top ? '' : esc(T)}</span><span class="afx-st-ls">${lines(j)}</span>${j === top ? '<span class="afx-pen"></span>' : ''}</span><span class="afx-tab" aria-hidden="true">${ic('check', 'xs')}<span>v${j + 1}</span><span class="afx-ta"> · ${esc(v.ago)}</span></span></button>`).join('')}</div></div>
      <div class="afx-cap">
        <div class="afx-st-t">${esc(T)}</div>
        <div class="afx-meta afx-st-m"><span class="afx-wr shim">${esc(a.steps[0])}</span><span class="afx-fin"></span></div>
        <div class="fold shut afx-nw"><div><div class="afx-note"></div></div></div>
      </div>
      <div class="afx-st-act">
        ${N > 1 ? `<button type="button" class="pill sm line afx-fan" aria-haspopup="menu" aria-expanded="false">${ic('layers', 's')}<span>Versions</span></button>` : ''}
        ${acts(a, `<button type="button" class="pill sm accent afx-open" aria-label="Open ${esc(T)}">${ic('max', 's')}<span class="afx-lbl">Open</span></button>`)}
      </div>
    </div>`;
    const el = $('.afx-st', main), wrap = el, stk = $('.afx-stack', main), tog = $('.afx-fan', main), op = $('.afx-open', main);
    const sheets = $$('.afx-sh', main), note = $('.afx-note', main), nw = $('.afx-nw', main), fin = $('.afx-st-m .afx-fin', main);
    now.m = m; openTip(op);
    if (tog) tog.setAttribute('aria-controls', stk.id = uid());
    let fanned = false, peek = null, writing = true;
    // laid out, the sheets fan from left to right, oldest first; stacked, the shown version is on top and the rest sit
    // behind it in order, straight, a little further back each (the CSS peeks them out on hover and focus)
    const layout = () => sheets.forEach((sh, j) => {
      if (fanned){ const o = j - (N - 1) / 2; sh.style.transform = `translate(calc(${o} * var(--dm-fx)),${Math.abs(o) * 6 + (peek === j ? -8 : 0)}px) rotate(${o * 6}deg)`; sh.style.zIndex = peek === j ? 9 : j + 1; }
      else { const rest = sheets.map((x, y) => y).reverse().filter(y => y !== m.i), d = j === m.i ? 0 : rest.indexOf(j) + 1; sh.style.transform = ''; sh.style.setProperty('--dm-d', d); sh.style.zIndex = N - d; }
      sh.setAttribute('aria-checked', String(j === m.i));
    });
    // while the sheets are laid out, the caption reads out the one under the pointer or the focus
    const caption = j => {
      const i = j == null ? m.i : j;
      fin.innerHTML = `<span>${esc(a.kind)}</span><span aria-hidden="true">·</span><span class="afx-v">v${i + 1}</span><span aria-hidden="true">·</span><span class="afx-when">${whenHTML(a.versions[i])}</span>`;
      note.textContent = a.versions[i].note;
    };
    const setFan = (on, focus) => {
      if (writing) return;
      fanned = on; peek = null; el.classList.toggle('fan', on);
      tog.setAttribute('aria-expanded', String(on)); stk.setAttribute('aria-hidden', String(!on));
      sheets.forEach(sh => { sh.tabIndex = on && +sh.dataset.i === m.i ? 0 : -1; });
      nw.classList.toggle('shut', !on); layout(); caption();
      if (on && focus) sheets[m.i].focus({ preventScroll:true });
    };
    const pick = j => { m.set(j); setFan(false); tog.focus({ preventScroll:true }); };
    m.on(i => { layout(); caption(); say(`Showing v${i + 1}, ${a.versions[i].when}`); });
    layout(); caption();
    if (tog) k.on(tog, 'click', () => setFan(!fanned, true));
    sheets.forEach((sh, j) => {
      k.on(sh, 'click', () => { if (writing) return; if (fanned) pick(j); else op.click(); });
      const look = on => { if (!fanned) return; peek = on ? j : null; layout(); caption(peek); };
      k.on(sh, 'pointerenter', () => look(true)); k.on(sh, 'pointerleave', () => look(false));
      k.on(sh, 'focus', () => look(true)); k.on(sh, 'blur', () => look(false));
    });
    k.on(stk, 'keydown', e => {
      if (!fanned) return;
      const j = sheets.indexOf(document.activeElement); let n = null;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') n = Math.min(N - 1, j + 1);
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') n = Math.max(0, j - 1);
      else if (e.key === 'Home') n = 0; else if (e.key === 'End') n = N - 1;
      else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); setFan(false); tog.focus({ preventScroll:true }); return; }
      else if (e.key === 'Tab'){ setFan(false); return; }
      if (n != null){ e.preventDefault(); sheets.forEach((sh, y) => { sh.tabIndex = y === n ? 0 : -1; }); sheets[n].focus(); }
    });
    k.on(document, 'pointerdown', e => { if (fanned && !stk.contains(e.target) && !(tog && tog.contains(e.target))) setFan(false); });
    k.on($('.afx-copy', main), 'click', e => doCopy(e.currentTarget, m));
    k.on($('.afx-dl', main), 'click', e => doDownload(e.currentTarget, m));
    k.on(op, 'click', () => { if (writing) return; if (fanned) setFan(false); open(k, m, wrap, { kind:'page', opener:op, src:sheets[m.i] }); });
    // writing: a blank sheet drops onto the stack, the title is typed, and a pen draws each line of the new page
    c.run(async () => {
      const sh = sheets[top], pen = $('.afx-pen', sh), title = $('.afx-st-h', sh), kick = $('.afx-st-k span', sh), E = cssEase(root);
      if (!REDUCE) sh.animate([{ transform:'translateY(-36px)', opacity:0 }, { transform:'none', opacity:1 }], { duration:cssMs(root, '--dm-t-slow'), easing:E, composite:'add' });
      await k.wait(300);
      const w = $('.afx-st-m .afx-wr', main), st = a.steps;
      swap(w, st[0]);
      if (REDUCE){ await k.wait(500); title.textContent = T; }
      else for (let n = 1; n <= T.length; n++){ title.textContent = T.slice(0, n); await k.wait(40); }
      await k.wait(REDUCE ? 0 : 250);
      swap(w, st[1]);
      const rows = $$('.afx-r', sh).filter(x => x.offsetParent);
      for (let j = 0; j < rows.length; j++){
        const x = rows[j], line = $('i', x), dot = $('b', x);
        if (j === 3) swap(w, st[2]);
        if (REDUCE){ await k.wait(150); continue; }
        const x0 = x.offsetLeft + line.offsetLeft, x1 = x0 + line.offsetWidth, y = x.offsetTop + x.offsetHeight / 2 - 3.5, ms = 260 + line.offsetWidth * 1.4;
        if (dot) dot.animate([{ transform:'scaleX(0)' }, { transform:'none' }], { duration:120, fill:'forwards' });
        line.animate([{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }], { duration:ms, easing:'cubic-bezier(.4,0,.3,1)', fill:'forwards' });
        pen.animate([{ transform:`translate(${x0 - 3}px,${y}px)`, opacity:1 }, { transform:`translate(${x1 - 3}px,${y}px)`, opacity:1 }], { duration:ms, easing:'cubic-bezier(.4,0,.3,1)', fill:'forwards' });
        await k.wait(ms + 70);
      }
      pen.getAnimations().forEach(x => x.cancel());
      $$('.afx-r :is(i,b)', sh).forEach(e => e.getAnimations().forEach(x => x.cancel()));
      sh.classList.remove('blank'); title.textContent = T; kick.textContent = 'v' + N;
      if (!REDUCE) sh.animate([{ transform:'translateY(-6px)' }, { transform:'none' }], { duration:cssMs(root, '--dm-t'), easing:E, composite:'add' });
      writing = false; settle(el, m);
    });
  }

  /* the switcher under the stage: each variant replays its writing state when it comes in */
  const VIEWS = { compact, preview, inline, stack };
  function show(v){
    if (K) K.stop();
    const sh = $(':scope>.afx-sheet', root); if (sh) sh.remove();
    main.inert = false; if (demo) demo.inert = false; hideTip();
    K = sub(); view = v; now = { ready:false, m:null };
    VIEWS[v](K);
  }
  // picking a variant is the person taking over, so the story stops there
  if (demo) seg($('.seg2', demo), v => { if (v !== view){ c.mine = true; show(v); enter(main.firstElementChild); } });
  // for the component it sits in: show another file, and say what Open does there instead
  root._afx = { use(a, o = {}){ art = a; opts = o; show(view); }, get version(){ return now.m ? now.m.i : art.versions.length - 1; } };
  show('compact');
  // the preview's story: the report is written, then someone opens its versions, reads v2 and goes back to v3
  if (own) c.story(async s => {
    await s.until(() => now.ready); await s.beat(3);
    const vb = $('[data-a="main"] .afx-vb', main), item = i => $(`.afx-menu .mi[data-i="${i}"]`, main);
    await s.tap(vb); await s.beat(2);
    await s.tap(item(1)); await s.beat(4);
    await s.tap(vb); await s.beat(2);
    await s.tap(item(2)); await s.beat(3);
    s.away(); await s.beat(1);
  });
});
