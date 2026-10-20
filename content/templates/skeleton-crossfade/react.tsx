import { useEffect, useRef, useState } from 'react';

const PROFILES = [
  { id: 'marta', ini: 'MR', name: 'Marta Ruiz', role: 'Diseñadora de producto', bio: 'Lidera el sistema de diseño y la documentación de componentes.', status: 'Disponible', tone: 'ok' },
  { id: 'luis', ini: 'LG', name: 'Luis Gómez', role: 'Ingeniero de datos', bio: 'Construye los pipelines de métricas y los paneles de seguimiento.', status: 'En reunión', tone: 'warn' },
  { id: 'carlos', ini: 'CD', name: 'Carlos Díaz', role: 'Responsable de seguridad', bio: 'Coordina auditorías de accesos y la respuesta a incidentes.', status: 'Fuera hoy', tone: 'idle' },
];

export function SkeletonCrossfade() {
  const [loading, setLoading] = useState(true);
  const timer = useRef<number>();

  function load() {
    window.clearTimeout(timer.current);
    setLoading(true);
    timer.current = window.setTimeout(() => setLoading(false), 1200);
  }

  useEffect(() => {
    load();
    return () => window.clearTimeout(timer.current);
  }, []);

  return (
    <section className="stage" data-state={loading ? 'loading' : 'ready'}>
      <header className="head">
        <h1>Equipo</h1>
        <button type="button" className="reload" onClick={load}>Recargar</button>
      </header>
      <p className="status" aria-live="polite">{loading ? 'Cargando perfiles…' : 'Perfiles cargados.'}</p>
      <ul className="grid" aria-busy={loading}>
        {PROFILES.map((p) => (
          <li key={p.id} className="card">
            <div className="layer sk" aria-hidden="true">
              <div className="who"><i className="bone circ" /><div className="bones"><i className="bone w1" /><i className="bone w2" /></div></div>
              <i className="bone" />
              <i className="bone w3" />
              <i className="bone tag" />
            </div>
            <div className="layer real" inert={loading}>
              <div className="who"><span className="av" aria-hidden="true">{p.ini}</span><div><b>{p.name}</b><small>{p.role}</small></div></div>
              <p>{p.bio}</p>
              <span className={`pill ${p.tone}`}>{p.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
