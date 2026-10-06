<script setup lang="ts">
import { nextTick, ref } from 'vue';

type Status = 'sent' | 'delivered' | 'read';
type Msg = { id: number; me: boolean; text: string; status?: Status };
const LABEL: Record<Status, string> = { sent: 'Enviado', delivered: 'Entregado', read: 'Leído' };
const REPLIES = ['Recibido, gracias.', 'Perfecto, lo reviso ahora.', 'Listo, te confirmo en unos minutos.'];
const PATH = { sent: 'M3 8.5l3.5 3.5L13 5', delivered: 'M1 8.5l3.5 3.5L11 5M7.5 11.5l.5.5L15 5', read: 'M1 8.5l3.5 3.5L11 5M7.5 11.5l.5.5L15 5' };

const msgs = ref<Msg[]>([
  { id: 1, me: false, text: '¿Pudiste revisar el informe de septiembre?' },
  { id: 2, me: true, text: 'Sí, te lo devuelvo con comentarios hoy.', status: 'read' },
]);
const typers = ref(0);
const text = ref('');
const log = ref<HTMLOListElement>();
let seq = 10;

const bottom = () => nextTick(() => log.value?.scrollTo({ top: log.value.scrollHeight }));

function send() {
  const v = text.value.trim(); if (!v) return;
  msgs.value.push({ id: seq++, me: true, text: v, status: 'sent' });
  const m = msgs.value[msgs.value.length - 1]; // proxy reactivo
  text.value = ''; bottom();
  setTimeout(() => (m.status = 'delivered'), 900);
  setTimeout(() => { m.status = 'read'; typers.value++; bottom(); }, 1900);
  setTimeout(() => { typers.value--; msgs.value.push({ id: seq++, me: false, text: REPLIES[m.id % REPLIES.length] }); bottom(); }, 4200);
}
</script>

<template>
  <section class="chat" aria-label="Conversación con Lucía Ortega">
    <ol ref="log" class="log" role="log" aria-live="polite" tabindex="0">
      <li v-for="m in msgs" :key="m.id" :class="{ me: m.me }">
        <p>{{ m.text }}</p>
        <span v-if="m.status" class="st" :data-s="m.status">
          <svg viewBox="0 0 16 16" aria-hidden="true"><path :d="PATH[m.status]" /></svg>{{ LABEL[m.status] }}
        </span>
      </li>
      <li class="typing" :hidden="typers === 0">
        <p class="dots" aria-hidden="true"><i /><i /><i /></p>
        <span class="sr" role="status">{{ typers > 0 ? 'Lucía está escribiendo' : '' }}</span>
      </li>
    </ol>
    <form @submit.prevent="send">
      <label class="sr" for="m">Mensaje</label>
      <input id="m" v-model="text" autocomplete="off" placeholder="Escribe un mensaje" required>
      <button type="submit">Enviar</button>
    </form>
  </section>
</template>

<style scoped>
.chat{max-width:480px;margin:0 auto;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);overflow:hidden;color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.log{height:300px;overflow-y:auto;display:flex;flex-direction:column;gap:10px;padding:16px;margin:0;list-style:none;background:var(--bg)}
.log li{display:flex;flex-direction:column;align-items:flex-start;gap:3px;max-width:80%}
.log li.me{align-self:flex-end;align-items:flex-end}
p{margin:0;padding:8px 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);overflow-wrap:anywhere}
.me p{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
.st{display:inline-flex;align-items:center;gap:4px;font-size:12px;color:var(--muted)}
.st svg{width:14px;height:14px;fill:none;stroke:currentColor;stroke-width:1.6;stroke-linecap:round;stroke-linejoin:round}
.st[data-s=read]{color:var(--accent)}
.typing p{display:flex;align-items:center;gap:4px;height:20px}
.typing[hidden]{display:none}
.dots i{width:6px;height:6px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff);animation:b 1.1s ease-in-out infinite}
.dots i:nth-child(2){animation-delay:.15s}
.dots i:nth-child(3){animation-delay:.3s}
@keyframes b{0%,60%,100%{opacity:.35;transform:translateY(0)}30%{opacity:1;transform:translateY(-3px)}}
form{display:flex;gap:8px;padding:12px;border-top:1px solid var(--border)}
input{flex:1;min-width:0;font:inherit;color:inherit;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px}
button{font:inherit;font-weight:600;padding:8px 16px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--accent-ink);cursor:pointer;transition:filter .14s}
button:hover{filter:brightness(1.08)}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip-path:inset(50%)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}.dots i{animation:none;opacity:.7}}
/* Tokens: ver pestaña HTML + CSS */
</style>
