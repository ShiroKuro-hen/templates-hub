import { useState } from 'react';

export type Pattern = 'dots' | 'lines' | 'grid' | 'waves';
export type Tone = 'accent' | 'ok' | 'warn' | 'info' | 'muted';

const PATTERNS: { value: Pattern; label: string }[] = [
  { value: 'dots', label: 'Puntos' },
  { value: 'lines', label: 'Líneas' },
  { value: 'grid', label: 'Cuadrícula' },
  { value: 'waves', label: 'Ondas' },
];
const TONES: { value: Tone; label: string }[] = [
  { value: 'accent', label: 'Acento' },
  { value: 'ok', label: 'Éxito' },
  { value: 'warn', label: 'Aviso' },
  { value: 'info', label: 'Información' },
  { value: 'muted', label: 'Atenuado' },
];

export function layers(pattern: Pattern, size: number, color: string): string {
  const dot = Math.max(1, Math.round(size / 8));
  const arc = Math.round(size * 0.4);
  switch (pattern) {
    case 'dots':
      return `radial-gradient(circle, ${color} ${dot}px, transparent ${dot + 1}px)`;
    case 'lines':
      return `linear-gradient(${color} 2px, transparent 2px)`;
    case 'grid':
      return `linear-gradient(${color} 1px, transparent 1px), linear-gradient(90deg, ${color} 1px, transparent 1px)`;
    case 'waves':
      return `radial-gradient(circle at 50% 100%, transparent ${arc - 1}px, ${color} ${arc}px ${arc + 2}px, transparent ${arc + 3}px)`;
  }
}

export function PatternBackgroundGenerator() {
  const [pattern, setPattern] = useState<Pattern>('dots');
  const [size, setSize] = useState(24);
  const [tone, setTone] = useState<Tone>('accent');
  const [msg, setMsg] = useState('');

  const image = layers(pattern, size, `var(--${tone})`);
  const css = `.patron {\n  background-color: var(--surface);\n  background-image: ${image};\n  background-size: ${size}px ${size}px;\n}`;

  async function copy() {
    try {
      if (!navigator.clipboard) throw new Error('sin portapapeles');
      await navigator.clipboard.writeText(css);
      setMsg('CSS copiado.');
    } catch {
      setMsg('No se pudo copiar. Selecciona el código y cópialo a mano.');
    }
  }

  return (
    <section className="gen" aria-labelledby="gen-title">
      <h1 id="gen-title">Generador de patrones de fondo</h1>
      <p className="lead">Elige un patrón, ajusta su tamaño y color, y copia el CSS.</p>
      <div className="layout">
        <div className="panel">
          <fieldset>
            <legend>Patrón</legend>
            <div className="chips">
              {PATTERNS.map((p) => (
                <label key={p.value} className="chip">
                  <input type="radio" name="pattern" value={p.value} checked={pattern === p.value} onChange={() => setPattern(p.value)} />
                  {p.label}
                </label>
              ))}
            </div>
          </fieldset>
          <div className="field">
            <label htmlFor="size">
              Tamaño: <output htmlFor="size">{size}</output> px
            </label>
            <input id="size" type="range" min={8} max={48} value={size} onChange={(e) => setSize(Number(e.target.value))} />
          </div>
          <div className="field">
            <label htmlFor="color">Color</label>
            <select id="color" value={tone} onChange={(e) => setTone(e.target.value as Tone)}>
              {TONES.map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="out">
          <div className="preview" role="img" aria-label="Vista previa del patrón" style={{ backgroundImage: image, backgroundSize: `${size}px ${size}px` }} />
          <pre tabIndex={0} aria-label="CSS generado"><code>{css}</code></pre>
          <button type="button" className="btn" onClick={copy}>Copiar CSS</button>
          <p className="msg" role="status">{msg}</p>
        </div>
      </div>
    </section>
  );
}
// CSS: copia las reglas .gen / .layout (y media query) / .panel, .out / fieldset, legend, .field / .chip / .preview / pre / .btn / .msg de la pestaña HTML + CSS.
