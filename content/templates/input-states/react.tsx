import { useId, type InputHTMLAttributes } from 'react';

type Status = 'default' | 'error' | 'success';

type FieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> & {
  label: string;
  help?: string;
  status?: Status;
};

export function Field({ label, help, status = 'default', ...input }: FieldProps) {
  const id = useId();
  const helpId = `${id}-help`;
  const helpClass = status === 'error' ? 'help err' : status === 'success' ? 'help good' : 'help';

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        className={status === 'success' ? 'ok' : undefined}
        aria-invalid={status === 'error' ? true : undefined}
        aria-describedby={help ? helpId : undefined}
        {...input}
      />
      {help && <p id={helpId} className={helpClass}>{help}</p>}
    </div>
  );
}

export function InputStates() {
  return (
    <div className="grid">
      <Field label="Nombre" placeholder="Ana Torres" help="Como aparece en tu DNI." />
      <Field label="Correo" type="email" defaultValue="ana@correo" status="error" help="Falta el dominio, p. ej. .com" />
      <Field label="Código postal" defaultValue="28013" status="success" help="Código verificado." />
      <Field label="País" defaultValue="España" disabled help="No se puede cambiar." />
    </div>
  );
}
// CSS: copia las reglas .grid / .field / label / input (:focus, [aria-invalid], .ok, :disabled) / .help / .err / .good de la pestaña HTML + CSS.
