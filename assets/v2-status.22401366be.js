TPLS["thinking-states"] = "<div class=\"ths-dm dm\"><div class=\"dm-main\">\n  <div class=\"ths\" data-v=\"orbit\">\n    <div class=\"ths-row\">\n      <span class=\"ths-mk\" aria-hidden=\"true\"></span>\n      <span class=\"ths-l\" aria-hidden=\"true\"><span class=\"ths-tx shim\">Thinking</span><span class=\"ths-car\" hidden></span></span>\n      <span class=\"ths-t num\" aria-hidden=\"true\">0s</span>\n    </div>\n    <span class=\"ths-sr\" role=\"status\" aria-live=\"polite\">Thinking</span>\n  </div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Thinking state\"><button aria-pressed=\"true\" data-v=\"orbit\">Orbit</button><button aria-pressed=\"false\" data-v=\"morph\">Morph</button><button aria-pressed=\"false\" data-v=\"scan\">Scan</button><button aria-pressed=\"false\" data-v=\"stream\">Stream</button><button aria-pressed=\"false\" data-v=\"matrix\">Matrix</button><button aria-pressed=\"false\" data-v=\"stack\">Stack</button></div></div>\n</div>";
TPLS["step-loader"] = "<div class=\"stl dm\"><div class=\"dm-main\">\n  <button class=\"stl-row\" aria-expanded=\"false\">\n    <span class=\"stl-g\"></span>\n    <span class=\"stl-t\"><span class=\"stl-lab shim\">Reading Figma frames</span></span>\n    <span class=\"stl-n num\">1/4</span>\n    <svg class=\"i xs stl-chev\"><use href=\"#i-chev-d\"/></svg>\n  </button>\n  <div class=\"stl-track\"><i></i><i></i><i></i><i></i></div>\n  <div class=\"fold shut stl-fold\"><div><ol class=\"stl-list\"></ol></div></div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Loader\"><button aria-pressed=\"true\" data-v=\"radar\">Radar</button><button aria-pressed=\"false\" data-v=\"think\">Dots</button><button aria-pressed=\"false\" data-v=\"spin\">Ring</button><button aria-pressed=\"false\" data-v=\"bars\">Bars</button></div></div>\n</div>";
TPLS["status-pill"] = "<div class=\"spl dm\">\n  <div class=\"spl-stage dm-main\">\n    <div class=\"spl-pill\" aria-live=\"polite\"><div class=\"spl-in\"></div></div>\n  </div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Variant\"><button aria-pressed=\"true\" data-v=\"pill\">Pill</button><button aria-pressed=\"false\" data-v=\"bar\">Bar</button></div></div>\n</div>";
TPLS["toast"] = "<div class=\"tst dm\">\n  <div class=\"dm-main\"><div class=\"tst-slot\" aria-live=\"polite\"></div></div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"State\"><button aria-pressed=\"true\" data-v=\"ok\">Success</button><button aria-pressed=\"false\" data-v=\"err\">Error</button><button aria-pressed=\"false\" data-v=\"info\">Info</button><button aria-pressed=\"false\" data-v=\"load\">Loading</button></div></div>\n</div>";
TPLS["toast-stack"] = "<div class=\"tsk dm\">\n  <div class=\"dm-main\"><div class=\"tsk-stack\" aria-live=\"polite\"></div></div>\n  <div class=\"demo\"><button class=\"pill soft sm tsk-add\"><svg class=\"i s\"><use href=\"#i-bell\"/></svg>Send notification</button></div>\n</div>";
TPLS["run-cost"] = "<div class=\"rc panel\">\n  <div class=\"rc-h\"><span class=\"muted\">Credits used</span><span class=\"rc-st tag\"><span class=\"dot\"></span><span class=\"rc-stt\">Idle</span></span></div>\n  <div class=\"rc-big\"><span class=\"rc-n num\">0</span><span class=\"muted\"> / 2,000</span></div>\n  <div class=\"rc-track\"><div class=\"rc-fill\"></div><div class=\"rc-cap\" data-tip=\"The agent pauses here\"></div></div>\n  <div class=\"rc-rows\">\n    <div><span>Input tokens</span><span class=\"num rc-in\">0</span></div>\n    <div><span>Output tokens</span><span class=\"num rc-out\">0</span></div>\n    <div><span>Tool calls</span><span class=\"num rc-tools\">0</span></div>\n  </div>\n  <div class=\"rc-f\">\n    <label class=\"rc-cap-t\"><button class=\"toggle\" role=\"switch\" aria-checked=\"true\" aria-label=\"Pause at 90 percent\"></button><span>Pause at 90%</span></label>\n    <button class=\"pill primary sm rc-go\">Start run</button>\n  </div>\n</div>";
TPLS["run-queue"] = "<div class=\"dm rq-dm\" data-designs=\"card\"><div class=\"dm-main\">\n<div class=\"rq panel keep\">\n  <div class=\"rq-h\"><div class=\"rq-ht\"><b>Launch prep</b><span class=\"rq-st num\">4 jobs queued</span></div><div class=\"seg2\" role=\"group\" aria-label=\"Density\"><button aria-pressed=\"true\" data-v=\"full\">Detailed</button><button aria-pressed=\"false\" data-v=\"compact\">Compact</button></div></div>\n  <div class=\"rq-tot\" aria-hidden=\"true\"></div>\n  <div class=\"rq-b\">\n    <div class=\"fold shut rq-ff\"><div><div class=\"rq-sec\"><div class=\"rq-fin\"><span class=\"rq-av\" aria-hidden=\"true\"></span><span class=\"rq-jt\"><b class=\"rq-ft\">All jobs done</b><span class=\"rq-js rq-fs\"></span></span></div></div></div></div>\n    <div class=\"fold rq-rf\"><div><div class=\"rq-sec\"><span class=\"rq-l\">Running</span><ul class=\"rq-run\" aria-label=\"Running\"></ul></div></div></div>\n    <div class=\"fold rq-nf\"><div><div class=\"rq-sec\"><span class=\"rq-l\">Up next</span><ol class=\"rq-next\" aria-label=\"Up next\"></ol><p class=\"rq-none\">Nothing waiting</p></div></div></div>\n    <div class=\"fold rq-df\"><div><div class=\"rq-sec\"><span class=\"rq-l\">Done <span class=\"num rq-dn\">0</span></span><ul class=\"rq-done\" aria-label=\"Done\"></ul><p class=\"rq-none\">Nothing done yet</p></div></div></div>\n  </div>\n  <p class=\"rq-say\" aria-live=\"polite\"></p>\n</div>\n</div>\n<div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Run queue design\"><button aria-pressed=\"true\" data-v=\"classic\">Classic</button><button aria-pressed=\"false\" data-v=\"reorder\">Reorder</button><button aria-pressed=\"false\" data-v=\"segments\">Segments</button><button aria-pressed=\"false\" data-v=\"workers\">Workers</button></div></div>\n</div>";
TPLS["error-recovery"] = "<div class=\"erx panel\">\n  <div class=\"erx-h\"><span class=\"erx-t\">Sync the pipeline to Sheets</span><span class=\"erx-s muted\">Stopped at step 2</span></div>\n  <div class=\"erx-list\"></div>\n  <div class=\"fold erx-box\"><div><div class=\"erx-in\">\n    <div class=\"erx-q\">How should the agent continue?</div>\n    <div class=\"erx-opts\" role=\"radiogroup\">\n      <button class=\"erx-o on\" data-o=\"retry\" role=\"radio\" aria-checked=\"true\"><i></i><span>Ask for edit access, then retry</span></button>\n      <button class=\"erx-o\" data-o=\"skip\" role=\"radio\" aria-checked=\"false\"><i></i><span>Skip it and post the summary</span></button>\n      <button class=\"erx-o\" data-o=\"hand\" role=\"radio\" aria-checked=\"false\"><i></i><span>Hand it over to Maya</span></button>\n    </div>\n    <button class=\"pill primary sm erx-go\">Continue</button>\n  </div></div></div>\n</div>";
TPLS["context-meter"] = "<div class=\"ctm\" data-open=\"1\">\n  <button class=\"ctm-tg\" aria-expanded=\"true\" aria-label=\"Context\"><span class=\"ctm-ring\" aria-hidden=\"true\"><svg viewBox=\"0 0 20 20\"><circle class=\"tr\" cx=\"10\" cy=\"10\" r=\"7.5\"/><circle class=\"fl\" cx=\"10\" cy=\"10\" r=\"7.5\" pathLength=\"100\"/></svg></span><span><span class=\"ctm-pc num\">0%</span> of context used</span>{chev}</button>\n  <div class=\"ctm-pop panel\" role=\"region\" aria-label=\"What fills the context\">\n    <div class=\"ctm-ph\"><span>In context</span><span class=\"num\"><b class=\"ctm-tot\">0k</b> of 200k tokens</span></div>\n    <div class=\"ctm-bar\" aria-hidden=\"true\"></div>\n    <div class=\"ctm-leg\"></div>\n    <div class=\"ctm-msg\" aria-live=\"polite\"><span></span></div>\n    <div class=\"ctm-f\"><span class=\"ctm-hint\">Summarises older turns</span><button class=\"pill ghost sm ctm-go\">Compact</button></div>\n  </div>\n</div>";
TPLS["action-log"] = "<div class=\"dm alg-dm\" data-designs=\"card\"><div class=\"dm-main\">\n<div class=\"alg panel\">\n  <div class=\"alg-h\"><span class=\"alg-t\">Agent activity</span><span class=\"alg-st\"><span class=\"spin\"></span><span class=\"alg-sum\">Running</span></span></div>\n  <ol class=\"alg-list\"></ol>\n</div>\n</div>\n<div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Action log design\"><button aria-pressed=\"true\" data-v=\"classic\">Classic</button><button aria-pressed=\"false\" data-v=\"feed\">Feed</button><button aria-pressed=\"false\" data-v=\"phases\">Phases</button><button aria-pressed=\"false\" data-v=\"scrub\">Scrubber</button></div></div>\n</div>";
TPLS["agent-run-timeline"] = "<div class=\"art panel\">\n  <div class=\"art-h\"><div class=\"art-hd\"><div class=\"art-t\">Run 4821, update the pricing page</div><div class=\"art-s muted num\">Starting</div></div><span class=\"art-tag tag\"><span class=\"spin\" aria-hidden=\"true\"></span>Running</span></div>\n  <div class=\"art-key num\" role=\"list\" aria-label=\"Time by kind of step\"></div>\n  <div class=\"art-grid\">\n    <div class=\"art-axis\" aria-hidden=\"true\"><span></span><div class=\"art-ticks\"></div><span></span></div>\n    <div class=\"art-past\" aria-hidden=\"true\"></div>\n    <div class=\"art-rows\"></div>\n    <div class=\"art-head\" aria-hidden=\"true\"><i></i><span class=\"art-now num\">0.0s</span></div>\n  </div>\n  <div class=\"art-f muted num\"></div>\n</div>";
TPLS["run-summary"] = "<div class=\"dm rsu-dm\" data-designs=\"card\"><div class=\"dm-main\">\n<div class=\"rsu panel\">\n  <div class=\"rsu-h\"><span class=\"rsu-g\">{ok}</span><div><div class=\"rsu-t\">Run complete</div><div class=\"rsu-s muted\">Finished in 12m 40s</div></div><button class=\"ib rsu-more\" aria-label=\"More\" data-tip=\"Run details\">{more}</button></div>\n  <p class=\"rsu-title\">Pricing cards now use spacing tokens</p>\n  <div class=\"rsu-stats\">\n    <span><b class=\"num\" data-n=\"6\">0</b> files</span>\n    <span><b class=\"num\" data-n=\"14\">0</b> steps</span>\n    <span><b class=\"num\" data-n=\"182\" data-u=\"k\">0</b> tokens</span>\n    <span><b class=\"num\" data-n=\"0.84\" data-p=\"$\">0</b> cost</span>\n  </div>\n  <div class=\"rsu-sec\"><div class=\"rsu-l\">What changed</div>\n    <div class=\"rsu-it\"><span class=\"mono\">PricingCard.tsx</span><span class=\"num\"><i class=\"a\">+24</i> <i class=\"x\">−18</i></span></div>\n    <div class=\"rsu-it\"><span class=\"mono\">tokens.css</span><span class=\"num\"><i class=\"a\">+9</i> <i class=\"x\">−2</i></span></div>\n    <div class=\"rsu-it\"><span class=\"mono\">Pricing.test.tsx</span><span class=\"num\"><i class=\"a\">+31</i> <i class=\"z\">−0</i></span></div>\n  </div>\n  <div class=\"rsu-sec\"><div class=\"rsu-l\">Needs you</div>\n    <div class=\"rsu-it rsu-need\"><span class=\"dot\" style=\"color:var(--warn-mark)\"></span><span class=\"rsu-nt\">The yearly badge overlaps the price on mobile</span><button class=\"pill soft sm rsu-fix\">Review</button></div>\n  </div>\n  <div class=\"rsu-acts\"><button class=\"pill primary sm\">Open changes</button><button class=\"pill ghost sm rsu-undo\">Undo all</button></div>\n</div>\n</div>\n<div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Run summary design\"><button aria-pressed=\"true\" data-v=\"classic\">Classic</button><button aria-pressed=\"false\" data-v=\"receipt\">Receipt</button><button aria-pressed=\"false\" data-v=\"recap\">Recap</button></div></div>\n</div>";
TPLS["agent-phases"] = "<div class=\"aph\">\n  <button class=\"aph-h\" aria-expanded=\"false\" aria-disabled=\"true\"><span class=\"aph-g\"></span><span class=\"aph-l\"></span><span class=\"aph-t num\">0s</span><svg class=\"i xs aph-chev\"><use href=\"#i-chev-d\"/></svg></button>\n  <div class=\"aph-tr\" aria-hidden=\"true\"><i></i><i></i><i></i><i></i><i></i><i></i></div>\n  <div class=\"aph-x\"></div>\n  <div class=\"fold shut aph-fold\"><div><ol class=\"aph-list\"></ol></div></div>\n  <p class=\"aph-sr\" role=\"status\"></p>\n</div>";
TPLS["web-search"] = "<div class=\"wsx panel\">\n  <button class=\"wsx-h\" aria-expanded=\"true\"><span class=\"wsx-ic\"><span class=\"spin\"></span></span><span class=\"wsx-st shim\">Searching the web</span><span class=\"wsx-marks\" aria-hidden=\"true\"></span>{chev}</button>\n  <div class=\"fold wsx-fold\"><div><div class=\"wsx-list\"></div></div></div>\n  <div class=\"wsx-ans\"></div>\n  <p class=\"wsx-sr\" role=\"status\"></p>\n</div>";
TPLS["browser-session"] = "<div class=\"bws panel\">\n  <div class=\"bws-h\"><div class=\"bws-ht\"><b>Pricing research</b><span class=\"muted bws-st\" aria-live=\"polite\"></span></div><div class=\"bws-ctl\"><button class=\"ib bws-pause\" aria-label=\"Pause\" data-tip=\"Pause\">{pause}</button><button class=\"pill line sm bws-take\" aria-pressed=\"false\">Take over</button></div></div>\n  <div class=\"bws-win\"><div class=\"bws-bar\"><span class=\"bws-dots\" aria-hidden=\"true\"><i></i><i></i><i></i></span><div class=\"bws-url\">{search}<span></span></div></div><div class=\"bws-vp\"></div></div>\n  <ol class=\"bws-steps\" aria-label=\"Steps\"></ol>\n</div>";
TPLS["trace-view"] = "<div class=\"trv panel\">\n  <div class=\"trv-h\"><div class=\"trv-ht\"><b>Pricing research</b><span class=\"muted trv-st\" aria-live=\"polite\"></span></div><span class=\"trv-tot num\">0.00s</span></div>\n  <div class=\"trv-lg\" role=\"list\" aria-label=\"Spans by kind\"></div>\n  <div class=\"trv-ax\" aria-hidden=\"true\"><span>Span</span><span class=\"trv-sc\"></span><span class=\"trv-tk\">Tokens</span><span class=\"trv-ms\">Time</span></div>\n  <div class=\"trv-rows\" role=\"group\" aria-label=\"Spans\"></div>\n  <div class=\"fold shut trv-dt\" inert><div><div class=\"trv-dc\" role=\"region\" aria-label=\"Span details\"></div></div></div>\n</div>";
TPLS["agent-inbox"] = "<div class=\"aib panel\">\n  <div class=\"aib-h\"><b>Inbox</b><span class=\"muted aib-st\" aria-live=\"polite\"></span></div>\n  <div class=\"aib-gs\"></div>\n</div>";
TPLS["agent-tree"] = "<div class=\"dm atr-dm\" data-designs=\"card\"><div class=\"dm-main\">\n<div class=\"atr panel\">\n  <div class=\"atr-h\"><div class=\"atr-ht\"><b>Welcome email</b><span class=\"muted atr-st\"><span class=\"m\" aria-live=\"polite\">Running</span> · <span class=\"num ck\">0:00</span></span></div><span class=\"atr-tot num\">$0.00</span></div>\n  <p class=\"atr-detail\" aria-live=\"polite\"></p>\n  <div class=\"atr-tree\" role=\"tree\" aria-label=\"Agents\"></div>\n</div>\n</div>\n<div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Agent tree design\"><button aria-pressed=\"false\" data-v=\"chat\">In chat</button><button aria-pressed=\"true\" data-v=\"classic\">Tree</button><button aria-pressed=\"false\" data-v=\"cost\">Cost</button><button aria-pressed=\"false\" data-v=\"map\">Map</button></div></div>\n</div>";
TPLS["agent-lanes"] = "<div class=\"dm aln-dm\" data-designs=\"card\"><div class=\"dm-main\"><div class=\"aln panel\">\n  <div class=\"aln-h\"><span class=\"aln-ic\">{users}</span><span class=\"aln-t\">3 agents working</span><span class=\"aln-m muted num\">0:00</span><span class=\"aln-ct num\">0 of 9 steps</span><button class=\"pill soft sm aln-pause\">{pause}Pause all</button></div>\n  <div class=\"aln-rows\"></div>\n</div></div>\n<div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Agent lanes design\"><button aria-pressed=\"true\" data-v=\"classic\">Classic</button><button aria-pressed=\"false\" data-v=\"swimlanes\">Swimlanes</button><button aria-pressed=\"false\" data-v=\"crew\">Crew</button></div></div>\n</div>";
TPLS["reasoning-trail"] = "<div class=\"rtr-dm dm\"><div class=\"dm-main\"><div class=\"rtr panel\">\n  <button class=\"rtr-h\" aria-expanded=\"true\">\n    <span class=\"think on rtr-mark\"><i></i><i></i><i></i><i></i></span>\n    <span class=\"rtr-title shim\">Reasoning</span><span class=\"rtr-time num muted\">0s</span>\n    <svg class=\"i xs rtr-chev\"><use href=\"#i-chev-d\"/></svg>\n  </button>\n  <div class=\"fold rtr-fold\"><div>\n    <div class=\"rtr-body\"></div>\n  </div></div>\n</div></div>\n  <div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"View\"><button aria-pressed=\"true\" data-v=\"plan\">Plan</button><button aria-pressed=\"false\" data-v=\"notes\">Notes</button><button aria-pressed=\"false\" data-v=\"sources\">Sources</button><button aria-pressed=\"false\" data-v=\"edits\">Edits</button></div></div>\n</div>";
TPLS["thinking"] = "<div class=\"tk\" data-open=\"1\">\n  <button class=\"tk-h\" aria-expanded=\"true\">\n    <span class=\"tk-mark\"><span class=\"think on\"><i></i><i></i><i></i><i></i></span></span>\n    <span class=\"tk-title shim\">Checking the pricing page</span><span class=\"tk-time num\">0s</span>\n    <svg class=\"i xs tk-chev\"><use href=\"#i-chev-d\"/></svg>\n  </button>\n  <div class=\"fold tk-fold\"><div><ol class=\"tk-list\" aria-live=\"polite\"></ol></div></div>\n</div>";
/* ---------- Status pill ---------- */
DM.def('status-pill', (r, c) => {
  const pill = $('.spl-pill', r), box = $('.spl-in', r), root = $('.spl', r);
  pill.insertAdjacentHTML('beforeend', '<div class="spl-track"><div class="spl-fill"></div></div>');
  const fill = $('.spl-fill', r);
  // the switch morphs in three beats, so the words and the shape never move at once: the line fades out with its track,
  // the pill changes shape while it's empty, then the new layout fades in with the track under it
  let morph = 0;
  seg($('.seg2', r), v => {
    const bar = v === 'bar', id = ++morph; if (root.classList.contains('bar') === bar) return;
    pill.style.width = pill.offsetWidth + 'px'; box.classList.add('out'); root.classList.add('mo');
    c.later(REDUCE ? 0 : 170, () => { if (id !== morph) return; root.classList.toggle('bar', bar); fit(); });
    c.later(REDUCE ? 0 : 430, () => { if (id !== morph) return; morph = 0; box.classList.remove('out'); root.classList.remove('mo'); });
  });
  /* both variants hug their content; the bar keeps a little extra room for its track */
  function fit(){
    box.style.width = 'max-content'; const w = box.scrollWidth; box.style.width = '';
    pill.style.width = (root.classList.contains('bar') ? Math.max(w + 24, 300) : w) + 'px';
  }
  function set(htmlStr, pct){
    pill.style.width = pill.offsetWidth + 'px';
    box.classList.add('out');
    // mid-switch, the morph brings the line back once the shape has settled
    c.later(180, () => { box.innerHTML = htmlStr; if (!morph) box.classList.remove('out'); fit(); });
    if (pct !== undefined) fill.style.width = pct + '%';
  }
  const think = '<span class="think on"><i></i><i></i><i></i><i></i></span>';
  box.innerHTML = '<span class="g"><span class="dot" style="color:var(--faint)"></span></span><span class="fg2">Ready for a task</span><span class="end"></span>';
  requestAnimationFrame(fit);
  const idle = '<span class="g"><span class="dot" style="color:var(--faint)"></span></span><span class="fg2">Ready for a task</span><span class="end"></span>';
  c.run(async () => { for (;;){
    await c.wait(1100);
    set(`<span class="g" style="color:var(--fg)">${think}</span><span class="shim">Thinking</span><span class="end"></span>`, 8); await c.wait(1800);
    set(`<span class="g" style="color:var(--fg)"><span class="radar"></span></span><span class="shim">Reading Figma frames</span><span class="m n">1 of 4</span><span class="end"></span>`, 22);
    await c.wait(400);
    // the count ticks over in place, under a steady line
    for (let i = 2; i <= 4; i++){ await c.wait(650); const n = $('.n', box); if (n) n.textContent = i + ' of 4'; fill.style.width = (22 + i * 8) + '%'; }
    await c.wait(700);
    set(`<span class="g" style="color:var(--fg)"><span class="spin"></span></span><span class="shim">Editing</span><span class="fchip" style="height:24px"><span class="ft re">TSX</span>PricingCard.tsx</span><span class="end"></span>`, 64); await c.wait(2000);
    set(`<span class="g" style="color:var(--warn-mark)"><span class="dot"></span></span><span>Waiting for your approval</span><button class="pill primary sm">Review</button>`, 72);
    /* waits for Review, and carries on by itself after a while so the loop never stalls; once you have taken over, it waits for you */
    await new Promise(res => { c.later(220, () => { const b = $('.pill', box); if (b) b.onclick = res; }); c.auto(8000, res); });
    set(`<span class="g" style="color:var(--fg)"><span class="spin"></span></span><span class="shim">Applying 4 changes</span><span class="end"></span>`, 88); await c.wait(1600);
    set(`<span class="g" style="color:var(--ok)">${I('ok')}</span><span>Done</span><span class="m">4 files changed · 18s</span><span class="end"></span>`, 100);
    await c.wait(3200); set(idle, 0);
  } });
});
/* ---------- Step loader ---------- */
DM.def('step-loader', (r, c) => {
  const steps = [['Reading Figma frames','Read 4 frames'],['Matching tokens','Matched 18 tokens'],['Writing components','Wrote 3 components'],['Checking contrast','Contrast passes']];
  const row = $('.stl-row', r), lab = $('.stl-lab', r), n = $('.stl-n', r), g = $('.stl-g', r), bars = $$('.stl-track i', r), list = $('.stl-list', r), fold = $('.stl-fold', r);
  let kind = 'radar', cur = 0, done = false;
  const glyph = () => kind === 'radar' ? '<span class="radar"></span>' : kind === 'think' ? '<span class="think on"><i></i><i></i><i></i><i></i></span>' : kind === 'spin' ? '<span class="spin"></span>' : '<span class="bars3"><i></i><i></i><i></i></span>';
  const paint = () => {
    g.innerHTML = done ? `<span style="color:var(--ok)">${I('ok')}</span>` : glyph();
    list.innerHTML = steps.map((s, i) => `<li class="${i < cur || done ? 'done' : i === cur ? 'run' : ''}"><span class="g">${i < cur || done ? `<span style="color:var(--ok)">${I('check','xs')}</span>` : i === cur ? glyph() : '<span class="dot" style="color:var(--faint)"></span>'}</span>${i < cur || done ? s[1] : s[0]}</li>`).join('');
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
/* ---------- Thinking states ---------- */
DM.def('thinking-states', (r, c) => {
  const steps = ['Thinking', 'Reading 3 files', 'Searching the docs', 'Comparing 2 options', 'Drafting the answer'];
  const box = $('.ths', r), mk = $('.ths-mk', r), tx = $('.ths-tx', r), car = $('.ths-car', r), time = $('.ths-t', r), sr = $('.ths-sr', r);
  // Orbit, Morph, Scan and Stream as a grid of dots, each at its own density: which part each dot plays, and when
  const grid = k => {
    const n = { orbit:5, scan:6, morph:7, stream:4 }[k], rows = k === 'stream' ? 3 : n, at = (x, y) => y * n + x;
    const cls = Array(n * rows).fill(''), dly = Array(n * rows).fill(null), pose = new Set();
    const run = (order, dur) => order.forEach((c, i) => { dly[c] = ((i / order.length) - 1) * dur; });
    if (k === 'orbit'){
      const ring = [];
      for (let x = 0; x < n; x++) ring.push(at(x, 0));
      for (let y = 1; y < n; y++) ring.push(at(n - 1, y));
      for (let x = n - 2; x >= 0; x--) ring.push(at(x, n - 1));
      for (let y = n - 2; y > 0; y--) ring.push(at(0, y));
      ring.forEach(c => { cls[c] = 'r'; }); run(ring, 1.6); cls[at(2, 2)] = 'c';
      [0, ring.length - 1, ring.length - 2].forEach(i => pose.add(ring[i]));
    } else if (k === 'scan'){
      const len = [6, 0, 5, 0, 3, 0];
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++){ const c = at(x, y); cls[c] = x < len[y] ? 'l' : 'b'; dly[c] = (x / n - 1) * 1.6; if (x === 2) pose.add(c); }
    } else if (k === 'morph'){
      for (let y = 0; y < n; y++) for (let x = 0; x < n; x++){
        const rect = y >= 1 && y <= 5, circ = (x - 3) ** 2 + (y - 3) ** 2 <= 10, tri = Math.abs(x - 3) <= y / 2;
        const c = at(x, y); cls[c] = 'm' + ((rect ? 1 : 0) | (circ ? 2 : 0) | (tri ? 4 : 0)); if (circ) pose.add(c);
        dly[c] = -(((c * 37 + 11) % 17) / 17) * .32;
      }
    } else {
      for (let y = 0; y < rows; y++) for (let x = 0; x < n; x++){ const c = at(x, y); cls[c] = 's' + c; if (y < 2) pose.add(c); }
    }
    return `<span class="ths-dg" data-k="${k}">` + cls.map((x, c) => `<i class="${x}${pose.has(c) ? ' p' : ''}"${dly[c] != null ? ` style="animation-delay:${dly[c].toFixed(3)}s"` : ''}></i>`).join('') + '</span>';
  };
  // the mark each state draws on its tile
  const MARKS = {
    orbit:grid('orbit'),
    morph:grid('morph'),
    scan:grid('scan'),
    stream:grid('stream'),
    matrix:'<span class="ths-mtx">' + '<i></i>'.repeat(16) + '</span>',
    stack:'<span class="ths-stk"><i></i><i></i><i></i></span>'
  };
  let v = box.dataset.v || 'orbit', at = 0, secs = 0, typed = 0;
  // the agent's own pace: these waits are not shortened under reduced motion, so the line still changes every few seconds
  const pause = ms => new Promise(res => c.later(ms, res));
  // Stream types the line out behind its caret; the others crossfade it (Orbit shimmering). A newer line cancels the typing
  const type = async t => {
    const k = ++typed; if (tx._sw){ clearTimeout(tx._sw.t); tx._sw = null; } tx.classList.remove('out'); tx.textContent = '';
    for (let i = 1; i <= t.length; i++){ await pause(32); if (k !== typed) return; tx.textContent = t.slice(0, i); }
  };
  const show = (t, fresh) => {
    tx.classList.toggle('shim', v === 'orbit'); car.hidden = v !== 'stream';
    if (v === 'stream' && fresh && !REDUCE) type(t);
    else { typed++; if (fresh) swap(tx, t); else { if (tx._sw){ clearTimeout(tx._sw.t); tx._sw = null; } tx.classList.remove('out'); tx.textContent = t; } }
    // a screen reader hears each new step once, never the letters as they type
    if (fresh) sr.textContent = t;
  };
  const pick = x => { v = x; box.dataset.v = x; mk.innerHTML = MARKS[x]; show(steps[at], false); };
  seg($('.seg2', r), pick);
  pick(v);
  c.every(1000, () => { secs++; time.textContent = secs + 's'; });
  let first = true;
  c.run(async () => {
    for (;;){
      for (at = 0; at < steps.length; at++){ show(steps[at], !first); first = false; await pause(2600); }
      // a fresh question: the clock starts again
      at = 0; secs = 0; time.textContent = '0s';
    }
  });
});
/* ---------- Reasoning trail ---------- */
DM.def('reasoning-trail', (r, c) => {
  const body = $('.rtr-body', r), head = $('.rtr-h', r), fold = $('.rtr-fold', r), title = $('.rtr-title', r), time = $('.rtr-time', r), mark = $('.rtr-mark', r);
  let tab = 'plan', planDone = 0, secs = 0, finished = false;
  const plan = [['Open the onboarding file','4 frames'],['Compare it with the design system','12 components'],['Find spacing that breaks the 8px grid','3 frames'],['Draft fixes for review','Ready']];
  const views = {
    plan: () => plan.map((p, i) => `<div class="rtr-li ${i === planDone && !finished ? 'now' : ''}"><span class="g">${i < planDone ? `<span style="color:var(--ok)">${I('check','xs')}</span>` : i === planDone && !finished ? '<span class="pulse"></span>' : '<span class="dot" style="color:var(--faint)"></span>'}</span><span>${p[0]}<span class="d">${i < planDone ? p[1] : i === planDone && !finished ? 'Working' : 'Next'}</span></span></div>`).join(''),
    notes: () => ['The hero card uses 20px padding, every other card uses 24px.','Mobile frames already follow the grid, desktop drifted.','Two buttons use a hard-coded grey instead of a token.'].map(t => `<div class="rtr-li"><span class="g"><span class="dot" style="color:var(--faint)"></span></span><span>${t}</span></div>`).join(''),
    sources: () => `<div class="rtr-src"><button class="fchip lnk" data-tip-at="below" data-tip="Figma, 4 frames read">${I('figma','xs')}Onboarding.fig</button><button class="fchip lnk" data-tip-at="below" data-tip="src/styles/tokens.ts, 212 lines"><span class="ft">TS</span>tokens.ts</button><button class="fchip lnk" data-tip-at="below" data-tip="src/components/Card.tsx, 2 edits"><span class="ft re">TSX</span>Card.tsx</button><button class="fchip lnk" data-tip-at="below" data-tip="designme.dev/guide/spacing">${I('globe','xs')}Spacing guide</button></div>`,
    edits: () => `<div class="rtr-li"><span class="g">${I('edit','xs')}</span><span>Card.tsx<span class="d">2 lines</span></span></div><div class="rtr-edit"><div class="x">padding: 20px;</div><div class="a">padding: var(--space-6);</div></div><div class="rtr-li"><span class="g">${I('edit','xs')}</span><span>Button.tsx<span class="d">1 line</span></span></div><div class="rtr-edit"><div class="x">color: #8a8a8a;</div><div class="a">color: var(--text-dim);</div></div>`
  };
  const paint = anim => { body.innerHTML = views[tab](); if (anim) stagger(Array.from(body.children), 50); };
  // the header opens and folds the trail, by click, Enter or Space, and aria-expanded always says which
  let open = true;
  const setOpen = o => { open = o; fold.classList.toggle('shut', !o); fold.inert = !o; head.setAttribute('aria-expanded', o); };
  c.on(head, 'click', () => setOpen(!open));
  c.on(head, 'keydown', e => { if ((e.key === 'Enter' || e.key === ' ') && !e.altKey && !e.ctrlKey && !e.metaKey){ e.preventDefault(); if (!e.repeat) setOpen(!open); } });
  // the trail keeps the room of its tallest view, so the tabs under it stay put and the trail sits centred above them.
  // A hidden copy measures each view at the trail's own width
  const rtr = $('.rtr', r), main = rtr.closest('.dm-main'); let fitW = 0;
  const fit = () => {
    const w = rtr.offsetWidth; if (!main || !w || w === fitW) return; fitW = w;
    const ghost = rtr.cloneNode(true), gb = $('.rtr-body', ghost);
    ghost.inert = true; ghost.setAttribute('aria-hidden', 'true'); $('.rtr-fold', ghost).classList.remove('shut');
    Object.assign(ghost.style, { position:'absolute', left:'0', top:'0', width:w + 'px', visibility:'hidden', pointerEvents:'none' });
    main.appendChild(ghost);
    let h = 0; for (const v in views){ gb.innerHTML = views[v](); h = Math.max(h, ghost.offsetHeight); }
    ghost.remove(); main.style.minHeight = Math.ceil(h) + 'px'; main.style.justifyContent = 'center';
  };
  // switching views grows or shrinks the open trail to its new height instead of jumping to it
  const grow = from => {
    if (REDUCE || !open) return; const to = body.offsetHeight; if (Math.abs(to - from) < 1) return;
    const cs = getComputedStyle(body), ms = parseFloat(cs.getPropertyValue('--t')) * 1000 || 450;
    if (body._a) body._a.cancel();
    body.style.overflow = 'hidden';
    body._a = body.animate([{ height:from + 'px' }, { height:to + 'px' }], { duration:ms, easing:cs.getPropertyValue('--ease').trim() || 'ease' });
    body._a.onfinish = body._a.oncancel = () => { body.style.overflow = ''; body._a = null; };
  };
  seg($('.seg2', r), v => { const from = body.offsetHeight; tab = v; paint(true); grow(from); });
  paint(true); fit();
  const ro = new ResizeObserver(fit); ro.observe(main || rtr); c.offs.push(() => ro.disconnect());
  if (document.fonts) document.fonts.ready.then(() => { if (!c.dead){ fitW = 0; fit(); } });
  c.every(1000, () => { if (!finished){ secs++; time.textContent = secs + 's'; } });
  c.run(async () => {
    for (planDone = 0; planDone < plan.length; ){
      await c.wait(1500); planDone++; if (tab === 'plan') paint(false);
    }
    finished = true; title.classList.remove('shim'); mark.classList.remove('on'); swap(title, 'Reasoned for ' + Math.max(secs, 5) + 's'); time.textContent = ''; if (tab === 'plan') paint(false);
  });
});
/* ---------- Thinking ---------- */
DM.def('thinking', (r, c) => {
  const tk = $('.tk', r), list = $('.tk-list', r), title = $('.tk-title', r), time = $('.tk-time', r), head = $('.tk-h', r), fold = $('.tk-fold', r), mark = $('.tk-mark', r);
  // each step: what the agent does and what it found. Measuring the cards times out once, counts down and tries again
  const S = [
    ['Open Pricing v4 in Figma', '6 frames, 3 plan cards', 1300],
    ['Read the spacing tokens', 'tokens.css, 9 spacing values', 1200],
    ['Measure the plan cards', '3 cards are off the 8px grid', 1400, { retry:"Figma didn't answer", tip:'Pro has an 18px gap, Team 22px and Enterprise 13px' }],
    ['Check text contrast', 'All 14 text pairs pass AA', 1100],
    ['Plan the fix', '2 changes, about 3 minutes', 1200]
  ];
  const setOpen = o => { tk.dataset.open = o ? '1' : '0'; fold.classList.toggle('shut', !o); head.setAttribute('aria-expanded', o); };
  head.onclick = () => setOpen(tk.dataset.open !== '1');
  // the line under a step opens and then crossfades; what the step found writes itself in a word at a time, and a tip on it
  // holds the detail
  const words = t => t.split(' ').map((w, i, a) => `<span class="w" style="animation-delay:${i * 45}ms">${w}${i < a.length - 1 ? ' ' : ''}</span>`).join('');
  const note = (li, text, tip, found) => { const res = $('.res', li), sp = res.firstElementChild; res.classList.add('on');
    if (found){ sp._sw = null; sp.classList.remove('out'); sp.innerHTML = tip ? `<span data-tip="${tip}">${words(text)}</span>` : words(text); }
    else swap(sp, text); };
  const glyph = (li, g) => { const mk = $('.mk', li); mk.innerHTML = g; enter(mk.firstElementChild); };
  let secs = 0, live = true; c.every(1000, () => { if (live){ secs++; time.textContent = secs + 's'; } });
  c.run(async () => {
    await c.wait(600);
    for (const [lab, res, ms, x] of S){
      const li = html(`<li class="tk-st run"><span class="mk"><span class="spin"></span></span><div class="tx"><span class="tk-ln"><span class="lab shim">${lab}</span><span class="tk-dur num"></span></span><span class="res"><span></span></span></div></li>`);
      list.appendChild(li); enter(li);
      const l = $('.lab', li); let took = ms;
      await c.wait(ms);
      if (x && x.retry){
        li.classList.replace('run', 'retry'); l.classList.remove('shim'); glyph(li, I('clock','xs'));
        for (let k = 2; k > 0; k--){ note(li, `${x.retry}. Trying again in ${k}s`); await c.wait(1000); }
        li.classList.replace('retry', 'run'); l.classList.add('shim'); glyph(li, '<span class="spin"></span>'); note(li, 'Trying again'); await c.wait(900); took += 2900;
      }
      li.classList.replace('run', 'done'); l.classList.remove('shim'); glyph(li, I('check','xs')); note(li, res, x && x.tip, true);
      const t = $('.tk-dur', li); t.textContent = (took / 1000).toFixed(1) + 's'; enter(t);
    }
    // the header becomes what the work came to, and folds the trace away
    await c.wait(500); live = false;
    head.classList.add('tk-fin'); mark.innerHTML = I('ok'); enter(mark.firstElementChild); title.classList.remove('shim'); swap(title, '3 cards to fix, 2 changes planned');
    await c.wait(2000); setOpen(false);
  });
  // the preview's story: once it has folded, the person opens it again and reads what the cards measured
  if (r === c.st) c.story(async s => {
    await s.until(() => fold.classList.contains('shut')); await s.beat(2);
    await s.tap(head); await s.beat(2);
    await s.point($('.res [data-tip]', list)); await s.beat(3);
    s.away(); await s.beat(1);
  });
});
/* ---------- Context meter ---------- */
DM.def('context-meter', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  const LIMIT = 200;
  // what fills the context, in thousands of tokens; each part lists what's in it on hover
  const P = [
    { k:'files', l:'Files', v:56.2, c:'var(--pb)', tip:'Pricing.fig export 31.9k, PricingCard.tsx 18.2k, tokens.css 6.1k' },
    { k:'tools', l:'Tool output', v:41.8, c:'var(--pt)', tip:'Contrast check 17.4k, Figma frames 15.6k, grid audit 8.8k' },
    { k:'chat', l:'Chat', v:32.1, c:'var(--pl)', tip:'48 turns with Maya Kim since 09:12' },
    { k:'sys', l:'Instructions', v:6.3, c:'var(--faint)', tip:'Studio guidelines 4.1k, pricing brief 2.2k' }
  ];
  const root = $('.ctm', r), tg = $('.ctm-tg', r), pop = $('.ctm-pop', r), arc = $('.ctm-ring .fl', r), pc = $('.ctm-pc', r), tot = $('.ctm-tot', r);
  const bar = $('.ctm-bar', r), leg = $('.ctm-leg', r), msg = $('.ctm-msg', r), go = $('.ctm-go', r), hint = $('.ctm-hint', r);
  bar.innerHTML = P.map(p => `<i data-k="${p.k}" style="--c:${p.c}"></i>`).join('');
  leg.innerHTML = P.map(p => `<div class="ctm-l" data-k="${p.k}" style="--c:${p.c}" data-tip="${p.tip}"><span class="sw"></span>${p.l}<span class="v num">0k</span></div>`).join('');
  const fmt = v => v.toFixed(1) + 'k', sum = () => P.reduce((t, p) => t + p.v, 0);
  // the numbers count to their new values; the bar, the ring and the percentage follow
  const shown = {}; let total = 0;
  function paint(ms = 900){
    const all = sum(), pct = Math.round(all / LIMIT * 100);
    P.forEach(p => { $(`i[data-k="${p.k}"]`, bar).style.width = (p.v / LIMIT * 100) + '%'; const el = $(`.ctm-l[data-k="${p.k}"] .v`, leg), from = shown[p.k] || 0; shown[p.k] = p.v; tween(from, p.v, ms, x => el.textContent = fmt(x)); });
    const from = total; total = all; tween(from, all, ms, x => { tot.textContent = fmt(x); pc.textContent = Math.round(x / LIMIT * 100) + '%'; });
    arc.style.strokeDasharray = pct + ' 100'; root.classList.toggle('hot', pct >= 85); tg.setAttribute('aria-label', `Context, ${pct}% used`);
  }
  const say = (text, tone, icon) => { msg.className = 'ctm-msg on ' + tone; swap(msg.firstElementChild, `${I(icon,'xs')}<span>${text}</span>`, true); };
  // hovering a part lights its share of the bar
  c.on(leg, 'pointerover', e => { const l = e.target.closest('.ctm-l'); if (!l) return; bar.classList.add('hl'); $$('i', bar).forEach(i => i.classList.toggle('on', i.dataset.k === l.dataset.k)); });
  c.on(leg, 'pointerout', e => { if (!leg.contains(e.relatedTarget)) bar.classList.remove('hl'); });
  // the pill opens and shuts the panel; Escape shuts it while the pointer or the focus is on the meter
  const setOpen = (o, back) => { root.dataset.open = o ? '1' : '0'; tg.setAttribute('aria-expanded', o); pop.inert = !o; if (back) tg.focus({ preventScroll:true }); };
  tg.onclick = () => setOpen(root.dataset.open !== '1');
  c.on(document, 'keydown', e => { if (e.key === 'Escape' && root.dataset.open === '1' && (root.contains(document.activeElement) || root.matches(':hover'))) setOpen(false, root.contains(document.activeElement)); });
  // new tool output lands and takes the context close to its limit
  function arrive(){ P[1].v = +(P[1].v + 38.5).toFixed(1); paint(700); say(`${Math.round(sum() / LIMIT * 100)}% full. Older turns start to drop at 200k`, 'warn', 'warn'); }
  // Compact turns older turns into a summary and trims old tool output; Undo puts them back
  const before = {}; let state = 'full';
  go.onclick = () => c.run(async () => {
    if (go._busy) return; go._busy = true;
    if (state === 'full'){
      P.forEach(p => before[p.k] = p.v); const was = sum();
      go.innerHTML = '<span class="spin"></span>Compacting'; swap(hint, 'Summarising 48 turns'); await c.wait(1000);
      P[2].v = 4.6; P[1].v = +(P[1].v - 13.7).toFixed(1); paint(1100);
      say(`Freed ${fmt(was - sum())} tokens. 9 decisions kept`, 'ok', 'ok'); swap(hint, 'Older turns are now a summary'); go.textContent = 'Undo'; state = 'compact';
    } else {
      P.forEach(p => p.v = before[p.k]); paint(700); msg.className = 'ctm-msg'; swap(hint, 'Summarises older turns'); go.textContent = 'Compact'; state = 'full';
    }
    go._busy = false;
  });
  // it opens on its real numbers; they only count when something changes
  paint(1);
  // the preview's story: read what fills it, new tool output pushes it close to the limit, compact, then shut it
  if (r === c.st) c.story(async s => {
    await s.beat(3);
    await s.point($('.ctm-l[data-k="tools"]', leg)); await s.beat(3);
    await s.point($('.ctm-l[data-k="files"]', leg)); await s.beat(3);
    s.away(); await s.beat(1);
    arrive(); await s.beat(4);
    await s.tap(go); s.away(); await s.until(() => state === 'compact'); await s.beat(4);
    await s.tap(tg); s.away(); await s.beat(2);
  });
});
/* ---------- Action log ---------- */
DM.def('action-log', (r, c) => {
  const list = $('.alg-list', r);
  const acts = [
    { ic:'file-text', t:'Read <code>Pricing.tsx</code>', d:'src/pages, 212 lines', ms:'0.4s', det:'export function Pricing() {\n  return &lt;Grid cols={3} gap={20}&gt;…' },
    { ic:'search', t:'Searched Figma for <code>Button</code>', d:'6 matches in Components.fig', ms:'1.1s', det:'Button / Primary\nButton / Secondary\nButton / Ghost  +3' },
    { ic:'edit', t:'Edited <code>PricingCard.tsx</code>', d:'<span style="color:var(--add)">+18</span> <span style="color:var(--del)">−7</span> lines', ms:'2.3s', det:'<span class="x">− gap: 20px;</span>\n<span class="a">+ gap: var(--space-6);</span>' },
    { ic:'term', t:'Ran <code>npm test</code>', d:'24 tests passed', ms:'3.2s', det:'✓ PricingCard renders 3 plans\n✓ toggles yearly billing\n24 passed, 0 failed' },
    { ic:'pr', t:'Opened a pull request', d:'#412, Use shared spacing tokens', ms:'0.6s', det:'feat/pricing-spacing → main\n3 commits, ready for review' }
  ];
  const sum = $('.alg-sum', r), st = $('.alg-st', r);
  c.run(async () => {
    let total = 0;
    for (const a of acts){
      const li = html(`<li class="alg-it"><button class="alg-row" aria-expanded="false"><span class="alg-ic">${I(a.ic)}</span><span class="alg-tx"><b>${a.t}</b><span class="d">${a.d}</span></span><span class="alg-r"><span class="num ms"></span><span class="g"><span class="spin" style="width:10px;height:10px"></span></span></span></button><div class="fold shut alg-det"><div><pre>${a.det}</pre></div></div></li>`);
      list.appendChild(li); enter(li);
      const btn = $('.alg-row', li), det = $('.alg-det', li);
      btn.onclick = () => { const s = det.classList.toggle('shut'); btn.setAttribute('aria-expanded', !s); };
      swap(sum, 'Running step ' + list.children.length);
      await c.wait(950);
      $('.g', li).innerHTML = `<span style="color:var(--ok)">${I('check','xs')}</span>`; enter($('.g', li).firstElementChild);
      $('.ms', li).textContent = a.ms; total += parseFloat(a.ms);
    }
    st.innerHTML = `<span class="dot" style="color:var(--ok)"></span><span>5 steps, ${total.toFixed(1)}s</span>`; enter(st);
  });
});
/* ---------- Action log designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and the others are the
   directions the owner chose. The switch is the card's alone: the registry, the code view and the component page install
   Classic, as it was (build.js leaves a data-designs="card" switch out of them) */
{
  const classic = DM.defs['action-log'];
  // the card has four designs, picked with the switch under the log (on designme.dev, the card's footer tabs): Classic, the
  // log as it has always been; Feed, a live feed that follows new steps with a filter for each kind; Phases, the steps
  // grouped into phases with a minimap; and Scrubber, a replay with a stop on one track for every step. The three new ones
  // play one run: what each step did, how long it took (ms, of the run's 13 seconds) and what it shows when opened
  const ALG_K = { read:['Reads','file-text'], edit:['Edits','edit'], run:['Commands','term'], app:['Apps'] };
  const ALG_RUN = [
    { k:'read', ph:0, t:'Read <code>Pricing.tsx</code>', d:'src/pages, 212 lines', ms:.4, cp:'src/pages/Pricing.tsx', det:['code', 'export function Pricing() {\n  return &lt;Grid cols={3} gap={20}&gt;\n    {plans.map(p =&gt; &lt;PricingCard {...p} /&gt;)}'] },
    { k:'app', app:'figma', ph:0, t:'Searched Figma for <b>Button</b>', d:'6 matches in Components', ms:1.1, cp:'Button', det:['hits', ['Button / Primary', 'Button / Secondary', 'Button / Ghost', 'Button / Icon']] },
    { k:'read', ph:0, t:'Read <code>tokens.css</code>', d:'48 tokens, 9 for spacing', ms:.3, cp:'src/styles/tokens.css', det:['code', '--space-4: 16px;\n--space-5: 20px;\n--space-7: 28px;'] },
    { k:'edit', ph:1, t:'Edited <code>PricingCard.tsx</code>', d:'<span class="a">+18</span> <span class="x">−7</span> lines', ms:2.3, cp:'src/components/PricingCard.tsx', det:['diff', [['x', 'gap: 20px;'], ['a', 'gap: var(--space-5);'], ['x', 'padding: 28px;'], ['a', 'padding: var(--space-7);']]] },
    { k:'edit', ph:1, t:'Edited <code>Pricing.module.css</code>', d:'<span class="a">+4</span> <span class="x">−2</span> lines', ms:1, cp:'src/pages/Pricing.module.css', det:['diff', [['x', 'margin-top: 12px;'], ['a', 'margin-top: var(--space-3);']]] },
    { k:'run', ph:2, t:'Ran <code>npm test</code>', d:'2 of 24 tests failed', ms:3.2, fail:true, cp:'npm test', det:['term', '<span class="dim">$ npm test</span>\n<span class="bad">✕</span> PricingCard keeps 3 columns\n<span class="bad">✕</span> yearly badge fits on a phone\n<span class="bad">22 passed, 2 failed</span>'] },
    { k:'edit', ph:2, t:'Fixed the badge in <code>PricingCard.tsx</code>', d:'<span class="a">+3</span> <span class="x">−1</span> lines', ms:.8, cp:'src/components/PricingCard.tsx', det:['diff', [['x', 'white-space: nowrap;'], ['a', 'flex-wrap: wrap;'], ['a', 'gap: var(--space-2);']]] },
    { k:'run', ph:2, t:'Ran <code>npm test</code> again', d:'24 tests passed', ms:2.9, cp:'npm test', det:['term', '<span class="dim">$ npm test</span>\n<span class="ok">✓</span> PricingCard keeps 3 columns\n<span class="ok">✓</span> yearly badge fits on a phone\n<span class="ok">24 passed</span>'] },
    { k:'app', app:'github', ph:3, t:'Opened pull request <b>#412</b>', d:'Use shared spacing tokens', ms:.6, cp:'https://github.com/acme/web/pull/412', det:['card', 'github', 'Use shared spacing tokens', 'feat/pricing-spacing into main, 3 commits', '<span class="tag ok">Checks passed</span>'] },
    { k:'app', app:'slack', ph:3, t:'Posted in <b>#design</b>', d:'Summary and 2 screenshots', ms:.4, cp:'#design', det:['card', 'slack', '#design', 'Pricing cards now use the spacing tokens. PR #412 is ready for review.', ''] }
  ];
  const ALG_PH = ['Explore', 'Change', 'Verify', 'Ship'];
  const ALG_ALL = ALG_RUN.reduce((a, s) => a + s.ms, 0);
  ALG_RUN.reduce((t, s) => (s.at = t, t + s.ms), 0);
  // the pace: a second of the run takes ALG_PACE seconds to play
  const ALG_PACE = .9;
  const algIcon = (s, cls = 's') => s.k === 'app' ? BRAND[s.app] : I(ALG_K[s.k][1], cls);
  const algPlain = s => s.t.replace(/<[^>]+>/g, '');
  // what a step opens to; while it runs, its result is still on its way
  function algDetail(s, copy = true, running = false){
    const [type, a, b, x, y] = s.det, head = `<div class="alg-x-dh"><span class="p">${s.cp}</span>${copy ? `<button class="ib alg-x-cp" type="button" aria-label="Copy ${s.cp.replace(/"/g, '&quot;')}" data-tip="Copy">${I('copy','xs')}</button>` : ''}</div>`;
    if (running) return `<div class="alg-x-det">${head}<div class="alg-x-wait"><i style="width:72%"></i><i style="width:54%"></i><i style="width:63%"></i></div></div>`;
    if (type === 'code') return `<div class="alg-x-det">${head}<pre class="alg-x-pre">${a}</pre></div>`;
    if (type === 'term') return `<div class="alg-x-det">${head}<pre class="alg-x-pre term">${a}</pre></div>`;
    if (type === 'diff') return `<div class="alg-x-det">${head}<pre class="alg-x-pre">${a.map(([k, l]) => `<span class="${k}">${k === 'a' ? '+' : '−'} ${l}</span>`).join('')}</pre></div>`;
    if (type === 'hits') return `<div class="alg-x-det">${head}<div class="alg-x-hits">${a.map(h => `<span class="fchip alg-x-hit"><i></i>${h}</span>`).join('')}</div></div>`;
    return `<div class="alg-x-det">${head}<div class="alg-x-card">${BRAND[a]}<div><b>${b}</b><span>${x}</span>${y}</div></div></div>`;
  }
  // the copy button in any opened step
  const algCopy = (root, c) => c.on(root, 'click', e => { const b = e.target.closest('.alg-x-cp'); if (!b) return; e.stopPropagation(); copied(b, b.getAttribute('aria-label').replace(/^Copy /, '')); });

  // Feed: a live feed that follows new steps, with a filter for each kind that counts its steps, and a pill to jump back down
  const ALG_FEED = `<div class="alg-lf panel keep">
    <div class="alg-lf-h">
      <div class="alg-lf-ht"><b>Agent activity</b><span class="alg-lf-st"><span class="alg-lf-gl"><span class="dot"></span></span><span class="alg-lf-sm">Starting</span></span></div>
      <span class="alg-lf-tm num" aria-label="Time so far">0.0s</span>
    </div>
    <div class="alg-lf-f" role="toolbar" aria-label="Show"></div>
    <div class="alg-lf-vw">
      <div class="alg-lf-vp" tabindex="-1"><ol class="alg-lf-list" aria-live="polite" aria-label="Steps"></ol></div>
      <button class="alg-lf-new" type="button" hidden>${I('down','xs')}<span>New steps</span></button>
    </div>
  </div>`;
  function algFeed(r, c){
    // its own copy of the run, which it marks up as it plays
    const RUN = ALG_RUN.map(x => ({ ...x }));
    const root = $('.alg-lf', r), list = $('.alg-lf-list', r), vp = $('.alg-lf-vp', r), pill = $('.alg-lf-new', r), sm = $('.alg-lf-sm', r), tm = $('.alg-lf-tm', r), bar = $('.alg-lf-f', r), gl = $('.alg-lf-gl', r);
    const F = [['all', 'All'], ...Object.entries(ALG_K).map(([k, v]) => [k, v[0]])];
    bar.innerHTML = F.map(([k, n], i) => `<button class="chip sm alg-lf-chip${i === 0 ? ' on' : ''}" type="button" data-f="${k}" aria-pressed="${i === 0}">${n}<span class="n">0</span></button>`).join('');
    const chips = $$('.alg-lf-chip', bar), count = { all:0, read:0, edit:0, run:0, app:0 };
    let filter = 'all', follow = true, auto = 0, fresh = 0;
    const show = () => { $$('.alg-lf-w', list).forEach(w => { const on = filter === 'all' || w.dataset.k === filter; w.classList.toggle('shut', !on); w.inert = !on; }); };
    chips.forEach(b => b.onclick = () => { filter = b.dataset.f; chips.forEach(x => { x.setAttribute('aria-pressed', String(x === b)); x.classList.toggle('on', x === b); }); show(); });
    // left and right move along the filters, as in any toolbar
    c.on(bar, 'keydown', e => { const i = chips.indexOf(document.activeElement); if (i < 0) return; const j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : e.key === 'Home' ? 0 : e.key === 'End' ? chips.length - 1 : null; if (j === null) return; e.preventDefault(); chips[(j + chips.length) % chips.length].focus(); });
    // the feed follows the newest step; scrolled back, it waits, and a pill says how many have landed since
    const toEnd = smooth => { auto = performance.now(); vp.scrollTo({ top:vp.scrollHeight, behavior:smooth && !REDUCE ? 'smooth' : 'auto' }); };
    c.on(vp, 'scroll', () => { const end = vp.scrollHeight - vp.scrollTop - vp.clientHeight < 24; if (performance.now() - auto < 700 && !end) return; follow = end; if (end){ fresh = 0; pill.hidden = true; } });
    pill.onclick = () => { follow = true; fresh = 0; pill.hidden = true; toEnd(true); };
    // up and down move between steps, and Escape folds the open one
    c.on(list, 'keydown', e => {
      const rows = $$('.alg-lf-w:not(.shut) .alg-lf-row', list), i = rows.indexOf(document.activeElement);
      if (e.key === 'Escape' && i >= 0 && rows[i].getAttribute('aria-expanded') === 'true'){ rows[i].click(); return; }
      const j = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : null; if (i < 0 || j === null || !rows[j]) return; e.preventDefault(); rows[j].focus();
    });
    algCopy(r, c);
    const open = (s, on) => { const b = $('.alg-lf-row', s.el), f = $('.fold', s.el); f.classList.toggle('shut', !on); f.inert = !on; b.setAttribute('aria-expanded', String(on)); };
    function add(s, i){
      const w = html(`<li class="alg-lf-w fold" data-k="${s.k}"><div><div class="alg-lf-it run" data-k="${s.k}"><button class="alg-lf-row" type="button" aria-expanded="false"><span class="alg-lf-ic">${algIcon(s)}</span><span class="alg-lf-tx"><span class="t">${s.t}</span><span class="d">${s.d}</span></span><span class="alg-lf-r"><span class="num ms">0.0s</span><span class="g"><span class="spin"></span></span></span><span class="alg-lf-run" aria-hidden="true"><i></i></span></button><div class="fold shut"><div><div class="alg-lf-det">${algDetail(s)}</div></div></div></div></div></li>`);
      s.el = $('.alg-lf-it', w); list.appendChild(w); enter(s.el);
      $('.fold', s.el).inert = true;
      $('.alg-lf-row', s.el).onclick = () => open(s, $('.alg-lf-row', s.el).getAttribute('aria-expanded') !== 'true');
      if (filter !== 'all' && filter !== s.k){ w.classList.add('shut'); w.inert = true; }
      count.all++; count[s.k]++;
      chips.forEach(b => { const n = $('.n', b), v = String(count[b.dataset.f]); if (n.textContent !== v){ n.textContent = v; n.classList.remove('bump'); void n.offsetWidth; n.classList.add('bump'); } });
      if (follow) toEnd(i > 0); else { fresh++; $('span', pill).textContent = fresh === 1 ? '1 new step' : fresh + ' new steps'; pill.hidden = false; }
      swap(sm, `Step ${i + 1} of ${RUN.length}`);
    }
    function land(s){
      const el = s.el; el.classList.remove('run'); if (s.fail) el.classList.add('fail');
      $('.ms', el).textContent = s.ms.toFixed(1) + 's';
      $('.g', el).innerHTML = s.fail ? `<span class="bad">${I('alert','xs')}</span>` : `<span class="ok">${I('check','xs')}</span>`;
    }
    // the clock under the title, ten times a second while the demo plays
    let T = 0, live = null, done = false;
    c.every(100, () => { if (done) return; T += .1 / ALG_PACE; tm.textContent = Math.min(T, ALG_ALL).toFixed(1) + 's'; if (live){ const v = Math.min(live.ms, T - live.at); $('.ms', live.el).textContent = Math.max(0, v).toFixed(1) + 's'; } });
    c.run(async () => {
      await c.wait(700);
      for (let i = 0; i < RUN.length; i++){
        const s = RUN[i]; T = s.at; live = s; add(s, i);
        await c.wait(Math.max(650, s.ms * 1000 * ALG_PACE));
        land(s); live = null;
        if (s.fail) await c.wait(500);
      }
      done = true; root.classList.add('fin'); tm.textContent = ALG_ALL.toFixed(1) + 's';
      gl.innerHTML = I('ok','xs'); enter(gl.firstElementChild);
      swap(sm, `Done · ${RUN.length} steps, 1 retry`);
    });
    // the person in the demo: opens the failed test, reads it, folds it, then filters to the edits and back
    c.story(async s => {
      const fail = RUN.find(x => x.fail);
      await s.until(() => fail.el && fail.el.isConnected && fail.el.classList.contains('fail')); await s.beat(1);
      await s.tap($('.alg-lf-row', fail.el)); s.away();
      await s.beat(5); await s.tap($('.alg-lf-row', fail.el)); s.away();
      await s.until(() => done); await s.beat(2);
      await s.tap(chips[2]); s.away(); await s.beat(4);
      await s.tap(chips[0]); s.away(); await s.beat(3);
    });
  }

  // Phases: the steps grouped into explore, change, verify and ship, each folding when done, with a minimap of the run
  const ALG_PHASES = `<div class="alg-ph panel keep">
    <div class="alg-ph-h">
      <span class="alg-ph-hi">${I('bolt')}</span>
      <div class="alg-ph-ht"><b>Use spacing tokens on Pricing</b><span class="alg-ph-st"><span class="alg-ph-sm">Starting</span> · <span class="num alg-ph-ck">0:00</span></span></div>
      <span class="alg-ph-ring" role="img" aria-label="0 of 10 steps"><svg viewBox="0 0 28 28" aria-hidden="true"><circle cx="14" cy="14" r="11"/><circle class="v" cx="14" cy="14" r="11"/></svg><span class="num">0</span></span>
    </div>
    <div class="alg-ph-body">
      <div class="alg-ph-phs"></div>
      <div class="alg-ph-map" aria-hidden="true"><i class="alg-ph-now"></i></div>
    </div>
  </div>`;
  function algPhases(r, c){
    // its own copy of the run, which it marks up as it plays
    const RUN = ALG_RUN.map(x => ({ ...x }));
    const root = $('.alg-ph', r), phs = $('.alg-ph-phs', r), map = $('.alg-ph-map', r), sm = $('.alg-ph-sm', r), ck = $('.alg-ph-ck', r), ring = $('.alg-ph-ring', r), now = $('.alg-ph-now', r), hi = $('.alg-ph-hi', r);
    const P = ALG_PH.map((n, i) => ({ n, i, steps:RUN.filter(s => s.ph === i) }));
    P.forEach(p => {
      p.el = html(`<section class="alg-ph-p" data-s="next">${p.i < P.length - 1 ? '<i class="alg-ph-rl" aria-hidden="true"><i></i></i>' : ''}<button class="alg-ph-phh" type="button" aria-expanded="false"><span class="alg-ph-pg">${p.i + 1}</span><span class="alg-ph-pn">${p.n}</span><span class="alg-ph-pm">${p.steps.length} steps</span><span class="alg-ph-mix" aria-hidden="true">${p.steps.map(s => `<i style="flex:${s.ms}"></i>`).join('')}</span><span class="alg-ph-cv">${I('chev-d','xs')}</span></button><div class="fold shut"><div><ol class="alg-ph-acts"></ol></div></div></section>`);
      p.b = $('.alg-ph-phh', p.el); p.f = $('.fold', p.el); p.f.inert = true; phs.appendChild(p.el);
      p.b.onclick = () => fold(p, p.b.getAttribute('aria-expanded') !== 'true');
    });
    function fold(p, on){ p.b.setAttribute('aria-expanded', String(on)); p.f.classList.toggle('shut', !on); p.f.inert = !on; }
    // the minimap knows how tall it is from its own size, so the line moves with a transform
    const ro = new ResizeObserver(() => map.style.setProperty('--mh', map.clientHeight + 'px')); ro.observe(map); c.offs.push(() => ro.disconnect());
    const plural = (n, a, b) => n + ' ' + (n === 1 ? a : b);
    let T = 0, done = false, n = 0;
    c.every(100, () => { if (done) return; T += .1 / ALG_PACE; const t = Math.min(T, ALG_ALL); ck.textContent = '0:' + String(Math.floor(t)).padStart(2, '0'); now.style.setProperty('--now', (t / ALG_ALL).toFixed(4)); });
    function setPh(p, s){
      p.el.dataset.s = s; const g = $('.alg-ph-pg', p.el);
      g.innerHTML = s === 'run' ? '<span class="radar"></span>' : s === 'done' ? I('check','xs') : String(p.i + 1); enter(g.firstElementChild || g);
    }
    function tick(s){
      const t = html(`<button class="alg-ph-tk${s.fail ? ' fail' : ''}" type="button" tabindex="-1" style="top:${(s.at / ALG_ALL * 100).toFixed(2)}%" data-tip="${algPlain(s)}"></button>`);
      t.onclick = () => { const p = P[s.ph]; fold(p, true); s.row.classList.remove('flash'); void s.row.offsetWidth; s.row.classList.add('flash'); };
      map.appendChild(t);
    }
    c.run(async () => {
      await c.wait(700);
      for (const p of P){
        setPh(p, 'run'); fold(p, true); swap(sm, ['Exploring', 'Changing', 'Verifying', 'Shipping'][p.i]);
        const ol = $('.alg-ph-acts', p.el);
        for (const s of p.steps){
          T = s.at;
          s.row = html(`<li class="alg-ph-a run" data-k="${s.k}"><span class="k">${algIcon(s, 'xs')}</span><span class="t">${s.t}</span><span class="w">+${s.at.toFixed(1)}s</span></li>`);
          ol.appendChild(s.row); enter(s.row); tick(s);
          $('.alg-ph-pm', p.el).textContent = plural(ol.children.length, 'step', 'steps') + ' so far';
          await c.wait(Math.max(650, s.ms * 1000 * ALG_PACE));
          s.row.classList.remove('run'); if (s.fail) s.row.classList.add('fail');
          n++; $('.num', ring).textContent = n; ring.setAttribute('aria-label', `${n} of ${RUN.length} steps`); $('circle.v', ring).style.strokeDashoffset = (69.12 * (1 - n / RUN.length)).toFixed(2);
        }
        const took = p.steps.reduce((a, s) => a + s.ms, 0), fails = p.steps.filter(s => s.fail).length;
        $('.alg-ph-pm', p.el).textContent = `${plural(p.steps.length, 'step', 'steps')} · ${took.toFixed(1)}s${fails ? ' · 1 retry' : ''}`;
        setPh(p, 'done');
        // a finished phase folds to one line as the next opens, unless it is the last
        if (p.i < P.length - 1){ await c.wait(350); fold(p, false); }
      }
      done = true; root.classList.add('fin'); ck.textContent = '0:' + String(Math.round(ALG_ALL)).padStart(2, '0');
      hi.innerHTML = I('ok'); enter(hi.firstElementChild);
      swap(sm, 'Done');
    });
    // the person in the demo: opens the finished Verify phase from the minimap's red tick, then folds it again
    c.story(async s => {
      await s.until(() => done); await s.beat(2);
      const t = $('.alg-ph-tk.fail', map); if (t){ await s.point(t); await s.beat(2); await s.tap(t); s.away(); await s.beat(4); }
      await s.tap(P[2].b); s.away(); await s.beat(3);
    });
  }

  // Scrubber: a replay, every step a stop on one track; drag, step or use the arrows, and Live jumps back
  const ALG_SCRUB = `<div class="alg-sc panel keep">
    <div class="alg-sc-h">
      <div class="alg-sc-ht"><b>Agent activity</b><span class="alg-sc-st num">Step 0 of 10</span></div>
      <button class="chip sm alg-sc-live" type="button" aria-pressed="true"><span class="alg-sc-ld"></span><span class="alg-sc-lt">Live</span></button>
    </div>
    <div class="alg-sc-tr" role="slider" tabindex="0" aria-label="Step" aria-valuemin="1" aria-valuemax="10" aria-valuenow="1" aria-valuetext="Waiting for the first step">
      <div class="alg-sc-ln"><i class="alg-sc-fill"></i></div>
      <div class="alg-sc-ns"></div>
      <span class="alg-sc-knob" aria-hidden="true"></span>
    </div>
    <div class="alg-sc-ax num" aria-hidden="true"><span>0s</span><span>Run, 13s</span></div>
    <div class="alg-sc-view" aria-live="polite"><div class="alg-sc-card"></div></div>
    <div class="alg-sc-f">
      <button class="ib alg-sc-prev" type="button" aria-label="Previous step" data-tip="Previous" data-tip-k="←">${I('chev-l')}</button>
      <button class="ib alg-sc-next" type="button" aria-label="Next step" data-tip="Next" data-tip-k="→">${I('chev-r')}</button>
    </div>
  </div>`;
  function algScrub(r, c){
    // its own copy of the run, which it marks up as it plays
    const RUN = ALG_RUN.map(x => ({ ...x }));
    const root = $('.alg-sc', r), tr = $('.alg-sc-tr', r), ns = $('.alg-sc-ns', r), fill = $('.alg-sc-fill', r), view = $('.alg-sc-view', r), st = $('.alg-sc-st', r), liveB = $('.alg-sc-live', r), lt = $('.alg-sc-lt', r);
    let sel = -1, live = true, landed = 0, done = false, T = 0, runAt = -1;
    const x = s => (s.at / ALG_ALL * 100).toFixed(2) + '%';
    // the knob sits on the step on show; its place is worked out from the track's width, measured when that changes
    let W = 0; const ro = new ResizeObserver(() => { W = tr.clientWidth; place(); }); ro.observe(tr); c.offs.push(() => ro.disconnect());
    const place = () => { if (sel >= 0) tr.style.setProperty('--kx', (RUN[sel].at / ALG_ALL * W).toFixed(1) + 'px'); };
    function card(i, dir){
      const s = RUN[i], ok = i < landed, run = i === runAt;
      const g = run ? '<span class="spin"></span>' : s.fail ? `<span class="bad">${I('alert','xs')}</span>` : `<span class="ok">${I('check','xs')}</span>`;
      const el = html(`<div class="alg-sc-card${s.fail && ok ? ' fail' : ''}"><div class="alg-sc-ch"><span class="alg-sc-ic">${algIcon(s, '')}</span><span class="alg-sc-cx"><span class="t">${s.t}</span><span class="d">${s.d}</span></span><span class="alg-sc-cm num">${ok ? s.ms.toFixed(1) + 's' : 'Running'}${g}</span></div>${algDetail(s, true, run)}</div>`);
      const old = $('.alg-sc-card', view);
      if (old && dir){ old.classList.add(dir > 0 ? 'out-r' : 'out-l'); setTimeout(() => old.remove(), REDUCE ? 0 : 340); } else if (old) old.remove();
      view.appendChild(el); if (dir) el.classList.add(dir > 0 ? 'in-r' : 'in-l');
    }
    function pick(i, how){
      i = Math.max(0, Math.min(landed - (runAt >= 0 ? 0 : 1), i)); if (i < 0) return;
      const dir = sel < 0 ? 0 : Math.sign(i - sel) || 0;
      $$('.alg-sc-n', ns).forEach((n, k) => n.classList.toggle('on', k === i));
      if (i !== sel || how === 'land'){ sel = i; place(); card(i, how === 'land' && dir === 0 ? 0 : dir); }
      root.classList.add('has');
      const s = RUN[i]; tr.setAttribute('aria-valuenow', i + 1); tr.setAttribute('aria-valuetext', `Step ${i + 1}, ${algPlain(s)}`);
      st.textContent = `Step ${i + 1} of ${RUN.length}`;
    }
    function setLive(on){ live = on; liveB.setAttribute('aria-pressed', String(on)); lt.textContent = on ? (done ? 'Done' : 'Live') : (done ? 'Last step' : 'Back to live'); if (on) pick(runAt >= 0 ? runAt : landed - 1, 'live'); }
    liveB.onclick = () => setLive(true);
    const userPick = i => { setLive(false); pick(i); if (sel === (runAt >= 0 ? runAt : landed - 1)) setLive(true); };
    $('.alg-sc-prev', r).onclick = () => userPick(sel - 1);
    $('.alg-sc-next', r).onclick = () => userPick(sel + 1);
    c.on(tr, 'keydown', e => {
      const k = e.key, to = k === 'ArrowRight' || k === 'ArrowUp' ? sel + 1 : k === 'ArrowLeft' || k === 'ArrowDown' ? sel - 1 : k === 'Home' ? 0 : k === 'End' ? RUN.length : k === 'PageUp' ? sel + 3 : k === 'PageDown' ? sel - 3 : null;
      if (to === null) return; e.preventDefault(); userPick(to);
    });
    // drag along the track: the knob follows the pointer to the nearest step that has happened
    const nearest = px => { let best = 0, d = 1e9; const lim = runAt >= 0 ? runAt : landed - 1; for (let i = 0; i <= lim; i++){ const dd = Math.abs(RUN[i].at / ALG_ALL * W - px); if (dd < d){ d = dd; best = i; } } return best; };
    let drag = false, left = 0;
    c.on(tr, 'pointerdown', e => { if (landed < 1 && runAt < 0) return; drag = true; left = tr.getBoundingClientRect().left; tr.classList.add('drag'); tr.setPointerCapture(e.pointerId); userPick(nearest(e.clientX - left)); });
    c.on(tr, 'pointermove', e => { if (drag) userPick(nearest(e.clientX - left)); });
    const end = () => { drag = false; tr.classList.remove('drag'); };
    c.on(tr, 'pointerup', end); c.on(tr, 'pointercancel', end);
    algCopy(r, c);
    view.innerHTML = '<div class="alg-sc-card"><div class="alg-sc-empty"><span class="spin"></span>Waiting for the first step</div></div>';
    // the track fills ten times a second as the run goes
    c.every(100, () => { if (done) return; T += .1 / ALG_PACE; fill.style.transform = `scaleX(${Math.min(1, T / ALG_ALL).toFixed(4)})`; });
    c.run(async () => {
      await c.wait(700);
      for (let i = 0; i < RUN.length; i++){
        const s = RUN[i]; T = s.at; runAt = i;
        const n = html(`<span class="alg-sc-n${s.k === 'app' ? ' app' : ''}" style="--x:${x(s)}"></span>`); ns.appendChild(n);
        if (live) pick(i, 'live');
        await c.wait(Math.max(650, s.ms * 1000 * ALG_PACE));
        landed = i + 1; runAt = -1; if (s.fail) n.classList.add('fail');
        if (live || sel === i) pick(i, 'land');
      }
      done = true; root.classList.add('fin'); fill.style.transform = 'scaleX(1)'; setLive(live);
    });
    // the person in the demo: goes back to the failed test, steps forward to the fix, then returns to live
    c.story(async s => {
      await s.until(() => landed >= 8); await s.beat(1);
      await s.tap($$('.alg-sc-n', ns)[5]); userPick(5); s.away(); await s.beat(4);
      await s.tap($('.alg-sc-next', r)); s.away(); await s.beat(3);
      await s.tap(liveB); s.away();
      await s.until(() => done); await s.beat(4);
    });
  }

  // the switch: the design the card last showed (Classic to begin with) is drawn, and picking another mounts the card again
  // with it, so it plays from the start, entrance and demo; a key that picked it keeps the focus on the switch. Inside another
  // component (as in Agent harness), and in the registry, the code view and the component page (build.js leaves a
  // data-designs="card" switch out of them), it is the classic log on its own
  const ALG_DS = { feed:[ALG_FEED, algFeed], phases:[ALG_PHASES, algPhases], scrub:[ALG_SCRUB, algScrub] };
  DM.def('action-log', (r, c, card) => {
    let dm = $(':scope>.alg-dm', r);
    if (!dm) return classic(r, c, card);
    if (!c.card || r !== c.st){ dm.replaceWith(...$(':scope>.dm-main', dm).childNodes); return classic(r, c, card); }
    const v = ALG_DS[card._dv] ? card._dv : 'classic';
    if (v === 'classic') classic(r, c, card);
    // (the classic component may have drawn its icons into the stage again, so the switch is found afresh)
    dm = $(':scope>.alg-dm', r);
    const main = $(':scope>.dm-main', dm), sg = $(':scope>.demo .seg2', dm);
    let tall = null, h = 0, wide = -1;
    // the card keeps the room the tallest design needs; this one sits with its own tallest moment in the middle of it, and
    // grows downwards from there. Its height is taken once at each width, so what it does never moves its top
    const fit = () => { const H = parseFloat(getComputedStyle(r).minHeight) || 0, w = r.clientWidth; if (w !== wide){ wide = w; h = tall ? tall() : main.offsetHeight; } dm.style.setProperty('--dmy', Math.max(0, Math.floor((H - h) / 2)) + 'px'); };
    if (v !== 'classic'){ main.innerHTML = ALG_DS[v][0]; const t = ALG_DS[v][1](main, c); tall = typeof t === 'function' ? t : null; }
    // the classic log is tallest once all five steps have landed (on a phone they wrap past the room it keeps for them): a
    // hidden copy of it plays its run at once, on a clock of its own that never waits, and is measured, then taken away
    else {
      const p = $('.alg', main) && $('.alg', main).cloneNode(true);
      // (the copy starts with its list empty, as the template drew it)
      let ph = 0;
      tall = () => Math.max(ph, main.offsetHeight);
      if (p){
        $('.alg-list', p).innerHTML = '';
        const host = document.createElement('div'); host.setAttribute('aria-hidden', 'true'); host.style.cssText = 'position:absolute;left:0;right:0;top:0;visibility:hidden;pointer-events:none';
        host.appendChild(p); main.appendChild(host);
        let run = null; classic(host, { run:fn => { run = fn(); }, wait:() => Promise.resolve() });
        Promise.resolve(run).then(() => { ph = p.offsetHeight; host.remove(); if (!c.dead){ wide = -1; fit(); } });
      }
    }
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    seg(sg, k => {
      if (k === v) return;
      const kb = sg.contains(document.activeElement) && document.activeElement.matches(":focus-visible");
      card._dv = k; DM.mount(card);
      // it comes back once the new design has started, so it isn't taken for the visitor taking over the new demo
      if (kb) setTimeout(() => { const b = $(`.alg-dm>.demo button[data-v="${k}"]`, card); if (b && (!document.activeElement || document.activeElement === document.body)) b.focus({ preventScroll:true }); }, 120);
    });
    const ro = new ResizeObserver(fit); ro.observe(r); c.offs.push(() => ro.disconnect());
  });
}
/* ---------- Run queue ---------- */
DM.def('run-queue', (r, c) => {
  // the jobs, run one at a time: what each is, the agent on it and its icon, and its steps with what each came to. The launch
  // email's test send fails once and waits for Retry
  const J = [
    { t:'Research three competitors', ag:'Research agent', ic:'search', subs:[['Read their pricing pages', '3 of 3'], ['Compared plans and limits', '5 gaps']] },
    { t:'Draft the launch email', ag:'Copy agent', ic:'mail', fail:2, subs:[['Pulled the new features', '6 items'], ['Wrote two subject lines', '2 drafts'], ['Sent a test to the team', 'Sent']] },
    { t:'Update the help centre', ag:'Docs agent', ic:'book', subs:[['Billing questions', '4 articles'], ['Inviting your team', '2 articles']] },
    { t:'Post the changelog', ag:'Release agent', ic:'send', subs:[['Posted in #releases', 'Posted']] }
  ];
  const STEP = 1.4, secs = j => j.subs.length * STEP;
  const root = $('.rq', r), st = $('.rq-st', r), tot = $('.rq-tot', r), say = $('.rq-say', r);
  const runL = $('.rq-run', r), nextL = $('.rq-next', r), doneL = $('.rq-done', r), dn = $('.rq-dn', r);
  $('.rq-fin .rq-av', r).innerHTML = I('ok');
  const fold = (f, on) => { f.classList.toggle('shut', !on); f.inert = !on; };
  $$('.rq-b>.fold', r).forEach(f => { f.inert = f.classList.contains('shut'); });
  let compact = false, total = 0, retries = 0;
  tot.innerHTML = J.map(() => '<i><b></b></i>').join('');
  J.forEach((j, k) => {
    j.bar = $$('b', tot)[k]; j.p = 0; j.s = '';
    j.el = html(`<li class="rq-j" data-s="wait"><div class="rq-jh"><span class="rq-av" aria-hidden="true">${I(j.ic)}</span><span class="rq-jt"><b>${j.t}</b><span class="rq-js">${j.ag}</span></span><span class="rq-jm num"></span></div><div class="rq-jb" aria-hidden="true"><div class="rq-bar"><i></i></div><span class="rq-pc num">0%</span></div><div class="fold shut rq-sf"><div><ul class="rq-steps">${j.subs.map(s => `<li class="rq-sp wait"><span class="g"><span class="dot"></span></span><span>${s[0]}</span><span class="m"></span></li>`).join('')}</ul></div></div></li>`);
    $('.rq-sf', j.el).inert = true;
    nextL.appendChild(j.el);
  });
  const text = (el, t) => { if (el.textContent !== t) el.textContent = t; };
  // when each waiting job should start: after what is left of the one running and of every job ahead of it
  const left = j => secs(j) * (1 - j.p);
  function times(){
    let ahead = 0;
    J.forEach(j => {
      const m = $('.rq-jm', j.el);
      if (j.s === 'run' || j.s === 'fail'){ ahead += left(j); if (j.s === 'run') text(m, left(j) < .5 ? 'Finishing' : `${Math.ceil(left(j))}s left`); }
      else if (!j.s){ text(m, `in ~${Math.max(1, Math.round(ahead))}s`); ahead += secs(j); }
    });
    const now = J.find(j => j.s === 'run' || j.s === 'fail'), d = J.filter(j => j.s === 'done').length;
    text(st, d === J.length ? `All ${J.length} done in ${total.toFixed(1)}s` : now && now.s === 'fail' ? '1 step failed, waiting for Retry' : `${d} of ${J.length} done · ~${Math.ceil(ahead)}s left`);
  }
  // a job moves to its part of the queue, and every job glides from where it was to where it is now
  function move(j, list, s){
    const was = new Map(J.map(x => [x, x.el.getBoundingClientRect()]));
    j.s = s; j.el.dataset.s = s || 'wait'; list.appendChild(j.el); steps(j);
    if (REDUCE) return;
    J.forEach(x => { const a = was.get(x), b = x.el.getBoundingClientRect(), dx = a.left - b.left, dy = a.top - b.top;
      if (Math.abs(dx) + Math.abs(dy) > 1) x.el.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:'none' }], { duration:520, easing:'cubic-bezier(.22,1,.36,1)' }); });
  }
  // the queue keeps the tallest room it has needed once each move settles, so it never shrinks while it runs and its end
  // sits centred in that room
  const keep = () => { const h = Math.ceil(root.getBoundingClientRect().height); if (h > (parseFloat(root.style.minHeight) || 0)) root.style.minHeight = h + 'px'; };
  function steps(j){ const f = $('.rq-sf', j.el); fold(f, !compact && (j.s === 'run' || j.s === 'fail')); }
  seg($('.seg2', r), v => { compact = v === 'compact'; J.forEach(steps); });
  const paint = j => { j.bar.style.setProperty('--p', j.p.toFixed(3)); $('.rq-bar i', j.el).style.setProperty('--p', j.p.toFixed(3)); text($('.rq-pc', j.el), Math.round(j.p * 100) + '%'); };
  const glyph = (sp, g, cls) => { sp.className = 'rq-sp ' + cls; $('.g', sp).innerHTML = g; };
  async function go(j){
    if (j.s !== 'run') move(j, runL, 'run');
    say.textContent = `${j.t} started`; c.later(600, keep);
    const sps = $$('.rq-sp', j.el), js = $('.rq-js', j.el), n = j.subs.length;
    let took = 0;
    for (let i = 0; i < n; i++){
      const sp = sps[i]; glyph(sp, '<span class="spin"></span>', 'run'); swap(js, `${j.ag} · ${j.subs[i][0]}`);
      // the step fills its share of the bar a tenth of a second at a time; the test send fails part way, once
      let q = 0; const failAt = j.fail === i && !j.failed ? .55 : 2;
      await new Promise(res => { const iv = c.every(100, () => { q = Math.min(1, q + .1 / STEP); took += .1; j.p = (i + q) / n; paint(j); times(); if (q >= failAt || q >= 1){ clearInterval(iv); res(); } }); });
      if (q < 1){
        j.failed = true; j.el.dataset.s = j.s = 'fail'; j.bar.parentElement.classList.add('fail'); glyph(sp, I('x','xs'), 'fail');
        text($('.rq-jm', j.el), 'Test send failed'); times(); say.textContent = `${j.t}: ${j.subs[i][0]} failed`;
        const b = html('<button class="rq-retry" type="button">Retry</button>'); $('.m', sp).appendChild(b); enter(b);
        // it waits for Retry, which presses itself after a moment so the run never stalls, until the visitor takes over
        await new Promise(res => { b.onclick = res; c.auto(2600, () => { if (b.isConnected){ b.classList.add('on'); c.auto(220, res); } }); });
        b.remove(); retries++; j.el.dataset.s = j.s = 'run'; j.bar.parentElement.classList.remove('fail'); i--; continue;
      }
      glyph(sp, I('check','xs'), 'done'); swap($('.m', sp), j.subs[i][1]);
    }
    total += took; j.p = 1; paint(j); swap(js, j.ag);
    await c.wait(REDUCE ? 0 : 420);
    move(j, doneL, 'done'); dn.textContent = doneL.children.length;
    $('.rq-jm', j.el).innerHTML = `<span>${took.toFixed(1)}s${j.failed ? ' · 1 retry' : ''}</span><span class="ok">${I('check','xs')}</span>`;
    say.textContent = `${j.t} done`; times();
  }
  // the first job is on its way from the start
  move(J[0], runL, 'run'); times();
  c.run(async () => {
    await c.wait(700);
    for (const j of J) await go(j);
    // the end: a summary takes the running job's place and the empty parts fold away; once they have, the queue lets go of
    // the room it kept and eases down to fit what is left, so no gap opens under the bars (owner, 5 Nov)
    await c.wait(REDUCE ? 0 : 560); keep();
    text($('.rq-ft', r), `All ${J.length} jobs done`); $('.rq-fs', r).textContent = `${total.toFixed(1)}s in all · ${retries ? retries + (retries > 1 ? ' retries' : ' retry') : 'no retries'}`;
    root.classList.add('fin'); fold($('.rq-ff', r), true); fold($('.rq-rf', r), false); fold($('.rq-nf', r), false);
    times(); say.textContent = `All ${J.length} jobs done`;
    await c.wait(REDUCE ? 0 : 520);
    const from = root.getBoundingClientRect().height; root.style.minHeight = ''; const to = root.getBoundingClientRect().height;
    if (!REDUCE && from - to > 1) root.animate([{ height:from + 'px' }, { height:to + 'px' }], { duration:480, easing:'cubic-bezier(.22,1,.36,1)' });
  });
});
/* ---------- Run queue designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and the others are the
   directions under review. The switch is the card's alone: the registry, the code view and the component page install
   Classic on its own (build.js leaves a data-designs="card" switch out of them) */
{
  const classic = DM.defs['run-queue'];
  // the tasks Reorder, Segments and Workers run: each one's name and short name, its icon or app, how long it takes in the
  // demo's seconds, and its steps. The launch email's test send fails once
  const RQ_T = () => [
    { t:'Research three competitors', sh:'Competitors', ic:'search', d:4.2, subs:[['Read their pricing pages', '3 of 3'], ['Compared plans and limits', '5 gaps']] },
    { t:'Draft the launch email', sh:'Launch email', ic:'mail', d:4.8, fail:2, subs:[['Pulled the new features', '6 items'], ['Wrote two subject lines', '2 drafts'], ['Sent a test to the team', 'Sent']] },
    { t:'Update the help centre', sh:'Help centre', ic:'book', d:3.6, subs:[['Billing questions', '4 articles'], ['Inviting your team', '2 articles']] },
    { t:'Refresh pricing screenshots', sh:'Screenshots', app:'figma', d:3.2, subs:[['Captured 6 screens', '6'], ['Uploaded to Drive', 'Done']] },
    { t:'Sync roadmap to Linear', sh:'Roadmap', app:'linear', d:2.6, subs:[['Matched 12 issues', '12']] },
    { t:'Post the changelog', sh:'Changelog', app:'slack', d:2.2, subs:[['Posted in #releases', 'Posted']] }
  ];
  const rqIc = (t, s = 's') => `<span class="rq-ic${t.app ? ' app' : ''}" aria-hidden="true">${t.app ? BRAND[t.app] : I(t.ic, s)}</span>`;
  const rqLeft = s => s > 0 ? `${Math.ceil(s)}s left` : 'Finishing';
  // text that changes ten times a second is written only when it reads differently
  const rqText = (el, t) => { if (el.textContent !== t) el.textContent = t; };
  // a list in a new order: each item glides from where it was to where it is now
  function rqFlip(items, change){
    const was = new Map(items().map(el => { const b = el.getBoundingClientRect(); return [el, [b.left, b.top]]; }));
    change();
    if (REDUCE) return;
    items().forEach(el => { const a = was.get(el); if (!a) return; const b = el.getBoundingClientRect(), dx = a[0] - b.left, dy = a[1] - b.top; if (Math.abs(dx) + Math.abs(dy) < 1) return; el.animate([{ transform:`translate(${dx}px,${dy}px)` }, { transform:'none' }], { duration:400, easing:'cubic-bezier(.22,1,.36,1)' }); });
  }
  // puts a list's items in the order given, moving only those out of place, and keeps the focus where it was
  function rqOrder(box, sel, els){
    const f = document.activeElement;
    els.forEach((el, i) => { const at = $$(sel, box)[i]; if (at !== el) box.insertBefore(el, at || null); });
    if (f && f !== document.activeElement && f.isConnected && box.contains(f)) f.focus({ preventScroll:true });
  }
  const RQ_HTML = {
    reorder:`<div class="rq-ro panel keep">
    <div class="rq-ro-h"><div class="rq-ro-ht"><b>Queue</b><span class="rq-ro-st num">Starting</span></div><button class="pill soft sm rq-ro-pause" type="button">${I('pause','xs')}Pause</button></div>
    <div class="rq-ro-sec"><span class="rq-ro-l">Running</span><div class="rq-ro-run"></div></div>
    <div class="rq-ro-sec"><span class="rq-ro-l">Up next, drag to reorder</span><ol class="rq-ro-next" aria-label="Up next"></ol></div>
    <div class="rq-ro-done"><span class="rq-ro-l rq-ro-dlb">Done</span><button class="chip sm rq-ro-db" type="button" aria-expanded="false"><span class="rq-ro-dc num">0</span><span>done</span>${I('chev-d','xs')}</button><div class="fold shut"><div><ul class="rq-ro-dl" aria-label="Done"></ul></div></div></div>
    <p class="rq-sr rq-ro-say" aria-live="polite"></p>
  </div>`,
    segments:`<div class="rq-sg">
    <div class="rq-sg-top"><div class="seg2" role="group" aria-label="Density"><button type="button" aria-pressed="true" data-v="full">Detailed</button><button type="button" aria-pressed="false" data-v="compact">Compact</button></div><span class="rq-sg-all num">0 of 7 done</span></div>
    <div class="rq-sg-tot" aria-hidden="true"></div>
    <div class="rq-sg-list panel keep"></div>
  </div>`,
    workers:`<div class="rq-wk panel keep">
    <div class="rq-wk-h"><div class="rq-wk-ht"><b>Workers</b><span class="rq-wk-st num">0 of 6 done</span></div><div class="rq-wk-n" role="group" aria-label="Workers"><button class="ib fill rq-wk-m" type="button" aria-label="One worker fewer" data-tip="Fewer">${I('minus','xs')}</button><span class="num rq-wk-v" aria-live="polite">2</span><button class="ib fill rq-wk-p" type="button" aria-label="One worker more" data-tip="More">${I('plus','xs')}</button></div></div>
    <div class="rq-wk-slots"></div>
    <div class="rq-wk-wl"><span class="rq-wk-l">Waiting, press one to run it next</span><div class="rq-wk-wait" role="list" aria-label="Waiting"></div></div>
    <div class="rq-wk-fin"><span class="rq-wk-l">Done</span><div class="rq-wk-stack" aria-hidden="true"></div><span class="rq-wk-fc num">0</span></div>
  </div>`
  };
  // Reorder: two tasks run at a time and the rest wait in order. The order is yours: drag a waiting task by its handle, or
  // press Alt with the up or down arrow on it. Pause holds the running ones, and what is done folds away under a count
  function rqReorder(r, c){
    const T = RQ_T(), runEl = $('.rq-ro-run', r), next = $('.rq-ro-next', r), st = $('.rq-ro-st', r), say = $('.rq-ro-say', r), pb = $('.rq-ro-pause', r), dl = $('.rq-ro-dl', r), dc = $('.rq-ro-dc', r), db = $('.rq-ro-db', r), fold = $('.rq-ro-done .fold', r);
    const SLOTS = 2; let wait = T.slice(), running = [], done = 0, paused = false, dragging = false;
    fold.inert = true;
    db.onclick = () => { const on = db.getAttribute('aria-expanded') !== 'true'; db.setAttribute('aria-expanded', String(on)); fold.classList.toggle('shut', !on); fold.inert = !on; fit(); };
    // the done list opens into the room Up next keeps for rows it no longer has, with a scroll of its own, so opening it
    // never stretches the queue (at least two rows show)
    function fit(){
      const on = db.getAttribute('aria-expanded') === 'true' && !$('.rq-ro', r).classList.contains('fin');
      next.style.minHeight = ''; const room = next.offsetHeight;
      next.style.minHeight = on ? '0px' : ''; dl.style.maxHeight = on ? Math.max(88, room - next.offsetHeight - 6) + 'px' : '';
    }
    const line = () => rqText(st, paused ? 'Paused' : !running.length && !wait.length ? `All ${T.length} done` : `${running.length} running · ${wait.length} waiting · ${done} done`);
    pb.onclick = () => { paused = !paused; pb.innerHTML = I(paused ? 'play' : 'pause', 'xs') + (paused ? 'Resume' : 'Pause'); running.forEach(t => t.el.classList.toggle('paused', paused)); line(); };
    // a row that has just moved flashes the grey highlight once
    const flash = t => { t.q.classList.remove('moved'); void t.q.offsetWidth; t.q.classList.add('moved'); };
    function paintNext(){
      wait.forEach((t, i) => {
        if (!t.q){
          t.q = html(`<li class="rq-ro-q"><span class="rq-ro-fl" aria-hidden="true"></span><button class="rq-ro-hd" type="button" data-tip="Drag, or Alt and the arrows">${I('grip','xs')}</button><span class="rq-ro-pos" aria-hidden="true"></span>${rqIc(t)}<b>${t.t}</b><span class="eta">~${Math.round(t.d)}s</span></li>`);
          t.q.addEventListener('animationend', e => { if (e.target.classList.contains('rq-ro-fl')) t.q.classList.remove('moved'); });
          wire(t);
        }
        rqText($('.rq-ro-pos', t.q), String(i + 1));
        $('.rq-ro-hd', t.q).setAttribute('aria-label', `${t.t}, position ${i + 1} of ${wait.length}. Alt with up or down moves it`);
      });
      rqOrder(next, '.rq-ro-q', wait.map(t => t.q));
      fit();
    }
    const items = () => wait.map(t => t.q);
    function move(t, to){
      const i = wait.indexOf(t); to = Math.max(0, Math.min(wait.length - 1, to)); if (to === i) return;
      rqFlip(items, () => { wait.splice(i, 1); wait.splice(to, 0, t); paintNext(); });
      flash(t); say.textContent = `${t.t} moved to position ${to + 1} of ${wait.length}`;
    }
    function wire(t){
      const hd = $('.rq-ro-hd', t.q);
      hd.addEventListener('keydown', e => { if (!e.altKey || (e.key !== 'ArrowUp' && e.key !== 'ArrowDown')) return; e.preventDefault(); move(t, wait.indexOf(t) + (e.key === 'ArrowUp' ? -1 : 1)); hd.focus({ preventScroll:true }); });
      // drag by the handle: the row follows the pointer, and the rows it passes step out of its way
      let drag = null;
      hd.addEventListener('pointerdown', e => { if (e.button || !wait.includes(t)) return; e.preventDefault(); hd.setPointerCapture(e.pointerId); dragging = true; drag = { y:e.clientY, i:wait.indexOf(t), h:t.q.offsetHeight + 2, n:wait.length }; t.q.classList.add('drag'); });
      hd.addEventListener('pointermove', e => {
        if (!drag) return; const dy = e.clientY - drag.y; t.q.style.transform = `translateY(${dy}px)`;
        const to = Math.max(0, Math.min(drag.n - 1, drag.i + Math.round(dy / drag.h))); if (to === drag.to) return; drag.to = to;
        wait.forEach((x, k) => { if (x === t) return; const s = k > drag.i && k <= to ? -drag.h : k < drag.i && k >= to ? drag.h : 0; x.q.style.transition = 'transform .25s var(--ease)'; x.q.style.transform = s ? `translateY(${s}px)` : ''; });
      });
      // the row lands where it was dropped, and everything glides from where it was drawn
      const end = () => {
        if (!drag) return; const d = drag; drag = null; dragging = false; t.q.classList.remove('drag');
        const moved = d.to !== undefined && d.to !== d.i;
        rqFlip(items, () => { wait.forEach(x => { x.q.style.transition = 'none'; x.q.style.transform = ''; }); if (moved){ wait.splice(d.i, 1); wait.splice(d.to, 0, t); paintNext(); } });
        requestAnimationFrame(() => wait.forEach(x => { if (x.q) x.q.style.transition = ''; }));
        if (moved){ flash(t); say.textContent = `${t.t} moved to position ${d.to + 1} of ${wait.length}`; }
        pull();
      };
      hd.addEventListener('pointerup', end); hd.addEventListener('pointercancel', end);
    }
    // a free slot takes the first task waiting (once a row you are dragging has landed)
    function pull(){
      while (!dragging && running.length < SLOTS && wait.length){
        const t = wait.shift(); if (t.q){ t.q.remove(); t.q = null; }
        running.push(t); paintNext(); c.run(() => go(t));
      }
      line();
    }
    async function go(t){
      t.el = html(`<div class="rq-ro-r${paused ? ' paused' : ''}"><div class="rq-ro-rt">${rqIc(t)}<b>${t.t}</b><span class="num">${rqLeft(t.d)}</span></div><div class="rq-ro-bar"><i></i></div></div>`);
      runEl.appendChild(t.el);
      const num = $('.num', t.el); let p = 0;
      const tick = () => { p = Math.min(1, p + .1 / t.d); t.el.style.setProperty('--p', p.toFixed(3)); rqText(num, rqLeft(t.d * (1 - p))); };
      await new Promise(res => {
        const iv = c.every(100, () => {
          if (paused) return; tick();
          // the test send fails once, part way: the task turns red and waits for Retry, which presses itself after a moment
          // until you take over
          if (t.fail !== undefined && !t.failed && p >= .62){
            clearInterval(iv); t.failed = true; t.el.classList.add('fail'); rqText(num, 'Test send failed');
            const b = html('<button class="pill sm" type="button">Retry</button>'); $('.rq-ro-rt', t.el).appendChild(b); enter(b);
            const again = () => { if (!b.isConnected) return; b.remove(); t.el.classList.remove('fail'); p = .45; tick(); const iv2 = c.every(100, () => { if (paused) return; tick(); if (p >= 1){ clearInterval(iv2); res(); } }); };
            b.onclick = again; c.auto(3200, again);
          } else if (p >= 1){ clearInterval(iv); res(); }
        });
      });
      t.el.classList.add('leave'); await c.wait(REDUCE ? 0 : 320); t.el.remove();
      running = running.filter(x => x !== t); done++; dc.textContent = done;
      dl.appendChild(html(`<li>${rqIc(t)}<span class="t">${t.t}</span><span class="d">${t.d.toFixed(1)}s</span><span class="ok">${I('check','xs')}</span></li>`));
      pull();
      if (!running.length && !wait.length) finish();
    }
    // every task done: the queue keeps the height it has and shows the whole done list in place of the empty parts
    function finish(){
      pb.hidden = true; const box = $('.rq-ro', r);
      box.style.minHeight = Math.ceil(box.getBoundingClientRect().height) + 'px'; box.classList.add('fin');
      db.setAttribute('aria-expanded', 'true'); fold.classList.remove('shut'); fold.inert = false; fit();
    }
    paintNext(); pull();
    c.story(async s => {
      await s.beat(4);
      const last = wait[wait.length - 1]; if (last){ await s.point($('.rq-ro-hd', last.q)); await s.beat(1); move(last, 0); s.away(); }
      await s.beat(4);
      await s.until(() => $('.rq-ro-r.fail .pill', r)); await s.beat(2); const re = $('.rq-ro-r.fail .pill', r); if (re) await s.tap(re); s.away();
      await s.until(() => !running.length && !wait.length); await s.beat(6);
    });
  }
  // Segments: the first three tasks as groups, each step a segment of the group's bar and of the whole queue's bar above.
  // A group folds to its bar, and Compact folds them all
  function rqSegments(r, c){
    const G = RQ_T().slice(0, 3), list = $('.rq-sg-list', r), all = $('.rq-sg-all', r), tot = $('.rq-sg-tot', r);
    const N = G.reduce((a, g) => a + g.subs.length, 0); let compact = false, doneN = 0;
    all.textContent = `0 of ${N} done`;
    tot.innerHTML = G.flatMap(g => g.subs.map(() => '<i><b></b></i>')).join('');
    const totI = $$('i', tot);
    let k0 = 0;
    G.forEach(g => {
      g.k0 = k0; k0 += g.subs.length;
      g.el = html(`<div class="rq-sg-g" data-s="wait"><button class="rq-sg-gh" type="button" aria-expanded="true">${rqIc(g)}<b>${g.t}</b><span class="m">Queued</span><span class="cv">${I('chev-d','xs')}</span></button><div class="rq-sg-segs" aria-hidden="true">${g.subs.map(() => '<i><b></b></i>').join('')}</div><div class="fold"><div><div class="rq-sg-subs">${g.subs.map(s => `<div class="rq-sg-s wait"><span class="g"><span class="dot"></span></span><span>${s[0]}</span><span class="m"></span></div>`).join('')}</div></div></div></div>`);
      list.appendChild(g.el);
      const b = $('.rq-sg-gh', g.el), f = $('.fold', g.el);
      g.open = on => { b.setAttribute('aria-expanded', String(on)); f.classList.toggle('shut', !on); f.inert = !on; g.el.classList.toggle('closed', !on); };
      b.onclick = () => g.open(b.getAttribute('aria-expanded') !== 'true');
    });
    seg($('.rq-sg-top .seg2', r), v => { compact = v === 'compact'; G.forEach(g => g.open(!compact)); });
    const setM = (g, m) => swap($('.rq-sg-gh .m', g.el), m);
    async function runGroup(g){
      g.el.dataset.s = 'run'; setM(g, 'Running');
      const segs = $$('.rq-sg-segs i', g.el), subs = $$('.rq-sg-s', g.el), per = g.d / g.subs.length;
      for (let i = 0; i < subs.length; i++){
        const s = subs[i], bars = [segs[i], totI[g.k0 + i]];
        s.className = 'rq-sg-s'; $('.g', s).innerHTML = '<span class="spin"></span>'; bars.forEach(x => x.classList.add('run'));
        let p = 0; const failAt = g.fail === i && !g.retried ? .6 : 2;
        await new Promise(res => { const iv = c.every(100, () => { p = Math.min(1, p + .1 / per); bars.forEach(x => x.style.setProperty('--p', p.toFixed(3))); if (p >= failAt || p >= 1){ clearInterval(iv); res(); } }); });
        if (p < 1){
          // the step fails: its segment is hatched in red and it waits for Retry, which presses itself after a moment until
          // you take over
          bars.forEach(x => { x.classList.remove('run'); x.classList.add('fail'); }); s.className = 'rq-sg-s fail'; $('.g', s).innerHTML = I('x','xs'); g.el.dataset.s = 'fail'; setM(g, '1 failed');
          $('.m', s).innerHTML = '<button class="rq-sg-retry" type="button">Retry</button>'; if (compact) g.open(true);
          await new Promise(res => { const b = $('.rq-sg-retry', s); b.onclick = res; c.auto(3000, () => { if (b.isConnected){ b.classList.add('on'); c.auto(240, res); } }); });
          g.retried = true; bars.forEach(x => { x.classList.remove('fail'); x.style.setProperty('--p', 0); }); s.className = 'rq-sg-s'; $('.m', s).textContent = ''; g.el.dataset.s = 'run'; setM(g, 'Retrying'); i--; continue;
        }
        bars.forEach(x => x.classList.remove('run')); segs[i].classList.remove('flash'); void segs[i].offsetWidth; segs[i].classList.add('flash');
        s.className = 'rq-sg-s done'; $('.g', s).innerHTML = I('check','xs'); swap($('.m', s), g.subs[i][1]); doneN++; rqText(all, `${doneN} of ${N} done`);
      }
      g.el.dataset.s = 'done'; setM(g, `Done · ${g.d.toFixed(1)}s`);
    }
    c.run(async () => { await c.wait(600); for (const g of G) await runGroup(g); swap(all, `All ${N} done`); });
    c.story(async s => {
      await s.until(() => G[1].el.dataset.s === 'done'); await s.beat(2);
      await s.tap($('.rq-sg-top [data-v="compact"]', r)); s.away(); await s.beat(5);
      await s.tap($('.rq-sg-top [data-v="full"]', r)); s.away();
      await s.until(() => G[2].el.dataset.s === 'done'); await s.beat(4);
    });
  }
  // Workers: each worker runs one task, with a ring that fills as it goes. Add or take away a worker (one taken away finishes
  // its task first), press a waiting task to run it next, or cancel a running one
  function rqWorkers(r, c){
    const T = RQ_T(), slots = $('.rq-wk-slots', r), waitEl = $('.rq-wk-wait', r), stack = $('.rq-wk-stack', r), fc = $('.rq-wk-fc', r), st = $('.rq-wk-st', r), nv = $('.rq-wk-v', r), mB = $('.rq-wk-m', r), pB = $('.rq-wk-p', r);
    let n = 2, wait = T.slice(), W = [], done = 0;
    // the ring's two halves turn with the task: the right one for the first half, the left one after
    const ring = (el, p) => { el.style.setProperty('--a1', (Math.min(p, .5) * 360).toFixed(1) + 'deg'); el.style.setProperty('--a2', (Math.max(0, p - .5) * 360).toFixed(1) + 'deg'); };
    const idle = () => `<span class="rq-wk-idle" aria-hidden="true">${I('clock','xs')}</span>`;
    // a chip that is new rises in; the others glide to their new places
    const rise = el => { if (!REDUCE && el.animate) el.animate([{ opacity:0, transform:'translateY(10px) scale(.98)' }, { opacity:1, transform:'none' }], { duration:400, easing:'cubic-bezier(.22,1,.36,1)' }); };
    function paintWait(){
      const empty = $('.rq-wk-empty', waitEl); if (!wait.length && !empty) waitEl.appendChild(html('<span class="rq-wk-empty">Nothing waiting</span>')); if (wait.length && empty) empty.remove();
      const fresh = [];
      wait.forEach((t, i) => {
        if (!t.c){ t.c = html(`<button class="chip rq-wk-c" type="button" role="listitem" data-tip="Run next">${rqIc(t)}<span>${t.sh}</span><span class="k num"></span></button>`); t.c.onclick = () => { const k = wait.indexOf(t); if (k > 0){ wait.splice(k, 1); wait.unshift(t); paintWait(); } }; fresh.push(t.c); }
        rqText($('.k', t.c), i === 0 ? 'next' : `~${Math.round(t.d)}s`); t.c.setAttribute('aria-label', `${t.t}, ${i === 0 ? 'runs next' : 'position ' + (i + 1) + ', press to run it next'}`);
      });
      rqFlip(() => $$('.rq-wk-c', waitEl).filter(el => !fresh.includes(el)), () => rqOrder(waitEl, '.rq-wk-c', wait.map(t => t.c)));
      fresh.forEach(rise);
    }
    function worker(){ const w = { el:html(`<div class="rq-wk-w new"><span class="rq-wk-ring"><span class="tr"></span><span class="h r"><i></i></span><span class="h l"><i></i></span>${idle()}</span><span class="rq-wk-wn">Free</span><span class="rq-wk-ws">Waiting for a task</span></div>`), t:null }; slots.appendChild(w.el); W.push(w); return w; }
    const out = w => { w.el.classList.add('out'); c.later(450, () => w.el.remove()); };
    function setN(k){
      k = Math.max(1, Math.min(3, k)); if (k === n && W.length === n) return; n = k; nv.textContent = n; slots.style.setProperty('--n', n);
      while (W.length < n) worker();
      // a worker you take away finishes its task first
      W.forEach((w, i) => { w.retire = i >= n; if (w.retire && !w.t) out(w); });
      W = W.filter(w => !(w.retire && !w.t));
      mB.disabled = n <= 1; pB.disabled = n >= 3;
      feed();
    }
    mB.onclick = () => setN(n - 1); pB.onclick = () => setN(n + 1);
    const line = () => rqText(st, `${done} of ${T.length} done · ${W.filter(w => w.t).length} running`);
    function feed(){ W.forEach(w => { if (!w.t && !w.retire && wait.length){ const t = wait.shift(); if (t.c){ t.c.remove(); t.c = null; } run(w, t); } }); paintWait(); line(); }
    function run(w, t){
      w.t = t; const el = w.el; el.className = 'rq-wk-w busy'; ring(el, 0);
      $('.rq-wk-ring', el).lastElementChild.outerHTML = rqIc(t);
      $('.rq-wk-wn', el).textContent = t.t; const ws = $('.rq-wk-ws', el); ws.textContent = rqLeft(t.d);
      const x = html(`<button class="ib rq-wk-x" type="button" aria-label="Cancel ${t.t}" data-tip="Cancel">${I('x','xs')}</button>`); el.appendChild(x);
      let p = 0, stop = false;
      const finish = ok => {
        clearInterval(iv); x.remove(); w.t = null;
        // a task cancelled while it waits for Retry takes its Retry with it
        const re = $('.rq-wk-re', el); if (re) re.replaceWith(ws);
        if (ok){ done++; fc.textContent = done; stack.appendChild(html(`<i class="${t.app ? 'app' : ''}" style="--k:${Math.min(done - 1, 9)}">${t.app ? BRAND[t.app] : I(t.ic, 'xs')}</i>`)); }
        el.className = 'rq-wk-w'; ring(el, 0); $('.rq-wk-ring', el).lastElementChild.outerHTML = idle(); $('.rq-wk-wn', el).textContent = 'Free'; ws.textContent = wait.length ? 'Taking the next task' : 'Nothing waiting';
        if (w.retire){ out(w); W = W.filter(z => z !== w); }
        c.later(REDUCE ? 0 : 450, feed); line();
      };
      x.onclick = () => { stop = true; finish(false); };
      const iv = c.every(100, () => {
        if (stop) return; p = Math.min(1, p + .1 / t.d); ring(el, p); rqText(ws, rqLeft(t.d * (1 - p)));
        // the test send fails once: the worker turns red and waits for Retry, which presses itself after a moment until you
        // take over
        if (t.fail !== undefined && !t.failed && p >= .55){
          t.failed = true; stop = true; el.classList.add('fail');
          const b = html('<button class="rq-wk-re" type="button">Retry</button>'); ws.replaceWith(b); enter(b);
          const again = () => { if (!b.isConnected) return; b.replaceWith(ws); el.classList.remove('fail'); p = .4; ring(el, p); stop = false; }; b.onclick = again; c.auto(4500, again);
        }
        if (p >= 1) finish(true);
      });
    }
    for (let i = 0; i < n; i++) worker();
    feed();
    c.story(async s => {
      await s.beat(5);
      await s.tap(pB); s.away(); await s.beat(3);
      const last = wait[wait.length - 1]; if (last && last.c){ await s.tap(last.c); s.away(); }
      await s.until(() => $('.rq-wk-re', r)); await s.beat(2); const re = $('.rq-wk-re', r); if (re) await s.tap(re); s.away();
      await s.until(() => done === T.length); await s.beat(4);
    });
  }
  // the switch under the queue (on designme.dev, the card's tabs) picks the design. A pick draws it in place and plays its
  // demo from the start, on a controller of its own inside the card's: a mouse on the component holds it, a click, a key or
  // the focus inside the design stops it for good, and the card keeps the pick when it plays again or is replayed
  function rqDesigns(r, c, D){
    const main = $('.dm-main', r), sg = $('.demo .seg2', r), card = c.card || r;
    let k = null, at = D[card._rqDesign] ? card._rqDesign : 'classic';
    const show = (v, fresh) => {
      if (k){ k.stop(); const i = c.kids.indexOf(k); if (i >= 0) c.kids.splice(i, 1); }
      const kk = k = ctl(c); kk.card = c.card; kk.st = c.st;
      Object.defineProperty(kk, 'held', { get:() => c.held });
      Object.defineProperty(kk, 'seen', { get:() => c.seen });
      const mine = e => { if (e.isTrusted) kk.mine = true; };
      ['pointerdown', 'keydown', 'input', 'click'].forEach(t => kk.on(main, t, mine, true));
      kk.on(main, 'focusin', e => { if (e.isTrusted && e.timeStamp - lastInput < 100) kk.mine = true; }, true);
      if (openPop && main.contains(openPop.pop)) closePops();
      // the pointer of the story that was playing goes with it
      hideTip(); $$(':scope>.hand', c.st).forEach(h => h.remove());
      main.innerHTML = D[v][0];
      try { D[v][1](main, kk); } catch(e){ console.error(e); }
      if (fresh) reveal(main);
    };
    c.offs.push(() => { if (k) k.stop(); });
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === at)));
    seg(sg, v => { if (v === at || !D[v]) return; at = card._rqDesign = v; show(v, true); });
    show(at, false);
  }
  DM.def('run-queue', (r, c, card) => {
    // installed on its own (no switch), or inside another component, it is Classic
    const dm = $(':scope>.rq-dm', r);
    if (!dm) return classic(r, c, card);
    if (r !== c.st || !card){ dm.replaceWith(...$(':scope>.dm-main', dm).childNodes); return classic(r, c, card); }
    rqDesigns(r, c, { classic:[$(':scope>.dm-main', dm).innerHTML, classic], reorder:[RQ_HTML.reorder, rqReorder], segments:[RQ_HTML.segments, rqSegments], workers:[RQ_HTML.workers, rqWorkers] });
  });
}
/* ---------- Agent tree ---------- */
DM.def('agent-tree', (r, c) => {
  // a welcome-email run. Nothing but the orchestrator is on screen at the start: each agent and step appears when it is
  // spawned, and its elbow draws in. cost and tok are what that node spends itself; a branch shows the rollup
  const money = v => '$' + (v < 0 ? 0 : v).toFixed(2);
  const fmtTok = n => { n = Math.max(0, Math.round(n)); if (n >= 10000) return Math.round(n / 1000) + 'k'; if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'; return String(n); };
  const clock = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const G = { run:'<span class="spin"></span>', done:I('ok','xs'), fail:I('alert','xs'), wait:I('hand','xs'), queued:'<span class="dot"></span>' };
  const root = $('.atr', r), tree = $('.atr-tree', r), stEl = $('.atr-st', r), tot = $('.atr-tot', r), detail = $('.atr-detail', r);
  const chatLive = $('.atr-chat-live', r);
  const all = []; const seen = new Set();
  let booting = true, hover = null, selected = null, ended = 0, t0 = performance.now();
  const by = id => all.find(n => n.id === id);
  const sum = n => n.cost + n.kids.reduce((a, k) => a + sum(k), 0);
  const sumTok = n => n.tok + n.kids.reduce((a, k) => a + sumTok(k), 0);
  const kids = n => n.kids.length > 0;
  const elapsed = n => { if (!n.ran) return ''; const end = n.doneAt || performance.now(); return clock(Math.floor((end - n.ran) / 1000)); };
  const elbow = () => { const host = root.closest('[data-style]') || document.documentElement; return host.getAttribute('data-style') === 'soft' ? 8 : 0; };

  function rowEl(n){
    n.el = html(`<div class="atr-n ${n.s}" data-id="${n.id}" role="treeitem" aria-level="${n.lv + 1}" aria-selected="false" tabindex="-1"><span class="atr-sp"></span><span class="atr-g">${G[n.s]}</span><span class="atr-t"><span class="atr-nm"><b></b><span class="atr-time num"></span></span><span class="atr-task"></span></span><span class="atr-meta"><span class="atr-c num"></span><span class="atr-tok num"></span></span></div>`);
    $('.atr-nm b', n.el).textContent = n.n;
    $('.atr-task', n.el).textContent = n.t;
    return n.el;
  }
  function ensureKids(n){
    if (n.fold) return;
    const sp = $('.atr-sp', n.el);
    if (sp){ const tg = html(`<span class="atr-tg" aria-hidden="true">${I('chev-d','xs')}</span>`); sp.replaceWith(tg); }
    n.el.setAttribute('aria-expanded', 'true');
    n.fold = html('<div class="fold atr-kids"><div class="atr-nest"><svg class="atr-svg" aria-hidden="true"></svg></div></div>');
    n.nest = $('.atr-nest', n.fold);
    n.item.appendChild(n.fold);
  }
  function add(parent, spec){
    const n = { id:spec.id, n:spec.n, t:spec.t, s:spec.s || 'run', cost:spec.cost || 0, tok:spec.tok || 0, kids:[], parent, lv:parent ? parent.lv + 1 : 0, ran:0, doneAt:0, fold:null, nest:null };
    if (n.s === 'run' || n.s === 'wait' || n.s === 'fail') n.ran = performance.now();
    if (parent) parent.kids.push(n);
    all.push(n);
    n.item = html('<div class="atr-item"></div>');
    rowEl(n);
    n.item.appendChild(n.el);
    if (!parent) tree.appendChild(n.item);
    else { ensureKids(parent); parent.nest.appendChild(n.item); }
    if (!booting){ enter(n.el); schedule(); }
    return n;
  }
  function setStatus(n, s, t){
    n.s = s;
    if ((s === 'run' || s === 'wait' || s === 'fail') && !n.ran) n.ran = performance.now();
    if (s === 'done' || s === 'fail') n.doneAt = n.doneAt || performance.now();
    if (s === 'run') n.doneAt = 0;
    n.el.classList.remove('queued', 'run', 'done', 'fail', 'wait');
    n.el.classList.add(s);
    const g = $('.atr-g', n.el); g.innerHTML = G[s]; if (!booting) enter(g);
    if (t !== undefined){ n.t = t; swap($('.atr-task', n.el), t); }
    const ask = $('.atr-ask', n.el); if (ask && s !== 'fail' && s !== 'wait') ask.remove();
    if (!booting) schedule();
  }
  function showAsk(n, kind, label, onYes, noLabel){
    const old = $('.atr-ask', n.el); if (old) old.remove();
    const box = $('.atr-t', n.el);
    const ask = kind === 'fix'
      ? html('<span class="atr-ask"><button type="button" class="pill sm atr-fix"></button></span>')
      : html('<span class="atr-ask"><button type="button" class="pill primary sm atr-yes"></button><button type="button" class="pill sm atr-no"></button></span>');
    box.appendChild(ask);
    if (kind === 'fix'){ const b = $('.atr-fix', ask); b.textContent = label; b.onclick = e => { e.stopPropagation(); onYes(); }; }
    else {
      const yes = $('.atr-yes', ask), no = $('.atr-no', ask);
      yes.textContent = label; no.textContent = noLabel || 'Hold';
      yes.onclick = e => { e.stopPropagation(); onYes(); };
      no.onclick = e => { e.stopPropagation(); setStatus(n, 'wait', 'Held for you'); paint(); };
    }
    if (!booting){ enter(ask); schedule(); }
  }
  function lineage(id){ const out = new Set(); for (let p = id && by(id); p; p = p.parent) out.add(p.id); return out; }
  function applyPath(){
    const hot = lineage(hover || (selected && selected.id));
    const running = new Set();
    all.forEach(n => { if (n.s === 'run') for (let p = n; p; p = p.parent) running.add(p.id); });
    const tip = hover || (selected && selected.id);
    all.forEach(n => n.el.classList.toggle('path', n.id === tip));
    $$('.atr-wire', root).forEach(w => { w.classList.toggle('live', running.has(w.dataset.id)); w.classList.toggle('on', hot.has(w.dataset.id)); });
    $$('.atr-flow', root).forEach(w => { if (!running.has(w.dataset.id)) w.remove(); });
  }
  function layout(){
    const R = elbow();
    const running = new Set();
    all.forEach(n => { if (n.s === 'run') for (let p = n; p; p = p.parent) running.add(p.id); });
    const hot = lineage(hover || (selected && selected.id));
    $$('.atr-nest', root).forEach(nest => {
      const svg = $('.atr-svg', nest); if (!svg) return;
      const w = nest.clientWidth, h = nest.clientHeight;
      if (w < 2 || h < 2) return;
      const rail = (parseFloat(getComputedStyle(nest).paddingLeft) || 20) / 2;
      svg.setAttribute('width', String(w)); svg.setAttribute('height', String(h)); svg.setAttribute('viewBox', '0 0 ' + w + ' ' + h);
      const items = [...nest.children].filter(el => el.classList.contains('atr-item'));
      const keep = new Set();
      let prev = 0;
      items.forEach(item => {
        const row = $(':scope>.atr-n', item); if (!row) return;
        const id = row.dataset.id; keep.add(id);
        const nb = nest.getBoundingClientRect(), rb = row.getBoundingClientRect();
        const y = rb.top - nb.top + rb.height / 2;
        const r = Math.min(R, Math.max(0, y - prev - 1));
        const x = Math.max(rail + r + 10, rb.left - nb.left + 4);
        const turn = y - r;
        const d = r < 2
          ? 'M ' + rail + ' ' + prev + ' V ' + y + ' H ' + x
          : 'M ' + rail + ' ' + prev + ' V ' + turn + ' Q ' + rail + ' ' + y + ' ' + (rail + r) + ' ' + y + ' H ' + x;
        prev = r < 2 ? y : turn;
        let wire = svg.querySelector('.atr-wire[data-id="' + id + '"]');
        if (!wire){
          wire = document.createElementNS('http://www.w3.org/2000/svg', 'path');
          wire.setAttribute('class', 'atr-wire'); wire.dataset.id = id; svg.appendChild(wire);
        }
        wire.setAttribute('d', d);
        const len = Math.max(1, Math.ceil(wire.getTotalLength()));
        if (!seen.has(id)){
          seen.add(id);
          if (!REDUCE){
            wire.style.setProperty('--len', String(len));
            wire.classList.add('draw');
            wire.addEventListener('animationend', () => { wire.classList.remove('draw'); wire.style.removeProperty('--len'); }, { once:true });
          }
        } else if (!wire.classList.contains('draw')) wire.style.removeProperty('--len');
        else wire.style.setProperty('--len', String(len));
        const st = by(id) && by(id).s;
        wire.classList.toggle('live', running.has(id) && st !== 'fail' && st !== 'wait');
        wire.classList.toggle('bad', st === 'fail');
        wire.classList.toggle('wait', st === 'wait');
        wire.classList.toggle('on', hot.has(id));
        let flow = svg.querySelector('.atr-flow[data-id="' + id + '"]');
        if (running.has(id) && !REDUCE){
          if (!flow){ flow = document.createElementNS('http://www.w3.org/2000/svg', 'path'); flow.setAttribute('class', 'atr-flow'); flow.dataset.id = id; svg.appendChild(flow); }
          flow.setAttribute('d', d);
        } else if (flow) flow.remove();
      });
      $$('.atr-wire, .atr-flow', svg).forEach(p => { if (!keep.has(p.dataset.id)) p.remove(); });
    });
    const tip = hover || (selected && selected.id);
    all.forEach(n => n.el.classList.toggle('path', n.id === tip));
  }
  let frame = 0;
  const schedule = () => { if (booting) return; cancelAnimationFrame(frame); frame = requestAnimationFrame(layout); };
  const ro = new ResizeObserver(schedule);
  function paint(){
    all.forEach(n => {
      const v = kids(n) ? sum(n) : n.cost, tk = kids(n) ? sumTok(n) : n.tok;
      const ce = $('.atr-c', n.el), te = $('.atr-tok', n.el), tm = $('.atr-time', n.el);
      const cost = n.s === 'queued' && v < 0.005 ? '–' : money(v);
      const tok = n.s === 'queued' && tk < 1 ? '' : fmtTok(tk);
      if (ce.textContent !== cost) ce.textContent = cost;
      if (te.textContent !== tok) te.textContent = tok;
      const elap = n.s === 'queued' || !n.ran ? '' : elapsed(n);
      const shown = n.s !== 'run' && elap === '0:00' ? '' : elap;
      if (tm.textContent !== shown) tm.textContent = shown;
      if (kids(n)) ce.dataset.tip = 'Its own ' + money(n.cost) + ', ' + n.kids.length + (n.lv ? (n.kids.length > 1 ? ' steps ' : ' step ') : (n.kids.length > 1 ? ' agents ' : ' agent ')) + money(sum(n) - n.cost) + (sumTok(n) ? ' · ' + fmtTok(sumTok(n)) + ' tokens' : '');
    });
    const total = all.length ? sum(all[0]) : 0;
    tot.textContent = money(total);
    const failed = all.filter(n => n.s === 'fail').length, waiting = all.filter(n => n.s === 'wait').length, finished = all[0] && all[0].s === 'done';
    const line = finished ? 'Done' : failed ? (failed + ' step' + (failed > 1 ? 's' : '') + ' failed') : waiting ? 'Needs you' : 'Running';
    const m = $('.m', stEl); if (m && m.textContent !== line && !m.classList.contains('out')) swap(m, line);
    const secs = Math.floor(((ended || performance.now()) - t0) / 1000);
    const ck = $('.ck', stEl); if (ck) ck.textContent = clock(secs);
    if (detail && selected){
      const n = selected, k = n.kids.length, own = money(n.cost), tk = sumTok(n);
      const rest = k ? ' · ' + k + (n.lv ? (k > 1 ? ' steps ' : ' step ') : (k > 1 ? ' agents ' : ' agent ')) + ' ' + money(sum(n) - n.cost) : '';
      const word = n.s === 'run' ? 'running' : n.s === 'wait' ? 'needs you' : n.s === 'fail' ? 'failed' : n.s === 'done' ? 'done' : 'queued';
      const text = n.n + ' · its own ' + own + rest + (tk ? ' · ' + fmtTok(tk) + ' tokens' : '') + ' · ' + word;
      if (detail.textContent !== text) detail.textContent = text;
    }
    if (chatLive){
      const mode = finished ? 'done' : failed ? 'fail' : waiting ? 'wait' : 'run';
      const label = finished ? 'Done' : failed ? 'A step failed' : waiting ? 'Needs you' : 'Working';
      chatLive.classList.remove('run', 'wait', 'fail', 'done'); chatLive.classList.add(mode);
      const lt = $('.atr-chat-lt', chatLive); if (lt && lt.textContent !== label) lt.textContent = label;
    }
  }
  function select(n){
    if (!n) return;
    selected = n;
    all.forEach(x => { x.el.tabIndex = x === n ? 0 : -1; x.el.setAttribute('aria-selected', x === n ? 'true' : 'false'); });
    paint(); applyPath();
  }
  function toggle(n, open){
    if (!kids(n)) return;
    const o = open ?? n.el.getAttribute('aria-expanded') !== 'true';
    n.el.setAttribute('aria-expanded', String(o));
    n.fold.classList.toggle('shut', !o); n.fold.inert = !o;
    schedule();
  }
  function wipe(){
    tree.textContent = '';
    const sm = $('.atr-sum', root); if (sm) sm.remove();
    all.splice(0, all.length); seen.clear(); selected = null; hover = null;
  }
  // the tallest moment: every branch open, the approval sitting under its step, and the summary underneath. Measured once,
  // hidden from the first paint, so the stage can keep the tree centred while it is still only the orchestrator
  function mountFull(){
    const T = add(null, { id:'root', n:'Brief', t:'Welcome email is ready', s:'done', cost:.04, tok:240 });
    const reader = add(T, { id:'reader', n:'Reader', t:'Notes and sends are in', s:'done', cost:.02, tok:90 });
    add(reader, { id:'r1', n:'Read the last 3 sends', t:'3 emails, 1.1k words', s:'done', cost:.05, tok:640 });
    add(reader, { id:'r2', n:'Pull the voice notes', t:'Tone, length, words to keep', s:'done', cost:.04, tok:380 });
    const writer = add(T, { id:'writer', n:'Writer', t:'Draft is in the voice notes', s:'done', cost:.03, tok:160 });
    add(writer, { id:'w1', n:'Draft the subject', t:'Four options, shortest wins', s:'done', cost:.04, tok:420 });
    const w2 = add(writer, { id:'w2', n:'Draft the body', t:'Runs past 90 words', s:'fail', cost:.06, tok:880 });
    showAsk(w2, 'fix', 'Trim to 90 words', () => {});
    const checker = add(T, { id:'checker', n:'Checker', t:'Approve the send', s:'wait', cost:.02, tok:120 });
    add(checker, { id:'c1', n:'Count the words and the tone', t:'86 words, tone matches', s:'done', cost:.04, tok:510 });
    showAsk(checker, 'wait', 'Approve send', () => {}, 'Hold');
    root.appendChild(html('<div class="atr-sum">' + I('ok','xs') + '<span>Done in 0:12 · 3 agents · $0.48 · 4.4k tokens</span></div>'));
  }
  mountFull();
  root._full = root.offsetHeight;
  wipe();
  booting = false;
  t0 = performance.now();
  const T = add(null, { id:'root', n:'Brief', t:'Splitting the welcome email', s:'run', cost:.02, tok:80 });
  select(T);
  ro.observe(root); c.offs.push(() => ro.disconnect());
  schedule();

  c.every(100, () => {
    if (ended) return;
    all.forEach(n => { if (n.s === 'run'){ n.cost += n.lv ? .0015 : .0005; n.tok += n.lv ? 22 : 8; } });
    paint();
  });
  paint();

  const visible = () => all.filter(n => { for (let p = n.parent; p; p = p.parent) if (p.fold && p.el.getAttribute('aria-expanded') === 'false') return false; return true; });
  c.on(tree, 'pointerover', e => { if (e.pointerType && e.pointerType !== 'mouse') return; const row = e.target.closest('.atr-n'); hover = row ? row.dataset.id : null; applyPath(); });
  c.on(tree, 'pointerleave', () => { hover = null; applyPath(); });
  c.on(tree, 'focusin', e => { const row = e.target.closest('.atr-n'); if (!row) return; const n = by(row.dataset.id); if (n) select(n); });
  c.on(tree, 'click', e => {
    if (e.target.closest('button')) return;
    const row = e.target.closest('.atr-n'); if (!row) return;
    const n = by(row.dataset.id); if (!n) return;
    select(n); toggle(n);
  });
  c.on(tree, 'keydown', e => {
    if (e.target.closest('button')) return;
    const v = visible(), i = v.findIndex(n => n.el === document.activeElement); if (i < 0) return;
    const n = v[i], open = n.el.getAttribute('aria-expanded') === 'true'; let go = null;
    if (e.key === 'ArrowDown') go = v[i + 1];
    else if (e.key === 'ArrowUp') go = v[i - 1];
    else if (e.key === 'ArrowRight'){ if (kids(n) && !open) toggle(n, true); else if (kids(n)) go = n.kids[0]; }
    else if (e.key === 'ArrowLeft'){ if (kids(n) && open) toggle(n, false); else go = n.parent; }
    else if (e.key === 'Home') go = v[0];
    else if (e.key === 'End') go = v[v.length - 1];
    else if (e.key === 'Enter' || e.key === ' '){ const yes = $('.atr-yes, .atr-fix', n.el); if (yes) yes.click(); else toggle(n); }
    else return;
    e.preventDefault();
    if (go){ select(go); go.el.focus({ preventScroll:true }); }
  });

  // the run grows itself. A draft runs long and offers a trim, then the checker waits for approval. Either way the demo
  // continues on its own unless a person has taken over
  let fixGo = null, yesGo = null;
  c.run(async () => {
    await c.wait(380);
    const reader = add(T, { id:'reader', n:'Reader', t:'Gathers the last sends and the voice notes', s:'run', cost:.01, tok:40 });
    await c.wait(420);
    const r1 = add(reader, { id:'r1', n:'Read the last 3 sends', t:'3 emails, 1.1k words', s:'run', cost:.02, tok:120 });
    await c.wait(980);
    setStatus(r1, 'done', '3 emails, 1.1k words');
    const r2 = add(reader, { id:'r2', n:'Pull the voice notes', t:'Tone, length, words to keep', s:'run', cost:.02, tok:80 });
    await c.wait(980);
    setStatus(r2, 'done'); setStatus(reader, 'done', 'Notes and sends are in');
    const writer = add(T, { id:'writer', n:'Writer', t:'Drafts the subject and the body', s:'run', cost:.02, tok:70 });
    const w1 = add(writer, { id:'w1', n:'Draft the subject', t:'Under 50 characters', s:'run', cost:.02, tok:140 });
    await c.wait(1100);
    setStatus(w1, 'done', 'Four options, shortest wins');
    const w2 = add(writer, { id:'w2', n:'Draft the body', t:'Under 90 words', s:'run', cost:.03, tok:220 });
    await c.wait(1100);
    setStatus(w2, 'fail', 'Runs past 90 words'); setStatus(writer, 'run', 'The draft runs long'); paint();
    await new Promise(res => { fixGo = () => { fixGo = null; res(); }; showAsk(w2, 'fix', 'Trim to 90 words', () => fixGo && fixGo()); c.auto(4500, () => fixGo && fixGo()); });
    setStatus(w2, 'run', 'Trimming it to 90 words'); setStatus(writer, 'run', 'Drafts the body'); paint();
    await c.wait(1000);
    setStatus(w2, 'done', '86 words, in the voice notes'); setStatus(writer, 'done', 'Draft is in the voice notes');
    const checker = add(T, { id:'checker', n:'Checker', t:'Checks length and tone', s:'run', cost:.01, tok:60 });
    const c1 = add(checker, { id:'c1', n:'Count the words and the tone', t:'Against the voice notes', s:'run', cost:.02, tok:180 });
    await c.wait(1000);
    setStatus(c1, 'done', '86 words, tone matches'); setStatus(checker, 'wait', 'Approve the send'); paint();
    await new Promise(res => { yesGo = () => { yesGo = null; res(); }; showAsk(checker, 'wait', 'Approve send', () => yesGo && yesGo(), 'Hold'); c.auto(4800, () => yesGo && yesGo()); });
    setStatus(checker, 'run', 'Sending is approved'); paint();
    await c.wait(860);
    setStatus(checker, 'done', 'Length and tone check out'); setStatus(T, 'done', 'Welcome email is ready');
    ended = performance.now(); paint();
    const agents = T.kids.length;
    const sm = html('<div class="atr-sum">' + I('ok','xs') + '<span></span></div>');
    $('span', sm).textContent = 'Done in ' + clock(Math.floor((ended - t0) / 1000)) + ' · ' + agents + ' agent' + (agents === 1 ? '' : 's') + ' · ' + money(sum(T)) + ' · ' + fmtTok(sumTok(T)) + ' tokens';
    root.appendChild(sm); enter(sm);
  });

  c.story(async s => {
    await s.beat(2);
    await s.until(() => by('r1'));
    hover = 'r1'; applyPath();
    await s.point(by('r1').el); await s.beat(3); hover = null; applyPath(); s.away();
    await s.until(() => $('.atr-fix', r)); await s.beat(5);
    await s.tap($('.atr-fix', r)); s.away();
    await s.until(() => $('.atr-yes', r)); await s.beat(5);
    await s.point(by('checker').el); hover = 'checker'; applyPath(); await s.beat(2);
    await s.tap($('.atr-yes', r)); hover = null; applyPath(); s.away();
    await s.until(() => ended); await s.beat(2);
    if (by('reader')){ await s.tap(by('reader').el); s.away(); }
    await s.beat(1);
  });
});

/* ---------- Agent tree designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and the others are the
   directions the owner chose. The switch is the card's alone: the registry, the code view and the component page install
   Classic, as it was (build.js leaves a data-designs="card" switch out of them) */
{
  const classic = DM.defs['agent-tree'];
  // the card has three designs, picked with the switch under the tree (on designme.dev, the card's footer tabs): Classic, the
  // tree as it has always been; Cost tree, the tree with each branch's share of the cost as a bar in the accent; and Cost
  // map, every agent and step as a block as wide as its cost, coloured by how it is doing. The two new ones play this run:
  // an orchestrator and three agents, each with its steps. cost is what each spends itself, in dollars, and it grows while it
  // runs; a branch's cost is its own and everything under it
  const ATR_RUN = () => ({ id:'root', n:'Orchestrator', t:'Plans the work and hands it out', ic:'cpu', ag:'o', cost:.04, s:'run', kids:[
    { id:'res', n:'Research agent', t:'Compare 3 competitor pricing pages', ic:'search', ag:'b', cost:.02, s:'done', kids:[
      { id:'res1', n:'Read 3 pricing pages', t:'9.4k words', cost:.06, s:'done' },
      { id:'res2', n:'Summarise their plans', t:'Notes in Pricing v4', cost:.04, s:'done' } ] },
    { id:'des', n:'Design agent', t:'Rework the plan cards in Figma', ic:'palette', ag:'l', cost:.02, s:'run', kids:[
      { id:'des1', n:'Update the Pro card', t:'Pricing v4, frame 2', cost:.05, s:'run' },
      { id:'des2', n:'Update the Team card', t:'Pricing v4, frame 3', cost:0, s:'queued' },
      { id:'des3', n:'Apply library tokens', t:'Colour and spacing', cost:0, s:'queued' } ] },
    { id:'cop', n:'Copy agent', t:'Rewrite the plan descriptions', ic:'edit', ag:'p', cost:0, s:'queued', kids:[
      { id:'cop1', n:'Rewrite 3 descriptions', t:'Under 20 words each', cost:0, s:'queued' } ] } ] });
  // the run, the same in both: the design agent works through its cards, one step fails on a token the library doesn't have
  // and waits for its fix, then the copy agent writes. on(event, node) tells the design what changed
  function atrModel(c, on){
    const T = ATR_RUN(), all = [];
    (function walk(n, lv, p){ n.lv = lv; n.parent = p; all.push(n); (n.kids || []).forEach(k => walk(k, lv + 1, n)); })(T, 0, null);
    all.forEach(n => { if (!n.ag) n.ag = n.parent.ag; });
    // each agent's step of the accent, for its bars (the orchestrator's is the first)
    T.kids.forEach((k, i) => { k.k = i + 1; }); all.forEach(n => { if (!n.k) n.k = n.lv > 1 ? n.parent.k : 1; });
    const by = id => all.find(n => n.id === id), sum = n => n.cost + (n.kids || []).reduce((a, k) => a + sum(k), 0);
    const m = { T, all, by, sum, t0:0, ended:0, fix:null };
    const set = (n, s, t) => { n.s = s; if (t !== undefined) n.t = t; on('state', n); };
    // whatever is running spends as it goes, ten times a second, and the clock counts
    c.every(100, () => { if (m.ended) return; m.t0 += .1; all.forEach(n => { if (n.s === 'run') n.cost += n.lv ? .0016 : .0005; }); on('tick'); });
    c.run(async () => {
      await c.wait(1800); set(by('des1'), 'done'); set(by('des2'), 'run');
      await c.wait(2200); set(by('des2'), 'done'); set(by('des3'), 'run');
      await c.wait(1800); const tk = by('des3'); set(tk, 'fail', 'color.accent.600 is not in the library'); set(by('des'), 'fail');
      // the fix waits for you; the person in the demo takes it after a while, unless you have taken over
      await new Promise(res => { m.fix = () => { m.fix = null; res(); }; on('ask', tk); c.auto(6500, () => m.fix && m.fix()); });
      set(tk, 'run', 'Using color.accent.500'); set(by('des'), 'run');
      await c.wait(1600); set(tk, 'done', 'Colour and spacing, from the library'); set(by('des'), 'done'); set(by('cop'), 'run'); set(by('cop1'), 'run');
      await c.wait(2600); set(by('cop1'), 'done'); set(by('cop'), 'done'); set(T, 'done'); m.ended = m.t0; on('end');
    });
    return m;
  }
  const atrVars = n => n.ag === 'o' ? '--a:var(--ink);--ai:var(--on-ink)' : `--a:var(--av-${n.ag});--ai:var(--av-${n.ag}-ink)`;
  const atrMoney = v => '$' + v.toFixed(2);
  const atrClock = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  const atrGlyph = s => s === 'run' ? '<span class="spin"></span>' : s === 'done' ? I('ok','xs') : s === 'fail' ? I('alert','xs') : '<span class="dot" style="width:5px;height:5px"></span>';

  // Cost tree: the tree with each branch's share of the whole run as a bar, and the run's cost by agent as one bar on top.
  // Hover or focus a row and the path above it darkens
  const ATR_COST = `<div class="atr-ct panel">
    <div class="atr-ct-h"><div class="atr-ct-ht"><b>Redesign the pricing page</b><span class="atr-ct-st"><span class="m">Running</span> · <span class="num ck">0:00</span></span></div><span class="atr-ct-tot num">$0.00</span></div>
    <div class="atr-ct-mix" aria-hidden="true"></div>
    <div class="atr-ct-tree" role="tree" aria-label="Agents"></div>
  </div>`;
  function atrCost(r, c){
    const tree = $('.atr-ct-tree', r), tot = $('.atr-ct-tot', r), mix = $('.atr-ct-mix', r), ck = $('.ck', r), mEl = $('.atr-ct-st .m', r), root = $('.atr-ct', r);
    let M;
    const kids = n => !!(n.kids && n.kids.length);
    function build(n){
      const row = html(`<div class="atr-ct-n" role="treeitem" aria-level="${n.lv + 1}"${kids(n) ? ' aria-expanded="true"' : ''} tabindex="-1" data-s="${n.s}" style="--lv:${n.lv};--k:var(--k${n.k});${atrVars(n)}">${kids(n) ? `<span class="atr-ct-tg" aria-hidden="true">${I('chev-d','xs')}</span>` : '<span class="atr-ct-sp"></span>'}${n.lv === 1 ? `<span class="atr-x-av" aria-hidden="true">${I(n.ic)}</span>` : `<span class="atr-x-g">${atrGlyph(n.s)}</span>`}<span class="atr-ct-t"><b>${n.n}</b><span>${n.t}</span></span><span class="atr-ct-c"><b class="num">–</b><i aria-hidden="true"><span></span></i></span></div>`);
      n.el = row; const out = [row];
      if (kids(n)){ const f = html(`<div class="fold atr-ct-kids" role="group" style="--lv:${n.lv}"><i class="atr-ct-gd" aria-hidden="true"></i><div></div></div>`); n.kids.forEach(k => build(k).forEach(e => f.lastElementChild.appendChild(e))); n.fold = f; out.push(f); }
      return out;
    }
    function toggle(n, open){ if (!kids(n)) return; const o = open ?? n.el.getAttribute('aria-expanded') !== 'true'; n.el.setAttribute('aria-expanded', String(o)); n.fold.classList.toggle('shut', !o); n.fold.inert = !o; }
    function paint(){
      const total = M.sum(M.T);
      M.all.forEach(n => { const v = kids(n) ? M.sum(n) : n.cost, b = $('.atr-ct-c b', n.el), t = n.s === 'queued' && !v ? '–' : atrMoney(v); if (b.textContent !== t) b.textContent = t;
        $('.atr-ct-c i', n.el).style.setProperty('--sh', total ? (v / total).toFixed(3) : 0);
        if (kids(n)) $('.atr-ct-c', n.el).dataset.tip = `Its own ${atrMoney(n.cost)}, the rest ${atrMoney(M.sum(n) - n.cost)}`; });
      tot.textContent = atrMoney(total);
      let at = 0; M.T.kids.forEach((k, i) => { const w = total ? M.sum(k) / total * 100 : 0; mix.children[i].style.setProperty('--x0', at.toFixed(2)); mix.children[i].style.setProperty('--x1', (at + w).toFixed(2)); at += w; });
      ck.textContent = atrClock(M.ended || M.t0);
    }
    M = atrModel(c, (ev, n) => {
      if (ev === 'state'){ n.el.dataset.s = n.s; const g = $('.atr-x-g', n.el); if (g){ g.innerHTML = atrGlyph(n.s); enter(g); } swap($('.atr-ct-t span', n.el), n.t); const f = $('.atr-x-fix', n.el); if (f && n.s !== 'fail') f.remove(); if (n.id === 'des') swap(mEl, n.s === 'fail' ? '1 step failed' : 'Running'); }
      if (ev === 'ask'){ const fix = html('<button class="pill sm atr-x-fix" type="button">Use color.accent.500</button>'); $('.atr-ct-t', n.el).appendChild(fix); enter(fix); fix.onclick = e => { e.stopPropagation(); M.fix && M.fix(); }; }
      // done: the finished design branch folds and the research opens, then the summary comes in under the tree, so the
      // tree never grows past the height it ran at
      if (ev === 'end'){ swap(mEl, 'Done'); toggle(M.by('des'), false); toggle(M.by('res'), true);
        c.later(REDUCE ? 0 : 500, () => { const sm = html(`<div class="atr-ct-sum">${I('ok','xs')}<span>Done in ${atrClock(M.ended)} · 3 agents · ${atrMoney(M.sum(M.T))}</span></div>`); root.appendChild(sm); }); }
      paint();
    });
    mix.innerHTML = M.T.kids.map(k => `<i style="--k:var(--k${k.k})"></i>`).join('');
    build(M.T).forEach(e => tree.appendChild(e)); M.T.el.tabIndex = 0;
    toggle(M.by('res'), false); paint();
    // hovering or focusing a row lights its path: every guide above it and the rows it hangs from
    const light = n => { $$('.path', tree).forEach(x => x.classList.remove('path')); for (let p = n && n.parent; p; p = p.parent){ p.fold.classList.add('path'); p.el.classList.add('path'); } };
    c.on(tree, 'pointerover', e => { const row = e.target.closest('.atr-ct-n'); light(row ? M.all.find(x => x.el === row) : null); });
    c.on(tree, 'pointerleave', () => light(null));
    c.on(tree, 'focusin', e => { const row = e.target.closest('.atr-ct-n'); light(row ? M.all.find(x => x.el === row) : null); });
    c.on(tree, 'click', e => { const row = e.target.closest('.atr-ct-n'); if (!row || e.target.closest('.atr-x-fix')) return; const n = M.all.find(x => x.el === row); M.all.forEach(x => x.el.tabIndex = x === n ? 0 : -1); toggle(n); });
    // the arrow keys move through the tree as in any tree view
    const visible = () => M.all.filter(n => { for (let p = n.parent; p; p = p.parent) if (p.el.getAttribute('aria-expanded') === 'false') return false; return true; });
    c.on(tree, 'keydown', e => {
      const v = visible(), i = v.findIndex(n => n.el === document.activeElement); if (i < 0) return;
      const n = v[i], open = n.el.getAttribute('aria-expanded') === 'true'; let go = null;
      if (e.key === 'ArrowDown') go = v[i + 1]; else if (e.key === 'ArrowUp') go = v[i - 1];
      else if (e.key === 'ArrowRight'){ if (kids(n) && !open) toggle(n, true); else if (kids(n)) go = n.kids[0]; }
      else if (e.key === 'ArrowLeft'){ if (kids(n) && open) toggle(n, false); else go = n.parent; }
      else if (e.key === 'Enter' || e.key === ' '){ const f = $('.atr-x-fix', n.el); if (f) f.click(); else toggle(n); }
      else if (e.key === 'Home') go = v[0]; else if (e.key === 'End') go = v[v.length - 1];
      else return;
      e.preventDefault(); if (go){ M.all.forEach(x => x.el.tabIndex = -1); go.el.tabIndex = 0; go.el.focus({ preventScroll:true }); }
    });
    // the person in the demo: reads the design branch's cost and the path above a step, then takes the fix
    c.story(async s => {
      await s.beat(3); await s.point($('.atr-ct-c', M.by('des').el)); light(M.by('des1')); await s.beat(4); light(null); s.away();
      await s.until(() => $('.atr-x-fix', r)); await s.beat(3);
      await s.tap($('.atr-x-fix', r)); s.away();
      await s.until(() => M.ended); await s.beat(5);
    });
    // it ends as tall as it starts (the fix, while it waits under the failed step, adds a line below), so the height it
    // mounts with is the one that sits centred
  }

  // Cost map: every agent and step as a block as wide as its cost, growing live, in the colour of how it is doing; press a
  // block to zoom into it
  const ATR_MAP = `<div class="atr-cm panel">
    <div class="atr-cm-h"><div class="atr-cm-ht"><nav class="atr-cm-crumb" aria-label="Where you are"></nav><span class="atr-cm-st num">Running · 0:00</span></div><span class="atr-cm-tot num">$0.00</span></div>
    <div class="atr-cm-map" role="group" aria-label="Cost by agent and step"></div>
    <ul class="atr-cm-lg" aria-label="What the colours mean"><li data-s="done"><i></i>Done</li><li data-s="run"><i></i>Running</li><li data-s="fail"><i></i>Failed</li><li data-s="queued"><i></i>Queued</li></ul>
    <div class="atr-cm-say" aria-live="polite"></div>
    <ul class="atr-cm-key" aria-label="Agents"></ul>
  </div>`;
  function atrMap(r, c){
    const map = $('.atr-cm-map', r), crumb = $('.atr-cm-crumb', r), st = $('.atr-cm-st', r), tot = $('.atr-cm-tot', r), say = $('.atr-cm-say', r), key = $('.atr-cm-key', r);
    let M, top, W = 0, shown = '';
    // each block's place and width, as shares of the branch on show; blocks outside it fade. The branch fills the first row,
    // its children the second and theirs the third, and each branch's own work (what it spends besides its children) closes
    // its row, hatched, so every row adds up
    function lay(){
      const base = top, total = Math.max(1e-6, M.sum(base)), gap = 4, pos = new Map(), own = new Map();
      pos.set(base, { x:0, w:1, lv:0 });
      let x = 0; (base.kids || []).forEach(k => { const w = M.sum(k) / total; pos.set(k, { x, w, lv:1 }); let y = x; (k.kids || []).forEach(g => { const gw = M.sum(k) ? g.cost / M.sum(k) * w : 0; pos.set(g, { x:y, w:gw, lv:2 }); y += gw; }); if (k.kids) own.set(k, { x:y, w:M.sum(k) ? k.cost / M.sum(k) * w : 0, lv:2 }); x += w; });
      own.set(base, { x, w:base.cost / total, lv:1 });
      M.all.forEach(n => { if (!n.ob) return; const p = own.get(n); if (!p || p.w * W < 3){ n.ob.classList.add('gone'); return; } n.ob.classList.remove('gone'); n.ob.style.setProperty('--lv', p.lv); n.ob.style.setProperty('--x', (p.x * W).toFixed(1) + 'px'); n.ob.style.setProperty('--w', Math.max(0, p.w * W - gap).toFixed(1) + 'px'); n.ob.dataset.tip = `${n.lv ? n.n : 'The orchestrator'}'s own work, ${atrMoney(n.cost)}`; });
      M.all.forEach(n => {
        const p = pos.get(n), el = n.b; if (!el) return;
        if (!p){ el.classList.add('gone'); el.tabIndex = -1; return; }
        el.classList.remove('gone'); el.tabIndex = 0;
        const px = p.x * W, pw = Math.max(0, p.w * W - (p.lv ? gap : 0));
        el.style.setProperty('--lv', p.lv); el.style.setProperty('--x', px.toFixed(1) + 'px'); el.style.setProperty('--w', pw.toFixed(1) + 'px');
        // a block too narrow for its words keeps only its colour, and says them in its tooltip
        $('.atr-cm-l', el).style.opacity = pw > 64 ? 1 : 0;
      });
    }
    const ro = new ResizeObserver(() => { W = map.clientWidth; lay(); }); ro.observe(map); c.offs.push(() => ro.disconnect());
    function crumbs(){
      const path = []; for (let p = top; p; p = p.parent) path.unshift(p);
      crumb.innerHTML = path.map((p, i) => i === path.length - 1 ? `<b>${p.lv ? p.n : 'Pricing page'}</b>` : `<button type="button" data-id="${p.id}">${p.lv ? p.n : 'Pricing page'}</button>${I('chev-r','xs')}`).join('');
      $$('button', crumb).forEach(b => b.onclick = () => go(M.by(b.dataset.id)));
    }
    function go(n){ if (!n || !n.kids) return; top = n; crumbs(); lay(); const f = n.b; if (f && document.activeElement && map.contains(document.activeElement)) f.focus({ preventScroll:true }); }
    const word = { done:' · done', run:' · running', fail:' · failed', queued:' · queued' };
    function tell(n){ if (!n){ say.innerHTML = shown; return; } const v = M.sum(n), share = v / Math.max(1e-6, M.sum(M.T)) * 100; say.innerHTML = `<b>${n.n}</b> · ${atrMoney(v)}, ${share.toFixed(0)}% of the run${n.kids ? ` · its own ${atrMoney(n.cost)}` : ''}${n.lv ? word[n.s] : ''}`; }
    function blocks(){
      M.all.forEach(n => {
        n.b = html(`<button class="atr-cm-b${n.lv === 0 ? ' lv0' : ''}" type="button" data-s="${n.s}" aria-label="${n.n}"><span class="bg"><span class="sh"></span></span><i class="k" aria-hidden="true"></i><span class="atr-cm-l"><b>${n.lv === 0 ? 'Whole run' : n.n.replace(' agent', '')}</b><span class="v">–</span></span></button>`);
        n.b.dataset.tip = n.n;
        map.appendChild(n.b);
        if (n.kids){ n.ob = html('<span class="atr-cm-b own" aria-hidden="true"><span class="bg"></span></span>'); map.appendChild(n.ob); }
        n.b.onclick = () => { if (n === top && n.parent) go(n.parent); else if (n.kids && n !== top) go(n); else tell(n); };
        ['pointerenter', 'focus'].forEach(ev => n.b.addEventListener(ev, () => tell(n)));
        ['pointerleave', 'blur'].forEach(ev => n.b.addEventListener(ev, () => tell(null)));
      });
    }
    c.on(map, 'keydown', e => { if (e.key === 'Escape' && top.parent){ e.preventDefault(); go(top.parent); } });
    function legend(){
      key.innerHTML = M.T.kids.map(k => `<li style="${atrVars(k)}" data-s="${k.s}"><span class="atr-x-av" aria-hidden="true">${I(k.ic)}</span><span class="t">${k.n}</span><span class="tg"></span><span class="p num"></span><span class="c num"></span></li>`).join('');
      M.T.kids.forEach((k, i) => { k.li = key.children[i]; });
    }
    // each agent's state, as a tag in the colour its blocks have
    const TG = { run:'<span class="tag warn"><span class="spin"></span>Running</span>', done:`<span class="tag ok">${I('check','xs')}Done</span>`, fail:'<span class="tag bad">Failed</span>', queued:'<span class="tag">Queued</span>' };
    let k10 = 0;
    function paint(full){
      const total = M.sum(M.T);
      tot.textContent = atrMoney(total);
      M.all.forEach(n => { const v = $('.v', n.b); const t = n.s === 'queued' && !M.sum(n) ? 'Queued' : atrMoney(M.sum(n)); if (v.textContent !== t) v.textContent = t; });
      M.T.kids.forEach(k => { const p = Math.round(M.sum(k) / total * 100) + '%', cc = atrMoney(M.sum(k)); if ($('.p', k.li).textContent !== p) $('.p', k.li).textContent = p; if ($('.c', k.li).textContent !== cc) $('.c', k.li).textContent = cc; });
      // the blocks are laid out again twice a second, and glide to their new widths
      if (full || ++k10 % 5 === 0) lay();
      st.textContent = (M.ended ? 'Done in ' : 'Running · ') + atrClock(M.ended || M.t0);
    }
    M = atrModel(c, (ev, n) => {
      if (ev === 'state'){ n.b.dataset.s = n.s; if (n.lv === 1){ n.li.dataset.s = n.s; $('.tg', n.li).innerHTML = TG[n.s]; } }
      if (ev === 'ask'){ const li = n.parent.li, b = html('<button class="pill sm atr-x-fix" type="button">Fix</button>'); b.dataset.tip = 'Use color.accent.500'; $('.tg', li).after(b); b.onclick = () => { b.remove(); M.fix && M.fix(); }; shown = '<b>Apply library tokens</b> failed: color.accent.600 is not in the library'; tell(null); }
      if (ev === 'state' && n.id === 'des3' && n.s === 'run'){ const b = $('.atr-x-fix', key); if (b) b.remove(); shown = ''; tell(null); }
      if (ev === 'end'){ shown = `Done: ${atrMoney(M.sum(M.T))} across 3 agents, most of it on design`; tell(null); }
      paint(ev !== 'tick');
    });
    top = M.T; blocks(); legend(); M.T.kids.forEach(k => { $('.tg', k.li).innerHTML = TG[k.s]; }); crumbs(); paint(true);
    // the person in the demo: reads the design agent's block, takes the fix, zooms into the design agent and back out
    c.story(async s => {
      await s.beat(4); await s.point(M.by('des').b); tell(M.by('des')); await s.beat(3); s.away(); tell(null);
      await s.until(() => $('.atr-x-fix', key)); await s.beat(3);
      await s.tap($('.atr-x-fix', key)); s.away(); await s.beat(2);
      await s.tap(M.by('des').b); s.away(); await s.beat(4);
      await s.tap($('button', crumb)); s.away();
      await s.until(() => M.ended); await s.beat(4);
    });
  }

  // the switch: the design the card last showed (Classic to begin with) is drawn, and picking another mounts the card again
  // with it, so it plays from the start, entrance and demo; a key that picked it keeps the focus on the switch. Inside another
  // component (as in Agent harness), and in the registry, the code view and the component page (build.js leaves a
  // data-designs="card" switch out of them), it is the classic tree on its own
  // In chat: the same tree, with its box taken off, inside a transcript. The installed component is the tree on its own
  const ATR_CHAT = `<div class="atr-chat panel">
    <div class="atr-chat-h"><b>Welcome email</b><span class="atr-chat-live run"><span class="dot"></span><span class="atr-chat-lt">Working</span></span></div>
    <div class="atr-chat-log">
      <p class="atr-chat-me">Rewrite the welcome email. Keep it under 90 words and match the voice notes.</p>
      <div class="atr-chat-ag">
        <div class="atr bare atr-slim">
          <div class="atr-h"><div class="atr-ht"><b>Welcome email</b><span class="muted atr-st"><span class="m" aria-live="polite">Running</span> · <span class="num ck">0:00</span></span></div><span class="atr-tot num">$0.00</span></div>
          <p class="atr-detail" aria-live="polite"></p>
          <div class="atr-tree" role="tree" aria-label="Agents"></div>
        </div>
      </div>
    </div>
    <div class="atr-chat-box">Ask Brief</div>
  </div>`;
  function atrChat(r, c){
    classic(r, c);
    return () => {
      const chat = $('.atr-chat', r), tree = $('.atr', r);
      if (!chat) return 0;
      const extra = tree && tree._full ? Math.max(0, tree._full - tree.offsetHeight) : 0;
      return chat.offsetHeight + extra;
    };
  }
  const ATR_DS = { chat:[ATR_CHAT, atrChat], cost:[ATR_COST, atrCost], map:[ATR_MAP, atrMap] };
  DM.def('agent-tree', (r, c, card) => {
    let dm = $(':scope>.atr-dm', r);
    if (!dm) return classic(r, c, card);
    if (!c.card || r !== c.st){ dm.replaceWith(...$(':scope>.dm-main', dm).childNodes); return classic(r, c, card); }
    const v = ATR_DS[card._dv] ? card._dv : 'classic';
    if (v === 'classic') classic(r, c, card);
    // (the classic component may have drawn its icons into the stage again, so the switch is found afresh)
    dm = $(':scope>.atr-dm', r);
    const main = $(':scope>.dm-main', dm), sg = $(':scope>.demo .seg2', dm);
    let tall = null, h = 0, wide = -1;
    // the card keeps the room the tallest design needs; this one sits with its own tallest moment in the middle of it, and
    // grows downwards from there. Its height is taken once at each width, so what it does never moves its top
    const fit = () => { const H = parseFloat(getComputedStyle(r).minHeight) || 0, w = r.clientWidth; if (w !== wide){ wide = w; h = tall ? tall() : main.offsetHeight; } dm.style.setProperty('--dmy', Math.max(0, Math.floor((H - h) / 2)) + 'px'); };
    if (v !== 'classic'){ main.innerHTML = ATR_DS[v][0]; const t = ATR_DS[v][1](main, c); tall = typeof t === 'function' ? t : null; }
    // the classic tree is tallest with its summary under it, at the end of the run: a hidden copy of it with the summary in
    // is measured, then taken away
    else tall = () => { const a = $('.atr', main); return (a && a._full) || (a ? a.offsetHeight : main.offsetHeight); };
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    seg(sg, k => {
      if (k === v) return;
      const kb = sg.contains(document.activeElement) && document.activeElement.matches(":focus-visible");
      card._dv = k; DM.mount(card);
      // it comes back once the new design has started, so it isn't taken for the visitor taking over the new demo
      if (kb) setTimeout(() => { const b = $(`.atr-dm>.demo button[data-v="${k}"]`, card); if (b && (!document.activeElement || document.activeElement === document.body)) b.focus({ preventScroll:true }); }, 120);
    });
    const ro = new ResizeObserver(fit); ro.observe(r); c.offs.push(() => ro.disconnect());
  });
}
/* ---------- Agent inbox ---------- */
DM.def('agent-inbox', (r, c) => {
  // the runs, grouped by what they need: one waits for approval, one failed and can be retried, two are running with their
  // clocks, two are done
  const A = { 'Design agent':['D','var(--av-l)'], 'Build agent':['B','var(--av-m)'], 'Research agent':['R','var(--av-t)'], 'Copy agent':['C','var(--av-p)'], 'QA agent':['Q','var(--av-b)'] };
  const R = [
    { id:'pub', t:'Publish the pricing page', a:'Design agent', g:'needs', why:'Waiting for your approval' },
    { id:'tok', t:'Export tokens to CSS', a:'Build agent', g:'needs', fail:true, why:'Failed: rate limited by Figma', tip:'Figma answered 429 at 10:42. Safe to retry' },
    { id:'cards', t:'Rework the plan cards', a:'Design agent', g:'run', sec:102, doing:'Editing frame 3 of 6' },
    { id:'cmp', t:'Compare 3 competitor pages', a:'Research agent', g:'run', sec:38, doing:'Reading page 3 of 3' },
    { id:'copy', t:'Rewrite plan descriptions', a:'Copy agent', g:'done', ago:'12m ago' },
    { id:'aud', t:'Audit pricing contrast', a:'QA agent', g:'done', ago:'25m ago' }
  ];
  const GR = [['needs', 'Needs you'], ['run', 'Running'], ['done', 'Done']];
  const gs = $('.aib-gs', r), st = $('.aib-st', r);
  gs.innerHTML = GR.map(([k, n]) => `<section class="aib-g" data-g="${k}" aria-label="${n}"><div class="aib-gh"><span>${n}</span><span class="n"></span></div><div class="aib-gl" role="list"></div></section>`).join('');
  const clock = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  const meta = x => x.g === 'needs' ? x.why : x.g === 'run' ? x.doing : x.a;
  const right = x => x.g === 'needs' ? (x.fail ? `<button class="pill sm aib-go" aria-label="Retry ${x.t}">${I('refresh','xs')}Retry</button>` : `<button class="pill primary sm aib-go" aria-label="Approve ${x.t}">Approve</button>`)
    : x.g === 'run' ? `<span class="spin"></span><span class="num aib-ck">${clock(x.sec)}</span>` : `<span class="ok">${I('ok','xs')}</span><span>${x.ago}</span>`;
  function row(x){
    const [m, col] = A[x.a];
    x.el = html(`<div class="aib-i" role="listitem"><span class="aib-av" style="background:${col};color:${col.replace(')', '-ink)')}" aria-hidden="true">${m}</span><span class="aib-t"><b>${x.t}</b><span></span></span><span class="aib-r"></span></div>`);
    update(x, true); return x.el;
  }
  function update(x, now){
    const el = x.el, sp = $('.aib-t span', el), rr = $('.aib-r', el);
    el.classList.toggle('fail', !!x.fail && x.g === 'needs');
    if (x.tip && x.g === 'needs') sp.dataset.tip = x.tip; else delete sp.dataset.tip;
    if (now){ sp.textContent = meta(x); rr.innerHTML = right(x); } else { swap(sp, meta(x)); rr.innerHTML = right(x); enter(rr); }
    const b = $('.aib-go', el); if (b) b.onclick = () => act(x);
  }
  const list = g => $(`.aib-g[data-g="${g}"] .aib-gl`, gs);
  R.forEach(x => list(x.g).appendChild(row(x)));
  function counts(){
    // a group with nothing in it goes away, and the line at the top says what is left
    GR.forEach(([k]) => { const n = R.filter(x => x.g === k).length, sec = $(`.aib-g[data-g="${k}"]`, gs); $('.n', sec).textContent = n; sec.hidden = !n; });
    const need = R.filter(x => x.g === 'needs').length, run = R.filter(x => x.g === 'run').length, done = R.filter(x => x.g === 'done').length;
    const t = need ? `${need} need${need > 1 ? '' : 's'} you` : run ? `${run} running` : `All clear · ${done} done today`;
    if (!st.textContent) st.textContent = t; else swap(st, t);
  }
  counts();
  // a run that moves glides to its place in the new group: rows and group titles are measured before and after, and eased
  // from where they were; the moving row rides above the rest, and a group that comes back fades in
  const ease = getComputedStyle(r).getPropertyValue('--ease').trim() || 'ease';
  const shown = () => $$('.aib-g:not([hidden]) .aib-gh,.aib-g:not([hidden]) .aib-i', gs);
  function move(x, g){
    const first = new Map(shown().map(e => [e, e.getBoundingClientRect().top]));
    x.g = g; update(x); list(g).prepend(x.el); counts();
    if (REDUCE) return;
    x.el.classList.add('mv'); c.later(440, () => x.el.classList.remove('mv'));
    shown().forEach(e => { if (!first.has(e)) return enter(e); const d = first.get(e) - e.getBoundingClientRect().top; if (Math.abs(d) > 1) e.animate([{ transform:`translateY(${d}px)` }, { transform:'none' }], { duration:420, easing:ease }); });
  }
  // every running run's clock ticks
  c.every(1000, () => R.forEach(x => { if (x.g === 'run'){ x.sec++; const ck = $('.aib-ck', x.el); if (ck) ck.textContent = clock(x.sec); } }));
  // Approve starts the run and Retry tries a failed one again; either runs, then lands in Done
  function act(x){
    const retry = !!x.fail; x.fail = false; x.sec = 0; x.doing = retry ? 'Retrying the export' : 'Publishing to designme.studio/pricing';
    move(x, 'run');
    c.later(retry ? 5000 : 4000, () => { x.ago = 'Just now'; move(x, 'done'); });
  }
  // the research run finishes on its own while you look
  c.later(6000, () => { const x = R.find(y => y.id === 'cmp'); if (x.g === 'run'){ x.ago = 'Just now'; move(x, 'done'); } });
  // the preview's story: read why the export failed, approve the publish, and retry the export
  c.story(async s => {
    const by = id => R.find(x => x.id === id);
    await s.beat(3);
    await s.point($('.aib-t span', by('tok').el)); await s.beat(3);
    await s.tap($('.aib-go', by('pub').el)); s.away(); await s.beat(5);
    await s.tap($('.aib-go', by('tok').el)); s.away();
    await s.until(() => by('tok').g === 'done' && by('pub').g === 'done'); await s.beat(3);
  });
});
/* ---------- Browser session ---------- */
DM.def('browser-session', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{pause}', I('pause')).replace('{search}', I('search','xs'));
  const root = $('.bws', r), stEl = $('.bws-st', r), vp = $('.bws-vp', r), url = $('.bws-url', r), list = $('.bws-steps', r);
  const pauseB = $('.bws-pause', r), takeB = $('.bws-take', r);
  // the steps the agent planned, and the pages it passes through, drawn small: a search, the site, its pricing page
  const S = [{ t:'Search "northwind pricing"' }, { t:'Open northwind.app' }, { t:'Click "Pricing"' }, { t:'Read the plans table' }, { t:'Extract prices' }];
  const NAV = on => `<div class="bws-nav"><b>Northwind</b><span>Product</span><span data-k="pricing"${on ? ' class="on"' : ''}>Pricing</span><span>Docs</span></div>`;
  const PAGES = {
    search:`<div class="bws-pg"><div class="bws-q">${I('search','xs')}<span>northwind pricing</span></div>
      <div class="bws-res"><b data-k="site">Northwind · Docs your team reads</b><span>northwind.app</span></div>
      <div class="bws-res"><b>Northwind review: is it worth it?</b><span>softwarenotes.io</span></div>
      <div class="bws-res"><b>Northwind alternatives</b><span>stackcompare.com</span></div></div>`,
    home:`<div class="bws-pg">${NAV(false)}<div class="bws-hd">Docs your team actually reads</div><span class="bws-ln" style="width:92%"></span><span class="bws-ln" style="width:68%"></span><span class="bws-cta">Start free</span></div>`,
    pricing:`<div class="bws-pg">${NAV(true)}<div class="bws-hd">Plans and pricing</div><span class="bws-ln" style="width:78%"></span>
      <div class="bws-tb"><div><span>Plan</span><span>Per seat, monthly</span></div><div><span>Starter</span><span class="num">$8</span></div><div><span>Team</span><span class="num">$16</span></div><div><span>Business</span><span class="num">$32</span></div></div><span class="bws-ln" style="width:64%"></span><span class="bws-ln" style="width:40%"></span></div>`
  };
  const G = { queued:'<span class="dot"></span>', run:'<span class="spin"></span>', wait:I('alert','xs'), done:I('ok','xs') };
  S.forEach(x => { x.el = html(`<li class="bws-s queued"><span class="g">${G.queued}</span><span class="bws-t"><span>${x.t}</span><span class="d" hidden></span></span></li>`); list.appendChild(x.el); });
  function step(i, s, d){
    const x = S[i], de = $('.d', x.el); if (x.s === s && de.textContent === (d || '')) return;
    x.s = s; x.el.className = 'bws-s ' + s; const g = $('.g', x.el); g.innerHTML = G[s]; enter(g);
    if (s === 'run' || s === 'wait') x.el.setAttribute('aria-current', 'step'); else x.el.removeAttribute('aria-current');
    if (!d){ de.hidden = true; de.textContent = ''; } else if (de.hidden){ de.textContent = d; de.hidden = false; enter(de); } else swap(de, d);
  }
  // the page's cookie banner waits below the fold of the viewport, and the agent's own pointer above it
  const ck = html('<div class="bws-ck"><span>This site uses cookies</span><button type="button">Reject all</button><button type="button">Accept all</button></div>');
  const cur = html('<span class="bws-cur" aria-hidden="true"><svg viewBox="0 0 14 14"><path d="M2 1.5l9.5 5-4.2 1.2-2 4.3z"/></svg></span>');
  vp.append(ck, cur);
  function page(k, u){
    const old = $('.bws-pg', vp), pg = html(PAGES[k]); vp.insertBefore(pg, ck); if (old) old.remove(); enter(pg);
    $('svg', url).outerHTML = I(k === 'search' ? 'search' : 'lock', 'xs'); swap($('span', url), u);
  }
  // the person can pause the agent or take the page over; either holds it wherever it is, and it waits for them when
  // the page blocks it
  let paused = false, you = false, blocked = false, finished = false, secs = 0, unblock = null;
  const held = () => paused || you;
  async function act(ms){ for (let left = ms; left > 0;){ await c.wait(100); if (!held()) left -= 100; } }
  async function aim(el){
    const v = vp.getBoundingClientRect(), b = el.getBoundingClientRect(), x = b.left - v.left + Math.min(b.width * .5, 36), y = b.top - v.top + b.height * .6;
    if (!cur.classList.contains('on')){ cur.style.transition = 'none'; cur.style.transform = `translate(${x + 30}px,${y + 40}px)`; void cur.offsetWidth; cur.style.transition = ''; cur.classList.add('on'); }
    cur.style.transform = `translate(${x}px,${y}px)`; el.classList.add('aim');
    await act(800); cur.classList.add('down'); await act(200); cur.classList.remove('down'); el.classList.remove('aim');
  }
  const clock = () => Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0');
  stEl.innerHTML = '<span class="m">Browsing</span> · <span class="num ck">0:00</span>';
  c.every(1000, () => { if (!held() && !blocked && !finished){ secs++; $('.ck', stEl).textContent = clock(); } });
  function update(){
    root.classList.toggle('you', you); root.classList.toggle('paused', paused && !you);
    swap($('.m', stEl), finished ? 'Done' : you ? 'You have control' : paused ? 'Paused' : blocked ? 'Needs you' : 'Browsing');
    const pl = paused ? 'Resume' : 'Pause'; pauseB.innerHTML = I(paused ? 'play' : 'pause'); pauseB.setAttribute('aria-label', pl); pauseB.dataset.tip = pl;
    pauseB.disabled = you || finished; takeB.disabled = finished;
    takeB.setAttribute('aria-pressed', you); takeB.textContent = you ? 'Hand back' : 'Take over';
    // while the person has the page, its buttons are theirs and the agent's pointer steps aside
    vp.inert = !you; cur.style.visibility = you ? 'hidden' : '';
    const ask = $('.bws-ask', r);
    if (blocked && !you && !ask) showAsk(); else if ((!blocked || you) && ask) ask.remove();
    if (blocked) step(3, 'wait', you ? 'Close the banner, then hand back' : 'A cookie banner covers the table');
  }
  function showAsk(){
    const ask = html('<div class="bws-ask"><button class="pill primary sm bws-allow">Allow closing it</button><button class="pill soft sm bws-you">Take over</button></div>');
    $('.bws-t', S[3].el).appendChild(ask); enter(ask);
    $('.bws-allow', ask).onclick = () => c.run(async () => {
      // the agent closes it the privacy-friendly way, with Reject all
      blocked = false; update(); step(3, 'run', 'Closing the banner');
      await aim($('button', ck)); ck.classList.remove('on'); unblock();
    });
    $('.bws-you', ask).onclick = () => takeB.click();
  }
  pauseB.onclick = () => { paused = !paused; update(); };
  takeB.onclick = () => { you = !you; if (you) paused = false; update(); };
  // with the page in hand, either banner button closes it
  $$('button', ck).forEach(b => b.onclick = () => { if (!you || !blocked) return; ck.classList.remove('on'); blocked = false; update(); unblock(); });
  // the run: search, open the site, go to pricing and scroll to the table, where a cookie banner covers it and the agent
  // asks before touching it. Once it is gone, it reads the table and takes the three prices
  c.run(async () => {
    page('search', 'northwind pricing'); step(0, 'run');
    await act(1800); step(0, 'done'); step(1, 'run');
    await aim($('[data-k="site"]', vp)); page('home', 'northwind.app');
    await act(1200); step(1, 'done'); step(2, 'run');
    await aim($('[data-k="pricing"]', vp)); page('pricing', 'northwind.app/pricing');
    await act(1000); step(2, 'done'); step(3, 'run');
    await act(600);
    const pg = $('.bws-pg', vp); pg.style.transform = `translateY(${-Math.max(0, Math.min(pg.offsetHeight - vp.clientHeight, $('.bws-tb', pg).offsetTop - 8))}px)`;
    await act(1200); ck.classList.add('on'); await act(500);
    blocked = true; update();
    await new Promise(res => { unblock = res; });
    step(3, 'run');
    await act(1400); step(3, 'done', '3 plans, priced per seat'); step(4, 'run', '0 of 3 prices');
    const cells = $$('.bws-tb .num', vp);
    for (let i = 0; i < cells.length; i++){ await aim(cells[i]); cells[i].classList.add('hit'); step(4, 'run', `${i + 1} of 3 prices`); }
    await act(500); cur.classList.remove('on');
    finished = true; step(4, 'done', '$8, $16 and $32 per seat'); update();
    const sm = html(`<div class="bws-sum">${I('ok','xs')}<span>Done · 3 prices saved to Pricing research</span></div>`); root.appendChild(sm); enter(sm);
  });
  update();
  // the preview's story: the agent stops at the cookie banner, the person allows it to close it, and it finishes
  c.story(async s => {
    await s.until(() => $('.bws-allow', r)); await s.beat(3);
    await s.tap($('.bws-allow', r)); s.away();
    await s.until(() => finished); await s.beat(3);
  });
});
/* ---------- Trace view ---------- */
DM.def('trace-view', (r, c) => {
  // the kinds of span, each with its mark and colour: the identity slots of the chart palette, and grey for the agents
  // that hold the other spans. The name is always on the mark, in a tooltip, and in the span's label
  const K = { agent:['Agent','cpu','var(--muted)'], llm:['LLM call','spark','var(--c2)'], tool:['Tool call','term','var(--c6)'], ret:['Retrieval','search','var(--c3)'] };
  // one run, in seconds from its start. A tool call that takes longer than SLOW seconds is flagged
  const SPAN = 5, SLOW = 2, PACE = 1.5;
  const S = [
    { id:'run', k:'agent', n:'Pricing research', s:0, d:4.82, lv:0, in:"Compare Northwind's plans with ours", out:'3 prices saved to Pricing research' },
    { id:'plan', k:'llm', n:'Plan the steps', s:.04, d:.62, tk:1240, lv:1, in:'The task and 2 earlier messages', out:'Search notes, fetch the page, summarise' },
    { id:'notes', k:'ret', n:'Search saved notes', s:.7, d:.38, tk:910, lv:1, in:'"northwind pricing", top 4', out:'4 notes, best match 0.82' },
    { id:'fetch', k:'tool', n:'fetch_page', s:1.12, d:2.46, tk:3120, lv:1, in:'GET northwind.app/pricing', out:'200 OK, 48 KB, 3 plans' },
    { id:'sum', k:'agent', n:'Summariser', s:3.62, d:1.02, lv:1, in:'The page and 4 notes', out:'A 120-word summary' },
    { id:'write', k:'llm', n:'Write the summary', s:3.66, d:.94, tk:2380, lv:2, in:'Page text and notes, 2,050 tokens', out:'120 words, 3 prices' },
    { id:'ans', k:'llm', n:'Final answer', s:4.66, d:.16, tk:560, lv:1, in:'The summary', out:'3 prices saved to Pricing research' }
  ];
  const END = Math.max(...S.map(x => x.s + x.d));
  // an agent span counts the tokens of every span under it
  S.forEach((x, i) => { x.kids = []; for (let j = i + 1; j < S.length && S[j].lv > x.lv; j++) x.kids.push(S[j]); });
  const root = $('.trv', r), rows = $('.trv-rows', r), stEl = $('.trv-st', r), tot = $('.trv-tot', r), dt = $('.trv-dt', r), dc = $('.trv-dc', r), lg = $('.trv-lg', r);
  // the key: every kind but the agents, with its colour and how many of its spans have started
  const KEYS = ['llm', 'tool', 'ret'];
  lg.innerHTML = KEYS.map(k => `<span role="listitem" class="z" data-k="${k}" style="--k:${K[k][2]}"><i></i>${K[k][0]} <b class="num">0</b></span>`).join('');
  // each span's parent, for the tree's guides
  S.forEach((x, i) => { for (let j = i - 1; j >= 0; j--) if (S[j].lv === x.lv - 1){ x.up = S[j]; break; } });
  $('.trv-sc', r).innerHTML = Array.from({ length:Math.ceil(SPAN / 2) }, (_, i) => `<span style="left:${i * 2 / SPAN * 100}%">${i * 2}s</span>`).join('');
  const sec = v => v.toFixed(2) + 's', tks = v => v >= 1000 ? (v / 1000).toFixed(1) + 'k' : String(Math.round(v));
  let T = 0, sel = null, said = '';
  S.forEach(x => {
    const [kind, icon, col] = K[x.k];
    x.el = html(`<button type="button" class="trv-r${x.lv ? '' : ' root'}" data-k="${x.k}" aria-expanded="false" style="--k:${col};--lv:${x.lv}" hidden><span class="trv-n"><span class="trv-g" aria-hidden="true"></span><span class="trv-k" data-tip="${kind}">${I(icon,'xs')}</span><span class="trv-nm">${x.n}</span></span><span class="trv-b"><i style="left:${x.s / SPAN * 100}%;width:${x.d / SPAN * 100}%"></i></span><span class="trv-tk num"></span><span class="trv-ms num"></span></button>`);
    x.el.onclick = () => open(x === sel ? null : x);
    rows.appendChild(x.el);
  });
  // where the run is: each span shows once it starts, its bar and its numbers grow while it runs
  const took = x => Math.max(0, Math.min(T, x.s + x.d) - x.s);
  const used = x => x.k === 'agent' ? x.kids.reduce((a, k) => a + (k.k === 'agent' ? 0 : used(k)), 0) : x.tk * Math.min(1, took(x) / x.d);
  // the tree's guides for the spans on show: a line on down past a parent's mark, an elbow into each child, and the lines of
  // ancestors whose own siblings are still to come
  const vis = x => !x.el.hidden, later = x => S.some(y => y !== x && y.up === x.up && S.indexOf(y) > S.indexOf(x) && vis(y));
  function tree(){
    S.forEach(x => {
      if (!vis(x)) return;
      let h = '';
      for (let a = x.up; a && a.up; a = a.up) if (later(a)) h += `<i style="--x:${a.lv - 1}"></i>`;
      if (x.up) h += `<i class="el${later(x) ? '' : ' end'}" style="--x:${x.lv - 1}"></i>`;
      if (S.some(y => y.up === x && vis(y))) h += `<i class="dn" style="--x:${x.lv}"></i>`;
      $('.trv-g', x.el).innerHTML = h;
    });
  }
  let had = 0, txtAt = -1e9;
  function paint(){
    let shown = 0;
    // the times and token counts change ten times a second, not every frame: each change of text lays the page out
    const now = performance.now(), txt = T >= END || now - txtAt >= 100; if (txt) txtAt = now;
    S.forEach(x => {
      if (T < x.s) return; shown++;
      if (x.el.hidden){ x.el.hidden = false; enter(x.el); }
      const w = took(x), run = T < x.s + x.d, kind = K[x.k][0];
      x.el.classList.toggle('run', run);
      const f = x.d ? w / x.d : 1; if (f !== x._f){ x._f = f; $('.trv-b i', x.el).style.setProperty('--f', f.toFixed(4)); }
      // (what's on screen is kept under _names, apart from the span's own data)
      const say = txt || (!run && !x._fin); if (!run) x._fin = true;
      if (say){ const ms = sec(w), tk = tks(used(x)); if (x._ms !== ms){ x._ms = ms; $('.trv-ms', x.el).textContent = ms; } if (x._tk !== tk){ x._tk = tk; $('.trv-tk', x.el).textContent = tk; } }
      if (x.k === 'tool' && w > SLOW && !x.slow){
        x.slow = true; x.el.classList.add('slow');
        const why = `Over the ${SLOW}s budget for a tool call`, tg = html(`<span class="tag warn" data-tip="${why}">slow</span>`); $('.trv-n', x.el).appendChild(tg); enter(tg);
        $('.trv-ms', x.el).dataset.tip = why;
      }
      if (say){ const al = `${x.n}, ${kind}, ${run ? 'running, ' : ''}${sec(w)}, ${Math.round(used(x)).toLocaleString('en-US')} tokens${x.slow ? ', slow' : ''}`; if (x._al !== al){ x._al = al; x.el.setAttribute('aria-label', al); } }
    });
    if (shown !== had){ had = shown; tree();
      KEYS.forEach(k => { const n = S.filter(x => x.k === k && vis(x)).length, el = $(`[data-k="${k}"]`, lg), b = $('b', el); el.classList.toggle('z', !n); if (b.textContent !== String(n)){ b.textContent = n; if (n) enter(b); } }); }
    // the playhead runs down every track while the run streams, and fades once it is done
    root.style.setProperty('--now', Math.min(T, END) / SPAN); root.classList.toggle('live', T > 0 && T < END);
    if (txt) tot.textContent = sec(Math.min(T, END));
    const slow = S.filter(x => x.slow).length;
    const line = T >= END ? `Done · ${S.length} spans${slow ? `, ${slow} slow` : ''}` : `Running · ${shown} span${shown > 1 ? 's' : ''}`;
    if (line !== said){ said = line; swap($('.m', stEl), line); }
    if (sel) fill();
  }
  // a span's details: what went in, what came out, how long it took and what it used
  function open(x){
    if (sel) sel.el.setAttribute('aria-expanded', 'false');
    sel = x; dt.classList.toggle('shut', !x); dt.inert = !x; rows.classList.toggle('sel', !!x);
    if (!x) return;
    x.el.setAttribute('aria-expanded', 'true');
    const [kind, icon, col] = K[x.k];
    dc.innerHTML = `<div class="trv-dh"><span class="trv-k" style="--k:${col}">${I(icon,'xs')}</span><b>${x.n}</b>${x.slow ? '<span class="tag warn">slow</span>' : ''}<button class="ib trv-x" aria-label="Close details" data-tip="Close">${I('x')}</button></div>
      <div class="trv-pos" aria-hidden="true" style="--k:${col}"><i style="left:${x.s / SPAN * 100}%"></i></div>
      <div class="trv-kv"><div><span>Kind</span><b>${kind}</b></div><div><span>Starts at</span><b class="num">${sec(x.s)}</b></div><div><span>Latency</span><b class="num lt"></b></div><div><span>Tokens</span><b class="num tk"></b></div></div>
      <div class="trv-io"><span>Input</span><code>${x.in}</code><span>Output</span><code class="out"></code></div>`;
    // closing hands focus back to the span, if it was inside the details
    $('.trv-x', dc).onclick = () => { const el = sel.el, back = dc.contains(document.activeElement); open(null); if (back) el.focus({ preventScroll:true }); };
    fill(); enter(dc);
  }
  function fill(){
    const x = sel, done = T >= x.s + x.d;
    $('.lt', dc).textContent = sec(took(x)); $('.tk', dc).textContent = Math.round(used(x)).toLocaleString('en-US'); $('.trv-pos i', dc).style.width = (took(x) / SPAN * 100) + '%';
    const o = $('.out', dc), t = done ? x.out : 'Running…'; if (o.textContent !== t) o.textContent = t;
  }
  // the arrow keys move between spans, and Escape shuts the details
  c.on(r, 'keydown', e => {
    if (e.key === 'Escape' && sel){ const el = sel.el; open(null); el.focus({ preventScroll:true }); return; }
    const vis = S.filter(x => !x.el.hidden), i = vis.findIndex(x => x.el === document.activeElement); if (i < 0) return;
    const go = e.key === 'ArrowDown' ? vis[i + 1] : e.key === 'ArrowUp' ? vis[i - 1] : e.key === 'Home' ? vis[0] : e.key === 'End' ? vis[vis.length - 1] : undefined;
    if (go === undefined && !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    e.preventDefault(); if (go) go.el.focus({ preventScroll:true });
  });
  stEl.innerHTML = '<span class="m">Running</span>';
  // the run streams in at a pace a person can follow: one second of the run every PACE seconds
  c.later(600, () => { const t0 = performance.now(); c.loop(t => { T = Math.min(END, (t - t0) / 1000 / PACE); paint(); return T < END ? undefined : false; }); });
  // the preview's story: the fetch runs long and turns amber, the person reads why, opens it, then closes it
  c.story(async s => {
    const f = S.find(x => x.id === 'fetch');
    await s.until(() => f.slow); await s.beat(2);
    // on a narrow card the tag is hidden, and the time carries the same tooltip
    const tg = $('.tag', f.el); await s.point(tg.offsetWidth ? tg : $('.trv-ms', f.el)); await s.beat(3); s.away();
    await s.until(() => T >= END); await s.beat(1);
    await s.tap(f.el); s.away(); await s.beat(8);
    await s.tap($('.trv-x', r)); s.away(); await s.beat(2);
  });
});
/* ---------- Run cost ---------- */
DM.def('run-cost', (r, c) => {
  // the label crossfades on its own span, so the button itself never blurs
  const go = $('.rc-go', r); go.innerHTML = '<span class="rc-gl">Start run</span>'; const gl = () => $('.rc-gl', go);
  const tg = $('.toggle', r), cap = $('.rc-cap', r), fill = $('.rc-fill', r), st = $('.rc-st', r), stt = $('.rc-stt', r);
  let used = 0, inT = 0, outT = 0, tools = 0, running = false, limit = 1800, loop = 0;
  const fmt = n => Math.round(n).toLocaleString('en-US');
  const paint = () => { $('.rc-n', r).textContent = fmt(used); fill.style.width = (used / 2000 * 100) + '%'; $('.rc-in', r).textContent = fmt(inT); $('.rc-out', r).textContent = fmt(outT); $('.rc-tools', r).textContent = tools; };
  const status = (t, cls) => { st.className = 'rc-st tag ' + (cls || ''); swap(stt, t); };
  const capOn = () => tg.getAttribute('aria-checked') === 'true';
  $('.rc-cap-t', r).onclick = e => { e.preventDefault(); tg.setAttribute('aria-checked', !capOn()); cap.style.opacity = capOn() ? 1 : .2; limit = capOn() ? 1800 : 2000; if (!running && used < limit && used > 0) go.disabled = false; };
  function stop(t, cls){ running = false; clearInterval(loop); status(t, cls); }
  go.onclick = () => {
    if (running){ stop('Stopped'); swap(gl(), 'Resume'); return; }
    if (used >= 2000){ used = inT = outT = tools = 0; paint(); }
    running = true; status('Running', 'b'); swap(gl(), 'Stop'); go.className = 'pill soft sm rc-go'; fill.style.background = 'var(--accent-mark,var(--accent))';
    loop = c.every(90, () => {
      used = Math.min(2000, used + 8 + Math.random() * 18); inT += 120 + Math.random() * 220; outT += 30 + Math.random() * 70; if (Math.random() < .12) tools++;
      paint();
      if (used >= limit){
        used = limit; paint();
        if (limit < 2000){ stop('Paused at 90%', 'warn'); fill.style.background = 'var(--warn-mark)'; swap(gl(), 'Raise cap'); go.className = 'pill primary sm rc-go'; go.onclick2 = true; }
        else { stop('Budget used', 'bad'); swap(gl(), 'Start over'); go.className = 'pill primary sm rc-go'; }
      }
    });
  };
  const orig = go.onclick;
  go.addEventListener('click', e => { if (go.onclick2 && !running){ go.onclick2 = false; e.stopImmediatePropagation(); tg.setAttribute('aria-checked','false'); cap.style.opacity = .2; limit = 2000; orig(); } }, true);
  paint();
  // the run starts by itself once the card has settled, so the spend can be seen climbing to the cap
  c.auto(1500, () => { if (!running && !used) go.click(); });
});
/* ---------- Toast ---------- */
DM.def('toast', (r, c) => {
  const slot = $('.tst-slot', r);
  const V = {
    ok:{ g:'ok', col:'var(--ok)', bg:'var(--ok-bg)', b:'Changes applied', s:'4 files updated in PricingCard', act:'<button class="pill ghost sm tst-undo">Undo</button>' },
    err:{ g:'alert', col:'var(--bad)', bg:'var(--bad-bg)', b:'Could not push to main', s:'The branch is protected', act:'<button class="pill primary sm tst-retry">Retry</button>' },
    info:{ g:'info', col:'var(--pb)', bg:'var(--pb-bg)', b:'Preview is ready', s:'pricing-spacing.preview.app', act:'<button class="pill ghost sm">Open</button>' },
    load:{ g:'load', col:'var(--fg)', bg:'var(--chip)', b:'Deploying preview', s:'Building 3 pages', act:'' }
  };
  let cur = null;
  let show = function(k){
    const v = V[k];
    const t = html(`<div class="tst-t tst-in" role="status"><span class="g" style="color:${v.col};background:${v.bg}">${k === 'load' ? '<span class="spin"></span>' : I(v.g)}</span><div class="tx"><b>${v.b}</b><span>${v.s}</span></div><div class="acts">${v.act}<button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div><span class="life"></span></div>`);
    if (cur){ const old = cur; old.classList.add('tst-out'); setTimeout(() => old.remove(), 300); }
    slot.appendChild(t); cur = t;
    $('.ib', t).onclick = () => { t.classList.add('tst-out'); setTimeout(() => t.remove(), 300); cur = null; };
    const u = $('.tst-undo', t); if (u) u.onclick = () => { $('.tx b', t).textContent = 'Changes undone'; swap($('.tx span', t), 'PricingCard is back as it was'); u.remove(); };
    const rt = $('.tst-retry', t); if (rt) rt.onclick = () => { rt.innerHTML = '<span class="spin"></span>'; setTimeout(() => { if (t.isConnected) show('ok'); }, 1200); };
    if (k === 'load') c.later(2600, () => { if (cur === t) show('info'); });
    if (k === 'ok' || k === 'info'){
      // it times out like a real toast: hovering holds it, and when it runs out it leaves and the same one comes back (until
      // you take over: then it stays gone until you pick one)
      const life = $('.life', t).animate([{ transform:'scaleX(1)' }, { transform:'scaleX(0)' }], { duration:5200, fill:'forwards' });
      t.addEventListener('pointerenter', () => life.pause()); t.addEventListener('pointerleave', () => life.play());
      life.finished.then(() => { if (cur !== t || c.dead) return; t.classList.add('tst-out'); cur = null; setTimeout(() => t.remove(), 300); c.auto(1100, () => { if (!cur) show(k); }); }).catch(() => {});
    }
  }
  const sg = $('.seg2', r), knob = seg(sg, v => show(v));
  const sync = k => { $$('button', sg).forEach(b => b.setAttribute('aria-pressed', b.dataset.v === k)); knob.place(); };
  const show0 = show; show = k => { sync(k); show0(k); };
  // a state picked before this first one lands stays
  c.later(400, () => { if (!cur) show('ok'); });
});
/* ---------- Toast stack ---------- */
DM.def('toast-stack', (r, c) => {
  const stack = $('.tsk-stack', r);
  const pool = [
    ['ok','var(--ok)','var(--ok-bg)','Tests passed','42 of 42 in 38s'],
    ['pr','var(--merge)','var(--merge-bg)','PR #412 is ready','Use shared spacing tokens'],
    ['figma','var(--pl)','var(--pl-bg)','Frames synced','6 frames from Pricing.fig'],
    ['warn','var(--warn)','var(--warn-bg)','Budget at 80%','1,600 of 2,000 credits'],
    ['spark','var(--pb)','var(--pb-bg)','Draft written','Launch email, 2 subject lines']
  ];
  // the stack fans out under the pointer, or while the focus is in it; a toast that can't be seen can't take the focus
  let items = [], n = 0, hover = false, focused = false;
  function layout(){
    const fan = hover || focused; let y = 0;
    const hs = items.map(it => it.offsetHeight);
    stack.style.setProperty('--fanh', (hs.slice(-4).reduce((a, b) => a + b + 8, 0) - 8 || 96) + 'px');
    stack.classList.toggle('fan', fan);
    items.slice().reverse().forEach((it, i) => {
      if (fan){ it.style.transform = `translateY(${-y}px)`; it.style.opacity = i > 3 ? 0 : 1; it.style.filter = 'none'; if (i < 3) y += hs[items.length - 1 - i] + 8; }
      else { const k = Math.min(i, 3); it.style.transform = `translateY(${-k * 10}px) scale(${1 - k * .05})`; it.style.opacity = i > 2 ? 0 : 1 - k * .15; it.style.filter = i ? 'blur(.3px)' : 'none'; }
      it.style.zIndex = 100 - i; it.inert = fan ? i > 3 : i > 0;
    });
  }
  function add(){
    const p = pool[n++ % pool.length];
    const el = html(`<div class="tsk-c"><span class="g" style="color:${p[1]};background:${p[2]}">${I(p[0])}</span><div class="tx"><b>${p[3]}</b><span>${p[4]}</span></div><span class="t">now</span><button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div>`);
    el.style.transform = 'translateY(24px) scale(.96)'; el.style.opacity = 0; el.style.filter = 'blur(6px)';
    stack.appendChild(el); items.push(el);
    $('.ib', el).onclick = () => { items = items.filter(x => x !== el); el.style.opacity = 0; el.style.transform += ' translateX(30px)'; setTimeout(() => el.remove(), 400); layout(); };
    if (items.length > 6){ const old = items.shift(); old.remove(); }
    requestAnimationFrame(() => requestAnimationFrame(layout));
    items.forEach((it, i) => { if (i < items.length - 1){ const t = $('.t', it); t.textContent = (items.length - 1 - i) * 2 + 'm'; } });
  }
  c.on(stack, 'pointerenter', () => { hover = true; layout(); });
  c.on(stack, 'pointerleave', () => { hover = false; layout(); });
  c.on(stack, 'focusin', () => { if (!focused){ focused = true; layout(); } });
  c.on(stack, 'focusout', e => { if (!stack.contains(e.relatedTarget)){ focused = false; layout(); } });
  $('.tsk-add', r).onclick = add;
  c.run(async () => {
    for (let i = 0; i < 3; i++){ await c.wait(i ? 700 : 400); add(); }
    // then a new one now and then, held back while the stack is fanned out under the pointer, until you take over
    for (;;){ await c.step(3800); if (!hover && !focused) add(); }
  });
});
/* ---------- Run summary ---------- */
DM.def('run-summary', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{ok}', I('check')).replace('{more}', I('more'));
  const root = $('.rsu', r), undo = $('.rsu-undo', r), fix = $('.rsu-fix', r), g = $('.rsu-g', r);
  $$('.rsu-stats b', r).forEach((b, i) => c.later(200 + i * 90, () => tween(0, parseFloat(b.dataset.n), 1100, v => { b.textContent = (b.dataset.p || '') + (b.dataset.n.includes('.') ? v.toFixed(2) : Math.round(v)) + (b.dataset.u || ''); })));
  stagger($$('.rsu-it,.rsu-acts', r), 70, 300);
  undo.onclick = () => {
    const on = root.classList.toggle('undone');
    swap(undo, on ? 'Redo' : 'Undo all'); swap($('.rsu-t', r), on ? 'Changes undone' : 'Run complete');
    g.style.background = on ? 'var(--chip)' : ''; g.style.color = on ? 'var(--fg2)' : ''; g.innerHTML = I(on ? 'undo' : 'check'); enter(g.firstElementChild);
  };
  fix.onclick = () => { fix.innerHTML = '<span class="spin"></span>'; c.later(1000, () => { fix.remove(); swap($('.rsu-nt', r), 'Badge moved above the price, nothing left to review'); }); };
});
/* ---------- Run summary designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and the others are the
   directions the owner chose. The switch is the card's alone: the registry, the code view and the component page install
   Classic, as it was (build.js leaves a data-designs="card" switch out of them) */
{
  const classic = DM.defs['run-summary'];
  // the card has three designs, picked with the switch under the summary (on designme.dev, the card's footer tabs): Classic,
  // the summary as it has always been; Receipt, a receipt of the run with time by phase and a hold to undo; Recap, the run
  // told back as a timeline. The two new ones sum up the same run
  const RSU_FILES = [['PricingCard.tsx', 24, 18], ['tokens.css', 9, 2], ['Pricing.test.tsx', 31, 0]];
  const RSU_PH = [['Explore', 2.3, 'e'], ['Change', 5.6, 'c'], ['Verify', 3.4, 'v'], ['Ship', 1.4, 's']];
  const RSU_TEXT = 'Pricing cards now use spacing tokens\nDone in 12m 40s: 6 files, 14 steps, 182k tokens, $0.84\nPricingCard.tsx +24 −18, tokens.css +9 −2, Pricing.test.tsx +31\nPR #412 is open. Needs you: the yearly badge overlaps the price on a phone';
  // a file's change as five blocks, in proportion to lines in and out
  const rsuBlocks = (a, x) => { const t = a + x, n = Math.min(5, Math.max(1, Math.round(t / 8))), ga = t ? Math.round(a / t * n) : 0; return Array.from({ length:5 }, (_, i) => i < ga ? 'a' : i < n ? 'x' : ''); };
  // a number counting up to its value, a little after it appears: its text changes ten times a second, and lands on the value
  const rsuCount = (c, el, to, fmt, delay) => c.later(delay, () => { let at = -1e9; tween(0, to, REDUCE ? 1 : 1100, (v, p) => { const now = performance.now(); if (p < 1 && now - at < 100) return; at = now; el.textContent = fmt(v); }); });

  // Receipt: a check that draws itself, time by phase, a row of blocks for each changed file, and Undo all, pressed and held
  const RSU_RECEIPT = `<div class="rsu-rc panel keep">
    <div class="rsu-rc-h">
      <span class="rsu-rc-ok" aria-hidden="true"><svg viewBox="0 0 40 40"><circle class="rg" cx="20" cy="20" r="17"/><path class="ck" d="m13 20.5 4.6 4.6L27.5 15"/></svg><i></i><i></i><i></i><i></i><i></i><i></i></span>
      <div class="rsu-rc-ht"><b class="rsu-rc-t">Run complete</b><span class="rsu-rc-s">Finished in 12m 40s</span></div>
      <button class="ib rsu-rc-cp" type="button" aria-label="Copy the summary" data-tip="Copy summary">${I('copy')}</button>
    </div>
    <p class="rsu-rc-title">Pricing cards now use spacing tokens</p>
    <div class="rsu-rc-stats"></div>
    <div class="rsu-rc-phase"><div class="rsu-rc-pb" role="img" aria-label="Time by phase"></div><div class="rsu-rc-pk"></div></div>
    <div class="rsu-rc-cut" aria-hidden="true"></div>
    <div class="rsu-rc-sec"><span class="rsu-rc-l">What changed</span><div class="rsu-rc-files"></div></div>
    <div class="rsu-rc-sec"><span class="rsu-rc-l">Needs you</span><div class="rsu-rc-nr"><span class="rsu-rc-nd"></span><span class="rsu-rc-nt">The yearly badge overlaps the price on a phone</span><button class="pill line sm rsu-rc-fix" type="button">Fix it</button></div></div>
    <div class="rsu-rc-acts"><button class="pill primary sm" type="button">${I('ext','xs')}Open changes</button><button class="pill ghost sm rsu-rc-undo" type="button"><span class="rsu-rc-hf" aria-hidden="true"></span><span class="lb">Hold to undo all</span></button></div>
  </div>`;
  function rsuReceipt(r, c){
    const root = $('.rsu-rc', r), stats = $('.rsu-rc-stats', r), pb = $('.rsu-rc-pb', r), pk = $('.rsu-rc-pk', r), files = $('.rsu-rc-files', r), undo = $('.rsu-rc-undo', r), lb = $('.lb', undo), fix = $('.rsu-rc-fix', r);
    const S = [['files', 6, v => Math.round(v)], ['steps', 14, v => Math.round(v)], ['tokens', 182, v => Math.round(v) + 'k'], ['cost', .84, v => '$' + v.toFixed(2)]];
    stats.innerHTML = S.map(s => `<span class="rsu-rc-st"><b class="num">0</b><span>${s[0]}</span></span>`).join('');
    $$('.rsu-rc-st b', r).forEach((b, i) => rsuCount(c, b, S[i][1], S[i][2], 300 + i * 90));
    const sum = RSU_PH.reduce((a, p) => a + p[1], 0);
    pb.innerHTML = RSU_PH.map(([n, m, k], i) => `<i style="--w:${(m / sum * 100).toFixed(2)};--k:var(--ph-${k});animation-delay:${400 + i * 120}ms" data-tip="${n}, ${m.toFixed(1)} minutes"></i>`).join('');
    pk.innerHTML = RSU_PH.map(([n, m, k]) => `<span style="--k:var(--ph-${k})"><i></i>${n} <b>${m.toFixed(1)}m</b></span>`).join('');
    files.innerHTML = RSU_FILES.map(([f, a, x], i) => `<div class="rsu-rc-f"><code>${f}</code><span class="rsu-rc-ds" aria-hidden="true">${rsuBlocks(a, x).map((k, j) => `<i class="${k}" style="animation-delay:${600 + i * 120 + j * 40}ms"></i>`).join('')}</span><span class="n"><span class="a">+${a}</span> <span class="${x ? 'x' : ''}">−${x}</span></span></div>`).join('');
    stagger($$('.rsu-rc-f,.rsu-rc-nr,.rsu-rc-acts', r), 70, 500);
    $('.rsu-rc-cp', r).onclick = e => copied(e.currentTarget, RSU_TEXT, 'Summary copied');
    // the row keeps its height when its button goes, so the receipt never shrinks under the pointer
    fix.onclick = () => { const nr = $('.rsu-rc-nr', r); nr.style.minHeight = nr.offsetHeight + 'px'; fix.disabled = true; fix.innerHTML = '<span class="spin"></span>Fixing'; c.later(1300, () => { fix.remove(); nr.classList.add('ok'); swap($('.rsu-rc-nt', r), 'Badge moved above the price'); }); };
    // Undo all is pressed and held for a second; let go early and nothing happens. Once undone, a press redoes
    let t = 0, undone = false;
    const done = () => { undo.classList.remove('hold'); undone = !undone; root.classList.toggle('undone', undone); swap(lb, undone ? 'Redo' : 'Hold to undo all'); swap($('.rsu-rc-t', r), undone ? 'Changes undone' : 'Run complete'); swap($('.rsu-rc-s', r), undone ? '3 files restored' : 'Finished in 12m 40s'); };
    const start = () => { if (undone){ done(); return; } clearTimeout(t); undo.classList.add('hold'); swap(lb, 'Keep holding'); t = setTimeout(done, REDUCE ? 400 : 1000); };
    const stop = () => { if (!undo.classList.contains('hold')) return; clearTimeout(t); undo.classList.remove('hold'); swap(lb, 'Hold to undo all'); };
    c.on(undo, 'pointerdown', e => { if (e.button === 0) start(); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => c.on(undo, ev, stop));
    c.on(undo, 'keydown', e => { if ((e.key === ' ' || e.key === 'Enter') && !e.repeat){ e.preventDefault(); start(); } });
    c.on(undo, 'keyup', e => { if (e.key === ' ' || e.key === 'Enter') stop(); });
    c.offs.push(() => clearTimeout(t));
    undo.setAttribute('aria-label', 'Undo all, press and hold');
    // the person in the demo: reads the change phase, takes the fix, holds Undo all, then redoes
    c.story(async s => {
      await s.beat(5);
      await s.point($('.rsu-rc-pb i:nth-child(2)', r)); await s.beat(3); s.away();
      await s.tap(fix); s.away(); await s.beat(4);
      await s.point(undo, false); start(); await s.beat(3); s.away(); await s.beat(4);
      await s.tap(undo); s.away(); await s.beat(3);
    });
  }

  // Recap: the run told back as a timeline of the moments that mattered; hover one and the files it touched light up
  const RSU_RECAP = `<div class="rsu-rp">
    <div class="rsu-rp-h"><span class="rsu-rp-ok">${I('check')}</span><div class="rsu-rp-ht"><b>Pricing cards now use spacing tokens</b><span>Done in 12m 40s · $0.84</span></div></div>
    <div class="rsu-rp-files" aria-label="Files changed"></div>
    <div class="rsu-rp-tw"><i class="rsu-rp-rail" aria-hidden="true"></i><ol class="rsu-rp-tl" aria-label="What happened"></ol></div>
    <div class="rsu-rp-end">
      <div class="rsu-rp-pr">${BRAND.github}<div class="rsu-rp-prt"><b>#412 Use shared spacing tokens</b><span>feat/pricing-spacing into main</span></div><span class="tag ok">${I('check','xs')}Checks passed</span></div>
      <div class="rsu-rp-need"><span class="rsu-rp-ni">${I('warn','xs')}</span><span class="rsu-rp-nt">The yearly badge overlaps the price on a phone</span><button class="pill sm rsu-rp-fix" type="button">Review</button></div>
    </div>
  </div>`;
  function rsuRecap(r, c){
    const files = $('.rsu-rp-files', r), tl = $('.rsu-rp-tl', r), rail = $('.rsu-rp-rail', r), end = $('.rsu-rp-end', r), fix = $('.rsu-rp-fix', r);
    files.innerHTML = RSU_FILES.map(([f, a, x]) => `<span class="fchip rsu-rp-fc" data-f="${f}"><code>${f}</code><span class="n">+${a} −${x}</span></span>`).join('');
    // the moments that mattered, each with what it touched
    const M = [
      { app:'figma', t:'Read the plan cards in Figma', d:'Pricing v4, 3 frames', w:'0:40', f:[] },
      { ic:'file-text', t:'Found 9 spacing tokens', d:'tokens.css', w:'1:55', f:['tokens.css'] },
      { ic:'edit', t:'Swapped 14 values for tokens', d:'2 files, +33 −20', w:'5:10', f:['PricingCard.tsx', 'tokens.css'] },
      { ic:'term', t:'Tests failed, then passed', d:'2 failures fixed, 24 of 24', w:'9:30', f:['Pricing.test.tsx', 'PricingCard.tsx'], bad:true },
      { app:'github', t:'Opened pull request #412', d:'3 commits into main', w:'11:50', f:['PricingCard.tsx', 'tokens.css', 'Pricing.test.tsx'] },
      { app:'slack', t:'Posted in #design', d:'With before and after shots', w:'12:40', f:[] }
    ];
    tl.innerHTML = M.map(m => `<li class="rsu-rp-m${m.bad ? ' bad' : ''}" tabindex="0"><span class="rsu-rp-mi${m.app ? ' app' : ''}">${m.app ? BRAND[m.app] : I(m.bad ? 'refresh' : m.ic, 'xs')}</span><span class="rsu-rp-mt"><b>${m.t}</b><span>${m.d}</span></span><span class="rsu-rp-mw">${m.w}</span></li>`).join('');
    const rows = $$('.rsu-rp-m', tl);
    // a moment lights the files it touched
    const light = i => { $$('.rsu-rp-fc', files).forEach(fc => fc.classList.toggle('lit', i >= 0 && M[i].f.includes(fc.dataset.f))); rows.forEach((x, j) => x.classList.toggle('on', j === i)); };
    rows.forEach((x, i) => { ['pointerenter', 'focus'].forEach(ev => c.on(x, ev, () => light(i))); ['pointerleave', 'blur'].forEach(ev => c.on(x, ev, () => light(-1))); });
    c.on(tl, 'keydown', e => { const i = rows.indexOf(document.activeElement); if (i < 0) return; const j = e.key === 'ArrowDown' ? i + 1 : e.key === 'ArrowUp' ? i - 1 : null; if (j === null || !rows[j]) return; e.preventDefault(); rows[j].focus(); });
    // the note keeps its height when its button goes and its words get shorter, so the recap never shrinks under the pointer
    fix.onclick = () => { const nd = $('.rsu-rp-need', r); nd.style.minHeight = nd.offsetHeight + 'px'; fix.disabled = true; fix.innerHTML = '<span class="spin"></span>'; c.later(1200, () => { fix.remove(); nd.classList.add('ok'); $('.rsu-rp-ni', r).innerHTML = I('check','xs'); swap($('.rsu-rp-nt', r), 'Badge moved above the price'); }); };
    // the recap plays back once, a moment at a time, then the outcome
    c.run(async () => {
      await c.wait(400);
      for (let i = 0; i < rows.length; i++){ rows[i].classList.add('in'); rail.style.setProperty('--p', ((i + .5) / rows.length).toFixed(3)); light(i); await c.wait(420); }
      light(-1); rail.style.setProperty('--p', 1); end.classList.add('in');
    });
    // the person in the demo: hovers two moments to see what they touched, then reviews what needs them
    c.story(async s => {
      await s.until(() => end.classList.contains('in')); await s.beat(2);
      await s.point(rows[2], false); light(2); await s.beat(3);
      await s.point(rows[3], false); light(3); await s.beat(3); light(-1);
      await s.tap(fix); s.away(); await s.beat(5);
    });
  }

  // the switch: the design the card last showed (Classic to begin with) is drawn, and picking another mounts the card again
  // with it, so it plays from the start, entrance and demo; a key that picked it keeps the focus on the switch. Inside another
  // component (as in Agent harness), and in the registry, the code view and the component page (build.js leaves a
  // data-designs="card" switch out of them), it is the classic summary on its own
  const RSU_DS = { receipt:[RSU_RECEIPT, rsuReceipt], recap:[RSU_RECAP, rsuRecap] };
  DM.def('run-summary', (r, c, card) => {
    let dm = $(':scope>.rsu-dm', r);
    if (!dm) return classic(r, c, card);
    if (!c.card || r !== c.st){ dm.replaceWith(...$(':scope>.dm-main', dm).childNodes); return classic(r, c, card); }
    const v = RSU_DS[card._dv] ? card._dv : 'classic';
    if (v === 'classic') classic(r, c, card);
    // (the classic component may have drawn its icons into the stage again, so the switch is found afresh)
    dm = $(':scope>.rsu-dm', r);
    const main = $(':scope>.dm-main', dm), sg = $(':scope>.demo .seg2', dm);
    let tall = null, h = 0, wide = -1;
    // the card keeps the room the tallest design needs; this one sits with its own tallest moment in the middle of it, and
    // grows downwards from there. Its height is taken once at each width, so what it does never moves its top
    const fit = () => { const H = parseFloat(getComputedStyle(r).minHeight) || 0, w = r.clientWidth; if (w !== wide){ wide = w; h = tall ? tall() : main.offsetHeight; } dm.style.setProperty('--dmy', Math.max(0, Math.floor((H - h) / 2)) + 'px'); };
    if (v !== 'classic'){ main.innerHTML = RSU_DS[v][0]; const t = RSU_DS[v][1](main, c); tall = typeof t === 'function' ? t : null; }
    // the classic summary is tallest once its numbers have counted up (on a phone they wrap onto a second line): a hidden
    // copy of it with them in is measured, then taken away
    else tall = () => { const a = $('.rsu', main); if (!a) return main.offsetHeight;
      const p = a.cloneNode(true); $$('.rsu-stats b[data-n]', p).forEach(b => { const n = b.dataset.n; b.textContent = (b.dataset.p || '') + (n.includes('.') ? (+n).toFixed(2) : n) + (b.dataset.u || ''); });
      p.style.cssText = 'position:absolute;left:0;right:0;top:0;visibility:hidden'; p.setAttribute('aria-hidden', 'true'); main.appendChild(p); const x = p.offsetHeight; p.remove(); return x; };
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v)));
    seg(sg, k => {
      if (k === v) return;
      const kb = sg.contains(document.activeElement) && document.activeElement.matches(":focus-visible");
      card._dv = k; DM.mount(card);
      // it comes back once the new design has started, so it isn't taken for the visitor taking over the new demo
      if (kb) setTimeout(() => { const b = $(`.rsu-dm>.demo button[data-v="${k}"]`, card); if (b && (!document.activeElement || document.activeElement === document.body)) b.focus({ preventScroll:true }); }, 120);
    });
    const ro = new ResizeObserver(fit); ro.observe(r); c.offs.push(() => ro.disconnect());
  });
}
/* ---------- Error and recovery ---------- */
DM.def('error-recovery', (r, c) => {
  const list = $('.erx-list', r), box = $('.erx-box', r), go = $('.erx-go', r), sum = $('.erx-s', r), opts = $$('.erx-o', r);
  const steps = [['Pull 1,240 deals from the CRM'],['Write to the Pipeline 2026 sheet'],['Post the summary in #sales']];
  list.innerHTML = steps.map(s => `<div class="erx-row"><span class="g"></span><span class="tx">${s[0]}<span class="d"></span></span></div>`).join('');
  const rows = $$('.erx-row', r);
  const G = { done:`<span style="color:var(--ok)">${I('check','xs')}</span>`, fail:`<span style="color:var(--bad)">${I('alert','xs')}</span>`, run:'<span class="spin"></span>', wait:'<span class="dot" style="color:var(--faint)"></span>', skip:`<span class="muted">${I('chev-r','xs')}</span>`, hand:`<span style="color:var(--pl)">${I('user','xs')}</span>` };
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
/* ---------- Agent lanes ---------- */
DM.def('agent-lanes', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{users}', I('users')).replace('{pause}', I('pause','xs'));
  // each agent has a hue of its own (t names the palette slot): its badge, its track, its tag and its stretch of the relay line
  const L = [
    { n:'Researcher', ic:'search', t:'pb', acts:['Reading competitor sites','Comparing 5 pricing pages','Writing the brief'], log:['Read stripe.com/pricing','Read linear.app/pricing','Noted 3 patterns'] },
    { n:'Designer', ic:'palette', t:'pl', wait:'Waiting for the brief', acts:['Laying out pricing cards','Setting type and spacing','Exporting frames'], log:['Made 3 card variants','Applied spacing tokens','Exported 4 frames'] },
    { n:'Reviewer', ic:'eye', t:'pm', wait:'Waiting for the designer', acts:['Checking contrast','Checking copy','Signing off'], log:['Contrast passes AA','Fixed 2 lines of copy','Approved'] }
  ];
  const root = $('.aln', r), rows = $('.aln-rows', r), ct = $('.aln-ct', r), STEPS = L.length * 3;
  L.forEach(l => {
    l.el = html(`<div class="aln-lane" data-s="queued" style="--c:var(--${l.t});--cb:var(--${l.t}-bg);--cm:var(--aln-${l.t},var(--${l.t}))"><button class="aln-row" aria-expanded="false"><span class="aln-av">${I(l.ic)}</span><span class="aln-who"><span class="aln-n">${l.n}</span><span class="aln-a">${l.wait || 'Queued'}</span></span><span class="aln-tr" aria-hidden="true"><i></i><i></i><i></i></span><span class="aln-st"><span class="tag">Queued</span></span></button><div class="fold shut"><div><div class="aln-det"></div></div></div></div>`);
    rows.appendChild(l.el); const b = $('.aln-row', l.el), f = $('.fold', l.el);
    b.onclick = () => { const s = f.classList.toggle('shut'); b.setAttribute('aria-expanded', !s); };
  });
  const TAG = { queued:'<span class="tag">Queued</span>', waiting:`<span class="tag">${I('clock','xs')}Waiting</span>`, working:'<span class="tag aln-tg"><span class="spin"></span>Working</span>', paused:'<span class="tag warn">Paused</span>', done:`<span class="tag ok">${I('check','xs')}Done</span>` };
  const state = (l, s) => { l.el.dataset.s = s; const t = $('.aln-st', l.el); t.innerHTML = TAG[s]; enter(t.firstElementChild); };
  const act = (l, t, live) => { const a = $('.aln-a', l.el); a.classList.toggle('live', !!live); a.classList.toggle('shim', !!live); swap(a, t); };
  let paused = false, secs = 0, finished = false, steps = 0;
  const count = () => swap(ct, `${steps} of ${STEPS} steps`);
  const pb = $('.aln-pause', r);
  pb.onclick = () => { paused = !paused; pb.innerHTML = I(paused ? 'play' : 'pause','xs') + (paused ? 'Resume' : 'Pause all'); swap($('.aln-t', r), paused ? 'All agents paused' : '3 agents working');
    L.forEach(l => { if (l.running){ state(l, paused ? 'paused' : 'working'); $('.aln-a', l.el).classList.toggle('shim', !paused); } }); };
  c.every(1000, () => { if (!paused && !finished){ secs++; $('.aln-m', r).textContent = Math.floor(secs / 60) + ':' + String(secs % 60).padStart(2, '0'); } });
  // time only passes for the agents while they aren't paused; each() hears how far through the wait they are
  const hold = async (ms, each) => { let t = 0; while (t < ms){ await c.wait(100); if (!paused){ t += 100; each && each(t / ms); } } };
  async function work(l){
    l.running = true; state(l, 'working');
    const bars = $$('.aln-tr i', l.el), det = $('.aln-det', l.el);
    for (let i = 0; i < 3; i++){
      bars[i].classList.add('run'); act(l, l.acts[i], true);
      await hold(1500, p => bars[i].style.setProperty('--p', p.toFixed(3)));
      bars[i].classList.replace('run', 'on'); steps++; count();
      const d = html(`<div><span>${l.log[i]}</span><span class="muted">${secs}s</span></div>`); det.appendChild(d); enter(d);
    }
    l.running = false; act(l, l.log[2]); state(l, 'done');
  }
  // the relay line draws itself from one badge down to the next, the badge it reaches rings, and the stroke stays as the lit
  // stretch: one line from badge to badge that follows them as the hand-off line opens and shuts (the grey under it steps aside)
  const links = [];
  const place = k => { const rr = rows.getBoundingClientRect(), a = $('.aln-av', k.from.el).getBoundingClientRect(), b = $('.aln-av', k.to.el).getBoundingClientRect();
    const y0 = a.bottom - rr.top + 4, y1 = b.top - rr.top - 4; k.pk.style.top = y0 + 'px'; k.pk.style.height = Math.max(0, y1 - y0) + 'px'; };
  const ro = new ResizeObserver(() => links.forEach(place)); ro.observe(rows); c.offs.push(() => ro.disconnect());
  function carry(from, to){
    const k = { from, to, pk:html(`<span class="aln-pk" aria-hidden="true" style="--from:var(--aln-${from.t},var(--${from.t}));--to:var(--aln-${to.t},var(--${to.t}))"></span>`) };
    rows.appendChild(k.pk); links.push(k); place(k);
    const an = REDUCE ? null : k.pk.animate([{ transform:'scaleY(0)' }, { transform:'scaleY(1)' }], { duration:800, easing:'cubic-bezier(.65,0,.35,1)' });
    return an ? an.finished.catch(() => {}) : Promise.resolve();
  }
  async function handoff(from, to, txt){
    const h = html(`<div class="fold shut aln-hf" style="--from:var(--${from.t});--to:var(--${to.t})"><div><div class="aln-hand"><b class="f">${from.n}</b> handed ${txt} to <b class="t">${to.n}</b></div></div></div>`);
    to.el.before(h); void h.offsetWidth; h.classList.remove('shut'); enter($('.aln-hand', h), 80);
    await c.wait(REDUCE ? 0 : 500); await carry(from, to);
    from.el.classList.add('sent'); h.classList.add('lit'); to.el.classList.add('got');
    const av = $('.aln-av', to.el); av.classList.add('ping'); c.later(950, () => av.classList.remove('ping'));
    await c.wait(1300); h.classList.add('shut'); await c.wait(REDUCE ? 0 : 700); h.remove();
  }
  c.run(async () => {
    await c.wait(600);
    const r1 = work(L[0]); act(L[1], L[1].wait); state(L[1], 'waiting');
    await r1; await handoff(L[0], L[1], 'the brief');
    act(L[2], L[2].wait); state(L[2], 'waiting');
    await work(L[1]); await handoff(L[1], L[2], '4 frames');
    await work(L[2]);
    finished = true; root.classList.add('fin'); $('.aln-ic', r).innerHTML = I('ok'); enter($('.aln-ic', r).firstElementChild);
    swap($('.aln-t', r), 'All 3 agents finished'); pb.remove();
  });
});
/* ---------- Agent lanes designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and Swimlanes (every
   agent's work on one clock, each lane in its agent's hue) and Crew (a card per agent with its own pause and steer) are
   the directions under review. The card keeps the pick (card._dv), so Replay and the story's next round play the same
   design, and a new pick plays it from the start. The switch is the card's alone: inside another component, as in Agent
   harness, the lanes are Classic, and the registry, the code view and the component page install Classic (build.js
   leaves the switch out of them) */
{
  const classic = DM.defs['agent-lanes'];
  // the run Swimlanes and Crew play: three agents on one clock, in seconds. Each does its steps; the designer and the
  // reviewer start on their own work, then wait for the hand-off from the one before them. t is the agent's palette slot (its
  // lane's hue), av its avatar colour, and each step's ic the icon on its bar
  const ALN_RUN = () => [
    { n:'Researcher', ic:'search', t:'pb', av:'b', cost:.08, steps:[{ t:'Read 5 pricing pages', s:0, d:1.6, ic:'globe' }, { t:'Compared plans and limits', s:1.6, d:1.4, ic:'layers' }, { t:'Wrote the brief', s:3, d:1.2, ic:'file-text' }] },
    { n:'Designer', ic:'palette', t:'pl', av:'l', cost:.21, waitFrom:2.3, waitTo:4.4, waitFor:'the brief', steps:[{ t:'Set up Pricing v5', s:.8, d:1.5, ic:'figma' }, { t:'Laid out the plan cards', s:4.4, d:2.2, ic:'grid' }, { t:'Set type and spacing', s:6.6, d:1.4, ic:'sliders' }, { t:'Exported 4 frames', s:8, d:.8, ic:'upload' }] },
    { n:'Reviewer', ic:'eye', t:'pm', av:'m', cost:.06, waitFrom:3.2, waitTo:9, waitFor:'the frames', steps:[{ t:'Read last month’s copy', s:1.6, d:1.6, ic:'book' }, { t:'Checked contrast', s:9, d:1.4, ic:'eye' }, { t:'Fixed 2 lines of copy', s:10.4, d:1, ic:'edit' }, { t:'Approved the page', s:11.4, d:.6, ic:'check' }] }
  ];
  // the hand-offs: at its time the sender passes its work, which the receiver picks up at got
  const ALN_HAND = [{ from:0, to:1, at:4.2, got:4.4, what:'brief' }, { from:1, to:2, at:8.8, got:9, what:'4 frames' }];
  const ALN_END = 12;
  const alnClock = t => '0:' + String(Math.floor(t)).padStart(2, '0');
  const alnLc = s => s.charAt(0).toLowerCase() + s.slice(1);
  // what an agent is doing at a moment: a step, waiting, idle or done
  // (times are compared a hair early, so a clock of tenths lands on a step's end exactly)
  function alnAt(a, t){
    t += 1e-6;
    const st = a.steps.find(x => t >= x.s && t < x.s + x.d); if (st) return { s:'work', t:st.t, step:st };
    if (a.waitFrom !== undefined && t >= a.waitFrom && t < a.waitTo) return { s:'wait', t:'Waiting for ' + a.waitFor };
    const last = a.steps[a.steps.length - 1]; if (t >= last.s + last.d) return { s:'done', t:'Done, ' + alnLc(last.t) };
    if (t < a.steps[0].s) return { s:'idle', t:'Starts soon' };
    return { s:'idle', t:'Between steps' };
  }

  const alnSwTpl = () => `<div class="aln-sw panel keep">
    <div class="aln-sw-h"><div class="aln-sw-ht"><b class="aln-sw-tt">3 agents working</b><span class="aln-sw-st num">0:00 of 0:12</span></div><span class="aln-sw-key" aria-hidden="true"><span><i class="next"></i>Next</span><span><i class="run"></i>Working</span><span><i class="done"></i>Done</span><span><i class="wait"></i>Waiting</span></span><button class="pill soft sm aln-sw-pause" type="button">${I('pause','xs')}Pause</button></div>
    <div class="aln-sw-grid">
      <div class="aln-sw-ax num" aria-hidden="true"><span class="aln-sw-ticks"></span></div>
      <div class="aln-sw-rows"></div>
      <div class="aln-sw-ph" role="slider" tabindex="0" aria-label="Time in the run" aria-valuemin="0" aria-valuemax="12" aria-valuenow="0" aria-valuetext="0 seconds"><i></i><span class="aln-sw-now num">0:00</span></div>
    </div>
    <div class="aln-sw-f"><span class="aln-sw-say" aria-live="polite">Researcher starts on the pricing pages</span><button class="pill soft sm aln-sw-live" type="button" hidden>Back to now</button></div>
  </div>`;
  // Swimlanes: the clock ticks ten times a second while the demo plays and nobody has paused it. Bars reveal with a clip and
  // the playhead moves with a transform; text changes only when it says something new
  function alnSwim(r, c){
    const A = ALN_RUN(), root = $('.aln-sw', r), rows = $('.aln-sw-rows', r), ph = $('.aln-sw-ph', r), line = $('i', ph), now = $('.aln-sw-now', r), st = $('.aln-sw-st', r), say = $('.aln-sw-say', r), live = $('.aln-sw-live', r), pb = $('.aln-sw-pause', r), tt = $('.aln-sw-tt', r);
    $('.aln-sw-ticks', r).innerHTML = [0, 3, 6, 9, 12].map(t => `<span style="left:${t / ALN_END * 100}%">${t}s</span>`).join('');
    const pct = v => (v / ALN_END * 100).toFixed(3) + '%', clamp = v => Math.max(0, Math.min(1, Math.round(v * 1e4) / 1e4));
    A.forEach(a => {
      a.el = html(`<div class="aln-sw-row" data-s="idle" style="--c:var(--${a.t});--cb:var(--${a.t}-bg);--cm:var(--aln-sw-${a.t},var(--${a.t}))"><div class="aln-sw-who"><span class="aln-sw-av" aria-hidden="true">${I(a.ic)}</span><span class="aln-sw-wt"><b>${a.n}</b><span>Starts soon</span></span></div><div class="aln-sw-lane"></div></div>`);
      const lane = $('.aln-sw-lane', a.el);
      if (a.waitFrom !== undefined){ a.w = html(`<span class="aln-sw-w" style="left:${pct(a.waitFrom)};width:calc(${pct(a.waitTo - a.waitFrom)} - 2px)"><span class="aln-sw-wl">${I('clock','xs')}<span>Waiting for ${a.waitFor}</span></span></span>`); lane.appendChild(a.w); }
      a.steps.forEach(x => { x.el = html(`<span class="aln-sw-b" style="left:${pct(x.s)};width:calc(${pct(x.d)} - 2px)" data-tip="${a.n}: ${x.t}, ${x.d.toFixed(1)}s"><span class="aln-sw-fl"><i></i>${I(x.ic,'xs')}</span></span>`); lane.appendChild(x.el); });
      rows.appendChild(a.el);
    });
    stagger($$('.aln-sw-row', r), 60);
    // the hand-offs, each a hook in its sender's hue and what was passed, placed by the lanes they join and the times
    const hos = ALN_HAND.map(h => { const a = A[h.from];
      const el = html(`<span class="aln-sw-ho" style="--hc:var(--aln-sw-${a.t},var(--${a.t}));--from:${h.from};--to:${h.to};--x0:${h.at / ALN_END};--x1:${h.got / ALN_END}" aria-hidden="true"><i></i></span>`);
      const tg = html(`<span class="tag aln-sw-tg" style="--c:var(--${a.t});--to:${h.to};--x0:${h.at / ALN_END}" aria-hidden="true">${I('file-text','xs')}${h.what}</span>`);
      rows.append(el, tg); return { ...h, el, tg }; });
    // the lane's width is read when it changes size, never while the clock runs
    let W = 0, CW = 0, T = 0, V = null, paused = false, fin = false, said = '';
    const lay = () => { W = $('.aln-sw-lane', A[0].el).clientWidth; CW = now.offsetWidth; paint(); };
    const ro = new ResizeObserver(lay); ro.observe(rows); c.offs.push(() => ro.disconnect());
    // the run as it stands: bars fill up to now (T); the playhead sits at now, or where you took it (V)
    function paint(){
      const v = V === null ? T : V;
      root.classList.toggle('scrub', V !== null);
      A.forEach(a => {
        a.steps.forEach(x => { const f = clamp((T - x.s) / x.d), k = f >= 1 ? 'done' : f > 0 ? 'run' : '';
          if (x.f !== f){ x.f = f; x.el.style.setProperty('--f', f.toFixed(4)); }
          if (x.k !== k){ x.k = k; x.el.classList.toggle('run', k === 'run'); x.el.classList.toggle('done', k === 'done'); }
          const af = x.s > v; if (x.af !== af){ x.af = af; x.el.classList.toggle('after', af); } });
        if (a.w){ const f = clamp((T - a.waitFrom) / (a.waitTo - a.waitFrom)); if (a.wf !== f){ a.wf = f; a.w.style.setProperty('--f', f.toFixed(4)); } a.w.classList.toggle('after', a.waitFrom > v); }
        const at = alnAt(a, v); if (a.s !== at.s){ a.s = at.s; a.el.dataset.s = at.s; } if (a.say !== at.t){ a.say = at.t; $('.aln-sw-wt span', a.el).textContent = at.t; }
      });
      hos.forEach(h => { const on = T >= h.at && v >= h.at; if (h.on !== on){ h.on = on; h.el.classList.toggle('on', on); h.tg.classList.toggle('on', on); } });
      const x = v / ALN_END * W; line.style.transform = `translateX(${x.toFixed(1)}px)`;
      now.style.transform = `translateX(${Math.max(-6, Math.min(W - CW + 6, x - CW / 2)).toFixed(1)}px)`;
    }
    function text(){
      const v = V === null ? T : V, put = (el, s) => { if (el.textContent !== s) el.textContent = s; };
      put(now, alnClock(v)); put(st, paused ? `Paused at ${alnClock(T)}` : fin ? 'Done in 0:12, with 2 hand-offs' : `${alnClock(T)} of 0:12`);
      ph.setAttribute('aria-valuenow', v.toFixed(1)); ph.setAttribute('aria-valuetext', `${v.toFixed(1)} seconds: ${A.map(a => a.n + ', ' + alnLc(alnAt(a, v).t)).join('; ')}`);
      const busy = A.filter(a => alnAt(a, v).s === 'work');
      const ln = V !== null ? `At ${alnClock(v)}: ${busy.length ? busy.map(a => `${a.n} ${alnLc(alnAt(a, v).t)}`).join(', ') : 'between steps'}` : fin ? 'All three finished in 12 seconds, with 2 hand-offs' : busy.length ? busy.map(a => `${a.n}: ${alnLc(alnAt(a, v).t)}`).join(' · ') : said;
      if (ln !== said){ said = ln; say.textContent = ln; }
    }
    // the agent a hand-off reaches nods as it gets the work
    const fire = () => hos.forEach(h => { if (T >= h.at && !h.fired){ h.fired = true; const b = A[h.to].el; b.classList.add('got'); c.later(650, () => b.classList.remove('got')); } });
    const iv = c.every(100, () => {
      if (paused || fin) return;
      T = Math.min(ALN_END, Math.round(T * 10 + 1) / 10); paint(); text(); fire();
      if (T >= ALN_END){ fin = true; clearInterval(iv); root.classList.add('fin'); swap(tt, 'All 3 agents finished'); pb.hidden = true; text(); }
    });
    pb.onclick = () => { paused = !paused; root.classList.toggle('paused', paused); pb.innerHTML = I(paused ? 'play' : 'pause','xs') + (paused ? 'Resume' : 'Pause'); swap(tt, paused ? 'All agents paused' : '3 agents working'); text(); };
    // dragging the playhead's time, clicking a lane, or the arrow keys on the playhead look back through the run; Back to
    // now follows the run again
    const seek = v => { v = Math.max(0, Math.min(T, v)); V = v >= T - .05 ? null : v; live.hidden = V === null; paint(); text(); };
    live.onclick = () => seek(T);
    const laneLeft = () => $('.aln-sw-lane', A[0].el).getBoundingClientRect().left;
    let drag = false, left = 0;
    c.on(now, 'pointerdown', e => { drag = true; ph.classList.add('drag'); left = laneLeft(); now.setPointerCapture(e.pointerId); e.preventDefault(); ph.focus({ preventScroll:true }); });
    c.on(now, 'pointermove', e => { if (drag && W) seek((e.clientX - left) / W * ALN_END); });
    const up = () => { drag = false; ph.classList.remove('drag'); }; c.on(now, 'pointerup', up); c.on(now, 'pointercancel', up);
    c.on(rows, 'pointerdown', e => { if (e.target.closest('.aln-sw-lane') && W) seek((e.clientX - laneLeft()) / W * ALN_END); });
    c.on(ph, 'keydown', e => { const v = V === null ? T : V, k = e.key; const to = k === 'ArrowLeft' || k === 'ArrowDown' ? v - .5 : k === 'ArrowRight' || k === 'ArrowUp' ? v + .5 : k === 'Home' ? 0 : k === 'End' ? T : null; if (to === null) return; e.preventDefault(); seek(to); });
    paint(); text();
    // the story: once the run is done, someone takes the playhead back through it, then back to now
    c.story(async s => {
      await s.until(() => fin); await s.beat(2);
      await s.point(now, false); seek(3.5); await s.point(now, false); await s.beat(1);
      seek(5.5); await s.point(now, false); await s.beat(3);
      seek(9.6); await s.point(now, false); await s.beat(3); s.away();
      await s.tap(live); s.away(); await s.beat(3);
    });
  }

  const alnCrewTpl = () => `<div class="aln-cw"><div class="aln-cw-h"><span class="aln-cw-ic">${I('users')}</span><b class="aln-cw-tt">3 agents working</b><span class="aln-cw-tot num">$0.00</span></div><div class="aln-cw-list"></div></div>`;
  // Crew: each agent keeps its own clock, which stops while you pause it, and a hand-off waits for the agent before it
  function alnCrew(r, c){
    const A = ALN_RUN(), H = ALN_HAND.map(h => ({ ...h })), list = $('.aln-cw-list', r), tot = $('.aln-cw-tot', r), tt = $('.aln-cw-tt', r);
    let fin = false;
    A.forEach((a, i) => {
      a.held = false; a.tk = 0; a.spent = 0; a.t = 0; const N = a.steps.length;
      a.el = html(`<div class="aln-cw-c" data-s="idle" style="--a:var(--av-${a.av});--ai:var(--av-${a.av}-ink)"><div class="aln-cw-top"><span class="aln-cw-av" aria-hidden="true">${I(a.ic)}</span><span class="aln-cw-tx"><b>${a.n}</b><span>Starts soon</span></span><span class="tag aln-cw-tag">Up next</span><span class="aln-cw-acts"><button class="ib aln-cw-hold" type="button" aria-pressed="false" aria-label="Pause ${a.n}" data-tip="Pause this agent">${I('pause','xs')}</button><button class="ib aln-cw-sb" type="button" aria-expanded="false" aria-label="Steer ${a.n}" data-tip="Steer">${I('wand','xs')}</button></span></div><div class="aln-cw-meter"><span class="aln-cw-tr" role="progressbar" aria-label="${a.n}’s steps" aria-valuemin="0" aria-valuemax="${N}" aria-valuenow="0" style="--n:${N}"><span class="aln-cw-ln"><i></i></span>${'<b></b>'.repeat(N)}</span><span class="aln-cw-num"><span><b class="aln-cw-sn">0</b> of ${N} steps</span><span class="aln-cw-tkn"><b class="aln-cw-tk">0</b> tokens</span><b class="aln-cw-cs">$0.00</b></span></div><div class="fold shut"><div><form class="aln-cw-steer"><input aria-label="A note for the ${a.n.toLowerCase()}" placeholder="Tell the ${a.n.toLowerCase()} what to change"><button class="ib" type="submit" aria-label="Send" data-tip="Send">${I('send','xs')}</button></form></div></div><div class="aln-cw-nts"></div></div>`);
      list.appendChild(a.el);
      a.tr = $('.aln-cw-tr', a.el); a.ln = $('.aln-cw-ln i', a.el); a.dots = $$('.aln-cw-tr b', a.el); a.sn = $('.aln-cw-sn', a.el); a.tkEl = $('.aln-cw-tk', a.el); a.csEl = $('.aln-cw-cs', a.el);
      if (i < A.length - 1){ const h = H[i]; h.el = html(`<div class="aln-cw-ho"><span>${a.n}</span><span class="ln"></span><span class="tag">${I('clock','xs')}${h.what}</span><span class="ln"></span><span>${A[i + 1].n}</span></div>`); list.appendChild(h.el); }
      const hold = $('.aln-cw-hold', a.el), sb = $('.aln-cw-sb', a.el), fold = $('.fold', a.el), form = $('.aln-cw-steer', a.el), inp = $('input', form);
      fold.inert = true;
      hold.onclick = () => { a.held = !a.held; hold.setAttribute('aria-pressed', String(a.held)); hold.innerHTML = I(a.held ? 'play' : 'pause','xs'); hold.dataset.tip = a.held ? 'Resume this agent' : 'Pause this agent'; hold.setAttribute('aria-label', (a.held ? 'Resume ' : 'Pause ') + a.n); paint(a); };
      // the note's field takes the focus only when you open it yourself; the demo never moves your focus
      sb.onclick = e => { const on = sb.getAttribute('aria-expanded') !== 'true'; sb.setAttribute('aria-expanded', String(on)); fold.classList.toggle('shut', !on); fold.inert = !on; if (on && e.isTrusted) requestAnimationFrame(() => inp.focus({ preventScroll:true })); };
      // the note shows once its field has shut, so the card never holds both at once
      form.onsubmit = e => { e.preventDefault(); const v = inp.value.trim(); if (!v) return; inp.value = ''; sb.click(); if (form.contains(document.activeElement)) sb.focus({ preventScroll:true });
        setTimeout(() => { if (a.el.isConnected) $('.aln-cw-nts', a.el).replaceChildren(html(`<div class="aln-cw-note">${I('check','xs')}<span>Got it: “${v.replace(/&/g, '&amp;').replace(/</g, '&lt;')}”, before the next step</span></div>`)); }, REDUCE ? 0 : 460); };
    });
    function paint(a){
      const at = alnAt(a, a.t), s = a.held && at.s !== 'done' ? 'hold' : at.s;
      if (a.s !== s){ a.s = s; a.el.dataset.s = s; const tg = $('.aln-cw-tag', a.el);
        tg.className = 'tag aln-cw-tag' + (s === 'done' ? ' ok' : s === 'hold' ? ' warn' : '');
        tg.innerHTML = s === 'work' ? '<span class="spin"></span>Working' : s === 'wait' ? 'Waiting' : s === 'done' ? I('check','xs') + 'Done' : s === 'hold' ? 'Paused' : 'Up next'; }
      const ln = s === 'hold' ? 'Paused by you' : at.t; if (a.say !== ln){ a.say = ln; const sp = $('.aln-cw-tx span', a.el); sp.className = s === 'work' ? 'shim' : ''; sp.textContent = ln; }
      // the line through the steps: up to each finished step's dot, and on towards the next as the step at work goes
      const N = a.steps.length, t = a.t + 1e-6, done = a.steps.filter(x => t >= x.s + x.d).length, cur = a.steps.find(x => t >= x.s && t < x.s + x.d);
      const p = Math.min(1, Math.round((done + (cur ? (a.t - cur.s) / cur.d : 0)) / N * 1e3) / 1e3);
      if (a.p !== p){ a.p = p; a.ln.style.transform = `scaleX(${p.toFixed(3)})`; }
      if (a.done !== done){ a.done = done; a.dots.forEach((d, k) => { d.classList.toggle('done', k < done); d.classList.toggle('now', k === done); }); a.sn.textContent = done; a.tr.setAttribute('aria-valuenow', done); }
    }
    c.every(100, () => {
      let spent = 0;
      A.forEach((a, i) => {
        const prev = H[i - 1];
        const blocked = prev && a.t >= (a.waitFrom ?? 99) && A[prev.from].t < prev.at;
        // once the hand-off has come, the wait is over at once
        if (!blocked && prev && a.t >= a.waitFrom && a.t < a.waitTo) a.t = a.waitTo;
        if (!a.held && !blocked && a.t < ALN_END) a.t = Math.min(ALN_END, Math.round(a.t * 10 + 1) / 10);
        if (alnAt(a, a.t).s === 'work' && !a.held){ a.tk += 40 + Math.random() * 90; a.spent += a.cost / 50; }
        spent += a.spent; paint(a);
        const tk = Math.round(a.tk).toLocaleString('en-US'), cs = '$' + a.spent.toFixed(2);
        if (a.tkEl.textContent !== tk) a.tkEl.textContent = tk; if (a.csEl.textContent !== cs) a.csEl.textContent = cs;
      });
      H.forEach(h => { if (!h.on && A[h.from].t >= h.at){ h.on = true; h.el.classList.add('on'); const tg = $('.tag', h.el); tg.className = 'tag ok'; tg.innerHTML = I('check','xs') + h.what; } });
      const ts = '$' + spent.toFixed(2); if (tot.textContent !== ts) tot.textContent = ts;
      if (!fin && A.every(a => a.t >= ALN_END)){ fin = true; swap(tt, 'All 3 agents finished'); $('.aln-cw-ic', r).innerHTML = I('ok'); }
    });
    A.forEach(paint);
    // the story: someone steers the designer while it works, then pauses the reviewer for a moment
    c.story(async s => {
      await s.until(() => A[1].s === 'work' && A[1].t > 5); await s.beat(1);
      await s.tap($('.aln-cw-sb', A[1].el)); s.away();
      await s.type($('input', A[1].el), 'Make the Pro card stand out', { n:.07, keep:true });
      await s.beat(1); await s.tap($('.aln-cw-steer .ib', A[1].el)); s.away();
      await s.until(() => A[2].s === 'work'); await s.beat(2);
      await s.tap($('.aln-cw-hold', A[2].el)); s.away(); await s.beat(4);
      await s.tap($('.aln-cw-hold', A[2].el)); s.away();
      await s.until(() => fin); await s.beat(4);
    });
  }
  // the switch: the design the card last showed (Classic to begin with) is drawn, and picking another starts the card
  // again with it, as Animate does (on designme.dev through the card's own replay, so its footer tabs follow)
  DM.def('agent-lanes', (r, c, card) => {
    const dm0 = $(':scope>.aln-dm', r);
    if (!dm0) return classic(r, c, card);
    // placed inside another component (as in Agent harness, where the card's own stage is not there), it is Classic, as it was
    if (!c.card){ dm0.replaceWith(...$(':scope>.dm-main', dm0).childNodes); return classic(r, c, card); }
    const D = { swimlanes:[alnSwim, alnSwTpl], crew:[alnCrew, alnCrewTpl] }, dv = D[c.card._dv] ? c.card._dv : 'classic';
    if (dv === 'classic') classic(r, c, card);
    else { $(':scope>.aln-dm>.dm-main', r).innerHTML = D[dv][1](); D[dv][0](r, c); }
    const sg = $(':scope>.aln-dm>.demo .seg2', r); if (!sg) return;
    $$('button', sg).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === dv)));
    seg(sg, v => { if (v === dv || !(v === 'classic' || D[v])) return; c.card._dv = v; if (window.V2 && c.card.dataset.v2) window.V2.replay(c.card); else DM.mount(c.card); });
  });
}
/* ---------- Agent run timeline ---------- */
DM.def('agent-run-timeline', (r, c) => {
  // each kind of step has a hue (a chart colour for its bar, the palette slot for its text and icon tint) and a name in the key.
  // Teal and orange take a little of their text slot, so the bars keep 3:1 on a light stage
  const K = { model:['Model', 'var(--c2)', 'pl'], tool:['Tools', 'color-mix(in srgb,var(--c6) 70%,var(--pt))', 'pt'], app:['Apps', 'color-mix(in srgb,var(--c4) 75%,var(--pp))', 'pp'] };
  // an icon starting with @ is an app's own mark
  const S = [
    { l:'Plan the change', ic:'brain', k:'model', s:0, d:1.6, cost:.03 },
    { l:'Read 6 files', ic:'file-text', k:'tool', s:1.6, d:2.2, cost:.02 },
    { l:'Search Figma', ic:'@figma', k:'app', s:1.9, d:1.4, cost:.01 },
    { l:'Edit PricingCard', ic:'edit', k:'model', s:4, d:2.4, cost:.06 },
    { l:'Run tests', ic:'term', k:'tool', s:6.5, d:1.5, cost:.01, fail:'2 failed' },
    { l:'Run tests again', ic:'refresh', k:'tool', s:8.1, d:1.9, cost:.01, retry:true },
    { l:'Open a PR on GitHub', ic:'@github', k:'app', s:10.1, d:1, cost:.02 },
    { l:'Post to Slack', ic:'@slack', k:'app', s:11.1, d:.6, cost:.01 }
  ];
  const T = 12, END = Math.max(...S.map(s => s.s + s.d)), PACE = 1.6, TK = [0, 3, 6, 9, 12];
  const art = $('.art', r), grid = $('.art-grid', r), rows = $('.art-rows', r), now = $('.art-now', r), st = $('.art-s', r), foot = $('.art-f', r);
  $('.art-ticks', r).innerHTML = TK.map(t => `<span style="left:${t / T * 100}%">${t}s</span>`).join('');
  const ticks = $$('.art-ticks span', r);
  $('.art-key', r).innerHTML = Object.entries(K).map(([id, k]) => `<span role="listitem" style="--k:${k[1]}"><i></i>${k[0]}<b data-k="${id}">0.0s</b></span>`).join('');
  const kb = Object.fromEntries($$('.art-key b', r).map(b => [b.dataset.k, b]));
  const pct = v => v / T * 100 + '%';
  S.forEach((s, i) => {
    const k = K[s.k], prev = S[i - 1];
    const link = s.retry && prev ? `<span class="art-link" aria-hidden="true" style="left:${pct(prev.s + prev.d)};width:${pct(s.s - prev.s - prev.d)}"></span>` : '';
    s.el = html(`<div class="art-row" data-k="${s.k}" data-s="wait" style="--k:${k[1]};--kt:var(--${k[2]});--kb:var(--${k[2]}-bg)"><span class="art-lab"><span class="art-ic" aria-hidden="true">${s.ic[0] === '@' ? BRAND[s.ic.slice(1)] : I(s.ic, 'xs')}</span><span class="t">${s.l}</span></span><span class="art-lane">${link}<span class="art-bar" style="left:${pct(s.s)}" data-tip="${s.l}: ${s.d.toFixed(1)}s, $${s.cost.toFixed(2)}${s.fail ? ', 2 tests failed' : ''}"><i></i></span></span><span class="art-d num"></span></div>`);
    s.bar = $('.art-bar', s.el); s.dur = $('.art-d', s.el); s.st = 'wait';
    rows.appendChild(s.el);
  });
  stagger($$('.art-row', r), 40);
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;
  let line = '', ft = '';
  // the run as it stands t seconds in: bars, states, times, the key, the footer and the line under the title
  function draw(t){
    grid.style.setProperty('--p', (t / T).toFixed(4));
    let cost = 0, n = 0, re = 0; const per = { model:0, tool:0, app:0 }, live = [];
    S.forEach(s => {
      const w = Math.max(0, Math.min(s.d, t - s.s)), was = s.st;
      s.st = t < s.s ? 'wait' : t < s.s + s.d ? 'run' : s.fail ? 'fail' : 'done';
      s.bar.style.width = pct(w);
      s.dur.textContent = t >= s.s ? w.toFixed(1) + 's' : '';
      if (s.st !== was){
        s.el.dataset.s = s.st;
        if (s.st === 'fail'){ const tg = html(`<span class="tag bad">${s.fail}</span>`); $('.art-lab', s.el).appendChild(tg); enter(tg); }
        if (s.st === 'done'){ s.el.classList.remove('bump'); void s.el.offsetWidth; s.el.classList.add('bump'); }
      }
      if (t >= s.s){ n++; cost += s.cost * w / s.d; per[s.k] += w; }
      if (s.st === 'fail') re++;
      if (s.st === 'run') live.push(s.l);
    });
    for (const k in per) kb[k].textContent = per[k].toFixed(1) + 's';
    const f = `<span>${I('clock','xs')}<span><b>${Math.min(t, END).toFixed(1)}s</b> total</span></span><span>${I('dollar','xs')}<span><b>$${cost.toFixed(2)}</b> cost</span></span><span>${I('layers','xs')}<span><b>${n}</b> ${n === 1 ? 'step' : 'steps'}</span></span><span>${I('refresh','xs')}<span><b>${re}</b> ${re === 1 ? 'retry' : 'retries'}</span></span>`;
    if (f !== ft){ foot.innerHTML = f; ft = f; }
    // between two steps the line keeps the last one's name, so it never flickers
    if (live.length && live.join(', ') !== line){ line = live.join(', '); st.textContent = line; }
    now.textContent = t.toFixed(1) + 's';
    // the time on the playhead covers the axis labels it passes
    const b = now.getBoundingClientRect();
    ticks.forEach(el => { const x = el.getBoundingClientRect(); el.classList.toggle('hid', x.right > b.left - 4 && x.left < b.right + 4); });
  }
  draw(0);
  c.run(async () => {
    await c.wait(500);
    art.classList.add('live'); st.classList.remove('muted'); st.classList.add('shim');
    // time moves on only while the demo isn't held, so a mouse resting on it stops the playhead where it is: a long gap
    // between two frames is a hold (or the card being away) ending, and counts as one frame
    await new Promise(res => { let t = 0, last = 0; c.loop(ts => { const dt = last && ts - last < 250 ? ts - last : 16; last = ts; t = Math.min(END, t + dt / 1000 * PACE); draw(t); if (t >= END){ res(); return false; } }); });
    art.classList.remove('live'); art.classList.add('fin');
    st.classList.remove('shim'); st.classList.add('muted');
    now.innerHTML = I('check','xs') + END.toFixed(1) + 's';
    const tag = $('.art-tag', r); tag.className = 'art-tag tag ok'; tag.innerHTML = I('check','xs') + 'Done'; enter(tag);
    swap(st, `Finished in ${END.toFixed(1)}s, ${plural(S.filter(s => s.fail).length, 'retry', 'retries')}`);
  });
});
/* ---------- Agent phases ---------- */
DM.def('agent-phases', (r, c) => {
  const root = $('.aph', r), head = $('.aph-h', r), g = $('.aph-g', r), lab = $('.aph-l', r), tm = $('.aph-t', r), segs = $$('.aph-tr i', r), x = $('.aph-x', r), fold = $('.aph-fold', r), list = $('.aph-list', r), sr = $('.aph-sr', r);
  // the phases in order, each with its glyph and what the line says while it lasts
  const P = [
    ['think', 'Thinking', '<span class="think on"><i></i><i></i><i></i><i></i></span>', 'Thinking about the question'],
    ['search', 'Searching', `<span class="radar"></span>`, 'Searching the help centre'],
    ['read', 'Reading', I('file-text','s'), 'Reading 3 articles'],
    ['wait', 'Waiting for you', I('hand','s'), 'Waiting for you'],
    ['write', 'Writing', I('edit','s'), 'Writing the reply'],
    ['done', 'Done', I('ok','s'), '']
  ];
  const took = {};
  let at = -1, secs = 0, ticking = true, mode = '', resolve = null;
  c.every(1000, () => { if (ticking && mode !== 'wait'){ secs++; tm.textContent = secs + 's'; } });
  const glyph = h => { g.innerHTML = h; enter(g.firstElementChild); };
  // a new phase: its glyph, its words shimmering, the next segment filling; only a change of phase is announced
  function go(i, words){
    at = i; const [k, name, gl, line] = P[i]; root.dataset.p = k; mode = k; glyph(gl);
    lab.classList.toggle('shim', k !== 'done' && k !== 'wait'); swap(lab, words || line);
    segs.forEach((s, j) => { s.classList.toggle('now', j === i && k !== 'done'); if (j <= i && !s.firstChild) s.appendChild(document.createElement('b')); });
    sr.textContent = k === 'done' ? `Done, thought for ${secs}s` : name;
  }
  const note = h => { x.innerHTML = h; if (x.firstElementChild) enter(x.firstElementChild); };
  // wait for a person: resolves with what they chose
  const ask = h => new Promise(res => { resolve = res; note(h); $$('.aph-n button', x).forEach(b => b.onclick = () => { if (resolve){ const f = resolve; resolve = null; f(b.dataset.a); } }); });
  c.run(async () => {
    const t0 = () => secs;
    let s = t0(); go(0); await c.wait(1600); took[0] = secs - s;
    // searching fails once, then works when retried
    s = t0(); go(1); await c.wait(1300);
    mode = 'err'; root.dataset.p = 'err'; glyph(I('alert','s')); lab.classList.remove('shim'); swap(lab, 'The search timed out'); sr.textContent = 'Error: the search timed out';
    await ask(`<div class="aph-n err">${I('alert','xs')}<span>The help centre didn't answer in 10s</span><button class="pill line sm" data-a="retry">${I('refresh','xs')}Retry</button></div>`);
    note(''); go(1, 'Searching the help centre again'); await c.wait(1200); took[1] = secs - s;
    // reading is slow: after a while it says so and offers Stop
    s = t0(); go(2); await c.wait(1800);
    let stopped = false;
    note(`<div class="aph-n">${I('clock','xs')}<span>Still working, the refund policy is a long page</span><button class="pill line sm aph-stop" data-a="stop">${I('stop','xs')}Stop</button></div>`);
    $('.aph-stop', x).onclick = () => { stopped = true; note(''); };
    await c.wait(2200); note(''); took[2] = secs - s;
    if (stopped){ go(5); lab.classList.remove('shim'); swap(lab, `Stopped after ${secs}s`); ticking = false; return; }
    // waiting for you: it stops the clock until someone answers
    s = t0(); go(3);
    const a = await ask(`<div class="aph-n ask"><span>Offer Maya a refund of $48?</span><button class="pill primary sm" data-a="ok">Approve</button><button class="pill ghost sm" data-a="no">Not now</button></div>`);
    note(''); took[3] = secs - s;
    s = t0(); go(4, a === 'ok' ? 'Writing the reply with the refund' : 'Writing the reply without a refund'); await c.wait(2000); took[4] = secs - s;
    // done: the line says how long it took and opens to the phases
    ticking = false; go(5); swap(lab, `Thought for ${secs}s`); tm.textContent = '';
    head.removeAttribute('aria-disabled');
    list.innerHTML = P.slice(0, 5).map(([, name], i) => `<li>${I('check','xs')}<span>${name}</span><span class="num">${took[i] || 0}s</span></li>`).join('');
  });
  head.onclick = () => { if (head.hasAttribute('aria-disabled')) return; const o = head.getAttribute('aria-expanded') !== 'true'; head.setAttribute('aria-expanded', o); fold.classList.toggle('shut', !o); };
  // the preview's story: retry the search, approve the refund, then open the finished line
  if (r === c.st) c.story(async s => {
    await s.until(() => mode === 'err' && $('.aph-n button', x)); await s.beat(3);
    await s.tap($('.aph-n button', x)); s.away();
    await s.until(() => mode === 'wait' && $('.aph-n button', x)); await s.beat(3);
    await s.tap($('.aph-n [data-a="ok"]', x)); s.away();
    await s.until(() => mode === 'done' && !head.hasAttribute('aria-disabled')); await s.beat(3);
    await s.tap(head); s.away(); await s.beat(5);
  });
});
/* ---------- Web search ---------- */
DM.def('web-search', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chev}', I('chev-d','xs'));
  // the searches: what was asked, how many results, how long it took, and the pages it opened. The first finds nothing and is
  // asked again in other words
  const Q = [
    { q:'stripe usage based billing limits 2026 enterprise tier', n:0, ms:'0.6s' },
    { q:'stripe usage-based billing limits', n:5, ms:'0.9s', from:0, p:[
      ['Usage-based billing', 'stripe.com', 'Oct 2026', 'read'], ['Meters and billing thresholds', 'stripe.com', 'Sep 2026', 'read', 1],
      ['How we moved 40k customers to usage billing', 'medium.com', 'Mar 2026', 'skim'], ['Why SaaS pricing is moving to usage', 'ft.com', 'Aug 2026', 'paywall'] ] },
    { q:'metronome vs orb usage billing', n:6, ms:'1.1s', p:[
      ['Metronome vs Orb: a fair comparison', 'metronome.com', 'Jul 2026', 'read', 2], ['Orb pricing and plans', 'withorb.com', 'Oct 2026', 'read'],
      ['orb-billing/examples: sending usage events', 'github.com', 'Jun 2026', 'read'], ['Anyone switched from Stripe Billing to Orb?', 'reddit.com', 'May 2026', 'blocked'] ] }
  ];
  const ST = { read:['Read', ''], skim:['Skimmed', ''], paywall:['Skipped: paywall', 'warn'], blocked:['Skipped: blocked', 'warn'], timeout:['Skipped: timeout', 'warn'] };
  const root = $('.wsx', r), head = $('.wsx-h', r), ic = $('.wsx-ic', r), st = $('.wsx-st', r), marks = $('.wsx-marks', r), fold = $('.wsx-fold', r), list = $('.wsx-list', r), ans = $('.wsx-ans', r), sr = $('.wsx-sr', r);
  const say = t => { sr.textContent = t; };
  const setOpen = o => { head.setAttribute('aria-expanded', o); fold.classList.toggle('shut', !o); };
  head.onclick = () => setOpen(head.getAttribute('aria-expanded') !== 'true');
  const sites = [];
  const drawMarks = () => { const u = [...new Set(sites)]; marks.innerHTML = u.slice(0, 4).map(s => `<span data-s="${s}">${s[0].toUpperCase()}</span>`).join('') + (u.length > 4 ? `<span class="n">+${u.length - 4}</span>` : ''); };
  const qOpen = (el, o) => { const b = $('.wsx-qh', el), f = $('.fold', el); if (!f) return; b.setAttribute('aria-expanded', o); f.classList.toggle('shut', !o); };
  const pages = {};
  let done = false;
  c.run(async () => {
    await c.wait(500);
    for (const [k, q] of Q.entries()){
      const el = html(`<div class="wsx-q" data-k="${k}"><button class="wsx-qh${q.n ? '' : ' empty'}" aria-expanded="false">${I('search','xs')}<span class="t shim">${q.q}</span><span class="n">Searching</span><span class="tm num"></span>${I('chev-r','xs')}</button>${q.from != null ? `<span class="wsx-rw">${I('refresh','xs')}Asked again in other words</span>` : ''}${q.p ? '<div class="fold shut"><div><ul class="wsx-rs"></ul></div></div>' : ''}</div>`);
      list.appendChild(el); enter(el); swap(st, `Searching for “${q.q}”`);
      const b = $('.wsx-qh', el); b.onclick = () => { if ($('.fold', el)) qOpen(el, b.getAttribute('aria-expanded') !== 'true'); };
      await c.wait(1100);
      $('.t', b).classList.remove('shim'); $('.tm', b).textContent = q.ms;
      const n = $('.n', b); n.textContent = q.n ? `${q.n} results` : 'No results'; n.classList.toggle('none', !q.n);
      b.setAttribute('aria-label', `${q.q}: ${q.n ? q.n + ' results' : 'no results'}, ${q.ms}`);
      say(q.n ? `${q.n} results for ${q.q}` : `No results for ${q.q}. Asking again in other words`);
      if (!q.p){ await c.wait(500); continue; }
      qOpen(el, true); const ul = $('.wsx-rs', el);
      swap(st, `Reading ${q.p.length} pages`);
      for (const [t, d, when, s, cite] of q.p){
        const li = html(`<li class="wsx-r" tabindex="0" data-tip="${t} · ${d}"><span class="wsx-fav" aria-hidden="true">${d[0].toUpperCase()}</span><span class="tx"><span class="t">${t}</span><span class="d">${d} · ${when}</span></span><span class="tag"><span class="spin"></span>Reading</span></li>`);
        ul.appendChild(li); enter(li); sites.push(d); drawMarks(); if (cite) pages[cite] = { li, q:el, d };
        await c.wait(420);
        const g = $('.tag', li); g.className = 'tag ' + ST[s][1]; g.textContent = ST[s][0]; li.classList.toggle('skip', s !== 'read' && s !== 'skim');
        li.setAttribute('aria-label', `${t}, ${d}, ${when}: ${ST[s][0]}`);
      }
      await c.wait(500); qOpen(el, false);
    }
    // done: the trail folds to one line, and the answer streams in under it, citing its pages
    done = true; ic.innerHTML = I('globe','xs'); st.classList.remove('shim');
    const read = Q.flatMap(q => q.p || []).filter(p => p[3] === 'read' || p[3] === 'skim').length;
    swap(st, `${Q.length} searches, ${read} pages read`); say(`Done: ${Q.length} searches, ${read} pages read`);
    await c.wait(400); hold(root); setOpen(false);
    const A = 'Stripe caps metered usage at 100 million events a month for each meter [1]. Metronome and Orb both take events in bulk with no monthly cap [2]. At your volume Stripe still fits, with room to grow.'.split(' ');
    for (let i = 1; i <= A.length; i++){ ans.innerHTML = A.slice(0, i).join(' ').replace(/\[(\d)\]/g, (m, k) => `<button class="wsx-cite" data-c="${k}" aria-label="Source ${k}: ${$('.t', pages[k].li).textContent}, ${pages[k].d}" data-tip="${$('.t', pages[k].li).textContent} · ${pages[k].d}">${k}</button>`); await c.wait(50); }

  });
  // a citation lights the page it came from (and the query that found it), and its site's mark
  const light = k => { $$('.wsx-r.hl, .wsx-q.hl', r).forEach(x => x.classList.remove('hl')); $$('.wsx-marks span', r).forEach(x => x.classList.remove('hl')); $$('.wsx-cite', r).forEach(x => x.classList.toggle('on', x.dataset.c === k)); if (!k) return;
    const p = pages[k]; const shown = !$('.fold', p.q).classList.contains('shut') && head.getAttribute('aria-expanded') === 'true'; (shown ? p.li : p.q).classList.add('hl'); const m = $(`.wsx-marks span[data-s="${p.d}"]`, r); if (m) m.classList.add('hl'); };
  c.on(ans, 'pointerover', e => { const b = e.target.closest('.wsx-cite'); if (b) light(b.dataset.c); });
  c.on(ans, 'pointerout', e => { const b = e.target.closest('.wsx-cite'); if (b && !b.contains(e.relatedTarget)) light(null); });
  c.on(ans, 'focusin', e => { const b = e.target.closest('.wsx-cite'); if (b) light(b.dataset.c); });
  c.on(ans, 'focusout', () => light(null));
  // the preview's story: open the trail again, open the search that found source 2, and point at [2]
  if (r === c.st) c.story(async s => {
    await s.until(() => done && $('.wsx-cite[data-c="2"]', r)); await s.beat(4);
    await s.tap(head); await s.beat(2);
    await s.tap($('.wsx-q[data-k="2"] .wsx-qh', r)); await s.beat(2);
    const b = $('.wsx-cite[data-c="2"]', r); await s.point(b); light('2'); await s.beat(4);
    light(null); s.away(); await s.beat(2);
  });
});