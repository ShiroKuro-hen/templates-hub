<script setup lang="ts">
import { computed, reactive } from 'vue';

type Addon = { id: string; nombre: string; detalle: string; precio: number; bloque?: boolean };
type Estado = { on: boolean; qty: number };

const BASE = 24;
const MAX = 10;
const ADDONS: Addon[] = [
  { id: 'soporte', nombre: 'Soporte prioritario', detalle: 'Respuesta en una hora por chat y teléfono', precio: 9 },
  { id: 'almacen', nombre: 'Almacenamiento extra', detalle: 'Bloques de 100 GB', precio: 4, bloque: true },
  { id: 'auditoria', nombre: 'Registro de auditoría', detalle: 'Historial completo de accesos', precio: 6 },
  { id: 'correo', nombre: 'Correo con tu dominio', detalle: 'Buzones ilimitados', precio: 3 },
  { id: 'copias', nombre: 'Copias cada hora', detalle: 'Restauración en un clic', precio: 5 },
];
const eur = new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' });

const sel = reactive<Record<string, Estado>>({
  soporte: { on: true, qty: 1 },
  almacen: { on: true, qty: 2 },
  auditoria: { on: true, qty: 1 },
  correo: { on: false, qty: 1 },
  copias: { on: false, qty: 1 },
});

const activos = computed(() =>
  ADDONS.filter((a) => sel[a.id].on).map((a) => ({ ...a, cantidad: sel[a.id].qty, importe: a.precio * sel[a.id].qty })),
);
const complementos = computed(() => activos.value.reduce((s, a) => s + a.importe, 0));
const subtotal = computed(() => BASE + complementos.value);
const descuento = computed(() => (activos.value.length >= 3 ? complementos.value * 0.1 : 0));
const total = computed(() => subtotal.value - descuento.value);
</script>

<template>
  <main class="shop">
    <article class="plan" aria-labelledby="plan-t">
      <header class="plan-head">
        <p class="eyebrow">Plan elegido</p>
        <h2 id="plan-t">Equipo</h2>
        <p class="desc">Para equipos que trabajan a diario en el mismo espacio.</p>
        <p class="base"><strong>24 €</strong> al mes, hasta 10 personas</p>
      </header>
      <ul class="incl">
        <li>Proyectos ilimitados</li>
        <li>20 GB de almacenamiento</li>
        <li>Informes y automatizaciones</li>
      </ul>
      <fieldset class="addons">
        <legend>Complementos opcionales</legend>
        <div v-for="a in ADDONS" :key="a.id" class="addon">
          <label class="pick">
            <input v-model="sel[a.id].on" type="checkbox">
            <span class="txt"><b>{{ a.nombre }}</b><small>{{ a.detalle }}</small></span>
          </label>
          <span class="pr">{{ eur.format(a.precio) }} <span>/mes</span></span>
          <div v-if="a.bloque" class="step" role="group" aria-label="Bloques de 100 GB">
            <button
              type="button"
              aria-label="Quitar un bloque de 100 GB"
              :disabled="!sel[a.id].on || sel[a.id].qty === 1"
              @click="sel[a.id].qty -= 1"
            >
              −
            </button>
            <span class="qty">{{ sel[a.id].qty }}</span>
            <button
              type="button"
              aria-label="Añadir un bloque de 100 GB"
              :disabled="!sel[a.id].on || sel[a.id].qty === MAX"
              @click="sel[a.id].qty += 1"
            >
              +
            </button>
          </div>
        </div>
      </fieldset>
    </article>

    <aside class="sum" aria-labelledby="sum-t">
      <h2 id="sum-t">Resumen del pedido</h2>
      <dl>
        <div><dt>Plan Equipo</dt><dd>{{ eur.format(BASE) }}</dd></div>
        <div v-for="a in activos" :key="a.id">
          <dt>{{ a.cantidad > 1 ? `${a.nombre} × ${a.cantidad}` : a.nombre }}</dt>
          <dd>{{ eur.format(a.importe) }}</dd>
        </div>
        <div class="sub"><dt>Subtotal</dt><dd>{{ eur.format(subtotal) }}</dd></div>
        <div v-if="descuento > 0"><dt>Descuento 10 % (3 o más complementos)</dt><dd>{{ eur.format(-descuento) }}</dd></div>
      </dl>
      <p class="total">
        <span>Total al mes</span>
        <output>{{ eur.format(total) }}</output>
      </p>
      <button type="button" class="buy">Contratar Equipo</button>
      <p class="note">IVA no incluido. Cancela cuando quieras.</p>
    </aside>
  </main>
</template>

<style scoped>
.shop { max-width: 880px; margin: 0 auto; display: grid; gap: 16px; align-items: start; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
@media (min-width: 760px) { .shop { grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr); } }
.plan, .sum { padding: 24px; display: grid; gap: 18px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
@media (min-width: 760px) { .sum { position: sticky; top: 20px; } }
.plan-head { display: grid; gap: 4px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }
.eyebrow { margin: 0; font-size: 12px; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; color: var(--accent); }
h2 { margin: 0; font-size: 22px; letter-spacing: -.01em; }
.sum h2 { font-size: 18px; }
.desc { margin: 0; color: var(--muted); }
.base { display: flex; align-items: baseline; flex-wrap: wrap; gap: 8px; margin: 8px 0 0; color: var(--muted); }
.base strong { font-size: 32px; line-height: 1; color: var(--text); font-variant-numeric: tabular-nums; }
.incl { display: flex; flex-wrap: wrap; gap: 6px 16px; margin: 0; padding: 0; list-style: none; color: var(--muted); font-size: 13px; }
.incl li::before { content: "✓ "; color: var(--ok); font-weight: 700; }
.addons { margin: 0; padding: 0; border: 0; min-width: 0; display: grid; gap: 8px; }
legend { padding: 0; margin-bottom: 4px; font-weight: 600; }
.addon { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 12px; padding: 12px; border: 1px solid var(--border); border-radius: min(var(--radius), 6px); background: var(--surface); }
.addon:has(input:checked) { border-color: var(--accent); background: var(--accent-soft); }
.pick { flex: 1 1 200px; display: flex; align-items: flex-start; gap: 10px; min-width: 0; cursor: pointer; }
.pick input { flex: none; width: 18px; height: 18px; margin: 3px 0 0; accent-color: var(--accent); }
.txt { flex: 1; display: grid; min-width: 0; }
.txt small { color: var(--muted); font-size: 12px; }
.pr { font-weight: 600; font-variant-numeric: tabular-nums; white-space: nowrap; }
.pr span { font-weight: 400; color: var(--muted); font-size: 12px; }
.step { display: inline-flex; align-items: center; gap: 4px; }
.step button { width: 30px; height: 30px; font: 600 16px/1 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); background: var(--surface); border: 1px solid var(--border); border-radius: min(var(--radius), 6px); cursor: pointer; }
.step button:hover:not(:disabled) { border-color: var(--accent); }
.step button:disabled { opacity: .4; cursor: not-allowed; }
.qty { min-width: 28px; text-align: center; font-weight: 600; font-variant-numeric: tabular-nums; }
dl { margin: 0; display: grid; gap: 10px; }
dl div { display: flex; justify-content: space-between; gap: 12px; }
dt { color: var(--muted); }
dd { margin: 0; font-variant-numeric: tabular-nums; }
.sub { padding-top: 10px; border-top: 1px solid var(--border); }
.total { display: flex; justify-content: space-between; align-items: baseline; margin: 0; padding-top: 12px; border-top: 2px solid var(--text); }
.total output { font-size: 26px; font-weight: 700; font-variant-numeric: tabular-nums; }
.buy { padding: 11px 16px; font: 600 15px system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--accent-ink); background: var(--accent); border: 0; border-radius: var(--radius); cursor: pointer; }
.buy:hover { filter: brightness(1.06); }
.note { margin: 0; color: var(--muted); font-size: 12px; text-align: center; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
