import { useState } from 'react';

type Props = {
  titulo: string;
  fecha: string;
  lectura: string; // p. ej. "5 min de lectura"
  fondo?: string; // color del placeholder SVG
  onLeer?: () => void;
};

export function MediaCard({ titulo, fecha, lectura, fondo = '#ffd84d', onLeer }: Props) {
  const [guardado, setGuardado] = useState(false);
  const id = `t-${titulo.replace(/\s/g, '-').toLowerCase()}`;

  return (
    <article className="media" aria-labelledby={id}>
      <svg viewBox="0 0 160 90" aria-hidden="true" focusable="false">
        <rect width="160" height="90" fill={fondo} />
        <circle cx="118" cy="30" r="14" fill="#ff5a36" stroke="#17130f" strokeWidth="2" />
        <path d="M0 90V62l34-26 30 28 28-18 68 36z" fill="#17130f" />
        <path d="M0 90V74l30-14 34 16 40-12 56 26z" fill="#1f9d55" stroke="#17130f" strokeWidth="2" />
      </svg>
      <div className="body">
        <h2 id={id}>{titulo}</h2>
        <p className="meta"><span>{fecha}</span><span>{lectura}</span></p>
        <div className="acts">
          <button type="button" className="main" aria-label={`Leer el artículo ${titulo}`} onClick={onLeer}>
            Leer artículo
          </button>
          <button type="button" aria-pressed={guardado} onClick={() => setGuardado(!guardado)}>
            {guardado ? 'Guardado' : 'Guardar'}
          </button>
        </div>
      </div>
    </article>
  );
}
// CSS: copia las reglas .media / .media svg / .body / .meta / .acts / button / .main de la pestaña HTML + CSS.
