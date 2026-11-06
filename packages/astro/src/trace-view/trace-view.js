// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, enter, html, swap } from '../core/core.js';
DM.def('trace-view', (r, c) => {
  // the kinds of span, each with its mark and colour: the identity slots of the chart palette, and grey for the agents
  // that hold the other spans. The name is always on the mark, in a tooltip, and in the span's label
  const K = { agent:['Agent','cpu','var(--dm-muted)'], llm:['LLM call','spark','var(--dm-c2)'], tool:['Tool call','term','var(--dm-c6)'], ret:['Retrieval','search','var(--dm-c3)'] };
  // one run, in seconds from its start. A tool call that takes longer than SLOW seconds is flagged
  const SPAN = 5, SLOW = 2, PACE = 1.5;
  const S = [
    { id:'run', k:'agent', n:'Pricing research', s:0, d:4.82, lv:0, in:"Compare Northwind's plans with ours", out:'3 prices saved to Pricing research' },
    { id:'plan', k:'llm', n:'Plan the steps', s:.04, d:.62, tk:1240, lv:1, in:'The task and 2 earlier messages', out:'Search notes, fetch the page, summarise' },
    { id:'notes', k:'ret', n:'Search saved notes', s:.7, d:.38, tk:910, lv:1, in:'"northwind pricing", top 4', out:'4 notes, best match 0.82' },
    { id:'fetch', k:'tool', n:'fetch_page', s:1.12, d:2.46, tk:3120, lv:1, in:'GET northwind.app/pricing', out:'200 OK, 48 KB, 3 plans' },
    { id:'sum', k:'agent', n:'Summariser', s:3.62, d:1.02, lv:1, in:'The page and 4 notes', out:'A 120-word summary' },
    { id:'write', k:'llm', n:'Write the summary', s:3.66, d:.94, tk:2380, lv:2, in:'Page text and notes, 2,050 tokens', out:'120 words, 3 prices' },
    { id:'ans', k:'llm', n:'Final answer', s:4.66, d:.16, tk:560, lv:1, in:'The summary', out:'3 prices saved to Pricing research' }
  ];
  const END = Math.max(...S.map(x => x.s + x.d));
  // an agent span counts the tokens of every span under it
  S.forEach((x, i) => { x.kids = []; for (let j = i + 1; j < S.length && S[j].lv > x.lv; j++) x.kids.push(S[j]); });
  const root = $('.trv', r), rows = $('.trv-rows', r), stEl = $('.trv-st', r), tot = $('.trv-tot', r), dt = $('.trv-dt', r), dc = $('.trv-dc', r), lg = $('.trv-lg', r);
  // the key: every kind but the agents, with its colour and how many of its spans have started
  const KEYS = ['llm', 'tool', 'ret'];
  lg.innerHTML = KEYS.map(k => `<span role="listitem" class="z" data-k="${k}" style="--dm-k:${K[k][2]}"><i></i>${K[k][0]} <b class="num">0</b></span>`).join('');
  // each span's parent, for the tree's guides
  S.forEach((x, i) => { for (let j = i - 1; j >= 0; j--) if (S[j].lv === x.lv - 1){ x.up = S[j]; break; } });
  $('.trv-sc', r).innerHTML = Array.from({ length:Math.ceil(SPAN / 2) }, (_, i) => `<span style="left:${i * 2 / SPAN * 100}%">${i * 2}s</span>`).join('');
  const sec = v => v.toFixed(2) + 's', tks = v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v));
  let T = 0, sel = null, said = '';
  S.forEach(x => {
    const [kind, icon, col] = K[x.k];
    x.el = html(`<button type="button" class="trv-r${x.lv ? '' : ' root'}" data-k="${x.k}" aria-expanded="false" style="--dm-k:${col};--dm-lv:${x.lv}" hidden><span class="trv-n"><span class="trv-g" aria-hidden="true"></span><span class="trv-k" data-tip="${kind}">${I(icon,'xs')}</span><span class="trv-nm">${x.n}</span></span><span class="trv-b"><i style="left:${x.s / SPAN * 100}%;width:${x.d / SPAN * 100}%"></i></span><span class="trv-tk num"></span><span class="trv-ms num"></span></button>`);
    x.el.onclick = () => open(x === sel ? null : x);
    rows.appendChild(x.el);
  });
  // where the run is: each span shows once it starts, its bar and its numbers grow while it runs
  const took = x => Math.max(0, Math.min(T, x.s + x.d) - x.s);
  const used = x => x.k === 'agent' ? x.kids.reduce((a, k) => a + (k.k === 'agent' ? 0 : used(k)), 0) : x.tk * Math.min(1, took(x) / x.d);
  // the tree's guides for the spans on show: a line on down past a parent's mark, an elbow into each child, and the lines of
  // ancestors whose own siblings are still to come
  const vis = x => !x.el.hidden, later = x => S.some(y => y !== x && y.up === x.up && S.indexOf(y) > S.indexOf(x) && vis(y));
  function tree(){
    S.forEach(x => {
      if (!vis(x)) return;
      let h = '';
      for (let a = x.up; a && a.up; a = a.up) if (later(a)) h += `<i style="--dm-x:${a.lv - 1}"></i>`;
      if (x.up) h += `<i class="el${later(x) ? '' : ' end'}" style="--dm-x:${x.lv - 1}"></i>`;
      if (S.some(y => y.up === x && vis(y))) h += `<i class="dn" style="--dm-x:${x.lv}"></i>`;
      $('.trv-g', x.el).innerHTML = h;
    });
  }
  let had = 0, txtAt = -1e9;
  function paint(){
    let shown = 0;
    // the times and token counts change ten times a second, not every frame: each change of text lays the page out
    const now = performance.now(), txt = T >= END || now - txtAt >= 100; if (txt) txtAt = now;
    S.forEach(x => {
      if (T < x.s) return; shown++;
      if (x.el.hidden){ x.el.hidden = false; enter(x.el); }
      const w = took(x), run = T < x.s + x.d, kind = K[x.k][0];
      x.el.classList.toggle('run', run);
      const f = x.d ? w / x.d : 1; if (f !== x._f){ x._f = f; $('.trv-b i', x.el).style.setProperty('--dm-f', f.toFixed(4)); }
      // (what's on screen is kept under _names, apart from the span's own data)
      const say = txt || (!run && !x._fin); if (!run) x._fin = true;
      if (say){ const ms = sec(w), tk = tks(used(x)); if (x._ms !== ms){ x._ms = ms; $('.trv-ms', x.el).textContent = ms; } if (x._tk !== tk){ x._tk = tk; $('.trv-tk', x.el).textContent = tk; } }
      if (x.k === 'tool' && w > SLOW && !x.slow){
        x.slow = true; x.el.classList.add('slow');
        const why = `Over the ${SLOW}s budget for a tool call`, tg = html(`<span class="tag warn" data-tip="${why}">slow</span>`); $('.trv-n', x.el).appendChild(tg); enter(tg);
        $('.trv-ms', x.el).dataset.tip = why;
      }
      if (say){ const al = `${x.n}, ${kind}, ${run ? 'running, ' : ''}${sec(w)}, ${Math.round(used(x)).toLocaleString('en-US')} tokens${x.slow ? ', slow' : ''}`; if (x._al !== al){ x._al = al; x.el.setAttribute('aria-label', al); } }
    });
    if (shown !== had){ had = shown; tree();
      KEYS.forEach(k => { const n = S.filter(x => x.k === k && vis(x)).length, el = $(`[data-k="${k}"]`, lg), b = $('b', el); el.classList.toggle('z', !n); if (b.textContent !== String(n)){ b.textContent = n; if (n) enter(b); } }); }
    // the playhead runs down every track while the run streams, and fades once it is done
    root.style.setProperty('--dm-now', Math.min(T, END) / SPAN); root.classList.toggle('live', T > 0 && T < END);
    if (txt) tot.textContent = sec(Math.min(T, END));
    const slow = S.filter(x => x.slow).length;
    const line = T >= END ? `Done · ${S.length} spans${slow ? `, ${slow} slow` : ''}` : `Running · ${shown} span${shown > 1 ? 's' : ''}`;
    if (line !== said){ said = line; swap($('.m', stEl), line); }
    if (sel) fill();
  }
  // a span's details: what went in, what came out, how long it took and what it used
  function open(x){
    if (sel) sel.el.setAttribute('aria-expanded', 'false');
    sel = x; dt.classList.toggle('shut', !x); dt.inert = !x; rows.classList.toggle('sel', !!x);
    if (!x) return;
    x.el.setAttribute('aria-expanded', 'true');
    const [kind, icon, col] = K[x.k];
    dc.innerHTML = `<div class="trv-dh"><span class="trv-k" style="--dm-k:${col}">${I(icon,'xs')}</span><b>${x.n}</b>${x.slow ? '<span class="tag warn">slow</span>' : ''}<button class="ib trv-x" aria-label="Close details" data-tip="Close">${I('x')}</button></div>
      <div class="trv-pos" aria-hidden="true" style="--dm-k:${col}"><i style="left:${x.s / SPAN * 100}%"></i></div>
      <div class="trv-kv"><div><span>Kind</span><b>${kind}</b></div><div><span>Starts at</span><b class="num">${sec(x.s)}</b></div><div><span>Latency</span><b class="num lt"></b></div><div><span>Tokens</span><b class="num tk"></b></div></div>
      <div class="trv-io"><span>Input</span><code>${x.in}</code><span>Output</span><code class="out"></code></div>`;
    // closing hands focus back to the span, if it was inside the details
    $('.trv-x', dc).onclick = () => { const el = sel.el, back = dc.contains(document.activeElement); open(null); if (back) el.focus({ preventScroll:true }); };
    fill(); enter(dc);
  }
  function fill(){
    const x = sel, done = T >= x.s + x.d;
    $('.lt', dc).textContent = sec(took(x)); $('.tk', dc).textContent = Math.round(used(x)).toLocaleString('en-US'); $('.trv-pos i', dc).style.width = (took(x) / SPAN * 100) + '%';
    const o = $('.out', dc), t = done ? x.out : 'Running…'; if (o.textContent !== t) o.textContent = t;
  }
  // the arrow keys move between spans, and Escape shuts the details
  c.on(r, 'keydown', e => {
    if (e.key === 'Escape' && sel){ const el = sel.el; open(null); el.focus({ preventScroll:true }); return; }
    const vis = S.filter(x => !x.el.hidden), i = vis.findIndex(x => x.el === document.activeElement); if (i < 0) return;
    const go = e.key === 'ArrowDown' ? vis[i + 1] : e.key === 'ArrowUp' ? vis[i - 1] : e.key === 'Home' ? vis[0] : e.key === 'End' ? vis[vis.length - 1] : undefined;
    if (go === undefined && !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault(); if (go) go.el.focus({ preventScroll:true });
  });
  stEl.innerHTML = '<span class="m">Running</span>';
  // the run streams in at a pace a person can follow: one second of the run every PACE seconds
  c.later(600, () => { const t0 = performance.now(); c.loop(t => { T = Math.min(END, (t - t0) / 1000 / PACE); paint(); return T < END ? undefined : false; }); });
  // the preview's story: the fetch runs long and turns amber, the person reads why, opens it, then closes it
  c.story(async s => {
    const f = S.find(x => x.id === 'fetch');
    await s.until(() => f.slow); await s.beat(2);
    // on a narrow card the tag is hidden, and the time carries the same tooltip
    const tg = $('.tag', f.el); await s.point(tg.offsetWidth ? tg : $('.trv-ms', f.el)); await s.beat(3); s.away();
    await s.until(() => T >= END); await s.beat(1);
    await s.tap(f.el); s.away(); await s.beat(8);
    await s.tap($('.trv-x', r)); s.away(); await s.beat(2);
  });
});
