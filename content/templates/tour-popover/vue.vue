<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue';

type Paso = { id: string; titulo: string; texto: string; lado: 'right' | 'bottom' };

const pasos: Paso[] = [
  { id: 't-rep', titulo: 'Informes', texto: 'Cruza ingresos y usuarios por periodo y exporta a PDF o CSV.', lado: 'right' },
  { id: 't-eq', titulo: 'Equipo', texto: 'Invita a tus compañeros y define quién puede editar.', lado: 'right' },
  { id: 't-bus', titulo: 'Búsqueda', texto: 'Encuentra proyectos, informes y personas por nombre.', lado: 'bottom' },
  { id: 't-kpi', titulo: 'Tus métricas', texto: 'Cada tarjeta resume un indicador clave del mes.', lado: 'bottom' },
];
const ultimo = pasos.length - 1;
const i = ref<number | null>(null); // null = recorrido cerrado
const pop = ref<HTMLElement | null>(null);
const stage = ref<HTMLElement | null>(null);
const spot = ref<HTMLElement | null>(null);
const start = ref<HTMLButtonElement | null>(null);

watch(i, async (n) => {
  const p = pop.value!;
  if (n === null) { if (p.matches(':popover-open')) p.hidePopover(); return; }
  if (!p.matches(':popover-open')) p.showPopover();
  await nextTick();
  const t = document.getElementById(pasos[n].id)!.getBoundingClientRect(), s = stage.value!.getBoundingClientRect();
  const w = p.offsetWidth, h = p.offsetHeight, right = pasos[n].lado === 'right' && innerWidth >= 520;
  Object.assign(spot.value!.style, { left: `${t.left - s.left - 4}px`, top: `${t.top - s.top - 4}px`, width: `${t.width + 8}px`, height: `${t.height + 8}px` });
  let x = right ? t.right + 16 : t.left + t.width / 2 - w / 2, y = right ? t.top + t.height / 2 - h / 2 : t.bottom + 16;
  if (!right && y + h > innerHeight - 8) y = t.top - h - 16;
  p.style.left = `${Math.max(8, Math.min(x, innerWidth - w - 8))}px`;
  p.style.top = `${Math.max(8, Math.min(y, innerHeight - h - 8))}px`;
}, { flush: 'post' });
onMounted(() => { i.value = 0; });

const ir = (n: number) => (i.value = Math.max(0, Math.min(ultimo, n)));
function teclas(e: KeyboardEvent) {
  if (i.value === null) return;
  if (e.key === 'ArrowRight') ir(i.value + 1);
  if (e.key === 'ArrowLeft') ir(i.value - 1);
}
function alCerrar(e: Event) {
  if (!(e.currentTarget as HTMLElement).matches(':popover-open') && i.value !== null) { i.value = null; start.value?.focus(); }
}
</script>

<template>
  <div ref="stage" class="stage">
    <nav class="side" aria-label="Navegación principal"><ul>
      <li class="on">Panel</li><li id="t-rep">Informes</li><li id="t-eq">Equipo</li>
    </ul></nav>
    <main>
      <div class="top">
        <input id="t-bus" type="search" placeholder="Buscar proyectos y personas" aria-label="Buscar">
        <button ref="start" class="btn main" type="button" @click="i = 0">Iniciar recorrido</button>
      </div>
      <div class="kpis">
        <div id="t-kpi" class="kpi"><small>Ingresos del mes</small><b>$ 48.200</b></div>
        <div class="kpi"><small>Usuarios activos</small><b>3.412</b></div>
      </div>
    </main>
    <div ref="spot" class="spot" :hidden="i === null"></div>
  </div>
  <div id="pop" ref="pop" popover role="dialog" aria-labelledby="pt" @keydown="teclas" @toggle="alCerrar">
    <div class="seg" aria-hidden="true"><i v-for="(p, k) in pasos" :key="p.id" :class="{ on: i !== null && k <= i }"></i></div>
    <p class="step">Paso <span>{{ (i ?? 0) + 1 }}</span> de {{ pasos.length }}</p>
    <div aria-live="polite"><h3 id="pt">{{ pasos[i ?? 0].titulo }}</h3><p>{{ pasos[i ?? 0].texto }}</p></div>
    <div class="acts">
      <button class="link" type="button" @click="i = null">Omitir</button>
      <button class="btn" type="button" :disabled="i === 0" @click="ir((i ?? 0) - 1)">Anterior</button>
      <button class="btn main" type="button" @click="i === ultimo ? (i = null) : ir((i ?? 0) + 1)">{{ i === ultimo ? 'Finalizar' : 'Siguiente' }}</button>
    </div>
  </div>
</template>

<style scoped>
.stage{position:relative;display:grid;grid-template-columns:140px 1fr;max-width:680px;min-height:300px;margin:0 auto;overflow:hidden;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.side{padding:16px 12px;border-right:1px solid var(--border)}
.side ul{display:grid;gap:4px;margin:0;padding:0;list-style:none}
.side li{padding:6px 12px;border-radius:var(--radius);color:var(--muted)}
.side li.on{background:var(--accent-soft);color:var(--accent);font-weight:600}
main{padding:16px}
.top{display:flex;flex-wrap:wrap;gap:8px;margin-bottom:16px}
.top input{flex:1;min-width:120px;box-sizing:border-box;height:36px;padding:0 12px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit}
.kpis{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:12px}
.kpi{padding:12px 16px;border:1px solid var(--border);border-radius:var(--radius)}
.kpi small{display:block;color:var(--muted)}
.kpi b{font-size:22px;font-weight:600;font-variant-numeric:tabular-nums}
.btn{height:36px;padding:0 16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);font:inherit;cursor:pointer;transition:border-color .14s}
.btn:hover:not(:disabled){border-color:var(--accent)}
.btn.main{border-color:var(--accent);background:var(--accent);color:var(--accent-ink);font-weight:600}
.btn:disabled{opacity:.5;cursor:default}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
.spot{position:absolute;pointer-events:none;border-radius:var(--radius);box-shadow:0 0 0 1px var(--accent),0 0 0 100vmax rgba(14,23,38,.5);transition:left .16s,top .16s,width .16s,height .16s}
#pop{position:fixed;inset:auto;margin:0;width:min(300px,calc(100vw - 16px));box-sizing:border-box;padding:16px;border:1px solid var(--border);border-radius:var(--radius);background:var(--surface);color:var(--text);box-shadow:var(--shadow);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.seg{display:grid;grid-template-columns:repeat(4,1fr);gap:4px;margin-bottom:12px}
.seg i{height:4px;border-radius:999px;background:var(--border)}
.seg i.on{background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.step{margin:0;color:var(--muted);font-variant-numeric:tabular-nums}
#pop h3{margin:2px 0 4px;font-size:15px;font-weight:600}
#pop h3+p{margin:0 0 16px;color:var(--muted)}
.acts{display:flex;align-items:center;gap:8px}
.acts .btn{height:32px;padding:0 12px}
.link{margin-right:auto;padding:4px;border:0;border-radius:4px;background:none;color:var(--muted);font:inherit;cursor:pointer}
.link:hover{color:var(--text)}
@media (max-width:520px){.stage{grid-template-columns:1fr}.side{padding:8px 12px;border-right:0;border-bottom:1px solid var(--border)}.side ul{display:flex;flex-wrap:wrap}}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
