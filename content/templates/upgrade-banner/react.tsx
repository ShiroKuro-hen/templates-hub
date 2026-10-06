import { useEffect, useState } from 'react';

type Props = { endsAt?: number; totalDays?: number };
const pad = (n: number) => String(n).padStart(2, '0');

export function UpgradeBanner({ endsAt, totalDays = 14 }: Props) {
  const [end] = useState(() => endsAt ?? Date.now() + (5 * 86400 + 19 * 3600 + 23 * 60 + 40) * 1000);
  const [now, setNow] = useState(() => Date.now());
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const s = Math.max(0, Math.floor((end - now) / 1000));
  const date = new Date(end);

  if (hidden) {
    return <button type="button" className="btn" id="again" autoFocus onClick={() => setHidden(false)}>Mostrar banner</button>;
  }
  return (
    <aside className="banner" aria-labelledby="ttl">
      <div className="row">
        <div className="txt">
          <strong id="ttl">
            {s ? <>Tu prueba de Pro termina el <time dateTime={date.toISOString()}>{date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}</time></> : 'Tu prueba de Pro ha terminado'}
          </strong>
          <p>{s ? 'Mejora tu plan para conservar informes ilimitados y hasta 10 personas en tu equipo.' : 'Mejora tu plan para recuperar el acceso a tus informes.'}</p>
        </div>
        <div className="cd" role="timer" aria-label="Tiempo restante de la prueba">
          <div><b>{Math.floor(s / 86400)}</b><span>días</span></div>
          <div><b>{pad(Math.floor((s % 86400) / 3600))}</b><span>horas</span></div>
          <div><b>{pad(Math.floor((s % 3600) / 60))}</b><span>min</span></div>
          <div><b>{pad(s % 60)}</b><span>seg</span></div>
        </div>
        <div className="acts">
          <button type="button" className="btn main">Mejorar plan</button>
          <button type="button" className="btn">Comparar planes</button>
        </div>
      </div>
      <button type="button" className="x" aria-label="Cerrar banner" onClick={() => setHidden(true)}>
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M3 3l8 8M11 3l-8 8" /></svg>
      </button>
      <progress max={totalDays} value={totalDays - Math.ceil(s / 86400)} aria-label="Días de prueba usados" />
    </aside>
  );
}

// CSS: copia las reglas .banner, .row, .txt, .cd, .acts, .btn, .x y progress de la pestaña HTML + CSS.
