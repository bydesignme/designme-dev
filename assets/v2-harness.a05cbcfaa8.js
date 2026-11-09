TPLS["harness"] = "<div class=\"ahx panel\">\n  <aside class=\"ahx-side\" aria-label=\"Chats\">\n    <div class=\"ahx-ws\">\n      <button class=\"ahx-wsb\" data-pop=\".ahx-wsp\" aria-haspopup=\"menu\"><span class=\"ahx-lg\">D</span><span class=\"t\">DesignMe Studio</span>{chev}</button>\n      <button class=\"ib ahx-hide\" aria-label=\"Hide chats\" data-tip=\"Hide chats\">{panel}</button>\n    </div>\n    <button class=\"ahx-nav ahx-new\">{edit}<span>New chat</span></button>\n    <div class=\"ahx-lh\"><span>Chats</span><button class=\"ib ahx-sb\" aria-label=\"Search chats\" data-tip=\"Search chats\">{search}</button></div>\n    <div class=\"fold shut ahx-sf\"><div><input class=\"ahx-si\" type=\"search\" placeholder=\"Search chats\" aria-label=\"Search chats\"></div></div>\n    <div class=\"ahx-list\"><p class=\"ahx-none\" hidden>No chats match</p></div>\n  </aside>\n  <div class=\"ahx-main home\">\n    <div class=\"ahx-top\">\n      <button class=\"ib ahx-menu\" aria-label=\"Show chats\" data-tip=\"Show chats\">{panel}</button>\n      <div class=\"ahx-tabs\" role=\"group\" aria-label=\"Open chats\"></div>\n      <button class=\"ahx-tn\" data-pop=\".ahx-tp\" data-pop-align=\"end\" aria-haspopup=\"menu\" aria-label=\"Open chats\" data-tip=\"Open chats\" hidden><span class=\"num\">1</span></button>\n      <button class=\"ib ahx-plus\" aria-label=\"New chat\" data-tip=\"New chat\">{plus}</button>\n      <div class=\"spl ahx-spl\"><div class=\"spl-pill\" aria-live=\"polite\"><div class=\"spl-in\"></div></div></div>\n    </div>\n    <div class=\"ahx-body\">\n      <div class=\"ahx-feed\"><div class=\"ahx-cols\"></div></div>\n      <div class=\"ahx-bot\"></div>\n      <div class=\"ahx-home\">\n        <div class=\"ahx-hw\">\n          <div class=\"ahx-hi\"><svg class=\"ahx-brand\" viewBox=\"0 0 759 632\" aria-hidden=\"true\" focusable=\"false\"><path fill=\"currentColor\" d=\"M149.497 283.784C149.477 284.047 149.474 284.311 149.487 284.575C156.385 340.034 183.548 391.116 225.9 428.196C267.989 465.044 322.188 485.532 378.414 485.855L379.743 485.859C436.453 485.868 491.188 465.353 533.619 428.212C575.912 391.194 603.062 340.216 610.018 284.856L610.018 281.512C610.008 277.337 608.324 273.315 605.303 270.335C602.277 267.351 598.155 265.656 593.837 265.656L165.647 265.656C161.338 265.656 157.226 267.349 154.21 270.331C151.198 273.309 149.524 277.326 149.523 281.491L149.523 283.437L149.497 283.784ZM114.378 247.395C118.396 247.391 122.254 245.919 125.214 243.29C128.063 240.759 129.887 237.33 130.396 233.629L130.396 233.35L130.437 232.917C136.355 171.634 165.162 114.754 211.202 73.3687C257.239 31.9859 317.206 9.06063 379.393 9.04448L379.396 9.04448C441.593 9.04583 501.574 31.964 547.624 73.3482C593.677 114.735 622.491 171.624 628.411 232.917L628.453 233.35L628.453 233.643C628.953 237.344 630.773 240.774 633.621 243.304C636.58 245.932 640.437 247.399 644.452 247.395L725.644 247.395C728.882 247.404 732.089 248.06 735.071 249.329C738.055 250.598 740.753 252.453 743.001 254.787C745.252 257.123 747.005 259.891 748.151 262.924C749.296 265.954 749.81 269.183 749.662 272.418L749.663 272.418C745.484 366.797 704.617 455.919 635.615 521.211C566.616 586.499 474.809 622.924 379.338 622.924C283.872 622.924 192.071 586.496 123.081 521.206C54.0935 455.917 13.2412 366.804 9.07133 272.438L9.07036 272.438L9.07036 272.436C9.07007 272.43 9.06967 272.423 9.06938 272.417L9.07036 272.417C8.92272 269.182 9.43655 265.953 10.5811 262.924C11.7276 259.89 13.481 257.123 15.7315 254.787C17.9805 252.452 20.6797 250.597 23.6622 249.329C26.6443 248.06 29.8504 247.404 33.0889 247.395L114.378 247.395Z\"/></svg><span>Hello</span><h4>What should the agent work on?</h4></div>\n        </div>\n      </div>\n    </div>\n  </div>\n  <aside class=\"ahx-pane\" aria-label=\"Artifact\" aria-hidden=\"true\"><div class=\"ahx-pi\">\n    <div class=\"ahx-ph\">{doc}<span class=\"t\"></span><button class=\"ib ahx-pl\" aria-label=\"Copy link\" data-tip=\"Copy link\">{link}</button><button class=\"ib ahx-px\" aria-label=\"Close panel\" data-tip=\"Close\">{x}</button></div>\n    <div class=\"ahx-pb\"></div>\n  </div></aside>\n  <div class=\"ahx-scrim\"></div>\n  <div class=\"pop ahx-wsp\" role=\"menu\"></div>\n  <div class=\"pop ahx-tp\" role=\"menu\" aria-label=\"Open chats\"></div>\n</div>";

/* ---------- Agent harness ---------- */
/* an agent app made only of the components above. Nothing plays by itself: it opens on New chat, a story plays once when
   someone picks a suggestion or sends a message, every approval waits for their click, and a past chat opens on its last state */
DM.def('harness', (r, c) => {
  const IC = { plus:I('plus'), edit:I('edit'), search:I('search'), panel:I('panel'), chev:I('chev-d','xs'), x:I('x'), refresh:I('refresh','xs'), doc:I('file-text'), link:I('link') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  const root = $('.ahx', r), main = $('.ahx-main', r), list = $('.ahx-list', r), tabsEl = $('.ahx-tabs', r), feed = $('.ahx-feed', r), cols = $('.ahx-cols', r);
  const bot = $('.ahx-bot', r), pane = $('.ahx-pane', r), wsp = $('.ahx-wsp', r);
  const pill = $('.ahx-spl .spl-pill', r), pin = $('.spl-in', pill);
  // the templates live on the components' own cards: here and on designme.dev every card is on the page; on your own page, add the cards it uses
  const tplOf = k => { const card = $(`.card[data-c="${k}"], .comp[data-v2="${k}"]`); return card && DM.tpl(card); };
  const BOXED = ['artifact-card', 'change-review'];
  const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
  /* a clock of its own: a past chat replays at speed out of sight, so opening it shows its end at once.
     The tiny waits of a replay go through a message, which the browser runs at once, where a timer would be held back */
  const mc = new MessageChannel(), q = [];
  mc.port1.onmessage = () => { const f = q.shift(); if (f) f(); };
  const soon = fn => { q.push(fn); mc.port2.postMessage(0); };
  c.offs.push(() => { q.length = 0; mc.port1.close(); });
  const paced = (up, f) => { const s = ctl(up), w = s.wait, l = s.later, e = s.every; s.speed = (up.speed || 1) * f; s.ff = up.ff; s.raw = w;
    s.wait = ms => (ms *= s.speed) < 4 ? new Promise((res, rej) => soon(() => s.gate(() => s.dead ? rej('stop') : res()))) : w(ms);
    s.later = (ms, fn) => (ms *= s.speed) < 4 ? soon(() => s.gate(() => { if (!s.dead) fn(); })) : l(ms, fn);
    s.every = (ms, fn) => e(Math.max(16, ms * s.speed), fn);
    // a component inside stops its own demo when the visitor takes over the harness
    up.offs.push(() => s.stop()); if (up.taken) up.taken(() => { s.mine = true; }); return s; };

  /* ---- the composer, with the model and the context ring in its bar. It sits in the middle of New chat and at the foot of a chat ---- */
  const cpT = tplOf('composer');
  if (cpT){ bot.append(cpT.content.cloneNode(true)); try { DM.defs.composer(bot, c, bot); } catch(e){ console.error('composer', e); } }
  const cpx = $('.cpx', bot), ta = $('.cpx-ta', bot), att = $('.cpx-att', bot);
  // the context ring is the meter's own ring, as a button of its own in the composer's bar, before the mode
  const ctT = tplOf('context-meter'), rs = ctT && ta && $('.ctm-ring svg', ctT.content);
  const ft = rs && html(`<span class="ctm-ft"><button class="ctm-ring" aria-label="Context">${rs.outerHTML}</button></span>`);
  if (ft) $('.cpx-mode', bot).before(ft);
  const ring = v => { if (!ft) return; const rb = $('.ctm-ring', ft), fl = $('.fl', ft); fl.style.strokeDasharray = v + ' 100'; fl.style.opacity = v ? '' : '0';
    rb.dataset.tip = 'Context ' + v + '% full'; rb.setAttribute('aria-label', 'Context, ' + v + '% full'); };
  const input = () => ta && ta.dispatchEvent(new Event('input'));

  /* ---- the status pill beside the tabs says what the chat on screen is doing ---- */
  const G = {
    idle:'<span class="g"><span class="dot" style="color:var(--faint)"></span></span>',
    think:'<span class="g" style="color:var(--fg)"><span class="think on"><i></i><i></i><i></i><i></i></span></span>',
    tool:'<span class="g" style="color:var(--fg)"><span class="radar"></span></span>',
    run:'<span class="g" style="color:var(--fg)"><span class="spin"></span></span>',
    wait:'<span class="g" style="color:var(--warn-mark)"><span class="dot"></span></span>',
    ok:`<span class="g" style="color:var(--ok)">${I('ok')}</span>`
  };
  const fit = () => { pin.style.width = 'max-content'; const w = pin.scrollWidth; pin.style.width = ''; pill.style.width = w + 'px'; };
  let shown = '';
  function showStatus(st, now){
    const key = [st.g, st.t, !!st.act].join('|');
    // a count or a timer ticks over in place, under a steady line
    if (key === shown){ let m = $('.m', pin); if ((m ? m.textContent : '') === (st.m || '')) return;
      if (!m){ m = html('<span class="m"></span>'); pin.lastElementChild.before(m); } else if (!st.m){ m.remove(); return fit(); }
      m.textContent = st.m; return fit(); }
    shown = key;
    const put = () => { pin.innerHTML = G[st.g] + `<span class="${st.g === 'idle' ? 'fg2' : /think|tool|run/.test(st.g) ? 'shim' : ''}">${st.t}</span>`
      + (st.m ? `<span class="m">${st.m}</span>` : '') + (st.act ? '<button class="pill primary sm">Review</button>' : '<span class="end"></span>');
      const b = $('.pill', pin); if (b) b.onclick = () => look(st.act); fit(); };
    if (now || REDUCE) return put();
    pill.style.width = pill.offsetWidth + 'px'; pin.classList.add('out');
    c.later(180, () => { if (shown !== key) return; put(); pin.classList.remove('out'); });
  }

  /* ---- following the chat: it keeps to the newest message until you scroll up, and picks up again at the bottom ---- */
  let stick = true, ours = 0, following = false;
  const bottom = () => feed.scrollHeight - feed.clientHeight;
  c.on(feed, 'scroll', () => { if (Math.abs(feed.scrollTop - ours) > 2) stick = bottom() - feed.scrollTop < 40; });
  c.on(feed, 'wheel', e => { if (e.deltaY < 0) stick = false; }, { passive:true });
  function follow(){
    if (following || !stick) return; following = true;
    c.loop(() => { const d = bottom() - feed.scrollTop; if (!stick || d < 1){ following = false; return false; }
      feed.scrollTop += REDUCE ? d : Math.max(1, Math.ceil(d * .16)); ours = feed.scrollTop; });
  }
  const ro = new ResizeObserver(() => follow()); c.offs.push(() => ro.disconnect());
  const toEnd = () => { stick = true; feed.scrollTop = bottom(); ours = feed.scrollTop; };
  const look = el => { if (!el || !el.isConnected) return; stick = false;
    feed.scrollTo({ top:feed.scrollTop + el.getBoundingClientRect().top - feed.getBoundingClientRect().top - 12, behavior:REDUCE ? 'auto' : 'smooth' }); };

  /* ---- the stories, each told only with the components above. A story waits for every approval; a past chat replays the
     choice that was made back then, so it opens finished ---- */
  const S = {
    pricing:{ ask:'Tighten the spacing and prices on the pricing page', title:'Pricing page fixes', nt:'Pricing spacing and prices', ic:'grid', end:{ g:'ok', t:'Done', m:'6 files changed' }, ctx:46, run:async t => {
      await t.ask(); t.ctx(12);
      const g = t.group('Checking the pricing page');
      const tk = g.comp('thinking', .5);
      await t.until(() => { t.status('think', 'Thinking', $('.tk-time', tk).textContent); return $('.tk-fin', tk); }, 200);
      t.ctx(21); await t.wait(400);
      const tc = g.comp('tool-call');
      await t.until(() => { const on = $$('.tcx-c', tc).find(x => $('.spin', x)); t.status('tool', 'Calling tools', on ? $('.tcx-n b', on).textContent : 'billing'); return $('.tcx-end.in', tc); });
      g.done('Checked 6 frames and 2 plan prices', 11); t.ctx(28); await t.wait(700);
      await t.say('Three cards break the 8px grid, and the Figma frames still show the old prices. To fix them I need edit access to Pricing.fig.');
      const pg = t.comp('permission-gate'); t.hold(pg, 'Needs access', "I can't change the frames without access. Allow it above, or pick Not now and I'll list the fixes here.");
      t.decide(pg, '.pgx-ok');
      await t.until(() => $('.pgx-done', pg));
      if (/skip/.test($('.pgx-done', pg).textContent)){ await t.wait(500); await t.say("No problem. To fix it by hand, move the three cards onto the 8px grid and update the Pro and Team prices."); return t.end('Done', 'Nothing edited'); }
      const g2 = t.group('Applying the fixes');
      const al = g2.comp('action-log', .7);
      await t.until(() => { t.status('run', 'Applying the fixes', 'Step ' + $('.alg-list', al).children.length + ' of 5'); return $('.alg-st .dot', al); });
      g2.done('Edited 6 frames and opened a pull request', 6); t.ctx(36); await t.wait(600);
      await t.say("Here's the plan for the rest of the redesign. Change any step, or approve it and I'll start.");
      const pl = t.comp('plan-review'); t.hold(pl, 'Needs your approval', "Noted. Edit a step above to match, or approve the plan as it is and I'll start."); t.ctx(40);
      t.decide(pl, '.plx-go');
      // the plan's own line says how it ended, once its crossfade has landed
      await t.until(() => { const s = $('.plx-st', pl).textContent; if (/^Step/.test(s)) t.status('run', 'Running the plan', s); return $('.plx-f .pill.soft', pl) && /^(Done|Stopped)/.test(s); });
      if (/Stopped/.test($('.plx-st', pl).textContent)){ await t.say('Stopped. The finished steps are kept.'); return t.end('Stopped', 'Progress kept'); }
      t.ctx(44); await t.wait(600);
      await t.say("All done. Here's what changed.");
      const rs = t.comp('run-summary'); t.ctx(46);
      $('.plx-f .pill.soft', pl).onclick = () => look(rs);
      await t.wait(1200); t.end('Done', '6 files changed', ['What still needs me?', 'Which spacing tokens did you use?']);
    } },
    team:{ ask:'Redesign the pricing page with three agents', title:'Pricing with three agents', nt:'Three agents on pricing', ic:'users', end:{ g:'ok', t:'Ready to review', m:'3 files' }, ctx:58, run:async t => {
      await t.ask(); t.ctx(10);
      await t.say('Three quick questions before I split the work.');
      const dp = t.comp('decision-prompt'); t.hold(dp, 'Needs your answers', "Pick an answer above, or press Skip and I'll decide for you.");
      t.decide(dp, '.dpx-go', 3);
      await t.until(() => $('.dpx-sum', dp));
      t.status('run', 'Starting 3 agents'); t.ctx(18); await t.wait(1400);
      const run = $('.dpx-run', dp); if (run) run.innerHTML = `<span style="color:var(--ok)">${I('check','xs')}</span><span>Started the redesign</span>`;
      await t.say("I've handed the brief to three agents. Each one passes its work to the next.");
      const al = t.comp('agent-lanes', .6);
      await t.until(() => { const s = $('.aln-t', al).textContent; t.status('run', /paused/.test(s) ? 'Agents paused' : 'Agents working', $('.aln-m', al).textContent); return /finished/.test(s); }, 300);
      t.ctx(52); await t.wait(600);
      await t.say('The reviewer signed off. Here are the changes, ready for you to keep or undo.');
      t.comp('change-review'); t.ctx(58);
      await t.wait(800); t.end('Ready to review', '3 files', ['What did the researcher find?', 'Who signed off?']);
    } },
    dropoff:{ ask:'Where are people dropping off in onboarding?', title:'Onboarding drop-off', nt:'Where onboarding loses people', ic:'chart', end:{ g:'ok', t:'Answered', m:'3 sources' }, ctx:24, run:async t => {
      // the live answer brings the question with it, and its own follow-ups
      const la = t.comp('live-answer'), qb = $('.lva-q .bub', la); if (qb) qb.textContent = t.text; t.ctx(9);
      await t.until(() => { t.status(...($('.lva-p', la) ? ['run', 'Answering'] : ['think', 'Thinking'])); return $('.lva-fu', la); });
      t.ctx(19); await t.wait(700);
      await t.say("I also put last quarter's churn numbers in a doc you can share with the team.");
      t.status('run', 'Writing the doc'); t.doc(t.comp('artifact-card')); t.ctx(24);
      await t.wait(4600); t.end('Answered', '3 sources');
    } },
    annual:{ ask:'Why do annual plans convert better for us?', title:'Why annual converts', nt:'Annual vs monthly conversion', ic:'coins', end:{ g:'ok', t:'Answered', m:'8 sources' }, ctx:17, run:async t => {
      await t.ask(); t.ctx(8);
      const w = t.working('Reading 8 sources'); t.status('tool', 'Reading 8 sources');
      await t.wait(1700); w.remove();
      t.comp('source-stack'); t.ctx(17);
      await t.wait(1700);
      await t.say('Want me to try the crossed-out monthly price on the pricing page?');
      t.end('Answered', '8 sources', ['Try it on the pricing page', 'How sure are you?']);
    } },
    sync:{ ask:"Sync this quarter's deals to the pipeline sheet", title:'Sync deals to Sheets', nt:"This quarter's deals to Sheets", ic:'table', end:{ g:'ok', t:'Recovered', m:'1 retry' }, ctx:31, run:async t => {
      await t.ask(); t.ctx(9);
      const w = t.working('Syncing 1,240 deals'); t.status('run', 'Syncing deals');
      await t.wait(1500); w.remove();
      const er = t.comp('error-recovery'); t.hold(er, 'Needs a decision', "Choose how I should carry on above, and I'll pick it up from there."); t.ctx(14);
      t.decide(er, '.erx-go');
      await t.until(() => { const s = $('.erx-s', er).textContent; if (s === 'Recovering') t.status('run', 'Recovering'); return /Recovered|2 of 3|Maya/.test(s); });
      const s = $('.erx-s', er).textContent; t.ctx(31); await t.wait(600);
      if (/Maya/.test(s)){ await t.say("Maya has the error and the logs. I'll pick it up again when she replies."); return t.status('wait', 'Waiting on Maya', '', null, "Maya hasn't replied yet. I'll carry on as soon as she does."); }
      if (/2 of 3/.test(s)){ await t.say('The summary is posted in #sales. The sheet stays as it was until access is back.'); return t.end('Done', '1 step skipped'); }
      await t.say('All 1,240 deals are in the sheet, and the summary is posted in #sales.');
      t.end('Recovered', '1 retry', ['Who can edit the sheet now?', 'Run this every Monday']);
    } }
  };
  const KEYS = Object.keys(S), HUE = ['#3b82f6', '#7a5af8', '#0ea5a4', '#f97316', '#16a34a'];
  // a follow-up gets a short answer with its sources
  const FU = {
    'What still needs me?':['Just the yearly badge. It overlaps the price on mobile [1], and moving it changes the height of every card [2], so I left that call to you.',
      [['F', '#7a5af8', 'Pricing.fig', 'Mobile frame, 390px'], ['T', '#3b82f6', 'PricingCard.tsx', 'src/components']]],
    'Which spacing tokens did you use?':['Three of them: space-4 inside each card [1], space-6 between cards and space-8 around the grid [1]. No frame uses the old 20px gap any more [2].',
      [['T', '#3b82f6', 'tokens.ts', 'src/styles'], ['F', '#7a5af8', 'Pricing.fig', '6 frames']]],
    'What did the researcher find?':['Three patterns across five competitor pages [1]: one plan highlighted, yearly prices shown per month, and a single button on each card [2]. The designer used all three.',
      [['N', '#0ea5a4', 'Research brief', 'Notion'], ['S', '#635bff', 'stripe.com/pricing', 'Web']]],
    'Who signed off?':['The reviewer agent [1]. Contrast passes AA on every card, and it fixed two lines of copy [2]. Merging still needs a person.',
      [['R', '#16a34a', 'Review notes', 'Reviewer agent'], ['C', '#f97316', 'Contrast report', '14 text pairs']]],
    'Try it on the pricing page':['I made a variant with the monthly price crossed out next to the annual one [1], set up as an A/B test for half of your visitors [2]. Nothing goes live until you start it.',
      [['F', '#7a5af8', 'Pricing v5', 'Figma'], ['E', '#f97316', 'Experiment draft', '50/50 split']]],
    'How sure are you?':['Fairly. The CXL study [1] and our Q3 export [2] point the same way, but our sample is small: 312 annual sign-ups. A two-week test would settle it.',
      [['C', '#d9480f', 'Annual vs monthly anchoring', 'cxl.com'], ['Q', '#16a34a', 'Q3 conversion export.csv', 'Drive']]],
    'Who can edit the sheet now?':['You, Maya and the agent can edit it [1]. The 14 people in #sales can view it [2].',
      [['P', '#16a34a', 'Pipeline 2026', 'Sharing settings'], ['#', '#db2777', '#sales', 'Slack, 14 people']]],
    'Run this every Monday':["Scheduled. Every Monday at 9:00 I'll sync the week's deals and post the summary in #sales [1]. You can pause it any time from Automations [2].",
      [['A', '#3b82f6', 'Weekly pipeline sync', 'Automation'], ['#', '#db2777', '#sales', 'Slack, 14 people']]]
  };
  // anything else gets an honest answer: this preview only knows its five example chats
  const GEN = "This preview only runs five example chats, so I can't look into that one for real. I can fix the pricing page [1], split a redesign between three agents [2], find where onboarding loses people [3], explain why annual plans convert [4] or sync deals to a sheet [5].";
  const ROUTE = [['team', /\b(agents?|researchers?|designers?|reviewers?|split)\b/i], ['sync', /\b(sync|deals?|sheets?|pipeline|crm|sales)\b/i],
    ['annual', /\b(annual|yearly|monthly|convert|conversions?)\b/i], ['dropoff', /\b(drop|dropping|onboarding|funnel|leav(e|ing)|activation|sign-?ups?)\b/i],
    ['pricing', /\b(pric(e|es|ing)|spacing|figma|audit|tighten|grid)\b/i]];
  const route = v => KEYS.find(k => S[k].ask === v) || (ROUTE.find(x => x[1].test(v)) || [])[0];

  /* ---- chats and tabs ---- */
  let n = 0, at = null, vis = null, paneFor = null;
  const CV = [], TABS = [];
  const IDLE = { g:'idle', t:'Ready for a task', m:'' };
  const conv = (title, o) => Object.assign({ id:'c' + ++n, title, st:IDLE, ctx:4, state:'idle' }, o);
  const column = cv => { if (!cv.col){ cv.col = html('<div class="ahx-col off" aria-hidden="true"></div>'); cols.appendChild(cv.col); } return cv.col; };
  const stateOf = g => g === 'ok' ? 'done' : g === 'wait' ? 'wait' : g === 'idle' ? 'idle' : 'run';
  const markOf = cv => cv.unread ? '<span class="dot" style="color:var(--accent-mark,var(--accent))"></span>' : cv.state === 'run' ? '<span class="spin"></span>'
    : cv.state === 'wait' ? '<span class="dot" style="color:var(--warn-mark)"></span>' : '';
  // the quiet mark on a chat's row and its tab: unread, working, or waiting on you
  function mark(cv){
    if (cv.k && cv.k.ff && !cv.ready) return;
    const m = markOf(cv);
    [cv.row, ...TABS.filter(x => x.cv === cv).map(x => x.el)].forEach(el => { const mk = el && $('.ahx-mk', el); if (!mk || mk._m === m) return;
      mk._m = m; mk.innerHTML = m; if (m) enter(mk.firstElementChild); });
  }
  function status(cv, g, t, m = '', act, note){
    // a replay out of sight keeps its last word for when it is shown
    if (cv.k && cv.k.ff && !cv.ready){ cv.fst = { g, t, m }; return; }
    cv.st = { g, t, m, act }; cv.state = stateOf(g); cv.note = note;
    mark(cv); if (cv === vis){ showStatus(cv.st); busy(); }
  }
  function busy(){
    const run = !!vis && vis.state === 'run'; root.classList.toggle('busy', run);
    if (ta) ta.placeholder = !vis ? 'Ask the agent to do something' : run ? 'The agent is working…' : 'Reply';
  }

  /* what a story can do: say something, bring in a component, gather work under one line, wait on the person, and keep the header honest */
  function turn(cv, k, text, files){
    const ff = k.ff, add = (el, into = cv.col) => { into.appendChild(el); if (!ff) enter(el); return el; };
    const t = {
      text, ff,
      wait: ms => k.wait(ms),
      until: async (fn, step = 120) => { while (!fn()) await (ff ? k.raw(16) : k.wait(step)); },
      status: (g, tx, m, act, note) => status(cv, g, tx, m, act, note),
      // waiting on the person: the pill offers Review, and a message sent meanwhile gets this note back
      hold: (host, tx, note) => status(cv, 'wait', tx, '', host, note),
      ctx: v => { cv.ctx = v; if (cv === vis && !ff) ring(v); },
      async ask(quiet){
        add(html(`<div class="bub">${files && files.length ? `<div class="ahx-fs">${files.map(f => `<span class="fchip">${I('clip','xs')}${esc(f)}</span>`).join('')}</div>` : ''}${esc(text)}</div>`));
        if (cv === vis && !ff) stick = true;
        if (!quiet){ status(cv, 'think', 'Thinking'); await k.wait(700); }
      },
      async say(tx){
        const p = html('<p class="msg ahx-say"></p>'); cv.col.appendChild(p);
        for (const w of tx.split(' ')){ p.insertAdjacentHTML('beforeend', `<span class="w">${esc(w)} </span>`); await k.wait(26 + Math.random() * 30); }
        await k.wait(260);
      },
      comp(name, f = 1, into = cv.col){
        const tp = tplOf(name), host = html(`<div class="ahx-msg${BOXED.includes(name) ? ' box' : ''}"></div>`);
        if (tp) host.append(tp.content.cloneNode(true));
        into.appendChild(host);
        if (tp && DM.defs[name]) try { DM.defs[name](host, paced(k, f), host); } catch(e){ console.error(name, e); }
        if (!ff) reveal(host);
        return host;
      },
      // the agent's work under one line: open while it runs, folded into a summary when it is done
      group(label){
        const g = add(html(`<div class="ahx-wk"><button class="ahx-wh" aria-expanded="true"><span class="g"><span class="spin"></span></span><span class="t shim">${label}</span><span class="m num"></span>${I('chev-d','xs')}</button><div class="fold ahx-wb"><div><div class="ahx-wl"></div></div></div></div>`));
        const h = $('.ahx-wh', g), fo = $('.ahx-wb', g), body = $('.ahx-wl', g), t0 = performance.now();
        let mine = false;
        const open = o => { fo.classList.toggle('shut', !o); h.setAttribute('aria-expanded', o); };
        h.onclick = () => { mine = true; open(fo.classList.contains('shut')); };
        return { comp:(name, f) => t.comp(name, f, body), done(tx, secs){
          const tt = $('.t', h), gl = $('.g', h); tt.classList.remove('shim'); if (ff) tt.textContent = tx; else swap(tt, tx);
          $('.m', h).textContent = (ff ? secs : Math.max(1, Math.round((performance.now() - t0) / 1000))) + 's';
          gl.innerHTML = I('check','xs'); if (!ff) enter(gl.firstElementChild);
          if (ff) open(false); else k.later(1200, () => { if (!mine) open(false); });
        } };
      },
      working: tx => add(html(`<div class="lva-th"><span class="think on" style="color:var(--fg2)"><i></i><i></i><i></i><i></i></span><span class="shim">${tx}</span></div>`)),
      // a past chat gives the answer it was given back then; a live one leaves it to the person
      decide(host, sel, times = 1){ if (ff) for (let i = 0; i < times; i++){ const b = $(sel, host); if (b && !b.disabled) b.click(); } },
      // the Artifact card shows the churn report, and its Open puts it in the panel beside the chat
      doc(af){ const api = $('.afx', af) && $('.afx', af)._afx; if (!api) return; api.use(CHURN, { open:i => openPane(cv, i), openLabel:'Open beside the chat' }); },
      // a short answer in the Live answer's own shape: a thought you can open, cited words, and the sources under it
      async answer(tx, src, steps, go){
        const box = add(html('<div class="lva-turn"></div>'));
        const th = html(`<div class="lva-th"><span class="think on" style="color:var(--fg2)"><i></i><i></i><i></i><i></i></span><span class="shim">Thinking</span></div>`);
        box.appendChild(th); status(cv, 'think', 'Thinking'); await k.wait(1100);
        const tb = html(`<button class="lva-th lva-tb" aria-expanded="false"><span>${steps.length} steps · 1s</span>${I('chev-d','xs')}</button>`);
        const tl = html(`<div class="fold shut lva-tl"><div><ul class="lva-tlist">${steps.map(x => `<li>${x}</li>`).join('')}</ul></div></div>`);
        th.replaceWith(tb); tb.after(tl);
        tb.onclick = () => { const s = tl.classList.toggle('shut'); tb.setAttribute('aria-expanded', !s); };
        status(cv, 'run', 'Answering');
        const p = html('<p class="lva-p"></p>'); box.appendChild(p);
        for (const tok of tx.split(' ')){
          const m = tok.match(/^\[(\d)\](.*)$/), prev = p.lastElementChild;
          if (m && prev){ prev.textContent = prev.textContent.replace(/ $/, ''); prev.style.whiteSpace = 'nowrap'; prev.insertAdjacentHTML('beforeend', `<span class="cite" data-tip="${esc(src[m[1] - 1][2])}">${m[1]}</span>${esc(m[2])} `); }
          else p.insertAdjacentHTML('beforeend', `<span class="w">${esc(tok)} </span>`);
          await k.wait(40 + Math.random() * 40);
        }
        const sr = html(`<div class="lva-src"><span class="lva-acts"><button class="ib" aria-label="Copy" data-tip="Copy">${I('copy')}</button><button class="ib" aria-label="Good answer" data-tip="Good answer">${I('up-thumb')}</button><button class="ib" aria-label="Bad answer" data-tip="Bad answer">${I('down-thumb')}</button></span><button class="lva-sb" aria-expanded="false"><span class="lva-fav">${src.map(x => `<span style="background-color:${x[1]}">${esc(x[0][0])}</span>`).join('')}</span>${src.length} sources${I('chev-d','xs')}</button></div>`);
        const ls = html(`<div class="fold shut lva-ls"><div><div class="lva-ll">${src.map((x, i) => `<button class="lva-s" data-n="${i + 1}"><span class="n">${i + 1}</span><span class="t">${esc(x[2])}</span><span class="d">${esc(x[3])}</span>${I(go ? 'right' : 'ext','xs')}</button>`).join('')}</div></div></div>`);
        box.append(sr, ls); if (!ff) enter(sr);
        const sb = $('.lva-sb', sr), show = o => { ls.classList.toggle('shut', !o); sb.setAttribute('aria-expanded', o); };
        sb.onclick = () => show(ls.classList.contains('shut'));
        /* hover previews a source, a click pins it; in the honest answer a source is an example chat, and a click opens it */
        let pinned = '';
        const hl = nn => { $$('.cite', p).forEach(x => x.classList.toggle('on', x.textContent === nn)); $$('.lva-s', ls).forEach(x => x.classList.toggle('on', x.dataset.n === nn)); };
        const pick = nn => { pinned = pinned === nn ? '' : nn; if (pinned) show(true); hl(pinned); };
        $$('.lva-s', ls).forEach(x => { x.onmouseenter = () => hl(x.dataset.n); x.onmouseleave = () => hl(pinned); x.onclick = () => go ? go(x.dataset.n - 1) : pick(x.dataset.n); });
        $$('.cite', p).forEach(x => { x.style.cursor = 'pointer'; x.onmouseenter = () => hl(x.textContent); x.onmouseleave = () => hl(pinned); x.onclick = () => pick(x.textContent); });
        const acts = $$('.lva-acts .ib', sr);
        acts[0].onclick = () => { const cl = p.cloneNode(true); $$('.cite', cl).forEach(x => x.remove()); copied(acts[0], cl.textContent.replace(/\s+/g, ' ').trim()); };
        [1, 2].forEach(i => acts[i].onclick = () => { const on = !acts[i].classList.contains('on'); acts[1].classList.remove('on'); acts[2].classList.remove('on'); acts[i].classList.toggle('on', on); });
      },
      end(tx, m, fu){
        status(cv, 'ok', tx, m);
        if (fu){ const el = html(`<div class="lva-fu">${fu.map(x => `<button>${I('chev-r','xs')}${esc(x)}</button>`).join('')}</div>`); cv.col.appendChild(el); cv.fu = el;
          if (!ff) stagger($$('button', el), 90); $$('button', el).forEach(b => b.onclick = () => { if (cv.state !== 'run') converse(cv, b.textContent); }); }
        if (!ff && cv !== vis){ cv.unread = true; mark(cv); }
      }
    };
    return t;
  }
  function play(cv, fn, text, files, ff){
    column(cv); const k = paced(c, ff ? .02 : 1); k.ff = !!ff; cv.k = k;
    if (ff){ cv.ready = false; cv.col.classList.add('ff'); } else status(cv, 'think', 'Thinking');
    k.run(async () => {
      await fn(turn(cv, k, text, files));
      if (!ff) return;
      // the real-time parts (counters, crossfades) settle before the replay is shown
      await new Promise(res => c.later(1300, res));
      cv.ready = true; cv.col.classList.remove('ff'); if (cv.fst){ cv.st = cv.fst; cv.state = stateOf(cv.st.g); } mark(cv);
      if (cv === vis){ showStatus(cv.st); ring(cv.ctx); toEnd(); busy(); }
    });
  }
  // a past chat replays out of sight the first time it could be wanted
  const warm = cv => { if (cv.past && !cv.k) play(cv, S[cv.s].run, S[cv.s].ask, null, true); };
  async function generic(t){
    await t.ask();
    const past = CV.filter(x => x.past);
    await t.answer(GEN, past.map((x, i) => [S[x.s].title[0], HUE[i], x.title, 'Example chat']), ['Read your message', 'Looked through the five example chats', 'None of them covers this yet'], i => open(past[i]));
    t.end('Answered', '5 examples', KEYS.slice().sort(() => Math.random() - .5).slice(0, 2).map(k => S[k].ask));
  }
  // what the person sends in a chat: a follow-up, one of the stories, or anything else
  function converse(cv, text, files){
    if (cv.fu){ cv.fu.remove(); cv.fu = null; }
    // while the agent waits on an answer above, a message gets a short note back and the story keeps waiting
    if (cv.state === 'wait'){ const k = paced(c, 1), t = turn(cv, k, text, files);
      k.run(async () => { await t.ask(true); await k.wait(600); await t.say(cv.note || "I'll pick that up once you've answered above."); }); return; }
    const f = FU[text], s = !f && route(text);
    play(cv, f ? async t => { await t.ask(); await t.answer(f[0], f[1], ['Read the chat so far', 'Checked the sources']); t.end('Answered', f[1].length + ' sources'); }
      : s ? S[s].run : generic, text, files);
  }

  /* ---- the side: chats, search, the workspace ---- */
  function row(cv){
    cv.row = html(`<button class="ahx-cv" aria-current="false"><span class="t">${esc(cv.title)}</span><span class="ahx-mk"></span></button>`);
    cv.row.onclick = () => { open(cv); drawer(false); };
    cv.row.onpointerenter = () => warm(cv);
    mark(cv); return cv.row;
  }
  const sf = $('.ahx-sf', r), si = $('.ahx-si', r), none = $('.ahx-none', r);
  const filter = () => { const v = si.value.trim().toLowerCase(); let k = 0; CV.forEach(cv => { const on = !v || cv.title.toLowerCase().includes(v); cv.row.hidden = !on; k += on; }); none.hidden = k > 0; };
  const search = o => { sf.classList.toggle('shut', !o); if (o) si.focus({ preventScroll:true }); else { si.value = ''; filter(); } };
  $('.ahx-sb', r).onclick = () => search(sf.classList.contains('shut'));
  si.oninput = filter;
  si.onkeydown = e => { if (e.key === 'Escape'){ e.stopPropagation(); search(false); } };
  const WS = [['D', 'DesignMe Studio', 'var(--ink)', 'var(--on-ink)'], ['P', 'Personal', 'var(--pl)', '#fff']];
  wsp.innerHTML = WS.map((w, i) => `<button class="mi" role="menuitemradio" aria-checked="${i === 0}" data-close data-i="${i}"><span class="ahx-lg" style="background:${w[2]};color:${w[3]}">${w[0]}</span><span>${w[1]}</span><span class="ck">${I('check','xs')}</span></button>`).join('');
  $$('.mi', wsp).forEach(b => b.onclick = () => { const w = WS[b.dataset.i], lg = $('.ahx-wsb .ahx-lg', r);
    $$('.mi', wsp).forEach(x => x.setAttribute('aria-checked', x === b)); swap($('.ahx-wsb .t', r), w[1]); lg.textContent = w[0]; lg.style.background = w[2]; lg.style.color = w[3]; });
  // the side folds away on a wide card and slides in over the chat on a narrow one
  const narrow = () => root.clientWidth <= 620;
  const drawer = o => root.classList.toggle('dr', o);
  $('.ahx-menu', r).onclick = () => narrow() ? drawer(true) : root.classList.remove('ns');
  $('.ahx-hide', r).onclick = () => narrow() ? drawer(false) : root.classList.add('ns');
  $('.ahx-scrim', r).onclick = () => drawer(false);

  /* ---- tabs ---- */
  /* on a phone the tabs fold into one: the count beside it lists every open chat, and picking one brings it to the front */
  const tn = $('.ahx-tn', r), tp = $('.ahx-tp', r);
  const count = () => { tn.hidden = TABS.length < 2; $('.num', tn).textContent = TABS.length; };
  tn.onclick = () => {
    tp.innerHTML = TABS.map((x, i) => `<button class="mi" role="menuitemradio" aria-checked="${x === at}" data-close data-i="${i}"><span class="ahx-mk">${x.cv ? markOf(x.cv) : ''}</span><span class="t">${esc(x.cv ? x.cv.title : 'New chat')}</span><span class="ck">${I('check','xs')}</span></button>`).join('');
    $$('.mi', tp).forEach(b => b.onclick = () => { const x = TABS[+b.dataset.i]; if (x && x !== at) activate(x); });
  };
  function tab(cv, after){
    const tb = { cv, draft:'' };
    tb.el = html(`<div class="ahx-tab"><button class="ahx-tb"><span class="ahx-mk"></span><span class="t"></span></button><button class="ahx-tx" aria-label="Close tab" data-tip="Close tab">${I('x')}</button></div>`);
    $('.t', tb.el).textContent = cv ? cv.title : 'New chat';
    $('.ahx-tb', tb.el).onclick = () => activate(tb);
    $('.ahx-tx', tb.el).onclick = () => close(tb);
    const i = after ? TABS.indexOf(after) + 1 : TABS.length; TABS.splice(i, 0, tb);
    tabsEl.insertBefore(tb.el, TABS[i + 1] ? TABS[i + 1].el : null);
    enter(tb.el); if (cv) mark(cv); count(); return tb;
  }
  function activate(tb, first){
    if (at && at !== tb) at.draft = ta.value;
    // on a phone only the tab on screen shows, so the one coming to the front comes in
    if (at && at !== tb && !first && narrow()) enter(tb.el);
    at = tb;
    TABS.forEach(x => { x.el.classList.toggle('on', x === tb); const b = $('.ahx-tb', x.el); x === tb ? b.setAttribute('aria-current', 'true') : b.removeAttribute('aria-current'); });
    view(tb.cv, first);
    if (ta){ ta.value = tb.draft || ''; input(); }
    inView(first);
  }
  // the tab on screen is always in view, also when the status pill beside the tabs grows
  function inView(now){
    if (!at) return; const L = at.el.offsetLeft, R = L + at.el.offsetWidth, sl = tabsEl.scrollLeft, w = tabsEl.clientWidth;
    if (L < sl || R > sl + w) tabsEl.scrollTo({ left:L < sl ? L - 4 : R - w + 4, behavior:REDUCE || now ? 'auto' : 'smooth' });
  }
  const tro = new ResizeObserver(() => inView(true)); tro.observe(tabsEl); c.offs.push(() => tro.disconnect());
  function close(tb){
    const i = TABS.indexOf(tb), el = tb.el; TABS.splice(i, 1); hideTip(); count();
    // the tab folds shut instead of vanishing
    el.style.pointerEvents = 'none';
    if (REDUCE) el.remove(); else el.animate([{ minWidth:el.offsetWidth + 'px', flexBasis:el.offsetWidth + 'px', opacity:1 }, { minWidth:'0px', flexBasis:'0px', opacity:0 }], { duration:220, easing:'cubic-bezier(.22,1,.36,1)', fill:'forwards' }).onfinish = () => el.remove();
    if (!TABS.length) return activate(tab(null));
    if (at === tb){ at = null; activate(TABS[Math.min(i, TABS.length - 1)]); }
  }
  // a chat comes to the front if it is open, takes over an untouched New chat tab, or opens a tab beside the one on screen
  function open(cv){
    const has = TABS.find(x => x.cv === cv); if (has) return activate(has);
    if (at && !at.cv && !(ta && ta.value.trim())){ at.cv = cv; swap($('.t', at.el), cv.title); mark(cv); return view(cv); }
    activate(tab(cv, at));
  }
  const fresh = () => { drawer(false); const h = TABS.find(x => !x.cv); activate(h || tab(null, at)); };
  $('.ahx-new', r).onclick = fresh; $('.ahx-plus', r).onclick = fresh;

  /* ---- what is on screen: New chat, or one chat's column ---- */
  function view(cv, first){
    if (vis && vis !== cv && vis.col){ vis.col.classList.add('off'); vis.col.setAttribute('aria-hidden', 'true'); }
    if (paneFor && paneFor !== cv) shutPane();
    vis = cv; main.classList.toggle('home', !cv);
    if (!cv){
      ro.disconnect();
      if (!first) enter($('.ahx-hi', r));
    } else {
      column(cv); warm(cv);
      const was = cv.col.classList.contains('off');
      cv.col.classList.remove('off'); cv.col.removeAttribute('aria-hidden');
      cv.unread = false; mark(cv);
      ro.disconnect(); ro.observe(cv.col); toEnd();
      if (was && !first) enter(cv.col);
    }
    CV.forEach(x => x.row && x.row.setAttribute('aria-current', x === cv));
    showStatus(cv ? cv.st : IDLE, first); ring(cv ? cv.ctx : 0); busy();
  }

  /* ---- New chat: the mark and a greeting over the composer; sending turns the tab into that chat ---- */
  const hr = new Date().getHours();
  $('.ahx-hi span', r).textContent = hr < 5 || hr >= 18 ? 'Good evening' : hr < 12 ? 'Good morning' : 'Good afternoon';
  function start(text, files, s){
    if (!at || at.cv) return;
    // a chat started now gets a title of its own, beside the past chat of the same story
    const title = s ? S[s].nt : (w => w ? w[0].toUpperCase() + w.slice(1) : 'New chat')(text.replace(/[.?!][\s\S]*$/, '').split(/\s+/).slice(0, 5).join(' '));
    const cv = conv(title, { state:'run' });
    CV.unshift(cv); list.prepend(row(cv)); enter(cv.row); filter();
    at.cv = cv; swap($('.t', at.el), title); view(cv);
    converse(cv, text, files);
  }
  // a message goes to the chat on screen, or starts one from New chat, instead of the composer's own little thread
  function sendNow(){
    const v = ta.value.trim(), files = $$('.fchip', att).map(f => f.textContent.trim());
    if (!v && !files.length) return;
    if (vis && vis.state === 'run') return;
    att.innerHTML = ''; ta.value = ''; input(); if (at) at.draft = '';
    if (!vis) start(v || 'Have a look at these files.', files);
    else converse(vis, v || 'Have a look at these files.', files);
  }
  if (ta){
    c.on(root, 'keydown', e => { if (e.target === ta && e.key === 'Enter' && !e.shiftKey && $('.cpx-box', root).dataset.mode === 'idle'){ e.preventDefault(); e.stopPropagation(); sendNow(); } }, true);
    c.on(root, 'click', e => { if (e.target.closest('.cpx-bar .cpx-send')){ e.stopPropagation(); sendNow(); } }, true);
  }
  c.on(root, 'keydown', e => { if (e.key !== 'Escape') return; if (root.classList.contains('dr')) drawer(false); else if (root.classList.contains('pn')) shutPane(); });

  /* ---- the panel beside the chat: an artifact opened from its card. On a wide card the chats fold away to make room ---- */
  let folded = false;
  // the report the dropoff chat writes, in three versions, and the monthly churn each one charts
  const CHURN = { title:'Churn analysis, Q3', kind:'Report', icon:'file-text', file:'churn-analysis-q3', ext:'md', mime:'text/markdown',
    steps:['Reading the billing export…', 'Charting churn by month…', 'Checking the July spike…'], versions:[
    { ago:'yesterday', when:'edited yesterday', note:'First draft', summary:'First pass at churn by month, sources still to check.',
      findings:['Churn peaked at 4.3% in June and eased to 3.6% by September.'], changes:['Charted churn by month, April to September'], b:[3.4,3.9,4.3,4.1,3.8,3.6] },
    { ago:'1 hour ago', when:'edited 1 hour ago', note:'Added the July spike', summary:'Churn rose in July, the spike lines up with the pricing change.',
      findings:['Churn jumped to 5.8% in July, the month the new prices went live.', 'It eased to 3.9% by September.'], changes:['Checked the billing export against Amplitude', 'Added the July spike'], b:[3.4,3.9,4.1,5.8,4.7,3.9] },
    { ago:'2 min ago', when:'edited 2 min ago', note:'Final, with your fixes', summary:'Churn rose in July, then settled once onboarding emails went out.',
      findings:['Churn jumped to 5.8% in July, the month the new prices went live.', 'It fell to 3.1% in September, after the onboarding emails went out in August.'], changes:['Added the onboarding emails', 'Applied your fixes'], b:[3.4,3.9,4.1,5.8,4.5,3.1] }
  ] };
  // the report drawn flat: its title, the version's line, the latest month against the peak, and a smooth line through the months
  function churnDoc(i){
    const v = CHURN.versions[i], M = ['April','May','June','July','August','September'], last = v.b[v.b.length - 1], top = Math.max(...v.b), id = 'ahx-g' + Math.random().toString(36).slice(2, 8);
    const p = v.b.map((x, k) => [k / (v.b.length - 1) * 300, 52 - (x - 2.6) / 3.6 * 46]);
    const d = p.reduce((s, q, k, a) => { if (!k) return `M${q[0]} ${q[1]}`; const p0 = a[k - 2] || a[k - 1], p1 = a[k - 1], p3 = a[k + 1] || q, t = .18; return s + ` C${p1[0] + (q[0] - p0[0]) * t} ${p1[1] + (q[1] - p0[1]) * t} ${q[0] - (p3[0] - p1[0]) * t} ${q[1] - (p3[1] - p1[1]) * t} ${q[0]} ${q[1]}`; }, '');
    return html(`<div class="ahx-doc"><div class="ahx-dh">${CHURN.title}</div><div class="ahx-dp">${v.summary}</div><div class="ahx-kp"><b class="num">${last.toFixed(1)}%</b><span class="ahx-dd">−${(top - last).toFixed(1)} pts since ${M[v.b.indexOf(top)]}</span></div>`
      + `<svg class="ahx-ch" viewBox="0 0 300 56" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--accent-mark,var(--accent));stop-opacity:.16"/><stop offset="1" style="stop-color:var(--accent-mark,var(--accent));stop-opacity:0"/></linearGradient></defs><path fill="url(#${id})" d="${d} L300 56 L0 56 Z"/><path class="ln" d="${d}"/></svg>`
      + `<div class="ahx-ax"><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span></div></div>`);
  }
  let paneFrom = null;
  function openPane(cv, i){
    if (root.contains(document.activeElement) && !pane.contains(document.activeElement)) paneFrom = document.activeElement;
    paneFor = cv;
    if (!narrow() && !root.classList.contains('ns')){ root.classList.add('ns'); folded = true; }
    const pb = $('.ahx-pb', pane), doc = churnDoc(i);
    $('.ahx-ph .t', pane).textContent = CHURN.title;
    pb.innerHTML = ''; pb.append(doc, html(`<div class="ahx-pn"><b>What moved it</b><p>The July spike lines up with the pricing change on July 3. Churn settled once the onboarding emails went out in August.</p><b>Sources</b><p>Billing export for Q3, retention in Amplitude, and the onboarding email stats.</p></div>`));
    root.classList.add('pn'); pane.removeAttribute('aria-hidden');
    if (!REDUCE) stagger([...pb.children], 70, 140);
  }
  // closing it with the focus inside gives the focus back to what opened it, or to the message box
  function shutPane(){ const back = pane.contains(document.activeElement); paneFor = null; root.classList.remove('pn'); pane.setAttribute('aria-hidden', 'true'); if (folded){ root.classList.remove('ns'); folded = false; }
    if (back){ const to = paneFrom && paneFrom.isConnected && paneFrom.getClientRects().length ? paneFrom : ta; if (to) to.focus({ preventScroll:true }); } }
  $('.ahx-px', r).onclick = shutPane;
  $('.ahx-pl', r).onclick = e => copied(e.currentTarget, 'https://designme.dev/a/churn-q3');

  /* ---- the five example chats, finished; New chat on screen, and nothing plays until someone starts it ---- */
  KEYS.forEach(s => { const cv = conv(S[s].title, { s, past:true, st:S[s].end, ctx:S[s].ctx, state:'done', unread:s === 'sync' }); CV.push(cv); list.appendChild(row(cv)); });
  activate(tab(null), true);
  CV.forEach((cv, i) => c.later(400 + i * 140, () => warm(cv)));
});