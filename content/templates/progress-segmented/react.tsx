import { useState, type CSSProperties } from 'react';

const NAMES = ['Compilación', 'Pruebas', 'Revisión', 'Staging', 'Producción'];
const INIT = [100, 100, 60, 0, 0]; // % por etapa

export function ProgressSegmented() {
  const [p, setP] = useState(INIT);
  const cur = p.findIndex((v) => v < 100);
  const avanzar = () => setP(p.map((v, i) => (i === cur ? Math.min(100, v + 20) : v)));

  return (
    <section className="card" aria-labelledby="t">
      <header>
        <div>
          <h2 id="t">Despliegue de la versión 4.2</h2>
          <p aria-live="polite">
            {cur < 0 ? 'Despliegue completo: las 5 etapas terminaron.' : `${cur} de 5 etapas completadas. En curso: ${NAMES[cur]}.`}
          </p>
        </div>
        <div className="actions">
          <button type="button" onClick={() => setP(INIT)}>Reiniciar</button>
          <button type="button" className="primary" disabled={cur < 0} onClick={avanzar}>Avanzar etapa</button>
        </div>
      </header>
      <ol>
        {NAMES.map((n, i) => {
          const s = p[i] >= 100 ? 'done' : i === cur ? 'active' : 'todo';
          const texto = s === 'done' ? 'Completada' : s === 'todo' ? 'Pendiente' : `En curso, ${p[i]}%`;
          return (
            <li key={n} data-s={s}>
              <div className="track" role="progressbar" aria-label={n} aria-valuemin={0} aria-valuemax={100} aria-valuenow={p[i]}>
                <i style={{ '--p': p[i] } as CSSProperties} />
              </div>
              <strong>{n}</strong>
              <small>{texto}</small>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
// CSS: copia las reglas .card, .actions, button, ol, li, .track, strong y small de la pestaña HTML + CSS.
