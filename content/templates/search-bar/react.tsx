import { useMemo, useRef, useState, Fragment } from 'react';

type Item = { name: string; detail: string };

const norm = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

function Highlight({ text, term }: { text: string; term: string }) {
  const i = term ? norm(text).indexOf(term) : -1;
  if (i < 0) return <>{text}</>;
  return (
    <Fragment>
      {text.slice(0, i)}
      <mark>{text.slice(i, i + term.length)}</mark>
      {text.slice(i + term.length)}
    </Fragment>
  );
}

export function SearchList({ items, placeholder = 'Busca un país o una capital' }: { items: Item[]; placeholder?: string }) {
  const [value, setValue] = useState('');
  const input = useRef<HTMLInputElement>(null);
  const term = norm(value.trim());
  const rows = useMemo(() => items.filter((it) => norm(`${it.name} ${it.detail}`).includes(term)), [items, term]);

  const clear = () => { setValue(''); input.current?.focus(); };

  return (
    <>
      <form className="box" role="search" onSubmit={(e) => e.preventDefault()}>
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" /><path d="M20 20l-4-4" /></svg>
        <input
          ref={input}
          type="search"
          value={value}
          placeholder={placeholder}
          aria-label="Buscar"
          autoComplete="off"
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Escape' && value) { e.preventDefault(); setValue(''); } }}
        />
        {value && (
          <button type="button" className="clear" aria-label="Limpiar búsqueda" onClick={clear}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 5l14 14M19 5L5 19" /></svg>
          </button>
        )}
      </form>
      <p id="n" role="status">{rows.length === 1 ? '1 resultado' : `${rows.length} resultados`}</p>
      <ul tabIndex={0} aria-label="Resultados">
        {rows.map((it) => (
          <li key={it.name}>
            <Highlight text={it.name} term={term} />
            <span><Highlight text={it.detail} term={term} /></span>
          </li>
        ))}
        {!rows.length && <li className="empty">Sin resultados para «{value.trim()}». Prueba con otra palabra.</li>}
      </ul>
    </>
  );
}
// CSS: copia las reglas .box / input / .clear / #n / ul / li / mark / .empty de la pestaña HTML + CSS.
