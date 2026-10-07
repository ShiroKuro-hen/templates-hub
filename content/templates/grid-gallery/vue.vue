<script setup lang="ts">
import { ref } from 'vue';

type Modo = 'rows' | 'sq' | 'r43' | 'r169';
const modos: [Modo, string][] = [['rows', 'Filas'], ['sq', '1:1'], ['r43', '4:3'], ['r169', '16:9']];
const codigo: Record<Modo, string> = { rows: 'grid-auto-rows: 170px', sq: 'aspect-ratio: 1 / 1', r43: 'aspect-ratio: 4 / 3', r169: 'aspect-ratio: 16 / 9' };
const modo = ref<Modo>('rows');
// [título, categoría, fondo 1, fondo 2, tinta, forma, destacado]
const items: [string, string, string, string, string, string, boolean?][] = [
  ['Rediseño de la app móvil', 'Producto', 'accent-soft', 'info-soft', 'accent', 'c', true],
  ['Identidad Aurora', 'Marca', 'info-soft', 'ok-soft', 'info', 's'],
  ['Sistema de iconos', 'Diseño de sistemas', 'ok-soft', 'warn-soft', 'ok', 't'],
  ['Campaña de otoño', 'Marketing', 'warn-soft', 'err-soft', 'warn', 'c'],
  ['Panel de analítica', 'Producto', 'err-soft', 'accent-soft', 'err', 's', true],
  ['Portal de clientes', 'Producto', 'accent-soft', 'ok-soft', 'accent', 't'],
  ['Guía de estilo', 'Marca', 'info-soft', 'accent-soft', 'info', 'c'],
  ['Tienda en línea', 'Comercio', 'ok-soft', 'info-soft', 'ok', 's'],
  ['Onboarding guiado', 'Producto', 'warn-soft', 'accent-soft', 'warn', 't'],
  ['Kit de ilustraciones', 'Marca', 'err-soft', 'warn-soft', 'err', 'c'],
];
</script>

<template>
  <section class="card" aria-labelledby="t">
    <div class="head">
      <div><h2 id="t">Galería de proyectos</h2><p>Diez entregas recientes del estudio.</p></div>
      <fieldset>
        <legend>Disposición de la galería</legend>
        <label v-for="[v, l] in modos" :key="v"><input v-model="modo" type="radio" name="m" :value="v" /><span>{{ l }}</span></label>
      </fieldset>
    </div>
    <p class="info" aria-live="polite">
      <span :class="`i-${modo}`">{{ modo === 'rows' ? 'Filas de altura uniforme' : 'Proporción fija' }}: <code>{{ codigo[modo] }}</code></span>
    </p>
    <ul class="grid">
      <li v-for="(i, k) in items" :key="i[0]" :class="{ w: i[6] }">
        <figure class="tile">
          <div class="art" :data-s="i[5]" :style="{ '--c1': `var(--${i[2]})`, '--c2': `var(--${i[3]})`, '--ink': `var(--${i[4]})` }">
            <span v-if="k === 0" class="tag">Destacado</span>
          </div>
          <figcaption><b>{{ i[0] }}</b><small>{{ i[1] }}</small></figcaption>
        </figure>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.card{padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:12px;margin-bottom:12px}
h2{margin:0;font-size:16px;font-weight:600}
.head p{margin:2px 0 0;color:var(--muted)}
fieldset{display:flex;margin:0;padding:2px;border:1px solid var(--border);border-radius:var(--radius);background:var(--bg)}
legend{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
fieldset label{position:relative}
fieldset input{position:absolute;inset:0;opacity:0;margin:0;cursor:pointer}
fieldset span{display:block;padding:4px 12px;border-radius:6px;color:var(--muted);transition:background .14s,color .14s}
input:checked+span{background:var(--accent);color:var(--accent-ink);font-weight:600}
input:focus-visible+span{outline:2px solid var(--accent);outline-offset:2px}
.info{margin:0 0 16px;color:var(--muted);font-size:13px}
.info code{font:12px ui-monospace,"Cascadia Code",Menlo,monospace;padding:1px 6px;border-radius:4px;background:var(--bg);border:1px solid var(--border);color:var(--text)}
.grid{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));grid-auto-rows:var(--row,170px);grid-auto-flow:dense;gap:12px}
.card:has([value=sq]:checked) .grid{--row:auto;--ar:1/1}
.card:has([value=r43]:checked) .grid{--row:auto;--ar:4/3}
.card:has([value=r169]:checked) .grid{--row:auto;--ar:16/9}
.grid li{display:flex;min-width:0;min-height:0;aspect-ratio:var(--ar,auto)}
.tile{flex:1;display:grid;grid-template-rows:minmax(0,1fr) auto;min-width:0;margin:0;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);overflow:hidden;transition:border-color .14s}
.tile:hover{border-color:var(--accent)}
.w{grid-column:span 2}
.card:has(:not([value=rows]):checked) .w{grid-column:auto}
@media (max-width:400px){.w{grid-column:auto}}
.art{position:relative;min-height:0;overflow:hidden;background:linear-gradient(135deg,var(--c1),var(--c2))}
.art::after{content:"";position:absolute;right:12%;bottom:14%;width:34%;aspect-ratio:1;max-height:70%;background:var(--ink);opacity:.5}
.art[data-s=c]::after{border-radius:50%}
.art[data-s=s]::after{border-radius:6px;transform:rotate(12deg)}
.art[data-s=t]::after{clip-path:polygon(50% 0,100% 100%,0 100%)}
.tag{position:absolute;top:8px;left:8px;padding:0 8px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff);color:#0a0f1c;font-size:12px;font-weight:600}
figcaption{padding:8px 12px;border-top:1px solid var(--border)}
figcaption b{display:block;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
figcaption small{color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
