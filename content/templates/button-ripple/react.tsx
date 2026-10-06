import { useState, type MouseEvent } from 'react';

type Estado = 'idle' | 'loading' | 'done';
const LABEL: Record<Estado, string> = { idle: 'Guardar cambios', loading: 'Guardando…', done: 'Guardado' };
const calm = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches;

// Onda en el punto de la pulsación (centrada si se activa con teclado: detail === 0).
function ripple(e: MouseEvent<HTMLButtonElement>) {
  if (calm) return;
  const b = e.currentTarget, r = b.getBoundingClientRect(), d = Math.max(r.width, r.height) * 2;
  const x = e.detail ? e.clientX - r.left : r.width / 2, y = e.detail ? e.clientY - r.top : r.height / 2;
  const s = document.createElement('span');
  s.className = 'ripple';
  Object.assign(s.style, { width: `${d}px`, height: `${d}px`, left: `${x - d / 2}px`, top: `${y - d / 2}px` });
  b.append(s);
  s.animate([{ transform: 'scale(0)', opacity: 0.3 }, { transform: 'scale(1)', opacity: 0 }], { duration: 600, easing: 'ease-out' })
    .finished.then(() => s.remove());
}

export function RippleButton({ onSave }: { onSave?: () => void }) {
  const [estado, setEstado] = useState<Estado>('idle');
  const [aviso, setAviso] = useState('');

  const guardar = (e: MouseEvent<HTMLButtonElement>) => {
    ripple(e);
    if (estado !== 'idle') return;
    setEstado('loading');
    setTimeout(() => {
      onSave?.();
      setEstado('done');
      setAviso('Cambios guardados.');
      setTimeout(() => { setEstado('idle'); setAviso(''); }, 1800);
    }, calm ? 300 : 900);
  };

  return (
    <main className="card">
      <h1>Preferencias de notificación</h1>
      <p>Recibe un aviso por correo cuando termine de generarse un informe.</p>
      <div className="actions">
        <button className="btn primary" type="button" data-state={estado} aria-busy={estado === 'loading'} onClick={guardar}>
          <svg className="ico spin" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" pathLength={1} /></svg>
          <svg className="ico check" viewBox="0 0 24 24" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5" pathLength={1} /></svg>
          <span className="lbl">{LABEL[estado]}</span>
        </button>
        <button className="btn" type="button" onClick={ripple}>Restablecer</button>
      </div>
      <p className="live" role="status">{aviso}</p>
    </main>
  );
}

// CSS: copia las reglas .card, .btn, .primary, .ripple, .ico, [data-state] y @keyframes de la pestaña HTML + CSS.
