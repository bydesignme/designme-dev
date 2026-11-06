// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, html, tween } from '../core/core.js';
DM.def('color-picker', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{wand}', I('wand','xs')).replace('{layers}', I('layers','xs'));
  const root = $('.cpk', r), sv = $('.cpk-sv', r), hue = $('.cpk-hue', r), al = $('.cpk-al', r), [kSv, kH, kA] = $$('.cpk-k', r);
  const hx = $('.cpk-hx input', r), hxL = $('.cpk-hx', r), aOut = $('.cpk-a', r), sw = $('.cpk-sw', r), lines = $$('.cpk-ln', r), fix = $('.cpk-fix', r), mk = $('.cpk-mk', r), sc = $('.cpk-sc', r), sr = $('.cpk-sr', r);
  const INK = '#111111';
  // colour maths: HSV for picking, hex for reading, relative luminance for contrast (WCAG 2)
  const hsv2rgb = (h, s, v) => { const f = n => { const k = (n + h / 60) % 6; return v - v * s * Math.max(0, Math.min(k, 4 - k, 1)); }; return [f(5), f(3), f(1)].map(x => Math.round(x * 255)); };
  const rgb2hsv = ([r1, g1, b1]) => { const [R, G, B] = [r1, g1, b1].map(x => x / 255), mx = Math.max(R, G, B), mn = Math.min(R, G, B), d = mx - mn; let h = 0;
    if (d) h = mx === R ? ((G - B) / d) % 6 : mx === G ? (B - R) / d + 2 : (R - G) / d + 4; return [(h * 60 + 360) % 360, mx ? d / mx : 0, mx]; };
  const hex = rgb => '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
  const parse = t => { const m = t.trim().replace(/^#/, '').match(/^([0-9a-f]{3}|[0-9a-f]{6})$/i); if (!m) return null; let s = m[1]; if (s.length === 3) s = [...s].map(x => x + x).join(''); return [0, 2, 4].map(i => parseInt(s.slice(i, i + 2), 16)); };
  const lum = rgb => { const [R, G, B] = rgb.map(x => { x /= 255; return x <= .03928 ? x / 12.92 : Math.pow((x + .055) / 1.055, 2.4); }); return .2126 * R + .7152 * G + .0722 * B; };
  const ratio = (a, b) => { const x = lum(a), y = lum(b); return (Math.max(x, y) + .05) / (Math.min(x, y) + .05); };
  let H = 172, S = .62, V = .62, A = 1;
  const SW = ['#2f8cff', '#7c4dff', '#ff4d6d', '#ff9f1c', '#22c993', '#00a2bf', '#1f2937', '#f5c400'];
  sw.innerHTML = SW.map(x => `<button style="--dm-s:${x}" aria-label="${x}" data-tip="${x.toUpperCase()}" aria-pressed="false" data-v="${x}"></button>`).join('');
  const rgb = () => hsv2rgb(H, S, V);
  function paint(from){
    const c1 = rgb(), hc = hex(c1);
    root.style.setProperty('--dm-hc', `hsl(${H} 100% 50%)`); root.style.setProperty('--dm-c', A < 1 ? `rgb(${c1.join(' ')} / ${A})` : hc);
    kSv.style.left = S * 100 + '%'; kSv.style.top = (1 - V) * 100 + '%'; kSv.style.background = hc;
    kH.style.left = H / 359 * 100 + '%'; kH.style.background = `hsl(${H} 100% 50%)`;
    kA.style.left = A * 100 + '%'; kA.style.background = hc;
    kSv.setAttribute('aria-valuenow', Math.round(S * 100)); kSv.setAttribute('aria-valuetext', `Saturation ${Math.round(S * 100)}%, brightness ${Math.round(V * 100)}%`);
    kH.setAttribute('aria-valuenow', Math.round(H)); kH.setAttribute('aria-valuetext', Math.round(H) + ' degrees');
    kA.setAttribute('aria-valuenow', Math.round(A * 100)); kA.setAttribute('aria-valuetext', Math.round(A * 100) + '% opaque');
    if (from !== 'hex' && document.activeElement !== hx){ hx.value = hc.slice(1).toUpperCase(); hxL.removeAttribute('aria-invalid'); }
    aOut.textContent = Math.round(A * 100) + '%';
    $$('button', sw).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === hc));
    // contrast with white and with ink text, as a ratio and in words (4.5:1 for body text)
    lines.forEach(l => { const on = l.dataset.on === 'ink' ? INK : '#ffffff', x = ratio(c1, parse(on)), ok = x >= 4.5;
      $('.cpk-aa', l).style.color = on; $('.r', l).textContent = x.toFixed(1) + ':1'; const t = $('.tag', l); t.className = 'tag ' + (ok ? 'ok' : 'bad'); t.textContent = ok ? 'Pass' : 'Fail'; });
    const passW = ratio(c1, [255, 255, 255]) >= 4.5; fix.disabled = passW; fix.innerHTML = `${I('wand','xs')}${passW ? 'White text passes' : 'Suggest an accessible shade'}`;
  }
  // dragging: the field sets saturation and brightness, the rails hue and opacity
  const drag = (el, set) => { c.on(el, 'pointerdown', e => { if (e.button) return; e.preventDefault(); el.setPointerCapture(e.pointerId); const k = $('.cpk-k', el); k.focus({ preventScroll:true }); const mv = ev => { const b = el.getBoundingClientRect(); set(Math.max(0, Math.min(1, (ev.clientX - b.left) / b.width)), Math.max(0, Math.min(1, (ev.clientY - b.top) / b.height))); paint(); }; mv(e); el.onpointermove = mv; }); c.on(el, 'pointerup', () => el.onpointermove = null); };
  drag(sv, (x, y) => { S = x; V = 1 - y; }); drag(hue, x => { H = x * 359; }); drag(al, x => { A = x; });
  // the keys: arrows move one step, Shift ten, Home and End to the ends
  const keys = (k, fn) => c.on(k, 'keydown', e => { const n = e.shiftKey ? 10 : 1, m = { ArrowLeft:[-n, 0], ArrowRight:[n, 0], ArrowUp:[0, n], ArrowDown:[0, -n], Home:['min', 0], End:['max', 0] }[e.key]; if (!m) return; e.preventDefault(); fn(m); paint(); });
  const cl = (x, lo, hi) => Math.max(lo, Math.min(hi, x));
  keys(kSv, ([dx, dy]) => { if (dx === 'min') S = 0; else if (dx === 'max') S = 1; else { S = cl(S + dx / 100, 0, 1); V = cl(V + dy / 100, 0, 1); } });
  keys(kH, ([dx, dy]) => { H = dx === 'min' ? 0 : dx === 'max' ? 359 : cl(H + (dx || dy), 0, 359); });
  keys(kA, ([dx, dy]) => { A = dx === 'min' ? 0 : dx === 'max' ? 1 : cl(A + (dx || dy) / 100, 0, 1); });
  // the hex field: Enter keeps a valid colour, Escape puts back the one before, a wrong one is marked
  let before = '';
  const commit = () => { const p = parse(hx.value); if (p){ [H, S, V] = rgb2hsv(p); hxL.removeAttribute('aria-invalid'); paint(); } else { hxL.setAttribute('aria-invalid', 'true'); } };
  c.on(hx, 'focus', () => { before = hx.value; hx.select(); });
  c.on(hx, 'input', () => { hx.value = hx.value.replace(/[^0-9a-f#]/gi, ''); hxL.removeAttribute('aria-invalid'); });
  c.on(hx, 'keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); commit(); } if (e.key === 'Escape'){ hx.value = before; hxL.removeAttribute('aria-invalid'); } });
  c.on(hx, 'blur', () => { if (parse(hx.value)) commit(); else { hx.value = before; hxL.removeAttribute('aria-invalid'); } });
  // a swatch glides there
  const glide = (to, ms = 500) => { const [h1, s1, v1] = rgb2hsv(to), h0 = H, s0 = S, v0 = V, dh = ((h1 - h0 + 540) % 360) - 180; return tween(0, 1, ms, t => { H = (h0 + dh * t + 360) % 360; S = s0 + (s1 - s0) * t; V = v0 + (v1 - v0) * t; paint(); }); };
  $$('button', sw).forEach(b => b.onclick = () => glide(parse(b.dataset.v)));
  // the agent: the nearest shade (the same hue and saturation, darker) where white text passes, then a 50 to 900 scale
  fix.onclick = () => c.run(async () => {
    let v = V; while (v > 0 && ratio(hsv2rgb(H, S, v), [255, 255, 255]) < 4.6) v -= .005;
    fix.innerHTML = `<span class="spin"></span>Finding a shade`; await c.wait(500);
    await tween(V, v, 700, x => { V = x; paint(); }); sr.textContent = `Moved to ${hex(rgb()).toUpperCase()}, white text passes`;
  });
  const ramp = () => { const [h, s] = rgb2hsv(rgb()), L = [97, 93, 85, 74, 62, 50, 41, 33, 25, 18];
    return L.map(l => { const sat = Math.min(100, s * 100 * (l > 80 ? .9 : 1)), C = (1 - Math.abs(2 * l / 100 - 1)) * sat / 100, X = C * (1 - Math.abs((h / 60) % 2 - 1)), m = l / 100 - C / 2;
      const [r1, g1, b1] = h < 60 ? [C, X, 0] : h < 120 ? [X, C, 0] : h < 180 ? [0, C, X] : h < 240 ? [0, X, C] : h < 300 ? [X, 0, C] : [C, 0, X];
      return hex([r1, g1, b1].map(x => Math.round((x + m) * 255))); }); };
  mk.onclick = () => c.run(async () => {
    const R2 = ramp(), names = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900], here = hex(rgb());
    // the step nearest the picked colour is its place in the scale
    const near = R2.reduce((b, x, i) => Math.abs(lum(parse(x)) - lum(parse(here))) < Math.abs(lum(parse(R2[b])) - lum(parse(here))) ? i : b, 0);
    sc.innerHTML = ''; mk.innerHTML = '<span class="spin"></span>Making a scale'; await c.wait(400);
    for (let i = 0; i < 10; i++){ const b = html(`<button data-tip="${names[i]}: ${(i === near ? here : R2[i]).toUpperCase()}" aria-label="${names[i]}, ${(i === near ? here : R2[i]).toUpperCase()}"${i === near ? ' class="base"' : ''}><i style="background:${i === near ? here : R2[i]}"></i><span class="num">${names[i]}</span></button>`); sc.appendChild(b); enter(b); await c.wait(60); }
    mk.innerHTML = `${I('layers','xs')}Make a scale`; sr.textContent = `Scale made, ${here.toUpperCase()} is step ${names[near]}`;
  });
  paint();
  // the preview's story: a bright blue fails with white text, the agent darkens it until it passes, then makes a scale from it
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.tap($('button', sw)); await s.beat(3);
    await s.point(lines[0], false); await s.beat(2);
    await s.tap(fix); await s.beat(4);
    await s.tap(mk); s.away(); await s.beat(6);
  });
});
