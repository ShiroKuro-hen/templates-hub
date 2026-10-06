import { useRef, useState, type FormEvent } from 'react';

type Role = 'Administrador' | 'Editor' | 'Lector';
type Invite = { email: string; role: Role; when: string };

const MAX = 10, MEMBERS = 4;
const HINT: Record<Role, string> = {
  Administrador: 'Gestiona miembros, facturación y ajustes.',
  Editor: 'Crea y edita proyectos. No ve la facturación.',
  Lector: 'Solo consulta proyectos y comentarios.',
};
const INITIAL: Invite[] = [
  { email: 'carlos.mendoza@norte.cloud', role: 'Editor', when: 'hace 2 días' },
  { email: 'valeria.rios@norte.cloud', role: 'Lector', when: 'hace 5 días' },
  { email: 'andres.paz@norte.cloud', role: 'Administrador', when: 'hoy' },
];

export function InviteMembers({ initial = INITIAL, onInvite }: { initial?: Invite[]; onInvite?: (i: Invite) => Promise<void> }) {
  const [pending, setPending] = useState(initial);
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Role>('Editor');
  const [msg, setMsg] = useState({ text: '', ok: false });
  const [sent, setSent] = useState<string | null>(null);
  const field = useRef<HTMLInputElement>(null);
  const used = MEMBERS + pending.length;

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const v = email.trim().toLowerCase();
    const m = !e.currentTarget.checkValidity() ? 'Escribe un correo válido, por ejemplo nombre@empresa.com.'
      : pending.some((p) => p.email === v) ? `${v} ya tiene una invitación pendiente. Usa Reenviar en la lista.`
      : used >= MAX ? `Alcanzaste el límite de ${MAX} puestos. Cancela una invitación o amplía tu plan.` : '';
    if (m) return setMsg({ text: m, ok: false });
    const inv: Invite = { email: v, role, when: 'ahora' };
    await onInvite?.(inv);
    setPending([inv, ...pending]); setEmail(''); setMsg({ text: `Invitación enviada a ${v}.`, ok: true });
  }
  function cancel(p: Invite) {
    setPending(pending.filter((x) => x !== p));
    setMsg({ text: `Invitación a ${p.email} cancelada.`, ok: false }); field.current?.focus();
  }
  function resend(p: Invite) {
    setMsg({ text: `Invitación reenviada a ${p.email}.`, ok: true });
    setSent(p.email); setTimeout(() => setSent(null), 1600);
  }

  return (
    <main className="card">
      <section aria-labelledby="t">
        <h1 id="t">Invitar al equipo</h1>
        <p className="sub">Los miembros nuevos reciben un correo con un enlace válido por 7 días.</p>
        <div className="seats"><span>{used} de {MAX} puestos ocupados</span></div>
        <div className="meter" role="meter" aria-label="Puestos ocupados" aria-valuemin={0} aria-valuemax={MAX} aria-valuenow={used}>
          <i style={{ width: `${(used / MAX) * 100}%` }} />
        </div>
        <form noValidate onSubmit={submit}>
          <div className="f"><label htmlFor="email">Correo electrónico</label>
            <input id="email" ref={field} type="email" autoComplete="off" placeholder="nombre@empresa.com" required value={email}
                   onChange={(e) => setEmail(e.target.value)} aria-invalid={(!!msg.text && !msg.ok) || undefined} aria-describedby="msg" /></div>
          <div className="f role"><label htmlFor="role">Rol</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value as Role)} aria-describedby="rh">
              {(Object.keys(HINT) as Role[]).map((r) => <option key={r}>{r}</option>)}
            </select></div>
          <button className="btn primary" type="submit">Enviar invitación</button>
          <p id="rh" className="hint">{HINT[role]}</p>
          <p id="msg" className={msg.ok ? 'msg ok' : 'msg'} role="status" aria-live="polite">{msg.text}</p>
        </form>
      </section>
      <section aria-labelledby="p">
        <h2 id="p">Invitaciones pendientes <span className="count">{pending.length}</span></h2>
        <ul>
          {pending.map((p) => (
            <li key={p.email} className="row">
              <span className="av" aria-hidden="true">{p.email[0].toUpperCase()}</span>
              <div className="who"><strong>{p.email}</strong><span>{p.role}, enviada {p.when}</span></div>
              <div className="acts">
                <button className="btn sm" type="button" aria-label={`Reenviar invitación a ${p.email}`} onClick={() => resend(p)}>{sent === p.email ? 'Reenviada' : 'Reenviar'}</button>
                <button className="btn sm danger" type="button" aria-label={`Cancelar invitación a ${p.email}`} onClick={() => cancel(p)}>Cancelar</button>
              </div>
            </li>
          ))}
        </ul>
        {!pending.length && <p className="empty">No hay invitaciones pendientes. Escribe un correo arriba para sumar a tu equipo.</p>}
      </section>
    </main>
  );
}

// CSS: copia las reglas .card, section, h1/h2, .seats, .meter, form, .f, input/select, .hint/.msg, .btn, .count, .row, .av, .who, .acts y .empty de la pestaña HTML + CSS.
