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
        <i v-for="(h, i) in alturas" :key="i" :style="{ height: h + '%' }"></i>
      </div>
      <p>Mejor día: jueves</p>
    </section>
    <section class="cell note"><h2>Nota</h2><p>Revisar el informe antes del viernes.</p></section>
    <section class="cell tag"><h2>Estado</h2><p><span class="chip">En marcha</span></p></section>
  </main>
</template>

<style scoped>
.bento { display: grid; gap: 12px; grid-template-columns: repeat(2, 1fr); grid-auto-rows: minmax(96px, auto); font: 14px/1.4 system-ui, sans-serif; color: #17130f;
  grid-template-areas: "hero hero" "kpi streak" "chart chart" "note tag"; }
.cell { border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; padding: 14px; display: flex; flex-direction: column; justify-content: space-between; gap: 6px; }
.cell h2 { margin: 0; font: 600 .75rem ui-monospace, monospace; color: #6b6258; }
.cell p { margin: 0; }
.big { font-size: 2.2rem; font-weight: 800; letter-spacing: -.03em; line-height: 1; font-variant-numeric: tabular-nums; }
.hero { grid-area: hero; background: #ffd84d; }
.hero .big { font-size: 2.6rem; }
.kpi { grid-area: kpi; } .streak { grid-area: streak; background: #ff5a36; } .streak h2 { color: #17130f; }
.chart { grid-area: chart; } .note { grid-area: note; background: #cfd8ff; } .tag { grid-area: tag; }
.bars { display: flex; align-items: flex-end; gap: 6px; height: 56px; }
.bars i { flex: 1; background: #17130f; border-radius: 4px 4px 0 0; }
.chip { display: inline-block; padding: 2px 10px; border: 2px solid #17130f; border-radius: 99px; background: #c9efd8; font: 600 .75rem ui-monospace, monospace; }
@media (min-width: 560px) {
  .bento { grid-template-columns: repeat(4, 1fr); grid-template-areas: "hero hero kpi streak" "hero hero chart chart" "note tag chart chart"; }
}
</style>
