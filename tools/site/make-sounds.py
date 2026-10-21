# Builds the site's sounds from recordings in sounds-src (Kenney's Interface Sounds and UI Audio packs, both CC0):
#   ../../sounds/ui.wav    every sound the site plays, one after another in one file, fetched once someone turns sound on
#   ../../sounds/ui.json   where each sound starts in that file, how long it lasts, and how loud it plays
#   ../../lab/sounds.html  a page to hear each sound beside the alternatives, with ../../lab/sounds/*.mp3
# usage (from tools/site): python3 make-sounds.py            needs ffmpeg and numpy
# To swap a sound, change its file in SET (the alternatives in LAB are all in sounds-src) and run this again.
import json, os, subprocess, wave, html
import numpy as np

HERE = os.path.dirname(os.path.abspath(__file__))
SRC, ROOT = os.path.join(HERE, 'sounds-src'), os.path.abspath(os.path.join(HERE, '../..'))
SR = 44100

# what each sound is for, the recording it uses, and how loud it plays, as a level in dB: the quieter, the more often it plays
SET = {
  'hover':  ('if-tick_002', -40, 'Moving onto something you can click'),
  'click':  ('if-click_002', -31, 'Clicking a button, a row or a link'),
  'tab':    ('if-select_001', -32, 'Switching a tab or a segment'),
  'tick':   ('if-tick_004', -36, 'A small step: a saved item removed, a size changed'),
  'on':     ('ui-switch20', -30, 'A switch or a checkbox turned on'),
  'off':    ('ui-switch21', -30, 'A switch or a checkbox turned off'),
  'select': ('if-drop_001', -31, 'Picking a colour'),
  'pop':    ('if-drop_004', -30, 'Saving a component'),
  'open':   ('if-maximize_007', -33, 'Opening a component page or the code'),
  'close':  ('if-back_002', -33, 'Closing it again'),
  'copy':   ('if-glass_005', -31, 'Copying code or a command'),
  'send':   ('if-back_001', -31, 'Sending a message'),
  'done':   ('if-confirmation_003', -31, 'Something finished'),
  'fail':   ('if-error_008', -31, 'Something went wrong'),
  'stream': ('if-tick_001', -46, 'Text streaming in, very quietly'),
}
# the alternatives the lab page offers for each sound (the one in use comes first)
LAB = [
  ('hover', ['if-tick_002', 'ui-rollover3', 'ui-switch13', 'if-tick_001']),
  ('click', ['if-click_002', 'if-click_001', 'ui-click3', 'ui-mouseclick1']),
  ('tab', ['if-select_001', 'if-select_002', 'ui-switch26', 'if-toggle_004']),
  ('on', ['ui-switch20', 'ui-switch35', 'ui-switch22', 'if-toggle_003']),
  ('off', ['ui-switch21', 'ui-switch36', 'ui-switch23', 'if-toggle_004']),
  ('pop', ['if-drop_004', 'if-drop_002', 'if-pluck_001', 'if-drop_001']),
  ('open', ['if-maximize_007', 'if-maximize_009', 'ui-rollover1', 'if-open_002']),
  ('close', ['if-back_002', 'if-back_004', 'if-minimize_002', 'if-close_002']),
  ('copy', ['if-glass_005', 'if-glass_002', 'if-pluck_002', 'if-select_007']),
  ('send', ['if-back_001', 'if-drop_001', 'if-select_002', 'if-maximize_009']),
  ('done', ['if-confirmation_003', 'if-confirmation_001', 'if-glass_001', 'if-confirmation_002']),
  ('fail', ['if-error_008', 'if-error_004', 'if-error_002', 'if-error_006']),
]

def load(name):
  raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(SRC, name + '.ogg'), '-f', 's16le', '-ac', '1', '-ar', str(SR), '-'],
                       capture_output=True, check=True).stdout
  x = np.frombuffer(raw, dtype=np.int16).astype(np.float64) / 32768
  # from just before it starts to where it has faded 50 dB, with a short fade so it never ends on a click
  a = np.abs(x); pk = a.max()
  on = np.where(a > pk * 0.01)[0]
  start, end = max(0, on[0] - SR // 1000), on[-1] + 1
  tail = np.where(a[:end] > pk * 10 ** (-50 / 20))[0]
  end = min(len(x), tail[-1] + 1 + SR // 200)
  x = x[start:end].copy()
  fade = min(len(x) // 3, int(SR * .008)); x[-fade:] *= np.linspace(1, 0, fade)
  return x

def level(x, db):
  # the gain that brings the loud part of the sound to this level, without letting its peak pass -1 dB
  loud = x[np.abs(x) > np.abs(x).max() * .05]
  rms = np.sqrt((loud ** 2).mean())
  return round(float(min(10 ** (db / 20) / rms, .89 / np.abs(x).max())), 4)

def wav(path, x):
  os.makedirs(os.path.dirname(path), exist_ok=True)
  with wave.open(path, 'wb') as w:
    w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((np.clip(x, -1, 1) * 32767).astype('<i2').tobytes())

# ---- the site's sounds: one file, and where each one sits in it ----
gap = np.zeros(int(SR * .03)); parts, out, pos = [], {}, 0
for role, (name, db, _) in SET.items():
  x = load(name)
  out[role] = [round(pos / SR, 5), round(len(x) / SR, 5), level(x, db)]
  parts += [x, gap]; pos += len(x) + len(gap)
wav(os.path.join(ROOT, 'sounds', 'ui.wav'), np.concatenate(parts))
json.dump(out, open(os.path.join(ROOT, 'sounds', 'ui.json'), 'w'), separators=(',', ':'))
print('sounds/ui.wav', round(pos / SR, 2), 's,', os.path.getsize(os.path.join(ROOT, 'sounds', 'ui.wav')) // 1024, 'KB')

# ---- the lab page: every alternative as a small mp3, played at the level its sound uses on the site ----
LABDIR = os.path.join(ROOT, 'lab', 'sounds')
os.makedirs(LABDIR, exist_ok=True)
for f in os.listdir(LABDIR):
  if f.endswith('.mp3'): os.remove(os.path.join(LABDIR, f))
rows = []
for role, names in LAB:
  db, what = SET[role][1], SET[role][2]
  btns = []
  for i, name in enumerate(names):
    x = load(name); g = level(x, db)
    tmp = os.path.join(LABDIR, name + '.wav'); wav(tmp, x)
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', tmp, '-codec:a', 'libmp3lame', '-b:a', '96k', os.path.join(LABDIR, name + '.mp3')], check=True)
    os.remove(tmp)
    used = name == SET[role][0]
    btns.append(f'<button class="s{" on" if used else ""}" data-src="sounds/{name}.mp3" data-gain="{min(1, g * 1.6):.3f}">'
                f'<span class="n">{html.escape(name)}</span><span class="m">{round(len(x) / SR * 1000)} ms{" · in use" if used else ""}</span></button>')
  rows.append(f'<section><div class="h"><h2>{role}</h2><p>{html.escape(what)}</p></div><div class="g">{"".join(btns)}</div></section>')

page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Sound lab</title><meta name="robots" content="noindex">
<style>
:root{{--bg:#fff;--fg:#171717;--dim:#737373;--stage:#fafafa;--chip:#f0f0f0;--line:#e8e8e8;--on:#171717;--on-fg:#fff}}
@media (prefers-color-scheme:dark){{:root{{--bg:#111;--fg:#f2f2f4;--dim:#8a8a93;--stage:#1a1a1c;--chip:#242427;--line:#2a2a2e;--on:#f2f2f4;--on-fg:#111}}}}
*{{box-sizing:border-box}}
body{{margin:0;background:var(--bg);color:var(--fg);font:14px/1.5 Inter,ui-sans-serif,system-ui,-apple-system,"Segoe UI",sans-serif;-webkit-font-smoothing:antialiased}}
main{{max-width:880px;margin:0 auto;padding:56px 16px 80px}}
h1{{margin:0;font-size:26px;font-weight:600;letter-spacing:-.02em}}
.lead{{margin:8px 0 32px;color:var(--dim);max-width:620px}}
section{{display:grid;grid-template-columns:180px 1fr;gap:16px;padding:18px 0;border-top:1px solid var(--line)}}
@media (max-width:640px){{section{{grid-template-columns:1fr;gap:8px}}}}
h2{{margin:0;font-size:14px;font-weight:600;text-transform:capitalize}}
.h p{{margin:2px 0 0;color:var(--dim);font-size:12.5px}}
.g{{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px}}
.s{{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 12px;border:0;border-radius:12px;background:var(--stage);color:inherit;font:inherit;text-align:left;cursor:pointer;transition:background .2s,box-shadow .2s}}
.s:hover{{background:var(--chip)}}
.s.on{{box-shadow:inset 0 0 0 1.5px var(--fg)}}
.s.play{{background:var(--chip)}}
.n{{font-size:13px;font-weight:500}}
.m{{font-size:11.5px;color:var(--dim)}}
.foot{{margin-top:32px;color:var(--dim);font-size:12.5px}}
a{{color:inherit}}
</style></head><body><main>
<h1>Sound lab</h1>
<p class="lead">Every sound the site plays, recorded rather than synthesised, beside a few alternatives. Click one to hear it at the level it plays on the site. The outlined one in each row is in use.</p>
{"".join(rows)}
<p class="foot">Recordings from Kenney's <a href="https://kenney.nl/assets/interface-sounds">Interface Sounds</a> and <a href="https://kenney.nl/assets/ui-audio">UI Audio</a>, CC0. <a href="/">Back to designme.dev</a></p>
</main>
<script>
document.addEventListener('click', e => {{
  const b = e.target.closest('.s'); if (!b) return;
  const a = new Audio(b.dataset.src); a.volume = +b.dataset.gain; a.play();
  b.classList.add('play'); setTimeout(() => b.classList.remove('play'), 220);
}});
</script>
</body></html>
'''
open(os.path.join(ROOT, 'lab', 'sounds.html'), 'w').write(page)
print('lab/sounds.html,', sum(len(n) for _, n in LAB), 'sounds')
