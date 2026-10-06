<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';

type Msg = { from: 'me' | 'them'; text: string; time: string };
const props = withDefaults(defineProps<{ contact?: string; initials?: string }>(), { contact: 'Lucía Ortega', initials: 'LO' });
const msgs = ref<Msg[]>([
  { from: 'them', text: 'Hola, ya subí el informe de incidencias de septiembre.', time: '09:41' },
  { from: 'them', text: '¿Puedes revisar la sección de tiempos de respuesta antes del comité?', time: '09:41' },
  { from: 'me', text: 'Claro, lo reviso esta mañana.', time: '09:44' },
  { from: 'them', text: 'Gracias. El comité empieza a las 12:00.', time: '09:45' },
]);
const text = ref('');
const log = ref<HTMLDivElement>();

// Agrupa mensajes seguidos del mismo remitente
const groups = computed(() => msgs.value.reduce<Msg[][]>((acc, m) => {
  const last = acc[acc.length - 1];
  if (last && last[0].from === m.from) last.push(m); else acc.push([m]);
  return acc;
}, []));

async function send() {
  const v = text.value.trim(); if (!v) return;
  const time = new Date().toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit' });
  msgs.value.push({ from: 'me', text: v, time });
  text.value = '';
  await nextTick();
  log.value?.scrollTo({ top: log.value.scrollHeight });
}
</script>

<template>
  <section class="chat" :aria-label="`Chat con ${props.contact}`">
    <header class="head">
      <span class="av" aria-hidden="true">{{ props.initials }}</span>
      <div><strong>{{ props.contact }}</strong><small><i class="dot" />En línea</small></div>
    </header>
    <div ref="log" class="log" role="log" aria-live="polite" tabindex="0">
      <p class="day">Hoy</p>
      <div v-for="(g, i) in groups" :key="i" class="group" :class="g[0].from">
        <span v-if="g[0].from === 'them'" class="av sm" aria-hidden="true">{{ props.initials }}</span>
        <div class="stack">
          <p v-for="(m, j) in g" :key="j" class="msg">{{ m.text }}</p>
          <time>{{ g[g.length - 1].time }}</time>
        </div>
      </div>
    </div>
    <form class="compose" @submit.prevent="send">
      <label class="sr" for="txt">Mensaje para {{ props.contact }}</label>
      <textarea id="txt" v-model="text" rows="1" placeholder="Escribe un mensaje" aria-describedby="hint"
        @keydown.enter.exact.prevent="send" />
      <button type="submit">Enviar</button>
    </form>
    <p id="hint" class="hint">Enter envía. Mayús + Enter añade una línea.</p>
  </section>
</template>

<style scoped>
.chat{max-width:560px;margin:0 auto;height:460px;display:flex;flex-direction:column;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.head{display:flex;align-items:center;gap:10px;padding:12px 16px;border-bottom:1px solid var(--border)}
.head small{display:flex;align-items:center;gap:6px;color:var(--muted);font-size:12px}
.dot{width:8px;height:8px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.av{flex:none;display:grid;place-items:center;width:36px;height:36px;border-radius:999px;background:var(--accent-soft);color:var(--accent);font-weight:600;font-size:13px}
.av.sm{width:28px;height:28px;font-size:11px;align-self:flex-end}
.log{flex:1;overflow-y:auto;padding:16px;display:flex;flex-direction:column;gap:14px;background:var(--bg)}
.day{margin:0;align-self:center;font-size:12px;color:var(--muted)}
.group{display:flex;gap:8px;max-width:80%}
.group.me{align-self:flex-end}
.stack{display:flex;flex-direction:column;align-items:flex-start;gap:3px}
.me .stack{align-items:flex-end}
.msg{margin:0;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);white-space:pre-wrap;overflow-wrap:anywhere}
.me .msg{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
time{font-size:11px;color:var(--muted);font-variant-numeric:tabular-nums}
.compose{display:flex;gap:8px;padding:12px 12px 4px;border-top:1px solid var(--border)}
textarea{flex:1;min-width:0;resize:none;font:inherit;color:inherit;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px}
button{font:inherit;font-weight:600;padding:8px 16px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--accent-ink);cursor:pointer;transition:filter .14s}
button:hover{filter:brightness(1.08)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.log:focus-visible{outline-offset:-2px}
.hint{margin:0;padding:0 12px 10px;font-size:12px;color:var(--muted)}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
