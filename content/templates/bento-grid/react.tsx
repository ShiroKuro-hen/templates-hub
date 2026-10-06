import type { ReactNode } from 'react';

export type BentoCell = {
  area: 'hero' | 'kpi' | 'streak' | 'chart' | 'note' | 'tag'; // nombre del grid-area
  titulo: string;
  contenido: ReactNode;
};

const DEMO: BentoCell[] = [
  { area: 'hero', titulo: 'Esta semana', contenido: <><p className="big">42 h</p><p>de trabajo enfocado, 6 h más que la anterior.</p></> },
  { area: 'kpi', titulo: 'Tareas hechas', contenido: <p className="big">98%</p> },
  { area: 'streak', titulo: 'Racha', contenido: <p className="big">12 días</p> },
  {
    area: 'chart',
    titulo: 'Horas por día',
    contenido: (
      <>
        <div className="bars" role="img" aria-label="Horas por día: lunes 6, martes 8, miércoles 5, jueves 9, viernes 7, sábado 4, domingo 3">
          {[60, 80, 50, 90, 70, 40, 30].map((h, i) => <i key={i} className={h === 90 ? 'max' : undefined} style={{ height: `${h}%` }} />)}
        </div>
        <p>Mejor día: jueves</p>
      </>
    ),
  },
  { area: 'note', titulo: 'Nota', contenido: <p>Revisar el informe antes del viernes.</p> },
  { area: 'tag', titulo: 'Estado', contenido: <p><span className="chip">En marcha</span></p> },
];

export function BentoGrid({ cells = DEMO }: { cells?: BentoCell[] }) {
  return (
    <main className="bento">
      {cells.map((c) => (
        <section key={c.area} className={`cell ${c.area}`}>
          <h2>{c.titulo}</h2>
          {c.contenido}
        </section>
      ))}
    </main>
  );
}
// CSS: copia las reglas .bento / .cell / .big / .hero .kpi .streak .chart .note .tag (grid-area) / .bars / .chip y los tokens :root de la pestaña HTML + CSS.
