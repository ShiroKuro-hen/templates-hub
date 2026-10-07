import { useId, useState } from 'react';
import type { CSSProperties } from 'react';

type RingProps = { value: number; label: string; detail: string; critico?: number };

// Requiere un <linearGradient id="g"> en el documento (ver pestaña HTML + CSS).
export function ProgressCircle({ value, label, detail, critico = 90 }: RingProps) {
  const id = useId();
  const v = Math.min(100, Math.max(0, value));
  return (
    <figure className="ring" style={{ margin: 0 }}>
      <div
        className={v > critico ? 'dial crit' : 'dial'}
        style={{ '--p': v } as CSSProperties}
        role="progressbar"
        aria-labelledby={id}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={v}
      >
        <svg viewBox="0 0 120 120" aria-hidden="true">
          <circle className="track" cx="60" cy="60" r="52" />
          <circle className="fill" cx="60" cy="60" r="52" pathLength={100} />
        </svg>
        <span className="val" aria-hidden="true"><span>{v}<small>%</small></span></span>
      </div>
      <figcaption id={id}>{label}<small>{detail}</small></figcaption>
    </figure>
  );
}

export function WorkspaceStatus() {
  const [migracion, setMigracion] = useState(72);
  return (
    <section className="card" aria-labelledby="pc-titulo">
      <svg width="0" height="0" aria-hidden="true" style={{ position: 'absolute' }}>
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" />
          </linearGradient>
        </defs>
      </svg>
      <h2 id="pc-titulo">Estado del espacio de trabajo</h2>
      <div className="grid">
        <ProgressCircle value={migracion} label="Migración de datos" detail="18 de 25 tablas" />
        <ProgressCircle value={45} label="Tareas completadas" detail="27 de 60 tareas" />
        <ProgressCircle value={94} label="Cuota de API" detail="Cerca del límite" />
      </div>
      <div className="ctl">
        <label htmlFor="pc-sim">Simular avance de la migración</label>
        <input id="pc-sim" type="range" min={0} max={100} value={migracion} onChange={(e) => setMigracion(+e.target.value)} />
      </div>
    </section>
  );
}

// CSS: copia las reglas .card, .grid, .dial, circle, .fill, .val y .ctl de la pestaña HTML + CSS.
