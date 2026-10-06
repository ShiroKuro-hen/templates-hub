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
    { id: 'e', kind: 'err', title: 'No se pudo enviar el formulario', text: 'Falta el correo electrónico.' },
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
.alerts { display:flex; flex-direction:column; gap:10px; margin:0; padding:0; list-style:none; font:14px/1.35 system-ui, sans-serif; color:#17130f; }
.alert { --c:#3b5bfd; --t:#e6eaff; display:flex; align-items:flex-start; gap:10px; padding:9px 10px; background:var(--t); border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; }
.alert.ok { --c:#1f9d55; --t:#dff3e7; } .alert.warn { --c:#e0a800; --t:#fff2bf; } .alert.err { --c:#d6293e; --t:#fbe1e5; }
.alert i { flex:none; width:24px; height:24px; display:grid; place-items:center; border:2px solid #17130f; border-radius:50%; background:var(--c); color:#fff; font:700 13px ui-monospace, monospace; }
.alert.warn i { color:#17130f; }
.alert div { flex:1; min-width:0; }
.alert b { display:block; letter-spacing:-.02em; }
.alert span { color:#6b6258; font-size:13px; }
.alert button { flex:none; font:inherit; font-size:18px; line-height:1; width:28px; height:28px; border:2px solid transparent; border-radius:8px; background:none; color:#17130f; cursor:pointer; }
.alert button:hover { border-color:#17130f; background:#fffdf8; }
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
.reset { margin-top:10px; font:600 14px system-ui; padding:8px 14px; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; cursor:pointer; }
.reset:hover, .reset:active { transform:translate(2px,2px); box-shadow:2px 2px 0 #17130f; }
</style>
