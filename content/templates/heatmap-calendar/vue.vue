<script setup lang="ts">
import { computed, ref } from 'vue';

type Day = { date: Date; count: number }; // 84 días (12 semanas), el primero es lunes

const props = withDefaults(defineProps<{ data: Day[]; title?: string }>(), { title: 'Actividad del equipo' });
const level = (n: number) => (n === 0 ? 0 : n <= 2 ? 1 : n <= 5 ? 2 : n <= 8 ? 3 : 4);
const fmt = new Intl.DateTimeFormat('es', { weekday: 'short', day: 'numeric', month: 'short' });
const mon = new Intl.DateTimeFormat('es', { month: 'short' });
const label = (d: Day) => `${d.count === 0 ? 'Sin aportes' : `${d.count} aportes`}, ${fmt.format(d.date)}`;

const focus = ref(0);
const tip = ref<{ i: number; left: number; top: number } | null>(null);
const card = ref<HTMLElement>();
const cells = ref<HTMLElement[]>([]);
const total = computed(() => props.data.reduce((a, d) => a + d.count, 0));
const months = computed(() => props.data.flatMap((d, i) =>
  i % 7 === 0 && (i === 0 || d.date.getMonth() !== props.data[i - 7].date.getMonth())
    ? [{ col: i / 7 + 1, text: mon.format(d.date).replace('.', '') }] : []));

function show(i: number) {
  const r = cells.value[i].getBoundingClientRect(), k = card.value!.getBoundingClientRect();
  tip.value = { i, left: r.left - k.left + r.width / 2, top: r.top - k.top - 6 };
}
function onKey(e: KeyboardEvent, i: number) {
  const step = ({ ArrowDown: 1, ArrowUp: -1, ArrowRight: 7, ArrowLeft: -7 } as Record<string, number>)[e.key];
  if (!step || !props.data[i + step]) return;
  e.preventDefault(); focus.value = i + step; cells.value[i + step].focus();
}
</script>

<template>
  <section ref="card" class="card" aria-labelledby="heat-title">
    <header><h2 id="heat-title">{{ title }}</h2><span class="sum">{{ total }} aportes en 12 semanas</span></header>
    <div class="cal">
      <span />
      <div class="months" aria-hidden="true"><span v-for="m in months" :key="m.col" :style="{ gridColumn: m.col }">{{ m.text }}</span></div>
      <div class="days" aria-hidden="true"><span /><span>Lun</span><span /><span>Mié</span><span /><span>Vie</span><span /></div>
      <ul class="heat" role="group" aria-label="Actividad diaria de las últimas 12 semanas. Usa las flechas para moverte.">
        <li v-for="(d, i) in data" :key="i" :ref="(el) => (cells[i] = el as HTMLElement)" class="cell" :data-l="level(d.count)" role="img"
          :tabindex="i === focus ? 0 : -1" :aria-label="label(d)" @mouseenter="show(i)" @focus="show(i)" @mouseleave="tip = null" @blur="tip = null" @keydown="onKey($event, i)" />
      </ul>
    </div>
    <div v-if="tip" class="tip" role="status" :style="{ left: tip.left + 'px', top: tip.top + 'px', transform: 'translate(-50%, -100%)' }">{{ label(data[tip.i]) }}</div>
  </section>
</template>

<style scoped>
.card{position:relative;max-width:560px;margin:0 auto;padding:20px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif;box-shadow:var(--shadow)}
header{display:flex;flex-wrap:wrap;gap:2px 12px;align-items:baseline;justify-content:space-between;margin-bottom:16px}
h2{margin:0;font-size:16px;font-weight:600}
.sum{color:var(--muted);font-size:13px;font-variant-numeric:tabular-nums}
.cal{display:grid;grid-template-columns:28px 1fr;gap:4px 6px;font-size:11px;color:var(--muted)}
.months,.heat{display:grid;grid-template-columns:repeat(12,1fr);gap:4px}
.days{display:grid;grid-template-rows:repeat(7,1fr);gap:4px}
.days span{display:flex;align-items:center}
.heat{grid-template-rows:repeat(7,auto);grid-auto-flow:column;margin:0;padding:0;list-style:none}
.cell{aspect-ratio:1;border-radius:4px;background:var(--bg);cursor:pointer}
.cell:hover{outline:1px solid var(--text);outline-offset:1px}
.cell:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
[data-l="0"]{--bg:var(--accent-soft)}
[data-l="1"]{--bg:color-mix(in srgb,var(--accent) 30%,var(--surface))}
[data-l="2"]{--bg:color-mix(in srgb,var(--accent) 55%,var(--surface))}
[data-l="3"]{--bg:color-mix(in srgb,var(--accent) 80%,var(--surface))}
[data-l="4"]{--bg:var(--accent)}
.tip{position:absolute;z-index:1;padding:4px 10px;border-radius:var(--radius);background:var(--text);color:var(--surface);font-size:12px;white-space:nowrap;pointer-events:none}
/* Tokens: ver pestaña HTML + CSS */
</style>
