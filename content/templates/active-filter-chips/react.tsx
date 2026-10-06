import { useEffect, useRef, useState } from 'react';

type Key = 'estado' | 'prioridad' | 'equipo';
type Ticket = Record<Key, string> & { t: string };

const TICKETS: Ticket[] = [
  { t: 'No carga el panel de facturas', estado: 'Abierto', prioridad: 'Alta', equipo: 'Soporte' },
  { t: 'Error 502 al exportar informes', estado: 'Abierto', prioridad: 'Alta', equipo: 'Ingeniería' },
  { t: 'Solicitud de cotización anual', estado: 'En curso', prioridad: 'Media', equipo: 'Ventas' },
  { t: 'Cambiar correo de facturación', estado: 'Cerrado', prioridad: 'Baja', equipo: 'Soporte' },
  { t: 'Lentitud en la API de pagos', estado: 'En curso', prioridad: 'Alta', equipo: 'Ingeniería' },
  { t: 'No llegan los correos de aviso', estado: 'Abierto', prioridad: 'Alta', equipo: 'Soporte' },
];
const F: Record<Key, [string, string[]]> = {
  estado: ['Estado', ['Abierto', 'En curso', 'Cerrado']],
  prioridad: ['Prioridad', ['Alta', 'Media', 'Baja']],
  equipo: ['Equipo', ['Soporte', 'Ventas', 'Ingeniería']],
};

export function ActiveFilterChips({ items = TICKETS }: { items?: Ticket[] }) {
  const [act, setAct] = useState<Partial<Record<Key, string>>>({ estado: 'Abierto', prioridad: 'Alta' });
  const bar = useRef<HTMLDivElement>(null);
  const focus = useRef<number | null>(null);
  const on = Object.entries(act) as [Key, string][];
  const hits = items.filter((x) => on.every(([k, v]) => x[k] === v));

  useEffect(() => { // devuelve el foco al chip vecino (o al selector) tras quitar uno
    if (focus.current === null || !bar.current) return;
    const b = bar.current.querySelectorAll<HTMLElement>('.chip button');
    (b[focus.current] ?? b[focus.current - 1] ?? bar.current.querySelector('select'))?.focus();
    focus.current = null;
  }, [act]);

  const quitar = (k: Key, i: number) => { focus.current = i; setAct(({ [k]: _, ...rest }) => rest); };

  return (
    <div className="ac">
      <div className="bar" ref={bar}>
        <ul className="chips" aria-label="Filtros activos">
          {on.map(([k, v], i) => (
            <li className="chip" key={k}>
              <span>{F[k][0]}: <b>{v}</b></span>
              <button type="button" aria-label={`Quitar filtro ${F[k][0]}: ${v}`} onClick={() => quitar(k, i)}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d="m2 2 8 8M10 2l-8 8" /></svg>
              </button>
            </li>
          ))}
          {!on.length && <li className="hint">Sin filtros activos.</li>}
        </ul>
        <select aria-label="Añadir filtro" value="" onChange={(e) => { const [k, v] = e.target.value.split(':'); setAct({ ...act, [k]: v }); }}>
          <option value="">Añadir filtro</option>
          {(Object.keys(F) as Key[]).map((k) => (
            <optgroup key={k} label={F[k][0]}>
              {F[k][1].filter((v) => act[k] !== v).map((v) => <option key={v} value={`${k}:${v}`}>{v}</option>)}
            </optgroup>
          ))}
        </select>
        {!!on.length && <button type="button" className="clr" onClick={() => setAct({})}>Limpiar todo</button>}
      </div>
      <p className="head" aria-live="polite">{hits.length} tickets</p>
      <ul id="list">
        {hits.map((x) => <li key={x.t}><span>{x.t}</span><small>{x.estado}, {x.prioridad}, {x.equipo}</small></li>)}
        {!hits.length && <li className="empty">Ningún ticket coincide. Quita un filtro o pulsa «Limpiar todo».</li>}
      </ul>
    </div>
  );
}

// CSS: copia las reglas .ac, .bar, .chips, .chip, select, .clr, .head y #list de la pestaña HTML + CSS.
