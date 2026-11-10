/* ===== Soft 2 and Blueprint 2 components ===== */
(function(){

/* Soft 2 core: mounting, replay, motion helpers, tooltips, popovers */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
/* reduced motion, read live: REDUCE follows the device's setting as it changes, so turning it on or off mid-visit takes
   effect at once, without a reload. Turning it on also finishes what a script is animating in the components right now */
let REDUCE = false;
{
  const mq = matchMedia('(prefers-reduced-motion: reduce)');
  const set = () => {
    REDUCE = mq.matches; if (!REDUCE || !document.getAnimations) return;
    for (const a of document.getAnimations()){
      const t = a.effect && a.effect.target;
      if (a instanceof CSSAnimation || a instanceof CSSTransition || !t || !t.closest || !t.closest('[data-c],.v2,.stage-in')) continue;
      try { a.finish(); } catch(e){ a.cancel(); }
    }
  };
  set();
  if (mq.addEventListener) mq.addEventListener('change', set); else mq.addListener(set);
}
const I = (n, c = 's') => `<svg class="i ${c}"><use href="#v2i-${n}"/></svg>`;
const AV = (n, bg) => `<span class="av" style="background:${bg}${/^var\(--av-[a-z]\)$/.test(bg) ? ';color:' + bg.replace(')', '-ink)') : ''}">${n}</span>`;
/* official brand marks for the services this page names */
const BRAND = {"google": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 128 128\"><path fill=\"#e33629\" d=\"M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z\"/><path fill=\"#f8bd00\" d=\"M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z\"/><path fill=\"#587dbd\" d=\"M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z\"/><path fill=\"#319f43\" d=\"M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z\"/></svg>", "github": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12\"/></svg>", "figma": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 128 128\"><path fill=\"#0acf83\" d=\"M45.5 129c11.9 0 21.5-9.6 21.5-21.5V86H45.5C33.6 86 24 95.6 24 107.5S33.6 129 45.5 129zm0 0\"/><path fill=\"#a259ff\" d=\"M24 64.5C24 52.6 33.6 43 45.5 43H67v43H45.5C33.6 86 24 76.4 24 64.5zm0 0\"/><path fill=\"#f24e1e\" d=\"M24 21.5C24 9.6 33.6 0 45.5 0H67v43H45.5C33.6 43 24 33.4 24 21.5zm0 0\"/><path fill=\"#ff7262\" d=\"M67 0h21.5C100.4 0 110 9.6 110 21.5S100.4 43 88.5 43H67zm0 0\"/><path fill=\"#1abcfe\" d=\"M110 64.5c0 11.9-9.6 21.5-21.5 21.5S67 76.4 67 64.5 76.6 43 88.5 43 110 52.6 110 64.5zm0 0\"/></svg>", "slack": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 128 128\"><path d=\"M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317C6.616 94.036.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317-7.33 0-13.317-5.987-13.317-13.317zm0 0\" fill=\"#de1c59\"/><path d=\"M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309C33.964 6.616 39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317zm0 0\" fill=\"#35c5f0\"/><path d=\"M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317 7.33 0 13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317zm0 0\" fill=\"#2eb57d\"/><path d=\"M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309 0 7.33-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317 0 7.33-5.987 13.317-13.317 13.317zm0 0\" fill=\"#ebb02e\"/></svg>", "notion": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z\"/></svg>", "linear": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 24 24\"><path fill=\"#5e6ad2\" d=\"M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z\"/></svg>", "gmail": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"52 42 88 66\"><path fill=\"#4285f4\" d=\"M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6\"/><path fill=\"#34a853\" d=\"M120 108h14c3.32 0 6-2.69 6-6V59l-20 15\"/><path fill=\"#fbbc04\" d=\"M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2\"/><path fill=\"#ea4335\" d=\"M72 74V48l24 18 24-18v26L96 92\"/><path fill=\"#c5221f\" d=\"M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2\"/></svg>", "drive": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 87.3 78\"><path fill=\"#0066da\" d=\"m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z\"/><path fill=\"#00ac47\" d=\"m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z\"/><path fill=\"#ea4335\" d=\"m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z\"/><path fill=\"#00832d\" d=\"m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z\"/><path fill=\"#2684fc\" d=\"m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z\"/><path fill=\"#ffba00\" d=\"m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z\"/></svg>"};
/* country flags, drawn as images so each one keeps its own ids */
const FLAG = cc => `<img class="flag" alt="" src="data:image/svg+xml,${encodeURIComponent(FLAGS[cc].replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" '))}">`;
const FLAGS = {"US": "<svg viewBox=\"0 0 640 480\"> <path fill=\"#bd3d44\" d=\"M0 0h640v480H0\"/> <path stroke=\"#fff\" stroke-width=\"37\" d=\"M0 55.3h640M0 129h640M0 203h640M0 277h640M0 351h640M0 425h640\"/> <path fill=\"#192f5d\" d=\"M0 0h364.8v258.5H0\"/> <marker id=\"us-a\" markerHeight=\"30\" markerWidth=\"30\"> <path fill=\"#fff\" d=\"m14 0 9 27L0 10h28L5 27z\"/> </marker> <path fill=\"none\" marker-mid=\"url(#us-a)\" d=\"m0 0 16 11h61 61 61 61 60L47 37h61 61 60 61L16 63h61 61 61 61 60L47 89h61 61 60 61L16 115h61 61 61 61 60L47 141h61 61 60 61L16 166h61 61 61 61 60L47 192h61 61 60 61L16 218h61 61 61 61 60z\"/> </svg>", "GB": "<svg viewBox=\"0 0 640 480\"> <path fill=\"#012169\" d=\"M0 0h640v480H0z\"/> <path fill=\"#FFF\" d=\"m75 0 244 181L562 0h78v62L400 241l240 178v61h-80L320 301 81 480H0v-60l239-178L0 64V0z\"/> <path fill=\"#C8102E\" d=\"m424 281 216 159v40L369 281zm-184 20 6 35L54 480H0zM640 0v3L391 191l2-44L590 0zM0 0l239 176h-60L0 42z\"/> <path fill=\"#FFF\" d=\"M241 0v480h160V0zM0 160v160h640V160z\"/> <path fill=\"#C8102E\" d=\"M0 193v96h640v-96zM273 0v480h96V0z\"/> </svg>", "DE": "<svg viewBox=\"0 0 640 480\"> <path fill=\"#fc0\" d=\"M0 320h640v160H0z\"/> <path fill=\"#000001\" d=\"M0 0h640v160H0z\"/> <path fill=\"red\" d=\"M0 160h640v160H0z\"/> </svg>", "FR": "<svg viewBox=\"0 0 640 480\"> <path fill=\"#fff\" d=\"M0 0h640v480H0z\"/> <path fill=\"#000091\" d=\"M0 0h213.3v480H0z\"/> <path fill=\"#e1000f\" d=\"M426.7 0H640v480H426.7z\"/> </svg>", "NL": "<svg viewBox=\"0 0 640 480\"> <path fill=\"#ae1c28\" d=\"M0 0h640v160H0z\"/> <path fill=\"#fff\" d=\"M0 160h640v160H0z\"/> <path fill=\"#21468b\" d=\"M0 320h640v160H0z\"/> </svg>", "IE": "<svg viewBox=\"0 0 640 480\"> <g fill-rule=\"evenodd\" stroke-width=\"1pt\"> <path fill=\"#fff\" d=\"M0 0h640v480H0z\"/> <path fill=\"#009A49\" d=\"M0 0h213.3v480H0z\"/> <path fill=\"#FF7900\" d=\"M426.7 0H640v480H426.7z\"/> </g> </svg>", "IT": "<svg viewBox=\"0 0 640 480\"> <g fill-rule=\"evenodd\" stroke-width=\"1pt\"> <path fill=\"#fff\" d=\"M0 0h640v480H0z\"/> <path fill=\"#009246\" d=\"M0 0h213.3v480H0z\"/> <path fill=\"#ce2b37\" d=\"M426.7 0H640v480H426.7z\"/> </g> </svg>", "JP": "<svg viewBox=\"0 0 640 480\"> <defs> <clipPath id=\"jp-a\"> <path fill-opacity=\".7\" d=\"M-88 32h640v480H-88z\"/> </clipPath> </defs> <g fill-rule=\"evenodd\" stroke-width=\"1pt\" clip-path=\"url(#jp-a)\" transform=\"translate(88 -32)\"> <path fill=\"#fff\" d=\"M-128 32h720v480h-720z\"/> <circle cx=\"523.1\" cy=\"344.1\" r=\"194.9\" fill=\"#bc002d\" transform=\"translate(-168.4 8.6)scale(.76554)\"/> </g> </svg>", "CA": "<svg viewBox=\"0 0 640 480\"> <path fill=\"#fff\" d=\"M150.1 0h339.7v480H150z\"/> <path fill=\"#d52b1e\" d=\"M-19.7 0h169.8v480H-19.7zm509.5 0h169.8v480H489.9zM201 232l-13.3 4.4 61.4 54c4.7 13.7-1.6 17.8-5.6 25l66.6-8.4-1.6 67 13.9-.3-3.1-66.6 66.7 8c-4.1-8.7-7.8-13.3-4-27.2l61.3-51-10.7-4c-8.8-6.8 3.8-32.6 5.6-48.9 0 0-35.7 12.3-38 5.8l-9.2-17.5-32.6 35.8c-3.5.9-5-.5-5.9-3.5l15-74.8-23.8 13.4c-2 .9-4 .1-5.2-2.2l-23-46-23.6 47.8c-1.8 1.7-3.6 1.9-5 .7L264 130.8l13.7 74.1c-1.1 3-3.7 3.8-6.7 2.2l-31.2-35.3c-4 6.5-6.8 17.1-12.2 19.5-5.4 2.3-23.5-4.5-35.6-7 4.2 14.8 17 39.6 9 47.7\"/> </svg>", "SE": "<svg viewBox=\"0 0 640 480\"> <path fill=\"#005293\" d=\"M0 0h640v480H0z\"/> <path fill=\"#fecb00\" d=\"M176 0v192H0v96h176v192h96V288h368v-96H272V0z\"/> </svg>", "AU": "<svg viewBox=\"0 0 640 480\"> <path fill=\"#00008B\" d=\"M0 0h640v480H0z\"/> <path fill=\"#fff\" d=\"m37.5 0 122 90.5L281 0h39v31l-120 89.5 120 89V240h-40l-120-89.5L40.5 240H0v-30l119.5-89L0 32V0z\"/> <path fill=\"red\" d=\"M212 140.5 320 220v20l-135.5-99.5zm-92 10 3 17.5-96 72H0zM320 0v1.5l-124.5 94 1-22L295 0zM0 0l119.5 88h-30L0 21z\"/> <path fill=\"#fff\" d=\"M120.5 0v240h80V0zM0 80v80h320V80z\"/> <path fill=\"red\" d=\"M0 96.5v48h320v-48zM136.5 0v240h48V0z\"/> <path fill=\"#fff\" d=\"m527 396.7-20.5 2.6 2.2 20.5-14.8-14.4-14.7 14.5 2-20.5-20.5-2.4 17.3-11.2-10.9-17.5 19.6 6.5 6.9-19.5 7.1 19.4 19.5-6.7-10.7 17.6zm-3.7-117.2 2.7-13-9.8-9 13.2-1.5 5.5-12.1 5.5 12.1 13.2 1.5-9.8 9 2.7 13-11.6-6.6zm-104.1-60-20.3 2.2 1.8 20.3-14.4-14.5-14.8 14.1 2.4-20.3-20.2-2.7 17.3-10.8-10.5-17.5 19.3 6.8L387 178l6.7 19.3 19.4-6.3-10.9 17.3 17.1 11.2ZM623 186.7l-20.9 2.7 2.3 20.9-15.1-14.7-15 14.8 2.1-21-20.9-2.4 17.7-11.5-11.1-17.9 20 6.7 7-19.8 7.2 19.8 19.9-6.9-11 18zm-96.1-83.5-20.7 2.3 1.9 20.8-14.7-14.8-15.1 14.4 2.4-20.7-20.7-2.8 17.7-11L467 73.5l19.7 6.9 7.3-19.5 6.8 19.7 19.8-6.5-11.1 17.6zM234 385.7l-45.8 5.4 4.6 45.9-32.8-32.4-33 32.2 4.9-45.9-45.8-5.8 38.9-24.8-24-39.4 43.6 15 15.8-43.4 15.5 43.5 43.7-14.7-24.3 39.2 38.8 25.1Z\"/> </svg>", "ES": "<svg viewBox=\"0 0 640 480\"><path fill=\"#AA151B\" d=\"M0 0h640v480H0z\"/><path fill=\"#F1BF00\" d=\"M0 120h640v240H0z\"/></svg>"};

/* every running demo gets a controller, so Replay can cancel it cleanly */
function ctl(up){
  const c = { dead:false, t:[], iv:[], rafs:[], offs:[], q:[], kids:[] };
  /* a mouse resting on a component holds its demo where it is (c.held, kept by DM.mount), so the demo never moves what the
     visitor is about to click: whatever falls due waits until the pointer leaves, then the demo carries on from there. Once
     the visitor has taken over there is no demo left to hold. A controller made inside a demo holds with the one it is in */
  if (up) up.kids.push(c);
  c.hold = () => (!!c.held && !c.mine) || (!!up && up.hold());
  const gate = c.gate = fn => { if (c.hold()) c.q.push(fn); else fn(); };
  c.release = () => { c.q.splice(0).forEach(f => f()); c.kids.forEach(k => k.release()); };
  c.wait = ms => new Promise((res, rej) => { c.t.push(setTimeout(() => gate(() => c.dead ? rej('stop') : res()), REDUCE ? Math.min(ms, 40) : ms)); });
  c.every = (ms, fn) => { const id = setInterval(() => { if (!c.dead && !c.hold()) fn(); }, ms); c.iv.push(id); return id; };
  c.later = (ms, fn) => { c.t.push(setTimeout(() => gate(() => { if (!c.dead) fn(); }), ms)); };
  // a frame loop does its work only while its component is on screen (c.seen, kept by DM.mount) and not held; otherwise it waits
  c.loop = fn => { const f = t => { if (c.dead) return; if (c.seen !== false && !c.hold() && fn(t) === false) return; c.rafs.push(requestAnimationFrame(f)); }; c.rafs.push(requestAnimationFrame(f)); };
  c.on = (el, ev, fn, o) => { el.addEventListener(ev, fn, o); c.offs.push(() => el.removeEventListener(ev, fn, o)); };
  c.stop = () => { c.dead = true; c.t.forEach(clearTimeout); c.iv.forEach(clearInterval); c.rafs.forEach(cancelAnimationFrame); c.offs.forEach(f => f()); };
  c.run = async fn => { try { await fn(); } catch(e) { if (e !== 'stop') console.error(e); } };
  /* a preview's story: a person and the agent take turns on a grid of half-second beats. s.beat(n) waits n beats,
     s.tap(el) moves a pointer to el and presses it, s.point(el) rests the pointer on el (showing its tooltip), s.away()
     puts the pointer down. The visitor takes over with their first real click or key, and the story stops where it is.
     s.until(f) waits until f() is true. At the end it holds the final state for two seconds, then plays again from the
     start while the card is on screen.
     With reduced motion the pointer jumps instead of gliding, and the story plays once */
  /* the visitor takes over: c.mine turns true at their first real click, key, focus or typing inside the component
     (DM.mount listens), and stays true until Animate or Replay mounts it again. What a demo does by itself, as the person
     in it, stops there; what the visitor sets off keeps working. c.taken(fn) runs fn at that moment, or at once if it has
     passed, so a demo can take back what it was halfway through (the letters it had typed) */
  let mine = false; const taken = [];
  Object.defineProperty(c, 'mine', { get:() => mine, set:v => { if (!v || mine) return; mine = true; taken.splice(0).forEach(f => { try { f(); } catch(e){ console.error(e); } }); c.release(); } });
  c.taken = fn => { if (mine) fn(); else taken.push(fn); };
  // a demo's own steps: c.step(ms) waits like c.wait and stops the demo once the visitor has taken over; c.auto(ms, fn)
  // does fn later, as the person in the demo, unless the visitor has taken over by then
  c.step = ms => mine ? Promise.reject('stop') : c.wait(ms).then(() => { if (mine) throw 'stop'; });
  c.auto = (ms, fn) => c.later(ms, () => { if (!mine) fn(); });
  // a demo typing into a field, as the person in it would: text a letter at a time, or a list of pieces one at a time, and
  // each() after every change. If the visitor takes over while it types, what it typed goes and the field is theirs again.
  // clear empties the field first (taking over puts back what was there); keep leaves that undo armed once the typing is
  // done, for text the demo is about to send, until the field changes
  const typeIn = async (el, text, wait, { each = () => {}, clear = false, keep = false } = {}) => {
    const was = el.value; let typed = '', last = null;
    c.taken(() => { if (last !== null && el.isConnected && el.value === last){ el.value = was; each(); } });
    if (clear){ el.value = ''; each(); last = el.value; }
    for (const p of typeof text === 'string' ? [...text] : text){ await wait(); typed += p; el.value = (clear ? '' : was) + typed; each(); last = el.value; }
    if (!keep) last = null;
  };
  c.type = (el, text, o = {}) => typeIn(el, text, () => c.step(typeof o.ms === 'function' ? o.ms() : o.ms ?? 40), o);
  c.story = fn => c.run(async () => {
    const st = c.st; let hand = null, tipped = null;
    const check = () => { if (c.mine || c.dead) throw 'stop'; };
    const sleep = ms => new Promise((res, rej) => { c.t.push(setTimeout(() => gate(() => c.dead ? rej('stop') : res()), ms)); });
    const unTip = () => { if (tipped){ tipped.dispatchEvent(new PointerEvent('pointerout', { bubbles:true })); tipped = null; } };
    const s = {
      beat: async (n = 1) => { check(); await sleep(n * 500); check(); },
      point: async (el, tip = true) => {
        check(); unTip();
        if (!hand){ hand = html('<span class="hand" aria-hidden="true"><svg viewBox="0 0 18 18"><path d="M3 2l11.5 6.1-5 1.5-2.4 5z"/></svg></span>'); if (getComputedStyle(st).position === 'static') st.style.position = 'relative'; st.appendChild(hand); }
        const h = hand.parentElement.getBoundingClientRect(), b = el.getBoundingClientRect();
        const x = b.left - h.left + Math.min(b.width * .62, b.width - 10), y = b.top - h.top + b.height * .58;
        if (!hand.classList.contains('on')){ hand.style.transition = 'none'; hand.style.transform = `translate(${x + 26}px,${y + 30}px)`; void hand.offsetWidth; hand.style.transition = ''; hand.classList.add('on'); }
        hand.style.transform = `translate(${x}px,${y}px)`;
        await sleep(REDUCE ? 0 : 420); check();
        if (tip && el.closest('[data-tip]')){ tipped = el.closest('[data-tip]'); tipped.dispatchEvent(new PointerEvent('pointerover', { bubbles:true })); }
      },
      tap: async el => {
        await s.point(el, false); hand.classList.remove('down'); void hand.offsetWidth; hand.classList.add('down');
        // a label is pressed through its control: clicking the label itself would focus the control, and the page would
        // scroll to it while the visitor reads somewhere else. Whatever the press does, the page stays where it is
        await sleep(160); check(); const y = scrollY, x = scrollX; (el.matches('label') && el.control ? el.control : el).click(); if (scrollY !== y || scrollX !== x) scrollTo(x, y);
        c.later(340, () => hand && hand.classList.remove('down'));
      },
      away: () => { unTip(); if (hand) hand.classList.remove('on', 'down'); },
      until: async f => { while (!f()){ check(); await sleep(100); } check(); },
      // types into a field, n beats for each letter or piece; taking over takes the typing back (see c.type)
      type: (el, text, o = {}) => typeIn(el, text, () => s.beat(o.n ?? .1), o)
    };
    // only a card plays a story; a component placed inside another (as in Agent harness) waits for its host
    if (!c.card) return;
    try { await fn(s); } finally { if (c.mine || c.dead) s.away(); }
    s.away();
    if (REDUCE) return;
    await s.beat(4);
    DM.again(c.card);
  });
  return c;
}
/* blur crossfade for text that changes */
function swap(el, html, isHTML){
  if (!el) return;
  // the newest call wins: a write still on its way is compared first, and a newer value replaces it rather than landing
  // before it. Swapping back to what is on screen cancels the pending write and lets the text fade back in
  const p = el._sw;
  if (p){ if (p.v === html && p.h === !!isHTML) return; clearTimeout(p.t); el._sw = null; }
  const cur = isHTML ? el.innerHTML : el.textContent; if (cur === html){ if (p) el.classList.remove('out'); return; }
  el.classList.add('sw'); el.classList.add('out');
  const s = el._sw = { v:html, h:!!isHTML, t:setTimeout(() => { if (el._sw !== s) return; el._sw = null; isHTML ? el.innerHTML = html : el.textContent = html; el.classList.remove('out'); }, REDUCE ? 0 : 170) };
}
function tween(from, to, ms, step, ease = t => 1 - Math.pow(1 - t, 3)){
  return new Promise(res => { const t0 = performance.now(); const f = t => { const p = Math.max(0, Math.min(1, (t - t0) / (REDUCE ? 1 : ms))); step(from + (to - from) * ease(p), p); p < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); });
}
// the entrance plays once: its class goes when it ends, so moving the element later (a sort re-appending a row) doesn't play it again
function enter(el, delay = 0){ if (!el) return el; el.classList.remove('enter'); void el.offsetWidth; el.style.animationDelay = delay + 'ms'; el.classList.add('enter');
  const end = e => { if (e.target !== el || e.animationName !== 'enter') return; el.classList.remove('enter'); el.removeEventListener('animationend', end); el.removeEventListener('animationcancel', end); };
  el.addEventListener('animationend', end); el.addEventListener('animationcancel', end); return el; }
function stagger(els, step = 60, base = 0){ els.forEach((e, i) => enter(e, base + i * step)); }
/* reflow(): a list that changes under a filter, a search or a sort. The change happens at once, in change(); this only
   shows it. items() gives the list's items, each known by its o.by attribute (data-key by default). The items that stay
   glide from where they were to where they are now, new ones fade in from 4px down, and the ones that went fade out where
   they were, as a copy that takes no room and can't be reached. A change made while the last one is still moving starts
   from where everything is on screen, so quick clicks never stack or leave anything halfway. Transform and opacity only,
   at the style's own pace (--t-fast, --ease); with reduced motion it is only the change.
   An item the change hides counts as gone. Only items that don't sit inside one another can be listed (a group and its own
   rows would glide twice).
   o: { by, root (the component, which places are measured against), enter:false (new items come in some other way),
   leave:false (items that go fade some other way), host (where a copy goes when the change redrew the item's own parent) } */
function reflow(items, change, o = {}){
  const by = o.by || 'data-key', live = () => items().filter(el => !el.hasAttribute('data-ghost'));
  if (REDUCE || !document.body.animate){ change(); return; }
  // places are read against the component (o.root), so when the change re-centres it in its stage the items move with it
  const box = () => o.root && o.root.isConnected ? o.root.getBoundingClientRect() : { left:0, top:0 }, r0 = box();
  const was = new Map(), hosts = new Set();
  for (const el of live()){
    const k = el.getAttribute(by), b = el.getBoundingClientRect(); if (k == null || (!b.width && !b.height)) continue;
    was.set(k, { el, b, p:el.parentNode, o:+getComputedStyle(el).opacity, w:el.cells ? [...el.cells].map(td => td.getBoundingClientRect().width) : null }); hosts.add(el.parentNode);
  }
  // copies still fading from the last change stay on screen, even when this one redraws the list they sit in
  if (o.host) hosts.add(o.host);
  const ghosts = [...hosts].flatMap(p => [...p.children].filter(x => x.hasAttribute('data-ghost')).map(g => [g, p]));
  change();
  ghosts.forEach(([g, p]) => { if (!g.isConnected && p.isConnected) p.appendChild(g); });
  const r1 = box(), sx = r1.left - r0.left, sy = r1.top - r0.top;
  const now = live(), at = now[0] || [...hosts].find(p => p.isConnected) || document.documentElement, cs = getComputedStyle(at);
  const E = cs.getPropertyValue('--ease').trim() || 'ease', T = (parseFloat(cs.getPropertyValue('--t-fast')) || .22) * 1000, seen = new Set();
  let n = 0;
  for (const el of now){
    const k = el.getAttribute(by), a = was.get(k);
    (el._rf || []).forEach(x => x.cancel()); el._rf = [];
    const b = el.getBoundingClientRect(); if (!b.width && !b.height) continue;
    seen.add(k);
    if (!a){ if (o.enter !== false) el._rf.push(el.animate([{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }], { duration:T, delay:Math.min(n++, 5) * 24, easing:E, fill:'backwards' })); continue; }
    const dx = a.b.left + sx - b.left, dy = a.b.top + sy - b.top;
    if (Math.abs(dx) > .5 || Math.abs(dy) > .5) el._rf.push(el.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:'none' }], { duration:T + 40, easing:E }));
    if (a.o < .99) el._rf.push(el.animate([{ opacity:a.o }, { opacity:1 }], { duration:T, easing:E }));
  }
  if (o.leave === false) return;
  was.forEach((a, k) => {
    const p = a.p.isConnected ? a.p : o.host && o.host.isConnected ? o.host : null;
    if (seen.has(k) || !p || a.o < .05) return;
    const g = a.el.cloneNode(true);
    [g, ...g.querySelectorAll('[id]')].forEach(x => x.removeAttribute('id'));
    g.removeAttribute(by); g.removeAttribute('hidden'); g.setAttribute('data-ghost', ''); g.setAttribute('aria-hidden', 'true'); g.inert = true;
    Object.assign(g.style, { position:'absolute', left:'0', top:'0', margin:'0', width:a.b.width + 'px', height:a.b.height + 'px', boxSizing:'border-box', pointerEvents:'none' });
    if (a.w) [...g.cells].forEach((td, i) => { td.style.boxSizing = 'border-box'; td.style.width = a.w[i] + 'px'; });
    p.appendChild(g);
    const gb = g.getBoundingClientRect(); g.style.transform = `translate(${a.b.left + sx - gb.left}px,${a.b.top + sy - gb.top}px)`;
    const f = g.animate([{ opacity:a.o }, { opacity:0 }], { duration:T * .8, easing:E, fill:'forwards' });
    f.onfinish = f.oncancel = () => g.remove();
  });
}
/* a component that swaps what it shows for a shorter end state (a confirmation, a summary) keeps the height it had, so it
   stays centred in its stage instead of shrinking to the top of it; .held centres the end state inside that height.
   release() lets it size to its content again, for Start over and the like */
function hold(el){ if (!el) return el; el.style.minHeight = Math.ceil(el.getBoundingClientRect().height) + 'px'; el.classList.add('held'); return el; }
function release(el){ if (el){ el.style.minHeight = ''; el.classList.remove('held'); } return el; }
/* centre(): keeps a field centred in the room its stage keeps for it, and glides it up as its list opens, so the field
   and the list sit centred together. showing() is the height on show once things settle; the glide runs at the speed
   folds and lists open with, so the two move as one */
function centre(c, el, showing, watch = []){
  // the room is the stage you see, whichever page the component is on: the homepage card keeps space for the open list
  // above and below, a component page centres the component in its own stage
  const room = el.closest('.stage-inner') || el.closest('.stage-in') || el.parentElement;
  const place = () => {
    if (!room.clientHeight) return;
    const rs = getComputedStyle(room), rr = room.getBoundingClientRect(), pt = parseFloat(rs.paddingTop) || 0, pb = parseFloat(rs.paddingBottom) || 0;
    const now = new DOMMatrixReadOnly(getComputedStyle(el).transform).m42, top = el.getBoundingClientRect().top - now - rr.top;
    // where the top goes so what is showing sits centred, but never above the stage's own padding
    const want = pt + (room.clientHeight - pt - pb - showing()) / 2;
    el.style.setProperty('--gy', Math.round(Math.max(pt, want) - top) + 'px');
  };
  el.classList.add('glide'); el.style.transition = 'none'; place();
  requestAnimationFrame(() => requestAnimationFrame(() => { el.style.transition = ''; }));
  const ro = new ResizeObserver(place); [room, el, ...watch].forEach(n => ro.observe(n)); c.offs.push(() => ro.disconnect());
  return place;
}
/* carousel(): the parts around a native scroll-snap track (Carousel, both its types). The track scrolls by itself, so
   a swipe, a trackpad and the browser's own scrolling all work; this only keeps the rest in step with it:
   - its stops: where each slide snaps (start or centre, from the slide's scroll-snap-align), with slides that share one
     (narrow slides near the end) folded into a single stop, so no dot or arrow press ever goes nowhere
   - the arrows (disabled at the first and last stop), the dots (one per stop, the current one aria-current) and the keys on the
     track: Left and Right go a stop, Home and End to the ends, scrolling smoothly, or jumping with reduced motion
   - a mouse can drag the track like a finger; the click a drag ends with is swallowed
   - .in on each slide that is at least 70% in view (the CSS brings it into focus), and say(i) once the track settles on the
     stop that starts with slide i, for a polite live region
   o: { prev, next, dots, dot:i => label, say:i => {}, key:e => {} (other keys on the track) }. Returns { go, at, measure } */
function carousel(c, tr, o = {}){
  const { prev, next, dots } = o, S = () => [...tr.children];
  let stops = [], at = 0, settleT = 0, raf = 0, drag = null, dragged = false;
  const max = () => Math.max(0, tr.scrollWidth - tr.clientWidth);
  function measure(){
    const cs = getComputedStyle(tr), pad = parseFloat(cs.scrollPaddingLeft) || 0, w = tr.clientWidth, m = max();
    const out = [];
    S().forEach((s, i) => {
      const mid = getComputedStyle(s).scrollSnapAlign.includes('center');
      const x = Math.round(Math.max(0, Math.min(m, mid ? s.offsetLeft + s.offsetWidth / 2 - w / 2 : s.offsetLeft - pad)));
      if (!out.length || Math.abs(x - out[out.length - 1].x) > 2) out.push({ x, i });
    });
    const grew = !dots || dots.children.length !== Math.max(out.length, 1); stops = out.length ? out : [{ x:0, i:0 }];
    if (dots) dots.hidden = stops.length < 2;
    if (dots && grew){
      dots.innerHTML = stops.map(s => `<button type="button" aria-label="${o.dot ? o.dot(s.i) : `Show slide ${s.i + 1}`}"></button>`).join('');
      $$('button', dots).forEach((b, j) => b.onclick = () => go(j));
    }
    at = Math.min(at, stops.length - 1); mark();
  }
  function mark(){
    if (prev) prev.disabled = at === 0;
    if (next) next.disabled = at === stops.length - 1;
    if (dots) $$('button', dots).forEach((b, j) => b.setAttribute('aria-current', j === at));
  }
  // the stop nearest the scroll position; at the far end it is always the last one
  const near = () => { const x = tr.scrollLeft; if (x >= max() - 2) return stops.length - 1; let best = 0; stops.forEach((s, j) => { if (Math.abs(s.x - x) < Math.abs(stops[best].x - x)) best = j; }); return best; };
  function go(j){
    at = Math.max(0, Math.min(stops.length - 1, j)); mark();
    if (Math.abs(tr.scrollLeft - stops[at].x) < 2){ settle(); return; }
    tr.scrollTo({ left:stops[at].x, behavior:REDUCE ? 'auto' : 'smooth' });
  }
  function settle(){ tr.classList.remove('drag'); if (o.say) o.say(stops[at].i); }
  c.on(tr, 'scroll', () => {
    cancelAnimationFrame(raf); raf = requestAnimationFrame(() => { if (drag) return; const j = near(); if (j !== at){ at = j; mark(); } });
    clearTimeout(settleT); settleT = setTimeout(() => { if (!drag && !c.dead) settle(); }, 160);
  }, { passive:true });
  c.offs.push(() => { clearTimeout(settleT); cancelAnimationFrame(raf); });
  c.on(tr, 'keydown', e => {
    if (e.target !== tr) return;
    const to = { ArrowLeft:at - 1, ArrowRight:at + 1, Home:0, End:stops.length - 1 }[e.key];
    if (to != null){ e.preventDefault(); go(to); } else if (o.key) o.key(e);
  });
  if (prev) prev.onclick = () => go(at - 1);
  if (next) next.onclick = () => go(at + 1);
  // a mouse drags the track like a finger would; the snap waits until the track has glided to the stop it lands on
  c.on(tr, 'pointerdown', e => { if (e.pointerType !== 'mouse' || e.button || e.target.closest('button,a,input,textarea,select,label')) return; drag = { x:e.clientX, l:tr.scrollLeft, from:at, on:false }; });
  c.on(tr, 'pointermove', e => {
    if (!drag) return; const dx = e.clientX - drag.x;
    if (!drag.on){ if (Math.abs(dx) < 5) return; drag.on = true; tr.classList.add('drag'); try { tr.setPointerCapture(e.pointerId); } catch(err){} }
    tr.scrollLeft = drag.l - dx;
  });
  const drop = e => {
    const d = drag; drag = null; if (!d || !d.on) return;
    const dx = e.clientX - d.x; let j = near(); if (j === d.from && Math.abs(dx) > 40) j += dx < 0 ? 1 : -1;
    dragged = true; setTimeout(() => { dragged = false; }, 0); go(j);
  };
  c.on(tr, 'pointerup', drop); c.on(tr, 'pointercancel', drop);
  c.on(tr, 'click', e => { if (dragged){ e.preventDefault(); e.stopPropagation(); } }, true);
  // a slide comes into focus once most of it is in view
  if ('IntersectionObserver' in window){
    const io = new IntersectionObserver(es => es.forEach(e => e.target.classList.toggle('in', e.isIntersecting && e.intersectionRatio >= .69)), { root:tr, threshold:[0, .7, 1] });
    S().forEach(s => io.observe(s)); c.offs.push(() => io.disconnect());
  } else S().forEach(s => s.classList.add('in'));
  const ro = new ResizeObserver(() => measure()); ro.observe(tr); c.offs.push(() => ro.disconnect());
  measure();
  return { go, measure, get at(){ return at; }, get stop(){ return stops[at]; } };
}
/* entrance: when a component mounts, its container rises into place and its parts follow one after another.
   Soft rises out of a blur; Blueprint wipes down and ticks its parts in, in short hard beats. Each animation only
   names where it starts, so it ends on whatever the element's own styles say, and leaves nothing behind */
const REVEAL = {
  soft:{ root:[{ opacity:0, transform:'translateY(14px)' }], rootMs:820, part:[{ opacity:0, filter:'blur(6px)', transform:'translateY(8px)' }], partMs:760, first:110, step:65, max:620, ease:'cubic-bezier(.16,1,.3,1)' },
  bp:{ root:[{ opacity:0, clipPath:'inset(0 0 100% 0)' }, { opacity:1, clipPath:'inset(0 0 0% 0)', offset:.35 }, { clipPath:'inset(0 0 0% 0)' }], rootMs:520, part:[{ opacity:0, transform:'translateY(4px)' }], partMs:320, first:160, step:45, max:420, ease:'cubic-bezier(.65,0,.25,1)' }
};
function revealParts(root){
  const shown = el => { if (el.matches('template,script,style,.pop,.demo,[hidden],[aria-hidden="true"]:empty')) return false; const cs = getComputedStyle(el); if (cs.display === 'none' || cs.position === 'fixed' || cs.position === 'absolute' || +cs.opacity === 0) return false; const b = el.getBoundingClientRect(); return b.width > 2 && b.height > 2; };
  // go down through single wrappers to the first level that has several parts
  let el = root, parts = [];
  for (let d = 0; d < 4; d++){ parts = [...el.children].filter(shown); if (parts.length !== 1) break; el = parts[0]; }
  // a long list in the middle (rows, cards, lines) cascades row by row instead of rising as one block
  const H = root.getBoundingClientRect().height || 1;
  parts = parts.flatMap(p => { const kids = [...p.children].filter(shown); return kids.length >= 3 && p.getBoundingClientRect().height > H * .35 ? kids : [p]; });
  return parts.slice(0, 16);
}
function reveal(st){
  if (REDUCE || !st.animate) return;
  const M = REVEAL[getComputedStyle(st).getPropertyValue('--motion').trim()] || REVEAL.soft;
  [...st.children].filter(el => !el.matches('template,script,style')).forEach(root => {
    const go = (el, kf, ms, delay) => { const [first, ...rest] = kf;
      // a rise is added to the element's own transform, so a centred or rotated part keeps its place
      const { transform, ...look } = first;
      // a lone keyframe would be read as the end, so the start is pinned at 0
      if (Object.keys(look).length) el.animate([{ offset:0, ...look }, ...rest], { duration:ms, delay, easing:M.ease, fill:'backwards' });
      if (transform) el.animate([{ transform }, { transform:'none' }], { duration:ms, delay, easing:M.ease, fill:'backwards', composite:'add' }); };
    // a component can ask for less: data-reveal="flat" moves only its container, "none" skips the entrance
    const how = root.dataset.reveal; if (how === 'none') return;
    go(root, M.root, M.rootMs, 0);
    if (how !== 'flat') revealParts(root).forEach((p, i) => go(p, M.part, M.partMs, Math.min(M.first + i * M.step, M.max)));
  });
}
function html(str){ const t = document.createElement('template'); t.innerHTML = str.trim(); return t.content.firstElementChild; }
/* sliding knob for segmented controls */
function seg(el, onChange){
  let knob = $('.knob', el); if (!knob){ knob = document.createElement('span'); knob.className = 'knob'; el.prepend(knob); }
  const place = () => { const b = $('[aria-pressed="true"]', el); if (!b) return; knob.style.left = b.offsetLeft + 'px'; knob.style.width = b.offsetWidth + 'px'; };
  $$('button', el).forEach(b => b.addEventListener('click', () => { if (b.disabled) return; $$('button', el).forEach(x => x.setAttribute('aria-pressed', x === b)); place(); onChange && onChange(b.dataset.v ?? b.textContent.trim(), b); }));
  // the first placing is instant: a switch drawn again (a design picked, the component remounted) shows its pick where it
  // is, and only a pick made on it slides the knob (owner, 4 Nov)
  requestAnimationFrame(() => { knob.style.transition = 'none'; place(); void knob.offsetWidth; knob.style.transition = ''; });
  new ResizeObserver(place).observe(el); return { place };
}

/* when the visitor last pressed a key or a pointer: a focus that comes with one (a Tab into a component) is theirs, and a
   focus a script gives is not */
let lastInput = -1e9;
['pointerdown', 'keydown'].forEach(t => addEventListener(t, e => { if (e.isTrusted) lastInput = e.timeStamp; }, true));
// a pick on a design switch is noted as it happens (a person's click or key, or the homepage's footer tabs), so the mount it
// leads to swaps the design in place
document.addEventListener('click', e => { const b = e.target.closest && e.target.closest('.dm>.demo .seg2 button'); if (!b) return; const card = b.closest('.comp, [data-c]'); if (card) card._dmPick = performance.now(); }, true);
const DM = {
  defs:{},
  // agents at work: their demos keep playing while a mouse rests on them, instead of holding (see mount)
  PLAYS:new Set(['status-pill','step-loader','thinking','reasoning-trail','agent-lanes','agent-run-timeline','trace-view','agent-tree','run-queue','terminal-stream','browser-session','action-log','attachment-tray','progress','web-search','agent-phases','thinking-states','run-drawer']),
  def(id, fn){ this.defs[id] = fn; },
  /* the markup a card starts from: its <template>, or, when the markup is written out in its stage, what the stage holds
     before it first mounts, kept as a template so Replay starts from it again */
  tpl(card){
    let t = $('template', card); if (t) return t;
    const st = $('.stage-in', card); if (!st) return null;
    t = document.createElement('template'); t.innerHTML = st.innerHTML; card.appendChild(t); return t;
  },
  mount(card, again){
    const id = card.dataset.v2, st = $('.stage-in', card), tpl = DM.tpl(card);
    if (card._c) card._c.stop();
    if (openPop && card.contains(openPop.pop)) closePops();
    st.innerHTML = ''; st.append(tpl.content.cloneNode(true));
    const c = ctl(); card._c = c; c.card = card; c.st = st;
    // a mouse over the component holds its demo; leaving lets it carry on (see ctl). Touch has no hover, so it never holds.
    // An agent at work (DM.PLAYS) keeps working under the pointer, the way a real one would (owner, 3 Nov)
    c.on(st, 'pointerenter', e => { if (e.pointerType === 'mouse' && !DM.PLAYS.has(id)) c.held = true; });
    c.on(st, 'pointerleave', () => { if (c.held){ c.held = false; c.release(); } });
    // whether the component is on screen or near it, so frame loops and canvases rest while it is far away
    if ('IntersectionObserver' in window){ const io = new IntersectionObserver(e => { c.seen = e[e.length - 1].isIntersecting; }, { rootMargin:'200px 0px' }); io.observe(st); c.offs.push(() => io.disconnect()); }
    // the visitor's first real click, key, typing or focus in the component stops its demo (c.mine)
    const mine = e => { if (e.isTrusted) c.mine = true; };
    ['pointerdown', 'keydown', 'input', 'click'].forEach(t => c.on(st, t, mine, true));
    c.on(st, 'focusin', e => { if (e.isTrusted && e.timeStamp - lastInput < 100) c.mine = true; }, true);
    try { this.defs[id] && this.defs[id](st, c, card); } catch(e){ console.error(id, e); }
    // a design picked with the switch under the component swaps in place: the new design fades in where it stands, without
    // the entrance a first visit gets, so picking one never reads as the page reloading (owner, 4 Nov)
    const swapped = card._dmPick && performance.now() - card._dmPick < 600; card._dmPick = 0;
    if (swapped){ const m = $('.dm>.dm-main', st); if (m && !REDUCE) m.animate([{ opacity:0 }, { opacity:1 }], { duration:260, easing:'ease-out' }); }
    else if (!again) reveal(st);
  },
  /* a story starts again once its card is on screen, the tab is open and no pointer rests on it: the finished run
     fades out and a fresh one fades in, without the entrance */
  again(card){
    const c = card._c; if (!c || c.dead) return;
    const ready = () => { const b = card.getBoundingClientRect(); return !document.hidden && b.bottom > innerHeight * .15 && b.top < innerHeight * .85 && !card.matches(':hover'); };
    let gone = false;
    const go = () => {
      if (gone || card._c !== c || c.dead || c.mine || !ready()) return;
      gone = true; io.disconnect();
      const st = $('.stage-in', card), out = st.animate([{ opacity:1 }, { opacity:0 }], { duration:320, easing:'ease-out', fill:'forwards' });
      out.finished.then(() => { if (card._c === c && !c.dead && !c.mine){ DM.mount(card, true); st.animate([{ opacity:0 }, { opacity:1 }], { duration:320, easing:'ease-out' }); } out.cancel(); }).catch(() => {});
    };
    const io = new IntersectionObserver(go, { threshold:[0, .25, .5, 1] }); io.observe(card); c.offs.push(() => io.disconnect());
    c.on(document, 'visibilitychange', go); c.on(card, 'pointerleave', go);
  }
};

/* ---------- tooltips: any element with data-tip ---------- */
// it is out of the accessibility tree while it shows nothing, so screen readers never meet an empty tooltip
const tip = document.createElement('div'); tip.className = 'tip'; tip.setAttribute('role','tooltip'); tip.setAttribute('aria-hidden','true');
// tipNext is the trigger whose tip is on its way, so moving across its own icon and padding doesn't start the wait again
let tipT = 0, tipFor = null, tipNext = null;
// a trigger whose menu is open shows its menu, not its tip
const menuOpen = el => el.getAttribute('aria-expanded') === 'true' && (el.hasAttribute('data-pop') || (el.hasAttribute('aria-haspopup') && el.getAttribute('aria-haspopup') !== 'false'));
// a tip goes when its trigger does: removed, hidden, or its menu opened
// only a change that could touch the trigger is checked (an attribute on it or around it, or a removal that takes it), so a
// demo rewriting its text many times a second elsewhere never forces the page to lay itself out again
const tipWatch = new MutationObserver(ms => { if (!tipFor) return;
  const near = ms.some(m => m.type === 'attributes' ? m.target.contains(tipFor) : [...m.removedNodes].some(n => n === tipFor || (n.contains && n.contains(tipFor))));
  if (near && (!tipFor.isConnected || menuOpen(tipFor) || !tipFor.getClientRects().length)) hideTip(true); });
function showTip(el){
  if (!el.isConnected || !el.dataset.tip || menuOpen(el)) return;
  tipFor = el; const k = el.dataset.tipK;
  tipWatch.observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['aria-expanded', 'hidden'] });
  tip.innerHTML = el.dataset.tip.replace(/</g,'&lt;') + (k ? `<span class="kbd">${k}</span>` : '');
  tip.style.left = '0px'; tip.style.top = '0px'; tip.classList.add('show'); tip.removeAttribute('aria-hidden');
  const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
  // it stays inside the component's stage when it fits there, so on a phone it never runs past the card's edge
  const st = el.closest('.stage-in'), sb = st && st.parentElement.getBoundingClientRect();
  const lo = sb && sb.width >= w + 16 ? Math.max(8, sb.left + 8) : 8, hi = sb && sb.width >= w + 16 ? Math.min(innerWidth, sb.right) - w - 8 : innerWidth - w - 8;
  let x = r.left + r.width / 2 - w / 2; x = Math.max(lo, Math.min(hi, x));
  // above the trigger, or below when there is no room; data-tip-at="below" asks for below first, for a trigger that has
  // a header just above it the tip would cover
  const below = el.dataset.tipAt === 'below';
  let y = below ? r.bottom + 8 : r.top - h - 8; if (below ? y + h > innerHeight - 8 : y < 8) y = below ? r.top - h - 8 : r.bottom + 8;
  tip.style.left = x + 'px'; tip.style.top = y + 'px';
}
// when the last tip hid, so moving straight on to the next one shows it at once
let tipHid = -1e9;
// a demo playing on its own (a timer, or a click it makes) never takes away the tip, or the tip on its way, of the control
// the visitor is pointing at, in its own card or another: they would see the label vanish, or never come, under the
// pointer. Their own clicks and moves, and a trigger that changes its tip (force), still hide it
function hideTip(force){
  const on = tipFor || tipNext, ev = window.event;
  if (!force && on && on.isConnected && on.matches(':hover') && !(ev && ev.isTrusted)) return;
  clearTimeout(tipT); tipFor = null; tipNext = null; tipWatch.disconnect(); if (tip.classList.contains('show')) tipHid = performance.now(); tip.classList.remove('show'); tip.setAttribute('aria-hidden','true'); }
document.addEventListener('pointerover', e => { const el = e.target.closest('.v2 [data-tip]'); if (!el || el === tipFor) return; if (el === tipNext) return; clearTimeout(tipT); tipNext = el; tipT = setTimeout(() => { tipNext = null; showTip(el); }, tip.classList.contains('show') || performance.now() - tipHid < 120 ? 0 : 380); });
document.addEventListener('pointerout', e => { const el = e.target.closest('.v2 [data-tip]'); if (el && !el.contains(e.relatedTarget)) hideTip(); });
document.addEventListener('focusin', e => { const el = e.target.closest('.v2 [data-tip]'); if (el && el.matches(':focus-visible')) showTip(el); });
document.addEventListener('focusout', hideTip);
addEventListener('scroll', hideTip, { passive:true });
/* copy feedback: write to the clipboard, flash a check, say so in a tooltip, then settle back */
function copied(btn, text, label = 'Copied to clipboard'){
  try { navigator.clipboard.writeText(text || '').catch(() => {}); } catch(e){}
  const use = btn.querySelector('use');
  const st = btn._cp || (btn._cp = { tip: btn.dataset.tip, href: use && use.getAttribute('href') });
  clearTimeout(st.t);
  if (use) use.setAttribute('href', '#v2i-check');
  btn.classList.add('copied'); btn.dataset.tip = label; showTip(btn);
  st.t = setTimeout(() => {
    if (use) use.setAttribute('href', st.href);
    btn.classList.remove('copied');
    if (st.tip === undefined) delete btn.dataset.tip; else btn.dataset.tip = st.tip;
    if (tipFor === btn) hideTip(true);
  }, 1600);
}

/* ---------- popovers: data-pop="#id" opens the element inside the same component ---------- */
let openPop = null;
// closing hands the focus back to the popover's button when it was inside, so a pick or Tab never drops it on the page; while
// it fades out it is inert, and after that hidden (CSS)
function closePops(){ if (!openPop) return; const { pop:p, btn } = openPop, back = p.contains(document.activeElement); p.classList.remove('open'); p.inert = true; btn.setAttribute('aria-expanded','false'); openPop = null; if (back && btn.isConnected) btn.focus({ preventScroll:true }); setTimeout(() => { p.inert = false; if (!p.classList.contains('open')){ p.style.left = '0px'; p.style.top = '0px'; } }, 300); }
function placePop(btn, pop){
  const host = pop.offsetParent || pop.parentElement; const hr = host.getBoundingClientRect(), br = btn.getBoundingClientRect();
  const up = btn.dataset.popPos === 'up' || (btn.dataset.popPos !== 'down' && br.bottom + pop.offsetHeight + 12 > innerHeight && br.top - pop.offsetHeight > 12);
  let x = br.left - hr.left; if (btn.dataset.popAlign === 'end') x = br.right - hr.left - pop.offsetWidth;
  const cb = (btn.closest('.comp') || document.body).getBoundingClientRect(), lo = Math.max(0, cb.left) + 8, hi = Math.min(innerWidth, cb.right) - 8;
  x = Math.max(lo - hr.left, Math.min(x, hi - hr.left - pop.offsetWidth));
  pop.style.left = x + 'px';
  pop.style.top = up ? (br.top - hr.top - pop.offsetHeight - 6) + 'px' : (br.bottom - hr.top + 6) + 'px';
  pop.style.setProperty('--origin', (up ? 'bottom ' : 'top ') + (btn.dataset.popAlign === 'end' ? 'right' : 'left'));
}
document.addEventListener('click', e => {
  const btn = e.target.closest('.v2 [data-pop]');
  if (btn){
    const scope = btn.closest('.stage-in') || document; const pop = $(btn.dataset.pop, scope); if (!pop) return;
    // Enter or Space on the button of a menu the demo has open takes it over, with the focus on its first item; otherwise
    // the button closes its open popover
    if (openPop && openPop.pop === pop){ if (e.isTrusted && !e.detail && !openPop.mine && isMenu(pop)){ openPop.mine = true; popFocus(pop, 'first'); return; } closePops(); return; }
    // a demo in another card never closes a popover the visitor has open
    if (!e.isTrusted && openPop && openPop.mine && !openPop.pop.closest('.comp').contains(btn)) return;
    closePops(); hideTip(); placePop(btn, pop); pop.inert = false; pop.classList.add('open'); btn.setAttribute('aria-expanded','true'); openPop = { pop, btn, mine:e.isTrusted };
    // opened with Enter or Space (a real click with no pointer), a menu takes the focus on its picked item, or its first
    if (e.isTrusted && !e.detail) popFocus(pop, 'first');
    return;
  }
  /* a demo clicking inside its own card must not close another card's open popover, nor one the visitor opened */
  const near = openPop && (e.isTrusted || (!openPop.mine && openPop.pop.closest('.comp').contains(e.target)));
  if (openPop && !openPop.pop.contains(e.target)){ if (near) closePops(); }
  else if (openPop && e.target.closest('[data-close]')) setTimeout(closePops, 120);
});
/* Escape shuts the open popover, before anything inside gets the key, and the focus goes back to its button when it was
   in the popover. Pressing it is the visitor's own doing, so the component's demo stops there */
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape' || !openPop) return;
  const { pop, btn } = openPop, back = pop.contains(document.activeElement), card = pop.closest('.comp');
  if (e.isTrusted && card && card._c) card._c.mine = true;
  // one Escape closes one thing: the popover, not also the panel or list it opened from
  if (back || document.activeElement === btn) e.stopPropagation();
  closePops(); if (back && btn.isConnected) btn.focus({ preventScroll:true });
}, true);
// a real resize closes the open popover; the page's own resize events (a card's layout settling) leave it open
addEventListener('resize', e => { if (e.isTrusted) closePops(); });
/* the keyboard in a popover menu, the WAI-ARIA menu button pattern: Enter, Space or the down arrow on its button opens it with
   the focus on the picked item or the first (the up arrow, on the last); up and down move through the items and wrap at the
   ends (left and right too, in a grid like an emoji picker, where up and down move a row); Home and End go to the first and
   last; Enter or Space picks; Tab closes it and moves on. Escape is above. A popover that is a dialog or a form (a calendar,
   a new schedule) leaves the focus to its component */
const isMenu = pop => /^(menu|listbox)$/.test(pop.getAttribute('role') || '');
const popItems = pop => $$('button,[role^="menuitem"],[role="option"]', pop).filter(el => !el.disabled && el.getAttribute('aria-disabled') !== 'true' && el.getClientRects().length && !el.closest('[hidden]'));
function popFocus(pop, where){
  if (!isMenu(pop)) return;
  const it = popItems(pop), on = it.find(x => x.getAttribute('aria-checked') === 'true' || x.getAttribute('aria-selected') === 'true');
  const to = where === 'last' ? it[it.length - 1] : on || it[0]; if (to) to.focus({ preventScroll:true });
}
function popStep(items, el, key){
  const n = items.length, i = items.indexOf(el); if (!n) return null;
  if (key === 'Home') return items[0]; if (key === 'End') return items[n - 1];
  const top = items[0].getBoundingClientRect().top, cols = items.filter(x => Math.abs(x.getBoundingClientRect().top - top) < 2).length, grid = cols > 1 && cols < n;
  const d = { ArrowDown:grid ? cols : 1, ArrowUp:grid ? -cols : -1, ArrowRight:grid || cols === n ? 1 : 0, ArrowLeft:grid || cols === n ? -1 : 0 }[key];
  if (!d) return null;
  if (i < 0) return d > 0 ? items[0] : items[n - 1];
  return items[((i + d) % n + n) % n];
}
document.addEventListener('keydown', e => {
  if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
  const k = e.key, t = e.target;
  const btn = t.closest && t.closest('[data-pop]');
  if (btn && (k === 'ArrowDown' || k === 'ArrowUp')){
    const pop = $(btn.dataset.pop, btn.closest('.stage-in') || document); if (!pop || !isMenu(pop)) return;
    e.preventDefault();
    if (!(openPop && openPop.pop === pop)) btn.click();
    if (openPop && openPop.pop === pop) openPop.mine = true;
    popFocus(pop, k === 'ArrowUp' ? 'last' : 'first');
    return;
  }
  if (!openPop || !openPop.pop.contains(t) || !isMenu(openPop.pop)) return;
  if (k === 'Tab'){ openPop.btn.focus({ preventScroll:true }); closePops(); return; }
  // a field in a menu (a search, a web address) keeps its own keys
  if (/^(INPUT|TEXTAREA)$/.test(t.tagName) || t.isContentEditable) return;
  const to = popStep(popItems(openPop.pop), document.activeElement, k);
  if (to){ e.preventDefault(); $$('.hl', openPop.pop).forEach(x => x.classList.remove('hl')); to.focus({ preventScroll:true }); }
});

/* ---------- touch: tap areas that never overlap ----------
   On a touch screen every control has a clear tap area of at least 40px square around it (the @media (pointer:coarse) block
   in the CSS, which marks it --dm-hit). Where two controls sit closer than that, their areas shrink towards the gap between
   them, each to half of it, so they meet halfway and a tap always lands on the control nearest to it; next to a field, which
   has no area of its own, a control can take the whole gap. The areas on screen are fitted again, a few times a second at
   most, as the page scrolls, resizes or changes. Nothing runs with a mouse */
const fitHits = window.dmFitHits || (() => {
  const CTRL = 'button,a[href],summary,label,input:not([type="hidden"]),select,textarea,[contenteditable="true"],[role="button"],[role="switch"],[role="checkbox"],[role="radio"],[role="tab"],[role="option"],[role="menuitem"],[role="menuitemradio"],[role="menuitemcheckbox"],[role="slider"]';
  const MIN = 40, coarse = matchMedia('(pointer:coarse)'), seen = new WeakMap();
  // whether a control has a tap area (and so can grow), read once per class
  const grows = el => { const k = (el.getAttribute('class') || '') + '|' + (el.getAttribute('role') || ''), s = seen.get(el);
    if (s && s.k === k) return s.v;
    const v = ['::before', '::after'].some(w => getComputedStyle(el, w).getPropertyValue('--dm-hit').trim() === '1'); seen.set(el, { k, v }); return v; };
  function fit(){
    q = 0; last = performance.now(); if (!coarse.matches) return;
    const H = innerHeight, on = [];
    for (const el of document.querySelectorAll(CTRL)){
      const r = el.getBoundingClientRect(); if (!r.width || !r.height || r.bottom < -80 || r.top > H + 80) continue;
      // a control that isn't drawn (in a closed <details>, under visibility:hidden) neither grows nor stands in the way
      if (el.checkVisibility && !el.checkVisibility({ visibilityProperty:true })) continue;
      const g = grows(el); on.push({ el, r, g, x:g ? Math.max(0, (MIN - r.width) / 2) : 0, y:g ? Math.max(0, (MIN - r.height) / 2) : 0 });
    }
    for (const a of on){
      if (!a.g) continue;
      let ex = a.x, ey = a.y;
      if (ex || ey) for (const b of on){
        if (b === a || a.el.contains(b.el) || b.el.contains(a.el)) continue;
        const gx = Math.max(b.r.left - a.r.right, a.r.left - b.r.right), gy = Math.max(b.r.top - a.r.bottom, a.r.top - b.r.bottom);
        if ((gx < 0 && gy < 0) || gx >= ex + b.x || gy >= ey + b.y) continue;
        const part = (gap, other) => Math.max(0, other ? gap / 2 : gap);
        if (gy < 0 || (gx >= 0 && gx >= gy)) ex = Math.min(ex, part(gx, b.x)); else ey = Math.min(ey, part(gy, b.y));
      }
      const w = ex < a.x ? Math.round(a.r.width + 2 * ex) + 'px' : '', h = ey < a.y ? Math.round(a.r.height + 2 * ey) + 'px' : '';
      if (a.el.style.getPropertyValue('--hit-w') !== w) w ? a.el.style.setProperty('--hit-w', w) : a.el.style.removeProperty('--hit-w');
      if (a.el.style.getPropertyValue('--hit-h') !== h) h ? a.el.style.setProperty('--hit-h', h) : a.el.style.removeProperty('--hit-h');
    }
  }
  let q = 0, last = -1e9, started = false;
  const queue = () => { if (!q) q = setTimeout(() => requestAnimationFrame(fit), Math.max(16, 150 - (performance.now() - last))); };
  const start = () => {
    if (started || !coarse.matches) return; started = true;
    addEventListener('scroll', queue, { passive:true, capture:true }); addEventListener('resize', queue);
    new MutationObserver(queue).observe(document.documentElement, { childList:true, subtree:true, attributes:true, attributeFilter:['class', 'hidden', 'open', 'aria-expanded', 'aria-checked', 'aria-pressed', 'aria-selected'] });
    queue();
  };
  start(); if (coarse.addEventListener) coarse.addEventListener('change', start);
  window.dmFitHits = fit; return fit;
})();



/* ---------- Live answer ---------- */
DM.def('live-answer', (r, c) => {
  const A = $('.lva-a', r);
  const srcs = { 1:'Funnel data, last 30 days', 2:'Session notes from 8 interviews', 3:'Onboarding.fig, step 2' };
  const S = [[1,'F','#7a5af8','Funnel data','Amplitude, last 30 days'],[2,'N','#0ea5a4','Session notes','Notion, 8 interviews'],[3,'S','#f97316','Onboarding.fig','Figma, step 2']];
  const T = {
    '': 'Most people leave at the workspace step [1]. It asks for a team name before anyone has made anything, and five of eight people in interviews paused there [2]. Moving it after the first project, and filling the name from the email domain, should help [3].',
    'Show the drop-off by device': 'On mobile the workspace step loses 41% [1], on desktop 23% [1]. Most of the mobile drop comes from the keyboard covering the Continue button [3].',
    'Draft a fix for the workspace step': 'Ask for the team name after the first project, and fill it from the email domain so most people never type it [2]. On mobile, keep Continue above the keyboard [3], then compare the step again after a week [1].'
  };
  const steps = ['Read the funnel for the last 30 days','Matched the drop to the interview notes','Checked step 2 in Onboarding.fig'];
  /* each answer streams into its own turn, so follow-ups add to the thread instead of replacing it */
  async function answer(q, turn){
    if (turn._busy) return; turn._busy = true; turn.innerHTML = '';
    const th = html(`<div class="lva-th"><span class="think on" style="color:var(--fg2)"><i></i><i></i><i></i><i></i></span><span class="shim">Thinking</span></div>`);
    turn.appendChild(th); enter(th);
    await c.wait(1300);
    const tb = html(`<button class="lva-th lva-tb" aria-expanded="false"><span>${steps.length} steps · 2s</span>${I('chev-d','xs')}</button>`);
    const tl = html(`<div class="fold shut lva-tl"><div><ul class="lva-tlist">${steps.map(x => `<li>${x}</li>`).join('')}</ul></div></div>`);
    th.replaceWith(tb); tb.after(tl);
    tb.onclick = () => { const s = tl.classList.toggle('shut'); tb.setAttribute('aria-expanded', !s); };
    const p = html('<p class="lva-p"></p>'); turn.appendChild(p);
    for (const tok of T[q].split(' ')){
      const m = tok.match(/^\[(\d)\](.*)$/);
      const prev = p.lastElementChild;
      if (m && prev){ prev.textContent = prev.textContent.replace(/ $/, ''); prev.style.whiteSpace = 'nowrap'; prev.insertAdjacentHTML('beforeend', `<span class="cite" data-tip="${srcs[m[1]]}">${m[1]}</span>${m[2]} `); }
      else p.insertAdjacentHTML('beforeend', `<span class="w">${tok} </span>`);
      await c.wait(55 + Math.random() * 45);
    }
    const src = html(`<div class="lva-src"><span class="lva-acts"><button class="ib" aria-label="Copy" data-tip="Copy">${I('copy')}</button><button class="ib" aria-label="Good answer" data-tip="Good answer">${I('up-thumb')}</button><button class="ib" aria-label="Bad answer" data-tip="Bad answer">${I('down-thumb')}</button><button class="ib" aria-label="Try again" data-tip="Try again">${I('refresh')}</button></span><button class="lva-sb" aria-expanded="false"><span class="lva-fav">${S.map(x => `<span style="background-color:${x[2]}">${x[1]}</span>`).join('')}</span>3 sources${I('chev-d','xs')}</button></div>`);
    const ls = html(`<div class="fold shut lva-ls"><div><div class="lva-ll">${S.map(x => `<button class="lva-s" data-n="${x[0]}"><span class="n">${x[0]}</span><span class="t">${x[3]}</span><span class="d">${x[4]}</span>${I('ext','xs')}</button>`).join('')}</div></div></div>`);
    turn.appendChild(src); turn.appendChild(ls); enter(src);
    const sb = $('.lva-sb', src), open = o => { ls.classList.toggle('shut', !o); sb.setAttribute('aria-expanded', o); };
    sb.onclick = () => open(ls.classList.contains('shut'));
    /* hover previews a source, a click pins it until the next click */
    let pin = '';
    const hl = n => { $$('.cite', p).forEach(x => x.classList.toggle('on', x.textContent === n)); $$('.lva-s', ls).forEach(x => x.classList.toggle('on', x.dataset.n === n)); };
    const pick = n => { pin = pin === n ? '' : n; if (pin) open(true); hl(pin); };
    $$('.lva-s', ls).forEach(x => { x.onmouseenter = () => hl(x.dataset.n); x.onmouseleave = () => hl(pin); x.onclick = () => pick(x.dataset.n); });
    $$('.cite', p).forEach(x => { x.style.cursor = 'pointer'; x.onmouseenter = () => hl(x.textContent); x.onmouseleave = () => hl(pin); x.onclick = () => pick(x.textContent); });
    const acts = $$('.lva-acts .ib', src);
    acts[0].onclick = () => { const cl = p.cloneNode(true); $$('.cite', cl).forEach(x => x.remove()); copied(acts[0], cl.textContent.replace(/\s+/g, ' ').trim()); };
    [1, 2].forEach(i => acts[i].onclick = () => { const on = !acts[i].classList.contains('on'); acts[1].classList.remove('on'); acts[2].classList.remove('on'); acts[i].classList.toggle('on', on); });
    acts[3].onclick = () => c.run(() => answer(q, turn));
    turn._busy = false;
    if (!q && !A.querySelector('.lva-q.fu')){
      const fu = html(`<div class="lva-fu"><button>${I('chev-r','xs')}Show the drop-off by device</button><button>${I('chev-r','xs')}Draft a fix for the workspace step</button></div>`);
      turn.appendChild(fu); stagger($$('button', fu), 90);
      $$('button', fu).forEach(b => b.onclick = () => {
        const t = b.textContent; fu.remove();
        const bub = html(`<div class="lva-q fu"><div class="bub">${t}</div></div>`), next = html('<div class="lva-turn"></div>');
        A.append(bub, next); enter(bub);
        c.run(async () => { await c.wait(450); await answer(t, next); });
      });
    }
  }
  const first = html('<div class="lva-turn"></div>'); A.appendChild(first);
  c.run(() => answer('', first));
});
/* ---------- Thread panel ---------- */
DM.def('thread-panel', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{up}', I('up'));
  const T = [
    { t:'Onboarding', col:'var(--ok-mark)', msgs:[['u','Why is the workspace step losing people?'],['a','It asks for a team name before anyone has made anything. Moving it after the first project, with the name filled from the email domain, should help.', ['Funnel data','Session notes']]] },
    { t:'Tokens', col:'var(--warn-mark)', msgs:[['u','Which colours are still hard-coded?'],['a','Eleven, mostly greys in Button and Card. I can swap them for tokens in one pass.', ['tokens.ts']]] },
    { t:'Launch email', col:'var(--faint)', msgs:[['u','Draft the launch email for Friday.'],['a','Two subject lines are ready. The shorter one tested better with the team.', []]] }
  ];
  let cur = 0;
  const tabs = $('.thp-tabs', r), body = $('.thp-body', r), field = $('.thp-field', r), send = $('.thp-send', r);
  tabs.innerHTML = T.map((t, i) => `<button class="thp-tab" role="tab" aria-selected="${i === 0}"><span class="dot" style="color:${t.col}"></span>${t.t}</button>`).join('') + '<span class="thp-ink"></span>';
  const ink = $('.thp-ink', r), tbs = $$('.thp-tab', r);
  const place = () => { const b = tbs[cur]; ink.style.left = b.offsetLeft + 10 + 'px'; ink.style.width = b.offsetWidth - 20 + 'px'; };
  const msg = (m, anim) => { const el = m[0] === 'u' ? html(`<div class="bub">${m[1]}</div>`) : html(`<div class="thp-ag">${m[2] && m[2].length ? `<div class="src">${m[2].map(s => `<button class="fchip lnk" data-tip="${({ 'Funnel data':'Amplitude, last 30 days', 'Session notes':'Notion, 8 interviews', 'tokens.ts':'src/styles/tokens.ts' })[s] || s}">${I('file-text','xs')}${s}</button>`).join('')}</div>` : ''}${m[1]}</div>`); body.appendChild(el); if (anim){ enter(el); body.scrollTo({ top:body.scrollHeight, behavior:REDUCE ? 'auto' : 'smooth' }); } else body.scrollTop = body.scrollHeight; return el; };
  function show(i){ cur = i; tbs.forEach((b, k) => b.setAttribute('aria-selected', k === i)); place(); body.innerHTML = ''; T[i].msgs.forEach((m, k) => { const el = msg(m); enter(el, k * 70); }); }
  tbs.forEach((b, i) => b.onclick = () => show(i));
  field.oninput = () => { send.disabled = !field.value.trim(); };
  $('.thp-in', r).onsubmit = e => { e.preventDefault(); const v = field.value.trim(); if (!v) return; field.value = ''; send.disabled = true;
    const m = ['u', v]; T[cur].msgs.push(m); msg(m, true);
    const th = html('<div class="thp-ag"><span class="shim">Thinking</span></div>'); body.appendChild(th); enter(th);
    const k = cur; c.later(1400, () => { th.remove(); const a = ['a', 'On it. I\'ll update this thread when it\'s done.', []]; T[k].msgs.push(a); if (cur === k) msg(a, true); });
  };
  requestAnimationFrame(() => show(0)); new ResizeObserver(place).observe(tabs);
  // once the card has settled, a reply is typed and sent in place, unless someone has started using it
  // the preview asks a follow-up by itself; clicking, focusing or typing in it takes over, and what it had typed goes
  c.run(async () => {
    await c.step(1800);
    await c.type(field, 'Can you make that change now?', { ms:() => 32 + Math.random() * 40, each:() => { send.disabled = !field.value.trim(); }, keep:true });
    await c.step(380); $('.thp-in', r).requestSubmit();
  });
});
/* ---------- Thread panel designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and Deck and Focus are two
   directions under review. Picking one draws it where the component sits and plays its demo from the start, as Animate does.
   The switch is the card's alone: inside another component the thread panel is Classic, and the registry, the code view and
   the component page install Classic (build.js leaves the switch out of them) */
{
  const classic = DM.defs['thread-panel'];
  // the threads both directions show: each agent has an avatar colour (av), an icon, and a state: working, waiting for you
  // (ask) or done
  const THP = () => [
    { t:'Onboarding', ag:'Research agent', ic:'search', av:'b', s:'done', pv:'Moving the team step should help',
      msgs:[['u', 'Why are people leaving at the workspace step?'], ['a', 'It asks for a team name before anyone has made anything. Moving it after the first project, with the name taken from the email domain, should help.', [['chart', 'Funnel, 30 days'], ['@notion', 'Interview notes']]]] },
    { t:'Colour tokens', ag:'Design agent', ic:'palette', av:'l', s:'work', pv:'Swapping greys for tokens',
      msgs:[['u', 'Which colours are still hard-coded?'], ['a', 'Eleven, mostly greys in Button and Card. I am swapping them for tokens now.', [['@figma', 'Components'], ['code', 'tokens.css']]]],
      done:'All eleven use tokens now, and the Card border matches the library.', src:[['@github', 'PR #418']] },
    { t:'Launch email', ag:'Copy agent', ic:'mail', av:'p', s:'ask', pv:'Which subject line?',
      msgs:[['u', 'Draft the launch email for Friday.'], ['a', 'Two subject lines are ready. Which one should go to the team as a test?', [], ['Ship faster with tokens', 'Your design system, now in code']]] }
  ];
  const vars = t => `--a:var(--av-${t.av});--ai:var(--av-${t.av}-ink)`;
  // an agent's avatar; given a state, it carries the dot that shows it
  const av = (t, s) => `<span class="tpx-av"${s ? ` data-s="${s}"` : ''} aria-hidden="true">${I(t.ic)}${s ? '<i class="tpx-st"></i>' : ''}</span>`;
  const chip = ([ic, n]) => `<button class="fchip lnk" type="button" data-tip="${n}">${ic[0] === '@' ? BRAND[ic.slice(1)] : I(ic, 'xs')}${n}</button>`;
  // one message: yours as a bubble, the agent's as text with its sources, and the choices it offers
  function msg(t, m){
    if (m[0] === 'u') return html(`<div class="bub">${m[1]}</div>`);
    const opts = m[3] ? `<div class="tpx-opts">${m[3].map((o, i) => `<button class="tpx-opt" type="button" aria-pressed="false" data-o="${i}"><span class="k">${'AB'[i]}</span>${o}</button>`).join('')}</div>` : '';
    return html(`<div class="tpx-a"><span class="tpx-who">${av(t)}${t.ag}</span><div>${m[1]}</div>${m[2] && m[2].length ? `<div class="tpx-src">${m[2].map(chip).join('')}</div>` : ''}${opts}</div>`);
  }
  // the agent answers: three dots, then its words as they come, two at a time
  async function stream(c, t, body, text, src, scroll){
    const el = html(`<div class="tpx-a tpx-new"><span class="tpx-who">${av(t)}${t.ag}</span><div><span class="tpx-dots" aria-label="Writing"><i></i><i></i><i></i></span></div></div>`);
    body.appendChild(el); scroll();
    await c.wait(1100);
    const out = $('div', el), w = text.split(' '); let n = 0;
    out.innerHTML = '<span class="tx"></span><span class="tpx-caret"></span>';
    const tx = $('.tx', out);
    while (n < w.length){ n = Math.min(w.length, n + 2); tx.textContent = w.slice(0, n).join(' '); await c.wait(110); }
    $('.tpx-caret', out).remove();
    if (src && src.length){ const s = html(`<div class="tpx-src">${src.map(chip).join('')}</div>`); el.appendChild(s); enter(s); }
    scroll();
    return el;
  }
  // a reply field: Send wakes with text in it, and Enter sends
  function field(r, onSend){
    const form = $('.tpx-in', r), f = $('.tpx-field', form), b = $('.tpx-send', form);
    f.oninput = () => { b.disabled = !f.value.trim(); };
    form.onsubmit = e => { e.preventDefault(); const v = f.value.trim(); if (!v) return; f.value = ''; b.disabled = true; onSend(v); };
  }
  const replyField = label => `<form class="tpx-in"><input class="tpx-field" aria-label="${label}" placeholder="Reply to the agent" autocomplete="off"><button class="tpx-send" type="submit" aria-label="Send" data-tip="Send" data-tip-k="↵" disabled>${I('up')}</button></form>`;

  /* Deck: the threads as a stack of cards. Tap one behind to bring it to the front, or swipe the front one away */
  const DECK = () => `<div class="thp tpb" data-d="deck">
  <div class="tpb-deck"></div>
  <div class="tpb-nav">
    <button class="ib tpb-prev" type="button" aria-label="Previous thread" data-tip="Previous" data-tip-k="←">${I('chev-l')}</button>
    <div class="tpb-dots" role="tablist" aria-label="Threads"></div>
    <button class="ib tpb-next" type="button" aria-label="Next thread" data-tip="Next" data-tip-k="→">${I('chev-r')}</button>
  </div>
</div>`;
  function deck(r, c){
    const T = THP(), deck = $('.tpb-deck', r), dots = $('.tpb-dots', r);
    // the order of the cards, front first: the design agent's thread is on top
    let order = [1, 2, 0];
    const tagOf = t => t.s === 'work' ? '<span class="tag tpb-tag"><span class="spin"></span>Working</span>' : t.s === 'ask' ? '<span class="tag warn tpb-tag">Needs you</span>' : `<span class="tag ok tpb-tag">${I('check','xs')}Done</span>`;
    T.forEach((t, i) => {
      t.el = html(`<article class="tpb-card" style="${vars(t)}" aria-label="${t.t}"><div class="tpb-ch">${av(t, t.s)}<div class="tpb-ct"><b>${t.t}</b><span>${t.ag}</span></div><span class="tg">${tagOf(t)}</span></div><div class="tpb-body tpx-scroll" aria-live="polite"></div>${replyField('Reply to ' + t.ag)}</article>`);
      t.body = $('.tpb-body', t.el); t.msgs.forEach(m => t.body.appendChild(msg(t, m))); deck.appendChild(t.el);
      t.dot = html(`<button class="tpb-dot" type="button" role="tab" aria-label="${t.t}"><i></i></button>`); dots.appendChild(t.dot);
      t.dot.onclick = () => front(i);
      // a card behind comes forward when you press its strip
      t.el.addEventListener('click', e => { if (order[0] !== i){ e.preventDefault(); front(i); } }, true);
      field(t.el, v => answer(t, v, 'On it. I will post here when it is done.'));
      wire(t);
    });
    // a card behind keeps its strip for the pointer to press; what is under the strip, and its reply field, wait until it is
    // in front
    const lay = () => {
      order.forEach((i, z) => { const el = T[i].el, back = z > 0; el.style.setProperty('--z', z); el.dataset.z = z; [$('.tpb-body', el), $('.tpx-in', el)].forEach(x => { x.inert = back; x.setAttribute('aria-hidden', String(back)); }); });
      T.forEach((t, i) => { t.dot.setAttribute('aria-selected', String(order[0] === i)); t.dot.tabIndex = order[0] === i ? 0 : -1; });
    };
    // the card you pick comes to the front in one move; the rest move back a place, in their order
    function front(i){
      if (order[0] === i) return;
      order = [i, ...order.filter(x => x !== i)]; lay();
    }
    const ring = [1, 2, 0], step = d => { const n = T.length, k = ring.indexOf(order[0]); front(ring[(k + d + n) % n]); };
    $('.tpb-prev', r).onclick = () => step(-1); $('.tpb-next', r).onclick = () => step(1);
    c.on(dots, 'keydown', e => { if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return; e.preventDefault(); step(e.key === 'ArrowRight' ? 1 : -1); requestAnimationFrame(() => T[order[0]].dot.focus()); });
    c.on(deck, 'keydown', e => { if (e.target.closest('.tpx-in')) return; if (e.key === 'ArrowLeft' || e.key === 'ArrowRight'){ e.preventDefault(); step(e.key === 'ArrowRight' ? 1 : -1); } });
    // swipe the front card sideways to send it to the back
    let drag = null;
    c.on(deck, 'pointerdown', e => { const el = T[order[0]].el; if (!el.contains(e.target) || e.target.closest('button,input,a')) return; drag = { x:e.clientX, el, dx:0, id:e.pointerId }; });
    c.on(deck, 'pointermove', e => { if (!drag) return; drag.dx = e.clientX - drag.x; if (Math.abs(drag.dx) > 4 && !drag.on){ drag.on = true; drag.el.classList.add('drag'); drag.el.setPointerCapture(drag.id); } if (drag.on) drag.el.style.transform = `translateX(${drag.dx}px) rotate(${drag.dx * .03}deg)`; });
    const up = () => { if (!drag) return; const { el, dx, on } = drag; drag = null; if (!on) return; el.classList.remove('drag'); el.style.transform = '';
      if (Math.abs(dx) > 70){ order = [...order.slice(1), order[0]]; lay(); } };
    c.on(deck, 'pointerup', up); c.on(deck, 'pointercancel', up);
    function retag(t){ $('.tpb-ch .tpx-av', t.el).dataset.s = t.s; const g = $('.tg', t.el); g.innerHTML = tagOf(t); enter(g.firstElementChild); }
    const scrollOf = t => () => t.body.scrollTo({ top:t.body.scrollHeight, behavior:REDUCE ? 'auto' : 'smooth' });
    async function answer(t, text, ans, src){
      const u = msg(t, ['u', text]); u.classList.add('tpx-new'); t.body.appendChild(u); scrollOf(t)();
      t.s = 'work'; retag(t);
      await stream(c, t, t.body, ans, src, scrollOf(t));
      t.s = 'done'; retag(t);
    }
    // a question with choices: picking one answers it
    function wire(t){
      $$('.tpx-opt', t.body).forEach(b => b.onclick = () => {
        const g = $('.tpx-opts', t.body); if (g.classList.contains('done')) return;
        $$('.tpx-opt', t.body).forEach(x => { x.setAttribute('aria-pressed', String(x === b)); if (x !== b) x.setAttribute('aria-disabled', 'true'); }); g.classList.add('done');
        answer(t, `Send “${b.textContent.slice(1)}”`, 'Sent to the team as a test. I will tell you how it does by Thursday.');
      });
    }
    lay(); T.forEach(t => { t.body.scrollTop = t.body.scrollHeight; });
    // the design agent finishes on the front card; the copy agent's card behind nudges, since it needs you
    c.run(async () => {
      await c.wait(1800);
      const t = T[1]; await stream(c, t, t.body, t.done, t.src, scrollOf(t)); t.s = 'done'; retag(t);
      await c.wait(900); const e = T[2]; if (order[0] !== 2){ e.el.classList.remove('nudge'); void e.el.offsetWidth; e.el.classList.add('nudge'); }
    });
    // the person in the demo: brings the copy agent's card forward, answers its question, then moves on to the next thread
    c.story(async s => {
      await s.until(() => T[1].s === 'done'); await s.beat(3);
      await s.tap($('.tpb-ch', T[2].el)); s.away(); await s.beat(3);
      await s.tap($('.tpx-opt', T[2].body)); s.away();
      await s.until(() => T[2].s === 'done'); await s.beat(3);
      await s.tap($('.tpb-next', r)); s.away(); await s.beat(3);
    });
  }

  /* Focus: one thread at a time, with the agent's work live in it, one-tap replies, and a switcher that flags the threads
     waiting for you */
  const FOCUS = () => `<div class="thp tpc panel keep" data-d="focus">
  <div class="tpc-h">
    <button class="tpc-sw" type="button" data-pop=".tpc-menu" aria-haspopup="menu" aria-expanded="false"><span class="tpx-av tpc-av" aria-hidden="true"></span><span class="tpc-swt"><b></b><span></span></span><span class="tag warn tpc-nd" hidden></span>${I('unfold','xs')}</button>
    <span class="tag tpc-pill"><span class="dot tpc-pd"></span><span class="tpc-pt num">Working</span></span>
  </div>
  <div class="pop tpc-menu" role="menu" aria-label="Threads"></div>
  <div class="tpc-body tpx-scroll" aria-live="polite"></div>
  <div class="tpc-qr" role="group" aria-label="Quick replies"></div>
  ${replyField('Reply')}
</div>`;
  function focus(r, c){
    const T = THP(), root = $('.tpc', r), sw = $('.tpc-sw', r), menu = $('.tpc-menu', r), body = $('.tpc-body', r), qr = $('.tpc-qr', r), pt = $('.tpc-pt', r), nd = $('.tpc-nd', r), hav = $('.tpc-av', sw);
    let cur = 1, T0 = 0, ticking = true;
    const Q = { 1:['Do the borders too', 'Open a pull request', 'Show me the diff'], 2:['Use the first one', 'Make both shorter'], 0:['Write it up for the team', 'What else drops off?'] };
    const A = { 'Do the borders too':'Borders are next: four of them, all in Card and Input.', 'Open a pull request':'Opened it on GitHub, with the eleven swaps and a before and after.', 'Show me the diff':'Eleven lines changed, each a grey swapped for its token.', 'Use the first one':'Sent “Ship faster with tokens” to the team as a test.', 'Make both shorter':'Done: “Ship faster” and “Tokens, now in code”.', 'Write it up for the team':'Drafted in Notion, with the funnel and three quotes.', 'What else drops off?':'The invite step loses 9%. People skip it, then never come back to it.' };
    function menuPaint(){
      menu.innerHTML = '<div class="ph">Threads</div>' + T.map((t, i) => `<button class="mi" type="button" role="menuitemradio" aria-checked="${i === cur}" data-i="${i}" style="${vars(t)}">${av(t, t.s)}<span class="mi-t"><b>${t.t}</b><span>${t.s === 'work' ? 'Working' : t.s === 'ask' ? 'Waiting for you' : t.pv}</span></span>${t.s === 'ask' ? '<span class="tag warn tg">Needs you</span>' : ''}</button>`).join('');
      $$('.mi', menu).forEach(b => b.onclick = () => { show(+b.dataset.i); closePops(); });
      const n = T.filter((t, i) => i !== cur && t.s === 'ask').length; nd.hidden = !n; nd.textContent = n; sw.setAttribute('aria-label', `${T[cur].t}, switch thread${n ? `, ${n} waiting for you` : ''}`);
    }
    const clock = () => `Working · 0:${String(Math.floor(T0)).padStart(2, '0')}`;
    function head(){
      const t = T[cur]; root.style.cssText = vars(t); root.dataset.s = t.s;
      hav.innerHTML = I(t.ic) + '<i class="tpx-st"></i>'; hav.dataset.s = t.s; $('.tpc-swt b', sw).textContent = t.t; $('.tpc-swt span', sw).textContent = t.ag;
      pt.textContent = t.s === 'work' ? clock() : t.s === 'ask' ? 'Needs you' : 'Done';
      menuPaint();
    }
    const scroll = () => body.scrollTo({ top:body.scrollHeight, behavior:REDUCE ? 'auto' : 'smooth' });
    function quick(){
      qr.innerHTML = (Q[cur] || []).map(q => `<button class="chip tpc-q" type="button">${I('send','xs')}${q}</button>`).join('');
      $$('.tpc-q', qr).forEach((b, i) => { b.style.animationDelay = i * 60 + 'ms'; b.onclick = () => send(b.textContent); });
    }
    function show(i){
      const was = cur; cur = i; const t = T[i];
      head(); body.innerHTML = '';
      t.msgs.forEach(m => body.appendChild(m[0] === 'n' ? m[1] : msg(t, m)));
      $$('.tpx-opt', body).forEach(b => b.onclick = () => send(b.textContent.slice(1)));
      quick();
      if (was !== i){ body.classList.remove('in'); void body.offsetWidth; body.classList.add('in'); sw.classList.remove('in'); void sw.offsetWidth; sw.classList.add('in'); }
      body.scrollTop = body.scrollHeight;
    }
    async function send(text){
      const k = cur, t = T[k]; t.msgs.push(['u', text]);
      const u = msg(t, ['u', text]); u.classList.add('tpx-new'); body.appendChild(u); scroll();
      qr.innerHTML = ''; t.s = 'work'; head();
      const host = document.createElement('div'); host.style.display = 'contents'; if (cur === k) body.appendChild(host);
      const el = await stream(c, t, host, A[text] || 'On it. I will post here when it is done.', null, () => { if (cur === k) scroll(); });
      host.replaceWith(el); t.msgs.push(['n', el]);
      if (text === 'Open a pull request'){ const pr = html(`<button class="tpc-pr tpx-new" type="button" data-tip="Open on GitHub">${BRAND.github}<span class="tpc-prt"><b>#418 Use colour tokens</b><span>design/tokens into main</span></span><span class="tag ok">Ready</span></button>`); if (cur === k){ body.appendChild(pr); scroll(); } t.msgs.push(['n', pr]); }
      t.s = 'done'; Q[k] = (Q[k] || []).filter(q => q !== text).slice(0, 2); if (cur === k){ head(); quick(); }
    }
    field(r, v => send(v));
    // the design agent's task, live in its thread
    const parts = [['Button', 4], ['Card', 3], ['Input', 4]];
    const work = html(`<div class="tpc-work tpx-new" data-s="run"><div class="tpc-wh">${BRAND.figma}<b>Swapping greys for tokens</b><span class="num">0 of 11</span></div><div class="tpc-bar"><i></i></div><ul class="tpc-steps">${parts.map(p => `<li><span class="g"><span class="dot"></span></span>${p[0]}, ${p[1]} greys</li>`).join('')}</ul></div>`);
    T[1].msgs.push(['n', work]);
    show(1);
    // the working time ticks on the status tag, once a second
    c.every(100, () => { if (T[1].s === 'work' && ticking){ T0 += .1; if (cur === 1 && Math.round(T0 * 10) % 10 === 0) pt.textContent = clock(); } });
    c.run(async () => {
      await c.wait(900);
      const lis = $$('li', work), n = $('.num', work), bar = $('.tpc-bar i', work); let k = 0;
      for (let i = 0; i < parts.length; i++){
        lis[i].className = 'run'; $('.g', lis[i]).innerHTML = '<span class="spin"></span>';
        for (let j = 0; j < parts[i][1]; j++){ await c.wait(320); k++; n.textContent = `${k} of 11`; bar.style.setProperty('--p', (k / 11).toFixed(3)); }
        lis[i].className = 'done'; $('.g', lis[i]).innerHTML = I('check','xs');
      }
      work.dataset.s = 'done'; $('b', work).textContent = 'Swapped 11 greys for tokens'; ticking = false;
      const t = T[1], el = await stream(c, t, cur === 1 ? body : document.createElement('div'), t.done, [['@figma', 'Components'], ['code', 'tokens.css']], () => { if (cur === 1) scroll(); });
      t.msgs.push(['n', el]); t.s = 'done'; if (cur === 1) head();
    });
    // the person in the demo: asks for a pull request with one tap, then switches to the thread that needs them
    c.story(async s => {
      await s.until(() => T[1].s === 'done'); await s.beat(2);
      const b = $$('.tpc-q', qr).find(x => x.textContent === 'Open a pull request'); if (b){ await s.tap(b); s.away(); }
      await s.until(() => T[1].s === 'done' && !$('.tpx-caret', body)); await s.beat(3);
      await s.tap(sw); await s.beat(2);
      const it = $('.mi[data-i="2"]', menu); if (it){ await s.tap(it); } s.away(); await s.beat(3);
      const o = $('.tpx-opt', body); if (o){ await s.tap(o); s.away(); }
      await s.until(() => T[2].s === 'done'); await s.beat(3);
    });
  }

  /* the switch: the design the card last showed (Classic to begin with) is drawn, and picking another starts the card again
     with it, as Animate does. A key that picked it leaves the focus on the switch */
  const D = { deck:[DECK, deck], focus:[FOCUS, focus] };
  const again = card => window.V2 && card.dataset.v2 ? window.V2.replay(card) : DM.mount(card);
  DM.def('thread-panel', (r, c, card) => {
    const dm = $(':scope>.thp-dm', r);
    if (!dm) return classic(r, c, card);
    if (r !== c.st || !card){ dm.replaceWith(...$(':scope>.dm-main', dm).childNodes); return classic(r, c, card); }
    const v = D[card._design] ? card._design : 'classic';
    if (v === 'classic') classic(r, c, card);
    else { const main = $(':scope>.dm-main', dm); main.innerHTML = D[v][0](); D[v][1](main, c); }
    const sg = $(':scope>.thp-dm>.demo .seg2', r);
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    seg(sg, d => { if (d === v) return; card._design = d; card._designKey = sg.contains(document.activeElement) && document.activeElement.matches(':focus-visible'); again(card); });
    if (card._designKey){ card._designKey = false; setTimeout(() => { const b = !c.dead && $('[aria-pressed="true"]', sg); if (b) b.focus({ preventScroll:true }); }, 120); }
  });
}
/* ---------- Composer ---------- */
DM.def('composer', (r, c) => {
  const icons = { clip:'clip', figma:'figma', eye:'eye', edit:'edit', list:'list', code:'code', mic:'mic', up:'up', check:'check', file:'file-text', image:'image' };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => k === 'chev' ? I('chev-d','xs') : icons[k] ? I(icons[k]) : m);
  const box = $('.cpx-box', r), ta = $('.cpx-ta', r), send = $('.cpx-bar .cpx-send', r), thread = $('.cpx-thread', r), att = $('.cpx-att', r), PH = ta.placeholder;
  const grow = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'; };
  // send waits for text or a file, and for every file to finish loading
  const sync = () => { send.disabled = (!ta.value.trim() && !att.children.length) || !!$('.fchip.ld,.fchip.err', att); grow(); };
  c.on(ta, 'input', sync);
  c.on(r, 'keydown', e => { if (e.target === ta && e.key === 'Enter' && !e.shiftKey && box.dataset.mode === 'idle'){ e.preventDefault(); submit(); } if (e.key === 'Escape' && box.dataset.mode === 'voice') stopVoice(false, true); });
  /* attachments load before they can be sent. The first Figma link can't be opened, so the error shows, and Try again fetches it */
  const ATT = { file:['file-text','Spacing notes.pdf'], figma:['figma','Pricing / Desktop'], shot:['image','Screenshot 10.42'] };
  let figmaTries = 0;
  function load(ch, kind){
    const a = ATT[kind]; ch.className = 'fchip ld'; $('.ic', ch).innerHTML = '<span class="spin"></span>'; swap($('.n', ch), a[1]); const rt = $('.rt', ch); if (rt) rt.remove(); sync();
    const fail = kind === 'figma' && figmaTries++ === 0;
    c.later(1000, () => { if (!ch.isConnected) return;
      if (fail){ ch.className = 'fchip err'; $('.ic', ch).innerHTML = I('alert','xs'); swap($('.n', ch), a[1] + " can't be opened");
        const b = html(`<button class="rt" aria-label="Try again" data-tip="Try again">${I('refresh','xs')}</button>`); $('.x', ch).before(b); b.onclick = () => load(ch, kind); }
      else { ch.className = 'fchip'; $('.ic', ch).innerHTML = I(a[0],'xs'); enter($('.ic', ch).firstElementChild); }
      sync(); });
  }
  function add(kind){
    const a = ATT[kind], ch = html(`<span class="fchip"><span class="ic" style="display:grid"></span><span class="n">${a[1]}</span><button class="x" aria-label="Remove ${a[1]}">${I('x','xs')}</button></span>`);
    att.appendChild(ch); enter(ch);
    $('.x', ch).onclick = () => { ch.classList.add('leave'); c.later(300, () => { ch.remove(); sync(); }); };
    load(ch, kind);
  }
  $$('[data-add]', r).forEach(b => b.onclick = () => add(b.dataset.add));
  /* what the agent works on, and what it may do: a menu each, the chip shows the pick */
  const pick = (menu, chip, name, key) => $$(menu + ' .mi', r).forEach(b => b.onclick = () => {
    $$(menu + ' .mi', r).forEach(x => x.setAttribute('aria-checked', x === b));
    const ch = $(chip, r); ch.firstElementChild.outerHTML = I(b.dataset.ic); swap($(name, ch), b.dataset[key]);
  });
  pick('.pp-ctx', '.cpx-ctx', '.cpx-ctx-n', 'ctx');
  pick('.pp-mode', '.cpx-mode', '.cpx-mode-n', 'mode');
  /* dictation, played from a sample because the page can't use a microphone: a red dot and a clock, the words arrive in the box */
  const said = 'Tighten the spacing on the plan cards and keep the buttons the same height';
  let before = '', vc = null;
  async function dictate(){
    if (vc) vc.stop(); vc = ctl(c); const k = vc; c.offs.push(() => k.stop());
    before = ta.value; box.dataset.mode = 'voice'; ta.value = ''; ta.placeholder = 'Listening…'; grow();
    const t0 = performance.now(), tm = $('.cpx-tm', r); tm.textContent = '0:00';
    k.every(250, () => { const s = Math.floor((performance.now() - t0) / 1000); tm.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); });
    await k.run(async () => { await k.wait(700); for (const w of said.split(' ')){ ta.value += (ta.value ? ' ' : '') + w; grow(); await k.wait(160 + Math.random() * 120); } });
  }
  function stopVoice(keep, mine){ if (vc) vc.stop(); box.dataset.mode = 'idle'; ta.placeholder = PH; if (!keep) ta.value = before; sync(); if (mine) ta.focus({ preventScroll:true }); }
  $('.cpx-mic', r).onclick = dictate;
  $('.cpx-cancel', r).onclick = () => stopVoice(false, true);
  $('.cpx-ok', r).onclick = () => stopVoice(true, true);
  /* sending: the message and its files go up into the conversation, and the agent answers in the mode picked */
  function submit(){
    if (send.disabled) return;
    const v = ta.value.trim(), files = $$('.fchip', att).map(f => $('.n', f).textContent), mode = $('.cpx-mode-n', r).textContent, ctx = $('.cpx-ctx-n', r).textContent;
    ta.value = ''; att.innerHTML = ''; sync();
    const b = html(`<div class="bub">${files.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:${v ? 6 : 0}px">${files.map(f => `<span class="fchip">${I('clip','xs')}${f}</span>`).join('')}</div>` : ''}${v.replace(/</g,'&lt;')}</div>`); thread.appendChild(b); enter(b);
    const a = html(`<div class="cpx-ag wk"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Working</span></div>`); thread.appendChild(a); enter(a);
    while (thread.children.length > 4) thread.firstElementChild.remove();
    const say = { Ask:`Looking at ${ctx}. I won't change anything.`, Edit:`On it. I'll make the changes on a new page in ${ctx}.`, Plan:`I'll write a plan for ${ctx} first, then wait for you.` }[mode];
    c.later(1700, () => { a.classList.remove('wk'); a.innerHTML = `<span>${say}</span>`; enter(a); });
  }
  send.onclick = submit;
  sync();
  // the preview's story: attach a frame that won't open, try again, write the ask, switch to Edit and send
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.tap($('.cpx-add', r)); await s.beat(3);
    await s.tap($('.pp-plus [data-add="figma"]', r)); s.away();
    await s.until(() => $('.fchip.err', att)); await s.beat(3);
    await s.tap($('.fchip.err .rt', att)); s.away();
    await s.until(() => att.children.length && !$('.fchip.ld,.fchip.err', att)); await s.beat(1);
    await s.type(ta, 'Tighten the spacing on the plan cards'.split(' ').map((w, i) => (i || ta.value ? ' ' : '') + w), { n:.3, each:sync });
    await s.beat(2);
    await s.tap($('.cpx-mode', r)); await s.beat(3);
    await s.tap($('.pp-mode [data-mode="Edit"]', r)); s.away(); await s.beat(2);
    await s.tap(send); s.away();
    await s.until(() => $('.cpx-ag', thread) && !$('.cpx-ag.wk', thread)); await s.beat(1);
  });
});
/* ---------- Rich text editor ---------- */
/* the editing engine. The text is a list of lines (paragraphs, a heading, list items and quote lines) holding bold, italic,
   inline code and links, and every change goes through it: Enter, Backspace at a line's start, formats, paste and drop, so
   pasted or browser-made markup is cleaned into those few tags. Undo and redo step through its own history. A selection is
   kept as two numbers, the characters before each end with a line break counting one, so it survives every rebuild, and the
   editor works the same with or without the focus (a story types into it without taking the focus from the page) */
function rteEngine(ed, hook = {}){
  const LEAF = 'p,h2,blockquote,li', BLOCK = /^(P|DIV|H[1-6]|LI|BLOCKQUOTE|PRE|TR|DT|DD|SECTION|ARTICLE|HEADER|FOOTER|ASIDE|MAIN|NAV|FIGURE|FIGCAPTION|UL|OL|DL|TABLE|TBODY|THEAD|TFOOT|ADDRESS|HR)$/;
  const SKIP = /^(SCRIPT|STYLE|TEMPLATE|HEAD|META|LINK|TITLE|IFRAME|OBJECT|EMBED|SVG|MATH|IMG|PICTURE|VIDEO|AUDIO|CANVAS|NOSCRIPT|BUTTON|INPUT|SELECT|TEXTAREA|OPTION)$/;
  const offs = [], on = (el, ev, fn, o) => { el.addEventListener(ev, fn, o); offs.push(() => el.removeEventListener(ev, fn, o)); };
  const lines = () => [...ed.querySelectorAll(LEAF)];
  const typeOf = b => b.tagName === 'LI' ? b.parentNode.tagName.toLowerCase() : b.tagName === 'BLOCKQUOTE' ? 'quote' : b.tagName.toLowerCase();
  const lineOf = n => { for (let x = n; x && x !== ed; x = x.parentNode) if (x.nodeType === 1 && x.matches(LEAF)) return x; return null; };
  const len = b => b.textContent.length;
  const total = () => lines().reduce((n, b, i) => n + len(b) + (i ? 1 : 0), 0);
  const startOf = i => lines().slice(0, i).reduce((n, b) => n + len(b) + 1, 0);
  const lineAt = at => { const all = lines(); let n = 0; for (let i = 0; i < all.length; i++){ if (at <= n + len(all[i])) return i; n += len(all[i]) + 1; } return all.length - 1; };
  const text = o => lines().map(b => b.textContent).join('\n').slice(o.s, o.e);
  // the nearest element of a kind around a node, inside its line
  const up = (n, tag) => { for (let x = n && n.nodeType === 3 ? n.parentNode : n; x && x !== ed && x.nodeType === 1 && !x.matches(LEAF); x = x.parentNode) if (x.tagName === tag) return x; return null; };
  const wrap = (n, tag, href) => { const w = document.createElement(tag.toLowerCase()); if (href) w.setAttribute('href', href); n.replaceWith(w); w.appendChild(n); return w; };
  const unwrap = el => el.replaceWith(...el.childNodes);

  /* ---- a point in the DOM as one number, and back ---- */
  function offsetOf(node, off){
    let b = lineOf(node);
    if (!b){
      if (!ed.contains(node)) return 0;
      // a point between lines: the start of the line after it, or the very end
      const after = node.childNodes[off], first = after && (after.nodeType === 1 ? (after.matches(LEAF) ? after : after.querySelector(LEAF)) : null);
      if (!first) return total();
      b = first; node = first; off = 0;
    }
    let n = 0; for (const x of lines()){ if (x === b) break; n += len(x) + 1; }
    const rg = document.createRange(); rg.setStart(b, 0); rg.setEnd(node, off);
    return n + rg.toString().length;
  }
  // late: where two text nodes meet, the start of the second (for the start of a range) rather than the end of the first
  function pointAt(at, late){
    const all = lines(); let n = Math.max(0, at);
    for (let i = 0; i < all.length; i++){
      const b = all[i];
      if (n <= len(b) || i === all.length - 1){
        n = Math.min(n, len(b));
        const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); let t, last = null;
        while ((t = w.nextNode())){ if (late ? n < t.data.length : n <= t.data.length) return [t, n]; n -= t.data.length; last = t; }
        return last ? [last, last.data.length] : [b, 0];
      }
      n -= len(b) + 1;
    }
    return [ed, 0];
  }
  const range = o => { const [a, ao] = pointAt(o.s, o.s !== o.e), [b, bo] = pointAt(o.e); const rg = document.createRange(); rg.setStart(a, ao); rg.setEnd(b, bo); return rg; };
  // scrolls the text, and only the text, so a part of it is in view
  function show(x){
    const r = x.getBoundingClientRect(), b = ed.getBoundingClientRect(); if (!r.height) return;
    if (r.bottom > b.bottom - 12) ed.scrollTop += Math.min(r.bottom - b.bottom + 12, r.top - b.top - 12);
    else if (r.top < b.top + 12) ed.scrollTop -= b.top + 12 - r.top;
  }

  /* ---- the selection: the browser's while the editor has the focus, otherwise the last one it had ---- */
  let caret = null;
  const live = () => { const s = getSelection(); if (!s || !s.rangeCount) return null; const g = s.getRangeAt(0); return ed.contains(g.startContainer) && ed.contains(g.endContainer) ? g : null; };
  function get(){
    const g = live();
    if (g){ const a = offsetOf(g.startContainer, g.startOffset), b = offsetOf(g.endContainer, g.endOffset); return { s:Math.min(a, b), e:Math.max(a, b) }; }
    if (!caret){ const t = total(); caret = { s:t, e:t }; }
    return { s:caret.s, e:caret.e };
  }
  function set(o, focus){
    caret = { s:o.s, e:o.e };
    if (focus && document.activeElement !== ed) ed.focus({ preventScroll:true });
    if (document.activeElement !== ed) return;
    const s = getSelection(); s.removeAllRanges(); s.addRange(range(o));
  }

  /* ---- tidying: the few tags the editor keeps, in the shape it keeps them ---- */
  function tidy(){
    for (const el of ed.querySelectorAll('b,i,code,a')){
      if (!el.isConnected) continue;
      if (!el.textContent){ el.remove(); continue; }
      // a mark inside one of its own kind adds nothing
      if (up(el.parentNode, el.tagName)) unwrap(el);
    }
    // two marks of a kind side by side become one
    for (const el of ed.querySelectorAll('b,i,code,a')){
      if (!el.isConnected) continue;
      for (;;){
        let nx = el.nextSibling;
        while (nx && nx.nodeType === 3 && !nx.data){ const d = nx; nx = nx.nextSibling; d.remove(); }
        if (!nx || nx.nodeType !== 1 || nx.tagName !== el.tagName || nx.getAttribute('href') !== el.getAttribute('href')) break;
        el.append(...nx.childNodes); nx.remove();
      }
    }
    // an empty line keeps one <br> so it has a height and a caret; a line with text needs none
    for (const b of lines()){ const br = [...b.querySelectorAll('br')]; if (b.textContent) br.forEach(x => x.remove()); else if (!br.length) b.appendChild(document.createElement('br')); else br.slice(1).forEach(x => x.remove()); }
    if (!lines().length){ const p = document.createElement('p'); p.appendChild(document.createElement('br')); ed.replaceChildren(p); }
    ed.normalize();
  }
  // spec: [type, a node whose children become the line][]; list items of a kind side by side share one list
  function rebuild(spec){
    const frag = document.createDocumentFragment(); let list = null;
    for (const [t, b] of spec){
      const el = document.createElement(t === 'quote' ? 'blockquote' : t === 'ul' || t === 'ol' ? 'li' : t);
      el.append(...b.childNodes);
      if (t === 'ul' || t === 'ol'){ if (!list || list.tagName.toLowerCase() !== t) frag.appendChild(list = document.createElement(t)); list.appendChild(el); }
      else { list = null; frag.appendChild(el); }
    }
    ed.replaceChildren(frag); tidy();
  }
  const specOf = () => lines().map(b => [typeOf(b), b]);
  // anything the browser made that the editor doesn't keep: a stray <div>, a <span style>, text outside a line
  function messy(){
    for (const n of ed.childNodes){
      if (n.nodeType === 3 ? n.data.trim() : n.nodeType === 1 && !/^(P|H2|BLOCKQUOTE|UL|OL)$/.test(n.tagName)) return true;
      if (n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName) && [...n.childNodes].some(x => x.nodeType !== 1 || x.tagName !== 'LI')) return true;
    }
    return !!ed.querySelector('[style],[class],span,font,div,a:not([href]),:is(p,h2,blockquote,li) :not(b,i,code,a,br)');
  }

  /* ---- reading HTML, pasted or the editor's own, into lines of the few tags it keeps. keep: the editor's own, every
     character and empty line as it is; otherwise whitespace collapses as a page shows it and empty lines go ---- */
  const safe = h => { h = (h || '').trim(); return /^(https?:\/\/|mailto:)/i.test(h) ? h : null; };
  function parse(root, keep){
    const out = []; let cur = null;
    const walk = (node, t, pre, marks) => {
      for (const n of node.childNodes){
        if (n.nodeType === 3){
          let s = keep ? n.data : pre ? n.data.replace(/\r\n?/g, '\n') : n.data.replace(/[\s ]+/g, ' ');
          if (!keep) s = s.replace(/ /g, ' ');
          if (!cur && !s.trim() && (node === root || /^(UL|OL|DL|TABLE|TBODY|THEAD|TFOOT|TR)$/.test(node.tagName))) continue;
          (pre && !keep ? s.split('\n') : [s]).forEach((p, i) => {
            if (i) cur = null;
            if (!p || (!cur && !keep && !p.trim())) return;
            if (!cur) out.push(cur = { t, frag:document.createDocumentFragment() });
            let x = document.createTextNode(p);
            for (let m = marks.length - 1; m >= 0; m--){ const w = document.createElement(marks[m][0].toLowerCase()); if (marks[m][1]) w.setAttribute('href', marks[m][1]); w.appendChild(x); x = w; }
            cur.frag.appendChild(x);
          });
          continue;
        }
        if (n.nodeType !== 1 || SKIP.test(n.tagName) || n.classList.contains('rte-new')) continue;
        const tg = n.tagName, css = (n.getAttribute('style') || '').toLowerCase();
        if (tg === 'BR'){ cur = null; continue; }
        if (BLOCK.test(tg)){
          const nt = /^H[1-6]$/.test(tg) ? 'h2' : tg === 'LI' ? (n.parentNode && n.parentNode.tagName === 'OL' ? 'ol' : 'ul') : tg === 'BLOCKQUOTE' ? 'quote' : t;
          cur = null; const was = out.length;
          walk(n, nt, pre || tg === 'PRE', marks);
          if (keep && out.length === was && !n.querySelector('p,div,h1,h2,h3,h4,h5,h6,li,blockquote,pre,ul,ol')) out.push({ t:nt, frag:document.createDocumentFragment() });
          cur = null; continue;
        }
        let m = marks; const add = (tag, href) => { if (!m.some(x => x[0] === tag)) m = [...m, [tag, href]]; };
        if (tg === 'B' || tg === 'STRONG' ? !/font-weight\s*:\s*(normal|[1-4]00)/.test(css) : /font-weight\s*:\s*(bold|[6-9]00)/.test(css)) add('B');
        if (tg === 'I' || tg === 'EM' || /font-style\s*:\s*italic/.test(css)) add('I');
        if (/^(CODE|KBD|SAMP|TT)$/.test(tg)) add('CODE');
        if (tg === 'A'){ const h = safe(n.getAttribute('href')); if (h) add('A', h); }
        walk(n, t, pre, m);
      }
    };
    walk(root, 'p', false, []);
    if (!keep) for (const x of out){
      const ts = [], w = document.createTreeWalker(x.frag, NodeFilter.SHOW_TEXT); let t; while ((t = w.nextNode())) ts.push(t);
      if (ts.length){ ts[0].data = ts[0].data.replace(/^\s+/, ''); ts[ts.length - 1].data = ts[ts.length - 1].data.replace(/\s+$/, ''); }
    }
    return out.filter(x => keep || x.frag.textContent).map(x => ({ ...x, len:x.frag.textContent.length }));
  }
  const plain = s => s.replace(/\r\n?/g, '\n').split('\n').filter(l => l.trim()).map(l => { const frag = document.createDocumentFragment(); frag.append(l); return { t:'p', frag, len:l.length }; });
  function clean(){ const o = get(); rebuild(parse(ed, true).map(x => [x.t, x.frag])); set(o); }
  function load(html){ const t = document.createElement('template'); t.innerHTML = html || ''; rebuild(parse(t.content, false).map(x => [x.t, x.frag])); caret = null; H.list = [{ html:ed.innerHTML, sel:{ s:0, e:0 }, pre:null }]; H.at = 0; H.dirty = false; pend = null; changed(); }

  /* ---- history ---- */
  const H = { list:[], at:0, dirty:false, pre:null, t:0 };
  const changed = () => hook.change && hook.change();
  function commit(pre){
    clearTimeout(H.t); const html = ed.innerHTML, top = H.list[H.at], before = H.pre || pre || null;
    H.dirty = false; H.pre = null;
    if (!top || top.html !== html){ H.list.splice(H.at + 1); H.list.push({ html, sel:get(), pre:before }); if (H.list.length > 300) H.list.shift(); H.at = H.list.length - 1; }
    changed();
  }
  const flush = () => { if (H.dirty) commit(); };
  // typing settles into one step once it pauses
  function typed(pre){ if (!H.dirty){ H.pre = pre || null; H.list.splice(H.at + 1); } H.dirty = true; clearTimeout(H.t); H.t = setTimeout(() => commit(), 700); changed(); }
  function restore(html, sel){ ed.innerHTML = html; pend = null; set(sel || { s:0, e:0 }); changed(); }
  function undo(){ flush(); if (H.at <= 0) return; const cur = H.list[H.at]; H.at--; restore(H.list[H.at].html, cur.pre || H.list[H.at].sel); }
  function redo(){ flush(); if (H.at >= H.list.length - 1) return; H.at++; restore(H.list[H.at].html, H.list[H.at].sel); }

  /* ---- edits ---- */
  function texts(){ const out = []; let n = 0; lines().forEach((b, i) => { if (i) n++; const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); let t; while ((t = w.nextNode())){ out.push([t, n]); n += t.data.length; } }); return out; }
  function cut(at){ for (const [t, n] of texts()) if (at > n && at < n + t.data.length){ t.splitText(at - n); return; } }
  // the text nodes a selection covers, split at its ends so each is wholly inside it
  function covered(o){ cut(o.e); cut(o.s); return texts().filter(([t, n]) => t.data.length && n >= o.s && n + t.data.length <= o.e).map(x => x[0]); }
  // formats picked with nothing selected wait for the next thing typed at that spot
  let pend = null;
  function has(tag, o){
    if (o.s === o.e){
      if (pend && pend.at === o.s && tag in pend.m) return pend.m[tag];
      const g = live(); return !!up(g && g.collapsed ? g.startContainer : pointAt(o.s)[0], tag);
    }
    const ts = texts().filter(([t, n]) => t.data.length && n < o.e && n + t.data.length > o.s);
    return ts.length > 0 && ts.every(([t]) => up(t, tag));
  }
  // bold (B), italic (I), code (CODE) or a link (A, with href; null takes it off) on the selection, or off it when it all has it
  function inline(tag, href, o = get()){
    if (o.s === o.e){
      if (tag === 'A') return;
      if (!pend || pend.at !== o.s) pend = { at:o.s, m:{} };
      pend.m[tag] = !has(tag, o); changed(); return;
    }
    flush();
    const ts = covered(o); if (!ts.length) return;
    const add = href !== undefined ? href !== null : !ts.every(t => up(t, tag));
    if (add) ts.forEach(t => { const had = up(t, tag); if (!had) wrap(t, tag, href); else if (href) had.setAttribute('href', href); });
    else new Set(ts.map(t => up(t, tag))).forEach(el => {
      if (!el) return;
      const keep = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), h = el.getAttribute('href'); let t;
      while ((t = w.nextNode())) if (!ts.includes(t)) keep.push(t);
      unwrap(el); keep.forEach(x => wrap(x, tag, h));
    });
    tidy(); set(o); commit(o);
  }
  // typing with formats picked at the caret: the text goes in with them, and the caret stays inside them
  function typeStyled(s){
    const o = get(), m = pend.m; pend = null;
    const g = live(), [n, k] = g && g.collapsed ? [g.startContainer, g.startOffset] : pointAt(o.s);
    const rg = document.createRange(); rg.setStart(n, k); rg.collapse(true);
    for (const tag of Object.keys(m)) if (!m[tag]){
      const el = up(rg.startContainer, tag); if (!el) continue;
      const tail = document.createRange(); tail.setStart(rg.startContainer, rg.startOffset); tail.setEndAfter(el);
      el.after(tail.extractContents()); rg.setStartAfter(el); rg.collapse(true);
    }
    let x = document.createTextNode(s);
    for (const tag of Object.keys(m)) if (m[tag] && !up(rg.startContainer, tag)){ const w = document.createElement(tag.toLowerCase()); w.appendChild(x); x = w; }
    rg.insertNode(x); tidy(); set({ s:o.s + s.length, e:o.s + s.length }); typed(o);
  }
  // a heading, a list or a quote on the lines in the selection, or plain lines again when they all have it
  function block(type, o = get()){
    flush(); const all = lines(), a = lineAt(o.s), z = lineAt(o.e);
    const to = all.slice(a, z + 1).every(b => typeOf(b) === type) ? 'p' : type;
    rebuild(all.map((b, i) => [i >= a && i <= z ? to : typeOf(b), b])); set(o); commit(o);
  }
  function del(o){
    const all = lines(), i = lineAt(o.s), j = lineAt(o.e), [a, ao] = pointAt(o.s, true), [b, bo] = pointAt(o.e);
    if (i === j){ const rg = document.createRange(); rg.setStart(a, ao); rg.setEnd(b, bo); rg.deleteContents(); tidy(); return { s:o.s, e:o.s }; }
    const head = document.createRange(); head.setStart(a, ao); head.setEnd(all[i], all[i].childNodes.length); head.deleteContents();
    const tail = document.createRange(); tail.setStart(all[j], 0); tail.setEnd(b, bo); tail.deleteContents();
    all[i].append(...all[j].childNodes);
    rebuild(all.filter((x, k) => k <= i || k > j).map(x => [typeOf(x), x]));
    return { s:o.s, e:o.s };
  }
  // Enter: the text after the caret starts a new line. A list or a quote carries on, a heading is followed by text, and Enter
  // on an empty list item or quote line leaves the list
  function split(o = get()){
    flush(); const pre = o; if (o.s !== o.e) o = del(o);
    const all = lines(), i = lineAt(o.s), b = all[i], t = typeOf(b), spec = specOf(), next = t === 'h2' ? 'p' : t;
    if (!len(b) && t !== 'p'){ spec[i][0] = 'p'; rebuild(spec); set(o); commit(pre); return; }
    if (len(b) && o.s === startOf(i)){ spec.splice(i, 0, [next, document.createElement('p')]); rebuild(spec); set({ s:o.s + 1, e:o.s + 1 }); commit(pre); return; }
    const [n, k] = pointAt(o.s), rg = document.createRange(); rg.setStart(n, k); rg.setEnd(b, b.childNodes.length);
    const nb = document.createElement('p'); nb.appendChild(rg.extractContents());
    spec.splice(i + 1, 0, [next, nb]); rebuild(spec); set({ s:o.s + 1, e:o.s + 1 }); commit(pre);
  }
  // Backspace at the start of a line: a heading, list item or quote line turns plain first, then the line joins the one above
  function joinBack(o){
    const all = lines(), i = lineAt(o.s), spec = specOf();
    if (spec[i][0] !== 'p'){ spec[i][0] = 'p'; rebuild(spec); set(o); commit(o); return; }
    if (!i) return;
    all[i - 1].append(...all[i].childNodes); spec.splice(i, 1); rebuild(spec); set({ s:o.s - 1, e:o.s - 1 }); commit(o);
  }
  function joinNext(o){
    const all = lines(), i = lineAt(o.s), spec = specOf(); if (i >= all.length - 1) return;
    all[i].append(...all[i + 1].childNodes); spec.splice(i + 1, 1); rebuild(spec); set(o); commit(o);
  }
  // plain text at a spot; returns where it ends
  function insert(s, o){
    const [n, k] = pointAt(o.s);
    if (n.nodeType === 3) n.insertData(k, s); else n.insertBefore(document.createTextNode(s), n.childNodes[k] || null);
    tidy(); return o.s + s.length;
  }
  // lines read from a paste (or a suggestion) into the text: the first joins the line at the caret, the rest follow it, and
  // what came after the caret goes on the end. Returns where they end
  function insertLines(items, o){
    if (!items.length) return o.s;
    if (o.s !== o.e) o = del(o);
    const all = lines(), i = lineAt(o.s), b = all[i], [n, k] = pointAt(o.s), spec = specOf();
    const rg = document.createRange(); rg.setStart(n, k); rg.setEnd(b, b.childNodes.length); const tail = rg.extractContents();
    if (!b.textContent && items[0].t !== 'p') spec[i][0] = items[0].t;
    let at = o.s + items[0].len; b.append(items[0].frag);
    const rest = items.slice(1).map(x => { const p = document.createElement('p'); p.append(x.frag); at += 1 + x.len; return [x.t, p]; });
    spec.splice(i + 1, 0, ...rest); (rest.length ? rest[rest.length - 1][1] : b).append(tail);
    rebuild(spec); return at;
  }
  // a link on the selection; with nothing selected, on the link at the caret, or the address itself goes in, linked
  function link(o, href){
    flush();
    if (!href){ const rg = range(o); [...ed.querySelectorAll('a')].filter(a => rg.intersectsNode(a)).forEach(unwrap); tidy(); set(o); commit(o); return; }
    if (o.s !== o.e) return inline('A', href, o);
    const a = up(pointAt(o.s)[0], 'A');
    if (a){ a.setAttribute('href', href); set(o); commit(o); return; }
    const label = href.replace(/^mailto:/i, ''), end = insert(label, o);
    covered({ s:o.s, e:end }).forEach(t => wrap(t, 'A', href)); tidy(); set({ s:end, e:end }); commit(o);
  }

  /* ---- a suggestion: the text it replaces (swap) is struck through, or it goes after the selection (add). The new words
     arrive in a span the caret can't enter; Accept puts them in as plain text, Discard leaves the text as it was ---- */
  let rev = null;
  function suggest(o, kind){
    flush(); pend = null;
    const nw = document.createElement('span'); nw.className = 'rte-new'; nw.contentEditable = 'false';
    const olds = [];
    if (kind === 'swap'){
      const all = lines(), a = lineAt(o.s), z = lineAt(o.e);
      for (let i = z; i >= a; i--){
        const s = Math.max(o.s, startOf(i)), e = Math.min(o.e, startOf(i) + len(all[i])); if (e <= s) continue;
        const rg = range({ s, e }), sp = document.createElement('span'); sp.className = 'rte-old';
        sp.appendChild(rg.extractContents()); rg.insertNode(sp); olds.unshift(sp);
      }
    }
    if (olds.length) olds[olds.length - 1].after(nw); else range({ s:o.e, e:o.e }).insertNode(nw);
    rev = { o, kind, olds, nw };
    return s => { if (rev && rev.nw === nw){ const w = document.createElement('span'); w.className = 'w'; w.textContent = s; nw.appendChild(w); show(w); } };
  }
  function drop(){ if (!rev) return null; const r = rev; r.olds.forEach(unwrap); r.nw.remove(); rev = null; tidy(); return r; }
  function accept(){
    const s = rev && rev.nw.textContent; const r = drop(); if (!r) return;
    const at = insertLines(s ? s.split(/\n+/).filter(Boolean).map(l => { const frag = document.createDocumentFragment(); frag.append(l); return { t:'p', frag, len:l.length }; }) : [], r.kind === 'swap' ? r.o : { s:r.o.e, e:r.o.e });
    set({ s:at, e:at }); commit(r.o);
  }
  function discard(){ const r = drop(); if (r) set(r.o); changed(); }

  /* ---- what the browser does, routed through the edits above ---- */
  on(ed, 'beforeinput', e => {
    const t = e.inputType;
    if (rev){ e.preventDefault(); return; }
    if (t === 'historyUndo' || t === 'historyRedo'){ e.preventDefault(); t === 'historyUndo' ? undo() : redo(); return; }
    if (t.startsWith('format')){ e.preventDefault(); if (t === 'formatBold') inline('B'); else if (t === 'formatItalic') inline('I'); return; }
    if (t === 'insertParagraph' || t === 'insertLineBreak'){ e.preventDefault(); split(); return; }
    if (t === 'insertFromPaste' || t === 'insertFromDrop' || t === 'deleteByDrag' || t === 'deleteByCut') return;
    const o = get(), i = lineAt(o.s);
    if (t === 'insertText' && e.data && pend && o.s === o.e && pend.at === o.s){ e.preventDefault(); typeStyled(e.data); return; }
    if (o.s === o.e && /^delete.*Backward$/.test(t) && o.s === startOf(i)){ e.preventDefault(); flush(); joinBack(o); return; }
    if (o.s === o.e && /^delete.*Forward$/.test(t) && o.s === startOf(i) + len(lines()[i])){ e.preventDefault(); flush(); joinNext(o); return; }
    // a selection over several lines: removing it joins them, so the editor does it
    if (o.s !== o.e && i !== lineAt(o.e) && (t.startsWith('delete') || t === 'insertText' || t === 'insertReplacementText')){
      e.preventDefault(); flush(); const p = del(o); let at = p.s;
      const s = e.data || (e.dataTransfer && e.dataTransfer.getData('text/plain')) || '';
      if (s && t.startsWith('insert')) at = insert(s.replace(/\s*\n\s*/g, ' '), p);
      set({ s:at, e:at }); commit(o); return;
    }
    if (!H.dirty) H.pre = o;
  });
  on(ed, 'input', e => { if (rev) return; if (messy()) clean(); typed(H.pre); hook.input && hook.input(e); });
  on(ed, 'paste', e => {
    e.preventDefault(); if (rev || !e.clipboardData) return;
    const h = e.clipboardData.getData('text/html'), s = e.clipboardData.getData('text/plain');
    let items = h ? parse(new DOMParser().parseFromString(h, 'text/html').body, false) : [];
    if (!items.length) items = plain(s); if (!items.length) return;
    flush(); const o = get(), at = insertLines(items, o); set({ s:at, e:at }); commit(o);
  });
  on(ed, 'cut', e => {
    e.preventDefault(); if (rev || !e.clipboardData) return; const o = get(); if (o.s === o.e) return;
    const g = live(); e.clipboardData.setData('text/plain', text(o)); if (g){ const d = document.createElement('div'); d.appendChild(g.cloneContents()); e.clipboardData.setData('text/html', d.innerHTML); }
    flush(); const p = del(o); set(p); commit(o);
  });
  // a drop goes in as plain text where it lands; dragging inside the text is off, so a drag can't move half a list
  on(ed, 'dragstart', e => e.preventDefault());
  on(ed, 'drop', e => {
    e.preventDefault(); if (rev || !e.dataTransfer) return;
    const items = plain(e.dataTransfer.getData('text/plain')); if (!items.length) return;
    const p = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : document.caretPositionFromPoint && (pp => { const r = document.createRange(); r.setStart(pp.offsetNode, pp.offset); return r; })(document.caretPositionFromPoint(e.clientX, e.clientY));
    if (!p || !ed.contains(p.startContainer)) return;
    flush(); const at0 = offsetOf(p.startContainer, p.startOffset), at = insertLines(items, { s:at0, e:at0 }); set({ s:at, e:at }, true); commit({ s:at0, e:at0 });
  });
  on(ed, 'keydown', e => {
    if (e.isComposing || (hook.key && hook.key(e))) return;
    if (rev) return;
    const mod = /Mac|iP(hone|ad|od)/.test(navigator.platform || navigator.userAgent) ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey;
    if (!mod) return;
    const k = e.key.toLowerCase(), c = e.code;
    const act = e.altKey ? (c === 'Digit1' ? () => block('h2') : c === 'Digit0' ? () => block('p') : null)
      : e.shiftKey ? (c === 'Digit7' ? () => block('ol') : c === 'Digit8' ? () => block('ul') : c === 'Digit9' ? () => block('quote') : k === 'z' ? redo : null)
      : k === 'b' ? () => inline('B') : k === 'i' ? () => inline('I') : k === 'e' ? () => inline('CODE') : k === 'z' ? undo : k === 'y' ? redo : null;
    if (act){ e.preventDefault(); e.stopPropagation(); act(); }
  });
  on(document, 'selectionchange', () => {
    if (!live() || rev) return;
    caret = get(); if (pend && (caret.s !== pend.at || caret.e !== pend.at)) pend = null;
    hook.select && hook.select();
  });

  tidy(); H.list = [{ html:ed.innerHTML, sel:{ s:0, e:0 }, pre:null }];
  return {
    get, set, text, range, total, lines, typeOf, load, undo, redo, inline, block, split, link, suggest, accept, discard, flush,
    focus: () => set(get(), true),
    html: () => ed.innerHTML,
    reviewing: () => !!rev,
    canUndo: () => H.at > 0 || H.dirty,
    canRedo: () => H.at < H.list.length - 1,
    empty: () => { const all = lines(); return all.length === 1 && !len(all[0]) && typeOf(all[0]) === 'p'; },
    words: () => { const s = lines().map(b => b.textContent).join(' ').trim(); return s ? s.split(/\s+/).length : 0; },
    // the line around a spot, as a selection
    line: at => { const i = lineAt(at), s = startOf(i); return { s, e:s + len(lines()[i]) }; },
    // what the selection or the caret has: bold, italic, code, a link (and its address), and the lines' type when they share one
    state(){
      const o = get(), all = lines(), ts = all.slice(lineAt(o.s), lineAt(o.e) + 1).map(typeOf), g = live();
      const a = up(o.s === o.e && g ? g.startContainer : pointAt(o.s, o.s !== o.e)[0], 'A');
      return { B:has('B', o), I:has('I', o), CODE:has('CODE', o), A:o.s === o.e ? !!a : has('A', o), href:a ? a.getAttribute('href') : null, block:ts.every(t => t === ts[0]) ? ts[0] : null };
    },
    // removes some text, as one step of the history
    remove(o){ flush(); set(del(o)); commit(o); },
    // text typed at the caret, as a person would: for a story, which leaves the page's focus where it is
    type(s){ const o = get(); flush(); const at = insert(s, o); set({ s:at, e:at }); typed(o); show(range({ s:at, e:at })); },
    show: o => show(range(o)),
    destroy(){ clearTimeout(H.t); offs.forEach(f => f()); }
  };
}
/* a stand-in for the agent, so the preview works on its own: canned rewrites for the story's draft, and simple rules for
   anything else. In your product, call your model where the component calls this */
const RTE_CANNED = {
  "We know pricing changes can feel like a lot, so we want to make sure everyone has plenty of time to look at the new plans and ask us questions before anything changes.":
    { shorter:"We're giving everyone time to review the new plans and ask questions before anything changes.", improve:'Pricing changes can feel like a lot, so everyone gets plenty of time to review the new plans and ask questions before anything changes.' },
  'New pricing goes live on March 3.':{ improve:'Our new pricing goes live on March 3.', shorter:'New pricing starts March 3.' },
  'Starter teams get two more seats for free, and every plan now includes the agent.':{ improve:'Starter teams get two extra seats at no cost, and every plan now includes the agent.', shorter:'Starter teams get two free seats, and every plan includes the agent.' }
};
function rteWrite(action, text, doc){
  const TYPO = { teh:'the', recieve:'receive', seperate:'separate', definately:'definitely', alot:'a lot', dont:"don't", cant:"can't", wont:"won't", im:"I'm", ive:"I've", thier:'their', untill:'until', occured:'occurred', wich:'which', becuase:'because', youre:"you're", doesnt:"doesn't", isnt:"isn't", tommorow:'tomorrow', accross:'across' };
  const fix = s => s.replace(/[ \t]{2,}/g, ' ').replace(/\s+([,.!?;:])/g, '$1').replace(/\bi\b/g, 'I')
    .replace(/\b[a-z]+\b/gi, w => { const f = TYPO[w.toLowerCase()]; return f ? (w[0] === w[0].toUpperCase() ? f[0].toUpperCase() + f.slice(1) : f) : w; })
    .replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase()).replace(/([a-z0-9])\s*$/i, (m, a) => s.trim().split(/\s+/).length > 3 ? a + '.' : m);
  // sentences end at . ! or ? before a space, so a file name like plan.yaml stays in one
  const sentences = s => s.match(/[^]*?(?:[.!?]+(?=\s|$)|$)\s*/g).filter(Boolean);
  const canned = s => { const k = s.trim(), hit = RTE_CANNED[k] && RTE_CANNED[k][action]; return hit ? s.replace(k, hit) : null; };
  if (action === 'continue'){
    const next = /pric|plan|seat|launch/i.test(doc)
      ? ['Current customers keep their price until their next renewal, and every admin gets an email that sums up what changes for their team.', 'If anything is unclear, reply to this email and we will walk you through it.']
      : ['Next, we will share a short summary so everyone knows what changes and when.', 'Reply with any questions and we will get back to you within a day.'];
    return next.find(x => !doc.includes(x)) || next[next.length - 1];
  }
  if (action === 'grammar') return fix(text);
  const FILLER = [[/\b(really|very|just|actually|basically|quite|simply|definitely|certainly|literally|totally)\s+/gi, ''], [/\bin order to\b/gi, 'to'], [/\bmake sure (that )?/gi, 'ensure '], [/\bdue to the fact that\b/gi, 'because'], [/\bat this point in time\b/gi, 'now'], [/\ba lot of\b/gi, 'many'], [/\bplenty of\b/gi, 'enough'], [/\bis able to\b/gi, 'can']];
  const BETTER = [[/\bwe will\b/gi, "we'll"], [/\bwe are\b/gi, "we're"], [/\bit is\b/gi, "it's"], [/\bdo not\b/gi, "don't"], [/\bcannot\b/gi, "can't"], [/\bvery important\b/gi, 'essential'], [/\bgood\b/gi, 'strong'], [/\bbig\b/gi, 'major'], [/\bstuff\b/gi, 'details'], [/\bkind of\s+/gi, ''], [/\bat no extra cost\b/gi, 'free']];
  const rules = (s, list) => list.reduce((x, [a, b]) => x.replace(a, b), s);
  return sentences(text).map(s => {
    const hit = canned(s); if (hit) return hit;
    let x = fix(rules(s, action === 'shorter' ? FILLER : [...FILLER.slice(0, 2), ...BETTER]));
    // a long sentence that is still long keeps its main clause
    if (action === 'shorter' && x.trim().length > 60 && x.length > s.length * .85 && x.includes(', ')) x = x.slice(0, x.indexOf(', ')) + '.' + (/\s$/.test(s) ? ' ' : '');
    return x;
  }).join('');
}
DM.def('rich-text-editor', (r, c) => {
  const MAC = /Mac|iP(hone|ad|od)/.test(navigator.platform || navigator.userAgent);
  const KEY = { mod:MAC ? '⌘' : 'Ctrl', alt:MAC ? '⌥' : 'Alt', shift:MAC ? '⇧' : 'Shift' };
  const keys = k => k === 'redo' ? (MAC ? '⇧⌘Z' : 'Ctrl+Y') : k.split(' ').map(x => KEY[x] || x).join(MAC ? '' : '+');
  const IC = { heading:I('heading', ''), bold:I('bold', ''), italic:I('italic', ''), code:I('code', ''), link:I('link', ''), list:I('list', ''), listol:I('list-ol', ''), quote:I('quote', ''), spark:I('spark'), undo:I('undo'), redo:I('redo'), wand:I('wand'), minus:I('minus'), check:I('check'), edit:I('edit'), trash:I('trash') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  $$('[data-k]', r).forEach(b => b.dataset.tipK = keys(b.dataset.k));
  const root = $('.rte', r), tb = $('.rte-tb', r), ed = $('.rte-body', r), wc = $('.rte-wc', r), live = $('.rte-live', r), st = $('.rte-st', r);
  const menu = $('.rte-menu', r), ask = $('.rte-ask', r), aiB = $('.rte-ai', r), lnk = $('.rte-lnk', r), url = $('.rte-url', r), linkB = $('[data-f="a"]', tb);
  const okB = $('.rte-ok', r), noB = $('.rte-no', r), unB = $('.rte-un', r), reB = $('.rte-re', r);
  const uid = Math.random().toString(36).slice(2, 7), ph = $('.ph', menu); ph.id = 'rte-ph-' + uid; menu.setAttribute('aria-labelledby', ph.id);
  const ACT = { improve:'Improve writing', shorter:'Make shorter', grammar:'Fix grammar', continue:'Continue writing' };
  // the selection a menu or the link field is for stays marked while the focus is in them
  const HL = window.CSS && CSS.highlights && window.Highlight ? (CSS.highlights.get('rte-pick') || (h => (CSS.highlights.set('rte-pick', h), h))(new Highlight())) : null;
  let picked = null;
  const pick = o => { if (!HL) return; if (picked) HL.delete(picked); picked = o && o.s !== o.e ? E.range(o) : null; if (picked) HL.add(picked); };
  c.offs.push(() => pick(null));
  const say = t => { live.textContent = ''; c.later(60, () => { live.textContent = t; }); };
  let job = null, lk = null, rv = null;

  // the toolbar, the word count and undo follow the text and the selection
  function paint(){
    const s = E.state(), busy = E.reviewing();
    $$('.rte-b', tb).forEach(b => { b.disabled = busy; const f = b.dataset.f;
      if (f === 'a') b.classList.toggle('on', !busy && s.A); else b.setAttribute('aria-pressed', String(!busy && (/^(h2|ul|ol|quote)$/.test(f) ? s.block === f : !!s[f.toUpperCase()]))); });
    aiB.disabled = busy; unB.disabled = busy || !E.canUndo(); reB.disabled = busy || !E.canRedo();
    if (!busy){ const n = E.words(); wc.textContent = n === 1 ? '1 word' : n + ' words'; }
    ed.classList.toggle('empty', !busy && E.empty());
  }
  // a popover sits under the text it is for, or over it when there is no room under it, always inside the editor
  // (the bubble goes over the selection's first line; a menu under its last line, or over its first when there's no room)
  function place(el, o, above){
    const b = root.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight, top = tb.offsetHeight - 2, [f, l] = rectsOf(o);
    const over = f.top - b.top - h - 6, under = l.bottom - b.top + 6;
    const y = above ? (over >= top ? over : under) : under + h <= b.height - 4 || over < top ? under : over;
    el.style.left = Math.round(Math.max(6, Math.min((above ? f : l).left - b.left - (above ? 0 : 8), b.width - w - 6))) + 'px';
    el.style.top = Math.round(Math.max(4, Math.min(y, b.height - h - 4))) + 'px';
  }
  // the first and last line boxes of a selection, or the caret's line
  const rectsOf = o => {
    const rs = [...E.range(o).getClientRects()].filter(x => x.width || x.height);
    if (rs.length) return [rs[0], rs[rs.length - 1]];
    const n = E.range(E.line(o.s)).startContainer, el = n.nodeType === 3 ? n.parentElement : n, rr = el.getBoundingClientRect();
    return [rr, rr];
  };
  // the small Ask AI button over a selection made with the mouse or the keys
  function bubble(o){
    const g = getSelection(), sel = o || (document.activeElement === ed && g.rangeCount && !g.isCollapsed ? E.get() : null);
    if (!sel || E.reviewing() || job || lk || !E.text(sel).trim()){ ask.classList.remove('show'); return; }
    place(ask, sel, true); ask.classList.add('show');
  }
  const E = rteEngine(ed, {
    change(){ paint(); },
    select(){ paint(); bubble(); },
    // a / typed at the start of a line opens the menu
    input(e){ if (e.inputType === 'insertText' && e.data === '/'){ const o = E.get(); if (o.s === o.e && E.line(o.s).s === o.s - 1) openMenu('slash'); } },
    key(e){
      if (E.reviewing()){
        if ((e.key === 'Tab' || e.key === 'Enter') && !e.shiftKey && !e.altKey && !e.metaKey && !e.ctrlKey){ e.preventDefault(); accept(true); return true; }
        if (e.key === 'Escape' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z')){ e.preventDefault(); e.stopPropagation(); discard(true); return true; }
        return false;
      }
      const mod = MAC ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey, k = e.key.toLowerCase();
      if (mod && !e.altKey && !e.shiftKey && (k === 'k' || k === 'j')){ e.preventDefault(); e.stopPropagation(); k === 'k' ? openLink(true) : openMenu('key'); return true; }
      if (e.key === 'Escape' && ask.classList.contains('show')){ ask.classList.remove('show'); e.stopPropagation(); return true; }
      return false;
    }
  });
  c.offs.push(() => E.destroy());

  /* ---- the toolbar: one tab stop, the arrow keys move along it; a click keeps the focus and the selection in the text ---- */
  const tbs = () => $$('button', tb).filter(b => !b.disabled);
  $$('button', tb).forEach((b, i) => b.tabIndex = i ? -1 : 0);
  c.on(tb, 'mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
  c.on(tb, 'focusin', e => { if (e.target.matches('button')) $$('button', tb).forEach(b => b.tabIndex = b === e.target ? 0 : -1); });
  c.on(tb, 'keydown', e => {
    const all = tbs(), i = all.indexOf(document.activeElement); if (i < 0) return;
    const go = { ArrowRight:all[(i + 1) % all.length], ArrowLeft:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); go.focus(); }
  });
  $$('.rte-b', tb).forEach(b => b.addEventListener('click', e => {
    const f = b.dataset.f; if (E.reviewing()) return;
    if (f === 'a') return lk ? closeLink(true) : openLink(e.isTrusted, e.isTrusted && !e.detail);
    if (/^(b|i|code)$/.test(f)) E.inline(f.toUpperCase()); else E.block(f);
    if (e.isTrusted) E.focus();
  }));
  // undo and redo in the foot
  c.on($('.rte-idle', r), 'mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
  unB.onclick = e => { E.undo(); if (e.isTrusted) E.focus(); };
  reB.onclick = e => { E.redo(); if (e.isTrusted) E.focus(); };

  /* ---- the AI menu: a menu of actions on the selection, or on the line the caret is in ---- */
  function openMenu(how){
    if (E.reviewing()) return; closeLink(false); E.flush();
    if (job) return closeMenu(how !== 'story');
    const o = E.get(), slash = how === 'slash' ? o.s - 1 : null, sel = o.s !== o.e;
    let t = sel ? o : E.line(o.s); if (slash !== null) t = { s:slash + 1, e:t.e };
    const has = !!E.text(t).trim();
    // opened from its button with the keyboard, Escape gives the focus back to the button; opened from the text, to the text
    job = { o, t, slash, sel, btn:how === 'button' };
    ph.textContent = sel ? 'Edit the selection' : has ? 'Edit this paragraph' : 'Write with AI';
    $$('.mi', menu).forEach(m => { m.setAttribute('aria-disabled', String(m.dataset.a !== 'continue' && !has)); m.tabIndex = -1; m.classList.remove('hl'); });
    ask.classList.remove('show'); pick(sel ? o : null);
    hideTip(); place(menu, o); menu.classList.add('open'); menu.inert = false; aiB.setAttribute('aria-expanded', 'true');
    if (how !== 'story') item(items()[0]);
  }
  function closeMenu(back){
    if (!job) return; const j = job; job = null;
    menu.classList.remove('open'); menu.inert = true; aiB.setAttribute('aria-expanded', 'false'); pick(null);
    if (back && j.btn){ E.set(j.o); aiB.focus({ preventScroll:true }); } else if (back) E.set(j.o, true);
  }
  menu.inert = true;
  const items = () => $$('.mi', menu).filter(m => m.getAttribute('aria-disabled') !== 'true');
  const item = m => { if (!m) return; $$('.mi', menu).forEach(x => x.tabIndex = x === m ? 0 : -1); m.focus({ preventScroll:true }); };
  // the arrow keys move and wrap, Home and End jump, a letter jumps to the item it starts, Escape and Tab go back to the text
  c.on(menu, 'keydown', e => {
    const all = items(), i = all.indexOf(document.activeElement);
    const go = { ArrowDown:all[(i + 1) % all.length], ArrowUp:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); item(go); }
    else if (e.key === 'Escape' || e.key === 'Tab'){ e.preventDefault(); e.stopPropagation(); closeMenu(true); }
    else if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey){ const k = e.key.toLowerCase(), hit = [...all.slice(i + 1), ...all.slice(0, i + 1)].find(m => m.textContent.trim().toLowerCase().startsWith(k)); if (hit) item(hit); }
  });
  c.on(menu, 'mousedown', e => e.preventDefault());
  $$('.mi', menu).forEach(m => m.addEventListener('click', e => { if (m.getAttribute('aria-disabled') !== 'true') run(m.dataset.a, e.isTrusted); }));
  aiB.addEventListener('click', e => openMenu(e.isTrusted ? (e.detail ? 'click' : 'button') : 'story'));
  c.on(ask, 'mousedown', e => e.preventDefault());
  ask.addEventListener('click', e => openMenu(e.isTrusted ? 'click' : 'story'));
  c.on(document, 'pointerdown', e => {
    if (job && !menu.contains(e.target) && !aiB.contains(e.target) && !ask.contains(e.target)) closeMenu(false);
    if (lk && !lnk.contains(e.target) && !linkB.contains(e.target)) closeLink(false);
    if (e.isTrusted && !ask.contains(e.target) && !job) ask.classList.remove('show');
  });
  c.on(window, 'resize', e => { if (!e.isTrusted) return; closeMenu(false); closeLink(false); ask.classList.remove('show'); });

  /* ---- a suggestion streams in; Accept (Tab or Enter) keeps it, Discard (Esc) leaves the text as it was ---- */
  function run(a, mine){
    const j = job; closeMenu(false); if (!j || E.reviewing()) return;
    let t = j.t, end = j.o.e;
    // the / that opened the menu goes, and what comes after it moves back one
    if (j.slash !== null){ E.remove({ s:j.slash, e:j.slash + 1 }); const back = x => x > j.slash ? x - 1 : x; t = { s:back(t.s), e:back(t.e) }; end = back(end); }
    const kind = a === 'continue' ? 'add' : 'swap';
    if (kind === 'add') t = { s:end, e:end };
    const doc = E.text({ s:0, e:E.total() }), before = E.text({ s:0, e:t.s }), said = E.text(t);
    let out = rteWrite(a, said, doc);
    if (kind === 'add' && before && !/\s$/.test(before)) out = ' ' + out;
    const write = E.suggest(t, kind), token = rv = { a, ready:false };
    root.dataset.st = 'review'; okB.disabled = true; paint(); ask.classList.remove('show');
    st.innerHTML = `<span class="think on" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="shim">${ACT[a]}</span>`;
    say(`${ACT[a]}: writing a suggestion`);
    if (mine) E.focus();
    c.run(async () => {
      if (REDUCE) write(out);
      else { await c.wait(450); for (const w of out.match(/\S+\s*|\s+/g) || []){ if (rv !== token) return; write(w); await c.wait(48); } }
      if (rv !== token) return;
      token.ready = true; okB.disabled = false;
      st.innerHTML = `${I('spark')}<span>Suggestion ready</span>`;
      const said = out.trim(); say(`Suggestion: ${said}${/[.!?]$/.test(said) ? '' : '.'} Press Tab or Enter to accept, or Escape to discard.`);
    });
  }
  function accept(mine){ if (!rv || !rv.ready) return; rv = null; E.accept(); root.dataset.st = 'edit'; paint(); say('Suggestion accepted'); if (mine) E.focus(); }
  function discard(mine){ if (!E.reviewing()) return; rv = null; E.discard(); root.dataset.st = 'edit'; paint(); say('Suggestion discarded'); if (mine) E.focus(); }
  c.on($('.rte-rev', r), 'mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
  okB.addEventListener('click', e => accept(e.isTrusted));
  noB.addEventListener('click', e => discard(e.isTrusted));
  c.on(root, 'keydown', e => { if (e.key === 'Escape' && E.reviewing() && !ed.contains(e.target)){ e.preventDefault(); e.stopPropagation(); discard(true); } });

  /* ---- the link field ---- */
  lnk.inert = true;
  const toUrl = v => { v = v.trim(); if (!v) return null; if (/^(https?:\/\/|mailto:)/i.test(v)) return v; if (/^[^\s@/]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'mailto:' + v; if (/^[\w-]+(\.[\w-]+)+(:\d+)?([/?#]\S*)?$/.test(v)) return 'https://' + v; return null; };
  function openLink(mine, btn){
    if (E.reviewing()) return; closeMenu(false); E.flush();
    const o = E.get(), s = E.state(); lk = { o, btn };
    url.value = s.href || ''; url.removeAttribute('aria-invalid'); $('.rte-lrm', lnk).hidden = !s.href;
    ask.classList.remove('show'); pick(o); hideTip();
    place(lnk, o); lnk.classList.add('open'); lnk.inert = false; linkB.setAttribute('aria-expanded', 'true');
    if (mine) url.focus({ preventScroll:true });
  }
  function closeLink(back){
    if (!lk) return; const j = lk; lk = null;
    lnk.classList.remove('open'); lnk.inert = true; linkB.setAttribute('aria-expanded', 'false'); pick(null);
    if (back && j.btn){ E.set(j.o); linkB.focus({ preventScroll:true }); } else if (back) E.set(j.o, true);
  }
  function applyLink(){
    if (!lk) return; const h = toUrl(url.value);
    if (!h){ url.setAttribute('aria-invalid', 'true'); url.focus({ preventScroll:true }); return; }
    const o = lk.o; closeLink(false); E.set(o); E.link(o, h); E.focus();
  }
  $('.rte-lok', lnk).onclick = applyLink;
  $('.rte-lrm', lnk).onclick = () => { if (!lk) return; const o = lk.o; closeLink(false); E.set(o); E.link(o, null); E.focus(); };
  c.on(url, 'input', () => url.removeAttribute('aria-invalid'));
  // Tab past its last button leaves the field, and it closes
  c.on(lnk, 'focusout', e => { if (lk && e.relatedTarget && !lnk.contains(e.relatedTarget)) closeLink(false); });
  c.on(lnk, 'keydown', e => { if (e.key === 'Enter' && e.target === url){ e.preventDefault(); applyLink(); } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); closeLink(true); } });
  paint();

  // the preview's story: a heading and a short draft about the pricing launch, then the last sentence is picked and made
  // shorter; the suggestion streams in and is accepted. A click or a key of yours takes over, and the editor is yours
  const DRAFT = 'New pricing goes live on March 3. Starter teams get two more seats for free, and every plan now includes the agent. We know pricing changes can feel like a lot, so we want to make sure everyone has plenty of time to look at the new plans and ask us questions before anything changes.';
  const LAST = DRAFT.slice(DRAFT.indexOf('We know'));
  c.on(r, 'pointerdown', e => { if (e.isTrusted && !job) pick(null); }, true);
  if (r === c.st) c.story(async s => {
    const type = async t => { for (const w of t.match(/\S+\s*/g)){ E.type(w); await s.beat(.24); } };
    await s.beat(3);
    await s.tap($('[data-f="h2"]', tb)); s.away();
    await type('Pricing launch'); await s.beat(1);
    E.split(); await s.beat(.5);
    await type(DRAFT); await s.beat(3);
    const at = E.text({ s:0, e:E.total() }).indexOf(LAST), o = { s:at, e:at + LAST.length };
    E.set(o); E.show(o); pick(o); bubble(o); await s.beat(2);
    await s.tap(ask); await s.beat(2);
    const it = $('.mi[data-a="shorter"]', menu); it.classList.add('hl'); await s.point(it); await s.beat(1);
    await s.tap(it); s.away();
    await s.until(() => rv && rv.ready); await s.beat(4);
    await s.tap(okB); s.away(); await s.beat(3);
  });
});
/* ---------- Voice capture ---------- */
DM.def('voice-capture', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{pause}', I('pause'));
  const box = $('.vcx', r), tx = $('.vcx-tx', r), cv = $('.vcx-wave', r), st = $('.vcx-st', r), pop = $('.vcx-fix', r);
  const words = 'Move the yearly toggle above the cards and make the save badge say 20% off for annual plans'.split(' ');
  const low = { 3:['toggle','toddle','tunnel'], 10:['save','sale','saving'] };
  let samples = [], speak = 0, last = 0, paused = false, secs = 0, done = false;
  c.every(1000, () => { if (!paused && !done){ secs++; $('.vcx-t', r).textContent = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'); } });
  // the wave scrolls while it records. Once recording stops it is the whole recording, still, in quieter bars, drawn again
  // only when its width or colours change. The colours are read a few times a second, not every frame
  let cols = null, colsAt = -1e9, drawn = '';
  c.loop(t => {
    if (!done && t - last > 50){ last = t; samples.push(!paused && speak > 0 ? .2 + Math.random() * .8 : 0); if (samples.length > 300) samples.shift(); if (speak > 0) speak--; }
    const dpr = devicePixelRatio || 1, w = cv.clientWidth, h = cv.clientHeight; if (!w) return;
    const now = performance.now(); if (!cols || now - colsAt > 400){ const cs = getComputedStyle(r); cols = ['--fg2', '--faint', '--muted'].map(k => cs.getPropertyValue(k).trim()); colsAt = now; }
    if (done){ const key = w + cols.join(); if (key === drawn) return; drawn = key; }
    if (cv.width !== w * dpr){ cv.width = w * dpr; cv.height = h * dpr; }
    const x = cv.getContext('2d'); x.setTransform(dpr, 0, 0, dpr, 0, 0); x.clearRect(0, 0, w, h);
    const n = Math.floor(w / 5);
    let vals;
    if (done){
      // the recording without the silence either side, fitted to the width: each bar is the loudest moment it covers
      let a = samples.findIndex(v => v), z = samples.length - 1; while (z > a && !samples[z]) z--;
      const rec = a < 0 ? [] : samples.slice(Math.max(0, a - 2), z + 3);
      vals = Array.from({ length:n }, (_, i) => { const from = Math.floor(i * rec.length / n), to = Math.max(from + 1, Math.floor((i + 1) * rec.length / n)); return Math.max(0, ...rec.slice(from, to).map(v => v || 0)); });
    } else vals = Array.from({ length:n }, (_, i) => samples[samples.length - n + i] || 0);
    for (let i = 0; i < n; i++){ const v = vals[i], px = i * 5 + 2; x.globalAlpha = done ? (v ? .6 : 1) : Math.min(1, i / 14, (n - i) / 3 + .2);
      x.fillStyle = v ? cols[done ? 2 : 0] : cols[1];
      const bh = v ? Math.max(4, v * (h - 6)) : 2; x.beginPath(); x.roundRect ? x.roundRect(px, h / 2 - bh / 2, 2.5, bh, 1.2) : x.rect(px, h / 2 - bh / 2, 2.5, bh); x.fill(); }
  });
  const pb = $('.vcx-pause', r);
  pb.onclick = () => { paused = !paused; box.classList.toggle('paused', paused); pb.innerHTML = I(paused ? 'mic' : 'pause'); pb.dataset.tip = paused ? 'Resume' : 'Pause'; swap(st, paused ? 'Paused' : 'Listening'); };
  function finish(){
    // the box keeps the height it had while recording: the wave stays, still, and the words stay where they were
    hold(box); done = true; box.classList.add('done'); swap(st, 'Check what I heard'); pb.remove();
    $$('.low', tx).forEach(l => { l.dataset.tip = 'Not sure about this word'; });
  }
  const settle = t => { $('.vcx-acts', r).innerHTML = `<span class="muted" style="font-size:12.5px">${t}</span><span class="sp"></span><button class="pill ghost sm vcx-again">${I('refresh','xs')}Record again</button>`; $('.vcx-again', r).onclick = () => DM.mount(r.closest('.comp')); };
  $('.vcx-done', r).onclick = () => { if (!done) finish(); else { swap(st, 'Sent'); settle('Sent to the agent'); } };
  $('.vcx-x', r).onclick = () => { shutFix(); if (!done) hold(box); done = true; $$('.low', tx).forEach(l => l.replaceWith(l.textContent)); pb.remove(); box.classList.add('done', 'gone'); swap(st, 'Cancelled'); settle('Nothing was sent'); };
  // a word it isn't sure of opens a short menu of fixes: with a click, or with Enter or Space, which puts the focus on the
  // first fix. The arrows move through them and wrap, Home and End jump, and Escape closes the menu back to the word
  let fixFor = null;
  const fixes = () => $$('.mi', pop);
  const shutFix = () => { const back = pop.contains(document.activeElement) && fixFor; pop.classList.remove('open'); pop.inert = true; if (fixFor) fixFor.setAttribute('aria-expanded', 'false'); fixFor = null; if (back && back.isConnected) back.focus({ preventScroll:true }); };
  function openFix(l, key){
    const alts = low[l.dataset.i];
    pop.innerHTML = '<div class="ph">Did you mean</div>' + alts.map(a => `<button class="mi" role="menuitem" tabindex="-1" data-close data-w="${a}">${a}</button>`).join('');
    hideTip(); const hr = box.getBoundingClientRect(), lr = l.getBoundingClientRect();
    pop.style.left = (lr.left - hr.left) + 'px'; pop.style.top = (lr.bottom - hr.top + 6) + 'px'; pop.inert = false; pop.classList.add('open');
    if (fixFor && fixFor !== l) fixFor.setAttribute('aria-expanded', 'false'); fixFor = l; l.setAttribute('aria-expanded', 'true');
    fixes().forEach(b => b.onclick = ev => { ev.stopPropagation(); l.textContent = b.dataset.w; l.classList.add('fixed'); l.dataset.tip = 'Fixed'; shutFix(); });
    if (key) fixes()[0].focus({ preventScroll:true });
  }
  pop.inert = true;
  c.on(tx, 'click', e => { const l = e.target.closest('.low'); if (!l) return; openFix(l, e.isTrusted && !e.detail); e.stopPropagation(); });
  c.on(tx, 'keydown', e => { const l = e.target.closest('.low'); if (!l || (e.key !== 'Enter' && e.key !== ' ')) return; e.preventDefault(); openFix(l, true); });
  c.on(pop, 'keydown', e => { const all = fixes(), i = all.indexOf(document.activeElement), go = { ArrowDown:all[(i + 1) % all.length], ArrowUp:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); go.focus({ preventScroll:true }); } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); shutFix(); } else if (e.key === 'Tab'){ const l = fixFor; shutFix(); if (l) l.focus({ preventScroll:true }); } });
  c.on(document, 'click', e => { if (!pop.contains(e.target) && pop.classList.contains('open')) shutFix(); });
  c.run(async () => {
    await c.wait(700);
    for (let i = 0; i < words.length; i++){
      while (paused){ await c.wait(100); }
      if (done) return;
      speak = 5; tx.insertAdjacentHTML('beforeend', low[i] ? `<span class="w"><span class="low" data-i="${i}" role="button" tabindex="0" aria-haspopup="menu" aria-expanded="false">${words[i]}</span> </span>` : `<span class="w">${words[i]} </span>`);
      await c.wait(170 + Math.random() * 150);
    }
    await c.wait(900); if (!done) finish();
  });
});
/* ---------- Tool call ---------- */
DM.def('tool-call', (r, c) => {
  const calls = [
    { ic:'db', n:'billing', f:'list_plan_changes', ms:'412 ms', inp:'{ <span class="k">"since"</span>: <span class="s">"2026-10-01"</span> }', out:'[ { <span class="k">"plan"</span>: <span class="s">"Pro"</span>, <span class="k">"price"</span>: <span class="n">24</span> },\n  { <span class="k">"plan"</span>: <span class="s">"Team"</span>, <span class="k">"price"</span>: <span class="n">48</span> } ]' },
    { ic:'edit', n:'files', f:'edit', ms:'1.2 s', inp:'{ <span class="k">"path"</span>: <span class="s">"Pricing.tsx"</span>, <span class="k">"lines"</span>: <span class="n">6</span> }', out:'{ <span class="k">"changed"</span>: <span class="n">6</span>, <span class="k">"saved"</span>: <span class="k">true</span> }' }
  ];
  const host = $('.tcx-calls', r);
  calls.forEach(k => {
    k.el = html(`<div class="tcx-c"><button class="tcx-h" aria-expanded="false"><span class="tcx-ic">${I(k.ic,'xs')}</span><span class="tcx-n"><span>${k.n}.</span><b>${k.f}</b></span><span class="tcx-ms"><span class="tt">Queued</span><span class="g"></span></span><svg class="i xs tcx-chev"><use href="#v2i-chev-d"/></svg></button><div class="fold shut"><div><div class="tcx-io"><div><div class="tcx-l">Input</div><pre>${k.inp}</pre></div><div><div class="tcx-l">Output</div><pre class="out">Waiting…</pre></div></div></div></div></div>`);
    host.appendChild(k.el);
    const b = $('.tcx-h', k.el), f = $('.fold', k.el);
    b.onclick = () => { const s = f.classList.toggle('shut'); k.el.classList.toggle('open', !s); b.setAttribute('aria-expanded', !s); };
  });
  stagger($$('.tcx-c', r), 90, 200);
  c.run(async () => {
    await c.wait(600);
    for (const k of calls){
      $('.g', k.el).innerHTML = '<span class="spin" style="width:10px;height:10px"></span>'; swap($('.tt', k.el), 'Running');
      $('.tcx-ic', k.el).innerHTML = '<span class="radar" style="color:var(--fg)"></span>';
      await c.wait(1300);
      $('.tcx-ic', k.el).innerHTML = I(k.ic,'xs'); $('pre.out', k.el).innerHTML = k.out;
      $('.g', k.el).innerHTML = `<span style="color:var(--ok)">${I('check','xs')}</span>`; swap($('.tt', k.el), k.ms);
    }
    $('.tcx-end', r).classList.add('in');
    // the preview opens the first call to show what came back, unless you have taken over
    if (!c.mine) $('.tcx-h', calls[0].el).click();
  });
});
/* ---------- Tool call designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and Call stack, Inline and
   Inspector are three directions under review. Picking one draws it where the component sits and plays its demo from the
   start, as Animate does. The switch is the card's alone: inside another component (Agent harness's chat) the tool call is
   Classic, and the registry, the code view and the component page install Classic (build.js leaves the switch out of them) */
{
  const classic = DM.defs['tool-call'];
  // one task, four calls: a data tool, Figma, a file edit and GitHub. ms is how long each takes to come back
  const TCC = () => [
    { ns:'billing', fn:'list_plan_changes', ic:'db', lab:'billing', arg:'since 2026-10-01', ms:412,
      in:{ since:'2026-10-01' }, out:{ changed:[{ plan:'Pro', was:19, now:24 }, { plan:'Team', was:44, now:48 }] }, sum:'2 plans changed' },
    { ns:'figma', fn:'get_frame', app:'figma', lab:'Pricing v4', arg:'Pricing v4, Plan cards', ms:860,
      in:{ file:'Pricing v4', frame:'Plan cards' }, out:{ frames:3, updated:'Oct 28' }, sum:'3 frames' },
    { ns:'files', fn:'edit', ic:'edit', lab:'Pricing.tsx', arg:'src/Pricing.tsx, 6 lines', ms:1200, ask:true,
      in:{ path:'src/Pricing.tsx', lines:6 }, out:{ changed:6, saved:true }, sum:'6 lines changed' },
    { ns:'github', fn:'create_pull_request', app:'github', lab:'#412', arg:'Update plan prices', ms:640,
      in:{ title:'Update plan prices', base:'main' }, out:{ number:412, state:'open' }, sum:'#412 opened' }
  ];
  const mark = k => k.app ? BRAND[k.app] : I(k.ic, 'xs');
  const tile = k => `<span class="tcx-tile${k.app ? ' app' : ''}" aria-hidden="true">${mark(k)}</span>`;
  const name = k => `<code><span>${k.ns}.</span>${k.fn}</code>`;
  const took = ms => ms >= 1000 ? (ms / 1000).toFixed(1) + ' s' : Math.round(ms) + ' ms';
  // JSON with its keys, strings, numbers and booleans marked, as lines
  function json(v){
    const e = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const val = x => typeof x === 'string' ? `<span class="s">"${e(x)}"</span>` : typeof x === 'number' ? `<span class="n">${x}</span>` : typeof x === 'boolean' ? `<span class="b">${x}</span>` : '';
    const obj = o => '{ ' + Object.entries(o).map(([k, x]) => `<span class="k">"${k}"</span>: ${val(x)}`).join(', ') + ' }';
    const lines = ['{'];
    Object.entries(v).forEach(([k, x], i, a) => {
      const end = i < a.length - 1 ? ',' : '';
      if (Array.isArray(x)){ lines.push(`  <span class="k">"${k}"</span>: [`); x.forEach((y, j) => lines.push(`    ${obj(y)}${j < x.length - 1 ? ',' : ''}`)); lines.push(`  ]${end}`); }
      else lines.push(`  <span class="k">"${k}"</span>: ${val(x)}${end}`);
    });
    lines.push('}');
    return lines;
  }

  /* Call stack: the calls on a rail that fills as each returns. Open one to read its input and output, copy it or run it
     again */
  const STACK = () => `<div class="tcx tca" data-d="stack">
  <p class="msg">Updating the pricing page with this month's plan changes.</p>
  <ol class="tca-list" aria-label="Tool calls"></ol>
  <p class="msg tca-end">Two plans changed. The page has the new prices, and the pull request is open.</p>
</div>`;
  function stack(r, c){
    const K = TCC(), list = $('.tca-list', r);
    K.forEach(k => {
      k.el = html(`<li class="tca-c" data-s="wait"><i class="tca-rl" aria-hidden="true"><i></i></i><button class="tca-h" type="button" aria-expanded="false">${tile(k)}<span class="tca-n">${name(k)}<span class="a">${k.arg}</span></span><span class="tca-r"><span class="num ms">Queued</span><span class="g"></span></span><span class="tca-cv">${I('chev-d','xs')}</span></button><div class="fold shut"><div><div class="tca-io"><div class="tca-bar"><div class="seg2" role="group" aria-label="Show"><button type="button" aria-pressed="false" data-v="in">Input</button><button type="button" aria-pressed="true" data-v="out">Output</button></div><span class="sp"></span><span class="tca-note"></span><button class="ib tca-cp" type="button" aria-label="Copy" data-tip="Copy">${I('copy','xs')}</button><button class="ib tca-re" type="button" aria-label="Run again" data-tip="Run again" disabled>${I('refresh','xs')}</button></div><pre class="tcx-json"></pre></div></div></div></li>`);
      list.appendChild(k.el);
      const b = $('.tca-h', k.el), f = $('.fold', k.el), pre = $('pre', k.el);
      f.inert = true; k.view = 'out'; k.lines = null;
      k.toggle = on => { on = on ?? b.getAttribute('aria-expanded') !== 'true'; f.classList.toggle('shut', !on); f.inert = !on; b.setAttribute('aria-expanded', String(on)); k.el.classList.toggle('open', on); };
      b.onclick = () => k.toggle();
      k.paint = () => { pre.innerHTML = k.view === 'in' ? json(k.in).join('\n') : k.lines ? k.lines.join('\n') : k.el.dataset.s === 'run' ? '<span class="cur"></span>' : '<span class="k">Waiting to run</span>'; };
      seg($('.seg2', k.el), v => { k.view = v; k.paint(); });
      $('.tca-cp', k.el).onclick = e => copied(e.currentTarget, JSON.stringify(k.view === 'in' ? k.in : k.out, null, 2));
      $('.tca-re', k.el).onclick = () => { if (k.el.dataset.s === 'done') c.run(() => call(k, true)); };
      k.paint();
    });
    stagger($$('.tca-c', r), 70, 160);
    // up and down move between the calls, Escape folds the open one
    c.on(list, 'keydown', e => { const bs = $$('.tca-h', list), i = bs.indexOf(document.activeElement); if (i < 0) return;
      if (e.key === 'Escape' && bs[i].getAttribute('aria-expanded') === 'true'){ K[i].toggle(false); return; }
      const j = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : null; if (j === null || !bs[j]) return; e.preventDefault(); bs[j].focus(); });
    // a call runs: its tile breathes, its time counts up, then what came back streams in a line at a time
    async function call(k, again){
      const el = k.el, ms = $('.ms', el), g = $('.g', el), re = $('.tca-re', el); re.disabled = true;
      el.dataset.s = 'run'; k.lines = null; g.innerHTML = '<span class="spin"></span>'; k.paint();
      let t = 0; const iv = c.every(100, () => { t += 100 * (k.ms / 1300); ms.textContent = took(Math.min(t, k.ms)); });
      await c.wait(1300); clearInterval(iv);
      const ln = json(k.out); k.lines = [];
      el.dataset.s = 'done'; ms.textContent = took(again ? k.ms * (.8 + Math.random() * .3) : k.ms); g.innerHTML = `<span class="ok">${I('check','xs')}</span>`;
      if (again){ el.classList.remove('again'); void el.offsetWidth; el.classList.add('again'); k.runs = (k.runs || 1) + 1; $('.tca-note', el).textContent = `Ran ${k.runs} times`; }
      for (const l of ln){ k.lines.push(l); if (k.view === 'out') k.paint(); await c.wait(100); }
      re.disabled = false;
    }
    c.run(async () => {
      await c.wait(700);
      for (const k of K) await call(k);
      $('.tca-end', r).classList.add('in');
    });
    // the person in the demo opens the first call once it is back, reads its input and folds it, then runs the last again
    c.story(async s => {
      await s.until(() => K[0].el.dataset.s === 'done'); await s.beat(1);
      await s.tap($('.tca-h', K[0].el)); s.away(); await s.beat(4);
      await s.tap($('[data-v="in"]', K[0].el)); s.away(); await s.beat(3);
      await s.tap($('.tca-h', K[0].el)); s.away();
      await s.until(() => $('.tca-end', r).classList.contains('in')); await s.beat(2);
      await s.tap($('.tca-h', K[3].el)); s.away(); await s.beat(3);
      await s.tap($('.tca-re', K[3].el)); s.away();
      await s.beat(5);
    });
  }

  /* Inline: the calls as chips inside the agent's sentence. Pointing at one previews it; pressing it opens the call under
     the sentence */
  const INLINE = () => `<div class="tcx tcb" data-d="inline">
  <div class="tcb-who"><span class="tcb-av">${I('spark')}</span>Pricing agent<span class="tcb-ws"></span></div>
  <p class="tcb-p" aria-live="polite"></p>
  <div class="fold shut tcb-dw"><div><div class="tcb-dr"></div></div></div>
  <div class="tcb-sum"><span class="tcb-sn num"></span></div>
  <div class="tcb-hc" role="tooltip" hidden></div>
</div>`;
  function inline(r, c){
    const K = TCC(), root = $('.tcb', r), p = $('.tcb-p', r), dw = $('.tcb-dw', r), dr = $('.tcb-dr', r), sn = $('.tcb-sn', r), hc = $('.tcb-hc', r), ws = $('.tcb-ws', r);
    // the sentence the agent writes, with a call where each chip goes
    const S = ['Checking', 0, 'for this month\'s plan changes, then the plan cards in', 1, '. I changed', 2, 'with the new prices and opened', 3, 'for review.'];
    dw.inert = true; let open = null, done = 0, total = 0;
    function chip(k){
      k.el = html(`<button class="fchip lnk tcb-k" type="button" data-s="run" aria-expanded="false" aria-label="${k.ns}.${k.fn}"><span class="t"><span class="spin"></span></span>${k.lab}<span class="m"></span></button>`);
      k.el.onclick = () => show(open === k ? null : k);
      // pointing at a call, or reaching it with the keyboard, previews it
      k.el.addEventListener('pointerenter', e => { if (e.pointerType === 'mouse') peek(k); });
      k.el.addEventListener('pointerleave', () => peek(null));
      k.el.addEventListener('focus', () => { if (k.el.matches(':focus-visible')) peek(k); });
      k.el.addEventListener('blur', () => peek(null));
      return k.el;
    }
    let peekT = 0;
    function peek(k){
      clearTimeout(peekT); if (!k || open === k){ hc.hidden = true; return; }
      peekT = setTimeout(() => {
        if (!k.el.isConnected) return;
        hc.innerHTML = `${name(k)}<div class="row"><span>In</span><span>${Object.values(k.in).join(', ')}</span>${k.res ? `<span>Out</span><span>${k.sum}</span>` : '<span>Out</span><span>Running…</span>'}</div><div class="f">${k.res ? took(k.ms) + ' · press to open' : 'Still running'}</div>`;
        const rb = root.getBoundingClientRect(), b = k.el.getBoundingClientRect();
        hc.hidden = false; const w = hc.offsetWidth;
        hc.style.left = Math.max(0, Math.min(rb.width - w, b.left - rb.left + b.width / 2 - w / 2)) + 'px';
        hc.style.top = (b.bottom - rb.top + 6) + 'px';
      }, 200);
    }
    const flat = o => json(o).slice(1, -1).map(l => l.trim()).join('\n');
    function show(k){
      peek(null);
      if (open) open.el.setAttribute('aria-expanded', 'false');
      open = k; dw.classList.toggle('shut', !k); dw.inert = !k;
      if (!k) return;
      k.el.setAttribute('aria-expanded', 'true');
      dr.innerHTML = `<div class="tcb-dh">${tile(k)}${name(k)}<span class="num">${k.res ? took(k.ms) : 'Running'}</span><button class="ib tcb-cp" type="button" aria-label="Copy the call" data-tip="Copy">${I('copy','xs')}</button><button class="ib tcb-x" type="button" aria-label="Close" data-tip="Close">${I('x','xs')}</button></div><div class="tcb-flow"><div><span class="l">Input</span><pre class="tcx-json">${flat(k.in)}</pre></div><span class="tcb-wire" aria-hidden="true"><i></i><b></b></span><div><span class="l">Output</span><pre class="tcx-json">${k.res ? flat(k.out) : '<span class="cur"></span>'}</pre></div></div>`;
      $('.tcb-x', dr).onclick = () => { const el = k.el; show(null); el.focus({ preventScroll:true }); };
      $('.tcb-cp', dr).onclick = e => copied(e.currentTarget, JSON.stringify({ tool:`${k.ns}.${k.fn}`, input:k.in, output:k.out }, null, 2));
      dw.classList.remove('go'); void dw.offsetWidth; dw.classList.add('go');
    }
    c.on(r, 'keydown', e => { if (e.key === 'Escape' && open){ const el = open.el; show(null); el.focus({ preventScroll:true }); } });
    // the words come in two at a time
    const words = async t => { const w = t.split(' ').filter(Boolean); for (let i = 0; i < w.length; i += 2){ p.appendChild(html(`<span class="w">${(i ? ' ' : '') + w.slice(i, i + 2).join(' ')}</span>`)); await c.wait(140); } };
    ws.innerHTML = '· <span class="shim">Working</span>';
    c.run(async () => {
      await c.wait(600);
      for (const part of S){
        if (typeof part === 'string'){ if (p.lastChild && p.lastChild.nodeType === 1 && p.lastChild.matches('.tcb-k') && !/^[.,]/.test(part)) p.appendChild(document.createTextNode(' ')); await words(part); continue; }
        const k = K[part]; p.appendChild(document.createTextNode(' ')); p.appendChild(chip(k));
        await c.wait(1100 + k.ms * .4);
        k.res = true; k.el.dataset.s = 'done'; $('.t', k.el).innerHTML = mark(k); $('.m', k.el).textContent = took(k.ms);
        done++; total += k.ms; sn.textContent = `${done} ${done === 1 ? 'tool call' : 'tool calls'} · ${took(total)}`;
        if (open === k) show(k);
      }
      swap(ws, '· Done', false);
    });
    // the person in the demo points at the first call, then opens the edit once every call is back, and closes it
    c.story(async s => {
      await s.until(() => K[0].res); await s.beat(1);
      await s.point(K[0].el); peek(K[0]); await s.beat(4); peek(null);
      await s.until(() => K[3].res); await s.beat(2);
      await s.tap(K[2].el); s.away(); await s.beat(6);
      await s.tap($('.tcb-x', dr)); s.away(); await s.beat(2);
    });
  }

  /* Inspector: a strip of calls, all the same width (owner, 4 Nov), over the call you pick, read as tables or as JSON. The
     edit waits for your OK */
  const INSPECTOR = () => `<div class="tcx tcc panel keep" data-d="inspector">
  <div class="tcc-h"><div class="tcc-ht"><b>Tool calls</b><span class="tcc-st num">Starting</span></div><div class="seg2 tcc-mode" role="group" aria-label="Show as"><button type="button" aria-pressed="true" data-v="table">Table</button><button type="button" aria-pressed="false" data-v="json">JSON</button></div></div>
  <div class="tcc-strip" role="tablist" aria-label="Calls"></div>
  <div class="tcc-view" role="tabpanel"></div>
</div>`;
  function inspector(r, c){
    const K = TCC(), strip = $('.tcc-strip', r), view = $('.tcc-view', r), st = $('.tcc-st', r);
    let sel = 0, mode = 'table', spent = 0, stopped = false, follow = true;
    K.forEach((k, i) => {
      k.s = 'wait';
      k.el = html(`<button class="tcc-s" type="button" role="tab" aria-selected="${i === 0}" tabindex="${i === 0 ? 0 : -1}" data-s="wait" aria-label="${k.ns}.${k.fn}"><span class="tcc-ic" aria-hidden="true">${mark(k)}</span><span class="n">${k.ns}</span><span class="dot tcc-dt" aria-hidden="true"></span><i class="tcc-pr" aria-hidden="true"></i></button>`);
      // the inspector follows the call at work until you pick one yourself
      strip.appendChild(k.el); k.el.onclick = () => { if (c.mine) follow = false; pick(i, true); };
    });
    seg($('.tcc-mode', r), v => { mode = v; paint(); });
    c.on(strip, 'keydown', e => { const to = e.key === 'ArrowRight' ? sel + 1 : e.key === 'ArrowLeft' ? sel - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? K.length - 1 : null; if (to === null) return; e.preventDefault(); const j = (to + K.length) % K.length; pick(j, true); K[j].el.focus(); });
    // a value as a table: each key beside its value, and a list of plans as rows
    function table(o){
      const arr = Object.values(o).find(Array.isArray);
      if (arr) return `<table class="tcc-tb"><thead><tr><th scope="col">Plan</th><th scope="col">Was</th><th scope="col">Now</th></tr></thead><tbody>${arr.map(x => `<tr><td>${x.plan}</td><td>$${x.was}</td><td>$${x.now}</td></tr>`).join('')}</tbody></table>`;
      return `<div class="tcc-kv">${Object.entries(o).map(([k, v]) => `<span>${k}</span><span>${v}</span>`).join('')}</div>`;
    }
    const as = o => mode === 'json' ? `<pre class="tcx-json">${json(o).join('\n')}</pre>` : table(o);
    const TAG = { wait:'<span class="tag">Queued</span>', run:'<span class="tag"><span class="spin"></span>Running</span>', ask:'<span class="tag warn">Needs you</span>', done:`<span class="tag ok">${I('check','xs')}Done</span>`, deny:'<span class="tag bad">Denied</span>', skip:'<span class="tag">Skipped</span>' };
    function paint(fresh){
      const k = K[sel], wait = '<div class="tcc-wait" aria-label="Waiting for the result"><i style="width:68%"></i><i style="width:46%"></i></div>';
      const out = k.s === 'done' ? as(k.out) : k.s === 'deny' ? '<div class="tcc-kv"><span>result</span><span>Not run, you said no</span></div>' : k.s === 'skip' ? '<div class="tcc-kv"><span>result</span><span>Not run</span></div>' : wait;
      const ask = k.s === 'ask' ? `<div class="tcc-ask" role="group" aria-label="Approve the edit"><p>Wants to change 6 lines in <span class="fchip"><span class="ft re">TSX</span>Pricing.tsx</span></p><pre class="tcx-json"><span class="x">− price: 19,</span>\n<span class="a">+ price: 24,</span></pre><div class="tcc-acts"><button class="pill primary sm tcc-ok" type="button">Allow once</button><button class="pill line sm tcc-al" type="button">Always allow</button><button class="pill ghost sm tcc-no" type="button">Deny</button></div></div>` : '';
      view.innerHTML = `<div class="tcc-in${fresh ? ' go' : ''}"><div class="tcc-dh">${tile(k)}${name(k)}<span class="num">${k.s === 'done' ? took(k.ms) : ''}</span>${TAG[k.s]}</div>${ask}<div class="tcc-sec"><span class="l">Input<button class="ib tcc-cp" type="button" aria-label="Copy the input" data-tip="Copy">${I('copy','xs')}</button></span>${as(k.in)}</div>${ask ? '' : `<div class="tcc-sec"><span class="l">Output</span>${out}</div>`}</div>`;
      $('.tcc-cp', view).onclick = e => copied(e.currentTarget, JSON.stringify(k.in, null, 2));
      if (ask){ $('.tcc-ok', view).onclick = () => decide('ok'); $('.tcc-al', view).onclick = () => decide('ok'); $('.tcc-no', view).onclick = () => decide('no'); }
    }
    let decide = () => {};
    function pick(i, user){ const ch = i !== sel; sel = i; K.forEach((k, j) => { k.el.setAttribute('aria-selected', String(j === i)); k.el.tabIndex = j === i ? 0 : -1; }); paint(ch || !user); }
    const set = (k, s) => { k.s = s; k.el.dataset.s = s; if (K[sel] === k) paint(); };
    const line = () => { const n = K.filter(k => k.s === 'done').length; st.textContent = `${n} of ${K.length} done · ${took(spent)}`; };
    pick(0);
    c.run(async () => {
      await c.wait(700);
      for (const k of K){
        if (stopped){ set(k, 'skip'); continue; }
        if (follow && sel !== K.indexOf(k)) pick(K.indexOf(k));
        if (k.ask){
          set(k, 'ask'); st.textContent = 'Waiting for you';
          const ok = await new Promise(res => { decide = v => { decide = () => {}; res(v === 'ok'); }; c.auto(5200, () => decide('ok')); });
          if (!ok){ set(k, 'deny'); stopped = true; line(); continue; }
        }
        set(k, 'run'); let t = 0;
        const iv = c.every(50, () => { t = Math.min(1, t + 50 / 1300); k.el.style.setProperty('--p', t.toFixed(3)); });
        await c.wait(1300); clearInterval(iv); k.el.style.setProperty('--p', 1);
        spent += k.ms; set(k, 'done'); line();
      }
      st.textContent = stopped ? 'Stopped before the edit' : `All ${K.length} done · ${took(spent)}`;
    });
    // the person in the demo allows the edit, then reads the first call back, as JSON and as a table
    c.story(async s => {
      await s.until(() => K[2].s === 'ask'); await s.beat(3);
      await s.tap($('.tcc-ok', view)); s.away();
      await s.until(() => K[3].s === 'done'); await s.beat(2);
      await s.tap(K[0].el); s.away(); await s.beat(3);
      await s.tap($('[data-v="json"]', r)); s.away(); await s.beat(4);
      await s.tap($('[data-v="table"]', r)); s.away(); await s.beat(2);
    });
  }

  /* the switch: the design the card last showed (Classic to begin with) is drawn, and picking another starts the card again
     with it, as Animate does. A key that picked it leaves the focus on the switch */
  const D = { stack:[STACK, stack], inline:[INLINE, inline], inspector:[INSPECTOR, inspector] };
  const again = card => window.V2 && card.dataset.v2 ? window.V2.replay(card) : DM.mount(card);
  DM.def('tool-call', (r, c, card) => {
    const dm = $(':scope>.tcx-dm', r);
    if (!dm) return classic(r, c, card);
    if (r !== c.st || !card){ dm.replaceWith(...$(':scope>.dm-main', dm).childNodes); return classic(r, c, card); }
    const v = D[card._design] ? card._design : 'classic';
    if (v === 'classic') classic(r, c, card);
    else { const main = $(':scope>.dm-main', dm); main.innerHTML = D[v][0](); D[v][1](main, c); }
    const sg = $(':scope>.tcx-dm>.demo .seg2', r);
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    seg(sg, d => { if (d === v) return; card._design = d; card._designKey = sg.contains(document.activeElement) && document.activeElement.matches(':focus-visible'); again(card); });
    if (card._designKey){ card._designKey = false; setTimeout(() => { const b = !c.dead && $('[aria-pressed="true"]', sg); if (b) b.focus({ preventScroll:true }); }, 120); }
  });
}
/* ---------- Artifact card ---------- */
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
  const ic = (n, s = '') => `<svg class="i${s ? ' ' + s : ''}" aria-hidden="true"><use href="#v2i-${n}"/></svg>`;
  const uid = () => 'afx' + Math.random().toString(36).slice(2, 9);
  const whenHTML = v => `<span class="afx-ed">edited </span>${esc(v.ago)}`;
  const meta = (a, i) => `${a.kind} · v${i + 1} · ${a.versions[i].when}`;
  const cssMs = (el, v, f = 1) => { const s = getComputedStyle(el).getPropertyValue(v).trim(); return (s.endsWith('ms') ? parseFloat(s) : parseFloat(s) * 1000) * f || 300; };
  const cssEase = el => getComputedStyle(el).getPropertyValue('--ease').trim() || 'ease';
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
    const pan = $('.afx-pan', layer), scrim = $('.afx-scrim', layer), D = cssMs(root, '--t', kind === 'page' ? 1.3 : 1.1), E = cssEase(root);
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
    const fill = i => { $$('.afx-pv-ls i', main).forEach((e, j) => e.style.setProperty('--w', W[i % 3][j] + '%')); };
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
    const lines = j => LINES[j === top ? 2 : j % 2].map(([t, w]) => t === 's' ? '<span class="afx-gap"></span>' : `<span class="afx-r ${t}">${t === 'p' ? '' : '<b></b>'}<i style="--w:${w}%"></i></span>`).join('');
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
      if (fanned){ const o = j - (N - 1) / 2; sh.style.transform = `translate(calc(${o} * var(--fx)),${Math.abs(o) * 6 + (peek === j ? -8 : 0)}px) rotate(${o * 6}deg)`; sh.style.zIndex = peek === j ? 9 : j + 1; }
      else { const rest = sheets.map((x, y) => y).reverse().filter(y => y !== m.i), d = j === m.i ? 0 : rest.indexOf(j) + 1; sh.style.transform = ''; sh.style.setProperty('--d', d); sh.style.zIndex = N - d; }
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
      if (!REDUCE) sh.animate([{ transform:'translateY(-36px)', opacity:0 }, { transform:'none', opacity:1 }], { duration:cssMs(root, '--t-slow'), easing:E, composite:'add' });
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
      if (!REDUCE) sh.animate([{ transform:'translateY(-6px)' }, { transform:'none' }], { duration:cssMs(root, '--t'), easing:E, composite:'add' });
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
/* ---------- Prompt starters ---------- */
DM.def('prompt-starters', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{up}', I('up')).replace('{shuffle}', I('refresh','xs'));
  const sets = [
    [['grid','var(--pb)','var(--pb-bg)','Audit a page','Check the pricing page for spacing and contrast','Audit pricing for spacing and contrast'],['edit','var(--pl)','var(--pl-bg)','Rewrite copy','Make the onboarding intro shorter','Make the onboarding intro shorter'],['code','var(--pm)','var(--pm-bg)','Export tokens','Turn colour and spacing into CSS variables','Export the tokens as CSS variables'],['layers','var(--pp)','var(--pp-bg)','Compare frames','Diff the mobile and desktop frames','Diff the mobile and desktop frames']],
    [['chart','var(--pt)','var(--pt-bg)','Explain a metric','Why did activation drop last week','Why did activation drop last week?'],['mail','var(--pk)','var(--pk-bg)','Draft an email','Announce the new pricing to customers','Announce the new pricing by email'],['bug','var(--pr)','var(--pr-bg)','Find a bug','Trace why checkout logs people out','Fix checkout logging people out'],['figma','var(--pl)','var(--pl-bg)','Build from Figma','Turn the hero frame into code','Build the hero frame in React']]
  ];
  let si = 0;
  const grid = $('.psx-grid', r), tx = $('.psx-tx', r), inp = $('.psx-in', r), go = $('.psx-go', r);
  function paint(){
    grid.innerHTML = sets[si].map((s, i) => `<button class="psx-c" data-i="${i}"><span class="psx-ic" style="color:${s[1]};background:${s[2]}">${I(s[0] === 'bug' ? 'alert' : s[0])}</span><b>${s[3]}</b><span class="d">${s[4]}</span></button>`).join('');
    stagger($$('.psx-c', grid), 60);
    $$('.psx-c', grid).forEach(b => b.onclick = () => pick(b));
  }
  let k = null;
  function pick(b){
    $$('.psx-c', grid).forEach(x => x.classList.toggle('on', x === b));
    if (k) k.stop(); k = ctl(c); const kk = k; c.offs.push(() => kk.stop());
    tx.innerHTML = ''; inp.classList.add('has'); go.disabled = false;
    kk.run(async () => { for (const w of sets[si][b.dataset.i][5].split(' ')){ tx.insertAdjacentHTML('beforeend', `<span class="w">${w} </span>`); await kk.wait(40); } });
  }
  $('.psx-sh', r).onclick = () => { si = (si + 1) % sets.length; tx.innerHTML = ''; inp.classList.remove('has'); go.disabled = true; paint(); };
  go.onclick = () => { tx.innerHTML = '<span class="w">Sent to the agent</span>'; go.disabled = true; $$('.psx-c', grid).forEach(x => x.classList.remove('on')); };
  // the box starts empty: a starter fills it when someone picks one, in one short line
  paint();
});
/* ---------- Attachment tray ---------- */
DM.def('attachment-tray', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{upload}', I('upload'));
  const drop = $('.atx-drop', r), list = $('.atx-list', r), sum = $('.atx-sum', r);
  const kind = n => { const e = (n.split('.').pop() || '').toLowerCase(); return e === 'pdf' ? ['PDF','var(--pr)','var(--pr-bg)'] : /png|jpg|jpeg|gif|webp|fig/.test(e) ? [e.toUpperCase().slice(0,3),'var(--pl)','var(--pl-bg)'] : /csv|xlsx/.test(e) ? ['CSV','var(--pm)','var(--pm-bg)'] : [e.toUpperCase().slice(0,3) || 'TXT','var(--pb)','var(--pb-bg)']; };
  const size = b => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  let read = 0;
  // a file uploads (its row fills with its hue and its ring closes), then the agent reads it and says what it found
  function add(name, bytes, i = 0, found){
    const k = kind(name), sz = size(bytes);
    const it = html(`<div class="atx-it" style="--c:${k[1]};--cb:${k[2]}"><span class="atx-ti">${k[0]}</span><span class="atx-n"><span class="atx-nm">${esc(name)}</span><span class="atx-m"><span>${sz} · <span class="num pc">0%</span></span></span></span><svg class="atx-ring" viewBox="0 0 22 22" role="progressbar" aria-label="Uploading ${esc(name).replace(/"/g, '&quot;')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><circle cx="11" cy="11" r="8" fill="none" stroke="var(--line)" stroke-width="2"/><circle cx="11" cy="11" r="8" fill="none" stroke="${k[1]}" stroke-width="2" stroke-linecap="round" stroke-dasharray="50.3" stroke-dashoffset="50.3" transform="rotate(-90 11 11)"/></svg><button class="ib" aria-label="Remove ${esc(name).replace(/"/g, '&quot;')}" data-tip="Remove">${I('x','xs')}</button></div>`);
    list.appendChild(it); enter(it, i * 80);
    $('.ib', it).onclick = () => { it.classList.add('leave'); setTimeout(() => it.remove(), 320); };
    const svg = $('.atx-ring', it), ring = $$('circle', it)[1], m = $('.atx-m', it); let p = 0;
    const iv = c.every(70, () => {
      p = Math.min(1, p + .025 + Math.random() * .05); ring.style.strokeDashoffset = 50.3 * (1 - p);
      it.style.setProperty('--p', (p * 100).toFixed(1) + '%'); svg.setAttribute('aria-valuenow', Math.round(p * 100)); const pc = $('.pc', m); if (pc) pc.textContent = Math.round(p * 100) + '%';
      if (p < 1) return;
      clearInterval(iv); it.classList.add('up');
      // reading: the ring gives way to a spinner and the line shimmers, then says what the agent found
      svg.outerHTML = '<span class="atx-rd"><span class="spin"></span></span>'; swap(m, `<span class="shim">${sz} · Reading</span>`, true);
      c.later(REDUCE ? 0 : 900, () => {
        const rd = $('.atx-rd', it); if (rd) rd.outerHTML = `<span class="atx-ok">${I('ok')}</span>`;
        swap(m, found ? `${sz} · ${found}` : sz); read++; swap(sum, 'The agent can read ' + read + (read > 1 ? ' files' : ' file') + ' now');
      });
    });
  }
  const samples = () => [['brief.pdf', 2.4e6, '12 pages'],['Pricing.fig', 8.1e6, '6 frames'],['signups.csv', 3.2e5, '1,204 rows']].forEach((f, i) => add(f[0], f[1], i, f[2]));
  $('.atx-sample', r).onclick = e => { e.preventDefault(); samples(); };
  $('.atx-file', r).onchange = e => { Array.from(e.target.files).forEach((f, i) => add(f.name, f.size, i)); e.target.value = ''; };
  ['dragenter','dragover'].forEach(ev => c.on(drop, ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave','drop'].forEach(ev => c.on(drop, ev, () => drop.classList.remove('over')));
  c.on(drop, 'drop', e => { e.preventDefault(); Array.from(e.dataTransfer.files).forEach((f, i) => add(f.name, f.size, i)); });
  /* the dashed edge follows the drop zone's size and corners, with the dashes spaced to meet evenly all the way round */
  const ants = $('.atx-ants rect', r);
  const fit = () => {
    const w = drop.offsetWidth, h = drop.offsetHeight; if (!w || !h) return;
    const k = .75, rad = Math.max(0, Math.min(parseFloat(getComputedStyle(drop).borderTopLeftRadius) || 0, w / 2, h / 2) - k);
    ants.setAttribute('x', k); ants.setAttribute('y', k); ants.setAttribute('width', w - 2 * k); ants.setAttribute('height', h - 2 * k); ants.setAttribute('rx', rad);
    const per = 2 * (w + h - 4 * k) - (8 - 2 * Math.PI) * rad, step = per / Math.max(8, Math.round(per / 11));
    ants.style.setProperty('--ap', step + 'px'); ants.style.setProperty('--ag', (step - 4.5) + 'px');
  };
  fit(); const ro = new ResizeObserver(fit); ro.observe(drop); c.offs.push(() => ro.disconnect());
  /* once it has entered, three sample files are dragged over, drop in and upload, so the tray shows what it does */
  c.run(async () => {
    await c.step(950); if (list.children.length) return;
    drop.classList.add('over'); c.taken(() => drop.classList.remove('over')); await c.step(1300); drop.classList.remove('over');
    if (!list.children.length) samples();
  });
});
/* ---------- Attachment tray designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and Composer (files riding
   in the message box) and Context budget (what each file costs the agent's context) are the directions under review. The
   card keeps the pick (card._dv), so Replay and the story's next round play the same design, and a new pick plays it from
   the start. The switch is the card's alone: inside another component the tray is Classic, and the registry, the code view
   and the component page install Classic (build.js leaves the switch out of them) */
{
  const classic = DM.defs['attachment-tray'];
  // the three sample files Composer and Context budget take: what the agent finds in each, and what each costs the agent's
  // context in tokens (the sheet is too big to read whole, so the agent keeps its first rows)
  const ATX_FILES = () => [
    { n:'brief.pdf', sz:2.4e6, found:'12 pages', tk:18600, facts:['12 pages', 'Pricing, p.4', '3 tables'], more:'Goals, audience, pricing and timeline' },
    { n:'Pricing.fig', sz:8.1e6, found:'6 frames', tk:9400, facts:['6 frames', '3 plan cards'], more:'Cover, plans, mobile, specs, 2 more' },
    { n:'signups.csv', sz:3.2e5, found:'1,204 rows', tk:96000, cut:800, facts:['1,204 rows', '5 columns'], more:'date, plan, seats, country, source' }
  ];
  const atxType = n => { const e = (n.split('.').pop() || '').toLowerCase(); return e === 'pdf' ? 'pdf' : e === 'fig' ? 'fig' : /^(csv|xlsx|tsv)$/.test(e) ? 'csv' : /^(png|jpe?g|gif|webp|svg)$/.test(e) ? 'img' : 'doc'; };
  const atxLabel = t => ({ pdf:'PDF', fig:'FIG', csv:'CSV', img:'IMG', doc:'DOC' })[t];
  const atxSize = b => b >= 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
  const atxEsc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  const atxTk = n => n >= 1000 ? (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k' : String(n);
  const atxIcon = t => I({ pdf:'file-text', fig:'layers', csv:'table', img:'image', doc:'file' }[t] || 'file', 'xs');
  // a grey picture of what is in a file
  function atxArt(t){
    if (t === 'pdf') return `<svg class="atx-art" viewBox="0 0 64 60" aria-hidden="true"><rect class="pg" x="6" y="2" width="52" height="64" rx="3"/><rect class="ed" x="6.5" y="2.5" width="51" height="63" rx="3"/><rect class="ac" x="12" y="9" width="26" height="5" rx="1.5"/><rect class="ln" x="12" y="19" width="40" height="3" rx="1.5"/><rect class="ln" x="12" y="25" width="36" height="3" rx="1.5"/><rect class="ln" x="12" y="31" width="38" height="3" rx="1.5"/><rect class="ac2" x="12" y="38" width="18" height="14" rx="2"/><rect class="ln" x="33" y="39" width="18" height="3" rx="1.5"/><rect class="ln" x="33" y="45" width="14" height="3" rx="1.5"/></svg>`;
    if (t === 'fig') return `<svg class="atx-art" viewBox="0 0 64 60" aria-hidden="true"><rect class="pg" x="2" y="4" width="60" height="62" rx="4"/><rect class="ed" x="2.5" y="4.5" width="59" height="61" rx="4"/><rect class="ac2" x="8" y="12" width="14" height="24" rx="2"/><rect class="ac" x="25" y="9" width="14" height="30" rx="2"/><rect class="ac2" x="42" y="12" width="14" height="24" rx="2"/><rect class="ln" x="8" y="44" width="48" height="3" rx="1.5"/><rect class="ln" x="8" y="50" width="30" height="3" rx="1.5"/></svg>`;
    if (t === 'csv') return `<svg class="atx-art" viewBox="0 0 64 60" aria-hidden="true"><rect class="pg" x="4" y="4" width="56" height="62" rx="3"/><rect class="ac" x="4" y="4" width="56" height="9" rx="3"/><g class="gd"><path d="M4 22h56M4 31h56M4 40h56M4 49h56M18 4v62M32 4v62M46 4v62"/></g><rect class="ed" x="4.5" y="4.5" width="55" height="61" rx="3"/><rect class="ac2" x="33" y="32" width="12" height="7"/></svg>`;
    if (t === 'img') return `<svg class="atx-art" viewBox="0 0 64 60" aria-hidden="true"><rect class="ac2" x="2" y="4" width="60" height="62" rx="4"/><circle class="pg" cx="46" cy="18" r="6"/><path class="ac" d="M2 52 20 30l12 14 8-8 22 22v10H2z"/></svg>`;
    return `<svg class="atx-art" viewBox="0 0 64 60" aria-hidden="true"><rect class="pg" x="8" y="2" width="48" height="64" rx="3"/><rect class="ed" x="8.5" y="2.5" width="47" height="63" rx="3"/><rect class="ln" x="14" y="12" width="34" height="3" rx="1.5"/><rect class="ln" x="14" y="19" width="30" height="3" rx="1.5"/><rect class="ln" x="14" y="26" width="32" height="3" rx="1.5"/></svg>`;
  }
  // a file goes up: progress p from 0 to 1, each(p) ten times a second on the way, faster for a small file. It runs on the
  // demo's clock, so a mouse resting on the component holds it there
  function atxUpload(c, bytes, each){ return new Promise(res => { let p = 0; const iv = c.every(100, () => { p = Math.min(1, p + .04 + Math.random() * .06 * Math.max(.5, 3e6 / Math.max(bytes, 3e5) / 4)); each(p); if (p >= 1){ clearInterval(iv); res(); } }); }); }
  // files dragged over a target light it up (cls), and a drop hands them to on(); dropping files is the visitor taking over
  function atxDrop(c, el, on, cls = 'over'){
    ['dragenter', 'dragover'].forEach(ev => c.on(el, ev, e => { e.preventDefault(); el.classList.add(cls); }));
    ['dragleave', 'drop'].forEach(ev => c.on(el, ev, e => { if (ev === 'dragleave' && el.contains(e.relatedTarget)) return; el.classList.remove(cls); }));
    c.on(el, 'drop', e => { e.preventDefault(); if (e.isTrusted) c.mine = true; on(Array.from(e.dataTransfer.files).map(f => ({ n:f.name, sz:f.size }))); });
  }

  // Composer's empty tray: files dropping into a tray, drawn on a floor grid in one isometric view like Banner's drawings.
  // .gd is the floor, dashed; .pl are faces that hide what is behind them; .ln the lines, .tx the lighter ones; the top
  // sheet's edge (.ac) is the accent. The two sheets (.sh) hover, and drop into the tray as files land
  const ATX_CMP_ART = '<path class="gd" d="M53.1 28L18.4 48M60 32L25.4 52M66.9 36L32.3 56M73.9 40L39.2 60M80.8 44L46.1 64M87.7 48L53.1 68M94.6 52L60 72M101.6 56L66.9 76M53.1 28L101.6 56M46.1 32L94.6 60M39.2 36L87.7 64M32.3 40L80.8 68M25.4 44L73.9 72M18.4 48L66.9 76"/>'
    + '<path class="pl tr-f" d="M54.8 30L87.7 49L87.7 55L65.2 68L32.3 49L32.3 43Z"/><path class="ln" d="M54.8 30L87.7 49L65.2 62L32.3 43Z"/><path class="ln" d="M87.7 49L87.7 55L65.2 68L32.3 49L32.3 43"/><path class="ln" d="M65.2 62L65.2 68"/><path class="ln" d="M54.8 33.5L81.7 49L65.2 58.5L38.4 43Z"/><path class="ln tx" d="M38.4 43L38.4 47.5L54.8 38L81.7 53.5L81.7 49M54.8 33.5L54.8 38"/>'
    + '<g class="sh a"><path class="pl" d="M64.1 11.6L73.4 19.9L71.3 25.7L50.7 33.4L37.4 21.6Z"/><path class="ln" d="M64.1 11.6L73.4 19.9L71.3 25.7L50.7 33.4L37.4 21.6ZM73.4 19.9L67.3 22.2L71.3 25.7"/><path class="ln tx" d="M59.6 16.6L67.6 23.7M54.4 18.6L61.1 24.5M49.3 20.5L57.3 27.6"/></g>'
    + '<g class="sh b"><path class="pl" d="M63.1 3.9L76.4 10.1L77.5 16.1L62.1 27.1L43.1 18.2Z"/><path class="ln ac" d="M63.1 3.9L76.4 10.1L77.5 16.1L62.1 27.1L43.1 18.2ZM76.4 10.1L71.8 13.4L77.5 16.1"/><path class="ln tx" d="M61.5 9.5L72.9 14.9M57.7 12.3L66.2 16.3M53.8 15L64.3 19.9"/></g>';
  const atxCmpTpl = () => `<div class="atx-cmp">
    <div class="atx-cmp-box none">
      <div class="atx-cmp-tray">
        <div class="atx-cmp-empty"><svg class="atx-cmp-art" viewBox="0 0 120 80" aria-hidden="true" focusable="false">${ATX_CMP_ART}</svg><p><b>Drop files for the agent</b><span>or press + to add them</span></p></div>
        <div class="atx-cmp-list" role="list" aria-label="Attached files"></div>
      </div>
      <textarea class="atx-cmp-ta" rows="2" aria-label="Message" placeholder="Ask about these files" spellcheck="false"></textarea>
      <div class="atx-cmp-f"><label class="ib atx-cmp-add" data-tip="Add files">${I('plus')}<input type="file" multiple class="atx-pick" aria-label="Add files"></label><span class="atx-cmp-st" aria-live="polite"></span><button class="atx-cmp-send" type="button" aria-label="Send" data-tip="Send" data-tip-k="↵" disabled>${I('up')}</button></div>
      <div class="atx-cmp-over" aria-hidden="true"><span>${I('upload')}Drop to attach</span></div>
    </div>
  </div>`;
  // Composer: drop files on the box, or press +. Each lands in the tray, uploads (its picture unveils from the foot), is read,
  // and is ready to send; drag a file along the tray to move it, or use the arrow keys (Alt moves it), Delete removes it
  function atxComposer(r, c){
    const box = $('.atx-cmp-box', r), tray = $('.atx-cmp-list', r), empty = $('.atx-cmp-empty', r), st = $('.atx-cmp-st', r), ta = $('.atx-cmp-ta', r), send = $('.atx-cmp-send', r);
    const files = [];
    const status = () => { const up = files.filter(f => f.done).length, all = files.length; st.textContent = !all ? '' : up < all ? `${up} of ${all} ready` : `${all} ${all === 1 ? 'file' : 'files'} ready to send`; send.disabled = !all || up < all; };
    // the empty tray steps aside as the first files land, and comes back once the last one has gone
    let gone = 0;
    const showEmpty = on => { clearTimeout(gone); box.classList.toggle('none', on); if (on){ empty.hidden = false; requestAnimationFrame(() => empty.classList.remove('out')); } else { empty.classList.add('out'); gone = setTimeout(() => { if (files.length) empty.hidden = true; }, REDUCE ? 0 : 320); } };
    c.offs.push(() => clearTimeout(gone));
    c.on(box, 'animationend', e => { if (e.target === box) box.classList.remove('thud'); });
    function add(list){
      if (!list.length) return;
      if (!files.length) showEmpty(false);
      if (!REDUCE){ box.classList.remove('thud'); void box.offsetWidth; box.classList.add('thud'); }
      list.forEach((f, i) => {
        const t = atxType(f.n);
        f.el = html(`<div class="atx-cmp-it land" role="listitem" tabindex="0" aria-label="${atxEsc(f.n)}, uploading" style="--i:${i};--r:${[-6, 5, -4][i % 3]}deg"><span class="atx-cmp-th">${atxArt(t)}<span class="atx-cmp-veil"></span><span class="atx-cmp-scan"></span><span class="atx-cmp-bd"><span class="tag">${atxLabel(t)}</span></span><span class="atx-cmp-pc num">0%</span><span class="atx-cmp-ok">${I('check','xs')}</span></span><span class="atx-cmp-n">${atxEsc(f.n)}</span><span class="atx-cmp-m">${atxSize(f.sz)}</span><button class="atx-cmp-x" type="button" aria-label="Remove ${atxEsc(f.n)}" data-tip="Remove">${I('x','xs')}</button></div>`);
        // the landing plays once: moved along the tray later, a file doesn't land again
        f.el.addEventListener('animationend', e => { if (e.target === f.el) f.el.classList.remove('land'); });
        tray.appendChild(f.el); files.push(f);
        $('.atx-cmp-x', f.el).onclick = e => { e.stopPropagation(); remove(f); };
        c.run(async () => {
          await c.wait(420 + i * 220);
          await atxUpload(c, f.sz, p => { f.el.style.setProperty('--p', p.toFixed(3)); $('.atx-cmp-pc', f.el).textContent = Math.round(p * 100) + '%'; });
          f.el.classList.add('up', 'read'); swap($('.atx-cmp-m', f.el), '<span class="shim">Reading</span>', true);
          await c.wait(1100 + i * 200);
          f.el.classList.remove('read'); f.el.classList.add('done'); f.done = true; swap($('.atx-cmp-m', f.el), f.found || atxSize(f.sz)); f.el.setAttribute('aria-label', `${f.n}, ${f.found || 'ready'}`);
          status();
        });
      });
      status();
    }
    function remove(f){
      const i = files.indexOf(f); if (i < 0) return; files.splice(i, 1);
      const had = f.el.contains(document.activeElement); f.el.classList.add('gone'); setTimeout(() => f.el.remove(), REDUCE ? 0 : 280);
      const next = files[i] || files[i - 1]; if (had) (next ? next.el : ta).focus({ preventScroll:true });
      if (!files.length) showEmpty(true);
      status();
    }
    // the keyboard: left and right move between files, Alt with them moves a file, Delete or Backspace removes it
    c.on(tray, 'keydown', e => {
      const f = files.find(x => x.el === document.activeElement); if (!f) return; const i = files.indexOf(f);
      if (e.key === 'Delete' || e.key === 'Backspace'){ e.preventDefault(); remove(f); return; }
      const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault();
      const j = i + d; if (j < 0 || j >= files.length) return;
      if (e.altKey){ move(i, j); f.el.focus(); } else files[j].el.focus();
    });
    function move(i, j){ const [f] = files.splice(i, 1); files.splice(j, 0, f); const ref = files[j + 1]; tray.insertBefore(f.el, ref ? ref.el : null); }
    // drag a file along the tray to put it somewhere else: the others make room as it passes them
    let drag = null;
    const W = 92;
    c.on(tray, 'pointerdown', e => { const el = e.target.closest('.atx-cmp-it'); if (!el || e.target.closest('.atx-cmp-x')) return; const f = files.find(x => x.el === el); if (f) drag = { f, x:e.clientX, on:false, id:e.pointerId }; });
    c.on(tray, 'pointermove', e => {
      if (!drag) return; const dx = e.clientX - drag.x;
      if (!drag.on && Math.abs(dx) > 5){ drag.on = true; drag.f.el.classList.add('drag'); tray.setPointerCapture(drag.id); }
      if (!drag.on) return;
      drag.f.el.style.transform = `translateX(${dx}px)`;
      const i = files.indexOf(drag.f), j = Math.max(0, Math.min(files.length - 1, i + Math.round(dx / W)));
      files.forEach((g, k) => { if (g === drag.f) return; const shift = (k > i && k <= j) ? -W : (k < i && k >= j) ? W : 0; g.el.style.transform = shift ? `translateX(${shift}px)` : ''; });
      drag.to = j;
    });
    const drop = () => { if (!drag) return; const d = drag; drag = null; if (!d.on) return; files.forEach(g => { g.el.style.transform = ''; }); d.f.el.classList.remove('drag'); const i = files.indexOf(d.f); if (d.to !== undefined && d.to !== i) move(i, d.to); };
    c.on(tray, 'pointerup', drop); c.on(tray, 'pointercancel', drop);
    $('.atx-pick', r).onchange = e => { add(Array.from(e.target.files).map(f => ({ n:f.name, sz:f.size }))); e.target.value = ''; };
    atxDrop(c, box, add);
    // Enter sends, as the button's tip says; Shift with Enter starts a new line
    c.on(ta, 'keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing){ e.preventDefault(); send.click(); } });
    send.onclick = () => { if (send.disabled) return; send.disabled = true; send.innerHTML = '<span class="spin"></span>'; c.later(700, () => { send.innerHTML = I('check'); st.textContent = 'Sent with ' + files.length + (files.length === 1 ? ' file' : ' files'); c.later(1400, () => { send.innerHTML = I('up'); }); }); };
    // the demo: the empty tray, then three files dragged over the box, dropped, landing and going up
    c.run(async () => {
      await c.step(1500);
      box.classList.add('over'); c.taken(() => box.classList.remove('over'));
      await c.step(1300); box.classList.remove('over');
      if (!files.length) add(ATX_FILES());
    });
    c.story(async s => {
      await s.until(() => files.length === 3 && files.every(f => f.done)); await s.beat(1);
      await s.tap(ta); s.away();
      await s.type(ta, 'Which plan do most sign-ups pick?', { n:.08, keep:true });
      await s.beat(1); files[1].el.classList.add('peek'); await s.point(files[1].el); await s.beat(2);
      await s.tap($('.atx-cmp-x', files[1].el)); s.away(); await s.beat(2);
      await s.tap(send); s.away(); await s.beat(4);
    });
  }

  const atxCtxTpl = () => `<div class="atx-ctx panel">
    <div class="atx-ctx-h"><div class="atx-ctx-ht"><b>Context</b><span class="atx-ctx-st num">4k of 128k tokens</span></div><span class="atx-ctx-pc num">3%</span></div>
    <div class="atx-ctx-bar" role="img" aria-label="Context window, 4k of 128k tokens used"><i class="sys" style="--a:0;--b:3.1"></i><span class="atx-ctx-segs"></span></div>
    <div class="atx-ctx-key"><span><i></i>Instructions 4k</span><span class="atx-ctx-free">124k free</span></div>
    <ol class="atx-ctx-list" aria-label="Files"></ol>
    <label class="atx-ctx-drop"><input type="file" multiple class="atx-pick" aria-label="Add files">${I('plus','xs')}<span>Drop files or <u>browse</u></span></label>
  </div>`;
  // Context budget: each file uploads (a line grows under its icon), then the agent counts its tokens and its share of the window grows.
  // A switch leaves a file out, its name opens what the agent found, and a file too big to read whole says what it keeps
  function atxBudget(r, c){
    const list = $('.atx-ctx-list', r), segs = $('.atx-ctx-segs', r), bar = $('.atx-ctx-bar', r), st = $('.atx-ctx-st', r), pc = $('.atx-ctx-pc', r), free = $('.atx-ctx-free', r), dz = $('.atx-ctx-drop', r);
    const WIN = 128000, SYS = 4000, files = [];
    // what a file takes: its tokens, or for one too big to read whole, the part the agent keeps (a quarter of the window)
    const cost = f => !f.on ? 0 : f.cut ? 32000 : f.tk;
    function total(){
      let used = SYS, at = SYS / WIN * 100;
      files.forEach(f => { const v = f.live ? Math.round(cost({ ...f, on:true }) * f.p) : cost(f), w = v / WIN * 100; used += v; f.seg.style.setProperty('--a', at.toFixed(2)); f.seg.style.setProperty('--b', (at + w).toFixed(2)); at += w; });
      const u = `${atxTk(used)} of 128k tokens`;
      if (st.textContent !== u){ st.textContent = u; bar.setAttribute('aria-label', `Context window, ${u} used`); }
      pc.textContent = Math.round(used / WIN * 100) + '%'; free.textContent = atxTk(WIN - used) + ' free';
    }
    function add(more){
      more.forEach((f, i) => {
        const t = atxType(f.n); f.on = true; f.p = 0; f.live = true; f.tk = f.tk || Math.round(f.sz / 4);
        // each file's share takes the next step of the accent, and its row a dot in the same step
        const step = `--c:var(--a${1 + files.length % 4})`;
        f.seg = html(`<i class="live" style="${step}"></i>`); segs.appendChild(f.seg);
        f.el = html(`<li class="atx-ctx-it atx-popin" style="${step};animation-delay:${i * 90}ms"><div class="atx-ctx-r"><span class="atx-ctx-ic">${atxIcon(t)}<span class="atx-ctx-up" aria-hidden="true"></span></span><span class="atx-ctx-tx"><button type="button" aria-expanded="false" disabled><span>${atxEsc(f.n)}</span>${I('chev-d','xs')}</button><span class="atx-ctx-m">${atxSize(f.sz)} · uploading</span></span><span class="dot atx-ctx-kd" aria-hidden="true"></span><span class="atx-ctx-tk num">–</span><button class="toggle" type="button" role="switch" aria-checked="true" aria-label="Include ${atxEsc(f.n)}" data-tip="Include in context"></button></div><div class="fold shut"><div><div class="atx-ctx-det"></div></div></div></li>`);
        list.appendChild(f.el); files.push(f);
        const tg = $('.toggle', f.el), fb = $('.atx-ctx-tx button', f.el), fold = $('.fold', f.el); fold.inert = true;
        tg.onclick = () => { f.on = !f.on; tg.setAttribute('aria-checked', String(f.on)); f.el.classList.toggle('off', !f.on); f.seg.style.opacity = f.on ? '' : '0'; total(); };
        fb.onclick = () => { const on = fb.getAttribute('aria-expanded') !== 'true'; fb.setAttribute('aria-expanded', String(on)); fold.classList.toggle('shut', !on); fold.inert = !on; };
        c.run(async () => {
          await c.wait(i * 300);
          await atxUpload(c, f.sz, p => { f.el.style.setProperty('--p', p.toFixed(3)); });
          f.el.classList.add('up'); swap($('.atx-ctx-m', f.el), '<span class="shim">Counting tokens</span>', true);
          // the tokens count up as the agent reads it, and its share of the window grows with them, ten times a second
          const tk = $('.atx-ctx-tk', f.el), n = REDUCE ? 1 : 11;
          await new Promise(res => { let k = 0; const iv = c.every(100, () => { k++; const p = Math.min(1, k / n); f.p = 1 - Math.pow(1 - p, 3); tk.textContent = atxTk(Math.round(cost({ ...f, on:true }) * f.p)); total(); if (p >= 1){ clearInterval(iv); res(); } }); });
          f.live = false; f.seg.classList.remove('live'); if (f.cut) f.seg.classList.add('cut'); total();
          fb.disabled = false;
          $('.atx-ctx-det', f.el).innerHTML = (f.cut ? `<p>Too big to read whole: the agent keeps the first ${f.cut.toLocaleString('en-US')} rows.</p>` : f.more ? `<p>${atxEsc(f.more)}</p>` : '') + (f.facts || []).map(x => `<span class="tag">${atxEsc(x)}</span>`).join('');
          swap($('.atx-ctx-m', f.el), f.cut ? `${atxSize(f.sz)} · <span class="w">first ${f.cut.toLocaleString('en-US')} rows</span>` : `${atxSize(f.sz)} · ${f.found || 'read'}`, true);
        });
      });
    }
    $('.atx-pick', r).onchange = e => { add(Array.from(e.target.files).map(f => ({ n:f.name, sz:f.size }))); e.target.value = ''; };
    atxDrop(c, dz, add); atxDrop(c, list, add);
    total();
    c.run(async () => { await c.step(800); if (!files.length) add(ATX_FILES()); });
    c.story(async s => {
      await s.until(() => files.length === 3 && files.every(f => !f.live)); await s.beat(2);
      await s.tap($('.atx-ctx-tx button', files[2].el)); s.away(); await s.beat(4);
      await s.tap($('.toggle', files[1].el)); s.away(); await s.beat(3);
      await s.tap($('.atx-ctx-tx button', files[2].el)); s.away(); await s.beat(3);
    });
  }
  // the switch: the design the card last showed (Classic to begin with) is drawn, and picking another starts the card
  // again with it, as Animate does (on designme.dev through the card's own replay, so its footer tabs follow)
  DM.def('attachment-tray', (r, c, card) => {
    const dm0 = $(':scope>.atx-dm', r);
    if (!dm0) return classic(r, c, card);
    // placed inside another component (the card's own stage is not there), it is Classic, as it was
    if (!c.card){ dm0.replaceWith(...$(':scope>.dm-main', dm0).childNodes); return classic(r, c, card); }
    const D = { composer:[atxComposer, atxCmpTpl], budget:[atxBudget, atxCtxTpl] }, dv = D[c.card._dv] ? c.card._dv : 'classic';
    if (dv === 'classic') classic(r, c, card);
    else { $(':scope>.atx-dm>.dm-main', r).innerHTML = D[dv][1](); D[dv][0](r, c); }
    const sg = $(':scope>.atx-dm>.demo .seg2', r); if (!sg) return;
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === dv)));
    seg(sg, v => { if (v === dv || !(v === 'classic' || D[v])) return; c.card._dv = v; if (window.V2 && c.card.dataset.v2) window.V2.replay(c.card); else DM.mount(c.card); });
  });
}
/* ---------- Response versions ---------- */
DM.def('response-versions', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{l}', I('chev-l')).replace('{rr}', I('chev-r')).replace('{re}', I('refresh')).replace('{cp}', I('copy'));
  const pool = [
    'Pricing that grows with your team. Start free, upgrade when the work gets serious.',
    'One plan per stage of your team. No seat math, no surprises on the invoice.',
    'Design faster with an agent on every plan. Pay for what you ship, not for seats.',
    'Simple pricing for teams who ship. Free to start, fair as you grow.'
  ];
  const vers = [pool[0]]; let cur = 0, busy = false;
  const t = $('.rvx-t', r), n = $('.rvx-n', r), pv = $('.rvx-prev', r), nx = $('.rvx-next', r), re = $('.rvx-re', r), st = $('.rvx-st', r);
  const nav = () => { n.textContent = (cur + 1) + ' / ' + vers.length; pv.disabled = cur === 0 || busy; nx.disabled = cur === vers.length - 1 || busy; };
  async function stream(s){
    t.classList.add('out'); await c.wait(260); t.classList.remove('out'); t.innerHTML = '';
    for (const w of s.split(' ')){ t.insertAdjacentHTML('beforeend', `<span class="w">${w} </span>`); await c.wait(45); }
  }
  async function show(i){ cur = i; nav(); t.classList.add('out'); await c.wait(240); t.classList.remove('out'); t.innerHTML = vers[i].split(' ').map((w, k) => `<span class="w" style="animation-delay:${k * 12}ms">${w} </span>`).join(''); }
  pv.onclick = () => c.run(() => show(cur - 1));
  nx.onclick = () => c.run(() => show(cur + 1));
  re.onclick = () => { if (busy) return; busy = true; re.classList.add('go'); c.later(700, () => re.classList.remove('go'));
    c.run(async () => { swap(st, 'Writing a new version'); st.classList.add('shim');
      const s = pool[vers.length % pool.length]; vers.push(s); cur = vers.length - 1; nav();
      await stream(s); busy = false; nav(); st.classList.remove('shim'); swap(st, ''); }); };
  const cp = $('.rvx-cp', r);
  cp.onclick = () => copied(cp, vers[cur]);
  c.run(async () => { busy = true; nav(); await c.wait(300); await stream(vers[0]); busy = false; nav();
    // then one regenerate plays by itself, so the version count and arrows show what they do, unless you have taken over
    await c.step(1900); if (vers.length === 1) re.click(); });
});
/* ---------- Feedback sheet ---------- */
DM.def('feedback-sheet', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{up}', I('up-thumb')).replace('{dn}', I('down-thumb'));
  const up = $('.fbx-up', r), dn = $('.fbx-dn', r), box = $('.fbx-box', r), st = $('.fbx-st', r), go = $('.fbx-go', r), ta = $('.fbx-ta', r), chips = $$('.fbx-ch .chip', r);
  const ready = () => go.disabled = !(chips.some(x => x.classList.contains('on')) || ta.value.trim());
  chips.forEach(ch => ch.onclick = () => { ch.classList.toggle('on'); ready(); });
  ta.oninput = ready;
  up.onclick = () => { const on = !up.classList.contains('on'); up.classList.toggle('on', on); dn.classList.remove('on'); box.classList.add('shut'); swap(st, on ? 'Thanks, noted' : ''); };
  // the demo opens the sheet without taking the focus from wherever you are on the page
  const down = focus => { const on = !dn.classList.contains('on'); dn.classList.toggle('on', on); up.classList.remove('on'); box.classList.toggle('shut', !on); swap(st, ''); if (on && focus) c.later(350, () => ta.focus({ preventScroll:true })); };
  dn.onclick = e => down(e.isTrusted);
  $('.fbx-x', r).onclick = () => { box.classList.add('shut'); dn.classList.remove('on'); };
  go.onclick = () => c.run(async () => {
    go.innerHTML = '<span class="spin"></span>'; await c.wait(800);
    box.classList.add('shut'); await c.wait(300);
    const n = chips.filter(x => x.classList.contains('on')).length;
    const thx = html(`<div class="fbx-thx">${I('ok')}<span>Thanks. The agent will ${n ? 'avoid this' : 'use this'} next time in this project.</span></div>`);
    r.firstElementChild.appendChild(thx); enter(thx); swap(st, 'Feedback sent');
  });
  /* once it has entered, it rates the answer down and fills in the sheet by itself. Clicking, focusing or typing in it
     takes over, and what it had typed goes */
  c.run(async () => {
    await c.step(1500); down(false);
    await c.step(1000); chips[1].click();
    await c.step(700);
    await c.type(ta, 'Keep our 8px spacing scale', { ms:() => 34 + Math.random() * 40, each:ready, keep:true });
    await c.step(650); go.click();
  });
});
/* ---------- Model picker ---------- */
DM.def('model-picker', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{chev\}/g, I('chev-d','xs')).replace('{brain}', I('brain','xs')).replace(/\{chk\}/g, I('check','xs'));
  // speed, quality and cost out of five, and the numbers behind them: tokens a second, and a typical reply's seconds and
  // price with no thinking (the same three models and figures as Model compare)
  const M = [
    { n:'Opus 5.5', m:'O', c:'var(--pl)', t:'var(--on-ink)', d:'Deepest reasoning, slower', s:2, q:5, p:5, tps:38, sec:9, cost:.021 },
    { n:'Sonnet 5.5', m:'S', c:'var(--accent)', t:'var(--on-accent)', d:'Balanced, the default for design work', s:4, q:4, p:2, tps:74, sec:4, cost:.006 },
    { n:'Haiku 5.5', m:'H', c:'var(--pm)', t:'var(--on-ink)', d:'Fastest, for quick edits', s:5, q:3, p:1, tps:142, sec:1.5, cost:.001 }
  ];
  // thinking effort, and what it may spend
  const E = [['Off', 'Answers straight away'], ['Low', 'Up to 2k thinking tokens'], ['Medium', 'Up to 8k thinking tokens'], ['High', 'Up to 24k thinking tokens']];
  const list = $('.mpk-list', r), tr = $('.mpk-tr', r), fold = $('.mpk-fold', r), sgf = $('.mpk-sgf', r), sgt = $('.mpk-sgt', r), note = $('.mpk-note', r), thd = $('.mpk-thd', r), ev = $('.mpk-ev', r), items = $$('.mpk-pop .mi', r);
  const meter = (v, tip) => `<span class="mpk-m" data-tip="${tip}">${[1, 2, 3, 4, 5].map(k => `<i${k <= v ? ' class="on"' : ''}></i>`).join('')}</span>`;
  list.innerHTML = M.map((x, i) => `<button class="mpk-o" role="radio" aria-checked="false" tabindex="-1" data-i="${i}"><span class="mpk-mk" style="--mc:${x.c};--mt:${x.t}">${x.m}</span><span class="t"><b>${x.n}<span class="ck">${I('check','xs')}</span></b><span class="d">${x.d}</span></span>${meter(x.s, x.tps + ' tokens a second')}${meter(x.q, 'Quality ' + x.q + ' of 5')}${meter(x.p, '$' + x.cost.toFixed(3) + ' a reply')}</button>`).join('');
  const rows = $$('.mpk-o', list);
  // Opus is at capacity when the demo starts (busy is its wait in seconds), and free again once you've waited it out
  let cur = 1, eff = 2, busy = 20, waiting = false;
  function paint(){
    rows.forEach((b, i) => { b.setAttribute('aria-checked', i === cur); b.tabIndex = i === cur ? 0 : -1; });
    const mk = $('.mpk-mk', tr); mk.style.setProperty('--mc', M[cur].c); mk.style.setProperty('--mt', M[cur].t); mk.textContent = M[cur].m;
    swap($('.mpk-nm', tr), M[cur].n); swap($('.mpk-ef', tr), E[eff][0]); swap(thd, E[eff][1]); swap(ev, E[eff][0]);
    items.forEach((m, i) => m.setAttribute('aria-checked', i === eff));
  }
  const say = t => { note.innerHTML = t ? `${I('ok','xs')}<span>${t}</span>` : ''; if (t) enter(note); };
  const sg = on => { sgf.classList.toggle('shut', !on); sgf.inert = !on; };
  sg(false);
  // thinking effort: a small dropdown of the four levels, each with what it may spend
  items.forEach((m, i) => m.addEventListener('click', () => { eff = i; paint(); say(''); }));
  function choose(i){ cur = i; sg(false); paint(); say(`Set for this chat: ${M[cur].n}, ${E[eff][0].toLowerCase()} thinking`); }
  // picking a model checks it can take the request first; a busy one offers a wait, or a close match that starts now
  function pick(i){
    if (i !== 0 || !busy) return choose(i);
    if (waiting) return;
    const row = rows[0], d = $('.d', row), ck = $('.ck', row);
    ck.innerHTML = '<span class="spin"></span>'; swap(d, 'Checking it can take this chat'); say('');
    c.run(async () => {
      await c.wait(1000);
      ck.innerHTML = I('check','xs'); row.classList.add('busy'); swap(d, `At capacity, about ${busy}s wait`);
      sgt.textContent = `Opus 5.5 is at capacity for about ${busy}s. Sonnet 5.5 on high thinking comes close on long reviews and starts now.`; sg(true);
    });
  }
  rows.forEach((b, i) => b.onclick = () => pick(i));
  // arrow keys move through the models, as in any radio group
  c.on(list, 'keydown', e => {
    const k = { ArrowDown:1, ArrowRight:1, ArrowUp:-1, ArrowLeft:-1 }[e.key]; if (!k) return;
    e.preventDefault(); const i = (rows.indexOf(document.activeElement) + k + rows.length) % rows.length; rows[i].focus({ preventScroll:true }); pick(i);
  });
  $('.mpk-use', r).onclick = () => { eff = 3; choose(1); };
  $('.mpk-wait', r).onclick = () => c.run(async () => {
    sg(false); waiting = true; const d = $('.d', rows[0]);
    for (let w = busy; w > 0; w--){ d.textContent = `Starts in ${w}s`; await c.wait(1000); }
    busy = 0; waiting = false; rows[0].classList.remove('busy'); swap(d, M[0].d); choose(0);
  });
  // the trigger opens and closes the list; Escape closes it and gives the trigger the focus back
  // the trigger sits centred on its own, and glides up as the list folds open; it aims for the open list's own height,
  // not the one it is easing through, so the two move as one
  const mpk = $('.mpk', r), effp = $('.mpk-pop', r);
  const centred = centre(c, mpk, () => { const shut = fold.classList.contains('shut'), sgx = sgf.classList.contains('shut') ? 0 : sgf.firstElementChild.scrollHeight;
    let h = mpk.offsetHeight - fold.offsetHeight + (shut ? 0 : fold.firstElementChild.scrollHeight - sgf.offsetHeight + sgx);
    return effp.classList.contains('open') ? Math.max(h, effp.offsetTop + effp.offsetHeight) : h; }, [fold.firstElementChild, effp]);
  const open = v => { fold.classList.toggle('shut', !v); fold.inert = !v; tr.setAttribute('aria-expanded', v); centred(); };
  tr.onclick = () => open(tr.getAttribute('aria-expanded') !== 'true');
  c.on(r, 'keydown', e => { if (e.key === 'Escape' && tr.getAttribute('aria-expanded') === 'true'){ open(false); tr.focus({ preventScroll:true }); } });
  paint();
  // the preview's story: compare the meters, ask for Opus, find it busy, and take the close match on high thinking
  c.story(async s => {
    await s.beat(3);
    await s.point($$('.mpk-m', rows[2])[2]); await s.beat(3);
    await s.point($$('.mpk-m', rows[0])[1]); await s.beat(3);
    await s.tap(rows[0]); s.away();
    await s.until(() => !sgf.classList.contains('shut')); await s.beat(5);
    await s.tap($('.mpk-use', r)); s.away();
    await s.beat(4);
  });
});
/* ---------- Answer action bar ---------- */
DM.def('answer-action-bar', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{copy}', I('copy')).replace('{re}', I('refresh')).replace('{l}', I('chev-l','xs')).replace('{rr}', I('chev-r','xs'))
    .replace('{up}', I('up-thumb')).replace('{dn}', I('down-thumb')).replace('{vol}', I('vol','xs'));
  // the versions a regenerate writes, in turn. [[…]] marks what changed from the version before; $24 to $19 a month saves 21%
  const POOL = [
    { t:'Pro is $24 a month, or $19 a month when billed yearly. That saves 15%, and yearly is the option the new pricing page shows first.', meta:'Sonnet 5.5 · 6.2s' },
    { t:'Pro is $24 a month, or $19 a month billed yearly, which saves [[21%, or $60 a year]]. The new pricing page shows the yearly price first.', meta:'Sonnet 5.5 · 4.8s' },
    { t:'Billed yearly, Pro drops from $24 to $19 a month: [[$60 back each year]], about 21%. That is why the pricing page leads with yearly.', meta:'Sonnet 5.5 · 5.1s' }
  ];
  const t = $('.aab-t', r), pg = $('.aab-pg', r), n = $('.aab-n', r), pv = $('.aab-prev', r), nx = $('.aab-next', r), re = $('.aab-re', r), cp = $('.aab-cp', r);
  const up = $('.aab-up', r), dn = $('.aab-dn', r), rd = $('.aab-rd', r), bar = $('.aab-pr i', r), tm = $('.aab-tm', r), meta = $('.aab-meta', r), why = $('.aab-why', r), st = $('.aab-st', r), chips = $$('.aab-ch .chip', r);
  // every version keeps its own rating
  const vers = [{ ...POOL[0], rate:'' }]; let cur = 0, busy = false, failOnce = false;
  const plain = v => v.t.replace(/\[\[|\]\]/g, '');
  // each word's HTML, with the space before it; inside the changed phrase the space is highlighted too, so the phrase reads as one
  const words = v => { let on = false; return v.t.split(' ').map((w, i) => { const a = w.startsWith('[['), b = w.includes(']]'), inner = on && !a; if (a) on = true;
    const s = (i ? `<span${inner ? ' class="nw"' : ''}> </span>` : '') + `<span class="w${on ? ' nw' : ''}">${w.replace(/\[\[|\]\]/g, '')}</span>`; if (b) on = false; return s; }); };
  const status = (text, tone) => { st.className = 'aab-st muted' + (tone ? ' ' + tone : ''); if (tone === 'ok') { st.innerHTML = `${I('ok','xs')}<span>${text}</span>`; enter(st); } else swap(st, text); };
  function nav(){
    n.textContent = (cur + 1) + ' / ' + vers.length; pg.classList.toggle('on', vers.length > 1); pg.inert = vers.length < 2;
    pv.disabled = cur === 0 || busy; nx.disabled = cur === vers.length - 1 || busy; re.disabled = busy;
    up.setAttribute('aria-pressed', vers[cur].rate === 'up'); dn.setAttribute('aria-pressed', vers[cur].rate === 'down');
    swap(meta, vers[cur].meta);
  }
  // a version streams in word by word; paging between versions shows one at once
  async function stream(v){
    t.classList.add('out'); await c.wait(260); t.classList.remove('out'); t.innerHTML = '';
    const ws = words(v);
    for (let i = 0; i < ws.length; i++){ t.insertAdjacentHTML('beforeend', ws[i]); t.lastElementChild.classList.add('in'); await c.wait(38); }
  }
  async function show(i){ stop(); cur = i; nav(); t.classList.add('out'); await c.wait(240); t.classList.remove('out'); t.innerHTML = words(vers[i]).join(''); $$('.w', t).forEach((w, k) => { w.classList.add('in'); w.style.animationDelay = k * 10 + 'ms'; }); }
  pv.onclick = () => c.run(() => show(cur - 1));
  nx.onclick = () => c.run(() => show(cur + 1));
  // regenerate writes the next version; a dropped connection is retried once with a countdown
  function regenerate(note){
    if (busy) return; stop(); busy = true; re.classList.add('go'); c.later(700, () => re.classList.remove('go')); nav();
    c.run(async () => {
      if (failOnce){ failOnce = false;
        status('Writing a new version' + (note ? ' with your note' : '')); st.classList.add('shim'); await c.wait(1200); st.classList.remove('shim');
        for (let k = 2; k > 0; k--){ status(`Couldn't reach Sonnet 5.5. Retrying in ${k}s`, 'warn'); await c.wait(1000); }
      }
      status('Writing a new version' + (note ? ' with your note' : '')); st.classList.add('shim');
      const v = { ...POOL[Math.min(vers.length, POOL.length - 1)], rate:'' }; vers.push(v); cur = vers.length - 1; nav();
      await stream(v); busy = false; nav(); st.classList.remove('shim');
      status(cur === 1 ? 'Version 2 fixes the saving: 21%, not 15%' : `Version ${cur + 1} of ${vers.length}`, 'ok');
    });
  }
  re.onclick = () => regenerate();
  cp.onclick = () => { copied(cp, plain(vers[cur])); status('Copied without the highlights', 'ok'); };
  // thumbs: up is a quiet thanks; down asks why, and a reason writes a version that answers it
  up.onclick = () => { const v = vers[cur]; v.rate = v.rate === 'up' ? '' : 'up'; why.classList.add('shut'); nav(); status(v.rate ? 'Thanks, noted for this project' : ''); };
  dn.onclick = () => { const v = vers[cur]; v.rate = v.rate === 'down' ? '' : 'down'; why.classList.toggle('shut', v.rate !== 'down'); why.inert = v.rate !== 'down'; nav(); status(''); chips.forEach(x => x.classList.remove('on')); };
  chips.forEach(ch => ch.onclick = () => { chips.forEach(x => x.classList.toggle('on', x === ch)); c.later(400, () => { why.classList.add('shut'); why.inert = true; failOnce = vers.length === 1; regenerate(ch.textContent); }); });
  why.inert = true;
  // read aloud: about 0.28s a word, each word lit as it's read, with a progress bar and a clock
  let reading = 0, pos = 0;
  const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s) % 60).padStart(2, '0');
  const icon = k => { $('.ic', rd).innerHTML = I(k, 'xs'); };
  // stop drops the place (a new version, another page); pause keeps it, so the bar, the clock and the lit word stay
  function stop(){ if (reading) clearInterval(reading); reading = 0; pos = 0; rd.classList.remove('on', 'paused'); rd.setAttribute('aria-pressed', 'false'); rd.setAttribute('aria-label', 'Read aloud'); rd.dataset.tip = 'Read aloud'; icon('vol'); bar.style.width = '0%'; $$('.w.rd', t).forEach(w => w.classList.remove('rd')); }
  function pause(){ clearInterval(reading); reading = 0; rd.classList.add('paused'); rd.setAttribute('aria-pressed', 'false'); rd.setAttribute('aria-label', 'Resume reading'); rd.dataset.tip = 'Resume'; icon('play'); }
  rd.onclick = () => {
    if (reading) return pause();
    const ws = $$('.w', t); if (!ws.length || busy) return;
    const total = ws.length * .28;
    rd.classList.add('on'); rd.classList.remove('paused'); rd.setAttribute('aria-pressed', 'true'); rd.setAttribute('aria-label', 'Pause reading'); rd.dataset.tip = 'Pause'; icon('pause');
    reading = c.every(100, () => {
      pos += 100 / 280; const i = Math.min(ws.length - 1, Math.floor(pos));
      ws.forEach((w, k) => w.classList.toggle('rd', k === i));
      bar.style.width = Math.min(100, pos / ws.length * 100) + '%'; tm.textContent = clock(pos * .28) + ' / ' + clock(total);
      if (pos >= ws.length) stop();
    });
  };
  // Left and Right move between the toolbar's buttons, skipping any that are switched off
  c.on($('.aab-bar', r), 'keydown', e => {
    const k = { ArrowRight:1, ArrowLeft:-1 }[e.key]; if (!k) return;
    const bs = $$('.aab-bar button', r).filter(b => !b.disabled && !b.closest('[inert]')), i = bs.indexOf(document.activeElement);
    if (i < 0) return; e.preventDefault(); bs[(i + k + bs.length) % bs.length].focus({ preventScroll:true });
  });
  nav();
  c.run(async () => { busy = true; nav(); await c.wait(300); await stream(vers[0]); busy = false; nav(); });
  // the preview's story: listen, hear a wrong number, rate it down, say why, ride out a dropped connection, copy the fix
  c.story(async s => {
    await s.until(() => !busy); await s.beat(2);
    await s.tap(rd); s.away(); await s.beat(7);
    await s.tap(rd); await s.beat(1);
    await s.tap(dn); s.away(); await s.beat(3);
    await s.tap(chips[0]); s.away();
    await s.until(() => vers.length > 1 && !busy); await s.beat(3);
    await s.tap(cp); s.away(); await s.beat(1);
  });
});
/* ---------- Voice orb ---------- */
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
    if (REDUCE){ if (!still){ still = true; lv = 0; orb.style.setProperty('--lv', '0'); draw(0); } last = 0; return; }
    still = false;
    const to = talking ? .5 + .28 * Math.sin(t / 90) * Math.sin(t / 233) + .16 * Math.sin(t / 57) : mode === 'listening' && !muted ? .05 + .03 * Math.sin(t / 420) : 0;
    lv += (Math.max(0, to) - lv) * .18; orb.style.setProperty('--lv', lv.toFixed(3));
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
/* ---------- Prompt library ---------- */
DM.def('prompt-library', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chevl}', I('chev-l'));
  const PAGE = { l:'Page', o:['Pricing v4', 'Home', 'Checkout'] };
  // the studio's saved prompts. Each blank is typed in, or picked from a short list that starts on its first option
  const P = [
    { t:'Rewrite a section', p:'Rewrite {section} on {page} so it reads {tone}.', v:{ section:{ l:'Section', ph:'Like the plan cards', er:'Say which section to rewrite' }, page:PAGE, tone:{ l:'Tone', o:['clearer', 'friendlier', 'shorter'] } } },
    { t:'Summarize feedback', p:'Summarize the comments on {page} into three fixes.', v:{ page:PAGE } },
    { t:'Check the tokens', p:'Check {page} against the {library} tokens and list what drifts.', v:{ page:PAGE, library:{ l:'Library', o:['Studio UI', 'Marketing'] } } },
    { t:'Write release notes', p:"Write release notes for {version} in the studio's voice.", v:{ version:{ l:'Version', ph:'Like Pricing v4', er:'Say which version they are for' } } }
  ];
  const cap = s => s[0].toUpperCase() + s.slice(1), uid = Math.random().toString(36).slice(2, 7);
  const list = $('.plb-list', r), one = $('.plb-one', r), rows = $('.plb-rows', r), tp = $('.plb-tp', r), vars = $('.plb-vars', r), f = $('.plb-f', r), root = $('.plb', r);
  rows.innerHTML = P.map((x, i) => `<button class="plb-row" data-i="${i}"><span class="plb-ic">${I('file-text')}</span><span class="plb-rt"><b>${x.t}</b><span>${x.p}</span></span><span class="plb-n">${Object.keys(x.v).length} ${Object.keys(x.v).length === 1 ? 'blank' : 'blanks'}</span>${I('chev-r','xs')}</button>`).join('');
  let cur = null, vals = {}, bad = new Set(), done = null;
  // the prompt as it reads now: filled blanks in the accent colour, empty ones by name, and red once they were needed
  const fill = () => { tp.innerHTML = cur.p.replace(/\{(\w+)\}/g, (m, k) => `<span class="plb-s${vals[k] ? '' : ' empty'}${bad.has(k) ? ' bad' : ''}">${vals[k] || cur.v[k].l.toLowerCase()}</span>`); };
  const err = (k, on) => { const fd = $(`.plb-fd[data-k="${k}"]`, vars), e = $('.plb-er', fd); fd.classList.toggle('bad', on); e.hidden = !on; e.textContent = on ? cur.v[k].er : ''; $('.plb-in', fd).setAttribute('aria-invalid', on); if (on) bad.add(k); else bad.delete(k); };
  function open(i){
    cur = P[i]; vals = {}; bad = new Set(); undo();
    $('.plb-tt', r).textContent = cur.t; $('.plb-vn', r).textContent = `${Object.keys(cur.v).length} ${Object.keys(cur.v).length === 1 ? 'blank' : 'blanks'}`;
    $$('.plb-pop', r).forEach(p => p.remove());
    const keys = Object.keys(cur.v), typed = keys.filter(k => !cur.v[k].o), picked = keys.filter(k => cur.v[k].o);
    // typed blanks take the full width; picked ones sit two to a row, and an odd one out takes the row. The blanks sit at
    // the foot of the card, so their lists open upward over the prompt instead of past the footer
    vars.innerHTML = [...typed, ...picked].map(k => { const v = cur.v[k], wide = !v.o || (picked.length % 2 && k === picked[picked.length - 1]);
      if (!v.o) return `<label class="plb-fd wide" data-k="${k}"><span>${v.l}</span><input class="plb-in" placeholder="${v.ph}" aria-describedby="plb-e-${k}-${uid}"><span class="plb-er" id="plb-e-${k}-${uid}" hidden></span></label>`;
      vals[k] = v.o[0];
      return `<div class="plb-fd${wide ? ' wide' : ''}" data-k="${k}"><span id="plb-l-${k}-${uid}">${v.l}</span><button class="plb-sel" aria-haspopup="menu" aria-expanded="false" aria-labelledby="plb-l-${k}-${uid} plb-v-${k}-${uid}" data-pop=".plb-pop-${k}" data-pop-pos="up"><span class="v" id="plb-v-${k}-${uid}">${cap(v.o[0])}</span>${I('chev-d','xs')}</button></div>`; }).join('');
    picked.forEach(k => {
      const pop = html(`<div class="pop plb-pop plb-pop-${k}" role="menu" aria-label="${cur.v[k].l}">${cur.v[k].o.map((o, n) => `<button class="mi" role="menuitemradio" aria-checked="${!n}" data-close data-o="${o}"><span>${cap(o)}</span><span class="ck">${I('check','xs')}</span></button>`).join('')}</div>`);
      root.appendChild(pop);
      $$('.mi', pop).forEach(m => m.addEventListener('click', () => { vals[k] = m.dataset.o; $$('.mi', pop).forEach(x => x.setAttribute('aria-checked', x === m)); swap($(`#plb-v-${k}-${uid}`, vars), cap(m.dataset.o)); fill(); }));
    });
    $$('.plb-in', vars).forEach(inp => inp.addEventListener('input', () => { const k = inp.closest('.plb-fd').dataset.k; vals[k] = inp.value.trim(); if (vals[k] && bad.has(k)) err(k, false); fill(); }));
    fill(); list.hidden = true; one.hidden = false; enter(one);
  }
  function undo(){ if (done){ done.remove(); done = null; } f.hidden = false; one.classList.remove('used'); vars.inert = false; }
  $$('.plb-row', rows).forEach(b => b.onclick = () => open(+b.dataset.i));
  $('.plb-back', r).onclick = () => { closePops(); one.hidden = true; list.hidden = false; enter(list); };
  // a prompt can't be used with a blank left empty: the blank says what it needs
  $('.plb-use', r).onclick = () => {
    const empty = Object.keys(cur.v).filter(k => !vals[k]);
    if (empty.length){ empty.forEach(k => err(k, true)); fill(); return; }
    f.hidden = true; one.classList.add('used'); vars.inert = true;
    done = html(`<div class="plb-done">${I('ok')}<span class="t">Added to your message<span class="muted">Ready to send to the agent</span></span><button class="pill sm">Undo</button></div>`);
    one.appendChild(done); enter(done); $('button', done).onclick = undo;
  };
  // the preview's story: open a prompt, try to use it with a blank empty, fill it in, pick a tone, then use it
  c.story(async s => {
    await s.beat(3); await s.tap($('.plb-row', rows)); s.away();
    await s.beat(3); await s.tap($('.plb-use', r)); s.away();
    await s.beat(4);
    const inp = $('.plb-in', vars); await s.point(inp, false);
    await s.type(inp, 'the plan cards', { n:.14, each:() => inp.dispatchEvent(new Event('input')) });
    await s.beat(1); s.away(); await s.beat(1);
    await s.tap($('.plb-sel', $('.plb-fd[data-k="tone"]', vars))); await s.beat(2);
    await s.tap($('.plb-pop-tone .mi[data-o="friendlier"]', r)); s.away(); await s.beat(3);
    await s.tap($('.plb-use', r)); s.away(); await s.beat(3);
  });
});
/* ---------- Image generation ---------- */
/* the grain over a picture being made: grey specks of mixed strength on a clear square, drawn once and tiled */
let igxNoise = '';
function igxGrain(){
  if (igxNoise) return igxNoise;
  try {
    const n = 96, cv = document.createElement('canvas'); cv.width = cv.height = n;
    const x = cv.getContext('2d'), d = x.createImageData(n, n);
    for (let i = 0; i < d.data.length; i += 4){ const v = Math.random() < .5 ? 20 : 245; d.data[i] = d.data[i + 1] = d.data[i + 2] = v; d.data[i + 3] = 40 + Math.random() * 150; }
    x.putImageData(d, 0, 0); igxNoise = `url("${cv.toDataURL()}")`;
  } catch(e){ igxNoise = 'none'; }
  return igxNoise;
}
DM.def('image-generation', (r, c, card) => {
  r.innerHTML = r.innerHTML.replace(/\{i-([a-z-]+)\}/g, (m, n) => I(n));
  const box = $('.igx-in', r), feed = $('.igx-feed', r), ask = $('.igx-ask', r), empty = $('.igx-empty', r), runEl = $('.igx-run', r);
  const rt = $('.igx-rt', r), stepEls = $$('.igx-steps>span', r), pc = $('.igx-pc', r), tilesEl = $('.igx-tiles', r), meta = $('.igx-meta', r), sr = $('.igx-sr', r);
  const form = $('.igx-cmp', r), ta = $('.igx-ta', r), refsEl = $('.igx-refs', r), go = $('.igx-go', r), setBtn = $('.igx-set', r), mdlBtn = $('.igx-mdl', r);
  const galEl = $('.igx-gal', r), prsEl = $('.igx-prs', r), cn = $('.igx-cn', r), lbEl = $('.igx-lb', r);
  const panes = { gallery:$('.igx-gp', r), styles:$('.igx-sp', r) };
  if (!REDUCE) $('.igx', r).style.setProperty('--noise', igxGrain());
  const esc = t => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const say = t => { sr.textContent = t; };

  /* the pictures: words for a screen reader, a gradient of their colours (g) that stands in for each, and their shape (ar,
     width over height). On designme.dev, art/art.js lays the photo of the same name over the gradient: photos from Pexels,
     free under the Pexels License (https://www.pexels.com/license/), credited in art/README.md and never part of an install */
  const PIC = {
    'yellow-wall':{ ar:3/4, g:'linear-gradient(165deg,#ffec2e 0 55%,#f2c94a 70%,#5b80bd)', alt:'A laughing woman in a denim jacket and yellow sunglasses against a bright yellow wall' },
    'green-reach':{ ar:3/4, g:'radial-gradient(circle at 62% 40%,#e2cf3a 0 9%,transparent 17%),linear-gradient(#5aa34c,#3f9b50)', alt:'A man in a green T-shirt and yellow bucket hat reaching towards the camera in front of a green backdrop' },
    'magenta-pose':{ ar:3/4, g:'linear-gradient(140deg,#c534a8,#8a2399 50%,#2b102c)', alt:'A woman in a black strapless dress posing under pink light against a violet backdrop' },
    'white-blazer':{ ar:3/4, g:'radial-gradient(ellipse at 50% 72%,#f3efe8 0 20%,transparent 38%),linear-gradient(#ea6a38,#c9532f)', alt:'A man in a white blazer with black lapels standing against a rust orange wall' },
    'pink-dream':{ ar:4/5, g:'linear-gradient(#cdbbe8,#e6a9cb 55%,#b981c4)', alt:'A dreamlike digital landscape: a pink cloud floating over a lavender field beside a still pink lake' },
    'pink-tower':{ ar:2/3, g:'linear-gradient(90deg,#f6cdb7 0 34%,#3f95c9 34%)', alt:'The corner of a peach building with small windows against a clear blue sky' },
    'pink-window':{ ar:1, g:'radial-gradient(circle at 50% 56%,#5f7d4f 0 7%,transparent 8%),linear-gradient(#eba3ae,#df97a2)', alt:'A single small window with a green frame in a wide pink wall' },
    'clay-loops':{ ar:4/3, g:'radial-gradient(circle at 52% 50%,#e9bb5e 0 11%,transparent 21%),linear-gradient(135deg,#b56fd8,#e28bd2 50%,#7f93a4)', alt:'A 3D render of looping pink clay shapes around a yellow lump on a violet background' },
    'pastel-shapes':{ ar:4/3, g:'radial-gradient(circle at 62% 42%,#ff7f9d 0 11%,transparent 19%),linear-gradient(#e7e4e8,#d7d2de)', alt:'Pastel shapes stacked on light grey: a pink cylinder, a white cube, a lilac sphere and a violet cone' },
    'petal-face':{ ar:3/4, g:'radial-gradient(ellipse at 50% 50%,#e6b59c 0 24%,transparent 44%),linear-gradient(#2f6e6c,#1d4a4a)', alt:'A woman with her eyes closed, rose petals over one eye and green leaves over her mouth, against teal' },
    'retro-room':{ ar:2/3, g:'linear-gradient(#f68fc6,#4fb3f1 42%,#f6a43c 60%,#1b1b1b 82%)', alt:'A man in a sequinned jacket in a clear bubble chair, in a room painted with bright drips above a black and white checkerboard floor' },
    'ribbon-look':{ ar:3/4, g:'linear-gradient(135deg,#ececea,#9dbbdb 45%,#f4c431 68%,#ededeb)', alt:'A woman in pale denim sitting on a white block, wrapped in folded yellow, red and blue paper ribbons' },
    'light-leak':{ ar:4/3, g:'linear-gradient(120deg,#1f160a,#bd722c 45%,#ecc66b 60%,#3b2b17)', alt:'A close-up of a face in shadow with a rainbow of light falling across one eye' },
    'fruit-bowl':{ ar:1, g:'radial-gradient(circle at 50% 74%,#2aa8e2 0 17%,transparent 28%),radial-gradient(circle at 52% 46%,#a02e40 0 21%,transparent 38%),linear-gradient(#0d0d0d,#151515)', alt:'Red apples with green and red grapes in a bright blue bowl against black' },
    'framing-hands':{ ar:3/2, g:'linear-gradient(90deg,#2152c5,#ff6b4e 50%,#c9a8e8)', alt:'A woman in a coral suit framing the camera with her fingers, cobalt curtains and a lilac wall behind her' },
    'yellow-shapes':{ ar:3/2, g:'radial-gradient(ellipse at 50% 72%,#e2c34d 0 17%,transparent 33%),linear-gradient(#2c312e,#1f2321)', alt:'Mustard yellow cubes, cones and cylinders on the floor of a dark green-grey room' }
  };
  const SHAPE = { '1:1':1, '3:4':3 / 4, '16:9':16 / 9 };
  const shapeOf = ar => ({ 1:'1:1', .75:'3:4', .8:'4:5', .667:'2:3', 1.333:'4:3', 1.5:'3:2', 1.778:'16:9' })[Math.round(ar * 1000) / 1000] || '';
  // what each style draws from in this demo (a real model makes new pictures; these are the photos that suit the style)
  const SETS = { Editorial:['yellow-wall', 'green-reach', 'magenta-pose', 'white-blazer'], Poster:['pink-tower', 'pink-window', 'yellow-shapes', 'pastel-shapes'],
    Surreal:['pink-dream', 'petal-face', 'clay-loops', 'light-leak'], '35mm':['light-leak', 'framing-hands', 'fruit-bowl', 'ribbon-look'] };
  // a model's step, in ms: 30 steps make a picture, each picture at its own pace
  const MODELS = [{ n:'Studio 2', ms:200 }, { n:'Studio 2 Fast', ms:95 }, { n:'Studio 2 HD', ms:290 }];
  const PACE = [1, .8, 1.12, .9], STEPS = 30;
  // the style presets, each a picture and the styles it picks
  const PRESETS = [
    { n:'Studio editorial', d:'Bold backdrop, studio light', s:['Editorial'], pic:'framing-hands' },
    { n:'Colour block', d:'Flat colour, strong shapes', s:['Poster'], pic:'pink-tower' },
    { n:'Dreamscape', d:'Soft pastel, impossible places', s:['Surreal'], pic:'pink-dream' },
    { n:'Film portrait', d:'Grain and light leaks', s:['35mm', 'Editorial'], pic:'light-leak' },
    { n:'Soft 3D', d:'Clay forms in pastel light', s:['Surreal', 'Poster'], pic:'clay-loops' },
    { n:'Still life', d:'Objects on black, hard light', s:['35mm'], pic:'fruit-bowl' }
  ];
  let ids = 0;
  const made = (pic, prompt, styles, ar, o = {}) => ({ id:++ids, pic, prompt, styles, ar, vz:1, vo:'50% 50%', up:false, rate:0, ...o });
  // earlier pictures, newest first
  const gallery = [
    made('pink-dream', 'A pink cloud over a lavender field and a still lake', ['Surreal'], 4 / 5),
    made('framing-hands', 'Woman framing the camera with her hands, coral suit, cobalt curtains', ['Editorial'], 3 / 2),
    made('pink-tower', 'Peach building corner against a clear blue sky', ['Poster'], 2 / 3),
    made('petal-face', 'Portrait with rose petals and leaves on the face', ['Surreal'], 3 / 4),
    made('clay-loops', 'Soft clay loops in pink and lilac, 3D', ['Surreal', 'Poster'], 4 / 3),
    made('retro-room', 'A bubble chair in a candy-coloured room, checkerboard floor', ['Poster'], 2 / 3),
    made('pink-window', 'One small window in a pink wall, minimal', ['Poster'], 1),
    made('light-leak', 'Close-up with a rainbow light leak across the eye', ['35mm'], 4 / 3),
    made('ribbon-look', 'Denim look with paper ribbon sculptures, studio', ['Editorial'], 3 / 4),
    made('fruit-bowl', 'Apples and grapes in a blue bowl on black', ['35mm'], 1),
    made('pastel-shapes', 'Pastel geometric shapes stacked on grey', ['Poster'], 4 / 3),
    made('yellow-shapes', 'Yellow geometric solids in a dark room', ['Poster'], 3 / 2)
  ];
  const styles = new Set(['Editorial']), refs = [], used = {};
  let shape = '3:4', count = 4, model = 0, run = null, runs = 0, lb = null;
  // a picture's work goes on under the pointer, as an agent's does: these waits are never held
  const tick = ms => new Promise((res, rej) => { c.t.push(setTimeout(() => c.dead ? rej('stop') : res(), REDUCE ? Math.min(ms, 30) : ms)); });
  const metaOf = img => [shapeOf(img.ar), img.styles.join(', ') || 'No style', img.up ? 'Upscaled 2×' : ''].filter(Boolean).join(' · ');
  const layers = (img, size) => `<span class="igx-ly igx-b" data-pic="${img.pic}"${size}></span><span class="igx-ly igx-s" data-pic="${img.pic}"${size}></span>`;
  const look = img => `--art:${PIC[img.pic].g};--vz:${img.vz};--vo:${img.vo}`;

  /* ---------- the run: the prompt as sent, its pictures, and how far they have come ---------- */
  const busy = () => !!run && run.items.some(t => t.st === 'wait' || t.st === 'gen');
  function paint(t){
    const s = t.el.style, p = t.k / STEPS;
    t.el.dataset.st = t.st;
    if (t.st === 'wait'){ s.setProperty('--sc', 0); s.setProperty('--gr', .5); $('.igx-tp', t.el).textContent = '0%'; }
    if (t.st === 'gen'){
      // Composing: dots of the picture's colours grow out of the grain, a step at a time
      const a = Math.min(1, p / .3), cell = 12;
      s.setProperty('--cell', cell + 'px'); s.setProperty('--dot', (a >= 1 ? cell : 1 + a * 7.5).toFixed(1) + 'px'); s.setProperty('--sq', (a >= 1 ? cell : 2 + a * 9).toFixed(1) + 'px');
      // Adding detail: the blur lifts while the scan line comes down, leaving the detail behind it
      const b = Math.max(0, Math.min(1, (p - .3) / .52)), sc = Math.max(0, Math.min(1, (p - .34) / .46));
      s.setProperty('--bl', (18 - b * 14).toFixed(1) + 'px'); s.setProperty('--sc', sc.toFixed(3)); s.setProperty('--lo', sc > 0 && sc < 1 ? 1 : 0);
      // Upscaling: the last softness and grain go
      const u = Math.max(0, Math.min(1, (p - .8) / .2));
      s.setProperty('--sb', (3 * (1 - u)).toFixed(2) + 'px'); s.setProperty('--gr', (.5 * (1 - p)).toFixed(3));
      $('.igx-tp', t.el).textContent = Math.round(p * 100) + '%';
    }
    if (t.st === 'done'){ s.setProperty('--sc', 1); s.setProperty('--sb', '0px'); s.setProperty('--gr', 0); s.setProperty('--lo', 0); }
    const o = $('.igx-o', t.el), n = run.items.indexOf(t) + 1;
    o.disabled = t.st !== 'done';
    o.setAttribute('aria-label', t.st === 'done' ? `Open picture ${n}: ${PIC[t.img.pic].alt}` : `Picture ${n}, ${t.st === 'fail' ? 'failed' : 'being made'}`);
  }
  let said = -1, headKey = '';
  function head(){
    const its = run.items, n = its.length, done = its.filter(t => t.st === 'done').length, bad = its.filter(t => t.st === 'fail').length, going = busy();
    const live = its.filter(t => t.st !== 'fail'), p = live.length ? live.reduce((a, t) => a + (t.st === 'done' ? 1 : t.k / STEPS), 0) / live.length : 0;
    const ph = !going ? 3 : p < .3 ? 0 : p < .8 ? 1 : 2;
    stepEls.forEach((el, k) => { el.className = k < ph ? 'done' : k === ph ? 'on' : ''; });
    pc.textContent = going ? Math.round(p * 100) + '%' : '';
    const pics = n === 1 ? 'picture' : `${n} pictures`;
    const key = going ? `g${n}` : bad ? `b${done}/${bad}` : `d${n}`;
    if (key !== headKey){
      headKey = key;
      rt.innerHTML = going ? `<span class="spin" aria-hidden="true"></span><span>Generating ${pics}</span>`
        : bad ? `${I('alert')}<span>${done} of ${n} ready, ${bad} failed</span>`
        : `${I('image')}<span>${n === 1 ? 'Picture' : pics[0].toUpperCase() + pics.slice(1)} ready in ${Math.max(1, Math.round((performance.now() - run.t0) / 1000))}s</span>`;
    }
    // said politely as each stage starts and once the run is through, never every step
    if (ph !== said){ said = ph; say(ph < 3 ? `${['Composing', 'Adding detail', 'Upscaling'][ph]}, ${pics}` : bad ? `${done} of ${n} ready, ${bad} failed. Retry is on the failed one` : `${n === 1 ? 'Picture' : pics} ready`); }
    go.dataset.tip = going ? 'Generating' : 'Generate'; canGo();
  }
  function fit(){
    if (!run) return;
    const W = tilesEl.clientWidth, H = tilesEl.clientHeight, n = run.items.length, g = 8; let best = [1, 1, -1, n];
    // the largest pictures win; between layouts that give the same size, the one with no gap in its last row, then the wider
    for (let cols = 1; cols <= n; cols++){
      const rows = Math.ceil(n / cols), w = Math.min((W - (cols - 1) * g) / cols, (H - (rows - 1) * g) / rows * run.ar), gap = cols * rows - n;
      if (w > best[2] + .5 || (w > best[2] - .5 && gap <= best[3])) best = [cols, rows, w, gap];
    }
    tilesEl.style.setProperty('--cols', best[0]); tilesEl.style.setProperty('--rows', best[1]);
  }
  const ro = new ResizeObserver(fit); ro.observe(tilesEl); c.offs.push(() => ro.disconnect());
  function draw(){
    ask.textContent = run.prompt; empty.hidden = true; runEl.hidden = false;
    meta.textContent = `${MODELS[run.model].n} · ${shapeOf(run.ar)} · ${run.styles.join(', ') || 'No style'}`;
    $$('.igx-acts [aria-pressed]', r).forEach(b => b.setAttribute('aria-pressed', 'false'));
    tilesEl.innerHTML = run.items.map((t, i) => `<figure class="igx-t" data-st="wait" style="--ar:${run.ar};${look(t.img)}">
      <button type="button" class="igx-o" aria-haspopup="dialog" disabled>${layers(t.img, '')}<span class="igx-n"></span><span class="igx-l"><span></span><span></span></span></button>
      <span class="tag igx-tg"></span><span class="igx-tp num" aria-hidden="true">0%</span>
      <div class="igx-f">${I('alert')}<b>Couldn't finish</b><span>The model timed out</span><button type="button" class="pill line sm" data-a="retry" aria-label="Retry picture ${i + 1}">${I('refresh', 'xs')}Retry</button></div>
      <div class="igx-q"><button type="button" class="ib" data-a="vary" aria-label="Vary picture ${i + 1}" data-tip="Vary">${I('layers')}</button><button type="button" class="ib" data-a="upscale" aria-label="Upscale picture ${i + 1}" data-tip="Upscale">${I('max')}</button><button type="button" class="ib" data-a="download" aria-label="Download picture ${i + 1}" data-tip="Download">${I('down')}</button></div>
    </figure>`).join('');
    $$('.igx-t', tilesEl).forEach((el, i) => { run.items[i].el = el; paint(run.items[i]); });
    headKey = ''; said = -1; fit(); head();
  }
  async function make(t, rn){
    t.st = 'gen'; t.el.style.setProperty('--stp', t.ms + 'ms'); paint(t); head();
    while (t.k < STEPS){
      await tick(t.ms); if (rn !== run) return;
      t.k++;
      if (t.failAt && t.k === t.failAt){ t.failAt = 0; t.st = 'fail'; paint(t); head(); return; }
      paint(t); head();
    }
    t.st = 'done'; t.el.style.setProperty('--stp', '450ms'); paint(t); head();
    // a finished picture joins the gallery, at the top
    t.img.fresh = true; gallery.unshift(t.img); drawGallery();
  }
  function start(o){
    closePops(); closeLB(false);
    const st = o.styles, first = st[0] || 'Editorial', set = SETS[first];
    const off = used[first] || 0; if (!o.pics) used[first] = off + o.count;
    run = { id:++runs, prompt:o.prompt, styles:st, ar:o.ar, model, t0:performance.now(), items:[] };
    for (let i = 0; i < o.count; i++){
      const pic = o.pics ? o.pics[i] : set[(off + i) % set.length];
      // the demo's first run loses its third picture partway, to show Retry
      run.items.push({ img:made(pic, o.prompt, st, o.ar, o.look), st:'wait', k:0, ms:MODELS[model].ms * PACE[i % 4], failAt:run.id === 1 && i === 2 ? 17 : 0 });
    }
    draw();
    const rn = run;
    rn.items.forEach((t, i) => c.run(async () => { await tick(260 + i * 180); if (rn === run) await make(t, rn); }));
  }
  function generate(){
    const prompt = ta.value.trim(); if (!prompt || busy()) return;
    start({ prompt, styles:[...styles], ar:SHAPE[shape], count });
  }
  function retry(t){ t.k = 0; t.st = 'wait'; paint(t); head(); say(`Making picture ${run.items.indexOf(t) + 1} again`); const rn = run; c.run(async () => { await tick(200); if (rn === run) await make(t, rn); }); }
  // a variation keeps the picture and moves in on another part of it
  const CROPS = ['30% 35%', '70% 40%', '45% 70%', '60% 25%'];
  function vary(img){
    say('Making a variation');
    start({ prompt:img.prompt, styles:img.styles, ar:img.ar, count:1, pics:[img.pic], look:{ vz:1.22, vo:CROPS[(img.id + runs) % CROPS.length] } });
  }
  /* Upscale: wherever the picture shows (its tile, the larger view) the line sweeps down once and leaves it sharp */
  function upscale(img){
    const els = [...(run ? run.items.filter(t => t.img === img).map(t => t.el) : []), ...(lb && lb.img === img ? [$('.igx-lbs>.igx-t', lbEl)] : [])].filter(Boolean);
    els.forEach(el => { el.classList.remove('up'); void el.offsetWidth; el.classList.add('up'); });
    say('Upscaling');
    c.run(async () => {
      await tick(1700); img.up = true; els.forEach(el => { el.classList.remove('up'); const tg = $('.igx-tg', el); if (tg) tg.textContent = '2×'; });
      if (lb && lb.img === img) $('.igx-lbt .muted', lbEl).textContent = metaOf(img);
      say('Upscaled to twice the size');
    });
  }
  // on designme.dev a picture has a file to save (the photo art.js laid over it); an installed demo only has its gradient
  function download(img, btn, from){
    const lay = from && $('.igx-s', from), url = lay && (getComputedStyle(lay).backgroundImage.match(/url\("?([^")]+)"?\)/) || [])[1];
    if (url){ const a = document.createElement('a'); a.href = url; a.download = img.pic + '.webp'; document.body.appendChild(a); a.click(); a.remove(); }
    flash(btn, url ? 'Downloading' : 'No file in this demo');
  }
  function flash(btn, label){
    const use = $('use', btn), was = btn._fl || (btn._fl = { tip:btn.dataset.tip, href:use && use.getAttribute('href') });
    clearTimeout(was.t); if (use) use.setAttribute('href', was.href.replace(/-[a-z-]+$/, '-check')); btn.dataset.tip = label; showTip(btn); say(label);
    was.t = setTimeout(() => { if (use) use.setAttribute('href', was.href); if (was.tip === undefined) delete btn.dataset.tip; else btn.dataset.tip = was.tip; if (tipFor === btn) hideTip(true); }, 1600);
  }
  function reference(img, mine){
    if (!refs.includes(img)){ if (refs.length >= 3) refs.shift(); refs.push(img); }
    drawRefs(); say('Added as a reference'); if (mine) ta.focus({ preventScroll:true });
  }
  function drawRefs(){
    refsEl.innerHTML = refs.map((img, i) => `<span class="igx-ref" style="${look(img)}"><span class="igx-rp"><span class="igx-ly" data-pic="${img.pic}" data-pic-size="s"></span></span>Reference ${i + 1}<button type="button" class="ib" data-i="${i}" aria-label="Remove reference ${i + 1}" data-tip="Remove">${I('x', 'xs')}</button></span>`).join('');
  }
  c.on(refsEl, 'click', e => { const b = e.target.closest('[data-i]'); if (!b) return; refs.splice(+b.dataset.i, 1); drawRefs(); say('Reference removed'); if (e.isTrusted) ta.focus({ preventScroll:true }); });
  c.on(tilesEl, 'click', e => {
    const fig = e.target.closest('.igx-t'), t = run && run.items.find(x => x.el === fig); if (!t) return;
    const a = e.target.closest('[data-a]');
    if (!a){ if (e.target.closest('.igx-o') && t.st === 'done') openLB(run.items.filter(x => x.st === 'done').map(x => x.img), t.img, e.target.closest('.igx-o'), e.isTrusted); return; }
    ({ retry:() => retry(t), vary:() => vary(t.img), upscale:() => upscale(t.img), download:() => download(t.img, a, fig) })[a.dataset.a]();
  });
  const rateBtns = { up:$('.igx-acts .igx-up', r), dn:$('.igx-acts .igx-dn', r) };
  const rate = (k, btns, set) => { const on = btns[k].getAttribute('aria-pressed') !== 'true'; Object.entries(btns).forEach(([j, b]) => b.setAttribute('aria-pressed', j === k && on)); set(on ? (k === 'up' ? 1 : -1) : 0); say(on ? (k === 'up' ? 'Marked as good' : 'Marked as bad') : 'Rating removed'); };
  rateBtns.up.onclick = () => rate('up', rateBtns, v => { if (run) run.rate = v; });
  rateBtns.dn.onclick = () => rate('dn', rateBtns, v => { if (run) run.rate = v; });
  $('.igx-acts .igx-cp', r).onclick = e => run && copied(e.currentTarget, run.prompt, 'Prompt copied');

  /* ---------- the composer ---------- */
  const chips = $$('.igx-sc', r);
  function drawStyles(changed){
    chips.forEach(b => { const on = styles.has(b.dataset.s); b.setAttribute('aria-pressed', on); if (changed && changed.includes(b.dataset.s)){ b.classList.remove('hl'); void b.offsetWidth; b.classList.add('hl'); c.later(700, () => b.classList.remove('hl')); } });
    const same = p => p.s.length === styles.size && p.s.every(x => styles.has(x));
    $$('.igx-pr', prsEl).forEach((b, i) => b.setAttribute('aria-pressed', same(PRESETS[i])));
  }
  chips.forEach(b => b.onclick = () => { const s = b.dataset.s; styles.has(s) ? styles.delete(s) : styles.add(s); drawStyles(); });
  const setN = $('.igx-set-n', r), mdlN = $('.igx-mdl-n', r);
  const label = () => { setN.textContent = `${shape} · ${count}`; setBtn.setAttribute('aria-label', `Shape ${shape}, ${count === 1 ? '1 picture' : count + ' pictures'}`); };
  seg($('.igx-ars', r), v => { shape = v; label(); });
  seg($('.igx-cts', r), v => { count = +v; label(); });
  label();
  $$('.igx-pp-m .mi', r).forEach(b => b.addEventListener('click', () => { model = +b.dataset.m; $$('.igx-pp-m .mi', r).forEach(x => x.setAttribute('aria-checked', x === b)); mdlN.textContent = MODELS[model].n; }));
  const canGo = () => { go.disabled = !ta.value.trim() || busy(); };
  c.on(ta, 'input', canGo);
  c.on(ta, 'keydown', e => { if (e.key === 'Enter' && !e.shiftKey && !e.isComposing){ e.preventDefault(); generate(); } });
  c.on(form, 'submit', e => { e.preventDefault(); generate(); });

  /* ---------- the side: the gallery, newest first, and the style presets ---------- */
  function drawGallery(){
    const was = document.activeElement && galEl.contains(document.activeElement) ? document.activeElement.dataset.id : null;
    // two columns: each picture goes under the shorter one, so the columns end close together
    const cols = [[], []], h = [0, 0];
    gallery.forEach(img => { const k = h[0] <= h[1] ? 0 : 1; cols[k].push(img); h[k] += 1 / img.ar + .06; });
    galEl.innerHTML = cols.map(col => `<div class="igx-col">${col.map(img => `<button type="button" class="igx-g${img.fresh ? ' new' : ''}" data-id="${img.id}" aria-haspopup="dialog" aria-label="${esc(PIC[img.pic].alt)}" style="--ar:${img.ar};${look(img)}"><span class="igx-ly" data-pic="${img.pic}" data-pic-size="s"></span></button>`).join('')}</div>`).join('');
    gallery.forEach(img => { img.fresh = false; });
    cn.textContent = gallery.length;
    if (was){ const b = $(`[data-id="${was}"]`, galEl); if (b) b.focus({ preventScroll:true }); }
  }
  c.on(galEl, 'click', e => { const b = e.target.closest('.igx-g'); if (!b) return; const img = gallery.find(x => x.id === +b.dataset.id); if (img) openLB([...gallery], img, b, e.isTrusted); });
  prsEl.innerHTML = PRESETS.map(p => `<button type="button" class="igx-pr" aria-pressed="false" style="--art:${PIC[p.pic].g}"><span class="igx-prp"><span class="igx-ly" data-pic="${p.pic}" data-pic-size="s"></span></span><span class="igx-prt"><b>${p.n}</b><span class="muted">${p.d}</span></span></button>`).join('');
  $$('.igx-pr', prsEl).forEach((b, i) => b.onclick = () => {
    const p = PRESETS[i], before = new Set(styles);
    styles.clear(); p.s.forEach(x => styles.add(x));
    drawStyles(['Editorial', 'Poster', 'Surreal', '35mm'].filter(x => before.has(x) !== styles.has(x)));
    say(`${p.n}: ${p.s.join(' and ')}`);
    // where the side takes the feed's place, picking a preset goes back to the prompt it changed
    if (getComputedStyle(vw).display !== 'none') view('create');
  });
  const tb = $('.igx-tb', r), vw = $('.igx-vw', r);
  const tbSeg = seg(tb, v => tab(v)), vwSeg = seg(vw, v => view(v));
  function tab(v){ Object.entries(panes).forEach(([k, el]) => { el.hidden = k !== v; }); $$('button', tb).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v)); tbSeg.place(); }
  function view(v){ box.dataset.view = v; if (v !== 'create') tab(v); $$('button', vw).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === v)); vwSeg.place(); }

  /* ---------- the larger view: the picture as large as it fits, every action, Left and Right for the others ---------- */
  function openLB(list, img, from, mine){
    closePops(); hideTip(true);
    lb = { list, img, from }; drawLB();
    lbEl.hidden = false; lbEl.classList.remove('open'); void lbEl.offsetWidth; lbEl.classList.add('open');
    // the focus moves in only when a person opened it, so the demo never takes it from the page
    if (mine) $('.igx-lbx', lbEl).focus({ preventScroll:true });
  }
  function drawLB(){
    const { list, img } = lb, i = list.indexOf(img), P = PIC[img.pic];
    lbEl.setAttribute('aria-label', `Picture ${i + 1} of ${list.length}`);
    lbEl.innerHTML = `<div class="igx-lbh"><div class="igx-lbt"><b>${esc(img.prompt)}</b><span class="muted">${metaOf(img)}</span></div><span class="muted num">${i + 1} of ${list.length}</span><button type="button" class="ib igx-lbx" aria-label="Close" data-tip="Close" data-tip-k="Esc">${I('x')}</button></div>
      <div class="igx-lbb"><button type="button" class="pill line igx-lbn" data-a="prev" aria-label="Previous picture" data-tip="Previous"${i > 0 ? '' : ' disabled'}>${I('chev-l')}</button>
      <div class="igx-lbs"><figure class="igx-t" data-st="done" style="--ar:${img.ar};${look(img)}">${layers(img, '')}<span class="igx-l" aria-hidden="true"><span></span><span></span></span><span class="tag igx-tg">${img.up ? '2×' : ''}</span></figure></div>
      <button type="button" class="pill line igx-lbn" data-a="next" aria-label="Next picture" data-tip="Next"${i < list.length - 1 ? '' : ' disabled'}>${I('chev-r')}</button></div>
      <div class="igx-lbf" role="toolbar" aria-label="Picture actions">
        <button type="button" class="pill line sm" data-a="upscale" aria-label="Upscale" data-tip="Upscale to twice the size">${I('max', 'xs')}<span class="igx-lbl">Upscale</span></button>
        <button type="button" class="pill line sm" data-a="vary" aria-label="Vary" data-tip="Make a variation">${I('layers', 'xs')}<span class="igx-lbl">Vary</span></button>
        <button type="button" class="pill line sm" data-a="ref" aria-label="Use as reference" data-tip="Use as reference">${I('clip', 'xs')}<span class="igx-lbl">Use as reference</span></button>
        <button type="button" class="pill line sm" data-a="download" aria-label="Download" data-tip="Download">${I('down', 'xs')}<span class="igx-lbl">Download</span></button>
        <span class="igx-sep" aria-hidden="true"></span>
        <button type="button" class="ib" data-a="like" aria-label="Good picture" aria-pressed="${img.rate === 1}" data-tip="Good picture">${I('up-thumb')}</button>
        <button type="button" class="ib" data-a="dislike" aria-label="Bad picture" aria-pressed="${img.rate === -1}" data-tip="Bad picture">${I('down-thumb')}</button>
      </div>`;
    const ss = $('.igx-lbs>.igx-t .igx-s', lbEl); ss.setAttribute('role', 'img'); ss.setAttribute('aria-label', P.alt);
    $('.igx-lbs>.igx-t .igx-b', lbEl).setAttribute('aria-hidden', 'true');
  }
  function step(d){ const i = lb.list.indexOf(lb.img) + d; if (i < 0 || i >= lb.list.length) return; lb.img = lb.list[i]; const f = document.activeElement && document.activeElement.dataset.a; drawLB(); const b = f && $(`[data-a="${f}"]`, lbEl); if (b && !b.disabled) b.focus({ preventScroll:true }); else if (f) $('.igx-lbx', lbEl).focus({ preventScroll:true }); }
  function closeLB(back){
    if (!lb) return; const from = lb.from; lb = null; lbEl.hidden = true; lbEl.classList.remove('open'); lbEl.innerHTML = ''; hideTip(true);
    if (back && from && from.isConnected) from.focus({ preventScroll:true });
  }
  c.on(lbEl, 'click', e => {
    if (!lb) return;
    if (e.target.closest('.igx-lbx')) return closeLB(e.isTrusted);
    const a = e.target.closest('[data-a]'); if (!a) return;
    const img = lb.img, k = a.dataset.a;
    if (k === 'prev') step(-1); else if (k === 'next') step(1);
    else if (k === 'upscale') upscale(img);
    else if (k === 'vary') vary(img);
    else if (k === 'ref'){ closeLB(false); reference(img, e.isTrusted); }
    else if (k === 'download') download(img, a, $('.igx-lbs>.igx-t', lbEl));
    else { const up = k === 'like', on = img.rate !== (up ? 1 : -1); img.rate = on ? (up ? 1 : -1) : 0; $$('[data-a="like"],[data-a="dislike"]', lbEl).forEach(b => b.setAttribute('aria-pressed', b.dataset.a === k && on)); say(on ? (up ? 'Marked as good' : 'Marked as bad') : 'Rating removed'); }
  });
  c.on(lbEl, 'keydown', e => {
    if (!lb) return;
    if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); closeLB(true); return; }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !e.target.closest('.igx-lbf')){ e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); return; }
    // the focus stays inside while it is open
    if (e.key === 'Tab'){ const f = $$('button:not(:disabled)', lbEl); const a = f[0], z = f[f.length - 1]; if (e.shiftKey && document.activeElement === a){ e.preventDefault(); z.focus(); } else if (!e.shiftKey && document.activeElement === z){ e.preventDefault(); a.focus(); } }
  });

  drawGallery(); drawStyles(); canGo();

  /* the preview's story: generate four portraits (one fails and is retried), upscale one, open another and use it as a
     reference, then pick a style preset */
  const shown = el => el && el.getClientRects().length && getComputedStyle(el).visibility !== 'hidden';
  c.story(async s => {
    await s.beat(2);
    await s.tap(go);
    await s.until(() => run && !busy()); await s.beat(1.5);
    const bad = run.items.find(t => t.st === 'fail');
    if (bad){ await s.tap($('[data-a="retry"]', bad.el)); await s.until(() => !busy()); await s.beat(1.5); }
    const t2 = run.items[1];
    if (t2){ t2.el.classList.add('hov'); c.taken(() => t2.el.classList.remove('hov')); await s.point($('[data-a="upscale"]', t2.el)); await s.beat(1); await s.tap($('[data-a="upscale"]', t2.el)); await s.beat(4); t2.el.classList.remove('hov'); }
    await s.tap($('.igx-o', run.items[0].el)); await s.beat(3);
    await s.tap($('[data-a="ref"]', lbEl)); await s.beat(2.5);
    const sb = [$('.igx-tb [data-v="styles"]', r), $('.igx-vw [data-v="styles"]', r)].find(shown);
    if (sb){ await s.tap(sb); await s.beat(2); await s.tap($$('.igx-pr', prsEl)[2]); await s.beat(3); }
  });
});
/* ---------- the sections' components, loaded the first time a section comes near (DEF_PARTS in build.js) ---------- */
const PARTS = {"files":{"s-status":"/assets/v2-status.8d4ddf7a69.js","s-product":"/assets/v2-product.b8d27a446a.js","s-review":"/assets/v2-review.9255d5ad55.js","s-data":"/assets/v2-data.635fd5e0fa.js","s-workspace":"/assets/v2-workspace.a51181e45b.js","s-harness":"/assets/v2-harness.a05cbcfaa8.js","s-charts":"/assets/v2-charts.9a7629fce0.js","s-dates":"/assets/v2-dates.2a023484d7.js","s-forms":"/assets/v2-forms.43f89d0cc1.js","s-collab":"/assets/v2-collab.257770798d.js"},"of":{"status-pill":"s-status","step-loader":"s-status","thinking-states":"s-status","reasoning-trail":"s-status","thinking":"s-status","context-meter":"s-status","action-log":"s-status","run-queue":"s-status","agent-tree":"s-status","agent-inbox":"s-status","browser-session":"s-status","trace-view":"s-status","run-cost":"s-status","toast":"s-status","toast-stack":"s-status","pricing-cards":"s-product","onboarding-checklist":"s-product","stepper":"s-product","set-limit":"s-product","currency-converter":"s-product","run-summary":"s-status","error-recovery":"s-status","agent-lanes":"s-status","agent-run-timeline":"s-status","decision-prompt":"s-review","proposal-card":"s-review","rewrite-toolbar":"s-review","design-tuner":"s-review","permission-gate":"s-review","human-handoff":"s-review","launch-checklist":"s-review","plan-review":"s-review","change-review":"s-review","inline-text-diff":"s-review","draft-review":"s-review","steering":"s-review","eval-results":"s-review","design-review":"s-review","source-stack":"s-data","metric-insight":"s-data","task-table":"s-data","code-viewer":"s-data","terminal-stream":"s-data","details-panel":"s-data","citation-hover":"s-data","field-extraction":"s-data","workspace-rail":"s-workspace","command-palette":"s-workspace","agent-settings":"s-workspace","file-explorer":"s-workspace","automation-canvas":"s-workspace","canvas-toolbar":"s-workspace","step-inspector":"s-workspace","data-picker":"s-workspace","run-drawer":"s-workspace","memory-panel":"s-workspace","model-compare":"s-workspace","tool-connections":"s-workspace","knowledge-sources":"s-workspace","scheduled-runs":"s-workspace","harness":"s-harness","line-chart":"s-charts","bar-chart":"s-charts","donut-chart":"s-charts","funnel":"s-charts","top-pages":"s-charts","health-score":"s-charts","activity-heatmap":"s-charts","stat-cards":"s-charts","account-table":"s-charts","date-picker":"s-dates","segmented-control":"s-dates","date-range-picker":"s-dates","event-calendar":"s-dates","agenda":"s-dates","buttons":"s-forms","badge":"s-forms","tooltip":"s-forms","search-input":"s-forms","country-select":"s-forms","multi-select":"s-forms","social-signin":"s-forms","sign-in":"s-forms","otp-field":"s-forms","form":"s-forms","payment-form":"s-forms","comments":"s-collab","notifications":"s-collab","banner":"s-collab","invite":"s-collab","reactions":"s-collab","profile-menu":"s-collab","context-switcher":"s-collab","filter-menu":"s-collab","number-field":"s-collab","ticket-list":"s-collab","kanban":"s-collab","agent-builder":"s-workspace","agent-phases":"s-status","color-picker":"s-forms","context-menu":"s-collab","progress":"s-forms","radar-chart":"s-charts","radial-goals":"s-charts","scatter-chart":"s-charts","score-breakdown":"s-charts","slider":"s-forms","carousel":"s-forms","web-search":"s-status"},"all":["harness"]};
const partRun = src => eval(src);
// the markup of the cards whose section has a file of its own comes with that file
const TPLS = {};
{ const tpl = DM.tpl;
  DM.tpl = function(card){
    const id = card && card.dataset && card.dataset.v2;
    if (id && TPLS[id] != null && !$('template', card)){ const t = document.createElement('template'); t.innerHTML = TPLS[id]; card.appendChild(t); }
    return tpl.call(this, card);
  }; }
const partsDone = new Set(), partsLoading = {};
const loadPart = k => partsLoading[k] || (partsLoading[k] = fetch(PARTS.files[k]).then(r => { if (!r.ok) throw new Error(r.status + ' ' + PARTS.files[k]); return r.text(); })
  .then(src => { partRun(src + '\n//# sourceURL=' + location.origin + PARTS.files[k]); partsDone.add(k); }, e => { delete partsLoading[k]; throw e; }));
const partsOf = id => PARTS.all.includes(id) ? Object.keys(PARTS.files) : PARTS.of[id] ? [PARTS.of[id]] : [];
const hasDefs = id => partsOf(id).every(k => partsDone.has(k));
const needDefs = id => Promise.all(partsOf(id).map(loadPart));
/* ---------- on designme.dev: each card mounts its component when it scrolls into view ---------- */
{
  const layer = document.createElement('div'); layer.className = 'v2 v2-layer'; layer.appendChild(tip); document.body.appendChild(layer);
  const demoSeg = comp => $('.stage-in .dm>.demo .seg2', comp);
  // the card footer tabs follow the component's own variant switch
  const syncTabs = comp => {
    const g = $('.comp-foot [data-tabs]', comp), sg = demoSeg(comp); if (!g || !sg) return;
    const on = $('[aria-pressed="true"]', sg); let moved = false;
    $$('.tab', g).forEach(t => { const v = String(!!on && t.dataset.v === on.dataset.v); if (t.getAttribute('aria-selected') !== v){ t.setAttribute('aria-selected', v); moved = true; } });
    if (moved) dispatchEvent(new Event('resize'));
  };
  // the components' stylesheet loads without holding up the page's first paint (split-assets.js), so nothing mounts until
  // it is in: no component is ever drawn, or measures itself, unstyled
  const sheet = document.getElementById('v2-css');
  const ready = !sheet || sheet.tagName !== 'LINK' || sheet.media !== 'print' ? Promise.resolve()
    : new Promise(r => { sheet.addEventListener('load', r, { once:true }); sheet.addEventListener('error', r, { once:true }); });
  let styled = false; ready.then(() => { styled = true; });
  const whenStyled = fn => styled ? fn() : ready.then(fn);
  const waiting = new Set($$('.comp[data-v2]'));
  // and keep following it when the component flips it itself, as Banner's demo does
  // a card whose section hasn't loaded yet mounts as soon as it has (a failed load leaves it waiting for the next scroll)
  const mount = (comp, now) => { waiting.delete(comp);
    const go = () => { DM.mount(comp, now); syncTabs(comp);
      if (comp._tabsMo) comp._tabsMo.disconnect(); const sg = demoSeg(comp);
      if (sg){ comp._tabsMo = new MutationObserver(() => syncTabs(comp)); comp._tabsMo.observe(sg, { subtree:true, attributes:true, attributeFilter:['aria-pressed'] }); } };
    if (hasDefs(comp.dataset.v2)) go(); else needDefs(comp.dataset.v2).then(go, e => { console.warn('designme: components not loaded', e); if (!comp._c) waiting.add(comp); });
  };
  // a section's components load when it comes within a screen of the view, so its cards have them by the time they show
  const nearSec = new IntersectionObserver(es => es.forEach(en => { if (!en.isIntersecting) return; nearSec.unobserve(en.target);
    const ids = $$('.comp[data-v2]', en.target).map(c => c.dataset.v2); new Set(ids.flatMap(partsOf)).forEach(k => loadPart(k).catch(() => {})); }), { rootMargin:'100% 0px' });
  $$('.lib-sec').forEach(s => nearSec.observe(s));
  // a card mounts a quarter of a screen before it scrolls into view, so it has its component by the time it shows
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting){ io.unobserve(en.target); mount(en.target); } }), { rootMargin:'25% 0px' });
  // a card far from the screen stops drawing: its demo is hidden (the space it takes stays) and its CSS animations pause,
  // so a long visit never piles up a hundred running demos for the browser to paint. They pick up again a screen or so
  // before scrolling back into view. The height measuring script turns this off, since it reads every card at once
  if (!window.DM_NO_IDLE){ const idle = new IntersectionObserver(es => es.forEach(en => en.target.classList.toggle('dm-idle', !en.isIntersecting)), { rootMargin:'1000px 0px' }); $$('.comp[data-v2]').forEach(comp => idle.observe(comp)); }
  // the observers report a frame late, so a jump or a fling could land on a card that hasn't mounted yet, or is still
  // hidden, and paint it empty for a frame. As the page scrolls, any card on screen that hasn't mounted mounts at once and
  // shows without the entrance (which starts from nothing), and after a long jump any hidden card on screen shows again,
  // both in the same frame
  let lastY = scrollY;
  addEventListener('scroll', () => {
    const near = (r, m) => r.height && r.bottom > -m && r.top < innerHeight + m;
    if (styled) for (const comp of waiting) if (near(comp.getBoundingClientRect(), 0)){ io.unobserve(comp); mount(comp, true); }
    if (Math.abs(scrollY - lastY) > 400) $$('.comp.dm-idle').forEach(comp => { if (near(comp.getBoundingClientRect(), 200)) comp.classList.remove('dm-idle'); });
    lastY = scrollY;
  }, { passive:true });
  whenStyled(() => $$('.comp[data-v2]').forEach(comp => io.observe(comp)));
  $$('.comp[data-v2]').forEach(comp => {
    const g = $('.comp-foot [data-tabs]', comp);
    if (g) g.addEventListener('click', e => {
      const b = e.target.closest('.tab'); if (!b) return;
      whenStyled(() => {
        if (!comp._c){ io.unobserve(comp); mount(comp); }
        const sb = $(`.stage-in .dm>.demo .seg2 button[data-v="${b.dataset.v}"]`, comp);
        if (sb && sb.getAttribute('aria-pressed') !== 'true') sb.click();
      });
    });
  });
  // the card's Animate button replays the component from the start
  window.V2 = { replay: comp => whenStyled(() => { io.unobserve(comp); mount(comp); }) };
}
})();
