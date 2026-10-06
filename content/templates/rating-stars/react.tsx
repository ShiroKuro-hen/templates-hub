import { Fragment, useId, useState } from 'react';

const WORDS = ['', 'Muy malo', 'Regular', 'Bien', 'Muy bien', 'Excelente'];

type Props = {
  legend?: string;
  value?: number; // controlado (opcional)
  onChange?: (value: number) => void;
};

export function RatingStars({ legend = '¿Qué tal estuvo el servicio?', value, onChange }: Props) {
  const name = useId();
  const [inner, setInner] = useState(0);
  const current = value ?? inner;

  const pick = (n: number) => {
    setInner(n);
    onChange?.(n);
  };

  return (
    <fieldset>
      <legend>{legend}</legend>
      <div className="rate">
        {[1, 2, 3, 4, 5].map((n) => (
          <Fragment key={n}>
            <input type="radio" name={name} id={`${name}-${n}`} value={n} checked={current === n} onChange={() => pick(n)} />
            <label htmlFor={`${name}-${n}`}>
              <svg className="star" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 2.8l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.7l-5.9 3.1 1.2-6.5L2.5 9.7l6.6-.9z" />
              </svg>
              <span className="sr">{n} {n === 1 ? 'estrella' : 'estrellas'}</span>
            </label>
          </Fragment>
        ))}
      </div>
      <output aria-live="polite">
        {current ? `Tu valoración: ${current} de 5 · ${WORDS[current]}` : 'Elige de 1 a 5 estrellas'}
      </output>
    </fieldset>
  );
}
// CSS: copia las reglas .rate / .rate input / .rate label / .star / .sr / output de la pestaña HTML + CSS.