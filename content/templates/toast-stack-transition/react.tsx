import { useRef, useState } from 'react';

type Kind = 'ok' | 'warn' | 'err';
type Toast = { id: number; kind: Kind; leaving: boolean };

const MAX = 3;
const COPY: Record<Kind, { title: string; text: string; role: 'status' | 'alert'; icon: string }> = {
  ok: { title: 'Cambios guardados', text: 'Tu perfil se actualizó correctamente.', role: 'status', icon: '✓' },
  warn: { title: 'Espacio casi lleno', text: 'Quedan 500 MB de 5 GB disponibles.', role: 'status', icon: '!' },
  err: { title: 'No se pudo guardar', text: 'Revisa tu conexión e inténtalo de nuevo.', role: 'alert', icon: '✕' },
};
const TRIGGERS: [Kind, string][] = [['ok', 'Éxito'], ['warn', 'Aviso'], ['err', 'Error']];
const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

function retire(list: Toast[], ids: number[]): Toast[] {
  return calm
    ? list.filter((t) => !ids.includes(t.id))
    : list.map((t) => (ids.includes(t.id) ? { ...t, leaving: true } : t));
}

export function ToastStackTransition() {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const seq = useRef(0);
  const groupRef = useRef<HTMLDivElement>(null);

  function show(kind: Kind) {
    const id = seq.current++;
    setToasts((prev) => {
      const live = prev.filter((t) => !t.leaving);
      const expired = live.slice(0, Math.max(0, live.length + 1 - MAX)).map((t) => t.id);
      return [...retire(prev, expired), { id, kind, leaving: false }];
    });
  }

  const expire = (id: number) => setToasts((prev) => retire(prev, [id]));
  const drop = (id: number) => setToasts((prev) => prev.filter((t) => t.id !== id));
  const closeBy = (id: number) => {
    groupRef.current?.querySelector('button')?.focus();
    expire(id);
  };

  return (
    <main className="stage">
      <h1>Notificaciones</h1>
      <p className="lead">Dispara un aviso para ver cómo entra, se apila y se retira.</p>
      <div ref={groupRef} className="triggers" role="group" aria-label="Disparar notificación">
        {TRIGGERS.map(([kind, label]) => (
          <button key={kind} type="button" className="btn" onClick={() => show(kind)}>{label}</button>
        ))}
      </div>
      <section className="stack" aria-label="Notificaciones">
        {toasts.map((t) => {
          const c = COPY[t.kind];
          return (
            <div
              key={t.id}
              className={`wrap${t.leaving ? ' leaving' : ''}`}
              onTransitionEnd={(e) => {
                if (e.propertyName === 'grid-template-rows') drop(t.id);
              }}
            >
              <div className="inner">
                <div className={`toast ${t.kind}`} role={c.role}>
                  <i aria-hidden="true">{c.icon}</i>
                  <div className="msg"><b>{c.title}</b><span>{c.text}</span></div>
                  <button type="button" className="x" aria-label={`Cerrar: ${c.title}`} onClick={() => closeBy(t.id)}>×</button>
                  <span className="bar" aria-hidden="true" onAnimationEnd={() => expire(t.id)} />
                </div>
              </div>
            </div>
          );
        })}
      </section>
    </main>
  );
}
// CSS: copia las reglas de la pestaña HTML + CSS (:root, .stage, h1, .lead, .triggers, .btn, :focus-visible, .stack, .wrap, .inner, .toast, .toast i, .msg, .x, .bar, @keyframes y @media).
