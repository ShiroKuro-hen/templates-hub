type Section = { id: string; titulo: string; texto: string; codigo?: string };

const NAV: [string, string[]][] = [
  ['Primeros pasos', ['Introducción', 'Inicio rápido']],
  ['Seguridad', ['Autenticación', 'Permisos']],
  ['Referencia', ['Webhooks', 'Límites de uso']],
];
const SECCIONES: Section[] = [
  { id: 'crear', titulo: 'Crear una clave', texto: 'Abre Ajustes, entra en Claves de API y pulsa Nueva clave. Copia el valor: solo se muestra una vez.' },
  {
    id: 'enviar', titulo: 'Enviar la clave', texto: 'Incluye la clave en la cabecera Authorization de cada petición.',
    codigo: 'curl https://api.ejemplo.com/v1/pedidos \\\n  -H "Authorization: Bearer $CLAVE"',
  },
  { id: 'rotar', titulo: 'Rotar claves', texto: 'Crea la clave nueva, actualiza tus servicios y revoca la anterior. Rota las claves cada 90 días.' },
];

export function DocsLayout({ actual = 'Autenticación' }: { actual?: string }) {
  return (
    <div className="docs">
      <nav aria-label="Documentación">
        {NAV.map(([grupo, links]) => (
          <div key={grupo}>
            <p className="group">{grupo}</p>
            <ul>
              {links.map((l) => (
                <li key={l}><a href="#" aria-current={l === actual ? 'page' : undefined}>{l}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
      <article>
        <p className="crumbs"><a href="#">Guía</a> / <a href="#">Seguridad</a> / {actual}</p>
        <h1>{actual}</h1>
        <p className="lead">Cada petición a la API necesita una clave. Crea una, envíala en la cabecera y rótala sin cortar el servicio.</p>
        {SECCIONES.map((s) => (
          <section key={s.id}>
            <h2 id={s.id}>{s.titulo}</h2>
            <p>{s.texto}</p>
            {s.codigo && <pre><code>{s.codigo}</code></pre>}
          </section>
        ))}
        <div className="pager">
          <a href="#"><small>Anterior</small>Inicio rápido</a>
          <a href="#"><small>Siguiente</small>Permisos</a>
        </div>
      </article>
      <aside className="toc" aria-labelledby="tt">
        <h2 id="tt">En esta página</h2>
        <ul>{SECCIONES.map((s) => <li key={s.id}><a href={`#${s.id}`}>{s.titulo}</a></li>)}</ul>
      </aside>
    </div>
  );
}

// CSS: copia las reglas .docs, nav, .toc, article, .pager, pre y code de la pestaña HTML + CSS.
