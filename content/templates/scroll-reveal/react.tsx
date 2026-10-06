import { useEffect, useRef, useState } from 'react';

type Item = { fecha: string; iso: string; titulo: string; texto: string; tag: 'ok' | 'info' | 'warn'; etiqueta: string };
const ITEMS: Item[] = [
  { fecha: '30 sep', iso: '2026-09-30', titulo: 'Búsqueda global', texto: 'Encuentra proyectos, personas y documentos desde un solo campo.', tag: 'ok', etiqueta: 'Nuevo' },
  { fecha: '24 sep', iso: '2026-09-24', titulo: 'Paneles más rápidos', texto: 'Los informes cargan un 40 % antes en conexiones lentas.', tag: 'info', etiqueta: 'Mejora' },
  { fecha: '17 sep', iso: '2026-09-17', titulo: 'Exportación a CSV', texto: 'Descarga cualquier tabla con los filtros aplicados.', tag: 'ok', etiqueta: 'Nuevo' },
  { fecha: '10 sep', iso: '2026-09-10', titulo: 'Zonas horarias corregidas', texto: 'Las alertas ya respetan la zona horaria de cada equipo.', tag: 'warn', etiqueta: 'Corrección' },
];
const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

export function ScrollReveal({ items = ITEMS }: { items?: Item[] }) {
  const sc = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState<Record<number, number>>({}); // índice -> retraso en ms
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (calm || !sc.current) return;
    const io = new IntersectionObserver((es) => {
      const hits = es.filter((e) => e.isIntersecting);
      hits.forEach((e) => io.unobserve(e.target));
      setShown((s) => {
        const n = { ...s };
        hits.forEach((e, k) => { n[Number((e.target as HTMLElement).dataset.i)] = k * 90; });
        return n;
      });
    }, { root: sc.current, threshold: 0.25 });
    sc.current.querySelectorAll('.item').forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [run]);

  const repeat = () => { sc.current?.scrollTo({ top: 0 }); setShown({}); setRun((r) => r + 1); };

  return (
    <section className="panel">
      <div className="bar">
        <div><h1>Novedades de la versión 4.2</h1><p>Desplázate por el panel para ver cada cambio.</p></div>
        {!calm && <button className="btn" type="button" onClick={repeat}>Repetir</button>}
      </div>
      <div className="scroller" ref={sc} tabIndex={0} role="region" aria-label="Lista de novedades">
        <ol className="list">
          {items.map((it, i) => (
            <li key={it.iso} data-i={i} className={`item${i === 0 ? ' first' : ''}${calm || i in shown ? '' : ' hide'}`}
                style={{ transitionDelay: `${shown[i] ?? 0}ms` }}>
              <time dateTime={it.iso}>{it.fecha}</time><h2>{it.titulo}</h2><p>{it.texto}</p>
              <span className={`tag ${it.tag}`}>{it.etiqueta}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

// CSS: copia las reglas .panel, .bar, .btn, .scroller, .item, .hide y .tag de la pestaña HTML + CSS.
