import { useState, type FormEvent } from 'react';

type Field = { id: string; label: string; type?: string; min?: number; options?: string[] };
const STEPS: { title: string; fields: Field[] }[] = [
  { title: 'Tus datos', fields: [
    { id: 'nombre', label: 'Nombre completo', min: 2 },
    { id: 'correo', label: 'Correo de trabajo', type: 'email' },
  ] },
  { title: 'Tu empresa', fields: [
    { id: 'empresa', label: 'Nombre de la empresa', min: 2 },
    { id: 'equipo', label: 'Tamaño del equipo', options: ['1 a 10 personas', '11 a 50 personas', 'Más de 50 personas'] },
  ] },
  { title: 'Revisa y confirma', fields: [{ id: 'terminos', label: 'Acepto los términos del servicio', type: 'checkbox' }] },
];
const ALL = STEPS.flatMap((s) => s.fields).filter((f) => f.type !== 'checkbox');

function check(f: Field, v = ''): string {
  if (!v.trim()) return f.type === 'checkbox' ? 'Acepta los términos para crear el espacio.' : 'Completa este campo.';
  if (f.type === 'email' && !/^\S+@\S+\.\S+$/.test(v)) return 'Escribe un correo válido, como ana@empresa.com.';
  if (f.min && v.trim().length < f.min) return `Usa al menos ${f.min} caracteres.`;
  return '';
}

export function FormMultistep() {
  const [n, setN] = useState(0);
  const [v, setV] = useState<Record<string, string>>({});
  const [errs, setErrs] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const step = STEPS[n], last = n === STEPS.length - 1, pct = Math.round(((n + 1) / STEPS.length) * 100);

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = Object.fromEntries(step.fields.map((f) => [f.id, check(f, v[f.id])]).filter(([, m]) => m));
    setErrs(next);
    if (Object.keys(next).length) return;
    if (last) setDone(true); else setN(n + 1);
  };

  if (done) return <main className="card"><h1>Espacio creado</h1><p className="sub">Revisa tu correo para activar la cuenta.</p></main>;
  return (
    <main className="card">
      <form onSubmit={submit} noValidate>
        <h1>Crear espacio de trabajo</h1>
        <p className="sub" aria-live="polite">Paso {n + 1} de {STEPS.length}</p>
        <div className="bar" role="progressbar" aria-label="Progreso del formulario" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct}>
          <i style={{ width: `${pct}%` }} />
        </div>
        <fieldset>
          <legend>{step.title}</legend>
          {last && (
            <dl>{ALL.map((f) => [<dt key={f.id}>{f.label}</dt>, <dd key={f.id + 'v'}>{v[f.id]}</dd>])}</dl>
          )}
          {step.fields.map((f, i) => {
            const err = errs[f.id], common = { id: f.id, 'aria-invalid': !!err, 'aria-describedby': f.id + '-e', autoFocus: i === 0 && n > 0 };
            return (
              <div key={f.id} className={f.type === 'checkbox' ? 'f chk' : 'f'}>
                {f.type === 'checkbox' ? (
                  <div><input {...common} type="checkbox" checked={!!v[f.id]} onChange={(e) => setV({ ...v, [f.id]: e.target.checked ? '1' : '' })} /><label htmlFor={f.id}>{f.label}</label></div>
                ) : (<>
                  <label htmlFor={f.id}>{f.label}</label>
                  {f.options ? (
                    <select {...common} value={v[f.id] ?? ''} onChange={(e) => setV({ ...v, [f.id]: e.target.value })}>
                      <option value="">Selecciona una opción</option>{f.options.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  ) : <input {...common} type={f.type ?? 'text'} value={v[f.id] ?? ''} onChange={(e) => setV({ ...v, [f.id]: e.target.value })} />}
                </>)}
                <p className="err" id={f.id + '-e'}>{err}</p>
              </div>
            );
          })}
        </fieldset>
        <div className="row">
          {n > 0 && <button type="button" className="btn" onClick={() => setN(n - 1)}>Atrás</button>}
          <button className="btn pri">{last ? 'Crear espacio' : 'Continuar'}</button>
        </div>
      </form>
    </main>
  );
}

// CSS: copia las reglas .card, .bar, fieldset, .f, input, .err, dl y .btn de la pestaña HTML + CSS.
