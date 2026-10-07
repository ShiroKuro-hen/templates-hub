import { useState } from 'react';

const CANALES = ['Correo', 'Push', 'SMS'] as const;
type Canal = (typeof CANALES)[number];
type Evento = { id: string; nombre: string; detalle: string; bloqueado?: Canal };

const EVENTOS: Evento[] = [
  { id: 'menciones', nombre: 'Menciones', detalle: 'Cuando alguien te menciona con @.' },
  { id: 'comentarios', nombre: 'Comentarios', detalle: 'Respuestas en los hilos que sigues.' },
  { id: 'asignaciones', nombre: 'Asignaciones', detalle: 'Tareas que te asignan o reasignan.' },
  { id: 'resumen', nombre: 'Resumen semanal', detalle: 'Cada lunes a las 9:00.' },
  { id: 'seguridad', nombre: 'Alertas de seguridad', detalle: 'Inicios de sesión y cambios de contraseña.', bloqueado: 'Correo' },
];
const INICIAL: Record<string, Canal[]> = {
  menciones: ['Correo', 'Push'], comentarios: ['Correo', 'Push'], asignaciones: ['Correo'],
  resumen: ['Correo'], seguridad: ['Correo', 'Push'],
};

export function PreferenciasNotificacion({ eventos = EVENTOS }: { eventos?: Evento[] }) {
  const [on, setOn] = useState<Record<string, Canal[]>>(INICIAL);
  const activa = (e: Evento, c: Canal) => on[e.id].includes(c);
  const total = Object.values(on).reduce((n, l) => n + l.length, 0);

  const alternar = (e: Evento, c: Canal, v: boolean) =>
    setOn({ ...on, [e.id]: v ? [...on[e.id], c] : on[e.id].filter((x) => x !== c) });
  const alternarColumna = (c: Canal, v: boolean) =>
    setOn(Object.fromEntries(eventos.map((e) => {
      const sin = on[e.id].filter((x) => x !== c);
      return [e.id, v || e.bloqueado === c ? [...sin, c] : sin];
    })));

  return (
    <section className="card" aria-labelledby="np-titulo">
      <header>
        <h2 id="np-titulo">Preferencias de notificación</h2>
        <p className="sum" aria-live="polite"><b>{total}</b> de {eventos.length * CANALES.length} activadas</p>
      </header>
      <div className="scroll">
        <table>
          <caption hidden>Elige por qué canal recibes cada tipo de aviso.</caption>
          <thead>
            <tr>
              <th scope="col">Evento</th>
              {CANALES.map((c) => {
                const libres = eventos.filter((e) => e.bloqueado !== c);
                const k = libres.filter((e) => activa(e, c)).length;
                return (
                  <th scope="col" key={c}>
                    <label>
                      {c}
                      <input type="checkbox" aria-label={`Activar todo por ${c}`} checked={k === libres.length}
                             ref={(el) => { if (el) el.indeterminate = k > 0 && k < libres.length; }}
                             onChange={(ev) => alternarColumna(c, ev.target.checked)} />
                    </label>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {eventos.map((e) => (
              <tr key={e.id}>
                <th scope="row">{e.nombre}<span>{e.detalle}</span></th>
                {CANALES.map((c) => (
                  <td key={c}>
                    <input type="checkbox" checked={activa(e, c)} disabled={e.bloqueado === c}
                           aria-label={`${e.nombre} por ${c}${e.bloqueado === c ? ' (obligatorio)' : ''}`}
                           onChange={(ev) => alternar(e, c, ev.target.checked)} />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="note">Los cambios se guardan solos. Las alertas de seguridad por correo son obligatorias.</p>
    </section>
  );
}

// CSS: copia las reglas .card, header, .scroll, table, th, td, input y .note de la pestaña HTML + CSS.
