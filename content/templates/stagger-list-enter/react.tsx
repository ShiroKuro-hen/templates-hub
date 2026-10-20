import { CSSProperties, useRef, useState } from 'react';

const PENDIENTES = [
  { title: 'Revisar el presupuesto', detail: 'Vence hoy a las 18:00' },
  { title: 'Responder a Ana Pérez', detail: 'Pidió confirmar la reunión' },
  { title: 'Subir el informe mensual', detail: 'Pendiente de aprobación' },
  { title: 'Actualizar la política de accesos', detail: 'Asignada por Luis Gómez' },
];
const NUEVAS = [
  { title: 'Llamar al proveedor', detail: 'Confirmar la entrega del lunes' },
  { title: 'Firmar el contrato', detail: 'Enviado por Marta Ruiz' },
  { title: 'Revisar comentarios', detail: '3 nuevos en el documento' },
  { title: 'Preparar la demo', detail: 'Jueves a las 10:00' },
];

type Task = { id: number; title: string; detail: string; leaving: boolean };

const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const delay = (i: number) => ({ '--i': i }) as CSSProperties;

export function StaggerListEnter() {
  const [tasks, setTasks] = useState<Task[]>(() => PENDIENTES.map((t, id) => ({ ...t, id, leaving: false })));
  const seq = useRef(PENDIENTES.length);
  const addBtn = useRef<HTMLButtonElement>(null);

  function add() {
    const id = seq.current++;
    const next = NUEVAS[id % NUEVAS.length];
    setTasks((prev) => [{ ...next, id, leaving: false }, ...prev]);
  }

  function drop(id: number) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  }

  function remove(id: number) {
    addBtn.current?.focus();
    if (calm) return drop(id);
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)));
  }

  return (
    <div className="app">
      <div className="toolbar">
        <h2>Tareas pendientes</h2>
        <button ref={addBtn} className="btn" type="button" onClick={add}>Agregar</button>
      </div>
      <ul className="list">
        {tasks.map((t, i) => (
          <li key={t.id} className={`item${t.leaving ? ' leaving' : ''}`} style={delay(i)}>
            <div className="wrap" onTransitionEnd={() => t.leaving && drop(t.id)}>
              <div className="inner">
                <div className="row">
                  <span className="dot" aria-hidden="true" />
                  <div className="txt"><b>{t.title}</b><span>{t.detail}</span></div>
                  <button className="rm" type="button" aria-label={`Quitar: ${t.title}`} onClick={() => remove(t.id)}>×</button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
// CSS: copia las reglas .app, .toolbar, h2, .btn, .list, .item (con animación y --i), .wrap, .leaving, .inner, .row, .dot, .txt, .rm, @keyframes enter y prefers-reduced-motion de la pestaña HTML + CSS.
