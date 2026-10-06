import { useState } from 'react';

type Mov = { n: string; m: number; f: string };
type Preset = '7' | '30' | '90' | 'year' | 'all';

const iso = (d: Date) => new Date(d.getTime() - d.getTimezoneOffset() * 6e4).toISOString().slice(0, 10);
const today = new Date(new Date().setHours(0, 0, 0, 0));
const ago = (n: number) => { const d = new Date(today); d.setDate(d.getDate() - n); return iso(d); };
const ITEMS: Mov[] = ([['Suscripción Pro', 49, 1], ['Licencias adicionales', 180, 4], ['Soporte premium', 320, 9],
  ['Dominio renovado', 18, 17], ['Almacenamiento extra', 75, 26], ['Capacitación del equipo', 640, 62]] as const)
  .map(([n, m, o]) => ({ n, m, f: ago(o) }));
const PRESETS: [Preset, string][] = [['7', 'Últimos 7 días'], ['30', 'Últimos 30 días'], ['90', 'Últimos 90 días'], ['year', 'Este año'], ['all', 'Todo']];
const range = (p: Preset): [string, string] =>
  p === 'all' ? ['', ''] : p === 'year' ? [`${today.getFullYear()}-01-01`, iso(today)] : [ago(+p), iso(today)];
const money = (v: number) => v.toLocaleString('es', { style: 'currency', currency: 'USD' });
const date = (d: string) => new Date(d + 'T00:00').toLocaleDateString('es', { day: 'numeric', month: 'short', year: 'numeric' });

export function DateRangeFilter({ items = ITEMS }: { items?: Mov[] }) {
  const [[a, b], setR] = useState<[string, string]>(range('30'));
  const bad = !!a && !!b && a > b;
  const hits = bad ? [] : items.filter((i) => (!a || i.f >= a) && (!b || i.f <= b));

  return (
    <div className="dr">
      <form aria-label="Rango de fechas" onSubmit={(e) => e.preventDefault()}>
        <div className="pres" role="group" aria-label="Rangos rápidos">
          {PRESETS.map(([p, t]) => (
            <button key={p} type="button" aria-pressed={range(p).join() === [a, b].join()} onClick={() => setR(range(p))}>{t}</button>
          ))}
        </div>
        <div className="dates">
          <label>Desde<input type="date" value={a} max={iso(today)} onChange={(e) => setR([e.target.value, b])} /></label>
          <label>Hasta<input type="date" value={b} max={iso(today)} onChange={(e) => setR([a, e.target.value])} /></label>
        </div>
        {bad && <p className="err" role="alert">La fecha final es anterior a la inicial. Cambia «Hasta» o elige un rango rápido.</p>}
      </form>
      <h2 aria-live="polite">
        <span>{hits.length} movimientos</span><span>{money(hits.reduce((s, i) => s + i.m, 0))}</span>
      </h2>
      <ul>
        {hits.map((i, k) => (
          <li key={k}><span>{i.n}<small><time dateTime={i.f}>{date(i.f)}</time></small></span><output>{money(i.m)}</output></li>
        ))}
        {!hits.length && <li className="empty">No hay movimientos en este rango. Amplía las fechas o elige «Todo».</li>}
      </ul>
    </div>
  );
}

// CSS: copia las reglas .dr, form, .pres, button, .dates, label, input, .err, h2 y li de la pestaña HTML + CSS.
