/* Device frames: a page shown at a desktop, tablet or phone width (1280, 820 or 390 CSS px) inside a box of any size, scaled
   down to fit its width. The page is an iframe of the same site with ?embed=1, which hides the site's own chrome around it.
   Used by the landing page's views of the templates (src/pages/index.astro, which inlines it). The component pages' Desktop /
   Tablet / Mobile switch is gone (owner, 21 Nov).

     var v = dmFrame(box, { onUse: fn })   box: an element with a size of its own (the frame fills it, centred)
                                           fill: true lets a desktop page be as wide as a box wider than 1280px, so it
                                           fills it; a number is the least width the page is laid out at, scaled down
                                           to fit a narrower box (the landing page's templates); otherwise it stays
                                           1280px, centred
                                           passWheel: true (the landing page) never lets the app trap the reader's
                                           scrolling: while the frame is passing through the window, a mouse wheel or a
                                           swipe up or down over it scrolls the page, and only a small scroll box under
                                           the pointer (a log, a list) scrolls first, to its end; once the frame is in
                                           front of the reader (as much of it on screen as fits), the app's panes scroll
                                           too, to their end, and then the page. A click inside hands the app the wheel
                                           until the pointer leaves the frame; a tap still reaches the app.
                                           Hover and the app's own demos are untouched
     v.show(src, device)                   'desktop' | 'tablet' | 'mobile'; a page already loaded is shown again, not reloaded
     v.device(device)                      changes the width of the page on show
     v.reload()                            loads the page on show again (the demos start over)

   Only the page on show is loaded; a page shown before stays loaded, hidden, so going back to it is instant. The page in the
   frame follows the site's style, theme and accent as they change. onUse runs the first time a person clicks, types or
   scrolls inside a frame (with passWheel, the first click, tap, key or swipe across: a wheel or swipe the page takes isn't
   the app's). */
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
    var frames = [], cur = null, dev = 'desktop', used = false, engaged = false, touching = false;
    var reduce = matchMedia('(prefers-reduced-motion: reduce)');
    var use = function(){ if (used) return; used = true; if (opts.onUse) opts.onUse(); };
    function place(f){
      if (!f) return;
      var bw = box.clientWidth, bh = box.clientHeight, w = dev === 'desktop' && opts.fill ? Math.max(typeof opts.fill === 'number' ? opts.fill : W.desktop, bw) : W[dev], pad = PAD[dev];
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
          if (opts.passWheel) pass(w, el);
          (opts.passWheel ? ['keydown'] : ['pointerdown', 'keydown', 'wheel', 'touchstart']).forEach(function(t){ w.addEventListener(t, function(e){ if (e.isTrusted) use(); }, { capture:true, passive:true }); });
          if (opts.onLoad) opts.onLoad(f, w.location.pathname);
        } catch(e){}
      });
      frames.push(f); place(f); return f;
    }
    // passWheel: the page around the frame takes the wheel, until a click inside, and every swipe up or down. A wheel's
    // notch glides the page frame by frame, each frame covering part of what is left (settled in about a quarter of a
    // second, like the browser's own wheel), so notches add up. Not the browser's smooth scroll: the landing page's
    // self-anchoring corrects the page with instant scrolls, which cut a smooth scroll short; here they add to the glide
    var left = 0, tau = 80, gliding = false, last = 0;
    var cap = { capture:true, passive:true }, held = { capture:true, passive:false };
    // moves the page by dy now; false at the page's top or end
    function by(dy){
      var y = window.scrollY, max = document.documentElement.scrollHeight - innerHeight;
      if ((dy > 0 && y >= max - .5) || (dy < 0 && y <= .5)) return false;
      window.scrollTo({ top:y + dy, behavior:'instant' }); return true;
    }
    // the reader is scrolling the page (the landing page's self-anchoring lets go of a pick, as it does for its own wheel)
    function scrolling(){ dispatchEvent(new CustomEvent('dm-frame-scroll')); }
    function glide(dy, t){
      left += dy; tau = t;
      if (gliding) return;
      gliding = true; last = performance.now();
      requestAnimationFrame(function go(now){
        // (a late frame covers more, so a busy page still gets there on time)
        var dt = Math.max(1, now - last); last = now;
        var s = Math.abs(left) < 1 ? left : left * (1 - Math.exp(-dt / tau));
        left -= s;
        if (!by(s) || Math.abs(left) < .5){ left = 0; gliding = false; return; }
        requestAnimationFrame(go);
      });
    }
    // a scroll box between the target and the page that can still scroll by dy: a small one (under 60% of the framed page's
    // height) always, and the app's big panes too (big) once the frame is in front of the reader
    function inner(w, t, dy, big){
      for (var a = t && t.nodeType === 1 ? t : t && t.parentElement; a && a !== w.document.body && a !== w.document.documentElement; a = a.parentElement){
        var cs = w.getComputedStyle(a);
        if (!/auto|scroll/.test(cs.overflowY) || a.scrollHeight <= a.clientHeight + 1 || (!big && a.clientHeight >= w.innerHeight * .6)) continue;
        if (dy > 0 ? a.scrollTop + a.clientHeight < a.scrollHeight - 1 : dy < 0 && a.scrollTop > 0) return true;
      }
      return false;
    }
    // the frame is in front of the reader, as much of it on screen as the window can show (owner, 26 Nov: "I can't scroll inside
    // the templates"): the app's own panes (the accounts table, a view, a list) then take the wheel or the swipe, to their end,
    // as nested scroll boxes do on any page, and the page carries on after. While the frame is only passing through the window,
    // the page keeps the scroll, so it never gets stuck behind a whole app on the way down
    function present(el){ var r = el.getBoundingClientRect(), vis = Math.min(r.bottom, innerHeight) - Math.max(r.top, 0); return r.height > 0 && vis >= Math.min(r.height, innerHeight) * .9 - 1; }
    function pass(w, el){
      w.addEventListener('wheel', function(e){
        if (engaged || e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
        // not the app's (its own wheel handlers, like the workflow board's pan, don't see it either)
        e.stopPropagation();
        // a small scroll box under the pointer (a run log, a list, a menu) that can still scroll that way takes the wheel, as it
        // would on any page, until it reaches its end (owner, 21 Nov: "I can't scroll in this window"); the app's big panes don't,
        // so the page never gets stuck behind a whole app
        if (inner(w, e.target, e.deltaY, present(el))) return;
        // a wheel that can't be held back is part of a scroll the browser started on the page before the frame came under
        // the pointer: the browser scrolls the page with it already
        if (!e.cancelable) return;
        e.preventDefault(); scrolling();
        var dy = e.deltaY * (e.deltaMode === 1 ? 40 : e.deltaMode === 2 ? innerHeight : 1);
        // a touchpad's many small steps are smooth already; with reduced motion nothing glides
        if (reduce.matches || (e.deltaMode === 0 && Math.abs(dy) < 50)) by(dy); else glide(dy, 80);
      }, held);
      // a mouse or pen click hands the app the wheel until the pointer leaves the frame
      w.addEventListener('mouseout', function(e){ if (!e.relatedTarget) engaged = false; }, cap);
      // a finger: once it has moved 6px, more up or down than across, the page follows it and the app doesn't see the drag;
      // a quick swipe carries on after the finger lifts, slowing down (not with reduced motion). A tap, or a swipe across,
      // is the app's. Where the finger is, in the page's view (the frame moving under it doesn't feed back)
      var t0 = null;
      var at = function(e){ var r = el.getBoundingClientRect(), k = r.height / el.offsetHeight; return { x:r.left + e.clientX * k, y:r.top + e.clientY * k }; };
      w.addEventListener('pointerdown', function(e){
        if (!e.isTrusted) return;
        left = 0;
        if (e.pointerType !== 'touch'){ engaged = true; use(); return; }
        var f = at(e);
        t0 = e.isPrimary ? { id:e.pointerId, x:f.x, y:f.y, ly:f.y, lt:e.timeStamp, page:null, v:0 } : null;
        touching = !!t0;
      }, cap);
      w.addEventListener('pointermove', function(e){
        if (!t0 || e.pointerId !== t0.id) return;
        // (a page no longer on show can't say where the finger is: that swipe is over. The landing page holds the turn while
        // a finger is down, so this is only a template picked meanwhile)
        if (!el.offsetHeight){ t0 = null; touching = false; return; }
        var f = at(e);
        if (t0.page === null){
          var dx = f.x - t0.x, dy = f.y - t0.y;
          if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
          t0.page = Math.abs(dy) >= Math.abs(dx);
          // a swipe over an app pane that can still scroll that way, with the frame in front of the reader, is the app's
          if (t0.page && present(el) && inner(w, e.target, -dy, true)){ t0 = null; touching = false; use(); return; }
          if (t0.page) scrolling();
        }
        if (!t0.page) return;
        e.stopPropagation();
        var step = t0.ly - f.y, dt = e.timeStamp - t0.lt;
        if (dt > 0) t0.v = .8 * step / dt + .2 * t0.v;
        t0.ly = f.y; t0.lt = e.timeStamp;
        by(step);
      }, cap);
      // (a swipe the browser is already scrolling, or will, isn't followed: it ends with a pointercancel)
      w.addEventListener('touchmove', function(e){ if (t0 && t0.page){ if (e.cancelable) e.preventDefault(); else { t0 = null; touching = false; } } }, held);
      w.addEventListener('pointerup', function(e){
        if (!t0 || e.pointerId !== t0.id) return;
        var t = t0; t0 = null; touching = false;
        if (!t.page) use();
        else if (!reduce.matches && e.timeStamp - t.lt < 60 && Math.abs(t.v) > .2) glide(t.v * 325, 325);
      }, cap);
      w.addEventListener('pointercancel', function(e){ if (t0 && e.pointerId === t0.id){ t0 = null; touching = false; } }, cap);
    }
    if (opts.passWheel) box.addEventListener('mouseleave', function(){ engaged = false; });
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
      // a finger is on the page on show (passWheel): what is under it shouldn't change
      get touching(){ return touching; },
    };
  };
})();
