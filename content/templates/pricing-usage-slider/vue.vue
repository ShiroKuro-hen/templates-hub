<script setup lang="ts">
import { computed, ref, watch } from 'vue';

type Tier = { name: string; hasta: number; precio: number };

const TIERS: Tier[] = [
  { name: 'Inicio', hasta: 10, precio: 12 },
  { name: 'Crecimiento', hasta: 50, precio: 10 },
  { name: 'Equipo', hasta: 200, precio: 8 },
  { name: 'Escala', hasta: 500, precio: 6 },
];
const ANUAL = 0.8;
const money = new Intl.NumberFormat('es-ES', { maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

const tierOf = (n: number): Tier => TIERS.find((t) => n <= t.hasta) ?? TIERS[TIERS.length - 1];

function cuota(n: number): number {
  let desde = 0;
  return TIERS.reduce((sum, t) => {
    const enTramo = Math.max(0, Math.min(n, t.hasta) - desde);
    desde = t.hasta;
    return sum + enTramo * t.precio;
  }, 0);
}

const users = ref(25);
const annual = ref(false);
const bruto = computed(() => cuota(users.value));
const mes = computed(() => (annual.value ? bruto.value * ANUAL : bruto.value));
const tier = computed(() => tierOf(users.value));
const ahorro = computed(() => money.format(Math.round(bruto.value * (1 - ANUAL) * 12)));
const resumen = computed(
  () => `Precio ${annual.value ? 'anual' : 'mensual'}: US$${money.format(Math.round(mes.value))} al mes para ${users.value} usuarios. Tramo ${tier.value.name}.`,
);

const shown = ref(mes.value);
let raf = 0;
watch(mes, (to) => {
  cancelAnimationFrame(raf);
  const from = shown.value;
  const t0 = performance.now();
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const frame = (now: number) => {
    const k = reduce ? 1 : Math.min(1, (now - t0) / 320);
    shown.value = from + (to - from) * (1 - (1 - k) ** 3);
    if (k < 1) raf = requestAnimationFrame(frame);
  };
  frame(t0);
});
const mostrado = computed(() => money.format(Math.round(shown.value)));
</script>

<template>
  <section class="calc" aria-labelledby="usage-title">
    <header class="top">
      <h2 id="usage-title">Calcula tu plan</h2>
      <div class="billing">
        <span :class="['lbl', { on: !annual }]">Mensual</span>
        <button
          type="button"
          class="switch"
          role="switch"
          :aria-checked="String(annual)"
          aria-label="Facturación anual"
          @click="annual = !annual"
        />
        <span :class="['lbl', { on: annual }]">Anual</span>
      </div>
    </header>

    <div class="usage">
      <div class="usage-head">
        <label for="u">Usuarios activos</label>
        <span class="count" aria-hidden="true">{{ users }}</span>
      </div>
      <input
        id="u"
        v-model.number="users"
        type="range"
        min="1"
        max="500"
        step="1"
        :aria-valuetext="`${users} ${users === 1 ? 'usuario' : 'usuarios'}`"
        :style="{ '--p': `${((users - 1) / 499) * 100}%` }"
      >
      <div class="ends" aria-hidden="true"><span>1</span><span>500</span></div>
      <ol class="tiers" aria-hidden="true">
        <li v-for="(t, i) in TIERS" :key="t.name" :class="{ on: t === tier }">
          <b>{{ t.name }}</b>{{ i ? TIERS[i - 1].hasta + 1 : 1 }}–{{ t.hasta }} · US${{ t.precio }}
        </li>
      </ol>
    </div>

    <div class="result">
      <p class="tramo">Tramo <b>{{ tier.name }}</b></p>
      <p class="price" aria-hidden="true">US${{ mostrado }}</p>
      <p class="unit">{{ annual ? 'al mes, facturado al año' : 'al mes, facturado cada mes' }}</p>
      <p class="meta">
        <span>US${{ cents.format(mes / users) }} por usuario al mes</span>
        <span class="save">{{ annual ? `Ahorras US$${ahorro} al año` : `Con anual ahorrarías US$${ahorro}` }}</span>
      </p>
      <p class="sr" aria-live="polite">{{ resumen }}</p>
    </div>
  </section>
</template>

<style scoped>
.calc { max-width: 560px; margin: 0 auto; padding: 24px; display: grid; gap: 22px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
.top { display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap; }
h2 { margin: 0; font-size: 18px; letter-spacing: -.01em; }
.billing { display: flex; align-items: center; gap: 8px; color: var(--muted); font-size: 13px; }
.lbl.on { color: var(--text); font-weight: 600; }
.switch { position: relative; width: 44px; height: 24px; padding: 0; border: 0; border-radius: 999px; background: var(--border); cursor: pointer; transition: background .2s; }
.switch::after { content: ""; position: absolute; top: 3px; left: 3px; width: 18px; height: 18px; border-radius: 50%; background: var(--surface); box-shadow: var(--shadow); transition: transform .2s; }
.switch[aria-checked="true"] { background: var(--accent); }
.switch[aria-checked="true"]::after { transform: translateX(20px); }
.usage { display: grid; gap: 12px; }
.usage-head { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
.usage-head label { font-weight: 600; }
.count { font-size: 26px; font-weight: 700; color: var(--accent); font-variant-numeric: tabular-nums; }
input[type="range"] { --p: 5%; -webkit-appearance: none; appearance: none; display: block; width: 100%; height: 28px; margin: 0; background: transparent; cursor: pointer; }
input[type="range"]::-webkit-slider-runnable-track { height: 10px; border-radius: 999px; background: linear-gradient(135deg, var(--accent-2,#22d3ee), var(--accent,#2f5bff)) 0 / var(--p) 100% no-repeat, var(--border); }
input[type="range"]::-moz-range-track { height: 10px; border-radius: 999px; background: var(--border); }
input[type="range"]::-moz-range-progress { height: 10px; border-radius: 999px; background: linear-gradient(135deg, var(--accent-2,#22d3ee), var(--accent,#2f5bff)); }
input[type="range"]::-webkit-slider-thumb { -webkit-appearance: none; width: 24px; height: 24px; margin-top: -7px; border-radius: 50%; background: var(--surface); border: 3px solid var(--accent); box-shadow: var(--shadow); }
input[type="range"]::-moz-range-thumb { width: 18px; height: 18px; border-radius: 50%; background: var(--surface); border: 3px solid var(--accent); box-shadow: var(--shadow); }
input[type="range"]:focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; border-radius: 999px; }
.ends { display: flex; justify-content: space-between; color: var(--muted); font-size: 12px; font-variant-numeric: tabular-nums; }
.tiers { display: grid; grid-template-columns: repeat(4, 1fr); gap: 6px; margin: 0; padding: 0; list-style: none; color: var(--muted); font-size: 12px; line-height: 1.35; }
.tiers li { padding: 8px; border: 1px solid var(--border); border-radius: min(var(--radius), 6px); }
.tiers b { display: block; font-weight: 600; color: var(--text); }
.tiers li.on { border-color: var(--accent); background: var(--accent-soft); }
.result { display: grid; gap: 4px; padding-top: 18px; border-top: 1px solid var(--border); }
.tramo { margin: 0; color: var(--muted); }
.price { margin: 4px 0 0; font-size: clamp(44px, 12vw, 60px); line-height: 1; font-weight: 800; letter-spacing: -.03em; font-variant-numeric: tabular-nums; background: linear-gradient(135deg, var(--accent-2,#22d3ee), var(--accent,#2f5bff)); -webkit-background-clip: text; background-clip: text; color: transparent; }
.unit { margin: 0; color: var(--muted); }
.meta { display: flex; flex-wrap: wrap; gap: 8px; align-items: center; margin: 8px 0 0; color: var(--muted); }
.save { padding: 4px 10px; border-radius: 999px; background: var(--ok-soft); color: var(--ok); font-size: 12px; font-weight: 600; }
.sr { position: absolute; width: 1px; height: 1px; overflow: hidden; clip-path: inset(50%); white-space: nowrap; }
:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
@media (max-width: 480px) { .tiers { grid-template-columns: repeat(2, 1fr); } }
@media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
