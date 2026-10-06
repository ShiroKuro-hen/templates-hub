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
    <button type="button" @click="push('err', 'No se pudo conectar', 'Revisa tu conexión e inténtalo de nuevo.')">Falla de red</button>
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
.row { display:flex; flex-wrap:wrap; gap:10px; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
button { font:inherit; font-weight:600; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); padding:8px 14px; box-shadow:var(--shadow); cursor:pointer; transition:border-color .14s; }
button:hover { border-color:var(--accent); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.toasts { position:fixed; right:12px; bottom:12px; width:min(340px, calc(100% - 24px)); display:flex; flex-direction:column; gap:8px; margin:0; padding:0; list-style:none; }
.toast { --c:var(--accent); position:relative; display:flex; align-items:center; gap:12px; padding:12px 10px 12px 16px; overflow:hidden; background:var(--surface); color:var(--text); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); animation:in .16s ease-out; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; }
.toast::before { content:""; position:absolute; inset:0 auto 0 0; width:3px; background:var(--c); }
.toast.ok { --c:var(--ok); } .toast.warn { --c:var(--warn); } .toast.err { --c:var(--err); }
.toast span { flex:1; }
.toast b { display:block; font-weight:600; }
.toast small { color:var(--muted); font-size:13px; }
.toast button { padding:0; width:28px; height:28px; border:0; box-shadow:none; background:none; color:var(--muted); font-size:18px; line-height:1; }
.toast button:hover { background:var(--bg); color:var(--text); }
@keyframes in { from { opacity:0; transform:translateY(12px); } }
@media (prefers-reduced-motion:reduce) { .toast { animation:none; } * { transition:none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
