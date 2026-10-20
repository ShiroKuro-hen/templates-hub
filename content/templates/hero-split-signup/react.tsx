// CSS: copia las reglas .split, .card, .perks, .tick, form, .field, label, input, .hint, .err, .pass, .toggle, .submit, .done y [hidden] de la pestaña HTML + CSS.
import { useEffect, useRef, useState, type FormEvent } from 'react';

type Field = 'name' | 'email' | 'password';
type Values = Record<Field, string>;

const FREE = /@(gmail|hotmail|outlook|yahoo)\./i;
const RULES: Record<Field, [(v: string) => boolean, string][]> = {
  name: [[(v) => v.trim().length >= 2, 'Escribe tu nombre completo.']],
  email: [
    [(v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()), 'Revisa el formato, por ejemplo nombre@empresa.com.'],
    [(v) => !FREE.test(v), 'Usa tu correo de trabajo, no uno personal.'],
  ],
  password: [[(v) => v.length >= 8, 'La contraseña necesita al menos 8 caracteres.']],
};
const FIELDS: Field[] = ['name', 'email', 'password'];
const EMPTY: Values = { name: '', email: '', password: '' };

function validate(field: Field, value: string): string {
  return RULES[field].find(([ok]) => !ok(value))?.[1] ?? '';
}

export function HeroSplitSignup() {
  const [values, setValues] = useState<Values>(EMPTY);
  const [errors, setErrors] = useState<Values>(EMPTY);
  const [showPass, setShowPass] = useState(false);
  const [done, setDone] = useState<{ name: string; email: string } | null>(null);
  const doneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const change = (field: Field, value: string) => {
    setValues({ ...values, [field]: value });
    if (errors[field]) setErrors({ ...errors, [field]: validate(field, value) });
  };
  const blur = (field: Field) => setErrors({ ...errors, [field]: validate(field, values[field]) });

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const next = Object.fromEntries(FIELDS.map((f) => [f, validate(f, values[f])])) as Values;
    setErrors(next);
    const firstBad = FIELDS.find((f) => next[f]);
    if (firstBad) {
      document.getElementById(firstBad)?.focus();
      return;
    }
    setDone({ name: values.name.trim(), email: values.email.trim() });
  };

  return (
    <section className="split" aria-labelledby="h">
      <div>
        <h1 id="h">Lanza tu equipo en minutos, no en semanas.</h1>
        <p className="lead">Lumen reúne tus proyectos, tus plazos y a tu equipo en un solo lugar, con migración guiada desde la herramienta que ya usas.</p>
        <ul className="perks">
          <li><span className="tick" aria-hidden="true">✓</span>Importa tus proyectos desde Trello, Asana o una hoja de cálculo.</li>
          <li><span className="tick" aria-hidden="true">✓</span>Permisos por equipo: cada persona ve solo lo que necesita.</li>
          <li><span className="tick" aria-hidden="true">✓</span>Soporte en español y migración guiada sin coste.</li>
        </ul>
      </div>
      <div className="card">
        <h2>Crea tu cuenta gratis</h2>
        {done ? (
          <div className="done" role="status" tabIndex={-1} ref={doneRef}>
            <span className="tick" aria-hidden="true">✓</span>
            <h3>¡Listo, {done.name.split(' ')[0]}!</h3>
            <p>Enviamos un enlace de activación a {done.email}.</p>
          </div>
        ) : (
          <>
            <p className="intro">14 días de prueba. Sin tarjeta de crédito.</p>
            <form id="signup" noValidate onSubmit={submit}>
              <div className="field">
                <label htmlFor="name">Nombre completo</label>
                <input id="name" name="name" type="text" autoComplete="name" value={values.name} aria-invalid={Boolean(errors.name)} aria-describedby="name-err" onChange={(e) => change('name', e.target.value)} onBlur={() => blur('name')} />
                <p className="err" id="name-err">{errors.name}</p>
              </div>
              <div className="field">
                <label htmlFor="email">Correo de trabajo</label>
                <input id="email" name="email" type="email" autoComplete="email" value={values.email} aria-invalid={Boolean(errors.email)} aria-describedby="email-err" onChange={(e) => change('email', e.target.value)} onBlur={() => blur('email')} />
                <p className="err" id="email-err">{errors.email}</p>
              </div>
              <div className="field">
                <label htmlFor="password">Contraseña</label>
                <div className="pass">
                  <input id="password" name="password" type={showPass ? 'text' : 'password'} autoComplete="new-password" value={values.password} aria-invalid={Boolean(errors.password)} aria-describedby="password-hint password-err" onChange={(e) => change('password', e.target.value)} onBlur={() => blur('password')} />
                  <button type="button" className="toggle" aria-controls="password" onClick={() => setShowPass(!showPass)}>
                    {showPass ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <p className="hint" id="password-hint">Mínimo 8 caracteres.</p>
                <p className="err" id="password-err">{errors.password}</p>
              </div>
              <button className="submit" type="submit">Crear cuenta</button>
            </form>
          </>
        )}
      </div>
    </section>
  );
}
