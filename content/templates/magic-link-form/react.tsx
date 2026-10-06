import { useEffect, useRef, useState, type FormEvent } from 'react';

const N = 30, C = 2 * Math.PI * 24;

export function MagicLinkForm({ onSend }: { onSend?: (email: string) => Promise<void> }) {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [left, setLeft] = useState(0);
  const [live, setLive] = useState('');
  const title = useRef<HTMLHeadingElement>(null);
  const field = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (left <= 0) return;
    const id = setTimeout(() => setLeft((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [left]);
  useEffect(() => { (sent ? title : field).current?.focus(); }, [sent]);

  async function send(resend = false) {
    await onSend?.(email);
    setLeft(N); setSent(true);
    setLive(resend ? `Enlace reenviado a ${email}.` : '');
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) return setErr('Escribe un correo válido, por ejemplo nombre@empresa.com.');
    setErr(''); void send();
  }

  return (
    <main className="card">
      {!sent ? (
        <section aria-labelledby="t1">
          <h1 id="t1">Accede sin contraseña</h1>
          <p className="sub">Escribe tu correo y te enviamos un enlace de un solo uso.</p>
          <form noValidate onSubmit={submit}>
            <label htmlFor="email">Correo electrónico</label>
            <input id="email" ref={field} type="email" autoComplete="email" placeholder="nombre@empresa.com" required
                   value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={!!err || undefined} aria-describedby="msg" />
            <p id="msg" className="msg" aria-live="polite">{err}</p>
            <button className="btn primary" type="submit">Enviar enlace de acceso</button>
          </form>
        </section>
      ) : (
        <section aria-labelledby="t2">
          <div className="ring">
            <svg width="56" height="56" viewBox="0 0 56 56" fill="none" strokeWidth="3" strokeLinecap="round" aria-hidden="true">
              <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
              <circle className="track" cx="28" cy="28" r="24" />
              <circle className="bar" cx="28" cy="28" r="24" stroke="url(#g)" strokeDasharray="150.8" style={{ strokeDashoffset: C * (1 - left / N) }} />
            </svg>
            <b aria-hidden="true">{left}</b>
          </div>
          <h1 id="t2" ref={title} tabIndex={-1}>Revisa tu correo</h1>
          <p className="sub">Enviamos un enlace a <strong>{email}</strong>. Caduca en 10 minutos.</p>
          <button className="btn" type="button" disabled={left > 0} onClick={() => send(true)}>
            {left > 0 ? `Reenviar en ${left} s` : 'Reenviar enlace'}
          </button>
          <p className="help">¿Correo equivocado? <button className="link" type="button" onClick={() => { setLeft(0); setLive(''); setSent(false); }}>Usar otro correo</button></p>
        </section>
      )}
      <p className="sr" role="status" aria-live="polite">{live}</p>
    </main>
  );
}

// CSS: copia las reglas .card, h1, .sub, label, input, .msg, .btn, .link, .ring, .help y .sr de la pestaña HTML + CSS.
