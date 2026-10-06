import { useEffect, useRef, useState, type FormEvent } from 'react';

const TITLES = ['¿Olvidaste tu contraseña?', 'Revisa tu correo', 'Crea una contraseña nueva', 'Contraseña actualizada'];
const STEPS = ['pedir enlace', 'revisar correo', 'crear contraseña'];

export function ForgotPassword({ onReset }: { onReset?: (password: string) => Promise<void> }) {
  const [step, setStep] = useState(0);
  const [email, setEmail] = useState('');
  const [p1, setP1] = useState('');
  const [p2, setP2] = useState('');
  const [show, setShow] = useState(false);
  const [err, setErr] = useState('');
  const title = useRef<HTMLHeadingElement>(null);
  const first = useRef(true);
  useEffect(() => { if (!first.current) title.current?.focus(); first.current = false; }, [step]);

  function ask(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!e.currentTarget.checkValidity()) return setErr('Escribe un correo válido, por ejemplo nombre@empresa.com.');
    setErr(''); setStep(1);
  }
  async function save(e: FormEvent) {
    e.preventDefault();
    const m = p1.length < 12 ? `Usa al menos 12 caracteres. Ahora tienes ${p1.length}.`
      : p1 !== p2 ? 'Las contraseñas no coinciden. Vuelve a escribirlas.' : '';
    setErr(m);
    if (!m) { await onReset?.(p1); setStep(3); }
  }
  const type = show ? 'text' : 'password';
  const bad = !!err || undefined;

  return (
    <main className="card">
      <ol className="steps" aria-label="Progreso de recuperación">
        {STEPS.map((s, i) => (
          <li key={s} className={i <= Math.min(step, 2) ? 'on' : undefined} aria-current={i === Math.min(step, 2) ? 'step' : undefined}>
            <span className="sr">Paso {i + 1} de 3: {s}</span>
          </li>
        ))}
      </ol>
      <h1 ref={title} tabIndex={-1}>{TITLES[step]}</h1>
      {step === 0 && (
        <>
          <p className="sub">Escribe el correo de tu cuenta y te enviamos un enlace para crear una nueva.</p>
          <form noValidate onSubmit={ask}>
            <label htmlFor="email">Correo de la cuenta</label>
            <input className="field" id="email" type="email" autoComplete="email" placeholder="nombre@empresa.com" required
                   value={email} onChange={(e) => setEmail(e.target.value)} aria-invalid={bad} aria-describedby="m" />
            <p id="m" className="msg" aria-live="polite">{err}</p>
            <button className="btn primary" type="submit">Enviar enlace</button>
          </form>
          <p className="help"><a href="#">Volver a iniciar sesión</a></p>
        </>
      )}
      {step === 1 && (
        <>
          <p className="sub">Si hay una cuenta con <strong>{email}</strong>, recibirás un enlace en unos minutos. Revisa también la carpeta de spam.</p>
          <button className="btn primary" type="button" onClick={() => { setErr(''); setStep(2); }}>Abrir enlace de ejemplo</button>
          <p className="help">¿Correo equivocado? <button className="link" type="button" onClick={() => setStep(0)}>Usar otro correo</button></p>
        </>
      )}
      {step === 2 && (
        <>
          <p className="sub">Elige una que no uses en otros servicios.</p>
          <form noValidate onSubmit={save}>
            <label htmlFor="p1">Contraseña nueva</label>
            <input className="field" id="p1" type={type} autoComplete="new-password" required value={p1}
                   onChange={(e) => setP1(e.target.value)} aria-invalid={bad} aria-describedby="hint" />
            <p id="hint" className="hint">Usa al menos 12 caracteres.</p>
            <label htmlFor="p2">Repite la contraseña</label>
            <input className="field" id="p2" type={type} autoComplete="new-password" required value={p2}
                   onChange={(e) => setP2(e.target.value)} aria-invalid={bad} aria-describedby="m" />
            <label className="chk"><input type="checkbox" checked={show} onChange={(e) => setShow(e.target.checked)} /> Mostrar contraseñas</label>
            <p id="m" className="msg" aria-live="polite">{err}</p>
            <button className="btn primary" type="submit">Guardar contraseña</button>
          </form>
        </>
      )}
      {step === 3 && (
        <>
          <p className="sub">Ya puedes iniciar sesión con tu contraseña nueva.</p>
          <button className="btn primary" type="button">Iniciar sesión</button>
        </>
      )}
    </main>
  );
}

// CSS: copia las reglas .card, .steps, h1, .sub, label, .field, .hint, .chk, .msg, .btn, .link, .help y .sr de la pestaña HTML + CSS.
