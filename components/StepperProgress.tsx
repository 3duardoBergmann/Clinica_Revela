'use client';

import { useRef, type KeyboardEvent } from 'react';
import './StepperProgress.css';

// Adapts the React Bits Stepper indicators to selectable progress segments.
export default function StepperProgress({ labels, current, onChoose }: {
  labels: readonly string[]; current: number; onChoose: (index: number) => void;
}) {
  const steps = useRef<(HTMLButtonElement | null)[]>([]);

  function move(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const last = labels.length - 1;
    let target: number;
    if (event.key === 'Home') target = 0;
    else if (event.key === 'End') target = last;
    else if (event.key === 'ArrowLeft') target = Math.max(0, index - 1);
    else if (event.key === 'ArrowRight') target = Math.min(last, index + 1);
    else return;
    event.preventDefault();
    onChoose(target);
    steps.current[target]?.focus({ preventScroll: true });
  }

  return (
    <div className="stepper-progress" role="group" aria-label="Escolher um tratamento">
      {labels.map((label, index) => (
        <button key={label} type="button" className="stepper-progress__step"
          ref={element => { steps.current[index] = element; }} tabIndex={current === index ? 0 : -1}
          aria-current={current === index ? 'step' : undefined} aria-label={`Etapa ${index + 1}: ${label}`}
          data-state={index === current ? 'active' : index < current ? 'complete' : 'pending'}
          onClick={() => onChoose(index)} onKeyDown={event => move(event, index)}>
          <span aria-hidden="true" className="stepper-progress__rail" />
        </button>
      ))}
    </div>
  );
}
