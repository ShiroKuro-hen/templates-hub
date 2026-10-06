import { ReactNode, useState } from 'react';

type Person = { name: string; action: string };
type Props = { people?: Person[]; title?: string; text?: string };

const PEOPLE: Person[] = [
  { name: 'Ana P.', action: 'Reservó el taller' },
  { name: 'Luis G.', action: 'Dejó una reseña' },
  { name: 'Marta R.', action: 'Pidió un cambio' },
];

const Sk = ({ className = '' }: { className?: string }) => <span className={`sk ${className}`} />;

function Region({ loading, skeleton, children }: { loading: boolean; skeleton: ReactNode; children: ReactNode }) {
  return loading ? <div aria-hidden="true" style={{ display: 'contents' }}>{skeleton}</div> : <>{children}</>;
}

export function SkeletonDemo({ people = PEOPLE, title = 'Cerámica de otoño', text = 'Taller de 3 horas con arcilla local.' }: Props) {
  const [loading, setLoading] = useState(true);

  return (
    <>
      <button className="btn" type="button" onClick={() => setLoading(!loading)}>
        {loading ? 'Mostrar contenido' : 'Volver a cargar'}
      </button>
      <p className="sr" aria-live="polite">{loading ? 'Cargando contenido' : 'Contenido cargado'}</p>
      <div className="grid" aria-busy={loading}>
        <article className="box">
          <Region loading={loading} skeleton={<><Sk className="media" /><div className="pad"><Sk className="title" /><Sk className="line" /><Sk className="line w60" /></div></>}>
            <div className="real"><div className="media" /><div className="pad"><h3>{title}</h3><p>{text}</p></div></div>
          </Region>
        </article>
        <ul className="box" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
          {people.map((p) => (
            <li className="row" key={p.name}>
              <Region loading={loading} skeleton={<><Sk className="avatar" /><div><Sk className="line" /><Sk className="line w60" /></div></>}>
                <div className="real" style={{ display: 'contents' }}>
                  <span className="avatar">{p.name[0]}</span>
                  <div><strong>{p.name}</strong><p>{p.action}</p></div>
                </div>
              </Region>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
// CSS: copia las reglas .sk / .box / .pad / .media / .line / .title / .row / .avatar / .real / .btn / .grid / .sr y @keyframes shimmer de la pestaña HTML + CSS.
