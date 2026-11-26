'use client';

import type { ButtonHTMLAttributes, PointerEvent } from 'react';
import './SpecularButton.css';

export default function SpecularButton({
  className = '', children, ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  function move(event: PointerEvent<HTMLButtonElement>) {
    if (event.pointerType === 'touch' || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const button = event.currentTarget;
    const box = button.getBoundingClientRect();
    button.style.setProperty('--spec-x', `${event.clientX - box.left}px`);
    button.style.setProperty('--spec-y', `${event.clientY - box.top}px`);
  }

  return (
    <button {...props} type="button" className={`specular-button ${className}`} onPointerMove={move}>
      <span className="specular-button__label">{children}</span>
    </button>
  );
}
