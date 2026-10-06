import { useEffect, useRef, useState, type KeyboardEvent } from 'react';

const fmtM = new Intl.DateTimeFormat('es', { month: 'long', year: 'numeric' });
const fmtL = new Intl.DateTimeFormat('es', { dateStyle: 'full' });
const DAYS = [['L', 'lunes'], ['M', 'martes'], ['X', 'miércoles'], ['J', 'jueves'], ['V', 'viernes'], ['S', 'sábado'], ['D', 'domingo']];
const same = (a: Date | null, b: Date | null) => !!a && !!b && a.toDateString() === b.toDateString();

function weeks(y: number, m: number): (Date | null)[][] {
  const offset = (new Date(y, m, 1).getDay() + 6) % 7, total = new Date(y, m + 1, 0).getDate();
  const cells = Array.from({ length: Math.ceil((offset + total) / 7) * 7 }, (_, i) => {
    const d = i - offset + 1;
    return d >= 1 && d <= total ? new Date(y, m, d) : null;
  });
  return Array.from({ length: cells.length / 7 }, (_, w) => cells.slice(w * 7, w * 7 + 7));
}

export function CalendarMonth({ onSelect }: { onSelect?: (d: Date) => void }) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const [cursor, setCursor] = useState(today);
  const [sel, setSel] = useState<Date | null>(null);
  const [focusDay, setFocusDay] = useState(false);
  const body = useRef<HTMLTableSectionElement>(null);
  const y = cursor.getFullYear(), m = cursor.getMonth(), title = fmtM.format(cursor);

  useEffect(() => {
    if (focusDay) body.current?.querySelector<HTMLButtonElement>('[tabindex="0"]')?.focus();
  }, [cursor, focusDay]);

  const go = (d: Date, focus: boolean) => { setCursor(d); setFocusDay(focus); };
  const pick = (d: Date) => { setSel(d); go(d, true); onSelect?.(d); };

  function onKeyDown(e: KeyboardEvent) {
    const d = cursor.getDate(), dow = (cursor.getDay() + 6) % 7;
    const delta = ({ ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7, Home: -dow, End: 6 - dow } as Record<string, number>)[e.key];
    if (delta !== undefined) go(new Date(y, m, d + delta), true);
    else if (e.key === 'PageUp' || e.key === 'PageDown') {
      const nm = m + (e.key === 'PageUp' ? -1 : 1);
      go(new Date(y, nm, Math.min(d, new Date(y, nm + 1, 0).getDate())), true);
    } else return;
    e.preventDefault();
  }

  return (
    <section className="cal" aria-labelledby="cal-title">
      <header>
        <h2 id="cal-title" aria-live="polite">{title[0].toUpperCase() + title.slice(1)}</h2>
        <div className="nav">
          <button type="button" aria-label="Mes anterior" onClick={() => go(new Date(y, m - 1, 1), false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m15 6-6 6 6 6" /></svg>
          </button>
          <button type="button" aria-label="Mes siguiente" onClick={() => go(new Date(y, m + 1, 1), false)}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><path d="m9 6 6 6-6 6" /></svg>
          </button>
        </div>
      </header>
      <table aria-labelledby="cal-title">
        <thead><tr>{DAYS.map(([s, l]) => <th key={l} scope="col" abbr={l}>{s}</th>)}</tr></thead>
        <tbody ref={body} onKeyDown={onKeyDown}>
          {weeks(y, m).map((w, i) => (
            <tr key={i}>
              {w.map((d, j) => (
                <td key={j}>
                  {d && (
                    <button type="button" tabIndex={same(d, cursor) ? 0 : -1} aria-label={fmtL.format(d)}
                            aria-current={same(d, today) ? 'date' : undefined} aria-pressed={same(d, sel)} onClick={() => pick(d)}>
                      {d.getDate()}
                    </button>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <footer>
        <p className="out" role="status">{sel ? `Fecha seleccionada: ${fmtL.format(sel)}.` : 'Selecciona una fecha para continuar.'}</p>
        <button type="button" className="today" onClick={() => go(today, true)}>Hoy</button>
      </footer>
    </section>
  );
}

// CSS: copia las reglas .cal, h2, .nav, button, table, th, td, .out y .today de la pestaña HTML + CSS.
