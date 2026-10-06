<script setup lang="ts">
import { ref } from 'vue';

type Rx = { e: string; n: number; me: boolean };
const EMOJIS = ['👍', '❤️', '🎉', '🚀', '👀', '✅', '😄', '🙌'];
const rx = ref<Rx[]>([{ e: '👍', n: 12, me: true }, { e: '🎉', n: 7, me: false }, { e: '🚀', n: 3, me: false }]);
const status = ref('');
const add = ref<HTMLDetailsElement>();

function toggle(e: string) {
  let r = rx.value.find((x) => x.e === e);
  if (!r) { r = { e, n: 0, me: false }; rx.value.push(r); }
  r.me = !r.me; r.n += r.me ? 1 : -1;
  status.value = `Reacción ${e} ${r.me ? 'añadida' : 'quitada'}`;
  rx.value = rx.value.filter((x) => x.n > 0);
}
function choose(e: string) { toggle(e); add.value!.open = false; }
</script>

<template>
  <article class="msg">
    <span class="av" aria-hidden="true">MQ</span>
    <div class="body">
      <header><strong>Marina Quiroga</strong><time>10:32</time></header>
      <p>Lanzamos la versión 3.2 con las correcciones de accesibilidad. Gracias a todo el equipo.</p>
      <div class="bar" role="group" aria-label="Reacciones al mensaje">
        <button v-for="r in rx" :key="r.e" type="button" :aria-pressed="r.me"
          :aria-label="`${r.e}, ${r.n} ${r.n === 1 ? 'reacción' : 'reacciones'}`" @click="toggle(r.e)">
          <span aria-hidden="true">{{ r.e }}</span><b aria-hidden="true">{{ r.n }}</b>
        </button>
        <details ref="add" @keydown.esc="add!.open = false">
          <summary aria-label="Añadir reacción">+</summary>
          <div class="pick" role="group" aria-label="Elegir emoji">
            <button v-for="e in EMOJIS" :key="e" type="button" :aria-label="`Reaccionar con ${e}`" @click="choose(e)">{{ e }}</button>
          </div>
        </details>
      </div>
      <p class="sr" role="status">{{ status }}</p>
    </div>
  </article>
</template>

<style scoped>
.msg{display:flex;gap:12px;max-width:520px;margin:0 auto;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.av{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:13px;font-weight:600}
.body{flex:1;min-width:0}
header{display:flex;flex-wrap:wrap;align-items:baseline;gap:8px}
time{font-size:12px;color:var(--muted)}
p{margin:2px 0 10px;overflow-wrap:anywhere}
.bar{display:flex;flex-wrap:wrap;align-items:center;gap:6px}
.bar button,summary{display:inline-flex;align-items:center;gap:6px;min-height:28px;padding:0 10px;font:inherit;color:var(--muted);background:var(--surface);border:1px solid var(--border);border-radius:999px;cursor:pointer;list-style:none;transition:background .14s,color .14s}
summary::-webkit-details-marker{display:none}
.bar button:hover,summary:hover{background:var(--accent-soft);color:var(--text)}
.bar button[aria-pressed=true]{color:var(--accent);border-color:transparent;background:linear-gradient(var(--accent-soft),var(--accent-soft)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box}
.bar b{font-weight:600;font-variant-numeric:tabular-nums}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
details{position:relative}
.pick{position:absolute;z-index:2;top:34px;left:0;display:flex;flex-wrap:wrap;gap:2px;width:max-content;max-width:224px;padding:4px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.pick button{min-height:32px;padding:0 8px;border-color:transparent;font-size:16px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
