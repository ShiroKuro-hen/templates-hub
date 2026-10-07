<script setup lang="ts">
import { computed, ref } from 'vue';

const iso = (x: Date) => x.toLocaleDateString('sv');
const T = (x: Date) => x.toLocaleTimeString('es', { hour: '2-digit', minute: '2-digit', hour12: false });

const hoy = iso(new Date());
const s = new Date();
s.setDate(s.getDate() + 1);
while ([0, 6].includes(s.getDay())) s.setDate(s.getDate() + 1);

const d = ref(iso(s));
const h = ref('10:00');
const u = ref('45');
const zona = Intl.DateTimeFormat().resolvedOptions().timeZone;

const inicio = computed(() => {
  const [y, m, dd] = d.value.split('-').map(Number), [hh, mm] = h.value.split(':').map(Number);
  return new Date(y, m - 1, dd, hh, mm);
});
const fin = computed(() => new Date(+inicio.value + Number(u.value) * 60000));
const fechaMal = computed(() => !d.value || d.value < hoy || [0, 6].includes(inicio.value.getDay()));
const horaMal = computed(() => !h.value || h.value < '09:00' || h.value > '18:00');
const msg = computed(() =>
  !d.value || !h.value ? 'Elige una fecha y una hora para ver el resumen.'
  : d.value < hoy ? 'Esa fecha ya pasó. Elige hoy o un día posterior.'
  : fechaMal.value ? 'No hay demostraciones en fin de semana. Elige un día de lunes a viernes.'
  : horaMal.value ? 'Elige una hora entre 09:00 y 18:00.' : '');
const dia = computed(() => inicio.value.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }));
</script>

<template>
  <main class="card">
    <h1>Agendar una demostración</h1>
    <p class="sub">Elige un día laboral y una hora entre 09:00 y 18:00.</p>
    <div class="grid">
      <div class="f"><label for="d">Fecha</label>
        <input id="d" v-model="d" type="date" :min="hoy" required :aria-invalid="fechaMal" aria-describedby="e" /></div>
      <div class="f"><label for="h">Hora de inicio</label>
        <input id="h" v-model="h" type="time" min="09:00" max="18:00" step="900" required :aria-invalid="horaMal" aria-describedby="e" /></div>
      <div class="f full"><label for="u">Duración</label>
        <select id="u" v-model="u"><option value="30">30 minutos</option><option value="45">45 minutos</option><option value="60">1 hora</option></select></div>
    </div>
    <p id="e" class="err" role="alert">{{ msg }}</p>
    <section class="sum" :class="{ off: msg }" aria-live="polite" aria-label="Resumen de la reserva">
      <h2>Tu demostración</h2>
      <p class="when">{{ msg ? 'Sin horario válido' : `${T(inicio)} a ${T(fin)}` }}</p>
      <p class="day">{{ msg ? 'Corrige la fecha o la hora de arriba.' : dia }}</p>
      <p class="zone">Zona horaria: {{ zona }}</p>
    </section>
  </main>
</template>

<style scoped>
.card{max-width:460px;margin:0 auto;padding:24px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:18px;line-height:1.3}
.sub{margin:2px 0 18px;color:var(--muted)}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:14px}
.f{display:grid;gap:6px}
.full{grid-column:1/-1}
label{font-weight:600}
input,select{font:inherit;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);padding:8px 12px;min-width:0;font-variant-numeric:tabular-nums;transition:border-color .14s}
input:focus-visible,select:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
input[aria-invalid=true]{border-color:var(--err)}
.err{min-height:21px;margin:10px 0 0;color:var(--err);font-size:13px}
.sum{position:relative;margin-top:8px;padding:14px 16px 14px 28px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
.sum::before{content:"";position:absolute;left:12px;top:14px;bottom:14px;width:4px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.sum h2{margin:0;font-size:13px;font-weight:600;color:var(--muted)}
.when{margin:2px 0 0;font-size:20px;font-weight:600;line-height:1.3;font-variant-numeric:tabular-nums}
.day,.zone{margin:0;color:var(--muted)}
.day{color:var(--text)}
.sum.off .when,.sum.off .day{color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
