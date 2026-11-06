/* Device frames: a page shown at a desktop, tablet or phone width (1280, 820 or 390 CSS px) inside a box of any size, scaled
   down to fit its width. The page is an iframe of the same site with ?embed=1, which hides the site's own chrome around it.
   Used by the homepage's showcase (tools/site/build.js inlines this file), the template pages and the pages of full-screen
   components (tools/pages inlines it there).

     var v = dmFrame(box, { onUse: fn })   box: an element with a size of its own (the frame fills it, centred)
     v.show(src, device)                   'desktop' | 'tablet' | 'mobile'; a page already loaded is shown again, not reloaded
     v.device(device)                      changes the width of the page on show
     v.reload()                            loads the page on show again (the demos start over)

   Only the page on show is loaded; a page shown before stays loaded, hidden, so going back to it is instant. The page in the
   frame follows the site's style, theme and accent as they change. onUse runs the first time a person clicks, types or
   scrolls inside a frame. */
(function(){
  if (window.dmFrame) return;
  var W = { desktop:1280, tablet:820, mobile:390 };
  // a tablet or phone sits inside the box with this much room above and below, so it reads as a device
  var PAD = { desktop:0, tablet:16, mobile:16 };
  var root = document.documentElement;
  // the site's look, copied onto the framed page's root: Blueprint or Soft, light or dark, and the accent's colours
  function look(doc){
    if (!doc || !doc.documentElement) return;
    var r = doc.documentElement;
    ['data-theme', 'data-style'].forEach(function(a){ var v = root.getAttribute(a); if (v === null) r.removeAttribute(a); else r.setAttribute(a, v); });
    ['--dm-accent', '--dm-accent-2', '--dm-accent-bg', '--dm-on-accent', '--dm-accent-fg', '--dm-accent-mark'].forEach(function(k){
      var v = root.style.getPropertyValue(k); if (v) r.style.setProperty(k, v); else r.style.removeProperty(k);
    });
  }
  window.dmFrame = function(box, opts){
    opts = opts || {};
    var frames = [], cur = null, dev = 'desktop', used = false;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)');
    var use = function(){ if (used) return; used = true; if (opts.onUse) opts.onUse(); };
    function place(f){
      if (!f) return;
      var bw = box.clientWidth, bh = box.clientHeight, w = W[dev], pad = PAD[dev];
      if (!bw || !bh) return;
      var k = Math.min(1, (bw - (dev === 'desktop' ? 0 : 32)) / w), h = Math.max(200, (bh - pad * 2) / k);
      for (var d in W) f.wrap.classList.toggle(d, d === dev);
      f.wrap.style.width = Math.round(w * k) + 'px'; f.wrap.style.height = Math.round(h * k) + 'px';
      f.wrap.style.top = pad + 'px';
      f.el.style.width = w + 'px'; f.el.style.height = Math.round(h) + 'px';
      f.el.style.transform = k < 1 ? 'scale(' + k.toFixed(4) + ')' : '';
    }
    function make(src){
      var wrap = document.createElement('div'), el = document.createElement('iframe');
      wrap.className = 'dvf-dev ' + dev;
      el.src = src; el.title = opts.title ? opts.title(src) : 'Preview';
      el.setAttribute('loading', 'eager');
      wrap.appendChild(el); box.appendChild(wrap);
      var f = { src:src, wrap:wrap, el:el, ready:false };
      el.addEventListener('load', function(){
        f.ready = true; wrap.classList.add('ready');
        try {
          var w = el.contentWindow, d = el.contentDocument; look(d);
          ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function(t){ w.addEventListener(t, function(e){ if (e.isTrusted) use(); }, { capture:true, passive:true }); });
          if (opts.onLoad) opts.onLoad(f, w.location.pathname);
        } catch(e){}
      });
      frames.push(f); place(f); return f;
    }
    function show(src, d){
      if (d) dev = d;
      var f = frames.filter(function(x){ return x.src === src; })[0] || make(src);
      var was = cur; cur = f;
      box.setAttribute('data-device', dev);
      place(f);
      f.wrap.hidden = false;
      f.wrap.classList.add('on');
      frames.forEach(function(x){ if (x !== f){ x.wrap.classList.remove('on'); } });
      // the page that was on show fades out under the new one, then leaves the layout (its demos rest while it is hidden)
      if (was && was !== f){ var gone = was; setTimeout(function(){ if (cur !== gone) gone.wrap.hidden = true; }, reduce.matches ? 0 : 360); }
      return f;
    }
    new ResizeObserver(function(){ frames.forEach(place); }).observe(box);
    new MutationObserver(function(){ frames.forEach(function(f){ try { look(f.el.contentDocument); } catch(e){} }); })
      .observe(root, { attributes:true, attributeFilter:['data-theme', 'data-style', 'style'] });
    return {
      show:show,
      device:function(d){ dev = d; box.setAttribute('data-device', dev); frames.forEach(place); },
      reload:function(){ if (cur){ cur.ready = false; cur.wrap.classList.remove('ready'); try { cur.el.contentWindow.location.reload(); } catch(e){ cur.el.src = cur.src; } } },
      get current(){ return cur; },
      get used(){ return used; },
    };
  };
})();
