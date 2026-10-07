import { useRef, useState } from 'react';

type Accion = { id: string; titulo: string; detalle: string; mensaje: string; icono: string };

const ACCIONES: Accion[] = [
  { id: 'enlace', titulo: 'Copiar enlace', detalle: 'Cualquiera con el enlace puede ver', mensaje: 'Enlace copiado al portapapeles.',
    icono: 'M8.5 11.5a3.5 3.5 0 0 0 5 0l2.5-2.5a3.5 3.5 0 0 0-5-5l-1 1M11.5 8.5a3.5 3.5 0 0 0-5 0L4 11a3.5 3.5 0 0 0 5 5l1-1' },
  { id: 'correo', titulo: 'Enviar por correo', detalle: 'Invita a personas concretas', mensaje: 'Invitación enviada por correo.',
    icono: 'M3 5h14v10H3zM3 6l7 5 7-5' },
  { id: 'pdf', titulo: 'Exportar a PDF', detalle: 'Descarga una copia estática', mensaje: 'Exportación a PDF iniciada.',
    icono: 'M10 3v10m0 0-3.5-3.5M10 13l3.5-3.5M4 16h12' },
];

export function BottomSheet({ proyecto = 'Proyecto Atlas', acciones = ACCIONES }: { proyecto?: string; acciones?: Accion[] }) {
  const ref = useRef<HTMLDialogElement>(null);
  const [mensaje, setMensaje] = useState('');
  const elegir = (a: Accion) => { setMensaje(a.mensaje); ref.current?.close(); };

  return (
    <>
      <div className="card">
        <h1>{proyecto}</h1>
        <p>Última edición hoy a las 10:42 por Ana Pérez.</p>
        <button className="btn main" type="button" onClick={() => ref.current?.showModal()}>Compartir proyecto</button>
        <p id="msg" role="status">{mensaje}</p>
      </div>
      <dialog ref={ref} aria-labelledby="bs-titulo" onClick={(e) => e.target === ref.current && ref.current.close()}>
        <button className="grab" type="button" aria-label="Cerrar hoja" onClick={() => ref.current?.close()}><i /></button>
        <h2 id="bs-titulo">Compartir {proyecto}</h2>
        <ul>
          {acciones.map((a, i) => (
            <li key={a.id}>
              <button className="act" type="button" autoFocus={i === 0} onClick={() => elegir(a)}>
                <svg viewBox="0 0 20 20" aria-hidden="true"><path d={a.icono} /></svg>
                <span>{a.titulo}<small>{a.detalle}</small></span>
              </button>
            </li>
          ))}
        </ul>
        <div className="foot"><button className="btn" type="button" onClick={() => ref.current?.close()}>Cancelar</button></div>
      </dialog>
    </>
  );
}

// CSS: copia las reglas .card, .btn, dialog, ::backdrop, .grab, .act y .foot de la pestaña HTML + CSS.
