// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, enter, swap } from '../core/core.js';
DM.def('error-recovery', (r, c) => {
  const list = $('.erx-list', r), box = $('.erx-box', r), go = $('.erx-go', r), sum = $('.erx-s', r), opts = $$('.erx-o', r);
  const steps = [['Pull 1,240 deals from the CRM'],['Write to the Pipeline 2026 sheet'],['Post the summary in #sales']];
  list.innerHTML = steps.map(s => `<div class="erx-row"><span class="g"></span><span class="tx">${s[0]}<span class="d"></span></span></div>`).join('');
  const rows = $$('.erx-row', r);
  const G = { done:`<span style="color:var(--dm-ok)">${I('check','xs')}</span>`, fail:`<span style="color:var(--dm-bad)">${I('alert','xs')}</span>`, run:'<span class="spin"></span>', wait:'<span class="dot" style="color:var(--dm-faint)"></span>', skip:`<span class="muted">${I('chev-r','xs')}</span>`, hand:`<span style="color:var(--dm-pl)">${I('user','xs')}</span>` };
  const set = (i, st, note) => { const rw = rows[i]; rw.className = 'erx-row ' + st; const g = $('.g', rw); g.innerHTML = G[st]; enter(g); swap($('.d', rw), note || ''); };
  set(0, 'done', 'Done in 8s'); set(1, 'fail', 'Error 403: the agent lost edit access to this sheet'); set(2, 'wait');
  let pick = 'retry';
  opts.forEach(o => o.onclick = () => { pick = o.dataset.o; opts.forEach(x => { x.classList.toggle('on', x === o); x.setAttribute('aria-checked', x === o); }); });
  go.onclick = () => c.run(async () => {
    box.classList.add('shut');
    if (pick === 'retry'){
      set(1, 'run', 'Asking for edit access'); swap(sum, 'Recovering'); await c.wait(1200);
      set(1, 'run', 'Access granted, retrying'); await c.wait(1000);
      set(1, 'done', 'Wrote 1,240 rows'); set(2, 'run'); await c.wait(1000);
      set(2, 'done', 'Posted to 14 people'); swap(sum, 'Recovered');
    } else if (pick === 'skip'){
      set(1, 'skip', 'Skipped, nothing was written'); set(2, 'run'); await c.wait(1000);
      set(2, 'done', 'Posted, with a note about the sheet'); swap(sum, '2 of 3 done');
    } else {
      set(1, 'hand', 'Maya has the error, the logs and the last good state'); swap(sum, 'Waiting on Maya');
    }
  });
});
