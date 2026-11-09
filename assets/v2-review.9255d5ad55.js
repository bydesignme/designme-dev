TPLS["design-review"] = "<div class=\"drv panel\">\n  <div class=\"drv-h\"><span class=\"drv-ic\">{palette}</span><div class=\"drv-ht\"><b>Pricing page v4</b><span class=\"muted\">6 screens · sent for review by the design agent</span></div><span class=\"tag b drv-tag\">In review</span></div>\n  <div class=\"drv-b\">\n    <div class=\"drv-col\"><span class=\"drv-lb\">Checks</span><div class=\"drv-checks\"></div></div>\n    <div class=\"drv-col\"><span class=\"drv-lb\">Review</span><div class=\"drv-rv\" aria-live=\"polite\"><span class=\"muted drv-wt\">Maya reviews once the checks pass</span></div></div>\n  </div>\n  <div class=\"drv-f\">\n    <span class=\"muted drv-st\">Waiting on checks</span>\n    <div class=\"drv-mg\"><button class=\"pill accent sm drv-go\" disabled>Ship to everyone</button><button class=\"pill accent sm drv-dd\" aria-label=\"How it ships\" data-pop=\".drv-pop\" data-pop-align=\"end\" disabled>{chev}</button></div>\n    <div class=\"pop drv-pop\" role=\"menu\">\n      <button class=\"mi\" role=\"menuitemradio\" data-close data-m=\"Ship to everyone\" aria-checked=\"true\"><span>Ship to everyone<span class=\"d\">Every visitor sees it now</span></span><span class=\"ck\">{chk}</span></button>\n      <button class=\"mi\" role=\"menuitemradio\" data-close data-m=\"Ship to 10% first\" aria-checked=\"false\"><span>Ship to 10% first<span class=\"d\">Everyone else after a day</span></span><span class=\"ck\">{chk}</span></button>\n      <button class=\"mi\" role=\"menuitemradio\" data-close data-m=\"Ship on Monday\" aria-checked=\"false\"><span>Ship on Monday<span class=\"d\">At 09:00 your time</span></span><span class=\"ck\">{chk}</span></button>\n    </div>\n  </div>\n</div>";
TPLS["eval-results"] = "<div class=\"dm evr-dm\" data-designs=\"card\"><div class=\"dm-main\">\n<div class=\"evr panel\">\n  <div class=\"evr-h\"><div class=\"evr-ht\"><b>Pricing copy evals</b><span class=\"muted evr-st\">Copy agent · 8 cases · run 2h ago</span></div><button class=\"pill primary sm evr-run\">{play}Run evals</button></div>\n  <div class=\"evr-sum\"><div class=\"evr-segs\" aria-hidden=\"true\"></div><div class=\"evr-nums\"><span class=\"evr-pass num\" aria-live=\"polite\"></span><span class=\"tag evr-dl\"></span></div></div>\n  <div class=\"evr-tabs\"><div class=\"seg2\" role=\"group\" aria-label=\"Show\"><button aria-pressed=\"true\" data-v=\"all\">All <span class=\"n num\"></span></button><button aria-pressed=\"false\" data-v=\"fail\">Failed <span class=\"n num\"></span></button></div></div>\n  <div class=\"evr-list\" role=\"list\" aria-label=\"Cases\"></div>\n  <p class=\"evr-none\" hidden>No failed cases</p>\n</div>\n</div>\n<div class=\"demo\"><div class=\"seg2\" role=\"group\" aria-label=\"Eval results design\"><button aria-pressed=\"true\" data-v=\"classic\">Classic</button><button aria-pressed=\"false\" data-v=\"runs\">Run vs run</button><button aria-pressed=\"false\" data-v=\"judge\">Score &amp; judge</button></div></div>\n</div>";
TPLS["steering"] = "<div class=\"ste panel\">\n  <div class=\"ste-h\"><b>Redesign the pricing page</b><span class=\"muted ste-st\"><span class=\"m\" aria-live=\"polite\">Step 2 of 4</span> · <span class=\"num ck\">0:00</span></span></div>\n  <ol class=\"ste-steps\" aria-label=\"Steps\"></ol>\n  <div class=\"ste-log\" aria-live=\"polite\"></div>\n  <form class=\"ste-box\"><input placeholder=\"Steer the agent while it works\" aria-label=\"Message the agent\" spellcheck=\"false\" autocomplete=\"off\"><button class=\"ste-go\" aria-label=\"Send\" disabled>{up}</button></form>\n</div>";
TPLS["draft-review"] = "<div class=\"drf panel\">\n  <div class=\"drf-h\"><span class=\"drf-ag\">{spark}</span><div class=\"drf-ht\"><b>Draft from the agent</b><span class=\"muted\">After the pricing review with Maya</span></div><span class=\"tag drf-tag\">Not sent</span></div>\n  <div class=\"drf-fs\">\n    <div class=\"drf-r\"><span class=\"drf-l\">To</span><span class=\"drf-p\">{av}Maya Kim</span></div>\n    <label class=\"drf-r\"><span class=\"drf-l\">Subject</span><input class=\"drf-s\" value=\"Pricing v4: what changed\" aria-label=\"Subject\"></label>\n  </div>\n  <div class=\"drf-b\" contenteditable=\"true\" role=\"textbox\" aria-multiline=\"true\" aria-label=\"Message\" spellcheck=\"false\">Hi Maya,<br><br>Here's what changed on the pricing page: one button per plan, the yearly price first, and the FAQ under the comparison table. The full list is in the attached summary.<br><br>Ready for your sign-off when you are.</div>\n  <div class=\"drf-att\"></div>\n  <div class=\"fold shut drf-wf\"><div><div class=\"drf-w\"><p>{warn}<span>You mention an attachment, but nothing is attached.</span></p><div class=\"drf-wa\"><button class=\"pill ghost sm drf-any\">Send anyway</button><button class=\"pill primary sm drf-at\">{clip}Attach the summary</button></div></div></div></div>\n  <div class=\"drf-f\">\n    <button class=\"pill ghost sm drf-x\">{trash}Discard</button><span class=\"sp\"></span><span class=\"muted drf-when\"></span>\n    <div class=\"drf-mg\"><button class=\"pill primary sm drf-go\">{send}Send</button><button class=\"pill primary sm drf-dd\" aria-label=\"When to send\" aria-haspopup=\"menu\" aria-expanded=\"false\" data-pop=\".drf-pop\" data-pop-align=\"end\">{chev}</button></div>\n  </div>\n  <div class=\"pop drf-pop\" role=\"menu\" aria-label=\"When to send\">\n    <button class=\"mi\" role=\"menuitemradio\" aria-checked=\"true\" data-close data-w=\"now\"><span>Send now</span><span class=\"ck\">{chk}</span></button>\n    <button class=\"mi\" role=\"menuitemradio\" aria-checked=\"false\" data-close data-w=\"Tomorrow at 09:00\"><span>Tomorrow at 09:00<span class=\"d\">The start of Maya's day</span></span><span class=\"ck\">{chk}</span></button>\n    <button class=\"mi\" role=\"menuitemradio\" aria-checked=\"false\" data-close data-w=\"Monday at 09:00\"><span>Monday at 09:00<span class=\"d\">The start of next week</span></span><span class=\"ck\">{chk}</span></button>\n  </div>\n</div>";
TPLS["inline-text-diff"] = "<div class=\"itd panel\">\n  <div class=\"itd-h\"><div class=\"itd-ht\"><b>Pricing intro</b><span class=\"muted itd-st\">4 edits to review</span></div><div class=\"itd-a\"><button class=\"pill ghost sm itd-no\">Reject all</button><button class=\"pill primary sm itd-ok\">Accept all</button></div></div>\n  <p class=\"itd-t\"></p>\n  <p class=\"itd-f muted\" aria-live=\"polite\"></p>\n  <div class=\"itd-bar\" role=\"dialog\" aria-label=\"Edit\">\n    <p class=\"itd-why\">{warn}<span></span></p>\n    <div class=\"itd-bb\"><button class=\"pill primary sm itd-acc\">{chk}Accept</button><button class=\"pill ghost sm itd-rej\">{x}Reject</button></div>\n  </div>\n</div>";
TPLS["launch-checklist"] = "<div class=\"lcx panel\">\n  <div class=\"lcx-h\"><div><b>Ready to ship pricing?</b><span class=\"muted lcx-st\">6 checks</span></div><button class=\"pill primary sm lcx-run\">{play}Run checks</button></div>\n  <div class=\"lcx-bar\"></div>\n  <div class=\"lcx-list\"></div>\n</div>";
TPLS["rewrite-toolbar"] = "<div class=\"rwx panel\">\n  <div class=\"rwx-h\"><span class=\"ft\">DOC</span><span>Onboarding intro</span><span class=\"muted rwx-st\">Click a sentence</span></div>\n  <div class=\"rwx-doc\"></div>\n  <div class=\"rwx-tb\" role=\"toolbar\" aria-label=\"Rewrite\">\n    <button class=\"rwx-b\" data-k=\"clear\">{spark}Clearer</button><button class=\"rwx-b\" data-k=\"short\">Shorter</button><button class=\"rwx-b\" data-k=\"warm\">Friendlier</button><span class=\"rwx-sep\"></span><button class=\"rwx-b ic\" aria-label=\"Ask the agent\" data-tip=\"Ask the agent\" data-tip-k=\"⌘K\">{at}</button>\n  </div>\n</div>";
TPLS["design-tuner"] = "<div class=\"dtx\">\n  <div class=\"dtx-prev\"><div class=\"dtx-card\">\n    <span class=\"tag b dtx-tg\">Pro</span>\n    <div class=\"dtx-pr\"><b class=\"num\">$24</b><span class=\"muted\">per editor, monthly</span></div>\n    <div class=\"dtx-li\"><span>{c}Unlimited frames</span><span>{c}Agent reviews</span><span>{c}Shared tokens</span></div>\n    <button class=\"pill accent dtx-cta\">Start free trial</button>\n  </div></div>\n  <div class=\"dtx-insp panel\">\n    <div class=\"dtx-ih\"><b>Pricing card</b><span class=\"muted dtx-st\">Edited by you</span></div>\n    <div class=\"dtx-rows\"></div>\n    <button class=\"pill primary sm dtx-go\">{wand}Tune with agent</button>\n  </div>\n</div>";
TPLS["proposal-card"] = "<div class=\"prx\">\n  <div class=\"prx-h\"><span class=\"prx-ic\">{wand}</span><div class=\"prx-ht\"><b>Raise contrast on the secondary button</b><span class=\"muted\">Pricing, frame 2 of 3</span></div></div>\n  <div class=\"prx-diff\"><div class=\"prx-sw\"><span class=\"prx-c\" style=\"background:#c9cfd8\"></span><span class=\"num\">#C9CFD8</span><span class=\"tag bad\">2.1 : 1</span></div><span class=\"prx-ar\">{right}</span><div class=\"prx-sw prx-new\"><span class=\"prx-c\" style=\"background:#5b6472\"></span><span class=\"num\">#5B6472</span><span class=\"tag ok\"><span class=\"prx-rt\">5.9 : 1</span></span></div></div>\n  <div class=\"prx-cf\"><span class=\"muted\">Confidence</span><div class=\"prx-seg\"><i></i><i></i><i></i><i></i><i></i></div><span class=\"num prx-pc\">0%</span></div>\n  <button class=\"prx-alt-t\">{chev}<span>2 other options</span></button>\n  <div class=\"fold shut prx-alt\"><div><div class=\"prx-alts\"></div></div></div>\n  <div class=\"prx-f\"><button class=\"pill ghost sm prx-no\">Not now</button><button class=\"pill primary sm prx-ok\">Accept</button></div>\n</div>";
TPLS["decision-prompt"] = "<div class=\"dpx\" tabindex=\"0\">\n  <div class=\"dpx-h\"><span class=\"dpx-k muted num\">Question 1 of 3</span><div class=\"dpx-dots\"><i class=\"on\"></i><i></i><i></i></div></div>\n  <div class=\"dpx-body\"></div>\n  <div class=\"dpx-f\"><button class=\"pill ghost sm dpx-skip\">Skip</button><button class=\"pill primary sm dpx-go\">Continue <span class=\"kbd\">↵</span></button></div>\n</div>";
TPLS["human-handoff"] = "<div class=\"hox panel\">\n  <div class=\"hox-h\"><span class=\"hox-ic\">{user}</span><div class=\"hox-ht\"><b>Handed off to a person</b><span class=\"muted\">Refund over $500 needs a person</span></div></div>\n  <div class=\"hox-b\">\n    <div class=\"hox-col\">\n      <span class=\"hox-lb\">Assigned to</span>\n      <div class=\"hox-who\"><span class=\"hox-av\"><span class=\"spin\"></span></span><span class=\"hox-wt\"><b class=\"hox-wn\">Finding someone</b><span class=\"hox-wd\"><span class=\"hox-wv\">Billing team</span></span></span><button class=\"hox-rb\" aria-haspopup=\"menu\" aria-expanded=\"false\" data-pop=\".hox-pop\" data-pop-align=\"end\" data-pop-pos=\"down\" disabled>Reassign{chev}</button></div>\n      <div class=\"hox-sla\"><div class=\"hox-sl\">{clock}<span class=\"hox-due num\">Reply due in 14 min</span><span class=\"muted\">15 min target</span></div><div class=\"hox-bar\" role=\"progressbar\" aria-label=\"Time left to reply\" aria-valuemin=\"0\" aria-valuemax=\"900\"><i></i></div></div>\n      <div class=\"hox-ms\">\n        <div class=\"hox-mh\"><span class=\"hox-lb hox-ml\">Sent to Dana</span><span class=\"sp\"></span><button class=\"pill ghost sm hox-no\" hidden>Cancel</button><button class=\"pill ghost sm hox-ed\">{edit}Edit</button></div>\n        <div class=\"hox-mb\" role=\"textbox\" aria-multiline=\"true\" aria-readonly=\"true\" aria-label=\"Message sent to Dana\" spellcheck=\"false\">Thanks, Dana. A refund this size needs someone on our billing team, so I've passed your conversation to them. They'll reply here within 15 minutes.</div>\n      </div>\n    </div>\n    <div class=\"hox-col\">\n      <span class=\"hox-lb\">Context passed along</span>\n      <p class=\"hox-sum\">Dana was charged twice for her annual plan on Oct 21 and wants one charge back. The agent confirmed the duplicate, but can't refund more than $500.</p>\n      <div class=\"hox-facts\">\n        <div class=\"hox-f\"><span class=\"k\">Amount</span><span class=\"v num\">$588.00</span></div>\n        <div class=\"hox-f\"><span class=\"k\">Customer</span><span class=\"v\">Dana Lee · Pro since 2023</span></div>\n        <div class=\"hox-f\"><span class=\"k\">Order</span><span class=\"v num\">#48213 · charged twice</span></div>\n      </div>\n      <button class=\"fchip lnk hox-lnk\" data-tip=\"Opens the whole conversation\">{link}<span>View conversation · 12 messages</span></button>\n    </div>\n  </div>\n  <div class=\"hox-st\" aria-live=\"polite\"><span class=\"g\"><span class=\"spin\"></span></span><span class=\"t\"><b class=\"hox-sa\">Handing off to Billing</b><span class=\"hox-sb\">The agent has stopped replying to Dana</span></span></div>\n  <div class=\"pop hox-pop\" role=\"menu\" aria-label=\"Reassign to\">\n    <div class=\"ph\">Reassign to</div>\n  </div>\n</div>";
TPLS["permission-gate"] = "<div class=\"pgx panel\">\n  <div class=\"pgx-h\"><span class=\"pgx-ic\">{figma}</span><div class=\"pgx-ht\"><b>Allow the agent to edit Figma?</b><span class=\"muted\">It needs this to apply the pricing fixes</span></div></div>\n  <div class=\"pgx-sc\">\n    <label class=\"pgx-o\" data-k=\"read\"><input type=\"checkbox\" checked><span class=\"bx\">{chk}</span><span class=\"t\">Read frames<span class=\"d\">Pricing, Checkout</span></span></label>\n    <label class=\"pgx-o\" data-k=\"edit\"><input type=\"checkbox\" checked><span class=\"bx\">{chk}</span><span class=\"t\">Edit frames<span class=\"d\">Only on a new page</span></span></label>\n    <label class=\"pgx-o\" data-k=\"publish\"><input type=\"checkbox\"><span class=\"bx\">{chk}</span><span class=\"t\">Publish library<span class=\"d\">Affects 4 other files</span></span><span class=\"tag warn\" data-tip=\"Checkout, Marketing site, Email kit and Docs use this library\">Risky</span></label>\n  </div>\n  <div class=\"pgx-f\"><button class=\"pgx-db\" aria-haspopup=\"menu\" aria-expanded=\"false\" aria-label=\"How long\" data-pop=\".pgx-pop\"><span class=\"pgx-dv\">For this task</span>{chev}</button><span class=\"sp\"></span><button class=\"pill ghost sm pgx-no\">Not now</button><button class=\"pill primary sm pgx-ok\">Allow 2 scopes</button></div>\n  <div class=\"pop pgx-pop\" role=\"menu\" aria-label=\"How long\">\n    <button class=\"mi\" role=\"menuitemradio\" aria-checked=\"true\" data-close data-v=\"This task\"><span>For this task<span class=\"d\">Until the pricing fixes are done</span></span><span class=\"ck\">{chk}</span></button>\n    <button class=\"mi\" role=\"menuitemradio\" aria-checked=\"false\" data-close data-v=\"Today\"><span>For today<span class=\"d\">Until midnight</span></span><span class=\"ck\">{chk}</span></button>\n    <button class=\"mi\" role=\"menuitemradio\" aria-checked=\"false\" data-close data-v=\"Always\"><span>Always<span class=\"d\">Until you revoke it</span></span><span class=\"ck\">{chk}</span></button>\n  </div>\n</div>";
TPLS["plan-review"] = "<div class=\"plx\">\n  <div class=\"plx-h\"><span class=\"think plx-mk\"><i></i><i></i><i></i><i></i></span><div class=\"plx-ht\"><b>Plan: redesign the pricing page</b><span class=\"muted plx-st\">5 steps, about 4 min</span></div><span class=\"plx-tm num\" aria-label=\"Elapsed\"></span></div>\n  <ol class=\"plx-list\"></ol>\n  <button class=\"plx-add\">{plus}Add a step</button>\n  <div class=\"plx-f\"><span class=\"muted plx-n\">Click a step to edit it</span><button class=\"pill ghost sm plx-chg\">Ask for changes</button><button class=\"pill primary sm plx-go\">Approve plan</button></div>\n</div>";
TPLS["change-review"] = "<div class=\"crx panel\">\n  <div class=\"crx-side\">\n    <div class=\"crx-sh\"><b>3 files changed</b><span class=\"muted crx-tot num\"></span></div>\n    <div class=\"crx-files\"></div>\n  </div>\n  <div class=\"crx-main\">\n    <div class=\"crx-mh\"><span class=\"crx-fn num\"></span><span class=\"crx-sp\"></span><button class=\"pill ghost sm crx-rej\">Undo all</button><button class=\"pill primary sm crx-ok\">Keep all</button></div>\n    <div class=\"crx-diff\"></div>\n  </div>\n</div>";

/* ---------- Decision prompt ---------- */
DM.def('decision-prompt', (r, c) => {
  const Q = [
    ['Which frames should the agent redesign?', 'Frames', [['Pricing only','1 frame'],['Pricing and checkout','3 frames'],['The whole flow','9 frames']]],
    ['How bold can the changes be?', 'Scope', [['Polish spacing and type','Safe'],['Rework the layout','Medium'],['Fresh direction','Bold']]],
    ['Where should the result go?', 'Output', [['New Figma page','Keeps the original'],['Branch in the repo','Opens a PR'],['Both','Recommended']]]
  ];
  const ans = []; let qi = 0, sel = 0, done = false;
  const body = $('.dpx-body', r), k = $('.dpx-k', r), dots = $$('.dpx-dots i', r), go = $('.dpx-go', r), skip = $('.dpx-skip', r), card = $('.dpx', r);
  function paint(){
    k.textContent = 'Question ' + (qi + 1) + ' of 3';
    dots.forEach((d, i) => { d.classList.toggle('on', i === qi); d.classList.toggle('done', i < qi); });
    const q = Q[qi];
    body.innerHTML = `<div class="dpx-q">${q[0]}</div>` + q[2].map((o, i) => `<button class="dpx-o${i === sel ? ' on' : ''}" data-i="${i}"><span class="kbd">${i + 1}</span>${o[0]}<span class="d">${o[1]}</span></button>`).join('');
    enter($('.dpx-q', body)); stagger($$('.dpx-o', body), 50, 60);
    $$('.dpx-o', body).forEach(b => { b.onclick = () => choose(+b.dataset.i); b.ondblclick = next; });
  }
  function choose(i){ sel = i; $$('.dpx-o', body).forEach((b, j) => b.classList.toggle('on', j === i)); }
  function next(skipped){
    if (done) return; ans.push(skipped === true ? 'Agent decides' : Q[qi][2][sel][0]); qi++; sel = 0;
    if (qi < Q.length) return paint();
    done = true; dots.forEach(d => { d.classList.remove('on'); d.classList.add('done'); }); k.textContent = 'All set';
    go.parentElement.classList.add('leave');
    body.innerHTML = `<div class="dpx-sum">${Q.map((q, i) => `<div class="dpx-sr"><span>${q[1]}</span>${ans[i]}</div>`).join('')}<div class="dpx-run"><span class="think on"><i></i><i></i><i></i><i></i></span><span class="shim">Starting the redesign</span></div></div>`;
    stagger($$('.dpx-sr, .dpx-run', body), 70);
  }
  go.onclick = () => next(); skip.onclick = () => next(true);
  c.on(card, 'keydown', e => { if (done) return; if (/^[1-3]$/.test(e.key)){ choose(+e.key - 1); e.preventDefault(); } else if (e.key === 'Enter'){ next(); e.preventDefault(); } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ choose((sel + (e.key === 'ArrowDown' ? 1 : 2)) % 3); e.preventDefault(); } });
  paint();
});
/* ---------- Proposal card ---------- */
DM.def('proposal-card', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{wand}', I('wand')).replace('{right}', I('right','xs')).replace('{chev}', I('chev-r','xs'));
  const segs = $$('.prx-seg i', r), pc = $('.prx-pc', r), at = $('.prx-alt-t', r), alt = $('.prx-alt', r), f = $('.prx-f', r);
  const nw = $('.prx-new', r);
  const all = [
    { bg:'#5b6472', hex:'#5B6472', ratio:'5.9 : 1', conf:84, name:'Suggested', d:'Balanced with the primary' },
    { bg:'#475161', hex:'#475161', ratio:'7.4 : 1', conf:62, name:'Darker', d:'Stronger than the primary' },
    { bg:'#116ff8', hex:'#116FF8', ratio:'4.6 : 1', conf:41, name:'Accent outline', d:'Competes with the CTA' }
  ];
  let cur = 0;
  const alts = $('.prx-alts', r);
  function conf(v){ tween(+pc.textContent.replace('%','') || 0, v, 700, x => { pc.textContent = Math.round(x) + '%'; segs.forEach((s, i) => s.classList.toggle('on', x >= (i + 1) * 20 - 10)); }); }
  function list(){ alts.innerHTML = all.map((o, i) => i === cur ? '' : `<button class="prx-a" data-i="${i}"><span class="prx-c" style="background:${o.bg}"></span><span>${o.name}, ${o.ratio}</span><span class="d">${o.d}</span></button>`).join(''); $$('.prx-a', alts).forEach(a => a.onclick = () => apply(+a.dataset.i)); }
  function apply(i){ cur = i; const o = all[i]; $('.prx-c', nw).style.background = o.bg; swap($('.num', nw), o.hex); swap($('.prx-rt', nw), o.ratio); conf(o.conf); list(); stagger($$('.prx-a', alts), 50); }
  at.onclick = () => { const op = alt.classList.toggle('shut'); at.classList.toggle('open', !op); };
  list();
  let saved;
  const reset = () => { f.innerHTML = saved; bind(); };
  function bind(){
    $('.prx-ok', r).onclick = () => { saved = f.innerHTML; alt.classList.add('shut'); at.classList.remove('open');
      f.innerHTML = `<span class="prx-done">${I('ok')}<span>Applied to 3 buttons</span></span><button class="pill ghost sm prx-un">${I('undo','xs')}Undo</button>`; stagger([...f.children], 60);
      $('.prx-un', r).onclick = reset; };
    $('.prx-no', r).onclick = () => { saved = f.innerHTML; f.innerHTML = `<span class="prx-done muted" style="color:var(--muted)">Dismissed. The agent will not suggest this again.</span><button class="pill ghost sm prx-un">Undo</button>`; stagger([...f.children], 60); $('.prx-un', r).onclick = reset; };
  }
  bind(); c.later(400, () => conf(84));
});
/* ---------- Rewrite toolbar ---------- */
DM.def('rewrite-toolbar', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{spark}', I('spark','xs')).replace('{at}', I('wand','xs'));
  const S = [
    ['Welcome to DesignMe, a place where you and your team can work together with an agent on all of your design files in one place.', { clear:'DesignMe is where your team and an agent design together.', short:'Design with your team and an agent.', warm:'Welcome in. This is where you, your team and your agent make things together.' }],
    ['To get started you will need to connect Figma, which can be done from the settings page at any time.', { clear:'Connect Figma in Settings to get started.', short:'First, connect Figma.', warm:'Start by connecting Figma. It takes about a minute.' }],
    ['After that, the agent will be able to read your frames and suggest improvements.', { clear:'Then the agent can read your frames and suggest fixes.', short:'Then the agent reviews your frames.', warm:'Then your agent can look through your frames and help polish them.' }]
  ];
  const doc = $('.rwx-doc', r), tb = $('.rwx-tb', r), st = $('.rwx-st', r), box = $('.rwx', r);
  doc.innerHTML = S.map((s, i) => `<span class="rwx-s" data-i="${i}">${s[0]}</span>`).join(' ');
  const tbHTML = tb.innerHTML; let sel = null, busy = false;
  // shorter before a rewrite than during one, it stays centred in the room its stage keeps for it
  centre(c, box, () => box.offsetHeight);
  function place(el){
    const br = box.getBoundingClientRect(), rects = el.getClientRects(), f = rects[0];
    if (!f) return; // the card is hidden (far off screen, or the other set is showing): nothing to place against
    const w = tb.offsetWidth; let x = f.left - br.left; x = Math.max(8, Math.min(x, br.width - w - 8));
    // above the sentence, unless that would cover the header: then under its last line
    let y = f.top - br.top - tb.offsetHeight - 8; if (y < $('.rwx-h', r).getBoundingClientRect().bottom - br.top) y = rects[rects.length - 1].bottom - br.top + 8;
    tb.style.left = x + 'px'; tb.style.top = y + 'px';
  }
  // hidden, the toolbar takes no focus
  function hide(){ tb.classList.remove('show'); tb.inert = true; }
  tb.inert = true;
  function bindTb(){ $$('.rwx-b[data-k]', tb).forEach(b => b.onclick = () => rewrite(b.dataset.k)); const a = $('.rwx-b.ic', tb); if (a) a.onclick = () => rewrite('clear'); }
  function select(el){
    if (busy) return; $$('.rwx-s', doc).forEach(x => x.classList.toggle('sel', x === el)); sel = el;
    tb.classList.remove('act'); tb.innerHTML = tbHTML; bindTb(); place(el); tb.inert = false; tb.classList.add('show'); swap(st, 'Pick a rewrite');
  }
  $$('.rwx-s', doc).forEach(el => el.onclick = e => { e.stopPropagation(); if (!el.querySelector('ins')) select(el); });
  c.on(document, 'pointerdown', e => { if (!busy && !r.contains(e.target)) { hide(); $$('.rwx-s', doc).forEach(x => x.classList.remove('sel')); } });
  function rewrite(k){
    const el = sel, i = +el.dataset.i, old = S[i][0], nw = S[i][1][k]; busy = true;
    tb.classList.add('act'); tb.innerHTML = `<span class="lbl"><span class="think on"><i></i><i></i><i></i><i></i></span>Rewriting</span>`; place(el);
    c.run(async () => {
      el.innerHTML = `<del>${old}</del> <ins>${nw.split(' ').map(w => `<span class="w">${w} </span>`).join('')}</ins>`; place(el); await c.wait(350);
      for (const w of $$('ins .w', el)){ w.classList.add('on'); await c.wait(55); }
      tb.innerHTML = `<span class="lbl">${I('check','xs')}Rewritten</span><button class="rwx-b rwx-un">Undo</button><button class="pill accent sm rwx-ok">Accept</button>`; place(el);
      // keeping a shorter sentence lets the doc fit its text, with no empty room above or below it
      $('.rwx-ok', tb).onclick = () => { el.textContent = nw; S[i][0] = nw; el.classList.remove('sel'); hide(); busy = false; swap(st, 'Saved'); };
      $('.rwx-un', tb).onclick = () => { el.textContent = old; el.classList.remove('sel'); hide(); busy = false; swap(st, 'Click a sentence'); };
    });
  }
  bindTb();
  // the preview plays it once on its own after the entrance: pick a sentence, make it clearer, keep it. A click of yours takes over
  c.run(async () => {
    await c.step(1300); if (sel) return; select($$('.rwx-s', doc)[0]);
    await c.step(1200); const b = $('.rwx-b[data-k="clear"]', tb); if (busy || !b) return;
    b.classList.add('hl'); c.taken(() => b.classList.remove('hl')); await c.step(240); b.classList.remove('hl'); rewrite('clear');
    await c.step(2600); const ok = $('.rwx-ok', tb); if (!ok) return;
    ok.classList.add('hl'); c.taken(() => ok.classList.remove('hl')); await c.step(240); ok.click();
  });
});
/* ---------- Design tuner ---------- */
DM.def('design-tuner', (r, c) => {
  r.innerHTML = r.innerHTML.replace(/\{c\}/g, I('check','xs')).replace('{wand}', I('wand','xs'));
  const card = $('.dtx-card', r), rows = $('.dtx-rows', r), st = $('.dtx-st', r), go = $('.dtx-go', r);
  const P = [
    { k:'rad', n:'Radius', min:0, max:28, v:16, u:'px', t:20 },
    { k:'pad', n:'Padding', min:8, max:32, v:18, u:'px', t:24 },
    { k:'gap', n:'Spacing', min:4, max:24, v:12, u:'px', t:14 },
    { k:'sh', n:'Shadow', min:0, max:.2, v:.08, u:'', t:.05, f:2 }
  ];
  rows.innerHTML = P.map(p => `<div class="dtx-r" data-k="${p.k}"><span>${p.n}</span><div class="dtx-sl" role="slider" tabindex="0" aria-label="${p.n}" aria-valuemin="${p.min}" aria-valuemax="${p.max}"><span class="f"></span><span class="k"></span></div><span class="v num"></span></div>`).join('');
  function set(p, v){ p.v = Math.max(p.min, Math.min(p.max, v)); const pc = (p.v - p.min) / (p.max - p.min) * 100; const row = $(`[data-k="${p.k}"]`, rows);
    $('.f', row).style.width = pc + '%'; $('.k', row).style.left = pc + '%'; $('.v', row).textContent = p.f ? p.v.toFixed(p.f) : Math.round(p.v) + p.u;
    card.style.setProperty('--' + p.k, p.f ? p.v : Math.round(p.v) + 'px'); $('.dtx-sl', row).setAttribute('aria-valuenow', p.f ? p.v.toFixed(p.f) : Math.round(p.v)); }
  P.forEach(p => {
    set(p, p.v); const sl = $(`[data-k="${p.k}"] .dtx-sl`, rows);
    const at = e => { const b = sl.getBoundingClientRect(); set(p, p.min + (p.max - p.min) * Math.max(0, Math.min(1, (e.clientX - b.left) / b.width))); };
    sl.onpointerdown = e => { sl.setPointerCapture(e.pointerId); sl.classList.add('drag'); at(e); swap(st, 'Edited by you'); sl.onpointermove = at; };
    sl.onpointerup = sl.onpointercancel = () => { sl.classList.remove('drag'); sl.onpointermove = null; };
    sl.onkeydown = e => { const k = { ArrowRight:1, ArrowUp:1, ArrowLeft:-1, ArrowDown:-1 }[e.key]; if (!k) return; e.preventDefault(); set(p, p.v + k * (p.f ? .01 : 1)); swap(st, 'Edited by you'); };
  });
  let note;
  go.onclick = () => c.run(async () => {
    go.classList.add('busy'); go.innerHTML = '<span class="think on"><i></i><i></i><i></i><i></i></span>Tuning'; swap(st, 'Agent is tuning'); if (note) note.remove();
    for (const p of P){ const row = $(`[data-k="${p.k}"]`, rows); row.classList.add('hot'); await tween(p.v, p.t, 650, x => set(p, x)); await c.wait(120); row.classList.remove('hot'); }
    note = html('<div class="dtx-note">Matched the 4px grid and your card tokens. Softer shadow so the CTA leads.</div>'); go.before(note); enter(note);
    go.classList.remove('busy'); go.innerHTML = I('wand','xs') + 'Tune again'; swap(st, 'Tuned by agent');
    P.forEach(p => { const o = p.t; p.t = p.k === 'rad' ? (o === 20 ? 12 : 20) : p.k === 'pad' ? (o === 24 ? 20 : 24) : p.k === 'gap' ? (o === 14 ? 10 : 14) : (o === .05 ? .1 : .05); });
  });
  // the preview lets the agent tune once on its own, unless you reach for a slider or the button first
  c.auto(1600, () => go.click());
});
/* ---------- Permission gate ---------- */
DM.def('permission-gate', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{figma}', I('figma')).replace(/\{chk\}/g, I('check','xs')).replace('{chev}', I('chev-d','xs'));
  const root = $('.pgx', r), ok = $('.pgx-ok', r), no = $('.pgx-no', r), sc = $('.pgx-sc', r), title = $('.pgx-ht b', r), sub = $('.pgx-ht .muted', r);
  const first = { sc:sc.innerHTML, title:title.textContent, sub:sub.textContent, no:no.textContent };
  const boxes = () => $$('.pgx-o input', sc);
  // how long: This task, Today or Always, from the dropdown in the footer
  let dur = 'This task';
  const span = () => dur === 'Always' ? 'always' : 'for ' + dur.toLowerCase();
  const count = () => { const n = boxes().filter(b => b.checked).length; ok.disabled = !n; swap(ok, n ? 'Allow ' + n + (n > 1 ? ' scopes' : ' scope') : 'Pick a scope'); };
  c.on(sc, 'change', count);
  $$('.pgx-pop .mi', r).forEach(m => m.addEventListener('click', () => { dur = m.dataset.v; $$('.pgx-pop .mi', r).forEach(x => x.setAttribute('aria-checked', x === m)); swap($('.pgx-dv', r), dur === 'Always' ? 'Always' : 'For ' + dur.toLowerCase()); }));
  const body = [sc, $('.pgx-f', r)];
  // the scopes give way to a shorter result row: on the card it keeps the height it had and centres the row (hold)
  const show = on => { if (!on && c.card && !root.classList.contains('held')) hold(root); body.forEach(e => e.hidden = !on); if (on) stagger(body, 50); };
  // the frames the agent edits once it may. Plan toggle is a library component, so editing it needs Publish library
  const F = ['Hero', 'Plan cards', 'Compare table', 'FAQ', 'Plan toggle', 'Checkout summary'], LIB = 4;
  const clock = s => Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  // the clock counts the agent's working time only, not the time it waits for you
  let granted = 0, publish = false, skip = false, done = 0, ms = 0, run = 0, panel = null;
  function row(){
    panel = html(`<div class="pgx-done run"><span class="g"><span class="spin"></span></span><span class="t"><b class="pgx-a"></b><span class="pgx-d"></span></span><span class="pgx-tm num"></span><button class="pill ghost sm">Revoke</button></div>`);
    root.appendChild(panel); enter(panel); $('button', panel).onclick = revoke;
  }
  // the agent works through the frames under what it was given, and stops to ask when it reaches one it may not touch
  function work(){
    const id = ++run; if (!panel) row();
    const a = $('.pgx-a', panel), d = $('.pgx-d', panel), tm = $('.pgx-tm', panel);
    swap(a, `Allowed ${granted} ${granted > 1 ? 'scopes' : 'scope'} ${span()}`);
    const t0 = performance.now(), now = () => ms + performance.now() - t0;
    tm.textContent = clock(Math.floor(ms / 1000));
    c.run(async () => {
      const tick = c.every(250, () => { if (run === id) tm.textContent = clock(Math.floor(now() / 1000)); });
      try {
        while (done < F.length){
          if (done === LIB && !publish && !skip) return ask();
          swap(d, done === LIB && skip ? `Skipping ${F[done]}` : `Editing ${F[done]} · ${done + 1} of ${F.length}`);
          await c.wait(900); if (run !== id) return;
          done++;
        }
        panel.classList.replace('run', 'ok'); const g = $('.g', panel); g.innerHTML = I('ok'); enter(g);
        swap(a, skip ? `Done. ${F.length - 1} frames edited` : `Done. ${F.length} frames edited`);
        swap(d, skip ? 'On a new page. Plan toggle skipped' : 'On a new page. Plan toggle published');
      } finally { clearInterval(tick); if (run === id) ms = now(); }
    });
  }
  // asks again, for only the scope it now needs
  function ask(){
    const p = panel; panel = null; p.classList.add('leave');
    root.classList.add('esc'); swap(title, 'Also allow Publish library?'); swap(sub, `${F[LIB]}, frame ${LIB + 1} of ${F.length}, is a library component`);
    c.later(300, () => {
      p.remove();
      sc.innerHTML = `<label class="pgx-o" data-k="publish"><input type="checkbox" checked><span class="bx">${I('check','xs')}</span><span class="t">Publish library<span class="d">Updates Checkout, Marketing site, Email kit and Docs</span></span><span class="tag warn">Risky</span></label>`;
      no.textContent = 'Skip this frame'; count(); show(true);
    });
  }
  function reset(){
    run++; granted = done = ms = 0; publish = skip = false;
    root.classList.remove('esc'); sc.innerHTML = first.sc; swap(title, first.title); swap(sub, first.sub); no.textContent = first.no; count();
  }
  function revoke(){ const p = panel; panel = null; run++; p.classList.add('leave'); c.later(300, () => { p.remove(); release(root); reset(); show(true); }); }
  ok.onclick = () => c.run(async () => {
    const picked = boxes().filter(b => b.checked); if (!picked.length) return;
    granted += picked.length; if (picked.some(b => b.closest('.pgx-o').dataset.k === 'publish')) publish = true;
    ok.innerHTML = '<span class="spin"></span>'; await c.wait(500);
    show(false);
    if (root.classList.contains('esc')){ root.classList.remove('esc'); swap(title, first.title); swap(sub, first.sub); }
    // placed inside another component (Agent harness), it reports back without the run
    if (!c.card){ row(); swap($('.pgx-a', panel), `Allowed ${granted} ${granted > 1 ? 'scopes' : 'scope'} ${span()}`); swap($('.pgx-d', panel), 'Applying the pricing fixes now'); $('.pgx-tm', panel).remove();
      c.later(1400, () => { if (!panel) return; panel.classList.replace('run', 'ok'); $('.g', panel).innerHTML = I('ok'); swap($('.pgx-d', panel), 'Done. 6 frames edited on a new page'); }); return; }
    work();
  });
  no.onclick = () => {
    if (root.classList.contains('esc')){ skip = true; show(false); root.classList.remove('esc'); swap(title, first.title); swap(sub, first.sub); work(); return; }
    show(false); const d = html(`<div class="pgx-done" style="background:var(--chip)">${I('info')}<span class="t">The agent will skip the Figma edits<span>It will list the fixes in chat instead</span></span><button class="pill ghost sm">Undo</button></div>`);
    root.appendChild(d); enter(d); $('button', d).onclick = () => { d.remove(); release(root); show(true); };
  };
  // the preview's story: hold back the risky scope, allow the rest, then grant it when the agent needs it for one frame
  c.story(async s => {
    await s.beat(3);
    const pub = $('[data-k="publish"]', sc);
    await s.tap(pub); await s.beat(1);
    await s.point($('.tag', pub)); await s.beat(3);
    await s.tap(pub); await s.beat(2);
    await s.tap(ok); s.away();
    await s.until(() => root.classList.contains('esc') && !sc.hidden);
    await s.beat(4);
    await s.tap(ok); s.away();
    await s.until(() => panel && panel.classList.contains('ok'));
  });
});
/* ---------- Hand-off to a person ---------- */
DM.def('human-handoff', (r, c) => {
  const IC = { user:I('user'), chev:I('chev-d','xs'), clock:I('clock'), link:I('link','xs'), edit:I('edit','xs') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  const root = $('.hox', r), rb = $('.hox-rb', r), av = $('.hox-av', r), wn = $('.hox-wn', r), wd = $('.hox-wd', r), pop = $('.hox-pop', r);
  const sla = $('.hox-sla', r), due = $('.hox-due', r), bar = $('.hox-bar', r), fill = $('.hox-bar i', r);
  const row = $('.hox-st', r), sa = $('.hox-sa', r), sb = $('.hox-sb', r), mb = $('.hox-mb', r), ed = $('.hox-ed', r), no = $('.hox-no', r), ml = $('.hox-ml', r);
  // the billing team: someone free takes the conversation in a few seconds, someone in a call takes longer, and someone
  // who is out never does
  const P = [
    { k:'alex', n:'Alex Rivera', i:'AR', bg:'var(--av-m)', on:'Available', tone:'ok', wait:2500 },
    { k:'sam', n:'Sam Ortiz', i:'SO', bg:'var(--av-p)', on:'In a call', tone:'', wait:6000 },
    { k:'maya', n:'Maya Chen', i:'MC', bg:'var(--av-l)', on:'Out until 2pm', tone:'warn' }
  ];
  const first = p => p.n.split(' ')[0];
  pop.insertAdjacentHTML('beforeend', P.map(p => `<button class="mi" role="menuitemradio" aria-checked="false" data-close data-k="${p.k}">${AV(p.i, p.bg)}<span>${p.n}<span class="d">Billing · ${p.on}</span></span><span class="ck">${I('check','xs')}</span></button>`).join(''));
  // when the reply is due: 15 minutes from the hand-off, counting down by the second; amber under five minutes
  const TARGET = 900;
  let left = 846;
  const showDue = () => {
    const m = Math.floor(left / 60);
    due.textContent = left <= 0 ? 'Reply overdue' : m < 1 ? 'Reply due in under a minute' : `Reply due in ${m} min`;
    sla.classList.toggle('warn', left > 0 && left < 300); sla.classList.toggle('bad', left <= 0);
    fill.style.width = Math.max(0, left / TARGET * 100) + '%'; bar.setAttribute('aria-valuenow', Math.max(0, left));
  };
  showDue(); c.every(1000, () => { left--; showDue(); });
  // the row at the foot says where it stands
  const state = (tone, glyph, a, b) => { row.className = 'hox-st' + (tone ? ' ' + tone : ''); $('.g', row).innerHTML = glyph; swap(sa, a); swap(sb, b); };
  let who = null, run = 0, phase = 'finding';
  function assign(p){
    const id = ++run; who = p; phase = 'waiting';
    av.innerHTML = AV(p.i, p.bg); enter(av.firstElementChild);
    swap(wn, p.n); wd.className = 'hox-wd'; wd.innerHTML = '<span>Billing</span>';
    $$('.mi', pop).forEach(m => m.setAttribute('aria-checked', m.dataset.k === p.k)); rb.disabled = false;
    state('', '<span class="spin"></span>', `Waiting for ${first(p)} to accept`, 'The agent has stopped replying to Dana');
    // their status comes back a moment later
    c.later(1600, () => {
      if (id !== run) return;
      wd.className = 'hox-wd' + (p.tone ? ' ' + p.tone : ''); wd.innerHTML = `<span class="dot"></span><span>Billing · ${p.on}</span>`; enter(wd);
      if (!p.wait){ phase = 'away'; state('warn', I('alert'), `${first(p)} is out until 2pm`, 'The reply is due before then. Reassign it to someone who is free.'); return; }
      c.later(p.wait, () => {
        if (id !== run) return;
        phase = 'joined'; state('ok', AV(p.i, p.bg), `${first(p)} joined`, 'Reading the conversation');
        c.later(1800, () => { if (id !== run) return; phase = 'with'; state('ok', AV(p.i, p.bg), `With ${first(p)} · agent paused`, `The agent won't reply while ${first(p)} has it`); });
      });
    });
  }
  $$('.mi', pop).forEach(m => m.addEventListener('click', () => { const p = P.find(x => x.k === m.dataset.k); if (p !== who) assign(p); }));
  // the preview hands it to Maya once on its own, unless you have picked someone first
  c.auto(1500, () => assign(P[2]));
  // what the customer was told can be corrected in place
  let said = mb.textContent, editing = false;
  const edit = on => {
    editing = on; mb.contentEditable = on ? 'true' : 'false'; mb.setAttribute('aria-readonly', !on); no.hidden = !on;
    ed.className = 'pill sm hox-ed ' + (on ? 'primary' : 'ghost'); ed.innerHTML = on ? 'Save' : I('edit','xs') + 'Edit';
    if (on){ mb.focus(); const s = getSelection(); s.selectAllChildren(mb); s.collapseToEnd(); }
  };
  ed.onclick = () => {
    if (!editing) return edit(true);
    const t = mb.textContent.trim();
    if (t && t !== said){ said = t; swap(ml, 'Sent to Dana · edited'); } else mb.textContent = said;
    edit(false);
  };
  no.onclick = () => { mb.textContent = said; edit(false); };
  // the preview's story: Maya is assigned but is out, so the person reassigns it to Alex, who takes it
  c.story(async s => {
    await s.until(() => phase === 'away'); await s.beat(4);
    await s.tap(rb); await s.beat(2);
    await s.point($('.mi[data-k="sam"]', pop), false); await s.beat(1);
    await s.tap($('.mi[data-k="alex"]', pop)); s.away();
    await s.until(() => phase === 'with'); await s.beat(6);
  });
});
/* ---------- Launch checklist ---------- */
DM.def('launch-checklist', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{play}', I('play','xs'));
  const C = [
    ['Contrast meets AA', null, 'All 14 text pairs pass'],
    ['Uses library tokens', '3 raw hex values in the FAQ', 'Swapped to color.text.muted'],
    ['Responsive at 375px', null, 'No overflow on 3 breakpoints'],
    ['Alt text on images', '2 icons have no label', 'Added labels from the layer names'],
    ['Links resolve', null, '12 of 12 links return 200'],
    ['Copy matches the brief', null, 'Prices and plan names match']
  ];
  const list = $('.lcx-list', r), bar = $('.lcx-bar', r), st = $('.lcx-st', r), run = $('.lcx-run', r);
  bar.innerHTML = C.map(() => '<i></i>').join(''); const segs = $$('i', bar);
  list.innerHTML = C.map(x => `<div class="lcx-r wait"><span class="g"><span class="lcx-ring"></span></span><span class="t">${x[0]}<span class="d"></span></span></div>`).join('');
  const rows = $$('.lcx-r', list);
  const G = { ok:`<span style="color:var(--ok)">${I('ok')}</span>`, bad:`<span style="color:var(--bad)">${I('alert')}</span>`, run:'<span class="spin"></span>' };
  function set(i, s, note){ const rw = rows[i]; rw.className = 'lcx-r ' + s; const g = $('.g', rw); g.innerHTML = G[s]; enter(g); swap($('.d', rw), note || ''); segs[i].className = s === 'run' ? 'run' : s; }
  function tally(){ const bad = rows.filter(x => x.classList.contains('bad')).length; swap(st, bad ? bad + ' to fix before shipping' : 'All clear, ready to ship'); if (!bad){ run.innerHTML = I('rocket','xs') + 'Ship it'; run.className = 'pill accent sm lcx-run'; run.onclick = () => { swap(st, 'Shipped to production'); run.disabled = true; }; } }
  run.onclick = () => c.run(async () => {
    run.disabled = true; swap(st, 'Checking');
    for (let i = 0; i < C.length; i++){
      set(i, 'run', 'Checking'); await c.wait(520 + Math.random() * 300);
      if (C[i][1]){ set(i, 'bad', C[i][1]); const f = html(`<button class="pill soft sm">${I('wand','xs')}Fix</button>`); rows[i].appendChild(f); enter(f);
        f.onclick = () => c.run(async () => { f.remove(); set(i, 'run', 'Fixing'); await c.wait(900); set(i, 'ok', C[i][2]); tally(); });
      } else set(i, 'ok', C[i][2]);
    }
    run.disabled = false; run.innerHTML = I('refresh','xs') + 'Run again'; tally();
    if (rows.some(x => x.classList.contains('bad'))) run.onclick = () => DM.mount(r.closest('.comp'));
  });
  // the preview runs the checks once on its own after the entrance; the fixes are left for you
  c.auto(1300, () => { if (!run.disabled) run.click(); });
});
/* ---------- Plan review ---------- */
DM.def('plan-review', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{plus}', I('plus','xs'));
  // each step, and the line it reports when it's done
  const S = [
    ['Read the pricing frames and the brand tokens', '6 frames and 42 tokens read'],
    ['Compare against the three competitor pages', '3 pages compared'],
    ['Simplify the plan cards to one CTA each', 'Plan cards now have one CTA each'],
    ['Move the FAQ below the comparison table', 'FAQ now sits under the table'],
    ['Write a summary of every change', 'Summary added to Pricing v4']
  ];
  const list = $('.plx-list', r), st = $('.plx-st', r), tm = $('.plx-tm', r), go = $('.plx-go', r), f = $('.plx-f', r);
  const row = (t, i) => `<li class="plx-s"><span class="n">${i + 1}</span><span class="b"><span class="t" contenteditable="true" spellcheck="false" role="textbox" aria-label="Step ${i + 1}">${t[0]}</span><span class="d"><span></span></span></span><button class="ib plx-x" aria-label="Skip step" data-tip="Skip step">${I('x','xs')}</button></li>`;
  list.innerHTML = S.map(row).join(''); stagger($$('.plx-s', list), 60, 100);
  const count = () => { const on = $$('.plx-s:not(.off)', list); on.forEach((s, i) => $('.n', s).textContent = i + 1); $$('.plx-s.off .n', list).forEach(n => n.textContent = '–'); swap(st, on.length + ' steps, about ' + Math.max(1, Math.round(on.length * .8)) + ' min'); };
  function bind(s, done){
    const t = $('.t', s), orig = t.textContent; s._done = done || 'Done';
    t.onkeydown = e => { if (e.key === 'Enter'){ e.preventDefault(); t.blur(); } };
    t.onblur = () => { const ed = t.textContent.trim() !== orig; s.classList.toggle('edited', ed); if (ed) s._done = 'Done as you wrote it'; };
    $('.plx-x', s).onclick = () => { const off = s.classList.toggle('off'); $('.plx-x', s).dataset.tip = off ? 'Include step' : 'Skip step'; $('.plx-x', s).setAttribute('aria-label', off ? 'Include step' : 'Skip step'); $('.plx-x', s).innerHTML = I(off ? 'undo' : 'x', 'xs'); count(); };
  }
  $$('.plx-s', list).forEach((s, i) => bind(s, S[i][1]));
  $('.plx-add', r).onclick = () => { const s = html(row(['New step'], $$('.plx-s', list).length)); list.appendChild(s); enter(s); bind(s); count(); const t = $('.t', s); t.focus({ preventScroll:true }); document.getSelection().selectAllChildren(t); };
  $('.plx-chg', r).onclick = () => { swap($('.plx-n', r), 'Tell the agent what to change in chat'); };
  const clock = ms => { const s = Math.floor(ms / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  const note = (s, text, tone) => { const d = $('.d', s); d.className = 'd on' + (tone ? ' ' + tone : ''); swap(d.firstElementChild, text); };
  go.onclick = () => c.run(async () => {
    $$('.t', list).forEach(t => { t.contentEditable = 'false'; t.removeAttribute('role'); }); $('.plx-add', r).hidden = true;
    // the approved plan is fixed: the skip buttons keep their space but can't be used
    $$('.plx-x', list).forEach(b => { b.disabled = true; b.style.visibility = 'hidden'; });
    f.innerHTML = `<span class="muted plx-n">Running the approved plan</span><button class="pill ghost sm plx-stop">${I('stop','xs')}Stop</button>`; stagger([...f.children], 50);
    let stop = false; $('.plx-stop', f).onclick = () => stop = true;
    $('.plx-mk', r).classList.add('on');
    const t0 = performance.now(), tick = c.every(250, () => tm.textContent = clock(performance.now() - t0)); tm.textContent = '0:00'; enter(tm);
    const on = $$('.plx-s:not(.off)', list), n = s => $('.n', s), txt = s => $('.t', s);
    try {
      for (let i = 0; i < on.length && !stop; i++){
        const s = on[i]; s.classList.add('run'); txt(s).classList.add('shim'); n(s).innerHTML = '<span class="spin"></span>'; swap(st, 'Step ' + (i + 1) + ' of ' + on.length); await c.wait(900);
        // the second step hits a rate limit: the agent waits it out, counting down, and tries again
        if (s === $$('.plx-s', list)[1] && !stop){
          s.classList.replace('run', 'retry'); txt(s).classList.remove('shim'); n(s).innerHTML = I('clock','xs');
          for (let k = 3; k > 0 && !stop; k--){ note(s, `Rate limited by the browser tool. Retrying in ${k}s`, 'warn'); await c.wait(1000); }
          if (stop) break;
          s.classList.replace('retry', 'run'); txt(s).classList.add('shim'); n(s).innerHTML = '<span class="spin"></span>'; note(s, 'Retrying'); await c.wait(700);
          s._done += ', after 1 retry';
        }
        s.classList.remove('run'); txt(s).classList.remove('shim'); s.classList.add('done'); n(s).innerHTML = I('check','xs'); enter(n(s).firstElementChild); note(s, s._done);
      }
    } finally { clearInterval(tick); }
    $('.plx-mk', r).classList.remove('on');
    $$('.plx-s.run', list).forEach(s => { s.classList.remove('run', 'retry'); txt(s).classList.remove('shim'); n(s).textContent = '–'; note(s, 'Not started'); });
    swap(st, stop ? 'Stopped, progress kept' : 'Done in ' + clock(performance.now() - t0) + '. 4 frames updated'); f.innerHTML = `<span class="muted plx-n"></span><button class="pill soft sm">${I('eye','xs')}See changes</button>`; enter(f.lastElementChild);
  });
  // the preview's story: rewrite a step, approve, and watch the agent work through a rate limit to the end
  c.story(async s => {
    await s.beat(3);
    const step = $$('.plx-s', list)[2], t = $('.t', step);
    // the demo types into the step without taking the focus: a caret would make the page follow it
    await s.tap(t); await s.beat(1);
    for (const ch of ' each'){ t.textContent = t.textContent.slice(0, -1); await s.beat(.12); }
    for (const ch of ', annual price first'){ t.textContent += ch; await s.beat(.09); }
    await s.beat(1); t.onblur(); await s.beat(2);
    await s.tap(go); s.away();
    await s.until(() => $('.plx-f .pill.soft', r));
  });
});
/* ---------- Change review ---------- */
DM.def('change-review', (r, c) => {
  const F = [
    { n:'PricingCard.tsx', h:[ { t:'Use the shared button', l:[['ctx',14,'  return ('],['del',15,'    <button className="cta-old">'],['add',15,'    <Button variant="primary">'],['ctx',16,'      {plan.cta}']] }, { t:'Drop the second CTA', l:[['del',22,'    <a href="/contact">Talk to sales</a>'],['ctx',22,'  </Card>']] } ] },
    { n:'tokens.css', h:[ { t:'Raise muted text contrast', l:[['ctx',8,':root {'],['del',9,'  --text-muted: #c9cfd8;'],['add',9,'  --text-muted: #5b6472;'],['ctx',10,'  --radius-card: 16px;']] } ] },
    { n:'pricing.mdx', h:[ { t:'Move the FAQ below the table', l:[['del',31,'<FAQ />'],['ctx',31,'<CompareTable />'],['add',32,'<FAQ />']] } ] }
  ];
  const files = $('.crx-files', r), diff = $('.crx-diff', r), fn = $('.crx-fn', r);
  let add = 0, del = 0; F.forEach(f => f.h.forEach(h => h.l.forEach(l => { if (l[0] === 'add') add++; if (l[0] === 'del') del++; h.s = h.s || ''; })));
  $('.crx-tot', r).innerHTML = `<span style="color:var(--ok)">+${add}</span> <span style="color:var(--bad)">−${del}</span>`;
  files.innerHTML = F.map((f, i) => `<button class="crx-f" data-i="${i}"><span class="ft ${f.n.endsWith('tsx') ? 're' : ''}">${f.n.split('.').pop().toUpperCase()}</span><span class="nm">${f.n}</span><span class="st"><span class="dot"></span></span></button>`).join('');
  let cur = 0;
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;');
  function fileState(i){ const hs = F[i].h, b = $$('.crx-f', files)[i]; const all = s => hs.every(h => h.s === s); b.classList.toggle('kept', all('kept')); b.classList.toggle('undone', all('undone')); $('.st', b).innerHTML = all('kept') ? I('check','xs') : all('undone') ? I('undo','xs') : hs.some(h => h.s) ? '<span class="dot" style="color:var(--accent-mark,var(--accent))"></span>' : '<span class="dot"></span>'; }
  function show(i, quiet){
    cur = i; $$('.crx-f', files).forEach((b, j) => b.classList.toggle('on', j === i)); swap(fn, 'src/' + F[i].n);
    diff.innerHTML = F[i].h.map((h, k) => `<div class="crx-hk ${h.s}" data-k="${k}"><div class="crx-hh">${I('spark','xs')}<span>${h.t}</span><span class="sp"></span><button class="pill ghost hk-u" aria-pressed="${h.s === 'undone'}">Undo</button><button class="pill hk-k" aria-pressed="${h.s === 'kept'}">Keep</button></div>${h.l.map(l => `<div class="crx-l ${l[0]}"><span class="ln">${l[1]}</span><span class="c">${esc(l[2])}</span><button class="cm" aria-label="Comment on line" data-tip="Comment">${I('plus','xs')}</button></div>`).join('')}</div>`).join('');
    if (!quiet) stagger($$('.crx-hk', diff), 70);
    $$('.crx-hk', diff).forEach(hk => { const h = F[i].h[+hk.dataset.k];
      const setS = s => { h.s = h.s === s ? '' : s; hk.className = 'crx-hk ' + h.s; $('.hk-k', hk).setAttribute('aria-pressed', String(h.s === 'kept')); $('.hk-u', hk).setAttribute('aria-pressed', String(h.s === 'undone')); fileState(i); };
      $('.hk-k', hk).onclick = () => setS('kept'); $('.hk-u', hk).onclick = () => setS('undone');
      $$('.cm', hk).forEach(b => b.onclick = () => { const ln = b.closest('.crx-l'); if (ln.nextElementSibling?.classList.contains('crx-cmt')) return;
        const box = html(`<div class="crx-cmt"><input placeholder="Ask the agent about this line"><button class="pill accent sm">Send</button></div>`); ln.after(box); enter(box); const inp = $('input', box); inp.focus({ preventScroll:true });
        const send = () => { const v = inp.value.trim() || 'Why this change?'; box.className = 'crx-cmt sent'; box.innerHTML = `${I('at','xs')}<span>${esc(v)}</span>`; enter(box); };
        $('button', box).onclick = send; inp.onkeydown = e => { if (e.key === 'Enter') send(); if (e.key === 'Escape') box.remove(); }; });
    });
  }
  $$('.crx-f', files).forEach(b => b.onclick = () => show(+b.dataset.i));
  const bulk = s => { F[cur].h.forEach(h => h.s = s); fileState(cur); show(cur); if (s === 'kept' && cur < F.length - 1) c.later(500, () => show(cur + 1)); };
  $('.crx-ok', r).onclick = () => bulk('kept'); $('.crx-rej', r).onclick = () => bulk('undone');
  F.forEach((_, i) => fileState(i)); show(0, true);
});
/* ---------- Inline text diff ---------- */
DM.def('inline-text-diff', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{chk}', I('check','xs')).replace('{x}', I('x','xs')).replace('{warn}', I('alert','xs'));
  // the copy, and the agent's edits to it: what it said, what the agent suggests, and why, when the agent isn't sure
  const T = [{ o:'Pick', n:'Choose' }, ' a plan that ', { o:'fits your team', n:'grows with your studio' }, '. Every plan ', { o:'includes', n:'comes with' }, ' unlimited projects, and ', { o:'you can cancel at any time', n:'your first month is free', why:'Not in the pricing brief: there is no free month' }, '.'];
  const E = T.filter(x => typeof x === 'object');
  const root = $('.itd', r), tx = $('.itd-t', r), st = $('.itd-st', r), bar = $('.itd-bar', r), why = $('.itd-why', r), f = $('.itd-f', r), acts = $('.itd-a', r);
  tx.innerHTML = T.map(x => typeof x === 'string' ? x : `<span class="itd-c${x.why ? ' unsure' : ''}" role="button" tabindex="0" aria-haspopup="dialog" aria-expanded="false"><del>${x.o}</del><ins>${x.n}</ins></span>`).join('');
  const chunks = $$('.itd-c', tx);
  E.forEach((e, i) => { e.s = ''; chunks[i].setAttribute('aria-label', `Edit ${i + 1} of ${E.length}: ${e.o}, suggested ${e.n}`); });
  let cur = -1;
  function tally(){
    const n = E.filter(e => !e.s).length, a = E.filter(e => e.s === 'acc').length;
    swap(st, n === E.length ? `${n} edits to review` : n ? `${n} of ${E.length} left` : `${a} accepted, ${E.length - a} rejected`);
    if (!n && !f.textContent){ acts.hidden = true; f.innerHTML = `${I('ok','xs')}<span>Saved to Pricing v4</span>`; enter(f); }
  }
  const close = () => { bar.classList.remove('open'); bar.inert = true; chunks.forEach(x => { x.classList.remove('on'); x.setAttribute('aria-expanded', false); }); cur = -1; };
  // the toolbar opens under the edit's last line; inside a scaled preview the offsets are divided by its scale
  function open(i){
    cur = i; const el = chunks[i], e = E[i];
    chunks.forEach((x, k) => { x.classList.toggle('on', k === i); x.setAttribute('aria-expanded', k === i); });
    why.hidden = !e.why; $('span', why).textContent = e.why || '';
    const rb = root.getBoundingClientRect(), k = rb.width / root.offsetWidth || 1, rs = el.getClientRects(), cr = rs[rs.length - 1] || el.getBoundingClientRect();
    bar.inert = false; bar.classList.add('open');
    bar.style.left = Math.max(12, Math.min((cr.left - rb.left) / k, root.offsetWidth - bar.offsetWidth - 12)) + 'px';
    bar.style.top = ((cr.bottom - rb.top) / k + 6) + 'px';
  }
  // each decision folds an edit into plain text, and the last swaps the actions for a short note: from the first one the
  // card keeps the height it had with every edit open, and centres what is left in it (hold)
  function decide(i, s){ if (!root.classList.contains('held')) hold(root); E[i].s = s; chunks[i].classList.remove('acc', 'rej'); chunks[i].classList.add(s); tally(); }
  // a click anywhere else on the page can close the toolbar between the story's taps, and then there is no edit to decide
  const pick = s => { const i = cur; if (i < 0) return; const back = bar.contains(document.activeElement); close(); decide(i, s); if (back) chunks[i].focus({ preventScroll:true }); };
  // Enter or Space opens an edit's toolbar with the focus on Accept, as a dialog takes the focus; Escape brings it back
  chunks.forEach((el, i) => { el.onclick = () => cur === i ? close() : open(i); el.onkeydown = ev => { if (ev.key === 'Enter' || ev.key === ' '){ ev.preventDefault(); el.click(); if (cur === i) $('.itd-acc', r).focus({ preventScroll:true }); } }; });
  // the left and right arrows move between Accept and Reject
  c.on(bar, 'keydown', ev => { const bs = $$('button', bar), j = bs.indexOf(document.activeElement), d = { ArrowRight:1, ArrowDown:1, ArrowLeft:-1, ArrowUp:-1 }[ev.key];
    if (j < 0) return; const to = d ? bs[(j + d + bs.length) % bs.length] : ev.key === 'Home' ? bs[0] : ev.key === 'End' ? bs[bs.length - 1] : null;
    if (to){ ev.preventDefault(); to.focus({ preventScroll:true }); } });
  $('.itd-acc', r).onclick = () => pick('acc');
  $('.itd-rej', r).onclick = () => pick('rej');
  $('.itd-ok', r).onclick = () => { close(); E.forEach((e, i) => { if (!e.s) decide(i, 'acc'); }); };
  $('.itd-no', r).onclick = () => { close(); E.forEach((e, i) => { if (!e.s) decide(i, 'rej'); }); };
  // Escape or a click elsewhere closes the toolbar
  c.on(r, 'keydown', ev => { if (ev.key === 'Escape' && cur >= 0){ const el = chunks[cur]; close(); el.focus({ preventScroll:true }); } });
  c.on(document, 'pointerdown', ev => { if (cur >= 0 && !bar.contains(ev.target) && !ev.target.closest('.itd-c')) close(); });
  bar.inert = true; tally();
  // the preview's story: accept two edits, read why the agent isn't sure of one and reject it, then accept the rest
  c.story(async s => {
    await s.beat(4);
    await s.tap(chunks[0]); await s.beat(2); await s.tap($('.itd-acc', r)); await s.beat(1);
    await s.tap(chunks[1]); await s.beat(2); await s.tap($('.itd-acc', r)); await s.beat(1);
    await s.tap(chunks[3]); await s.beat(5); await s.tap($('.itd-rej', r)); await s.beat(3);
    await s.tap($('.itd-ok', r)); s.away();
    await s.beat(3);
  });
});
/* ---------- Draft review ---------- */
DM.def('draft-review', (r, c) => {
  const IC = { spark:I('spark'), warn:I('alert','xs'), clip:I('clip','xs'), send:I('send','xs'), chev:I('chev-d','xs'), chk:I('check','xs'), trash:I('trash','xs'), av:AV('MK','var(--av-l)') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  const root = $('.drf', r), go = $('.drf-go', r), dd = $('.drf-dd', r), att = $('.drf-att', r), wf = $('.drf-wf', r), when = $('.drf-when', r), f = $('.drf-f', r), tag = $('.drf-tag', r), body = $('.drf-b', r), fields = [$('.drf-fs', r), body, att];
  const items = $$('.drf-pop .mi', r);
  let at = 'now', file = false, done = null, run = 0;
  const label = () => (at === 'now' ? I('send','xs') + 'Send' : I('clock','xs') + 'Schedule');
  // when to send: now, or a set time from the menu beside the button
  items.forEach(m => m.addEventListener('click', () => { at = m.dataset.w; items.forEach(x => x.setAttribute('aria-checked', x === m)); go.innerHTML = label(); swap(when, at === 'now' ? '' : at); }));
  const warn = on => { wf.classList.toggle('shut', !on); wf.inert = !on; };
  warn(false);
  // the result of sending, scheduling or discarding takes the footer's place, with a white button to take it back
  function row(ic, t, sub, btn, fn, cls){
    f.hidden = true; root.classList.add('sent'); fields.forEach(e => e.inert = true); body.contentEditable = 'false';
    done = html(`<div class="drf-done ${cls || ''}">${ic}<span class="t">${t}<span class="muted drf-sub">${sub}</span></span>${btn ? `<button class="pill sm">${btn}</button>` : ''}</div>`);
    root.appendChild(done); enter(done); if (btn) $('button', done).onclick = fn; return done;
  }
  function back(){
    run++; if (done){ done.remove(); done = null; }
    f.hidden = false; root.classList.remove('sent'); fields.forEach(e => e.inert = false); body.contentEditable = 'true';
    go.disabled = dd.disabled = false; go.innerHTML = label(); swap(tag, 'Not sent'); tag.className = 'tag drf-tag';
  }
  function send(force){
    // the message talks about an attachment that isn't there: say so before it goes
    if (!force && !file && /attach/i.test(body.textContent)){ warn(true); return; }
    warn(false);
    const id = ++run;
    c.run(async () => {
      go.disabled = dd.disabled = true; go.innerHTML = `<span class="spin"></span>${at === 'now' ? 'Sending' : 'Scheduling'}`;
      await c.wait(900); if (id !== run) return;
      if (at !== 'now'){ row(I('clock'), `Scheduled for ${at.replace(/^\w/, ch => ch.toLowerCase())}`, 'To Maya Kim', 'Cancel', back, 'later'); swap(tag, 'Scheduled'); tag.className = 'tag b drf-tag'; return; }
      // a few seconds to take it back before it really goes
      const d = row(I('ok'), 'Sent to Maya Kim', 'You can undo for 5s', 'Undo', back), sub = $('.drf-sub', d);
      for (let k = 5; k > 0; k--){ sub.textContent = `You can undo for ${k}s`; await c.wait(1000); if (id !== run) return; }
      $('button', d).remove(); swap(sub, 'Delivered just now'); swap(tag, 'Sent'); tag.className = 'tag ok drf-tag';
    });
  }
  go.onclick = () => send(false);
  $('.drf-any', r).onclick = () => send(true);
  $('.drf-at', r).onclick = () => c.run(async () => {
    if (file) return; warn(false);
    const chip = html(`<span class="drf-file">${I('file','xs')}<span>Pricing v4 summary.pdf</span><span class="muted drf-fz"><span class="spin"></span></span></span>`);
    att.appendChild(chip); enter(chip);
    await c.wait(1200); $('.drf-fz', chip).textContent = '240 KB'; file = true;
  });
  $('.drf-x', r).onclick = () => { warn(false); row(I('trash','xs'), 'Draft discarded', 'Nothing was sent', 'Undo', back, 'bin'); };
  // the preview's story: send, get stopped by the missing attachment, attach it, send, and let the undo window pass
  c.story(async s => {
    await s.beat(3);
    await s.point(body, false); await s.beat(3);
    await s.tap(go); s.away();
    await s.until(() => !wf.classList.contains('shut')); await s.beat(5);
    await s.tap($('.drf-at', r)); s.away();
    await s.until(() => file); await s.beat(2);
    await s.tap(go); s.away();
    await s.until(() => done && !$('button', done));
  });
});
/* ---------- Steering ---------- */
DM.def('steering', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{up}', I('up','xs'));
  // the run: four steps on the pricing page. A card step paints its card in the current accent, and remembers which,
  // so a change of mind can find the cards that already have the old one
  const S = [
    { id:'read', t:'Read Pricing v4', d:'3 frames, 14 layers', s:'done' },
    { id:'pro', card:'Pro', t:'Update the Pro card', s:'run', ms:7500 },
    { id:'team', card:'Team', t:'Update the Team card', d:'Pricing v4, frame 3', s:'queued', ms:3500 },
    { id:'ship', t:'Export to staging', d:'designme.studio/pricing', s:'queued', ms:2500 }
  ];
  const steps = $('.ste-steps', r), log = $('.ste-log', r), box = $('.ste-box', r), inp = $('input', box), go = $('.ste-go', r), st = $('.ste-st', r), mode = $('.m', st), ck = $('.ck', st);
  let hue = 'violet', ended = false, running = false;
  const queue = [];
  const G = { run:'<span class="spin"></span>', done:I('ok','xs'), queued:'<span class="dot"></span>' };
  const doing = x => x.card ? `Setting the accent to ${hue}` : x.d;
  function row(x){
    x.el = html(`<li class="ste-s ${x.s}"><span class="ste-g">${G[x.s]}</span><span class="ste-t"><b>${x.t}</b><span>${x.s === 'run' ? doing(x) : x.d || 'Pricing v4, frame 2'}</span></span>${x.mine ? '<span class="tag b">From you</span>' : ''}</li>`);
    return x.el;
  }
  S.forEach(x => steps.appendChild(row(x)));
  function set(x, s, d){ x.s = s; x.el.className = 'ste-s ' + s; const g = $('.ste-g', x.el); g.innerHTML = G[s]; enter(g); if (d) swap($('.ste-t span', x.el), d); }
  const where = () => { const i = S.findIndex(x => x.s === 'run'); swap(mode, ended ? 'Done' : `Step ${i + 1} of ${S.length}`); };
  // the clock runs until the last step is done
  const t0 = performance.now(); let tEnd = 0;
  const clock = () => { const s = Math.floor(((tEnd || performance.now()) - t0) / 1000); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
  c.every(250, () => { ck.textContent = clock(); });
  // a message waits for the step in progress, then the agent takes it up before the next one
  const ready = () => { go.disabled = ended || !inp.value.trim(); };
  inp.oninput = ready;
  c.on(box, 'submit', e => {
    e.preventDefault(); const text = inp.value.trim(); if (!text || ended) return;
    inp.value = ''; ready();
    const m = html(`<div class="ste-me"><p></p><span class="ste-q"><span class="spin"></span>Applies after this step</span></div>`);
    $('p', m).textContent = text; log.appendChild(m); enter(m);
    queue.push({ text, el:m });
    if (!running) apply();
  });
  // what the agent says back, with buttons when it needs you to choose
  function say(text, warn, acts){
    const a = html(`<div class="ste-ag${warn ? ' warn' : ''}">${warn ? I('alert','xs') : I('spark','xs')}<div class="t"><p></p>${acts ? '<div class="ste-acts"></div>' : ''}</div></div>`);
    $('p', a).textContent = text; log.appendChild(a); enter(a);
    if (acts) acts.forEach(([label, ink, fn]) => { const b = html(`<button class="pill sm ${ink ? 'primary' : 'ghost'}">${label}</button>`); b.onclick = () => { $('.ste-acts', a).replaceWith(html(`<span class="muted">${fn()}</span>`)); a.classList.remove('warn'); a.firstElementChild.outerHTML = I('spark','xs'); }; $('.ste-acts', a).appendChild(b); });
  }
  function apply(){
    while (queue.length){
      const q = queue.shift(), tag = $('.ste-q', q.el);
      tag.innerHTML = I('check','xs') + (S.some(x => x.s !== 'done') ? 'Applied' : 'Noted'); enter(tag);
      const left = S.some(x => x.s !== 'done');
      if (!left){ say("The run had finished, so I'll keep this for the next one."); continue; }
      if (!/blue|accent|library/i.test(q.text)){ say("Got it. I'll follow that from the next step."); continue; }
      // a change of accent: what's still to come uses it, and a card already painted the old way is offered a redo
      hue = 'library blue';
      const old = S.filter(x => x.card && x.s === 'done' && x.hue === 'violet' && !S.some(y => y.redo === x.id));
      const run = S.find(x => x.s === 'run'); if (run && run.card) swap($('.ste-t span', run.el), doing(run));
      if (!old.length){ say('Got it. From here the accent is color.accent.500 from the library.'); continue; }
      const names = old.map(x => x.card).join(' and ');
      say(`Got it. From here the accent is color.accent.500. The ${names} card${old.length > 1 ? 's are' : ' is'} already violet.`, true, [
        ['Leave it', false, () => `Kept the ${names} card as it is`],
        [`Redo the ${names} card${old.length > 1 ? 's' : ''}`, true, () => { old.forEach(redo); return `Added a step to redo the ${names} card${old.length > 1 ? 's' : ''}`; }]
      ]);
    }
  }
  // a redo goes in before the export if the export hasn't started, otherwise at the end
  function redo(x){
    const n = { id:'redo-' + x.id, redo:x.id, card:x.card, mine:true, t:`Redo the ${x.card} card`, d:'Accent to library blue', s:'queued', ms:2000 };
    const ship = S.find(y => y.id === 'ship'), at = ship.s === 'queued' ? S.indexOf(ship) : S.length;
    S.splice(at, 0, n); steps.insertBefore(row(n), S[at + 1] ? S[at + 1].el : null);
    const li = n.el; li.style.height = '0px'; li.style.minHeight = '0px'; li.style.overflow = 'hidden'; li.style.opacity = '0';
    requestAnimationFrame(() => { li.style.transition = 'height .4s var(--ease),min-height .4s var(--ease),opacity .4s'; li.style.height = '44px'; li.style.minHeight = '44px'; li.style.opacity = '1'; c.later(450, () => { li.removeAttribute('style'); }); });
    if (ended){ ended = false; tEnd = 0; $('.ste-sum', r)?.remove(); inp.disabled = false; inp.placeholder = 'Steer the agent while it works'; ready(); c.run(work); }
    where();
  }
  // the agent works through the steps; between two steps it takes up what you sent
  async function work(){
    running = true;
    for (let x = S.find(y => y.s === 'run' || y.s === 'queued'); x; x = S.find(y => y.s === 'run' || y.s === 'queued')){
      if (x.s !== 'run') set(x, 'run', doing(x));
      where();
      await c.wait(x.ms);
      if (x.card) x.hue = hue;
      set(x, 'done', x.card ? (x.hue === 'violet' ? 'Accent set to violet' : 'Accent set to library blue') : x.id === 'ship' ? 'Live on designme.studio/pricing' : x.d);
      apply();
    }
    running = false; ended = true; tEnd = performance.now(); where();
    inp.disabled = true; inp.placeholder = 'The run has finished'; ready();
    const n = $$('.ste-me', r).length;
    $('.ste-sum', r)?.remove();
    const sum = html(`<div class="ste-sum">${I('ok','xs')}<span>Done in ${clock()}${n ? ` · ${n} change${n > 1 ? 's' : ''} from you` : ''}</span></div>`);
    log.appendChild(sum); enter(sum);
  }
  c.run(work);
  // the preview's story: read what the agent is doing, tell it to use the library's blue, and have it redo the card
  // that was already violet
  c.story(async s => {
    await s.beat(2);
    await s.point($('.ste-t span', S[1].el), false); await s.beat(1);
    await s.tap(inp);
    // typed a few letters at a time, so a busy page (few, longer timers) types it as fast as a quiet one
    const msg = 'Use our library blue, not violet';
    await s.type(inp, msg.match(/.{1,3}/g), { n:.15, each:ready, keep:true });
    await s.beat(1); await s.tap(go); s.away();
    await s.until(() => $('.ste-acts .primary', r)); await s.beat(3);
    await s.tap($('.ste-acts .primary', r)); s.away();
    await s.until(() => ended); await s.beat(2);
  });
});
/* ---------- Eval results ---------- */
DM.def('eval-results', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{play}', I('play','xs'));
  // eight checks on the pricing page's copy. The price check fails after the copy agent's latest edit, until it's fixed
  const K = [
    { n:'Names the Pro seat limit', tm:'0.6s' },
    { n:'Prices match the billing table', tm:'0.9s', bad:true, exp:'$24 a seat, billed yearly', got:'$29 a seat, billed yearly', src:'Billing table, Pro row' },
    { n:'Mentions the yearly discount', tm:'0.5s' },
    { n:'Makes no “unlimited” claims', tm:'0.4s' },
    { n:'Team plan lists SSO', tm:'0.5s' },
    { n:'Reads at grade 8 or below', tm:'0.7s' },
    { n:'One call to action per plan', tm:'0.5s' },
    { n:'Free plan says no card is needed', tm:'0.6s' }
  ].map(k => ({ ...k, s:'pass' }));
  const LAST = 8;
  const list = $('.evr-list', r), segs = $('.evr-segs', r), pass = $('.evr-pass', r), dl = $('.evr-dl', r), st = $('.evr-st', r), run = $('.evr-run', r), none = $('.evr-none', r), sg = $('.evr-tabs .seg2', r);
  const G = { run:'<span class="spin"></span>', pass:I('ok','xs'), fail:I('alert','xs'), queued:'<span class="dot"></span>' };
  let filter = 'all', busy = false, ran = false;
  K.forEach((k, i) => {
    k.w = html(`<div class="fold evr-w"><div><div class="evr-i" role="listitem"></div></div></div>`); k.el = $('.evr-i', k.w); k.i = i; list.appendChild(k.w);
    k.seg = document.createElement('i'); segs.appendChild(k.seg);
  });
  // a case's row: a failed one is a button that opens what was expected and what came back
  function paint(k, fresh){
    const open = k.s === 'fail' && k.open;
    k.el.className = 'evr-i ' + k.s;
    const g = `<span class="evr-g">${G[k.s]}</span><span class="evr-n">${k.n}</span><span class="evr-tm num">${k.s === 'pass' || k.s === 'fail' ? k.tm : ''}</span>`;
    k.el.innerHTML = k.s === 'fail'
      ? `<button class="evr-r" aria-expanded="${!!open}">${g}<span class="evr-ch">${I('chev-d','xs')}</span></button><div class="fold evr-d${open ? '' : ' shut'}"><div><div class="evr-dd"><span class="evr-kv"><span class="k">Expected</span><span>${k.exp}</span></span><span class="evr-kv"><span class="k">Got</span><span class="bad">${k.got}</span></span><span class="evr-kv"><span class="k">Source</span><span>${k.src}</span></span><button class="pill sm evr-fix">Use $24 and rerun</button></div></div></div>`
      : `<div class="evr-r">${g}</div>`;
    if (k.s === 'fail'){
      const d = $('.evr-d', k.el); d.inert = !open;
      $('.evr-r', k.el).onclick = () => { k.open = !k.open; $('.evr-r', k.el).setAttribute('aria-expanded', k.open); d.classList.toggle('shut', !k.open); d.inert = !k.open; };
      $('.evr-fix', k.el).onclick = () => fix(k);
    }
    if (fresh) enter($('.evr-g', k.el));
    k.seg.className = k.s;
  }
  function counts(){
    const p = K.filter(k => k.s === 'pass').length, f = K.filter(k => k.s === 'fail').length, done = K.every(k => k.s === 'pass' || k.s === 'fail');
    swap(pass, done ? `${p} of ${K.length} passed` : busy ? `Running ${K.filter(k => k.s === 'pass' || k.s === 'fail').length + 1} of ${K.length}` : 'Running the case again');
    const d = !ran || !done ? '' : p < LAST ? `${LAST - p} fewer than the last run` : 'All passing';
    if (dl.textContent !== d){ dl.textContent = d; dl.className = 'tag evr-dl ' + (p < LAST ? 'bad' : 'ok'); if (d) enter(dl); }
    $('[data-v="all"] .n', sg).textContent = K.length; $('[data-v="fail"] .n', sg).textContent = f;
    show();
  }
  // All shows every case; Failed folds the others away
  function show(){
    K.forEach(k => { const on = filter === 'all' || k.s === 'fail'; k.w.classList.toggle('shut', !on); k.w.inert = !on; });
    none.hidden = !(filter === 'fail' && !K.some(k => k.s === 'fail'));
  }
  seg(sg, v => { filter = v; show(); });
  K.forEach(k => paint(k)); counts();
  // a run checks the cases one after another; the price check fails until the copy is fixed
  run.onclick = () => c.run(async () => {
    if (busy) return; busy = true; ran = true; run.disabled = true; run.innerHTML = '<span class="spin"></span>Running';
    K.forEach(k => { k.s = 'queued'; k.open = false; paint(k); }); counts();
    for (const k of K){
      k.s = 'run'; paint(k, true); counts();
      await c.wait(500);
      k.s = k.bad ? 'fail' : 'pass'; paint(k, true); counts();
    }
    busy = false; run.disabled = false; run.innerHTML = I('play','xs') + 'Run again'; swap(st, 'Copy agent · 8 cases · run just now');
  });
  // the fix changes the copy to the billing table's price and runs that case again
  function fix(k){
    if (busy) return;
    c.run(async () => {
      k.bad = false; k.open = false; k.s = 'run'; paint(k, true); counts();
      await c.wait(1000);
      k.s = 'pass'; paint(k, true); counts();
    });
  }
  // the preview's story: run the evals, see one fail against the last run, open it, take the fix, and see all eight pass
  c.story(async s => {
    await s.beat(3);
    await s.tap(run); s.away();
    await s.until(() => !busy); await s.beat(3);
    await s.tap($('[data-v="fail"]', sg)); s.away(); await s.beat(2);
    await s.tap($('.evr-i.fail .evr-r', r)); s.away(); await s.beat(3);
    await s.tap($('.evr-fix', r)); s.away();
    await s.until(() => K.every(k => k.s === 'pass')); await s.beat(2);
    await s.tap($('[data-v="all"]', sg)); s.away(); await s.beat(2);
  });
});
/* ---------- Eval results designs ---------- */
/* the homepage card's design switch, shown as its footer tabs: Classic is the component above, and the others are the
   directions under review. The switch is the card's alone: the registry, the code view and the component page install
   Classic on its own (build.js leaves a data-designs="card" switch out of them) */
{
  const classic = DM.defs['eval-results'];
  // the suite Run vs run and Score & judge run: eight checks on the pricing page's copy, each with its kind and its result
  // last time. The price check regresses after the copy agent's last edit; the yearly discount check, failing last time,
  // now passes
  const EVR_K = () => [
    { n:'Names the Pro seat limit', k:'acc', tm:.6, last:'pass' },
    { n:'Prices match the billing table', k:'acc', tm:.9, last:'pass', bad:true },
    { n:'Mentions the yearly discount', k:'acc', tm:.5, last:'fail' },
    { n:'Makes no “unlimited” claims', k:'tone', tm:.4, last:'pass' },
    { n:'Team plan lists SSO', k:'acc', tm:.5, last:'pass' },
    { n:'Reads at grade 8 or below', k:'tone', tm:.7, last:'pass' },
    { n:'One call to action per plan', k:'fmt', tm:.5, last:'pass' },
    { n:'Free plan says no card is needed', k:'fmt', tm:.6, last:'pass' }
  ].map(x => ({ ...x, s:'idle' }));
  const EVR_KIND = { acc:'Accuracy', tone:'Tone', fmt:'Format' };
  const evrDot = s => `<span class="evr-dot ${s}">${s === 'pass' ? I('check','xs') : s === 'fail' ? I('x','xs') : s === 'run' ? '<span class="spin"></span>' : ''}</span>`;
  const EVR_EXP = '$24 a seat, billed yearly';
  // a run checks the cases one after another; the price check fails until its copy is fixed
  async function evrRun(c, K, each, gap = 380){ for (const k of K){ k.s = 'run'; each(k); await c.wait(gap); k.s = k.bad ? 'fail' : 'pass'; each(k, true); } }
  async function evrFix(c, k, each){ k.bad = false; k.s = 'run'; each(k); await c.wait(900); k.s = 'pass'; each(k, true); }
  const EVR_HTML = {
    runs:`<div class="evr-vs panel">
    <div class="evr-vs-h"><div class="evr-vs-ht"><b>Pricing copy evals</b><span class="evr-vs-st">Copy agent · 8 cases · last run 2h ago</span></div><button class="pill primary sm evr-vs-run" type="button">${I('play','xs')}Run evals</button></div>
    <div class="evr-vs-score"><span class="evr-vs-big num">7/8</span><span class="evr-vs-dl tag">Same as last run</span><span class="evr-vs-mv"></span></div>
    <div class="evr-vs-f" role="toolbar" aria-label="Show"></div>
    <div class="evr-vs-th" aria-hidden="true"><span>Case</span><span>Last</span><span></span><span>Now</span></div>
    <div class="evr-vs-list" role="list" aria-label="Cases"></div>
  </div>`,
    judge:`<div class="evr-jg panel">
    <div class="evr-jg-h"><div class="evr-jg-ht"><b>Pricing copy evals</b><span class="evr-jg-st">Judged by the review model · 8 cases</span></div><button class="ib evr-jg-run" type="button" aria-label="Run evals" data-tip="Run again">${I('refresh')}</button></div>
    <div class="evr-jg-top">
      <div class="evr-jg-g"><span class="evr-jg-arc" aria-hidden="true"><span class="tr"></span><i></i></span><span class="evr-jg-gv num">0%</span><span class="evr-jg-gl">7 of 8 passed</span></div>
      <ul class="evr-jg-cats" aria-label="By kind of check"></ul>
    </div>
    <div class="evr-jg-j" aria-live="polite"></div>
  </div>`
  };
  // Run vs run: each case's result last run and this run side by side. A filter shows only the regressions, the fixes or
  // the cases failing now, and a regression opens to what was expected and what came back
  function evrRuns(r, c){
    const K = EVR_K(), list = $('.evr-vs-list', r), bar = $('.evr-vs-f', r), run = $('.evr-vs-run', r), big = $('.evr-vs-big', r), dl = $('.evr-vs-dl', r), mv = $('.evr-vs-mv', r), st = $('.evr-vs-st', r);
    // before the first run, "now" is the last run's result
    K.forEach(k => { k.s = k.last; });
    let filter = 'all', busy = false;
    const ch = k => k.s === 'run' || k.s === 'idle' ? '' : k.last === 'pass' && k.s === 'fail' ? 'reg' : k.last === 'fail' && k.s === 'pass' ? 'fix' : '';
    const F = [['all', 'All'], ['reg', 'Regressed'], ['fix', 'Fixed'], ['fail', 'Failing']];
    bar.innerHTML = F.map(([v, n], i) => `<button class="chip sm evr-vs-chip${i === 0 ? ' on' : ''}" type="button" data-f="${v}" aria-pressed="${i === 0}">${n}<span class="n num">0</span></button>`).join('');
    const chips = $$('.evr-vs-chip', bar);
    chips.forEach(b => b.onclick = () => { filter = b.dataset.f; chips.forEach(x => { x.setAttribute('aria-pressed', String(x === b)); x.classList.toggle('on', x === b); }); show(); });
    c.on(bar, 'keydown', e => { const i = chips.indexOf(document.activeElement); if (i < 0) return; const j = e.key === 'ArrowRight' ? i + 1 : e.key === 'ArrowLeft' ? i - 1 : null; if (j === null) return; e.preventDefault(); chips[(j + chips.length) % chips.length].focus(); });
    K.forEach(k => { k.w = html('<div class="fold evr-vs-w"><div><div class="evr-vs-i" role="listitem"></div></div></div>'); k.el = $('.evr-vs-i', k.w); list.appendChild(k.w); });
    const none = html('<p class="evr-vs-none" hidden>Nothing here this run</p>'); list.appendChild(none);
    function paint(k, fresh){
      const d = ch(k), open = d === 'reg' && k.open;
      k.el.className = 'evr-vs-i' + (d ? ' ' + d : '');
      const row = `<span class="n"><span>${k.n}</span>${d === 'reg' ? '<span class="tag tg">Regressed</span>' : d === 'fix' ? '<span class="tag ok tg">Fixed</span>' : ''}</span>${evrDot(k.last)}<span class="ar">${I('right','xs')}</span>${evrDot(k.s)}<span class="tm num">${k.s === 'pass' || k.s === 'fail' ? k.tm.toFixed(1) + 's' : ''}</span>`;
      k.el.innerHTML = d === 'reg' ? `<button class="evr-vs-r" type="button" aria-expanded="${!!open}">${row}</button><div class="fold${open ? '' : ' shut'}"><div><div class="evr-vs-d"><span class="evr-vs-kv"><span class="k">Expected</span><span class="evr-is">${EVR_EXP}</span></span><span class="evr-vs-kv"><span class="k">Got</span><span><span class="evr-was">$29</span> a seat, billed yearly</span></span><span class="evr-vs-kv"><span class="k">Source</span><span>Billing table, Pro row</span></span><button class="pill sm" type="button">Use $24 and rerun</button></div></div></div>` : `<div class="evr-vs-r">${row}</div>`;
      if (d === 'reg'){
        const f = $('.fold', k.el), b = $('.evr-vs-r', k.el); f.inert = !open;
        b.onclick = () => { k.open = !k.open; b.setAttribute('aria-expanded', String(k.open)); f.classList.toggle('shut', !k.open); f.inert = !k.open; };
        $('.pill', k.el).onclick = () => { if (busy) return; k.open = false; c.run(() => evrFix(c, k, paint).then(counts)); };
      }
      if (fresh){ const dots = $$('.evr-dot', k.el); if (dots[1]) dots[1].classList.add('bump'); }
    }
    function counts(){
      const n = { all:K.length, reg:K.filter(k => ch(k) === 'reg').length, fix:K.filter(k => ch(k) === 'fix').length, fail:K.filter(k => k.s === 'fail').length };
      chips.forEach(b => { $('.n', b).textContent = n[b.dataset.f]; });
      const p = K.filter(k => k.s === 'pass').length, lp = K.filter(k => k.last === 'pass').length, fin = k => k.s === 'pass' || k.s === 'fail', doneAll = K.every(fin);
      big.textContent = `${doneAll ? p : K.filter(fin).length}/8`;
      const d = !doneAll ? 'Running' : p > lp ? `+${p - lp} on the last run` : p < lp ? `${p - lp} on the last run` : 'Same score as last run';
      if (dl.textContent !== d){ dl.textContent = d; dl.className = 'evr-vs-dl tag' + (!doneAll ? '' : p > lp ? ' ok' : p < lp ? ' bad' : ''); }
      mv.textContent = doneAll && (n.reg || n.fix) ? `${n.reg} regressed, ${n.fix} fixed` : '';
      show();
    }
    function show(){ K.forEach(k => { const d = ch(k), on = filter === 'all' || (filter === 'fail' ? k.s === 'fail' : d === filter); k.w.classList.toggle('shut', !on); k.w.inert = !on; }); none.hidden = K.some(k => !k.w.classList.contains('shut')); }
    K.forEach(k => paint(k)); counts();
    run.onclick = () => c.run(async () => {
      if (busy) return; busy = true; run.disabled = true; run.innerHTML = '<span class="spin"></span>Running';
      K.forEach(k => { k.s = 'idle'; k.open = false; paint(k); }); counts();
      await evrRun(c, K, (k, f) => { paint(k, f); counts(); });
      busy = false; run.disabled = false; run.innerHTML = I('play','xs') + 'Run again'; swap(st, 'Copy agent · 8 cases · run just now');
    });
    c.story(async s => {
      await s.beat(3); await s.tap(run); s.away();
      await s.until(() => !busy && K.every(k => k.s === 'pass' || k.s === 'fail')); await s.beat(2);
      await s.tap(chips[1]); s.away(); await s.beat(2);
      await s.tap($('.evr-vs-i.reg .evr-vs-r', r)); s.away(); await s.beat(4);
      await s.tap($('.evr-vs-i.reg .pill', r)); s.away();
      await s.until(() => K.every(k => k.s === 'pass')); await s.beat(2);
      await s.tap(chips[0]); s.away(); await s.beat(3);
    });
  }
  // Score & judge: a gauge for the score and a bar for each kind of check, then the judge's reasoning on the case that
  // failed, with the wrong words marked, a thumb for whether it was a fair call, and the fix
  function evrJudge(r, c){
    const K = EVR_K(), g = $('.evr-jg-g', r), gv = $('.evr-jg-gv', r), gl = $('.evr-jg-gl', r), cats = $('.evr-jg-cats', r), j = $('.evr-jg-j', r), run = $('.evr-jg-run', r);
    // last run's score by kind, so each bar says how it moved
    const LAST = { acc:3, tone:2, fmt:2 };
    cats.innerHTML = Object.entries(EVR_KIND).map(([k, n]) => `<li data-k="${k}"><span class="t">${n}</span><span class="s num"></span><span class="b"><i></i></span></li>`).join('');
    let shown = 0, busy = false, tw = 0;
    function score(){
      const fin = k => k.s === 'pass' || k.s === 'fail', done = K.filter(fin), p = K.filter(k => k.s === 'pass').length;
      const f = done.length ? p / K.length : 0;
      g.style.setProperty('--p', f.toFixed(3)); g.style.setProperty('--gc', f === 1 ? 'var(--ok)' : f >= .8 ? 'var(--accent-mark)' : 'var(--warn-mark)');
      gl.textContent = done.length < K.length ? `${done.length} of 8 checked` : `${p} of 8 passed`;
      // the score counts to its value as the arc fills, its text changing at most ten times a second
      const to = Math.round(f * 100), me = ++tw; let at = -1e9;
      tween(shown, to, REDUCE ? 1 : 900, (v, q) => { if (me !== tw || c.dead) return; const now = performance.now(); if (q < 1 && now - at < 100) return; at = now; gv.textContent = Math.round(v) + '%'; }); shown = to;
      Object.keys(EVR_KIND).forEach(k => {
        const li = $(`[data-k="${k}"]`, cats), all = K.filter(x => x.k === k), pp = all.filter(x => x.s === 'pass').length, d = pp - LAST[k], end = done.length === K.length;
        $('.s', li).innerHTML = `${pp}/${all.length}${end && d ? `<span class="d${d > 0 ? ' up' : ''}">${d > 0 ? '+' : ''}${d}</span>` : ''}`; $('.b i', li).style.setProperty('--p', (pp / all.length).toFixed(3));
      });
    }
    const again = () => { j.classList.remove('go'); void j.offsetWidth; j.classList.add('go'); };
    // the judge's part for the failed case: what the copy said, why it is wrong, and your call
    function judge(){
      const k = K.find(x => x.s === 'fail');
      if (!k){ j.innerHTML = K.every(x => x.s === 'pass') ? `<div class="evr-jg-ok">${I('ok')}<b>All 8 pass</b><span>The judge found nothing to fix in this run</span></div>` : '<div class="evr-jg-ok"><span class="spin"></span><span>The judge is reading the copy</span></div>'; return; }
      j.innerHTML = `<div class="evr-jg-jh">${evrDot('fail')}<b>${k.n}</b><span class="tag warn">Regressed</span></div><p class="evr-jg-jq">Pro is <span class="evr-mk">$29 a seat</span>, billed yearly, with SSO and audit logs.</p><p class="evr-jg-jr"><span class="who">${I('spark','xs')}Judge</span>The billing table has Pro at <span class="evr-gd">$24 a seat</span> when billed yearly. The copy agent's last edit used the monthly price.</p><div class="evr-jg-ja"><span class="lbl">Fair call?</span><button class="ib evr-jg-y" type="button" aria-pressed="false" aria-label="Agree with the judge" data-tip="Agree">${I('up-thumb','xs')}</button><button class="ib evr-jg-n" type="button" aria-pressed="false" aria-label="Disagree with the judge" data-tip="Disagree">${I('down-thumb','xs')}</button><span class="sp"></span><button class="pill primary sm evr-jg-fix" type="button">Use $24 and rerun</button></div>`;
      const y = $('.evr-jg-y', j), n = $('.evr-jg-n', j); [y, n].forEach(b => b.onclick = () => { const on = b.getAttribute('aria-pressed') !== 'true'; [y, n].forEach(x => x.setAttribute('aria-pressed', String(x === b && on))); });
      $('.evr-jg-fix', j).onclick = () => { if (busy) return; busy = true; c.run(async () => { await evrFix(c, k, () => score()); busy = false; judge(); again(); }); };
      again();
    }
    async function go(){
      if (busy) return; busy = true; run.classList.add('spinning'); run.disabled = true;
      K.forEach(k => { k.s = 'idle'; k.bad = k.n.startsWith('Prices'); }); score(); judge();
      await evrRun(c, K, () => score(), 300);
      busy = false; run.classList.remove('spinning'); run.disabled = false; judge();
    }
    run.onclick = () => c.run(go);
    score(); judge();
    c.run(async () => { await c.wait(700); await go(); });
    c.story(async s => {
      await s.until(() => !busy && $('.evr-jg-fix', j)); await s.beat(4);
      await s.tap($('.evr-jg-y', j)); s.away(); await s.beat(2);
      await s.tap($('.evr-jg-fix', j)); s.away();
      await s.until(() => K.every(k => k.s === 'pass')); await s.beat(5);
    });
  }
  // the switch under the run (on designme.dev, the card's tabs) picks the design. A pick draws it in place and plays its demo
  // from the start, on a controller of its own inside the card's: a mouse on the component holds it, a click, a key or the
  // focus inside the design stops it for good, and the card keeps the pick when it plays again or is replayed
  function evrDesigns(r, c, D){
    const main = $('.dm-main', r), sg = $('.demo .seg2', r), card = c.card || r;
    let k = null, at = D[card._evrDesign] ? card._evrDesign : 'classic';
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
    seg(sg, v => { if (v === at || !D[v]) return; at = card._evrDesign = v; show(v, true); });
    show(at, false);
  }
  DM.def('eval-results', (r, c, card) => {
    // installed on its own (no switch), or inside another component, it is Classic
    const dm = $(':scope>.evr-dm', r);
    if (!dm) return classic(r, c, card);
    if (r !== c.st || !card){ dm.replaceWith(...$(':scope>.dm-main', dm).childNodes); return classic(r, c, card); }
    evrDesigns(r, c, { classic:[$(':scope>.dm-main', dm).innerHTML, classic], runs:[EVR_HTML.runs, evrRuns], judge:[EVR_HTML.judge, evrJudge] });
  });
}
/* ---------- Design review ---------- */
DM.def('design-review', (r, c) => {
  r.innerHTML = r.innerHTML.replace('{palette}', I('palette')).replace('{chev}', I('chev-d','xs')).replace(/\{chk\}/g, I('check','xs'));
  const C = [['Visual diff','2 of 6 screens changed'],['Library tokens','All from the library'],['Contrast','AA on every screen']];
  const box = $('.drv-checks', r), rv = $('.drv-rv', r), go = $('.drv-go', r), dd = $('.drv-dd', r), st = $('.drv-st', r), tag = $('.drv-tag', r), root = $('.drv', r);
  box.innerHTML = C.map(x => `<div class="drv-c"><span class="g"><span class="drv-ring"></span></span><span class="t">${x[0]}</span><span class="d"></span></div>`).join('');
  const rows = $$('.drv-c', box);
  const DONE = { 'Ship to everyone':'Live for every visitor', 'Ship to 10% first':'Live for 10% of visitors. Everyone tomorrow', 'Ship on Monday':'Ships on Monday at 09:00' };
  // one message in the review: who, a tag, and what they said
  const msg = (who, tg, text) => { const m = html(`<div class="drv-m">${who === 'agent' ? `<span class="drv-ag">${I('spark','xs')}</span>` : AV('MK','var(--av-l)')}<div class="drv-mb"><span class="drv-mn"><b>${who === 'agent' ? 'Design agent' : 'Maya Kim'}</b>${tg}</span>${text ? `<p>${text}</p>` : ''}</div></div>`); $('.drv-wt', rv)?.remove(); rv.appendChild(m); enter(m); return m; };
  $$('.drv-pop .mi', r).forEach(m => m.addEventListener('click', () => { $$('.drv-pop .mi', r).forEach(x => x.setAttribute('aria-checked', x === m)); swap(go, m.dataset.m); }));
  go.onclick = () => c.run(async () => {
    const how = go.textContent; go.disabled = dd.disabled = true; swap(go, 'Shipping'); swap(st, 'Publishing 6 screens'); await c.wait(1000);
    const later = how === 'Ship on Monday';
    root.classList.toggle('live', !later); tag.className = 'tag ' + (later ? 'b' : 'ok') + ' drv-tag'; swap(tag, later ? 'Scheduled' : 'Live');
    const f = $('.drv-f', r); f.innerHTML = `<span class="drv-done">${I(later ? 'clock' : 'ok')}<span>${DONE[how]}</span></span>`; enter(f.firstElementChild);
  });
  c.run(async () => {
    await c.wait(500);
    for (let i = 0; i < rows.length; i++){
      const g = $('.g', rows[i]); g.innerHTML = '<span class="spin"></span>'; swap($('.d', rows[i]), 'Running');
      await c.wait(650 + i * 120);
      g.innerHTML = `<span style="color:var(--ok);display:grid">${I('ok','xs')}</span>`; enter(g.firstElementChild); swap($('.d', rows[i]), C[i][1]);
    }
    swap(st, 'Waiting on Maya'); await c.wait(900);
    msg('maya', '<span class="tag warn">Changes requested</span>', 'Start the plan toggle on yearly. Most people pick it.');
    swap(st, 'The agent is on it'); await c.wait(1200);
    const a = msg('agent', '<span class="tag drv-wk"><span class="spin"></span>Updating</span>', '');
    await c.wait(1300);
    swap($('.drv-wk', a), 'Updated'); const p = html('<p>The toggle starts on yearly on all 6 screens.</p>'); $('.drv-mb', a).appendChild(p); enter(p);
    await c.wait(1100);
    msg('maya', `<span class="tag ok">${I('check','xs')}Approved</span>`, '');
    swap(st, 'Approved by Maya'); tag.className = 'tag ok drv-tag'; swap(tag, 'Approved');
    go.disabled = dd.disabled = false; enter($('.drv-mg', r));
  });
});