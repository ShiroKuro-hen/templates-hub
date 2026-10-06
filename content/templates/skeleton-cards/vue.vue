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
.btn { margin-bottom:14px; padding:7px 14px; font:700 14px system-ui, sans-serif; color:#17130f; background:#ffd84d; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; cursor:pointer; }
.btn:active { transform:translate(2px,2px); box-shadow:2px 2px 0 #17130f; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
.grid { display:grid; grid-template-columns:repeat(auto-fit, minmax(150px, 1fr)); gap:16px; align-items:start; font:14px/1.4 system-ui, sans-serif; color:#17130f; }
.box { margin:0; padding:0; overflow:hidden; list-style:none; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; }
.pad { padding:12px; }
.sk { display:block; background:linear-gradient(100deg, #e9e2d3 30%, #fffdf8 50%, #e9e2d3 70%) 0 0 / 200% 100%; border-radius:6px; animation:shimmer 1.4s linear infinite; }
@keyframes shimmer { to { background-position:-200% 0; } }
.media { height:84px; border-radius:0; border-bottom:2px solid #17130f; }
.media.real { background:#ffd84d; }
.line { height:12px; margin-top:8px; } .w60 { width:60%; } .title { height:16px; width:75%; }
.row { display:flex; align-items:center; gap:10px; padding:10px 12px; }
.row + .row { border-top:1px solid #17130f33; }
.row > div { flex:1; } .row .line { margin:0; } .row .line + .line { margin-top:6px; }
.avatar { flex:none; width:34px; height:34px; border-radius:50%; }
.avatar.real { display:grid; place-items:center; background:#ff5a36; border:2px solid #17130f; font-weight:700; }
h3 { margin:0; font-size:1rem; letter-spacing:-.02em; } p { margin:2px 0 0; color:#6b6258; }
@media (prefers-reduced-motion:reduce) { .sk { animation:none; } }
</style>
