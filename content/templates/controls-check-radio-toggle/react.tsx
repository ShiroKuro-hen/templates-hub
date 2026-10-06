import { useId, type ReactNode } from 'react';

type Kind = 'checkbox' | 'radio' | 'switch';

type ControlProps = {
  kind: Kind;
  label: ReactNode;
  name?: string;
  checked?: boolean;
  defaultChecked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
};

// El estilo vive en CSS: input[type=checkbox|radio] y [role=switch] con appearance:none.
export function Control({ kind, label, onChange, ...props }: ControlProps) {
  const id = useId();
  return (
    <label className="opt" htmlFor={id}>
      <input
        id={id}
        type={kind === 'radio' ? 'radio' : 'checkbox'}
        role={kind === 'switch' ? 'switch' : undefined}
        onChange={(e) => onChange?.(e.target.checked)}
        {...props}
      />
      {label}
    </label>
  );
}

export function ControlsDemo() {
  return (
    <div className="cols">
      <fieldset>
        <legend>Avisos por</legend>
        <Control kind="checkbox" name="av" label="Correo" defaultChecked />
        <Control kind="checkbox" name="av" label="SMS" />
        <Control kind="checkbox" name="av" label="Push (obligatorio)" defaultChecked disabled />
      </fieldset>
      <fieldset>
        <legend>Plan</legend>
        <Control kind="radio" name="plan" label="Gratis" defaultChecked />
        <Control kind="radio" name="plan" label="Pro" />
        <Control kind="radio" name="plan" label="Equipo (agotado)" disabled />
      </fieldset>
      <fieldset className="row">
        <legend>Preferencias</legend>
        <Control kind="switch" label="Sincronizar en segundo plano" defaultChecked />
        <Control kind="switch" label="Modo ahorro de datos" />
      </fieldset>
    </div>
  );
}
// CSS: copia las reglas .cols / fieldset / legend / .opt / input (checkbox, radio, [role=switch]) de la pestaña HTML + CSS.
