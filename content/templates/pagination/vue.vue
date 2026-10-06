<script setup lang="ts">
import { computed, ref } from 'vue';

const props = withDefaults(defineProps<{ total?: number; perPage?: number; count?: number }>(), {
  total: 12,
  perPage: 10,
  count: 120,
});
const page = ref(4);

const pages = computed(() => {
  const p = page.value;
  const nums = [...new Set([1, p - 1, p, p + 1, props.total])].filter((n) => n >= 1 && n <= props.total).sort((a, b) => a - b);
  const out: (number | '…')[] = [];
  let last = 0;
  for (const n of nums) {
    if (n - last === 2) out.push(last + 1);
    else if (n - last > 2) out.push('…');
    out.push(n);
    last = n;
  }
  return out;
});
const go = (p: number) => (page.value = Math.min(props.total, Math.max(1, p)));
</script>

<template>
  <p class="status" aria-live="polite">
    Mostrando {{ (page - 1) * perPage + 1 }}–{{ Math.min(page * perPage, count) }} de {{ count }} resultados
  </p>
  <nav class="pager" aria-label="Paginación">
    <button class="pg" type="button" aria-label="Página anterior" :aria-disabled="page === 1" @click="go(page - 1)">
      <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15 6l-6 6 6 6" /></svg><span class="txt">Anterior</span>
    </button>
    <ul>
      <template v-for="(n, i) in pages" :key="n === '…' ? `gap-${i}` : n">
        <li v-if="n === '…'" class="gap" aria-hidden="true">…</li>
        <li v-else>
          <button class="pg" type="button" :aria-label="`Página ${n}`" :aria-current="n === page ? 'page' : undefined" @click="go(n)">
            {{ n }}
          </button>
        </li>
      </template>
    </ul>
    <button class="pg" type="button" aria-label="Página siguiente" :aria-disabled="page === total" @click="go(page + 1)">
      <span class="txt">Siguiente</span><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 6l6 6-6 6" /></svg>
    </button>
  </nav>
</template>

<style scoped>
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.status { margin:0 0 16px; text-align:center; color:var(--muted); font:14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; font-variant-numeric:tabular-nums; }
.pager { display:flex; align-items:center; justify-content:center; gap:8px; font:14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color:var(--text); }
.pager ul { display:flex; align-items:center; gap:4px; margin:0; padding:0; list-style:none; }
.pg { display:inline-flex; align-items:center; justify-content:center; gap:4px; min-width:36px; height:36px; padding:0 12px; font:inherit; font-weight:500; font-variant-numeric:tabular-nums; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; transition:background .14s, border-color .14s, color .14s; }
.pg svg { width:16px; height:16px; fill:none; stroke:currentColor; stroke-width:2; stroke-linecap:round; stroke-linejoin:round; }
.pg:hover { border-color:var(--accent); color:var(--accent); }
.pg[aria-current] { background:var(--accent); border-color:var(--accent); color:var(--accent-ink); }
.pg[aria-disabled="true"] { opacity:.45; background:var(--surface); border-color:var(--border); color:var(--text); cursor:not-allowed; }
.gap { min-width:20px; text-align:center; color:var(--muted); }
@media (max-width:520px) {
  .pager, .pager ul { gap:2px; }
  .pg { min-width:30px; height:36px; padding:0 4px; }
  .txt { display:none; }
  .gap { min-width:14px; }
}
@media (prefers-reduced-motion:reduce) { .pg { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
