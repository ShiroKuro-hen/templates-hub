type Status = 'ok' | 'warn' | 'err' | 'draft';

const DEFAULT_LABEL: Record<Status, string> = {
  ok: 'Activo',
  warn: 'Pendiente',
  err: 'Error',
  draft: 'Borrador',
};

type Props = { status: Status; children?: string }; // children sustituye el texto por defecto

export function StatusBadge({ status, children }: Props) {
  return <span className={`badge ${status === 'draft' ? '' : `badge--${status}`}`.trim()}>{children ?? DEFAULT_LABEL[status]}</span>;
}

// Ejemplo de uso
export function Demo() {
  return (
    <ul>
      <li>Pedido #1042 <StatusBadge status="ok" /></li>
      <li>Pedido #1041 <StatusBadge status="warn" /></li>
      <li>Pedido #1040 <StatusBadge status="err">Error de pago</StatusBadge></li>
      <li>Pedido #1039 <StatusBadge status="draft" /></li>
    </ul>
  );
}
// CSS: copia las reglas .badge / .badge--ok / .badge--warn / .badge--err y @keyframes pulse de la pestaña HTML + CSS.
