// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, html, swap } from '../core/core.js';
DM.def('automation-canvas', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{play}', I('play','xs')).replace('{search}', I('search','xs')).replace(/\{(minus|plus|fit)\}/g, (m, n) => I(n));
  // sub: the connectors under a step, for the model it thinks with and the tools it may use
  const N = [
    { id:'t', ic:'clock', col:'var(--dm-py)', t:'Schedule', d:'Mondays 9:00', y:.4, f:['When', ['Mondays 9:00','Every weekday','On new Figma version']] },
    { id:'a', ic:'figma', col:'var(--dm-pl)', t:'Read frames', d:'Pricing, Checkout', y:.22, f:['Frames', ['Pricing, Checkout','All frames','Changed this week']] },
    { id:'b', ic:'spark', col:'var(--dm-accent-mark,var(--dm-accent))', fg:'var(--dm-accent-fg,var(--dm-accent))', t:'Agent: audit', d:'Contrast, tokens', y:.58, f:['Checks', ['Contrast, tokens','Everything','Accessibility only']], sub:['model', 'tools'] },
    { id:'c', ic:'send', col:'var(--dm-pm)', t:'Post summary', d:'#design in Slack', y:.4, f:['Channel', ['#design in Slack','Email the team','Linear ticket']] }
  ];
  // a wire: from, to, and for a model or a tool, which connector it hangs from
  const E = [['t','a'],['t','b'],['a','c'],['b','c']];
  // the steps the picker offers: a + after a step offers tools, logic and actions; a connector offers its own group
  const CAT = [
    { id:'tools', label:'Tools', col:'var(--dm-pt)', items:[
      { ic:'globe', t:'Search the web', desc:'Looks things up and keeps the top results', f:['Sources', ['Top results','News only','Our docs site']] },
      { ic:'file-text', t:'Read a doc', desc:'Pulls the text out of a doc or a PDF', f:['Doc', ['Brand guidelines','Release notes','Any shared doc']] },
      { ic:'eye', t:'Check contrast', desc:'Measures each text colour against its fill', f:['Level', ['WCAG AA','WCAG AAA','APCA']] } ] },
    { id:'logic', label:'Logic', col:'var(--dm-py)', items:[
      { ic:'branch', t:'If / else', desc:'Sends the run one way or the other', f:['When', ['Any check fails','Over 5 issues','Always']] },
      { ic:'clock', t:'Wait', desc:'Pauses the run for a while', f:['For', ['1 hour','Until 9:00','1 day']] },
      { ic:'user', t:'Ask a person', desc:'Holds the run until someone approves', f:['Who', ['Design lead','Anyone on #design','The run owner']] } ] },
    { id:'actions', label:'Actions', col:'var(--dm-pm)', items:[
      { ic:'flag', t:'Create ticket', desc:'Files an issue with what the agent found', f:['Tracker', ['Design QA board','Linear, Web team','GitHub issues']] },
      { ic:'mail', t:'Send email', desc:'Emails a short summary to a list', f:['To', ['Design team','Product leads','Just me']] },
      { ic:'edit', t:'Update doc', desc:'Writes the results into a shared doc', f:['Doc', ['QA log','Weekly notes','Release checklist']] } ] },
    { id:'models', label:'Models', col:'var(--dm-pl)', items:[
      { ic:'bolt', t:'Fast model', desc:'Quick and cheap, for simple checks', f:['Model', ['Fast','Fast, low cost']] },
      { ic:'brain', t:'Reasoning model', desc:'Slower, thinks harder audits through', f:['Model', ['Reasoning','Reasoning, long context']] },
      { ic:'image', t:'Vision model', desc:'Reads screenshots and frames', f:['Model', ['Vision','Vision, high detail']] } ] }
  ];
  const OFFER = { out:['tools', 'logic', 'actions'], model:['models'], tools:['tools'] }, KIND = { model:'Model', tools:'Tools' };
  // the canvas holds this many steps (fewer when it stacks on a phone); after that the + handles go
  const MAX = () => narrow() ? 6 : 9;
  const cv = $('.acx-cv', r), svg = $('.acx-svg', r), nodes = $('.acx-nodes', r), pop = $('.acx-pop', r), st = $('.acx-st', r), live = $('.acx-live', r);
  const pk = $('.acx-pk', r), qi = $('.acx-qi', r), ls = $('.acx-ls', r), pd = $('.acx-pd', r);
  const vp = $('.acx-vp', r), world = $('.acx-world', r), mq = $('.acx-mq', r), zm = $('.acx-zm', r), zl = $('.acx-zl', r), zo = $('.acx-zo', r), zi = $('.acx-zi', r), fitB = $('.acx-fit', r), sr = $('.acx-sr', r);
  const say = t => { live.textContent = t; };
  const narrow = () => cv.clientWidth < 560;
  // the name over the top of the canvas and Test run over its foot: the steps are laid out, fitted and placed in the band
  // between them (T from the top, B from the bottom), so neither covers a step at rest
  const tp = $('.acx-top', r), bar = $('.acx-bar', r);
  const safe = () => ({ T:tp.offsetTop + tp.offsetHeight - cv.offsetTop + 8, B:cv.clientHeight - bar.offsetTop + 8 });
  const band = y => { const H = cv.clientHeight, { T, B } = safe(); return (T + y * Math.max(0, H - T - B)) / H; };
  // wide: the trigger and the last step sit the same distance in from each side and the two middle steps halfway between,
  // so the wires on the left and right are the same length at any width. A step you dragged keeps where you put it
  const wide = (n, W, w) => { const pad = Math.max(20, W * .06); return { x:{ t:pad + w / 2, a:W / 2, b:W / 2, c:W - pad - w / 2 }[n.id] / W, y:band(n.y) }; };
  // narrow: the steps go down the left of the canvas, with the agent on its own on the right, so its model and tools have
  // room under it
  const NARROWAT = { t:['l', .07], a:['l', .2], b:['r', .33], c:['l', .64] };
  const pos = (n, W, w) => (narrow() ? n.um : n.uw) || (n.add ? null : narrow() ? { x:(NARROWAT[n.id][0] === 'l' ? 6 + w / 2 : W - 6 - w / 2) / W, y:band(NARROWAT[n.id][1]) } : wide(n, W, w));
  const nodeHTML = n => `<button class="acx-n${n.kind ? ' sm' : ''}" data-id="${n.id}"><span class="ic" style="color:${n.fg || n.col};background:color-mix(in srgb,${n.col} 14%,transparent)">${I(n.ic,'xs')}</span><span class="t"><b>${n.t}</b><span class="d">${n.d}</span></span></button>`;
  nodes.innerHTML = N.map(nodeHTML).join('');
  const el = id => $(`.acx-n[data-id="${id}"]`, nodes);
  const byId = id => N.find(n => n.id === id);
  const box = b => ({ l:b.offsetLeft, t:b.offsetTop, r:b.offsetLeft + b.offsetWidth, b:b.offsetTop + b.offsetHeight, w:b.offsetWidth, h:b.offsetHeight });

  /* ---------- the view, as in Canvas toolbar: zoom z and pan (px, py), so a point x on the board shows at x * z + px. The
     steps are laid out on the board as before (at rest the view shows it whole, at 100%); the popover and the picker are
     placed where their step shows ---------- */
  const Z = [.5, .67, .75, .9, 1, 1.25, 1.5, 2], ZMIN = Z[0], ZMAX = Z[Z.length - 1];
  let z = 1, px = 0, py = 0, lastT = '';
  const lim = v => Math.max(ZMIN, Math.min(ZMAX, v)), pct = () => Math.round(z * 100) + '%';
  const scr = B => ({ l:B.l * z + px, t:B.t * z + py, r:B.r * z + px, b:B.b * z + py, w:B.w * z, h:B.h * z });
  function apply(anim){
    const W = cv.clientWidth, H = cv.clientHeight;
    // the board never goes more than half the canvas off, so the middle of the canvas always shows some of it
    px = Math.round(Math.max(W / 2 - W * z, Math.min(W / 2, px)) * 100) / 100; py = Math.round(Math.max(H / 2 - H * z, Math.min(H / 2, py)) * 100) / 100;
    const t = `translate(${px}px,${py}px) scale(${z})`;
    if (t !== lastT){
      // what the popover and the picker point at has moved
      if (lastT){ close(); closePk(); }
      lastT = t; cv.classList.toggle('anim', !!anim && !REDUCE); world.style.transform = t;
    }
    // the dots move and scale with the board
    const g = 16 * z; cv.style.backgroundSize = `${g}px ${g}px`; cv.style.backgroundPosition = `${(W - 16) / 2 * z + px}px ${(H - 16) / 2 * z + py}px`;
    zl.textContent = pct(); zl.setAttribute('aria-label', `Zoom ${pct()}, reset to 100%`);
    zo.setAttribute('aria-disabled', z <= ZMIN + 1e-3); zi.setAttribute('aria-disabled', z >= ZMAX - 1e-3);
  }
  function zoomAt(nz, x, y, anim){ nz = lim(nz); const wx = (x - px) / z, wy = (y - py) / z; z = nz; px = x - wx * z; py = y - wy * z; apply(anim); }
  const zstep = d => { const s2 = d > 0 ? Z.find(x => x > z + 1e-3) : [...Z].reverse().find(x => x < z - 1e-3); return s2 === undefined ? z : s2; };
  function zoomBy(d){ const nz = zstep(d); if (nz === z) return; zoomAt(nz, cv.clientWidth / 2, cv.clientHeight / 2, true); say('Zoom ' + pct()); }
  function zoomReset(){ zoomAt(1, cv.clientWidth / 2, cv.clientHeight / 2, true); say('Zoom 100%'); }
  // fit: every step and its + in view, centred in the band between the name and Test run, never past 100%
  function fit(){
    const W = cv.clientWidth, { T, B } = safe(), H = cv.clientHeight - T - B, P = 24, bs = $$('.acx-n, .acx-h, .acx-sc', nodes).filter(b => b.dataset.on !== '0').map(box);
    if (!bs.length) return;
    const x0 = Math.min(...bs.map(b => b.l)), y0 = Math.min(...bs.map(b => b.t)), x1 = Math.max(...bs.map(b => b.r)), y1 = Math.max(...bs.map(b => b.b));
    z = lim(Math.min((W - 2 * P) / (x1 - x0), (H - 2 * P) / (y1 - y0), 1));
    px = (W - (x1 - x0) * z) / 2 - x0 * z; py = T + (H - (y1 - y0) * z) / 2 - y0 * z;
    apply(true); say('Fit to screen, ' + pct());
  }

  /* ---------- the + handles and the connectors ---------- */
  // a step's output is open when no step follows it; models and tools have no output of their own
  const open = n => !n.kind && !E.some(e => e[0] === n.id && !e[2]);
  const knobs = {};
  function syncKnobs(){
    const full = N.length >= MAX();
    N.forEach(n => {
      const want = [...(open(n) && !full ? ['out'] : []), ...(full ? [] : n.sub || [])];
      Object.keys(knobs).filter(k => k.startsWith(n.id + ':') && !want.includes(k.split(':')[1])).forEach(k => { knobs[k].remove(); delete knobs[k]; });
      want.forEach(kind => {
        const k = n.id + ':' + kind; if (knobs[k]) return;
        const b = kind === 'out'
          ? html(`<button class="acx-h" aria-haspopup="dialog" aria-expanded="false" aria-label="Add a step after ${n.t}" data-tip="Add a step">${I('plus','xs')}</button>`)
          : html(`<button class="acx-sc" aria-haspopup="dialog" aria-expanded="false" aria-label="Add ${kind === 'model' ? 'a model' : 'a tool'} to ${n.t}">${I('plus','xs')}<span>${KIND[kind]}</span></button>`);
        b.dataset.for = n.id; b.dataset.k = kind; nodes.appendChild(b); knobs[k] = b;
        b.onclick = e => { e.stopPropagation(); pk.classList.contains('open') && pkFor === b ? closePk(true) : openPk(b, e.isTrusted); };
      });
    });
  }
  // where a step's output leaves it: its right side, or its foot when the canvas stacks. There the agent's wire to a step
  // on its left leaves from its left side, so it keeps clear of the model and tools under it
  // On a wide canvas a step with no room for another to its right (the last one, near the edge) takes its + under it, and
  // the steps added there stack downwards
  const roomR = B => B.r + 56 + (cv.clientWidth < 700 ? 150 : 176) + 40 <= cv.clientWidth;
  const outAt = (B, n, T) => !narrow() ? ((T ? T.l >= B.r + 8 : roomR(B)) ? { x:B.r, y:B.t + B.h / 2, d:'r' } : { x:B.l + B.w / 2, y:B.b, d:'d' })
    : n && n.sub && T && T.l + T.w / 2 < B.l ? { x:B.l, y:B.t + B.h / 2, d:'l' } : { x:B.l + B.w / 2, y:B.b, d:'d' };
  // the connectors sit under the step, either side of the middle so a wire leaving its foot passes between them
  function subAt(n, kind){
    const B = box(el(n.id)), cx = B.l + B.w / 2, g = narrow() ? 24 : 8, kinds = n.sub || [];
    const wOf = k => (knobs[n.id + ':' + k] || {}).offsetWidth || 64;
    const one = kinds.length < 2, l = one ? cx - wOf(kind) / 2 : kind === kinds[0] ? cx - g / 2 - wOf(kind) : cx + g / 2;
    return { l, t:B.b + 10, w:wOf(kind), h:24 };
  }
  function placeKnobs(){
    Object.entries(knobs).forEach(([k, b]) => {
      const [id, kind] = k.split(':'), n = byId(id), B = box(el(id));
      if (kind === 'out'){ const o = outAt(B); b.style.left = (o.d === 'r' ? o.x + 10 : o.x - 10) + 'px'; b.style.top = (o.d === 'r' ? o.y - 10 : o.y + 10) + 'px'; }
      else { const s = subAt(n, kind); b.style.left = s.l + 'px'; b.style.top = s.t + 'px'; }
    });
  }

  /* ---------- wires: from a step's output, or a connector's foot, into the side of the next step that faces it ---------- */
  function link(a, B){
    let p, e;
    if (a.d === 'l'){ if (B.t >= a.y + 8){ p = [B.l + B.w / 2, B.t]; e = 't'; } else if (B.r <= a.x - 8){ p = [B.r, B.t + B.h / 2]; e = 'r'; } else { p = [B.l + B.w / 2, B.b]; e = 'b'; } }
    else if (a.d === 'r'){ if (B.l >= a.x + 8){ p = [B.l, B.t + B.h / 2]; e = 'l'; } else if (B.t >= a.y){ p = [B.l + B.w / 2, B.t]; e = 't'; } else { p = [B.l + B.w / 2, B.b]; e = 'b'; } }
    else { if (B.t >= a.y + 8){ p = [B.l + B.w / 2, B.t]; e = 't'; } else if (B.l >= a.x){ p = [B.l, B.t + B.h / 2]; e = 'l'; } else { p = [B.r, B.t + B.h / 2]; e = 'r'; } }
    const dx = p[0] - a.x, dy = p[1] - a.y, k0 = Math.max(24, Math.abs(a.d === 'd' ? dy : dx) / 2), k1 = Math.max(24, Math.abs('lr'.includes(e) ? dx : dy) / 2);
    const c1 = a.d === 'r' ? [a.x + k0, a.y] : a.d === 'l' ? [a.x - k0, a.y] : [a.x, a.y + k0], c2 = { l:[p[0] - k1, p[1]], r:[p[0] + k1, p[1]], t:[p[0], p[1] - k1], b:[p[0], p[1] + k1] }[e];
    return [[a.x, a.y], c1, c2, p];
  }
  const bez = (q, t) => { const u = 1 - t; return [0, 1].map(i => u * u * u * q[0][i] + 3 * u * u * t * q[1][i] + 3 * u * t * t * q[2][i] + t * t * t * q[3][i]); };
  const dOf = q => `M${q[0].join(' ')} C${q[1].join(' ')} ${q[2].join(' ')} ${q[3].join(' ')}`;
  const anchorOf = ([a, b, kind]) => { if (kind){ const s = subAt(byId(a), kind); return { x:s.l + s.w / 2, y:s.t + s.h, d:'d' }; } return outAt(box(el(a)), byId(a), box(el(b))); };
  const placed = n => !!el(n.id) && el(n.id).dataset.on !== '0';
  // the wires are made once and only reshaped after that, so a resize or a drag never restarts their draw or their light
  const wireEl = {}, key = (a, b) => a + '>' + b, geo = {};
  function wires(){
    E.forEach(e => {
      const [a, b, kind] = e; if (!placed(byId(a)) || !placed(byId(b))) return;
      const q = geo[key(a, b)] = link(anchorOf(e), box(el(b)));
      let p = wireEl[key(a, b)]; if (!p){ p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.dataset.e = key(a, b); if (kind) p.classList.add('sub'); svg.appendChild(p); wireEl[key(a, b)] = p; }
      p.setAttribute('d', dOf(q));
      if (svg.classList.contains('intro') && !p.style.getPropertyValue('--dm-l')) p.style.setProperty('--dm-l', Math.ceil(p.getTotalLength()));
    });
    // the short stubs from a step to its + and its connectors
    const want = new Set();
    Object.entries(knobs).forEach(([k, b]) => {
      const [id, kind] = k.split(':'), B = box(el(id)); let d;
      if (kind === 'out'){ const o = outAt(B); d = o.d === 'r' ? `M${o.x} ${o.y}H${o.x + 10}` : `M${o.x} ${o.y}V${o.y + 10}`; }
      else { const s = subAt(byId(id), kind), x = s.l + s.w / 2; d = `M${x} ${B.b}V${s.t}`; }
      want.add(k); let p = wireEl['s:' + k]; if (!p){ p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('class', 'stub'); svg.appendChild(p); wireEl['s:' + k] = p; }
      p.setAttribute('d', d);
    });
    Object.keys(wireEl).filter(k => k.startsWith('s:') && !want.has(k.slice(2))).forEach(k => { wireEl[k].remove(); delete wireEl[k]; });
    placeKnobs();
  }

  /* ---------- where a new step goes: as near as it can to just after what it hangs from (to the right of a step, under a
     connector, or under a step when the canvas stacks), clear of every step, + and connector with room to spare, keeping off
     the wires already drawn, with its own wire crossing no step, and with room for its own + inside the canvas ---------- */
  function spot(n){
    const W = cv.clientWidth, H = cv.clientHeight, me = el(n.id), w = me.offsetWidth, h = me.offsetHeight, M = 8;
    const e = E.find(x => x[1] === n.id), src = e[0], a = e[2] ? anchorOf(e) : outAt(box(el(src)), byId(src));
    const others = N.filter(x => x !== n && placed(x)).map(x => box(el(x.id)));
    const ks = Object.entries(knobs).filter(([k]) => { const id = k.split(':')[0]; return k !== src + ':out' && id !== n.id && placed(byId(id)); }).map(([, b]) => box(b));
    // and clear of the zoom control in the corner, where it sits on the board in the current view
    const Z0 = { l:(zm.offsetLeft - px) / z, t:(zm.offsetTop - py) / z, w:zm.offsetWidth / z, h:zm.offsetHeight / z }; Z0.r = Z0.l + Z0.w; Z0.b = Z0.t + Z0.h;
    // and clear of the name over the top and Test run over the foot, wherever they sit on the board in the current view
    const { T:sT, B:sB } = safe(), onBoard = (l, t, r2, b2) => ({ l:(l - px) / z, t:(t - py) / z, r:(r2 - px) / z, b:(b2 - py) / z });
    const obst = [...others, ...ks, Z0, onBoard(0, 0, tp.offsetLeft + tp.offsetWidth + 8, sT), onBoard(0, cv.clientHeight - sB, bar.offsetLeft + bar.offsetWidth + 8, cv.clientHeight)];
    const samples = Object.entries(geo).filter(([k]) => !k.split('>').includes(n.id)).flatMap(([, q]) => Array.from({ length:15 }, (_, i) => bez(q, (i + 1) / 16)));
    const want = a.d === 'r' ? [a.x + 56 + w / 2, a.y] : [a.x, a.y + 40 + h / 2];
    const inside = (p, b, m) => p[0] > b.l - m && p[0] < b.r + m && p[1] > b.t - m && p[1] < b.b + m;
    const ov = (A, B, m) => Math.max(0, Math.min(A.r, B.r + m) - Math.max(A.l, B.l - m)) * Math.max(0, Math.min(A.b, B.b + m) - Math.max(A.t, B.t - m));
    let best = null, bs = Infinity, soft = null, ss = Infinity;
    // room to spare first; on a crowded canvas, just clear of the rest
    for (const G of [14, 4]){ if (best) break;
    for (let y = M; y + h <= H - M; y += 8) for (let x = M; x + w <= W - M; x += 8){
      const B = { l:x, t:y, r:x + w, b:y + h, w, h };
      if (!n.kind && (narrow() ? B.b + 34 > H - 4 : B.r + 34 > W - 4)) continue;
      let sc = Math.hypot(x + w / 2 - want[0], y + h / 2 - want[1]);
      if (a.d === 'r' ? B.l < a.x + 24 : B.t < a.y + 24) sc += 250;
      sc += samples.filter(p => inside(p, B, 6)).length * 60;
      const q = link(a, B); for (let i = 1; i < 12; i++){ const p = bez(q, i / 12); if (others.some(o => inside(p, o, 4))) sc += 30; }
      const hit = obst.reduce((s2, o) => s2 + ov(B, o, G), 0);
      if (!hit){ if (sc < bs){ bs = sc; best = B; } }
      else if (hit * 10 + sc < ss){ ss = hit * 10 + sc; soft = B; }
    } }
    const B = best || soft || { l:M, t:M, w, h };
    return { x:(B.l + w / 2) / W, y:(B.t + h / 2) / H };
  }
  function layout(){
    const W = cv.clientWidth, H = cv.clientHeight, small = narrow() || W < 700;
    // a model or a tool is a smaller step, so on a stacked canvas it fits beside the steps in the left-hand column
    $$('.acx-n', nodes).forEach(b => b.style.width = b.classList.contains('sm') ? (narrow() ? '124px' : small ? '150px' : '') : small ? '150px' : '');
    syncKnobs(); Object.keys(geo).forEach(k => delete geo[k]);
    const put = (n, p) => { const b = el(n.id); b.style.left = (p.x * W - b.offsetWidth / 2) + 'px'; b.style.top = (p.y * H - b.offsetHeight / 2) + 'px'; b.dataset.on = '1'; };
    // the steps with a place first, then each added one that has none in this layout yet, in the order they were added
    N.forEach(n => { const p = pos(n, W, el(n.id).offsetWidth); if (p) put(n, p); else el(n.id).dataset.on = '0'; });
    N.filter(n => el(n.id).dataset.on === '0').forEach(n => { wires(); const p = spot(n); if (narrow()) n.um = p; else n.uw = p; put(n, p); });
    wires();
  }
  let selN = null;
  // a step's settings open as a small dialog beside it. Opened with the keyboard, the focus goes into it; Escape or Done
  // closes it and gives the focus back to the step. Its field is a menu button: the arrows move through the choices and wrap,
  // Home and End jump, Enter or Space picks, and Escape closes the list back to the field
  const uid = Math.random().toString(36).slice(2, 7);
  function config(n, key){
    closePk();
    const b = el(n.id); selN = n;
    pop.innerHTML = `<h4 id="acx-h-${n.id}-${uid}">${n.t}</h4><div class="acx-fl"><span id="acx-f-${n.id}-${uid}">${n.f[0]}</span><button class="acx-dd" aria-haspopup="menu" aria-expanded="false" aria-labelledby="acx-f-${n.id}-${uid} acx-v-${n.id}-${uid}"><span id="acx-v-${n.id}-${uid}">${n.d}</span>${I('chev-d','xs')}</button><div class="acx-opts" role="menu" aria-labelledby="acx-f-${n.id}-${uid}">${n.f[1].map(o => `<button class="mi" role="menuitemradio" tabindex="-1" aria-checked="${o === n.d}"><span>${o}</span><span class="ck">${I('check','xs')}</span></button>`).join('')}</div></div><button class="pill soft sm acx-done">Done</button>`;
    pop.setAttribute('aria-labelledby', `acx-h-${n.id}-${uid}`);
    // beside the step, or under or over it: whichever spot covers the least of the other steps (and none of this one),
    // nearest the step when spots tie, so the popover never hides the step a run flows on to. The canvas fills the
    // component, so it stays inside it
    const W = cv.clientWidth, H = cv.clientHeight, pw = pop.offsetWidth || 240, ph = pop.offsetHeight || 150, G = 10, M = 6, OVER = 0;
    const me = scr(box(b)), others = $$('.acx-n', nodes).filter(x => x !== b).map(x => scr(box(x)));
    const cx = (me.l + me.r) / 2, cy = (me.t + me.b) / 2, cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
    const over = (x, y, o) => Math.max(0, Math.min(x + pw, o.r) - Math.max(x, o.l)) * Math.max(0, Math.min(y + ph, o.b) - Math.max(y, o.t));
    const ys = [me.t - 40, cy - ph / 2, me.t, me.b - ph, M, H - ph - M, H - ph + OVER], xs = [cx - pw / 2, me.l, me.r - pw, M, W - pw - M];
    const spots = [...ys.map(y => [me.r + G, y]), ...ys.map(y => [me.l - pw - G, y]), ...xs.map(x => [x, me.b + G]), ...xs.map(x => [x, me.t - ph - G])]
      .flatMap(([x, y]) => [[cl(x, M, W - pw - M), cl(y, M, H - ph - M)], [cl(x, M, W - pw - M), cl(y, M, H - ph + OVER)]]);
    let best = null, bs = Infinity;
    for (const [x, y] of spots){ const hang = Math.max(0, y + ph - (H - M)); const sc = others.reduce((a, o) => a + over(x, y, o), 0) + over(x, y, me) * 4 + hang * 20 + Math.hypot(x + pw / 2 - cx, y + ph / 2 - cy) / 100; if (sc < bs){ bs = sc; best = [x, y]; } }
    pop.style.left = best[0] + 'px'; pop.style.top = best[1] + 'px'; pop.style.position = 'absolute'; pop.classList.add('open'); pop.inert = false;
    const dd = $('.acx-dd', pop), ops = $('.acx-opts', pop), mis = $$('.mi', ops);
    const top0 = best[1];
    const fit = () => { pop.style.top = Math.max(M, Math.min(top0, H + OVER - pop.offsetHeight)) + 'px'; };
    const list = (on, focus) => { ops.classList.toggle('open', on); dd.setAttribute('aria-expanded', on); fit();
      if (on && focus){ const m = focus === 'last' ? mis[mis.length - 1] : mis.find(x => x.getAttribute('aria-checked') === 'true') || mis[0]; m.focus({ preventScroll:true }); }
      if (!on && ops.contains(document.activeElement)) dd.focus({ preventScroll:true }); };
    dd.onclick = e => { e.stopPropagation(); list(!ops.classList.contains('open'), e.isTrusted && !e.detail && 'first'); };
    dd.onkeydown = e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); list(true, e.key === 'ArrowUp' ? 'last' : 'first'); } };
    ops.onkeydown = e => { const i = mis.indexOf(document.activeElement), go = { ArrowDown:mis[(i + 1) % mis.length], ArrowUp:mis[(i - 1 + mis.length) % mis.length], Home:mis[0], End:mis[mis.length - 1] }[e.key];
      if (go){ e.preventDefault(); go.focus({ preventScroll:true }); } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); list(false); } else if (e.key === 'Tab') list(false); };
    mis.forEach(m => m.onclick = e => { e.stopPropagation(); n.d = $('span', m).textContent; swap($('.d', b), n.d); swap($('span', dd), n.d); mis.forEach(x => x.setAttribute('aria-checked', x === m)); list(false); if (n.id === 't') swap(st, n.d.replace('Mondays', 'Every Monday,')); });
    $('.acx-done', pop).onclick = () => close(true);
    if (key) dd.focus({ preventScroll:true });
  }
  function close(back){ const b = selN && el(selN.id), was = pop.contains(document.activeElement); pop.classList.remove('open'); pop.inert = true; selN = null; if (b && (back || was)) b.focus({ preventScroll:true }); }
  pop.inert = true;
  c.on(pop, 'keydown', e => { if (e.key === 'Escape' && selN){ e.preventDefault(); close(true); } });
  /* ---------- selection: a click selects a step (and opens its setting), Shift and a click adds it to the selection or takes
     it out, and a click on the empty canvas or Escape clears it. Dragging a selected step moves every selected step ---------- */
  let sel = new Set();
  function select(ids){ sel = new Set(ids); N.forEach(n => { const b = el(n.id); if (b) b.classList.toggle('sel', sel.has(n.id)); }); }
  const picked = () => say(sel.size ? `${sel.size} of ${N.length} steps selected` : 'Nothing selected');
  let justDragged = false;
  function bind(n){
    const b = el(n.id);
    b.onclick = e => { e.stopPropagation(); if (justDragged){ justDragged = false; return; }
      if (e.shiftKey){ const s2 = new Set(sel); s2.has(n.id) ? s2.delete(n.id) : s2.add(n.id); select(s2); close(); closePk(); picked(); return; }
      select([n.id]); selN === n ? close() : config(n, e.isTrusted && !e.detail); };
    b.onkeydown = e => { if (e.key === 'Escape' && selN === n){ e.preventDefault(); close(); } };
    b.onpointerdown = e => {
      // a finger on a step of a canvas not yet engaged may be scrolling the page: it only taps
      if (e.button || (e.pointerType === 'touch' && !engaged)) return; const sx = e.clientX, sy = e.clientY; let moved = false, group = [];
      const mv = ev => { const dx = (ev.clientX - sx) / z, dy = (ev.clientY - sy) / z;
        if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) < 4) return;
        if (!moved){ moved = true; if (!sel.has(n.id)) select([n.id]);
          group = N.filter(x => sel.has(x.id) && el(x.id)).map(x => { const e2 = el(x.id); return [x, e2, e2.offsetLeft, e2.offsetTop]; });
          group.forEach(g => g[1].classList.add('drag')); nodes.classList.add('drag'); close(); closePk(); b.setPointerCapture?.(e.pointerId); }
        const W = cv.clientWidth, H = cv.clientHeight;
        group.forEach(([, e2, ox, oy]) => { e2.style.left = Math.max(4, Math.min(W - e2.offsetWidth - 4, ox + dx)) + 'px'; e2.style.top = Math.max(4, Math.min(H - e2.offsetHeight - 4, oy + dy)) + 'px'; });
        wires(); };
      const up = () => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up);
        if (!moved) return; nodes.classList.remove('drag'); justDragged = true; setTimeout(() => justDragged = false, 50);
        group.forEach(([x, e2]) => { e2.classList.remove('drag'); const f = { x:(e2.offsetLeft + e2.offsetWidth / 2) / cv.clientWidth, y:(e2.offsetTop + e2.offsetHeight / 2) / cv.clientHeight }; if (narrow()) x.um = f; else x.uw = f; }); };
      document.addEventListener('pointermove', mv); document.addEventListener('pointerup', up);
      c.offs.push(() => { document.removeEventListener('pointermove', mv); document.removeEventListener('pointerup', up); });
    };
  }
  N.forEach(bind);
  c.on(cv, 'click', e => { if (!pop.contains(e.target) && !pk.contains(e.target)){ close(); closePk(); } });
  pop.onclick = e => e.stopPropagation();

  /* ---------- the step picker: a search (a combobox) over a listbox of step types in groups. The arrows move through it and
     wrap while the focus stays in the search, Enter adds the step, Escape closes it and gives the focus back to the + ---------- */
  let pkFor = null, act = -1, opts = [];
  ls.id = 'acx-ls-' + uid; qi.setAttribute('aria-controls', ls.id); pk.inert = true;
  const esc = t => t.replace(/[&<>"]/g, ch => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' })[ch]);
  function paint(){
    const q = qi.value.trim().toLowerCase(), kind = pkFor.dataset.k;
    const groups = CAT.filter(g => OFFER[kind].includes(g.id)).map(g => ({ g, items:g.items.filter(it => !q || it.t.toLowerCase().includes(q) || it.desc.toLowerCase().includes(q)) })).filter(x => x.items.length);
    const mark = t => { const i = q ? t.toLowerCase().indexOf(q) : -1; return i < 0 ? esc(t) : esc(t.slice(0, i)) + '<mark>' + esc(t.slice(i, i + q.length)) + '</mark>' + esc(t.slice(i + q.length)); };
    let k = 0;
    ls.innerHTML = groups.length ? groups.map(({ g, items }) => `<div role="group" aria-labelledby="acx-g-${g.id}-${uid}"><div class="acx-gh" id="acx-g-${g.id}-${uid}">${g.label}</div>${items.map(it => { const i = k++; return `<div class="acx-o" role="option" aria-selected="false" id="acx-o-${uid}-${i}" aria-describedby="acx-od-${uid}-${i}" data-g="${g.id}" data-t="${esc(it.t)}"><span class="ic" style="color:${g.col};background:color-mix(in srgb,${g.col} 14%,transparent)">${I(it.ic,'xs')}</span><span>${mark(it.t)}</span><span id="acx-od-${uid}-${i}" hidden>${esc(it.desc)}</span></div>`; }).join('')}</div>`).join('')
      : `<p class="acx-pe">No steps match “${esc(qi.value.trim())}”</p>`;
    opts = $$('.acx-o', ls);
    opts.forEach((o, i) => { o.onpointermove = () => { if (act !== i) hl(i, false); }; o.onclick = e => { e.stopPropagation(); add(o, e.isTrusted); }; });
    hl(opts.length ? 0 : -1, true);
  }
  const itemOf = o => CAT.find(g => g.id === o.dataset.g).items.find(it => it.t === o.dataset.t);
  function hl(i, scroll){
    act = i; opts.forEach((o, j) => { o.classList.toggle('on', j === i); o.setAttribute('aria-selected', j === i); });
    const o = opts[i]; qi.setAttribute('aria-activedescendant', o ? o.id : '');
    pd.textContent = o ? itemOf(o).desc : 'Try another word';
    if (o && scroll){ const t = o.offsetTop - ls.offsetTop, b2 = t + o.offsetHeight; if (t < ls.scrollTop) ls.scrollTop = t - 24; else if (b2 > ls.scrollTop + ls.clientHeight) ls.scrollTop = b2 - ls.clientHeight; }
  }
  // beside the + : to its right, under it, or to the side of its step, whichever covers the least of the steps (and none
  // of the one it adds to), nearest the + when spots tie, always inside the canvas
  function openPk(b, focus){
    close(); if (pkFor && pkFor !== b) pkFor.setAttribute('aria-expanded', 'false');
    pkFor = b; b.setAttribute('aria-expanded', 'true'); qi.value = ''; ls.scrollTop = 0; paint();
    const src = byId(b.dataset.for), kind = b.dataset.k;
    pk.setAttribute('aria-label', kind === 'out' ? `Add a step after ${src.t}` : `Add ${kind === 'model' ? 'a model' : 'a tool'} to ${src.t}`);
    const W = cv.clientWidth, H = cv.clientHeight, pw = pk.offsetWidth, ph = pk.offsetHeight, K = scr(box(b)), S = scr(box(el(src.id))), M = 6, G = 8, OVER = -M;
    const cl = (v, lo, hi) => Math.max(lo, Math.min(hi, v)), kx = K.l + K.w / 2, ky = K.t + K.h / 2;
    const over = (x, y, o) => Math.max(0, Math.min(x + pw, o.r) - Math.max(x, o.l)) * Math.max(0, Math.min(y + ph, o.b) - Math.max(y, o.t));
    const others = N.filter(n => n !== src && placed(n)).map(n => scr(box(el(n.id))));
    const ys = [ky - 40, K.t, K.b - ph, M, H - ph - M, H - ph + OVER], xs = [kx - pw / 2, K.l, K.r - pw, S.l, S.r - pw, M, W - pw - M];
    const spots = [...ys.map(y => [K.r + G, y]), ...ys.map(y => [Math.min(K.l, S.l) - pw - G, y]), ...xs.map(x => [x, Math.max(K.b, kind === 'out' && !narrow() ? S.b : K.b) + G]), ...xs.map(x => [x, Math.min(K.t, S.t) - ph - G])]
      .map(([x, y]) => [cl(x, M, W - pw - M), cl(y, M, H - ph + OVER)]);
    let best = spots[0], bs = Infinity;
    for (const [x, y] of spots){ const sc = others.reduce((a, o) => a + over(x, y, o), 0) + (over(x, y, S) + over(x, y, K)) * 8 + Math.max(0, y + ph - (H - M)) * 20 + Math.hypot(x + pw / 2 - kx, y + ph / 2 - ky) / 100; if (sc < bs){ bs = sc; best = [x, y]; } }
    pk.style.left = best[0] + 'px'; pk.style.top = best[1] + 'px';
    pk.classList.add('open'); pk.inert = false;
    if (focus) qi.focus({ preventScroll:true });
  }
  function closePk(back){
    if (!pkFor) return; const b = pkFor, was = pk.contains(document.activeElement);
    pk.classList.remove('open'); pk.inert = true; b.setAttribute('aria-expanded', 'false'); pkFor = null;
    if (b.isConnected && (back || was)) b.focus({ preventScroll:true });
  }
  c.on(qi, 'input', paint);
  c.on(pk, 'keydown', e => {
    const k = e.key;
    if (k === 'ArrowDown' || k === 'ArrowUp'){ e.preventDefault(); if (opts.length) hl((act + (k === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length, true); }
    else if (k === 'Enter'){ e.preventDefault(); if (opts[act]) add(opts[act], true); }
    else if (k === 'Escape'){ e.preventDefault(); e.stopPropagation(); closePk(true); }
    else if (k === 'Tab') closePk();
  });
  pk.onclick = e => e.stopPropagation();
  c.on(document, 'pointerdown', e => { if (pkFor && !pk.contains(e.target) && e.target !== pkFor && !pkFor.contains(e.target)) closePk(); });
  // picking one adds the step, wired from the + or connector it was opened from, and the focus moves on to it
  let seq = 0;
  function add(o, focus){
    const b = pkFor; if (!b) return;
    const it = itemOf(o), g = CAT.find(x => x.id === o.dataset.g), src = byId(b.dataset.for), kind = b.dataset.k === 'out' ? null : b.dataset.k;
    const n = { id:'n' + ++seq, ic:it.ic, col:g.col, t:it.t, d:it.f[1][0], f:it.f, add:true, kind };
    closePk(); N.push(n); E.push(kind ? [src.id, n.id, kind] : [src.id, n.id]);
    const nb = html(nodeHTML(n)); nb.classList.add('add'); nodes.insertBefore(nb, $('.acx-h, .acx-sc', nodes)); bind(n);
    layout();
    const p = wireEl[key(src.id, n.id)];
    if (p && !REDUCE){ p.style.setProperty('--dm-l', Math.ceil(p.getTotalLength())); p.classList.add('new'); c.later(600, () => p.classList.remove('new')); }
    $$('.acx-h, .acx-sc', nodes).forEach(x => { if (!x.dataset.seen){ x.dataset.seen = 1; if (!x.isSameNode(b)) x.classList.add('in'); } });
    say(kind ? `${it.t} added to ${src.t}` : `${it.t} added after ${src.t}`);
    if (focus) nb.focus({ preventScroll:true });
  }

  /* ---------- moving around: drag the empty canvas (one finger on a touch screen) to pan, Shift and a drag to box-select,
     scroll or a trackpad to pan, Ctrl or ⌘ with the wheel or a pinch to zoom at the pointer; the corner buttons zoom and fit.
     A click on the empty canvas clears the selection ---------- */
  sr.id = 'acx-k-' + uid; cv.setAttribute('aria-describedby', sr.id);
  zo.onclick = () => zoomBy(-1); zi.onclick = () => zoomBy(1); zl.onclick = zoomReset; fitB.onclick = fit;
  const pt = e => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const touch = new Map(); let drag = null;
  const pinch = () => { const [a, b] = [...touch.values()]; return { d:Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, m:[(a[0] + b[0]) / 2, (a[1] + b[1]) / 2] }; };
  /* the canvas never traps the page: until the person has engaged with the component (a click in it, a tap in it, or the
     keyboard's focus coming into it) the wheel and touch belong to the page, so it scrolls past as usual. A finger that
     starts a scroll there is the page's; one that lifts without scrolling is a tap, which engages it. Once engaged
     (.engaged), one finger pans and two pinch, as the mouse does */
  let engaged = false, lastKey = -1e9;
  const engage = () => { if (engaged) return; engaged = true; cv.classList.add('engaged'); };
  c.on(document, 'keydown', e => { if (e.isTrusted) lastKey = e.timeStamp; }, true);
  c.on(r, 'pointerdown', e => { if (e.isTrusted && e.pointerType !== 'touch') engage(); }, true);
  c.on(r, 'pointerup', e => { if (e.isTrusted && e.pointerType === 'touch') engage(); }, true);
  c.on(r, 'focusin', e => { if (e.isTrusted && e.timeStamp - lastKey < 100) engage(); }, true);
  c.on(vp, 'pointerdown', e => {
    if (e.target.closest('.acx-n, .acx-h, .acx-sc') || (e.button !== 0 && e.button !== 1) || (e.pointerType === 'touch' && !engaged)) return;
    e.preventDefault();
    // a click on the canvas gives it the focus, so the keys work straight away
    if (e.isTrusted) cv.focus({ preventScroll:true });
    const p = pt(e);
    if (e.pointerType === 'touch'){
      touch.set(e.pointerId, p);
      if (touch.size === 2){ const q = pinch(); drag = { kind:'pinch', d0:q.d, m0:q.m, z0:z, px0:px, py0:py, moved:true }; }
      else if (touch.size === 1) drag = { kind:'pan', id:e.pointerId, p0:p, px0:px, py0:py, moved:false };
    } else drag = { kind:e.shiftKey && e.button === 0 ? 'box' : 'pan', id:e.pointerId, p0:p, px0:px, py0:py, base:new Set(sel), moved:false };
    if (drag && drag.kind === 'pan') cv.classList.add('pan');
    try { vp.setPointerCapture(e.pointerId); } catch(err){}
  });
  c.on(vp, 'pointermove', e => {
    if (!drag) return; const p = pt(e);
    if (touch.has(e.pointerId)) touch.set(e.pointerId, p);
    if (drag.kind === 'pinch'){
      if (touch.size < 2) return; const q = pinch(), nz = lim(drag.z0 * q.d / drag.d0), wx = (drag.m0[0] - drag.px0) / drag.z0, wy = (drag.m0[1] - drag.py0) / drag.z0;
      z = nz; px = q.m[0] - wx * z; py = q.m[1] - wy * z; apply(false); return;
    }
    if (e.pointerId !== drag.id) return;
    const dx = p[0] - drag.p0[0], dy = p[1] - drag.p0[1];
    if (!drag.moved && Math.hypot(dx, dy) < 3) return; drag.moved = true;
    if (drag.kind === 'pan'){ px = drag.px0 + dx; py = drag.py0 + dy; apply(false); return; }
    const x = Math.min(p[0], drag.p0[0]), y = Math.min(p[1], drag.p0[1]), w = Math.abs(dx), h = Math.abs(dy);
    mq.hidden = false; mq.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
    select([...drag.base, ...N.filter(n => placed(n) && (s2 => s2.r > x && s2.l < x + w && s2.b > y && s2.t < y + h)(scr(box(el(n.id))))).map(n => n.id)]);
  });
  const end = e => {
    touch.delete(e.pointerId);
    if (!drag) return;
    // lifting one finger of a pinch carries on as a pan with the other
    if (drag.kind === 'pinch'){ const [id, p] = [...touch.entries()][0] || []; drag = id === undefined ? null : { kind:'pan', id, p0:p, px0:px, py0:py, moved:true }; return; }
    if (e.pointerId !== drag.id) return;
    const k = drag.kind, m = drag.moved; drag = null; cv.classList.remove('pan'); mq.hidden = true;
    if (k === 'box') picked();
    else if (!m && e.type === 'pointerup' && sel.size){ select([]); picked(); }
  };
  c.on(vp, 'pointerup', end); c.on(vp, 'pointercancel', end);
  /* the wheel never traps the page: it pans the view only once the person has engaged with the component (see above), and
     until then the page scrolls past as usual. With Ctrl or ⌘ (a trackpad pinch sends that too) it zooms at the pointer
     at any time. Over the picker's list it scrolls the list */
  c.on(cv, 'wheel', e => {
    if (pk.contains(e.target) || pop.contains(e.target)) return;
    const zoomer = e.ctrlKey || e.metaKey; if (!zoomer && !engaged) return;
    e.preventDefault(); if (e.isTrusted) c.mine = true;
    if (zoomer) return zoomAt(z * Math.exp(-e.deltaY / 300), ...pt(e), false);
    const k = e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? cv.clientHeight : 1;
    let dx = e.deltaX * k, dy = e.deltaY * k; if (e.shiftKey && !dx){ dx = dy; dy = 0; }
    px -= dx; py -= dy; apply(false);
  }, { passive:false });
  // a pointer hides the canvas's focus ring until the next key (Ctrl, ⌘, Shift or Alt alone, as with the wheel, leave it hidden)
  c.on(cv, 'pointerdown', () => cv.classList.add('ptr'), true); c.on(document, 'keydown', e => { if (!/^(Control|Meta|Shift|Alt)$/.test(e.key)) cv.classList.remove('ptr'); }, true);
  /* the keyboard, while the canvas or a step has the focus: the arrow keys move the view (on the canvas itself), plus and
     minus zoom, 0 or 1 fits, Escape clears the selection; Tab goes through the steps and their + buttons, and a step that
     takes the focus off screen glides into view */
  c.on(cv, 'keydown', e => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || pop.contains(e.target) || pk.contains(e.target) || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    const k = e.key;
    if (k === '+' || k === '=') zoomBy(1);
    else if (k === '-' || k === '_') zoomBy(-1);
    else if (k === '0' || k === '1' || e.code === 'Digit0' || e.code === 'Digit1') fit();
    else if (e.target === cv && /^Arrow/.test(k)){ const d = e.shiftKey ? 120 : 40; px += k === 'ArrowLeft' ? d : k === 'ArrowRight' ? -d : 0; py += k === 'ArrowUp' ? d : k === 'ArrowDown' ? -d : 0; apply(true); }
    else if (k === 'Escape' && sel.size){ select([]); picked(); }
    else return;
    e.preventDefault();
  });
  c.on(nodes, 'focusin', e => {
    if (cv.classList.contains('ptr')) return;
    const t = e.target.closest('.acx-n, .acx-h, .acx-sc'); if (!t) return;
    const s2 = scr(box(t)), W = cv.clientWidth, H = cv.clientHeight, M = 16, { T, B } = safe();
    const dx = s2.l < M ? M - s2.l : s2.r > W - M ? W - M - s2.r : 0, dy = s2.t < T ? T - s2.t : s2.b > H - B ? H - B - s2.b : 0;
    if (dx || dy){ px += dx; py += dy; apply(true); }
  });
  // the board never scrolls inside the canvas: a focus that would scroll it pans the view instead (above)
  c.on(vp, 'scroll', () => { vp.scrollLeft = vp.scrollTop = 0; });

  // a step's badge pops in once (CSS), and after that its spinner turns into a check with a short crossfade
  const ease = getComputedStyle(r).getPropertyValue('--dm-ease').trim() || 'ease';
  const mark = (id, s) => { const b = el(id); b.classList.toggle('run', s === 'run'); const x = $('.s', b) || b.appendChild(html('<span class="s"></span>'));
    x.innerHTML = `<span class="acx-sv">${s === 'run' ? '<span class="spin" style="width:10px;height:10px"></span>' : `<span style="color:var(--dm-ok);display:grid">${I('check','xs')}</span>`}</span>`; };
  // a run passes along a wire as one soft light, then leaves the wire lit
  const flow = (a, b) => { const p = wireEl[key(a, b)]; if (!p) return; p.classList.add('done'); if (REDUCE) return;
    const L = p.getTotalLength(), len = Math.min(64, L * .4), q = p.cloneNode(); q.removeAttribute('data-e'); q.setAttribute('class', 'pulse'); q.style.cssText = `stroke-dasharray:${len} ${L + len}`; svg.appendChild(q);
    q.animate([{ strokeDashoffset:len, opacity:0 }, { opacity:1, offset:.18 }, { opacity:1, offset:.78 }, { strokeDashoffset:-L, opacity:0 }], { duration:720, easing:'cubic-bezier(.45,0,.25,1)' }).onfinish = () => q.remove(); };
  // a new test run cancels one still in progress and starts over, rather than running alongside it. The agent's model and
  // tools light up while it runs, and the steps added after the last one run in turn
  let runId = 0, running = false;
  const runB = $('.acx-run', r);
  runB.onclick = () => c.run(async () => {
    const id = ++runId, wait = async ms => { await c.wait(ms); if (id !== runId) throw 'stop'; };
    running = true;
    try {
      // the last run's badges and lit wires fade back before the new run starts
      close(); closePk(); $$('.acx-n .s', nodes).forEach(x => { if (REDUCE) return x.remove(); x.animate([{ opacity:1 }, { opacity:0, transform:'scale(.7)' }], { duration:200, easing:ease }).onfinish = () => x.remove(); });
      $$('.acx-n.run', nodes).forEach(x => x.classList.remove('run')); $$('path.done', svg).forEach(x => x.classList.remove('done')); swap(st, 'Running test');
      const subs = E.filter(e => e[0] === 'b' && e[2]).map(e => e[1]);
      await wait(220); mark('t', 'run'); await wait(600); mark('t', 'ok');
      flow('t','a'); flow('t','b'); await wait(620);
      mark('a', 'run'); mark('b', 'run'); subs.forEach(x => { flow('b', x); mark(x, 'run'); }); await wait(1100); mark('a', 'ok'); subs.forEach(x => mark(x, 'ok')); await wait(400); mark('b', 'ok');
      flow('a','c'); flow('b','c'); await wait(620);
      mark('c', 'run'); await wait(700); mark('c', 'ok');
      let at = 'c', s = 3.4, nx;
      while ((nx = E.find(e => e[0] === at && !e[2]))){ flow(at, nx[1]); await wait(620); mark(nx[1], 'run'); await wait(700); mark(nx[1], 'ok'); at = nx[1]; s += 1.3; }
      swap(st, `Test passed in ${s.toFixed(1)}s`);
    } finally { if (id === runId) running = false; }
  });
  svg.classList.add('intro'); c.later(1300, () => svg.classList.remove('intro'));
  // a canvas that switches between wide and stacked lays its steps out afresh, and the view goes back to showing it whole
  layout(); apply(false); let lw = 0, ln = narrow();
  const ro = new ResizeObserver(() => { if (lw && Math.abs(cv.clientWidth - lw) > 2){ close(); closePk(); } lw = cv.clientWidth; if (ln !== narrow()){ ln = narrow(); z = 1; px = py = 0; } layout(); apply(false); }); ro.observe(cv); c.offs.push(() => ro.disconnect());
  $$('.acx-n, .acx-h, .acx-sc', nodes).forEach((b, i) => { b.dataset.seen = 1; b.classList.add(b.matches('.acx-n') ? 'acx-in' : 'in'); b.style.animationDelay = Math.min(i, 4) * 90 + 'ms'; });
  // the preview's story: one test run, then the person adds a step after the last one from its +, zooms in a step and fits
  // the whole automation back in view
  c.story(async s => {
    await s.beat(3);
    await s.tap(runB); s.away();
    await s.until(() => !running); await s.beat(2);
    const h = knobs['c:out']; if (!h) return;
    await s.tap(h); await s.beat(1.5);
    const o = opts.find(x => x.dataset.t === 'Create ticket'); if (!o) return;
    await s.point(o, false); hl(opts.indexOf(o), true); await s.beat(1.5);
    await s.tap(o); s.away(); await s.beat(3);
    await s.tap(zi); await s.beat(2);
    await s.tap(fitB); s.away(); await s.beat(3);
  });
});
