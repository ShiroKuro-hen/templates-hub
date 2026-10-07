type Articulo = {
  id: string;
  categoria: string;
  tono: 'info' | 'ok';
  titulo: string;
  resumen: string;
  lectura: string;
  fecha: string;
  iso: string;
  arte: 'linea' | 'colinas';
  invertida?: boolean;
};

const ARTICULOS: Articulo[] = [
  { id: 'a1', categoria: 'Seguridad', tono: 'info', titulo: 'Activa la verificación en dos pasos',
    resumen: 'Protege tu cuenta con un código temporal. Tarda menos de dos minutos.',
    lectura: 'Lectura de 4 min', fecha: '12 mar 2026', iso: '2026-03-12', arte: 'linea' },
  { id: 'a2', categoria: 'Facturación', tono: 'ok', titulo: 'Entiende tu primera factura',
    resumen: 'Revisa qué incluye cada línea, cómo se prorratea el plan y dónde descargar el PDF.',
    lectura: 'Lectura de 6 min', fecha: '3 feb 2026', iso: '2026-02-03', arte: 'colinas', invertida: true },
];

function Arte({ tipo, id }: { tipo: Articulo['arte']; id: string }) {
  return (
    <svg viewBox="0 0 240 180" preserveAspectRatio="xMidYMid slice" aria-hidden="true" focusable="false">
      <defs><linearGradient id={id} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
      <rect className="bg" width="240" height="180" />
      {tipo === 'linea' ? (<>
        <path className="gl" d="M0 45H240M0 90H240M0 135H240M60 0V180M120 0V180M180 0V180" />
        <path d="M0 140L50 110L95 124L150 66L240 40V180H0Z" fill={`url(#${id})`} opacity=".16" />
        <path d="M0 140L50 110L95 124L150 66L240 40" fill="none" stroke={`url(#${id})`} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
        <circle className="dot" cx="150" cy="66" r="6" />
      </>) : (<>
        <circle cx="170" cy="58" r="26" fill={`url(#${id})`} />
        <path className="h1" d="M0 150Q60 100 120 130T240 110V180H0Z" />
        <path className="h2" d="M0 165Q70 125 130 150T240 135V180H0Z" />
      </>)}
    </svg>
  );
}

export function CardHorizontal({ articulos = ARTICULOS }: { articulos?: Articulo[] }) {
  return (
    <div className="list">
      {articulos.map((a) => (
        <article key={a.id} className={a.invertida ? 'card rev' : 'card'}>
          <div className="art"><Arte tipo={a.arte} id={`g-${a.id}`} /></div>
          <div className="body">
            <span className={a.tono === 'ok' ? 'badge ok' : 'badge'}>{a.categoria}</span>
            <h2>{a.titulo}</h2>
            <p>{a.resumen}</p>
            <div className="meta"><span>{a.lectura}</span><time dateTime={a.iso}>{a.fecha}</time></div>
            <a className="btn" href="#">Leer guía</a>
          </div>
        </article>
      ))}
    </div>
  );
}

// CSS: copia las reglas .list, .card, .art, .bg, .gl, .dot, .h1, .h2, .body, .badge y .btn de la pestaña HTML + CSS.
