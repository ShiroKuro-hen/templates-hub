<script setup lang="ts">
import { ref } from 'vue';

type Person = { name: string; action: string };
withDefaults(defineProps<{ people?: Person[]; title?: string; text?: string }>(), {
  title: 'Cerámica de otoño',
  text: 'Taller de 3 horas con arcilla local.',
  people: () => [
    { name: 'Ana P.', action: 'Reservó el taller' },
    { name: 'Luis G.', action: 'Dejó una reseña' },
    { name: 'Marta R.', action: 'Pidió un cambio' },
  ],
});
const loading = ref(true);
</script>

<template>
  <button class="btn" type="button" @click="loading = !loading">
    {{ loading ? 'Mostrar contenido' : 'Volver a cargar' }}
  </button>
  <p class="sr" aria-live="polite">{{ loading ? 'Cargando contenido' : 'Contenido cargado' }}</p>
  <div class="grid" :aria-busy="loading">
    <article class="box">
      <div v-if="loading" aria-hidden="true">
        <span class="sk media" />
        <div class="pad"><span class="sk title" /><span class="sk line" /><span class="sk line w60" /></div>
      </div>
      <template v-else>
        <div class="media real" />
        <div class="pad"><h3>{{ title }}</h3><p>{{ text }}</p></div>
      </template>
    </article>
    <ul class="box">
      <li v-for="p in people" :key="p.name" class="row">
        <template v-if="loading">
          <span class="sk avatar" aria-hidden="true" />
          <div aria-hidden="true"><span class="sk line" /><span class="sk line w60" /></div>
        </template>
        <template v-else>
          <span class="avatar real">{{ p.name[0] }}</span>
          <div><strong>{{ p.name }}</strong><p>{{ p.action }}</p></div>
        </template>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sr { position:absolute; width:1px; height:1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; }
.btn { margin-bottom:16px; padding:7px 16px; font:600 14px system-ui, -apple-system, "Segoe UI", sans-serif; color:var(--accent-ink); background:var(--accent); border:1px solid var(--accent); border-radius:var(--radius); cursor:pointer; transition:filter 140ms; }
.btn:hover { filter:brightness(1.08); }
.btn:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:16px; align-items:start; font:14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color:var(--text); }
.box { margin:0; padding:0; overflow:hidden; list-style:none; background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
.pad { padding:14px; }
.sk { display:block; background:linear-gradient(100deg, var(--border) 30%, var(--bg) 50%, var(--border) 70%) 0 0 / 200% 100%; border-radius:6px; animation:shimmer 1.4s linear infinite; }
@keyframes shimmer { to { background-position:-200% 0; } }
.media { height:84px; border-radius:0; }
.media.real { background:linear-gradient(135deg,#22d3ee,#2f5bff); }
.line { height:10px; margin-top:10px; } .w60 { width:60%; } .title { height:14px; width:75%; }
.row { display:flex; align-items:center; gap:12px; padding:12px 14px; }
.row + .row { border-top:1px solid var(--border); }
.row > div { flex:1; } .row .line { margin:0; } .row .line + .line { margin-top:8px; }
.avatar { flex:none; width:34px; height:34px; border-radius:50%; }
.avatar.real { display:grid; place-items:center; color:var(--accent); background:var(--accent-soft); font-weight:600; }
h3 { margin:0; font-size:1rem; font-weight:600; } p { margin:2px 0 0; color:var(--muted); }
@media (prefers-reduced-motion:reduce) { .sk { animation:none; } .btn { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
