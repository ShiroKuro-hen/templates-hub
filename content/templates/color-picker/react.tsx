import { useState } from 'react';

const MUESTRAS = [
  ['Ultramar', '#2f5bff'], ['Cian', '#0891b2'], ['Esmeralda', '#0e9f6e'], ['Ámbar', '#b7791f'],
  ['Coral', '#d92d4a'], ['Violeta', '#7c3aed'], ['Pizarra', '#334155'], ['Grafito', '#0e1726'],
] as const;
const HEX = /^#[0-9a-f]{6}$/i;

const rgb = (h: string) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const lum = (v: number[]) => {
  const [r, g, b] = v.map((n) => { n /= 255; return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: number[], b: number[]) => {
  const [p, q] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (p + 0.05) / (q + 0.05);
};

export function ColorPicker() {
  const [hex, setHex] = useState('#2f5bff');
  const [texto, setTexto] = useState('#2F5BFF');
  const [error, setError] = useState(false);
  const v = rgb(hex);

  const aplicar = (h: string) => { setHex(h.toLowerCase()); setTexto(h.toUpperCase()); setError(false); };
  const onTexto = (raw: string) => {
    const t = '#' + raw.replace(/[^0-9a-f]/gi, '');
    setTexto(t);
    if (HEX.test(t)) { setHex(t.toLowerCase()); setError(false); }
  };
  const onBlur = () => {
    const t = /^#[0-9a-f]{3}$/i.test(texto) ? '#' + [...texto.slice(1)].map((d) => d + d).join('') : texto;
    if (HEX.test(t)) aplicar(t); else setError(true);
  };

  return (
    <main className="card" style={{ ['--c' as string]: hex }}>
      <h1>Color de marca</h1>
      <p className="sub">Se usará en botones y enlaces de tu espacio.</p>
      <div className="prev" aria-hidden="true"><span>Aa Texto blanco</span><span>Aa Texto negro</span></div>
      <ul className="ratios" aria-live="polite">
        {([['blanco', [255, 255, 255]], ['negro', [0, 0, 0]]] as const).map(([n, fg]) => {
          const r = ratio(v, [...fg]), ok = r >= 4.5;
          return (
            <li key={n}>Texto {n} <b>{r.toFixed(1).replace('.', ',')}:1</b>{' '}
              <span className={ok ? 'badge' : 'badge no'}>{ok ? 'Cumple AA' : 'No cumple AA'}</span></li>
          );
        })}
      </ul>
      <div className="ctl">
        <input type="color" aria-label="Elegir color" value={hex} onChange={(e) => aplicar(e.target.value)} />
        <div className="f">
          <label htmlFor="x">Valor HEX</label>
          <input id="x" maxLength={7} spellCheck={false} autoComplete="off" aria-describedby="xe" aria-invalid={error}
            value={texto} onChange={(e) => onTexto(e.target.value)} onBlur={onBlur} />
        </div>
        <p className="rgb">rgb({v.join(', ')})</p>
      </div>
      <p className="err" id="xe" role="alert">{error ? 'Escribe un HEX de 6 dígitos, como #2F5BFF.' : ''}</p>
      <fieldset className="sws">
        <legend>Muestras</legend>
        {MUESTRAS.map(([n, h]) => (
          <button key={h} type="button" className="sw" style={{ ['--c' as string]: h }}
            aria-label={`${n} ${h.toUpperCase()}`} aria-pressed={h === hex} onClick={() => aplicar(h)} />
        ))}
      </fieldset>
    </main>
  );
}

// CSS: copia las reglas .card, .prev, .ratios, .badge, .ctl, #x, .sws y .sw de la pestaña HTML + CSS.
