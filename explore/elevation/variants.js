/* Twenty Soft elevations. Each story settles on a live mixed state. */
(function () {
  const { COPY, el, ic, esc, hi, seg, money, sumTree, clone, count } = ELEV;
  const add = (id, fns) => { ELEV[id] = Object.assign(ELEV[id] || {}, fns); };
  const size = b => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
  const ext = n => (n.split('.').pop() || 'file').toUpperCase().slice(0, 4);

  async function threadA(host, s) {
    const threads = clone(COPY.threads);
    host.innerHTML = `<div class="ta"><div class="ta-rail" role="tablist"></div><div class="ta-deck"><div class="ta-peek p2"></div><div class="ta-peek p1"></div><div class="ta-front"><div class="ta-body" aria-live="polite"></div><form class="ta-in"><input class="field" aria-label="Reply" placeholder="Reply to the agent"><button class="send" aria-label="Send" disabled>${ic('up', 'i s')}</button></form></div></div></div>`;
    const rail = host.querySelector('.ta-rail');
    const body = host.querySelector('.ta-body');
    const field = host.querySelector('.field');
    const send = host.querySelector('.send');
    const front = host.querySelector('.ta-front');
    let cur = 0, taken = false;
    rail.innerHTML = threads.map((t, i) => `<button class="ta-tab" role="tab" aria-selected="${i === 0}"><span class="dot" style="color:${t.col}"></span>${esc(t.t)}</button>`).join('');
    const tabs = [...rail.querySelectorAll('.ta-tab')];
    const peeks = [...host.querySelectorAll('.ta-peek')];
    const src = list => list && list.length ? `<div class="ta-src">${list.map(x => `<span class="fchip">${ic('file', 'i xs')}${esc(x[0])}</span>`).join('')}</div>` : '';
    function paint(i, animate) {
      cur = i;
      tabs.forEach((b, k) => b.setAttribute('aria-selected', k === i ? 'true' : 'false'));
      const rest = threads.map((t, k) => k).filter(k => k !== i);
      peeks[0].textContent = threads[rest[1]].t;
      peeks[1].textContent = threads[rest[0]].t;
      if (animate) { front.classList.remove('swap'); void front.offsetWidth; front.classList.add('swap'); }
      body.innerHTML = threads[i].msgs.map((m, n) => m[0] === 'u'
        ? `<div class="ta-user${animate ? ' rise' : ''}" style="animation-delay:${n * 50}ms">${esc(m[1])}</div>`
        : `<div class="ta-agent${animate ? ' rise' : ''}" style="animation-delay:${n * 50}ms">${src(m[2])}${esc(m[1])}</div>`).join('');
      body.scrollTop = body.scrollHeight;
    }
    tabs.forEach((b, i) => b.addEventListener('click', () => paint(i, true)));
    field.addEventListener('input', () => { send.disabled = !field.value.trim(); });
    field.addEventListener('focus', () => { taken = true; });
    host.querySelector('form').addEventListener('submit', e => {
      e.preventDefault();
      const v = field.value.trim(); if (!v) return;
      taken = true; field.value = ''; send.disabled = true;
      threads[cur].msgs.push(['u', v]); paint(cur, false);
      const k = cur;
      const hold = el('<div class="ta-agent"><span class="shim">Thinking</span></div>');
      body.appendChild(hold);
      setTimeout(() => {
        if (!hold.isConnected) return;
        threads[k].msgs.push(['a', COPY.followReply, []]);
        if (cur === k) paint(cur, false);
      }, s.reduce ? 0 : 800);
    });
    paint(0, true);
    if (!s.reduce) {
      await s.wait(900);
      if (taken || s.dead()) return;
      for (const ch of COPY.follow) {
        if (taken || s.dead()) return;
        field.value += ch; send.disabled = false;
        await s.wait(28);
      }
      await s.wait(280);
      if (!taken) host.querySelector('form').requestSubmit();
    }
  }

  async function threadB(host, s) {
    const threads = clone(COPY.threads);
    host.innerHTML = `<div class="tb"><div class="tb-panel"><div class="tb-switch" role="tablist"></div><div class="tb-log" aria-live="polite"></div></div><form class="tb-dock"><input class="field" aria-label="Reply" placeholder="Reply to the agent"><button class="send" aria-label="Send" disabled>${ic('up', 'i s')}</button></form></div>`;
    const sw = host.querySelector('.tb-switch');
    const log = host.querySelector('.tb-log');
    const field = host.querySelector('.field');
    const send = host.querySelector('.send');
    let cur = 0;
    sw.innerHTML = '<span class="tb-knob"></span>' + threads.map((t, i) => `<button role="tab" aria-selected="${i === 0}">${esc(t.t)}</button>`).join('');
    const tabs = [...sw.querySelectorAll('button')];
    const knob = sw.querySelector('.tb-knob');
    const place = () => { const b = tabs[cur]; knob.style.left = b.offsetLeft + 'px'; knob.style.width = b.offsetWidth + 'px'; };
    async function streamInto(node, text) {
      if (s.reduce) { node.textContent = text; return; }
      const caret = el('<span class="caret"></span>');
      node.appendChild(caret);
      for (const ch of text) { if (s.dead()) return; caret.before(document.createTextNode(ch)); await s.wait(12); }
      caret.remove();
    }
    async function paint(i) {
      cur = i;
      tabs.forEach((b, k) => b.setAttribute('aria-selected', k === i ? 'true' : 'false'));
      place();
      const msgs = threads[i].msgs;
      log.innerHTML = '';
      for (const m of msgs) {
        if (m[0] === 'u') log.appendChild(el(`<div class="tb-user rise">${esc(m[1])}</div>`));
        else {
          const block = el(`<div class="tb-agent rise">${m[2] && m[2].length ? `<div class="tb-src">${m[2].map(x => `<span class="fchip">${ic('file', 'i xs')}${esc(x[0])}</span>`).join('')}</div>` : ''}<p class="tb-say" style="margin:0"></p></div>`);
          log.appendChild(block);
          await streamInto(block.querySelector('.tb-say'), m[1]);
        }
      }
    }
    tabs.forEach((b, i) => b.addEventListener('click', () => { if (i !== cur) paint(i); }));
    field.addEventListener('input', () => { send.disabled = !field.value.trim(); });
    host.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      const v = field.value.trim(); if (!v) return;
      field.value = ''; send.disabled = true;
      threads[cur].msgs.push(['u', v], ['a', COPY.followReply, []]);
      log.appendChild(el(`<div class="tb-user rise">${esc(v)}</div>`));
      const block = el('<div class="tb-agent rise"><p class="tb-say" style="margin:0"><span class="shim">Thinking</span></p></div>');
      log.appendChild(block);
      await s.wait(500);
      if (!block.isConnected) return;
      const say = block.querySelector('.tb-say'); say.textContent = '';
      await streamInto(say, COPY.followReply);
    });
    requestAnimationFrame(place);
    new ResizeObserver(place).observe(sw);
    await paint(0);
  }

  function toolCard(k, state, open) {
    const running = state === 'run';
    return `<div class="tla-item ${state} ${open ? 'open' : ''}"><div class="tla-node">${running ? '<span class="spin"></span>' : state === 'done' ? ic('check', 'i xs') : ic(k.ic, 'i xs')}</div><div class="tla-card"><div class="tla-bar"><i></i></div><button class="tla-h" aria-expanded="${open}"><span><span class="fn">${esc(k.n)}.</span> <b>${esc(k.f)}</b></span><span class="tla-ms num">${running ? 'Running' : state === 'done' ? esc(k.ms) : 'Queued'}</span>${ic('chev', 'i xs tla-chev')}</button><div class="tla-io" ${open ? '' : 'hidden'}><div><div class="lab">Input</div><pre>${hi(k.inp)}</pre></div><div><div class="lab">Output</div><pre>${state === 'done' ? hi(k.out) : 'Waiting…'}</pre></div></div></div></div>`;
  }

  async function toolA(host, s) {
    host.innerHTML = `<div class="tla"><p class="tla-lead rise">${esc(COPY.toolsIntro)}</p><div class="tla-list"></div><p class="tla-end">${esc(COPY.toolsEnd)}</p></div>`;
    const list = host.querySelector('.tla-list');
    const states = ['done', 'run'];
    list.innerHTML = COPY.tools.map((k, i) => toolCard(k, states[i], i === 0)).join('');
    list.querySelectorAll('.tla-item').forEach(item => {
      item.querySelector('.tla-h').addEventListener('click', () => {
        const io = item.querySelector('.tla-io');
        const open = io.hasAttribute('hidden');
        if (open) io.removeAttribute('hidden'); else io.setAttribute('hidden', '');
        item.classList.toggle('open', open);
        item.querySelector('.tla-h').setAttribute('aria-expanded', String(open));
      });
    });
    await s.wait(1600);
    if (s.dead()) return;
    const second = list.querySelectorAll('.tla-item')[1];
    second.classList.remove('run'); second.classList.add('done');
    second.querySelector('.tla-node').innerHTML = ic('check', 'i xs');
    second.querySelector('.tla-ms').textContent = COPY.tools[1].ms;
    second.querySelectorAll('pre')[1].innerHTML = hi(COPY.tools[1].out);
    host.querySelector('.tla-end').classList.add('in');
  }

  async function toolB(host, s) {
    let sel = 0;
    const states = ['done', 'run'];
    host.innerHTML = `<div class="tlb"><div class="tlb-side"><p class="tlb-lead">${esc(COPY.toolsIntro)}</p><div class="tlb-rows"></div></div><div class="tlb-main"></div></div>`;
    const rows = host.querySelector('.tlb-rows');
    const main = host.querySelector('.tlb-main');
    function draw() {
      rows.innerHTML = COPY.tools.map((k, i) => `<button class="tlb-row" aria-selected="${i === sel}"><b>${esc(k.f)}</b><span class="sub">${esc(k.n)}</span><span class="ms num">${states[i] === 'run' ? 'Running' : states[i] === 'done' ? esc(k.ms) : 'Queued'}</span></button>`).join('');
      const k = COPY.tools[sel];
      const st = states[sel];
      main.innerHTML = `<div class="tlb-block"><div class="lab">Input</div><pre>${hi(k.inp)}</pre></div><div class="tlb-block"><div class="lab">Output</div>${st === 'done' ? `<pre>${hi(k.out)}</pre>` : '<div class="skel"></div><div class="skel w2"></div><div class="skel w3"></div>'}</div>${states.every(x => x === 'done') ? `<p class="tlb-end">${esc(COPY.toolsEnd)}</p>` : ''}`;
      main.classList.remove('swap'); void main.offsetWidth; main.classList.add('swap');
      rows.querySelectorAll('.tlb-row').forEach((b, i) => b.addEventListener('click', () => { sel = i; draw(); }));
    }
    draw();
    await s.wait(1500);
    if (s.dead()) return;
    states[1] = 'done'; sel = 1; draw();
  }

  function mountFiles(host, kind) {
    const files = [];
    const root = el(kind === 'fan'
      ? `<div class="afa"><label class="afa-drop"><input class="afa-file" type="file" multiple aria-label="Choose files"><b>Drop files here</b><span class="sub">or <span class="link">add sample files</span></span></label><div class="afa-fan"></div><div class="afa-sum"></div></div>`
      : `<div class="afb"><label class="afb-drop"><input class="afb-file" type="file" multiple aria-label="Choose files"><span><b>Drop files here</b><span class="sub">or <span class="link">add sample files</span></span></span>${ic('upload', 'i s')}</label><div class="afb-list"></div><div class="afb-sum"></div></div>`);
    host.appendChild(root);
    const list = root.querySelector(kind === 'fan' ? '.afa-fan' : '.afb-list');
    const sum = root.querySelector(kind === 'fan' ? '.afa-sum' : '.afb-sum');
    const drop = root.querySelector(kind === 'fan' ? '.afa-drop' : '.afb-drop');
    let read = 0;
    const sync = () => { sum.textContent = read ? 'The agent can read ' + read + (read > 1 ? ' files' : ' file') + ' now' : ''; };
    function row(name, bytes, state, found) {
      const sz = size(bytes);
      const p = state === 'up' ? '64%' : '100%';
      const meta = state === 'done' ? `${sz} · ${found}` : state === 'read' ? `${sz} · Reading` : `${sz} · 64%`;
      if (kind === 'fan') {
        return `<article class="afa-card ${state}" style="--p:${p}"><button class="afa-x" aria-label="Remove ${esc(name)}">${ic('x', 'i xs')}</button><span class="afa-kind">${ext(name)}</span><div class="afa-nm">${esc(name)}</div><div class="afa-meta${state === 'read' ? ' shim' : ''}">${esc(meta)}</div><div class="afa-wash"></div></article>`;
      }
      return `<div class="afb-row ${state}" style="--p:${p}"><span class="afb-mark">${ext(name)}</span><span class="afb-nm">${esc(name)}</span><button class="afb-x" aria-label="Remove ${esc(name)}">${ic('x', 'i xs')}</button><span class="afb-meta${state === 'read' ? ' shim' : ''}">${state === 'read' ? `<span class="shim">${esc(meta)}</span>` : esc(meta)}</span><span class="afb-meter"><i></i></span></div>`;
    }
    function add(name, bytes, state, found) {
      const node = el(row(name, bytes, state, found));
      list.appendChild(node);
      if (state === 'done') read++;
      node.querySelector('button').addEventListener('click', ev => {
        ev.preventDefault(); ev.stopPropagation();
        if (state === 'done') read--;
        node.remove(); sync();
      });
    }
    const samples = () => {
      if (list.children.length) return;
      [['brief.pdf', 2.4e6, 'done', '12 pages'], ['Pricing.fig', 8.1e6, 'read', '6 frames'], ['signups.csv', 3.2e5, 'up', '1,204 rows']].forEach((f, i) => {
        add(f[0], f[1], f[2], f[3]);
        list.lastElementChild.classList.add('rise');
        list.lastElementChild.style.animationDelay = (i * 70) + 'ms';
      });
      sync();
    };
    root.querySelector('.link').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); samples(); });
    ['dragenter', 'dragover'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.add('over'); }));
    ['dragleave', 'drop'].forEach(ev => drop.addEventListener(ev, e => { e.preventDefault(); drop.classList.remove('over'); }));
    drop.addEventListener('drop', e => {
      [...e.dataTransfer.files].forEach(f => add(f.name, f.size, 'done', ''));
      sync();
    });
    samples();
    return Promise.resolve();
  }

  async function lanesA(host) {
    const L = COPY.lanes;
    host.innerHTML = `<div class="lna"><div class="lna-h"><b>3 agents working</b><span class="meta num">0:18 · 4 of 9 steps</span><button class="pill soft sm">${ic('pause', 'i xs')}Pause all</button></div></div>`;
    const root = host.querySelector('.lna');
    const plate = (l, state, act, steps, logs) => `<section class="lna-plate ${state}"><div class="lna-top"><span class="lna-av">${ic(l.ic)}</span><span class="lna-who"><b>${esc(l.n)}</b><span class="lna-act${state === 'working' ? ' shim' : ''}">${esc(act)}</span></span>${state === 'done' ? `<span class="tag ok">${ic('check', 'i xs')}Done</span>` : state === 'working' ? `<span class="tag">${'<span class="spin"></span>'}Working</span>` : `<span class="tag">${ic('clock', 'i xs')}Waiting</span>`}</div><div class="lna-steps">${steps}</div>${logs ? `<div class="lna-log">${logs}</div>` : ''}</section>`;
    root.insertAdjacentHTML('beforeend', plate(L[0], 'done', L[0].log[2], '<i class="on"></i><i class="on"></i><i class="on"></i>', L[0].log.map((t, i) => `<div><span>${esc(t)}</span><span class="num">${i + 2}s</span></div>`).join('')));
    root.insertAdjacentHTML('beforeend', `<div class="lna-hand rise"><b>Researcher</b> handed the brief to <b>Designer</b></div>`);
    root.insertAdjacentHTML('beforeend', plate(L[1], 'working', L[1].acts[1], '<i class="on"></i><i class="run" style="--p:55%"></i><i></i>', `<div><span>${esc(L[1].log[0])}</span><span class="num">6s</span></div>`));
    root.insertAdjacentHTML('beforeend', plate(L[2], 'waiting', L[2].wait, '<i></i><i></i><i></i>', ''));
    const btn = root.querySelector('.pill');
    let paused = false;
    btn.addEventListener('click', () => {
      paused = !paused;
      btn.innerHTML = ic(paused ? 'play' : 'pause', 'i xs') + (paused ? 'Resume' : 'Pause all');
      root.querySelector('.lna-h b').textContent = paused ? 'All agents paused' : '3 agents working';
      const work = root.querySelector('.lna-plate.working, .lna-plate.paused');
      if (!work) return;
      work.classList.toggle('working', !paused);
      work.classList.toggle('paused', paused);
      work.querySelector('.tag').outerHTML = paused ? '<span class="tag warn">Paused</span>' : '<span class="tag"><span class="spin"></span>Working</span>';
    });
    return Promise.resolve();
  }

  async function lanesB(host) {
    const L = COPY.lanes;
    const rows = [
      { l: L[0], state: 'done', act: L[0].log[2], p: '100%' },
      { l: L[1], state: 'run', act: L[1].acts[1], p: '48%' },
      { l: L[2], state: 'wait', act: L[2].wait, p: '0%' }
    ];
    host.innerHTML = `<div class="lnb"><div class="lnb-h"><b>3 agents working</b><div class="lnb-count num">4 <span>of 9 steps</span></div></div>${rows.map(r => `<div class="lnb-row ${r.state}"><div class="lnb-line"><b>${esc(r.l.n)}</b><span class="act${r.state === 'run' ? ' shim' : ''}">${esc(r.act)}</span></div><div class="lnb-track"><i style="width:${r.p}"></i><span class="lnb-notch"><b></b><b></b><b></b></span></div></div>`).join('')}<div class="lnb-hand">Researcher handed the brief to Designer</div></div>`;
    return Promise.resolve();
  }

  function treeGlyph(st) {
    return st === 'run' ? '<span class="spin"></span>' : st === 'done' ? ic('check', 'i xs') : st === 'fail' ? ic('alert', 'i xs') : '<span class="dot"></span>';
  }

  async function treeA(host) {
    const T = clone(COPY.tree);
    const card = (n, open) => {
      const kids = n.kids || [];
      const shown = kids.length ? sumTree(n) : n.cost;
      const cost = n.s === 'queued' && !shown ? '–' : money(shown);
      return `<div class="tra-card ${n.s}"><button class="tra-row" ${kids.length ? `aria-expanded="${open !== false}"` : ''}>${kids.length ? `<span class="trb-chev">${ic('chev', 'i xs')}</span>` : ''}<span class="tra-g">${treeGlyph(n.s)}</span><span class="tra-tx"><b>${esc(n.n)}</b><span>${esc(n.t)}</span></span><span class="tra-c num">${cost}</span></button>${n.s === 'fail' ? '<button class="pill soft sm tra-fix">Use color.accent.500</button>' : ''}${kids.length ? `<div class="tra-kids${open === false ? ' shut' : ''}">${kids.map(k => card(k, k.id === 'res' ? false : true)).join('')}</div>` : ''}</div>`;
    };
    host.innerHTML = `<div class="tra"><div class="tra-h"><div><b>${esc(COPY.treeTitle)}</b><span class="st">1 step failed · <span class="num">0:42</span></span></div><span class="tra-total num">${money(sumTree(T))}</span></div>${card(T)}</div>`;
    host.querySelectorAll('.tra-row').forEach(btn => btn.addEventListener('click', () => {
      const kids = btn.parentElement.querySelector(':scope > .tra-kids');
      if (!kids) return;
      const shut = kids.classList.toggle('shut');
      btn.setAttribute('aria-expanded', String(!shut));
    }));
    const fix = host.querySelector('.tra-fix');
    fix.addEventListener('click', () => {
      const cardEl = fix.closest('.tra-card');
      cardEl.classList.remove('fail'); cardEl.classList.add('done');
      cardEl.querySelector('.tra-g').innerHTML = ic('check', 'i xs');
      cardEl.querySelector('.tra-tx span').textContent = 'Colour and spacing, from the library';
      fix.remove();
      host.querySelector('.st').innerHTML = 'Done · <span class="num">0:48</span>';
      host.querySelector('.tra').insertAdjacentHTML('beforeend', `<div class="tra-sum rise">${ic('check', 'i xs')}<span>Done in 0:48 · 3 agents · ${money(sumTree(T))}</span></div>`);
    });
    return Promise.resolve();
  }

  async function treeB(host) {
    const T = clone(COPY.tree);
    const rows = [];
    (function walk(n, lv) { rows.push([n, lv]); if (n.id !== 'res') (n.kids || []).forEach(k => walk(k, lv + 1)); else n._fold = true; })(T, 0);
    const line = ([n, lv]) => {
      const shown = n.kids ? sumTree(n) : n.cost;
      const cost = n.s === 'queued' && !shown ? '–' : money(shown);
      return `<button class="trb-row ${n.s}" style="--lv:${lv}" ${n.kids ? 'aria-expanded="true"' : ''} data-id="${n.id}"><span class="trb-chev">${n.kids ? ic('chev', 'i xs') : ''}</span><span class="trb-g">${treeGlyph(n.s)}</span><span class="trb-tx"><b>${esc(n.n)}</b><span>${esc(n.t)}</span></span><span class="trb-c num">${cost}</span></button>${n.s === 'fail' ? `<div class="trb-note" style="--lv:${lv}"><button class="pill soft sm trb-fix">Use color.accent.500</button></div>` : ''}`;
    };
    host.innerHTML = `<div class="trb"><div class="trb-h"><div><b>${esc(COPY.treeTitle)}</b><span class="st">1 step failed · <span class="num">0:42</span></span></div><span class="trb-total num">${money(sumTree(T))}</span></div><div class="trb-body">${rows.map(line).join('')}</div></div>`;
    const resRow = host.querySelector('[data-id="res"]');
    resRow.setAttribute('aria-expanded', 'false');
    host.querySelector('.trb-fix').addEventListener('click', () => {
      const note = host.querySelector('.trb-note');
      const row = note.previousElementSibling;
      row.classList.remove('fail'); row.classList.add('done');
      row.querySelector('.trb-g').innerHTML = ic('check', 'i xs');
      row.querySelector('.trb-tx span').textContent = 'Colour and spacing, from the library';
      note.remove();
      host.querySelector('.st').innerHTML = 'Done · <span class="num">0:48</span>';
      host.querySelector('.trb').insertAdjacentHTML('beforeend', `<div class="trb-sum rise">${ic('check', 'i xs')}<span>Done in 0:48 · 3 agents · ${money(sumTree(T))}</span></div>`);
    });
    return Promise.resolve();
  }

  function summaryStats(nums) {
    return Promise.resolve(nums);
  }

  async function summaryA(host) {
    const S = COPY.summary;
    host.innerHTML = `<div class="rsa"><div class="rsa-h"><span class="rsa-seal">${ic('check', 'i s')}</span><div><div class="t">Run complete</div><div class="s">${esc(S.time)}</div></div></div><p class="rsa-title">${esc(S.title)}</p><div class="rsa-stats">${S.stats.map(s => `<div class="rsa-stat"><b class="num">0</b><span>${s[1]}</span></div>`).join('')}</div><div class="rsa-sec"><div class="rsa-l">What changed</div>${S.files.map(f => `<div class="rsa-it rise"><span class="mono">${esc(f[0])}</span><span class="num"><i class="a">${f[1]}</i> <i class="${f[2] === '−0' ? 'z' : 'x'}">${f[2]}</i></span></div>`).join('')}</div><div class="rsa-sec"><div class="rsa-l">Needs you</div><div class="rsa-it need"><span class="dot" style="color:var(--warn)"></span><span class="nt">${esc(S.need)}</span><button class="pill soft sm">Review</button></div></div><div class="rsa-acts"><button class="pill primary sm">Open changes</button><button class="pill ghost sm undo">Undo all</button></div></div>`;
    const values = [6, 14, 182, 0.84];
    const fmts = [v => String(Math.round(v)), v => String(Math.round(v)), v => Math.round(v) + 'k', v => '$' + v.toFixed(2)];
    host.querySelectorAll('.rsa-stat b').forEach((b, i) => count(b, values[i], 900, fmts[i]));
    const root = host.querySelector('.rsa');
    const undo = host.querySelector('.undo');
    undo.addEventListener('click', () => {
      const on = root.classList.toggle('undone');
      undo.textContent = on ? 'Redo' : 'Undo all';
      root.querySelector('.t').textContent = on ? 'Changes undone' : 'Run complete';
      root.querySelector('.rsa-seal').innerHTML = ic(on ? 'undo' : 'check', 'i s');
    });
    host.querySelector('.rsa-it.need .pill').addEventListener('click', ev => {
      ev.currentTarget.remove();
      host.querySelector('.nt').textContent = S.needDone;
    });
    return summaryStats();
  }

  async function summaryB(host) {
    const S = COPY.summary;
    host.innerHTML = `<div class="rsb"><div class="rsb-hero"><svg class="rsb-arc" viewBox="0 0 76 76" aria-hidden="true"><circle cx="38" cy="38" r="28"/><circle class="draw" cx="38" cy="38" r="28"/><path d="M33 39.2 36.2 42.4 44 33.8" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg><div><div class="rsb-k">Run complete</div><div class="rsb-t">${esc(S.time)}</div><p class="rsb-title">${esc(S.title)}</p></div></div><div class="rsb-strip">${S.stats.map(() => '<div><b class="num">0</b><span></span></div>').join('')}</div><div class="rsb-files"></div><div class="rsb-need"><span class="dot" style="color:var(--warn)"></span><span class="nt">${esc(S.need)}</span><button class="pill soft sm">Review</button></div><div class="rsb-acts"><button class="pill primary sm">Open changes</button><button class="pill ghost sm undo">Undo all</button></div></div>`;
    const root = host.querySelector('.rsb');
    requestAnimationFrame(() => root.classList.add('in'));
    const values = [6, 14, 182, 0.84];
    const fmts = [v => String(Math.round(v)), v => String(Math.round(v)), v => Math.round(v) + 'k', v => '$' + v.toFixed(2)];
    host.querySelectorAll('.rsb-strip div').forEach((d, i) => { d.querySelector('span').textContent = S.stats[i][1]; count(d.querySelector('b'), values[i], 900, fmts[i]); });
    host.querySelector('.rsb-files').innerHTML = S.files.map(f => `<div class="rsb-file rise"><span class="mono">${esc(f[0])}</span><span class="num"><i class="a" style="color:var(--add);font-style:normal">${f[1]}</i> <i style="color:${f[2] === '−0' ? 'var(--muted)' : 'var(--del)'};font-style:normal">${f[2]}</i></span><span class="rsb-ratio"><i class="add" style="flex:${f[3] || 1}"></i><i class="del" style="flex:${f[4] || 0}"></i></span></div>`).join('');
    const undo = host.querySelector('.undo');
    undo.addEventListener('click', () => {
      const on = root.classList.toggle('undone');
      undo.textContent = on ? 'Redo' : 'Undo all';
      root.querySelector('.rsb-k').textContent = on ? 'Changes undone' : 'Run complete';
    });
    host.querySelector('.rsb-need .pill').addEventListener('click', ev => { ev.currentTarget.remove(); host.querySelector('.nt').textContent = S.needDone; });
    return Promise.resolve();
  }

  async function logA(host, s) {
    host.innerHTML = `<div class="ala"><div class="ala-h"><b>Agent activity</b><span class="st"><span class="spin"></span><span class="sum">Running</span></span></div><div class="ala-list"></div></div>`;
    const list = host.querySelector('.ala-list');
    const sum = host.querySelector('.sum');
    const acts = COPY.actions;
    const render = (a, running) => `<div class="ala-item"><button class="ala-row" aria-expanded="false"><span class="ala-ic">${ic(a.ic)}</span><span class="ala-tx"><b>${a.t}</b><span class="d">${a.d}</span></span><span class="ala-r"><span class="num">${running ? '' : a.ms}</span>${running ? '<span class="spin" style="width:10px;height:10px"></span>' : `<span style="color:var(--ok)">${ic('check', 'i xs')}</span>`}</span></button><div class="ala-det" hidden><pre>${a.det}</pre></div></div>`;
    for (let i = 0; i < acts.length; i++) {
      if (s.dead()) return;
      const running = i === acts.length - 1;
      list.insertAdjacentHTML('afterbegin', render(acts[i], running));
      const item = list.firstElementChild;
      item.classList.add('rise');
      item.querySelector('.ala-row').addEventListener('click', ev => {
        const det = item.querySelector('.ala-det');
        const open = det.hasAttribute('hidden');
        if (open) det.removeAttribute('hidden'); else det.setAttribute('hidden', '');
        ev.currentTarget.setAttribute('aria-expanded', String(open));
      });
      [...list.children].forEach((el, idx) => { el.classList.toggle('latest', idx === 0); el.classList.toggle('old', idx === 1); el.classList.toggle('older', idx > 1); });
      sum.textContent = running ? 'Running step ' + (i + 1) : 'Running step ' + (i + 1);
      await s.wait(280);
    }
    if (s.dead()) return;
    const total = acts.reduce((a, x) => a + parseFloat(x.ms), 0).toFixed(1);
    host.querySelector('.st').innerHTML = `<span class="dot" style="color:var(--ok)"></span><span>5 steps, ${total}s</span>`;
    const last = list.firstElementChild;
    last.querySelector('.ala-r').innerHTML = `<span class="num">${acts[4].ms}</span><span style="color:var(--ok)">${ic('check', 'i xs')}</span>`;
  }

  async function logB(host, s) {
    const acts = COPY.actions;
    let clock = 0;
    host.innerHTML = `<div class="alb"><div class="alb-h"><b>Agent activity</b><span class="st"><span class="spin"></span><span class="sum">Running</span></span></div><div class="alb-list"></div></div>`;
    const list = host.querySelector('.alb-list');
    for (let i = 0; i < acts.length; i++) {
      if (s.dead()) return;
      const t = acts[i].ms;
      const item = el(`<div class="alb-item run rise"><div class="alb-time num">${t}</div><div class="alb-spine"><div class="alb-dot"></div></div><div class="alb-card"><button class="alb-row" aria-expanded="false"><span class="alb-tx"><b>${acts[i].t}</b><span class="d">${acts[i].d}</span></span></button><div class="alb-det" hidden><pre>${acts[i].det}</pre></div></div></div>`);
      list.appendChild(item);
      item.querySelector('.alb-row').addEventListener('click', ev => {
        const det = item.querySelector('.alb-det');
        const open = det.hasAttribute('hidden');
        if (open) det.removeAttribute('hidden'); else det.setAttribute('hidden', '');
        ev.currentTarget.setAttribute('aria-expanded', String(open));
      });
      host.querySelector('.sum').textContent = 'Running step ' + (i + 1);
      await s.wait(260);
      item.classList.remove('run'); item.classList.add('done');
    }
    if (s.dead()) return;
    const total = acts.reduce((a, x) => a + parseFloat(x.ms), 0).toFixed(1);
    host.querySelector('.st').innerHTML = `<span class="dot" style="color:var(--ok)"></span><span>5 steps, ${total}s</span>`;
  }

  function queueMarkup(which) {
    const G = COPY.queue;
    if (which === 'a') {
      return `<div class="rqa"><div class="rqa-top"><div class="seg2" role="group" aria-label="Density"><button aria-pressed="true" data-v="full">Detailed</button><button aria-pressed="false" data-v="compact">Compact</button></div><span class="all num">1 of 3 done</span></div><div class="rqa-jobs"></div></div>`;
    }
    return `<div class="rqb"><div class="rqb-top"><div class="seg2" role="group" aria-label="Density"><button aria-pressed="true" data-v="full">Detailed</button><button aria-pressed="false" data-v="compact">Compact</button></div><span class="all num">1 of 3 done</span></div><div class="rqb-list"></div></div>`;
  }

  function bindQueue(host, which) {
    host.innerHTML = queueMarkup(which);
    const G = COPY.queue;
    const box = host.querySelector(which === 'a' ? '.rqa-jobs' : '.rqb-list');
    const ok = `<span style="color:var(--ok)">${ic('check', 'i xs')}</span>`;
    G.forEach((g, gi) => {
      const subs = g.subs.map((sub, i) => {
        if (gi === 0 || (gi === 1 && i < 2)) return `<div class="sub"><span class="g">${ok}</span><span>${esc(sub[0])}</span><span class="m">${esc(sub[1])}</span></div>`;
        if (gi === 1) return `<div class="sub bad"><span class="g"><span style="color:var(--bad)">${ic('x', 'i xs')}</span></span><span>${esc(sub[0])}</span><span class="m"><button class="rq-retry">Retry</button></span></div>`;
        return `<div class="sub wait"><span class="g"><span class="dot" style="color:var(--faint)"></span></span><span>${esc(sub[0])}</span><span class="m"></span></div>`;
      }).join('');
      let node;
      if (which === 'a') {
        const cls = gi === 0 ? 'done shut' : gi === 1 ? 'fail' : 'wait';
        const label = gi === 0 ? 'Done' : gi === 1 ? '1 step failed' : 'Queued';
        const glyph = gi === 0 ? ok : gi === 1 ? `<span style="color:var(--bad)">${ic('alert', 'i xs')}</span>` : '<span class="dot" style="color:var(--faint)"></span>';
        const w = gi === 0 ? '100%' : gi === 1 ? '66%' : '0';
        node = el(`<article class="rqa-job ${cls}"><div class="rqa-h"><span class="g">${glyph}</span><b>${esc(g.t)}</b><span class="m">${label}</span></div><div class="rqa-bar"><i style="width:${w}"></i></div><div class="body">${subs.replaceAll('class="sub', 'class="rqa-sub')}</div></article>`);
      } else {
        const cls = gi === 0 ? 'done' : gi === 1 ? 'fail' : 'wait';
        const label = gi === 0 ? 'Done' : gi === 1 ? '1 step failed' : 'Queued';
        const glyph = gi === 0 ? ok : gi === 1 ? `<span style="color:var(--bad)">${ic('alert', 'i xs')}</span>` : '<span class="dot" style="color:var(--faint)"></span>';
        const p = gi === 0 ? '100%' : gi === 1 ? '66%' : '0%';
        node = el(`<div class="rqb-g ${cls}${gi === 2 ? ' shut' : ''}" style="--p:${p}"><div class="rqb-wash"></div><div class="rqb-h"><span class="g">${glyph}</span><b>${esc(g.t)}</b><span class="m">${label}</span></div><div class="rqb-subs">${subs.replaceAll('class="sub', 'class="rqb-sub')}</div></div>`);
      }
      box.appendChild(node);
      const retry = node.querySelector('.rq-retry');
      if (retry) retry.addEventListener('click', () => {
        const sub = retry.closest('[class*="sub"]');
        sub.querySelector('.g').innerHTML = ok;
        retry.parentElement.textContent = 'Done';
        if (which === 'a') {
          node.classList.remove('fail'); node.classList.add('done');
          node.querySelector('.rqa-h .g').innerHTML = ok;
          node.querySelector('.m').textContent = 'Done';
          node.querySelector('.rqa-bar i').style.width = '100%';
        } else {
          node.classList.remove('fail'); node.classList.add('done');
          node.style.setProperty('--p', '100%');
          node.querySelector('.rqb-h .g').innerHTML = ok;
          node.querySelector('.rqb-h .m').textContent = 'Done';
        }
        host.querySelector('.all').textContent = '2 of 3 done';
      });
    });
    seg(host.querySelector('.seg2'), v => {
      box.querySelectorAll(which === 'a' ? '.rqa-job' : '.rqb-g').forEach(job => {
        if (v === 'compact') job.classList.add('shut');
        else if (!job.classList.contains('done') || which === 'b') job.classList.remove('shut');
      });
    });
  }

  async function evalPaint(host, mode, s) {
    const K = COPY.evals.map(k => ({ ...k, s: 'pass', open: false }));
    const rootClass = mode === 'a' ? 'eva' : 'evb';
    host.innerHTML = mode === 'a'
      ? `<div class="eva"><div class="eva-h"><div><b>${esc(COPY.evalTitle)}</b><span class="st">${esc(COPY.evalSt)}</span></div><button class="pill primary sm run">${ic('play', 'i xs')}Run evals</button></div><div class="eva-score"><svg class="eva-ring" viewBox="0 0 36 36"><circle cx="18" cy="18" r="14"></circle><circle class="draw" cx="18" cy="18" r="14" stroke-dasharray="88" stroke-dashoffset="0"></circle></svg><div><div class="eva-pass num">8 <span class="of">of 8 passed</span></div><span class="tag ok eva-dl">All passing</span></div></div><div class="eva-tabs"><div class="seg2"><button aria-pressed="true" data-v="all">All <span class="n num">8</span></button><button aria-pressed="false" data-v="fail">Failed <span class="n num">0</span></button></div></div><div class="eva-list"></div><p class="eva-none" hidden>No failed cases</p></div>`
      : `<div class="evb"><div class="evb-h"><div><b>${esc(COPY.evalTitle)}</b><span class="st">${esc(COPY.evalSt)}</span></div><button class="pill primary sm run">${ic('play', 'i xs')}Run evals</button></div><div class="evb-segs">${K.map(() => '<i></i>').join('')}</div><div class="evb-nums"><span class="evb-pass num">8 of 8 passed</span><span class="tag ok evb-dl">All passing</span></div><div class="eva-tabs"><div class="seg2"><button aria-pressed="true" data-v="all">All <span class="n num">8</span></button><button aria-pressed="false" data-v="fail">Failed <span class="n num">0</span></button></div></div><div class="evb-list"></div><p class="evb-none" hidden>No failed cases</p></div>`;
    let filter = 'all';
    const list = host.querySelector(mode === 'a' ? '.eva-list' : '.evb-list');
    const draw = () => {
      const passed = K.filter(k => k.s === 'pass').length;
      const fails = K.filter(k => k.s === 'fail').length;
      const done = K.every(k => k.s === 'pass' || k.s === 'fail');
      if (mode === 'a') {
        const ring = host.querySelector('.draw');
        ring.style.strokeDashoffset = String(88 * (1 - passed / 8));
        host.querySelector('.eva-pass').innerHTML = `${passed} <span class="of">of 8 passed</span>`;
      } else {
        host.querySelectorAll('.evb-segs i').forEach((segI, i) => { segI.className = K[i].s === 'pass' || K[i].s === 'fail' || K[i].s === 'run' ? K[i].s : ''; });
        host.querySelector('.evb-pass').textContent = (done ? passed + ' of 8 passed' : 'Running ' + (K.filter(k => k.s === 'pass' || k.s === 'fail').length + 1) + ' of 8');
      }
      const dl = host.querySelector(mode === 'a' ? '.eva-dl' : '.evb-dl');
      dl.textContent = !done ? '' : passed < 8 ? (8 - passed) + ' fewer than the last run' : 'All passing';
      dl.className = (mode === 'a' ? 'tag eva-dl ' : 'tag evb-dl ') + (passed < 8 ? 'bad' : 'ok');
      host.querySelector('[data-v="fail"] .n').textContent = String(fails);
      host.querySelector(mode === 'a' ? '.eva-none' : '.evb-none').hidden = !(filter === 'fail' && fails === 0);
      list.innerHTML = K.map(k => {
        if (filter === 'fail' && k.s !== 'fail') return '';
        const g = k.s === 'pass' ? ic('check', 'i xs') : k.s === 'fail' ? ic('alert', 'i xs') : k.s === 'run' ? '<span class="spin" style="width:11px;height:11px"></span>' : '<span class="dot"></span>';
        const open = k.s === 'fail';
        const cls = mode === 'a' ? 'eva' : 'evb';
        const detail = open ? `<div class="${cls}-dd"><div class="${cls}-kv"><span class="k">Expected</span><span>${esc(k.exp)}</span></div><div class="${cls}-kv"><span class="k">Got</span><span class="bad">${esc(k.got)}</span></div><div class="${cls}-kv"><span class="k">Source</span><span>${esc(k.src)}</span></div><button class="pill soft sm fix">Use $24 and rerun</button></div>` : '';
        return `<div class="${cls}-case ${k.s}" data-n="${esc(k.n)}">${mode === 'b' ? '<div class="sheen"></div>' : ''}<div class="${cls}-r"><span class="${cls}-g">${g}</span><span class="${cls}-n">${esc(k.n)}</span><span class="${cls}-tm num">${k.s === 'pass' || k.s === 'fail' ? k.tm : ''}</span></div>${detail}</div>`;
      }).join('');
      const fix = list.querySelector('.fix');
      if (fix) fix.addEventListener('click', async () => {
        const k = K.find(x => x.bad);
        k.bad = false; k.s = 'run'; draw();
        await s.wait(600);
        k.s = 'pass'; draw();
      });
    };
    draw();
    seg(host.querySelector('.seg2'), v => { filter = v; draw(); });
    const runOnce = async () => {
      const btn = host.querySelector('.run');
      btn.disabled = true; btn.innerHTML = '<span class="spin"></span>Running';
      K.forEach(k => { k.s = 'queued'; });
      draw();
      for (const k of K) {
        if (s.dead()) return;
        k.s = 'run'; draw();
        await s.wait(220);
        k.s = k.bad ? 'fail' : 'pass'; draw();
      }
      host.querySelector('.st').textContent = 'Copy agent · 8 cases · run just now';
      btn.disabled = false; btn.innerHTML = ic('play', 'i xs') + 'Run again';
    };
    host.querySelector('.run').addEventListener('click', () => { K.forEach(k => { if (k.n.startsWith('Prices')) k.bad = true; }); runOnce(); });
    if (!s.reduce) await runOnce();
    else {
      K.forEach(k => { k.s = k.bad ? 'fail' : 'pass'; });
      draw();
      host.querySelector('.st').textContent = 'Copy agent · 8 cases · run just now';
    }
  }

  async function settingsA(host, s) {
    const caps = COPY.caps;
    let state = { a: 1, mem: true, slack: false, cap: 2, text: COPY.instructions };
    let saved = JSON.stringify(state);
    host.innerHTML = `<div class="sea"><section class="sea-card"><h3>Autonomy</h3><p class="hint sea-ad">${esc(COPY.autonomy[1])}</p>${COPY.autonomyNames.map((n, i) => `<button class="sea-opt" role="radio" aria-checked="${i === 1}"><span>${n}</span></button>`).join('')}</section><section class="sea-card"><div class="sea-row"><div><b>Use team memory</b><span>Brand rules and past decisions</span></div><button class="toggle sw" role="switch" aria-checked="true" aria-label="Use team memory"></button></div></section><section class="sea-card"><div class="sea-row"><div><b>Post a summary in Slack</b><span>#design, after each run</span></div><button class="toggle sw" role="switch" aria-checked="false" aria-label="Post a summary in Slack"></button></div></section><section class="sea-card"><div class="sea-row"><div><b>Spend cap per run</b><span>Pauses and asks when reached</span></div><div class="sea-cap"><button class="ib fill" aria-label="Lower cap">${ic('minus', 'i xs')}</button><span class="v num">$5</span><button class="ib fill" aria-label="Raise cap">${ic('plus', 'i xs')}</button></div></div></section><section class="sea-card"><h3>Instructions</h3><textarea class="sea-ta" rows="2" spellcheck="false">${esc(COPY.instructions)}</textarea></section><div class="sea-shelf"><span>Unsaved changes</span><button class="pill ghost sm reset">Reset</button><button class="pill accent sm save">Save</button></div></div>`;
    const root = host.querySelector('.sea');
    const opts = [...host.querySelectorAll('.sea-opt')];
    const tgs = [...host.querySelectorAll('.toggle')];
    const val = host.querySelector('.v');
    const ta = host.querySelector('.sea-ta');
    const dirty = () => root.classList.toggle('dirty', JSON.stringify(state) !== saved);
    const setA = i => { state.a = i; opts.forEach((b, j) => b.setAttribute('aria-checked', j === i ? 'true' : 'false')); host.querySelector('.sea-ad').textContent = COPY.autonomy[i]; dirty(); };
    opts.forEach((b, i) => b.addEventListener('click', () => setA(i)));
    tgs[0].addEventListener('click', () => { state.mem = !state.mem; tgs[0].setAttribute('aria-checked', String(state.mem)); dirty(); });
    tgs[1].addEventListener('click', () => { state.slack = !state.slack; tgs[1].setAttribute('aria-checked', String(state.slack)); dirty(); });
    const step = d => { state.cap = Math.max(0, Math.min(caps.length - 1, state.cap + d)); val.textContent = '$' + caps[state.cap]; dirty(); };
    host.querySelector('[aria-label="Lower cap"]').addEventListener('click', () => step(-1));
    host.querySelector('[aria-label="Raise cap"]').addEventListener('click', () => step(1));
    ta.addEventListener('input', () => { state.text = ta.value; dirty(); });
    host.querySelector('.reset').addEventListener('click', () => {
      state = JSON.parse(saved); setA(state.a);
      tgs[0].setAttribute('aria-checked', String(state.mem));
      tgs[1].setAttribute('aria-checked', String(state.slack));
      val.textContent = '$' + caps[state.cap]; ta.value = state.text; dirty();
    });
    host.querySelector('.save').addEventListener('click', () => {
      const b = host.querySelector('.save');
      b.innerHTML = '<span class="spin"></span>';
      setTimeout(() => { if (!b.isConnected) return; saved = JSON.stringify(state); dirty(); b.innerHTML = ic('check', 'i xs') + 'Saved'; setTimeout(() => { if (b.isConnected) b.textContent = 'Save'; }, 700); }, 450);
    });
    await s.wait(900);
    if (!s.dead() && !state.slack) tgs[1].click();
  }

  async function settingsB(host, s) {
    const caps = COPY.caps;
    let state = { a: 1, mem: true, slack: false, cap: 2, text: COPY.instructions };
    let saved = JSON.stringify(state);
    host.innerHTML = `<div class="seb"><div class="seb-block"><div class="seb-lab"><b>Autonomy</b></div><div class="seb-track"><div class="seb-line"></div><div class="seb-fill"></div><span class="seb-knob"></span>${COPY.autonomyNames.map((n, i) => `<button class="seb-stop" style="left:${i * 50}%" aria-checked="${i === 1}" aria-label="${n}"><i></i></button>`).join('')}</div><div class="seb-names">${COPY.autonomyNames.map((n, i) => `<span class="${i === 1 ? 'on' : ''}">${n}</span>`).join('')}</div><div class="seb-ad">${esc(COPY.autonomy[1])}</div></div><div class="seb-row"><div><b>Use team memory</b><span>Brand rules and past decisions</span></div><button class="toggle sw" role="switch" aria-checked="true" aria-label="Use team memory"></button></div><div class="seb-row"><div><b>Post a summary in Slack</b><span>#design, after each run</span></div><button class="toggle sw" role="switch" aria-checked="false" aria-label="Post a summary in Slack"></button></div><div class="seb-block"><div class="seb-lab"><b>Spend cap per run</b><span class="capv num">$5</span></div><div class="seb-cap" style="margin-top:8px"><button class="ib fill" aria-label="Lower cap">${ic('minus', 'i xs')}</button><div class="seb-mini"><i></i></div><button class="ib fill" aria-label="Raise cap">${ic('plus', 'i xs')}</button></div><div class="seb-ad">Pauses and asks when reached</div></div><div class="seb-block"><div class="seb-lab"><b>Instructions</b></div><textarea class="sea-ta" rows="2" spellcheck="false">${esc(COPY.instructions)}</textarea></div><div class="seb-save"><span class="msg">Saved</span><button class="pill ghost sm reset" disabled>Reset</button><button class="pill accent sm save" disabled>Save</button></div></div>`;
    const root = host.querySelector('.seb');
    const stops = [...host.querySelectorAll('.seb-stop')];
    const names = [...host.querySelectorAll('.seb-names span')];
    const tgs = [...host.querySelectorAll('.toggle')];
    const dirty = () => {
      const on = JSON.stringify(state) !== saved;
      root.classList.toggle('dirty', on);
      root.querySelector('.msg').textContent = on ? 'Unsaved changes' : 'Saved';
      root.querySelector('.reset').disabled = !on;
      root.querySelector('.save').disabled = !on;
    };
    const place = () => {
      const i = state.a;
      host.querySelector('.seb-knob').style.left = (i * 50) + '%';
      host.querySelector('.seb-fill').style.width = `calc(${i * 50}% - 10px)`;
      stops.forEach((b, j) => b.setAttribute('aria-checked', j === i ? 'true' : 'false'));
      names.forEach((n, j) => n.classList.toggle('on', j === i));
      host.querySelector('.seb-ad').textContent = COPY.autonomy[i];
    };
    const placeCap = () => {
      host.querySelector('.capv').textContent = '$' + caps[state.cap];
      host.querySelector('.seb-mini i').style.width = ((state.cap) / (caps.length - 1) * 100) + '%';
    };
    stops.forEach((b, i) => b.addEventListener('click', () => { state.a = i; place(); dirty(); }));
    tgs[0].addEventListener('click', () => { state.mem = !state.mem; tgs[0].setAttribute('aria-checked', String(state.mem)); dirty(); });
    tgs[1].addEventListener('click', () => { state.slack = !state.slack; tgs[1].setAttribute('aria-checked', String(state.slack)); dirty(); });
    const step = d => { state.cap = Math.max(0, Math.min(caps.length - 1, state.cap + d)); placeCap(); dirty(); };
    host.querySelector('[aria-label="Lower cap"]').addEventListener('click', () => step(-1));
    host.querySelector('[aria-label="Raise cap"]').addEventListener('click', () => step(1));
    host.querySelector('textarea').addEventListener('input', e => { state.text = e.target.value; dirty(); });
    host.querySelector('.reset').addEventListener('click', () => {
      state = JSON.parse(saved); place(); placeCap();
      tgs[0].setAttribute('aria-checked', String(state.mem));
      tgs[1].setAttribute('aria-checked', String(state.slack));
      host.querySelector('textarea').value = state.text; dirty();
    });
    host.querySelector('.save').addEventListener('click', () => {
      const b = host.querySelector('.save');
      b.innerHTML = '<span class="spin"></span>';
      setTimeout(() => { if (!b.isConnected) return; saved = JSON.stringify(state); dirty(); b.innerHTML = ic('check', 'i xs') + 'Saved'; setTimeout(() => { if (b.isConnected) b.textContent = 'Save'; }, 700); }, 450);
    });
    place(); placeCap(); dirty();
    await s.wait(800);
    if (!s.dead() && !state.slack) tgs[1].click();
  }

  add('thread-panel', { a: threadA, b: threadB });
  add('tool-call', { a: toolA, b: toolB });
  add('attachment-tray', { a: (h) => mountFiles(h, 'fan'), b: (h) => mountFiles(h, 'ledger') });
  add('agent-lanes', { a: lanesA, b: lanesB });
  add('agent-tree', { a: treeA, b: treeB });
  add('run-summary', { a: summaryA, b: summaryB });
  add('action-log', { a: logA, b: logB });
  add('run-queue', { a: (h) => { bindQueue(h, 'a'); return Promise.resolve(); }, b: (h) => { bindQueue(h, 'b'); return Promise.resolve(); } });
  add('eval-results', { a: (h, s) => evalPaint(h, 'a', s), b: (h, s) => evalPaint(h, 'b', s) });
  add('agent-settings', { a: settingsA, b: settingsB });
})();
