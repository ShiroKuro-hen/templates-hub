import { useEffect, useRef, useState } from 'react';

const HEART = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';
const Heart = () => <svg className="heart" viewBox="0 0 24 24" aria-hidden="true"><path d={HEART} /></svg>;

export function WishlistButton({ product = 'Reloj Orbit S2', price = '149,00 €', initial = 248 }: { product?: string; price?: string; initial?: number }) {
  const [on, setOn] = useState(false);
  const [msg, setMsg] = useState('');
  const timer = useRef<number>();
  const pill = useRef<HTMLButtonElement>(null);
  const n = initial + +on;
  const label = `Guardar ${product} en favoritos`;

  function toggle(quiet = false) {
    const next = !on;
    setOn(next);
    window.clearTimeout(timer.current);
    if (quiet) return setMsg('');
    setMsg(next ? 'Añadido a tus favoritos.' : 'Quitado de tus favoritos.');
    timer.current = window.setTimeout(() => setMsg(''), 4000);
  }
  useEffect(() => {
    const esc = (e: KeyboardEvent) => e.key === 'Escape' && setMsg('');
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('keydown', esc); window.clearTimeout(timer.current); };
  }, []);

  return (
    <article className="card">
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#22d3ee" /><stop offset="1" stopColor="#2f5bff" /></linearGradient></defs>
      </svg>
      <div className="img" aria-hidden="true" />
      <button className="fab" type="button" aria-pressed={on} aria-label={label} onClick={() => toggle()}><Heart /></button>
      <div className="info">
        <h2>{product}</h2>
        <p className="price">{price}</p>
        <button ref={pill} className="pill" type="button" aria-pressed={on} aria-label={label} onClick={() => toggle()}>
          <Heart /><span>{on ? 'Guardado' : 'Guardar'}</span><b>{n}</b>
        </button>
      </div>
      <div className="toast" role="status" hidden={!msg}>
        <span>{msg}</span>
        <button type="button" onClick={() => { toggle(true); pill.current?.focus(); }}>Deshacer</button>
      </div>
    </article>
  );
}

// CSS: copia las reglas .card, .img, .info, .heart, .fab, .pill, .toast y @keyframes de la pestaña HTML + CSS.
