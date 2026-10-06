import { useState } from 'react';

type Rule = { label: string; test: (v: string) => boolean };
const RULES: Rule[] = [
  { label: 'Al menos 8 caracteres', test: (v) => v.length >= 8 },
  { label: 'Mayúsculas y minúsculas', test: (v) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: 'Un número', test: (v) => /\d/.test(v) },
  { label: 'Un símbolo, como ! o #', test: (v) => /[^A-Za-z0-9]/.test(v) },
];
const NAMES = ['muy débil', 'débil', 'aceptable', 'buena', 'fuerte'];

export function PasswordStrength({ rules = RULES, onChange }: { rules?: Rule[]; onChange?: (v: string) => void }) {
  const [value, setValue] = useState('');
  const [show, setShow] = useState(false);
  const met = rules.map((r) => r.test(value));
  const score = met.filter(Boolean).length;

  return (
    <div className="card">
      <label htmlFor="pw">Nueva contraseña</label>
      <div className="field">
        <input id="pw" type={show ? 'text' : 'password'} autoComplete="new-password" aria-describedby="level reqs"
               value={value} onChange={(e) => { setValue(e.target.value); onChange?.(e.target.value); }} />
        <button type="button" className="toggle" aria-pressed={show} aria-controls="pw" onClick={() => setShow(!show)}>
          {show ? 'Ocultar' : 'Mostrar'}
        </button>
      </div>
      <div className="meter" data-score={score} aria-hidden="true"><i /><i /><i /><i /></div>
      <p id="level" aria-live="polite">Fortaleza: <b>{value ? NAMES[score] : 'sin evaluar'}</b></p>
      <ul id="reqs" aria-label="Requisitos">
        {rules.map((r, i) => <li key={r.label} className={met[i] ? 'ok' : undefined}>{r.label}</li>)}
      </ul>
    </div>
  );
}

// CSS: copia las reglas .card, label, .field, .toggle, .meter, [data-score], #level, ul y li de la pestaña HTML + CSS.
