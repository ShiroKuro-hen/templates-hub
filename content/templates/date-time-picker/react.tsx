import { useState } from 'react';

const iso = (x: Date) => x.toLocaleDateString('sv');
const T = (x: Date) => x.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });

function siguienteLaboral() {
  const hoy = new Date();
  const s = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + 1);
  while ([0, 6].includes(s.getDay())) s.setDate(s.getDate() + 1);
  return iso(s);
}

export function DateTimePicker() {
  const [d, setD] = useState(siguienteLaboral);
  const [h, setH] = useState('10:00');
  const [u, setU] = useState('45');
  const hoy = iso(new Date());

  const [y, m, dd] = d.split('-').map(Number);
  const [hh, mm] = h.split(':').map(Number);
  const a = new Date(y, m - 1, dd, hh, mm);
  const b = new Date(+a + Number(u) * 60000);
  const fechaMal = !d || d < hoy || [0, 6].includes(a.getDay());
  const horaMal = !h || h < '09:00' || h > '18:00';
  const msg = !d || !h ? 'Elige una fecha y una hora para ver el resumen.'
    : d < hoy ? 'Esa fecha ya pasó. Elige hoy o un día posterior.'
    : fechaMal ? 'No hay demostraciones en fin de semana. Elige un día de lunes a viernes.'
    : horaMal ? 'Elige una hora entre 09:00 y 18:00.' : '';

  return (
    <main className="card">
      <h1>Agendar una demostración</h1>
      <p className="sub">Elige un día laboral y una hora entre 09:00 y 18:00.</p>
      <div className="grid">
        <div className="f"><label htmlFor="d">Fecha</label>
          <input id="d" type="date" min={hoy} required value={d} aria-invalid={fechaMal} aria-describedby="e" onChange={(e) => setD(e.target.value)} /></div>
        <div className="f"><label htmlFor="h">Hora de inicio</label>
          <input id="h" type="time" min="09:00" max="18:00" step={900} required value={h} aria-invalid={horaMal} aria-describedby="e" onChange={(e) => setH(e.target.value)} /></div>
        <div className="f full"><label htmlFor="u">Duración</label>
          <select id="u" value={u} onChange={(e) => setU(e.target.value)}>
            <option value="30">30 minutos</option><option value="45">45 minutos</option><option value="60">1 hora</option>
          </select></div>
      </div>
      <p className="err" id="e" role="alert">{msg}</p>
      <section className={msg ? 'sum off' : 'sum'} aria-live="polite" aria-label="Resumen de la reserva">
        <h2>Tu demostración</h2>
        <p className="when">{msg ? 'Sin horario válido' : `${T(a)} a ${T(b)}`}</p>
        <p className="day">{msg ? 'Corrige la fecha o la hora de arriba.' : a.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
        <p className="zone">Zona horaria: {Intl.DateTimeFormat().resolvedOptions().timeZone}</p>
      </section>
    </main>
  );
}

// CSS: copia las reglas .card, .grid, .f, input, select, .err y .sum de la pestaña HTML + CSS.
