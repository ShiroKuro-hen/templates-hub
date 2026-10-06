<script setup lang="ts">
import { computed } from 'vue';

type Member = { name: string; role: string; points: number; me?: boolean };

const props = withDefaults(defineProps<{ team?: Member[] }>(), {
  team: () => [
    { name: 'Marta Ruiz', role: 'Ejecutiva sénior', points: 128 },
    { name: 'Carlos Díaz', role: 'Ejecutivo sénior', points: 114 },
    { name: 'Sofía Vega', role: 'Ejecutiva', points: 97 },
    { name: 'Luis Gómez', role: 'Ejecutivo', points: 81, me: true },
    { name: 'Ana Pérez', role: 'Ejecutiva', points: 64 },
    { name: 'Diego Torres', role: 'Junior', points: 42 },
  ],
});

const sorted = computed(() => [...props.team].sort((a, b) => b.points - a.points));
const max = computed(() => sorted.value[0]?.points || 1);
const initials = (n: string) => n.split(' ').map((p) => p[0]).join('');
</script>

<template>
  <section class="board" aria-labelledby="tl-t">
    <h2 id="tl-t">Ranking del equipo de ventas</h2>
    <p>Puntos acumulados en octubre. Se actualiza cada día.</p>
    <ol>
      <li v-for="(m, i) in sorted" :key="m.name" class="row" :aria-current="m.me ? 'true' : undefined">
        <span class="pos">{{ i + 1 }}</span>
        <span class="av" aria-hidden="true">{{ initials(m.name) }}</span>
        <div class="who">
          <div class="name"><b>{{ m.name }}</b><span v-if="m.me" class="me">Tú</span><small>{{ m.role }}</small></div>
          <div class="bar" :style="{ '--v': Math.round((m.points / max) * 100) }"></div>
        </div>
        <span class="pts">{{ m.points }} <small>pts</small></span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.board{max-width:560px;margin:0 auto;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
h2{margin:0;font-size:18px;font-weight:600}
.board>p{margin:2px 0 0;color:var(--muted)}
ol{margin:16px 0 0;padding:0;list-style:none;display:grid;gap:4px}
.row{display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid transparent;border-radius:var(--radius)}
.row[aria-current]{background:var(--accent-soft);border-color:var(--accent)}
.pos{flex:none;width:24px;text-align:right;font-weight:600;color:var(--muted);font-variant-numeric:tabular-nums}
.row:nth-child(-n+3) .pos{color:var(--text)}
.av{flex:none;display:grid;place-items:center;width:36px;height:36px;border:1px solid var(--border);border-radius:999px;background:var(--bg);font-size:12px;font-weight:600}
.who{flex:1;min-width:0}
.name{display:flex;flex-wrap:wrap;align-items:baseline;gap:0 8px}
.name b{font-weight:600}
.name small{color:var(--muted);font-size:13px}
.me{padding:0 8px;border-radius:999px;background:var(--accent);color:var(--accent-ink);font-size:12px;font-weight:600}
.bar{height:6px;margin-top:6px;border-radius:999px;background:var(--border);overflow:hidden}
.bar::after{content:"";display:block;width:calc(var(--v) * 1%);height:100%;border-radius:999px;background:var(--accent)}
.row:first-child .bar::after{background:linear-gradient(90deg,#22d3ee,#2f5bff)}
.pts{flex:none;font-weight:600;font-variant-numeric:tabular-nums}
.pts small{font-weight:400;color:var(--muted)}
@media (max-width:400px){.av{display:none}}
/* Tokens: ver pestaña HTML + CSS */
</style>
