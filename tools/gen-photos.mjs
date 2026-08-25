/**
 * Pulls the client's own photographs out of the source deck and writes web copies.
 *
 * Source: "KEY CUSTOMERS LIST SUCHETANA ELECTRICALS.pptx". The photos live inside SmartArt
 * diagrams, and tools/photos.json records which project each one belongs to and why.
 * Nothing is upscaled: each file is written at its true pixel size (capped, never enlarged),
 * because a blown-up 280px photo reads worse than no photo at all.
 *
 * Run: node tools/gen-photos.mjs
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'public', 'photos');

const DECKS = [
  'D:\\Users\\siddh\\Downloads\\KEY CUSTOMERS LIST SUCHETANA ELECTRICALS.pptx',
  'C:\\Users\\siddh\\Downloads\\KEY CUSTOMERS LIST SUCHETANA ELECTRICALS.pptx',
];
const deck = DECKS.find((d) => existsSync(d));
if (!deck) throw new Error(`source deck not found; looked in:\n  ${DECKS.join('\n  ')}`);

const map = JSON.parse(readFileSync(join(root, 'tools', 'photos.json'), 'utf8'));
const wanted = [
  ...map.attributed.map((p) => ({ ...p, kind: 'attributed' })),
  ...map.gallery.map((p) => ({ ...p, kind: 'gallery' })),
];

mkdirSync(OUT, { recursive: true });

/* Pillow does the extraction and the resize; node just drives it and keeps the manifest. */
const py = `
import zipfile, io, json, sys, os
from PIL import Image
deck = sys.argv[1]; out = sys.argv[2]
jobs = json.loads(sys.argv[3])
z = zipfile.ZipFile(deck)
res = []
for j in jobs:
    name = 'ppt/media/' + j['file']
    if name not in z.namelist():
        res.append({**j, 'error': 'not in deck'}); continue
    im = Image.open(io.BytesIO(z.read(name)))
    w, h = im.size
    # cap the long edge at 1600, never enlarge
    cap = 1600
    if max(w, h) > cap:
        s = cap / max(w, h)
        im = im.resize((int(w*s), int(h*s)), Image.LANCZOS)
    stem = os.path.splitext(j['file'])[0]
    im.convert('RGB').save(os.path.join(out, stem + '.jpg'), quality=84, optimize=True, progressive=True)
    res.append({**j, 'src': '/photos/' + stem + '.jpg', 'w': im.width, 'h': im.height,
                'sourceW': w, 'sourceH': h})
print(json.dumps(res))
`;

const raw = execFileSync('python', ['-c', py, deck, OUT, JSON.stringify(wanted)], {
  encoding: 'utf8', maxBuffer: 32 * 1024 * 1024,
});
const done = JSON.parse(raw.trim().split('\n').pop());

const bad = done.filter((d) => d.error);
if (bad.length) throw new Error(`missing from deck: ${bad.map((b) => b.file).join(', ')}`);

writeFileSync(
  join(root, 'src', 'data', 'photos.json'),
  JSON.stringify({
    attributed: done.filter((d) => d.kind === 'attributed'),
    gallery: done.filter((d) => d.kind === 'gallery'),
  }, null, 2) + '\n',
  'utf8',
);

console.log(`wrote ${done.length} photos to public/photos/`);
for (const d of done) {
  console.log(`  ${d.file.padEnd(14)} ${String(d.sourceW).padStart(4)}x${String(d.sourceH).padEnd(5)}` +
              ` -> ${d.w}x${d.h}  ${d.kind}${d.slug ? ' :: ' + d.slug : ''}`);
}
console.log(`rejected on purpose: ${map.rejected.length} (see tools/photos.json)`);
