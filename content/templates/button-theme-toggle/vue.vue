<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from 'vue';

type Theme = 'light' | 'dark' | 'system';
const options: { value: Theme; label: string }[] = [
  { value: 'light', label: 'Claro' },
  { value: 'dark', label: 'Oscuro' },
  { value: 'system', label: 'Sistema' },
];
const theme = ref<Theme>('system');
const status = ref('Sigue la configuración del sistema.');
const mq = matchMedia('(prefers-color-scheme: dark)');

function apply() {
  const dark = theme.value === 'dark' || (theme.value === 'system' && mq.matches);
  document.documentElement.dataset.theme = dark ? 'dark' : 'light';
  status.value = theme.value === 'system'
    ? `Sigue la configuración del sistema: ahora en modo ${dark ? 'oscuro' : 'claro'}.`
    : `Modo ${dark ? 'oscuro' : 'claro'} activado.`;
}
watch(theme, apply);
mq.addEventListener('change', apply);
onBeforeUnmount(() => mq.removeEventListener('change', apply));
</script>

<template>
  <form class="card">
    <fieldset>
      <legend>Tema de la interfaz</legend>
      <p class="hint">Elige cómo se ve la aplicación en este dispositivo.</p>
      <div class="seg">
        <span class="thumb" aria-hidden="true" />
        <label v-for="o in options" :key="o.value">
          <input v-model="theme" type="radio" name="theme" :value="o.value" />
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <template v-if="o.value === 'light'"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></template>
            <path v-else-if="o.value === 'dark'" d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
            <template v-else><rect x="3" y="4" width="18" height="12" rx="2" /><path d="M8 20h8M12 16v4" /></template>
          </svg>
          {{ o.label }}
        </label>
      </div>
      <p class="status" role="status">{{ status }}</p>
    </fieldset>
  </form>
</template>

<style scoped>
.card{max-width:480px;padding:20px;background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);box-shadow:var(--shadow);color:var(--text);font:14px/1.5 system-ui,-apple-system,"Segoe UI",sans-serif}
fieldset{margin:0;padding:0;border:0;min-width:0}
legend{padding:0;font-size:16px;font-weight:600}
.hint{margin:2px 0 14px;color:var(--muted)}
.seg{position:relative;display:grid;grid-template-columns:repeat(3,1fr);padding:3px;background:var(--bg);border:1px solid var(--border);border-radius:var(--radius)}
.thumb{position:absolute;top:3px;bottom:3px;left:3px;width:calc((100% - 6px) / 3);box-sizing:border-box;border:1px solid transparent;border-radius:6px;box-shadow:var(--shadow);
       background:linear-gradient(var(--surface),var(--surface)) padding-box,linear-gradient(135deg,#22d3ee,#2f5bff) border-box;transition:transform .16s}
.seg:has([value=dark]:checked) .thumb{transform:translateX(100%)}
.seg:has([value=system]:checked) .thumb{transform:translateX(200%)}
.seg label{position:relative;display:flex;align-items:center;justify-content:center;gap:6px;padding:8px 6px;border-radius:6px;color:var(--muted);font-weight:500;cursor:pointer;transition:color .14s}
.seg label:hover,.seg label:has(:checked){color:var(--text)}
.seg label:has(:checked) svg{color:var(--accent)}
.seg label:has(:focus-visible){outline:2px solid var(--accent);outline-offset:2px}
.seg input{position:absolute;opacity:0;pointer-events:none}
.status{margin:12px 0 0;min-height:1.5em;color:var(--muted)}
@media (prefers-reduced-motion:reduce){*{transition:none!important}}
/* Tokens: ver pestaña HTML + CSS */
</style>
