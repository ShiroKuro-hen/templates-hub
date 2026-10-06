<script setup lang="ts">
import { computed, ref } from 'vue';

type Line = { id: number; name: string; variant: string; price: number; qty: number };
const props = withDefaults(defineProps<{ freeShipping?: number }>(), { freeShipping: 200 });
const items = ref<Line[]>([
  { id: 1, name: 'Auriculares Nova ANC', variant: 'Grafito', price: 129.9, qty: 1 },
  { id: 2, name: 'Cable USB-C trenzado', variant: '2 m', price: 14.5, qty: 2 },
  { id: 3, name: 'Funda de viaje rígida', variant: 'Azul noche', price: 24, qty: 1 },
]);
const dlg = ref<HTMLDialogElement>();
const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });
const total = computed(() => items.value.reduce((s, i) => s + i.price * i.qty, 0));
const count = computed(() => items.value.reduce((s, i) => s + i.qty, 0));
const pct = computed(() => Math.min(100, (total.value / props.freeShipping) * 100));
const setQty = (i: Line, d: number) => { i.qty = Math.max(1, i.qty + d); };
const remove = (id: number) => { items.value = items.value.filter((i) => i.id !== id); };
</script>

<template>
  <button class="btn" type="button" aria-haspopup="dialog" @click="dlg?.showModal()">Ver carrito ({{ count }})</button>
  <dialog ref="dlg" class="drawer" aria-labelledby="cart-title" @click="$event.target === dlg && dlg?.close()">
    <header>
      <h2 id="cart-title">Tu carrito</h2>
      <button class="close" type="button" aria-label="Cerrar carrito" @click="dlg?.close()">&times;</button>
    </header>
    <div class="shipbox">
      <p class="ship">{{ total >= freeShipping ? 'Tienes envío gratis.' : `Te faltan ${eur(freeShipping - total)} para el envío gratis.` }}</p>
      <div class="meter" aria-hidden="true"><i :style="{ width: pct + '%' }" /></div>
    </div>
    <ul aria-live="polite">
      <li v-if="!items.length" class="empty">Tu carrito está vacío. Explora el catálogo y añade tu primer producto.</li>
      <li v-for="i in items" :key="i.id">
        <span class="thumb" aria-hidden="true" />
        <div>
          <div class="name">{{ i.name }}</div>
          <div class="var">{{ i.variant }}</div>
          <div class="qty" role="group" :aria-label="`Cantidad de ${i.name}`">
            <button type="button" aria-label="Quitar una unidad" @click="setQty(i, -1)">−</button>
            <output>{{ i.qty }}</output>
            <button type="button" aria-label="Añadir una unidad" @click="setQty(i, 1)">+</button>
          </div>
        </div>
        <div>
          <div class="sub num">{{ eur(i.price * i.qty) }}</div>
          <button class="rm" type="button" @click="remove(i.id)">Eliminar</button>
        </div>
      </li>
    </ul>
    <footer>
      <div class="row"><span>Subtotal</span><span class="num">{{ eur(total) }}</span></div>
      <button class="btn primary" type="button">Ir al pago</button>
    </footer>
  </dialog>
</template>

<style scoped>
button{font:inherit;color:inherit;cursor:pointer}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.btn{padding:8px 14px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);transition:background .14s}
.btn:hover{background:var(--accent-soft)}
.primary{background:var(--accent);color:var(--accent-ink);border-color:var(--accent);width:100%;font-weight:600}
.primary:hover{background:var(--accent);filter:brightness(1.08)}
.drawer{margin:0 0 0 auto;height:100dvh;max-height:none;width:min(400px,100vw);box-sizing:border-box;padding:0;border:0;border-left:1px solid var(--border);background:var(--surface);color:var(--text);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.drawer[open]{display:flex;flex-direction:column;animation:in .16s ease-out}
.drawer::backdrop{background:rgba(14,23,38,.4)}
@keyframes in{from{transform:translateX(24px);opacity:0}}
header,footer{padding:16px 20px}
header{display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid var(--border)}
header h2{margin:0;font-size:16px}
.close{border:0;background:none;font-size:20px;line-height:1;padding:4px 8px;border-radius:var(--radius)}
.shipbox{padding:12px 20px;border-bottom:1px solid var(--border)}
.ship{margin:0;color:var(--muted);font-size:13px}
.meter{height:4px;margin-top:6px;border-radius:999px;background:var(--accent-soft);overflow:hidden}
.meter i{display:block;height:100%;background:linear-gradient(135deg,#22d3ee,#2f5bff);transition:width .16s}
ul{list-style:none;margin:0;padding:0 20px;flex:1;overflow:auto}
li{display:grid;grid-template-columns:48px 1fr auto;gap:12px;padding:16px 0;border-bottom:1px solid var(--border)}
.thumb{width:48px;height:48px;border-radius:var(--radius);background:var(--accent-soft);border:1px solid var(--border)}
.name{font-weight:600}.var{color:var(--muted);font-size:13px}
.qty{display:inline-flex;align-items:center;margin-top:8px;border:1px solid var(--border);border-radius:var(--radius)}
.qty button{border:0;background:none;width:28px;height:28px}
.qty output{min-width:24px;text-align:center}
.sub{text-align:right;font-weight:600}
.rm{display:block;margin-top:8px;margin-left:auto;border:0;background:none;color:var(--muted);font-size:13px;text-decoration:underline}
.num,output{font-variant-numeric:tabular-nums}
footer{border-top:1px solid var(--border)}
.row{display:flex;justify-content:space-between;margin-bottom:12px;font-size:16px;font-weight:600}
.empty{display:block;padding:40px 20px;text-align:center;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
