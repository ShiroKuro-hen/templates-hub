import { useRef, useState } from 'react';

type Item = { kind: 'ok' | 'info' | 'warn'; icon: string; html: React.ReactNode; hora: string };
const HOY: Item[] = [
  { kind: 'ok', icon: 'm5 12 5 5 9-10', hora: '10:42', html: <>Publicó la automatización <b>Aprobaciones de gastos</b> en Finanzas.</> },
  { kind: 'info', icon: 'M4 5h16v11H9l-5 4z', hora: '09:15', html: <>Comentó en <b>Rediseño del panel de métricas</b>.<q>Propongo unificar los filtros en una sola barra.</q></> },
];
const AYER: Item[] = [
  { kind: 'ok', icon: 'm5 12 5 5 9-10', hora: '17:30', html: <>Completó 5 tareas en <b>Lanzamiento del cuarto trimestre</b>.</> },
  { kind: 'warn', icon: 'm12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z', hora: '11:08', html: <>Obtuvo la insignia <b>Mentora</b>.</> },
];
const PROYECTOS: [string, string, number][] = [['Rediseño del panel de métricas', 'En curso', 72], ['Sistema de diseño Ion', 'En curso', 45], ['Onboarding móvil', 'Completado', 100]];
const INSIGNIAS = ['Mentora', 'Colaboradora del año 2025', '100 flujos publicados', 'Primera semana sin errores'];
const TABS = ['Actividad', 'Proyectos', 'Insignias'];

function Feed({ titulo, items }: { titulo: string; items: Item[] }) {
  return (
    <>
      <h2>{titulo}</h2>
      <ul className="feed">
        {items.map((i) => (
          <li key={i.hora}>
            <span className={i.kind === 'info' ? 'dot' : `dot ${i.kind}`}><svg viewBox="0 0 24 24"><path d={i.icon} /></svg></span>
            <p>{i.html}<br /><small>{i.hora}</small></p>
          </li>
        ))}
      </ul>
    </>
  );
}

export function ProfilePage() {
  const [sigue, setSigue] = useState(false);
  const [tab, setTab] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const k = ({ ArrowRight: 1, ArrowLeft: -1 } as Record<string, number>)[e.key];
    if (!k) return;
    const n = (i + k + TABS.length) % TABS.length;
    setTab(n); refs.current[n]?.focus();
  };

  return (
    <div className="page">
      <header className="box head">
        <div className="cover" aria-hidden="true" />
        <div className="info">
          <div className="ring"><div className="av" aria-hidden="true">MV</div></div>
          <div className="who">
            <h1>Mariana Vélez <span className="badge">Administradora</span></h1>
            <p>Diseñadora de producto en Nimbo. Lima, Perú.</p>
          </div>
          <div className="acts">
            <button className="btn" type="button" aria-pressed={sigue} onClick={() => setSigue(!sigue)}>{sigue ? 'Siguiendo' : 'Seguir'}</button>
            <button className="btn" type="button">Enviar mensaje</button>
          </div>
        </div>
        <dl className="stats">
          <div><dt>proyectos</dt><dd>48</dd></div>
          <div><dt>seguidores</dt><dd>{sigue ? '1.249' : '1.248'}</dd></div>
          <div><dt>siguiendo</dt><dd>312</dd></div>
        </dl>
      </header>
      <div className="cols">
        <main className="box">
          <div role="tablist" aria-label="Secciones del perfil">
            {TABS.map((t, i) => (
              <button key={t} ref={(el) => { refs.current[i] = el; }} role="tab" id={`t${i}`} aria-controls={`p${i}`}
                aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => setTab(i)} onKeyDown={(e) => onKey(e, i)}>{t}</button>
            ))}
          </div>
          <div role="tabpanel" id="p0" aria-labelledby="t0" tabIndex={0} hidden={tab !== 0}><Feed titulo="Hoy" items={HOY} /><Feed titulo="Ayer" items={AYER} /></div>
          <div role="tabpanel" id="p1" aria-labelledby="t1" tabIndex={0} hidden={tab !== 1}>
            {PROYECTOS.map(([n, estado, v]) => (
              <div className="prj" key={n}><b>{n}</b><span className="badge">{estado}</span><progress max={100} value={v} aria-label={`${v} % completado`} /></div>
            ))}
          </div>
          <div role="tabpanel" id="p2" aria-labelledby="t2" tabIndex={0} hidden={tab !== 2}><ul className="tags">{INSIGNIAS.map((b) => <li key={b}>{b}</li>)}</ul></div>
        </main>
        <aside>
          <section className="box"><h2>Acerca de</h2><p>Diseño interfaces claras para equipos de operaciones. Me interesa la accesibilidad y la documentación.</p></section>
          <section className="box"><h2>Habilidades</h2><ul className="tags"><li>Diseño de sistemas</li><li>Investigación</li><li>Prototipado</li><li>Accesibilidad</li></ul></section>
          <section className="box"><h2>Equipos</h2><ul className="tags"><li>Diseño de producto</li><li>Plataforma</li></ul></section>
        </aside>
      </div>
    </div>
  );
}
// CSS: copia las reglas .page, .box, .head, .ring, .av, .stats, .cols, [role=tab], .feed, .dot, .prj, progress y .tags de la pestaña HTML + CSS.
