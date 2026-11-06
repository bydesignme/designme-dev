// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, REDUCE, closePops, enter, html, placePop, stagger, swap } from '../core/core.js';
DM.def('knowledge-sources', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{plus}', I('plus','xs')).replace('{refresh}', I('refresh','xs')).replace('{trash}', I('trash','xs'));
  // a source's type gives it its icon: uploaded files, a website the agent crawls, or a connected folder of docs
  const KIND = { files:['file-text','var(--dm-pp)'], web:['globe','var(--dm-pb)'], folder:['folder','var(--dm-pm)'] };
  // a connected folder and a set of uploads are ready, and a PDF is being read. One source indexes at a time and the rest
  // wait in line; a source's chunks count once it has been indexed. `ms` is how long a full pass takes in this preview
  const S = [
    { kind:'folder', name:'Product docs', n:86, unit:'pages', chunks:642, st:'ready', ago:'2m ago', had:true, ms:2500 },
    { kind:'files', name:'Sales playbooks', n:18, unit:'files', chunks:318, st:'ready', ago:'1h ago', had:true, ms:2500 },
    { kind:'files', name:'Brand book 2024.pdf', n:24, unit:'pages', chunks:48, st:'queued', ms:19000, fail:{ at:9, why:'Scanned PDF, no text found', fix:'Retry with OCR' } }
  ];
  const FOLDERS = [['Design specs', 'Google Drive', 57, 230], ['Research notes', 'Notion', 31, 124]];
  const list = $('.ksx-list', r), st = $('.ksx-st', r), add = $('.ksx-add', r), pop = $('.ksx-pop', r), mpop = $('.ksx-mpop', r), file = $('.ksx-file', r);
  const fmt = n => n.toLocaleString('en-US');
  const of = (n, unit) => fmt(n) + ' ' + (n === 1 ? unit.slice(0, -1) : unit);
  const line = x => x.st === 'queued' ? (x.ocr ? 'Queued to read with OCR' : 'Queued') : x.st === 'failed' ? x.fail.why : of(x.n, x.unit) + ' · Synced ' + x.ago;
  function row(x){
    const [ic, col] = KIND[x.kind];
    x.el = html(`<div class="ksx-s" role="listitem"><span class="ic" style="color:${col};background:color-mix(in srgb,${col} 12%,transparent)" aria-hidden="true">${I(ic,'xs')}</span><span class="t"><span class="nm"></span><span class="d"></span></span><button class="ib ksx-more" aria-haspopup="menu" aria-expanded="false" data-tip="More" data-pop=".ksx-mpop" data-pop-align="end">${I('more')}</button><div class="ksx-fx fold shut" inert><div><div><button class="pill accent sm ksx-fix"></button><button class="pill ghost sm ksx-del">Remove</button></div></div></div></div>`);
    $('.nm', x.el).textContent = x.name; $('.ksx-more', x.el).setAttribute('aria-label', 'Actions for ' + x.name);
    $('.ksx-fix', x.el).onclick = () => { x.ocr = true; x.st = 'queued'; x.ms = 3000; paint(x); next(); };
    $('.ksx-del', x.el).onclick = () => remove(x);
    paint(x, true); return x.el;
  }
  // the progress bar and its count, while a source is being indexed
  function prog(x){
    const bar = $('.ksx-bar', x.el); if (!bar) return; const k = Math.floor(x.done);
    $('i', bar).style.width = k / x.n * 100 + '%'; bar.setAttribute('aria-valuenow', k);
    $('.num', x.el).textContent = fmt(k) + ' of ' + of(x.n, x.unit);
  }
  function paint(x, now){
    const d = $('.d', x.el); x.el.dataset.st = x.st;
    // the bar goes through the same swap as the line before it, so a line still swapping in can't land on top of it
    if (x.st === 'indexing'){ const bar = `<span class="ksx-bar" role="progressbar" aria-label="Indexing ${x.name.replace(/[<&"]/g, '')}" aria-valuemin="0" aria-valuemax="${x.n}"><i style="width:0"></i></span><span class="num"></span>`; if (now){ d.innerHTML = bar; prog(x); } else swap(d, bar, true); }
    else { const t = document.createElement('span'); t.textContent = line(x); if (now) d.replaceChildren(t); else swap(d, t.outerHTML, true); }
    const fx = $('.ksx-fx', x.el), on = x.st === 'failed';
    if (on) $('.ksx-fix', x.el).textContent = x.fail.fix;
    fx.classList.toggle('shut', !on); fx.inert = !on;
  }
  const total = () => `${S.length} source${S.length === 1 ? '' : 's'} · ${fmt(S.reduce((a, x) => a + (x.had ? x.chunks : 0), 0))} chunks`;
  const counts = now => { if (now) st.textContent = total(); else swap(st, total()); };
  // the one being indexed moves on every tick; a scanned PDF stops where its text runs out, until it is read with OCR
  function next(){
    if (S.some(x => x.st === 'indexing')) return;
    const x = S.find(y => y.st === 'queued'); if (!x) return;
    x.st = 'indexing'; x.done = 0; paint(x);
  }
  c.every(100, () => {
    const x = S.find(y => y.st === 'indexing'); if (!x) return;
    x.done = Math.min(x.n, x.done + x.n * 100 / x.ms);
    if (x.fail && !x.ocr && x.done >= x.fail.at){ x.st = 'failed'; paint(x); counts(); return next(); }
    prog(x);
    if (x.done >= x.n){ x.st = 'ready'; x.ago = 'just now'; x.had = true; paint(x); counts(); next(); }
  });
  function addSource(x){ x.st = 'queued'; S.push(x); list.appendChild(row(x)); enter(x.el); counts(); next(); }
  function remove(x){
    const i = S.indexOf(x); if (i < 0) return; S.splice(i, 1); counts(); next();
    x.el.classList.add('leave'); c.later(REDUCE ? 0 : 340, () => x.el.remove());
  }
  S.forEach(x => list.appendChild(row(x))); stagger([...list.children], 50); counts(true); next();
  // Re-sync and Remove act on the row whose button opened the menu; a source still waiting or indexing can't be re-synced yet
  let cur = null;
  c.on(list, 'click', e => { const b = e.target.closest('.ksx-more'); if (!b) return; cur = S.find(x => x.el.contains(b)); $('.ksx-rs', mpop).disabled = !cur || cur.st === 'queued' || cur.st === 'indexing'; });
  $('.ksx-rs', mpop).onclick = () => { if (!cur || !S.includes(cur)) return; cur.st = 'queued'; cur.ms = cur.ocr ? 3000 : cur.fail ? 19000 : 2500; paint(cur); next(); };
  $('.ksx-rm', mpop).onclick = () => cur && remove(cur);
  // Add source: upload files (the file picker), add a website (its address), or connect a folder (from the ones offered)
  function view(v){
    if (v === 'web') pop.innerHTML = `<form class="ksx-web"><div class="ph">Add a website</div><div class="ksx-in">${I('globe','xs')}<input placeholder="example.com/docs" aria-label="Website address" spellcheck="false" autocomplete="off"><button class="pill accent sm" type="submit">Add</button></div></form>`;
    else if (v === 'folder') pop.innerHTML = '<div class="ph">Connect a folder</div>' + (FOLDERS.length ? FOLDERS.map((f, i) => `<button class="mi" role="menuitem" data-close data-i="${i}">${I('folder','xs')}<span>${f[0]}<span class="d">${f[1]}</span></span></button>`).join('') : '<div class="ph">All folders connected</div>');
    else pop.innerHTML = [['upload', 'Upload files', 'files'], ['globe', 'Add a website', 'web'], ['folder', 'Connect a folder', 'folder']].map(([ic, t, k]) => `<button class="mi" role="menuitem" data-v="${k}"${k === 'files' ? ' data-close' : ''}>${I(ic,'xs')}<span>${t}</span></button>`).join('');
  }
  view('main');
  c.on(add, 'click', () => { if (!pop.classList.contains('open')) view('main'); });
  // a step inside the menu swaps its content after the click has been handled, so the click still counts as inside it
  c.on(pop, 'click', e => {
    const m = e.target.closest('.mi'); if (!m) return;
    if (m.dataset.v === 'files') return file.click();
    if (m.dataset.v){ const v = m.dataset.v, mine = e.isTrusted; c.later(0, () => { view(v); placePop(add, pop); if (mine && v === 'web') $('input', pop).focus({ preventScroll:true }); }); return; }
    if (m.dataset.i){ const f = FOLDERS.splice(+m.dataset.i, 1)[0]; addSource({ kind:'folder', name:f[0], n:f[2], unit:'pages', chunks:f[3], ms:3000 }); }
  });
  c.on(pop, 'submit', e => {
    e.preventDefault(); const inp = $('input', pop), v = inp.value.trim().replace(/^https?:\/\//, '').replace(/\/$/, '');
    if (!v) return inp.focus();
    closePops(); addSource({ kind:'web', name:v, n:142, unit:'pages', chunks:196, ms:4500 });
  });
  file.onchange = () => { const fs = [...file.files]; if (!fs.length) return;
    addSource({ kind:'files', name:fs.length === 1 ? fs[0].name : fs.length + ' files', n:fs.length, unit:'files', chunks:fs.length * 12, ms:1500 }); file.value = ''; };
  // the preview's story: add the docs site, which waits its turn; the PDF turns out to be a scan, so read it with OCR, and
  // everything ends up indexed
  c.story(async s => {
    const pdf = S[2];
    await s.beat(3);
    await s.tap(add); await s.beat(2);
    await s.tap($('.mi[data-v="web"]', pop)); await s.beat(1);
    const inp = $('input', pop);
    await s.type(inp, 'designme.dev/docs', { n:.1, keep:true });
    await s.beat(1);
    await s.tap($('button[type="submit"]', pop)); s.away();
    await s.until(() => pdf.st === 'failed'); await s.beat(2);
    await s.tap($('.ksx-fix', pdf.el)); s.away();
    await s.until(() => S.every(x => x.st === 'ready')); await s.beat(1);
  });
});
