import type { CSSProperties } from 'react';

type Kind = 'accent' | 'info' | 'ok' | 'warn';
type Ev = { title: string; s: number; d: number; kind: Kind }; // s: horas desde las 8:00, d: duración en horas
type Day = { name: string; n: number; events: Ev[] };

const daily: Ev = { title: 'Daily', s: 1, d: 0.5, kind: 'accent' };
const DAYS: Day[] = [
  { name: 'Lunes', n: 5, events: [
    { title: 'Planificación', s: 1, d: 1, kind: 'accent' },
    { title: 'Revisión de diseño', s: 3, d: 1.5, kind: 'info' },
    { title: 'Demo Norte Digital', s: 7, d: 1, kind: 'ok' } ] },
  { name: 'Martes', n: 6, events: [daily,
    { title: 'Entrevista UX', s: 2.5, d: 1, kind: 'warn' },
    { title: 'Sprint review', s: 6, d: 1.5, kind: 'info' } ] },
  { name: 'Miércoles', n: 7, events: [daily,
    { title: 'Taller de accesibilidad', s: 2, d: 2, kind: 'ok' },
    { title: '1:1 con Marta', s: 8, d: 0.5, kind: 'accent' } ] },
  { name: 'Jueves', n: 8, events: [daily,
    { title: 'Auditoría de seguridad', s: 3, d: 2, kind: 'warn' },
    { title: 'Retrospectiva', s: 7.5, d: 1, kind: 'info' } ] },
  { name: 'Viernes', n: 9, events: [daily,
    { title: 'Lanzamiento v2.5', s: 4, d: 1, kind: 'ok' },
    { title: 'Cierre de semana', s: 9, d: 0.5, kind: 'accent' } ] },
];

const TODAY = 6;
const NOW = 4.33; // 12:20
const hm = (x: number) => `${Math.floor(8 + x)}:${x % 1 ? '30' : '00'}`;
const v = (o: Record<string, number>) => o as unknown as CSSProperties;

export function ScheduleWeekView({ days = DAYS }: { days?: Day[] }) {
  return (
    <section className="cal" aria-labelledby="sw-t">
      <div className="top"><h2 id="sw-t">Semana del 5 al 9 de octubre</h2><p>Agenda del equipo de producto.</p></div>
      <div className="scroll"><div className="wk">
        <div className="hd">
          <span />
          {days.map((d) => (
            <div key={d.n} className={d.n === TODAY ? 'dh today' : 'dh'} aria-current={d.n === TODAY ? 'date' : undefined}>
              {d.name.slice(0, 3)} <b>{d.n}</b>
            </div>
          ))}
        </div>
        <div className="bd">
          <div className="hrs" aria-hidden="true">{Array.from({ length: 10 }, (_, i) => <span key={i}>{8 + i}:00</span>)}</div>
          {days.map((d) => (
            <ol key={d.n} className="day" aria-label={`${d.name} ${d.n} de octubre`}>
              {d.events.map((e) => (
                <li key={e.title} className={`ev ${e.kind}${e.d < 1 ? ' sh' : ''}`} style={v({ '--s': e.s, '--d': e.d })}>
                  <b>{e.title}</b><time>{hm(e.s)} – {hm(e.s + e.d)}</time>
                </li>
              ))}
              {d.n === TODAY && <li className="now" style={v({ '--s': NOW })} aria-hidden="true" />}
            </ol>
          ))}
        </div>
      </div></div>
    </section>
  );
}
// CSS: copia las reglas .cal / .top / .scroll / .wk / .hd / .bd / .dh / .hrs / .day / .ev / .accent / .info / .ok / .warn / .now de la pestaña HTML + CSS.
