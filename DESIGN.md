# Design — Porcelain & Zinc

<!-- impeccable:design-doc 1 -->

Recorded from the built world, not from intention. Ground truth is `src/styles/tokens.css` and the
components in `src/components/`. The direction contract lives as an HTML comment at the top of
`<body>` in `src/layouts/Base.astro` and survives the production build.

## The idea

A licensed trade is proven by its own material, not by a document about it. The site is built from
two things an electrical contractor actually installs — **glazed porcelain** and **galvanised
zinc** — plus **brass** on the one action that matters.

The load-bearing device: a cap-and-pin disc insulator string physically encodes voltage class. More
discs, higher voltage. So the register is not a table and not a chart — **73 projects are 73
strings**, each carrying the discs its supply class needed. A 30 KVA house shows one disc; the
2 × 8 MW sub-station at Chitradurga shows ten. Jobs recorded by area show an empty ring on a bare
pin, which is honest about the absence rather than hiding it.

This replaced eight rejected directions. What it deliberately refuses: the contractor-category
default (hard-hat photo plate, blue gradient, three service cards), the austere editorial ledger,
the wiring-diagram schematic, the near-black tech look, and the drenched-purple editorial.

## Colour

Client-pinned: white and Oxford purple. `#580E8F` is sampled from the pixels of the client's own SE
artwork, not guessed. Strategy is **committed** — purple owns whole regions as a material, never as
scattered accent.

| Role | Token | Value |
|---|---|---|
| Glaze (the porcelain, and the brand) | `--glaze` | `#580E8F` |
| Glaze highlight / rim / shadow | `--glaze-hi` `--glaze-rim` `--glaze-lo` | `#A25BD8` `#C89BEA` `#2E0650` |
| Zinc ground (hero, contact) | `--zinc` | `#B4B7BC` |
| Zinc structure / dark band | `--zinc-deep` `--zinc-dark` | `#7C8189` `#4E5359` |
| Lime wash (content ground) | `--lime` `--lime-2` | `#F3F2ED` `#E7E5DE` |
| Ink | `--ink` … `--ink-45` | `#16131A` … `#696472` |
| Brass (primary action only) | `--brass` | `#B08D3F` |

**Light, not dark, and the use scene decided it:** site professionals and homeowners on mid-range
Android in Bengaluru daylight. Never pure white — lime wash is the paper.

**Brass carries dark ink, never white.** White on `#B08D3F` fails contrast; `--ink` on brass passes
comfortably. Brass appears on the WhatsApp action and nowhere else, so the primary action is never
in competition.

Section grounds alternate — zinc hero → **dark zinc gallery** → lime register → dark zinc firm →
lime founder → zinc contact → ink footer — so the purple stays deliberate across 73 rows.

## Type

**Khand** (display) and **Kumbh Sans** (text), both from Indian type foundries. Chosen as grounded
for an Indian industrial firm rather than fashionable, and deliberately clear of the overused
display defaults.

- Display: `--disp`, weight 600, tracking `-.02em`, line-height `.94`. Ceiling is 6rem.
- Body: `--text`, 16.5px, line-height 1.6, measure capped at `--measure` (68ch).
- **Tabular numerals are global** (`font-variant-numeric: tabular-nums`) — loads and licence
  numbers are measurements and must align.
- **Hierarchy in the register is carried by scale alone.** `data-w="1"` through `data-w="6"` maps
  connected load to type size; the sub-stations span the column, a 30 KVA house is fine print. No
  boxes, no rules, no cards do that work.

## Components

- **`Stack.astro`** — the insulator string. `mode="monumental"` (hero, tapered, pointer-tracked
  specular), `"row"` (register, height tracks disc count), `"plate"` (128px, project page).
  Gradients and the `#disc` symbol are declared once in `Base.astro` and referenced by `<use>`.
- **`Gallery.astro`** — the photographs, and the first thing after the hero because the client
  asked for the work to lead. Dark zinc ground so the photographs carry the section instead of
  sitting politely inside it. The gallery now uses a **large twelve-column editorial sequence**:
  two full-width anchors with asymmetric five/seven-column pairs between them, preserving every
  photograph's native aspect ratio instead of forcing small equal cards. Every frame is a button
  with an explicit Inspect affordance and opens an accessible native-dialog enlarger. The enlarger
  preserves the whole image with `object-fit: contain`, animates the selected frame into place,
  supports previous/next controls, Arrow keys, Escape, backdrop close, focus return and reduced
  motion. The three photographs attributed on evidence link separately to their register entries;
  the others carry a caption describing what is visibly in frame and no client name.
  `tools/photos.json` records every attribution and the reason for it; `tools/gen-photos.mjs`
  extracts the files from the source deck's SmartArt diagrams.
- **`LoadField.astro` — "the live line"** — the register's opening image, rebuilt because a static
  field of stems did not earn the space and its per-string tooltips clipped out of the top of the
  section. Now: **current passes along the busbar** and each string flashes as it arrives — one CSS
  keyframe with a per-string `animation-delay` derived from `--i`, so a travelling wave over 73
  elements costs nothing per frame. **The pointer is a probe:** strings within reach energise with a
  proximity falloff written to a `--near` custom property, and a single seated readout names the job
  — one readout, never 73 tooltips. Focus drives the same readout, so it is not pointer-only. Discs
  were enlarged to `clamp(9px, 1.35vw, 19px)`; at the old size the line smeared into illegibility at
  real desktop widths. Original notes: and the answer to the register reading
  like a table. All 73 jobs stand as strings on one busbar, sorted shortest supply class to
  largest: the practice as a single object you see before you read anything. Height is disc count,
  which is physically how a cap-and-pin string is built, so this is hardware rather than a chart
  axis — and it is why it does not read as the data-viz plate this project already rejected. The
  fourteen jobs recorded by area stand first as bare pins with an open ring; hiding them or giving
  them an invented load would be a lie. Ticks under the busbar teach the encoding (one disc, three,
  five, ten). Hover or keyboard-focus lifts a string and names it. On phones the yard scrolls
  horizontally with snap rather than shrinking to invisibility.
- **`Register.astro` + `RegisterFilter.tsx` — the control bar** — 73 rows is long enough to lose
  your place in, so the register carries its own instrument panel, sticky beneath the masthead:
  a **search** across client, locality, recorded-as, sector and load; a **three-way order**
  (heaviest supply down / by sector / A–Z); a live **tally**; and the sector chips. Ordering by
  sector breaks the lineup into groups that each arrive with a header — what the sector is, how
  many jobs, and the load range across them — so the register can be read as nine practices rather
  than one list. Rows **deal themselves in** on every change of view (`dealIn`, a 460 ms stagger
  capped at 16 steps via `--d`, replayed by a changing React key), which is what makes a filter feel
  like an instrument responding rather than a table swapping contents. Hovering or focusing a row
  **pins its string in the yard above** (`register:hover` → `LoadField`), the reverse of the pointer
  probe, so the two halves of the section are one instrument. The bar is named `.regBar`, **not**
  `.bar`: these styles are global (a React island's DOM is outside Astro's scoping) and `LoadField`
  already owns a scoped `.bar` busbar.
- **`.brass`** — the only button style in the system.
- **`.plain`** — secondary links; an underline, not a second button.
- **`.tag`** — the engraved traffolyte plate in the Founder section, with a one-shot light sweep.
- **`.wrap`** — the single container: `max-width: 1400px`, `padding: 0 var(--pad-x)`.

## Motion

`src/scripts/motion.ts`, GSAP + ScrollTrigger, one module. Motion is material behaviour, not
decoration. Everything is visible by default, so a failed script never hides content, and the whole
module no-ops under `prefers-reduced-motion`.

1. **The glaze catches light** — the specular highlight tracks the pointer across the hero string.
2. **The string settles** — discs drop and swing to rest on load (`elastic.out`).
3. **Hero becomes register** — the one authored moment: on scroll the monumental string disperses
   and lifts as the register arrives.
4. **The yard stands up** — the Work section's own moment: every string in the load field grows off
   the busbar left to right, the way a line actually gets built. Fires once.
5. **Rules energise** — `data-charge` scales a rule from its left edge as it enters.
6. **The plate catches light** — one band crosses the engraved plate, once.
7. **The stack builds** — on a project page the string assembles disc by disc.

`data-rise` and `data-stagger` are the two generic arrival hooks; both fire `once`.

## Pages

`/` is the **commissioned-site contact sheet** that synthesises the deeper routes. The opening is a short,
scroll-controlled receive → build → commission journey rather than a conventional hero or a long
technical slideshow. One monumental SVG system—the grid tower, transformer, breaker, busbar and
three outgoing feeders—shares progress with an OGL electromagnetic field. GSAP draws one reversible
current through the same path while three acts explain the actual delivery scope. The 30 KVA
Jayanagar residence and 2 × 8 MW Chitradurga sub-station sit in the first viewport as the real ends
of the range, not a generic metric strip.

The line does not stop when the pinned sequence ends. It becomes three verified project terminals
(state infrastructure, MRO-TEK and a private Jayanagar residence), then opens the real software-floor
photograph as the Portfolio Film door. The same current crosses Madhusudan's active zinc licence
plate and terminates at one deliberately dark terminal labelled “Your project.” That terminal is the
Contact handoff: drawings are useful, but an address is enough to begin. Thus evidence,
accountability and conversion are the physical continuation of the opening—not independent homepage
sections. Desktop uses 340svh and mobile 270svh; reduced motion receives the three acts as a complete
vertical narrative with all lines already energised. No kicker, decorative section numbers, duplicate
photograph, repeated Team hero, register rows or generic metric cards.

`/portfolio` deliberately leaves the daylight porcelain-and-zinc page world and enters a
**near-black projection room**. It defaults to **Film**: one darkened full-bleed opening frame,
poster-scale “Work, energised.” type, four paced cinematic scenes, and a horizontal contact strip.
High-resolution photographs can own the viewport; weak archive frames become explicit replacement
slates with a dark blurred field behind the safely-sized original, never an upscaled claim. A
persistent Film / Project index switch changes the route's mode with one current-line flash. The
separate **Project index** restores the complete live line and searchable 73-job register, so proof
remains intact without destroying the film's pacing. The lightbox preserves uncropped originals,
keyboard navigation, focus return and reduced motion. `PortfolioExperience.astro` owns the mode
switch; `Gallery.astro` owns Film; `Register.astro` remains the factual index.

`/team` is a portrait-led **licence chain**, not a conventional profile grid. Madhusudan M.S. owns
the first viewport: his real portrait, active Class I plate, direct number and WhatsApp action sit
beside “The licence holder is the person who answers.” The page then shows the only succession claim
that evidence supports—Sri Subramanyappa M. founded the firm in 1969 and handed responsibility to
his son Madhusudan in 1996. Suchetan M.S. is Madhusudan's brother and appears on a supporting
engineering branch, never as a successor. Jagadisha, Yatish, Siddappa and Vinod occupy keyboard-
focusable responsibility circuits whose Oxford-purple current energises on hover/focus. Names,
roles, qualifications and tenure replace generic portraits or equal employee cards. The portrait
asset is `public/people/madhusudan-ms.jpg`; its original 1023 × 1537 crop is preserved without
fabricated extension.

`/contact` is a **drawing table**, not a marketing form. One lime electrical drawing sheet sits on a
zinc review surface. Its thesis—“A complete drawing set is useful. An address is enough to begin.”—
serves builders and homeowners without making either translate themselves. Madhusudan appears as the
restrained recipient/signatory rather than repeating his Team-page hero. The React composer remains
the only interactive island, but its controls now occupy an authentic project title block: document
type, nature of work, locality, optional load and name. Known details turn the diagram's graphite
line Oxford purple and change the revision from DRAFT to READY TO SEND. A live project transmittal
shows the exact WhatsApp message and states honestly that drawings are attached after WhatsApp
opens. The page then explains the factual first-contact sequence—read, review, clarify—and presents
the direct, site, office, email and registered-office routes as a distribution list.

Nav is Portfolio · Team · Contact with `aria-current`. `PageHead.astro` remains available for project
pages and any conventional inner route. `/work/[slug]` remains, 77 routes in total.

## WebGL and SVG motion

`src/scripts/zinc.ts` renders the hero ground as galvanised sheet in `ogl` — voronoi spangle, roller
grain, a pointer-tracked sheen, and a faint purple charge that passes once when the loader trips.
`theFeederArrives()` in `motion.ts` uses **DrawSVG** to draw a service conductor into the hero and
**MotionPath** to run a spark along that path's own geometry.

Both are *decorative* and hidden until their script runs, which is the inverse of the content rule:
a stray half-drawn conductor is worse than no conductor. The shader bails out under reduced motion,
`deviceMemory < 4`, or no WebGL context, and the CSS `--zinc` ground is what remains. `ogl` is a
dynamic import, so its chunk never reaches a visitor who does not get the effect.

## Rules this build holds to

- **No kicker or eyebrow above a heading.** Hard ban. The heading carries its own weight.
- No section numbers, no icon+heading+text card grids, no hero-metric stat strip.
- No `feTurbulence` grain, no gradient text, no glass or blur as decoration.
- No monospace as a costume for "technical" — real measurement gets tabular numerals instead.
- Icons are drawn SVG (`Wa.astro`), never emoji or unicode glyphs.
- Browser surfaces are themed: selection, caret, focus ring, scrollbar.

## Content and truth

- The register is generated: `node tools/gen-projects.mjs` reads `previews/assets/register.js` and
  writes `src/content/projects/*.md`. It asserts 73 files and fails the build otherwise. Never
  hand-edit the generated files.
- **Private residences carry locality and load only — never an owner's name or home address.**
- No fabricated testimonials, clients, imagery, pricing or capabilities. Photography is treated as
  unavailable (the 71 originals are mostly under 400px), so the design stands on material,
  typography and motion alone.

## Open

- **Domain.** `astro.config.mjs` resolves the origin from `SITE_URL`, then Vercel's production URL,
  then localhost. Live at https://suchetana-web.vercel.app; set `SITE_URL` in the Vercel project
  when the real domain exists and canonical, OG and the sitemap all follow.
- The SE mark is a **raster**; an SVG has been requested and not received.
- One consented portrait exists for proprietor Madhusudan M.S.; do not imply portraits exist for the founder or supporting team.
- The detector on this machine runs degraded (missing parser modules) and reports an undercount.
- `tools/contrast.mjs` gates WCAG AA over every pair the design uses and currently passes; re-run it
  after any palette change, because inverting a ground invalidates every previous result.
