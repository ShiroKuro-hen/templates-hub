import { useState } from 'react';

type S = 'done' | 'current' | 'error' | 'todo';
const STEPS = [
  { name: 'Dominio', title: 'Conecta tu dominio', text: 'Apunta tu dominio al servidor con un registro CNAME.' },
  { name: 'Contenido', title: 'Revisa el contenido', text: 'Agrega la imagen de portada para poder continuar.' },
  { name: 'Pagos', title: 'Configura los pagos', text: 'Conecta una cuenta bancaria para cobrar a tus clientes.' },
  { name: 'Publicación', title: 'Publica tu sitio', text: 'Revisa el resumen y publica cuando estés listo.' },
];
const SUB: Record<S, string> = { done: 'Completo', error: 'Requiere atención', current: 'En curso', todo: 'Pendiente' };

export function StepperNav() {
  const [cur, setCur] = useState(2);
  const [max, setMax] = useState(2);
  const [errors, setErrors] = useState<Record<number, string>>({ 1: 'Falta la imagen de portada' });

  const state = (i: number): S => (i === cur ? 'current' : i > max ? 'todo' : errors[i] ? 'error' : 'done');
  const next = () => {
    setErrors(({ [cur]: _gone, ...rest }) => rest);
    setCur(cur + 1);
    setMax(Math.max(max, cur + 1));
  };
  const info = STEPS[cur] ?? { title: 'Sitio publicado', text: 'Tu sitio ya está disponible en tu dominio.' };

  return (
    <section className="card" aria-label="Publicar un sitio">
      <nav aria-label="Pasos para publicar tu sitio">
        <ol>
          {STEPS.map((st, i) => {
            const s = state(i);
            const body = (
              <>
                <span className="dot">
                  {s === 'done' ? (
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                  ) : s === 'error' ? '!' : i + 1}
                </span>
                <span>
                  <span className="lbl">{st.name}</span>
                  <span className="sub">{s === 'error' ? errors[i] : SUB[s]}</span>
                </span>
              </>
            );
            return (
              <li key={st.name} data-s={s}>
                {s === 'todo' ? (
                  <span className="step">{body}</span>
                ) : (
                  <a className="step" href={`#paso-${i + 1}`} aria-current={s === 'current' ? 'step' : undefined}
                     onClick={(e) => { e.preventDefault(); setCur(i); }}>{body}</a>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
      <div className="panel" aria-live="polite">
        <h2>{info.title}</h2>
        <p>{info.text}</p>
        <div className="row">
          <button className="btn" type="button" disabled={cur === 0} onClick={() => setCur(cur - 1)}>Atrás</button>
          <button className="btn p" type="button" disabled={cur > 3} onClick={next}>
            {cur === 3 ? 'Publicar sitio' : 'Continuar'}
          </button>
        </div>
      </div>
    </section>
  );
}

// CSS: copia las reglas .card, ol, li, .step, .dot, .lbl, .sub, .panel, .row y .btn de la pestaña HTML + CSS.
