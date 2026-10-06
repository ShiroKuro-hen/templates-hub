import { useState, type FormEvent } from 'react';

type Props = { producto?: string; onLogin?: (data: { email: string; password: string; remember: boolean }) => void };

export function LoginPage({ producto = 'Nimbo', onLogin }: Props) {
  const [show, setShow] = useState(false);
  const [done, setDone] = useState(false);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault(); // el navegador ya validó required, type=email y minlength
    const f = new FormData(e.currentTarget);
    onLogin?.({ email: String(f.get('email')), password: String(f.get('password')), remember: f.has('remember') });
    setDone(true);
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="title">
        <div className="brand">
          <span className="logo" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 13V3l10 10V3" /></svg>
          </span>
          {producto}
        </div>
        <h1 id="title">Inicia sesión</h1>
        <p className="sub">Accede a tu espacio de trabajo.</p>

        <button className="btn ghost" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></svg>
          Continuar con SSO de tu empresa
        </button>
        <div className="or" role="separator">o con tu correo</div>

        <form onSubmit={submit}>
          <label>Correo electrónico
            <input type="email" name="email" autoComplete="email" required placeholder="nombre@empresa.com" />
            <span className="hint">Escribe un correo válido, por ejemplo nombre@empresa.com.</span>
          </label>
          <label>
            <span className="row">Contraseña <a href="#recuperar">Olvidé mi contraseña</a></span>
            <span className="pw">
              <input id="pw" type={show ? 'text' : 'password'} name="password" autoComplete="current-password" required minLength={8} />
              <button type="button" aria-controls="pw" aria-pressed={show} onClick={() => setShow(!show)}>{show ? 'Ocultar' : 'Mostrar'}</button>
            </span>
            <span className="hint">La contraseña tiene al menos 8 caracteres.</span>
          </label>
          <label className="check"><input type="checkbox" name="remember" /> Mantener la sesión iniciada</label>
          <button className="btn primary" type="submit">Iniciar sesión</button>
          <p className="status" role="status" hidden={!done}>Sesión iniciada. Abriendo tu espacio de trabajo.</p>
        </form>
      </section>
      <p className="foot">¿No tienes cuenta? <a href="#registro">Crea una gratis</a></p>
    </main>
  );
}

// CSS: copia las reglas .page, .card, .brand, .logo, form, label, input, .hint, .pw, .btn, .or, .status y .foot de la pestaña HTML + CSS.
