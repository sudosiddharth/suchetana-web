/**
 * Generates src/content/projects/*.md from the verified register.
 *
 * Source of truth: previews/assets/register.js, itself extracted and count-verified
 * against E:\Suchetana-Electricals-Company-Profile-2026.pdf (73 projects, 9 sectors).
 * Private residences carry locality + load only — never an owner name. Do not hand-edit
 * the generated files; change the register and re-run `node tools/gen-projects.mjs`.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(root, 'src', 'content', 'projects');

// register.js is a classic script; evaluate it in a function scope to lift the consts out.
const src = readFileSync(join(root, 'previews', 'assets', 'register.js'), 'utf8');
const { SECTORS, P } = new Function(`${src}; return { SECTORS, P };`)();

const SECTOR_BLURB = {
  it:  'Software campuses, R&D centres and managed office space, taken from the incoming HT supply through to the last workstation.',
  gov: 'State sub-stations, public housing, police quarters and layout electrification executed for government bodies across Karnataka.',
  hos: 'Healthcare installations where supply continuity and enhancement work must proceed without interrupting a live facility.',
  cpx: 'Mixed-use and commercial complexes, including loop-fed HT systems shared across neighbouring civic and cinema loads.',
  ind: 'Manufacturing units in Bengaluru industrial estates, taken from sanctioned HT supply through to plant distribution.',
  res: 'Hospitality fit-outs in malls, on high streets and in standalone buildings — multi-branch rollouts and single flagship kitchens alike.',
  apt: 'Layout electrification, transformer erection on spun poles, and complete LT distribution for developers and private owners.',
  shw: 'Retail interiors and lighting-critical showrooms, including work carried out beyond Karnataka in Hyderabad.',
  key: 'Current commissions, including work for a Government of India research directorate and a series of commercial and residential developments.',
};

/** kVA as a number, so pages can sort and compare. Null where the job is recorded by area. */
function toKva(load) {
  if (!load || load === '\u2014') return null;
  const m = /([\d.]+)\s*(KVA|MVA|KW|MW)/i.exec(load);
  if (!m) return null;
  let v = parseFloat(m[1]);
  const u = m[2].toUpperCase();
  if (u === 'MVA' || u === 'MW') v *= 1000;
  if (/2\s*[x\u00d7]\s*8/i.test(load)) v = 16000;   // 2 x 8 MW sub-station
  if (/2\s*[x\u00d7]\s*5/i.test(load)) v = 10000;   // 2 x 5 MVA sub-station
  return v;
}

/** A disc insulator string grows with voltage class; this is the same mapping the page draws. */
function discsFor(kva) {
  if (kva == null) return 0;
  if (kva <= 50) return 1;
  if (kva <= 120) return 2;
  if (kva <= 260) return 3;
  if (kva <= 520) return 4;
  if (kva <= 1100) return 5;
  if (kva <= 6000) return 7;
  if (kva <= 11000) return 9;
  return 10;
}

/** What the supply class means in the firm's own scope language — derived, never invented. */
function classNote(kva) {
  if (kva == null) return 'Recorded by area rather than by connected load — interior fit-out, layout or landscape electrification.';
  if (kva <= 50) return 'A single-dwelling LT supply, the smallest class on the register.';
  if (kva <= 120) return 'A small LT supply — a few flats or a compact commercial floor.';
  if (kva <= 260) return 'The median class on this register: a transformer, its structure, and full LT distribution.';
  if (kva <= 520) return 'An HT supply requiring a dedicated transformer, cubicle and pole structure.';
  if (kva <= 1100) return 'A large HT supply — transformer, VCB, HT cubicle and a substantial cable run.';
  return 'Sub-station class work, at the top of the range the firm has recorded.';
}

const decode = (s) => String(s)
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"');

const slugify = (s) => decode(s).toLowerCase()
  .replace(/[\u2014\u2013]/g, ' ')
  .replace(/[^a-z0-9]+/g, '-')
  .replace(/^-+|-+$/g, '');

const yaml = (v) => `"${String(v).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

mkdirSync(OUT, { recursive: true });
for (const f of readdirSync(OUT)) if (f.endsWith('.md')) rmSync(join(OUT, f));

const seen = new Map();
let written = 0;

P.forEach(([sectorId, name, locality, load, credit, isKey], i) => {
  const sector = SECTORS.find((s) => s.id === sectorId);
  if (!sector) throw new Error(`unknown sector "${sectorId}" on row ${i}: ${name}`);

  let slug = slugify(name);
  if (seen.has(slug)) {
    slug = `${slug}-${slugify(locality)}`;                  // two Karnataka Housing Board jobs, etc.
    if (seen.has(slug)) slug = `${slug}-${seen.get(slug) + 1}`;
  }
  seen.set(slug, (seen.get(slug) || 0) + 1);

  const kva = toKva(load);
  const body = [
    `---`,
    `title: ${yaml(decode(name))}`,
    `sector: ${yaml(sectorId)}`,
    `sectorName: ${yaml(sector.name)}`,
    `sectorBlurb: ${yaml(SECTOR_BLURB[sectorId])}`,
    `locality: ${yaml(decode(locality))}`,
    `load: ${yaml(load === '\u2014' ? '' : load)}`,
    `loadKva: ${kva === null ? 'null' : kva}`,
    `discs: ${discsFor(kva)}`,
    `recordedAs: ${yaml(decode(credit))}`,
    `classNote: ${yaml(classNote(kva))}`,
    `key: ${isKey ? 'true' : 'false'}`,
    `order: ${i}`,
    `---`,
    ``,
  ].join('\n');

  writeFileSync(join(OUT, `${slug}.md`), body, 'utf8');
  written++;
});

const withLoad = P.filter((p) => toKva(p[3]) !== null).length;
console.log(`wrote ${written} projects across ${SECTORS.length} sectors`);
console.log(`${withLoad} state a connected load, ${written - withLoad} recorded by area`);
if (written !== 73) throw new Error(`expected 73 projects, wrote ${written}`);
