import { useEffect, useId, useState } from 'react';

type Props = { label: string; max?: number; placeholder?: string; defaultValue?: string; onChange?: (value: string) => void };

export function CounterTextarea({ label, max = 140, placeholder, defaultValue = '', onChange }: Props) {
  const id = useId();
  const [value, setValue] = useState(defaultValue);
  const [live, setLive] = useState('');

  const len = value.length;
  const rest = max - len;
  const band = rest <= 0 ? 'full' : len / max >= 0.85 ? 'warn' : '';

  // Anuncia solo al cambiar de umbral, no en cada tecla.
  useEffect(() => {
    setLive(band === 'full' ? 'Has alcanzado el límite de caracteres.' : band ? `Quedan ${rest} caracteres.` : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [band]);

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <textarea
        id={id}
        value={value}
        maxLength={max}
        placeholder={placeholder}
        onChange={(e) => { setValue(e.target.value); onChange?.(e.target.value); }}
      />
      <div className={`meta ${band}`} aria-hidden="true">
        <progress max={max} value={len} />
        <span id="count"><b>{len}</b> / {max}</span>
        <span id="left">{rest <= 0 ? 'Límite alcanzado' : band ? `Te quedan ${rest}` : ''}</span>
      </div>
      <p className="sr" role="status">{live}</p>
    </div>
  );
}
// CSS: copia las reglas label / textarea / .meta / progress / .warn / .full / #left / .sr de la pestaña HTML + CSS.
