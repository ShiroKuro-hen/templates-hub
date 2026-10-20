<script setup lang="ts">
// Inclina la tarjeta según el cursor y mueve el reflejo; ignora táctil y movimiento reducido.
function tilt(e: PointerEvent) {
  if (e.pointerType !== 'mouse' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const el = e.currentTarget as HTMLElement;
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
function reset(e: PointerEvent) {
  const el = e.currentTarget as HTMLElement;
  el.style.transition = '';
  el.style.setProperty('--rx', '0deg');
  el.style.setProperty('--ry', '0deg');
}
</script>

<template>
  <main class="stage">
    <article class="tilt" @pointermove="tilt" @pointerleave="reset">
      <div class="media">
        <svg viewBox="0 0 120 120" role="img" aria-label="Auriculares inalámbricos">
          <defs>
            <linearGradient id="tilt-g" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stop-color="var(--accent-2,#22d3ee)" />
              <stop offset="1" stop-color="var(--accent,#2f5bff)" />
            </linearGradient>
          </defs>
          <path d="M22 70V60a38 38 0 0 1 76 0v10" fill="none" stroke="url(#tilt-g)" stroke-width="7" stroke-linecap="round" />
          <rect x="14" y="64" width="22" height="36" rx="8" fill="currentColor" />
          <rect x="84" y="64" width="22" height="36" rx="8" fill="currentColor" />
        </svg>
      </div>
      <div class="body">
        <h3>Auriculares Aura 2</h3>
        <p class="sub">Cancelación de ruido, 40 h de batería</p>
        <div class="buy">
          <p class="price">149 €</p>
          <button type="button" class="btn">Añadir al carrito</button>
        </div>
      </div>
    </article>
  </main>
</template>

<style scoped>
.stage{--ease:cubic-bezier(.2,.7,.2,1);display:grid;place-items:center;padding:32px 16px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.tilt{position:relative;overflow:hidden;width:280px;max-width:100%;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);transform:perspective(800px) rotateX(var(--rx)) rotateY(var(--ry));transition:--rx .4s var(--ease),--ry .4s var(--ease)}
.tilt>*{position:relative}
.tilt::after{content:"";position:absolute;inset:0;background:radial-gradient(circle at var(--gx,50%) var(--gy,50%),rgba(255,255,255,.28),transparent 55%);opacity:0;transition:opacity .4s var(--ease);pointer-events:none}
@media (hover:hover){.tilt:hover::after{opacity:1}}
@property --rx{syntax:'<angle>';inherits:false;initial-value:0deg}
@property --ry{syntax:'<angle>';inherits:false;initial-value:0deg}
.media{display:grid;place-items:center;aspect-ratio:4/3;background:var(--accent-soft);border-bottom:1px solid var(--border);color:var(--accent)}
.media svg{width:46%;height:auto}
.body{padding:16px}
h3{margin:0 0 4px;font-size:16px;line-height:1.3}
.sub{margin:0 0 12px;color:var(--muted)}
.buy{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.price{margin:0;font-size:20px;font-weight:700;font-variant-numeric:tabular-nums}
.btn{font:inherit;font-weight:600;padding:8px 14px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--accent-ink);cursor:pointer;transition:filter .14s}
.btn:hover{filter:brightness(1.08)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
