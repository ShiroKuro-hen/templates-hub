import type { CSSProperties } from 'react';

type Pair = {
  name: string;
  kind: string;
  display: string; // nombre de la variable CSS
  body: string;
  title: string;
  text: string;
  stats: string[];
  mono?: boolean;
};

const PAIRS: Pair[] = [
  { name: 'Editorial', kind: 'Serif + sans', display: 'serif', body: 'sans',
    title: 'El informe trimestral ya está listo',
    text: 'Titulares con serifa dan autoridad; el cuerpo en sans mantiene la lectura ágil en pantalla.',
    stats: ['Ingresos 1.284.500', 'Clientes 3.912'] },
  { name: 'Técnico', kind: 'Sans + monoespaciada', display: 'sans', body: 'sans', mono: true,
    title: 'Despliegue completado en 42 s',
    text: 'Una sola familia limpia para la interfaz, con monoespaciada reservada para identificadores y comandos.',
    stats: ['build #2481', '14 pruebas'] },
  { name: 'Humanista', kind: 'Humanista + serif', display: 'humanist', body: 'serif',
    title: 'Tu equipo crece, tu plan también',
    text: 'Titulares cálidos y legibles, cuerpo con serifa para textos largos como guías y artículos de ayuda.',
    stats: ['12 miembros', '40 GB libres'] },
];

export function TypePairings() {
  return (
    <div className="grid">
      {PAIRS.map((p) => (
        <article key={p.name}>
          <div className="meta"><b>{p.name}</b><span>{p.kind}</span></div>
          <div className="spec" style={{ '--d': `var(--${p.display})`, '--b': `var(--${p.body})` } as CSSProperties}>
            <h3>{p.title}</h3>
            <p>{p.text}</p>
            <div className="nums" style={p.mono ? { fontFamily: 'var(--mono)' } : undefined}>
              <i />{p.stats.map((s) => <span key={s}>{s}</span>)}
            </div>
          </div>
          <code>{`--display: var(--${p.display});\n--body: var(--${p.body});${p.mono ? '\n--code: var(--mono);' : ''}`}</code>
        </article>
      ))}
    </div>
  );
}
// CSS: copia las reglas .grid, article, .meta, .spec y code (y las variables --serif, --sans, --humanist, --mono) de la pestaña HTML + CSS.
