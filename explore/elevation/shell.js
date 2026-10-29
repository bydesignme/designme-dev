(function () {
  function setTheme(frame, theme) {
    frame.dataset.theme = theme;
    const b = frame.querySelector('.theme');
    if (!b) return;
    const dark = theme === 'dark';
    b.textContent = dark ? 'Light' : 'Dark';
    b.setAttribute('aria-pressed', String(dark));
    try { localStorage.setItem('elev-' + frame.dataset.id, theme); } catch (e) {}
  }
  document.querySelectorAll('.frame').forEach(frame => {
    let saved = null;
    try { saved = localStorage.getItem('elev-' + frame.dataset.id); } catch (e) {}
    setTheme(frame, saved === 'dark' ? 'dark' : 'light');
    frame.querySelector('.theme').addEventListener('click', () => {
      setTheme(frame, frame.dataset.theme === 'dark' ? 'light' : 'dark');
    });
  });
  document.getElementById('all-light')?.addEventListener('click', () => {
    document.querySelectorAll('.frame').forEach(f => setTheme(f, 'light'));
  });
  document.getElementById('all-dark')?.addEventListener('click', () => {
    document.querySelectorAll('.frame').forEach(f => setTheme(f, 'dark'));
  });

  const name = document.body.dataset.component;
  if (!name || !window.ELEV || !ELEV[name]) return;
  document.querySelectorAll('.stage').forEach(stage => {
    const fn = ELEV[name][stage.dataset.slot];
    if (!fn) return;
    const go = () => {
      stage._kill?.();
      stage.innerHTML = '';
      const host = document.createElement('div');
      host.className = 'stage-in';
      stage.appendChild(host);
      const ctrl = ELEV.ctrl(stage);
      fn(host, ctrl).catch(err => { if (!err || err.message !== 'dead') console.error(err); });
    };
    go();
    stage.closest('.frame').querySelector('[data-replay]')?.addEventListener('click', go);
  });
})();
