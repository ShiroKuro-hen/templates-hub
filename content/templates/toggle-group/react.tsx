import { useState } from 'react';

type Feature = { id: string; titulo: string; descripcion: string; activo: boolean; plan?: string };

const FEATURES: Feature[] = [
  { id: 'autoguardado', titulo: 'Autoguardado', descripcion: 'Guarda tus cambios cada 30 segundos.', activo: true },
  { id: 'tiempo-real', titulo: 'Comentarios en tiempo real', descripcion: 'Muestra los comentarios del equipo sin recargar.', activo: true },
  { id: 'publica', titulo: 'Vista previa pública', descripcion: 'Cualquiera con el enlace puede ver el documento.', activo: false },
  { id: 'resumen', titulo: 'Resumen semanal', descripcion: 'Recibe los cambios de la semana cada lunes.', activo: true },
  { id: 'auditoria', titulo: 'Registro de auditoría', descripcion: 'Disponible al mejorar tu plan.', activo: false, plan: 'Plan Business' },
];

export function ToggleGroup({ features = FEATURES }: { features?: Feature[] }) {
  const [on, setOn] = useState<Record<string, boolean>>(
    Object.fromEntries(features.map((f) => [f.id, f.activo])),
  );
  const disponibles = features.filter((f) => !f.plan);
  const activas = disponibles.filter((f) => on[f.id]).length;

  return (
    <div className="card" role="group" aria-labelledby="tg-titulo">
      <header>
        <h2 id="tg-titulo">Funciones del espacio</h2>
        <p className="sum" aria-live="polite"><b>{activas}</b> de {disponibles.length} activadas</p>
      </header>
      {features.map((f) => (
        <div className="row" key={f.id}>
          <div>
            <label htmlFor={`tg-${f.id}`}>
              {f.titulo}
              {f.plan && <span className="badge">{f.plan}</span>}
            </label>
            <p id={`tg-${f.id}-d`}>{f.descripcion}</p>
          </div>
          <input
            id={`tg-${f.id}`}
            type="checkbox"
            role="switch"
            checked={!!on[f.id]}
            disabled={!!f.plan}
            aria-describedby={`tg-${f.id}-d`}
            onChange={(e) => setOn({ ...on, [f.id]: e.target.checked })}
          />
          <span className="st" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

// CSS: copia las reglas .card, header, .row, .badge, .st e input[role=switch] de la pestaña HTML + CSS.
