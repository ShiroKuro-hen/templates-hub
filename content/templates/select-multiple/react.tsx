import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

const DATOS = ['Frontend', 'Backend', 'Diseño', 'Calidad (QA)', 'Infraestructura', 'Datos', 'Seguridad', 'Móvil', 'Producto'];
const norm = (s: string) => s.normalize('NFD').replace(/\p{M}/g, '').toLowerCase();

export function SelectMultiple({ opciones = DATOS }: { opciones?: string[] }) {
  const [sel, setSel] = useState<string[]>(['Frontend', 'Diseño']);
  const [q, setQ] = useState('');
  const [abierta, setAbierta] = useState(false);
  const [act, setAct] = useState(0);
  const input = useRef<HTMLInputElement>(null);
  const lista = useRef<HTMLUListElement>(null);

  const shown = opciones.filter((o) => norm(o).includes(norm(q)));
  const activa = shown[Math.min(act, shown.length - 1)];
  const toggle = (o: string) => setSel((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));

  useEffect(() => { lista.current?.querySelector('.act')?.scrollIntoView({ block: 'nearest' }); }, [act, abierta]);

  const keys = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault(); setAbierta(true);
      setAct((a) => (a + (e.key === 'ArrowDown' ? 1 : -1) + shown.length) % (shown.length || 1));
    } else if (e.key === 'Enter' && abierta && activa) { e.preventDefault(); toggle(activa); }
    else if (e.key === 'Escape') { if (abierta) { e.preventDefault(); setAbierta(false); } else setQ(''); }
    else if (e.key === 'Backspace' && !q && sel.length) setSel(sel.slice(0, -1));
  };

  return (
    <main className="card">
      <h1>Áreas del proyecto</h1>
      <p className="sub">Elige las áreas que participan. Puedes escribir para buscar.</p>
      <label id="lbl" htmlFor="q">Áreas</label>
      <div className="box" onClick={() => input.current?.focus()}>
        <ul className="chips" aria-label="Áreas elegidas">
          {sel.map((o) => (
            <li key={o} className="chip">{o}
              <button type="button" aria-label={`Quitar ${o}`} onClick={(e) => { e.stopPropagation(); setSel(sel.filter((x) => x !== o)); input.current?.focus(); }}>×</button>
            </li>
          ))}
        </ul>
        <input ref={input} id="q" role="combobox" aria-expanded={abierta} aria-controls="list" aria-autocomplete="list"
          aria-haspopup="listbox" aria-activedescendant={abierta && activa ? `o-${opciones.indexOf(activa)}` : undefined} autoComplete="off"
          placeholder="Buscar áreas" value={q} onChange={(e) => { setQ(e.target.value); setAct(0); setAbierta(true); }}
          onFocus={() => setAbierta(true)} onBlur={() => setAbierta(false)} onKeyDown={keys} />
      </div>
      <ul id="list" ref={lista} role="listbox" aria-labelledby="lbl" aria-multiselectable="true" hidden={!abierta}>
        {shown.length ? shown.map((o) => (
          <li key={o} id={`o-${opciones.indexOf(o)}`} role="option" aria-selected={sel.includes(o)} className={o === activa ? 'act' : undefined}
            onMouseDown={(e) => { e.preventDefault(); toggle(o); }}>{o}</li>
        )) : <li className="empty">No hay áreas con ese nombre. Prueba otra palabra.</li>}
      </ul>
      <p className="count" role="status">
        {sel.length ? `${sel.length} ${sel.length > 1 ? 'áreas elegidas' : 'área elegida'}.` : 'Aún no elegiste ninguna área. Abre la lista y marca una.'}
      </p>
    </main>
  );
}

// CSS: copia las reglas .card, .box, .chip, #q, #list, [role=option] y .count de la pestaña HTML + CSS.
