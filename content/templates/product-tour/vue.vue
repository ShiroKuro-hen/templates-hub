<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';

type Step = { id: string; title: string; body: string };
const steps: Step[] = [
  { id: 't1', title: 'Busca en todo el panel', body: 'Encuentra pedidos, clientes y facturas con unas pocas letras.' },
  { id: 't2', title: 'Crea un panel nuevo', body: 'Empieza en blanco o parte de una plantilla de ventas.' },
  { id: 't3', title: 'Revisa tus avisos', body: 'Aquí llegan las alertas cuando una métrica cambia.' },
];
const i = ref(0);
const open = ref(true);
const stage = ref<HTMLElement>();
const pop = ref<HTMLElement>();
const next = ref<HTMLButtonElement>();
const step = computed(() => steps[i.value]);
const last = computed(() => i.value === steps.length - 1);
const hl = (id: string) => open.value && step.value.id === id;

function go(n: number) { i.value = n; next.value?.focus({ preventScroll: true }); }
function end() { open.value = false; }
function place() {
  const s = stage.value, p = pop.value, el = s?.querySelector<HTMLElement>(`#${step.value.id}`);
  if (!open.value || !s || !p || !el) return;
  const sr = s.getBoundingClientRect(), r = el.getBoundingClientRect();
  const x = Math.max(16, Math.min(r.left - sr.left, sr.width - p.offsetWidth - 16));
  const ax = Math.min(Math.max(r.left - sr.left + r.width / 2 - x - 5, 12), p.offsetWidth - 24);
  p.style.cssText = `left:${x}px;top:${r.bottom - sr.top + 14}px;--ax:${ax}px`;
}
function onKey(e: KeyboardEvent) {
  if (!open.value) return;
  if (e.key === 'Escape') end();
  else if (e.key === 'ArrowRight' && !last.value) go(i.value + 1);
  else if (e.key === 'ArrowLeft' && i.value > 0) go(i.value - 1);
}
watch([i, open], () => nextTick(place));
onMounted(() => { document.addEventListener('keydown', onKey); place(); });
onBeforeUnmount(() => document.removeEventListener('keydown', onKey));
</script>

<template>
  <div ref="stage" class="stage">
    <div class="tools">
      <button id="t1" type="button" class="ctl grow" :class="{ hl: hl('t1') }">Buscar pedidos, clientes…</button>
      <button id="t2" type="button" class="ctl main" :class="{ hl: hl('t2') }">Nuevo panel</button>
      <button id="t3" type="button" class="ctl" :class="{ hl: hl('t3') }" aria-label="Notificaciones, 3 nuevas">Avisos (3)</button>
    </div>
    <div class="sk" style="width: 60%"></div><div class="sk" style="width: 85%"></div>
    <button v-if="!open" type="button" class="ctl again" @click="i = 0; open = true">Repetir recorrido</button>
    <div ref="pop" class="pop" role="dialog" aria-labelledby="tt" aria-describedby="tb" :hidden="!open">
      <h3 id="tt">{{ step.title }}</h3>
      <p id="tb">{{ step.body }}</p>
      <div class="row">
        <small>Paso {{ i + 1 }} de {{ steps.length }}</small>
        <span class="dots" aria-hidden="true"><i v-for="(s, k) in steps" :key="s.id" :class="{ on: k === i }"></i></span>
      </div>
      <div class="btns">
        <button type="button" class="ctl" :disabled="i === 0" @click="go(i - 1)">Anterior</button>
        <button ref="next" type="button" class="ctl main" @click="last ? end() : go(i + 1)">{{ last ? 'Terminar' : 'Siguiente' }}</button>
        <button type="button" class="link" @click="end">Omitir</button>
      </div>
      <p class="hint"><kbd>←</kbd> <kbd>→</kbd> para navegar, <kbd>Esc</kbd> para cerrar</p>
    </div>
  </div>
</template>

<style scoped>
.stage{position:relative;max-width:640px;min-height:360px;margin:0 auto;padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
.tools{display:flex;flex-wrap:wrap;gap:8px}
.ctl{display:inline-flex;align-items:center;gap:8px;height:36px;padding:0 12px;background:var(--surface);color:var(--text);border:1px solid var(--border);border-radius:var(--radius);font:inherit;cursor:pointer;transition:border-color .14s}
.ctl:hover{border-color:var(--accent)}
.ctl.grow{flex:1;min-width:140px;color:var(--muted)}
.ctl.main{background:var(--accent);border-color:var(--accent);color:var(--accent-ink);font-weight:500}
.ctl.hl{outline:2px solid var(--accent);outline-offset:3px}
.sk{height:10px;margin:14px 0 0;border-radius:999px;background:var(--accent-soft)}
.pop{position:absolute;z-index:2;width:min(300px,calc(100% - 32px));padding:16px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow)}
.pop::before{content:"";position:absolute;top:-6px;left:var(--ax,24px);width:10px;height:10px;background:var(--surface);border:solid var(--border);border-width:1px 0 0 1px;transform:rotate(45deg)}
.pop h3{margin:0;font-size:15px;font-weight:600}
.pop p{margin:4px 0 12px;color:var(--muted)}
.row{display:flex;align-items:center;gap:8px}
.row small{color:var(--muted);font-variant-numeric:tabular-nums}
.dots{display:flex;gap:4px;margin-left:auto}
.dots i{width:6px;height:6px;border-radius:999px;background:var(--border)}
.dots i.on{width:16px;background:linear-gradient(135deg,#22d3ee,#2f5bff)}
.btns{display:flex;gap:8px;margin-top:12px}
.btns .ctl{height:32px}
.btns .ctl:disabled{opacity:.5;cursor:default}
.link{margin-left:auto;background:none;border:0;color:var(--muted);font:inherit;cursor:pointer;border-radius:4px}
.link:hover{color:var(--text)}
.pop .hint{margin:12px 0 0;padding-top:10px;border-top:1px solid var(--border);font-size:13px}
kbd{padding:0 5px;border:1px solid var(--border);border-radius:4px;background:var(--bg);font:12px ui-monospace,"Cascadia Code",Menlo,monospace}
.again{position:absolute;right:16px;bottom:16px}
:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
