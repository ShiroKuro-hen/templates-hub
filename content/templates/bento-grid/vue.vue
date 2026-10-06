<script setup lang="ts">
const alturas = [60, 80, 50, 90, 70, 40, 30];
</script>

<template>
  <main class="bento">
    <section class="cell hero"><h2>Esta semana</h2><p class="big">42 h</p><p>de trabajo enfocado, 6 h más que la anterior.</p></section>
    <section class="cell kpi"><h2>Tareas hechas</h2><p class="big">98%</p></section>
    <section class="cell streak"><h2>Racha</h2><p class="big">12 días</p></section>
    <section class="cell chart">
      <h2>Horas por día</h2>
      <div class="bars" role="img" aria-label="Horas por día: lunes 6, martes 8, miércoles 5, jueves 9, viernes 7, sábado 4, domingo 3">
        <i v-for="(h, i) in alturas" :key="i" :class="{ max: h === 90 }" :style="{ height: h + '%' }"></i>
      </div>
      <p>Mejor día: jueves</p>
    </section>
    <section class="cell note"><h2>Nota</h2><p>Revisar el informe antes del viernes.</p></section>
    <section class="cell tag"><h2>Estado</h2><p><span class="chip">En marcha</span></p></section>
  </main>
</template>

<style scoped>
.bento { display: grid; gap: 12px; grid-template-columns: repeat(2, 1fr); grid-auto-rows: minmax(96px, auto); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text);
  grid-template-areas: "hero hero" "kpi streak" "chart chart" "note tag"; }
.cell { position: relative; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); box-shadow: var(--shadow); padding: 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 8px; }
.cell h2 { margin: 0; font-size: .8125rem; font-weight: 500; color: var(--muted); }
.cell p { margin: 0; }
.big { font-size: 2rem; font-weight: 700; letter-spacing: -.02em; line-height: 1.1; font-variant-numeric: tabular-nums; }
.hero { grid-area: hero; }
.hero::before { content: ""; position: absolute; inset: 0 0 auto; height: 3px; background: linear-gradient(135deg, #22d3ee, #2f5bff); }
.hero .big { font-size: 2.75rem; }
.kpi { grid-area: kpi; } .streak { grid-area: streak; } .chart { grid-area: chart; } .note { grid-area: note; background: var(--accent-soft); } .tag { grid-area: tag; }
.bars { display: flex; align-items: flex-end; gap: 6px; height: 56px; }
.bars i { flex: 1; background: var(--border); border-radius: 4px 4px 0 0; transition: background 140ms; }
.bars i.max { background: var(--accent); }
.chip { display: inline-block; padding: 2px 10px; border-radius: 999px; background: var(--ok-soft); color: var(--ok); font-size: .75rem; font-weight: 600; }
@media (min-width: 560px) {
  .bento { grid-template-columns: repeat(4, 1fr); grid-template-areas: "hero hero kpi streak" "hero hero chart chart" "note tag chart chart"; }
}
@media (prefers-reduced-motion: reduce) { .bars i { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
