import { useRef, useState, type FormEvent, type KeyboardEvent } from 'react';

type Settings = { name: string; email: string; lang: string; weekly: boolean; mentions: boolean; news: boolean; mfa: boolean; timeout: string };
type Toggle = 'weekly' | 'mentions' | 'news' | 'mfa';

const TABS = ['Perfil', 'Notificaciones', 'Seguridad'];
const INITIAL: Settings = { name: 'Laura Méndez', email: 'laura@altamira.com', lang: 'Español', weekly: true, mentions: true, news: false, mfa: false, timeout: 'Tras 8 horas' };
const NOTIF: [Toggle, string, string][] = [
  ['weekly', 'Resumen semanal', 'Un correo cada lunes con la actividad del equipo.'],
  ['mentions', 'Menciones', 'Cuando alguien te menciona en un comentario.'],
  ['news', 'Novedades del producto', 'Funciones nuevas, como mucho una vez al mes.'],
];

export function SettingsPage({ initial = INITIAL, onSave }: { initial?: Settings; onSave?: (s: Settings) => void }) {
  const [tab, setTab] = useState(0);
  const [saved, setSaved] = useState(initial);
  const [s, setS] = useState(initial);
  const [msg, setMsg] = useState('Sin cambios pendientes.');
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const dirty = JSON.stringify(s) !== JSON.stringify(saved);
  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => { setS({ ...s, [k]: v }); setMsg('Tienes cambios sin guardar.'); };

  function go(i: number) { const n = (i + TABS.length) % TABS.length; setTab(n); tabs.current[n]?.focus(); }
  function onKey(e: KeyboardEvent) {
    const next = { ArrowDown: tab + 1, ArrowRight: tab + 1, ArrowUp: tab - 1, ArrowLeft: tab - 1, Home: 0, End: TABS.length - 1 }[e.key];
    if (next !== undefined) { e.preventDefault(); go(next); }
  }
  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const bad = e.currentTarget.querySelector<HTMLInputElement>(':invalid');
    if (bad) { setTab(0); requestAnimationFrame(() => bad.reportValidity()); return; } // solo Perfil tiene campos obligatorios
    setSaved(s); onSave?.(s); setMsg('Cambios guardados.');
  }
  const sw = (k: Toggle, title: string, help: string) => (
    <label className="row" key={k}><span>{title}<small>{help}</small></span>
      <input className="switch" type="checkbox" role="switch" checked={s[k]} onChange={(e) => set(k, e.target.checked)} />
    </label>
  );

  return (
    <main className="wrap">
      <h1>Ajustes</h1>
      <p className="lead">Gestiona tu perfil, avisos y seguridad de la cuenta.</p>
      <form noValidate onSubmit={submit} onReset={(e) => { e.preventDefault(); setS(saved); setMsg('Cambios descartados.'); }}>
        <div role="tablist" aria-label="Secciones de ajustes" aria-orientation="vertical" onKeyDown={onKey}>
          {TABS.map((t, i) => (
            <button key={t} ref={(el) => { tabs.current[i] = el; }} type="button" role="tab" id={`t${i}`} aria-controls={`p${i}`}
                    aria-selected={tab === i} tabIndex={tab === i ? 0 : -1} onClick={() => go(i)}>{t}</button>
          ))}
        </div>
        <section role="tabpanel" id="p0" aria-labelledby="t0" hidden={tab !== 0}>
          <h2>Perfil</h2><p className="desc">Así te ven las personas de tu equipo.</p>
          <div className="fields">
            <label className="f">Nombre <input value={s.name} onChange={(e) => set('name', e.target.value)} required autoComplete="name" /></label>
            <label className="f">Correo <input type="email" value={s.email} onChange={(e) => set('email', e.target.value)} required autoComplete="email" /></label>
            <label className="f">Idioma <select value={s.lang} onChange={(e) => set('lang', e.target.value)}><option>Español</option><option>English</option><option>Português</option></select></label>
          </div>
        </section>
        <section role="tabpanel" id="p1" aria-labelledby="t1" hidden={tab !== 1}>
          <h2>Notificaciones</h2><p className="desc">Elige qué avisos recibes por correo.</p>
          {NOTIF.map(([k, t, h]) => sw(k, t, h))}
        </section>
        <section role="tabpanel" id="p2" aria-labelledby="t2" hidden={tab !== 2}>
          <h2>Seguridad</h2><p className="desc">Protege el acceso a tu cuenta.</p>
          {sw('mfa', 'Verificación en dos pasos', 'Pide un código de tu app de autenticación al iniciar sesión.')}
          <div className="fields"><label className="f">Cerrar sesión por inactividad
            <select value={s.timeout} onChange={(e) => set('timeout', e.target.value)}><option>Tras 30 minutos</option><option>Tras 8 horas</option><option>Nunca</option></select>
          </label></div>
        </section>
        <div className="bar">
          <p role="status">{msg}</p>
          <button className="btn" type="reset" disabled={!dirty}>Descartar</button>
          <button className="btn primary" type="submit" disabled={!dirty}>Guardar cambios</button>
        </div>
      </form>
    </main>
  );
}

// CSS: copia las reglas .wrap, form, [role=tablist], [role=tab], [role=tabpanel], .fields, .row, .switch, .bar y .btn de la pestaña HTML + CSS.
