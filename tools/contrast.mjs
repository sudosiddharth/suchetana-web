/**
 * WCAG 2.2 contrast audit over the pairs this design actually uses.
 * The palette is a saturated purple pinned by the client, so nothing here is assumed.
 * Run: node tools/contrast.mjs
 */
const T = {
  glaze: '#580E8F', glazeHi: '#A25BD8', glazeLit: '#CBA653',
  zinc: '#B4B7BC', zincLit: '#C6C8CC', zincDeep: '#7C8189', zincDark: '#4E5359',
  lime: '#F3F2ED', lime2: '#E7E5DE',
  ink: '#16131A', ink80: '#2B2731', ink70: '#4B4653', ink45: '#696472',
  brass: '#B08D3F', brassLit: '#CBA653',
  white: '#FFFFFF',
  firmBody: '#D2D5D8', footBody: '#B9B4C2', footLabel: '#8B8599',
  contactLabel: '#3C3846', plateInk: '#2A2E33', plateSub: '#3B4046', plateRow: '#343A40',
};

const srgb = (h) => {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
};
const lum = (h) => { const [r, g, b] = srgb(h); return 0.2126 * r + 0.7152 * g + 0.0722 * b; };
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};

/** [label, fg, bg, sizeClass] — 'large' is >=24px or >=18.66px bold. */
const PAIRS = [
  ['body copy on lime',              T.ink,           T.lime,      'normal'],
  ['secondary copy on lime',         T.ink70,         T.lime,      'normal'],
  ['muted label on lime',            T.ink45,         T.lime,      'normal'],
  ['muted label on lime-2',          T.ink45,         T.lime2,     'normal'],
  ['hero sub on zinc',               T.ink80,         T.zinc,      'normal'],
  ['heading on zinc',                T.ink,           T.zinc,      'large'],
  ['glazed word on zinc',            T.glaze,         T.zinc,      'large'],
  ['glaze emphasis on lime',         T.glaze,         T.lime,      'normal'],
  ['brass button label',             T.ink,           T.brass,     'normal'],
  ['brass button label (hover)',     T.ink,           T.brassLit,  'normal'],
  ['white on brass (rejected)',      T.white,         T.brass,     'normal'],
  ['firm lede on zinc-dark',         T.firmBody,      T.zincDark,  'normal'],
  ['firm heading on zinc-dark',      T.white,         T.zincDark,  'large'],
  ['masthead links on zinc-dark',    '#D9DBDE',       T.zincDark,  'normal'],
  ['footer body on ink',             T.footBody,      T.ink,       'normal'],
  ['footer label on ink',            T.footLabel,     T.ink,       'normal'],
  ['footer value on ink',            T.lime,          T.ink,       'normal'],
  ['contact label on zinc',          T.contactLabel,  T.zinc,      'normal'],
  ['stage copy on zinc',             T.ink80,         T.zinc,      'normal'],
  ['active sector chip',             T.white,         T.glaze,     'normal'],
  ['idle sector chip on lime',       T.ink,           T.lime,      'normal'],
  ['plate name (engraved)',          T.plateInk,      '#A6ABB1',   'large'],
  ['plate subline (dark end)',       T.plateSub,      '#A6ABB1',   'normal'],
  ['plate subline',                  T.plateSub,      T.zincLit,   'normal'],
  ['plate licence row',              T.plateRow,      '#A6ABB1',   'normal'],
  ['gallery caption on zinc-dark',   T.firmBody,      T.zincDark,  'normal'],
  ['gallery heading on zinc-dark',   T.white,         T.zincDark,  'large'],
  ['on-register badge (ink/brass)',  T.ink,           T.brass,     'normal'],
  ['gallery footer link',            T.white,         T.zincDark,  'normal'],
  ['load figure on lime',            T.glaze,         T.lime,      'large'],
  ['status count on lime',           T.glaze,         T.lime,      'normal'],
  ['search placeholder on lime',     T.ink45,         T.lime,      'normal'],
  ['idle sort button',               T.ink70,         T.lime,      'normal'],
  ['active sort button',             T.white,         T.glaze,     'normal'],
  ['sector count pill',              T.white,         T.glaze,     'normal'],
  ['group load range',               T.glaze,         T.lime,      'normal'],
];

let fails = 0;
console.log('pair                              ratio   need   result');
console.log('-'.repeat(60));
for (const [label, fg, bg, size] of PAIRS) {
  const r = ratio(fg, bg);
  const need = size === 'large' ? 3 : 4.5;
  const ok = r >= need;
  if (!ok && !label.includes('rejected')) fails++;
  console.log(
    `${label.padEnd(33)} ${r.toFixed(2).padStart(5)}  ${need.toFixed(1)}   ${ok ? 'pass' : 'FAIL'}`,
  );
}
console.log('-'.repeat(60));
console.log(fails === 0 ? 'all pairs pass' : `${fails} pair(s) FAIL`);
process.exitCode = fails === 0 ? 0 : 1;
