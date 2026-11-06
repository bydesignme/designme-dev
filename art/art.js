/* The pictures in the Carousel demo (both its types) and the Image generation demo, on designme.dev only: photos from Pexels (https://www.pexels.com),
   free to use under the Pexels License (https://www.pexels.com/license/), not this repository's MIT licence. art/README.md
   links each photo.
   The components people install draw each picture as a gradient of its colours (the --art on the element); this script runs
   on the site's pages, finds each [data-pic] picture and lays the drawing of the same name over that gradient, once the card
   it is in comes near the screen (a picture waiting off to the side in a carousel loads with its card). The gradient stays
   underneath while the picture loads. Thumbnails ([data-pic-size="s"]) get the small file. */
(() => {
  const base = document.currentScript ? new URL('.', document.currentScript.src).href : '/art/';
  const SEL = '[data-pic]';
  const NAME = /^[a-z0-9-]+$/;
  const lay = el => {
    const n = el.dataset.pic; if (!NAME.test(n) || el.dataset.picOn === n) return;
    el.dataset.picOn = n;
    // the picture over the gradient, so a slow connection still shows its colours. The site's own demos call the gradient
    // --art, the installed code on the component pages --dm-art
    const cs = getComputedStyle(el), g = (cs.getPropertyValue('--art') || cs.getPropertyValue('--dm-art')).trim();
    el.style.backgroundImage = `url("${base}${n}${el.dataset.picSize === 's' ? '-s' : ''}.webp")${g ? ', ' + g : ''}`;
  };
  const near = new WeakSet();
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; io.unobserve(e.target); near.add(e.target); e.target.querySelectorAll(SEL).forEach(lay); if (e.target.matches(SEL)) lay(e.target);
  }), { rootMargin:'400px' }) : null;
  const watch = el => {
    const box = el.closest('[data-c], article') || el;
    if (!io || near.has(box)) return lay(el);
    io.observe(box);
  };
  const scan = root => { if (root.nodeType !== 1) return; if (root.matches(SEL)) watch(root); root.querySelectorAll(SEL).forEach(watch); };
  const go = () => {
    scan(document.body);
    new MutationObserver(ms => ms.forEach(m => {
      if (m.type === 'attributes'){ if (m.target.matches && m.target.matches(SEL)) watch(m.target); return; }
      m.addedNodes.forEach(scan);
    })).observe(document.body, { childList:true, subtree:true, attributes:true, attributeFilter:['data-pic'] });
  };
  document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', go) : go();
})();
