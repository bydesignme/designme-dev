/* The DesignMe smiley on phones and tablets (owner, 4 Nov): the pages keep to the components there, and the credit and Book a
   call sit behind this one button in the bottom left. A tap opens a card that grows out of the smiley (the smiley winks as it
   goes), with the question, Book a call and the credit; the X, Escape or a tap anywhere else puts it away. On screens wider
   than 960px the sidebar shows all of this, so the smiley isn't drawn. Its colours are the site chrome's (--sh-*), which the
   homepage, the docs and the component pages all set */
(function(){
  if (window.__dmFab) return; window.__dmFab = true;
  var LOGO = '<svg viewBox="0 0 759 632" aria-hidden="true" focusable="false"><path fill="currentColor" d="M149.497 283.784C149.477 284.047 149.474 284.311 149.487 284.575C156.385 340.034 183.548 391.116 225.9 428.196C267.989 465.044 322.188 485.532 378.414 485.855L379.743 485.859C436.453 485.868 491.188 465.353 533.619 428.212C575.912 391.194 603.062 340.216 610.018 284.856L610.018 281.512C610.008 277.337 608.324 273.315 605.303 270.335C602.277 267.351 598.155 265.656 593.837 265.656L165.647 265.656C161.338 265.656 157.226 267.349 154.21 270.331C151.198 273.309 149.524 277.326 149.523 281.491L149.523 283.437L149.497 283.784ZM114.378 247.395C118.396 247.391 122.254 245.919 125.214 243.29C128.063 240.759 129.887 237.33 130.396 233.629L130.396 233.35L130.437 232.917C136.355 171.634 165.162 114.754 211.202 73.3687C257.239 31.9859 317.206 9.06063 379.393 9.04448L379.396 9.04448C441.593 9.04583 501.574 31.964 547.624 73.3482C593.677 114.735 622.491 171.624 628.411 232.917L628.453 233.35L628.453 233.643C628.953 237.344 630.773 240.774 633.621 243.304C636.58 245.932 640.437 247.399 644.452 247.395L725.644 247.395C728.882 247.404 732.089 248.06 735.071 249.329C738.055 250.598 740.753 252.453 743.001 254.787C745.252 257.123 747.005 259.891 748.151 262.924C749.296 265.954 749.81 269.183 749.662 272.418L749.663 272.418C745.484 366.797 704.617 455.919 635.615 521.211C566.616 586.499 474.809 622.924 379.338 622.924C283.872 622.924 192.071 586.496 123.081 521.206C54.0935 455.917 13.2412 366.804 9.07133 272.438L9.07036 272.438L9.07036 272.436C9.07007 272.43 9.06967 272.423 9.06938 272.417L9.07036 272.417C8.92272 269.182 9.43655 265.953 10.5811 262.924C11.7276 259.89 13.481 257.123 15.7315 254.787C17.9805 252.452 20.6797 250.597 23.6622 249.329C26.6443 248.06 29.8504 247.404 33.0889 247.395L114.378 247.395Z"/></svg>';
  var ARROW = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var X = '<svg viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M6 6l12 12M18 6 6 18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
  var css = ''
    + '.dmf{position:fixed;left:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:70;display:none;font-family:inherit}'
    + '@media (max-width:960px){.dmf{display:block}}'
    + '.dmf-b{position:relative;display:grid;place-items:center;width:48px;height:48px;padding:0;border-radius:50%;border:1px solid var(--sh-line);background:var(--sh-card);color:var(--sh-text);cursor:pointer;-webkit-tap-highlight-color:transparent;'
    + 'box-shadow:0 1px 2px rgba(0,0,0,.06),0 10px 24px -10px rgba(0,0,0,.28);transition:transform .45s cubic-bezier(.34,1.56,.64,1),opacity .2s}'
    + '.dmf-b svg{width:26px;height:22px;transition:transform .45s cubic-bezier(.34,1.56,.64,1)}'
    + '.dmf-b:active{transform:scale(.9)}'
    + '.dmf-b:focus-visible{outline:2px solid var(--sh-line-2);outline-offset:2px}'
    + '.dmf.open .dmf-b{transform:scale(.5) rotate(-30deg);opacity:0;pointer-events:none}'
    + '.dmf-c{position:absolute;left:0;bottom:0;width:min(320px,calc(100vw - 32px));box-sizing:border-box;padding:18px 18px 16px;border-radius:20px;border:1px solid var(--sh-line);background:var(--sh-card);color:var(--sh-text);'
    + 'box-shadow:0 1px 2px rgba(0,0,0,.06),0 24px 48px -16px rgba(0,0,0,.3);clip-path:circle(24px at 24px calc(100% - 24px));opacity:0;visibility:hidden;outline:0;'
    + 'transition:clip-path .4s cubic-bezier(.4,0,.2,1),opacity .2s .15s,visibility 0s .4s}'
    + '.dmf.open .dmf-c{clip-path:circle(150% at 24px calc(100% - 24px));opacity:1;visibility:visible;transition:clip-path .6s cubic-bezier(.2,.9,.2,1),opacity .12s,visibility 0s}'
    + '.dmf-c>*{opacity:0;transform:translateY(10px);transition:opacity .2s,transform .2s}'
    + '.dmf.open .dmf-c>*{opacity:1;transform:none;transition:opacity .35s calc(var(--i) * 60ms + 140ms),transform .55s cubic-bezier(.34,1.56,.64,1) calc(var(--i) * 60ms + 140ms)}'
    + '.dmf-lg{display:grid;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--sh-chip);color:var(--sh-text)}'
    + '.dmf-lg svg{width:24px;height:20px}'
    + '.dmf.open .dmf-lg svg{animation:dmfwink .9s cubic-bezier(.34,1.56,.64,1) .25s both}'
    + '@keyframes dmfwink{0%{transform:rotate(0) scale(.6)}40%{transform:rotate(-16deg) scale(1.1)}70%{transform:rotate(8deg) scale(1)}100%{transform:none}}'
    + '.dmf-x{position:absolute;top:10px;right:10px;display:grid;place-items:center;width:32px;height:32px;padding:0;border:0;border-radius:50%;background:none;color:var(--sh-muted);cursor:pointer;-webkit-tap-highlight-color:transparent}'
    + '.dmf-x svg{width:16px;height:16px}'
    + '.dmf-x:hover{background:var(--sh-act);color:var(--sh-text)}'
    + '.dmf-x:focus-visible{outline:2px solid var(--sh-line-2);outline-offset:0}'
    + '.dmf.open .dmf-x{transform:none;transition:opacity .3s .35s,transform .5s cubic-bezier(.34,1.56,.64,1) .35s}'
    + '.dmf-t{margin:14px 0 0;font-size:14px;font-weight:500;line-height:1.4}'
    + '.dmf-d{margin:4px 0 0;font-size:13px;line-height:1.5;color:var(--sh-muted)}'
    + '.dmf-go{display:inline-flex;align-items:center;gap:6px;height:40px;margin-top:14px;padding:0 18px;border-radius:8px;corner-shape:squircle;background:var(--sh-text);color:var(--sh-card);font-size:14px;font-weight:500;text-decoration:none;-webkit-tap-highlight-color:transparent}'
    + '@supports (corner-shape:squircle){.dmf-go{border-radius:14px}}'
    + '.dmf-go svg{width:16px;height:16px;transition:transform .25s}'
    + '.dmf-go:hover svg{transform:translateX(3px)}'
    + '.dmf-go:focus-visible{outline:2px solid var(--sh-line-2);outline-offset:2px}'
    + '.dmf-cr{margin:14px 0 0;padding-top:12px;border-top:1px solid var(--sh-line);font-size:12px;line-height:1.5;color:var(--sh-muted)}'
    + '.dmf-cr a{color:var(--sh-text);text-decoration:underline;text-decoration-color:var(--sh-line-2);text-underline-offset:3px}'
    + '@media (prefers-reduced-motion:reduce){.dmf-b,.dmf-c,.dmf-c>*,.dmf.open .dmf-c,.dmf.open .dmf-c>*{transition:opacity .15s,visibility 0s!important;transform:none!important}.dmf-c,.dmf.open .dmf-c{clip-path:none}.dmf.open .dmf-lg svg{animation:none}}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  var root = document.createElement('div'); root.className = 'dmf';
  root.innerHTML = '<button class="dmf-b" type="button" aria-expanded="false" aria-controls="dmf-c" aria-label="DesignMe: design and dev support">' + LOGO + '</button>'
    + '<div class="dmf-c" id="dmf-c" role="dialog" aria-label="DesignMe" tabindex="-1">'
    + '<span class="dmf-lg" style="--i:0">' + LOGO + '</span>'
    + '<p class="dmf-t" style="--i:1">Need expert design and dev support?</p>'
    + '<p class="dmf-d" style="--i:2">Expert design and dev support for startups and enterprises, from Astro sites to React apps and AI products.</p>'
    + '<a class="dmf-go" style="--i:3" href="https://www.designme.agency/intro?utm_source=designme.dev&amp;utm_medium=referral&amp;utm_campaign=book_a_call" target="_blank" rel="noopener">Book a call' + ARROW + '</a>'
    + '<p class="dmf-cr" style="--i:4">Built by <a href="https://designme.agency" target="_blank" rel="noopener">DesignMe</a>, free to use under the MIT licence.</p>'
    + '<button class="dmf-x" type="button" aria-label="Close" style="--i:1">' + X + '</button>'
    + '</div>';
  var btn = root.querySelector('.dmf-b'), card = root.querySelector('.dmf-c'), x = root.querySelector('.dmf-x');
  card.inert = true;
  function open(){ root.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); card.inert = false; card.focus({ preventScroll:true }); }
  function close(back){ if (!root.classList.contains('open')) return; root.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); card.inert = true; if (back) btn.focus({ preventScroll:true }); }
  btn.addEventListener('click', open);
  x.addEventListener('click', function(){ close(true); });
  document.addEventListener('keydown', function(e){ if (e.key === 'Escape') close(true); });
  document.addEventListener('pointerdown', function(e){ if (!root.contains(e.target)) close(false); }, true);
  // a phone held sideways or a window made wide shows the sidebar again, so the card goes
  var wide = matchMedia('(min-width:961px)'); (wide.addEventListener ? wide.addEventListener('change', function(m){ if (m.matches) close(false); }) : 0);
  // the Agent harness demos on designme.dev show the DesignMe smiley over New chat's greeting; installs keep the slot empty,
  // so it is added here, on the site only, wherever a harness mounts (homepage cards and component pages alike)
  var brand = function(){ document.querySelectorAll('.ahx-hi').forEach(function(h){ if (h.querySelector('.ahx-brand')) return;
    h.insertAdjacentHTML('afterbegin', LOGO.replace('<svg ', '<svg class="ahx-brand" ')); }); };
  var bt = 0; new MutationObserver(function(){ if (!bt) bt = requestAnimationFrame(function(){ bt = 0; brand(); }); }).observe(document.documentElement, { childList:true, subtree:true });
  var add = function(){ document.body.appendChild(root); };
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);
})();
