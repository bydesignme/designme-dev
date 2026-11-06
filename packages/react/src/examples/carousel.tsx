'use client';
// The animated preview from designme.dev, rebuilt from the React component, with its Variants / Images switch under it.
// Variants: four drafts of a cover image build up out of pixels at once (the last one fails), then the person flips to the third and keeps it.
// Images: the next two pictures, the last one from the dots, then back one. Each picture here is a gradient of its colours;
// pass `src` for real images (designme.dev lays photos from Pexels over the same gradients).
import { useEffect, useRef, useState } from 'react';
import { Carousel, type CarouselImage, type Variant } from '../components/carousel/Carousel';
import { Seg } from '../lib/motion';
import { Demo } from './Demo';
import { useStory, useWait } from './useScript';

const START: Variant[] = [
  { key: 'a', label: 'Variant A', meta: 'Amber haze · 9s', status: 'queued', image: { alt: 'Forested ridges in silhouette under an amber sky', placeholder: 'linear-gradient(#ffb35c,#d9733a 45%,#3a2116 70%)' } },
  { key: 'b', label: 'Variant B', meta: 'Alpenglow · 11s', status: 'queued', image: { alt: 'Rocky peaks lit pink by the low sun under a pale sky', placeholder: 'linear-gradient(#a9bccb,#e08a5c 50%,#3a2f2a 75%)' } },
  { key: 'c', label: 'Variant C', meta: 'Lake at dusk · 7s', status: 'queued', image: { alt: 'Mountains round a lake in a golden haze, dark firs in front', placeholder: 'linear-gradient(#e6b46a,#b88650 50%,#1f1810 80%)' } },
  { key: 'd', label: 'Variant D', meta: 'Valley light · 14s', status: 'queued', image: { alt: 'Sun rays over a green valley with a winding road, mountains all round', placeholder: 'linear-gradient(#c9b88f,#5f8f86 45%,#2f5a3a)' } }
];
const IMAGES: CarouselImage[] = [
  { key: 'staircase', title: 'Spiral staircase', caption: 'Bronze, cream and slate', alt: 'Looking down a spiral staircase that coils in rings of bronze and cream', placeholder: 'linear-gradient(135deg,#8a5a32,#d9a46a 50%,#5f6670)' },
  { key: 'minaret', title: 'Minaret at sunset', caption: 'Sand, ochre and haze', alt: 'A stone minaret above a plain of golden fields at sunset', placeholder: 'linear-gradient(#cfc6bd,#d59a52 45%,#7a4f2c)' },
  { key: 'cat', title: 'Cat in the apple tree', caption: 'Sky blue, leaf green and ginger', alt: 'A ginger and white cat in an apple tree, reaching a paw toward an apple', placeholder: 'linear-gradient(135deg,#3f8fe0,#7fb84a 50%,#e6a35a)' },
  { key: 'snow', title: 'Fresh snow', caption: 'Snow white, sky blue and black', alt: 'A snowboarder in a white jacket and blue goggles raising a hand among frosted trees', placeholder: 'linear-gradient(#2f6fd6,#e8eef5 45%,#c9d3dd)' },
  { key: 'samarkand', title: 'Shah-i-Zinda', caption: 'Turquoise, sand and red', alt: 'A woman in a red dress walking down a lane of turquoise-tiled tombs in Samarkand', placeholder: 'linear-gradient(135deg,#1f8c9a,#d8b48a 50%,#b02a2a)' },
  { key: 'signpost', title: 'Beach signpost', caption: 'Turquoise, coral and peach', alt: 'A painted wooden signpost on a sandy cliff above a turquoise sea', placeholder: 'linear-gradient(#5aa9e6,#2cc3c9 50%,#f2b08a)' }
];

export default function CarouselDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const wait = useWait();
  const [type, setType] = useState<'variants' | 'images'>('variants');
  const [variants, setVariants] = useState(START);
  const [kept, setKept] = useState<string | null>(null);
  const set = (key: string, v: Partial<Variant>) => setVariants(vs => vs.map(x => x.key === key ? { ...x, ...v } : x));
  // how long each one takes: the pixels pace themselves over about three seconds, so a quicker one lands over its last steps
  const TAKES = [3000, 3400, 2700, 1600];
  const make = async (key: string, i: number, fail = false) => {
    set(key, { status: 'generating' }); await wait(TAKES[i]);
    set(key, fail ? { status: 'failed' } : { status: 'ready' });
  };
  // the agent makes all four at once, each at its own pace; the last one fails once, halfway
  useEffect(() => { START.forEach((v, i) => { void (async () => { await wait(500 + i * 350); await make(v.key, i, v.key === 'd'); })(); }); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  // the story plays the drafts; once you switch, the carousel is yours
  useStory(ref, async ({ wait, press }) => {
    await wait(7200);
    press('[aria-label="Next variant"]'); await wait(1000);
    press('[aria-label="Next variant"]'); await wait(1000);
    press('.dm-crs-s:nth-child(3) .dm-crs-keep');
  });
  return (
    <Demo ref={ref} switcher={<Seg label="Type" value={type} onChange={setType} options={[{ value: 'variants', label: 'Variants' }, { value: 'images', label: 'Images' }]} />}>
      {type === 'variants'
        ? <Carousel type="variants" title="Cover image drafts" variants={variants} kept={kept} onKeptChange={setKept} onRetry={key => { void make(key, 0); }} />
        : <Carousel type="images" images={IMAGES} />}
    </Demo>
  );
}
