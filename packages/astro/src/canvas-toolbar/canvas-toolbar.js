// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, html } from '../core/core.js';
DM.def('canvas-toolbar', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{(play|cursor|hand|lasso|comment|fit|minus|plus|more|zoom|trash)\}/g, (m, n) => I(n === 'zoom' ? 'search' : n, n === 'play' || n === 'trash' ? 'xs' : 's'));
  const root = $('.ctb', r), cv = $('.ctb-cv', r), world = $('.ctb-world', r), wires = $('.ctb-w', r), nodes = $('.ctb-nodes', r), bar = $('.ctb-bar', r), live = $('.ctb-live', r);
  const runB = $('.ctb-run', r), radios = $$('.ctb-tools [role="radio"]', r), cmB = $('.ctb-cm', r), fitB = $('.ctb-fit', r), zoB = $('.ctb-zo', r), ziB = $('.ctb-zi', r), zl = $('.ctb-z', r);
  const menu = $('.ctb-menu', r), more = $('.ctb-more', r), mq = $('.ctb-mq', r), lz = $('.ctb-lz path', r), sr = $('.ctb-sr', r);
  sr.id = 'ctb-k-' + Math.random().toString(36).slice(2, 7); cv.setAttribute('aria-describedby', sr.id);
  const say = t => { live.textContent = t; };
  // every change a person makes is also an event on the component, for your code to follow
  const emit = (type, detail) => root.dispatchEvent(new CustomEvent(type, { bubbles:true, detail }));
  // the workflow on the canvas, in pixels at 100%: a row on a wide canvas, a column on a narrow one, so a phone shows it
  // whole at a size that reads
  const N = [
    { id:'a', ic:'bolt', col:'var(--dm-py)', t:'New ticket', d:'Trigger · inbox', w:[0, 48], n:[0, 0] },
    { id:'b', ic:'spark', col:'var(--dm-accent-mark,var(--dm-accent))', fg:'var(--dm-accent-fg,var(--dm-accent))', t:'Classify', d:'Agent · intent', w:[208, 0], n:[0, 80] },
    { id:'c', ic:'search', col:'var(--dm-pb)', t:'Search docs', d:'Tool · help center', w:[416, 96], n:[0, 160] },
    { id:'d', ic:'edit', col:'var(--dm-pm)', t:'Draft reply', d:'Agent · for review', w:[624, 48], n:[0, 240] }
  ];
  const E = [['a', 'b'], ['b', 'c'], ['c', 'd']], ORDER = N.map(n => n.id);
  nodes.innerHTML = N.map(n => `<div class="ctb-n in" data-id="${n.id}"><span class="ic" style="color:${n.fg || n.col};background:color-mix(in srgb,${n.col} 14%,transparent)">${I(n.ic, 'xs')}</span><span class="t"><b>${n.t}</b><span>${n.d}</span></span></div>`).join('');
  $$('.ctb-n', nodes).forEach((x, i) => { x.style.animationDelay = i * 90 + 'ms'; });
  const el = id => $(`.ctb-n[data-id="${id}"]`, nodes);
  const box = n => { const e = el(n.id); return { x:n.x, y:n.y, w:e.offsetWidth, h:e.offsetHeight }; };
  // below 440px the steps sit in a column; a step someone dragged keeps where they put it, in each layout
  const NARROW = 440;
  let small = false;
  function layout(){
    small = cv.clientWidth < NARROW;
    N.forEach(n => { const p = (small ? n.um : n.uw) || (small ? n.n : n.w); n.x = p[0]; n.y = p[1]; const e = el(n.id); e.style.left = n.x + 'px'; e.style.top = n.y + 'px'; });
    drawWires();
  }
  const wireEl = {};
  function drawWires(){
    E.forEach(([a, b]) => {
      const A = box(N.find(n => n.id === a)), B = box(N.find(n => n.id === b)); let d;
      // side to side when the next step is beside this one, top to bottom when it is under it
      if (Math.abs(B.x - A.x) >= Math.abs(B.y - A.y)){ const ltr = B.x > A.x, x1 = ltr ? A.x + A.w : A.x, x2 = ltr ? B.x : B.x + B.w, y1 = A.y + A.h / 2, y2 = B.y + B.h / 2, m = (x1 + x2) / 2; d = `M${x1} ${y1}C${m} ${y1} ${m} ${y2} ${x2} ${y2}`; }
      else { const dn = B.y > A.y, y1 = dn ? A.y + A.h : A.y, y2 = dn ? B.y : B.y + B.h, x1 = A.x + A.w / 2, x2 = B.x + B.w / 2, m = (y1 + y2) / 2; d = `M${x1} ${y1}C${x1} ${m} ${x2} ${m} ${x2} ${y2}`; }
      let p = wireEl[a + b]; if (!p){ p = document.createElementNS('http://www.w3.org/2000/svg', 'path'); wires.appendChild(p); wireEl[a + b] = p; }
      p.setAttribute('d', d);
    });
  }
  /* ---------- the view: zoom z and pan (px, py), so a point x on the canvas shows at x * z + px ---------- */
  const Z = [.25, .33, .5, .67, .75, .9, 1, 1.25, 1.5, 2, 3, 4], MIN = Z[0], MAX = Z[Z.length - 1];
  let z = 1, px = 0, py = 0, moved = false;
  const lim = v => Math.max(MIN, Math.min(MAX, v)), pct = () => Math.round(z * 100) + '%';
  function apply(anim){
    if (cpFor) closeCp();
    cv.classList.toggle('anim', !!anim && !REDUCE);
    world.style.transform = `translate(${px}px,${py}px) scale(${z})`;
    // the dots move and scale with the view, and spread out again when it is zoomed far out
    const g = 16 * z * (z < .5 ? 2 : 1); cv.style.backgroundSize = `${g}px ${g}px`; cv.style.backgroundPosition = `${px}px ${py}px`;
    zl.textContent = pct(); zl.setAttribute('aria-label', `Zoom ${pct()}, reset to 100%`); $('.ctb-zl', menu).textContent = pct();
    const lo = z <= MIN + 1e-3, hi = z >= MAX - 1e-3;
    [zoB, $('[data-a="out"]', menu)].forEach(b => b.setAttribute('aria-disabled', lo));
    [ziB, $('[data-a="in"]', menu)].forEach(b => b.setAttribute('aria-disabled', hi));
  }
  function zoomAt(nz, cx, cy, anim){ nz = lim(nz); const wx = (cx - px) / z, wy = (cy - py) / z; z = nz; px = cx - wx * z; py = cy - wy * z; moved = true; apply(anim); }
  // the room the workflow has: the canvas above the toolbar
  const room = () => ({ W:cv.clientWidth, H:cv.clientHeight - bar.offsetHeight - 20 });
  const mid = () => { const { W, H } = room(); return [W / 2, H / 2]; };
  const next = d => { const s = d > 0 ? Z.find(x => x > z + 1e-3) : [...Z].reverse().find(x => x < z - 1e-3); return s === undefined ? z : s; };
  function zoomBy(d){ const nz = next(d); if (nz === z) return; zoomAt(nz, ...mid(), true); say('Zoom ' + pct()); emit('canvas-zoom', { zoom:z }); }
  function zoomReset(){ zoomAt(1, ...mid(), true); say('Zoom 100%'); emit('canvas-zoom', { zoom:z }); }
  // fit: the whole workflow in the room above the toolbar, centred, never more than 150% (on mount, never past 100%)
  function fit(anim, cap = 1.5){
    const { W, H } = room(), P = 24, bs = N.map(box);
    const x0 = Math.min(...bs.map(b => b.x)), y0 = Math.min(...bs.map(b => b.y)), x1 = Math.max(...bs.map(b => b.x + b.w)), y1 = Math.max(...bs.map(b => b.y + b.h));
    z = lim(Math.min((W - 2 * P) / (x1 - x0), (H - 2 * P) / (y1 - y0), cap));
    px = (W - (x1 - x0) * z) / 2 - x0 * z; py = (H - (y1 - y0) * z) / 2 - y0 * z;
    apply(anim);
  }
  function fitNow(){ fit(true); moved = true; say('Fit to screen, ' + pct()); emit('canvas-zoom', { zoom:z }); }
  /* ---------- tools: Select, Hand and Lasso are one radio group; Comment is a toggle beside them ---------- */
  const NAMES = { select:'Select', hand:'Hand', lasso:'Lasso' };
  let tool = 'select', commenting = false;
  function setTool(t, focus){
    tool = t; root.dataset.tool = t;
    radios.forEach(b => { const on = b.dataset.t === t; b.setAttribute('aria-checked', on); b.tabIndex = on ? 0 : -1; });
    if (focus) $(`[data-t="${t}"]`, bar).focus({ preventScroll:true });
    setComment(false, true); say(NAMES[t] + ' tool'); emit('canvas-tool', { tool:t });
  }
  function setComment(on, quiet){
    if (commenting === on) return; commenting = on; root.classList.toggle('cm', on);
    cmB.setAttribute('aria-pressed', on); $('[data-a="comment"]', menu).setAttribute('aria-checked', on);
    if (!quiet) say(on ? 'Comment: click the canvas to place it' : 'Comment off');
  }
  radios.forEach(b => b.onclick = () => setTool(b.dataset.t));
  // the arrow keys move through the tools and pick each one (focus follows the pick); Home and End jump to the ends
  c.on($('.ctb-tools', r), 'keydown', e => {
    const i = radios.indexOf(document.activeElement); if (i < 0) return;
    const d = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[e.key], j = d ? (i + d + radios.length) % radios.length : e.key === 'Home' ? 0 : e.key === 'End' ? radios.length - 1 : -1;
    if (j < 0) return; e.preventDefault(); e.stopPropagation(); setTool(radios[j].dataset.t, true);
  });
  cmB.onclick = () => setComment(!commenting);
  fitB.onclick = fitNow;
  zoB.onclick = () => zoomBy(-1); ziB.onclick = () => zoomBy(1); zl.onclick = zoomReset;
  $$('.mi', menu).forEach(m => m.onclick = () => ({ comment:() => setComment(!commenting), fit:fitNow, out:() => zoomBy(-1), in:() => zoomBy(1), reset:zoomReset })[m.dataset.a]());
  /* ---------- the canvas: Hand (or the middle button) pans, Select picks and moves steps or draws a box, Lasso draws a
     shape round what it picks, and Comment drops a pin. Ctrl or ⌘ with the wheel, or a pinch, zooms at the pointer ---------- */
  let sel = new Set(), drag = null, pins = 0;
  function select(ids){ sel = new Set(ids); N.forEach(n => el(n.id).classList.toggle('sel', sel.has(n.id))); }
  const pt = e => { const b = cv.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  const screen = n => { const b = box(n); return { l:b.x * z + px, t:b.y * z + py, r:(b.x + b.w) * z + px, b:(b.y + b.h) * z + py }; };
  const inside = ([x, y], poly) => { let k = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++){ const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) k = !k; } return k; };
  function pin([x, y]){
    const n = ++pins, p = html(`<button class="ctb-pin" aria-label="Comment ${n}" aria-haspopup="dialog" aria-expanded="false">${n}</button>`);
    p.style.left = x + 'px'; p.style.top = y + 'px'; p.dataset.n = n; p.dataset.x = x; p.dataset.y = y; world.appendChild(p);
    p.onclick = e => { e.stopPropagation(); cpFor === p ? closeCp(true) : openCp(p, e.isTrusted); };
    // Delete or Backspace on a pin deletes it straight away
    p.onkeydown = e => { if (e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); e.stopPropagation(); unpin(p); } else if (e.key === 'Escape' && cpFor === p){ e.preventDefault(); e.stopPropagation(); closeCp(true); } };
    setComment(false, true); say(`Comment ${n} placed`); emit('canvas-comment', { x:Math.round(x), y:Math.round(y) });
    return p;
  }
  /* ---------- a pin opens its comment, with Delete: the pin fades out and the focus goes back to the canvas ---------- */
  const cp = $('.ctb-cp', r), cpDel = $('.ctb-del', r); let cpFor = null; cp.inert = true;
  // which step a pin sits on or nearest to, so the comment says where it is
  const near = p => { const x = +p.dataset.x, y = +p.dataset.y; let best = null, bd = Infinity;
    N.forEach(n => { const b = box(n), dx = Math.max(b.x - x, 0, x - b.x - b.w), dy = Math.max(b.y - y, 0, y - b.y - b.h), d = Math.hypot(dx, dy); if (d < bd){ bd = d; best = n; } });
    return bd === 0 ? 'On ' + best.t : bd < 80 ? 'Near ' + best.t : 'On the canvas'; };
  function openCp(p, focus){
    if (cpFor) cpFor.setAttribute('aria-expanded', 'false');
    cpFor = p; p.setAttribute('aria-expanded', 'true');
    const n = p.dataset.n; $('.ctb-ct', cp).textContent = 'Comment ' + n; $('.ctb-cw', cp).textContent = near(p);
    cp.setAttribute('aria-label', 'Comment ' + n); cpDel.setAttribute('aria-label', 'Delete comment ' + n);
    // beside the pin, kept inside the room above the toolbar
    const W = cv.clientWidth, H = cv.clientHeight - bar.offsetHeight - 20, pb = p.getBoundingClientRect(), cb = cv.getBoundingClientRect(), pw = cp.offsetWidth, ph = cp.offsetHeight, G = 8, M = 8;
    let x = pb.right - cb.left + G, y = pb.top - cb.top;
    if (x + pw > W - M) x = pb.left - cb.left - G - pw;
    cp.style.left = Math.max(M, Math.min(W - pw - M, x)) + 'px'; cp.style.top = Math.max(M, Math.min(H - ph, y)) + 'px';
    cp.classList.add('open'); cp.inert = false;
    if (focus) cpDel.focus({ preventScroll:true });
  }
  function closeCp(back){
    if (!cpFor) return; const p = cpFor, was = cp.contains(document.activeElement);
    cp.classList.remove('open'); cp.inert = true; p.setAttribute('aria-expanded', 'false'); cpFor = null;
    if (p.isConnected && (back || was)) p.focus({ preventScroll:true });
  }
  function unpin(p){
    const n = p.dataset.n, was = cp.contains(document.activeElement) || document.activeElement === p;
    if (cpFor === p){ cp.classList.remove('open'); cp.inert = true; cpFor = null; }
    p.classList.add('gone'); setTimeout(() => p.remove(), REDUCE ? 0 : 180);
    if (was) cv.focus({ preventScroll:true });
    say(`Comment ${n} deleted`); emit('canvas-comment-delete', { n:+n });
  }
  cpDel.onclick = e => { e.stopPropagation(); if (cpFor) unpin(cpFor); };
  c.on(cp, 'keydown', e => { if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); closeCp(true); } });
  c.on(cp, 'pointerdown', e => e.stopPropagation());
  c.on(document, 'pointerdown', e => { if (cpFor && !cp.contains(e.target) && e.target !== cpFor) closeCp(); });
  // a pointer in the component hides the canvas's focus ring until the next key
  c.on(root, 'pointerdown', () => cv.classList.add('ptr'), true); c.on(root, 'keydown', () => cv.classList.remove('ptr'), true);
  /* the canvas never traps the page: until the person has engaged with the component (a click in it, a tap in it, or the
     keyboard's focus coming into it) a finger on the canvas belongs to the page, so it scrolls past as usual, and one that
     lifts without scrolling is a tap, which engages it. Once engaged (.engaged), a finger works the tool as the mouse does */
  let engaged = false, lastKey = -1e9;
  const engage = () => { if (engaged) return; engaged = true; cv.classList.add('engaged'); };
  c.on(document, 'keydown', e => { if (e.isTrusted) lastKey = e.timeStamp; }, true);
  c.on(root, 'pointerdown', e => { if (e.isTrusted && e.pointerType !== 'touch') engage(); }, true);
  c.on(root, 'pointerup', e => { if (e.isTrusted && e.pointerType === 'touch') engage(); }, true);
  c.on(root, 'focusin', e => { if (e.isTrusted && e.timeStamp - lastKey < 100) engage(); }, true);
  c.on(cv, 'pointerdown', e => {
    if ((e.button !== 0 && e.button !== 1) || (e.pointerType === 'touch' && !engaged)) return;
    // a pin is a button: pressing it opens its comment, whatever the tool
    if (e.button === 0 && e.target.closest('.ctb-pin')) return;
    const p = pt(e), node = e.target.closest('.ctb-n');
    // a click on the canvas gives it the focus, so the shortcuts work straight away
    if (e.isTrusted) cv.focus({ preventScroll:true });
    e.preventDefault();
    if (commenting && e.button === 0) return pin([(p[0] - px) / z, (p[1] - py) / z]);
    const kind = e.button === 1 || tool === 'hand' ? 'pan' : tool === 'select' ? (node ? 'move' : 'box') : 'lasso';
    if (kind === 'move'){ const id = node.dataset.id; if (e.shiftKey){ const s = new Set(sel); s.has(id) ? s.delete(id) : s.add(id); select(s); } else if (!sel.has(id)) select([id]); }
    else if (kind !== 'pan' && !e.shiftKey) select([]);
    drag = { kind, p0:p, px, py, pts:[p], from:N.map(n => [n.x, n.y]), base:new Set(sel) };
    if (kind === 'pan') cv.classList.add('pan');
    try { cv.setPointerCapture(e.pointerId); } catch(err){}
  });
  c.on(cv, 'pointermove', e => {
    if (!drag) return;
    const p = pt(e), dx = p[0] - drag.p0[0], dy = p[1] - drag.p0[1];
    if (drag.kind === 'pan'){ px = drag.px + dx; py = drag.py + dy; moved = true; apply(false); }
    else if (drag.kind === 'move'){
      N.forEach((n, i) => { if (!sel.has(n.id)) return; n.x = drag.from[i][0] + dx / z; n.y = drag.from[i][1] + dy / z; const e2 = el(n.id); e2.style.left = n.x + 'px'; e2.style.top = n.y + 'px'; if (small) n.um = [n.x, n.y]; else n.uw = [n.x, n.y]; });
      drawWires();
    } else if (drag.kind === 'box'){
      const x = Math.min(p[0], drag.p0[0]), y = Math.min(p[1], drag.p0[1]), w = Math.abs(dx), h = Math.abs(dy);
      mq.hidden = false; mq.style.cssText = `left:${x}px;top:${y}px;width:${w}px;height:${h}px`;
      select([...drag.base, ...N.filter(n => { const s = screen(n); return s.r > x && s.l < x + w && s.b > y && s.t < y + h; }).map(n => n.id)]);
    } else {
      drag.pts.push(p); lz.setAttribute('d', 'M' + drag.pts.map(q => q.map(Math.round).join(' ')).join('L') + 'Z');
      select([...drag.base, ...N.filter(n => { const s = screen(n); return inside([(s.l + s.r) / 2, (s.t + s.b) / 2], drag.pts); }).map(n => n.id)]);
    }
  });
  const end = () => {
    if (!drag) return; const k = drag.kind; drag = null;
    cv.classList.remove('pan'); mq.hidden = true; lz.setAttribute('d', '');
    if (k === 'box' || k === 'lasso' || k === 'move') say(sel.size ? `${sel.size} of ${N.length} steps selected` : 'Nothing selected');
  };
  c.on(cv, 'pointerup', end); c.on(cv, 'pointercancel', end);
  c.on(cv, 'wheel', e => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); zoomAt(z * Math.exp(-e.deltaY / 300), ...pt(e), false); }, { passive:false });
  /* ---------- the keyboard: V, H and L pick a tool, C comments, Shift+1 fits, Shift+0 is 100%, minus and plus zoom, the
     arrow keys pan while the canvas has the focus, and Escape leaves Comment or clears the selection ---------- */
  c.on(root, 'keydown', e => {
    if (e.defaultPrevented || e.ctrlKey || e.metaKey || e.altKey || menu.contains(e.target) || cp.contains(e.target) || /^(INPUT|TEXTAREA)$/.test(e.target.tagName)) return;
    const k = e.key, low = k.length === 1 ? k.toLowerCase() : '';
    if (e.shiftKey && e.code === 'Digit1') fitNow();
    else if (e.shiftKey && e.code === 'Digit0') zoomReset();
    else if (k === '+' || k === '=') zoomBy(1);
    else if (k === '-' || k === '_') zoomBy(-1);
    else if (!e.shiftKey && 'vhl'.includes(low) && low) setTool({ v:'select', h:'hand', l:'lasso' }[low], radios.includes(e.target));
    else if (!e.shiftKey && low === 'c') setComment(!commenting);
    else if (e.target === cv && /^Arrow/.test(k)){ const d = e.shiftKey ? 120 : 40; px += k === 'ArrowLeft' ? d : k === 'ArrowRight' ? -d : 0; py += k === 'ArrowUp' ? d : k === 'ArrowDown' ? -d : 0; moved = true; apply(true); }
    else if (k === 'Escape' && (commenting || sel.size)){ if (commenting) setComment(false); else { select([]); say('Nothing selected'); } }
    else return;
    e.preventDefault();
  });
  /* ---------- Run: the steps light up one after another along their wires, then it stops by itself; Stop ends it early ---------- */
  let runId = 0, running = false;
  function setRun(on){ running = on; runB.classList.toggle('stop', on); runB.innerHTML = I(on ? 'stop' : 'play', 'xs') + `<span>${on ? 'Stop' : 'Run'}</span>`; }
  const mark = (id, s) => {
    const e = el(id); e.classList.toggle('run', s === 'run'); let b = $('.s', e);
    if (!s){ if (b) b.remove(); return; }
    if (!b) b = e.appendChild(html('<span class="s" aria-hidden="true"></span>'));
    b.innerHTML = s === 'run' ? '<span class="spin"></span>' : I('check', 'xs');
  };
  function run(){
    const id = ++runId; setRun(true); ORDER.forEach(x => mark(x, null)); Object.values(wireEl).forEach(p => p.classList.remove('lit'));
    say('Running the workflow'); emit('canvas-run', {});
    c.run(async () => {
      const w = async ms => { await c.wait(ms); if (id !== runId) throw 'stop'; };
      for (let i = 0; i < ORDER.length; i++){
        mark(ORDER[i], 'run'); await w(i ? 700 : 450); mark(ORDER[i], 'ok');
        if (i < ORDER.length - 1){ wireEl[ORDER[i] + ORDER[i + 1]].classList.add('lit'); await w(250); }
      }
      await w(500); setRun(false); say(`Run finished: ${ORDER.length} of ${ORDER.length} steps passed`); emit('canvas-stop', { finished:true });
    });
  }
  function stop(){ runId++; setRun(false); ORDER.forEach(x => { if (el(x).classList.contains('run')) mark(x, null); }); say('Run stopped'); emit('canvas-stop', { finished:false }); }
  runB.onclick = () => running ? stop() : run();
  // the view fits the workflow until someone moves it; a canvas that changes between wide and narrow fits it again
  layout(); fit(false, 1);
  let lw = cv.clientWidth;
  const ro = new ResizeObserver(() => { const W = cv.clientWidth; if (W && W !== lw){ const was = small; lw = W; layout(); if (!moved || was !== small) fit(false, 1); } });
  ro.observe(cv); ro.observe(bar); c.offs.push(() => ro.disconnect());
  // the preview's story: take the hand and drag the workflow aside, zoom in twice, fit it back to the screen, then run it
  c.story(async s => {
    const shown = b => b.getClientRects().length > 0;
    // a button a narrow toolbar keeps in More is pressed from there
    const press = async (b, a) => {
      if (shown(b)) return s.tap(b);
      if (!menu.classList.contains('open')){ await s.tap(more); await s.beat(1); }
      await s.tap($(`.mi[data-a="${a}"]`, menu));
    };
    await s.beat(3);
    await s.tap(radios[1]); await s.beat(1);
    const aim = html('<i class="ctb-aim" aria-hidden="true"></i>'); cv.appendChild(aim);
    const at = (x, y) => { aim.style.left = Math.round(x) + 'px'; aim.style.top = Math.round(y) + 'px'; };
    // on a narrow canvas the column moves a little down and zooms out instead, so no step ever leaves the canvas
    const W = cv.clientWidth, H = cv.clientHeight, D = small ? 0 : Math.min(140, W * .22), V = small ? 32 : 24;
    at(W * .6, H * .3); await s.point(aim, false);
    const hand = $('.hand', r); if (hand) hand.classList.add('down'); await s.beat(.5);
    at(W * .6 - D, H * .3 + V); px -= D; py += V; moved = true; apply(true);
    await s.point(aim, false); if (hand) hand.classList.remove('down'); await s.beat(2);
    const zb = small ? zoB : ziB, za = small ? 'out' : 'in';
    await press(zb, za); await s.beat(1.5);
    await press(zb, za); await s.beat(2);
    await press(fitB, 'fit'); await s.beat(2);
    await s.tap(radios[0]); await s.beat(1);
    await s.tap(runB); s.away();
    await s.until(() => !running); await s.beat(3);
  });
});
