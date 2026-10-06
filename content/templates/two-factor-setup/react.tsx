import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';

const KEY = 'JBSWY3DPEHPK3PXP';

function qr(n = 25) { // simulado: no es un QR real
  let s = 7, d = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) {
    if ((x < 8 || x > n - 9) && (y < 8 || y > n - 9) && !(x > n - 9 && y > n - 9)) continue;
    s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff;
    if ((s >> 16) & 1) d += `M${x} ${y}h1v1h-1z`;
  }
  for (const [x, y] of [[0, 0], [n - 7, 0], [0, n - 7]]) d += `M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}h5v5h-5zM${x + 2} ${y + 2}h3v3h-3z`;
  return d;
}

export function TwoFactorSetup({ onVerify }: { onVerify?: (code: string) => Promise<boolean> }) {
  const [code, setCode] = useState('');
  const [err, setErr] = useState('');
  const [done, setDone] = useState(false);
  const [copy, setCopy] = useState('Copiar');
  const [live, setLive] = useState('');
  const title = useRef<HTMLHeadingElement>(null);
  const path = useMemo(() => qr(), []);
  useEffect(() => { if (done) title.current?.focus(); }, [done]);

  async function copyKey() {
    try { await navigator.clipboard.writeText(KEY); setCopy('Copiado'); setLive('Clave copiada.'); }
    catch { setCopy('Cópiala a mano'); }
    setTimeout(() => setCopy('Copiar'), 1800);
  }
  async function submit(e: FormEvent) {
    e.preventDefault();
    const v = code.trim();
    const ok = onVerify ? await onVerify(v) : v !== '000000';
    setErr(!/^\d{6}$/.test(v) ? 'Escribe los 6 dígitos que muestra tu app, sin espacios.'
      : !ok ? 'El código no coincide o caducó. Espera al siguiente código en tu app e inténtalo de nuevo.' : '');
    if (/^\d{6}$/.test(v) && ok) setDone(true);
  }

  return (
    <main className="card">
      {!done ? (
        <div>
          <h1>Activa la verificación en dos pasos</h1>
          <p className="sub">Protege tu cuenta con un código temporal de tu app de autenticación.</p>
          <div className="grid">
            <div className="qr"><svg viewBox="0 0 25 25" shapeRendering="crispEdges" role="img" aria-label="Código QR para configurar la app de autenticación"><path d={path} fill="currentColor" fillRule="evenodd" /></svg></div>
            <ol className="steps">
              <li>Escanea el código con Google Authenticator, 1Password o Authy.</li>
              <li>¿No puedes escanear? Escribe esta clave en la app.
                <div className="key"><code>JBSW Y3DP EHPK 3PXP</code><button className="btn sm" type="button" onClick={copyKey}>{copy}</button></div></li>
              <li>Escribe el código de 6 dígitos que muestra la app.</li>
            </ol>
          </div>
          <form noValidate onSubmit={submit}>
            <label htmlFor="code">Código de verificación</label>
            <div className="row">
              <input id="code" inputMode="numeric" pattern="[0-9]{6}" maxLength={6} autoComplete="one-time-code" placeholder="6 dígitos"
                     value={code} onChange={(e) => setCode(e.target.value)} aria-invalid={!!err || undefined} aria-describedby="msg" />
              <button className="btn primary" type="submit">Verificar y activar</button>
            </div>
            <p id="msg" className="msg" aria-live="polite">{err}</p>
          </form>
        </div>
      ) : (
        <div className="done">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="m8 12.5 3 3 5-6" /></svg>
          <div><h2 ref={title} tabIndex={-1}>Verificación en dos pasos activada</h2>
            <p>Desde ahora te pediremos un código al iniciar sesión. Guarda tus códigos de recuperación en un lugar seguro.</p></div>
        </div>
      )}
      <p className="sr" role="status" aria-live="polite">{live}</p>
    </main>
  );
}

// CSS: copia las reglas .card, h1/h2, .grid, .qr, .steps, .key, code, input, .msg, .btn, .done y .sr de la pestaña HTML + CSS.
