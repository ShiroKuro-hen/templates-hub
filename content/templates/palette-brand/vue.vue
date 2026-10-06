<script setup lang="ts">
const tokens = ['bg', 'surface', 'text', 'muted', 'accent', 'ok', 'warn', 'err'];
</script>

<template>
  <ul class="swatches" aria-label="Paleta de marca">
    <li v-for="t in tokens" :key="t" class="sw">
      <i :style="{ background: `var(--${t})` }" aria-hidden="true" />
      <span>--{{ t }}</span>
    </li>
  </ul>
</template>

<style scoped>
.swatches {
  --bg: #f6f1e7; --surface: #fffdf8; --text: #17130f; --muted: #6b6258;
  --border: #17130f; --accent: #ff5a36; --ok: #1f9d55; --warn: #e0a800; --err: #d6293e;
  display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px;
  list-style: none; margin: 0; padding: 20px;
  background: var(--bg); color: var(--text); font: 14px/1.4 system-ui, sans-serif;
}
@media (prefers-color-scheme: dark) {
  .swatches {
    --bg: #14110f; --surface: #1f1b18; --text: #f6f1e7; --muted: #a39a8e;
    --border: #f6f1e7; --accent: #ff7a59; --ok: #3ddc84; --warn: #ffd84d; --err: #ff6b7d;
  }
}
.sw { border: 2px solid var(--border); border-radius: 10px; overflow: hidden; background: var(--surface); }
.sw i { display: block; height: 64px; border-bottom: 2px solid var(--border); }
.sw span { display: block; padding: 6px 8px; font: 600 12px ui-monospace, monospace; }
</style>
