<script setup lang="ts">
import { computed, ref } from 'vue';

type Slice = { label: string; value: number; color: string };

const props = withDefaults(defineProps<{ data?: Slice[]; title?: string; total?: string; unit?: string }>(), {
  title: 'Visitas por canal', total: '12,5k', unit: 'visitas',
  data: () => [
    { label: 'Directo', value: 38, color: '#ff5a36' },
    { label: 'Orgánico', value: 27, color: '#17130f' },
    { label: 'Referidos', value: 18, color: '#ffd84d' },
    { label: 'Social', value: 12, color: '#3b5bfd' },
    { label: 'Otros', value: 5, color: '#1f9d55' },
  ],
});
const R = 100 / (2 * Math.PI); // circunferencia = 100 → dasharray en porcentajes
const active = ref<number | null>(null);

const segs = computed(() => {
  const sum = props.data.reduce((a, d) => a + d.value, 0);
  let acc = 0;
  return props.data.map((d) => {
    const share = (d.value / sum) * 100;
    const s = { len: Math.max(share - 0.8, 0.1), offset: 25 - acc };
    acc += share;
    return s;
  });
});
const cur = computed(() => (active.value === null ? null : props.data[active.value]));
</script>

<template>
  <section class="card" aria-labelledby="donut-title">
    <div class="wrap" :class="{ dim: cur }">
      <svg viewBox="0 0 42 42" role="img" :aria-label="`Gráfico de donut: ${title}`">
        <circle v-for="(s, i) in segs" :key="data[i].label" class="seg" :class="{ on: active === i }" cx="21" cy="21" :r="R"
          :stroke="data[i].color" :stroke-dasharray="`${s.len} ${100 - s.len}`" :stroke-dashoffset="s.offset"
          @mouseenter="active = i" @mouseleave="active = null" />
      </svg>
      <div class="center" aria-hidden="true">
        <strong>{{ cur ? `${cur.value}%` : total }}</strong><span>{{ cur ? cur.label : unit }}</span>
      </div>
    </div>
    <div>
      <h2 id="donut-title">{{ title }}</h2>
      <ul class="legend">
        <li v-for="(d, i) in data" :key="d.label">
          <button type="button" :class="{ on: active === i }" @mouseenter="active = i" @mouseleave="active = null" @focus="active = i" @blur="active = null">
            <span class="dot" :style="{ '--c': d.color }" /><span class="name">{{ d.label }}</span><span class="val">{{ d.value }}%</span>
          </button>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.card { display: flex; flex-wrap: wrap; gap: 20px 28px; align-items: center; justify-content: center; max-width: 620px; margin: 0 auto; padding: 18px; border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; color: #17130f; font: 14px/1.4 system-ui, sans-serif; box-shadow: 4px 4px 0 #17130f; }
.wrap { position: relative; width: 176px; height: 176px; flex: none; }
svg { width: 100%; height: 100%; display: block; }
.seg { fill: none; stroke-width: 6; transition: opacity .15s; }
.dim .seg:not(.on) { opacity: .3; }
.center { position: absolute; inset: 0; display: grid; place-content: center; text-align: center; pointer-events: none; }
.center strong { font-size: 2rem; line-height: 1; letter-spacing: -.03em; font-variant-numeric: tabular-nums; }
.center span { margin-top: 4px; color: #6b6258; font-size: .75rem; }
h2 { margin: 0 0 8px; font-size: 1rem; letter-spacing: -.02em; }
.legend { display: grid; gap: 4px; margin: 0; padding: 0; list-style: none; min-width: 190px; }
.legend button { display: flex; gap: 10px; align-items: center; width: 100%; padding: 5px 8px; border: 2px solid transparent; border-radius: 8px; background: none; color: inherit; font: inherit; text-align: left; cursor: pointer; }
.legend button:hover, .legend button.on { border-color: #17130f; background: #f6f1e7; }
.legend button:focus-visible { outline: 3px solid #ff5a36; outline-offset: 2px; }
.dot { flex: none; width: 12px; height: 12px; border: 2px solid #17130f; border-radius: 3px; background: var(--c); }
.name { flex: 1; }
.val { font: 600 .85rem ui-monospace, monospace; font-variant-numeric: tabular-nums; }
</style>
