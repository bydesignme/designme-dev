/* Shared copy, icons and motion control for the Soft elevation desk. */
(function () {
  const REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const svg = (body, fill) => `<svg class="i" viewBox="0 0 16 16" ${fill ? 'fill="currentColor"' : 'fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"'}>${body}</svg>`;
  const IC = {
    up: svg('<path d="M8 12.5V3.5M4.5 7 8 3.5 11.5 7"/>'),
    check: svg('<path d="M3.5 8.2 6.4 11.2 12.5 4.8"/>'),
    x: svg('<path d="M4.5 4.5 11.5 11.5M11.5 4.5 4.5 11.5"/>'),
    upload: svg('<path d="M8 11V3.5M5 6.2 8 3.5 11 6.2M3.5 13h9"/>'),
    file: svg('<path d="M4.5 2.5h4.2L12 5.8v7.7H4.5zM8.7 2.6V6H12"/>'),
    search: svg('<circle cx="7.2" cy="7.2" r="3.2"/><path d="m9.6 9.6 3 3"/>'),
    palette: svg('<circle cx="8" cy="8" r="4.6"/><path d="M8 5.4h.1M10.4 7.2h.1M6.2 7.4h.1M9.2 10.2h.1"/>'),
    eye: svg('<path d="M1.8 8S4 4.8 8 4.8 14.2 8 14.2 8 12 11.2 8 11.2 1.8 8 1.8 8z"/><circle cx="8" cy="8" r="1.5"/>'),
    chev: svg('<path d="m4 6.2 4 4 4-4"/>'),
    alert: svg('<circle cx="8" cy="8" r="5.25"/><path d="M8 5v3.2M8 10.8v.1"/>'),
    more: svg('<circle cx="4" cy="8" r="1.05"/><circle cx="8" cy="8" r="1.05"/><circle cx="12" cy="8" r="1.05"/>', true),
    db: svg('<ellipse cx="8" cy="4.2" rx="4.3" ry="1.6"/><path d="M3.7 4.2v7.2c0 .9 1.9 1.6 4.3 1.6s4.3-.7 4.3-1.6V4.2M3.7 8c0 .9 1.9 1.6 4.3 1.6s4.3-.7 4.3-1.6"/>'),
    edit: svg('<path d="m9.4 3.4 3.2 3.2L5.8 13.4H2.6v-3.2z"/>'),
    play: svg('<path d="M6 4.2v7.6l5.6-3.8z"/>'),
    pause: svg('<path d="M5.8 4.2v7.6M10.2 4.2v7.6"/>'),
    minus: svg('<path d="M4 8h8"/>'),
    plus: svg('<path d="M8 4v8M4 8h8"/>'),
    clock: svg('<circle cx="8" cy="8" r="5.2"/><path d="M8 5v3.2l2 1.3"/>'),
    users: svg('<circle cx="6" cy="6" r="2"/><path d="M2.6 12.4c.5-2 1.8-2.9 3.4-2.9s2.9.9 3.4 2.9M10.5 5.6a1.8 1.8 0 1 1 .2 3.2M11.2 9.6c1 .3 1.8 1 2.1 2.4"/>'),
    undo: svg('<path d="M3.8 7.2h5.4a2.8 2.8 0 1 1 0 5.6H8M3.8 7.2 6.2 4.8M3.8 7.2 6.2 9.6"/>'),
    term: svg('<path d="m3.2 5.2 3.2 2.6-3.2 2.6M8.2 11.6h4.6"/>'),
    pr: svg('<circle cx="4.2" cy="4" r="1.5"/><circle cx="4.2" cy="12" r="1.5"/><circle cx="11.8" cy="6.2" r="1.5"/><path d="M4.2 5.5v5M11.8 7.7v2.6a1.4 1.4 0 0 1-1.4 1.4H5.8"/>')
  };

  const hi = (raw) => raw
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/("(?:\\.|[^"\\])*")(?=\s*:)/g, '<span class="k">$1</span>')
    .replace(/:\s*("(?:\\.|[^"\\])*")/g, ': <span class="s">$1</span>')
    .replace(/:\s*(true|false)/g, ': <span class="k">$1</span>')
    .replace(/:\s*(-?\d+(?:\.\d+)?)/g, ': <span class="n">$1</span>');

  const COPY = {
    threads: [
      { t: 'Onboarding', col: 'var(--ok)', msgs: [
        ['u', 'Why is the workspace step losing people?'],
        ['a', 'It asks for a team name before anyone has made anything. Moving it after the first project, with the name filled from the email domain, should help.', [['Funnel data', 'Amplitude, last 30 days'], ['Session notes', 'Notion, 8 interviews']]]
      ]},
      { t: 'Tokens', col: 'var(--warn)', msgs: [
        ['u', 'Which colours are still hard-coded?'],
        ['a', 'Eleven, mostly greys in Button and Card. I can swap them for tokens in one pass.', [['tokens.ts', 'src/styles/tokens.ts']]]
      ]},
      { t: 'Launch email', col: 'var(--faint)', msgs: [
        ['u', 'Draft the launch email for Friday.'],
        ['a', 'Two subject lines are ready. The shorter one tested better with the team.', []]
      ]}
    ],
    follow: 'Can you make that change now?',
    followReply: "On it. I'll update this thread when it's done.",
    toolsIntro: 'Checking which plans changed this month before I update the pricing page.',
    toolsEnd: 'Two plans changed. I updated their prices and the yearly saving on the page.',
    tools: [
      { ic: 'db', n: 'billing', f: 'list_plan_changes', ms: '412 ms', inp: '{ "since": "2026-10-01" }', out: '[\n  { "plan": "Pro", "price": 24 },\n  { "plan": "Team", "price": 48 }\n]' },
      { ic: 'edit', n: 'files', f: 'edit', ms: '1.2 s', inp: '{ "path": "Pricing.tsx", "lines": 6 }', out: '{ "changed": 6, "saved": true }' }
    ],
    files: [['brief.pdf', 2.4e6, '12 pages'], ['Pricing.fig', 8.1e6, '6 frames'], ['signups.csv', 3.2e5, '1,204 rows']],
    lanes: [
      { n: 'Researcher', ic: 'search', t: 'pb', wait: '', acts: ['Reading competitor sites', 'Comparing 5 pricing pages', 'Writing the brief'], log: ['Read stripe.com/pricing', 'Read linear.app/pricing', 'Noted 3 patterns'] },
      { n: 'Designer', ic: 'palette', t: 'pl', wait: 'Waiting for the brief', acts: ['Laying out pricing cards', 'Setting type and spacing', 'Exporting frames'], log: ['Made 3 card variants', 'Applied spacing tokens', 'Exported 4 frames'] },
      { n: 'Reviewer', ic: 'eye', t: 'pm', wait: 'Waiting for the designer', acts: ['Checking contrast', 'Checking copy', 'Signing off'], log: ['Contrast passes AA', 'Fixed 2 lines of copy', 'Approved'] }
    ],
    treeTitle: 'Redesign the pricing page',
    tree: {
      id: 'root', n: 'Orchestrator', t: 'Plans the work and hands it out', cost: 0.08, s: 'run', kids: [
        { id: 'res', n: 'Research agent', t: 'Compare 3 competitor pricing pages', cost: 0.02, s: 'done', kids: [
          { id: 'res1', n: 'Read the 3 pricing pages', t: '3 pages, 9.4k words', cost: 0.06, s: 'done' },
          { id: 'res2', n: 'Summarise their plans', t: 'Notes added to Pricing v4', cost: 0.04, s: 'done' }
        ]},
        { id: 'des', n: 'Design agent', t: 'Rework the plan cards in Figma', cost: 0.12, s: 'run', kids: [
          { id: 'des1', n: 'Update the Pro card', t: 'Pricing v4, frame 2', cost: 0.06, s: 'done' },
          { id: 'des2', n: 'Update the Team card', t: 'Pricing v4, frame 3', cost: 0.04, s: 'done' },
          { id: 'des3', n: 'Apply library tokens', t: "color.accent.600 isn't in the library", cost: 0.03, s: 'fail' }
        ]},
        { id: 'cop', n: 'Copy agent', t: 'Rewrite the plan descriptions', cost: 0, s: 'queued' }
      ]
    },
    summary: {
      title: 'Pricing cards now use spacing tokens',
      time: 'Finished in 12m 40s',
      stats: [['6', 'files'], ['14', 'steps'], ['182k', 'tokens'], ['$0.84', 'cost']],
      files: [['PricingCard.tsx', '+24', '−18', 24, 18], ['tokens.css', '+9', '−2', 9, 2], ['Pricing.test.tsx', '+31', '−0', 31, 0]],
      need: 'The yearly badge overlaps the price on mobile',
      needDone: 'Badge moved above the price, nothing left to review'
    },
    actions: [
      { ic: 'file', t: 'Read <code>Pricing.tsx</code>', d: 'src/pages, 212 lines', ms: '0.4s', det: 'export function Pricing() {\n  return &lt;Grid cols={3} gap={20}&gt;…' },
      { ic: 'search', t: 'Searched Figma for <code>Button</code>', d: '6 matches in Components.fig', ms: '1.1s', det: 'Button / Primary\nButton / Secondary\nButton / Ghost  +3' },
      { ic: 'edit', t: 'Edited <code>PricingCard.tsx</code>', d: '<span style="color:var(--add)">+18</span> <span style="color:var(--del)">−7</span> lines', ms: '2.3s', det: '<span class="x">− gap: 20px;</span>\n<span class="a">+ gap: var(--space-6);</span>' },
      { ic: 'term', t: 'Ran <code>npm test</code>', d: '24 tests passed', ms: '3.2s', det: '✓ PricingCard renders 3 plans\n✓ toggles yearly billing\n24 passed, 0 failed' },
      { ic: 'pr', t: 'Opened a pull request', d: '#412, Use shared spacing tokens', ms: '0.6s', det: 'feat/pricing-spacing → main\n3 commits, ready for review' }
    ],
    queue: [
      { t: 'Research three competitors', subs: [['Read their pricing pages', '3/3'], ['Compared plans and limits', '5 gaps']] },
      { t: 'Draft the launch email', subs: [['Pulled the new features', 'Done'], ['Wrote two subject lines', 'Done'], ['Sent a test to the team', '', 'fail']] },
      { t: 'Update the help centre', subs: [['Billing questions', '4 articles'], ['Inviting your team', '2 articles']] }
    ],
    evalTitle: 'Pricing copy evals',
    evalSt: 'Copy agent · 8 cases · run 2h ago',
    evals: [
      { n: 'Names the Pro seat limit', tm: '0.6s' },
      { n: 'Prices match the billing table', tm: '0.9s', bad: true, exp: '$24 a seat, billed yearly', got: '$29 a seat, billed yearly', src: 'Billing table, Pro row' },
      { n: 'Mentions the yearly discount', tm: '0.5s' },
      { n: 'Makes no “unlimited” claims', tm: '0.4s' },
      { n: 'Team plan lists SSO', tm: '0.5s' },
      { n: 'Reads at grade 8 or below', tm: '0.7s' },
      { n: 'One call to action per plan', tm: '0.5s' },
      { n: 'Free plan says no card is needed', tm: '0.6s' }
    ],
    autonomy: ['Asks before every change', 'Asks before edits to shared files', 'Works alone, asks only before publishing'],
    autonomyNames: ['Ask', 'Balanced', 'Autopilot'],
    caps: [1, 2, 5, 10, 20, 50],
    instructions: 'Use our tokens only. Keep copy short and friendly.'
  };

  function esc(s) { return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])); }
  function el(html) { const t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstElementChild; }
  function ic(name, cls) { return IC[name].replace('class="i"', 'class="' + (cls || 'i') + '"'); }
  function money(v) { return '$' + v.toFixed(2); }
  function sumTree(n) { return n.cost + (n.kids || []).reduce((a, k) => a + sumTree(k), 0); }
  function clone(o) { return JSON.parse(JSON.stringify(o)); }

  function ctrl(stage) {
    const pending = new Set();
    let dead = false;
    const api = {
      dead: () => dead,
      reduce: REDUCE,
      kill() {
        dead = true;
        pending.forEach(p => { clearTimeout(p.t); p.rej(new Error('dead')); });
        pending.clear();
      },
      wait(ms) {
        if (dead) return Promise.reject(new Error('dead'));
        if (REDUCE || !ms) return Promise.resolve();
        return new Promise((res, rej) => {
          const item = { rej };
          item.t = setTimeout(() => { pending.delete(item); res(); }, ms);
          pending.add(item);
        });
      }
    };
    stage._kill = () => api.kill();
    return api;
  }

  function seg(root, on) {
    const buttons = [...root.querySelectorAll('button')];
    let knob = root.querySelector('.knob');
    if (!knob) { knob = el('<span class="knob"></span>'); root.prepend(knob); }
    const place = () => {
      const b = buttons.find(x => x.getAttribute('aria-pressed') === 'true') || buttons[0];
      if (!b) return;
      knob.style.left = b.offsetLeft + 'px';
      knob.style.width = b.offsetWidth + 'px';
    };
    buttons.forEach(b => b.addEventListener('click', () => {
      buttons.forEach(x => x.setAttribute('aria-pressed', x === b ? 'true' : 'false'));
      place();
      on && on(b.dataset.v, b);
    }));
    requestAnimationFrame(place);
    return place;
  }

  function count(node, to, ms, fmt) {
    if (REDUCE) { node.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = now => {
      const p = Math.min(1, (now - t0) / ms);
      const e = 1 - Math.pow(1 - p, 3);
      node.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  window.ELEV = { COPY, REDUCE, IC, hi, esc, el, ic, money, sumTree, clone, ctrl, seg, count };
})();
