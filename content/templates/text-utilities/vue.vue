<script setup lang="ts">
import { ref } from 'vue';

const texto =
  'La migración a la nueva plataforma de facturación terminó el martes. Todos los clientes con plan anual conservan su precio actual hasta la próxima renovación, y los reembolsos pendientes se procesan en un máximo de cinco días hábiles.';
const cifras = ['1.111,00', '8.888,50', '1.234,10'];
const lines = ref(2);
</script>

<template>
  <div class="grid">
    <section>
      <h2>Truncado de líneas</h2>
      <p class="hint">Corta el texto con puntos suspensivos. Usa <code>line-clamp</code>.</p>
      <label>Líneas <input v-model.number="lines" type="range" min="1" max="4"> <output>{{ lines }}</output></label>
      <p class="clamp" :style="{ '--n': lines }">{{ texto }}</p>
    </section>
    <section>
      <h2>Balance de texto</h2>
      <p class="hint">Reparte las palabras entre líneas. Usa <code>text-wrap: balance</code>.</p>
      <div class="pair">
        <div><small>Normal</small><b class="pre">Tu informe mensual está listo para revisar</b></div>
        <div><small>Equilibrado</small><b class="bal">Tu informe mensual está listo para revisar</b></div>
      </div>
    </section>
    <section>
      <h2>Listas</h2>
      <p class="hint">Marcadores con el color de acento.</p>
      <ul><li>Invita a tu equipo</li><li>Conecta una fuente de datos</li><li>Publica tu primer panel</li></ul>
      <ol><li>Crea el proyecto</li><li>Configura el dominio</li><li>Lanza la versión</li></ol>
    </section>
    <section>
      <h2>Números tabulares</h2>
      <p class="hint">Todas las cifras miden lo mismo. Usa <code>tabular-nums</code>.</p>
      <div class="nums">
        <div><small>Proporcional</small><p><template v-for="c in cifras" :key="c">{{ c }}<br></template></p></div>
        <div><small>Tabular</small><p class="t"><template v-for="c in cifras" :key="c">{{ c }}<br></template></p></div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
section{padding:16px 20px 20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
h2{margin:0;font-size:15px}
.hint{margin:2px 0 12px;color:var(--muted);font-size:13px}
code{font:12px ui-monospace,"Cascadia Code",Menlo,monospace;padding:1px 6px;border:1px solid var(--border);border-radius:4px;background:var(--bg)}
label{display:flex;align-items:center;gap:10px;margin-bottom:12px;color:var(--muted)}
input[type=range]{flex:1;accent-color:var(--accent)}
input:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
output{min-width:1.5ch;font-weight:600;color:var(--text);font-variant-numeric:tabular-nums}
.clamp{margin:0;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:var(--n,2);line-clamp:var(--n,2);overflow:hidden}
.pair,.nums{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.pair div{padding:10px 12px;border:1px solid var(--border);border-radius:var(--radius)}
small{display:block;margin-bottom:4px;color:var(--muted)}
.pair b{display:block;font-size:17px;line-height:1.25}
.bal{text-wrap:balance}
.pre{text-wrap:wrap}
ul,ol{margin:0 0 8px;padding-left:20px}
li{padding-left:4px;margin-bottom:4px}
li::marker{color:var(--accent)}
ol li::marker{font-weight:600;font-variant-numeric:tabular-nums}
.nums p{margin:0;text-align:right}
.nums .t{font-variant-numeric:tabular-nums}
/* Tokens: ver pestaña HTML + CSS */
</style>
