import { useState } from 'react';

type EventInfo = { titulo: string; inicio: string; horario: string; lugar: string; plazas: number };
const DEMO: EventInfo = { titulo: 'Meetup de arquitectura frontend', inicio: '2026-11-14T18:30', horario: 'Sábado, 18:30 a 21:00', lugar: 'Impact Hub, Madrid', plazas: 12 };
const mes = new Intl.DateTimeFormat('es-ES', { month: 'short' });

export function EventCard({ e = DEMO, onToggle }: { e?: EventInfo; onToggle?: (reservado: boolean) => void }) {
  const [on, setOn] = useState(false);
  const d = new Date(e.inicio);
  const toggle = () => { setOn(!on); onToggle?.(!on); };

  return (
    <article className="event" aria-labelledby="ev-title">
      <time className="date" dateTime={e.inicio}><b>{d.getDate()}</b><span>{mes.format(d).replace('.', '')}</span></time>
      <div>
        <h3 id="ev-title">{e.titulo}</h3>
        <ul className="info">
          <li>
            <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.4" /><path d="M8 4.5V8l2.5 1.5" fill="none" stroke="currentColor" strokeWidth="1.4" /></svg>
            {e.horario}
          </li>
          <li>
            <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s-4.8-4.4-4.8-8a4.8 4.8 0 0 1 9.6 0c0 3.6-4.8 8-4.8 8z" fill="none" stroke="currentColor" strokeWidth="1.4" /><circle cx="8" cy="6.5" r="1.7" fill="currentColor" /></svg>
            {e.lugar}
          </li>
        </ul>
        <div className="foot">
          <span className="seats">{e.plazas - (on ? 1 : 0)} plazas libres</span>
          <button type="button" className="btn" aria-pressed={on} onClick={toggle}>Reservar plaza</button>
        </div>
        <p className="sr" role="status">{on ? 'Plaza reservada. Te enviamos la confirmación por correo.' : ''}</p>
      </div>
    </article>
  );
}

// CSS: copia las reglas .event, .date, h3, .info, .foot, .seats, .btn y .sr de la pestaña HTML + CSS.
