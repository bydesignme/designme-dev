'use client';
import { useCallback, useEffect, useRef, useState, type CSSProperties, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { cx } from '../../lib/cx';
import { useControllable, useCopied, useReducedMotion } from '../../lib/hooks';
import { Icon, type IconName } from '../../lib/icons';
import { Seg, Tip } from '../../lib/motion';
import { usePopover } from '../../lib/popover';
import '../../designme.css';
import './image-generation.css';

/** A picture: one made by your model, or an earlier one in the gallery */
export interface GeneratedImage {
  key: string;
  /** The picture. Without it, `placeholder` stands in */
  src?: string;
  /** What the picture shows, for screen readers */
  alt: string;
  /** A CSS background drawn under the picture while it loads (or instead of it), like a gradient of its colours. While a
      picture is made, the effect draws its dots, blur and scan from this and `src` */
  placeholder?: string;
  /** Its width over its height, like 0.75 for 3:4. The gallery and the larger view draw it in its own shape (1 by default) */
  ratio?: number;
  /** The prompt it was made from, shown in the larger view */
  prompt?: string;
  /** The styles it was made with */
  styles?: string[];
}

export type ImageShape = '1:1' | '3:4' | '16:9';

/** What Generate asks your model for */
export interface GenerateRequest {
  prompt: string;
  /** The style chips that are on */
  styles: string[];
  shape: ImageShape;
  /** How many pictures, 1 to 4 */
  count: number;
  /** The model's key */
  model: string;
  /** Pictures added with Use as reference */
  references: GeneratedImage[];
  /** Set for Vary: the picture to make a variation of (count is 1) */
  variationOf?: GeneratedImage;
  /** Set for Retry: which picture of the run is being made again (count is 1, and its updates go to slot 0) */
  retry?: number;
}

/** What your model reports for one picture. Send `progress` as it works (0 to 1), and `image` as soon as there is anything to
    show (an early preview, or only a `placeholder`): the effect plays over it. A picture is ready once progress reaches 1
    and it has an image; `error` fails it, with Retry */
export interface GenerationUpdate {
  progress?: number;
  image?: GeneratedImage;
  error?: string;
}

/** A style preset: a picture and the style chips it turns on */
export interface ImageStylePreset {
  key: string;
  label: string;
  description?: string;
  /** The style chips it turns on (the others go off) */
  styles: string[];
  image?: GeneratedImage;
}

export interface ImageModel {
  key: string;
  label: string;
  /** Like "Most detail, about 6s a picture" */
  description?: string;
  icon?: IconName;
}

export type ImageAction = 'upscale' | 'download' | 'reference' | 'like' | 'dislike' | 'copy';

export interface ImageGenerationProps {
  /** The project, shown after "Images" in the header, like "Spring lookbook" */
  title?: string;
  /** The first part of the header. Defaults to "Images" */
  section?: string;
  /** The prompt in the composer */
  prompt?: string;
  defaultPrompt?: string;
  onPromptChange?: (prompt: string) => void;
  /** The style chips under the prompt. Defaults to Editorial, Poster, Surreal and 35mm */
  styles?: string[];
  /** The chips that are on */
  selectedStyles?: string[];
  defaultSelectedStyles?: string[];
  onSelectedStylesChange?: (styles: string[]) => void;
  shape?: ImageShape;
  defaultShape?: ImageShape;
  onShapeChange?: (shape: ImageShape) => void;
  /** How many pictures Generate makes, 1 to 4 */
  count?: number;
  defaultCount?: number;
  onCountChange?: (count: number) => void;
  /** The models in the model menu. Leave it out to hide the menu */
  models?: ImageModel[];
  model?: string;
  defaultModel?: string;
  onModelChange?: (key: string) => void;
  /** Earlier pictures, newest first. Pictures made here join them at the top */
  gallery?: GeneratedImage[];
  /** The Styles tab. Picking one sets the style chips */
  presets?: ImageStylePreset[];
  /** Which side tab is showing */
  tab?: 'gallery' | 'styles';
  defaultTab?: 'gallery' | 'styles';
  onTabChange?: (tab: 'gallery' | 'styles') => void;
  /** Makes the pictures: call `update(slot, …)` for each one as it goes (slot 0 to count - 1). Also called for Retry and Vary
      with count 1 */
  onGenerate: (request: GenerateRequest, update: (slot: number, update: GenerationUpdate) => void) => void | Promise<void>;
  /** Called for each action on a picture. For 'upscale', return a promise: the sweep plays until it settles, and the picture is
      marked 2× after. Download saves `src` when it has one; anything else is yours to handle here */
  onAction?: (action: ImageAction, image: GeneratedImage) => void | Promise<unknown>;
  className?: string;
}

type Slot = { key: string; progress: number; image?: GeneratedImage; error?: string; up?: boolean; upping?: boolean };
type Run = { id: number; request: GenerateRequest; ratio: number; slots: Slot[]; t0: number; done?: number };

const STYLES = ['Editorial', 'Poster', 'Surreal', '35mm'];
const SHAPES: Record<ImageShape, number> = { '1:1': 1, '3:4': 3 / 4, '16:9': 16 / 9 };
const STAGES = ['Composing', 'Adding detail', 'Upscaling'];
const shapeName = (r: number) => ({ 1: '1:1', 0.75: '3:4', 0.8: '4:5', 0.667: '2:3', 1.333: '4:3', 1.5: '3:2', 1.778: '16:9' } as Record<number, string>)[Math.round(r * 1000) / 1000] || '';
const bg = (im?: GeneratedImage) => [im?.src && `url("${im.src}")`, im?.placeholder].filter(Boolean).join(', ') || undefined;
const statusOf = (s: Slot) => s.error ? 'fail' : s.progress >= 1 && s.image ? 'done' : s.image || s.progress > 0 ? 'gen' : 'wait';

/* the effect, from how far a picture has come: the dots of Composing, the blur and scan of Adding detail, the last softness
   and grain of Upscaling. Progress moves in the steps an image model takes (30 of them), and the CSS eases between them */
function look(s: Slot, ratio: number): CSSProperties {
  const st = statusOf(s), p = Math.floor(Math.min(1, s.progress) * 30) / 30;
  const v: Record<string, string | number> = { '--dm-ar': ratio, '--dm-art': s.image?.placeholder ?? 'none' };
  if (st === 'wait') Object.assign(v, { '--dm-sc': 0, '--dm-gr': 0.5 });
  if (st === 'gen' || st === 'fail') {
    const a = Math.min(1, p / 0.3), b = Math.max(0, Math.min(1, (p - 0.3) / 0.52)), sc = Math.max(0, Math.min(1, (p - 0.34) / 0.46)), u = Math.max(0, Math.min(1, (p - 0.8) / 0.2));
    Object.assign(v, { '--dm-cell': '12px', '--dm-dot': `${a >= 1 ? 12 : 1 + a * 7.5}px`, '--dm-sq': `${a >= 1 ? 12 : 2 + a * 9}px`, '--dm-bl': `${18 - b * 14}px`,
      '--dm-sc': sc, '--dm-lo': sc > 0 && sc < 1 ? 1 : 0, '--dm-sb': `${3 * (1 - u)}px`, '--dm-gr': 0.5 * (1 - p), '--dm-stp': '200ms' });
  }
  if (st === 'done') Object.assign(v, { '--dm-sc': 1, '--dm-sb': '0px', '--dm-gr': 0, '--dm-lo': 0, '--dm-stp': '450ms' });
  return v as CSSProperties;
}

/** A grain tile, drawn once on a canvas */
let grain = '';
function useGrain(off: boolean) {
  const [g, setG] = useState(grain);
  useEffect(() => {
    if (off || grain) return;
    try {
      const n = 96, cv = document.createElement('canvas'); cv.width = cv.height = n;
      const x = cv.getContext('2d'); if (!x) return;
      const d = x.createImageData(n, n);
      for (let i = 0; i < d.data.length; i += 4) { const c = Math.random() < 0.5 ? 20 : 245; d.data[i] = d.data[i + 1] = d.data[i + 2] = c; d.data[i + 3] = 40 + Math.random() * 150; }
      x.putImageData(d, 0, 0); grain = `url("${cv.toDataURL()}")`; setG(grain);
    } catch { /* no canvas: no grain */ }
  }, [off]);
  return off ? '' : g;
}

/** The layers a picture is drawn in: its colours (soft, seen through dots while it is composed), the detailed picture the
    scan uncovers, grain, and the scan line */
function Layers({ image, grainOn = true }: { image?: GeneratedImage; grainOn?: boolean }) {
  const b = { backgroundImage: bg(image) };
  return (
    <>
      <span className="dm-igx-ly dm-igx-b" style={b} />
      <span className="dm-igx-ly dm-igx-s" style={b} />
      {grainOn && <span className="dm-igx-n" />}
      <span className="dm-igx-l"><span /><span /></span>
    </>
  );
}

/** A prompt with style chips, a shape and how many pictures, and a model; the pictures it makes, each resolving from grain
    into dots, then detail under a sweeping scan line, then sharp (Blueprint: square cells and a hard scan, no blur); each can
    fail with Retry, and a finished one can be upscaled, varied, downloaded, opened larger or used as a reference. Beside it,
    a gallery of earlier pictures and style presets; narrower, they take the feed's place under a Create / Gallery / Styles
    switch. `onGenerate` makes the pictures and reports how far each has come. */
export function ImageGeneration(props: ImageGenerationProps) {
  const { title = 'Untitled', section = 'Images', styles = STYLES, models, presets = [], onGenerate, onAction, className } = props;
  const reduce = useReducedMotion();
  const noise = useGrain(reduce);
  const [prompt, setPrompt] = useControllable(props.prompt, props.defaultPrompt ?? '', props.onPromptChange);
  const [picked, setPicked] = useControllable(props.selectedStyles, props.defaultSelectedStyles ?? [], props.onSelectedStylesChange);
  const [shape, setShape] = useControllable(props.shape, props.defaultShape ?? '3:4', props.onShapeChange);
  const [count, setCount] = useControllable(props.count, props.defaultCount ?? 4, props.onCountChange);
  const [model, setModel] = useControllable(props.model, props.defaultModel ?? models?.[0]?.key ?? '', props.onModelChange);
  const [tab, setTab] = useControllable(props.tab, props.defaultTab ?? 'gallery', props.onTabChange);
  const [view, setView] = useState<'create' | 'gallery' | 'styles'>('create');
  const [run, setRun] = useState<Run | null>(null);
  const [made, setMade] = useState<GeneratedImage[]>([]);
  const [fresh, setFresh] = useState<Set<string>>(new Set());
  const [refs, setRefs] = useState<GeneratedImage[]>([]);
  const [rating, setRating] = useState<Record<string, 1 | -1>>({});
  const [upped, setUpped] = useState<Record<string, 'up' | 'upping'>>({});
  const [lb, setLb] = useState<{ list: GeneratedImage[]; key: string; from: HTMLElement | null; mine: boolean } | null>(null);
  const [said, setSaid] = useState('');
  const [runRate, setRunRate] = useState<0 | 1 | -1>(0);
  const [hl, setHl] = useState<string[]>([]);
  const [flash, setFlash] = useState<{ id: string; label: string } | null>(null);
  const [copied, copy] = useCopied();
  const runs = useRef(0), runRef = useRef<Run | null>(null), root = useRef<HTMLDivElement>(null), tiles = useRef<HTMLDivElement>(null), ta = useRef<HTMLTextAreaElement>(null), lbRef = useRef<HTMLDivElement>(null);
  const [grid, setGrid] = useState({ cols: 1, rows: 1 });
  const setMenu = usePopover({ side: 'up' }), modelMenu = usePopover({ side: 'up' });
  runRef.current = run;

  const busy = !!run && run.slots.some(s => { const st = statusOf(s); return st === 'wait' || st === 'gen'; });
  const all = [...made, ...(props.gallery ?? [])];

  // a picture's update, into its run (only the run still on show takes it)
  const updater = useCallback((id: number, map: (slot: number) => number) => (slot: number, u: GenerationUpdate) => {
    setRun(r => {
      if (!r || r.id !== id) return r;
      const i = map(slot); if (!r.slots[i]) return r;
      const slots = r.slots.slice(), s = { ...slots[i] };
      if (u.progress != null) s.progress = Math.max(0, Math.min(1, u.progress));
      if (u.image) s.image = u.image;
      if (u.error) s.error = u.error;
      slots[i] = s;
      return { ...r, slots };
    });
  }, []);
  // a picture that finishes joins the gallery, at the top
  useEffect(() => {
    if (!run) return;
    const ready = run.slots.filter(s => statusOf(s) === 'done' && s.image && !made.some(m => m.key === s.image!.key))
      .map(s => ({ ...s.image!, ratio: run.ratio, prompt: s.image!.prompt ?? run.request.prompt, styles: s.image!.styles ?? run.request.styles }));
    if (ready.length) { setMade(m => [...ready, ...m]); setFresh(new Set(ready.map(x => x.key))); }
    if (!busy && run.slots.length && !run.done) setRun(r => r && { ...r, done: performance.now() });
  }, [run]); // eslint-disable-line react-hooks/exhaustive-deps

  // said politely as each stage starts and once the run is through, never every step
  const live = run ? run.slots.filter(s => !s.error) : [];
  const total = live.length ? live.reduce((a, s) => a + Math.min(1, s.progress), 0) / live.length : 0;
  const stage = !busy ? 3 : total < 0.3 ? 0 : total < 0.8 ? 1 : 2;
  const n = run?.slots.length ?? 0, nDone = run?.slots.filter(s => statusOf(s) === 'done').length ?? 0, nBad = run?.slots.filter(s => s.error).length ?? 0;
  const pics = n === 1 ? 'picture' : `${n} pictures`;
  useEffect(() => {
    if (!run) return;
    setSaid(stage < 3 ? `${STAGES[stage]}, ${pics}` : nBad ? `${nDone} of ${n} ready, ${nBad} failed. Retry is on the failed one` : `${n === 1 ? 'Picture' : pics} ready`);
  }, [stage, run?.id, nBad]); // eslint-disable-line react-hooks/exhaustive-deps

  // the pictures share the room, as large as their shape and number allow
  useEffect(() => {
    const el = tiles.current; if (!el || !run) return;
    const fit = () => {
      const W = el.clientWidth, H = el.clientHeight, k = run.slots.length, g = 8; let best = { cols: 1, rows: 1, w: -1, gap: k };
      for (let cols = 1; cols <= k; cols++) {
        const rows = Math.ceil(k / cols), w = Math.min((W - (cols - 1) * g) / cols, (H - (rows - 1) * g) / rows * run.ratio), gap = cols * rows - k;
        if (w > best.w + 0.5 || (w > best.w - 0.5 && gap <= best.gap)) best = { cols, rows, w, gap };
      }
      setGrid(gr => gr.cols === best.cols && gr.rows === best.rows ? gr : { cols: best.cols, rows: best.rows });
    };
    fit(); const ro = new ResizeObserver(fit); ro.observe(el); return () => ro.disconnect();
  }, [run?.id, run?.slots.length, run?.ratio]); // eslint-disable-line react-hooks/exhaustive-deps

  function start(request: GenerateRequest, ratio: number) {
    setMenuClosed(); setLb(null);
    const id = ++runs.current;
    setRun({ id, request, ratio, slots: Array.from({ length: request.count }, (_, i) => ({ key: `${id}-${i}`, progress: 0 })), t0: performance.now() });
    setRunRate(0);
    void Promise.resolve(onGenerate(request, updater(id, s => s))).catch(() => {});
  }
  const setMenuClosed = () => { setMenu.close(); modelMenu.close(); };
  const generate = () => {
    const text = prompt.trim(); if (!text || busy) return;
    start({ prompt: text, styles: picked, shape, count, model, references: refs }, SHAPES[shape]);
  };
  const retry = (i: number) => {
    const r = run; if (!r) return;
    setRun({ ...r, slots: r.slots.map((s, j) => j === i ? { key: s.key, progress: 0, image: s.image } : s) });
    setSaid(`Making picture ${i + 1} again`);
    void Promise.resolve(onGenerate({ ...r.request, count: 1, retry: i }, updater(r.id, () => i))).catch(() => {});
  };
  const vary = (im: GeneratedImage) => {
    setSaid('Making a variation');
    start({ prompt: im.prompt ?? prompt, styles: im.styles ?? picked, shape, count: 1, model, references: refs, variationOf: im }, im.ratio ?? SHAPES[shape]);
  };
  const upscale = (im: GeneratedImage) => {
    setUpped(u => ({ ...u, [im.key]: 'upping' })); setSaid('Upscaling');
    const min = new Promise(r => setTimeout(r, reduce ? 0 : 1700));
    void Promise.all([min, Promise.resolve(onAction?.('upscale', im)).catch(() => {})]).then(() => { setUpped(u => ({ ...u, [im.key]: 'up' })); setSaid('Upscaled to twice the size'); });
  };
  const note = (id: string, label: string) => { setFlash({ id, label }); setSaid(label); setTimeout(() => setFlash(f => f && f.id === id ? null : f), 1600); };
  const download = (im: GeneratedImage, id: string) => {
    if (im.src) { const a = document.createElement('a'); a.href = im.src; a.download = ''; document.body.appendChild(a); a.click(); a.remove(); }
    void onAction?.('download', im);
    note(id, im.src ? 'Downloading' : 'No file to download');
  };
  const reference = (im: GeneratedImage, mine: boolean) => {
    setRefs(r => r.includes(im) ? r : [...r.slice(-2), im]); setSaid('Added as a reference'); void onAction?.('reference', im);
    if (mine) setTimeout(() => ta.current?.focus({ preventScroll: true }), 0);
  };
  const rate = (im: GeneratedImage, v: 1 | -1) => {
    const on = rating[im.key] !== v;
    setRating(r => { const x = { ...r }; if (on) x[im.key] = v; else delete x[im.key]; return x; });
    setSaid(on ? (v === 1 ? 'Marked as good' : 'Marked as bad') : 'Rating removed');
    if (on) void onAction?.(v === 1 ? 'like' : 'dislike', im);
  };
  const toggleStyle = (s: string) => setPicked(picked.includes(s) ? picked.filter(x => x !== s) : [...picked, s]);
  const pickPreset = (p: ImageStylePreset) => {
    const changed = styles.filter(s => picked.includes(s) !== p.styles.includes(s));
    setPicked(styles.filter(s => p.styles.includes(s))); setHl(changed); setTimeout(() => setHl([]), 700);
    setSaid(`${p.label}: ${p.styles.join(' and ')}`);
    if (view !== 'create') setView('create');
  };
  const showTab = (t: 'gallery' | 'styles') => setTab(t);
  const showView = (v: 'create' | 'gallery' | 'styles') => { setView(v); if (v !== 'create') setTab(v); };
  const open = (list: GeneratedImage[], key: string, from: HTMLElement | null, mine: boolean) => { setMenuClosed(); setLb({ list, key, from, mine }); };

  // the larger view: the focus moves in when a person opened it, and back to where they were when it closes
  useEffect(() => { if (lb?.mine) lbRef.current?.querySelector<HTMLElement>('.dm-igx-lbx')?.focus({ preventScroll: true }); }, [lb?.key, lb?.mine]); // eslint-disable-line react-hooks/exhaustive-deps
  const closeLb = (back: boolean) => { const from = lb?.from; setLb(null); if (back && from?.isConnected) from.focus({ preventScroll: true }); };
  const lbAt = lb ? lb.list.findIndex(x => x.key === lb.key) : -1, lbImg = lb ? lb.list[lbAt] : undefined;
  const step = (d: number) => { if (!lb) return; const i = lbAt + d; if (i >= 0 && i < lb.list.length) setLb({ ...lb, key: lb.list[i].key }); };
  const lbKeys = (e: ReactKeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); e.stopPropagation(); closeLb(true); return; }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowRight') && !(e.target as HTMLElement).closest('.dm-igx-lbf')) { e.preventDefault(); step(e.key === 'ArrowLeft' ? -1 : 1); return; }
    if (e.key === 'Tab') {
      const f = Array.from(lbRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []), a = f[0], z = f[f.length - 1];
      if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z?.focus(); } else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a?.focus(); }
    }
  };

  // two columns for the gallery: each picture under the shorter one
  const cols: GeneratedImage[][] = [[], []], hgt = [0, 0];
  all.forEach(im => { const k = hgt[0] <= hgt[1] ? 0 : 1; cols[k].push(im); hgt[k] += 1 / (im.ratio ?? 1) + 0.06; });
  const metaOf = (im: GeneratedImage) => [shapeName(im.ratio ?? 1), (im.styles ?? []).join(', ') || 'No style', upped[im.key] === 'up' ? 'Upscaled 2×' : ''].filter(Boolean).join(' · ');
  const modelLabel = models?.find(m => m.key === model)?.label;
  const secs = run ? Math.max(1, Math.round(((run.done ?? performance.now()) - run.t0) / 1000)) : 0;
  const doneList = run ? run.slots.filter(s => statusOf(s) === 'done' && s.image).map(s => ({ ...s.image!, ratio: run.ratio, prompt: s.image!.prompt ?? run.request.prompt, styles: s.image!.styles ?? run.request.styles })) : [];
  const flashed = (id: string, icon: IconName) => flash?.id === id ? 'check' : icon;
  const submit = (e: FormEvent) => { e.preventDefault(); generate(); };

  return (
    <div ref={root} data-dm="" className={cx('dm-igx', className)} role="region" aria-label="Image generation" style={noise ? { '--dm-noise': noise } as CSSProperties : undefined}>
      <div className="dm-igx-in" data-view={view}>
        <div className="dm-igx-main" role="group" aria-label="Create">
          <div className="dm-igx-h">
            <span className="dm-igx-cr"><span>{section}</span><Icon name="chev-r" /><b>{title}</b></span>
            <Seg className="dm-igx-vw" label="Show" value={view} onChange={showView} options={[{ value: 'create', label: 'Create' }, { value: 'gallery', label: 'Gallery' }, { value: 'styles', label: 'Styles' }]} />
          </div>
          <div className="dm-igx-feed">
            {run && <div className="dm-bub dm-igx-ask">{run.request.prompt}</div>}
            {!run && <div className="dm-igx-empty"><div className="dm-igx-ef" aria-hidden="true"><span><Icon name="image" /></span><span><Icon name="image" /></span><span><Icon name="image" /></span></div><span>Describe a picture and press Generate</span></div>}
            {run && (
              <div className="dm-igx-run">
                <div className="dm-igx-rh">
                  <span className="dm-igx-rt">
                    {busy ? <><span className="dm-spin" aria-hidden="true" /><span>Generating {pics}</span></>
                      : nBad ? <><Icon name="alert" /><span>{nDone} of {n} ready, {nBad} failed</span></>
                      : <><Icon name="image" /><span>{n === 1 ? 'Picture' : pics[0].toUpperCase() + pics.slice(1)} ready in {secs}s</span></>}
                  </span>
                  <span className="dm-igx-steps" aria-hidden="true">
                    {STAGES.map((s, k) => <span key={s} className={k < stage ? 'dm-done' : k === stage ? 'dm-on' : undefined}><i /><Icon name="check" />{s}</span>)}
                  </span>
                  <span className="dm-igx-pc dm-num" aria-hidden="true">{busy ? `${Math.round(total * 100)}%` : ''}</span>
                </div>
                <div ref={tiles} className="dm-igx-tiles" role="group" aria-label="Pictures" style={{ '--dm-cols': grid.cols, '--dm-rows': grid.rows } as CSSProperties}>
                  {run.slots.map((s, i) => {
                    const st = statusOf(s), up = s.image ? upped[s.image.key] : undefined, im = doneList.find(x => x.key === s.image?.key);
                    return (
                      <figure key={s.key} className={cx('dm-igx-t', up === 'upping' && 'dm-up')} data-st={st} style={look(s, run.ratio)}>
                        <button type="button" className="dm-igx-o" aria-haspopup="dialog" disabled={st !== 'done'}
                          aria-label={st === 'done' ? `Open picture ${i + 1}: ${s.image?.alt}` : `Picture ${i + 1}, ${st === 'fail' ? 'failed' : 'being made'}`}
                          onClick={e => im && open(doneList, im.key, e.currentTarget, e.isTrusted)}>
                          <Layers image={s.image} />
                        </button>
                        {up === 'up' && <span className="dm-tag dm-igx-tg">2×</span>}
                        <span className="dm-igx-tp dm-num" aria-hidden="true">{Math.round(Math.floor(Math.min(1, s.progress) * 30) / 30 * 100)}%</span>
                        <div className="dm-igx-f"><Icon name="alert" /><b>Couldn&apos;t finish</b><span>{s.error}</span><button type="button" className="dm-pill dm-line dm-sm" aria-label={`Retry picture ${i + 1}`} onClick={() => retry(i)}><Icon name="refresh" size="xs" />Retry</button></div>
                        {im && (
                          <div className="dm-igx-q">
                            <Tip label="Vary"><button type="button" className="dm-ib" aria-label={`Vary picture ${i + 1}`} onClick={() => vary(im)}><Icon name="layers" /></button></Tip>
                            <Tip label="Upscale"><button type="button" className="dm-ib" aria-label={`Upscale picture ${i + 1}`} onClick={() => upscale(im)}><Icon name="max" /></button></Tip>
                            <Tip label={flash?.id === `t${i}` ? flash.label : 'Download'} open={flash?.id === `t${i}`}><button type="button" className="dm-ib" aria-label={`Download picture ${i + 1}`} onClick={() => download(im, `t${i}`)}><Icon name={flashed(`t${i}`, 'down')} /></button></Tip>
                          </div>
                        )}
                      </figure>
                    );
                  })}
                </div>
                <div className="dm-igx-acts" role="toolbar" aria-label="Rate and copy">
                  <Tip label="Good pictures"><button type="button" className="dm-ib" aria-label="Good pictures" aria-pressed={runRate === 1} onClick={() => { setRunRate(runRate === 1 ? 0 : 1); setSaid(runRate === 1 ? 'Rating removed' : 'Marked as good'); }}><Icon name="up-thumb" /></button></Tip>
                  <Tip label="Bad pictures"><button type="button" className="dm-ib" aria-label="Bad pictures" aria-pressed={runRate === -1} onClick={() => { setRunRate(runRate === -1 ? 0 : -1); setSaid(runRate === -1 ? 'Rating removed' : 'Marked as bad'); }}><Icon name="down-thumb" /></button></Tip>
                  <Tip label={copied ? 'Prompt copied' : 'Copy prompt'} open={copied}><button type="button" className="dm-ib" aria-label="Copy prompt" onClick={() => copy(run.request.prompt)}><Icon name={copied ? 'check' : 'copy'} /></button></Tip>
                  <span className="dm-igx-meta">{[modelLabel, shapeName(run.ratio), run.request.styles.join(', ') || 'No style'].filter(Boolean).join(' · ')}</span>
                </div>
              </div>
            )}
            <p className="dm-igx-sr" aria-live="polite">{said}</p>
          </div>
          <form className="dm-igx-cmp" onSubmit={submit}>
            {refs.length > 0 && (
              <div className="dm-igx-refs" role="group" aria-label="References">
                {refs.map((im, i) => (
                  <span key={im.key} className="dm-igx-ref"><span className="dm-igx-rp"><span className="dm-igx-ly" style={{ backgroundImage: bg(im) }} /></span>Reference {i + 1}
                    <Tip label="Remove"><button type="button" className="dm-ib" aria-label={`Remove reference ${i + 1}`} onClick={() => { setRefs(r => r.filter(x => x !== im)); setSaid('Reference removed'); }}><Icon name="x" size="xs" /></button></Tip>
                  </span>
                ))}
              </div>
            )}
            <textarea ref={ta} className="dm-igx-ta" rows={2} aria-label="Prompt" placeholder="Describe the picture you want" value={prompt}
              onChange={e => setPrompt(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) { e.preventDefault(); generate(); } }} />
            {styles.length > 0 && (
              <div className="dm-igx-sty" role="group" aria-label="Styles">
                {styles.map(s => <button key={s} type="button" className={cx('dm-igx-sc', hl.includes(s) && 'dm-hl')} aria-pressed={picked.includes(s)} onClick={() => toggleStyle(s)}><Icon name="check" />{s}</button>)}
              </div>
            )}
            <div className="dm-igx-bar">
              <Tip label="Shape and number" off={setMenu.open}>
                <button type="button" className="dm-chip dm-igx-set" {...setMenu.trigger} aria-haspopup="dialog" aria-label={`Shape ${shape}, ${count === 1 ? '1 picture' : `${count} pictures`}`}><Icon name="image" /><span>{shape} · {count}</span><Icon name="chev-d" /></button>
              </Tip>
              {models && models.length > 0 && (
                <Tip label="Image model" off={modelMenu.open}>
                  <button type="button" className="dm-chip dm-igx-mdl" {...modelMenu.trigger}><Icon name={models.find(m => m.key === model)?.icon ?? 'spark'} /><span>{modelLabel}</span><Icon name="chev-d" /></button>
                </Tip>
              )}
              <span className="dm-sp" />
              <Tip label={busy ? 'Generating' : 'Generate'} kbd="↵">
                <button type="submit" className="dm-pill dm-primary dm-igx-go" aria-label="Generate" disabled={!prompt.trim() || busy}><Icon name="wand" /><span>Generate</span></button>
              </Tip>
            </div>
            <div {...setMenu.pop} className={cx(setMenu.pop.className, 'dm-igx-pp-set')} role="dialog" aria-label="Shape and number">
              <div className="dm-ph">Shape</div>
              <Seg label="Shape" value={shape} onChange={setShape} options={(['1:1', '3:4', '16:9'] as const).map(v => ({ value: v, label: v }))} />
              <div className="dm-ph">Pictures</div>
              <Seg label="Pictures" value={String(count)} onChange={v => setCount(+v)} options={['1', '2', '3', '4'].map(v => ({ value: v, label: v }))} />
            </div>
            {models && models.length > 0 && (
              <div {...modelMenu.pop} className={cx(modelMenu.pop.className, 'dm-igx-pp-m')} role="menu" aria-label="Image model">
                <div className="dm-ph">Image model</div>
                {models.map(m => (
                  <button key={m.key} type="button" className="dm-mi" role="menuitemradio" aria-checked={m.key === model} onClick={() => { setModel(m.key); modelMenu.closeSoon(); }}>
                    <Icon name={m.icon ?? 'spark'} /><span>{m.label}{m.description && <span className="dm-d">{m.description}</span>}</span><span className="dm-ck"><Icon name="check" /></span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </div>
        <div className="dm-igx-side" role="group" aria-label="Library">
          <div className="dm-igx-sh">
            <Seg className="dm-igx-tb" label="Show" value={tab} onChange={showTab} options={[{ value: 'gallery', label: 'Gallery' }, ...(presets.length ? [{ value: 'styles' as const, label: 'Styles' }] : [])]} />
            <span className="dm-sp" /><span className="dm-muted dm-num">{all.length}</span>
          </div>
          <div className="dm-igx-pane" role="group" aria-label="Gallery" hidden={tab !== 'gallery'}>
            <div className="dm-igx-gal">
              {cols.map((col, k) => (
                <div key={k} className="dm-igx-col">
                  {col.map(im => (
                    <button key={im.key} type="button" className={cx('dm-igx-g', fresh.has(im.key) && 'dm-new')} aria-haspopup="dialog" aria-label={im.alt} style={{ '--dm-ar': im.ratio ?? 1 } as CSSProperties}
                      onClick={e => open(all, im.key, e.currentTarget, true)}>
                      <span className="dm-igx-ly" style={{ backgroundImage: bg(im) }} />
                    </button>
                  ))}
                </div>
              ))}
            </div>
          </div>
          <div className="dm-igx-pane" role="group" aria-label="Style presets" hidden={tab !== 'styles'}>
            <div className="dm-igx-prs">
              {presets.map(p => (
                <button key={p.key} type="button" className="dm-igx-pr" aria-pressed={p.styles.length === picked.length && p.styles.every(s => picked.includes(s))} onClick={() => pickPreset(p)}>
                  <span className="dm-igx-prp"><span className="dm-igx-ly" style={{ backgroundImage: bg(p.image) }} /></span>
                  <span className="dm-igx-prt"><b>{p.label}</b>{p.description && <span className="dm-muted">{p.description}</span>}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        {lb && lbImg && (
          <div ref={lbRef} className="dm-igx-lb dm-open" role="dialog" aria-modal="true" aria-label={`Picture ${lbAt + 1} of ${lb.list.length}`} onKeyDown={lbKeys}>
            <div className="dm-igx-lbh">
              <div className="dm-igx-lbt"><b>{lbImg.prompt ?? lbImg.alt}</b><span className="dm-muted">{metaOf(lbImg)}</span></div>
              <span className="dm-muted dm-num">{lbAt + 1} of {lb.list.length}</span>
              <Tip label="Close" kbd="Esc"><button type="button" className="dm-ib dm-igx-lbx" aria-label="Close" onClick={() => closeLb(true)}><Icon name="x" /></button></Tip>
            </div>
            <div className="dm-igx-lbb">
              <Tip label="Previous"><button type="button" className="dm-pill dm-line dm-igx-lbn" aria-label="Previous picture" disabled={lbAt <= 0} onClick={() => step(-1)}><Icon name="chev-l" /></button></Tip>
              <div className="dm-igx-lbs">
                <figure className={cx('dm-igx-t', upped[lbImg.key] === 'upping' && 'dm-up')} data-st="done" style={{ '--dm-ar': lbImg.ratio ?? 1, '--dm-art': lbImg.placeholder ?? 'none' } as CSSProperties}>
                  <span className="dm-igx-ly dm-igx-b" style={{ backgroundImage: bg(lbImg) }} />
                  <span className="dm-igx-ly dm-igx-s" role="img" aria-label={lbImg.alt} style={{ backgroundImage: bg(lbImg) }} />
                  <span className="dm-igx-l" aria-hidden="true"><span /><span /></span>
                  {upped[lbImg.key] === 'up' && <span className="dm-tag dm-igx-tg">2×</span>}
                </figure>
              </div>
              <Tip label="Next"><button type="button" className="dm-pill dm-line dm-igx-lbn" aria-label="Next picture" disabled={lbAt >= lb.list.length - 1} onClick={() => step(1)}><Icon name="chev-r" /></button></Tip>
            </div>
            <div className="dm-igx-lbf" role="toolbar" aria-label="Picture actions">
              <Tip label="Upscale to twice the size"><button type="button" className="dm-pill dm-line dm-sm" aria-label="Upscale" onClick={() => upscale(lbImg)}><Icon name="max" size="xs" /><span className="dm-igx-lbl">Upscale</span></button></Tip>
              <Tip label="Make a variation"><button type="button" className="dm-pill dm-line dm-sm" aria-label="Vary" onClick={() => vary(lbImg)}><Icon name="layers" size="xs" /><span className="dm-igx-lbl">Vary</span></button></Tip>
              <Tip label="Use as reference"><button type="button" className="dm-pill dm-line dm-sm" aria-label="Use as reference" onClick={e => { closeLb(false); reference(lbImg, e.isTrusted); }}><Icon name="clip" size="xs" /><span className="dm-igx-lbl">Use as reference</span></button></Tip>
              <Tip label={flash?.id === 'lb' ? flash.label : 'Download'} open={flash?.id === 'lb'}><button type="button" className="dm-pill dm-line dm-sm" aria-label="Download" onClick={() => download(lbImg, 'lb')}><Icon name={flashed('lb', 'down')} size="xs" /><span className="dm-igx-lbl">Download</span></button></Tip>
              <span className="dm-igx-sep" aria-hidden="true" />
              <Tip label="Good picture"><button type="button" className="dm-ib" aria-label="Good picture" aria-pressed={rating[lbImg.key] === 1} onClick={() => rate(lbImg, 1)}><Icon name="up-thumb" /></button></Tip>
              <Tip label="Bad picture"><button type="button" className="dm-ib" aria-label="Bad picture" aria-pressed={rating[lbImg.key] === -1} onClick={() => rate(lbImg, -1)}><Icon name="down-thumb" /></button></Tip>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
