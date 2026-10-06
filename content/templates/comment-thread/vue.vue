<script setup lang="ts">
import { ref } from 'vue';

type C = { id: number; author: string; time: string; text: string; own?: boolean; replies: C[] };
const list = ref<C[]>([
  { id: 1, author: 'Irene Molina', time: 'hace 2 h', own: true, text: 'Subí la versión 2 del documento de arquitectura. Necesito revisión del apartado de colas antes del jueves.', replies: [
    { id: 2, author: 'Javier Ramos', time: 'hace 1 h', text: 'Lo reviso hoy. ¿Mantenemos el límite de 5.000 mensajes por segundo?', replies: [] },
  ] },
]);
const open = ref<{ id: number; mode: 'reply' | 'edit' } | null>(null);
const draft = ref('');
const nuevo = ref('');
let seq = 10;

const ini = (n: string) => n.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
const count = (l: C[]): number => l.reduce((s, c) => s + 1 + count(c.replies), 0);
const mk = (text: string): C => ({ id: seq++, author: 'Tú', time: 'ahora', text, own: true, replies: [] });

function start(c: C, mode: 'reply' | 'edit') { open.value = { id: c.id, mode }; draft.value = mode === 'edit' ? c.text : ''; }
function save(c: C) {
  const v = draft.value.trim(); if (!v) return;
  if (open.value?.mode === 'edit') c.text = v; else c.replies.push(mk(v));
  open.value = null;
}
function post() { const v = nuevo.value.trim(); if (v) { list.value.push(mk(v)); nuevo.value = ''; } }
</script>

<template>
  <section class="th" aria-labelledby="h">
    <h2 id="h">Comentarios <span>({{ count(list) }})</span></h2>
    <ul>
      <template v-for="c in list" :key="c.id">
        <li class="c">
          <article class="item">
            <span class="av" aria-hidden="true">{{ ini(c.author) }}</span>
            <div class="body">
              <header><strong>{{ c.author }}</strong><time>{{ c.time }}</time></header>
              <form v-if="open?.id === c.id && open.mode === 'edit'" class="ed" @submit.prevent="save(c)" @keydown.esc="open = null">
                <label class="sr">Editar comentario</label>
                <textarea v-model="draft" rows="2" required autofocus />
                <div class="row"><button class="pri">Guardar cambios</button><button type="button" @click="open = null">Cancelar</button></div>
              </form>
              <p v-else class="txt">{{ c.text }}</p>
              <div class="acts">
                <button type="button" @click="start(c, 'reply')">Responder</button>
                <button v-if="c.own" type="button" @click="start(c, 'edit')">Editar</button>
              </div>
            </div>
          </article>
          <form v-if="open?.id === c.id && open.mode === 'reply'" class="ed" @submit.prevent="save(c)" @keydown.esc="open = null">
            <label class="sr">Responder a {{ c.author }}</label>
            <textarea v-model="draft" rows="2" required autofocus />
            <div class="row"><button class="pri">Responder</button><button type="button" @click="open = null">Cancelar</button></div>
          </form>
          <ul class="replies">
            <li v-for="r in c.replies" :key="r.id" class="c">
              <article class="item">
                <span class="av" aria-hidden="true">{{ ini(r.author) }}</span>
                <div class="body"><header><strong>{{ r.author }}</strong><time>{{ r.time }}</time></header><p class="txt">{{ r.text }}</p></div>
              </article>
            </li>
          </ul>
        </li>
      </template>
    </ul>
    <form class="ed new" @submit.prevent="post">
      <label class="sr" for="nt">Nuevo comentario</label>
      <textarea id="nt" v-model="nuevo" rows="2" placeholder="Escribe un comentario" required />
      <div class="row"><button class="pri">Comentar</button></div>
    </form>
  </section>
</template>

<style scoped>
.th{max-width:640px;margin:0 auto;padding:16px 20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0 0 4px;font-size:16px}
h2 span{color:var(--muted);font-weight:400;font-variant-numeric:tabular-nums}
ul{list-style:none;margin:0;padding:0}
.replies{margin-left:14px;padding-left:14px;border-left:1px solid var(--border)}
.item{display:flex;gap:12px;padding:10px 0}
.av{flex:none;display:grid;place-items:center;width:32px;height:32px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-size:12px;font-weight:600}
.body{flex:1;min-width:0}
header{display:flex;flex-wrap:wrap;align-items:center;gap:8px}
time{font-size:12px;color:var(--muted)}
.txt{margin:2px 0 4px;overflow-wrap:anywhere}
.acts{display:flex;gap:2px;margin-left:-8px}
button{font:inherit;padding:4px 8px;border:1px solid transparent;border-radius:var(--radius);background:none;color:var(--muted);cursor:pointer;transition:background .14s,color .14s}
button:hover{background:var(--accent-soft);color:var(--accent)}
button.pri{padding:6px 14px;font-weight:600;background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
button.pri:hover{filter:brightness(1.08);color:var(--accent-ink)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.ed{display:grid;gap:8px;margin:4px 0 8px 44px}
.body .ed{margin:4px 0 8px}
textarea{width:100%;box-sizing:border-box;resize:vertical;font:inherit;color:inherit;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px}
.row{display:flex;gap:8px}
.new{margin:12px 0 0;padding-top:12px;border-top:1px solid var(--border)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
