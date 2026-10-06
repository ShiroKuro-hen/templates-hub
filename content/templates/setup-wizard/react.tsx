import { useState, type FormEvent } from 'react';

type Field = { k: string; label: string; msg: string; ok: (v: string) => boolean; type?: string; suffix?: string; options?: string[]; check?: boolean };
const STEPS: { title: string; fields: Field[] }[] = [
  { title: 'Tus datos', fields: [
    { k: 'nom', label: 'Nombre completo', msg: 'Escribe tu nombre completo.', ok: (v) => v.trim().length > 1 },
    { k: 'mail', label: 'Correo de trabajo', type: 'email', msg: 'Escribe un correo válido, por ejemplo ana@empresa.es.', ok: (v) => /^\S+@\S+\.\S+$/.test(v) },
  ] },
  { title: 'Tu espacio', fields: [
    { k: 'esp', label: 'Nombre del espacio', msg: 'Usa al menos 3 caracteres para el nombre.', ok: (v) => v.trim().length >= 3 },
    { k: 'url', label: 'Dirección web', suffix: '.nimbus.app', msg: 'Usa 3 o más letras minúsculas o números, sin espacios.', ok: (v) => /^[a-z0-9]{3,}$/.test(v) },
  ] },
  { title: 'Tamaño del equipo', fields: [
    { k: 'eq', label: 'Equipo', options: ['1 a 10 personas', '11 a 50 personas', 'Más de 50 personas'], msg: 'Elige el tamaño de tu equipo para continuar.', ok: (v) => !!v },
  ] },
  { title: 'Revisa y confirma', fields: [
    { k: 'tos', label: 'Acepto los términos del servicio', check: true, msg: 'Acepta los términos para crear el espacio.', ok: (v) => v === 'si' },
  ] },
];
const NAMES = ['Cuenta', 'Espacio', 'Equipo', 'Revisión'];
const SUMMARY = STEPS.slice(0, 3).flatMap((s) => s.fields);

export function SetupWizard() {
  const [n, setN] = useState(0);
  const [v, setV] = useState<Record<string, string>>({});
  const [err, setErr] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);
  const step = STEPS[n];
  const last = n === STEPS.length - 1;
  const set = (k: string, val: string) => { setV({ ...v, [k]: val }); setErr({ ...err, [k]: '' }); };

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const bad = step.fields.filter((f) => !f.ok(v[f.k] ?? ''));
    setErr(Object.fromEntries(bad.map((f) => [f.k, f.msg])));
    if (bad.length) return document.getElementById(bad[0].k)?.focus();
    if (last) setDone(true); else setN(n + 1);
  };

  return (
    <section className="card" aria-labelledby="ttl">
      <div className="top">
        <h2 id="ttl">Configura tu espacio en Nimbus</h2>
        <ol className="steps" aria-label="Pasos de configuración">
          {NAMES.map((name, j) => (
            <li key={name} className={j < n ? 'done' : undefined} aria-current={j === n ? 'step' : undefined}>
              <b>{j < n ? '✓' : j + 1}</b><span>{name}</span>
            </li>
          ))}
        </ol>
      </div>
      {done ? (
        <div className="ok" tabIndex={-1} ref={(el) => el?.focus()}>
          <h3>Espacio creado</h3><p>Tu espacio {v.esp} está listo en {v.url}.nimbus.app.</p>
        </div>
      ) : (
        <form noValidate onSubmit={submit}>
          <fieldset className="pane">
            <legend>{step.title}</legend>
            {last && (
              <dl>{SUMMARY.map((f) => [<dt key={f.k}>{f.options ? 'Equipo' : f.label}</dt>, <dd key={f.k + 'v'}>{v[f.k]}{f.suffix}</dd>])}</dl>
            )}
            {step.fields.map((f, i) => (
              <div className="f" key={f.k}>
                {f.options ? f.options.map((o, j) => (
                  <label className="opt" key={o}>
                    <input type="radio" name={f.k} id={j === 0 ? f.k : undefined} checked={v[f.k] === o} aria-invalid={!!err[f.k]}
                      onChange={() => set(f.k, o)} />{o}
                  </label>
                )) : f.check ? (
                  <label className="check"><input id={f.k} type="checkbox" checked={v[f.k] === 'si'} aria-invalid={!!err[f.k]}
                    onChange={(e) => set(f.k, e.target.checked ? 'si' : '')} />{f.label}</label>
                ) : (
                  <>
                    <label htmlFor={f.k}>{f.label}</label>
                    <div className="suf">
                      <input id={f.k} type={f.type ?? 'text'} value={v[f.k] ?? ''} autoFocus={n > 0 && i === 0} aria-invalid={!!err[f.k]}
                        onChange={(e) => set(f.k, e.target.value)} />
                      {f.suffix && <span>{f.suffix}</span>}
                    </div>
                  </>
                )}
                <small className="err" role="alert">{err[f.k]}</small>
              </div>
            ))}
          </fieldset>
          <div className="btns">
            {n > 0 && <button type="button" onClick={() => setN(n - 1)}>Atrás</button>}
            <button type="submit">{last ? 'Crear espacio' : 'Continuar'}</button>
          </div>
        </form>
      )}
    </section>
  );
}

// CSS: copia las reglas .card, .top, .steps, .pane, .f, .opt, dl, .btns y .ok de la pestaña HTML + CSS.
