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
const BRAND = {"google": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 128 128\"><path fill=\"#e33629\" d=\"M44.59 4.21a64 64 0 0142.61.37 61.22 61.22 0 0120.35 12.62c-2 2.14-4.11 4.14-6.15 6.22Q95.58 29.23 89.77 35a34.28 34.28 0 00-13.64-8 37.17 37.17 0 00-37.46 9.74 39.25 39.25 0 00-9.18 14.91L8.76 35.6A63.53 63.53 0 0144.59 4.21z\"/><path fill=\"#f8bd00\" d=\"M3.26 51.5a62.93 62.93 0 015.5-15.9l20.73 16.09a38.31 38.31 0 000 24.63q-10.36 8-20.73 16.08a63.33 63.33 0 01-5.5-40.9z\"/><path fill=\"#587dbd\" d=\"M65.27 52.15h59.52a74.33 74.33 0 01-1.61 33.58 57.44 57.44 0 01-16 26.26c-6.69-5.22-13.41-10.4-20.1-15.62a29.72 29.72 0 0012.66-19.54H65.27c-.01-8.22 0-16.45 0-24.68z\"/><path fill=\"#319f43\" d=\"M8.75 92.4q10.37-8 20.73-16.08A39.3 39.3 0 0044 95.74a37.16 37.16 0 0014.08 6.08 41.29 41.29 0 0015.1 0 36.16 36.16 0 0013.93-5.5c6.69 5.22 13.41 10.4 20.1 15.62a57.13 57.13 0 01-25.9 13.47 67.6 67.6 0 01-32.36-.35 63 63 0 01-23-11.59A63.73 63.73 0 018.75 92.4z\"/></svg>", "github": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12\"/></svg>", "figma": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 128 128\"><path fill=\"#0acf83\" d=\"M45.5 129c11.9 0 21.5-9.6 21.5-21.5V86H45.5C33.6 86 24 95.6 24 107.5S33.6 129 45.5 129zm0 0\"/><path fill=\"#a259ff\" d=\"M24 64.5C24 52.6 33.6 43 45.5 43H67v43H45.5C33.6 86 24 76.4 24 64.5zm0 0\"/><path fill=\"#f24e1e\" d=\"M24 21.5C24 9.6 33.6 0 45.5 0H67v43H45.5C33.6 43 24 33.4 24 21.5zm0 0\"/><path fill=\"#ff7262\" d=\"M67 0h21.5C100.4 0 110 9.6 110 21.5S100.4 43 88.5 43H67zm0 0\"/><path fill=\"#1abcfe\" d=\"M110 64.5c0 11.9-9.6 21.5-21.5 21.5S67 76.4 67 64.5 76.6 43 88.5 43 110 52.6 110 64.5zm0 0\"/></svg>", "slack": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 128 128\"><path d=\"M27.255 80.719c0 7.33-5.978 13.317-13.309 13.317C6.616 94.036.63 88.049.63 80.719s5.987-13.317 13.317-13.317h13.309zm6.709 0c0-7.33 5.987-13.317 13.317-13.317s13.317 5.986 13.317 13.317v33.335c0 7.33-5.986 13.317-13.317 13.317-7.33 0-13.317-5.987-13.317-13.317zm0 0\" fill=\"#de1c59\"/><path d=\"M47.281 27.255c-7.33 0-13.317-5.978-13.317-13.309C33.964 6.616 39.951.63 47.281.63s13.317 5.987 13.317 13.317v13.309zm0 6.709c7.33 0 13.317 5.987 13.317 13.317s-5.986 13.317-13.317 13.317H13.946C6.616 60.598.63 54.612.63 47.281c0-7.33 5.987-13.317 13.317-13.317zm0 0\" fill=\"#35c5f0\"/><path d=\"M100.745 47.281c0-7.33 5.978-13.317 13.309-13.317 7.33 0 13.317 5.987 13.317 13.317s-5.987 13.317-13.317 13.317h-13.309zm-6.709 0c0 7.33-5.987 13.317-13.317 13.317s-13.317-5.986-13.317-13.317V13.946C67.402 6.616 73.388.63 80.719.63c7.33 0 13.317 5.987 13.317 13.317zm0 0\" fill=\"#2eb57d\"/><path d=\"M80.719 100.745c7.33 0 13.317 5.978 13.317 13.309 0 7.33-5.987 13.317-13.317 13.317s-13.317-5.987-13.317-13.317v-13.309zm0-6.709c-7.33 0-13.317-5.987-13.317-13.317s5.986-13.317 13.317-13.317h33.335c7.33 0 13.317 5.986 13.317 13.317 0 7.33-5.987 13.317-13.317 13.317zm0 0\" fill=\"#ebb02e\"/></svg>", "notion": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 24 24\"><path fill=\"currentColor\" d=\"M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L17.86 1.968c-.42-.326-.981-.7-2.055-.607L3.01 2.295c-.466.046-.56.28-.374.466zm.793 3.08v13.904c0 .747.373 1.027 1.214.98l14.523-.84c.841-.046.935-.56.935-1.167V6.354c0-.606-.233-.933-.748-.887l-15.177.887c-.56.047-.747.327-.747.933zm14.337.745c.093.42 0 .84-.42.888l-.7.14v10.264c-.608.327-1.168.514-1.635.514-.748 0-.935-.234-1.495-.933l-4.577-7.186v6.952L12.21 19s0 .84-1.168.84l-3.222.186c-.093-.186 0-.653.327-.746l.84-.233V9.854L7.822 9.76c-.094-.42.14-1.026.793-1.073l3.456-.233 4.764 7.279v-6.44l-1.215-.139c-.093-.514.28-.887.747-.933zM1.936 1.035l13.31-.98c1.634-.14 2.055-.047 3.082.7l4.249 2.986c.7.513.934.653.934 1.213v16.378c0 1.026-.373 1.634-1.68 1.726l-15.458.934c-.98.047-1.448-.093-1.962-.747l-3.129-4.06c-.56-.747-.793-1.306-.793-1.96V2.667c0-.839.374-1.54 1.447-1.632z\"/></svg>", "linear": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 24 24\"><path fill=\"#5e6ad2\" d=\"M2.886 4.18A11.982 11.982 0 0 1 11.99 0C18.624 0 24 5.376 24 12.009c0 3.64-1.62 6.903-4.18 9.105L2.887 4.18ZM1.817 5.626l16.556 16.556c-.524.33-1.075.62-1.65.866L.951 7.277c.247-.575.537-1.126.866-1.65ZM.322 9.163l14.515 14.515c-.71.172-1.443.282-2.195.322L0 11.358a12 12 0 0 1 .322-2.195Zm-.17 4.862 9.823 9.824a12.02 12.02 0 0 1-9.824-9.824Z\"/></svg>", "gmail": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"52 42 88 66\"><path fill=\"#4285f4\" d=\"M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6\"/><path fill=\"#34a853\" d=\"M120 108h14c3.32 0 6-2.69 6-6V59l-20 15\"/><path fill=\"#fbbc04\" d=\"M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2\"/><path fill=\"#ea4335\" d=\"M72 74V48l24 18 24-18v26L96 92\"/><path fill=\"#c5221f\" d=\"M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2\"/></svg>", "drive": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 87.3 78\"><path fill=\"#0066da\" d=\"m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z\"/><path fill=\"#00ac47\" d=\"m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a9.06 9.06 0 0 0-1.2 4.5h27.5z\"/><path fill=\"#ea4335\" d=\"m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5h-27.502l5.852 11.5z\"/><path fill=\"#00832d\" d=\"m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z\"/><path fill=\"#2684fc\" d=\"m59.8 53h-32.3l-13.75 23.8c1.35.8 2.9 1.2 4.5 1.2h50.8c1.6 0 3.15-.45 4.5-1.2z\"/><path fill=\"#ffba00\" d=\"m73.4 26.5-12.7-22c-.8-1.4-1.95-2.5-3.3-3.3l-13.75 23.8 16.15 28h27.45c0-1.55-.4-3.1-1.2-4.5z\"/></svg>", "meet": "<svg class=\"brand\" aria-hidden=\"true\" viewBox=\"0 0 87.5 72\"><path fill=\"#00832d\" d=\"M49.5 36l8.53 9.75 11.47 7.33 2-17.02-2-16.64-11.69 6.44z\"/><path fill=\"#0066da\" d=\"M0 51.5V66c0 3.315 2.685 6 6 6h14.5l3-10.96-3-9.54-9.95-3z\"/><path fill=\"#e94235\" d=\"M20.5 0L0 20.5l10.55 3 9.95-3 2.95-9.41z\"/><path fill=\"#2684fc\" d=\"M20.5 20.5H0v31h20.5z\"/><path fill=\"#00ac47\" d=\"M82.6 8.68L69.5 19.42v33.66l13.16 10.79c1.97 1.54 4.85.135 4.85-2.37V11c0-2.535-2.945-3.925-4.91-2.32zM49.5 36v15.5h-29V72h43c3.315 0 6-2.685 6-6V53.08z\"/><path fill=\"#ffba00\" d=\"M63.5 0h-43v20.5h29V36l20-16.57V6c0-3.315-2.685-6-6-6z\"/></svg>"};
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
        // the browser marks the input and change events of a scripted click on a checkbox or radio as trusted, so the press is
        // flagged as the story's own (c.own) and doesn't read as the visitor taking over
        await sleep(160); check(); const y = scrollY, x = scrollX; c.own = (c.own || 0) + 1;
        try { (el.matches('label') && el.control ? el.control : el).click(); } finally { c.own--; }
        if (scrollY !== y || scrollX !== x) scrollTo(x, y);
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
/* grow(): a container that grows with what it holds (owner, 17 Nov: no room reserved for the final state). Its content moves
   into a .dm-grow wrapper, and the container's height follows the wrapper's, eased, so it opens smoothly as rows arrive and
   closes as they go, staying centred in its stage as it does. Returns a function that stops it */
function grow(el){
  if (!el || el._grow) return () => {};
  const w = document.createElement('div'); w.className = 'dm-grow';
  while (el.firstChild) w.appendChild(el.firstChild);
  el.appendChild(w); el.classList.add('growing');
  const box = () => { const cs = getComputedStyle(el); return parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom) + parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth); };
  let first = true;
  // the wrapper's layout height (offsetHeight), not its box on screen, so an entrance that scales the card (.98 in Clean)
  // never leaves it short
  const fit = () => { const h = Math.ceil(w.offsetHeight + box());
    if (first){ el.style.transition = 'none'; el.style.height = h + 'px'; void el.offsetHeight; el.style.transition = ''; first = false; } else el.style.height = h + 'px'; };
  const ro = new ResizeObserver(fit); ro.observe(w); fit();
  return el._grow = () => { ro.disconnect(); el._grow = null; el.style.height = ''; el.classList.remove('growing'); };
}
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
    // where the field sits in its layout: its own glide taken off, and any move its parents are still making (the homepage
    // card's entrance and its own glide as it grows), or a placement measured mid-entrance would stay off for good
    let now = new DOMMatrixReadOnly(getComputedStyle(el).transform).m42;
    for (let a = el.parentElement; a && a !== room; a = a.parentElement){ const t = getComputedStyle(a).transform; if (t && t !== 'none') now += new DOMMatrixReadOnly(t).m42; }
    const top = el.getBoundingClientRect().top - now - rr.top;
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
   Soft rises out of a blur; Blueprint wipes down and ticks its parts in, in short hard beats; Clean rises calmly, 8px from .98. Each animation only
   names where it starts, so it ends on whatever the element's own styles say, and leaves nothing behind */
const REVEAL = {
  soft:{ root:[{ opacity:0, transform:'translateY(14px)' }], rootMs:820, part:[{ opacity:0, filter:'blur(6px)', transform:'translateY(8px)' }], partMs:760, first:110, step:65, max:620, ease:'cubic-bezier(.16,1,.3,1)' },
  // Clean: the card fades and rises 8px from .98 over 680ms, then its pieces follow 50ms apart, each rising 6px (owner, 17 Nov;
  // calmer on 18 Nov)
  clean:{ root:[{ opacity:0, transform:'translateY(8px) scale(.98)' }], rootMs:680, part:[{ opacity:0, transform:'translateY(6px)' }], partMs:560, first:140, step:50, max:520, ease:'cubic-bezier(.23,1,.32,1)' },
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
  PLAYS:new Set(['status-pill','step-loader','thinking','reasoning-trail','agent-lanes','agent-run-timeline','trace-view','agent-tree','terminal-stream','attachment-tray','progress','web-search','thinking-states','run-drawer','live-answer','harness']),
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
    const mine = e => { if (e.isTrusted && !c.own) c.mine = true; };
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
let tipT = 0, tipFor = null, tipNext = null, tipRaf = 0, tipAt = '';
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
  placeTip(el); tipAt = ''; cancelAnimationFrame(tipRaf); tipRaf = requestAnimationFrame(tipFollow);
}
// the tip goes where its trigger goes: a demo that keeps playing under the pointer (rows growing in, a card resizing) carries
// it along instead of leaving it behind (owner, 19 Nov). Only the trigger's box is read each frame, and only while a tip shows
function tipFollow(){
  tipRaf = 0; if (!tipFor) return;
  const r = tipFor.getBoundingClientRect(), at = `${r.left},${r.top},${r.width},${r.height}`;
  if (tipAt && at !== tipAt) placeTip(tipFor);
  tipAt = at; tipRaf = requestAnimationFrame(tipFollow);
}
function placeTip(el){
  const r = el.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight;
  // it stays inside the component's stage when it fits there, so on a phone it never runs past the card's edge
  // (the stage you see: on a component page the stage-in's own parent hugs the component, and a tip near its edge would be
  // pushed off its button)
  const st = el.closest('.stage-in'), sb = st && (st.closest('.stage-inner') || st.parentElement).getBoundingClientRect();
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
  clearTimeout(tipT); cancelAnimationFrame(tipRaf); tipRaf = 0; tipFor = null; tipNext = null; tipWatch.disconnect(); if (tip.classList.contains('show')) tipHid = performance.now(); tip.classList.remove('show'); tip.setAttribute('aria-hidden','true'); }
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
/* how the last thing was done, with a pointer or the keyboard: a control pressed with a mouse or a finger, or focus handed
   back to a popover's button after a click, shows no ring (a mouse or a tap never shows one); a key that moves or acts does.
   A modifier on its own (Shift, Cmd, Ctrl, Alt: a screenshot shortcut, say) is not one, though the browser counts it */
let byKey = false;
const MODS = new Set(['Shift', 'Meta', 'Control', 'Alt', 'AltGraph', 'CapsLock', 'Fn', 'OS']);
addEventListener('keydown', e => { if (e.metaKey || e.ctrlKey || e.altKey || MODS.has(e.key)) return; byKey = true; const a = document.activeElement; if (a && a.dataset && 'nofv' in a.dataset) delete a.dataset.nofv; }, true);
addEventListener('pointerdown', e => { byKey = false;
  const t = e.target && e.target.closest && e.target.closest('button,a[href],summary,[tabindex],[role="button"],[role="switch"],[role="checkbox"],[role="radio"],[role="tab"],[role="option"],[role="menuitem"],[role="menuitemradio"],label,input,select');
  const f = t && t.tagName === 'LABEL' ? t.control : t;
  if (f && f.dataset && !('nofv' in f.dataset)){ f.dataset.nofv = ''; f.addEventListener('blur', () => { delete f.dataset.nofv; }, { once:true }); }
}, true);
function giveBack(btn){ btn.focus({ preventScroll:true, focusVisible:byKey }); if (!byKey){ btn.dataset.nofv = ''; btn.addEventListener('blur', () => { delete btn.dataset.nofv; }, { once:true }); } }
function closePops(){ if (!openPop) return; const { pop:p, btn } = openPop, back = p.contains(document.activeElement); p.classList.remove('open'); p.inert = true; btn.setAttribute('aria-expanded','false'); openPop = null; if (back && btn.isConnected) giveBack(btn); setTimeout(() => { p.inert = false; if (!p.classList.contains('open')){ p.style.left = '0px'; p.style.top = '0px'; } }, 300); }
/* the room a popover may open into: the window, cut by any box around the component that clips what spills out of it (a
   homepage card's stage, a component page's demo), so a menu is never cropped (owner, 18 Nov) */
function popRoom(btn){
  let top = 0, bottom = innerHeight;
  for (let a = (btn.closest('.stage-in') || btn).parentElement; a && a !== document.documentElement; a = a.parentElement){
    if (getComputedStyle(a).overflowY === 'visible') continue;
    const r = a.getBoundingClientRect(); top = Math.max(top, r.top); bottom = Math.min(bottom, r.bottom);
  }
  return { top, bottom };
}
function placePop(btn, pop){
  const host = pop.offsetParent || pop.parentElement; const hr = host.getBoundingClientRect(), br = btn.getBoundingClientRect();
  // below when it fits there; above when it doesn't and fits above, or has more room there
  const room = popRoom(btn), need = pop.offsetHeight + 12, below = room.bottom - br.bottom, above = br.top - room.top;
  const up = btn.dataset.popPos === 'up' || (btn.dataset.popPos !== 'down' && below < need && (above >= need || above > below));
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



/* ---------- Agent tree ---------- */
/* the lines and the flow, drawn every frame from where the marks are. The tree's rows are treeitems (.atr-n, with data-id
   and data-s) whose mark is .atr-g (data-m); atrLines reads them from the page, so whatever draws the rows (this script,
   or React) gets the same lines. A row that appears after the start opens its space (data-ph="open"), its parent's line
   draws down to it and its branch out to its mark (data-ph="wait"), then it rises in (data-ph="in"), one row at a time.
   A parent's line is a grey rail with its tinted part over it, down to the last child that has started; a branch takes the
   tint once the tint has reached it, the grey while its child is queued, and the bad colour for a failed child. Each
   agent's band eases from the run's source to the step that agent is on, once that whole route is drawn */
const ATR_TICK = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5" pathLength="1"/></svg>';
const ATR_CROSS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7 7l10 10M17 7L7 17" pathLength="1"/></svg>';
// what a mark holds in each state (a finished disc is the mark itself, with its tick or cross)
const atrMark = m => m === 'run' ? '<span class="atr-spin"></span>' : m === 'wait' ? '<span class="atr-wt"></span>' : m === 'done' ? ATR_TICK : m === 'fail' ? ATR_CROSS : m === 'src' ? '' : '<span class="atr-ring"></span>';
// a mark's visible radius: rings and spinners are 14px; finished discs and the waiting mark carry a 2px cut-out border
const atrMarkR = m => m === 'done' || m === 'fail' || m === 'src' || m === 'wait' ? 9 : 7;
const atrEz = u => 1 - Math.pow(1 - Math.min(1, Math.max(0, u)), 3);
// the way on under a row closes its height as it goes, so the tree shrinks with it smoothly instead of jumping (owner, 17 Nov)
const atrDrop = el => { el.classList.add('atr-gone'); if (REDUCE || !el.animate || !el.isConnected) return el.remove();
  el.inert = true; el.animate([{ height:el.offsetHeight + 'px', opacity:1 }, { height:'0px', paddingBottom:'0px', opacity:0 }], { duration:320, easing:'cubic-bezier(.22,1,.36,1)', fill:'forwards' }).finished.then(() => el.remove(), () => el.remove()); };
function atrLines(tree){
  const NS = 'http://www.w3.org/2000/svg', mk = (t, a = {}) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
  // the svg is the tree's first child (one is made if the markup has none)
  let svg = tree.querySelector(':scope>.atr-ln'); if (!svg){ svg = mk('svg', { class:'atr-ln', 'aria-hidden':'true' }); tree.prepend(svg); }
  const defs = mk('defs'), gRail = mk('g'), gLine = mk('g'), gBand = mk('g'); svg.replaceChildren(defs, gRail, gLine, gBand);
  const uid = 'atr' + (atrLines.n = (atrLines.n || 0) + 1), host = tree.closest('.atr') || tree;
  // OPEN: a row's space opening; BR: a branch drawing out; TINT: the tint gliding down to a step that starts; GO: a line
  // drawing back in as its branch folds
  const OPEN = .22, BR = .16, TINT = .3, GO = .14, BAND = 210, CORE = .541, STOPS = [[0, 'l0'], [.19, 'l1'], [CORE, 'c'], [.781, 'l2'], [1, 'l0']];
  const S = new Map(), bands = new Map(), queue = [];
  let T = 0, last = 0, booted = false, prev = null, bn = 0;
  const shown = x => x.ph === 'in' || x.ph === 'shown';
  const folded = x => { for (let p = x.parent; p; p = p.parent) if (p.el.getAttribute('aria-expanded') === 'false') return true; return false; };
  // a line that is cut short is drawn from its start: reveal 0 to 1
  const draw = (p, d, cls, reveal = 1) => {
    p.setAttribute('d', reveal > .001 ? d : ''); p.setAttribute('class', cls);
    if (reveal >= 1 || !d){ p.style.strokeDasharray = ''; p.style.strokeDashoffset = ''; return; }
    const len = p.getTotalLength(); p.style.strokeDasharray = len; p.style.strokeDashoffset = len * (1 - reveal);
  };
  const restart = (el, a) => { el.removeAttribute(a); void el.offsetWidth; el.setAttribute(a, ''); };
  // reads the rows on the page: new ones, ones that went, their parents and children, and the marks and text that changed
  function sync(){
    const els = [...tree.querySelectorAll('.atr-n')].filter(el => !el.closest('[hidden]')), seen = new Set();
    for (const el of els){
      const id = el.dataset.id; seen.add(id);
      let x = S.get(id);
      if (!x || x.el !== el){
        if (x) gone(x);
        x = { id, el, q:0, b:0, ph:'shown', rt:null, rf:null, r0:-1e9, fol:false };
        // rows there from the start are drawn at once; later ones open, draw and rise, one at a time
        if (booted && !REDUCE){ x.ph = 'open'; el.dataset.ph = 'open'; el.style.height = '0px'; queue.push(x); }
        else { x.q = 1; x.b = 1; x.boot = true; el.removeAttribute('data-ph'); el.style.height = ''; }
        S.set(id, x);
      }
      x.st = el.dataset.s; x.g = el.querySelector(':scope>.atr-b>.atr-r>.atr-g'); x.sub = el.querySelector(':scope>.atr-b>.atr-r .atr-sub');
      // a mark swaps at once and a tick or cross draws itself; a line of text that changes rises into place
      const m = x.g ? x.g.dataset.m : '';
      if (x.m !== undefined && m !== x.m && (m === 'done' || m === 'fail') && !REDUCE) restart(x.g, 'data-drw');
      x.m = m;
      const t = x.sub ? x.sub.textContent : '';
      if (x.t !== undefined && t !== x.t && x.ph === 'shown' && !REDUCE) restart(x.sub, 'data-sw');
      x.t = t;
    }
    for (const x of [...S.values()]) if (!seen.has(x.id)) gone(x);
    for (const x of S.values()){ const p = x.el.parentElement && x.el.parentElement.closest('.atr-n'); x.parent = p && S.get(p.dataset.id) || null; x.kids = []; }
    for (const el of els){ const x = S.get(el.dataset.id); if (x.parent) x.parent.kids.push(x); }
    booted = true;
  }
  function gone(x){ for (const k of ['pr', 'pt', 'pb']) if (x[k]) x[k].remove(); S.delete(x.id); const i = queue.indexOf(x); if (i >= 0) queue.splice(i, 1); }

  function frame(t){
    const dt = last ? Math.max(0, Math.min(.05, (t - last) / 1000)) : 0; last = Math.max(last, t); T += dt;
    sync();
    const red = REDUCE, cs = getComputedStyle(host), R = parseFloat(cs.getPropertyValue('--atr-r')) || 8, cut = cs.getPropertyValue('--atr-cut').trim() === '1';
    // one row's space opens at a time, once the row before it has risen in and its parent is there
    if (red) for (const x of queue.splice(0)){ x.ph = 'shown'; x.el.removeAttribute('data-ph'); x.el.style.height = ''; x.q = x.b = 1; }
    if (!prev || !S.has(prev.id) || shown(prev)){
      const nx = queue[0];
      if (nx && (!nx.parent || shown(nx.parent))){ queue.shift(); prev = nx; nx.ph = 'opening'; nx.t1 = T; nx.el.style.height = ''; nx.nh = nx.el.offsetHeight; nx.el.style.height = '0px'; }
    }
    for (const x of S.values()) if (x.ph === 'opening'){
      const u = (T - x.t1) / OPEN;
      if (u >= 1){ x.el.style.height = ''; x.ph = 'wait'; x.el.dataset.ph = 'wait'; } else x.el.style.height = (x.nh * atrEz(u)).toFixed(2) + 'px';
    }
    // where every mark is this frame, in the tree's own space (a zoom or a transform on the page doesn't move the lines)
    const tb = tree.getBoundingClientRect(), sc = tb.width / (tree.offsetWidth || tb.width) || 1;
    for (const x of S.values()){ const b = x.g.getBoundingClientRect(); x.cx = (b.left + b.width / 2 - tb.left) / sc; x.cy = (b.top + b.height / 2 - tb.top) / sc; x.r = atrMarkR(x.m); }
    const corner = (x0, y, x1) => cut ? `L${x1} ${y}` : `Q${x0} ${y} ${x1} ${y}`;
    for (const P of S.values()){
      if (!P.kids.length && !P.pr) continue;
      if (!P.pr){ P.pr = mk('path', { 'data-p':P.id }); gRail.append(P.pr); P.pt = mk('path', { 'data-p':P.id }); gLine.append(P.pt); }
      const x0 = P.cx, y0 = P.cy + P.r - 1;
      // the rail draws down to each child in turn as its space opens, and back up as a branch folds
      let cur = y0, end = y0;
      for (const k of P.kids){
        const want = k.ph !== 'open' && k.ph !== 'opening' && !folded(k), y = k.cy - R;
        if (want && k.q < 1){ if (k.q0 == null){ k.qd = red ? 0 : Math.min(.26, Math.max(.1, (y - cur) / 520)); k.q0 = T - k.q * k.qd; } k.q = k.qd ? Math.min(1, (T - k.q0) / k.qd) : 1; }
        else if (!want){ k.q0 = null; k.q = red ? 0 : Math.max(0, k.q - dt / GO); }
        k.on = want;
        if (k.q > 0){ cur = k.q >= 1 ? y : cur + (y - cur) * atrEz(k.q); end = Math.max(end, cur); }
      }
      draw(P.pr, end - y0 > 2 ? `M${x0} ${y0}V${end}` : '', 'r');
      // the tint: down to the last child that has started. It follows the rail down to a child that joins already at work,
      // and glides down to one that starts later
      let to = null; for (const k of P.kids) if (k.q > 0 && k.st !== 'queued') to = k;
      if (to !== P.rt){ P.rf = P.ru >= 1 || P.boot ? P.rt : P.rf; P.rt = to; P.r0 = P.boot ? -1e9 : T; P.fol = !!to && to.q < 1; }
      P.ru = P.fol || red ? 1 : Math.min(1, (T - P.r0) / TINT);
      const yOf = k => k && S.has(k.id) ? k.cy - R : y0, reach = Math.min(end, yOf(P.rf) + (yOf(P.rt) - yOf(P.rf)) * atrEz(P.ru));
      draw(P.pt, reach - y0 > 2 ? `M${x0} ${y0}V${reach}` : '', 'on');
      // each branch draws out once the rail is at it (and, for a child at work, the tint too); then its row rises in
      for (const k of P.kids){
        if (!k.pb){ k.pb = mk('path', { 'data-k':k.id }); gLine.append(k.pb); }
        const y = k.cy - R; k.lit = k.st !== 'queued' && reach >= y - .5;
        if (k.on && k.q >= 1){ if (k.b0 == null && (k.st === 'queued' || k.lit)) k.b0 = T - k.b * BR; if (k.b0 != null) k.b = red ? 1 : Math.min(1, (T - k.b0) / BR); }
        else if (!k.on){ k.b0 = null; k.b = red ? 0 : Math.max(0, k.b - dt / GO); }
        // (a cut corner starts half a line's width up the parent's line, so its sharp joint is drawn whole, with no notch)
        draw(k.pb, `M${x0} ${cut ? y - .75 : y}` + (cut ? `L${x0} ${y}` : '') + corner(x0, k.cy, x0 + R) + `L${k.cx - k.r + 1} ${k.cy}`, k.st === 'fail' ? 'bad' : k.lit ? 'on' : 'r', k.b);
        if (k.ph === 'wait' && k.b >= 1){ k.ph = 'in'; k.el.dataset.ph = 'in'; k.tin = T; }
      }
      P.boot = false;
    }
    for (const x of S.values()) if (x.ph === 'in' && T - x.tin > .6){ x.ph = 'shown'; x.el.removeAttribute('data-ph'); }
    // the bands: one per agent, to the step it is working on now (the last running step under it with nothing running
    // under that). A band belongs to its agent, so when one step finishes and the next starts it carries on; when its agent
    // has nothing running it finishes the trip it is on and goes
    const root = [...S.values()].find(x => !x.parent), agentOf = x => { while (x.parent && x.parent.parent) x = x.parent; return x; };
    const want = new Map();
    for (const x of S.values()) if (x.parent && x.st === 'run' && shown(x) && !x.kids.some(k => k.st === 'run' && shown(k))) want.set(agentOf(x).id, x);
    for (const [id, f] of bands) if (!want.has(id)) f.end = true;
    for (const [id, x] of want){ let f = bands.get(id); if (!f) f = band(id); f.to = x; f.end = false; }
    for (const [id, f] of bands){
      const chain = []; for (let x = f.to; x; x = x.parent) chain.unshift(x);
      const ready = root && chain[0] === root && chain.slice(1).every(x => S.has(x.id) && x.q >= 1 && x.b >= 1 && x.lit && shown(x) && !folded(x));
      if (!ready || red){ f.el.style.opacity = 0; f.start = null; if (f.end){ f.el.remove(); f.gr.remove(); bands.delete(id); } continue; }
      // one route from the source's edge, down each line and along each branch to the next mark's centre (under the mark),
      // in one piece: dashes start again on every piece of a path
      let d = `M${root.cx} ${root.cy + root.r - 1}`, px = root.cx;
      for (const x of chain.slice(1)){ d += `L${px} ${x.cy - R}` + corner(px, x.cy, px + R) + `L${x.cx} ${x.cy}`; px = x.cx; }
      f.core.setAttribute('d', d); const len = f.core.getTotalLength();
      // a trip: about 170px a second, 1.8 to 3.4s, eased at both ends, fading in as it leaves and out as it arrives, then
      // a short rest. A band whose agent has nothing left running ends with the trip it is on
      if (f.start == null || (!f.end && T - f.start >= f.trip + .35)){ if (f.end){ f.el.remove(); f.gr.remove(); bands.delete(id); continue; } f.start = T; f.len0 = len; f.trip = Math.min(3.4, Math.max(1.8, len / 170)); }
      const u = (T - f.start) / f.trip;
      if (u >= 1){ f.el.style.opacity = 0; if (f.end){ f.el.remove(); f.gr.remove(); bands.delete(id); } continue; }
      f.el.style.opacity = Math.min(1, u / .18, (1 - u) / .22).toFixed(3);
      const at = Math.min(len, (.5 - Math.cos(Math.PI * u) / 2) * f.len0), t0 = at - BAND * CORE, a = along(f.core, len, t0), b = along(f.core, len, t0 + BAND);
      f.core.style.strokeDasharray = `${BAND} ${len + BAND * 2}`; f.core.style.strokeDashoffset = -t0;
      f.gr.setAttribute('x1', a.x); f.gr.setAttribute('y1', a.y); f.gr.setAttribute('x2', b.x + (a.x === b.x ? .01 : 0)); f.gr.setAttribute('y2', b.y + (a.y === b.y ? .01 : 0));
    }
  }
  // a point on the route, carried on past either end in the route's own direction there (the band's gradient runs from its
  // back end to its front, which can be off the route while it leaves or arrives)
  function along(p, len, t){
    if (t >= 0 && t <= len) return p.getPointAtLength(t);
    const q = p.getPointAtLength(t < 0 ? 0 : len), r = p.getPointAtLength(t < 0 ? Math.min(len, 1) : Math.max(0, len - 1)), dx = q.x - r.x, dy = q.y - r.y, m = Math.hypot(dx, dy) || 1, k = t < 0 ? -t : t - len;
    return { x:q.x + dx / m * k, y:q.y + dy / m * k };
  }
  function band(id){
    const gid = `${uid}-b${++bn}`, gr = mk('linearGradient', { id:gid, gradientUnits:'userSpaceOnUse' });
    STOPS.forEach(([o, k]) => gr.append(mk('stop', { class:k, offset:o }))); defs.append(gr);
    const el = mk('g', { class:'atr-bd', 'data-a':id }), core = mk('path', { stroke:`url(#${gid})` }); el.append(core); el.style.opacity = 0; gBand.append(el);
    const f = { el, gr, core, start:null, end:false, to:null }; bands.set(id, f); return f;
  }
  // a row's phase: open (its space is opening), wait (its line is drawing to it), in (rising in) or shown
  return { sync, frame, phase:id => (S.get(id) || {}).ph };
}
DM.def('agent-tree', (r, c) => {
  // the run: the orchestrator splits the work between three agents, and each agent between its steps. Each agent has its
  // avatar colour (av) and icon (ic); each step the app it works in (app) or an icon. s is the state it joins in and t what
  // it is on. One step fails and the orchestrator reroutes it to a retry; the last one waits for a person to approve it
  const RUN = [
    { id:'root', n:'Orchestrator', t:'Splitting the work', ic:'spark', s:'run' },
    { id:'res', p:'root', n:'Research', t:'5 competitor pages', ic:'globe', av:'l' },
    { id:'res1', p:'res', n:'Read the pages', t:'Reading 1 of 5', ic:'file-text' },
    { id:'des', p:'root', n:'Design', t:'Plan cards in Figma', ic:'palette', av:'p' },
    { id:'des1', p:'des', n:'Update cards', t:'Pricing v4', app:'figma' },
    { id:'des2', p:'des', n:'Brand tokens', t:'Colours and spacing', app:'figma' },
    { id:'des3', p:'des', n:'Retry tokens', t:'Rerouted to accent.500', app:'figma' },
    { id:'cop', p:'root', n:'Copy', t:'Rewrite the plan blurbs', ic:'edit', av:'m' },
    { id:'cop1', p:'cop', n:'Post to Slack', t:'Needs your OK', app:'slack', cost:.006, tok:140 }
  ];
  const root = $('.atr', r), tree = $('.atr-tree', r), meta = $('.atr-m', r), time = $('.atr-time', r), tot = $('.atr-tot', r), foot = $('.atr-f', r), sr = $('.atr-sr', r);
  const N = RUN.map(x => ({ cost:0, tok:0, ...x, s:x.s || 'queued', kids:[], secs:0, t0:0 })), by = id => N.find(n => n.id === id);
  N.forEach(n => { n.parent = n.p ? by(n.p) : null; n.lv = n.parent ? n.parent.lv + 1 : 0; if (n.parent) n.parent.kids.push(n); });
  const money = v => '$' + v.toFixed(2), clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const toks = v => v >= 1000 ? (v / 1000).toFixed(v >= 10000 ? 0 : 1).replace(/\.0$/, '') + 'k' : String(Math.round(v));
  const here = n => !n.el.hidden, under = n => n.kids.filter(here);
  const sum = n => n.cost + under(n).reduce((a, k) => a + sum(k), 0), sumTok = n => n.tok + under(n).reduce((a, k) => a + sumTok(k), 0);
  const word = { queued:'queued', run:'running', wait:'needs you', done:'done', fail:'failed' };

  // the rows, all built at the start and hidden until each joins the run
  const build = n => {
    const who = n.app ? `<span class="atr-av app" aria-hidden="true">${BRAND[n.app]}</span>` : `<span class="atr-av${n.av || !n.lv ? '' : ' app'}" aria-hidden="true"${n.av ? ` style="--a:var(--av-${n.av});--ai:var(--av-${n.av}-ink)"` : ''}>${I(n.ic, 'xs')}</span>`;
    const m = n.lv ? n.s : 'src';
    n.el = html(`<div class="atr-n" role="treeitem" aria-level="${n.lv + 1}" aria-selected="false" tabindex="${n.lv ? -1 : 0}" data-id="${n.id}" data-s="${n.s}" style="--lv:${n.lv}"><div class="atr-b"><div class="atr-r"><span class="atr-g" data-m="${m}" aria-hidden="true">${atrMark(m)}</span>${who}<span class="atr-tx"><span class="atr-nm"></span>${n.kids.length ? `<span class="atr-tg" aria-hidden="true">${I('chev-d', 'xs')}</span>` : ''}<span class="atr-sub"></span></span><span class="atr-q num"><span class="atr-c"></span></span></div></div></div>`);
    $('.atr-nm', n.el).textContent = n.n; $('.atr-sub', n.el).textContent = n.t;
    n.tg = $('.atr-tg', n.el); if (n.tg) n.tg.hidden = true;
    if (n.kids.length){ n.fold = html('<div class="fold atr-kids"><div role="group"></div></div>'); n.kids.forEach(k => n.fold.firstElementChild.appendChild(build(k))); n.el.appendChild(n.fold); }
    if (n.lv) n.el.hidden = true;
    return n.el;
  };
  tree.appendChild(build(N[0]));
  const T = N[0];

  // the tree grows with its rows (owner, 17 Nov: no room reserved for a later state): the panel opens at the height of what it
  // holds and eases taller as each row arrives, and shorter as a branch folds, staying centred in its stage (grow())
  c.offs.push(grow(root));

  const L = atrLines(tree);
  c.loop(t => { L.frame(t); });

  // the numbers: each row's time and cost (a branch adds up everything under it, split in its tooltip), the run's total and
  // clock in the header, and the selected row's split under the tree
  let t0 = performance.now(), ended = 0, sel = null;
  function paint(){
    for (const n of N){
      if (!here(n)) continue;
      // (the cost keeps its element, so its tooltip stays while it counts)
      const q = $(':scope>.atr-b .atr-q', n.el), ce = $('.atr-c', q), k = under(n), v = k.length ? sum(n) : n.cost;
      let se = $('.atr-sec', q);
      if (n.secs >= 1 && !se){ se = html('<span class="atr-sec"><span></span><span aria-hidden="true"> ·</span></span>'); q.prepend(se); } else if (n.secs < 1 && se){ se.remove(); se = null; }
      if (se && se.firstChild.textContent !== Math.floor(n.secs) + 's') se.firstChild.textContent = Math.floor(n.secs) + 's';
      const c$ = n.s === 'queued' && !v ? '' : money(v); if (ce.textContent !== c$) ce.textContent = c$;
      if (k.length) ce.dataset.tip = `Its own ${money(n.cost)}, ${k.length} ${n.lv ? (k.length === 1 ? 'step' : 'steps') : (k.length === 1 ? 'agent' : 'agents')} ${money(sum(n) - n.cost)}`;
      const label = `${n.n}, ${word[n.s]}, ${$(':scope>.atr-b .atr-sub', n.el).textContent}${v ? ', ' + money(v) : ''}`;
      if (n.el.getAttribute('aria-label') !== label) n.el.setAttribute('aria-label', label);
    }
    tot.textContent = money(sum(T));
    const run = N.filter(n => here(n) && n.lv && n.s === 'run').length, wait = N.some(n => here(n) && n.s === 'wait');
    const fail = N.filter(n => here(n) && n.s === 'fail' && !n.el.hasAttribute('data-dim')).length;
    const st = ended ? 'Done' : wait ? 'Needs you' : fail && !run ? `${fail} failed` : run ? `${run} running` : N.some(n => n.lv && n.s === 'done') ? 'Wrapping up' : 'Starting';
    if (meta.textContent !== st) meta.textContent = st;
    root.dataset.s = ended ? 'done' : wait ? 'wait' : fail && !run ? 'fail' : 'run';
    time.textContent = clock(((ended || performance.now()) - t0) / 1000);
    const x = sel || T, kx = under(x), own = kx.length ? ` · its own ${money(x.cost)} · ${kx.length} ${x.lv ? (kx.length === 1 ? 'step' : 'steps') : (kx.length === 1 ? 'agent' : 'agents')} ${money(sum(x) - x.cost)}` : ` · ${money(x.cost)}`;
    const f = `<b></b>${own} · ${toks(sumTok(x))} tokens`;
    if (foot._f !== f + x.n){ foot._f = f + x.n; foot.innerHTML = f; foot.firstChild.textContent = x.n; }
  }
  // what is running spends as it goes, and its time counts
  c.every(100, () => {
    if (ended) return; const now = performance.now();
    for (const n of N) if (here(n) && n.s === 'run'){ n.cost += n.lv ? .0014 : .0004; n.tok += n.lv ? 21 : 6; n.secs = (now - n.t0) / 1000; }
    paint();
  });

  // states: a mark swaps at once (the line engine draws its tick in), and a new line of text rises into place
  function set(n, s, t){
    if (s === 'run' && n.s !== 'run') n.t0 = performance.now() - n.secs * 1000;
    n.s = s; n.el.dataset.s = s;
    const m = n.lv ? s : s === 'fail' ? 'fail' : 'src', g = $(':scope>.atr-b .atr-g', n.el);
    if (g.dataset.m !== m){ g.dataset.m = m; g.innerHTML = atrMark(m); }
    if (t !== undefined) $(':scope>.atr-b .atr-sub', n.el).textContent = t;
    if (s !== 'wait' && s !== 'fail') ask(n, null);
    paint(); L.frame(performance.now());
  }
  const say = (n, t) => { $(':scope>.atr-b .atr-sub', n.el).textContent = t; paint(); };
  const until = async f => { while (!f()) await c.wait(50); };
  // a new row joins: its parent shows its chevron, and the line engine opens its space, draws its line and lets it rise in
  async function arrive(n, s, t){
    set(n, s, t); n.el.hidden = false; L.frame(performance.now()); if (s === 'run') n.t0 = performance.now();
    const p = n.parent; if (p && !p.el.hasAttribute('aria-expanded')){ p.el.setAttribute('aria-expanded', 'true'); p.tg.hidden = false; }
    paint(); await until(() => { const ph = L.phase(n.id); return ph === 'in' || ph === 'shown'; });
  }
  // the way on, in place under a row: a fix for a failed step, or Approve and Hold for one that needs a person
  function ask(n, how){
    const old = $(':scope>.atr-b>.atr-ask:not(.atr-gone)', n.el); if (old) atrDrop(old);
    if (!how) return;
    const box = html(`<div class="atr-ask">${how.map(([k, label]) => `<button type="button" class="pill sm ${k === 'yes' ? 'primary' : 'line'} atr-${k}">${label}</button>`).join('')}</div>`);
    $(':scope>.atr-b', n.el).appendChild(box);
    return box;
  }
  const tell = m => { sr.textContent = m; };

  // the keyboard: one row in the tab order; Up and Down move through the rows you can see (and select them), Right opens
  // a branch or moves into it, Left closes it or moves to its parent, Home and End jump to the ends. Enter or Space on a row
  // with a way on moves to its first button; Escape there comes back to the row
  const open = n => n.el.getAttribute('aria-expanded') !== 'false';
  const visible = () => N.filter(n => { if (!here(n) || ['open', 'opening', 'wait'].includes(L.phase(n.id))) return false; for (let p = n.parent; p; p = p.parent) if (!open(p)) return false; return true; })
    .sort((a, b) => a.el.compareDocumentPosition(b.el) & 4 ? -1 : 1);
  function pick(n, focus){
    sel = n; for (const x of N){ x.el.tabIndex = x === n ? 0 : -1; x.el.setAttribute('aria-selected', String(x === n)); }
    if (focus) n.el.focus({ preventScroll:true }); paint();
  }
  function fold(n, o){
    if (!under(n).length) return;
    n.el.setAttribute('aria-expanded', String(o)); n.fold.classList.toggle('shut', !o); n.fold.inert = !o;
    if (!o && n.fold.contains(document.activeElement)) pick(n, true);
  }
  c.on(tree, 'click', e => {
    const row = e.target.closest('.atr-n'); if (!row || e.target.closest('button')) return;
    const n = N.find(x => x.el === row);
    if (e.target.closest('.atr-tg')){ fold(n, !open(n)); return; }
    pick(n, true);
  });
  c.on(tree, 'keydown', e => {
    if (e.target.closest('button')){ if (e.key === 'Escape'){ const n = N.find(x => x.el === e.target.closest('.atr-n')); if (n){ e.preventDefault(); pick(n, true); } } return; }
    const v = visible(), i = v.findIndex(n => n.el === e.target); if (i < 0) return;
    const n = v[i], k = under(n).length; let go = null;
    if (e.key === 'ArrowDown') go = v[i + 1]; else if (e.key === 'ArrowUp') go = v[i - 1];
    else if (e.key === 'ArrowRight'){ if (k && !open(n)) fold(n, true); else if (k) go = under(n)[0]; }
    else if (e.key === 'ArrowLeft'){ if (k && open(n)) fold(n, false); else go = n.parent; }
    else if (e.key === 'Home') go = v[0]; else if (e.key === 'End') go = v[v.length - 1];
    else if (e.key === 'Enter' || e.key === ' '){ const b = $(':scope>.atr-b>.atr-ask button', n.el); if (b) b.focus(); else pick(n, true); }
    else return;
    e.preventDefault(); if (go) pick(go, true);
  });

  // the run: agents join one at a time and split their work; the research reads its pages while the design agent works
  // through its cards. One step fails on a token the library doesn't have, and the orchestrator reroutes it to a retry (a
  // person can take the fix first). The copy agent's post waits for a person: the story presses Approve, and without the
  // story the person in the demo does after a while, unless the visitor has taken over, who then approves it themselves
  c.run(async () => {
    await c.wait(300);
    await arrive(by('res'), 'run'); await arrive(by('des'), 'run'); await arrive(by('cop'), 'queued'); say(T, '3 agents at work');
    await arrive(by('res1'), 'run'); await arrive(by('des1'), 'run'); await arrive(by('des2'), 'queued');
    await c.wait(300); say(by('res1'), 'Reading 3 of 5');
    await c.wait(500); say(by('res1'), 'Reading 5 of 5');
    await c.wait(450); set(by('res1'), 'done', '5 pages, 12k words');
    await c.wait(350); set(by('res'), 'done', 'Notes in Pricing v4');
    await c.wait(350); set(by('des1'), 'done', 'Pro and Team done'); set(by('des2'), 'run', 'Matching colours');
    await c.wait(1100);
    const tk = by('des2'); set(tk, 'fail', 'Missing accent.600'); tell(`${tk.n} failed: Missing accent.600`);
    await new Promise(res => { $('.atr-fix', ask(tk, [['fix', 'Use accent.500']])).onclick = () => res(); c.later(1300, res); });
    ask(tk, null); tk.el.setAttribute('data-dim', ''); paint();
    await arrive(by('des3'), 'run', 'Rerouted to accent.500');
    await c.wait(1200); set(by('des3'), 'done', 'Used accent.500');
    await c.wait(300); set(by('des'), 'done', 'Cards and tokens done'); set(by('cop'), 'run', 'Writing 3 blurbs');
    await c.wait(1200); say(by('cop'), '3 blurbs written');
    const ps = by('cop1'); await arrive(ps, 'wait', 'Needs your OK');
    tell(`${ps.n} needs you`);
    await new Promise(res => {
      const box = ask(ps, [['yes', 'Approve'], ['no', 'Hold']]);
      $('.atr-yes', box).onclick = () => res();
      $('.atr-no', box).onclick = e => { say(ps, 'On hold'); e.currentTarget.remove(); $('.atr-yes', box).focus({ preventScroll:true }); };
      c.auto(2600, () => res());
    });
    set(ps, 'done', 'Posted to #pricing');
    await c.wait(350); set(by('cop'), 'done', '3 blurbs posted');
    await c.wait(300); set(T, 'done', 'Run finished'); ended = performance.now(); paint(); tell('Run finished');
  });
  // the preview's story: read how a branch's cost splits, then approve the post
  c.story(async s => {
    await s.until(() => here(by('des2')) && L.phase('des2') === 'shown'); await s.beat(2);
    await s.point($(':scope>.atr-b .atr-c', by('des').el)); await s.beat(3); s.away();
    await s.until(() => $('.atr-yes', r)); await s.beat(3);
    await s.tap($('.atr-yes', r)); s.away();
    await s.until(() => ended);
  });
  paint();
});
/* ---------- Agent tree designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and the others are the
   directions the owner chose. The switch is the card's alone: the registry, the code view and the component page install
   Classic, as it was (build.js leaves a data-designs="card" switch out of them) */
{
  const classic = DM.defs['agent-tree'];
  // the card has three designs, picked with the switch under the tree (on designme.dev, the card's footer tabs): Classic, the
  // tree; Cost tree, the same tree with each branch's share of the cost as a bar in the accent; and Cost map, every agent and
  // step as a block as wide as its cost. The two cost designs play Classic's run, with its agents, steps and marks: the
  // orchestrator splits the work between three agents, one design step fails on a token the library doesn't have and is
  // rerouted to a retry, and the copy agent's post waits for your OK. Every row is there from the start (the plan, in rings)
  // but the retry, which joins when the step fails. cost is what each spends itself, in dollars, and it grows while it
  // runs; a branch's cost is its own and everything under it
  const ATR_RUN = [
    { id:'root', n:'Orchestrator', t:'Splitting the work', ic:'spark', s:'run', cost:.004 },
    { id:'res', p:'root', n:'Research', t:'5 competitor pages', ic:'globe', av:'l', s:'run', cost:.003 },
    { id:'res1', p:'res', n:'Read the pages', t:'Reading 1 of 5', ic:'file-text', s:'run', cost:.006 },
    { id:'des', p:'root', n:'Design', t:'Plan cards in Figma', ic:'palette', av:'p', s:'run', cost:.003 },
    { id:'des1', p:'des', n:'Update cards', t:'Pricing v4', app:'figma', s:'run', cost:.005 },
    { id:'des2', p:'des', n:'Brand tokens', t:'Colours and spacing', app:'figma' },
    { id:'des3', p:'des', n:'Retry tokens', t:'Rerouted to accent.500', app:'figma', late:true },
    { id:'cop', p:'root', n:'Copy', t:'Rewrite the plan blurbs', ic:'edit', av:'m' },
    { id:'cop1', p:'cop', n:'Post to Slack', t:'Waits for your OK', app:'slack' }
  ];
  // the run, the same in both. on(event, node) tells the design what changed: 'state' (its state or its line of text),
  // 'join' (the retry), 'ask' (a fix for the failed step, or the post's OK), 'tick' (ten times a second) and 'end'
  function atrModel(c, on){
    const all = ATR_RUN.map(x => ({ cost:0, s:'queued', ...x, kids:[] })), by = id => all.find(n => n.id === id);
    all.forEach(n => { n.parent = n.p ? by(n.p) : null; n.lv = n.parent ? n.parent.lv + 1 : 0; if (n.parent) n.parent.kids.push(n); });
    const T = all[0];
    // each agent's step of the accent, for its bars (the orchestrator's is the first)
    T.kids.forEach((k, i) => { k.k = i + 1; }); all.forEach(n => { if (!n.k) n.k = n.lv > 1 ? n.parent.k : 1; });
    const sum = n => n.cost + n.kids.reduce((a, k) => a + sum(k), 0);
    const m = { T, all, by, sum, t0:0, ended:0, fix:null, ok:null };
    const set = (n, s, t) => { if (s) n.s = s; if (t !== undefined) n.t = t; on('state', n); };
    // whatever is running spends as it goes, ten times a second, and the clock counts
    c.every(100, () => { if (m.ended) return; m.t0 += .1; all.forEach(n => { if (n.s === 'run' && !n.late) n.cost += n.lv ? .0014 : .0004; }); on('tick'); });
    // a way on waits for you; the person in the demo takes it after a while, unless you have taken over
    const ask = (k, n, ms) => new Promise(res => { m[k] = () => { m[k] = null; res(); }; on('ask', n, k); c.auto(ms, () => m[k] && m[k]()); });
    c.run(async () => {
      await c.wait(700); set(by('res1'), null, 'Reading 3 of 5');
      await c.wait(700); set(by('res1'), null, 'Reading 5 of 5');
      await c.wait(600); set(by('res1'), 'done', '5 pages, 12k words'); set(T, null, '3 agents at work');
      await c.wait(350); set(by('res'), 'done', 'Notes in Pricing v4');
      await c.wait(500); set(by('des1'), 'done', 'Pro and Team done'); set(by('des2'), 'run', 'Matching colours');
      await c.wait(1400); const tk = by('des2'); set(tk, 'fail', 'Missing accent.600');
      await ask('fix', tk, 3200);
      tk.dim = true; const rt = by('des3'); rt.late = false; rt.s = 'run'; on('join', rt); set(tk);
      await c.wait(1500); set(rt, 'done', 'Used accent.500');
      await c.wait(300); set(by('des'), 'done', 'Cards and tokens done'); set(by('cop'), 'run', 'Writing 3 blurbs');
      await c.wait(1500); set(by('cop'), null, '3 blurbs written'); const ps = by('cop1'); set(ps, 'wait', 'Needs your OK');
      await ask('ok', ps, 3200);
      set(ps, 'done', 'Posted to #pricing');
      await c.wait(350); set(by('cop'), 'done', '3 blurbs posted');
      await c.wait(300); set(T, 'done', 'Run finished'); m.ended = m.t0; on('end');
    });
    return m;
  }
  const atrMoney = v => '$' + v.toFixed(2);
  const atrClock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  // who: an agent's avatar in its colour, the orchestrator's in ink, or the app a step works in (as in Classic)
  const atrWho = n => n.app ? `<span class="atr-av app" aria-hidden="true">${BRAND[n.app]}</span>` : `<span class="atr-av${n.av || !n.lv ? '' : ' app'}" aria-hidden="true"${n.av ? ` style="--a:var(--av-${n.av});--ai:var(--av-${n.av}-ink)"` : ''}>${I(n.ic, 'xs')}</span>`;
  // a node's mark: the source disc for the orchestrator while it runs, else its state
  const atrM = n => n.lv ? n.s : n.s === 'run' ? 'src' : n.s;
  const atrG = m => `<span class="atr-g" data-m="${m}" aria-hidden="true">${atrMark(m)}</span>`;
  const atrWord = { queued:'queued', run:'running', wait:'needs you', done:'done', fail:'failed' };
  // the run's header, as in Classic: its title, a dot and a word for how it is doing, the clock and the total
  const ATR_HEAD = t => `<div class="atr-h"><div class="atr-hd">${t}<span class="atr-s"><span class="atr-dot" aria-hidden="true"></span><span class="atr-m">Starting</span><span aria-hidden="true">·</span><span class="atr-time num">0:00</span></span></div><span class="atr-tot num">$0.00</span></div>`;
  function atrHead(r, M){
    const meta = $('.atr-m', r), time = $('.atr-time', r), root = $('.atr', r);
    return () => {
      const live = M.all.filter(n => !n.late), run = live.filter(n => n.lv && n.s === 'run').length, wait = live.some(n => n.s === 'wait');
      const fail = live.filter(n => n.s === 'fail' && !n.dim).length;
      const st = M.ended ? 'Done' : wait ? 'Needs you' : fail && !run ? `${fail} failed` : run ? `${run} running` : 'Starting';
      if (meta.textContent !== st) meta.textContent = st;
      root.dataset.s = M.ended ? 'done' : wait ? 'wait' : fail && !run ? 'fail' : 'run';
      $('.atr-tot', r).textContent = atrMoney(M.sum(M.T)); time.textContent = atrClock(M.ended || M.t0);
    };
  }

  // Cost tree: Classic's tree, its lines and its band, with each row's share of the whole run as a bar after its cost, and
  // the run's cost by agent as one bar under the header
  const ATR_COST = `<div class="atr atr-ct panel" data-s="run">
    ${ATR_HEAD('<b class="atr-t">Redesign the pricing page</b>')}
    <div class="atr-ct-mix" aria-hidden="true"></div>
    <div class="atr-tree" role="tree" aria-label="Agents"><svg class="atr-ln" aria-hidden="true"></svg></div>
    <p class="atr-sr" role="status"></p>
  </div>`;
  function atrCost(r, c){
    const tree = $('.atr-tree', r), mix = $('.atr-ct-mix', r), box = $('.atr', r), sr = $('.atr-sr', r);
    let M, L, head;
    const here = n => !n.late, under = n => n.kids.filter(here);
    function build(n){
      n.el = html(`<div class="atr-n" role="treeitem" aria-level="${n.lv + 1}" aria-selected="false" tabindex="${n.lv ? -1 : 0}" data-id="${n.id}" data-s="${n.s}" style="--lv:${n.lv};--k:var(--k${n.k})"><div class="atr-b"><div class="atr-r">${atrG(atrM(n))}${atrWho(n)}<span class="atr-tx"><span class="atr-nm"></span>${n.kids.length ? `<span class="atr-tg" aria-hidden="true">${I('chev-d', 'xs')}</span>` : ''}<span class="atr-sub"></span></span><span class="atr-q num"><span class="atr-c"></span><i class="atr-ct-bar" aria-hidden="true"><span></span></i></span></div></div></div>`);
      $('.atr-nm', n.el).textContent = n.n; $('.atr-sub', n.el).textContent = n.t;
      if (n.kids.length){ n.el.setAttribute('aria-expanded', 'true'); n.fold = html('<div class="fold atr-kids"><div role="group"></div></div>'); n.kids.forEach(k => n.fold.firstElementChild.appendChild(build(k))); n.el.appendChild(n.fold); }
      if (n.late) n.el.hidden = true;
      return n.el;
    }
    function paint(){
      const total = M.sum(M.T);
      for (const n of M.all){
        if (!here(n)) continue;
        const v = under(n).length ? M.sum(n) : n.cost, ce = $(':scope>.atr-b .atr-c', n.el), t = n.s === 'queued' && !v ? '' : atrMoney(v);
        if (ce.textContent !== t) ce.textContent = t;
        $(':scope>.atr-b .atr-ct-bar', n.el).style.setProperty('--sh', total ? (v / total).toFixed(3) : 0);
        if (under(n).length) ce.dataset.tip = `Its own ${atrMoney(n.cost)}, the rest ${atrMoney(M.sum(n) - n.cost)}`;
        const label = `${n.n}, ${atrWord[n.s]}, ${n.t}${v ? ', ' + atrMoney(v) : ''}`;
        if (n.el.getAttribute('aria-label') !== label) n.el.setAttribute('aria-label', label);
      }
      let at = 0; M.T.kids.forEach((k, i) => { const w = total ? M.sum(k) / total * 100 : 0; mix.children[i].style.setProperty('--x0', at.toFixed(2)); mix.children[i].style.setProperty('--x1', (at + w).toFixed(2)); at += w; });
      head();
    }
    // the way on, in place under a row: the fix for the failed step, or Approve and Hold for the post
    function ask(n, how){
      const old = $(':scope>.atr-b>.atr-ask:not(.atr-gone)', n.el); if (old) atrDrop(old);
      if (!how) return null;
      const b = html(`<div class="atr-ask">${how.map(([k, label]) => `<button type="button" class="pill sm ${k === 'yes' || k === 'fix' ? 'primary' : 'line'} atr-${k}">${label}</button>`).join('')}</div>`);
      $(':scope>.atr-b', n.el).appendChild(b); return b;
    }
    M = atrModel(c, (ev, n, k) => {
      if (ev === 'state'){
        n.el.dataset.s = n.s; const g = $(':scope>.atr-b .atr-g', n.el), m = atrM(n);
        if (g.dataset.m !== m){ g.dataset.m = m; g.innerHTML = atrMark(m); }
        $(':scope>.atr-b .atr-sub', n.el).textContent = n.t;
        if (n.dim) n.el.setAttribute('data-dim', '');
        if (n.s !== 'wait' && n.s !== 'fail') ask(n, null);
        if (n.dim) ask(n, null);
        if (n.s === 'fail') sr.textContent = `${n.n} failed: ${n.t}`;
      }
      if (ev === 'join'){ n.el.dataset.s = n.s; const g = $(':scope>.atr-b .atr-g', n.el); g.dataset.m = n.s; g.innerHTML = atrMark(n.s); n.el.hidden = false; }
      if (ev === 'ask'){
        if (k === 'fix') $('.atr-fix', ask(n, [['fix', 'Use accent.500']])).onclick = () => M.fix && M.fix();
        else { const b = ask(n, [['yes', 'Approve'], ['no', 'Hold']]); sr.textContent = `${n.n} needs you`;
          $('.atr-yes', b).onclick = () => M.ok && M.ok();
          $('.atr-no', b).onclick = e => { n.t = 'On hold'; $(':scope>.atr-b .atr-sub', n.el).textContent = n.t; e.currentTarget.remove(); $('.atr-yes', b).focus({ preventScroll:true }); }; }
      }
      // done: one line under the tree with the done mark
      if (ev === 'end'){ sr.textContent = 'Run finished'; const sm = html(`<p class="atr-ct-sum"${REDUCE ? '' : ' data-in'}>${atrG('done')}<span>Done in <b class="num">${atrClock(M.ended)}</b> · 3 agents · <b class="num">${atrMoney(M.sum(M.T))}</b></span></p>`); box.insertBefore(sm, sr); }
      if (L && ev !== 'tick') L.frame(performance.now());
      if (head) paint();
    });
    mix.innerHTML = M.T.kids.map(k => `<i style="--k:var(--k${k.k})"></i>`).join('');
    tree.appendChild(build(M.T));
    head = atrHead(r, M); paint();
    L = atrLines(tree); c.loop(t => { L.frame(t); });
    // the keyboard and the pointer, as in Classic: one row in the tab order, the arrows move through the rows you can see,
    // Right and Left open and close a branch, and the chevron folds one
    const open = n => n.el.getAttribute('aria-expanded') !== 'false';
    const visible = () => M.all.filter(n => { if (!here(n)) return false; for (let p = n.parent; p; p = p.parent) if (!open(p)) return false; return true; });
    const pick = n => { M.all.forEach(x => { x.el.tabIndex = x === n ? 0 : -1; x.el.setAttribute('aria-selected', String(x === n)); }); n.el.focus({ preventScroll:true }); };
    const fold = (n, o) => { if (!under(n).length) return; n.el.setAttribute('aria-expanded', String(o)); n.fold.classList.toggle('shut', !o); n.fold.inert = !o; if (!o && n.fold.contains(document.activeElement)) pick(n); };
    c.on(tree, 'click', e => { const row = e.target.closest('.atr-n'); if (!row || e.target.closest('button')) return; const n = M.all.find(x => x.el === row); if (e.target.closest('.atr-tg')) fold(n, !open(n)); else pick(n); });
    c.on(tree, 'keydown', e => {
      if (e.target.closest('button')) return;
      const v = visible(), i = v.findIndex(n => n.el === e.target); if (i < 0) return;
      const n = v[i], k = under(n).length; let go = null;
      if (e.key === 'ArrowDown') go = v[i + 1]; else if (e.key === 'ArrowUp') go = v[i - 1];
      else if (e.key === 'ArrowRight'){ if (k && !open(n)) fold(n, true); else if (k) go = under(n)[0]; }
      else if (e.key === 'ArrowLeft'){ if (k && open(n)) fold(n, false); else go = n.parent; }
      else if (e.key === 'Home') go = v[0]; else if (e.key === 'End') go = v[v.length - 1];
      else if (e.key === 'Enter' || e.key === ' '){ const b = $(':scope>.atr-b>.atr-ask button', n.el); if (b) b.focus(); else pick(n); }
      else return;
      e.preventDefault(); if (go) pick(go);
    });
    // the person in the demo: reads how the design branch's cost splits, takes the fix, then approves the post
    c.story(async s => {
      await s.beat(3); await s.point($(':scope>.atr-b .atr-c', M.by('des').el)); await s.beat(3); s.away();
      await s.until(() => $('.atr-fix', r)); await s.beat(3); await s.tap($('.atr-fix', r)); s.away();
      await s.until(() => $('.atr-yes', r)); await s.beat(3); await s.tap($('.atr-yes', r)); s.away();
      await s.until(() => M.ended); await s.beat(5);
    });
    // it grows with its rows, as Classic does (owner, 17 Nov): no room kept for its tallest moment
    c.offs.push(grow(box));
  }

  // Cost map: every agent and step as a block as wide as its cost, growing live, tinted by how it is doing and carrying its
  // mark; press a block to zoom into it
  const ATR_MAP = `<div class="atr atr-cm panel" data-s="run">
    ${ATR_HEAD('<nav class="atr-cm-crumb atr-t" aria-label="Where you are"></nav>')}
    <div class="atr-cm-map" role="group" aria-label="Cost by agent and step"></div>
    <ul class="atr-cm-lg" aria-label="What the marks mean"><li>${atrG('done')}Done</li><li>${atrG('run')}Running</li><li>${atrG('fail')}Failed</li><li>${atrG('queued')}Queued</li><li><i class="own" aria-hidden="true"></i>Its own work</li></ul>
    <div class="atr-cm-say" aria-live="polite"></div>
    <ul class="atr-cm-key" aria-label="Agents"></ul>
  </div>`;
  function atrMap(r, c){
    const map = $('.atr-cm-map', r), crumb = $('.atr-cm-crumb', r), say = $('.atr-cm-say', r), key = $('.atr-cm-key', r);
    let M, top, W = 0, shown = '', head;
    // each block's place and width, as shares of the branch on show; blocks outside it fade. The branch fills the first row,
    // its children the second and theirs the third, and each branch's own work (what it spends besides its children) closes
    // its row, hatched, so every row adds up
    function lay(){
      const base = top, total = Math.max(1e-6, M.sum(base)), gap = 4, pos = new Map(), own = new Map();
      pos.set(base, { x:0, w:1, lv:0 });
      let x = 0; base.kids.forEach(k => { const w = M.sum(k) / total; pos.set(k, { x, w, lv:1 }); let y = x; k.kids.forEach(g => { const gw = M.sum(k) ? g.cost / M.sum(k) * w : 0; pos.set(g, { x:y, w:gw, lv:2 }); y += gw; }); if (k.kids.length) own.set(k, { x:y, w:M.sum(k) ? k.cost / M.sum(k) * w : 0, lv:2 }); x += w; });
      own.set(base, { x, w:base.cost / total, lv:1 });
      M.all.forEach(n => { if (!n.ob) return; const p = own.get(n); if (!p || p.w * W < 3){ n.ob.classList.add('gone'); return; } n.ob.classList.remove('gone'); n.ob.style.setProperty('--lv', p.lv); n.ob.style.setProperty('--x', (p.x * W).toFixed(1) + 'px'); n.ob.style.setProperty('--w', Math.max(0, p.w * W - gap).toFixed(1) + 'px'); n.ob.dataset.tip = `${n.lv ? n.n : 'The orchestrator'}'s own work, ${atrMoney(n.cost)}`; });
      M.all.forEach(n => {
        const p = pos.get(n), el = n.b; if (!el) return;
        if (!p || p.w * W < 3){ el.classList.add('gone'); el.tabIndex = -1; return; }
        el.classList.remove('gone'); el.tabIndex = 0;
        const px = p.x * W, pw = Math.max(0, p.w * W - (p.lv ? gap : 0));
        el.style.setProperty('--lv', p.lv); el.style.setProperty('--x', px.toFixed(1) + 'px'); el.style.setProperty('--w', pw.toFixed(1) + 'px');
        // a block too narrow for its words keeps its tint and mark, or only its tint, and says them in its tooltip
        const l = $('.atr-cm-l', el), fit = pw > 72 ? 'all' : pw > 28 ? 'mark' : 'none'; if (l.dataset.fit !== fit) l.dataset.fit = fit;
      });
    }
    const ro = new ResizeObserver(() => { W = map.clientWidth; lay(); }); ro.observe(map); c.offs.push(() => ro.disconnect());
    function crumbs(){
      const path = []; for (let p = top; p; p = p.parent) path.unshift(p);
      crumb.innerHTML = path.map((p, i) => i === path.length - 1 ? `<b>${p.lv ? p.n : 'Redesign the pricing page'}</b>` : `<button type="button" data-id="${p.id}">${p.lv ? p.n : 'Pricing page'}</button>${I('chev-r','xs')}`).join('');
      $$('button', crumb).forEach(b => b.onclick = () => go(M.by(b.dataset.id)));
    }
    function go(n){ if (!n || !n.kids.length) return; top = n; crumbs(); lay(); if (document.activeElement && map.contains(document.activeElement)) n.b.focus({ preventScroll:true }); }
    function tell(n){ if (!n){ say.innerHTML = shown; return; } const v = M.sum(n), share = v / Math.max(1e-6, M.sum(M.T)) * 100; say.innerHTML = `<b>${n.n}</b> · ${atrMoney(v)}, ${share.toFixed(0)}% of the run${n.kids.length ? ` · its own ${atrMoney(n.cost)}` : ''}${n.lv ? ' · ' + atrWord[n.s] : ''}`; }
    function blocks(){
      M.all.forEach(n => {
        n.b = html(`<button class="atr-cm-b${n.lv ? '' : ' lv0'}" type="button" data-s="${n.s}" aria-label="${n.n}"><span class="bg"></span><span class="atr-cm-l">${atrG(atrM(n))}<b>${n.lv ? n.n : 'Whole run'}</b><span class="v">–</span></span></button>`);
        n.b.dataset.tip = n.n; map.appendChild(n.b);
        if (n.kids.length){ n.ob = html('<span class="atr-cm-b own" aria-hidden="true"><span class="bg"></span></span>'); map.appendChild(n.ob); }
        n.b.onclick = () => { if (n === top && n.parent) go(n.parent); else if (n.kids.length && n !== top) go(n); else tell(n); };
        ['pointerenter', 'focus'].forEach(ev => n.b.addEventListener(ev, () => tell(n)));
        ['pointerleave', 'blur'].forEach(ev => n.b.addEventListener(ev, () => tell(null)));
      });
    }
    c.on(map, 'keydown', e => { if (e.key === 'Escape' && top.parent){ e.preventDefault(); go(top.parent); } });
    // the agents under the map: each one's mark and avatar, as in the tree, its share and its cost
    function legend(){
      key.innerHTML = M.T.kids.map(k => `<li>${atrG(k.s)}${atrWho(k)}<span class="t">${k.n}</span><span class="p num"></span><span class="c num"></span></li>`).join('');
      M.T.kids.forEach((k, i) => { k.li = key.children[i]; });
    }
    let k10 = 0;
    function paint(full){
      const total = M.sum(M.T);
      M.all.forEach(n => { const v = $('.v', n.b), t = n.s === 'queued' && !M.sum(n) ? 'Queued' : atrMoney(M.sum(n)); if (v.textContent !== t) v.textContent = t; });
      M.T.kids.forEach(k => { const p = Math.round(M.sum(k) / total * 100) + '%', cc = atrMoney(M.sum(k)); if ($('.p', k.li).textContent !== p) $('.p', k.li).textContent = p; if ($('.c', k.li).textContent !== cc) $('.c', k.li).textContent = cc; });
      // the blocks are laid out again twice a second, and glide to their new widths
      if (full || ++k10 % 5 === 0) lay();
      if (head) head();
    }
    const mark = (g, m) => { if (g.dataset.m !== m){ g.dataset.m = m; g.innerHTML = atrMark(m); if (!REDUCE && (m === 'done' || m === 'fail')){ g.removeAttribute('data-drw'); void g.offsetWidth; g.setAttribute('data-drw', ''); } } };
    // the way on for an agent, in its row: Fix for its failed step, Approve for the post
    function way(k, label, tip, run){ const b = html(`<button class="pill sm primary atr-x-fix" type="button">${label}</button>`); b.dataset.tip = tip; $('.c', k.li).after(b); b.onclick = () => { b.remove(); run(); }; }
    M = atrModel(c, (ev, n, k) => {
      if (ev === 'state' || ev === 'join'){ n.b.dataset.s = n.s; mark($('.atr-g', n.b), atrM(n)); if (n.lv === 1) mark($('.atr-g', n.li), n.s); }
      if (ev === 'ask' && k === 'fix'){ way(n.parent, 'Fix', 'Use accent.500', () => M.fix && M.fix()); shown = `<b>${n.n}</b> failed: accent.600 is not in the library`; tell(null); }
      if (ev === 'ask' && k === 'ok'){ way(n.parent, 'Approve', 'Post the blurbs to #pricing', () => M.ok && M.ok()); shown = `<b>${n.n}</b> needs your OK`; tell(null); }
      // a way on the demo took goes, and so does what it said
      if (ev === 'state' && n.lv === 2 && (n.dim || n.s === 'done')){ const b = $('.atr-x-fix', n.parent.li); if (b) b.remove(); shown = ''; tell(null); }
      if (ev === 'end'){ shown = `Done: ${atrMoney(M.sum(M.T))} across 3 agents, most of it on design`; tell(null); }
      paint(ev !== 'tick');
    });
    top = M.T; blocks(); legend(); crumbs(); head = atrHead(r, M); paint(true);
    // the person in the demo: reads the design agent's block, takes the fix, zooms into the design agent and back out, then
    // approves the post
    c.story(async s => {
      await s.beat(4); await s.point(M.by('des').b); tell(M.by('des')); await s.beat(3); s.away(); tell(null);
      await s.until(() => $('.atr-x-fix', key)); await s.beat(3);
      await s.tap($('.atr-x-fix', key)); s.away(); await s.beat(2);
      await s.tap(M.by('des').b); s.away(); await s.beat(4);
      await s.tap($('button', crumb)); s.away();
      await s.until(() => $('.atr-x-fix', key)); await s.beat(3); await s.tap($('.atr-x-fix', key)); s.away();
      await s.until(() => M.ended); await s.beat(4);
    });
  }

  // the switch: the design the card last showed (Classic to begin with) is drawn, and picking another mounts the card again
  // with it, so it plays from the start, entrance and demo; a key that picked it keeps the focus on the switch. Inside another
  // component (as in Agent harness), and in the registry, the code view and the component page (build.js leaves a
  // data-designs="card" switch out of them), it is the classic tree on its own
  const ATR_DS = { cost:[ATR_COST, atrCost], map:[ATR_MAP, atrMap] };
  DM.def('agent-tree', (r, c, card) => {
    let dm = $(':scope>.atr-dm', r);
    if (!dm) return classic(r, c, card);
    if (!c.card || r !== c.st){ dm.replaceWith(...$(':scope>.dm-main', dm).childNodes); return classic(r, c, card); }
    const v = ATR_DS[card._dv] ? card._dv : 'classic';
    if (v === 'classic') classic(r, c, card);
    // (the classic component may have drawn its icons into the stage again, so the switch is found afresh)
    dm = $(':scope>.atr-dm', r);
    const main = $(':scope>.dm-main', dm), sg = $(':scope>.demo .seg2', dm);
    // the card keeps the room the tallest design needs, and the design picked sits in the middle of it, growing with its
    // content from there (CSS: the switch's main part is centred in the room)
    if (v !== 'classic'){ main.innerHTML = ATR_DS[v][0]; ATR_DS[v][1](main, c); }
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    seg(sg, k => {
      if (k === v) return;
      const kb = sg.contains(document.activeElement) && document.activeElement.matches(":focus-visible");
      card._dv = k; DM.mount(card);
      // it comes back once the new design has started, so it isn't taken for the visitor taking over the new demo
      if (kb) setTimeout(() => { const b = $(`.atr-dm>.demo button[data-v="${k}"]`, card); if (b && (!document.activeElement || document.activeElement === document.body)) b.focus({ preventScroll:true }); }, 120);
    });
  });
}
/* ---------- Agent inbox ---------- */
DM.def('agent-inbox', (r, c) => {
  // the runs, grouped by what they need: one waits for approval, one failed and can be retried, two are running with their
  // clocks, two are done
  const A = { 'Design agent':['D','var(--av-l)'], 'Build agent':['B','var(--av-m)'], 'Research agent':['R','var(--av-t)'], 'Copy agent':['C','var(--av-p)'], 'QA agent':['Q','var(--av-b)'] };
  const R = [
    { id:'pub', t:'Publish the pricing page', a:'Design agent', g:'needs', why:'Waiting for your approval' },
    { id:'tok', t:'Export tokens to CSS', a:'Build agent', g:'needs', fail:true, why:'Failed: rate limited by Figma', tip:'Figma answered 429 at 10:42. Safe to retry' },
    { id:'cards', t:'Rework the plan cards', a:'Design agent', g:'run', sec:102, doing:'Editing frame 3 of 6' },
    { id:'cmp', t:'Compare 3 competitor pages', a:'Research agent', g:'run', sec:38, doing:'Reading page 3 of 3' },
    { id:'copy', t:'Rewrite plan descriptions', a:'Copy agent', g:'done', ago:'12m ago' },
    { id:'aud', t:'Audit pricing contrast', a:'QA agent', g:'done', ago:'25m ago' }
  ];
  const GR = [['needs', 'Needs you'], ['run', 'Running'], ['done', 'Done']];
  const gs = $('.aib-gs', r);
  // the panel fits its rows at every moment (owner, 18 Nov: no room kept for a group that has gone): as a group goes or
  // comes back, its height eases with grow(), and it stays centred in its stage
  const ib = r.classList.contains('aib') ? r : $('.aib', r);
  // the head has a neutral mark in a tile, the column the agents' marks sit in (owner, 18 Nov)
  if (ib) $('.aib-h', ib).prepend(html(`<span class="aib-hi" aria-hidden="true">${I('mail')}</span>`));
  if (ib) c.offs.push(grow(ib));
  gs.innerHTML = GR.map(([k, n]) => `<section class="aib-g" data-g="${k}" aria-label="${n}"><div class="aib-gh"><span>${n}</span><span class="n"></span></div><div class="aib-gl" role="list"></div></section>`).join('');
  const clock = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const meta = x => x.g === 'needs' ? x.why : x.g === 'run' ? x.doing : x.a;
  const right = x => x.g === 'needs' ? (x.fail ? `<button class="pill sm aib-go" aria-label="Retry ${x.t}">${I('refresh','xs')}Retry</button>` : `<button class="pill primary sm aib-go" aria-label="Approve ${x.t}">Approve</button>`)
    : x.g === 'run' ? `<span class="spin"></span><span class="num aib-ck">${clock(x.sec)}</span>` : `<span class="ok">${I('ok','xs')}</span><span>${x.ago}</span>`;
  function row(x){
    const [m, col] = A[x.a];
    x.el = html(`<div class="aib-i" role="listitem"><span class="aib-av" style="background:${col};color:${col.replace(')', '-ink)')}" aria-hidden="true">${m}</span><span class="aib-t"><b>${x.t}</b><span></span></span><span class="aib-r"></span></div>`);
    update(x, true); return x.el;
  }
  function update(x, now){
    const el = x.el, sp = $('.aib-t span', el), rr = $('.aib-r', el);
    el.classList.toggle('fail', !!x.fail && x.g === 'needs');
    if (x.tip && x.g === 'needs') sp.dataset.tip = x.tip; else delete sp.dataset.tip;
    if (now){ sp.textContent = meta(x); rr.innerHTML = right(x); } else { swap(sp, meta(x)); rr.innerHTML = right(x); enter(rr); }
    const b = $('.aib-go', el); if (b) b.onclick = () => act(x);
  }
  const list = g => $(`.aib-g[data-g="${g}"] .aib-gl`, gs);
  R.forEach(x => list(x.g).appendChild(row(x)));
  function counts(){
    // each group shows its count, and a group with nothing in it goes away
    GR.forEach(([k]) => { const n = R.filter(x => x.g === k).length, sec = $(`.aib-g[data-g="${k}"]`, gs); $('.n', sec).textContent = n; sec.hidden = !n; });
  }
  counts();
  // a run that moves glides to its place in the new group: rows and group titles are measured before and after, and eased
  // from where they were; the moving row rides above the rest, and a group that comes back fades in
  const ease = getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease';
  const shown = () => $$('.aib-g:not([hidden]) .aib-gh,.aib-g:not([hidden]) .aib-i', gs);
  function move(x, g){
    const first = new Map(shown().map(e => [e, e.getBoundingClientRect().top]));
    x.g = g; update(x); list(g).prepend(x.el); counts();
    if (REDUCE) return;
    x.el.classList.add('mv'); c.later(440, () => x.el.classList.remove('mv'));
    shown().forEach(e => { if (!first.has(e)) return enter(e); const d = first.get(e) - e.getBoundingClientRect().top; if (Math.abs(d) > 1) e.animate([{ transform:`translateY(${d}px)` }, { transform:'none' }], { duration:420, easing:ease }); });
  }
  // every running run's clock ticks
  c.every(1000, () => R.forEach(x => { if (x.g === 'run'){ x.sec++; const ck = $('.aib-ck', x.el); if (ck) ck.textContent = clock(x.sec); } }));
  // Approve starts the run and Retry tries a failed one again; either runs, then lands in Done
  function act(x){
    const retry = !!x.fail; x.fail = false; x.sec = 0; x.doing = retry ? 'Retrying the export' : 'Publishing to designme.studio/pricing';
    move(x, 'run');
    c.later(retry ? 5000 : 4000, () => { x.ago = 'Just now'; move(x, 'done'); });
  }
  // the research run finishes on its own while you look
  c.later(6000, () => { const x = R.find(y => y.id === 'cmp'); if (x.g === 'run'){ x.ago = 'Just now'; move(x, 'done'); } });
  // the preview's story: read why the export failed, approve the publish, and retry the export
  c.story(async s => {
    const by = id => R.find(x => x.id === id);
    await s.beat(3);
    await s.point($('.aib-t span', by('tok').el)); await s.beat(3);
    await s.tap($('.aib-go', by('pub').el)); s.away(); await s.beat(5);
    await s.tap($('.aib-go', by('tok').el)); s.away();
    await s.until(() => by('tok').g === 'done' && by('pub').g === 'done'); await s.beat(3);
  });
});
/* ---------- Trace view ---------- */
DM.def('trace-view', (r, c) => {
  // the kinds of span, each with its mark and colour: the identity slots of the chart palette, and grey for the agents
  // that hold the other spans. The name is always on the mark, in a tooltip, and in the span's label
  const K = { agent:['Agent','cpu','var(--muted)'], llm:['LLM call','spark','var(--c2)'], tool:['Tool call','term','var(--c6)'], ret:['Retrieval','search','var(--c3)'] };
  // one run, in seconds from its start. The run itself is the head (its name, its total tokens and time), so its spans start
  // at the top level (owner, 18 Nov: no row repeating the run's name). A tool call that takes longer than SLOW seconds is flagged
  const SPAN = 5, SLOW = 2, PACE = 1.5;
  const S = [
    { id:'plan', k:'llm', n:'Plan the steps', s:.04, d:.62, tk:1240, lv:0, in:'The task and 2 earlier messages', out:'Search notes, fetch the page, summarise' },
    { id:'notes', k:'ret', n:'Search saved notes', s:.7, d:.38, tk:910, lv:0, in:'"northwind pricing", top 4', out:'4 notes, best match 0.82' },
    { id:'fetch', k:'tool', n:'fetch_page', s:1.12, d:2.46, tk:3120, lv:0, in:'GET northwind.app/pricing', out:'200 OK, 48 KB, 3 plans' },
    { id:'sum', k:'agent', n:'Summariser', s:3.62, d:1.02, lv:0, in:'The page and 4 notes', out:'A 120-word summary' },
    { id:'write', k:'llm', n:'Write the summary', s:3.66, d:.94, tk:2380, lv:1, in:'Page text and notes, 2,050 tokens', out:'120 words, 3 prices' },
    { id:'ans', k:'llm', n:'Final answer', s:4.66, d:.16, tk:560, lv:0, in:'The summary', out:'3 prices saved to Pricing research' }
  ];
  const END = Math.max(...S.map(x => x.s + x.d));
  // an agent span counts the tokens of every span under it
  S.forEach((x, i) => { x.kids = []; for (let j = i + 1; j < S.length && S[j].lv > x.lv; j++) x.kids.push(S[j]); });
  const root = $('.trv', r), rows = $('.trv-rows', r), stEl = $('.trv-st', r), tot = $('.trv-tot', r), dt = $('.trv-dt', r), dc = $('.trv-dc', r), lg = $('.trv-lg', r);
  // the head has the run's mark in a tile, the column every span's mark is centred in, and its total tokens beside its time
  const head = $('.trv-h', r);
  head.prepend(html(`<span class="trv-hi" aria-hidden="true">${I('cpu')}</span>`));
  const ttEl = html('<span class="trv-tt muted num"></span>'); tot.before(ttEl);
  // the card keeps no room for spans still to come (owner, 18 Nov): it grows as each span starts and as the details open
  // (grow(), centred in its stage), once its entrance (which scales it) has ended, so it measures the card at its real size
  Promise.resolve().then(() => Promise.all(root.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && root.isConnected) c.offs.push(grow(root)); });
  // the key: every kind but the agents, with its colour and how many of its spans have started
  const KEYS = ['llm', 'tool', 'ret'];
  lg.innerHTML = KEYS.map(k => `<span role="listitem" class="z" data-k="${k}" style="--k:${K[k][2]}"><i></i>${K[k][0]} <b class="num">0</b></span>`).join('');
  // each span's parent, for the tree's guides
  S.forEach((x, i) => { for (let j = i - 1; j >= 0; j--) if (S[j].lv === x.lv - 1){ x.up = S[j]; break; } });
  $('.trv-sc', r).innerHTML = Array.from({ length:Math.ceil(SPAN / 2) }, (_, i) => `<span style="left:${i * 2 / SPAN * 100}%">${i * 2}s</span>`).join('');
  const sec = v => v.toFixed(2) + 's', tks = v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v));
  let T = 0, sel = null, said = '';
  S.forEach(x => {
    const [kind, icon, col] = K[x.k];
    x.el = html(`<button type="button" class="trv-r" data-k="${x.k}" aria-expanded="false" style="--k:${col};--lv:${x.lv}" hidden><span class="trv-n"><span class="trv-g" aria-hidden="true"></span><span class="trv-k" data-tip="${kind}">${I(icon,'xs')}</span><span class="trv-nm">${x.n}</span></span><span class="trv-b"><i style="left:${x.s / SPAN * 100}%;width:${x.d / SPAN * 100}%"></i></span><span class="trv-tk num"></span><span class="trv-ms num"></span></button>`);
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
      for (let a = x.up; a && a.up; a = a.up) if (later(a)) h += `<i style="--x:${a.lv - 1}"></i>`;
      if (x.up) h += `<i class="el${later(x) ? '' : ' end'}" style="--x:${x.lv - 1}"></i>`;
      if (S.some(y => y.up === x && vis(y))) h += `<i class="dn" style="--x:${x.lv}"></i>`;
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
      const f = x.d ? w / x.d : 1; if (f !== x._f){ x._f = f; $('.trv-b i', x.el).style.setProperty('--f', f.toFixed(4)); }
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
    root.style.setProperty('--now', Math.min(T, END) / SPAN); root.classList.toggle('live', T > 0 && T < END);
    if (txt){ tot.textContent = sec(Math.min(T, END)); ttEl.textContent = tks(S.reduce((n, x) => n + (x.k === 'agent' ? 0 : used(x)), 0)) + ' tokens'; }
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
    dc.innerHTML = `<div class="trv-dh"><span class="trv-k" style="--k:${col}">${I(icon,'xs')}</span><b>${x.n}</b>${x.slow ? '<span class="tag warn">slow</span>' : ''}<button class="ib trv-x" aria-label="Close details" data-tip="Close">${I('x')}</button></div>
      <div class="trv-pos" aria-hidden="true" style="--k:${col}"><i style="left:${x.s / SPAN * 100}%"></i></div>
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
/* ---------- Run cost ---------- */
DM.def('run-cost', (r, c) => {
  // the label crossfades on its own span, so the button itself never blurs
  const go = $('.rc-go', r); go.innerHTML = '<span class="rc-gl">Start run</span>'; const gl = () => $('.rc-gl', go);
  const tg = $('.toggle', r), cap = $('.rc-cap', r), fill = $('.rc-fill', r), st = $('.rc-st', r), stt = $('.rc-stt', r);
  let used = 0, inT = 0, outT = 0, tools = 0, running = false, limit = 1800, loop = 0;
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const paint = () => { $('.rc-n', r).textContent = fmt(used); fill.style.width = (used / 2000 * 100) + '%'; $('.rc-in', r).textContent = fmt(inT); $('.rc-out', r).textContent = fmt(outT); $('.rc-tools', r).textContent = tools; };
  const status = (t, cls) => { st.className = 'rc-st tag ' + (cls || ''); swap(stt, t); };
  const capOn = () => tg.getAttribute('aria-checked') === 'true';
  $('.rc-cap-t', r).onclick = e => { e.preventDefault(); tg.setAttribute('aria-checked', !capOn()); cap.style.opacity = capOn() ? 1 : .2; limit = capOn() ? 1800 : 2000; if (!running && used < limit && used > 0) go.disabled = false; };
  function stop(t, cls){ running = false; clearInterval(loop); status(t, cls); }
  go.onclick = () => {
    if (running){ stop('Stopped'); swap(gl(), 'Resume'); return; }
    if (used >= 2000){ used = inT = outT = tools = 0; paint(); }
    running = true; status('Running', 'b'); swap(gl(), 'Stop'); go.className = 'pill soft sm rc-go'; fill.style.background = 'var(--accent-mark,var(--accent))';
    loop = c.every(90, () => {
      used = Math.min(2000, used + 8 + Math.random() * 18); inT += 120 + Math.random() * 220; outT += 30 + Math.random() * 70; if (Math.random() < .12) tools++;
      paint();
      if (used >= limit){
        used = limit; paint();
        if (limit < 2000){ stop('Paused at 90%', 'warn'); fill.style.background = 'var(--warn-mark)'; swap(gl(), 'Raise cap'); go.className = 'pill primary sm rc-go'; go.onclick2 = true; }
        else { stop('Budget used', 'bad'); swap(gl(), 'Start over'); go.className = 'pill primary sm rc-go'; }
      }
    });
  };
  const orig = go.onclick;
  go.addEventListener('click', e => { if (go.onclick2 && !running){ go.onclick2 = false; e.stopImmediatePropagation(); tg.setAttribute('aria-checked','false'); cap.style.opacity = .2; limit = 2000; orig(); } }, true);
  paint();
  // the run starts by itself once the card has settled, so the spend can be seen climbing to the cap
  c.auto(1500, () => { if (!running && !used) go.click(); });
});
/* ---------- Agent lanes ---------- */
DM.def('agent-lanes', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{users}', I('users')).replace('{pause}', I('pause','xs'));
  // each agent has a hue of its own (t names the palette slot): its badge, its track, its tag and its stretch of the relay line
  const L = [
    { n:'Researcher', ic:'search', t:'pb', acts:['Reading competitor sites','Comparing 5 pricing pages','Writing the brief'], log:['Read stripe.com/pricing','Read linear.app/pricing','Noted 3 patterns'] },
    { n:'Designer', ic:'palette', t:'pl', wait:'Waiting for the brief', acts:['Laying out pricing cards','Setting type and spacing','Exporting frames'], log:['Made 3 card variants','Applied spacing tokens','Exported 4 frames'] },
    { n:'Reviewer', ic:'eye', t:'pm', wait:'Waiting for the designer', acts:['Checking contrast','Checking copy','Signing off'], log:['Contrast passes AA','Fixed 2 lines of copy','Approved'] }
  ];
  const root = $('.aln', r), rows = $('.aln-rows', r), ct = $('.aln-ct', r), say = $('.aln-say', r), STEPS = L.length * 3;
  L.forEach(l => {
    l.el = html(`<div class="aln-lane" data-s="queued" style="--c:var(--${l.t});--cb:var(--${l.t}-bg);--cm:var(--aln-${l.t},var(--${l.t}))"><button class="aln-row" aria-expanded="false"><span class="aln-av">${I(l.ic)}</span><span class="aln-who"><span class="aln-n">${l.n}</span><span class="aln-a">${l.wait || 'Queued'}</span></span><span class="aln-tr" aria-hidden="true"><i></i><i></i><i></i></span><span class="aln-st"><span class="tag">Queued</span></span></button><div class="fold shut"><div><div class="aln-det"></div></div></div></div>`);
    rows.appendChild(l.el); const b = $('.aln-row', l.el), f = $('.fold', l.el);
    b.onclick = () => { const s = f.classList.toggle('shut'); b.setAttribute('aria-expanded', !s); };
  });
  const TAG = { queued:'<span class="tag">Queued</span>', waiting:`<span class="tag">${I('clock','xs')}Waiting</span>`, working:'<span class="tag aln-tg"><span class="spin"></span>Working</span>', paused:'<span class="tag warn">Paused</span>', done:`<span class="tag ok">${I('check','xs')}Done</span>` };
  const state = (l, s) => { l.el.dataset.s = s; const t = $('.aln-st', l.el); t.innerHTML = TAG[s]; enter(t.firstElementChild); };
  const act = (l, t, live) => { const a = $('.aln-a', l.el); a.classList.toggle('live', !!live); a.classList.toggle('shim', !!live); swap(a, t); };
  let paused = false, secs = 0, finished = false, steps = 0, hand = '', hands = 0;
  const count = () => swap(ct, `${steps} of ${STEPS} steps`);
  const clk = () => Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'), lc = t => t.charAt(0).toLowerCase() + t.slice(1);
  // the line under the lanes (shown in Clean's foot strip): the hand-off under way, else what the agent at work last did,
  // and once the run is done, how it went
  const tell = () => { if (!say) return;
    if (finished) return swap(say, `${I('check','xs')}Done in ${clk()} · ${STEPS} steps · ${hands} hand-off${hands === 1 ? '' : 's'}`, true);
    if (paused) return swap(say, `Paused at ${clk()}`);
    if (hand) return swap(say, hand);
    const w = L.find(l => l.running);
    swap(say, w ? (w.did ? `${w.n}: ${lc(w.did)}` : `${w.n} started: ${lc(w.acts[0])}`) : steps ? `${steps} of ${STEPS} steps` : `${L.length} agents queued`); };
  const pb = $('.aln-pause', r);
  pb.onclick = () => { paused = !paused; pb.innerHTML = I(paused ? 'play' : 'pause','xs') + (paused ? 'Resume' : 'Pause all'); swap($('.aln-t', r), paused ? 'All agents paused' : '3 agents working');
    L.forEach(l => { if (l.running){ state(l, paused ? 'paused' : 'working'); $('.aln-a', l.el).classList.toggle('shim', !paused); } }); tell(); };
  c.every(1000, () => { if (!paused && !finished){ secs++; $('.aln-m', r).textContent = clk(); } });
  // time only passes for the agents while they aren't paused; each() hears how far through the wait they are
  const hold = async (ms, each) => { let t = 0; while (t < ms){ await c.wait(100); if (!paused){ t += 100; each && each(t / ms); } } };
  async function work(l){
    l.running = true; l.did = ''; state(l, 'working'); tell();
    const bars = $$('.aln-tr i', l.el), det = $('.aln-det', l.el);
    for (let i = 0; i < 3; i++){
      bars[i].classList.add('run'); act(l, l.acts[i], true);
      await hold(1500, p => bars[i].style.setProperty('--p', p.toFixed(3)));
      bars[i].classList.replace('run', 'on'); steps++; count(); l.did = l.log[i]; tell();
      const d = html(`<div><span>${l.log[i]}</span><span class="muted">${secs}s</span></div>`); det.appendChild(d); enter(d);
    }
    l.running = false; act(l, l.log[2]); state(l, 'done'); tell();
  }
  // the relay line draws itself from one badge down to the next, the badge it reaches rings, and the stroke stays as the lit
  // stretch: one line from badge to badge that follows them as the hand-off line opens and shuts (the grey under it steps aside)
  const links = [];
  const place = k => { const rr = rows.getBoundingClientRect(), a = $('.aln-av', k.from.el).getBoundingClientRect(), b = $('.aln-av', k.to.el).getBoundingClientRect();
    const y0 = a.bottom - rr.top + 4, y1 = b.top - rr.top - 4; k.pk.style.top = y0 + 'px'; k.pk.style.height = Math.max(0, y1 - y0) + 'px'; };
  const ro = new ResizeObserver(() => links.forEach(place)); ro.observe(rows); c.offs.push(() => ro.disconnect());
  function carry(from, to){
    const k = { from, to, pk:html(`<span class="aln-pk" aria-hidden="true" style="--from:var(--aln-${from.t},var(--${from.t}));--to:var(--aln-${to.t},var(--${to.t}))"></span>`) };
    rows.appendChild(k.pk); links.push(k); place(k);
    const an = REDUCE ? null : k.pk.animate([{ transform:'scaleY(0)' }, { transform:'scaleY(1)' }], { duration:800, easing:'cubic-bezier(.65,0,.35,1)' });
    return an ? an.finished.catch(() => {}) : Promise.resolve();
  }
  async function handoff(from, to, txt){
    const h = html(`<div class="fold shut aln-hf" style="--from:var(--${from.t});--to:var(--${to.t})"><div><div class="aln-hand"><b class="f">${from.n}</b> handed ${txt} to <b class="t">${to.n}</b></div></div></div>`);
    to.el.before(h); void h.offsetWidth; h.classList.remove('shut'); enter($('.aln-hand', h), 80); hand = `${from.n} handed ${txt} to ${to.n}`; hands++; tell();
    await c.wait(REDUCE ? 0 : 500); await carry(from, to);
    from.el.classList.add('sent'); h.classList.add('lit'); to.el.classList.add('got');
    const av = $('.aln-av', to.el); av.classList.add('ping'); c.later(950, () => av.classList.remove('ping'));
    await c.wait(1300); h.classList.add('shut'); hand = ''; tell(); await c.wait(REDUCE ? 0 : 700); h.remove();
  }
  c.run(async () => {
    await c.wait(600);
    const r1 = work(L[0]); act(L[1], L[1].wait); state(L[1], 'waiting');
    await r1; await handoff(L[0], L[1], 'the brief');
    act(L[2], L[2].wait); state(L[2], 'waiting');
    await work(L[1]); await handoff(L[1], L[2], '4 frames');
    await work(L[2]);
    finished = true; root.classList.add('fin'); $('.aln-ic', r).innerHTML = I('ok'); enter($('.aln-ic', r).firstElementChild);
    swap($('.aln-t', r), 'All 3 agents finished'); pb.remove(); tell();
  });
});
/* ---------- Agent lanes designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and Swimlanes (every
   agent's work on one clock, each lane in its agent's hue) and Crew (a card per agent with its own pause and steer) are
   the directions under review. The card keeps the pick (card._dv), so Replay and the story's next round play the same
   design, and a new pick plays it from the start. The switch is the card's alone: inside another component, as in Agent
   harness, the lanes are Classic, and the registry, the code view and the component page install Classic (build.js
   leaves the switch out of them) */
{
  const classic = DM.defs['agent-lanes'];
  // the run Swimlanes and Crew play: three agents on one clock, in seconds. Each does its steps; the designer and the
  // reviewer start on their own work, then wait for the hand-off from the one before them. t is the agent's palette slot (its
  // lane's hue), av its avatar colour, and each step's ic the icon on its bar
  const ALN_RUN = () => [
    { n:'Researcher', ic:'search', t:'pb', av:'b', cost:.08, steps:[{ t:'Read 5 pricing pages', s:0, d:1.6, ic:'globe' }, { t:'Compared plans and limits', s:1.6, d:1.4, ic:'layers' }, { t:'Wrote the brief', s:3, d:1.2, ic:'file-text' }] },
    { n:'Designer', ic:'palette', t:'pl', av:'l', cost:.21, waitFrom:2.3, waitTo:4.4, waitFor:'the brief', steps:[{ t:'Set up Pricing v5', s:.8, d:1.5, ic:'figma' }, { t:'Laid out the plan cards', s:4.4, d:2.2, ic:'grid' }, { t:'Set type and spacing', s:6.6, d:1.4, ic:'sliders' }, { t:'Exported 4 frames', s:8, d:.8, ic:'upload' }] },
    { n:'Reviewer', ic:'eye', t:'pm', av:'m', cost:.06, waitFrom:3.2, waitTo:9, waitFor:'the frames', steps:[{ t:'Read last month’s copy', s:1.6, d:1.6, ic:'book' }, { t:'Checked contrast', s:9, d:1.4, ic:'eye' }, { t:'Fixed 2 lines of copy', s:10.4, d:1, ic:'edit' }, { t:'Approved the page', s:11.4, d:.6, ic:'check' }] }
  ];
  // the hand-offs: at its time the sender passes its work, which the receiver picks up at got
  const ALN_HAND = [{ from:0, to:1, at:4.2, got:4.4, what:'brief' }, { from:1, to:2, at:8.8, got:9, what:'4 frames' }];
  const ALN_END = 12;
  const alnClock = t => '0:' + String(Math.floor(t)).padStart(2, '0');
  const alnLc = s => s.charAt(0).toLowerCase() + s.slice(1);
  // what an agent is doing at a moment: a step, waiting, idle or done
  // (times are compared a hair early, so a clock of tenths lands on a step's end exactly)
  function alnAt(a, t){
    t += 1e-6;
    const st = a.steps.find(x => t >= x.s && t < x.s + x.d); if (st) return { s:'work', t:st.t, step:st };
    if (a.waitFrom !== undefined && t >= a.waitFrom && t < a.waitTo) return { s:'wait', t:'Waiting for ' + a.waitFor };
    const last = a.steps[a.steps.length - 1]; if (t >= last.s + last.d) return { s:'done', t:'Done, ' + alnLc(last.t) };
    if (t < a.steps[0].s) return { s:'idle', t:'Starts soon' };
    return { s:'idle', t:'Between steps' };
  }

  const alnSwTpl = () => `<div class="aln-sw panel keep">
    <div class="aln-sw-h"><div class="aln-sw-ht"><b class="aln-sw-tt">3 agents working</b><span class="aln-sw-st num">0:00 of 0:12</span></div><span class="aln-sw-key" aria-hidden="true"><span><i class="next"></i>Next</span><span><i class="run"></i>Working</span><span><i class="done"></i>Done</span><span><i class="wait"></i>Waiting</span></span><button class="pill soft sm aln-sw-pause" type="button">${I('pause','xs')}Pause</button></div>
    <div class="aln-sw-grid">
      <div class="aln-sw-ax num" aria-hidden="true"><span class="aln-sw-ticks"></span></div>
      <div class="aln-sw-rows"></div>
      <div class="aln-sw-ph" role="slider" tabindex="0" aria-label="Time in the run" aria-valuemin="0" aria-valuemax="12" aria-valuenow="0" aria-valuetext="0 seconds"><i></i><span class="aln-sw-now num">0:00</span></div>
    </div>
    <div class="aln-sw-f"><span class="aln-sw-say" aria-live="polite">Researcher starts on the pricing pages</span><button class="pill soft sm aln-sw-live" type="button" hidden>Back to now</button></div>
  </div>`;
  // Swimlanes: the clock ticks ten times a second while the demo plays and nobody has paused it. Bars reveal with a clip and
  // the playhead moves with a transform; text changes only when it says something new
  function alnSwim(r, c){
    const A = ALN_RUN(), root = $('.aln-sw', r), rows = $('.aln-sw-rows', r), ph = $('.aln-sw-ph', r), line = $('i', ph), now = $('.aln-sw-now', r), st = $('.aln-sw-st', r), say = $('.aln-sw-say', r), live = $('.aln-sw-live', r), pb = $('.aln-sw-pause', r), tt = $('.aln-sw-tt', r);
    $('.aln-sw-ticks', r).innerHTML = [0, 3, 6, 9, 12].map(t => `<span style="left:${t / ALN_END * 100}%">${t}s</span>`).join('');
    const pct = v => (v / ALN_END * 100).toFixed(3) + '%', clamp = v => Math.max(0, Math.min(1, Math.round(v * 1e4) / 1e4));
    A.forEach(a => {
      a.el = html(`<div class="aln-sw-row" data-s="idle" style="--c:var(--${a.t});--cb:var(--${a.t}-bg);--cm:var(--aln-sw-${a.t},var(--${a.t}))"><div class="aln-sw-who"><span class="aln-sw-av" aria-hidden="true">${I(a.ic)}</span><span class="aln-sw-wt"><b>${a.n}</b><span>Starts soon</span></span></div><div class="aln-sw-lane"></div></div>`);
      const lane = $('.aln-sw-lane', a.el);
      if (a.waitFrom !== undefined){ a.w = html(`<span class="aln-sw-w" style="left:${pct(a.waitFrom)};width:calc(${pct(a.waitTo - a.waitFrom)} - 2px)"><span class="aln-sw-wl">${I('clock','xs')}<span>Waiting for ${a.waitFor}</span></span></span>`); lane.appendChild(a.w); }
      a.steps.forEach(x => { x.el = html(`<span class="aln-sw-b" style="left:${pct(x.s)};width:calc(${pct(x.d)} - 2px)" data-tip="${a.n}: ${x.t}, ${x.d.toFixed(1)}s"><span class="aln-sw-fl"><i></i>${I(x.ic,'xs')}</span></span>`); lane.appendChild(x.el); });
      rows.appendChild(a.el);
    });
    stagger($$('.aln-sw-row', r), 60);
    // the hand-offs, each a hook in its sender's hue and what was passed, placed by the lanes they join and the times
    const hos = ALN_HAND.map(h => { const a = A[h.from];
      const el = html(`<span class="aln-sw-ho" style="--hc:var(--aln-sw-${a.t},var(--${a.t}));--from:${h.from};--to:${h.to};--x0:${h.at / ALN_END};--x1:${h.got / ALN_END}" aria-hidden="true"><i></i></span>`);
      const tg = html(`<span class="tag aln-sw-tg" style="--c:var(--${a.t});--to:${h.to};--x0:${h.at / ALN_END}" aria-hidden="true">${I('file-text','xs')}${h.what}</span>`);
      rows.append(el, tg); return { ...h, el, tg }; });
    // the lane's width is read when it changes size, never while the clock runs
    let W = 0, CW = 0, T = 0, V = null, paused = false, fin = false, said = '', TX = [];
    // the axis labels' spans, read with the lane: the one the playhead's time passes over steps aside (Clean)
    const ax = $('.aln-sw-ax', r), tks = $$('.aln-sw-ticks span', r);
    const lay = () => { W = $('.aln-sw-lane', A[0].el).clientWidth; CW = now.offsetWidth; const a = ax.getBoundingClientRect().left; TX = tks.map(el => { const b = el.getBoundingClientRect(); return [b.left - a, b.right - a]; }); paint(); };
    const ro = new ResizeObserver(lay); ro.observe(rows); c.offs.push(() => ro.disconnect());
    // the run as it stands: bars fill up to now (T); the playhead sits at now, or where you took it (V)
    function paint(){
      const v = V === null ? T : V;
      root.classList.toggle('scrub', V !== null);
      A.forEach(a => {
        a.steps.forEach(x => { const f = clamp((T - x.s) / x.d), k = f >= 1 ? 'done' : f > 0 ? 'run' : '';
          if (x.f !== f){ x.f = f; x.el.style.setProperty('--f', f.toFixed(4)); }
          if (x.k !== k){ x.k = k; x.el.classList.toggle('run', k === 'run'); x.el.classList.toggle('done', k === 'done'); }
          const af = x.s > v; if (x.af !== af){ x.af = af; x.el.classList.toggle('after', af); } });
        if (a.w){ const f = clamp((T - a.waitFrom) / (a.waitTo - a.waitFrom)); if (a.wf !== f){ a.wf = f; a.w.style.setProperty('--f', f.toFixed(4)); } a.w.classList.toggle('after', a.waitFrom > v); }
        const at = alnAt(a, v); if (a.s !== at.s){ a.s = at.s; a.el.dataset.s = at.s; } if (a.say !== at.t){ a.say = at.t; $('.aln-sw-wt span', a.el).textContent = at.t; }
      });
      hos.forEach(h => { const on = T >= h.at && v >= h.at; if (h.on !== on){ h.on = on; h.el.classList.toggle('on', on); h.tg.classList.toggle('on', on); if (A[h.to].w) A[h.to].w.classList.toggle('got', on); } });
      const x = v / ALN_END * W, nx = Math.max(-6, Math.min(W - CW + 6, x - CW / 2)); line.style.transform = `translateX(${x.toFixed(1)}px)`;
      now.style.transform = `translateX(${nx.toFixed(1)}px)`;
      tks.forEach((el, k) => { const t = TX[k], hid = !!t && t[1] > nx - 4 && t[0] < nx + CW + 4; if (el.dmHid !== hid){ el.dmHid = hid; el.classList.toggle('hid', hid); } });
    }
    function text(){
      const v = V === null ? T : V, put = (el, s) => { if (el.textContent !== s) el.textContent = s; };
      put(now, alnClock(v)); put(st, paused ? `Paused at ${alnClock(T)}` : fin ? 'Done in 0:12, with 2 hand-offs' : `${alnClock(T)} of 0:12`);
      ph.setAttribute('aria-valuenow', v.toFixed(1)); ph.setAttribute('aria-valuetext', `${v.toFixed(1)} seconds: ${A.map(a => a.n + ', ' + alnLc(alnAt(a, v).t)).join('; ')}`);
      const busy = A.filter(a => alnAt(a, v).s === 'work');
      const ln = V !== null ? `At ${alnClock(v)}: ${busy.length ? busy.map(a => `${a.n} ${alnLc(alnAt(a, v).t)}`).join(', ') : 'between steps'}` : fin ? 'All three finished in 12 seconds, with 2 hand-offs' : busy.length ? busy.map(a => `${a.n}: ${alnLc(alnAt(a, v).t)}`).join(' · ') : said;
      if (ln !== said){ said = ln; say.textContent = ln; }
    }
    // the agent a hand-off reaches nods as it gets the work
    const fire = () => hos.forEach(h => { if (T >= h.at && !h.fired){ h.fired = true; const b = A[h.to].el; b.classList.add('got'); c.later(650, () => b.classList.remove('got')); } });
    const iv = c.every(100, () => {
      if (paused || fin) return;
      T = Math.min(ALN_END, Math.round(T * 10 + 1) / 10); paint(); text(); fire();
      if (T >= ALN_END){ fin = true; clearInterval(iv); root.classList.add('fin'); swap(tt, 'All 3 agents finished'); pb.hidden = true; text(); }
    });
    pb.onclick = () => { paused = !paused; root.classList.toggle('paused', paused); pb.innerHTML = I(paused ? 'play' : 'pause','xs') + (paused ? 'Resume' : 'Pause'); swap(tt, paused ? 'All agents paused' : '3 agents working'); text(); };
    // dragging the playhead's time, clicking a lane, or the arrow keys on the playhead look back through the run; Back to
    // now follows the run again
    const seek = v => { v = Math.max(0, Math.min(T, v)); V = v >= T - .05 ? null : v; live.hidden = V === null; paint(); text(); };
    live.onclick = () => seek(T);
    const laneLeft = () => { const ln = $('.aln-sw-lane', A[0].el); return ln.getBoundingClientRect().left + ln.clientLeft; };
    let drag = false, left = 0;
    c.on(now, 'pointerdown', e => { drag = true; ph.classList.add('drag'); left = laneLeft(); now.setPointerCapture(e.pointerId); e.preventDefault(); ph.focus({ preventScroll:true }); });
    c.on(now, 'pointermove', e => { if (drag && W) seek((e.clientX - left) / W * ALN_END); });
    const up = () => { drag = false; ph.classList.remove('drag'); }; c.on(now, 'pointerup', up); c.on(now, 'pointercancel', up);
    c.on(rows, 'pointerdown', e => { if (e.target.closest('.aln-sw-lane') && W) seek((e.clientX - laneLeft()) / W * ALN_END); });
    c.on(ph, 'keydown', e => { const v = V === null ? T : V, k = e.key; const to = k === 'ArrowLeft' || k === 'ArrowDown' ? v - .5 : k === 'ArrowRight' || k === 'ArrowUp' ? v + .5 : k === 'Home' ? 0 : k === 'End' ? T : null; if (to === null) return; e.preventDefault(); seek(to); });
    paint(); text();
    // the story: once the run is done, someone takes the playhead back through it, then back to now
    c.story(async s => {
      await s.until(() => fin); await s.beat(2);
      await s.point(now, false); seek(3.5); await s.point(now, false); await s.beat(1);
      seek(5.5); await s.point(now, false); await s.beat(3);
      seek(9.6); await s.point(now, false); await s.beat(3); s.away();
      await s.tap(live); s.away(); await s.beat(3);
    });
  }

  const alnCrewTpl = () => `<div class="aln-cw"><div class="aln-cw-h"><span class="aln-cw-ic">${I('users')}</span><b class="aln-cw-tt">3 agents working</b><span class="aln-cw-sum num">0:00 · 0 of 11 steps</span><span class="aln-cw-tot num">$0.00</span></div><div class="aln-cw-list"></div></div>`;
  // Crew: each agent keeps its own clock, which stops while you pause it, and a hand-off waits for the agent before it
  function alnCrew(r, c){
    const A = ALN_RUN(), H = ALN_HAND.map(h => ({ ...h })), list = $('.aln-cw-list', r), tot = $('.aln-cw-tot', r), tt = $('.aln-cw-tt', r);
    // the line under the title (Clean shows it): the time and the steps so far, and once all are done, how the run went
    const sum = $('.aln-cw-sum', r), ALL = A.reduce((n, a) => n + a.steps.length, 0);
    let fin = false, ticks = 0;
    A.forEach((a, i) => {
      a.held = false; a.tk = 0; a.spent = 0; a.t = 0; const N = a.steps.length;
      a.el = html(`<div class="aln-cw-c" data-s="idle" style="--a:var(--av-${a.av});--ai:var(--av-${a.av}-ink)"><div class="aln-cw-top"><span class="aln-cw-av" aria-hidden="true">${I(a.ic)}</span><span class="aln-cw-tx"><b>${a.n}</b><span>Starts soon</span></span><span class="tag aln-cw-tag">Up next</span><span class="aln-cw-acts"><button class="ib aln-cw-hold" type="button" aria-pressed="false" aria-label="Pause ${a.n}" data-tip="Pause this agent">${I('pause','xs')}</button><button class="ib aln-cw-sb" type="button" aria-expanded="false" aria-label="Steer ${a.n}" data-tip="Steer">${I('wand','xs')}</button></span></div><div class="aln-cw-meter"><span class="aln-cw-tr" role="progressbar" aria-label="${a.n}’s steps" aria-valuemin="0" aria-valuemax="${N}" aria-valuenow="0" style="--n:${N}"><span class="aln-cw-ln"><i></i></span>${'<b></b>'.repeat(N)}</span><span class="aln-cw-num"><span><b class="aln-cw-sn">0</b> of ${N} steps</span><span class="aln-cw-tkn"><b class="aln-cw-tk">0</b> tokens</span><b class="aln-cw-cs">$0.00</b></span></div><div class="fold shut"><div><form class="aln-cw-steer"><input aria-label="A note for the ${a.n.toLowerCase()}" placeholder="Tell the ${a.n.toLowerCase()} what to change"><button class="ib" type="submit" aria-label="Send" data-tip="Send">${I('send','xs')}</button></form></div></div><div class="aln-cw-nts"></div></div>`);
      list.appendChild(a.el);
      a.tr = $('.aln-cw-tr', a.el); a.ln = $('.aln-cw-ln i', a.el); a.dots = $$('.aln-cw-tr b', a.el); a.sn = $('.aln-cw-sn', a.el); a.tkEl = $('.aln-cw-tk', a.el); a.csEl = $('.aln-cw-cs', a.el);
      // no hand-off row between the cards (owner, 18 Nov): each waiting card already says what it waits for
      const hold = $('.aln-cw-hold', a.el), sb = $('.aln-cw-sb', a.el), fold = $('.fold', a.el), form = $('.aln-cw-steer', a.el), inp = $('input', form);
      fold.inert = true;
      hold.onclick = () => { a.held = !a.held; hold.setAttribute('aria-pressed', String(a.held)); hold.innerHTML = I(a.held ? 'play' : 'pause','xs'); hold.dataset.tip = a.held ? 'Resume this agent' : 'Pause this agent'; hold.setAttribute('aria-label', (a.held ? 'Resume ' : 'Pause ') + a.n); paint(a); };
      // the note's field takes the focus only when you open it yourself; the demo never moves your focus
      sb.onclick = e => { const on = sb.getAttribute('aria-expanded') !== 'true'; sb.setAttribute('aria-expanded', String(on)); fold.classList.toggle('shut', !on); fold.inert = !on; if (on && e.isTrusted) requestAnimationFrame(() => inp.focus({ preventScroll:true })); };
      // the note shows once its field has shut, so the card never holds both at once
      form.onsubmit = e => { e.preventDefault(); const v = inp.value.trim(); if (!v) return; inp.value = ''; sb.click(); if (form.contains(document.activeElement)) sb.focus({ preventScroll:true });
        setTimeout(() => { if (a.el.isConnected) $('.aln-cw-nts', a.el).replaceChildren(html(`<div class="aln-cw-note">${I('check','xs')}<span>Got it: “${v.replace(/&/g, '&amp;').replace(/</g, '&lt;')}”, before the next step</span></div>`)); }, REDUCE ? 0 : 460); };
    });
    function paint(a){
      const at = alnAt(a, a.t), s = a.held && at.s !== 'done' ? 'hold' : at.s;
      if (a.s !== s){ a.s = s; a.el.dataset.s = s; const tg = $('.aln-cw-tag', a.el);
        tg.className = 'tag aln-cw-tag' + (s === 'done' ? ' ok' : s === 'hold' ? ' warn' : '');
        tg.innerHTML = s === 'work' ? '<span class="spin"></span>Working' : s === 'wait' ? 'Waiting' : s === 'done' ? I('check','xs') + 'Done' : s === 'hold' ? 'Paused' : 'Up next'; }
      const ln = s === 'hold' ? 'Paused by you' : at.t; if (a.say !== ln){ a.say = ln; const sp = $('.aln-cw-tx span', a.el); sp.className = s === 'work' ? 'shim' : ''; sp.textContent = ln; }
      // the line through the steps: up to each finished step's dot, and on towards the next as the step at work goes
      const N = a.steps.length, t = a.t + 1e-6, done = a.steps.filter(x => t >= x.s + x.d).length, cur = a.steps.find(x => t >= x.s && t < x.s + x.d);
      const p = Math.min(1, Math.round((done + (cur ? (a.t - cur.s) / cur.d : 0)) / N * 1e3) / 1e3);
      if (a.p !== p){ a.p = p; a.ln.style.transform = `scaleX(${p.toFixed(3)})`; }
      if (a.done !== done){ a.done = done; a.dots.forEach((d, k) => { d.classList.toggle('done', k < done); d.classList.toggle('now', k === done); }); a.sn.textContent = done; a.tr.setAttribute('aria-valuenow', done); }
    }
    c.every(100, () => {
      let spent = 0;
      A.forEach((a, i) => {
        const prev = H[i - 1];
        const blocked = prev && a.t >= (a.waitFrom ?? 99) && A[prev.from].t < prev.at;
        // once the hand-off has come, the wait is over at once
        if (!blocked && prev && a.t >= a.waitFrom && a.t < a.waitTo) a.t = a.waitTo;
        if (!a.held && !blocked && a.t < ALN_END) a.t = Math.min(ALN_END, Math.round(a.t * 10 + 1) / 10);
        if (alnAt(a, a.t).s === 'work' && !a.held){ a.tk += 40 + Math.random() * 90; a.spent += a.cost / 50; }
        spent += a.spent; paint(a);
        const tk = Math.round(a.tk).toLocaleString('en-US'), cs = '$' + a.spent.toFixed(2);
        if (a.tkEl.textContent !== tk) a.tkEl.textContent = tk; if (a.csEl.textContent !== cs) a.csEl.textContent = cs;
      });
      H.forEach(h => { if (!h.on && A[h.from].t >= h.at) h.on = true; });
      const ts = '$' + spent.toFixed(2); if (tot.textContent !== ts) tot.textContent = ts;
      if (!fin && A.every(a => a.t >= ALN_END)){ fin = true; swap(tt, 'All 3 agents finished'); $('.aln-cw-ic', r).innerHTML = I('ok'); }
      if (sum){ if (!fin) ticks++; const k = alnClock(ticks / 10), n = A.reduce((m, a) => m + (a.done || 0), 0);
        const ss = fin ? `Done in ${k} · ${ALL} steps · ${H.length} hand-offs` : `${k} · ${n} of ${ALL} steps`; if (sum.dmSaid !== ss){ sum.dmSaid = ss; fin ? swap(sum, ss) : (sum.textContent = ss); } }
    });
    A.forEach(paint);
    // the story: someone steers the designer while it works, then pauses the reviewer for a moment
    c.story(async s => {
      await s.until(() => A[1].s === 'work' && A[1].t > 5); await s.beat(1);
      await s.tap($('.aln-cw-sb', A[1].el)); s.away();
      await s.type($('input', A[1].el), 'Make the Pro card stand out', { n:.07, keep:true });
      await s.beat(1); await s.tap($('.aln-cw-steer .ib', A[1].el)); s.away();
      await s.until(() => A[2].s === 'work'); await s.beat(2);
      await s.tap($('.aln-cw-hold', A[2].el)); s.away(); await s.beat(4);
      await s.tap($('.aln-cw-hold', A[2].el)); s.away();
      await s.until(() => fin); await s.beat(4);
    });
  }
  // the switch: the design the card last showed (Classic to begin with) is drawn, and picking another starts the card
  // again with it, as Animate does (on designme.dev through the card's own replay, so its footer tabs follow)
  DM.def('agent-lanes', (r, c, card) => {
    const dm0 = $(':scope>.aln-dm', r);
    if (!dm0) return classic(r, c, card);
    // placed inside another component (as in Agent harness, where the card's own stage is not there), it is Classic, as it was
    if (!c.card){ dm0.replaceWith(...$(':scope>.dm-main', dm0).childNodes); return classic(r, c, card); }
    const D = { swimlanes:[alnSwim, alnSwTpl], crew:[alnCrew, alnCrewTpl] }, dv = D[c.card._dv] ? c.card._dv : 'classic';
    if (dv === 'classic') classic(r, c, card);
    else { $(':scope>.aln-dm>.dm-main', r).innerHTML = D[dv][1](); D[dv][0](r, c); }
    const sg = $(':scope>.aln-dm>.demo .seg2', r); if (!sg) return;
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === dv)));
    seg(sg, v => { if (v === dv || !(v === 'classic' || D[v])) return; c.card._dv = v; if (window.V2 && c.card.dataset.v2) window.V2.replay(c.card); else DM.mount(c.card); });
  });
}
/* ---------- Live answer ---------- */
DM.def('live-answer', (r, c) => {
  const A = $('.lva-a', r);
  // no room is kept for the answer (owner, 18 Nov): the turn grows as it streams in (grow()), centred in its stage (in a
  // chat around it, like the Agent harness, the chat lays it out)
  const lva = $('.lva', r) || r;
  if (r === c.st) Promise.resolve().then(() => Promise.all(lva.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && lva.isConnected) c.offs.push(grow(lva)); });
  const srcs = { 1:'Funnel data, last 30 days', 2:'Session notes from 8 interviews', 3:'Onboarding.fig, step 2' };
  // each source's badge on a vivid fill of its own (owner, 18 Nov: saturated, clearly different hues), white letters on each
  const S = [[1,'F','var(--av-l)','Funnel data','Amplitude, last 30 days'],[2,'N','var(--av-b)','Session notes','Notion, 8 interviews'],[3,'S','var(--av-r)','Onboarding.fig','Figma, step 2']];
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
    const src = html(`<div class="lva-src"><span class="lva-acts"><button class="ib" aria-label="Copy" data-tip="Copy">${I('copy')}</button><button class="ib" aria-label="Good answer" data-tip="Good answer">${I('up-thumb')}</button><button class="ib" aria-label="Bad answer" data-tip="Bad answer">${I('down-thumb')}</button><button class="ib" aria-label="Try again" data-tip="Try again">${I('refresh')}</button></span><button class="lva-sb" aria-expanded="false"><span class="lva-fav">${S.map(x => `<span class="vivid" style="background-color:${x[2]}">${x[1]}</span>`).join('')}</span>3 sources${I('chev-d','xs')}</button></div>`);
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
/* ---------- Composer ---------- */
DM.def('composer', (r, c) => {
  const icons = { clip:'clip', figma:'figma', eye:'eye', edit:'edit', list:'list', code:'code', mic:'mic', up:'up', check:'check', file:'file-text', image:'image' };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => k === 'chev' ? I('chev-d','xs') : icons[k] ? I(icons[k]) : m);
  const box = $('.cpx-box', r), ta = $('.cpx-ta', r), send = $('.cpx-bar .cpx-send', r), thread = $('.cpx-thread', r), att = $('.cpx-att', r), PH = ta.placeholder;
  // no room is kept for the conversation (owner, 18 Nov): the thread and the box grow together (grow()), centred in the
  // stage, once the entrance (which scales it) has ended. Its menus open over it (placePop) and it never moves for them
  const cpx = $('.cpx', r);
  if (r === c.st && cpx) Promise.resolve().then(() => Promise.all(cpx.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && cpx.isConnected) c.offs.push(grow(cpx)); });
  const fit = () => { ta.style.height = 'auto'; ta.style.height = Math.min(ta.scrollHeight, 160) + 'px'; };
  // send waits for text or a file, and for every file to finish loading
  const sync = () => { send.disabled = (!ta.value.trim() && !att.children.length) || !!$('.fchip.ld,.fchip.err', att); fit(); };
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
    before = ta.value; box.dataset.mode = 'voice'; ta.value = ''; ta.placeholder = 'Listening…'; fit();
    const t0 = performance.now(), tm = $('.cpx-tm', r); tm.textContent = '0:00';
    k.every(250, () => { const s = Math.floor((performance.now() - t0) / 1000); tm.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); });
    await k.run(async () => { await k.wait(700); for (const w of said.split(' ')){ ta.value += (ta.value ? ' ' : '') + w; fit(); await k.wait(160 + Math.random() * 120); } });
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
    const chips = files.map(f => `<span class="fchip">${I('clip','xs')}${f}</span>`).join('');
    const b = html(v ? `<div class="bub">${files.length ? `<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:6px">${chips}</div>` : ''}${v.replace(/</g,'&lt;')}</div>` : `<div class="cpx-files">${chips}</div>`); thread.appendChild(b); enter(b);
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
  /* feedback on a button that did something: its icon swaps for a tick, in place, and a word in the tooltip or the label
     says what happened, then it all goes back. The button never collapses: a labelled one eases its width to its new words */
  function flash(btn, label){
    const use = $('use', btn), lb = $('.afx-lbl', btn);
    const o = btn._fl || (btn._fl = { href:use && use.getAttribute('href'), tip:btn.dataset.tip, txt:lb && lb.textContent });
    clearTimeout(o.t);
    // the icon's id keeps its sprite's prefix (the site's are "v2i-…", an install's "i-…"): only the name changes
    const words = t => { const w0 = btn.getBoundingClientRect().width; lb.textContent = t; const w1 = btn.getBoundingClientRect().width;
      if (!REDUCE && Math.abs(w1 - w0) > .5) btn.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:cssMs(root, '--t'), easing:cssEase(root) }); };
    if (use) use.setAttribute('href', o.href.replace(/i-[\w-]+$/, 'i-check'));
    if (lb) words(label);
    btn.classList.add('copied');
    if (o.tip !== undefined){ btn.dataset.tip = label; showTip(btn); }
    o.t = setTimeout(() => {
      if (use) use.setAttribute('href', o.href);
      if (lb) words(o.txt);
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
  /* versions: a menu button with one radio item per version, newest first. Arrow keys move, Enter picks, Esc closes */
  function vmenu(k, m, btn, wrap, o = {}){
    const id = uid(), vs = m.a.versions;
    const menu = html(`<div class="pop afx-menu" id="${id}" role="menu" aria-label="Versions of ${esc(m.a.title)}" inert><div class="ph" aria-hidden="true">Versions</div>${vs.map((v, j) => j).reverse().map(j => `<button type="button" class="mi" role="menuitemradio" tabindex="-1" data-i="${j}" aria-checked="false"><span class="afx-mb"><span>v${j + 1}<span class="afx-mw"> · ${esc(vs[j].ago)}</span></span><span class="d">${esc(vs[j].note)}</span></span>${ic('check', 's ck')}</button>`).join('')}</div>`);
    // on the card's own stage the menu sits in the room, over the variant; in a chat it goes with the card
    const host = own ? main : wrap; host.append(menu);
    btn.setAttribute('aria-haspopup', 'menu'); btn.setAttribute('aria-expanded', 'false'); btn.setAttribute('aria-controls', id);
    const items = () => $$('.mi', menu);
    let open = false;
    // the menu opens over the card from its button: down when it fits below, up when it doesn't and fits above or has more
    // room there (as placePop), within the stage's room (inside its padding, above a switcher) so it never covers the
    // stage's own controls or gets cut off; the card itself never moves (owner, 18 Nov)
    const place = () => {
      const hr = host.getBoundingClientRect(), wr = wrap.getBoundingClientRect(), br = btn.getBoundingClientRect(), rr = root.getBoundingClientRect(), mw = menu.offsetWidth;
      const lo = Math.max(rr.left, wr.left), hi = Math.min(rr.right, wr.right) - mw, x = Math.max(lo, Math.min(br.left - 6, hi));
      const room = popRoom(btn), st = own && (root.closest('.stage-inner') || root.closest('.stage'));
      if (st){ const sr = st.getBoundingClientRect(), cs = getComputedStyle(st); room.top = Math.max(room.top, sr.top + parseFloat(cs.paddingTop)); room.bottom = Math.min(room.bottom, sr.bottom - parseFloat(cs.paddingBottom)); }
      if (own && demo && demo.offsetParent) room.bottom = Math.min(room.bottom, demo.getBoundingClientRect().top);
      const need = menu.offsetHeight + 12, below = room.bottom - br.bottom, above = br.top - room.top, up = below < need && (above >= need || above > below);
      menu.style.left = Math.round(x - hr.left) + 'px';
      menu.style.top = Math.round(up ? br.top - hr.top - menu.offsetHeight - 6 : br.bottom - hr.top + 6) + 'px';
      menu.style.setProperty('--origin', (up ? 'bottom' : 'top') + ' left');
    };
    // the visitor's open puts the focus on the picked version; a demo's open leaves the focus where it is
    const show = (focus = true) => {
      items().forEach(b => b.setAttribute('aria-checked', String(+b.dataset.i === m.i)));
      open = true; hideTip(); menu.inert = false; o.onOpen && o.onOpen(); place(); menu.classList.add('open'); btn.setAttribute('aria-expanded', 'true');
      if (focus) (items().find(b => b.getAttribute('aria-checked') === 'true') || items()[0]).focus({ preventScroll:true });
    };
    const hide = refocus => {
      if (!open) return; open = false; menu.classList.remove('open'); btn.setAttribute('aria-expanded', 'false');
      if (refocus) btn.focus({ preventScroll:true });
      menu.inert = true; o.onClose && o.onClose();
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
    // Close takes the focus, with a ring only when the reader was opened from the keyboard (a click never leaves one)
    giveBack($('.afx-x', layer));
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
      giveBack(opener);
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
        <p class="afx-pv-p"></p>
        <div class="afx-pv-ls"><i></i><i></i><i></i><i></i></div>
      </div></div>
      <div class="afx-pv-meta"><span class="afx-ic"><span class="spin" aria-hidden="true"></span>${ic(a.icon)}</span>
        <div class="afx-pv-tx"><div class="afx-pv-t">${esc(a.title)}</div>${metaHTML(a)}</div>
        <div class="afx-pv-act">${acts(a, `<button type="button" class="ib afx-open" aria-label="Open ${esc(a.title)}" data-tip="Open">${ic('max')}</button>`)}</div>
      </div>
    </div></div>`;
    const wrap = $('.afx-w', main), card = $('.afx-pv-card', main), op = $('.afx-open', card), p = $('.afx-pv-p', main);
    const fill = i => { $$('.afx-pv-ls i', main).forEach((e, j) => e.style.setProperty('--w', W[i % 3][j] + '%')); };
    const last = a.versions.length - 1, sum = i => a.versions[i].summary || '';
    now.m = m; bindMeta(card, m); fill(m.i); openTip(op);
    m.on(i => { swap(p, sum(i)); fill(i); });
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
        <button type="button" class="afx-in-main" disabled><span class="afx-in-ic"><span class="spin" aria-hidden="true"></span>${ic(a.icon, 's')}</span><span class="afx-in-tx"><span class="afx-in-t"><span class="afx-sr">Open </span>${esc(a.title)}</span><span class="afx-in-m"><span class="afx-wr shim">${esc(a.steps[0])}</span><span class="afx-fin"><span class="afx-v"></span><span class="afx-msep" aria-hidden="true">·</span><span class="afx-when"></span></span></span></span></button>
        <span class="afx-tray"><span>
          <span class="afx-tsep" aria-hidden="true"></span>
          ${a.versions.length > 1 ? `<button type="button" class="ib afx-vb3" aria-label="Versions" data-tip="Versions">${ic('history', 's')}</button>` : ''}
          <button type="button" class="ib afx-copy" aria-label="Copy ${esc(a.title)}" data-tip="Copy">${ic('copy', 's')}</button>
          <button type="button" class="ib afx-dl" aria-label="Download ${esc(a.title)}" data-tip="Download">${ic('down', 's')}</button>
        </span></span>
      </span>
      ${own ? '<div class="fold shut afx-in-after"><div><p>The short version: the plan table is where people stall, and three small changes should move most of them on.</p></div></div>' : ''}
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
      // the words that sum the file up come once it is written
      const after = $('.afx-in-after', main); if (after) after.classList.remove('shut');
    });
  }

  /* stack: the report as a stack of paper. The newest page is written onto it; Versions lays the sheets out to pick one */
  function stack(k){
    const a = art, m = model(a), N = a.versions.length, top = N - 1, T = a.title;
    // the drawn lines stand for each page's text: h its heading, p a paragraph line, b a bullet, n a numbered fix, s a gap.
    // The page is drawn, not written out: its name and version are said once, in the caption under the stack (owner, 18 Nov)
    const LINES = [
      [['h', 62], ['p', 94], ['p', 72], ['s'], ['b', 82], ['b', 74], ['b', 66], ['b', 78], ['s'], ['p', 88], ['p', 52]],
      [['h', 56], ['p', 92], ['p', 86], ['p', 56], ['s'], ['b', 80], ['b', 72], ['b', 86], ['b', 64], ['s'], ['p', 70]],
      [['h', 66], ['p', 90], ['p', 78], ['s'], ['n', 84], ['n', 70], ['n', 78], ['s'], ['b', 76], ['b', 68], ['b', 82]]
    ];
    const lines = j => LINES[j === top ? 2 : j % 2].map(([t, w]) => t === 's' ? '<span class="afx-gap"></span>' : `<span class="afx-r ${t}">${t === 'p' || t === 'h' ? '' : '<b></b>'}<i style="--w:${w}%"></i></span>`).join('');
    main.innerHTML = `<div class="afx-w afx-st is-writing">
      <div class="afx-desk"><div class="afx-stack" role="menu" aria-label="Versions of ${esc(T)}" aria-hidden="true">${a.versions.map((v, j) => `<button type="button" class="afx-sh${j === top ? ' blank' : ''}" role="menuitemradio" tabindex="-1" data-i="${j}" aria-checked="${j === top}" aria-label="v${j + 1}, ${esc(v.when)}: ${esc(v.note)}"><span class="afx-pg" aria-hidden="true"><span class="afx-st-ls">${lines(j)}</span>${j === top ? '<span class="afx-pen"></span>' : ''}</span><span class="afx-tab" aria-hidden="true">${ic('check', 'xs')}<span>v${j + 1}</span><span class="afx-ta"> · ${esc(v.ago)}</span></span></button>`).join('')}</div></div>
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
    // writing: a blank sheet drops onto the stack, and a pen draws its heading and each line of the new page
    c.run(async () => {
      const sh = sheets[top], pen = $('.afx-pen', sh), E = cssEase(root);
      if (!REDUCE) sh.animate([{ transform:'translateY(-36px)', opacity:0 }, { transform:'none', opacity:1 }], { duration:cssMs(root, '--t-slow'), easing:E, composite:'add' });
      await k.wait(300);
      const w = $('.afx-st-m .afx-wr', main), st = a.steps;
      swap(w, st[0]);
      await k.wait(REDUCE ? 500 : 400);
      const rows = $$('.afx-r', sh).filter(x => x.offsetParent);
      for (let j = 0; j < rows.length; j++){
        const x = rows[j], line = $('i', x), dot = $('b', x);
        if (j === 1) swap(w, st[1]);
        if (j === 4) swap(w, st[2]);
        if (REDUCE){ await k.wait(150); continue; }
        const x0 = x.offsetLeft + line.offsetLeft, x1 = x0 + line.offsetWidth, y = x.offsetTop + x.offsetHeight / 2 - 3.5, ms = 260 + line.offsetWidth * 1.4;
        if (dot) dot.animate([{ transform:'scaleX(0)' }, { transform:'none' }], { duration:120, fill:'forwards' });
        line.animate([{ transform:'scaleX(0)' }, { transform:'scaleX(1)' }], { duration:ms, easing:'cubic-bezier(.4,0,.3,1)', fill:'forwards' });
        pen.animate([{ transform:`translate(${x0 - 3}px,${y}px)`, opacity:1 }, { transform:`translate(${x1 - 3}px,${y}px)`, opacity:1 }], { duration:ms, easing:'cubic-bezier(.4,0,.3,1)', fill:'forwards' });
        await k.wait(ms + 70);
      }
      pen.getAnimations().forEach(x => x.cancel());
      $$('.afx-r :is(i,b)', sh).forEach(e => e.getAnimations().forEach(x => x.cancel()));
      sh.classList.remove('blank');
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
/* ---------- Attachment tray ---------- */
DM.def('attachment-tray', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{upload}', I('upload'));
  const tray = $('.atx', r), list = $('.atx-list', r), sum = $('.atx-sum', r);
  // Clean: the whole card is the drop target. The drop zone gives way to the empty state (after the list, so it shows only
  // while the list is empty), and the closing line moves into a foot strip with Add files, shown once there are files. The
  // card grows with its files (grow()); Soft and Blueprint as they were
  const clean = (r.closest('[data-style]') || document.documentElement).dataset.style === 'clean';
  if (clean){
    $('.atx-drop', r).remove();
    list.after(html(`<div class="atx-em"><span class="atx-em-art" aria-hidden="true"></span><b>Drop files here</b><span>or <label class="atx-br">browse your files<input type="file" multiple class="atx-file" aria-label="Choose files" title=""></label></span><button type="button" class="pill line sm atx-smp">${I('plus','xs')}Add sample files</button></div>`));
    const ft = html(`<div class="atx-ft"><label class="pill line sm atx-add">${I('plus','xs')}Add files<input type="file" multiple class="atx-file" aria-label="Add files" title=""></label></div>`);
    sum.replaceWith(ft); ft.prepend(sum);
    c.offs.push(grow(tray));
  }
  const drop = clean ? tray : $('.atx-drop', r);
  const kind = n => { const e = (n.split('.').pop() || '').toLowerCase(); return e === 'pdf' ? ['PDF','var(--pr)','var(--pr-bg)'] : /png|jpg|jpeg|gif|webp|fig/.test(e) ? [e.toUpperCase().slice(0,3),'var(--pl)','var(--pl-bg)'] : /csv|xlsx/.test(e) ? ['CSV','var(--pm)','var(--pm-bg)'] : [e.toUpperCase().slice(0,3) || 'TXT','var(--pb)','var(--pb-bg)']; };
  const size = b => b > 1e6 ? (b / 1e6).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1e3)) + ' KB';
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  let read = 0;
  // a file uploads (its row fills with its hue and its ring closes), then the agent reads it and says what it found
  function add(name, bytes, i = 0, found){
    const k = kind(name), sz = size(bytes);
    const it = html(`<div class="atx-it" style="--c:${k[1]};--cb:${k[2]}"><span class="atx-ti">${k[0]}</span><span class="atx-n"><span class="atx-nm">${esc(name)}</span><span class="atx-m"><span>${sz} · <span class="num pc">0%</span></span></span></span><svg class="atx-ring" viewBox="0 0 22 22" role="progressbar" aria-label="Uploading ${esc(name).replace(/"/g, '&quot;')}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><circle cx="11" cy="11" r="8" fill="none" stroke="var(--line)" stroke-width="2"/><circle cx="11" cy="11" r="8" fill="none" stroke="${k[1]}" stroke-width="2" stroke-linecap="round" stroke-dasharray="50.3" stroke-dashoffset="50.3" transform="rotate(-90 11 11)"/></svg><button class="ib" aria-label="Remove ${esc(name).replace(/"/g, '&quot;')}" data-tip="Remove">${I('x','xs')}</button>${clean ? '<span class="atx-ln" aria-hidden="true"><i></i></span>' : ''}</div>`);
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
        const rd = $('.atx-rd', it); if (rd) rd.outerHTML = `<span class="atx-ok">${clean ? '<span class="atx-okc"><svg viewBox="0 0 16 16" aria-hidden="true"><path pathLength="1" d="M4.6 8.3l2.3 2.3 4.5-4.8"/></svg></span>' : I('ok')}</span>`;
        swap(m, found ? `${sz} · ${found}` : sz); read++;
        if (!clean) { swap(sum, 'The agent can read ' + read + (read > 1 ? ' files' : ' file') + ' now'); return; }
        // Clean: the foot strip opens with a green tick, and from then on only its count rolls
        const w = read > 1 ? 'files' : 'file', rl = $('.atx-roll', sum);
        if (!rl) swap(sum, `<span class="atx-tk">${I('check','xs')}</span><span>The agent can read <span class="atx-roll num"><i>${read}</i></span> <span class="atx-w">${w}</span> now</span>`, true);
        else { rl.innerHTML = `<i class="in">${read}</i>`; $('.atx-w', sum).textContent = w; }
      });
    });
  }
  const samples = () => [['brief.pdf', 2.4e6, '12 pages'],['Pricing.fig', 8.1e6, '6 frames'],['signups.csv', 3.2e5, '1,204 rows']].forEach((f, i) => add(f[0], f[1], i, f[2]));
  $(clean ? '.atx-smp' : '.atx-sample', r).onclick = e => { e.preventDefault(); samples(); };
  $$('.atx-file', r).forEach(inp => { inp.onchange = e => { Array.from(e.target.files).forEach((f, i) => add(f.name, f.size, i)); e.target.value = ''; }; });
  ['dragenter','dragover'].forEach(ev => c.on(drop, ev, e => { e.preventDefault(); drop.classList.add('over'); }));
  // (in Clean the card holds the rows and buttons, so moving between them is not leaving it)
  ['dragleave','drop'].forEach(ev => c.on(drop, ev, e => { if (clean && ev === 'dragleave' && drop.contains(e.relatedTarget)) return; drop.classList.remove('over'); }));
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
  if (ants){ fit(); const ro = new ResizeObserver(fit); ro.observe(drop); c.offs.push(() => ro.disconnect()); }
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
  // Soft's empty tray (owner, 18 Nov: the line drawing "is too abstract" in Soft, "more similar to clean but softer"): a small file
  // card with three rows, each a tile and a line, the first file's tile in the accent's tint. Blueprint keeps the line drawing
  const ATX_CMP_SKETCH = '<span class="atx-cmp-sk" aria-hidden="true">' + '<span class="r"><i class="t"></i><i class="l"></i></span>'.repeat(3) + '</span>';
  const atxCmpTpl = () => `<div class="atx-cmp">
    <div class="atx-cmp-box none">
      <div class="atx-cmp-tray">
        <div class="atx-cmp-empty"><svg class="atx-cmp-art" viewBox="0 0 120 80" aria-hidden="true" focusable="false">${ATX_CMP_ART}</svg>${ATX_CMP_SKETCH}<p><b>Drop files for the agent</b><span>or press + to add them</span></p></div>
        <div class="atx-cmp-list" role="list" aria-label="Attached files"></div>
      </div>
      <textarea class="atx-cmp-ta" rows="2" aria-label="Message" placeholder="Ask about these files" spellcheck="false"></textarea>
      <div class="atx-cmp-f"><label class="ib atx-cmp-add" data-tip="Add files">${I('plus')}<input type="file" multiple class="atx-pick" aria-label="Add files" title=""></label><span class="atx-cmp-st" aria-live="polite"></span><button class="atx-cmp-send" type="button" aria-label="Send" data-tip="Send" data-tip-k="↵" disabled>${I('up')}</button></div>
      <div class="atx-cmp-over" aria-hidden="true"><span>${I('upload')}Drop to attach</span></div>
    </div>
  </div>`;
  // Composer: drop files on the box, or press +. Each lands in the tray, uploads (its picture unveils from the foot), is read,
  // and is ready to send; drag a file along the tray to move it, or use the arrow keys (Alt moves it), Delete removes it
  function atxComposer(r, c){
    const box = $('.atx-cmp-box', r), tray = $('.atx-cmp-list', r), empty = $('.atx-cmp-empty', r), st = $('.atx-cmp-st', r), ta = $('.atx-cmp-ta', r), send = $('.atx-cmp-send', r);
    const files = [];
    // Clean: the empty tray is Clean's empty state, as Classic's (a sketch of a file list, the title, one line and Add sample
    // files) in place of the drawing, and the box grows with what it holds (grow())
    const clean = (r.closest('[data-style]') || document.documentElement).dataset.style === 'clean';
    if (clean){
      empty.classList.add('atx-em');
      empty.innerHTML = `<span class="atx-em-art" aria-hidden="true"></span><b>Drop files for the agent</b><span>or press + to add them</span><button type="button" class="pill line sm atx-smp">${I('plus','xs')}Add sample files</button>`;
      c.offs.push(grow(box));
    }
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
    if (clean) $('.atx-smp', r).onclick = () => { if (!files.length) add(ATX_FILES()); };
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
    <label class="atx-ctx-drop"><input type="file" multiple class="atx-pick" aria-label="Add files" title="">${I('plus','xs')}<span>Drop files or <u>browse</u></span></label>
  </div>`;
  // Context budget: each file uploads (a line grows under its icon; in Clean a ring closes round it), then the agent counts its tokens and its share of the window grows.
  // A switch leaves a file out, its name opens what the agent found, and a file too big to read whole says what it keeps
  function atxBudget(r, c){
    const list = $('.atx-ctx-list', r), segs = $('.atx-ctx-segs', r), bar = $('.atx-ctx-bar', r), st = $('.atx-ctx-st', r), pc = $('.atx-ctx-pc', r), free = $('.atx-ctx-free', r), dz = $('.atx-ctx-drop', r);
    const WIN = 128000, SYS = 4000, files = [], card = $('.atx-ctx', r);
    // the card grows with its files in every style (grow(); owner, 18 Nov: no room kept for the details that open later). In
    // Clean the pill under the list becomes the card's foot strip (Drop files here, and Add files 8px from the corner), the
    // whole card is the drop target, as Classic's is, and each file's upload is a ring round its round tile, not a line under it
    const clean = (r.closest('[data-style]') || document.documentElement).dataset.style === 'clean';
    if (clean){
      dz.replaceWith(html(`<div class="atx-ctx-ft"><span>Drop files here</span><label class="pill line sm atx-add">${I('plus','xs')}Add files<input type="file" multiple class="atx-pick" aria-label="Add files" title=""></label></div>`));
    }
    c.offs.push(grow(card));
    // (the ring is drawn from the top, its ink arc as long as the upload's progress, --p)
    const RING = '<svg class="atx-ctx-rg" viewBox="0 0 30 30" aria-hidden="true"><circle class="tr" cx="15" cy="15" r="14"/><circle class="pg" cx="15" cy="15" r="14" pathLength="1"/></svg>';
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
        f.el = html(`<li class="atx-ctx-it atx-popin" style="${step};animation-delay:${i * 90}ms"><div class="atx-ctx-r"><span class="atx-ctx-ic">${atxIcon(t)}${clean ? RING : '<span class="atx-ctx-up" aria-hidden="true"></span>'}</span><span class="atx-ctx-tx"><button type="button" aria-expanded="false" disabled><span>${atxEsc(f.n)}</span>${I('chev-d','xs')}</button><span class="atx-ctx-m">${atxSize(f.sz)} · uploading</span></span><span class="dot atx-ctx-kd" aria-hidden="true"></span><span class="atx-ctx-tk num">–</span><button class="toggle" type="button" role="switch" aria-checked="true" aria-label="Include ${atxEsc(f.n)}" data-tip="Include in context"></button></div><div class="fold shut"><div><div class="atx-ctx-det"></div></div></div></li>`);
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
          f.live = false; f.seg.classList.remove('live'); if (f.cut) f.seg.classList.add('cut'); if (clean) f.el.classList.add('done'); total();
          fb.disabled = false;
          $('.atx-ctx-det', f.el).innerHTML = (f.cut ? `<p>Too big to read whole: the agent keeps the first ${f.cut.toLocaleString('en-US')} rows.</p>` : f.more ? `<p>${atxEsc(f.more)}</p>` : '') + (f.facts || []).map(x => `<span class="tag">${atxEsc(x)}</span>`).join('');
          swap($('.atx-ctx-m', f.el), f.cut ? `${atxSize(f.sz)} · <span class="w">first ${f.cut.toLocaleString('en-US')} rows</span>` : `${atxSize(f.sz)} · ${f.found || 'read'}`, true);
        });
      });
    }
    $('.atx-pick', r).onchange = e => { add(Array.from(e.target.files).map(f => ({ n:f.name, sz:f.size }))); e.target.value = ''; };
    if (clean) atxDrop(c, card, add); else { atxDrop(c, dz, add); atxDrop(c, list, add); }
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
  // price with no thinking
  const M = [
    { n:'Opus 5.5', m:'O', c:'var(--pl)', t:'var(--on-ink)', d:'Deepest reasoning, slower', s:2, q:5, p:5, tps:38, sec:9, cost:.021 },
    { n:'Sonnet 5.5', m:'S', c:'var(--accent)', t:'var(--on-accent)', d:'Balanced, the default for design work', s:4, q:4, p:2, tps:74, sec:4, cost:.006 },
    { n:'Haiku 5.5', m:'H', c:'var(--pm)', t:'var(--on-ink)', d:'Fastest, for quick edits', s:5, q:3, p:1, tps:142, sec:1.5, cost:.001 }
  ];
  // thinking effort, and what it may spend
  const E = [['Off', 'Answers straight away'], ['Low', 'Up to 2k thinking tokens'], ['Medium', 'Up to 8k thinking tokens'], ['High', 'Up to 24k thinking tokens']];
  const list = $('.mpk-list', r), tr = $('.mpk-tr', r), fold = $('.mpk-fold', r), sgf = $('.mpk-sgf', r), sgt = $('.mpk-sgt', r), note = $('.mpk-note', r), thd = $('.mpk-thd', r), ev = $('.mpk-ev', r), items = $$('.mpk-pop .mi', r);
  // in Clean the first row's numbers show under its meters, so they never sit over the column heads
  const clean = r.closest('[data-style]')?.dataset.style === 'clean';
  const meter = (v, tip, i) => `<span class="mpk-m" data-tip="${tip}"${clean && !i ? ' data-tip-at="below"' : ''}>${[1, 2, 3, 4, 5].map(k => `<i${k <= v ? ' class="on"' : ''}></i>`).join('')}</span>`;
  list.innerHTML = M.map((x, i) => `<button class="mpk-o" role="radio" aria-checked="false" tabindex="-1" data-i="${i}"><span class="mpk-mk" style="--mc:${x.c};--mt:${x.t}">${x.m}</span><span class="t"><b>${x.n}<span class="ck">${I('check','xs')}</span></b><span class="d">${x.d}</span></span>${meter(x.s, x.tps + ' tokens a second', i)}${meter(x.q, 'Quality ' + x.q + ' of 5', i)}${meter(x.p, '$' + x.cost.toFixed(3) + ' a reply', i)}</button>`).join('');
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
  // Clean: the confirmation is the card's own foot strip, not a line under it
  if (clean) $('.mpk-p', r).appendChild(note);
  // Clean leaves the centring to its stage, which centres it at every moment as the list folds open and the confirmation
  // strip opens and shuts (centre() measured the homepage card before its stage was laid out and kept it 145px too high)
  const centred = clean ? () => {} : centre(c, mpk, () => { const shut = fold.classList.contains('shut'), sgx = sgf.classList.contains('shut') ? 0 : sgf.firstElementChild.scrollHeight;
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
/* ---------- Permission gate ---------- */
DM.def('permission-gate', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{figma}', I('figma')).replace(/\{chk\}/g, I('check','xs')).replace('{chev}', I('chev-d','xs'));
  const root = $('.pgx', r), ok = $('.pgx-ok', r), no = $('.pgx-no', r), sc = $('.pgx-sc', r), title = $('.pgx-ht b', r), sub = $('.pgx-ht .muted', r);
  const first = { sc:sc.innerHTML, title:title.textContent, sub:sub.textContent, no:no.textContent };
  const boxes = () => $$('.pgx-o input', sc);
  // the card fits what it holds at every moment, in every style (grow(), never a kept height: owner, 17 and 18 Nov). Clean
  // (owner, 18 Nov) has its own touches:
  // the count on Allow rolls, the answer gets a summary line in the foot strip, and the done mark is a tick that draws.
  // Soft and Blueprint keep theirs
  const ds = r.closest('[data-style]'), clean = !!ds && ds.dataset.style === 'clean';
  // grow() starts once the card's entrance (which scales it from .98) has ended, so it measures the card at its real size
  Promise.resolve().then(() => Promise.all(root.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && root.isConnected) c.offs.push(grow(root)); });
  // where a result row goes: in the card, or in grow()'s wrapper inside it
  const into = () => $(':scope>.dm-grow', root) || root;
  // how long: This task, Today or Always, from the dropdown in the footer
  let dur = 'This task';
  const span = () => dur === 'Always' ? 'always' : 'for ' + dur.toLowerCase();
  const word = n => n > 1 ? 'scopes' : 'scope';
  // Clean's Allow: its number in a window of its own, so a new count rolls in (up as a box is ticked, down as one clears)
  const label = n => n ? `<span class="pgx-l">Allow <span class="pgx-cnt"><i>${n}</i></span> <span class="pgx-w">${word(n)}</span></span>` : 'Pick a scope';
  let shown = 0;
  const roll = (cnt, n, up) => { const old = cnt.lastElementChild, nu = document.createElement('i'); nu.textContent = n; nu.className = up ? 'iu' : 'id'; if (old){ old.className = up ? 'ou' : 'od'; setTimeout(() => old.remove(), REDUCE ? 0 : 300); } cnt.appendChild(nu); };
  // Clean asks again for its one scope as a plain row (nothing to tick), and its button just says Allow
  const one = () => $('.pgx-o.one', sc);
  const count = () => { if (one()){ ok.disabled = false; shown = 0; return swap(ok, 'Allow'); }
    const n = boxes().filter(b => b.checked).length; ok.disabled = !n;
    if (!clean) return swap(ok, n ? 'Allow ' + n + (n > 1 ? ' scopes' : ' scope') : 'Pick a scope');
    const cnt = $('.pgx-cnt', ok);
    if (n && shown && cnt && !ok._sw){ if (n !== shown){ roll(cnt, n, n > shown); swap($('.pgx-w', ok), word(n)); } }
    else swap(ok, label(n), true);
    shown = n; };
  if (clean){ shown = boxes().filter(b => b.checked).length; ok.innerHTML = label(shown); }
  c.on(sc, 'change', count);
  $$('.pgx-pop .mi', r).forEach(m => m.addEventListener('click', () => { dur = m.dataset.v; $$('.pgx-pop .mi', r).forEach(x => x.setAttribute('aria-checked', x === m)); swap($('.pgx-dv', r), dur === 'Always' ? 'Always' : 'For ' + dur.toLowerCase()); }));
  const body = [sc, $('.pgx-f', r)];
  // the scopes give way to a shorter result row, and the card eases to its height (grow())
  const show = on => { body.forEach(e => e.hidden = !on); if (on) stagger(body, 50); };
  // Clean's summary line in the foot strip: the scopes you allowed, by name, or how many on a narrow stage
  let names = [];
  const sum = (el, text, short = text) => { if (!clean) return; const s = el.appendChild(html(`<span class="pgx-sum"><span class="l"></span><span class="s"></span></span>`)); s.firstChild.textContent = text; s.lastChild.textContent = short; };
  // the frames the agent edits once it may. Plan toggle is a library component, so editing it needs Publish library
  const F = ['Hero', 'Plan cards', 'Compare table', 'FAQ', 'Plan toggle', 'Checkout summary'], LIB = 4;
  let granted = 0, publish = false, skip = false, done = 0, run = 0, panel = null;
  function row(){
    panel = html(`<div class="pgx-done run"><span class="g"><span class="spin"></span></span><span class="t"><b class="pgx-a"></b><span class="pgx-d"></span></span><button class="pill ghost sm">Revoke</button></div>`);
    sum(panel, names.join(', '), `${names.length} ${word(names.length)} allowed`);
    into().appendChild(panel); enter(panel); $('button', panel).onclick = revoke;
  }
  // the agent works through the frames under what it was given, and stops to ask when it reaches one it may not touch
  function work(){
    const id = ++run; if (!panel) row();
    const a = $('.pgx-a', panel), d = $('.pgx-d', panel);
    swap(a, `Allowed ${granted} ${granted > 1 ? 'scopes' : 'scope'} ${span()}`);
    c.run(async () => {
      while (done < F.length){
        if (done === LIB && !publish && !skip) return ask();
        swap(d, done === LIB && skip ? `Skipping ${F[done]}` : `Editing ${F[done]} · ${done + 1} of ${F.length}`);
        await c.wait(900); if (run !== id) return;
        done++;
      }
      panel.classList.replace('run', 'ok'); const g = $('.g', panel); g.innerHTML = clean ? I('check') : I('ok'); enter(g);
      swap(a, skip ? `Done. ${F.length - 1} frames edited` : `Done. ${F.length} frames edited`);
      swap(d, skip ? 'On a new page. Plan toggle skipped' : 'On a new page. Plan toggle published');
    });
  }
  // asks again, for only the scope it now needs
  function ask(){
    const p = panel; panel = null; p.classList.add('leave');
    root.classList.add('esc'); swap(title, 'Also allow Publish library?'); swap(sub, `${F[LIB]}, frame ${LIB + 1} of ${F.length}, is a library component`);
    c.later(300, () => {
      p.remove();
      sc.innerHTML = clean
        ? `<div class="pgx-o one" data-k="publish"><span class="oi">${I('upload')}</span><span class="t">Publish library<span class="d">Updates Checkout, Marketing site, Email kit and Docs</span></span><span class="tag warn">Risky</span></div>`
        : `<label class="pgx-o" data-k="publish"><input type="checkbox" checked><span class="bx">${I('check','xs')}</span><span class="t">Publish library<span class="d">Updates Checkout, Marketing site, Email kit and Docs</span></span><span class="tag warn">Risky</span></label>`;
      no.textContent = 'Skip this frame'; count(); show(true);
    });
  }
  function reset(){
    run++; granted = done = 0; publish = skip = false; names = [];
    root.classList.remove('esc'); sc.innerHTML = first.sc; swap(title, first.title); swap(sub, first.sub); no.textContent = first.no; count();
  }
  function revoke(){ const p = panel; panel = null; run++; p.classList.add('leave'); c.later(300, () => { p.remove(); reset(); show(true); }); }
  ok.onclick = () => c.run(async () => {
    const picked = one() ? [one()] : boxes().filter(b => b.checked).map(b => b.closest('.pgx-o')); if (!picked.length) return;
    granted += picked.length; if (picked.some(o => o.dataset.k === 'publish')) publish = true;
    names.push(...picked.map(o => $('.t', o).firstChild.textContent));
    ok.innerHTML = '<span class="spin"></span>'; await c.wait(500);
    // Clean: the scopes fade up and out before the card eases to the result row's height
    if (clean){ sc.classList.add('leave'); await c.wait(180); sc.classList.remove('leave'); }
    show(false);
    if (root.classList.contains('esc')){ root.classList.remove('esc'); swap(title, first.title); swap(sub, first.sub); }
    // placed inside another component (Agent harness), it reports back without the run
    if (!c.card){ row(); swap($('.pgx-a', panel), `Allowed ${granted} ${granted > 1 ? 'scopes' : 'scope'} ${span()}`); swap($('.pgx-d', panel), 'Applying the pricing fixes now');
      c.later(1400, () => { if (!panel) return; panel.classList.replace('run', 'ok'); $('.g', panel).innerHTML = clean ? I('check') : I('ok'); swap($('.pgx-d', panel), 'Done. 6 frames edited on a new page'); }); return; }
    work();
  });
  no.onclick = () => {
    if (root.classList.contains('esc')){ skip = true; show(false); root.classList.remove('esc'); swap(title, first.title); swap(sub, first.sub); work(); return; }
    show(false); const d = html(`<div class="pgx-done" style="background:var(--chip)">${I('info')}<span class="t">The agent will skip the Figma edits<span>It will list the fixes in chat instead</span></span><button class="pill ghost sm">Undo</button></div>`);
    sum(d, 'Nothing allowed in Figma'); into().appendChild(d); enter(d); $('button', d).onclick = () => { d.remove(); show(true); };
  };
  // the preview's story: hold back the risky scope, allow the rest, then grant it when the agent needs it for one frame
  c.story(async s => {
    await s.beat(3);
    const pub = $('[data-k="publish"]', sc);
    // Clean ticks the box the way a visitor would, without the browser's own input event, which reads as the visitor taking
    // over and stopped the story after its first tick
    const tick = async el => {
      if (!clean) return s.tap(el);
      await s.point(el, false); const h = $('.hand', c.st); if (h){ h.classList.remove('down'); void h.offsetWidth; h.classList.add('down'); }
      await s.beat(.32); const i = $('input', el); i.checked = !i.checked; i.dispatchEvent(new Event('change', { bubbles:true }));
      c.later(340, () => h && h.classList.remove('down'));
    };
    await tick(pub); await s.beat(1);
    await s.point($('.tag', pub)); await s.beat(3);
    await tick(pub); await s.beat(2);
    await s.tap(ok); s.away();
    await s.until(() => root.classList.contains('esc') && !sc.hidden);
    await s.beat(4);
    await s.tap(ok); s.away();
    await s.until(() => panel && panel.classList.contains('ok'));
  });
});
/* ---------- the sections' components, loaded the first time a section comes near (DEF_PARTS in build.js) ---------- */
const PARTS = {"files":{"s-status":"/assets/v2-status.410783ca6b.js","s-product":"/assets/v2-product.c6072ab581.js","s-review":"/assets/v2-review.c0bf5d98c9.js","s-data":"/assets/v2-data.ef15935ec3.js","s-workspace":"/assets/v2-workspace.d0cd114b57.js","s-harness":"/assets/v2-harness.d27666f9a8.js","s-charts":"/assets/v2-charts.638bdaa8d9.js","s-dates":"/assets/v2-dates.b72ddce6b1.js","s-forms":"/assets/v2-forms.1157041b0f.js","s-collab":"/assets/v2-collab.257770798d.js"},"of":{"status-pill":"s-status","step-loader":"s-status","thinking-states":"s-status","reasoning-trail":"s-status","thinking":"s-status","context-meter":"s-status","toast":"s-status","toast-stack":"s-status","pricing-cards":"s-product","stepper":"s-product","set-limit":"s-product","currency-converter":"s-product","agent-run-timeline":"s-status","decision-prompt":"s-review","proposal-card":"s-review","rewrite-toolbar":"s-review","plan-review":"s-review","inline-text-diff":"s-review","draft-review":"s-review","eval-results":"s-review","source-stack":"s-data","metric-insight":"s-data","task-table":"s-data","terminal-stream":"s-data","details-panel":"s-data","citation-hover":"s-data","workspace-rail":"s-workspace","command-palette":"s-workspace","agent-settings":"s-workspace","file-explorer":"s-workspace","automation-canvas":"s-workspace","canvas-toolbar":"s-workspace","data-picker":"s-workspace","run-drawer":"s-workspace","memory-panel":"s-workspace","tool-connections":"s-workspace","knowledge-sources":"s-workspace","scheduled-runs":"s-workspace","harness":"s-harness","line-chart":"s-charts","bar-chart":"s-charts","donut-chart":"s-charts","funnel":"s-charts","top-pages":"s-charts","health-score":"s-charts","activity-heatmap":"s-charts","stat-cards":"s-charts","account-table":"s-charts","date-picker":"s-dates","segmented-control":"s-dates","date-range-picker":"s-dates","event-calendar":"s-dates","agenda":"s-dates","meeting-card":"s-dates","buttons":"s-forms","badge":"s-forms","tooltip":"s-forms","search-input":"s-forms","country-select":"s-forms","multi-select":"s-forms","social-signin":"s-forms","sign-in":"s-forms","otp-field":"s-forms","form":"s-forms","payment-form":"s-forms","comments":"s-collab","notifications":"s-collab","banner":"s-collab","invite":"s-collab","reactions":"s-collab","profile-menu":"s-collab","context-switcher":"s-collab","filter-menu":"s-collab","number-field":"s-collab","ticket-list":"s-collab","kanban":"s-collab","context-menu":"s-collab","progress":"s-forms","radar-chart":"s-charts","radial-goals":"s-charts","scatter-chart":"s-charts","score-breakdown":"s-charts","slider":"s-forms","carousel":"s-forms","web-search":"s-status"},"all":["harness"]};
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
// a page left open across a deploy names section files the new build no longer has (they are named by their content), so
// a 404 reloads the page once to pick up the current build, where the browser keeps the scroll position
const stale = () => { try { const k = 'dm-stale-reload', at = +sessionStorage.getItem(k) || 0; if (Date.now() - at < 60000) return false; sessionStorage.setItem(k, Date.now()); } catch (e) { return false; } location.reload(); return true; };
const loadPart = k => partsLoading[k] || (partsLoading[k] = fetch(PARTS.files[k]).then(r => { if (r.status === 404 && stale()) return new Promise(() => {}); if (!r.ok) throw new Error(r.status + ' ' + PARTS.files[k]); return r.text(); })
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
    if (hasDefs(comp.dataset.v2)) go(); else needDefs(comp.dataset.v2).then(() => { const n = $('.dm-lf', comp); if (n) n.remove(); go(); }, e => { console.warn('designme: components not loaded', e); if (comp._c) return; waiting.add(comp);
      // never an empty stage: say so, with a way to try again
      const st = $('.stage-inner', comp); if (st && !$('.dm-lf', st)){ const n = document.createElement('div'); n.className = 'dm-lf'; n.innerHTML = '<span>This component didn\'t load.</span><button type="button">Try again</button>'; $('button', n).onclick = () => mount(comp, true); st.appendChild(n); } });
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
