'use client';

import { useEffect, useLayoutEffect, useState } from 'react';
import { Icon } from './icons';

const anchors = [
  ['inicio', 'Início'],
  ['clinica', 'A clínica'],
  ['tratamentos', 'Tratamentos'],
  ['equipe', 'Equipe'],
  ['faq', 'FAQ'],
  ['contato', 'Contato'],
] as const;

export function SectionNavigation() {
  const [active, setActive] = useState<string>('inicio');

  useEffect(() => {
    const sections = anchors.flatMap(([id]) => document.getElementById(id) ?? []);
    let frame = 0;
    const locate = () => {
      frame = 0;
      const readingLine = window.innerHeight * 0.42;
      const bottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 6;
      const current = sections.findLast(section => section.getBoundingClientRect().top <= readingLine);
      setActive(bottom ? 'contato' : current?.id ?? 'inicio');
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(locate);
    };
    locate();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
    };
  }, []);

  return (
    <nav className="section-nav" aria-label="Navegação por seções">
      {anchors.map(([id, label]) => (
        <a key={id} href={`#${id}`} aria-current={active === id ? 'location' : undefined}>
          {id === 'inicio' ? <Icon name="up" /> : <span className="nav-dot" aria-hidden="true" />}
          <span>{label}</span>
        </a>
      ))}
    </nav>
  );
}

export function Motion() {
  useEffect(() => {
    const preference = matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)');
    let enabled = true;
    let cleanup: (() => void) | undefined;

    const update = async () => {
      if (!preference.matches) {
        cleanup?.();
        cleanup = undefined;
        return;
      }
      const { startScrollMotion } = await import('./scroll-motion');
      if (enabled && preference.matches && !cleanup) cleanup = startScrollMotion();
    };

    void update();
    preference.addEventListener('change', update);
    return () => {
      enabled = false;
      cleanup?.();
      preference.removeEventListener('change', update);
    };
  }, []);

  return null;
}

export function HeroHandoff() {
  useLayoutEffect(() => {
    const bridge = document.getElementById('inicio');
    const stage = bridge?.querySelector<HTMLElement>('.bridge-stage');
    const film = bridge?.querySelector<HTMLElement>('.hero-film');
    const photo = film?.querySelector('.hero-photo');
    const about = bridge?.querySelector<HTMLElement>('.about');
    const dock = about?.querySelector('.about-photo');
    const flight = document.querySelector<HTMLElement>('.portrait-flight');
    if (!film || !bridge || !stage || !photo || !about || !dock || !flight) return;
    const preference = matchMedia('(prefers-reduced-motion: no-preference)');
    const small = matchMedia('(max-width: 650px)');
    const medium = matchMedia('(max-width: 1100px)');
    let frame = 0;
    let position: number | undefined;
    let lastFrame = 0;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    const soften = (value: number) => value * value * (3 - 2 * value);
    const reset = () => {
      position = undefined;
      lastFrame = 0;
      bridge.removeAttribute('data-sequence');
      film.removeAttribute('data-departed');
      film.removeAttribute('data-text-exit');
      film.removeAttribute('data-transferred');
      film.removeAttribute('data-uncovered');
      film.style.removeProperty('--hero-exit-opacity');
      film.style.removeProperty('--hero-exit');
      film.style.removeProperty('--hero-cover');
      about.removeAttribute('data-handoff');
      about.removeAttribute('data-landed');
      about.removeAttribute('data-copy-ready');
      flight.removeAttribute('data-active');
    };

    const paint = (now = performance.now()) => {
      frame = 0;
      if (!preference.matches) {
        reset();
        return;
      }
      if (!bridge.hasAttribute('data-sequence')) bridge.setAttribute('data-sequence', '');
      const runway = Math.max(1, bridge.offsetHeight - stage.offsetHeight);
      const goal = clamp(-bridge.getBoundingClientRect().top / runway);
      const elapsed = Math.min(40, Math.max(8, now - lastFrame));
      const distance = position === undefined ? 1 : Math.abs(goal - position);
      if (position === undefined || distance < .0015 || distance > .72 || goal === 0 || goal === 1) {
        position = goal;
      } else {
        position += (goal - position) * (1 - Math.exp(-elapsed / 45));
      }
      lastFrame = now;
      const progress = position;
      const phase = (start: number, end: number) => soften(clamp((progress - start) / (end - start)));
      const travel = phase(.46, .84);
      const fade = phase(.22, .46);
      const cover = phase(.48, .8);
      const reveal = phase(.84, .97);
      const moving = travel > 0 && travel < 1;
      const origin = moving ? photo.getBoundingClientRect() : null;
      const target = moving ? dock.getBoundingClientRect() : null;
      const bounds = moving ? stage.getBoundingClientRect() : null;

      film.style.setProperty('--hero-exit-opacity', String(1 - fade));
      film.style.setProperty('--hero-exit', String(fade));
      film.toggleAttribute('data-text-exit', fade > 0);
      film.style.setProperty('--hero-cover', String(1 - cover));
      film.toggleAttribute('data-departed', fade === 1);
      film.toggleAttribute('data-transferred', travel > 0);
      film.toggleAttribute('data-uncovered', cover === 1);
      about.setAttribute('data-handoff', '');
      about.toggleAttribute('data-landed', travel === 1);
      about.toggleAttribute('data-copy-ready', reveal > .01);
      about.style.setProperty('--about-reveal', String(reveal));
      flight.toggleAttribute('data-active', moving);

      if (origin && target && bounds) {
        const between = (from: number, to: number) => from + (to - from) * travel;
        const x = between(origin.left, target.left) - bounds.left;
        const y = between(origin.top, target.top) - bounds.top;
        const cropX = between(small.matches || !medium.matches ? 50 : 60, small.matches ? 52 : 72);
        const cropY = between(small.matches ? 20 : 35, 34);
        flight.style.transform = `translate3d(${x}px,${y}px,0)`;
        flight.style.width = `${between(origin.width, target.width)}px`;
        flight.style.height = `${between(origin.height, target.height)}px`;
        flight.style.borderRadius = `${travel * 20}px`;
        flight.style.setProperty('--portrait-position', `${cropX}% ${cropY}%`);
        flight.style.setProperty('--portrait-shade', String(1 - cover));
      }
      if (progress !== goal) frame = requestAnimationFrame(paint);
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(paint); };
    paint();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    preference.addEventListener('change', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      preference.removeEventListener('change', schedule);
      reset();
    };
  }, []);

  return null;
}
