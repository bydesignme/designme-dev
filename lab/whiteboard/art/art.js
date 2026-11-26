/* The pictures in the Carousel demo (both its types) and the Image generation demo, on designme.dev only: photos from Pexels (https://www.pexels.com),
   free to use under the Pexels License (https://www.pexels.com/license/), not this repository's MIT licence. art/README.md
   links each photo. The faces on the people in the demos are the owner's own AI-generated headshots (art/README.md).
   The components people install draw each picture as a gradient of its colours (the --art on the element), and each person
   as their initials on their avatar colour; this script runs on the site's pages, finds each [data-pic] picture and lays the
   drawing of the same name over that gradient or those initials, once the card it is in comes near the screen (a picture
   waiting off to the side in a carousel loads with its card). The gradient stays underneath while the picture loads, and a
   face's initials stay until its photo has loaded. Thumbnails ([data-pic-size="s"]) get the small file. */
(() => {
  const base = document.currentScript ? new URL('.', document.currentScript.src).href : '/art/';
  const SEL = '[data-pic]';
  // a picture name, people/<initials>-<pexels id> for a face, or <initials>-g<nn> for a demo person's face (people/ on
  // disk). Faces are site only: installs keep the initials avatar
  const NAME = /^(people\/[A-Z]{2}-\d+|[A-Z]{2}-g\d{2}|[a-z0-9-]+)$/, FACE = /^[A-Z]{2}-g\d{2}$/;
  const lay = el => {
    const n = el.dataset.pic; if (!NAME.test(n)) return;
    const face = FACE.test(n);
    const file = face ? `people/${n}.jpg` : n.startsWith('people/') ? `${n}.jpg` : `${n}${el.dataset.picSize === 's' ? '-s' : ''}.webp`;
    // a demo can paint an avatar afresh (a new owner picked), so a face is laid again whenever its photo isn't on it
    if (el.dataset.picOn === n && (!face || el.style.backgroundImage.includes(file))) return;
    el.dataset.picOn = n;
    const url = `url("${base}${file}")`;
    if (face){
      // a person: the photo fills the avatar, centred on the face, once it has loaded; until then the initials show
      const put = () => {
        if (el.dataset.pic !== n) return;
        Object.assign(el.style, { backgroundImage:url, backgroundSize:'cover', backgroundPosition:'center', color:'transparent' });
      };
      const im = new Image(); im.onload = put; im.src = base + file; if (im.complete && im.naturalWidth) put();
      return;
    }
    // the picture over the gradient, so a slow connection still shows its colours. The site's own demos call the gradient
    // --art, the installed code on the component pages --dm-art
    const cs = getComputedStyle(el), g = (cs.getPropertyValue('--art') || cs.getPropertyValue('--dm-art')).trim();
    el.style.backgroundImage = `${url}${g ? ', ' + g : ''}`;
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
