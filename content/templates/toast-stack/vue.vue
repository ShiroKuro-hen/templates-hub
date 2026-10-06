<script setup lang="ts">
import { ref } from 'vue';

type Kind = 'ok' | 'err' | 'info' | 'warn';
type Toast = { id: number; kind: Kind; title: string; text?: string; timer?: number };

const props = withDefaults(defineProps<{ ms?: number; max?: number }>(), { ms: 5000, max: 4 });
const items = ref<Toast[]>([]);
let seq = 0;

function close(id: number) {
  const t = items.value.find((x) => x.id === id);
  if (t) clearTimeout(t.timer);
  items.value = items.value.filter((x) => x.id !== id);
}
function arm(t: Toast) { t.timer = window.setTimeout(() => close(t.id), props.ms); }
function pause(t: Toast) { clearTimeout(t.timer); }

function push(kind: Kind, title: string, text?: string) {
  const t: Toast = { id: ++seq, kind, title, text };
  arm(t);
  items.value = [...items.value, t].slice(-props.max);
}
defineExpose({ push });
</script>

<template>
  <div class="row">
    <button type="button" @click="push('ok', 'Cambios guardados', 'Tu perfil ya está actualizado.')">Guardar</button>
    <button type="button" @click="push('err', 'No se pudo conectar', 'Revisa tu conexión.')">Falla de red</button>
  </div>
  <ul class="toasts" aria-live="polite" aria-label="Notificaciones">
    <li v-for="t in items" :key="t.id" :class="['toast', t.kind]"
        :role="t.kind === 'err' ? 'alert' : 'status'"
        @mouseenter="pause(t)" @mouseleave="arm(t)">
      <span><b>{{ t.title }}</b><small v-if="t.text">{{ t.text }}</small></span>
      <button type="button" aria-label="Cerrar aviso" @click="close(t.id)">×</button>
    </li>
  </ul>
</template>

<style scoped>
.row { display:flex; flex-wrap:wrap; gap:10px; }
button { font:inherit; font-weight:600; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:10px; padding:8px 14px; box-shadow:4px 4px 0 #17130f; cursor:pointer; }
button:hover, button:active { transform:translate(2px,2px); box-shadow:2px 2px 0 #17130f; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
.toasts { position:fixed; right:12px; bottom:12px; width:min(320px, calc(100% - 24px)); display:flex; flex-direction:column; gap:8px; margin:0; padding:0; list-style:none; }
.toast { --c:#3b5bfd; display:flex; align-items:center; gap:10px; padding:10px 10px 10px 12px; background:#fffdf8; color:#17130f; border:2px solid #17130f; border-left:8px solid var(--c); border-radius:10px; box-shadow:4px 4px 0 #17130f; animation:in .2s ease-out; }
.toast.ok { --c:#1f9d55; } .toast.warn { --c:#e0a800; } .toast.err { --c:#d6293e; }
.toast span { flex:1; }
.toast b { display:block; }
.toast small { color:#6b6258; }
.toast button { padding:2px 8px; box-shadow:none; font-size:16px; line-height:1.2; }
@keyframes in { from { opacity:0; transform:translateY(12px); } }
@media (prefers-reduced-motion:reduce) { .toast { animation:none; } }
</style>
