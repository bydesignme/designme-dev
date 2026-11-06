// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, DM, I, REDUCE, centre, enter, html, swap } from '../core/core.js';
// the glass sphere of Voice orb, as a fragment shader. It is lit as a ball: normals from the sphere, a soft key light from the
// top left with a deeper, shifted hue past the terminator toward the bottom right, light gathered through the glass on the
// far side, a fresnel edge that reflects a soft room, a broad sheen and a small sharp highlight. Inside, the view bends as
// it enters the glass and the light is read at three depths along it, so the layers shift against each other like things
// in a volume: deep pools of the two colours and a third hue swirl slowly, liquid light (noise bent by noise) flows through
// the middle, and two thin ribbons turn the other way near the surface. The level (L) speeds the flow up, bends the liquid
// further, brightens the heart, makes the rim wobble a little and the highlight shimmer. At its widest the sphere still sits
// inside the canvas, and nothing is drawn outside it. The React component reads this same source
const ORB_FRAG = `#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
uniform vec2 R;uniform float T,L;uniform vec3 A0,B0;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+1.),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=mat2(1.6,1.2,-1.2,1.6)*p+vec2(1.7,9.2);a*=.5;}return v;}
mat2 rot(float a){float c=cos(a),s=sin(a);return mat2(c,s,-s,c);}
vec3 tn(vec3 c){float mx=max(c.r,max(c.g,c.b)),d=mx-min(c.r,min(c.g,c.b));c*=max(1.,.5/max(mx,.01));mx=max(mx,.5);d=mx-min(c.r,min(c.g,c.b));return max(mx-(mx-c)*mix(1.,clamp(.55*mx/max(d,.001),1.,3.),smoothstep(.03,.12,d)),0.);}
vec3 hue(vec3 c,float a){vec3 k=vec3(.57735);float co=cos(a);return c*co+cross(k,c)*sin(a)+k*dot(k,c)*(1.-co);}
void main(){
  vec3 A=tn(A0),B=tn(B0),C=hue(A,mix(-.9,1.4,smoothstep(-.1,.1,A.b-A.g)));
  vec2 u=(gl_FragCoord.xy*2.-R)/R.y;
  float t=T*.001,an=atan(u.y,u.x);
  float w=(.002+.008*L)*(sin(3.*an+t*1.9)+.6*sin(5.*an-t*2.7)+.4*sin(2.*an-t*1.1));
  float rad=.955*(1.+.008*sin(t*.9)+w);
  vec2 q=u/rad;float r=length(q),e=3./(R.y*rad);
  float a=1.-smoothstep(1.-e,1.,r);
  if(a<=0.){gl_FragColor=vec4(0.);return;}
  float z=sqrt(max(1.-r*r,0.));
  vec3 N=vec3(q,z);
  N.xy+=(vec2(n(q*5.+t*1.6),n(q*5.-t*1.3+7.))-.5)*(.03+.12*L);N=normalize(N);
  vec3 S=vec3(q,z),D=refract(vec3(0,0,-1),N,.72),P1=S+D*z*.35,P2=S+D*z*.9,P3=S+D*z*1.5;
  float s=t*.22;
  vec3 d1=P3-vec3(.55*sin(s*1.3),.5*cos(s*1.1),.3*sin(s*.7)),d2=P3-vec3(.55*cos(s*.9+2.),.5*sin(s*1.2+1.),.3*cos(s*.8+3.)),d3=P3-vec3(.5*sin(s*1.6+4.),.5*cos(s*1.4+5.),.3*sin(s+1.));
  float g1=exp(-dot(d1,d1)*2.6),g2=exp(-dot(d2,d2)*2.6),g3=exp(-dot(d3,d3)*3.2);
  vec3 col=mix(mix(mix(mix(A,B,.4)*.55,B,g2*.8),C,g3*.7),A,g1*.95);
  vec2 m=rot(t*.09)*P2.xy*1.5,o=vec2(fbm(m+vec2(0.,t*.3)),fbm(m+vec2(5.2,1.3)-t*.25));
  float f=fbm(m+(o-.5)*(2.5+2.*L)+vec2(t*.12,-t*.08));
  col=mix(col,mix(mix(A,B,.5),vec3(1.),.15),smoothstep(.45,.8,f)*.5)*(.8+.35*smoothstep(.2,.6,f));
  vec2 k=rot(-t*.33)*P1.xy;
  float b1=k.y+.32*sin(k.x*2.4+t*1.4)+.12*sin(k.x*5.3-t*2.2)+(o.x-.5)*.5,b2=k.x-.3*sin(k.y*2.1-t*1.1)+.4;
  col+=mix(mix(A,C,.35),vec3(1.),.35)*(exp(-b1*b1*40.)+.6*exp(-b2*b2*55.))*(.25+.35*L)*z;
  col+=mix(A,vec3(1.),.4)*exp(-dot(P2.xy,P2.xy)*3.)*(.08+.3*L);
  vec3 lk=normalize(vec3(-.5,.62,.6)),dk=hue(col,.35);
  col=mix(dk*dk*.6,col*1.06,smoothstep(-.55,.75,dot(N,lk)));
  col+=mix(B,vec3(1.),.5)*pow(1.-z,1.6)*smoothstep(.1,.95,dot(q/max(r,1e-3),-normalize(lk.xy)))*.55;
  col=mix(col,mix(vec3(.06),vec3(1.),smoothstep(-.3,.9,N.y*.7-N.x*.4)),pow(1.-N.z,3.)*.5);
  float nh=max(dot(N,normalize(lk+vec3(0,0,1))),0.);
  col+=pow(nh,700.)*(1.2+.8*L*sin(t*9.+q.x*8.))+pow(nh,60.)*.25+pow(nh,8.)*.1;
  gl_FragColor=vec4(clamp(col,0.,1.)*a,a);
}`;
// draws the sphere on Voice orb's canvas: one draw a frame, at most 2 device pixels a CSS pixel, and nothing made anew each
// frame. Where WebGL is missing it is drawn in a few gradients on a 2D canvas instead: the same pools of colour drifting under
// the same light, terminator, edge and highlight. Returns paint(ms of flow, level 0 to 1, colour, second colour), or null
// when neither canvas can draw. The context is let go when the component stops
function orbShader(cv, c){
  // a computed colour to 0 to 1 channels. Mid-transition it can come as oklab() or color(), so a 1px canvas reads it. Only a
  // colour that changed is read, a few times a second at most
  const px = document.createElement('canvas').getContext('2d', { willReadFrequently:true }); px.canvas.width = px.canvas.height = 1;
  const rgb = (s, o) => { px.clearRect(0, 0, 1, 1); px.fillStyle = '#000'; px.fillStyle = s; px.fillRect(0, 0, 1, 1); const d = px.getImageData(0, 0, 1, 1).data; o[0] = d[0] / 255; o[1] = d[1] / 255; o[2] = d[2] / 255; };
  const ta = new Float32Array(3), tb = new Float32Array(3), ca = new Float32Array(3), cb = new Float32Array(3);
  let sa = '', sb = '', w = 0, at = -1e9, prev = -1e9;
  // the canvas's size in device pixels, checked a few times a second
  const fit = now => { if (w && now - at < 300) return false; at = now; const n = Math.round(cv.clientWidth * Math.min(2, devicePixelRatio || 1)) || 1; if (n === w) return false; w = cv.width = cv.height = n; return true; };
  // a new colour is glided to over a few frames; after a pause (a still frame, or back on screen) it is taken at once
  const tint = (a, b, now, snap) => {
    if (a !== sa){ sa = a; rgb(a, ta); } if (b !== sb){ sb = b; rgb(b, tb); }
    const k = snap || now - prev > 200 ? 1 : Math.min(1, (now - prev) / 110); prev = now;
    for (let i = 0; i < 3; i++){ ca[i] += (ta[i] - ca[i]) * k; cb[i] += (tb[i] - cb[i]) * k; }
  };
  const gl = cv.getContext('webgl', { premultipliedAlpha:true, antialias:false, powerPreference:'low-power' });
  if (gl){
    const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); return s; };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}'));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, ORB_FRAG));
    gl.linkProgram(pr);
    const lose = () => { const x = gl.getExtension('WEBGL_lose_context'); if (x) x.loseContext(); };
    if (!gl.getProgramParameter(pr, gl.LINK_STATUS)){ lose(); return null; }
    gl.useProgram(pr);
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer()); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const p = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(p); gl.vertexAttribPointer(p, 2, gl.FLOAT, false, 0, 0);
    const U = k => gl.getUniformLocation(pr, k), uR = U('R'), uT = U('T'), uL = U('L'), uA = U('A0'), uB = U('B0');
    c.offs.push(lose);
    cv.classList.add('on');
    return (ms, lv, a, b) => {
      const now = performance.now(); if (fit(now)) gl.viewport(0, 0, w, w);
      tint(a, b, now, false);
      gl.uniform2f(uR, w, w); gl.uniform1f(uT, ms); gl.uniform1f(uL, lv); gl.uniform3fv(uA, ca); gl.uniform3fv(uB, cb);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
  }
  const x = cv.getContext('2d'); if (!x) return null;
  // the shader's colours: dark ones lifted, pale ones given more chroma, and a third hue turned round the grey axis toward
  // the warm side (blue and violet toward magenta, lime toward amber)
  const tn = (o, d) => { const lift = Math.max(1, .5 / Math.max(.01, o[0], o[1], o[2])), mx = Math.max(o[0], o[1], o[2]) * lift, dd = mx - Math.min(o[0], o[1], o[2]) * lift, s = Math.min(1, Math.max(0, (dd - .03) / .09)), k = 1 + (Math.min(3, Math.max(1, .55 * mx / Math.max(dd, .001))) - 1) * s * s * (3 - 2 * s); for (let i = 0; i < 3; i++) d[i] = Math.max(0, mx - (mx - o[i] * lift) * k); };
  const hue = (o, d, ang) => { const co = Math.cos(ang), si = Math.sin(ang) * .57735, m = (o[0] + o[1] + o[2]) / 3 * (1 - co); d[0] = o[0] * co + (o[2] - o[1]) * si + m; d[1] = o[1] * co + (o[0] - o[2]) * si + m; d[2] = o[2] * co + (o[1] - o[0]) * si + m; };
  const A = new Float32Array(3), B = new Float32Array(3), C = new Float32Array(3), M = new Float32Array(3);
  const css = (o, al, f = 1) => `rgba(${[0, 1, 2].map(i => Math.round(Math.min(1, Math.max(0, o[i] * f)) * 255)).join(',')},${al})`;
  // every gradient is made for a sphere of radius 1 at the origin, and placed by the transform as it is drawn
  const grad = (cx, cy, r, stops) => { const g = x.createRadialGradient(cx, cy, 0, cx, cy, r); for (let i = 0; i < stops.length; i += 2) g.addColorStop(stops[i], stops[i + 1]); return g; };
  const shade = grad(-.35, -.4, 1.6, [0, 'rgba(255,255,255,.16)', .45, 'rgba(0,0,0,0)', 1, 'rgba(0,0,0,.5)']),
    rim = grad(0, 0, 1, [.78, 'rgba(255,255,255,0)', 1, 'rgba(255,255,255,.28)']),
    sheen = grad(-.32, -.38, .6, [0, 'rgba(255,255,255,.22)', 1, 'rgba(255,255,255,0)']),
    spec = grad(-.4, -.46, .14, [0, 'rgba(255,255,255,.95)', 1, 'rgba(255,255,255,0)']);
  let g = null, mid = 0, rad = 0;
  const put = (fill, dx, dy, sz) => { x.setTransform(rad * sz, 0, 0, rad * sz, mid + rad * dx, mid + rad * dy); x.fillStyle = fill; x.fillRect(-1, -1, 2, 2); };
  cv.classList.add('on');
  return (ms, lv, a, b) => {
    const now = performance.now(); fit(now);
    // the colour gradients are made again only when a colour changes
    if (!g || a !== sa || b !== sb){
      tint(a, b, now, true); tn(ca, A); tn(cb, B); hue(A, C, A[2] > A[1] ? 1.4 : -.9);
      for (let i = 0; i < 3; i++) M[i] = (A[i] + B[i]) / 2;
      g = { base:css(M, 1, .7), a:grad(0, 0, 1, [0, css(A, .95), 1, css(A, 0)]), b:grad(0, 0, 1, [0, css(B, .95), 1, css(B, 0)]), c:grad(0, 0, 1, [0, css(C, .55), 1, css(C, 0)]), core:grad(0, 0, 1, [0, css(A, 1, 1.4), 1, css(A, 0)]) };
    }
    const t = ms * .001, s = t * .22; mid = w / 2; rad = mid * .955 * (1 + .008 * Math.sin(t * .9));
    x.setTransform(1, 0, 0, 1, 0, 0); x.clearRect(0, 0, w, w);
    x.save(); x.beginPath(); x.arc(mid, mid, rad, 0, Math.PI * 2); x.clip();
    x.fillStyle = g.base; x.fillRect(0, 0, w, w);
    put(g.a, .55 * Math.sin(s * 1.3), -.5 * Math.cos(s * 1.1), 1.1);
    put(g.b, .55 * Math.cos(s * .9 + 2), -.5 * Math.sin(s * 1.2 + 1), 1.1);
    put(g.c, .5 * Math.sin(s * 1.6 + 4), -.5 * Math.cos(s * 1.4 + 5), .9);
    x.globalAlpha = .15 + .45 * lv; put(g.core, 0, 0, .7);
    x.globalAlpha = 1; put(shade, 0, 0, 1); put(rim, 0, 0, 1); put(sheen, 0, 0, 1);
    x.globalAlpha = .85 + .15 * lv * Math.sin(t * 9); put(spec, 0, 0, 1);
    x.restore();
  };
}
DM.def('voice-orb', (r, c) => {
  const IC = { warn:I('alert','xs'), mic:I('mic','xs'), micm:I('mic') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  const root = $('.vor', r), orb = $('.vor-orb', r), st = $('.vor-st', r), tm = $('.vor-t', r), who = $('.vor-who', r), tx = $('.vor-tx', r), mf = $('.vor-mf', r), f = $('.vor-f', r), mute = $('.vor-mute', r);
  // what is said, turn by turn. The demo plays it as a script: it never uses the microphone or makes a sound
  const TURNS = [['You', 'Make the yearly price the default on the pricing page.'], ['Agent', 'Done. Yearly is now the default on all three plans in Pricing v4.'], ['You', 'Show the yearly saving in green too.'], ['Agent', 'Added. The saving shows in green under each yearly price.']];
  const HINT = 'Talk to the agent about Pricing v4', LABEL = { idle:'Ready', listening:'Listening', thinking:'Thinking', speaking:'Speaking', muted:'Muted', ended:'Ended' };
  let mode = 'idle', muted = false, talking = false, said = 0, secs = 0, run = 0, done = null, lv = 0;
  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
  // muted only changes how listening looks: the agent can still think and speak
  const show = () => { const m = muted && mode === 'listening' ? 'muted' : mode; if (root.dataset.m !== m){ root.dataset.m = m; swap(st, LABEL[m]); } };
  const set = m => { mode = m; show(); };
  const notice = on => { mf.classList.toggle('shut', !on); mf.inert = !on; };
  notice(false);
  // centred in its stage at every moment: it glides up as the muted notice or the ended row opens, so it never sits high
  centre(c, root, () => root.offsetHeight);
  // the orb is a lit glass sphere with light flowing inside it in the colours of whoever is talking, faster and brighter as
  // they get louder (orbShader, above). Where no canvas can draw, the core keeps its plain gradient
  const paint = orbShader($('.vor-gl', orb), c), dot = $('.vor-dot', r), pc = $('.vor-pc', orb);
  let seen = true, flow = 0, last = 0;
  if (paint && 'IntersectionObserver' in window){ const io = new IntersectionObserver(e => { seen = e[0].isIntersecting; }); io.observe(orb); c.offs.push(() => io.disconnect()); }
  // the two colours are read a few times a second, not every frame: reading them makes the browser recheck the page's styles
  let cols = null, colsAt = -1e9;
  const draw = t => { if (!paint) return; const now = performance.now(); if (!cols || now - colsAt > 250){ cols = [getComputedStyle(dot).backgroundColor, getComputedStyle(pc).backgroundColor]; colsAt = now; } paint(t, lv, cols[0], cols[1]); };
  // a first frame straight away, so the sphere is there even while a pointer rests on the card and the loop holds
  draw(0);
  // the orb follows a level: a made-up voice while someone talks, a faint idle while it listens. With reduced motion it is
  // still: one frame, drawn again when the colours change. The setting is read every frame, so it can change mid-visit
  let still = false;
  c.loop(t => {
    if (REDUCE){ if (!still){ still = true; lv = 0; orb.style.setProperty('--dm-lv', '0'); draw(0); } last = 0; return; }
    still = false;
    const to = talking ? .5 + .28 * Math.sin(t / 90) * Math.sin(t / 233) + .16 * Math.sin(t / 57) : mode === 'listening' && !muted ? .05 + .03 * Math.sin(t / 420) : 0;
    lv += (Math.max(0, to) - lv) * .18; orb.style.setProperty('--dm-lv', lv.toFixed(3));
    flow += Math.min(50, t - (last || t)) * (1 + lv * 2.5); last = t;
    if (seen) draw(flow);
  });
  if (paint){ const mo = new MutationObserver(() => c.later(450, () => { cols = null; if (REDUCE) draw(0); })); mo.observe(root, { attributes:true, attributeFilter:['data-m'] }); c.offs.push(() => mo.disconnect()); }
  c.every(1000, () => { if (mode !== 'idle' && mode !== 'ended'){ secs++; tm.textContent = fmt(secs); } });
  async function say(name, line, ms, id){
    swap(who, name); tx.classList.remove('hint'); tx.innerHTML = ''; talking = true;
    for (const w of line.split(' ')){ if (id !== run) return; tx.insertAdjacentHTML('beforeend', `<span class="w">${w} </span>`); await c.wait(ms); }
    talking = false;
  }
  async function talk(id){
    for (const [name, line] of TURNS){
      if (name === 'You'){
        set('listening'); await c.wait(1200); if (id !== run) return;
        // they start talking while muted: say so, and wait for them to unmute
        if (muted){ notice(true); while (muted){ await c.wait(100); if (id !== run) return; } await c.wait(400); if (id !== run) return; }
        await say(name, line, 230, id); if (id !== run) return;
        set('thinking'); await c.wait(1300);
      } else { set('speaking'); await say(name, line, 190, id); if (id !== run) return; set('listening'); }
      said++;
    }
  }
  function start(){
    const id = ++run; said = 0; secs = 0; tm.textContent = fmt(0);
    if (done){ done.remove(); done = null; } f.hidden = false; root.classList.add('on');
    c.run(() => talk(id));
  }
  function setMuted(on){
    muted = on; mute.setAttribute('aria-pressed', on); mute.dataset.tip = on ? 'Unmute' : 'Mute';
    if (!on) notice(false); show();
  }
  $('.vor-go', r).onclick = start;
  mute.onclick = () => setMuted(!muted);
  $('.vor-un', r).onclick = () => setMuted(false);
  $('.vor-end', r).onclick = () => {
    run++; talking = false; notice(false); set('ended'); root.classList.remove('on'); f.hidden = true;
    done = html(`<div class="vor-done">${I('ok')}<span class="t">Voice chat ended<span class="muted">${fmt(secs)} · Transcript saved</span></span><button class="pill sm">Start again</button></div>`);
    root.appendChild(done); enter(done);
    $('button', done).onclick = () => { setMuted(false); swap(who, ''); tx.classList.add('hint'); tx.textContent = HINT; start(); };
  };
  // the preview's story: start, mute while the agent answers, talk while muted, unmute and go on, then end
  c.story(async s => {
    await s.beat(3); await s.tap($('.vor-go', r)); s.away();
    await s.until(() => mode === 'speaking'); await s.beat(3); await s.tap(mute); s.away();
    await s.until(() => !mf.classList.contains('shut')); await s.beat(4);
    await s.tap($('.vor-un', r)); s.away();
    await s.until(() => said === TURNS.length); await s.beat(3);
    await s.tap($('.vor-end', r)); s.away(); await s.beat(1);
  });
});
