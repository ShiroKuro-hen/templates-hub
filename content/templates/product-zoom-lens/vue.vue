<script setup lang="ts">
import { computed, nextTick, ref, type CSSProperties } from 'vue';

type Shot = { src: string; alt: string };

const LENS = 140;
const ZOOM = 2.5;
const STEP = 10;
const LIMIT = 50;
const KEYS: Record<string, [number, number]> = {
  ArrowLeft: [STEP, 0],
  ArrowRight: [-STEP, 0],
  ArrowUp: [0, STEP],
  ArrowDown: [0, -STEP],
};
const props = withDefaults(defineProps<{ shots?: Shot[] }>(), {
  shots: () => [
    { src: '/stock/taza-vintage.webp', alt: 'Taza roja con estampado vintage' },
    { src: '/stock/camara-vintage.webp', alt: 'Cámara vintage sobre teclas de piano' },
    { src: '/stock/tocadiscos.webp', alt: 'Aguja de tocadiscos sobre el vinilo' },
    { src: '/stock/cafe-rojo.webp', alt: 'Taza de café sobre fondo rojo' },
  ],
});
const clamp = (v: number) => Math.min(LIMIT, Math.max(-LIMIT, v));

const stage = ref<HTMLDivElement>();
const active = ref(0);
const zoomed = ref(false);
const pan = ref({ x: 0, y: 0 });
const lens = ref<CSSProperties | null>(null);
const shot = computed(() => props.shots[active.value]);
const hint = computed(() =>
  zoomed.value ? 'Usa las flechas para desplazarte; Escape para salir.' : 'Pasa el cursor o pulsa Ampliar para ver el detalle.',
);
const stageStyle = computed(() => ({ '--tx': `${pan.value.x}%`, '--ty': `${pan.value.y}%` }) as CSSProperties);

async function toggleZoom() {
  zoomed.value = !zoomed.value;
  pan.value = { x: 0, y: 0 };
  lens.value = null;
  if (zoomed.value) {
    await nextTick();
    stage.value?.focus();
  }
}

function moveLens(e: PointerEvent) {
  if (zoomed.value || e.pointerType !== 'mouse' || !stage.value) return;
  const r = stage.value.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;
  lens.value = {
    left: `${x - LENS / 2}px`,
    top: `${y - LENS / 2}px`,
    backgroundImage: `url("${shot.value.src}")`,
    backgroundSize: `${r.width * ZOOM}px ${r.height * ZOOM}px`,
    backgroundPosition: `${LENS / 2 - x * ZOOM}px ${LENS / 2 - y * ZOOM}px`,
  };
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape' && zoomed.value) {
    zoomed.value = false;
    return;
  }
  const d = KEYS[e.key];
  if (!zoomed.value || !d) return;
  e.preventDefault();
  pan.value = { x: clamp(pan.value.x + d[0]), y: clamp(pan.value.y + d[1]) };
}
</script>

<template>
  <div class="product">
    <h2>Taza vintage estampada 350 ml</h2>
    <p class="price">18,90 €</p>
    <div
      ref="stage"
      :class="['stage', { zoomed }]"
      :style="stageStyle"
      tabindex="0"
      role="group"
      aria-label="Imagen del producto. Con el zoom activo, usa las flechas para desplazarte y Escape para salir."
      @pointermove="moveLens"
      @pointerleave="lens = null"
      @keydown="onKeyDown"
    >
      <img :src="shot.src" :alt="shot.alt" width="800" height="533" />
      <div v-if="lens && !zoomed" class="lens" :style="lens" />
    </div>
    <div class="row">
      <button type="button" class="btn" :aria-pressed="String(zoomed)" @click="toggleZoom">Ampliar</button>
      <span class="hint">{{ hint }}</span>
    </div>
    <ul class="thumbs">
      <li v-for="(s, i) in props.shots" :key="s.src">
        <button type="button" :aria-current="String(i === active)" @click="active = i">
          <img :src="s.src" :alt="s.alt" width="96" height="72" loading="lazy" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>

  *{box-sizing:border-box}
  .product{max-width:520px;margin:0 auto}
  h2{margin:0 0 2px;font-size:18px;font-weight:600}
  .price{margin:0 0 14px;color:var(--muted)}
  .stage{position:relative;overflow:hidden;aspect-ratio:3/2;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);cursor:zoom-in}
  .stage.zoomed{cursor:move}
  .stage img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .2s ease}
  .stage.zoomed img{transform:translate(var(--tx,0),var(--ty,0)) scale(2)}
  .lens{position:absolute;width:140px;height:140px;border:2px solid var(--accent);border-radius:50%;box-shadow:var(--shadow);background-repeat:no-repeat;pointer-events:none}
  [hidden]{display:none!important}
  .thumbs{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;margin:10px 0 0;padding:0;list-style:none}
  .thumbs button{display:block;width:100%;padding:0;background:var(--surface);border:2px solid var(--border);border-radius:min(var(--radius),6px);overflow:hidden;cursor:pointer}
  .thumbs button[aria-current=true]{border-color:var(--accent)}
  .thumbs img{display:block;width:100%;aspect-ratio:4/3;object-fit:cover}
  .row{display:flex;align-items:center;flex-wrap:wrap;gap:12px;margin-top:12px}
  .btn{height:36px;padding:0 14px;font:inherit;font-weight:500;color:var(--text);background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);cursor:pointer;transition:border-color .14s,background .14s}
  .btn:hover{border-color:var(--accent)}
  .btn[aria-pressed=true]{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}
  .hint{color:var(--muted);font-size:13px}
  :focus-visible{outline:2px solid var(--accent);outline-offset:2px}
  @media (prefers-reduced-motion:reduce){*{transition:none!important}}

</style>
