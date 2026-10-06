import { useState, type KeyboardEvent } from 'react';

const DATA: [string, string][] = [
  ['Balanceadores de carga', 'Red'], ['Bases de datos gestionadas', 'Datos'], ['Buckets de almacenamiento', 'Datos'],
  ['Claves de API', 'Seguridad'], ['Facturación mensual', 'Cuenta'], ['Funciones sin servidor', 'Cómputo'],
  ['Máquinas virtuales', 'Cómputo'], ['Registros de auditoría', 'Seguridad'], ['Usuarios y roles', 'Cuenta'],
];

function Hl({ s, t }: { s: string; t: string }) {
  const i = t ? s.toLowerCase().indexOf(t.toLowerCase()) : -1;
  if (i < 0) return <>{s}</>;
  return <>{s.slice(0, i)}<mark>{s.slice(i, i + t.length)}</mark>{s.slice(i + t.length)}</>;
}

export function SearchSuggestions() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [recent, setRecent] = useState(['Máquinas virtuales', 'Claves de API']);
  const [status, setStatus] = useState('');
  const t = q.trim();
  const opts = t
    ? DATA.filter(([n]) => n.toLowerCase().includes(t.toLowerCase()))
    : recent.map((n) => DATA.find((d) => d[0] === n)!);

  const pick = (i: number) => {
    const n = opts[i][0];
    setQ(n); setOpen(false); setActive(-1);
    setRecent((r) => [n, ...r.filter((x) => x !== n)].slice(0, 4));
    setStatus(`Abriendo ${n}.`);
  };
  const onKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      if (!open) return setOpen(true);
      if (opts.length) setActive((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + opts.length) % opts.length);
    } else if (e.key === 'Enter' && active > -1) { e.preventDefault(); pick(active); }
    else if (e.key === 'Escape') setOpen(false);
  };

  return (
    <div className="ss">
      <label htmlFor="q">Buscar en la consola</label>
      <div className="field">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
          <circle cx="7" cy="7" r="5" /><path d="m11 11 3.5 3.5" />
        </svg>
        <input
          id="q" type="text" role="combobox" aria-expanded={open} aria-controls="lb" aria-autocomplete="list"
          aria-activedescendant={open && active > -1 ? `o${active}` : undefined}
          autoComplete="off" placeholder="Servicios, facturas, usuarios" value={q}
          onChange={(e) => { setQ(e.target.value); setActive(-1); setOpen(true); }}
          onFocus={() => setOpen(true)} onBlur={() => setOpen(false)} onKeyDown={onKey}
        />
      </div>
      <ul id="lb" role="listbox" aria-label="Sugerencias" hidden={!open}>
        {!t && <li className="group" role="presentation">Búsquedas recientes</li>}
        {opts.map(([n, c], i) => (
          <li key={n} id={`o${i}`} role="option" aria-selected={i === active}
              onMouseDown={(e) => { e.preventDefault(); pick(i); }}>
            <Hl s={n} t={t} /><small>{c}</small>
          </li>
        ))}
        {!opts.length && <li className="none" role="presentation">Sin resultados para “{t}”. Prueba con otro término.</li>}
      </ul>
      <p className="status" aria-live="polite">{status}</p>
    </div>
  );
}

// CSS: copia las reglas .ss, .field, [role=listbox], [role=option], mark y .status de la pestaña HTML + CSS.
