import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function startScrollMotion() {
  const timeline = gsap.context(() => {
    gsap.utils.toArray<HTMLElement>('[data-reveal]').forEach((element) => {
      gsap.from(element, {
        y: 12, duration: 0.9, ease: 'sine.out', clearProps: 'transform',
        scrollTrigger: { trigger: element, start: 'top 90%', once: true },
      });
    });
  });

  return () => timeline.revert();
}
