<script setup lang="ts">
import { computed, ref } from 'vue';

const items = [
  { name: 'Zapatillas Aero Run', detail: 'Talla 42, 1 unidad', cents: 8990 },
  { name: 'Calcetines técnicos', detail: 'Pack de 3, 2 unidades', cents: 2580 },
  { name: 'Mochila Urban 20 L', detail: 'Gris, 1 unidad', cents: 3900 },
];
const CODES: Record<string, { label: string; off: (s: number) => number }> = {
  ION10: { label: '10 %', off: (s) => Math.round(s * 0.1) },
  BIENVENIDA: { label: '15 €', off: () => 1500 },
};
const FREE_FROM = 15000, SHIP = 690;
const eur = (c: number) => (c / 100).toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

const code = ref<string | null>(null);
const value = ref('');
const msg = ref<{ text: string; kind: '' | 'ok' | 'err' }>({ text: '', kind: '' });
const sub = items.reduce((s, i) => s + i.cents, 0);
const off = computed(() => (code.value ? CODES[code.value].off(sub) : 0));
const ship = computed(() => (sub - off.value >= FREE_FROM ? 0 : SHIP));
const total = computed(() => sub - off.value + ship.value);

function apply() {
  const v = value.value.trim().toUpperCase();
  if (!v) return (msg.value = { text: 'Escribe un código. Por ejemplo, ION10.', kind: 'err' });
  if (!CODES[v]) return (msg.value = { text: `El código ${v} no existe o ha caducado. Revisa que esté bien escrito.`, kind: 'err' });
  code.value = v;
  msg.value = { text: `Código aplicado: ${CODES[v].label} de descuento.`, kind: 'ok' };
}
function remove() { code.value = null; value.value = ''; msg.value = { text: 'Código eliminado.', kind: '' }; }
</script>

<template>
  <section class="card" aria-labelledby="t">
    <h2 id="t">Resumen del pedido</h2>
    <ul>
      <li v-for="i in items" :key="i.name"><span>{{ i.name }}<small>{{ i.detail }}</small></span><span class="num">{{ eur(i.cents) }}</span></li>
    </ul>
    <form novalidate @submit.prevent="apply">
      <label for="code">Código de descuento</label>
      <div class="row">
        <input id="code" v-model="value" autocomplete="off" aria-describedby="msg" :aria-invalid="msg.kind === 'err'">
        <button type="submit">Aplicar</button>
      </div>
      <p :class="['msg', msg.kind]" id="msg" role="status">{{ msg.text }}</p>
    </form>
    <dl>
      <dt>Subtotal</dt><dd>{{ eur(sub) }}</dd>
      <template v-if="code">
        <dt class="save">Descuento {{ code }}<button class="ghost" type="button" @click="remove">Quitar</button></dt>
        <dd class="save">−{{ eur(off) }}</dd>
      </template>
      <dt>Envío</dt><dd>{{ ship ? eur(ship) : 'Gratis' }}</dd>
      <dt>IVA incluido</dt><dd>{{ eur(Math.round((total * 21) / 121)) }}</dd>
    </dl>
    <div class="total"><span>Total</span><output>{{ eur(total) }}</output></div>
    <div class="bar" aria-hidden="true" />
  </section>
</template>

<style scoped>
.card{max-width:380px;padding:20px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0 0 12px;font-size:16px}
ul{list-style:none;margin:0 0 16px;padding:0}
li{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid var(--border)}
li small{display:block;color:var(--muted)}
.num,dd,output{font-variant-numeric:tabular-nums}
label{display:block;font-weight:500}
.row{display:flex;gap:8px;margin-top:4px}
input{flex:1;min-width:0;box-sizing:border-box;padding:8px 10px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius)}
input[aria-invalid=true]{border-color:var(--err)}
button{font:inherit;cursor:pointer;padding:8px 14px;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);transition:background .14s}
button:hover{background:var(--accent-soft)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.msg{min-height:20px;margin:4px 0 12px;font-size:13px;color:var(--muted)}
.msg.err{color:var(--err)} .msg.ok{color:var(--ok)}
dl{margin:0;display:grid;grid-template-columns:1fr auto;gap:8px 12px}
dt{color:var(--muted)} dd{margin:0;text-align:right}
.save{color:var(--ok)}
.total{display:flex;justify-content:space-between;align-items:baseline;margin-top:16px;padding-top:12px;border-top:1px solid var(--border);font-size:18px;font-weight:600}
.bar{height:3px;margin-top:12px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.ghost{margin-left:6px;padding:0 6px;border:0;background:none;color:var(--accent);text-decoration:underline}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
