#!/usr/bin/env python3
# Builds lab/landing-styles/2a.html and 2b.html from the built landing page (index.html at the repository root): the page as it
# is, with only the "Three styles, light and dark" section's markup, CSS and script replaced. Run it from anywhere after
# `npm run pages`:  python3 lab/landing-styles/make-2.py
#   2a  one switch, centred over the scene: Blueprint, Soft, Clean and Light, Dark in one track, the picked style's line under it
#   2b  the styles as three tabs, each with its one-line character and its <html> attribute, over the scene; Light and Dark in
#       the scene's own bar
# Both re-draw a small scene of live components (a chat, an agent's tree and what the run costs) in the picked style and theme,
# with a crossfade (the View Transitions API, where the browser has it; none with reduced motion). The pick restyles the whole
# page, as the section does today, through the header's own switch handlers ([data-style-set], [data-theme-set])
import html, json, os, re

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.normpath(os.path.join(HERE, '..', '..'))
SRC = open(os.path.join(ROOT, 'index.html'), encoding='utf-8').read()
H = json.load(open(os.path.join(ROOT, 'tools/site/card-heights.json')))
BANDS = H['bands']
KEYS = ['components', 'componentsBp', 'componentsClean']

def tallest(reg, phone):
    # the tallest the component gets in any style, in the bands a stage of this width falls in, with 4px to spare
    out = 0
    for k in KEYS:
        r = H[k].get(reg) or H['components'][reg]
        for (b, w), v in zip(BANDS, r):
            if (w <= 640) == phone and b != 'b': out = max(out, v)
    return out + 4

STYLES = [
    ('bp', 'Blueprint', 'Square corners, hairline edges and a lime accent, like a technical sheet.', '<html>'),
    ('soft', 'Soft', 'Rounded, plush surfaces with a blue accent.', '<html data-style="soft">'),
    ('clean', 'Clean', 'Black, white and grey, with fully round controls. Data keeps its colours.', '<html data-style="clean">'),
]
SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/></svg>'
MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z"/></svg>'
REPLAY = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>'
CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>'

e = lambda s: html.escape(s, quote=True)
def demo(reg):
    return (f'<div class="lp-demo stage-inner xs-d" data-reg="{reg}" data-url="/components/{reg}" '
            f'style="--xh:{tallest(reg, False)}px;--xhp:{tallest(reg, True)}px"></div>')

def theme_seg(cls=''):
    return (f'<div class="pg-seg xs-seg icons{cls}" role="radiogroup" aria-label="Theme">'
            f'<button type="button" role="radio" aria-checked="false" data-theme-set="light" aria-label="Light">{SUN}</button>'
            f'<button type="button" role="radio" aria-checked="false" data-theme-set="dark" aria-label="Dark">{MOON}</button></div>')

HEAD = ('<div class="lp-sh"><h2 id="styles-h">Three styles, light and dark</h2>'
        '<p>One set of components, drawn three ways. Pick one and this whole page follows, demos and all.</p></div>')

# the scene: a chat on the left, the agent's tree and what the run costs on the right (2a lays them out in three columns)
RP = f'<button type="button" class="lp-anim lp-rp xs-rp" data-replay aria-label="Play the scene again">{REPLAY}</button>'
def scene(cols, bar=''):
    inner = ''.join('<div class="xs-col">' + ''.join(demo(r) for r in c) + '</div>' for c in cols)
    return (f'<div class="lp-bg lp-stg xs-scene" role="group" aria-label="An agent run, live: Composer, Agent tree and Run cost">'
            f'{bar or RP}<div class="xs-grid" data-n="{len(cols)}">{inner}</div></div>')

SEC_A = (f'<section class="lp-in lp-sec" id="styles" aria-labelledby="styles-h">{HEAD}<div class="lp-sty xs xs-a">'
         '<div class="xs-ctl">'
         '<div class="xs-sw" role="group" aria-label="Style and theme">'
         '<div class="pg-seg xs-seg" role="radiogroup" aria-label="Style">'
         + ''.join(f'<button type="button" role="radio" aria-checked="false" data-style-set="{v}">{n}</button>' for v, n, _, _ in STYLES)
         + '</div><span class="xs-div" aria-hidden="true"></span>' + theme_seg() + '</div>'
         '<div class="xs-lines">' + ''.join(f'<p class="xs-line" data-for="{v}"{"" if v == "bp" else " hidden"}>{e(d)} <code>{e(c)}</code></p>' for v, _, d, c in STYLES) + '</div>'
         '</div>'
         + scene([['composer'], ['agent-tree'], ['run-cost']]) + '</div></section>')

TABS = ('<div class="xs-tabs" role="radiogroup" aria-label="Style">' + ''.join(
    f'<button type="button" class="xs-tab" role="radio" aria-checked="false" data-style-set="{v}">'
    f'<span class="xs-tn">{n}<span class="xs-ck">{CHECK}</span></span><span class="xs-td">{e(d)}</span><code>{e(c)}</code></button>'
    for v, n, d, c in STYLES) + '</div>')
BAR = ('<div class="xs-bar"><span class="xs-bl">An agent run, live</span><div class="xs-bc">' + RP + theme_seg(' xs-bseg') + '</div></div>')
SEC_B = (f'<section class="lp-in lp-sec" id="styles" aria-labelledby="styles-h">{HEAD}<div class="lp-sty xs xs-b">'
         + TABS + scene([['composer', 'run-cost'], ['agent-tree']], BAR) + '</div></section>')

CSS = r'''
/* ---- lab: the styles section, one switch over a scene of live components (landing-styles 2a, 2b) ---- */
.lp .lp-sty.xs{display:flex;flex-direction:column;align-items:stretch;gap:32px}
/* the scene: the site's grey, its corners following the cards inside it (each card's corner plus the frame's padding), so the
   frame and the cards share one centre for their curves in every style */
.lp .xs-scene{--xs-pad:24px;padding:var(--xs-pad);border-radius:calc(var(--dm-r-card,0px) + var(--xs-pad));overflow:visible}
:root:not([data-style]) .lp .xs-scene{border-radius:0}
.xs-grid{display:grid;gap:var(--xs-pad);align-items:center}
.xs-grid[data-n="3"]{grid-template-columns:minmax(0,5fr) minmax(0,4fr) minmax(0,4fr)}
.xs-grid[data-n="2"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}
.xs-col{display:flex;flex-direction:column;gap:var(--xs-pad);min-width:0}
.lp .xs-d{min-height:var(--xh);padding:0}
.lp .xs-scene .xs-rp{top:8px;right:8px}
@media (max-width:1099px){.xs-grid[data-n="3"]{grid-template-columns:minmax(0,1fr) minmax(0,1fr)}.xs-grid[data-n="3"] .xs-col:first-child{grid-column:1/-1}}
@media (max-width:760px){.xs-grid[data-n]{grid-template-columns:minmax(0,1fr)}.xs-grid[data-n] .xs-col:first-child{grid-column:auto}}
/* on a phone the grey runs to the screen's edges, as the site's other grey stages do, so it has no corners of its own */
@media (max-width:640px){.lp .xs-scene{--xs-pad:16px;border-radius:0}.lp .xs-d{min-height:var(--xhp)}}

/* 2a: one switch, centred: the styles and the themes in one track, one height, the knob of each under its pick */
.xs-ctl{display:flex;flex-direction:column;align-items:center;gap:16px;text-align:center}
.xs-sw{display:inline-flex;align-items:center;padding:2px;border-radius:999px;background:var(--pg-chip);max-width:100%}
.lp .xs-sw .xs-seg.pg-seg{background:none;box-shadow:none;padding:0}
.lp .xs-sw .xs-seg .pg-k{top:0;bottom:0}
.lp .xs-seg button{height:32px;padding:0 16px;font-size:14px}
.lp .xs-seg.icons button{width:36px;padding:0;display:inline-grid;place-items:center}
.xs-seg.icons svg{width:16px;height:16px}
.xs-div{flex:none;width:1px;height:16px;margin:0 4px;background:color-mix(in srgb,var(--pg-line2) 50%,transparent)}
:root[data-style="soft"] .xs-sw{corner-shape:squircle}
/* in dark, the track is the site's dark switch track: near black with a faint white edge */
:root[data-theme="dark"] .xs-sw{background:#0a0a0a;box-shadow:inset 0 0 0 1px #ffffff1f}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]) .xs-sw{background:#0a0a0a;box-shadow:inset 0 0 0 1px #ffffff1f}}
.xs-lines{display:grid}
.xs-line{grid-area:1/1;margin:0;max-width:60ch;font-size:14px;line-height:1.6;color:var(--pg-dim);text-wrap:balance}
.xs-line[hidden]{display:block;visibility:hidden}
.xs-line code{font-size:12px;white-space:nowrap}

/* 2b: the styles as tabs, each with its character; a pick is the white card with a stronger grey edge and a tick */
.xs-tabs{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px}
.lp .xs-tab{position:relative;display:flex;flex-direction:column;align-items:flex-start;gap:8px;min-width:0;padding:16px;text-align:left;
  border:0;border-radius:var(--dm-r-card,0px);background:var(--pg-bg);color:var(--pg-fg);font:400 14px/20px var(--pg-sans);cursor:pointer;
  box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--pg-line2) 50%,transparent);
  transition:background-color 220ms var(--lp-ease),box-shadow 220ms var(--lp-ease)}
:root[data-style="soft"] .xs-tab{corner-shape:squircle}
.lp .xs-tab:hover{background:var(--pg-soft)}
.lp .xs-tab[aria-checked="true"]{background:var(--pg-bg);box-shadow:inset 0 0 0 1px var(--pg-line2)}
.lp .xs-tab:focus-visible{outline:2px solid var(--pg-focus);outline-offset:2px}
.xs-tn{display:flex;align-items:center;justify-content:space-between;align-self:stretch;gap:8px;font-weight:500}
.xs-ck{display:inline-grid;place-items:center;width:20px;height:20px;border-radius:50%;color:var(--pg-fg);opacity:0;transform:scale(.8);transition:opacity 220ms var(--lp-ease),transform 220ms var(--lp-ease)}
.xs-ck svg{width:16px;height:16px}
.xs-tab[aria-checked="true"] .xs-ck{opacity:1;transform:none}
.xs-td{font-size:13px;line-height:20px;color:var(--pg-dim)}
.lp .xs-tab code{font-size:12px;margin-top:auto}
/* the scene's bar: what it shows on the left, Light and Dark on the right, on the cards' 24px column */
.xs-bar{display:flex;align-items:center;justify-content:space-between;gap:16px;margin:0 0 var(--xs-pad)}
.xs-bl{font-size:13px;line-height:20px;color:var(--pg-dim)}
.lp .xs-bseg button{height:28px;width:32px}
.xs-bc{display:flex;align-items:center;gap:8px}
/* the replay beside the switch: one height (32px) and one round shape with it, always shown */
.lp .xs-bar .xs-rp{position:static;opacity:1;width:32px;height:32px}
@media (max-width:760px){.xs-tabs{grid-template-columns:minmax(0,1fr);gap:8px}.lp .xs-tab code{margin-top:0}}

/* the crossfade: the old page fades into the new one (the View Transitions API), with Clean's ease; none with reduced motion */
::view-transition-old(root),::view-transition-new(root){animation-duration:420ms;animation-timing-function:cubic-bezier(.23,1,.32,1)}
@media (prefers-reduced-motion:reduce){::view-transition-group(*),::view-transition-old(*),::view-transition-new(*){animation:none!important}}
'''

JS = r'''
<script>
(function(){
  // a pick in the section re-draws the page in a crossfade: the click is held back, then made again inside a view transition,
  // where the header's own handlers restyle the page and start the demos again
  var sec = document.querySelector('.lp-sty.xs'); if (!sec) return;
  var reduce = matchMedia('(prefers-reduced-motion: reduce)'), busy = false;
  sec.addEventListener('click', function(e){
    var b = e.target.closest && e.target.closest('[data-style-set],[data-theme-set]');
    if (!b || busy || !document.startViewTransition || reduce.matches || b.getAttribute('aria-checked') === 'true') return;
    e.stopPropagation();
    busy = true;
    var t = document.startViewTransition(function(){ b.click(); });
    t.finished.then(function(){ busy = false; }, function(){ busy = false; });
    setTimeout(function(){ busy = false; }, 1200);
  }, true);
  // the picked style's line (2a)
  var lines = [].slice.call(sec.querySelectorAll('.xs-line'));
  var show = function(){ var s = document.documentElement.getAttribute('data-style'); s = s === 'soft' || s === 'clean' ? s : 'bp'; lines.forEach(function(x){ x.hidden = x.dataset.for !== s; }); };
  show(); new MutationObserver(show).observe(document.documentElement, { attributes:true, attributeFilter:['data-style'] });
  // the tabs (2b) are one radio group: the arrow keys move through them and pick
  var tabs = sec.querySelector('.xs-tabs');
  if (tabs) tabs.addEventListener('keydown', function(e){
    var d = e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : e.key === 'ArrowLeft' || e.key === 'ArrowUp' ? -1 : 0;
    var bs = [].slice.call(tabs.querySelectorAll('[role="radio"]')), i = bs.indexOf(document.activeElement);
    if (!d || i < 0) return; e.preventDefault(); var n = bs[(i + d + bs.length) % bs.length]; n.click(); n.focus();
  });
})();
</script>
'''

# ?style=bp|soft|clean&theme=light|dark, read before the page's own script applies the saved settings
QUERY = ('<script>try{var q=new URLSearchParams(location.search),s=q.get("style"),t=q.get("theme");'
         'if(s==="bp"||s==="soft"||s==="clean")localStorage.setItem("dmui-style",s);'
         'if(t==="light"||t==="dark")localStorage.setItem("dmui-theme",t)}catch(e){}</script>')

def build(name, sec, title):
    s = SRC
    i = s.find('<section class="lp-in lp-sec" id="styles"'); j = s.find('</section>', i) + len('</section>')
    assert i > 0 and j > i, 'no styles section in index.html'
    s = s[:i] + sec + s[j:]
    s = s.replace('<head>', '<head><meta name="robots" content="noindex">' + QUERY, 1)
    s = re.sub(r'<title>[^<]*</title>', f'<title>{title}</title>', s, count=1)
    s = s.replace('</head>', '<style>' + CSS + '</style></head>', 1)
    s = s.replace('</body>', JS + '</body>', 1)
    open(os.path.join(HERE, name), 'w', encoding='utf-8').write(s)

build('2a.html', SEC_A, 'Styles 2a: one switch over the scene')
build('2b.html', SEC_B, 'Styles 2b: style tabs over the scene')
print('wrote 2a.html, 2b.html')
