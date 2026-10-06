<script setup lang="ts">
import { computed, ref } from 'vue';

type Kind = 'info' | 'ok' | 'warn' | 'err';
type AlertItem = { id: string; kind: Kind; title: string; text: string };

const ICON: Record<Kind, string> = { info: 'i', ok: '✓', warn: '!', err: '✕' };
const props = withDefaults(defineProps<{ items?: AlertItem[] }>(), {
  items: () => [
    { id: 'v', kind: 'info', title: 'Nueva versión disponible', text: 'La 2.4 llega el viernes con mejoras de velocidad.' },
    { id: 'p', kind: 'ok', title: 'Pago recibido', text: 'Tu suscripción se renovó hasta el 5 de enero.' },
    { id: 'w', kind: 'warn', title: 'Tu plan vence en 3 días', text: 'Renueva para no perder el acceso.' },
    { id: 'e', kind: 'err', title: 'No se pudo enviar el formulario', text: 'Falta el correo electrónico. Complétalo e inténtalo otra vez.' },
  ],
});
const hidden = ref<string[]>([]);
const visible = computed(() => props.items.filter((a) => !hidden.value.includes(a.id)));
</script>

<template>
  <ul class="alerts">
    <li v-for="a in visible" :key="a.id" :class="['alert', a.kind]" :role="a.kind === 'err' ? 'alert' : 'status'">
      <i aria-hidden="true">{{ ICON[a.kind] }}</i>
      <div><b>{{ a.title }}</b><span>{{ a.text }}</span></div>
      <button type="button" :aria-label="`Descartar aviso: ${a.title}`" @click="hidden.push(a.id)">×</button>
    </li>
  </ul>
  <button v-if="!visible.length" type="button" class="reset" autofocus @click="hidden = []">
    Mostrar avisos otra vez
  </button>
</template>

<style scoped>
.alerts { display:flex; flex-direction:column; gap:10px; margin:0; padding:0; list-style:none; font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif; color:var(--text); }
.alert { --c:var(--info); --t:var(--info-soft); position:relative; display:flex; align-items:flex-start; gap:12px; padding:12px 12px 12px 16px; overflow:hidden; background:var(--t); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
.alert::before { content:""; position:absolute; inset:0 auto 0 0; width:3px; background:var(--c); }
.alert.ok { --c:var(--ok); --t:var(--ok-soft); } .alert.warn { --c:var(--warn); --t:var(--warn-soft); } .alert.err { --c:var(--err); --t:var(--err-soft); }
.alert i { flex:none; width:22px; height:22px; display:grid; place-items:center; border-radius:50%; background:var(--c); color:var(--accent-ink); font:600 12px system-ui,-apple-system,"Segoe UI",sans-serif; font-style:normal; }
.alert div { flex:1; min-width:0; }
.alert b { display:block; font-weight:600; }
.alert span { color:var(--muted); font-size:13px; }
.alert button { flex:none; font:inherit; font-size:18px; line-height:1; width:28px; height:28px; border:0; border-radius:var(--radius); background:none; color:var(--muted); cursor:pointer; transition:background .14s, color .14s; }
.alert button:hover { background:var(--surface); color:var(--text); }
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.reset { margin-top:10px; font:600 14px system-ui,-apple-system,"Segoe UI",sans-serif; padding:8px 14px; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); cursor:pointer; }
.reset:hover { border-color:var(--accent); }
@media (prefers-reduced-motion:reduce) { * { transition:none !important; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
