/* The DesignMe smiley in 3D, for the landing page's DesignMe pop-up (owner, 26 Nov: "a 3D, quite a thick render of our logo,
   just rotating 360 very slowly"). The mark's own vector paths (fab.js passes the same <svg> the button draws) are read with
   three's SVGLoader and extruded deep, with bevelled edges, in neutral materials: white and silver in light mode, graphite
   with light edges in dark. Soft studio light from neutral lamps and a soft neutral shadow under it; no colour anywhere.
   One turn every 10.5s at the display's rate (time-based), rendered only while the pop-up is open; with reduced motion a
   still three-quarter view. three.js 0.170.0 is vendored next to this file (fab/three, MIT), loaded only when the pop-up
   first opens. */
import * as THREE from './three/three.module.min.js';
import { SVGLoader } from './three/SVGLoader.js';

export function mount(stage, svgText, opts){
  const reduce = !!(opts && opts.reduce);
  const canvas = document.createElement('canvas');
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias:true, alpha:true, powerPreference:'low-power' }); }
  catch (e) { return null; }
  if (!renderer.getContext()) return null;
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  canvas.className = 'dmf-3d-cv';
  stage.appendChild(canvas);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(26, 1, 1, 5000);

  // the mark, from its own paths: shapes (with their holes) extruded deep and bevelled, centred on its middle
  const data = new SVGLoader().parse(svgText.replace('<svg ', '<svg xmlns="http://www.w3.org/2000/svg" ').replace(/currentColor/g, '#000'));
  const shapes = data.paths.flatMap(p => SVGLoader.createShapes(p));
  const geo = new THREE.ExtrudeGeometry(shapes, { depth:150, bevelEnabled:true, bevelThickness:22, bevelSize:14, bevelOffset:-4, bevelSegments:6, curveSegments:48 });
  geo.computeBoundingBox();
  const bb = geo.boundingBox, c = new THREE.Vector3(); bb.getCenter(c);
  geo.translate(-c.x, -c.y, -c.z);
  geo.computeVertexNormals();
  const faceMat = new THREE.MeshStandardMaterial({ color:0xffffff, metalness:.25, roughness:.32 });
  const sideMat = new THREE.MeshStandardMaterial({ color:0xd6d6d6, metalness:.65, roughness:.28 });
  const mesh = new THREE.Mesh(geo, [faceMat, sideMat]);
  mesh.scale.set(1, -1, 1);                       // SVG's y runs down
  const pivot = new THREE.Group(); pivot.add(mesh); scene.add(pivot);

  // studio light: a soft sky and ground, a key from the upper left, a fill and a rim, all neutral white
  const hemi = new THREE.HemisphereLight(0xffffff, 0x8a8a8a, 1.4); scene.add(hemi);
  const key = new THREE.DirectionalLight(0xffffff, 2.6); key.position.set(-500, 700, 900); scene.add(key);
  const fill = new THREE.DirectionalLight(0xffffff, .9); fill.position.set(700, 100, 600); scene.add(fill);
  const rim = new THREE.DirectionalLight(0xffffff, 1.6); rim.position.set(0, 300, -900); scene.add(rim);

  // a soft neutral shadow on the floor under it: a radial fade drawn once
  const sc = document.createElement('canvas'); sc.width = sc.height = 128;
  const g = sc.getContext('2d'), rg = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  rg.addColorStop(0, 'rgba(0,0,0,.55)'); rg.addColorStop(.5, 'rgba(0,0,0,.2)'); rg.addColorStop(1, 'rgba(0,0,0,0)');
  g.fillStyle = rg; g.fillRect(0, 0, 128, 128);
  const shadowMat = new THREE.MeshBasicMaterial({ map:new THREE.CanvasTexture(sc), transparent:true, depthWrite:false });
  const shadow = new THREE.Mesh(new THREE.PlaneGeometry(900, 260), shadowMat);
  shadow.rotation.x = -Math.PI / 2; shadow.position.y = -(bb.max.y - bb.min.y) / 2 - 70; scene.add(shadow);

  // a fine grain for dark mode's matte surface: noise in the roughness, repeated
  const nc = document.createElement('canvas'); nc.width = nc.height = 64; const nx = nc.getContext('2d'), id = nx.createImageData(64, 64);
  for (let i = 0; i < id.data.length; i += 4){ const v = 200 + Math.random() * 55; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = 255; }
  nx.putImageData(id, 0, 0); const grain = new THREE.CanvasTexture(nc); grain.wrapS = grain.wrapT = THREE.RepeatWrapping; grain.repeat.set(.02, .02);
  const theme = dark => {
    // dark (owner, 26 Nov): matte graphite, its thickness darker than its face, edges a dim highlight at most, a fine grain
    if (dark){ faceMat.color.set(0x3a3a3a); faceMat.metalness = .15; faceMat.roughness = .72; faceMat.roughnessMap = grain; sideMat.color.set(0x1c1c1c); sideMat.metalness = .2; sideMat.roughness = .8; sideMat.roughnessMap = grain; hemi.intensity = 1.6; key.intensity = 3; rim.intensity = .9; shadowMat.opacity = .9; }
    else { faceMat.color.set(0xffffff); faceMat.metalness = .2; faceMat.roughness = .3; faceMat.roughnessMap = null; sideMat.color.set(0xc9c9c9); sideMat.metalness = .7; sideMat.roughness = .26; sideMat.roughnessMap = null; hemi.intensity = 1.4; key.intensity = 2.6; rim.intensity = 1.6; shadowMat.opacity = .45; }
    faceMat.needsUpdate = sideMat.needsUpdate = true;
  };
  theme(opts && opts.dark);

  const w = (bb.max.x - bb.min.x), h = (bb.max.y - bb.min.y);
  let W = 0, H = 0;
  const size = () => {
    W = stage.clientWidth; H = stage.clientHeight; if (!W || !H) return;
    renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); renderer.setSize(W, H, false);
    camera.aspect = W / H;
    // fit the mark's height (and its width as it turns) into the stage with a little room
    const fitH = (h + 200) / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
    const fitW = (w * 1.02) / 2 / Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) / camera.aspect;
    const d = Math.max(fitH, fitW);
    camera.position.set(0, h * .28, d); camera.lookAt(0, -40, 0); camera.updateProjectionMatrix();
  };
  size();

  const TURN = 10.5;
  let raf = 0, t0 = performance.now(), base = 0;
  const draw = now => { pivot.rotation.y = reduce ? -.62 : base + ((now - t0) / 1000) * (Math.PI * 2 / TURN); renderer.render(scene, camera); };
  const loop = now => { raf = requestAnimationFrame(loop); draw(now); };
  return {
    start(){ if (reduce){ draw(performance.now()); return; } if (!raf){ t0 = performance.now(); raf = requestAnimationFrame(loop); } },
    stop(){ if (raf){ cancelAnimationFrame(raf); raf = 0; base = pivot.rotation.y; } },
    resize(){ size(); draw(performance.now()); },
    theme(dark){ theme(dark); draw(performance.now()); }
  };
}
