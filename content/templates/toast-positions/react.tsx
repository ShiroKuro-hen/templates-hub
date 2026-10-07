import { useRef, useState } from 'react';

type Posicion = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';
type Tipo = 'ok' | 'info' | 'warn' | 'err';
type Aviso = { id: number; tipo: Tipo; icono: string; titulo: string; texto: string };

const POSICIONES: [Posicion, string][] = [
  ['top-left', 'Arriba izquierda'], ['top-center', 'Arriba centro'], ['top-right', 'Arriba derecha'],
  ['bottom-left', 'Abajo izquierda'], ['bottom-center', 'Abajo centro'], ['bottom-right', 'Abajo derecha'],
];
const MENSAJES: Omit<Aviso, 'id'>[] = [
  { tipo: 'ok', icono: '✓', titulo: 'Cambios guardados', texto: 'Se actualizó el proyecto Atlas.' },
  { tipo: 'info', icono: 'i', titulo: 'Nueva versión disponible', texto: 'Recarga la página para ver las mejoras.' },
  { tipo: 'warn', icono: '!', titulo: 'Almacenamiento al 90 %', texto: 'Libera espacio o amplía tu plan.' },
  { tipo: 'err', icono: '×', titulo: 'No se pudo sincronizar', texto: 'Revisa tu conexión y vuelve a intentarlo.' },
];

export function ToastPositions({ duracion = 5000 }: { duracion?: number }) {
  const [pos, setPos] = useState<Posicion>('bottom-right');
  const [avisos, setAvisos] = useState<Aviso[]>([]);
  const n = useRef(0);

  const cerrar = (id: number) => setAvisos((a) => a.filter((x) => x.id !== id));
  const mostrar = () => {
    const id = ++n.current;
    setAvisos((a) => [...a, { id, ...MENSAJES[id % MENSAJES.length] }]);
    setTimeout(() => cerrar(id), duracion);
  };

  return (
    <section className="card" aria-labelledby="tp-titulo">
      <div className="bar">
        <fieldset>
          <legend id="tp-titulo">Posición de los avisos</legend>
          {POSICIONES.map(([v, label]) => (
            <label key={v}>
              <input type="radio" name="pos" value={v} checked={pos === v} onChange={() => { setPos(v); mostrar(); }} />
              {label}
            </label>
          ))}
        </fieldset>
        <button className="go" type="button" onClick={mostrar}>Mostrar aviso</button>
      </div>
      <div className="stage">
        <p>Vista previa de la pantalla</p>
        <div className="toasts" data-pos={pos} role="region" aria-label="Notificaciones" aria-live="polite">
          {avisos.map((a) => (
            <div key={a.id} className={`toast ${a.tipo}`}>
              <span className="ic" aria-hidden="true">{a.icono}</span>
              <div><b>{a.titulo}</b><span className="m">{a.texto}</span></div>
              <button className="x" type="button" aria-label="Cerrar aviso" onClick={() => cerrar(a.id)}>×</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CSS: copia las reglas .card, .bar, fieldset, .stage, .toasts, [data-pos], .toast, .ic y .x de la pestaña HTML + CSS.
