import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

const VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main(){vUv=uv;gl_Position=vec4(position,0.,1.);}`;

const FRAG = /* glsl */ `
precision highp float;
varying vec2 vUv;
uniform float uTime;
uniform float uProgress;
uniform vec2 uPointer;
uniform vec2 uRes;

float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),f.x),f.y);}

void main(){
  vec2 uv=vUv;
  vec2 p=(uv-.5)*vec2(uRes.x/uRes.y,1.);
  float n=noise(p*5.+vec2(uTime*.025,-uTime*.018));
  float lineY=.02*sin(p.x*7.+uTime*.2)+uPointer.y*.025;
  float conductor=1.-smoothstep(.025,.18,abs(p.y-lineY));
  float halo=1.-smoothstep(.0,.52,abs(p.y-lineY));
  float sweep=exp(-22.*abs(uv.x-(uProgress*1.18-.08)));
  vec3 coal=vec3(.027,.022,.034);
  vec3 purple=vec3(.345,.055,.561);
  vec3 rim=vec3(.784,.608,.918);
  vec3 col=coal+vec3(n*.018);
  col+=purple*halo*(.10+.22*uProgress);
  col+=mix(purple,rim,sweep)*conductor*(.22+.8*sweep);
  float vignette=smoothstep(1.15,.15,length(p*vec2(.72,1.)));
  col*=.72+.28*vignette;
  gl_FragColor=vec4(col,1.);
}`;

export async function initHomeJourney(): Promise<void> {
  if (typeof window === 'undefined') return;
  const root = document.querySelector<HTMLElement>('[data-power-journey]');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) return;

  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);
  const path = root.querySelector<SVGPathElement>('#journeyPath');
  const charge = root.querySelector<SVGCircleElement>('.charge');
  const scenes = gsap.utils.toArray<HTMLElement>('.journey-scene', root);
  const map = root.querySelector<SVGGElement>('.diagram-map');
  const branches = root.querySelector<SVGGElement>('.branches');
  const photo = root.querySelector<HTMLElement>('.commission-photo');
  const progressText = root.querySelector<HTMLElement>('.journey-progress span');
  if (!path || !charge || !map || !branches || !photo || !progressText) return;

  gsap.set(path, { drawSVG: '0% 0%' });
  gsap.set(charge, { opacity: 1, motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: 0, end: 0 } });
  gsap.set(scenes.slice(1), { autoAlpha: 0 });

  let activeScene = 0;
  const setScene = (index: number) => {
    if (index === activeScene) return;
    activeScene = index;
    progressText.textContent = `${String(index).padStart(2, '0')} / 04`;
    scenes.forEach((scene, i) => {
      const active = i === index;
      scene.classList.toggle('is-active', active);
      gsap.to(scene, {
        autoAlpha: active ? 1 : 0,
        y: active ? 0 : (i < index ? -24 : 24),
        duration: .32,
        ease: 'power2.out',
        overwrite: true,
      });
    });
  };

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: root,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.75,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        root.style.setProperty('--journey-progress', self.progress.toFixed(4));
        setScene(Math.min(4, Math.floor(self.progress * 4.45)));
      },
    },
  });

  tl.to(path, { drawSVG: '0% 23%', duration: 1, ease: 'none' }, 0)
    .to(charge, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: 0, end: .23 }, duration: 1, ease: 'none' }, 0)
    .to(map, { xPercent: -7, scale: 1.12, transformOrigin: '28% 50%', duration: 1, ease: 'power1.inOut' }, 0)
    .to(path, { drawSVG: '0% 48%', duration: 1, ease: 'none' }, 1)
    .to(charge, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: .23, end: .48 }, duration: 1, ease: 'none' }, 1)
    .to(map, { xPercent: -18, scale: 1.28, transformOrigin: '48% 50%', duration: 1, ease: 'power1.inOut' }, 1)
    .to('.transformer circle', { stroke: '#C89BEA', filter: 'drop-shadow(0 0 13px rgba(200,155,234,.65))', duration: .35, stagger: .08 }, 1.55)
    .to(path, { drawSVG: '0% 73%', duration: 1, ease: 'none' }, 2)
    .to(charge, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: .48, end: .73 }, duration: 1, ease: 'none' }, 2)
    .to(map, { xPercent: -30, scale: 1.14, transformOrigin: '69% 50%', duration: 1, ease: 'power1.inOut' }, 2)
    .to(branches, { opacity: .9, duration: .35 }, 2.62)
    .from(branches.querySelectorAll('path'), { drawSVG: '0%', duration: .55, stagger: .08, ease: 'power2.out' }, 2.58)
    .to(path, { drawSVG: '0% 100%', duration: 1, ease: 'none' }, 3)
    .to(charge, { motionPath: { path, align: path, alignOrigin: [0.5, 0.5], start: .73, end: 1 }, duration: 1, ease: 'none' }, 3)
    .to(map, { xPercent: -39, scale: 1.08, transformOrigin: '88% 50%', duration: 1, ease: 'power1.inOut' }, 3)
    .to('.load circle,.load path', { stroke: '#D6A84C', filter: 'drop-shadow(0 0 18px rgba(214,168,76,.72))', duration: .28 }, 3.64)
    .to(photo, { opacity: 1, clipPath: 'circle(92% at 87% 50%)', duration: .8, ease: 'power2.inOut' }, 3.72)
    .to('.single-line', { opacity: .25, duration: .45 }, 3.72);

  void initField(root, tl);
}

async function initField(root: HTMLElement, timeline: gsap.core.Timeline): Promise<void> {
  const canvas = root.querySelector<HTMLCanvasElement>('.field-canvas');
  if (!canvas) return;
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (typeof mem === 'number' && mem < 4) return;

  try {
    const { Renderer, Program, Mesh, Triangle } = await import('ogl');
    const renderer = new Renderer({ canvas, alpha: false, antialias: false, dpr: Math.min(devicePixelRatio, 1.35) });
    const gl = renderer.gl;
    const program = new Program(gl, { vertex: VERT, fragment: FRAG, uniforms: { uTime: { value: 0 }, uProgress: { value: 0 }, uPointer: { value: [0, 0] }, uRes: { value: [1, 1] } } });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    const resize = () => { const r = root.getBoundingClientRect(); renderer.setSize(r.width, innerHeight); program.uniforms.uRes.value = [r.width, innerHeight]; };
    resize(); window.addEventListener('resize', resize, { passive: true });
    let tx = 0, ty = 0, cx = 0, cy = 0, visible = true, raf = 0;
    root.addEventListener('pointermove', (e) => { const r = root.getBoundingClientRect(); tx = (e.clientX / r.width - .5) * 2; ty = (e.clientY / innerHeight - .5) * 2; }, { passive: true });
    new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; if (visible && !raf) raf = requestAnimationFrame(render); }, { threshold: 0 }).observe(root);
    const start = performance.now();
    function render(now: number) { if (!visible || document.hidden) { raf = 0; return; } cx += (tx-cx)*.045; cy += (ty-cy)*.045; program.uniforms.uTime.value = (now-start)*.001; program.uniforms.uProgress.value = timeline.progress(); program.uniforms.uPointer.value = [cx,cy]; renderer.render({ scene: mesh }); raf = requestAnimationFrame(render); }
    raf = requestAnimationFrame(render);
    document.addEventListener('visibilitychange', () => { if (!document.hidden && visible && !raf) raf = requestAnimationFrame(render); });
  } catch { /* the static field is the intentional fallback */ }
}
