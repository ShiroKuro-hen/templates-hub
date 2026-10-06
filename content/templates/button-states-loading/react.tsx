import { useEffect, useRef, useState, type ButtonHTMLAttributes } from 'react';

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
};

// Cargando usa aria-disabled (no disabled) para no perder el foco del teclado.
export function LoadingButton({ loading = false, loadingText = 'Cargando…', children, onClick, ...rest }: Props) {
  return (
    <button
      type="button"
      className="btn"
      aria-busy={loading || undefined}
      aria-disabled={loading || undefined}
      onClick={(e) => !loading && onClick?.(e)}
      {...rest}
    >
      {loading && <span className="spin" aria-hidden="true" />}
      {loading ? loadingText : children}
    </button>
  );
}

// Ejemplo: simula una petición de 2 s
export function Demo() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);

  function save() {
    setLoading(true);
    setMsg('Guardando cambios');
    timer.current = window.setTimeout(() => {
      setLoading(false);
      setMsg('Cambios guardados');
    }, 2000);
  }

  return (
    <>
      <LoadingButton loading={loading} loadingText="Guardando…" onClick={save}>Guardar</LoadingButton>
      <p role="status" className="sr">{msg}</p>
    </>
  );
}
// CSS: copia las reglas .btn / .spin / .sr y @keyframes spin de la pestaña HTML + CSS.
