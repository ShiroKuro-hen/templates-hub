type Meter = { id: string; label: string; used: number; max: number; unit?: string; free: string };

const METERS: Meter[] = [
  { id: 'storage', label: 'Almacenamiento', used: 42.6, max: 100, unit: ' GB', free: 'Quedan 57,4 GB.' },
  { id: 'users', label: 'Usuarios', used: 18, max: 25, free: 'Quedan 7 puestos.' },
  { id: 'api', label: 'Llamadas a la API', used: 91400, max: 100000, free: 'Quedan 8.600 llamadas este mes.' },
  { id: 'domains', label: 'Dominios personalizados', used: 5, max: 5, free: 'Elimina un dominio o mejora el plan para añadir otro.' },
];

const fmt = (n: number) => n.toLocaleString('es-ES', { useGrouping: 'always' } as Intl.NumberFormatOptions);

export function UsageMeters({ meters = METERS }: { meters?: Meter[] }) {
  return (
    <section className="plan" aria-labelledby="um-t">
      <div className="head">
        <div><h2 id="um-t">Uso del plan</h2><p>Plan Business. Se renueva el 1 de noviembre.</p></div>
        <button type="button" className="btn">Mejorar plan</button>
      </div>
      <ul>
        {meters.map((m) => {
          const pct = (m.used / m.max) * 100;
          const level = pct >= 100 ? 'err' : pct >= 80 ? 'warn' : undefined;
          return (
            <li key={m.id}>
              <div className="top">
                <label htmlFor={`um-${m.id}`}>{m.label}</label>
                <span className="val"><b>{fmt(m.used)}</b> de {fmt(m.max)}{m.unit}</span>
              </div>
              <progress id={`um-${m.id}`} className={level} value={m.used} max={m.max}>{Math.round(pct)} %</progress>
              <p className="note">
                {level && <span className={`badge b-${level}`}>{level === 'err' ? 'Límite alcanzado' : 'Cerca del límite'}</span>}
                {m.free}
              </p>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
// CSS: copia las reglas .plan / .head / .btn / ul / .top / .val / progress / .note / .badge / .b-warn / .b-err de la pestaña HTML + CSS.
