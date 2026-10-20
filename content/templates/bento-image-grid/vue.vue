<script setup lang="ts">
type Tile =
  | { area: string; kind: 'image'; src: string; alt: string; caption: string }
  | { area: string; kind: 'stat'; value: string; label: string };

const props = withDefaults(defineProps<{ tiles?: Tile[] }>(), {
  tiles: () => [
    { area: 't1', kind: 'image', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23dcfce7%22%2F%3E%3Ccircle%20cx%3D%22300%22%20cy%3D%2280%22%20r%3D%2236%22%20fill%3D%22%23facc15%22%2F%3E%3Cpath%20d%3D%22M0%20200Q110%20130%20220%20185T400%20170V300H0Z%22%20fill%3D%22%2316a34a%22%2F%3E%3Cpath%20d%3D%22M0%20250Q150%20200%20260%20240T400%20230V300H0Z%22%20fill%3D%22%2314532d%22%2F%3E%3C%2Fsvg%3E', alt: 'Valle verde con colinas y un sol amarillo al amanecer', caption: 'Valle verde al amanecer' },
    { area: 't2', kind: 'stat', value: '+38%', label: 'conversiones en 90 días tras el rediseño' },
    { area: 't3', kind: 'image', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%231e1b4b%22%2F%3E%3Ccircle%20cx%3D%22330%22%20cy%3D%2260%22%20r%3D%2222%22%20fill%3D%22%23e0e7ff%22%2F%3E%3Crect%20x%3D%2220%22%20y%3D%22130%22%20width%3D%2260%22%20height%3D%22170%22%20fill%3D%22%23312e81%22%2F%3E%3Crect%20x%3D%2295%22%20y%3D%2290%22%20width%3D%2250%22%20height%3D%22210%22%20fill%3D%22%234338ca%22%2F%3E%3Crect%20x%3D%22160%22%20y%3D%22150%22%20width%3D%2270%22%20height%3D%22150%22%20fill%3D%22%23312e81%22%2F%3E%3Crect%20x%3D%22245%22%20y%3D%22110%22%20width%3D%2245%22%20height%3D%22190%22%20fill%3D%22%234338ca%22%2F%3E%3Crect%20x%3D%22300%22%20y%3D%22170%22%20width%3D%2280%22%20height%3D%22130%22%20fill%3D%22%23312e81%22%2F%3E%3Crect%20x%3D%22110%22%20y%3D%22120%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23fde68a%22%2F%3E%3Crect%20x%3D%22262%22%20y%3D%22150%22%20width%3D%228%22%20height%3D%228%22%20fill%3D%22%23fde68a%22%2F%3E%3C%2Fsvg%3E', alt: 'Skyline de edificios azules bajo una luna creciente', caption: 'Skyline nocturno' },
    { area: 't4', kind: 'image', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23fce7f3%22%2F%3E%3Ccircle%20cx%3D%22110%22%20cy%3D%22110%22%20r%3D%2270%22%20fill%3D%22%23db2777%22%2F%3E%3Crect%20x%3D%22190%22%20y%3D%22130%22%20width%3D%22120%22%20height%3D%22120%22%20fill%3D%22%234f46e5%22%20opacity%3D%22.85%22%2F%3E%3Cpath%20d%3D%22M40%20290L120%20170L200%20290Z%22%20fill%3D%22%23facc15%22%2F%3E%3C%2Fsvg%3E', alt: 'Círculo rosa, cuadrado índigo y triángulo amarillo sobre fondo claro', caption: 'Formas en calma' },
    { area: 't5', kind: 'image', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23bae6fd%22%2F%3E%3Ccircle%20cx%3D%22110%22%20cy%3D%2290%22%20r%3D%2234%22%20fill%3D%22%23fbbf24%22%2F%3E%3Crect%20y%3D%22150%22%20width%3D%22400%22%20height%3D%2290%22%20fill%3D%22%230284c7%22%2F%3E%3Cpath%20d%3D%22M0%20180Q50%20165%20100%20180T200%20180T300%20180T400%20180V190H0Z%22%20fill%3D%22%2338bdf8%22%2F%3E%3Crect%20y%3D%22240%22%20width%3D%22400%22%20height%3D%2260%22%20fill%3D%22%23fde68a%22%2F%3E%3C%2Fsvg%3E', alt: 'Costa con mar azul, sol amarillo y arena', caption: 'Costa al mediodía' },
    { area: 't6', kind: 'image', src: 'data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20400%20300%22%20width%3D%22400%22%20height%3D%22300%22%3E%3Crect%20width%3D%22400%22%20height%3D%22300%22%20fill%3D%22%23ecfccb%22%2F%3E%3Cpath%20d%3D%22M60%20240L120%20110L180%20240Z%20M160%20240L230%2080L300%20240Z%20M250%20240L310%20130L370%20240Z%22%20fill%3D%22%23166534%22%2F%3E%3Crect%20y%3D%22240%22%20width%3D%22400%22%20height%3D%2260%22%20fill%3D%22%2365a30d%22%2F%3E%3C%2Fsvg%3E', alt: 'Pinos verdes sobre un fondo verde pálido', caption: 'Bosque de pinos' },
  ],
});
</script>

<template>
  <section class="bento" aria-labelledby="bento-title">
    <h1 id="bento-title">Proyectos recientes</h1>
    <p class="lead">Trabajos de este trimestre, con una cifra de resultados.</p>
    <div class="grid">
      <template v-for="t in props.tiles" :key="t.area">
        <div v-if="t.kind === 'stat'" :class="['tile', 'stat', t.area]">
          <strong>{{ t.value }}</strong>
          <span>{{ t.label }}</span>
        </div>
        <figure v-else :class="['tile', t.area]">
          <img :src="t.src" :alt="t.alt" width="400" height="300" loading="lazy" />
          <figcaption>{{ t.caption }}</figcaption>
        </figure>
      </template>
    </div>
  </section>
</template>

<style scoped>
*{box-sizing:border-box}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.bento{max-width:960px;margin:0 auto}
h1{margin:0 0 4px;font-size:1.5rem;line-height:1.3;letter-spacing:-.02em}
.lead{margin:0 0 18px;color:var(--muted)}
.grid{display:grid;grid-template-columns:minmax(0,1fr);grid-template-rows:repeat(6,200px);grid-template-areas:"t1" "t2" "t3" "t4" "t5" "t6";gap:12px}
@media(min-width:640px){.grid{grid-template-columns:repeat(2,minmax(0,1fr));grid-template-rows:repeat(4,180px);grid-template-areas:"t1 t1" "t2 t3" "t4 t5" "t6 t6"}}
@media(min-width:1024px){.grid{grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(3,190px);grid-template-areas:"t1 t1 t2" "t3 t3 t2" "t4 t5 t6"}}
.t1{grid-area:t1}.t2{grid-area:t2}.t3{grid-area:t3}.t4{grid-area:t4}.t5{grid-area:t5}.t6{grid-area:t6}
.tile{position:relative;margin:0;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);transition:transform .25s ease,box-shadow .25s ease}
.tile:hover{transform:translateY(-4px)}
.tile img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;transition:transform .5s ease}
.tile:hover img{transform:scale(1.05)}
.tile figcaption{position:absolute;left:0;right:0;bottom:0;padding:28px 14px 12px;background:linear-gradient(transparent,rgba(0,0,0,.72));color:rgba(255,255,255,.96);font-size:13px;font-weight:600}
.stat{display:flex;flex-direction:column;justify-content:flex-end;padding:16px;border:0;background:linear-gradient(135deg,var(--accent-2,#22d3ee),var(--accent,#2f5bff));color:var(--accent-ink)}
.stat strong{font-size:2.4rem;line-height:1;letter-spacing:-.03em}
.stat span{margin-top:8px;font-size:14px;font-weight:500}
@media(prefers-reduced-motion:reduce){.tile,.tile img{transition:none}.tile:hover,.tile:hover img{transform:none}}
</style>
