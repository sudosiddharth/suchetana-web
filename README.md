# Suchetana Electricals

Class I electrical contractors, Bengaluru, since 1969. Astro + React islands + GSAP, deployed on
Vercel as a static build.

```bash
npm install
npm run dev        # http://localhost:3000, hot reload
npm run build      # static output to dist/
npm run preview    # serve the built output on :3000
```

## Setting the real domain

Canonical tags, OG URLs and `sitemap-0.xml` all read one value. Set **`SITE_URL`** in the Vercel
project (Settings → Environment Variables) to `https://<the-domain>` and redeploy. Nothing in the
code needs changing — see `astro.config.mjs`.

Without it, the build falls back to Vercel's own deployment URL, and to `http://localhost:3000` for
a local build.

## The register is generated — do not hand-edit it

`src/content/projects/*.md` is written by:

```bash
node tools/gen-projects.mjs
```

which reads `previews/assets/register.js` and **fails unless it writes exactly 73 projects**. That
file is the extracted, count-verified copy of the 2026 company profile: 73 projects, 9 sectors, 59
with a stated connected load.

To change a project, edit `previews/assets/register.js` and re-run the generator.

**Private residences are listed by locality and load only — never an owner's name or home address.**
This is a privacy obligation, not a style choice. Corporate clients may be named.

## Checks

```bash
node tools/contrast.mjs   # WCAG 2.2 AA over every colour pair the design uses; exits non-zero on failure
```

The palette is a saturated purple pinned by the client, so contrast is verified rather than assumed.
Note that white-on-brass fails (3.12) — the primary button carries dark ink deliberately.

## Structure

| Path | What |
|---|---|
| `src/styles/tokens.css` | The whole design system, in `@layer base` |
| `src/layouts/Base.astro` | Shell, SEO, JSON-LD, the shared porcelain/zinc SVG defs, the direction contract |
| `src/components/Stack.astro` | The insulator string — `monumental` / `row` / `plate` |
| `src/components/react/` | The only two islands: register filter, WhatsApp composer |
| `src/scripts/motion.ts` | Single GSAP module; no-ops under `prefers-reduced-motion` |
| `src/pages/work/[slug].astro` | 73 project routes |
| `previews/` | Superseded static design explorations, kept for reference. Not deployed. |

`DESIGN.md` records the visual system. `PRODUCT.md` records product truth.

## Known gaps

- The SE mark is a **raster**; an SVG has been requested from the client.
- **No photography** — the 71 originals are mostly under 400px, so the design deliberately does not
  depend on images. No portraits of the proprietor or team.
- **GSAP loads on every page** (~45 KB gz) for motion that mostly lives on the home page. The obvious
  lever if the payload needs to come down.

## Capturing screenshots

Use `--force-prefers-reduced-motion`, or GSAP entrance animations get caught mid-flight and elements
look faded or missing. Also note `min-height: 100vh` on the hero expands to fill a tall capture
window — flatten it before taking a full-page shot.
