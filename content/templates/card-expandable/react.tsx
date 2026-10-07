type Estado = 'curso' | 'riesgo' | 'listo';
type Proyecto = {
  id: string; titulo: string; responsable: string; estado: Estado; avance: number;
  entrega: string; presupuesto: string; equipo: string; hitos: { texto: string; iso: string; fecha: string }[];
  abierto?: boolean;
};

const ETIQUETA: Record<Estado, [string, string]> = { curso: ['En curso', 'badge'], riesgo: ['En riesgo', 'badge warn'], listo: ['Completado', 'badge ok'] };

const PROYECTOS: Proyecto[] = [
  { id: 'nube', titulo: 'Migración a la nube', responsable: 'Marta Ruiz', estado: 'curso', avance: 68, entrega: '30 abr 2026',
    presupuesto: 'S/ 84.000', equipo: '7 personas', abierto: true,
    hitos: [{ texto: 'Pruebas de carga', iso: '2026-03-14', fecha: '14 mar' }, { texto: 'Corte de la base de datos', iso: '2026-04-02', fecha: '2 abr' }] },
  { id: 'panel', titulo: 'Rediseño del panel de clientes', responsable: 'Luis Gómez', estado: 'riesgo', avance: 41, entrega: '18 may 2026',
    presupuesto: 'S/ 52.500', equipo: '4 personas',
    hitos: [{ texto: 'Validar prototipo con clientes', iso: '2026-03-20', fecha: '20 mar' }, { texto: 'Entrega de componentes', iso: '2026-04-15', fecha: '15 abr' }] },
  { id: 'audit', titulo: 'Auditoría de seguridad anual', responsable: 'Carlos Díaz', estado: 'listo', avance: 100, entrega: '28 feb 2026',
    presupuesto: 'S/ 31.200', equipo: '3 personas', hitos: [{ texto: 'Informe final firmado', iso: '2026-02-28', fecha: '28 feb' }] },
];

export function CardExpandable({ proyectos = PROYECTOS }: { proyectos?: Proyecto[] }) {
  return (
    <div className="list">
      {proyectos.map((p) => (
        <details key={p.id} open={p.abierto}>
          <summary>
            <span><span className="ttl">{p.titulo}</span><span className="own">Responsable: {p.responsable}</span></span>
            <span className="end">
              <span className={ETIQUETA[p.estado][1]}>{ETIQUETA[p.estado][0]}</span>
              <svg className="chev" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.5 6l4.5 4.5L12.5 6" /></svg>
            </span>
            <span className="pg" style={{ ['--p' as string]: p.avance }}><i />{p.avance}% completado</span>
          </summary>
          <div className="det">
            <dl>
              <div><dt>Entrega</dt><dd>{p.entrega}</dd></div>
              <div><dt>Presupuesto</dt><dd>{p.presupuesto}</dd></div>
              <div><dt>Equipo</dt><dd>{p.equipo}</dd></div>
            </dl>
            <ul className="ms">{p.hitos.map((h) => <li key={h.texto}><span>{h.texto}</span><time dateTime={h.iso}>{h.fecha}</time></li>)}</ul>
            <a className="btn" href="#">Ver proyecto</a>
          </div>
        </details>
      ))}
    </div>
  );
}

// CSS: copia las reglas :root{interpolate-size}, .list, details, ::details-content, summary, .badge, .pg y .det de la pestaña HTML + CSS.
