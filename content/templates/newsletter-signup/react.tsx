import { useRef, useState, type FormEvent } from 'react';

export function NewsletterSignup({ onSubscribe }: { onSubscribe?: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [done, setDone] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const ok = useRef<HTMLParagraphElement>(null);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const v = input.current!.validity;
    const msg = v.valueMissing ? 'Escribe tu correo para suscribirte.'
      : v.typeMismatch || v.patternMismatch ? 'Revisa el correo: necesita @ y un dominio, por ejemplo ana@empresa.com.' : '';
    setError(msg);
    if (msg) return input.current!.focus();
    setDone(`Listo. Te enviamos un enlace a ${email} para confirmar la suscripción.`);
    onSubscribe?.(email);
    requestAnimationFrame(() => ok.current?.focus());
  };
  const change = (value: string) => {
    setEmail(value);
    if (error && input.current!.checkValidity()) setError('');
  };

  return (
    <section className="news" aria-labelledby="nl-title">
      <div>
        <h2 id="nl-title">Recibe las novedades del producto</h2>
        <p className="lead">Un correo al mes con lanzamientos, guías y cambios importantes. Te das de baja con un clic.</p>
      </div>
      <div>
        <form noValidate onSubmit={submit} hidden={!!done}>
          <label htmlFor="nl-email">Correo de trabajo</label>
          <div className="row">
            <input ref={input} id="nl-email" type="email" name="email" autoComplete="email" placeholder="nombre@empresa.com"
                   required pattern=".+@.+\..+" aria-invalid={!!error} aria-describedby="nl-err nl-note"
                   value={email} onChange={(e) => change(e.target.value)} />
            <button type="submit">Suscribirme</button>
          </div>
          <p className="err" id="nl-err" hidden={!error}>{error}</p>
          <p className="note" id="nl-note">Usamos tu correo solo para este boletín.</p>
        </form>
        <p ref={ok} className="ok" role="status" tabIndex={-1}>{done}</p>
      </div>
    </section>
  );
}

// CSS: copia las reglas .news, .lead, .row, .err, .note y .ok de la pestaña HTML + CSS.
