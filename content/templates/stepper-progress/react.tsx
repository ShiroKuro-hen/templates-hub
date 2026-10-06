import { useState } from 'react';

type Props = {
  steps?: string[];
  initial?: number; // índice del paso actual
};

const LABEL = { done: 'completado', current: 'paso actual', pending: 'pendiente' } as const;

export function Stepper({ steps = ['Carrito', 'Envío', 'Pago', 'Listo'], initial = 1 }: Props) {
  const [cur, setCur] = useState(initial);

  return (
    <>
      <nav aria-label="Progreso">
        <ol className="steps">
          {steps.map((name, i) => {
            const state = i < cur ? 'done' : i === cur ? 'current' : 'pending';
            return (
              <li key={name} className="step" data-state={state} aria-current={state === 'current' ? 'step' : undefined}>
                <span className="dot">{state === 'done' ? '✓' : <span>{i + 1}</span>}</span>
                {name}
                <span className="sr">({LABEL[state]})</span>
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="nav">
        <button type="button" className="btn" disabled={cur === 0} onClick={() => setCur(cur - 1)}>
          Atrás
        </button>
        <button type="button" className="btn primary" disabled={cur === steps.length - 1} onClick={() => setCur(cur + 1)}>
          Continuar
        </button>
      </div>
    </>
  );
}
// CSS: copia las reglas .steps / .step / .dot / .sr / .nav / .btn y los tokens :root de la pestaña HTML + CSS (los estados usan [data-state]).
