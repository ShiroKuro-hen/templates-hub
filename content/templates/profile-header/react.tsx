import { useState } from 'react';

type Profile = { name: string; handle: string; bio: string; place: string; posts: number; followers: number; following: number };
const DEFAULT: Profile = {
  name: 'Valeria Montoya', handle: '@valeriamontoya', place: 'Lima, Perú',
  bio: 'Diseñadora de producto en Nimbus. Escribo sobre sistemas de diseño, accesibilidad y trabajo en equipo.',
  posts: 248, followers: 12480, following: 312,
};

export function ProfileHeader({ profile = DEFAULT }: { profile?: Profile }) {
  const [on, setOn] = useState(false);
  const initials = profile.name.split(' ').map((w) => w[0]).join('');
  const followers = profile.followers + (on ? 1 : 0);
  const fmt = (n: number) => n.toLocaleString('es');

  return (
    <article className="card" aria-labelledby="n">
      <svg className="cover" viewBox="0 0 800 150" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
        <defs>
          <linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient>
          <pattern id="p" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#fff" strokeOpacity=".18" /></pattern>
        </defs>
        <rect width="800" height="150" fill="url(#g)" />
        <rect width="800" height="150" fill="url(#p)" />
        <circle cx="640" cy="40" r="90" fill="none" stroke="#fff" strokeOpacity=".3" />
        <circle cx="640" cy="40" r="52" fill="none" stroke="#fff" strokeOpacity=".3" />
        <circle cx="640" cy="40" r="6" fill="#fff" fillOpacity=".8" />
      </svg>
      <div className="main">
        <div className="top">
          <span className="av" aria-hidden="true">{initials}</span>
          <div className="acts">
            <button type="button">Enviar mensaje</button>
            <button type="button" className={on ? undefined : 'pri'} onClick={() => setOn(!on)}>{on ? 'Siguiendo' : 'Seguir'}</button>
          </div>
        </div>
        <h1 id="n">
          {profile.name}
          <svg className="ver" viewBox="0 0 24 24" role="img" aria-label="Cuenta verificada">
            <path fill="currentColor" d="M12 2l2.4 1.8 3-.2 1 2.8 2.5 1.7-.9 2.9.9 2.9-2.5 1.7-1 2.8-3-.2L12 22l-2.4-1.8-3 .2-1-2.8-2.5-1.7.9-2.9-.9-2.9 2.5-1.7 1-2.8 3 .2z" />
            <path fill="none" stroke="var(--accent-ink)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M8 12.5l2.6 2.6L16 9.5" />
          </svg>
        </h1>
        <p className="handle">{profile.handle}</p>
        <p className="bio">{profile.bio}</p>
        <p className="loc">{profile.place}</p>
        <dl>
          <div><dt>Publicaciones</dt><dd>{fmt(profile.posts)}</dd></div>
          <div><dt>Seguidores</dt><dd>{fmt(followers)}</dd></div>
          <div><dt>Siguiendo</dt><dd>{fmt(profile.following)}</dd></div>
        </dl>
        <p className="sr" role="status">{on ? `Ahora sigues a ${profile.name}` : ''}</p>
      </div>
    </article>
  );
}

// CSS: copia las reglas .card, .cover, .main, .top, .av, .acts, button, h1, .ver y dl de la pestaña HTML + CSS.
