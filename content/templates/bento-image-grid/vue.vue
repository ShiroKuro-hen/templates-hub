<script setup lang="ts">
type Tile =
  | { area: string; kind: 'image'; src: string; alt: string; caption: string }
  | { area: string; kind: 'stat'; value: string; label: string };

const props = withDefaults(defineProps<{ tiles?: Tile[] }>(), {
  tiles: () => [
    { area: 't1', kind: 'image', src: '/stock/costa-azul.webp', alt: 'Costa con pinos y mar azul', caption: 'Costa azul con pinos' },
    { area: 't2', kind: 'stat', value: '+38%', label: 'conversiones en 90 días tras el rediseño' },
    { area: 't3', kind: 'image', src: '/stock/calle-ciudad.webp', alt: 'Calle de la ciudad entre edificios altos', caption: 'Calle entre edificios' },
    { area: 't4', kind: 'image', src: '/stock/escritorio-diseno.webp', alt: 'Escritorio visto desde arriba con materiales de diseño y un teléfono', caption: 'Mesa de diseño' },
    { area: 't5', kind: 'image', src: '/stock/montana-nieve.webp', alt: 'Picos montañosos cubiertos de nieve', caption: 'Picos nevados' },
    { area: 't6', kind: 'image', src: '/stock/cafeteria-mesa.webp', alt: 'Larga mesa de madera de una cafetería', caption: 'Mesa de cafetería' },
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
          <img :src="t.src" :alt="t.alt" width="800" height="533" decoding="async" />
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
