/* Shareable style and theme links (owner, 26 Nov: "tag the style that's being used, so when I share it with someone, I can
   choose whether they're going to see Blueprint, Soft, or Clean").

   One inline script for the head of every site page (the landing page, docs, component pages, templates, the library and
   404), placed right before the script that applies the saved style and theme, so a linked style is on before the page
   paints:
   - ?style=blueprint|bp|soft|clean and ?theme=light|dark are kept as the visitor's pick (dmui-style, dmui-theme), exactly as
     the header switch keeps them: a theme that matches the device is stored as following the device. Other values are
     ignored. The attributes are set here too, so the link works where storage is blocked.
   - Once the page has loaded (so the saved pick going on doesn't count), when the style or the theme changes on <html> (the
     header switch, the landing's own switches, the library's), the address bar follows with history.replaceState, keeping the path, the other parameters and the hash:
     style as blueprint, soft or clean, and theme only once one is picked. Copying the address shares what the visitor sees. */
const JS = `try{(function(){var r=document.documentElement,mq=matchMedia('(prefers-color-scheme: dark)'),q=new URLSearchParams(location.search),s=(q.get('style')||'').toLowerCase(),t=(q.get('theme')||'').toLowerCase();if(s==='blueprint')s='bp';if(s==='bp'||s==='soft'||s==='clean'){if(s==='bp')r.removeAttribute('data-style');else r.setAttribute('data-style',s);try{localStorage.setItem('dmui-style',s)}catch(e){}}if(t==='light'||t==='dark'){var sys=mq.matches?'dark':'light';if(t===sys)r.removeAttribute('data-theme');else r.setAttribute('data-theme',t);try{if(t===sys)localStorage.removeItem('dmui-theme');else localStorage.setItem('dmui-theme',t)}catch(e){}}var put=function(k,v){try{var u=new URL(location.href);if(u.searchParams.get(k)===v)return;u.searchParams.set(k,v);history.replaceState(history.state,'',u.href)}catch(e){}};var watch=function(){new MutationObserver(function(ms){ms.forEach(function(m){if(m.attributeName==='data-style'){var v=r.getAttribute('data-style');put('style',v==='clean'?'clean':v==='soft'?'soft':'blueprint')}else if(m.attributeName==='data-theme')put('theme',r.getAttribute('data-theme')||(mq.matches?'dark':'light'))})}).observe(r,{attributes:true,attributeFilter:['data-style','data-theme']})};if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',watch);else watch()})()}catch(e){}`;

module.exports = { JS };
