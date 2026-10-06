import { useEffect, useRef, useState } from 'react';

const MEJORAS = ['Elige día y hora de envío.', 'Añade a quien quieras como destinatario.', 'Exporta en PDF o CSV.'];

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2.5 7.5l3 3 6-7" />
  </svg>
);

export function FeatureAnnouncement({ onTry }: { onTry?: () => void }) {
  const dlg = useRef<HTMLDialogElement>(null);
  const [status, setStatus] = useState('');

  useEffect(() => { dlg.current?.showModal(); }, []);

  return (
    <>
      <button type="button" className="btn" onClick={() => dlg.current?.showModal()}>
        Ver novedades <span className="pill">Nuevo</span>
      </button>
      <p id="st" role="status">{status}</p>
      <dialog
        ref={dlg}
        aria-labelledby="ttl"
        aria-describedby="desc"
        onClick={(e) => e.target === dlg.current && dlg.current?.close()}
        onClose={(e) => {
          const probar = e.currentTarget.returnValue === 'try';
          setStatus(probar ? 'Abriendo informes programados.' : '');
          if (probar) onTry?.();
          e.currentTarget.returnValue = '';
        }}
      >
        <figure>
          <svg viewBox="0 0 440 150" aria-hidden="true">
            <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
            <rect width="440" height="150" style={{ fill: 'var(--accent-soft)' }} />
            <g transform="translate(56 24)">
              <rect width="170" height="104" rx="8" style={{ fill: 'var(--surface)', stroke: 'var(--border)' }} />
              <rect x="18" y="58" width="22" height="30" rx="3" style={{ fill: 'var(--accent-soft)' }} />
              <rect x="50" y="42" width="22" height="46" rx="3" style={{ fill: 'var(--accent-soft)' }} />
              <rect x="82" y="26" width="22" height="62" rx="3" fill="url(#g)" />
              <rect x="114" y="48" width="22" height="40" rx="3" style={{ fill: 'var(--accent-soft)' }} />
            </g>
            <path d="M226 76h24" fill="none" style={{ stroke: 'var(--accent)', strokeDasharray: '3 3' }} />
            <g transform="translate(250 44)">
              <rect width="134" height="64" rx="8" style={{ fill: 'var(--surface)', stroke: 'var(--border)' }} />
              <circle cx="26" cy="32" r="12" fill="url(#g)" />
              <text x="46" y="48" fontSize="11" style={{ fill: 'var(--muted)' }}>Lunes, 08:00</text>
            </g>
          </svg>
        </figure>
        <button type="button" className="x" aria-label="Cerrar" onClick={() => dlg.current?.close()}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M3 3l8 8M11 3l-8 8" /></svg>
        </button>
        <div className="body">
          <span className="pill">Novedad</span>
          <h2 id="ttl">Informes programados</h2>
          <p id="desc">Recibe tus paneles por correo sin abrir la aplicación.</p>
          <ul>{MEJORAS.map((m) => <li key={m}><Check />{m}</li>)}</ul>
        </div>
        <form method="dialog">
          <button className="btn" value="later">Más tarde</button>
          <button className="btn main" value="try" autoFocus>Probar ahora</button>
        </form>
      </dialog>
    </>
  );
}

// CSS: copia las reglas .btn, .pill, dialog, ::backdrop, figure, .x, .body, ul y form de la pestaña HTML + CSS.
