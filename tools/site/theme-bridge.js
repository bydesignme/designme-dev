'use strict';
/* The Tailwind v4 / shadcn theme bridge: which of the components' tokens take which of a shadcn-style theme's variables
   (--background, --foreground, --primary, --border, --radius, --chart-1 and the rest, the public convention shadcn/ui and
   Tailwind v4 themes use). One table, written out three ways:
     the bridge for HTML and Astro   bridge({ out:'dm-' })                      r/theme-bridge.json, src/core/theme-bridge.css
     the bridge for React            bridge({ out:'dm-', scope:'[data-dm]' })   the same tokens, on React's roots
     the site's "Your theme" preview previewScript()                            the visitor's pasted variables, renamed --dmt-
                                                                                so they never touch the page's own
   Installed components' tokens all start with --dm- (token-prefix.js and React's sync), so they never share a name with the
   theme's. The rule sits on each component's root ([data-c], or [data-dm] in React), not on :root, so it changes only the
   components. :not(#\#) gives it an id's weight, so it also wins on a root that carries data-style="soft" itself. Tokens the
   core works out from others (the tints, the hover fill, the chart ramp) are written again here, because a custom property is
   worked out where it is declared and its children inherit the result.
   Used by packages/astro/scripts/bridge.mjs, tools/site/build.js and tools/pages (the "Your theme" option) */

// [our token, the value, from the theme's variables written as $name]
const MAP = [
  ['page', 'var($background)'], ['stage', 'var($background)'],
  ['surface', 'var($card)'], ['raised', 'var($popover)'],
  ['fg', 'var($foreground)'],
  ['fg2', 'color-mix(in oklab,var($foreground) 70%,var($muted-foreground))'],
  ['muted', 'var($muted-foreground)'],
  ['line', 'var($border)'], ['rail', 'var($border)'],
  ['field-line', 'var($input)'], ['field-line-strong', 'var($ring)'], ['focus', 'var($ring)'],
  ['chip', 'var($secondary)'], ['soft', 'var($secondary)'], ['dis-fill', 'var($secondary)'],
  ['hover', 'color-mix(in oklab,var($secondary) 88%,var($foreground))'],
  ['press', 'color-mix(in oklab,var($secondary) 82%,var($foreground))'],
  ['wash', 'color-mix(in oklab,var($secondary) 50%,var($card))'],
  ['row', 'color-mix(in srgb,var($foreground) 4%,transparent)'],
  ['accent', 'var($primary)'], ['on-accent', 'var($primary-foreground)'],
  ['accent-fg', 'var($primary)'], ['accent-mark', 'var($primary)'],
  ['accent-2', 'color-mix(in oklab,var($primary) 86%,var($primary-foreground))'],
  ['accent-bg', 'color-mix(in srgb,var($primary) 9%,transparent)'],
  ['sel', 'color-mix(in srgb,var($primary) 6%,transparent)'],
  ['bad', 'var($destructive)'],
  ['c1', 'var($chart-1)'], ['c2', 'var($chart-2)'], ['c3', 'var($chart-3)'], ['c4', 'var($chart-4)'], ['c5', 'var($chart-5)'],
  ['a1', 'var(%c1)'], ['a2', 'color-mix(in oklab,var(%c1) 72%,var(%surface))'], ['a3', 'color-mix(in oklab,var(%c1) 50%,var(%surface))'], ['a4', 'color-mix(in oklab,var(%c1) 32%,var(%surface))'],
  // corners, from --radius the way shadcn derives its sm, md, lg and xl: Soft's named radii. Blueprint keeps its square corners,
  // and a corner a component writes as a multiple of --rk keeps Soft's own scale
  ['r-card', 'max(0px,calc(var($radius) + 4px))'], ['r-lg', 'max(0px,calc(var($radius) + 4px))'],
  ['r-in', 'var($radius)'], ['r-box', 'var($radius)'], ['r-box-sq', 'var($radius)'],
  ['r-sm', 'max(0px,calc(var($radius) - 2px))'], ['r-field', 'max(0px,calc(var($radius) - 2px))'], ['r-field-sq', 'max(0px,calc(var($radius) - 2px))'],
  ['r-xs', 'max(0px,calc(var($radius) - 4px))'], ['r-tag', 'max(0px,calc(var($radius) - 4px))'], ['r-tag-sq', 'max(0px,calc(var($radius) - 4px))'],
];
// the theme's variables the bridge reads
const NAMES = [...new Set(MAP.flatMap(([, v]) => [...v.matchAll(/\$([\w-]+)/g)].map(m => m[1])))];

/** The bridge's CSS. out: our tokens' prefix ('' or 'dm-'); from: a prefix the theme's variables carry ('' as a theme writes
    them); scope: the components' root */
function bridge({ out = '', from = '', scope = '[data-c]', comment = true } = {}){
  const decls = MAP.map(([k, v]) => `  --${out}${k}:${v.replace(/\$([\w-]+)/g, `--${from}$1`).replace(/%([\w-]+)/g, `--${out}$1`)};`).join('\n');
  const head = comment ? `/* designme.dev theme bridge: the components take their colours and corners from a shadcn/ui or Tailwind v4 theme.
   Load it after the components' CSS, in a project whose theme defines ${NAMES.map(n => '--' + n).join(', ')}
   (on :root, and on .dark for dark mode). It changes only the components (${scope}), never the rest of the page.
   Dark mode: the theme's .dark values reach the colours it sets here; keep data-theme="dark" on <html> in step with .dark,
   so the rest of the components' tokens (status colours, shadows) switch too. Without this file the components keep their
   own look. */\n` : '';
  return `${head}:where(${scope}):not(#\\#){\n${decls}\n}\n`;
}
module.exports = { MAP, NAMES, bridge };

/* ---------- the site's "Your theme" option (homepage and the pages in tools/pages) ----------
   A visitor pastes a shadcn/ui or Tailwind v4 theme into a small panel, and every demo on the page previews with it through
   this bridge (out: '' for the homepage's own token names, 'dm-' for the pages built from the registry). The theme is kept in local storage (dmui-theme-css) and the option itself as the style (dmui-style = "mine"),
   which draws the demos in Soft with the theme over them. previewScript() is inlined in each page's head, so a saved theme is
   applied before the page paints; it defines window.dmTheme, which the style switches call:
     dmTheme.apply(on)              puts the saved theme over the demos, or takes it off
     dmTheme.open(anchor, onReset)  opens the panel under the switch; Reset forgets the theme and calls onReset
   The demos are .card[data-c] on the component pages and .v2-host on the homepage. Only the variables the bridge reads are taken, renamed --dmt-<name> so they never touch the page's own; a bridge line whose
   variables the theme doesn't set is left out, so the demos keep their own value there. */
function previewScript({ out = '' } = {}){
  const map = JSON.stringify(MAP), names = JSON.stringify(NAMES);
  return `(function(){
  var MAP = ${map}, NAMES = ${names}, OUT = '${out}', KEY = 'dmui-theme-css', root = document.documentElement;
  var get = function(){ try { return localStorage.getItem(KEY) || ''; } catch(e){ return ''; } };
  // the theme's variables, light (any rule but .dark) and dark (.dark, or data-theme="dark"); --color-<name> counts as --<name>,
  // and shadcn's older bare HSL channels ("222 47% 11%") become hsl()
  var parse = function(text){
    var light = {}, dark = {}, n = 0, re = /([^{}]*)\\{([^{}]*)\\}/g, m;
    text = String(text || '').replace(/\\/\\*[\\s\\S]*?\\*\\//g, '');
    while ((m = re.exec(text))){
      var isDark = /\\.dark\\b|data-theme=["']?dark/.test(m[1]);
      m[2].replace(/--([\\w-]+)\\s*:\\s*([^;]+)/g, function(x, k, v){
        k = k.replace(/^color-/, ''); v = v.replace(/!important\\s*$/, '').trim();
        if (NAMES.indexOf(k) < 0 || !v || /[{}<>;]|var\\(/.test(v)) return x;
        if (/^-?[\\d.]+(deg)?\\s+[\\d.]+%\\s+[\\d.]+%$/.test(v)) v = 'hsl(' + v + ')';
        (isDark ? dark : light)[k] = v; n++; return x;
      });
    }
    return n ? { light:light, dark:dark } : null;
  };
  var css = function(text){
    var p = parse(text); if (!p) return '';
    var d = {}, k; for (k in p.light) d[k] = p.light[k]; for (k in p.dark) d[k] = p.dark[k];
    var vars = function(o){ var s = ''; for (var k in o) s += '--dmt-' + k + ':' + o[k] + ';'; return s; };
    var lines = MAP.filter(function(e){ var need = e[1].match(/\\$[\\w-]+/g) || []; return need.every(function(x){ return x.slice(1) in d; }); })
      .map(function(e){ return '--' + OUT + e[0] + ':' + e[1].replace(/\\$([\\w-]+)/g, '--dmt-$1').replace(/%([\\w-]+)/g, '--' + OUT + '$1') + ';'; });
    return ':root{' + vars(p.light) + '}:root[data-theme="dark"]{' + vars(d) + '}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){' + vars(d) + '}}'
      + ':where(.card[data-c],.v2-host):not(#\\\\#){' + lines.join('') + '}';
  };
  // the theme, and while one is on, no accent picker: it would do nothing (the homepage's swatch in the header and in the phone
  // menu, the pages' Accent row in the menu). Without a pasted theme, Your theme is Soft as it is and the picker stays
  var HIDE = '#acc,.m-set:has(.m-acc),.dc-set-r:has(.dc-acc){display:none!important}';
  var apply = function(on){
    var el = document.getElementById('dm-theme'), text = on ? css(get()) : '';
    if (!text){ if (el) el.remove(); return false; }
    if (!el){ el = document.createElement('style'); el.id = 'dm-theme'; }
    el.textContent = text + HIDE; (document.head || root).appendChild(el); return true;
  };
  // the panel: a field to paste the theme into, Reset, Close and Preview, in the look of the site's other popovers (the accent
  // picker's surface, edge, corners and shadow, the site's field and its primary button on the accent). It sits under the
  // switch that opened it, or over it when there is no room below (the menu on a phone). Esc and Close put the focus back on
  // the switch; Tab past Preview goes on to what follows the switch, Shift+Tab out of the field back to the switch, and a click
  // or focus anywhere else closes it where you are
  var panel = null, opener = null, onReset = null;
  var close = function(back){ if (!panel || panel.hidden) return; panel.hidden = true; if (back && opener && opener.isConnected) opener.focus({ preventScroll:true }); };
  var place = function(){
    if (!panel || panel.hidden) return;
    var r = opener && opener.getBoundingClientRect(), w = Math.min(360, innerWidth - 32);
    panel.style.width = w + 'px';
    var h = panel.offsetHeight, x = r && r.width ? Math.min(Math.max(16, r.right - w), innerWidth - w - 16) : 16, y = r && r.height ? r.bottom + 10 : 72;
    if (y + h > innerHeight - 16) y = r && r.height && r.top - 10 - h >= 16 ? r.top - 10 - h : Math.max(16, innerHeight - h - 16);
    panel.style.left = x + 'px'; panel.style.top = y + 'px';
  };
  // what the focus moves on to after the switch: the first control after the switch's group, in the page's order
  var after = function(){
    var g = opener && (opener.closest('[role="radiogroup"]') || opener), all = [].slice.call(document.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select,textarea,[tabindex]:not([tabindex="-1"])'));
    return all.filter(function(el){ return !panel.contains(el) && !g.contains(el) && (g.compareDocumentPosition(el) & 4) && el.getClientRects().length && el.tabIndex >= 0; })[0] || null;
  };
  var build = function(){
    var st = document.createElement('style');
    // the site's chrome tokens: --sh-* on every page, the field greys from --sh-field/--sh-focus (homepage) or --pg-field/--pg-focus
    // (the pages); the primary button on the accent the page draws its components with, or the style's own when it has none
    st.textContent = '.dmt-p{--dmt-acc:#d4f84a;--dmt-on:#121212;position:fixed;z-index:1000;box-sizing:border-box;max-height:calc(100vh - 32px);overflow:auto;padding:14px;border-radius:18px;background:var(--sh-card,#fff);border:1px solid var(--sh-line,rgba(18,18,18,.08));box-shadow:0 1px 2px rgba(18,18,18,.05),0 24px 48px -20px rgba(18,18,18,.28);color:var(--sh-text,#121212);font:400 13px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased;text-align:left}'
      + '[data-style="soft"] .dmt-p{--dmt-acc:#116ff8;--dmt-on:#fff}'
      + '.dmt-p[hidden]{display:none}.dmt-p *{box-sizing:border-box}.dmt-p h2{margin:0 0 4px;font-size:14px;line-height:20px;font-weight:500;color:var(--sh-text,#121212)}.dmt-p p{margin:0 0 12px;font-size:13px;color:var(--sh-dim,#525252)}'
      + '.dmt-p textarea{display:block;width:100%;height:160px;margin:0;padding:10px 12px;resize:vertical;white-space:pre;overflow:auto;border:1px solid var(--sh-field,var(--pg-field,#d4d4d4));border-radius:8px;background:var(--sh-card,#fff);color:var(--sh-text,#121212);font:500 12px/1.5 "JetBrains Mono",ui-monospace,SFMono-Regular,Menlo,monospace;font-variant-ligatures:none;outline:0;transition:border-color .2s}'
      + '.dmt-p textarea::placeholder{color:var(--sh-muted,#6a6a6a)}.dmt-p textarea:focus{border-color:var(--sh-focus,var(--pg-focus,#858585))}.dmt-p .dmt-s{min-height:20px;margin:8px 0 0;font-size:13px}'
      + '.dmt-p .dmt-r{display:flex;justify-content:flex-end;gap:8px;margin-top:8px}.dmt-p button{display:inline-flex;align-items:center;height:32px;padding:0 14px;border:0;border-radius:999px;background:var(--sh-card,#fff);color:var(--sh-text,#121212);box-shadow:inset 0 0 0 1px var(--sh-line-2,rgba(18,18,18,.14));font-family:inherit;font-size:13px;font-weight:500;line-height:1;white-space:nowrap;cursor:pointer;transition:background-color .2s}'
      + '.dmt-p button.pill.primary{background:var(--dm-accent,var(--accent,var(--dmt-acc)));color:var(--dm-on-accent,var(--on-accent,var(--dmt-on)));box-shadow:none}'
      + '.dmt-p button:focus-visible{outline:2px solid var(--sh-focus,var(--pg-focus,#858585));outline-offset:2px}'
      + '@media (hover:hover) and (pointer:fine){.dmt-p button:hover{background:var(--sh-chip,#f1f1f1)}.dmt-p button.pill.primary:hover{background:var(--dm-accent-2,var(--accent-2,var(--dmt-acc)))}}';
    document.head.appendChild(st);
    panel = document.createElement('div'); panel.className = 'dmt-p'; panel.hidden = true;
    panel.setAttribute('role', 'dialog'); panel.setAttribute('aria-labelledby', 'dmt-h');
    panel.innerHTML = '<h2 id="dmt-h">Your theme</h2><p id="dmt-d">Paste a shadcn/ui or Tailwind v4 theme: its CSS variables, like --primary, --background and --radius, on :root and .dark. The demos preview with it through the theme bridge. It stays in this browser.</p>'
      + '<textarea id="dmt-t" spellcheck="false" aria-labelledby="dmt-h" aria-describedby="dmt-d" placeholder=":root {\\n  --radius: 0.5rem;\\n  --primary: oklch(0.55 0.2 290);\\n  --primary-foreground: oklch(0.98 0 0);\\n}\\n.dark {\\n  --primary: oklch(0.75 0.14 290);\\n}"></textarea>'
      + '<p class="dmt-s" role="status"></p><div class="dmt-r"><button type="button" data-a="reset">Reset</button><button type="button" data-a="close">Close</button><button type="button" class="pill primary" data-a="go">Preview</button></div>';
    document.body.appendChild(panel);
    var say = function(t){ panel.querySelector('.dmt-s').textContent = t; };
    panel.addEventListener('click', function(e){
      var b = e.target.closest('button'); if (!b) return;
      var a = b.getAttribute('data-a'), t = panel.querySelector('textarea');
      if (a === 'close') close(true);
      else if (a === 'reset'){ try { localStorage.removeItem(KEY); } catch(x){} t.value = ''; apply(false); say(''); close(true); if (onReset) onReset(); }
      else if (a === 'go'){
        if (!parse(t.value)){ say('No theme variables found. Paste CSS that sets --primary, --background and the like.'); return; }
        try { localStorage.setItem(KEY, t.value); } catch(x){}
        apply(true); var p = parse(t.value), n = Object.keys(p.light).length + Object.keys(p.dark).length;
        say('Previewing ' + n + ' variable' + (n === 1 ? '' : 's') + '.');
        document.dispatchEvent(new CustomEvent('dm-theme'));
      }
    });
    panel.addEventListener('keydown', function(e){
      if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); close(true); return; }
      if (e.key !== 'Tab') return;
      var f = [].slice.call(panel.querySelectorAll('textarea,button')), first = f[0], last = f[f.length - 1];
      if (!e.shiftKey && document.activeElement === last){ var n = after(); e.preventDefault(); close(false); if (n) n.focus(); }
      else if (e.shiftKey && document.activeElement === first){ e.preventDefault(); close(true); }
    });
    // the focus going anywhere outside the panel (a click elsewhere, a screen reader moving on) closes it, and leaves the focus there
    panel.addEventListener('focusout', function(e){ var to = e.relatedTarget; if (to && !panel.contains(to) && !(opener && opener.contains(to))) close(false); });
    document.addEventListener('pointerdown', function(e){ if (!panel.hidden && !panel.contains(e.target) && !(opener && opener.contains(e.target))) close(false); }, true);
    addEventListener('resize', place); addEventListener('scroll', place, { passive:true });
  };
  window.dmTheme = {
    apply:apply, css:css, parse:parse,
    // the switch opens it on a click, or Enter or Space; arrowing onto Your theme picks it without opening the panel, so the
    // arrows carry on through the switch (the caller passes the click's isTrusted)
    open:function(anchor, reset){
      if (!panel) build();
      opener = anchor; onReset = reset || null; panel.hidden = false; place();
      var t = panel.querySelector('textarea'); if (!t.value) t.value = get();
      panel.querySelector('.dmt-s').textContent = get() ? '' : 'Nothing pasted yet: the demos show Soft.';
      t.focus({ preventScroll:true });
    }
  };
  try { if (localStorage.getItem('dmui-style') === 'mine') apply(true); } catch(e){}
})();`;
}
module.exports.previewScript = previewScript;
