/**
 * The hero's zinc field, rendered in WebGL.
 *
 * The ground behind the headline stops being a flat swatch and becomes galvanised sheet: the
 * spangle crystals of hot-dip zinc, a faint roller grain, and a specular sheen that tracks the
 * pointer. When the loader trips, a charge blooms across it in the glaze purple.
 *
 * It is one canvas on one page, and it withdraws rather than fights for resources:
 *   · ogl is dynamically imported, so nothing ships to visitors who never get the effect
 *   · skipped entirely under reduced motion, on low-memory devices, and without WebGL
 *   · paused whenever the hero is off-screen — no rAF burning behind the register
 *   · DPR capped at 1.5, because a 3x retina buffer is free frame-drops on a phone
 * The CSS zinc colour stays underneath, so if any of this bails the hero is unchanged.
 */

const VERT = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const FRAG = /* glsl */ `
  precision mediump float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uRes;
  uniform vec2  uPointer;   // -1..1
  uniform float uCharge;    // 0 at rest, 1 at the moment the supply lands

  const vec3 ZINC     = vec3(0.706, 0.718, 0.737);  // #B4B7BC
  const vec3 ZINC_LIT = vec3(0.839, 0.847, 0.859);
  const vec3 ZINC_DK  = vec3(0.486, 0.514, 0.541);
  const vec3 GLAZE    = vec3(0.345, 0.055, 0.561);  // #580E8F

  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return fract(sin(p) * 43758.5453);
  }

  /* spangle: hot-dip zinc freezes into large crystal facets, each catching light differently */
  float spangle(vec2 p, out vec2 cell) {
    vec2 n = floor(p), f = fract(p);
    float best = 8.0; vec2 bestCell = vec2(0.0);
    for (int j = -1; j <= 1; j++) {
      for (int i = -1; i <= 1; i++) {
        vec2 g = vec2(float(i), float(j));
        vec2 o = hash2(n + g);
        float d = length(g + o - f);
        if (d < best) { best = d; bestCell = n + g; }
      }
    }
    cell = bestCell;
    return best;
  }

  void main() {
    vec2 uv = vUv;
    vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
    vec2 p = uv * aspect;

    /* the crystal facets */
    vec2 cell;
    float d = spangle(p * 26.0, cell);   // fine crystal, the way hot-dip actually freezes
    vec2 h = hash2(cell);
    float facet = mix(-1.0, 1.0, h.x);
    float edge = smoothstep(0.0, 0.42, d);

    /* rolled sheet grain, very fine, mostly horizontal */
    float grain = sin(p.y * 620.0 + h.y * 6.28) * 0.5 + 0.5;

    /* the sheen: a broad highlight that follows the pointer across the sheet */
    vec2 lightPos = vec2(0.5, 0.42) * aspect + uPointer * vec2(0.36, 0.16) * aspect;
    float sheen = 1.0 - smoothstep(0.0, 0.95, length(p - lightPos));
    sheen = pow(sheen, 2.2);

    vec3 col = ZINC;
    col = mix(col, ZINC_DK, edge * 0.085);
    col += facet * 0.022 * (0.35 + edge);
    col += (grain - 0.5) * 0.014;
    col = mix(col, ZINC_LIT, sheen * 0.42);

    /* the charge arriving: a purple bloom that washes across and settles */
    float wave = smoothstep(0.0, 1.0, uCharge);
    float front = smoothstep(wave - 0.20, wave + 0.04, uv.x);   // a narrow front, not a flood
    float bloom = (1.0 - front) * (1.0 - wave) * 1.5;
    col = mix(col, GLAZE, clamp(bloom, 0.0, 0.085));
    col += vec3(0.42, 0.16, 0.55) * bloom * 0.05;

    /* a whisper of vignette so the headline always has ground to sit on */
    float vig = 1.0 - length((uv - 0.5) * vec2(1.05, 0.9));
    col *= 0.93 + vig * 0.1;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export async function initZinc(): Promise<void> {
  if (typeof window === 'undefined') return;

  const host = document.querySelector<HTMLElement>('.hero');
  if (!host) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  /* a WebGL sheet is not worth a phone's battery on a 2 GB device */
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (typeof mem === 'number' && mem < 4) return;

  let ogl: typeof import('ogl');
  try {
    ogl = await import('ogl');
  } catch {
    return;                       // no library, no problem — the CSS ground stands
  }
  const { Renderer, Program, Mesh, Triangle } = ogl;

  let renderer: InstanceType<typeof Renderer>;
  try {
    renderer = new Renderer({ alpha: false, antialias: false, dpr: Math.min(window.devicePixelRatio, 1.5) });
  } catch {
    return;                       // no WebGL context — same, the hero is unchanged
  }

  const gl = renderer.gl;
  const canvas = gl.canvas as HTMLCanvasElement;
  canvas.className = 'zincCanvas';
  canvas.setAttribute('aria-hidden', 'true');
  host.prepend(canvas);

  const program = new Program(gl, {
    vertex: VERT,
    fragment: FRAG,
    uniforms: {
      uTime: { value: 0 },
      uRes: { value: [1, 1] },
      uPointer: { value: [0, 0] },
      uCharge: { value: 0 },
    },
  });
  const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

  const resize = () => {
    const r = host.getBoundingClientRect();
    renderer.setSize(r.width, r.height);
    program.uniforms.uRes.value = [r.width, r.height];
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  /* pointer drives the sheen, eased so the highlight has mass */
  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener('pointermove', (e) => {
    const r = host.getBoundingClientRect();
    tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
    ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
  }, { passive: true });

  /* the charge lands when the loader trips */
  let charge = 0;
  const lit = () => document.documentElement.classList.contains('lit');
  let chargeStart = lit() ? performance.now() : 0;
  if (!chargeStart) {
    const watch = new MutationObserver(() => {
      if (lit()) { chargeStart = performance.now(); watch.disconnect(); }
    });
    watch.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  /* nothing renders while the hero is off-screen */
  let visible = true;
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(0); },
    { threshold: 0 }).observe(host);

  let raf = 0;
  const start = performance.now();
  function loop(now: number) {
    if (!visible) { raf = 0; return; }
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    if (chargeStart) charge = Math.min(1, (now - chargeStart) / 1100);
    program.uniforms.uTime.value = (now - start) * 0.001;
    program.uniforms.uPointer.value = [cx, cy];
    program.uniforms.uCharge.value = charge;
    renderer.render({ scene: mesh });
    raf = requestAnimationFrame(loop);
  }
  raf = requestAnimationFrame(loop);

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
    else if (visible && !raf) raf = requestAnimationFrame(loop);
  });
}
