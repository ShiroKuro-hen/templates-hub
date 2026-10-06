<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue';

const tokens = [
  ['bg', 'Fondo'], ['surface', 'Superficie'], ['text', 'Texto'], ['muted', 'Atenuado'], ['border', 'Borde'],
  ['accent', 'Acento'], ['accent-soft', 'Acento suave'], ['accent-ink', 'Texto sobre acento'],
  ['ok', 'Ok'], ['warn', 'Aviso'], ['err', 'Error'], ['info', 'Info'],
  ['ok-soft', 'Ok suave'], ['warn-soft', 'Aviso suave'], ['err-soft', 'Error suave'], ['info-soft', 'Info suave'],
];
const hex = ref<Record<string, string>>({});
const read = () => {
  const cs = getComputedStyle(document.documentElement);
  hex.value = Object.fromEntries(tokens.map(([v]) => [v, cs.getPropertyValue(`--${v}`).trim().toUpperCase()]));
};
const mo = new MutationObserver(read); // el tema cambia vía data-theme
onMounted(() => {
  read();
  mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
});
onBeforeUnmount(() => mo.disconnect());
</script>

<template>
  <ul class="swatches" aria-label="Paleta Ion">
    <li v-for="[v, nombre] in tokens" :key="v" class="sw">
      <i :style="{ background: `var(--${v})` }" aria-hidden="true" />
      <div>
        <b>{{ nombre }}</b>
        <code>--{{ v }}</code>
        <span>{{ hex[v] }}</span>
      </div>
    </li>
  </ul>
</template>

<style scoped>
.swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 12px; margin: 0; padding: 0; list-style: none; font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
.sw { border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; background: var(--surface); box-shadow: var(--shadow); }
.sw i { display: block; height: 56px; border-bottom: 1px solid var(--border); }
.sw div { padding: 8px 10px; }
.sw b { display: block; font-weight: 600; }
.sw code { display: block; color: var(--muted); font: 12px ui-monospace, "Cascadia Code", Menlo, monospace; }
.sw span { display: block; font-size: 12px; font-variant-numeric: tabular-nums; }
/* Tokens: ver pestaña HTML + CSS */
</style>
