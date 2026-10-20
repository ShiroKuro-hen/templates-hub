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
    { src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20320%20240%27%3E%3Crect%20width=%27320%27%20height=%27240%27%20fill=%27%23fde7c7%27/%3E%3Ccircle%20cx=%27240%27%20cy=%2770%27%20r=%2728%27%20fill=%27%23f59e0b%27/%3E%3Cpath%20d=%27M0%20240V150l80-70%2070%2060%2090-90%2080%2080v110z%27%20fill=%27%232f5bff%27/%3E%3Cpath%20d=%27M0%20240v-50l120-40%20100%2030%20100-26v86z%27%20fill=%27%230e9f6e%27/%3E%3C/svg%3E', alt: 'Vista frontal' },
    { src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20320%20240%27%3E%3Crect%20width=%27320%27%20height=%27240%27%20fill=%27%23dbe7ff%27/%3E%3Crect%20x=%2730%27%20y=%2780%27%20width=%2750%27%20height=%27160%27%20fill=%27%232f5bff%27/%3E%3Crect%20x=%2790%27%20y=%2740%27%20width=%2760%27%20height=%27200%27%20fill=%27%230891b2%27/%3E%3Crect%20x=%27160%27%20y=%27100%27%20width=%2744%27%20height=%27140%27%20fill=%27%235b6b82%27/%3E%3Crect%20x=%27214%27%20y=%2760%27%20width=%2770%27%20height=%27180%27%20fill=%27%232f5bff%27/%3E%3Cg%20fill=%27%23fff%27%3E%3Crect%20x=%27104%27%20y=%2760%27%20width=%2710%27%20height=%2712%27/%3E%3Crect%20x=%27124%27%20y=%2760%27%20width=%2710%27%20height=%2712%27/%3E%3Crect%20x=%27228%27%20y=%2780%27%20width=%2710%27%20height=%2712%27/%3E%3Crect%20x=%27248%27%20y=%2780%27%20width=%2710%27%20height=%2712%27/%3E%3C/g%3E%3C/svg%3E', alt: 'Vista lateral' },
    { src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20320%20240%27%3E%3Crect%20width=%27320%27%20height=%27240%27%20fill=%27%23e6fbf4%27/%3E%3Ccircle%20cx=%27110%27%20cy=%27120%27%20r=%2780%27%20fill=%27%2334d399%27/%3E%3Ccircle%20cx=%27200%27%20cy=%27110%27%20r=%2760%27%20fill=%27%232f5bff%27%20opacity=%27.8%27/%3E%3Cpath%20d=%27M0%20200q80-60%20160%200t160%200v40H0z%27%20fill=%27%23f5b84b%27/%3E%3C/svg%3E', alt: 'Detalle del bolsillo' },
    { src: 'data:image/svg+xml,%3Csvg%20xmlns=%27http://www.w3.org/2000/svg%27%20viewBox=%270%200%20320%20240%27%3E%3Crect%20width=%27320%27%20height=%27240%27%20fill=%27%23ffe4ea%27/%3E%3Cpath%20d=%27M0%2080q40-30%2080%200t80%200%2080%200%2080%200v160H0z%27%20fill=%27%23ff6b81%27/%3E%3Cpath%20d=%27M0%20140q40-30%2080%200t80%200%2080%200%2080%200v100H0z%27%20fill=%27%23d92d4a%27%20opacity=%27.8%27/%3E%3Ccircle%20cx=%27260%27%20cy=%2746%27%20r=%2718%27%20fill=%27%23fbf1dc%27/%3E%3C/svg%3E', alt: 'Vista en uso' },
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
    <h2>Mochila Sierra 24 L</h2>
    <p class="price">89,90 €</p>
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
      <img :src="shot.src" :alt="shot.alt" width="640" height="480" loading="lazy" />
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
  .stage{position:relative;overflow:hidden;aspect-ratio:4/3;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);cursor:zoom-in}
  .stage.zoomed{cursor:move}
  .stage img{display:block;width:100%;height:100%;object-fit:cover;transition:transform .2s ease}
  .stage.zoomed img{transform:translate(var(--tx,0),var(--ty,0)) scale(2)}
  .lens{position:absolute;width:140px;height:140px;border:2px solid var(--accent);border-radius:50%;box-shadow:var(--shadow);background-repeat:no-repeat;pointer-events:none}
  [hidden]{display:none!important}
  .thumbs{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin:10px 0 0;padding:0;list-style:none}
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
