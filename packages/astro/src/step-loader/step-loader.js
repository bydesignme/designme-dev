// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, seg, swap } from '../core/core.js';
DM.def('step-loader', (r, c) => {
  const steps = [['Reading Figma frames','Read 4 frames'],['Matching tokens','Matched 18 tokens'],['Writing components','Wrote 3 components'],['Checking contrast','Contrast passes']];
  const row = $('.stl-row', r), lab = $('.stl-lab', r), n = $('.stl-n', r), g = $('.stl-g', r), bars = $$('.stl-track i', r), list = $('.stl-list', r), fold = $('.stl-fold', r);
  let kind = 'radar', cur = 0, done = false;
  const glyph = () => kind === 'radar' ? '<span class="radar"></span>' : kind === 'think' ? '<span class="think on"><i></i><i></i><i></i><i></i></span>' : kind === 'spin' ? '<span class="spin"></span>' : '<span class="bars3"><i></i><i></i><i></i></span>';
  const paint = () => {
    g.innerHTML = done ? `<span style="color:var(--dm-ok)">${I('ok')}</span>` : glyph();
    list.innerHTML = steps.map((s, i) => `<li class="${i < cur || done ? 'done' : i === cur ? 'run' : ''}"><span class="g">${i < cur || done ? `<span style="color:var(--dm-ok)">${I('check','xs')}</span>` : i === cur ? glyph() : '<span class="dot" style="color:var(--dm-faint)"></span>'}</span>${i < cur || done ? s[1] : s[0]}</li>`).join('');
  };
  seg($('.seg2', r), v => { kind = v; paint(); });
  row.onclick = () => { const o = fold.classList.toggle('shut'); row.setAttribute('aria-expanded', !o); };
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
      done = false; cur = 0; bars.forEach(b => b.classList.remove('on', 'run')); lab.classList.add('shim'); paint();
      await c.wait(700);
    }
  });
});
