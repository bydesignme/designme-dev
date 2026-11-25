/* Delegate 3a / 3b lab shell: the style and theme switch (stored as dmui-style / dmui-theme like the site, and read from
   ?style=bp|soft|clean&theme=light|dark) and Animate, which mounts the component again from the start. The style and theme
   are first set by the inline script in <head>, before anything paints. */
(function(){
  const root = document.documentElement;
  const card = document.querySelector('.dl3-card');
  const get = k => { try { return localStorage.getItem(k); } catch(e){ return null; } };
  const put = (k, v) => { try { localStorage.setItem(k, v); } catch(e){} };
  const style = () => root.getAttribute('data-style') === 'soft' ? 'soft' : root.getAttribute('data-style') === 'clean' ? 'clean' : 'bp';
  const theme = () => root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
  const mark = () => {
    document.querySelectorAll('[data-dl3-style]').forEach(b => b.setAttribute('aria-pressed', b.dataset.dl3Style === style()));
    document.querySelectorAll('[data-dl3-theme]').forEach(b => b.setAttribute('aria-pressed', b.dataset.dl3Theme === theme()));
  };
  const remount = () => { if (card && card._c && typeof DM !== 'undefined') DM.mount(card); };
  document.addEventListener('click', e => {
    const s = e.target.closest('[data-dl3-style]'), t = e.target.closest('[data-dl3-theme]'), a = e.target.closest('.dl3-again');
    if (s){ root.setAttribute('data-style', s.dataset.dl3Style); put('dmui-style', s.dataset.dl3Style); mark(); remount(); }
    if (t){ root.setAttribute('data-theme', t.dataset.dl3Theme); put('dmui-theme', t.dataset.dl3Theme); mark(); remount(); }
    if (a && card && typeof DM !== 'undefined') DM.mount(card);
  });
  mark();
  void get;
})();
