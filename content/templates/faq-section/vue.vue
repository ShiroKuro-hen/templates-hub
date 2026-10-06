<script setup lang="ts">
type Faq = { q: string; a: string };

withDefaults(defineProps<{ faqs?: Faq[]; title?: string; contactHref?: string }>(), {
  title: 'Preguntas frecuentes',
  contactHref: '#contacto',
  faqs: () => [
    { q: '¿Puedo probar Nimbo antes de pagar?', a: 'Sí. Tienes 14 días con todas las funciones y no pedimos tarjeta.' },
    { q: '¿Cuántas personas pueden usarlo?', a: 'El plan gratuito admite hasta 5 personas. En los de pago no hay límite.' },
    { q: '¿Puedo importar mis proyectos actuales?', a: 'Importa desde CSV o desde otras herramientas.' },
    { q: '¿Cómo cancelo mi suscripción?', a: 'Desde Ajustes, en Facturación. La cancelación es inmediata.' },
  ],
});
</script>

<template>
  <section class="faq" aria-labelledby="faq-title">
    <div>
      <h2 id="faq-title">{{ title }}</h2>
      <p class="intro">¿No encuentras tu duda? <a :href="contactHref">Escríbenos</a> y respondemos en menos de un día.</p>
    </div>
    <div class="list">
      <details v-for="(f, i) in faqs" :key="f.q" name="faq" :open="i === 0">
        <summary>
          {{ f.q }}
          <svg class="plus" viewBox="0 0 22 22" aria-hidden="true"><path d="M11 3v16M3 11h16" fill="none" /></svg>
        </summary>
        <p>{{ f.a }}</p>
      </details>
    </div>
  </section>
</template>

<style scoped>
.faq { display: grid; gap: 24px; max-width: 960px; margin: 0 auto; padding: 24px 0; color: var(--text); font: 14px/1.5 system-ui, -apple-system, "Segoe UI", sans-serif; }
@media (min-width: 720px) { .faq { grid-template-columns: 1fr 1.7fr; gap: 48px; } }
h2 { margin: 0 0 8px; font-size: clamp(1.6rem, 4.5vw, 2.2rem); font-weight: 700; line-height: 1.1; letter-spacing: -.025em; text-wrap: balance; }
.intro { margin: 0; color: var(--muted); }
.intro a { color: var(--accent); font-weight: 600; text-underline-offset: 3px; }
.list { display: grid; gap: 8px; align-content: start; }
details { position: relative; overflow: hidden; border: 1px solid var(--border); border-radius: var(--radius); background: var(--surface); transition: border-color .14s, box-shadow .14s; }
details:hover { border-color: var(--muted); }
details[open] { border-color: var(--accent); box-shadow: var(--shadow); }
details[open]::before { content: ""; position: absolute; inset: 0 auto 0 0; width: 3px; background: linear-gradient(180deg, #22d3ee, #2f5bff); }
summary { display: flex; gap: 12px; align-items: center; justify-content: space-between; padding: 14px 16px; font-weight: 600; cursor: pointer; list-style: none; }
summary::-webkit-details-marker { display: none; }
summary:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; border-radius: var(--radius); }
.plus { flex: none; width: 18px; height: 18px; color: var(--muted); transition: transform .16s; }
.plus path { stroke: currentColor; stroke-width: 2; stroke-linecap: round; }
details[open] .plus { transform: rotate(45deg); color: var(--accent); }
details p { margin: 0; padding: 0 16px 16px; color: var(--muted); max-width: 60ch; }
@media (prefers-reduced-motion: reduce) { .plus, details { transition: none; } }
/* Tokens: ver pestaña HTML + CSS */
</style>
