/* Whiteboard template: the data and every interaction. It runs after the shared core (core.js), so it uses the core's helpers
   ($, $$, I, html, ctl, closePops, hideTip, giveBack) and its popovers (data-pop) and tooltips (data-tip). The team, the
   board and what is on it are made up.
   The board is a list of items in world units: sticky notes, text, shapes, frames, pen strokes and connectors (an arrow from
   one item to another, or between two points). The view is a pan and a zoom (V): a point on the board is drawn at
   world × zoom + pan. Notes, text, shapes and frames are elements in one transformed layer; strokes and connectors are paths
   in an SVG in the same layer, so everything zooms as one. What stays one size at any zoom (the selection and its handles,
   the box a drag draws, comment pins and the other people's cursors) is drawn over the canvas in screen units.
   Undo and redo keep whole copies of the list (it is small), one per change you make: a drag, a new note, an edit, a run of
   the agent. Other people's changes are theirs and don't go on your undo list.
   The agent works on the list too: it reads the notes, sorts them into themes by what they say, draws a frame per theme with
   the notes inside and writes a summary beside them; or it reads the pen strokes and redraws the ones that look like a box, an
   ellipse or an arrow as real shapes and connectors. Each run is one change, so Undo takes it back, and Stop puts the board
   back as it was before the run. */
(() => {
  const app = document.querySelector('.wb'); if (!app) return;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const body = $('.wb-body', app), cv = $('.wb-cv', app), world = $('.wb-world', app);
  const framesEl = $('.wb-frames', app), ink = $('.wb-ink', app), itemsEl = $('.wb-items', app);
  const selEl = $('.wbx-sel', app), mqEl = $('.wbx-mq', app), pinsEl = $('.wb-pins', app), cursEl = $('.wb-curs', app);
  const liveEl = $('#wb-live', app);
  const say = t => { liveEl.textContent = ''; setTimeout(() => { liveEl.textContent = t; }, 40); };
  const embedded = document.documentElement.hasAttribute('data-embed');
  const phone = matchMedia('(max-width:640px)');
  const NS = 'http://www.w3.org/2000/svg';
  // Blueprint is the page with no Soft or Clean style: its shapes are drawn square
  const BP = () => !/^(soft|clean)$/.test(document.documentElement.dataset.style || '');
  // the focus a script moves: after a mouse or a finger it shows no ring (the core's giveBack)
  const refocus = el => { if (!el) return; typeof giveBack === 'function' ? giveBack(el) : el.focus({ preventScroll:true }); };

  /* ---------- people: you (Maya) and three others, each with their own colour (their avatar's) ---------- */
  const P = { MK:{ n:'Maya Kim', c:'l', pic:'MK-g03' }, AR:{ n:'Ari Reyes', c:'b', pic:'AR-g02' }, JO:{ n:'Jon Ortiz', c:'k', pic:'JO-g01' }, SL:{ n:'Sam Lee', c:'m', pic:'SL-g09' } };
  const ME = 'MK', OTHERS = ['AR', 'JO', 'SL'];
  const first = k => P[k].n.split(' ')[0];
  // the initials on their colour, as installed; on the site, art.js lays the person's face over it (data-pic)
  const av = (k, cls = '') => `<span class="av${cls ? ' ' + cls : ''}" style="background:var(--dm-av-${P[k].c});color:var(--dm-av-${P[k].c}-ink)" data-pic="${P[k].pic}" aria-hidden="true">${k}</span>`;

  /* ---------- what can be on the board ---------- */
  // sticky notes take the core tag colours; the pen draws in ink or one of three tag text colours; shapes are three kinds
  const NOTE_C = [['y', 'Yellow'], ['p', 'Orange'], ['k', 'Pink'], ['l', 'Violet'], ['b', 'Blue'], ['m', 'Green']];
  const INK_C = [['fg', 'Ink'], ['pb', 'Blue'], ['pr', 'Red'], ['pm', 'Green']];
  const SHAPES = [['rect', 'Rectangle', 'wb-rect'], ['ellipse', 'Ellipse', 'wb-ellipse'], ['diamond', 'Diamond', 'wb-diamond']];
  // the themes the agent sorts notes into, each with its frame's label colour and the words that put a note in it
  const THEMES = [['Pricing', 'p', /pric|plan\b|pay|cost|seat|cheap|sign-on|sso|bill/i], ['Onboarding', 'l', /start|sign.?up|onboard|invite|set ?up|sample|checklist|tour|day one/i],
    ['Speed', 't', /slow|fast|speed|load|timed?\b|lag|second|wait/i], ['Mobile', 'b', /phone|mobile|tablet|train|pinch|touch|ios|android/i]];
  const NW = 160, NH = 104;
  const TOOLS = { select:['Select', 'V'], hand:['Pan', 'H'], sticky:['Sticky note', 'S'], pen:['Pen', 'P'], eraser:['Eraser', 'E'], shape:['Shape', 'R'], arrow:['Connector', 'A'], text:['Text', 'T'], comment:['Comment', 'C'] };
  const KEYS = { v:'select', h:'hand', s:'sticky', p:'pen', e:'eraser', r:'shape', a:'arrow', t:'text', c:'comment' };

  /* ---------- the board as it starts ---------- */
  const note = (id, t, th, c, x, y, by) => ({ id, k:'sticky', x, y, w:NW, h:NH, c, t, th, by });
  // a hand-drawn line, wobbly the way a mouse or a finger draws: a seeded random, so it is the same every time
  const rng = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  function roughRect(x0, y0, x1, y1, r){
    const cs = [[x0, y0], [x1, y0 + 3], [x1 - 2, y1], [x0 + 2, y1 - 2], [x0 + 4, y0 + 6]], pts = [];
    for (let i = 0; i < 4; i++){ const [ax, ay] = cs[i], [bx, by] = cs[i + 1], n = Math.max(6, Math.round(Math.hypot(bx - ax, by - ay) / 10));
      for (let j = 0; j < n; j++){ const t = j / n; pts.push([ax + (bx - ax) * t + (r() - .5) * 2.6, ay + (by - ay) * t + (r() - .5) * 2.6]); } }
    pts.push(cs[4]); return pts;
  }
  function roughEllipse(cx, cy, rx, ry, r){ const pts = []; for (let i = 0; i <= 46; i++){ const a = -2.3 + i / 42 * Math.PI * 2, k = 1 + (r() - .5) * .05; pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]); } return pts; }
  function roughArrow(x0, y0, x1, y1, r){
    const pts = [], n = 12; for (let i = 0; i <= n; i++){ const t = i / n; pts.push([x0 + (x1 - x0) * t + (r() - .5) * 2, y0 + (y1 - y0) * t + Math.sin(t * Math.PI) * 5 + (r() - .5) * 2]); }
    const a = Math.atan2(y1 - y0, x1 - x0), h = 15;
    pts.push([x1 - Math.cos(a - .5) * h, y1 - Math.sin(a - .5) * h], [x1, y1], [x1 - Math.cos(a + .5) * h, y1 - Math.sin(a + .5) * h]);
    return pts;
  }
  // Ari's rough sketch of a flow: a screen, a step, and an arrow between them
  const SKETCH = () => { const r = rng(7); return [roughRect(330, -296, 506, -176, r), roughEllipse(648, -92, 88, 54, r), roughArrow(514, -214, 586, -146, r)]; };
  function seedItems(full){
    const it = [
      { id:'s1', k:'shape', s:'rect', x:-560, y:-424, w:176, h:60, t:'Recruit 8 customers' },
      { id:'s2', k:'shape', s:'rect', x:-328, y:-424, w:176, h:60, t:'Run 45-minute calls' },
      { id:'s3', k:'shape', s:'rect', x:-96, y:-424, w:176, h:60, t:'Sort what we heard' },
      { id:'a1', k:'arrow', from:'s1', to:'s2' }, { id:'a2', k:'arrow', from:'s2', to:'s3' },
      { id:'h1', k:'text', x:-560, y:-312, w:360, h:24, t:'What we heard', big:true },
      note('n1', 'Annual plan price isn’t on the pricing page', 'Pricing', 'y', -560, -256, 'MK'),
      note('n2', 'Didn’t know where to start after sign-up', 'Onboarding', 'k', -376, -244, 'JO'),
      note('n3', 'Search takes seconds on big boards', 'Speed', 'b', -188, -260, 'AR'),
      note('n4', 'Can’t edit notes on a phone', 'Mobile', 'm', 0, -248, 'SL'),
      note('n5', 'The sample project helped a lot', 'Onboarding', 'y', -548, -124, 'MK'),
      note('n6', 'Wants a plan for teams of three', 'Pricing', 'k', -360, -112, 'JO'),
      note('n7', 'Reads boards on the train, can’t add to them', 'Mobile', 'm', -176, -120, 'SL'),
      note('n8', 'Export to PDF timed out twice', 'Speed', 'b', 12, -108, 'AR'),
      note('n9', 'The invite step felt pushy', 'Onboarding', 'y', -556, 20, 'MK'),
      note('n10', 'Compared us with two cheaper tools', 'Pricing', 'b', -368, 28, 'AR'),
      note('n11', 'Fast in the office, slow at home', 'Speed', 'k', -184, 14, 'JO'),
      note('n12', 'A checklist on day one would help', 'Onboarding', 'm', 4, 26, 'SL'),
      note('n13', 'Would pay more for single sign-on', 'Pricing', 'y', -464, 160, 'MK')
    ];
    if (full){
      it.push(note('n14', 'Pinch zoom jumps around', 'Mobile', 'k', -272, 154, 'JO'));
      SKETCH().forEach((p, i) => it.push({ id:'d' + (i + 1), k:'stroke', x:0, y:0, pts:p.map(q => q.map(v => Math.round(v * 10) / 10)), c:'fg', w:2.5, by:'AR' }));
    }
    return it;
  }
  const seedThreads = () => [{ id:'c1', on:'n10', dx:148, dy:-6, msgs:[{ who:'JO', t:'Was this the Northwind call?', at:'2h' }, { who:'MK', t:'Yes. Harbor said the same on Tuesday.', at:'1h' }] }];

  /* ---------- state ---------- */
  const S = { items:[], threads:[], sel:[], follow:null, tool:'select', note:'y', ink:'fg', shape:'rect', dots:true };
  const V = { x:0, y:0, z:1, user:false };
  let uid = 100; const nid = p => p + (++uid);
  const byId = id => S.items.find(i => i.id === id);
  const notes = () => S.items.filter(i => i.k === 'sticky');
  const strokes = () => S.items.filter(i => i.k === 'stroke');
  const snap = () => JSON.stringify(S.items);

  /* ---------- geometry ---------- */
  function boxOf(it){
    if (it.k === 'stroke'){ let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; for (const [x, y] of it.pts){ x0 = Math.min(x0, x); y0 = Math.min(y0, y); x1 = Math.max(x1, x); y1 = Math.max(y1, y); }
      const p = it.w / 2; return { x:it.x + x0 - p, y:it.y + y0 - p, w:x1 - x0 + it.w, h:y1 - y0 + it.w }; }
    if (it.k === 'arrow'){ const [a, b] = ends(it); return { x:Math.min(a[0], b[0]), y:Math.min(a[1], b[1]), w:Math.abs(a[0] - b[0]), h:Math.abs(a[1] - b[1]) }; }
    return { x:it.x, y:it.y, w:it.w, h:it.h };
  }
  const union = bs => { if (!bs.length) return null; let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; bs.forEach(b => { x0 = Math.min(x0, b.x); y0 = Math.min(y0, b.y); x1 = Math.max(x1, b.x + b.w); y1 = Math.max(y1, b.y + b.h); }); return { x:x0, y:y0, w:x1 - x0, h:y1 - y0 }; };
  const meets = (a, b, m = 0) => a.x < b.x + b.w + m && b.x < a.x + a.w + m && a.y < b.y + b.h + m && b.y < a.y + a.h + m;
  const inside = (a, b) => a.x >= b.x && a.y >= b.y && a.x + a.w <= b.x + b.w && a.y + a.h <= b.y + b.h;
  const mid = b => [b.x + b.w / 2, b.y + b.h / 2];
  // a connector's two ends: from the edge of the item it leaves to the edge of the one it reaches, or its own points
  function edgeOf(b, toward, gap = 6){
    const [cx, cy] = mid(b), dx = toward[0] - cx, dy = toward[1] - cy, len = Math.hypot(dx, dy) || 1;
    const t = Math.min(dx ? (b.w / 2) / Math.abs(dx) : 1e9, dy ? (b.h / 2) / Math.abs(dy) : 1e9);
    return [cx + dx * t + dx / len * gap, cy + dy * t + dy / len * gap];
  }
  function ends(it){
    const A = it.from && byId(it.from), B = it.to && byId(it.to);
    const pa = A ? mid(boxOf(A)) : it.a, pb = B ? mid(boxOf(B)) : it.b;
    return [A ? edgeOf(boxOf(A), pb) : pa, B ? edgeOf(boxOf(B), pa) : pb];
  }
  const segDist = (p, a, b) => { const dx = b[0] - a[0], dy = b[1] - a[1], l = dx * dx + dy * dy, t = l ? clamp(((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / l, 0, 1) : 0; return Math.hypot(p[0] - a[0] - dx * t, p[1] - a[1] - dy * t); };
  function nearLine(it, p, r){
    if (it.k === 'arrow'){ const [a, b] = ends(it); return segDist(p, a, b) <= r; }
    const q = it.pts; for (let i = 1; i < q.length; i++) if (segDist(p, [it.x + q[i - 1][0], it.y + q[i - 1][1]], [it.x + q[i][0], it.y + q[i][1]]) <= r + it.w / 2) return true;
    return q.length === 1 && Math.hypot(p[0] - it.x - q[0][0], p[1] - it.y - q[0][1]) <= r;
  }

  /* ---------- drawing the board ---------- */
  const nodes = new Map();
  // a freehand line through its points, smoothed through the midpoints between them
  function inkPath(pts){
    if (!pts.length) return '';
    if (pts.length < 3) return `M${pts[0][0]} ${pts[0][1]}` + pts.slice(1).map(p => `L${p[0]} ${p[1]}`).join('') + (pts.length === 1 ? 'l.01 0' : '');
    let d = `M${pts[0][0]} ${pts[0][1]}`;
    for (let i = 1; i < pts.length - 1; i++){ const [x, y] = pts[i], [nx, ny] = pts[i + 1]; d += `Q${x} ${y} ${(x + nx) / 2} ${(y + ny) / 2}`; }
    const l = pts[pts.length - 1]; return d + `L${l[0]} ${l[1]}`;
  }
  function shapePath(s, w, h){
    if (s === 'ellipse') return `M${w / 2} 1A${w / 2 - 1} ${h / 2 - 1} 0 1 1 ${w / 2 - .01} 1Z`;
    if (s === 'diamond') return `M${w / 2} 1L${w - 1} ${h / 2}L${w / 2} ${h - 1}L1 ${h / 2}Z`;
    const r = Math.min(BP() ? 2 : 12, w / 4, h / 4); return `M${r + 1} 1H${w - r - 1}Q${w - 1} 1 ${w - 1} ${r + 1}V${h - r - 1}Q${w - 1} ${h - 1} ${w - r - 1} ${h - 1}H${r + 1}Q1 ${h - 1} 1 ${h - r - 1}V${r + 1}Q1 1 ${r + 1} 1Z`;
  }
  const label = it => it.k === 'sticky' ? 'Sticky note' : it.k === 'shape' ? SHAPES.find(s => s[0] === it.s)[1] : it.k === 'frame' ? 'Frame' : it.k === 'text' ? 'Text' : it.k === 'arrow' ? 'Connector' : 'Drawing';
  function make(it){
    let el;
    if (it.k === 'stroke' || it.k === 'arrow'){
      el = document.createElementNS(NS, 'g'); el.setAttribute('class', it.k === 'arrow' ? 'wbx-arr' : 'wbx-ink');
      el.innerHTML = '<path class="ln"/>';
    } else if (it.k === 'frame'){
      el = html(`<div class="wb-it wbx-frame"><span class="tag ${it.c}"></span></div>`);
    } else if (it.k === 'shape'){
      el = html(`<div class="wb-it wbx-shape"><svg aria-hidden="true"><path/></svg><div class="tx"></div></div>`);
    } else el = html(`<div class="wb-it ${it.k === 'sticky' ? 'wbx-note' : 'wbx-text'}"><div class="tx"></div></div>`);
    el.dataset.id = it.id; el._k = it.k + (it.s || '');
    return el;
  }
  function paint(el, it){
    if (it.k === 'stroke'){
      el.setAttribute('transform', `translate(${it.x} ${it.y})`);
      const p = el.firstChild; p.setAttribute('d', inkPath(it.pts)); p.style.stroke = `var(--dm-${it.c})`; p.style.strokeWidth = it.w;
      return;
    }
    if (it.k === 'arrow'){
      const [a, b] = ends(it), ang = Math.atan2(b[1] - a[1], b[0] - a[0]), h = 10, s = .45;
      el.firstChild.setAttribute('d', `M${a[0]} ${a[1]}L${b[0]} ${b[1]}M${b[0] - Math.cos(ang - s) * h} ${b[1] - Math.sin(ang - s) * h}L${b[0]} ${b[1]}L${b[0] - Math.cos(ang + s) * h} ${b[1] - Math.sin(ang + s) * h}`);
      return;
    }
    el.style.transform = `translate(${it.x}px,${it.y}px)`;
    el.style.width = it.w + 'px';
    if (it.k !== 'text') el.style.height = it.h + 'px';
    el.classList.toggle('big', !!it.big);
    el.setAttribute('aria-label', label(it) + (it.t ? ': ' + it.t : ''));
    if (it.k === 'frame'){ const t = el.firstChild; t.className = 'tag ' + it.c; if (t.textContent !== it.t) t.textContent = it.t; return; }
    if (it.k === 'sticky'){ el.style.setProperty('--wb-note', `var(--dm-p${it.c}-bg)`); el.style.setProperty('--wb-nc', `var(--dm-av-${it.c})`); }
    if (it.k === 'shape'){ const svg = el.firstChild; svg.setAttribute('width', it.w); svg.setAttribute('height', it.h); svg.setAttribute('viewBox', `0 0 ${it.w} ${it.h}`); svg.firstChild.setAttribute('d', shapePath(it.s, it.w, it.h)); }
    const tx = el.lastChild; if (!(editing && editing.id === it.id) && tx.textContent !== it.t) tx.textContent = it.t || '';
  }
  // the layers in order: frames under everything, then the ink and connectors, then notes, text and shapes
  const layerOf = it => it.k === 'frame' ? framesEl : (it.k === 'stroke' || it.k === 'arrow') ? ink : itemsEl;
  function sync(){
    const ids = new Set(S.items.map(i => i.id));
    for (const [id, el] of nodes) if (!ids.has(id)){ el.remove(); nodes.delete(id); }
    const want = new Map([[framesEl, []], [ink, []], [itemsEl, []]]);
    for (const it of S.items){
      let el = nodes.get(it.id);
      if (!el || el._k !== it.k + (it.s || '')){ if (el) el.remove(); el = make(it); nodes.set(it.id, el); }
      want.get(layerOf(it)).push(el);
      if (it.k !== 'arrow') paint(el, it);
    }
    for (const it of S.items) if (it.k === 'arrow') paint(nodes.get(it.id), it);
    // the order on screen follows the list; elements move only when it changed, so a note being written on keeps its focus
    for (const [layer, els] of want){ const now = [...layer.children]; if (now.length === els.length && now.every((e, i) => e === els[i])) continue; els.forEach(e => layer.appendChild(e)); }
    // text grows with its words: its height is read back from the page
    for (const it of S.items) if (it.k === 'text'){ const h = nodes.get(it.id).offsetHeight; if (h && h !== it.h) it.h = h; }
    nodes.forEach((el, id) => el.classList && el.classList.toggle('on', S.sel.includes(id)));
    paintSel(); paintPins();
  }
  // an item that has just arrived (a note someone added, a frame the agent drew) fades and grows in
  function arrive(id, delay = 0){
    const el = nodes.get(id); if (!el || REDUCE || !el.animate) return;
    el.animate([{ opacity:0, scale:.94 }, { opacity:1, scale:1 }], { duration:340, delay, easing:'cubic-bezier(.23,1,.32,1)', fill:'backwards' });
  }

  /* ---------- the view: pan and zoom ---------- */
  const zl = $('.wb-zl', app), zi = $('.wb-zi', app), zo = $('.wb-zo', app);
  const ZMIN = .25, ZMAX = 4, STEPS = [.25, .33, .5, .67, .75, .9, 1, 1.25, 1.5, 2, 3, 4];
  function applyView(){
    world.style.transform = `translate(${V.x}px,${V.y}px) scale(${V.z})`;
    let s = 24 * V.z; while (s < 12) s *= 2;
    cv.style.backgroundSize = `${s}px ${s}px`; cv.style.backgroundPosition = `${V.x - s / 2}px ${V.y - s / 2}px`;
    zl.textContent = Math.round(V.z * 100) + '%'; zl.setAttribute('aria-label', `Zoom ${Math.round(V.z * 100)}%, zoom to 100%`);
    zi.setAttribute('aria-disabled', String(V.z >= ZMAX - 1e-3)); zo.setAttribute('aria-disabled', String(V.z <= ZMIN + 1e-3));
    paintSel(); paintPins(); paintCurs(); placeThread();
  }
  const size = () => [cv.clientWidth, cv.clientHeight];
  // the room the board is fitted into: clear of the tool rail, the bars and the banners over the canvas
  const room = () => { const [W, H] = size(); return phone.matches ? { l:16, r:16, t:64, b:120, W, H } : { l:88, r:40, t:72, b:88, W, H }; };
  let tw = 0;
  function setView(n, anim){
    const id = ++tw;
    if (!anim || REDUCE){ Object.assign(V, n); applyView(); return; }
    // the view glides by its centre and its zoom (on a log scale), so a zoom and a move read as one movement
    const [W, H] = size(), c0 = [(W / 2 - V.x) / V.z, (H / 2 - V.y) / V.z], c1 = [(W / 2 - n.x) / n.z, (H / 2 - n.y) / n.z], z0 = Math.log(V.z), z1 = Math.log(n.z), t0 = performance.now();
    const f = t => { if (id !== tw) return; const p = Math.min(1, (t - t0) / 420), e = 1 - Math.pow(1 - p, 4), z = Math.exp(z0 + (z1 - z0) * e);
      V.z = z; V.x = W / 2 - (c0[0] + (c1[0] - c0[0]) * e) * z; V.y = H / 2 - (c0[1] + (c1[1] - c0[1]) * e) * z; applyView(); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }
  function fitRect(r, anim, zmax = 1){
    const m = room(), aw = m.W - m.l - m.r, ah = m.H - m.t - m.b; if (aw < 40 || ah < 40) return;
    const z = clamp(Math.min(aw / r.w, ah / r.h), ZMIN, zmax);
    setView({ z, x:m.l + aw / 2 - (r.x + r.w / 2) * z, y:m.t + ah / 2 - (r.y + r.h / 2) * z }, anim);
  }
  const bounds = () => union(S.items.map(boxOf).concat(S.threads.map(th => { const [x, y] = pinAt(th); return { x, y:y - 28, w:28, h:28 }; }))) || { x:-200, y:-150, w:400, h:300 };
  const fitAll = anim => fitRect(bounds(), anim);
  // where the board opens: all of it, or on a phone the notes and their heading, at a size that can be read (Fit shows it all)
  const home = anim => { if (!phone.matches) return fitAll(anim); const ns = S.items.filter(i => i.k === 'sticky' || i.id === 'h1' || i.k === 'frame'); fitRect(ns.length ? union(ns.map(boxOf)) : bounds(), anim); };
  function zoomAt(z, sx, sy, anim){
    z = clamp(z, ZMIN, ZMAX); const wx = (sx - V.x) / V.z, wy = (sy - V.y) / V.z;
    setView({ z, x:sx - wx * z, y:sy - wy * z }, anim);
  }
  const zoomStep = d => { const [W, H] = size(), z = d > 0 ? STEPS.find(s => s > V.z + .01) || ZMAX : [...STEPS].reverse().find(s => s < V.z - .01) || ZMIN; zoomAt(z, W / 2, H / 2, true); };
  const userView = () => { V.user = true; unfollow(); };
  zi.onclick = () => { if (zi.getAttribute('aria-disabled') === 'true') return; userView(); zoomStep(1); };
  zo.onclick = () => { if (zo.getAttribute('aria-disabled') === 'true') return; userView(); zoomStep(-1); };
  zl.onclick = () => { userView(); const [W, H] = size(); zoomAt(1, W / 2, H / 2, true); };
  $('.wb-fit', app).onclick = () => { unfollow(); V.user = false; fitAll(true); };

  /* ---------- selection ---------- */
  const RESIZE = new Set(['sticky', 'shape', 'frame', 'text']);
  function select(ids, quiet){
    S.sel = ids.filter(id => byId(id));
    nodes.forEach((el, id) => el.classList && el.classList.toggle('on', S.sel.includes(id)));
    paintSel();
    if (!quiet && S.sel.length) say(S.sel.length === 1 ? label(byId(S.sel[0])) + ' selected' : S.sel.length + ' items selected');
  }
  const toScreen = b => ({ x:b.x * V.z + V.x, y:b.y * V.z + V.y, w:b.w * V.z, h:b.h * V.z });
  function paintSel(){
    const its = S.sel.map(byId).filter(Boolean);
    if (!its.length || (editing && its.length === 1 && its[0].k !== 'sticky' && its[0].k !== 'shape')){ selEl.hidden = true; return; }
    const b = toScreen(union(its.map(boxOf))), p = 4;
    selEl.hidden = false;
    Object.assign(selEl.style, { transform:`translate(${b.x - p}px,${b.y - p}px)`, width:b.w + p * 2 + 'px', height:b.h + p * 2 + 'px' });
    selEl.classList.toggle('one', its.length === 1 && RESIZE.has(its[0].k) && !editing);
  }

  /* ---------- undo and redo ---------- */
  const H = { undo:[], redo:[] };
  const undoB = $('.wb-undo', app), redoB = $('.wb-redo', app);
  const paintUndo = () => { undoB.setAttribute('aria-disabled', String(!H.undo.length)); redoB.setAttribute('aria-disabled', String(!H.redo.length));
    undoB.dataset.tip = H.undo.length ? 'Undo ' + H.undo[H.undo.length - 1].label : 'Undo'; redoB.dataset.tip = H.redo.length ? 'Redo ' + H.redo[H.redo.length - 1].label : 'Redo'; };
  function commit(before, lab, tag){ if (before === snap()) return false; H.undo.push({ s:before, label:lab, tag }); if (H.undo.length > 100) H.undo.shift(); H.redo.length = 0; paintUndo(); saved(); return true; }
  function load(s){ S.items = JSON.parse(s); S.sel = S.sel.filter(id => byId(id)); S.threads = S.threads.filter(th => !th.on || byId(th.on) || th.x != null); sync(); }
  function undo(){ endEdit(); const e = H.undo.pop(); if (!e) return; H.redo.push({ s:snap(), label:e.label, tag:e.tag }); load(e.s); paintUndo(); saved(); say('Undid ' + e.label); if (runTag === e.tag) hideRun(); }
  function redo(){ endEdit(); const e = H.redo.pop(); if (!e) return; H.undo.push({ s:snap(), label:e.label, tag:e.tag }); load(e.s); paintUndo(); saved(); say('Redid ' + e.label); }
  undoB.onclick = () => { if (H.undo.length) undo(); };
  redoB.onclick = () => { if (H.redo.length) redo(); };
  const savedEl = $('.wb-saved', app); let saveT = 0;
  function saved(){ savedEl.innerHTML = '<span class="spin" aria-hidden="true"></span><span>Saving…</span>'; clearTimeout(saveT); saveT = setTimeout(() => { savedEl.innerHTML = `${I('cloud', 'xs')}<span>Saved</span>`; }, 700); }
  savedEl.innerHTML = `${I('cloud', 'xs')}<span>Saved</span>`;

  /* ---------- changes ---------- */
  function removeItems(ids){
    const gone = new Set(ids);
    // a connector goes with the item at either end of it
    S.items.forEach(i => { if (i.k === 'arrow' && (gone.has(i.from) || gone.has(i.to))) gone.add(i.id); });
    S.items = S.items.filter(i => !gone.has(i.id)); S.sel = S.sel.filter(id => !gone.has(id));
    S.threads = S.threads.filter(th => !gone.has(th.on)); closeThreadIfGone();
    sync(); paintCount();
  }
  function del(){ if (!S.sel.length) return; const b = snap(), n = S.sel.length, one = n === 1 ? label(byId(S.sel[0])).toLowerCase() : null; removeItems(S.sel); commit(b, one ? 'deleting a ' + one : `deleting ${n} items`); say(one ? 'Deleted the ' + one : `Deleted ${n} items`); }
  function duplicate(){
    const its = S.sel.map(byId).filter(i => i && i.k !== 'arrow'); if (!its.length) return; const b = snap(), ids = [];
    its.forEach(i => { const c = JSON.parse(JSON.stringify(i)); c.id = nid(i.k[0]); c.x += 24; c.y += 24; S.items.push(c); ids.push(c.id); });
    sync(); select(ids, true); commit(b, its.length === 1 ? 'duplicating' : `duplicating ${its.length} items`); say(`Duplicated ${its.length === 1 ? 'the ' + label(its[0]).toLowerCase() : its.length + ' items'}`);
  }
  function order(front){
    if (!S.sel.length) return; const b = snap(), set = new Set(S.sel), mine = S.items.filter(i => set.has(i.id)), rest = S.items.filter(i => !set.has(i.id));
    S.items = front ? rest.concat(mine) : mine.concat(rest); sync(); commit(b, front ? 'bringing to front' : 'sending to back');
  }
  function recolour(c){ const its = S.sel.map(byId).filter(i => i && i.k === 'sticky'); if (!its.length) return; const b = snap(); its.forEach(i => { i.c = c; }); sync(); commit(b, 'changing the colour'); S.note = c; paintOpts(); }

  /* ---------- writing on a note, a shape or a text ---------- */
  let editing = null;
  function startEdit(id, before = snap(), isNew = false){
    const it = byId(id), el = nodes.get(id); if (!it || !el || !el.lastChild || it.k === 'frame') return;
    endEdit();
    const tx = el.lastChild; tx.contentEditable = 'true'; tx.setAttribute('role', 'textbox'); tx.setAttribute('aria-multiline', 'true'); tx.setAttribute('aria-label', label(it));
    tx.spellcheck = false; editing = { id, tx, before, isNew }; el.classList.add('edit'); paintSel();
    tx.focus({ preventScroll:true });
    const r = document.createRange(); r.selectNodeContents(tx); if (!isNew) { const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  }
  function endEdit(){
    if (!editing) return; const { id, tx, before, isNew } = editing; editing = null;
    tx.contentEditable = 'false'; tx.removeAttribute('role'); tx.removeAttribute('aria-multiline'); tx.removeAttribute('aria-label');
    const it = byId(id), el = nodes.get(id); if (el) el.classList.remove('edit');
    if (it){ it.t = tx.innerText.replace(/\n{3,}/g, '\n\n').trim(); if (!it.t && it.k === 'text') removeItems([id]); }
    sync(); commit(before, isNew ? 'adding ' + (it ? 'a ' + label(it).toLowerCase() : 'text') : 'editing the text');
  }
  itemsEl.addEventListener('keydown', e => {
    if (!editing) return; e.stopPropagation();
    if (e.key === 'Escape' || (e.key === 'Enter' && (e.metaKey || e.ctrlKey))){ e.preventDefault(); const id = editing.id; endEdit(); select([id], true); cv.focus({ preventScroll:true }); }
  });
  itemsEl.addEventListener('paste', e => { if (!editing) return; e.preventDefault(); document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text/plain')); });
  itemsEl.addEventListener('input', () => { if (!editing) return; const it = byId(editing.id); if (it && it.k === 'text'){ it.h = nodes.get(it.id).offsetHeight; paintSel(); } });
  itemsEl.addEventListener('focusout', e => { if (editing && e.target === editing.tx) setTimeout(() => { if (editing && document.activeElement !== editing.tx) endEdit(); }); });

  /* ---------- the tools ---------- */
  const rail = $('.wb-rail', app), toolBs = $$('.ctb-b[data-t]', rail), opts = $('.wbx-opts', app);
  function setTool(t, quiet){
    if (!TOOLS[t]) return; endEdit(); S.tool = t; app.dataset.tool = t;
    toolBs.forEach(b => { const on = b.dataset.t === t; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; });
    if (t !== 'select') select([], true);
    paintOpts();
    if (!quiet) say(TOOLS[t][0] + ' tool');
  }
  toolBs.forEach(b => b.addEventListener('click', () => setTool(b.dataset.t)));
  rail.addEventListener('keydown', e => {
    const d = { ArrowDown:1, ArrowRight:1, ArrowUp:-1, ArrowLeft:-1 }[e.key]; if (!d) return;
    e.preventDefault(); e.stopPropagation(); const i = toolBs.indexOf(document.activeElement), n = toolBs[(i + d + toolBs.length) % toolBs.length];
    setTool(n.dataset.t); n.focus();
  });
  // a tool's options, beside its button: a note's colour, the pen's ink, the shape to draw
  function paintOpts(){
    const t = S.tool, list = t === 'sticky' ? NOTE_C : t === 'pen' ? INK_C : t === 'shape' ? SHAPES : null;
    if (!list){ opts.hidden = true; opts.innerHTML = ''; return; }
    const cur = t === 'sticky' ? S.note : t === 'pen' ? S.ink : S.shape;
    opts.setAttribute('aria-label', t === 'sticky' ? 'Note colour' : t === 'pen' ? 'Ink' : 'Shape');
    opts.innerHTML = list.map(([v, n, ic]) => `<button class="wbx-sw${t === 'shape' ? ' shp' : ''}" role="radio" aria-checked="${v === cur}" tabindex="${v === cur ? 0 : -1}" data-v="${v}" aria-label="${n}" data-tip="${n}">${t === 'shape' ? I(ic) : `<i style="background:var(--dm-${t === 'sticky' ? 'p' + v + '-bg' : v})"></i>`}</button>`).join('');
    opts.dataset.t = t; opts.hidden = false;
    // beside the tool's own button on the rail (above the bar on phones)
    const b = toolBs.find(x => x.dataset.t === t), br = b.getBoundingClientRect(), hb = body.getBoundingClientRect();
    if (phone.matches){ opts.style.left = ''; opts.style.top = ''; }
    else { opts.style.left = ''; opts.style.top = Math.max(8, br.top - hb.top + br.height / 2 - opts.offsetHeight / 2) + 'px'; }
  }
  opts.addEventListener('click', e => {
    const b = e.target.closest('.wbx-sw'); if (!b) return; const v = b.dataset.v;
    if (S.tool === 'sticky') S.note = v; else if (S.tool === 'pen') S.ink = v; else S.shape = v;
    $$('.wbx-sw', opts).forEach(x => { const on = x === b; x.setAttribute('aria-checked', String(on)); x.tabIndex = on ? 0 : -1; });
  });
  opts.addEventListener('keydown', e => { const d = { ArrowDown:1, ArrowRight:1, ArrowUp:-1, ArrowLeft:-1 }[e.key]; if (!d) return; e.preventDefault(); e.stopPropagation(); const bs = $$('.wbx-sw', opts), i = bs.indexOf(document.activeElement), n = bs[(i + d + bs.length) % bs.length]; n.click(); n.focus(); });

  /* ---------- the canvas: pointer and touch ---------- */
  const ptrs = new Map();
  let G = null, space = false, engaged = !embedded;
  const toWorld = (cx, cy) => { const r = cv.getBoundingClientRect(); return [(cx - r.left - V.x) / V.z, (cy - r.top - V.y) / V.z]; };
  // what is under the pointer: a note, text or shape on top, then a line or connector, then a frame by its label
  function hitAt(e, wx, wy){
    const el = e.target.closest && e.target.closest('.wb-items [data-id], .wbx-frame .tag');
    if (el){ const id = (el.dataset.id ? el : el.parentElement).dataset.id; return byId(id); }
    const r = 7 / V.z; for (let i = S.items.length - 1; i >= 0; i--){ const it = S.items[i]; if ((it.k === 'stroke' || it.k === 'arrow') && nearLine(it, [wx, wy], r)) return it; }
    return null;
  }
  // an item a connector may end on, under a point on the screen
  function targetAt(cx, cy, not){
    for (const el of document.elementsFromPoint(cx, cy)){ const n = el.closest && el.closest('.wb-items [data-id]'); if (n && n.dataset.id !== not) return byId(n.dataset.id); }
    const [wx, wy] = toWorld(cx, cy); for (let i = S.items.length - 1; i >= 0; i--){ const it = S.items[i]; if (it.k === 'frame' && it.id !== not && inside({ x:wx, y:wy, w:0, h:0 }, boxOf(it))) return it; }
    return null;
  }
  cv.addEventListener('pointerdown', e => {
    if (e.button === 2 || e.target.closest('.wbx-pin')) return;
    if (editing && editing.tx.contains(e.target)) return;
    if (embedded) engaged = true; cv.classList.toggle('engaged', engaged);
    closeCtx(); if (editing) endEdit();
    ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (ptrs.size === 2){ startPinch(); return; }
    if (ptrs.size > 2) return;
    e.preventDefault(); cv.focus({ preventScroll:true });
    try { cv.setPointerCapture(e.pointerId); } catch(x){}
    const [wx, wy] = toWorld(e.clientX, e.clientY), tool = (space || e.button === 1) ? 'hand' : S.tool, before = snap();
    if (tool === 'hand'){ userView(); G = { t:'pan', sx:e.clientX, sy:e.clientY, vx:V.x, vy:V.y }; cv.classList.add('pan'); return; }
    if (tool === 'select'){
      const h = e.target.closest('.wbx-sel i');
      if (h && S.sel.length === 1){ const it = byId(S.sel[0]); G = { t:'resize', before, it, h:h.dataset.h, o:{ x:it.x, y:it.y, w:it.w, h:it.h }, wx, wy }; return; }
      const hit = hitAt(e, wx, wy);
      if (hit){
        if (e.shiftKey){ select(S.sel.includes(hit.id) ? S.sel.filter(i => i !== hit.id) : S.sel.concat(hit.id)); G = null; return; }
        if (!S.sel.includes(hit.id)) select([hit.id]);
        // a frame carries what sits inside it
        const mv = new Set(S.sel); S.sel.map(byId).filter(i => i && i.k === 'frame').forEach(f => S.items.forEach(i => { if (i.k !== 'arrow' && i.id !== f.id && inside(boxOf(i), boxOf(f))) mv.add(i.id); }));
        G = { t:'move', before, wx, wy, o:[...mv].map(byId).filter(Boolean).map(i => ({ i, x:i.x, y:i.y, a:i.a && [...i.a], b:i.b && [...i.b] })), moved:false };
        return;
      }
      G = { t:'mq', wx, wy, sx:e.clientX, sy:e.clientY, base:e.shiftKey ? [...S.sel] : [] }; if (!e.shiftKey) select([], true);
      return;
    }
    if (tool === 'pen'){ const it = { id:nid('d'), k:'stroke', x:0, y:0, pts:[[wx, wy]], c:S.ink, w:2.5, by:ME }; S.items.push(it); sync(); G = { t:'draw', before, it }; return; }
    if (tool === 'eraser'){ G = { t:'erase', before, n:0, lx:wx, ly:wy }; eraseAt(wx, wy); return; }
    if (tool === 'shape'){ const it = { id:nid('s'), k:'shape', s:S.shape, x:wx, y:wy, w:1, h:1, t:'' }; G = { t:'shape', before, it, wx, wy, added:false }; return; }
    if (tool === 'arrow'){
      const from = targetAt(e.clientX, e.clientY), it = { id:nid('a'), k:'arrow', from:from && from.k !== 'arrow' ? from.id : null, to:null, a:[wx, wy], b:[wx, wy] };
      G = { t:'arrow', before, it, added:false, sx:e.clientX, sy:e.clientY }; return;
    }
    if (tool === 'sticky'){
      const it = { id:nid('n'), k:'sticky', x:Math.round(wx - NW / 2), y:Math.round(wy - NH / 2), w:NW, h:NH, c:S.note, t:'', by:ME };
      S.items.push(it); sync(); arrive(it.id); setTool('select', true); select([it.id], true); startEdit(it.id, before, true); G = null; return;
    }
    if (tool === 'text'){
      const it = { id:nid('t'), k:'text', x:Math.round(wx), y:Math.round(wy - 10), w:240, h:20, t:'' };
      S.items.push(it); sync(); setTool('select', true); select([it.id], true); startEdit(it.id, before, true); G = null; return;
    }
    if (tool === 'comment'){ setTool('select', true); newThread(wx, wy); G = null; }
  });
  cv.addEventListener('pointermove', e => {
    if (ptrs.has(e.pointerId)) ptrs.set(e.pointerId, [e.clientX, e.clientY]);
    if (G && G.t === 'pinch'){ movePinch(); return; }
    if (!G) return;
    const [wx, wy] = toWorld(e.clientX, e.clientY);
    if (G.t === 'pan'){ V.x = G.vx + e.clientX - G.sx; V.y = G.vy + e.clientY - G.sy; applyView(); return; }
    if (G.t === 'move'){
      let dx = wx - G.wx, dy = wy - G.wy; if (!G.moved && Math.hypot(dx * V.z, dy * V.z) < 3) return; G.moved = true;
      G.o.forEach(o => { if (o.i.k === 'arrow'){ if (o.a) o.i.a = [o.a[0] + dx, o.a[1] + dy]; if (o.b) o.i.b = [o.b[0] + dx, o.b[1] + dy]; } else { o.i.x = Math.round(o.x + dx); o.i.y = Math.round(o.y + dy); } });
      sync(); return;
    }
    if (G.t === 'resize'){
      const { it, o, h } = G, dx = wx - G.wx, dy = wy - G.wy, m = it.k === 'frame' ? 120 : 40;
      if (h.includes('e')) it.w = Math.max(m, Math.round(o.w + dx)); if (h.includes('s') && it.k !== 'text') it.h = Math.max(m, Math.round(o.h + dy));
      if (h.includes('w')){ const w = Math.max(m, Math.round(o.w - dx)); it.x = o.x + o.w - w; it.w = w; }
      if (h.includes('n') && it.k !== 'text'){ const hh = Math.max(m, Math.round(o.h - dy)); it.y = o.y + o.h - hh; it.h = hh; }
      sync(); return;
    }
    if (G.t === 'mq'){
      const x = Math.min(wx, G.wx), y = Math.min(wy, G.wy), r = { x, y, w:Math.abs(wx - G.wx), h:Math.abs(wy - G.wy) }, s = toScreen(r);
      mqEl.hidden = false; Object.assign(mqEl.style, { transform:`translate(${s.x}px,${s.y}px)`, width:s.w + 'px', height:s.h + 'px' });
      const ids = S.items.filter(i => meets(boxOf(i), r) && (i.k !== 'frame' || inside(boxOf(i), r))).map(i => i.id);
      select([...new Set(G.base.concat(ids))], true); return;
    }
    if (G.t === 'draw'){ const p = G.it.pts, l = p[p.length - 1]; if (Math.hypot(wx - l[0], wy - l[1]) * V.z < 2) return; p.push([Math.round(wx * 10) / 10, Math.round(wy * 10) / 10]); paint(nodes.get(G.it.id), G.it); return; }
    if (G.t === 'erase'){ const n = Math.max(1, Math.ceil(Math.hypot(wx - G.lx, wy - G.ly) * V.z / 6)); for (let i = 1; i <= n; i++) eraseAt(G.lx + (wx - G.lx) * i / n, G.ly + (wy - G.ly) * i / n); G.lx = wx; G.ly = wy; return; }
    if (G.t === 'shape'){
      const it = G.it; it.x = Math.round(Math.min(wx, G.wx)); it.y = Math.round(Math.min(wy, G.wy)); it.w = Math.max(1, Math.round(Math.abs(wx - G.wx))); it.h = Math.max(1, Math.round(Math.abs(wy - G.wy)));
      if (e.shiftKey){ const s = Math.max(it.w, it.h); it.w = it.h = s; }
      if (!G.added && (it.w > 6 || it.h > 6)){ S.items.push(it); G.added = true; }
      if (G.added) sync(); return;
    }
    if (G.t === 'arrow'){
      const it = G.it; it.b = [wx, wy]; const to = targetAt(e.clientX, e.clientY, it.from); it.to = to && to.k !== 'arrow' && to.id !== it.from ? to.id : null;
      if (!G.added && Math.hypot(e.clientX - G.sx, e.clientY - G.sy) > 6){ S.items.push(it); G.added = true; }
      if (G.added){ sync(); nodes.forEach((el, id) => el.classList && el.classList.toggle('aim', id === it.to)); } return;
    }
  });
  function endGesture(e){
    ptrs.delete(e.pointerId);
    if (G && G.t === 'pinch'){ if (ptrs.size < 2) G = null; return; }
    const g = G; G = null; cv.classList.remove('pan'); mqEl.hidden = true;
    if (!g || e.type === 'pointercancel' && g.t !== 'pan'){ if (g && g.before) { load(g.before); } return; }
    if (g.t === 'move' && g.moved) commit(g.before, g.o.length === 1 ? 'moving the ' + label(g.o[0].i).toLowerCase() : `moving ${g.o.length} items`);
    if (g.t === 'resize') commit(g.before, 'resizing the ' + label(g.it).toLowerCase());
    if (g.t === 'mq' && S.sel.length) say(S.sel.length === 1 ? label(byId(S.sel[0])) + ' selected' : S.sel.length + ' items selected');
    if (g.t === 'draw'){ if (g.it.pts.length < 2){ const p = g.it.pts[0]; g.it.pts.push([p[0] + .1, p[1]]); paint(nodes.get(g.it.id), g.it); } commit(g.before, 'drawing'); }
    if (g.t === 'erase' && g.n) commit(g.before, g.n === 1 ? 'erasing a drawing' : `erasing ${g.n} drawings`);
    if (g.t === 'shape'){
      const it = g.it; if (!g.added){ it.w = 160; it.h = it.s === 'rect' ? 96 : 112; it.x = Math.round(g.wx - it.w / 2); it.y = Math.round(g.wy - it.h / 2); S.items.push(it); }
      sync(); arrive(it.id); setTool('select', true); select([it.id], true); commit(g.before, 'adding a ' + label(it).toLowerCase());
    }
    if (g.t === 'arrow'){
      nodes.forEach(el => el.classList && el.classList.remove('aim'));
      const it = g.it; if (!g.added) return;
      if (it.from && it.to === it.from) it.to = null;
      sync(); setTool('select', true); select([it.id], true); commit(g.before, 'adding a connector');
    }
  }
  cv.addEventListener('pointerup', endGesture); cv.addEventListener('pointercancel', endGesture);
  // (the pointer was captured by the canvas, so what was double-clicked is read from the point, not the event's target)
  const under = e => ({ target:document.elementFromPoint(e.clientX, e.clientY) || cv });
  cv.addEventListener('dblclick', e => {
    if (S.tool !== 'select' || (editing && editing.tx.contains(e.target))) return; const [wx, wy] = toWorld(e.clientX, e.clientY), hit = hitAt(under(e), wx, wy);
    if (hit && (hit.k === 'sticky' || hit.k === 'shape' || hit.k === 'text')){ select([hit.id], true); startEdit(hit.id); return; }
    // a double click on the empty board writes there
    if (!hit){ const before = snap(), it = { id:nid('t'), k:'text', x:Math.round(wx), y:Math.round(wy - 10), w:240, h:20, t:'' }; S.items.push(it); sync(); select([it.id], true); startEdit(it.id, before, true); }
  });
  function eraseAt(wx, wy){ const r = 8 / V.z, hit = S.items.filter(i => i.k === 'stroke' && nearLine(i, [wx, wy], r)).map(i => i.id); if (!hit.length) return; G.n += hit.length; removeItems(hit); }
  // two fingers: pinch to zoom, move to pan
  function startPinch(){
    if (G && G.t === 'draw'){ S.items = S.items.filter(i => i !== G.it); sync(); }
    if (G && G.before && G.t !== 'pan' && G.t !== 'draw') load(G.before);
    userView(); const [a, b] = [...ptrs.values()], r = cv.getBoundingClientRect(), m = [(a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top];
    G = { t:'pinch', d:Math.hypot(a[0] - b[0], a[1] - b[1]) || 1, z:V.z, w:[(m[0] - V.x) / V.z, (m[1] - V.y) / V.z] }; mqEl.hidden = true;
  }
  function movePinch(){
    const [a, b] = [...ptrs.values()]; if (!b) return; const r = cv.getBoundingClientRect(), m = [(a[0] + b[0]) / 2 - r.left, (a[1] + b[1]) / 2 - r.top];
    const z = clamp(G.z * Math.hypot(a[0] - b[0], a[1] - b[1]) / G.d, ZMIN, ZMAX); V.z = z; V.x = m[0] - G.w[0] * z; V.y = m[1] - G.w[1] * z; applyView();
  }
  cv.addEventListener('wheel', e => {
    if (!engaged) return; e.preventDefault(); userView(); closeCtx();
    if (e.ctrlKey || e.metaKey){ const r = cv.getBoundingClientRect(); zoomAt(V.z * Math.exp(-clamp(e.deltaY, -50, 50) * .01), e.clientX - r.left, e.clientY - r.top); }
    else { V.x -= e.deltaX; V.y -= e.deltaY; applyView(); }
  }, { passive:false });

  /* ---------- an item's menu: right-click, or Shift F10 on what is selected ---------- */
  const ctx = $('.wb-ctx', app); let ctxOn = false;
  function openCtx(cx, cy){
    const its = S.sel.map(byId).filter(Boolean); if (!its.length) return; closePops(); hideTip();
    const notesSel = its.filter(i => i.k === 'sticky'), canEdit = its.length === 1 && ['sticky', 'shape', 'text'].includes(its[0].k);
    ctx.innerHTML = (canEdit ? `<button class="mi" role="menuitem" data-a="edit">${I('edit')}<span>Edit text</span><span class="r">↵</span></button>` : '')
      + `<button class="mi" role="menuitem" data-a="dup">${I('copy')}<span>Duplicate</span><span class="r">⌘D</span></button>`
      + `<button class="mi" role="menuitem" data-a="front">${I('wb-front')}<span>Bring to front</span></button>`
      + `<button class="mi" role="menuitem" data-a="back">${I('layers')}<span>Send to back</span></button>`
      + (notesSel.length ? `<div class="sep" role="separator"></div><div class="wbx-cc" role="group" aria-label="Note colour">${NOTE_C.map(([v, n]) => `<button class="wbx-sw" role="menuitemradio" aria-checked="${notesSel.every(i => i.c === v)}" data-c="${v}" aria-label="${n}" data-tip="${n}"><i style="background:var(--dm-p${v}-bg)"></i></button>`).join('')}</div>` : '')
      + `<div class="sep" role="separator"></div><button class="mi cxm-del" role="menuitem" data-a="del">${I('trash')}<span class="t">Delete</span><span class="r">⌫</span></button>`;
    ctx.classList.add('open'); ctx.inert = false; ctxOn = true;
    const a = app.getBoundingClientRect(), w = ctx.offsetWidth, h = ctx.offsetHeight;
    let x = cx - a.left, y = cy - a.top; if (x + w > a.width - 8) x = Math.max(8, x - w); if (y + h > a.height - 8) y = Math.max(8, y - h);
    ctx.style.left = x + 'px'; ctx.style.top = y + 'px'; ctx.style.setProperty('--dm-origin', 'top left');
    const f = $('.mi', ctx); if (f && byKey) f.focus({ preventScroll:true });
  }
  function closeCtx(back){ if (!ctxOn) return; ctxOn = false; ctx.classList.remove('open'); ctx.inert = true; if (back) cv.focus({ preventScroll:true }); }
  ctx.addEventListener('click', e => {
    const sw = e.target.closest('.wbx-sw'); if (sw){ recolour(sw.dataset.c); $$('.wbx-sw', ctx).forEach(x => x.setAttribute('aria-checked', String(x === sw))); return; }
    const b = e.target.closest('.mi'); if (!b) return; const a = b.dataset.a; closeCtx(true);
    if (a === 'edit') startEdit(S.sel[0]); else if (a === 'dup') duplicate(); else if (a === 'front') order(true); else if (a === 'back') order(false); else if (a === 'del') del();
  });
  ctx.addEventListener('keydown', e => {
    if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); closeCtx(true); return; }
    const it = $$('button', ctx), i = it.indexOf(document.activeElement);
    const d = { ArrowDown:1, ArrowUp:-1 }[e.key]; if (d){ e.preventDefault(); e.stopPropagation(); it[(i + d + it.length) % it.length].focus(); }
  });
  cv.addEventListener('contextmenu', e => {
    e.preventDefault(); const [wx, wy] = toWorld(e.clientX, e.clientY), hit = hitAt(e, wx, wy);
    if (!hit){ closeCtx(); return; } if (!S.sel.includes(hit.id)) select([hit.id], true); openCtx(e.clientX, e.clientY);
  });
  document.addEventListener('pointerdown', e => { if (ctxOn && !ctx.contains(e.target)) closeCtx(); }, true);

  /* ---------- people: the bar's faces, their cursors and following one of them ---------- */
  const people = $('.wb-people', app);
  people.innerHTML = OTHERS.map(k => `<button class="wbx-face" data-who="${k}" aria-pressed="false" aria-label="Follow ${P[k].n}" data-tip="Follow ${first(k)}">${av(k)}</button>`).join('') + `<span class="wbx-more num" aria-hidden="true">+1</span>`;
  people.addEventListener('click', e => { const b = e.target.closest('.wbx-face'); if (b) S.follow === b.dataset.who ? unfollow() : follow(b.dataset.who); });
  // where each person is, on the board, and the part of the board each one has on screen
  const CUR = { AR:{ x:560, y:-340, on:true }, JO:{ x:-300, y:240, on:true }, SL:{ x:150, y:-30, on:true }, AG:{ x:0, y:0, on:false } };
  const PV = { AR:{ x:290, y:-340, w:520, h:340 }, JO:{ x:-600, y:-300, w:760, h:560 }, SL:{ x:-200, y:-300, w:700, h:500 } };
  cursEl.innerHTML = Object.keys(CUR).map(k => k === 'AG'
    ? `<div class="wbx-cur ag" data-k="AG"><svg viewBox="0 0 16 16"><path d="M2 1.5l11.5 6-5 1.4-2.3 5z"/></svg><span class="nm">${I('spark', 'xs')}Agent</span></div>`
    : `<div class="wbx-cur" data-k="${k}" style="--wb-cc:var(--dm-av-${P[k].c});--wb-ci:var(--dm-av-${P[k].c}-ink)"><svg viewBox="0 0 16 16"><path d="M2 1.5l11.5 6-5 1.4-2.3 5z"/></svg><span class="nm">${first(k)}</span></div>`).join('');
  const curEls = Object.fromEntries($$('.wbx-cur', cursEl).map(el => [el.dataset.k, el]));
  function paintCurs(){
    const [W, H] = size();
    for (const k in CUR){ const c = CUR[k], el = curEls[k], x = c.x * V.z + V.x, y = c.y * V.z + V.y;
      el.style.transform = `translate(${Math.round(x)}px,${Math.round(y)}px)`; el.classList.toggle('on', c.on && x > -40 && y > -40 && x < W + 10 && y < H + 10); }
  }
  function moveCur(k, x, y, ms = 600){
    const c = CUR[k], fx = c.x, fy = c.y, t0 = performance.now(); c.tw = t0;
    if (REDUCE || ms <= 0){ c.x = x; c.y = y; paintCurs(); return; }
    const f = t => { if (c.tw !== t0) return; const p = Math.min(1, (t - t0) / ms), e = p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; c.x = fx + (x - fx) * e; c.y = fy + (y - fy) * e; paintCurs(); if (p < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  }
  const folEl = $('.wbx-follow', app);
  function follow(k){
    S.follow = k; closePops();
    folEl.innerHTML = `${av(k)}<span class="t">Following <b>${esc(P[k].n)}</b></span><button class="pill line sm wbx-unf">Stop</button>`;
    folEl.hidden = false; body.classList.add('fol'); body.style.setProperty('--wb-fc', `var(--dm-av-${P[k].c})`);
    $$('.wbx-face', people).forEach(b => { const on = b.dataset.who === k; b.setAttribute('aria-pressed', String(on)); b.setAttribute('aria-label', (on ? 'Stop following ' : 'Follow ') + P[b.dataset.who].n); b.dataset.tip = (on ? 'Stop following ' : 'Follow ') + first(b.dataset.who); });
    $('.wbx-unf', folEl).onclick = () => { unfollow(); refocus(people.querySelector(`[data-who="${k}"]`)); };
    fitRect(PV[k], true, 1.25); say(`Following ${P[k].n}. Moving the view yourself stops it`);
  }
  function unfollow(quiet){
    if (!S.follow) return; const k = S.follow; S.follow = null;
    folEl.hidden = true; body.classList.remove('fol');
    $$('.wbx-face', people).forEach(b => { b.setAttribute('aria-pressed', 'false'); b.setAttribute('aria-label', 'Follow ' + P[b.dataset.who].n); b.dataset.tip = 'Follow ' + first(b.dataset.who); });
    if (!quiet) say('Stopped following ' + first(k));
  }
  const setPV = (k, r) => { PV[k] = r; if (S.follow === k) fitRect(r, true, 1.25); };

  /* ---------- comments: pins on the board and their threads (Comments) ---------- */
  const thEl = $('.wb-thread', app), cl = $('#wb-p-cmts', app), cnB = $('.wb-cmts', app), cnN = $('.wb-cn', app);
  let openTh = null;
  const pinAt = th => { const it = th.on && byId(th.on); return it ? [it.x + th.dx, it.y + th.dy] : [th.x, th.y]; };
  const placeOf = th => { const [x, y] = pinAt(th), on = th.on && byId(th.on); const f = on || S.items.slice().reverse().find(i => i.k !== 'arrow' && i.k !== 'stroke' && inside({ x, y, w:0, h:0 }, boxOf(i)));
    return f ? (f.k === 'frame' ? `“${f.t}”` : f.t ? `“${f.t.length > 28 ? f.t.slice(0, 26).trim() + '…' : f.t}”` : 'a ' + label(f).toLowerCase()) : 'the board'; };
  function paintPins(){
    const live = S.threads.filter(th => th.msgs.length || th === openTh);
    const have = new Map($$('.wbx-pin', pinsEl).map(p => [p.dataset.th, p]));
    live.forEach((th, i) => {
      let p = have.get(th.id); have.delete(th.id);
      if (!p){ p = html(`<button class="wbx-pin" data-th="${th.id}"></button>`); pinsEl.appendChild(p); p._who = null; }
      const who = th.msgs.length ? th.msgs[0].who : ME;
      if (p._who !== who){ p.innerHTML = av(who); p._who = who; }
      p.setAttribute('aria-label', th.msgs.length ? `Comment by ${P[who].n}: ${th.msgs[0].t}${th.msgs.length > 1 ? `, ${th.msgs.length - 1} ${th.msgs.length === 2 ? 'reply' : 'replies'}` : ''}` : 'New comment');
      p.setAttribute('aria-expanded', String(th === openTh));
      const [x, y] = pinAt(th); p.style.transform = `translate(${Math.round(x * V.z + V.x)}px,${Math.round(y * V.z + V.y)}px)`;
    });
    have.forEach(p => p.remove());
  }
  const paintCount = () => { const n = S.threads.filter(th => th.msgs.length).length; cnN.textContent = n || ''; cnB.setAttribute('aria-label', n ? `Comments, ${n} open` : 'Comments'); };
  pinsEl.addEventListener('click', e => { const p = e.target.closest('.wbx-pin'); if (!p) return; const th = S.threads.find(t => t.id === p.dataset.th); th === openTh ? closeThread() : openThread(th); });
  const cmsg = (m, rp) => `<div class="cmx-c">${av(m.who)}<div class="b"><div class="n"><b>${esc(P[m.who].n)}</b><span class="t">${esc(m.at)}</span></div><div class="tx">${esc(m.t)}</div></div></div>`;
  function paintThread(){
    const th = openTh; if (!th) return;
    const [h, ...rs] = th.msgs, n = S.threads.filter(t => t.msgs.length).indexOf(th) + 1;
    thEl.innerHTML = `<div class="cmx panel" role="dialog" aria-label="Comment on ${esc(placeOf(th))}">
      <div class="cmx-h"><span class="cmx-pin" aria-hidden="true">${n || '+'}</span><b>On ${esc(placeOf(th))}</b><span class="cmx-st num"></span>${th.msgs.length ? `<button class="ib cmx-res" aria-label="Resolve thread" data-tip="Resolve thread">${I('check', 'xs')}</button>` : ''}<button class="ib wbx-thx" aria-label="Close" data-tip="Close" data-tip-k="Esc">${I('x', 'xs')}</button></div>
      ${th.msgs.length ? `<div class="cmx-th">${cmsg(h)}${rs.length ? `<div class="cmx-rp" role="group" aria-label="Replies">${rs.map(m => cmsg(m)).join('')}</div>` : ''}</div>` : ''}
      <div class="cmx-in"><div class="cmx-box"><input placeholder="${th.msgs.length ? 'Reply' : 'Add a comment'}" aria-label="${th.msgs.length ? 'Reply' : 'Add a comment'}" spellcheck="false" autocomplete="off"><button class="cmx-go" aria-label="Send" disabled>${I('up', 'xs')}</button></div></div>
    </div>`;
    const inp = $('input', thEl), go = $('.cmx-go', thEl);
    inp.oninput = () => { go.disabled = !inp.value.trim(); };
    const send = () => { const v = inp.value.trim(); if (!v) return; th.msgs.push({ who:ME, t:v, at:'now' }); paintThread(); paintPins(); paintCount(); say(th.msgs.length === 1 ? 'Comment added' : 'Reply sent'); $('input', thEl).focus(); };
    inp.onkeydown = e => { if (e.key === 'Enter'){ e.preventDefault(); send(); } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); closeThread(true); } };
    go.onclick = send;
    $('.wbx-thx', thEl).onclick = () => closeThread(true);
    const rs2 = $('.cmx-res', thEl); if (rs2) rs2.onclick = () => resolve(th);
    placeThread();
  }
  function openThread(th, quiet){
    if (!th) return; closePops(); closeCtx(); if (openTh && openTh !== th && !openTh.msgs.length) S.threads = S.threads.filter(t => t !== openTh);
    openTh = th; thEl.hidden = false; paintThread(); paintPins();
    // a pin out of sight is brought into view first
    const [x, y] = pinAt(th), sx = x * V.z + V.x, sy = y * V.z + V.y, [W, H] = size();
    // (on a phone the thread opens as a sheet at the bottom, so the pin goes to the top half)
    const ph = phone.matches;
    if (sx < 40 || sy < 40 || sx > W - 40 || sy > (ph ? H * .45 : H - 40)){ unfollow(); setView({ z:V.z, x:W / 2 - x * V.z - (ph ? 0 : 120), y:(ph ? H * .3 : H / 2) - y * V.z }, true); }
    if (!quiet) $('input', thEl).focus({ preventScroll:true });
  }
  function closeThread(back){
    if (!openTh) return; const th = openTh; openTh = null; thEl.hidden = true; thEl.innerHTML = '';
    if (!th.msgs.length) S.threads = S.threads.filter(t => t !== th);
    paintPins(); if (back){ const p = $(`.wbx-pin[data-th="${th.id}"]`, pinsEl); p ? refocus(p) : cv.focus({ preventScroll:true }); }
  }
  const closeThreadIfGone = () => { if (openTh && !S.threads.includes(openTh)) closeThread(); };
  function placeThread(){
    if (!openTh || thEl.hidden) return; const [x, y] = pinAt(openTh), b = body.getBoundingClientRect(), r = cv.getBoundingClientRect();
    if (phone.matches){ thEl.style.left = ''; thEl.style.top = ''; return; }
    const w = thEl.offsetWidth, h = thEl.offsetHeight, sx = x * V.z + V.x + r.left - b.left, sy = y * V.z + V.y + r.top - b.top;
    let L = sx + 22, T = sy - 26; if (L + w > b.width - 12) L = sx - w - 30; L = clamp(L, 12, b.width - w - 12); T = clamp(T, 12, b.height - h - 12);
    thEl.style.left = Math.round(L) + 'px'; thEl.style.top = Math.round(T) + 'px';
  }
  function newThread(wx, wy){
    const on = S.items.slice().reverse().find(i => (i.k === 'sticky' || i.k === 'shape' || i.k === 'frame') && inside({ x:wx, y:wy, w:0, h:0 }, boxOf(i)));
    const th = on ? { id:nid('c'), on:on.id, dx:wx - on.x, dy:wy - on.y, msgs:[] } : { id:nid('c'), x:wx, y:wy, msgs:[] };
    S.threads.push(th); openThread(th);
  }
  function resolve(th){
    S.threads = S.threads.filter(t => t !== th); closeThread(); paintCount(); paintPins();
    toast('Comment resolved', `On ${placeOf(th)}`, { t:'Undo', run:() => { S.threads.push(th); paintPins(); paintCount(); say('Comment reopened'); } });
  }
  // the list of comments, from the bar
  cnB.addEventListener('click', paintList);
  function paintList(){
    const ths = S.threads.filter(t => t.msgs.length);
    cl.innerHTML = `<div class="wbx-clh"><b>Comments</b><span class="muted num">${ths.length || ''}</span></div>` + (ths.length ? `<div class="wbx-cls">${ths.map(th => `<button class="mi wbx-cr" data-th="${th.id}" data-close>${av(th.msgs[0].who)}<span class="t"><span class="n"><b>${esc(P[th.msgs[0].who].n)}</b><span class="muted">${esc(th.msgs[th.msgs.length - 1].at)}</span></span><span class="x">${esc(th.msgs[0].t)}</span><span class="muted d">On ${esc(placeOf(th))}${th.msgs.length > 1 ? ` · ${th.msgs.length - 1} ${th.msgs.length === 2 ? 'reply' : 'replies'}` : ''}</span></span></button>`).join('')}</div>`
      : `<p class="wbx-cle muted">No comments yet. Press C, then click the board.</p>`);
  }
  cl.addEventListener('click', e => { const b = e.target.closest('.wbx-cr'); if (!b) return; const th = S.threads.find(t => t.id === b.dataset.th); setTimeout(() => openThread(th), 130); });

  /* ---------- toasts (Toast) ---------- */
  const toasts = $('.wb-toasts', app);
  function toast(b, s = '', act = null, ic = 'ok'){
    const t = html(`<div class="tst-t tst-in" role="status"><span class="g" style="${ic === 'ok' ? 'color:var(--dm-ok);background:var(--dm-ok-bg)' : 'color:var(--dm-fg2);background:var(--dm-chip)'}">${I(ic)}</span><div class="tx"><b>${esc(b)}</b>${s ? `<span>${esc(s)}</span>` : ''}</div><div class="acts">${act ? `<button class="pill ghost sm">${act.t}</button>` : ''}<button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div></div>`);
    const out = () => { if (!t.isConnected || t.classList.contains('tst-out')) return; t.classList.add('tst-out'); setTimeout(() => t.remove(), 320); };
    $('.ib', t).onclick = out; if (act) $('.pill', t).onclick = () => { act.run(); out(); };
    toasts.appendChild(t); while (toasts.children.length > 2) toasts.firstElementChild.remove();
    let left = 5000, t0 = performance.now(), tm = setTimeout(out, left);
    t.addEventListener('pointerenter', () => { clearTimeout(tm); left -= performance.now() - t0; });
    t.addEventListener('pointerleave', () => { t0 = performance.now(); tm = setTimeout(out, Math.max(1200, left)); });
  }
  $('.wb-share', app).onclick = () => {
    const url = location.origin + location.pathname.replace(/\.html$/, '');
    const done = () => toast('Link copied', 'Paste it to share the board');
    try { navigator.clipboard.writeText(url).then(done, done); } catch(e){ done(); }
  };

  /* ---------- the board's menu and its name ---------- */
  $('#wb-p-more', app).addEventListener('click', e => {
    const b = e.target.closest('.mi'); if (!b) return; const a = b.dataset.a;
    if (a === 'dots'){ S.dots = !S.dots; b.setAttribute('aria-checked', String(S.dots)); cv.classList.toggle('nodots', !S.dots); }
    else if (a === 'all') setTimeout(selectAll, 130);
    else if (a === 'fit'){ unfollow(); V.user = false; fitAll(true); }
    else if (a === 'replay') setTimeout(replay, 130);
  });
  const selectAll = () => { setTool('select', true); select(S.items.map(i => i.id)); };
  const h1b = $('.wb-h1b', app), h1t = $('.wb-h1t', app);
  h1b.onclick = () => {
    const inp = html(`<input class="wb-h1i" aria-label="Board name" spellcheck="false" autocomplete="off">`); inp.value = h1t.textContent; h1b.replaceWith(inp); inp.focus(); inp.select();
    const done = keep => { if (!inp.isConnected) return; const v = inp.value.trim(); if (keep && v) h1t.textContent = v; inp.replaceWith(h1b); refocus(h1b); if (keep && v) { saved(); say('Board renamed to ' + v); } };
    inp.onkeydown = e => { e.stopPropagation(); if (e.key === 'Enter') done(true); if (e.key === 'Escape') done(false); };
    inp.onblur = () => done(true);
  };

  /* ---------- Ask the agent: Command palette ---------- */
  const cmd = $('.wb-cmd', app), q = $('.cpl-q', cmd), list = $('.cpl-list', cmd), st = $('.cpl-st', cmd);
  list.id = 'wb-cpl'; q.setAttribute('role', 'combobox'); q.setAttribute('aria-expanded', 'true'); q.setAttribute('aria-controls', list.id); q.setAttribute('aria-autocomplete', 'list');
  let items = [], hi = 0, back = null;
  const isOpen = el => !el.hidden && !el.classList.contains('out');
  const showOver = el => { el.hidden = false; el.classList.remove('out'); };
  const hideOver = el => { el.classList.add('out'); setTimeout(() => { if (el.classList.contains('out')){ el.hidden = true; el.classList.remove('out'); } }, REDUCE ? 0 : 180); };
  function actions(){
    const n = notes().length, d = strokes().length, TI = { select:'cursor', hand:'hand', sticky:'wb-note', pen:'wb-pen', eraser:'wb-eraser', shape:'wb-shape', arrow:'wb-arrow', text:'wb-text', comment:'comment' };
    return [
      { g:'Agent', ic:'spark', t:'Group the notes by theme', h:n >= 3 ? `${n} notes, into frames with a summary` : 'Needs 3 notes or more', run:() => agentRun('group'), off:n < 3, ask:true },
      { g:'Agent', ic:'wand', t:'Tidy the sketches into shapes', h:d ? `${d} ${d === 1 ? 'drawing' : 'drawings'}` : 'Nothing drawn yet', run:() => agentRun('tidy'), off:!d, ask:true },
      ...Object.entries(TOOLS).map(([k, [t, key]]) => ({ g:'Tools', ic:TI[k], t, h:key, run:() => { setTool(k); cv.focus({ preventScroll:true }); } })),
      { g:'Board', ic:'fit', t:'Fit to screen', h:'⇧1', run:() => { unfollow(); V.user = false; fitAll(true); } },
      { g:'Board', ic:'cursor', t:'Select all', h:'⌘A', run:selectAll }
    ];
  }
  function paintCmd(){
    const v = q.value.trim(), lv = v.toLowerCase(), m = s => !lv || s.toLowerCase().includes(lv);
    const R = actions().filter(a => m(a.t + ' ' + a.g));
    if (v) R.push({ g:'Ask the agent', ic:'spark', t:`“${v}”`, h:'It can group notes or tidy sketches', run:() => askFree(v), ask:true });
    let h = '<span class="cpl-hl"></span>', g = '';
    R.forEach((x, i) => { if (x.g !== g){ g = x.g; h += `<div class="cpl-g" role="presentation">${g}</div>`; } h += `<button class="cpl-i${x.ask ? ' ask' : ''}" role="option" id="wb-cpl-${i}" tabindex="-1" data-i="${i}"${x.off ? ' aria-disabled="true"' : ''}><span class="ic">${I(x.ic, 'xs')}</span><span class="t">${esc(x.t)}</span>${x.h ? `<span class="h">${esc(x.h)}</span>` : ''}</button>`; });
    list.innerHTML = h; items = R; hi = R.findIndex(x => !x.off); if (hi < 0) hi = 0; moveHi(0);
    st.textContent = `${R.length} ${R.length === 1 ? 'result' : 'results'}`;
  }
  function moveHi(d){
    const bs = $$('.cpl-i', list), hl = $('.cpl-hl', list); if (!bs.length){ q.removeAttribute('aria-activedescendant'); hl.style.opacity = 0; return; }
    hi = (hi + d + bs.length) % bs.length; bs.forEach((b, i) => { b.classList.toggle('hl', i === hi); b.setAttribute('aria-selected', String(i === hi)); });
    const b = bs[hi]; hl.style.opacity = 1; hl.style.top = b.offsetTop + 'px'; hl.style.height = b.offsetHeight + 'px'; q.setAttribute('aria-activedescendant', b.id); b.scrollIntoView({ block:'nearest' });
  }
  const runItem = i => { const x = items[i]; if (!x || x.off) return; closeCmd(false); x.run(); };
  function openCmd(quiet){ if (isOpen(cmd)) return; closePops(); closeCtx(); endEdit(); back = document.activeElement; showOver(cmd); q.value = ''; paintCmd(); if (!quiet) q.focus(); }
  function closeCmd(restore = true){ if (!isOpen(cmd)) return; hideOver(cmd); if (restore && back && back.isConnected) refocus(back); }
  q.addEventListener('input', paintCmd);
  q.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); moveHi(e.key === 'ArrowDown' ? 1 : -1); } else if (e.key === 'Enter'){ e.preventDefault(); runItem(hi); } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); closeCmd(); } else if (e.key === 'Tab') e.preventDefault(); });
  list.addEventListener('click', e => { const b = e.target.closest('.cpl-i'); if (b) runItem(+b.dataset.i); });
  list.addEventListener('pointermove', e => { const b = e.target.closest('.cpl-i'); if (b && +b.dataset.i !== hi) moveHi(+b.dataset.i - hi); });
  cmd.addEventListener('pointerdown', e => { if (e.target === cmd) closeCmd(); });
  const askB = $('.wb-ask', app); askB.onclick = () => openCmd(!!(demo && demo.own));
  function askFree(v){
    if (/group|cluster|theme|sort|organi[sz]e|categor/i.test(v)) return agentRun('group');
    if (/tidy|clean|shape|neat|straighten|redraw/i.test(v)) return agentRun('tidy');
    toast('The agent can’t do that here yet', 'It can group the notes by theme or tidy sketches into shapes', null, 'spark');
  }

  /* ---------- the agent's run, in Status pill ---------- */
  const runEl = $('.wb-run', app), runPill = $('.spl-pill', runEl), runIn = $('.spl-in', runEl);
  let RUN = null, runSeq = 0, runTag = null, runHide = 0, runN = '';
  const MARK = { think:'<span class="think on"><i></i><i></i><i></i><i></i></span>', radar:'<span class="radar"></span>', spin:'<span class="spin"></span>' };
  const work = (m, w, n = '') => `<span class="g" style="color:var(--dm-fg)">${MARK[m]}</span><span class="shim">${esc(w)}</span>${n ? `<span class="m n num">${n}</span>` : ''}<button class="pill line sm wb-rstop">Stop</button>`;
  // the pill hugs what it says, easing between widths; its words cross-fade (as Status pill does)
  function fitRun(){ runIn.style.width = 'max-content'; const w = runIn.scrollWidth; runIn.style.width = ''; runPill.style.width = Math.min(w, body.clientWidth - 24) + 'px'; }
  function runSet(h){
    clearTimeout(runHide); const first = runEl.hidden; runEl.hidden = false;
    if (first){ runIn.innerHTML = h; runIn.classList.remove('out'); fitRun(); wireRun(); if (!REDUCE) runPill.animate([{ opacity:0, transform:'translateY(-6px)' }, { opacity:1, transform:'none' }], { duration:340, easing:'cubic-bezier(.23,1,.32,1)' }); return; }
    runPill.style.width = runPill.offsetWidth + 'px'; runIn.classList.add('out');
    setTimeout(() => { runIn.innerHTML = h; const n = $('.n', runIn); if (n && runN) n.textContent = runN; runIn.classList.remove('out'); fitRun(); wireRun(); }, REDUCE ? 0 : 170);
  }
  const setN = v => { runN = v; const n = $('.n', runIn); if (n) n.textContent = v; };
  function wireRun(){
    const s = $('.wb-rstop', runIn); if (s) s.onclick = stopRun;
    const u = $('.wb-rundo', runIn); if (u) u.onclick = () => { const top = H.undo[H.undo.length - 1]; if (top && top.tag === runTag) undo(); hideRun(); cv.focus({ preventScroll:true }); };
    const x = $('.wb-rx', runIn); if (x) x.onclick = () => { hideRun(); cv.focus({ preventScroll:true }); };
  }
  function hideRun(now){
    clearTimeout(runHide); if (runEl.hidden) return;
    if (now || REDUCE){ runEl.hidden = true; return; }
    const a = runPill.animate([{ opacity:1 }, { opacity:0, transform:'translateY(-6px)' }], { duration:220, easing:'cubic-bezier(.23,1,.32,1)', fill:'forwards' });
    a.onfinish = () => { runEl.hidden = true; a.cancel(); };
  }
  async function agentRun(kind){
    if (RUN) return; endEdit(); select([], true); closeThread();
    const rc = ctl(), before = snap(), R = RUN = { kind, rc, before, id:++runSeq }; runN = '';
    try {
      const res = kind === 'group' ? await groupNotes(rc) : await tidy(rc);
      if (RUN !== R) return; RUN = null; CUR.AG.on = false; paintCurs(); cv.classList.remove('glide');
      runTag = commit(before, kind === 'group' ? 'grouping the notes' : 'tidying the sketches', R.id) ? R.id : null;
      runSet(`<span class="g" style="color:var(--dm-ok-mark)">${I('ok')}</span><span>${esc(res)}</span>${runTag ? '<button class="pill line sm wb-rundo">Undo</button>' : ''}<button class="ib wb-rx" aria-label="Dismiss" data-tip="Dismiss">${I('x', 'xs')}</button>`);
      say(res); runHide = setTimeout(() => { if (!runEl.matches(':hover') && !runEl.contains(document.activeElement)) hideRun(); }, 12000);
    } catch(e){ if (e !== 'stop') console.error(e); }
  }
  function stopRun(){
    const R = RUN; if (!R) return; RUN = null; R.rc.stop(); cv.classList.remove('glide'); load(R.before); CUR.AG.on = false; paintCurs();
    runSet(`<span class="g"><span class="dot" style="color:var(--dm-faint)"></span></span><span class="fg2">Stopped. The board is as it was</span><span class="end"></span>`);
    say('Stopped the agent. The board is as it was'); runHide = setTimeout(() => hideRun(), 2600); cv.focus({ preventScroll:true });
  }
  const themeOf = it => it.th && THEMES.some(t => t[0] === it.th) ? it.th : (THEMES.find(t => t[2].test(it.t || '')) || ['Other'])[0];
  async function groupNotes(rc){
    // a second run starts again from the notes: last time's frames and summary go
    S.items = S.items.filter(i => !(i.k === 'frame' && i.ai) && !(i.k === 'text' && i.ai)); sync();
    const ns = notes(), n = ns.length, nb = union(ns.map(boxOf));
    CUR.AG.x = nb.x + nb.w / 2; CUR.AG.y = nb.y - 40; CUR.AG.on = true; paintCurs();
    runSet(work('think', `Reading ${n} notes`, `0 of ${n}`)); setN(`0 of ${n}`);
    await rc.wait(500);
    for (let i = 0; i < n; i++){ const b = boxOf(ns[i]); moveCur('AG', b.x + b.w * .55, b.y + b.h * .6, 150); await rc.wait(170); setN(`${i + 1} of ${n}`); }
    runSet(work('radar', 'Finding themes')); runN = '';
    await rc.wait(1100);
    const by = new Map(); ns.forEach(it => { const t = themeOf(it); if (!by.has(t)) by.set(t, []); by.get(t).push(it); });
    const order = THEMES.map(t => t[0]).concat('Other').filter(t => by.has(t)), k = order.length;
    // a frame per theme, two notes across, the frames two across, from where the notes were
    const PAD = 20, HEAD = 56, GAP = 16, FG = 32, cols = 2;
    const fr = order.map(t => { const its = by.get(t), cw = Math.max(...its.map(i => i.w)), ch = Math.max(...its.map(i => i.h)), c = Math.min(cols, its.length), r = Math.ceil(its.length / cols);
      return { t, its, cw, ch, w:PAD * 2 + c * cw + (c - 1) * GAP, h:HEAD + r * ch + (r - 1) * GAP + PAD }; });
    const colW = [0, 1].map(c => Math.max(0, ...fr.filter((f, j) => j % 2 === c).map(f => f.w))), rowH = [];
    fr.forEach((f, j) => { const r = j >> 1; rowH[r] = Math.max(rowH[r] || 0, f.h); });
    fr.forEach((f, j) => { const c = j % 2, r = j >> 1; f.x = Math.round(nb.x + (c ? colW[0] + FG : 0)); f.y = Math.round(nb.y + rowH.slice(0, r).reduce((s, v) => s + v + FG, 0)); });
    runSet(work('spin', `Grouping into ${k} frames`, `1 of ${k}`)); setN(`1 of ${k}`);
    await rc.wait(420);
    // the frames appear one after another and each theme's notes glide straight into theirs, close together, so the notes
    // are only on the move for a moment and never sit half-sorted over the frames
    cv.classList.add('glide');
    for (let j = 0; j < k; j++){
      const f = fr[j], id = nid('f'), col = (THEMES.find(t => t[0] === f.t) || [0, 'k'])[1];
      S.items.unshift({ id, k:'frame', x:f.x, y:f.y, w:f.w, h:f.h, t:f.t, c:col, ai:true });
      f.its.forEach((it, i) => { it.x = f.x + PAD + (i % cols) * (f.cw + GAP); it.y = f.y + HEAD + Math.floor(i / cols) * (f.ch + GAP); });
      sync(); arrive(id); moveCur('AG', f.x + 60, f.y + 30, 260); setN(`${j + 1} of ${k}`);
      await rc.wait(420);
    }
    await rc.wait(REDUCE ? 0 : 480); cv.classList.remove('glide');
    // the summary, beside the frames, where nothing else sits
    runSet(work('spin', 'Writing the summary')); runN = '';
    const fb = union(fr.map(f => ({ x:f.x, y:f.y, w:f.w, h:f.h }))), sid = nid('t');
    let sx = fb.x + fb.w + 48, sy = fb.y + 64; const others = S.items.filter(i => !(i.k === 'frame' && i.ai) && i.k !== 'sticky').map(boxOf);
    while (others.some(b => meets(b, { x:sx, y:sy, w:300, h:120 }, 24))) sy += 24;
    const counts = order.filter(t => t !== 'Other').map(t => [t, by.get(t).length]).sort((a, b) => b[1] - a[1]);
    const words = (`Summary: ${n} notes in ${k} ${k === 1 ? 'theme' : 'themes'}. ` + (counts.length ? `${counts[0][0]} comes up most (${counts[0][1]} notes)` + (counts[1] ? `, then ${counts[1][0]} (${counts[1][1]})` : '') + '. ' : '')
      + (by.has('Mobile') ? 'Editing on a phone is the clearest gap.' : by.has('Speed') ? 'Speed on big boards is the clearest gap.' : '')).trim().split(' ');
    S.items.push({ id:sid, k:'text', x:sx, y:sy, w:300, h:20, t:'', ai:true }); sync(); moveCur('AG', sx + 20, sy + 12, 380);
    const it = byId(sid);
    for (const w of words){ it.t += (it.t ? ' ' : '') + w; paint(nodes.get(sid), it); await rc.wait(45); }
    sync(); moveCur('AG', sx + 280, sy + 40, 300); await rc.wait(360);
    return `Grouped ${n} notes into ${k} ${k === 1 ? 'theme' : 'themes'}`;
  }
  // what a pen stroke looks like: a closed box or ellipse, an arrow (a straight line out to its tip), or nothing to tidy
  function readStroke(it){
    const p = it.pts.map(q => [q[0] + it.x, q[1] + it.y]); if (p.length < 6) return null;
    const b = boxOf(it), x0 = b.x + it.w / 2, y0 = b.y + it.w / 2, w = b.w - it.w, h = b.h - it.w; if (w < 24 && h < 24) return null;
    const s = p[0], far = p.reduce((m, q, i) => Math.hypot(q[0] - s[0], q[1] - s[1]) > m[0] ? [Math.hypot(q[0] - s[0], q[1] - s[1]), i] : m, [0, 0]);
    const end = p[p.length - 1], closed = Math.hypot(end[0] - s[0], end[1] - s[1]) < .25 * Math.max(w, h);
    if (closed && w > 30 && h > 30){
      const cx = x0 + w / 2, cy = y0 + h / 2, rx = w / 2, ry = h / 2;
      const ee = p.reduce((t, q) => t + Math.abs(Math.hypot((q[0] - cx) / rx, (q[1] - cy) / ry) - 1), 0) / p.length;
      const er = p.reduce((t, q) => t + Math.min(Math.abs(q[0] - x0), Math.abs(q[0] - x0 - w), Math.abs(q[1] - y0), Math.abs(q[1] - y0 - h)) / (Math.min(w, h) / 2), 0) / p.length;
      return { k:er < ee ? 'rect' : 'ellipse', box:{ x:Math.round(x0), y:Math.round(y0), w:Math.round(w), h:Math.round(h) } };
    }
    const tip = p[far[1]], L = far[0]; if (L < 40) return null;
    const dev = Math.max(...p.slice(0, far[1] + 1).map(q => segDist(q, s, tip)));
    return dev < .16 * L ? { k:'arrow', a:s, b:tip } : null;
  }
  async function tidy(rc){
    const ds = strokes(), m = ds.length, db = union(ds.map(boxOf));
    CUR.AG.x = db.x + db.w / 2; CUR.AG.y = db.y - 40; CUR.AG.on = true; paintCurs();
    runSet(work('radar', `Reading ${m} ${m === 1 ? 'drawing' : 'drawings'}`)); runN = '';
    const found = [];
    for (const d of ds){ const b = boxOf(d); moveCur('AG', b.x + b.w / 2, b.y + b.h / 2, 360); await rc.wait(480); const r = readStroke(d); if (r) found.push([d, r]); }
    if (!found.length){ await rc.wait(300); return 'Nothing to tidy: no drawing looks like a shape'; }
    const shapes = found.filter(f => f[1].k !== 'arrow'), arrows = found.filter(f => f[1].k === 'arrow'), total = found.length;
    runSet(work('spin', 'Drawing shapes', `1 of ${total}`)); setN(`1 of ${total}`);
    let i = 0;
    for (const [d, r] of shapes){
      const id = nid('s'), at = S.items.indexOf(d);
      S.items.splice(at, 1, { id, k:'shape', s:r.k, x:r.box.x, y:r.box.y, w:r.box.w, h:r.box.h, t:'', ai:true });
      sync(); arrive(id); moveCur('AG', r.box.x + r.box.w * .7, r.box.y + r.box.h * .7, 300); setN(`${++i} of ${total}`); await rc.wait(560);
    }
    const near = pt => S.items.slice().reverse().find(x => (x.k === 'shape' || x.k === 'sticky') && meets(boxOf(x), { x:pt[0], y:pt[1], w:0, h:0 }, 28));
    for (const [d, r] of arrows){
      const id = nid('a'), A = near(r.a), B = near(r.b), at = S.items.indexOf(d);
      S.items.splice(at, 1, { id, k:'arrow', from:A ? A.id : null, to:B && B !== A ? B.id : null, a:r.a, b:r.b, ai:true });
      sync(); moveCur('AG', r.b[0], r.b[1], 300); setN(`${++i} of ${total}`); await rc.wait(560);
    }
    return `Tidied ${total} ${total === 1 ? 'drawing' : 'drawings'} into shapes`;
  }

  /* ---------- keys ---------- */
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase(), mod = e.metaKey || e.ctrlKey;
    if (mod && k === 'k' && !e.shiftKey){ e.preventDefault(); isOpen(cmd) ? closeCmd() : openCmd(); return; }
    if (isOpen(cmd)) return;
    const t = e.target, typing = t.closest && t.closest('input,textarea,[contenteditable="true"]');
    if (typing) return;
    if (t !== document.body && !app.contains(t)) return;
    const onBoard = t === document.body || t === cv || cv.contains(t);
    if (mod && k === 'z'){ e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (mod && k === 'y'){ e.preventDefault(); redo(); return; }
    if (mod && k === 'a' && onBoard){ e.preventDefault(); selectAll(); return; }
    if (mod && k === 'd' && onBoard && S.sel.length){ e.preventDefault(); duplicate(); return; }
    if (mod || e.altKey) return;
    if (e.key === 'Escape'){
      if (ctxOn){ closeCtx(true); return; } if ($('.pop.open', app)) return;
      if (openTh){ closeThread(true); return; }
      if (S.sel.length){ select([]); say('Nothing selected'); return; }
      if (S.tool !== 'select'){ setTool('select'); return; }
      if (S.follow){ unfollow(); return; }
      return;
    }
    if ($('.pop.open', app) || ctxOn) return;
    if ((e.shiftKey && e.key === 'F10') || e.key === 'ContextMenu'){ if (S.sel.length){ e.preventDefault(); const b = toScreen(union(S.sel.map(byId).map(boxOf))), r = cv.getBoundingClientRect(); openCtx(r.left + b.x + b.w / 2, r.top + b.y + b.h / 2); } return; }
    if (e.shiftKey && (e.code === 'Digit1' || e.key === '!')){ e.preventDefault(); unfollow(); V.user = false; fitAll(true); return; }
    if (e.shiftKey && (e.code === 'Digit0' || e.key === ')')){ e.preventDefault(); zl.click(); return; }
    if (e.key === '+' || e.key === '='){ e.preventDefault(); zi.click(); return; }
    if (e.key === '-' || e.key === '_'){ e.preventDefault(); zo.click(); return; }
    if (!onBoard && !t.closest('.wb-rail,.wb-view')) return;
    if (e.key === ' ' && onBoard){ e.preventDefault(); if (!space){ space = true; cv.classList.add('space'); } return; }
    if (!onBoard){ if (KEYS[k] && !e.shiftKey && !t.closest('[role="radiogroup"]')){ setTool(KEYS[k]); } return; }
    // Tab on the board steps through what is on it, one item at a time, and out of the board after the last
    if (e.key === 'Tab' && t === cv){
      const its = S.items.filter(i => i.k !== 'arrow').sort((a, b) => a.y - b.y || a.x - b.x), at = S.sel.length === 1 ? its.findIndex(i => i.id === S.sel[0]) : -1;
      const nx = at < 0 ? (e.shiftKey ? its.length - 1 : 0) : at + (e.shiftKey ? -1 : 1);
      if (at >= 0 && (nx < 0 || nx >= its.length)){ select([], true); return; }
      const it = its[nx]; if (!it) return; e.preventDefault(); select([it.id]);
      const b = toScreen(boxOf(it)), [W, H] = size(); if (b.x < 80 || b.y < 60 || b.x + b.w > W - 40 || b.y + b.h > H - 80){ unfollow(); const [cx, cy] = mid(boxOf(it)); setView({ z:V.z, x:W / 2 - cx * V.z, y:H / 2 - cy * V.z }, true); }
      return;
    }
    if ((e.key === 'Delete' || e.key === 'Backspace') && S.sel.length){ e.preventDefault(); del(); return; }
    if (e.key === 'Enter' && S.sel.length === 1 && ['sticky', 'shape', 'text'].includes(byId(S.sel[0]).k)){ e.preventDefault(); startEdit(S.sel[0]); return; }
    const ar = { ArrowLeft:[-1, 0], ArrowRight:[1, 0], ArrowUp:[0, -1], ArrowDown:[0, 1] }[e.key];
    if (ar){
      e.preventDefault(); const d = e.shiftKey ? 32 : 8;
      if (S.sel.length){ const b = snap(); S.sel.map(byId).forEach(i => { if (i.k === 'arrow'){ if (i.a) i.a = [i.a[0] + ar[0] * d, i.a[1] + ar[1] * d]; if (i.b) i.b = [i.b[0] + ar[0] * d, i.b[1] + ar[1] * d]; } else { i.x += ar[0] * d; i.y += ar[1] * d; } }); sync(); commit(b, 'nudging'); }
      else { userView(); V.x -= ar[0] * 48; V.y -= ar[1] * 48; applyView(); }
      return;
    }
    if (KEYS[k] && !e.shiftKey){ setTool(KEYS[k]); return; }
  }, true);
  document.addEventListener('keyup', e => { if (e.key === ' ' && space){ space = false; cv.classList.remove('space'); } });
  addEventListener('blur', () => { space = false; cv.classList.remove('space'); });

  // a switch of style redraws the shapes (Blueprint's are square)
  new MutationObserver(() => sync()).observe(document.documentElement, { attributes:true, attributeFilter:['data-style'] });

  /* ---------- first paint ---------- */
  const DEMO = !REDUCE && !/[?&]demo=0\b/.test(location.search);
  function boardAt(start){ S.items = seedItems(!start); S.threads = seedThreads(); S.sel = []; nodes.forEach(el => el.remove()); nodes.clear(); sync(); paintCount(); }
  boardAt(DEMO);
  setTool('select', true); home(false);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { sync(); if (!V.user && !S.follow) home(false); });
  // the board fits again when the canvas changes size, unless you moved the view yourself
  new ResizeObserver(() => { if (!V.user && !S.follow) home(false); else applyView(); paintOpts(); placeThread(); }).observe(cv);

  /* ---------- the demo: a short session that plays by itself. Jon adds a note, you follow Ari while Ari sketches a flow, then
     ask the agent to group the notes, and Sam comments on a frame. It loops until the visitor does anything: the first real
     click, key, touch or scroll in the app ends it for good (Replay demo plays it again). A mouse resting on the app holds it
     where it is (the controller's waits); the agent's own run keeps going, as an agent at work does. With reduced motion, or
     ?demo=0, it doesn't play and the board opens as the session leaves it ---------- */
  let demo = null, hand = null;
  const mine = e => { if (e.isTrusted && demo && !demo.own) demo.mine = true; };
  ['pointerdown', 'keydown', 'input', 'wheel'].forEach(t => app.addEventListener(t, mine, true));
  app.addEventListener('focusin', e => { if (e.isTrusted && demo && typeof lastInput === 'number' && e.timeStamp - lastInput < 100) demo.mine = true; }, true);
  app.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse' && demo) demo.held = true; });
  app.addEventListener('pointerleave', () => { if (demo && demo.held){ demo.held = false; demo.release(); } });
  const at = el => { const a = app.getBoundingClientRect(), b = el.getBoundingClientRect(); return [b.left - a.left + Math.min(b.width * .6, b.width - 10), b.top - a.top + b.height * .58]; };
  const put = (x, y) => { if (!hand){ hand = html('<span class="hand wbx-hand" aria-hidden="true"><svg viewBox="0 0 18 18"><path d="M3 2l11.5 6.1-5 1.5-2.4 5z"/></svg></span>'); app.appendChild(hand); }
    if (!hand.classList.contains('on')){ hand.style.transition = 'none'; hand.style.transform = `translate(${x + 24}px,${y + 28}px)`; void hand.offsetWidth; hand.style.transition = ''; hand.classList.add('on'); }
    hand.style.transform = `translate(${x}px,${y}px)`; };
  const away = () => { if (hand) hand.classList.remove('on', 'down'); };
  async function tap(c, el){
    if (!el || !el.getClientRects().length) throw 'stop';
    const [x, y] = at(el); put(x, y); await c.step(480);
    hand.classList.remove('down'); void hand.offsetWidth; hand.classList.add('down'); await c.step(160);
    c.own = (c.own || 0) + 1; try { el.click(); } finally { c.own--; }
    c.later(340, () => hand && hand.classList.remove('down'));
  }
  // a person drawing a stroke, a few points at a time, their cursor at its tip
  async function draws(c, k, pts){
    const it = { id:nid('d'), k:'stroke', x:0, y:0, pts:[pts[0]], c:'fg', w:2.5, by:k }; S.items.push(it); sync();
    moveCur(k, pts[0][0], pts[0][1], 0);
    for (let i = 1; i < pts.length; i += 2){ it.pts.push(...pts.slice(i, i + 2)); paint(nodes.get(it.id), it); const l = it.pts[it.pts.length - 1]; moveCur(k, l[0], l[1], 0); await c.step(30); }
    sync();
  }
  function startDemo(){
    const c = demo = ctl();
    c.taken(() => { away(); });
    // the others drift a little while they read
    c.every(2400, () => { if (c.mine) return; const k = Math.random() < .5 ? 'SL' : 'JO'; if (k === 'JO' && busyJO) return; const cu = CUR[k]; moveCur(k, cu.x + (Math.random() - .5) * 60, cu.y + (Math.random() - .5) * 40, 900); });
    let busyJO = false;
    c.run(async () => {
      for (;;){
        await c.step(embedded ? 900 : 1400); while (document.hidden) await c.step(300);
        // Jon adds a note and writes on it
        busyJO = true; moveCur('JO', -200, 200, 700); await c.step(800);
        const n14 = note('n14', '', 'Mobile', 'k', -272, 154, 'JO'); S.items.push(n14); sync(); arrive('n14'); await c.step(300);
        for (const ch of 'Pinch zoom jumps around'){ n14.t += ch; paint(nodes.get('n14'), n14); await c.step(45); }
        moveCur('JO', -150, 236, 500); busyJO = false; await c.step(600);
        // Ari goes to the empty space on the right; you follow Ari
        moveCur('AR', 360, -260, 700); await c.step(500);
        await tap(c, people.querySelector('[data-who="AR"]')); await c.step(700); away();
        const sk = SKETCH();
        await draws(c, 'AR', sk[0]); await c.step(350);
        await draws(c, 'AR', sk[1]); await c.step(350);
        await draws(c, 'AR', sk[2]); moveCur('AR', 620, -190, 500); await c.step(900);
        // back to the whole board
        await tap(c, $('.wbx-unf', folEl)); await c.step(300);
        home(true); await c.step(900);
        // ask the agent to group the notes
        await tap(c, askB); await c.step(700);
        await tap(c, $$('.cpl-i', list)[0]); await c.step(300); away();
        while (RUN) await c.step(200);
        moveCur('JO', 430, 220, 900);
        await c.step(900); home(true); await c.step(700);
        // Sam comments on the Mobile frame
        const fm = S.items.find(i => i.k === 'frame' && i.t === 'Mobile');
        if (fm){
          moveCur('SL', fm.x + fm.w - 40, fm.y + 22, 800); await c.step(1000);
          const th = { id:nid('c'), on:fm.id, dx:fm.w - 40, dy:20, msgs:[{ who:'SL', t:'Can editing on a phone go in the next sprint?', at:'now' }] };
          S.threads.push(th); paintPins(); paintCount(); say('Sam Lee commented on “Mobile”');
          await c.step(600); openThread(th, true); await c.step(3200); closeThread();
        }
        await c.step(2600);
        // and again, from the start
        hideRun(true); unfollow(true); closeCmd(false); closeThread();
        const fade = REDUCE ? null : world.animate([{ opacity:1 }, { opacity:0 }], { duration:240, fill:'forwards' }); await c.step(260);
        restart(); if (fade){ fade.cancel(); world.animate([{ opacity:0 }, { opacity:1 }], { duration:300, easing:'cubic-bezier(.23,1,.32,1)' }); }
      }
    }).finally(() => away());
  }
  function restart(){
    boardAt(true); H.undo = []; H.redo = []; paintUndo(); V.user = false;
    Object.assign(CUR.AR, { x:560, y:-340 }); Object.assign(CUR.JO, { x:-300, y:240 }); Object.assign(CUR.SL, { x:150, y:-30 }); CUR.AG.on = false;
    PV.AR = { x:290, y:-340, w:520, h:340 }; home(false); paintCurs();
  }
  function replay(){
    if (demo) demo.stop(); demo = null; away();
    if (RUN){ RUN.rc.stop(); RUN = null; } hideRun(true); unfollow(true); closeCmd(false); closeThread(); closeCtx(); endEdit(); setTool('select', true);
    restart(); if (!/[?&]demo=0\b/.test(location.search)) startDemo();
  }
  $('.wb-replay') && $('.wb-replay').addEventListener('click', replay);
  if (DEMO) startDemo();
  applyView(); paintUndo();
})();
