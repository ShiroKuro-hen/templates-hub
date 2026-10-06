import { useEffect, useState } from 'react';

type Props = { titulo?: string; descripcion?: string };

export function BlurUpImage({
  titulo = 'Sierra de Ion al amanecer',
  descripcion = 'Sierra de Ion al amanecer: montañas azules con cumbres nevadas y un sol dorado',
}: Props) {
  const [pct, setPct] = useState(0);
  const ready = pct >= 100;

  // Carga simulada: sube el progreso a saltos hasta llegar a 100.
  useEffect(() => {
    if (ready) return;
    const id = setTimeout(() => setPct((p) => Math.min(100, p + 8 + Math.random() * 14)), 180);
    return () => clearTimeout(id);
  }, [pct, ready]);

  return (
    <figure className={ready ? 'ready' : undefined} aria-busy={!ready}>
      <div className="frame" role="img" aria-label={descripcion}>
        <svg className="ph" viewBox="0 0 16 10" preserveAspectRatio="none" aria-hidden="true">
          <rect className="bg" width="16" height="10" /><circle className="sun" cx="11.5" cy="3" r="1.6" />
          <path className="far" d="M0 10V6l3-3 3 3 2-2 8 6z" /><path className="near" d="M0 10l5-2 5 1 6-1v2z" />
        </svg>
        <svg className="full" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect className="bg" width="160" height="100" /><circle className="halo" cx="112" cy="30" r="20" /><circle className="sun" cx="112" cy="30" r="12" />
          <path className="far" d="M0 74 24 40l16 18 22-34 30 38 18-16 50 40V100H0z" />
          <path className="snow" d="M62 24 53 37l4-2 5 4 5-4 4 2zM24 40 17 50l3-2 4 3 4-3 3 2z" />
          <path className="mid" d="M0 84q30-18 62-4t58-6 40 8V100H0z" /><path className="near" d="M0 94q40-14 80-4t80-6V100H0z" />
        </svg>
        <progress max={100} value={pct} aria-label="Progreso de carga" />
      </div>
      <figcaption>
        <div>
          <b>{titulo}</b>
          <span className="st"><span role="status">{ready ? 'Imagen cargada' : 'Cargando imagen'}</span> {Math.round(pct)} %</span>
        </div>
        <button type="button" className="btn" disabled={!ready} onClick={() => setPct(0)}>Volver a cargar</button>
      </figcaption>
    </figure>
  );
}

// CSS: copia las reglas figure, .frame, .ph, .full, .ready, progress, figcaption y .btn de la pestaña HTML + CSS.
