import { useState, type FormEvent } from 'react';

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const COLUMNS = [
  { title: 'Producto', id: 'c1', links: ['Plataforma', 'Automatizaciones', 'Integraciones', 'Precios'] },
  { title: 'Recursos', id: 'c2', links: ['Blog', 'Guías', 'Plantillas', 'Documentación'] },
  { title: 'Empresa', id: 'c3', links: ['Nosotros', 'Clientes', 'Empleo', 'Contacto'] },
  { title: 'Ayuda', id: 'c4', links: ['Centro de ayuda', 'Estado del servicio', 'Seguridad', 'API'] },
];

function validate(value: string): string {
  if (!value) return 'Escribe tu correo para suscribirte.';
  return EMAIL.test(value) ? '' : 'Revisa el correo: falta el @ o el dominio.';
}

export function FooterNewsletterColumns() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const value = email.trim();
    const message = validate(value);
    setError(message);
    if (!message) setSent(value);
  };

  const backToTop = () =>
    window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });

  return (
    <footer>
      <section className="news" aria-labelledby="fn-t">
        <div>
          <h2 id="fn-t">Novedades del producto, sin ruido</h2>
          <p className="lead">Un correo al mes con lanzamientos y guías. Te das de baja con un clic.</p>
        </div>
        <div>
          {sent ? (
            <p className="done" role="status">Listo. Confirma tu suscripción en {sent}.</p>
          ) : (
            <form onSubmit={submit} noValidate>
              <label htmlFor="fn-email">Correo electrónico</label>
              <div className="row">
                <input
                  id="fn-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="nombre@empresa.com"
                  value={email}
                  aria-invalid={Boolean(error)}
                  aria-describedby="fn-msg"
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError('');
                  }}
                />
                <button type="submit" className="primary">Suscribirme</button>
              </div>
              <p id="fn-msg" className="msg" aria-live="polite">{error}</p>
            </form>
          )}
        </div>
      </section>
      <div className="cols">
        {COLUMNS.map((column) => (
          <nav key={column.id} aria-labelledby={column.id}>
            <h3 id={column.id}>{column.title}</h3>
            <ul>
              {column.links.map((link) => (
                <li key={link}><a href="#">{link}</a></li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="legal">
        <p>© 2026 Nimbo Software, S.L.</p>
        <ul>
          <li><a href="#">Privacidad</a></li>
          <li><a href="#">Términos</a></li>
          <li><a href="#">Cookies</a></li>
        </ul>
        <button type="button" className="up" onClick={backToTop}>Volver arriba</button>
      </div>
    </footer>
  );
}
// CSS: copia las reglas de footer, .news, .lead, label, .row, input, .primary, .msg, .done, .cols, h3, .legal y .up de la pestaña HTML + CSS.
