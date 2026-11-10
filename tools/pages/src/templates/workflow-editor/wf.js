/* Workflow editor template: the data and every interaction. It runs after the shared core (core.js), so it uses the core's
   helpers ($, $$, I, swap, enter, stagger, seg, html, closePops) and its popovers (data-pop) and tooltips (data-tip). The
   workspace, people, leads and runs are made up. A test run is worked out from the graph on the canvas (which steps run, in
   what order, which path the branch takes, what each step hands on), so editing the workflow changes what the next run does.
   The step inspector, the data picker and the run drawer are the library's Step inspector, Data picker and Run drawer, drawn
   with their classes and driven from here. The parts the library doesn't have yet are written as self-contained pieces with a
   wfx- prefix, so they can be promoted: the step node and edge inserter (canvas), the step picker, the agent's fix card and
   the version history. */
(() => {
  const app = document.querySelector('.wf'); if (!app) return;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
  const sum = (a, f = x => x) => a.reduce((t, x) => t + f(x), 0);
  const secs = v => (v < 10 ? v.toFixed(1) : Math.round(v)) + 's';

  /* ---------- motion: the library's durations and ease (--dm-t, --dm-t-fast, --dm-ease), read live so Soft and Blueprint keep
     their own feel. Everything that opens or closes moves, and nothing moves with reduced motion ---------- */
  const MT = v => (parseFloat(getComputedStyle(app).getPropertyValue(v)) || .3) * 1000;
  const EASE = () => getComputedStyle(app).getPropertyValue('--dm-ease').trim() || 'ease-out';
  const BOX = ['marginTop', 'marginBottom', 'paddingTop', 'paddingBottom'];
  // a block that joins a list opens its own room, so what is under it glides down instead of jumping
  function grow(el){
    if (!el || REDUCE) return el;
    const cs = getComputedStyle(el), a = { height:'0px' }, b = { height:el.offsetHeight + 'px' }; BOX.forEach(p => { a[p] = '0px'; b[p] = cs[p]; });
    el.style.overflow = 'hidden'; const done = () => { el.style.overflow = ''; };
    el.animate([a, b], { duration:MT('--dm-t'), easing:EASE() }).finished.then(done, done);
    return el;
  }
  // and one that leaves fades and closes its room, then goes; gap is the list's gap, closed with it
  function shrink(el, { delay = 0, gap = 0, fade = true, dur = MT('--dm-t') * .7 } = {}){
    if (!el) return;
    if (REDUCE || !el.isConnected || !el.offsetHeight){ el.remove(); return; }
    const cs = getComputedStyle(el), a = { height:el.offsetHeight + 'px' }, b = { height:'0px' };
    BOX.forEach(p => { a[p] = cs[p]; b[p] = '0px'; }); if (gap){ a.marginBottom = cs.marginBottom; b.marginBottom = -gap + 'px'; }
    if (fade){ a.opacity = 1; b.opacity = 0; }
    el.style.overflow = 'hidden'; el.style.pointerEvents = 'none'; el.inert = true;
    const go = () => el.remove();
    el.animate([a, b], { duration:dur, delay, easing:EASE(), fill:'forwards' }).finished.then(go, go);
  }
  // a list a search narrows (the step picker, the data picker, the app catalogue): while its popover is open and the query
  // changes, the rows that still match glide to their places, new ones fade in and the ones that no longer match fade where
  // they were (the core's reflow()); opening it just draws it. key(el) names each row
  function listTo(ls, h, sel, key, q, pop){
    const put = () => { ls.innerHTML = h; $$(sel, ls).forEach(x => { x.dataset.key = key(x); }); };
    const go = ls._q !== undefined && ls._q !== q && pop.classList.contains('open'); ls._q = q;
    go ? reflow(() => $$(sel, ls), put, { root:pop, host:ls }) : put();
  }
  // the focus ring is the keyboard's alone: once a mouse or a finger was used, no control shows one, not even one a script hands
  // the focus back to (a menu closing onto its button); the next key brings it back
  const modality = k => { document.documentElement.dataset.wfInput = k; };
  document.addEventListener('pointerdown', () => modality('pointer'), true);
  document.addEventListener('keydown', e => { if (!['Shift', 'Control', 'Alt', 'Meta', 'CapsLock', 'Fn'].includes(e.key)) modality('key'); }, true);

  /* ---------- people, step kinds, models and connections ---------- */
  const P = { MK:['Maya Kim', 'l'], TR:['Theo Reed', 't'], AN:['Ana Novak', 'p'], JB:['Jonah Brooks', 'm'] };
  const ME = 'AN';
  const avOf = (ini, hue) => `<span class="av" style="background:var(--dm-av-${hue});color:var(--dm-av-${hue}-ink)" aria-hidden="true">${ini}</span>`;
  const av = id => avOf(id, P[id][1]);
  const first = id => P[id][0].split(' ')[0];
  const VIA = { 'Slack message':'a Slack message', Email:'an email', 'In the app':'the app' };
  const TYPES = { trigger:{ k:'Trigger', ic:'bolt' }, ai:{ k:'AI step', ic:'spark' }, tool:{ k:'Tool', ic:'globe' }, app:{ k:'App step', ic:'send' },
    branch:{ k:'Branch', ic:'branch' }, wait:{ k:'Wait', ic:'clock' }, approval:{ k:'Approval', ic:'user' }, output:{ k:'Output', ic:'hash' } };
  const MODELS = [['Sonnet 5.5', 'Balanced, the default'], ['Opus 5.5', 'Deepest reasoning, slower'], ['Haiku 5.5', 'Fastest and cheapest']];
  const CONNS = { mail:['sales@fernhill.co', 'ana@fernhill.co'], hash:['Fernhill on Slack'], users:['Email marketing'], db:['Fernhill CRM', 'Data warehouse'], globe:['Company data API', 'Web search'], other:['Fernhill CRM', 'Webhook'] };
  // the tools an AI step can call: icon, name, connection, what it does, what it hands on, and its kind (its tile's colour)
  const TOOLS = [['globe', 'Company lookup', 'Company data API', 'Finds a company by its email domain', [['employees', 'number', '420'], ['industry', 'text', 'Software']], 'data'],
    ['search', 'Web search', 'Web search', 'Searches the web and keeps the top results', [['results', 'list', '5 pages'], ['top_url', 'text', 'corvid.io/about']], 'web'],
    ['db', 'CRM lookup', 'Fernhill CRM', 'Reads a contact and its deals from the CRM', [['contact', 'text', 'Priya Shah'], ['open_deals', 'number', '0']], 'data'],
    ['file-text', 'Read a page', 'Web search', 'Reads the text of a web page', [['text', 'text', 'Corvid builds analytics']], 'web'],
    ['code', 'Run code', 'Built in', 'Runs a short script on the data so far', [['result', 'object', '{ 3 fields }']], 'code'],
    ['file', 'Read a file', 'Built in', 'Reads the text of an attached PDF or document', [['text', 'text', 'Order form, 2 pages']], 'code']];
  const TKIND = { data:['Data', 'pt'], web:['Web', 'pb'], code:['Built in', 'pk'] };
  // the tools the workspace has turned on; Connected apps adds the others
  const WS_TOOLS = new Set(['Company lookup', 'Web search', 'CRM lookup', 'Read a page']);
  // the CRM's sign-in has expired until it is connected again (Connected apps), so the workflows that use it fail with a 401
  let crmExpired = true;

  /* ---------- the step catalogue: what the picker offers ---------- */
  const CAT = [
    { g:'Agent', items:[
      { type:'ai', ic:'spark', t:'Ask a model', d:'Decides, answers or writes from your instructions' },
      { type:'ai', ic:'filter', t:'Sort into groups', d:'Puts the input under one of a few labels' },
      { type:'ai', ic:'file-text', t:'Pull out fields', d:'Turns free text into named fields' },
      { type:'ai', ic:'edit', t:'Write a draft', d:'Drafts an email, a message or a note' } ] },
    { g:'Apps', items:[
      { type:'app', ic:'mail', t:'Send an email', d:'Sends from a connected inbox' },
      { type:'output', ic:'hash', t:'Post a message', d:'Posts to a Slack channel' },
      { type:'app', ic:'db', t:'Update the CRM', d:'Creates or updates a contact or a deal' },
      { type:'app', ic:'users', t:'Add to a list', d:'Adds the person to an email list' },
      { type:'app', ic:'globe', t:'Call an API', d:'Sends a request to any web address' } ] },
    { g:'Flow', items:[
      { type:'branch', ic:'branch', t:'Branch', d:'Sends the run down one of two paths' },
      { type:'wait', ic:'clock', t:'Wait', d:'Pauses the run for a while' },
      { type:'approval', ic:'user', t:'Ask a person', d:'Holds the run until someone approves' } ] }
  ];

  /* ---------- test data: three leads for the form, and their research ---------- */
  const LEADS = [
    { k:'priya', n:'Priya Shah', ini:'PS', hue:'b', co:'Corvid Analytics', email:'priya@corvid.io', seats:240, score:84, tier:'Enterprise', emp:420, ind:'Analytics software', fund:'Series B', fail:1, msg:'We want agents on our support queue before Q1.', why:['Asked for 240 seats', 'Support team use case', 'Series B and hiring'] },
    { k:'tom', n:'Tom Becker', ini:'TB', hue:'y', co:'Becker Studio', email:'tom@beckerstudio.de', seats:3, score:31, tier:'Starter', emp:4, ind:'Design studio', fund:'Self-funded', fail:0, msg:'Just exploring for a side project.', why:['3 seats', 'No support team', 'Exploring for now'] },
    { k:'hana', n:'Hana Ito', ini:'HI', hue:'r', co:'Brightline Health', email:'hana.ito@brightline.health', seats:60, score:72, tier:'Growth', emp:180, ind:'Healthcare', fund:'Series A', fail:0, last:true, msg:'We need routing for patient support tickets.', why:['60 seats', 'Support team use case', 'Needs a security review'] }
  ];

  /* ---------- the workflows ---------- */
  let nid = 100;
  const N = (type, t, o = {}) => {
    const n = { id:o.id || 'n' + (++nid), type, t, ic:o.ic || TYPES[type].ic, ref:o.ref || (t.toLowerCase().replace(/[^a-z]+/g, '_').replace(/^_|_$/g, '').split('_').slice(0, 2).join('_') || type), cfg:o.cfg || {}, out:o.out || null, host:o.host || null, off:false };
    return ensure(n);
  };
  function ensure(n){
    const c = n.cfg;
    if (n.type === 'ai'){ c.model ??= 'Sonnet 5.5'; c.prompt ??= n.t + '.'; c.tools ??= []; c.in ??= {}; }
    if (['tool', 'app', 'output'].includes(n.type)){ c.conn ??= (CONNS[n.ic] || CONNS.other)[0]; c.in ??= {}; c.retries ??= 1; c.backoff ??= 'fixed'; c.limit ??= n.type === 'tool' ? '8s' : '30s'; c.onfail ??= 'stop'; }
    if (n.type === 'ai'){ c.retries ??= 0; c.backoff ??= 'fixed'; c.limit ??= '60s'; c.onfail ??= 'stop'; }
    if (n.type === 'tool') c.cache ??= false;
    if (n.type === 'branch') c.rule ??= { v:'', op:'is at least', n:50 };
    if (n.type === 'approval'){ c.who ??= ['MK']; c.via ??= 'Slack message'; c.expire ??= '24 hours'; c.then ??= 'Stop the run'; }
    if (n.type === 'wait') c.for ??= '1 hour';
    if (n.type === 'trigger') c.source ??= 'Webhook';
    if (!n.out) n.out = { trigger:[['payload', 'object', '{ 4 fields }']], ai:[['text', 'text', 'The answer']], tool:[['result', 'object', '{ 6 fields }']], app:[['id', 'text', 'rec_5521']],
      branch:[['path', 'text', 'Yes']], approval:[['decision', 'text', 'Approved'], ['by', 'text', 'Maya Kim']], output:[['ts', 'text', '1731062520.4']], wait:[] }[n.type];
    return n;
  }
  const uniq = n => { if (!W) return n; let r = n.ref, i = 2; while (W.nodes.some(x => x !== n && x.ref === r)) r = n.ref + '_' + i++; n.ref = r; return n; };
  const E = (f, t, label) => label ? { f, t, label } : { f, t };

  // Inbound lead triage: a demo request comes in, the agent researches and scores it, and the score picks the path
  function triage(){
    const nodes = [
      N('trigger', 'Demo request form', { id:'n1', ic:'file-text', ref:'form', cfg:{ source:'Website form', form:'Book a demo', when:'Work emails only' },
        out:[['name', 'text', 'Priya Shah'], ['email', 'text', 'priya@corvid.io'], ['company', 'text', 'Corvid Analytics'], ['seats', 'number', '240'], ['message', 'text', 'We want agents on our support queue']] }),
      N('ai', 'Research and score', { id:'n2', ref:'research', cfg:{ model:'Sonnet 5.5', tools:['n3'], in:{ company:'form.company', email:'form.email', seats:'form.seats' },
        prompt:'Look up {{form.company}} and the person who wrote in. Score how well they fit our plans from 0 to 100 and give three reasons.\nA good fit is a team of 50 or more seats with a support or operations use case.' },
        out:[['score', 'number', '84'], ['tier', 'text', 'Enterprise'], ['reasons', 'list', '3 reasons'], ['summary', 'text', 'Series B analytics company']] }),
      N('tool', 'Company lookup', { id:'n3', ic:'globe', ref:'lookup', host:'n2', cfg:{ conn:'Company data API', action:'Find a company by domain', in:{ domain:'form.email' }, retries:1, backoff:'fixed', limit:'8s', cache:false },
        out:[['employees', 'number', '420'], ['industry', 'text', 'Analytics software'], ['funding', 'text', 'Series B'], ['country', 'text', 'Germany']] }),
      N('branch', 'Good fit?', { id:'n4', ref:'fit', cfg:{ rule:{ v:'research.score', op:'is at least', n:70 } } }),
      N('ai', 'Draft a reply', { id:'n5', ic:'edit', ref:'reply', cfg:{ model:'Sonnet 5.5', in:{ name:'form.name', reasons:'research.reasons' },
        prompt:'Write a short, warm reply to {{form.name}} from their account executive. Mention {{research.reasons}} in one line and offer two times for a call this week. Keep it under 90 words.' },
        out:[['subject', 'text', 'Your demo with Fernhill'], ['body', 'text', 'Hi Priya, thanks for reaching out']] }),
      N('approval', 'Rep approves', { id:'n6', ref:'approval', cfg:{ who:['MK', 'TR'], via:'Slack message', expire:'24 hours', then:'Stop the run' } }),
      N('app', 'Send the reply', { id:'n7', ic:'mail', ref:'email', cfg:{ conn:'sales@fernhill.co', action:'Send an email', in:{ to:'form.email', subject:'reply.subject', body:'reply.body' } },
        out:[['message_id', 'text', 'msg_8f2c41'], ['sent_at', 'text', '10:42']] }),
      N('app', 'Add to nurture list', { id:'n8', ic:'users', ref:'nurture', cfg:{ conn:'Email marketing', action:'Add to a list', list:'Product updates, monthly', in:{ email:'form.email', name:'form.name' } },
        out:[['added', 'text', 'true'], ['list', 'text', 'Product updates, monthly']] }),
      N('output', 'Post to Slack', { id:'n9', ref:'post', cfg:{ conn:'Fernhill on Slack', channel:'#inbound-leads', in:{ text:'research.summary' }, message:'{{form.name}} at {{form.company}} scored {{research.score}}.' } })
    ];
    return { nodes, edges:[E('n1', 'n2'), E('n2', 'n4'), E('n4', 'n5', 'yes'), E('n4', 'n8', 'no'), E('n5', 'n6'), E('n6', 'n7'), E('n7', 'n9'), E('n8', 'n9')] };
  }
  // the smaller workflows in the sidebar, each a chain of steps (a branch splits in two)
  const chain = (steps, split) => {
    const nodes = steps.map(([type, t, ic, cfg]) => N(type, t, { ic, cfg:{ ...(cfg || {}) } })), edges = [];
    if (!split){ nodes.slice(1).forEach((n, i) => edges.push(E(nodes[i].id, n.id))); return { nodes, edges }; }
    // split: [index of the branch, index of the yes step, index of the no step]
    const [b, y, no] = split;
    for (let i = 1; i <= b; i++) edges.push(E(nodes[i - 1].id, nodes[i].id));
    edges.push(E(nodes[b].id, nodes[y].id, 'yes'), E(nodes[b].id, nodes[no].id, 'no'));
    for (let i = y + 1; i < no; i++) edges.push(E(nodes[i - 1].id, nodes[i].id));
    return { nodes, edges };
  };
  const FLOWS = [
    { id:'renew', name:'Renewal reminders', st:'failing', ver:3, today:2, note:'2 failed today', build:() => chain([['trigger', 'Renewal in 30 days', 'cal', { source:'Schedule' }], ['ai', 'Summarise the account', 'spark'], ['app', 'Create a CRM task', 'db'], ['output', 'Email the owner', 'mail']]) },
    { id:'triage', name:'Inbound lead triage', st:'live', ver:6, today:14, build:triage },
    { id:'churn', name:'Churn risk digest', st:'live', ver:4, today:1, build:() => chain([['trigger', 'Every Monday, 8:00', 'clock', { source:'Schedule' }], ['app', 'Pull usage numbers', 'db'], ['ai', 'Spot accounts at risk', 'spark'], ['output', 'Post the digest', 'hash']]) },
    { id:'invoice', name:'Invoice follow-ups', st:'live', ver:2, today:6, build:() => chain([['trigger', 'Invoice 7 days late', 'dollar', { source:'Webhook' }], ['ai', 'Write a friendly nudge', 'edit'], ['approval', 'Finance approves', 'user'], ['app', 'Send the nudge', 'mail']]) },
    { id:'tickets', name:'Support ticket routing', st:'live', ver:9, today:38, build:() => chain([['trigger', 'New support ticket', 'comment', { source:'Webhook' }], ['ai', 'Sort by topic and urgency', 'filter'], ['branch', 'Urgent?', 'branch'], ['app', 'Page the on-call', 'bell'], ['app', 'Assign to a queue', 'users']], [2, 3, 4]) },
    { id:'notes', name:'Meeting notes to CRM', st:'draft', ver:0, today:0, build:() => chain([['trigger', 'Call recording ready', 'mic', { source:'Webhook' }], ['ai', 'Pull out next steps', 'file-text'], ['app', 'Update the deal', 'db']]) },
    { id:'trial', name:'Trial nudges', st:'draft', ver:0, today:0, build:() => chain([['trigger', 'Trial day 5', 'clock', { source:'Schedule' }], ['ai', 'Write a tips email', 'edit'], ['app', 'Send the tips', 'mail']]) }
  ];
  const now = new Date(), ago = d => { const x = new Date(now); x.setDate(x.getDate() - d); return x.toLocaleDateString('en-US', { month:'short', day:'numeric' }); };
  // a workflow's state on first open: its graph, the version that is live, its changes, runs and versions
  function load(F){
    if (F.W) return F.W;
    const g = F.build(), W = F.W = { F, nodes:g.nodes, edges:g.edges, changes:[], undo:[], redo:[], runs:[], versions:[], lead:LEADS[0], pos:{} };
    W.live = F.ver ? snapOf(W) : null;
    if (F.id === 'triage'){
      // the draft differs from v6 in two places: the threshold and the reply's instructions
      const live = JSON.parse(W.live); live.nodes.find(n => n.id === 'n4').cfg.rule.n = 60;
      live.nodes.find(n => n.id === 'n5').cfg.prompt = 'Write a friendly reply to {{form.name}} and offer a call this week.';
      W.live = JSON.stringify(live);
      W.changes = [{ k:'n4.rule', t:'Raised the fit threshold from 60 to 70' }, { k:'n5.prompt', t:'Reworded the reply instructions' }];
      W.versions = [
        { v:6, by:'MK', when:ago(2), note:'Leads under the threshold go to the monthly nurture list.', ch:['Nurture list changed from weekly to monthly'] },
        { v:5, by:'TR', when:ago(9), note:'A rep approves every reply before it goes out.', ch:['Added Rep approves before Send the reply'] },
        { v:4, by:'MK', when:ago(17), note:'The research step looks the company up first.', ch:['Added Company lookup as a tool of Research and score'] },
        { v:3, by:'AN', when:ago(24), note:'The Slack post carries the score.', ch:['Post to Slack includes the score'] },
        { v:2, by:'AN', when:ago(29), note:'Small leads join a nurture list.', ch:['Added Add to nurture list on the No path'] },
        { v:1, by:'AN', when:ago(31), note:'First version.', ch:['Created the workflow'] }
      ];
      // what each older version looked like, worked out once from v6
      const drop = (g, id) => { const i = g.edges.filter(e => e.t === id), o = g.edges.filter(e => e.f === id); i.forEach(a => o.forEach(b => g.edges.push(a.label ? { f:a.f, t:b.t, label:a.label } : { f:a.f, t:b.t }))); g.edges = g.edges.filter(e => e.f !== id && e.t !== id); g.nodes = g.nodes.filter(x => x.id !== id); };
      W.versions.forEach(ver => { const g = JSON.parse(W.live), v = ver.v, f = id => g.nodes.find(x => x.id === id);
        if (v < 6) f('n8').cfg.list = 'Product updates, weekly';
        if (v < 5) drop(g, 'n6');
        if (v < 4){ drop(g, 'n3'); f('n2').cfg.tools = []; }
        if (v < 3) f('n9').cfg.message = '{{form.name}} at {{form.company}} asked for a demo.';
        if (v < 2){ drop(g, 'n8'); g.edges = g.edges.filter(e => e.label !== 'no'); }
        ver.g = JSON.stringify(g); });
      W.runs = [
        { id:2087, test:true, lead:LEADS[0], out:'ok', path:'Reply sent', dur:8.1, when:'2 hours ago', o:{ fail:{ times:0 }, approve:{ by:'AN', after:'40s' } } },
        { id:2086, lead:{ ...LEADS[1], n:'Jonas Weber', ini:'JW', co:'Kitebird' }, out:'ok', path:'Added to nurture', dur:3.9, when:'3 hours ago', o:{} },
        { id:2085, lead:{ ...LEADS[2], n:'Lena Park', ini:'LP', co:'Hollow Pine' }, out:'wait', path:'Waiting for approval', dur:6.2, when:'4 hours ago', o:{ approve:'wait' } },
        { id:2084, lead:{ ...LEADS[0], n:'Omar Haddad', ini:'OH', co:'Tidewater Freight' }, out:'bad', path:'Failed at Company lookup', dur:9.6, when:'Yesterday', o:{ fail:{ times:2 } } },
        { id:2083, lead:{ ...LEADS[0], n:'Sara Lind', ini:'SL', co:'Mapleworks' }, out:'ok', path:'Reply sent, 1 retry', dur:10.4, when:'Yesterday', o:{ fail:{ times:1 }, approve:{ by:'TR', after:'14 min' } } },
        { id:2082, lead:{ ...LEADS[1], n:'Ben Arnold', ini:'BA', co:'Quarry Labs' }, out:'ok', path:'Added to nurture', dur:4.2, when:'Yesterday', o:{} },
        { id:2081, lead:{ ...LEADS[2], n:'Mia Torres', ini:'MT', co:'Sunvale Energy' }, out:'ok', path:'Reply sent', dur:7.7, when:ago(2), o:{ approve:{ by:'MK', after:'6 min' } } }
      ];
    } else {
      W.lead = null;
      if (F.ver) W.versions = Array.from({ length:Math.min(F.ver, 3) }, (_, i) => { const g = JSON.parse(W.live), a = g.nodes.find(x => x.type === 'ai'); if (i && a) a.cfg.prompt = a.t + ', in a few lines.';
        return { v:F.ver - i, by:['MK', 'TR', 'AN'][i % 3], when:ago(3 + i * 8), note:i === Math.min(F.ver, 3) - 1 && F.ver <= 3 ? 'First version.' : 'Tuned the instructions.', ch:['Changed the instructions on the AI step'], g:JSON.stringify(g) }; });
      const bad = F.st === 'failing', crm = W.nodes.find(n => n.ic === 'db');
      if (bad && crm && crmExpired) W.testFail = { node:crm.id, times:9, err:'401 The CRM connection has expired' };
      W.runs = F.ver ? [0, 1, 2].map(i => ({ id:900 + F.today * 3 - i, lead:null, out:bad && i < 2 ? 'bad' : 'ok', path:bad && i < 2 ? 'Failed at ' + (crm ? crm.t : 'a step') : 'Finished', dur:3 + i * .7, when:['1 hour ago', '5 hours ago', 'Yesterday'][i], o:bad && i < 2 && crm ? { fail:{ node:crm.id, times:9, err:'401 The CRM connection has expired' } } : {} })) : [];
    }
    return W;
  }
  const snapOf = W => JSON.stringify({ nodes:W.nodes, edges:W.edges });

  /* ---------- state ---------- */
  let F = FLOWS[1], W = load(F), selId = null, tool = 'select', R = null, runSeq = 2087, panelTab = 'step';
  const byId = id => W.nodes.find(n => n.id === id);
  const byRef = ref => W.nodes.find(n => n.ref === ref);
  const outsOf = id => W.edges.filter(e => e.f === id);
  const insOf = id => W.edges.filter(e => e.t === id);
  const flow = () => W.nodes.filter(n => n.type !== 'tool');

  /* ---------- toasts: Toast ---------- */
  const toasts = $('.wf-toasts', app); $('.wf-work', app).appendChild(toasts);
  const TONE = { ok:['ok', 'var(--dm-ok)', 'var(--dm-ok-bg)'], info:['info', 'var(--dm-fg2)', 'var(--dm-chip)'], warn:['warn', 'var(--dm-warn)', 'var(--dm-warn-bg)'], bad:['x', 'var(--dm-bad)', 'var(--dm-bad-bg)'], ai:['spark', 'var(--dm-accent-fg,var(--dm-accent))', 'var(--dm-accent-bg)'] };
  // a toast fades out (Toast's own tst-out), then closes its room so the others glide together
  function toastOut(t){
    if (!t.isConnected || t.classList.contains('tst-out')) return;
    t.classList.add('tst-out'); shrink(t, { delay:120, gap:parseFloat(getComputedStyle(toasts).rowGap) || 8, fade:false, dur:MT('--dm-t') * .6 });
  }
  function toast(kind, b, s = '', act = null){
    const [ic, col, bg] = TONE[kind];
    const t = html(`<div class="tst-t tst-in" role="status"><span class="g" style="color:${col};background:${bg}">${I(ic)}</span><div class="tx"><b>${esc(b)}</b>${s ? `<span>${esc(s)}</span>` : ''}</div><div class="acts">${act ? `<button class="pill ghost sm">${esc(act.label)}</button>` : ''}<button class="ib" aria-label="Dismiss" data-tip="Dismiss">${I('x')}</button></div></div>`);
    const out = () => toastOut(t);
    $('.ib', t).onclick = out;
    if (act) $('.pill', t).onclick = () => { act.run(); out(); };
    // the toasts already shown glide to make room (on phones they stack up from the bottom)
    const was = new Map($$('.tst-t:not(.tst-out)', toasts).map(x => [x, x.getBoundingClientRect().top]));
    toasts.appendChild(t);
    if (!REDUCE) was.forEach((y, x) => { const d = y - x.getBoundingClientRect().top; if (Math.abs(d) > .5) x.animate([{ transform:`translateY(${d}px)` }, { transform:'none' }], { duration:MT('--dm-t'), easing:EASE() }); });
    const live = $$('.tst-t:not(.tst-out)', toasts); live.slice(0, Math.max(0, live.length - 3)).forEach(toastOut);
    // a click anywhere else, or Escape, sends the toasts away; a click on a toast itself (its Undo, its ×) is handled above
    if (!toasts._away){ toasts._away = true; const t0 = () => performance.now();
      // a toast's own buttons never close the popover it reports on (Undo in Connected apps puts the app back in its list)
      toasts.addEventListener('click', e => e.stopPropagation());
      const away = () => $$('.tst-t:not(.tst-out)', toasts).forEach(x => { if (t0() - (x._born || 0) > 250) toastOut(x); });
      document.addEventListener('pointerdown', e => { if (!toasts.contains(e.target)) away(); }, true);
      document.addEventListener('keydown', e => { if (e.key === 'Escape' && toasts.children.length) away(); }); }
    t._born = performance.now();
    let left = 6000, t0 = performance.now(), tm = setTimeout(out, left);
    t.addEventListener('pointerenter', () => { clearTimeout(tm); left -= performance.now() - t0; });
    t.addEventListener('pointerleave', () => { t0 = performance.now(); tm = setTimeout(out, Math.max(1200, left)); });
  }

  /* ---------- changes, undo and redo ---------- */
  const savedEl = $('.wf-saved', app);
  let saveT = 0;
  function saved(){ savedEl.innerHTML = `<span class="spin" aria-hidden="true"></span>Saving`; clearTimeout(saveT); saveT = setTimeout(() => { savedEl.innerHTML = `${I('check', 'xs')}Saved to the draft`; }, 650); }
  function addChange(t, k = t){ const i = W.changes.findIndex(c => c.k === k); if (i >= 0) W.changes[i].t = t; else W.changes.push({ k, t }); }
  const snapAll = () => JSON.stringify({ nodes:W.nodes, edges:W.edges, changes:W.changes, pos:W.pos });
  const restore = s => { const o = JSON.parse(s); W.nodes = o.nodes; W.edges = o.edges; W.changes = o.changes; W.pos = o.pos; if (selId && !byId(selId)) selId = null; };
  // every edit goes through here: it can be undone, it says what changed, and the draft saves
  function commit(desc, fn, { key, change = true, quiet = false } = {}){
    const before = snapAll(); fn();
    if (snapAll() === before && !(desc === '' && change)) return;
    W.undo.push(before); if (W.undo.length > 60) W.undo.shift(); W.redo = [];
    W.seq = (W.seq || 0) + 1;
    if (desc && change) addChange(desc, key || desc);
    if (!quiet) renderAll(); else { paintState(); paintUndo(); }
    saved();
  }
  function undo(){ if (!W.undo.length) return; W.redo.push(snapAll()); restore(W.undo.pop()); renderAll(); saved(); say('Undone'); }
  function redo(){ if (!W.redo.length) return; W.undo.push(snapAll()); restore(W.redo.pop()); renderAll(); saved(); say('Redone'); }
  const paintUndo = () => { $('.wf-undo', app).setAttribute('aria-disabled', String(!W.undo.length)); $('.wf-redo', app).setAttribute('aria-disabled', String(!W.redo.length)); };
  $('.wf-undo', app).onclick = undo; $('.wf-redo', app).onclick = redo;
  const liveR = $('#pg-live') || null;
  const say = t => { if (!liveR) return; liveR.textContent = ''; setTimeout(() => liveR.textContent = t, 40); };

  /* ---------- the layout: columns by the longest path from the trigger, lanes by the branch's paths ---------- */
  const NW = 172, NH = 66, COL = 220, LANE = 96, TOOLDY = 108, AFTER = 32;
  function layout(){
    const depth = {}, lane = {};
    const d = id => { if (depth[id] != null) return depth[id]; depth[id] = 0; const i = insOf(id); return depth[id] = i.length ? Math.max(...i.map(e => d(e.f) + 1)) : 0; };
    const l = id => { if (lane[id] != null) return lane[id]; lane[id] = 0; const i = insOf(id); if (!i.length) return 0;
      const v = i.map(e => { const s = byId(e.f), pl = l(e.f); return s && s.type === 'branch' ? pl + (e.label === 'no' ? .5 : e.label === 'yes' ? -.5 : 0) * (outsOf(s.id).length > 1 ? 2 : 0) : pl; });
      return lane[id] = sum(v) / v.length; };
    flow().forEach(n => { d(n.id); l(n.id); });
    const pos = {};
    // the steps after a branch sit a little further on, so its two wires have room to part
    const bd = flow().filter(n => n.type === 'branch' && outsOf(n.id).length > 1).map(n => depth[n.id]);
    flow().forEach(n => { const k = bd.filter(d => d < depth[n.id]).length; pos[n.id] = { x:depth[n.id] * COL + k * AFTER, y:lane[n.id] * LANE, d:depth[n.id], l:lane[n.id] }; });
    W.nodes.filter(n => n.type === 'tool').forEach(n => { const h = pos[n.host] || { x:0, y:0 }, sibs = byId(n.host) ? byId(n.host).cfg.tools : [n.id], i = Math.max(0, sibs.indexOf(n.id));
      pos[n.id] = { x:h.x + i * (NW + 16) - (sibs.length - 1) * (NW + 16) / 2, y:h.y + TOOLDY, d:h.d, l:h.l + 1 }; });
    // a step you dragged keeps where you put it, until Tidy up
    Object.keys(W.pos).forEach(id => { if (pos[id]) Object.assign(pos[id], W.pos[id]); });
    return pos;
  }
  let POS = {};
  const topo = () => { if (!W.nodes.every(n => POS[n.id])) POS = layout(); return flow().slice().sort((a, b) => POS[a.id].d - POS[b.id].d || POS[a.id].l - POS[b.id].l); };

  /* ---------- the canvas: wfx-node, the wires and wfx-ins (the + on a wire) ---------- */
  const cv = $('.wfx-cv', app), vp = $('.wfx-vp', app), world = $('.wfx-world', app), svg = $('.wfx-svg', app), nodesEl = $('.wfx-nodes', app);
  const meta = n => {
    const c = n.cfg, rule = c.rule;
    const m = ({ trigger:() => [c.form || c.source], ai:() => [c.model, c.tools.length ? c.tools.length + (c.tools.length > 1 ? ' tools' : ' tool') : null], tool:() => [c.conn, c.cache ? 'Cached' : null],
      branch:() => [rule.v ? `${rule.v.split('.')[1]} ${rule.op.replace('is ', '')} ${rule.n}` : 'No rule yet'], approval:() => [c.who.map(first).join(' or ')], app:() => [c.list || c.conn], output:() => [c.channel || c.conn], wait:() => [c.for] }[n.type] || (() => []))();
    return m.filter(Boolean).map(t => `<span class="tag">${esc(t)}</span>`).join('') + (n.off ? '<span class="tag">Off</span>' : '');
  };
  const tile = (n, cls = '') => `<span class="wfx-ic${n.type === 'ai' ? ' ai' : ''}${cls}" data-k="${n.type}" aria-hidden="true">${I(n.ic, 'xs')}</span>`;
  function nodeHTML(n){
    const p = POS[n.id];
    return `<button class="wfx-node${n.type === 'tool' ? ' tool' : ''}${n.off ? ' off' : ''}${selId === n.id ? ' sel' : ''}" data-id="${n.id}" data-type="${n.type}" style="left:${p.x}px;top:${p.y - NH / 2}px" aria-pressed="${selId === n.id}" aria-label="${esc(TYPES[n.type].k + ': ' + n.t)}">`
      + (n.type === 'trigger' ? '' : n.type === 'tool' ? '<span class="wfx-pin top" aria-hidden="true"></span>' : '<span class="wfx-pin in" aria-hidden="true"></span>')
      + (n.type === 'tool' ? '' : '<span class="wfx-pin out" aria-hidden="true"></span>') + (n.cfg.tools && n.cfg.tools.length ? '<span class="wfx-pin bot" aria-hidden="true"></span>' : '')
      + `<span class="wfx-n1">${tile(n)}<span class="t">${esc(n.t)}</span></span><span class="wfx-n2"><span class="m">${meta(n)}</span><span class="r"></span></span><span class="wfx-st" aria-hidden="true"></span></button>`;
  }
  // a wire from one step's right edge to the next one's left, as a curve; a tool hangs straight down from its step
  const wire = (a, b) => { const x1 = a.x + NW, y1 = a.y, x2 = b.x, y2 = b.y, dx = Math.max(36, Math.abs(x2 - x1) / 2); return [x1, y1, x1 + dx, y1, x2 - dx, y2, x2, y2]; };
  const at = (c, t) => { const u = 1 - t; return [u * u * u * c[0] + 3 * u * u * t * c[2] + 3 * u * t * t * c[4] + t * t * t * c[6], u * u * u * c[1] + 3 * u * u * t * c[3] + 3 * u * t * t * c[5] + t * t * t * c[7]]; };
  const dOf = c => `M${c[0]} ${c[1]}C${c[2]} ${c[3]} ${c[4]} ${c[5]} ${c[6]} ${c[7]}`;
  function drawWires(){
    let s = '', extra = '';
    W.edges.forEach((e, i) => {
      const a = POS[e.f], b = POS[e.t]; if (!a || !b) return; const c = wire(a, b);
      s += `<path class="e" data-e="${i}" d="${dOf(c)}"/><path class="hit" data-e="${i}" d="${dOf(c)}"/>`;
      const [mx, my] = at(c, e.label ? .62 : .5);
      extra += `<button class="wfx-ins" data-e="${i}" style="left:${mx}px;top:${my}px" aria-label="Add a step between ${esc(byId(e.f).t)} and ${esc(byId(e.t).t)}" data-tip="Add a step" data-pop="#wf-p-pick" aria-haspopup="dialog">${I('plus', 'xs')}</button>`;
      if (e.label){ const [lx, ly] = at(c, .3); extra += `<span class="wfx-elab" data-e="${i}" style="left:${lx}px;top:${ly}px">${e.label === 'yes' ? 'Yes' : 'No'}</span>`; }
    });
    W.nodes.filter(n => n.type === 'tool').forEach(n => { const h = POS[n.host], p = POS[n.id]; if (!h || !p) return;
      s += `<path class="e tool" data-tool="${n.id}" d="M${h.x + NW / 2} ${h.y + NH / 2}C${h.x + NW / 2} ${h.y + NH / 2 + 18} ${p.x + NW / 2} ${p.y - NH / 2 - 18} ${p.x + NW / 2} ${p.y - NH / 2}"/>`; });
    svg.innerHTML = s;
    $$('.wfx-ins, .wfx-elab', nodesEl).forEach(x => x.remove());
    nodesEl.insertAdjacentHTML('beforeend', extra);
  }
  // an edit moves the steps it touches: the ones that stay glide to their new places with their wires, a new one pops in and a
  // removed one fades where it was. Opening another workflow just draws it
  let drawnW = null, tweenRaf = 0;
  function renderCanvas(){
    const old = {}, same = drawnW === W && !REDUCE; drawnW = W;
    Object.keys(POS).forEach(id => { old[id] = { x:POS[id].x, y:POS[id].y }; });
    cancelAnimationFrame(tweenRaf); tweenRaf = 0; tween.to = null; POS = layout();
    const gone = same ? $$('.wfx-node:not(.gone)', nodesEl).filter(el => !byId(el.dataset.id)) : [];
    const from = {}; if (same) W.nodes.forEach(n => { const o = old[n.id], p = POS[n.id]; if (o && p && Math.hypot(o.x - p.x, o.y - p.y) > .5) from[n.id] = { x:o.x, y:o.y }; });
    nodesEl.innerHTML = W.nodes.map(nodeHTML).join('');
    if (same) $$('.wfx-node', nodesEl).forEach(el => { if (!old[el.dataset.id]) el.classList.add('add'); });
    gone.forEach(el => { el.classList.add('gone'); el.classList.remove('sel'); el.inert = true; el.setAttribute('aria-hidden', 'true'); nodesEl.appendChild(el);
      const go = () => el.remove(); el.animate([{ opacity:getComputedStyle(el).opacity, transform:'none' }, { opacity:0, transform:'scale(.94)' }], { duration:MT('--dm-t-fast') + 60, easing:'ease-in', fill:'forwards' }).finished.then(go, go); });
    if (Object.keys(from).length) tween(from); else { drawWires(); paintRun(true); }
  }
  function tween(from){
    const to = {}, t0 = performance.now(), D = MT('--dm-t'), els = {};
    Object.keys(from).forEach(id => { to[id] = { x:POS[id].x, y:POS[id].y }; els[id] = $(`.wfx-node[data-id="${id}"]`, nodesEl); });
    const frame = now => {
      const k = Math.min(1, (now - t0) / D), e = 1 - Math.pow(1 - k, 3);
      Object.keys(to).forEach(id => { const p = POS[id], el = els[id]; if (!p) return; p.x = from[id].x + (to[id].x - from[id].x) * e; p.y = from[id].y + (to[id].y - from[id].y) * e;
        if (el){ el.style.left = p.x + 'px'; el.style.top = (p.y - NH / 2) + 'px'; } });
      drawWires(); paintRun(true);
      tweenRaf = k < 1 ? requestAnimationFrame(frame) : 0;
      if (!tweenRaf) tween.to = null;
    };
    tween.to = to; frame(t0);
  }
  // a drag or another edit mid-glide starts from where the steps are going
  function finishTween(){
    if (!tweenRaf) return; cancelAnimationFrame(tweenRaf); tweenRaf = 0;
    const to = tween.to; tween.to = null; if (!to) return;
    Object.keys(to).forEach(id => { if (!POS[id]) return; Object.assign(POS[id], to[id]); const el = $(`.wfx-node[data-id="${id}"]`, nodesEl); if (el){ el.style.left = POS[id].x + 'px'; el.style.top = (POS[id].y - NH / 2) + 'px'; } });
    drawWires(); paintRun(true);
  }
  // a wire under the pointer shows its +; the + stays while the pointer moves onto it
  let hotT = 0;
  svg.addEventListener('pointerover', e => { const p = e.target.closest('path.hit'); if (!p) return; clearTimeout(hotT); $$('.wfx-ins.hot', nodesEl).forEach(b => b.classList.remove('hot')); const b = $(`.wfx-ins[data-e="${p.dataset.e}"]`, nodesEl); if (b) b.classList.add('hot'); });
  svg.addEventListener('pointerout', e => { if (!e.target.closest('path.hit')) return; hotT = setTimeout(() => $$('.wfx-ins.hot', nodesEl).forEach(b => { if (!b.matches(':hover') && b.getAttribute('aria-expanded') !== 'true') b.classList.remove('hot'); }), 260); });
  nodesEl.addEventListener('pointerleave', e => { if (e.target.matches && e.target.matches('.wfx-ins')) e.target.classList.remove('hot'); }, true);

  /* ---------- the view: zoom z and pan (px, py); a point x on the board shows at x * z + px ---------- */
  const V = { z:1, px:0, py:0 };
  const ZS = [.5, .67, .8, .9, 1, 1.25, 1.5];
  const zl = $('.wf-zl', app);
  function setView(z, px, py, anim = false){
    V.z = clamp(z, .4, 1.6); V.px = px; V.py = py;
    cv.classList.toggle('anim', anim && !REDUCE);
    world.style.transform = `translate(${V.px}px,${V.py}px) scale(${V.z})`;
    vp.style.backgroundPosition = `${V.px}px ${V.py}px`; vp.style.backgroundSize = `${16 * V.z}px ${16 * V.z}px`;
    zl.textContent = Math.round(V.z * 100) + '%'; zl.setAttribute('aria-label', `Zoom ${Math.round(V.z * 100)}%, reset to 100%`);
    if (anim) setTimeout(() => cv.classList.remove('anim'), 320);
  }
  // the room the steps can use: under the test chip, over the toolbar
  // a panel over the canvas (under 1200px) takes its right side. While the panel or the run drawer slides, the room is the one
  // they leave once they settle, so a step brought into view lands in the right place; live is the room this frame
  const PW = 368;
  const drGoal = () => dr.classList.contains('shut') ? 45 : Math.min(parseFloat(dr.style.getPropertyValue('--rdr-h')) || 312, innerWidth <= 640 ? Math.round(dr.parentElement.clientHeight * .56) : 1e9);
  const room = (live = false) => {
    const p = $('.wf-panel', app), pn = app.classList.contains('pn'), beside = getComputedStyle(p).position !== 'absolute';
    const over = pn && !beside && innerWidth > 640 ? p.offsetWidth : 0, dw = live || !beside ? 0 : (pn ? PW : 0) - p.offsetWidth, dh = live ? 0 : drGoal() - dr.offsetHeight;
    return { l:16, t:56, r:cv.clientWidth - 16 - over - dw, b:cv.clientHeight - 64 - dh }; };
  // the panel and the drawer are sliding until then: the view follows them frame by frame instead of easing after them
  let sizingTill = 0;
  const sizing = () => performance.now() < sizingTill || dr.classList.contains('drag');
  const settle = () => { sizingTill = performance.now() + MT('--dm-t') + 80; };
  function bbox(){
    const ps = Object.values(POS); if (!ps.length) return { x:0, y:0, w:1, h:1 };
    const x0 = Math.min(...ps.map(p => p.x)), x1 = Math.max(...ps.map(p => p.x + NW)), y0 = Math.min(...ps.map(p => p.y - NH / 2)) - 12, y1 = Math.max(...ps.map(p => p.y + NH / 2));
    return { x:x0, y:y0, w:x1 - x0, h:y1 - y0 };
  }
  function fit(anim = false, live = false){
    const r = room(live), b = bbox(), W0 = r.r - r.l, H0 = r.b - r.t;
    const z = clamp(Math.min(W0 / b.w, H0 / b.h, 1), .7, 1);
    // a workflow wider than the canvas at the smallest readable zoom starts at its trigger
    const px = b.w * z <= W0 ? r.l + (W0 - b.w * z) / 2 - b.x * z : r.l + 8 - b.x * z;
    setView(z, px, r.t + (H0 - b.h * z) / 2 - b.y * z, anim); V.user = false;
  }
  function zoomAt(z, mx = cv.clientWidth / 2, my = cv.clientHeight / 2, anim = true){ const k = clamp(z, .4, 1.6) / V.z; setView(V.z * k, mx - (mx - V.px) * k, my - (my - V.py) * k, anim); }
  const step = d => { const i = ZS.findIndex(z => z >= V.z - .001); zoomAt(ZS[clamp(d > 0 ? (ZS[i] > V.z + .001 ? i : i + 1) : i - 1, 0, ZS.length - 1)]); };
  // a step is brought into view when it is picked or starts running, only if it isn't already
  function reveal(id, centre = false){
    const p = POS[id]; if (!p) return; const r = room();
    const sx = p.x * V.z + V.px, sy = (p.y - NH / 2) * V.z + V.py, w = NW * V.z, h = NH * V.z;
    if (!centre && sx >= r.l && sx + w <= r.r && sy >= r.t && sy + h <= r.b) return;
    setView(V.z, V.px + ((r.l + r.r) / 2 - (sx + w / 2)), V.py + ((r.t + r.b) / 2 - (sy + h / 2)), true);
  }
  $('.wf-zi', app).onclick = () => { V.user = true; step(1); }; $('.wf-zo', app).onclick = () => { V.user = true; step(-1); };
  zl.onclick = () => { V.user = true; zoomAt(1); }; $('.wf-fit', app).onclick = () => fit(true);
  $('.wf-tidy', app).onclick = () => { if (!Object.keys(W.pos).length){ fit(true); toast('info', 'Already tidy', 'Every step is where the layout puts it'); return; } commit('', () => { W.pos = {}; }, { change:false }); fit(true); toast('ok', 'Tidied up', 'Steps are back in their columns'); };
  // the tools: Select drags steps, Pan drags the view
  const tools = $$('.ctb-tools .ctb-b', app);
  const setTool = t => { tool = t; cv.dataset.tool = t; tools.forEach(b => { const on = b.dataset.t === t; b.setAttribute('aria-checked', String(on)); b.tabIndex = on ? 0 : -1; }); };
  tools.forEach(b => b.onclick = () => setTool(b.dataset.t));
  setTool('select');
  cv.addEventListener('wheel', e => {
    e.preventDefault();
    const r = cv.getBoundingClientRect();
    V.user = true;
    if (e.ctrlKey || e.metaKey) zoomAt(V.z * Math.exp(-e.deltaY * .0075), e.clientX - r.left, e.clientY - r.top, false);
    else setView(V.z, V.px - e.deltaX, V.py - e.deltaY);
  }, { passive:false });
  // dragging: the empty board (or anything, with Pan) moves the view; a step moves the step
  let drag = null, justDragged = false;
  vp.addEventListener('pointerdown', e => {
    if (e.button !== 0 && e.button !== 1) return;
    finishTween();
    const nd = e.target.closest('.wfx-node'), ctl = e.target.closest('.wfx-ins');
    if (ctl) return;
    if (nd && tool === 'select' && e.button === 0) drag = { kind:'node', id:nd.dataset.id, x:e.clientX, y:e.clientY, p0:{ ...POS[nd.dataset.id] }, on:false, before:snapAll(), el:nd };
    else drag = { kind:'view', x:e.clientX, y:e.clientY, px:V.px, py:V.py, on:false };
    drag.pid = e.pointerId;
  });
  vp.addEventListener('pointermove', e => {
    if (!drag) return; const dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (!drag.on){ if (Math.hypot(dx, dy) < 4) return; drag.on = true; try { vp.setPointerCapture(drag.pid); } catch(err){} cv.classList.add(drag.kind === 'view' ? 'pan' : 'move'); if (drag.el) drag.el.classList.add('drag'); }
    if (drag.kind === 'view'){ V.user = true; return setView(V.z, drag.px + dx, drag.py + dy); }
    const p = POS[drag.id]; p.x = drag.p0.x + dx / V.z; p.y = drag.p0.y + dy / V.z;
    // a step with tools takes them along
    const n = byId(drag.id);
    (n.cfg.tools || []).forEach(t => { if (POS[t]){ POS[t].x = p.x + (POS[t]._dx ??= POS[t].x - drag.p0.x); POS[t].y = p.y + TOOLDY; } });
    drag.el.style.left = p.x + 'px'; drag.el.style.top = (p.y - NH / 2) + 'px';
    (n.cfg.tools || []).forEach(t => { const el = $(`.wfx-node[data-id="${t}"]`, nodesEl); if (el){ el.style.left = POS[t].x + 'px'; el.style.top = (POS[t].y - NH / 2) + 'px'; } });
    drawWires(); paintRun(true);
  });
  const endDrag = () => {
    if (!drag) return; const d = drag; drag = null; cv.classList.remove('pan', 'move');
    if (!d.on) return;
    justDragged = true; setTimeout(() => justDragged = false, 0);
    if (d.kind === 'node'){
      d.el.classList.remove('drag');
      const n = byId(d.id); W.pos[d.id] = { x:POS[d.id].x, y:POS[d.id].y };
      (n.cfg.tools || []).forEach(t => { if (POS[t]) W.pos[t] = { x:POS[t].x, y:POS[t].y }; delete POS[t]?._dx; });
      W.undo.push(d.before); W.redo = []; paintUndo(); saved();
    }
  };
  vp.addEventListener('pointerup', endDrag); vp.addEventListener('pointercancel', endDrag);
  // a click on a step picks it; a click on the empty board lets it go
  nodesEl.addEventListener('click', e => { if (justDragged) return; const nd = e.target.closest('.wfx-node'); if (nd) select(nd.dataset.id, { open:true }); });
  vp.addEventListener('click', e => { if (justDragged || e.target.closest('.wfx-node,.wfx-ins')) return; if (selId) select(null); });
  // the keyboard on the canvas: arrows move the view, + and - zoom, 0 fits, Delete removes the picked step
  cv.addEventListener('keydown', e => {
    if (e.target !== cv && !e.target.closest('.wfx-node')) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const k = e.key, M = { ArrowLeft:[40, 0], ArrowRight:[-40, 0], ArrowUp:[0, 40], ArrowDown:[0, -40] }[k];
    if (M && e.target === cv){ e.preventDefault(); setView(V.z, V.px + M[0], V.py + M[1], true); }
    else if (k === '+' || k === '='){ e.preventDefault(); step(1); }
    else if (k === '-' || k === '_'){ e.preventDefault(); step(-1); }
    else if (k === '0'){ e.preventDefault(); fit(true); }
    else if ((k === 'Delete' || k === 'Backspace') && selId){ e.preventDefault(); removeNode(selId); }
  });

  /* ---------- picking a step ---------- */
  function select(id, { open = false, focus = false, centre = false } = {}){
    // another step in the open inspector fades in
    if (id && id !== selId && app.classList.contains('pn') && panelTab === 'step') slideIn('step', 0);
    selId = id;
    $$('.wfx-node', nodesEl).forEach(b => { const on = b.dataset.id === id; b.classList.toggle('sel', on); b.setAttribute('aria-pressed', String(on)); });
    if (id && open) openPanel('step');
    if (panelTab === 'step') renderInspector();
    if (id) setTimeout(() => reveal(id, centre), app.classList.contains('pn') ? 40 : 0);
    if (id && focus){ const b = $(`.wfx-node[data-id="${id}"]`, nodesEl); if (b) b.focus({ preventScroll:true }); }
    if (id && R){ dataTab = byId(id).ref; if (drTab === 'data') paintData(); }
  }

  /* ---------- adding, inserting and removing steps ---------- */
  let insertAt = null; // { e: index of the wire } or { after: step id } or { host: AI step id, tool: true }
  function addStep(item, where = insertAt){
    const n = uniq(N(item.type, item.t, { ic:item.ic, cfg:item.cfg ? { ...item.cfg } : {} }));
    if (n.type === 'ai' && item.prompt) n.cfg.prompt = item.prompt;
    const name = n.t;
    commit(`Added ${name}`, () => {
      W.nodes.push(n);
      if (where && where.no){ W.edges.push(E(where.no, n.id, 'no')); }
      else if (where && where.e != null){
        const e = W.edges[where.e]; if (!e) return; const t = e.t; e.t = n.id; W.edges.push(n.type === 'branch' ? E(n.id, t, 'yes') : E(n.id, t));
      } else {
        const after = where && where.after ? where.after : (selId && byId(selId) && byId(selId).type !== 'tool' ? selId : topo().filter(x => !outsOf(x.id).length).pop()?.id);
        const o = after ? outsOf(after)[0] : null;
        if (o){ const t = o.t; o.t = n.id; W.edges.push(n.type === 'branch' ? E(n.id, t, 'yes') : E(n.id, t)); }
        else if (after) W.edges.push(E(after, n.id));
      }
      // the threshold of a new branch reads from the closest AI step before it
      if (n.type === 'branch'){ const up = upstream(n.id).flatMap(u => u.out.filter(o => o[1] === 'number').map(o => u.ref + '.' + o[0])); n.cfg.rule.v = up.pop() || ''; }
      // later steps that both paths reach shift right on their own (the layout); a step dragged by hand stays put
    });
    select(n.id, { open:true, centre:false });
    const el = $(`.wfx-node[data-id="${n.id}"]`, nodesEl); if (el && !REDUCE) el.classList.add('add');
    say(`${name} added`);
    return n;
  }
  function removeNode(id){
    const n = byId(id); if (!n) return;
    if (n.type === 'trigger'){ toast('info', 'A workflow needs its trigger', 'Pick the trigger and change its source instead'); return; }
    const fresh = W.changes.some(c => c.k === `Added ${n.t}`);
    commit(fresh ? '' : `Removed ${n.t}`, () => {
      if (fresh) W.changes = W.changes.filter(c => c.k !== `Added ${n.t}` && !c.k.startsWith(n.id + '.'));
      if (n.type === 'tool'){ const h = byId(n.host); if (h) h.cfg.tools = h.cfg.tools.filter(t => t !== id); }
      else {
        const i = insOf(id), o = outsOf(id);
        // the steps before it connect to the steps after it, so the run carries on past the gap
        i.forEach(a => o.forEach(b => { if (!W.edges.some(x => x.f === a.f && x.t === b.t)) W.edges.push(a.label ? E(a.f, b.t, a.label) : E(a.f, b.t)); }));
        W.edges = W.edges.filter(e => e.f !== id && e.t !== id);
        (n.cfg.tools || []).forEach(t => { W.nodes = W.nodes.filter(x => x.id !== t); });
      }
      W.nodes = W.nodes.filter(x => x.id !== id); delete W.pos[id];
    });
    toast('info', `Removed ${n.t}`, 'The steps around it are joined up', { label:'Undo', run:undo });
  }

  /* ---------- wfx-picker: the step picker (Automation canvas's picker), with the agent as the last row ---------- */
  const pk = $('#wf-p-pick', app), pq = $('.acx-qi', pk), pls = $('.acx-ls', pk), pd = $('.acx-pd', pk);
  let pItems = [], pHi = 0;
  function paintPick(){
    const v = pq.value.trim().toLowerCase(), hit = s => !v || s.toLowerCase().includes(v);
    let k = 0, h = '';
    pItems = [];
    CAT.forEach(g => { const its = g.items.filter(it => hit(it.t + ' ' + it.d)); if (!its.length) return;
      h += `<div role="group" aria-label="${g.g}"><div class="acx-gh" aria-hidden="true">${g.g}</div>` + its.map(it => { pItems.push(it); const i = k++; return `<div class="acx-o" role="option" id="wf-pk-${i}" aria-selected="false" data-i="${i}"><span class="ic wfx-ic${it.type === 'ai' ? ' ai' : ''}">${I(it.ic, 'xs')}</span><span>${esc(it.t)}</span></div>`; }).join('') + '</div>'; });
    if (v){ pItems.push({ ask:true, q:pq.value.trim() }); h += `<div role="group" aria-label="Agent"><div class="acx-gh" aria-hidden="true">Agent</div><div class="acx-o wfx-pick-ask" role="option" id="wf-pk-${k}" aria-selected="false" data-i="${k}"><span class="ic wfx-ic ai">${I('spark', 'xs')}</span><span>Build “${esc(pq.value.trim())}”</span></div></div>`; }
    listTo(pls, h, '.acx-gh, .acx-o', x => x.matches('.wfx-pick-ask') ? 'ask' : (x.matches('.acx-gh') ? 'g:' : 'o:') + x.textContent, pq.value, pk); pHi = 0; hiPick(0);
  }
  function hiPick(i){
    const os = $$('.acx-o:not([data-ghost])', pls); if (!os.length) return; pHi = (i + os.length) % os.length;
    os.forEach((o, j) => { o.classList.toggle('on', j === pHi); o.setAttribute('aria-selected', String(j === pHi)); });
    pq.setAttribute('aria-activedescendant', os[pHi].id); os[pHi].scrollIntoView({ block:'nearest' });
    const it = pItems[pHi]; pd.textContent = it.ask ? 'The agent sets up a step from what you wrote' : it.d;
  }
  function pickRun(i){ const it = pItems[i]; if (!it) return; closePops(); if (it.ask) agentBuild(it.q, insertAt); else addStep(it); }
  pq.addEventListener('input', paintPick);
  pq.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); hiPick(pHi + (e.key === 'ArrowDown' ? 1 : -1)); } else if (e.key === 'Enter'){ e.preventDefault(); pickRun(pHi); } });
  pls.addEventListener('click', e => { const o = e.target.closest('.acx-o'); if (o) pickRun(+o.dataset.i); });
  pls.addEventListener('pointermove', e => { const o = e.target.closest('.acx-o'); if (o && +o.dataset.i !== pHi) hiPick(+o.dataset.i); });
  // the picker opens from a wire's +, from the toolbar, or from the inspector's Add a step
  app.addEventListener('click', e => {
    const b = e.target.closest('[data-pop="#wf-p-pick"]'); if (!b) return;
    insertAt = b.dataset.e != null ? { e:+b.dataset.e } : b.dataset.no ? { no:b.dataset.no } : null;
    pq.value = ''; paintPick(); setTimeout(() => { if (pk.classList.contains('open')) pq.focus(); }, 30);
  }, true);
  // the agent builds a step from a sentence: it picks the kind from the words and writes the instructions
  function agentBuild(q, where){
    const s = q.toLowerCase();
    const kind = /slack|post|channel/.test(s) ? { type:'output', ic:'hash', t:'Post a message' } : /wait|delay|pause|later/.test(s) ? { type:'wait', ic:'clock', t:'Wait' }
      : /approv|review|check with|sign off/.test(s) ? { type:'approval', ic:'user', t:'Ask a person' } : /email|mail|send/.test(s) ? { type:'app', ic:'mail', t:'Send an email' }
      : /crm|deal|contact|record/.test(s) ? { type:'app', ic:'db', t:'Update the CRM' } : /if |only when|branch|split/.test(s) ? { type:'branch', ic:'branch', t:'Branch' } : null;
    const title = q.length > 26 ? q.slice(0, 24).replace(/\s+\S*$/, '') : q;
    const item = kind || { type:'ai', ic:'spark', t:title.charAt(0).toUpperCase() + title.slice(1), prompt:q.charAt(0).toUpperCase() + q.slice(1) + (/[.!?]$/.test(q) ? '' : '.') };
    const n = addStep(item, where);
    toast('ai', `The agent added ${n.t}`, kind ? 'It picked the step from your words. Check its fields' : 'Your words are its instructions. Check its inputs', { label:'Undo', run:undo });
  }

  /* ---------- the data picker: Data picker's picker, what earlier steps produced ---------- */
  function upstream(id){
    const n = byId(id); if (!n) return [];
    const seen = new Set(), list = [], walk = x => insOf(x).forEach(e => { if (seen.has(e.f)) return; seen.add(e.f); walk(e.f); list.push(byId(e.f)); });
    walk(n.type === 'tool' ? n.host : id);
    if (n.type !== 'tool') (n.cfg.tools || []).forEach(t => { const tn = byId(t); if (tn && !seen.has(t)){ seen.add(t); list.push(tn); } });
    // a step's tools come right after it
    flow().forEach(x => (x.cfg.tools || []).forEach(t => { if (seen.has(x.id) && !seen.has(t) && t !== id){ seen.add(t); list.splice(list.indexOf(x) + 1, 0, byId(t)); } }));
    return list.filter(Boolean);
  }
  const vref = v => { const [r, k] = (v || '').split('.'); return { n:byRef(r), k }; };
  // every field the steps before a step hand on, as "ref.field"
  const reach = n => new Set(upstream(n.id).flatMap(u => u.out.map(o => u.ref + '.' + o[0])));
  // a mapped field: Step inspector's token, the step's tile, the step and the field. One whose step is gone, or that no earlier
  // step gives (ok false), is red
  const tok = (v, attrs = '', ok = null, empty = 'Pick data') => { const { n, k } = vref(v);
    if (!v) return `<span class="sti-tok none"${attrs}>${I('plus', 'xs')}<span>${empty}</span></span>`;
    if (!n || ok === false) return `<span class="sti-tok bad"${attrs} data-tip="${n ? 'Not from an earlier step' : 'That step is gone'}">${I('alert', 'xs')}<span class="s">${esc(n ? n.t : v.split('.')[0])}</span><span class="sep" aria-hidden="true">›</span><span class="f">${esc(k || '')}</span></span>`;
    return `<span class="sti-tok"${attrs}><span class="sti-ti" data-k="${n.type}" aria-hidden="true">${I(n.ic, 'xs')}</span><span class="s">${esc(n.t)}</span><span class="sep" aria-hidden="true">›</span><span class="f">${esc(k)}</span></span>`; };
  // each data type in its colour: text blue, numbers green, lists orange, objects pink
  const TYPE_TONE = { text:'b', number:'m', list:'p', object:'k', bool:'y', date:'t' };
  const vp2 = $('#wf-p-var', app), vq = $('.wf-var-q', vp2), vls = $('.fpk-ls', vp2), vn = $('.wf-var-n', vp2);
  let vTarget = null, vItems = [], vHi = 0;
  function paintVar(){
    const n = byId(vTarget.node), v = vq.value.trim().toLowerCase(); let h = '', k = 0; vItems = [];
    const ups = upstream(vTarget.node);
    ups.forEach((u, ui) => { const fs = u.out.filter(o => !v || (u.t + ' ' + o[0]).toLowerCase().includes(v)); if (!fs.length) return;
      h += `<div role="group" aria-labelledby="wf-vg-${ui}"><div class="fpk-g" id="wf-vg-${ui}"><span class="fpk-ti" data-k="${u.type}" aria-hidden="true">${I(u.ic, 'xs')}</span><b>${esc(u.t)}</b><span class="n">${TYPES[u.type].k}</span></div>` + fs.map(o => { const ref = u.ref + '.' + o[0], i = k++; vItems.push(ref);
        return `<div class="fpk-o" role="option" id="wf-vo-${i}" aria-selected="false" data-i="${i}" aria-label="${esc(o[0])}, ${o[1]}, from ${esc(u.t)}"><span class="k">${esc(o[0])}</span><span class="tag ${TYPE_TONE[o[1]] || 'b'}">${o[1]}</span><span class="ex">${esc(o[2])}</span></div>`; }).join('') + '</div>'; });
    listTo(vls, h || `<p class="fpk-e">${ups.length ? 'No field matches' : `${esc(n.t)} is the first step, so there is no data before it`}</p>`, '.fpk-g, .fpk-o, .fpk-e', x => x.getAttribute('aria-label') || x.textContent, vq.value, vp2);
    vn.textContent = ups.length ? `From the ${ups.length} ${ups.length === 1 ? 'step' : 'steps'} before ${n.t}` : 'Nothing runs before this step';
    vHi = Math.max(0, vItems.indexOf(vTarget.cur)); hiVar(vHi);
  }
  function hiVar(i){ const os = $$('.fpk-o:not([data-ghost])', vls); if (!os.length){ vq.removeAttribute('aria-activedescendant'); return; } vHi = (i + os.length) % os.length; os.forEach((o, j) => { o.classList.toggle('on', j === vHi); o.setAttribute('aria-selected', String(j === vHi)); }); vq.setAttribute('aria-activedescendant', os[vHi].id); os[vHi].scrollIntoView({ block:'nearest' }); }
  function pickVar(i){ const ref = vItems[i]; if (!ref) return; closePops(); vTarget.set(ref); }
  vq.addEventListener('input', paintVar);
  vq.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); hiVar(vHi + (e.key === 'ArrowDown' ? 1 : -1)); } else if (e.key === 'Enter'){ e.preventDefault(); pickVar(vHi); } });
  vls.addEventListener('click', e => { const o = e.target.closest('.fpk-o'); if (o) pickVar(+o.dataset.i); });
  vls.addEventListener('pointermove', e => { const o = e.target.closest('.fpk-o'); if (o && +o.dataset.i !== vHi) hiVar(+o.dataset.i); });
  function openVar(target){ vTarget = target; vq.value = ''; paintVar(); setTimeout(() => { if (vp2.classList.contains('open')) vq.focus(); }, 30); }

  /* ---------- the step inspector: Step inspector's head, sections, rows, choices, tokens and chips ---------- */
  const insp = $('.wf-insp', app);
  const shut = new Set(['out']);
  const sec = (k, t, body, extra = '') => `<div class="sti-sec" data-sec="${k}"><button class="sti-sh" aria-expanded="${!shut.has(k)}" aria-controls="wf-sec-${k}" data-sec="${k}">${I('chev-r', 'xs')}<span>${t}</span>${extra}</button><div class="fold${shut.has(k) ? ' shut' : ''}" id="wf-sec-${k}"><div><div class="sti-rows">${body}</div></div></div></div>`;
  const row = (label, ctl, cls = '') => `<div class="sti-row${cls}"><span class="k">${label}</span><div class="v">${ctl}</div></div>`;
  const selBtn = (f, val, label) => `<button class="sti-sel" data-f="${f}" data-pop="#wf-p-sel" aria-haspopup="menu" aria-label="${esc(label)}: ${esc(val)}"><span>${esc(val)}</span>${I('chev-d', 'xs')}</button>`;
  const varBtn = (f, v, label, ok = null) => `<button class="sti-tokb" data-f="${f}" data-pop="#wf-p-var" aria-haspopup="dialog" aria-label="${esc(label)}: ${v ? esc(v) : 'not set'}${ok === false ? ', which no earlier step gives' : ''}. Pick data">${tok(v, '', ok)}</button>`;
  // a mapped field no earlier step gives says why, under its row
  const note = (v, ok) => { if (!v || ok !== false) return ''; const { n, k } = vref(v); return `<p class="sti-note">${n ? `${esc(n.t)} runs after this step.` : `${esc(v.split('.')[0])} isn't in the workflow any more.`} Pick where ${esc(k || 'it')} comes from.</p>`; };
  const num = (f, v, lo, hi, label) => `<span class="sti-num" role="group" aria-label="${esc(label)}"><button class="ib" data-f="${f}" data-d="-1" aria-label="Fewer ${label.toLowerCase()}" data-tip="Fewer" ${v <= lo ? 'aria-disabled="true"' : ''}>${I('minus', 'xs')}</button><span class="num" aria-live="polite">${v}</span><button class="ib" data-f="${f}" data-d="1" aria-label="More ${label.toLowerCase()}" data-tip="More" ${v >= hi ? 'aria-disabled="true"' : ''}>${I('plus', 'xs')}</button></span>`;
  const segBtns = (f, v, opts, label) => `<div class="seg2 sti-seg" role="group" aria-label="${esc(label)}" data-f="${f}">${opts.map(([k, t]) => `<button aria-pressed="${v === k}" data-v="${k}">${t}</button>`).join('')}</div>`;
  const toggle = (f, on, label) => `<button class="wfx-tg" role="switch" aria-checked="${on}" data-f="${f}"><span class="toggle" aria-hidden="true"></span><span>${esc(label)}</span></button>`;
  const stile = (n, s = 'xs') => `<span class="sti-ti" data-k="${n.type}" aria-hidden="true">${I(n.ic, s)}</span>`;
  // the instructions: their text with each {{step.field}} as a token, and back
  const insHTML = (n, ok) => esc(n.cfg.prompt).replace(/\{\{\s*([\w]+\.[\w]+)\s*\}\}/g, (m, r) => tok(r, ` contenteditable="false" data-ref="${r}"`, ok.has(r)));
  const readIns = el => [...el.childNodes].map(x => x.nodeType === 3 ? x.textContent : x.dataset && x.dataset.ref ? `{{${x.dataset.ref}}}` : x.nodeName === 'BR' ? '\n' : '\n' + x.textContent).join('');
  let caret = null;
  document.addEventListener('selectionchange', () => { const s = getSelection(), bx = $('.sti-ins', insp); if (s.rangeCount && bx && bx.contains(s.anchorNode)) caret = s.getRangeAt(0).cloneRange(); });
  // what each select offers
  const OPTS = {
    model:() => MODELS.map(m => [m[0], m[0], m[1]]),
    source:() => [['Website form', 'Website form'], ['Webhook', 'Webhook'], ['Schedule', 'Schedule'], ['New CRM contact', 'New CRM contact']],
    form:() => [['Book a demo', 'Book a demo'], ['Contact sales', 'Contact sales'], ['Newsletter signup', 'Newsletter signup']],
    when:() => [['Every submission', 'Every submission'], ['Work emails only', 'Work emails only', 'Skips gmail.com and the like'], ['Not from a customer', 'Not from a customer']],
    conn:n => (CONNS[n.ic] || CONNS.other).map(c => [c, c]).concat([['+ new', 'Connect another account']]),
    action:n => ({ tool:['Find a company by domain', 'Find a person by email'], app:['Send an email', 'Add to a list', 'Update a record', 'Create a task'], output:['Post a message', 'Reply in a thread'] }[n.type] || ['Run']).map(a => [a, a]),
    op:() => [['is at least', 'is at least'], ['is below', 'is below'], ['is', 'is exactly']],
    via:() => [['Slack message', 'Slack message'], ['Email', 'Email'], ['In the app', 'In the app']],
    expire:() => [['4 hours', '4 hours'], ['24 hours', '24 hours'], ['3 days', '3 days']],
    then:() => [['Stop the run', 'Stop the run'], ['Send it anyway', 'Send it anyway'], ['Ask someone else', 'Ask someone else']],
    limit:() => [['8s', '8 seconds'], ['15s', '15 seconds'], ['30s', '30 seconds'], ['60s', '60 seconds']],
    onfail:() => [['stop', 'Stop the run'], ['skip', 'Skip this step'], ['empty', 'Carry on with empty data']],
    for:() => [['15 minutes', '15 minutes'], ['1 hour', '1 hour'], ['1 day', '1 day'], ['Until 9:00 on a weekday', 'Until 9:00 on a weekday']],
    list:() => [['Product updates, monthly', 'Product updates, monthly'], ['Product updates, weekly', 'Product updates, weekly'], ['Webinar invites', 'Webinar invites']],
    channel:() => [['#inbound-leads', '#inbound-leads'], ['#sales', '#sales'], ['#founders', '#founders']]
  };
  const FAIL = { stop:'Stop the run', skip:'Skip this step', empty:'Carry on with empty data' };
  const LABEL = { model:'Model', source:'Source', form:'Form', when:'Only when', conn:'Account', action:'Action', op:'Comparison', via:'Ask in', expire:'Nobody answers in', then:'Then', limit:'Time limit', onfail:'If it still fails', for:'Wait for', list:'List', channel:'Channel' };
  // a field of the picked step, read or written by its name ("in.email", "rule.n")
  const getF = (n, f) => f.split('.').reduce((o, k) => o && o[k], n.cfg);
  const setF = (n, f, v) => { const ks = f.split('.'), last = ks.pop(); const o = ks.reduce((o, k) => (o[k] ??= {}), n.cfg); o[last] = v; };
  const lastOf = id => R && R.C.spans.filter(s => s.node === id && s.e != null && s.e <= R.now && (s.k === 'step' || s.k === 'tool')).pop();
  function renderInspector(){
    const n = selId && byId(selId);
    if (!n){
      insp.innerHTML = `<div class="wfx-insp-e"><span class="wfx-ic big" aria-hidden="true">${I('cursor', 's')}</span><b>Pick a step to set it up</b><span>Or ask the agent to add one with ⌘K.</span></div>`
        + `<div class="wfx-insp-l" role="list" aria-label="Steps">${topo().flatMap(x => [x, ...(x.cfg.tools || []).map(byId).filter(Boolean)]).map(x => `<button role="listitem" data-go="${x.id}"${x.type === 'tool' ? ' class="tl"' : ''}>${tile(x)}<span class="t">${esc(x.t)}</span><span class="muted">${TYPES[x.type].k}</span></button>`).join('')}</div>`;
      return;
    }
    const c = n.cfg, T = TYPES[n.type], idx = topo().indexOf(n), ok = reach(n);
    const ran = lastOf(n.id);
    let h = `<div class="sti-h">${stile(n, 's')}<span class="sti-tx"><span class="sti-nr"><input class="sti-n" value="${esc(n.t)}" aria-label="Step name" maxlength="40" spellcheck="false" autocomplete="off">${n.off ? '<span class="tag sti-off">Off</span>' : ''}</span><span class="sti-kd">${T.k}${n.type === 'tool' ? ', used by ' + esc(byId(n.host)?.t || '') : idx >= 0 ? `, step ${idx + 1} of ${flow().length}` : ''}</span></span>`
      + `<button class="ib" data-a="test" aria-label="Test this step on its own" data-tip="Test this step">${I('play', 's')}</button><button class="ib" data-a="menu" data-pop="#wf-p-node" data-pop-align="end" aria-haspopup="menu" aria-label="Step actions" data-tip="More">${I('more', 's')}</button><button class="ib wfx-insp-x" data-a="close" aria-label="Close the step" data-tip="Close" data-tip-k="Esc">${I('x', 's')}</button></div>`;
    if (ran) h += `<button class="wfx-insp-run" data-a="data"><span class="dot" style="color:${ran.st === 'bad' ? 'var(--dm-bad)' : 'var(--dm-ok-mark)'}"></span><span>${ran.st === 'bad' ? 'Failed' : 'Ran'} in the last run, ${secs(ran.e - ran.s)}</span><span class="go">See its data${I('chev-r', 'xs')}</span></button>`;
    const okOf = v => v ? ok.has(v) : null;
    const missing = Object.values(c.in || {}).filter(v => v && !ok.has(v)).length, mapped = Object.keys(c.in || {}).length;
    const inMeta = missing ? `<span class="tag bad">${missing} missing</span>` : `<span class="n">${mapped} mapped</span>`;
    const inputs = () => Object.keys(c.in || {}).map(k => row(esc(k), varBtn('in.' + k, c.in[k], k, okOf(c.in[k]))) + note(c.in[k], okOf(c.in[k]))).join('') + `<button class="pill ghost sm wfx-addin" data-a="addin">${I('plus', 'xs')}Map another field</button>`;
    const fails = (tool = false) => sec('fail', 'If it fails', row('Retries', num('retries', c.retries, 0, 5, 'Retries')) + row('Wait between', segBtns('backoff', c.backoff, [['fixed', '2s each'], ['doubling', 'Doubling']], 'Wait between tries'))
      + row(LABEL.limit, selBtn('limit', (OPTS.limit().find(o => o[0] === c.limit) || [0, c.limit])[1], LABEL.limit)) + (tool ? row('Cache', toggle('cache', c.cache, 'Reuse results for 24 hours')) : '') + row(LABEL.onfail, selBtn('onfail', FAIL[c.onfail], LABEL.onfail)));
    const outs = () => sec('out', 'Output', n.out.length ? n.out.map(o => `<div class="sti-out"><span>${esc(o[0])}</span><span class="tag ${TYPE_TONE[o[1]] || 'b'}">${o[1]}</span><span class="ex">${esc(o[2])}</span></div>`).join('') : '<p class="sti-p">Nothing. The run carries on as it was.</p>', `<span class="n">${n.out.length} ${n.out.length === 1 ? 'field' : 'fields'}</span>`);
    if (n.type === 'trigger') h += sec('setup', 'Starts when', row(LABEL.source, selBtn('source', c.source, LABEL.source)) + (c.form ? row(LABEL.form, selBtn('form', c.form, LABEL.form)) : '') + (c.when ? row(LABEL.when, selBtn('when', c.when, LABEL.when)) : '')) + outs();
    if (n.type === 'ai'){
      h += sec('setup', 'Setup', row(LABEL.model, selBtn('model', c.model, LABEL.model))
        + `<div class="sti-insw"><div class="sti-ih"><span class="k" id="wf-pr-l">Instructions</span><button class="pill ghost sm" data-f="prompt" data-pop="#wf-p-var" aria-haspopup="dialog">${I('plus', 'xs')}Insert data</button></div><div class="sti-ins" contenteditable="true" role="textbox" aria-multiline="true" aria-labelledby="wf-pr-l" spellcheck="false">${insHTML(n, ok)}</div></div>`
        + row('Tools', `<span class="sti-chips">${c.tools.map(t => byId(t)).filter(Boolean).map(t => `<span class="sti-chip">${stile(t)}<button class="wfx-chip-t" data-go="${t.id}">${esc(t.t)}</button><button class="sti-cx" data-a="untool" data-t="${t.id}" aria-label="Remove ${esc(t.t)}" data-tip="Remove">${I('x', 'xs')}</button></span>`).join('')}<button class="sti-add" data-f="tool" data-pop="#wf-p-sel" aria-haspopup="menu" aria-label="Add a tool" data-tip="Add a tool">${I('plus', 'xs')}</button></span>`, ' top'))
        + sec('in', 'Inputs', inputs(), inMeta) + outs() + fails();
    }
    if (n.type === 'tool') h += sec('setup', 'Setup', row(LABEL.conn, selBtn('conn', c.conn, LABEL.conn)) + row(LABEL.action, selBtn('action', c.action || 'Find a company by domain', LABEL.action))) + sec('in', 'Inputs', inputs(), inMeta) + outs() + fails(true);
    if (n.type === 'app' || n.type === 'output') h += sec('setup', 'Setup', row(LABEL.conn, selBtn('conn', c.conn, LABEL.conn)) + (c.list ? row(LABEL.list, selBtn('list', c.list, LABEL.list)) : '') + (n.type === 'output' ? row(LABEL.channel, selBtn('channel', c.channel || '#inbound-leads', LABEL.channel)) : ''))
      + sec('in', 'Inputs', inputs(), inMeta) + outs() + fails();
    if (n.type === 'branch'){
      const o = outsOf(n.id), yes = o.find(e => e.label === 'yes'), no = o.find(e => e.label === 'no');
      const link = e => `<button class="sti-link" data-go="${e.t}">${stile(byId(e.t))}<span>${esc(byId(e.t).t)}</span></button>`;
      h += sec('setup', 'Takes Yes when', `<div class="sti-rule">${varBtn('rule.v', c.rule.v, 'Value', okOf(c.rule.v))}${selBtn('rule.op', c.rule.op, 'Comparison')}<input class="sti-in" type="number" inputmode="numeric" data-f="rule.n" value="${c.rule.n}" min="0" max="100" aria-label="Threshold"></div>` + note(c.rule.v, okOf(c.rule.v))
        + row('Yes', yes ? link(yes) : '<span class="muted">Ends the run</span>')
        + row('No', no ? link(no) : `<button class="pill ghost sm" data-pop="#wf-p-pick" data-no="${n.id}" aria-haspopup="dialog">${I('plus', 'xs')}Add a No path</button>`)) + outs();
    }
    if (n.type === 'approval'){
      const draft = upstream(n.id).filter(u => u.type === 'ai').pop();
      h += sec('setup', 'Who approves', row('People', `<span class="sti-chips">${c.who.map(w => `<span class="sti-chip">${av(w)}<span>${P[w][0]}</span><button class="sti-cx" data-a="unwho" data-w="${w}" aria-label="Remove ${P[w][0]}" data-tip="Remove">${I('x', 'xs')}</button></span>`).join('')}<button class="sti-add" data-f="who" data-pop="#wf-p-sel" aria-haspopup="menu" aria-label="Add a person" data-tip="Add a person">${I('plus', 'xs')}</button></span>`, ' top')
        + row(LABEL.via, selBtn('via', c.via, LABEL.via)) + row('They see', draft ? tok(draft.ref + '.' + (draft.out[0] || [''])[0]) : '<span class="muted">The run so far</span>'))
        + sec('exp', 'If nobody answers', row(LABEL.expire, selBtn('expire', c.expire, LABEL.expire)) + row(LABEL.then, selBtn('then', c.then, LABEL.then))) + outs();
    }
    if (n.type === 'wait') h += sec('setup', 'Setup', row(LABEL.for, selBtn('for', c.for, LABEL.for)) + `<p class="sti-p">Test runs skip the wait.</p>`) + outs();
    h += `<div class="wfx-insp-f"><span class="muted">Changes save to the draft</span><button class="pill line sm" data-a="test">${I('play', 'xs')}Test this step</button></div>`;
    const ae = document.activeElement, keep = insp.scrollTop, foc = ae && insp.contains(ae) ? (ae.dataset.f || (ae.classList.contains('sti-ins') ? 'ins' : ae.classList.contains('sti-n') ? 'name' : null)) : null;
    insp.innerHTML = h; insp.scrollTop = keep; caret = null;
    $$('.sti-seg', insp).forEach(g => seg(g));
    if (foc){ const el = foc === 'ins' ? $('.sti-ins', insp) : foc === 'name' ? $('.sti-n', insp) : $(`[data-f="${foc}"]`, insp); if (el && el.tagName !== 'BUTTON'){ el.focus({ preventScroll:true }); if (foc === 'ins') caretAt(el, null); } }
  }
  // puts the caret in the instructions after the token at index i, or at their end
  function caretAt(box, i){ const r = document.createRange(), t = i == null ? null : $$('[data-ref]', box)[i]; if (t){ r.setStartAfter(t.nextSibling || t); } else { r.selectNodeContents(box); r.collapse(false); } r.collapse(true); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  const editNode = (desc, key, fn, o) => { const n = byId(selId); if (!n) return; commit(desc, () => fn(n), { key:n.id + '.' + key, ...o }); };
  // clicks in the inspector: sections, steps, the select menus, the data picker, steppers, switches and buttons
  insp.addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    const n = byId(selId);
    if (b.dataset.sec){ const f = b.nextElementSibling, open = f.classList.toggle('shut') === false; b.setAttribute('aria-expanded', open); open ? shut.delete(b.dataset.sec) : shut.add(b.dataset.sec); return; }
    if (b.dataset.go){ select(b.dataset.go, { open:true }); return; }
    if (!n) return;
    const f = b.dataset.f, a = b.dataset.a;
    if (b.matches('.sti-sel, .sti-add[data-f]')) return buildSel(n, f);
    if (b.matches('[data-pop="#wf-p-var"]')){
      // Insert data puts a token where the caret was in the instructions, or at their end
      if (f === 'prompt'){ const box = $('.sti-ins', insp), at0 = caret && box && box.contains(caret.startContainer) ? caret.cloneRange() : null;
        return openVar({ node:n.id, cur:null, set:ref => { const bx = $('.sti-ins', insp); if (!bx) return; const t = html(tok(ref, ` contenteditable="false" data-ref="${ref}"`)), sp = document.createTextNode(' ');
          if (at0 && bx.contains(at0.startContainer)){ at0.collapse(false); at0.insertNode(sp); at0.insertNode(t); } else bx.append(t, sp);
          const i = $$('[data-ref]', bx).indexOf(t), v = readIns(bx);
          editNode(`Edited the instructions on ${n.t}`, 'prompt', x => { x.cfg.prompt = v; });
          const b2 = $('.sti-ins', insp); if (b2){ b2.focus({ preventScroll:true }); caretAt(b2, i); const nt = $$('[data-ref]', b2)[i]; if (nt && !REDUCE) nt.classList.add('new'); } } }); }
      return openVar({ node:n.id, cur:getF(n, f), set:ref => editNode(`Mapped ${f.split('.').pop()} on ${n.t}`, f, x => setF(x, f, ref)) });
    }
    if (b.dataset.d){ if (b.getAttribute('aria-disabled') === 'true') return; const v = clamp((getF(n, f) || 0) + +b.dataset.d, 0, 5); editNode(`Set retries on ${n.t} to ${v}`, f, x => setF(x, f, v)); return; }
    if (b.matches('.wfx-tg')){ const v = b.getAttribute('aria-checked') !== 'true'; editNode(`${v ? 'Turned on' : 'Turned off'} caching on ${n.t}`, f, x => setF(x, f, v)); return; }
    if (b.closest('.sti-seg')){ const g = b.closest('.sti-seg'); editNode(`Changed the wait between tries on ${n.t}`, g.dataset.f, x => setF(x, g.dataset.f, b.dataset.v)); return; }
    if (a === 'close') return select(null);
    if (a === 'test') return testStep(n.id);
    if (a === 'data'){ openDrawer(true); setDrTab('data'); dataTab = n.ref; paintData(); return; }
    if (a === 'menu') return buildNodeMenu(n);
    if (a === 'untool'){ const t = byId(b.dataset.t); return commit(`Removed ${t.t} from ${n.t}`, () => { n.cfg.tools = n.cfg.tools.filter(x => x !== t.id); W.nodes = W.nodes.filter(x => x.id !== t.id); }); }
    if (a === 'unwho'){ if (n.cfg.who.length < 2){ toast('info', 'Someone has to approve', 'Add another person first'); return; } return editNode(`Changed who approves ${n.t}`, 'who', x => { x.cfg.who = x.cfg.who.filter(w => w !== b.dataset.w); }); }
    if (a === 'addin'){ const ups = upstream(n.id).flatMap(u => u.out.map(o => [u.ref + '.' + o[0], o[0]])).filter(([r, k]) => !n.cfg.in[k] && !Object.values(n.cfg.in).includes(r));
      const nx = ups[0]; if (!nx){ toast('info', 'Every field is mapped', 'There is no other data before this step'); return; } editNode(`Mapped ${nx[1]} on ${n.t}`, 'in.' + nx[1], x => { x.cfg.in[nx[1]] = nx[0]; }); }
  });
  // typing: the name, the instructions and the branch's number save as you go, as one change each
  let typed = false;
  insp.addEventListener('input', e => {
    const n = byId(selId); if (!n) return; const t = e.target; typed = true;
    if (t.matches('.sti-n')){ const v = t.value.trim() || TYPES[n.type].k, was = n.t; commit(`Renamed a step to ${v}`, () => { n.t = v; }, { key:n.id + '.name', quiet:true }); const el = $(`.wfx-node[data-id="${n.id}"] .wfx-n1 .t`, nodesEl); if (el) el.textContent = v; if (was !== v) say(''); }
    if (t.matches('.sti-ins')) commit(`Edited the instructions on ${n.t}`, () => { n.cfg.prompt = readIns(t); }, { key:n.id + '.prompt', quiet:true });
    if (t.dataset.f === 'rule.n'){ const v = clamp(+t.value || 0, 0, 1000); commit(`Set the threshold on ${n.t} to ${v}`, () => { n.cfg.rule.n = v; }, { key:n.id + '.rule', quiet:true }); const m = $(`.wfx-node[data-id="${n.id}"] .m`, nodesEl); if (m) m.innerHTML = meta(n); }
  });
  // once you stop typing, the canvas catches up, and a {{step.field}} typed into the instructions becomes a token
  insp.addEventListener('focusout', e => {
    if (!e.target.matches('.sti-ins, .sti-n, [data-f="rule.n"]') || !typed) return; typed = false;
    const n = byId(selId); renderCanvas(); paintTop();
    if (n && e.target.matches('.sti-ins') && /\{\{/.test(e.target.textContent)) e.target.innerHTML = insHTML(n, reach(n));
  });
  insp.addEventListener('keydown', e => {
    if (e.key === 'Enter' && e.target.matches('.sti-n')){ e.preventDefault(); e.target.blur(); }
    // Enter starts a new line in the instructions as plain text, so the box never fills with markup
    if (e.key === 'Enter' && e.target.matches('.sti-ins')){ e.preventDefault(); const s = getSelection(); if (!s.rangeCount) return; const rg = s.getRangeAt(0); rg.deleteContents(); const nl = document.createTextNode('\n'); rg.insertNode(nl); rg.setStartAfter(nl); rg.collapse(true); s.removeAllRanges(); s.addRange(rg); e.target.dispatchEvent(new Event('input', { bubbles:true })); }
  });
  // one menu for every select in the inspector, built as it opens
  const ck = `<span class="ck">${I('check', 'xs')}</span>`;
  const mi = (attrs, body, role = 'menuitemradio', checked = false) => `<button class="mi" role="${role}" aria-checked="${checked}" tabindex="-1" data-close ${attrs}>${body}${role !== 'menuitem' ? ck : ''}</button>`;
  function buildSel(n, f){
    const p = $('#wf-p-sel', app);
    if (f === 'tool'){
      const have = new Set((n.cfg.tools || []).map(t => byId(t)?.t));
      p.innerHTML = `<div class="ph" role="none">Give ${esc(n.t)} a tool</div>` + TOOLS.map(([ic, t, conn, d], i) => WS_TOOLS.has(t) ? mi(`data-i="${i}"${have.has(t) ? ' aria-disabled="true"' : ''}`, `${I(ic, 's')}<span>${t}<span class="d">${d}</span></span>`, 'menuitem') : '').join('');
      $$('.mi', p).forEach(m => m.onclick = () => { if (m.getAttribute('aria-disabled') === 'true') return; const [ic, t, conn, , out] = TOOLS[+m.dataset.i]; const tn = uniq(N('tool', t, { ic, host:n.id, out:out.map(o => [...o]), cfg:{ conn, action:t === 'Company lookup' ? 'Find a company by domain' : 'Search' } }));
        commit(`Gave ${n.t} the ${t} tool`, () => { W.nodes.push(tn); n.cfg.tools.push(tn.id); }); });
      return;
    }
    if (f === 'who'){
      p.innerHTML = `<div class="ph" role="none">Who can approve</div>` + Object.keys(P).map(w => mi(`data-w="${w}"`, `${av(w)}<span>${P[w][0]}</span>`, 'menuitemcheckbox', n.cfg.who.includes(w))).join('');
      $$('.mi', p).forEach(m => m.onclick = () => { const w = m.dataset.w; editNode(`Changed who approves ${n.t}`, 'who', x => { x.cfg.who = x.cfg.who.includes(w) ? (x.cfg.who.length > 1 ? x.cfg.who.filter(y => y !== w) : x.cfg.who) : [...x.cfg.who, w]; }); });
      return;
    }
    const key = f.split('.').pop(), cur = getF(n, f), opts = OPTS[key](n);
    p.innerHTML = `<div class="ph" role="none">${LABEL[key] || key}</div>` + opts.map(([v, t, d]) => mi(`data-v="${esc(v)}"`, `<span>${esc(t)}${d ? `<span class="d">${esc(d)}</span>` : ''}</span>`, v === '+ new' ? 'menuitem' : 'menuitemradio', v === cur)).join('');
    $$('.mi', p).forEach(m => m.onclick = () => {
      const v = m.dataset.v; if (v === '+ new'){ toast('info', 'Connecting accounts is outside the template', 'Pick one of the connected accounts'); return; }
      if (v === cur) return;
      editNode(`Changed ${(LABEL[key] || key).toLowerCase()} on ${n.t} to ${(opts.find(o => o[0] === v) || [])[1]}`, f, x => setF(x, f, key === 'n' ? +v : v));
    });
  }
  // a step's own menu: duplicate, turn off, delete
  function buildNodeMenu(n){
    const p = $('#wf-p-node', app);
    p.innerHTML = `<div class="ph" role="none">${esc(n.t)}</div>` + mi('data-a="dup"', `${I('copy', 's')}<span>Duplicate</span>`, 'menuitem') + mi('data-a="off"', `${I(n.off ? 'play' : 'pause', 's')}<span>${n.off ? 'Turn on' : 'Turn off'}</span>`, 'menuitem')
      + (n.type === 'trigger' ? '' : `<div class="sep" role="separator"></div><button class="mi bad" role="menuitem" tabindex="-1" data-close data-a="del">${I('trash', 's')}<span>Delete step</span><span class="kbd">Del</span></button>`);
    $$('.mi', p).forEach(m => m.onclick = () => {
      const a = m.dataset.a;
      if (a === 'dup'){ if (n.type === 'trigger'){ toast('info', 'A workflow has one trigger', 'Duplicate a later step instead'); return; } const c = JSON.parse(JSON.stringify(n.cfg)); if (c.tools) c.tools = []; addStep({ type:n.type, ic:n.ic, t:n.t + ' copy', cfg:c }, { after:n.id }); }
      if (a === 'off') commit(`${n.off ? 'Turned on' : 'Turned off'} ${n.t}`, () => { n.off = !n.off; });
      if (a === 'del') setTimeout(() => removeNode(n.id), 130);
    });
  }

  /* ---------- the run: a plan worked out from the graph, played back over time ---------- */
  const DUR = { trigger:.15, branch:.05, app:.55, output:.4, wait:.3, tool:.7 };
  const TOKS = { think:380, write:1240 };
  function outFor(n, L){
    const r = n.ref, v = Object.fromEntries(n.out.map(o => [o[0], o[1] === 'number' ? +o[2] || 0 : o[2]]));
    if (!L) return v;
    if (r === 'form') return { name:L.n, email:L.email, company:L.co, seats:L.seats, message:L.msg };
    if (r === 'lookup') return { employees:L.emp, industry:L.ind, funding:L.fund, country:'Germany' };
    if (r === 'research') return { score:L.score, tier:L.tier, reasons:L.why, summary:`${L.co}, ${L.ind.toLowerCase()}, ${L.emp} people, ${L.fund}. Asked for ${L.seats} seats.` };
    if (r === 'reply') return { subject:`Your demo with Fernhill, ${L.n.split(' ')[0]}`, body:`Hi ${L.n.split(' ')[0]}, thanks for reaching out about ${L.seats} seats at ${L.co}. ${L.why[1]} is exactly what teams use us for. Would Tuesday at 10:00 or Thursday at 15:00 work for a 30 minute call?` };
    if (r === 'nurture') return { added:true, list:n.cfg.list };
    return v;
  }
  function newCtx(L, o = {}){ return { L, o, active:new Set(), done:new Map(), out:{}, spans:[], logs:[], skip:new Set(), pos:0, order:topo(), end:null, pause:null, segEnd:0, tok:0, retries:0, sid:0 }; }
  const span = (C, s) => { s.id = ++C.sid; C.spans.push(s); return s; };
  const logAt = (C, at, ic, b, d = '', tone = '', det = '') => C.logs.push({ at, ic, b, d, tone, det });
  // a step that calls out (a tool or an app) tries again on failure, as its retries say
  function attempts(C, n, s, lv, k){
    const max = 1 + (n.cfg.retries || 0), fail = C.o.fail && (C.o.fail.node || byRef('lookup')?.id) === n.id ? C.o.fail : null, err = (fail && fail.err) || '429 Too many requests from Company data API', short = /^401/.test(err) ? 'signed out (401)' : /^429/.test(err) ? 'rate limited (429)' : err.split(' ')[0];
    let t = s, i = 0;
    for (;;){
      i++; const bad = fail && i <= fail.times, d = bad ? 1.6 : DUR[n.type] || .5;
      span(C, { node:n.id, n:n.t + (i > 1 ? `, try ${i}` : ''), ic:n.ic, k, lv, s:t, e:t + d, st:bad ? 'bad' : 'ok', err:bad ? err : '', short:bad ? short : '' });
      t += d;
      if (!bad){ logAt(C, t, n.ic, n.type === 'tool' ? `${n.t} found ${C.L ? C.L.co : 'the record'}` : `${n.t} done`, i > 1 ? `Worked on try ${i}` : n.cfg.conn || '', 'ok', JSON.stringify(outFor(n, C.L), null, 2)); return { e:t, ok:true, tries:i }; }
      if (i >= max){ logAt(C, t, 'x', `${n.t} failed`, `${err}. Out of retries`, 'bad'); return { e:t, ok:false, tries:i }; }
      const w = n.cfg.backoff === 'doubling' ? 2 ** (i - 1) : 2;
      logAt(C, t, 'x', `${n.t} failed`, `${err}. Trying again in ${w}s`, 'bad');
      span(C, { node:n.id, n:`Wait ${w}s, then try again`, ic:'refresh', k:'retry', lv, s:t, e:t + w, st:'retry' }); C.retries++;
      t += w;
    }
  }
  // runs the steps in order from where the plan stands, until the end, a failure or an approval it has to wait for
  function advance(C, t0){
    while (C.pos < C.order.length){
      const n = C.order[C.pos], inc = insOf(n.id).filter(e => C.active.has(e.f + '>' + e.t));
      const isFirst = C.o.only ? C.order.length === 1 : !insOf(n.id).length;
      if (!isFirst && !inc.length){ C.pos++; continue; }
      const s = isFirst ? t0 : Math.max(...inc.map(e => C.done.get(e.f)));
      if (n.off){ logAt(C, s, 'pause', `${n.t} is turned off`, 'Skipped'); finishNode(C, n, s); C.pos++; continue; }
      const st = span(C, { node:n.id, n:n.t, ic:n.ic, k:'step', lv:0, s, e:null, st:'ok' });
      let t = s;
      if (n.type === 'trigger'){ t += DUR.trigger; logAt(C, t, n.ic, n.t, C.L ? `New submission from ${C.L.email}` : 'New event received', 'ok', JSON.stringify(outFor(n, C.L), null, 2)); }
      else if (n.type === 'branch'){
        t += DUR.branch; const r = n.cfg.rule, { n:src, k } = vref(r.v), val = src && C.out[src.ref] ? +C.out[src.ref][k] : (C.L ? C.L.score : 80);
        const pass = r.op === 'is below' ? val < r.n : r.op === 'is' ? val === r.n : val >= r.n, path = pass ? 'yes' : 'no';
        C.path = path; C.out[n.ref] = { path:pass ? 'Yes' : 'No' };
        logAt(C, t, 'branch', `${n.t} took ${pass ? 'Yes' : 'No'}`, `${k || 'value'} is ${val}, ${r.op} ${r.n}${pass ? '' : ' is false'}`);
        // the steps only the other path reaches are skipped; a step both paths reach still runs
        const reach = id => { const s = new Set(), w = x => outsOf(x).forEach(e => { if (!s.has(e.t)){ s.add(e.t); w(e.t); } }); s.add(id); w(id); return s; };
        const o = outsOf(n.id), taken = o.filter(e => !e.label || e.label === path), other = o.filter(e => e.label && e.label !== path);
        const keep = new Set(taken.flatMap(e => [...reach(e.t)])); other.forEach(e => reach(e.t).forEach(x => { if (!keep.has(x)) C.skip.add(x); }));
        C.skipAt = t; st.e = t; C.done.set(n.id, t); taken.forEach(e => C.active.add(e.f + '>' + e.t)); C.pos++; continue;
      }
      else if (n.type === 'ai'){
        const think = span(C, { node:n.id, n:`${n.cfg.model}, reads the input`, ic:'spark', k:'model', lv:1, s:t, e:t + .55, st:'ok', tok:TOKS.think }); t = think.e; C.tok += TOKS.think;
        for (const tid of n.cfg.tools || []){ const tn = byId(tid); if (!tn || tn.off) continue; const r = attempts(C, tn, t, 1, 'tool'); t = r.e;
          if (!r.ok){ if (tn.cfg.onfail === 'stop'){ st.e = t; st.st = 'bad'; st.err = 'tool'; st.short = 'its tool failed'; C.end = { t, failed:n.id, tool:tn.id }; logAt(C, t, 'x', 'Run stopped', `${n.t} could not use ${tn.t}`, 'bad'); C.segEnd = t; return; } }
          else C.out[tn.ref] = outFor(tn, C.L); }
        const w = span(C, { node:n.id, n:`${n.cfg.model}, writes the answer`, ic:'spark', k:'model', lv:1, s:t, e:t + (n.cfg.model === 'Haiku 5.5' ? .6 : n.cfg.model === 'Opus 5.5' ? 1.9 : 1.15), st:'ok', tok:TOKS.write }); t = w.e; C.tok += TOKS.write;
        const o = outFor(n, C.L); logAt(C, t, 'spark', n.t, o.score != null ? `Scored ${o.score}, ${o.tier}` : o.subject ? `Drafted “${o.subject}”` : `${TOKS.think + TOKS.write} tokens`, 'ok', JSON.stringify(o, null, 2));
      }
      else if (n.type === 'approval'){
        const who = n.cfg.who.map(first).join(' or ');
        if (C.o.approve === 'live' || C.o.approve === 'wait'){ logAt(C, t, 'user', `Waiting for ${who}`, `Asked in ${VIA[n.cfg.via] || n.cfg.via}`, 'warn'); st.st = 'wait'; C.pause = { node:n.id, at:t, span:st }; C.segEnd = t; return; }
        const a = C.o.approve || { by:n.cfg.who[0], after:'6 min' }; t += .4; st.note = a.after;
        logAt(C, t, 'check', `Approved by ${P[a.by][0]}`, `After ${a.after}`, 'ok');
      }
      else if (n.type === 'wait'){ t += DUR.wait; logAt(C, t, 'clock', `${n.t} skipped`, `Test runs don't wait ${n.cfg.for}`); }
      else {
        st.k = 'step'; C.spans.pop(); C.sid--;
        const r = attempts(C, n, t, 0, 'step'); t = r.e;
        if (!r.ok){ if (n.cfg.onfail === 'stop'){ C.end = { t, failed:n.id }; logAt(C, t, 'x', 'Run stopped', `${n.t} failed`, 'bad'); C.segEnd = t; return; } }
        C.done.set(n.id, t); C.out[n.ref] = outFor(n, C.L); outsOf(n.id).forEach(e => C.active.add(e.f + '>' + e.t)); C.pos++; continue;
      }
      st.e = t; finishNode(C, n, t); C.pos++;
    }
    C.segEnd = Math.max(t0, ...C.spans.map(s => s.e || 0)); C.end = C.end || { t:C.segEnd, ok:true };
  }
  function finishNode(C, n, t){ C.done.set(n.id, t); if (!C.out[n.ref]) C.out[n.ref] = outFor(n, C.L); outsOf(n.id).forEach(e => C.active.add(e.f + '>' + e.t)); }
  // the person approves (or not) in a test run; the time spent waiting shows as a short bar
  function decide(C, t, ok){
    const p = C.pause; if (!p) return; C.pause = null; const n = byId(p.node);
    p.span.e = t; p.span.st = ok ? 'ok' : 'bad'; p.span.note = 'You';
    if (!ok){ logAt(C, t, 'x', `${n.t}: rejected`, 'The run stops here', 'bad'); C.end = { t, failed:n.id, rejected:true }; C.segEnd = t; return; }
    logAt(C, t, 'check', `Approved by ${P[ME][0]}`, 'In a test run, you approve for the team', 'ok');
    finishNode(C, n, t); C.pos++; advance(C, t);
  }

  /* ---------- the run drawer: Run drawer, its timeline, its log and its data ---------- */
  const dr = $('.wf-dr', app), drT = $('.rdr-tg', dr), drMeta = $('.rdr-meta', dr), drTg = $('.rdr-tg', dr), drNote = $('.wfx-dr-note', dr), drB = $('.rdr-b', dr);
  const trRows = $('.rdr-rows', dr), trSc = $('.rdr-sc', dr), logEl = $('.rdr-log', dr), logN0 = $('.rdr-lf .n', dr), stopB = $('.rdr-stop', dr), followB = $('.rdr-follow', dr);
  let drTab = 'steps', dataTab = null, follow = true, lvl = 'all';
  // the agent's card beside the steps: it fades in as its column opens (or, on a narrow drawer, as it opens its room over the
  // steps), and fades out before the column closes
  const stacked = () => getComputedStyle(drNote).position === 'static';
  function noteIn(){ const c = drNote.firstElementChild; if (!c || REDUCE) return; enter(c); if (stacked()) grow(c); }
  function setNote(h){ drNote.innerHTML = h; noteIn(); }
  function clearNote(){
    const c = drNote.firstElementChild; if (!c) return;
    if (REDUCE){ drNote.innerHTML = ''; return; }
    if (c._out) return; c._out = true;
    if (stacked()) return shrink(c);
    c.inert = true; const go = () => { if (c.parentNode === drNote) drNote.removeChild(c); };
    c.animate([{ opacity:1, transform:'none' }, { opacity:0, transform:'translateY(4px)' }], { duration:MT('--dm-t-fast'), easing:'ease-in', fill:'forwards' }).finished.then(go, go);
  }
  // the drawer slides open and shut (Run drawer's own height transition), its body fading with it
  function openDrawer(on){ if (dr.classList.contains('shut') === on) settle(); clearTimeout(dr._anim); dr.classList.add('anim'); dr.classList.toggle('shut', !on); app.classList.toggle('dro', on); drTg.setAttribute('aria-expanded', String(on)); drTg.setAttribute('aria-label', on ? 'Hide the run' : 'Show the run'); dr._anim = setTimeout(() => dr.classList.remove('anim'), REDUCE ? 0 : MT('--dm-t') + 50); }
  drTg.onclick = () => openDrawer(dr.classList.contains('shut'));
  const drSeg = seg($('.rdr-tabs', dr), v => setDrTab(v));
  function setDrTab(v){ drTab = v; $$('.rdr-tabs button', dr).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === v))); drSeg.place(); $$('.rdr-v', dr).forEach(x => x.hidden = x.dataset.v !== v); if (v === 'data') paintData(); }
  // the log's levels: all of them, the warnings or the errors
  // lines a level hides fade where they were and the rest close up; lines it brings back fade in
  seg($('.rdr-lvs', dr), v => { lvl = v; reflow(() => $$('.rdr-l', logEl), filterLog, { root:logEl.parentElement }); });
  function filterLog(){ let n = 0; $$('.rdr-l', logEl).forEach(li => { li.hidden = lvl !== 'all' && li.dataset.l !== lvl; if (!li.hidden) n++; }); logN0.textContent = `${n} ${n === 1 ? 'line' : 'lines'}`;
    const e = $('.rdr-le', logEl.parentElement); if (!n && !e) logEl.insertAdjacentHTML('afterend', `<p class="rdr-le">${R ? `No ${lvl === 'warn' ? 'warnings' : lvl === 'error' ? 'errors' : 'lines'} in this run yet.` : 'Run a test to see its log.'}</p>`); if (n && e) e.remove(); }
  followB.onclick = () => { follow = !follow; followB.setAttribute('aria-pressed', String(follow)); followB.dataset.tip = follow ? 'Follow the run' : 'Stay put'; };
  // the drawer's height: drag its top edge, or use the arrow keys on it
  { const grip = $('.rdr-grip', dr); let g = null;
    const setH = h => { h = clamp(Math.round(h), 160, Math.min(560, app.clientHeight - 200)); dr.style.setProperty('--rdr-h', h + 'px'); grip.setAttribute('aria-valuenow', h); };
    grip.addEventListener('pointerdown', e => { g = { y:e.clientY, h:dr.classList.contains('shut') ? 45 : dr.getBoundingClientRect().height }; grip.setPointerCapture(e.pointerId); grip.classList.add('on'); dr.classList.add('drag'); app.classList.add('drag-dr'); if (dr.classList.contains('shut')){ dr.classList.remove('shut'); app.classList.add('dro'); drTg.setAttribute('aria-expanded', 'true'); } });
    grip.addEventListener('pointermove', e => { if (g) setH(g.h - (e.clientY - g.y)); });
    const up = () => { if (!g) return; g = null; grip.classList.remove('on'); dr.classList.remove('drag'); app.classList.remove('drag-dr'); if (selId) reveal(selId); }; grip.addEventListener('pointerup', up); grip.addEventListener('pointercancel', up);
    grip.addEventListener('keydown', e => { const d = e.key === 'ArrowUp' ? 24 : e.key === 'ArrowDown' ? -24 : 0; let h = d ? dr.getBoundingClientRect().height + d : null; if (e.key === 'Home') h = 160; if (e.key === 'End') h = 560; if (h == null) return; e.preventDefault(); if (dr.classList.contains('shut')) openDrawer(true);
      // from the keyboard the height eases to its next stop; a drag follows the pointer
      clearTimeout(dr._anim); dr.classList.add('anim'); settle(); setH(h); dr._anim = setTimeout(() => dr.classList.remove('anim'), REDUCE ? 0 : MT('--dm-t') + 50); }); }

  // the kind of each span, for its tile and its bar's colour: a step's own kind, its model and tool calls, a wait to retry
  const kOf = s => s.k === 'step' ? byId(s.node)?.type || 'app' : s.k;
  const stOf = (s, t) => s.e == null ? (R && R.state === 'stopped' ? 'stop' : 'wait') : t < s.e ? (s.k === 'retry' ? 'retry' : 'run') : s.st;
  let rowEls = new Map(), axisN = 0, nodeCache = new Map(), logN = 0;
  function startRun({ only = null, lead = W.lead } = {}){
    if (R && R.raf) cancelAnimationFrame(R.raf);
    const isTest = true, L = W.lead ? lead : null;
    const C = newCtx(L, { approve:'live', fail:L && L.fail ? { times:L.fail } : W.testFail || null, only });
    if (only){ const n = byId(only); C.order = n.type === 'tool' ? [] : [n]; if (n.type === 'tool'){ const r = attempts(C, n, 0, 0, 'step'); C.segEnd = r.e; C.end = r.ok ? { t:r.e, ok:true } : { t:r.e, failed:n.id }; if (r.ok) C.out[n.ref] = outFor(n, L); } else {
      // a step tested on its own gets the sample data its inputs map from
      upstream(n.id).forEach(u => C.out[u.ref] = outFor(u, L)); advance(C, 0); if (C.pause){ const p = C.pause; decide(C, p.at + .3, true); } } }
    else advance(C, 0);
    R = { id:++runSeq, test:isTest, only, C, L, t0:performance.now(), now:0, state:'run', live:true };
    resetRunView(); openDrawer(true); setDrTab('steps');
    stopB.hidden = false; $('.wf-test', app).classList.add('on');
    paintTop(); tick();
    say(only ? `Testing ${byId(only).t}` : 'Test run started');
  }
  function resetRunView(){ trRows.innerHTML = ''; logEl.innerHTML = ''; rowEls = new Map(); nodeCache = new Map(); logN = 0; axisN = 0; drNote.innerHTML = ''; dataTab = null; filterLog(); }
  function tick(){
    if (!R || !R.live) return;
    R.now = (performance.now() - R.t0) / 1000;
    if (R.now >= R.C.segEnd){
      R.now = R.C.segEnd;
      if (R.C.pause){ R.state = 'wait'; paintRun(); approvalCard(); return; }
      return finishRun();
    }
    paintRun(); R.raf = requestAnimationFrame(tick);
  }
  function finishRun(){
    const C = R.C; R.live = false; R.state = C.end && C.end.failed ? 'bad' : 'ok';
    stopB.hidden = true; $('.wf-test', app).classList.remove('on');
    paintRun(); paintTop();
    if (!R.only){
      const path = R.state === 'bad' ? `Failed at ${byId(C.end.tool || C.end.failed)?.t || 'a step'}` : C.path === 'no' ? 'Added to nurture' : C.path === 'yes' ? 'Reply sent' : 'Finished';
      W.runs.unshift({ id:R.id, test:true, lead:R.L, out:R.state, path:path + (C.retries ? `, ${C.retries} ${C.retries > 1 ? 'retries' : 'retry'}` : ''), dur:C.segEnd, when:'Just now', o:null, C, testOf:W.seq || 0 });
      R.saved = W.runs[0]; renderRuns();
    }
    const dur = secs(C.segEnd);
    if (R.state === 'ok') toast('ok', R.only ? `${byId(R.only).t} worked` : 'Test run passed', `${dur}${C.retries ? `, ${C.retries} ${C.retries > 1 ? 'retries' : 'retry'}` : ''}${C.tok ? `, ${(C.tok / 1000).toFixed(1)}k tokens` : ''}`, { label:'See the log', run:() => { openDrawer(true); setDrTab('log'); } });
    else toast('bad', C.end.rejected ? 'You rejected the reply' : 'Test run failed', C.end.rejected ? 'Nothing was sent' : `At ${byId(C.end.tool || C.end.failed).t}, after ${dur}`);
    fixCard();
    say(R.state === 'ok' ? 'Test run passed' : 'Test run failed');
  }
  stopB.onclick = () => { if (!R || !R.live) return; cancelAnimationFrame(R.raf); R.live = false; R.state = 'stopped'; R.now = Math.min(R.now, R.C.segEnd);
    R.C.spans.forEach(s => { if (s.s > R.now){ s.gone = true; } else if (s.e == null || s.e > R.now){ s.e = R.now; s.st = 'stop'; } }); R.C.logs = R.C.logs.filter(l => l.at <= R.now); R.C.end = { t:R.now, failed:null, stopped:true };
    logAt(R.C, R.now, 'stop', 'Run stopped', 'You stopped it', 'warn'); stopB.hidden = true; $('.wf-test', app).classList.remove('on'); $$('.rdr-ask', trRows).forEach(x => shrink(x)); clearNote(); paintRun(); paintTop(); toast('info', 'Run stopped', 'Nothing after this point ran'); };
  // a past run, shown whole
  function showRun(run){
    if (R && R.live){ toast('info', 'A test is running', 'Stop it first to look at another run'); return; }
    ctxOf(run);
    R = { id:run.id, test:run.test, C:run.C, L:run.lead, now:run.C.pause ? run.C.pause.at : run.C.segEnd, state:run.out, live:false, past:true, saved:run };
    resetRunView(); openDrawer(true); paintRun(true); paintTop();
    if (run.out === 'wait' && run.C.pause && byId(run.C.pause.node)){ const n = byId(run.C.pause.node); setNote(`<div class="wfx-note"><span class="wfx-ic">${I('clock', 'xs')}</span><span class="tx"><b>Waiting for ${n.cfg.who.map(first).join(' or ')}</b><span>Asked ${run.when}, in ${VIA[n.cfg.via] || n.cfg.via}. ${n.cfg.then} if nobody answers in ${n.cfg.expire}.</span></span><button class="pill line sm" data-a="nudge">Remind them</button></div>`);
      $('[data-a="nudge"]', drNote).onclick = () => toast('ok', 'Reminder sent', `${n.cfg.who.map(first).join(' and ')} got a nudge in Slack`); }
    else fixCard();
    $$('.wfx-run', app).forEach(b => b.setAttribute('aria-current', String(+b.dataset.run === run.id)));
  }
  // the canvas, the trace, the log and the header follow the run
  function paintRun(force){
    const C = R && R.C, t = R ? R.now : 0, done = R && !R.live;
    // the steps on the canvas
    W.nodes.forEach(n => {
      let st = '', line = '';
      if (C){
        const ss = C.spans.filter(s => s.node === n.id && !s.gone && s.s <= t + 1e-6 && (s.k === 'step' || s.k === 'tool' || s.k === 'retry'));
        const last = ss[ss.length - 1];
        if (last){
          st = stOf(last, t); const tries = ss.filter(s => s.k !== 'retry' && s.st === 'bad').length, main = ss.find(s => s.k === 'step') || ss[0];
          const took = (last.e ?? t) - ss[0].s;
          line = st === 'run' ? `Running, ${secs(t - main.s)}` : st === 'retry' ? `Failed, trying again in ${Math.max(1, Math.ceil(last.e - t))}s` : st === 'bad' ? (last.short ? `${last.err === 'tool' ? 'Stopped' : 'Failed'}, ${last.short}` : n.type === 'approval' ? 'Rejected' : 'Failed') : st === 'wait' ? `Waiting for ${n.cfg.who.map(first).join(' or ')}` : st === 'stop' ? 'Stopped'
            : n.type === 'branch' ? `Took ${C.out[n.ref] ? C.out[n.ref].path : 'Yes'}` : n.type === 'approval' ? (main.note === 'You' ? 'Approved by you' : `Approved, ${main.note || 'in time'}`) : `Done in ${secs(took)}${tries ? `, ${tries} ${tries > 1 ? 'retries' : 'retry'}` : ''}`;
          if (st === 'ok' && tries) st = 'okr';
          if (st === 'run' && follow && R.live && n.type !== 'tool' && !nodeCache.get(n.id)?.startsWith('run')) reveal(n.id);
        } else if (C.skip.has(n.id) && t >= (C.skipAt ?? 1e9)){ st = 'skip'; line = 'Skipped, other path'; }
        else if (done && !R.only && R.state !== 'wait'){ st = 'skip'; line = n.type === 'tool' ? 'Not used' : 'Not reached'; }
      }
      const key = st + '|' + line; if (!force && nodeCache.get(n.id) === key) return; nodeCache.set(n.id, key);
      const el = $(`.wfx-node[data-id="${n.id}"]`, nodesEl); if (!el) return;
      el.dataset.st = st; el.classList.toggle('ran', !!st);
      $('.r', el).textContent = line;
      $('.wfx-st', el).innerHTML = st === 'run' ? '<span class="spin"></span>' : st === 'ok' ? I('check', 'xs') : st === 'okr' ? I('check', 'xs') : st === 'bad' ? I('x', 'xs') : st === 'retry' ? I('refresh', 'xs') : st === 'wait' ? I('clock', 'xs') : '';
    });
    // the wires: lit once the run has passed along them, dashed where it didn't go
    if (C){ $$('path.e', svg).forEach(p => {
      if (p.dataset.tool){ const tn = byId(p.dataset.tool); p.classList.toggle('done', C.spans.some(s => s.node === tn.id && s.s <= t)); return; }
      const e = W.edges[+p.dataset.e]; if (!e) return;
      const reached = C.spans.some(s => s.node === e.t && !s.gone && s.s <= t + 1e-6) && C.active.has(e.f + '>' + e.t);
      const skip = (C.skip.has(e.t) || C.skip.has(e.f)) && t >= (C.skipAt ?? 1e9);
      p.classList.toggle('done', reached); p.classList.toggle('skip', skip && !reached);
    }); $$('.wfx-elab', nodesEl).forEach(l => { const e = W.edges[+l.dataset.e]; l.classList.toggle('skip', !!(e && C.skip.has(e.t) && t >= (C.skipAt ?? 1e9))); l.classList.toggle('done', !!(e && C.active.has(e.f + '>' + e.t) && C.spans.some(s => s.node === e.t && s.s <= t))); }); }
    else { $$('path.e', svg).forEach(p => p.classList.remove('done', 'skip')); $$('.wfx-elab', nodesEl).forEach(l => l.classList.remove('skip', 'done')); }
    if (!R) return;
    // the timeline: one row per span, each bar in its kind's colour, on an axis that grows with the run
    const SPAN = Math.max(10, Math.ceil((Math.max(t, ...C.spans.filter(s => s.s <= t && !s.gone).map(s => s.e != null ? Math.min(s.e, t) : t)) + 1) / 2) * 2);
    const wpx = trSc.clientWidth || 300, stp = [2, 5, 10, 20, 30, 60].find(x => SPAN / x * 34 <= wpx) || 60;
    if (SPAN * 100 + stp !== axisN){ axisN = SPAN * 100 + stp; trRows.style.setProperty('--rdr-g', (stp / SPAN * 100) + '%'); trSc.innerHTML = Array.from({ length:Math.floor(SPAN / stp) }, (_, i) => `<span style="left:${i * stp / SPAN * 100}%">${i * stp}s</span>`).join(''); }
    C.spans.forEach(s => {
      if (s.gone || s.s > t + 1e-6) return;
      let el = rowEls.get(s.id);
      if (!el){
        const k = kOf(s);
        el = html(`<button type="button" class="rdr-r" data-span="${s.id}" data-node="${s.node}" data-k="${k}" data-lv="${s.lv}" style="--lv:${s.lv}" aria-pressed="${s.node === selId}"><span class="rdr-n"><span class="rdr-ti" data-k="${k}" aria-hidden="true">${I(s.ic, 'xs')}</span><span class="rdr-nm">${esc(s.n)}</span></span><span class="rdr-bt"><i></i></span><span class="rdr-ms num"></span></button>`);
        trRows.appendChild(el); rowEls.set(s.id, el); if (R.live && !REDUCE) el.classList.add('in');
      }
      const st = stOf(s, t), e = s.e == null ? t : Math.min(s.e, t);
      el.dataset.st = st === 'okr' ? 'ok' : st; el.classList.toggle('run', st === 'run');
      const i = $('.rdr-bt i', el); i.style.left = (s.s / SPAN * 100) + '%'; i.style.width = Math.max(.4, (e - s.s) / SPAN * 100) + '%';
      $('.rdr-ms', el).textContent = st === 'wait' ? 'Waiting' : st === 'bad' ? 'Failed' : s.note && s.note !== 'You' ? s.note : secs(e - s.s);
      el.setAttribute('aria-label', `${s.n}, ${st === 'run' ? 'running' : st === 'retry' ? 'waiting to try again' : st === 'bad' ? 'failed' : st === 'wait' ? 'waiting' : st === 'stop' ? 'stopped' : 'done'}, ${secs(e - s.s)}`);
    });
    // the log, a line at a time, its levels in colour
    const LV = { bad:'error', warn:'warn', ok:'info' };
    const L = C.logs.filter(l => l.at <= t + 1e-6).sort((a, b) => a.at - b.at);
    for (; logN < L.length; logN++){ const l = L[logN], lv = LV[l.tone] || 'debug';
      const li = html(`<li class="rdr-l" data-l="${lv}" data-key="${logN}"><span class="t num">${l.at.toFixed(2)}s</span><span class="lv tag" data-l="${lv}">${lv}</span><span class="m"><b>${esc(l.b)}</b> <span>${esc(l.d)}</span></span></li>`);
      logEl.appendChild(li); if (R.live && !REDUCE) li.classList.add('in'); }
    filterLog();
    if (R.live && drTab === 'log' && follow) drB.scrollTop = drB.scrollHeight;
    if (R.live && drTab === 'steps' && follow){ const last = trRows.lastElementChild; if (last && last.offsetTop + last.offsetHeight > drB.scrollTop + drB.clientHeight) drB.scrollTop = last.offsetTop + last.offsetHeight - drB.clientHeight + 8; }
    // while a step waits to try again, the drawer says why
    if (R.live && R.state === 'run'){
      const rs = C.spans.find(s => s.k === 'retry' && s.s <= t && t < s.e), key = rs ? rs.id : 0;
      if (key !== R._note){ R._note = key;
        if (rs){ const n = byId(rs.node), f = C.spans.filter(s => s.node === rs.node && s.st === 'bad' && s.e <= t).pop(), tries = 1 + (n.cfg.retries || 0), k = C.spans.filter(s => s.node === rs.node && s.k !== 'retry' && s.s <= t).length;
          setNote(`<div class="wfx-note warn" role="status"><span class="wfx-ic">${I('refresh', 'xs')}</span><span class="tx"><b>${esc(n.t)} failed</b><span>${esc(f && f.err ? f.err : 'It did not answer')}. Try ${k + 1} of ${tries} starts in a moment.</span></span></div>`); }
        else if ($('.wfx-note.warn', drNote)) clearNote(); }
    }
    paintHead();
    if (drTab === 'data' && (done || Math.floor(t * 4) !== R._dq)){ R._dq = Math.floor(t * 4); paintData(); }
  }
  function paintHead(){
    // the run's state in colour: running in the accent, waiting amber, passed green, failed red, stopped grey
    const TAG = { run:['run', '<span class="spin"></span>Running'], wait:['warn', 'Waiting'], ok:['ok', 'Passed'], bad:['bad', 'Failed'], stopped:['', 'Stopped'] };
    if (!R){ const last = W.runs[0], tg = last && TAG[last.out];
      drT.innerHTML = I('chev-u', 'xs') + (last ? `<span><span class="w">Last run </span><span class="num">#${last.id}</span></span><span class="rdr-st tag ${tg[0]}">${tg[1]}</span>` : '<span>No runs yet</span>');
      drMeta.textContent = last ? `${last.path}, ${last.when}` : 'Press Test run to try the workflow'; return; }
    const C = R.C, st = R.live ? (R.state === 'wait' ? 'wait' : 'run') : R.state, tg = TAG[st];
    drT.innerHTML = I('chev-u', 'xs') + `<span><span class="w">${R.only ? 'Step test' : R.test ? 'Test run' : 'Run'} </span><span class="num">#${R.id}</span></span><span class="rdr-st tag ${tg[0]}">${tg[1]}</span>`;
    const tokNow = sum(C.spans.filter(s => s.tok && s.s <= R.now), s => s.tok);
    drMeta.textContent = [R.only ? byId(R.only)?.t : R.L ? R.L.n + ', ' + R.L.co : 'Sample data', secs(R.now), tokNow ? `${(tokNow / 1000).toFixed(1)}k tokens, $${(tokNow * .0000045).toFixed(3)}` : ''].filter(Boolean).join(', ');
  }
  trRows.addEventListener('click', e => { const b = e.target.closest('.rdr-r'); if (!b) return; select(b.dataset.node, { open:true }); $$('.rdr-r', trRows).forEach(r => r.setAttribute('aria-pressed', String(r.dataset.node === b.dataset.node))); });
  // what each step took in and handed on, as JSON
  const jsonHTML = o => esc(JSON.stringify(o, null, 2)).replace(/(&quot;[^&]*?&quot;)(\s*:)?|\b(-?\d+(?:\.\d+)?|true|false|null)\b/g, (m, s, colon, n) => s ? (colon ? `<span class="k">${s}</span>${colon}` : `<span class="s">${s}</span>`) : `<span class="n">${n}</span>`);
  const dsEl = $('.rdr-ds', dr), ioEl = $('.rdr-io', dr);
  // a step's input: what its fields were mapped from, as they were in this run
  const inOf = (n, C) => { if (n.type === 'trigger') return C.L ? { lead:C.L.n, email:C.L.email, company:C.L.co } : { source:n.cfg.source };
    const o = {}; Object.entries(n.cfg.in || {}).forEach(([k, v]) => { const { n:src, k:f } = vref(v); o[k] = src && C.out[src.ref] ? C.out[src.ref][f] ?? null : null; });
    if (n.type === 'branch'){ const { n:src, k:f } = vref(n.cfg.rule.v); o[f || 'value'] = src && C.out[src.ref] ? C.out[src.ref][f] : null; o.rule = `${f} ${n.cfg.rule.op} ${n.cfg.rule.n}`; }
    return o; };
  function paintData(){
    if (!R){ dsEl.innerHTML = ''; ioEl.innerHTML = '<p class="rdr-de">Run a test to see the data each step takes in and hands on.</p>'; return; }
    const t = R.now, ready = W.nodes.filter(n => R.C.out[n.ref] && R.C.spans.some(s => s.node === n.id && s.e != null && s.e <= t + 1e-6 && s.st !== 'bad'));
    if (!ready.length){ dsEl.innerHTML = ''; ioEl.innerHTML = '<p class="rdr-de">No step has finished yet.</p>'; return; }
    if (!ready.some(n => n.ref === dataTab)) dataTab = ready[ready.length - 1].ref;
    dsEl.innerHTML = ready.map(n => `<button data-ref="${n.ref}" aria-pressed="${n.ref === dataTab}"><span class="rdr-ti" data-k="${n.type}" aria-hidden="true">${I(n.ic, 'xs')}</span><span>${esc(n.t)}</span></button>`).join('');
    const n = byRef(dataTab);
    ioEl.innerHTML = `<h4>Input</h4><pre class="rdr-json" tabindex="0" aria-label="${esc(n.t)} input">${jsonHTML(inOf(n, R.C))}</pre><h4>Output</h4><pre class="rdr-json" tabindex="0" aria-label="${esc(n.t)} output">${jsonHTML(R.C.out[dataTab])}</pre>`;
  }
  dsEl.addEventListener('click', e => { const b = e.target.closest('button'); if (!b) return; dataTab = b.dataset.ref; paintData(); });
  // in a test run the person approving is you: Run drawer's question, under the step that waits, with the drafted reply
  function approvalCard(){
    const C = R.C, n = byId(C.pause.node), draft = upstream(n.id).filter(u => u.type === 'ai').pop(), o = draft && C.out[draft.ref];
    const el = rowEls.get(C.pause.span.id); if (!el) return;
    $$('.rdr-ask', trRows).forEach(x => x.remove());
    el.insertAdjacentHTML('afterend', `<div class="rdr-ask wf-appr" role="group" aria-label="Approve the reply"><span class="rdr-ti" data-k="approval" aria-hidden="true">${I('user', 'xs')}</span><span class="tx"><b>${o ? 'Approve the draft' : esc(n.t) + ': your call'}</b><span class="wf-who">Live runs ask ${n.cfg.who.map(w => P[w][0]).join(' or ')} in ${VIA[n.cfg.via] || n.cfg.via}</span>${o ? `<span class="wf-draft">${o.subject ? `<b>${esc(o.subject)}</b> ` : ''}${esc(o.body || o.text || '')}</span>` : ''}</span>`
      + `<span class="acts"><button class="pill primary sm" data-a="yes">${I('check', 'xs')}<span>Approve</span></button><button class="pill line sm" data-a="edit">${I('edit', 'xs')}<span>Edit the draft step</span></button><button class="pill ghost sm" data-a="no">${I('x', 'xs')}<span>Reject</span></button></span></div>`);
    // it opens its room under the step that waits, and fades in (Run drawer's own entrance)
    const card = el.nextElementSibling; if (!REDUCE){ card.classList.add('in'); grow(card); }
    if (drTab === 'steps' && card.offsetTop + card.offsetHeight > drB.scrollTop + drB.clientHeight) drB.scrollTop = card.offsetTop + card.offsetHeight - drB.clientHeight + 8;
    $('[data-a="yes"]', card).onclick = () => resume(true);
    $('[data-a="no"]', card).onclick = () => resume(false);
    $('[data-a="edit"]', card).onclick = () => { if (draft) select(draft.id, { open:true }); };
    say(`${n.t} is waiting for you to approve`);
    paintTop();
  }
  function resume(ok){
    if (!R || R.state !== 'wait') return;
    const C = R.C, shown = C.pause.at + 1.2;
    R.t0 = performance.now() - shown * 1000; R.state = 'run'; $$('.rdr-ask', trRows).forEach(x => { x.classList.remove('in'); shrink(x); });
    decide(C, shown, ok); R.now = shown; tick();
  }
  // wfx-fix: after a retry or a failure, the agent offers a change to the step that failed, applied to the draft in one go
  function fixCard(){
    if (!R) return; const C = R.C;
    const bad = C.spans.filter(s => s.st === 'bad').map(s => byId(s.node)).find(n => n && ['tool', 'app', 'output'].includes(n.type));
    if (!bad || !['tool', 'app', 'output'].includes(bad.type)){ clearNote(); return; }
    const c = bad.cfg, rows = [];
    if (C.o.fail && C.o.fail.err && /401/.test(C.o.fail.err)){
      setNote(`<div class="wfx-fix"><div class="wfx-fix-h"><span class="wfx-ic ai">${I('spark', 'xs')}</span><span class="tx"><b>The CRM connection has expired</b><span>Retrying won't help: ${esc(bad.t)} needs the account connected again.</span></span></div><div class="wfx-fix-a"><button class="pill primary sm" data-a="reconnect">Reconnect the CRM</button></div></div>`);
      $('[data-a="reconnect"]', drNote).onclick = e => reconnectApp(appById('crm'), e.currentTarget, () => clearNote()); return;
    }
    if (c.retries < 3) rows.push(['Retries', String(c.retries), '3', x => { x.cfg.retries = 3; }]);
    if (c.backoff !== 'doubling') rows.push(['Wait between tries', '2s each', 'Doubling', x => { x.cfg.backoff = 'doubling'; }]);
    if (bad.type === 'tool' && !c.cache) rows.push(['Cache', 'Off', '24 hours', x => { x.cfg.cache = true; }]);
    if (!rows.length){ clearNote(); return; }
    const failed = R.state === 'bad';
    setNote(`<div class="wfx-fix" role="group" aria-label="The agent's suggestion"><div class="wfx-fix-h"><span class="wfx-ic ai">${I('spark', 'xs')}</span><span class="tx"><b>${failed ? `${esc(bad.t)} ran out of retries` : `${esc(bad.t)} needed a retry`}</b><span>${esc(bad.cfg.conn)} limits how often it is called. ${failed ? 'With these changes the run waits it out.' : 'These keep live runs from stalling.'}</span></span></div>`
      + `<ul class="wfx-fix-l">${rows.map(r => `<li><span class="k">${r[0]}</span><span class="was">${esc(r[1])}</span>${I('right', 'xs')}<span class="now">${esc(r[2])}</span></li>`).join('')}</ul>`
      + `<div class="wfx-fix-a"><button class="pill primary sm" data-a="apply">Apply to the draft</button><button class="pill ghost sm" data-a="show">Show the step</button><span class="wf-sp"></span><button class="ib" data-a="dismiss" aria-label="Dismiss the suggestion" data-tip="Dismiss">${I('x', 'xs')}</button></div></div>`);
    $('[data-a="apply"]', drNote).onclick = () => { commit(`Made ${bad.t} retry with backoff`, () => rows.forEach(r => r[3](bad)), { key:bad.id + '.fix' });
      setNote(`<div class="wfx-note ok"><span class="wfx-ic">${I('check', 'xs')}</span><span class="tx"><b>Applied to the draft</b><span>${esc(bad.t)}: ${rows.map(r => r[0].toLowerCase() + ' ' + r[2].toLowerCase()).join(', ')}.</span></span><button class="pill ghost sm" data-a="undo">Undo</button></div>`);
      $('[data-a="undo"]', drNote).onclick = () => { undo(); fixCard(); };
      if (selId === bad.id) renderInspector(); toast('ai', 'The agent updated ' + bad.t, 'Test again to check it', { label:'Test run', run:() => startRun() }); };
    $('[data-a="show"]', drNote).onclick = () => select(bad.id, { open:true });
    $('[data-a="dismiss"]', drNote).onclick = () => clearNote();
  }
  function testStep(id){ const n = byId(id); if (R && R.live){ toast('info', 'A test is running', 'Wait for it to finish, or stop it'); return; } if (n.type === 'trigger'){ toast('info', `${n.t} gets its sample from the test data`, 'Pick another lead from Test run'); return; } startRun({ only:id }); }
  const runTest = () => { if (R && R.live){ toast('info', 'A test is already running', 'Stop it in the run panel to start again'); openDrawer(true); return; } startRun(); };
  $('.wf-test', app).onclick = runTest;

  /* ---------- the right panel: Step, Runs and Versions (Segmented control's tabs) ---------- */
  const panel = $('.wf-panel', app), ptabs = $$('.wf-seg [role="tab"]', app), knob = $('.wf-seg .sgc-k', app);
  const placeK = () => { const b = ptabs.find(t => t.getAttribute('aria-selected') === 'true'); if (!b || !b.offsetWidth) return; knob.style.left = b.offsetLeft + 'px'; knob.style.width = b.offsetWidth + 'px'; };
  new ResizeObserver(placeK).observe($('.wf-seg', app));
  // the panel slides in beside the canvas (its width eases, the canvas narrowing with it) or, under 1200px, over it; a new tab
  // fades in from the side it sits on
  const TABS = ['step', 'runs', 'versions'];
  function slideIn(tab, d){
    const v = $('#wf-v-' + tab, app); if (REDUCE || !v) return;
    v.style.setProperty('--wf-dx', d * 10 + 'px'); v.classList.remove('in'); void v.offsetWidth; v.classList.add('in');
  }
  function openPanel(tab, focus = false){
    const was = app.classList.contains('pn'), prev = panelTab;
    if (!was) settle();
    panelTab = tab; app.classList.add('pn'); panel.inert = false;
    if (!was || prev !== tab) slideIn(tab, was ? Math.sign(TABS.indexOf(tab) - TABS.indexOf(prev)) : 0);
    ptabs.forEach(t => { const on = t.dataset.v === tab; t.setAttribute('aria-selected', String(on)); t.tabIndex = on ? 0 : -1; if (on && focus) t.focus(); });
    TABS.forEach(v => $('#wf-v-' + v, app).hidden = v !== tab);
    $$('[data-panel]', app).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.panel === tab)));
    requestAnimationFrame(placeK);
    if (tab === 'step') renderInspector(); if (tab === 'runs') renderRuns(); if (tab === 'versions') renderVersions();
  }
  function closePanel(){ if (app.classList.contains('pn')) settle(); app.classList.remove('pn'); panel.inert = true; $$('[data-panel]', app).forEach(b => b.setAttribute('aria-pressed', 'false')); if (selId) select(null); }
  ptabs.forEach(t => t.onclick = () => openPanel(t.dataset.v));
  $('.wf-seg', app).addEventListener('keydown', e => { const i = ptabs.findIndex(t => t.getAttribute('aria-selected') === 'true'), d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return; e.preventDefault(); openPanel(ptabs[(i + d + 3) % 3].dataset.v, true); });
  $('.wf-pclose', app).onclick = closePanel;
  $$('[data-panel]', app).forEach(b => b.onclick = () => app.classList.contains('pn') && panelTab === b.dataset.panel ? closePanel() : openPanel(b.dataset.panel));
  // Runs: Action log's rows, newest first, with a filter
  let runF = 'all';
  const ctxOf = r => { if (!r.C){ const C = newCtx(r.lead, r.o || {}); if (r.o && r.o.approve === 'wait') C.o.approve = 'wait'; advance(C, 0); if (C.end && C.end.failed) C.end.ok = false; r.C = C; } return r.C; };
  // the filter stays put (its knob slides) and only the list under it changes: runs that still match glide to their places,
  // ones that come in fade in, and ones filtered out fade where they were
  function renderRuns(){
    const box = $('#wf-v-runs', app), L = W.runs.filter(r => runF === 'all' || (runF === 'bad' ? r.out === 'bad' : r.test));
    const g = r => r.out === 'bad' ? `<span class="g bad">${I('x', 'xs')}</span>` : r.out === 'wait' ? `<span class="g wait">${I('clock', 'xs')}</span>` : `<span class="g ok">${I('check', 'xs')}</span>`;
    const items = L.map(r => `<li class="alg-it" data-key="${r.id}"><button class="alg-row wfx-run" data-run="${r.id}" aria-current="${R && R.id === r.id}"><span class="alg-ic">${g(r)}</span><span class="alg-tx"><b>#${r.id}${r.lead ? ' ' + esc(r.lead.n) : ''}</b><span class="d">${r.test ? 'Test, ' : ''}${esc(r.path)}</span></span><span class="alg-r"><span class="num">${secs(ctxOf(r).segEnd)}<span class="w">${esc(r.when)}</span></span></span></button></li>`).join('');
    const none = W.runs.length ? 'No runs match.' : 'No runs yet. Press Test run to try the workflow.';
    let bar = $('.wf-pbar', box);
    if (!bar){
      box.innerHTML = `<div class="wf-pbar"><div class="seg2 wf-runf" role="group" aria-label="Show runs"><button aria-pressed="${runF === 'all'}" data-v="all">All</button><button aria-pressed="${runF === 'bad'}" data-v="bad">Failed</button><button aria-pressed="${runF === 'test'}" data-v="test">Tests</button></div><span class="muted num wf-rtd"></span></div>`;
      bar = $('.wf-pbar', box); seg($('.wf-runf', box), v => { runF = v; renderRuns(); });
    }
    $('.wf-rtd', bar).textContent = `${F.today} today`;
    reflow(() => $$('.wf-runs > .alg-it, .wfx-empty', box), () => {
      let ol = $('.wf-runs', box), em = $('.wfx-empty', box);
      if (L.length){ if (em) em.remove(); if (!ol){ bar.insertAdjacentHTML('afterend', '<ol class="alg-list wf-runs" aria-label="Runs"></ol>'); ol = $('.wf-runs', box); } ol.innerHTML = items; }
      else { if (ol) ol.remove(); if (!em){ bar.insertAdjacentHTML('afterend', '<p class="wfx-empty" data-key="empty"></p>'); em = $('.wfx-empty', box); } em.textContent = none; }
    }, { root:box });
  }
  $('#wf-v-runs', app).addEventListener('click', e => { const b = e.target.closest('.wfx-run'); if (!b) return; const r = W.runs.find(x => x.id === +b.dataset.run); if (r) showRun(r); });
  // wfx-versions: the draft on top with what changed, then every published version with its note
  function renderVersions(){
    const box = $('#wf-v-versions', app), liveV = W.versions[0];
    const draft = W.changes.length || !liveV ? `<li class="wfx-ver draft"><span class="wfx-ver-m" aria-hidden="true"></span><div class="wfx-ver-b"><div class="wfx-ver-h"><b>Draft</b><span class="tag">${W.changes.length} ${W.changes.length === 1 ? 'change' : 'changes'}</span><span class="wf-sp"></span><span class="muted">Now</span></div>`
      + (W.changes.length ? `<ul class="wfx-ver-c">${W.changes.map(c => `<li>${esc(c.t)}</li>`).join('')}</ul>` : `<p class="muted">Not published yet.</p>`)
      + `<div class="wfx-ver-a"><button class="pill primary sm" data-a="publish">Publish${liveV ? ' v' + (liveV.v + 1) : ''}</button>${liveV && W.changes.length ? '<button class="pill ghost sm" data-a="discard">Discard changes</button>' : ''}</div></div></li>` : '';
    box.innerHTML = `<ol class="wfx-vers" aria-label="Versions">${draft}${W.versions.map((v, i) => `<li class="wfx-ver${i === 0 ? ' live' : ''}"><span class="wfx-ver-m" aria-hidden="true"></span><div class="wfx-ver-b"><div class="wfx-ver-h"><b>v${v.v}</b>${i === 0 ? `<span class="tag ok">${F.st === 'paused' ? 'Paused' : 'Live'}</span>` : ''}<span class="wf-sp"></span><span class="muted">${esc(v.when)}</span><button class="ib" data-pop="#wf-p-ver" data-pop-align="end" aria-haspopup="menu" data-v="${v.v}" aria-label="Actions for v${v.v}" data-tip="More">${I('more', 'xs')}</button></div>`
      + `<p class="wfx-ver-n">${esc(v.note)}</p><span class="wfx-ver-by">${av(v.by)}${P[v.by][0]}</span>`
      + `<button class="wfx-ver-t" aria-expanded="false">${I('chev-r', 'xs')}${v.ch.length} ${v.ch.length === 1 ? 'change' : 'changes'}</button><div class="fold shut"><div><ul class="wfx-ver-c">${v.ch.map(c => `<li>${esc(c)}</li>`).join('')}</ul></div></div></div></li>`).join('')}</ol>`;
  }
  $('#wf-v-versions', app).addEventListener('click', e => {
    const b = e.target.closest('button'); if (!b) return;
    if (b.matches('.wfx-ver-t')){ const f = b.nextElementSibling, open = f.classList.toggle('shut') === false; b.setAttribute('aria-expanded', String(open)); return; }
    if (b.dataset.a === 'publish') return openPublish();
    if (b.dataset.a === 'discard') return discard();
    if (b.dataset.v){ const v = +b.dataset.v, p = $('#wf-p-ver', app), live = W.versions[0].v === v;
      p.innerHTML = `<div class="ph" role="none">v${v}</div>` + mi('data-a="restore"', `${I('undo', 's')}<span>${live ? 'Reset the draft to v' + v : 'Restore as the draft'}</span>`, 'menuitem') + mi('data-a="link"', `${I('link', 's')}<span>Copy a link</span>`, 'menuitem');
      $('[data-a="restore"]', p).onclick = () => restoreV(v); $('[data-a="link"]', p).onclick = () => { (navigator.clipboard ? navigator.clipboard.writeText(location.href + '#v' + v) : Promise.reject()).catch(() => {}); toast('ok', 'Link copied', `It opens v${v} of ${F.name}`); }; }
  });
  // each version keeps the graph it was published with
  const graphOf = v => JSON.parse((W.versions.find(x => x.v === v) || {}).g || W.live);
  function restoreV(v){
    const live = W.versions[0].v === v;
    commit('', () => { const g = graphOf(v); W.nodes = g.nodes.map(ensure); W.edges = g.edges; W.pos = {}; W.changes = live ? [] : [{ k:'restore', t:`Restored v${v} as the draft` }]; }, { change:false });
    fit(true); toast('info', live ? `The draft is v${v} again` : `Restored v${v} as the draft`, live ? 'Your changes are gone' : `v${W.versions[0].v} stays live until you publish`, { label:'Undo', run:undo });
  }
  function discard(){ restoreV(W.versions[0].v); }

  /* ---------- overlays (Ask the agent, Publish): they fade and lift in like the core's popovers, and out the same way ---------- */
  const isOpen = el => !el.hidden && !el.classList.contains('out');
  function showOver(el){ clearTimeout(el._t); el.classList.remove('out'); el.inert = false; el.hidden = false; }
  function hideOver(el){
    if (REDUCE){ el.hidden = true; return; }
    el.classList.add('out'); el.inert = true; clearTimeout(el._t);
    el._t = setTimeout(() => { el.hidden = true; el.classList.remove('out'); el.inert = false; }, MT('--dm-t-fast'));
  }

  /* ---------- the top bar: name, state, Test with, Publish and the workflow's menu ---------- */
  function paintTop(){
    const ht = $('.wf-h1t', app); if (ht) ht.textContent = F.name;
    const n = W.changes.length, live = W.versions[0];
    $('.wf-state', app).innerHTML = !live ? `<span class="tag">Draft</span><span class="muted">Not published yet</span>` : F.st === 'paused' ? `<span class="tag">Paused</span><span class="muted">v${live.v}</span>`
      : n ? `<span class="tag">Draft</span><span class="muted">${n} ${n === 1 ? 'change' : 'changes'} to v${live.v}</span>` : `<span class="tag ok"><span class="dot"></span>Live</span><span class="muted">v${live.v}</span>`;
    const pub = $('.wf-pub', app); pub.disabled = !!live && !n; pub.setAttribute('aria-label', pub.disabled ? 'Nothing to publish' : `Publish ${live ? 'v' + (live.v + 1) : 'v1'}`);
    // the test chip on the canvas: who the trigger pretends to be
    const lb = $('.wf-lead', app), L = W.lead;
    lb.innerHTML = L ? `${avOf(L.ini, L.hue)}<span>Testing with <b>${esc(L.n)}</b>, ${esc(L.co)}</span>${I('chev-d', 'xs')}` : `<span class="wfx-ic">${I('file-text', 'xs')}</span><span>Testing with <b>sample data</b></span>${I('chev-d', 'xs')}`;
    lb.setAttribute('aria-label', `Test data: ${L ? L.n + ', ' + L.co : 'sample data'}. Change it`);
    const tb = $('.wf-test', app); $('span', tb).textContent = R && R.live ? (R.state === 'wait' ? 'Waiting for you' : 'Running') : 'Test run';
    $('.i use', tb).setAttribute('href', R && R.live ? (R.state === 'wait' ? '#i-clock' : '#i-refresh') : '#i-play');
    tb.classList.toggle('busy', !!(R && R.live && R.state !== 'wait'));
    paintHead(); paintFlows();
  }
  const paintState = () => { paintTop(); if (panelTab === 'versions' && app.classList.contains('pn')) renderVersions(); };
  // rename in place
  function rename(){
    const h = $('.wf-h1', app), was = F.name;
    h.innerHTML = `<input class="wf-h1i" value="${esc(was)}" maxlength="48" aria-label="Workflow name" spellcheck="false">`; const i = $('input', h); i.focus(); i.select();
    let fin = false;
    const done = ok => { if (fin || !i.isConnected) return; fin = true; const v = i.value.trim(); h.innerHTML = `<button class="wf-h1b" aria-label="Rename the workflow" data-tip="Rename"><span class="wf-h1t"></span></button>`; $('.wf-h1b', h).onclick = rename;
      if (ok && v && v !== was){ F.name = v; addChange(`Renamed the workflow to ${v}`, 'name'); saved(); toast('ok', 'Renamed', `${was} is now ${v}`); }
      paintState(); $('.wf-h1b', app).focus(); };
    i.addEventListener('keydown', e => { if (e.key === 'Enter'){ e.preventDefault(); done(true); } if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); done(false); } });
    i.addEventListener('blur', () => done(true));
  }
  $('.wf-h1b', app).onclick = rename;
  // Test with: the leads the form pretends to send
  app.addEventListener('click', e => {
    const lt = e.target.closest('[data-pop="#wf-p-lead"]'); if (!lt) return;
    // opened from the test chip, the menu is the chip's width, less the 1px each side its outline is drawn outside its box;
    // opened from Test run's arrow it keeps its own width
    const p = $('#wf-p-lead', app), fit = lt.classList.contains('wf-lead'); p.classList.toggle('fit', fit); p.style.width = fit ? (lt.getBoundingClientRect().width - 2) + 'px' : '';
    if (!W.lead){ p.innerHTML = `<div class="ph" role="none">Test with</div>` + mi('data-k="sample"', `<span class="wfx-ic">${I('file-text', 'xs')}</span><span>Sample data<span class="d">Made from each step's fields</span></span>`, 'menuitemradio', true) + mi('data-k="last"', `<span class="wfx-ic">${I('history', 'xs')}</span><span>The last real event<span class="d">${W.runs.length ? 'From run #' + W.runs[0].id : 'No runs yet'}</span></span>`, 'menuitemradio', false);
      $$('.mi', p).forEach(m => m.onclick = () => { if (m.dataset.k === 'last') toast('info', 'Using sample data', W.runs.length ? 'Live events stay private in the template' : 'This workflow has not run yet'); }); return; }
    p.innerHTML = `<div class="ph" role="none">Test with</div>` + LEADS.map(L => mi(`data-k="${L.k}"`, `${avOf(L.ini, L.hue)}<span>${esc(L.n)}, ${esc(L.co)}<span class="d">${L.last ? 'The last real submission, ' : ''}${L.seats} seats${L.fail ? ', its lookup gets rate limited' : ''}</span></span>`, 'menuitemradio', W.lead.k === L.k)).join('')
      + `<div class="sep" role="separator"></div>` + mi('data-k="run"', `${I('play', 's')}<span>Test run now</span>`, 'menuitem');
    $$('.mi', p).forEach(m => m.onclick = () => { if (m.dataset.k === 'run') return setTimeout(runTest, 130); const L = LEADS.find(x => x.k === m.dataset.k); if (L === W.lead) return; W.lead = L; paintTop(); toast('info', `Testing with ${L.n}`, `${L.co}, ${L.seats} seats`); });
  }, true);
  // the workflow's own menu
  $('.wf-more', app).addEventListener('click', () => {
    const p = $('#wf-p-more', app);
    p.innerHTML = `<div class="ph" role="none">${esc(F.name)}</div>` + mi('data-a="rename"', `${I('edit', 's')}<span>Rename</span>`, 'menuitem') + mi('data-a="dup"', `${I('copy', 's')}<span>Duplicate</span>`, 'menuitem') + mi('data-a="json"', `${I('down', 's')}<span>Download as JSON</span>`, 'menuitem') + mi('data-a="runs"', `${I('clock', 's')}<span>Runs</span>`, 'menuitem') + mi('data-a="versions"', `${I('history', 's')}<span>Versions</span>`, 'menuitem')
      + (W.versions.length ? mi('data-a="pause"', `${I(F.st === 'paused' ? 'play' : 'pause', 's')}<span>${F.st === 'paused' ? 'Resume the live version' : 'Pause the live version'}</span>`, 'menuitem') : '')
      + `<div class="sep" role="separator"></div><button class="mi bad" role="menuitem" tabindex="-1" data-close data-a="del">${I('trash', 's')}<span>Delete workflow</span></button>`;
    $$('.mi', p).forEach(m => m.onclick = () => {
      const a = m.dataset.a;
      if (a === 'rename') setTimeout(rename, 130);
      if (a === 'runs' || a === 'versions') setTimeout(() => openPanel(a), 130);
      if (a === 'dup'){ const c = { id:'copy' + (++nid), name:F.name + ' copy', st:'draft', ver:0, today:0, build:() => JSON.parse(snapOf(W)) }; FLOWS.push(c); paintFlows(); toast('ok', 'Duplicated', `${c.name} is in Drafts`, { label:'Open', run:() => openFlow(c.id) }); }
      if (a === 'json'){ try { const b = new Blob([JSON.stringify({ name:F.name, version:W.versions[0]?.v || 0, draft:!!W.changes.length, steps:W.nodes, wires:W.edges }, null, 2)], { type:'application/json' }), u = URL.createObjectURL(b), l = document.createElement('a'); l.href = u; l.download = F.name.toLowerCase().replace(/\W+/g, '-') + '.json'; app.appendChild(l); l.click(); l.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); } catch(err){} toast('ok', 'Downloaded', `${W.nodes.length} steps and ${W.edges.length} wires`); }
      if (a === 'pause'){ F.st = F.st === 'paused' ? 'live' : 'paused'; paintState(); toast('info', F.st === 'paused' ? 'Paused' : 'Live again', F.st === 'paused' ? 'New events wait until you resume' : 'New events run on v' + W.versions[0].v); }
      if (a === 'del'){ const i = FLOWS.indexOf(F), gone = F; FLOWS.splice(i, 1); openFlow(FLOWS[Math.max(0, i - 1)].id); toast('bad', `Deleted ${gone.name}`, 'Its runs and versions went with it', { label:'Undo', run:() => { FLOWS.splice(i, 0, gone); openFlow(gone.id); } }); }
    });
  });
  // Publish: the checks, and the note the agent drafts from the changes
  const pubD = $('.wf-pubd', app), pubF = $('form', pubD), pubBack = { el:null };
  function openPublish(){
    if (!W.changes.length && W.versions.length){ toast('info', 'Nothing to publish', `v${W.versions[0].v} is already live`); return; }
    pubBack.el = document.activeElement; showOver(pubD);
    const next = (W.versions[0]?.v || 0) + 1, tested = W.runs.find(r => r.test && r.C);
    const fresh = tested && tested.testOf === (W.seq || 0), unmapped = W.nodes.filter(n => n.type === 'branch' && !n.cfg.rule.v).length + W.nodes.filter(n => Object.values(n.cfg.in || {}).some(v => v && !byRef(v.split('.')[0]))).length;
    const ck = (ok, t, act = '') => `<li class="${ok ? 'ok' : 'warn'}"><span class="g">${I(ok ? 'check' : 'alert', 'xs')}</span><span>${t}</span>${act}</li>`;
    $('.wf-checks', pubD).innerHTML = ck(fresh && tested.out === 'ok', fresh ? (tested.out === 'ok' ? `Test run #${tested.id} passed${tested.C.retries ? ', with a retry' : ''}` : `Test run #${tested.id} failed`) : 'No test run since your last change', fresh && tested.out === 'ok' ? '' : '<button type="button" class="pill ghost sm" data-a="test">Test first</button>')
      + ck(!unmapped, unmapped ? `${unmapped} ${unmapped === 1 ? 'field points' : 'fields point'} at missing data` : 'Every field has its data')
      + ck(true, W.nodes.some(n => n.type === 'approval') ? 'A person approves before anything is sent' : 'Runs go out without a person checking');
    const cs = W.changes.map(c => c.t);
    $('textarea', pubF).value = !cs.length ? 'First version.' : cs.length <= 4 ? cs.join('. ') + '.' : cs.slice(0, 3).join('. ') + `, and ${cs.length - 3} smaller changes.`;
    $('#wf-pub-h', pubD).textContent = `Publish v${next}`;
    $('.fmx-go', pubF).textContent = `Publish v${next}`;
    $('.wf-pubms', pubD).textContent = W.versions[0] ? `v${W.versions[0].v} stays in Versions` : 'New events start running on it';
    pubF.querySelector('.fmx-f').classList.add('ai');
    const t = $('[data-a="test"]', pubD); if (t) t.onclick = () => { closePub(); startRun(); };
    setTimeout(() => $('textarea', pubF).focus(), 30);
  }
  const closePub = () => { if (!isOpen(pubD)) return; hideOver(pubD); if (pubBack.el && pubBack.el.isConnected) pubBack.el.focus({ preventScroll:true }); };
  $('textarea', pubF).addEventListener('input', () => pubF.querySelector('.fmx-f').classList.remove('ai'));
  $('.wf-pub', app).onclick = openPublish;
  $('.wf-pubx', pubD).onclick = closePub;
  pubD.addEventListener('pointerdown', e => { if (e.target === pubD) closePub(); });
  pubF.addEventListener('keydown', e => { if (e.key === 'Escape'){ e.preventDefault(); closePub(); } });
  pubF.addEventListener('submit', e => {
    e.preventDefault();
    const v = (W.versions[0]?.v || 0) + 1, note = $('textarea', pubF).value.trim() || 'No note.';
    W.live = snapOf(W); W.versions.unshift({ v, by:ME, when:'Just now', note, ch:W.changes.map(c => c.t), g:W.live }); W.changes = []; F.ver = v; if (F.st !== 'paused') F.st = 'live';
    closePub(); paintState(); if (panelTab === 'versions' && app.classList.contains('pn')) renderVersions();
    toast('ok', `v${v} is live`, 'New events run on it from now', { label:'Versions', run:() => openPanel('versions') });
  });

  /* ---------- the sidebar: the workflows, grouped by what needs you ---------- */
  function paintFlows(){
    const box = $('.wf-flows', app), G = [['Needs a look', f => f.st === 'failing'], ['Live', f => f.st === 'live' || f.st === 'paused'], ['Drafts', f => f.st === 'draft']];
    const dot = f => f.st === 'failing' ? 'var(--dm-bad)' : f.st === 'live' ? 'var(--dm-ok-mark)' : 'var(--dm-faint)';
    box.innerHTML = G.map(([t, fn]) => { const L = FLOWS.filter(fn); return L.length ? `<div class="ahx-lh"><span>${t}</span></div><div class="wf-nav">${L.map(f => `<button class="ahx-cv" data-wf="${f.id}"${f === F ? ' aria-current="true"' : ''}><span class="dot" style="color:${dot(f)}" aria-hidden="true"></span><span class="t">${esc(f.name)}</span>${f.W && f.W.changes.length && f.st !== 'draft' ? '<span class="wf-edited" data-tip="Unpublished changes" aria-label="Unpublished changes"></span>' : ''}<span class="n num" data-tip="${f.note || (f.today + ' runs today')}">${f.st === 'failing' ? f.today + ' failed' : f.today || ''}</span></button>`).join('')}</div>` : ''; }).join('');
    const used = 3140 + sum(FLOWS.filter(f => f.W), f => f.W.runs.filter(r => r.when === 'Just now').length);
    $('.wf-usen', app).textContent = `${used.toLocaleString('en-US')} of 5k`; $('.wf-usage .fl', app).style.width = (used / 50) + '%'; $('.wf-usage .prg-mb', app).setAttribute('aria-valuenow', used);
    LIM.used = used; paintLim();
  }
  /* ---------- the month's run limit: Set limit, opened from the sidebar's meter. The cap is dragged or typed (1,000 to the
     plan's 5,000, in steps of 100), and what happens at it is picked; the meter's dashed line and its words follow ---------- */
  const LIM = { cap:4500, used:3140, fc:4620, mode:'pause', MIN:1000, MAX:5000 }, lp = $('#wf-p-lim', app);
  const lk = $('.slx-k', lp), lbar = $('.slx-bar', lp), lin = $('.slx-in', lp), lwarn = $('.slx-warn', lp);
  const lpct = x => (x - LIM.MIN) / (LIM.MAX - LIM.MIN) * 100, n0 = x => x.toLocaleString('en-US');
  const LMODE = { pause:'pause', ask:'wait for you', keep:'keep going' };
  function paintLim(){
    const { cap, used, fc, mode } = LIM, over = fc > cap;
    lk.style.left = lpct(cap) + '%'; $('.slx-tt', lp).textContent = n0(cap); lk.setAttribute('aria-valuenow', cap); lk.setAttribute('aria-valuetext', `${n0(cap)} runs`);
    if (document.activeElement !== lin){ lin.value = cap; lin.style.width = Math.max(1, String(cap).length) + 'ch'; }
    $('.slx-used', lp).style.width = Math.min(100, used / cap * lpct(cap)) + '%'; $('.slx-fc', lp).style.width = Math.min(lpct(cap), fc / cap * lpct(cap)) + '%';
    $('.slx-sp', lp).textContent = n0(used);
    const h = over ? `<span class="w">${I('alert', 'xs')}Forecast passes your limit around Nov 27. Runs will ${LMODE[mode]}.</span>` : `<span class="o">${I('ok', 'xs')}<span>On track, about ${n0(cap - fc)} runs to spare.</span></span>`;
    if (lwarn.dataset.h !== String(over) + mode + (over ? '' : cap)){ const fresh = lwarn.dataset.h === undefined || lwarn.dataset.h.slice(0, 5) !== String(over).slice(0, 5); lwarn.dataset.h = String(over) + mode + (over ? '' : cap); lwarn.innerHTML = h; if (fresh) enter(lwarn.firstChild); }
    // the sidebar's meter: the dashed line where the limit is, and what it says
    const th = $('.wf-usage .th.stop', app), bt = $('.wf-usage', app), say = mode === 'keep' ? `Runs keep going past ${n0(cap)}` : mode === 'ask' ? `You're asked at ${n0(cap)} runs` : `Runs pause at ${n0(cap)}`;
    th.style.left = (cap / LIM.MAX * 100) + '%';
    bt.setAttribute('aria-label', `Runs this month: ${n0(used)} of 5,000. ${say}. Set the limit`);
  }
  const lat = e => { const b = lbar.getBoundingClientRect(); LIM.cap = Math.round((LIM.MIN + (LIM.MAX - LIM.MIN) * clamp((e.clientX - b.left) / b.width, 0, 1)) / 100) * 100; paintLim(); };
  lbar.onpointerdown = e => { lbar.setPointerCapture(e.pointerId); lk.classList.add('drag'); lat(e); lbar.onpointermove = lat; };
  lbar.onpointerup = lbar.onpointercancel = () => { lk.classList.remove('drag'); lbar.onpointermove = null; };
  let lsay = 0; const lflash = () => { lk.classList.add('say'); clearTimeout(lsay); lsay = setTimeout(() => lk.classList.remove('say'), 1200); };
  lk.onkeydown = e => { const d = e.key === 'ArrowRight' || e.key === 'ArrowUp' ? 100 : e.key === 'ArrowLeft' || e.key === 'ArrowDown' ? -100 : 0; if (!d) return; e.preventDefault(); LIM.cap = clamp(LIM.cap + d, LIM.MIN, LIM.MAX); paintLim(); lflash(); };
  seg($('.slx-sg', lp), m => { LIM.mode = m; paintLim(); });
  let lbefore = LIM.cap;
  $('.slx-v', lp).addEventListener('pointerdown', e => { if (document.activeElement !== lin){ e.preventDefault(); lin.focus({ preventScroll:true }); } });
  lin.onfocus = () => { lbefore = LIM.cap; lin.select(); };
  lin.oninput = () => { lin.value = lin.value.replace(/\D/g, '').slice(0, 4); lin.style.width = Math.max(1, lin.value.length) + 'ch'; const n = +lin.value; if (lin.value && n >= LIM.MIN && n <= LIM.MAX){ LIM.cap = n; paintLim(); lflash(); } };
  lin.onkeydown = e => { if (e.key === 'Enter'){ e.preventDefault(); lin.blur(); } else if (e.key === 'Escape'){ e.stopPropagation(); LIM.cap = lbefore; lin.blur(); paintLim(); } };
  lin.onblur = () => { const n = lin.value === '' ? lbefore : clamp(Math.round(parseInt(lin.value, 10) / 100) * 100, LIM.MIN, LIM.MAX); LIM.cap = n; paintLim(); };
  function openFlow(id){
    const f = FLOWS.find(x => x.id === id); if (!f) return;
    if (R && R.live){ cancelAnimationFrame(R.raf); }
    F = f; W = load(f); R = null; selId = null; resetRunView(); drNote.innerHTML = ''; stopB.hidden = true; $('.wf-test', app).classList.remove('on');
    if (app.classList.contains('pn')) openPanel(panelTab === 'step' ? 'step' : panelTab);
    renderAll(); W.runs.forEach(ctxOf); fit(); drawer(false); paintData();
    // the workflow picked fades in where the last one was: its steps and wires rise 4px, the title and its state rise 2px, and
    // an open panel's tab fades in from where it is. A quick second pick starts over from there
    if (!REDUCE){ const E = EASE(), d = MT('--dm-t-fast') + 60;
      [[nodesEl, 4], [svg, 4], [$('.wf-h1t', app), 2], [$('.wf-state', app), 2]].forEach(([x, y]) => { if (!x) return; if (x._sw) x._sw.cancel(); x._sw = x.animate([{ opacity:0, transform:`translateY(${y}px)` }, { opacity:1, transform:'none' }], { duration:d, easing:E }); });
      if (app.classList.contains('pn')) slideIn(panelTab, 0); }
  }
  app.addEventListener('click', e => {
    const b = e.target.closest('.wf-side button'); if (!b) return;
    if (b.dataset.wf){ if (b.dataset.wf !== F.id) openFlow(b.dataset.wf); drawer(false); }
    if (b.dataset.act === 'new'){ const f = { id:'new' + (++nid), name:'Untitled workflow', st:'draft', ver:0, today:0, build:() => ({ nodes:[N('trigger', 'When a webhook arrives', { ic:'bolt', cfg:{ source:'Webhook' } })], edges:[] }) }; FLOWS.push(f); openFlow(f.id); select(W.nodes[0].id, { open:true }); toast('ai', 'A new workflow', 'Add steps with + or describe them to the agent with ⌘K'); }
  });
  $('.wf-wsb', app).addEventListener('click', () => {
    const p = $('#wf-p-ws', app);
    p.innerHTML = `<div class="ph" role="none">Workspaces</div>` + [['F', 'Fernhill', 'Revenue operations'], ['L', 'Fernhill Labs', 'Experiments']].map((w, i) => mi(`data-i="${i}"`, `<span class="pfm-lg">${w[0]}</span><span>${w[1]}<span class="d">${w[2]}</span></span>`, 'menuitemradio', i === 0)).join('');
    $$('.mi', p).forEach(m => m.onclick = () => { if (m.dataset.i === '1') toast('info', 'Fernhill Labs is empty', 'The template shows the revenue workflows'); });
  });
  // the drawer of workflows, on tablets and phones
  const drawer = on => { app.classList.toggle('dr', on); $('.wf-side', app).inert = !on && matchMedia('(max-width:1023px)').matches; if (on) setTimeout(() => $('.wf-side .ahx-cv[aria-current="true"]', app)?.focus(), 80); };
  $('.wf-menu', app).onclick = () => drawer(true);
  $('.wf-scrim', app).onclick = () => drawer(false);
  matchMedia('(max-width:1023px)').addEventListener('change', () => drawer(false));

  /* ---------- wfx-apps: Connected apps, a popover from the sidebar. The apps with their marks (the core's BRAND marks, or a tinted
     tile for an app without one), their state and what uses them; a catalogue to connect another; the tools AI steps can call;
     and each app's details, to reconnect or disconnect it ---------- */
  const APPS = [
    { id:'gmail', n:'Gmail', mark:'gmail', who:'sales@fernhill.co and ana@fernhill.co', conns:['sales@fernhill.co', 'ana@fernhill.co'], st:'ok', can:'Sends email from two inboxes', since:'March 2' },
    { id:'slack', n:'Slack', mark:'slack', who:'Fernhill workspace', conns:['Fernhill on Slack'], st:'ok', can:'Posts to channels and asks people to approve', since:'March 2' },
    { id:'crm', n:'Fernhill CRM', ic:'db', tone:'pb', who:'ana@fernhill.co', conns:['Fernhill CRM'], st:'auth', short:'Sign-in expired', why:'The sign-in expired, so its steps fail with a 401', can:'Reads and updates contacts and deals', since:'March 9' },
    { id:'mkt', n:'Email marketing', ic:'users', tone:'pk', who:'Fernhill newsletter', conns:['Email marketing'], st:'ok', can:'Adds people to lists', since:'April 14' },
    { id:'dwh', n:'Data warehouse', ic:'table', tone:'pt', who:'analytics.fernhill.co', conns:['Data warehouse'], st:'bad', short:'Last sync timed out', why:'The last sync timed out', can:'Runs read-only queries', since:'May 3' },
    { id:'cdata', n:'Company data API', ic:'globe', tone:'pp', who:'API key ending 4f2a', conns:['Company data API'], st:'ok', can:'Looks up companies by domain, 60 calls a minute', since:'June 20' }
  ];
  const CATALOG = [
    { id:'drive', n:'Google Drive', mark:'drive', d:'Reads and files documents' },
    { id:'notion', n:'Notion', mark:'notion', d:'Reads pages and adds to databases' },
    { id:'linear', n:'Linear', mark:'linear', d:'Creates and updates issues' },
    { id:'github', n:'GitHub', mark:'github', d:'Opens issues and reads pull requests' },
    { id:'figma', n:'Figma', mark:'figma', d:'Reads files and leaves comments' },
    { id:'cal', n:'Calendar', ic:'cal', tone:'pp', d:'Finds times and books meetings' },
    { id:'billing', n:'Billing', ic:'dollar', tone:'pm', d:'Reads invoices and payments' },
    { id:'desk', n:'Support desk', ic:'comment', tone:'pl', d:'Reads and answers tickets' },
    { id:'hooks', n:'Webhooks', ic:'link', tone:'py', d:'Sends and receives any web request' }
  ];
  const ST = { ok:['ok', 'Connected'], auth:['warn', 'Needs sign-in'], bad:['bad', 'Error'] };
  const appById = id => APPS.find(a => a.id === id);
  const appsBtn = $('.wf-appsb', app), appsPop = $('#wf-p-apps', app);
  const lg = (a, big = '') => a.mark ? `<span class="wfx-lg${big}" aria-hidden="true">${BRAND[a.mark]}</span>` : `<span class="wfx-lg${big}" data-tone="${a.tone}" aria-hidden="true">${I(a.ic, big ? 's' : 'xs')}</span>`;
  // what uses an app: the workflows with a step on one of its accounts, worked out from their graphs
  const usersOf = a => FLOWS.filter(f => load(f).nodes.some(n => a.conns.includes(n.cfg.conn)));
  const nOf = (k, one, many) => `${k} ${k === 1 ? one : many}`;
  const usedTxt = a => { const k = usersOf(a).length; return k ? `Used by ${nOf(k, 'workflow', 'workflows')}` : 'No workflow uses it yet'; };
  const toolUse = t => { const k = FLOWS.filter(f => load(f).nodes.some(n => n.type === 'tool' && n.t === t)).length; return k ? `Used in ${nOf(k, 'workflow', 'workflows')}` : 'Ready for AI steps'; };
  const tTile = t => `<span class="wfx-lg" data-tone="${TKIND[t[5]][1]}" aria-hidden="true">${I(t[0], 'xs')}</span>`;
  function paintAppsN(){ $('.n', appsBtn).textContent = APPS.length; }
  let aView = 'list', aSel = null, aBack = null, aHi = 0, aHits = [], aBusy = 0;
  const head = (t, back) => `<div class="wfx-apps-h${back ? ' bk' : ''}">${back ? `<button class="ib wfx-back" data-back aria-label="Back to Connected apps" data-tip="Back" data-tip-k="Esc">${I('chev-l', 's')}</button>` : ''}${t}</div>`;
  function viewHTML(){
    if (aView === 'list'){
      const look = APPS.filter(a => a.st !== 'ok').length, tools = TOOLS.filter(t => WS_TOOLS.has(t[1]));
      return head(`<b id="wf-apps-t">Connected apps</b><span class="muted num">${APPS.length}</span>${look ? `<span class="wf-sp"></span><span class="muted wfx-apps-lk">${nOf(look, 'needs a look', 'need a look')}</span>` : ''}`)
        + `<div class="wfx-apps-sc"><ul class="wfx-apps-l" aria-labelledby="wf-apps-t">${APPS.map(a => `<li class="wfx-app${a.fresh ? ' new' : ''}" data-id="${a.id}" data-st="${a.st}"><button class="wfx-app-b" data-go="${a.id}" aria-label="${esc(a.n)}, ${ST[a.st][1]}. ${esc(a.st === 'ok' ? usedTxt(a) : a.why)}. Details">${lg(a)}<span class="t"><span class="nm">${esc(a.n)}</span><span class="d">${esc(a.st === 'ok' ? usedTxt(a) : a.short)}</span></span><span class="tag ${ST[a.st][0]}">${ST[a.st][1]}</span>${I('chev-r', 'xs')}</button></li>`).join('')}</ul>`
        + `<div class="wfx-apps-sh" id="wf-apps-tt"><span>Tools</span><span class="num">${tools.length}</span></div><ul class="wfx-apps-l" aria-labelledby="wf-apps-tt">${tools.map(t => `<li class="wfx-tl${t.fresh ? ' new' : ''}">${tTile(t)}<span class="t"><span class="nm">${esc(t[1])}</span><span class="d">${esc(toolUse(t[1]))}</span></span><span class="tag">${TKIND[t[5]][0]}</span></li>`).join('')}</ul></div>`
        + `<div class="wfx-apps-f"><button class="pill line sm" data-v="add">${I('plus', 'xs')}<span>Add a connector</span></button><button class="pill ghost sm" data-v="tool">${I('plus', 'xs')}<span>Add a tool</span></button></div>`;
    }
    if (aView === 'add') return head('<b>Add a connector</b>', true)
      + `<div class="wfx-apps-q">${I('search', 'xs')}<input type="text" role="combobox" aria-expanded="true" aria-autocomplete="list" aria-controls="wf-apps-cat" placeholder="Search apps" aria-label="Search apps" autocomplete="off" spellcheck="false"></div>`
      + `<div class="wfx-apps-sc"><div class="wfx-apps-l" id="wf-apps-cat" role="listbox" aria-label="Apps you can connect"></div></div><p class="wfx-apps-ft muted"><span class="wfx-apps-cn"></span><span class="kh" aria-hidden="true"><span class="kbd">↑</span> <span class="kbd">↓</span> <span class="kbd">↵</span></span></p>`;
    if (aView === 'tool') return head('<b>Add a tool</b>', true)
      + `<p class="wfx-apps-p">Tools are what an AI step can call while it works. Give one to a step from its inspector.</p>`
      + `<div class="wfx-apps-sc"><ul class="wfx-apps-l" aria-label="Tools">${TOOLS.map((t, i) => { const on = WS_TOOLS.has(t[1]);
        return `<li><button class="wfx-app-o${on ? ' done' : ''}" data-tool="${i}"${on ? ' aria-disabled="true"' : ''} aria-label="${esc(t[1])}, ${TKIND[t[5]][0]}. ${esc(t[3])}. ${on ? 'Added' : 'Add it'}">${tTile(t)}<span class="t"><span class="nm">${esc(t[1])}</span><span class="d">${esc(t[3])}</span></span><span class="wfx-app-r">${on ? `${I('check', 'xs')}Added` : `${I('plus', 'xs')}Add`}</span></button></li>`; }).join('')}</ul></div>`;
    const a = appById(aSel); if (!a) return '';
    const users = usersOf(a), [tone, label] = ST[a.st];
    return head(`<b>${esc(a.n)}</b>`, true)
      + `<div class="wfx-apps-sc"><div class="wfx-app-hd">${lg(a, ' big')}<span class="t"><b>${esc(a.n)}</b><span class="d">${esc(a.who)}</span></span><span class="tag ${tone}">${label}</span></div>`
      + (a.st !== 'ok' ? `<p class="wfx-app-why ${tone}">${I(a.st === 'bad' ? 'alert' : 'lock', 'xs')}<span>${esc(a.why)}. Reconnect it to fix the steps that use it.</span></p>` : '')
      + `<dl class="wfx-app-dl"><dt>Can</dt><dd>${esc(a.can)}</dd><dt>Connected</dt><dd>${esc(a.since)}, by ${esc(P[ME][0])}</dd><dt>Used by</dt><dd>${users.length ? `<ul class="wfx-app-wf">${users.map(f => `<li><button data-flow="${f.id}" aria-label="Open ${esc(f.name)}"><span class="dot" style="color:${f.st === 'failing' ? 'var(--dm-bad)' : f.st === 'draft' ? 'var(--dm-faint)' : 'var(--dm-ok-mark)'}" aria-hidden="true"></span><span class="t">${esc(f.name)}</span>${I('right', 'xs')}</button></li>`).join('')}</ul>` : '<span class="muted">No workflow yet</span>'}</dd></dl></div>`
      + `<div class="wfx-apps-f"><button class="pill ${a.st === 'ok' ? 'line' : 'primary'} sm" data-a="reconnect">${I('refresh', 'xs')}<span>Reconnect</span></button><button class="pill ghost sm wfx-dis" data-a="disconnect">${I('logout', 'xs')}<span>Disconnect</span></button></div>`;
  }
  // a new view slides in from the side it comes from, and the popover eases to its new height; it keeps its bottom edge where it
  // opened, over the button, so it grows upwards
  function paintApps(dir = 0){
    const open = appsPop.classList.contains('open') && !REDUCE, h0 = appsPop.offsetHeight;
    appsPop.innerHTML = `<div class="wfx-apps-v" data-view="${aView}">${viewHTML()}</div>`;
    if (aView === 'add') paintCat();
    APPS.forEach(a => { delete a.fresh; }); TOOLS.forEach(t => { delete t.fresh; });
    if (!open) return;
    const h1 = appsPop.offsetHeight;
    if (Math.abs(h1 - h0) > 1){ appsPop.classList.add('morph'); const done = () => appsPop.classList.remove('morph');
      appsPop.animate([{ height:h0 + 'px' }, { height:h1 + 'px' }], { duration:MT('--dm-t') * .8, easing:EASE() }).finished.then(done, done); }
    if (dir) appsPop.firstElementChild.animate([{ opacity:0, transform:`translateX(${dir * 14}px)` }, { opacity:1, transform:'none' }], { duration:MT('--dm-t') * .7, easing:EASE() });
  }
  // the focus moves into the new view when it was in the popover (the search field takes it either way); back in the list, it
  // lands on what opened the view
  const inPop = () => !!document.activeElement && appsPop.contains(document.activeElement);
  function appsGo(view, { id = null, dir = 1 } = {}){
    const ae = document.activeElement, had = inPop();
    if (aView === 'list') aBack = had && ae.dataset.go ? `[data-go="${ae.dataset.go}"]` : had && ae.dataset.v ? `[data-v="${ae.dataset.v}"]` : null;
    aView = view; if (id) aSel = id; paintApps(dir);
    const to = view === 'add' ? $('.wfx-apps-q input', appsPop) : view === 'tool' ? $('.wfx-app-o:not([aria-disabled="true"])', appsPop) || $('.wfx-back', appsPop)
      : view === 'detail' ? $('[data-a="reconnect"]', appsPop) : (aBack && $(aBack, appsPop)) || $('.wfx-app-b', appsPop);
    if (to && (had || view === 'add')) to.focus({ preventScroll:true });
  }
  // the catalogue: what isn't connected yet, filtered as you type, with the arrow keys and Enter
  function paintCat(){
    const inp = $('.wfx-apps-q input', appsPop), ls = $('#wf-apps-cat', appsPop), v = inp ? inp.value.trim().toLowerCase() : '';
    aHits = CATALOG.filter(c => !v || (c.n + ' ' + c.d).toLowerCase().includes(v));
    listTo(ls, aHits.length ? aHits.map((c, i) => `<div class="wfx-app-o" role="option" id="wf-ac-${i}" data-i="${i}" aria-selected="false">${lg(c)}<span class="t"><span class="nm">${esc(c.n)}</span><span class="d">${esc(c.d)}</span></span><span class="wfx-app-r">Connect</span></div>`).join('')
      : `<p class="wfx-apps-e">No app called “${esc(inp.value.trim())}” yet</p>`, '.wfx-app-o, .wfx-apps-e', x => x.matches('.wfx-apps-e') ? 'none' : $('.nm', x).textContent, v, appsPop);
    $('.wfx-apps-cn', appsPop).textContent = nOf(aHits.length, 'app', 'apps');
    hiCat(0);
  }
  function hiCat(i){
    const os = $$('.wfx-app-o:not([data-ghost])', $('#wf-apps-cat', appsPop)), inp = $('.wfx-apps-q input', appsPop);
    if (!os.length){ inp.removeAttribute('aria-activedescendant'); return; }
    aHi = (i + os.length) % os.length; os.forEach((o, j) => { o.classList.toggle('on', j === aHi); o.setAttribute('aria-selected', String(j === aHi)); });
    inp.setAttribute('aria-activedescendant', os[aHi].id); os[aHi].scrollIntoView({ block:'nearest' });
  }
  // a pick connects: a spinner, then a tick, then the app joins the list
  function connect(i){
    const c = aHits[i], el = $(`#wf-ac-${i}`, appsPop); if (!c || !el || aBusy) return;
    aBusy++; el.classList.add('busy'); el.setAttribute('aria-disabled', 'true'); const r = $('.wfx-app-r', el);
    r.innerHTML = '<span class="spin" aria-hidden="true"></span>Connecting'; say(`Connecting ${c.n}`);
    setTimeout(() => { r.innerHTML = `<span class="wfx-tick">${I('check', 'xs')}</span>Connected`; el.classList.add('done'); }, REDUCE ? 0 : 900);
    setTimeout(() => {
      aBusy--; CATALOG.splice(CATALOG.indexOf(c), 1);
      APPS.push({ ...c, who:'ana@fernhill.co', conns:[c.n], st:'ok', can:c.d, since:'Today', fresh:true }); paintAppsN();
      if (appsPop.classList.contains('open') && aView === 'add'){ const had = inPop(); aView = 'list'; paintApps(-1); const row = $(`.wfx-app[data-id="${c.id}"]`, appsPop); if (row){ row.scrollIntoView({ block:'nearest' }); if (had) $('.wfx-app-b', row).focus({ preventScroll:true }); } }
      toast('ok', `${c.n} connected`, `${nOf(APPS.length, 'app', 'apps')} connected`); say(`${c.n} connected`);
    }, REDUCE ? 0 : 1500);
  }
  function addTool(i, el){
    const t = TOOLS[i]; if (!t || WS_TOOLS.has(t[1]) || aBusy) return;
    aBusy++; el.setAttribute('aria-disabled', 'true'); const r = $('.wfx-app-r', el);
    r.innerHTML = '<span class="spin" aria-hidden="true"></span>Adding';
    setTimeout(() => { aBusy--; WS_TOOLS.add(t[1]); t.fresh = true; el.classList.add('done'); r.innerHTML = `<span class="wfx-tick">${I('check', 'xs')}</span>Added`; el.setAttribute('aria-label', `${t[1]}, added`);
      toast('ok', `${t[1]} added`, 'Give it to an AI step from its inspector'); say(`${t[1]} added`);
      const nx = $('.wfx-app-o:not([aria-disabled="true"])', appsPop); if (document.activeElement === el) (nx || $('.wfx-back', appsPop)).focus({ preventScroll:true }); }, REDUCE ? 0 : 800);
  }
  // reconnecting plays the same states on its button; the CRM's expired sign-in is what fails the Renewal reminders runs
  function reconnectApp(a, btn, then){
    if (!a || aBusy) return; aBusy++;
    const lab = btn && btn.innerHTML; if (btn){ btn.setAttribute('aria-disabled', 'true'); btn.classList.add('busy'); btn.innerHTML = '<span class="spin" aria-hidden="true"></span><span>Connecting</span>'; }
    setTimeout(() => { if (btn) btn.innerHTML = `${I('check', 'xs')}<span>Connected</span>`; }, REDUCE ? 0 : 900);
    setTimeout(() => {
      aBusy--; const was = a.st; a.st = 'ok'; delete a.why; delete a.short;
      if (a.id === 'crm'){ crmExpired = false; FLOWS.forEach(f => { if (f.W && f.W.testFail && /^401/.test(f.W.testFail.err)) f.W.testFail = null; }); }
      if (btn && btn.isConnected && !appsPop.contains(btn)){ btn.removeAttribute('aria-disabled'); btn.classList.remove('busy'); btn.innerHTML = lab; }
      if (appsPop.classList.contains('open') && aView === 'detail' && aSel === a.id){ const had = inPop(); paintApps(0); const b = $('[data-a="reconnect"]', appsPop); if (b && had) b.focus({ preventScroll:true }); }
      else if (appsPop.classList.contains('open') && aView === 'list') paintApps(0);
      toast('ok', `${a.n} ${was === 'ok' ? 'reconnected' : 'is connected again'}`, a.id === 'crm' ? 'Its steps can sign in again. Test to check' : usedTxt(a)); say(`${a.n} connected`);
      if (then) then();
    }, REDUCE ? 0 : 1400);
  }
  function disconnect(a){
    const i = APPS.indexOf(a), users = usersOf(a).length; if (i < 0) return;
    APPS.splice(i, 1); const back = { id:a.id, n:a.n, mark:a.mark, ic:a.ic, tone:a.tone, d:a.can }; CATALOG.unshift(back); paintAppsN();
    const had = inPop(); aView = 'list'; aBack = null; paintApps(-1); const b = $('.wfx-app-b', appsPop) || $('[data-v="add"]', appsPop); if (b && had) b.focus({ preventScroll:true });
    say(`${a.n} disconnected`);
    toast('info', `Disconnected ${a.n}`, users ? `${nOf(users, 'workflow', 'workflows')} used it` : 'No workflow used it', { label:'Undo', run:() => {
      if (APPS.includes(a)) return; const j = CATALOG.indexOf(back); if (j >= 0) CATALOG.splice(j, 1);
      a.fresh = true; APPS.splice(Math.min(i, APPS.length), 0, a); paintAppsN();
      if (appsPop.classList.contains('open') && aView === 'list') paintApps(0); else if (appsPop.classList.contains('open') && aView === 'add') paintCat();
      say(`${a.n} connected again`); } });
  }
  // the popover opens from Connected apps (the core places it; it is drawn first, so it opens at its height)
  app.addEventListener('click', e => {
    if (!e.target.closest('.wf-appsb')) return;
    if (appsPop.classList.contains('open')) return;
    appsPop.style.bottom = ''; aView = 'list'; aBack = null; paintApps();
    requestAnimationFrame(() => {
      if (!appsPop.classList.contains('open')) return;
      const top = parseFloat(appsPop.style.top) || 0; appsPop.style.bottom = (app.clientHeight - top - appsPop.offsetHeight) + 'px'; appsPop.style.top = 'auto';
      // opened with Enter or Space, the focus goes to the first app, once the popover can take it
      const first = (k = 0) => { const f = $('.wfx-app-b', appsPop); if (!f || !appsPop.classList.contains('open')) return; if (getComputedStyle(f).visibility !== 'visible' && k < 30) return requestAnimationFrame(() => first(k + 1)); f.focus({ preventScroll:true }); };
      if (!e.detail) first();
    });
  }, true);
  // the keyboard: the arrows move through the popover's buttons (or the catalogue, from its search field), Escape steps back to
  // the list and, there, closes it (the core), the focus going back to Connected apps
  appsBtn.addEventListener('keydown', e => {
    if ((e.key !== 'ArrowDown' && e.key !== 'ArrowUp') || !appsPop.classList.contains('open')) return;
    e.preventDefault(); const it = $$('.wfx-apps-v button:not([aria-disabled="true"])', appsPop); const t = e.key === 'ArrowDown' ? it[0] : it[it.length - 1]; if (t) t.focus();
  });
  appsPop.addEventListener('keydown', e => {
    const k = e.key, inp = e.target.closest('.wfx-apps-q input');
    if (inp){ if (k === 'ArrowDown' || k === 'ArrowUp'){ e.preventDefault(); hiCat(aHi + (k === 'ArrowDown' ? 1 : -1)); } else if (k === 'Enter'){ e.preventDefault(); connect(aHi); } return; }
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(k)) return;
    const it = $$('.wfx-apps-v button:not([aria-disabled="true"])', appsPop); if (!it.length) return;
    const i = it.indexOf(document.activeElement); e.preventDefault();
    const j = k === 'Home' ? 0 : k === 'End' ? it.length - 1 : i < 0 ? 0 : (i + (k === 'ArrowDown' ? 1 : -1) + it.length) % it.length; it[j].focus();
  });
  addEventListener('keydown', e => {
    if (e.key !== 'Escape' || !appsPop.classList.contains('open') || aView === 'list') return;
    e.preventDefault(); e.stopPropagation(); const had = inPop(); appsGo('list', { dir:-1 }); if (!had){ const f = (aBack && $(aBack, appsPop)) || $('.wfx-app-b', appsPop); if (f) f.focus({ preventScroll:true }); }
  }, true);
  appsPop.addEventListener('input', e => { if (e.target.closest('.wfx-apps-q')) paintCat(); });
  appsPop.addEventListener('pointermove', e => { const o = e.target.closest('#wf-apps-cat .wfx-app-o'); if (o && +o.dataset.i !== aHi) hiCat(+o.dataset.i); });
  // clicks are handled here, so the core never reads a click on a view that was just redrawn as one outside the popover
  appsPop.addEventListener('click', e => {
    e.stopPropagation();
    const b = e.target.closest('button,[role="option"]'); if (!b || b.getAttribute('aria-disabled') === 'true') return;
    if (b.dataset.go) return appsGo('detail', { id:b.dataset.go });
    if (b.hasAttribute('data-back')) return appsGo('list', { dir:-1 });
    if (b.dataset.v === 'add') return appsGo('add');
    if (b.dataset.v === 'tool') return appsGo('tool');
    if (b.matches('#wf-apps-cat .wfx-app-o')) return connect(+b.dataset.i);
    if (b.dataset.tool) return addTool(+b.dataset.tool, b);
    if (b.dataset.flow){ closePops(); if (b.dataset.flow !== F.id) openFlow(b.dataset.flow); drawer(false); return; }
    const a = appById(aSel);
    if (b.dataset.a === 'reconnect') return reconnectApp(a, b);
    if (b.dataset.a === 'disconnect') return disconnect(a);
  });
  paintAppsN();

  /* ---------- Ask the agent: Command palette ---------- */
  const over = $('.wf-cmd', app), q = $('.cpl-q', over), list = $('.cpl-list', over), st = $('.cpl-st', over);
  list.id = 'wf-cpl'; q.setAttribute('role', 'combobox'); q.setAttribute('aria-expanded', 'true'); q.setAttribute('aria-controls', list.id); q.setAttribute('aria-autocomplete', 'list');
  let items = [], hi = 0, back = null;
  // the agent's own answers: it reads the graph
  function explain(){
    const t = flow().find(n => n.type === 'trigger'), br = flow().find(n => n.type === 'branch'), ap = flow().find(n => n.type === 'approval');
    toast('ai', `${F.name} in short`, `Starts at ${t ? t.t : 'its trigger'}, runs ${flow().length} steps${br && br.cfg.rule.v ? `, splits on ${br.cfg.rule.v.split('.')[1]} ${br.cfg.rule.op} ${br.cfg.rule.n}` : ''}${ap ? `, and waits for ${ap.cfg.who.map(first).join(' or ')} before sending` : ''}.`);
  }
  function check(){
    const risky = W.nodes.filter(n => ['tool', 'app', 'output'].includes(n.type) && !n.off && (n.cfg.retries || 0) < 2);
    const loose = W.nodes.filter(n => Object.values(n.cfg.in || {}).some(v => !v || !byRef(v.split('.')[0])));
    if (!risky.length && !loose.length) return toast('ok', 'The agent found nothing to fix', 'Every call has retries and every field has its data');
    toast('ai', `${risky.length + loose.length} ${risky.length + loose.length === 1 ? 'thing' : 'things'} to look at`, [risky.length ? `${risky.map(n => n.t).join(', ')} ${risky.length > 1 ? 'retry' : 'retries'} once at most` : '', loose.length ? `${loose.map(n => n.t).join(', ')} ${loose.length > 1 ? 'have' : 'has'} unmapped fields` : ''].filter(Boolean).join('. '), risky[0] ? { label:'Show', run:() => select(risky[0].id, { open:true }) } : null);
  }
  const ACTIONS = () => [
    ['Agent', 'spark', 'Explain this workflow', 'In two lines', explain, 'ask'], ['Agent', 'spark', 'Check for weak spots', 'Retries and unmapped fields', check, 'ask'],
    ['Workflow', 'play', 'Test run', W.lead ? 'With ' + W.lead.n : 'Sample data', runTest], ['Workflow', 'upload', 'Publish', W.changes.length ? W.changes.length + ' changes' : 'Up to date', openPublish],
    ['Workflow', 'fit', 'Fit to screen', '0', () => fit(true)], ['Workflow', 'clock', 'Show runs', W.runs.length + ' runs', () => openPanel('runs')], ['Workflow', 'history', 'Show versions', W.versions.length ? 'v' + W.versions[0].v + ' live' : 'Draft', () => openPanel('versions')]
  ];
  function paintCmd(){
    const v = q.value.trim(), lv = v.toLowerCase(), m = s => !lv || s.toLowerCase().includes(lv);
    const R2 = [], ask = v ? { g:'Ask the agent', ic:'spark', t:`Add a step: “${v}”`, h:'Built after ' + (selId && byId(selId) ? byId(selId).t : 'the last step'), run:() => agentBuild(v, selId ? { after:selId } : null), ask:true } : null;
    ACTIONS().filter(a => m(a[2] + ' ' + a[3])).forEach(a => R2.push({ g:a[0], ic:a[1], t:a[2], h:a[3], run:a[4], ask:a[5] === 'ask' }));
    W.nodes.filter(n => m(n.t + ' ' + TYPES[n.type].k)).slice(0, v ? 8 : 5).forEach(n => R2.push({ g:'Steps', ic:n.ic, t:n.t, h:TYPES[n.type].k, run:() => select(n.id, { open:true, centre:true, focus:true }) }));
    CAT.flatMap(c => c.items).filter(it => v && m(it.t)).slice(0, 3).forEach(it => R2.push({ g:'Add', ic:it.ic, t:it.t, h:it.d, run:() => addStep(it, selId ? { after:selId } : null) }));
    FLOWS.filter(f => f !== F && v && m(f.name)).forEach(f => R2.push({ g:'Workflows', ic:'branch', t:f.name, h:f.st === 'draft' ? 'Draft' : f.st === 'failing' ? 'Needs a look' : 'Live', run:() => openFlow(f.id) }));
    if (ask){ if (R2.length) R2.push(ask); else R2.unshift(ask); }
    let h = '<span class="cpl-hl"></span>', g = '';
    R2.forEach((x, i) => { if (x.g !== g){ g = x.g; h += `<div class="cpl-g" role="presentation">${g}</div>`; } h += `<button class="cpl-i${x.ask ? ' ask' : ''}" role="option" id="wf-cpl-${i}" tabindex="-1" data-i="${i}"><span class="ic">${I(x.ic, 'xs')}</span><span class="t">${esc(x.t)}</span>${x.h ? `<span class="h">${esc(x.h)}</span>` : ''}</button>`; });
    list.innerHTML = h; items = R2; hi = 0; moveHi(0);
    st.textContent = `${R2.length} ${R2.length === 1 ? 'result' : 'results'}`;
  }
  function moveHi(d){ const bs = $$('.cpl-i', list), hl = $('.cpl-hl', list); if (!bs.length){ q.removeAttribute('aria-activedescendant'); hl.style.opacity = 0; return; } hi = (hi + d + bs.length) % bs.length; bs.forEach((b, i) => { b.classList.toggle('hl', i === hi); b.setAttribute('aria-selected', String(i === hi)); }); const b = bs[hi]; hl.style.opacity = 1; hl.style.top = b.offsetTop + 'px'; q.setAttribute('aria-activedescendant', b.id); b.scrollIntoView({ block:'nearest' }); }
  const runItem = i => { const x = items[i]; closeCmd(false); if (x) x.run(); };
  function openCmd(){ if (isOpen(over)) return; closePops(); back = document.activeElement; showOver(over); q.value = ''; paintCmd(); drawer(false); q.focus(); }
  function closeCmd(restore = true){ if (!isOpen(over)) return; hideOver(over); if (restore && back && back.isConnected) back.focus({ preventScroll:true }); }
  q.addEventListener('input', paintCmd);
  q.addEventListener('keydown', e => { if (e.key === 'ArrowDown' || e.key === 'ArrowUp'){ e.preventDefault(); moveHi(e.key === 'ArrowDown' ? 1 : -1); } else if (e.key === 'Enter'){ e.preventDefault(); runItem(hi); } else if (e.key === 'Escape'){ e.preventDefault(); closeCmd(); } else if (e.key === 'Tab') e.preventDefault(); });
  list.addEventListener('click', e => { const b = e.target.closest('.cpl-i'); if (b) runItem(+b.dataset.i); });
  list.addEventListener('pointermove', e => { const b = e.target.closest('.cpl-i'); if (b && +b.dataset.i !== hi) moveHi(+b.dataset.i - hi); });
  over.addEventListener('pointerdown', e => { if (e.target === over) closeCmd(); });
  $('.wf-ask', app).onclick = openCmd;

  /* ---------- keys: ⌘K, ⌘Z, A, V, H, Escape ---------- */
  document.addEventListener('keydown', e => {
    const k = e.key.toLowerCase();
    if ((e.metaKey || e.ctrlKey) && k === 'k'){ e.preventDefault(); isOpen(over) ? closeCmd() : openCmd(); return; }
    const typing = e.target.closest && e.target.closest('input,textarea,[contenteditable="true"]');
    if ((e.metaKey || e.ctrlKey) && k === 'z' && !typing && !isOpen(over)){ e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
    if (e.key === 'Escape'){
      if ($('.pop.open', app)) return;
      if (isOpen(over)){ closeCmd(); return; }
      if (isOpen(pubD)){ closePub(); return; }
      if (app.classList.contains('dr')){ drawer(false); $('.wf-menu', app).focus(); return; }
      if (selId){ const id = selId; select(null); const b = $(`.wfx-node[data-id="${id}"]`, nodesEl); if (b) b.focus({ preventScroll:true }); return; }
      if (app.classList.contains('pn')){ closePanel(); return; }
      return;
    }
    if (typing || e.metaKey || e.ctrlKey || e.altKey || isOpen(over) || isOpen(pubD)) return;
    if (!app.contains(e.target) && e.target !== document.body) return;
    if (k === 'v') setTool('select'); else if (k === 'h') setTool('hand');
    else if (k === 'a' && !$('.pop.open')){ e.preventDefault(); $('.wf-add', app).click(); }
  }, true);

  /* ---------- everything follows the graph ---------- */
  function renderAll(){ renderCanvas(); if (app.classList.contains('pn')){ if (panelTab === 'step') renderInspector(); if (panelTab === 'versions') renderVersions(); if (panelTab === 'runs') renderRuns(); } paintTop(); paintUndo(); }
  renderAll(); W.runs.forEach(ctxOf); renderInspector(); paintData();
  $('.wf-side', app).inert = matchMedia('(max-width:1023px)').matches;
  const first0 = () => { fit(); $$('.wfx-node', nodesEl).forEach((b, i) => { if (!REDUCE) b.animate([{ opacity:0, filter:'blur(3px)' }, { opacity:1, filter:'none' }], { duration:520, delay:Math.min(i, 8) * 55, easing:'cubic-bezier(.16,1,.3,1)', fill:'backwards' }); }); };
  first0();
  // the view fits the workflow again when the canvas changes size, unless you moved it yourself
  new ResizeObserver(() => { const live = sizing(); if (!V.user && !drag && !selId) fit(live ? false : !!cv._w, live); else if (selId && !live) reveal(selId); cv._w = cv.clientWidth; }).observe(cv);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { placeK(); });
  // the page can be opened on a step or a run: #run=2084, #step=n5
  const hs = new URLSearchParams(location.hash.slice(1));
  if (hs.get('step') && byId(hs.get('step'))) select(hs.get('step'), { open:true });
  if (hs.get('run')){ const r = W.runs.find(x => x.id === +hs.get('run')); if (r) showRun(r); }
})();
