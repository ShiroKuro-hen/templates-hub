import { useState } from 'react';

export type PlanFila = {
  id: string;
  nombre: string;
  descripcion: string;
  precio: string;
  periodo: string;
  incluye: string[];
  rec?: boolean;
};

const PLANES: PlanFila[] = [
  { id: 'inicial', nombre: 'Inicial', descripcion: 'Para probar con tu equipo sin pagar nada.', precio: '0 €', periodo: 'gratis', incluye: ['Hasta 3 personas', '5 proyectos activos', 'Historial de 30 días', 'Soporte de la comunidad'] },
  { id: 'profesional', nombre: 'Profesional', descripcion: 'Para equipos que trabajan a diario en Nimbo.', precio: '8 €', periodo: 'por persona al mes', rec: true, incluye: ['Personas ilimitadas', 'Proyectos ilimitados', 'Informes y automatizaciones', 'Soporte por chat en 4 horas'] },
  { id: 'negocio', nombre: 'Negocio', descripcion: 'Para organizaciones con requisitos de seguridad.', precio: '18 €', periodo: 'por persona al mes', incluye: ['Todo lo del plan Profesional', 'SSO y registro de auditoría', 'Disponibilidad del 99,9 %', 'Gerente de cuenta'] },
];

export function MinimalPlans({ planes = PLANES }: { planes?: PlanFila[] }) {
  const [abiertos, setAbiertos] = useState<string[]>([]);
  const [elegido, setElegido] = useState<string | null>(null);
  const alternar = (id: string) =>
    setAbiertos((lista) => (lista.includes(id) ? lista.filter((x) => x !== id) : [...lista, id]));
  const nombreElegido = planes.find((p) => p.id === elegido)?.nombre;

  return (
    <section className="plans" aria-labelledby="pt">
      <h2 id="pt">Elige tu plan</h2>
      <p className="intro">Cambia de plan cuando quieras. Sin permanencia.</p>
      {planes.map((p) => {
        const open = abiertos.includes(p.id);
        const picked = elegido === p.id;
        return (
          <article key={p.id} className={`row${p.rec ? ' rec' : ''}`}>
            <div className="info">
              <h3 className="name">
                {p.nombre}
                {p.rec && <span className="tag">Recomendado</span>}
              </h3>
              <p>{p.descripcion}</p>
              <button type="button" className="toggle" aria-expanded={open} aria-controls={`f-${p.id}`} onClick={() => alternar(p.id)}>
                Qué incluye <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path d="M4 6l4 4 4-4" /></svg>
              </button>
            </div>
            <p className="price"><strong>{p.precio}</strong><span>{p.periodo}</span></p>
            <button type="button" className="pick" aria-pressed={picked} onClick={() => setElegido(p.id)}>
              {picked ? 'Elegido' : 'Elegir'}
            </button>
            <ul id={`f-${p.id}`} className="feat" hidden={!open}>
              {p.incluye.map((texto) => <li key={texto}>{texto}</li>)}
            </ul>
          </article>
        );
      })}
      <p className="picked" role="status">{nombreElegido ? `Plan elegido: ${nombreElegido}.` : ''}</p>
    </section>
  );
}
// CSS: copia los tokens :root y las reglas .plans, .row (.rec, .rec::before), .info, .name, .tag, .toggle (svg), .price, .pick (.rec .pick, [aria-pressed=true]), .feat, .picked, [hidden] y las media queries de la pestaña HTML + CSS.
