<script setup lang="ts">
import { computed } from 'vue';

type Day = 'o' | 'd' | 'x'; // o = operativo, d = degradado, x = incidencia
type Service = { name: string; bad: Record<number, Day> }; // bad: día (0 = hace 29 días, 29 = hoy)

const props = withDefaults(defineProps<{ services?: Service[] }>(), {
  services: () => [
    { name: 'API pública', bad: {} },
    { name: 'Panel web', bad: { 14: 'd' } },
    { name: 'Autenticación', bad: {} },
    { name: 'Pagos', bad: { 6: 'x', 7: 'd' } },
    { name: 'Notificaciones', bad: { 3: 'd', 28: 'd', 29: 'd' } },
    { name: 'Almacenamiento', bad: {} },
    { name: 'Webhooks', bad: { 19: 'd', 20: 'd' } },
    { name: 'Búsqueda', bad: {} },
  ],
});

const TEXT: Record<Day, string> = { o: 'operativo', d: 'degradado', x: 'con incidencia' };
const LABEL: Record<Day, string> = { o: 'Operativo', d: 'Degradado', x: 'Con incidencia' };
const fecha = (i: number) =>
  new Date(2026, 9, 6 - (29 - i)).toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });

const rows = computed(() =>
  props.services.map((s) => {
    const days = Array.from({ length: 30 }, (_, i): Day => s.bad[i] ?? 'o');
    const x = days.filter((c) => c === 'x').length;
    const w = days.filter((c) => c === 'd').length;
    return { ...s, days, x, w, today: days[29], uptime: (100 - x * 0.8 - w * 0.2).toFixed(1).replace('.', ',') };
  }),
);
const alerta = computed(() => rows.value.filter((r) => r.today !== 'o').length);
</script>

<template>
  <div class="status">
    <h1>Estado de los servicios</h1>
    <p class="banner" :class="{ w: alerta }" role="status">
      <span class="dot"></span>
      <span>{{ alerta ? `Hay ${alerta} ${alerta > 1 ? 'servicios' : 'servicio'} con problemas. Seguimos investigando la causa.` : 'Todos los sistemas funcionan con normalidad.' }}</span>
    </p>
    <ul class="grid">
      <li v-for="r in rows" :key="r.name" class="svc">
        <div class="top"><h3>{{ r.name }}</h3><span class="st" :class="r.today">{{ LABEL[r.today] }}</span></div>
        <div class="bars" role="img"
             :aria-label="`${r.name}, últimos 30 días: ${30 - r.x - r.w} operativos, ${r.w} degradados, ${r.x} con incidencia`">
          <i v-for="(c, i) in r.days" :key="i" :class="c" :title="`${fecha(i)}: ${TEXT[c]}`"></i>
        </div>
        <div class="foot"><span>Hace 30 días</span><span><b>{{ r.uptime }} %</b> disponible</span></div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.status{color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h1{margin:0;font-size:18px;font-weight:600}
.banner{display:flex;align-items:center;gap:10px;margin:12px 0 16px;padding:10px 16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.dot{flex:none;width:10px;height:10px;border-radius:999px;background:linear-gradient(135deg,#22d3ee,#2f5bff);animation:ping 2s ease-out infinite}
.banner.w .dot{background:var(--warn);animation:none}
@keyframes ping{from{box-shadow:0 0 0 0 var(--accent)}to{box-shadow:0 0 0 8px transparent}}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:16px;margin:0;padding:0;list-style:none}
.svc{padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.top{display:flex;flex-wrap:wrap;align-items:center;justify-content:space-between;gap:4px 8px;margin-bottom:12px}
h3{margin:0;font-size:14px;font-weight:600}
.st{display:inline-flex;align-items:center;gap:6px;padding:0 8px;border-radius:999px;font-size:12px;font-weight:600}
.st::before{content:"";width:8px;height:8px;border-radius:999px;background:var(--c)}
.st.o{--c:var(--ok);background:var(--ok-soft)}
.st.d{--c:var(--warn);background:var(--warn-soft)}
.st.x{--c:var(--err);background:var(--err-soft)}
.bars{display:flex;gap:2px;height:28px}
.bars i{flex:1;min-width:0;border-radius:2px}
.bars .o{background:var(--ok)}
.bars .d{background:var(--warn)}
.bars .x{background:var(--err)}
.foot{display:flex;justify-content:space-between;margin-top:8px;color:var(--muted);font-size:12px;font-variant-numeric:tabular-nums}
.foot b{color:var(--text);font-weight:600}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
