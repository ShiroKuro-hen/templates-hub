type Member = { name: string; role: string; email: string; profile: string };

const TEAM: Member[] = [
  { name: 'Ana Pérez', role: 'Directora de producto', email: 'ana@ejemplo.com', profile: '#' },
  { name: 'Luis Gómez', role: 'Ingeniero de plataforma', email: 'luis@ejemplo.com', profile: '#' },
  { name: 'Marta Ruiz', role: 'Diseñadora de sistemas', email: 'marta@ejemplo.com', profile: '#' },
  { name: 'Carlos Díaz', role: 'Responsable de seguridad', email: 'carlos@ejemplo.com', profile: '#' },
];

const initials = (name: string) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();

function Icon({ d, rect }: { d: string; rect?: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {rect && <rect x="3" y="5" width="18" height="14" rx="2" />}
      <path d={d} />
    </svg>
  );
}

export function TeamSection({ members = TEAM }: { members?: Member[] }) {
  return (
    <section className="team" aria-labelledby="team-title">
      <h2 id="team-title">Las personas detrás del producto</h2>
      <p className="lead">Un equipo pequeño que diseña, construye y opera la plataforma. Escríbenos directamente.</p>
      <ul className="grid">
        {members.map((m) => (
          <li className="member" key={m.email}>
            <span className="avatar" aria-hidden="true">{initials(m.name)}</span>
            <div><h3>{m.name}</h3><p>{m.role}</p></div>
            <div className="links">
              <a href={`mailto:${m.email}`} aria-label={`Escribir a ${m.name}`}><Icon rect d="m3 7 9 6 9-6" /></a>
              <a href={m.profile} aria-label={`Perfil profesional de ${m.name}`}>
                <Icon d="M10 14a4 4 0 0 0 5.66 0l3-3a4 4 0 0 0-5.66-5.66l-1 1M14 10a4 4 0 0 0-5.66 0l-3 3a4 4 0 0 0 5.66 5.66l1-1" />
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

// CSS: copia las reglas .team, .grid, .member, .avatar y .links de la pestaña HTML + CSS.
