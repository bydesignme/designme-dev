// Generated from designme.dev by scripts/sync.mjs. Edit the site, then sync.
import { $, $$, DM, I, REDUCE, hideTip, html } from '../core/core.js';
/* the editing engine. The text is a list of lines (paragraphs, a heading, list items and quote lines) holding bold, italic,
   inline code and links, and every change goes through it: Enter, Backspace at a line's start, formats, paste and drop, so
   pasted or browser-made markup is cleaned into those few tags. Undo and redo step through its own history. A selection is
   kept as two numbers, the characters before each end with a line break counting one, so it survives every rebuild, and the
   editor works the same with or without the focus (a story types into it without taking the focus from the page) */
function rteEngine(ed, hook = {}){
  const LEAF = 'p,h2,blockquote,li', BLOCK = /^(P|DIV|H[1-6]|LI|BLOCKQUOTE|PRE|TR|DT|DD|SECTION|ARTICLE|HEADER|FOOTER|ASIDE|MAIN|NAV|FIGURE|FIGCAPTION|UL|OL|DL|TABLE|TBODY|THEAD|TFOOT|ADDRESS|HR)$/;
  const SKIP = /^(SCRIPT|STYLE|TEMPLATE|HEAD|META|LINK|TITLE|IFRAME|OBJECT|EMBED|SVG|MATH|IMG|PICTURE|VIDEO|AUDIO|CANVAS|NOSCRIPT|BUTTON|INPUT|SELECT|TEXTAREA|OPTION)$/;
  const offs = [], on = (el, ev, fn, o) => { el.addEventListener(ev, fn, o); offs.push(() => el.removeEventListener(ev, fn, o)); };
  const lines = () => [...ed.querySelectorAll(LEAF)];
  const typeOf = b => b.tagName === 'LI' ? b.parentNode.tagName.toLowerCase() : b.tagName === 'BLOCKQUOTE' ? 'quote' : b.tagName.toLowerCase();
  const lineOf = n => { for (let x = n; x && x !== ed; x = x.parentNode) if (x.nodeType === 1 && x.matches(LEAF)) return x; return null; };
  const len = b => b.textContent.length;
  const total = () => lines().reduce((n, b, i) => n + len(b) + (i ? 1 : 0), 0);
  const startOf = i => lines().slice(0, i).reduce((n, b) => n + len(b) + 1, 0);
  const lineAt = at => { const all = lines(); let n = 0; for (let i = 0; i < all.length; i++){ if (at <= n + len(all[i])) return i; n += len(all[i]) + 1; } return all.length - 1; };
  const text = o => lines().map(b => b.textContent).join('\n').slice(o.s, o.e);
  // the nearest element of a kind around a node, inside its line
  const up = (n, tag) => { for (let x = n && n.nodeType === 3 ? n.parentNode : n; x && x !== ed && x.nodeType === 1 && !x.matches(LEAF); x = x.parentNode) if (x.tagName === tag) return x; return null; };
  const wrap = (n, tag, href) => { const w = document.createElement(tag.toLowerCase()); if (href) w.setAttribute('href', href); n.replaceWith(w); w.appendChild(n); return w; };
  const unwrap = el => el.replaceWith(...el.childNodes);

  /* ---- a point in the DOM as one number, and back ---- */
  function offsetOf(node, off){
    let b = lineOf(node);
    if (!b){
      if (!ed.contains(node)) return 0;
      // a point between lines: the start of the line after it, or the very end
      const after = node.childNodes[off], first = after && (after.nodeType === 1 ? (after.matches(LEAF) ? after : after.querySelector(LEAF)) : null);
      if (!first) return total();
      b = first; node = first; off = 0;
    }
    let n = 0; for (const x of lines()){ if (x === b) break; n += len(x) + 1; }
    const rg = document.createRange(); rg.setStart(b, 0); rg.setEnd(node, off);
    return n + rg.toString().length;
  }
  // late: where two text nodes meet, the start of the second (for the start of a range) rather than the end of the first
  function pointAt(at, late){
    const all = lines(); let n = Math.max(0, at);
    for (let i = 0; i < all.length; i++){
      const b = all[i];
      if (n <= len(b) || i === all.length - 1){
        n = Math.min(n, len(b));
        const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); let t, last = null;
        while ((t = w.nextNode())){ if (late ? n < t.data.length : n <= t.data.length) return [t, n]; n -= t.data.length; last = t; }
        return last ? [last, last.data.length] : [b, 0];
      }
      n -= len(b) + 1;
    }
    return [ed, 0];
  }
  const range = o => { const [a, ao] = pointAt(o.s, o.s !== o.e), [b, bo] = pointAt(o.e); const rg = document.createRange(); rg.setStart(a, ao); rg.setEnd(b, bo); return rg; };
  // scrolls the text, and only the text, so a part of it is in view
  function show(x){
    const r = x.getBoundingClientRect(), b = ed.getBoundingClientRect(); if (!r.height) return;
    if (r.bottom > b.bottom - 12) ed.scrollTop += Math.min(r.bottom - b.bottom + 12, r.top - b.top - 12);
    else if (r.top < b.top + 12) ed.scrollTop -= b.top + 12 - r.top;
  }

  /* ---- the selection: the browser's while the editor has the focus, otherwise the last one it had ---- */
  let caret = null;
  const live = () => { const s = getSelection(); if (!s || !s.rangeCount) return null; const g = s.getRangeAt(0); return ed.contains(g.startContainer) && ed.contains(g.endContainer) ? g : null; };
  function get(){
    const g = live();
    if (g){ const a = offsetOf(g.startContainer, g.startOffset), b = offsetOf(g.endContainer, g.endOffset); return { s:Math.min(a, b), e:Math.max(a, b) }; }
    if (!caret){ const t = total(); caret = { s:t, e:t }; }
    return { s:caret.s, e:caret.e };
  }
  function set(o, focus){
    caret = { s:o.s, e:o.e };
    if (focus && document.activeElement !== ed) ed.focus({ preventScroll:true });
    if (document.activeElement !== ed) return;
    const s = getSelection(); s.removeAllRanges(); s.addRange(range(o));
  }

  /* ---- tidying: the few tags the editor keeps, in the shape it keeps them ---- */
  function tidy(){
    for (const el of ed.querySelectorAll('b,i,code,a')){
      if (!el.isConnected) continue;
      if (!el.textContent){ el.remove(); continue; }
      // a mark inside one of its own kind adds nothing
      if (up(el.parentNode, el.tagName)) unwrap(el);
    }
    // two marks of a kind side by side become one
    for (const el of ed.querySelectorAll('b,i,code,a')){
      if (!el.isConnected) continue;
      for (;;){
        let nx = el.nextSibling;
        while (nx && nx.nodeType === 3 && !nx.data){ const d = nx; nx = nx.nextSibling; d.remove(); }
        if (!nx || nx.nodeType !== 1 || nx.tagName !== el.tagName || nx.getAttribute('href') !== el.getAttribute('href')) break;
        el.append(...nx.childNodes); nx.remove();
      }
    }
    // an empty line keeps one <br> so it has a height and a caret; a line with text needs none
    for (const b of lines()){ const br = [...b.querySelectorAll('br')]; if (b.textContent) br.forEach(x => x.remove()); else if (!br.length) b.appendChild(document.createElement('br')); else br.slice(1).forEach(x => x.remove()); }
    if (!lines().length){ const p = document.createElement('p'); p.appendChild(document.createElement('br')); ed.replaceChildren(p); }
    ed.normalize();
  }
  // spec: [type, a node whose children become the line][]; list items of a kind side by side share one list
  function rebuild(spec){
    const frag = document.createDocumentFragment(); let list = null;
    for (const [t, b] of spec){
      const el = document.createElement(t === 'quote' ? 'blockquote' : t === 'ul' || t === 'ol' ? 'li' : t);
      el.append(...b.childNodes);
      if (t === 'ul' || t === 'ol'){ if (!list || list.tagName.toLowerCase() !== t) frag.appendChild(list = document.createElement(t)); list.appendChild(el); }
      else { list = null; frag.appendChild(el); }
    }
    ed.replaceChildren(frag); tidy();
  }
  const specOf = () => lines().map(b => [typeOf(b), b]);
  // anything the browser made that the editor doesn't keep: a stray <div>, a <span style>, text outside a line
  function messy(){
    for (const n of ed.childNodes){
      if (n.nodeType === 3 ? n.data.trim() : n.nodeType === 1 && !/^(P|H2|BLOCKQUOTE|UL|OL)$/.test(n.tagName)) return true;
      if (n.nodeType === 1 && /^(UL|OL)$/.test(n.tagName) && [...n.childNodes].some(x => x.nodeType !== 1 || x.tagName !== 'LI')) return true;
    }
    return !!ed.querySelector('[style],[class],span,font,div,a:not([href]),:is(p,h2,blockquote,li) :not(b,i,code,a,br)');
  }

  /* ---- reading HTML, pasted or the editor's own, into lines of the few tags it keeps. keep: the editor's own, every
     character and empty line as it is; otherwise whitespace collapses as a page shows it and empty lines go ---- */
  const safe = h => { h = (h || '').trim(); return /^(https?:\/\/|mailto:)/i.test(h) ? h : null; };
  function parse(root, keep){
    const out = []; let cur = null;
    const walk = (node, t, pre, marks) => {
      for (const n of node.childNodes){
        if (n.nodeType === 3){
          let s = keep ? n.data : pre ? n.data.replace(/\r\n?/g, '\n') : n.data.replace(/[\s ]+/g, ' ');
          if (!keep) s = s.replace(/ /g, ' ');
          if (!cur && !s.trim() && (node === root || /^(UL|OL|DL|TABLE|TBODY|THEAD|TFOOT|TR)$/.test(node.tagName))) continue;
          (pre && !keep ? s.split('\n') : [s]).forEach((p, i) => {
            if (i) cur = null;
            if (!p || (!cur && !keep && !p.trim())) return;
            if (!cur) out.push(cur = { t, frag:document.createDocumentFragment() });
            let x = document.createTextNode(p);
            for (let m = marks.length - 1; m >= 0; m--){ const w = document.createElement(marks[m][0].toLowerCase()); if (marks[m][1]) w.setAttribute('href', marks[m][1]); w.appendChild(x); x = w; }
            cur.frag.appendChild(x);
          });
          continue;
        }
        if (n.nodeType !== 1 || SKIP.test(n.tagName) || n.classList.contains('rte-new')) continue;
        const tg = n.tagName, css = (n.getAttribute('style') || '').toLowerCase();
        if (tg === 'BR'){ cur = null; continue; }
        if (BLOCK.test(tg)){
          const nt = /^H[1-6]$/.test(tg) ? 'h2' : tg === 'LI' ? (n.parentNode && n.parentNode.tagName === 'OL' ? 'ol' : 'ul') : tg === 'BLOCKQUOTE' ? 'quote' : t;
          cur = null; const was = out.length;
          walk(n, nt, pre || tg === 'PRE', marks);
          if (keep && out.length === was && !n.querySelector('p,div,h1,h2,h3,h4,h5,h6,li,blockquote,pre,ul,ol')) out.push({ t:nt, frag:document.createDocumentFragment() });
          cur = null; continue;
        }
        let m = marks; const add = (tag, href) => { if (!m.some(x => x[0] === tag)) m = [...m, [tag, href]]; };
        if (tg === 'B' || tg === 'STRONG' ? !/font-weight\s*:\s*(normal|[1-4]00)/.test(css) : /font-weight\s*:\s*(bold|[6-9]00)/.test(css)) add('B');
        if (tg === 'I' || tg === 'EM' || /font-style\s*:\s*italic/.test(css)) add('I');
        if (/^(CODE|KBD|SAMP|TT)$/.test(tg)) add('CODE');
        if (tg === 'A'){ const h = safe(n.getAttribute('href')); if (h) add('A', h); }
        walk(n, t, pre, m);
      }
    };
    walk(root, 'p', false, []);
    if (!keep) for (const x of out){
      const ts = [], w = document.createTreeWalker(x.frag, NodeFilter.SHOW_TEXT); let t; while ((t = w.nextNode())) ts.push(t);
      if (ts.length){ ts[0].data = ts[0].data.replace(/^\s+/, ''); ts[ts.length - 1].data = ts[ts.length - 1].data.replace(/\s+$/, ''); }
    }
    return out.filter(x => keep || x.frag.textContent).map(x => ({ ...x, len:x.frag.textContent.length }));
  }
  const plain = s => s.replace(/\r\n?/g, '\n').split('\n').filter(l => l.trim()).map(l => { const frag = document.createDocumentFragment(); frag.append(l); return { t:'p', frag, len:l.length }; });
  function clean(){ const o = get(); rebuild(parse(ed, true).map(x => [x.t, x.frag])); set(o); }
  function load(html){ const t = document.createElement('template'); t.innerHTML = html || ''; rebuild(parse(t.content, false).map(x => [x.t, x.frag])); caret = null; H.list = [{ html:ed.innerHTML, sel:{ s:0, e:0 }, pre:null }]; H.at = 0; H.dirty = false; pend = null; changed(); }

  /* ---- history ---- */
  const H = { list:[], at:0, dirty:false, pre:null, t:0 };
  const changed = () => hook.change && hook.change();
  function commit(pre){
    clearTimeout(H.t); const html = ed.innerHTML, top = H.list[H.at], before = H.pre || pre || null;
    H.dirty = false; H.pre = null;
    if (!top || top.html !== html){ H.list.splice(H.at + 1); H.list.push({ html, sel:get(), pre:before }); if (H.list.length > 300) H.list.shift(); H.at = H.list.length - 1; }
    changed();
  }
  const flush = () => { if (H.dirty) commit(); };
  // typing settles into one step once it pauses
  function typed(pre){ if (!H.dirty){ H.pre = pre || null; H.list.splice(H.at + 1); } H.dirty = true; clearTimeout(H.t); H.t = setTimeout(() => commit(), 700); changed(); }
  function restore(html, sel){ ed.innerHTML = html; pend = null; set(sel || { s:0, e:0 }); changed(); }
  function undo(){ flush(); if (H.at <= 0) return; const cur = H.list[H.at]; H.at--; restore(H.list[H.at].html, cur.pre || H.list[H.at].sel); }
  function redo(){ flush(); if (H.at >= H.list.length - 1) return; H.at++; restore(H.list[H.at].html, H.list[H.at].sel); }

  /* ---- edits ---- */
  function texts(){ const out = []; let n = 0; lines().forEach((b, i) => { if (i) n++; const w = document.createTreeWalker(b, NodeFilter.SHOW_TEXT); let t; while ((t = w.nextNode())){ out.push([t, n]); n += t.data.length; } }); return out; }
  function cut(at){ for (const [t, n] of texts()) if (at > n && at < n + t.data.length){ t.splitText(at - n); return; } }
  // the text nodes a selection covers, split at its ends so each is wholly inside it
  function covered(o){ cut(o.e); cut(o.s); return texts().filter(([t, n]) => t.data.length && n >= o.s && n + t.data.length <= o.e).map(x => x[0]); }
  // formats picked with nothing selected wait for the next thing typed at that spot
  let pend = null;
  function has(tag, o){
    if (o.s === o.e){
      if (pend && pend.at === o.s && tag in pend.m) return pend.m[tag];
      const g = live(); return !!up(g && g.collapsed ? g.startContainer : pointAt(o.s)[0], tag);
    }
    const ts = texts().filter(([t, n]) => t.data.length && n < o.e && n + t.data.length > o.s);
    return ts.length > 0 && ts.every(([t]) => up(t, tag));
  }
  // bold (B), italic (I), code (CODE) or a link (A, with href; null takes it off) on the selection, or off it when it all has it
  function inline(tag, href, o = get()){
    if (o.s === o.e){
      if (tag === 'A') return;
      if (!pend || pend.at !== o.s) pend = { at:o.s, m:{} };
      pend.m[tag] = !has(tag, o); changed(); return;
    }
    flush();
    const ts = covered(o); if (!ts.length) return;
    const add = href !== undefined ? href !== null : !ts.every(t => up(t, tag));
    if (add) ts.forEach(t => { const had = up(t, tag); if (!had) wrap(t, tag, href); else if (href) had.setAttribute('href', href); });
    else new Set(ts.map(t => up(t, tag))).forEach(el => {
      if (!el) return;
      const keep = [], w = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), h = el.getAttribute('href'); let t;
      while ((t = w.nextNode())) if (!ts.includes(t)) keep.push(t);
      unwrap(el); keep.forEach(x => wrap(x, tag, h));
    });
    tidy(); set(o); commit(o);
  }
  // typing with formats picked at the caret: the text goes in with them, and the caret stays inside them
  function typeStyled(s){
    const o = get(), m = pend.m; pend = null;
    const g = live(), [n, k] = g && g.collapsed ? [g.startContainer, g.startOffset] : pointAt(o.s);
    const rg = document.createRange(); rg.setStart(n, k); rg.collapse(true);
    for (const tag of Object.keys(m)) if (!m[tag]){
      const el = up(rg.startContainer, tag); if (!el) continue;
      const tail = document.createRange(); tail.setStart(rg.startContainer, rg.startOffset); tail.setEndAfter(el);
      el.after(tail.extractContents()); rg.setStartAfter(el); rg.collapse(true);
    }
    let x = document.createTextNode(s);
    for (const tag of Object.keys(m)) if (m[tag] && !up(rg.startContainer, tag)){ const w = document.createElement(tag.toLowerCase()); w.appendChild(x); x = w; }
    rg.insertNode(x); tidy(); set({ s:o.s + s.length, e:o.s + s.length }); typed(o);
  }
  // a heading, a list or a quote on the lines in the selection, or plain lines again when they all have it
  function block(type, o = get()){
    flush(); const all = lines(), a = lineAt(o.s), z = lineAt(o.e);
    const to = all.slice(a, z + 1).every(b => typeOf(b) === type) ? 'p' : type;
    rebuild(all.map((b, i) => [i >= a && i <= z ? to : typeOf(b), b])); set(o); commit(o);
  }
  function del(o){
    const all = lines(), i = lineAt(o.s), j = lineAt(o.e), [a, ao] = pointAt(o.s, true), [b, bo] = pointAt(o.e);
    if (i === j){ const rg = document.createRange(); rg.setStart(a, ao); rg.setEnd(b, bo); rg.deleteContents(); tidy(); return { s:o.s, e:o.s }; }
    const head = document.createRange(); head.setStart(a, ao); head.setEnd(all[i], all[i].childNodes.length); head.deleteContents();
    const tail = document.createRange(); tail.setStart(all[j], 0); tail.setEnd(b, bo); tail.deleteContents();
    all[i].append(...all[j].childNodes);
    rebuild(all.filter((x, k) => k <= i || k > j).map(x => [typeOf(x), x]));
    return { s:o.s, e:o.s };
  }
  // Enter: the text after the caret starts a new line. A list or a quote carries on, a heading is followed by text, and Enter
  // on an empty list item or quote line leaves the list
  function split(o = get()){
    flush(); const pre = o; if (o.s !== o.e) o = del(o);
    const all = lines(), i = lineAt(o.s), b = all[i], t = typeOf(b), spec = specOf(), next = t === 'h2' ? 'p' : t;
    if (!len(b) && t !== 'p'){ spec[i][0] = 'p'; rebuild(spec); set(o); commit(pre); return; }
    if (len(b) && o.s === startOf(i)){ spec.splice(i, 0, [next, document.createElement('p')]); rebuild(spec); set({ s:o.s + 1, e:o.s + 1 }); commit(pre); return; }
    const [n, k] = pointAt(o.s), rg = document.createRange(); rg.setStart(n, k); rg.setEnd(b, b.childNodes.length);
    const nb = document.createElement('p'); nb.appendChild(rg.extractContents());
    spec.splice(i + 1, 0, [next, nb]); rebuild(spec); set({ s:o.s + 1, e:o.s + 1 }); commit(pre);
  }
  // Backspace at the start of a line: a heading, list item or quote line turns plain first, then the line joins the one above
  function joinBack(o){
    const all = lines(), i = lineAt(o.s), spec = specOf();
    if (spec[i][0] !== 'p'){ spec[i][0] = 'p'; rebuild(spec); set(o); commit(o); return; }
    if (!i) return;
    all[i - 1].append(...all[i].childNodes); spec.splice(i, 1); rebuild(spec); set({ s:o.s - 1, e:o.s - 1 }); commit(o);
  }
  function joinNext(o){
    const all = lines(), i = lineAt(o.s), spec = specOf(); if (i >= all.length - 1) return;
    all[i].append(...all[i + 1].childNodes); spec.splice(i + 1, 1); rebuild(spec); set(o); commit(o);
  }
  // plain text at a spot; returns where it ends
  function insert(s, o){
    const [n, k] = pointAt(o.s);
    if (n.nodeType === 3) n.insertData(k, s); else n.insertBefore(document.createTextNode(s), n.childNodes[k] || null);
    tidy(); return o.s + s.length;
  }
  // lines read from a paste (or a suggestion) into the text: the first joins the line at the caret, the rest follow it, and
  // what came after the caret goes on the end. Returns where they end
  function insertLines(items, o){
    if (!items.length) return o.s;
    if (o.s !== o.e) o = del(o);
    const all = lines(), i = lineAt(o.s), b = all[i], [n, k] = pointAt(o.s), spec = specOf();
    const rg = document.createRange(); rg.setStart(n, k); rg.setEnd(b, b.childNodes.length); const tail = rg.extractContents();
    if (!b.textContent && items[0].t !== 'p') spec[i][0] = items[0].t;
    let at = o.s + items[0].len; b.append(items[0].frag);
    const rest = items.slice(1).map(x => { const p = document.createElement('p'); p.append(x.frag); at += 1 + x.len; return [x.t, p]; });
    spec.splice(i + 1, 0, ...rest); (rest.length ? rest[rest.length - 1][1] : b).append(tail);
    rebuild(spec); return at;
  }
  // a link on the selection; with nothing selected, on the link at the caret, or the address itself goes in, linked
  function link(o, href){
    flush();
    if (!href){ const rg = range(o); [...ed.querySelectorAll('a')].filter(a => rg.intersectsNode(a)).forEach(unwrap); tidy(); set(o); commit(o); return; }
    if (o.s !== o.e) return inline('A', href, o);
    const a = up(pointAt(o.s)[0], 'A');
    if (a){ a.setAttribute('href', href); set(o); commit(o); return; }
    const label = href.replace(/^mailto:/i, ''), end = insert(label, o);
    covered({ s:o.s, e:end }).forEach(t => wrap(t, 'A', href)); tidy(); set({ s:end, e:end }); commit(o);
  }

  /* ---- a suggestion: the text it replaces (swap) is struck through, or it goes after the selection (add). The new words
     arrive in a span the caret can't enter; Accept puts them in as plain text, Discard leaves the text as it was ---- */
  let rev = null;
  function suggest(o, kind){
    flush(); pend = null;
    const nw = document.createElement('span'); nw.className = 'rte-new'; nw.contentEditable = 'false';
    const olds = [];
    if (kind === 'swap'){
      const all = lines(), a = lineAt(o.s), z = lineAt(o.e);
      for (let i = z; i >= a; i--){
        const s = Math.max(o.s, startOf(i)), e = Math.min(o.e, startOf(i) + len(all[i])); if (e <= s) continue;
        const rg = range({ s, e }), sp = document.createElement('span'); sp.className = 'rte-old';
        sp.appendChild(rg.extractContents()); rg.insertNode(sp); olds.unshift(sp);
      }
    }
    if (olds.length) olds[olds.length - 1].after(nw); else range({ s:o.e, e:o.e }).insertNode(nw);
    rev = { o, kind, olds, nw };
    return s => { if (rev && rev.nw === nw){ const w = document.createElement('span'); w.className = 'w'; w.textContent = s; nw.appendChild(w); show(w); } };
  }
  function drop(){ if (!rev) return null; const r = rev; r.olds.forEach(unwrap); r.nw.remove(); rev = null; tidy(); return r; }
  function accept(){
    const s = rev && rev.nw.textContent; const r = drop(); if (!r) return;
    const at = insertLines(s ? s.split(/\n+/).filter(Boolean).map(l => { const frag = document.createDocumentFragment(); frag.append(l); return { t:'p', frag, len:l.length }; }) : [], r.kind === 'swap' ? r.o : { s:r.o.e, e:r.o.e });
    set({ s:at, e:at }); commit(r.o);
  }
  function discard(){ const r = drop(); if (r) set(r.o); changed(); }

  /* ---- what the browser does, routed through the edits above ---- */
  on(ed, 'beforeinput', e => {
    const t = e.inputType;
    if (rev){ e.preventDefault(); return; }
    if (t === 'historyUndo' || t === 'historyRedo'){ e.preventDefault(); t === 'historyUndo' ? undo() : redo(); return; }
    if (t.startsWith('format')){ e.preventDefault(); if (t === 'formatBold') inline('B'); else if (t === 'formatItalic') inline('I'); return; }
    if (t === 'insertParagraph' || t === 'insertLineBreak'){ e.preventDefault(); split(); return; }
    if (t === 'insertFromPaste' || t === 'insertFromDrop' || t === 'deleteByDrag' || t === 'deleteByCut') return;
    const o = get(), i = lineAt(o.s);
    if (t === 'insertText' && e.data && pend && o.s === o.e && pend.at === o.s){ e.preventDefault(); typeStyled(e.data); return; }
    if (o.s === o.e && /^delete.*Backward$/.test(t) && o.s === startOf(i)){ e.preventDefault(); flush(); joinBack(o); return; }
    if (o.s === o.e && /^delete.*Forward$/.test(t) && o.s === startOf(i) + len(lines()[i])){ e.preventDefault(); flush(); joinNext(o); return; }
    // a selection over several lines: removing it joins them, so the editor does it
    if (o.s !== o.e && i !== lineAt(o.e) && (t.startsWith('delete') || t === 'insertText' || t === 'insertReplacementText')){
      e.preventDefault(); flush(); const p = del(o); let at = p.s;
      const s = e.data || (e.dataTransfer && e.dataTransfer.getData('text/plain')) || '';
      if (s && t.startsWith('insert')) at = insert(s.replace(/\s*\n\s*/g, ' '), p);
      set({ s:at, e:at }); commit(o); return;
    }
    if (!H.dirty) H.pre = o;
  });
  on(ed, 'input', e => { if (rev) return; if (messy()) clean(); typed(H.pre); hook.input && hook.input(e); });
  on(ed, 'paste', e => {
    e.preventDefault(); if (rev || !e.clipboardData) return;
    const h = e.clipboardData.getData('text/html'), s = e.clipboardData.getData('text/plain');
    let items = h ? parse(new DOMParser().parseFromString(h, 'text/html').body, false) : [];
    if (!items.length) items = plain(s); if (!items.length) return;
    flush(); const o = get(), at = insertLines(items, o); set({ s:at, e:at }); commit(o);
  });
  on(ed, 'cut', e => {
    e.preventDefault(); if (rev || !e.clipboardData) return; const o = get(); if (o.s === o.e) return;
    const g = live(); e.clipboardData.setData('text/plain', text(o)); if (g){ const d = document.createElement('div'); d.appendChild(g.cloneContents()); e.clipboardData.setData('text/html', d.innerHTML); }
    flush(); const p = del(o); set(p); commit(o);
  });
  // a drop goes in as plain text where it lands; dragging inside the text is off, so a drag can't move half a list
  on(ed, 'dragstart', e => e.preventDefault());
  on(ed, 'drop', e => {
    e.preventDefault(); if (rev || !e.dataTransfer) return;
    const items = plain(e.dataTransfer.getData('text/plain')); if (!items.length) return;
    const p = document.caretRangeFromPoint ? document.caretRangeFromPoint(e.clientX, e.clientY) : document.caretPositionFromPoint && (pp => { const r = document.createRange(); r.setStart(pp.offsetNode, pp.offset); return r; })(document.caretPositionFromPoint(e.clientX, e.clientY));
    if (!p || !ed.contains(p.startContainer)) return;
    flush(); const at0 = offsetOf(p.startContainer, p.startOffset), at = insertLines(items, { s:at0, e:at0 }); set({ s:at, e:at }, true); commit({ s:at0, e:at0 });
  });
  on(ed, 'keydown', e => {
    if (e.isComposing || (hook.key && hook.key(e))) return;
    if (rev) return;
    const mod = /Mac|iP(hone|ad|od)/.test(navigator.platform || navigator.userAgent) ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey;
    if (!mod) return;
    const k = e.key.toLowerCase(), c = e.code;
    const act = e.altKey ? (c === 'Digit1' ? () => block('h2') : c === 'Digit0' ? () => block('p') : null)
      : e.shiftKey ? (c === 'Digit7' ? () => block('ol') : c === 'Digit8' ? () => block('ul') : c === 'Digit9' ? () => block('quote') : k === 'z' ? redo : null)
      : k === 'b' ? () => inline('B') : k === 'i' ? () => inline('I') : k === 'e' ? () => inline('CODE') : k === 'z' ? undo : k === 'y' ? redo : null;
    if (act){ e.preventDefault(); e.stopPropagation(); act(); }
  });
  on(document, 'selectionchange', () => {
    if (!live() || rev) return;
    caret = get(); if (pend && (caret.s !== pend.at || caret.e !== pend.at)) pend = null;
    hook.select && hook.select();
  });

  tidy(); H.list = [{ html:ed.innerHTML, sel:{ s:0, e:0 }, pre:null }];
  return {
    get, set, text, range, total, lines, typeOf, load, undo, redo, inline, block, split, link, suggest, accept, discard, flush,
    focus: () => set(get(), true),
    html: () => ed.innerHTML,
    reviewing: () => !!rev,
    canUndo: () => H.at > 0 || H.dirty,
    canRedo: () => H.at < H.list.length - 1,
    empty: () => { const all = lines(); return all.length === 1 && !len(all[0]) && typeOf(all[0]) === 'p'; },
    words: () => { const s = lines().map(b => b.textContent).join(' ').trim(); return s ? s.split(/\s+/).length : 0; },
    // the line around a spot, as a selection
    line: at => { const i = lineAt(at), s = startOf(i); return { s, e:s + len(lines()[i]) }; },
    // what the selection or the caret has: bold, italic, code, a link (and its address), and the lines' type when they share one
    state(){
      const o = get(), all = lines(), ts = all.slice(lineAt(o.s), lineAt(o.e) + 1).map(typeOf), g = live();
      const a = up(o.s === o.e && g ? g.startContainer : pointAt(o.s, o.s !== o.e)[0], 'A');
      return { B:has('B', o), I:has('I', o), CODE:has('CODE', o), A:o.s === o.e ? !!a : has('A', o), href:a ? a.getAttribute('href') : null, block:ts.every(t => t === ts[0]) ? ts[0] : null };
    },
    // removes some text, as one step of the history
    remove(o){ flush(); set(del(o)); commit(o); },
    // text typed at the caret, as a person would: for a story, which leaves the page's focus where it is
    type(s){ const o = get(); flush(); const at = insert(s, o); set({ s:at, e:at }); typed(o); show(range({ s:at, e:at })); },
    show: o => show(range(o)),
    destroy(){ clearTimeout(H.t); offs.forEach(f => f()); }
  };
}
/* a stand-in for the agent, so the preview works on its own: canned rewrites for the story's draft, and simple rules for
   anything else. In your product, call your model where the component calls this */
const RTE_CANNED = {
  "We know pricing changes can feel like a lot, so we want to make sure everyone has plenty of time to look at the new plans and ask us questions before anything changes.":
    { shorter:"We're giving everyone time to review the new plans and ask questions before anything changes.", improve:'Pricing changes can feel like a lot, so everyone gets plenty of time to review the new plans and ask questions before anything changes.' },
  'New pricing goes live on March 3.':{ improve:'Our new pricing goes live on March 3.', shorter:'New pricing starts March 3.' },
  'Starter teams get two more seats for free, and every plan now includes the agent.':{ improve:'Starter teams get two extra seats at no cost, and every plan now includes the agent.', shorter:'Starter teams get two free seats, and every plan includes the agent.' }
};
function rteWrite(action, text, doc){
  const TYPO = { teh:'the', recieve:'receive', seperate:'separate', definately:'definitely', alot:'a lot', dont:"don't", cant:"can't", wont:"won't", im:"I'm", ive:"I've", thier:'their', untill:'until', occured:'occurred', wich:'which', becuase:'because', youre:"you're", doesnt:"doesn't", isnt:"isn't", tommorow:'tomorrow', accross:'across' };
  const fix = s => s.replace(/[ \t]{2,}/g, ' ').replace(/\s+([,.!?;:])/g, '$1').replace(/\bi\b/g, 'I')
    .replace(/\b[a-z]+\b/gi, w => { const f = TYPO[w.toLowerCase()]; return f ? (w[0] === w[0].toUpperCase() ? f[0].toUpperCase() + f.slice(1) : f) : w; })
    .replace(/(^|[.!?]\s+)([a-z])/g, (m, a, b) => a + b.toUpperCase()).replace(/([a-z0-9])\s*$/i, (m, a) => s.trim().split(/\s+/).length > 3 ? a + '.' : m);
  // sentences end at . ! or ? before a space, so a file name like plan.yaml stays in one
  const sentences = s => s.match(/[^]*?(?:[.!?]+(?=\s|$)|$)\s*/g).filter(Boolean);
  const canned = s => { const k = s.trim(), hit = RTE_CANNED[k] && RTE_CANNED[k][action]; return hit ? s.replace(k, hit) : null; };
  if (action === 'continue'){
    const next = /pric|plan|seat|launch/i.test(doc)
      ? ['Current customers keep their price until their next renewal, and every admin gets an email that sums up what changes for their team.', 'If anything is unclear, reply to this email and we will walk you through it.']
      : ['Next, we will share a short summary so everyone knows what changes and when.', 'Reply with any questions and we will get back to you within a day.'];
    return next.find(x => !doc.includes(x)) || next[next.length - 1];
  }
  if (action === 'grammar') return fix(text);
  const FILLER = [[/\b(really|very|just|actually|basically|quite|simply|definitely|certainly|literally|totally)\s+/gi, ''], [/\bin order to\b/gi, 'to'], [/\bmake sure (that )?/gi, 'ensure '], [/\bdue to the fact that\b/gi, 'because'], [/\bat this point in time\b/gi, 'now'], [/\ba lot of\b/gi, 'many'], [/\bplenty of\b/gi, 'enough'], [/\bis able to\b/gi, 'can']];
  const BETTER = [[/\bwe will\b/gi, "we'll"], [/\bwe are\b/gi, "we're"], [/\bit is\b/gi, "it's"], [/\bdo not\b/gi, "don't"], [/\bcannot\b/gi, "can't"], [/\bvery important\b/gi, 'essential'], [/\bgood\b/gi, 'strong'], [/\bbig\b/gi, 'major'], [/\bstuff\b/gi, 'details'], [/\bkind of\s+/gi, ''], [/\bat no extra cost\b/gi, 'free']];
  const rules = (s, list) => list.reduce((x, [a, b]) => x.replace(a, b), s);
  return sentences(text).map(s => {
    const hit = canned(s); if (hit) return hit;
    let x = fix(rules(s, action === 'shorter' ? FILLER : [...FILLER.slice(0, 2), ...BETTER]));
    // a long sentence that is still long keeps its main clause
    if (action === 'shorter' && x.trim().length > 60 && x.length > s.length * .85 && x.includes(', ')) x = x.slice(0, x.indexOf(', ')) + '.' + (/\s$/.test(s) ? ' ' : '');
    return x;
  }).join('');
}
DM.def('rich-text-editor', (r, c) => {
  const MAC = /Mac|iP(hone|ad|od)/.test(navigator.platform || navigator.userAgent);
  const KEY = { mod:MAC ? '⌘' : 'Ctrl', alt:MAC ? '⌥' : 'Alt', shift:MAC ? '⇧' : 'Shift' };
  const keys = k => k === 'redo' ? (MAC ? '⇧⌘Z' : 'Ctrl+Y') : k.split(' ').map(x => KEY[x] || x).join(MAC ? '' : '+');
  const IC = { heading:I('heading', ''), bold:I('bold', ''), italic:I('italic', ''), code:I('code', ''), link:I('link', ''), list:I('list', ''), listol:I('list-ol', ''), quote:I('quote', ''), spark:I('spark'), undo:I('undo'), redo:I('redo'), wand:I('wand'), minus:I('minus'), check:I('check'), edit:I('edit'), trash:I('trash') };
  r.innerHTML = r.innerHTML.replace(/\{(\w+)\}/g, (m, k) => IC[k] || m);
  $$('[data-k]', r).forEach(b => b.dataset.tipK = keys(b.dataset.k));
  const root = $('.rte', r), tb = $('.rte-tb', r), ed = $('.rte-body', r), wc = $('.rte-wc', r), live = $('.rte-live', r), st = $('.rte-st', r);
  const menu = $('.rte-menu', r), ask = $('.rte-ask', r), aiB = $('.rte-ai', r), lnk = $('.rte-lnk', r), url = $('.rte-url', r), linkB = $('[data-f="a"]', tb);
  const okB = $('.rte-ok', r), noB = $('.rte-no', r), unB = $('.rte-un', r), reB = $('.rte-re', r);
  const uid = Math.random().toString(36).slice(2, 7), ph = $('.ph', menu); ph.id = 'rte-ph-' + uid; menu.setAttribute('aria-labelledby', ph.id);
  const ACT = { improve:'Improve writing', shorter:'Make shorter', grammar:'Fix grammar', continue:'Continue writing' };
  // the selection a menu or the link field is for stays marked while the focus is in them
  const HL = window.CSS && CSS.highlights && window.Highlight ? (CSS.highlights.get('rte-pick') || (h => (CSS.highlights.set('rte-pick', h), h))(new Highlight())) : null;
  let picked = null;
  const pick = o => { if (!HL) return; if (picked) HL.delete(picked); picked = o && o.s !== o.e ? E.range(o) : null; if (picked) HL.add(picked); };
  c.offs.push(() => pick(null));
  const say = t => { live.textContent = ''; c.later(60, () => { live.textContent = t; }); };
  let job = null, lk = null, rv = null;

  // the toolbar, the word count and undo follow the text and the selection
  function paint(){
    const s = E.state(), busy = E.reviewing();
    $$('.rte-b', tb).forEach(b => { b.disabled = busy; const f = b.dataset.f;
      if (f === 'a') b.classList.toggle('on', !busy && s.A); else b.setAttribute('aria-pressed', String(!busy && (/^(h2|ul|ol|quote)$/.test(f) ? s.block === f : !!s[f.toUpperCase()]))); });
    aiB.disabled = busy; unB.disabled = busy || !E.canUndo(); reB.disabled = busy || !E.canRedo();
    if (!busy){ const n = E.words(); wc.textContent = n === 1 ? '1 word' : n + ' words'; }
    ed.classList.toggle('empty', !busy && E.empty());
  }
  // a popover sits under the text it is for, or over it when there is no room under it, always inside the editor
  // (the bubble goes over the selection's first line; a menu under its last line, or over its first when there's no room)
  function place(el, o, above){
    const b = root.getBoundingClientRect(), w = el.offsetWidth, h = el.offsetHeight, top = tb.offsetHeight - 2, [f, l] = rectsOf(o);
    const over = f.top - b.top - h - 6, under = l.bottom - b.top + 6;
    const y = above ? (over >= top ? over : under) : under + h <= b.height - 4 || over < top ? under : over;
    el.style.left = Math.round(Math.max(6, Math.min((above ? f : l).left - b.left - (above ? 0 : 8), b.width - w - 6))) + 'px';
    el.style.top = Math.round(Math.max(4, Math.min(y, b.height - h - 4))) + 'px';
  }
  // the first and last line boxes of a selection, or the caret's line
  const rectsOf = o => {
    const rs = [...E.range(o).getClientRects()].filter(x => x.width || x.height);
    if (rs.length) return [rs[0], rs[rs.length - 1]];
    const n = E.range(E.line(o.s)).startContainer, el = n.nodeType === 3 ? n.parentElement : n, rr = el.getBoundingClientRect();
    return [rr, rr];
  };
  // the small Ask AI button over a selection made with the mouse or the keys
  function bubble(o){
    const g = getSelection(), sel = o || (document.activeElement === ed && g.rangeCount && !g.isCollapsed ? E.get() : null);
    if (!sel || E.reviewing() || job || lk || !E.text(sel).trim()){ ask.classList.remove('show'); return; }
    place(ask, sel, true); ask.classList.add('show');
  }
  const E = rteEngine(ed, {
    change(){ paint(); },
    select(){ paint(); bubble(); },
    // a / typed at the start of a line opens the menu
    input(e){ if (e.inputType === 'insertText' && e.data === '/'){ const o = E.get(); if (o.s === o.e && E.line(o.s).s === o.s - 1) openMenu('slash'); } },
    key(e){
      if (E.reviewing()){
        if ((e.key === 'Tab' || e.key === 'Enter') && !e.shiftKey && !e.altKey && !e.metaKey && !e.ctrlKey){ e.preventDefault(); accept(true); return true; }
        if (e.key === 'Escape' || ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z')){ e.preventDefault(); e.stopPropagation(); discard(true); return true; }
        return false;
      }
      const mod = MAC ? e.metaKey && !e.ctrlKey : e.ctrlKey && !e.metaKey, k = e.key.toLowerCase();
      if (mod && !e.altKey && !e.shiftKey && (k === 'k' || k === 'j')){ e.preventDefault(); e.stopPropagation(); k === 'k' ? openLink(true) : openMenu('key'); return true; }
      if (e.key === 'Escape' && ask.classList.contains('show')){ ask.classList.remove('show'); e.stopPropagation(); return true; }
      return false;
    }
  });
  c.offs.push(() => E.destroy());

  /* ---- the toolbar: one tab stop, the arrow keys move along it; a click keeps the focus and the selection in the text ---- */
  const tbs = () => $$('button', tb).filter(b => !b.disabled);
  $$('button', tb).forEach((b, i) => b.tabIndex = i ? -1 : 0);
  c.on(tb, 'mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
  c.on(tb, 'focusin', e => { if (e.target.matches('button')) $$('button', tb).forEach(b => b.tabIndex = b === e.target ? 0 : -1); });
  c.on(tb, 'keydown', e => {
    const all = tbs(), i = all.indexOf(document.activeElement); if (i < 0) return;
    const go = { ArrowRight:all[(i + 1) % all.length], ArrowLeft:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); go.focus(); }
  });
  $$('.rte-b', tb).forEach(b => b.addEventListener('click', e => {
    const f = b.dataset.f; if (E.reviewing()) return;
    if (f === 'a') return lk ? closeLink(true) : openLink(e.isTrusted, e.isTrusted && !e.detail);
    if (/^(b|i|code)$/.test(f)) E.inline(f.toUpperCase()); else E.block(f);
    if (e.isTrusted) E.focus();
  }));
  // undo and redo in the foot
  c.on($('.rte-idle', r), 'mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
  unB.onclick = e => { E.undo(); if (e.isTrusted) E.focus(); };
  reB.onclick = e => { E.redo(); if (e.isTrusted) E.focus(); };

  /* ---- the AI menu: a menu of actions on the selection, or on the line the caret is in ---- */
  function openMenu(how){
    if (E.reviewing()) return; closeLink(false); E.flush();
    if (job) return closeMenu(how !== 'story');
    const o = E.get(), slash = how === 'slash' ? o.s - 1 : null, sel = o.s !== o.e;
    let t = sel ? o : E.line(o.s); if (slash !== null) t = { s:slash + 1, e:t.e };
    const has = !!E.text(t).trim();
    // opened from its button with the keyboard, Escape gives the focus back to the button; opened from the text, to the text
    job = { o, t, slash, sel, btn:how === 'button' };
    ph.textContent = sel ? 'Edit the selection' : has ? 'Edit this paragraph' : 'Write with AI';
    $$('.mi', menu).forEach(m => { m.setAttribute('aria-disabled', String(m.dataset.a !== 'continue' && !has)); m.tabIndex = -1; m.classList.remove('hl'); });
    ask.classList.remove('show'); pick(sel ? o : null);
    hideTip(); place(menu, o); menu.classList.add('open'); menu.inert = false; aiB.setAttribute('aria-expanded', 'true');
    if (how !== 'story') item(items()[0]);
  }
  function closeMenu(back){
    if (!job) return; const j = job; job = null;
    menu.classList.remove('open'); menu.inert = true; aiB.setAttribute('aria-expanded', 'false'); pick(null);
    if (back && j.btn){ E.set(j.o); aiB.focus({ preventScroll:true }); } else if (back) E.set(j.o, true);
  }
  menu.inert = true;
  const items = () => $$('.mi', menu).filter(m => m.getAttribute('aria-disabled') !== 'true');
  const item = m => { if (!m) return; $$('.mi', menu).forEach(x => x.tabIndex = x === m ? 0 : -1); m.focus({ preventScroll:true }); };
  // the arrow keys move and wrap, Home and End jump, a letter jumps to the item it starts, Escape and Tab go back to the text
  c.on(menu, 'keydown', e => {
    const all = items(), i = all.indexOf(document.activeElement);
    const go = { ArrowDown:all[(i + 1) % all.length], ArrowUp:all[(i - 1 + all.length) % all.length], Home:all[0], End:all[all.length - 1] }[e.key];
    if (go){ e.preventDefault(); item(go); }
    else if (e.key === 'Escape' || e.key === 'Tab'){ e.preventDefault(); e.stopPropagation(); closeMenu(true); }
    else if (e.key.length === 1 && /\S/.test(e.key) && !e.metaKey && !e.ctrlKey){ const k = e.key.toLowerCase(), hit = [...all.slice(i + 1), ...all.slice(0, i + 1)].find(m => m.textContent.trim().toLowerCase().startsWith(k)); if (hit) item(hit); }
  });
  c.on(menu, 'mousedown', e => e.preventDefault());
  $$('.mi', menu).forEach(m => m.addEventListener('click', e => { if (m.getAttribute('aria-disabled') !== 'true') run(m.dataset.a, e.isTrusted); }));
  aiB.addEventListener('click', e => openMenu(e.isTrusted ? (e.detail ? 'click' : 'button') : 'story'));
  c.on(ask, 'mousedown', e => e.preventDefault());
  ask.addEventListener('click', e => openMenu(e.isTrusted ? 'click' : 'story'));
  c.on(document, 'pointerdown', e => {
    if (job && !menu.contains(e.target) && !aiB.contains(e.target) && !ask.contains(e.target)) closeMenu(false);
    if (lk && !lnk.contains(e.target) && !linkB.contains(e.target)) closeLink(false);
    if (e.isTrusted && !ask.contains(e.target) && !job) ask.classList.remove('show');
  });
  c.on(window, 'resize', e => { if (!e.isTrusted) return; closeMenu(false); closeLink(false); ask.classList.remove('show'); });

  /* ---- a suggestion streams in; Accept (Tab or Enter) keeps it, Discard (Esc) leaves the text as it was ---- */
  function run(a, mine){
    const j = job; closeMenu(false); if (!j || E.reviewing()) return;
    let t = j.t, end = j.o.e;
    // the / that opened the menu goes, and what comes after it moves back one
    if (j.slash !== null){ E.remove({ s:j.slash, e:j.slash + 1 }); const back = x => x > j.slash ? x - 1 : x; t = { s:back(t.s), e:back(t.e) }; end = back(end); }
    const kind = a === 'continue' ? 'add' : 'swap';
    if (kind === 'add') t = { s:end, e:end };
    const doc = E.text({ s:0, e:E.total() }), before = E.text({ s:0, e:t.s }), said = E.text(t);
    let out = rteWrite(a, said, doc);
    if (kind === 'add' && before && !/\s$/.test(before)) out = ' ' + out;
    const write = E.suggest(t, kind), token = rv = { a, ready:false };
    root.dataset.st = 'review'; okB.disabled = true; paint(); ask.classList.remove('show');
    st.innerHTML = `<span class="think on" aria-hidden="true"><i></i><i></i><i></i><i></i></span><span class="shim">${ACT[a]}</span>`;
    say(`${ACT[a]}: writing a suggestion`);
    if (mine) E.focus();
    c.run(async () => {
      if (REDUCE) write(out);
      else { await c.wait(450); for (const w of out.match(/\S+\s*|\s+/g) || []){ if (rv !== token) return; write(w); await c.wait(48); } }
      if (rv !== token) return;
      token.ready = true; okB.disabled = false;
      st.innerHTML = `${I('spark')}<span>Suggestion ready</span>`;
      const said = out.trim(); say(`Suggestion: ${said}${/[.!?]$/.test(said) ? '' : '.'} Press Tab or Enter to accept, or Escape to discard.`);
    });
  }
  function accept(mine){ if (!rv || !rv.ready) return; rv = null; E.accept(); root.dataset.st = 'edit'; paint(); say('Suggestion accepted'); if (mine) E.focus(); }
  function discard(mine){ if (!E.reviewing()) return; rv = null; E.discard(); root.dataset.st = 'edit'; paint(); say('Suggestion discarded'); if (mine) E.focus(); }
  c.on($('.rte-rev', r), 'mousedown', e => { if (e.target.closest('button')) e.preventDefault(); });
  okB.addEventListener('click', e => accept(e.isTrusted));
  noB.addEventListener('click', e => discard(e.isTrusted));
  c.on(root, 'keydown', e => { if (e.key === 'Escape' && E.reviewing() && !ed.contains(e.target)){ e.preventDefault(); e.stopPropagation(); discard(true); } });

  /* ---- the link field ---- */
  lnk.inert = true;
  const toUrl = v => { v = v.trim(); if (!v) return null; if (/^(https?:\/\/|mailto:)/i.test(v)) return v; if (/^[^\s@/]+@[^\s@]+\.[^\s@]+$/.test(v)) return 'mailto:' + v; if (/^[\w-]+(\.[\w-]+)+(:\d+)?([/?#]\S*)?$/.test(v)) return 'https://' + v; return null; };
  function openLink(mine, btn){
    if (E.reviewing()) return; closeMenu(false); E.flush();
    const o = E.get(), s = E.state(); lk = { o, btn };
    url.value = s.href || ''; url.removeAttribute('aria-invalid'); $('.rte-lrm', lnk).hidden = !s.href;
    ask.classList.remove('show'); pick(o); hideTip();
    place(lnk, o); lnk.classList.add('open'); lnk.inert = false; linkB.setAttribute('aria-expanded', 'true');
    if (mine) url.focus({ preventScroll:true });
  }
  function closeLink(back){
    if (!lk) return; const j = lk; lk = null;
    lnk.classList.remove('open'); lnk.inert = true; linkB.setAttribute('aria-expanded', 'false'); pick(null);
    if (back && j.btn){ E.set(j.o); linkB.focus({ preventScroll:true }); } else if (back) E.set(j.o, true);
  }
  function applyLink(){
    if (!lk) return; const h = toUrl(url.value);
    if (!h){ url.setAttribute('aria-invalid', 'true'); url.focus({ preventScroll:true }); return; }
    const o = lk.o; closeLink(false); E.set(o); E.link(o, h); E.focus();
  }
  $('.rte-lok', lnk).onclick = applyLink;
  $('.rte-lrm', lnk).onclick = () => { if (!lk) return; const o = lk.o; closeLink(false); E.set(o); E.link(o, null); E.focus(); };
  c.on(url, 'input', () => url.removeAttribute('aria-invalid'));
  // Tab past its last button leaves the field, and it closes
  c.on(lnk, 'focusout', e => { if (lk && e.relatedTarget && !lnk.contains(e.relatedTarget)) closeLink(false); });
  c.on(lnk, 'keydown', e => { if (e.key === 'Enter' && e.target === url){ e.preventDefault(); applyLink(); } else if (e.key === 'Escape'){ e.preventDefault(); e.stopPropagation(); closeLink(true); } });
  paint();

  // the preview's story: a heading and a short draft about the pricing launch, then the last sentence is picked and made
  // shorter; the suggestion streams in and is accepted. A click or a key of yours takes over, and the editor is yours
  const DRAFT = 'New pricing goes live on March 3. Starter teams get two more seats for free, and every plan now includes the agent. We know pricing changes can feel like a lot, so we want to make sure everyone has plenty of time to look at the new plans and ask us questions before anything changes.';
  const LAST = DRAFT.slice(DRAFT.indexOf('We know'));
  c.on(r, 'pointerdown', e => { if (e.isTrusted && !job) pick(null); }, true);
  if (r === c.st) c.story(async s => {
    const type = async t => { for (const w of t.match(/\S+\s*/g)){ E.type(w); await s.beat(.24); } };
    await s.beat(3);
    await s.tap($('[data-f="h2"]', tb)); s.away();
    await type('Pricing launch'); await s.beat(1);
    E.split(); await s.beat(.5);
    await type(DRAFT); await s.beat(3);
    const at = E.text({ s:0, e:E.total() }).indexOf(LAST), o = { s:at, e:at + LAST.length };
    E.set(o); E.show(o); pick(o); bubble(o); await s.beat(2);
    await s.tap(ask); await s.beat(2);
    const it = $('.mi[data-a="shorter"]', menu); it.classList.add('hl'); await s.point(it); await s.beat(1);
    await s.tap(it); s.away();
    await s.until(() => rv && rv.ready); await s.beat(4);
    await s.tap(okB); s.away(); await s.beat(3);
  });
});
