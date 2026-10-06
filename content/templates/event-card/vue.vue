<script setup lang="ts">
import { computed, ref } from 'vue';

type EventInfo = { titulo: string; inicio: string; horario: string; lugar: string; plazas: number };
const props = withDefaults(defineProps<{ e?: EventInfo }>(), {
  e: () => ({ titulo: 'Meetup de arquitectura frontend', inicio: '2026-11-14T18:30', horario: 'Sábado, 18:30 a 21:00', lugar: 'Impact Hub, Madrid', plazas: 12 }),
});
const emit = defineEmits<{ toggle: [reservado: boolean] }>();
const on = ref(false);
const d = computed(() => new Date(props.e.inicio));
const mes = computed(() => new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(d.value).replace('.', ''));
function toggle() { on.value = !on.value; emit('toggle', on.value); }
</script>

<template>
  <article class="event" aria-labelledby="ev-title">
    <time class="date" :datetime="e.inicio"><b>{{ d.getDate() }}</b><span>{{ mes }}</span></time>
    <div>
      <h3 id="ev-title">{{ e.titulo }}</h3>
      <ul class="info">
        <li>
          <svg viewBox="0 0 16 16" aria-hidden="true"><circle cx="8" cy="8" r="6.2" fill="none" stroke="currentColor" stroke-width="1.4" /><path d="M8 4.5V8l2.5 1.5" fill="none" stroke="currentColor" stroke-width="1.4" /></svg>
          {{ e.horario }}
        </li>
        <li>
          <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 14.5s-4.8-4.4-4.8-8a4.8 4.8 0 0 1 9.6 0c0 3.6-4.8 8-4.8 8z" fill="none" stroke="currentColor" stroke-width="1.4" /><circle cx="8" cy="6.5" r="1.7" fill="currentColor" /></svg>
          {{ e.lugar }}
        </li>
      </ul>
      <div class="foot">
        <span class="seats">{{ e.plazas - (on ? 1 : 0) }} plazas libres</span>
        <button type="button" class="btn" :aria-pressed="on" @click="toggle">Reservar plaza</button>
      </div>
      <p class="sr" role="status">{{ on ? 'Plaza reservada. Te enviamos la confirmación por correo.' : '' }}</p>
    </div>
  </article>
</template>

<style scoped>
.event{display:grid;grid-template-columns:auto 1fr;gap:16px;max-width:440px;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.date{display:grid;place-content:center;width:64px;height:72px;text-align:center;border:1px solid transparent;border-radius:var(--radius);
      background:linear-gradient(var(--accent-soft),var(--accent-soft)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box}
.date b{font-size:26px;line-height:1;font-variant-numeric:tabular-nums}
.date span{margin-top:4px;color:var(--accent);font-weight:600}
h3{margin:0 0 6px;font-size:16px;line-height:1.3}
.info{display:grid;gap:4px;margin:0 0 14px;padding:0;list-style:none;color:var(--muted)}
.info li{display:flex;align-items:center;gap:8px}
.info svg{flex:none;width:16px;height:16px}
.foot{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:10px}
.seats{color:var(--muted);font-variant-numeric:tabular-nums}
.btn{font:inherit;font-weight:600;padding:8px 14px;border:1px solid var(--accent);border-radius:var(--radius);background:var(--accent);color:var(--accent-ink);cursor:pointer;transition:filter .14s,background .14s,color .14s}
.btn:hover{filter:brightness(1.08)}
.btn[aria-pressed=true]{background:var(--surface);color:var(--text);border-color:var(--border)}
.btn:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
@media (max-width:360px){.event{grid-template-columns:1fr}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
