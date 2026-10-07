import { useEffect, useState } from 'react';

const GROUPS: Record<string, string[]> = {
  Producto: ['Plataforma', 'Integraciones', 'Seguridad', 'Precios'],
  Recursos: ['Documentación', 'Referencia API', 'Guías', 'Comunidad'],
  Empresa: ['Nosotros', 'Clientes', 'Empleo', 'Contacto'],
  Legal: ['Privacidad', 'Términos', 'Cookies', 'Accesibilidad'],
};
const QUERY = '(min-width:720px)';

export function FooterNav() {
  const [wide, setWide] = useState(() => matchMedia(QUERY).matches);
  const [open, setOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const mq = matchMedia(QUERY);
    const on = () => { setWide(mq.matches); setOpen({}); };
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, []);

  return (
    <footer>
      <nav className="cols" aria-label="Pie de página">
        {Object.entries(GROUPS).map(([name, links]) => (
          <details key={name} open={wide || !!open[name]}>
            <summary tabIndex={wide ? -1 : 0}
                     onClick={(e) => { e.preventDefault(); if (!wide) setOpen({ ...open, [name]: !open[name] }); }}>
              {name}
            </summary>
            <ul>{links.map((l) => <li key={l}><a href="#">{l}</a></li>)}</ul>
          </details>
        ))}
      </nav>
      <div className="bar">
        <a className="st" href="#estado">Todos los sistemas operativos</a>
        <label>Idioma <select><option>Español (Perú)</option><option>English</option><option>Português</option></select></label>
        <a className="up" href="#top">Volver arriba</a>
        <p className="copy">© 2026 Nimbo Software S.A.C. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}

// CSS: copia las reglas footer, .cols, summary, ul, .bar, .st, select y .copy de la pestaña HTML + CSS.
