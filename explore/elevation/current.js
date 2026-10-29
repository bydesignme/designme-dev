/* Current Soft components, restaged with the shipped markup and copy. */
(function () {
  const { COPY, el, ic, esc, hi, seg, money, sumTree, clone } = ELEV;

  function thread(host) {
    host.innerHTML = `<div class="thp panel"><div class="thp-tabs" role="tablist"></div><div class="thp-body" aria-live="polite"></div><form class="thp-in"><input class="thp-field" aria-label="Reply" placeholder="Reply to the agent"><button class="thp-send" aria-label="Send" disabled>${ic('up', 'i s')}</button></form></div>`;
    const tabs = host.querySelector('.thp-tabs');
    const body = host.querySelector('.thp-body');
    const field = host.querySelector('.thp-field');
    const send = host.querySelector('.thp-send');
    const threads = clone(COPY.threads);
    let cur = 0;
    tabs.innerHTML = threads.map((t, i) => `<button class="thp-tab" role="tab" aria-selected="${i === 0}"><span class="dot" style="color:${t.col}"></span>${esc(t.t)}</button>`).join('') + '<span class="thp-ink"></span>';
    const ink = host.querySelector('.thp-ink');
    const tbs = [...host.querySelectorAll('.thp-tab')];
    const place = () => { const b = tbs[cur]; ink.style.left = (b.offsetLeft + 10) + 'px'; ink.style.width = (b.offsetWidth - 20) + 'px'; };
    const paint = i => {
      cur = i;
      tbs.forEach((b, k) => b.setAttribute('aria-selected', k === i ? 'true' : 'false'));
      place();
      body.innerHTML = threads[i].msgs.map(m => m[0] === 'u'
        ? `<div class="bub">${esc(m[1])}</div>`
        : `<div class="thp-ag">${m[2] && m[2].length ? `<div class="src">${m[2].map(s => `<span class="fchip">${ic('file', 'i xs')}${esc(s[0])}</span>`).join('')}</div>` : ''}${esc(m[1])}</div>`
      ).join('');
    };
    tbs.forEach((b, i) => b.addEventListener('click', () => paint(i)));
    field.addEventListener('input', () => { send.disabled = !field.value.trim(); });
    host.querySelector('.thp-in').addEventListener('submit', e => {
      e.preventDefault();
      const v = field.value.trim();
      if (!v) return;
      field.value = '';
      send.disabled = true;
      threads[cur].msgs.push(['u', v]);
      paint(cur);
      const k = cur;
      setTimeout(() => {
        threads[k].msgs.push(['a', COPY.followReply, []]);
        if (cur === k) paint(cur);
      }, 700);
    });
    requestAnimationFrame(() => paint(0));
    new ResizeObserver(place).observe(tabs);
    return Promise.resolve();
  }

  function tool(host) {
    const calls = COPY.tools;
    host.innerHTML = `<div class="tcx"><p class="msg">${esc(COPY.toolsIntro)}</p><div class="tcx-calls"></div><p class="msg tcx-end in">${esc(COPY.toolsEnd)}</p></div>`;
    const hostC = host.querySelector('.tcx-calls');
    calls.forEach((k, i) => {
      const done = i === 0;
      const node = el(`<div class="tcx-c ${done ? 'open' : ''}"><button class="tcx-h" aria-expanded="${done}"><span class="tcx-ic">${done ? ic(k.ic, 'i xs') : '<span class="radar" style="color:var(--fg)"></span>'}</span><span class="tcx-n"><span>${esc(k.n)}.</span><b>${esc(k.f)}</b></span><span class="tcx-ms"><span class="tt">${done ? esc(k.ms) : 'Running'}</span><span class="g">${done ? `<span style="color:var(--ok)">${ic('check', 'i xs')}</span>` : '<span class="spin" style="width:10px;height:10px"></span>'}</span></span>${ic('chev', 'i xs tcx-chev')}</button><div class="fold ${done ? '' : 'shut'}"><div><div class="tcx-io"><div><div class="tcx-l">Input</div><pre>${hi(k.inp)}</pre></div><div><div class="tcx-l">Output</div><pre>${done ? hi(k.out) : 'Waiting…'}</pre></div></div></div></div></div>`);
      hostC.appendChild(node);
      const b = node.querySelector('.tcx-h');
      const f = node.querySelector('.fold');
      b.addEventListener('click', () => {
        const shut = f.classList.toggle('shut');
        node.classList.toggle('open', !shut);
        b.setAttribute('aria-expanded', String(!shut));
      });
    });
    return Promise.resolve();
  }

  function files(host) {
    host.innerHTML = `<div class="atx"><label class="atx-drop"><input type="file" multiple class="atx-file" aria-label="Choose files"><svg class="atx-ants" aria-hidden="true"><rect/></svg><span class="atx-ic">${ic('upload', 'i s')}</span><b>Drop files here</b><span class="muted">or <span class="atx-sample">add sample files</span></span></label><div class="atx-list"></div><div class="atx-sum muted"></div></div>`;
    const list = host.querySelector('.atx-list');
    const sum = host.querySelector('.atx-sum');
    const drop = host.querySelector('.atx-drop');
    const kind = n => {
      const e = (n.split('.').pop() || '').toLowerCase();
      if (e === 'pdf') return ['PDF', 'var(--pr)', 'var(--pr-bg)'];
      if (/png|jpg|jpeg|gif|webp|fig/.test(e)) return [e.toUpperCase().slice(0, 3), 'var(--pl)', 'var(--pl-bg)'];
      if (/csv|xlsx/.test(e)) return ['CSV', 'var(--pm)', 'var(--pm-bg)'];
      return [e.toUpperCase().slice(0, 3) || 'TXT', 'var(--pb)', 'var(--pb-bg)'];
    };
    const size = b => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
    let read = 0;
    const sync = () => { sum.textContent = read ? ('The agent can read ' + read + (read > 1 ? ' files' : ' file') + ' now') : ''; };
    function add(name, bytes, found, state) {
      const k = kind(name), sz = size(bytes);
      const it = el(`<div class="atx-it ${state === 'done' || state === 'read' ? 'up' : ''}" style="--c:${k[1]};--cb:${k[2]};--p:${state === 'up' ? '62%' : '100%'}"><span class="atx-ti">${k[0]}</span><span class="atx-n"><span class="atx-nm">${esc(name)}</span><span class="atx-m">${state === 'up' ? `${sz} · <span class="num">62%</span>` : state === 'read' ? `<span class="shim">${sz} · Reading</span>` : `${sz} · ${esc(found)}`}</span></span>${state === 'done' ? `<span class="atx-ok">${ic('check')}</span>` : state === 'read' ? '<span class="atx-rd"><span class="spin"></span></span>' : `<svg class="atx-ring" viewBox="0 0 22 22" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="62"><circle cx="11" cy="11" r="8" fill="none" stroke="var(--line)" stroke-width="2"/><circle cx="11" cy="11" r="8" fill="none" stroke="${k[1]}" stroke-width="2" stroke-linecap="round" stroke-dasharray="50.3" stroke-dashoffset="19" transform="rotate(-90 11 11)"/></svg>`}<button class="ib" aria-label="Remove ${esc(name)}">${ic('x', 'i xs')}</button></div>`);
      list.appendChild(it);
      if (state === 'done') read++;
      it.querySelector('.ib').addEventListener('click', () => { if (state === 'done') read = Math.max(0, read - 1); it.remove(); sync(); });
    }
    const samples = () => {
      if (list.children.length) return;
      add('brief.pdf', 2.4e6, '12 pages', 'done');
      add('Pricing.fig', 8.1e6, '6 frames', 'read');
      add('signups.csv', 3.2e5, '1,204 rows', 'up');
      sync();
    };
    host.querySelector('.atx-sample').addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); samples(); });
    const ants = host.querySelector('.atx-ants rect');
    const fit = () => {
      const w = drop.offsetWidth, h = drop.offsetHeight; if (!w) return;
      ants.setAttribute('x', 1); ants.setAttribute('y', 1); ants.setAttribute('width', w - 2); ants.setAttribute('height', h - 2); ants.setAttribute('rx', 16);
    };
    fit(); new ResizeObserver(fit).observe(drop);
    samples();
    return Promise.resolve();
  }

  function lanes(host) {
    host.innerHTML = `<div class="aln panel"><div class="aln-h"><span class="aln-ic">${ic('users', 'i s')}</span><span class="aln-t">3 agents working</span><span class="aln-m muted num">0:18</span><span class="aln-ct num">4 of 9 steps</span><button class="pill soft sm aln-pause">${ic('pause', 'i xs')}Pause all</button></div><div class="aln-rows"></div></div>`;
    const rows = host.querySelector('.aln-rows');
    const L = COPY.lanes;
    const states = ['done', 'working', 'waiting'];
    L.forEach((l, i) => {
      const s = states[i];
      const bars = s === 'done' ? '<i class="on"></i><i class="on"></i><i class="on"></i>' : s === 'working' ? '<i class="on"></i><i class="run" style="--p:.55"></i><i></i>' : '<i></i><i></i><i></i>';
      const tag = s === 'done' ? `<span class="tag ok">${ic('check', 'i xs')}Done</span>` : s === 'working' ? `<span class="tag aln-tg"><span class="spin"></span>Working</span>` : `<span class="tag">${ic('clock', 'i xs')}Waiting</span>`;
      const act = s === 'done' ? l.log[2] : s === 'working' ? l.acts[1] : l.wait;
      const log = s === 'done' ? l.log.map((t, n) => `<div><span>${esc(t)}</span><span class="muted">${n + 2}s</span></div>`).join('') : s === 'working' ? `<div><span>${esc(l.log[0])}</span><span class="muted">6s</span></div>` : '';
      const node = el(`<div class="aln-lane ${s === 'done' ? 'sent' : ''}" data-s="${s}" style="--c:var(--${l.t});--cb:var(--${l.t}-bg);--cm:var(--${l.t})"><button class="aln-row" aria-expanded="${s !== 'waiting'}"><span class="aln-av">${ic(l.ic)}</span><span class="aln-who"><span class="aln-n">${esc(l.n)}</span><span class="aln-a ${s === 'working' ? 'live shim' : ''}">${esc(act)}</span></span><span class="aln-tr">${bars}</span><span class="aln-st">${tag}</span></button><div class="fold ${s === 'waiting' ? 'shut' : ''}"><div><div class="aln-det">${log}</div></div></div></div>`);
      rows.appendChild(node);
      const b = node.querySelector('.aln-row'), f = node.querySelector('.fold');
      b.addEventListener('click', () => { const shut = f.classList.toggle('shut'); b.setAttribute('aria-expanded', String(!shut)); });
    });
    const pb = host.querySelector('.aln-pause');
    let paused = false;
    pb.addEventListener('click', () => {
      paused = !paused;
      pb.innerHTML = ic(paused ? 'play' : 'pause', 'i xs') + (paused ? 'Resume' : 'Pause all');
      host.querySelector('.aln-t').textContent = paused ? 'All agents paused' : '3 agents working';
      rows.querySelectorAll('.aln-lane[data-s="working"],.aln-lane[data-s="paused"]').forEach(lane => {
        lane.dataset.s = paused ? 'paused' : 'working';
        lane.querySelector('.aln-st').innerHTML = paused ? '<span class="tag warn">Paused</span>' : '<span class="tag aln-tg"><span class="spin"></span>Working</span>';
        lane.querySelector('.aln-a').classList.toggle('shim', !paused);
      });
    });
    return Promise.resolve();
  }

  function tree(host) {
    const T = clone(COPY.tree);
    host.innerHTML = `<div class="atr panel"><div class="atr-h"><div class="atr-ht"><b>${esc(COPY.treeTitle)}</b><span class="muted atr-st"><span class="m">1 step failed</span> · <span class="num">0:42</span></span></div><span class="atr-tot num"></span></div><div class="atr-tree" role="tree"></div></div>`;
    const treeEl = host.querySelector('.atr-tree');
    const all = [];
    (function walk(n, lv, p) { n.lv = lv; n.parent = p; all.push(n); (n.kids || []).forEach(k => walk(k, lv + 1, n)); })(T, 0, null);
    const glyph = s => s === 'run' ? '<span class="spin"></span>' : s === 'done' ? ic('check', 'i xs') : s === 'fail' ? ic('alert', 'i xs') : '<span class="dot"></span>';
    function build(n) {
      const kids = n.kids && n.kids.length;
      const row = el(`<div class="atr-n ${n.s}" role="treeitem" aria-level="${n.lv + 1}" ${kids ? 'aria-expanded="true"' : ''} style="--lv:${n.lv}">${kids ? `<span class="atr-tg">${ic('chev', 'i xs')}</span>` : '<span class="atr-sp"></span>'}<span class="atr-g">${glyph(n.s)}</span><span class="atr-t"><b>${esc(n.n)}</b><span>${esc(n.t)}</span></span><span class="atr-c num"></span></div>`);
      n.el = row;
      const out = [row];
      if (kids) {
        const f = el(`<div class="fold atr-kids" style="--lv:${n.lv}"><div></div></div>`);
        n.kids.forEach(k => build(k).forEach(e => f.firstElementChild.appendChild(e)));
        n.fold = f; out.push(f);
      }
      if (n.s === 'fail') row.querySelector('.atr-t').insertAdjacentHTML('beforeend', `<button class="pill sm atr-fix">Use color.accent.500</button>`);
      return out;
    }
    build(T).forEach(e => treeEl.appendChild(e));
    const paint = () => {
      all.forEach(n => {
        const v = n.kids ? sumTree(n) : n.cost;
        n.el.querySelector('.atr-c').textContent = n.s === 'queued' && !v ? '–' : money(v);
      });
      host.querySelector('.atr-tot').textContent = money(sumTree(T));
    };
    paint();
    const res = all.find(n => n.id === 'res');
    res.el.setAttribute('aria-expanded', 'false');
    res.fold.classList.add('shut');
    treeEl.addEventListener('click', e => {
      if (e.target.closest('.atr-fix')) return;
      const row = e.target.closest('.atr-n');
      if (!row) return;
      const n = all.find(x => x.el === row);
      if (!n.fold) return;
      const open = row.getAttribute('aria-expanded') !== 'true';
      row.setAttribute('aria-expanded', String(open));
      n.fold.classList.toggle('shut', !open);
    });
    const fix = host.querySelector('.atr-fix');
    fix.addEventListener('click', () => {
      const n = all.find(x => x.id === 'des3');
      n.s = 'done'; n.t = 'Colour and spacing, from the library';
      n.el.className = 'atr-n done';
      n.el.querySelector('.atr-g').innerHTML = ic('check', 'i xs');
      n.el.querySelector('.atr-t span').textContent = n.t;
      fix.remove();
      host.querySelector('.m').textContent = 'Running';
      all.find(x => x.id === 'des').el.classList.replace('run', 'done');
      all.find(x => x.id === 'des').el.querySelector('.atr-g').innerHTML = ic('check', 'i xs');
      paint();
    });
    return Promise.resolve();
  }

  function summary(host) {
    const S = COPY.summary;
    host.innerHTML = `<div class="rsu panel"><div class="rsu-h"><span class="rsu-g">${ic('check', 'i s')}</span><div><div class="rsu-t">Run complete</div><div class="rsu-s muted">${esc(S.time)}</div></div><button class="ib rsu-more" aria-label="More">${ic('more', 'i s')}</button></div><p class="rsu-title">${esc(S.title)}</p><div class="rsu-stats">${S.stats.map(s => `<span><b class="num">${s[0]}</b> ${s[1]}</span>`).join('')}</div><div class="rsu-sec"><div class="rsu-l">What changed</div>${S.files.map(f => `<div class="rsu-it"><span class="mono">${esc(f[0])}</span><span class="num"><i class="${f[2] === '−0' ? 'z' : 'a'}">${f[1]}</i> <i class="${f[2] === '−0' ? 'z' : 'x'}">${f[2]}</i></span></div>`).join('')}</div><div class="rsu-sec"><div class="rsu-l">Needs you</div><div class="rsu-it rsu-need"><span class="dot" style="color:var(--warn)"></span><span class="rsu-nt">${esc(S.need)}</span><button class="pill soft sm rsu-fix">Review</button></div></div><div class="rsu-acts"><button class="pill primary sm">Open changes</button><button class="pill ghost sm rsu-undo">Undo all</button></div></div>`;
    const root = host.querySelector('.rsu');
    const undo = host.querySelector('.rsu-undo');
    const g = host.querySelector('.rsu-g');
    undo.addEventListener('click', () => {
      const on = root.classList.toggle('undone');
      undo.textContent = on ? 'Redo' : 'Undo all';
      host.querySelector('.rsu-t').textContent = on ? 'Changes undone' : 'Run complete';
      g.style.background = on ? 'var(--chip)' : '';
      g.style.color = on ? 'var(--fg2)' : '';
      g.innerHTML = ic(on ? 'undo' : 'check', 'i s');
    });
    host.querySelector('.rsu-fix').addEventListener('click', ev => {
      const b = ev.currentTarget;
      b.innerHTML = '<span class="spin"></span>';
      setTimeout(() => { b.remove(); host.querySelector('.rsu-nt').textContent = S.needDone; }, 700);
    });
    return Promise.resolve();
  }

  function log(host) {
    const acts = COPY.actions;
    const total = acts.reduce((a, x) => a + parseFloat(x.ms), 0).toFixed(1);
    host.innerHTML = `<div class="alg panel"><div class="alg-h"><span class="alg-t">Agent activity</span><span class="alg-st"><span class="dot" style="color:var(--ok)"></span><span>5 steps, ${total}s</span></span></div><ol class="alg-list"></ol></div>`;
    const list = host.querySelector('.alg-list');
    acts.forEach((a, i) => {
      const li = el(`<li class="alg-it"><button class="alg-row" aria-expanded="${i === 2}"><span class="alg-ic">${ic(a.ic)}</span><span class="alg-tx"><b>${a.t}</b><span class="d">${a.d}</span></span><span class="alg-r"><span class="num ms">${a.ms}</span><span class="g"><span style="color:var(--ok)">${ic('check', 'i xs')}</span></span></span></button><div class="fold alg-det ${i === 2 ? '' : 'shut'}"><div><pre>${a.det}</pre></div></div></li>`);
      list.appendChild(li);
      const btn = li.querySelector('.alg-row'), det = li.querySelector('.alg-det');
      btn.addEventListener('click', () => { const shut = det.classList.toggle('shut'); btn.setAttribute('aria-expanded', String(!shut)); });
    });
    return Promise.resolve();
  }

  function queue(host) {
    const G = clone(COPY.queue);
    host.innerHTML = `<div class="rq"><div class="rq-top"><div class="seg2" role="group" aria-label="Density"><button aria-pressed="true" data-v="full">Detailed</button><button aria-pressed="false" data-v="compact">Compact</button></div><span class="rq-all muted num">1 of 3 done</span></div><div class="rq-list panel"></div></div>`;
    const list = host.querySelector('.rq-list');
    const ok = `<span style="color:var(--ok)">${ic('check', 'i xs')}</span>`;
    G.forEach((g, gi) => {
      const status = gi === 0 ? 'done' : gi === 1 ? 'fail' : 'queued';
      const subs = g.subs.map((s, i) => {
        if (gi === 0) return `<div class="rq-sub"><span class="g">${ok}</span><span>${esc(s[0])}</span><span class="m">${esc(s[1])}</span></div>`;
        if (gi === 1 && i < 2) return `<div class="rq-sub"><span class="g">${ok}</span><span>${esc(s[0])}</span><span class="m">${esc(s[1])}</span></div>`;
        if (gi === 1) return `<div class="rq-sub"><span class="g"><span style="color:var(--bad)">${ic('x', 'i xs')}</span></span><span>${esc(s[0])}</span><span class="m"><button class="rq-retry">Retry</button></span></div>`;
        return `<div class="rq-sub wait"><span class="g"><span class="dot" style="color:var(--faint);width:5px;height:5px"></span></span><span>${esc(s[0])}</span><span class="m"></span></div>`;
      }).join('');
      const head = status === 'done' ? ok : status === 'fail' ? `<span style="color:var(--bad)">${ic('alert', 'i xs')}</span>` : '<span class="dot" style="color:var(--faint)"></span>';
      const label = status === 'done' ? 'Done' : status === 'fail' ? '1 step failed' : 'Queued';
      const width = status === 'done' ? '100%' : status === 'fail' ? '66%' : '0%';
      const node = el(`<div class="rq-g"><div class="rq-gh"><span class="g">${head}</span><span>${esc(g.t)}</span><span class="m">${label}</span></div><div class="rq-bar"><i style="width:${width}"></i></div><div class="fold"><div>${subs}</div></div></div>`);
      list.appendChild(node);
      const retry = node.querySelector('.rq-retry');
      if (retry) retry.addEventListener('click', () => {
        retry.closest('.rq-sub').querySelector('.g').innerHTML = ok;
        retry.parentElement.textContent = 'Done';
        node.querySelector('.rq-gh .g').innerHTML = ok;
        node.querySelector('.rq-gh .m').textContent = 'Done';
        node.querySelector('.rq-bar i').style.width = '100%';
        host.querySelector('.rq-all').textContent = '2 of 3 done';
      });
    });
    seg(host.querySelector('.seg2'), v => {
      list.querySelectorAll('.fold').forEach(f => f.classList.toggle('shut', v === 'compact'));
    });
    return Promise.resolve();
  }

  function evals(host) {
    const K = COPY.evals.map(k => ({ ...k, s: k.bad ? 'fail' : 'pass', open: !!k.bad }));
    host.innerHTML = `<div class="evr panel"><div class="evr-h"><div class="evr-ht"><b>${esc(COPY.evalTitle)}</b><span class="muted evr-st">${esc(COPY.evalSt)}</span></div><button class="pill primary sm evr-run">${ic('play', 'i xs')}Run evals</button></div><div class="evr-sum"><div class="evr-segs"></div><div class="evr-nums"><span class="evr-pass num">7 of 8 passed</span><span class="tag evr-dl bad">1 fewer than the last run</span></div></div><div class="evr-tabs"><div class="seg2" role="group" aria-label="Show"><button aria-pressed="true" data-v="all">All <span class="n num">8</span></button><button aria-pressed="false" data-v="fail">Failed <span class="n num">1</span></button></div></div><div class="evr-list"></div><p class="evr-none" hidden>No failed cases</p></div>`;
    const list = host.querySelector('.evr-list');
    const segs = host.querySelector('.evr-segs');
    let filter = 'all';
    function paint() {
      list.innerHTML = '';
      segs.innerHTML = '';
      const fails = K.filter(k => k.s === 'fail').length;
      K.forEach(k => {
        const segI = el(`<i class="${k.s}"></i>`);
        segs.appendChild(segI);
        const open = k.s === 'fail' && k.open;
        const row = el(`<div class="fold evr-w ${filter === 'fail' && k.s !== 'fail' ? 'shut' : ''}"><div><div class="evr-i ${k.s}">${k.s === 'fail' ? `<button class="evr-r" aria-expanded="${open}"><span class="evr-g">${ic('alert', 'i xs')}</span><span class="evr-n">${esc(k.n)}</span><span class="evr-tm num">${k.tm}</span><span class="evr-ch">${ic('chev', 'i xs')}</span></button><div class="fold evr-d ${open ? '' : 'shut'}"><div><div class="evr-dd"><span class="evr-kv"><span class="k">Expected</span><span>${esc(k.exp)}</span></span><span class="evr-kv"><span class="k">Got</span><span class="bad">${esc(k.got)}</span></span><span class="evr-kv"><span class="k">Source</span><span>${esc(k.src)}</span></span><button class="pill sm evr-fix">Use $24 and rerun</button></div></div></div>` : `<div class="evr-r"><span class="evr-g">${k.s === 'pass' ? ic('check', 'i xs') : '<span class="dot"></span>'}</span><span class="evr-n">${esc(k.n)}</span><span class="evr-tm num">${k.s === 'pass' ? k.tm : ''}</span></div>`}</div></div></div>`);
        list.appendChild(row);
        const toggle = row.querySelector('.evr-r');
        if (k.s === 'fail' && toggle.tagName === 'BUTTON') {
          toggle.addEventListener('click', () => {
            k.open = !k.open;
            row.querySelector('.evr-d').classList.toggle('shut', !k.open);
            toggle.setAttribute('aria-expanded', String(k.open));
          });
          row.querySelector('.evr-fix').addEventListener('click', () => {
            k.bad = false; k.s = 'pass'; k.open = false;
            const passed = K.filter(x => x.s === 'pass').length;
            host.querySelector('.evr-pass').textContent = passed + ' of 8 passed';
            const dl = host.querySelector('.evr-dl');
            dl.textContent = passed === 8 ? 'All passing' : (8 - passed) + ' fewer than the last run';
            dl.className = 'tag evr-dl ' + (passed === 8 ? 'ok' : 'bad');
            host.querySelector('[data-v="fail"] .n').textContent = String(8 - passed);
            host.querySelector('.evr-none').hidden = !(filter === 'fail' && passed === 8);
            paint();
          });
        }
      });
    }
    paint();
    seg(host.querySelector('.seg2'), v => {
      filter = v;
      host.querySelector('.evr-none').hidden = !(filter === 'fail' && !K.some(k => k.s === 'fail'));
      paint();
    });
    host.querySelector('.evr-run').addEventListener('click', async () => {
      const run = host.querySelector('.evr-run');
      run.disabled = true;
      run.innerHTML = '<span class="spin"></span>Running';
      K.forEach(k => { k.s = 'queued'; k.open = false; });
      paint();
      for (const k of K) {
        k.s = 'run'; paint();
        await new Promise(r => setTimeout(r, ELEV.REDUCE ? 0 : 280));
        k.s = k.bad ? 'fail' : 'pass';
        if (k.bad) k.open = true;
        paint();
      }
      const passed = K.filter(k => k.s === 'pass').length;
      host.querySelector('.evr-pass').textContent = passed + ' of 8 passed';
      host.querySelector('.evr-st').textContent = 'Copy agent · 8 cases · run just now';
      run.disabled = false;
      run.innerHTML = ic('play', 'i xs') + 'Run again';
    });
    return Promise.resolve();
  }

  function settings(host) {
    const caps = COPY.caps;
    let s = { a: 1, t: [true, false], cap: 2, i: COPY.instructions };
    let saved = JSON.stringify(s);
    host.innerHTML = `<div class="asx panel"><div class="asx-r asx-col"><div class="asx-l"><b>Autonomy</b><span class="muted asx-ad">${esc(COPY.autonomy[1])}</span></div><div class="asx-steps" role="radiogroup" aria-label="Autonomy"><span class="asx-knob"></span><button role="radio" data-v="0">Ask</button><button role="radio" data-v="1" aria-checked="true">Balanced</button><button role="radio" data-v="2">Autopilot</button></div></div><div class="asx-r"><div class="asx-l"><b>Use team memory</b><span class="muted">Brand rules and past decisions</span></div><button class="toggle" role="switch" aria-checked="true" aria-label="Use team memory"></button></div><div class="asx-r"><div class="asx-l"><b>Post a summary in Slack</b><span class="muted">#design, after each run</span></div><button class="toggle" role="switch" aria-checked="false" aria-label="Post a summary in Slack"></button></div><div class="asx-r"><div class="asx-l"><b>Spend cap per run</b><span class="muted">Pauses and asks when reached</span></div><div class="asx-cap"><button class="ib fill asx-m" aria-label="Lower cap">${ic('minus', 'i xs')}</button><span class="num asx-v">$5</span><button class="ib fill asx-p" aria-label="Raise cap">${ic('plus', 'i xs')}</button></div></div><div class="asx-r asx-col"><div class="asx-l"><b>Instructions</b></div><textarea class="asx-ta" rows="2" spellcheck="false">${esc(COPY.instructions)}</textarea></div><div class="asx-bar"><span>Unsaved changes</span><button class="pill ghost sm asx-rs">Reset</button><button class="pill accent sm asx-sv">Save</button></div></div>`;
    const root = host.querySelector('.asx');
    const steps = [...host.querySelectorAll('.asx-steps button')];
    const knob = host.querySelector('.asx-knob');
    const ad = host.querySelector('.asx-ad');
    const tgs = [...host.querySelectorAll('.toggle')];
    const v = host.querySelector('.asx-v');
    const ta = host.querySelector('.asx-ta');
    const dirty = () => root.classList.toggle('dirty', JSON.stringify(s) !== saved);
    const setA = i => { s.a = i; steps.forEach((b, j) => b.setAttribute('aria-checked', j === i ? 'true' : 'false')); knob.style.left = `calc(3px + ${i} * (100% - 6px) / 3)`; ad.textContent = COPY.autonomy[i]; dirty(); };
    steps.forEach((b, i) => b.addEventListener('click', () => setA(i)));
    tgs.forEach((t, i) => t.addEventListener('click', () => { s.t[i] = !s.t[i]; t.setAttribute('aria-checked', String(s.t[i])); dirty(); }));
    const cap = d => { s.cap = Math.max(0, Math.min(caps.length - 1, s.cap + d)); v.textContent = '$' + caps[s.cap]; dirty(); };
    host.querySelector('.asx-m').addEventListener('click', () => cap(-1));
    host.querySelector('.asx-p').addEventListener('click', () => cap(1));
    ta.addEventListener('input', () => { s.i = ta.value; dirty(); });
    host.querySelector('.asx-rs').addEventListener('click', () => {
      s = JSON.parse(saved);
      setA(s.a);
      tgs.forEach((t, i) => t.setAttribute('aria-checked', String(s.t[i])));
      v.textContent = '$' + caps[s.cap];
      ta.value = s.i;
      dirty();
    });
    host.querySelector('.asx-sv').addEventListener('click', () => {
      const b = host.querySelector('.asx-sv');
      b.innerHTML = '<span class="spin"></span>';
      setTimeout(() => { saved = JSON.stringify(s); b.innerHTML = ic('check', 'i xs') + 'Saved'; dirty(); setTimeout(() => { b.textContent = 'Save'; }, 700); }, 500);
    });
    setA(1);
    root.classList.remove('dirty');
    saved = JSON.stringify(s);
    return Promise.resolve();
  }

  Object.assign(ELEV, {
    'thread-panel': { ...(ELEV['thread-panel'] || {}), current: thread },
    'tool-call': { current: tool },
    'attachment-tray': { current: files },
    'agent-lanes': { current: lanes },
    'agent-tree': { current: tree },
    'run-summary': { current: summary },
    'action-log': { current: log },
    'run-queue': { current: queue },
    'eval-results': { current: evals },
    'agent-settings': { current: settings }
  });
})();
