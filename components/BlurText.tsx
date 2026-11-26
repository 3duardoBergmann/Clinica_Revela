import { Fragment, type CSSProperties } from 'react';
import './BlurText.css';

// React Bits BlurText's word stagger, synchronized to the existing hero timeline.
export default function BlurText({ text, order = 0, titleLine = false }: {
  text: string; order?: number; titleLine?: boolean;
}) {
  return (
    <span className={titleLine ? 'blur-text hero-title-line' : 'blur-text'} data-hero-line={titleLine || undefined}>
      {text.split(' ').map((word, index) => (
        <Fragment key={index}>
          {index > 0 ? ' ' : null}
          <span className="blur-text__word" style={{ '--word-index': index + order } as CSSProperties}>
            <span>{word}</span>
          </span>
        </Fragment>
      ))}
    </span>
  );
}
