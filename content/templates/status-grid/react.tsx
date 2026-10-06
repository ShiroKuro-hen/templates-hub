type Day = 'o' | 'd' | 'x'; // o = operativo, d = degradado, x = incidencia
type Service = { name: string; bad: Record<number, Day> }; // bad: día (0 = hace 29 días, 29 = hoy)

const SERVICES: Service[] = [
  { name: 'API pública', bad: {} },
  { name: 'Panel web', bad: { 14: 'd' } },
  { name: 'Autenticación', bad: {} },
  { name: 'Pagos', bad: { 6: 'x', 7: 'd' } },
  { name: 'Notificaciones', bad: { 3: 'd', 28: 'd', 29: 'd' } },
  { name: 'Almacenamiento', bad: {} },
  { name: 'Webhooks', bad: { 19: 'd', 20: 'd' } },
  { name: 'Búsqueda', bad: {} },
];

const TEXT: Record<Day, string> = { o: 'operativo', d: 'degradado', x: 'con incidencia' };
const LABEL: Record<Day, string> = { o: 'Operativo', d: 'Degradado', x: 'Con incidencia' };
const fecha = (i: number) =>
  new Date(2026, 9, 6 - (29 - i)).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

export function StatusGrid({ services = SERVICES }: { services?: Service[] }) {
  const rows = services.map((s) => {
    const days = Array.from({ length: 30 }, (_, i): Day => s.bad[i] ?? 'o');
    const x = days.filter((c) => c === 'x').length;
    const w = days.filter((c) => c === 'd').length;
    return { ...s, days, x, w, today: days[29], uptime: (100 - x * 0.8 - w * 0.2).toFixed(1).replace('.', ',') };
  });
  const alerta = rows.filter((r) => r.today !== 'o').length;

  return (
    <>
      <h1>Estado de los servicios</h1>
      <p className={alerta ? 'banner w' : 'banner'} role="status">
        <span className="dot" />
        <span>{alerta ? `Hay ${alerta} ${alerta > 1 ? 'servicios' : 'servicio'} con problemas. Seguimos investigando la causa.` : 'Todos los sistemas funcionan con normalidad.'}</span>
      </p>
      <ul className="grid">
        {rows.map((r) => (
          <li key={r.name} className="svc">
            <div className="top"><h3>{r.name}</h3><span className={`st ${r.today}`}>{LABEL[r.today]}</span></div>
            <div className="bars" role="img"
                 aria-label={`${r.name}, últimos 30 días: ${30 - r.x - r.w} operativos, ${r.w} degradados, ${r.x} con incidencia`}>
              {r.days.map((c, i) => <i key={i} className={c} title={`${fecha(i)}: ${TEXT[c]}`} />)}
            </div>
            <div className="foot"><span>Hace 30 días</span><span><b>{r.uptime} %</b> disponible</span></div>
          </li>
        ))}
      </ul>
    </>
  );
}
// CSS: copia las reglas h1 / .banner / .dot / .grid / .svc / .top / .st / .bars / .foot de la pestaña HTML + CSS.
