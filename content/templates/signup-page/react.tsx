import { useRef, useState, type CSSProperties, type FormEvent } from 'react';

const STEPS = ['Tu cuenta', 'Tu equipo', 'Confirmar'];
const SUMMARY = [['Nombre', 'name'], ['Correo', 'email'], ['Empresa', 'company'], ['Equipo', 'size']] as const;

export function SignupPage({ onCreate }: { onCreate?: (data: Record<string, string>) => void }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const sets = useRef<(HTMLFieldSetElement | null)[]>([]);

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fields = [...sets.current[step]!.querySelectorAll<HTMLInputElement>('input,select')];
    if (!fields.every((el) => el.reportValidity())) return; // valida solo el paso visible
    const all = Object.fromEntries(new FormData(e.currentTarget)) as Record<string, string>;
    setData(all);
    if (step < 2) setStep(step + 1);
    else { onCreate?.(all); setDone(true); }
  }

  return (
    <main className="page">
      <section className="card" aria-labelledby="title">
        <div className="brand"><span className="logo" aria-hidden="true" />Nimbo</div>
        <h1 id="title">Crea tu cuenta</h1>
        <p className="sub">Prueba gratis durante 14 días. Sin tarjeta.</p>
        <ol className="steps" aria-label="Progreso del registro">
          {STEPS.map((s, k) => (
            <li key={s} className={k < step ? 'done' : undefined} aria-current={k === step ? 'step' : undefined}>
              <b>{k + 1}</b><span>{s}</span>
            </li>
          ))}
        </ol>
        <div className="track" aria-hidden="true"><span style={{ '--p': (step + 1) * 33.34 } as CSSProperties} /></div>

        <form noValidate onSubmit={submit}>
          <fieldset ref={(el) => { sets.current[0] = el; }} hidden={step !== 0}>
            <legend>Datos de acceso</legend>
            <label>Nombre completo <input name="name" autoComplete="name" required /></label>
            <label>Correo de trabajo <input type="email" name="email" autoComplete="email" required placeholder="nombre@empresa.com" /></label>
            <label>Contraseña <input type="password" name="password" autoComplete="new-password" required minLength={8} /><small>Mínimo 8 caracteres.</small></label>
          </fieldset>
          <fieldset ref={(el) => { sets.current[1] = el; }} hidden={step !== 1}>
            <legend>Sobre tu equipo</legend>
            <label>Nombre de la empresa <input name="company" autoComplete="organization" required /></label>
            <label>Tamaño del equipo
              <select name="size" required defaultValue="">
                <option value="">Elige una opción</option><option>1–10</option><option>11–50</option><option>51–200</option><option>Más de 200</option>
              </select>
            </label>
          </fieldset>
          <fieldset ref={(el) => { sets.current[2] = el; }} hidden={step !== 2}>
            <legend>Revisa y confirma</legend>
            <dl className="summary">{SUMMARY.map(([t, k]) => [<dt key={t}>{t}</dt>, <dd key={k}>{data[k]}</dd>])}</dl>
            <label className="terms"><input type="checkbox" name="terms" required />
              <span>Acepto los <a href="#terminos">Términos del servicio</a> y la <a href="#privacidad">Política de privacidad</a>.</span>
            </label>
          </fieldset>
          <div className="actions">
            {step > 0 && <button className="btn" type="button" onClick={() => setStep(step - 1)}>Atrás</button>}
            <button className="btn primary" type="submit">{step === 2 ? 'Crear cuenta' : 'Continuar'}</button>
          </div>
          {done && <p className="status" role="status">Cuenta creada. Te enviamos un correo para verificarla.</p>}
        </form>
      </section>
      <p className="foot">¿Ya tienes cuenta? <a href="#login">Inicia sesión</a></p>
    </main>
  );
}

// CSS: copia las reglas .page, .card, .brand, .logo, .steps, .track, fieldset, label, input, .summary, .actions, .btn y .status de la pestaña HTML + CSS.
