import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

/**
 * Motion is material behaviour, not decoration: glaze catches light, strings swing and
 * settle, rules energise along their length. One orchestrated moment per surface, and
 * everything is visible by default so a failed script never hides content.
 */
export function initMotion(): void {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce || typeof window === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

  const isJourneyHome = Boolean(document.querySelector('[data-power-journey], [data-home-circuit]'));
  if (!isJourneyHome) {
    theFeederArrives();
    glazeTracksLight();
    heroBecomesRegister();
  }
  theYardStandsUp();
  rulesEnergise();
  plateCatchesLight();
  stackBuilds();
}

/**
 * The yard erects itself: every string grows off the busbar, left to right, the way a line
 * actually gets built. This is the Work section's own moment — it earns the scroll that
 * reaches it, and it only ever runs once.
 */
function theYardStandsUp(): void {
  const yard = document.querySelector('.yard');
  if (!yard) return;
  const strings = gsap.utils.toArray<HTMLElement>('.yard .str');
  if (!strings.length) return;

  /* Built lazily: until the yard is on screen there is no hidden state to get stuck in. */
  onEnter(yard, () => {
    gsap.from(strings, {
      scaleY: 0,
      transformOrigin: '50% 100%',
      duration: 0.62,
      ease: 'expo.out',
      stagger: { each: 0.012, from: 'start' },
    });
  });
}

/**
 * The supply arrives: the service conductor draws itself in from off-screen, a spark runs its
 * length on the path's own geometry, and the line then settles to a faint trace. This is what
 * ties the loader, the headline and the string into one event rather than three animations.
 *
 * The conductor is decorative and starts at opacity 0 in CSS, so if any of this fails the hero
 * simply has no line — never a half-drawn one.
 */
function theFeederArrives(): void {
  const svg = document.querySelector<SVGSVGElement>('.feeder');
  const path = svg?.querySelector<SVGPathElement>('#feedPath');
  const spark = svg?.querySelector<SVGCircleElement>('.spark');
  if (!svg || !path || !spark) return;

  const run = () => {
    gsap.timeline({ defaults: { ease: 'power2.inOut' } })
      .set(svg, { opacity: 1 })
      .fromTo(path, { drawSVG: '0% 0%' }, { drawSVG: '0% 100%', duration: 1.15 })
      .set(spark, { opacity: 1 }, '<0.1')
      .to(spark, {
        duration: 1.05,
        motionPath: { path, align: path, alignOrigin: [0.5, 0.5] },
        ease: 'power1.inOut',
      }, '<')
      .to(spark, { opacity: 0, duration: 0.25 })
      .to(path, { opacity: 0.28, duration: 0.6 }, '<');
  };

  if (document.documentElement.classList.contains('lit')) { run(); return; }
  const watch = new MutationObserver(() => {
    if (document.documentElement.classList.contains('lit')) { watch.disconnect(); run(); }
  });
  watch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}

/** The specular highlight follows the pointer, so the glaze reads as glaze. */
function glazeTracksLight(): void {
  const spec = document.querySelector<SVGPathElement>('#disc .spec');
  const host = document.querySelector<SVGSVGElement>('.stack-big');
  if (!spec || !host) return;

  let raf = 0;
  window.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    const t = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width - 0.5) * 2));
    if (raf) return;
    raf = requestAnimationFrame(() => {
      spec.setAttribute('transform', `translate(${(t * 26).toFixed(1)} 0)`);
      raf = 0;
    });
  }, { passive: true });
}

/* The string's load moment is now CSS ('takeCharge' in Stack.astro): the charge climbs it from
   the shackle up, timed off html.lit so it starts the instant the loader trips. Kept out of GSAP
   deliberately — a CSS animation resting at its finished state cannot strand the discs hidden. */

/** The one authored moment: the monumental string disperses as the register arrives. */
function heroBecomesRegister(): void {
  const big = document.querySelector('.stack-big');
  const discs = gsap.utils.toArray<SVGGElement>('.stack-big .bd');
  const hero = document.querySelector('.hero');
  if (!big || !hero || !discs.length) return;

  gsap.timeline({ scrollTrigger: { trigger: hero, start: 'bottom bottom', end: '+=620', scrub: 0.7 } })
    .to(discs, {
      y: (i: number) => 40 + i * 26,
      opacity: 0.12,
      duration: 1,
      stagger: { each: 0.03, from: 'start' },
      ease: 'power2.in',
    }, 0)
    .to(big, { y: -90, scale: 0.86, transformOrigin: '50% 100%', duration: 1, ease: 'power2.in' }, 0)
    .to('.hero .legend', { opacity: 0, duration: 0.4 }, 0);
}

/**
 * Build the tween only once the element is actually in view.
 *
 * The failure this avoids is structural, not a timing bug: `gsap.from` / `fromTo` park their
 * targets in the hidden state the instant the tween is constructed, so any tween created at
 * load but gated on scroll can strand real content at zero. A deep link, a restored scroll
 * position, or a layout shift after an island hydrates is enough to trigger it — and it hid 73
 * projects in production. Constructing lazily means the hidden state cannot exist unless the
 * animation is genuinely running, so there is nothing to rescue and no watchdog to trust.
 */
function onEnter(el: Element, make: () => void, rootMargin = '0px 0px -8% 0px'): void {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!e.isIntersecting) continue;
      io.disconnect();
      make();
      return;
    }
  }, { threshold: 0.04, rootMargin });
  io.observe(el);
}

/** Rules energise along their length as they arrive — the page's ambient behaviour. */
function rulesEnergise(): void {
  gsap.utils.toArray<HTMLElement>('[data-charge]').forEach((el) => {
    onEnter(el, () => gsap.fromTo(el,
      { scaleX: 0 },
      { scaleX: 1, duration: 0.9, ease: 'power2.out', transformOrigin: 'left center' }));
  });

  gsap.utils.toArray<HTMLElement>('[data-rise]').forEach((el) => {
    /* resolves out of a soft blur as well as a slide — kept to the handful of [data-rise]
       elements, because a blur filter on every staggered child is a mobile frame-rate bill. */
    onEnter(el, () => gsap.from(el, {
      opacity: 0, y: 30, filter: 'blur(7px)', duration: 0.95, ease: 'expo.out',
    }));
  });

  gsap.utils.toArray<HTMLElement>('[data-stagger]').forEach((group) => {
    onEnter(group, () => gsap.from(Array.from(group.children), {
      opacity: 0, y: 26, duration: 0.7, stagger: 0.075, ease: 'power3.out',
    }));
  });
}

/** A band of light crosses the engraved plate once, the way it would under a work lamp. */
function plateCatchesLight(): void {
  const sweep = document.querySelector('.tag .sweep');
  if (!sweep) return;
  gsap.fromTo(sweep,
    { xPercent: -120, opacity: 0 },
    {
      xPercent: 320, opacity: 1, duration: 1.5, ease: 'power2.inOut',
      scrollTrigger: { trigger: '.tag', start: 'top 80%', once: true },
      onComplete: () => gsap.to(sweep, { opacity: 0, duration: 0.25 }),
    });
}

/** On a project page the string builds disc by disc: the supply class assembling itself. */
function stackBuilds(): void {
  const plate = document.querySelector('.stack-plate');
  if (!plate) return;
  const parts = plate.querySelectorAll('ellipse');
  if (!parts.length) return;
  gsap.from(parts, {
    opacity: 0,
    scaleY: 0.2,
    transformOrigin: '50% 50%',
    duration: 0.5,
    ease: 'back.out(2)',
    stagger: 0.05,
  });
}
