<script setup lang="ts">
import { computed, reactive } from 'vue';

const series = ['Web', 'App', 'Tienda', 'Partners', 'Teléfono', 'Marketplace'];
const data: Record<string, number[]> = {
  Norte: [320, 210, 140, 90, 60, 80],
  Sur: [180, 260, 200, 70, 40, 110],
  Centro: [410, 330, 90, 150, 30, 140],
  Oeste: [150, 120, 240, 60, 90, 50],
};
const off = reactive(new Set<number>());
const toggle = (i: number) => (off.has(i) ? off.delete(i) : off.add(i));
const rows = computed(() =>
  Object.entries(data).map(([region, vals]) => {
    const shown = vals.map((v, i) => ({ i, v })).filter((s) => !off.has(s.i));
    const label = `${region}: ${shown.map((s) => `${series[s.i]} ${s.v}`).join(', ') || 'sin canales'}`;
    return { region, shown, label };
  }),
);
const total = computed(() => Object.values(data).flat().reduce((s, v, k) => s + (off.has(k % 6) ? 0 : v), 0));
</script>

<template>
  <figure>
    <h2>Pedidos por canal y región</h2>
    <p class="sub">Activa o desactiva un canal para compararlo. Los colores cumplen contraste 3:1 en claro y oscuro.</p>
    <ul class="legend">
      <li v-for="(s, i) in series" :key="s">
        <button type="button" :aria-pressed="!off.has(i)" @click="toggle(i)"><i :style="{ '--c': `var(--c${i + 1})` }" />{{ s }}</button>
      </li>
    </ul>
    <div v-for="r in rows" :key="r.region" class="row">
      <span>{{ r.region }}</span>
      <div class="stack" role="img" :aria-label="r.label">
        <i v-for="s in r.shown" :key="s.i" :title="`${series[s.i]}: ${s.v}`" :style="{ '--v': s.v, '--c': `var(--c${s.i + 1})` }" />
      </div>
    </div>
    <p class="tot" role="status">Total visible: {{ total.toLocaleString('es') }} pedidos</p>
  </figure>
</template>

<style scoped>
figure{--c1:#2f5bff;--c2:#d9730d;--c3:#0e9f6e;--c4:#cc3d8e;--c5:#7a4de0;--c6:#9a7b0a;margin:0;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
:global(:root[data-theme=dark]) figure{--c1:#6c8cff;--c2:#f59e4b;--c3:#34d399;--c4:#f472b6;--c5:#a78bfa;--c6:#e3b341}
h2{margin:0;font-size:18px}
.sub{margin:2px 0 16px;color:var(--muted)}
.legend{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 16px;padding:0;list-style:none}
.legend button{display:flex;align-items:center;gap:8px;padding:4px 12px 4px 8px;border:1px solid var(--border);border-radius:999px;background:var(--surface);color:var(--text);font:inherit;cursor:pointer;transition:background .14s,border-color .14s}
.legend button:hover{border-color:var(--accent)}
.legend button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.legend button i{width:12px;height:12px;border-radius:3px;background:var(--c)}
.legend button[aria-pressed=false]{color:var(--muted)}
.legend button[aria-pressed=false] i{background:transparent;box-shadow:inset 0 0 0 2px var(--c)}
.row{display:grid;grid-template-columns:64px 1fr;align-items:center;gap:12px;margin-top:10px}
.row>span{color:var(--muted)}
.stack{display:flex;gap:2px;height:28px;border-radius:var(--radius);overflow:hidden;background:var(--bg)}
.stack i{flex:var(--v) 1 0;min-width:0;background:var(--c);transition:flex-grow .16s}
.tot{margin:16px 0 0;color:var(--muted);font-variant-numeric:tabular-nums}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
