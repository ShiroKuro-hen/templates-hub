import type { PointerEvent } from 'react';

// Inclina la tarjeta según el cursor y mueve el reflejo; ignora táctil y movimiento reducido.
function tilt(e: PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  const x = (e.clientX - r.left) / r.width;
  const y = (e.clientY - r.top) / r.height;
  el.style.transition = 'none';
  el.style.setProperty('--ry', `${(x - 0.5) * 16}deg`);
  el.style.setProperty('--rx', `${(0.5 - y) * 14}deg`);
  el.style.setProperty('--gx', `${x * 100}%`);
  el.style.setProperty('--gy', `${y * 100}%`);
}

// Devuelve la tarjeta a su posición; la transición CSS la suaviza.
function reset(e: PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  el.style.transition = '';
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
}

export function Tilt3dCard() {
  return (
    <main className="stage">
      <article className="tilt" onPointerMove={tilt} onPointerLeave={reset}>
        <div className="media">
          <svg viewBox="0 0 120 120" role="img" aria-label="Auriculares inalámbricos">
            <defs>
              <linearGradient id="tilt-g" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="var(--accent-2,#22d3ee)" />
                <stop offset="1" stopColor="var(--accent,#2f5bff)" />
              </linearGradient>
            </defs>
            <path d="M22 70V60a38 38 0 0 1 76 0v10" fill="none" stroke="url(#tilt-g)" strokeWidth="7" strokeLinecap="round" />
            <rect x="14" y="64" width="22" height="36" rx="8" fill="currentColor" />
            <rect x="84" y="64" width="22" height="36" rx="8" fill="currentColor" />
          </svg>
        </div>
        <div className="body">
          <h3>Auriculares Aura 2</h3>
          <p className="sub">Cancelación de ruido, 40 h de batería</p>
          <div className="buy">
            <p className="price">149 €</p>
            <button type="button" className="btn">Añadir al carrito</button>
          </div>
        </div>
      </article>
    </main>
  );
}

// CSS: copia las reglas .stage, .tilt (con ::after y @property), .media, .body, h3, .sub, .buy, .price, .btn y prefers-reduced-motion de la pestaña HTML + CSS.
