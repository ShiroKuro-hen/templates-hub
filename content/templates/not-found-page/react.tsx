import { useState, type FormEvent } from 'react';

type QuickLink = { title: string; desc: string; href: string; icon: string }; // icon: atributo d de un path SVG 24x24

const LINKS: QuickLink[] = [
  { title: 'Panel de inicio', desc: 'Vuelve a tus proyectos recientes.', href: '/', icon: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z' },
  { title: 'Centro de ayuda', desc: 'Guías paso a paso y respuestas rápidas.', href: '/ayuda', icon: 'M12 3a9 9 0 1 1 0 18 9 9 0 0 1 0-18M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6M12 17h.01' },
  { title: 'Estado del servicio', desc: 'Comprueba si hay incidencias activas.', href: '/estado', icon: 'M3 12h4l3-7 4 14 3-7h4' },
  { title: 'Contactar con soporte', desc: 'Respondemos en menos de 24 horas.', href: '/soporte', icon: 'M4 6h16v10H8l-4 4z' },
];

export function NotFoundPage({ links = LINKS, onSearch }: { links?: QuickLink[]; onSearch?: (q: string) => void }) {
  const [q, setQ] = useState('');
  const t = q.trim().toLowerCase();
  const shown = links.filter((l) => `${l.title} ${l.desc}`.toLowerCase().includes(t));

  function submit(e: FormEvent) {
    e.preventDefault();
    if (t) onSearch?.(q.trim()); // p. ej. navegar a /buscar?q=...
  }

  return (
    <>
      <header className="top">
        <a className="brand" href="/"><span className="logo" aria-hidden="true" />Nimbo</a>
        <a className="link" href="/">Ir al panel</a>
      </header>
      <main>
        <p className="code" aria-hidden="true">404</p>
        <h1>No encontramos esta página</h1>
        <p className="lead">Puede que el enlace esté mal escrito o que la página se haya movido. Busca lo que necesitas o elige uno de estos accesos.</p>
        <form role="search" onSubmit={submit}>
          <div className="field">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
            <input type="search" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Buscar en Nimbo" placeholder="Buscar proyectos, informes o ayuda" autoComplete="off" />
          </div>
          <button className="btn" type="submit">Buscar</button>
        </form>

        <h2 id="links-title">Enlaces útiles</h2>
        <ul aria-labelledby="links-title">
          {shown.map((l) => (
            <li key={l.href}>
              <a href={l.href}>
                <span className="ico" aria-hidden="true">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d={l.icon} /></svg>
                </span>
                <span><strong>{l.title}</strong><span>{l.desc}</span></span>
              </a>
            </li>
          ))}
          {shown.length === 0 && <li className="empty" role="status">Ningún acceso coincide. Pulsa Buscar para consultar todo el centro de ayuda.</li>}
        </ul>
        <p className="ref">Código de error 404. Si llegaste aquí desde un enlace de Nimbo, avísanos para corregirlo.</p>
      </main>
    </>
  );
}

// CSS: copia las reglas .top, .brand, .logo, main, .code, h1, .lead, form, .field, .btn, ul, li, .ico, .empty y .ref de la pestaña HTML + CSS.
