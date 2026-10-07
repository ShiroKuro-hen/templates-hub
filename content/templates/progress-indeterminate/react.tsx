import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';

export function ProgressStates() {
  const [p, setP] = useState(0);
  const done = p >= 100;

  useEffect(() => {
    if (done) return;
    const t = setInterval(() => setP((v) => Math.min(100, Math.round(v + 4 + Math.random() * 10))), 300);
    return () => clearInterval(t);
  }, [done]);

  return (
    <section className="card" aria-labelledby="t">
      <h2 id="t">Estado de los procesos</h2>
      <div className="row">
        <div className="head"><span id="l1">Sincronizando contactos</span><span>En curso</span></div>
        <div className="track" role="progressbar" aria-labelledby="l1" aria-valuetext="Sincronizando">
          <span className="fill ind" />
        </div>
      </div>
      <div className={done ? 'row ok' : 'row'}>
        <div className="head"><span id="l2">Subiendo informe-q3.pdf</span><span>{p} %</span></div>
        <div className="track" role="progressbar" aria-labelledby="l2" aria-valuemin={0} aria-valuemax={100} aria-valuenow={p}>
          <span className="fill" style={{ '--p': `${p}%` } as CSSProperties} />
        </div>
        <p className="note" aria-live="polite">
          {done ? 'Archivo subido correctamente.' : 'Subiendo, quedan unos segundos.'}
        </p>
      </div>
      <div className="row err">
        <div className="head"><span id="l3">Copia de seguridad</span><span>38 %</span></div>
        <div className="track" role="progressbar" aria-labelledby="l3" aria-valuemin={0} aria-valuemax={100} aria-valuenow={38}>
          <span className="fill" style={{ '--p': '38%' } as CSSProperties} />
        </div>
        <p className="note">Se detuvo en 38 %. Revisa tu conexión y vuelve a iniciar la copia.</p>
      </div>
      <button className="btn" type="button" onClick={() => setP(0)}>Reiniciar subida</button>
    </section>
  );
}

// CSS: copia las reglas .card, .row, .head, .track, .fill, .ind, .note y .btn de la pestaña HTML + CSS.
