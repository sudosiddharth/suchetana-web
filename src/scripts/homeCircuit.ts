import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initHomeCircuit(): void {
  if (typeof window === 'undefined') return;
  const root = document.querySelector<HTMLElement>('[data-home-circuit]');
  if (!root || root.dataset.ready === 'true') return;
  root.dataset.ready = 'true';
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  gsap.registerPlugin(ScrollTrigger);
  const machine = root.querySelector<HTMLElement>('[data-monumental-machine]');
  const image = machine?.querySelector<HTMLImageElement>('img');
  const light = machine?.querySelector<HTMLElement>('.commissioning-light');
  const act = root.querySelector<HTMLElement>('.act-receive');
  if (!machine || !image || !light || !act) return;

  gsap.timeline({ defaults: { ease: 'expo.out' } })
    .fromTo(machine, { clipPath: 'inset(0 0 0 100%)' }, { clipPath: 'inset(0 0 0 0%)', duration: 1.25 }, .08)
    .fromTo(image, { scale: 1.035, filter: 'saturate(.58) contrast(1.12) brightness(.38)' }, { scale: 1, filter: 'saturate(.72) contrast(1.08) brightness(.72)', duration: 1.35 }, .08)
    .fromTo(act, { autoAlpha: .01, y: 22 }, { autoAlpha: 1, y: 0, duration: .82 }, .34)
    .to(light, { xPercent: 150, duration: 1.2, ease: 'power2.inOut' }, .2);

  if (matchMedia('(hover:hover) and (pointer:fine)').matches) {
    let tx = 0, ty = 0;
    const stage = root.querySelector<HTMLElement>('.circuit-stage');
    stage?.addEventListener('pointermove', (event) => {
      tx = (event.clientX / innerWidth - .5) * 5;
      ty = (event.clientY / innerHeight - .5) * 3;
      gsap.to(image, { x: tx, y: ty, duration: .8, ease: 'power3.out', overwrite: true });
    }, { passive: true });
    stage?.addEventListener('pointerleave', () => gsap.to(image, { x: 0, y: 0, duration: .8, ease: 'power3.out' }), { passive: true });
  }

  const rail = root.querySelector('.evidence-rail span');
  if (rail) gsap.to(rail, { scaleX: 1, ease: 'none', scrollTrigger: { trigger: root.querySelector('.evidence'), start: 'top 82%', end: 'top 28%', scrub: .6 } });
  gsap.from(root.querySelectorAll('.terminal-project'), { opacity: 0, y: 32, stagger: .12, duration: .7, ease: 'power3.out', scrollTrigger: { trigger: root.querySelector('.terminal-projects'), start: 'top 76%', once: true } });
  const licenceCurrent = root.querySelector('.licence-current span');
  if (licenceCurrent) gsap.to(licenceCurrent, { scaleX: 1, ease: 'power2.inOut', scrollTrigger: { trigger: root.querySelector('.licence'), start: 'top 68%', end: 'center center', scrub: .55 } });
  const plate = root.querySelector('.licence-plate');
  if (plate) gsap.from(plate, { opacity: 0, y: 28, duration: .8, ease: 'expo.out', scrollTrigger: { trigger: plate, start: 'top 83%', once: true } });
  const nextLine = root.querySelector<SVGPathElement>('.next-line path');
  if (nextLine) {
    const length = nextLine.getTotalLength();
    gsap.fromTo(nextLine, { strokeDasharray: length, strokeDashoffset: length }, { strokeDashoffset: 0, duration: 1.25, ease: 'power2.inOut', scrollTrigger: { trigger: root.querySelector('.next-project'), start: 'top 72%', once: true } });
  }
}
