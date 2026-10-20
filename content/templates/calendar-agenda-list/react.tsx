import { useMemo, useState } from 'react';

type Cat = 'reunion' | 'personal' | 'viaje';
export type AgendaEvent = { id: string; day: number; start: number; dur: number; cat: Cat; title: string; place: string; who: string[] };
export type AgendaDay = { date: Date; rel: string };
type Filter = 'all' | Cat;

const pad = (n: number) => String(n).padStart(2, '0');
const hm = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');
const fmtDate = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' });
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);
const CATS: Record<Cat, string> = { reunion: 'Reunión', personal: 'Personal', viaje: 'Viaje' };
const FILTERS: [Filter, string][] = [['all', 'Todos'], ['reunion', 'Reuniones'], ['personal', 'Personal'], ['viaje', 'Viajes']];

const DAYS: AgendaDay[] = [
  { date: new Date(2026, 9, 20), rel: 'Hoy' },
  { date: new Date(2026, 9, 21), rel: 'Mañana' },
  { date: new Date(2026, 9, 22), rel: '' },
  { date: new Date(2026, 9, 23), rel: '' },
];
const EVENTS: AgendaEvent[] = [
  { id: 'standup', day: 0, start: 540, dur: 30, cat: 'reunion', title: 'Standup de equipo', place: 'Sala Ámbar', who: ['Ana Ruiz', 'Luis Gómez'] },
  { id: 'diseno', day: 0, start: 600, dur: 90, cat: 'reunion', title: 'Revisión de diseño', place: 'Sala Cobalto', who: ['Ana Ruiz', 'Irene Pardo'] },
  { id: 'lucia', day: 0, start: 810, dur: 60, cat: 'personal', title: 'Comida con Lucía', place: 'Restaurante Olivo', who: ['Lucía Mena'] },
  { id: 'taller', day: 1, start: 570, dur: 120, cat: 'reunion', title: 'Taller de accesibilidad', place: 'Sala Norte', who: ['Marta Sanz', 'Irene Pardo'] },
  { id: 'traslado', day: 1, start: 1020, dur: 90, cat: 'viaje', title: 'Traslado al aeropuerto', place: 'Terminal 1', who: ['Tú'] },
  { id: 'vuelo', day: 2, start: 480, dur: 150, cat: 'viaje', title: 'Vuelo a Lisboa', place: 'Aeropuerto de Barajas', who: ['Tú'] },
  { id: 'presupuesto', day: 2, start: 660, dur: 60, cat: 'reunion', title: 'Revisión de presupuesto', place: 'Sala Cobalto', who: ['Carlos Vega', 'Ana Ruiz'] },
  { id: 'familia', day: 3, start: 780, dur: 30, cat: 'personal', title: 'Llamada familiar', place: 'Videollamada', who: ['Mamá'] },
  { id: 'candidatos', day: 3, start: 990, dur: 45, cat: 'reunion', title: 'Entrevista de candidatos', place: 'Sala Ámbar', who: ['Irene Pardo', 'Marta Sanz'] },
];

const ymd = (d: Date) => `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}`;
const icsText = (s: string) => s.replace(/[\\;,]/g, (c) => `\\${c}`).replace(/\n/g, '\\n');
const fold = (line: string) => line.replace(/.{73}(?=.)/g, '$&\r\n ');

export function icsFor(ev: AgendaEvent, date: Date): string {
  const stamp = (min: number) => `${ymd(date)}T${hm(min).replace(':', '')}00`;
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//templates-hub//Agenda//ES', 'BEGIN:VEVENT',
    `UID:${ev.id}@templates-hub`, 'DTSTAMP:20261020T080000Z',
    `DTSTART:${stamp(ev.start)}`, `DTEND:${stamp(ev.start + ev.dur)}`,
    `SUMMARY:${icsText(ev.title)}`, `LOCATION:${icsText(ev.place)}`,
    `DESCRIPTION:${icsText(`Asistentes: ${ev.who.join(', ')}`)}`,
    'END:VEVENT', 'END:VCALENDAR',
  ];
  return lines.map(fold).join('\r\n') + '\r\n';
}

const canDownload = () => typeof URL.createObjectURL === 'function' && location.origin !== 'null';

function download(name: string, text: string) {
  const url = URL.createObjectURL(new Blob([text], { type: 'text/calendar;charset=utf-8' }));
  const link = Object.assign(document.createElement('a'), { href: url, download: name });
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function AgendaList() {
  const [filter, setFilter] = useState<Filter>('all');
  const [icsShown, setIcsShown] = useState<Record<string, string>>({});
  const [status, setStatus] = useState('');

  const visible = useMemo(() => EVENTS.filter((ev) => filter === 'all' || ev.cat === filter), [filter]);
  const groups = DAYS.map((day, k) => ({
    day,
    k,
    items: visible.filter((ev) => ev.day === k).sort((a, b) => a.start - b.start),
  })).filter((g) => g.items.length > 0);

  const addToCalendar = (ev: AgendaEvent) => {
    const text = icsFor(ev, DAYS[ev.day].date), name = `${ev.id}.ics`;
    if (canDownload()) {
      try {
        download(name, text);
        setIcsShown((s) => { const next = { ...s }; delete next[ev.id]; return next; });
        setStatus(`Descarga iniciada: ${name}.`);
        return;
      } catch {}
    }
    setIcsShown((s) => ({ ...s, [ev.id]: text }));
    setStatus('La descarga no está disponible en esta vista: abajo tienes el texto del .ics.');
  };

  const count = visible.length;

  return (
    <section className="agenda" aria-labelledby="title">
      <header className="head">
        <div>
          <h2 id="title">Próximos días</h2>
          <p className="sub">{`${count} ${count === 1 ? 'evento' : 'eventos'}`}</p>
        </div>
        <div className="chips" role="group" aria-label="Filtrar por categoría">
          {FILTERS.map(([value, label]) => (
            <button key={value} type="button" className="chip" aria-pressed={filter === value} onClick={() => { setFilter(value); setStatus(`Mostrando ${label.toLowerCase()}.`); }}>
              {label}
            </button>
          ))}
        </div>
      </header>
      <div className="list" tabIndex={0} role="region" aria-label="Eventos por día, desplazable">
        {groups.map(({ day, k, items }) => (
          <section key={k} className="group" aria-labelledby={`g${k}`}>
            <h3 className="gh" id={`g${k}`}>
              {day.rel ? <>{day.rel} <span className="date">{cap(fmtDate.format(day.date))}</span></> : cap(fmtDate.format(day.date))}
            </h3>
            <ol className="items">
              {items.map((ev) => (
                <li key={ev.id} className="item" data-cat={ev.cat}>
                  <time className="when">{`${hm(ev.start)} – ${hm(ev.start + ev.dur)}`}</time>
                  <div className="info">
                    <b>{ev.title}</b>
                    <p className="meta"><span className={`dot ${ev.cat}`} aria-hidden="true" />{`${CATS[ev.cat]} · ${ev.place}`}</p>
                    <ul className="avs" aria-label={`Asistentes: ${ev.who.join(', ')}`}>
                      {ev.who.map((w) => <li key={w} aria-hidden="true">{initials(w)}</li>)}
                    </ul>
                  </div>
                  <button type="button" className="add" onClick={() => addToCalendar(ev)}>Añadir al calendario</button>
                  {icsShown[ev.id] && (
                    <details className="ics" open>
                      <summary>Ver texto .ics</summary>
                      <pre>{icsShown[ev.id]}</pre>
                    </details>
                  )}
                </li>
              ))}
            </ol>
          </section>
        ))}
      </div>
      {count === 0 && <p className="empty">No hay eventos de esta categoría en los próximos días.</p>}
      <p className="status" role="status">{status}</p>
    </section>
  );
}
// CSS: copia las reglas de la pestaña HTML + CSS (.agenda, .head, .chip, .gh, .item, .when, .info, .meta, .dot, .avs, .add, .ics, .empty, .status y categorías).
