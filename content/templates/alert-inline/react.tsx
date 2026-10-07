import { useState } from 'react';
import type { FormEvent, MouseEvent } from 'react';

type Campo = 'email' | 'ruc';

const NOMBRES: Record<Campo, string> = { email: 'Correo de facturación', ruc: 'RUC' };
const REGLAS: Record<Campo, (v: string) => string> = {
  email: (v) => (!v ? 'Escribe un correo de facturación.' : /^[^@\s]+@[^@\s]+\.\w{2,}$/.test(v) ? '' : 'El formato no es válido. Usa nombre@empresa.com.'),
  ruc: (v) => (!v ? 'Escribe el RUC de 11 dígitos.' : /^\d{11}$/.test(v) ? '' : 'El RUC tiene 11 dígitos, sin espacios ni letras.'),
};

export function FormularioConAlertas() {
  const [valores, setValores] = useState<Record<Campo, string>>({ email: 'facturacion@empresa', ruc: '2051234' });
  const [guardado, setGuardado] = useState(false);

  const errores = (Object.keys(REGLAS) as Campo[])
    .map((k) => [k, REGLAS[k](valores[k].trim())] as const)
    .filter(([, m]) => m);
  const error = (k: Campo) => errores.find(([c]) => c === k)?.[1] ?? '';

  const cambiar = (k: Campo, v: string) => { setValores({ ...valores, [k]: v }); setGuardado(false); };
  const enviar = (e: FormEvent) => {
    e.preventDefault();
    if (errores.length) document.getElementById(errores[0][0])?.focus();
    else setGuardado(true);
  };
  const ir = (e: MouseEvent, k: Campo) => { e.preventDefault(); document.getElementById(k)?.focus(); };

  return (
    <section className="card" aria-labelledby="ai-titulo">
      <h2 id="ai-titulo">Datos de facturación</h2>
      <form noValidate onSubmit={enviar}>
        <div aria-live="polite">
          {errores.length > 0 && (
            <div className="alert err">
              <span className="ic" aria-hidden="true">×</span>
              <div>
                <strong>Revisa {errores.length} {errores.length > 1 ? 'campos' : 'campo'} antes de guardar</strong>
                <ul>{errores.map(([k, m]) => (
                  <li key={k}><a href={`#${k}`} onClick={(e) => ir(e, k)}>{NOMBRES[k]}: {m}</a></li>
                ))}</ul>
              </div>
            </div>
          )}
          {!errores.length && guardado && (
            <div className="alert ok"><span className="ic" aria-hidden="true">✓</span>
              <div><strong>Datos guardados</strong><p>Enviaremos las facturas al correo indicado.</p></div></div>
          )}
        </div>
        <div className="field">
          <label htmlFor="email">Correo de facturación</label>
          <input id="email" type="email" value={valores.email} aria-invalid={!!error('email')} aria-describedby="email-e"
                 onChange={(e) => cambiar('email', e.target.value)} />
          <p className="msg" id="email-e">{error('email')}</p>
        </div>
        <div className="field">
          <label htmlFor="ruc">RUC</label>
          <input id="ruc" inputMode="numeric" value={valores.ruc} aria-invalid={!!error('ruc')} aria-describedby="ruc-e ruc-w"
                 onChange={(e) => cambiar('ruc', e.target.value)} />
          <p className="msg" id="ruc-e">{error('ruc')}</p>
          <div className="alert warn" id="ruc-w"><span className="ic" aria-hidden="true">!</span>
            <p>Si cambias el RUC, volveremos a verificar tu cuenta. Tarda hasta 24 horas.</p></div>
        </div>
        <div className="acts"><button className="btn main" type="submit">Guardar cambios</button></div>
      </form>
    </section>
  );
}

// CSS: copia las reglas .card, form, .alert, .ic, .field, .msg y .btn de la pestaña HTML + CSS.
