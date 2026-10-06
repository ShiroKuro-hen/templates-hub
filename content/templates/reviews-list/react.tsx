import { useMemo, useState } from 'react';

type Review = { id: number; r: number; d: string; a: string; t: string; x: string; v: boolean; h: number };
const DATA: Review[] = [
  { id: 0, r: 5, d: '2026-09-28', a: 'Laura M.', t: 'Justo lo que buscaba', x: 'Llegó en dos días y la batería dura toda la semana. La app es clara y el ajuste de la correa es muy cómodo.', v: true, h: 14 },
  { id: 1, r: 4, d: '2026-09-15', a: 'Carlos R.', t: 'Muy buena relación calidad-precio', x: 'Pantalla nítida y buen GPS. Echo en falta más esferas gratuitas.', v: true, h: 9 },
  { id: 2, r: 3, d: '2026-08-21', a: 'Javier P.', t: 'Cumple, sin más', x: 'Funciona bien, pero las notificaciones tardan unos segundos en aparecer.', v: false, h: 3 },
  { id: 3, r: 2, d: '2026-08-10', a: 'Elena T.', t: 'La correa se despegó', x: 'A los dos meses la correa empezó a soltarse. El soporte la cambió, pero tardó diez días.', v: true, h: 11 },
  { id: 4, r: 5, d: '2026-06-25', a: 'Íñigo L.', t: 'Batería excelente', x: 'Con uso normal llego a nueve días sin cargar.', v: true, h: 4 },
  { id: 5, r: 1, d: '2026-06-03', a: 'Rosa D.', t: 'No encendía', x: 'Llegó sin carga y no respondía al cargador. Pedí la devolución.', v: true, h: 1 },
];
type Sort = 'new' | 'high' | 'low' | 'help';
const Stars = ({ n }: { n: number }) => <span className="stars">{'★'.repeat(n)}<span className="off">{'★'.repeat(5 - n)}</span></span>;
const fmt = (d: string) => new Date(d).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

export function ReviewsList({ reviews = DATA }: { reviews?: Review[] }) {
  const [filter, setFilter] = useState(0);
  const [sort, setSort] = useState<Sort>('new');
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const votes = (x: Review) => x.h + +liked.has(x.id);
  const avg = reviews.reduce((s, x) => s + x.r, 0) / reviews.length;

  const rows = useMemo(() => {
    const cmp = { new: (a: Review, b: Review) => b.d.localeCompare(a.d), high: (a: Review, b: Review) => b.r - a.r,
                  low: (a: Review, b: Review) => a.r - b.r, help: (a: Review, b: Review) => votes(b) - votes(a) };
    return reviews.filter((x) => !filter || x.r === filter).sort(cmp[sort]);
  }, [reviews, filter, sort, liked]);
  const toggle = (id: number) => setLiked((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n; });

  return (
    <section className="reviews" aria-label="Reseñas de clientes">
      <div className="card summary">
        <div className="score" role="img" aria-label={`Valoración media ${avg.toFixed(1)} de 5, ${reviews.length} reseñas`}>
          <b>{avg.toFixed(1).replace('.', ',')}</b><Stars n={Math.round(avg)} /><br /><span>{reviews.length} reseñas</span>
        </div>
        <div className="dist" role="group" aria-label="Filtrar por valoración">
          {[5, 4, 3, 2, 1].map((n) => {
            const c = reviews.filter((x) => x.r === n).length;
            return (
              <button key={n} type="button" disabled={!c} aria-pressed={filter === n} aria-label={`${n} estrellas, ${c} reseñas`}
                      onClick={() => setFilter(filter === n ? 0 : n)}>
                <span aria-hidden="true">{n} ★</span>
                <span className="track" aria-hidden="true"><i style={{ ['--p' as string]: (c / reviews.length) * 100 }} /></span>
                <span className="num" aria-hidden="true">{c}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div className="bar">
        <span role="status">Mostrando {rows.length} de {reviews.length}{filter > 0 && <button className="link" type="button" onClick={() => setFilter(0)}>Quitar filtro</button>}</span>
        <label>Ordenar por
          <select value={sort} onChange={(e) => setSort(e.target.value as Sort)}>
            <option value="new">Más recientes</option><option value="high">Mejor valoradas</option>
            <option value="low">Menos valoradas</option><option value="help">Más útiles</option>
          </select>
        </label>
      </div>
      <ol>
        {rows.map((x) => (
          <li key={x.id}>
            <article className="card">
              <header><span role="img" aria-label={`${x.r} de 5 estrellas`}><Stars n={x.r} /></span><time className="who" dateTime={x.d}>{fmt(x.d)}</time></header>
              <h3>{x.t}</h3><p>{x.x}</p>
              <div className="who">{x.a}{x.v && <span className="ok">Compra verificada</span>}</div>
              <button className="help" type="button" aria-pressed={liked.has(x.id)} onClick={() => toggle(x.id)}>
                Me resulta útil <span className="num">{votes(x)}</span>
              </button>
            </article>
          </li>
        ))}
      </ol>
    </section>
  );
}

// CSS: copia las reglas .reviews, .card, .summary, .score, .stars, .dist, .track, .bar, article, .ok y .help de la pestaña HTML + CSS.
