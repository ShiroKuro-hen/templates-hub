<script setup lang="ts">
type Feature = { icon: string; title: string; text: string }; // icon = contenido interno del <svg> (viewBox 24)

withDefaults(defineProps<{ title?: string; items?: Feature[] }>(), {
  title: 'Por qué Cuaderno',
  items: () => [
    { icon: '<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>', title: 'Arranca al instante', text: 'Abre tus notas en menos de un segundo.' },
    { icon: '<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>', title: 'Privado por defecto', text: 'Tus notas se cifran en tu dispositivo.' },
    { icon: '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>', title: 'Organiza por capas', text: 'Carpetas, etiquetas y vistas guardadas.' },
  ],
});
</script>

<template>
  <section>
    <h1>{{ title }}</h1>
    <ul>
      <li v-for="f in items" :key="f.title">
        <span class="ico"><svg viewBox="0 0 24 24" aria-hidden="true" v-html="f.icon" /></span>
        <div>
          <strong>{{ f.title }}</strong>
          <p>{{ f.text }}</p>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
section { font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; color: var(--text); }
h1 { margin: 0 0 16px; font-size: 1.15rem; font-weight: 600; letter-spacing: -.01em; }
ul { display: grid; gap: 12px; margin: 0; padding: 0; list-style: none; max-width: 460px; }
li { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: var(--surface); border: 1px solid var(--border); border-radius: var(--radius); box-shadow: var(--shadow); }
.ico { flex: none; display: grid; place-items: center; width: 36px; height: 36px; color: var(--accent); background: var(--accent-soft); border-radius: var(--radius); }
.ico svg { width: 20px; height: 20px; fill: none; stroke: currentColor; stroke-width: 2; stroke-linecap: round; stroke-linejoin: round; }
strong { display: block; font-weight: 600; }
p { margin: 2px 0 0; color: var(--muted); }
/* Tokens: ver pestaña HTML + CSS */
</style>
