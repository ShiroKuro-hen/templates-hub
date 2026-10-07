<script setup lang="ts">
import { ref } from 'vue';

const SCALE: Record<number, string> = {
  50: '#f0f4ff', 100: '#dee5ff', 200: '#bccbff', 300: '#97adff', 400: '#6384ff',
  500: '#2f5bff', 600: '#2a50e1', 700: '#2444bf', 800: '#1d3594', 900: '#16276d',
};
const INK = '#0e1726', WHITE = '#ffffff';
const lum = (h: string) =>
  [1, 3, 5]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4))
    .reduce((s, v, i) => s + v * [0.2126, 0.7152, 0.0722][i], 0);
const ratio = (a: string, b: string) => {
  const [x, y] = [lum(a), lum(b)].sort((p, q) => q - p);
  return (x + 0.05) / (y + 0.05);
};
const grade = (r: number) => (r >= 4.5 ? ['ok', 'AA'] : r >= 3 ? ['warn', 'AA texto grande'] : ['err', 'No cumple']);
const rows = Object.entries(SCALE).map(([n, hex]) => {
  const w = ratio(hex, WHITE), k = ratio(hex, INK);
  return { n, hex, fg: w >= k ? WHITE : INK, r: [['Texto blanco', w], ['Texto oscuro', k]] as [string, number][] };
});
const msg = ref('');
async function copy(hex: string) {
  try { await navigator.clipboard.writeText(hex); msg.value = `Copiado ${hex}.`; }
  catch { msg.value = `No se pudo copiar. Selecciona ${hex} a mano.`; }
}
</script>

<template>
  <section class="card" aria-labelledby="t">
    <h2 id="t">Escala de acento</h2>
    <p class="sub">Diez tonos del azul ultramar. Haz clic en un tono para copiar su valor.</p>
    <div class="strip" aria-hidden="true"><i v-for="r in rows" :key="r.n" :style="{ '--c': r.hex }" /></div>
    <ul>
      <li v-for="r in rows" :key="r.n">
        <button class="sw" type="button" :style="{ '--c': r.hex, '--fg': r.fg }" :aria-label="`Copiar azul ${r.n}, ${r.hex}`" @click="copy(r.hex)">Aa</button>
        <div><span class="name">Azul {{ r.n }}</span><span class="hex">{{ r.hex }}</span></div>
        <div class="ratios">
          <span v-for="[label, v] in r.r" :key="label">{{ label }} {{ v.toFixed(2) }}:1 <span :class="['b', grade(v)[0]]">{{ grade(v)[1] }}</span></span>
        </div>
      </li>
    </ul>
    <p id="msg" role="status">{{ msg }}</p>
  </section>
</template>

<style scoped>
.card{padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:18px}
.sub{margin:2px 0 16px;color:var(--muted)}
.strip{display:flex;height:48px;border:1px solid var(--border);border-radius:var(--radius);overflow:hidden}
.strip i{flex:1;background:var(--c)}
.strip i:nth-child(5){box-shadow:inset 0 -3px 0 #22d3ee}
ul{list-style:none;margin:16px 0 0;padding:0}
li{display:grid;grid-template-columns:56px 1fr;gap:4px 12px;align-items:center;padding:10px 0;border-top:1px solid var(--border)}
.sw{all:unset;box-sizing:border-box;grid-row:span 2;display:grid;place-items:center;height:40px;border:1px solid var(--border);border-radius:var(--radius);background:var(--c);color:var(--fg);font-weight:600;cursor:pointer;transition:transform .12s}
.sw:hover{transform:scale(1.04)}
.sw:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.name{font-weight:600}
.hex{margin-left:8px;color:var(--muted);font:13px ui-monospace,"Cascadia Code",Menlo,monospace;font-variant-numeric:tabular-nums}
.ratios{display:flex;flex-wrap:wrap;gap:4px 16px;color:var(--muted);font-variant-numeric:tabular-nums}
.b{display:inline-block;margin-left:4px;padding:0 8px;border-radius:999px;font-size:12px;font-weight:600}
.b.ok{background:var(--ok-soft);color:var(--ok)}
.b.warn{background:var(--warn-soft);color:var(--warn)}
.b.err{background:var(--err-soft);color:var(--err)}
#msg{min-height:21px;margin:12px 0 0;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
