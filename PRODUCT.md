# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Astro, with React only for components that genuinely need interactivity. Confirmed by the user in
the original brief and again when they asked whether to use Astro or Vite+React. Motion via GSAP
(ScrollTrigger) as a plain module — no React binding required. Hosting: Vercel (user-confirmed).
Domain: **purchased but not yet supplied — TODO before deploy.** CMS: deliberately deferred; the
73-project register lives in the repo (Astro content collection or a generated data module) until
the client asks to edit it themselves.

## Users

Two audiences, weighted **equally** by explicit user decision, despite the register being roughly
80% commercial by value.

**B2B — the one who signs the cheque.** Builders and developers, civil-construction and EPC /
turnkey contractors, architects and electrical consultants of record, PMC firms, and government
bodies (Karnataka Housing Board, police quarters, state sub-station contracts). Situation: choosing
an electrical contractor for a project that already has drawings and, often, a sanctioned load.
Job: establish that this firm can carry the electrical scope from sanctioned HT supply through to
commissioning without becoming the reason a handover slips.

**B2C — the individual owner.** Someone building or renovating a single house, a villa row, or a
small apartment block. Situation: usually referred, often unfamiliar with load sanctioning, needs
to know the firm will take a job this small. Job: find out whether to call, and what happens next.

## Product Purpose

Suchetana Electricals is a Class I electrical contracting firm in Bengaluru. The website exists to
**sell** — to turn a visitor into a WhatsApp enquiry addressed to the proprietor. Success is
qualified inbound enquiries, not traffic, time on page, or brand awareness. Everything else on the
site is in service of making that enquiry feel like an obvious, low-risk next step.

## Positioning

Claims a neighbouring contractor could not truthfully copy:

- **Class I licence, one family, continuously since 1969** — founded by Sri Subramanyappa M.,
  handed to his son Madhusudan M.S. in 1996, with no change of licence class.
- **The proprietor holds the licence personally and reads the enquiries himself.** Accountability
  has a name: Mr. Madhusudan M.S., contractor licence 1CL192563BNG.
- **One firm across the whole load range** — a 30 KVA bungalow in Jayanagar and a 2 × 8 MW, 66/11 KV
  state sub-station at Chitradurga are on the same register.
- **Named consultants of record on every job** — architects and electrical consultants are recorded
  per project, which is verifiable by the professionals who recognise those names.

## Operating Context

- Enquiries arrive by **WhatsApp and phone**, not web forms. Primary CTA is WhatsApp
  (+91 98450 13813); the office landline is 080 2346 4320.
- A job runs **sanction → transformer/panel erection → cable and structure work → testing →
  commissioning**, alongside the client's architect and electrical consultant.
- The firm's existing sales asset is a **21-page company profile PDF** handed to prospects. The
  website is the public, indexed equivalent — which is a materially different exposure, and drives
  the client-naming constraint below.
- Work is Bengaluru-anchored (42 localities), with executed work elsewhere in Karnataka
  (Chitradurga, Ranebennur, Hubli) and in Hyderabad. The firm is open to work outside Karnataka but
  **must not be positioned as having pan-India reach** (user decision).

## Capabilities and Constraints

**Scope of works undertaken** (ten confirmed lines): HT & LT power supply, sanction to
commissioning · distribution transformers 44–1000 KVA · 66/11 KV and 110/33 KV sub-stations · HT
cubicles, VCB panels, LBS and ring main units · single-, double- and spun-pole structures · HT cable
laying up to 500 m · 11 KV overhead line and street lighting · interior electrification and
workstation distribution · layout electrification for villas and apartments · rate analysis,
quantity take-off and billing.

**The register:** 73 projects across 9 sectors — IT & office space 17, government 8, hospitals 2,
complex centres 5, industrial & factory 2, restaurants & entertainment 8, apartments/villas/houses
16, showrooms 7, key & ongoing 8. **39 MVA total connected load. 42 localities. 59 of 73 state a
connected load**; the remainder are recorded by area. Verified programmatically against the profile
PDF; extracted to `previews/assets/register.js`.

**Registration:** proprietorship. Contractor licence 1CL192563BNG (Class I). Supervisor licence
1SP191691BNG (Madhusudan M.S.). Supervisor 2ESG00161BNG and wireman 2WP02072BNG (S. Jagadish).
GST 29ACGPM4809H1ZE. PAN ACGPM4809H. Registered office: G 4/5, No. 139, Shalimar Galaxy, 1st Main
Road, Sheshadripuram, Bengaluru 560 020. Email suchetanaele@gmail.com.

**People:** Mr. Madhusudan M.S. (current proprietor and licence holder, son of the founder,
Dip. Electrical Engineering + BBM, 35 years); Mr. Suchetan M.S. (Madhusudan's brother, graduate
electrical engineer providing concept design and engineering support, 34 years); late Sri
Subramanyappa M. (founder, licensed electrical engineer, Mysore State, retired 1996);
Mr. Jagadisha S. (project manager / supervisor, 38 years with the firm); Mr. Yatish M.
(implementation manager, 24 years); Mr. Siddappa G.C. (technical support, 16 years); Mr. Vinod V.
(technical support & quantity take-off, B.E.).

**Hard constraint — publishing client identities.** Corporates may be named (Azim Premji
Foundation, Godrej Properties, Hinduja Group, Fab India, ISKCON, MRO-TEK, VeriFone, Rossell Techsys
and similar). **Private residences must be anonymised to sector + load + locality** — never an
individual's name or home address. This is a user decision and a privacy obligation, not a
preference.

**Undecided:** domain; CMS; whether the client will ever supply a vector logo or new photography.

## Brand Commitments

- Name: **Suchetana Electricals**. Tagline element: "Since 1969".
- **Palette is locked: white + Oxford purple.** The exact value is **`#580E8F`**, sampled from the
  pixels of the client's own SE artwork rather than guessed.
- Logo: the SE monogram plus "Since 1969" wordmark. Supplied only as a **raster PNG, 984 × 982
  after trimming** (`previews/assets/se-logo.png`, white knockout at `se-logo-white.png`). **An SVG
  has been requested and not received** — the raster will soften at large display sizes.
- WhatsApp is the primary conversion action, by user decision.
- Voice: plain, factual, unembellished. The firm's own profile copy is measured and slightly formal;
  claims are always attached to a number, a licence, or a named consultant.

## Evidence on Hand

- **`E:\Suchetana-Electricals-Company-Profile-2026.pdf`** — 21 pages, the source of truth for every
  factual claim on the site. Text extractable with `pypdf`.
- **`previews/assets/register.js`** — the 73-project register, extracted and count-verified per
  sector against the PDF.
- **Photography: treat as unavailable.** 71 originals exist inside
  `C:\Users\siddh\Downloads\KEY CUSTOMERS LIST SUCHETANA ELECTRICALS.pptx`, but measurement shows
  **only 7 are ≥ 800px wide and only 15 are ≥ 400px**; the median is ~281px. The user has confirmed
  **no new shoot**. Every direction must therefore stand on typography, colour, structure and motion
  alone. Do not upscale these, do not use them full-bleed, and do not generate fake photographs of
  installations the firm claims to have built.
- **Portrait available:** a consented portrait of proprietor Madhusudan M.S. is published at
  `public/people/madhusudan-ms.jpg`. No portraits are available for the founder or supporting team.
  No testimonials, no press, no awards, no case studies,
  no pricing. **None of these may be fabricated** — including plausible-sounding client quotes.

## Product Principles

1. **The register is the proof.** 73 verified jobs, with loads and named consultants of record, are
   more persuasive than any adjective. Design around the evidence, not around stock reassurance.
2. **Accountability has a name.** The person who holds the Class I licence is the person who answers
   the message. This is the firm's sharpest differentiator and should never be abstracted into "our
   team".
3. **Serve the builder and the homeowner without diluting either.** A 96-flat block and a single
   bungalow both belong here; neither audience should feel the site was built for the other.
4. **Every path ends at WhatsApp.** Secondary actions exist, but nothing competes with the primary
   conversion.
5. **Never publish what isn't ours to publish, and never invent what we don't have.** No private
   client names, no fabricated imagery, no invented proof.

## Accessibility & Inclusion

No product-specific requirement was established by the user. Default target: **WCAG 2.2 AA** —
which is a live constraint here because the locked palette is a saturated purple, and any
white-on-purple or purple-on-white pairing must be contrast-checked rather than assumed. Audience
skews to on-site professionals and older owners reading on mid-range Android phones over mobile
data, so tap-target size, text scaling, and real-device performance are inclusion issues, not
polish.
