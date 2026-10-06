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
.faq { display: grid; gap: 24px; max-width: 960px; margin: 0 auto; padding: 36px 20px; color: #17130f; font: 15px/1.55 system-ui, sans-serif; }
@media (min-width: 720px) { .faq { grid-template-columns: 1fr 1.7fr; gap: 40px; } }
h2 { margin: 0 0 8px; font-size: clamp(1.6rem, 4.5vw, 2.3rem); line-height: 1.1; letter-spacing: -.03em; }
.intro { margin: 0; color: #6b6258; }
.intro a { color: #17130f; font-weight: 600; }
.list { display: grid; gap: 12px; align-content: start; }
details { border: 2px solid #17130f; border-radius: 10px; background: #fffdf8; box-shadow: 4px 4px 0 #17130f; }
details[open] { background: #fff6d1; }
summary { display: flex; gap: 12px; align-items: center; justify-content: space-between; padding: 14px 16px; font-weight: 700; cursor: pointer; list-style: none; }
summary::-webkit-details-marker { display: none; }
summary:focus-visible { outline: 3px solid #ff5a36; outline-offset: 3px; border-radius: 8px; }
.plus { flex: none; width: 22px; height: 22px; transition: transform .2s; }
.plus path { stroke: #17130f; stroke-width: 2.5; stroke-linecap: round; }
details[open] .plus { transform: rotate(45deg); }
details p { margin: 0; padding: 0 16px 16px; color: #3d362e; max-width: 60ch; }
@media (prefers-reduced-motion: reduce) { .plus { transition: none; } }
</style>
