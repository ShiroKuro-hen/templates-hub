import type { CSSProperties } from 'react';

type Person = { nombre: string };
type Props = {
  people: Person[];
  max?: number; // cuántos se muestran antes del "+N"
  size?: 'sm' | 'md' | 'lg';
};

const COLORS = ['#ffd84d', '#ff8a6e', '#9db4ff', '#8fdcaa'];

const initials = (name: string) =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

export function AvatarGroup({ people, max = 4, size = 'md' }: Props) {
  const shown = people.slice(0, max);
  const rest = people.length - shown.length;
  const label = `Miembros: ${shown.map((p) => p.nombre).join(', ')}${rest > 0 ? ` y ${rest} más` : ''}`;

  return (
    <ul className={`avatars ${size === 'md' ? '' : size}`} aria-label={label}>
      {shown.map((p, i) => (
        <li
          key={p.nombre}
          className="avatar"
          style={{ '--c': COLORS[i % COLORS.length] } as CSSProperties}
          role="img"
          aria-label={p.nombre}
          title={p.nombre}
          tabIndex={0}
        >
          {initials(p.nombre)}
        </li>
      ))}
      {rest > 0 && (
        <li className="avatar more" role="img" aria-label={`${rest} personas más`}>
          +{rest}
        </li>
      )}
    </ul>
  );
}
// CSS: copia las reglas .avatars / .avatar / .avatars.sm / .avatars.lg / .avatar.more de la pestaña HTML + CSS.
