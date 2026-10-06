import { useState, type CSSProperties } from 'react';

type Props = { titulo?: string; antes?: string; despues?: string };

function Scene() {
  return (
    <>
      <rect className="bg" width="160" height="100" />
      <path className="sun" d="M99 30a13 13 0 1 0 26 0a13 13 0 1 0-26 0" />
      <path className="far" d="M0 78 30 44l22 24 26-34 34 40 20-18 28 22V100H0z" />
      <path className="near" d="M0 90q30-22 60-6t60-4t40 6V100H0z" />
      <path className="lake" d="M0 96q40-8 80 0t80 0V100H0z" />
    </>
  );
}

export function ImageCompare({
  titulo = 'Retoque de color',
  antes = 'Versión original, sin retoque',
  despues = 'Versión retocada, con color',
}: Props) {
  const [p, setP] = useState(50);
  return (
    <div className="wrap">
      <h2>{titulo}</h2>
      <p className="muted">Fotografía de montaña antes y después de la edición.</p>
      <div className="cmp" role="group" aria-label="Comparación antes y después" style={{ '--p': `${p}%` } as CSSProperties}>
        <svg className="img before" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label={antes}><Scene /></svg>
        <svg className="img after" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" role="img" aria-label={despues}><Scene /></svg>
        <span className="tag a" aria-hidden="true">Antes</span>
        <span className="tag d" aria-hidden="true">Después</span>
        <span className="line" aria-hidden="true" />
        <span className="knob" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M8 7 3 12l5 5zm8 0v10l5-5z" /></svg></span>
        <input type="range" min={0} max={100} step={1} value={p} aria-label="Divisor entre antes y después"
               aria-valuetext={`Antes ${p} %, después ${100 - p} %`} onChange={(e) => setP(+e.target.value)} />
      </div>
      <p className="hint">Arrastra el divisor o usa las flechas, Inicio y Fin.</p>
    </div>
  );
}

// CSS: copia las reglas .wrap, .cmp, .img, .before, .after, .tag, .line, .knob y .hint de la pestaña HTML + CSS.
