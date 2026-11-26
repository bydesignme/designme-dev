# The photos in the Carousel and Image generation demos on designme.dev, from Pexels (https://www.pexels.com), free to use
# under the Pexels License (https://www.pexels.com/license/). This script downloads each one, crops it and writes <name>.webp
# and its thumbnail <name>-s.webp here, then prints the gradient of its colours that the components draw before (and
# instead of) the photo. art/README.md lists every photo with its Pexels page.
# A photo is cropped to 3:2 (960x640, thumbnail 192x128) unless it names its own sizes: Image generation's gallery mixes
# portrait, square and landscape pictures, so each of its photos keeps a crop that suits it.
#
#   python3 art/get-photos.py              # every photo, from the repository root; needs Pillow with WebP
#   python3 art/get-photos.py pink-dream   # only the photos named
import io, os, sys, urllib.request
from PIL import Image, ImageOps

HERE = os.path.dirname(os.path.abspath(__file__))

# name: (Pexels photo id, where to centre the crop: x, y from 0 to 1[, (width, height), (thumbnail width, height)])
PHOTOS = {
  # Carousel, Images: the six the owner picked (5 Nov)
  'spiral-staircase': (36755131, (0.5, 0.5)),
  'minaret-sunset':   (38981896, (0.5, 0.5)),
  'cat-apple-tree':   (40506373, (0.5, 0.46)),
  'snowboarder':      (40662647, (0.5, 0.36)),
  'shah-i-zinda':     (39632920, (0.5, 0.86)),
  'beach-signpost':   (39970432, (0.5, 0.5)),
  # Carousel, Variants: four drafts of one brief, "mountains at golden hour"
  'cover-a':         (2812185,  (0.5, 0.62)),
  'cover-b':         (28917758, (0.5, 0.5)),
  'cover-c':         (38965265, (0.5, 0.5)),
  'cover-d':         (2132095,  (0.5, 0.5)),
  # Image generation: what the demo makes from its prompt, "editorial portrait on a bold colour backdrop" (3:4)
  'yellow-wall':     (1536619,  (0.55, 0.5),  (600, 800), (240, 320)),
  'green-reach':     (9488402,  (0.5, 0.45),  (600, 800), (240, 320)),
  'magenta-pose':    (33604177, (0.5, 0.35),  (600, 800), (240, 320)),
  'white-blazer':    (31240694, (0.5, 0.3),   (600, 800), (240, 320)),
  # Image generation: the gallery of earlier pictures and the style presets, in mixed shapes for the masonry
  'pink-dream':      (10377281, (0.5, 0.5),   (640, 800), (240, 300)),
  'pink-tower':      (38921436, (0.5, 0.5),   (560, 840), (240, 360)),
  'pink-window':     (2268728,  (0.5, 0.5),   (720, 720), (240, 240)),
  'clay-loops':      (28628510, (0.5, 0.5),   (800, 600), (240, 180)),
  'pastel-shapes':   (27790842, (0.55, 0.5),  (800, 600), (240, 180)),
  'petal-face':      (4850291,  (0.5, 0.4),   (600, 800), (240, 320)),
  'retro-room':      (7035405,  (0.5, 0.5),   (560, 840), (240, 360)),
  'ribbon-look':     (15432405, (0.5, 0.45),  (600, 800), (240, 320)),
  'light-leak':      (3431494,  (0.5, 0.5),   (800, 600), (240, 180)),
  'fruit-bowl':      (33729669, (0.5, 0.5),   (720, 720), (240, 240)),
  'framing-hands':   (7035194,  (0.5, 0.5),   (840, 560), (240, 160)),
  'yellow-shapes':   (12198530, (0.5, 0.55),  (840, 560), (240, 160)),
}

def hexc(px):
  return '#%02x%02x%02x' % px

only = sys.argv[1:]
for name, (pid, centre, *size) in PHOTOS.items():
  if only and name not in only: continue
  (w, h), (sw, sh) = size or ((960, 640), (192, 128))
  url = f'https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&cs=tinysrgb&w=1920'
  req = urllib.request.Request(url, headers={ 'User-Agent':'designme.dev art script' })
  im = Image.open(io.BytesIO(urllib.request.urlopen(req).read())).convert('RGB')
  big = ImageOps.fit(im, (w, h), Image.LANCZOS, centering=centre)
  # the larger pictures of Image generation stay small: a little lower quality keeps each under about 60 KB
  big.save(os.path.join(HERE, f'{name}.webp'), 'WEBP', quality=78 if not size else 70, method=6)
  big.resize((sw, sh), Image.LANCZOS).save(os.path.join(HERE, f'{name}-s.webp'), 'WEBP', quality=80 if not size else 74, method=6)
  # the gradient: the average colour of the top, middle and bottom thirds
  t = h // 3
  bands = [big.crop((0, y, w, y + t)).resize((1, 1), Image.BOX).getpixel((0, 0)) for y in (0, t, 2 * t)]
  print(f"{name}: linear-gradient({', '.join(hexc(b) for b in bands)})")
