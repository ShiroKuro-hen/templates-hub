import { useEffect, useMemo, useRef, useState } from 'react';

// CSS: copia las reglas de la pestaña HTML + CSS (.app, .side, .top, .content, .card, .bulk, table, .more, .menu, .drawer, .tabs, @media).
export type Status = 'activo' | 'invitado' | 'suspendido';
export type User = { id: number; name: string; email: string; role: string; status: Status; last: string; since: string };

const PER = 5;
const LABEL: Record<Status, string> = { activo: 'Activo', invitado: 'Invitado', suspendido: 'Suspendido' };
const ROLES = ['Administrador', 'Editor', 'Analista', 'Lector'];
const DEFAULTS: User[] = [
  { id: 1, name: 'Laura Méndez', email: 'laura.mendez@nimbo.es', role: 'Administrador', status: 'activo', last: 'Hace 12 min', since: 'Marzo de 2024' },
  { id: 2, name: 'Mateo Ruiz', email: 'mateo.ruiz@nimbo.es', role: 'Editor', status: 'activo', last: 'Hace 2 h', since: 'Junio de 2024' },
  { id: 3, name: 'Lucía Fernández', email: 'lucia.fernandez@nimbo.es', role: 'Analista', status: 'activo', last: 'Ayer', since: 'Septiembre de 2024' },
  { id: 4, name: 'Javier Ortiz', email: 'javier.ortiz@nimbo.es', role: 'Lector', status: 'suspendido', last: '28 ago 2026', since: 'Enero de 2025' },
  { id: 5, name: 'Carmen Vidal', email: 'carmen.vidal@nimbo.es', role: 'Editor', status: 'activo', last: 'Hace 35 min', since: 'Febrero de 2025' },
  { id: 6, name: 'Diego Herrera', email: 'diego.herrera@nimbo.es', role: 'Analista', status: 'invitado', last: 'Sin acceso todavía', since: 'Octubre de 2026' },
  { id: 7, name: 'Elena Castro', email: 'elena.castro@nimbo.es', role: 'Lector', status: 'activo', last: '17 oct 2026', since: 'Abril de 2025' },
  { id: 8, name: 'Pablo Navarro', email: 'pablo.navarro@nimbo.es', role: 'Administrador', status: 'activo', last: 'Ayer', since: 'Enero de 2024' },
  { id: 9, name: 'Sofía Iglesias', email: 'sofia.iglesias@nimbo.es', role: 'Editor', status: 'invitado', last: 'Sin acceso todavía', since: 'Octubre de 2026' },
  { id: 10, name: 'Andrés Molina', email: 'andres.molina@nimbo.es', role: 'Lector', status: 'suspendido', last: '2 sep 2026', since: 'Julio de 2025' },
  { id: 11, name: 'Marta Domínguez', email: 'marta.dominguez@nimbo.es', role: 'Analista', status: 'activo', last: 'Hace 4 h', since: 'Mayo de 2025' },
  { id: 12, name: 'Raúl Gallego', email: 'raul.gallego@nimbo.es', role: 'Editor', status: 'activo', last: '15 oct 2026', since: 'Noviembre de 2025' },
];
const ICON = {
  inicio: 'M4 11l8-7 8 7v9h-5v-6H9v6H4z',
  usuarios: 'M9 4.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.5a3.5 3.5 0 0 1 0 7M21 20c0-2.5-1.5-4.6-3.5-5.5',
  informes: 'M5 20V10M12 20V4M19 20v-7',
  ajustes: 'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1',
  menu: 'M4 6h16M4 12h16M4 18h16',
  buscar: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  bell: 'M6 16V11a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  mas: 'M5 12h.01M12 12h.01M19 12h.01',
  cerrar: 'M6 6l12 12M18 6L6 18',
  prev: 'M15 6l-6 6 6 6',
  next: 'M9 6l6 6-6 6',
  plus: 'M12 5v14M5 12h14',
};

const initials = (name: string) => name.split(' ').slice(0, 2).map((p) => p[0]).join('');
const noun = (n: number) => (n === 1 ? 'usuario' : 'usuarios');

function Icon({ d }: { d: string }) {
  return <svg className="ico" viewBox="0 0 24 24" aria-hidden="true"><path d={d} /></svg>;
}

export function AdminUsersPage({ items = DEFAULTS }: { items?: User[] }) {
  const [users, setUsers] = useState(items);
  const [q, setQ] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState<Status | 'all'>('all');
  const [page, setPage] = useState(1);
  const [sel, setSel] = useState<number[]>([]);
  const [pending, setPending] = useState<'suspend' | 'delete' | null>(null);
  const [menu, setMenu] = useState<number | null>(null);
  const [detail, setDetail] = useState<User | null>(null);
  const [tab, setTab] = useState<'perfil' | 'act'>('perfil');
  const [msg, setMsg] = useState('');
  const [rail, setRail] = useState(() => matchMedia('(max-width:520px)').matches);
  const app = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLElement | null>(null);

  const list = useMemo(
    () => users.filter((u) => (!role || u.role === role) && (status === 'all' || u.status === status) && `${u.name} ${u.email} ${u.role}`.toLowerCase().includes(q.trim().toLowerCase())),
    [users, q, role, status],
  );
  const pages = Math.max(1, Math.ceil(list.length / PER));
  const current = Math.min(page, pages);
  const rows = list.slice((current - 1) * PER, current * PER);
  const picked = rows.filter((u) => sel.includes(u.id)).length;

  useEffect(() => {
    const d = dialog.current;
    if (!d) return;
    if (detail && !d.open) d.showModal();
    if (!detail && d.open) d.close();
    if (app.current) app.current.inert = Boolean(detail);
  }, [detail]);

  useEffect(() => {
    const closeMenu = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.c-act')) setMenu(null);
    };
    document.addEventListener('click', closeMenu);
    return () => document.removeEventListener('click', closeMenu);
  }, []);

  const setSelected = (id: number, on: boolean) => {
    setPending(null);
    setSel((s) => (on ? [...s, id] : s.filter((x) => x !== id)));
  };

  const setPageSelected = (on: boolean) => {
    setPending(null);
    const ids = rows.map((u) => u.id);
    setSel((s) => (on ? [...new Set([...s, ...ids])] : s.filter((x) => !ids.includes(x))));
  };

  const toggleStatus = (u: User) => {
    const next: Status = u.status === 'suspendido' ? 'activo' : 'suspendido';
    setMenu(null);
    setUsers((us) => us.map((x) => (x.id === u.id ? { ...x, status: next } : x)));
    setMsg(`Estado de ${u.name}: ${LABEL[next]}.`);
  };

  const applyBulk = () => {
    if (!pending) return;
    const n = sel.length;
    setUsers((us) => (pending === 'delete' ? us.filter((u) => !sel.includes(u.id)) : us.map((u) => (sel.includes(u.id) ? { ...u, status: 'suspendido' } : u))));
    setMsg(`${n} ${noun(n)} ${pending === 'delete' ? 'eliminado' : 'suspendido'}${n === 1 ? '' : 's'}.`);
    setSel([]);
    setPending(null);
  };

  const openDetail = (u: User, from: HTMLElement) => {
    trigger.current = from;
    setTab('perfil');
    setMenu(null);
    setDetail(u);
  };

  const closeDetail = () => {
    setDetail(null);
    trigger.current?.focus();
  };

  const resetFilters = () => {
    setQ('');
    setRole('');
    setStatus('all');
    setPage(1);
  };

  const count = (s: Status) => users.filter((u) => u.status === s).length;
  const chips: { v: Status | 'all'; label: string; n: number }[] = [
    { v: 'all', label: 'Todos', n: users.length },
    { v: 'activo', label: 'Activos', n: count('activo') },
    { v: 'invitado', label: 'Invitados', n: count('invitado') },
    { v: 'suspendido', label: 'Suspendidos', n: count('suspendido') },
  ];

  return (
    <>
      <div className={`app${rail ? ' rail' : ''}`} ref={app}>
        <nav className="side" aria-label="Principal">
          <div className="brand"><span className="logo" aria-hidden="true" /><span className="brand-t">Nimbo</span></div>
          <ul>
            <li><a href="#"><Icon d={ICON.inicio} /><span className="lbl">Inicio</span></a></li>
            <li><a href="#" aria-current="page"><Icon d={ICON.usuarios} /><span className="lbl">Usuarios</span></a></li>
            <li><a href="#"><Icon d={ICON.informes} /><span className="lbl">Informes</span></a></li>
            <li><a href="#"><Icon d={ICON.ajustes} /><span className="lbl">Ajustes</span></a></li>
          </ul>
        </nav>
        <div className="main">
          <header className="top">
            <button className="iconbtn" type="button" aria-expanded={!rail} aria-controls="side" aria-label={rail ? 'Expandir menú' : 'Contraer menú'} onClick={() => setRail((r) => !r)}>
              <Icon d={ICON.menu} />
            </button>
            <div className="search" role="search">
              <Icon d={ICON.buscar} />
              <input type="search" value={q} placeholder="Buscar por nombre, correo o rol" aria-label="Buscar usuarios por nombre, correo o rol" onChange={(e) => { setQ(e.target.value); setPage(1); }} />
            </div>
            <div className="end">
              <button className="iconbtn" type="button" aria-label="Notificaciones, 2 sin leer"><Icon d={ICON.bell} /></button>
              <button className="avatar" type="button" aria-label="Cuenta de Laura Méndez">LM</button>
            </div>
          </header>

          <main className="content">
            <div className="head">
              <div>
                <h1 tabIndex={-1}>Usuarios</h1>
                <p>{users.length} personas tienen acceso a este espacio de trabajo.</p>
              </div>
              <button className="btn" type="button" onClick={() => setMsg('Escribe el correo del nuevo usuario para enviar la invitación.')}>
                <Icon d={ICON.plus} />Invitar usuario
              </button>
            </div>

            <div className="filters">
              <label className="rolesel">Rol
                <select className="field" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }}>
                  <option value="">Todos los roles</option>
                  {ROLES.map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
              <div className="chips" role="group" aria-label="Filtrar por estado">
                {chips.map((c) => (
                  <button key={c.v} className="chip" type="button" aria-pressed={status === c.v} onClick={() => { setStatus(c.v); setPage(1); }}>
                    {c.label}<span className="n">{c.n}</span>
                  </button>
                ))}
              </div>
            </div>

            <p className="msg" role="status">{msg}</p>

            <section className="card" aria-label="Listado de usuarios">
              {sel.length > 0 && (
                <div className="bulk">
                  <span className="count" aria-live="polite">{sel.length}</span><span>seleccionados</span>
                  {pending ? (
                    <div className="confirm">
                      <span>{pending === 'delete' ? `¿Eliminar ${sel.length} ${noun(sel.length)}? No se puede deshacer.` : `¿Suspender a ${sel.length} ${noun(sel.length)}?`}</span>
                      <button className="btn ghost" type="button" onClick={() => setPending(null)}>Cancelar</button>
                      <button className="btn solid-err" type="button" onClick={applyBulk}>Confirmar</button>
                    </div>
                  ) : (
                    <div className="bulk-acts">
                      <button className="btn ghost" type="button" onClick={() => setPending('suspend')}>Suspender</button>
                      <button className="btn ghost danger" type="button" onClick={() => setPending('delete')}>Eliminar</button>
                    </div>
                  )}
                </div>
              )}
              <div className="scroll">
                <table>
                  <caption className="sr-only">Usuarios del espacio de trabajo. Marca filas para aplicar acciones en bloque.</caption>
                  <thead>
                    <tr>
                      <th className="c-sel" scope="col">
                        <input type="checkbox" aria-label="Seleccionar todos los usuarios de esta página" disabled={!rows.length}
                          checked={rows.length > 0 && picked === rows.length}
                          ref={(el) => { if (el) el.indeterminate = picked > 0 && picked < rows.length; }}
                          onChange={(e) => setPageSelected(e.target.checked)} />
                      </th>
                      <th scope="col">Usuario</th><th scope="col">Rol</th><th scope="col">Estado</th><th scope="col">Última actividad</th>
                      <th className="c-act" scope="col"><span className="sr-only">Acciones</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((u) => (
                      <tr key={u.id} className={sel.includes(u.id) ? 'on' : undefined}>
                        <td className="c-sel">
                          <input type="checkbox" aria-label={`Seleccionar a ${u.name}`} checked={sel.includes(u.id)} onChange={(e) => setSelected(u.id, e.target.checked)} />
                        </td>
                        <th scope="row">
                          <div className="who">
                            <span className="av" aria-hidden="true">{initials(u.name)}</span>
                            <span>
                              <button className="name" type="button" onClick={(e) => openDetail(u, e.currentTarget)}>{u.name}</button>
                              <span className="mail">{u.email}</span>
                            </span>
                          </div>
                        </th>
                        <td className="rest" data-label="Rol"><span className="role">{u.role}</span></td>
                        <td className="rest" data-label="Estado"><span className={`st ${u.status}`}>{LABEL[u.status]}</span></td>
                        <td className="rest" data-label="Última actividad"><span className="last">{u.last}</span></td>
                        <td className="c-act">
                          <button className="more" type="button" aria-label={`Acciones de ${u.name}`} aria-expanded={menu === u.id} aria-controls={`m-${u.id}`}
                            onClick={() => setMenu(menu === u.id ? null : u.id)}>
                            <Icon d={ICON.mas} />
                          </button>
                          <div className="menu" id={`m-${u.id}`} hidden={menu !== u.id}>
                            <button type="button" onClick={(e) => openDetail(u, e.currentTarget.closest('tr')?.querySelector<HTMLElement>('.more') ?? e.currentTarget)}>Ver perfil</button>
                            <button type="button" onClick={() => toggleStatus(u)}>{u.status === 'suspendido' ? 'Reactivar' : 'Suspender'}</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {list.length === 0 && (
                <p className="empty">No hay usuarios con esos filtros. <button className="link" type="button" onClick={resetFilters}>Limpiar filtros</button></p>
              )}
              <div className="pager">
                <span aria-live="polite">{list.length ? `Mostrando ${(current - 1) * PER + 1}–${(current - 1) * PER + rows.length} de ${list.length}` : 'Sin resultados'}</span>
                <div className="pg">
                  <button className="iconbtn" type="button" aria-label="Página anterior" disabled={current === 1} onClick={() => setPage(current - 1)}><Icon d={ICON.prev} /></button>
                  <span>Página {current} de {pages}</span>
                  <button className="iconbtn" type="button" aria-label="Página siguiente" disabled={current === pages} onClick={() => setPage(current + 1)}><Icon d={ICON.next} /></button>
                </div>
              </div>
            </section>
          </main>
        </div>
      </div>

      <dialog ref={dialog} className="drawer" aria-labelledby="dname" onClose={closeDetail}>
        {detail && (
          <>
            <div className="dhead">
              <span className="av" aria-hidden="true">{initials(detail.name)}</span>
              <div><h2 id="dname">{detail.name}</h2><p>{detail.email}</p></div>
              <button className="iconbtn" type="button" aria-label="Cerrar detalle" onClick={() => dialog.current?.close()}><Icon d={ICON.cerrar} /></button>
            </div>
            <div className="tabs" role="tablist" aria-label="Secciones del usuario">
              <button className="tab" type="button" role="tab" aria-selected={tab === 'perfil'} onClick={() => setTab('perfil')}>Perfil</button>
              <button className="tab" type="button" role="tab" aria-selected={tab === 'act'} onClick={() => setTab('act')}>Actividad</button>
            </div>
            <div className="dbody">
              {tab === 'perfil' ? (
                <dl className="facts">
                  <dt>Rol</dt><dd>{detail.role}</dd>
                  <dt>Estado</dt><dd>{LABEL[detail.status]}</dd>
                  <dt>Último acceso</dt><dd>{detail.last}</dd>
                  <dt>Miembro desde</dt><dd>{detail.since}</dd>
                </dl>
              ) : (
                <ol className="tl">
                  <li><span>Inició sesión</span><small>{detail.last}</small></li>
                  <li><span>Exportó el informe de septiembre</span><small>3 oct 2026</small></li>
                  <li><span>Editó el panel de Ventas</span><small>1 oct 2026</small></li>
                </ol>
              )}
            </div>
          </>
        )}
      </dialog>
    </>
  );
}
