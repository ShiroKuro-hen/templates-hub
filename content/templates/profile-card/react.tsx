import { useState } from 'react';

type Props = {
  nombre: string;
  rol: string;
  bio: string;
  seguidores: number; // sin contar al usuario actual
  siguiendo?: boolean;
  variante?: 'amarillo' | 'azul';
  onMensaje?: () => void;
};

const iniciales = (n: string) =>
  n.split(' ').filter(Boolean).slice(0, 2).map((p) => p[0].toUpperCase()).join('');

export function ProfileCard({ nombre, rol, bio, seguidores, siguiendo = false, variante = 'amarillo', onMensaje }: Props) {
  const [on, setOn] = useState(siguiendo);
  const id = `n-${nombre.replace(/\s/g, '-')}`;

  return (
    <article className="profile" aria-labelledby={id}>
      <div className={`avatar${variante === 'azul' ? ' b' : ''}`} aria-hidden="true">{iniciales(nombre)}</div>
      <h2 id={id}>{nombre}</h2>
      <p className="role">{rol}</p>
      <p className="bio">
        {bio} <span className="count">{(seguidores + (on ? 1 : 0)).toLocaleString('de-DE')}</span> seguidores.
      </p>
      <div className="acts">
        <button type="button" aria-pressed={on} onClick={() => setOn(!on)}>
          {on ? 'Siguiendo' : 'Seguir'}
        </button>
        <button type="button" aria-label={`Enviar mensaje a ${nombre}`} onClick={onMensaje}>Mensaje</button>
      </div>
    </article>
  );
}
// CSS: copia las reglas .profile / .avatar / .role / .bio / .acts / button de la pestaña HTML + CSS.
