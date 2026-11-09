/* The homepage's big styles and scripts as files of their own, so a visit downloads only the page's markup and what it needs,
   and the browser keeps the rest between visits. build.js writes the page with everything inline (its later steps read it
   that way), and this moves three blocks out into /assets, each named by a hash of its content: v2.<hash>.css (the
   components' styles), site.<hash>.js (the site's script) and v2.<hash>.js (the components' script, whose section files,
   v2-<section>.<hash>.js, build.js hands over as `extra`). A file only changes name when its content changes, so _headers
   caches /assets/* for a year (immutable), while index.html revalidates on every visit and names the current files.
   - the site's own stylesheet (@layer site) stays inline: it draws the header, the sidebar and the intro, and the headline
     paints with the page's own bytes instead of waiting for one more file (measured: first paint about 0.9 s sooner on
     Lighthouse's mobile run)
   - the components' stylesheet (#v2-css) is linked where it was, so the cascade keeps its order, but doesn't hold up the
     first paint (media="print" until it has loaded, the standard pattern): only the components use it, and their script
     waits for it before it mounts the first card (`ready` in build.js)
   - the site's script and the components' script (#v2-js) load where they were, deferred: they download alongside the page
     and run in the same order once it has been read, before DOMContentLoaded, as the inline scripts at the end of the body
     did. The small scripts that must run before the first paint (theme and style, Your theme, the accent, the scrollbar
     width) stay inline. Hashed files that a new build no longer uses are removed. */
const crypto = require('crypto'), fs = require('fs'), path = require('path');
const NAMED = /^(site|v2)(-[\w-]+)?\.[0-9a-f]{10}\.(css|js)$/;
const hashedAsset = (name, ext, text) => {
  const file = `${name}.${crypto.createHash('sha256').update(text).digest('hex').slice(0, 10)}.${ext}`;
  return { file, url:'/assets/' + file, text };
};
function splitAssets(html, root, extra = []){
  const dir = path.join(root, 'assets');
  fs.mkdirSync(dir, { recursive:true });
  const kept = new Set();
  const put = (name, ext, text) => { const f = hashedAsset(name, ext, text); fs.writeFileSync(path.join(dir, f.file), text); kept.add(f.file); return f.url; };
  for (const f of extra){ fs.writeFileSync(path.join(dir, f.file), f.text); kept.add(f.file); }
  // one block, found by its opening tag, which must be on the page exactly once
  const block = (open, close) => {
    const a = html.indexOf(open);
    if (a < 0 || html.indexOf(open, a + 1) >= 0) throw new Error('split-assets: expected one ' + open.slice(0, 40).replace(/\n/g, '\\n'));
    const b = html.indexOf(close, a + open.length);
    if (b < 0) throw new Error('split-assets: no end for ' + open.slice(0, 40));
    return { a, b:b + close.length, text:html.slice(a + open.length, b) };
  };
  const swap = (x, tag) => { html = html.slice(0, x.a) + tag + html.slice(x.b); };
  const v2Css = block('<style id="v2-css">\n', '</style>');
  swap(v2Css, `<link rel="stylesheet" id="v2-css" href="${put('v2', 'css', v2Css.text)}" media="print" onload="this.media='all'">`);
  const siteJs = block("<script>\n(function(){\n  'use strict'; // keeps each", '</script>');
  swap(siteJs, `<script src="${put('site', 'js', "(function(){\n  'use strict'; // keeps each" + siteJs.text)}" defer></script>`);
  const v2Js = block('<script id="v2-js">\n', '</script>');
  swap(v2Js, `<script id="v2-js" src="${put('v2', 'js', v2Js.text)}" defer></script>`);
  for (const f of fs.readdirSync(dir)) if (NAMED.test(f) && !kept.has(f)) fs.unlinkSync(path.join(dir, f));
  return { html, files:[...kept] };
}
module.exports = { splitAssets, hashedAsset };
