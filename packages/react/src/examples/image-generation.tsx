'use client';
// The animated preview from designme.dev, rebuilt from the React component: four portraits are made at their own pace (the
// third fails and is retried), the second is upscaled, the first opens larger and becomes a reference, then a style preset
// is picked. The "model" here is a timer that reports 30 steps per picture; each picture is a gradient of its colours (pass
// `src` for real pictures: designme.dev lays photos from Pexels over the same gradients).
import { useRef } from 'react';
import { ImageGeneration, type GeneratedImage, type GenerateRequest, type GenerationUpdate, type ImageModel, type ImageStylePreset } from '../components/image-generation/ImageGeneration';
import { Demo } from './Demo';
import { useStory, useWait } from './useScript';

const pic = (key: string, alt: string, placeholder: string, ratio: number, prompt?: string, styles?: string[]): GeneratedImage => ({ key, alt, placeholder, ratio, prompt, styles });

// what each style draws from in this demo
const SETS: Record<string, GeneratedImage[]> = {
  Editorial: [
    pic('yellow-wall', 'A laughing woman in a denim jacket and yellow sunglasses against a bright yellow wall', 'linear-gradient(165deg,#ffec2e 0 55%,#f2c94a 70%,#5b80bd)', 3 / 4),
    pic('green-reach', 'A man in a green T-shirt and yellow bucket hat reaching towards the camera in front of a green backdrop', 'radial-gradient(circle at 62% 40%,#e2cf3a 0 9%,transparent 17%),linear-gradient(#5aa34c,#3f9b50)', 3 / 4),
    pic('magenta-pose', 'A woman in a black strapless dress posing under pink light against a violet backdrop', 'linear-gradient(140deg,#c534a8,#8a2399 50%,#2b102c)', 3 / 4),
    pic('white-blazer', 'A man in a white blazer with black lapels standing against a rust orange wall', 'radial-gradient(ellipse at 50% 72%,#f3efe8 0 20%,transparent 38%),linear-gradient(#ea6a38,#c9532f)', 3 / 4)
  ],
  Poster: [
    pic('pink-tower', 'The corner of a peach building with small windows against a clear blue sky', 'linear-gradient(90deg,#f6cdb7 0 34%,#3f95c9 34%)', 2 / 3),
    pic('pink-window', 'A single small window with a green frame in a wide pink wall', 'radial-gradient(circle at 50% 56%,#5f7d4f 0 7%,transparent 8%),linear-gradient(#eba3ae,#df97a2)', 1)
  ],
  Surreal: [
    pic('pink-dream', 'A dreamlike digital landscape: a pink cloud floating over a lavender field beside a still pink lake', 'linear-gradient(#cdbbe8,#e6a9cb 55%,#b981c4)', 4 / 5),
    pic('clay-loops', 'A 3D render of looping pink clay shapes around a yellow lump on a violet background', 'radial-gradient(circle at 52% 50%,#e9bb5e 0 11%,transparent 21%),linear-gradient(135deg,#b56fd8,#e28bd2 50%,#7f93a4)', 4 / 3)
  ]
};
const GALLERY: GeneratedImage[] = [
  pic('g-dream', SETS.Surreal[0].alt, SETS.Surreal[0].placeholder!, 4 / 5, 'A pink cloud over a lavender field and a still lake', ['Surreal']),
  pic('g-hands', 'A woman in a coral suit framing the camera with her fingers, cobalt curtains and a lilac wall behind her', 'linear-gradient(90deg,#2152c5,#ff6b4e 50%,#c9a8e8)', 3 / 2, 'Woman framing the camera with her hands, coral suit, cobalt curtains', ['Editorial']),
  pic('g-tower', SETS.Poster[0].alt, SETS.Poster[0].placeholder!, 2 / 3, 'Peach building corner against a clear blue sky', ['Poster']),
  pic('g-petal', 'A woman with her eyes closed, rose petals over one eye and green leaves over her mouth, against teal', 'radial-gradient(ellipse at 50% 50%,#e6b59c 0 24%,transparent 44%),linear-gradient(#2f6e6c,#1d4a4a)', 3 / 4, 'Portrait with rose petals and leaves on the face', ['Surreal']),
  pic('g-clay', SETS.Surreal[1].alt, SETS.Surreal[1].placeholder!, 4 / 3, 'Soft clay loops in pink and lilac, 3D', ['Surreal', 'Poster']),
  pic('g-window', SETS.Poster[1].alt, SETS.Poster[1].placeholder!, 1, 'One small window in a pink wall, minimal', ['Poster']),
  pic('g-fruit', 'Red apples with green and red grapes in a bright blue bowl against black', 'radial-gradient(circle at 50% 74%,#2aa8e2 0 17%,transparent 28%),radial-gradient(circle at 52% 46%,#a02e40 0 21%,transparent 38%),linear-gradient(#0d0d0d,#151515)', 1, 'Apples and grapes in a blue bowl on black', ['35mm'])
];
const PRESETS: ImageStylePreset[] = [
  { key: 'editorial', label: 'Studio editorial', description: 'Bold backdrop, studio light', styles: ['Editorial'], image: GALLERY[1] },
  { key: 'block', label: 'Colour block', description: 'Flat colour, strong shapes', styles: ['Poster'], image: GALLERY[2] },
  { key: 'dream', label: 'Dreamscape', description: 'Soft pastel, impossible places', styles: ['Surreal'], image: GALLERY[0] },
  { key: 'still', label: 'Still life', description: 'Objects on black, hard light', styles: ['35mm'], image: GALLERY[6] }
];
const MODELS: ImageModel[] = [
  { key: 'studio', label: 'Studio 2', description: 'Most detail, about 6s a picture', icon: 'spark' },
  { key: 'fast', label: 'Studio 2 Fast', description: 'Quick drafts, about 3s', icon: 'bolt' }
];
const PACE = [1, 0.8, 1.12, 0.9];

export default function ImageGenerationDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const runs = useRef(0);
  // a stand-in for your model: 30 steps per picture, each at its own pace; the first run's third picture fails partway
  const generate = async (req: GenerateRequest, update: (slot: number, u: GenerationUpdate) => void) => {
    const first = ++runs.current === 1, set = SETS[req.styles[0]] ?? SETS.Editorial, ms = req.model === 'fast' ? 95 : 200;
    await Promise.all(Array.from({ length: req.count }, async (_, i) => {
      const slot = req.retry ?? i, base = req.variationOf ?? set[slot % set.length];
      const image = { ...base, key: `${base.key}-${runs.current}-${i}`, prompt: req.prompt, styles: req.styles };
      await wait(260 + i * 180);
      update(i, { image, progress: 0 });
      for (let k = 1; k <= 30; k++) {
        await wait(ms * PACE[slot % 4]);
        if (first && i === 2 && req.retry == null && k === 17) { update(i, { error: 'The model timed out' }); return; }
        update(i, { progress: k / 30 });
      }
    }));
  };
  // the story plays as the person in it; the pictures keep coming under the pointer, as a model's do
  useStory(ref, async ({ wait, press }) => {
    await wait(1000); press('.dm-igx-go');
    await wait(7600); press('[aria-label="Retry picture 3"]');
    await wait(6500); press('[aria-label="Upscale picture 2"]');
    await wait(3000); press('.dm-igx-t .dm-igx-o');
    await wait(3000); press('.dm-igx-lbf [aria-label="Use as reference"]');
    await wait(2500); press('.dm-igx-tb button:last-child');
    await wait(2000); press('.dm-igx-pr:nth-child(3)');
  });
  return (
    <Demo ref={ref} switcher={null}>
      <ImageGeneration title="Spring lookbook" defaultPrompt="Editorial portrait on a bold colour backdrop, studio light" defaultSelectedStyles={['Editorial']}
        models={MODELS} gallery={GALLERY} presets={PRESETS} onGenerate={generate} />
    </Demo>
  );
}
