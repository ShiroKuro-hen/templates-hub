import { useRef, useState, type FormEvent } from 'react';

type Category = { id: string; label: string; detail: string; locked?: boolean };
const CATEGORIES: Category[] = [
  { id: 'necessary', label: 'Necesarias', detail: 'Permiten iniciar sesión y recordar tu carrito. Siempre activas.', locked: true },
  { id: 'analytics', label: 'Analíticas', detail: 'Nos dicen qué páginas se usan para mejorarlas.' },
  { id: 'prefs', label: 'Preferencias', detail: 'Recuerdan tu idioma y región.' },
  { id: 'marketing', label: 'Marketing', detail: 'Muestran anuncios según tu actividad en otros sitios.' },
];
type Consent = Record<string, boolean>;

export function CookieConsent({ categories = CATEGORIES, onSave }: { categories?: Category[]; onSave?: (c: Consent) => void }) {
  const all = (v: boolean): Consent => Object.fromEntries(categories.map((c) => [c.id, c.locked || v]));
  const [consent, setConsent] = useState<Consent>(all(false));
  const [open, setOpen] = useState(true);
  const [status, setStatus] = useState('');
  const reopen = useRef<HTMLButtonElement>(null);

  const save = (c: Consent) => {
    setConsent(c);
    setOpen(false);
    setStatus(`Guardaste tus preferencias: ${categories.filter((x) => c[x.id]).map((x) => x.label).join(', ')}.`);
    onSave?.(c);
    requestAnimationFrame(() => reopen.current?.focus());
  };
  const submit = (e: FormEvent) => { e.preventDefault(); save(consent); };

  return (
    <>
      <section className="banner" aria-labelledby="cc-title" hidden={!open}>
        <h2 id="cc-title">Tu privacidad en este sitio</h2>
        <p>Usamos cookies necesarias para que el sitio funcione. Con tu permiso, también usamos otras para medir el uso y personalizar contenido. Lee la <a href="#">política de cookies</a>.</p>
        <div className="row">
          <button className="btn" type="button" onClick={() => save(all(false))}>Rechazar opcionales</button>
          <button className="btn" type="button" onClick={() => save(all(true))}>Aceptar todas</button>
        </div>
        <details>
          <summary>Configurar preferencias</summary>
          <form onSubmit={submit}>
            {categories.map((c) => (
              <label className="opt" key={c.id}>
                <span><b>{c.label}</b><small>{c.detail}</small></span>
                <input className="switch" type="checkbox" role="switch" checked={consent[c.id]} disabled={c.locked}
                       onChange={(e) => setConsent({ ...consent, [c.id]: e.target.checked })} />
              </label>
            ))}
            <div className="row"><button className="btn primary" type="submit">Guardar preferencias</button></div>
          </form>
        </details>
      </section>
      <p className="status" role="status">{status}</p>
      <button ref={reopen} className="btn" type="button" hidden={open} onClick={() => { setOpen(true); setStatus(''); }}>
        Cambiar preferencias de cookies
      </button>
    </>
  );
}

// CSS: copia las reglas .banner, .row, .btn, details, summary, .opt, .switch y .status de la pestaña HTML + CSS.
