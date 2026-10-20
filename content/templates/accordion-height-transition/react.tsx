import { useId, useState } from 'react';

type Item = { id: string; pregunta: string; respuesta: string };

const ITEMS: Item[] = [
  { id: 'migracion', pregunta: '¿Cuánto tarda la migración?', respuesta: 'Entre 2 y 5 días hábiles según el volumen de datos. Te avisamos antes de cada corte.' },
  { id: 'datos', pregunta: '¿Mis datos se conservan?', respuesta: 'Sí. Hacemos una copia completa antes de empezar y puedes restaurarla durante 30 días.' },
  { id: 'equipo', pregunta: '¿Necesito detener mi equipo?', respuesta: 'No. Trabajamos en horario de bajo tráfico y el servicio se mantiene disponible.' },
];

export function AccordionHeightTransition({ items = ITEMS }: { items?: Item[] }) {
  const [openIds, setOpenIds] = useState<string[]>(items.slice(0, 1).map((it) => it.id));
  const [single, setSingle] = useState(true);
  const uid = useId();

  function toggle(id: string) {
    setOpenIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return single ? [id] : [...prev, id];
    });
  }

  return (
    <main className="wrap">
      <div className="head">
        <h1>Preguntas frecuentes</h1>
        <label className="toggle">
          <input type="checkbox" checked={single} onChange={(e) => setSingle(e.target.checked)} /> Abrir uno a la vez
        </label>
      </div>
      <div className="acc">
        {items.map((it) => {
          const open = openIds.includes(it.id);
          const panelId = `${uid}-${it.id}`;
          return (
            <section key={it.id} className="item">
              <h2>
                <button type="button" className="trigger" aria-expanded={open} aria-controls={panelId} onClick={() => toggle(it.id)}>
                  {it.pregunta}
                  <svg className="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6" /></svg>
                </button>
              </h2>
              <div id={panelId} className={`panel${open ? ' open' : ''}`}>
                <div><p>{it.respuesta}</p></div>
              </div>
            </section>
          );
        })}
      </div>
    </main>
  );
}
// CSS: copia las reglas :root, .wrap, .head, h1, .toggle, .acc, .item, .trigger, .chev, .panel (y sus > div y p), :focus-visible, [hidden] y @media de la pestaña HTML + CSS.
