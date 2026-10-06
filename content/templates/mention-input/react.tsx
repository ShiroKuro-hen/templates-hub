import { useRef, useState, type KeyboardEvent } from 'react';

const TEAM = [['Ana Pérez', 'Diseño'], ['Bruno Salas', 'Ingeniería'], ['Carla Núñez', 'Producto'], ['Diego Herrera', 'Soporte'], ['Elena Vidal', 'Datos']];
const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function MentionInput() {
  const [text, setText] = useState('');
  const [query, setQuery] = useState<string | null>(null); // null = lista cerrada
  const [sel, setSel] = useState(0);
  const from = useRef(0);
  const ref = useRef<HTMLTextAreaElement>(null);
  const items = query === null ? [] : TEAM.filter(([n]) => norm(n).includes(norm(query)));
  const hit = TEAM.filter(([n]) => text.includes('@' + n));

  const onChange = (v: string, pos: number) => {
    setText(v);
    const r = /(^|\s)@([^\s@]*)$/.exec(v.slice(0, pos));
    setQuery(r ? r[2] : null); setSel(0);
    if (r) from.current = pos - r[2].length - 1;
  };
  const pick = (i: number) => {
    const el = ref.current!, v = text.slice(0, from.current) + '@' + items[i][0] + ' ' + text.slice(el.selectionStart);
    const pos = from.current + items[i][0].length + 2;
    setText(v); setQuery(null);
    requestAnimationFrame(() => { el.focus(); el.setSelectionRange(pos, pos); });
  };
  const onKey = (e: KeyboardEvent) => {
    if (query === null) return;
    if (e.key === 'Escape') { e.preventDefault(); setQuery(null); }
    else if (items.length && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault(); setSel((sel + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length);
    } else if (items.length && (e.key === 'Enter' || e.key === 'Tab')) { e.preventDefault(); pick(sel); }
  };

  return (
    <div className="mi">
      <label htmlFor="t">Comentario para el equipo</label>
      <textarea id="t" ref={ref} rows={3} value={text} placeholder="Escribe @ para mencionar a alguien"
        role="combobox" aria-expanded={query !== null} aria-controls="list" aria-autocomplete="list" aria-describedby="m"
        aria-activedescendant={items.length && query !== null ? `o${sel}` : undefined}
        onChange={(e) => onChange(e.target.value, e.target.selectionStart)}
        onKeyDown={onKey} onBlur={() => setQuery(null)} />
      <ul className="list" id="list" role="listbox" aria-label="Personas del equipo" hidden={query === null}>
        {items.map(([n, r], i) => (
          <li key={n} id={`o${i}`} role="option" aria-selected={i === sel} onMouseDown={(e) => { e.preventDefault(); pick(i); }}>
            <span className="av" aria-hidden="true">{n.split(' ').map((w) => w[0]).join('')}</span>
            <span className="who"><b>{n}</b><small>{r}</small></span>
          </li>
        ))}
        {!items.length && <li className="none">Sin resultados para «{query}». Prueba con otro nombre.</li>}
      </ul>
      <p className="meta" id="m" aria-live="polite">
        {hit.length ? <>Se notificará a {hit.map(([n]) => <span key={n} className="chip">{n}</span>)}</> : 'Usa las flechas para elegir y Enter para insertar.'}
      </p>
    </div>
  );
}

// CSS: copia las reglas .mi, textarea, .list, .av, .who, .meta y .chip de la pestaña HTML + CSS.
