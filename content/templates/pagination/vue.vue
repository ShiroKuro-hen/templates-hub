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
      ← <span class="txt">Anterior</span>
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
      <span class="txt">Siguiente</span> →
    </button>
  </nav>
</template>

<style scoped>
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
.status { margin:0 0 18px; font:13px ui-monospace, monospace; color:#6b6258; }
.pager { display:flex; align-items:center; justify-content:center; gap:8px; font:14px/1.5 system-ui, sans-serif; color:#17130f; }
.pager ul { display:flex; align-items:center; gap:6px; margin:0; padding:0; list-style:none; }
.pg { min-width:40px; height:40px; padding:0 12px; font:inherit; font-weight:700; color:inherit; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; cursor:pointer; }
.pg:hover { background:#ffd84d; transform:translate(2px,2px); box-shadow:2px 2px 0 #17130f; }
.pg[aria-current] { background:#17130f; color:#fffdf8; }
.pg[aria-disabled="true"] { opacity:.45; box-shadow:none; transform:none; background:#fffdf8; cursor:not-allowed; }
.gap { min-width:20px; text-align:center; color:#6b6258; }
@media (max-width:520px) {
  .pager, .pager ul { gap:3px; }
  .pg { min-width:30px; height:36px; padding:0 4px; box-shadow:3px 3px 0 #17130f; }
  .txt { display:none; }
  .gap { min-width:14px; }
}
@media (prefers-reduced-motion:reduce) { .pg { transform:none !important; } }
</style>
