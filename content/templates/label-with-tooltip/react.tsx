import { useEffect, useId, useRef, useState } from 'react';
import type { InputHTMLAttributes } from 'react';

type FieldProps = {
  label: string;
  about: string; // "el límite de gasto" para el aria-label del botón
  tip: string;
} & InputHTMLAttributes<HTMLInputElement>;

type Mode = 'closed' | 'hover' | 'pinned';

export function LabelWithTooltip({ label, about, tip, ...input }: FieldProps) {
  const id = useId();
  const [mode, setMode] = useState<Mode>('closed');
  const btn = useRef<HTMLButtonElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const open = mode !== 'closed';

  useEffect(() => {
    if (!open) return;
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMode('closed'); btn.current?.focus(); } };
    const out = (e: MouseEvent) => { if (!wrap.current?.contains(e.target as Node)) setMode('closed'); };
    document.addEventListener('keydown', esc);
    document.addEventListener('click', out);
    return () => { document.removeEventListener('keydown', esc); document.removeEventListener('click', out); };
  }, [open]);

  return (
    <div className="field">
      <div className="lab" ref={wrap}>
        <label htmlFor={id}>{label}</label>
        <button ref={btn} type="button" className="help" aria-label={`Más información sobre ${about}`}
          aria-expanded={open} aria-controls={`${id}-tip`}
          onClick={() => setMode(mode === 'pinned' ? 'closed' : 'pinned')}
          onPointerEnter={() => setMode((m) => (m === 'pinned' ? m : 'hover'))}
          onPointerLeave={() => setMode((m) => (m === 'pinned' ? m : 'closed'))}>
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9.5 9a2.5 2.5 0 1 1 3.6 2.2c-.7.4-1.1 1-1.1 1.8M12 17.5v.01" /></svg>
        </button>
        <div className="tip" id={`${id}-tip`} hidden={!open}>{tip}</div>
      </div>
      <input id={id} aria-describedby={`${id}-tip`} {...input} />
    </div>
  );
}

export function BillingForm() {
  return (
    <form onSubmit={(e) => e.preventDefault()} aria-labelledby="t">
      <h2 id="t">Configurar facturación</h2>
      <LabelWithTooltip label="Límite de gasto mensual" about="el límite de gasto" inputMode="numeric" defaultValue="1.500"
        tip="Al llegar a este importe pausamos los envíos y te avisamos por correo. Puedes subirlo cuando quieras." />
      <LabelWithTooltip label="Dominio personalizado" about="el dominio" placeholder="panel.miempresa.com"
        tip="Escribe solo el dominio, sin https://. Después añade un registro CNAME que apunte a clientes.ejemplo.com." />
      <button className="btn" type="submit">Guardar cambios</button>
    </form>
  );
}
// CSS: copia las reglas form, .field, .lab, .help, .tip, input y .btn de la pestaña HTML + CSS.
