<script setup lang="ts">
import { computed, ref } from 'vue';

const MUESTRAS = [
  ['Ultramar', '#2f5bff'], ['Cian', '#0891b2'], ['Esmeralda', '#0e9f6e'], ['Ámbar', '#b7791f'],
  ['Coral', '#d92d4a'], ['Violeta', '#7c3aed'], ['Pizarra', '#334155'], ['Grafito', '#0e1726'],
];
const HEX = /^#[0-9a-f]{6}$/i;

const lum = (v: number[]) => {
  const [r, g, b] = v.map((n) => { n /= 255; return n <= 0.03928 ? n / 12.92 : ((n + 0.055) / 1.055) ** 2.4; });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a: number[], b: number[]) => {
  const [p, q] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (p + 0.05) / (q + 0.05);
};

const hex = ref('#2f5bff');
const texto = ref('#2F5BFF');
const error = ref(false);
const v = computed(() => [1, 3, 5].map((i) => parseInt(hex.value.slice(i, i + 2), 16)));
const contrastes = computed(() =>
  [['blanco', [255, 255, 255]], ['negro', [0, 0, 0]]].map(([n, fg]) => {
    const r = ratio(v.value, fg as number[]);
    return { n, r: r.toFixed(1).replace('.', ','), ok: r >= 4.5 };
  }));

function aplicar(h: string) { hex.value = h.toLowerCase(); texto.value = h.toUpperCase(); error.value = false; }
function onTexto(e: Event) {
  const t = '#' + (e.target as HTMLInputElement).value.replace(/[^0-9a-f]/gi, '');
  texto.value = t;
  if (HEX.test(t)) { hex.value = t.toLowerCase(); error.value = false; }
}
function onBlur() {
  const t = /^#[0-9a-f]{3}$/i.test(texto.value) ? '#' + [...texto.value.slice(1)].map((d) => d + d).join('') : texto.value;
  if (HEX.test(t)) aplicar(t); else error.value = true;
}
</script>

<template>
  <main class="card" :style="{ '--c': hex }">
    <h1>Color de marca</h1>
    <p class="sub">Se usará en botones y enlaces de tu espacio.</p>
    <div class="prev" aria-hidden="true"><span>Aa Texto blanco</span><span>Aa Texto negro</span></div>
    <ul class="ratios" aria-live="polite">
      <li v-for="c in contrastes" :key="c.n">Texto {{ c.n }} <b>{{ c.r }}:1</b>
        <span class="badge" :class="{ no: !c.ok }">{{ c.ok ? 'Cumple AA' : 'No cumple AA' }}</span></li>
    </ul>
    <div class="ctl">
      <input type="color" aria-label="Elegir color" :value="hex" @input="aplicar(($event.target as HTMLInputElement).value)" />
      <div class="f">
        <label for="x">Valor HEX</label>
        <input id="x" maxlength="7" spellcheck="false" autocomplete="off" aria-describedby="xe" :aria-invalid="error"
          :value="texto" @input="onTexto" @blur="onBlur" />
      </div>
      <p class="rgb">rgb({{ v.join(', ') }})</p>
    </div>
    <p id="xe" class="err" role="alert">{{ error ? 'Escribe un HEX de 6 dígitos, como #2F5BFF.' : '' }}</p>
    <fieldset class="sws">
      <legend>Muestras</legend>
      <button v-for="[n, h] in MUESTRAS" :key="h" type="button" class="sw" :style="{ '--c': h }"
        :aria-label="`${n} ${h.toUpperCase()}`" :aria-pressed="h === hex" @click="aplicar(h)" />
    </fieldset>
  </main>
</template>

<style scoped>
.card{max-width:460px;margin:0 auto;padding:24px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:18px;line-height:1.3}
.sub{margin:2px 0 16px;color:var(--muted)}
.prev{display:flex;flex-wrap:wrap;align-items:flex-end;gap:4px 20px;min-height:88px;padding:14px 16px;border-radius:var(--radius);background:linear-gradient(135deg,var(--c) 60%,color-mix(in srgb,var(--c) 55%,#22d3ee));font-size:18px;font-weight:600}
.prev span:first-child{color:#fff}
.prev span:last-child{color:#000}
.ratios{display:grid;gap:6px;margin:12px 0 16px;padding:0;list-style:none;font-variant-numeric:tabular-nums}
.badge{padding:0 8px;border-radius:999px;font-size:12px;font-weight:600;background:var(--ok-soft);color:var(--ok)}
.badge.no{background:var(--err-soft);color:var(--err)}
.ctl{display:flex;flex-wrap:wrap;align-items:flex-end;gap:12px}
.f{display:grid;gap:6px}
label{font-weight:600}
input[type=color]{box-sizing:border-box;width:44px;height:40px;padding:3px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer}
#x{width:110px;font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px;text-transform:uppercase}
#x[aria-invalid=true]{border-color:var(--err)}
input:focus-visible,.sw:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.rgb{margin:0;padding-bottom:8px;color:var(--muted);font-variant-numeric:tabular-nums}
.err{min-height:21px;margin:6px 0 0;color:var(--err);font-size:13px}
.sws{display:flex;flex-wrap:wrap;gap:8px;margin:0;padding:0;border:0}
legend{padding:0;margin-bottom:8px;font-weight:600}
.sw{width:36px;height:36px;padding:0;background:var(--c);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;color:#fff;font-size:16px;line-height:1;transition:transform .14s}
.sw[aria-pressed=true]{box-shadow:0 0 0 2px var(--surface),0 0 0 3px var(--accent)}
.sw[aria-pressed=true]::after{content:"\2713"}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
