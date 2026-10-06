<script setup lang="ts">
import { ref } from 'vue';

type Product = { nombre: string; detalle: string; precio: number; antes?: number; nota: number; resenas: number };
const props = withDefaults(defineProps<{ p?: Product }>(), {
  p: () => ({ nombre: 'Auriculares Aura 2', detalle: 'Cancelación de ruido, 40 h de batería', precio: 149, antes: 189, nota: 4.5, resenas: 1284 }),
});
const emit = defineEmits<{ add: [] }>();
const eur = (n: number) => new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(n);
const num = (n: number) => n.toLocaleString('es-ES');
const n = ref(0);
function add() { n.value++; emit('add'); }
</script>

<template>
  <article class="product" aria-labelledby="p-title">
    <div class="media">
      <span class="badge">Nuevo</span>
      <svg viewBox="0 0 120 120" role="img" :aria-label="p.nombre">
        <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22d3ee" /><stop offset="1" stop-color="#2f5bff" /></linearGradient></defs>
        <path d="M22 70V60a38 38 0 0 1 76 0v10" fill="none" stroke="url(#g)" stroke-width="7" stroke-linecap="round" />
        <rect x="14" y="64" width="22" height="36" rx="8" fill="currentColor" />
        <rect x="84" y="64" width="22" height="36" rx="8" fill="currentColor" />
      </svg>
    </div>
    <div class="body">
      <h3 id="p-title">{{ p.nombre }}</h3>
      <p class="sub">{{ p.detalle }}</p>
      <div class="rating">
        <span class="stars" :style="{ '--r': `${(props.p.nota / 5) * 100}%` }" role="img" :aria-label="`Valoración: ${num(p.nota)} de 5`" />
        <span aria-hidden="true">{{ num(p.nota) }}</span><span>({{ num(p.resenas) }} reseñas)</span>
      </div>
      <div class="buy">
        <p class="price">
          {{ eur(p.precio) }}<s v-if="p.antes" :aria-label="`Precio anterior ${eur(p.antes)}`">{{ eur(p.antes) }}</s>
        </p>
        <button type="button" class="btn" :data-n="n || undefined" @click="add">
          {{ n ? `Añadir otro (${n} en carrito)` : 'Añadir al carrito' }}
        </button>
      </div>
      <p class="sr" role="status">{{ n ? `Añadido al carrito. Tienes ${n}.` : '' }}</p>
    </div>
  </article>
</template>

<style scoped>
.product{max-width:300px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.media{position:relative;display:grid;place-items:center;aspect-ratio:4/3;background:var(--accent-soft);border-bottom:1px solid var(--border);color:var(--accent)}
.media svg{width:46%;height:auto}
.badge{position:absolute;top:12px;left:12px;padding:2px 10px;border-radius:999px;background:var(--surface);border:1px solid var(--border);font-size:12px;font-weight:500}
.body{padding:16px}
h3{margin:0 0 4px;font-size:16px;line-height:1.3}
.sub{margin:0 0 10px;color:var(--muted)}
.rating{display:flex;align-items:center;gap:6px;margin-bottom:14px;color:var(--muted);font-variant-numeric:tabular-nums}
.stars{--r:90%;width:80px;height:16px;background:linear-gradient(90deg,var(--warn) var(--r),var(--border) var(--r));
       -webkit-mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 1.5l2 4.1 4.5.6-3.3 3.1.8 4.5L8 11.6l-4 2.2.8-4.5L1.5 6.2 6 5.6z'/%3E%3C/svg%3E") 0 0/16px 16px repeat-x;
               mask:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Cpath d='M8 1.5l2 4.1 4.5.6-3.3 3.1.8 4.5L8 11.6l-4 2.2.8-4.5L1.5 6.2 6 5.6z'/%3E%3C/svg%3E") 0 0/16px 16px repeat-x}
.buy{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}
.price{margin:0;font-size:20px;font-weight:700;font-variant-numeric:tabular-nums}
.price s{margin-left:6px;font-size:13px;font-weight:400;color:var(--muted)}
.btn{font:inherit;font-weight:600;padding:8px 14px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--accent-ink);cursor:pointer;transition:filter .14s,background .14s,color .14s}
.btn:hover{filter:brightness(1.08)}
.btn[data-n]{background:var(--ok-soft);border-color:var(--ok);color:var(--text)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
