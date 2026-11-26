'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import CardSwap, { Card, type CardSwapHandle } from './CardSwap';
import StepperProgress from './StepperProgress';
import { scrollPageTo } from './smooth-scrolling';
import { Icon } from './icons';

type Treatment = {
  title: string;
  text: string;
  icon: 'face' | 'spark' | 'eye';
  tone: string;
};

export default function TreatmentDeck({ services }: { services: readonly Treatment[] }) {
  const [selected, setSelected] = useState(0);
  const [width, setWidth] = useState(300);
  const current = useRef(0);
  const deck = useRef<CardSwapHandle>(null);
  const container = useRef<HTMLDivElement>(null);
  const scrollToIndex = useRef<(index: number) => void>(null);
  const last = services.length - 1;
  const compact = width < 440;

  function show(index: number, direction?: -1 | 1, fromScroll = false) {
    current.current = index;
    setSelected(index);
    deck.current?.select(index, direction, fromScroll);
  }

  function choose(index: number, direction?: -1 | 1) {
    show(index, direction);
    scrollToIndex.current?.(index);
  }

  useLayoutEffect(() => {
    const area = container.current;
    const stage = area?.closest<HTMLElement>('.treatments-stage');
    const section = stage?.closest<HTMLElement>('.treatments');
    if (!area || !stage || !section) return;

    const preference = matchMedia('(prefers-reduced-motion: no-preference)');
    let frame = 0;
    let step = 0;
    let pending: { top: number; until: number } | null = null;
    const sectionStart = () => section.getBoundingClientRect().top + window.scrollY;

    const paint = () => {
      frame = 0;
      if (!step) return;
      if (pending) {
        if (Math.abs(window.scrollY - pending.top) < 3) { pending = null; return; }
        if (performance.now() < pending.until) return;
        pending = null;
      }
      const distance = -section.getBoundingClientRect().top;
      if (distance < 0 || distance > step * last + stage.clientHeight) return;
      const index = Math.max(0, Math.min(last, Math.round(distance / step)));
      if (index !== current.current) show(index, index > current.current ? 1 : -1, true);
    };

    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    const measure = () => {
      setWidth(Math.max(210, Math.min(540, area.clientWidth - 62)));
      const size = stage.clientHeight;
      const pin = preference.matches && size <= window.innerHeight + 2;
      step = pin ? Math.max(106, Math.min(170, window.innerHeight * .158)) : 0;
      section.toggleAttribute('data-pinned', pin);
      section.style.setProperty('--treatment-height', `${size + step * last}px`);
      if (!pin) pending = null;
      schedule();
    };

    scrollToIndex.current = index => {
      if (!step) return;
      const top = sectionStart() + step * index;
      if (Math.abs(window.scrollY - top) < 3) return;
      pending = { top, until: performance.now() + 1600 };
      scrollPageTo(top);
    };
    const release = () => { pending = null; };
    const observer = new ResizeObserver(measure);
    observer.observe(area);
    observer.observe(stage);
    measure();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    window.addEventListener('wheel', release, { passive: true });
    window.addEventListener('touchmove', release, { passive: true });
    preference.addEventListener('change', measure);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      window.removeEventListener('wheel', release);
      window.removeEventListener('touchmove', release);
      preference.removeEventListener('change', measure);
      section.removeAttribute('data-pinned');
      section.style.removeProperty('--treatment-height');
      scrollToIndex.current = null;
    };
  }, [last]);

  return (
    <div className="treatment-deck" ref={container}>
      <div className="deck-stage">
        <CardSwap ref={deck} theme="light" width={width} height={compact ? 250 : 286}
          cardDistance={17} verticalDistance={14} depth={48} skewAmount={1.4} visibleCards={4}
          cardRadius={20} autoplay={false} speed={.86} bounce={.1} parallax={.1} hoverSpread={.04}
          dim={.19} intro={false} onChange={index => {
            if (index !== current.current) choose(index);
          }}>
          {services.map((service, index) => (
            <Card key={service.title} className={`treatment-card service-${service.tone}`}>
              <a className="service" href="#contato" draggable={false} inert={index !== selected}>
                <Icon name={service.icon} className="service-icon" />
                <Icon name="diagonal" className="service-arrow" />
                <div><h3>{service.title}</h3><p>{service.text}</p></div>
              </a>
            </Card>
          ))}
        </CardSwap>
      </div>
      <StepperProgress labels={services.map(service => service.title)} current={selected} onChoose={choose} />
      <p className="deck-hint" aria-live="polite">{services[selected].title}</p>
    </div>
  );
}
