import { useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';

const TEXTO =
  'La migración a la nueva plataforma de facturación terminó el martes. Todos los clientes con plan anual conservan su precio actual hasta la próxima renovación, y los reembolsos pendientes se procesan en un máximo de cinco días hábiles.';
const CIFRAS = ['1.111,00', '8.888,50', '1.234,10'];

function Panel({ title, hint, children }: { title: string; hint: ReactNode; children: ReactNode }) {
  return (
    <section>
      <h2>{title}</h2>
      <p className="hint">{hint}</p>
      {children}
    </section>
  );
}

const Cifras = ({ cls }: { cls?: string }) => (
  <p className={cls}>{CIFRAS.map((c, i) => <span key={c}>{c}{i < CIFRAS.length - 1 && <br />}</span>)}</p>
);

export function TextUtilities() {
  const [lines, setLines] = useState(2);
  return (
    <div className="grid">
      <Panel title="Truncado de líneas" hint={<>Corta el texto con puntos suspensivos. Usa <code>line-clamp</code>.</>}>
        <label>
          Líneas
          <input type="range" min={1} max={4} value={lines} onChange={(e) => setLines(+e.target.value)} />
          <output>{lines}</output>
        </label>
        <p className="clamp" style={{ '--n': lines } as CSSProperties}>{TEXTO}</p>
      </Panel>
      <Panel title="Balance de texto" hint={<>Reparte las palabras entre líneas. Usa <code>text-wrap: balance</code>.</>}>
        <div className="pair">
          <div><small>Normal</small><b className="pre">Tu informe mensual está listo para revisar</b></div>
          <div><small>Equilibrado</small><b className="bal">Tu informe mensual está listo para revisar</b></div>
        </div>
      </Panel>
      <Panel title="Listas" hint="Marcadores con el color de acento.">
        <ul><li>Invita a tu equipo</li><li>Conecta una fuente de datos</li><li>Publica tu primer panel</li></ul>
        <ol><li>Crea el proyecto</li><li>Configura el dominio</li><li>Lanza la versión</li></ol>
      </Panel>
      <Panel title="Números tabulares" hint={<>Todas las cifras miden lo mismo. Usa <code>tabular-nums</code>.</>}>
        <div className="nums">
          <div><small>Proporcional</small><Cifras /></div>
          <div><small>Tabular</small><Cifras cls="t" /></div>
        </div>
      </Panel>
    </div>
  );
}
// CSS: copia las reglas .grid, section, .clamp, .pair, .bal, ul/ol y .nums de la pestaña HTML + CSS.
