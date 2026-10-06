import { useEffect, useRef, useState } from 'react';

type Mail = { id: number; from: string; time: string; subject: string; preview: string; unread: boolean };
const DATA: Mail[] = [
  { id: 1, from: 'Lucía Ortega', time: '09:41', subject: 'Informe de incidencias de septiembre', preview: 'Adjunto el resumen con los tiempos de respuesta.', unread: true },
  { id: 2, from: 'Soporte Nimbus', time: '08:15', subject: 'Tu ticket 4821 está resuelto', preview: 'Confirma si el problema de acceso continúa.', unread: true },
  { id: 3, from: 'Gonzalo Paredes', time: 'Ayer', subject: 'Agenda del comité del jueves', preview: 'Faltan dos puntos por confirmar.', unread: false },
  { id: 4, from: 'Facturación', time: 'Ayer', subject: 'Factura de septiembre disponible', preview: 'Descárgala desde el portal de cuenta.', unread: false },
  { id: 5, from: 'Rocío Aguirre', time: '3 oct', subject: 'Re: Revisión del contrato marco', preview: 'Acepto los cambios de la cláusula 7.', unread: true },
];

export function InboxList() {
  const [mails, setMails] = useState<Mail[]>(DATA);
  const [sel, setSel] = useState<number[]>([]);
  const all = useRef<HTMLInputElement>(null);
  const n = mails.length, s = sel.length, unread = mails.filter((m) => m.unread).length;

  useEffect(() => { if (all.current) all.current.indeterminate = s > 0 && s < n; }, [s, n]);

  const toggle = (id: number) => setSel(sel.includes(id) ? sel.filter((x) => x !== id) : [...sel, id]);
  const mark = (u: boolean) => { setMails(mails.map((m) => (sel.includes(m.id) ? { ...m, unread: u } : m))); setSel([]); };
  const archive = () => { setMails(mails.filter((m) => !sel.includes(m.id))); setSel([]); };
  const open = (id: number) => setMails(mails.map((m) => (m.id === id ? { ...m, unread: false } : m)));

  return (
    <section className="box" aria-labelledby="h">
      <div className="bar"><h2 id="h">Bandeja de entrada</h2><span className="badge">{unread} sin leer</span></div>
      <div className="tools" role="toolbar" aria-label="Acciones de la selección">
        <label>
          <input ref={all} type="checkbox" checked={n > 0 && s === n} disabled={!n}
            onChange={(e) => setSel(e.target.checked ? mails.map((m) => m.id) : [])} />
          <span>{s ? `${s} ${s === 1 ? 'seleccionado' : 'seleccionados'}` : 'Seleccionar todo'}</span>
        </label>
        <button type="button" disabled={!s} onClick={() => mark(false)}>Marcar como leído</button>
        <button type="button" disabled={!s} onClick={() => mark(true)}>Marcar como no leído</button>
        <button type="button" disabled={!s} onClick={archive}>Archivar</button>
      </div>
      <ul>
        {mails.map((m) => (
          <li key={m.id} className="row" data-unread={m.unread || undefined}>
            <input type="checkbox" aria-label={`Seleccionar mensaje de ${m.from}`} checked={sel.includes(m.id)} onChange={() => toggle(m.id)} />
            <button className="open" type="button" onClick={() => open(m.id)}>
              <span className="who">{m.unread && <span className="sr">No leído. </span>}{m.from}</span>
              <time>{m.time}</time>
              <span className="sub"><b>{m.subject}</b> - {m.preview}</span>
            </button>
          </li>
        ))}
      </ul>
      {!n && <p className="empty"><b>No quedan mensajes por revisar</b>Los mensajes nuevos aparecerán aquí.</p>}
    </section>
  );
}

// CSS: copia las reglas .box, .bar, .tools, .row, .open, .who, .sub y .empty de la pestaña HTML + CSS.
