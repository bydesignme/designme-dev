# Pictures for the demos

The pictures in the **Carousel** demo on designme.dev are photos from [Pexels](https://www.pexels.com), free to use
under the [Pexels License](https://www.pexels.com/license/) (owner, 5 Nov). They are **not** under this repository's MIT
licence and are not part of anything you install: the components never point at these files. Each photo's page on
Pexels names its photographer.

| File | Pexels photo | Shown in |
| --- | --- | --- |
| `spiral-staircase` | [36755131](https://www.pexels.com/photo/36755131/) | Carousel, Images |
| `minaret-sunset` | [38981896](https://www.pexels.com/photo/38981896/) | Carousel, Images |
| `cat-apple-tree` | [40506373](https://www.pexels.com/photo/40506373/) | Carousel, Images |
| `snowboarder` | [40662647](https://www.pexels.com/photo/40662647/) | Carousel, Images |
| `shah-i-zinda` | [39632920](https://www.pexels.com/photo/39632920/) | Carousel, Images |
| `beach-signpost` | [39970432](https://www.pexels.com/photo/39970432/) | Carousel, Images |
| `cover-a` | [2812185](https://www.pexels.com/photo/2812185/) | Carousel, Variants |
| `cover-b` | [28917758](https://www.pexels.com/photo/28917758/) | Carousel, Variants |
| `cover-c` | [38965265](https://www.pexels.com/photo/38965265/) | Carousel, Variants |
| `cover-d` | [2132095](https://www.pexels.com/photo/2132095/) | Carousel, Variants |

Each photo is `<name>.webp` (960×640, cropped to 3:2) with a thumbnail `<name>-s.webp` (192×128).

The Pexels License lets anyone use these photos for free, change them, and use them without credit. It doesn't allow
selling unaltered copies, showing identifiable people in a bad light or as endorsing something, or redistributing the
photos on other stock photo or wallpaper platforms. If you reuse a photo, take it from its Pexels page.

## How the site uses them

The components never point at these files, so installed code has nothing to download or break. Each picture in a
component carries `data-pic="<name>"` and a gradient of its colours as `--art` (`--dm-art` once installed), which is what an
installed component shows. `art.js`, loaded on designme.dev's pages only (the homepage through `tools/site/build.js`, the
component and docs pages through `tools/pages/src/layouts/Page.astro`), lays the picture of the same name over that
gradient once the card it is in comes near the screen. The React components take a `src` for real pictures and a
`placeholder` for the gradient.

## Getting them again

```sh
python3 art/get-photos.py      # from the repository root; needs Pillow with WebP
```

The photos, their Pexels ids and where each crop is centred are in `PHOTOS` at the top of the script. It writes both sizes and prints a gradient of each photo's colours; name photos after it
(`python3 art/get-photos.py cover-a`) to fetch only those. The gradients in the components are picked by hand from those colours, a
little brighter, so an installed component still looks colourful without the photos. To add a photo, add it there, run
the script, and give the component's data the new name and a gradient.

## The Sales CRM's team

The Sales CRM template on designme.dev shows its sales team with Pexels portraits (owner, 10 Nov), cropped to 192px in
`people/`, each file named with its Pexels id. The names are made up; the photos only stand in for them. Customers' contacts keep initials, as real CRMs
show people without a photo. The template's installable components never point at these files.

| File | Pexels photo | Shown as |
| --- | --- | --- |
| `people/MK-5876695.jpg` | [5876695](https://www.pexels.com/photo/5876695/) | Maya Kim |
| `people/AR-3785077.jpg` | [3785077](https://www.pexels.com/photo/3785077/) | Ari Reyes |
| `people/TR-6274712.jpg` | [6274712](https://www.pexels.com/photo/6274712/) | Theo Reed |
| `people/JO-5384445.jpg` | [5384445](https://www.pexels.com/photo/5384445/) | Jon Ortiz |
| `people/LN-3786525.jpg` | [3786525](https://www.pexels.com/photo/3786525/) | Lena Novak |
| `people/IB-3769021.jpg` | [3769021](https://www.pexels.com/photo/3769021/) | Iris Bell |
| `people/DK-2379005.jpg` | [2379005](https://www.pexels.com/photo/2379005/) | Dev Kumar |
| `people/KM-7562313.jpg` | [7562313](https://www.pexels.com/photo/7562313/) | Kofi Mensah |
| `people/NC-3777943.jpg` | [3777943](https://www.pexels.com/photo/3777943/) | Noah Cole |
