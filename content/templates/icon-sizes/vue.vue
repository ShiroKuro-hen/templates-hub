<script setup lang="ts">
import { ref } from 'vue';

// [token, icono px, trazo px, texto px]
const sizes: [string, number, number, number][] = [
  ['xs', 12, 1.25, 12], ['sm', 16, 1.5, 14], ['md', 20, 1.75, 16],
  ['lg', 24, 2, 20], ['xl', 32, 2.5, 28], ['2xl', 48, 3, 40],
];
const fmt = (n: number) => String(n).replace('.', ',');
const guides = ref(false);
</script>

<template>
  <section class="card" :class="{ guides }" aria-labelledby="t">
    <svg width="0" height="0" style="position:absolute" aria-hidden="true">
      <symbol id="i-search" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" vector-effect="non-scaling-stroke" />
        <path d="m20 20-3.5-3.5" vector-effect="non-scaling-stroke" />
      </symbol>
    </svg>
    <div class="head">
      <div>
        <h2 id="t">Tamaños y trazos de iconos</h2>
        <p class="sub">Cada tamaño tiene su propio grosor de trazo, en píxeles reales.</p>
      </div>
      <label class="chk"><input v-model="guides" type="checkbox"> Mostrar guías</label>
    </div>
    <ul>
      <li v-for="[k, s, w, f] in sizes" :key="k" :style="{ '--s': `${s}px`, '--w': `${w}px`, '--f': `${f}px` }">
        <div class="tk"><b>{{ k }}</b><span>{{ s }} px, trazo {{ fmt(w) }}</span></div>
        <div class="ic"><svg aria-hidden="true"><use href="#i-search" /></svg></div>
        <span class="t"><svg aria-hidden="true"><use href="#i-search" /></svg>{{ f === 40 ? 'Buscar' : 'Buscar clientes' }}</span>
      </li>
    </ul>
    <p class="rule">Junto a texto, el icono mide 1,2 veces el cuerpo y se centra con <code>align-items: center</code>.</p>
  </section>
</template>

<style scoped>
.card{padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:8px 16px}
h2{margin:0;font-size:18px}
.sub{margin:2px 0 8px;color:var(--muted)}
.chk{display:flex;align-items:center;gap:8px;color:var(--muted)}
.chk input{accent-color:var(--accent);width:16px;height:16px;margin:0}
.chk input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
ul{list-style:none;margin:0;padding:0}
li{display:flex;flex-wrap:wrap;align-items:center;gap:8px 20px;padding:12px 0;border-top:1px solid var(--border)}
.tk{width:112px}
.tk b{display:block}
.tk span{color:var(--muted);font-size:13px;font-variant-numeric:tabular-nums}
.ic{display:grid;place-items:center;width:56px;color:var(--accent)}
.ic svg{width:var(--s);height:var(--s);fill:none;stroke:currentColor;stroke-width:var(--w);stroke-linecap:round;stroke-linejoin:round}
.t{display:inline-flex;align-items:center;gap:.4em;font-size:var(--f);line-height:1.2;white-space:nowrap}
.t svg{width:calc(var(--f) * 1.2);height:calc(var(--f) * 1.2);flex:none;fill:none;stroke:currentColor;stroke-width:var(--w);stroke-linecap:round;stroke-linejoin:round}
.guides .t{outline:1px dashed var(--accent)}
.guides .ic svg{outline:1px dashed var(--muted)}
code{font:12px ui-monospace,"Cascadia Code",Menlo,monospace}
.rule{margin:12px 0 0;padding:10px 12px;border-radius:var(--radius);background:var(--accent-soft)}
/* Tokens: ver pestaña HTML + CSS */
</style>
