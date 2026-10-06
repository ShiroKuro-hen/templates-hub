import { useState, type FormEvent } from 'react';

const MSG: Record<string, string> = {
  valueMissing: 'Este campo es obligatorio.',
  typeMismatch: 'Escribe un correo válido, p. ej. ana@correo.com.',
  tooShort: 'Usa al menos 8 caracteres.',
  patternMismatch: 'Incluye al menos un número.',
};

function errorOf(el: HTMLInputElement, pw: string): string {
  if (el.name === 'pw2') return el.value !== pw ? 'Las contraseñas no coinciden.' : '';
  if (el.validity.valid) return '';
  const key = Object.keys(MSG).find((k) => el.validity[k as keyof ValidityState]);
  return key ? MSG[key] : el.validationMessage;
}

export function SignupForm({ onSubmit }: { onSubmit?: (data: FormData) => void }) {
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const validate = (form: HTMLFormElement, only?: HTMLInputElement) => {
    const pw = (form.elements.namedItem('pw') as HTMLInputElement).value;
    const next = { ...errors };
    const fields = only ? [only] : Array.from(form.querySelectorAll('input'));
    fields.forEach((el) => { next[el.name] = errorOf(el, pw); });
    setErrors(next);
    return Object.values(next).every((m) => !m);
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const ok = validate(form);
    if (ok) { setDone(true); onSubmit?.(new FormData(form)); }
    else form.querySelector<HTMLInputElement>('[aria-invalid=true]')?.focus();
  };

  const field = (name: string, label: string, type = 'text', extra = {}) => (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input id={name} name={name} type={type} required aria-invalid={!!errors[name]} aria-describedby={`${name}-e`}
        onBlur={(e) => validate(e.currentTarget.form!, e.currentTarget)} {...extra} />
      <p className="e" id={`${name}-e`}>{errors[name]}</p>
    </div>
  );

  return (
    <form noValidate onSubmit={submit}>
      {field('nombre', 'Nombre')}
      {field('email', 'Correo', 'email')}
      {field('pw', 'Contraseña', 'password', { minLength: 8, pattern: '.*\\d.*' })}
      {field('pw2', 'Repite la contraseña', 'password')}
      <div className="full"><button type="submit">Crear cuenta</button></div>
      {done && <p id="done" role="status">¡Cuenta creada! Revisa tu correo para confirmarla.</p>}
    </form>
  );
}
// CSS: copia las reglas form / .field / label / input (aria-invalid, .ok) / .e / .full / button / #done de la pestaña HTML + CSS.
