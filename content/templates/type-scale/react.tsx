type Step = { name: string; size: string; sample: string; cls: string };

const STEPS: Step[] = [
  { name: '--step-5', size: '3.4rem', sample: 'Titular', cls: 's5' },
  { name: '--step-4', size: '2.75rem', sample: 'Gran título', cls: 's4' },
  { name: '--step-3', size: '2.2rem', sample: 'Título de sección', cls: 's3' },
  { name: '--step-2', size: '1.76rem', sample: 'Subtítulo destacado', cls: 's2' },
  { name: '--step-1', size: '1.4rem', sample: 'Entradilla o lead de página', cls: 's1' },
  { name: '--step-0', size: '1.125rem', sample: 'Texto base para lectura cómoda.', cls: 's0' },
  { name: '--step--1', size: '0.9rem', sample: 'Texto pequeño para notas y pies.', cls: 's-1' },
];

export function TypeScale({ steps = STEPS }: { steps?: Step[] }) {
  return (
    <ol className="scale">
      {steps.map((s) => (
        <li key={s.name}>
          <span className="tok">
            <b>{s.name}</b>
            {s.size}
          </span>
          <p className={`smp ${s.cls}`}>{s.sample}</p>
        </li>
      ))}
    </ol>
  );
}
// CSS: copia las variables :root (--step-*) y las reglas .scale / .tok / .smp / .s5…s-1 de la pestaña HTML + CSS.
