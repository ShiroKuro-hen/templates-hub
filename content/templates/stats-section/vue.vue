<script setup lang="ts">
type Stat = { label: string; value: string; context: string; trend?: 'up' | 'down' };

withDefaults(defineProps<{ title?: string; lead?: string; stats?: Stat[] }>(), {
  title: 'La plataforma en cifras',
  lead: 'Datos de producción a 30 de septiembre de 2026, medidos en todas las regiones.',
  stats: () => [
    { label: 'Disponibilidad', value: '99,98 %', context: 'Últimos 12 meses, sin incidencias graves.' },
    { label: 'Solicitudes al día', value: '2,4 M', context: '18 % más que el trimestre anterior.', trend: 'up' },
    { label: 'Latencia media', value: '38 ms', context: '6 ms menos tras migrar a la región UE.', trend: 'down' },
    { label: 'Equipos activos', value: '4.200', context: 'En 31 países y 9 idiomas.' },
  ],
});
const arrow = { up: 'M12 19V5M5 12l7-7 7 7', down: 'M12 5v14M5 12l7 7 7-7' };
</script>

<template>
  <section class="stats" aria-labelledby="stats-title">
    <h2 id="stats-title">{{ title }}</h2>
    <p class="lead">{{ lead }}</p>
    <dl>
      <div v-for="s in stats" :key="s.label">
        <dt>{{ s.label }}</dt>
        <dd class="value">{{ s.value }}</dd>
        <dd class="ctx">
          <svg v-if="s.trend" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path :d="arrow[s.trend]" />
          </svg>
          {{ s.context }}
        </dd>
      </div>
    </dl>
  </section>
</template>

<style scoped>
.stats{position:relative;max-width:1040px;box-sizing:border-box;padding:28px;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.stats::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,#22d3ee,#2f5bff)}
.stats h2{margin:0;font-size:22px;line-height:1.25}
.lead{margin:4px 0 24px;color:var(--muted);max-width:60ch}
dl{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;margin:0;overflow:hidden;background:var(--border);border:1px solid var(--border);border-radius:var(--radius)}
dl > div{display:flex;flex-direction:column;padding:20px;background:var(--surface)}
dt{order:2;margin-top:4px;font-weight:500}
.value{order:1;margin:0;font-size:32px;font-weight:650;line-height:1.1;letter-spacing:-.01em;font-variant-numeric:tabular-nums}
.ctx{order:3;display:flex;align-items:center;gap:6px;margin:8px 0 0;color:var(--muted);font-size:13px}
.ctx svg{flex:none;color:var(--ok)}
@media (max-width:800px){dl{grid-template-columns:repeat(2,1fr)}}
@media (max-width:440px){dl{grid-template-columns:1fr}.stats{padding:20px}}
/* Tokens: ver pestaña HTML + CSS */
</style>
