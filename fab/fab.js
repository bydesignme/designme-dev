/* The DesignMe smiley on phones and tablets (owner, 4 Nov): the pages keep to the components there, and the credit and Book a
   call sit behind this one button in the bottom left. A tap opens a card that grows out of the smiley (the smiley winks as it
   goes), with the question, Book a call and the credit; the X, Escape or a tap anywhere else puts it away. On screens wider
   than 960px the sidebar shows all of this, so the smiley isn't drawn. Its colours are the site chrome's (--sh-*), which the
   homepage, the docs and the component pages all set */
(function(){
  if (window.__dmFab) return; window.__dmFab = true;
  // where this script was loaded from: the landing page's 3D mark (logo3d.js) and three.js sit beside it
  var BASE = (document.currentScript && document.currentScript.src) || '/fab/fab.js';
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
  var add = function(){ if (document.querySelector('.lp-hero')) return landing(); document.body.appendChild(root); };
  if (document.body) add(); else document.addEventListener('DOMContentLoaded', add);

  /* The landing page (owner, 26 Nov): the same smiley button, bottom right at every width, which comes in once the hero is
     scrolled past and goes when it is back in view. It opens a small popover above it, in the motion pieces' .mx-pop manner
     (it grows out of the button from a short blur and goes back into it quicker; no blur in Blueprint and Clean): who made the
     library, Book a call (the landing page's own, square in Blueprint, a pill in Clean, a squircle rectangle in Soft) and the
     email. The button opens and closes it; Escape, a click outside or the button put it away, and focus goes back to the
     button. The landing page has no sidebar shell, so the colours are the page's (--pg-*), and the motion the core's (--dm-*) */
  function landing(){
    var BOOK = 'https://www.designme.agency/intro?utm_source=designme.dev&amp;utm_medium=referral&amp;utm_campaign=book_a_call';
    var MASK = 'url("data:image/svg+xml,' + encodeURIComponent(LOGO.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace('currentColor', '#000')) + '")';
    var lc = ''
      + '.dmf.dmf-lp{display:block;left:auto;right:16px;opacity:0;visibility:hidden;transform:translateY(12px) scale(.9);transform-origin:bottom right;'
      + 'transition:opacity .2s var(--dm-ease-io,ease),transform .2s var(--dm-ease-io,ease),visibility 0s .2s}'
      + '.dmf.dmf-lp.in{opacity:1;visibility:visible;transform:none;transition:opacity .3s var(--dm-ease,ease),transform .45s cubic-bezier(.34,1.56,.64,1),visibility 0s}'
      // the landing page has no SiteShell, so the shell's tokens the button uses are mapped from the page's (the shell's values)
      + '.dmf-lp{--sh-card:var(--pg-bg);--sh-line:var(--pg-line2);--sh-line-2:var(--pg-line2);--sh-text:var(--pg-fg);--sh-muted:var(--pg-muted);--sh-chip:var(--pg-chip);--sh-act:var(--pg-soft)}'
      + ':root[data-theme="dark"] .dmf-lp{--sh-card:#181818}'
      + '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .dmf-lp{--sh-card:#181818}}'
      + '.dmf-lp .dmf-b{border-color:var(--sh-line);background:var(--sh-card);color:var(--sh-text)}'
      // the sidebar sticker's gloss (SiteShell .sticker .gloss, the same gradient and timing), passing through the smiley
      + '.dmf-gl{position:absolute;left:50%;top:50%;width:30px;height:26px;margin:-13px 0 0 -15px;pointer-events:none;-webkit-mask:' + MASK + ' center/contain no-repeat;mask:' + MASK + ' center/contain no-repeat;'
      + 'background:linear-gradient(115deg,transparent 38%,rgba(255,255,255,.85) 50%,transparent 62%);background-size:260% 100%;background-position:160% 0;animation:dmf-gloss 5s ease-in-out 1.6s infinite}'
      + '@keyframes dmf-gloss{0%{background-position:160% 0}22%{background-position:-60% 0}100%{background-position:-60% 0}}'
      + ':root[data-theme="dark"] .dmf-gl{background-image:linear-gradient(115deg,transparent 38%,rgba(17,17,17,.35) 50%,transparent 62%)}'
      + '@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .dmf-gl{background-image:linear-gradient(115deg,transparent 38%,rgba(17,17,17,.35) 50%,transparent 62%)}}'
      + '.dmf-lp.open .dmf-b{transform:none;opacity:1;pointer-events:auto}'
      // a step bigger than on the other pages (owner, 26 Nov), with the smiley scaled with it
      + '.dmf-lp .dmf-b{width:56px;height:56px}'
      + '.dmf-lp .dmf-b>svg{width:30px;height:26px}'
      // a calm call for attention until the pop-up has been opened once (this session): a neutral ring that leaves the
      // button and fades, every 4s. Opacity and scale only, no colour
      + '.dmf-lp .dmf-b::after{content:"";position:absolute;inset:-1px;border-radius:50%;border:1.5px solid color-mix(in srgb,var(--pg-fg) 28%,transparent);opacity:0;pointer-events:none}'
      + '.dmf-lp.pulse.in:not(.open) .dmf-b::after{animation:dmf-ring 4s cubic-bezier(.22,1,.36,1) 1.2s infinite}'
      + '@keyframes dmf-ring{0%{opacity:.9;transform:scale(1)}45%{opacity:0;transform:scale(1.5)}100%{opacity:0;transform:scale(1.5)}}'
      + '.dmf-lp .dmf-b:focus-visible{outline-color:var(--sh-line-2,var(--pg-line2))}'
      + '.dmf-p{position:absolute;right:0;bottom:calc(100% + 12px);width:min(304px,calc(100vw - 32px));box-sizing:border-box;padding:16px;border-radius:16px;border:1px solid var(--pg-line);background:var(--pg-bg);color:var(--pg-fg);'
      + 'box-shadow:var(--dm-shadow-pop,0 1px 2px rgba(0,0,0,.06),0 24px 48px -16px rgba(0,0,0,.3));text-align:left;outline:0;'
      + 'opacity:0;visibility:hidden;transform:scale(.95);filter:blur(var(--dm-blur-in,0px));transform-origin:bottom right;'
      + 'transition:opacity var(--dm-t-out,.16s) var(--dm-ease-io,ease),transform var(--dm-t-out,.16s) var(--dm-ease-io,ease),filter var(--dm-t-out,.16s) var(--dm-ease-io,ease),visibility 0s var(--dm-t-out,.16s)}'
      + '.dmf-lp.open .dmf-p{opacity:1;visibility:visible;transform:none;filter:none;'
      + 'transition:opacity calc(var(--dm-t-in,.36s) * .6) var(--dm-ease,ease),transform var(--dm-t-in,.36s) var(--dm-ease-pop,ease),filter calc(var(--dm-t-in,.36s) * .7) var(--dm-ease,ease),visibility 0s}'
      + ':root[data-style="clean"] .dmf-p{border-radius:var(--dm-r-card,22px)}'
      + '@supports (corner-shape:squircle){:root[data-style="soft"] .dmf-p{corner-shape:squircle;border-radius:var(--dm-r-card,24px)}}'
      // Blueprint keeps its square corners
      + ':root[data-style="bp"] .dmf-p,:root:not([data-style]) .dmf-p{border-radius:0}'
      // the 3D mark's stage over the words: the pop-up's width, the flat mark until the 3D one is drawn (or if it can't be)
      + '.dmf-3d{position:relative;height:128px;margin:-4px -8px 12px;display:grid;place-items:center}'
      + '.dmf-3d>svg{width:84px;height:70px;color:var(--pg-fg);opacity:.9;transition:opacity .3s}'
      + '.dmf-3d.ready>svg{opacity:0}'
      + '.dmf-3d-cv{position:absolute;inset:0;width:100%;height:100%;opacity:0;transition:opacity .5s}'
      + '.dmf-3d.ready .dmf-3d-cv{opacity:1}'
      + '.dmf-p .dmf-t{margin:0;font-size:14px;font-weight:500;line-height:20px}'
      + '.dmf-p .dmf-d{margin:4px 0 0;font-size:13px;line-height:20px;color:var(--pg-dim)}'
      + '.dmf-p .dmf-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:16px}'
      + '.dmf-p .dmf-book{height:36px;padding:0 16px;font-size:14px;text-decoration:none;gap:8px;border-radius:10px}'
      + '.dmf-p .dmf-book svg{width:14px;height:14px}'
      + '@supports (corner-shape:squircle){.dmf-p .dmf-book{corner-shape:squircle;border-radius:16px}}'
      + ':root[data-style="clean"] .dmf-p .dmf-book{corner-shape:round;border-radius:var(--dm-r-pill,999px)}'
      + ':root[data-style="bp"] .dmf-p .dmf-book,:root:not([data-style]) .dmf-p .dmf-book{corner-shape:round;border-radius:0}'
      + '.dmf-p .dmf-book:focus-visible,.dmf-p .dmf-mail a:focus-visible{outline:2px solid var(--pg-line2);outline-offset:2px}'
      + '.dmf-p .dmf-mail{font-size:13px;line-height:20px;color:var(--pg-dim)}'
      + '.dmf-p .dmf-mail a{color:var(--pg-fg);text-decoration:underline;text-decoration-color:var(--pg-line2);text-underline-offset:3px}'
      + '.dmf-p .dmf-mail a:hover{text-decoration-color:currentColor}'
      + '@media (prefers-reduced-motion:reduce){.dmf-lp .dmf-b::after{animation:none!important}.dmf-gl{animation:none;display:none}.dmf.dmf-lp,.dmf.dmf-lp.in,.dmf-p,.dmf-lp.open .dmf-p{transform:none!important;filter:none!important;transition:opacity .15s,visibility 0s!important}.dmf-lp.open .dmf-b,.dmf-lp .dmf-b{transform:none}}';
    var ls = document.createElement('style'); ls.textContent = lc; document.head.appendChild(ls);
    var fab = document.createElement('div'); fab.className = 'dmf dmf-lp';
    fab.innerHTML = '<button class="dmf-b" type="button" aria-expanded="false" aria-controls="dmf-p" aria-haspopup="dialog" aria-label="DesignMe: who made this, and Book a call">' + LOGO + '<span class="dmf-gl" aria-hidden="true"></span></button>'
      + '<div class="dmf-p" id="dmf-p" role="dialog" aria-labelledby="dmf-pt" tabindex="-1">'
      + '<div class="dmf-3d" aria-hidden="true">' + LOGO + '</div>'
      + '<p class="dmf-t" id="dmf-pt">DesignMe made designme.dev</p>'
      + '<p class="dmf-d">We design and build AI products, React apps and Astro sites.</p>'
      + '<div class="dmf-row"><a class="pill primary dmf-book" href="' + BOOK + '" target="_blank" rel="noopener">Book a call' + ARROW + '</a>'
      + '<span class="dmf-mail">or write to <a href="mailto:hello@designme.agency">hello@designme.agency</a></span></div>'
      + '</div>';
    var b = fab.querySelector('.dmf-b'), pop = fab.querySelector('.dmf-p');
    pop.inert = true;
    var isOpen = function(){ return fab.classList.contains('open'); };
    // the attention ring, until the pop-up has been opened once this session
    var seenKey = 'dmf-opened', seen0 = false; try { seen0 = sessionStorage.getItem(seenKey) === '1'; } catch (e) {}
    if (!seen0) fab.classList.add('pulse');
    // the 3D mark: loaded the first time the pop-up opens, drawn only while it is open
    var stage = fab.querySelector('.dmf-3d'), logo = null, loading = null, reduceQ = matchMedia('(prefers-reduced-motion:reduce)');
    var isDark = function(){ return (getComputedStyle(document.documentElement).getPropertyValue('color-scheme') || '').indexOf('dark') >= 0; };
    var load3d = function(){ if (loading) return loading;
      loading = import(new URL('logo3d.js', BASE).href).then(function(m){ logo = m.mount(stage, LOGO, { dark:isDark(), reduce:reduceQ.matches });
        if (logo){ stage.classList.add('ready'); if (isOpen()) logo.start(); } }).catch(function(){ logo = null; });
      return loading; };
    new MutationObserver(function(){ if (logo) logo.theme(isDark()); }).observe(document.documentElement, { attributes:true, attributeFilter:['data-theme', 'data-style'] });
    var show = function(){ fab.classList.add('open'); fab.classList.remove('pulse'); try { sessionStorage.setItem(seenKey, '1'); } catch (e) {}
      b.setAttribute('aria-expanded', 'true'); pop.inert = false; pop.focus({ preventScroll:true }); if (logo) logo.start(); else load3d(); };
    var hide = function(back){ if (!isOpen()) return; fab.classList.remove('open'); if (logo) setTimeout(function(){ if (!isOpen() && logo) logo.stop(); }, 400); b.setAttribute('aria-expanded', 'false'); pop.inert = true;
      if (back) b.focus({ preventScroll:true }); };
    b.addEventListener('click', function(){ if (isOpen()) hide(true); else show(); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && isOpen()){ e.preventDefault(); hide(true); } });
    document.addEventListener('pointerdown', function(e){ if (!fab.contains(e.target)) hide(false); }, true);
    // in once the hero is scrolled past (its foot above the view's top), out again when it comes back
    var hero = document.querySelector('.lp-hero');
    var set = function(on){ fab.classList.toggle('in', on); fab.inert = !on; if (!on) hide(false); };
    set(false);
    if (window.IntersectionObserver) new IntersectionObserver(function(es){ var e = es[es.length - 1]; set(!e.isIntersecting && e.boundingClientRect.top < 0); }).observe(hero);
    else set(true);
    document.body.appendChild(fab);
  }
})();
