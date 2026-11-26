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
// a person's avatar: their initials on their colour. pic names the photo designme.dev's own pages lay over it; an installed
// component shows the initials
const AV = (n, bg, pic) => `<span class="av" style="background:${bg}${/^var\(--av-[a-z]\)$/.test(bg) ? ';color:' + bg.replace(')', '-ink)') : ''}"${pic ? ` data-pic="${pic}"` : ''}>${n}</span>`;
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
  // (words marked .mx-w ease their box to the new width as they arrive: mxWidth())
  const s = el._sw = { v:html, h:!!isHTML, t:setTimeout(() => { if (el._sw !== s) return; el._sw = null; const w0 = !REDUCE && el.classList.contains('mx-w') ? el.offsetWidth : 0;
    isHTML ? el.innerHTML = html : el.textContent = html; el.classList.remove('out'); if (w0) mxWidth(el, w0); }, REDUCE ? 0 : 170) };
}
function tween(from, to, ms, step, ease = t => 1 - Math.pow(1 - t, 3)){
  return new Promise(res => { const t0 = performance.now(); const f = t => { const p = Math.max(0, Math.min(1, (t - t0) / (REDUCE ? 1 : ms))); step(from + (to - from) * ease(p), p); p < 1 ? requestAnimationFrame(f) : res(); }; requestAnimationFrame(f); });
}
// the entrance plays once: its class goes when it ends, so moving the element later (a sort re-appending a row) doesn't play it again
function enter(el, delay = 0){ if (!el) return el; el.classList.remove('enter'); void el.offsetWidth; el.style.animationDelay = delay + 'ms'; el.classList.add('enter');
  const end = e => { if (e.target !== el || e.animationName !== 'enter') return; el.classList.remove('enter'); el.removeEventListener('animationend', end); el.removeEventListener('animationcancel', end); };
  el.addEventListener('animationend', end); el.addEventListener('animationcancel', end); return el; }
function stagger(els, step = 60, base = 0){ els.forEach((e, i) => enter(e, base + i * step)); }
/* ---------- motion pieces (owner's trial, 26 Nov; the CSS's "motion pieces" says what each is for) ---------- */
// a motion token on el: a time in ms or a length in px when d is a number, else the value as written
const mxT = (el, k, d) => { const v = getComputedStyle(el).getPropertyValue(k).trim(); if (!v) return d; return typeof d === 'number' ? parseFloat(v) * (/ms$/.test(v) ? 1 : /s$/.test(v) ? 1000 : 1) : v; };
/* mxIn(): content just drawn arrives: it fades and rises a few px (o.y) out of a short blur (--blur-in; none in Blueprint and
   Clean), one piece after another (o.step, the style's --mx-step); o.x brings it in from the side instead (the next question).
   With reduced motion it only fades. mxOut(): content about to go leaves the same way, quicker (--t-out), upwards or to o.x;
   it stays gone until it is replaced or brought back with mxIn(). Both return a promise for the end, and either cancels the
   other on the same element */
function mxMove(els, o, out){
  els = [].concat(els).filter(e => e && e.isConnected && e.animate); if (!els.length) return Promise.resolve();
  const e0 = els[0], b = mxT(e0, '--blur-in', 0) * (o.blur ?? .7), E = out ? 'cubic-bezier(.4,0,1,1)' : mxT(e0, o.spring ? '--ease-spring' : '--ease', 'ease');
  const ms = o.ms || mxT(e0, out ? '--t-out' : '--t-in', out ? 160 : 360), step = o.step ?? (out ? 0 : mxT(e0, '--mx-step', 24));
  const away = REDUCE ? { opacity:0 } : { opacity:0, translate:o.x ? `${o.x}px 0` : `0 ${o.y ?? (out ? -4 : 4)}px`, filter:b ? `blur(${b}px)` : 'none' };
  const here = REDUCE ? { opacity:1 } : { opacity:1, translate:'0 0', filter:b ? 'blur(0px)' : 'none' };
  return Promise.all(els.map((el, i) => { (el._mx || []).forEach(a => a.cancel());
    const a = el.animate(out ? [here, away] : [away, here], { duration:REDUCE ? 140 : ms, delay:(o.base || 0) + i * step, easing:REDUCE ? 'linear' : E, fill:out ? 'forwards' : 'backwards' });
    el._mx = [a]; return a.finished.catch(() => {}); }));
}
const mxIn = (els, o = {}) => mxMove(els, o, false), mxOut = (els, o = {}) => mxMove(els, o, true);
/* iconSwap(): an icon that changes, inside an .mx-ic control, goes out small and soft and the new one comes back with a little
   spring (--ic-scale, --blur-ic, --ease-pop; with reduced motion only a fade). change() makes the change: a new href, new
   markup. o.inner animates el's first child rather than el (a tile that keeps its fill while its glyph changes). Elsewhere the
   change is made at once, as before. A change asked for while one is under way lands first, so the newest always wins */
function iconSwap(el, change, o = {}){
  if (!el || !el.animate || !el.closest('.mx-ic') || !el.isConnected){ change(); return; }
  if (el._icGo) el._icGo();
  (el._ic || []).forEach(a => a.cancel());
  const pick = () => (o.inner ? el.firstElementChild : el) || el, k = mxT(el, '--ic-scale', .6), b = mxT(el, '--blur-ic', 0);
  const off = REDUCE ? { opacity:0 } : { opacity:0, scale:String(k), filter:b ? `blur(${b}px)` : 'none' }, on = REDUCE ? { opacity:1 } : { opacity:1, scale:'1', filter:b ? 'blur(0px)' : 'none' };
  let done = false; const go = el._icGo = () => { if (done) return; done = true; el._icGo = null; change(); };
  const t = pick(), a = t.animate([on, off], { duration:REDUCE ? 70 : 90, easing:'cubic-bezier(.4,0,1,1)', fill:'forwards' });
  el._ic = [a];
  a.onfinish = () => { go(); const n = pick(); if (!n.isConnected) return; const i = n.animate([off, on], { duration:REDUCE ? 120 : mxT(el, '--t-in', 360) * .8, easing:REDUCE ? 'linear' : mxT(el, '--ease-pop', 'ease') }); a.cancel(); el._ic = [i]; };
  a.oncancel = go;
}
// mxWidth(): an .mx-w element whose words just changed eases from the width it had (w0) to its new one, its spill clipped meanwhile
function mxWidth(el, w0){
  if (el._mw) el._mw.cancel();
  const w1 = el.offsetWidth; if (Math.abs(w1 - w0) < 1 || !el.animate) return;
  el.style.overflow = 'clip';
  const a = el._mw = el.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:mxT(el, '--t-in', 360), easing:mxT(el, '--ease-spring', 'ease') });
  a.onfinish = a.oncancel = () => { if (el._mw === a){ el._mw = null; el.style.overflow = ''; } };
}
/* reflow(): a list that changes under a filter, a search or a sort. The change happens at once, in change(); this only
   shows it. items() gives the list's items, each known by its o.by attribute (data-key by default). The items that stay
   glide from where they were to where they are now, new ones fade in from 4px down, and the ones that went fade out where
   they were, as a copy that takes no room and can't be reached. A change made while the last one is still moving starts
   from where everything is on screen, so quick clicks never stack or leave anything halfway. Transform and opacity only,
   at the style's own pace (--t-fast, --ease); with reduced motion it is only the change.
   An item the change hides counts as gone. Only items that don't sit inside one another can be listed (a group and its own
   rows would glide twice).
   o: { by, root (the component, which places are measured against), enter:false (new items come in some other way),
   leave:false (items that go fade some other way), host (where a copy goes when the change redrew the item's own parent),
   blur:true (new items also come out of a short blur, half the style's --blur-in, and items that go fade in half the time:
   a motion piece, owner's trial of 26 Nov) } */
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
  const B = o.blur ? (parseFloat(cs.getPropertyValue('--blur-in')) || 0) / 2 : 0, IN = B ? [{ opacity:0, transform:'translateY(4px)', filter:`blur(${B}px)` }, { opacity:1, transform:'none', filter:'blur(0px)' }] : [{ opacity:0, transform:'translateY(4px)' }, { opacity:1, transform:'none' }];
  let n = 0;
  for (const el of now){
    const k = el.getAttribute(by), a = was.get(k);
    (el._rf || []).forEach(x => x.cancel()); el._rf = [];
    const b = el.getBoundingClientRect(); if (!b.width && !b.height) continue;
    seen.add(k);
    if (!a){ if (o.enter !== false) el._rf.push(el.animate(IN, { duration:T, delay:Math.min(n++, 5) * 24, easing:E, fill:'backwards' })); continue; }
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
    // (with o.blur a row that goes leaves quicker and softly, so a row gliding into its place never reads over it)
    const f = g.animate(B ? [{ opacity:a.o, filter:'blur(0px)' }, { opacity:0, filter:`blur(${B}px)` }] : [{ opacity:a.o }, { opacity:0 }], { duration:T * (o.blur ? .45 : .8), easing:E, fill:'forwards' });
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
/* hoverGlide(): Clean's one hover in a menu or a list (owner, 21 Nov): a single highlight that glides from row to row as the
   pointer moves, and fades in as the pointer enters the list and out as it leaves. It follows the keyboard too: the row with
   the focus (:focus-visible) and the row the arrows are on (o.hl, .hl by default). It is the list's own ::before (or its ::after
   when that one is taken), placed by CSS variables (--hg-x, --hg-y, --hg-w, --hg-h and the row's own corners, --hg-r) and
   drawn under the rows, so it adds no element and every :first-child and :last-child rule stays as it is. It eases over
   Clean's 220ms with its ease; with reduced motion it only fades. Only Clean draws it (the CSS); there the rows' own hover
   fills give way to it, while a picked row (o.keep) keeps its stronger --row-on fill over it. rows is a selector for the list's
   rows. Returns a function that stops it */
function hoverGlide(list, rows = '.mi', o = {}){
  if (!list) return () => {};
  if (list._hg) return list._hg;
  const free = p => { const v = getComputedStyle(list, p).content; return !v || v === 'none' || v === 'normal'; };
  const side = free('::before') ? 'b' : free('::after') ? 'a' : ''; if (!side) return () => {};
  const hl = o.hl || '.hl', keep = o.keep || '[aria-selected="true"],[aria-checked="true"],[aria-current]:not([aria-current="false"])';
  list.dataset.hg = side; list.classList.add('hg'); if (getComputedStyle(list).position === 'static') list.classList.add('hg-pos');
  const all = () => $$(rows, list).filter(r => !r.hasAttribute('data-ghost'));
  const ok = r => r && r.isConnected && list.contains(r) && !r.disabled && r.getAttribute('aria-disabled') !== 'true' && r.getClientRects().length;
  // the rows' own fills give way to the glide, all but a picked one
  const mark = () => all().forEach(r => { const v = r.matches(keep) ? 'k' : ''; if (r.dataset.hgr !== v) r.dataset.hgr = v; });
  // where a row sits in the list, from the layout (offsetLeft and offsetTop), so a menu still scaling in is measured as it will
  // be; a list that scrolls carries the highlight with its rows
  const off = r => { let x = 0, y = 0, e = r;
    while (e && e !== list){ x += e.offsetLeft; y += e.offsetTop; const p = e.offsetParent; if (!p || !(p === list || list.contains(p))){ const a = r.getBoundingClientRect(), b = list.getBoundingClientRect(); return [a.left - b.left - list.clientLeft + list.scrollLeft, a.top - b.top - list.clientTop + list.scrollTop]; } if (p !== list){ x += p.clientLeft; y += p.clientTop; } e = p; }
    return [x, y]; };
  let at = null, on = false, gone = -1e9, over = false;
  const set = (k, v) => list.style.setProperty('--hg-' + k, v);
  const show = r => {
    if (!ok(r)) r = null;
    if (!r){ if (on){ on = false; gone = performance.now(); set('o', '0'); } at = null; return; }
    // coming back from hidden it starts where the row is; a quick return while it still fades glides on from where it was
    const jump = !on && performance.now() - gone > 200, [x, y] = off(r);
    if (jump) list.classList.add('hg-jump');
    set('x', x + 'px'); set('y', y + 'px'); set('w', r.offsetWidth + 'px'); set('h', r.offsetHeight + 'px'); set('r', getComputedStyle(r).borderRadius); set('o', '1');
    if (jump){ void getComputedStyle(list, side === 'b' ? '::before' : '::after').transform; requestAnimationFrame(() => list.classList.remove('hg-jump')); }
    // (a new row is watched for its size; watching starts with one report, which only places it again)
    if (ro && r !== at){ ro.disconnect(); ro.observe(list); ro.observe(r); }
    at = r; on = true;
  };
  // what it rests on when nothing new has moved it: the row under a mouse, the keyboard's row, then the arrows' row
  const rest = () => { const rs = all().filter(ok), f = document.activeElement;
    return (over && rs.find(r => r.matches(':hover'))) || (f && list.contains(f) && f.matches(':focus-visible') && rs.find(r => r.contains(f))) || rs.find(r => r.matches(hl)) || null; };
  const row = t => { const r = t && t.closest && t.closest(rows); return r && list.contains(r) ? r : null; };
  // (a demo's pointer, which has no type, moves it as a mouse does; a list inside this one, like a toolbar's group of tools,
  // has a glide of its own, so this one fades while the pointer is in it)
  const onOver = e => { if (e.pointerType && e.pointerType !== 'mouse') return; over = true; const r = row(e.target); if (r) show(r); else if (e.target.closest('.hg') !== list) show(null); };
  const onLeave = e => { if ((e.pointerType && e.pointerType !== 'mouse') || (e.relatedTarget && list.contains(e.relatedTarget))) return; over = false; show(rest()); };
  const onIn = e => { const r = row(e.target); if (r && e.target.matches(':focus-visible')) show(r); };
  const onOut = () => setTimeout(() => { if (list.isConnected && !list.contains(document.activeElement)) show(rest()); });
  list.addEventListener('pointerover', onOver); list.addEventListener('pointerout', onLeave);
  list.addEventListener('focusin', onIn); list.addEventListener('focusout', onOut);
  // rows drawn again (a search narrowing the list), a row the arrows move to, a row picked; and a menu that closes hides it
  const mo = new MutationObserver(ms => {
    ms = ms.filter(m => m.target !== list || m.type !== 'attributes'); if (!ms.length) return;
    mark(); let to;
    for (const m of ms) if (m.type === 'attributes' && m.attributeName === 'class' && m.target.matches && m.target.matches(rows) && m.target.matches(hl)) to = m.target;
    if (to) show(to); else if (!at || !ok(at) || !(over || at.matches(hl) || at.contains(document.activeElement))) show(rest()); else show(at);
  });
  mo.observe(list, { childList:true, subtree:true, attributes:true, attributeFilter:['class', 'aria-selected', 'aria-checked', 'aria-current', 'aria-disabled', 'disabled', 'hidden'] });
  const pop = list.closest('.pop'), po = pop && new MutationObserver(() => { if (!pop.classList.contains('open')){ over = false; on = false; gone = -1e9; set('o', '0'); at = null; } });
  if (po) po.observe(pop, { attributes:true, attributeFilter:['class'] });
  const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => { if (at) show(at); }) : null;
  if (ro) ro.observe(list);
  mark(); show(rest());
  // (the menus' own catch-all below hands it the row a pointer or the keyboard has just reached)
  list._hgAt = (r, mouse) => { if (mouse) over = true; show(r); };
  return list._hg = () => { mo.disconnect(); po && po.disconnect(); ro && ro.disconnect();
    list.removeEventListener('pointerover', onOver); list.removeEventListener('pointerout', onLeave); list.removeEventListener('focusin', onIn); list.removeEventListener('focusout', onOut);
    list.classList.remove('hg', 'hg-pos', 'hg-jump'); delete list.dataset.hg; ['x', 'y', 'w', 'h', 'r', 'o'].forEach(k => list.style.removeProperty('--hg-' + k)); all().forEach(r => delete r.dataset.hgr); list._hg = null; list._hgAt = null; };
}
/* every menu's rows (.mi) glide in Clean: a menu takes its glide the first time a pointer or the keyboard reaches one of its rows
   (and as its component mounts), in the scrolling list its rows sit in, or the menu itself. Only the components' menus (in a
   card's stage) take it: the templates' own menus keep theirs. Kanban and Agent harness keep their menus as they are until
   their own Clean pass (Phase II, owner, 21 Nov) */
function menuGlide(mi){
  if (mi.closest('.kbx,.ahx')) return mi.parentElement;
  const m = mi.closest('.pop,[role="menu"],[role="listbox"]') || mi.parentElement;
  let box = m; for (let a = mi.parentElement; a && a !== m; a = a.parentElement){ const oy = getComputedStyle(a).overflowY; if (oy === 'auto' || oy === 'scroll'){ box = a; break; } }
  // (a row that asks again before it acts, like Delete, keeps its own fill)
  hoverGlide(box, '.mi', { keep:'[aria-selected="true"],[aria-checked="true"],[aria-current]:not([aria-current="false"]),.ask' }); return box;
}
['pointerover', 'focusin'].forEach(t => document.addEventListener(t, e => { const mi = e.target && e.target.closest && e.target.closest('.mi'); if (!mi || !mi.closest('.stage-in')) return; const box = menuGlide(mi);
  if (!box._hgAt) return; if (t === 'focusin'){ if (e.target.matches(':focus-visible')) box._hgAt(mi); } else if (e.pointerType === 'mouse') box._hgAt(mi, true); }, true));
/* cols(): a data table's columns, as in a spreadsheet (owner, 10 Nov; restated 21 Nov: "if we don't have the vertical lines,
   we don't even know this is a column"). Each table draws the lines between its columns in its own CSS; this makes the
   columns work:
   - resizing: a handle on each header's right edge (.col-rz, a separator), dragged, or ← and → by 16px while it has the
     focus; a double click gives every column its natural width back. No column goes under its min width; the last one takes
     what is left, and once the columns outgrow the box the table scrolls sideways in it (the table's own CSS lets its box
     scroll once it has a sized column, .cols-rz)
   - moving: drag a header sideways (its column is tinted, a line shows where it will land and its name follows the
     pointer), or Alt and ← → on a header or the button in it. Only the o.move columns move, among themselves; a drag never
     sorts, and a touch on a header scrolls the table as it did
   Rows added later (a sort, a filter, rows brought back) take the same order on their own. While o.wide() is false (a table
   drawn as a list of cards on a phone), every row keeps its own order and its natural widths.
   o: { lock:[indexes with no handle, like a checkbox], move:[indexes that move], min:{ index:px } (64 by default),
   wide:() => boolean, name:th => the column's name }. Returns a function that stops it */
function cols(table, o = {}){
  const head = table.tHead.rows[0], N = head.cells.length, lock = new Set(o.lock || []), mov = o.move || [], wide = o.wide || (() => true);
  const name = o.name || (th => th.textContent.trim()), min = ci => (o.min && o.min[ci]) || 64, ids = [...Array(N).keys()];
  const cg = document.createElement('colgroup'); cg.innerHTML = '<col>'.repeat(N); [...cg.children].forEach((c, i) => c.dataset.ci = i); table.prepend(cg);
  // every cell knows its column by data-ci, so a row can be put in any order and back
  const tag = r => { if (r.cells.length !== N || r.hasAttribute('data-ghost')) return false; [...r.cells].forEach((td, i) => { if (td.dataset.ci == null) td.dataset.ci = i; }); return true; };
  let order = [...ids], W = null, was = wide();
  const shown = () => (wide() ? order : ids);
  // a row already in order is left alone, so a press on a header isn't swallowed by its cell moving under it
  const place = (r, cells) => { const s = shown(); if (cells.every((c, i) => +c.dataset.ci === s[i])) return; const by = {}; cells.forEach(c => by[c.dataset.ci] = c); s.forEach(i => r.appendChild(by[i])); };
  const ths = () => [...head.cells], th = ci => head.querySelector(`:scope>[data-ci="${ci}"]`), px = ci => th(ci).getBoundingClientRect().width, last = () => shown()[N - 1];
  const apply = () => {
    [...table.rows].filter(tag).forEach(r => place(r, [...r.cells])); place(cg, [...cg.children]);
    const on = !!W && wide(); table.classList.toggle('cols-rz', on);
    [...cg.children].forEach(c => { const ci = +c.dataset.ci; c.style.width = on && ci !== last() ? Math.round(W[ci]) + 'px' : ''; });
    table.style.width = on ? `max(100%, ${Math.round(shown().slice(0, -1).reduce((a, ci) => a + W[ci], 0) + min(last()))}px)` : '';
    ths().forEach(h => { const g = h.querySelector(':scope>.col-rz'); if (g) g.setAttribute('aria-valuenow', Math.round(h.getBoundingClientRect().width)); });
  };
  ths().forEach((h, i) => { h.dataset.ci = i; if (lock.has(i)) return;
    h.insertAdjacentHTML('beforeend', `<span class="col-rz" role="separator" aria-orientation="vertical" tabindex="0" aria-valuemin="${min(i)}" aria-label="Resize ${name(h)}" data-tip="Drag to resize, double click to reset" data-rz="${i}"></span>`); });
  ths().forEach((h, i) => { if (mov.includes(i)) h.setAttribute('aria-keyshortcuts', 'Alt+ArrowLeft Alt+ArrowRight'); });
  // the widths as they are on screen, the first time one changes
  const measure = () => { if (W) return; W = {}; ids.forEach(ci => W[ci] = px(ci)); };
  // a column's new width, never under its own min
  const size = (ci, w) => { W[ci] = Math.max(min(ci), w); apply(); };
  const moveTo = (ci, at) => { const s = [...order], from = s.indexOf(ci); s.splice(from, 1); s.splice(at > from ? at - 1 : at, 0, ci); order = s; apply(); };
  let drag = null, dragged = false;
  const ghost = document.createElement('div'), bar = document.createElement('div'); ghost.className = 'col-ghost'; bar.className = 'col-at';
  const down = e => {
    const g = e.target.closest('.col-rz');
    if (g){ if (e.button || !wide()) return; e.preventDefault(); e.stopPropagation(); measure();
      const ci = +g.dataset.rz, x0 = e.clientX, w0 = W[ci]; g.setPointerCapture(e.pointerId); g.classList.add('on'); table.classList.add('cols-rzing');
      const mv = ev => size(ci, w0 + ev.clientX - x0);
      const up = () => { g.removeEventListener('pointermove', mv); g.removeEventListener('pointerup', up); g.removeEventListener('pointercancel', up); g.classList.remove('on'); table.classList.remove('cols-rzing'); };
      g.addEventListener('pointermove', mv); g.addEventListener('pointerup', up); g.addEventListener('pointercancel', up); return; }
    const h = e.target.closest('th'); if (!h || h.parentElement !== head || e.button || e.pointerType === 'touch' || !wide() || !mov.includes(+h.dataset.ci)) return;
    drag = { h, ci:+h.dataset.ci, x0:e.clientX, on:false };
  };
  const move = e => {
    if (!drag) return;
    if (!drag.on){ if (Math.abs(e.clientX - drag.x0) < 6) return; drag.on = true; hideTip(true); table.classList.add('cols-drag');
      [...table.rows].forEach(r => { const c = [...r.cells].find(x => +x.dataset.ci === drag.ci && r.cells.length === N); if (c) c.classList.add('col-mv'); });
      // they sit where the tooltip does, on the page in the components' style
      ghost.textContent = name(drag.h); (tip.parentElement || document.body).append(ghost, bar); }
    ghost.style.transform = `translate(${e.clientX + 12}px,${e.clientY - 14}px)`;
    // where it lands: the gap between two movable columns nearest the pointer
    const hs = ths(), m = hs.map((x, i) => ({ x, i })).filter(z => mov.includes(+z.x.dataset.ci)), tb = table.getBoundingClientRect();
    let at = m[m.length - 1].i + 1; for (const z of m){ const b = z.x.getBoundingClientRect(); if (e.clientX < b.left + b.width / 2){ at = z.i; break; } }
    drag.at = at; const x = at < N ? hs[at].getBoundingClientRect().left : tb.right;
    Object.assign(bar.style, { left:Math.round(x - 1) + 'px', top:Math.round(tb.top) + 'px', height:Math.round(tb.height) + 'px' });
  };
  const end = () => { if (!drag) return; const d = drag; drag = null; if (!d.on) return;
    dragged = true; setTimeout(() => dragged = false, 0); ghost.remove(); bar.remove(); table.classList.remove('cols-drag');
    table.querySelectorAll('.col-mv').forEach(c => c.classList.remove('col-mv')); moveTo(d.ci, d.at); };
  // the click a drag ends with never sorts, and a press on a handle never reaches the header's button
  const click = e => { if (e.target.closest('.col-rz') || (dragged && e.target.closest('thead'))){ e.stopPropagation(); e.preventDefault(); dragged = false; } };
  const dbl = e => { if (!e.target.closest('.col-rz')) return; W = null; apply(); };
  const key = e => {
    const g = e.target.closest('.col-rz');
    if (g && /^Arrow(Left|Right)$/.test(e.key) && !e.altKey){ if (!wide()) return; e.preventDefault(); e.stopPropagation(); measure(); const ci = +g.dataset.rz; size(ci, W[ci] + (e.key === 'ArrowRight' ? 16 : -16)); return; }
    const h = e.target.closest('th'); if (!h || h.parentElement !== head || !e.altKey || !/^Arrow(Left|Right)$/.test(e.key) || !wide()) return;
    const ci = +h.dataset.ci; if (!mov.includes(ci)) return; e.preventDefault(); e.stopPropagation();
    const slots = order.map((c, i) => mov.includes(c) ? i : -1).filter(i => i >= 0), p = slots.indexOf(order.indexOf(ci)) + (e.key === 'ArrowLeft' ? -1 : 1);
    if (p < 0 || p >= slots.length) return; const t = e.target; moveTo(ci, e.key === 'ArrowLeft' ? slots[p] : slots[p] + 1); t.focus({ preventScroll:true });
  };
  table.addEventListener('pointerdown', down); window.addEventListener('pointermove', move); window.addEventListener('pointerup', end); window.addEventListener('pointercancel', end);
  table.addEventListener('click', click, true); table.addEventListener('dblclick', dbl); table.addEventListener('keydown', key);
  // rows that arrive later take the order, and a table that turns into cards (or back) takes its own order (or the chosen one)
  const mo = new MutationObserver(() => apply()); [...table.tBodies].forEach(b => mo.observe(b, { childList:true }));
  const ro = new ResizeObserver(() => { const w = wide(); if (w !== was){ was = w; apply(); } }); ro.observe(table.parentElement);
  apply();
  return () => { mo.disconnect(); ro.disconnect(); ghost.remove(); bar.remove(); table.removeEventListener('pointerdown', down); window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', end); window.removeEventListener('pointercancel', end);
    table.removeEventListener('click', click, true); table.removeEventListener('dblclick', dbl); table.removeEventListener('keydown', key); };
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
   - .in on each slide that is at least 70% in view (for a style that marks it), and say(i) once the track settles on the
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
  // .in marks a slide once most of it is in view
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
    // "pop": a surface that is called up over the stage, like a command palette, drops in a little from above out of a blur as
    // it scales up (Soft; Blueprint and Clean keep their own entrance: a motion piece, owner's trial of 26 Nov)
    if (how === 'pop' && M === REVEAL.soft) go(root, [{ opacity:0, filter:`blur(${2 * mxT(root, '--blur-in', 0)}px)`, transform:'translateY(-10px) scale(.94)' }, { opacity:1, filter:'blur(0px)', offset:.6 }, { opacity:1, filter:'blur(0px)' }], 640, 0);
    else go(root, M.root, M.rootMs, 0);
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
  PLAYS:new Set(['status-pill','toast','step-loader','thinking','reasoning-trail','agent-lanes','agent-run-timeline','trace-view','agent-tree','terminal-stream','browser-session','attachment-tray','progress','web-search','thinking-states','run-drawer','live-answer','harness','response-versions','memory-panel','tool-connections','knowledge-sources','scheduled-runs','event-calendar','form','comments']),
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
    // its menus' rows glide in Clean (hoverGlide), from the start, so the arrows' row has it before a pointer comes by
    $$('.mi', st).forEach(mi => { if (!mi.closest('.hg')) menuGlide(mi); });
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
  // (in an .mx-ic control the copy icon and the tick crossfade, iconSwap())
  if (use) iconSwap(use.parentNode, () => use.setAttribute('href', '#v2i-check'));
  btn.classList.add('copied'); btn.dataset.tip = label; showTip(btn);
  st.t = setTimeout(() => {
    if (use) iconSwap(use.parentNode, () => use.setAttribute('href', st.href));
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
   A modifier on its own (Shift, Cmd, Ctrl, Alt: a screenshot shortcut, say) is not one, though the browser counts it, and
   nor is a key a demo plays (an untrusted event: another card's story pressing keys must not bring back a ring after a click) */
let byKey = false;
const MODS = new Set(['Shift', 'Meta', 'Control', 'Alt', 'AltGraph', 'CapsLock', 'Fn', 'OS']);
addEventListener('keydown', e => { if (!e.isTrusted || e.metaKey || e.ctrlKey || e.altKey || MODS.has(e.key)) return; byKey = true; const a = document.activeElement; if (a && a.dataset && 'nofv' in a.dataset) delete a.dataset.nofv; }, true);
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
  // lined up with the button's start (the default) or end, or centred under it (a picker wider than its field)
  const al = btn.dataset.popAlign;
  let x = br.left - hr.left; if (al === 'end') x = br.right - hr.left - pop.offsetWidth; else if (al === 'center') x = br.left - hr.left + (br.width - pop.offsetWidth) / 2;
  const cb = (btn.closest('.comp') || document.body).getBoundingClientRect(), lo = Math.max(0, cb.left) + 8, hi = Math.min(innerWidth, cb.right) - 8;
  x = Math.max(lo - hr.left, Math.min(x, hi - hr.left - pop.offsetWidth));
  pop.style.left = x + 'px';
  pop.style.top = up ? (br.top - hr.top - pop.offsetHeight - 6) + 'px' : (br.bottom - hr.top + 6) + 'px';
  pop.style.setProperty('--origin', (up ? 'bottom ' : 'top ') + (al === 'end' ? 'right' : al === 'center' ? 'center' : 'left'));
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
  // Clean's one hover glides from row to row, and the picked agent keeps its stronger fill (Agent harness keeps its own)
  if (!r.closest('.ahx')) c.offs.push(hoverGlide(tree, '.atr-b', { keep:'[aria-selected="true"]>.atr-b' }));
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
    n.el = html(`<div class="atr-n" role="treeitem" aria-level="${n.lv + 1}" aria-selected="false" tabindex="${n.lv ? -1 : 0}" data-id="${n.id}" data-s="${n.s}" style="--lv:${n.lv}"><div class="atr-b"><div class="atr-r"><span class="atr-g" data-m="${m}" aria-hidden="true">${atrMark(m)}</span>${who}<span class="atr-w"><span class="atr-tx"><span class="atr-nm"></span>${n.kids.length ? `<span class="atr-tg" aria-hidden="true">${I('chev-d', 'xs')}</span>` : ''}<span class="atr-sub"></span></span><span class="atr-q num"><span class="atr-c"></span></span></span></div></div></div>`);
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
    c.offs.push(hoverGlide(tree, '.atr-b', { keep:'[aria-selected="true"]>.atr-b' }));
    let M, L, head;
    const here = n => !n.late, under = n => n.kids.filter(here);
    function build(n){
      n.el = html(`<div class="atr-n" role="treeitem" aria-level="${n.lv + 1}" aria-selected="false" tabindex="${n.lv ? -1 : 0}" data-id="${n.id}" data-s="${n.s}" style="--lv:${n.lv};--k:var(--k${n.k})"><div class="atr-b"><div class="atr-r">${atrG(atrM(n))}${atrWho(n)}<span class="atr-w"><span class="atr-tx"><span class="atr-nm"></span>${n.kids.length ? `<span class="atr-tg" aria-hidden="true">${I('chev-d', 'xs')}</span>` : ''}<span class="atr-sub"></span></span><span class="atr-q num"><span class="atr-c"></span><i class="atr-ct-bar" aria-hidden="true"><span></span></i></span></span></div></div></div>`);
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
      // done: the head says it (its word, clock and total), so nothing is added under the tree (owner, 18 Nov)
      if (ev === 'end') sr.textContent = 'Run finished';
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
      // (the person in the demo may have taken the way on by then: the story only presses what is still there)
      const tapIf = async el => { if (el && el.isConnected) await s.tap(el); };
      await s.until(() => $('.atr-fix', r)); await s.beat(3); await tapIf($('.atr-fix', r)); s.away();
      await s.until(() => $('.atr-yes', r)); await s.beat(3); await tapIf($('.atr-yes', r)); s.away();
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
    <div class="atr-cm-say" aria-live="polite"><span></span></div>
    <ul class="atr-cm-key" aria-label="Agents"></ul>
  </div>`;
  function atrMap(r, c){
    const map = $('.atr-cm-map', r), crumb = $('.atr-cm-crumb', r), sayBox = $('.atr-cm-say', r), say = sayBox.firstElementChild, key = $('.atr-cm-key', r);
    let M, top, W = 0, shown = '', head;
    // each block's place and width, as shares of the branch on show; blocks outside it fade. The branch fills the first row,
    // its children the second and theirs the third, and each branch's own work (what it spends besides its children) closes
    // its row, hatched, so every row adds up
    function lay(){
      const base = top, total = Math.max(1e-6, M.sum(base)), gap = 4, pos = new Map(), own = new Map();
      pos.set(base, { x:0, w:1, lv:0 });
      let x = 0; base.kids.forEach(k => { const w = M.sum(k) / total; pos.set(k, { x, w, lv:1 }); let y = x; k.kids.forEach(g => { const gw = M.sum(k) ? g.cost / M.sum(k) * w : 0; pos.set(g, { x:y, w:gw, lv:2 }); y += gw; }); if (k.kids.length) own.set(k, { x:y, w:M.sum(k) ? k.cost / M.sum(k) * w : 0, lv:2 }); x += w; });
      own.set(base, { x, w:base.cost / total, lv:1 });
      // as many rows as the branch on show has levels
      map.style.setProperty('--rows', base.kids.some(k => k.kids.length) ? 3 : 2);
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
    // the line under the key opens when there is something to say and closes when there is not
    function tell(n){ const t = !n ? shown : (() => { const v = M.sum(n), share = v / Math.max(1e-6, M.sum(M.T)) * 100; return `<b>${n.n}</b> · ${atrMoney(v)}, ${share.toFixed(0)}% of the run${n.kids.length ? ` · its own ${atrMoney(n.cost)}` : ''}${n.lv ? ' · ' + atrWord[n.s] : ''}`; })();
      if (t) say.innerHTML = t; sayBox.classList.toggle('on', !!t); }
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
      key.innerHTML = M.T.kids.map(k => `<li>${atrG(k.s)}${atrWho(k)}<span class="atr-cm-kw"><span class="t">${k.n}</span><span class="p num"></span><span class="c num"></span></span></li>`).join('');
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
    function way(k, label, tip, run){ const b = html(`<button class="pill sm primary atr-x-fix" type="button">${label}</button>`); b.dataset.tip = tip; $('.atr-cm-kw', k.li).after(b); b.onclick = () => { b.remove(); run(); }; }
    M = atrModel(c, (ev, n, k) => {
      if (ev === 'state' || ev === 'join'){ n.b.dataset.s = n.s; mark($('.atr-g', n.b), atrM(n)); if (n.lv === 1) mark($('.atr-g', n.li), n.s); }
      if (ev === 'ask' && k === 'fix'){ way(n.parent, 'Fix', 'Use accent.500', () => M.fix && M.fix()); shown = `<b>${n.n}</b> failed: accent.600 is not in the library`; tell(null); }
      if (ev === 'ask' && k === 'ok'){ way(n.parent, 'Approve', 'Post the blurbs to #pricing', () => M.ok && M.ok()); shown = `<b>${n.n}</b> needs your OK`; tell(null); }
      // a way on the demo took goes, and so does what it said
      if (ev === 'state' && n.lv === 2 && (n.dim || n.s === 'done')){ const b = $('.atr-x-fix', n.parent.li); if (b) b.remove(); shown = ''; tell(null); }
      // done: the head says it, and the key shows where the money went, so the line says nothing more (owner, 18 Nov)
      if (ev === 'end'){ shown = ''; tell(null); }
      paint(ev !== 'tick');
    });
    top = M.T; blocks(); legend(); crumbs(); head = atrHead(r, M); paint(true);
    // the person in the demo: reads the design agent's block, takes the fix, zooms into the design agent and back out, then
    // approves the post
    c.story(async s => {
      await s.beat(4); await s.point(M.by('des').b); tell(M.by('des')); await s.beat(3); s.away(); tell(null);
      await s.until(() => $('.atr-x-fix', key)); await s.beat(3);
      // (the person in the demo may have taken the way on by then: the story only presses what is still there)
      const tapIf = async el => { if (el && el.isConnected) await s.tap(el); };
      await tapIf($('.atr-x-fix', key)); s.away(); await s.beat(2);
      await s.tap(M.by('des').b); s.away(); await s.beat(4);
      await s.tap($('button', crumb)); s.away();
      await s.until(() => $('.atr-x-fix', key)); await s.beat(3); await tapIf($('.atr-x-fix', key)); s.away();
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
  // Clean's one hover: a highlight that glides from row to row (hoverGlide)
  c.offs.push(hoverGlide($('.aib', r), '.aib-i', { keep:'.mv' }));
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
  // Clean's one hover glides from span to span; an open span keeps its stronger fill
  if (!r.closest('.ahx')) c.offs.push(hoverGlide(rows, '.trv-r', { keep:'[aria-expanded="true"]' }));
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
      <div class="trv-kv"><div><span>Kind</span><b>${kind}</b></div><div><span>Starts at</span><b class="num">${sec(x.s)}</b></div><div><span>Latency</span><b class="num trv-lt"></b></div><div><span>Tokens</span><b class="num trv-tn"></b></div></div>
      <div class="trv-io"><span>Input</span><code>${x.in}</code><span>Output</span><code class="out"></code></div>`;
    // closing hands focus back to the span, if it was inside the details
    $('.trv-x', dc).onclick = () => { const el = sel.el, back = dc.contains(document.activeElement); open(null); if (back) el.focus({ preventScroll:true }); };
    fill(); enter(dc);
  }
  function fill(){
    const x = sel, done = T >= x.s + x.d;
    $('.trv-lt', dc).textContent = sec(took(x)); $('.trv-tn', dc).textContent = Math.round(used(x)).toLocaleString('en-US'); $('.trv-pos i', dc).style.width = (took(x) / SPAN * 100) + '%';
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
  // the button is as wide as its words and eases to its new width when they change, keeping no room for a longer one (owner, 18 Nov)
  const easeW = el => { let w = 0, busy = null; const ro = new ResizeObserver(() => { if (busy) return; const w1 = el.getBoundingClientRect().width;
    if (!REDUCE && w && Math.abs(w1 - w) > .5){ busy = el.animate([{ width:w + 'px' }, { width:w1 + 'px' }], { duration:340, easing:'cubic-bezier(.23,1,.32,1)' }); busy.finished.catch(() => {}).then(() => { busy = null; w = el.getBoundingClientRect().width; }); } w = w1; });
    ro.observe(el); c.offs.push(() => ro.disconnect()); };
  easeW(go);
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
    running = true; status('Running', 'b'); swap(gl(), 'Stop'); go.className = 'pill line sm rc-go'; fill.style.background = 'var(--accent-mark,var(--accent))';
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
  // Pause all is the white outlined secondary (owner, 23 Nov); inside Agent harness (Phase II) it keeps its grey one for now
  if (r.closest('.ahx')) pb.classList.replace('line', 'soft');
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
    <div class="aln-sw-h"><div class="aln-sw-ht"><b class="aln-sw-tt">3 agents working</b><span class="aln-sw-st num">0:00 of 0:12</span></div><span class="aln-sw-key" aria-hidden="true"><span><i class="next"></i>Next</span><span><i class="run"></i>Working</span><span><i class="done"></i>Done</span><span><i class="wait"></i>Waiting</span></span><button class="pill line sm aln-sw-pause" type="button">${I('pause','xs')}Pause</button></div>
    <div class="aln-sw-grid">
      <div class="aln-sw-ax num" aria-hidden="true"><span class="aln-sw-ticks"></span></div>
      <div class="aln-sw-rows"></div>
      <div class="aln-sw-ph" role="slider" tabindex="0" aria-label="Time in the run" aria-valuemin="0" aria-valuemax="12" aria-valuenow="0" aria-valuetext="0 seconds"><i></i><span class="aln-sw-now num">0:00</span></div>
    </div>
    <div class="aln-sw-f"><span class="aln-sw-say" aria-live="polite">Researcher starts on the pricing pages</span><button class="pill line sm aln-sw-live" type="button" hidden>Back to now</button></div>
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
    let W = 0, CW = 0, RB = 0, T = 0, V = null, paused = false, fin = false, said = '', TX = [];
    // the axis labels' spans, read with the lane: the one the playhead's time passes over steps aside (Clean)
    const ax = $('.aln-sw-ax', r), tks = $$('.aln-sw-ticks span', r);
    const lay = () => { const ln = $('.aln-sw-lane', A[0].el); W = ln.clientWidth; RB = parseFloat(getComputedStyle(ln).borderRightWidth) || 0; CW = now.offsetWidth; const a = ax.getBoundingClientRect().left; TX = tks.map(el => { const b = el.getBoundingClientRect(); return [b.left - a, b.right - a]; }); paint(); };
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
      const x = v / ALN_END * W, nx = Math.max(-6, Math.min(W - CW + Math.min(6, RB), x - CW / 2)); line.style.transform = `translateX(${x.toFixed(1)}px)`;
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

  const alnCrewTpl = () => `<div class="aln-cw"><div class="aln-cw-h"><span class="aln-cw-ic">${I('users')}</span><span class="aln-cw-hx"><b class="aln-cw-tt">3 agents working</b><span class="aln-cw-sum num">0:00 · 0 of 11 steps</span><span class="aln-cw-tot num">$0.00</span></span></div><div class="aln-cw-list"></div></div>`;
  // Crew: each agent keeps its own clock, which stops while you pause it, and a hand-off waits for the agent before it
  function alnCrew(r, c){
    const A = ALN_RUN(), H = ALN_HAND.map(h => ({ ...h })), list = $('.aln-cw-list', r), tot = $('.aln-cw-tot', r), tt = $('.aln-cw-tt', r);
    // the line under the title (Clean shows it): the time and the steps so far, and once all are done, how the run went
    const sum = $('.aln-cw-sum', r), ALL = A.reduce((n, a) => n + a.steps.length, 0);
    let fin = false, ticks = 0;
    A.forEach((a, i) => {
      a.held = false; a.tk = 0; a.spent = 0; a.t = 0; const N = a.steps.length;
      a.el = html(`<div class="aln-cw-c" data-s="idle" style="--a:var(--av-${a.av});--ai:var(--av-${a.av}-ink)"><div class="aln-cw-top"><span class="aln-cw-av" aria-hidden="true">${I(a.ic)}</span><span class="aln-cw-tx"><b>${a.n}</b><span>Starts soon</span></span><span class="tag aln-cw-tag">Up next</span><span class="aln-cw-acts"><button class="ib aln-cw-hold" type="button" aria-pressed="false" aria-label="Pause ${a.n}" data-tip="Pause this agent">${I('pause','xs')}</button><button class="ib aln-cw-sb" type="button" aria-expanded="false" aria-label="Steer ${a.n}" data-tip="Steer">${I('wand','xs')}</button></span></div><div class="aln-cw-meter"><span class="aln-cw-tr" role="progressbar" aria-label="${a.n}’s steps" aria-valuemin="0" aria-valuemax="${N}" aria-valuenow="0" style="--n:${N}"><span class="aln-cw-ln"><i></i></span>${'<b></b>'.repeat(N)}</span><span class="aln-cw-num"><span><b class="aln-cw-sn">0</b> of ${N} steps</span><span class="aln-cw-tkn"><b class="aln-cw-tk">0</b> tokens</span><b class="aln-cw-cs">$0.00</b></span></div><div class="fold shut"><div><form class="aln-cw-steer"><input aria-label="A note for the ${a.n.toLowerCase()}" placeholder="Tell the ${a.n.toLowerCase()} what to change"><button class="ib aln-cw-go" type="submit" aria-label="Send" data-tip="Send" disabled>${I('send','xs')}</button></form></div></div><div class="aln-cw-nts"></div></div>`);
      list.appendChild(a.el);
      a.tr = $('.aln-cw-tr', a.el); a.ln = $('.aln-cw-ln i', a.el); a.dots = $$('.aln-cw-tr b', a.el); a.sn = $('.aln-cw-sn', a.el); a.tkEl = $('.aln-cw-tk', a.el); a.csEl = $('.aln-cw-cs', a.el);
      // no hand-off row between the cards (owner, 18 Nov): each waiting card already says what it waits for
      const hold = $('.aln-cw-hold', a.el), sb = $('.aln-cw-sb', a.el), fold = $('.fold', a.el), form = $('.aln-cw-steer', a.el), inp = $('input', form), go = $('.aln-cw-go', form);
      inp.oninput = () => { go.disabled = !inp.value.trim(); };
      fold.inert = true;
      hold.onclick = () => { a.held = !a.held; hold.setAttribute('aria-pressed', String(a.held)); hold.innerHTML = I(a.held ? 'play' : 'pause','xs'); hold.dataset.tip = a.held ? 'Resume this agent' : 'Pause this agent'; hold.setAttribute('aria-label', (a.held ? 'Resume ' : 'Pause ') + a.n); paint(a); };
      // the note's field takes the focus only when you open it yourself; the demo never moves your focus
      sb.onclick = e => { const on = sb.getAttribute('aria-expanded') !== 'true'; sb.setAttribute('aria-expanded', String(on)); fold.classList.toggle('shut', !on); fold.inert = !on; if (on && e.isTrusted) requestAnimationFrame(() => inp.focus({ preventScroll:true })); };
      // the note shows once its field has shut, so the card never holds both at once
      form.onsubmit = e => { e.preventDefault(); const v = inp.value.trim(); if (!v) return; inp.value = ''; go.disabled = true; sb.click(); if (form.contains(document.activeElement)) sb.focus({ preventScroll:true });
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
      await s.type($('input', A[1].el), 'Make the Pro card stand out', { n:.07, keep:true, each:() => $('input', A[1].el).oninput() });
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
    // files) in place of the drawing. In every style the box grows with what it holds (grow())
    const clean = (r.closest('[data-style]') || document.documentElement).dataset.style === 'clean';
    if (clean){
      empty.classList.add('atx-em');
      empty.innerHTML = `<span class="atx-em-art" aria-hidden="true"></span><b>Drop files for the agent</b><span>or press + to add them</span><button type="button" class="pill line sm atx-smp">${I('plus','xs')}Add sample files</button>`;
    }
    c.offs.push(grow(box));
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
  // no room kept for a longer answer, in every style (owner, 18 Nov). The component grows with its words (grow(), once its
  // entrance has settled), and a version streaming in keeps the height of the one it replaces, then eases to its own
  const rvx = $('.rvx', r);
  Promise.resolve().then(() => Promise.all(rvx.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && rvx.isConnected) c.offs.push(grow(rvx)); });
  const keep = () => { if (t.textContent.trim()) t.style.minHeight = t.offsetHeight + 'px'; };
  const fit = () => { if (!t.style.minHeight) return; const was = t.offsetHeight; t.style.minHeight = ''; const h = t.offsetHeight; if (h >= was || REDUCE) return;
    t.style.minHeight = was + 'px'; void t.offsetHeight; t.style.transition = 'min-height var(--t) var(--ease)'; t.style.minHeight = h + 'px';
    c.later(460, () => { t.style.transition = ''; t.style.minHeight = ''; }); };
  async function stream(s){
    keep(); t.classList.add('out'); await c.wait(260); t.classList.remove('out'); t.innerHTML = '';
    for (const w of s.split(' ')){ t.insertAdjacentHTML('beforeend', `<span class="w">${w} </span>`); await c.wait(45); }
    fit();
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
  // the component grows with what it shows in every style (grow(), once its entrance has settled), so the thanks line
  // eases in as the sheet folds away
  const fbx = $('.fbx', r);
  Promise.resolve().then(() => Promise.all(fbx.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && fbx.isConnected) c.offs.push(grow(fbx)); });
  const ready = () => go.disabled = !(chips.some(x => x.classList.contains('on')) || ta.value.trim());
  chips.forEach(ch => ch.onclick = () => { ch.classList.toggle('on'); ready(); });
  ta.oninput = ready;
  up.onclick = () => { const on = !up.classList.contains('on'); up.classList.toggle('on', on); dn.classList.remove('on'); box.classList.add('shut'); swap(st, on ? 'Thanks, noted' : ''); };
  // the demo opens the sheet without taking the focus from wherever you are on the page
  const down = focus => { const on = !dn.classList.contains('on'); dn.classList.toggle('on', on); up.classList.remove('on'); box.classList.toggle('shut', !on); swap(st, ''); if (on && focus) c.later(350, () => ta.focus({ preventScroll:true })); };
  dn.onclick = e => down(e.isTrusted);
  $('.fbx-x', r).onclick = () => { box.classList.add('shut'); dn.classList.remove('on'); };
  go.onclick = () => c.run(async () => {
    // the button is as wide as what it shows, and eases to the spinner's width
    const w0 = go.offsetWidth; go.innerHTML = '<span class="spin"></span>'; const w1 = go.offsetWidth;
    if (!REDUCE && w0 !== w1) go.animate([{ width:w0 + 'px' }, { width:w1 + 'px' }], { duration:220, easing:'cubic-bezier(.23,1,.32,1)' });
    await c.wait(800);
    box.classList.add('shut'); await c.wait(300);
    const n = chips.filter(x => x.classList.contains('on')).length;
    const thx = html(`<div class="fbx-thx">${I('ok')}<span>Thanks. The agent will ${n ? 'avoid this' : 'use this'} next time in this project.</span></div>`);
    ($(':scope>.dm-grow', fbx) || fbx).appendChild(thx); enter(thx); swap(st, '');
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
  list.innerHTML = M.map((x, i) => `<button class="mpk-o mx-press" role="radio" aria-checked="false" tabindex="-1" data-i="${i}"><span class="mpk-mk" style="--mc:${x.c};--mt:${x.t}">${x.m}</span><span class="t"><b>${x.n}<span class="ck">${I('check','xs')}</span></b><span class="d">${x.d}</span></span>${meter(x.s, x.tps + ' tokens a second', i)}${meter(x.q, 'Quality ' + x.q + ' of 5', i)}${meter(x.p, '$' + x.cost.toFixed(3) + ' a reply', i)}</button>`).join('');
  const rows = $$('.mpk-o', list);
  // Clean's one hover glides from model to model; the picked one keeps its stronger fill
  if (!r.closest('.ahx')) c.offs.push(hoverGlide(list, '.mpk-o'));
  // Opus is at capacity when the demo starts (busy is its wait in seconds), and free again once you've waited it out
  let cur = 1, eff = 2, busy = 20, waiting = false;
  function paint(){
    rows.forEach((b, i) => { b.setAttribute('aria-checked', i === cur); b.tabIndex = i === cur ? 0 : -1; });
    // the trigger's mark crossfades to the new model's (iconSwap(); at once as it is first drawn)
    const mk = $('.mpk-mk', tr), mark = () => { mk.style.setProperty('--mc', M[cur].c); mk.style.setProperty('--mt', M[cur].t); mk.textContent = M[cur].m; };
    if (mk.textContent && mk.textContent !== M[cur].m) iconSwap(mk, mark); else mark();
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
      iconSwap(ck, () => { ck.innerHTML = I('check','xs'); }); row.classList.add('busy'); swap(d, `At capacity, about ${busy}s wait`);
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
  // (its rows settle one after another each time it opens: .mx-play)
  const open = v => { fold.classList.toggle('shut', !v); fold.inert = !v; tr.setAttribute('aria-expanded', v); list.classList.toggle('mx-play', v); centred(); };
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
  // the tone changes with the words: the words fading out keep their colour, and the new ones arrive in theirs (swap()
  // writes them 170ms on)
  const status = (text, tone) => { clearTimeout(st._tone); const set = () => { st.classList.toggle('warn', tone === 'warn'); st.classList.toggle('ok', tone === 'ok'); };
    if (tone === 'ok') { set(); st.innerHTML = `${I('ok','xs')}<span>${text}</span>`; enter(st); return; }
    const lag = !REDUCE && !!st.textContent.trim() && st.textContent !== text; swap(st, text); if (lag) st._tone = setTimeout(set, 170); else set(); };
  function nav(){
    n.textContent = (cur + 1) + ' / ' + vers.length; pg.classList.toggle('on', vers.length > 1); pg.inert = vers.length < 2;
    pv.disabled = cur === 0 || busy; nx.disabled = cur === vers.length - 1 || busy; re.disabled = busy;
    up.setAttribute('aria-pressed', vers[cur].rate === 'up'); dn.setAttribute('aria-pressed', vers[cur].rate === 'down');
    swap(meta, vers[cur].meta);
  }
  // no room kept for a longer answer or an empty status, in every style (owner, 18 Nov). The component grows with what it
  // shows (grow(), once its entrance has settled), and a version streaming in keeps the height of the one it replaces, then
  // eases to its own
  const aab = $('.aab', r);
  Promise.resolve().then(() => Promise.all(aab.getAnimations().map(a => a.finished.catch(() => {})))).then(() => { if (!c.dead && aab.isConnected) c.offs.push(grow(aab)); });
  const keep = () => { if (t.textContent.trim()) t.style.minHeight = t.offsetHeight + 'px'; };
  const fit = () => { if (!t.style.minHeight) return; const was = t.offsetHeight; t.style.minHeight = ''; const h = t.offsetHeight; if (h >= was || REDUCE) return;
    t.style.minHeight = was + 'px'; void t.offsetHeight; t.style.transition = 'min-height var(--t) var(--ease)'; t.style.minHeight = h + 'px';
    c.later(460, () => { t.style.transition = ''; t.style.minHeight = ''; }); };
  // a version streams in word by word; paging between versions shows one at once
  async function stream(v){
    keep(); t.classList.add('out'); await c.wait(260); t.classList.remove('out'); t.innerHTML = '';
    const ws = words(v);
    for (let i = 0; i < ws.length; i++){ t.insertAdjacentHTML('beforeend', ws[i]); t.lastElementChild.classList.add('in'); await c.wait(38); }
    fit();
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
        for (let k = 2; k > 0; k--){ status(`Couldn't reach the model. Retrying in ${k}s`, 'warn'); await c.wait(1000); }
      }
      status('Writing a new version' + (note ? ' with your note' : '')); st.classList.add('shim');
      const v = { ...POOL[Math.min(vers.length, POOL.length - 1)], rate:'' }; vers.push(v); cur = vers.length - 1; nav();
      await stream(v); busy = false; nav(); st.classList.remove('shim');
      // what the new version fixed, when it answers a reason; the pager already counts the versions
      if (note) status('Fixes the saving: 21%, not 15%', 'ok'); else status('');
    });
  }
  re.onclick = () => regenerate();
  // the tooltip says it was copied, and how
  cp.onclick = () => copied(cp, plain(vers[cur]), 'Copied without the highlights');
  // thumbs: up is a quiet thanks; down asks why, and a reason writes a version that answers it
  up.onclick = () => { const v = vers[cur]; v.rate = v.rate === 'up' ? '' : 'up'; why.classList.add('shut'); nav(); status(v.rate ? 'Thanks, noted for this project' : ''); };
  // (as the reasons open, the question and its chips rise in one after another, mxIn(): owner's trial, 26 Nov)
  dn.onclick = () => { const v = vers[cur]; v.rate = v.rate === 'down' ? '' : 'down'; why.classList.toggle('shut', v.rate !== 'down'); why.inert = v.rate !== 'down'; nav(); status(''); chips.forEach(x => x.classList.remove('on')); if (v.rate === 'down') mxIn([$('.aab-wq', r), ...chips], { base:60 }); };
  chips.forEach(ch => ch.onclick = () => { chips.forEach(x => x.classList.toggle('on', x === ch)); c.later(400, () => { why.classList.add('shut'); why.inert = true; failOnce = vers.length === 1; regenerate(ch.textContent); }); });
  why.inert = true;
  // read aloud: about 0.28s a word, each word lit as it's read, with a progress bar and a clock
  let reading = 0, pos = 0;
  const clock = s => Math.floor(s / 60) + ':' + String(Math.floor(s) % 60).padStart(2, '0');
  // (play, pause and the speaker crossfade: iconSwap())
  let ico = 'vol'; const icon = k => { if (ico === k) return; ico = k; const ic = $('.ic', rd); iconSwap(ic, () => { ic.innerHTML = I(k, 'xs'); }, { inner:true }); };
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
  // (in Clean the foot strip fades in once the card has grown to hold it, so no button shows cut off by the card's edge as it grows)
  const show = on => { body.forEach(e => e.hidden = !on); if (on){ if (clean){ enter(body[0]); enter(body[1], 400); } else stagger(body, 50); } };
  // Clean's summary line in the foot strip: the scopes you allowed, by name, or how many on a narrow stage
  let names = [];
  const sum = (el, text, short = text) => { if (!clean) return; const s = el.appendChild(html(`<span class="pgx-sum"><span class="l"></span><span class="s"></span></span>`)); s.firstChild.textContent = text; s.lastChild.textContent = short; };
  // the frames the agent edits once it may. Plan toggle is a library component, so editing it needs Publish library
  const F = ['Hero', 'Plan cards', 'Compare table', 'FAQ', 'Plan toggle', 'Checkout summary'], LIB = 4;
  let granted = 0, publish = false, skip = false, done = 0, run = 0, panel = null;
  function row(){
    panel = html(`<div class="pgx-done run"><span class="g"><span class="spin"></span></span><span class="t"><b class="pgx-a"></b><span class="pgx-d"></span></span><button class="pill line sm">Revoke</button></div>`);
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
    show(false); const d = html(`<div class="pgx-done" style="background:var(--chip)">${I('info')}<span class="t">The agent will skip the Figma edits<span>It will list the fixes in chat instead</span></span><button class="pill line sm">Undo</button></div>`);
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
const PARTS = {"files":{"s-status":"/assets/v2-status.137a2bfd94.js","s-review":"/assets/v2-review.b963359538.js","s-data":"/assets/v2-data.ad1e3b1e05.js","s-workspace":"/assets/v2-workspace.8b65a1ba4c.js","s-dates":"/assets/v2-dates.b832d0e139.js"},"of":{"status-pill":"s-status","step-loader":"s-status","thinking-states":"s-status","reasoning-trail":"s-status","thinking":"s-status","context-meter":"s-status","toast":"s-status","toast-stack":"s-status","agent-run-timeline":"s-status","decision-prompt":"s-review","plan-review":"s-review","inline-text-diff":"s-review","source-stack":"s-data","terminal-stream":"s-data","citation-hover":"s-data","command-palette":"s-workspace","file-explorer":"s-workspace","run-drawer":"s-workspace","memory-panel":"s-workspace","tool-connections":"s-workspace","knowledge-sources":"s-workspace","scheduled-runs":"s-workspace","event-calendar":"s-dates","web-search":"s-status"},"all":[]};
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
