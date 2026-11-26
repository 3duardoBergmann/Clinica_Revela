'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

let scroller: Lenis | null = null;

export function scrollPageTo(top: number) {
  if (scroller) scroller.scrollTo(top);
  else window.scrollTo({ top, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
}

export function SmoothScrolling() {
  useEffect(() => {
    const motion = matchMedia('(prefers-reduced-motion: no-preference)');
    const update = () => {
      scroller?.destroy();
      scroller = motion.matches ? new Lenis({
        autoRaf: true,
        lerp: .082,
        wheelMultiplier: .92,
        syncTouch: false,
        smoothWheel: true,
      }) : null;
    };

    // Hand an in-progress wheel gesture back to the browser before native anchor navigation.
    const releaseForAnchor = (event: MouseEvent) => {
      if (scroller?.isScrolling !== 'smooth' || event.button !== 0 ||
          event.altKey || event.metaKey || event.ctrlKey || event.shiftKey || !(event.target instanceof Element)) return;
      const anchor = event.target.closest<HTMLAnchorElement>('a[href^="#"]');
      if (anchor && !anchor.target) scroller.scrollTo(window.scrollY, { immediate: true });
    };

    update();
    motion.addEventListener('change', update);
    window.addEventListener('click', releaseForAnchor, true);
    return () => {
      motion.removeEventListener('change', update);
      window.removeEventListener('click', releaseForAnchor, true);
      scroller?.destroy();
      scroller = null;
    };
  }, []);

  return null;
}
