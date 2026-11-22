// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, swap } from '../core/core.js';
// a button at work keeps its width, its words hidden under a spinner, and gets them back when it is done
function asxBusy(b, on){
  if (on){ if (b._busy != null) return; b._busy = b.innerHTML; b.style.width = b.getBoundingClientRect().width + 'px'; b.classList.add('busy'); b.insertAdjacentHTML('beforeend', '<span class="spin" aria-hidden="true"></span>'); b.setAttribute('aria-busy', 'true'); }
  else if (b._busy != null){ b.innerHTML = b._busy; b._busy = null; b.style.width = ''; b.classList.remove('busy'); b.removeAttribute('aria-busy'); }
}
// the words that say it saved: the green tick, then Saved
const asxSaved = () => I('check','xs').replace('class="i xs"', 'class="i xs asx-ok"') + '<span>Saved</span>';
DM.def('agent-settings', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{minus}', I('minus','xs')).replace('{plus}', I('plus','xs'));
  const root = $('.asx', r), steps = $$('.asx-steps button', r), knob = $('.asx-knob', r), ad = $('.asx-ad', r), tg = $$('.toggle', r), v = $('.asx-v', r), ta = $('.asx-ta', r);
  const AD = ['Asks before every change', 'Asks before edits to shared files', 'Works alone, asks only before publishing'];
  const CAPS = [1, 2, 5, 10, 20, 50];
  let s = { a:1, t:[true,false], cap:2, i:ta.value }, saved = JSON.stringify(s);
  // the bar of unsaved changes is out of reach while it's hidden; when it hides with the focus in it, the focus goes to the
  // top of the form instead of the page
  const words = $('.asx-bar>span', r);
  const dirty = () => { const bar = $('.asx-bar', r), was = root.classList.contains('dirty'), on = root.classList.toggle('dirty', JSON.stringify(s) !== saved); bar.inert = !on;
    if (on && !was) words.textContent = 'Unsaved changes';
    if (was && !on && bar.contains(document.activeElement)){ const to = $('[aria-checked="true"]', r) || $('button', r); if (to) to.focus({ preventScroll:true }); } };
  function setA(i, init){ s.a = i; steps.forEach((b, j) => b.setAttribute('aria-checked', j === i)); knob.style.left = `calc(3px + ${i} * (100% - 6px) / 3)`; if (!init) swap(ad, AD[i]); dirty(); }
  steps.forEach((b, i) => b.onclick = () => setA(i));
  tg.forEach((t, i) => t.onclick = () => { s.t[i] = !s.t[i]; t.setAttribute('aria-checked', s.t[i]); dirty(); });
  const cap = d => { s.cap = Math.max(0, Math.min(CAPS.length - 1, s.cap + d)); swap(v, '$' + CAPS[s.cap]); dirty(); };
  $('.asx-m', r).onclick = () => cap(-1); $('.asx-p', r).onclick = () => cap(1);
  ta.oninput = () => { s.i = ta.value; dirty(); };
  function apply(o){ s = JSON.parse(o); setA(s.a, true); swap(ad, AD[s.a]); tg.forEach((t, i) => t.setAttribute('aria-checked', s.t[i])); v.textContent = '$' + CAPS[s.cap]; ta.value = s.i; dirty(); }
  $('.asx-rs', r).onclick = () => apply(saved);
  // saving: Save keeps its width with a spinner in it, then the bar says Saved with the green tick, and goes
  $('.asx-sv', r).onclick = () => c.run(async () => { const b = $('.asx-sv', r); if (b._busy != null) return; asxBusy(b, true); await c.wait(600); saved = JSON.stringify(s); asxBusy(b, false); swap(words, asxSaved(), true); await c.wait(900); dirty(); });
  setA(1, true);
  // the preview flips one switch on its own, unless you take over first
  c.auto(1400, () => tg[1].click());
});
