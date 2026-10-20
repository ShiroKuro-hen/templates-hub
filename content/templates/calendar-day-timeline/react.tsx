import { useEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from 'react';

type Cat = 'reunion' | 'personal' | 'viaje';
export type DayEvent = { title: string; start: number; dur: number; cat: Cat; place: string; who: string[] };
export type Day = { date: Date; events: DayEvent[] };
type Placed = DayEvent & { id: number; i: number; n: number };
type FieldErrors = Partial<Record<'title' | 'start' | 'dur', string>>;

const START = 480, END = 1140, NOW = 640;
const SLOT_COUNT = 11;
const fmtDay = new Intl.DateTimeFormat('es', { weekday: 'long', day: 'numeric', month: 'long' });
const pad = (n: number) => String(n).padStart(2, '0');
const hm = (min: number) => `${pad(Math.floor(min / 60))}:${pad(min % 60)}`;
const toMin = (t: string) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('');
const dayLabel = (d: Date) => { const t = fmtDay.format(d); return t[0].toUpperCase() + t.slice(1); };

const INITIAL_DAYS: Day[] = [
  { date: new Date(2026, 9, 20), events: [
    { title: 'Standup de equipo', start: 540, dur: 30, cat: 'reunion', place: 'Sala Ámbar', who: ['Ana Ruiz', 'Luis Gómez', 'Marta Sanz'] },
    { title: 'Revisión de diseño', start: 600, dur: 90, cat: 'reunion', place: 'Sala Cobalto', who: ['Ana Ruiz', 'Irene Pardo'] },
    { title: 'Llamada con proveedor', start: 630, dur: 60, cat: 'reunion', place: 'Videollamada', who: ['Pablo Díaz', 'Luis Gómez'] },
    { title: 'Comida con Lucía', start: 810, dur: 60, cat: 'personal', place: 'Restaurante Olivo', who: ['Lucía Mena'] },
    { title: 'Entrega del informe', start: 960, dur: 60, cat: 'reunion', place: 'Despacho 3B', who: ['Ana Ruiz', 'Carlos Vega'] },
    { title: 'Gimnasio', start: 1020, dur: 60, cat: 'personal', place: 'Club Norte', who: ['Tú'] },
  ] },
  { date: new Date(2026, 9, 21), events: [
    { title: 'Taller de accesibilidad', start: 570, dur: 120, cat: 'reunion', place: 'Sala Norte', who: ['Marta Sanz', 'Irene Pardo', 'Tú'] },
    { title: 'Entrevista UX', start: 660, dur: 60, cat: 'reunion', place: 'Videollamada', who: ['Irene Pardo', 'Carlos Vega'] },
    { title: 'Almuerzo de equipo', start: 840, dur: 60, cat: 'personal', place: 'Cantina Sur', who: ['Ana Ruiz', 'Luis Gómez'] },
    { title: 'Traslado al aeropuerto', start: 1020, dur: 90, cat: 'viaje', place: 'Terminal 1', who: ['Tú'] },
  ] },
  { date: new Date(2026, 9, 22), events: [
    { title: 'Vuelo a Lisboa', start: 480, dur: 150, cat: 'viaje', place: 'Aeropuerto de Barajas', who: ['Tú'] },
    { title: 'Revisión de presupuesto', start: 660, dur: 60, cat: 'reunion', place: 'Sala Cobalto', who: ['Carlos Vega', 'Ana Ruiz'] },
    { title: 'Llamada familiar', start: 780, dur: 30, cat: 'personal', place: 'Videollamada', who: ['Mamá'] },
    { title: 'Reunión con cliente', start: 795, dur: 75, cat: 'reunion', place: 'Oficinas Atlas', who: ['Pablo Díaz', 'Tú'] },
    { title: 'Entrevista de candidatos', start: 990, dur: 45, cat: 'reunion', place: 'Sala Ámbar', who: ['Irene Pardo', 'Marta Sanz'] },
  ] },
];

function layoutDay(events: DayEvent[]): Placed[] {
  const sorted = events.map((ev, id) => ({ ...ev, id, i: 0, n: 1 })).sort((a, b) => a.start - b.start || b.dur - a.dur);
  const out: Placed[] = [];
  let group: Placed[] = [], groupEnd = 0, lanes: number[] = [];
  const flush = () => {
    group.forEach((ev) => { ev.n = lanes.length; });
    out.push(...group);
    group = [];
    lanes = [];
  };
  for (const ev of sorted) {
    if (ev.start >= groupEnd) flush();
    let i = lanes.findIndex((end) => end <= ev.start);
    if (i === -1) i = lanes.push(0) - 1;
    lanes[i] = ev.start + ev.dur;
    ev.i = i;
    groupEnd = Math.max(groupEnd, ev.start + ev.dur);
    group.push(ev);
  }
  flush();
  return out;
}

function checkEvent(title: string, time: string, dur: number): FieldErrors {
  const errors: FieldErrors = {};
  if (!title) errors.title = 'Escribe un título.';
  const at = /^\d{2}:\d{2}$/.test(time) ? toMin(time) : NaN;
  if (!(at >= START && at < END)) errors.start = 'Elige una hora entre 08:00 y 18:59.';
  if (!Number.isInteger(dur) || dur < 15 || dur > 240 || dur % 15) errors.dur = 'Usa de 15 a 240 minutos, en tramos de 15.';
  else if (!errors.start && at + dur > END) errors.dur = 'El evento debe terminar antes de las 19:00.';
  return errors;
}

const vars = (v: Record<string, number | string>) => v as CSSProperties;

export function CalendarDayTimeline() {
  const [days, setDays] = useState<Day[]>(INITIAL_DAYS);
  const [current, setCurrent] = useState(0);
  const [openId, setOpenId] = useState<number | null>(null);
  const [addAt, setAddAt] = useState<number | null>(null);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState('');
  const [nowRequest, setNowRequest] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const nowRef = useRef<HTMLLIElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const day = days[current];
  const placed = useMemo(() => layoutDay(day.events), [day.events]);
  const count = day.events.length;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (addAt !== null && !dialog.open) dialog.showModal();
    if (addAt === null && dialog.open) dialog.close();
  }, [addAt]);

  useEffect(() => {
    if (openId !== null) headingRef.current?.focus();
  }, [openId]);

  useEffect(() => {
    if (!nowRequest) return;
    const scroller = scrollerRef.current, now = nowRef.current;
    if (!scroller || !now) return;
    const top = now.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
    const behavior = matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth';
    scroller.scrollTo({ top: top - scroller.clientHeight / 2, behavior });
  }, [nowRequest]);

  const shift = (n: number) => {
    const next = (current + n + days.length) % days.length;
    setCurrent(next);
    setOpenId(null);
    setStatus(`Mostrando ${dayLabel(days[next].date).toLowerCase()}.`);
  };

  const showNow = () => {
    setCurrent(0);
    setNowRequest((n) => n + 1);
    setStatus('Ahora son las 10:40.');
  };

  const openDetail = (id: number, opener: HTMLButtonElement) => {
    openerRef.current = opener;
    setOpenId(id);
  };

  const closeDetail = () => {
    setOpenId(null);
    openerRef.current?.focus();
  };

  const openAdd = (min = 720) => {
    setErrors({});
    setAddAt(min);
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const title = String(data.get('title') ?? '').trim();
    const time = String(data.get('start') ?? '');
    const dur = Number(data.get('dur'));
    const found = checkEvent(title, time, dur);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) (e.currentTarget.elements.namedItem(first) as HTMLElement | null)?.focus();
    if (Object.keys(found).length) return;
    const at = toMin(time);
    setDays((ds) => ds.map((d, k) => (k === current ? { ...d, events: [...d.events, { title, start: at, dur, cat: 'personal', place: 'Por definir', who: ['Tú'] }] } : d)));
    setOpenId(null);
    setAddAt(null);
    setStatus(`Evento "${title}" añadido a las ${hm(at)}.`);
  };

  const detailEvent = openId !== null ? day.events[openId] : null;

  return (
    <>
      <section className="cal" aria-labelledby="title">
        <header className="top">
          <div>
            <h2 id="title">{dayLabel(day.date)}</h2>
            <p className="sub">{`${current === 0 ? 'Hoy · ' : ''}${count} ${count === 1 ? 'evento' : 'eventos'}`}</p>
          </div>
          <div className="tools">
            <button type="button" className="btn" aria-label="Día anterior" onClick={() => shift(-1)}>‹</button>
            <button type="button" className="btn" aria-label="Día siguiente" onClick={() => shift(1)}>›</button>
            <button type="button" className="btn ahora" onClick={showNow}>Ahora</button>
            <button type="button" className="btn main" onClick={() => openAdd()}>Añadir evento</button>
          </div>
        </header>
        <div className="scroller" ref={scrollerRef} tabIndex={0} role="region" aria-label="Agenda del día, desplazable">
          <div className="body">
            <ol className="hours" aria-hidden="true">
              {Array.from({ length: 12 }, (_, k) => (
                <li key={k} style={vars({ '--s': k })}>{hm(START + k * 60)}</li>
              ))}
            </ol>
            <ol className="day" aria-label="Eventos del día">
              {Array.from({ length: SLOT_COUNT }, (_, k) => (
                <li key={k} className="slot" style={vars({ '--s': k })}>
                  <button type="button" aria-label={`Añadir evento a las ${hm(START + k * 60)}`} onClick={() => openAdd(START + k * 60)} />
                </li>
              ))}
              {placed.map((ev) => (
                <li key={ev.id} className={`ev ${ev.cat}${ev.dur < 60 ? ' sh' : ''}`} style={vars({ '--s': (ev.start - START) / 60, '--d': ev.dur / 60, '--i': ev.i, '--n': ev.n })}>
                  <button type="button" onClick={(e) => openDetail(ev.id, e.currentTarget)}>
                    <b>{ev.title}</b>
                    <time>{`${hm(ev.start)} – ${hm(ev.start + ev.dur)}`}</time>
                  </button>
                </li>
              ))}
              {current === 0 && <li ref={nowRef} className="now" style={vars({ '--s': (NOW - START) / 60 })} aria-hidden="true" />}
            </ol>
          </div>
        </div>
        {detailEvent && (
          <section className="detail" aria-label="Detalle del evento" onKeyDown={(e) => { if (e.key === 'Escape') closeDetail(); }}>
            <h3 ref={headingRef} tabIndex={-1}>{detailEvent.title}</h3>
            <p>{`${dayLabel(day.date)} · ${hm(detailEvent.start)} – ${hm(detailEvent.start + detailEvent.dur)}`}</p>
            <dl>
              <dt>Lugar</dt>
              <dd>{detailEvent.place}</dd>
              <dt>Asistentes</dt>
              <dd>
                <ul className="people">
                  {detailEvent.who.map((w) => (
                    <li key={w}><span className="av" aria-hidden="true">{initials(w)}</span>{w}</li>
                  ))}
                </ul>
              </dd>
            </dl>
            <button type="button" className="btn" onClick={closeDetail}>Cerrar detalle</button>
          </section>
        )}
        <p className="status" role="status">{status}</p>
      </section>
      <dialog ref={dialogRef} aria-labelledby="dlg-title" onClose={() => setAddAt(null)}>
        {addAt !== null && (
          <form key={addAt} noValidate onSubmit={onSubmit}>
            <h3 id="dlg-title">Nuevo evento</h3>
            <label>Título <input name="title" maxLength={60} aria-describedby="e-title" aria-invalid={!!errors.title} /></label>
            <p className="err" id="e-title">{errors.title}</p>
            <label>Inicio <input name="start" type="time" step={900} defaultValue={hm(addAt)} aria-describedby="e-start" aria-invalid={!!errors.start} /></label>
            <p className="err" id="e-start">{errors.start}</p>
            <label>Duración (minutos) <input name="dur" type="number" min={15} max={240} step={15} defaultValue={60} aria-describedby="e-dur" aria-invalid={!!errors.dur} /></label>
            <p className="err" id="e-dur">{errors.dur}</p>
            <div className="acts">
              <button type="button" className="btn" onClick={() => setAddAt(null)}>Cancelar</button>
              <button type="submit" className="btn main">Añadir</button>
            </div>
          </form>
        )}
      </dialog>
    </>
  );
}
// CSS: copia las reglas de la pestaña HTML + CSS (.cal, .top, .hours, .day, .slot, .ev, .now, .detail, dialog y @media 480px).
