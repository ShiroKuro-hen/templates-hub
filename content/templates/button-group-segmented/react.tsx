import { useState } from 'react';

type Props<T extends string> = {
  label: string; // aria-label del grupo
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
};

// Selección única con aria-pressed
export function Segmented<T extends string>({ label, options, value, onChange }: Props<T>) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={o === value} onClick={() => onChange(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

// Selección múltiple: cada botón alterna su propio aria-pressed
export function Toggles({ label, options }: { label: string; options: readonly string[] }) {
  const [on, setOn] = useState<string[]>([]);
  const toggle = (o: string) => setOn((s) => (s.includes(o) ? s.filter((x) => x !== o) : [...s, o]));
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button key={o} type="button" aria-pressed={on.includes(o)} onClick={() => toggle(o)}>
          {o}
        </button>
      ))}
    </div>
  );
}

export function Demo() {
  const periodos = ['Día', 'Semana', 'Mes', 'Año'] as const;
  const [p, setP] = useState<(typeof periodos)[number]>('Semana');
  return (
    <>
      <Segmented label="Periodo del informe" options={periodos} value={p} onChange={setP} />
      <p className="out" aria-live="polite">Mostrando: {p}</p>
      <Toggles label="Formato de texto" options={['Negrita', 'Cursiva', 'Subrayado']} />
    </>
  );
}
// CSS: copia las reglas .seg / .seg button / .out de la pestaña HTML + CSS.
