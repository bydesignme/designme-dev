// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, iconSwap, seg, swap } from '../core/core.js';
DM.def('step-loader', (r, c) => {
  // the chevron comes from I(), so it points at the icons wherever the component is mounted (designme.dev's own icon ids)
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d', 'xs stl-chev'));
  const steps = [['Reading Figma frames','Read 4 frames'],['Matching tokens','Matched 18 tokens'],['Writing components','Wrote 3 components'],['Checking contrast','Contrast passes']];
  const row = $('.stl-row', r), lab = $('.stl-lab', r), n = $('.stl-n', r), g = $('.stl-g', r), bars = $$('.stl-track i', r), list = $('.stl-list', r), fold = $('.stl-fold', r);
  let kind = 'radar', cur = 0, done = false;
  const glyph = () => kind === 'radar' ? '<span class="radar"></span>' : kind === 'think' ? '<span class="think on"><i></i><i></i><i></i><i></i></span>' : kind === 'spin' ? '<span class="spin"></span>' : '<span class="bars3"><i></i><i></i><i></i></span>';
  // the rows stay and change in place: a mark that changes (the loader, the tick, the dot) crossfades (iconSwap()), and one
  // that stays keeps playing where it is
  const MARK = { ok:() => `<span class="stl-ok">${I('ok')}</span>`, check:() => `<span class="stl-ok">${I('check','xs')}</span>`, dot:() => '<span class="dot" style="color:var(--dm-faint)"></span>' };
  const mark = (el, k) => { if (el.dataset.k === k) return; const first = !el.dataset.k; el.dataset.k = k; const put = () => { el.innerHTML = (MARK[k] || glyph)(); }; first ? put() : iconSwap(el, put); };
  list.innerHTML = steps.map(() => '<li><span class="g"></span> </li>').join('');
  const paint = () => {
    mark(g, done ? 'ok' : kind);
    [...list.children].forEach((li, i) => { const fin = i < cur || done;
      li.className = fin ? 'done' : i === cur ? 'run' : ''; mark(li.firstElementChild, fin ? 'check' : i === cur ? kind : 'dot'); li.lastChild.nodeValue = fin ? steps[i][1] : steps[i][0]; });
  };
  seg($('.seg2', r), v => { kind = v; paint(); });
  // the list's rows settle one after another as it opens (.mx-rows)
  row.onclick = () => { const o = fold.classList.toggle('shut'); row.setAttribute('aria-expanded', !o); list.classList.toggle('mx-play', !o); };
  paint();
  c.run(async () => {
    for (;;){
      for (cur = 0; cur < steps.length; cur++){
        bars[cur].classList.add('run'); paint();
        swap(lab, steps[cur][0]); swap(n, (cur + 1) + '/4');
        await c.wait(1900);
        bars[cur].classList.remove('run'); bars[cur].classList.add('on');
      }
      done = true; lab.classList.remove('shim'); swap(lab, 'Ready for review'); swap(n, '4/4'); paint();
      /* hold the finished state, then run the steps again */
      await c.wait(3200);
      // the pill says what runs again as the track empties, never "Ready for review" over an empty track
      done = false; cur = 0; bars.forEach(b => b.classList.remove('on', 'run')); lab.classList.add('shim'); swap(lab, steps[0][0]); swap(n, '1/4'); paint();
      await c.wait(700);
    }
  });
});
