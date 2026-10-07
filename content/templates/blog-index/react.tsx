import { useState } from 'react';

type Post = { cat: string; title: string; text: string; autor: string; ini: string; fecha: string; cover?: string };
const POSTS: Post[] = [
  { cat: 'Producto', title: 'Presentamos las automatizaciones con vista previa', text: 'Prueba cada regla con datos reales antes de activarla.', autor: 'Diego Salazar', ini: 'DS', fecha: '28 sep, 4 min' },
  { cat: 'Ingeniería', title: 'Reducimos un 60 % la latencia del motor de reglas', text: 'Qué medimos, qué cambiamos y qué aprendimos en el proceso.', autor: 'Camila Torres', ini: 'CT', fecha: '24 sep, 9 min', cover: 'c2' },
  { cat: 'Seguridad', title: 'SSO y SCIM: guía de implementación para equipos de TI', text: 'Configura el acceso único y el aprovisionamiento en una tarde.', autor: 'Andrés Quispe', ini: 'AQ', fecha: '19 sep, 7 min', cover: 'c3' },
  { cat: 'Guías', title: 'Siete flujos que todo equipo de soporte debería tener', text: 'Asignación, escalamiento y encuestas de satisfacción listos para copiar.', autor: 'Lucía Mejía', ini: 'LM', fecha: '12 sep, 6 min', cover: 'c4' },
  { cat: 'Producto', title: 'Novedades de septiembre: paneles, filtros y permisos', text: 'Todo lo que lanzamos este mes, con ejemplos de uso.', autor: 'Diego Salazar', ini: 'DS', fecha: '5 sep, 3 min', cover: 'c2' },
  { cat: 'Seguridad', title: 'Nimbo abre su región de datos en São Paulo', text: 'Mantén tus datos en Latinoamérica con menor latencia.', autor: 'Andrés Quispe', ini: 'AQ', fecha: '1 sep, 3 min' },
];
const CATS = ['Todo', 'Producto', 'Ingeniería', 'Seguridad', 'Guías'];

export function BlogIndex({ posts = POSTS }: { posts?: Post[] }) {
  const [cat, setCat] = useState('Todo');
  const lista = posts.filter((p) => cat === 'Todo' || p.cat === cat);
  return (
    <div className="page">
      <header><h1>Blog de Nimbo</h1><p>Historias de clientes, guías prácticas y novedades del producto.</p></header>
      <div className="chips" role="group" aria-label="Filtrar por categoría">
        {CATS.map((c) => <button key={c} type="button" aria-pressed={c === cat} onClick={() => setCat(c)}>{c}</button>)}
      </div>
      <article className="card feat">
        <div className="cover" aria-hidden="true" />
        <div className="body">
          <span className="badge">Casos de éxito</span>
          <h2><a href="#">Cómo Kintsu automatizó 40.000 aprobaciones al mes sin perder el control</a></h2>
          <p>El equipo de finanzas pasó de tres días a tres horas en su cierre mensual. Estas son las reglas que lo hicieron posible.</p>
          <div className="meta"><span className="who"><span className="av">VR</span>Valeria Rojas</span><span>2 oct 2026, 8 min de lectura</span></div>
        </div>
      </article>
      <p className="count" role="status">
        {lista.length ? `${lista.length} ${lista.length === 1 ? 'artículo' : 'artículos'}` : 'No hay artículos en esta categoría. Prueba con otra.'}
      </p>
      <div className="grid">
        {lista.map((p) => (
          <article className="card" key={p.title}>
            <div className={`cover ${p.cover ?? ''}`} aria-hidden="true" />
            <div className="body">
              <span className="badge">{p.cat}</span>
              <h3><a href="#">{p.title}</a></h3>
              <p>{p.text}</p>
              <div className="meta"><span className="who"><span className="av">{p.ini}</span>{p.autor}</span><span>{p.fecha}</span></div>
            </div>
          </article>
        ))}
      </div>
      <nav aria-label="Paginación">
        <ul className="pager">
          <li><a href="#" aria-disabled="true">Anterior</a></li>
          <li><a href="#" aria-current="page" aria-label="Página 1">1</a></li>
          <li><a href="#" aria-label="Página 2">2</a></li>
          <li><a href="#" aria-label="Página 3">3</a></li>
          <li><a href="#">Siguiente</a></li>
        </ul>
      </nav>
    </div>
  );
}
// CSS: copia las reglas .page, .chips, .card, .cover, .body, .badge, .meta, .feat, .grid y .pager de la pestaña HTML + CSS.
