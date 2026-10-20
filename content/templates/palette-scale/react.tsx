import { useState } from 'react';

const SCALE: Record<number, string> = {
  50: '#f0f4ff', 100: '#dee5ff', 200: '#bccbff', 300: '#97adff', 400: '#6384ff',
  500: '#2f5bff', 600: '#2a50e1', 700: '#2444bf', 800: '#1d3594', 900: '#16276d',
};
const INK = '#0e1726', WHITE = '#ffffff';

const lum = (h: string) =>
  [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const grade = (r: number) => (r >= 4.5 ? ['ok', 'AA'] : r >= 3 ? ['warn', 'AA texto grande'] : ['err', 'No cumple']);

function Ratio({ label, r }: { label: string; r: number }) {
  const [cls, text] = grade(r);
  return <span>{label} {r.toFixed(2)}:1 <span className={`b ${cls}`}>{text}</span></span>;
}

export function PaletteScale() {
  const [msg, setMsg] = useState('');
  const copy = async (hex: string) => {
    try { await navigator.clipboard.writeText(hex); setMsg(`Copiado ${hex}.`); }
    catch { setMsg(`No se pudo copiar. Selecciona ${hex} a mano.`); }
  };
  const entries = Object.entries(SCALE);
  return (
    <section className="card" aria-labelledby="t">
      <h2 id="t">Escala de acento</h2>
      <p className="sub">Diez tonos del azul ultramar. Haz clic en un tono para copiar su valor.</p>
      <div className="strip" aria-hidden="true">
        {entries.map(([n, h]) => <i key={n} style={{ ['--c' as string]: h }} />)}
      </div>
      <ul>
        {entries.map(([n, h]) => {
          const w = ratio(h, WHITE), k = ratio(h, INK);
          return (
            <li key={n}>
              <button className="sw" type="button" onClick={() => copy(h)} aria-label={`Copiar azul ${n}, ${h}`}
                style={{ ['--c' as string]: h, ['--fg' as string]: w >= k ? WHITE : INK }}>Aa</button>
              <div><span className="name">Azul {n}</span><span className="hex">{h}</span></div>
              <div className="ratios"><Ratio label="Texto blanco" r={w} /><Ratio label="Texto oscuro" r={k} /></div>
            </li>
          );
        })}
      </ul>
      <p id="msg" role="status">{msg}</p>
    </section>
  );
}
// CSS: copia las reglas .card, .strip, .sw, .ratios y .b de la pestaña HTML + CSS.
