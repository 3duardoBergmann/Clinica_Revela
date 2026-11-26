import './StrokeText.css';

// Stroke Text's outline-then-fill sequence, using Revela's original vector shape.
const wordmark = '/media/revela-letreiro.svg#revela-forma';

export default function StrokeText() {
  return (
    <svg className="hero-word" viewBox="279 517 715 117" role="img" aria-label="Revela">
      <use href={wordmark} className="stroke-draw" />
      <use href={wordmark} className="stroke-fill" />
    </svg>
  );
}
