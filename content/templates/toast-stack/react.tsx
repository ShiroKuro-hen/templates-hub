import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';

type Kind = 'ok' | 'err' | 'info' | 'warn';
type Toast = { id: number; kind: Kind; title: string; text?: string };
type Push = (kind: Kind, title: string, text?: string) => void;

const ToastCtx = createContext<Push>(() => {});
export const useToast = () => useContext(ToastCtx);

function Item({ t, onClose, ms }: { t: Toast; onClose: (id: number) => void; ms: number }) {
  const timer = useRef<number>();
  const start = () => { timer.current = window.setTimeout(() => onClose(t.id), ms); };
  useEffect(() => { start(); return () => clearTimeout(timer.current); }, []);
  return (
    <li
      className={`toast ${t.kind}`}
      role={t.kind === 'err' ? 'alert' : 'status'}
      onMouseEnter={() => clearTimeout(timer.current)}
      onMouseLeave={start}
    >
      <span><b>{t.title}</b>{t.text && <small>{t.text}</small>}</span>
      <button type="button" aria-label="Cerrar aviso" onClick={() => onClose(t.id)}>×</button>
    </li>
  );
}

export function ToastProvider({ children, ms = 5000, max = 4 }: { children: ReactNode; ms?: number; max?: number }) {
  const [items, setItems] = useState<Toast[]>([]);
  const id = useRef(0);
  const close = useCallback((i: number) => setItems((l) => l.filter((t) => t.id !== i)), []);
  const push: Push = (kind, title, text) =>
    setItems((l) => [...l, { id: ++id.current, kind, title, text }].slice(-max));

  return (
    <ToastCtx.Provider value={push}>
      {children}
      <ul className="toasts" aria-live="polite" aria-label="Notificaciones">
        {items.map((t) => <Item key={t.id} t={t} onClose={close} ms={ms} />)}
      </ul>
    </ToastCtx.Provider>
  );
}

// Uso: const toast = useToast(); toast('ok', 'Cambios guardados', 'Tu perfil ya está actualizado.');
// CSS: copia las reglas .toasts / .toast / .toast.ok / .warn / .err / .toast span / .toast b / .toast small / .toast button de la pestaña HTML + CSS.
