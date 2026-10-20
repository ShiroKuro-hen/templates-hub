import { useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type SyntheticEvent } from 'react';

type Level = 'ok' | 'warn' | 'err';
type Tone = Level | 'info';
type Step = 'investigating' | 'monitoring' | 'resolved';
type Day = { s: Level; up: number };
type Service = { name: string; days: Day[]; up: number; state: Level };
type Tip = { text: string; x: number; y: number };
export type Incident = { svc: number; ago: number; level: Level; title: string; updates: [string, Step, string][] };

const TODAY = new Date(2026, 9, 20);
const DAYS = 90;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const SVCS = ['API pública', 'Web', 'Base de datos', 'Correo', 'Autenticación', 'Almacenamiento', 'Pagos', 'Webhooks'];
const STATE: Record<Level, string> = { ok: 'Operativo', warn: 'Degradado', err: 'Incidencia' };
const RANK: Record<Level, number> = { ok: 0, warn: 1, err: 2 };
const STEP: Record<Step, [string, Tone]> = {
  investigating: ['Investigando', 'warn'],
  monitoring: ['En observación', 'info'],
  resolved: ['Resuelto', 'ok'],
};
const INCIDENTS: Incident[] = [
  { svc: 7, ago: 0, level: 'warn', title: 'Entregas de webhooks con retraso', updates: [
    ['07:48', 'investigating', 'Algunos webhooks se entregan con retraso. Revisamos la cola de reintentos.'],
  ] },
  { svc: 1, ago: 1, level: 'warn', title: 'Carga lenta del panel desde Europa', updates: [
    ['11:02', 'investigating', 'Algunos usuarios de Europa notan tiempos de carga superiores a 6 segundos.'],
    ['12:18', 'resolved', 'Una caché defectuosa ralentizaba el panel. Está corregida y los tiempos son los habituales.'],
  ] },
  { svc: 3, ago: 3, level: 'warn', title: 'Retrasos en el envío de correos', updates: [
    ['14:20', 'investigating', 'Los correos de verificación tardan hasta 15 minutos en llegar.'],
    ['15:55', 'monitoring', 'Reducimos la cola de envíos. Los tiempos vuelven a estar por debajo de 2 minutos.'],
  ] },
  { svc: 6, ago: 5, level: 'err', title: 'Cobros rechazados con tarjetas internacionales', updates: [
    ['08:12', 'investigating', 'Detectamos un aumento de rechazos al cobrar con tarjetas emitidas fuera de la UE.'],
    ['09:05', 'monitoring', 'Identificamos la causa en un proveedor externo. Aplicamos un ajuste y vigilamos las transacciones.'],
    ['10:40', 'resolved', 'Los cobros se procesan con normalidad. Reintentaremos los pagos rechazados de las últimas horas.'],
  ] },
];

function rng(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pct = (v: number) => `${v.toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %`;
const fecha = (ago: number) => {
  const d = new Date(TODAY);
  d.setDate(d.getDate() - ago);
  return d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
};
const uptime = (s: Level, r: number) => (s === 'ok' ? 100 - r * 0.05 : s === 'warn' ? 98.5 + r * 1.2 : 90 + r * 6);

function history(seed: number, incidents: Incident[]): Day[] {
  const next = rng(seed);
  const days: Day[] = Array.from({ length: DAYS }, (_, i) => {
    const r = next();
    const s: Level = i < DAYS - 7 ? (r < 0.006 ? 'err' : r < 0.04 ? 'warn' : 'ok') : 'ok';
    return { s, up: uptime(s, next()) };
  });
  incidents.forEach(({ ago, level }) => {
    days[DAYS - 1 - ago] = { s: level, up: uptime(level, next()) };
  });
  return days;
}

function buildServices(incidents: Incident[]): Service[] {
  return SVCS.map((name, svc) => {
    const days = history(svc * 7919 + 17, incidents.filter((x) => x.svc === svc));
    return { name, days, up: days.reduce((sum, d) => sum + d.up, 0) / DAYS, state: days[DAYS - 1].s };
  });
}

function banner(level: Level, hit: number): [string, string] {
  if (level === 'ok') return ['Todos los sistemas operativos', 'No hay incidencias abiertas.'];
  const afectados = hit === 1 ? '1 servicio afectado' : `${hit} servicios afectados`;
  return level === 'warn'
    ? ['Rendimiento degradado', `${afectados}. Seguimos trabajando en ello.`]
    : ['Incidencia en curso', `${afectados}. Te avisaremos al resolverla.`];
}

function tipAt(cell: HTMLElement): Tip {
  const r = cell.getBoundingClientRect();
  return { text: cell.dataset.tip ?? '', x: r.left + r.width / 2, y: r.top };
}

export function StatusPage({ incidents = INCIDENTS }: { incidents?: Incident[] }) {
  const services = useMemo(() => buildServices(incidents), [incidents]);
  const worst = services.reduce<Level>((w, s) => (RANK[s.state] > RANK[w] ? s.state : w), 'ok');
  const hit = services.filter((s) => s.state !== 'ok').length;
  const [tip, setTip] = useState<Tip | null>(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const [title, detail] = banner(worst, hit);

  const showTip = (e: SyntheticEvent<HTMLElement>) => {
    const cell = (e.target as HTMLElement).closest<HTMLElement>('[data-tip]');
    if (cell) setTip(tipAt(cell));
  };

  const moveFocus = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') return setTip(null);
    const cells = Array.from(e.currentTarget.children) as HTMLButtonElement[];
    const i = cells.indexOf(e.target as HTMLButtonElement);
    const next: Partial<Record<string, number>> = { ArrowLeft: i - 1, ArrowRight: i + 1, Home: 0, End: cells.length - 1 };
    const target = next[e.key];
    if (target === undefined) return;
    e.preventDefault();
    const j = Math.min(Math.max(target, 0), cells.length - 1);
    cells.forEach((c, k) => (c.tabIndex = k === j ? 0 : -1));
    cells[j].focus();
  };

  const submit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const v = email.trim();
    const msg = !v ? 'Escribe tu correo para suscribirte.'
      : EMAIL.test(v) ? '' : 'Revisa el correo: debe tener @ y un dominio, por ejemplo ana@empresa.com.';
    setError(msg);
    if (msg) return inputRef.current?.focus();
    setSent(v);
  };

  return (
    <main className="page">
      <header className="top">
        <h1>Estado de Nimbo</h1>
        <p className="meta">Actualizado hoy a las 09:42</p>
      </header>
      <div className="banner" data-s={worst} role="status" aria-live="polite">
        <span className="ico" aria-hidden="true" />
        <div><p className="bt">{title}</p><p className="bs">{detail}</p></div>
      </div>
      <section className="sec" aria-labelledby="svc-t">
        <div className="sec-h">
          <h2 id="svc-t">Servicios</h2>
          <ul className="legend">
            <li data-s="ok"><i aria-hidden="true" />Operativo</li>
            <li data-s="warn"><i aria-hidden="true" />Degradado</li>
            <li data-s="err"><i aria-hidden="true" />Incidencia</li>
          </ul>
        </div>
        <p className="hint">Cada barra es un día. Con el teclado, usa las flechas para recorrerlas.</p>
        <ul className="svcs">
          {services.map((s) => (
            <li className="svc" key={s.name}>
              <div className="svc-h">
                <h3>{s.name}</h3>
                <p className="stat"><span className="pct">{pct(s.up)}</span><span className="pill" data-s={s.state}><i aria-hidden="true" />{STATE[s.state]}</span></p>
              </div>
              <div
                className="bar"
                role="group"
                aria-label={`Disponibilidad de ${s.name} en los últimos 90 días`}
                onPointerOver={showTip}
                onPointerOut={() => setTip(null)}
                onFocus={showTip}
                onBlur={() => setTip(null)}
                onKeyDown={moveFocus}
              >
                {s.days.map((d, i) => {
                  const label = `${fecha(DAYS - 1 - i)}: ${pct(d.up)} disponible, ${STATE[d.s]}`;
                  return <button key={i} type="button" className="cell" data-s={d.s} data-tip={label} aria-label={label} tabIndex={i === DAYS - 1 ? 0 : -1} />;
                })}
              </div>
              <div className="foot"><span>Hace 90 días</span><span>Hoy</span></div>
            </li>
          ))}
        </ul>
      </section>
      <section className="sec" aria-labelledby="inc-t">
        <h2 id="inc-t">Incidencias de los últimos 7 días</h2>
        <ul className="incs">
          {incidents.map((x) => (
            <li className="inc" key={x.title}>
              <h3>{x.title}</h3>
              <p className="inc-meta">{SVCS[x.svc]} · {fecha(x.ago)}</p>
              <ol className="tl">
                {x.updates.map(([hora, st, texto]) => (
                  <li key={hora} data-s={STEP[st][1]}>
                    <div className="tl-h"><time>{hora}</time><span className="pill"><i aria-hidden="true" />{STEP[st][0]}</span></div>
                    <p>{texto}</p>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ul>
      </section>
      <section className="sec sub" aria-labelledby="sub-t">
        <h2 id="sub-t">Suscríbete a las actualizaciones</h2>
        {sent ? (
          <p className="done" role="status">Listo. Te enviamos un enlace a {sent} para confirmar la suscripción.</p>
        ) : (
          <form onSubmit={submit} noValidate>
            <label htmlFor="em">Correo electrónico</label>
            <div className="row">
              <input
                id="em"
                ref={inputRef}
                type="email"
                name="email"
                autoComplete="email"
                placeholder="tu@empresa.com"
                required
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                aria-invalid={!!error}
                aria-describedby="em-hint em-err"
              />
              <button type="submit">Suscribirme</button>
            </div>
            {error && <p className="err" id="em-err" role="alert">{error}</p>}
            <p className="hint" id="em-hint">Te avisamos al abrir, actualizar y cerrar una incidencia. Sin spam.</p>
          </form>
        )}
      </section>
      {tip && (
        <div className="tip" role="tooltip" style={{ left: tip.x, top: tip.y, transform: 'translate(-50%, calc(-100% - 8px))' }}>
          {tip.text}
        </div>
      )}
    </main>
  );
}
// CSS: copia las reglas de la pestaña HTML + CSS (tokens, [data-s], .page, .banner, .bar, .cell, .tip, .sub…).
