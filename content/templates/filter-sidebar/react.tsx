import { useState } from 'react';

type P = [cat: string, brand: string, price: number, rating: number];
const DATA: P[] = [
  ['Zapatillas', 'Aero', 89, 4.6], ['Zapatillas', 'Vento', 129, 4.2], ['Zapatillas', 'Pulse', 74, 3.8], ['Zapatillas', 'Nordik', 159, 4.8],
  ['Ropa', 'Aero', 45, 4.1], ['Ropa', 'Lumen', 62, 3.4], ['Ropa', 'Nordik', 98, 4.5], ['Ropa', 'Pulse', 29, 3.1], ['Ropa', 'Vento', 84, 4.0],
  ['Mochilas', 'Lumen', 39, 4.4], ['Mochilas', 'Nordik', 119, 4.7], ['Mochilas', 'Aero', 55, 3.6],
  ['Accesorios', 'Pulse', 12, 3.9], ['Accesorios', 'Lumen', 24, 4.3], ['Accesorios', 'Vento', 18, 2.9], ['Accesorios', 'Aero', 33, 4.5],
];
const CATS = ['Zapatillas', 'Ropa', 'Mochilas', 'Accesorios'];
const BRANDS = ['Aero', 'Lumen', 'Nordik', 'Pulse', 'Vento'];
const EMPTY = { cats: [] as string[], brands: [] as string[], min: '', max: '', rate: 0, q: '' };

export function FilterSidebar() {
  const [s, setS] = useState(EMPTY);
  const toggle = (k: 'cats' | 'brands', v: string) =>
    setS((x) => ({ ...x, [k]: x[k].includes(v) ? x[k].filter((y) => y !== v) : [...x[k], v] }));

  const min = s.min === '' ? 0 : +s.min, max = s.max === '' ? Infinity : +s.max, bad = min > max;
  const n = bad ? 0 : DATA.filter(([c, b, p, r]) =>
    (!s.cats.length || s.cats.includes(c)) && (!s.brands.length || s.brands.includes(b)) && p >= min && p <= max && r >= s.rate).length;
  const active = +!!s.cats.length + +!!s.brands.length + +!!(s.min || s.max) + +!!s.rate;

  return (
    <form className="side" aria-label="Filtros de la tienda" noValidate onSubmit={(e) => e.preventDefault()}>
      <div className="top">
        <h2>Filtros{active > 0 && <span className="badge">{active}</span>}</h2>
        <button className="link" type="button" onClick={() => setS(EMPTY)}>Limpiar todo</button>
      </div>
      <details open><summary>Categoría</summary><div className="body">
        {CATS.map((c) => (
          <label key={c} className="opt"><input type="checkbox" checked={s.cats.includes(c)} onChange={() => toggle('cats', c)} /> {c}</label>
        ))}
      </div></details>
      <details open><summary>Precio</summary><div className="body">
        <div className="pair">
          {(['min', 'max'] as const).map((k) => (
            <label key={k}>{k === 'min' ? 'Mínimo' : 'Máximo'} (€)
              <input type="number" min={0} max={500} inputMode="numeric" value={s[k]} aria-invalid={bad} aria-describedby="perr"
                     onChange={(e) => setS({ ...s, [k]: e.target.value })} /></label>
          ))}
        </div>
        <p className="err" id="perr" role="alert" hidden={!bad}>El mínimo supera al máximo. Cambia uno de los dos valores.</p>
      </div></details>
      <details open><summary>Marca</summary><div className="body">
        <input type="search" placeholder="Buscar marca" aria-label="Buscar marca" value={s.q} onChange={(e) => setS({ ...s, q: e.target.value })} />
        {BRANDS.filter((b) => b.toLowerCase().includes(s.q.trim().toLowerCase())).map((b) => (
          <label key={b} className="opt"><input type="checkbox" checked={s.brands.includes(b)} onChange={() => toggle('brands', b)} /> {b}</label>
        ))}
      </div></details>
      <details open><summary>Valoración</summary><div className="body">
        {([[0, 'Todas', ''], [4, '4 estrellas o más', '★★★★'], [3, '3 estrellas o más', '★★★']] as const).map(([v, label, stars]) => (
          <label key={v} className="opt">
            <input type="radio" name="rate" checked={s.rate === v} onChange={() => setS({ ...s, rate: v })} />
            {stars && <span className="stars" aria-hidden="true">{stars}</span>} {label}
          </label>
        ))}
      </div></details>
      <div className="foot">
        <button className="go" type="submit" disabled={!n}>{n ? `Ver ${n} resultado${n > 1 ? 's' : ''}` : 'Sin resultados'}</button>
        <div className="meter" aria-hidden="true"><i style={{ width: `${(n / DATA.length) * 100}%` }} /></div>
      </div>
    </form>
  );
}

// CSS: copia las reglas .side, .top, .badge, .link, details, summary, .body, .opt, .stars, .pair, input, .err, .go y .meter de la pestaña HTML + CSS.
