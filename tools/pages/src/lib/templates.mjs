// The templates at /templates/<name>: whole app pages made of the library's own components, inside one app shell
// (TemplatePage.astro) so the four read as one product. Each component is mounted from the registry exactly as
// `npx designme add` installs it (its HTML, CSS and JS on the shared core); what sits around the components (the shell, a
// page's header, the list of chats, a detail pane's header) is the template's own markup, in the components' tokens.
// The list and its copy: templates-list.json (tools/site/build.js reads it too, for the homepage's showcase and llms.txt).
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, COMPONENTS } from './data.mjs';
import { avatar, facepile, role } from './people.mjs';
const LIST = JSON.parse(fs.readFileSync(path.join(ROOT, 'tools/pages/src/lib/templates-list.json'), 'utf8'));

const I = (n, c = 's') => `<svg class="i ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const byReg = Object.fromEntries(COMPONENTS.map(c => [c.reg, c]));

/* ---- a component in a cell of the page's grid ----
   span: how many of the 12 columns it takes on a wide screen. box: a heading over it, for a component with no panel of its
   own. A component whose card is "bare" (drawn without its panel on the homepage) gets its panel back here */
function comp(reg, { span = 12, box = null, cls = '', keepBare = false } = {}){
  const c = byReg[reg];
  if (!c) throw new Error('templates: no component called ' + reg);
  let html = c.html.html.trim();
  if (!keepBare) html = html.replace(/^<div class="card((?: wide)?) bare"/, '<div class="card$1"');
  const inner = box ? `<section class="tp-box" aria-label="${box.title}"><header class="tp-bh"><h2>${box.title}</h2>${box.meta ? `<span class="m">${box.meta}</span>` : ''}${box.act || ''}</header>${html}</section>` : html;
  return `<div class="tp-cell c${span}${cls ? ' ' + cls : ''}" data-reg="${reg}">${inner}</div>`;
}
// a page's header: its title, a line under it, and what you can do on the right
const head = (title, sub, acts = '') => `<div class="tp-head"><div class="tp-ht"><h1 class="tp-h1" id="content" tabindex="-1">${title}</h1><p class="tp-sub">${sub}</p></div>${acts ? `<div class="tp-acts">${acts}</div>` : ''}</div>`;
const btn = (label, icon = '', kind = 'line') => `<button type="button" class="pill ${kind} sm">${icon ? I(icon, 'xs') : ''}${label}</button>`;

/* ---------- Agent ops: the dashboard ---------- */
const agentOps = () => `
${head('Agent ops', 'Pricing page redesign, sprint 14. 6 agents and 12 people on it this week.',
  facepile(['Maya Kim', 'Jon Ortiz', 'Ari Reyes', 'Dev Kumar', 'Iris Bell', 'Felix Gray', 'Zoe Park', 'Lena Novak'], { max:5 }) + btn('Export', 'down') + btn('New run', 'plus', 'primary'))}
<div class="tp-grid">
  ${comp('stat-cards')}
  ${comp('line-chart', { span:8 })}
  ${comp('health-score', { span:4 })}
  ${comp('agent-tree', { span:6 })}
  ${comp('run-queue', { span:6, box:{ title:'Run queue', meta:'Started by Maya Kim', act:avatar('Maya Kim', { size:'xs', label:true }) } })}
  ${comp('bar-chart', { span:4 })}
  ${comp('donut-chart', { span:4 })}
  ${comp('run-cost', { span:4 })}
  ${comp('agent-lanes', { span:12 })}
  ${comp('task-table', { span:12 })}
</div>`;

/* ---------- Chat: past chats, the conversation, and what it drew on ---------- */
const CHATS = [
  ['Pinned', [
    { t:'Pricing page review', p:'Two plans changed. I updated their prices', at:'10:42', who:['Maya Kim', 'Jon Ortiz'], on:true },
    { t:'Onboarding drop-off', p:'Most people leave at the workspace step', at:'9:15', who:['Lena Novak'], unread:true },
  ]],
  ['Today', [
    { t:'Launch email for Soft UI', p:'Drafted two subject lines to test', at:'8:02', who:['Iris Bell', 'Pia Alvarez'] },
    { t:'Token export to CSS', p:'Paused at the $5 cap. Raise it?', at:'7:40', who:['Dev Kumar'], unread:true },
  ]],
  ['Yesterday', [
    { t:'Competitor pricing pages', p:'Compared 3 pages, 5 gaps found', at:'Tue', who:['Ari Reyes'] },
    { t:'Checkout flow contrast', p:'Raised the secondary button to 4.5:1', at:'Tue', who:['Felix Gray', 'Omar Haddad'] },
    { t:'Renewal note for Northwind', p:'Usage is up 18% since the redesign', at:'Tue', who:['Kofi Mensah', 'Nina Cole'] },
  ]],
  ['Last week', [
    { t:'Design QA, 12 frames', p:'All frames pass the 8px grid', at:'Oct 28', who:['Zoe Park'] },
    { t:'Interview notes, round 2', p:'Five of eight paused at the team name', at:'Oct 27', who:['Lena Novak', 'Sam Lowe'] },
  ]],
];
const chat = () => `
<div class="tc">
  <aside class="tc-list" aria-label="Chats">
    <div class="tc-lh"><h2>Chats</h2><button type="button" class="ib" aria-label="New chat" data-tip="New chat">${I('edit')}</button></div>
    <label class="tp-field tc-find">${I('search')}<input type="search" placeholder="Search chats" aria-label="Search chats"></label>
    ${CHATS.map(([g, list]) => `<div class="tc-g"><h3>${g}</h3><ul>${list.map(x => `<li><button type="button" class="tc-i"${x.on ? ' aria-current="true"' : ''}>${facepile(x.who, { size:'xs', max:2 })}<span class="tc-tx"><span class="t">${x.t}</span><span class="p">${x.p}</span></span><span class="tc-at">${x.at}${x.unread ? '<i class="tc-dot" role="img" aria-label="Unread"></i>' : ''}</span></button></li>`).join('')}</ul></div>`).join('')}
  </aside>
  <section class="tc-main" aria-label="Pricing page review">
    <div class="tc-head"><div class="tc-ht"><h1 class="tp-h1 sm" id="content" tabindex="-1">Pricing page review</h1><span class="tag">Design agent</span></div><div class="tp-acts">${facepile(['Maya Kim', 'Jon Ortiz', 'Ari Reyes'], { size:'s' })}${btn('Share', 'link')}</div></div>
    <div class="tc-feed">
      <div class="tc-col">
        <div class="tc-day"><span>Today</span></div>
        ${comp('artifact-card', { cls:'tc-turn' })}
        ${comp('tool-call', { cls:'tc-turn' })}
        <div class="tc-day"><span>${avatar('Lena Novak', { size:'xs' })}Lena Novak joined the chat</span></div>
        ${comp('live-answer', { cls:'tc-turn' })}
      </div>
    </div>
    <div class="tc-bot"><div class="tc-col">${comp('composer')}<p class="tc-note">The agent can make mistakes. Check what it changes before you publish.</p></div></div>
  </section>
  <aside class="tc-side" aria-label="Sources and reasoning">
    ${comp('source-stack', { box:{ title:'Sources', meta:'8 used' } })}
    ${comp('reasoning-trail', { box:{ title:'Reasoning', meta:'Design agent' } })}
    <section class="tp-box tc-people" aria-label="In this chat"><header class="tp-bh"><h2>In this chat</h2><span class="m">4 people</span></header>
      <ul class="tp-ppl">${['Maya Kim', 'Jon Ortiz', 'Ari Reyes', 'Lena Novak'].map((n, i) => `<li>${avatar(n, { size:'m', status:i < 3 ? 'on' : 'away' })}<span class="tx"><span class="t">${n}</span><span class="p">${role(n)}</span></span></li>`).join('')}</ul>
    </section>
  </aside>
</div>`;

/* ---------- Inbox: the runs that need you, and one of them open ---------- */
const inbox = () => `
<div class="ti">
  <aside class="ti-list" aria-label="Runs">
    <div class="ti-lh"><h2>Runs</h2><div class="seg2 tp-seg" role="group" aria-label="Show"><button type="button" aria-pressed="true">All</button><button type="button" aria-pressed="false">Mine</button><button type="button" aria-pressed="false">Team</button></div></div>
    ${comp('agent-inbox')}
    ${comp('notifications')}
  </aside>
  <section class="ti-detail" aria-label="Redesign the pricing page">
    ${head('Redesign the pricing page', `Design agent, started by Maya Kim 12 minutes ago. Needs your approval before it edits Pricing.fig.`,
      facepile(['Maya Kim', 'Jon Ortiz', 'Sam Lowe']) + btn('Hand off', 'user') + btn('Stop', 'stop'))}
    <div class="ti-meta">
      <span class="tag b">${I('spark', 'xs')}Needs you</span><span class="tag">Pricing v4</span><span class="tag">6 frames</span><span class="tag">$0.47 so far</span>
      <span class="ti-who">${avatar('Maya Kim', { size:'xs' })}Maya Kim is watching</span>
    </div>
    <div class="tp-grid">
      ${comp('plan-review', { span:7, box:{ title:'Plan', meta:'5 steps' } })}
      ${comp('permission-gate', { span:5 })}
      ${comp('human-handoff', { span:12 })}
      ${comp('run-summary', { span:6 })}
      ${comp('comments', { span:6 })}
    </div>
  </section>
</div>`;

/* ---------- CRM: accounts, the funnel, activity, the day, and what the agent noticed ---------- */
const crm = () => `
${head('Accounts', '42 accounts, $186,400 in monthly revenue, 6 renewals due in November.',
  facepile(['Kofi Mensah', 'Nina Cole', 'Theo Reed', 'Leo Marsh', 'Sam Lowe', 'Ruby Fox'], { max:4 }) + btn('Import', 'upload') + btn('Add account', 'plus', 'primary'))}
<section class="tp-sum" aria-label="Agent summary">
  <span class="tp-sum-ic">${I('spark')}</span>
  <div class="tp-sum-tx"><h2>Since Monday</h2><p>Lumen Labs and Paper Plane used the product 40% less after their lead designers left, so I drafted check-in notes for ${avatar('Kofi Mensah', { size:'xs' })}Kofi. Trial to paid is up 8.1 points since the pricing page update, and Northwind added 12 seats.</p></div>
  <div class="tp-sum-acts">${btn('Review 2 drafts', '', 'primary')}${btn('Dismiss', '', 'ghost')}</div>
</section>
<div class="tp-grid">
  ${comp('account-table', { span:8 })}
  ${comp('agenda', { span:4, cls:'r2' })}
  ${comp('metric-insight', { span:4 })}
  ${comp('funnel-chart', { span:4 })}
  ${comp('activity-heatmap', { span:8 })}
  ${comp('ticket-list', { span:4 })}
</div>`;

const BODIES = { 'agent-ops':agentOps, chat, inbox, crm };
const ICONS = { 'agent-ops':'gauge', chat:'comment', inbox:'mail', crm:'users' };
const LAYOUT = { 'agent-ops':'page', chat:'full', inbox:'full', crm:'page' };
const SEO = {
  'agent-ops':['Agent ops dashboard template, HTML and React | Designme.dev', 'A free agent operations dashboard made of designme.dev components: run stats, an agent tree, the run queue, spend, charts and a health score.'],
  chat:['AI chat workspace template, HTML and React | Designme.dev', 'A free AI chat workspace made of designme.dev components: past chats, live answers with tool calls and artifacts, the composer, sources and reasoning.'],
  inbox:['Agent inbox template, HTML and React | Designme.dev', 'A free agent inbox made of designme.dev components: runs that need you, a plan to review, a permission gate and a hand-off to a person.'],
  crm:['AI CRM home template, HTML and React | Designme.dev', 'A free CRM home made of designme.dev components: an account table, a signup funnel, an activity heatmap, an agenda and an agent summary.'],
};

// every reg a body mounts, in order, once each
const usesOf = body => [...new Set([...body.matchAll(/data-reg="([\w-]+)"/g)].map(m => m[1]))];

export const TEMPLATES = LIST.map(t => {
  const body = BODIES[t.slug]();
  return { ...t, url:`/templates/${t.slug}`, icon:ICONS[t.slug], layout:LAYOUT[t.slug], body, uses:usesOf(body).map(r => byReg[r]),
    seoTitle:SEO[t.slug][0], seoDesc:SEO[t.slug][1] };
});

// the components whose demo is a whole app or a canvas that fills its card: their pages get the device switch
export const FULL_SCREEN = ['agent-harness', 'automation-canvas', 'canvas-toolbar', 'event-calendar', 'kanban-board', 'rich-text-editor'];
// the device frames' own styles and script (src/device), for the pages that show them
export const FRAME_CSS = fs.readFileSync(path.join(ROOT, 'tools/pages/src/device/frame.css'), 'utf8');
export const FRAME_JS = fs.readFileSync(path.join(ROOT, 'tools/pages/src/device/frame.js'), 'utf8');
