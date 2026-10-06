import { useState, type CSSProperties } from 'react';

const MAX = 300, STEP = 25, C = [4, 9, 18, 26, 31, 24, 19, 12, 8, 5, 3, 2], TOP = Math.max(...C);
const eur = (n: number) => `${n.toLocaleString('es-ES')} €`;
const num = (v: string, d: number) => (v === '' || isNaN(+v) ? d : Math.min(MAX, Math.max(0, +v)));

export function PriceRangeFilter({ initial = [40, 180] }: { initial?: [number, number] }) {
  const [lo, setLo] = useState(initial[0]);
  const [hi, setHi] = useState(initial[1]);
  const [text, setText] = useState({ lo: String(initial[0]), hi: String(initial[1]) });

  const bad = lo > hi;
  const count = bad ? 0 : C.reduce((s, c, i) => s + (c * Math.max(0, Math.min(hi, (i + 1) * STEP) - Math.max(lo, i * STEP))) / STEP, 0);
  const vars = { '--a': (Math.min(lo, hi) / MAX) * 100, '--b': (Math.max(lo, hi) / MAX) * 100 } as CSSProperties;

  const slideLo = (v: number) => { const x = Math.min(v, hi); setLo(x); setText((t) => ({ ...t, lo: String(x) })); };
  const slideHi = (v: number) => { const x = Math.max(v, lo); setHi(x); setText((t) => ({ ...t, hi: String(x) })); };

  return (
    <form noValidate onSubmit={(e) => e.preventDefault()}>
      <fieldset>
        <legend>Precio</legend>
        <div className="hist" aria-hidden="true">
          {C.map((c, i) => <i key={i} className={!bad && (i + 1) * STEP > lo && i * STEP < hi ? 'in' : ''} style={{ ['--h' as string]: (c / TOP) * 100 }} />)}
        </div>
        <div className="slider" style={vars}>
          <div className="rail" aria-hidden="true"><div className="fill" /></div>
          <input type="range" min={0} max={MAX} step={5} value={lo} aria-label="Precio mínimo" onChange={(e) => slideLo(+e.target.value)} />
          <input type="range" min={0} max={MAX} step={5} value={hi} aria-label="Precio máximo" onChange={(e) => slideHi(+e.target.value)} />
        </div>
        <div className="fields">
          {([['Mínimo', 'lo', setLo], ['Máximo', 'hi', setHi]] as const).map(([label, k, set]) => (
            <label key={k}>{label}
              <span className="field" data-bad={bad || undefined}>
                <input type="number" min={0} max={MAX} step={5} inputMode="numeric" value={text[k]} aria-invalid={bad} aria-describedby="err"
                       onChange={(e) => { setText({ ...text, [k]: e.target.value }); set(num(e.target.value, k === 'lo' ? 0 : MAX)); }}
                       onBlur={() => setText({ lo: String(lo), hi: String(hi) })} />
                <span aria-hidden="true">€</span>
              </span>
            </label>
          ))}
        </div>
        <p className="err" id="err" role="alert" hidden={!bad}>
          El mínimo ({eur(lo)}) supera al máximo ({eur(hi)}). Baja el mínimo o sube el máximo.
        </p>
        <button className="go" type="submit" disabled={bad}>{bad ? 'Corrige el rango' : `Ver ${Math.round(count)} artículos`}</button>
      </fieldset>
    </form>
  );
}

// CSS: copia las reglas fieldset, .hist, .slider, .rail, .fill, .slider input, .fields, .field, .err y .go de la pestaña HTML + CSS.
