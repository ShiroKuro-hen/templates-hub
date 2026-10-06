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
:focus-visible { outline:3px solid #ff5a36; outline-offset:2px; }
.crumbs { padding:10px 14px; font:14px/1.5 system-ui, sans-serif; color:#17130f; background:#fffdf8; border:2px solid #17130f; border-radius:10px; box-shadow:4px 4px 0 #17130f; }
.crumbs ol { display:flex; flex-wrap:wrap; align-items:center; gap:4px 8px; margin:0; padding:0; list-style:none; }
.crumbs li { display:flex; align-items:center; gap:8px; }
.crumbs li + li::before { content:"/"; content:"/" / ""; color:#ff5a36; font:700 14px ui-monospace, monospace; }
.crumbs a { color:inherit; font-weight:600; text-underline-offset:3px; border-radius:4px; }
.crumbs a:hover { background:#ffd84d; }
.crumbs [aria-current] { padding:1px 8px; font-weight:700; background:#ffd84d; border:2px solid #17130f; border-radius:8px; }
.crumbs button { min-width:32px; padding:0 8px; font:700 14px/1.3 system-ui, sans-serif; background:#f6f1e7; border:2px solid #17130f; border-radius:8px; cursor:pointer; }
.crumbs button:hover { background:#ffd84d; }
</style>
