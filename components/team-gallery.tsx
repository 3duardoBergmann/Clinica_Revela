'use client';

import { useLayoutEffect, useRef, useState } from 'react';
import AccordionGallery from './AccordionGallery';
import { Icon } from './icons';

const team = [
  {
    image: '/media/renata-equipe.webp',
    label: 'Dra. Renata Martins',
    role: 'Biomédica · CRBM-5 10783',
    bio: 'À frente da Clínica Revela, a Dra. Renata atua com harmonização facial. Na avaliação personalizada, você pode conversar sobre seus objetivos e esclarecer dúvidas antes de decidir por um procedimento.',
    link: 'https://www.instagram.com/drarenataamartins/',
    linkLabel: 'Conheça o trabalho da Dra. Renata',
  },
  {
    image: '/media/maryanna-equipe.webp',
    label: 'Maryanna Martins',
    role: 'Lash Designer',
    bio: 'Maryanna cuida do design de cílios na Clínica Revela. No atendimento, você pode conversar com ela sobre o estilo de que gosta e tirar dúvidas sobre a extensão e os cuidados com os cílios.',
    link: 'https://ig.me/m/clinicarevela',
    linkLabel: 'Consultar atendimento com Maryanna',
  },
];

const prefersMotion = () => !window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function portraitFrame(rect: DOMRect, radius: number): Keyframe {
  return {
    left: `${rect.left}px`, top: `${rect.top}px`,
    width: `${rect.width}px`, height: `${rect.height}px`, borderRadius: `${radius}px`,
  };
}

export default function TeamGallery() {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const photo = useRef<HTMLImageElement>(null);
  const flight = useRef<HTMLDivElement>(null);
  const running = useRef<Animation | null>(null);
  const back = useRef<HTMLButtonElement>(null);
  const source = useRef<{ trigger: HTMLElement; rect: DOMRect } | null>(null);
  const closing = useRef(false);
  const member = selected === null ? null : team[selected];

  function open(index: number, trigger: HTMLElement) {
    source.current = { trigger, rect: trigger.getBoundingClientRect() };
    setSelected(index);
  }

  useLayoutEffect(() => {
    const modal = dialog.current;
    const portrait = photo.current;
    const layer = flight.current;
    if (selected === null || !modal || !portrait || !layer || !source.current) return;
    if (!modal.open) modal.showModal();
    back.current?.focus({ preventScroll: true });
    if (!prefersMotion()) return;

    source.current.trigger.setAttribute('data-portrait-source', '');
    modal.setAttribute('data-entering', '');
    modal.setAttribute('data-portrait-in-flight', '');
    const animation = layer.animate(
      [portraitFrame(source.current.rect, 22), portraitFrame(portrait.getBoundingClientRect(), 0)],
      { duration: 630, easing: 'cubic-bezier(.22,.78,.23,1)', fill: 'both' },
    );
    running.current = animation;
    void animation.finished.then(() => {
      if (running.current !== animation) return;
      modal.removeAttribute('data-portrait-in-flight');
      running.current = null;
      animation.cancel();
    }, () => {});
    return () => {
      animation.cancel();
      source.current?.trigger.removeAttribute('data-portrait-source');
    };
  }, [selected]);

  function reset() {
    running.current?.cancel();
    running.current = null;
    dialog.current?.removeAttribute('data-entering');
    dialog.current?.removeAttribute('data-leaving');
    dialog.current?.removeAttribute('data-portrait-in-flight');
    dialog.current?.style.removeProperty('--team-backdrop-start');
    closing.current = false;
    setSelected(null);
    source.current?.trigger.removeAttribute('data-portrait-source');
    source.current?.trigger.focus({ preventScroll: true });
    source.current = null;
  }

  function close() {
    const modal = dialog.current;
    const portrait = photo.current;
    const layer = flight.current;
    if (!modal?.open || closing.current) return;
    const origin = source.current?.trigger.getBoundingClientRect();
    if (!portrait || !layer || !origin || !prefersMotion()) {
      modal.close();
      return;
    }
    closing.current = true;
    const alreadyInFlight = modal.hasAttribute('data-portrait-in-flight');
    const from = alreadyInFlight ? layer.getBoundingClientRect() : portrait.getBoundingClientRect();
    const radius = alreadyInFlight ? Number.parseFloat(getComputedStyle(layer).borderTopLeftRadius) : 0;
    modal.style.setProperty('--team-backdrop-start', getComputedStyle(modal, '::backdrop').backgroundColor);
    for (const part of modal.querySelectorAll<HTMLElement>('.team-detail-copy, .team-detail-copy > *, .team-back')) {
      const style = getComputedStyle(part);
      part.style.setProperty('--team-leave-opacity', style.opacity);
      part.style.setProperty('--team-leave-translate', style.translate);
      part.style.setProperty('--team-leave-clip', style.clipPath);
    }
    running.current?.cancel();
    modal.removeAttribute('data-entering');
    modal.setAttribute('data-leaving', '');
    modal.setAttribute('data-portrait-in-flight', '');
    const animation = layer.animate(
      [portraitFrame(from, radius), portraitFrame(origin, 22)],
      { duration: 355, easing: 'cubic-bezier(.4,0,.38,1)', fill: 'both' },
    );
    running.current = animation;
    void animation.finished.then(() => {
      if (running.current !== animation) return;
      modal.close();
    }, () => {});
  }

  return (
    <>
      <AccordionGallery
        items={team.map(({ image, label }) => ({ image, label, alt: label }))}
        onSelect={open} defaultIndex={0} expandRatio={0.57} accentColor="#f4d598"
        overlayColor="#352322" textColor="#fff5e6" grayscale={false} tilt={0}
        parallax={0.12} duration={0.72} radius={22} height={510}
      />
      <dialog className="team-dialog" ref={dialog} aria-labelledby="team-member-title" onClose={reset} data-lenis-prevent
        onCancel={event => { event.preventDefault(); close(); }}>
        {member && (
          <div className="team-detail">
            <button className="team-back" type="button" ref={back} onClick={close}>
              <span aria-hidden="true">←</span> Voltar para a equipe
            </button>
            <figure className="team-detail-media"><img alt={member.label} src={member.image} ref={photo} /></figure>
            <div className="team-portrait-flight" ref={flight} aria-hidden="true"><img src={member.image} alt="" /></div>
            <div className="team-detail-copy">
              <p className="eyebrow"><span /> {member.role}</p>
              <h2 id="team-member-title">{member.label}</h2>
              <p className="body-copy">{member.bio}</p>
              <a className="text-link" href={member.link} target="_blank" rel="noreferrer">{member.linkLabel} <Icon name="diagonal" /></a>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
