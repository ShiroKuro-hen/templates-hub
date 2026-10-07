type Doc = { id: string; titulo: string; editado: string; lineas: number[] };

const DOCS: Doc[] = [
  { id: 'q3', titulo: 'Informe trimestral Q3', editado: 'Editado hace 2 horas por Marta Ruiz', lineas: [55, 90, 78, 84, 40] },
  { id: 'plan', titulo: 'Plan de lanzamiento', editado: 'Editado ayer por Luis Gómez', lineas: [70, 86, 62, 90, 52] },
  { id: 'pres', titulo: 'Presupuesto 2026', editado: 'Editado hace 3 días por Carlos Díaz', lineas: [45, 80, 92, 66, 74] },
];

type Props = {
  docs?: Doc[];
  onAbrir?: (d: Doc) => void;
  onCompartir?: (d: Doc) => void;
  onArchivar?: (d: Doc) => void;
};

export function CardHoverActions({ docs = DOCS, onAbrir, onCompartir, onArchivar }: Props) {
  return (
    <div className="grid">
      {docs.map((d) => (
        <article key={d.id} className="card">
          <div className="thumb">
            <div className="sk" aria-hidden="true">
              {d.lineas.map((w, i) => <i key={i} style={{ ['--w' as string]: w }} />)}
            </div>
            <div className="acts" role="group" aria-label={`Acciones de ${d.titulo}`}>
              <button type="button" className="btn pri" onClick={() => onAbrir?.(d)}>Abrir</button>
              <button type="button" className="btn" onClick={() => onCompartir?.(d)}>Compartir</button>
              <button type="button" className="btn" onClick={() => onArchivar?.(d)}>Archivar</button>
            </div>
          </div>
          <div className="body"><h2>{d.titulo}</h2><p className="meta">{d.editado}</p></div>
        </article>
      ))}
    </div>
  );
}

// CSS: copia las reglas .grid, .card, .thumb, .sk, .acts, .btn y .body de la pestaña HTML + CSS.
