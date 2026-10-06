<script setup lang="ts">
import { computed, ref } from 'vue';

type Crumb = { label: string; href?: string }; // la última miga es la página actual
const props = withDefaults(defineProps<{ items: Crumb[]; maxVisible?: number }>(), { maxVisible: 4 });

const expanded = ref(false);
const collapse = computed(() => !expanded.value && props.items.length > props.maxVisible);
const hiddenCount = computed(() => props.items.length - (props.maxVisible - 1));
const visible = computed(() =>
  collapse.value ? [props.items[0], ...props.items.slice(hiddenCount.value + 1)] : props.items,
);
const isLast = (c: Crumb) => c === props.items[props.items.length - 1];
</script>

<template>
  <nav class="crumbs" aria-label="Migas de pan">
    <ol>
      <template v-for="(c, i) in visible" :key="c.label">
        <li v-if="collapse && i === 1">
          <button type="button" :aria-label="`Mostrar ${hiddenCount} niveles ocultos`" @click="expanded = true">…</button>
        </li>
        <li>
          <span v-if="isLast(c) || !c.href" :aria-current="isLast(c) ? 'page' : undefined">{{ c.label }}</span>
          <a v-else :href="c.href">{{ c.label }}</a>
        </li>
      </template>
    </ol>
  </nav>
</template>

<style scoped>
:focus-visible { outline:2px solid var(--accent); outline-offset:2px; }
.crumbs { padding:10px 14px; font:14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color:var(--text); background:var(--surface); border:1px solid var(--border); border-radius:var(--radius); box-shadow:var(--shadow); }
.crumbs ol { display:flex; flex-wrap:wrap; align-items:center; gap:4px 8px; margin:0; padding:0; list-style:none; }
.crumbs li { display:flex; align-items:center; gap:8px; }
.crumbs li + li::before { content:"/"; content:"/" / ""; color:var(--border); }
.crumbs a { color:var(--muted); text-decoration:none; border-radius:4px; transition:color .14s; }
.crumbs a:hover { color:var(--accent); text-decoration:underline; text-underline-offset:3px; }
.crumbs [aria-current] { font-weight:600; padding-bottom:1px; background:linear-gradient(135deg,#22d3ee,#2f5bff) 0 100%/100% 2px no-repeat; }
.crumbs button { min-width:32px; padding:0 8px; font:inherit; color:var(--muted); background:var(--bg); border:1px solid var(--border); border-radius:var(--radius); cursor:pointer; transition:color .14s, border-color .14s; }
.crumbs button:hover { color:var(--accent); border-color:var(--accent); }
@media (prefers-reduced-motion:reduce) { .crumbs a, .crumbs button { transition:none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
